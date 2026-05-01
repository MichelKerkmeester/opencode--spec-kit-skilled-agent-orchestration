### Finding 2: Reusing Mnemosyne’s AGENTS/startup discipline verbatim would misfit Public’s governed, file-backed memory model
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L62), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L738), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L897)
- **Evidence type**: README-documented for Mnemosyne workflow; wrapper-confirmed for Public startup guidance
- **What it does**: Mnemosyne recommends “recall at start, store after decisions, delete contradictions, use global for cross-project prefs.” Public already emits startup instructions, tool-routing hints, session priming, and automatic memory surfacing.
- **Why it matters for us**: The risk is instruction drift. If we copy Mnemosyne’s wording directly, we imply cheap direct mutation semantics that Public does not have: `memory_save` is governed and file-path constrained, and deletion/update flows are more opinionated than a simple binary-backed store.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 3: Thin `project` and `global` aliases are useful, but write-side aliases could blur Public’s scope boundaries
- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L27), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L118), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L492), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L812), [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1136)
- **Evidence type**: wrapper-confirmed for Mnemosyne; wrapper-confirmed for Public
- **What it does**: Mnemosyne derives project scope from the current directory basename, special-cases `global`, and exposes separate recall/store tools. Public already supports `retrievalLevel: local|global|auto` plus governed save scope via `tenantId`, `userId`, `agentId`, `sessionId`, and `sharedSpaceId`.
- **Why it matters for us**: Read aliases are low risk, but write aliases are not. A directory-basename mental model is much weaker than Public’s governed scope model and creates real collision/leak risks across similarly named repos, worktrees, or shared-memory spaces.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: A `core=true` shortcut could erode constitutional-tier discipline if it acts like a simple tag
- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L138), [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L53), [vector-index-store.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts#L609), [memory-crud-update.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts#L67)
- **Evidence type**: both
- **What it does**: Mnemosyne maps `core=true` to a `core` tag and describes it as always available context. Public’s “always surface” path is tied to the constitutional tier, token budgeting, cache keys, mutation hooks, and validated importance-tier updates.
- **Why it matters for us**: The risk is semantic collapse. If `core=true` becomes a casual alias, operators will over-promote memories, inflate the constitutional budget, and create ambiguity between `constitutional`, `critical`, and merely “important” memories.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: A native OpenCode memory facade is feasible, but a second authority layer would be the biggest adoption hazard
- **Source**: [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L31), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L38), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L168), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L330), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755)
- **Evidence type**: wrapper-confirmed for Mnemosyne wrapper shape; wrapper-confirmed for Public MCP/transport shape
- **What it does**: Mnemosyne is a tiny OpenCode plugin that delegates everything to a local binary via argv-safe `Bun.spawn`. Public already has a richer MCP server plus OpenCode transport payloads for bootstrap/resume/compaction.
- **Why it matters for us**: The biggest risk is split truth. If we add a native plugin that reinterprets save/search/scope logic instead of delegating to MCP, we will create semantic drift, duplicate failure handling, and mismatched recovery behavior. The offline-first dependency model also adds first-run latency and missing-binary failure states that Public’s current MCP surface does not require.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts)
- [memory-surface.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
- [memory-crud-update.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts)
- [vector-index-store.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)

## Assessment
- New information ratio: 0.67
- Questions addressed: adoption risk for compaction reminders, startup/AGENTS policy reuse, project/global ergonomic aliases, `core=true` mapping, thin plugin delegation, offline-first failure handling, and separation from CocoIndex/code-graph responsibilities
- Questions answered: the safest near-term adoption is still the compaction reminder pattern, but only as a deduped add-on to existing compaction transport; AGENTS guidance should be rewritten for governed saves instead of copied; project/global and `core=true` need wrapper-only prototypes because Public’s scope and constitutional semantics are stricter than Mnemosyne’s; a native OpenCode facade is viable only if it delegates to MCP and never becomes a second memory authority. Validation command run: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict`, which returned `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, while also emitting `cannot create temp file for here document: Operation not permitted`.

## Reflection
- What worked: starting from the wrapper source and then tracing Public’s save/search/compaction/governance paths made the real risks obvious; the important differences are not retrieval quality but scope authority, mutation semantics, and compaction duplication.
- What did not work: the external repo still exposes no backend ranking internals beyond the README contract, and the read-only sandbox prevented updating `research/research.md`, `implementation-summary.md`, `checklist.md`, or saving phase memory.

## Recommended Next Focus
Inspect whether Public’s OpenCode transport builder can host a dedicated memory-tool reminder block with strict dedupe and channel ownership, then separately design a read-only `project/global` alias prototype that maps onto existing `memory_search` scope rules without introducing any new write semantics.

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
# Iteration 019: PRIORITY RANKING

## Focus
PRIORITY RANKING: Rank ALL findings by impact x feasibility. Create a concrete adoption roadmap.

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
I’m treating this as a read-only deep-research pass for iteration 19, focused on ranking the existing Mnemosyne-derived findings and turning them into an adoption roadmap. I’ll start by doing a quick memory refresh plus source-trace pass on the external wrapper and the corresponding Public memory/compaction code so the ranking is grounded in actual implementation details, not the README alone.
exec
/bin/zsh -lc 'rg -n "mnemosyne|opencode-mnemosyne|hybrid-rag-fusion-upgrade|compaction|project/global|core=true" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
exec
/bin/zsh -lc pwd in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

exec
/bin/zsh -lc "rg --files -g 'CLAUDE.md' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/006-ralph-main/external/CLAUDE.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/CLAUDE.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/global-claude-md/CLAUDE.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/CLAUDE.md

codex
I didn’t get a useful direct memory hit for this specific phase, so I’m leaning on the repo’s current instructions and the prior findings you supplied. Next I’m reading the repo-level `CLAUDE.md` plus the exact external wrapper and Public comparison files in the order you specified, then I’ll convert that trace into a ranked roadmap.
exec
/bin/zsh -lc "sed -n '1,240p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
# AI Assistant Framework (Universal Template)

> **Universal behavior framework** defining guardrails, standards, and decision protocols.

---

## 1. 🚨 CRITICAL RULES

**HARD BLOCKERS (The "Four Laws" of Agent Safety):**
1. **READ FIRST:** Never edit a file without reading it first. Understand context before modifying.
2. **SCOPE LOCK:** Only modify files explicitly in scope. **NO** "cleaning up" or "improving" adjacent code. Scope in `spec.md` is FROZEN.
3. **VERIFY:** Syntax checks and tests **MUST** pass before claiming completion. **NO** blind commits.
4. **HALT:** Stop immediately if uncertain, if line numbers don't match, or if tests fail. (See "Halt Conditions" below).

**OPERATIONAL MANDATES:**
- **All file modifications require a spec folder** (Gate 3).
- **Never lie or fabricate** - use "UNKNOWN" when uncertain.
- **Clarify** if confidence < 80% (see §5 Confidence Framework).
- **Use explicit uncertainty:** Prefix claims with "I'M UNCERTAIN ABOUT THIS:".

**QUALITY PRINCIPLES:**
- **Prefer simplicity**, reuse existing patterns, and cite evidence with sources
- Solve only the stated problem; **avoid over-engineering** and premature optimization
- **Verify with checks** (simplicity, performance, maintainability, scope) before making changes
- **Truth over agreement** - correct user misconceptions with evidence; do not agree for conversational flow

**HALT CONDITIONS (Stop and Report):**
- [ ] Target file does not exist or line numbers don't match.
- [ ] Syntax check or Tests fail after edit.
- [ ] Merge conflicts encountered.
- [ ] Edit tool reports "string not found".
- [ ] Test/Production boundary is unclear.

**MANDATORY TOOLS:**
- **Spec Kit Memory MCP** for research tasks, context recovery, and finding prior work.  **Memory saves MUST use `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`** — NEVER manually create memory files.
  - AI composes structured JSON → `generate-context.js --json '{"specFolder":"...","sessionSummary":"..."}' [spec-folder]` or writes to `/tmp/save-context-data.json` and passes as first arg.
- **Code Search Decision Tree** (MANDATORY):
  - Semantic/concept search → `mcp__cocoindex_code__search` (CocoIndex). Skill: `.opencode/skill/mcp-coco-index/`
  - Structural queries (callers, imports, deps) → `code_graph_query` (Code Graph)
  - Exact text/regex → `Grep`

**GIT WORKFLOW:** 
Full details: `.opencode/skill/sk-git/`
- Worktree setup, conventional commits, PR creation, branch management
- Trigger keywords: worktree, branch, commit, merge, pr, pull request, git workflow, finish work, integrate changes

### Quick Reference: Common Workflows

| Task                      | Flow                                                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **File modification**     | Gate 3 (ask spec folder) → Gate 1 → Gate 2 → Load memory context → Execute                                                         |
| **Research/exploration**  | `memory_match_triggers()` → `memory_context()` (unified) OR `memory_search()` (targeted) → Document findings                       |
| **Code search**           | Semantic/concept → `CocoIndex search` · Structural (callers/imports/deps) → `code_graph_query` · Exact text → `Grep` · File paths → `Glob` · Read contents → `Read` |
| **Resume prior work**     | `/spec_kit:resume` OR `memory_context({ input: "resume previous work continue session", mode: "resume", profile: "resume", specFolder })` → Review checklist → Continue |
| **Save context**          | `/memory:save` OR compose JSON → `generate-context.js --json '<data>' [spec-folder]` → Auto-indexed |
| **Claim completion**      | Validation runs automatically → Load `checklist.md` → Verify ALL items → Mark with evidence                                        |
| **End session**           | `/spec_kit:handover` → Save context → Provide continuation prompt                                                                  |
| **New spec folder**       | Option B (Gate 3) → Research via Task tool → Evidence-based plan → Approval → Implement                                            |
| **Complex multi-step**    | Task tool → Decompose → Delegate → Synthesize                                                                                      |
| **Documentation**         | sk-doc skill → Classify → Load template → Fill → Validate (`validate_document.py`) → DQI score → Verify                            |
| **Web code**              | sk-code-web skill → Webflow/CDN standards, minification, browser testing                                                           |
| **OpenCode system code**  | sk-code-opencode skill → JS/TS/Python/Shell standards, language detection, quality checklists                                       |
| **Git workflow**          | sk-git skill → Worktree setup / Commit / Finish (PR)                                                                                |
| **Phase workflow**        | `/spec_kit:plan :with-phases` or `/spec_kit:complete :with-phases` → Decompose → `create.sh --phase` → Populate → Plan first child  |
| **Database maintenance**  | `/memory:manage` → stats, health, cleanup, checkpoint, ingest operations                                                           |
| **Deep research**         | `/spec_kit:deep-research` → Init state → Loop (@deep-research iterations) → Convergence → Synthesize → Memory save                            |
| **Deep review**           | `/spec_kit:deep-review` → Init state → Loop (@deep-review iterations) → Convergence → Synthesize → Memory save                                |
| **Analysis/evaluation**   | `/memory:search` → preflight, postflight, causal graph, ablation, dashboard, history                                            |
| **Constitutional memory** | `/memory:learn` → Constitutional memory manager: create, list, edit, remove, budget                                               |
| **Shared memory**         | `/memory:manage shared` → Shared-memory lifecycle: create spaces, manage memberships, inspect rollout                                    |

## Context Recovery

These recovery steps are universal across Claude Code, OpenCode, Codex CLI, Copilot CLI, and Gemini CLI.

### After Context Compaction Or `/clear`

1. **FIRST ACTION** — call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })`
2. Review the recovered state: current task, spec folder, blockers, and next steps
3. Re-read the active runtime-specific instructions if they exist (`CODEX.md`, `GEMINI.md`, `.claude/CLAUDE.md`, runtime agent docs)
4. Present a concise recovered summary and WAIT for confirmation before proceeding

### Coding Analysis Lenses 

| Lens               | Focus            | Detection Questions                                                                |
| ------------------ | ---------------- | ---------------------------------------------------------------------------------- |
| **CLARITY**        | Simplicity       | Is this the simplest code that solves the problem? Are abstractions earned?        |
| **SYSTEMS**        | Dependencies     | What does this change touch? What calls this? What are the side effects?           |
| **BIAS**           | Wrong problem    | Is user solving a symptom? Is this premature optimization? Is the framing correct? |
| **SUSTAINABILITY** | Maintainability  | Will future devs understand this? Is it self-documenting? Tech debt implications?  |
| **VALUE**          | Actual impact    | Does this change behavior or just refactor? Is it cosmetic or functional?          |
| **SCOPE**          | Complexity match | Does solution complexity match problem size? Single-line fix or new abstraction?   |

### Coding Anti-Patterns (Detect Silently)

| Anti-Pattern           | Trigger Phrases                                 | Response                                                                    |
| ---------------------- | ----------------------------------------------- | --------------------------------------------------------------------------- |
| Over-engineering       | "for flexibility", "future-proof", "might need" | Ask: "Is this solving a current problem or a hypothetical one?"             |
| Premature optimization | "could be slow", "might bottleneck"             | Ask: "Has this been measured? What's the actual performance?"               |
| Cargo culting          | "best practice", "always should"                | Ask: "Does this pattern fit this specific case?"                            |
| Gold-plating           | "while we're here", "might as well"             | Flag scope creep: "That's a separate change - shall I note it for later?"   |
| Wrong abstraction      | "DRY this up" for 2 instances                   | "These look similar but might not be the same concept. Let's verify first." |
| Scope creep            | "also add", "bonus feature"                     | "That's outside the current scope. Want to track it separately?"            |

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
- **Phase boundary:** Gate 3 answers apply ONLY within current workflow phase. Plan→implement transition MUST re-evaluate. Exception: carry-over IS valid for Memory Save Rule

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
| ------------ | -------------------------------------------- |
| **≥80%**     | Proceed with citable source                  |
| **40-79%**   | Proceed with caveats                         |
| **<40%**     | Ask for clarification or mark "UNKNOWN"      |
| **Override** | Blockers/conflicts → ask regardless of score |

**Logic-Sync Protocol:** On contradiction (Spec vs Code, conflicting requirements) → HALT → Report "LOGIC-SYNC REQUIRED: [Fact A] contradicts [Fact B]" → Ask "Which truth prevails?"

**Escalation:** Confidence stays <80% after two failed attempts → ask with 2-3 options. Blockers beyond control → escalate with evidence and proposed next step.

---

## 5. 🧠 REQUEST ANALYSIS & SOLUTION FRAMEWORK

**Flow:** Parse request → Read files first → Analyze → Design simplest solution → Validate → Execute

| Principle         | Rule                                               | Anti-Pattern                            |
| ----------------- | -------------------------------------------------- | --------------------------------------- |
| **Simplicity**    | Reuse patterns; earn every abstraction             | Utilities for <3 uses, single-impl intf |
| **Evidence**      | Cite `[SOURCE: file:lines]` or `[CITATION: NONE]`  | Claims without verification             |
| **Scope Match**   | Solution size = problem size                       | Refactoring during bug fix              |
| **Right Problem** | Root cause, not symptom; measure before optimizing | Premature optimization, wrong framing   |

**CLARITY Triggers** (justify before proceeding):
- Utility for <3 uses | Config for single value | Abstraction without clear boundary
- Pattern where simple code suffices | Interface for single impl
- On bias → don't argue, redirect to root cause

**Pre-Change Checklist:**
- [ ] Read first? | Simplest solution? | Scope discipline?
- [ ] Confidence ≥80%? | Sources cited? | Spec folder? | Approval?

**Five Checks (>100 LOC):** Necessary now? | Alternatives (≥2)? | Simplest sufficient? | On critical path? | No tech debt?


exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg --files /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main | rg '(AGENTS\\.md|CLAUDE\\.md|spec\\.md|plan\\.md|tasks\\.md|checklist\\.md|phase-research-prompt\\.md|research/research\\.md|implementation-summary\\.md)"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
{
  "name": "opencode-mnemosyne",
  "version": "0.2.4",
  "description": "OpenCode plugin for local persistent memory using Mnemosyne — offline semantic search, no cloud required",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "typecheck": "tsc --noEmit",
    "ci": "tsc --noEmit && tsc"
  },
  "keywords": [
    "opencode",
    "opencode-plugin",
    "mnemosyne",
    "memory",
    "local",
    "offline",
    "semantic-search",
    "ai",
    "coding-agent"
  ],
  "author": "gandazgul",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/gandazgul/opencode-mnemosyne.git"
  },
  "dependencies": {
    "@opencode-ai/plugin": "^1.2.24"
  },
  "devDependencies": {
    "@types/node": "^25.4.0",
    "typescript": "^5.9.3"
  },
  "opencode": {
    "type": "plugin"
  },
  "files": [
    "dist"
  ]
}

 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/phase-research-prompt.md

 succeeded in 0ms:
import path from "node:path";
import { type Plugin, tool } from "@opencode-ai/plugin";

export const MnemosynePlugin: Plugin = async (ctx) => {
  const { directory, worktree, client } = ctx;
  const targetDir = directory || worktree || process.cwd();

  const log = {
    debug: (msg: string) =>
      client.app
        .log({ body: { service: "mnemosyne", level: "debug", message: msg } })
        .catch(() => {}),
    info: (msg: string) =>
      client.app
        .log({ body: { service: "mnemosyne", level: "info", message: msg } })
        .catch(() => {}),
    warn: (msg: string) =>
      client.app
        .log({ body: { service: "mnemosyne", level: "warn", message: msg } })
        .catch(() => {}),
    error: (msg: string) =>
      client.app
        .log({ body: { service: "mnemosyne", level: "error", message: msg } })
        .catch(() => {}),
  };

  // Strip trailing slashes but keep the root slash if it's just "/"
  let projectDir = targetDir.replace(/(.+?)\/+$/, "$1");
  const projectRaw = path.basename(projectDir);
  const project = projectRaw === "global" ? "default" : (projectRaw || "default");

  await log.debug(`Plugin loaded for project: ${project} (dir: ${targetDir})`);

  /**
   * Run the mnemosyne CLI binary gracefully using Bun.spawn.
   * Avoids shell interpolation entirely by passing args as array.
   */
  async function mnemosyne(...args: string[]): Promise<string> {
    await log.debug(`Executing: mnemosyne ${args.join(" ")}`);
    try {
      // @ts-ignore - Bun is globally available in opencode environment
      const proc = Bun.spawn(["mnemosyne", ...args], {
        cwd: targetDir,
        stdout: "pipe",
        stderr: "pipe",
      });

      const [stdout, stderr, exitCode] = await Promise.all([
        new Response(proc.stdout).text(),
        new Response(proc.stderr).text(),
        proc.exited,
      ]);

      if (exitCode !== 0) {
        await log.error(`Execution failed (code ${exitCode}): ${stderr}`);
        throw new Error(stderr.trim() || `mnemosyne ${args[0]} failed`);
      }

      // mnemosyne may write output to stderr (older versions), use whichever has content
      const output = stdout || stderr;
      await log.debug(`Execution successful. Output size: ${output.length}`);
      return output;
    }
    catch (e: unknown) {
      await log.error(`Execution error: ${e instanceof Error ? e.stack : String(e)}`);
      const msg = e instanceof Error ? e.message : String(e);
      if (
        msg.includes("not found") ||
        msg.includes("ENOENT") ||
        msg.includes("No such file")
      ) {
        return "Error: mnemosyne binary not found. Install it: https://github.com/gandazgul/mnemosyne#install";
      }
      throw e;
    }
  }

  // Auto-init the project collection (idempotent).
  try {
    // @ts-ignore
    await Bun.spawn(["mnemosyne", "init", "--name", project], {
      cwd: targetDir,
      stdout: "ignore", // Silence "collection already exists" logs
      stderr: "pipe",   // Keep stderr for critical errors
    }).exited;
    await log.info(`Ensured collection exists: ${project}`);
  }
  catch (e) {
    await log.warn(`Failed to auto-init collection: ${e}`);
  }

  return {
    // ── Tools ──────────────────────────────────────────────

    tool: {
      memory_recall: tool({
        description:
          "Search project memory for relevant context, past decisions, and preferences. Use this at the start of conversations and whenever past context would help.",
        args: {
          query: tool.schema.string().describe("Semantic search query"),
        },
        async execute(args) {
          await log.info(`Searching project memory for: ${args.query}`);
          // Quote the query to prevent SQLite FTS errors with hyphens and special characters
          const safeQuery = `"${args.query.replaceAll('"', '""')}"`;
          const result = await mnemosyne(
            "search",
            "--name",
            project,
            "--format",
            "plain",
            safeQuery,
          );
          return result.trim() || "No memories found.";
        },
      }),

      memory_recall_global: tool({
        description:
          "Search global memory for cross-project preferences, decisions and patterns.",
        args: {
          query: tool.schema.string().describe("Semantic search query"),
        },
        async execute(args) {
          await log.info(`Searching global memory for: ${args.query}`);
          const safeQuery = `"${args.query.replaceAll('"', '""')}"`;
          const result = await mnemosyne(
            "search",
            "--global",
            "--format",
            "plain",
            safeQuery,
          );
          return result.trim() || "No global memories found.";
        },
      }),

      memory_store: tool({
        description:
          "Store a project memory: a decision, preference, or important context. One concise concept per memory. Set core=true for critical context that should always be available in every session (use sparingly).",
        args: {
          content: tool.schema.string().describe("Concise memory to store"),
          core: tool.schema.boolean().optional().describe(
            "If true, this memory is always injected into context (like AGENTS.md). Use sparingly."
          ),
        },
        async execute(args) {
          await log.info(`Storing project memory: ${args.content}`);
          const cmdArgs = ["add", "--name", project];
          if (args.core) {
            cmdArgs.push("--tag", "core");
          }
          cmdArgs.push(args.content);
          return (
            await mnemosyne(...cmdArgs)
          ).trim();
        },
      }),

      memory_store_global: tool({
        description:
          "Store a cross-project memory: personal preferences, coding style, tool choices. Set core=true for critical cross-project context that should always be available.",
        args: {
          content: tool.schema.string().describe("Global memory to store"),
          core: tool.schema.boolean().optional().describe(
            "If true, this memory is always injected into context. Use sparingly."
          ),
        },
        async execute(args) {
          await log.info(`Storing global memory: ${args.content}`);
          // Ensure the global collection exists.
          try {
            // @ts-ignore
            await Bun.spawn(["mnemosyne", "init", "--global"], {
              cwd: targetDir,
              stdout: "ignore", // Silence "collection already exists" logs
              stderr: "pipe",   // Keep stderr for critical errors
            }).exited;
            await log.info("Ensured global collection exists.");
          }
          catch (e) {
            await log.warn(`Failed to auto-init global collection: ${e}`);
          }
          const cmdArgs = ["add", "--global"];
          if (args.core) {
            cmdArgs.push("--tag", "core");
          }
          cmdArgs.push(args.content);
          return (await mnemosyne(...cmdArgs)).trim();
        },
      }),

      memory_delete: tool({
        description:
          "Delete an outdated or incorrect memory by its document ID (shown in [brackets] in recall/list results).",
        args: {
          id: tool.schema.number().describe("Document ID to delete"),
        },
        async execute(args) {
          await log.info(`Deleting memory document ID: ${args.id}`);
          return (await mnemosyne("delete", String(args.id))).trim();
        },
      }),
    },

    // ── Hooks ──────────────────────────────────────────────

    // Inject memory instructions into compaction so they survive
    // context window resets.
    "experimental.session.compacting": async (_input, output) => {
      output.context.push(`## Persistent Memory (mnemosyne)

You have persistent memory tools: memory_recall, memory_store, memory_delete,
memory_recall_global, memory_store_global.

When to use memory:
- Search memory when past context would help answer the user's request.
- Store concise summaries of important decisions, preferences, and patterns.
- Delete outdated memories when new decisions contradict them.
- Use **core** for facts that should always be in context (project architecture, key conventions, user preferences).
- Use **global** variants for cross-project preferences (coding style, tool choices).
- At the end of a session, store any relevant memories for future sessions.`);
    },
  };
};

