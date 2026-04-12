### Keyword Triggers

`autoresearch`, `deep research`, `autonomous research`, `research loop`, `iterative research`, `multi-round research`, `deep investigation`, `comprehensive research`

For iterative code review and quality auditing, see `sk-deep-review`.


### Finding 2: The wrapper collapses most failures into raw stderr or one install hint
- **Source**: [external/src/index.ts#L38](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L38), [external/src/index.ts#L96](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L96), [memory-crud-health.ts#L426](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L426), [memory-search.ts#L904](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L904), [sqlite-fts.ts#L208](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L208)
- **What it does**: `mnemosyne(...args)` returns a friendly message only for missing binary cases; everything else becomes raw stderr or a thrown error. The search/store/delete tools add almost no structure on top. Public exposes degraded-state metadata like `lexicalPath` and `fallbackState`, plus `memory_health` with confirmation-gated repair actions and clearer recovery paths.
- **Why it matters for us**: We should not copy the “shell out and trust stderr” pattern into any governed memory surface. It hides failure classes that matter operationally.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: Basename-derived project keys create rename, collision, and migration risk
- **Source**: [external/src/index.ts#L27](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L27), [external/README.md#L51](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L51), [db-state.ts#L294](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts#L294)
- **What it does**: Mnemosyne derives project scope from `path.basename(targetDir)`, rewrites the basename `global` to `default`, and auto-inits that derived collection. That is ergonomic, but it also means repo renames, duplicate directory names, or worktree layout changes can silently remap memory authority. Public’s scope model is explicit and even guards against empty-database path drift during rebind.
- **Why it matters for us**: This is a migration hazard, not just a naming quirk. A repo rename can look like “lost memory,” while same-basename repos can merge memory unintentionally.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: Delete hygiene depends on parsing plain-text recall output
- **Source**: [external/src/index.ts#L106](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L106), [external/src/index.ts#L193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L193), [external/README.md#L37](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L37)
- **What it does**: Recall uses `--format plain`, and delete only accepts a numeric document ID that the agent is expected to pick out from bracketed text output. The wrapper does not attach scope, title, or structured confirmation to the delete flow.
- **Why it matters for us**: This is workable for a light plugin, but brittle for automation. Stale IDs, misparsed output, or unclear scope boundaries raise deletion risk.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: The compaction hook can advertise broken memory tools
- **Source**: [external/src/index.ts#L208](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L208), [spec-kit-compact-code-graph.js#L185](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L185), [spec-kit-compact-code-graph.js#L296](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L296), [spec-kit-compact-code-graph.js#L396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396)
- **What it does**: Mnemosyne always injects its memory-usage instructions during `experimental.session.compacting`; it does not check whether the binary is missing, init failed, or the backend is unhealthy. Public’s compaction transport only injects when a transport plan is available, tracks `runtimeReady`, preserves `lastRuntimeError`, and exposes a status tool.
- **Why it matters for us**: The useful transferable idea is not “always remind the agent about memory.” It is “remind the agent only when the memory surface is actually healthy.”
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 6: The wrapper adds per-call process overhead without its own scaling or repair controls
- **Source**: [external/src/index.ts#L38](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L38), [external/package.json#L31](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L31), [context-server.ts#L1230](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1230), [context-server.ts#L1632](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1632), [db-state.ts#L246](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts#L246)
- **What it does**: Every Mnemosyne tool call launches a fresh CLI process. The wrapper does not add timeouts, batching, health caches, or repair orchestration of its own. Public keeps a persistent server process, mutexes DB reinitialization, bounds startup scans, forces WAL mode, and rebuilds BM25 from the database on startup.
- **Why it matters for us**: A binary wrapper can be a good convenience facade, but it is a weak place to center scaling, migration, or corruption recovery.
- **Recommendation**: prototype later
- **Impact**: medium

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts)
- [sqlite-fts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts)
- [vector-index-queries.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts)
- [db-state.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)

## Assessment
- New information ratio: 0.81
- Questions addressed: missing-binary handling, first-model-download readiness, corruption and repair visibility, rename and scope migration risk, delete hygiene, compaction behavior under failure, wrapper-level scaling limits
- Questions answered: Mnemosyne’s failure model is thin and backend-dependent. The wrapper mitigates one narrow edge case well, query quoting, but otherwise lacks readiness, migration, corruption, and repair contracts. Public is materially stronger here because it exposes degraded states, recovery tooling, bounded repair, and startup integrity checks. The exact validation command used was `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict`, which returned `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED` while also emitting `cannot create temp file for here document: Operation not permitted`.

## Reflection
- What worked: reading the wrapper top-to-bottom first, then comparing it directly against Public’s startup, health, retrieval-fallback, and compaction code made the real failure boundary very clear.
- What did not work: CocoIndex was not usable in this sandbox because the CLI could not write its daemon log, the checked-out external repo does not include the Mnemosyne backend internals, and the workspace is read-only so I could not update the phase artifacts this iteration.

## Recommended Next Focus
Trace the actual Mnemosyne backend repo next, specifically collection ID namespace, delete scoping, schema migration paths, model-download retry/resume behavior, and concurrent CLI access under load. That is the missing layer needed to decide whether the wrapper’s thinness is acceptable or just defers too much operational risk downstream.

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
# Iteration 017: INTEGRATION FEASIBILITY

## Focus
INTEGRATION FEASIBILITY: For top 5 adoption candidates, how hard would they be to integrate into Spec Kit Memory?

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
I’m treating this as a read-only deep-research pass on the Mnemosyne wrapper and the current Spec Kit Memory surfaces, with the goal of ranking the top adoption candidates by integration difficulty rather than repeating the earlier failure-model findings. I’ll start by loading the most relevant prior memory pointer, then read `external/src/index.ts` top-to-bottom, compare it against the current memory/compaction code, and only then synthesize the top 5 candidates with concrete integration effort.
exec
/bin/zsh -lc "sed -n '1,260p' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "mnemosyne|hybrid-rag-fusion|compaction|project/global|memory plugin|compaction hook" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

codex
I’ve confirmed the wrapper is extremely thin: almost everything interesting lives in `src/index.ts`, and `package.json` shows there’s no bundled backend source hiding elsewhere in this repo. Next I’m pulling the README contract plus the current Public retrieval, health, bootstrap, and compaction code so I can rank the top 5 transferable ideas by actual integration difficulty.
exec
/bin/zsh -lc "sed -n '1,260p' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/SKILL.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
| **Progressive synthesis** | `progressiveSynthesis` defaults to `true`; the agent may update `research/research.md` incrementally, and the orchestrator always performs the final consolidation pass |

---

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
## 4. RULES

### ALWAYS

1. **Read state first** -- Agent must read JSONL and strategy.md before any research action
2. **One focus per iteration** -- Pick ONE research sub-topic from strategy.md "Next Focus"
3. **Externalize findings** -- Write to iteration-NNN.md, not held in agent context
4. **Update strategy** -- Append to "What Worked"/"What Failed", update "Next Focus"
5. **Report newInfoRatio** -- Every iteration JSONL record must include newInfoRatio
6. **Respect exhausted approaches** -- Never retry approaches in the "Exhausted" list
7. **Cite sources** -- Every finding must cite `[SOURCE: url]` or `[SOURCE: file:line]`
8. **Use generate-context.js for memory saves** -- Never manually create memory files
9. **Treat research/research.md as workflow-owned** -- Iteration findings feed synthesis; the workflow owns the canonical `research/research.md`
10. **Document ruled-out directions per iteration** -- Every iteration must include what was tried and failed
11. **Report newInfoRatio + 1-sentence novelty justification** -- Every JSONL iteration record must include both
12. **Quality guards must pass before convergence** -- Source diversity, focus alignment, and no single-weak-source checks must pass before STOP can trigger
13. **Respect reducer ownership** -- The workflow reducer, not the agent, is the source of truth for strategy machine-owned sections, dashboard metrics, and findings registry updates
14. **Use canonical packet names only** -- Write `deep-research-*` artifacts and `research/.deep-research-pause`; legacy names are read-only migration aliases

### NEVER

1. **Dispatch sub-agents** -- @deep-research is LEAF-only (NDP compliance)
2. **Hold findings in context** -- Write everything to files
3. **Exceed TCB** -- Target 8-11 tool calls per iteration (max 12)
4. **Ask the user** -- Autonomous execution; make best-judgment decisions
5. **Skip convergence checks** -- Every iteration must be evaluated
6. **Modify config after init** -- Config is read-only after initialization
7. **Overwrite prior findings** -- Append to research/research.md, never replace

### Iteration Status Enum

`complete | timeout | error | stuck | insight | thought`

- `insight`: Low newInfoRatio but important conceptual breakthrough

exec
/bin/zsh -lc "sed -n '1,260p' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,260p' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main' --strict" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1495ms:

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
The strict validator call didn’t return a completed chunk through the first poll, so I’m checking its final terminal output directly now. After that I’m drilling into the exact Public code paths that correspond to the likely adoption candidates: compaction injection, startup health, scope handling, and retrieval tool ergonomics.
exec
/bin/zsh -lc "sed -n '160,460p' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
    transportCache.delete(cacheKeyForSession(sessionID, specFolder));
    return;
  }

  for (const key of [...transportCache.keys()]) {
    if (key.startsWith(`${specFolder ?? '__workspace__'}::`)) {
      transportCache.delete(key);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. PLUGIN ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the Spec Kit OpenCode plugin and its transport-backed hook handlers.
 *
 * @param {{ directory?: string } | undefined} ctx - OpenCode plugin context.
 * @param {PluginOptions | undefined} rawOptions - Optional plugin overrides.
 * @returns {Promise<object>} Hook and tool registrations consumed by OpenCode.
 */
export default async function SpecKitCompactCodeGraphPlugin(ctx, rawOptions) {
  const options = normalizeOptions(rawOptions);
  const projectDir = ctx?.directory || process.cwd();

  return {
    event: async ({ event }) => {
      if (!shouldInvalidateEvent(event?.type)) {
        return;
      }
      invalidateTransportCache(extractEventSessionID(event), options.specFolder);
    },

    tool: {
      spec_kit_compact_code_graph_status: tool({
        description: 'Show Spec Kit compact code graph plugin cache status',
        args: {},
        async execute() {
          const entries = [...transportCache.entries()]
            .map(([key, value]) => `${key} expires=${new Date(value.expiresAt).toISOString()}`)
            .join('\n');

          return [
            `plugin_id=${PLUGIN_ID}`,
            `cache_ttl_ms=${options.cacheTtlMs}`,
            `spec_folder=${options.specFolder ?? 'auto'}`,
            `resume_mode=${RESUME_MODE}`,
            `messages_transform_enabled=${MESSAGES_TRANSFORM_ENABLED}`,
            `messages_transform_mode=${MESSAGES_TRANSFORM_MODE}`,
            `runtime_ready=${runtimeReady}`,
            `node_binary=${options.nodeBinary}`,
            `bridge_timeout_ms=${options.bridgeTimeoutMs}`,
            `bridge_path=${BRIDGE_PATH}`,
            `last_runtime_error=${lastRuntimeError ?? 'none'}`,
            `cache_entries=${transportCache.size}`,
            entries || 'cache=empty',
          ].join('\n');
        },
      }),
    },

    'experimental.chat.system.transform': async (input, output) => {
      const plan = await loadTransportPlan({
        projectDir,
        sessionID: input.sessionID,
        specFolder: options.specFolder,
        cacheTtlMs: options.cacheTtlMs,
        nodeBinary: options.nodeBinary,
        bridgeTimeoutMs: options.bridgeTimeoutMs,
      });

      const block = plan?.systemTransform;
      if (!block) {
        return;
      }

      const rendered = `${block.title}\n${block.content}`;
      if (output.system.some((entry) => entry.includes(rendered))) {
        return;
      }

      output.system.push(rendered);
    },

    'experimental.chat.messages.transform': async (_input, output) => {
      if (!MESSAGES_TRANSFORM_ENABLED) {
        return;
      }

      const anchor = output.messages.at(-1);
      if (!isMessageAnchorLike(anchor)) {
        return;
      }

      if (hasUnsafeMessageTransformParts(anchor.parts)) {
        return;
      }

      const plan = await loadTransportPlan({
        projectDir,
        sessionID: anchor.info.sessionID,
        specFolder: options.specFolder,
        cacheTtlMs: options.cacheTtlMs,
        nodeBinary: options.nodeBinary,
        bridgeTimeoutMs: options.bridgeTimeoutMs,
      });

      if (!plan || plan.messagesTransform.length === 0) {
        return;
      }

      for (const block of plan.messagesTransform) {
        if (hasSyntheticTextPartMarker(anchor.parts, SYNTHETIC_METADATA_KEY, block.dedupeKey)) {
          continue;
        }

        const part = createSyntheticTextPart({
          id: `${PLUGIN_ID}-${randomUUID().replace(/-/g, '').slice(0, 12)}`,
          sessionID: anchor.info.sessionID,
          messageID: anchor.info.id,
          text: `${block.title}\n${block.content}`,
          metadata: {
            [SYNTHETIC_METADATA_KEY]: block.dedupeKey,
          },
        });

        if (!part) {
          continue;
        }

        anchor.parts.push(part);
      }
    },

    'experimental.session.compacting': async (input, output) => {
      const plan = await loadTransportPlan({
        projectDir,
        sessionID: input.sessionID,
        specFolder: options.specFolder,
        cacheTtlMs: options.cacheTtlMs,
        nodeBinary: options.nodeBinary,
        bridgeTimeoutMs: options.bridgeTimeoutMs,
      });

      const block = plan?.compaction;
      if (!block) {
        return;
      }

      const rendered = `${block.title}\n${block.content}`;
      if (output.context.some((entry) => entry.includes(rendered))) {
        return;
      }

      output.context.push(rendered);
    },
  };
}

exec
/bin/zsh -lc "sed -n '1,260p' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "sed -n '1,260p' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,280p' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Session Bootstrap Handler
// ───────────────────────────────────────────────────────────────
// Phase 024 / Item 7: Composite tool that runs session_resume
// + session_health in one call, merging results with hints.

import { handleSessionResume } from './session-resume.js';
import type { CachedSessionSummaryDecision } from './session-resume.js';
import { handleSessionHealth } from './session-health.js';
import { recordBootstrapEvent } from '../lib/session/context-metrics.js';
import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import {
  attachStructuralTrustFields,
  buildStructuralContextTrust,
  createSharedPayloadEnvelope,
  summarizeUnknown,
  summarizeCertaintyContract,
  trustStateFromStructuralStatus,
  type SharedPayloadCertainty,
  type SharedPayloadEnvelope,
  type SharedPayloadSection,
  StructuralTrustPayloadError,
  type StructuralTrust,
} from '../lib/context/shared-payload.js';
import {
  buildOpenCodeTransportPlan,
  coerceSharedPayloadEnvelope,
  type OpenCodeTransportPlan,
} from '../lib/context/opencode-transport.js';
import {
  buildCodeGraphOpsContract,
  type CodeGraphOpsContract,
} from '../lib/code-graph/ops-hardening.js';
import type { MCPResponse } from '@spec-kit/shared/types';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

interface SessionBootstrapArgs {
  specFolder?: string;
}

interface SessionBootstrapResult {
  resume: Record<string, unknown>;
  health: Record<string, unknown>;
  cachedSummary?: CachedSessionSummaryDecision;
  structuralContext?: StructuralBootstrapContract & StructuralTrust;
  structuralRoutingNudge?: {
    advisory: true;
    readiness: 'ready';
    preferredTool: 'code_graph_query';
    message: string;
    preservesAuthority: 'session_bootstrap';
  };
  payloadContract?: SharedPayloadEnvelope;
  opencodeTransport?: OpenCodeTransportPlan;
  graphOps?: CodeGraphOpsContract;
  hints: string[];
  nextActions: string[];
}

/* ───────────────────────────────────────────────────────────────
   2. HELPERS
──────────────────────────────────────────────────────────────── */

function extractData(response: MCPResponse): Record<string, unknown> {
  try {
    const text = response?.content?.[0]?.text;
    if (typeof text === 'string') {
      const parsed = JSON.parse(text);
      return parsed?.data ?? parsed ?? {};
    }
  } catch { /* parse failed */ }
  return {};
}

function extractHints(data: Record<string, unknown>): string[] {
  if (Array.isArray(data.hints)) return data.hints as string[];
  return [];
}

function extractCachedSummary(
  data: Record<string, unknown>,
): CachedSessionSummaryDecision | null {
  const candidate = data.cachedSummary;
  if (candidate && typeof candidate === 'object') {
    return candidate as CachedSessionSummaryDecision;
  }
  return null;
}

function buildNextActions(
  resumeData: Record<string, unknown>,
  healthData: Record<string, unknown>,
  structuralContext: StructuralBootstrapContract,
): string[] {
  const nextActions = new Set<string>();

  if (resumeData.error) {
    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
  }

  if (healthData.error) {
    nextActions.add('Call `session_health()` directly to inspect the current health-check failure.');
  }

  if (structuralContext.recommendedAction) {
    nextActions.add(structuralContext.recommendedAction);
  }

  if (structuralContext.status === 'ready') {
    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
  } else if (structuralContext.status === 'stale') {
    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
  } else {
    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
  }

  const healthStatus = typeof healthData.status === 'string' ? healthData.status : null;
  if (healthStatus === 'warning' || healthStatus === 'stale') {
    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
  }

  return [...nextActions].slice(0, 3);
}

function extractStructuralTrustFromPayload(
  payload: SharedPayloadEnvelope | null,
): StructuralTrust | null {
  if (!payload) {
    return null;
  }

  const structuralSection = payload.sections.find((section) =>
    section.key === 'structural-context' && section.structuralTrust,
  );

  return structuralSection?.structuralTrust ?? null;
}

function buildStructuralRoutingNudge(
  structuralContext: StructuralBootstrapContract,
): SessionBootstrapResult['structuralRoutingNudge'] | null {
  if (structuralContext.status !== 'ready') {
    return null;
  }

  return {
    advisory: true,
    readiness: 'ready',
    preferredTool: 'code_graph_query',
    message: 'Advisory only: when the next question is about callers, imports, dependencies, or outline, prefer `code_graph_query` before Grep or Glob.',
    preservesAuthority: 'session_bootstrap',
  };
}

/* ───────────────────────────────────────────────────────────────
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

codex
The next pass is narrowing from “interesting differences” to “adoption candidates we could realistically integrate.” I’m now tracing the exact internal hooks for always-in-context memories, existing scoped retrieval, and readiness-aware compaction so the recommendations reflect what Public already has versus what would require a new surface.
exec
/bin/zsh -lc "sed -n '1180,1320p' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
 * Scans for files with _pending suffix (created when index failed after file write)
 * and attempts to index them.
 */
async function recoverPendingFiles(basePath: string): Promise<PendingRecoveryResult> {
  console.error('[context-server] Checking for pending memory files...');

  try {
    // BUG-028 FIX: Restrict scan to known memory file locations to prevent OOM when scanning large workspaces.
    // P1-002-SCAN: share the same allowed-root expansion that startup indexing uses.
    const existingScanLocations = getPendingRecoveryLocations(basePath);

    // P1 FIX: Wire isCommittedInDb callback so stale pending files are detected at startup.
    // VectorIndex.getDb() is an initializing accessor — always returns a valid DB after initializeDb().
    const database = vectorIndex.getDb();
    const isCommittedInDb = (originalPath: string): boolean => {
      const row = (database.prepare('SELECT 1 FROM memory_index WHERE file_path = ?') as import('better-sqlite3').Statement).get(originalPath);
      return !!row;
    };

    const rawResults = existingScanLocations.flatMap((location) =>
      transactionManager.recoverAllPendingFiles(location, isCommittedInDb)
    );

    // Aggregate per-file results into a summary
    const found = rawResults.length;
    const recovered = rawResults.filter(r => r.recovered).length;
    const failed = found - recovered;

    const recoveryResult: PendingRecoveryResult = {
      found,
      processed: found,
      recovered,
      failed,
      results: rawResults,
    };

    if (recoveryResult.found > 0) {
      console.error(`[context-server] Pending file recovery: ${recoveryResult.recovered} recovered, ${recoveryResult.failed} failed (${recoveryResult.found} total)`);
    } else {
      console.error('[context-server] No pending memory files found');
    }

    return recoveryResult;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[context-server] Pending file recovery error: ${message}`);
    return { found: 0, processed: 0, recovered: 0, failed: 0, results: [] };
  }
}

async function startupScan(basePath: string): Promise<void> {
  if (startupScanInProgress) {
    console.error('[context-server] Startup scan already in progress, skipping');
    return;
  }

  startupScanInProgress = true;
  try {
    console.error('[context-server] Waiting for embedding model to be ready...');
    const modelReady: boolean = await waitForEmbeddingModel(EMBEDDING_MODEL_TIMEOUT_MS);

    if (!modelReady) {
      console.error('[context-server] Startup scan skipped: embedding model not ready');
      console.error('[context-server] Run memory_index_scan manually after model loads');
      return;
    }

    // T107: Recover any pending files from previous failed index operations
    await recoverPendingFiles(basePath);

    console.error('[context-server] Starting background scan for new memory files...');
    const scanRoots = Array.from(
      new Set(
        [basePath, ...ALLOWED_BASE_PATHS]
          .filter((root): root is string => typeof root === 'string' && root.trim().length > 0)
          .map((root) => path.resolve(root))
      )
    );
    const allFiles: string[] = [];
    const seen = new Set<string>();

    for (const root of scanRoots) {
      try {
        const rootFiles = [
          ...memoryParser.findMemoryFiles(root),
          ...memoryIndexDiscovery.findConstitutionalFiles(root),
          ...memoryIndexDiscovery.findSpecDocuments(root),
        ];

        for (const filePath of rootFiles) {
          const resolved = path.resolve(filePath);
          if (!seen.has(resolved)) {
            seen.add(resolved);
            allFiles.push(filePath);
          }
        }
      } catch (_error: unknown) {
        // Non-fatal: skip inaccessible startup roots.
      }
    }

    if (allFiles.length === 0) {
      console.error('[context-server] No memory files found in workspace');
      return;
    }

    console.error(`[context-server] Found ${allFiles.length} memory files, checking for changes...`);
    let indexed = 0, updated = 0, unchanged = 0, failed = 0;

    for (const filePath of allFiles) {
      try {
        const result: IndexResult = await indexSingleFile(filePath, false);
        if (result.status === 'indexed') indexed++;
        else if (result.status === 'updated') updated++;
        else unchanged++;
      } catch (error: unknown) {
        failed++;
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[context-server] Failed to index ${path.basename(filePath)}: ${message}`);
      }
    }

    if (indexed > 0 || updated > 0) {
      console.error(`[context-server] Startup scan: ${indexed} new, ${updated} updated, ${unchanged} unchanged, ${failed} failed`);
    } else {
      console.error(`[context-server] Startup scan: all ${unchanged} files up to date`);
    }

    if (indexed > 0 || updated > 0) {
      try {
        runPostMutationHooks('scan', {
          indexed,
          updated,
          staleDeleted: 0,
          staleDeleteFailed: 0,
          operation: 'startup-scan',
        });
      } catch (_error: unknown) {
        // Non-fatal: startup scan must continue even if invalidation hooks fail.
      }
    }

exec
/bin/zsh -lc "sed -n '1600,1675p' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
      throw new Error(dimValidation.warning ?? 'Embedding dimension mismatch between provider and database');
    } else if (dimValidation.stored) {
      console.error(`[context-server] Embedding dimension validated: ${dimValidation.stored}`);
    }

    const database = vectorIndex.getDb();
    if (!database) {
      throw new Error('Database not initialized after initializeDb(). Cannot start server.');
    }

    try {
      initScoringObservability(database);
      console.error('[context-server] Scoring observability initialized');
    } catch (scoringObsErr: unknown) {
      const message = scoringObsErr instanceof Error ? scoringObsErr.message : String(scoringObsErr);
      console.warn('[context-server] Scoring observability init failed (non-fatal):', message);
    }

    if (isLearnedFeedbackEnabled()) {
      try {
        const migrated = migrateLearnedTriggers(database);
        const isolated = verifyFts5Isolation(database);
        console.error(`[context-server] Learned triggers ready (migrated=${migrated}, fts5Isolated=${isolated})`);
      } catch (learnedErr: unknown) {
        const message = learnedErr instanceof Error ? learnedErr.message : String(learnedErr);
        throw new Error(`[context-server] Learned feedback migration/isolation failed: ${message}`);
      }
    }

    // Check SQLite version meets minimum requirement (3.35.0+)
    checkSqliteVersion(database);

    // T076: Verify WAL mode is active for operational concurrency guarantees.
    const walRow = database.prepare('PRAGMA journal_mode').get() as { journal_mode?: string } | undefined;
    const journalMode = String(walRow?.journal_mode ?? '').toLowerCase();
    if (journalMode !== 'wal') {
      database.pragma('journal_mode = WAL');
      console.warn('[context-server] journal_mode was not WAL; forcing WAL mode');
    }

    const memoryCountRow = database.prepare('SELECT COUNT(*) as cnt FROM memory_index').get() as { cnt?: number } | undefined;
    const memoryCount = Number(memoryCountRow?.cnt ?? 0);
    let projectionCount = 0;
    let projectionTableExists = true;

    try {
      const projectionCountRow = database.prepare('SELECT COUNT(*) as cnt FROM active_memory_projection').get() as { cnt?: number } | undefined;
      projectionCount = Number(projectionCountRow?.cnt ?? 0);
    } catch {
      projectionTableExists = false;
    }

    console.error('[context-server] Startup health: memory_index=%d, active_memory_projection=%d', memoryCount, projectionCount);

    if (memoryCount > 0 && (!projectionTableExists || projectionCount === 0)) {
      const result = runLineageBackfill(database);
      console.error('[context-server] Auto-backfill triggered: %d rows seeded into active_memory_projection', result.seeded);
    }

    if (memoryCount === 0 && projectionCount === 0) {
      console.error('[context-server] WARNING: Database has 0 memories — search will return no results until memories are saved');
    }

    const graphSearchFn = isGraphUnifiedEnabled()
      ? createUnifiedGraphSearchFn(database)
      : null;

    checkpointsLib.init(database);
    accessTracker.init(database);
    hybridSearch.init(database, vectorIndex.vectorSearch, graphSearchFn);

    // Keep db-state reinitialization wiring aligned with startup search wiring.
    initDbState({ graphSearchFn });
    sessionBoost.init(database);
    causalBoost.init(database);
    registerGlobalRefreshFn(() => {

exec
/bin/zsh -lc "rg -n \"includeConstitutional|constitutional|core|global|sharedSpace|tenantId|userId|lexicalPath|fallbackState|No memories found|progressive disclosure|memory_context|memory_match_triggers|session_transition|retrievalLevel|dual retrieval|community\" '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:27:} from './core/index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:162:  constitutional: unknown[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:676:  const constitutionalCount = Array.isArray(sessionPrimeContext.constitutional)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:677:    ? sessionPrimeContext.constitutional.length
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:685:    `Session priming: loaded ${constitutionalCount} constitutional memories and ${codeGraphState}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1086:              // Results are typically sorted by score (highest first)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1087:              // Remove from end (lowest-scored) until within budget
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1166:        const constDir = path.join(skillDir, entry.name, 'constitutional');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1170:      // Non-fatal: constitutional directory discovery failed
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:13:import { checkDatabaseUpdated } from '../core/index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:20:import { isEmbeddingModelReady } from '../core/index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:13:import { searchCommunities } from '../lib/search/community-search.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:26:  filterByMinQualityScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:52:import { checkDatabaseUpdated, isEmbeddingModelReady, waitForEmbeddingModel } from '../core/index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:122:  attentionScore?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:156:  score?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:181:  tenantId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:182:  userId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:184:  sharedSpaceId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:190:  includeConstitutional?: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:206:  minQualityScore?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:207:  min_quality_score?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:213:  /** Phase B T019: Dual-level retrieval — 'local' (entity), 'global' (community), 'auto' (local + fallback). */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:214:  retrievalLevel?: 'local' | 'global' | 'auto';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:218:// resolveEvalScore, collectEvalChannelsFromRow — now imported from lib/telemetry/eval-channel-tracking.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:362:  if (typeof data.lexicalPath !== 'string' && snapshot) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:363:    data.lexicalPath = snapshot.lexicalPath;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:365:  if (typeof data.fallbackState !== 'string' && snapshot) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:366:    data.fallbackState = snapshot.fallbackState;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:431:// filterByMinQualityScore, resolveQualityThreshold, buildCacheArgs,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:498:    tenantId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:499:    userId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:501:    sharedSpaceId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:507:    includeConstitutional: includeConstitutional = true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:523:    minQualityScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:524:    min_quality_score,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:529:    retrievalLevel: retrievalLevel = 'auto',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:533:  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:535:    tenantId: normalizedScope.tenantId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:536:    userId: normalizedScope.userId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:539:    sharedSpaceId: normalizedScope.sharedSpaceId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:578:  const qualityThreshold = resolveQualityThreshold(minQualityScore, min_quality_score);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:724:    tenantId: normalizedScope.tenantId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:725:    userId: normalizedScope.userId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:727:    sharedSpaceId: normalizedScope.sharedSpaceId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:737:    includeConstitutional,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:781:      tenantId: normalizedScope.tenantId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:782:      userId: normalizedScope.userId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:784:      sharedSpaceId: normalizedScope.sharedSpaceId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:788:      includeConstitutional,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:812:    // Phase B T018/T019: Community search fallback — inject community members on weak results
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:813:    let communityFallbackApplied = false;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:818:      (retrievalLevel === 'global' || retrievalLevel === 'auto')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:822:        (retrievalLevel === 'global') ||
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:823:        (resultsForFormatting.length < 3 && retrievalLevel === 'auto');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:826:          const communityResults = searchCommunities(effectiveQuery, requireDb(), 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:827:          if (communityResults.totalMemberIds.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:828:            // Fetch the actual memory rows for community member IDs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:829:            const memberIds = communityResults.totalMemberIds.slice(0, 20);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:834:                     quality_score, created_at
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:840:              // Mark community-sourced results and assign a base score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:841:              const communityRows = memberRows.map((row) => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:844:                score: 0.45,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:845:                _communityFallback: true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:847:              // Merge: append community results not already in pipeline results
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:849:              const newRows = communityRows.filter((r) => !existingIds.has(r.id));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:852:                communityFallbackApplied = true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:908:        `[memory-search] Lexical capability path '${lexicalCapability.lexicalPath}' (fallbackState: ${lexicalCapability.fallbackState})`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:920:      extraData.lexicalPath = lexicalCapability.lexicalPath;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:921:      extraData.fallbackState = lexicalCapability.fallbackState;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:991:    if (communityFallbackApplied) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:992:      appliedBoosts.communityFallback = { applied: true, retrievalLevel };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1219:      let finalScores: number[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1226:          finalScores = results.map(r => (r.score ?? r.similarity ?? 0) as number);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1233:        scores: finalScores,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1244:          scores: payload.scores,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1361:  filterByMinQualityScore,

exec
/bin/zsh -lc "sed -n '1,220p' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: "CocoIndex Code - Semantic Code Search"
description: "Semantic code search via vector embeddings. CocoIndex Code enables natural-language discovery of code, patterns, and implementations across 28+ languages using a CLI and a single MCP search tool."
trigger_phrases:
  - "semantic search"
  - "cocoindex"
  - "ccc"
  - "find code that"
  - "code search"
  - "vector search"
  - "find similar code"
---

# CocoIndex Code - Semantic Code Search

> Find code by what it does, not what it says: natural-language queries resolved to semantically relevant results across 28+ languages via CLI or a single MCP tool.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. QUICK START](#2-quick-start)
- [3. FEATURES](#3-features)
- [4. STRUCTURE](#4-structure)
- [5. CONFIGURATION](#5-configuration)
- [6. USAGE EXAMPLES](#6-usage-examples)
- [7. TROUBLESHOOTING](#7-troubleshooting)
- [8. FAQ](#8-faq)
- [9. RELATED DOCUMENTS](#9-related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What This Skill Does

CocoIndex Code is a semantic code search tool built on vector embeddings. Where `grep` matches exact characters, CocoIndex Code matches meaning. Ask for "retry logic with exponential backoff" and it returns code that implements that pattern, regardless of how the author named variables or functions. This makes it the right tool when you know what a piece of code does but not where it lives or what it is called.

The skill ships with two access modes. The CLI (`ccc`) is fastest for one-off queries and all index management operations. The MCP server (`ccc mcp`) exposes a single `search` tool that AI agents call directly via stdio transport, integrating semantic search into any tool-calling workflow without leaving the conversation.

Indexing is incremental and daemon-backed. The first run scans and embeds all supported files in the project. Subsequent runs update only changed files. A background daemon starts automatically on the first command, persists across calls, and restarts itself when settings or the binary version change.

### Key Statistics

| Property | Value |
|---|---|
| Version | 1.0.0 |
| MCP tools exposed | 1 (`search`) |
| Supported languages | 28+ |
| Default embedding model | `sentence-transformers/all-MiniLM-L6-v2` (local, no API key) |
| Primary embedding model | `voyage/voyage-code-3` via LiteLLM (1024-dim, requires `VOYAGE_API_KEY`) |
| Vector storage | SQLite via sqlite-vec |
| Chunk size | 1000 chars, 250 char minimum, 150 char overlap |
| Similarity metric | Cosine similarity (0.0 to 1.0) |

### How This Compares

| Tool | Use When | Limitation |
|---|---|---|
| `ccc search` (CocoIndex) | You know what code does but not where it lives | Approximate, needs verification |
| `code_graph_query` | You need exact callers, imports, or structural dependencies | Requires the structural graph to be indexed first |
| `Grep` | You know the exact text, symbol, or regex pattern | Cannot find conceptual matches |
| `Glob` | You know the file name or extension pattern | Cannot search file contents |
| `Read` | You know the exact file path | No search capability |

### Key Features

| Feature | Description |
|---|---|
| Semantic search | Query by concept or intent, not exact text |
| CLI and MCP modes | `ccc` for terminal use, `ccc mcp` for AI agent integration |
| Language filters | `--lang` (CLI) or `languages` (MCP) narrows results by language |
| Path filters | `--path` (CLI) or `paths` (MCP) scopes results to a directory |
| Incremental indexing | Only re-embeds changed files on subsequent runs |
| Daemon architecture | Auto-starts, auto-restarts on version or settings change |
| Spec Kit integration | Companion lifecycle tools (`ccc_status`, `ccc_reindex`, `ccc_feedback`) and code-graph/session integration are available through system-spec-kit |
| Two embedding models | Local (no API key) or cloud (higher quality) |
| 28+ languages | Language-aware chunk splitting preserves function and class boundaries |

In the broader system-spec-kit stack, CocoIndex is the semantic half of a three-system retrieval model: CocoIndex finds conceptually similar code, Code Graph answers structural questions, and session bootstrap surfaces CocoIndex readiness during recovery. The companion lifecycle helpers exposed through system-spec-kit are `ccc_status`, `ccc_reindex`, and `ccc_feedback`.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

**Step 1: Install and verify**

Run the idempotent bootstrap helper. It installs the binary, initializes the project if needed, and reports readiness.

```bash
bash .opencode/skill/mcp-coco-index/scripts/ensure_ready.sh --strict --require-config
```

**Step 2: Build the index**

Run from the project root. The first run scans all supported files and generates embeddings. It takes 1-5 minutes depending on codebase size.

```bash
ccc index
```

**Step 3: Check index status**

Confirm files are indexed before searching.

```bash
ccc status
```

**Step 4: Search**

Run a natural-language query. Add language and path filters to narrow results.

```bash
ccc search "authentication middleware"
ccc search "error handling" --lang typescript
ccc search "database migration" --path "src/**" --limit 5
```

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

CocoIndex Code resolves queries by embedding the natural-language query text and comparing the resulting vector against pre-computed vectors for every code chunk in the index. This means the search engine reads intent, not characters. A query for "graceful shutdown handler" finds code that tears down servers or releases resources, even if the words "graceful", "shutdown", or "handler" never appear in that code.

The two embedding models trade off quality against convenience. The local model (`all-MiniLM-L6-v2`) requires no API key and works offline, making it the right default for most projects. The Voyage Code 3 model produces 1024-dimensional vectors trained specifically on code, and consistently returns higher-quality results for complex queries on large codebases. Switching models requires a full reset and reindex because the vector dimensions are incompatible.

Language and path filters apply after ranking, which means they narrow an already semantically ranked result set rather than replacing semantic ranking with keyword matching. This design keeps the filters fast and the results meaningful. For multi-query agent sessions, set `refresh_index=false` on follow-up calls after the first query has already triggered a refresh. The daemon has a known concurrency issue where simultaneous `refresh_index=true` requests can cause `ComponentContext` errors.

The CLI and MCP interfaces are complementary, not redundant. The CLI handles index management operations (`index`, `status`, `reset`, `init`, `daemon`) that have no MCP equivalents. The MCP server exposes only the `search` tool because index management is a human-initiated operation, not an agent-initiated one. When building an AI workflow that needs semantic search, configure the MCP server and let agents call `search` directly.

### 3.2 FEATURE REFERENCE

**CLI commands**

| Command | Purpose | Key Flags |
|---|---|---|
| `ccc search QUERY` | Semantic search | `--lang`, `--path`, `--limit`, `--offset`, `--refresh` |
| `ccc index` | Build or update the vector index | none |
| `ccc status` | Show index statistics | none |
| `ccc init` | Initialize project (`/.cocoindex_code/`) | `-f` / `--force` |
| `ccc reset` | Reset databases | `--all` (include settings), `-f` (skip prompt) |
| `ccc mcp` | Start MCP server (stdio mode) | none |
| `ccc daemon status` | Show daemon state | none |
| `ccc daemon restart` | Restart daemon | none |
| `ccc daemon stop` | Stop daemon | none |

**MCP tool: `search`**

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `query` | string | Yes | - | Natural-language search query |
| `languages` | list or null | No | null | Filter by programming languages |
| `paths` | list or null | No | null | Filter by file paths |
| `limit` | integer | No | 5 | Maximum number of results to return |
| `offset` | integer | No | 0 | Number of results to skip for pagination |
| `refresh_index` | boolean | No | true | Trigger index refresh before searching |

**CLI vs. MCP parameter differences**

| Concept | CLI | MCP | Note |
|---|---|---|---|
| Language filter | `--lang` (repeatable flag) | `languages` (list) | CLI: one flag per language. MCP: list of strings |
| Path filter | `--path` (single string) | `paths` (list) | CLI: one path. MCP: multiple paths |
| Result limit | `--limit` (default 10) | `limit` (default 5) | Different defaults |
| Index refresh | `--refresh` (default false) | `refresh_index` (default true) | Different defaults |
| Pagination | `--offset` | `offset` (default 0) | Available on both surfaces |

**Embedding models**

| Model | Type | Dimensions | API Key | Best For |
|---|---|---|---|---|
| `sentence-transformers/all-MiniLM-L6-v2` | Local | 384 | None | Offline use, no API dependency |
| `voyage/voyage-code-3` | Cloud via LiteLLM | 1024 | `VOYAGE_API_KEY` | Higher quality code search |

**Similarity score interpretation**

| Score Range | Meaning | Action |
|---|---|---|
| 0.8 - 1.0 | Strong match | Read this first |
| 0.6 - 0.8 | Good match | Worth reviewing |
| 0.4 - 0.6 | Moderate match | Scan for usefulness |
| 0.0 - 0.4 | Weak match | Usually skip |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```text
mcp-coco-index/
  SKILL.md                         AI agent instructions and routing logic
  README.md                        This file
  INSTALL_GUIDE.md                 Installation and initial setup guide
  assets/
    config_templates.md            MCP server configuration examples
  manual_testing_playbook/
    01--core-cli-commands/         Test cases for search, index, status, init, reset
    02--mcp-search-tool/           Test cases for MCP search tool
    ...
  references/
    cross_cli_playbook.md          Safe defaults for multi-query sessions and cross-CLI use
    downstream_adoption_checklist.md  Minimum bundle for sibling-repo rollout
    search_patterns.md             Query writing strategies and filter examples
    settings_reference.md          Embedding model switching and daemon settings

exec
/bin/zsh -lc "sed -n '480,940p' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '640,790p' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
          latencyMs: Date.now() - startedAt,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    });
  });

  const timeoutPromise = new Promise<DispatchGraphContextMeta>((resolve) => {
    timeoutHandle = setTimeout(() => {
      resolve({
        status: 'timeout',
        source: 'tool-dispatch',
        fileCount: filePaths.length,
        filePaths,
        latencyMs: Date.now() - startedAt,
      });
    }, GRAPH_ENRICHMENT_TIMEOUT_MS);
  });

  const graphContext = await Promise.race([buildPromise, timeoutPromise]);
  if (timeoutHandle) {
    clearTimeout(timeoutHandle);
  }
  return graphContext;
}

