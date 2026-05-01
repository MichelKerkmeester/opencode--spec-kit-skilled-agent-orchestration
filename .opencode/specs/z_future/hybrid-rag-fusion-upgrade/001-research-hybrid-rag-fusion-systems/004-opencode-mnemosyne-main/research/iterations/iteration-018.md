### Finding 2: Mnemosyne’s AGENTS/startup memory discipline can be absorbed as prompt policy, not architecture
- **Source**: [external/README.md#L62](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L62), [external/README.md#L37](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L37), [context-server.ts#L684](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L684), [context-server.ts#L755](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755)
- **What it does**: The README recommends a simple operator loop: recall at session start, store after decisions, delete contradictions, use global tools for cross-project preferences. Public already emits session-prime hints and startup instructions describing memory tools and retrieval modes.
- **Why it matters for us**: Integration effort is low because this is mostly wording and prompt-shaping. The reusable value is the disciplined memory workflow, not any new backend mechanism.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 3: First-class `project`/`global` tool aliases would be useful, but only as a thin wrapper over existing scoped retrieval
- **Source**: [external/src/index.ts#L96](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L96), [external/src/index.ts#L118](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L118), [external/README.md#L51](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L51), [memory-search.ts#L492](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L492), [memory-search.ts#L812](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L812), [context-server.ts#L759](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L759)
- **What it does**: Mnemosyne exposes separate recall/store tools for project and global scopes. Public already supports `retrievalLevel: local|global|auto`, scoped governance fields, and community fallback, but that power is hidden behind a denser MCP surface.
- **Why it matters for us**: Integration effort is medium. Read-side aliases are easy, but write-side aliases must not blur governed scopes like `tenantId`, `userId`, `agentId`, `sharedSpaceId`, and `specFolder`.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: `core=true` is only a viable shortcut if it maps cleanly onto Public’s constitutional-tier governance
- **Source**: [external/src/index.ts#L138](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L138), [external/src/index.ts#L160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L160), [external/README.md#L53](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L53), [memory-search.ts#L507](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L507), [vector-index-store.ts#L609](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts#L609), [context-server.ts#L676](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L676), [memory-crud-update.ts#L46](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts#L46)
- **What it does**: Mnemosyne treats `core` as a simple authoring flag. Public already has explicit importance tiers, constitutional injection, constitutional caching, and mutation-side validation around tier changes.
- **Why it matters for us**: Integration effort is medium-high because this is not just a UI nicety. A `core=true` alias would have to map to constitutional or critical semantics, audit history, cache invalidation, and save/update guardrails without weakening governance.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: A thin OpenCode-native memory plugin for Spec Kit Memory is feasible, but only as a delegation layer
- **Source**: [external/package.json#L38](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L38), [external/src/index.ts#L92](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L92), [context-server.ts#L755](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755), [session-bootstrap.ts#L101](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L101)
- **What it does**: Mnemosyne packages five ergonomic tools as a native OpenCode plugin. Public already has richer MCP memory/recovery tooling, but it does not currently expose a similarly slim OpenCode memory facade.
- **Why it matters for us**: Integration effort is medium-high. The facade itself is small, but only if it delegates to existing MCP truth instead of re-implementing search, save, health, or scope logic a second time.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
- [memory-crud-update.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts)
- [vector-index-store.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)

## Assessment
- New information ratio: 0.76
- Questions addressed: top-5 adoption candidates, compaction-survival fit, startup/AGENTS discipline reuse, project/global ergonomics, `core` mapping, thin-plugin feasibility, current Public overlap with hybrid retrieval and CocoIndex
- Questions answered: the best near-term transfer is a health-gated memory compaction block; startup/AGENTS guidance is also easy to absorb; project/global aliases and `core=true` are feasible but need wrapper-only treatment over existing governed surfaces; a native OpenCode memory plugin is viable only as a delegating facade. Validation command used: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict`, which returned `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, while also emitting `cannot create temp file for here document: Operation not permitted`.

## Reflection
- What worked: reading `external/src/index.ts` first, then checking write-side Public semantics before ranking the candidates, made the feasibility differences much clearer than another generic feature comparison.
- What did not work: the external repo still does not expose Mnemosyne backend internals, and the read-only sandbox prevented updating phase artifacts, saving memory, or testing any candidate in-code.

## Recommended Next Focus
Inspect the real Mnemosyne backend next for how `core` is actually retrieved and how global collections are namespaced, then compare that to Public’s `opencode-transport` builder so the next iteration can decide whether to implement only compaction/startup guidance or also add a thin OpenCode memory facade.

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
# Iteration 018: RISK ASSESSMENT

## Focus
RISK ASSESSMENT: What are the risks of adopting each recommended pattern? What could go wrong?

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
I’m treating this as a read-only deep-research pass focused on adoption risk. I’m starting with the external wrapper source and the current Public comparison files so we can ground every risk in actual code paths instead of README claims.
exec
/bin/zsh -lc 'rg -n "mnemosyne|compaction|project|global|core=true|constitutional|retrievalLevel|runtimeReady|lastRuntimeError|compacting|memory_recall|memory_store|memory_delete" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
95:- symptom: stale or conflicting batch totals (for example per-phase files at 10 iterations but global files still at 5); cause: extending iterations without re-syncing shared tracker/consolidated report; fix: treat `batch-phase-review-state.json` and `batch-phase-review-consolidated.md` as mandatory final sync targets after every extension pass [Task 3]
170:- keep JSON payload overrides wired through normalizer/collector: `phase`, `status/sessionStatus`, and completion-percent aliases must map to `projectPhase`, `sessionStatus`, and `completionPercent` to prevent stale-default warnings [Task 1]
353:- 031-normalized-analytics-reader, spec status Complete, validate.sh --strict, check-completion.sh, checklist P0/P1 totals, description.json timestamp, memory_delete, memory_index_scan, lineage mismatch
391:- if memory indexing flags lineage/template mismatches during closeout, remove stale rows with `memory_delete`, rerun forced `memory_index_scan` after cooldown, and verify clean reindex before final sign-off [Task 7]
548:- verification pattern that worked: confirm fresh `context-server.js` processes, run `session_bootstrap`, execute controlled `memory_search` sequence with fixed session id + trace flags, then query `feedback_events` globally and per-session in sqlite [Task 2]
635:- symptom: strict-link validation reports external wiki issues during packet checks; cause: unrelated global `mcp-figma` wikilink debt; fix: mark as out-of-scope noise unless packet directly touches those resources [Task 1]
763:## Task 8: Refresh README/changelog language to current code-graph behavior and sync constitutional README file inventory, outcome success
771:- current reality, no longer wording removal, bounded selective_reindex, full_scan guidance, v3.3.0.0, gate-tool-routing.md, constitutional/README.md
791:- constitutional README parity check should enumerate both `gate-enforcement.md` and `gate-tool-routing.md` as required files so operators see the full always-surfaced ruleset [Task 8]
935:scope: restoring `/spec_kit:*`, `/memory:*`, and `/create:*` command discovery when prompt links drift between workspace and global Codex prompt directories
936:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public and ~/.codex; reuse_rule=reuse on this machine when slash-command lists/autocomplete go blank, but always confirm the active workspace path before repointing global symlinks
960:- symptom: typing `/spec_kit` shows blank command list; cause: `~/.codex/prompts` linked to `/Users/.../.codex` instead of `/Users/.../.codex/prompts`; fix: repoint global symlink to the actual prompts subfolder and re-list prompt files [Task 1]
1412:scope: utility-layer edits in `Websites/anobel.com/src/1_css/global/attributes.css` for responsive ratio defaults and generated selector blocks
1457:## Task 2: Restore/verify Phase 016 runtime/docs (dedup, projectPhase, trigger filter, retry health, contextType)
2047:## Task 2: Configure project-local `.codex` defaults/profiles (`gpt-5.4`, `xhigh`, auto-compact, agent profiles)
2070:- when user asked “Set model to gpt 5.4 @ xhigh ... add auto compact at 400k ... add profiles for ... handover/orchestrate/speckit,” treat project `.codex/config.toml` and per-agent `profile` references as part of the same change set [Task 2]
2076:- project-local `.codex/config.toml` may intentionally diverge from global `~/.codex/config.toml`; record which scope was edited so future agents do not overwrite one with the other [Task 1][Task 2]

exec
/bin/zsh -lc 'pwd && rg --files /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external && rg --files /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers && rg --files /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/tsconfig.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package-lock.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/LICENSE
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/index.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-feedback.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/types.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/index.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/v-rule-bridge.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-opencode-message-schema.mjs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs

codex
I’ve confirmed the external repo is just a thin wrapper, so I’m pulling the wrapper source and the Public comparison paths side by side now. Next I’m tracing the actual tool implementations and compaction hook line by line, then I’ll turn that into adoption-risk findings rather than another feature summary.
exec
/bin/zsh -lc 'wc -l .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md .opencode/plugins/spec-kit-compact-code-graph.js .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts .opencode/skill/mcp-coco-index/README.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     225 .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts
      44 .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json
     109 .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md
     419 .opencode/plugins/spec-kit-compact-code-graph.js
    1898 .opencode/skill/system-spec-kit/mcp_server/context-server.ts
    1378 .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
     350 .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts
    1799 .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
     300 .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts
    1138 .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts
     533 .opencode/skill/mcp-coco-index/README.md
    8193 total

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1466ms:

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
The phase validator is still running, so I’m waiting on that while I continue the static source trace in parallel. Once it finishes, I’ll anchor the risk write-up to the exact validated phase state plus the wrapper evidence.
2026-04-10T20:22:07.897205Z ERROR codex_core::tools::router: error=failed to parse function arguments: missing field `cell_id` at line 1 column 61
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "rg -n \"experimental\\.session\\.compacting|runtimeReady|lastRuntimeError|selective_reindex|output\\.context|compaction|transport|cache\" .opencode/plugins/spec-kit-compact-code-graph.js" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
14:// the user's normal Node environment and returns the transport plan as JSON.
48: *   cacheTtlMs?: number,
68: *   transportOnly: true,
77: *   compaction?: TransportBlock,
85:const transportCache = new Map();
86:let runtimeReady = false;
87:let lastRuntimeError = null;
100:      cacheTtlMs: DEFAULT_CACHE_TTL_MS,
109:    cacheTtlMs: normalizePositiveInt(options.cacheTtlMs, DEFAULT_CACHE_TTL_MS),
120:function cacheKeyForSession(sessionID, specFolder) {
136:    if (plan.transportOnly !== true || !Array.isArray(plan.messagesTransform)) {
185:async function loadTransportPlan({ projectDir, sessionID, specFolder, cacheTtlMs, nodeBinary, bridgeTimeoutMs }) {
186:  const key = cacheKeyForSession(sessionID, specFolder);
188:  const cached = transportCache.get(key);
190:  if (cached && cached.expiresAt > now) {
191:    return cached.plan;
203:      lastRuntimeError = 'Bridge returned no OpenCode transport payload';
204:      runtimeReady = false;
205:      transportCache.delete(key);
209:    runtimeReady = true;
210:    lastRuntimeError = null;
211:    transportCache.set(key, {
213:      expiresAt: now + cacheTtlMs,
218:    runtimeReady = false;
219:    lastRuntimeError = stringifyError(error);
220:    transportCache.delete(key);
261:    transportCache.delete(cacheKeyForSession(sessionID, specFolder));
265:  for (const key of [...transportCache.keys()]) {
267:      transportCache.delete(key);
277: * Create the Spec Kit OpenCode plugin and its transport-backed hook handlers.
297:        description: 'Show Spec Kit compact code graph plugin cache status',
300:          const entries = [...transportCache.entries()]
306:            `cache_ttl_ms=${options.cacheTtlMs}`,
311:            `runtime_ready=${runtimeReady}`,
315:            `last_runtime_error=${lastRuntimeError ?? 'none'}`,
316:            `cache_entries=${transportCache.size}`,
317:            entries || 'cache=empty',
328:        cacheTtlMs: options.cacheTtlMs,
364:        cacheTtlMs: options.cacheTtlMs,
396:    'experimental.session.compacting': async (input, output) => {
401:        cacheTtlMs: options.cacheTtlMs,
406:      const block = plan?.compaction;
412:      if (output.context.some((entry) => entry.includes(rendered))) {
416:      output.context.push(rendered);

exec
/bin/zsh -lc 'rg -n "retrievalLevel|local|global|auto|tenantId|userId|agentId|sharedSpaceId|includeConstitutional|constitutional|core|session_bootstrap|resume|global|community fallback|community" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:10:import { checkDatabaseUpdated } from '../core/index.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:250:      constitutionalCacheCleared: false, toolCacheInvalidated: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:25:import { DATABASE_PATH, SERVER_DIR } from '../../core/config.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:27:import { computeInterferenceScoresBatch } from '../scoring/interference-scoring.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:275:// F4.04/F8.02 fix: Use centralized DB path from core/config.ts.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:299: * Validates a file path against allowed local base paths.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:303:export function validate_file_path_local(file_path: unknown): string | null {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:318:  const valid_path = validate_file_path_local(file_path);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:403:    clear_constitutional_cache();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:441:const constitutional_cache = new Map<string, { data: MemoryRow[]; timestamp: number }>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:446:const constitutional_cache_loading = new Map<string, boolean>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:449:let last_constitutional_cache_db_path: string | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:451:function get_constitutional_cache_db_scope(): string {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:459:function build_constitutional_cache_key(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:463:  const db_scope = get_constitutional_cache_db_scope();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:464:  return `${db_scope}::${spec_folder || 'global'}:${includeArchived ? 'arch' : 'noarch'}`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:467:function refresh_constitutional_cache_db_state(): void {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:468:  const current_db_path = get_constitutional_cache_db_scope();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:469:  last_constitutional_cache_db_path = current_db_path;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:479:function is_constitutional_cache_valid() {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:480:  if (constitutional_cache.size === 0) return false;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:483:    const current_db_path = get_constitutional_cache_db_scope();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:485:      last_constitutional_cache_db_path &&
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:486:      last_constitutional_cache_db_path !== current_db_path
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:519:// The old global singleton would return stale statements from a prior DB connection
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:593:  // WeakMap entries are automatically cleared when the Database key is GC'd.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:603: * Gets cached constitutional memories from the index.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:607: * @returns The constitutional memory rows.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:609:export function get_constitutional_memories(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:615:  const cache_key = build_constitutional_cache_key(spec_folder, includeArchived);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:617:  const cached = constitutional_cache.get(cache_key);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:619:  if (cached && (now - cached.timestamp) < CONSTITUTIONAL_CACHE_TTL && is_constitutional_cache_valid()) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:623:  if (constitutional_cache_loading.get(cache_key) && cached) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:627:  constitutional_cache_loading.set(cache_key, true);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:630:    const constitutional_sql = `
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:632:             'constitutional' as source_type
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:635:      WHERE m.importance_tier = 'constitutional'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:643:    let results = database.prepare(constitutional_sql).all(...params) as MemoryRow[];
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:647:    const max_constitutional_count = Math.floor(MAX_CONSTITUTIONAL_TOKENS / TOKENS_PER_MEMORY);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:648:    results = results.slice(0, max_constitutional_count);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:656:    if (constitutional_cache.size >= CONSTITUTIONAL_CACHE_MAX_KEYS) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:657:      const oldestKey = constitutional_cache.keys().next().value;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:659:        constitutional_cache.delete(oldestKey);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:663:    refresh_constitutional_cache_db_state();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:664:    constitutional_cache.set(cache_key, { data: results, timestamp: now });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:668:    constitutional_cache_loading.delete(cache_key);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:673: * Clears cached constitutional memories.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:677:export function clear_constitutional_cache(spec_folder: string | null = null): void {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:681:    for (const key of [...constitutional_cache.keys()]) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:683:        constitutional_cache.delete(key);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:686:    for (const key of [...constitutional_cache_loading.keys()]) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:688:        constitutional_cache_loading.delete(key);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:692:    constitutional_cache.clear();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:693:    constitutional_cache_loading.clear();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:695:    last_constitutional_cache_db_path = null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:700: * Refreshes interference scores for memories in a folder.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:702: * @param specFolder - The spec folder whose scores should be refreshed.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:705:export function refresh_interference_scores_for_folder(database: Database.Database, specFolder: string): void {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:722:    const scores = computeInterferenceScoresBatch(database, memoryIds);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:723:    const updateStmt = database.prepare('UPDATE memory_index SET interference_score = ? WHERE id = ?');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:725:      updateStmt.run(scores.get(id) ?? 0, id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:728:    console.warn(`[vector-index] interference score refresh failed for '${specFolder}': ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:941:      includeConstitutional: options.includeConstitutional !== false,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1100:    const { get_constitutional_memories_public } = await getQueriesModule();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1101:    return get_constitutional_memories_public(options, database);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1105:    options: { autoClean?: boolean } = {},
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1135:export { validate_file_path_local as validateFilePath };
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1136:export { clear_constitutional_cache as clearConstitutionalCache };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:28:import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core/index.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:109:// Create local path validator
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:226:      const rejectScore = { total: 0, breakdown: { triggers: 0, anchors: 0, budget: 0, coherence: 0 }, issues: [`V-rule hard block: ${failedRuleIds.join(', ')}`] };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:232:          score: rejectScore,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:241:          score: 0,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:264:  parsed.qualityScore = qualityLoopResult.score.total;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:265:  parsed.qualityFlags = qualityLoopResult.score.issues;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:428:    'auto',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:646:          qualityScore: parsed.qualityScore,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:751:              tenantId: scope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:752:              userId: scope.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:753:              agentId: scope.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:755:              sharedSpaceId: scope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:771:            qualityScore: parsed.qualityScore,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:992:    // Data integrity: clean stale auto-entities before re-extraction on update
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:994:    // auto-entity rows so the entity catalog reflects only active content.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:998:        console.error(`[memory-save] Cleaned stale auto-entities for superseded memory #${existing.id}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1007:        console.error(`[memory-save] Cleaned stale auto-entities for PE-superseded memory #${peResult.supersededId}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1063:    console.error(`[memory-save] Quality loop applied ${prepared.qualityLoopResult.fixes.length} auto-fix(es) for ${path.basename(filePath)}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1106:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1107:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1108:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1110:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1129:    throw new Error('File must be a .md or .txt file in: specs/**/memory/, specs/**/ (spec docs), or .opencode/skill/*/constitutional/');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1137:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1138:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1139:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1141:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1153:      tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1154:      userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1155:      agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1157:      sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1164:  if (sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1166:      tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1167:      userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1168:      agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1170:      sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1171:    }, sharedSpaceId, 'editor');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1176:        tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1177:        userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1178:        agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1180:        sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1266:    tenantId: governanceDecision.normalized.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1267:    userId: governanceDecision.normalized.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1268:    agentId: governanceDecision.normalized.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1270:    sharedSpaceId: governanceDecision.normalized.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1285:        tenantId: saveScope.tenantId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1286:        userId: saveScope.userId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1287:        agentId: saveScope.agentId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1288:        sharedSpaceId: saveScope.sharedSpaceId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1465:        tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1466:        userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1467:        agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1469:        sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1470:        reason: sharedSpaceId ? 'shared_space_save' : 'governed_ingest',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1474:      if (sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1483:        `).get(sharedSpaceId, validatedPath, result.id) as { id?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1486:            spaceId: sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1562:        console.error(`[memory-save] Quality loop applied ${prepared.qualityLoopResult.fixes.length} auto-fix(es) for ${path.basename(file_path)} before pending-file promotion`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1728:        constitutionalCacheCleared: false, toolCacheInvalidated: 0,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:27:} from './core/index.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:52:  autoSurfaceMemories,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:53:  autoSurfaceAtToolDispatch,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:54:  autoSurfaceAtCompaction,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:102:import { disposeLocalReranker } from './lib/search/local-reranker.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:107:// T059: Archival manager for automatic archival of ARCHIVED state memories
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:162:  constitutional: unknown[];
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:171:  /** T018: Structured Prime Package for non-hook CLI auto-priming */
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:676:  const constitutionalCount = Array.isArray(sessionPrimeContext.constitutional)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:677:    ? sessionPrimeContext.constitutional.length
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:685:    `Session priming: loaded ${constitutionalCount} constitutional memories and ${codeGraphState}`
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:910:    let autoSurfacedContext: AutoSurfaceResult | null = null;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:914:    const autoSurfaceStart = Date.now();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:920:            autoSurfacedContext = await autoSurfaceAtCompaction(contextHint);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:922:            autoSurfacedContext = await autoSurfaceMemories(contextHint);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:931:        autoSurfacedContext = await autoSurfaceAtToolDispatch(name, args);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:934:        console.error(`[context-server] Tool-dispatch auto-surface failed (non-fatal): ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:937:    const autoSurfaceLatencyMs = Date.now() - autoSurfaceStart;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:938:    if (autoSurfaceLatencyMs > 250) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:939:      console.warn(`[context-server] Auto-surface precheck exceeded p95 target: ${autoSurfaceLatencyMs}ms`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1045:    // SK-004: Inject auto-surface hints before token-budget enforcement so
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1047:    if (autoSurfacedContext && result && !result.isError) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1048:      appendAutoSurfaceHints(result, autoSurfacedContext);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1069:          if (autoSurfacedContext && !result.isError) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1070:            meta.autoSurfacedContext = autoSurfacedContext;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1086:              // Results are typically sorted by score (highest first)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1087:              // Remove from end (lowest-scored) until within budget
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1166:        const constDir = path.join(skillDir, entry.name, 'constitutional');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1170:      // Non-fatal: constitutional directory discovery failed
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1377:    await runAsyncCleanupStep('local-reranker', async () => {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1728:    // T059: Archival Manager for automatic archival of ARCHIVED state memories
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1829:    // P1-7: Optional real-time markdown watcher for automatic re-indexing.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:4:// Phase 024 / Item 7: Composite tool that runs session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:7:import { handleSessionResume } from './session-resume.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:8:import type { CachedSessionSummaryDecision } from './session-resume.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:46:  resume: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:95:  resumeData: Record<string, unknown>,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:101:  if (resumeData.error) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:102:    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:114:    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:155:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163:/** Handle session_bootstrap tool call — one-call session setup */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168:  // Sub-call 1: session_resume with full resume payload
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:169:  let resumeData: Record<string, unknown> = {};
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:171:    const resumeResponse = await handleSessionResume({
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:174:    resumeData = extractData(resumeResponse);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:175:    allHints.push(...extractHints(resumeData));
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:178:    resumeData = { error: message };
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:179:    allHints.push('session_resume failed. Try calling it manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:202:  const cachedSummary = extractCachedSummary(resumeData);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:216:  const completeness = resumeData.error || healthData.error ? 'partial' : 'full';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:219:  const resumeCertainty: SharedPayloadCertainty = resumeData.error ? 'unknown' : 'estimated';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:224:  const resumePayload = coerceSharedPayloadEnvelope(resumeData.payloadContract);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:227:  const resumeStructuralTrust = extractStructuralTrustFromPayload(resumePayload);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:228:  if (!resumeData.error && !resumeStructuralTrust) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:236:    { label: 'session_bootstrap structural context payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:238:  const resumeWithTrust = resumeData.error
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:239:    ? resumeData
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:241:      resumeData,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:242:      resumeStructuralTrust,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:243:      { label: 'session_bootstrap resume payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:248:      key: 'resume-surface',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:250:      content: summarizeUnknown(resumeData),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:252:      certainty: resumeCertainty,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:279:      // This section carries trust derived from the local structural snapshot,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:280:      // which remains valid even when the remote resume surface fails closed.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:289:      content: buildNextActions(resumeData, healthData, structuralContext).join(' | '),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:299:      { label: 'resume', certainty: resumeCertainty },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:311:      sourceRefs: ['session-resume', 'session-health', 'session-snapshot'],
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:324:    resume: resumeWithTrust,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:332:      resumePayload,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:338:    // Keep advisory routing guidance out of nextActions so bootstrap and resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:339:    // remain the authoritative recovery owners for startup and deep resume flows.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:340:    nextActions: buildNextActions(resumeData, healthData, structuralContext),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:13:import { searchCommunities } from '../lib/search/community-search.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:26:  filterByMinQualityScore,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:52:import { checkDatabaseUpdated, isEmbeddingModelReady, waitForEmbeddingModel } from '../core/index.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:113: * Self-contained: uses local types instead of the deprecated MemoryRow/MemoryRecord shapes.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:122:  attentionScore?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:156:  score?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:181:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:182:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:183:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:184:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:190:  includeConstitutional?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:197:  autoDetectIntent?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:206:  minQualityScore?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:207:  min_quality_score?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:211:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:213:  /** Phase B T019: Dual-level retrieval — 'local' (entity), 'global' (community), 'auto' (local + fallback). */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:214:  retrievalLevel?: 'local' | 'global' | 'auto';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:218:// resolveEvalScore, collectEvalChannelsFromRow — now imported from lib/telemetry/eval-channel-tracking.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:431:// filterByMinQualityScore, resolveQualityThreshold, buildCacheArgs,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:498:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:499:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:500:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:501:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:507:    includeConstitutional: includeConstitutional = true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:514:    autoDetectIntent: autoDetectIntent = true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:523:    minQualityScore,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:524:    min_quality_score,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:529:    retrievalLevel: retrievalLevel = 'auto',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:533:  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:535:    tenantId: normalizedScope.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:536:    userId: normalizedScope.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:537:    agentId: normalizedScope.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:539:    sharedSpaceId: normalizedScope.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:578:  const qualityThreshold = resolveQualityThreshold(minQualityScore, min_quality_score);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:665:      console.warn(`[memory-search] Invalid intent '${explicitIntent}', using auto-detection`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:669:  if (!detectedIntent && autoDetectIntent && hasValidQuery) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:676:      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (fallback: ${classification.reason})`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:678:      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (confidence: ${intentConfidence.toFixed(2)})`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:682:  // FIX RC3-B: Intent confidence floor — override low-confidence auto-detections to "understand"
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:691:  // Phase C: Intent-to-profile auto-routing.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:692:  // Explicit caller `profile` always takes precedence; auto-detect fills in when absent.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:696:      const autoProfile = intentClassifier.getProfileForIntent(detectedIntent as IntentType);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:697:      if (autoProfile) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:698:        effectiveProfile = autoProfile;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:699:        console.error(`[memory-search] Intent-to-profile auto-routing: '${detectedIntent}' → profile '${autoProfile}'`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:701:    } catch (_autoProfileErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:724:    tenantId: normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:725:    userId: normalizedScope.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:726:    agentId: normalizedScope.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:727:    sharedSpaceId: normalizedScope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:737:    includeConstitutional,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:781:      tenantId: normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:782:      userId: normalizedScope.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:783:      agentId: normalizedScope.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:784:      sharedSpaceId: normalizedScope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:788:      includeConstitutional,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:812:    // Phase B T018/T019: Community search fallback — inject community members on weak results
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:813:    let communityFallbackApplied = false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:818:      (retrievalLevel === 'global' || retrievalLevel === 'auto')
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:822:        (retrievalLevel === 'global') ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:823:        (resultsForFormatting.length < 3 && retrievalLevel === 'auto');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:826:          const communityResults = searchCommunities(effectiveQuery, requireDb(), 5);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:827:          if (communityResults.totalMemberIds.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:828:            // Fetch the actual memory rows for community member IDs
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:829:            const memberIds = communityResults.totalMemberIds.slice(0, 20);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:834:                     quality_score, created_at
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:840:              // Mark community-sourced results and assign a base score
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:841:              const communityRows = memberRows.map((row) => ({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:844:                score: 0.45,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:845:                _communityFallback: true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:847:              // Merge: append community results not already in pipeline results
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:849:              const newRows = communityRows.filter((r) => !existingIds.has(r.id));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:852:                communityFallbackApplied = true;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:991:    if (communityFallbackApplied) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:992:      appliedBoosts.communityFallback = { applied: true, retrievalLevel };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1219:      let finalScores: number[] = [];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1226:          finalScores = results.map(r => (r.score ?? r.similarity ?? 0) as number);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1233:        scores: finalScores,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1244:          scores: payload.scores,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1326:  // Phase C: effectiveProfile includes auto-routed profile from intent detection.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1361:  filterByMinQualityScore,

exec
/bin/zsh -lc 'rg -n "semantic code search|semantic search|code search|memory|CocoIndex|separate|structural|retrieval" .opencode/skill/mcp-coco-index/README.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
2:title: "CocoIndex Code - Semantic Code Search"
3:description: "Semantic code search via vector embeddings. CocoIndex Code enables natural-language discovery of code, patterns, and implementations across 28+ languages using a CLI and a single MCP search tool."
5:  - "semantic search"
9:  - "code search"
14:# CocoIndex Code - Semantic Code Search
42:CocoIndex Code is a semantic code search tool built on vector embeddings. Where `grep` matches exact characters, CocoIndex Code matches meaning. Ask for "retry logic with exponential backoff" and it returns code that implements that pattern, regardless of how the author named variables or functions. This makes it the right tool when you know what a piece of code does but not where it lives or what it is called.
44:The skill ships with two access modes. The CLI (`ccc`) is fastest for one-off queries and all index management operations. The MCP server (`ccc mcp`) exposes a single `search` tool that AI agents call directly via stdio transport, integrating semantic search into any tool-calling workflow without leaving the conversation.
65:| `ccc search` (CocoIndex) | You know what code does but not where it lives | Approximate, needs verification |
66:| `code_graph_query` | You need exact callers, imports, or structural dependencies | Requires the structural graph to be indexed first |
85:In the broader system-spec-kit stack, CocoIndex is the semantic half of a three-system retrieval model: CocoIndex finds conceptually similar code, Code Graph answers structural questions, and session bootstrap surfaces CocoIndex readiness during recovery. The companion lifecycle helpers exposed through system-spec-kit are `ccc_status`, `ccc_reindex`, and `ccc_feedback`.
137:CocoIndex Code resolves queries by embedding the natural-language query text and comparing the resulting vector against pre-computed vectors for every code chunk in the index. This means the search engine reads intent, not characters. A query for "graceful shutdown handler" finds code that tears down servers or releases resources, even if the words "graceful", "shutdown", or "handler" never appear in that code.
143:The CLI and MCP interfaces are complementary, not redundant. The CLI handles index management operations (`index`, `status`, `reset`, `init`, `daemon`) that have no MCP equivalents. The MCP server exposes only the `search` tool because index management is a human-initiated operation, not an agent-initiated one. When building an AI workflow that needs semantic search, configure the MCP server and let agents call `search` directly.
187:| `voyage/voyage-code-3` | Cloud via LiteLLM | 1024 | `VOYAGE_API_KEY` | Higher quality code search |
223:    install.sh                     Install CocoIndex Code into skill venv
303:CocoIndex Code resolves the project root in this order:
343:Use semantic search to find candidate files, then verify with Grep and Read.
429:Fix: Run `ccc index` to update the index. For a clean rebuild after major structural changes, reset first.
457:Common causes: CocoIndex Code requires Python 3.11 or later. The system Python may be an older version.
473:**Q: Why does CocoIndex Code only expose one MCP tool when the CLI has seven commands?**
487:A: The daemon handles incremental updates automatically. Run `ccc index` manually after major structural changes: branch switches, large merges, or significant refactors. For day-to-day work, the index stays current because changed files are detected on each query when `refresh_index=true` (MCP default) or `--refresh` (CLI flag).
513:| [scripts/install.sh](scripts/install.sh) | Install CocoIndex Code |
521:| [system-spec-kit](../system-spec-kit/SKILL.md) | Context preservation and memory | Complementary: semantic memory vs. semantic code search |
528:| CocoIndex GitHub | https://github.com/cocoindex-io/cocoindex |
529:| CocoIndex Code on PyPI | https://pypi.org/project/cocoindex-code/ |

exec
/bin/zsh -lc "nl -ba .opencode/plugins/spec-kit-compact-code-graph.js | sed -n '180,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   261	    transportCache.delete(cacheKeyForSession(sessionID, specFolder));
   262	    return;
   263	  }
   264	
   265	  for (const key of [...transportCache.keys()]) {
   266	    if (key.startsWith(`${specFolder ?? '__workspace__'}::`)) {
   267	      transportCache.delete(key);
   268	    }
   269	  }
   270	}
   271	
   272	// ─────────────────────────────────────────────────────────────────────────────
   273	// 6. PLUGIN ENTRYPOINT
   274	// ─────────────────────────────────────────────────────────────────────────────
   275	
   276	/**
   277	 * Create the Spec Kit OpenCode plugin and its transport-backed hook handlers.
   278	 *
   279	 * @param {{ directory?: string } | undefined} ctx - OpenCode plugin context.
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '480,1020p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   861	    }
   862	
   863	    // Fix 4 (RC1-B): Apply folder boost — multiply similarity for results matching discovered folder
   864	    if (folderBoost && folderBoost.folder && folderBoost.factor > 1) {
   865	      let boostedCount = 0;
   866	      for (const r of resultsForFormatting) {
   867	        const filePath = (r as Record<string, unknown>).file_path as string | undefined;
   868	        if (filePath && filePath.includes(folderBoost.folder)) {
   869	          const raw = (r as Record<string, unknown>);
   870	          if (typeof raw.similarity === 'number') {
   871	            raw.similarity = Math.min(raw.similarity * folderBoost.factor, 1.0);
   872	            boostedCount++;
   873	          }
   874	        }
   875	      }
   876	      // Re-sort by similarity after boosting
   877	      if (boostedCount > 0) {
   878	        resultsForFormatting.sort((a, b) => {
   879	          const sa = (a as Record<string, unknown>).similarity as number ?? 0;
   880	          const sb = (b as Record<string, unknown>).similarity as number ?? 0;
   881	          return sb - sa;
   882	        });
   883	      }
   884	    }
   885	
   886	    if (sessionId && isSessionRetrievalStateEnabled()) {
   887	      const activeGoal = effectiveQuery.trim().length > 0 ? effectiveQuery : null;
   888	      if (activeGoal) {
   889	        retrievalSessionStateManager.updateGoal(sessionId, activeGoal);
   890	      }
   891	      if (Array.isArray(anchors) && anchors.length > 0) {
   892	        retrievalSessionStateManager.setAnchors(sessionId, anchors);
   893	      }
   894	
   895	      const goalRefinement = refineForGoal(resultsForFormatting, sessionId);
   896	      resultsForFormatting = goalRefinement.results as SessionAwareResult[];
   897	      goalRefinementPayload = {
   898	        activeGoal: goalRefinement.metadata.activeGoal,
   899	        applied: goalRefinement.metadata.refined,
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
   931	        confidence: intentConfidence,
   932	        description: intentClassifier.getIntentDescription(detectedIntent as IntentType),
   933	        weightsApplied: pipelineResult.metadata.stage2.intentWeightsApplied,
   934	      };
   935	    }
   936	
   937	    if (artifactRouting) {
   938	      extraData.artifactRouting = artifactRouting;
   939	      extraData.artifact_routing = artifactRouting;
   940	    }
   941	
   942	    if (pipelineResult.metadata.stage2.feedbackSignalsApplied === 'applied') {
   943	      extraData.feedbackSignals = { applied: true };
   944	      extraData.feedback_signals = { applied: true };
   945	    }
   946	
   947	    if (pipelineResult.metadata.stage2.graphContribution) {
   948	      extraData.graphContribution = pipelineResult.metadata.stage2.graphContribution;
   949	      extraData.graph_contribution = pipelineResult.metadata.stage2.graphContribution;
   950	    }
   951	
   952	    if (pipelineResult.metadata.stage3.rerankApplied) {
   953	      extraData.rerankMetadata = {
   954	        reranking_enabled: true,
   955	        reranking_requested: true,
   956	        reranking_applied: true,
   957	      };
   958	    }
   959	
   960	    if (pipelineResult.metadata.stage3.chunkReassemblyStats.chunkParents > 0) {
   961	      extraData.chunkReassembly = pipelineResult.metadata.stage3.chunkReassemblyStats;
   962	      extraData.chunk_reassembly = pipelineResult.metadata.stage3.chunkReassemblyStats;
   963	    }
   964	
   965	    if (pipelineResult.trace) {
   966	      extraData.retrievalTrace = pipelineResult.trace;
   967	    }
   968	    try {
   969	      const adaptiveShadow = buildAdaptiveShadowProposal(
   970	        requireDb(),
   971	        effectiveQuery,
   972	        resultsForFormatting as Array<Record<string, unknown> & { id: number }>,
   973	      );
   974	      if (adaptiveShadow) {
   975	        extraData.adaptiveShadow = adaptiveShadow;
   976	        extraData.adaptive_shadow = adaptiveShadow;
   977	      }
   978	    } catch (_error: unknown) {
   979	      // Adaptive proposal logging is best-effort only
   980	    }
   981	
   982	    _evalChannelPayloads = buildEvalChannelPayloads(resultsForFormatting);
   983	
   984	    const appliedBoosts: Record<string, unknown> = {
   985	      session: { applied: pipelineResult.metadata.stage2.sessionBoostApplied },
   986	      causal: { applied: pipelineResult.metadata.stage2.causalBoostApplied },
   987	    };
   988	    if (folderBoost && folderBoost.folder) {
   989	      appliedBoosts.folder = { applied: true, folder: folderBoost.folder, factor: folderBoost.factor };
   990	    }
   991	    if (communityFallbackApplied) {
   992	      appliedBoosts.communityFallback = { applied: true, retrievalLevel };
   993	    }
   994	    extraData.appliedBoosts = appliedBoosts;
   995	    extraData.applied_boosts = appliedBoosts;
   996	
   997	    let formatted = await formatSearchResults(
   998	      resultsForFormatting as RawSearchResult[],
   999	      pipelineConfig.searchType,
  1000	      includeContent,
  1001	      anchors,
  1002	      null,
  1003	      null,
  1004	      extraData,
  1005	      includeTrace,
  1006	      normalizedQuery,   // REQ-D5-001/D5-004: pass query for recovery + confidence context
  1007	      specFolder ?? null // REQ-D5-001: pass specFolder for recovery narrowing detection
  1008	    );
  1009	
  1010	    // Prepend evidence gap warning if present
  1011	    if (pipelineResult.annotations.evidenceGapWarning && formatted?.content?.[0]?.text) {
  1012	      try {
  1013	        const parsed = JSON.parse(formatted.content[0].text) as Record<string, unknown>;
  1014	        if (typeof parsed.summary === 'string') {
  1015	          parsed.summary = `${pipelineResult.annotations.evidenceGapWarning}\n\n${parsed.summary}`;
  1016	          formatted.content[0].text = JSON.stringify(parsed, null, 2);
  1017	        }
  1018	      } catch (_error: unknown) {
  1019	        // Non-fatal
  1020	      }

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '660,940p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   821	
   822	  try {
   823	    const triggerMatcher = await import('./lib/parsing/trigger-matcher.js');
   824	    if (typeof triggerMatcher.clearCache === 'function') {
   825	      triggerMatcher.clearCache();
   826	    }
   827	  } catch (error: unknown) {
   828	    const message = error instanceof Error ? error.message : String(error);
   829	    console.error(`[context-server] Failed to clear trigger cache after DB reinit: ${message}`);
   830	  }
   831	
   832	  if (invalidatedEntries > 0) {
   833	    console.error(`[context-server] Cleared ${invalidatedEntries} tool-cache entries after DB reinitialization`);
   834	  }
   835	}
   836	
   837	/* ───────────────────────────────────────────────────────────────
   838	   3. SERVER INITIALIZATION
   839	──────────────────────────────────────────────────────────────── */
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

codex
The wrapper trace is clear now: project scope is just the directory basename, the CLI bridge is a direct `Bun.spawn` delegation layer, and the compaction feature is pure prompt injection. I’m pulling the Public governance and mutation paths next, because that’s where most adoption risk lives.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts | sed -n '1,290p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | sed -n '1100,1295p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '160,350p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts | sed -n '441,700p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

 succeeded in 0ms:
   441	const constitutional_cache = new Map<string, { data: MemoryRow[]; timestamp: number }>();
   442	const CONSTITUTIONAL_CACHE_TTL = 300000;
   443	const CONSTITUTIONAL_CACHE_MAX_KEYS = 50;
   444	
   445	// BUG-012 FIX: Track which cache keys are currently being loaded
   446	const constitutional_cache_loading = new Map<string, boolean>();
   447	
   448	let last_db_mod_time = 0;
   449	let last_constitutional_cache_db_path: string | null = null;
   450	
   451	function get_constitutional_cache_db_scope(): string {
   452	  if (db_path === ':memory:') {
   453	    return db_path;
   454	  }
   455	
   456	  return path.resolve(db_path);
   457	}
   458	
   459	function build_constitutional_cache_key(
   460	  spec_folder: string | null,
   461	  includeArchived: boolean,
   462	): string {
   463	  const db_scope = get_constitutional_cache_db_scope();
   464	  return `${db_scope}::${spec_folder || 'global'}:${includeArchived ? 'arch' : 'noarch'}`;
   465	}
   466	
   467	function refresh_constitutional_cache_db_state(): void {
   468	  const current_db_path = get_constitutional_cache_db_scope();
   469	  last_constitutional_cache_db_path = current_db_path;
   470	
   471	  if (current_db_path === ':memory:' || !fs.existsSync(current_db_path)) {
   472	    last_db_mod_time = 0;
   473	    return;
   474	  }
   475	
   476	  last_db_mod_time = fs.statSync(current_db_path).mtimeMs;
   477	}
   478	
   479	function is_constitutional_cache_valid() {
   480	  if (constitutional_cache.size === 0) return false;
   481	
   482	  try {
   483	    const current_db_path = get_constitutional_cache_db_scope();
   484	    if (
   485	      last_constitutional_cache_db_path &&
   486	      last_constitutional_cache_db_path !== current_db_path
   487	    ) {
   488	      return false;
   489	    }
   490	
   491	    if (current_db_path !== ':memory:' && fs.existsSync(current_db_path)) {
   492	      const stats = fs.statSync(current_db_path);
   493	      if (stats.mtimeMs > last_db_mod_time) {
   494	        last_db_mod_time = stats.mtimeMs;
   495	        return false;
   496	      }
   497	    }
   498	  } catch (e: unknown) {
   499	    console.warn('[vector-index] Cache validation error:', get_error_message(e));
   500	  }
   501	
   502	  return true;
   503	}
   504	
   505	/* ───────────────────────────────────────────────────────────────
   506	   4. PREPARED STATEMENT CACHING
   507	----------------------------------------------------------------*/
   508	
   509	type PreparedStatements = {
   510	  count_all: Database.Statement<[], { count: number }>;
   511	  count_by_folder: Database.Statement<[string], { count: number }>;
   512	  get_by_id: Database.Statement<[number], MemoryRow | undefined>;
   513	  get_by_path: Database.Statement<[string], MemoryRow | undefined>;
   514	  get_by_folder_and_path: Database.Statement<[string, string, string, string | null, string | null], { id: number } | undefined>;
   515	  get_stats: Database.Statement<[], { total: number; complete: number; pending: number; failed: number }>;
   516	  list_base: Database.Statement<[number, number], MemoryRow[]>;
   517	};
   518	// F-09 — Scope prepared statements per Database instance via WeakMap.
   519	// The old global singleton would return stale statements from a prior DB connection
   520	// When called with a different database, executing queries against the wrong connection.
   521	const prepared_statements_cache = new WeakMap<Database.Database, PreparedStatements>();
   522	
   523	/**
   524	 * Initializes cached prepared statements for common queries.
   525	 * @param database - The database connection to prepare against.
   526	 * @returns The prepared statements cache.
   527	 */
   528	export function init_prepared_statements(database: Database.Database): PreparedStatements {
   529	  const cached = prepared_statements_cache.get(database);
   530	  if (cached) return cached;
   531	
   532	  const prepared_statements: PreparedStatements = {
   533	    count_all: database.prepare(`
   534	      SELECT COUNT(*) as count
   535	      FROM memory_index m
   536	      JOIN active_memory_projection p ON p.active_memory_id = m.id
   537	    `),
   538	    count_by_folder: database.prepare(`
   539	      SELECT COUNT(*) as count
   540	      FROM memory_index m
   541	      JOIN active_memory_projection p ON p.active_memory_id = m.id
   542	      WHERE m.spec_folder = ?
   543	    `),
   544	    get_by_id: database.prepare('SELECT * FROM memory_index WHERE id = ?'),
   545	    get_by_path: database.prepare(`
   546	      SELECT m.*
   547	      FROM memory_index m
   548	      JOIN active_memory_projection p ON p.active_memory_id = m.id
   549	      WHERE m.file_path = ?
   550	    `),
   551	    get_by_folder_and_path: database.prepare(`
   552	      SELECT m.id
   553	      FROM memory_index m
   554	      JOIN active_memory_projection p ON p.active_memory_id = m.id
   555	      WHERE m.spec_folder = ?
   556	        AND (m.canonical_file_path = ? OR m.file_path = ?)
   557	        AND (m.anchor_id = ? OR (m.anchor_id IS NULL AND ? IS NULL))
   558	      ORDER BY m.id DESC
   559	      LIMIT 1
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

web search: 
web search: 
exec
/bin/zsh -lc "nl -ba .opencode/skill/mcp-coco-index/README.md | sed -n '36,90p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "rg -n \"function buildOpenCodeTransportPlan|buildOpenCodeTransportPlan\\(|opencodeTransport|compaction\" .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts .opencode/skill/system-spec-kit/mcp_server -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:58:  opencodeTransport?: OpenCodeTransportPlan;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:330:    opencodeTransport: buildOpenCodeTransportPlan({
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:114:  opencodeTransport?: OpenCodeTransportPlan;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:590:    opencodeTransport: buildOpenCodeTransportPlan({
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:58:  opencodeTransport?: OpenCodeTransportPlan;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:330:    opencodeTransport: buildOpenCodeTransportPlan({
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:253:  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware'
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:368:  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware' = 'memory-aware'
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:626: * Fires at session compaction lifecycle points. Surfaces memories relevant
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:628: * across the compaction boundary.
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:656:  return autoSurfaceMemories(sessionContext.trim(), COMPACTION_TOKEN_BUDGET, 'compaction');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1269:> **Purpose:** Enable seamless session recovery after context compaction, crashes, or breaks.
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:7:/** Token budget for compaction context injection */
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:149:        ? 'Recovered compact transcript lines were removed before fallback compaction cache assembly.'
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:150:        : 'No recovered compact transcript lines detected in fallback compaction cache assembly.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:163:        kind: 'compaction',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:170:        summary: 'Fallback compaction cache assembled from sanitized transcript tail',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:55:    expect(parsed.data.opencodeTransport.systemTransform.title).toContain('Startup Digest');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:39:    const plan = buildOpenCodeTransportPlan({
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:53:    expect(plan.compaction?.hook).toBe('experimental.session.compacting');
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:67:    expect(parsed.data.opencodeTransport.transportOnly).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-extractor.vitest.ts:20:      a compaction cycle. The compaction cycle moves live objects to reduce
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:4:// Tracks files and symbols accessed during a session for compaction
.opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts:12:    triggered: 'Trigger: compaction recovery context',
.opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts:45:      expect(result.payloadContract.kind).toBe('compaction');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:5:// into a unified compact brief for compaction injection.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:192:      kind: 'compaction',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:208:        sourceSurface: 'compaction',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:17:      opencodeTransport: {
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:40:        compaction: {
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:44:          dedupeKey: 'compaction:resume',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:45:          content: 'Summary: compaction note',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:164:  it('adds a compaction note and invalidates cache on session events', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1119:    it('T000g: memory_context resume mode invokes TM-05 compaction hook at runtime', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:4:// - autoSurfaceAtCompaction:   fires at session compaction lifecycle point
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:300:  it('fires matcher once at tool-dispatch and once at compaction lifecycle points', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:305:    await autoSurfaceAtCompaction('compaction lifecycle context');
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:309:    expect(matchSpy).toHaveBeenNthCalledWith(2, 'compaction lifecycle context', 5);
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:569:  it('compaction hook also enforces result limit via matchTriggerPhrases', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:609:  it('compaction output boundary enforces estimated token budget', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:622:    const result = await autoSurfaceAtCompaction('compaction context for budget enforcement');
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:698:    await autoSurfaceAtCompaction('compaction session context');
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:743:describe('compaction pipeline integration', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:5:// contracts to OpenCode-oriented startup, message, and compaction blocks.
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:37:  compaction?: OpenCodeTransportBlock;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:82:export function buildOpenCodeTransportPlan(args: {
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:87:  compactionPayload?: SharedPayloadEnvelope | null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:95:    args.compactionPayload?.kind,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:102:  const compactionPayload = args.compactionPayload ?? args.resumePayload ?? args.bootstrapPayload ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:140:    ...(compactionPayload
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:142:        compaction: {
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:145:          payloadKind: compactionPayload.kind,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:146:          dedupeKey: `compaction:${compactionPayload.kind}`,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:148:            compactionPayload,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:149:            'Inject this as the continuity note across compaction. Keep it separate from current-turn retrieval.',
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:5:// shared by startup, recovery, and compaction surfaces.
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:12:  | 'compaction';

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts | sed -n '82,170p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts | sed -n '620,680p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   671	  extractContextHint,
   672	  getConstitutionalMemories,
   673	  clearConstitutionalCache,
   674	  autoSurfaceMemories,
   675	  primeSessionIfNeeded,
   676	  resetSessionPrimed,
   677	  autoSurfaceAtToolDispatch,
   678	  autoSurfaceAtCompaction,
   679	
   680	  // T018: Session tracking for session_health tool

 succeeded in 0ms:
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
I’ve got enough code evidence to score the real failure modes now. I’m doing one quick memory lookup cleanup so the final write-up can distinguish what came from prior workspace history versus what I verified directly in this turn.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '540,552p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   540	### keywords
   541	
   542	- follow_on_tool_use, resolveSessionTrackingId, logFollowOnToolUse, memory_stats schema, session_bootstrap, feedback_events sqlite3
   543	
   544	## Reusable knowledge
   545	
   546	- `follow_on_tool_use` depends on a session id that matches the in-memory search session cache; if a non-search tool call lacks/does not inherit that session id, the follow-on event will not emit [Task 2]
   547	- `memory_stats` currently has no `sessionId` input in tool schema, so calling it after `memory_search` cannot claim the same session by default [Task 2]
   548	- verification pattern that worked: confirm fresh `context-server.js` processes, run `session_bootstrap`, execute controlled `memory_search` sequence with fixed session id + trace flags, then query `feedback_events` globally and per-session in sqlite [Task 2]
   549	- build/test/doc passes can still be misleading if live workers are stale; restart/runtime pickup must be treated as a separate verification gate [Task 1]
   550	
   551	## Failures and how to do differently
   552	

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '763,772p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   763	## Task 8: Refresh README/changelog language to current code-graph behavior and sync constitutional README file inventory, outcome success
   764	
   765	### rollout_summary_files
   766	
   767	- rollout_summaries/2026-04-03T11-57-51-M8RC-code_graph_documentation_and_changelog_sync.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T13-57-51-019d5334-f0f1-7730-8c5e-9ab6db1b631c.jsonl, updated_at=2026-04-04T15:43:31+00:00, thread_id=019d5334-f0f1-7730-8c5e-9ab6db1b631c)
   768	
   769	### keywords
   770	
   771	- current reality, no longer wording removal, bounded selective_reindex, full_scan guidance, v3.3.0.0, gate-tool-routing.md, constitutional/README.md
   772	

codex
# Iteration 018: RISK ASSESSMENT

## Focus
RISK ASSESSMENT: What are the risks of adopting each recommended pattern? What could go wrong?

## Findings
### Finding 1: Adopting Mnemosyne-style compaction reminders risks duplicating Public’s existing compaction channels
- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L208), [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396), [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L102), [memory-surface.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L623)
- **Evidence type**: wrapper-confirmed for Mnemosyne; wrapper-confirmed for Public
- **What it does**: Mnemosyne appends a fixed memory-usage instruction block during `experimental.session.compacting`, while Public already has a transport-backed compaction note plus a separate `autoSurfaceAtCompaction()` path that injects retrieved memory/context.
- **Why it matters for us**: The transfer is still attractive, but the main risk is prompt collision: we could end up with three compaction surfaces saying similar things in different voices, which weakens retrieval-policy clarity and increases prompt noise.
- **Recommendation**: adopt now
- **Impact**: high

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


hook: Stop
hook: Stop Completed
tokens used
125,464
# Iteration 018: RISK ASSESSMENT

## Focus
RISK ASSESSMENT: What are the risks of adopting each recommended pattern? What could go wrong?

## Findings
### Finding 1: Adopting Mnemosyne-style compaction reminders risks duplicating Public’s existing compaction channels
- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L208), [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396), [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L102), [memory-surface.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L623)
- **Evidence type**: wrapper-confirmed for Mnemosyne; wrapper-confirmed for Public
- **What it does**: Mnemosyne appends a fixed memory-usage instruction block during `experimental.session.compacting`, while Public already has a transport-backed compaction note plus a separate `autoSurfaceAtCompaction()` path that injects retrieved memory/context.
- **Why it matters for us**: The transfer is still attractive, but the main risk is prompt collision: we could end up with three compaction surfaces saying similar things in different voices, which weakens retrieval-policy clarity and increases prompt noise.
- **Recommendation**: adopt now
- **Impact**: high

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