codex
The wrapper is as thin as the brief suggested: almost all of the real differentiation is in scope derivation, tool ergonomics, and the compaction hook. I’m moving from the wrapper into the Public comparison surfaces now, plus I’m running the phase validator so the ranking stays anchored to the current packet state.
exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
# opencode-mnemosyne

OpenCode plugin for **local persistent memory** using [Mnemosyne](https://github.com/gandazgul/mnemosyne). Gives your AI coding agent memory that persists across sessions -- entirely offline, no cloud APIs.

This is the local/offline alternative to cloud-based memory plugins like opencode-supermemory.

## Prerequisites

Install the mnemosyne binary first:

```bash
# From source (requires Go 1.21+, GCC, Task)
git clone https://github.com/gandazgul/mnemosyne.git
cd mnemosyne
task install
```

See the [mnemosyne README](https://github.com/gandazgul/mnemosyne#quick-start) for detailed setup instructions. On first use, mnemosyne will automatically download its ML models (~500 MB one-time).

## Install

Add to your `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-mnemosyne"]
}
```

That's it. OpenCode will install the plugin automatically.

## What it does

### Tools

The plugin registers five tools available to the AI agent:

| Tool | Description |
|------|-------------|
| `memory_recall` | Search project memory for relevant context and past decisions |
| `memory_recall_global` | Search global memory for cross-project preferences |
| `memory_store` | Store a project-scoped memory (optionally as `core`) |
| `memory_store_global` | Store a cross-project memory (optionally as `core`) |
| `memory_delete` | Delete an outdated memory by its document ID |

### Hooks

- **`experimental.session.compacting`** -- Injects memory tool instructions into the compaction prompt so the agent retains awareness of its memory capabilities across context window resets.

### Memory scoping

| Scope | Collection | Persists across |
|-------|-----------|-----------------|
| Project | `<directory-name>` | Sessions in the same project |
| Global | `global` | All projects |
| Core (project) | `<directory-name>` (tagged `core`) | Sessions + survives compaction |
| Core (global) | `global` (tagged `core`) | All projects + survives compaction |

The project collection is auto-initialized when the plugin loads. The global collection is created on first use of `memory_store_global`.

## AGENTS.md (recommended)

For best results, add this to your project or global `AGENTS.md` so the agent uses memory proactively from the start of each session:

```markdown
## Memory (mnemosyne)

- At the start of a session, use memory_recall and memory_recall_global to search for context
  relevant to the user's first message.
- After significant decisions, use memory_store to save a concise summary.
- Delete contradicted memories with memory_delete before storing updated ones.
- Use memory_recall_global / memory_store_global for cross-project preferences.
- Mark critical, always-relevant context as core (core=true) — but use sparingly.
- When you are done with a session, store any memories that you think are relevant
  to the user and the project. This will help you recall important information in
  future sessions.
```

## How it works

Mnemosyne is a local document store with hybrid search:
- **Full-text search** (SQLite FTS5, BM25 ranking)
- **Vector search** (sqlite-vec, cosine similarity with snowflake-arctic-embed-m-v1.5)
- **Reciprocal Rank Fusion** combines both for best results

All ML inference runs locally via ONNX Runtime. Your memories never leave your machine.

## Development

This project uses standard Node.js tools: `npm` for package management and `tsc` (TypeScript compiler) for building.

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start the compiler in watch mode for development
npm run dev

# Run TypeScript checks
npm run typecheck
```

## License

MIT

exec
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
 succeeded in 1891ms:

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
The validator passed with the same sandbox-side temp-file warning you saw before, so the phase status is stable enough for analysis. I’m pulling the exact comparison points now: Public’s compaction transport, retrieval scope logic, constitutional handling, and governed save/delete paths so the roadmap can rank the ideas by both impact and integration risk.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "rg -n \"retrievalLevel|local\\|global\\|auto|includeConstitutional|constitutional|critical|always\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
190:  includeConstitutional?: boolean;
214:  retrievalLevel?: 'local' | 'global' | 'auto';
507:    includeConstitutional: includeConstitutional = true,
529:    retrievalLevel: retrievalLevel = 'auto',
692:  // Explicit caller `profile` always takes precedence; auto-detect fills in when absent.
737:    includeConstitutional,
788:      includeConstitutional,
818:      (retrievalLevel === 'global' || retrievalLevel === 'auto')
822:        (retrievalLevel === 'global') ||
823:        (resultsForFormatting.length < 3 && retrievalLevel === 'auto');
992:      appliedBoosts.communityFallback = { applied: true, retrievalLevel };

exec
/bin/zsh -lc 'rg -n "importanceTier|constitutional|critical|triggerPhrases|update" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
30:// Feature catalog: Memory metadata update (memory_update)
40:/** Handle memory_update tool -- updates metadata fields and optionally regenerates embeddings. */
49:    triggerPhrases,
51:    importanceTier,
67:  if (importanceTier !== undefined && !isValidTier(importanceTier)) {
70:      `Invalid importance tier: ${importanceTier}. Valid tiers: ${VALID_TIERS.join(', ')}`,
71:      { param: 'importanceTier', value: importanceTier }
83:  const updateParams: UpdateMemoryParams = { id };
84:  if (title !== undefined) updateParams.title = title;
85:  if (triggerPhrases !== undefined) updateParams.triggerPhrases = triggerPhrases;
86:  if (importanceWeight !== undefined) updateParams.importanceWeight = importanceWeight;
87:  if (importanceTier !== undefined) updateParams.importanceTier = importanceTier;
95:    console.error(`[memory-update] Title changed, regenerating embedding for memory ${id} [requestId=${requestId}]`);
107:        console.warn(`[memory-update] Embedding regeneration failed, marking for re-index [requestId=${requestId}]: ${message}`);
111:        console.error(`[memory-update] Embedding regeneration failed, rolling back update [requestId=${requestId}]: ${message}`);
114:          'Embedding regeneration failed, update rolled back. No changes were made.',
121:      updateParams.embedding = newEmbedding;
125:        console.warn('[memory-update] Embedding returned null, marking for re-index');
131:          'Failed to regenerate embedding (null result), update rolled back. No changes were made.',
138:  // T2-5 transaction wrapper — wraps all synchronous mutation steps (DB update,
140:  // Embedding generation (async) runs before this block; its result feeds into updateParams.
141:  const fields = Object.keys(updateParams).filter((key) => key !== 'id' && key !== 'embedding');
146:        vectorIndex.updateEmbeddingStatus(id, 'pending');
149:      vectorIndex.updateMemory(updateParams);
152:      // So keyword search reflects the updated content.
155:      if ((updateParams.title !== undefined || updateParams.triggerPhrases !== undefined) && bm25Index.isBm25Enabled()) {
181:            console.warn(`[memory-crud-update] BM25 infrastructure unavailable, skipping re-index [requestId=${requestId}]: ${bm25ErrMsg}`);
183:            console.error(`[memory-crud-update] BM25 re-index failed, rolling back update [requestId=${requestId}]: ${bm25ErrMsg}`);
194:          updateParams.title ?? existing.title ?? null,
195:          'mcp:memory_update'
202:        mutationType: 'update',
203:        reason: 'memory_update: metadata update',
207:          title: updateParams.title ?? existing.title ?? null,
208:          triggerPhrases: updateParams.triggerPhrases ?? null,
209:          importanceWeight: updateParams.importanceWeight ?? null,
210:          importanceTier: updateParams.importanceTier ?? null,
214:          tool: 'memory_update',
220:        actor: 'mcp:memory_update',
229:    console.warn('[memory-crud-update] No database handle, aborting update to prevent partial state');
231:      tool: 'memory_update',
232:      error: `Memory ${id} update aborted: database unavailable`,
234:      details: { updated: null, fields },
245:    postMutationHooks = runPostMutationHooks('update', { memoryId: id });
250:      constitutionalCacheCleared: false, toolCacheInvalidated: 0,
255:  const postMutationFeedback = buildMutationHookFeedback('update', postMutationHooks);
258:    ? `Memory ${id} updated (embedding pending re-index)`
259:    : `Memory ${id} updated successfully`;
274:    updated: id,
289:    tool: 'memory_update',

exec
/bin/zsh -lc 'rg -n "save|governed|filePath|tenantId|userId|agentId|sessionId|sharedSpaceId|retention|preflight" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
33:import * as preflight from '../lib/validation/preflight.js';
39:import { runQualityGate, isQualityGateEnabled } from '../lib/validation/save-quality-gate.js';
47:import { applyPostInsertMetadata } from './save/db-helpers.js';
48:import { createMemoryRecord, findSamePathExistingMemory, type MemoryScopeMatch } from './save/create-record.js';
80:} from './save/index.js';
81:import { checkExistingRow, checkContentHashDedup } from './save/dedup.js';
82:import { generateOrCacheEmbedding, persistPendingEmbeddingCacheWrite } from './save/embedding-pipeline.js';
83:import { evaluateAndApplyPeDecision } from './save/pe-orchestration.js';
84:import { runReconsolidationIfEnabled } from './save/reconsolidation-bridge.js';
85:import { runPostInsertEnrichment } from './save/post-insert.js';
86:import { buildIndexResult, buildSaveResponse } from './save/response-builder.js';
90:import { withSpecFolderLock } from './save/spec-folder-mutex.js';
91:import { buildParsedMemoryEvidenceSnapshot } from './save/markdown-evidence-builder.js';
97:} from './save/validation-responses.js';
103:// Feature catalog: Memory indexing (memory_save)
105:// Feature catalog: Dry-run preflight for memory_save
106:// Feature catalog: Prediction-error save arbitration
190:    filePath: parsed.filePath,
205:    console.warn(`[memory] Warning for ${path.basename(parsed.filePath)}:`);
210:  const vRuleResult = validateMemoryQualityContent(parsed.content, { filePath: parsed.filePath });
224:      console.error(`[memory-save] V-rule hard block for ${path.basename(parsed.filePath)}: ${failedRuleIds.join(', ')}`);
252:      console.warn(`[memory-save] V-rule index block for ${path.basename(parsed.filePath)}: ${vRuleDisposition.indexBlockingRuleIds.join(', ')}`);
280:    const warning = 'Manual fallback save mode detected; standard generate-context template markers are missing.';
281:    console.warn(`[memory-save] ${warning} ${path.basename(parsed.filePath)}`);
298:  if (parsed.specFolder && parsed.filePath) {
300:      const absFilePath = path.resolve(parsed.filePath);
312:        `[memory-save] spec-doc-health annotation skipped for ${path.basename(parsed.filePath)}: ${message}`
330:  filePath: string,
333:  const backupPath = `${filePath}.${randomUUID().slice(0, 8)}.bak`;
334:  const tempPath = `${filePath}.${randomUUID().slice(0, 8)}.tmp`;
340:      await fs.promises.copyFile(filePath, backupPath);
353:    await fs.promises.rename(tempPath, filePath);
365:        await fs.promises.copyFile(backupPath, filePath);
368:          '[memory-save] Auto-fix file restore failed after finalize error:',
511:function captureAtomicSaveOriginalState(filePath: string): { existed: boolean; content: string | null } {
512:  if (!fs.existsSync(filePath)) {
518:    content: fs.readFileSync(filePath, 'utf-8'),
526:function deleteAtomicSaveFile(filePath: string): { deleted: boolean; existed: boolean; error?: string } {
527:  const existed = fs.existsSync(filePath);
533:    fs.unlinkSync(filePath);
545:  filePath: string,
550:      const deleteResult = deleteAtomicSaveFile(filePath);
556:        error: deleteResult.error ?? `Failed to remove promoted file at ${filePath}`,
564:    fs.mkdirSync(path.dirname(filePath), { recursive: true });
565:    fs.writeFileSync(filePath, originalState.content, 'utf-8');
602:  filePath: string,
636:        console.warn(`[memory-save] V-rule warn-only (spec doc) for ${path.basename(filePath)}: ${qualityLoopResult.rejectionReason}`);
657:        console.warn(`[memory-save] Sufficiency warn-only (spec doc) for ${path.basename(filePath)}: ${sufficiencyResult.reasons.join('; ')}`);
666:          `[memory-save] Template contract bypassed in ${MANUAL_FALLBACK_SOURCE_CLASSIFICATION} mode for ${path.basename(filePath)}: ${templateContract.violations.map((v: { message?: string; rule?: string }) => v.message || v.rule).join('; ')}`,
670:          `[memory-save] Template contract warn-only (spec doc) for ${path.basename(filePath)}: ${templateContract.violations.map((v: { message?: string; rule?: string }) => v.message || v.rule).join('; ')}`,
690:      ? prepareParsedMemoryForIndexing(memoryParser.parseMemoryFile(filePath), database)
701:    const canonicalFilePath = getCanonicalPathKey(filePath);
706:      filePath,
718:      filePath,
729:    const embeddingResult = await generateOrCacheEmbedding(database, parsed, filePath, asyncEmbedding);
751:              tenantId: scope.tenantId,
752:              userId: scope.userId,
753:              agentId: scope.agentId,
754:              sessionId: scope.sessionId,
755:              sharedSpaceId: scope.sharedSpaceId,
765:          console.error(`[memory-save] TM-04: Quality gate REJECTED save for ${path.basename(filePath)}: ${qualityGateResult.reasons.join('; ')}`);
784:          console.warn(`[memory-save] TM-04: Quality gate warn-only (spec doc) for ${path.basename(filePath)}: ${qualityGateResult.reasons.join('; ')}`);
788:          console.warn(`[memory-save] TM-04: Quality gate WARN-ONLY for ${path.basename(filePath)}: ${qualityGateResult.reasons.join('; ')}`);
792:        console.warn(`[memory-save] TM-04: Quality gate error (proceeding with save): ${message}`);
793:        // Quality gate errors must not block saves
799:      filePath,
805:    persistPendingEmbeddingCacheWrite(database, pendingCacheWrite, filePath);
809:      database, parsed, embedding, force, validation.warnings, embeddingStatus, filePath, scope,
819:    // taking the SQLite writer lock, so chunked saves do not bypass the gate
824:      filePath,
832:      console.error(`[memory-save] File exceeds chunking threshold (${parsed.content.length} chars), using chunked indexing`);
834:      const chunkedResult = await indexChunkedMemoryFile(filePath, parsed, {
884:          await finalizeMemoryFileContent(filePath, finalizedFileContent);
887:          console.warn(`[memory-save] ${finalizeWarning}`);
921:      filePath,
933:        filePath,
941:            filePath,
945:            actor: 'mcp:memory_save',
950:            filePath,
972:        actor: 'mcp:memory_save',
985:        await finalizeMemoryFileContent(filePath, finalizedFileContent);
988:        console.warn(`[memory-save] ${finalizeWarning}`);
998:        console.error(`[memory-save] Cleaned stale auto-entities for superseded memory #${existing.id}`);
1000:        // Entity cleanup failure must not block save — log and continue
1001:        console.warn(`[memory-save] Auto-entity cleanup for #${existing.id} failed:`, entityCleanupErr instanceof Error ? entityCleanupErr.message : String(entityCleanupErr));
1007:        console.error(`[memory-save] Cleaned stale auto-entities for PE-superseded memory #${peResult.supersededId}`);
1009:        console.warn(`[memory-save] Auto-entity cleanup for PE #${peResult.supersededId} failed:`, entityCleanupErr instanceof Error ? entityCleanupErr.message : String(entityCleanupErr));
1030:      filePath,
1045:  filePath: string,
1055:  const parsed = parsedOverride || memoryParser.parseMemoryFile(filePath);
1063:    console.error(`[memory-save] Quality loop applied ${prepared.qualityLoopResult.fixes.length} auto-fix(es) for ${path.basename(filePath)}`);
1066:  return processPreparedMemory(prepared, filePath, {
1078:/** Handle memory_save tool - validates, indexes, and persists a memory file to the database */
1086:      tool: 'memory_save',
1093:        hint: 'Retry memory_save after checkpoint_restore maintenance completes.',
1094:        actions: ['Wait for the restore to finish', 'Retry the save request'],
1101:    filePath: file_path,
1106:    tenantId,
1107:    userId,
1108:    agentId,
1109:    sessionId,
1110:    sharedSpaceId,
1113:    governedAt,
1114:    retentionPolicy,
1120:    throw new Error('filePath is required and must be a string');
1137:    tenantId,
1138:    userId,
1139:    agentId,
1140:    sessionId,
1141:    sharedSpaceId,
1144:    governedAt,
1145:    retentionPolicy,
1151:      action: 'memory_save',
1153:      tenantId,
1154:      userId,
1155:      agentId,
1156:      sessionId,
1157:      sharedSpaceId,
1164:  if (sharedSpaceId) {
1166:      tenantId,
1167:      userId,
1168:      agentId,
1169:      sessionId,
1170:      sharedSpaceId,
1171:    }, sharedSpaceId, 'editor');
1174:        action: 'memory_save_shared_space',
1176:        tenantId,
1177:        userId,
1178:        agentId,
1179:        sessionId,
1180:        sharedSpaceId,
1183:      throw new Error(`Shared-memory save denied: ${access.reason ?? 'shared_space_denied'}`);
1187:  // DryRun must remain non-mutating even when preflight is explicitly skipped.
1213:      tool: 'memory_save',
1251:              ? ['Manual-fallback mode would bypass the strict memory template contract for this save']
1260:            'Not enough context was available to save a durable memory',
1265:  const saveScope: MemoryScopeMatch = {
1266:    tenantId: governanceDecision.normalized.tenantId,
1267:    userId: governanceDecision.normalized.userId ?? null,
1268:    agentId: governanceDecision.normalized.agentId ?? null,
1269:    sessionId: governanceDecision.normalized.sessionId,
1270:    sharedSpaceId: governanceDecision.normalized.sharedSpaceId ?? null,
1278:    const preflightResult = preflight.runPreflight(
1284:        find_similar: findSimilarMemories as Parameters<typeof preflight.runPreflight>[0]['find_similar'],
1285:        tenantId: saveScope.tenantId ?? undefined,
1286:        userId: saveScope.userId ?? undefined,
1287:        agentId: saveScope.agentId ?? undefined,
1288:        sharedSpaceId: saveScope.sharedSpaceId ?? undefined,
1310:            tool: 'memory_save',
1315:              hint: 'Build the Spec Kit scripts workspace and retry the save.',
1316:              actions: ['Run npm run build --workspace=@spec-kit/scripts', 'Retry memory_save'],
1330:      const dryRunSummary = !preflightResult.dry_run_would_pass
1331:        ? `Pre-flight validation failed: ${preflightResult.errors.length} error(s)`
1345:        tool: 'memory_save',
1349:          would_pass: preflightResult.dry_run_would_pass
1358:            errors: preflightResult.errors,
1359:            warnings: preflightResult.warnings,
1360:            details: preflightResult.details,
1374:        hints: !preflightResult.dry_run_would_pass
1384:                  ? ['Manual-fallback mode would bypass the strict memory template contract for this save']
1392:                'Not enough context was available to save a durable memory',
1398:    if (!preflightResult.pass) {
1399:      const errorMessages = preflightResult.errors.map((e: string | { message: string }) =>
1405:      const firstError = preflightResult.errors[0];
1408:        : preflight.PreflightErrorCodes.ANCHOR_FORMAT_INVALID;
1409:      throw new preflight.PreflightError(
1413:          errors: preflightResult.errors,
1414:          warnings: preflightResult.warnings,
1421:    if (preflightResult.warnings.length > 0) {
1422:      console.warn(`[preflight] ${validatedPath}: ${preflightResult.warnings.length} warning(s)`);
1423:      preflightResult.warnings.forEach((w: string | { message: string }) => {
1425:        console.warn(`[preflight]   - ${msg}`);
1436:      scope: saveScope,
1441:        tool: 'memory_save',
1446:          hint: 'Build the Spec Kit scripts workspace and retry the save.',
1447:          actions: ['Run npm run build --workspace=@spec-kit/scripts', 'Retry memory_save'],
1458:    // persisted rows without tenant/shared-space/retention metadata.
1462:        action: 'memory_save',
1465:        tenantId,
1466:        userId,
1467:        agentId,
1468:        sessionId,
1469:        sharedSpaceId,
1470:        reason: sharedSpaceId ? 'shared_space_save' : 'governed_ingest',
1471:        metadata: { filePath: validatedPath, retentionPolicy: governanceDecision.normalized.retentionPolicy },
1474:      if (sharedSpaceId) {
1483:        `).get(sharedSpaceId, validatedPath, result.id) as { id?: number } | undefined;
1486:            spaceId: sharedSpaceId,
1490:            actor: provenanceActor ?? 'mcp:memory_save',
1491:            metadata: { filePath: validatedPath },
1502:      console.error('[memory-save] Governance metadata failed, removing orphaned memory:', govErr instanceof Error ? govErr.message : String(govErr));
1508:  return buildSaveResponse({ result, filePath: file_path, asyncEmbedding, requestId });
1517: * mutex so concurrent saves cannot overwrite each other between disk
1562:        console.error(`[memory-save] Quality loop applied ${prepared.qualityLoopResult.fixes.length} auto-fix(es) for ${path.basename(file_path)} before pending-file promotion`);
1620:          filePath: file_path,
1626:            ? 'Atomic save rejected after file promotion rollback'
1627:            : 'Atomic save rejected but original file rollback failed',
1628:          message: indexResult.message ?? indexResult.rejectionReason ?? 'Memory save rejected',
1632:              ? 'Original file content was restored because the save was rejected after promotion'
1635:          ...(rollbackSucceeded ? {} : { error: 'Original file rollback failed after rejected save' }),
1662:        console.warn(`[memory-save] index attempt ${attempt} failed for ${file_path}, retrying once: ${indexError.message}`);
1670:      filePath: file_path,
1672:      summary: 'Atomic save preflight failed',
1673:      message: 'Parsed content failed validation before atomic save',
1691:      filePath: file_path,
1694:        ? 'Atomic save rolled back to the original file state'
1695:        : 'Atomic save indexing failed and pending cleanup failed',
1703:        'Retry memory_save({ filePath, force: true }) once dependencies are healthy',
1719:      postMutationHooks = runPostMutationHooks('atomic-save', {
1720:        filePath: file_path,
1733:    postMutationFeedback = buildMutationHookFeedback('atomic-save', postMutationHooks);
1757:    filePath: file_path,
1789:const handle_memory_save = handleMemorySave;
1790:const atomic_save_memory = atomicSaveMemory;
1796:  handle_memory_save,
1797:  atomic_save_memory,

exec
/bin/zsh -lc 'rg -n "delete|governed|scope|specFolder|confirm" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
26:// Feature catalog: Single and folder delete (memory_delete)
55:    tool: 'memory_delete',
58:    details: { deleted: 0 },
67:/** Handle memory_delete tool -- deletes a single memory by ID or bulk-deletes by spec folder. */
71:  const { id, specFolder, confirm } = args;
72:  if (!id && !specFolder) throw new Error('Either id or specFolder is required');
73:  if (specFolder !== undefined && typeof specFolder !== 'string') throw new Error('specFolder must be a string');
74:  if (specFolder && !id && !confirm) throw new Error('Bulk delete requires confirm: true');
81:  let deletedCount = 0;
87:    // Unified DB-unavailable contract for single and bulk delete paths.
94:    // T2-5 transaction wrapper — wraps single-delete path (memory delete, causal edge
97:      deletedCount = vectorIndex.deleteMemory(numericId) ? 1 : 0;
99:      if (deletedCount > 0) {
100:        // Record DELETE history after confirmed delete (no FK, history rows survive).
101:        // Placed after deleteMemory to avoid false audit rows for non-existent IDs.
108:            'mcp:memory_delete',
116:        causalEdges.deleteEdgesForMemory(String(numericId));
121:          mutationType: 'delete',
122:          reason: 'memory_delete: single memory delete',
124:          newHash: mutationLedger.computeHash(`delete:${numericId}:${Date.now()}`),
127:            tool: 'memory_delete',
130:            specFolder: singleSnapshot?.spec_folder ?? null,
133:          actor: 'mcp:memory_delete',
141:    const memories: { id: number }[] = vectorIndex.getMemoriesByFolder(specFolder as string);
142:    const deletedIds: number[] = [];
151:        `).all(specFolder as string) as MemoryHashSnapshot[];
157:        // Non-fatal — bulk delete proceeds without per-memory hash snapshots; ledger entries will lack prior hashes.
167:          specFolder,
169:            reason: 'auto-checkpoint before bulk delete',
176:          console.error(`[memory-delete] Created checkpoint: ${checkpointName}`);
178:          console.warn('[memory-delete] Checkpoint creation returned no checkpoint; proceeding without rollback.');
183:        console.error(`[memory-delete] Failed to create checkpoint: ${message}`);
185:        console.warn('[memory-delete] Proceeding without backup (user confirmed)');
190:    // Snapshot-then-delete is safe under single-process better-sqlite3; re-evaluate if multi-process support is added
194:        if (vectorIndex.deleteMemory(memory.id)) {
195:          // Record DELETE history after confirmed delete (no FK, history rows survive).
203:              'mcp:memory_delete',
207:            // History recording is best-effort inside bulk delete
209:          deletedCount++;
210:          deletedIds.push(memory.id);
211:          causalEdges.deleteEdgesForMemory(String(memory.id));
215:      // Mutation ledger entries written inside bulk transaction for atomicity with deletes.
216:      for (const deletedId of deletedIds) {
217:        const snapshot = hashById.get(deletedId) ?? null;
219:          mutationType: 'delete',
220:          reason: 'memory_delete: bulk delete by spec folder',
222:          newHash: mutationLedger.computeHash(`bulk-delete:${deletedId}:${Date.now()}`),
223:          linkedMemoryIds: [deletedId],
225:            tool: 'memory_delete',
227:            specFolder,
229:            memoryId: deletedId,
232:          actor: 'mcp:memory_delete',
243:  if (deletedCount > 0) {
246:      postMutationHooks = runPostMutationHooks('delete', { specFolder, deletedCount });
256:    postMutationFeedback = buildMutationHookFeedback('delete', postMutationHooks);
259:  const summary = deletedCount > 0
260:    ? `Deleted ${deletedCount} memory(s)`
261:    : 'No memories found to delete';
267:  if (deletedCount === 0) {
277:  const data: Record<string, unknown> = { deleted: deletedCount };
290:    tool: 'memory_delete',

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '500,860p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   761	    responseToReturn = buildSearchResponseFromPayload(cachedPayload, _searchStartTime, true);
   762	  } else {
   763	    // Wait for embedding model only on cache miss
   764	    if (!isEmbeddingModelReady()) {
   765	      const modelReady = await waitForEmbeddingModel(30000);
   766	      if (!modelReady) {
   767	        throw new Error('Embedding model not ready after 30s timeout. Try again later.');
   768	      }
   769	    }
   770	
   771	    // V2 pipeline is the only path (legacy V1 removed from the runtime pipeline)
   772	    const pipelineConfig: PipelineConfig = {
   773	      query: effectiveQuery,
   774	      concepts: hasValidConcepts ? concepts : undefined,
   775	      searchType: (hasValidConcepts && concepts!.length >= 2)
   776	        ? 'multi-concept'
   777	        : 'hybrid',
   778	      mode,
   779	      limit,
   780	      specFolder,
   781	      tenantId: normalizedScope.tenantId,
   782	      userId: normalizedScope.userId,
   783	      agentId: normalizedScope.agentId,
   784	      sharedSpaceId: normalizedScope.sharedSpaceId,
   785	      tier,
   786	      contextType,
   787	      includeArchived,
   788	      includeConstitutional,
   789	      includeContent,
   790	      anchors,
   791	      qualityThreshold,
   792	      minState: minState ?? '',
   793	      applyStateLimits,
   794	      useDecay,
   795	      rerank,
   796	      applyLengthPenalty,
   797	      sessionId,
   798	      enableDedup,
   799	      enableSessionBoost,
   800	      enableCausalBoost,
   801	      trackAccess,
   802	      detectedIntent,
   803	      intentConfidence,
   804	      intentWeights: toIntentWeightsConfig(intentWeights),
   805	      artifactRouting: artifactRouting as unknown as PipelineConfig['artifactRouting'],
   806	      trace,
   807	    };
   808	
   809	    const pipelineResult: PipelineResult = await executePipeline(pipelineConfig);
   810	    let resultsForFormatting = pipelineResult.results as unknown as SessionAwareResult[];
   811	
   812	    // Phase B T018/T019: Community search fallback — inject community members on weak results
   813	    let communityFallbackApplied = false;
   814	    const shouldRunCommunitySearch = (
   815	      isDualRetrievalEnabled() &&
   816	      isCommunitySearchFallbackEnabled() &&
   817	      effectiveQuery.length > 0 &&
   818	      (retrievalLevel === 'global' || retrievalLevel === 'auto')
   819	    );
   820	    if (shouldRunCommunitySearch) {
   821	      const isWeakResult = resultsForFormatting.length === 0 ||
   822	        (retrievalLevel === 'global') ||
   823	        (resultsForFormatting.length < 3 && retrievalLevel === 'auto');
   824	      if (isWeakResult) {
   825	        try {
   826	          const communityResults = searchCommunities(effectiveQuery, requireDb(), 5);
   827	          if (communityResults.totalMemberIds.length > 0) {
   828	            // Fetch the actual memory rows for community member IDs
   829	            const memberIds = communityResults.totalMemberIds.slice(0, 20);
   830	            const placeholders = memberIds.map(() => '?').join(', ');
   831	            const db = requireDb();
   832	            const memberRows = db.prepare(`
   833	              SELECT id, title, similarity, content, file_path, importance_tier, context_type,
   834	                     quality_score, created_at
   835	              FROM memory_index
   836	              WHERE id IN (${placeholders})
   837	            `).all(...memberIds) as Array<Record<string, unknown> & { id: number }>;
   838	
   839	            if (memberRows.length > 0) {
   840	              // Mark community-sourced results and assign a base score
   841	              const communityRows = memberRows.map((row) => ({
   842	                ...row,
   843	                similarity: typeof row.similarity === 'number' ? row.similarity : 0.5,
   844	                score: 0.45,
   845	                _communityFallback: true,
   846	              }));
   847	              // Merge: append community results not already in pipeline results
   848	              const existingIds = new Set(resultsForFormatting.map((r) => (r as Record<string, unknown>).id as number));
   849	              const newRows = communityRows.filter((r) => !existingIds.has(r.id));
   850	              if (newRows.length > 0) {
   851	                resultsForFormatting = [...resultsForFormatting, ...newRows as unknown as SessionAwareResult[]];
   852	                communityFallbackApplied = true;
   853	              }
   854	            }
   855	          }
   856	        } catch (err: unknown) {
   857	          const msg = err instanceof Error ? err.message : String(err);
   858	          console.warn(`[memory-search] Community search fallback failed (fail-open): ${msg}`);
   859	        }
   860	      }

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts | sed -n '560,700p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   560	    `),
   561	    get_stats: database.prepare(`
   562	      SELECT
   563	        COUNT(*) as total,
   564	        SUM(CASE WHEN embedding_status = 'success' THEN 1 ELSE 0 END) as complete,
   565	        SUM(CASE WHEN embedding_status = 'pending' THEN 1 ELSE 0 END) as pending,
   566	        SUM(CASE WHEN embedding_status = 'failed' THEN 1 ELSE 0 END) as failed
   567	      FROM memory_index m
   568	      JOIN active_memory_projection p ON p.active_memory_id = m.id
   569	    `),
   570	    list_base: database.prepare(`
   571	      SELECT m.*
   572	      FROM memory_index m
   573	      JOIN active_memory_projection p ON p.active_memory_id = m.id
   574	      ORDER BY m.created_at DESC
   575	      LIMIT ? OFFSET ?
   576	    `)
   577	  };
   578	
   579	  prepared_statements_cache.set(database, prepared_statements);
   580	  return prepared_statements;
   581	}
   582	
   583	/**
   584	 * Clears cached prepared statements for a specific database or all databases.
   585	 * @param database - Optional: clear only for this database. If omitted, the
   586	 *   WeakMap self-cleans when the Database object is GC'd, so this is a no-op.
   587	 * @returns Nothing.
   588	 */
   589	export function clear_prepared_statements(database?: Database.Database): void {
   590	  if (database) {
   591	    prepared_statements_cache.delete(database);
   592	  }
   593	  // WeakMap entries are automatically cleared when the Database key is GC'd.
   594	}
   595	
   596	/* ───────────────────────────────────────────────────────────────
   597	   5. CONSTITUTIONAL MEMORIES CACHE
   598	----------------------------------------------------------------*/
   599	
   600	// BUG-004 FIX: Checks external DB modifications before using cache
   601	// BUG-012 FIX: Prevent thundering herd when cache expires
   602	/**
   603	 * Gets cached constitutional memories from the index.
   604	 * @param database - The database connection to query.
   605	 * @param spec_folder - The optional spec folder filter.
   606	 * @param includeArchived - Whether archived memories should be included.
   607	 * @returns The constitutional memory rows.
   608	 */
   609	export function get_constitutional_memories(
   610	  database: Database.Database,
   611	  spec_folder: string | null = null,
   612	  includeArchived = false
   613	): MemoryRow[] {
   614	  // Scope cache entries to the active DB path as well as the archived filter.
   615	  const cache_key = build_constitutional_cache_key(spec_folder, includeArchived);
   616	  const now = Date.now();
   617	  const cached = constitutional_cache.get(cache_key);
   618	
   619	  if (cached && (now - cached.timestamp) < CONSTITUTIONAL_CACHE_TTL && is_constitutional_cache_valid()) {
   620	    return cached.data;
   621	  }
   622	
   623	  if (constitutional_cache_loading.get(cache_key) && cached) {
   624	    return cached.data;
   625	  }
   626	
   627	  constitutional_cache_loading.set(cache_key, true);
   628	
   629	  try {
   630	    const constitutional_sql = `
   631	      SELECT m.*, 100.0 as similarity, 1.0 as effective_importance,
   632	             'constitutional' as source_type
   633	      FROM memory_index m
   634	      JOIN active_memory_projection p ON p.active_memory_id = m.id
   635	      WHERE m.importance_tier = 'constitutional'
   636	        AND m.embedding_status = 'success'
   637	        ${!includeArchived ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)' : ''}
   638	        ${spec_folder ? 'AND m.spec_folder = ?' : ''}
   639	      ORDER BY m.importance_weight DESC, m.created_at DESC
   640	    `;
   641	
   642	    const params = spec_folder ? [spec_folder] : [];
   643	    let results = database.prepare(constitutional_sql).all(...params) as MemoryRow[];
   644	
   645	    const MAX_CONSTITUTIONAL_TOKENS = 2000;
   646	    const TOKENS_PER_MEMORY = 100;
   647	    const max_constitutional_count = Math.floor(MAX_CONSTITUTIONAL_TOKENS / TOKENS_PER_MEMORY);
   648	    results = results.slice(0, max_constitutional_count);
   649	
   650	    results = results.map((row: MemoryRow) => {
   651	      row.trigger_phrases = parse_trigger_phrases(row.trigger_phrases);
   652	      row.isConstitutional = true;
   653	      return row;
   654	    });
   655	
   656	    if (constitutional_cache.size >= CONSTITUTIONAL_CACHE_MAX_KEYS) {
   657	      const oldestKey = constitutional_cache.keys().next().value;
   658	      if (oldestKey !== undefined) {
   659	        constitutional_cache.delete(oldestKey);
   660	      }
   661	    }
   662	
   663	    refresh_constitutional_cache_db_state();
   664	    constitutional_cache.set(cache_key, { data: results, timestamp: now });
   665	
   666	    return results;
   667	  } finally {
   668	    constitutional_cache_loading.delete(cache_key);
   669	  }
   670	}
   671	
   672	/**
   673	 * Clears cached constitutional memories.
   674	 * @param spec_folder - The optional spec folder cache key to clear.
   675	 * @returns Nothing.
   676	 */
   677	export function clear_constitutional_cache(spec_folder: string | null = null): void {
   678	  if (spec_folder) {
   679	    const scoped_suffix_archived = `::${spec_folder}:arch`;
   680	    const scoped_suffix_live = `::${spec_folder}:noarch`;
   681	    for (const key of [...constitutional_cache.keys()]) {
   682	      if (key.endsWith(scoped_suffix_archived) || key.endsWith(scoped_suffix_live)) {
   683	        constitutional_cache.delete(key);
   684	      }
   685	    }
   686	    for (const key of [...constitutional_cache_loading.keys()]) {
   687	      if (key.endsWith(scoped_suffix_archived) || key.endsWith(scoped_suffix_live)) {
   688	        constitutional_cache_loading.delete(key);
   689	      }
   690	    }
   691	  } else {
   692	    constitutional_cache.clear();
   693	    constitutional_cache_loading.clear();
   694	    last_db_mod_time = 0;
   695	    last_constitutional_cache_db_path = null;
   696	  }
   697	}
   698	
   699	/**
   700	 * Refreshes interference scores for memories in a folder.

exec
/bin/zsh -lc 'rg -n "startup|resume|memory|tool-routing|routing|compaction|compact|session_bootstrap|session_resume" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
5:// Logic in tools/*.ts. This file retains server init, startup,
33:// Handler modules (only indexSingleFile needed directly for startup scan)
38:import * as memoryIndexDiscovery from './handlers/memory-index-discovery.js';
60:import { primeSessionIfNeeded } from './hooks/memory-surface.js';
67:import { detectNodeVersionMismatch, checkSqliteVersion } from './startup-checks.js';
88:import * as memoryParser from './lib/parsing/memory-parser.js';
103:import * as workingMemory from './lib/cognitive/working-memory.js';
120:// T107: Transaction manager for pending file recovery on startup (REQ-033)
201:/** Timeout (ms) for waiting on embedding model readiness during startup scan. */
204:/** Timeout (ms) for API key validation during startup. */
257:  preservesAuthority: 'session_bootstrap';
258:  surface: 'response-hints' | 'session-bootstrap' | 'memory-context';
323:    preservesAuthority: 'session_bootstrap',
377:// Stores the last resolved session ID so non-search tools (e.g. memory_stats)
738:// (CHK-076): Instructions are computed once at startup and NOT refreshed during the session.
752:    ? ` Warning: ${stats.staleCount} stale memories detected. Consider running memory_index_scan.`
759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
790:  // Phase 024: Tool routing decision tree
794:    const routingRules: string[] = [];
796:      routingRules.push('Semantic/concept code search → mcp__cocoindex_code__search');
799:      routingRules.push('Structural queries (callers, imports, deps) → code_graph_query');
801:    routingRules.push('Exact text/regex matching → Grep tool');
802:    if (routingRules.length > 0) {
805:      for (const rule of routingRules) {
809:  } catch { /* tool routing snapshot unavailable — skip */ }
882:    if (name === 'memory_context' && args.mode === 'resume') {
883:      recordMetricEvent({ kind: 'memory_recovery' });
912:      name === 'memory_context' && args.mode === 'resume';
964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
976:    // Phase 024: Code-search redirect hint for memory tools
977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
1144:let startupScanInProgress = false;
1177: * T107: Recover pending memory files on MCP startup.
1178: * CHK-188: Pending files processed by recovery job on next startup.
1184:  console.error('[context-server] Checking for pending memory files...');
1187:    // BUG-028 FIX: Restrict scan to known memory file locations to prevent OOM when scanning large workspaces.
1188:    // P1-002-SCAN: share the same allowed-root expansion that startup indexing uses.
1191:    // P1 FIX: Wire isCommittedInDb callback so stale pending files are detected at startup.
1195:      const row = (database.prepare('SELECT 1 FROM memory_index WHERE file_path = ?') as import('better-sqlite3').Statement).get(originalPath);
1219:      console.error('[context-server] No pending memory files found');
1230:async function startupScan(basePath: string): Promise<void> {
1231:  if (startupScanInProgress) {
1236:  startupScanInProgress = true;
1243:      console.error('[context-server] Run memory_index_scan manually after model loads');
1250:    console.error('[context-server] Starting background scan for new memory files...');
1264:          ...memoryParser.findMemoryFiles(root),
1265:          ...memoryIndexDiscovery.findConstitutionalFiles(root),
1266:          ...memoryIndexDiscovery.findSpecDocuments(root),
1277:        // Non-fatal: skip inaccessible startup roots.
1282:      console.error('[context-server] No memory files found in workspace');
1286:    console.error(`[context-server] Found ${allFiles.length} memory files, checking for changes...`);
1315:          operation: 'startup-scan',
1318:        // Non-fatal: startup scan must continue even if invalidation hooks fail.
1331:    startupScanInProgress = false;
1421:      FROM memory_index
1428:      FROM memory_index
1491:  // Validates API key at startup to fail fast with actionable error messages
1493:  let startupEmbeddingConfig: Awaited<ReturnType<typeof resolveStartupEmbeddingConfig>> | null = null;
1497:      startupEmbeddingConfig = await resolveStartupEmbeddingConfig({ timeout: API_KEY_VALIDATION_TIMEOUT_MS });
1498:      const validation: ApiKeyValidation = startupEmbeddingConfig.validation;
1512:          console.warn('[context-server] Continuing startup — validation will occur on first use');
1541:      console.error('[context-server] Continuing startup - validation will occur on first use');
1549:      startupEmbeddingConfig?.dimension ?? getStartupEmbeddingDimension(),
1581:  // in shared embeddings, so startup no longer branches on shouldEagerWarmup().
1640:    const memoryCountRow = database.prepare('SELECT COUNT(*) as cnt FROM memory_index').get() as { cnt?: number } | undefined;
1641:    const memoryCount = Number(memoryCountRow?.cnt ?? 0);
1646:      const projectionCountRow = database.prepare('SELECT COUNT(*) as cnt FROM active_memory_projection').get() as { cnt?: number } | undefined;
1652:    console.error('[context-server] Startup health: memory_index=%d, active_memory_projection=%d', memoryCount, projectionCount);
1654:    if (memoryCount > 0 && (!projectionTableExists || projectionCount === 0)) {
1656:      console.error('[context-server] Auto-backfill triggered: %d rows seeded into active_memory_projection', result.seeded);
1659:    if (memoryCount === 0 && projectionCount === 0) {
1671:    // Keep db-state reinitialization wiring aligned with startup search wiring.
1696:    // P3-04: Rebuild BM25 index from database on startup
1708:    // Cognitive memory modules
1713:      console.error('[context-server] Cognitive memory modules initialized');
1714:      console.error(`[context-server] Working memory: ${workingMemory.isEnabled()}, Co-activation: ${coActivation.isEnabled()}`);
1725:      throw new Error(`[context-server] Extraction adapter startup failed: ${message}`);
1775:    // REQ-D4-004: Batch feedback learning — runs one cycle at startup (shadow-only, no live ranking mutations).
1864:        console.warn('[context-server] File watcher startup failed:', message);
1890:  // Background startup scan
1891:  setImmediate(() => startupScan(DEFAULT_BASE_PATH));

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '150,380p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   150	  return {
   151	    advisory: true,
   152	    readiness: 'ready',
   153	    preferredTool: 'code_graph_query',
   154	    message: 'Advisory only: when the next question is about callers, imports, dependencies, or outline, prefer `code_graph_query` before Grep or Glob.',
   155	    preservesAuthority: 'session_bootstrap',
   156	  };
   157	}
   158	
   159	/* ───────────────────────────────────────────────────────────────
   160	   3. HANDLER
   161	──────────────────────────────────────────────────────────────── */
   162	
   163	/** Handle session_bootstrap tool call — one-call session setup */
   164	export async function handleSessionBootstrap(args: SessionBootstrapArgs): Promise<MCPResponse> {
   165	  const startMs = Date.now();
   166	  const allHints: string[] = [];
   167	
   168	  // Sub-call 1: session_resume with full resume payload
   169	  let resumeData: Record<string, unknown> = {};
   170	  try {
   171	    const resumeResponse = await handleSessionResume({
   172	      specFolder: args.specFolder,
   173	    });
   174	    resumeData = extractData(resumeResponse);
   175	    allHints.push(...extractHints(resumeData));
   176	  } catch (error: unknown) {
   177	    const message = error instanceof Error ? error.message : String(error);
   178	    resumeData = { error: message };
   179	    allHints.push('session_resume failed. Try calling it manually.');
   180	  }
   181	
   182	  // Sub-call 2: session_health
   183	  let healthData: Record<string, unknown> = {};
   184	  try {
   185	    const healthResponse = await handleSessionHealth();
   186	    healthData = extractData(healthResponse);
   187	    allHints.push(...extractHints(healthData));
   188	  } catch (error: unknown) {
   189	    const message = error instanceof Error ? error.message : String(error);
   190	    healthData = { error: message };
   191	    allHints.push('session_health failed. Try calling it manually.');
   192	  }
   193	
   194	  // Phase 027: Structural bootstrap contract
   195	  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
   196	  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
   197	    allHints.push(
   198	      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
   199	    );
   200	  }
   201	
   202	  const cachedSummary = extractCachedSummary(resumeData);
   203	  if (cachedSummary?.status === 'accepted') {
   204	    allHints.push('Cached continuity summary accepted as additive bootstrap context.');
   205	  }
   206	  const structuralRoutingNudge = buildStructuralRoutingNudge(structuralContext);
   207	  if (structuralRoutingNudge) {
   208	    allHints.push(structuralRoutingNudge.message);
   209	  }
   210	
   211	  // Deduplicate hints
   212	  const uniqueHints = [...new Set(allHints)];
   213	
   214	  // Record bootstrap telemetry once for the composite call.
   215	  const durationMs = Date.now() - startMs;
   216	  const completeness = resumeData.error || healthData.error ? 'partial' : 'full';
   217	  recordBootstrapEvent('tool', durationMs, completeness);
   218	
   219	  const resumeCertainty: SharedPayloadCertainty = resumeData.error ? 'unknown' : 'estimated';
   220	  const healthCertainty: SharedPayloadCertainty = healthData.error ? 'unknown' : 'estimated';
   221	  const cachedCertainty: SharedPayloadCertainty = cachedSummary?.status === 'accepted' ? 'estimated' : 'defaulted';
   222	  const structuralCertainty: SharedPayloadCertainty = 'exact';
   223	  const nextActionsCertainty: SharedPayloadCertainty = 'defaulted';
   224	  const resumePayload = coerceSharedPayloadEnvelope(resumeData.payloadContract);
   225	  const healthPayload = coerceSharedPayloadEnvelope(healthData.payloadContract);
   226	  const structuralSnapshotTrust = buildStructuralContextTrust(structuralContext);
   227	  const resumeStructuralTrust = extractStructuralTrustFromPayload(resumePayload);
   228	  if (!resumeData.error && !resumeStructuralTrust) {
   229	    throw new StructuralTrustPayloadError(
   230	      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
   231	    );
   232	  }
   233	  const structuralContextWithTrust = attachStructuralTrustFields(
   234	    structuralContext,
   235	    structuralSnapshotTrust,
   236	    { label: 'session_bootstrap structural context payload' },
   237	  );
   238	  const resumeWithTrust = resumeData.error
   239	    ? resumeData
   240	    : attachStructuralTrustFields(
   241	      resumeData,
   242	      resumeStructuralTrust,
   243	      { label: 'session_bootstrap resume payload' },
   244	    );
   245	
   246	  const payloadSections: SharedPayloadSection[] = [
   247	    {
   248	      key: 'resume-surface',
   249	      title: 'Resume Surface',
   250	      content: summarizeUnknown(resumeData),
   251	      source: 'memory',
   252	      certainty: resumeCertainty,
   253	    },
   254	  ];
   255	  if (cachedSummary?.status === 'accepted' && cachedSummary.cachedSummary) {
   256	    payloadSections.push({
   257	      key: 'cached-continuity',
   258	      title: 'Cached Continuity',
   259	      content: [
   260	        cachedSummary.cachedSummary.continuityText,
   261	        `Cache tokens: create=${cachedSummary.cachedSummary.cacheCreationInputTokens}; read=${cachedSummary.cachedSummary.cacheReadInputTokens}`,
   262	        `Transcript: ${cachedSummary.cachedSummary.transcriptFingerprint}`,
   263	      ].join(' | '),
   264	      source: 'session',
   265	      certainty: cachedCertainty,
   266	    });
   267	  }
   268	  payloadSections.push(
   269	    {
   270	      key: 'health-surface',
   271	      title: 'Health Surface',
   272	      content: summarizeUnknown(healthData),
   273	      source: 'operational',
   274	      certainty: healthCertainty,
   275	    },
   276	    {
   277	      key: 'structural-context',
   278	      title: 'Structural Context',
   279	      // This section carries trust derived from the local structural snapshot,
   280	      // which remains valid even when the remote resume surface fails closed.
   281	      content: structuralContext.summary,
   282	      source: 'code-graph',
   283	      certainty: structuralCertainty,
   284	      structuralTrust: structuralSnapshotTrust,
   285	    },
   286	    {
   287	      key: 'next-actions',
   288	      title: 'Next Actions',
   289	      content: buildNextActions(resumeData, healthData, structuralContext).join(' | '),
   290	      source: 'session',
   291	      certainty: nextActionsCertainty,
   292	    },
   293	  );
   294	
   295	  const payloadContract = createSharedPayloadEnvelope({
   296	    kind: 'bootstrap',
   297	    sections: payloadSections,
   298	    summary: `Bootstrap payload: ${summarizeCertaintyContract([
   299	      { label: 'resume', certainty: resumeCertainty },
   300	      { label: 'health', certainty: healthCertainty },
   301	      ...(cachedSummary?.status === 'accepted' ? [{ label: 'cached', certainty: cachedCertainty }] : []),
   302	      { label: 'structural', certainty: structuralCertainty },
   303	      { label: 'nextActions', certainty: nextActionsCertainty },
   304	    ])}; structuralStatus=${structuralContext.status}`,
   305	    provenance: {
   306	      producer: 'session_bootstrap',
   307	      sourceSurface: 'session_bootstrap',
   308	      trustState: trustStateFromStructuralStatus(structuralContext.status),
   309	      generatedAt: new Date().toISOString(),
   310	      lastUpdated: structuralContext.provenance?.lastUpdated ?? null,
   311	      sourceRefs: ['session-resume', 'session-health', 'session-snapshot'],
   312	    },
   313	  });
   314	  const graphOps = buildCodeGraphOpsContract({
   315	    graphFreshness: structuralContext.status === 'ready'
   316	      ? 'fresh'
   317	      : structuralContext.status === 'stale'
   318	        ? 'stale'
   319	        : 'empty',
   320	    sourceSurface: 'session_bootstrap',
   321	  });
   322	
   323	  const result: SessionBootstrapResult = {
   324	    resume: resumeWithTrust,
   325	    health: healthData,
   326	    ...(cachedSummary ? { cachedSummary } : {}),
   327	    structuralContext: structuralContextWithTrust,
   328	    ...(structuralRoutingNudge ? { structuralRoutingNudge } : {}),
   329	    payloadContract,
   330	    opencodeTransport: buildOpenCodeTransportPlan({
   331	      bootstrapPayload: payloadContract,
   332	      resumePayload,
   333	      healthPayload,
   334	      specFolder: args.specFolder ?? null,
   335	    }),
   336	    graphOps,
   337	    hints: uniqueHints,
   338	    // Keep advisory routing guidance out of nextActions so bootstrap and resume
   339	    // remain the authoritative recovery owners for startup and deep resume flows.
   340	    nextActions: buildNextActions(resumeData, healthData, structuralContext),
   341	  };
   342	
   343	  return {
   344	    content: [{
   345	      type: 'text',
   346	      text: JSON.stringify({ status: 'ok', data: result }, null, 2),
   347	    }],
   348	    structuredContent: result,
   349	  };
   350	}

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Memory Surface
     3	// ───────────────────────────────────────────────────────────────
     4	// Lib modules
     5	import { isCocoIndexAvailable } from '../lib/utils/cocoindex-path.js';
     6	import * as vectorIndex from '../lib/search/vector-index.js';
     7	import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
     8	import { enrichWithRetrievalDirectives } from '../lib/search/retrieval-directives.js';
     9	import * as graphDb from '../lib/code-graph/code-graph-db.js';
    10	import { estimateTokenCount } from '@spec-kit/shared/utils/token-estimate';
    11	import { recordBootstrapEvent } from '../lib/session/context-metrics.js';
    12	import * as workingMemory from '../lib/cognitive/working-memory.js';
    13	import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
    14	
    15	import type { Database } from '@spec-kit/shared/types';
    16	import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
    17	
    18	/* ───────────────────────────────────────────────────────────────
    19	   1. TYPES
    20	──────────────────────────────────────────────────────────────── */
    21	
    22	interface ConstitutionalMemory {
    23	  id: number;
    24	  specFolder: string;
    25	  filePath: string;
    26	  title: string;
    27	  importanceTier: string;
    28	  /** PI-A4: LLM-consumable retrieval directive, e.g. "Always surface when: …" */
    29	  retrieval_directive?: string;
    30	}
    31	
    32	interface AutoSurfaceResult {
    33	  constitutional: ConstitutionalMemory[];
    34	  triggered: {
    35	    memory_id: number;
    36	    spec_folder: string;
    37	    title: string;
    38	    matched_phrases: string[];
    39	  }[];
    40	  codeGraphStatus?: {
    41	    status: 'ok' | 'error';
    42	    data?: {
    43	      totalFiles: number;
    44	      totalNodes: number;
    45	      totalEdges: number;
    46	      staleFiles: number;
    47	      lastScanAt: string | null;
    48	      dbFileSize: number | null;
    49	      schemaVersion: number;
    50	      nodesByKind: Record<string, number>;
    51	      edgesByType: Record<string, number>;
    52	      parseHealth: Record<string, number>;
    53	    };
    54	    error?: string;
    55	  };
    56	  sessionPrimed?: boolean;
    57	  primedTool?: string;
    58	  /** T018: Structured Prime Package returned on first tool call */
    59	  primePackage?: PrimePackage;
    60	  surfaced_at: string;
    61	  latencyMs: number;
    62	}
    63	
    64	/** T018: Structured session prime payload for non-hook CLI auto-priming */
    65	interface PrimePackage {
    66	  specFolder: string | null;
    67	  currentTask: string | null;
    68	  codeGraphStatus: 'fresh' | 'stale' | 'empty';
    69	  cocoIndexAvailable: boolean;
    70	  recommendedCalls: string[];
    71	  /** Phase 027: Structural bootstrap contract for non-hook runtimes */
    72	  structuralContext?: StructuralBootstrapContract;
    73	  /** Phase 009 T041: Graph retrieval routing rules for AI session priming */
    74	  routingRules?: {
    75	    graphRetrieval: string;
    76	    communitySearch: string;
    77	    toolRouting: string;
    78	  };
    79	}
    80	
    81	/* ───────────────────────────────────────────────────────────────
    82	   2. MEMORY SURFACE HOOK CONFIGURATION
    83	──────────────────────────────────────────────────────────────── */
    84	
    85	const MEMORY_AWARE_TOOLS: Set<string> = new Set([
    86	  'memory_context',
    87	  'memory_search',
    88	  'memory_quick_search',
    89	  'memory_match_triggers',
    90	  'memory_list',
    91	  'memory_save',
    92	  'memory_index_scan'
    93	]);
    94	
    95	// Token budgets for dual-scope lifecycle hooks (TM-05)
    96	const TOOL_DISPATCH_TOKEN_BUDGET = 4000;
    97	const COMPACTION_TOKEN_BUDGET = 4000;
    98	
    99	// Constitutional memory cache
   100	// Module-level mutable state: safe in a single-process MCP server.
   101	// If the server ever runs multi-process, replace with a shared store.
   102	let constitutionalCache: ConstitutionalMemory[] | null = null;
   103	let constitutionalCacheTime = 0;
   104	const CONSTITUTIONAL_CACHE_TTL = 60000; // 1 minute
   105	// Per-session priming tracker: a Set of session IDs that have been primed.
   106	// Replaces the previous process-global boolean to avoid skipping priming
   107	// for new sessions on long-lived MCP servers.
   108	const primedSessionIds: Set<string> = new Set();
   109	
   110	// T018: Session-level tracking for prime package and session_health
   111	const serverStartedAt = Date.now();
   112	let lastToolCallAt = Date.now();
   113	let lastActiveSessionId: string | null = null;
   114	
   115	/** T018: Update last tool call timestamp (called from context-server dispatch). */
   116	function recordToolCall(sessionId?: string): void {
   117	  lastToolCallAt = Date.now();
   118	  if (typeof sessionId === 'string' && sessionId.trim().length > 0) {
   119	    lastActiveSessionId = sessionId.trim();
   120	  }
   121	}
   122	
   123	/** T018: Get session tracking timestamps */
   124	function getSessionTimestamps(): { serverStartedAt: number; lastToolCallAt: number } {
   125	  return { serverStartedAt, lastToolCallAt };
   126	}
   127	
   128	/**
   129	 * T018: Check if a specific session has been primed.
   130	 * Session identity is required to avoid cross-session bleed-through.
   131	 */
   132	function isSessionPrimed(sessionId: string): boolean {
   133	  return primedSessionIds.has(sessionId);
   134	}
   135	
   136	/** Mark a specific session as primed */
   137	function markSessionPrimed(sessionId: string): void {
   138	  primedSessionIds.add(sessionId);
   139	  lastActiveSessionId = sessionId;
   140	}
   141	
   142	function getLastActiveSessionId(): string | null {
   143	  return lastActiveSessionId;
   144	}
   145	
   146	/* ───────────────────────────────────────────────────────────────
   147	   3. CONTEXT EXTRACTION
   148	──────────────────────────────────────────────────────────────── */
   149	
   150	function extractContextHint(args: Record<string, unknown> | null | undefined): string | null {
   151	  if (!args || typeof args !== 'object') return null;
   152	
   153	  const contextFields = ['input', 'query', 'prompt', 'specFolder', 'filePath'];
   154	  for (const field of contextFields) {
   155	    if (args[field] && typeof args[field] === 'string' && (args[field] as string).length >= 3) {
   156	      return args[field] as string;
   157	    }
   158	  }
   159	
   160	  // Join concepts array if present
   161	  if (args.concepts && Array.isArray(args.concepts) && args.concepts.length > 0) {
   162	    const strings = args.concepts.filter((c): c is string => typeof c === 'string');
   163	    if (strings.length > 0) return strings.join(' ');
   164	  }
   165	
   166	  return null;
   167	}
   168	
   169	/* ───────────────────────────────────────────────────────────────
   170	   4. CONSTITUTIONAL MEMORIES
   171	──────────────────────────────────────────────────────────────── */
   172	
   173	async function getConstitutionalMemories(): Promise<ConstitutionalMemory[]> {
   174	  const now = Date.now();
   175	
   176	  if (constitutionalCache && (now - constitutionalCacheTime) < CONSTITUTIONAL_CACHE_TTL) {
   177	    return constitutionalCache;
   178	  }
   179	
   180	  try {
   181	    const db: Database | null = vectorIndex.getDb();
   182	    if (!db) return [];
   183	
   184	    const rows = db.prepare(`
   185	      SELECT id, spec_folder, file_path, title, trigger_phrases, importance_tier
   186	      FROM memory_index
   187	      WHERE importance_tier = 'constitutional'
   188	      AND embedding_status IN ('success', 'pending', 'partial')
   189	      ORDER BY created_at DESC
   190	      LIMIT 10
   191	    `).all();
   192	
   193	    constitutionalCache = (rows as Record<string, unknown>[]).map((r) => ({
   194	      id: r.id as number,
   195	      specFolder: r.spec_folder as string,
   196	      filePath: r.file_path as string,
   197	      title: r.title as string,
   198	      importanceTier: r.importance_tier as string
   199	    }));
   200	    constitutionalCacheTime = now;
   201	
   202	    return constitutionalCache;
   203	  } catch (err: unknown) {
   204	    const message = err instanceof Error ? err.message : String(err);
   205	    console.warn('[SK-004] Failed to fetch constitutional memories:', message);
   206	    return [];
   207	  }
   208	}
   209	
   210	function clearConstitutionalCache(): void {
   211	  constitutionalCache = null;
   212	  constitutionalCacheTime = 0;
   213	}
   214	
   215	function getCodeGraphStatusSnapshot(): NonNullable<AutoSurfaceResult['codeGraphStatus']> {
   216	  try {
   217	    const stats = graphDb.getStats();
   218	    const staleCount = (graphDb.getDb().prepare(`
   219	      SELECT COUNT(*) as c FROM code_files
   220	      WHERE parse_health = 'error' OR parse_health = 'recovered'
   221	    `).get() as { c: number }).c;
   222	
   223	    return {
   224	      status: 'ok',
   225	      data: {
   226	        totalFiles: stats.totalFiles,
   227	        totalNodes: stats.totalNodes,
   228	        totalEdges: stats.totalEdges,
   229	        staleFiles: staleCount,
   230	        lastScanAt: stats.lastScanTimestamp,
   231	        dbFileSize: stats.dbFileSize,
   232	        schemaVersion: stats.schemaVersion,
   233	        nodesByKind: stats.nodesByKind,
   234	        edgesByType: stats.edgesByType,
   235	        parseHealth: stats.parseHealthSummary,
   236	      },
   237	    };
   238	  } catch (err: unknown) {
   239	    return {
   240	      status: 'error',
   241	      error: `Code graph not initialized: ${err instanceof Error ? err.message : String(err)}`,
   242	    };
   243	  }
   244	}
   245	
   246	/* ───────────────────────────────────────────────────────────────
   247	   5. AUTO-SURFACE MEMORIES
   248	──────────────────────────────────────────────────────────────── */
   249	
   250	function enforceAutoSurfaceTokenBudget(
   251	  result: AutoSurfaceResult | null,
   252	  tokenBudget: number,
   253	  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware'
   254	): AutoSurfaceResult | null {
   255	  if (!result) {
   256	    return null;
   257	  }
   258	
   259	  const measureTokens = (candidate: AutoSurfaceResult): number =>
   260	    estimateTokenCount(JSON.stringify(candidate));

exec
/bin/zsh -lc 'rg -n "compaction|COMPACTION_TOKEN_BUDGET|experimental.session.compacting|primeSessionIfNeeded|auto-surface|dedup|tool-dispatch|memory-aware" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
97:const COMPACTION_TOKEN_BUDGET = 4000;
253:  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware'
317:    // stale cross-session entries from influencing auto-surface ordering.
368:  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware' = 'memory-aware'
489:async function primeSessionIfNeeded(
536:      }, TOOL_DISPATCH_TOKEN_BUDGET, 'tool-dispatch');
548:    }, TOOL_DISPATCH_TOKEN_BUDGET, 'tool-dispatch');
604:  // Skip memory-aware tools to prevent recursive surfacing loops
616:  return autoSurfaceMemories(contextHint, TOOL_DISPATCH_TOKEN_BUDGET, 'tool-dispatch');
626: * Fires at session compaction lifecycle points. Surfaces memories relevant
628: * across the compaction boundary.
634: * Token budget: COMPACTION_TOKEN_BUDGET (4000 max)
656:  return autoSurfaceMemories(sessionContext.trim(), COMPACTION_TOKEN_BUDGET, 'compaction');
668:  COMPACTION_TOKEN_BUDGET,
675:  primeSessionIfNeeded,

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '730,820p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '960,1010p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | sed -n '1080,1505p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

 succeeded in 0ms:
  1080	  // A7-P2-1: Generate requestId for incident correlation in error responses
  1081	  const requestId = randomUUID();
  1082	  const restoreBarrier = checkpoints.getRestoreBarrierStatus();
  1083	
  1084	  if (restoreBarrier) {
  1085	    return createMCPErrorResponse({
  1086	      tool: 'memory_save',
  1087	      error: restoreBarrier.message,
  1088	      code: restoreBarrier.code,
  1089	      details: {
  1090	        requestId,
  1091	      },
  1092	      recovery: {
  1093	        hint: 'Retry memory_save after checkpoint_restore maintenance completes.',
  1094	        actions: ['Wait for the restore to finish', 'Retry the save request'],
  1095	        severity: 'warning',
  1096	      },
  1097	    });
  1098	  }
  1099	
  1100	  const {
  1101	    filePath: file_path,
  1102	    force = false,
  1103	    dryRun = false,
  1104	    skipPreflight = false,
  1105	    asyncEmbedding = false,
  1106	    tenantId,
  1107	    userId,
  1108	    agentId,
  1109	    sessionId,
  1110	    sharedSpaceId,
  1111	    provenanceSource,
  1112	    provenanceActor,
  1113	    governedAt,
  1114	    retentionPolicy,
  1115	    deleteAfter,
  1116	  } = args;
  1117	
  1118	  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
  1119	  if (!file_path || typeof file_path !== 'string') {
  1120	    throw new Error('filePath is required and must be a string');
  1121	  }
  1122	
  1123	  await checkDatabaseUpdated();
  1124	
  1125	  const validatedPath: string = validateFilePathLocal(file_path);
  1126	  const database = requireDb();
  1127	
  1128	  if (!memoryParser.isMemoryFile(validatedPath)) {
  1129	    throw new Error('File must be a .md or .txt file in: specs/**/memory/, specs/**/ (spec docs), or .opencode/skill/*/constitutional/');
  1130	  }
  1131	
  1132	  if (typeof database.exec === 'function') {
  1133	    ensureGovernanceRuntime(database);
  1134	  }
  1135	
  1136	  const governanceDecision = validateGovernedIngest({
  1137	    tenantId,
  1138	    userId,
  1139	    agentId,
  1140	    sessionId,
  1141	    sharedSpaceId,
  1142	    provenanceSource,
  1143	    provenanceActor,
  1144	    governedAt,
  1145	    retentionPolicy,
  1146	    deleteAfter,
  1147	  });
  1148	
  1149	  if (!governanceDecision.allowed) {
  1150	    recordGovernanceAudit(database, {
  1151	      action: 'memory_save',
  1152	      decision: 'deny',
  1153	      tenantId,
  1154	      userId,
  1155	      agentId,
  1156	      sessionId,
  1157	      sharedSpaceId,
  1158	      reason: governanceDecision.reason ?? 'governance_rejected',
  1159	      metadata: { issues: governanceDecision.issues },
  1160	    });
  1161	    throw new Error(`Governed ingest rejected: ${governanceDecision.issues.join('; ')}`);
  1162	  }
  1163	
  1164	  if (sharedSpaceId) {
  1165	    const access = assertSharedSpaceAccess(database, {
  1166	      tenantId,
  1167	      userId,
  1168	      agentId,
  1169	      sessionId,
  1170	      sharedSpaceId,
  1171	    }, sharedSpaceId, 'editor');
  1172	    if (!access.allowed) {
  1173	      recordGovernanceAudit(database, {
  1174	        action: 'memory_save_shared_space',
  1175	        decision: 'deny',
  1176	        tenantId,
  1177	        userId,
  1178	        agentId,
  1179	        sessionId,
  1180	        sharedSpaceId,
  1181	        reason: access.reason ?? 'shared_space_denied',
  1182	      });
  1183	      throw new Error(`Shared-memory save denied: ${access.reason ?? 'shared_space_denied'}`);
  1184	    }
  1185	  }
  1186	
  1187	  // DryRun must remain non-mutating even when preflight is explicitly skipped.
  1188	  if (dryRun && skipPreflight) {
  1189	    const parsedForDryRun = memoryParser.parseMemoryFile(validatedPath);
  1190	    const preparedDryRun = prepareParsedMemoryForIndexing(parsedForDryRun, database, {
  1191	      emitEvalMetrics: false,
  1192	    });
  1193	    const templateContractPass = preparedDryRun.templateContract.valid
  1194	      || shouldBypassTemplateContract(
  1195	        preparedDryRun.sourceClassification,
  1196	        preparedDryRun.sufficiencyResult,
  1197	        preparedDryRun.templateContract,
  1198	      );
  1199	    const { createMCPSuccessResponse } = await import('../lib/response/envelope.js');
  1200	    const dryRunSummary = shouldBypassTemplateContract(
  1201	      preparedDryRun.sourceClassification,
  1202	      preparedDryRun.sufficiencyResult,
  1203	      preparedDryRun.templateContract,
  1204	    )
  1205	      ? 'Dry-run would pass in manual-fallback mode with deferred indexing.'
  1206	      : buildDryRunSummary(
  1207	          preparedDryRun.sufficiencyResult,
  1208	          preparedDryRun.qualityLoopResult,
  1209	          preparedDryRun.templateContract,
  1210	        );
  1211	
  1212	    return createMCPSuccessResponse({
  1213	      tool: 'memory_save',
  1214	      summary: dryRunSummary,
  1215	      data: {
  1216	        status: 'dry_run',
  1217	        would_pass: preparedDryRun.validation.valid
  1218	          && preparedDryRun.qualityLoopResult.rejected !== true
  1219	          && templateContractPass
  1220	          && preparedDryRun.sufficiencyResult.pass,
  1221	        file_path: validatedPath,
  1222	        spec_folder: parsedForDryRun.specFolder,
  1223	        title: parsedForDryRun.title,
  1224	        validation: {
  1225	          skipped: true,
  1226	          errors: [],
  1227	          warnings: [],
  1228	          details: { skipped: true },
  1229	        },
  1230	        qualityLoop: {
  1231	          passed: preparedDryRun.qualityLoopResult.passed,
  1232	          rejected: preparedDryRun.qualityLoopResult.rejected,
  1233	          fixes: preparedDryRun.qualityLoopResult.fixes,
  1234	          rejectionReason: preparedDryRun.qualityLoopResult.rejectionReason,
  1235	        },
  1236	        templateContract: preparedDryRun.templateContract,
  1237	        sufficiency: preparedDryRun.sufficiencyResult,
  1238	        specDocHealth: preparedDryRun.specDocHealth,
  1239	        rejectionCode: preparedDryRun.sufficiencyResult.pass ? undefined : MEMORY_SUFFICIENCY_REJECTION_CODE,
  1240	        message: dryRunSummary,
  1241	      },
  1242	      hints: templateContractPass && preparedDryRun.sufficiencyResult.pass
  1243	        ? [
  1244	            'Dry-run complete - no changes made',
  1245	            'Pre-flight checks were skipped because skipPreflight=true',
  1246	            ...(shouldBypassTemplateContract(
  1247	              preparedDryRun.sourceClassification,
  1248	              preparedDryRun.sufficiencyResult,
  1249	              preparedDryRun.templateContract,
  1250	            )
  1251	              ? ['Manual-fallback mode would bypass the strict memory template contract for this save']
  1252	              : []),
  1253	          ]
  1254	        : [
  1255	            'Dry-run complete - no changes made',
  1256	            'Pre-flight checks were skipped because skipPreflight=true',
  1257	            ...(!preparedDryRun.templateContract.valid
  1258	              ? ['Rendered content must match the memory template contract before indexing']
  1259	              : []),
  1260	            'Not enough context was available to save a durable memory',
  1261	          ],
  1262	    });
  1263	  }
  1264	
  1265	  const saveScope: MemoryScopeMatch = {
  1266	    tenantId: governanceDecision.normalized.tenantId,
  1267	    userId: governanceDecision.normalized.userId ?? null,
  1268	    agentId: governanceDecision.normalized.agentId ?? null,
  1269	    sessionId: governanceDecision.normalized.sessionId,
  1270	    sharedSpaceId: governanceDecision.normalized.sharedSpaceId ?? null,
  1271	  };
  1272	
  1273	  // PRE-FLIGHT VALIDATION
  1274	  let parsedForPreflight: ReturnType<typeof memoryParser.parseMemoryFile> | null = null;
  1275	  if (!skipPreflight) {
  1276	    parsedForPreflight = memoryParser.parseMemoryFile(validatedPath);
  1277	
  1278	    const preflightResult = preflight.runPreflight(
  1279	      {
  1280	        content: parsedForPreflight.content,
  1281	        file_path: validatedPath,
  1282	        spec_folder: parsedForPreflight.specFolder,
  1283	        database: database,
  1284	        find_similar: findSimilarMemories as Parameters<typeof preflight.runPreflight>[0]['find_similar'],
  1285	        tenantId: saveScope.tenantId ?? undefined,
  1286	        userId: saveScope.userId ?? undefined,
  1287	        agentId: saveScope.agentId ?? undefined,
  1288	        sharedSpaceId: saveScope.sharedSpaceId ?? undefined,
  1289	      },
  1290	      {
  1291	        dry_run: dryRun,
  1292	        check_anchors: true,
  1293	        check_duplicates: !force,
  1294	        check_similar: false,
  1295	        check_tokens: true,
  1296	        check_size: true,
  1297	        strict_anchors: false,
  1298	      }
  1299	    );
  1300	
  1301	    if (dryRun) {
  1302	      let preparedDryRun: PreparedParsedMemory;
  1303	      try {
  1304	        preparedDryRun = prepareParsedMemoryForIndexing(parsedForPreflight, database, {
  1305	          emitEvalMetrics: false,
  1306	        });
  1307	      } catch (error: unknown) {
  1308	        if (error instanceof VRuleUnavailableError) {
  1309	          return createMCPErrorResponse({
  1310	            tool: 'memory_save',
  1311	            error: error.message,
  1312	            code: 'E_RUNTIME',
  1313	            details: { requestId },
  1314	            recovery: {
  1315	              hint: 'Build the Spec Kit scripts workspace and retry the save.',
  1316	              actions: ['Run npm run build --workspace=@spec-kit/scripts', 'Retry memory_save'],
  1317	              severity: 'warning',
  1318	            },
  1319	          });
  1320	        }
  1321	        throw error;
  1322	      }
  1323	      const templateContractPass = preparedDryRun.templateContract.valid
  1324	        || shouldBypassTemplateContract(
  1325	          preparedDryRun.sourceClassification,
  1326	          preparedDryRun.sufficiencyResult,
  1327	          preparedDryRun.templateContract,
  1328	        );
  1329	      const { createMCPSuccessResponse } = await import('../lib/response/envelope.js');
  1330	      const dryRunSummary = !preflightResult.dry_run_would_pass
  1331	        ? `Pre-flight validation failed: ${preflightResult.errors.length} error(s)`
  1332	        : shouldBypassTemplateContract(
  1333	            preparedDryRun.sourceClassification,
  1334	            preparedDryRun.sufficiencyResult,
  1335	            preparedDryRun.templateContract,
  1336	          )
  1337	          ? 'Dry-run would pass in manual-fallback mode with deferred indexing.'
  1338	          : buildDryRunSummary(
  1339	              preparedDryRun.sufficiencyResult,
  1340	              preparedDryRun.qualityLoopResult,
  1341	              preparedDryRun.templateContract,
  1342	            );
  1343	
  1344	      return createMCPSuccessResponse({
  1345	        tool: 'memory_save',
  1346	        summary: dryRunSummary,
  1347	        data: {
  1348	          status: 'dry_run',
  1349	          would_pass: preflightResult.dry_run_would_pass
  1350	            && preparedDryRun.validation.valid
  1351	            && preparedDryRun.qualityLoopResult.rejected !== true
  1352	            && templateContractPass
  1353	            && preparedDryRun.sufficiencyResult.pass,
  1354	          file_path: validatedPath,
  1355	          spec_folder: parsedForPreflight.specFolder,
  1356	          title: parsedForPreflight.title,
  1357	          validation: {
  1358	            errors: preflightResult.errors,
  1359	            warnings: preflightResult.warnings,
  1360	            details: preflightResult.details,
  1361	          },
  1362	          qualityLoop: {
  1363	            passed: preparedDryRun.qualityLoopResult.passed,
  1364	            rejected: preparedDryRun.qualityLoopResult.rejected,
  1365	            fixes: preparedDryRun.qualityLoopResult.fixes,
  1366	            rejectionReason: preparedDryRun.qualityLoopResult.rejectionReason,
  1367	          },
  1368	          templateContract: preparedDryRun.templateContract,
  1369	          sufficiency: preparedDryRun.sufficiencyResult,
  1370	          specDocHealth: preparedDryRun.specDocHealth,
  1371	          rejectionCode: preparedDryRun.sufficiencyResult.pass ? undefined : MEMORY_SUFFICIENCY_REJECTION_CODE,
  1372	          message: dryRunSummary,
  1373	        },
  1374	        hints: !preflightResult.dry_run_would_pass
  1375	          ? ['Fix validation errors before saving', 'Use skipPreflight: true to bypass validation']
  1376	          : templateContractPass && preparedDryRun.sufficiencyResult.pass
  1377	            ? [
  1378	                'Dry-run complete - no changes made',
  1379	                ...(shouldBypassTemplateContract(
  1380	                  preparedDryRun.sourceClassification,
  1381	                  preparedDryRun.sufficiencyResult,
  1382	                  preparedDryRun.templateContract,
  1383	                )
  1384	                  ? ['Manual-fallback mode would bypass the strict memory template contract for this save']
  1385	                  : []),
  1386	              ]
  1387	            : [
  1388	                'Dry-run complete - no changes made',
  1389	                ...(!preparedDryRun.templateContract.valid
  1390	                  ? ['Rendered content must match the memory template contract before indexing']
  1391	                  : []),
  1392	                'Not enough context was available to save a durable memory',
  1393	                'Add concrete file, tool, decision, blocker, next action, or outcome evidence and retry',
  1394	              ],
  1395	      });
  1396	    }
  1397	
  1398	    if (!preflightResult.pass) {
  1399	      const errorMessages = preflightResult.errors.map((e: string | { message: string }) =>
  1400	        typeof e === 'string' ? e : e.message
  1401	      ).join('; ');
  1402	
  1403	      // Use the actual error code from the
  1404	      // First validation error instead of hardcoding ANCHOR_FORMAT_INVALID.
  1405	      const firstError = preflightResult.errors[0];
  1406	      const errorCode = (typeof firstError === 'object' && firstError?.code)
  1407	        ? firstError.code
  1408	        : preflight.PreflightErrorCodes.ANCHOR_FORMAT_INVALID;
  1409	      throw new preflight.PreflightError(
  1410	        errorCode,
  1411	        `Pre-flight validation failed: ${errorMessages}`,
  1412	        {
  1413	          errors: preflightResult.errors,
  1414	          warnings: preflightResult.warnings,
  1415	          recoverable: true,
  1416	          suggestion: 'Fix the validation errors and retry, or use skipPreflight=true to bypass',
  1417	        }
  1418	      );
  1419	    }
  1420	
  1421	    if (preflightResult.warnings.length > 0) {
  1422	      console.warn(`[preflight] ${validatedPath}: ${preflightResult.warnings.length} warning(s)`);
  1423	      preflightResult.warnings.forEach((w: string | { message: string }) => {
  1424	        const msg = typeof w === 'string' ? w : w.message;
  1425	        console.warn(`[preflight]   - ${msg}`);
  1426	      });
  1427	    }
  1428	  }
  1429	
  1430	  let result: IndexResult;
  1431	  try {
  1432	    result = await indexMemoryFile(validatedPath, {
  1433	      force,
  1434	      parsedOverride: parsedForPreflight,
  1435	      asyncEmbedding,
  1436	      scope: saveScope,
  1437	    });
  1438	  } catch (error: unknown) {
  1439	    if (error instanceof VRuleUnavailableError) {
  1440	      return createMCPErrorResponse({
  1441	        tool: 'memory_save',
  1442	        error: error.message,
  1443	        code: 'E_RUNTIME',
  1444	        details: { requestId },
  1445	        recovery: {
  1446	          hint: 'Build the Spec Kit scripts workspace and retry the save.',
  1447	          actions: ['Run npm run build --workspace=@spec-kit/scripts', 'Retry memory_save'],
  1448	          severity: 'warning',
  1449	        },
  1450	      });
  1451	    }
  1452	    throw error;
  1453	  }
  1454	
  1455	  if (typeof result.id === 'number' && result.id > 0 && result.status !== 'unchanged' && result.status !== 'duplicate') {
  1456	    // B13 + H5 FIX: Wrap governance metadata in a transaction with rollback on failure.
  1457	    // If governance application fails, delete the orphaned memory row to prevent
  1458	    // persisted rows without tenant/shared-space/retention metadata.
  1459	    const applyGovernanceTx = database.transaction(() => {
  1460	      applyPostInsertMetadata(database, result.id, buildGovernancePostInsertFields(governanceDecision));
  1461	      recordGovernanceAudit(database, {
  1462	        action: 'memory_save',
  1463	        decision: 'allow',
  1464	        memoryId: result.id,
  1465	        tenantId,
  1466	        userId,
  1467	        agentId,
  1468	        sessionId,
  1469	        sharedSpaceId,
  1470	        reason: sharedSpaceId ? 'shared_space_save' : 'governed_ingest',
  1471	        metadata: { filePath: validatedPath, retentionPolicy: governanceDecision.normalized.retentionPolicy },
  1472	      });
  1473	
  1474	      if (sharedSpaceId) {
  1475	        const existing = database.prepare(`
  1476	          SELECT id
  1477	          FROM memory_index
  1478	          WHERE shared_space_id = ?
  1479	            AND file_path = ?
  1480	            AND id != ?
  1481	          ORDER BY id DESC
  1482	          LIMIT 1
  1483	        `).get(sharedSpaceId, validatedPath, result.id) as { id?: number } | undefined;
  1484	        if (existing?.id) {
  1485	          recordSharedConflict(database, {
  1486	            spaceId: sharedSpaceId,
  1487	            logicalKey: `${result.specFolder || ''}::${validatedPath}`,
  1488	            existingMemoryId: existing.id,
  1489	            incomingMemoryId: result.id,
  1490	            actor: provenanceActor ?? 'mcp:memory_save',
  1491	            metadata: { filePath: validatedPath },
  1492	          });
  1493	        }
  1494	      }
  1495	    });
  1496	    try {
  1497	      applyGovernanceTx();
  1498	    } catch (govErr: unknown) {
  1499	      // C2 FIX: Use full delete helper to clean up ALL ancillary records
  1500	      // (vec_memories, BM25 index, causal edges, projections, etc.)
  1501	      // not just memory_index, to prevent orphaned search phantoms.
  1502	      console.error('[memory-save] Governance metadata failed, removing orphaned memory:', govErr instanceof Error ? govErr.message : String(govErr));
  1503	      try { delete_memory_from_database(database, result.id); } catch (_: unknown) { /* best-effort cleanup */ }
  1504	      throw govErr;
  1505	    }

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts | sed -n '67,250p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Response Builder
     3	// ───────────────────────────────────────────────────────────────
     4	import type BetterSqlite3 from 'better-sqlite3';
     5	import type * as memoryParser from '../../lib/parsing/memory-parser.js';
     6	
     7	import * as predictionErrorGate from '../../lib/cognitive/prediction-error-gate.js';
     8	import * as retryManager from '../../lib/providers/retry-manager.js';
     9	import { runConsolidationCycleIfEnabled } from '../../lib/storage/consolidation.js';
    10	import { createMCPErrorResponse, createMCPSuccessResponse } from '../../lib/response/envelope.js';
    11	import { requireDb, toErrorMessage } from '../../utils/index.js';
    12	
    13	import { appendMutationLedgerSafe } from '../memory-crud-utils.js';
    14	import { runPostMutationHooks } from '../mutation-hooks.js';
    15	import type { MCPResponse } from '../types.js';
    16	import { buildMutationHookFeedback } from '../../hooks/mutation-feedback.js';
    17	import type {
    18	  AssistiveRecommendation,
    19	  IndexResult,
    20	  PeDecision,
    21	  ReconWarningList,
    22	} from './types.js';
    23	import type { EnrichmentStatus } from './post-insert.js';
    24	import { MEMORY_SUFFICIENCY_REJECTION_CODE } from '@spec-kit/shared/parsing/memory-sufficiency';
    25	
    26	// Feature catalog: Mutation response UX payload exposure
    27	// Feature catalog: Duplicate-save no-op feedback hardening
    28	// Feature catalog: Atomic-save parity and partial-indexing hints
    29	
    30	
    31	interface ValidationResult {
    32	  valid: boolean;
    33	  errors: string[];
    34	  warnings: string[];
    35	}
    36	
    37	interface CausalLinksResult {
    38	  processed: number;
    39	  inserted: number;
    40	  resolved: number;
    41	  unresolved: { type: string; reference: string }[];
    42	  errors: { type: string; reference: string; error: string }[];
    43	}
    44	
    45	interface BuildIndexResultParams {
    46	  database: BetterSqlite3.Database;
    47	  existing: { id: number; content_hash: string } | undefined;
    48	  embeddingStatus: string;
    49	  id: number;
    50	  parsed: ReturnType<typeof memoryParser.parseMemoryFile>;
    51	  validation: ValidationResult;
    52	  reconWarnings: ReconWarningList;
    53	  peDecision: PeDecision;
    54	  embeddingFailureReason: string | null;
    55	  asyncEmbedding: boolean;
    56	  causalLinksResult: CausalLinksResult | null;
    57	  enrichmentStatus?: EnrichmentStatus;
    58	  filePath: string;
    59	}
    60	
    61	interface BuildSaveResponseParams {
    62	  result: IndexResult;
    63	  filePath: string;
    64	  asyncEmbedding: boolean;
    65	  requestId: string;
    66	}
    67	
    68	function buildAssistiveReviewDescription(
    69	  recommendation: Pick<
    70	    AssistiveRecommendation,
    71	    'classification' | 'olderMemoryId' | 'newerMemoryId' | 'similarity'
    72	  >,
    73	): string {
    74	  const newerLabel = recommendation.newerMemoryId != null
    75	    ? `saved memory #${recommendation.newerMemoryId}`
    76	    : 'the pending save';
    77	  return (
    78	    `Review borderline similarity ${recommendation.similarity.toFixed(3)} between ` +
    79	    `${newerLabel} and existing memory #${recommendation.olderMemoryId}; ` +
    80	    `heuristic suggests ${recommendation.classification}.`
    81	  );
    82	}
    83	
    84	function finalizeAssistiveRecommendation(
    85	  reconWarnings: ReconWarningList,
    86	  savedMemoryId: number,
    87	): AssistiveRecommendation | undefined {
    88	  const rawRecommendation = reconWarnings.assistiveRecommendation;
    89	  if (!rawRecommendation) return undefined;
    90	
    91	  const candidateMemoryIds = Array.from(
    92	    new Set([
    93	      ...rawRecommendation.candidateMemoryIds,
    94	      rawRecommendation.olderMemoryId,
    95	      savedMemoryId,
    96	    ].filter((memoryId) => Number.isInteger(memoryId) && memoryId > 0)),
    97	  );
    98	
    99	  const newerMemoryId = rawRecommendation.newerMemoryId ?? savedMemoryId;
   100	  return {
   101	    ...rawRecommendation,
   102	    newerMemoryId,
   103	    candidateMemoryIds,
   104	    description: buildAssistiveReviewDescription({
   105	      classification: rawRecommendation.classification,
   106	      olderMemoryId: rawRecommendation.olderMemoryId,
   107	      newerMemoryId,
   108	      similarity: rawRecommendation.similarity,
   109	    }),
   110	  };
   111	}
   112	
   113	export function buildIndexResult({
   114	  database,
   115	  existing,
   116	  embeddingStatus,
   117	  id,
   118	  parsed,
   119	  validation,
   120	  reconWarnings,
   121	  peDecision,
   122	  embeddingFailureReason,
   123	  asyncEmbedding,
   124	  causalLinksResult,
   125	  enrichmentStatus,
   126	  filePath,
   127	}: BuildIndexResultParams): IndexResult {
   128	  let resultStatus: string;
   129	  if (existing) {
   130	    resultStatus = 'updated';
   131	  } else if (embeddingStatus !== 'success') {
   132	    resultStatus = 'deferred';
   133	  } else {
   134	    resultStatus = 'indexed';
   135	  }
   136	
   137	  const linkedMemoryIds = [
   138	    id,
   139	    ...(peDecision.existingMemoryId != null ? [peDecision.existingMemoryId] : []),
   140	  ];
   141	  const ledgerRecorded = appendMutationLedgerSafe(database, {
   142	    mutationType: existing ? 'update' : 'create',
   143	    reason: existing
   144	      ? 'memory_save: updated indexed memory entry'
   145	      : 'memory_save: created new indexed memory entry',
   146	    priorHash: existing?.content_hash ?? null,
   147	    newHash: parsed.contentHash,
   148	    linkedMemoryIds,
   149	    decisionMeta: {
   150	      tool: 'memory_save',
   151	      status: resultStatus,
   152	      action: peDecision.action,
   153	      similarity: peDecision.similarity,
   154	      specFolder: parsed.specFolder,
   155	      filePath,
   156	      embeddingStatus,
   157	      qualityScore: parsed.qualityScore ?? 0,
   158	      documentType: parsed.documentType || 'memory',
   159	    },
   160	    actor: 'mcp:memory_save',
   161	  });
   162	
   163	  const result: IndexResult = {
   164	    status: resultStatus,
   165	    id,
   166	    specFolder: parsed.specFolder,
   167	    title: parsed.title ?? '',
   168	    triggerPhrases: parsed.triggerPhrases,
   169	    contextType: parsed.contextType,
   170	    importanceTier: parsed.importanceTier,
   171	    memoryType: parsed.memoryType,
   172	    memoryTypeSource: parsed.memoryTypeSource,
   173	    embeddingStatus,
   174	    warnings: [...validation.warnings, ...reconWarnings],
   175	    qualityScore: parsed.qualityScore,
   176	    qualityFlags: parsed.qualityFlags,
   177	  };
   178	  if (!ledgerRecorded) {
   179	    result.warnings = result.warnings || [];
   180	    result.warnings.push('Mutation ledger append failed; audit trail may be incomplete.');
   181	  }
   182	
   183	  const assistiveRecommendation = finalizeAssistiveRecommendation(reconWarnings, id);
   184	  if (assistiveRecommendation) {
   185	    result.assistiveRecommendation = assistiveRecommendation;
   186	  }
   187	
   188	  if (peDecision.action !== predictionErrorGate.ACTION.CREATE) {
   189	    result.pe_action = peDecision.action;
   190	    result.pe_reason = peDecision.reason;
   191	  }
   192	
   193	  if (peDecision.action === predictionErrorGate.ACTION.SUPERSEDE && peDecision.existingMemoryId != null) {
   194	    result.superseded_id = peDecision.existingMemoryId;
   195	  }
   196	
   197	  if (peDecision.action === predictionErrorGate.ACTION.CREATE_LINKED && peDecision.existingMemoryId != null) {
   198	    result.related_ids = [peDecision.existingMemoryId];
   199	  }
   200	
   201	  if (embeddingStatus === 'pending' && embeddingFailureReason) {
   202	    // Security: raw provider errors sanitized before persistence/response
   203	    result.embeddingFailureReason = retryManager.sanitizeEmbeddingFailureMessage(embeddingFailureReason) ?? undefined;
   204	    result.message = 'Memory saved with deferred indexing - searchable via BM25/FTS5';
   205	  }
   206	
   207	  if (asyncEmbedding && embeddingStatus === 'pending') {
   208	    const memoryId = id;
   209	    const memoryContent = parsed.content;
   210	    setImmediate(() => {
   211	      retryManager.claimAndRetryEmbedding(memoryId, memoryContent, 'pending')
   212	        .then((retryResult) => {
   213	          if (retryResult && !retryResult.success && retryResult.error) {
   214	            console.warn(`[memory-save] T306: Immediate async embedding attempt failed for #${memoryId}: ${retryResult.error}`);
   215	          }
   216	        })
   217	        .catch((err: unknown) => {
   218	          const message = toErrorMessage(err);
   219	          console.warn(`[memory-save] T306: Immediate async embedding attempt failed for #${memoryId}: ${message}`);
   220	        });
   221	    });
   222	  }
   223	
   224	  if (causalLinksResult) {
   225	    result.causalLinks = {
   226	      processed: causalLinksResult.processed,
   227	      inserted: causalLinksResult.inserted,
   228	      resolved: causalLinksResult.resolved,
   229	      unresolved_count: causalLinksResult.unresolved.length,
   230	    };
   231	    if (causalLinksResult.errors.length > 0) {
   232	      (result.causalLinks as Record<string, unknown>).errors = causalLinksResult.errors;
   233	    }
   234	  }
   235	
   236	  // C5-6: Surface enrichment gaps when any step failed
   237	  if (enrichmentStatus && Object.values(enrichmentStatus).some(v => !v)) {
   238	    const failed = Object.entries(enrichmentStatus)
   239	      .filter(([, v]) => !v)
   240	      .map(([k]) => k);
   241	    result.warnings = result.warnings || [];
   242	    result.warnings.push(`Partial enrichment: ${failed.join(', ')} failed`);
   243	  }
   244	
   245	  return result;
   246	}
   247	
   248	export function buildSaveResponse({ result, filePath, asyncEmbedding, requestId }: BuildSaveResponseParams): MCPResponse {
   249	  if (result.status === 'unchanged') {
   250	    return createMCPSuccessResponse({
   251	      tool: 'memory_save',
   252	      summary: 'Memory already indexed with same content',
   253	      data: {
   254	        status: 'unchanged',
   255	        id: result.id,
   256	        specFolder: result.specFolder,
   257	        title: result.title,
   258	      },
   259	      hints: ['Use force: true to re-index anyway'],
   260	    });

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Validation Responses
     3	// ───────────────────────────────────────────────────────────────
     4	// Pure builder functions that construct rejection/dry-run results
     5	// from validation outcomes. No side effects or DB access.
     6	
     7	import type {
     8	  MemorySufficiencyResult,
     9	} from '@spec-kit/shared/parsing/memory-sufficiency';
    10	import { MEMORY_SUFFICIENCY_REJECTION_CODE } from '@spec-kit/shared/parsing/memory-sufficiency';
    11	import type {
    12	  MemoryTemplateContractResult,
    13	} from '@spec-kit/shared/parsing/memory-template-contract';
    14	import type { QualityLoopResult } from '../../handlers/quality-loop.js';
    15	import type { IndexResult, ParsedMemory } from './types.js';
    16	import type { ParsedMemoryValidation } from '../../lib/parsing/memory-parser.js';
    17	
    18	// Feature catalog: Dry-run preflight for memory_save
    19	// Feature catalog: Verify-fix-verify memory quality loop
    20	// Feature catalog: Validation feedback (memory_validate)
    21	
    22	function applyInsufficiencyMetadata(
    23	  parsed: ParsedMemory,
    24	  sufficiencyResult: MemorySufficiencyResult,
    25	): void {
    26	  if (!sufficiencyResult.pass) {
    27	    parsed.qualityScore = Math.min(parsed.qualityScore ?? 1, sufficiencyResult.score * 0.6);
    28	    parsed.qualityFlags = Array.from(new Set([...(parsed.qualityFlags || []), 'has_insufficient_context']));
    29	  }
    30	}
    31	
    32	function buildInsufficiencyRejectionResult(
    33	  parsed: ParsedMemory,
    34	  validation: ParsedMemoryValidation,
    35	  sufficiencyResult: MemorySufficiencyResult,
    36	): IndexResult {
    37	  return {
    38	    status: 'rejected',
    39	    id: 0,
    40	    specFolder: parsed.specFolder,
    41	    title: parsed.title ?? '',
    42	    triggerPhrases: parsed.triggerPhrases,
    43	    contextType: parsed.contextType,
    44	    importanceTier: parsed.importanceTier,
    45	    qualityScore: parsed.qualityScore,
    46	    qualityFlags: parsed.qualityFlags,
    47	    warnings: validation.warnings,
    48	    rejectionCode: MEMORY_SUFFICIENCY_REJECTION_CODE,
    49	    rejectionReason: `${MEMORY_SUFFICIENCY_REJECTION_CODE}: ${sufficiencyResult.reasons.join(' ')}`,
    50	    message: 'Not enough context for a proper memory.',
    51	    sufficiency: sufficiencyResult,
    52	  };
    53	}
    54	
    55	function buildTemplateContractRejectionResult(
    56	  parsed: ParsedMemory,
    57	  validation: ParsedMemoryValidation,
    58	  templateContract: MemoryTemplateContractResult,
    59	): IndexResult {
    60	  const violationSummary = templateContract.violations.map((violation) => violation.code).join(', ');
    61	  return {
    62	    status: 'rejected',
    63	    id: 0,
    64	    specFolder: parsed.specFolder,
    65	    title: parsed.title ?? '',
    66	    triggerPhrases: parsed.triggerPhrases,
    67	    contextType: parsed.contextType,
    68	    importanceTier: parsed.importanceTier,
    69	    qualityScore: parsed.qualityScore,
    70	    qualityFlags: Array.from(new Set([...(parsed.qualityFlags || []), 'violates_template_contract'])),
    71	    warnings: validation.warnings,
    72	    rejectionReason: `Template contract validation failed: ${violationSummary}`,
    73	    message: 'Memory file does not match the required template contract.',
    74	  };
    75	}
    76	
    77	function buildDryRunSummary(
    78	  sufficiencyResult: MemorySufficiencyResult,
    79	  qualityLoopResult: QualityLoopResult,
    80	  templateContract: MemoryTemplateContractResult,
    81	): string {
    82	  if (!qualityLoopResult.passed && qualityLoopResult.rejected) {
    83	    return qualityLoopResult.rejectionReason ?? 'Quality loop rejected the save';
    84	  }
    85	
    86	  if (!templateContract.valid) {
    87	    return 'Dry-run detected structural template-contract violations';
    88	  }
    89	
    90	  if (!sufficiencyResult.pass) {
    91	    return 'Dry-run detected insufficient context for a durable memory';
    92	  }
    93	
    94	  return 'Dry-run validation passed';
    95	}
    96	
    97	export {
    98	  applyInsufficiencyMetadata,
    99	  buildInsufficiencyRejectionResult,
   100	  buildTemplateContractRejectionResult,
   101	  buildDryRunSummary,
   102	};

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Pe Orchestration
     3	// ───────────────────────────────────────────────────────────────
     4	import type Database from 'better-sqlite3';
     5	
     6	import * as predictionErrorGate from '../../lib/cognitive/prediction-error-gate.js';
     7	import type { ParsedMemory } from '../../lib/parsing/memory-parser.js';
     8	import { getMemoryHashSnapshot, appendMutationLedgerSafe } from '../memory-crud-utils.js';
     9	import {
    10	  findSimilarMemories,
    11	  reinforceExistingMemory,
    12	  updateExistingMemory,
    13	  logPeDecision,
    14	} from '../pe-gating.js';
    15	import type { PeDecision, SimilarMemory, IndexResult } from './types.js';
    16	
    17	// Feature catalog: Prediction-error save arbitration
    18	// Feature catalog: Memory indexing (memory_save)
    19	
    20	
    21	export interface PeOrchestrationResult {
    22	  decision: PeDecision;
    23	  earlyReturn: IndexResult | null;
    24	  supersededId: number | null;
    25	}
    26	
    27	export function evaluateAndApplyPeDecision(
    28	  database: Database.Database,
    29	  parsed: ParsedMemory,
    30	  embedding: Float32Array | null,
    31	  force: boolean,
    32	  validationWarnings: string[] | undefined,
    33	  embeddingStatus: string,
    34	  filePath: string,
    35	  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
    36	): PeOrchestrationResult {
    37	  let peDecision: PeDecision = { action: 'CREATE', similarity: 0 };
    38	  let candidates: SimilarMemory[] = [];
    39	  let supersededId: number | null = null;
    40	
    41	  if (!force && embedding) {
    42	    candidates = findSimilarMemories(embedding, {
    43	      limit: 5,
    44	      specFolder: parsed.specFolder,
    45	      tenantId: scope?.tenantId,
    46	      userId: scope?.userId,
    47	      agentId: scope?.agentId,
    48	      sessionId: scope?.sessionId,
    49	      sharedSpaceId: scope?.sharedSpaceId,
    50	    });
    51	  }
    52	
    53	  if (!force && candidates.length > 0) {
    54	    peDecision = predictionErrorGate.evaluateMemory(
    55	      parsed.contentHash,
    56	      parsed.content,
    57	      candidates,
    58	      { specFolder: parsed.specFolder }
    59	    );
    60	
    61	    logPeDecision(peDecision, parsed.contentHash, parsed.specFolder);
    62	
    63	    // Guard: PE actions that reference an existing memory require existingMemoryId
    64	    if (
    65	      (peDecision.action === predictionErrorGate.ACTION.REINFORCE ||
    66	        peDecision.action === predictionErrorGate.ACTION.SUPERSEDE ||
    67	        peDecision.action === predictionErrorGate.ACTION.UPDATE) &&
    68	      peDecision.existingMemoryId == null
    69	    ) {
    70	      console.warn(`[Memory Save] PE decision returned ${peDecision.action} without existingMemoryId, falling through to CREATE`);
    71	      peDecision = { action: 'CREATE', similarity: peDecision.similarity };
    72	    }
    73	
    74	    switch (peDecision.action) {
    75	      case predictionErrorGate.ACTION.REINFORCE: {
    76	        const existingId = peDecision.existingMemoryId as number;
    77	        const priorSnapshot = getMemoryHashSnapshot(database, existingId);
    78	        console.error(`[PE-Gate] REINFORCE: Duplicate detected (${peDecision.similarity.toFixed(1)}%)`);
    79	        const reinforced = reinforceExistingMemory(existingId, parsed);
    80	        reinforced.pe_action = 'REINFORCE';
    81	        reinforced.pe_reason = peDecision.reason;
    82	        reinforced.warnings = validationWarnings;
    83	        reinforced.embeddingStatus = embeddingStatus;
    84	
    85	        if (reinforced.status !== 'error') {
    86	          const ledgerRecorded = appendMutationLedgerSafe(database, {
    87	            mutationType: 'update',
    88	            reason: 'memory_save: reinforced existing memory via prediction-error gate',
    89	            priorHash: priorSnapshot?.content_hash ?? null,
    90	            newHash: parsed.contentHash,
    91	            linkedMemoryIds: [existingId],
    92	            decisionMeta: {
    93	              tool: 'memory_save',
    94	              action: predictionErrorGate.ACTION.REINFORCE,
    95	              similarity: peDecision.similarity,
    96	              specFolder: parsed.specFolder,
    97	              filePath,
    98	            },
    99	            actor: 'mcp:memory_save',
   100	          });
   101	          if (!ledgerRecorded) {
   102	            reinforced.warnings = [
   103	              ...(Array.isArray(reinforced.warnings) ? reinforced.warnings : validationWarnings ?? []),
   104	              'Mutation ledger append failed; audit trail may be incomplete.',
   105	            ];
   106	          }
   107	        }
   108	
   109	        return { decision: peDecision, earlyReturn: reinforced, supersededId: null };
   110	      }
   111	
   112	      case predictionErrorGate.ACTION.SUPERSEDE: {
   113	        const existingId = peDecision.existingMemoryId as number;
   114	        console.error(`[PE-Gate] SUPERSEDE: Contradiction detected with memory ${existingId}`);
   115	        // Defer markMemorySuperseded() to caller — it must run AFTER the new
   116	        // record is created, inside the same transaction, to avoid orphaning
   117	        // the old record if new-record creation fails (F1.01).
   118	        supersededId = existingId;
   119	        break;
   120	      }
   121	
   122	      case predictionErrorGate.ACTION.UPDATE: {
   123	        const existingId = peDecision.existingMemoryId as number;
   124	        const priorSnapshot = getMemoryHashSnapshot(database, existingId);
   125	        console.error(`[PE-Gate] UPDATE: High similarity (${peDecision.similarity.toFixed(1)}%), updating existing`);
   126	        if (!embedding) {
   127	          console.warn(
   128	            '[Memory Save] embedding unexpectedly null in UPDATE path, falling through to CREATE'
   129	          );
   130	          break;
   131	        }
   132	        const updated = updateExistingMemory(existingId, parsed, embedding);
   133	        updated.pe_action = 'UPDATE';
   134	        updated.pe_reason = peDecision.reason;
   135	        updated.warnings = validationWarnings;
   136	        updated.embeddingStatus = embeddingStatus;
   137	
   138	        const ledgerRecorded = appendMutationLedgerSafe(database, {
   139	          mutationType: 'update',
   140	          reason: 'memory_save: updated existing memory via prediction-error gate',
   141	          priorHash: priorSnapshot?.content_hash ?? null,
   142	          newHash: parsed.contentHash,
   143	          linkedMemoryIds: updated.status === 'error' ? [existingId] : [existingId, updated.id],
   144	          decisionMeta: {
   145	            tool: 'memory_save',
   146	            action: predictionErrorGate.ACTION.UPDATE,
   147	            similarity: peDecision.similarity,
   148	            specFolder: parsed.specFolder,
   149	            filePath,
   150	          },
   151	          actor: 'mcp:memory_save',
   152	        });
   153	        if (!ledgerRecorded) {
   154	          updated.warnings = [
   155	            ...(Array.isArray(updated.warnings) ? updated.warnings : validationWarnings ?? []),
   156	            'Mutation ledger append failed; audit trail may be incomplete.',
   157	          ];
   158	        }
   159	
   160	        return { decision: peDecision, earlyReturn: updated, supersededId: null };
   161	      }
   162	
   163	      case predictionErrorGate.ACTION.CREATE_LINKED: {
   164	        console.error(`[PE-Gate] CREATE_LINKED: Related content (${peDecision.similarity.toFixed(1)}%)`);
   165	        break;
   166	      }
   167	
   168	      case predictionErrorGate.ACTION.CREATE:
   169	      default:
   170	        if (peDecision.similarity > 0) {
   171	          console.error(`[PE-Gate] CREATE: Low similarity (${peDecision.similarity.toFixed(1)}%)`);
   172	        }
   173	        break;
   174	    }
   175	  }
   176	
   177	  return {
   178	    decision: peDecision,
   179	    earlyReturn: null,
   180	    supersededId,
   181	  };
   182	}

 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Post Insert
     3	// ───────────────────────────────────────────────────────────────
     4	import type BetterSqlite3 from 'better-sqlite3';
     5	import type * as memoryParser from '../../lib/parsing/memory-parser.js';
     6	
     7	import * as embeddings from '../../lib/providers/embeddings.js';
     8	import { processCausalLinks } from '../causal-links-processor.js';
     9	import {
    10	  isAutoEntitiesEnabled,
    11	  isMemorySummariesEnabled,
    12	  isEntityLinkingEnabled,
    13	} from '../../lib/search/search-flags.js';
    14	import {
    15	  extractEntities,
    16	  filterEntities,
    17	  refreshAutoEntitiesForMemory,
    18	} from '../../lib/extraction/entity-extractor.js';
    19	import { generateAndStoreSummary } from '../../lib/search/memory-summaries.js';
    20	import { runEntityLinkingForMemory } from '../../lib/search/entity-linker.js';
    21	import { onIndex, isGraphRefreshEnabled } from '../../lib/search/graph-lifecycle.js';
    22	import { toErrorMessage } from '../../utils/index.js';
    23	
    24	// Feature catalog: Memory indexing (memory_save)
    25	// Feature catalog: Duplicate-save no-op feedback hardening
    26	
    27	
    28	interface CausalLinksResult {
    29	  processed: number;
    30	  inserted: number;
    31	  resolved: number;
    32	  unresolved: { type: string; reference: string }[];
    33	  errors: { type: string; reference: string; error: string }[];
    34	}
    35	
    36	// C5-4: Track which enrichment steps succeeded
    37	export interface EnrichmentStatus {
    38	  causalLinks: boolean;
    39	  entityExtraction: boolean;
    40	  summaries: boolean;
    41	  entityLinking: boolean;
    42	  graphLifecycle: boolean;
    43	}
    44	
    45	export interface PostInsertEnrichmentResult {
    46	  causalLinksResult: CausalLinksResult | null;
    47	  enrichmentStatus: EnrichmentStatus;
    48	}
    49	
    50	/**
    51	 * Run post-insert enrichment pipeline for a newly saved memory.
    52	 *
    53	 * Sequentially executes: causal links processing, entity extraction (R10),
    54	 * summary generation (R8), and cross-document entity linking (S5).
    55	 * Each step is independently guarded by its feature flag and wrapped
    56	 * in try-catch so a single failure does not block the others.
    57	 *
    58	 * @param database - The SQLite database instance.
    59	 * @param id - The memory row ID to enrich.
    60	 * @param parsed - Parsed memory file data from the memory parser.
    61	 * @returns PostInsertEnrichmentResult with causal links outcome.
    62	 */
    63	export async function runPostInsertEnrichment(
    64	  database: BetterSqlite3.Database,
    65	  id: number,
    66	  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
    67	): Promise<PostInsertEnrichmentResult> {
    68	  // C5-4: Track enrichment step outcomes
    69	  const enrichmentStatus: EnrichmentStatus = {
    70	    causalLinks: false,
    71	    entityExtraction: false,
    72	    summaries: false,
    73	    entityLinking: false,
    74	    graphLifecycle: false,
    75	  };
    76	
    77	  // CAUSAL LINKS PROCESSING
    78	  let causalLinksResult: CausalLinksResult | null = null;
    79	  if (parsed.hasCausalLinks && parsed.causalLinks) {
    80	    try {
    81	      causalLinksResult = processCausalLinks(database, id, parsed.causalLinks);
    82	      enrichmentStatus.causalLinks = true;
    83	      if (causalLinksResult.inserted > 0) {
    84	        console.error(`[causal-links] Processed ${causalLinksResult.inserted} causal edges for memory #${id}`);
    85	      }
    86	      if (causalLinksResult.unresolved.length > 0) {
    87	        console.warn(`[causal-links] ${causalLinksResult.unresolved.length} references could not be resolved`);
    88	      }
    89	    } catch (causal_err: unknown) {
    90	      const message = toErrorMessage(causal_err);
    91	      console.warn(`[memory-save] Causal links processing failed: ${message}`);
    92	    }
    93	  } else {
    94	    // No causal links to process — not a failure
    95	    enrichmentStatus.causalLinks = true;
    96	  }
    97	
    98	  // -- Auto Entity Extraction --
    99	  if (isAutoEntitiesEnabled()) {
   100	    try {
   101	      const rawEntities = extractEntities(parsed.content);
   102	      const filtered = filterEntities(rawEntities);
   103	      // Data integrity: clean stale auto-entities before re-extraction on update
   104	      const entityResult = refreshAutoEntitiesForMemory(database, id, filtered);
   105	      if (entityResult.stored > 0) {
   106	        console.error(`[entity-extraction] Extracted ${entityResult.stored} entities for memory #${id}`);
   107	      }
   108	      enrichmentStatus.entityExtraction = true;
   109	    } catch (entityErr: unknown) {
   110	      const message = toErrorMessage(entityErr);
   111	      console.warn(`[memory-save] R10 entity extraction failed: ${message}`);
   112	    }
   113	  } else {
   114	    // Feature disabled — not a failure
   115	    enrichmentStatus.entityExtraction = true;
   116	  }
   117	
   118	  // -- R8: Memory Summary Generation --
   119	  if (isMemorySummariesEnabled()) {
   120	    try {
   121	      const summaryResult = await generateAndStoreSummary(
   122	        database,
   123	        id,
   124	        parsed.content,
   125	        (text: string) => embeddings.generateQueryEmbedding(text)
   126	      );
   127	      if (summaryResult.stored) {
   128	        console.error(`[memory-summaries] Generated summary for memory #${id}`);
   129	      }
   130	      enrichmentStatus.summaries = true;
   131	    } catch (summaryErr: unknown) {
   132	      const message = toErrorMessage(summaryErr);
   133	      console.warn(`[memory-save] R8 summary generation failed: ${message}`);
   134	    }
   135	  } else {
   136	    // Feature disabled — not a failure
   137	    enrichmentStatus.summaries = true;
   138	  }
   139	
   140	  // -- S5: Cross-Document Entity Linking --
   141	  // Runs after R10 entity storage; links entities across spec folders.
   142	  if (isEntityLinkingEnabled() && isAutoEntitiesEnabled()) {
   143	    try {
   144	      const linkResult = runEntityLinkingForMemory(database, id);
   145	      if (linkResult.linksCreated > 0) {
   146	        console.error(`[entity-linking] Created ${linkResult.linksCreated} cross-doc links from ${linkResult.crossDocMatches} entity matches`);
   147	      } else if (linkResult.skippedByDensityGuard) {
   148	        const density = typeof linkResult.edgeDensity === 'number'
   149	          ? linkResult.edgeDensity.toFixed(3)
   150	          : 'unknown';
   151	        const threshold = typeof linkResult.densityThreshold === 'number'
   152	          ? linkResult.densityThreshold.toFixed(3)
   153	          : 'unknown';
   154	        console.error(`[entity-linking] Skipped by density guard (density=${density}, threshold=${threshold})`);
   155	      }
   156	      enrichmentStatus.entityLinking = true;
   157	    } catch (linkErr: unknown) {
   158	      const message = toErrorMessage(linkErr);
   159	      console.warn(`[memory-save] S5 entity linking failed: ${message}`);
   160	    }
   161	  } else {
   162	    // Feature disabled — not a failure
   163	    enrichmentStatus.entityLinking = true;
   164	  }
   165	
   166	  // -- D3 REQ-D3-004: Graph Lifecycle — deterministic save-time enrichment --
   167	  // Runs last; relies on entity extraction having completed above.
   168	  // Gated via isGraphRefreshEnabled() OR SPECKIT_ENTITY_LINKING (any active graph flag).
   169	  // Default-OFF: no-op unless SPECKIT_GRAPH_REFRESH_MODE != 'off' or SPECKIT_ENTITY_LINKING active.
   170	  if (isGraphRefreshEnabled() || isEntityLinkingEnabled()) {
   171	    try {
   172	      const indexResult = onIndex(database, id, parsed.content, {
   173	        qualityScore: typeof parsed.qualityScore === 'number' ? parsed.qualityScore : 0,
   174	      });
   175	      if (!indexResult.skipped) {
   176	        if (indexResult.edgesCreated > 0) {
   177	          console.error(`[graph-lifecycle] Created ${indexResult.edgesCreated} typed edges for memory #${id}`);
   178	        }
   179	        if (indexResult.llmBackfillScheduled) {
   180	          console.error(`[graph-lifecycle] LLM backfill scheduled for memory #${id}`);
   181	        }
   182	      }
   183	      enrichmentStatus.graphLifecycle = true;
   184	    } catch (glErr: unknown) {
   185	      const message = toErrorMessage(glErr);
   186	      console.warn(`[memory-save] D3 graph-lifecycle enrichment failed: ${message}`);
   187	    }
   188	  } else {
   189	    // Feature disabled — not a failure
   190	    enrichmentStatus.graphLifecycle = true;
   191	  }
   192	
   193	  return { causalLinksResult, enrichmentStatus };
   194	}

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts | sed -n '40,270p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: "CocoIndex Code - Semantic Code Search"
     3	description: "Semantic code search via vector embeddings. CocoIndex Code enables natural-language discovery of code, patterns, and implementations across 28+ languages using a CLI and a single MCP search tool."
     4	trigger_phrases:
     5	  - "semantic search"
     6	  - "cocoindex"
     7	  - "ccc"
     8	  - "find code that"
     9	  - "code search"
    10	  - "vector search"
    11	  - "find similar code"
    12	---
    13	
    14	# CocoIndex Code - Semantic Code Search
    15	
    16	> Find code by what it does, not what it says: natural-language queries resolved to semantically relevant results across 28+ languages via CLI or a single MCP tool.
    17	
    18	---
    19	
    20	<!-- ANCHOR:table-of-contents -->
    21	## TABLE OF CONTENTS
    22	
    23	- [1. OVERVIEW](#1-overview)
    24	- [2. QUICK START](#2-quick-start)
    25	- [3. FEATURES](#3-features)
    26	- [4. STRUCTURE](#4-structure)
    27	- [5. CONFIGURATION](#5-configuration)
    28	- [6. USAGE EXAMPLES](#6-usage-examples)
    29	- [7. TROUBLESHOOTING](#7-troubleshooting)
    30	- [8. FAQ](#8-faq)
    31	- [9. RELATED DOCUMENTS](#9-related-documents)
    32	
    33	<!-- /ANCHOR:table-of-contents -->
    34	
    35	---
    36	
    37	<!-- ANCHOR:overview -->
    38	## 1. OVERVIEW
    39	
    40	### What This Skill Does
    41	
    42	CocoIndex Code is a semantic code search tool built on vector embeddings. Where `grep` matches exact characters, CocoIndex Code matches meaning. Ask for "retry logic with exponential backoff" and it returns code that implements that pattern, regardless of how the author named variables or functions. This makes it the right tool when you know what a piece of code does but not where it lives or what it is called.
    43	
    44	The skill ships with two access modes. The CLI (`ccc`) is fastest for one-off queries and all index management operations. The MCP server (`ccc mcp`) exposes a single `search` tool that AI agents call directly via stdio transport, integrating semantic search into any tool-calling workflow without leaving the conversation.
    45	
    46	Indexing is incremental and daemon-backed. The first run scans and embeds all supported files in the project. Subsequent runs update only changed files. A background daemon starts automatically on the first command, persists across calls, and restarts itself when settings or the binary version change.
    47	
    48	### Key Statistics
    49	
    50	| Property | Value |
    51	|---|---|
    52	| Version | 1.0.0 |
    53	| MCP tools exposed | 1 (`search`) |
    54	| Supported languages | 28+ |
    55	| Default embedding model | `sentence-transformers/all-MiniLM-L6-v2` (local, no API key) |
    56	| Primary embedding model | `voyage/voyage-code-3` via LiteLLM (1024-dim, requires `VOYAGE_API_KEY`) |
    57	| Vector storage | SQLite via sqlite-vec |
    58	| Chunk size | 1000 chars, 250 char minimum, 150 char overlap |
    59	| Similarity metric | Cosine similarity (0.0 to 1.0) |
    60	
    61	### How This Compares
    62	
    63	| Tool | Use When | Limitation |
    64	|---|---|---|
    65	| `ccc search` (CocoIndex) | You know what code does but not where it lives | Approximate, needs verification |
    66	| `code_graph_query` | You need exact callers, imports, or structural dependencies | Requires the structural graph to be indexed first |
    67	| `Grep` | You know the exact text, symbol, or regex pattern | Cannot find conceptual matches |
    68	| `Glob` | You know the file name or extension pattern | Cannot search file contents |
    69	| `Read` | You know the exact file path | No search capability |
    70	
    71	### Key Features
    72	
    73	| Feature | Description |
    74	|---|---|
    75	| Semantic search | Query by concept or intent, not exact text |
    76	| CLI and MCP modes | `ccc` for terminal use, `ccc mcp` for AI agent integration |
    77	| Language filters | `--lang` (CLI) or `languages` (MCP) narrows results by language |
    78	| Path filters | `--path` (CLI) or `paths` (MCP) scopes results to a directory |
    79	| Incremental indexing | Only re-embeds changed files on subsequent runs |
    80	| Daemon architecture | Auto-starts, auto-restarts on version or settings change |
    81	| Spec Kit integration | Companion lifecycle tools (`ccc_status`, `ccc_reindex`, `ccc_feedback`) and code-graph/session integration are available through system-spec-kit |
    82	| Two embedding models | Local (no API key) or cloud (higher quality) |
    83	| 28+ languages | Language-aware chunk splitting preserves function and class boundaries |
    84	
    85	In the broader system-spec-kit stack, CocoIndex is the semantic half of a three-system retrieval model: CocoIndex finds conceptually similar code, Code Graph answers structural questions, and session bootstrap surfaces CocoIndex readiness during recovery. The companion lifecycle helpers exposed through system-spec-kit are `ccc_status`, `ccc_reindex`, and `ccc_feedback`.
    86	
    87	<!-- /ANCHOR:overview -->
    88	
    89	---
    90	
    91	<!-- ANCHOR:quick-start -->
    92	## 2. QUICK START
    93	
    94	**Step 1: Install and verify**
    95	
    96	Run the idempotent bootstrap helper. It installs the binary, initializes the project if needed, and reports readiness.
    97	
    98	```bash
    99	bash .opencode/skill/mcp-coco-index/scripts/ensure_ready.sh --strict --require-config
   100	```
   101	
   102	**Step 2: Build the index**
   103	
   104	Run from the project root. The first run scans all supported files and generates embeddings. It takes 1-5 minutes depending on codebase size.
   105	
   106	```bash
   107	ccc index
   108	```
   109	
   110	**Step 3: Check index status**
   111	
   112	Confirm files are indexed before searching.
   113	
   114	```bash
   115	ccc status
   116	```
   117	
   118	**Step 4: Search**
   119	
   120	Run a natural-language query. Add language and path filters to narrow results.
   121	
   122	```bash
   123	ccc search "authentication middleware"
   124	ccc search "error handling" --lang typescript
   125	ccc search "database migration" --path "src/**" --limit 5
   126	```
   127	
   128	<!-- /ANCHOR:quick-start -->
   129	
   130	---
   131	
   132	<!-- ANCHOR:features -->
   133	## 3. FEATURES
   134	
   135	### 3.1 FEATURE HIGHLIGHTS
   136	
   137	CocoIndex Code resolves queries by embedding the natural-language query text and comparing the resulting vector against pre-computed vectors for every code chunk in the index. This means the search engine reads intent, not characters. A query for "graceful shutdown handler" finds code that tears down servers or releases resources, even if the words "graceful", "shutdown", or "handler" never appear in that code.
   138	
   139	The two embedding models trade off quality against convenience. The local model (`all-MiniLM-L6-v2`) requires no API key and works offline, making it the right default for most projects. The Voyage Code 3 model produces 1024-dimensional vectors trained specifically on code, and consistently returns higher-quality results for complex queries on large codebases. Switching models requires a full reset and reindex because the vector dimensions are incompatible.
   140	
   141	Language and path filters apply after ranking, which means they narrow an already semantically ranked result set rather than replacing semantic ranking with keyword matching. This design keeps the filters fast and the results meaningful. For multi-query agent sessions, set `refresh_index=false` on follow-up calls after the first query has already triggered a refresh. The daemon has a known concurrency issue where simultaneous `refresh_index=true` requests can cause `ComponentContext` errors.
   142	
   143	The CLI and MCP interfaces are complementary, not redundant. The CLI handles index management operations (`index`, `status`, `reset`, `init`, `daemon`) that have no MCP equivalents. The MCP server exposes only the `search` tool because index management is a human-initiated operation, not an agent-initiated one. When building an AI workflow that needs semantic search, configure the MCP server and let agents call `search` directly.
   144	
   145	### 3.2 FEATURE REFERENCE
   146	
   147	**CLI commands**
   148	
   149	| Command | Purpose | Key Flags |
   150	|---|---|---|
   151	| `ccc search QUERY` | Semantic search | `--lang`, `--path`, `--limit`, `--offset`, `--refresh` |
   152	| `ccc index` | Build or update the vector index | none |
   153	| `ccc status` | Show index statistics | none |
   154	| `ccc init` | Initialize project (`/.cocoindex_code/`) | `-f` / `--force` |
   155	| `ccc reset` | Reset databases | `--all` (include settings), `-f` (skip prompt) |
   156	| `ccc mcp` | Start MCP server (stdio mode) | none |
   157	| `ccc daemon status` | Show daemon state | none |
   158	| `ccc daemon restart` | Restart daemon | none |
   159	| `ccc daemon stop` | Stop daemon | none |
   160	
   161	**MCP tool: `search`**
   162	
   163	| Parameter | Type | Required | Default | Description |
   164	|---|---|---|---|---|
   165	| `query` | string | Yes | - | Natural-language search query |
   166	| `languages` | list or null | No | null | Filter by programming languages |
   167	| `paths` | list or null | No | null | Filter by file paths |
   168	| `limit` | integer | No | 5 | Maximum number of results to return |
   169	| `offset` | integer | No | 0 | Number of results to skip for pagination |
   170	| `refresh_index` | boolean | No | true | Trigger index refresh before searching |
   171	
   172	**CLI vs. MCP parameter differences**
   173	
   174	| Concept | CLI | MCP | Note |
   175	|---|---|---|---|
   176	| Language filter | `--lang` (repeatable flag) | `languages` (list) | CLI: one flag per language. MCP: list of strings |
   177	| Path filter | `--path` (single string) | `paths` (list) | CLI: one path. MCP: multiple paths |
   178	| Result limit | `--limit` (default 10) | `limit` (default 5) | Different defaults |
   179	| Index refresh | `--refresh` (default false) | `refresh_index` (default true) | Different defaults |
   180	| Pagination | `--offset` | `offset` (default 0) | Available on both surfaces |
   181	
   182	**Embedding models**
   183	
   184	| Model | Type | Dimensions | API Key | Best For |
   185	|---|---|---|---|---|
   186	| `sentence-transformers/all-MiniLM-L6-v2` | Local | 384 | None | Offline use, no API dependency |
   187	| `voyage/voyage-code-3` | Cloud via LiteLLM | 1024 | `VOYAGE_API_KEY` | Higher quality code search |
   188	
   189	**Similarity score interpretation**
   190	
   191	| Score Range | Meaning | Action |
   192	|---|---|---|
   193	| 0.8 - 1.0 | Strong match | Read this first |
   194	| 0.6 - 0.8 | Good match | Worth reviewing |
   195	| 0.4 - 0.6 | Moderate match | Scan for usefulness |
   196	| 0.0 - 0.4 | Weak match | Usually skip |
   197	
   198	<!-- /ANCHOR:features -->
   199	
   200	---
   201	
   202	<!-- ANCHOR:structure -->
   203	## 4. STRUCTURE
   204	
   205	```text
   206	mcp-coco-index/
   207	  SKILL.md                         AI agent instructions and routing logic
   208	  README.md                        This file
   209	  INSTALL_GUIDE.md                 Installation and initial setup guide
   210	  assets/
   211	    config_templates.md            MCP server configuration examples
   212	  manual_testing_playbook/
   213	    01--core-cli-commands/         Test cases for search, index, status, init, reset
   214	    02--mcp-search-tool/           Test cases for MCP search tool
   215	    ...
   216	  references/
   217	    cross_cli_playbook.md          Safe defaults for multi-query sessions and cross-CLI use
   218	    downstream_adoption_checklist.md  Minimum bundle for sibling-repo rollout
   219	    search_patterns.md             Query writing strategies and filter examples
   220	    settings_reference.md          Embedding model switching and daemon settings

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts | sed -n '600,670p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   600	  if (options && options.enableToolDispatchHook === false) {
   601	    return null;
   602	  }
   603	
   604	  // Skip memory-aware tools to prevent recursive surfacing loops
   605	  if (MEMORY_AWARE_TOOLS.has(toolName)) {
   606	    return null;
   607	  }
   608	
   609	  const contextHint = extractContextHint(toolArgs);
   610	  if (!contextHint) {
   611	    return null;
   612	  }
   613	
   614	  // Delegate to the core surface function; token budget is explicitly
   615	  // Enforced at the hook output boundary via estimateTokenCount().
   616	  return autoSurfaceMemories(contextHint, TOOL_DISPATCH_TOKEN_BUDGET, 'tool-dispatch');
   617	}
   618	
   619	/* ───────────────────────────────────────────────────────────────
   620	   7. COMPACTION HOOK (TM-05)
   621	──────────────────────────────────────────────────────────────── */
   622	
   623	/**
   624	 * autoSurfaceAtCompaction
   625	 *
   626	 * Fires at session compaction lifecycle points. Surfaces memories relevant
   627	 * to the ongoing session context so that critical knowledge is preserved
   628	 * across the compaction boundary.
   629	 *
   630	 * Skipped when:
   631	 *   - sessionContext is empty or too short to extract signal
   632	 *   - enableCompactionHook is false in the integration config
   633	 *
   634	 * Token budget: COMPACTION_TOKEN_BUDGET (4000 max)
   635	 *
   636	 * @param sessionContext - A textual summary of the current session state
   637	 * @param options        - Optional integration-layer config flags
   638	 * @returns AutoSurfaceResult or null if nothing to surface / hook disabled
   639	 */
   640	async function autoSurfaceAtCompaction(
   641	  sessionContext: string,
   642	  options?: { enableCompactionHook?: boolean }
   643	): Promise<AutoSurfaceResult | null> {
   644	  // Allow integration layer to disable this hook via config flag
   645	  if (options && options.enableCompactionHook === false) {
   646	    return null;
   647	  }
   648	
   649	  // Require a meaningful context string (at least 3 characters)
   650	  if (!sessionContext || typeof sessionContext !== 'string' || sessionContext.trim().length < 3) {
   651	    return null;
   652	  }
   653	
   654	  // Delegate to the core surface function; token budget is explicitly
   655	  // Enforced at the hook output boundary via estimateTokenCount().
   656	  return autoSurfaceMemories(sessionContext.trim(), COMPACTION_TOKEN_BUDGET, 'compaction');
   657	}
   658	
   659	/* ───────────────────────────────────────────────────────────────
   660	   8. EXPORTS
   661	──────────────────────────────────────────────────────────────── */
   662	
   663	export {
   664	  // Constants
   665	  MEMORY_AWARE_TOOLS,
   666	  CONSTITUTIONAL_CACHE_TTL,
   667	  TOOL_DISPATCH_TOKEN_BUDGET,
   668	  COMPACTION_TOKEN_BUDGET,
   669	
   670	  // Functions

exec
/bin/zsh -lc 'rg -n "buildOpenCodeTransportPlan|compaction|dedupeKey|transportOnly|messagesTransform|compaction" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
5:// contracts to OpenCode-oriented startup, message, and compaction blocks.
21:  dedupeKey: string;
28:  transportOnly: true;
36:  messagesTransform: OpenCodeTransportBlock[];
37:  compaction?: OpenCodeTransportBlock;
82:export function buildOpenCodeTransportPlan(args: {
87:  compactionPayload?: SharedPayloadEnvelope | null;
95:    args.compactionPayload?.kind,
102:  const compactionPayload = args.compactionPayload ?? args.resumePayload ?? args.bootstrapPayload ?? null;
106:    transportOnly: true,
121:          dedupeKey: `system:${systemPayload.kind}`,
130:    messagesTransform: messagePayloads.map((payload, index) => ({
134:      dedupeKey: `messages:${payload.kind}:${index}`,
140:    ...(compactionPayload
142:        compaction: {
145:          payloadKind: compactionPayload.kind,
146:          dedupeKey: `compaction:${compactionPayload.kind}`,
148:            compactionPayload,
149:            'Inject this as the continuity note across compaction. Keep it separate from current-turn retrieval.',

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: OpenCode Transport Adapter
     3	// ───────────────────────────────────────────────────────────────
     4	// Phase 030 / Phase 2: transport-only mapping from shared payload
     5	// contracts to OpenCode-oriented startup, message, and compaction blocks.
     6	
     7	import type { SharedPayloadEnvelope, SharedPayloadSection } from './shared-payload.js';
     8	
     9	/** Hook names emitted by the OpenCode transport adapter. */
    10	export type OpenCodeTransportHook =
    11	  | 'event'
    12	  | 'experimental.chat.system.transform'
    13	  | 'experimental.chat.messages.transform'
    14	  | 'experimental.session.compacting';
    15	
    16	/** One transport block delivered to an OpenCode runtime hook surface. */
    17	export interface OpenCodeTransportBlock {
    18	  hook: OpenCodeTransportHook;
    19	  title: string;
    20	  payloadKind: SharedPayloadEnvelope['kind'];
    21	  dedupeKey: string;
    22	  content: string;
    23	}
    24	
    25	/** Complete transport-only plan derived from shared startup/resume payloads. */
    26	export interface OpenCodeTransportPlan {
    27	  interfaceVersion: '1.0';
    28	  transportOnly: true;
    29	  retrievalPolicyOwner: 'runtime';
    30	  event: {
    31	    hook: 'event';
    32	    trackedPayloadKinds: SharedPayloadEnvelope['kind'][];
    33	    summary: string;
    34	  };
    35	  systemTransform?: OpenCodeTransportBlock;
    36	  messagesTransform: OpenCodeTransportBlock[];
    37	  compaction?: OpenCodeTransportBlock;
    38	}
    39	
    40	function isSharedPayloadEnvelope(value: unknown): value is SharedPayloadEnvelope {
    41	  if (!value || typeof value !== 'object') {
    42	    return false;
    43	  }
    44	  const record = value as Record<string, unknown>;
    45	  return typeof record.kind === 'string'
    46	    && typeof record.summary === 'string'
    47	    && Array.isArray(record.sections)
    48	    && !!record.provenance
    49	    && typeof record.provenance === 'object';
    50	}
    51	
    52	/** Narrow an unknown runtime payload to the shared transport envelope contract. */
    53	export function coerceSharedPayloadEnvelope(value: unknown): SharedPayloadEnvelope | null {
    54	  return isSharedPayloadEnvelope(value) ? value : null;
    55	}
    56	
    57	function renderSections(sections: SharedPayloadSection[], maxSections: number = 2): string {
    58	  return sections
    59	    .slice(0, maxSections)
    60	    .map((section) => `### ${section.title}\n${section.content}`)
    61	    .join('\n\n');
    62	}
    63	
    64	function renderBlockContent(payload: SharedPayloadEnvelope, prefix?: string): string {
    65	  const parts = [
    66	    prefix ? `${prefix}\n` : null,
    67	    `Summary: ${payload.summary}`,
    68	    renderSections(payload.sections),
    69	    `Provenance: producer=${payload.provenance.producer}; trustState=${payload.provenance.trustState}; sourceSurface=${payload.provenance.sourceSurface}`,
    70	  ].filter(Boolean);
    71	  return parts.join('\n\n');
    72	}
    73	
    74	function appendStartupSnapshotNote(content: string): string {
    75	  return [
    76	    content,
    77	    'Note: this is a startup snapshot; later structural reads may differ if the repo state changed.',
    78	  ].join('\n\n');
    79	}
    80	
    81	/** Build the OpenCode runtime hook plan from the shared payload surfaces. */
    82	export function buildOpenCodeTransportPlan(args: {
    83	  bootstrapPayload?: SharedPayloadEnvelope | null;
    84	  startupPayload?: SharedPayloadEnvelope | null;
    85	  resumePayload?: SharedPayloadEnvelope | null;
    86	  healthPayload?: SharedPayloadEnvelope | null;
    87	  compactionPayload?: SharedPayloadEnvelope | null;
    88	  specFolder?: string | null;
    89	}): OpenCodeTransportPlan {
    90	  const trackedPayloadKinds = [
    91	    args.bootstrapPayload?.kind,
    92	    args.startupPayload?.kind,
    93	    args.resumePayload?.kind,
    94	    args.healthPayload?.kind,
    95	    args.compactionPayload?.kind,
    96	  ].filter((kind): kind is SharedPayloadEnvelope['kind'] => !!kind);
    97	
    98	  const systemPayload = args.bootstrapPayload ?? args.startupPayload ?? args.resumePayload ?? null;
    99	  const messagePayloads = [args.resumePayload, args.healthPayload].filter(
   100	    (payload): payload is SharedPayloadEnvelope => !!payload,
   101	  );
   102	  const compactionPayload = args.compactionPayload ?? args.resumePayload ?? args.bootstrapPayload ?? null;
   103	
   104	  return {
   105	    interfaceVersion: '1.0',
   106	    transportOnly: true,
   107	    retrievalPolicyOwner: 'runtime',
   108	    event: {
   109	      hook: 'event',
   110	      trackedPayloadKinds,
   111	      summary: args.specFolder
   112	        ? `Track OpenCode routing hints for ${args.specFolder}`
   113	        : 'Track OpenCode routing hints for the current packet/runtime state',
   114	    },
   115	    ...(systemPayload
   116	      ? {
   117	        systemTransform: {
   118	          hook: 'experimental.chat.system.transform',
   119	          title: 'OpenCode Startup Digest',
   120	          payloadKind: systemPayload.kind,
   121	          dedupeKey: `system:${systemPayload.kind}`,
   122	          content: appendStartupSnapshotNote(renderBlockContent(
   123	            systemPayload,
   124	            'Inject this as the startup digest for hookless OpenCode recovery. Keep it transport-only.',
   125	          ),
   126	          ),
   127	        },
   128	      }
   129	      : {}),
   130	    messagesTransform: messagePayloads.map((payload, index) => ({
   131	      hook: 'experimental.chat.messages.transform' as const,
   132	      title: index === 0 ? 'OpenCode Retrieved Context' : 'OpenCode Operational Context',
   133	      payloadKind: payload.kind,
   134	      dedupeKey: `messages:${payload.kind}:${index}`,
   135	      content: renderBlockContent(
   136	        payload,
   137	        'Inject this as bounded current-turn context. Do not treat it as retrieval policy.',
   138	      ),
   139	    })),
   140	    ...(compactionPayload
   141	      ? {
   142	        compaction: {
   143	          hook: 'experimental.session.compacting',
   144	          title: 'OpenCode Compaction Resume Note',
   145	          payloadKind: compactionPayload.kind,
   146	          dedupeKey: `compaction:${compactionPayload.kind}`,
   147	          content: renderBlockContent(
   148	            compactionPayload,
   149	            'Inject this as the continuity note across compaction. Keep it separate from current-turn retrieval.',
   150	          ),
   151	        },
   152	      }
   153	      : {}),
   154	  };
   155	}

codex
I’ve got the key implementation slices now. I’m doing one last semantic pass over the repo for compaction and scope patterns so I don’t miss a better existing fit before I lock the ranking and roadmap.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'find /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external -maxdepth 2 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "find /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external -name 'AGENTS.md' -o -name 'CLAUDE.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/.gitignore
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/LICENSE
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package-lock.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/tsconfig.json

 succeeded in 0ms:
exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/phase-research-prompt.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
# Iteration 019: PRIORITY RANKING

## Focus
PRIORITY RANKING: Rank ALL findings by impact x feasibility. Create a concrete adoption roadmap.

## Findings
### Finding 1: Add a transport-owned memory reminder block at compaction time
- **Source**: [external/src/index.ts:210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [opencode-transport.ts:102](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L102), [memory-surface.ts:640](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L640); evidence type: both
- **What it does**: Mnemosyne injects an explicit “use memory tools” reminder into `experimental.session.compacting`, while Public’s compaction path currently carries continuity payloads and surfaced memories, not a direct tool-usage reminder.
- **Why it matters for us**: This is the clearest gap with the best fit: it improves post-compaction memory awareness without changing retrieval math or governance. Affected subsystem: OpenCode compaction transport.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Mnemosyne’s direct store/delete loop is incompatible with Public’s governed, file-backed mutation model
- **Source**: [external/src/index.ts:138](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L138), [memory-save.ts:1100](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1100), [memory-crud-delete.ts:71](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts#L71), [response-builder.ts:113](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts#L113), [validation-responses.ts:32](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts#L32); evidence type: both
- **What it does**: Mnemosyne treats memory writes as direct CLI `add/delete` operations; Public routes saves through path validation, governed scope checks, preflight, PE arbitration, enrichment, and rollback-safe cleanup, while deletes support checkpointed folder cleanup.
- **Why it matters for us**: This is the biggest semantic mismatch in the whole phase. We can reuse the discipline, but not the mutation surface. Affected subsystem: memory save/delete UX and operator guidance.
- **Recommendation**: adopt now, but only as wording and workflow discipline, not as API semantics
- **Impact**: high

### Finding 3: Read-side `project/global` aliases are worth prototyping, but only as thin wrappers over existing retrieval scope
- **Source**: [external/src/index.ts:27](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L27), [external/src/index.ts:96](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L96), [memory-search.ts:529](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L529), [memory-search.ts:818](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L818), [context-server.ts:760](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L760); evidence type: wrapper-confirmed plus Public code
- **What it does**: Mnemosyne exposes separate project/global recall tools; Public already has `retrievalLevel: local|global|auto`, but that capability is less ergonomic than Mnemosyne’s named split.
- **Why it matters for us**: The read path is low-risk and high-clarity if we keep it alias-only. The write path should not copy this model because Public scope is governed, not basename-derived. Affected subsystem: memory recall ergonomics.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: Mnemosyne’s AGENTS/startup discipline is reusable only after translating it into Public’s recovery authority
- **Source**: [external/README.md:62](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L62), [context-server.ts:738](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L738), [context-server.ts:785](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L785), [session-bootstrap.ts:168](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L168); evidence type: both
- **What it does**: The README recommends proactive recall/store/delete behavior from session start; Public already has startup instructions, bootstrap/resume authority, and routing nudges, but they are framed around MCP tools and recovery surfaces.
- **Why it matters for us**: The right adoption is a rewrite, not a copy. We should teach “recall early, save after decisions, delete contradictions” using `session_bootstrap`, `memory_context`, and governed save flows. Affected subsystem: startup instructions and operator docs.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 5: A direct `core=true` shortcut should be rejected on Public’s primary surface
- **Source**: [external/src/index.ts:138](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L138), [external/README.md:57](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L57), [vector-index-store.ts:609](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts#L609), [memory-crud-update.ts:67](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts#L67); evidence type: both
- **What it does**: Mnemosyne maps `core` to a simple tag and treats it as always-available context; Public’s constitutional path has explicit tier validation, cache semantics, and token-budget enforcement.
- **Why it matters for us**: A convenience alias would collapse an intentionally stricter hierarchy into a casual flag and encourage over-promotion. Affected subsystem: importance-tier semantics.
- **Recommendation**: reject
- **Impact**: medium

### Finding 6: If we add an OpenCode-native memory facade, it must be delegation-only
- **Source**: [external/package.json:1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L1), [external/src/index.ts:38](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L38), [opencode-transport.ts:82](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L82), [session-bootstrap.ts:330](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L330); evidence type: both
- **What it does**: Mnemosyne proves that a very thin OpenCode plugin can be ergonomically nice, but Public already has a richer transport/MCP authority layer with startup, resume, and compaction payload planning.
- **Why it matters for us**: A second implementation of save/search logic would create drift fast. The only safe version is a façade that delegates to MCP and adds zero new memory authority. Affected subsystem: OpenCode plugin integration.
- **Recommendation**: NEW FEATURE, but only as a delegation-only wrapper
- **Impact**: medium

### Finding 7: Mnemosyne’s offline-first binary/model stack is useful as an optional pattern, not as Public’s default deployment model
- **Source**: [external/README.md:7](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L7), [external/README.md:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L18), [external/README.md:82](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L82), [external/src/index.ts:67](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L67); evidence type: both
- **What it does**: The plugin assumes Bun, an installed `mnemosyne` binary, and a first-run local model download; its only runtime fallback is a “binary not found” error string.
- **Why it matters for us**: The privacy story is good, but the operational cost is wrong for Public’s primary path, where MCP is already installed and governed. Affected subsystem: deployment/runtime strategy.
- **Recommendation**: reject as the default adoption path
- **Impact**: medium

## Sources Consulted
- [phase-research-prompt.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/phase-research-prompt.md)
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts)
- [memory-surface.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
- [memory-crud-delete.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts)
- [memory-crud-update.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts)
- [response-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts)
- [validation-responses.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts)
- [pe-orchestration.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts)
- [post-insert.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts)
- [vector-index-store.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)

## Assessment
- New information ratio: 0.78
- Questions addressed: compaction-survival leverage, governed mutation mismatch, project/global ergonomics, AGENTS/startup reuse, `core=true` semantics, OpenCode plugin layering, offline-first tradeoffs, current hybrid-retrieval overlap, CocoIndex separation.
- Questions answered: Phase A adopt now: add a deduped memory-tool reminder to the existing compaction transport, and rewrite startup/AGENTS wording around `session_bootstrap` plus governed save flows. Phase B prototype later: add read-only `project/global` recall aliases that compile down to current retrieval scope, with no write aliases. Phase C hold or reject: do not add a direct `core=true` shortcut, do not replace Public’s retrieval stack with Mnemosyne, and only pursue an OpenCode-native facade if it delegates to MCP instead of becoming a second authority.
- Questions answered: Mnemosyne’s genuinely new value for Public is not hybrid ranking, it is wrapper ergonomics plus compaction-time memory awareness.
- Validation command used: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict`
- Validation result: `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`, plus `cannot create temp file for here document: Operation not permitted` from the read-only sandbox.

## Reflection
- What worked: tracing `external/src/index.ts` first, then reading Public’s transport, save/delete, and constitutional paths line-by-line made the real adoption boundary obvious: ergonomics and compaction are portable, authority and mutation semantics are not.
- What did not work: the external repo is intentionally too thin to prove backend ranking internals, and the sandbox is read-only, so I could not update `research/research.md`, `checklist.md`, `implementation-summary.md`, or run `generate-context.js`. CocoIndex MCP searches also returned immediate cancellation in this session, so the final ranking relies on direct source tracing rather than a semantic sweep.

## Recommended Next Focus
Implement the Phase A spike in design form before any runtime change: define a single transport-owned compaction reminder block with strict dedupe/ownership rules, then draft the exact Public-facing wording for “recall early, save governed memories, delete contradictions carefully” so it aligns with `session_bootstrap`, `memory_context`, `memory_save`, and `memory_delete` instead of Mnemosyne’s direct CLI mental model.
hook: Stop
hook: Stop Completed
tokens used
147,751
# Iteration 019: PRIORITY RANKING

## Focus
PRIORITY RANKING: Rank ALL findings by impact x feasibility. Create a concrete adoption roadmap.

## Findings
### Finding 1: Add a transport-owned memory reminder block at compaction time
- **Source**: [external/src/index.ts:210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [opencode-transport.ts:102](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L102), [memory-surface.ts:640](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L640); evidence type: both
- **What it does**: Mnemosyne injects an explicit “use memory tools” reminder into `experimental.session.compacting`, while Public’s compaction path currently carries continuity payloads and surfaced memories, not a direct tool-usage reminder.
- **Why it matters for us**: This is the clearest gap with the best fit: it improves post-compaction memory awareness without changing retrieval math or governance. Affected subsystem: OpenCode compaction transport.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Mnemosyne’s direct store/delete loop is incompatible with Public’s governed, file-backed mutation model
- **Source**: [external/src/index.ts:138](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L138), [memory-save.ts:1100](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1100), [memory-crud-delete.ts:71](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts#L71), [response-builder.ts:113](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts#L113), [validation-responses.ts:32](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts#L32); evidence type: both
- **What it does**: Mnemosyne treats memory writes as direct CLI `add/delete` operations; Public routes saves through path validation, governed scope checks, preflight, PE arbitration, enrichment, and rollback-safe cleanup, while deletes support checkpointed folder cleanup.
- **Why it matters for us**: This is the biggest semantic mismatch in the whole phase. We can reuse the discipline, but not the mutation surface. Affected subsystem: memory save/delete UX and operator guidance.
- **Recommendation**: adopt now, but only as wording and workflow discipline, not as API semantics
- **Impact**: high

### Finding 3: Read-side `project/global` aliases are worth prototyping, but only as thin wrappers over existing retrieval scope
- **Source**: [external/src/index.ts:27](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L27), [external/src/index.ts:96](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L96), [memory-search.ts:529](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L529), [memory-search.ts:818](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L818), [context-server.ts:760](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L760); evidence type: wrapper-confirmed plus Public code
- **What it does**: Mnemosyne exposes separate project/global recall tools; Public already has `retrievalLevel: local|global|auto`, but that capability is less ergonomic than Mnemosyne’s named split.
- **Why it matters for us**: The read path is low-risk and high-clarity if we keep it alias-only. The write path should not copy this model because Public scope is governed, not basename-derived. Affected subsystem: memory recall ergonomics.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: Mnemosyne’s AGENTS/startup discipline is reusable only after translating it into Public’s recovery authority
- **Source**: [external/README.md:62](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L62), [context-server.ts:738](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L738), [context-server.ts:785](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L785), [session-bootstrap.ts:168](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L168); evidence type: both
- **What it does**: The README recommends proactive recall/store/delete behavior from session start; Public already has startup instructions, bootstrap/resume authority, and routing nudges, but they are framed around MCP tools and recovery surfaces.
- **Why it matters for us**: The right adoption is a rewrite, not a copy. We should teach “recall early, save after decisions, delete contradictions” using `session_bootstrap`, `memory_context`, and governed save flows. Affected subsystem: startup instructions and operator docs.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 5: A direct `core=true` shortcut should be rejected on Public’s primary surface
- **Source**: [external/src/index.ts:138](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L138), [external/README.md:57](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L57), [vector-index-store.ts:609](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts#L609), [memory-crud-update.ts:67](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts#L67); evidence type: both
- **What it does**: Mnemosyne maps `core` to a simple tag and treats it as always-available context; Public’s constitutional path has explicit tier validation, cache semantics, and token-budget enforcement.
- **Why it matters for us**: A convenience alias would collapse an intentionally stricter hierarchy into a casual flag and encourage over-promotion. Affected subsystem: importance-tier semantics.
- **Recommendation**: reject
- **Impact**: medium

### Finding 6: If we add an OpenCode-native memory facade, it must be delegation-only
- **Source**: [external/package.json:1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L1), [external/src/index.ts:38](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L38), [opencode-transport.ts:82](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L82), [session-bootstrap.ts:330](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L330); evidence type: both
- **What it does**: Mnemosyne proves that a very thin OpenCode plugin can be ergonomically nice, but Public already has a richer transport/MCP authority layer with startup, resume, and compaction payload planning.
- **Why it matters for us**: A second implementation of save/search logic would create drift fast. The only safe version is a façade that delegates to MCP and adds zero new memory authority. Affected subsystem: OpenCode plugin integration.
- **Recommendation**: NEW FEATURE, but only as a delegation-only wrapper
- **Impact**: medium

### Finding 7: Mnemosyne’s offline-first binary/model stack is useful as an optional pattern, not as Public’s default deployment model
- **Source**: [external/README.md:7](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L7), [external/README.md:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L18), [external/README.md:82](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L82), [external/src/index.ts:67](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L67); evidence type: both
- **What it does**: The plugin assumes Bun, an installed `mnemosyne` binary, and a first-run local model download; its only runtime fallback is a “binary not found” error string.
- **Why it matters for us**: The privacy story is good, but the operational cost is wrong for Public’s primary path, where MCP is already installed and governed. Affected subsystem: deployment/runtime strategy.
- **Recommendation**: reject as the default adoption path
- **Impact**: medium

## Sources Consulted
- [phase-research-prompt.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/phase-research-prompt.md)
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts)
- [memory-surface.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
- [memory-crud-delete.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts)
- [memory-crud-update.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts)
- [response-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts)
- [validation-responses.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts)
- [pe-orchestration.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts)
- [post-insert.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts)
- [vector-index-store.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)

## Assessment
- New information ratio: 0.78
- Questions addressed: compaction-survival leverage, governed mutation mismatch, project/global ergonomics, AGENTS/startup reuse, `core=true` semantics, OpenCode plugin layering, offline-first tradeoffs, current hybrid-retrieval overlap, CocoIndex separation.
- Questions answered: Phase A adopt now: add a deduped memory-tool reminder to the existing compaction transport, and rewrite startup/AGENTS wording around `session_bootstrap` plus governed save flows. Phase B prototype later: add read-only `project/global` recall aliases that compile down to current retrieval scope, with no write aliases. Phase C hold or reject: do not add a direct `core=true` shortcut, do not replace Public’s retrieval stack with Mnemosyne, and only pursue an OpenCode-native facade if it delegates to MCP instead of becoming a second authority.
- Questions answered: Mnemosyne’s genuinely new value for Public is not hybrid ranking, it is wrapper ergonomics plus compaction-time memory awareness.
- Validation command used: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict`
- Validation result: `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`, plus `cannot create temp file for here document: Operation not permitted` from the read-only sandbox.

## Reflection
- What worked: tracing `external/src/index.ts` first, then reading Public’s transport, save/delete, and constitutional paths line-by-line made the real adoption boundary obvious: ergonomics and compaction are portable, authority and mutation semantics are not.
- What did not work: the external repo is intentionally too thin to prove backend ranking internals, and the sandbox is read-only, so I could not update `research/research.md`, `checklist.md`, `implementation-summary.md`, or run `generate-context.js`. CocoIndex MCP searches also returned immediate cancellation in this session, so the final ranking relies on direct source tracing rather than a semantic sweep.

## Recommended Next Focus
Implement the Phase A spike in design form before any runtime change: define a single transport-owned compaction reminder block with strict dedupe/ownership rules, then draft the exact Public-facing wording for “recall early, save governed memories, delete contradictions carefully” so it aligns with `session_bootstrap`, `memory_context`, `memory_save`, and `memory_delete` instead of Mnemosyne’s direct CLI mental model.