function injectSessionPrimeHints(
  envelope: Record<string, unknown>,
  meta: Record<string, unknown>,
  sessionPrimeContext: AutoSurfaceResult,
): void {
  const hints = Array.isArray(envelope.hints)
    ? envelope.hints.filter((hint): hint is string => typeof hint === 'string')
    : [];
  envelope.hints = hints;

  const constitutionalCount = Array.isArray(sessionPrimeContext.constitutional)
    ? sessionPrimeContext.constitutional.length
    : 0;
  const codeGraphStatus = sessionPrimeContext.codeGraphStatus;
  const codeGraphState = codeGraphStatus?.status === 'ok'
    ? 'loaded code graph status'
    : 'code graph status unavailable';

  hints.push(
    `Session priming: loaded ${constitutionalCount} constitutional memories and ${codeGraphState}`
  );

  // T018: Include Prime Package hints for non-hook CLIs
  const pkg = sessionPrimeContext.primePackage;
  if (pkg) {
    if (pkg.specFolder) {
      hints.push(`Active spec folder: ${pkg.specFolder}`);
    }
    hints.push(`Code graph: ${pkg.codeGraphStatus}, CocoIndex: ${pkg.cocoIndexAvailable ? 'available' : 'not installed'}`);
    if (pkg.recommendedCalls.length > 0) {
      hints.push(`Recommended next calls: ${pkg.recommendedCalls.join(', ')}`);
    }
  }

  meta.sessionPriming = sessionPrimeContext;
}

