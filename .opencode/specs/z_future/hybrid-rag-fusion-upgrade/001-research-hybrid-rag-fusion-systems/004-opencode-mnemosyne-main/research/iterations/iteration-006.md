## 1. WHEN TO USE

### When to Use This Skill

- **Why it matters for us**: Mnemosyne’s shortcut is robust and cheap, but it is a much shallower query-processing layer than Public’s current pipeline.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 3: The documented hybrid stack is conventional and useful, but only README-proven in this repo
- **Source**: [external/README.md:80](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L80), [external/README.md:82](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L82), [external/README.md:84](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L84), [external/README.md:85](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L85), [external/README.md:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L18)
- **What it does**: the README claims SQLite FTS5 with BM25, sqlite-vec cosine similarity, `snowflake-arctic-embed-m-v1.5`, and Reciprocal Rank Fusion, all local via ONNX Runtime with a one-time ~500 MB model download.
- **Why it matters for us**: the architecture is sensible and the model choice is notable, but this repo only proves that Public would be integrating against a backend contract, not source-verified ranking internals.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: Public already exceeds Mnemosyne’s hybrid retrieval depth by routing and fusing more channels before and after retrieval
- **Source**: [memory-search.ts:482](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482), [memory-search.ts:771](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L771), [hybrid-search.ts:973](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L973), [hybrid-search.ts:1006](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1006), [hybrid-search.ts:1094](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1094), [hybrid-search.ts:1221](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1221), [stage2-fusion.ts:21](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L21)
- **What it does**: Public routes queries across `vector`, `fts`, `bm25`, `graph`, and `degree` channels, then fuses them with adaptive weights, and then applies Stage 2 signals like session boost, recency, causal boost, co-activation, feedback, artifact routing, and validation scoring.
- **Why it matters for us**: Mnemosyne is not a search-mechanism upgrade over Public. Its value is thin-plugin ergonomics and scoped tool UX, not deeper ranking.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Public’s lexical and fallback behavior is materially richer than Mnemosyne’s visible surface
- **Source**: [bm25-index.ts:45](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts#L45), [sqlite-fts.ts:147](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L147), [hybrid-search.ts:445](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L445), [hybrid-search.ts:2101](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L2101), [vector-index-queries.ts:259](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts#L259)
- **What it does**: Public uses weighted FTS5 BM25 (`title` 10x, `trigger_phrases` 5x, etc.), maintains a separate in-memory BM25 path, computes cosine distance in sqlite-vec, and runs a 3-tier degradation chain from strict hybrid to wider hybrid to structural SQL fallback.
- **Why it matters for us**: for search quality and resilience, Public already implements the shortcuts and fallback behavior Mnemosyne’s wrapper leaves entirely to its opaque backend.
- **Recommendation**: reject
- **Impact**: high

### Finding 6: Mnemosyne’s genuinely new search-facing idea is simpler scoped tool ergonomics, not better ranking
- **Source**: [external/src/index.ts:27](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L27), [external/src/index.ts:78](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L78), [external/src/index.ts:171](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L171), [external/README.md:51](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L51), [external/package.json:4](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L4)
- **What it does**: project scope is derived from the current directory basename, project memory is auto-initialized on plugin load, global memory is lazily initialized on first write, and the tool surface makes project/global recall feel explicit and lightweight.
- **Why it matters for us**: if we borrow anything from Mnemosyne for search UX, it should be the simpler scoped entrypoints or aliases, not the backend search design. The main risk is basename-derived scope ambiguity and first-run model/binary friction.
- **Recommendation**: adopt now
- **Impact**: medium

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
- [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
- [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
- [sqlite-fts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts)
- [bm25-index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts)
- [query-router.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts)
- [vector-index-queries.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)

## Assessment
- New information ratio: 0.84
- Questions addressed: wrapper-visible ranking behavior, query preprocessing, FTS/BM25/vector contract, Public overlap, adaptive fusion depth, scope ergonomics, offline-first cost
- Questions answered: Mnemosyne’s wrapper proves only a thin search bridge; its hybrid ranking claims are README-level; Public already has deeper hybrid retrieval with query routing, lexical weighting, adaptive fusion, and fallback tiers; the most transferable search idea is simpler project/global memory tool ergonomics, not the backend retrieval stack; the exact strict validation command returned `RESULT: PASSED` with the warning `cannot create temp file for here document: Operation not permitted`

## Reflection
- What worked: reading `external/src/index.ts` before the README made it obvious where the real evidence boundary sits, then tracing directly into Public’s `memory_search`, `hybrid-search`, `sqlite-fts`, and pipeline stages exposed the search-depth gap quickly
- What did not work: the requested external path still referenced `external/opencode-mnemosyne-main`, but this checkout is rooted directly under `external/`; the workspace is read-only, so I could not update `research/research.md`, `checklist.md`, `implementation-summary.md`, or save memory for the phase

## Recommended Next Focus
MUTATION + RANKING TRACEABILITY: trace how Mnemosyne’s recall output IDs and plain-text result format would support contradiction-safe deletion, auditability, and score explainability compared with Public’s richer retrieval traces, session-scoped envelopes, and staged ranking metadata. Focus on whether a future external-binary facade needs an adapter layer that preserves Public-style provenance, score components, and safe mutation flows instead of returning opaque backend text.

RESEARCH BRIEF:
# $refine TIDD-EC Prompt: 004-opencode-mnemosyne-main

## 2. Role

You are a research specialist in hybrid search architectures (BM25 + vector embeddings), OpenCode plugin design, memory scoping patterns, and session compaction resilience. Work like a systems analyst who can separate TypeScript wrapper behavior from backend README claims, trace plugin lifecycle and hook wiring precisely, and translate OpenCode Mnemosyne's concrete design into practical improvements for `Code_Environment/Public`.

## 3. Task

Research OpenCode Mnemosyne's hybrid search architecture, plugin design patterns, and compaction survival strategies to identify practical, evidence-backed improvements for `Code_Environment/Public`, especially around combining text and vector search, OpenCode plugin integration, project-vs-global memory scoping, and preserving memory awareness across context compaction. Focus on what the external repo actually proves in `src/index.ts` and what the README describes about the Mnemosyne backend. Classify each recommendation as `adopt now`, `prototype later`, or `reject`.

## 4. Context

### 4.1 System Description

OpenCode Mnemosyne is an OpenCode plugin that wraps the Go-based Mnemosyne local memory backend. The external repo is intentionally thin: `src/index.ts` contains the plugin entry point, CLI bridge, tool registration, scope initialization, and the `experimental.session.compacting` hook, while `README.md` describes the backend's hybrid retrieval model and intended agent workflow. The documented retrieval stack combines full-text search (SQLite FTS5 with BM25 ranking) and vector search (sqlite-vec cosine similarity using `snowflake-arctic-embed-m-v1.5`), then fuses both with Reciprocal Rank Fusion. All inference is local, the ML model is downloaded on first use (~500 MB), and no cloud APIs are involved.

The plugin exposes five memory tools: `memory_recall`, `memory_recall_global`, `memory_store`, `memory_store_global`, and `memory_delete`. Project scope is derived from the current directory name and auto-initialized during plugin load; the global collection is initialized lazily on first global write. The wrapper shells out to the `mnemosyne` binary via `Bun.spawn`, quotes search strings to avoid FTS syntax issues, and injects compact memory-usage guidance into the compaction prompt so agents retain memory awareness after context resets.

### 4.2 Cross-Phase Awareness Table

| Phase | System | Core Pattern | Overlap Risk | Differentiation |
|-------|--------|-------------|-------------|-----------------|
| 001 | Engram | MCP memory server (Go, SQLite+FTS5) | 004 (FTS5 search) | Focus tool profiles, session lifecycle, topic keys |
| 002 | Mex | Markdown scaffold + drift detection | 004 (memory) | Focus drift detection, scaffold, no-DB approach |
| 003 | Modus Memory | FSRS spaced repetition + BM25 | 004 (BM25 search) | Focus FSRS decay, cross-referencing, query expansion |
| 004 | OpenCode Mnemosyne | Hybrid search (FTS5 + vector) | 001 (FTS5), 003 (BM25) | Focus vector search, plugin architecture, scoping |

### 4.3 What This Repo Already Has

`Code_Environment/Public` already has Spec Kit Memory with a hybrid vector/BM25 memory retrieval pipeline in `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, startup and resume flows in `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`, and CocoIndex for semantic code search through `.opencode/skill/mcp-coco-index/README.md`. It also already has a compaction-oriented transport plugin in `.opencode/plugins/spec-kit-compact-code-graph.js` that injects structural context during `experimental.session.compacting`.

What this repo does **not** currently have is an OpenCode memory plugin that wraps a standalone local binary, a first-class project/global tool pair with Mnemosyne's lightweight ergonomics, or a memory-specific compaction hook that injects tool-usage guidance directly into the compaction prompt. Do not repeat the outdated claim that Public lacks hybrid BM25+vector memory retrieval; compare Mnemosyne against the current code, not stale assumptions.

## 5. Instructions

1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main` as the pre-approved phase folder. Skip Gate 3, keep all writes inside this phase folder, and treat everything under `external/` as read-only.
2. Start with the plugin entry point: read `external/opencode-mnemosyne-main/src/index.ts` from top to bottom before the README. Confirm how the OpenCode plugin is declared, how `ctx.directory` / `ctx.worktree` are resolved, how project names are normalized, and where collection initialization happens.
3. Read `external/opencode-mnemosyne-main/package.json` immediately after `src/index.ts` to confirm packaging boundaries, plugin metadata, runtime assumptions, and whether the repo exposes any source beyond the wrapper.
4. Trace the shared `mnemosyne(...args)` bridge in `src/index.ts`: `Bun.spawn`, `cwd` selection, stdout/stderr handling, exit-code failure behavior, missing-binary fallback, and the security implication of passing argv arrays instead of interpolated shell strings.
5. Examine `memory_recall` and `memory_recall_global` in detail. Trace argument schemas, quoted search-string handling, project vs global flags, `--format plain`, and how the wrapper surfaces "No memories found" versus real backend output.
6. Examine `memory_store` and `memory_store_global` in detail. Trace write semantics, lazy creation of the global collection, project collection auto-init, and what these choices imply for memory scoping, onboarding friction, and failure modes.
7. Examine `memory_delete` in detail. Trace how document IDs are expected to flow from recall results into deletion, and what this says about memory lifecycle and hygiene expectations.
8. Examine the `experimental.session.compacting` hook implementation in `src/index.ts` line by line. Treat this as the most novel feature of the phase: capture exactly what guidance is injected, when it runs, and how that compares with Public's structural compaction plugin in `.opencode/plugins/spec-kit-compact-code-graph.js`.
9. Only after the wrapper analysis, read `external/opencode-mnemosyne-main/README.md`. Use it to extract hybrid-search claims, model choice, AGENTS.md guidance, offline-first positioning, and the stated project/global collection model. Distinguish clearly between wrapper-verified behavior and backend claims that are only documented here.
10. Treat the Mnemosyne backend as an interface contract, not an implementation you can prove from this repo. Infer the wrapper-visible backend verbs (`init`, `search`, `add`, `delete`) and the documented hybrid-search behavior, but do not fabricate internal Go ranking logic that is not present in the checked-out plugin repository.
11. Compare Mnemosyne directly against current `Code_Environment/Public` code: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` for existing hybrid retrieval, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` for session bootstrap/resume behavior, `.opencode/plugins/spec-kit-compact-code-graph.js` for compaction injection, and `.opencode/skill/mcp-coco-index/README.md` for semantic code-search positioning.
12. Resolve cross-phase boundaries explicitly. Do not redo phase `001` as generic FTS5 study or phase `003` as generic BM25 study. This phase owns wrapper-to-backend boundaries, vector-search implications, OpenCode plugin ergonomics, project/global scoping, AGENTS guidance, and memory-awareness compaction behavior.
13. Before deep research begins, ensure the phase folder contains the required Spec Kit docs for the chosen level. Validate the phase folder with:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict
    ```
14. After validation passes, run deep research using this exact topic:
    ```text
    Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main and identify concrete improvements for Code_Environment/Public, especially around hybrid search (BM25 + vector embeddings), OpenCode plugin architecture, memory scoping (project vs global), session compaction resilience, and offline-first memory design.
    ```
15. Save all outputs inside this phase folder, especially under `research/`. Every meaningful finding must cite exact file paths, say whether the evidence is wrapper-confirmed or README-level, explain why it matters for `Code_Environment/Public`, classify the recommendation as `adopt now`, `prototype later`, or `reject`, and identify the affected subsystem. When research is complete, update `checklist.md`, create `implementation-summary.md`, and save memory with:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main"
    ```

## 6. Research Questions

1. How is hybrid retrieval presented at the plugin boundary: what does the README claim about BM25, vector similarity, and Reciprocal Rank Fusion, and what parts of that pipeline are actually visible from the wrapper?
2. Why does Mnemosyne use `snowflake-arctic-embed-m-v1.5`, and what should `Code_Environment/Public` learn from that model choice even if Public already has other embedding-backed retrieval systems?
3. How effective is Mnemosyne's project-vs-global scope split, and would a similar ergonomic separation improve Public's memory-save and recall flows without duplicating existing scoped retrieval features?
4. What exactly does the compaction hook preserve, and how does prompt-level tool guidance differ from Public's current structural-context compaction transport?
5. What operational value comes from the plugin auto-initializing the project collection and lazily initializing the global collection, and what failure or ambiguity risks come with deriving the project key from the directory basename?
6. How should the README's AGENTS.md recommendation be interpreted as workflow guidance: is it merely usage advice, or does it reveal a reusable memory-discipline pattern for Public sessions?
7. Compared with CocoIndex's semantic code search, what is unique about Mnemosyne's hybrid memory retrieval story, and where should those systems stay separate rather than merged?
8. Compared with Public's current `memory_search` pipeline, which Mnemosyne ideas are already covered, which are partial overlaps, and which are genuinely new?
9. How does the OpenCode plugin lifecycle shape adoption compared with MCP-server-based memory systems: installation, runtime assumptions, binary dependency management, and tool exposure ergonomics?
10. What are the practical implications of the offline-first design, including local model download cost, first-run latency, privacy benefits, and failure handling when the binary or model is missing?

## 7. Do's

- Do trace the full wrapper lifecycle in `src/index.ts`, not just the README summary.
- Do separate wrapper-confirmed behavior from backend claims documented only in `README.md`.
- Do trace the hybrid-search narrative end to end as a contract: query entry, quoted search handoff, backend search call, and fused-ranking claims.
- Do study project and global scoping as product decisions, not just CLI flags.
- Do examine the compaction hook as the phase's highest-priority differentiator for `Code_Environment/Public`.
- Do compare against current Public files so the research reflects today's hybrid retrieval and compaction behavior.
- Do note where the external repo has no extra architecture files or AGENTS file, and treat that absence as evidence about how thin the wrapper really is.

## 8. Don'ts

- Do not spend most of the analysis on Mnemosyne's unseen Go internals; they are a dependency, not the plugin repo under study.
- Do not conflate the TypeScript wrapper with the backend search implementation. State clearly when a claim is README-level rather than source-proven.
- Do not ignore the compaction hook; it is the most novel and transferable feature for `Code_Environment/Public`.
- Do not claim Public lacks hybrid BM25+vector memory retrieval when `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` already proves otherwise.
- Do not try to run the system unless the binary and model are already installed; static analysis is sufficient for this phase, and first-run model download is large.
- Do not collapse this phase into generic FTS5 or BM25 discussion already owned by phases `001` and `003`.
- Do not edit anything under `external/` or outside this phase folder.

## 9. Examples

### Example A: Hybrid-search contract finding

```text
**Finding: Hybrid retrieval is a documented backend contract, not a wrapper-owned algorithm**
- Source: external/opencode-mnemosyne-main/README.md; external/opencode-mnemosyne-main/src/index.ts
- What it does: The README states that Mnemosyne combines SQLite FTS5/BM25 and sqlite-vec cosine similarity with Reciprocal Rank Fusion, while the wrapper simply forwards quoted search queries to `mnemosyne search`.
- Why it matters: Public should not copy README marketing language into implementation plans without deciding whether the value lies in ranking math, wrapper ergonomics, or agent-facing tool guidance.
- Recommendation: prototype later
- Affected area: Spec Kit Memory retrieval positioning, future plugin or wrapper design
- Risk/cost: Medium; backend behavior is not directly inspectable from this repo
```

### Example B: Compaction-resilience finding

```text
**Finding: Memory-tool awareness survives compaction through prompt injection**
- Source: external/opencode-mnemosyne-main/src/index.ts; .opencode/plugins/spec-kit-compact-code-graph.js
- What it does: Mnemosyne appends a compact memory-usage instruction block during `experimental.session.compacting`, while Public's existing compaction plugin injects structural transport context rather than memory-tool reminders.
- Why it matters: Public may already preserve structural state across compaction, but it does not yet remind the agent of concrete memory tools in the same direct way.
- Recommendation: adopt now or prototype later, depending on desired runtime surface
- Affected area: compaction strategy, startup guidance, memory-tool ergonomics
- Risk/cost: Low to medium; prompt noise and duplicate instruction handling must be designed carefully
```

## 10. Constraints

### 10.1 Error handling

- If a claim is only present in the README and not in `src/index.ts`, label it as documented behavior, not source-confirmed implementation.
- If current `Code_Environment/Public` behavior contradicts the phase brief, correct the comparison to match the code.
- If the external repo structure differs from the assumed paths, preserve the same analytical order and document the actual files used.
- If a recommendation depends on backend internals that are not visible here, mark that gap explicitly instead of guessing.

### 10.2 Scope

**IN SCOPE**

- OpenCode plugin entry point and lifecycle
- CLI bridge design and error handling
- five memory tools and their ergonomics
- project/global scoping model
- documented hybrid search contract
- AGENTS.md integration guidance from the README
- compaction-hook behavior and comparison with Public
- offline-first operational tradeoffs

**OUT OF SCOPE**

- reverse-engineering the unseen Mnemosyne Go ranking internals
- generic TypeScript style commentary
- plugin publishing workflow details
- broad FTS5 or BM25 primers already covered by other phases
- speculative replacement of Public's existing retrieval stack without evidence

### 10.3 Prioritization framework

Rank findings in this order: compaction-resilience leverage, fit with Public's current hybrid retrieval stack, clarity of wrapper-vs-backend boundary, usefulness of project/global scoping ergonomics, offline-first operational value, implementation cost, and clean differentiation from phases `001` and `003`.

## 11. Deliverables

- `phase-research-prompt.md` present and tailored specifically to `004-opencode-mnemosyne-main`
- `research/research.md` as the canonical report with at least 5 evidence-backed findings
- explicit comparison against current Public files for hybrid retrieval, session recovery, compaction injection, and CocoIndex positioning
- each finding labeled `adopt now`, `prototype later`, or `reject`
- each finding states whether evidence is wrapper-confirmed, README-documented, or both
- `implementation-summary.md` created at the end
- memory saved from this phase folder using `generate-context.js`

Minimum finding schema:

- finding title
- exact source evidence
- evidence type: wrapper-confirmed / README-documented / both
- what OpenCode Mnemosyne does
- why it matters for `Code_Environment/Public`
- recommendation: `adopt now`, `prototype later`, or `reject`
- affected subsystem
- migration, ambiguity, or validation risk

## 12. Evaluation Criteria

- CLEAR target: `>= 40/50`
- RICCE compliance is visible in the prompt:
  - **Role** is specialized in hybrid search, plugin architecture, scoping, and compaction resilience
  - **Instructions** are ordered, concrete, path-specific, and start with the plugin entry point
  - **Context** is domain-specific, cross-phase aware, and corrected to match current Public capabilities
  - **Constraints** clearly separate wrapper evidence from README-level claims
  - **Examples** show strong Mnemosyne-derived findings about hybrid search contracts and compaction hooks
- at least 5 findings are evidence-backed rather than generic
- cross-phase overlap with `001` and `003` is resolved explicitly
- findings compare Mnemosyne with current Public hybrid retrieval and compaction behavior rather than a stale baseline
- project/global scoping, AGENTS guidance, offline-first tradeoffs, and compaction survival are all covered directly

## 13. Completion Bar

The phase is only complete when all of the following are true:

- the reading order started with `src/index.ts`, then `package.json`, then the five tools, then the compaction hook, then `README.md`
- the exact validation command was used for this phase folder
- the exact deep-research topic string appears in the work
- `research/research.md` contains at least 5 evidence-backed findings
- each finding distinguishes wrapper-confirmed behavior from README-documented claims where needed
- `checklist.md` is updated with evidence and completion marks
- `implementation-summary.md` exists
- memory is saved successfully for `004-opencode-mnemosyne-main`
- no edits were made outside the phase folder
- overlap with phases `001` and `003` is explicitly bounded

OUTPUT FORMAT (MANDATORY - follow this exactly):
# Iteration 006: MEMORY HYGIENE

## Focus
MEMORY HYGIENE: Deduplication, upserts, revision tracking, garbage collection, soft deletes, topic key stability.

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
I’m treating this as a read-only deep-research pass focused on memory hygiene, and I’m starting by tracing the external wrapper source itself before comparing it to Public’s current memory lifecycle code.
exec
/bin/zsh -lc 'pwd && rg -n "mnemosyne|memory hygiene|dedup|revision|soft delete|garbage|topic key|upsert" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
965:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for command-surface/doc parity work in this checkout family, but re-verify command names/counts on each new packet revision
1094:- Ground-truth remap uses read-only DB scan + atomic JSON write + hard_negative skip + dedupe by `file_path::title` [Task 2]
1223:- release-ready checklist, shared_space_upsert, SPECKIT_SHARED_MEMORY_ADMIN_USER_ID, CHECKPOINT_SCOPE_UNSUPPORTED
1457:## Task 2: Restore/verify Phase 016 runtime/docs (dedup, projectPhase, trigger filter, retry health, contextType)
1467:- VALID_CONTEXT_TYPES, filterTriggerPhrases, retryHealthSnapshot, SPECKIT_PRE_SAVE_DEDUP, dedupeObservationsByNarrative, js-yaml
1480:## Task 4: Cleanup stateless terminology to captured-session and align handler dedup tests
1503:- Phase 016 regression checks should include trigger filter export coverage, retry-health snapshot behavior, contextType passthrough, and pre-save dedup docs/tests [Task 2]
1504:- Handler dedup-path tests require realistic harness inputs (1024-d embedding and branch-specific setup) [Task 4]
1510:- symptom: dedup-path test misses intended branch; cause: PE short-circuit or invalid mock embedding shape; fix: adjust harness to branch conditions [Task 4]

exec
/bin/zsh -lc "ls -R \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external\" | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
LICENSE
README.md
package-lock.json
package.json
src
tsconfig.json

/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src:
index.ts

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 2028ms:

───────────────────────────────────────────────────────────────

  Spec Folder Validation v2.0.0
───────────────────────────────────────────────────────────────


  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main
  Level:  1 (inferred)

───────────────────────────────────────────────────────────────


.opencode/skill/system-spec-kit/scripts/spec/validate.sh: line 406: cannot create temp file for here document: Operation not permitted

───────────────────────────────────────────────────────────────


  Summary: Errors: 0  Warnings: 0

  RESULT: PASSED


codex
I confirmed the external repo is just a thin wrapper with `src/index.ts` plus package metadata, which is useful here because it means we can separate wrapper-proven hygiene behavior from backend README claims very cleanly.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '1452,1488p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1452	
  1453	### keywords
  1454	
  1455	- --recovery, RECOVERY_MODE_REQUIRED, allowRecovery, generate-context.ts, loadCollectedData, workflow.ts
  1456	
  1457	## Task 2: Restore/verify Phase 016 runtime/docs (dedup, projectPhase, trigger filter, retry health, contextType)
  1458	
  1459	### rollout_summary_files
  1460	
  1461	- rollout_summaries/2026-03-22T10-20-47-OmwP-phase_016_json_mode_contexttype_fix.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/22/rollout-2026-03-22T11-20-47-019d150f-c1c3-77a1-99d7-4085806c27cb.jsonl, updated_at=2026-03-22T12:13:09+00:00, thread_id=019d150f-c1c3-77a1-99d7-4085806c27cb)
  1462	- rollout_summaries/2026-03-22T08-46-53-EZCT-phase_016_json_mode_review_fix.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/22/rollout-2026-03-22T09-46-53-019d14b9-caed-7de1-9985-8e18185cbdcf.jsonl, updated_at=2026-03-22T09:41:54+00:00, thread_id=019d14b9-caed-7de1-9985-8e18185cbdcf)
  1463	- rollout_summaries/2026-03-22T07-51-55-kUit-phase_016_review_fix.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/22/rollout-2026-03-22T08-51-55-019d1487-7640-7f72-bafb-21d06f452099.jsonl, updated_at=2026-03-22T09:41:18+00:00, thread_id=019d1487-7640-7f72-bafb-21d06f452099)
  1464	
  1465	### keywords
  1466	
  1467	- VALID_CONTEXT_TYPES, filterTriggerPhrases, retryHealthSnapshot, SPECKIT_PRE_SAVE_DEDUP, dedupeObservationsByNarrative, js-yaml
  1468	
  1469	## Task 3: Verify spec 011 refinement defaults and cursor/progressive-disclosure behavior
  1470	
  1471	### rollout_summary_files
  1472	
  1473	- rollout_summaries/2026-03-22T10-21-03-Dc6v-review_spec_011_hybrid_rag_refinement.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/22/rollout-2026-03-22T11-21-03-019d150f-ff8f-7340-8845-e3d582e7f2cb.jsonl, updated_at=2026-03-22T12:12:08+00:00, thread_id=019d150f-ff8f-7340-8845-e3d582e7f2cb)
  1474	- rollout_summaries/2026-03-22T07-03-12-KyXI-research_based_refinement_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/22/rollout-2026-03-22T08-03-12-019d145a-de98-7470-8c51-669cd6ae4cbe.jsonl, updated_at=2026-03-22T09:44:58+00:00, thread_id=019d145a-de98-7470-8c51-669cd6ae4cbe)
  1475	
  1476	### keywords
  1477	
  1478	- memory_search cursor, progressive-disclosure, requestQuality, SPECKIT_RESULT_CONFIDENCE_V1, memory-search-ux-hooks.vitest.ts
  1479	
  1480	## Task 4: Cleanup stateless terminology to captured-session and align handler dedup tests
  1481	
  1482	### rollout_summary_files
  1483	
  1484	- rollout_summaries/2026-03-21T16-05-01-Nzfa-captured_session_cleanup.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/21/rollout-2026-03-21T17-05-01-019d1124-8bd1-7430-9cd9-db1a32e7fe40.jsonl, updated_at=2026-03-21T16:34:05+00:00, thread_id=019d1124-8bd1-7430-9cd9-db1a32e7fe40)
  1485	- rollout_summaries/2026-03-21T11-13-10-e1Oa-perfect_session_capturing_review_2026_03.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/21/rollout-2026-03-21T12-13-10-019d1019-5c69-7c91-9faa-f9619a5417aa.jsonl, updated_at=2026-03-21T11:52:08+00:00, thread_id=019d1019-5c69-7c91-9faa-f9619a5417aa)
  1486	- rollout_summaries/2026-03-20T11-41-58-2chj-perfect_session_capturing_spec_realignment.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T12-41-58-019d0b0d-5dbd-7583-bb7f-002f4a036391.jsonl, updated_at=2026-03-20T13:14:22+00:00, thread_id=019d0b0d-5dbd-7583-bb7f-002f4a036391)
  1487	
  1488	### keywords

exec
/bin/zsh -lc "nl -ba \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts\" | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import path from "node:path";
     2	import { type Plugin, tool } from "@opencode-ai/plugin";
     3	
     4	export const MnemosynePlugin: Plugin = async (ctx) => {
     5	  const { directory, worktree, client } = ctx;
     6	  const targetDir = directory || worktree || process.cwd();
     7	
     8	  const log = {
     9	    debug: (msg: string) =>
    10	      client.app
    11	        .log({ body: { service: "mnemosyne", level: "debug", message: msg } })
    12	        .catch(() => {}),
    13	    info: (msg: string) =>
    14	      client.app
    15	        .log({ body: { service: "mnemosyne", level: "info", message: msg } })
    16	        .catch(() => {}),
    17	    warn: (msg: string) =>
    18	      client.app
    19	        .log({ body: { service: "mnemosyne", level: "warn", message: msg } })
    20	        .catch(() => {}),
    21	    error: (msg: string) =>
    22	      client.app
    23	        .log({ body: { service: "mnemosyne", level: "error", message: msg } })
    24	        .catch(() => {}),
    25	  };
    26	
    27	  // Strip trailing slashes but keep the root slash if it's just "/"
    28	  let projectDir = targetDir.replace(/(.+?)\/+$/, "$1");
    29	  const projectRaw = path.basename(projectDir);
    30	  const project = projectRaw === "global" ? "default" : (projectRaw || "default");
    31	
    32	  await log.debug(`Plugin loaded for project: ${project} (dir: ${targetDir})`);
    33	
    34	  /**
    35	   * Run the mnemosyne CLI binary gracefully using Bun.spawn.
    36	   * Avoids shell interpolation entirely by passing args as array.
    37	   */
    38	  async function mnemosyne(...args: string[]): Promise<string> {
    39	    await log.debug(`Executing: mnemosyne ${args.join(" ")}`);
    40	    try {
    41	      // @ts-ignore - Bun is globally available in opencode environment
    42	      const proc = Bun.spawn(["mnemosyne", ...args], {
    43	        cwd: targetDir,
    44	        stdout: "pipe",
    45	        stderr: "pipe",
    46	      });
    47	
    48	      const [stdout, stderr, exitCode] = await Promise.all([
    49	        new Response(proc.stdout).text(),
    50	        new Response(proc.stderr).text(),
    51	        proc.exited,
    52	      ]);
    53	
    54	      if (exitCode !== 0) {
    55	        await log.error(`Execution failed (code ${exitCode}): ${stderr}`);
    56	        throw new Error(stderr.trim() || `mnemosyne ${args[0]} failed`);
    57	      }
    58	
    59	      // mnemosyne may write output to stderr (older versions), use whichever has content
    60	      const output = stdout || stderr;
    61	      await log.debug(`Execution successful. Output size: ${output.length}`);
    62	      return output;
    63	    }
    64	    catch (e: unknown) {
    65	      await log.error(`Execution error: ${e instanceof Error ? e.stack : String(e)}`);
    66	      const msg = e instanceof Error ? e.message : String(e);
    67	      if (
    68	        msg.includes("not found") ||
    69	        msg.includes("ENOENT") ||
    70	        msg.includes("No such file")
    71	      ) {
    72	        return "Error: mnemosyne binary not found. Install it: https://github.com/gandazgul/mnemosyne#install";
    73	      }
    74	      throw e;
    75	    }
    76	  }
    77	
    78	  // Auto-init the project collection (idempotent).
    79	  try {
    80	    // @ts-ignore
    81	    await Bun.spawn(["mnemosyne", "init", "--name", project], {
    82	      cwd: targetDir,
    83	      stdout: "ignore", // Silence "collection already exists" logs
    84	      stderr: "pipe",   // Keep stderr for critical errors
    85	    }).exited;
    86	    await log.info(`Ensured collection exists: ${project}`);
    87	  }
    88	  catch (e) {
    89	    await log.warn(`Failed to auto-init collection: ${e}`);
    90	  }
    91	
    92	  return {
    93	    // ── Tools ──────────────────────────────────────────────
    94	
    95	    tool: {
    96	      memory_recall: tool({
    97	        description:
    98	          "Search project memory for relevant context, past decisions, and preferences. Use this at the start of conversations and whenever past context would help.",
    99	        args: {
   100	          query: tool.schema.string().describe("Semantic search query"),
   101	        },
   102	        async execute(args) {
   103	          await log.info(`Searching project memory for: ${args.query}`);
   104	          // Quote the query to prevent SQLite FTS errors with hyphens and special characters
   105	          const safeQuery = `"${args.query.replaceAll('"', '""')}"`;
   106	          const result = await mnemosyne(
   107	            "search",
   108	            "--name",
   109	            project,
   110	            "--format",
   111	            "plain",
   112	            safeQuery,
   113	          );
   114	          return result.trim() || "No memories found.";
   115	        },
   116	      }),
   117	
   118	      memory_recall_global: tool({
   119	        description:
   120	          "Search global memory for cross-project preferences, decisions and patterns.",
   121	        args: {
   122	          query: tool.schema.string().describe("Semantic search query"),
   123	        },
   124	        async execute(args) {
   125	          await log.info(`Searching global memory for: ${args.query}`);
   126	          const safeQuery = `"${args.query.replaceAll('"', '""')}"`;
   127	          const result = await mnemosyne(
   128	            "search",
   129	            "--global",
   130	            "--format",
   131	            "plain",
   132	            safeQuery,
   133	          );
   134	          return result.trim() || "No global memories found.";
   135	        },
   136	      }),
   137	
   138	      memory_store: tool({
   139	        description:
   140	          "Store a project memory: a decision, preference, or important context. One concise concept per memory. Set core=true for critical context that should always be available in every session (use sparingly).",
   141	        args: {
   142	          content: tool.schema.string().describe("Concise memory to store"),
   143	          core: tool.schema.boolean().optional().describe(
   144	            "If true, this memory is always injected into context (like AGENTS.md). Use sparingly."
   145	          ),
   146	        },
   147	        async execute(args) {
   148	          await log.info(`Storing project memory: ${args.content}`);
   149	          const cmdArgs = ["add", "--name", project];
   150	          if (args.core) {
   151	            cmdArgs.push("--tag", "core");
   152	          }
   153	          cmdArgs.push(args.content);
   154	          return (
   155	            await mnemosyne(...cmdArgs)
   156	          ).trim();
   157	        },
   158	      }),
   159	
   160	      memory_store_global: tool({
   161	        description:
   162	          "Store a cross-project memory: personal preferences, coding style, tool choices. Set core=true for critical cross-project context that should always be available.",
   163	        args: {
   164	          content: tool.schema.string().describe("Global memory to store"),
   165	          core: tool.schema.boolean().optional().describe(
   166	            "If true, this memory is always injected into context. Use sparingly."
   167	          ),
   168	        },
   169	        async execute(args) {
   170	          await log.info(`Storing global memory: ${args.content}`);
   171	          // Ensure the global collection exists.
   172	          try {
   173	            // @ts-ignore
   174	            await Bun.spawn(["mnemosyne", "init", "--global"], {
   175	              cwd: targetDir,
   176	              stdout: "ignore", // Silence "collection already exists" logs
   177	              stderr: "pipe",   // Keep stderr for critical errors
   178	            }).exited;
   179	            await log.info("Ensured global collection exists.");
   180	          }
   181	          catch (e) {
   182	            await log.warn(`Failed to auto-init global collection: ${e}`);
   183	          }
   184	          const cmdArgs = ["add", "--global"];
   185	          if (args.core) {
   186	            cmdArgs.push("--tag", "core");
   187	          }
   188	          cmdArgs.push(args.content);
   189	          return (await mnemosyne(...cmdArgs)).trim();
   190	        },
   191	      }),
   192	
   193	      memory_delete: tool({
   194	        description:
   195	          "Delete an outdated or incorrect memory by its document ID (shown in [brackets] in recall/list results).",
   196	        args: {
   197	          id: tool.schema.number().describe("Document ID to delete"),
   198	        },
   199	        async execute(args) {
   200	          await log.info(`Deleting memory document ID: ${args.id}`);
   201	          return (await mnemosyne("delete", String(args.id))).trim();
   202	        },
   203	      }),
   204	    },
   205	
   206	    // ── Hooks ──────────────────────────────────────────────
   207	
   208	    // Inject memory instructions into compaction so they survive
   209	    // context window resets.
   210	    "experimental.session.compacting": async (_input, output) => {
   211	      output.context.push(`## Persistent Memory (mnemosyne)
   212	
   213	You have persistent memory tools: memory_recall, memory_store, memory_delete,
   214	memory_recall_global, memory_store_global.
   215	
   216	When to use memory:
   217	- Search memory when past context would help answer the user's request.
   218	- Store concise summaries of important decisions, preferences, and patterns.
   219	- Delete outdated memories when new decisions contradict them.
   220	- Use **core** for facts that should always be in context (project architecture, key conventions, user preferences).
   221	- Use **global** variants for cross-project preferences (coding style, tool choices).
   222	- At the end of a session, store any relevant memories for future sessions.`);
   223	    },
   224	  };
   225	};