async function getMemoryStats(): Promise<DynamicMemoryStats> {
  try {
    const response = await handleMemoryStats({
      folderRanking: 'count',
      includeArchived: true,
      limit: 100,
    });
    const payload = response?.content?.[0]?.text;
    if (typeof payload !== 'string' || payload.length === 0) {
      return { totalMemories: 0, specFolderCount: 0, activeCount: 0, staleCount: 0 };
    }

    const parsed = JSON.parse(payload) as Record<string, unknown>;
    const data = (parsed.data ?? {}) as Record<string, unknown>;
    const byStatus = (data.byStatus ?? {}) as Record<string, unknown>;
    const topFolders = Array.isArray(data.topFolders) ? data.topFolders : [];
    const success = typeof byStatus.success === 'number' ? byStatus.success : 0;
    const pending = typeof byStatus.pending === 'number' ? byStatus.pending : 0;
    const failed = typeof byStatus.failed === 'number' ? byStatus.failed : 0;
    const retry = typeof byStatus.retry === 'number' ? byStatus.retry : 0;
    const totalSpecFolders = typeof data.totalSpecFolders === 'number'
      ? data.totalSpecFolders
      : topFolders.length;

    return {
      totalMemories: typeof data.totalMemories === 'number' ? data.totalMemories : 0,
      specFolderCount: totalSpecFolders,
      activeCount: success,
      staleCount: pending + failed + retry,
    };
  } catch (_error: unknown) {
    return { totalMemories: 0, specFolderCount: 0, activeCount: 0, staleCount: 0 };
  }
}

// (CHK-076): Instructions are computed once at startup and NOT refreshed during the session.
// This is by design — instruction updates require MCP protocol re-negotiation which most clients
// Don't support. If index changes significantly, restart the server to refresh instructions.
async function buildServerInstructions(): Promise<string> {
  if (!isDynamicInitEnabled()) {
    return '';
  }

  const stats = await getMemoryStats();
  const channels: string[] = ['vector', 'fts5'];
  if (bm25Index.isBm25Enabled()) channels.push('bm25');
  if (isGraphUnifiedEnabled()) channels.push('graph');
  if (isDegreeBoostEnabled()) channels.push('degree');
  const staleWarning = stats.staleCount > 10
    ? ` Warning: ${stats.staleCount} stale memories detected. Consider running memory_index_scan.`
    : '';

  const lines = [
    `Spec Kit Memory MCP has ${stats.totalMemories} indexed memories across ${stats.specFolderCount} spec folders.`,
    `Active memories: ${stats.activeCount}. Stale memories: ${stats.staleCount}.`,
    `Search channels: ${channels.join(', ')}.`,
    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
    staleWarning.trim(),
  ];

  // Phase 024 / Item 4: Session recovery digest from session-snapshot
  try {
    const { getSessionSnapshot } = await import('./lib/session/session-snapshot.js');
    const snap = getSessionSnapshot();
    const hasData = snap.specFolder || snap.graphFreshness !== 'error' || snap.sessionQuality !== 'unknown';
    if (hasData) {
      const recommended = !snap.primed ? 'call session_bootstrap()' :
        snap.graphFreshness === 'empty' ? 'run code_graph_scan' :
        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
      lines.push('');
      lines.push('## Session Recovery');
      lines.push(`- Last spec folder: ${snap.specFolder || 'none'}`);
      lines.push(`- Code graph: ${snap.graphFreshness}`);
      lines.push(`- Session quality: ${snap.sessionQuality}`);
      lines.push(`- Recommended: ${recommended}`);
    }
  } catch { /* session-snapshot not available — skip digest */ }

  // Phase 027: Structural bootstrap guidance for non-hook runtimes
  lines.push('');
  lines.push('## Structural Bootstrap (Phase 027)');
  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
  lines.push('- If structural context shows "ready": code_graph_query is available for structural lookups');
  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');

  // Phase 024: Tool routing decision tree

 succeeded in 0ms:
──────────────────────────────────────────────────────────────── */

/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
 * @param args - Search arguments (query, concepts, mode, specFolder, etc.)
 * @returns MCP response with ranked search results
 */
async function handleMemorySearch(args: SearchArgs): Promise<MCPResponse> {
  const _searchStartTime = Date.now();
  resetLastLexicalCapabilitySnapshot();
  // BUG-001: Check for external database updates before processing
  await checkDatabaseUpdated();

  const {
    cursor,
    query,
    concepts,
    specFolder,
    folderBoost,
    tenantId,
    userId,
    agentId,
    sharedSpaceId,
    limit: rawLimit = 10,
    tier,
    contextType,
    useDecay: useDecay = true,
    includeContiguity: includeContiguity = false,
    includeConstitutional: includeConstitutional = true,
    includeContent: includeContent = false,
    anchors,
    bypassCache: bypassCache = false,
    sessionId,
    enableDedup: enableDedup = true,
    intent: explicitIntent,
    autoDetectIntent: autoDetectIntent = true,
    minState,  // No default — memoryState column not yet in schema; defaulting to 'WARM' filters all rows
    applyStateLimits: applyStateLimits = false,
    rerank = true, // Enable reranking by default for better result quality
    applyLengthPenalty: applyLengthPenalty = true,
    trackAccess: trackAccess = false, // opt-in, off by default
    includeArchived: includeArchived = false, // REQ-206: exclude archived by default
    enableSessionBoost: enableSessionBoost = isSessionBoostEnabled(),
    enableCausalBoost: enableCausalBoost = isCausalBoostEnabled(),
    minQualityScore,
    min_quality_score,
    mode,
    includeTrace: includeTraceArg = false,
    sessionTransition,
    profile,
    retrievalLevel: retrievalLevel = 'auto',
  } = args;
  const includeTraceByFlag = process.env.SPECKIT_RESPONSE_TRACE === 'true';
  const includeTrace = includeTraceByFlag || includeTraceArg === true;
  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
  const progressiveScopeKey = JSON.stringify({
    tenantId: normalizedScope.tenantId ?? null,
    userId: normalizedScope.userId ?? null,
    agentId: normalizedScope.agentId ?? null,
    sessionId: normalizedScope.sessionId ?? null,
    sharedSpaceId: normalizedScope.sharedSpaceId ?? null,
  });

  // Validate at least one search input is provided (moved from schema superRefine for GPT compatibility)
  const hasCursor = typeof cursor === 'string' && cursor.trim().length > 0;
  const hasQuery = typeof query === 'string' && query.trim().length > 0;
  const hasConcepts = Array.isArray(concepts) && concepts.length >= 2;
  if (!hasCursor && !hasQuery && !hasConcepts) {
    return { content: [{ type: 'text', text: JSON.stringify({ error: 'Either "query" (string), "concepts" (array with 2-5 items), or "cursor" (string) is required.' }) }] };
  }

  if (hasCursor) {
    const resolved = resolveCursor(cursor.trim(), undefined, { scopeKey: progressiveScopeKey });
    if (!resolved) {
      return createMCPErrorResponse({
        tool: 'memory_search',
        error: 'Cursor is invalid, expired, or out of scope',
        code: 'E_VALIDATION',
        details: { parameter: 'cursor' },
        recovery: {
          hint: 'Retry the original search to generate a fresh continuation cursor',
        },
      });
    }

    const snippetResults = extractSnippets(resolved.results);
    return createMCPSuccessResponse({
      tool: 'memory_search',
      summary: `Returned ${snippetResults.length} continuation results`,
      data: {
        count: snippetResults.length,
        results: snippetResults,
        continuation: resolved.continuation,
      },
      startTime: _searchStartTime,
      cacheHit: false,
    });
  }

  const qualityThreshold = resolveQualityThreshold(minQualityScore, min_quality_score);

  // Validate numeric limit parameter
  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
    ? Math.min(Math.floor(rawLimit), 100)
    : 10;

  // BUG-007: Validate query first with proper error handling
  let normalizedQuery: string | null = null;
  if (query !== undefined) {
    try {
      normalizedQuery = validateQuery(query);
    } catch (validationError: unknown) {
      if (!concepts || !Array.isArray(concepts) || concepts.length < 2) {
        const message = toErrorMessage(validationError);
        return createMCPErrorResponse({
          tool: 'memory_search',
          error: message,
          code: 'E_VALIDATION',
          details: { parameter: 'query' },
          recovery: {
            hint: 'Provide a valid query string or use concepts array instead'
          }
        });
      }
      normalizedQuery = null;
    }
  }

  const hasValidQuery = normalizedQuery !== null;
  const hasValidConcepts = Array.isArray(concepts) && concepts.length >= 2;
  const effectiveQuery = normalizedQuery ?? (hasValidConcepts ? concepts.join(', ') : '');

  if (!hasValidQuery && !hasValidConcepts) {
    return createMCPErrorResponse({
      tool: 'memory_search',
      error: 'Either query (string), concepts (array of 2-5 strings), or cursor (string) is required',
      code: 'E_VALIDATION',
      details: { parameter: 'query' },
      recovery: {
        hint: 'Provide a query string, concepts array with 2-5 entries, or a continuation cursor'
      }
    });
  }

  if (specFolder !== undefined && typeof specFolder !== 'string') {
    return createMCPErrorResponse({
      tool: 'memory_search',
      error: 'specFolder must be a string',
      code: 'E_VALIDATION',
      details: { parameter: 'specFolder' },
      recovery: {
        hint: 'Provide specFolder as a string path'
      }
    });
  }

  // Eval logger — capture query at pipeline entry (fail-safe)
  let _evalQueryId = 0;
  let _evalRunId = 0;
  try {
    const evalEntry = logSearchQuery({
      query: effectiveQuery,
      intent: explicitIntent ?? null,
      specFolder: specFolder ?? null,
    });
    _evalQueryId = evalEntry.queryId;
    _evalRunId = evalEntry.evalRunId;
  } catch (_error: unknown) { /* eval logging must never break search */ }

  const artifactRoutingQuery = resolveArtifactRoutingQuery(
    normalizedQuery,
    hasValidConcepts ? concepts : undefined
  );
  let artifactRouting = getStrategyForQuery(artifactRoutingQuery, specFolder);

  // Intent-aware retrieval
  let detectedIntent: string | null = null;
  let intentConfidence = 0;
  let intentWeights: IntentWeights | null = null;

  if (explicitIntent) {
    if (intentClassifier.isValidIntent(explicitIntent)) {
      detectedIntent = explicitIntent;
      intentConfidence = 1.0;
      intentWeights = intentClassifier.getIntentWeights(explicitIntent);
    } else {
      console.warn(`[memory-search] Invalid intent '${explicitIntent}', using auto-detection`);
    }
  }

  if (!detectedIntent && autoDetectIntent && hasValidQuery) {
    const classification: IntentClassification = intentClassifier.classifyIntent(normalizedQuery!);
    detectedIntent = classification.intent;
    intentConfidence = classification.confidence;
    intentWeights = intentClassifier.getIntentWeights(classification.intent as IntentType);

    if (classification.fallback) {
      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (fallback: ${classification.reason})`);
    } else {
      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (confidence: ${intentConfidence.toFixed(2)})`);
    }
  }

  // FIX RC3-B: Intent confidence floor — override low-confidence auto-detections to "understand"
  const INTENT_CONFIDENCE_FLOOR = parseFloat(process.env.SPECKIT_INTENT_CONFIDENCE_FLOOR || '0.25');
  if (detectedIntent && intentConfidence < INTENT_CONFIDENCE_FLOOR && !explicitIntent) {
    console.error(`[memory-search] Intent confidence ${intentConfidence.toFixed(3)} below floor ${INTENT_CONFIDENCE_FLOOR}, overriding '${detectedIntent}' → 'understand'`);
    detectedIntent = 'understand';
    intentConfidence = 1.0;
    intentWeights = intentClassifier.getIntentWeights('understand' as IntentType);
  }

  // Phase C: Intent-to-profile auto-routing.
  // Explicit caller `profile` always takes precedence; auto-detect fills in when absent.
  let effectiveProfile: string | undefined = profile;
  if (!effectiveProfile && detectedIntent && isIntentAutoProfileEnabled()) {
    try {
      const autoProfile = intentClassifier.getProfileForIntent(detectedIntent as IntentType);
      if (autoProfile) {
        effectiveProfile = autoProfile;
        console.error(`[memory-search] Intent-to-profile auto-routing: '${detectedIntent}' → profile '${autoProfile}'`);
      }
    } catch (_autoProfileErr: unknown) {
      // Auto-profile is best-effort — never breaks search
    }
  }

  // Re-run artifact routing with detected intent for fallback coverage
  if (detectedIntent && artifactRouting?.detectedClass === 'unknown' && artifactRouting?.confidence === 0) {
    artifactRouting = getStrategyForQuery(artifactRoutingQuery, specFolder, detectedIntent);
  }

  // Create retrieval trace at pipeline entry
  const trace = createTrace(
    effectiveQuery,
    sessionId,
    detectedIntent || undefined
  );

  // Build cache key args
  const cacheArgs = buildCacheArgs({
    normalizedQuery,
    hasValidConcepts,
    concepts,
    specFolder,
    tenantId: normalizedScope.tenantId,
    userId: normalizedScope.userId,
    agentId: normalizedScope.agentId,
    sharedSpaceId: normalizedScope.sharedSpaceId,
    limit,
    mode,
    tier,
    contextType,
    useDecay,
    includeArchived,
    qualityThreshold,
    applyStateLimits,
    includeContiguity,
    includeConstitutional,
    includeContent,
    anchors,
    detectedIntent,
    minState: minState ?? '',
    rerank,
    applyLengthPenalty,
    sessionId,
    enableSessionBoost,
    enableCausalBoost,
    includeTrace,
  });

  let _evalChannelPayloads: EvalChannelPayload[] = [];
  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
  const cacheEnabled = toolCache.isEnabled() && !bypassCache;
  const cachedPayload = cacheEnabled
    ? toolCache.get<SearchCachePayload>(cacheKey)
    : null;

  let responseToReturn: MCPResponse;
  let goalRefinementPayload: Record<string, unknown> | null = null;

  if (cachedPayload) {
    responseToReturn = buildSearchResponseFromPayload(cachedPayload, _searchStartTime, true);
  } else {
    // Wait for embedding model only on cache miss
    if (!isEmbeddingModelReady()) {
      const modelReady = await waitForEmbeddingModel(30000);
      if (!modelReady) {
        throw new Error('Embedding model not ready after 30s timeout. Try again later.');
      }
    }

    // V2 pipeline is the only path (legacy V1 removed from the runtime pipeline)
    const pipelineConfig: PipelineConfig = {
      query: effectiveQuery,
      concepts: hasValidConcepts ? concepts : undefined,
      searchType: (hasValidConcepts && concepts!.length >= 2)
        ? 'multi-concept'
        : 'hybrid',
      mode,
      limit,
      specFolder,
      tenantId: normalizedScope.tenantId,
      userId: normalizedScope.userId,
      agentId: normalizedScope.agentId,
      sharedSpaceId: normalizedScope.sharedSpaceId,
      tier,
      contextType,
      includeArchived,
      includeConstitutional,
      includeContent,
      anchors,
      qualityThreshold,
      minState: minState ?? '',
      applyStateLimits,
      useDecay,
      rerank,
      applyLengthPenalty,
      sessionId,
      enableDedup,
      enableSessionBoost,
      enableCausalBoost,
      trackAccess,
      detectedIntent,
      intentConfidence,
      intentWeights: toIntentWeightsConfig(intentWeights),
      artifactRouting: artifactRouting as unknown as PipelineConfig['artifactRouting'],
      trace,
    };

    const pipelineResult: PipelineResult = await executePipeline(pipelineConfig);
    let resultsForFormatting = pipelineResult.results as unknown as SessionAwareResult[];

    // Phase B T018/T019: Community search fallback — inject community members on weak results
    let communityFallbackApplied = false;
    const shouldRunCommunitySearch = (
      isDualRetrievalEnabled() &&
      isCommunitySearchFallbackEnabled() &&
      effectiveQuery.length > 0 &&
      (retrievalLevel === 'global' || retrievalLevel === 'auto')
    );
    if (shouldRunCommunitySearch) {
      const isWeakResult = resultsForFormatting.length === 0 ||
        (retrievalLevel === 'global') ||
        (resultsForFormatting.length < 3 && retrievalLevel === 'auto');
      if (isWeakResult) {
        try {
          const communityResults = searchCommunities(effectiveQuery, requireDb(), 5);
          if (communityResults.totalMemberIds.length > 0) {
            // Fetch the actual memory rows for community member IDs
            const memberIds = communityResults.totalMemberIds.slice(0, 20);
            const placeholders = memberIds.map(() => '?').join(', ');
            const db = requireDb();
            const memberRows = db.prepare(`
              SELECT id, title, similarity, content, file_path, importance_tier, context_type,
                     quality_score, created_at
              FROM memory_index
              WHERE id IN (${placeholders})
            `).all(...memberIds) as Array<Record<string, unknown> & { id: number }>;

            if (memberRows.length > 0) {
              // Mark community-sourced results and assign a base score
              const communityRows = memberRows.map((row) => ({
                ...row,
                similarity: typeof row.similarity === 'number' ? row.similarity : 0.5,
                score: 0.45,
                _communityFallback: true,
              }));
              // Merge: append community results not already in pipeline results
              const existingIds = new Set(resultsForFormatting.map((r) => (r as Record<string, unknown>).id as number));
              const newRows = communityRows.filter((r) => !existingIds.has(r.id));
              if (newRows.length > 0) {
                resultsForFormatting = [...resultsForFormatting, ...newRows as unknown as SessionAwareResult[]];
                communityFallbackApplied = true;
              }
            }
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          console.warn(`[memory-search] Community search fallback failed (fail-open): ${msg}`);
        }
      }
    }

    // Fix 4 (RC1-B): Apply folder boost — multiply similarity for results matching discovered folder
    if (folderBoost && folderBoost.folder && folderBoost.factor > 1) {
      let boostedCount = 0;
      for (const r of resultsForFormatting) {
        const filePath = (r as Record<string, unknown>).file_path as string | undefined;
        if (filePath && filePath.includes(folderBoost.folder)) {
          const raw = (r as Record<string, unknown>);
          if (typeof raw.similarity === 'number') {
            raw.similarity = Math.min(raw.similarity * folderBoost.factor, 1.0);
            boostedCount++;
          }
        }
      }
      // Re-sort by similarity after boosting
      if (boostedCount > 0) {
        resultsForFormatting.sort((a, b) => {
          const sa = (a as Record<string, unknown>).similarity as number ?? 0;
          const sb = (b as Record<string, unknown>).similarity as number ?? 0;
          return sb - sa;
        });
      }
    }

    if (sessionId && isSessionRetrievalStateEnabled()) {
      const activeGoal = effectiveQuery.trim().length > 0 ? effectiveQuery : null;
      if (activeGoal) {
        retrievalSessionStateManager.updateGoal(sessionId, activeGoal);
      }
      if (Array.isArray(anchors) && anchors.length > 0) {
        retrievalSessionStateManager.setAnchors(sessionId, anchors);
      }

      const goalRefinement = refineForGoal(resultsForFormatting, sessionId);
      resultsForFormatting = goalRefinement.results as SessionAwareResult[];
      goalRefinementPayload = {
        activeGoal: goalRefinement.metadata.activeGoal,
        applied: goalRefinement.metadata.refined,
        boostedCount: goalRefinement.metadata.boostedCount,
      };
    }

    // Build extra data from pipeline metadata for response formatting
    const lexicalCapability = getLastLexicalCapabilitySnapshot();
    if (lexicalCapability) {
      console.error(
        `[memory-search] Lexical capability path '${lexicalCapability.lexicalPath}' (fallbackState: ${lexicalCapability.fallbackState})`
      );
    }

    const extraData: Record<string, unknown> = {
      stateStats: pipelineResult.annotations.stateStats,
      featureFlags: {
        ...pipelineResult.annotations.featureFlags,
      },
      pipelineMetadata: pipelineResult.metadata,
    };
    if (lexicalCapability) {
      extraData.lexicalPath = lexicalCapability.lexicalPath;
      extraData.fallbackState = lexicalCapability.fallbackState;
    }

    if (pipelineResult.annotations.evidenceGapWarning) {
      extraData.evidenceGapWarning = pipelineResult.annotations.evidenceGapWarning;
    }

    if (detectedIntent) {
      extraData.intent = {
        type: detectedIntent,
        confidence: intentConfidence,
        description: intentClassifier.getIntentDescription(detectedIntent as IntentType),
        weightsApplied: pipelineResult.metadata.stage2.intentWeightsApplied,
      };
    }

    if (artifactRouting) {
      extraData.artifactRouting = artifactRouting;
      extraData.artifact_routing = artifactRouting;
    }

exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts' | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md' | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
I have enough evidence now to stop doing broad comparison and focus on the five most plausible transfers. I’m pulling line-numbered slices for the current Public behavior so each feasibility call is grounded in exact code rather than inferred architecture.
exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js' | sed -n '180,430p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts' | sed -n '480,1035p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
  1021	    }
  1022	
  1023	    if (isProgressiveDisclosureEnabled()) {
  1024	      const parsedFormatted = parseResponseEnvelope(formatted);
  1025	      if (parsedFormatted) {
  1026	        const data = parsedFormatted.envelope.data && typeof parsedFormatted.envelope.data === 'object'
  1027	          ? parsedFormatted.envelope.data as Record<string, unknown>
  1028	          : {};
  1029	        data.progressiveDisclosure = buildProgressiveResponse(
  1030	          resultsForFormatting,
  1031	          undefined,
  1032	          effectiveQuery,
  1033	          { scopeKey: progressiveScopeKey },
  1034	        );
  1035	        parsedFormatted.envelope.data = data;

exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts' | sed -n '670,780p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts' | sed -n '1230,1325p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1230	async function startupScan(basePath: string): Promise<void> {
  1231	  if (startupScanInProgress) {
  1232	    console.error('[context-server] Startup scan already in progress, skipping');
  1233	    return;
  1234	  }
  1235	
  1236	  startupScanInProgress = true;
  1237	  try {
  1238	    console.error('[context-server] Waiting for embedding model to be ready...');
  1239	    const modelReady: boolean = await waitForEmbeddingModel(EMBEDDING_MODEL_TIMEOUT_MS);
  1240	
  1241	    if (!modelReady) {
  1242	      console.error('[context-server] Startup scan skipped: embedding model not ready');
  1243	      console.error('[context-server] Run memory_index_scan manually after model loads');
  1244	      return;
  1245	    }
  1246	
  1247	    // T107: Recover any pending files from previous failed index operations
  1248	    await recoverPendingFiles(basePath);
  1249	
  1250	    console.error('[context-server] Starting background scan for new memory files...');
  1251	    const scanRoots = Array.from(
  1252	      new Set(
  1253	        [basePath, ...ALLOWED_BASE_PATHS]
  1254	          .filter((root): root is string => typeof root === 'string' && root.trim().length > 0)
  1255	          .map((root) => path.resolve(root))
  1256	      )
  1257	    );
  1258	    const allFiles: string[] = [];
  1259	    const seen = new Set<string>();
  1260	
  1261	    for (const root of scanRoots) {
  1262	      try {
  1263	        const rootFiles = [
  1264	          ...memoryParser.findMemoryFiles(root),
  1265	          ...memoryIndexDiscovery.findConstitutionalFiles(root),
  1266	          ...memoryIndexDiscovery.findSpecDocuments(root),
  1267	        ];
  1268	
  1269	        for (const filePath of rootFiles) {
  1270	          const resolved = path.resolve(filePath);
  1271	          if (!seen.has(resolved)) {
  1272	            seen.add(resolved);
  1273	            allFiles.push(filePath);
  1274	          }
  1275	        }
  1276	      } catch (_error: unknown) {
  1277	        // Non-fatal: skip inaccessible startup roots.
  1278	      }
  1279	    }
  1280	
  1281	    if (allFiles.length === 0) {
  1282	      console.error('[context-server] No memory files found in workspace');
  1283	      return;
  1284	    }
  1285	
  1286	    console.error(`[context-server] Found ${allFiles.length} memory files, checking for changes...`);
  1287	    let indexed = 0, updated = 0, unchanged = 0, failed = 0;
  1288	
  1289	    for (const filePath of allFiles) {
  1290	      try {
  1291	        const result: IndexResult = await indexSingleFile(filePath, false);
  1292	        if (result.status === 'indexed') indexed++;
  1293	        else if (result.status === 'updated') updated++;
  1294	        else unchanged++;
  1295	      } catch (error: unknown) {
  1296	        failed++;
  1297	        const message = error instanceof Error ? error.message : String(error);
  1298	        console.error(`[context-server] Failed to index ${path.basename(filePath)}: ${message}`);
  1299	      }
  1300	    }
  1301	
  1302	    if (indexed > 0 || updated > 0) {
  1303	      console.error(`[context-server] Startup scan: ${indexed} new, ${updated} updated, ${unchanged} unchanged, ${failed} failed`);
  1304	    } else {
  1305	      console.error(`[context-server] Startup scan: all ${unchanged} files up to date`);
  1306	    }
  1307	
  1308	    if (indexed > 0 || updated > 0) {
  1309	      try {
  1310	        runPostMutationHooks('scan', {
  1311	          indexed,
  1312	          updated,
  1313	          staleDeleted: 0,
  1314	          staleDeleteFailed: 0,
  1315	          operation: 'startup-scan',
  1316	        });
  1317	      } catch (_error: unknown) {
  1318	        // Non-fatal: startup scan must continue even if invalidation hooks fail.
  1319	      }
  1320	    }
  1321	
  1322	    // Log atomicity metrics for monitoring (CHK-190)
  1323	    const metrics = transactionManager.getMetrics();
  1324	    if (metrics.totalRecoveries > 0 || metrics.totalErrors > 0) {
  1325	      console.error(`[context-server] Atomicity metrics: ${metrics.totalAtomicWrites} successful, ${metrics.totalErrors} failed, ${metrics.totalRecoveries} recovered`);

exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts' | sed -n '1630,1675p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts' | sed -n '90,170p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    90	  }
    91	  return null;
    92	}
    93	
    94	function buildNextActions(
    95	  resumeData: Record<string, unknown>,
    96	  healthData: Record<string, unknown>,
    97	  structuralContext: StructuralBootstrapContract,
    98	): string[] {
    99	  const nextActions = new Set<string>();
   100	
   101	  if (resumeData.error) {
   102	    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
   103	  }
   104	
   105	  if (healthData.error) {
   106	    nextActions.add('Call `session_health()` directly to inspect the current health-check failure.');
   107	  }
   108	
   109	  if (structuralContext.recommendedAction) {
   110	    nextActions.add(structuralContext.recommendedAction);
   111	  }
   112	
   113	  if (structuralContext.status === 'ready') {
   114	    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
   115	  } else if (structuralContext.status === 'stale') {
   116	    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
   117	  } else {
   118	    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
   119	  }
   120	
   121	  const healthStatus = typeof healthData.status === 'string' ? healthData.status : null;
   122	  if (healthStatus === 'warning' || healthStatus === 'stale') {
   123	    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
   124	  }
   125	
   126	  return [...nextActions].slice(0, 3);
   127	}
   128	
   129	function extractStructuralTrustFromPayload(
   130	  payload: SharedPayloadEnvelope | null,
   131	): StructuralTrust | null {
   132	  if (!payload) {
   133	    return null;
   134	  }
   135	
   136	  const structuralSection = payload.sections.find((section) =>
   137	    section.key === 'structural-context' && section.structuralTrust,
   138	  );
   139	
   140	  return structuralSection?.structuralTrust ?? null;
   141	}
   142	
   143	function buildStructuralRoutingNudge(
   144	  structuralContext: StructuralBootstrapContract,
   145	): SessionBootstrapResult['structuralRoutingNudge'] | null {
   146	  if (structuralContext.status !== 'ready') {
   147	    return null;
   148	  }
   149	
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

codex
I’m doing one final evidence pass for the write-side semantics so the “core memory” and “thin plugin facade” candidates are judged against the current save/update contracts, not just the read path. After that I’ll synthesize the five candidates with explicit effort calls.
exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json' | sed -n '1,160p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,260p' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Memory Save Handler
// ───────────────────────────────────────────────────────────────
/* --- 1. DEPENDENCIES --- */

// Node built-ins
import { randomUUID } from 'node:crypto';
import * as fs from 'node:fs';
import path from 'path';

// Shared packages
import { validateFilePath } from '@spec-kit/shared/utils/path-security';
import {
  evaluateMemorySufficiency,
  MEMORY_SUFFICIENCY_REJECTION_CODE,
  type MemorySufficiencyResult,
} from '@spec-kit/shared/parsing/memory-sufficiency';
import {
  validateMemoryTemplateContract,
  type MemoryTemplateContractResult,
} from '@spec-kit/shared/parsing/memory-template-contract';
import {
  evaluateSpecDocHealth,
  type SpecDocHealthResult,
} from '@spec-kit/shared/parsing/spec-doc-health';

// Internal modules
import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core/index.js';
import { createFilePathValidator } from '../utils/validators.js';
import * as memoryParser from '../lib/parsing/memory-parser.js';
import * as transactionManager from '../lib/storage/transaction-manager.js';
import * as checkpoints from '../lib/storage/checkpoints.js';
import * as preflight from '../lib/validation/preflight.js';
import { requireDb } from '../utils/index.js';
import type { MCPResponse } from './types.js';
import { createAppendOnlyMemoryRecord, recordLineageVersion } from '../lib/storage/lineage-state.js';
import * as causalEdges from '../lib/storage/causal-edges.js';

import { runQualityGate, isQualityGateEnabled } from '../lib/validation/save-quality-gate.js';
import { isSaveQualityGateEnabled } from '../lib/search/search-flags.js';

import { getCanonicalPathKey } from '../lib/utils/canonical-path.js';
import { findSimilarMemories } from './pe-gating.js';
import { runPostMutationHooks } from './mutation-hooks.js';
import { buildMutationHookFeedback } from '../hooks/mutation-feedback.js';
import { needsChunking, indexChunkedMemoryFile } from './chunking-orchestrator.js';
import { applyPostInsertMetadata } from './save/db-helpers.js';
import { createMemoryRecord, findSamePathExistingMemory, type MemoryScopeMatch } from './save/create-record.js';
import {
  buildGovernancePostInsertFields,
  ensureGovernanceRuntime,
  recordGovernanceAudit,
  validateGovernedIngest,
} from '../lib/governance/scope-governance.js';
import {
  assertSharedSpaceAccess,
  recordSharedConflict,
} from '../lib/collab/shared-spaces.js';
import { delete_memory_from_database } from '../lib/search/vector-index-mutations.js';
import {
  runQualityLoop,
} from './quality-loop.js';
import type {
  QualityLoopResult,
} from './quality-loop.js';

// O2-5/O2-12: V-rule validation (previously only in workflow path)
import {
  validateMemoryQualityContent,
  determineValidationDisposition,
} from './v-rule-bridge.js';

// Save pipeline modules (CR-P2-4 decomposition)
import type {
  IndexResult,
  SaveArgs,
  AtomicSaveParams,
  AtomicSaveOptions,
  AtomicSaveResult,
} from './save/index.js';
import { checkExistingRow, checkContentHashDedup } from './save/dedup.js';
import { generateOrCacheEmbedding, persistPendingEmbeddingCacheWrite } from './save/embedding-pipeline.js';
import { evaluateAndApplyPeDecision } from './save/pe-orchestration.js';
import { runReconsolidationIfEnabled } from './save/reconsolidation-bridge.js';
import { runPostInsertEnrichment } from './save/post-insert.js';
import { buildIndexResult, buildSaveResponse } from './save/response-builder.js';
import { createMCPErrorResponse } from '../lib/response/envelope.js';

// Extracted sub-modules
import { withSpecFolderLock } from './save/spec-folder-mutex.js';
import { buildParsedMemoryEvidenceSnapshot } from './save/markdown-evidence-builder.js';
import {
  applyInsufficiencyMetadata,
  buildInsufficiencyRejectionResult,
  buildTemplateContractRejectionResult,
  buildDryRunSummary,
} from './save/validation-responses.js';

import { markMemorySuperseded } from './pe-gating.js';
import { resolveMemoryReference } from './causal-links-processor.js';
import { refreshAutoEntitiesForMemory } from '../lib/extraction/entity-extractor.js';

// Feature catalog: Memory indexing (memory_save)
// Feature catalog: Verify-fix-verify memory quality loop
// Feature catalog: Dry-run preflight for memory_save
// Feature catalog: Prediction-error save arbitration


// Create local path validator
const validateFilePathLocal = createFilePathValidator(ALLOWED_BASE_PATHS, validateFilePath);
const MANUAL_FALLBACK_SOURCE_CLASSIFICATION = 'manual-fallback' as const;

interface PreparedParsedMemory {
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>;
  validation: ReturnType<typeof memoryParser.validateParsedMemory>;
  qualityLoopResult: QualityLoopResult;
  sufficiencyResult: MemorySufficiencyResult;
  templateContract: MemoryTemplateContractResult;
  specDocHealth: SpecDocHealthResult | null;
  finalizedFileContent: string | null;
  sourceClassification: 'template-generated' | typeof MANUAL_FALLBACK_SOURCE_CLASSIFICATION;
}

type ParsedMemoryWithIndexHints = ReturnType<typeof memoryParser.parseMemoryFile> & {
  _skipIndex?: boolean;
  _vRuleIndexBlockIds?: string[];
};

const STANDARD_MEMORY_TEMPLATE_MARKERS = [
  '## continue session',
  '## recovery hints',
  '<!-- memory metadata -->',
];

class VRuleUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VRuleUnavailableError';
  }
}

function isVRuleUnavailableResult(value: unknown): value is {
  passed: false;
  status: 'error' | 'warning';
  message: string;
  _unavailable: true;
} {
  return typeof value === 'object'
    && value !== null
    && 'passed' in value
    && (value as { passed?: unknown }).passed === false
    && 'status' in value
    && typeof (value as { status?: unknown }).status === 'string'
    && 'message' in value
    && typeof (value as { message?: unknown }).message === 'string';
}

function classifyMemorySaveSource(
  content: string,
): 'template-generated' | typeof MANUAL_FALLBACK_SOURCE_CLASSIFICATION {
  const normalizedContent = content.toLowerCase();
  const hasAnyStandardMarker = STANDARD_MEMORY_TEMPLATE_MARKERS.some((marker) => normalizedContent.includes(marker));
  return hasAnyStandardMarker ? 'template-generated' : MANUAL_FALLBACK_SOURCE_CLASSIFICATION;
}

function shouldBypassTemplateContract(
  sourceClassification: PreparedParsedMemory['sourceClassification'],
  sufficiencyResult: MemorySufficiencyResult,
  templateContract: MemoryTemplateContractResult,
): boolean {
  return sourceClassification === MANUAL_FALLBACK_SOURCE_CLASSIFICATION
    && sufficiencyResult.pass
    && sufficiencyResult.evidenceCounts.primary === 0
    && sufficiencyResult.evidenceCounts.support >= 3
    && sufficiencyResult.evidenceCounts.anchors >= 1
    && !templateContract.valid;
}

function buildQualityLoopMetadata(
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
  database: ReturnType<typeof requireDb>,
): Record<string, unknown> {
  return {
    title: parsed.title ?? '',
    triggerPhrases: parsed.triggerPhrases,
    specFolder: parsed.specFolder,
    contextType: parsed.contextType,
    importanceTier: parsed.importanceTier,
    causalLinks: parsed.causalLinks,
    filePath: parsed.filePath,
    lastModified: parsed.lastModified,
    resolveReference: (reference: string) => resolveMemoryReference(database, reference) !== null,
  };
}

function prepareParsedMemoryForIndexing(
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
  database: ReturnType<typeof requireDb>,
  options: {
    emitEvalMetrics?: boolean;
  } = {},
): PreparedParsedMemory {
  const validation = memoryParser.validateParsedMemory(parsed);
  if (validation.warnings && validation.warnings.length > 0) {
    console.warn(`[memory] Warning for ${path.basename(parsed.filePath)}:`);
    validation.warnings.forEach((warning: string) => console.warn(`[memory]   - ${warning}`));
  }

  // O2-5/O2-12: Run V-rule validation (previously only in workflow path)
  const vRuleResult = validateMemoryQualityContent(parsed.content, { filePath: parsed.filePath });
  if (isVRuleUnavailableResult(vRuleResult) && vRuleResult.status === 'error') {
    throw new VRuleUnavailableError(vRuleResult.message);
  }
  if (vRuleResult && '_unavailable' in vRuleResult) {
    validation.warnings.push('V-rule validator module unavailable — quality gate bypassed. Save proceeds without V-rule enforcement.');
  }
  if (vRuleResult && !isVRuleUnavailableResult(vRuleResult) && !vRuleResult.valid) {
    const vRuleDisposition = determineValidationDisposition(
      vRuleResult.failedRules,
      parsed.memoryTypeSource || null,
    );
    if (vRuleDisposition && vRuleDisposition.disposition === 'abort_write') {
      const failedRuleIds = vRuleDisposition.blockingRuleIds;
      console.error(`[memory-save] V-rule hard block for ${path.basename(parsed.filePath)}: ${failedRuleIds.join(', ')}`);
      // Return early with a rejected quality loop result so callers see the block
      const rejectScore = { total: 0, breakdown: { triggers: 0, anchors: 0, budget: 0, coherence: 0 }, issues: [`V-rule hard block: ${failedRuleIds.join(', ')}`] };
      return {
        parsed,
        validation,
        qualityLoopResult: {
          passed: false,
          score: rejectScore,
          attempts: 0,
          fixes: [],
          rejected: true,
          rejectionReason: `V-rule hard block: ${failedRuleIds.join(', ')}`,
        },
        sufficiencyResult: {
          pass: false,
          rejectionCode: MEMORY_SUFFICIENCY_REJECTION_CODE,
          score: 0,
          reasons: [`V-rule hard block: ${failedRuleIds.join(', ')}`],
          evidenceCounts: { primary: 0, support: 0, total: 0, semanticChars: 0, uniqueWords: 0, anchors: 0, triggerPhrases: 0 },
        },
        templateContract: { valid: false, violations: [], missingAnchors: [], unexpectedTemplateArtifacts: [] } as MemoryTemplateContractResult,
        specDocHealth: null,
        finalizedFileContent: null,
        sourceClassification: 'template-generated',
      };
    }
    if (vRuleDisposition && vRuleDisposition.disposition === 'write_skip_index') {
      console.warn(`[memory-save] V-rule index block for ${path.basename(parsed.filePath)}: ${vRuleDisposition.indexBlockingRuleIds.join(', ')}`);
      validation.warnings.push(`V-rule index block: ${vRuleDisposition.indexBlockingRuleIds.join(', ')}`);
      // F07-002: Flag to skip indexing for write_skip_index disposition
      const parsedWithIndexHints = parsed as ParsedMemoryWithIndexHints;
      parsedWithIndexHints._skipIndex = true;
      parsedWithIndexHints._vRuleIndexBlockIds = vRuleDisposition.indexBlockingRuleIds;
    }
  }


exec
/bin/zsh -lc "sed -n '1,260p' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-update.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
sed: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-update.ts: No such file or directory

exec
/bin/zsh -lc "rg -n \"handleMemorySave|memory_save|importanceTier|importance tier|constitutional|critical|retentionPolicy|provenance\" '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:11:// Feature catalog: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:28:  importanceTier?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:94:  constitutionalCacheCleared: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:71:  const validTiers = ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:80:  // Safety: refuse to bulk-delete constitutional or critical tiers without explicit specFolder scope
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:81:  if ((tier === 'constitutional' || tier === 'critical') && !specFolder) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:85:  if ((tier === 'constitutional' || tier === 'critical') && skipCheckpoint) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:161:        if (tier === 'constitutional' || tier === 'critical') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:173:      if (tier === 'constitutional' || tier === 'critical') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:269:        constitutionalCacheCleared: false, toolCacheInvalidated: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts:6:// Feature catalog: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:6:// Feature catalog: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:27:  sessionQuality: 'healthy' | 'degraded' | 'critical' | 'unknown';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:44:  provenance?: SharedPayloadProvenance;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:268:    provenance: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:7:// Feature catalog: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:26:export type QualityLevel = 'healthy' | 'degraded' | 'critical';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:243:  else level = 'critical';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:26:// Feature catalog: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:218:      importance_tier: parsed.importanceTier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:254:      actor: 'mcp:memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:284:      recordHistory(memory_id, 'ADD', null, parsed.title ?? filePath, 'mcp:memory_save');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:291:          'mcp:memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:17:// Feature catalog: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:8:// Feature catalog: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:10:// Feature catalog: Dry-run preflight for memory_save
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:61:  importanceTier?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:136:  provenanceSource?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:137:  provenanceActor?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:139:  retentionPolicy?: 'keep' | 'ephemeral' | 'shared';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:166:  provenance_source?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:167:  provenance_actor?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:3:description: "Decomposed pipeline modules for the memory_save MCP tool handler, covering dedup, embedding, PE gating, record creation, reconsolidation and response assembly."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:27:`handlers/save/` contains the decomposed pipeline for the `memory_save` MCP tool. Each file owns a single stage of the save flow, from deduplication through embedding generation, save quality gating, prediction-error gating, reconsolidation, record creation, post-insert enrichment, and final response assembly.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:36:// Feature catalog: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:124: * Result payload from reconsolidation pre-checks during memory_save.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:196:            importanceTier: parsed.importanceTier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:262:                  importance_tier: parsed.importanceTier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:301:                recordHistory(id, 'ADD', null, memory.title ?? memory.filePath ?? null, 'mcp:memory_save');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:322:            reason: `memory_save: reconsolidation ${reconResult.action}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:329:              tool: 'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:335:            actor: 'mcp:memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:10:// Feature catalog: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:11:// Feature catalog: Dry-run preflight for memory_save
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:237:      importanceTier: parsed.importanceTier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:302:        importanceTier: parsed.importanceTier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:24:// Feature catalog: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:144:      ? 'memory_save: updated indexed memory entry'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:145:      : 'memory_save: created new indexed memory entry',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:150:      tool: 'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:160:    actor: 'mcp:memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:170:    importanceTier: parsed.importanceTier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:251:      tool: 'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:269:      tool: 'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:285:      tool: 'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:322:        constitutionalCacheCleared: false, toolCacheInvalidated: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:337:    importanceTier: result.importanceTier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:462:    tool: 'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:274:| Full validation | `runPreflight()` | Before memory_save |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:86:  /** REQ-D4-003: context_type for short-critical exception evaluation */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:113:// REQ-D4-003: Short-critical quality gate exception
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:116:/** Minimum number of structural signals required for short-critical exception. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:118:const SHORT_DECISION_EXCEPTION_LOG_PREFIX = '[QUALITY-GATE] short-critical-exception';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:322: * A decision document with >= 2 signals qualifies for the short-critical exception.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:337: * REQ-D4-003: Determine whether the short-critical exception applies.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:414:    // REQ-D4-003: Check for short-critical exception before adding rejection reason
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:798:  // REQ-D4-003: Pass contextType so validateStructural can apply the short-critical exception
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:18:// Feature catalog: Dry-run preflight for memory_save
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:44:    importanceTier: parsed.importanceTier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:68:    importanceTier: parsed.importanceTier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:8:// Feature catalog: Dry-run preflight for memory_save
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:18:// Feature catalog: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:88:            reason: 'memory_save: reinforced existing memory via prediction-error gate',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:93:              tool: 'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:99:            actor: 'mcp:memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:140:          reason: 'memory_save: updated existing memory via prediction-error gate',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:145:            tool: 'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:151:          actor: 'mcp:memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:161:/** Discover constitutional memory files from skill constitutional directories. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:172:      const constitutionalDir = path.join(skillDir, entry.name, 'constitutional');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:173:      if (!fs.existsSync(constitutionalDir)) continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:175:        const files = fs.readdirSync(constitutionalDir, { withFileTypes: true });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:179:            results.push(path.join(constitutionalDir, file.name));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:184:        console.warn(`Warning: Could not read constitutional dir ${constitutionalDir}:`, message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:229:export const handleMemorySave = lazyFunction(getMemorySaveModule, 'handleMemorySave');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:233:export const handle_memory_save = lazyFunction(getMemorySaveModule, 'handle_memory_save');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:277:export const find_constitutional_files = lazyFunction(getMemoryIndexModule, 'find_constitutional_files');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:251:        constitutionalCacheCleared: false, toolCacheInvalidated: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:54:  let constitutionalCacheCleared = false;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:57:    constitutionalCacheCleared = true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:65:    constitutionalCacheCleared = false;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:100:    constitutionalCacheCleared,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:51:    importanceTier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:67:  if (importanceTier !== undefined && !isValidTier(importanceTier)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:70:      `Invalid importance tier: ${importanceTier}. Valid tiers: ${VALID_TIERS.join(', ')}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:71:      { param: 'importanceTier', value: importanceTier }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:87:  if (importanceTier !== undefined) updateParams.importanceTier = importanceTier;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:210:          importanceTier: updateParams.importanceTier ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:250:      constitutionalCacheCleared: false, toolCacheInvalidated: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:135:      importance_tier TEXT DEFAULT 'normal' CHECK(importance_tier IN ('constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated')),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:159:    provenance: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:164:      lastUpdated: structuralContext.provenance?.lastUpdated ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:305:    provenance: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:310:      lastUpdated: structuralContext.provenance?.lastUpdated ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:556:            importanceTier: r.importanceTier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:965:      '[memory-context] folder discovery failed (non-critical):',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:378:    'provenance',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:409:      provenance: Array.isArray(result.provenance) ? result.provenance as string[] : null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:112:  sessionQuality?: 'healthy' | 'degraded' | 'critical' | 'unknown';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:569:    provenance: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:574:      lastUpdated: structuralContext.provenance?.lastUpdated ?? codeGraph.lastScan,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:57:  memory_save: ERROR_CODES.MEMORY_SAVE_FAILED,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:56:    toolPattern: /^(bash|memory_save|memory_update)$/i,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:33:  importanceTier: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:67:  importanceTier: string | undefined,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:71:  if (importanceTier === 'critical' || importanceTier === 'constitutional') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:204: * Check if a memory is eligible for promotion to critical tier.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:217:    if (memory.importance_tier === 'critical' || memory.importance_tier === 'constitutional') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:234: * Promote a memory to critical tier.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:247:      if (memory.importance_tier === 'critical' || memory.importance_tier === 'constitutional') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:264:      SET importance_tier = 'critical', updated_at = ?
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:268:    console.warn(`[confidence-tracker] Memory ${memoryId} promoted to critical tier`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:303:      importanceTier: memory.importance_tier || 'normal',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts:19:// Feature catalog: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:41:  provenance_source?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:42:  provenance_actor?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:61:  'shared_space_id', 'provenance_source', 'provenance_actor',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:53:  importanceTier: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:266:    importanceTier: importance_tier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:278:    importanceTier: importance_tier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:326:  if (normalizedPath.includes('/constitutional/') && normalizedPath.endsWith('.md')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:327:    return 'constitutional';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:629:/** Extract importance tier from content or metadata */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:634:  // (e.g., template comments containing "importanceTier: 'constitutional'" as documentation)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:639:  const yamlMatch = frontmatter?.match(/(?:importance_tier|importanceTier):\s*["']?(\w+)["']?/i);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:648:  if (contentWithoutComments.includes('[CONSTITUTIONAL]') || contentWithoutComments.includes('importance: constitutional')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:649:    return 'constitutional';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:651:  if (contentWithoutComments.includes('[CRITICAL]') || contentWithoutComments.includes('importance: critical')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:652:    return 'critical';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:786:    normalizedPath.includes('/constitutional/') &&
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:39:| Tool-Specific Hints | 6 tools | memory_search, checkpoint_restore, memory_save, memory_index_scan, memory_drift_why, memory_causal_link |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:40:| Severity Levels | 4 | low, medium, high, critical |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:105:- **severity**: low, medium, high or critical
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:158:  'memory_save'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:3:description: "Multi-factor scoring system for memory retrieval with composite weighting, importance tiers, folder ranking and confidence tracking."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:6:  - "importance tiers"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:12:> Multi-factor scoring system for memory retrieval with composite weighting, importance tiers, folder ranking and confidence tracking.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:34:The scoring module provides multi-factor algorithms for ranking memories in the Spec Kit Memory system. It combines similarity scores with temporal decay, importance tiers, usage patterns and validation feedback to surface the most relevant memories.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:57:| Importance Tiers | 6 | constitutional, critical, important, normal, temporary, deprecated |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:74:| **Importance** | 0.25 | Tier-based multiplier (constitutional=2x, critical=1.5x) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:93:| **constitutional** | 1.0 | 3.0x | No | Never | Always surface at top |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:94:| **critical** | 1.0 | 2.0x | No | Never | Never expire, surface first |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:111:The scoring layer includes document-type multipliers for active document types (for example `spec`, `plan`, `tasks`, `checklist`, `decision-record`, `implementation-summary`, `memory`, `constitutional`, `research`, `handover`, `scratch`). These multipliers are used by folder scoring and document retrieval ranking.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:221:const boostedScore = applyTierBoost(baseScore, 'critical');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:224:const config = getTierConfig('constitutional');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:234:  { spec_folder: '012-auth', updated_at: '2025-01-20', importance_tier: 'critical' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:257:// Returns: { promotionEligible: true, wasPromoted: true, importanceTier: 'critical' }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:269:| Get tier value | `getTierValue('critical')` | Numeric importance (0-1) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:270:| Check decay | `allowsDecay('constitutional')` | Filter decay-exempt tiers |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:279:Packet `007-detector-provenance-and-regression-floor` treats frozen detector fixtures as a regression-integrity floor only. The acceptance criterion from research recommendation R6 is the governing boundary: Public must land frozen detector fixtures that fail on structural regressions, while follow-on task corpora for user-visible structural quality are defined separately.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:289:Packet `007` adds honest provenance markers for audited detector modules and a reusable frozen Vitest floor under `scripts/tests/detector-regression-floor.vitest.ts.test.ts`. Future packets may extend that floor, but they must pair any quality claims with separate outcome-oriented evaluation.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:323:- Rows must include a supported `methodologyStatus`, a non-empty `schemaVersion`, and at least one normalized provenance entry before they can be published.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:332:| `missing_provenance` | The row omits normalized reader or telemetry provenance. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:13:export type Severity = 'low' | 'medium' | 'high' | 'critical';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:227:      'Or use .opencode/skill/*/constitutional/ for constitutional memories',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:241:    severity: 'critical',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:270:    severity: 'critical',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:280:    severity: 'critical',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:509:      'Use memory_save({ dryRun: true }) to validate first',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:513:    toolTip: 'memory_save({ dryRun: true })'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:542:    toolTip: 'memory_save({ force: true })'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:549:      'Run memory_save({ dryRun: true }) for detailed validation report',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:554:    toolTip: 'memory_save({ dryRun: true })'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:742:  memory_save: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:747:        'Create the memory file before calling memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:770:      toolTip: 'memory_save({ dryRun: true })'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:103:// Feature catalog: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:105:// Feature catalog: Dry-run preflight for memory_save
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:188:    importanceTier: parsed.importanceTier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:645:          importanceTier: parsed.importanceTier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:945:            actor: 'mcp:memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:972:        actor: 'mcp:memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1078:/** Handle memory_save tool - validates, indexes, and persists a memory file to the database */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1079:async function handleMemorySave(args: SaveArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1086:      tool: 'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1093:        hint: 'Retry memory_save after checkpoint_restore maintenance completes.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1111:    provenanceSource,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1112:    provenanceActor,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1114:    retentionPolicy,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1129:    throw new Error('File must be a .md or .txt file in: specs/**/memory/, specs/**/ (spec docs), or .opencode/skill/*/constitutional/');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1142:    provenanceSource,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1143:    provenanceActor,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1145:    retentionPolicy,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1151:      action: 'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1174:        action: 'memory_save_shared_space',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1213:      tool: 'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1310:            tool: 'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1316:              actions: ['Run npm run build --workspace=@spec-kit/scripts', 'Retry memory_save'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1345:        tool: 'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1441:        tool: 'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1447:          actions: ['Run npm run build --workspace=@spec-kit/scripts', 'Retry memory_save'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1462:        action: 'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1471:        metadata: { filePath: validatedPath, retentionPolicy: governanceDecision.normalized.retentionPolicy },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1490:            actor: provenanceActor ?? 'mcp:memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1703:        'Retry memory_save({ filePath, force: true }) once dependencies are healthy',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1728:        constitutionalCacheCleared: false, toolCacheInvalidated: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1781:  handleMemorySave,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1789:const handle_memory_save = handleMemorySave;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1796:  handle_memory_save,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:24:  | 'provenance_chain'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:101:      case 'provenance_chain': {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:103:          return errorResponse('nodeId is required for provenance_chain query');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:108:          queryType: 'provenance_chain',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:129:          `Unknown queryType: "${args.queryType}". Valid types: uncovered_questions, unverified_claims, contradictions, provenance_chain, coverage_gaps, hot_nodes`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:44:| **Tier Mapping** | Link importance tiers to appropriate memory types |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:76:| **meta-cognitive** | Never | Never | Rules about rules: constitutional, invariants |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:85:| 2 | Importance tier | 0.9 | `importance_tier: constitutional` -> meta-cognitive |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:94:| constitutional | meta-cognitive | Rules that never decay |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:95:| critical | semantic | Core concepts, high persistence |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:110:| `constitutional`, `claude.md` | meta-cognitive | `AGENTS.md`, `AGENTS.md` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:66:- `document-helpers.ts` is now the canonical source for document-aware weighting, including lower weights for working artifacts and higher weights for constitutional/spec docs.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:69:- `mutation-ledger.ts` and `history.ts` provide complementary audit trails: the former is low-level mutation provenance, the latter is higher-level history/event reporting.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:15:// Feature catalog: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:433:          WHEN importance_tier = 'constitutional' THEN importance_tier
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:502:    importance_tier: parsed.importanceTier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:538:    recordHistory(memoryId, 'ADD', null, parsed.title ?? filePath, params.actor ?? 'mcp:memory_save');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:816:      actor: params.actor ?? 'mcp:memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:108:    description: 'Rules about rules: constitutional, standards, invariants',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:191:  { pattern: /constitutional/i, type: 'meta-cognitive' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:257:  'constitutional': 'meta-cognitive',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:376:  | 'constitutional';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:432:  if (normalizedPath.includes('/constitutional/') && normalizedPath.endsWith('.md')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:433:    return 'constitutional';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:31:  applyClassificationDecay?: (stability: number, contextType: string, importanceTier: string) => number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:188:  constitutional: 0.1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:189:  critical: 0.3,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:205:  constitutional: Infinity,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:206:  critical: Infinity,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:214:function applyClassificationDecayFallback(stability: number, contextType: string, importanceTier: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:216:  const tierMult = CLASSIFICATION_TIER_STABILITY_MULTIPLIER[importanceTier] ?? 1.0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:227:  constitutional: 2.0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:228:  critical: 1.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:251:  constitutional: 2.0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:666:  // HIGH-003 FIX: Pass tier for constitutional exemption
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:8://   2. Session continuity warning if quality score is degraded/critical
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:128:    if (quality.level === 'critical') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts:203:    '  Approach  : Add causal links for constitutional and critical tier memories',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:26:  importanceTier?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:51:  importanceTier?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:60:  constitutional: 'meta-cognitive',  // Rules that never decay
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:61:  critical: 'semantic',              // Core concepts, high persistence
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:130:  const tierMatch = content.match(/(?:importance_tier|importanceTier):\s*["']?(\w+)["']?/i);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:137:  if (content.includes('[CONSTITUTIONAL]') || content.includes('importance: constitutional')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:140:  if (content.includes('[CRITICAL]') || content.includes('importance: critical')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:222:    importanceTier = null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:247:  // 3. Check importance tier mapping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:248:  if (importanceTier && TIER_TO_TYPE_MAP[importanceTier]) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:250:      type: TIER_TO_TYPE_MAP[importanceTier],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:304:      importanceTier: memory.importanceTier || memory.importance_tier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:343:  // Check if constitutional content has correct type
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:344:  if (filePath?.includes('constitutional') && inferredType !== 'meta-cognitive') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:208:// After memory_save operation
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts:21:  | 'constitutional'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts:22:  | 'critical'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts:33:  constitutional: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts:42:  critical: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts:95:// Apply tier boost to a search score (critical=2x, important=1.5x, etc.)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts:152:// Check if tier should always surface in search (constitutional)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts:164:// SQL WHERE clause for constitutional tier
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts:166:  return "importance_tier = 'constitutional'";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts:199: * Get the default importance tier for a given document type.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts:218:    constitutional: 'constitutional',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:61:  importanceTier?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:280:      const mergedImportanceTier = newMemory.importanceTier ?? getOptionalString(currentRow, 'importance_tier');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:924:    provenance_source: existingRow.provenance_source,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:925:    provenance_actor: existingRow.provenance_actor,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:17:// Feature catalog: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:30:  importanceTier: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:55:  importanceTier?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:280:      importance_tier: parsed.importanceTier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:297:      actor: 'mcp:memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:303:      recordHistory(nextMemoryId, 'ADD', null, parsed.title ?? parsed.filePath, 'mcp:memory_save');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:304:      recordHistory(memoryId, 'UPDATE', previous.title, parsed.title ?? parsed.filePath, 'mcp:memory_save');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:320:    importanceTier: parsed.importanceTier
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:99:  constitutional: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:167:    includeConstitutional: include_constitutional = true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:213:  const constitutionalFiles: string[] = include_constitutional ? findConstitutionalFiles(workspacePath) : [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:228:  const mergedFiles = [...specFiles, ...constitutionalFiles, ...specDocFiles];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:327:        'Constitutional files go in .opencode/skill/*/constitutional/'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:332:  const constitutionalSet = new Set(constitutionalFiles.map((filePath) => getCachedKey(filePath)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:345:    constitutional: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:346:      found: constitutionalFiles.length,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:380:      if (constitutionalSet.has(getCachedKey(unchangedPath))) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:381:        results.constitutional.alreadyIndexed++;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:411:      const isConstitutional = constitutionalSet.has(getCachedKey(filePath));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:457:            results.constitutional.indexed++;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:459:            results.constitutional.alreadyIndexed++;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:526:          docType !== 'constitutional'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:641:              constitutionalFiles: constitutionalFiles.length,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:673:const find_constitutional_files = findConstitutionalFiles;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:682:  find_constitutional_files,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:28:// Feature catalog: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:39:  importanceTier: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:54:  importanceTier?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:243:        importance_tier: parsed.importanceTier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:344:          importance_tier: parsed.importanceTier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:475:      importanceTier: parsed.importanceTier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:522:        parsed.importanceTier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:586:        importanceTier: parsed.importanceTier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:613:    reason: `memory_save: chunked indexing (${chunkResult.strategy}, ${chunkResult.chunks.length} chunks)`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:618:      tool: 'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:628:    actor: 'mcp:memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:643:    importanceTier: parsed.importanceTier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:773:    hints.push('Memory eligible for promotion to critical tier');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:5:// provenance normalization, and governance audit persistence.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:33:  provenanceSource?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:34:  provenanceActor?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:36:  retentionPolicy?: RetentionPolicy;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:50:  provenanceSource: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:51:  provenanceActor: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:53:  retentionPolicy: RetentionPolicy;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:204:    || typeof input.provenanceSource === 'string'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:205:    || typeof input.provenanceActor === 'string'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:207:    || input.retentionPolicy === 'ephemeral'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:208:    || input.retentionPolicy === 'shared'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:216: * @returns Validation result with normalized scope, provenance, and retention data.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:223:  const retentionPolicy: RetentionPolicy = input.retentionPolicy === 'ephemeral' || input.retentionPolicy === 'shared'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:224:    ? input.retentionPolicy
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:226:  const provenanceSource = normalizeId(input.provenanceSource) ?? '';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:227:  const provenanceActor = normalizeId(input.provenanceActor) ?? '';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:240:        provenanceSource: provenanceSource || null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:241:        provenanceActor: provenanceActor || null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:243:        retentionPolicy,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:253:  if (!provenanceSource) issues.push('provenanceSource is required for governed ingest');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:254:  if (!provenanceActor) issues.push('provenanceActor is required for governed ingest');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:260:  if (retentionPolicy === 'ephemeral' && !deleteAfter) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:274:      provenanceSource,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:275:      provenanceActor,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:277:      retentionPolicy,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:296:    provenance_source: decision.normalized.provenanceSource || null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:297:    provenance_actor: decision.normalized.provenanceActor || null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:299:    retention_policy: decision.normalized.retentionPolicy,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:307:      provenanceSource: decision.normalized.provenanceSource || null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:308:      provenanceActor: decision.normalized.provenanceActor || null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:310:      retentionPolicy: decision.normalized.retentionPolicy,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:106: * @throws Error if learned_triggers IS found in FTS5 (critical violation)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:134:      throw error; // Re-throw critical violations
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:19:// Feature catalog: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/document-helpers.ts:32:      constitutional: 1.0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/document-helpers.ts:51:  return !!documentType && documentType !== 'memory' && documentType !== 'constitutional';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:34:- `memory-bulk-delete.ts` - Bulk deletion by importance tier with checkpoint guardrails.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:53:- `memory-index-alias.ts`, `memory-index-discovery.ts` - Alias conflict discovery, spec-doc discovery, and constitutional file detection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:70:- `memory-index.ts` and `mutation-hooks.ts` work together so index, update, and stale-delete flows clear trigger, constitutional, graph, co-activation, and degree caches.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:80:- Post-mutation invalidation clears `clearDegreeCache()` alongside trigger and constitutional caches so graph-derived retrieval signals cannot serve stale data after mutations.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:5:// lookup, provenance chains, unverified claims, and hot-node ranking.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:177:  const provenanceRelations = ns.loopType === 'research'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:196:        if (!provenanceRelations.includes(edge.relation)) continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:222:/** Internal helper: get node by ID for provenance chain */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-summaries.ts:25:  constitutional: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-summaries.ts:26:  critical: 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:48:    && !!record.provenance
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:49:    && typeof record.provenance === 'object';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:69:    `Provenance: producer=${payload.provenance.producer}; trustState=${payload.provenance.trustState}; sourceSurface=${payload.provenance.sourceSurface}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:4:// Phase 030 / Phase 1: common payload and provenance envelope
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:95:  provenance: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:183:  provenance: SharedPayloadProvenance;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:251:      `Invalid parser provenance: expected one of ${PARSER_PROVENANCE_VALUES.join(', ')}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:260:      `Invalid detector provenance: expected one of ${DETECTOR_PROVENANCE_VALUES.join(', ')}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:304:    // provenance only when a 006 trust-axis carrier explicitly needs it.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:323:  if (!Array.isArray(metadata.provenance) || metadata.provenance.length === 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:324:    throw new Error('Publication methodology metadata requires at least one provenance entry.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:327:  const normalizedProvenance = metadata.provenance
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:332:    throw new Error('Publication methodology metadata requires non-empty provenance entries.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:338:    provenance: [...new Set(normalizedProvenance)],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:549:  provenance: SharedPayloadProvenance;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:580:        : `${input.kind} payload from ${input.provenance.producer}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:587:    provenance: input.provenance,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:297:- Purpose: Owns ranking and calibration logic once candidate memories already exist. It combines importance tiers, composite scoring, folder relevance, confidence signals, and negative-feedback effects.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/publication-gate.ts:17:  | 'missing_provenance'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/publication-gate.ts:28:  provenance?: string[] | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/publication-gate.ts:73:  const provenance = normalizeProvenance(row.provenance);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/publication-gate.ts:74:  if (provenance.length === 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/publication-gate.ts:77:      exclusionReason: 'missing_provenance',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/publication-gate.ts:84:    provenance,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:151:      "notes": "Find-spec direct factual lookup. Tests whether constitutional or critical-tier memories (CLAUDE.md rules) are prioritized in retrieval."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:315:      "query": "constitutional memory rules",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:320:      "expectedResultDescription": "Constitutional enforcement query. Should always surface constitutional-tier memories (CLAUDE.md rules, Four Laws of Agent Safety) at the top of results regardless of other content.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:321:      "notes": "From T007b Pattern 7: constitutional memories surface unconditionally on every query."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:535:      "query": "refactor the importance tier scoring to use a lookup table instead of conditional chain",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:540:      "expectedResultDescription": "Should surface importance-tiers.ts, scoring.vitest.ts, and any spec about importance tier weight assignments.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:575:      "query": "constitutional memory tier enforcement",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:580:      "expectedResultDescription": "Should surface constitutional-tier memories (CLAUDE.md rules) which are injected unconditionally at the top of every result.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:581:      "notes": "Trigger phrase derived from constitutional tier documentation."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:735:      "query": "why does my query return constitutional memories even when they are not relevant",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:740:      "expectedResultDescription": "Should surface the constitutional memory injection behavior described in SKILL.md §3 and T007b Pattern 7.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:780:      "expectedResultDescription": "Should surface early spec folder memories or constitutional documentation about why persistent AI memory was needed for the Claude Code / OpenCode workflow.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:835:      "query": "memory_save keeps failing with duplicate content hash error",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:845:      "query": "the tier classifier is promoting memories to constitutional tier incorrectly",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:850:      "expectedResultDescription": "Should surface tier-classifier.ts, the constitutional tier qualification criteria, and any test coverage in tier-classifier.vitest.ts.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:851:      "notes": "Manual bug report about tier promotion logic — a sensitive path given constitutional tier has special behavior."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:59:    tools: ['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:42:  /** Optional importance tier (e.g. 'constitutional', 'critical', 'important', 'normal'). */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:55:  constitutionalSurfacingRate: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:372: * Percentage of queries where constitutional-tier memories appear
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:376: * 1 if ANY constitutional memory appears in top-K, 0 otherwise.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:379: * @param constitutionalIds Memory IDs that are constitutional tier.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:381: * @returns 0 or 1. Returns 0 when constitutionalIds is empty.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:385:  constitutionalIds: number[],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:388:  if (results.length === 0 || constitutionalIds.length === 0) return 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:390:  const constitutionalSet = new Set(constitutionalIds);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:394:    if (constitutionalSet.has(r.memoryId)) return 1;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:404: *   constitutional = 3x, critical = 2x, important = 1.5x, normal = 1x
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:422:    constitutional: 3,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:423:    critical: 2,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:580: * @param params.constitutionalIds   Memory IDs that are constitutional tier.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:589:  constitutionalIds?: number[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:597:    constitutionalIds = [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:612:    constitutionalSurfacingRate: computeConstitutionalSurfacingRate(results, constitutionalIds),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:185:  // Priority 3: Default based on importance tier
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:187:  if (tier === 'constitutional' || tier === 'critical') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:188:    return null; // No decay for constitutional/critical
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:289: * Classify a memory's importance tier based on its properties.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:300:  // If no decay (constitutional/critical), always HOT
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:499:  // Never archive constitutional or critical
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:500:  if (memory.importance_tier === 'constitutional' || memory.importance_tier === 'critical') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:802:      // Use stored content_text — critical for chunks which share file_path with parent
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:32:The architecture module defines the 7-layer MCP tool organization (T060) that enables progressive disclosure from high-level orchestration to specialized operations. This layer model also frames document-aware behavior (spec documents, memory notes, constitutional files) used across indexing and retrieval.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:33:  constitutional: 700,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:41:const PRIORITY_ORDER = ['constitutional', 'codeGraph', 'cocoIndex', 'sessionState', 'triggered'] as const;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:121:  constitutionalSize: number,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:128:    { name: 'constitutional', floor: DEFAULT_FLOORS.constitutional, actualSize: constitutionalSize },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:45:| Index Sources | 3 | spec memories, constitutional files, spec documents (`includeSpecDocs`) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:56:| **Importance Scoring** | Six-tier importance classification (constitutional, critical, important, normal, temporary, deprecated) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:470:  importanceTier: 'critical',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:878:        includeConstitutional: false, // Handler manages constitutional separately
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:955:  // Only the highest-scoring entry's `source` is preserved. Multi-source provenance
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1089:        // Non-critical — vector channel failure does not block pipeline
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1132:        // Non-critical — graph channel failure does not block pipeline
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1176:        // Non-critical — degree channel failure does not block pipeline
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1335:      // Non-critical — MPAB failure does not block pipeline
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1374:    // Non-critical — enforcement failure does not block pipeline
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1500:      // Non-critical enrichment — co-activation failure does not affect core ranking
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1554:      // Non-critical — truncation failure does not block pipeline
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1560:  // Formatters can opt-in to provenance-rich envelopes without relying on
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1790: * Retrieves memories ordered by importance tier and weight, without
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1828:          WHEN 'constitutional' THEN 1
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1829:          WHEN 'critical' THEN 2
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:39:  constitutional: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:40:  critical: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:58:    constitutional: 1.0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:59:    critical: 1.0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:87:function getDecayRate(importanceTier: string | null | undefined): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:88:  if (!importanceTier || typeof importanceTier !== 'string') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:92:  const rate = DECAY_CONFIG.decayRateByTier[importanceTier];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:246:    String(memory.importance_tier || memory.importanceTier || 'normal'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:55: * Consumers must not reuse this as parser provenance, evidence status,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:199:  protectedTiers: ['constitutional', 'critical'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:5:// Promotes memory importance tier based on positive validation count:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:7:// - >=10 positive validations: important -> critical
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:26:  /** Previous importance tier */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:28:  /** New importance tier (same as previous if no promotion) */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:43:/** Positive validations required to promote important -> critical */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:49:  important: { target: 'critical', threshold: PROMOTE_TO_CRITICAL_THRESHOLD },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:63:  'critical',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:64:  'constitutional',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:209: * Promotes the memory's importance tier in the database.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:213: * - >=10 positive validations: important -> critical
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:240: * constitutional = slowest decay (most persistent), scratch = fastest decay (ephemeral).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:251:  constitutional: 0.1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:252:  critical: 0.3,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:291: * constitutional/critical: Infinity = never decays.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:298:  constitutional: Infinity, // never decays
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:299:  critical: Infinity,       // never decays
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:319: * @param importanceTier Memory importance_tier field (e.g. "constitutional", "normal")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:322:function getClassificationDecayMultiplier(contextType: string, importanceTier: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:324:  const tierMult = IMPORTANCE_TIER_STABILITY_MULTIPLIER[importanceTier] ?? 1.0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:343: * @param importanceTier Memory importance_tier field
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:349:  importanceTier: string
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:361:  const multiplier = getClassificationDecayMultiplier(contextType, importanceTier);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:373:   1. NO-DECAY documents — context_type in {decision, constitutional, critical}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:393:  'constitutional',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:394:  'critical',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:420: *   - 'no_decay'       for decision / constitutional / critical context types
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:432:function getHybridDecayMultiplier(contextType: string, _importanceTier?: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:444: *   - decision / constitutional / critical → returns Infinity (no decay)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:451:function applyHybridDecayPolicy(stability: number, contextType: string, importanceTier?: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:452:  const multiplier = getHybridDecayMultiplier(contextType, importanceTier);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:218:  return typeof tableSql === 'string' && tableSql.includes("'constitutional'");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:419:// V18: the rollout — weight_history table + causal_edges provenance + encoding_intent column
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:726:          UPDATE memory_index SET document_type = 'constitutional'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:728:            AND importance_tier = 'constitutional'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:730:        logger.info('Migration v13: Backfilled document_type for constitutional files');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1418:    { name: 'provenance_source', sql: 'ALTER TABLE memory_index ADD COLUMN provenance_source TEXT' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1419:    { name: 'provenance_actor', sql: 'ALTER TABLE memory_index ADD COLUMN provenance_actor TEXT' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1546:        constraintMismatches.push('memory_index.importance_tier CHECK constraint is missing constitutional support');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1723:      logger.warn('Index creation failed (non-critical)', {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1967:// Migrate existing database to support constitutional tier
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1969: * Checks legacy databases for constitutional tier support.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1973:export function migrate_constitutional_tier(database: Database.Database): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1977:    if (tableSql.includes("'constitutional'")) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1981:    const constitutionalCount = (database.prepare(`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1983:      WHERE importance_tier = 'constitutional'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1987:      constitutionalCount > 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1988:        ? `Legacy memory_index importance_tier constraint is missing constitutional support and blocks ${constitutionalCount} constitutional memories`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1989:        : 'Legacy memory_index importance_tier constraint is missing constitutional support and requires a table rebuild before startup can continue'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2277:    migrate_constitutional_tier(database);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2321:      importance_tier TEXT DEFAULT 'normal' CHECK(importance_tier IN ('constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated')),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2330:      provenance_source TEXT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2331:      provenance_actor TEXT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2489:export { migrate_constitutional_tier as migrateConstitutionalTier };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:353: * @param source - Source identifier for provenance tracking
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:624: * Retrieve the provenance audit log (Safeguard #10).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:46:| `eval-metrics.ts` | MRR, NDCG, recall, precision, F1, MAP, hit-rate, inversion-rate, and constitutional metrics |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:27:  migrate_constitutional_tier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:64:  get_constitutional_memories_public,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:155:  clear_constitutional_cache,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:156:  get_constitutional_memories,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:25: * Higher tiers (constitutional, critical) map to higher quality signals.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:29:  constitutional: 1.0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:30:  critical: 0.9,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:232:      provenance: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:16:  constitutional: string;    // Constitutional rules (from Memory)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:130:  const constitutionalSize = estimateTokens(input.constitutional);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:137:    constitutionalSize,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:170:  pushSection(input.constitutional, 'constitutional', 'Constitutional Rules', 'memory');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:206:      provenance: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:223:        { source: 'constitutional', lastUpdated: null, staleness: 'unknown' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:752: * for non-critical tracking data — no file lock is used).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:775:    // OS atomic rename provides sufficient durability for this non-critical metadata.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:214:  const value = getMetadata('last_detector_provenance');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:221:export function setLastDetectorProvenance(provenance: DetectorProvenance): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:222:  setMetadata('last_detector_provenance', provenance);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:226:  const value = getMetadata('last_detector_provenance_summary');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:239:  setMetadata('last_detector_provenance_summary', JSON.stringify(summary));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:18:/** Honest graph-local detector provenance classes for structural indexing lanes. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:377: * When enabled: decision/constitutional/critical context types receive Infinity
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:385: * REQ-D4-003: Short-critical quality gate exception.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:616: * Phase C T027: Result provenance — include graph evidence metadata in search results.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:25:  clear_constitutional_cache,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:361:    importanceTier,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:400:    if (importanceTier !== undefined) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:402:      values.push(importanceTier);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:403:      clear_constitutional_cache();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:542:    clear_constitutional_cache();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:696:      clear_constitutional_cache();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:122:  importanceTier?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:25:  get_constitutional_memories,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:72:    row.isConstitutional = row.importance_tier === 'constitutional';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:97:    row.isConstitutional = row.importance_tier === 'constitutional';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:215:  let constitutional_results: MemoryRow[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:217:  if (includeConstitutional && tier !== 'constitutional') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:218:    constitutional_results = get_constitutional_memories(database, specFolder, includeArchived);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:232:  } else if (tier === 'constitutional') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:234:    params.push('constitutional');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:239:    where_clauses.push('(m.importance_tier IS NULL OR m.importance_tier NOT IN (\'deprecated\', \'constitutional\'))');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:252:  // M8 FIX: If constitutional results already satisfy limit, return them directly
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:253:  if (constitutional_results.length >= limit) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:254:    return constitutional_results.slice(0, limit);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:256:  const adjusted_limit = Math.max(1, limit - constitutional_results.length);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:279:    row.isConstitutional = row.importance_tier === 'constitutional';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:283:  return [...constitutional_results, ...regular_results];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:287: * Gets constitutional memories for prompt assembly.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:289: * @returns The constitutional memory rows.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:291:export function get_constitutional_memories_public(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:297:  let results = get_constitutional_memories(database, specFolder, includeArchived);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:403:    row.isConstitutional = row.importance_tier === 'constitutional';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:687:    row.isConstitutional = row.importance_tier === 'constitutional';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:763:      isConstitutional: row.isConstitutional || row.importance_tier === 'constitutional'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:849:      isConstitutional: row.isConstitutional || row.importance_tier === 'constitutional'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:931:      isConstitutional: row.importance_tier === 'constitutional'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1438:export { get_constitutional_memories_public as getConstitutionalMemories };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:344:      // Fix #15 — constitutionalInjected passed from Stage 1 metadata
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:345:      constitutionalInjected: input.stage1Metadata?.constitutionalInjected ?? 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:206:constitutional: 1.0  // No decay
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:207:critical:       1.0  // No decay
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:690:# protectedTiers: ['constitutional', 'critical']
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:877:// constitutional: 1.0 = no decay (expected)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:980:**Q: Why do constitutional memories never decay?**
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:982:A: Constitutional memories are permanent rules and principles (like coding standards and architectural decisions). They should ALWAYS be available, so `decay_rate = 1.0` (100% retention = no decay). This applies to both `constitutional` and `critical` tiers.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/deterministic-extractor.ts:20: * Edge provenance marker for deterministic extraction.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:79:/** Number of constitutional results to fetch when none appear in hybrid/vector results. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:460: * enabled, followed by constitutional injection, quality filtering, and
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:472:  // Fix #16: Cache embedding at function scope for reuse in constitutional injection
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:474:  let constitutionalInjectedCount = 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:606:    // Fix #16 — Cache this embedding for reuse in constitutional injection path
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:959:  // Applied after candidate collection but before constitutional injection so
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:960:  // Injected constitutional rows are evaluated by the same filters.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1010:  // If includeConstitutional is requested and no constitutional results exist
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1022:      (r) => r.importance_tier === 'constitutional'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1027:      const constitutionalEmbedding: Float32Array | number[] | null =
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1030:      if (constitutionalEmbedding) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1031:        const constitutionalResults = vectorIndex.vectorSearch(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1032:          constitutionalEmbedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1036:            tier: 'constitutional',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1043:        const uniqueConstitutional = constitutionalResults.filter(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1047:        // Re-apply filters after injection because constitutional rows fetched
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1053:        // to ensure constitutional injection respects global scope enforcement
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1062:        constitutionalInjectedCount = filteredConstitutional.length;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1066:    // Explicitly exclude constitutional results if flag is off
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1068:      (r) => r.importance_tier !== 'constitutional'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1403:      constitutionalInjected: constitutionalInjectedCount,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:46:  /** Phase C T025: Graph evidence provenance — edges and communities that contributed to graph-based boosts. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:209:    constitutionalInjected: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:288: * State filtering, session dedup, constitutional injection, channel attribution.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:298:  /** Fix #15: Stage 1 metadata passed through for constitutional count */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:299:  stage1Metadata?: { constitutionalInjected?: number };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:309:    constitutionalInjected: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:241:      // Non-critical — MMR failure does not block pipeline
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:593: *   - `contentSource: 'reassembled_chunks'` to mark provenance
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:403:    clear_constitutional_cache();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:441:const constitutional_cache = new Map<string, { data: MemoryRow[]; timestamp: number }>();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:446:const constitutional_cache_loading = new Map<string, boolean>();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:449:let last_constitutional_cache_db_path: string | null = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:451:function get_constitutional_cache_db_scope(): string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:459:function build_constitutional_cache_key(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:463:  const db_scope = get_constitutional_cache_db_scope();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:467:function refresh_constitutional_cache_db_state(): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:468:  const current_db_path = get_constitutional_cache_db_scope();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:469:  last_constitutional_cache_db_path = current_db_path;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:479:function is_constitutional_cache_valid() {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:480:  if (constitutional_cache.size === 0) return false;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:483:    const current_db_path = get_constitutional_cache_db_scope();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:485:      last_constitutional_cache_db_path &&
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:486:      last_constitutional_cache_db_path !== current_db_path
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:603: * Gets cached constitutional memories from the index.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:607: * @returns The constitutional memory rows.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:609:export function get_constitutional_memories(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:615:  const cache_key = build_constitutional_cache_key(spec_folder, includeArchived);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:617:  const cached = constitutional_cache.get(cache_key);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:619:  if (cached && (now - cached.timestamp) < CONSTITUTIONAL_CACHE_TTL && is_constitutional_cache_valid()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:623:  if (constitutional_cache_loading.get(cache_key) && cached) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:627:  constitutional_cache_loading.set(cache_key, true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:630:    const constitutional_sql = `
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:632:             'constitutional' as source_type
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:635:      WHERE m.importance_tier = 'constitutional'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:643:    let results = database.prepare(constitutional_sql).all(...params) as MemoryRow[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:647:    const max_constitutional_count = Math.floor(MAX_CONSTITUTIONAL_TOKENS / TOKENS_PER_MEMORY);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:648:    results = results.slice(0, max_constitutional_count);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:656:    if (constitutional_cache.size >= CONSTITUTIONAL_CACHE_MAX_KEYS) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:657:      const oldestKey = constitutional_cache.keys().next().value;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:659:        constitutional_cache.delete(oldestKey);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:663:    refresh_constitutional_cache_db_state();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:664:    constitutional_cache.set(cache_key, { data: results, timestamp: now });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:668:    constitutional_cache_loading.delete(cache_key);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:673: * Clears cached constitutional memories.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:677:export function clear_constitutional_cache(spec_folder: string | null = null): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:681:    for (const key of [...constitutional_cache.keys()]) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:683:        constitutional_cache.delete(key);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:686:    for (const key of [...constitutional_cache_loading.keys()]) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:688:        constitutional_cache_loading.delete(key);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:692:    constitutional_cache.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:693:    constitutional_cache_loading.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:695:    last_constitutional_cache_db_path = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1100:    const { get_constitutional_memories_public } = await getQueriesModule();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1101:    return get_constitutional_memories_public(options, database);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1136:export { clear_constitutional_cache as clearConstitutionalCache };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:46:| `stage1-candidate-gen.ts` | Stage 1: Candidate Generation. Runs search channels (hybrid, vector, multi-concept), applies deep-mode query expansion (R6), embedding-based expansion (R12), summary embeddings (R8), constitutional memory injection, quality threshold filtering and tier/contextType filtering. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:61:      |  search channels, constitutional injection, quality filter
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:80:- Injects constitutional memories when absent and no tier filter is active.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:154:        stage1Metadata: { constitutionalInjected: stage1Result.metadata.constitutionalInjected },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:168:        constitutionalInjected: stage1Result.metadata.constitutionalInjected,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:397: * Phase C T026: Populate graphEvidence provenance on each result that received
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:464:    console.warn(`[stage2-fusion] provenance edge fetch failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:493:    console.warn(`[stage2-fusion] provenance community fetch failed (non-fatal): ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:627:    const importanceTier = (row.importance_tier as string | undefined) ?? 'normal';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:628:    const recency = computeRecencyScore(recencyTimestamp, importanceTier);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1006:      const importanceTier = (row.importance_tier as string | undefined) ?? 'normal';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1009:      const recencyScore = computeRecencyScore(recencyTimestamp, importanceTier);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1091:      // Non-critical enrichment — co-activation failure does not affect core ranking
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1184:  // -- 2e. Graph evidence provenance (Phase C T026) --
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1191:    console.warn(`[stage2-fusion] graph evidence provenance failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:549: * - Excludes constitutional memories (returns 0 to prevent artificial inflation)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:564:  // Identify constitutional memories (excluded from degree boosting)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:565:  const constitutionalIds = new Set<string>();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:568:    const constitutionalRows = (database.prepare(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:569:      `SELECT id FROM memory_index WHERE id IN (${placeholders}) AND importance_tier = 'constitutional'`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:571:    for (const row of constitutionalRows) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:572:      constitutionalIds.add(String(row.id));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:575:    // Fail closed — if we can't identify constitutional IDs, zero all scores
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:592:    if (!constitutionalIds.has(key) && !nodeBoostCache.has(key)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:615:    if (constitutionalIds.has(key)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:6:// Adds a `retrieval_directive` metadata field to constitutional-tier memories.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:28: * Retrieval directive derived from a constitutional memory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:43: * A constitutional memory result, optionally enriched with a retrieval directive.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:54:  importanceTier: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:194: * Extract a retrieval directive from constitutional memory content.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:206: * @param content - Full text content of the constitutional memory file.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:216:  const source = title ?? 'constitutional memory';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:252:        priorityCondition = `Prioritize when: constitutional rule is active for current task`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:307: * Enrich an array of constitutional memory results with `retrieval_directive` metadata.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:320: * @param results - Array of constitutional memory results to enrich.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:99:Post-channel: constitutional memory injection, quality score filtering, tier/contextType filtering.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:116:Cross-encoder reranking (optional, min 2 results) followed by MPAB chunk-to-memory aggregation. Aggregation formula: `parentScore = sMax + 0.3 * Sum(rest) / sqrt(N)` where `sMax` is the best chunk score and N is the remaining chunk count. Chunk ordering preserves `chunk_index` document order (B2 guarantee). `contentSource` metadata marks provenance (`reassembled_chunks` or `file_read_fallback`).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:318:| `auto-promotion.ts`        | -      | TypeScript | Validation-count-based tier promotion engine (normal->important->critical) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:673:Processing steps applied during `memory_save` before a memory is persisted.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:740:FSRS stability is adjusted by a 2D multiplier matrix of context type x importance tier:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:742:| | constitutional | critical | important | normal | temporary | deprecated |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:748:`Infinity` strategy: constitutional and critical tiers with decision/research context never decay. Gated via `SPECKIT_CLASSIFICATION_DECAY` (default ON).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:754:Validation-count-based tier promotion engine. Thresholds: **5** positive validations = normal -> important, **10** = important -> critical. Throttle safeguard: max **3** promotions per **8-hour** rolling window. `NON_PROMOTABLE_TIERS`: critical, constitutional, temporary, deprecated. Promotion audit logged to `memory_promotion_audit` table.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:757:Selection tracking writes to a separate `learned_triggers` column (NOT FTS5 index). 10 safeguards: separate column, 30-day TTL, 100+ stop words denylist, rate cap (3 terms/selection, 8 terms/memory), top-3 exclusion, 1-week shadow period, <72h memory exclusion, sprint gate review, rollback mechanism, provenance audit log. Query weight: **0.7x** of organic triggers. Gated via `SPECKIT_LEARN_FROM_SELECTION` (default ON; set to `false` to disable).

codex
I found the current save path and one concrete mismatch already: Public’s write-side semantics are governance-heavy and tier-based, not a simple `core=true` tag. I’m pulling the update handler now so I can judge whether a Mnemosyne-style shortcut would be a thin alias or a semantic mismatch.
exec
/bin/zsh -lc "sed -n '1,260p' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Memory Crud Update Handler
// ────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   IMPORTS
──────────────────────────────────────────────────────────────── */

import { randomUUID } from 'node:crypto';
import { checkDatabaseUpdated } from '../core/index.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import type { UpdateMemoryParams } from '../lib/search/vector-index.js';
import * as embeddings from '../lib/providers/embeddings.js';
import * as bm25Index from '../lib/search/bm25-index.js';
import { VALID_TIERS, isValidTier } from '../lib/scoring/importance-tiers.js';
import { MemoryError, ErrorCodes } from '../lib/errors.js';
import * as mutationLedger from '../lib/storage/mutation-ledger.js';
import { runInTransaction } from '../lib/storage/transaction-manager.js';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
import { toErrorMessage } from '../utils/index.js';

import { recordHistory } from '../lib/storage/history.js';
import { appendMutationLedgerSafe, getMemoryHashSnapshot } from './memory-crud-utils.js';
import { runPostMutationHooks } from './mutation-hooks.js';
import { buildMutationHookFeedback } from '../hooks/mutation-feedback.js';

import type { MCPResponse } from './types.js';
import type { UpdateArgs } from './memory-crud-types.js';

// Feature catalog: Memory metadata update (memory_update)
// Feature catalog: Validation feedback (memory_validate)
// Feature catalog: Transaction wrappers on mutation handlers
// Feature catalog: Per-memory history log


/* ───────────────────────────────────────────────────────────────
   CORE LOGIC
──────────────────────────────────────────────────────────────── */

/** Handle memory_update tool -- updates metadata fields and optionally regenerates embeddings. */
async function handleMemoryUpdate(args: UpdateArgs): Promise<MCPResponse> {
  // A7-P2-1: Generate requestId for incident correlation in error responses
  const requestId = randomUUID();
  await checkDatabaseUpdated();

  const {
    id,
    title,
    triggerPhrases,
    importanceWeight,
    importanceTier,
    allowPartialUpdate = false,
  } = args;

  if (typeof id !== 'number') {
    throw new MemoryError(ErrorCodes.MISSING_REQUIRED_PARAM, 'id is required', { param: 'id' });
  }

  if (importanceWeight !== undefined && (typeof importanceWeight !== 'number' || importanceWeight < 0 || importanceWeight > 1)) {
    throw new MemoryError(
      ErrorCodes.INVALID_PARAMETER,
      'importanceWeight must be a number between 0 and 1',
      { param: 'importanceWeight', value: importanceWeight }
    );
  }

  if (importanceTier !== undefined && !isValidTier(importanceTier)) {
    throw new MemoryError(
      ErrorCodes.INVALID_PARAMETER,
      `Invalid importance tier: ${importanceTier}. Valid tiers: ${VALID_TIERS.join(', ')}`,
      { param: 'importanceTier', value: importanceTier }
    );
  }

  const existing = vectorIndex.getMemory(id);
  if (!existing) {
    throw new MemoryError(ErrorCodes.FILE_NOT_FOUND, `Memory not found: ${id}`, { id });
  }

  const database = vectorIndex.getDb();
  const priorSnapshot = getMemoryHashSnapshot(database, id);

  const updateParams: UpdateMemoryParams = { id };
  if (title !== undefined) updateParams.title = title;
  if (triggerPhrases !== undefined) updateParams.triggerPhrases = triggerPhrases;
  if (importanceWeight !== undefined) updateParams.importanceWeight = importanceWeight;
  if (importanceTier !== undefined) updateParams.importanceTier = importanceTier;

  let embeddingRegenerated = false;
  let embeddingMarkedForReindex = false;
  let embeddingStatusNeedsPendingWrite = false;
  let mutationLedgerWarning: string | null = null;

  if (title !== undefined && title !== existing.title) {
    console.error(`[memory-update] Title changed, regenerating embedding for memory ${id} [requestId=${requestId}]`);
    let newEmbedding: Float32Array | null = null;

    try {
      // Embed title + content_text, not title alone.
      // This produces better semantic embeddings that capture the full memory context.
      const contentText = existing.content_text || '';
      const embeddingInput = contentText ? `${title}\n\n${contentText}` : title;
      newEmbedding = await embeddings.generateDocumentEmbedding(embeddingInput);
    } catch (err: unknown) {
      const message = toErrorMessage(err);
      if (allowPartialUpdate) {
        console.warn(`[memory-update] Embedding regeneration failed, marking for re-index [requestId=${requestId}]: ${message}`);
        embeddingStatusNeedsPendingWrite = true;
        embeddingMarkedForReindex = true;
      } else {
        console.error(`[memory-update] Embedding regeneration failed, rolling back update [requestId=${requestId}]: ${message}`);
        throw new MemoryError(
          ErrorCodes.EMBEDDING_FAILED,
          'Embedding regeneration failed, update rolled back. No changes were made.',
          { originalError: message, memoryId: id }
        );
      }
    }

    if (newEmbedding) {
      updateParams.embedding = newEmbedding;
      embeddingRegenerated = true;
    } else if (!embeddingMarkedForReindex) {
      if (allowPartialUpdate) {
        console.warn('[memory-update] Embedding returned null, marking for re-index');
        embeddingStatusNeedsPendingWrite = true;
        embeddingMarkedForReindex = true;
      } else {
        throw new MemoryError(
          ErrorCodes.EMBEDDING_FAILED,
          'Failed to regenerate embedding (null result), update rolled back. No changes were made.',
          { memoryId: id }
        );
      }
    }
  }

  // T2-5 transaction wrapper — wraps all synchronous mutation steps (DB update,
  // Cache invalidation, BM25 re-index, ledger append) in a single transaction for atomicity.
  // Embedding generation (async) runs before this block; its result feeds into updateParams.
  const fields = Object.keys(updateParams).filter((key) => key !== 'id' && key !== 'embedding');

  if (database) {
    runInTransaction(database, () => {
      if (embeddingStatusNeedsPendingWrite) {
        vectorIndex.updateEmbeddingStatus(id, 'pending');
      }

      vectorIndex.updateMemory(updateParams);

      // T2-6 — BM25 index stores title + trigger phrases; must re-index when either changes
      // So keyword search reflects the updated content.
      // T-05: BM25 re-index failure now rolls back the transaction when the index is operational.
      // Infrastructure failures (BM25 not available, DB missing prepare) are non-fatal warnings.
      if ((updateParams.title !== undefined || updateParams.triggerPhrases !== undefined) && bm25Index.isBm25Enabled()) {
        try {
          const bm25Idx = bm25Index.getIndex();
          const row = database.prepare(
            'SELECT title, content_text, trigger_phrases, file_path FROM memory_index WHERE id = ?'
          ).get(id) as { title: string | null; content_text: string | null; trigger_phrases: string | null; file_path: string | null } | undefined;
          if (row) {
            const text = bm25Index.buildBm25DocumentText(row);
            if (text.trim()) {
              bm25Idx.addDocument(String(id), text);
            }
          }
        } catch (e: unknown) {
          const bm25ErrMsg = e instanceof Error ? e.message : String(e);
          // T-05 + P1-02 fix: Distinguish infrastructure failures from data failures.
          // Infrastructure failures mean the BM25 subsystem is unavailable or torn down —
          // These are non-fatal warnings. Data failures mean the index IS operational but rejected
          // The input — those must re-throw to roll back the transaction.
          const isBm25InfraFailure = (msg: string): boolean =>
            msg.includes('not a function') ||
            msg.includes('not initialized') ||
            msg.includes('Cannot read properties') ||
            msg.includes('is not defined') ||
            msg.includes('database is closed') ||
            msg.includes('no such table');
          if (isBm25InfraFailure(bm25ErrMsg)) {
            console.warn(`[memory-crud-update] BM25 infrastructure unavailable, skipping re-index [requestId=${requestId}]: ${bm25ErrMsg}`);
          } else {
            console.error(`[memory-crud-update] BM25 re-index failed, rolling back update [requestId=${requestId}]: ${bm25ErrMsg}`);
            throw new Error(`BM25 re-index failed: ${bm25ErrMsg}`);
          }
        }
      }

      // T-05: Record UPDATE history after successful mutation
      try {
        recordHistory(
          id, 'UPDATE',
          existing.title ?? null,
          updateParams.title ?? existing.title ?? null,
          'mcp:memory_update'
        );
      } catch (_histErr: unknown) {
        // History recording is best-effort
      }

      const ledgerRecorded = appendMutationLedgerSafe(database, {
        mutationType: 'update',
        reason: 'memory_update: metadata update',
        priorHash: priorSnapshot?.content_hash ?? (existing.content_hash as string | null) ?? null,
        newHash: mutationLedger.computeHash(JSON.stringify({
          id,
          title: updateParams.title ?? existing.title ?? null,
          triggerPhrases: updateParams.triggerPhrases ?? null,
          importanceWeight: updateParams.importanceWeight ?? null,
          importanceTier: updateParams.importanceTier ?? null,
        })),
        linkedMemoryIds: [id],
        decisionMeta: {
          tool: 'memory_update',
          fields,
          embeddingRegenerated,
          embeddingMarkedForReindex,
          allowPartialUpdate,
        },
        actor: 'mcp:memory_update',
      });
      if (!ledgerRecorded) {
        mutationLedgerWarning = 'Mutation ledger append failed; audit trail may be incomplete.';
      }
    });
  } else {
    // P1-021 — No database handle means we cannot guarantee transactional
    // Consistency. Abort early rather than risk partial state.
    console.warn('[memory-crud-update] No database handle, aborting update to prevent partial state');
    return createMCPErrorResponse({
      tool: 'memory_update',
      error: `Memory ${id} update aborted: database unavailable`,
      code: 'E_DB_UNAVAILABLE',
      details: { updated: null, fields },
      recovery: {
        hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database',
        actions: ['Restart the MCP server', 'Call memory_index_scan()'],
        severity: 'error',
      },
    });
  }

  let postMutationHooks: import('./mutation-hooks.js').MutationHookResult;
  try {
    postMutationHooks = runPostMutationHooks('update', { memoryId: id });
  } catch (hookError: unknown) {
    const msg = hookError instanceof Error ? hookError.message : String(hookError);
    postMutationHooks = {
      latencyMs: 0, triggerCacheCleared: false,
      constitutionalCacheCleared: false, toolCacheInvalidated: 0,
      graphSignalsCacheCleared: false, coactivationCacheCleared: false,
      errors: [msg],
    };
  }
  const postMutationFeedback = buildMutationHookFeedback('update', postMutationHooks);

  const summary = embeddingMarkedForReindex
    ? `Memory ${id} updated (embedding pending re-index)`
    : `Memory ${id} updated successfully`;


exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts' | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Memory Save Handler
     3	// ───────────────────────────────────────────────────────────────
     4	/* --- 1. DEPENDENCIES --- */
     5	
     6	// Node built-ins
     7	import { randomUUID } from 'node:crypto';
     8	import * as fs from 'node:fs';
     9	import path from 'path';
    10	
    11	// Shared packages
    12	import { validateFilePath } from '@spec-kit/shared/utils/path-security';
    13	import {
    14	  evaluateMemorySufficiency,
    15	  MEMORY_SUFFICIENCY_REJECTION_CODE,
    16	  type MemorySufficiencyResult,
    17	} from '@spec-kit/shared/parsing/memory-sufficiency';
    18	import {
    19	  validateMemoryTemplateContract,
    20	  type MemoryTemplateContractResult,
    21	} from '@spec-kit/shared/parsing/memory-template-contract';
    22	import {
    23	  evaluateSpecDocHealth,
    24	  type SpecDocHealthResult,
    25	} from '@spec-kit/shared/parsing/spec-doc-health';
    26	
    27	// Internal modules
    28	import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core/index.js';
    29	import { createFilePathValidator } from '../utils/validators.js';
    30	import * as memoryParser from '../lib/parsing/memory-parser.js';
    31	import * as transactionManager from '../lib/storage/transaction-manager.js';
    32	import * as checkpoints from '../lib/storage/checkpoints.js';
    33	import * as preflight from '../lib/validation/preflight.js';
    34	import { requireDb } from '../utils/index.js';
    35	import type { MCPResponse } from './types.js';
    36	import { createAppendOnlyMemoryRecord, recordLineageVersion } from '../lib/storage/lineage-state.js';
    37	import * as causalEdges from '../lib/storage/causal-edges.js';
    38	
    39	import { runQualityGate, isQualityGateEnabled } from '../lib/validation/save-quality-gate.js';
    40	import { isSaveQualityGateEnabled } from '../lib/search/search-flags.js';
    41	
    42	import { getCanonicalPathKey } from '../lib/utils/canonical-path.js';
    43	import { findSimilarMemories } from './pe-gating.js';
    44	import { runPostMutationHooks } from './mutation-hooks.js';
    45	import { buildMutationHookFeedback } from '../hooks/mutation-feedback.js';
    46	import { needsChunking, indexChunkedMemoryFile } from './chunking-orchestrator.js';
    47	import { applyPostInsertMetadata } from './save/db-helpers.js';
    48	import { createMemoryRecord, findSamePathExistingMemory, type MemoryScopeMatch } from './save/create-record.js';
    49	import {
    50	  buildGovernancePostInsertFields,
    51	  ensureGovernanceRuntime,
    52	  recordGovernanceAudit,
    53	  validateGovernedIngest,
    54	} from '../lib/governance/scope-governance.js';
    55	import {
    56	  assertSharedSpaceAccess,
    57	  recordSharedConflict,
    58	} from '../lib/collab/shared-spaces.js';
    59	import { delete_memory_from_database } from '../lib/search/vector-index-mutations.js';
    60	import {
    61	  runQualityLoop,
    62	} from './quality-loop.js';
    63	import type {
    64	  QualityLoopResult,
    65	} from './quality-loop.js';
    66	
    67	// O2-5/O2-12: V-rule validation (previously only in workflow path)
    68	import {
    69	  validateMemoryQualityContent,
    70	  determineValidationDisposition,
    71	} from './v-rule-bridge.js';
    72	
    73	// Save pipeline modules (CR-P2-4 decomposition)
    74	import type {
    75	  IndexResult,
    76	  SaveArgs,
    77	  AtomicSaveParams,
    78	  AtomicSaveOptions,
    79	  AtomicSaveResult,
    80	} from './save/index.js';
    81	import { checkExistingRow, checkContentHashDedup } from './save/dedup.js';
    82	import { generateOrCacheEmbedding, persistPendingEmbeddingCacheWrite } from './save/embedding-pipeline.js';
    83	import { evaluateAndApplyPeDecision } from './save/pe-orchestration.js';
    84	import { runReconsolidationIfEnabled } from './save/reconsolidation-bridge.js';
    85	import { runPostInsertEnrichment } from './save/post-insert.js';
    86	import { buildIndexResult, buildSaveResponse } from './save/response-builder.js';
    87	import { createMCPErrorResponse } from '../lib/response/envelope.js';
    88	
    89	// Extracted sub-modules
    90	import { withSpecFolderLock } from './save/spec-folder-mutex.js';
    91	import { buildParsedMemoryEvidenceSnapshot } from './save/markdown-evidence-builder.js';
    92	import {
    93	  applyInsufficiencyMetadata,
    94	  buildInsufficiencyRejectionResult,
    95	  buildTemplateContractRejectionResult,
    96	  buildDryRunSummary,
    97	} from './save/validation-responses.js';
    98	
    99	import { markMemorySuperseded } from './pe-gating.js';
   100	import { resolveMemoryReference } from './causal-links-processor.js';
   101	import { refreshAutoEntitiesForMemory } from '../lib/extraction/entity-extractor.js';
   102	
   103	// Feature catalog: Memory indexing (memory_save)
   104	// Feature catalog: Verify-fix-verify memory quality loop
   105	// Feature catalog: Dry-run preflight for memory_save
   106	// Feature catalog: Prediction-error save arbitration
   107	
   108	
   109	// Create local path validator
   110	const validateFilePathLocal = createFilePathValidator(ALLOWED_BASE_PATHS, validateFilePath);
   111	const MANUAL_FALLBACK_SOURCE_CLASSIFICATION = 'manual-fallback' as const;
   112	
   113	interface PreparedParsedMemory {
   114	  parsed: ReturnType<typeof memoryParser.parseMemoryFile>;
   115	  validation: ReturnType<typeof memoryParser.validateParsedMemory>;
   116	  qualityLoopResult: QualityLoopResult;
   117	  sufficiencyResult: MemorySufficiencyResult;
   118	  templateContract: MemoryTemplateContractResult;
   119	  specDocHealth: SpecDocHealthResult | null;
   120	  finalizedFileContent: string | null;
   121	  sourceClassification: 'template-generated' | typeof MANUAL_FALLBACK_SOURCE_CLASSIFICATION;
   122	}
   123	
   124	type ParsedMemoryWithIndexHints = ReturnType<typeof memoryParser.parseMemoryFile> & {
   125	  _skipIndex?: boolean;
   126	  _vRuleIndexBlockIds?: string[];
   127	};
   128	
   129	const STANDARD_MEMORY_TEMPLATE_MARKERS = [
   130	  '## continue session',
   131	  '## recovery hints',
   132	  '<!-- memory metadata -->',
   133	];
   134	
   135	class VRuleUnavailableError extends Error {
   136	  constructor(message: string) {
   137	    super(message);
   138	    this.name = 'VRuleUnavailableError';
   139	  }
   140	}
   141	
   142	function isVRuleUnavailableResult(value: unknown): value is {
   143	  passed: false;
   144	  status: 'error' | 'warning';
   145	  message: string;
   146	  _unavailable: true;
   147	} {
   148	  return typeof value === 'object'
   149	    && value !== null
   150	    && 'passed' in value
   151	    && (value as { passed?: unknown }).passed === false
   152	    && 'status' in value
   153	    && typeof (value as { status?: unknown }).status === 'string'
   154	    && 'message' in value
   155	    && typeof (value as { message?: unknown }).message === 'string';
   156	}
   157	
   158	function classifyMemorySaveSource(
   159	  content: string,
   160	): 'template-generated' | typeof MANUAL_FALLBACK_SOURCE_CLASSIFICATION {
   161	  const normalizedContent = content.toLowerCase();
   162	  const hasAnyStandardMarker = STANDARD_MEMORY_TEMPLATE_MARKERS.some((marker) => normalizedContent.includes(marker));
   163	  return hasAnyStandardMarker ? 'template-generated' : MANUAL_FALLBACK_SOURCE_CLASSIFICATION;
   164	}
   165	
   166	function shouldBypassTemplateContract(
   167	  sourceClassification: PreparedParsedMemory['sourceClassification'],
   168	  sufficiencyResult: MemorySufficiencyResult,
   169	  templateContract: MemoryTemplateContractResult,
   170	): boolean {
   171	  return sourceClassification === MANUAL_FALLBACK_SOURCE_CLASSIFICATION
   172	    && sufficiencyResult.pass
   173	    && sufficiencyResult.evidenceCounts.primary === 0
   174	    && sufficiencyResult.evidenceCounts.support >= 3
   175	    && sufficiencyResult.evidenceCounts.anchors >= 1
   176	    && !templateContract.valid;
   177	}
   178	
   179	function buildQualityLoopMetadata(
   180	  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
   181	  database: ReturnType<typeof requireDb>,
   182	): Record<string, unknown> {
   183	  return {
   184	    title: parsed.title ?? '',
   185	    triggerPhrases: parsed.triggerPhrases,
   186	    specFolder: parsed.specFolder,
   187	    contextType: parsed.contextType,
   188	    importanceTier: parsed.importanceTier,
   189	    causalLinks: parsed.causalLinks,
   190	    filePath: parsed.filePath,
   191	    lastModified: parsed.lastModified,
   192	    resolveReference: (reference: string) => resolveMemoryReference(database, reference) !== null,
   193	  };
   194	}
   195	
   196	function prepareParsedMemoryForIndexing(
   197	  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
   198	  database: ReturnType<typeof requireDb>,
   199	  options: {
   200	    emitEvalMetrics?: boolean;
   201	  } = {},
   202	): PreparedParsedMemory {
   203	  const validation = memoryParser.validateParsedMemory(parsed);
   204	  if (validation.warnings && validation.warnings.length > 0) {
   205	    console.warn(`[memory] Warning for ${path.basename(parsed.filePath)}:`);
   206	    validation.warnings.forEach((warning: string) => console.warn(`[memory]   - ${warning}`));
   207	  }
   208	
   209	  // O2-5/O2-12: Run V-rule validation (previously only in workflow path)
   210	  const vRuleResult = validateMemoryQualityContent(parsed.content, { filePath: parsed.filePath });
   211	  if (isVRuleUnavailableResult(vRuleResult) && vRuleResult.status === 'error') {
   212	    throw new VRuleUnavailableError(vRuleResult.message);
   213	  }
   214	  if (vRuleResult && '_unavailable' in vRuleResult) {
   215	    validation.warnings.push('V-rule validator module unavailable — quality gate bypassed. Save proceeds without V-rule enforcement.');
   216	  }
   217	  if (vRuleResult && !isVRuleUnavailableResult(vRuleResult) && !vRuleResult.valid) {
   218	    const vRuleDisposition = determineValidationDisposition(
   219	      vRuleResult.failedRules,
   220	      parsed.memoryTypeSource || null,
   221	    );
   222	    if (vRuleDisposition && vRuleDisposition.disposition === 'abort_write') {
   223	      const failedRuleIds = vRuleDisposition.blockingRuleIds;
   224	      console.error(`[memory-save] V-rule hard block for ${path.basename(parsed.filePath)}: ${failedRuleIds.join(', ')}`);
   225	      // Return early with a rejected quality loop result so callers see the block
   226	      const rejectScore = { total: 0, breakdown: { triggers: 0, anchors: 0, budget: 0, coherence: 0 }, issues: [`V-rule hard block: ${failedRuleIds.join(', ')}`] };
   227	      return {
   228	        parsed,
   229	        validation,
   230	        qualityLoopResult: {
   231	          passed: false,
   232	          score: rejectScore,
   233	          attempts: 0,
   234	          fixes: [],
   235	          rejected: true,
   236	          rejectionReason: `V-rule hard block: ${failedRuleIds.join(', ')}`,
   237	        },
   238	        sufficiencyResult: {
   239	          pass: false,
   240	          rejectionCode: MEMORY_SUFFICIENCY_REJECTION_CODE,

exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts' | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts' | sed -n '603,695p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

 succeeded in 0ms:
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

codex
I’ve got the evidence I need. The synthesis is going to center on five concrete transfers: compaction guidance, explicit global/project ergonomics, core-memory authoring shorthand, startup/AGENTS memory discipline, and a thin OpenCode-native facade. I’m doing one small memory note lookup so I can either cite prior context cleanly or state that this iteration was effectively source-first.
exec
/bin/zsh -lc "sed -n '452,466p' /Users/michelkerkmeester/.codex/memories/MEMORY.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
### keywords

- 041-sk-recursive-agent-loop, packet-rename, descriptions.json, validate.sh --strict, historical research memory rewrite, skip spec folder

## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-03T10-18-09-ppdB-rename_023_hybrid_rag_fusion_refinement.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T12-18-09-019d52d9-a8b9-71c3-949c-f6870aee05a7.jsonl, updated_at=2026-04-03T10:43:47+00:00, thread_id=019d52d9-a8b9-71c3-949c-f6870aee05a7)

### keywords

- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog

## Task 3: Refresh references for renamed packet `040-sk-auto-deep-research-review-improvement`, outcome success

codex
# Iteration 017: INTEGRATION FEASIBILITY

## Focus
INTEGRATION FEASIBILITY: For the top 5 adoption candidates, how hard would they be to integrate into Spec Kit Memory?

## Findings
### Finding 1: Health-gated memory compaction guidance is the easiest high-value transfer
- **Source**: [external/src/index.ts#L208](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L208), [spec-kit-compact-code-graph.js#L185](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L185), [spec-kit-compact-code-graph.js#L296](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L296), [spec-kit-compact-code-graph.js#L396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396)
- **What it does**: Mnemosyne appends a fixed memory-usage block during `experimental.session.compacting`; Public already has a transport-gated compaction pipeline with cache, `runtimeReady`, `lastRuntimeError`, and a status tool.
- **Why it matters for us**: Integration effort is low because the hook plumbing already exists in Public. The work is mostly adding a memory-oriented compaction block to the transport plan, not changing retrieval internals.
- **Recommendation**: adopt now
- **Impact**: high

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


hook: Stop
hook: Stop Completed
tokens used
97,588
# Iteration 017: INTEGRATION FEASIBILITY

## Focus
INTEGRATION FEASIBILITY: For the top 5 adoption candidates, how hard would they be to integrate into Spec Kit Memory?

## Findings
### Finding 1: Health-gated memory compaction guidance is the easiest high-value transfer
- **Source**: [external/src/index.ts#L208](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L208), [spec-kit-compact-code-graph.js#L185](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L185), [spec-kit-compact-code-graph.js#L296](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L296), [spec-kit-compact-code-graph.js#L396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396)
- **What it does**: Mnemosyne appends a fixed memory-usage block during `experimental.session.compacting`; Public already has a transport-gated compaction pipeline with cache, `runtimeReady`, `lastRuntimeError`, and a status tool.
- **Why it matters for us**: Integration effort is low because the hook plumbing already exists in Public. The work is mostly adding a memory-oriented compaction block to the transport plan, not changing retrieval internals.
- **Recommendation**: adopt now
- **Impact**: high

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