exec
/bin/zsh -lc "nl -ba \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json\" | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	{
     2	  "name": "opencode-mnemosyne",
     3	  "version": "0.2.4",
     4	  "description": "OpenCode plugin for local persistent memory using Mnemosyne — offline semantic search, no cloud required",
     5	  "type": "module",
     6	  "main": "dist/index.js",
     7	  "types": "dist/index.d.ts",
     8	  "scripts": {
     9	    "build": "tsc",
    10	    "dev": "tsc --watch",
    11	    "typecheck": "tsc --noEmit",
    12	    "ci": "tsc --noEmit && tsc"
    13	  },
    14	  "keywords": [
    15	    "opencode",
    16	    "opencode-plugin",
    17	    "mnemosyne",
    18	    "memory",
    19	    "local",
    20	    "offline",
    21	    "semantic-search",
    22	    "ai",
    23	    "coding-agent"
    24	  ],
    25	  "author": "gandazgul",
    26	  "license": "MIT",
    27	  "repository": {
    28	    "type": "git",
    29	    "url": "git+https://github.com/gandazgul/opencode-mnemosyne.git"
    30	  },
    31	  "dependencies": {
    32	    "@opencode-ai/plugin": "^1.2.24"
    33	  },
    34	  "devDependencies": {
    35	    "@types/node": "^25.4.0",
    36	    "typescript": "^5.9.3"
    37	  },
    38	  "opencode": {
    39	    "type": "plugin"
    40	  },
    41	  "files": [
    42	    "dist"
    43	  ]
    44	}

codex
I’ve got the wrapper entrypoint now. Next I’m tracing exactly where hygiene semantics stop at the plugin boundary and where Public already goes deeper on dedup, update safety, and lifecycle management.
exec
/bin/zsh -lc "nl -ba \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md\" | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	# opencode-mnemosyne
     2	
     3	OpenCode plugin for **local persistent memory** using [Mnemosyne](https://github.com/gandazgul/mnemosyne). Gives your AI coding agent memory that persists across sessions -- entirely offline, no cloud APIs.
     4	
     5	This is the local/offline alternative to cloud-based memory plugins like opencode-supermemory.
     6	
     7	## Prerequisites
     8	
     9	Install the mnemosyne binary first:
    10	
    11	```bash
    12	# From source (requires Go 1.21+, GCC, Task)
    13	git clone https://github.com/gandazgul/mnemosyne.git
    14	cd mnemosyne
    15	task install
    16	```
    17	
    18	See the [mnemosyne README](https://github.com/gandazgul/mnemosyne#quick-start) for detailed setup instructions. On first use, mnemosyne will automatically download its ML models (~500 MB one-time).
    19	
    20	## Install
    21	
    22	Add to your `opencode.json`:
    23	
    24	```json
    25	{
    26	  "$schema": "https://opencode.ai/config.json",
    27	  "plugin": ["opencode-mnemosyne"]
    28	}
    29	```
    30	
    31	That's it. OpenCode will install the plugin automatically.
    32	
    33	## What it does
    34	
    35	### Tools
    36	
    37	The plugin registers five tools available to the AI agent:
    38	
    39	| Tool | Description |
    40	|------|-------------|
    41	| `memory_recall` | Search project memory for relevant context and past decisions |
    42	| `memory_recall_global` | Search global memory for cross-project preferences |
    43	| `memory_store` | Store a project-scoped memory (optionally as `core`) |
    44	| `memory_store_global` | Store a cross-project memory (optionally as `core`) |
    45	| `memory_delete` | Delete an outdated memory by its document ID |
    46	
    47	### Hooks
    48	
    49	- **`experimental.session.compacting`** -- Injects memory tool instructions into the compaction prompt so the agent retains awareness of its memory capabilities across context window resets.
    50	
    51	### Memory scoping
    52	
    53	| Scope | Collection | Persists across |
    54	|-------|-----------|-----------------|
    55	| Project | `<directory-name>` | Sessions in the same project |
    56	| Global | `global` | All projects |
    57	| Core (project) | `<directory-name>` (tagged `core`) | Sessions + survives compaction |
    58	| Core (global) | `global` (tagged `core`) | All projects + survives compaction |
    59	
    60	The project collection is auto-initialized when the plugin loads. The global collection is created on first use of `memory_store_global`.
    61	
    62	## AGENTS.md (recommended)
    63	
    64	For best results, add this to your project or global `AGENTS.md` so the agent uses memory proactively from the start of each session:
    65	
    66	```markdown
    67	## Memory (mnemosyne)
    68	
    69	- At the start of a session, use memory_recall and memory_recall_global to search for context
    70	  relevant to the user's first message.
    71	- After significant decisions, use memory_store to save a concise summary.
    72	- Delete contradicted memories with memory_delete before storing updated ones.
    73	- Use memory_recall_global / memory_store_global for cross-project preferences.
    74	- Mark critical, always-relevant context as core (core=true) — but use sparingly.
    75	- When you are done with a session, store any memories that you think are relevant
    76	  to the user and the project. This will help you recall important information in
    77	  future sessions.
    78	```
    79	
    80	## How it works
    81	
    82	Mnemosyne is a local document store with hybrid search:
    83	- **Full-text search** (SQLite FTS5, BM25 ranking)
    84	- **Vector search** (sqlite-vec, cosine similarity with snowflake-arctic-embed-m-v1.5)
    85	- **Reciprocal Rank Fusion** combines both for best results
    86	
    87	All ML inference runs locally via ONNX Runtime. Your memories never leave your machine.
    88	
    89	## Development
    90	
    91	This project uses standard Node.js tools: `npm` for package management and `tsc` (TypeScript compiler) for building.
    92	
    93	```bash
    94	# Install dependencies
    95	npm install
    96	
    97	# Build the project
    98	npm run build
    99	
   100	# Start the compiler in watch mode for development
   101	npm run dev
   102	
   103	# Run TypeScript checks
   104	npm run typecheck
   105	```
   106	
   107	## License
   108	
   109	MIT

exec
/bin/zsh -lc "rg -n \"experimental\\.session\\.compacting|compact|memory_recall|memory_store|memory_delete|context\\.push|memory awareness|Persistent Memory\" .opencode/plugins/spec-kit-compact-code-graph.js .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:439:  const compactStructuredResult = (
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:593:        const compacted = compactStructuredResult(innerEnvelope, currentResults, contentArr);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:594:        if (compacted) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:596:            result: compacted.result,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:599:              actualTokens: compacted.actualTokens,
.opencode/plugins/spec-kit-compact-code-graph.js:36:const PLUGIN_ID = 'spec-kit-compact-code-graph';
.opencode/plugins/spec-kit-compact-code-graph.js:44:const BRIDGE_PATH = fileURLToPath(new URL('./spec-kit-compact-code-graph-bridge.mjs', import.meta.url));
.opencode/plugins/spec-kit-compact-code-graph.js:77: *   compaction?: TransportBlock,
.opencode/plugins/spec-kit-compact-code-graph.js:296:      spec_kit_compact_code_graph_status: tool({
.opencode/plugins/spec-kit-compact-code-graph.js:297:        description: 'Show Spec Kit compact code graph plugin cache status',
.opencode/plugins/spec-kit-compact-code-graph.js:396:    'experimental.session.compacting': async (input, output) => {
.opencode/plugins/spec-kit-compact-code-graph.js:406:      const block = plan?.compaction;
.opencode/plugins/spec-kit-compact-code-graph.js:416:      output.context.push(rendered);

exec
/bin/zsh -lc "rg -n \"dedup|upsert|revision|soft delete|archive|deleteAfter|retention|triggerPhrases|content_hash|supersedes|contradicts|memory_delete|memory_update|memory_save|duplicate|hash|title\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/scripts/dist/memory | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.d.ts:3:type RemovalReason = 'empty_or_invalid' | 'sanitizer' | 'canonical_duplicate' | 'title_overlap';
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.d.ts:13:    duplicateOf?: string;
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.d.ts:18:    title: string;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:112:// T001-T004: Session deduplication
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1789:    // T001-T004: Session deduplication module
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:2:title: SPECKIT Environment Variable Reference
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:225:| `SPECKIT_RECONSOLIDATION` | `true` | boolean | Reconsolidation-on-save for memory deduplication (TM-06). Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:226:| `SPECKIT_ASSISTIVE_RECONSOLIDATION` | `true` | boolean | Assistive reconsolidation for near-duplicate detection (REQ-D4-005). Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:285:| `SPECKIT_SESSION_RETRIEVAL_STATE_V1` | `true` | boolean | Cross-turn retrieval session state for dedup and goal-aware refinement (REQ-D5-006). Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/scripts/dist/memory/ast-parser.d.ts:5:    title: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:16:  upsertSharedMembership,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:17:  upsertSharedSpace,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:31:type SharedSpaceAdminTool = 'shared_space_upsert' | 'shared_space_membership_set';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:285:    operation: 'space_upsert' | 'membership_set';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:353:        ? 'Create the space first with shared_space_upsert.'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:374:  tool: 'shared_space_upsert' | 'shared_space_membership_set' | 'shared_memory_status' | 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:454:        tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:461:      tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:496:              operation: 'space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:505:              msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:517:          operation: 'space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:526:          msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:544:        upsertSharedSpace(db, definition);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:551:          upsertSharedSpace(db, definition);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:556:        upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:576:        operation: 'space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:598:      return createSharedSpaceAuthError('shared_space_upsert', result.error, result.msg);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:602:      tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:621:      'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:622:      'Shared space upsert failed',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:695:      upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js:85:  --include-archive    Include z_archive trees (default: excluded)
.opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js:92:  node backfill-frontmatter.js --dry-run --include-archive
.opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js:122:        if (arg === '--include-archive') {
.opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js:234:    const deduped = new Map();
.opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js:238:            if (!deduped.has(realPath)) {
.opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js:239:                deduped.set(realPath, root);
.opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js:243:            if (error instanceof Error && !deduped.has(root)) {
.opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js:244:                deduped.set(root, root);
.opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js:247:            if (!deduped.has(root)) {
.opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js:248:                deduped.set(root, root);
.opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js:252:    return Array.from(deduped.values()).sort();
.opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js:309:                if (!includeArchive && normalized.includes('/z_archive/')) {
.opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js:425:    const deduped = Array.from(new Set(allTargets.map((entry) => path.resolve(entry)))).sort();
.opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js:429:    for (const filePath of deduped) {
.opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js:458:                    title: result.managed.title,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:9:/** Arguments for the memory_delete handler. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:11:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:12:// Feature catalog: Memory metadata update (memory_update)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:13:// Feature catalog: Single and folder delete (memory_delete)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:22:/** Arguments for the memory_update handler. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:25:  title?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:26:  triggerPhrases?: string[];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:67:/** Snapshot of a memory's hash state for mutation tracking. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:70:  content_hash: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:76:type CrudMutationType = 'create' | 'update' | 'delete' | 'merge' | 'archive' | 'restore' | 'reindex';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:230:  const deduplicatedPaths: string[] = [];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:232:  let duplicatePathCount = 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:236:      duplicatePathCount++;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:241:    deduplicatedPaths.push(normalizedPath);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:244:  paths = deduplicatedPaths;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:264:      ...(duplicatePathCount > 0 ? { duplicatePathCount } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:270:      ...(duplicatePathCount > 0
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:271:        ? ['Duplicate input paths were deduplicated before queueing']
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:82:    throw new Error(`Bulk delete of "${tier}" tier requires specFolder scope for safety. Use memory_delete for individual deletions.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:184:  let selectSql = 'SELECT id, content_hash, file_path, spec_folder FROM memory_index WHERE importance_tier = ?';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:199:    content_hash: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:54:  title: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:70:  title: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:158:  memoryInfo: { filePath: string; title: string | null; triggerPhrases: string[] },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:449:        title: r.title,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:450:        triggerPhrases: r.matchedPhrases
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:457:        title: r.title,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:483:      title: r.title,
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:98:        title: m.title ?? 'Untitled',
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:119:        title: m.title,
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:167:        title: m.title,
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:181:    const archivedCount = allFolders.filter((f) => f.isArchived).length;
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:190:            activeFolders: folderMap.size - archivedCount,
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:191:            archivedFolders: archivedCount,
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:227:        if (arg === '--show-archived') {
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:257:  --show-archived     Include archived folders in output
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:32:const handle_memory_delete = handleMemoryDelete;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:33:const handle_memory_update = handleMemoryUpdate;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:41:  handle_memory_delete,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:42:  handle_memory_update,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts:6:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:479:                    const allSpecs = available.filter((n) => core_1.SPEC_FOLDER_PATTERN.test(n) && !n.match(/^z_|archive/i))
.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:6:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:5:// from concrete sub-modules (./dedup, ./embedding-pipeline, etc.).
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:7:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:30:export { checkExistingRow, checkContentHashDedup } from './dedup.js';
.opencode/skill/system-spec-kit/scripts/dist/memory/ast-parser.js:34:            title: block.type === 'heading' ? extractHeadingTitle(block.content) : null,
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:104:function canonicalizeTitleKey(title) {
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:105:    return canonicalizePhraseKey(title).replace(/\b\d+\b/g, ' ').replace(/\s+/g, ' ').trim();
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:117:        && !normalized.includes('/memory/.archive');
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:124:        && !normalized.includes('/.archive');
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:217:                if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.archive')) {
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:306:    const titleSection = detection.sections.find((section) => section.key === 'title');
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:308:    const titleValue = titleSection ? (0, frontmatter_migration_1.parseSectionValue)(titleSection) : undefined;
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:310:    const title = typeof titleValue === 'string' ? titleValue : '';
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:311:    const triggerPhrases = Array.isArray(triggerValue)
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:315:        title,
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:316:        triggerPhrases,
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:320:function resolveTriggerPhrases(triggerPhrases, title) {
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:321:    const titleKey = canonicalizeTitleKey(title);
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:326:    for (const originalPhrase of triggerPhrases) {
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:349:                reason: 'canonical_duplicate',
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:350:                duplicateOf: seenCanonicalKeys.get(canonicalKey) || undefined,
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:354:        const titleOverlap = titleKey.length > 0
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:356:            && new RegExp(`(?:^| )${escapeRegex(canonicalKey)}(?:$| )`, 'i').test(titleKey);
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:357:        if (titleOverlap) {
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:360:                reason: 'title_overlap',
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:377:function hashTriggerPhrases(triggerPhrases) {
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:378:    return crypto.createHash('sha1').update(JSON.stringify(triggerPhrases)).digest('hex');
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:398:        canonical_duplicate: 0,
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:399:        title_overlap: 0,
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:405:            const resolution = resolveTriggerPhrases(parsed.triggerPhrases, parsed.title);
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:407:            const changed = rewrittenContent !== null && JSON.stringify(parsed.triggerPhrases) !== JSON.stringify(resolution.kept);
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:419:                title: parsed.title,
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:421:                originalCount: parsed.triggerPhrases.length,
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:426:                beforeTriggerPhrases: parsed.triggerPhrases,
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:429:                    beforeHash: hashTriggerPhrases(parsed.triggerPhrases),
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:430:                    afterHash: hashTriggerPhrases(resolution.kept),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:131:    const sql = `SELECT id, spec_folder, file_path, title, trigger_phrases, importance_weight, created_at, updated_at FROM memory_index ${whereClause} ORDER BY ${sortColumn} DESC LIMIT ? OFFSET ?`;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:149:    title: (row.title as string) || '(untitled)',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:28:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:34:  title: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:35:  triggerPhrases: string[];
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:51:  title: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:52:  triggerPhrases?: string[];
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:60:  content_hash?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:94:  'content_hash', 'context_type', 'importance_tier', 'memory_type',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:163:             title: parsed.title ?? '', message: 'Zero chunks retained after thinning' };
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:225:        title: parsed.title,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:226:        triggerPhrases: parsed.triggerPhrases,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:241:        content_hash: parsed.contentHash,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:272:    const chunkTitle = `${parsed.title || 'Untitled'} [chunk ${i + 1}/${retainedChunks.length}]`;
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:280:      // Provider on re-index — content-hash keyed so unchanged chunks skip API entirely.
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:312:            title: chunkTitle,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:313:            triggerPhrases: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:326:            title: chunkTitle,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:327:            triggerPhrases: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:342:          content_hash: parsed.contentHash,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:363:            title: chunkTitle,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:472:      title: parsed.title,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:473:      triggerPhrases: parsed.triggerPhrases,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:505:        SET content_hash = ?,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:535:        const archivePlaceholders = oldChildIds.map(() => '?').join(', ');
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:540:          WHERE id IN (${archivePlaceholders})
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:583:        title: parsed.title,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:584:        triggerPhrases: parsed.triggerPhrases,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:599:        title: parsed.title,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:601:        trigger_phrases: parsed.triggerPhrases,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:613:    reason: `memory_save: chunked indexing (${chunkResult.strategy}, ${chunkResult.chunks.length} chunks)`,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:618:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:628:    actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:640:    title: parsed.title,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:641:    triggerPhrases: parsed.triggerPhrases,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:18:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:41:    title: parsed.title ?? '',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:42:    triggerPhrases: parsed.triggerPhrases,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:65:    title: parsed.title ?? '',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:66:    triggerPhrases: parsed.triggerPhrases,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:10:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:11:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:97:  const observations: Array<{ title?: string; narrative?: string }> = [];
.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:120:        title: section.heading,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:153:        title: section.heading,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:168:    title: parsed.title,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:170:    triggerPhrases: parsed.triggerPhrases,
.opencode/skill/system-spec-kit/mcp_server/README.md:2:title: "Spec Kit Memory - MCP Server"
.opencode/skill/system-spec-kit/mcp_server/README.md:61:| **Causal relations** | 6 | caused, enabled, supersedes, contradicts, derived_from, supports |
.opencode/skill/system-spec-kit/mcp_server/README.md:74:| **Sessions** | Stateless | Working memory with attention decay, ~50% token savings via deduplication |
.opencode/skill/system-spec-kit/mcp_server/README.md:78:| **Save quality** | Accept everything | 3-layer gate (structure, semantic sufficiency, duplicate) with dry-run preview |
.opencode/skill/system-spec-kit/mcp_server/README.md:189:  "tool": "memory_save",
.opencode/skill/system-spec-kit/mcp_server/README.md:360:| **supersedes** | -- | B replaces A |
.opencode/skill/system-spec-kit/mcp_server/README.md:361:| **contradicts** | -- | A and B conflict |
.opencode/skill/system-spec-kit/mcp_server/README.md:398:| **SUPERSEDE** | New knowledge contradicts the old | New version active, old one demoted to deprecated |
.opencode/skill/system-spec-kit/mcp_server/README.md:402:**Reconsolidation-on-save** -- handles near-duplicates intelligently. Nearly identical content gets merged. Contradictions retire the old version. Different content keeps both. Like a filing clerk who reads the new document, checks the cabinet and makes an informed decision instead of just stuffing it in.
.opencode/skill/system-spec-kit/mcp_server/README.md:404:**Semantic sufficiency gating** -- rejects memories too thin or lacking real evidence. Short documents with strong structural signals (clear title, proper labels) get an exception.
.opencode/skill/system-spec-kit/mcp_server/README.md:416:**SHA-256 content-hash deduplication** -- recognizes unchanged files instantly and skips expensive reprocessing.
.opencode/skill/system-spec-kit/mcp_server/README.md:426:**Session deduplication** -- pushes down results you already saw. If you got a result 3 turns ago, new searches rank it lower. Saves approximately 50% of tokens on follow-up queries.
.opencode/skill/system-spec-kit/mcp_server/README.md:499:**Incremental indexing with content hashing** -- tracks SHA-256 hashes of every indexed file. Unchanged files get skipped instantly during scans.
.opencode/skill/system-spec-kit/mcp_server/README.md:507:**Phase 13 chunked-save finalization hardening** -- chunked saves now track the created parent and child IDs so finalization can stay transactional. Prediction-error supersede finalization records cross-path `supersedes` edges and marks predecessors superseded inside one transaction. Safe-swap updates now null old-child `parent_id` values before bulk delete inside that same finalization step, and any finalize failure triggers compensating cleanup that removes the staged replacement chunk tree. Parent BM25 mutation is delayed until at least one chunk succeeds and, for safe-swap updates, until finalization completes, which preserves the old parent BM25 state when all chunks fail.
.opencode/skill/system-spec-kit/mcp_server/README.md:578:| `sessionId` | string | Session ID for deduplication across turns |
.opencode/skill/system-spec-kit/mcp_server/README.md:624:The main search tool. You type what you are looking for in plain language and the system searches through all stored knowledge to find the best matches. It understands meaning (beyond keywords), so searching for "login problems" can find a document titled "authentication troubleshooting."
.opencode/skill/system-spec-kit/mcp_server/README.md:699:##### `memory_save`
.opencode/skill/system-spec-kit/mcp_server/README.md:710:| `retentionPolicy` | string | `keep` (default), `ephemeral`, `shared` |
.opencode/skill/system-spec-kit/mcp_server/README.md:711:| `deleteAfter` | string | ISO date for automatic deletion |
.opencode/skill/system-spec-kit/mcp_server/README.md:723:  "tool": "memory_save",
.opencode/skill/system-spec-kit/mcp_server/README.md:789:##### `memory_delete`
.opencode/skill/system-spec-kit/mcp_server/README.md:801:##### `memory_update`
.opencode/skill/system-spec-kit/mcp_server/README.md:803:Change a memory's title, keywords or importance without deleting and re-creating it. When you change the title, the search index updates automatically. If the update fails partway through, everything rolls back to the way it was before.
.opencode/skill/system-spec-kit/mcp_server/README.md:808:| `title` | string | Updated title |
.opencode/skill/system-spec-kit/mcp_server/README.md:809:| `triggerPhrases` | string[] | Updated trigger phrases |
.opencode/skill/system-spec-kit/mcp_server/README.md:891:##### `shared_space_upsert`
.opencode/skill/system-spec-kit/mcp_server/README.md:1004:| `relation` | string | **Required.** `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from` or `supports` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1100:| `force` | boolean | Re-index even if file hash unchanged |
.opencode/skill/system-spec-kit/mcp_server/README.md:1154:Scan workspace files and build the structural code graph index (functions, classes, imports, calls). Uses tree-sitter WASM for parsing with regex fallback. Supports incremental re-indexing via content hash. Use this explicitly when the graph is empty, when a read path reports `full_scan`, or when you want to rebuild more than the bounded inline refresh path will repair.
.opencode/skill/system-spec-kit/mcp_server/README.md:1247:| `handlers/memory-save.ts` | Runs the save pipeline: validates structure, checks dedup/quality gates, generates embeddings, and stores the result. |
.opencode/skill/system-spec-kit/mcp_server/README.md:1354:  "tool": "memory_save",
.opencode/skill/system-spec-kit/mcp_server/README.md:1361:**What happens**: File is validated, embedded and indexed. Returns memory ID, quality score and duplicate check results.
.opencode/skill/system-spec-kit/mcp_server/README.md:1501:  "tool": "shared_space_upsert",
.opencode/skill/system-spec-kit/mcp_server/README.md:1543:| Test a save without committing | `memory_save` | Set `dryRun: true` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1576:**Common causes**: Too little real content, missing required structure (headings, metadata) or semantic duplicate.
.opencode/skill/system-spec-kit/mcp_server/README.md:1581:{ "tool": "memory_save", "arguments": { "filePath": "/path/to/file.md", "dryRun": true } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1705:Yes, through shared memory. Call `shared_memory_enable`, create a space with `shared_space_upsert` and grant access with `shared_space_membership_set`. Spaces are deny-by-default and the first creator becomes owner. See [SHARED_MEMORY_DATABASE.md](../SHARED_MEMORY_DATABASE.md) for the full guide.
.opencode/skill/system-spec-kit/mcp_server/README.md:1721:**Q: What does the dryRun parameter do on memory_save?**
.opencode/skill/system-spec-kit/mcp_server/README.md:1723:A dry run validates the file against the quality gate, estimates the token budget, checks for duplicates and returns a report, all without writing anything to the database. Use it to verify a file will pass before committing.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:26:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:101:): { id: number; title: string | null; content_hash?: string | null } | undefined {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:109:    SELECT id, title, content_hash
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:135:  ) as { id: number; title: string | null; content_hash?: string | null } | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:184:          title: parsed.title,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:185:          triggerPhrases: parsed.triggerPhrases,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:199:          title: parsed.title,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:200:          triggerPhrases: parsed.triggerPhrases,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:216:      content_hash: parsed.contentHash,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:254:      actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:269:          title: parsed.title,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:271:          trigger_phrases: parsed.triggerPhrases,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:284:      recordHistory(memory_id, 'ADD', null, parsed.title ?? filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:289:          samePathExisting?.title ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:290:          parsed.title ?? filePath,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:291:          'mcp:memory_save',
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.d.ts:6:    title?: string;
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.d.ts:18:    title: string;
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.d.ts:32:    title: string;
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.d.ts:50:    title: string;
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.d.ts:67:        archivedFolders: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:141:        title: 'Session Health',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:147:        title: 'Quality Score',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:153:        title: 'Structural Context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:89:  deduplicateResults as deduplicateWithSessionState,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:145:  dedupStats: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:203:  includeArchived?: boolean; // REQ-206: include archived memories in search (default false)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:454:      dedupStats: { enabled: false, sessionId: null }
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:458:  const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, results as Parameters<typeof sessionManager.filterSearchResults>[1]);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:466:    dedupStats: {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:467:      ...dedupStats,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:520:    includeArchived: includeArchived = false, // REQ-206: exclude archived by default
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:833:              SELECT id, title, similarity, content, file_path, importance_tier, context_type,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1062:      const deduped = deduplicateWithSessionState(existingResults, sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1063:      data.results = deduped.results as SessionAwareResult[];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1064:      data.count = deduped.results.length;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1065:      data.sessionDedup = deduped.metadata;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1071:  // Apply session deduplication AFTER cache
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1079:        console.warn('[memory-search] Failed to parse cached response for dedup:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1086:    // P1-018 — Validate response shape before dedup. If the cached response
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1087:    // Doesn't have the expected data.results array, log a warning and skip dedup
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1088:    // Rather than silently falling through to the un-deduped response.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1095:      console.warn('[memory-search] Cached response shape mismatch: missing "data" object, skipping dedup');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1097:      console.warn('[memory-search] Cached response shape mismatch: "data.results" is not an array, skipping dedup');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1101:      const { results: dedupedResults } = applySessionDedup(
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1108:      const dedupedCount = dedupedResults.length;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1109:      const filteredCount = originalCount - dedupedCount;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1116:      data.results = dedupedResults;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1117:      data.count = dedupedCount;

codex
I’m drilling into Public’s mutation layer now, because the clearest hygiene comparison is likely “thin add/delete wrapper” versus “dedup + transactional update + history + retention + scoped cleanup.”
exec
/bin/zsh -lc "nl -ba .opencode/plugins/spec-kit-compact-code-graph.js | sed -n '396,430p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ────────────────────────────────────────────────────────────────
     2	// MODULE: Memory Crud
     3	// ────────────────────────────────────────────────────────────────
     4	
     5	import { handleMemoryDelete } from './memory-crud-delete.js';
     6	import { handleMemoryUpdate } from './memory-crud-update.js';
     7	import { handleMemoryList } from './memory-crud-list.js';
     8	import { handleMemoryStats } from './memory-crud-stats.js';
     9	import { handleMemoryHealth } from './memory-crud-health.js';
    10	import { setEmbeddingModelReady, isEmbeddingModelReady } from '../core/index.js';
    11	
    12	// Feature catalog: Memory browser (memory_list)
    13	// Feature catalog: System statistics (memory_stats)
    14	// Feature catalog: Health diagnostics (memory_health)
    15	
    16	
    17	/* ───────────────────────────────────────────────────────────────
    18	   EXPORTS
    19	──────────────────────────────────────────────────────────────── */
    20	
    21	export {
    22	  handleMemoryDelete,
    23	  handleMemoryUpdate,
    24	  handleMemoryList,
    25	  handleMemoryStats,
    26	  handleMemoryHealth,
    27	  setEmbeddingModelReady,
    28	  isEmbeddingModelReady,
    29	};
    30	
    31	// Backward-compatible aliases (snake_case) — remove after all callers migrate to camelCase
    32	const handle_memory_delete = handleMemoryDelete;
    33	const handle_memory_update = handleMemoryUpdate;
    34	const handle_memory_list = handleMemoryList;
    35	const handle_memory_stats = handleMemoryStats;
    36	const handle_memory_health = handleMemoryHealth;
    37	const set_embedding_model_ready = setEmbeddingModelReady;
    38	const is_embedding_model_ready = isEmbeddingModelReady;
    39	
    40	export {
    41	  handle_memory_delete,
    42	  handle_memory_update,
    43	  handle_memory_list,
    44	  handle_memory_stats,
    45	  handle_memory_health,
    46	  set_embedding_model_ready,
    47	  is_embedding_model_ready,
    48	};

exec
/bin/zsh -lc "rg -n \"recordHistory|supersedes|contradicts|retentionPolicy|deleteAfter|archived_at|includeArchived|content_hash|checkContentHashDedup|checkExistingRow|safe-swap|finalization|bulk delete|memory_update|memory_delete|soft delete|archive|restore\" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/db .opencode/skill/system-spec-kit/scripts/dist/memory | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
rg: .opencode/skill/system-spec-kit/mcp_server/db: No such file or directory (os error 2)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:36:  content_hash?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:485:  if (memory.content_hash) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:486:    hashInput = memory.content_hash;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:9:/** Arguments for the memory_delete handler. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:12:// Feature catalog: Memory metadata update (memory_update)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:13:// Feature catalog: Single and folder delete (memory_delete)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:22:/** Arguments for the memory_update handler. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:46:  includeArchived?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:70:  content_hash: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:76:type CrudMutationType = 'create' | 'update' | 'delete' | 'merge' | 'archive' | 'restore' | 'reindex';
.opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js:85:  --include-archive    Include z_archive trees (default: excluded)
.opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js:92:  node backfill-frontmatter.js --dry-run --include-archive
.opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js:122:        if (arg === '--include-archive') {
.opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js:309:                if (!includeArchive && normalized.includes('/z_archive/')) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:15:import { recordHistory } from '../lib/storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:44:  const restoreBarrier = checkpoints.getRestoreBarrierStatus();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:45:  if (restoreBarrier) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:48:      error: restoreBarrier.message,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:49:      code: restoreBarrier.code,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:55:        hint: 'Retry memory_bulk_delete after checkpoint_restore maintenance completes.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:56:        actions: ['Wait for the restore to finish', 'Retry the bulk delete request'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:82:    throw new Error(`Bulk delete of "${tier}" tier requires specFolder scope for safety. Use memory_delete for individual deletions.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:100:      error: 'Memory bulk delete aborted: database unavailable',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:152:          reason: `auto-checkpoint before bulk delete of ${affectedCount} "${tier}" memories`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:162:          throw new Error(`${checkpointError}. Aborting high-safety bulk delete.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:184:  let selectSql = 'SELECT id, content_hash, file_path, spec_folder FROM memory_index WHERE importance_tier = ?';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:199:    content_hash: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:215:          recordHistory(
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:224:          // History recording is best-effort inside bulk delete
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:281:    hints.push(`Restore with: checkpoint_restore({ name: "${checkpointName}" })`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:283:    hints.push('Checkpoint skipped: restore is not available for this operation');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:302:    data.restoreCommand = `checkpoint_restore({ name: "${checkpointName}" })`;
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-historical-json-mode-memories.js:179:    if (normalized.includes('/research/archive/')) {
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-historical-json-mode-memories.js:182:    if (normalized.includes('/memory/.archive')) {
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-historical-json-mode-memories.js:333:    const supersedesIndex = lines.findIndex((line) => line.trim() === 'supersedes:');
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-historical-json-mode-memories.js:334:    if (supersedesIndex === -1) {
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-historical-json-mode-memories.js:338:    for (let index = supersedesIndex + 1; index < lines.length; index += 1) {
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-historical-json-mode-memories.js:390:        supersedes: extractSupersedesEntries(content),
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-historical-json-mode-memories.js:499:    if (details.continuationPattern && parsed.supersedes.length === 0) {
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:181:    const archivedCount = allFolders.filter((f) => f.isArchived).length;
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:190:            activeFolders: folderMap.size - archivedCount,
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:191:            archivedFolders: archivedCount,
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:227:        if (arg === '--show-archived') {
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:257:  --show-archived     Include archived folders in output
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:32:const handle_memory_delete = handleMemoryDelete;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:33:const handle_memory_update = handleMemoryUpdate;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:41:  handle_memory_delete,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:42:  handle_memory_update,
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:479:                    const allSpecs = available.filter((n) => core_1.SPEC_FOLDER_PATTERN.test(n) && !n.match(/^z_|archive/i))
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:83:  includeArchived?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:447: * @param options - Optional limit, specFolder filter, and includeArchived flag.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:452:  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:459:  const { limit = DEFAULT_LIMIT, specFolder, includeArchived = false } = options;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:465:    // Filters: is_archived exclusion and spec_folder matching handled by fts5Bm25Search
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:466:    const bm25Results = fts5Bm25Search(db, query, { limit, specFolder, includeArchived });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:486: * @param options - Optional limit, specFolder filter, and includeArchived flag.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:491:  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:866:    includeArchived = false,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:879:        includeArchived,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:897:    const ftsResults = ftsSearch(query, { limit, specFolder, includeArchived });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1069:          includeArchived: options.includeArchived || false,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1808:    // H13 FIX: Exclude archived rows unless explicitly requested
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1810:      `(importance_tier IS NULL OR importance_tier NOT IN ('deprecated', 'archived'))`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1811:      `(is_archived IS NULL OR is_archived = 0)`
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:36:  retentionPolicy?: RetentionPolicy;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:37:  deleteAfter?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:53:  retentionPolicy: RetentionPolicy;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:54:  deleteAfter: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:207:    || input.retentionPolicy === 'ephemeral'
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:208:    || input.retentionPolicy === 'shared'
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:209:    || typeof input.deleteAfter === 'string';
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:222:  const deleteAfter = normalizeIsoTimestamp(input.deleteAfter) ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:223:  const retentionPolicy: RetentionPolicy = input.retentionPolicy === 'ephemeral' || input.retentionPolicy === 'shared'
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:224:    ? input.retentionPolicy
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:243:        retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:244:        deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:255:  if (deleteAfter && new Date(deleteAfter).getTime() <= new Date(governedAt).getTime()) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:256:    issues.push('deleteAfter must be later than governedAt');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:258:  // H21 FIX: Require valid future deleteAfter for ephemeral retention policy
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:260:  if (retentionPolicy === 'ephemeral' && !deleteAfter) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:261:    issues.push('deleteAfter is required for ephemeral retention policy');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:277:      retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:278:      deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:299:    retention_policy: decision.normalized.retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:300:    delete_after: decision.normalized.deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:310:      retentionPolicy: decision.normalized.retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:311:      deleteAfter: decision.normalized.deleteAfter,
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:117:        && !normalized.includes('/memory/.archive');
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:124:        && !normalized.includes('/.archive');
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:217:                if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.archive')) {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:141: * 4. Within each group, sort chunks by chunkIndex (ascending) to restore
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:77:    tools: ['memory_update', 'memory_delete', 'memory_validate', 'memory_bulk_delete']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:85:    useCase: 'Create checkpoints before major changes, restore previous states.',
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:86:    tools: ['checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete', 'shared_memory_enable', 'shared_memory_status', 'shared_space_upsert', 'shared_space_membership_set']
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:30:export { checkExistingRow, checkContentHashDedup } from './dedup.js';
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:67:  content_hash: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:98:  content_hash?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:420:    content_hash: provided_hash,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:443:    content_hash: null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:510:  const content_hash = provided_hash || computeContentHash(content);
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:511:  result.content_hash = content_hash;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:516:      const whereClauses = ['content_hash = ?'];
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:517:      const paramsArray: unknown[] = [content_hash];
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:60:    'idx_save_parent_content_hash_scope',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:121:  CREATE INDEX IF NOT EXISTS idx_save_parent_content_hash_scope
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:124:    content_hash,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:177:  return /PRIMARY\s+KEY\s*\(\s*content_hash\s*,\s*model_id\s*,\s*dimensions\s*\)/i.test(tableSql);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:197:      content_hash,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:205:      content_hash,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:613:              'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1741:  if (!column_names.includes('content_hash')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1743:      database.exec(`ALTER TABLE memory_index ADD COLUMN content_hash TEXT`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1744:      console.warn('[vector-index] Migration: Added content_hash column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1749:      logDuplicateColumnMigrationSkip('content_hash', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2030:    database.exec(`CREATE INDEX IF NOT EXISTS idx_content_hash ON memory_index(content_hash)`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2033:      'idx_save_parent_content_hash_scope',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2037:    logger.info('Created idx_content_hash index');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2041:      index: 'idx_content_hash/idx_save_parent_content_hash_scope',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2329:      content_hash TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2345:      is_archived INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2453:    CREATE INDEX IF NOT EXISTS idx_content_hash ON memory_index(content_hash);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2454:    CREATE INDEX IF NOT EXISTS idx_save_parent_content_hash_scope ON memory_index(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2456:      content_hash,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:19:import { recordHistory } from '../../lib/storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:101:): { id: number; title: string | null; content_hash?: string | null } | undefined {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:109:    SELECT id, title, content_hash
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:135:  ) as { id: number; title: string | null; content_hash?: string | null } | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:216:      content_hash: parsed.contentHash,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:284:      recordHistory(memory_id, 'ADD', null, parsed.title ?? filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:286:        recordHistory(
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:53:    hasArchivedColumn: columnSet.has('is_archived'),
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:62:    predicates.push(`COALESCE(${alias}.is_archived, 0) = 0`);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:184:  // restored even when initEvalDb() fails after closing the prior singleton.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:222:      try { initEvalDb(path.dirname(previousEvalDbPath)); } catch (_: unknown) { /* best-effort restore */ }
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.d.ts:67:        archivedFolders: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:236:  { spec_folder: 'z_archive/001-old', updated_at: '2024-06-01', importance_tier: 'deprecated' },
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:239:const ranked = computeFolderScores(memories, { includeArchived: false });
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:271:| Archive check | `isArchived('/z_archive/old')` | Deprioritize archived folders |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:139:  retentionPolicy?: 'keep' | 'ephemeral' | 'shared';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:140:  deleteAfter?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:144:  content_hash?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:63:  content_hash?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:141:  includeArchived?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:705:      "query": "I want to understand how the memory system decides when to archive a memory",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1090:      "expectedResultDescription": "Should surface memory_bulk_delete tool schema (tier parameter, confirm safety gate), the bulk delete handler, and any spec about tier-based cleanup strategies.",
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:56:    toolPattern: /^(bash|memory_save|memory_update)$/i,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:39:| `dedup.ts`                  | Pre-save deduplication. `checkExistingRow` matches by file path but returns `unchanged` only for healthy rows (`success`, `pending`, `partial`); `checkContentHashDedup` matches by content hash and accepts chunked parents only when their status is valid `partial`. |
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:39:| Tool-Specific Hints | 6 tools | memory_search, checkpoint_restore, memory_save, memory_index_scan, memory_drift_why, memory_causal_link |
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:93:| E060-E069 | Checkpoint | Not found, restore/create failed |
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:10:import { recordHistory } from '../storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:595:        recordHistory(row.id, 'DELETE', file_path ?? null, null, 'mcp:delete_by_path', row.spec_folder ?? spec_folder);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:661:            recordHistory(id, 'DELETE', null, null, 'mcp:delete_memories', specFolderById.get(id) ?? null);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:706:        // BM25 cleanup is best-effort for bulk deletes as well.
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:433:    hint: 'Failed to restore from checkpoint.',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:519:      'For bulk delete, ensure confirm=true is set',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:538:      'Or use memory_update() to modify existing entry',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:608:      'Valid relations: caused, enabled, supersedes, contradicts, derived_from, supports',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:717:  // Checkpoint_restore specific hints
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:718:  checkpoint_restore: {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:720:      hint: 'Cannot restore: checkpoint does not exist.',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:730:      hint: 'Checkpoint restore failed. Database state unchanged.',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:23:import { recordHistory } from '../../lib/storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:260:                  content_hash: parsed.contentHash,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:301:                recordHistory(id, 'ADD', null, memory.title ?? memory.filePath ?? null, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:369:  // shadow-only (auto-merge at >= 0.96 only archives old record).
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:396:          // Auto-merge: archive the older memory record (shadow operation —
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:397:          // we mark is_archived so it is excluded from future search results
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:402:              SET is_archived = 1,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:410:              `[reconsolidation-bridge] assistive auto-merge: archived older=${topId} ` +
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:415:            console.warn(`[reconsolidation-bridge] assistive auto-merge archive failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:33:  supersedes: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:256:  const content_hash = computeContentHash(content);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:279:    contentHash: content_hash,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:680:    supersedes: [],
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:700:    const keyMatch = line.match(/^\s{2,}(caused_by|supersedes|derived_from|blocks|related_to):\s*$/);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:707:    const inlineMatch = line.match(/^\s{2,}(caused_by|supersedes|derived_from|blocks|related_to):\s*\[(.*)\]\s*$/);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:30:// Feature catalog: Checkpoint restore (checkpoint_restore)
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:293:  tool: 'checkpoint_create' | 'checkpoint_list' | 'checkpoint_restore' | 'checkpoint_delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:365:      `Restore with: checkpoint_restore({ name: "${name}" })`,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:421:/** Handle checkpoint_restore tool - restores memory state from a named checkpoint */
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:424:  const restoreBarrier = checkpoints.getRestoreBarrierStatus();
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:425:  if (restoreBarrier) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:427:      tool: 'checkpoint_restore',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:428:      error: restoreBarrier.message,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:429:      code: restoreBarrier.code,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:434:        hint: 'Retry checkpoint_restore after the active restore maintenance window completes.',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:435:        actions: ['Wait for the current restore to finish', 'Retry the restore request'],
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:446:    return createCheckpointScopeValidationError('checkpoint_restore');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:457:        tool: 'checkpoint_restore',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:473:  const result = checkpoints.restoreCheckpoint(name, clear_existing, scope);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:475:  const hasRestoredData = result.restored > 0 || result.workingMemoryRestored > 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:479:  // T102 FIX: Rebuild search indexes after checkpoint restore
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:480:  // Without this, restored memories are invisible to search until server restart.
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:482:  if (result.restored > 0 || result.workingMemoryRestored > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:495:      console.error('[T102] Index rebuild after checkpoint restore failed:', toErrorMessage(rebuildErr));
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:501:      tool: 'checkpoint_restore',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:502:      error: `Checkpoint "${name}" restore failed`,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:507:        restored: result.restored,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:513:        actions: ['Inspect checkpoint integrity', 'Create a fresh checkpoint before retrying restore'],
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:521:      tool: 'checkpoint_restore',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:522:      error: `Checkpoint "${name}" restore completed with partial failure`,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:527:        restored: result.restored,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:534:        hint: 'Review the reported table failures before retrying restore.',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:536:          'Inspect restored.errors and restored.rolledBackTables for the failed merge-replace tables',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:546:      tool: 'checkpoint_restore',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:548:        ? `Checkpoint "${name}" restored with warnings (${result.errors.length})`
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:549:        : `Checkpoint "${name}" restored partially`,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:554:        restored: result,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:557:        'Restore applied partially; review restored.errors and restored.skipped before retrying',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:565:    tool: 'checkpoint_restore',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:566:    summary: `Checkpoint "${name}" restored successfully`,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:569:      restored: result
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:572:      ? ['Previous data was cleared before restore', 'Search indexes rebuilt']
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:813:const handle_checkpoint_restore = handleCheckpointRestore;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:820:  handle_checkpoint_restore,
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:159:      includeArchived: false,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:58:  memory_delete: ERROR_CODES.MEMORY_DELETE_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:59:  memory_update: ERROR_CODES.MEMORY_UPDATE_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:61:  checkpoint_restore: ERROR_CODES.CHECKPOINT_RESTORE_FAILED,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:68:  supersedes: { relation: causalEdges.RELATION_TYPES.SUPERSEDES, reverse: false },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:20:import { recordHistory } from '../lib/storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:150:  const restoreBarrier = checkpoints.getRestoreBarrierStatus();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:151:  if (restoreBarrier) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:154:      error: restoreBarrier.message,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:155:      code: restoreBarrier.code,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:157:        hint: 'Retry memory_index_scan after checkpoint_restore maintenance completes.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:158:        actions: ['Wait for the restore to finish', 'Retry the index scan'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:266:            recordHistory(
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:203:  includeArchived?: boolean; // REQ-206: include archived memories in search (default false)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:520:    includeArchived: includeArchived = false, // REQ-206: exclude archived by default
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:733:    includeArchived,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:787:      includeArchived,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/ontology-hooks.ts:44:    'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:38:  content_hash: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:95:    SELECT id, content_hash, embedding_status, trigger_phrases, quality_score, quality_flags
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:182:export function checkExistingRow(
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:229:  if (existing && existing.content_hash === parsed.contentHash && isUnchangedEligible && isMetadataEquivalent) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:245:export function checkContentHashDedup(
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:257:      'content_hash = ?',
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:656:        // Return mutated content so caller can persist it and recompute content_hash
.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts:20:// Feature catalog: Single and folder delete (memory_delete)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:63:    includeArchived = false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:105:  if (includeArchived !== undefined && typeof includeArchived !== 'boolean') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:108:      error: 'includeArchived must be a boolean',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:182:      if (!includeArchived) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:214:        includeArchived,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:240:          .filter(([folder]) => includeArchived || !folderScoring.isArchived(folder))
.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:5:// Detects when a new edge contradicts an existing one and
.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:39:  ['supports', 'contradicts'],
.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:40:  ['caused', 'contradicts'],
.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:41:  ['enabled', 'contradicts'],
.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:63: * Check if a new edge contradicts existing edges.
.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:65: * 1. Same source+target with relation 'supersedes' → invalidate old edge
.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:66: * 2. Same source+target with conflicting relations (e.g., 'supports' vs 'contradicts')
.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:99:      // Rule 1: 'supersedes' replaces any existing edge on the same pair
.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:100:      if (newRelation.toLowerCase() === 'supersedes' && oldRelation.toLowerCase() !== 'supersedes') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:24:const SPEC_DOC_EXCLUDE_DIRS = new Set(['scratch', 'memory', 'node_modules', 'iterations', 'z_archive']);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:49:  by_supersedes: FlatEdge[];
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:50:  by_contradicts: FlatEdge[];
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:62:  supersedes: FlatEdge[];
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:63:  contradicts: FlatEdge[];
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:141:    by_supersedes: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:142:    by_contradicts: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:186:      case 'supersedes': return result.by_supersedes;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:187:      case 'contradicts': return result.by_contradicts;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:209:    by_supersedes: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:210:    by_contradicts: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:228:      case 'supersedes': merged.by_supersedes.push(edge); break;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:229:      case 'contradicts': merged.by_contradicts.push(edge); break;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:275:    by_supersedes: allowed.has('supersedes') ? chain.by_supersedes : [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:276:    by_contradicts: allowed.has('contradicts') ? chain.by_contradicts : [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:293:    by_supersedes: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:294:    by_contradicts: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:308:    supersedes: chain.by_supersedes,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:309:    contradicts: chain.by_contradicts,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:325:  if (chain.by_supersedes.length > 0) parts.push(`${chain.by_supersedes.length} supersedes`);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:326:  if (chain.by_contradicts.length > 0) parts.push(`${chain.by_contradicts.length} contradicts`);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:516:    if (combinedChain.by_contradicts.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:22:import { recordHistory } from '../lib/storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:60:  content_hash?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:94:  'content_hash', 'context_type', 'importance_tier', 'memory_type',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:194:      // The safe-swap pattern is NOT applied here because force is an explicit
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:205:              recordHistory(existingChunk.id, 'DELETE', filePath ?? null, null, 'mcp:chunking_reindex', parsed.specFolder);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:211:            recordHistory(existing.id, 'DELETE', filePath ?? null, null, 'mcp:chunking_reindex', parsed.specFolder);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:241:        content_hash: parsed.contentHash,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:342:          content_hash: parsed.contentHash,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:415:                recordHistory(chunkRow.id, 'DELETE', null, null, 'mcp:chunking_rollback', parsed.specFolder);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:421:              recordHistory(parentId, 'DELETE', null, null, 'mcp:chunking_rollback', parsed.specFolder);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:430:                recordHistory(childId, 'DELETE', null, null, 'mcp:chunking_rollback', parsed.specFolder);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:505:        SET content_hash = ?,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:535:        const archivePlaceholders = oldChildIds.map(() => '?').join(', ');
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:540:          WHERE id IN (${archivePlaceholders})
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:550:            recordHistory(oldChildId, 'DELETE', filePath ?? null, null, 'mcp:chunking_reindex', parsed.specFolder);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:567:                recordHistory(cid, 'DELETE', null, null, 'mcp:chunking_rollback', parsed.specFolder);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:594:  // (for safe-swap) finalization completes.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:22:import { recordHistory } from '../lib/storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:30:// Feature catalog: Memory metadata update (memory_update)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:40:/** Handle memory_update tool -- updates metadata fields and optionally regenerates embeddings. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:191:        recordHistory(
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:195:          'mcp:memory_update'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:203:        reason: 'memory_update: metadata update',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:204:        priorHash: priorSnapshot?.content_hash ?? (existing.content_hash as string | null) ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:214:          tool: 'memory_update',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:220:        actor: 'mcp:memory_update',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:231:      tool: 'memory_update',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:289:    tool: 'memory_update',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:94:  content_hash: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:183:    bucket.variants.set(normalizedPath, row.content_hash ?? null);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:184:    if (typeof row.content_hash === 'string' && row.content_hash.trim().length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:185:      bucket.hashes.add(row.content_hash.trim());
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:318:        SELECT file_path, content_hash, spec_folder
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:263:export const handle_memory_delete = lazyFunction(getMemoryCrudModule, 'handle_memory_delete');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:264:export const handle_memory_update = lazyFunction(getMemoryCrudModule, 'handle_memory_update');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:279:// Memory bulk delete handler
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:290:export const handle_checkpoint_restore = lazyFunction(getCheckpointsModule, 'handle_checkpoint_restore');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:81:import { checkExistingRow, checkContentHashDedup } from './save/dedup.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:366:      } catch (restoreErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:368:          '[memory-save] Auto-fix file restore failed after finalize error:',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:369:          restoreErr instanceof Error ? restoreErr.message : String(restoreErr),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:544:function restoreAtomicSaveOriginalState(

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Create Record
     3	// ───────────────────────────────────────────────────────────────
     4	import path from 'path';
     5	import type BetterSqlite3 from 'better-sqlite3';
     6	
     7	import * as vectorIndex from '../../lib/search/vector-index.js';
     8	import * as bm25Index from '../../lib/search/bm25-index.js';
     9	import * as predictionErrorGate from '../../lib/cognitive/prediction-error-gate.js';
    10	import * as fsrsScheduler from '../../lib/cognitive/fsrs-scheduler.js';
    11	import * as incrementalIndex from '../../lib/storage/incremental-index.js';
    12	import * as causalEdges from '../../lib/storage/causal-edges.js';
    13	import type * as memoryParser from '../../lib/parsing/memory-parser.js';
    14	import { sanitizeEmbeddingFailureMessage } from '../../lib/providers/retry-manager.js';
    15	import { getCanonicalPathKey } from '../../lib/utils/canonical-path.js';
    16	import { recordLineageTransition } from '../../lib/storage/lineage-state.js';
    17	import { toErrorMessage } from '../../utils/index.js';
    18	
    19	import { recordHistory } from '../../lib/storage/history.js';
    20	import { calculateDocumentWeight, isSpecDocumentType } from '../pe-gating.js';
    21	import { detectSpecLevelFromParsed } from '../handler-utils.js';
    22	import { classifyEncodingIntent } from '../../lib/search/encoding-intent.js';
    23	import { isEncodingIntentEnabled } from '../../lib/search/search-flags.js';
    24	import { applyPostInsertMetadata } from './db-helpers.js';
    25	
    26	// Feature catalog: Memory indexing (memory_save)
    27	// Feature catalog: Per-memory history log
    28	// Feature catalog: Prediction-error save arbitration
    29	
    30	
    31	import type { PeDecision, MemoryScopeMatch } from './types.js';
    32	import { normalizeScopeMatchValue } from './types.js';
    33	export type { MemoryScopeMatch };
    34	
    35	interface LineageRoutingDecision {
    36	  predecessorMemoryId: number | null;
    37	  transitionEvent: 'CREATE' | 'UPDATE' | 'SUPERSEDE';
    38	  causalSupersedesMemoryId: number | null;
    39	}
    40	
    41	export function resolveCreateRecordLineage(
    42	  peDecision: PeDecision,
    43	  samePathExistingId: number | null,
    44	): LineageRoutingDecision {
    45	  if (peDecision.action === predictionErrorGate.ACTION.SUPERSEDE && peDecision.existingMemoryId != null) {
    46	    return {
    47	      predecessorMemoryId: samePathExistingId,
    48	      transitionEvent: samePathExistingId != null ? 'SUPERSEDE' : 'CREATE',
    49	      causalSupersedesMemoryId: samePathExistingId === peDecision.existingMemoryId
    50	        ? null
    51	        : peDecision.existingMemoryId,
    52	    };
    53	  }
    54	
    55	  if (samePathExistingId != null) {
    56	    return {
    57	      predecessorMemoryId: samePathExistingId,
    58	      transitionEvent: 'UPDATE',
    59	      causalSupersedesMemoryId: null,
    60	    };
    61	  }
    62	
    63	  return {
    64	    predecessorMemoryId: null,
    65	    transitionEvent: 'CREATE',
    66	    causalSupersedesMemoryId: null,
    67	  };
    68	}
    69	
    70	function recordCrossPathSupersedesEdge(
    71	  database: BetterSqlite3.Database,
    72	  memoryId: number,
    73	  supersededMemoryId: number | null,
    74	  reason: string | null | undefined,
    75	): void {
    76	  if (supersededMemoryId == null) {
    77	    return;
    78	  }
    79	
    80	  causalEdges.init(database);
    81	  const evidence = reason && reason.trim().length > 0
    82	    ? reason.trim()
    83	    : 'Prediction-error contradiction across different file paths';
    84	  causalEdges.insertEdge(
    85	    String(memoryId),
    86	    String(supersededMemoryId),
    87	    causalEdges.RELATION_TYPES.SUPERSEDES,
    88	    1.0,
    89	    evidence,
    90	    true,
    91	    'auto',
    92	  );
    93	}
    94	
    95	export function findSamePathExistingMemory(
    96	  database: BetterSqlite3.Database,
    97	  specFolder: string,
    98	  canonicalFilePath: string,
    99	  filePath: string,
   100	  scope: MemoryScopeMatch = {},
   101	): { id: number; title: string | null; content_hash?: string | null } | undefined {
   102	  const tenantId = normalizeScopeMatchValue(scope.tenantId);
   103	  const userId = normalizeScopeMatchValue(scope.userId);
   104	  const agentId = normalizeScopeMatchValue(scope.agentId);
   105	  const sessionId = normalizeScopeMatchValue(scope.sessionId);
   106	  const sharedSpaceId = normalizeScopeMatchValue(scope.sharedSpaceId);
   107	
   108	  return database.prepare(`
   109	    SELECT id, title, content_hash
   110	    FROM memory_index
   111	    WHERE spec_folder = ?
   112	      AND parent_id IS NULL
   113	      AND (canonical_file_path = ? OR file_path = ?)
   114	      AND ((? IS NULL AND tenant_id IS NULL) OR tenant_id = ?)
   115	      AND ((? IS NULL AND user_id IS NULL) OR user_id = ?)
   116	      AND ((? IS NULL AND agent_id IS NULL) OR agent_id = ?)
   117	      AND ((? IS NULL AND session_id IS NULL) OR session_id = ?)
   118	      AND ((? IS NULL AND shared_space_id IS NULL) OR shared_space_id = ?)
   119	    ORDER BY id DESC
   120	    LIMIT 1
   121	  `).get(
   122	    specFolder,
   123	    canonicalFilePath,
   124	    filePath,
   125	    tenantId,
   126	    tenantId,
   127	    userId,
   128	    userId,
   129	    agentId,
   130	    agentId,
   131	    sessionId,
   132	    sessionId,
   133	    sharedSpaceId,
   134	    sharedSpaceId,
   135	  ) as { id: number; title: string | null; content_hash?: string | null } | undefined;
   136	}
   137	
   138	/**
   139	 * Creates a memory row with metadata, optional BM25 entry, and save history.
   140	 * Returns the persisted memory id for downstream save handlers.
   141	 */
   142	export function createMemoryRecord(
   143	  database: BetterSqlite3.Database,
   144	  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
   145	  filePath: string,
   146	  embedding: Float32Array | null,
   147	  embeddingFailureReason: string | null,
   148	  peDecision: PeDecision,
   149	  scope: MemoryScopeMatch = {},
   150	): number {
   151	  if (!embedding) {
   152	    console.error(`[memory-save] Using deferred indexing for ${path.basename(filePath)}`);
   153	  }
   154	
   155	  // Detect spec level for spec documents.
   156	  const specLevel = isSpecDocumentType(parsed.documentType)
   157	    ? detectSpecLevelFromParsed(filePath)
   158	    : null;
   159	  const encodingIntent = isEncodingIntentEnabled()
   160	    ? classifyEncodingIntent(parsed.content)
   161	    : undefined;
   162	  const canonicalFilePath = getCanonicalPathKey(filePath);
   163	  // Security: raw provider errors sanitized before persistence/response
   164	  const persistedEmbeddingFailureReason = sanitizeEmbeddingFailureMessage(embeddingFailureReason);
   165	
   166	  const indexWithMetadata = database.transaction(() => {
   167	    // Determine importance weight based on document type.
   168	    const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);
   169	    const samePathExisting = findSamePathExistingMemory(
   170	      database,
   171	      parsed.specFolder,
   172	      canonicalFilePath,
   173	      filePath,
   174	      scope,
   175	    );
   176	    const lineageRouting = resolveCreateRecordLineage(peDecision, samePathExisting?.id ?? null);
   177	    const predecessorMemoryId = lineageRouting.predecessorMemoryId;
   178	    const transitionEvent = lineageRouting.transitionEvent;
   179	
   180	    const memory_id: number = embedding
   181	      ? vectorIndex.indexMemory({
   182	          specFolder: parsed.specFolder,
   183	          filePath,
   184	          title: parsed.title,
   185	          triggerPhrases: parsed.triggerPhrases,
   186	          importanceWeight,
   187	          embedding,
   188	          encodingIntent,
   189	          documentType: parsed.documentType || 'memory',
   190	          specLevel,
   191	          contentText: parsed.content,
   192	          qualityScore: parsed.qualityScore,
   193	          qualityFlags: parsed.qualityFlags,
   194	          appendOnly: predecessorMemoryId != null,
   195	        })
   196	      : vectorIndex.indexMemoryDeferred({
   197	          specFolder: parsed.specFolder,
   198	          filePath,
   199	          title: parsed.title,
   200	          triggerPhrases: parsed.triggerPhrases,
   201	          importanceWeight,
   202	          failureReason: persistedEmbeddingFailureReason,
   203	          encodingIntent,
   204	          documentType: parsed.documentType || 'memory',
   205	          specLevel,
   206	          contentText: parsed.content,
   207	          qualityScore: parsed.qualityScore,
   208	          qualityFlags: parsed.qualityFlags,
   209	          appendOnly: predecessorMemoryId != null,
   210	        });
   211	
   212	    const fileMetadata = incrementalIndex.getFileMetadata(filePath);
   213	    const fileMtimeMs = fileMetadata ? fileMetadata.mtime : null;
   214	
   215	    applyPostInsertMetadata(database, memory_id, {
   216	      content_hash: parsed.contentHash,
   217	      context_type: parsed.contextType,
   218	      importance_tier: parsed.importanceTier,
   219	      memory_type: parsed.memoryType,
   220	      type_inference_source: parsed.memoryTypeSource,
   221	      stability: fsrsScheduler.DEFAULT_INITIAL_STABILITY,
   222	      difficulty: fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
   223	      file_mtime_ms: fileMtimeMs,
   224	      encoding_intent: encodingIntent,
   225	      document_type: parsed.documentType || 'memory',
   226	      spec_level: specLevel,
   227	      quality_score: parsed.qualityScore ?? 0,
   228	      quality_flags: JSON.stringify(parsed.qualityFlags ?? []),
   229	    });
   230	
   231	    if (embedding && peDecision.action === predictionErrorGate.ACTION.CREATE_LINKED && peDecision.existingMemoryId != null) {
   232	      try {
   233	        database.prepare(`
   234	          UPDATE memory_index
   235	          SET related_memories = ?
   236	          WHERE id = ?
   237	        `).run(JSON.stringify([peDecision.existingMemoryId]), memory_id);
   238	      } catch (err: unknown) {
   239	        const message = toErrorMessage(err);
   240	        console.error('[PE-Gate] Could not store related memories:', message);
   241	      }
   242	    }
   243	
   244	    if (predecessorMemoryId != null) {
   245	      database.prepare(`
   246	        UPDATE memory_index
   247	        SET importance_tier = 'deprecated',
   248	            updated_at = ?
   249	        WHERE id = ?
   250	      `).run(new Date().toISOString(), predecessorMemoryId);
   251	    }
   252	
   253	    recordLineageTransition(database, memory_id, {
   254	      actor: 'mcp:memory_save',
   255	      predecessorMemoryId,
   256	      transitionEvent,
   257	    });
   258	    recordCrossPathSupersedesEdge(
   259	      database,
   260	      memory_id,
   261	      lineageRouting.causalSupersedesMemoryId,
   262	      peDecision.reason,
   263	    );
   264	
   265	    if (bm25Index.isBm25Enabled()) {
   266	      try {
   267	        const bm25 = bm25Index.getIndex();
   268	        bm25.addDocument(String(memory_id), bm25Index.buildBm25DocumentText({
   269	          title: parsed.title,
   270	          content_text: parsed.content,
   271	          trigger_phrases: parsed.triggerPhrases,
   272	          file_path: filePath,
   273	        }));
   274	      } catch (bm25_err: unknown) {
   275	        const message = toErrorMessage(bm25_err);
   276	        console.warn(embedding
   277	          ? `[memory-save] BM25 indexing failed: ${message}`
   278	          : `[memory-save] BM25 indexing failed (deferred path): ${message}`);
   279	      }
   280	    }
   281	
   282	    // Append-first writes add a new row for every new current version.
   283	    try {
   284	      recordHistory(memory_id, 'ADD', null, parsed.title ?? filePath, 'mcp:memory_save');
   285	      if (predecessorMemoryId != null) {
   286	        recordHistory(
   287	          predecessorMemoryId,
   288	          'UPDATE',
   289	          samePathExisting?.title ?? null,
   290	          parsed.title ?? filePath,
   291	          'mcp:memory_save',
   292	        );
   293	      }
   294	    } catch (_histErr: unknown) {
   295	      // History recording is best-effort during save
   296	    }
   297	
   298	    return memory_id;
   299	  });
   300	
   301	  return indexWithMetadata();
   302	}

codex
The contrast is sharpening: Mnemosyne exposes “add/delete by ID,” while Public’s save path already carries canonical path keys, content hashes, lineage transitions, supersede edges, and history writes in one transaction.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Dedup
     3	// ───────────────────────────────────────────────────────────────
     4	import fs from 'fs';
     5	import type Database from 'better-sqlite3';
     6	
     7	import type { ParsedMemory } from '../../lib/parsing/memory-parser.js';
     8	import type { IndexResult } from './types.js';
     9	
    10	// Feature catalog: SHA-256 content-hash deduplication
    11	// Feature catalog: Canonical ID dedup hardening
    12	// Feature catalog: Generation-time duplicate and empty content prevention
    13	
    14	
    15	const UNCHANGED_EMBEDDING_STATUSES = new Set(['success', 'pending', 'partial']);
    16	const DEDUP_ELIGIBLE_EMBEDDING_STATUSES = ['success', 'partial'] as const;
    17	const QUALITY_SCORE_EPSILON = 1e-9;
    18	const SCOPE_COLUMNS = [
    19	  ['tenant_id', 'tenantId'],
    20	  ['user_id', 'userId'],
    21	  ['agent_id', 'agentId'],
    22	  ['session_id', 'sessionId'],
    23	  ['shared_space_id', 'sharedSpaceId'],
    24	] as const;
    25	
    26	interface SamePathDedupExclusion {
    27	  canonicalFilePath: string;
    28	  filePath: string;
    29	}
    30	
    31	import type { MemoryScopeMatch } from './types.js';
    32	import { normalizeScopeMatchValue } from './types.js';
    33	
    34	type ScopeColumnName = typeof SCOPE_COLUMNS[number][0];
    35	
    36	interface LatestMemoryLookupRow {
    37	  id: number;
    38	  content_hash: string;
    39	  embedding_status: string | null;
    40	  trigger_phrases: string | null;
    41	  quality_score: number | null;
    42	  quality_flags: string | null;
    43	}
    44	
    45	interface DuplicateLookupRow {
    46	  id: number;
    47	  file_path: string;
    48	  title: string | null;
    49	  content_text?: string | null;
    50	}
    51	
    52	function buildScopedWhereClauses(scope: MemoryScopeMatch): {
    53	  clauses: string[];
    54	  params: Array<string>;
    55	} {
    56	  const normalizedScope: MemoryScopeMatch = {
    57	    tenantId: normalizeScopeMatchValue(scope.tenantId),
    58	    userId: normalizeScopeMatchValue(scope.userId),
    59	    agentId: normalizeScopeMatchValue(scope.agentId),
    60	    sessionId: normalizeScopeMatchValue(scope.sessionId),
    61	    sharedSpaceId: normalizeScopeMatchValue(scope.sharedSpaceId),
    62	  };
    63	  const clauses: string[] = [];
    64	  const params: string[] = [];
    65	
    66	  for (const [column, key] of SCOPE_COLUMNS) {
    67	    const value = normalizedScope[key];
    68	    if (value === null || value === undefined) {
    69	      clauses.push(`${column} IS NULL`);
    70	      continue;
    71	    }
    72	    clauses.push(`${column} = ?`);
    73	    params.push(value);
    74	  }
    75	
    76	  return { clauses, params };
    77	}
    78	
    79	function selectLatestExistingRow(
    80	  database: Database.Database,
    81	  parsed: ParsedMemory,
    82	  pathColumn: ScopeColumnName | 'canonical_file_path' | 'file_path',
    83	  pathValue: string,
    84	  scopeClauses: string[],
    85	  scopeParams: string[],
    86	): LatestMemoryLookupRow | undefined {
    87	  const whereClauses = [
    88	    'spec_folder = ?',
    89	    'parent_id IS NULL',
    90	    `${pathColumn} = ?`,
    91	    ...scopeClauses,
    92	  ];
    93	
    94	  return database.prepare(`
    95	    SELECT id, content_hash, embedding_status, trigger_phrases, quality_score, quality_flags
    96	    FROM memory_index
    97	    WHERE ${whereClauses.join('\n      AND ')}
    98	    ORDER BY id DESC
    99	    LIMIT 1
   100	  `).get(
   101	    parsed.specFolder,
   102	    pathValue,
   103	    ...scopeParams,
   104	  ) as LatestMemoryLookupRow | undefined;
   105	}
   106	
   107	function parseJsonStringArray(raw: string | null): string[] {
   108	  if (!raw) {
   109	    return [];
   110	  }
   111	
   112	  try {
   113	    const parsed = JSON.parse(raw) as unknown;
   114	    return Array.isArray(parsed)
   115	      ? parsed.filter((value): value is string => typeof value === 'string')
   116	      : [];
   117	  } catch {
   118	    return [];
   119	  }
   120	}
   121	
   122	function normalizeStringArray(values: string[]): string[] {
   123	  return [...new Set(values.map(value => value.trim()).filter(Boolean))].sort();
   124	}
   125	
   126	function areEquivalentStringArrays(left: string[], right: string[]): boolean {
   127	  const normalizedLeft = normalizeStringArray(left);
   128	  const normalizedRight = normalizeStringArray(right);
   129	
   130	  if (normalizedLeft.length !== normalizedRight.length) {
   131	    return false;
   132	  }
   133	
   134	  return normalizedLeft.every((value, index) => value === normalizedRight[index]);
   135	}
   136	
   137	function isSamePathMetadataEquivalent(
   138	  existing: {
   139	    trigger_phrases: string | null;
   140	    quality_score: number | null;
   141	    quality_flags: string | null;
   142	  },
   143	  parsed: ParsedMemory,
   144	): boolean {
   145	  const persistedTriggerPhrases = parseJsonStringArray(existing.trigger_phrases);
   146	  if (!areEquivalentStringArrays(persistedTriggerPhrases, parsed.triggerPhrases)) {
   147	    return false;
   148	  }
   149	
   150	  const persistedQualityFlags = parseJsonStringArray(existing.quality_flags);
   151	  if (!areEquivalentStringArrays(persistedQualityFlags, parsed.qualityFlags ?? [])) {
   152	    return false;
   153	  }
   154	
   155	  const persistedQualityScore = existing.quality_score ?? 0;
   156	  const parsedQualityScore = parsed.qualityScore ?? 0;
   157	  return Math.abs(persistedQualityScore - parsedQualityScore) <= QUALITY_SCORE_EPSILON;
   158	}
   159	
   160	function verifyStoredContentMatch(
   161	  storedContent: string | null | undefined,
   162	  storedPath: string | null | undefined,
   163	  incomingContent: string,
   164	): boolean | null {
   165	  if (typeof storedContent === 'string') {
   166	    return storedContent === incomingContent;
   167	  }
   168	
   169	  if (typeof storedPath === 'string' && storedPath.length > 0) {
   170	    try {
   171	      if (fs.existsSync(storedPath)) {
   172	        return fs.readFileSync(storedPath, 'utf-8') === incomingContent;
   173	      }
   174	    } catch {
   175	      return null;
   176	    }
   177	  }
   178	
   179	  return null;
   180	}
   181	
   182	export function checkExistingRow(
   183	  database: Database.Database,
   184	  parsed: ParsedMemory,
   185	  canonicalFilePath: string,
   186	  filePath: string,
   187	  force: boolean,
   188	  warnings: string[] | undefined,
   189	  scope: MemoryScopeMatch = {},
   190	): IndexResult | null {
   191	  const { clauses: scopeClauses, params: scopeParams } = buildScopedWhereClauses(scope);
   192	  const candidates = [
   193	    selectLatestExistingRow(
   194	      database,
   195	      parsed,
   196	      'canonical_file_path',
   197	      canonicalFilePath,
   198	      scopeClauses,
   199	      scopeParams,
   200	    ),
   201	  ];
   202	
   203	  if (filePath !== canonicalFilePath) {
   204	    candidates.push(
   205	      selectLatestExistingRow(
   206	        database,
   207	        parsed,
   208	        'file_path',
   209	        filePath,
   210	        scopeClauses,
   211	        scopeParams,
   212	      ),
   213	    );
   214	  }
   215	
   216	  const existing = candidates
   217	    .filter((candidate): candidate is LatestMemoryLookupRow => candidate !== undefined)
   218	    .sort((left, right) => right.id - left.id)[0];
   219	
   220	  const existingStatus = existing?.embedding_status ?? null;
   221	  const isUnchangedEligible = existingStatus !== null && UNCHANGED_EMBEDDING_STATUSES.has(existingStatus);
   222	  const isMetadataEquivalent = existing
   223	    ? isSamePathMetadataEquivalent(existing, parsed)
   224	    : false;
   225	
   226	  // P1-4 FIX: Check content hash even during force reindex to prevent duplicate
   227	  // row accumulation. If content AND metadata are identical, the embedding would
   228	  // not change either, so re-indexing provides no value and creates duplicates.
   229	  if (existing && existing.content_hash === parsed.contentHash && isUnchangedEligible && isMetadataEquivalent) {
   230	    return {
   231	      status: 'unchanged',
   232	      id: existing.id,
   233	      specFolder: parsed.specFolder,
   234	      title: parsed.title ?? '',
   235	      triggerPhrases: parsed.triggerPhrases,
   236	      contextType: parsed.contextType,
   237	      importanceTier: parsed.importanceTier,
   238	      warnings,
   239	    };
   240	  }
   241	
   242	  return null;
   243	}
   244	
   245	export function checkContentHashDedup(
   246	  database: Database.Database,
   247	  parsed: ParsedMemory,
   248	  force: boolean,
   249	  warnings: string[] | undefined,
   250	  samePathExclusion?: SamePathDedupExclusion,
   251	  scope: MemoryScopeMatch = {},
   252	): IndexResult | null {
   253	  if (!force) {
   254	    const { clauses: scopeClauses, params: scopeParams } = buildScopedWhereClauses(scope);
   255	    const whereClauses = [
   256	      'spec_folder = ?',
   257	      'content_hash = ?',
   258	      'parent_id IS NULL',
   259	      'embedding_status IN (?, ?)',
   260	      ...scopeClauses,
   261	    ];
   262	    const duplicateParams: Array<string> = [
   263	      parsed.specFolder,
   264	      parsed.contentHash,
   265	      ...DEDUP_ELIGIBLE_EMBEDDING_STATUSES,
   266	      ...scopeParams,
   267	    ];
   268	
   269	    if (samePathExclusion) {
   270	      whereClauses.push('file_path != ?');
   271	      duplicateParams.push(samePathExclusion.filePath);
   272	      whereClauses.push('(canonical_file_path IS NULL OR canonical_file_path != ?)');
   273	      duplicateParams.push(samePathExclusion.canonicalFilePath);
   274	    }
   275	
   276	    const duplicateByHash = database.prepare(`
   277	      SELECT id, file_path, title, content_text
   278	      FROM memory_index
   279	      WHERE ${whereClauses.join('\n        AND ')}
   280	      ORDER BY id DESC
   281	      LIMIT 1
   282	    `).get(...duplicateParams) as DuplicateLookupRow | undefined;
   283	
   284	    if (duplicateByHash) {
   285	      const verifiedMatch = verifyStoredContentMatch(
   286	        duplicateByHash.content_text,
   287	        duplicateByHash.file_path,
   288	        parsed.content,
   289	      );
   290	      if (verifiedMatch === false) {
   291	        console.warn(`[memory-save] Hash match for memory #${duplicateByHash.id} failed secondary content verification; continuing save`);
   292	        return null;
   293	      }
   294	      console.error(`[memory-save] T054: Duplicate content detected (hash match id=${duplicateByHash.id}), skipping embedding`);
   295	      return {
   296	        status: 'duplicate',
   297	        id: duplicateByHash.id,
   298	        specFolder: parsed.specFolder,
   299	        title: parsed.title ?? duplicateByHash.title ?? '',
   300	        triggerPhrases: parsed.triggerPhrases,
   301	        contextType: parsed.contextType,
   302	        importanceTier: parsed.importanceTier,
   303	        warnings,
   304	        message: `Duplicate content detected: identical to existing memory #${duplicateByHash.id} (${duplicateByHash.file_path}). Skipping embedding generation.`,
   305	      };
   306	    }
   307	  }
   308	
   309	  return null;
   310	}

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ────────────────────────────────────────────────────────────────
     2	// MODULE: Memory Crud Update Handler
     3	// ────────────────────────────────────────────────────────────────
     4	
     5	/* ───────────────────────────────────────────────────────────────
     6	   IMPORTS
     7	──────────────────────────────────────────────────────────────── */
     8	
     9	import { randomUUID } from 'node:crypto';
    10	import { checkDatabaseUpdated } from '../core/index.js';
    11	import * as vectorIndex from '../lib/search/vector-index.js';
    12	import type { UpdateMemoryParams } from '../lib/search/vector-index.js';
    13	import * as embeddings from '../lib/providers/embeddings.js';
    14	import * as bm25Index from '../lib/search/bm25-index.js';
    15	import { VALID_TIERS, isValidTier } from '../lib/scoring/importance-tiers.js';
    16	import { MemoryError, ErrorCodes } from '../lib/errors.js';
    17	import * as mutationLedger from '../lib/storage/mutation-ledger.js';
    18	import { runInTransaction } from '../lib/storage/transaction-manager.js';
    19	import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
    20	import { toErrorMessage } from '../utils/index.js';
    21	
    22	import { recordHistory } from '../lib/storage/history.js';
    23	import { appendMutationLedgerSafe, getMemoryHashSnapshot } from './memory-crud-utils.js';
    24	import { runPostMutationHooks } from './mutation-hooks.js';
    25	import { buildMutationHookFeedback } from '../hooks/mutation-feedback.js';
    26	
    27	import type { MCPResponse } from './types.js';
    28	import type { UpdateArgs } from './memory-crud-types.js';
    29	
    30	// Feature catalog: Memory metadata update (memory_update)
    31	// Feature catalog: Validation feedback (memory_validate)
    32	// Feature catalog: Transaction wrappers on mutation handlers
    33	// Feature catalog: Per-memory history log
    34	
    35	
    36	/* ───────────────────────────────────────────────────────────────
    37	   CORE LOGIC
    38	──────────────────────────────────────────────────────────────── */
    39	
    40	/** Handle memory_update tool -- updates metadata fields and optionally regenerates embeddings. */
    41	async function handleMemoryUpdate(args: UpdateArgs): Promise<MCPResponse> {
    42	  // A7-P2-1: Generate requestId for incident correlation in error responses
    43	  const requestId = randomUUID();
    44	  await checkDatabaseUpdated();
    45	
    46	  const {
    47	    id,
    48	    title,
    49	    triggerPhrases,
    50	    importanceWeight,
    51	    importanceTier,
    52	    allowPartialUpdate = false,
    53	  } = args;
    54	
    55	  if (typeof id !== 'number') {
    56	    throw new MemoryError(ErrorCodes.MISSING_REQUIRED_PARAM, 'id is required', { param: 'id' });
    57	  }
    58	
    59	  if (importanceWeight !== undefined && (typeof importanceWeight !== 'number' || importanceWeight < 0 || importanceWeight > 1)) {
    60	    throw new MemoryError(
    61	      ErrorCodes.INVALID_PARAMETER,
    62	      'importanceWeight must be a number between 0 and 1',
    63	      { param: 'importanceWeight', value: importanceWeight }
    64	    );
    65	  }
    66	
    67	  if (importanceTier !== undefined && !isValidTier(importanceTier)) {
    68	    throw new MemoryError(
    69	      ErrorCodes.INVALID_PARAMETER,
    70	      `Invalid importance tier: ${importanceTier}. Valid tiers: ${VALID_TIERS.join(', ')}`,
    71	      { param: 'importanceTier', value: importanceTier }
    72	    );
    73	  }
    74	
    75	  const existing = vectorIndex.getMemory(id);
    76	  if (!existing) {
    77	    throw new MemoryError(ErrorCodes.FILE_NOT_FOUND, `Memory not found: ${id}`, { id });
    78	  }
    79	
    80	  const database = vectorIndex.getDb();
    81	  const priorSnapshot = getMemoryHashSnapshot(database, id);
    82	
    83	  const updateParams: UpdateMemoryParams = { id };
    84	  if (title !== undefined) updateParams.title = title;
    85	  if (triggerPhrases !== undefined) updateParams.triggerPhrases = triggerPhrases;
    86	  if (importanceWeight !== undefined) updateParams.importanceWeight = importanceWeight;
    87	  if (importanceTier !== undefined) updateParams.importanceTier = importanceTier;
    88	
    89	  let embeddingRegenerated = false;
    90	  let embeddingMarkedForReindex = false;
    91	  let embeddingStatusNeedsPendingWrite = false;
    92	  let mutationLedgerWarning: string | null = null;
    93	
    94	  if (title !== undefined && title !== existing.title) {
    95	    console.error(`[memory-update] Title changed, regenerating embedding for memory ${id} [requestId=${requestId}]`);
    96	    let newEmbedding: Float32Array | null = null;
    97	
    98	    try {
    99	      // Embed title + content_text, not title alone.
   100	      // This produces better semantic embeddings that capture the full memory context.
   101	      const contentText = existing.content_text || '';
   102	      const embeddingInput = contentText ? `${title}\n\n${contentText}` : title;
   103	      newEmbedding = await embeddings.generateDocumentEmbedding(embeddingInput);
   104	    } catch (err: unknown) {
   105	      const message = toErrorMessage(err);
   106	      if (allowPartialUpdate) {
   107	        console.warn(`[memory-update] Embedding regeneration failed, marking for re-index [requestId=${requestId}]: ${message}`);
   108	        embeddingStatusNeedsPendingWrite = true;
   109	        embeddingMarkedForReindex = true;
   110	      } else {
   111	        console.error(`[memory-update] Embedding regeneration failed, rolling back update [requestId=${requestId}]: ${message}`);
   112	        throw new MemoryError(
   113	          ErrorCodes.EMBEDDING_FAILED,
   114	          'Embedding regeneration failed, update rolled back. No changes were made.',
   115	          { originalError: message, memoryId: id }
   116	        );
   117	      }
   118	    }
   119	
   120	    if (newEmbedding) {
   121	      updateParams.embedding = newEmbedding;
   122	      embeddingRegenerated = true;
   123	    } else if (!embeddingMarkedForReindex) {
   124	      if (allowPartialUpdate) {
   125	        console.warn('[memory-update] Embedding returned null, marking for re-index');
   126	        embeddingStatusNeedsPendingWrite = true;
   127	        embeddingMarkedForReindex = true;
   128	      } else {
   129	        throw new MemoryError(
   130	          ErrorCodes.EMBEDDING_FAILED,
   131	          'Failed to regenerate embedding (null result), update rolled back. No changes were made.',
   132	          { memoryId: id }
   133	        );
   134	      }
   135	    }
   136	  }
   137	
   138	  // T2-5 transaction wrapper — wraps all synchronous mutation steps (DB update,
   139	  // Cache invalidation, BM25 re-index, ledger append) in a single transaction for atomicity.
   140	  // Embedding generation (async) runs before this block; its result feeds into updateParams.
   141	  const fields = Object.keys(updateParams).filter((key) => key !== 'id' && key !== 'embedding');
   142	
   143	  if (database) {
   144	    runInTransaction(database, () => {
   145	      if (embeddingStatusNeedsPendingWrite) {
   146	        vectorIndex.updateEmbeddingStatus(id, 'pending');
   147	      }
   148	
   149	      vectorIndex.updateMemory(updateParams);
   150	
   151	      // T2-6 — BM25 index stores title + trigger phrases; must re-index when either changes
   152	      // So keyword search reflects the updated content.
   153	      // T-05: BM25 re-index failure now rolls back the transaction when the index is operational.
   154	      // Infrastructure failures (BM25 not available, DB missing prepare) are non-fatal warnings.
   155	      if ((updateParams.title !== undefined || updateParams.triggerPhrases !== undefined) && bm25Index.isBm25Enabled()) {
   156	        try {
   157	          const bm25Idx = bm25Index.getIndex();
   158	          const row = database.prepare(
   159	            'SELECT title, content_text, trigger_phrases, file_path FROM memory_index WHERE id = ?'
   160	          ).get(id) as { title: string | null; content_text: string | null; trigger_phrases: string | null; file_path: string | null } | undefined;
   161	          if (row) {
   162	            const text = bm25Index.buildBm25DocumentText(row);
   163	            if (text.trim()) {
   164	              bm25Idx.addDocument(String(id), text);
   165	            }
   166	          }
   167	        } catch (e: unknown) {
   168	          const bm25ErrMsg = e instanceof Error ? e.message : String(e);
   169	          // T-05 + P1-02 fix: Distinguish infrastructure failures from data failures.
   170	          // Infrastructure failures mean the BM25 subsystem is unavailable or torn down —
   171	          // These are non-fatal warnings. Data failures mean the index IS operational but rejected
   172	          // The input — those must re-throw to roll back the transaction.
   173	          const isBm25InfraFailure = (msg: string): boolean =>
   174	            msg.includes('not a function') ||
   175	            msg.includes('not initialized') ||
   176	            msg.includes('Cannot read properties') ||
   177	            msg.includes('is not defined') ||
   178	            msg.includes('database is closed') ||
   179	            msg.includes('no such table');
   180	          if (isBm25InfraFailure(bm25ErrMsg)) {
   181	            console.warn(`[memory-crud-update] BM25 infrastructure unavailable, skipping re-index [requestId=${requestId}]: ${bm25ErrMsg}`);
   182	          } else {
   183	            console.error(`[memory-crud-update] BM25 re-index failed, rolling back update [requestId=${requestId}]: ${bm25ErrMsg}`);
   184	            throw new Error(`BM25 re-index failed: ${bm25ErrMsg}`);
   185	          }
   186	        }
   187	      }
   188	
   189	      // T-05: Record UPDATE history after successful mutation
   190	      try {
   191	        recordHistory(
   192	          id, 'UPDATE',
   193	          existing.title ?? null,
   194	          updateParams.title ?? existing.title ?? null,
   195	          'mcp:memory_update'
   196	        );
   197	      } catch (_histErr: unknown) {
   198	        // History recording is best-effort
   199	      }
   200	
   201	      const ledgerRecorded = appendMutationLedgerSafe(database, {
   202	        mutationType: 'update',
   203	        reason: 'memory_update: metadata update',
   204	        priorHash: priorSnapshot?.content_hash ?? (existing.content_hash as string | null) ?? null,
   205	        newHash: mutationLedger.computeHash(JSON.stringify({
   206	          id,
   207	          title: updateParams.title ?? existing.title ?? null,
   208	          triggerPhrases: updateParams.triggerPhrases ?? null,
   209	          importanceWeight: updateParams.importanceWeight ?? null,
   210	          importanceTier: updateParams.importanceTier ?? null,
   211	        })),
   212	        linkedMemoryIds: [id],
   213	        decisionMeta: {
   214	          tool: 'memory_update',
   215	          fields,
   216	          embeddingRegenerated,
   217	          embeddingMarkedForReindex,
   218	          allowPartialUpdate,
   219	        },
   220	        actor: 'mcp:memory_update',
   221	      });
   222	      if (!ledgerRecorded) {
   223	        mutationLedgerWarning = 'Mutation ledger append failed; audit trail may be incomplete.';
   224	      }
   225	    });
   226	  } else {
   227	    // P1-021 — No database handle means we cannot guarantee transactional
   228	    // Consistency. Abort early rather than risk partial state.
   229	    console.warn('[memory-crud-update] No database handle, aborting update to prevent partial state');
   230	    return createMCPErrorResponse({
   231	      tool: 'memory_update',
   232	      error: `Memory ${id} update aborted: database unavailable`,
   233	      code: 'E_DB_UNAVAILABLE',
   234	      details: { updated: null, fields },
   235	      recovery: {
   236	        hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database',
   237	        actions: ['Restart the MCP server', 'Call memory_index_scan()'],
   238	        severity: 'error',
   239	      },
   240	    });
   241	  }
   242	
   243	  let postMutationHooks: import('./mutation-hooks.js').MutationHookResult;
   244	  try {
   245	    postMutationHooks = runPostMutationHooks('update', { memoryId: id });
   246	  } catch (hookError: unknown) {
   247	    const msg = hookError instanceof Error ? hookError.message : String(hookError);
   248	    postMutationHooks = {
   249	      latencyMs: 0, triggerCacheCleared: false,
   250	      constitutionalCacheCleared: false, toolCacheInvalidated: 0,
   251	      graphSignalsCacheCleared: false, coactivationCacheCleared: false,
   252	      errors: [msg],
   253	    };
   254	  }
   255	  const postMutationFeedback = buildMutationHookFeedback('update', postMutationHooks);
   256	
   257	  const summary = embeddingMarkedForReindex
   258	    ? `Memory ${id} updated (embedding pending re-index)`
   259	    : `Memory ${id} updated successfully`;
   260	
   261	  const hints: string[] = [];
   262	  if (embeddingMarkedForReindex) {
   263	    hints.push('Run memory_index_scan() to regenerate embeddings');
   264	  }
   265	  if (embeddingRegenerated) {
   266	    hints.push('Embedding regenerated - search results may differ');
   267	  }
   268	  if (mutationLedgerWarning) {
   269	    hints.push(mutationLedgerWarning);
   270	  }
   271	  hints.push(...postMutationFeedback.hints);
   272	
   273	  const data: Record<string, unknown> = {
   274	    updated: id,
   275	    fields,
   276	    embeddingRegenerated,
   277	    postMutationHooks: postMutationFeedback.data,
   278	  };
   279	
   280	  if (embeddingMarkedForReindex) {
   281	    data.warning = 'Embedding regeneration failed, memory marked for re-indexing';
   282	    data.embeddingStatus = 'pending';
   283	  }
   284	  if (mutationLedgerWarning) {
   285	    data.mutationLedgerWarning = mutationLedgerWarning;
   286	  }
   287	
   288	  return createMCPSuccessResponse({
   289	    tool: 'memory_update',
   290	    summary,
   291	    data,
   292	    hints,
   293	  });
   294	}
   295	
   296	/* ───────────────────────────────────────────────────────────────
   297	   EXPORTS
   298	──────────────────────────────────────────────────────────────── */
   299	
   300	export { handleMemoryUpdate };

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ────────────────────────────────────────────────────────────────
     2	// MODULE: Memory Crud Delete
     3	// ────────────────────────────────────────────────────────────────
     4	
     5	/* ───────────────────────────────────────────────────────────────
     6	   IMPORTS
     7	──────────────────────────────────────────────────────────────── */
     8	
     9	import { checkDatabaseUpdated } from '../core/index.js';
    10	import * as vectorIndex from '../lib/search/vector-index.js';
    11	import * as checkpoints from '../lib/storage/checkpoints.js';
    12	import * as mutationLedger from '../lib/storage/mutation-ledger.js';
    13	import * as causalEdges from '../lib/storage/causal-edges.js';
    14	import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
    15	import { toErrorMessage } from '../utils/index.js';
    16	
    17	import { recordHistory } from '../lib/storage/history.js';
    18	import { appendMutationLedgerSafe, getMemoryHashSnapshot } from './memory-crud-utils.js';
    19	import { runPostMutationHooks } from './mutation-hooks.js';
    20	import { buildMutationHookFeedback } from '../hooks/mutation-feedback.js';
    21	import { clearDegreeCacheForDb } from '../lib/search/graph-search-fn.js';
    22	
    23	import type { MCPResponse } from './types.js';
    24	import type { DeleteArgs, MemoryHashSnapshot } from './memory-crud-types.js';
    25	
    26	// Feature catalog: Single and folder delete (memory_delete)
    27	// Feature catalog: Validation feedback (memory_validate)
    28	// Feature catalog: Transaction wrappers on mutation handlers
    29	// Feature catalog: Per-memory history log
    30	
    31	
    32	/* ───────────────────────────────────────────────────────────────
    33	   CORE LOGIC
    34	──────────────────────────────────────────────────────────────── */
    35	
    36	function parseMemoryId(rawId: number | string): number {
    37	  const numericId = typeof rawId === 'string'
    38	    ? Number.parseInt(rawId.trim(), 10)
    39	    : rawId;
    40	
    41	  if (
    42	    typeof numericId !== 'number' ||
    43	    !Number.isSafeInteger(numericId) ||
    44	    numericId <= 0 ||
    45	    (typeof rawId === 'string' && !/^\d+$/.test(rawId.trim()))
    46	  ) {
    47	    throw new Error('Invalid memory ID: must be a positive integer');
    48	  }
    49	
    50	  return numericId;
    51	}
    52	
    53	function createDatabaseUnavailableDeleteResponse(): MCPResponse {
    54	  return createMCPErrorResponse({
    55	    tool: 'memory_delete',
    56	    error: 'Delete aborted: database unavailable',
    57	    code: 'E_DB_UNAVAILABLE',
    58	    details: { deleted: 0 },
    59	    recovery: {
    60	      hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database',
    61	      actions: ['Restart the MCP server', 'Call memory_index_scan()'],
    62	      severity: 'error',
    63	    },
    64	  });
    65	}
    66	
    67	/** Handle memory_delete tool -- deletes a single memory by ID or bulk-deletes by spec folder. */
    68	async function handleMemoryDelete(args: DeleteArgs): Promise<MCPResponse> {
    69	  await checkDatabaseUpdated();
    70	
    71	  const { id, specFolder, confirm } = args;
    72	  if (!id && !specFolder) throw new Error('Either id or specFolder is required');
    73	  if (specFolder !== undefined && typeof specFolder !== 'string') throw new Error('specFolder must be a string');
    74	  if (specFolder && !id && !confirm) throw new Error('Bulk delete requires confirm: true');
    75	
    76	  let numericId: number | null = null;
    77	  if (id !== undefined && id !== null) {
    78	    numericId = parseMemoryId(id);
    79	  }
    80	
    81	  let deletedCount = 0;
    82	  let checkpointName: string | null = null;
    83	  let mutationLedgerWarning: string | null = null;
    84	  const database = vectorIndex.getDb();
    85	
    86	  if (!database) {
    87	    // Unified DB-unavailable contract for single and bulk delete paths.
    88	    return createDatabaseUnavailableDeleteResponse();
    89	  }
    90	
    91	  if (numericId !== null) {
    92	    const singleSnapshot = getMemoryHashSnapshot(database, numericId);
    93	
    94	    // T2-5 transaction wrapper — wraps single-delete path (memory delete, causal edge
    95	    // Cleanup, ledger append) in a transaction for atomicity on error.
    96	    database.transaction(() => {
    97	      deletedCount = vectorIndex.deleteMemory(numericId) ? 1 : 0;
    98	
    99	      if (deletedCount > 0) {
   100	        // Record DELETE history after confirmed delete (no FK, history rows survive).
   101	        // Placed after deleteMemory to avoid false audit rows for non-existent IDs.
   102	        try {
   103	          recordHistory(
   104	            numericId,
   105	            'DELETE',
   106	            singleSnapshot?.file_path ?? null,
   107	            null,
   108	            'mcp:memory_delete',
   109	            singleSnapshot?.spec_folder ?? null,
   110	          );
   111	        } catch (_histErr: unknown) {
   112	          // History recording is best-effort
   113	        }
   114	
   115	        causalEdges.init(database);
   116	        causalEdges.deleteEdgesForMemory(String(numericId));
   117	        // H1 FIX: Use db-specific invalidation instead of the no-op global version
   118	        clearDegreeCacheForDb(database);
   119	
   120	        const ledgerRecorded = appendMutationLedgerSafe(database, {
   121	          mutationType: 'delete',
   122	          reason: 'memory_delete: single memory delete',
   123	          priorHash: singleSnapshot?.content_hash ?? null,
   124	          newHash: mutationLedger.computeHash(`delete:${numericId}:${Date.now()}`),
   125	          linkedMemoryIds: [numericId],
   126	          decisionMeta: {
   127	            tool: 'memory_delete',
   128	            bulk: false,
   129	            memoryId: numericId,
   130	            specFolder: singleSnapshot?.spec_folder ?? null,
   131	            filePath: singleSnapshot?.file_path ?? null,
   132	          },
   133	          actor: 'mcp:memory_delete',
   134	        });
   135	        if (!ledgerRecorded) {
   136	          mutationLedgerWarning = 'Mutation ledger append failed; audit trail may be incomplete.';
   137	        }
   138	      }
   139	    })();
   140	  } else {
   141	    const memories: { id: number }[] = vectorIndex.getMemoriesByFolder(specFolder as string);
   142	    const deletedIds: number[] = [];
   143	    const hashById = new Map<number, MemoryHashSnapshot>();
   144	
   145	    if (database && 'prepare' in database) {
   146	      try {
   147	        const rows = database.prepare(`
   148	          SELECT id, content_hash, spec_folder, file_path
   149	          FROM memory_index
   150	          WHERE spec_folder = ?
   151	        `).all(specFolder as string) as MemoryHashSnapshot[];
   152	
   153	        for (const row of rows) {
   154	          hashById.set(row.id, row);
   155	        }
   156	      } catch (_err: unknown) {
   157	        // Non-fatal — bulk delete proceeds without per-memory hash snapshots; ledger entries will lack prior hashes.
   158	      }
   159	    }
   160	
   161	    if (memories.length > 0) {
   162	      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
   163	      const proposedCheckpointName = `pre-cleanup-${timestamp}`;
   164	      try {
   165	        const checkpoint = checkpoints.createCheckpoint({
   166	          name: proposedCheckpointName,
   167	          specFolder,
   168	          metadata: {
   169	            reason: 'auto-checkpoint before bulk delete',
   170	            memoryCount: memories.length,
   171	          },
   172	        });
   173	
   174	        if (checkpoint) {
   175	          checkpointName = checkpoint.name;
   176	          console.error(`[memory-delete] Created checkpoint: ${checkpointName}`);
   177	        } else {
   178	          console.warn('[memory-delete] Checkpoint creation returned no checkpoint; proceeding without rollback.');
   179	          checkpointName = null;
   180	        }
   181	      } catch (cpErr: unknown) {
   182	        const message = toErrorMessage(cpErr);
   183	        console.error(`[memory-delete] Failed to create checkpoint: ${message}`);
   184	        // Confirm is always true here (validated at function entry) — safe to proceed without checkpoint.
   185	        console.warn('[memory-delete] Proceeding without backup (user confirmed)');
   186	        checkpointName = null;
   187	      }
   188	    }
   189	
   190	    // Snapshot-then-delete is safe under single-process better-sqlite3; re-evaluate if multi-process support is added
   191	    causalEdges.init(database);
   192	    const bulkDeleteTx = database.transaction(() => {
   193	      for (const memory of memories) {
   194	        if (vectorIndex.deleteMemory(memory.id)) {
   195	          // Record DELETE history after confirmed delete (no FK, history rows survive).
   196	          try {
   197	            const snapshot = hashById.get(memory.id);
   198	            recordHistory(
   199	              memory.id,
   200	              'DELETE',
   201	              snapshot?.file_path ?? null,
   202	              null,
   203	              'mcp:memory_delete',
   204	              snapshot?.spec_folder ?? null,
   205	            );
   206	          } catch (_histErr: unknown) {
   207	            // History recording is best-effort inside bulk delete
   208	          }
   209	          deletedCount++;
   210	          deletedIds.push(memory.id);
   211	          causalEdges.deleteEdgesForMemory(String(memory.id));
   212	        }
   213	      }
   214	
   215	      // Mutation ledger entries written inside bulk transaction for atomicity with deletes.
   216	      for (const deletedId of deletedIds) {
   217	        const snapshot = hashById.get(deletedId) ?? null;
   218	        const ledgerRecorded = appendMutationLedgerSafe(database, {
   219	          mutationType: 'delete',
   220	          reason: 'memory_delete: bulk delete by spec folder',
   221	          priorHash: snapshot?.content_hash ?? null,
   222	          newHash: mutationLedger.computeHash(`bulk-delete:${deletedId}:${Date.now()}`),
   223	          linkedMemoryIds: [deletedId],
   224	          decisionMeta: {
   225	            tool: 'memory_delete',
   226	            bulk: true,
   227	            specFolder,
   228	            checkpoint: checkpointName,
   229	            memoryId: deletedId,
   230	            filePath: snapshot?.file_path ?? null,
   231	          },
   232	          actor: 'mcp:memory_delete',
   233	        });
   234	        if (!ledgerRecorded) {
   235	          mutationLedgerWarning = 'Mutation ledger append failed; audit trail may be incomplete.';
   236	        }
   237	      }
   238	    });
   239	    bulkDeleteTx();
   240	  }
   241	
   242	  let postMutationFeedback: ReturnType<typeof buildMutationHookFeedback> | null = null;
   243	  if (deletedCount > 0) {
   244	    let postMutationHooks: import('./mutation-hooks.js').MutationHookResult;
   245	    try {
   246	      postMutationHooks = runPostMutationHooks('delete', { specFolder, deletedCount });
   247	    } catch (hookError: unknown) {
   248	      const msg = hookError instanceof Error ? hookError.message : String(hookError);
   249	      postMutationHooks = {
   250	        latencyMs: 0, triggerCacheCleared: false,
   251	        constitutionalCacheCleared: false, toolCacheInvalidated: 0,
   252	        graphSignalsCacheCleared: false, coactivationCacheCleared: false,
   253	        errors: [msg],
   254	      };
   255	    }
   256	    postMutationFeedback = buildMutationHookFeedback('delete', postMutationHooks);
   257	  }
   258	
   259	  const summary = deletedCount > 0
   260	    ? `Deleted ${deletedCount} memory(s)`
   261	    : 'No memories found to delete';
   262	
   263	  const hints: string[] = [];
   264	  if (checkpointName) {
   265	    hints.push(`Restore with: checkpoint_restore({ name: "${checkpointName}" })`);
   266	  }
   267	  if (deletedCount === 0) {
   268	    hints.push('Use memory_list() to find existing memories');
   269	  }
   270	  if (postMutationFeedback) {
   271	    hints.push(...postMutationFeedback.hints);
   272	  }
   273	  if (mutationLedgerWarning) {
   274	    hints.push(mutationLedgerWarning);
   275	  }
   276	
   277	  const data: Record<string, unknown> = { deleted: deletedCount };
   278	  if (checkpointName) {
   279	    data.checkpoint = checkpointName;
   280	    data.restoreCommand = `checkpoint_restore({ name: "${checkpointName}" })`;
   281	  }
   282	  if (postMutationFeedback) {
   283	    data.postMutationHooks = postMutationFeedback.data;
   284	  }
   285	  if (mutationLedgerWarning) {
   286	    data.warning = mutationLedgerWarning;
   287	  }
   288	
   289	  return createMCPSuccessResponse({
   290	    tool: 'memory_delete',
   291	    summary,
   292	    data,
   293	    hints,
   294	  });
   295	}
   296	
   297	/* ───────────────────────────────────────────────────────────────
   298	   EXPORTS
   299	──────────────────────────────────────────────────────────────── */
   300	
   301	export { handleMemoryDelete };

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: History
     3	// ───────────────────────────────────────────────────────────────
     4	// Tracks change history for memory entries (ADD, UPDATE, DELETE)
     5	// External packages
     6	import type Database from 'better-sqlite3';
     7	
     8	// Feature catalog: Per-memory history log
     9	
    10	
    11	/* ───────────────────────────────────────────────────────────────
    12	   1. INTERFACES
    13	----------------------------------------------------------------*/
    14	
    15	/**
    16	 * Describes the HistoryEntry shape.
    17	 */
    18	export interface HistoryEntry {
    19	  id: string;
    20	  memory_id: number;
    21	  spec_folder: string | null;
    22	  prev_value: string | null;
    23	  new_value: string | null;
    24	  event: 'ADD' | 'UPDATE' | 'DELETE';
    25	  timestamp: string;
    26	  is_deleted: number;
    27	  actor: string;
    28	}
    29	
    30	/**
    31	 * Describes the HistoryStats shape.
    32	 */
    33	export interface HistoryStats {
    34	  total: number;
    35	  adds: number;
    36	  updates: number;
    37	  deletes: number;
    38	}
    39	
    40	/**
    41	 * Normalized history event shape for lineage backfill/replay helpers.
    42	 */
    43	export interface HistoryLineageEvent {
    44	  id: string;
    45	  memoryId: number;
    46	  event: 'ADD' | 'UPDATE' | 'DELETE';
    47	  timestamp: string;
    48	  actor: string;
    49	  prevValue: string | null;
    50	  newValue: string | null;
    51	}
    52	
    53	export interface LineageTransitionAnchor {
    54	  memory_id: number;
    55	  event: 'ADD' | 'UPDATE' | 'DELETE';
    56	  timestamp: string;
    57	  actor: string;
    58	}
    59	
    60	/* ───────────────────────────────────────────────────────────────
    61	   2. MODULE STATE
    62	----------------------------------------------------------------*/
    63	
    64	let db: Database.Database | null = null;
    65	let insertHistoryStatement: Database.Statement | null = null;
    66	let resolveSpecFolderStatement: Database.Statement | null = null;
    67	let resolveHistorySpecFolderStatement: Database.Statement | null = null;
    68	const specFolderCache = new Map<number, string | null>();
    69	const SPEC_FOLDER_CACHE_MAX = 5000;
    70	
    71	/* ───────────────────────────────────────────────────────────────
    72	   3. INITIALIZATION
    73	----------------------------------------------------------------*/
    74	
    75	/**
    76	 * Provides the init helper.
    77	 */
    78	export function init(database: Database.Database): void {
    79	  db = database;
    80	
    81	  database.exec(`
    82	    CREATE TABLE IF NOT EXISTS memory_history (
    83	      id TEXT PRIMARY KEY,
    84	      memory_id INTEGER NOT NULL,
    85	      spec_folder TEXT,
    86	      prev_value TEXT,
    87	      new_value TEXT,
    88	      event TEXT NOT NULL CHECK(event IN ('ADD', 'UPDATE', 'DELETE')),
    89	      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    90	      is_deleted INTEGER DEFAULT 0,
    91	      actor TEXT DEFAULT 'system'
    92	    )
    93	  `);
    94	
    95	  // Migration: rebuild table when legacy constraints are detected.
    96	  // Removes: CHECK(actor IN ...) that blocked mcp:* actors,
    97	  // FOREIGN KEY that prevented DELETE history from surviving parent deletion.
    98	  const tableInfo = database.prepare(
    99	    "SELECT sql FROM sqlite_master WHERE type='table' AND name='memory_history'"
   100	  ).get() as { sql: string } | undefined;
   101	  if (tableInfo?.sql && (tableInfo.sql.includes('CHECK(actor IN') || tableInfo.sql.includes('FOREIGN KEY'))) {
   102	    const hasMemoryIndexTable = hasTable(database, 'memory_index');
   103	    database.exec(`
   104	      ALTER TABLE memory_history RENAME TO memory_history_old;
   105	      CREATE TABLE memory_history (
   106	        id TEXT PRIMARY KEY,
   107	        memory_id INTEGER NOT NULL,
   108	        spec_folder TEXT,
   109	        prev_value TEXT,
   110	        new_value TEXT,
   111	        event TEXT NOT NULL CHECK(event IN ('ADD', 'UPDATE', 'DELETE')),
   112	        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
   113	        is_deleted INTEGER DEFAULT 0,
   114	        actor TEXT DEFAULT 'system'
   115	      );
   116	    `);
   117	
   118	    if (hasMemoryIndexTable) {
   119	      database.exec(`
   120	        INSERT INTO memory_history (id, memory_id, spec_folder, prev_value, new_value, event, timestamp, is_deleted, actor)
   121	        SELECT h.id, h.memory_id, m.spec_folder, h.prev_value, h.new_value, h.event, h.timestamp, h.is_deleted, h.actor
   122	        FROM memory_history_old h
   123	        LEFT JOIN memory_index m ON m.id = h.memory_id;
   124	        DROP TABLE memory_history_old;
   125	      `);
   126	    } else {
   127	      database.exec(`
   128	        INSERT INTO memory_history (id, memory_id, spec_folder, prev_value, new_value, event, timestamp, is_deleted, actor)
   129	        SELECT id, memory_id, NULL, prev_value, new_value, event, timestamp, is_deleted, actor
   130	        FROM memory_history_old;
   131	        DROP TABLE memory_history_old;
   132	      `);
   133	    }
   134	  }
   135	
   136	  if (!hasColumn(database, 'memory_history', 'spec_folder')) {
   137	    database.exec('ALTER TABLE memory_history ADD COLUMN spec_folder TEXT');
   138	  }
   139	
   140	  if (hasTable(database, 'memory_index')) {
   141	    database.exec(`
   142	      UPDATE memory_history
   143	      SET spec_folder = (
   144	        SELECT m.spec_folder FROM memory_index m WHERE m.id = memory_history.memory_id
   145	      )
   146	      WHERE spec_folder IS NULL
   147	        AND EXISTS (SELECT 1 FROM memory_index m WHERE m.id = memory_history.memory_id)
   148	    `);
   149	  }
   150	
   151	  database.exec('CREATE INDEX IF NOT EXISTS idx_history_memory ON memory_history(memory_id, timestamp)');
   152	  database.exec('CREATE INDEX IF NOT EXISTS idx_history_timestamp ON memory_history(timestamp DESC)');
   153	  database.exec('CREATE INDEX IF NOT EXISTS idx_history_spec_folder ON memory_history(spec_folder, event, timestamp DESC)');
   154	
   155	  specFolderCache.clear();
   156	  insertHistoryStatement = database.prepare(`
   157	    INSERT INTO memory_history (id, memory_id, event, prev_value, new_value, actor, spec_folder)
   158	    VALUES (?, ?, ?, ?, ?, ?, ?)
   159	  `) as Database.Statement;
   160	  resolveSpecFolderStatement = database.prepare(
   161	    'SELECT spec_folder FROM memory_index WHERE id = ? LIMIT 1'
   162	  ) as Database.Statement;
   163	  resolveHistorySpecFolderStatement = database.prepare(`
   164	    SELECT spec_folder
   165	    FROM memory_history
   166	    WHERE memory_id = ?
   167	      AND spec_folder IS NOT NULL
   168	      AND trim(spec_folder) <> ''
   169	    ORDER BY timestamp DESC, rowid DESC
   170	    LIMIT 1
   171	  `) as Database.Statement;
   172	}
   173	
   174	function hasTable(database: Database.Database, tableName: string): boolean {
   175	  const row = database.prepare(
   176	    "SELECT 1 as present FROM sqlite_master WHERE type='table' AND name = ? LIMIT 1"
   177	  ).get(tableName) as { present?: number } | undefined;
   178	  return row?.present === 1;
   179	}
   180	
   181	function hasColumn(database: Database.Database, tableName: string, columnName: string): boolean {
   182	  const columns = database.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
   183	  return columns.some((column) => column.name === columnName);
   184	}
   185	
   186	function normalizeHistoryValue(value: unknown): string | null {
   187	  if (value === null || value === undefined) {
   188	    return null;
   189	  }
   190	
   191	  if (typeof value === 'string') {
   192	    return value;
   193	  }
   194	
   195	  if (
   196	    typeof value === 'number'
   197	    || typeof value === 'boolean'
   198	    || typeof value === 'bigint'
   199	  ) {
   200	    return String(value);
   201	  }
   202	
   203	  try {
   204	    return JSON.stringify(value);
   205	  } catch (_error: unknown) {
   206	    return String(value);
   207	  }
   208	}
   209	
   210	function normalizeSpecFolder(specFolder: string | null | undefined): string | null {
   211	  if (typeof specFolder !== 'string') {
   212	    return null;
   213	  }
   214	
   215	  const trimmed = specFolder.trim();
   216	  return trimmed.length > 0 ? trimmed : null;
   217	}
   218	
   219	function setSpecFolderCache(memoryId: number, specFolder: string | null): void {
   220	  if (!Number.isInteger(memoryId) || memoryId <= 0) {
   221	    return;
   222	  }
   223	
   224	  if (specFolderCache.size >= SPEC_FOLDER_CACHE_MAX) {
   225	    const oldestKey = specFolderCache.keys().next().value;
   226	    if (typeof oldestKey === 'number') {
   227	      specFolderCache.delete(oldestKey);
   228	    }
   229	  }
   230	
   231	  specFolderCache.set(memoryId, specFolder);
   232	}
   233	
   234	function resolveSpecFolder(memoryId: number, override?: string | null): string | null {
   235	  const normalizedOverride = normalizeSpecFolder(override);
   236	  if (normalizedOverride) {
   237	    setSpecFolderCache(memoryId, normalizedOverride);
   238	    return normalizedOverride;
   239	  }
   240	
   241	  const cached = specFolderCache.get(memoryId);
   242	  if (cached !== undefined) {
   243	    return cached;
   244	  }
   245	
   246	  if (!resolveSpecFolderStatement) {
   247	    return null;
   248	  }
   249	
   250	  const row = resolveSpecFolderStatement.get(memoryId) as { spec_folder?: string | null } | undefined;
   251	  const resolvedFromIndex = normalizeSpecFolder(row?.spec_folder ?? null);
   252	  if (resolvedFromIndex) {
   253	    setSpecFolderCache(memoryId, resolvedFromIndex);
   254	    return resolvedFromIndex;
   255	  }
   256	
   257	  if (!resolveHistorySpecFolderStatement) {
   258	    setSpecFolderCache(memoryId, null);
   259	    return null;
   260	  }

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts | sed -n '260,360p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts | sed -n '2328,2465p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  2328	      channel TEXT DEFAULT 'default',
  2329	      content_hash TEXT,
  2330	      provenance_source TEXT,
  2331	      provenance_actor TEXT,
  2332	      governed_at TEXT,
  2333	      retention_policy TEXT DEFAULT 'keep',
  2334	      delete_after TEXT,
  2335	      governance_metadata TEXT,
  2336	      expires_at DATETIME,
  2337	      confidence REAL DEFAULT 0.5,
  2338	      validation_count INTEGER DEFAULT 0,
  2339	      -- FSRS (Free Spaced Repetition Scheduler) columns for cognitive memory
  2340	      stability REAL DEFAULT 1.0,
  2341	      difficulty REAL DEFAULT 5.0,
  2342	      last_review TEXT,
  2343	      review_count INTEGER DEFAULT 0,
  2344	      file_mtime_ms INTEGER,
  2345	      is_archived INTEGER DEFAULT 0,
  2346	      document_type TEXT DEFAULT 'memory',
  2347	      spec_level INTEGER,
  2348	      content_text TEXT,
  2349	      quality_score REAL DEFAULT 0,
  2350	      quality_flags TEXT,
  2351	      parent_id INTEGER REFERENCES memory_index(id) ON DELETE CASCADE,
  2352	      chunk_index INTEGER,
  2353	      chunk_label TEXT,
  2354	      encoding_intent TEXT DEFAULT 'document',
  2355	      learned_triggers TEXT DEFAULT '[]',
  2356	      interference_score REAL DEFAULT 0,
  2357	      UNIQUE(spec_folder, file_path, anchor_id)
  2358	    )
  2359	  `);
  2360	
  2361	  // Create vec_memories virtual table (only if sqlite-vec is available)
  2362	  if (sqlite_vec_available) {
  2363	    const embedding_dim = get_embedding_dim();
  2364	    database.exec(`
  2365	      CREATE VIRTUAL TABLE vec_memories USING vec0(
  2366	        embedding FLOAT[${embedding_dim}]
  2367	      )
  2368	    `);
  2369	    database.exec(`
  2370	      CREATE TABLE IF NOT EXISTS vec_metadata (
  2371	        key TEXT PRIMARY KEY,
  2372	        value TEXT NOT NULL,
  2373	        created_at TEXT DEFAULT (datetime('now'))
  2374	      )
  2375	    `);
  2376	    database.prepare(`
  2377	      INSERT OR REPLACE INTO vec_metadata (key, value) VALUES ('embedding_dim', ?)
  2378	    `).run(String(embedding_dim));
  2379	    logger.info(`Created vec_memories table with dimension ${embedding_dim}`);
  2380	  }
  2381	
  2382	  // Create FTS5 virtual table (includes content_text for full-text search)
  2383	  database.exec(`
  2384	    CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(
  2385	      title, trigger_phrases, file_path, content_text,
  2386	      content='memory_index', content_rowid='id'
  2387	    )
  2388	  `);
  2389	
  2390	  // Create FTS5 sync triggers (includes content_text)
  2391	  database.exec(`
  2392	    CREATE TRIGGER IF NOT EXISTS memory_fts_insert AFTER INSERT ON memory_index BEGIN
  2393	      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
  2394	      VALUES (new.id, new.title, new.trigger_phrases, new.file_path, new.content_text);
  2395	    END
  2396	  `);
  2397	
  2398	  database.exec(`
  2399	    CREATE TRIGGER IF NOT EXISTS memory_fts_update AFTER UPDATE ON memory_index BEGIN
  2400	      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
  2401	      VALUES ('delete', old.id, old.title, old.trigger_phrases, old.file_path, old.content_text);
  2402	      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
  2403	      VALUES (new.id, new.title, new.trigger_phrases, new.file_path, new.content_text);
  2404	    END
  2405	  `);
  2406	
  2407	  database.exec(`
  2408	    CREATE TRIGGER IF NOT EXISTS memory_fts_delete AFTER DELETE ON memory_index BEGIN
  2409	      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
  2410	      VALUES ('delete', old.id, old.title, old.trigger_phrases, old.file_path, old.content_text);
  2411	    END
  2412	  `);
  2413	
  2414	  // Create companion tables
  2415	  ensureCompanionTables(database);
  2416	  ensureLineageTables(database);
  2417	  ensureGovernanceTables(database);
  2418	  ensureSharedSpaceTables(database);
  2419	
  2420	  // the rollout (REQ-S2-001) — create embedding_cache table
  2421	  ensureEmbeddingCacheSchema(database);
  2422	
  2423	  // Create memory_index-specific indexes (not IF NOT EXISTS because this is a fresh DB)
  2424	  database.exec(`
  2425	    CREATE INDEX idx_spec_folder ON memory_index(spec_folder);
  2426	    CREATE INDEX idx_created_at ON memory_index(created_at);
  2427	    CREATE INDEX idx_importance ON memory_index(importance_weight DESC);
  2428	    CREATE INDEX idx_embedding_status ON memory_index(embedding_status);
  2429	    CREATE INDEX idx_retry_eligible ON memory_index(embedding_status, retry_count, last_retry_at)
  2430	  `);
  2431	
  2432	  database.exec(`
  2433	    CREATE INDEX IF NOT EXISTS idx_importance_tier ON memory_index(importance_tier);
  2434	    CREATE INDEX IF NOT EXISTS idx_access_importance ON memory_index(access_count DESC, importance_weight DESC);
  2435	    CREATE INDEX IF NOT EXISTS idx_memories_scope ON memory_index(spec_folder, session_id, context_type);
  2436	    CREATE INDEX IF NOT EXISTS idx_memories_governed_scope ON memory_index(tenant_id, user_id, agent_id, session_id, shared_space_id);
  2437	    CREATE INDEX IF NOT EXISTS idx_channel ON memory_index(channel);
  2438	    CREATE INDEX IF NOT EXISTS idx_spec_folder_created_at ON memory_index(spec_folder, created_at DESC);
  2439	    CREATE INDEX IF NOT EXISTS idx_trigger_cache_source
  2440	      ON memory_index(embedding_status, id)
  2441	      WHERE embedding_status = 'success'
  2442	        AND trigger_phrases IS NOT NULL
  2443	        AND trigger_phrases != '[]'
  2444	        AND trigger_phrases != '';
  2445	  `);
  2446	
  2447	  database.exec(`
  2448	    CREATE INDEX IF NOT EXISTS idx_file_path ON memory_index(file_path);
  2449	    CREATE INDEX IF NOT EXISTS idx_canonical_file_path ON memory_index(canonical_file_path);
  2450	    CREATE INDEX IF NOT EXISTS idx_spec_canonical_path ON memory_index(spec_folder, canonical_file_path);
  2451	    CREATE INDEX IF NOT EXISTS idx_save_parent_canonical_path ON memory_index(spec_folder, canonical_file_path, id DESC)
  2452	      WHERE parent_id IS NULL;
  2453	    CREATE INDEX IF NOT EXISTS idx_content_hash ON memory_index(content_hash);
  2454	    CREATE INDEX IF NOT EXISTS idx_save_parent_content_hash_scope ON memory_index(
  2455	      spec_folder,
  2456	      content_hash,
  2457	      embedding_status,
  2458	      tenant_id,
  2459	      user_id,
  2460	      agent_id,
  2461	      session_id,
  2462	      shared_space_id,
  2463	      id DESC
  2464	    )
  2465	      WHERE parent_id IS NULL;

 succeeded in 0ms:
   260	  }
   261	
   262	  const historyRow = resolveHistorySpecFolderStatement.get(memoryId) as { spec_folder?: string | null } | undefined;
   263	  const resolved = normalizeSpecFolder(historyRow?.spec_folder ?? null);
   264	  setSpecFolderCache(memoryId, resolved);
   265	  return resolved;
   266	}
   267	
   268	function getDatabase(): Database.Database {
   269	  if (!db) throw new Error('[history] Database not initialized. Call init(db) first.');
   270	  return db;
   271	}
   272	
   273	/* ───────────────────────────────────────────────────────────────
   274	   4. UUID GENERATION
   275	----------------------------------------------------------------*/
   276	
   277	/**
   278	 * Provides the generateUuid helper.
   279	 */
   280	export function generateUuid(): string {
   281	  // Generate a v4 UUID (xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx)
   282	  const hex = '0123456789abcdef';
   283	  const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
   284	  let uuid = '';
   285	  for (let i = 0; i < template.length; i++) {
   286	    const c = template[i];
   287	    if (c === 'x') {
   288	      uuid += hex[Math.floor(Math.random() * 16)];
   289	    } else if (c === 'y') {
   290	      // RFC 4122 variant: 8, 9, a, or b
   291	      uuid += hex[(Math.floor(Math.random() * 4) + 8)];
   292	    } else {
   293	      uuid += c;
   294	    }
   295	  }
   296	  return uuid;
   297	}
   298	
   299	/* ───────────────────────────────────────────────────────────────
   300	   5. HISTORY OPERATIONS
   301	----------------------------------------------------------------*/
   302	
   303	/**
   304	 * Provides the recordHistory helper.
   305	 */
   306	export function recordHistory(
   307	  memoryId: number,
   308	  event: 'ADD' | 'UPDATE' | 'DELETE',
   309	  prevValue: unknown,
   310	  newValue: unknown,
   311	  actor: string,
   312	  specFolder?: string | null,
   313	): string {
   314	  const database = getDatabase();
   315	  const id = generateUuid();
   316	  const prevValueText = normalizeHistoryValue(prevValue);
   317	  const newValueText = normalizeHistoryValue(newValue);
   318	  const normalizedActor = actor.trim() || 'system';
   319	  const resolvedSpecFolder = resolveSpecFolder(memoryId, specFolder);
   320	
   321	  if (!insertHistoryStatement) {
   322	    insertHistoryStatement = database.prepare(`
   323	      INSERT INTO memory_history (id, memory_id, event, prev_value, new_value, actor, spec_folder)
   324	      VALUES (?, ?, ?, ?, ?, ?, ?)
   325	    `) as Database.Statement;
   326	  }
   327	
   328	  insertHistoryStatement.run(
   329	    id,
   330	    memoryId,
   331	    event,
   332	    prevValueText,
   333	    newValueText,
   334	    normalizedActor,
   335	    resolvedSpecFolder,
   336	  );
   337	
   338	  return id;
   339	}
   340	
   341	/**
   342	 * Provides the getHistory helper.
   343	 */
   344	export function getHistory(memoryId: number, limit?: number): HistoryEntry[] {
   345	  const database = getDatabase();
   346	
   347	  const sql = limit != null
   348	    ? 'SELECT * FROM memory_history WHERE memory_id = ? ORDER BY timestamp DESC, rowid DESC LIMIT ?'
   349	    : 'SELECT * FROM memory_history WHERE memory_id = ? ORDER BY timestamp DESC, rowid DESC';
   350	
   351	  const params: (number)[] = limit != null ? [memoryId, limit] : [memoryId];
   352	
   353	  return database.prepare(sql).all(...params) as HistoryEntry[];
   354	}
   355	
   356	/**
   357	 * Returns chronological history events for lineage backfill/replay helpers.
   358	 */
   359	export function getHistoryEventsForLineage(
   360	  memoryId: number,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts | sed -n '200,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   200	 */
   201	export function requiresGovernedIngest(input: GovernedIngestInput): boolean {
   202	  const scope = normalizeScopeContext(input);
   203	  return Object.values(scope).some((value) => typeof value === 'string')
   204	    || typeof input.provenanceSource === 'string'
   205	    || typeof input.provenanceActor === 'string'
   206	    || typeof input.governedAt === 'string'
   207	    || input.retentionPolicy === 'ephemeral'
   208	    || input.retentionPolicy === 'shared'
   209	    || typeof input.deleteAfter === 'string';
   210	}
   211	
   212	/**
   213	 * Validate governed-ingest metadata and return normalized persistence fields.
   214	 *
   215	 * @param input - Candidate ingest metadata.
   216	 * @returns Validation result with normalized scope, provenance, and retention data.
   217	 */
   218	export function validateGovernedIngest(input: GovernedIngestInput): GovernanceDecision {
   219	  const scope = normalizeScopeContext(input);
   220	  const issues: string[] = [];
   221	  const governedAt = normalizeIsoTimestamp(input.governedAt) ?? new Date().toISOString();
   222	  const deleteAfter = normalizeIsoTimestamp(input.deleteAfter) ?? null;
   223	  const retentionPolicy: RetentionPolicy = input.retentionPolicy === 'ephemeral' || input.retentionPolicy === 'shared'
   224	    ? input.retentionPolicy
   225	    : 'keep';
   226	  const provenanceSource = normalizeId(input.provenanceSource) ?? '';
   227	  const provenanceActor = normalizeId(input.provenanceActor) ?? '';
   228	
   229	  if (!requiresGovernedIngest(input)) {
   230	    // B8: Return null instead of empty string for optional scope fields
   231	    // when governance is not required, to avoid persisting false-y placeholders.
   232	    return {
   233	      allowed: true,
   234	      normalized: {
   235	        tenantId: scope.tenantId || null,
   236	        userId: scope.userId || null,
   237	        agentId: scope.agentId || null,
   238	        sessionId: scope.sessionId || null,
   239	        sharedSpaceId: scope.sharedSpaceId || null,
   240	        provenanceSource: provenanceSource || null,
   241	        provenanceActor: provenanceActor || null,
   242	        governedAt,
   243	        retentionPolicy,
   244	        deleteAfter,
   245	      },
   246	      issues,
   247	    };
   248	  }
   249	
   250	  if (!scope.tenantId) issues.push('tenantId is required for governed ingest');
   251	  if (!scope.sessionId) issues.push('sessionId is required for governed ingest');
   252	  if (!scope.userId && !scope.agentId) issues.push('userId or agentId is required for governed ingest');
   253	  if (!provenanceSource) issues.push('provenanceSource is required for governed ingest');
   254	  if (!provenanceActor) issues.push('provenanceActor is required for governed ingest');
   255	  if (deleteAfter && new Date(deleteAfter).getTime() <= new Date(governedAt).getTime()) {
   256	    issues.push('deleteAfter must be later than governedAt');
   257	  }
   258	  // H21 FIX: Require valid future deleteAfter for ephemeral retention policy
   259	  // Without this, ephemeral rows are never swept since sweeps key off delete_after
   260	  if (retentionPolicy === 'ephemeral' && !deleteAfter) {
   261	    issues.push('deleteAfter is required for ephemeral retention policy');
   262	  }
   263	
   264	  return {
   265	    allowed: issues.length === 0,
   266	    reason: issues[0],
   267	    issues,
   268	    normalized: {
   269	      tenantId: scope.tenantId ?? '',
   270	      userId: scope.userId,
   271	      agentId: scope.agentId,
   272	      sessionId: scope.sessionId ?? '',
   273	      sharedSpaceId: scope.sharedSpaceId,
   274	      provenanceSource,
   275	      provenanceActor,
   276	      governedAt,
   277	      retentionPolicy,
   278	      deleteAfter,
   279	    },
   280	  };
   281	}
   282	
   283	/**
   284	 * Map a governance decision into memory-index column values.
   285	 *
   286	 * @param decision - Normalized governance decision from ingest validation.
   287	 * @returns Column/value pairs used after memory insertion.
   288	 */
   289	export function buildGovernancePostInsertFields(decision: GovernanceDecision): Record<string, unknown> {
   290	  return {
   291	    tenant_id: decision.normalized.tenantId || null,
   292	    user_id: decision.normalized.userId ?? null,
   293	    agent_id: decision.normalized.agentId ?? null,
   294	    session_id: decision.normalized.sessionId || null,
   295	    shared_space_id: decision.normalized.sharedSpaceId ?? null,
   296	    provenance_source: decision.normalized.provenanceSource || null,
   297	    provenance_actor: decision.normalized.provenanceActor || null,
   298	    governed_at: decision.normalized.governedAt,
   299	    retention_policy: decision.normalized.retentionPolicy,
   300	    delete_after: decision.normalized.deleteAfter,
   301	    governance_metadata: JSON.stringify({
   302	      tenantId: decision.normalized.tenantId || null,
   303	      userId: decision.normalized.userId ?? null,
   304	      agentId: decision.normalized.agentId ?? null,
   305	      sessionId: decision.normalized.sessionId || null,
   306	      sharedSpaceId: decision.normalized.sharedSpaceId ?? null,
   307	      provenanceSource: decision.normalized.provenanceSource || null,
   308	      provenanceActor: decision.normalized.provenanceActor || null,
   309	      governedAt: decision.normalized.governedAt,
   310	      retentionPolicy: decision.normalized.retentionPolicy,
   311	      deleteAfter: decision.normalized.deleteAfter,
   312	    }),
   313	  };
   314	}
   315	
   316	/**
   317	 * Ensure governance and shared-space audit tables exist before writes.
   318	 *
   319	 * @param database - Database connection that stores governance state.
   320	 */

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ────────────────────────────────────────────────────────────────
     2	// MODULE: Memory Bulk Delete
     3	// ────────────────────────────────────────────────────────────────
     4	// Tier-based bulk deletion of memories with safety gates.
     5	// Eliminates the need for direct DB scripts when cleaning up
     6	// Deprecated/temporary memories at scale.
     7	import { checkDatabaseUpdated } from '../core/index.js';
     8	import * as vectorIndex from '../lib/search/vector-index.js';
     9	import * as checkpoints from '../lib/storage/checkpoints.js';
    10	import * as mutationLedger from '../lib/storage/mutation-ledger.js';
    11	import * as causalEdges from '../lib/storage/causal-edges.js';
    12	import { createMCPErrorResponse, createMCPSuccessResponse } from '../lib/response/envelope.js';
    13	import { toErrorMessage } from '../utils/index.js';
    14	
    15	import { recordHistory } from '../lib/storage/history.js';
    16	import { MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS } from '../schemas/tool-input-schemas.js';
    17	import { appendMutationLedgerSafe } from './memory-crud-utils.js';
    18	import { runPostMutationHooks } from './mutation-hooks.js';
    19	import { buildMutationHookFeedback } from '../hooks/mutation-feedback.js';
    20	
    21	import type { MCPResponse } from './types.js';
    22	
    23	// Feature catalog: Tier-based bulk deletion (memory_bulk_delete)
    24	// Feature catalog: Per-memory history log
    25	
    26	
    27	/* ───────────────────────────────────────────────────────────────
    28	   1. TYPES
    29	──────────────────────────────────────────────────────────────── */
    30	
    31	interface BulkDeleteArgs {
    32	  tier: string;
    33	  specFolder?: string;
    34	  confirm: boolean;
    35	  olderThanDays?: number;
    36	  skipCheckpoint?: boolean;
    37	}
    38	
    39	/* ───────────────────────────────────────────────────────────────
    40	   2. HANDLER
    41	──────────────────────────────────────────────────────────────── */
    42	
    43	async function handleMemoryBulkDelete(args: BulkDeleteArgs): Promise<MCPResponse> {
    44	  const restoreBarrier = checkpoints.getRestoreBarrierStatus();
    45	  if (restoreBarrier) {
    46	    return createMCPErrorResponse({
    47	      tool: 'memory_bulk_delete',
    48	      error: restoreBarrier.message,
    49	      code: restoreBarrier.code,
    50	      details: {
    51	        tier: args.tier ?? null,
    52	        specFolder: args.specFolder ?? null,
    53	      },
    54	      recovery: {
    55	        hint: 'Retry memory_bulk_delete after checkpoint_restore maintenance completes.',
    56	        actions: ['Wait for the restore to finish', 'Retry the bulk delete request'],
    57	        severity: 'warning',
    58	      },
    59	    });
    60	  }
    61	
    62	  await checkDatabaseUpdated();
    63	
    64	  const { tier, specFolder, confirm, olderThanDays, skipCheckpoint = false } = args;
    65	
    66	  // Validation
    67	  if (!tier || typeof tier !== 'string') {
    68	    throw new Error('tier is required and must be a string');
    69	  }
    70	
    71	  const validTiers = ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'];
    72	  if (!validTiers.includes(tier)) {
    73	    throw new Error(`Invalid tier: "${tier}". Must be one of: ${validTiers.join(', ')}`);
    74	  }
    75	
    76	  if (!confirm) {
    77	    throw new Error('Bulk delete requires confirm: true as a safety gate');
    78	  }
    79	
    80	  // Safety: refuse to bulk-delete constitutional or critical tiers without explicit specFolder scope
    81	  if ((tier === 'constitutional' || tier === 'critical') && !specFolder) {
    82	    throw new Error(`Bulk delete of "${tier}" tier requires specFolder scope for safety. Use memory_delete for individual deletions.`);
    83	  }
    84	
    85	  if ((tier === 'constitutional' || tier === 'critical') && skipCheckpoint) {
    86	    throw new Error(`skipCheckpoint is not allowed for "${tier}" tier. Checkpoint is mandatory for high-safety tiers.`);
    87	  }
    88	
    89	  if (
    90	    olderThanDays !== undefined
    91	    && (!Number.isInteger(olderThanDays) || olderThanDays < MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS)
    92	  ) {
    93	    throw new Error(`olderThanDays must be an integer >= ${MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS} when provided`);
    94	  }
    95	
    96	  const database = vectorIndex.getDb();
    97	  if (!database) {
    98	    return createMCPErrorResponse({
    99	      tool: 'memory_bulk_delete',
   100	      error: 'Memory bulk delete aborted: database unavailable',
   101	      code: 'E_DB_UNAVAILABLE',
   102	      details: {
   103	        tier,
   104	        specFolder: specFolder || null,
   105	        olderThanDays: olderThanDays || null,
   106	      },
   107	      recovery: {
   108	        hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database.',
   109	        actions: ['Restart the MCP server', 'Call memory_index_scan()'],
   110	        severity: 'error',
   111	      },
   112	    });
   113	  }
   114	
   115	  // Build query to count affected memories
   116	  let countSql = 'SELECT COUNT(*) as count FROM memory_index WHERE importance_tier = ?';
   117	  const countParams: unknown[] = [tier];
   118	
   119	  if (specFolder) {
   120	    countSql += ' AND spec_folder = ?';
   121	    countParams.push(specFolder);
   122	  }
   123	
   124	  if (olderThanDays !== undefined) {
   125	    countSql += ` AND created_at < datetime('now', '-' || ? || ' days')`;
   126	    countParams.push(olderThanDays);
   127	  }
   128	
   129	  const countResult = database.prepare(countSql).get(...countParams) as { count: number };
   130	  const affectedCount = countResult.count;
   131	
   132	  if (affectedCount === 0) {
   133	    return createMCPSuccessResponse({
   134	      tool: 'memory_bulk_delete',
   135	      summary: `No memories found with tier="${tier}"${specFolder ? ` in folder "${specFolder}"` : ''}${olderThanDays ? ` older than ${olderThanDays} days` : ''}`,
   136	      data: { deleted: 0, tier, specFolder: specFolder || null },
   137	      hints: ['Use memory_list() to browse existing memories'],
   138	    });
   139	  }
   140	
   141	  // Create auto-checkpoint before bulk deletion (unless explicitly skipped)
   142	  let checkpointName: string | null = null;
   143	  if (!skipCheckpoint) {
   144	    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
   145	    const proposedCheckpointName = `pre-bulk-delete-${tier}-${timestamp}`;
   146	
   147	    try {
   148	      const checkpoint = checkpoints.createCheckpoint({
   149	        name: proposedCheckpointName,
   150	        specFolder,
   151	        metadata: {
   152	          reason: `auto-checkpoint before bulk delete of ${affectedCount} "${tier}" memories`,
   153	          tier,
   154	          affectedCount,
   155	          olderThanDays: olderThanDays || null,
   156	        },
   157	      });
   158	
   159	      if (!checkpoint) {
   160	        const checkpointError = `Checkpoint creation failed before deleting ${tier} memories`;
   161	        if (tier === 'constitutional' || tier === 'critical') {
   162	          throw new Error(`${checkpointError}. Aborting high-safety bulk delete.`);
   163	        }
   164	        console.warn(`[memory-bulk-delete] ${checkpointError}. Proceeding without rollback.`);
   165	      } else {
   166	        checkpointName = checkpoint.name;
   167	        console.error(`[memory-bulk-delete] Created checkpoint: ${checkpointName}`);
   168	      }
   169	    } catch (cpErr: unknown) {
   170	      const message = toErrorMessage(cpErr);
   171	      console.error(`[memory-bulk-delete] Failed to create checkpoint: ${message}`);
   172	      // High-safety tiers require a valid checkpoint.
   173	      if (tier === 'constitutional' || tier === 'critical') {
   174	        throw new Error(`Failed to create mandatory checkpoint for "${tier}" tier: ${message}`);
   175	      }
   176	      // Lower tiers can proceed with explicit no-rollback notice.
   177	      checkpointName = null;
   178	    }
   179	  } else {
   180	    console.error('[memory-bulk-delete] Checkpoint creation skipped by caller (skipCheckpoint=true)');
   181	  }
   182	
   183	  // Fetch IDs for deletion (needed for causal edge cleanup and ledger)
   184	  let selectSql = 'SELECT id, content_hash, file_path, spec_folder FROM memory_index WHERE importance_tier = ?';
   185	  const selectParams: unknown[] = [tier];
   186	
   187	  if (specFolder) {
   188	    selectSql += ' AND spec_folder = ?';
   189	    selectParams.push(specFolder);
   190	  }
   191	
   192	  if (olderThanDays !== undefined) {
   193	    selectSql += ` AND created_at < datetime('now', '-' || ? || ' days')`;
   194	    selectParams.push(olderThanDays);
   195	  }
   196	
   197	  const memoriesToDelete = database.prepare(selectSql).all(...selectParams) as Array<{
   198	    id: number;
   199	    content_hash: string | null;
   200	    file_path: string | null;
   201	    spec_folder: string | null;
   202	  }>;
   203	
   204	  // Perform deletion in a transaction
   205	  let deletedCount = 0;
   206	  const deletedIds: number[] = [];
   207	
   208	  causalEdges.init(database);
   209	
   210	  const bulkDeleteTx = database.transaction(() => {
   211	    for (const memory of memoriesToDelete) {
   212	      if (vectorIndex.deleteMemory(memory.id)) {
   213	        // Record DELETE history after confirmed delete (no FK, history rows survive).
   214	        try {
   215	          recordHistory(
   216	            memory.id,
   217	            'DELETE',
   218	            memory.file_path ?? null,
   219	            null,
   220	            'mcp:memory_bulk_delete',
   221	            memory.spec_folder ?? null,
   222	          );
   223	        } catch (_histErr: unknown) {
   224	          // History recording is best-effort inside bulk delete
   225	        }
   226	        deletedCount++;
   227	        deletedIds.push(memory.id);
   228	
   229	        // Clean up causal edges
   230	        // F-27 — Propagate edge-cleanup errors to fail the transaction.
   231	        // Previously errors were caught and logged, leaving orphan causal edges
   232	        // When memory rows were successfully deleted but edge cleanup failed.
   233	        causalEdges.deleteEdgesForMemory(String(memory.id));
   234	      }
   235	    }
   236	  });
   237	
   238	  bulkDeleteTx();
   239	
   240	  // Record in mutation ledger (single entry for bulk operation)
   241	  const ledgerRecorded = appendMutationLedgerSafe(database, {
   242	    mutationType: 'delete',
   243	    reason: `memory_bulk_delete: deleted ${deletedCount} memories with tier="${tier}"`,
   244	    priorHash: null,
   245	    newHash: mutationLedger.computeHash(`bulk-delete-tier:${tier}:${deletedCount}:${Date.now()}`),
   246	    linkedMemoryIds: deletedIds.slice(0, 50), // Cap at 50 to avoid bloating ledger
   247	    decisionMeta: {
   248	      tool: 'memory_bulk_delete',
   249	      tier,
   250	      specFolder: specFolder || null,
   251	      olderThanDays: olderThanDays || null,
   252	      totalDeleted: deletedCount,
   253	      checkpoint: checkpointName,
   254	      skipCheckpoint,
   255	    },
   256	    actor: 'mcp:memory_bulk_delete',
   257	  });
   258	
   259	  // Invalidate caches
   260	  let postMutationFeedback: ReturnType<typeof buildMutationHookFeedback> | null = null;
   261	  if (deletedCount > 0) {
   262	    let postMutationHooks: import('./mutation-hooks.js').MutationHookResult;
   263	    try {
   264	      postMutationHooks = runPostMutationHooks('bulk-delete', { specFolder, tier, deletedCount });
   265	    } catch (hookError: unknown) {
   266	      const msg = hookError instanceof Error ? hookError.message : String(hookError);
   267	      postMutationHooks = {
   268	        latencyMs: 0, triggerCacheCleared: false,
   269	        constitutionalCacheCleared: false, toolCacheInvalidated: 0,
   270	        graphSignalsCacheCleared: false, coactivationCacheCleared: false,
   271	        errors: [msg],
   272	      };
   273	    }
   274	    postMutationFeedback = buildMutationHookFeedback('bulk-delete', postMutationHooks);
   275	  }
   276	
   277	  const summary = `Deleted ${deletedCount} "${tier}" memory(s)${specFolder ? ` from "${specFolder}"` : ''}${olderThanDays ? ` older than ${olderThanDays} days` : ''}`;
   278	
   279	  const hints: string[] = [];
   280	  if (checkpointName) {
   281	    hints.push(`Restore with: checkpoint_restore({ name: "${checkpointName}" })`);
   282	  } else if (skipCheckpoint) {
   283	    hints.push('Checkpoint skipped: restore is not available for this operation');
   284	  }
   285	  if (postMutationFeedback) {
   286	    hints.push(...postMutationFeedback.hints);
   287	  }
   288	  if (!ledgerRecorded) {
   289	    hints.push('Mutation ledger append failed; audit trail may be incomplete.');
   290	  }
   291	  hints.push(`Run memory_index_scan({ force: true }) to re-index if needed`);
   292	
   293	  const data: Record<string, unknown> = {
   294	    deleted: deletedCount,
   295	    tier,
   296	    specFolder: specFolder || null,
   297	    olderThanDays: olderThanDays || null,
   298	    skipCheckpoint,
   299	  };
   300	  if (checkpointName) {
   301	    data.checkpoint = checkpointName;
   302	    data.restoreCommand = `checkpoint_restore({ name: "${checkpointName}" })`;
   303	  }
   304	  if (postMutationFeedback) {
   305	    data.postMutationHooks = postMutationFeedback.data;
   306	  }
   307	  if (!ledgerRecorded) {
   308	    data.warning = 'Mutation ledger append failed; audit trail may be incomplete.';
   309	  }
   310	
   311	  return createMCPSuccessResponse({
   312	    tool: 'memory_bulk_delete',
   313	    summary,
   314	    data,
   315	    hints,
   316	  });
   317	}
   318	
   319	/* ───────────────────────────────────────────────────────────────
   320	   3. EXPORTS

codex
I’m checking topic-key stability next, because Mnemosyne’s only visible “key” is a basename-derived project name, while Public appears to use stronger canonical identifiers at both file and metadata levels.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Canonical Path
     3	// ───────────────────────────────────────────────────────────────
     4	import fs from 'fs';
     5	import path from 'path';
     6	
     7	/** Returns true for errors indicating a missing path segment (ENOENT/ENOTDIR). */
     8	function isMissingPathError(err: unknown): boolean {
     9	  const code = (err as NodeJS.ErrnoException | undefined)?.code;
    10	  return code === 'ENOENT' || code === 'ENOTDIR';
    11	}
    12	
    13	function normalizePathKey(filePath: string): string {
    14	  const normalized = filePath.replace(/\\/g, '/');
    15	  return process.platform === 'win32' ? normalized.toLowerCase() : normalized;
    16	}
    17	
    18	/**
    19	 * Canonical identity for path deduplication.
    20	 *
    21	 * - Uses realpath when possible so symlink aliases collapse to one key.
    22	 * - Falls back to resolved absolute path when file does not exist.
    23	 */
    24	export function getCanonicalPathKey(filePath: string): string {
    25	  try {
    26	    return normalizePathKey(fs.realpathSync(filePath));
    27	  } catch {
    28	    return normalizePathKey(path.resolve(filePath));
    29	  }
    30	}
    31	
    32	/**
    33	 * Resolve symlinks before spec-folder extraction so that paths through
    34	 * symlinked directories (e.g. `.claude/specs → ../.opencode/specs`)
    35	 * produce the same spec_folder string as the real path.
    36	 *
    37	 * Handles the atomic-save case where the file doesn't exist yet by
    38	 * walking up to the nearest existing ancestor and resolving from there.
    39	 */
    40	export function canonicalizeForSpecFolderExtraction(filePath: string): string {
    41	  try {
    42	    return fs.realpathSync(filePath).replace(/\\/g, '/');
    43	  } catch (err: unknown) {
    44	    if (!isMissingPathError(err)) {
    45	      // EACCES, ELOOP, EPERM — do not parent-walk, return resolved path
    46	      return path.resolve(filePath).replace(/\\/g, '/');
    47	    }
    48	    // ENOENT/ENOTDIR — file doesn't exist yet (atomic save flow)
    49	    const segments: string[] = [];
    50	    let probe = path.resolve(filePath);
    51	    while (!fs.existsSync(probe)) {
    52	      const parent = path.dirname(probe);
    53	      if (parent === probe) return path.resolve(filePath).replace(/\\/g, '/');
    54	      segments.unshift(path.basename(probe));
    55	      probe = parent;
    56	    }
    57	    try {
    58	      const canonicalBase = fs.realpathSync(probe);
    59	      return path.join(canonicalBase, ...segments).replace(/\\/g, '/');
    60	    } catch {
    61	      return path.resolve(filePath).replace(/\\/g, '/');
    62	    }
    63	  }
    64	}

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js | sed -n '100,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   100	        .replace(/[^a-z0-9\s]+/g, ' ')
   101	        .replace(/\s+/g, ' ')
   102	        .trim();
   103	}
   104	function canonicalizeTitleKey(title) {
   105	    return canonicalizePhraseKey(title).replace(/\b\d+\b/g, ' ').replace(/\s+/g, ' ').trim();
   106	}
   107	function isTempPath(candidatePath) {
   108	    const resolved = path.resolve(candidatePath);
   109	    return resolved === TEMP_ROOT || resolved.startsWith(`${TEMP_ROOT}${path.sep}`);
   110	}
   111	function isRepoMemoryFile(filePath) {
   112	    const normalized = normalizePath(path.resolve(filePath));
   113	    const repoRoot = normalizePath(path.resolve(LIVE_REPO_MEMORY_ROOT));
   114	    return normalized.startsWith(`${repoRoot}/`)
   115	        && normalized.includes('/memory/')
   116	        && normalized.endsWith('.md')
   117	        && !normalized.includes('/memory/.archive');
   118	}
   119	function isGlobalAutoMemoryFile(filePath) {
   120	    const normalized = normalizePath(path.resolve(filePath));
   121	    const globalRoot = normalizePath(path.resolve(GLOBAL_AUTO_MEMORY_ROOT));
   122	    return normalized.startsWith(`${globalRoot}/`)
   123	        && normalized.endsWith('.md')
   124	        && !normalized.includes('/.archive');
   125	}
   126	function isAllowedTargetFile(filePath) {
   127	    return isRepoMemoryFile(filePath)
   128	        || isGlobalAutoMemoryFile(filePath)
   129	        || isTempPath(filePath);
   130	}
   131	function isAllowedScanRoot(dirPath) {
   132	    const resolved = path.resolve(dirPath);
   133	    const normalized = normalizePath(resolved);
   134	    const repoRoot = normalizePath(path.resolve(LIVE_REPO_MEMORY_ROOT));
   135	    const globalRoot = normalizePath(path.resolve(GLOBAL_AUTO_MEMORY_ROOT));
   136	    return normalized === repoRoot
   137	        || normalized.startsWith(`${repoRoot}/`)
   138	        || normalized === globalRoot
   139	        || normalized.startsWith(`${globalRoot}/`)
   140	        || isTempPath(resolved);
   141	}
   142	function ensureAllowedScanRoot(dirPath) {
   143	    const resolved = path.resolve(PROJECT_ROOT, dirPath);
   144	    if (!isAllowedScanRoot(resolved)) {
   145	        throw new Error(`--path must resolve inside .opencode/specs, the global auto-memory directory, or a temp directory: ${dirPath}`);
   146	    }
   147	    return resolved;
   148	}
   149	function resolveReportPath(reportPath) {
   150	    if (path.isAbsolute(reportPath)) {
   151	        return reportPath;
   152	    }
   153	    return path.resolve(PROJECT_ROOT, reportPath);
   154	}
   155	function parseArgs(argv) {
   156	    let mode = 'dry-run';
   157	    const scanRoots = [];
   158	    let reportPath = null;
   159	    for (let index = 0; index < argv.length; index += 1) {
   160	        const arg = argv[index];
   161	        if (arg === '--help' || arg === '-h') {
   162	            console.log(HELP_TEXT);
   163	            process.exit(0);
   164	        }
   165	        if (arg === '--dry-run') {
   166	            mode = 'dry-run';
   167	            continue;
   168	        }
   169	        if (arg === '--apply') {
   170	            mode = 'apply';
   171	            continue;
   172	        }
   173	        if (arg === '--path') {
   174	            const value = argv[index + 1];
   175	            if (!value || value.startsWith('--')) {
   176	                throw new Error('--path requires a directory value');
   177	            }
   178	            scanRoots.push(ensureAllowedScanRoot(value));
   179	            index += 1;
   180	            continue;
   181	        }
   182	        if (arg === '--report') {
   183	            const value = argv[index + 1];
   184	            if (!value || value.startsWith('--')) {
   185	                throw new Error('--report requires a file path');
   186	            }
   187	            reportPath = resolveReportPath(value);
   188	            index += 1;
   189	            continue;
   190	        }
   191	        throw new Error(`Unknown argument: ${arg}`);
   192	    }
   193	    return {
   194	        mode,
   195	        scanRoots: scanRoots.length > 0 ? scanRoots : [LIVE_REPO_MEMORY_ROOT, GLOBAL_AUTO_MEMORY_ROOT],
   196	        reportPath,
   197	    };
   198	}
   199	function walkFiles(rootDir) {
   200	    const results = [];
   201	    const queue = [rootDir];
   202	    while (queue.length > 0) {
   203	        const currentDir = queue.pop();
   204	        if (!currentDir) {
   205	            continue;
   206	        }
   207	        let entries;
   208	        try {
   209	            entries = fs.readdirSync(currentDir, { withFileTypes: true });
   210	        }
   211	        catch {
   212	            continue;
   213	        }
   214	        for (const entry of entries) {
   215	            const fullPath = path.join(currentDir, entry.name);
   216	            if (entry.isDirectory()) {
   217	                if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.archive')) {
   218	                    continue;
   219	                }
   220	                queue.push(fullPath);

exec
/bin/zsh -lc "rg -n \"canonicalizePhraseKey|canonical_duplicate|title_overlap|trigger phrase|topic key|canonical path key|basename|directory-name|projectDir|projectRaw|core=true\" .opencode/skill/system-spec-kit/scripts/dist/memory .opencode/skill/system-spec-kit/mcp_server .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1298:        console.error(`[context-server] Failed to index ${path.basename(filePath)}: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:64:  return filePath === '__job__' ? filePath : path.basename(filePath || '');
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.d.ts:3:type RemovalReason = 'empty_or_invalid' | 'sanitizer' | 'canonical_duplicate' | 'title_overlap';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:8:// Feature catalog: BM25 trigger phrase re-index gate
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:337:      summary: 'No matching trigger phrases found',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:349:        'Ensure memories have trigger phrases defined',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:496:    : `Matched ${formattedResults.length} memories via trigger phrases`;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:28:  let projectDir = targetDir.replace(/(.+?)\/+$/, "$1");
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:29:  const projectRaw = path.basename(projectDir);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:30:  const project = projectRaw === "global" ? "default" : (projectRaw || "default");
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:140:          "Store a project memory: a decision, preference, or important context. One concise concept per memory. Set core=true for critical context that should always be available in every session (use sparingly).",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:162:          "Store a cross-project memory: personal preferences, coding style, tool choices. Set core=true for critical cross-project context that should always be available.",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:55:| Project | `<directory-name>` | Sessions in the same project |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:57:| Core (project) | `<directory-name>` (tagged `core`) | Sessions + survives compaction |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:74:- Mark critical, always-relevant context as core (core=true) — but use sparingly.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:152:    console.error(`[memory-save] Using deferred indexing for ${path.basename(filePath)}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:107:    title: parsed.title || path.basename(parsed.filePath, path.extname(parsed.filePath)),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:137:      console.error(`[memory-save] Embedding cache HIT for ${path.basename(filePath)} (async mode)`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:140:      console.error(`[memory-save] T306: Async embedding mode - deferring embedding for ${path.basename(filePath)}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:150:        console.error(`[memory-save] Embedding cache HIT for ${path.basename(filePath)}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:159:          console.error(`[memory-save] Embedding cache MISS+GENERATE for ${path.basename(filePath)}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:173:          console.warn(`[memory-save] Embedding failed for ${path.basename(filePath)}: ${embeddingFailureReason}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:179:        `[memory-save] Embedding failed for ${path.basename(filePath)}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:209:  console.error(`[memory-save] Embedding cache STORE after quality gate for ${path.basename(filePath)}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:151:      // T2-6 — BM25 index stores title + trigger phrases; must re-index when either changes
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:205:    console.warn(`[memory] Warning for ${path.basename(parsed.filePath)}:`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:224:      console.error(`[memory-save] V-rule hard block for ${path.basename(parsed.filePath)}: ${failedRuleIds.join(', ')}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:252:      console.warn(`[memory-save] V-rule index block for ${path.basename(parsed.filePath)}: ${vRuleDisposition.indexBlockingRuleIds.join(', ')}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:281:    console.warn(`[memory-save] ${warning} ${path.basename(parsed.filePath)}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:312:        `[memory-save] spec-doc-health annotation skipped for ${path.basename(parsed.filePath)}: ${message}`
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:636:        console.warn(`[memory-save] V-rule warn-only (spec doc) for ${path.basename(filePath)}: ${qualityLoopResult.rejectionReason}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:657:        console.warn(`[memory-save] Sufficiency warn-only (spec doc) for ${path.basename(filePath)}: ${sufficiencyResult.reasons.join('; ')}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:666:          `[memory-save] Template contract bypassed in ${MANUAL_FALLBACK_SOURCE_CLASSIFICATION} mode for ${path.basename(filePath)}: ${templateContract.violations.map((v: { message?: string; rule?: string }) => v.message || v.rule).join('; ')}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:670:          `[memory-save] Template contract warn-only (spec doc) for ${path.basename(filePath)}: ${templateContract.violations.map((v: { message?: string; rule?: string }) => v.message || v.rule).join('; ')}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:765:          console.error(`[memory-save] TM-04: Quality gate REJECTED save for ${path.basename(filePath)}: ${qualityGateResult.reasons.join('; ')}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:784:          console.warn(`[memory-save] TM-04: Quality gate warn-only (spec doc) for ${path.basename(filePath)}: ${qualityGateResult.reasons.join('; ')}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:788:          console.warn(`[memory-save] TM-04: Quality gate WARN-ONLY for ${path.basename(filePath)}: ${qualityGateResult.reasons.join('; ')}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1063:    console.error(`[memory-save] Quality loop applied ${prepared.qualityLoopResult.fixes.length} auto-fix(es) for ${path.basename(filePath)}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1562:        console.error(`[memory-save] Quality loop applied ${prepared.qualityLoopResult.fixes.length} auto-fix(es) for ${path.basename(file_path)} before pending-file promotion`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:44:/** Redact absolute paths: keep only project-relative portion or basename. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:53:  // Fallback: basename only
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:316:          console.error(`[memory-save] TM-06: Reconsolidation ${reconResult.action} for ${path.basename(filePath)}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:26:/** Constitutional markdown basenames intentionally excluded from indexing. */
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:97:function canonicalizePhraseKey(value) {
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:105:    return canonicalizePhraseKey(title).replace(/\b\d+\b/g, ' ').replace(/\s+/g, ' ').trim();
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:341:        const canonicalKey = canonicalizePhraseKey(normalized);
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:349:                reason: 'canonical_duplicate',
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:360:                reason: 'title_overlap',
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:382:    const tempPath = path.join(dirPath, `.${path.basename(filePath)}.tmp-${process.pid}-${Date.now()}`);
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:398:        canonical_duplicate: 0,
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:399:        title_overlap: 0,
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:173:    const folderName = path.basename(folderPath);
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:228:    const folderName = path.basename(rawArg);
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:402:    const inputBaseName = path.basename(specFolderArg);
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:421:            const matches = available.filter((n) => n.includes(path.basename(specFolderArg)) && core_1.SPEC_FOLDER_PATTERN.test(n));
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:429:                const targetBase = path.basename(specFolderArg);
.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts:7:import { basename, dirname, join, resolve } from 'node:path';
.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts:74:  const transcriptPath = join(transcriptRoot, basename(fixturePath));
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:87: * Compute trigger phrase quality sub-score.
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:89: * Evaluates whether the memory metadata declares enough trigger phrases for
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:108:    issues.push('No trigger phrases found');
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:112:    issues.push(`Only ${count} trigger phrase(s) — 4+ recommended`);
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:427: * - Re-extract trigger phrases from content headings/title
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:442:  // Fix #1 : Re-extract trigger phrases if missing/insufficient
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:443:  const hasTriggerIssue = issues.some(i => /trigger phrase/i.test(i));
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:452:      fixed.push(`Re-extracted ${extracted.length} trigger phrases from content`);
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:482: * Extract trigger phrases from content by scanning headings and the title.
.opencode/skill/system-spec-kit/mcp_server/README.md:809:| `triggerPhrases` | string[] | Updated trigger phrases |
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:416:          file: path.basename(filePath),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:465:            file: path.basename(filePath),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:476:          file: path.basename(filePath),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:511:      // We use parsed document type (not basename) to avoid false positives
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:212:  description: '[L2:Core] Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), and co-activation of related memories. Pass session_id and turnNumber for cognitive features. Token Budget: 3500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:213:  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', minLength: 1, description: 'User prompt or text to match against trigger phrases' }, specFolder: { type: 'string', description: 'Limit trigger matches to a specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed trigger matching.' }, userId: { type: 'string', description: 'User boundary for governed trigger matching.' }, agentId: { type: 'string', description: 'Agent boundary for governed trigger matching.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed trigger matching.' }, limit: { type: 'number', default: 3, minimum: 1, maximum: 100, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', minimum: 1, description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:219:  description: '[L2:Core] Index a memory file into the spec kit memory database. Reads the file, extracts metadata (title, trigger phrases), generates embedding, and stores in the index. Use this to manually index new or updated memory files. Includes pre-flight validation (T067-T070) for anchor format, duplicate detection, and token budget estimation. Token Budget: 3500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:294:  inputSchema: { type: 'object', additionalProperties: false, properties: { id: { type: 'number', minimum: 1, description: 'Memory ID to update' }, title: { type: 'string', description: 'New title' }, triggerPhrases: { type: 'array', items: { type: 'string' }, description: 'Updated trigger phrases' }, importanceWeight: { type: 'number', minimum: 0, maximum: 1, description: 'New importance weight (0-1)' }, importanceTier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Set importance tier. Constitutional tier memories always surface at top of results.' }, allowPartialUpdate: { type: 'boolean', default: false, description: 'Allow update to succeed even if embedding regeneration fails. When true, metadata changes are applied and the embedding is marked for re-index. When false (default), the entire update is rolled back on embedding failure.' } }, required: ['id'] },
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:124:        expect(path.basename(result[0])).toBe('spec.md');
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:54:| Keyword Mappings | 40+ | Title/trigger phrase to type mapping |
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:421:    const basename = BASENAME_BY_DOCUMENT_TYPE[config.documentType];
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:423:      basename &&
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:425:      && matchesSpecDocumentPath(filePath, basename)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:378:        qualityFlags: ['No trigger phrases found'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:93:  /** Optional trigger phrases for query-classifier trigger-match routing path. */
.opencode/skill/system-spec-kit/mcp_server/tests/job-queue-state-edge.vitest.ts:311:    expect(updated?.errors[0]?.filePath).toBe(path.basename(missingPath));
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:159:  // Normalize trigger phrases to array
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:323:  keywords: 'Matched keywords in title or trigger phrases',
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:196: * - Terms must NOT already exist as organic trigger phrases
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:201: * @param existingTriggers - Current trigger phrases already on the memory
.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:82:  basename: string,
.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:89:  const normalizedBasename = basename.toLowerCase();
.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:126:  const basename = segments[segments.length - 1] || '';
.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:127:  if (!matchesSpecDocumentPath(normalizedPath, basename)) {
.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:132:  if (basename === 'research.md' && parent === 'research') {
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:116:  return filePath === '__job__' ? filePath : path.basename(filePath || '');
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:384:  - `canonical-path.ts` — canonical path keying used for deduplication and identity.
.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:153:  const basename = path.basename(targetPath);
.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:154:  return basename.startsWith('.');
.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:291:        console.warn(`[file-watcher] Watch task failed for ${path.basename(filePath)}: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:351:          console.warn(`[file-watcher] Skipping reindex outside watch roots: ${path.basename(filePath)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:389:          console.error(`[file-watcher] Reindexed ${path.basename(resolvedPath)} in ${reindexElapsed}ms (total: ${filesReindexed} files, avg: ${Math.round(totalReindexTimeMs / filesReindexed)}ms)`);
.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:429:      console.error(`[file-watcher] Removed indexed entries for ${path.basename(filePath)}`);
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts:776:      expect(path.basename(PROGRESSIVE_VALIDATE)).toBe('progressive-validate.sh');
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts:777:      expect(path.basename(VALIDATE_SH)).toBe('validate.sh');
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:175:| `scoreTriggerQuality(triggerPhrases)` | Layer 2 dimension: trigger phrase quality (0-1) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:5:/** Maximum trigger phrases stored for each memory. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:180: * Parses trigger phrase storage into a normalized string array.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:181: * @param value - The stored trigger phrase payload.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:182: * @returns Parsed trigger phrases, or an empty array on invalid input.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:487: * Score trigger phrase quality (0-1).
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:489: * @param triggerPhrases - Array of trigger phrases
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:638:      reasons.push('No trigger phrases: add at least 1-2 trigger phrases');
.opencode/skill/system-spec-kit/mcp_server/tests/unit-path-security.vitest.ts:21:    expect(path.basename(result!)).toBe('package.json');
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:95:    { id: 403, content: 'Post-save review highlights title, trigger phrase, and importance tier issues. '.repeat(2) },
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:157:// In-memory cache of trigger phrases for fast matching
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:208:  // word breaks. For pure CJK trigger phrases, prefer substring matching so valid
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:306:/** Get or create a cached regex for a trigger phrase. @param phrase - The trigger phrase @returns Compiled RegExp */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:337:/** Load all trigger phrases from the index into memory */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:380:        console.warn(`[trigger-matcher] Failed to parse trigger phrases for memory ${row.id}: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:621:/** Match user prompt against trigger phrases using exact string matching */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:694:/** Match trigger phrases with additional stats */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:725:/** Get all unique trigger phrases in the cache */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:763:/** Get memories by trigger phrase */
.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts:5:// 100+ stop words that should never be learned as trigger phrases.
.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts:57:   to serve as meaningful trigger phrases.
.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts:76: * as trigger phrases. All terms stored in lowercase for case-insensitive matching.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:76: * Check if the query exactly matches any known trigger phrase (case-insensitive).
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:79: * @param triggerPhrases - Known trigger phrases to match against.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:80: * @returns True when the query matches a trigger phrase exactly.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:95: * @param hasTrigger    - Whether a trigger phrase matched.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:130: * - Simple: ≤3 terms OR trigger phrase match
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:140: * @param triggerPhrases - Optional array of known trigger phrases.
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:318:          `[local-reranker] reranked=${rerankCount} total=${candidates.length} durationMs=${elapsed} model=${path.basename(modelPath)}`
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:37:| `memory-parser.ts` | Parses titles, trigger phrases, tiers, document type, causal links, anchors, and content hashes from markdown files |
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:591:    rawDescription || slugifyFolderName(path.basename(folderPath)).replace(/-/g, ' ') || path.basename(folderPath);
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:660:  const folderName = path.basename(folderPath);
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:727:      const folderName = path.basename(folderPath);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:861:      const results = recoverAllPendingFiles(rootDir, (originalPath) => path.basename(originalPath) !== 'stale.md');
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:4:// Feature catalog: BM25 trigger phrase re-index gate
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:306:  const basename = path.basename(filePath).toLowerCase();
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:321:    const docType = FILENAME_TO_DOC_TYPE[basename];
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:322:    if (docType && matchesSpecDocumentPath(filePath, basename)) return docType;
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:376:  return path.basename(parentDir);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:541:/** Extract trigger phrases from ## Trigger Phrases section OR YAML frontmatter */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:755:/** Constitutional markdown basenames intentionally excluded from indexing */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:778:    SPEC_DOCUMENT_FILENAMES_SET.has(path.basename(normalizedPath).toLowerCase()) &&
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:779:    matchesSpecDocumentPath(normalizedPath, path.basename(normalizedPath).toLowerCase())
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:787:    !EXCLUDED_CONSTITUTIONAL_BASENAMES.has(path.basename(normalizedPath).toLowerCase())
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
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:260: * Learns new trigger phrases from a selected result.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:263: * @returns True when trigger phrases were updated.
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:452:    it('T054-6f: Same-path unchanged does not short-circuit when trigger phrases changed', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:453:      const content = 'Existing same-path row with stale trigger phrases.';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:483:      const content = 'Existing same-path row with stale trigger phrases.';
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:120:// Example: Normalize a canonical path key
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:505:**Trigger Matcher**: Matches user prompts to memory trigger phrases
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:508:// Find memories with matching trigger phrases
.opencode/skill/system-spec-kit/mcp_server/tests/stdio-logging-safety.vitest.ts:35:      const basename = path.basename(currentPath);
.opencode/skill/system-spec-kit/mcp_server/tests/stdio-logging-safety.vitest.ts:36:      if (EXCLUDED_SEGMENTS.has(basename)) {
.opencode/skill/system-spec-kit/mcp_server/tests/stdio-logging-safety.vitest.ts:50:    const basename = path.basename(currentPath);
.opencode/skill/system-spec-kit/mcp_server/tests/stdio-logging-safety.vitest.ts:51:    if (EXCLUDED_BASENAMES.has(basename)) {
.opencode/skill/system-spec-kit/mcp_server/tests/stdio-logging-safety.vitest.ts:59:    if (basename.endsWith('.test.ts') || basename.endsWith('.vitest.ts')) {
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:305:    const folderNames = cache.folders.map(f => path.basename(f.specFolder));
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:331:    const folderNames = cache.folders.map(f => path.basename(f.specFolder));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:420:    return filename ? path.basename(filename, path.extname(filename)) : 'Untitled';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:444:  return filename ? path.basename(filename, path.extname(filename)) : 'Untitled';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:563:    const filename = path.basename(file_path);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:264:    detail: 'Queries must be NOT derived from trigger phrases',
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts:106:    it('T501-01: exact match on trigger phrase', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts:137:    it('T501-04: multi-word trigger phrase matches', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts:265:    it('T501-13a: Unicode-aware boundaries match Cyrillic and CJK trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-router.vitest.ts:290:  it('T21: routes trigger phrase match to simple tier', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1061:    it('persists quality-loop trigger phrase fixes into downstream save inputs', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1116:        fixes: ['Re-extracted 4 trigger phrases from content'],
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1355:        fixes: ['Re-extracted 4 trigger phrases from content'],
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1403:        fixes: ['Re-extracted 4 trigger phrases from content'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:282:  || path.join(DEFAULT_DB_DIR, path.basename(DATABASE_PATH));
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:219:  it('classifies trigger phrase matches as simple regardless of length', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:221:      // "get learning history" has 3 terms and is a trigger phrase
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:480:  it('matches exact trigger phrase (case-insensitive)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:486:  it('does not match partial trigger phrase', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:491:  it('handles empty trigger phrase list', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:501:      // "get learning history" is a trigger phrase with exactly 3 terms
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:135: * @param triggerPhrases - Optional trigger phrases for simple-tier classification
.opencode/skill/system-spec-kit/mcp_server/tests/job-queue.vitest.ts:157:    expect(updated?.errors[0]?.filePath).toBe(path.basename(missingFile));
.opencode/skill/system-spec-kit/mcp_server/tests/job-queue.vitest.ts:168:    expect(storedErrors[0]?.filePath).toBe(path.basename(missingFile));
.opencode/skill/system-spec-kit/mcp_server/tests/job-queue.vitest.ts:311:        processingOrder.push(path.basename(filePath));
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:719:`buildBm25DocumentText()` builds the canonical lexical document from title, content, trigger phrases, and folder metadata. `normalizeLexicalQueryTokens()` is shared by BM25 and SQLite FTS flows so lexical matching stays aligned across search channels.
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1743:      expect(hooksModule!.extractContextHint!({ prompt: 'trigger phrase' })).toBe('trigger phrase')
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-extractor.vitest.ts:3:// TF-IDF + N-gram hybrid trigger phrase extraction
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-extractor.vitest.ts:100:    it('T515-03: no duplicate trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1416:    it('does not re-add existing trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:428:  it('auto-fix rescues missing trigger phrases from headings', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:430:    // Content with headings (for trigger extraction) but NO trigger phrases and NO anchors.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:442:    expect(result.fixes.some(f => /trigger phrase/i.test(f))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1066:  it('rejects emoji-only trigger phrases as non-semantic', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1141:  it('quality loop handles exactly 3 trigger phrases at boundary', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-analytics-db.vitest.ts:4:import { basename, join } from 'node:path';
.opencode/skill/system-spec-kit/mcp_server/tests/session-analytics-db.vitest.ts:66:    transcriptPath = join(tempDir, basename(fixturePath));
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:327:    it('3.3.4b filters single-word stopword trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:7:// - Quality score computation (trigger phrases, anchors, budget, coherence)
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:105:  it('returns 0 when no trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:109:    expect(result.issues[0]).toMatch(/no trigger phrases/i);
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:112:  it('returns 0.5 for 1-3 trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:116:    expect(result.issues[0]).toMatch(/2 trigger phrase/i);
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:119:  it('returns 1.0 for 4+ trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:363:  it('extracts title as trigger phrase', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:396:  it('re-extracts trigger phrases when missing', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:399:    const result = attemptAutoFix(content, metadata, ['No trigger phrases found']);
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager-recovery.vitest.ts:219:    const results = recoverAllPendingFiles(dir, (dbPath) => path.basename(dbPath) !== 'stale.md');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-denylist.vitest.ts:3:// Into learned relevance feedback trigger phrases.
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager.vitest.ts:381:    const fileNames = pendingFiles.map((f: string) => path.basename(f));
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:703:          trigger_phrases: 'updated trigger phrase',
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:780:    await handleMemoryUpdate({ id: 42, triggerPhrases: ['updated trigger phrase'] });
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:792:        trigger_phrases: 'updated trigger phrase',
.opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:62:      expect(path.basename(dbPath!)).toBe('speckit-eval.db');
.opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:68:      expect(path.basename(evalPath!)).not.toBe('context-index.sqlite');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:177:    it('T500-06a: Inline YAML trigger phrases extracted', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:193:    it('T500-06b: Multi-line YAML trigger phrases extracted', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:91:  const base = path.basename(filePath, ext);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:105:    const base = path.basename(candidatePath, ext);
.opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts:54:      segments.unshift(path.basename(probe));

exec
/bin/zsh -lc "rg -n \"delete_after|retention_policy|is_archived|sweep|expires_at|retention sweep|archive\" .opencode/skill/system-spec-kit/mcp_server | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:109:| `SPECKIT_RRF_K_EXPERIMENTAL` | `true` | boolean | Per-intent RRF K selection from the D1 K-sweep grid. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:76:type CrudMutationType = 'create' | 'update' | 'delete' | 'merge' | 'archive' | 'restore' | 'reindex';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:24:const SPEC_DOC_EXCLUDE_DIRS = new Set(['scratch', 'memory', 'node_modules', 'iterations', 'z_archive']);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:535:        const archivePlaceholders = oldChildIds.map(() => '?').join(', ');
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:540:          WHERE id IN (${archivePlaceholders})
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:203:  includeArchived?: boolean; // REQ-206: include archived memories in search (default false)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:520:    includeArchived: includeArchived = false, // REQ-206: exclude archived by default
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:173:        description: 'Include archived memories in search results. Default: false (archived excluded).'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:220:  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:233:  inputSchema: { type: 'object', additionalProperties: false, properties: { folderRanking: { type: 'string', enum: ['count', 'recency', 'importance', 'composite'], description: 'How to rank folders: count (default, by memory count), recency (most recent first), importance (by tier), composite (weighted multi-factor score)', default: 'count' }, excludePatterns: { type: 'array', items: { type: 'string' }, description: 'Regex patterns to exclude folders (e.g., ["z_archive", "scratch"])' }, includeScores: { type: 'boolean', description: 'Include score breakdown for each folder', default: false }, includeArchived: { type: 'boolean', description: 'Include archived/test/scratch folders in results', default: false }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum number of folders to return', default: 10 } } },
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:169:  retention_policy?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:170:  delete_after?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:465:    // Filters: is_archived exclusion and spec_folder matching handled by fts5Bm25Search
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1808:    // H13 FIX: Exclude archived rows unless explicitly requested
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1810:      `(importance_tier IS NULL OR importance_tier NOT IN ('deprecated', 'archived'))`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1811:      `(is_archived IS NULL OR is_archived = 0)`
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:369:  // shadow-only (auto-merge at >= 0.96 only archives old record).
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:396:          // Auto-merge: archive the older memory record (shadow operation —
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:397:          // we mark is_archived so it is excluded from future search results
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:402:              SET is_archived = 1,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:410:              `[reconsolidation-bridge] assistive auto-merge: archived older=${topId} ` +
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:415:            console.warn(`[reconsolidation-bridge] assistive auto-merge archive failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:223:/** Handle eval_run_ablation tool — runs ablation analysis or K-sensitivity sweep.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:606: * @param includeArchived - Whether archived memories should be included.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:614:  // Scope cache entries to the active DB path as well as the archived filter.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:637:        ${!includeArchived ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)' : ''}
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:679:    const scoped_suffix_archived = `::${spec_folder}:arch`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:682:      if (key.endsWith(scoped_suffix_archived) || key.endsWith(scoped_suffix_live)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:687:      if (key.endsWith(scoped_suffix_archived) || key.endsWith(scoped_suffix_live)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:715:         AND COALESCE(m.is_archived, 0) = 0
.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:28:  '/z_archive/',
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:96:  - `archival-manager.ts` — lifecycle transitions between active and archived memory states.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:194:- Purpose: Owns scope enforcement, governed ingest normalization, audit recording, and retention sweeps. This is the boundary for tenant/user/agent/session/shared-space policy decisions.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:197:  - `retention.ts` — scoped retention sweep logic over expired memories.
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:184:    ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)'
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:30:      delete_after TEXT
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:274:        '/archive/specs/002-feature/memory/implementation-notes.md.bak',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:275:        '/archive/specs/002-feature/memory/implementation-notes.md.bak',
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:264:  const archivedOrCold = results.filter(
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:267:  if (archivedOrCold.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:268:    blockers.push(`${archivedOrCold.length} result(s) are cold/archived — may be stale`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:51:  archivedDaysThreshold: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:64:  archivedDaysThreshold: parseLimit('ARCHIVED_DAYS_THRESHOLD', ARCHIVED_DAYS_THRESHOLD),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:277:  // (days > 90 AND r < 0.02). Using || here would incorrectly archive
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:279:  if (days > TIER_CONFIG.archivedDaysThreshold && r < STATE_THRESHOLDS.DORMANT) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:494: * Determine if a memory should be archived.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:499:  // Never archive constitutional or critical
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:504:  // Pinned memories are never archived
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:383:           AND COALESCE(is_archived, 0) = 0`
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:431:         WHERE COALESCE(is_archived, 0) = 0
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:84:      AND (m.is_archived IS NULL OR m.is_archived = 0)
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:123:        is_archived INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:421:      // F04-001: Append-only merge — old row (id=100) is archived, new row holds merged content.
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:422:      const oldRow = testDb.prepare('SELECT is_archived FROM memory_index WHERE id = 100').get() as {
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:423:        is_archived: number;
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:425:      expect(oldRow.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:460:      const oldRow = testDb.prepare('SELECT is_archived FROM memory_index WHERE id = 101').get() as {
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:461:        is_archived: number;
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:463:      expect(oldRow.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:496:      const archivedRow = testDb.prepare(
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:497:        'SELECT is_archived FROM memory_index WHERE id = 102'
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:498:      ).get() as { is_archived: number };
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:499:      expect(archivedRow.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:514:    it('MP4: Keeps merged survivor reachable through active projection and hides archived predecessor', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:571:      const archivedRow = testDb.prepare(`
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:572:        SELECT is_archived
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:575:      `).get() as { is_archived: number };
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:576:      expect(archivedRow.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:701:        SELECT id, is_archived, content_text
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:704:      `).all() as Array<{ id: number; is_archived: number; content_text: string | null }>;
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:706:        { id: 105, is_archived: 0, content_text: 'Concurrent writer content' },
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:744:      const archivedRow = testDb.prepare(`
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:745:        SELECT is_archived
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:748:      `).get() as { is_archived: number };
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:749:      expect(archivedRow.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:929:      const archivedRow = testDb.prepare(
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:930:        'SELECT is_archived FROM memory_index WHERE id = 400'
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:931:      ).get() as { is_archived: number };
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:932:      expect(archivedRow.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:1049:      const archivedRow = testDb.prepare(
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:1050:        'SELECT is_archived FROM memory_index WHERE id = 450'
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:1051:      ).get() as { is_archived: number };
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:1052:      expect(archivedRow.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1421:    { name: 'retention_policy', sql: "ALTER TABLE memory_index ADD COLUMN retention_policy TEXT DEFAULT 'keep'" },
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1422:    { name: 'delete_after', sql: 'ALTER TABLE memory_index ADD COLUMN delete_after TEXT' },
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1468:      CREATE INDEX IF NOT EXISTS idx_memory_retention_delete_after
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1469:        ON memory_index(delete_after);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1825:  if (!column_names.includes('expires_at')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1827:      database.exec(`ALTER TABLE memory_index ADD COLUMN expires_at DATETIME`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1828:      console.warn('[vector-index] Migration: Added expires_at column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1833:      logDuplicateColumnMigrationSkip('expires_at', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2333:      retention_policy TEXT DEFAULT 'keep',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2334:      delete_after TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2336:      expires_at DATETIME,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2345:      is_archived INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:5:// Background archival job for dormant/archived memories
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:222:  totalUnarchived: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:237:  totalUnarchived: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:258:    const hasArchived = columns.some(c => c.name === 'is_archived');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:261:      db.exec('ALTER TABLE memory_index ADD COLUMN is_archived INTEGER DEFAULT 0');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:262:      db.exec('CREATE INDEX IF NOT EXISTS idx_archived ON memory_index(is_archived)');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:263:      console.error('[archival-manager] Added is_archived column');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:312:        case 'totalUnarchived':
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:313:          archivalStats.totalUnarchived = parseInt(row.value, 10) || 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:342:      upsert.run('totalUnarchived', String(archivalStats.totalUnarchived));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:361: * Strategy: SQL query fetches broad candidates (unarchived, not protected, not pinned).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:362: * The FSRS-based tier classifier then determines which should actually be archived.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:371:    // Broad SQL pre-filter: get unarchived, non-protected, non-pinned memories
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:375:      WHERE (is_archived IS NULL OR is_archived = 0)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:460:    const isArchived = (memory.is_archived as number) === 1;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:498:    console.warn(`[archival-manager] BM25 archive sync failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:503:// Touching memory_index or ancillary tables. This preserves the archived row
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:504:// (is_archived=1) so unarchive can still find and restore it.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:514:      console.warn(`[archival-manager] Vector archive sync failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:519:function syncBm25OnUnarchive(memoryId: number): void {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:530:    const query = `SELECT ${availableColumns.join(', ')} FROM memory_index WHERE id = ? AND is_archived = 0`;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:539:    console.warn(`[archival-manager] BM25 unarchive sync failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:546: * The playbook contract (scenario 124) requires that unarchive does NOT recreate the
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:549: * the unarchive call on an async embedding generation round-trip and keeps the
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:550: * archive/unarchive path lightweight.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:552:function syncVectorOnUnarchive(memoryId: number): void {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:558:function archiveMemory(memoryId: number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:564:      SET is_archived = 1,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:567:        AND (is_archived IS NULL OR is_archived = 0)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:587:    console.warn(`[archival-manager] archiveMemory error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:592:function archiveBatch(memoryIds: number[]): { archived: number; failed: number } {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:593:  if (!db) return { archived: 0, failed: memoryIds.length };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:595:  let archived = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:601:        // Db is guaranteed non-null because archiveBatch returns early when the module database is missing
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:604:          SET is_archived = 1,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:607:            AND (is_archived IS NULL OR is_archived = 0)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:615:          archived++;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:626:        console.warn(`[archival-manager] archiveMemory error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:635:  return { archived, failed };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:638:function unarchiveMemory(memoryId: number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:644:      SET is_archived = 0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:646:      WHERE id = ? AND is_archived = 1
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:651:      archivalStats.totalUnarchived++;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:652:      syncBm25OnUnarchive(memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:653:      syncVectorOnUnarchive(memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:661:    console.warn(`[archival-manager] unarchiveMemory error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:670:function runArchivalScan(): { scanned: number; archived: number } {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:675:  const result = archiveBatch(candidates.map(c => c.id));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:681:    `[archival-manager] Scan complete: ${candidates.length} candidates, ${result.archived} archived`
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:684:  return { scanned: candidates.length, archived: result.archived };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:739:  archivalStats.totalUnarchived = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:764:  archiveMemory,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:765:  archiveBatch,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:766:  unarchiveMemory,
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:114:  it('returns the merged survivor id instead of the archived predecessor id', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:152:  it('removes archived assistive auto-merge documents from the BM25 singleton', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:153:    const archiveRun = vi.fn();
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:155:      prepare: vi.fn(() => ({ run: archiveRun })),
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:192:    expect(archiveRun).toHaveBeenCalledWith(55);
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:38:      is_archived INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:71:    INSERT INTO memory_index (title, trigger_phrases, spec_folder, parent_id, importance_tier, is_archived)
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:238:  it('ignores archived and deprecated siblings that are no longer retrievable', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:246:      title: 'authentication login session token validation handler middleware security user access archived',
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:364:  it('skips archived and deprecated rows during batch scoring', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:377:      title: 'authentication login session token validation handler middleware security user access archived',
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:73:    it('T211: 89 days + low R => NOT archived', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:171:    it('T226: Constitutional => never archive', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:175:    it('T227: Critical => never archive', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:179:    it('T228: Pinned => never archive', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:183:    it('T229: Old low-stability normal => should archive', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:187:    it('T230: Recent high-stability => should NOT archive', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:278:    it('Rejects spec.md in /z_archive/ directory', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:279:      expect(isMemoryFile('/p/.opencode/specs/003/100/z_archive/spec.md')).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:875:        expires_at: null,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:918:        expires_at: null,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:160:      action: 'retention_sweep',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:165:      reason: 'delete_after_expired',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:139:    const archived = row.is_archived ?? row.isArchived;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:140:    if (archived == null) return true;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:141:    if (typeof archived === 'number') return archived === 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:142:    if (typeof archived === 'boolean') return archived === false;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1240:                `SELECT id, title, spec_folder, file_path, importance_tier, importance_weight, quality_score, created_at, is_archived, context_type, tenant_id, user_id, agent_id, session_id, shared_space_id FROM memory_index WHERE id IN (${placeholders})`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1259:            const archiveFilteredSummaryHits = applyArchiveFilter(newSummaryHits, includeArchived);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1260:            const folderFilteredSummaryHits = applyFolderFilter(archiveFilteredSummaryHits, specFolder);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:39:The cognitive subsystem is the "brain" of the memory system. It determines which memories stay active, which fade, and which get archived. Unlike simple time-based caching, it uses FSRS v4 power-law decay validated on 100M+ real human memory data.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:270:| `archival-manager.ts`      | Lifecycle management      | `runArchivalScan`, `archiveMemory`, `startBackgroundJob`                    |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:640:  archiveMemory,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:641:  unarchiveMemory,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:658:// scanResult = { scanned: 15, archived: 12 }
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:664:// Archive/unarchive
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:665:archiveMemory(memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:666:unarchiveMemory(memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:674:// stats = { totalScanned, totalArchived, totalUnarchived, lastScanTime, errors }
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:902:console.log(`Archived ${scanResult.archived} old memories`);
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:54:      expires_at DATETIME,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:79:      is_archived INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:80:      archived_at TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:142:    it('T059-002: is_archived column exists', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:145:      expect(columns.map(column => column.name)).toContain('is_archived');
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:268:    it('T059-010: archiveMemory returns true on success', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:279:      const archiveResult = archivalManager.archiveMemory(memory_id);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:280:      expect(archiveResult).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:283:    it('T059-011: is_archived flag set to 1', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:294:      archivalManager.archiveMemory(memory_id);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:295:      const row = requireDb().prepare('SELECT is_archived FROM memory_index WHERE id = ?').get(memory_id) as { is_archived: number };
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:296:      expect(row.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:299:    it('T059-012: unarchiveMemory succeeds', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:310:      archivalManager.archiveMemory(memory_id);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:311:      const unarchiveResult = archivalManager.unarchiveMemory(memory_id);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:312:      expect(unarchiveResult).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:314:      const row = requireDb().prepare('SELECT is_archived FROM memory_index WHERE id = ?').get(memory_id) as { is_archived: number };
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:315:      expect(row.is_archived).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:318:    it('T059-012c: archive and unarchive invalidate graph caches on success', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:329:      expect(archivalManager.archiveMemory(memory_id)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:330:      expect(archivalManager.unarchiveMemory(memory_id)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:336:    it('T059-013: Batch archive succeeds', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:350:      const batchResult = archivalManager.archiveBatch(idsToArchive);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:351:      expect(batchResult.archived).toBe(3);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:355:    it('T059-014: archiveMemory on already-archived returns false', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:366:      archivalManager.archiveMemory(memory_id);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:367:      const alreadyArchived = archivalManager.archiveMemory(memory_id);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:371:    it('T059-011b: archiveMemory removes vec_memories row but preserves memory_index archive state', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:392:      const archiveResult = archivalManager.archiveMemory(memory_id);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:393:      expect(archiveResult).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:395:      const archivedRow = requireDb()
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:396:        .prepare('SELECT is_archived FROM memory_index WHERE id = ?')
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:397:        .get(memory_id) as { is_archived: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:398:      expect(archivedRow).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:399:      expect(archivedRow?.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:407:    it('T059-012b: unarchiveMemory defers vector re-embedding to next index scan', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:413:        content_text: 'Rebuild vector content on unarchive',
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:432:      expect(archivalManager.archiveMemory(memory_id)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:434:      const archivedVector = requireDb()
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:437:      expect(archivedVector).toBeUndefined();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:439:      // Capture deferred-rebuild log emitted by syncVectorOnUnarchive
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:442:        expect(archivalManager.unarchiveMemory(memory_id)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:445:        const vectorAfterUnarchive = requireDb()
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:448:        expect(vectorAfterUnarchive).toBeUndefined();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:464:    it('T059-011c: archiveMemory suppresses vec_memories no-such-table cleanup errors', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:477:        const archiveResult = archivalManager.archiveMemory(memory_id);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:478:        expect(archiveResult).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:482:          return text.includes('Vector archive sync failed')
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:507:    it('T059-015: Archival scan archives candidates', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:541:      expect(scanResult.archived).toBeGreaterThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:576:      expect(scan2Result.archived).toBeLessThanOrEqual(scanResult.archived);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:776:    it('T059-032: archiveMemory returns false without db', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:780:      const result = archivalManager.archiveMemory(1);
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:357:          is_archived: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:391:      is_archived: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:428:          is_archived: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:439:          is_archived: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:477:          is_archived: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:491:          is_archived: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:36:    expires_at: null,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:164:    row.expires_at = null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:64:  'expires_at',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:72:  'is_archived',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:140:      expires_at DATETIME,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:148:      is_archived INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts:43:  it('uses the D1 K sweep grid {10,20,40,60,80,100,120}', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts:98:  it('optimizes K per intent across the full sweep', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:236:  { spec_folder: 'z_archive/001-old', updated_at: '2024-06-01', importance_tier: 'deprecated' },
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:271:| Archive check | `isArchived('/z_archive/old')` | Deprioritize archived folders |
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:374:            is_archived INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:259:  // Without this, ephemeral rows are never swept since sweeps key off delete_after

codex
There’s also a meaningful soft-delete layer in Public, so I’m tracing the concrete archive and retention paths rather than relying on README claims.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts | sed -n '360,430p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   360	      console.warn(`[memory-save] TM-06: Reconsolidation error (proceeding with normal save): ${message}`);
   361	      // Reconsolidation errors must not block saves
   362	    }
   363	  }
   364	
   365	  // ─────────────────────────────────────────────────────────────
   366	  // ASSISTIVE RECONSOLIDATION (REQ-D4-005)
   367	  // Runs independently of the TM-06 flag.  Requires embedding.
   368	  // Does NOT block normal save — all actions are advisory or
   369	  // shadow-only (auto-merge at >= 0.96 only archives old record).
   370	  // ─────────────────────────────────────────────────────────────
   371	  let assistiveRecommendation: AssistiveRecommendation | null = null;
   372	
   373	  if (!force && isAssistiveReconsolidationEnabled() && embedding) {
   374	    try {
   375	      // Find the top similar memory using the existing vector search
   376	      const searchEmb = embedding instanceof Float32Array ? embedding : new Float32Array(embedding as number[]);
   377	      const candidateResults = vectorIndex.vectorSearch(searchEmb, {
   378	        limit: 3,
   379	        specFolder: parsed.specFolder,
   380	        minSimilarity: Math.round(ASSISTIVE_REVIEW_THRESHOLD * 100), // convert to 0-100 scale
   381	        includeConstitutional: false,
   382	      });
   383	
   384	      if (candidateResults.length > 0) {
   385	        const top = candidateResults[0] as Record<string, unknown>;
   386	        // vectorSearch returns similarity in [0, 100], normalise to [0, 1]
   387	        const rawSimilarity = typeof top.similarity === 'number' ? top.similarity : 0;
   388	        const similarity = rawSimilarity > 1 ? rawSimilarity / 100 : rawSimilarity;
   389	        const topId = typeof top.id === 'number' ? top.id : 0;
   390	        const topContent = typeof top.content_text === 'string' ? top.content_text :
   391	                          (typeof top.content === 'string' ? top.content : '');
   392	
   393	        const tier = classifyAssistiveSimilarity(similarity);
   394	
   395	        if (tier === 'auto_merge') {
   396	          // Auto-merge: archive the older memory record (shadow operation —
   397	          // we mark is_archived so it is excluded from future search results
   398	          // but NOT physically deleted).
   399	          try {
   400	            database.prepare(`
   401	              UPDATE memory_index
   402	              SET is_archived = 1,
   403	                  updated_at = datetime('now')
   404	              WHERE id = ?
   405	            `).run(topId);
   406	            if (bm25Index.isBm25Enabled()) {
   407	              bm25Index.getIndex().removeDocument(String(topId));
   408	            }
   409	            console.warn(
   410	              `[reconsolidation-bridge] assistive auto-merge: archived older=${topId} ` +
   411	              `(similarity=${similarity.toFixed(3)}) — newer memory continues normal save`
   412	            );
   413	          } catch (mergeErr: unknown) {
   414	            const msg = mergeErr instanceof Error ? mergeErr.message : String(mergeErr);
   415	            console.warn(`[reconsolidation-bridge] assistive auto-merge archive failed: ${msg}`);
   416	          }
   417	        } else if (tier === 'review') {
   418	          // Review tier: classify and surface as recommendation (no mutations)
   419	          const classification = classifySupersededOrComplement(topContent, parsed.content);
   420	          assistiveRecommendation = {
   421	            action: 'review',
   422	            candidateMemoryIds: [topId],
   423	            description:
   424	              `Review borderline similarity ${similarity.toFixed(3)} between the pending save ` +
   425	              `and existing memory #${topId}; heuristic suggests ${classification}.`,
   426	            olderMemoryId: topId,
   427	            newerMemoryId: null,
   428	            similarity,
   429	            classification,
   430	            recommendedAt: Date.now(),

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Archival Manager
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Automatic archival subsystem
     5	// Background archival job for dormant/archived memories
     6	import type Database from 'better-sqlite3';
     7	import { clearDegreeCache } from '../search/graph-search-fn.js';
     8	import { clearGraphSignalsCache } from '../graph/graph-signals.js';
     9	
    10	/* ───────────────────────────────────────────────────────────────
    11	   1. DEPENDENCIES (lazy-loaded)
    12	----------------------------------------------------------------*/
    13	
    14	// Lazy-load tier-classifier to avoid circular dependencies
    15	let tierClassifierModule: Record<string, unknown> | null = null;
    16	let tierClassifierModulePromise: Promise<Record<string, unknown> | null> | null = null;
    17	
    18	async function loadTierClassifierModule(): Promise<Record<string, unknown> | null> {
    19	  if (tierClassifierModule !== null) {
    20	    return tierClassifierModule;
    21	  }
    22	  if (tierClassifierModulePromise !== null) {
    23	    return tierClassifierModulePromise;
    24	  }
    25	
    26	  const loadPromise = (async (): Promise<Record<string, unknown> | null> => {
    27	    try {
    28	      tierClassifierModule = await import('./tier-classifier.js');
    29	      return tierClassifierModule;
    30	    } catch (error: unknown) {
    31	      const message = error instanceof Error ? error.message : String(error);
    32	      console.warn(`[archival-manager] tier-classifier module unavailable: ${message}`);
    33	      return null;
    34	    }
    35	  })();
    36	
    37	  tierClassifierModulePromise = loadPromise;
    38	  try {
    39	    return await loadPromise;
    40	  } finally {
    41	    if (tierClassifierModulePromise === loadPromise) {
    42	      tierClassifierModulePromise = null;
    43	    }
    44	  }
    45	}
    46	
    47	function getTierClassifier(): Record<string, unknown> | null {
    48	  if (tierClassifierModule !== null) return tierClassifierModule;
    49	  if (tierClassifierModulePromise === null) {
    50	    void loadTierClassifierModule();
    51	  }
    52	  return null;
    53	}
    54	
    55	interface Bm25IndexModule {
    56	  isBm25Enabled: () => boolean;
    57	  buildBm25DocumentText: (row: Record<string, unknown>) => string;
    58	  getIndex: () => {
    59	    removeDocument: (id: string) => boolean;
    60	    addDocument: (id: string, text: string) => void;
    61	  };
    62	}
    63	
    64	let bm25IndexModule: Bm25IndexModule | null = null;
    65	let bm25IndexModulePromise: Promise<Bm25IndexModule | null> | null = null;
    66	
    67	async function loadBm25IndexModule(): Promise<Bm25IndexModule | null> {
    68	  if (bm25IndexModule !== null) {
    69	    return bm25IndexModule;
    70	  }
    71	  if (bm25IndexModulePromise !== null) {
    72	    return bm25IndexModulePromise;
    73	  }
    74	
    75	  const primaryModulePath = '../search/bm25-index.js';
    76	  const fallbackModulePath = '../../search/bm25-index.js';
    77	
    78	  const loadPromise = (async (): Promise<Bm25IndexModule | null> => {
    79	    try {
    80	      bm25IndexModule = await import(primaryModulePath) as Bm25IndexModule;
    81	      return bm25IndexModule;
    82	    } catch (error: unknown) {
    83	      const primaryError = error instanceof Error ? error.message : String(error);
    84	      try {
    85	        // Support cognitive symlink import path in some runtime setups.
    86	        bm25IndexModule = await import(fallbackModulePath) as Bm25IndexModule;
    87	        return bm25IndexModule;
    88	      } catch (fallbackError: unknown) {
    89	        const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
    90	        console.warn(
    91	          `[archival-manager] bm25-index module unavailable. primary="${primaryError}" fallback="${fallbackMessage}"`
    92	        );
    93	        return null;
    94	      }
    95	    }
    96	  })();
    97	
    98	  bm25IndexModulePromise = loadPromise;
    99	  try {
   100	    return await loadPromise;
   101	  } finally {
   102	    if (bm25IndexModulePromise === loadPromise) {
   103	      bm25IndexModulePromise = null;
   104	    }
   105	  }
   106	}
   107	
   108	function getBm25Index(): Bm25IndexModule | null {
   109	  if (bm25IndexModule !== null) return bm25IndexModule;
   110	  if (bm25IndexModulePromise === null) {
   111	    void loadBm25IndexModule();
   112	  }
   113	  return null;
   114	}
   115	
   116	interface EmbeddingModule {
   117	  generateDocumentEmbedding: (content: string) => Promise<Float32Array | null>;
   118	}
   119	
   120	let embeddingsModule: EmbeddingModule | null = null;
   121	let embeddingsModulePromise: Promise<EmbeddingModule | null> | null = null;
   122	
   123	async function loadEmbeddingsModule(): Promise<EmbeddingModule | null> {
   124	  if (embeddingsModule !== null) {
   125	    return embeddingsModule;
   126	  }
   127	  if (embeddingsModulePromise !== null) {
   128	    return embeddingsModulePromise;
   129	  }
   130	
   131	  const primaryModulePath = '../providers/embeddings.js';
   132	  const fallbackModulePath = '../../providers/embeddings.js';
   133	
   134	  const loadPromise = (async (): Promise<EmbeddingModule | null> => {
   135	    try {
   136	      embeddingsModule = await import(primaryModulePath) as EmbeddingModule;
   137	      return embeddingsModule;
   138	    } catch (error: unknown) {
   139	      const primaryError = error instanceof Error ? error.message : String(error);
   140	      try {
   141	        // Support cognitive symlink import path in some runtime setups.
   142	        embeddingsModule = await import(fallbackModulePath) as EmbeddingModule;
   143	        return embeddingsModule;
   144	      } catch (fallbackError: unknown) {
   145	        const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
   146	        console.warn(
   147	          `[archival-manager] embeddings module unavailable. primary="${primaryError}" fallback="${fallbackMessage}"`
   148	        );
   149	        return null;
   150	      }
   151	    }
   152	  })();
   153	
   154	  embeddingsModulePromise = loadPromise;
   155	  try {
   156	    return await loadPromise;
   157	  } finally {
   158	    if (embeddingsModulePromise === loadPromise) {
   159	      embeddingsModulePromise = null;
   160	    }
   161	  }
   162	}
   163	
   164	function _getEmbeddings(): EmbeddingModule | null {
   165	  if (embeddingsModule !== null) return embeddingsModule;
   166	  if (embeddingsModulePromise === null) {
   167	    void loadEmbeddingsModule();
   168	  }
   169	  return null;
   170	}
   171	
   172	function __setEmbeddingsModuleForTests(module: EmbeddingModule | null): void {
   173	  embeddingsModule = module;
   174	  embeddingsModulePromise = null;
   175	}
   176	
   177	/* ───────────────────────────────────────────────────────────────
   178	   2. CONFIGURATION
   179	----------------------------------------------------------------*/
   180	
   181	interface ArchivalConfigType {
   182	  enabled: boolean;
   183	  scanIntervalMs: number;
   184	  batchSize: number;
   185	  maxAgeDays: number;
   186	  maxAccessCount: number;
   187	  maxConfidence: number;
   188	  protectedTiers: string[];
   189	  backgroundJobIntervalMs: number;
   190	}
   191	
   192	const ARCHIVAL_CONFIG: ArchivalConfigType = {
   193	  enabled: process.env.SPECKIT_ARCHIVAL !== 'false',
   194	  scanIntervalMs: 3600000, // 1 hour
   195	  batchSize: 50,
   196	  maxAgeDays: 90,
   197	  maxAccessCount: 2,
   198	  maxConfidence: 0.4,
   199	  protectedTiers: ['constitutional', 'critical'],
   200	  backgroundJobIntervalMs: 7200000, // 2 hours
   201	};
   202	
   203	/* ───────────────────────────────────────────────────────────────
   204	   3. INTERFACES
   205	----------------------------------------------------------------*/
   206	
   207	interface ArchivalCandidate {
   208	  id: number;
   209	  title: string | null;
   210	  spec_folder: string;
   211	  file_path: string;
   212	  created_at: string;
   213	  importance_tier: string;
   214	  access_count: number;
   215	  confidence: number;
   216	  reason: string;
   217	}
   218	
   219	interface ArchivalStats {
   220	  totalScanned: number;
   221	  totalArchived: number;
   222	  totalUnarchived: number;
   223	  lastScanTime: string | null;
   224	  errors: string[];
   225	}
   226	
   227	/* ───────────────────────────────────────────────────────────────
   228	   4. MODULE STATE
   229	----------------------------------------------------------------*/
   230	
   231	let db: Database.Database | null = null;
   232	let backgroundJob: ReturnType<typeof setInterval> | null = null;
   233	
   234	const archivalStats: ArchivalStats = {
   235	  totalScanned: 0,
   236	  totalArchived: 0,
   237	  totalUnarchived: 0,
   238	  lastScanTime: null,
   239	  errors: [],
   240	};
   241	
   242	/* ───────────────────────────────────────────────────────────────
   243	   5. INITIALIZATION
   244	----------------------------------------------------------------*/
   245	
   246	function init(database: Database.Database): void {
   247	  db = database;
   248	  ensureArchivedColumn();
   249	  ensureArchivalStatsTable();
   250	  loadArchivalStats();
   251	}
   252	
   253	function ensureArchivedColumn(): void {
   254	  if (!db) return;
   255	
   256	  try {
   257	    const columns = (db.prepare('PRAGMA table_info(memory_index)') as Database.Statement).all() as Array<{ name: string }>;
   258	    const hasArchived = columns.some(c => c.name === 'is_archived');
   259	
   260	    if (!hasArchived) {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/governance/retention.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -n \"runRetentionSweep|delete_after_expired|retention_sweep|archiveMemory|unarchiveMemory|archival scan|is_archived = 1|expires_at\" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/handlers | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
nl: .opencode/skill/system-spec-kit/mcp_server/lib/governance/retention.ts: No such file or directory

 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:402:              SET is_archived = 1,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:64:  'expires_at',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:140:      expires_at DATETIME,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1336:    'expires_at',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:292:        SET is_archived = 1,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:558:function archiveMemory(memoryId: number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:564:      SET is_archived = 1,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:587:    console.warn(`[archival-manager] archiveMemory error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:604:          SET is_archived = 1,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:626:        console.warn(`[archival-manager] archiveMemory error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:638:function unarchiveMemory(memoryId: number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:646:      WHERE id = ? AND is_archived = 1
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:661:    console.warn(`[archival-manager] unarchiveMemory error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:764:  archiveMemory,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:766:  unarchiveMemory,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:270:| `archival-manager.ts`      | Lifecycle management      | `runArchivalScan`, `archiveMemory`, `startBackgroundJob`                    |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:640:  archiveMemory,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:641:  unarchiveMemory,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:665:archiveMemory(memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:666:unarchiveMemory(memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:224:  where_clauses.push('(m.expires_at IS NULL OR m.expires_at > datetime(\'now\'))');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:381:        AND (m.expires_at IS NULL OR m.expires_at > datetime('now'))
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1825:  if (!column_names.includes('expires_at')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1827:      database.exec(`ALTER TABLE memory_index ADD COLUMN expires_at DATETIME`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1828:      console.warn('[vector-index] Migration: Added expires_at column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1833:      logDuplicateColumnMigrationSkip('expires_at', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2336:      expires_at DATETIME,

codex
I hit one path mismatch in the local repo: the module map mentions retention sweep logic, but there isn’t a `lib/governance/retention.ts` file at that path in this checkout, so I’m staying anchored on the concrete schema, query, and archive code that does exist.
exec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/mcp_server/lib | rg "retention|archival-manager|reconsolidation|mutation-ledger|lineage-state"' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts | sed -n '550,690p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   550	 * archive/unarchive path lightweight.
   551	 */
   552	function syncVectorOnUnarchive(memoryId: number): void {
   553	  console.error(
   554	    `[archival-manager] Deferred vector re-embedding for memory ${memoryId} until next index scan`
   555	  );
   556	}
   557	
   558	function archiveMemory(memoryId: number): boolean {
   559	  if (!db) return false;
   560	
   561	  try {
   562	    const result = (db.prepare(`
   563	      UPDATE memory_index
   564	      SET is_archived = 1,
   565	          updated_at = datetime('now')
   566	      WHERE id = ?
   567	        AND (is_archived IS NULL OR is_archived = 0)
   568	    `) as Database.Statement).run(memoryId);
   569	
   570	    const success = (result as { changes: number }).changes > 0;
   571	    if (success) {
   572	      archivalStats.totalArchived++;
   573	      syncBm25OnArchive(memoryId);
   574	      syncVectorOnArchive(memoryId);
   575	      clearDegreeCache();
   576	      clearGraphSignalsCache();
   577	      saveArchivalStats();
   578	    }
   579	    return success;
   580	  } catch (error: unknown) {
   581	    const msg = error instanceof Error ? error.message : String(error);
   582	    const MAX_ERROR_LOG = 100;
   583	    archivalStats.errors.push(msg);
   584	    if (archivalStats.errors.length > MAX_ERROR_LOG) {
   585	      archivalStats.errors = archivalStats.errors.slice(-MAX_ERROR_LOG);
   586	    }
   587	    console.warn(`[archival-manager] archiveMemory error: ${msg}`);
   588	    return false;
   589	  }
   590	}
   591	
   592	function archiveBatch(memoryIds: number[]): { archived: number; failed: number } {
   593	  if (!db) return { archived: 0, failed: memoryIds.length };
   594	
   595	  let archived = 0;
   596	  let failed = 0;
   597	
   598	  const batchTransaction = db.transaction(() => {
   599	    for (const id of memoryIds) {
   600	      try {
   601	        // Db is guaranteed non-null because archiveBatch returns early when the module database is missing
   602	        const result = (db!.prepare(`
   603	          UPDATE memory_index
   604	          SET is_archived = 1,
   605	              updated_at = datetime('now')
   606	          WHERE id = ?
   607	            AND (is_archived IS NULL OR is_archived = 0)
   608	        `) as Database.Statement).run(id);
   609	
   610	        const success = (result as { changes: number }).changes > 0;
   611	        if (success) {
   612	          archivalStats.totalArchived++;
   613	          syncBm25OnArchive(id);
   614	          syncVectorOnArchive(id);
   615	          archived++;
   616	        } else {
   617	          failed++;
   618	        }
   619	      } catch (error: unknown) {
   620	        const msg = error instanceof Error ? error.message : String(error);
   621	        const MAX_ERROR_LOG = 100;
   622	        archivalStats.errors.push(msg);
   623	        if (archivalStats.errors.length > MAX_ERROR_LOG) {
   624	          archivalStats.errors = archivalStats.errors.slice(-MAX_ERROR_LOG);
   625	        }
   626	        console.warn(`[archival-manager] archiveMemory error: ${msg}`);
   627	        failed++;
   628	      }
   629	    }
   630	  });
   631	
   632	  batchTransaction();
   633	  saveArchivalStats();
   634	
   635	  return { archived, failed };
   636	}
   637	
   638	function unarchiveMemory(memoryId: number): boolean {
   639	  if (!db) return false;
   640	
   641	  try {
   642	    const result = (db.prepare(`
   643	      UPDATE memory_index
   644	      SET is_archived = 0,
   645	          updated_at = datetime('now')
   646	      WHERE id = ? AND is_archived = 1
   647	    `) as Database.Statement).run(memoryId);
   648	
   649	    const success = (result as { changes: number }).changes > 0;
   650	    if (success) {
   651	      archivalStats.totalUnarchived++;
   652	      syncBm25OnUnarchive(memoryId);
   653	      syncVectorOnUnarchive(memoryId);
   654	      clearDegreeCache();
   655	      clearGraphSignalsCache();
   656	      saveArchivalStats();
   657	    }
   658	    return success;
   659	  } catch (error: unknown) {
   660	    const msg = error instanceof Error ? error.message : String(error);
   661	    console.warn(`[archival-manager] unarchiveMemory error: ${msg}`);
   662	    return false;
   663	  }
   664	}
   665	
   666	/* ───────────────────────────────────────────────────────────────
   667	   7. SCANNING & BACKGROUND JOBS
   668	----------------------------------------------------------------*/
   669	
   670	function runArchivalScan(): { scanned: number; archived: number } {
   671	  const candidates = getArchivalCandidates();
   672	  archivalStats.totalScanned += candidates.length;
   673	  archivalStats.lastScanTime = new Date().toISOString();
   674	
   675	  const result = archiveBatch(candidates.map(c => c.id));
   676	
   677	  // Persist updated stats (P5-06)
   678	  saveArchivalStats();
   679	
   680	  console.error(
   681	    `[archival-manager] Scan complete: ${candidates.length} candidates, ${result.archived} archived`
   682	  );
   683	
   684	  return { scanned: candidates.length, archived: result.archived };
   685	}
   686	
   687	function startBackgroundJob(intervalMs: number = ARCHIVAL_CONFIG.backgroundJobIntervalMs): void {
   688	  if (!ARCHIVAL_CONFIG.enabled) {
   689	    return;
   690	  }

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts | sed -n '250,330p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   250	    }
   251	
   252	    let bm25RepairNeeded = false;
   253	    let mergedBm25DocumentText = '';
   254	
   255	    // F04-001: Append-only merge — mark old as superseded, create new record
   256	    const txResult = db.transaction((): { status: 'merged' } | { status: MergeAbortStatus } => {
   257	      const currentRow = db.prepare('SELECT * FROM memory_index WHERE id = ?').get(existingMemory.id) as Record<string, unknown> | undefined;
   258	
   259	      if (!currentRow || isArchivedRow(currentRow)) {
   260	        return { status: 'predecessor_gone' };
   261	      }
   262	
   263	      if (hasPredecessorChanged(predecessorVersion, currentRow)) {
   264	        return { status: 'predecessor_changed' };
   265	      }
   266	
   267	      const currentFilePath = getOptionalString(currentRow, 'file_path') ?? existingMemory.file_path;
   268	      const reusedEmbeddingRow = db.prepare(`
   269	        SELECT embedding
   270	        FROM vec_memories
   271	        WHERE rowid = ?
   272	      `).get(existingMemory.id) as { embedding?: Buffer } | undefined;
   273	      const mergedEmbeddingBuffer = newEmbedding
   274	        ? embeddingToBuffer(newEmbedding)
   275	        : (reusedEmbeddingRow?.embedding ?? null);
   276	      const mergedEmbeddingStatus = mergedEmbeddingBuffer ? 'success' : getOptionalString(currentRow, 'embedding_status') ?? 'pending';
   277	      const mergedCanonicalPath = getOptionalString(currentRow, 'canonical_file_path') ?? getCanonicalPathKey(currentFilePath);
   278	      const mergedTriggerPhrases = buildMergedTriggerPhrases(currentRow, newMemory.triggerPhrases);
   279	      const mergedTitle = newMemory.title ?? getOptionalString(currentRow, 'title') ?? existingMemory.title ?? '';
   280	      const mergedImportanceTier = newMemory.importanceTier ?? getOptionalString(currentRow, 'importance_tier');
   281	
   282	      mergedBm25DocumentText = bm25Index.buildBm25DocumentText({
   283	        title: mergedTitle,
   284	        content_text: mergedContent,
   285	        trigger_phrases: mergedTriggerPhrases,
   286	        file_path: currentFilePath,
   287	      });
   288	
   289	      // Mark existing memory as archived (superseded)
   290	      db.prepare(`
   291	        UPDATE memory_index
   292	        SET is_archived = 1,
   293	            updated_at = datetime('now')
   294	        WHERE id = ?
   295	      `).run(existingMemory.id);
   296	
   297	      const insertValues = buildMergedMemoryInsertValues(currentRow, {
   298	        spec_folder: existingMemory.spec_folder,
   299	        file_path: currentFilePath,
   300	        canonical_file_path: mergedCanonicalPath,
   301	        anchor_id: getOptionalString(currentRow, 'anchor_id'),
   302	        title: mergedTitle,
   303	        trigger_phrases: mergedTriggerPhrases,
   304	        importance_weight: boostedWeight,
   305	        importance_tier: mergedImportanceTier,
   306	        content_text: mergedContent,
   307	        content_hash: mergedHash,
   308	        embedding_status: mergedEmbeddingStatus,
   309	        embedding_model: getOptionalString(currentRow, 'embedding_model'),
   310	        embedding_generated_at: mergedEmbeddingBuffer ? now : getOptionalString(currentRow, 'embedding_generated_at'),
   311	        encoding_intent: getOptionalString(currentRow, 'encoding_intent'),
   312	        document_type: getOptionalString(currentRow, 'document_type'),
   313	        spec_level: getOptionalNumber(currentRow, 'spec_level'),
   314	        bm25_repair_needed: 0,
   315	        created_at: now,
   316	        updated_at: now,
   317	      }, memoryIndexColumns);
   318	      const insertColumns = Object.keys(insertValues);
   319	      const insertSql = `
   320	        INSERT INTO memory_index (${insertColumns.join(', ')})
   321	        VALUES (${insertColumns.map(() => '?').join(', ')})
   322	      `;
   323	      const insertResult = db.prepare(insertSql).run(...insertColumns.map((column) => insertValues[column]));
   324	
   325	      newId = Number(insertResult.lastInsertRowid);
   326	
   327	      if (mergedEmbeddingBuffer) {
   328	        db.prepare(`
   329	          INSERT INTO vec_memories (rowid, embedding)
   330	          VALUES (?, ?)

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts | sed -n '212,245p;372,390p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   212	       END`
   213	    : 'm.importance_weight';
   214	
   215	  let constitutional_results: MemoryRow[] = [];
   216	
   217	  if (includeConstitutional && tier !== 'constitutional') {
   218	    constitutional_results = get_constitutional_memories(database, specFolder, includeArchived);
   219	  }
   220	
   221	  const where_clauses = ['m.embedding_status = \'success\''];
   222	  const params: unknown[] = [query_buffer];
   223	
   224	  where_clauses.push('(m.expires_at IS NULL OR m.expires_at > datetime(\'now\'))');
   225	
   226	  if (!includeArchived) {
   227	    where_clauses.push('(m.is_archived IS NULL OR m.is_archived = 0)');
   228	  }
   229	  if (tier === 'deprecated') {
   230	    where_clauses.push('m.importance_tier = ?');
   231	    params.push('deprecated');
   232	  } else if (tier === 'constitutional') {
   233	    where_clauses.push('m.importance_tier = ?');
   234	    params.push('constitutional');
   235	  } else if (tier) {
   236	    where_clauses.push('m.importance_tier = ?');
   237	    params.push(tier);
   238	  } else {
   239	    where_clauses.push('(m.importance_tier IS NULL OR m.importance_tier NOT IN (\'deprecated\', \'constitutional\'))');
   240	  }
   241	
   242	  if (specFolder) {
   243	    where_clauses.push('m.spec_folder = ?');
   244	    params.push(specFolder);
   245	  }
   372	      (${avg_distance_expr}) / ${concepts.length} as avg_distance
   373	    FROM (
   374	      SELECT
   375	        m.*,
   376	        ${distance_expressions}
   377	      FROM memory_index m
   378	      JOIN active_memory_projection p ON p.active_memory_id = m.id
   379	      JOIN vec_memories v ON m.id = v.rowid
   380	      WHERE m.embedding_status = 'success'
   381	        AND (m.expires_at IS NULL OR m.expires_at > datetime('now'))
   382	        ${folder_filter}
   383	        ${archival_filter}
   384	        AND ${distance_filters}
   385	    ) sub
   386	    ORDER BY avg_distance ASC
   387	    LIMIT ?
   388	  `;
   389	
   390	  const params = [

codex
I’ve got enough to support a few strong hygiene findings already, and I’m adding lineage and mutation-ledger evidence so the revision-tracking comparison is anchored in actual implementation rather than surface docs.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Mutation Ledger
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Transaction wrappers on mutation handlers
     5	// Append-only audit trail for all memory mutations
     6	// SQLite triggers enforce immutability (no UPDATE/DELETE on ledger)
     7	import { createHash } from 'crypto';
     8	import type Database from 'better-sqlite3';
     9	import { runInTransaction } from './transaction-manager.js';
    10	
    11	/* ───────────────────────────────────────────────────────────────
    12	   1. TYPES
    13	----------------------------------------------------------------*/
    14	
    15	type MutationType = 'create' | 'update' | 'delete' | 'merge' | 'archive' | 'restore' | 'reindex';
    16	
    17	interface MutationLedgerEntry {
    18	  id: number;
    19	  timestamp: string;
    20	  mutation_type: MutationType;
    21	  reason: string;
    22	  prior_hash: string | null;
    23	  new_hash: string;
    24	  linked_memory_ids: string; // JSON array
    25	  decision_meta: string;     // JSON object
    26	  actor: string;
    27	  session_id: string | null;
    28	}
    29	
    30	interface AppendEntryInput {
    31	  mutation_type: MutationType;
    32	  reason: string;
    33	  prior_hash: string | null;
    34	  new_hash: string;
    35	  linked_memory_ids: number[];
    36	  decision_meta: Record<string, unknown>;
    37	  actor: string;
    38	  session_id?: string | null;
    39	}
    40	
    41	interface GetEntriesOptions {
    42	  mutation_type?: MutationType;
    43	  actor?: string;
    44	  session_id?: string;
    45	  since?: string;    // ISO timestamp
    46	  until?: string;    // ISO timestamp
    47	  limit?: number;
    48	  offset?: number;
    49	}
    50	
    51	interface DivergenceReconcilePolicy {
    52	  normalizedPath: string;
    53	  attemptsSoFar: number;
    54	  nextAttempt: number;
    55	  maxRetries: number;
    56	  shouldRetry: boolean;
    57	  exhausted: boolean;
    58	}
    59	
    60	interface DivergenceEscalationPayload {
    61	  code: 'E_DIVERGENCE_RECONCILE_RETRY_EXHAUSTED';
    62	  normalizedPath: string;
    63	  attempts: number;
    64	  maxRetries: number;
    65	  recommendation: 'manual_triage_required';
    66	  reason: string;
    67	  variants: string[];
    68	}
    69	
    70	interface RecordDivergenceReconcileInput {
    71	  normalizedPath: string;
    72	  variants?: string[];
    73	  actor?: string;
    74	  session_id?: string | null;
    75	  maxRetries?: number;
    76	}
    77	
    78	interface RecordDivergenceReconcileResult {
    79	  policy: DivergenceReconcilePolicy;
    80	  retryEntryId: number | null;
    81	  escalationEntryId: number | null;
    82	  escalation: DivergenceEscalationPayload | null;
    83	}
    84	
    85	/* ───────────────────────────────────────────────────────────────
    86	   2. SCHEMA SQL
    87	----------------------------------------------------------------*/
    88	
    89	const LEDGER_SCHEMA_SQL = `
    90	  CREATE TABLE IF NOT EXISTS mutation_ledger (
    91	    id INTEGER PRIMARY KEY AUTOINCREMENT,
    92	    timestamp TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    93	    mutation_type TEXT NOT NULL CHECK(mutation_type IN ('create','update','delete','merge','archive','restore','reindex')),
    94	    reason TEXT NOT NULL,
    95	    prior_hash TEXT,
    96	    new_hash TEXT NOT NULL,
    97	    linked_memory_ids TEXT NOT NULL DEFAULT '[]',
    98	    decision_meta TEXT NOT NULL DEFAULT '{}',
    99	    actor TEXT NOT NULL,
   100	    session_id TEXT
   101	  )
   102	`;
   103	
   104	const LEDGER_INDEX_SQL = `
   105	  CREATE INDEX IF NOT EXISTS idx_ledger_type ON mutation_ledger(mutation_type);
   106	  CREATE INDEX IF NOT EXISTS idx_ledger_actor ON mutation_ledger(actor);
   107	  CREATE INDEX IF NOT EXISTS idx_ledger_timestamp ON mutation_ledger(timestamp);
   108	  CREATE INDEX IF NOT EXISTS idx_ledger_session ON mutation_ledger(session_id);
   109	  CREATE INDEX IF NOT EXISTS idx_ledger_memory_type_created_at ON mutation_ledger(
   110	    CAST(json_extract(linked_memory_ids, '$[0]') AS INTEGER),
   111	    mutation_type,
   112	    timestamp
   113	  )
   114	`;
   115	
   116	const LEDGER_TRIGGER_SQL = `
   117	  CREATE TRIGGER IF NOT EXISTS prevent_ledger_update BEFORE UPDATE ON mutation_ledger
   118	  BEGIN SELECT RAISE(ABORT, 'mutation_ledger is append-only'); END;
   119	  CREATE TRIGGER IF NOT EXISTS prevent_ledger_delete BEFORE DELETE ON mutation_ledger
   120	  BEGIN SELECT RAISE(ABORT, 'mutation_ledger is append-only'); END
   121	`;
   122	
   123	/* ───────────────────────────────────────────────────────────────
   124	   3. INITIALIZATION
   125	----------------------------------------------------------------*/
   126	
   127	function initLedger(db: Database.Database): void {
   128	  db.exec(LEDGER_SCHEMA_SQL);
   129	  db.exec(LEDGER_INDEX_SQL);
   130	  db.exec(LEDGER_TRIGGER_SQL);
   131	}
   132	
   133	/* ───────────────────────────────────────────────────────────────
   134	   4. HASH COMPUTATION
   135	----------------------------------------------------------------*/
   136	
   137	function computeHash(content: string): string {
   138	  return createHash('sha256').update(content, 'utf8').digest('hex');
   139	}
   140	
   141	/* ───────────────────────────────────────────────────────────────
   142	   5. APPEND ENTRY
   143	----------------------------------------------------------------*/
   144	
   145	function appendEntry(db: Database.Database, entry: AppendEntryInput): MutationLedgerEntry {
   146	  const linkedJson = JSON.stringify(entry.linked_memory_ids);
   147	  const metaJson = JSON.stringify(entry.decision_meta);
   148	
   149	  const stmt = db.prepare(`
   150	    INSERT INTO mutation_ledger (mutation_type, reason, prior_hash, new_hash, linked_memory_ids, decision_meta, actor, session_id)
   151	    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
   152	  `);
   153	
   154	  const result = stmt.run(
   155	    entry.mutation_type,
   156	    entry.reason,
   157	    entry.prior_hash,
   158	    entry.new_hash,
   159	    linkedJson,
   160	    metaJson,
   161	    entry.actor,
   162	    entry.session_id ?? null
   163	  );
   164	
   165	  const id = (result as { lastInsertRowid: number | bigint }).lastInsertRowid as number;
   166	
   167	  const row = db.prepare('SELECT * FROM mutation_ledger WHERE id = ?').get(id) as MutationLedgerEntry;
   168	  return row;
   169	}
   170	
   171	/* ───────────────────────────────────────────────────────────────
   172	   6. QUERY ENTRIES
   173	----------------------------------------------------------------*/
   174	
   175	function getEntries(db: Database.Database, opts: GetEntriesOptions = {}): MutationLedgerEntry[] {
   176	  const conditions: string[] = [];
   177	  const params: Array<string | number> = [];
   178	
   179	  if (opts.mutation_type) {
   180	    conditions.push('mutation_type = ?');
   181	    params.push(opts.mutation_type);
   182	  }
   183	  if (opts.actor) {
   184	    conditions.push('actor = ?');
   185	    params.push(opts.actor);
   186	  }
   187	  if (opts.session_id) {
   188	    conditions.push('session_id = ?');
   189	    params.push(opts.session_id);
   190	  }
   191	  if (opts.since) {
   192	    conditions.push('timestamp >= ?');
   193	    params.push(opts.since);
   194	  }
   195	  if (opts.until) {
   196	    conditions.push('timestamp <= ?');
   197	    params.push(opts.until);
   198	  }
   199	
   200	  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
   201	  // String interpolation in LIMIT/OFFSET is safe here because both values
   202	  // Are coerced to non-negative integers via Math.floor + Math.max before use —
   203	  // Math.floor guarantees no decimal component, Math.max(1,…)/Math.max(0,…)
   204	  // Guarantees no negative value. No user-supplied string reaches the SQL directly.
   205	  const limit = opts.limit ? `LIMIT ${Math.max(1, Math.floor(opts.limit))}` : '';
   206	  // F-13 — OFFSET without LIMIT is invalid SQLite syntax.
   207	  // When offset is set but limit is not, emit LIMIT -1 (all rows) before OFFSET.
   208	  const offset = opts.offset ? `OFFSET ${Math.max(0, Math.floor(opts.offset))}` : '';
   209	  const effectiveLimit = !limit && offset ? 'LIMIT -1' : limit;
   210	
   211	  // String interpolation constructs IN(?,?,?) placeholder list only —
   212	  // All user values are parameterized. Accepted exception per audit H-08.
   213	  const sql = `SELECT * FROM mutation_ledger ${where} ORDER BY id ASC ${effectiveLimit} ${offset}`;
   214	  return db.prepare(sql).all(...params) as MutationLedgerEntry[];
   215	}
   216	
   217	function getEntryCount(db: Database.Database): number {
   218	  const row = db.prepare('SELECT COUNT(*) as count FROM mutation_ledger').get() as { count: number };
   219	  return row.count;
   220	}
   221	
   222	/* ───────────────────────────────────────────────────────────────
   223	   7. LINKED ENTRIES LOOKUP
   224	----------------------------------------------------------------*/
   225	
   226	function getLinkedEntries(db: Database.Database, memoryId: number): MutationLedgerEntry[] {
   227	  // SQLite json_each can expand JSON arrays for matching
   228	  const sql = `
   229	    SELECT ml.* FROM mutation_ledger ml, json_each(ml.linked_memory_ids) je
   230	    WHERE je.value = ?
   231	    ORDER BY ml.id ASC
   232	  `;
   233	  return db.prepare(sql).all(memoryId) as MutationLedgerEntry[];
   234	}
   235	
   236	/* ───────────────────────────────────────────────────────────────
   237	   8. APPEND-ONLY VERIFICATION
   238	----------------------------------------------------------------*/
   239	
   240	/**
   241	 * Verify that append-only triggers exist on the mutation_ledger table.
   242	 * Returns true if both UPDATE and DELETE triggers are present.
   243	 */
   244	function verifyAppendOnly(db: Database.Database): boolean {
   245	  const triggers = db.prepare(
   246	    "SELECT name FROM sqlite_master WHERE type = 'trigger' AND tbl_name = 'mutation_ledger'"
   247	  ).all() as Array<{ name: string }>;
   248	
   249	  const names = triggers.map(t => t.name);
   250	  return names.includes('prevent_ledger_update') && names.includes('prevent_ledger_delete');
   251	}
   252	
   253	/* ───────────────────────────────────────────────────────────────
   254	   9. DIVERGENCE RETRY + ESCALATION HOOKS
   255	----------------------------------------------------------------*/
   256	
   257	const DEFAULT_DIVERGENCE_RECONCILE_MAX_RETRIES = 3;
   258	const DIVERGENCE_RECONCILE_REASON = 'alias_divergence_auto_reconcile';
   259	const DIVERGENCE_RECONCILE_ESCALATION_REASON = 'alias_divergence_auto_reconcile_escalated';
   260	const DIVERGENCE_RECONCILE_ACTOR = 'memory-index-scan';

 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Memory Lineage State
     3	// ───────────────────────────────────────────────────────────────
     4	// Provides append-first lineage transitions, active projection reads,
     5	// Temporal asOf resolution, and backfill/integrity helpers.
     6	import { createHash } from 'node:crypto';
     7	import type Database from 'better-sqlite3';
     8	
     9	import * as bm25Index from '../search/bm25-index.js';
    10	import * as embeddingsProvider from '../providers/embeddings.js';
    11	import { getCanonicalPathKey } from '../utils/canonical-path.js';
    12	import { ensureLineageTables } from '../search/vector-index-schema.js';
    13	import { get_embedding_dim, refresh_interference_scores_for_folder, sqlite_vec_available } from '../search/vector-index-store.js';
    14	import { to_embedding_buffer } from '../search/vector-index-types.js';
    15	import type { ParsedMemory } from '../parsing/memory-parser.js';
    16	import { classifyEncodingIntent } from '../search/encoding-intent.js';
    17	import { isEncodingIntentEnabled } from '../search/search-flags.js';
    18	import { createLogger } from '../utils/logger.js';
    19	import { detectSpecLevelFromParsed } from '../spec/spec-level.js';
    20	import { getHistoryEventsForLineage, init as initHistory, recordHistory, type HistoryLineageEvent } from './history.js';
    21	import { calculateDocumentWeight, isSpecDocumentType } from './document-helpers.js';
    22	import { applyPostInsertMetadata } from './post-insert-metadata.js';
    23	
    24	// Feature catalog: Lineage state active projection and asOf resolution
    25	const logger = createLogger('LineageState');
    26	
    27	
    28	type MemoryIndexRow = Record<string, unknown> & {
    29	  id: number;
    30	  spec_folder: string;
    31	  file_path: string;
    32	  canonical_file_path?: string | null;
    33	  anchor_id?: string | null;
    34	  tenant_id?: string | null;
    35	  user_id?: string | null;
    36	  agent_id?: string | null;
    37	  session_id?: string | null;
    38	  shared_space_id?: string | null;
    39	  title?: string | null;
    40	  content_hash?: string | null;
    41	  created_at?: string;
    42	  updated_at?: string;
    43	};
    44	
    45	type LineageTransitionEvent = 'CREATE' | 'UPDATE' | 'SUPERSEDE' | 'BACKFILL';
    46	
    47	interface MemoryLineageRow {
    48	  memory_id: number;
    49	  logical_key: string;
    50	  version_number: number;
    51	  root_memory_id: number;
    52	  predecessor_memory_id: number | null;
    53	  superseded_by_memory_id: number | null;
    54	  valid_from: string;
    55	  valid_to: string | null;
    56	  transition_event: LineageTransitionEvent;
    57	  actor: string;
    58	  metadata: string | null;
    59	  created_at: string;
    60	}
    61	
    62	interface ActiveProjectionRow {
    63	  logical_key: string;
    64	  root_memory_id: number;
    65	  active_memory_id: number;
    66	  updated_at: string;
    67	}
    68	
    69	interface LoadedLineageRows {
    70	  logicalKey: string;
    71	  projection: ActiveProjectionRow | null;
    72	  rows: MemoryLineageRow[];
    73	}
    74	
    75	interface LineageMetadata {
    76	  contentHash: string | null;
    77	  filePath: string;
    78	  canonicalFilePath: string | null;
    79	  anchorId: string | null;
    80	  specFolder: string;
    81	  snapshot: MemoryIndexRow;
    82	  history: HistoryLineageEvent[];
    83	  actor: string;
    84	}
    85	
    86	interface RecordLineageTransitionOptions {
    87	  actor?: string;
    88	  predecessorMemoryId?: number | null;
    89	  transitionEvent?: LineageTransitionEvent;
    90	  validFrom?: string;
    91	  historyEvents?: HistoryLineageEvent[];
    92	}
    93	
    94	const MAX_LINEAGE_VERSION_RETRIES = 3;
    95	
    96	interface RecordedLineageTransition {
    97	  logicalKey: string;
    98	  versionNumber: number;
    99	  rootMemoryId: number;
   100	  activeMemoryId: number;
   101	  predecessorMemoryId: number | null;
   102	  transitionEvent: LineageTransitionEvent;
   103	}
   104	
   105	interface ResolvedLineageSnapshot {
   106	  logicalKey: string;
   107	  memoryId: number;
   108	  versionNumber: number;
   109	  rootMemoryId: number;
   110	  validFrom: string;
   111	  validTo: string | null;
   112	  transitionEvent: LineageTransitionEvent;
   113	  snapshot: MemoryIndexRow;
   114	}
   115	
   116	interface LineageInspectionSummary {
   117	  logicalKey: string;
   118	  rootMemoryId: number;
   119	  activeMemoryId: number | null;
   120	  activeVersionNumber: number | null;
   121	  totalVersions: number;
   122	  versionNumbers: number[];
   123	  historicalMemoryIds: number[];
   124	  firstValidFrom: string;
   125	  latestValidFrom: string;
   126	  actors: string[];
   127	  transitionCounts: Record<LineageTransitionEvent, number>;
   128	  hasVersionGaps: boolean;
   129	  hasMultipleActiveVersions: boolean;
   130	}
   131	
   132	interface ValidateLineageIntegrityResult {
   133	  valid: boolean;
   134	  issues: string[];
   135	  activeProjectionCount: number;
   136	  lineageRowCount: number;
   137	  missingPredecessors: number[];
   138	  duplicateActiveLogicalKeys: string[];
   139	  projectionMismatches: string[];
   140	}
   141	
   142	interface BackfillLineageResult {
   143	  dryRun: boolean;
   144	  scanned: number;
   145	  seeded: number;
   146	  skipped: number;
   147	  logicalKeys: string[];
   148	  totalGroups: number;
   149	}
   150	
   151	interface LineageWriteBenchmarkResult {
   152	  memoryIds: number[];
   153	  iterations: number;
   154	  insertedVersions: number;
   155	  durationMs: number;
   156	  averageWriteMs: number;
   157	  logicalKey: string | null;
   158	  rootMemoryId: number | null;
   159	  activeMemoryId: number | null;
   160	  finalVersionNumber: number | null;
   161	}
   162	
   163	interface CreateAppendOnlyMemoryRecordParams {
   164	  database: Database.Database;
   165	  parsed: ParsedMemory;
   166	  filePath: string;
   167	  embedding: Float32Array | null;
   168	  embeddingFailureReason: string | null;
   169	  predecessorMemoryId: number;
   170	  actor?: string;
   171	}
   172	
   173	type LineageRow = MemoryLineageRow;
   174	
   175	function getMemoryRow(database: Database.Database, memoryId: number): MemoryIndexRow {
   176	  const row = database.prepare('SELECT * FROM memory_index WHERE id = ?').get(memoryId) as MemoryIndexRow | undefined;
   177	  if (!row) {
   178	    throw new Error(`Memory ${memoryId} not found in memory_index`);
   179	  }
   180	  return row;
   181	}
   182	
   183	function normalizeTimestamp(value?: string | null): string {
   184	  if (typeof value === 'string' && value.trim().length > 0) {
   185	    return value;
   186	  }
   187	  return new Date().toISOString();
   188	}
   189	
   190	function getSafeHistoryEvents(database: Database.Database, memoryId: number): HistoryLineageEvent[] {
   191	  try {
   192	    return getHistoryEventsForLineage(memoryId, database);
   193	  } catch (error: unknown) {
   194	    logger.warn(`History events retrieval failed for memory ${memoryId}: ${error instanceof Error ? error.message : String(error)}`);
   195	    return [];
   196	  }
   197	}
   198	
   199	function normalizeScopeValue(value: unknown): string | null {
   200	  if (typeof value !== 'string') {
   201	    return null;
   202	  }
   203	  const trimmed = value.trim();
   204	  return trimmed.length > 0 ? trimmed : null;
   205	}
   206	
   207	function buildScopePrefix(row: MemoryIndexRow): string | null {
   208	  const scopeTuple = [
   209	    ['tenant', normalizeScopeValue(row.tenant_id)],
   210	    ['user', normalizeScopeValue(row.user_id)],
   211	    ['agent', normalizeScopeValue(row.agent_id)],
   212	    ['session', normalizeScopeValue(row.session_id)],
   213	    ['shared_space', normalizeScopeValue(row.shared_space_id)],
   214	  ].filter((entry): entry is [string, string] => entry[1] != null);
   215	
   216	  if (scopeTuple.length === 0) {
   217	    return null;
   218	  }
   219	
   220	  const scopeHash = createHash('sha256')
   221	    .update(JSON.stringify(scopeTuple), 'utf8')
   222	    .digest('hex')
   223	    .slice(0, 24);
   224	
   225	  return `scope-sha256:${scopeHash}`;
   226	}
   227	
   228	function hasLogicalKeySeparatorCollision(...components: string[]): boolean {
   229	  return components.some((component) => component.includes('::'));
   230	}
   231	
   232	function buildHashedLogicalKey(parts: {
   233	  specFolder: string;
   234	  scopePrefix: string | null;
   235	  canonicalPath: string;
   236	  anchorId: string;
   237	}): string {
   238	  const payload = JSON.stringify({
   239	    version: 2,
   240	    specFolder: parts.specFolder,
   241	    scopePrefix: parts.scopePrefix,
   242	    canonicalPath: parts.canonicalPath,
   243	    anchorId: parts.anchorId,
   244	  });
   245	  const digest = createHash('sha256')
   246	    .update(payload, 'utf8')
   247	    .digest('hex');
   248	  return `logical-sha256:${digest}`;
   249	}
   250	
   251	function buildLogicalKey(row: MemoryIndexRow): string {
   252	  const canonicalPath = typeof row.canonical_file_path === 'string' && row.canonical_file_path.trim().length > 0
   253	    ? row.canonical_file_path.trim()
   254	    : getCanonicalPathKey(row.file_path);
   255	  const anchorId = typeof row.anchor_id === 'string' && row.anchor_id.trim().length > 0
   256	    ? row.anchor_id.trim()
   257	    : '_';
   258	  const scopePrefix = buildScopePrefix(row);
   259	
   260	  if (hasLogicalKeySeparatorCollision(row.spec_folder, canonicalPath, anchorId)) {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '440,470p;1056,1118p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   440	// Sections 3–5 (STATE_PRIORITY, MAX_DEEP_QUERY_VARIANTS, buildDeepQueryVariants,
   441	// StrengthenOnAccess, applyTestingEffect, filterByMemoryState) removed in
   442	// These were only used by the legacy V1 pipeline.
   443	// The V2 4-stage pipeline handles state filtering (Stage 4), testing effect, and
   444	// Query expansion through its own stages.
   445	
   446	/* ───────────────────────────────────────────────────────────────
   447	   6. SESSION DEDUPLICATION UTILITIES
   448	──────────────────────────────────────────────────────────────── */
   449	
   450	function applySessionDedup(results: MemorySearchRow[], sessionId: string, enableDedup: boolean): DedupResult {
   451	  if (!enableDedup || !sessionId || !sessionManager.isEnabled()) {
   452	    return {
   453	      results,
   454	      dedupStats: { enabled: false, sessionId: null }
   455	    };
   456	  }
   457	
   458	  const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, results as Parameters<typeof sessionManager.filterSearchResults>[1]);
   459	
   460	  if (filtered.length > 0) {
   461	    sessionManager.markResultsSent(sessionId, filtered as Parameters<typeof sessionManager.markResultsSent>[1]);
   462	  }
   463	
   464	  return {
   465	    results: filtered as MemorySearchRow[],
   466	    dedupStats: {
   467	      ...dedupStats,
   468	      sessionId
   469	    }
   470	  };
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '740,770p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
# Iteration 006: MEMORY HYGIENE

## Focus
MEMORY HYGIENE: Deduplication, upserts, revision tracking, garbage collection, soft deletes, topic key stability.

## Findings
### Finding 1: Mnemosyne treats contradiction cleanup as agent behavior, not as a first-class revision model
- **Source**: [external/src/index.ts:193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L193), [external/src/index.ts:210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [external/README.md:62](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L62), [create-record.ts:244](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L244), [create-record.ts:253](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L253), [lineage-state.ts:45](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L45), [history.ts:306](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts#L306)
- **What it does**: Wrapper-confirmed, Mnemosyne exposes `memory_delete(id)` and injects compaction guidance telling the agent to delete contradicted memories before storing new ones; README guidance says the same. There is no wrapper-visible `update`, `supersede`, lineage, or revision table. Public instead deprecates predecessors on save, records lineage transitions, and appends history entries.
- **Why it matters for us**: Mnemosyne’s hygiene model is mostly prompt discipline plus delete, while Public already has contradiction-safe revision structure. A direct wrapper adoption would be a downgrade in revision safety.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Mnemosyne has no wrapper-level dedup or upsert path; every store is a blind append
- **Source**: [external/src/index.ts:138](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L138), [external/src/index.ts:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L160), [dedup.ts:182](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts#L182), [dedup.ts:245](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts#L245), [reconsolidation-bridge.ts:395](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L395), [reconsolidation.ts:255](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts#L255)
- **What it does**: Wrapper-confirmed, `memory_store` and `memory_store_global` always shell out to `mnemosyne add`; there is no preflight duplicate check, unchanged short-circuit, or merge decision in the wrapper. Public checks same-path equivalence, content-hash duplicates, and can archive the older record during reconsolidation or append-only merge flows.
- **Why it matters for us**: For memory hygiene, Mnemosyne’s UX is lightweight but mutation semantics are shallow. Public already has the stronger behavior we would want to preserve.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: Mnemosyne’s topic key stability depends on directory basename, which is fragile across renames and sibling worktrees
- **Source**: [external/src/index.ts:27](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L27), [external/README.md:51](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L51), [canonical-path.ts:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts#L18), [lineage-state.ts:207](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L207), [lineage-state.ts:232](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L232), [create-record.ts:162](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L162)
- **What it does**: Wrapper-confirmed, Mnemosyne normalizes the active project to `path.basename(targetDir)`, with a `global -> default` special case. Public uses canonical realpath-based file identity and hashed logical keys that incorporate scope, canonical path, and anchor.
- **Why it matters for us**: Basename-derived project keys are unstable under folder renames and collision-prone across similarly named repos or worktrees. Public’s keying strategy is materially safer for long-lived memory hygiene.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 4: Mnemosyne’s deletion flow is hard-delete by opaque numeric ID from plain-text recall output
- **Source**: [external/src/index.ts:104](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L104), [external/src/index.ts:114](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L114), [external/src/index.ts:193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L193), [external/README.md:45](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L45), [memory-crud-delete.ts:91](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts#L91), [memory-bulk-delete.ts:141](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts#L141), [mutation-ledger.ts:89](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts#L89)
- **What it does**: Wrapper-confirmed, Mnemosyne recalls with `--format plain`, expects IDs in bracketed text, and deletes by raw numeric document ID. Public delete paths are transactional, record history, clean causal edges, append to an immutable mutation ledger, and can checkpoint bulk cleanup first.
- **Why it matters for us**: Mnemosyne’s flow is simple for humans but weak for safe automation, auditability, and traceable rollbacks. Any future external-binary adapter would need richer envelopes than plain text.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 5: The compaction hook is Mnemosyne’s best hygiene idea, but it is guidance-only
- **Source**: [external/src/index.ts:208](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L208), [spec-kit-compact-code-graph.js:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396), [context-server.ts:755](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755)
- **What it does**: Wrapper-confirmed, Mnemosyne injects a compact “Persistent Memory” block during `experimental.session.compacting` that reminds the agent when to recall, store, delete contradicted entries, use `core`, and use global scope. Public’s compaction plugin injects transport content blocks, while server instructions advertise key tools but do not inject the same direct memory-discipline checklist into compaction.
- **Why it matters for us**: This is the most transferable hygiene improvement in the external repo. It does not improve mutation correctness by itself, but it likely improves agent behavior after context resets at very low cost.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 6: Mnemosyne’s wrapper shows no garbage collection or soft-delete lifecycle, while Public already has both
- **Source**: [external/src/index.ts:78](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L78), [external/src/index.ts:138](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L138), [external/src/index.ts:193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L193), [vector-index-schema.ts:2333](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L2333), [scope-governance.ts:221](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L221), [vector-index-queries.ts:224](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts#L224), [archival-manager.ts:558](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L558), [archival-manager.ts:670](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L670)
- **What it does**: Wrapper-confirmed, Mnemosyne’s visible lifecycle is `init`, `search`, `add`, and `delete`; there is no wrapper-level archive, unarchive, expiry, or sweep behavior. Public persists `retention_policy`, `delete_after`, and `expires_at`, excludes expired or archived rows at query time, and runs archive/unarchive plus background archival scans.
- **Why it matters for us**: For hygiene, Mnemosyne is not a lifecycle-management upgrade over Public. If we ever front an external binary, we would need an adapter that preserves Public’s retention and soft-delete semantics.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [create-record.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts)
- [dedup.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts)
- [reconsolidation-bridge.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts)
- [memory-crud-update.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts)
- [memory-crud-delete.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts)
- [memory-bulk-delete.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts)
- [history.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts)
- [lineage-state.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts)
- [mutation-ledger.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts)
- [vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts)
- [vector-index-queries.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts)
- [canonical-path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts)
- [archival-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [migrate-trigger-phrase-residual.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js)

## Assessment
- New information ratio: 0.90
- Questions addressed: dedup/upsert behavior, revision tracking, delete semantics, garbage collection, soft deletes, topic key stability, compaction hygiene guidance, auditability of mutation flows
- Questions answered: Mnemosyne’s wrapper exposes no dedup, no upsert, no revision lineage, no soft-delete lifecycle, and no retention/GC contract; contradiction hygiene is primarily agent guidance plus hard delete; basename-derived project scoping is materially less stable than Public’s canonical-path plus logical-key approach; the compaction reminder block is the only clear hygiene improvement worth borrowing immediately; the exact strict validation command returned `RESULT: PASSED` with the warning `cannot create temp file for here document: Operation not permitted`

## Reflection
- What worked: starting with `external/src/index.ts` made the hygiene boundary obvious, then tracing Public’s save, lineage, history, ledger, archival, and query filters showed exactly where Mnemosyne is thinner
- What did not work: the external repo is intentionally minimal, so many lifecycle questions stop at wrapper absence rather than deeper source proof; this sandbox is read-only, so I could not update `research/research.md`, `checklist.md`, `implementation-summary.md`, or run `generate-context.js` to save phase memory

## Recommended Next Focus
Trace the adapter requirements for a future external-binary facade: what response envelope, stable scope key, supersede/archive mapping, mutation audit trail, and delete safety layer would be required so an Mnemosyne-style plugin could preserve Public-grade hygiene instead of collapsing down to plain-text recall and hard-delete-by-ID.


hook: Stop
hook: Stop Completed
tokens used
161,013
# Iteration 006: MEMORY HYGIENE

## Focus
MEMORY HYGIENE: Deduplication, upserts, revision tracking, garbage collection, soft deletes, topic key stability.

## Findings
### Finding 1: Mnemosyne treats contradiction cleanup as agent behavior, not as a first-class revision model
- **Source**: [external/src/index.ts:193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L193), [external/src/index.ts:210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [external/README.md:62](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L62), [create-record.ts:244](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L244), [create-record.ts:253](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L253), [lineage-state.ts:45](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L45), [history.ts:306](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts#L306)
- **What it does**: Wrapper-confirmed, Mnemosyne exposes `memory_delete(id)` and injects compaction guidance telling the agent to delete contradicted memories before storing new ones; README guidance says the same. There is no wrapper-visible `update`, `supersede`, lineage, or revision table. Public instead deprecates predecessors on save, records lineage transitions, and appends history entries.
- **Why it matters for us**: Mnemosyne’s hygiene model is mostly prompt discipline plus delete, while Public already has contradiction-safe revision structure. A direct wrapper adoption would be a downgrade in revision safety.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Mnemosyne has no wrapper-level dedup or upsert path; every store is a blind append
- **Source**: [external/src/index.ts:138](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L138), [external/src/index.ts:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L160), [dedup.ts:182](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts#L182), [dedup.ts:245](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts#L245), [reconsolidation-bridge.ts:395](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L395), [reconsolidation.ts:255](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts#L255)
- **What it does**: Wrapper-confirmed, `memory_store` and `memory_store_global` always shell out to `mnemosyne add`; there is no preflight duplicate check, unchanged short-circuit, or merge decision in the wrapper. Public checks same-path equivalence, content-hash duplicates, and can archive the older record during reconsolidation or append-only merge flows.
- **Why it matters for us**: For memory hygiene, Mnemosyne’s UX is lightweight but mutation semantics are shallow. Public already has the stronger behavior we would want to preserve.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: Mnemosyne’s topic key stability depends on directory basename, which is fragile across renames and sibling worktrees
- **Source**: [external/src/index.ts:27](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L27), [external/README.md:51](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L51), [canonical-path.ts:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts#L18), [lineage-state.ts:207](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L207), [lineage-state.ts:232](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L232), [create-record.ts:162](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L162)
- **What it does**: Wrapper-confirmed, Mnemosyne normalizes the active project to `path.basename(targetDir)`, with a `global -> default` special case. Public uses canonical realpath-based file identity and hashed logical keys that incorporate scope, canonical path, and anchor.
- **Why it matters for us**: Basename-derived project keys are unstable under folder renames and collision-prone across similarly named repos or worktrees. Public’s keying strategy is materially safer for long-lived memory hygiene.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 4: Mnemosyne’s deletion flow is hard-delete by opaque numeric ID from plain-text recall output
- **Source**: [external/src/index.ts:104](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L104), [external/src/index.ts:114](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L114), [external/src/index.ts:193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L193), [external/README.md:45](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L45), [memory-crud-delete.ts:91](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts#L91), [memory-bulk-delete.ts:141](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts#L141), [mutation-ledger.ts:89](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts#L89)
- **What it does**: Wrapper-confirmed, Mnemosyne recalls with `--format plain`, expects IDs in bracketed text, and deletes by raw numeric document ID. Public delete paths are transactional, record history, clean causal edges, append to an immutable mutation ledger, and can checkpoint bulk cleanup first.
- **Why it matters for us**: Mnemosyne’s flow is simple for humans but weak for safe automation, auditability, and traceable rollbacks. Any future external-binary adapter would need richer envelopes than plain text.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 5: The compaction hook is Mnemosyne’s best hygiene idea, but it is guidance-only
- **Source**: [external/src/index.ts:208](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L208), [spec-kit-compact-code-graph.js:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396), [context-server.ts:755](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755)
- **What it does**: Wrapper-confirmed, Mnemosyne injects a compact “Persistent Memory” block during `experimental.session.compacting` that reminds the agent when to recall, store, delete contradicted entries, use `core`, and use global scope. Public’s compaction plugin injects transport content blocks, while server instructions advertise key tools but do not inject the same direct memory-discipline checklist into compaction.
- **Why it matters for us**: This is the most transferable hygiene improvement in the external repo. It does not improve mutation correctness by itself, but it likely improves agent behavior after context resets at very low cost.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 6: Mnemosyne’s wrapper shows no garbage collection or soft-delete lifecycle, while Public already has both
- **Source**: [external/src/index.ts:78](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L78), [external/src/index.ts:138](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L138), [external/src/index.ts:193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L193), [vector-index-schema.ts:2333](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L2333), [scope-governance.ts:221](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L221), [vector-index-queries.ts:224](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts#L224), [archival-manager.ts:558](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L558), [archival-manager.ts:670](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L670)
- **What it does**: Wrapper-confirmed, Mnemosyne’s visible lifecycle is `init`, `search`, `add`, and `delete`; there is no wrapper-level archive, unarchive, expiry, or sweep behavior. Public persists `retention_policy`, `delete_after`, and `expires_at`, excludes expired or archived rows at query time, and runs archive/unarchive plus background archival scans.
- **Why it matters for us**: For hygiene, Mnemosyne is not a lifecycle-management upgrade over Public. If we ever front an external binary, we would need an adapter that preserves Public’s retention and soft-delete semantics.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [create-record.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts)
- [dedup.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts)
- [reconsolidation-bridge.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts)
- [memory-crud-update.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts)
- [memory-crud-delete.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts)
- [memory-bulk-delete.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts)
- [history.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts)
- [lineage-state.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts)
- [mutation-ledger.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts)
- [vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts)
- [vector-index-queries.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts)
- [canonical-path.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts)
- [archival-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [migrate-trigger-phrase-residual.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js)

## Assessment
- New information ratio: 0.90
- Questions addressed: dedup/upsert behavior, revision tracking, delete semantics, garbage collection, soft deletes, topic key stability, compaction hygiene guidance, auditability of mutation flows
- Questions answered: Mnemosyne’s wrapper exposes no dedup, no upsert, no revision lineage, no soft-delete lifecycle, and no retention/GC contract; contradiction hygiene is primarily agent guidance plus hard delete; basename-derived project scoping is materially less stable than Public’s canonical-path plus logical-key approach; the compaction reminder block is the only clear hygiene improvement worth borrowing immediately; the exact strict validation command returned `RESULT: PASSED` with the warning `cannot create temp file for here document: Operation not permitted`

## Reflection
- What worked: starting with `external/src/index.ts` made the hygiene boundary obvious, then tracing Public’s save, lineage, history, ledger, archival, and query filters showed exactly where Mnemosyne is thinner
- What did not work: the external repo is intentionally minimal, so many lifecycle questions stop at wrapper absence rather than deeper source proof; this sandbox is read-only, so I could not update `research/research.md`, `checklist.md`, `implementation-summary.md`, or run `generate-context.js` to save phase memory

## Recommended Next Focus
Trace the adapter requirements for a future external-binary facade: what response envelope, stable scope key, supersede/archive mapping, mutation audit trail, and delete safety layer would be required so an Mnemosyne-style plugin could preserve Public-grade hygiene instead of collapsing down to plain-text recall and hard-delete-by-ID.
