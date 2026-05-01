# Autonomous Deep Research Loop

Iterative research protocol with fresh context per iteration, externalized state, and convergence detection for deep technical investigation.

Runtime path resolution:
- OpenCode/Copilot runtime: `.opencode/agent/*.md`
- Claude runtime: `.claude/agents/*.md`
- **Why it matters for us**: the argv-array bridge is worth copying if we ever front an external memory binary, but the missing operational tools would be a regression versus Public’s `ccc_status`, `session_bootstrap`, and richer MCP diagnostics.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Mnemosyne’s project/global split is ergonomic, but the actual scope key is weak
- **Source**: [external/src/index.ts#L27](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L27), [external/src/index.ts#L30](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L30), [external/src/index.ts#L78](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L78), [external/src/index.ts#L171](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L171), [tool-schemas.ts#L43](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L43), [tool-schemas.ts#L69](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L69)
- **Evidence type**: both
- **What it does**: the wrapper derives project scope from the current directory basename, special-cases `global` to `default`, auto-inits the project collection on load, and lazily inits global on first global write. Public instead exposes explicit `specFolder`, `tenantId`, `userId`, `agentId`, `sharedSpaceId`, and `sessionId` scope parameters.
- **Why it matters for us**: the two-surface ergonomics are attractive, but basename-derived identity is collision-prone and too coarse for Public’s governed and session-aware memory model.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 4: Mnemosyne has no profile separation; Public does
- **Source**: [external/src/index.ts#L96](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L96), [external/src/index.ts#L210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [tool-schemas.ts#L44](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L44), [memory-context.ts#L1318](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1318), [config.toml#L48](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.codex/config.toml#L48), [config.toml#L68](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.codex/config.toml#L68)
- **Evidence type**: both
- **What it does**: Mnemosyne offers one fixed tool family and one fixed compaction prompt block. Public supports response `profile` values on `memory_context`, intent-to-profile auto-routing, and runtime-level profile separation in `.codex/config.toml` (`context`, `research`, `review`, `write`, etc.).
- **Why it matters for us**: Mnemosyne’s simplicity is nice for adoption, but it cannot express Public’s profile-aware recovery and formatting contracts. Adopting it as-is would flatten a capability Public already uses for routing, safety, and UX.
- **Recommendation**: reject
- **Impact**: medium

### Finding 5: The compaction hook is the most transferable idea, but Public’s implementation substrate is stronger
- **Source**: [external/src/index.ts#L208](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L208), [external/src/index.ts#L216](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L216), [spec-kit-compact-code-graph.js#L396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396), [spec-kit-compact-code-graph.js#L411](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L411), [spec-kit-compact-code-graph.js#L296](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L296)
- **Evidence type**: both
- **What it does**: Mnemosyne injects a static memory-usage checklist into `experimental.session.compacting`. Public’s compact-code-graph plugin already does compaction injection too, but through a cached bridge transport plan, with dedupe checks and a plugin status tool.
- **Why it matters for us**: the novel reusable part is not “compaction hook exists” but “memory-tool reminders survive compaction directly in prompt text.” Public can add that guidance inside its existing transport-plan architecture instead of copying Mnemosyne’s thinner standalone pattern.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 6: Mnemosyne’s hybrid retrieval and offline-first story are mostly backend contract, not wrapper logic
- **Source**: [external/src/index.ts#L104](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L104), [external/README.md#L82](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L82), [external/README.md#L84](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L84), [external/README.md#L18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L18), [memory-search.ts#L482](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482), [context-server.ts#L759](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L759), [mcp-coco-index/README.md#L44](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L44)
- **Evidence type**: both
- **What it does**: the wrapper only quotes the query and calls `mnemosyne search`; BM25, sqlite-vec, RRF, ONNX local inference, and the `snowflake-arctic-embed-m-v1.5` choice are README-level backend claims. Public already has hybrid `memory_search`, session-aware routing, and separately positions CocoIndex as semantic code search via CLI plus one MCP tool.
- **Why it matters for us**: there is no evidence here for a superior retrieval algorithm at the wrapper layer. The actionable delta is surface design and first-run UX, not replacing Public’s retrieval core with Mnemosyne’s unseen backend.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
- [layer-definitions.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)
- [config.toml](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.codex/config.toml)

## Assessment
- New information ratio: 0.84
- Questions addressed: tool registration, CLI bridge semantics, search/store/delete verbs, project vs global scoping, compaction prompt injection, profile separation, offline-first operational surface, Public overlap boundaries
- Questions answered: Mnemosyne’s checked-out repo proves a thin OpenCode plugin facade over a CLI binary; the real hybrid-search mechanics remain README-level; Public already exceeds it on MCP breadth, layered routing, and profile-aware recovery; the strongest reusable idea is direct memory-tool guidance during compaction, not the backend contract itself; the strict validation command was run and reported `RESULT: PASSED` despite a read-only temp-file warning from the validator shell

## Reflection
- What worked: reading `src/index.ts` first made the boundary obvious very quickly, and comparing it directly with Public’s tool schemas and compaction plugin prevented stale “Public lacks hybrid retrieval” conclusions
- What did not work: the external repo does not include Mnemosyne backend internals, so BM25/vector/RRF remain documented claims only; this sandbox is read-only, so I could not update the phase artifacts on disk during this iteration

## Recommended Next Focus
LIFECYCLE + MUTATION MODEL: trace how Mnemosyne document IDs flow from recall to delete, compare overwrite/delete expectations with Public’s lineage/checkpoint surfaces, and define the minimum health/readiness contract a binary-backed memory facade would need before it is safe to prototype.

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
# Iteration 004: SESSION LIFECYCLE

## Focus
SESSION LIFECYCLE: How sessions are created, maintained, ended, summarized. Context survival across sessions.

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
I’m treating this as a read-only deep-research pass focused on Mnemosyne’s session lifecycle and how it compares with Spec Kit Memory’s session continuity surfaces. I’m starting with a quick memory pass and then I’ll trace the actual source in the order you specified: `src/index.ts`, `package.json`, tool lifecycle, compaction hook, then README, followed by Public-side comparison points.
  → Run a lightweight memory pass for prior Mnemosyne/Public research context
  • Read Mnemosyne wrapper sources in required order and extract session-lifecycle evidence
  • Read Public comparison sources for session bootstrap, memory context, search, and compaction behavior
  • Run the requested strict validation command and capture exact outcome
  • Synthesize iteration-004 findings in the requested output format with exact file references
codex
I’m loading the prior rollout context first so this iteration builds on the existing findings instead of rehashing them, then I’ll move straight into the source trace. After that I’ll validate the phase folder and assemble the session-lifecycle-specific deltas.
exec
/bin/zsh -lc 'rg -n "mnemosyne|opencode-mnemosyne|session lifecycle|compaction|project/global|memory_recall|memory_store|memory_delete" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
353:- 031-normalized-analytics-reader, spec status Complete, validate.sh --strict, check-completion.sh, checklist P0/P1 totals, description.json timestamp, memory_delete, memory_index_scan, lineage mismatch
391:- if memory indexing flags lineage/template mismatches during closeout, remove stale rows with `memory_delete`, rerun forced `memory_index_scan` after cooldown, and verify clean reindex before final sign-off [Task 7]

exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
The memory pass didn’t surface a meaningful prior Mnemosyne/session-lifecycle note, so I’m treating this as a mostly fresh source-level trace. I’ve also loaded the deep-research skill contract so I can keep this iteration aligned with the externalized-state/fresh-context loop instead of drifting into a generic repo summary.
exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main/src/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
sed: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main/src/index.ts: No such file or directory

exec
/bin/zsh -lc 'rg --files /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external | sort' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/LICENSE
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package-lock.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/tsconfig.json

exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main/package.json" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
sed: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main/package.json: No such file or directory

codex
The checked-out repo layout differs from the brief: the wrapper files are directly under `external/`, not `external/opencode-mnemosyne-main/`. I’m preserving the same analysis order against the actual paths and flagging that as repo-structure evidence rather than assuming a missing nested directory.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
I’ve confirmed the wrapper is very thin: one plugin file, five tools, one compaction hook, and no backend implementation beyond the CLI bridge. Next I’m tracing the Public-side session surfaces so we can compare Mnemosyne’s “session lifecycle by convention” against Spec Kit Memory’s explicit session creation, continuity, dedupe, and resume paths.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'rg -n "session_bootstrap|session_resume|session_health|sessionId|enableDedup|enableSessionBoost|working_memory|dedup|compacting|profile|resume" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js:60: *   dedupeKey: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js:308:            `resume_mode=${RESUME_MODE}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js:374:        if (hasSyntheticTextPartMarker(anchor.parts, SYNTHETIC_METADATA_KEY, block.dedupeKey)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js:384:            [SYNTHETIC_METADATA_KEY]: block.dedupeKey,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js:396:    'experimental.session.compacting': async (input, output) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:112:// T001-T004: Session deduplication
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:360:  const transportSessionId = typeof (extra as { sessionId?: unknown } | null)?.sessionId === 'string'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:361:    ? ((extra as { sessionId?: string }).sessionId ?? null)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:363:  const explicitSessionId = typeof args.sessionId === 'string'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:364:    ? args.sessionId
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:378:// that lack an explicit sessionId param can still correlate with a prior search.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:874:    // T018: Track last tool call timestamp for all tools except session_health.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:875:    if (name !== 'session_health') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1789:    // T001-T004: Session deduplication module
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1803:            console.error('[context-server] Recoverable sessions:', interrupted.sessions.map((s: { sessionId: string }) => s.sessionId).join(', '));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:17:**Graph as a first-class feature family.** The `SPECKIT_GRAPH_*` variables form a dedicated feature family (see [Section 6](#6-graph) and [Section 7](#7-graph-calibration)) controlling structural code graph indexing, graph-first routing in the search pipeline, causal graph traversal, and calibration profiles. Since graph-first routing is now the default query dispatch order (Code Graph -> CocoIndex -> Memory), the graph env vars are among the most impactful configuration levers.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:163:| `SPECKIT_INTENT_AUTO_PROFILE` | `true` | boolean | Intent-to-profile auto-routing: auto-selects response profile from classifyIntent() results. Graduated ON. | `lib/search/search-flags.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:182:| `SPECKIT_GRAPH_CALIBRATION_PROFILE` | `true` | boolean | Graph calibration profile enforcement and community thresholds (REQ-D3-005/006). Graduated ON. | `lib/search/search-flags.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:204:| `SPECKIT_CALIBRATION_PROFILE_NAME` | `default` | string | Named calibration profile: `default` or `aggressive`. | `lib/search/graph-calibration.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:205:| `SPECKIT_N2A_CAP` | (profile) | number | N2a cap for RRF fusion overflow prevention. Overrides the active calibration profile value. | `lib/search/graph-calibration.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:206:| `SPECKIT_N2B_CAP` | (profile) | number | N2b cap for RRF fusion overflow prevention. Overrides the active calibration profile value. | `lib/search/graph-calibration.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:207:| `SPECKIT_LOUVAIN_MIN_DENSITY` | (profile) | number | Minimum graph density required to activate Louvain community detection. | `lib/search/graph-calibration.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:208:| `SPECKIT_LOUVAIN_MIN_SIZE` | (profile) | number | Minimum component node count required to activate Louvain. | `lib/search/graph-calibration.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:225:| `SPECKIT_RECONSOLIDATION` | `true` | boolean | Reconsolidation-on-save for memory deduplication (TM-06). Graduated ON. | `lib/search/search-flags.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:230:| `SPECKIT_AUTO_RESUME` | `true` | boolean | Automatic session resume context injection for memory_context. Graduated ON. | `lib/search/search-flags.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:285:| `SPECKIT_SESSION_RETRIEVAL_STATE_V1` | `true` | boolean | Cross-turn retrieval session state for dedup and goal-aware refinement (REQ-D5-006). Graduated ON. | `lib/search/search-flags.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:290:| `SPECKIT_RESPONSE_PROFILE_V1` | `true` | boolean | Mode-aware response profile formatting (REQ-D5-003). Graduated ON. | `lib/search/search-flags.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:248:  // Shared-memory tools do not currently receive a server-minted sessionId or
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:87:  sessionId?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:230:  const deduplicatedPaths: string[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:241:    deduplicatedPaths.push(normalizedPath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:244:  paths = deduplicatedPaths;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:271:        ? ['Duplicate input paths were deduplicated before queueing']
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:95:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:207:  // T73 SECURITY: Validate caller-supplied sessionId through server-side session
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:210:  let sessionId: string | undefined = rawSessionId;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:229:    sessionId = trustedSession.effectiveSessionId;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:274:    sessionId &&
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:281:      decayStats = { decayedCount: workingMemory.batchUpdateScores(sessionId as string) };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:343:          sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:370:        workingMemory.setAttentionScore(sessionId as string, match.memoryId, 1.0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:398:    const sessionMemories: WorkingMemoryEntry[] = workingMemory.getSessionMemories(sessionId as string)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:469:      sessionId: sessionId!,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:499:  if (!useCognitive && sessionId) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:540:        session_id: sessionId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:5:// from concrete sub-modules (./dedup, ./embedding-pipeline, etc.).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:30:export { checkExistingRow, checkContentHashDedup } from './dedup.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:105:  const sessionId = normalizeScopeMatchValue(scope.sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:131:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:132:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:134:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:180:  sessionId?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:3:description: "Decomposed pipeline modules for the memory_save MCP tool handler, covering dedup, embedding, PE gating, record creation, reconsolidation and response assembly."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:27:`handlers/save/` contains the decomposed pipeline for the `memory_save` MCP tool. Each file owns a single stage of the save flow, from deduplication through embedding generation, save quality gating, prediction-error gating, reconsolidation, record creation, post-insert enrichment, and final response assembly.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:39:| `dedup.ts`                  | Pre-save deduplication. `checkExistingRow` matches by file path but returns `unchanged` only for healthy rows (`success`, `pending`, `partial`); `checkContentHashDedup` matches by content hash and accepts chunked parents only when their status is valid `partial`. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:53:1. dedup          -- Skip if unchanged or duplicate content hash
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:171:  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:10:// Feature catalog: SHA-256 content-hash deduplication
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:11:// Feature catalog: Canonical ID dedup hardening
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:22:  ['session_id', 'sessionId'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:60:    sessionId: normalizeScopeMatchValue(scope.sessionId),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:81:import { checkExistingRow, checkContentHashDedup } from './save/dedup.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:725:    // NOTE: Content-hash dedup (C5-1) moved inside BEGIN IMMEDIATE transaction
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:754:              sessionId: scope.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:908:    // A4 FIX: Wrap dedup-check + insert in a single transaction for DB-level
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:916:    // C5-1: Content-hash dedup check BEFORE the write transaction — reads are
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1109:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1140:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1156:      sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1169:      sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1179:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1269:    sessionId: governanceDecision.normalized.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1468:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:80:type SessionResumeModule = typeof import('./session-resume.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:208:    sessionResumeModule = loadHandlerModule<SessionResumeModule>('session-resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:331:// Session resume handler
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:30:  sessionId?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:41:  sessionId?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:46:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:68:  sessionId: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:309:    sessionId: session_id = null
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:378:            sessionId: normalizedSessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:428:          sessionId: normalizedSessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:441:          ? `Call task_postflight with taskId: "${taskId}", sessionId: "${normalizedSessionId}" after completing the task`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:467:    sessionId: session_id = null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:518:      `Multiple open preflight records found for spec_folder="${spec_folder}" and task_id="${taskId}". Provide sessionId to disambiguate postflight.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:526:      `Multiple completed learning cycles found for spec_folder="${spec_folder}" and task_id="${taskId}". Provide sessionId to update the intended record.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:539:      { specFolder: spec_folder, taskId: taskId, sessionId: normalizedSessionId }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:615:          sessionId: (preflightRecord.session_id as string | null) ?? normalizedSessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:663:    sessionId: session_id,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:719:        sessionId: (row.session_id as string | null) ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:109:  dedup: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:174:    const profile: EmbeddingProfile | null = embeddings.getEmbeddingProfile();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:175:    if (profile) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:176:      console.error(`[memory_index_scan] Using embedding provider: ${profile.provider}, model: ${profile.model}, dimension: ${profile.dim}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:242:  const dedupDuplicatesSkipped = mergedFiles.length - files.length;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:243:  if (dedupDuplicatesSkipped > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:244:    console.error(`[memory-index-scan] Canonical dedup skipped ${dedupDuplicatesSkipped} alias path(s) (${mergedFiles.length} -> ${files.length})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:355:    dedup: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:358:      duplicatesSkipped: dedupDuplicatesSkipped,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:603:  if (results.dedup.duplicatesSkipped > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:604:    hints.push(`Canonical dedup skipped ${results.dedup.duplicatesSkipped} alias path(s)`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:645:              dedupSkipped: dedupDuplicatesSkipped,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:62:      session_id: input.sessionId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:29:- `memory-search.ts` - L2 hybrid search handler with telemetry and profile support.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:4:// Phase 024 / Item 7: Composite tool that runs session_resume
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:5:// + session_health in one call, merging results with hints.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:7:import { handleSessionResume } from './session-resume.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:8:import type { CachedSessionSummaryDecision } from './session-resume.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:46:  resume: Record<string, unknown>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:95:  resumeData: Record<string, unknown>,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:101:  if (resumeData.error) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:102:    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:106:    nextActions.add('Call `session_health()` directly to inspect the current health-check failure.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:114:    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:155:    preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163:/** Handle session_bootstrap tool call — one-call session setup */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168:  // Sub-call 1: session_resume with full resume payload
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:169:  let resumeData: Record<string, unknown> = {};
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:171:    const resumeResponse = await handleSessionResume({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:174:    resumeData = extractData(resumeResponse);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:175:    allHints.push(...extractHints(resumeData));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:178:    resumeData = { error: message };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:179:    allHints.push('session_resume failed. Try calling it manually.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:182:  // Sub-call 2: session_health
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:191:    allHints.push('session_health failed. Try calling it manually.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:202:  const cachedSummary = extractCachedSummary(resumeData);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:216:  const completeness = resumeData.error || healthData.error ? 'partial' : 'full';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:219:  const resumeCertainty: SharedPayloadCertainty = resumeData.error ? 'unknown' : 'estimated';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:224:  const resumePayload = coerceSharedPayloadEnvelope(resumeData.payloadContract);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:227:  const resumeStructuralTrust = extractStructuralTrustFromPayload(resumePayload);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:228:  if (!resumeData.error && !resumeStructuralTrust) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:236:    { label: 'session_bootstrap structural context payload' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:238:  const resumeWithTrust = resumeData.error
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:239:    ? resumeData
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:241:      resumeData,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:242:      resumeStructuralTrust,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:243:      { label: 'session_bootstrap resume payload' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:248:      key: 'resume-surface',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:250:      content: summarizeUnknown(resumeData),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:252:      certainty: resumeCertainty,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:280:      // which remains valid even when the remote resume surface fails closed.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:289:      content: buildNextActions(resumeData, healthData, structuralContext).join(' | '),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:299:      { label: 'resume', certainty: resumeCertainty },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:311:      sourceRefs: ['session-resume', 'session-health', 'session-snapshot'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:324:    resume: resumeWithTrust,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:332:      resumePayload,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:338:    // Keep advisory routing guidance out of nextActions so bootstrap and resume
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:339:    // remain the authoritative recovery owners for startup and deep resume flows.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:340:    nextActions: buildNextActions(resumeData, healthData, structuralContext),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:75:} from '../lib/response/profile-formatters.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:89:  deduplicateResults as deduplicateWithSessionState,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:145:  dedupStats: Record<string, unknown>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:194:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:195:  enableDedup?: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:204:  enableSessionBoost?: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:211:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:212:  profile?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:324:function buildSessionStatePayload(sessionId: string): Record<string, unknown> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:325:  const session = retrievalSessionStateManager.getOrCreate(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:450:function applySessionDedup(results: MemorySearchRow[], sessionId: string, enableDedup: boolean): DedupResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:451:  if (!enableDedup || !sessionId || !sessionManager.isEnabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:454:      dedupStats: { enabled: false, sessionId: null }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:458:  const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, results as Parameters<typeof sessionManager.filterSearchResults>[1]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:461:    sessionManager.markResultsSent(sessionId, filtered as Parameters<typeof sessionManager.markResultsSent>[1]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:466:    dedupStats: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:467:      ...dedupStats,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:468:      sessionId
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:511:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:512:    enableDedup: enableDedup = true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:521:    enableSessionBoost: enableSessionBoost = isSessionBoostEnabled(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:528:    profile,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:533:  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:538:    sessionId: normalizedScope.sessionId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:691:  // Phase C: Intent-to-profile auto-routing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:692:  // Explicit caller `profile` always takes precedence; auto-detect fills in when absent.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:693:  let effectiveProfile: string | undefined = profile;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:699:        console.error(`[memory-search] Intent-to-profile auto-routing: '${detectedIntent}' → profile '${autoProfile}'`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:702:      // Auto-profile is best-effort — never breaks search
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:714:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:744:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:745:    enableSessionBoost,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:797:      sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:798:      enableDedup,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:799:      enableSessionBoost,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:886:    if (sessionId && isSessionRetrievalStateEnabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:889:        retrievalSessionStateManager.updateGoal(sessionId, activeGoal);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:892:        retrievalSessionStateManager.setAnchors(sessionId, anchors);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:895:      const goalRefinement = refineForGoal(resultsForFormatting, sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1054:  if (sessionId && isSessionRetrievalStateEnabled() && !sessionManager.isEnabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1062:      const deduped = deduplicateWithSessionState(existingResults, sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1063:      data.results = deduped.results as SessionAwareResult[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1064:      data.count = deduped.results.length;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1065:      data.sessionDedup = deduped.metadata;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1071:  // Apply session deduplication AFTER cache
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1072:  if (sessionId && enableDedup && sessionManager.isEnabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1079:        console.warn('[memory-search] Failed to parse cached response for dedup:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1086:    // P1-018 — Validate response shape before dedup. If the cached response
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1087:    // Doesn't have the expected data.results array, log a warning and skip dedup
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1088:    // Rather than silently falling through to the un-deduped response.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1095:      console.warn('[memory-search] Cached response shape mismatch: missing "data" object, skipping dedup');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1097:      console.warn('[memory-search] Cached response shape mismatch: "data.results" is not an array, skipping dedup');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1101:      const { results: dedupedResults } = applySessionDedup(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1103:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1104:        enableDedup
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1108:      const dedupedCount = dedupedResults.length;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1109:      const filteredCount = originalCount - dedupedCount;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1116:      data.results = dedupedResults;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1117:      data.count = dedupedCount;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1119:      const dedupStats = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1121:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1123:        returnedCount: dedupedCount,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1129:      resultsData.dedupStats = dedupStats;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1132:        (resultsData.meta as Record<string, unknown>).dedupStats = dedupStats;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1146:  if (sessionId && isSessionRetrievalStateEnabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1159:        retrievalSessionStateManager.markSeen(sessionId, returnedIds);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1162:      data.sessionState = buildSessionStatePayload(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1208:        session_id: sessionId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1275:            sessionId: sessionId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1314:          trackQueryAndDetect(db, sessionId ?? null, normalizedQuery, queryId, shownIds);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1319:          logResultCited(db, sessionId ?? null, queryId, shownIds);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1325:  // REQ-D5-003: Apply presentation profile when flag is enabled and profile is specified.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1326:  // Phase C: effectiveProfile includes auto-routed profile from intent detection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1331:        const profiled = applyProfileToEnvelope(effectiveProfile, firstEntry.text);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1332:        if (profiled !== firstEntry.text) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1335:            content: [{ ...firstEntry, text: profiled }],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1338:      } catch (_profileError: unknown) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:92:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:661:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:688:      actor: sessionId ?? 'memory_validate',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:741:      sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:4:// T018: MCP tool handler for session_health — reports session
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:65:/** Handle session_health tool call */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:102:  const structuralContext = buildStructuralBootstrapContract('session_health');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:160:      producer: 'session_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:161:      sourceSurface: 'session_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:170:    sourceSurface: 'session_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:32:  profile?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:155:    const profile = (['quick', 'research', 'debug'].includes(args.profile ?? '') ? args.profile : undefined) as ContextArgs['profile'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:163:      profile,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:63:/** Find memories with similar embeddings for PE gating deduplication */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:64:function findSimilarMemories(embedding: Float32Array | null, options: { limit?: number; specFolder?: string | null; tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null } = {}): SimilarMemory[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:65:  const { limit = 5, specFolder = null, tenantId = null, userId = null, agentId = null, sessionId = null, sharedSpaceId = null } = options;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:101:        // H9 FIX: Filter by sessionId to prevent false duplicate/supersede decisions across sessions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:102:        if (!matchesScopedValue(sessionId, r.session_id)) continue;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:33:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:58:      sessionId: args.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:35:  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:48:      sessionId: scope?.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:379:  let profile = embeddings.getEmbeddingProfile() as EmbeddingProfile | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:405:  if (!profile) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:407:      // Resolve the lazy profile so health reflects the active runtime provider
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:409:      profile = await embeddings.getEmbeddingProfileAsync() as EmbeddingProfile | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:411:    } catch (profileError: unknown) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:412:      hints.push(`Embedding profile unavailable: ${sanitizeErrorForHint(toErrorMessage(profileError))}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:416:  const providerName = profile?.provider ?? providerMetadata.provider;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:417:  const providerModel = profile?.model ?? providerMetadata.model ?? embeddings.getModelName();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:418:  const providerDimension = profile?.dim ?? providerMetadata.dim ?? embeddings.getEmbeddingDimension();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:84:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:85:  enableDedup?: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:89:  profile?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:97:  resumed: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:99:  resumedContextCount: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:121:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:122:  enableDedup?: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:127:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:128:  profile?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:146:  resumed: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:155:  resumeHeuristicApplied: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:674:  resume: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:677:    strategy: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:709:    session_id: options.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:734:    sessionId: options.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:736:    enableDedup: options.enableDedup !== false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:737:    profile: options.profile,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:765:    sessionId: options.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:767:    enableDedup: options.enableDedup !== false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:768:    profile: options.profile,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:784:  const resumeAnchors = options.anchors || ['state', 'next-steps', 'summary', 'blockers'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:787:    query: input || 'resume work continue session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:798:    anchors: resumeAnchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:799:    sessionId: options.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:801:    enableDedup: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:802:    profile: options.profile,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:810:    strategy: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:811:    mode: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:812:    resumeAnchors: resumeAnchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:828:  const trustedSession = sessionManager.resolveTrustedSession(args.sessionId ?? null, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:837:      resumed: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:846:  const resumed = trustedSession.trusted;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:847:  const priorMode = resumed
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:850:  const counter = resumed
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:857:    resumed,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:883:  let resumeHeuristicApplied = false;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:898:    const hasResumeKeywords = /\b(resume|continue|pick up|where was i|what(?:'s| is) next)\b/i.test(normalizedInput);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:900:      session.resumed ||
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:901:      session.priorMode === 'resume' ||
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:909:      effectiveMode = 'resume';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:910:      resumeHeuristicApplied = true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:942:      resumeHeuristicApplied,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:986:    case 'resume':
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1108:    enableDedup: enableDedup = true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1142:  if (requested_mode !== 'resume') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1224:    resumed: resumedSession,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1234:      details: { requestId, layer: 'L1:Orchestration', requestedSessionId: args.sessionId ?? null },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1236:        hint: 'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1244:    resumed: resumedSession,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1246:    resumedContextCount: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1286:    sessionId: effectiveSessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1287:    enableDedup: enableDedup,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1291:    profile: args.profile,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1305:      resumed: resumedSession,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1314:    resumeHeuristicApplied,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1318:  // Phase C: Intent-to-profile auto-routing for memory_context.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1319:  // Explicit caller `profile` always takes precedence; auto-detect fills in when absent.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1321:  // support profile formatting — setting a profile there would be a no-op.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1322:  if (!options.profile && detectedIntent && effectiveMode !== 'quick' && isIntentAutoProfileEnabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1328:        options.profile = autoProfile;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1329:        console.error(`[memory-context] Intent-to-profile auto-routing: '${detectedIntent}' → profile '${autoProfile}'`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1332:      // Auto-profile is best-effort — never breaks context retrieval
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1338:    resumedSession,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1343:    queryHeuristicApplied: resumeHeuristicApplied,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1425:  // M1 FIX: Inject auto-resume context BEFORE budget enforcement
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1434:  if (autoResumeEnabled && effectiveMode === 'resume' && resumedSession) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1435:    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1436:    if (resumeContextItems.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1437:      sessionLifecycle.resumedContextCount = resumeContextItems.length;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1438:      (tracedResult0 as Record<string, unknown>).systemPromptContext = resumeContextItems.map((item) => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1497:        resumeHeuristicApplied,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:4:// Phase 020: Composite MCP tool that merges memory resume context,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:89:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:409:  // ── Sub-call 1: Memory context resume (skip in minimal mode) ──
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:416:        input: 'resume previous work continue session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:417:        mode: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:418:        profile: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:471:  // Phase 027: Structural bootstrap contract for resume surface
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:479:  // Keep live resume authoritative; cached continuity only appends bounded notes when every gate passes.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:482:    claudeSessionId: typeof args.sessionId === 'string' ? args.sessionId : undefined,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:485:    hints.push('Cached continuity summary accepted as additive resume context.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:511:      key: 'memory-resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:560:    kind: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:591:      resumePayload: payloadContract,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:28:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:79:    if (!args.sessionId || typeof args.sessionId !== 'string') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:80:      return errorResponse('sessionId is required and must be a string');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:112:        sessionId: args.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:172:              sessionId: args.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:62:| **Retrieval modes** | 5 | auto, quick, deep, focused, resume |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:74:| **Sessions** | Stateless | Working memory with attention decay, ~50% token savings via deduplication |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:85:The memory system exposes 47 MCP tools through 4 memory slash commands plus the borrowed recovery workflow in `/spec_kit:resume`. Think of commands as doors into the system. Each door opens access only to the tools it needs.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:93:| `/spec_kit:resume` | Continue or recover an interrupted spec-folder session through the broader memory/session recovery stack | Broad helper surface; primary chain uses 3 shared memory tools |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:105:Module/runtime profile in this package:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:278:| Intent weights | Each of the 7 task intents has its own channel weight profile | variable |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:301:**Intent classification** maps your query to one of 7 task types (`add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`, `find_spec`, `find_decision`). Each type has its own channel weight profile. A `find_decision` query boosts the causal graph channel. A `fix_bug` query boosts exact-match channels.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:416:**SHA-256 content-hash deduplication** -- recognizes unchanged files instantly and skips expensive reprocessing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:426:**Session deduplication** -- pushes down results you already saw. If you got a result 3 turns ago, new searches rank it lower. Saves approximately 50% of tokens on follow-up queries.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:465:**Mode-aware response profiles** -- formats results differently by situation. Quick lookup returns top answer only. Research returns full results with evidence. Resume returns state plus next-steps. Debug returns the full retrieval trace.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:545:**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:570:| `mode` | string | `auto` (default), `quick`, `deep`, `focused`, `resume` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:578:| `sessionId` | string | Session ID for deduplication across turns |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:581:| `enableDedup` | boolean | Skip memories already seen this session |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:599:##### `session_resume`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:601:Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:605:| `specFolder` | string | Scope resume to a specific spec folder |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:610:##### `session_bootstrap`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:612:Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:712:| `sessionId` | string | Session attribution |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:777:##### `session_health`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:960:| `sessionId` | string | Session identifier |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1086:| `profile` | string | Output density: `quick`, `research` or `debug` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1114:| `sessionId` | string | Filter by session |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1224:├── database/                  # Runtime SQLite artifacts and profile-specific DBs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1247:| `handlers/memory-save.ts` | Runs the save pipeline: validates structure, checks dedup/quality gates, generates embeddings, and stores the result. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1535:| Resume a session from scratch | `session_bootstrap` | Use as the first recovery call on session start or after `/clear` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1536:| Inspect the detailed merged resume payload | `session_resume` | Use when you want direct resume details without the full bootstrap wrapper |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts:68:  sessionId: string = 'replay-session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts:90:          session_id: sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts:99:        const statePath = getStatePath(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts:101:        const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:110:// T018: Session-level tracking for prime package and session_health
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:116:function recordToolCall(sessionId?: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:118:  if (typeof sessionId === 'string' && sessionId.trim().length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:119:    lastActiveSessionId = sessionId.trim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:132:function isSessionPrimed(sessionId: string): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:133:  return primedSessionIds.has(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:137:function markSessionPrimed(sessionId: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:138:  primedSessionIds.add(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:139:  lastActiveSessionId = sessionId;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:321:      FROM working_memory wm
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:460:    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:492:  sessionId?: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:494:  // Derive a session key from explicit sessionId or tool args.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:495:  const effectiveSessionId = sessionId
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:496:    ?? (typeof toolArgs.sessionId === 'string' ? toolArgs.sessionId : null)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:560: * Reset priming state. When called with a sessionId, clears only that session.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:563:function resetSessionPrimed(sessionId?: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:564:  if (sessionId) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:565:    primedSessionIds.delete(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:680:  // T018: Session tracking for session_health tool
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:91:        enableDedup: true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:101:  mode: z.enum(['auto', 'quick', 'deep', 'focused', 'resume']).optional(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:109:  sessionId: z.string().optional(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:110:  enableDedup: z.boolean().optional(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:115:  profile: z.enum(['quick', 'research', 'resume', 'debug']).optional(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:128:  sessionId: z.string().optional(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:129:  enableDedup: z.boolean().optional(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:135:  enableSessionBoost: z.boolean().optional(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:152:  profile: z.enum(['quick', 'research', 'resume', 'debug']).optional(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:190:  sessionId: z.string().optional(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:227:  sessionId: z.string().optional(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:309:  sessionId: z.string().optional(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:320:  sessionId: z.string().optional(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:373:  sessionId: z.string().optional(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:451:  session_bootstrap: getSchema({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:454:  session_health: getSchema({}) as unknown as ToolInputSchema,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455:  session_resume: getSchema({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:462:  memory_context: ['input', 'mode', 'intent', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors', 'profile'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:466:  memory_save: ['filePath', 'force', 'dryRun', 'skipPreflight', 'asyncEmbedding', 'tenantId', 'userId', 'agentId', 'sessionId', 'sharedSpaceId', 'provenanceSource', 'provenanceActor', 'governedAt', 'retentionPolicy', 'deleteAfter'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:472:  memory_validate: ['id', 'wasUseful', 'queryId', 'queryTerms', 'resultRank', 'totalResultsShown', 'searchMode', 'intent', 'sessionId', 'notes'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:478:  task_preflight: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore', 'knowledgeGaps', 'sessionId'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:479:  task_postflight: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore', 'gapsClosed', 'newGapsDiscovered', 'sessionId'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:487:  memory_get_learning_history: ['specFolder', 'sessionId', 'limit', 'onlyComplete', 'includeSummary'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:495:  session_bootstrap: ['specFolder'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:496:  session_health: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:497:  session_resume: ['specFolder', 'minimal'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:34:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:35:  enableDedup?: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:40:  profile?: 'quick' | 'research' | 'resume' | 'debug';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:62:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:63:  enableDedup?: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:66:  enableSessionBoost?: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:145:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:159:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:204:/** Arguments for session resume requests. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:264:  sessionId?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:276:  sessionId?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:282:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:104:    it('T520-9b: deduplicates symlinked specs roots', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:108:        const specFolder = path.join(canonicalSpecs, 'system-spec-kit', '900-dedup-check');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:130:    it('T520-9c: keeps specFolder filtering with root dedup', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:12:  // T018: Session tracking for session_health tool
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:60:  'session_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:61:  'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:62:  'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:81:    case 'session_health':             return handleSessionHealth();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:82:    case 'session_resume':             return handleSessionResume(parseArgs<SessionResumeArgs>(validateToolArgs('session_resume', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:83:    case 'session_bootstrap':          return handleSessionBootstrap(parseArgs<SessionBootstrapArgs>(validateToolArgs('session_bootstrap', args)));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/database/README.md:34:- Embedding-profile database: `context-index__voyage__voyage-4__1024.sqlite` (and `-wal`, `-shm` sidecars) — profile-specific vector store.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/database/README.md:70:- Embedding-profile database: `context-index__voyage__voyage-4__1024.sqlite` stores profile-specific vectors (naming convention: `context-index__<provider>__<model>__<dims>.sqlite`).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:128:  const sessionId = input.session_id ?? 'unknown';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:129:  hookLog('info', 'gemini:compact-cache', `PreCompress triggered for session ${sessionId} (trigger: ${input.trigger ?? 'unknown'})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:158:  updateState(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:184:  hookLog('info', 'gemini:compact-cache', `Cached compact context (${payload.length} chars) for session ${sessionId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:6:// based on the session source (compact, startup, resume, clear).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:18:import { getCachedSessionSummaryDecision, logCachedSummaryDecision } from '../../handlers/session-resume.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:43:function handleCompact(sessionId: string): OutputSection[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:44:  const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:45:  const pendingCompactPrime = readCompactPrime(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:47:    hookLog('warn', 'session-prime', `No cached compact payload for session ${sessionId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:50:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:58:    hookLog('warn', 'session-prime', `Rejecting stale compact cache for session ${sessionId} (cached at ${cachedAt})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:61:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:77:      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:96:    `- Memory: ${hasCachedContinuity ? 'session continuity available' : 'startup summary only (resume on demand)'}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:107:    `- Memory: ${hasCachedContinuity ? 'session continuity available' : 'startup summary only (resume on demand)'}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:115:  const sessionId = typeof input.session_id === 'string' ? input.session_id : undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:120:    claudeSessionId: sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:176:/** Handle source=resume: load resume context for continued session */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:177:function handleResume(sessionId: string): OutputSection[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:178:  const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:185:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:190:      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:216:  const sessionId = input.session_id ?? 'unknown';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:218:  hookLog('info', 'session-prime', `SessionStart triggered (source: ${source}, session: ${sessionId})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:225:      sections = handleCompact(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:232:    case 'resume':
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:233:      sections = handleResume(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:262:    clearCompactPrime(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:166:  it('T006b: canonical ID matching deduplicates numeric/string/mem-prefixed IDs', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-surrogates.vitest.ts:155:  it('deduplicates aliases', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-surrogates.vitest.ts:374:  it('deduplicates questions', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:1012:      // - ALLOWED by TM-04 (threshold 0.92 for dedup rejection)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:66:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:128:    claudeSessionId: typeof parsed.sessionId === 'string' ? parsed.sessionId : null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:10://   source: "startup" | "resume" | "clear"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:44:function handleCompact(sessionId: string): OutputSection[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:45:  const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:46:  const pendingCompactPrime = readCompactPrime(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:48:    hookLog('warn', 'gemini:session-prime', `No cached compact payload for session ${sessionId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:51:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:62:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:73:      content: 'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:142:/** Handle source=resume: load resume context */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:143:function handleResume(sessionId: string): OutputSection[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:144:  const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:149:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:155:    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:176:  const sessionId = input.session_id ?? 'unknown';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:178:  hookLog('info', 'gemini:session-prime', `SessionStart triggered (source: ${source}, session: ${sessionId})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:187:      sections = handleCompact(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:194:    case 'resume':
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:195:      sections = handleResume(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:214:    clearCompactPrime(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:68:export function getStatePath(sessionId: string): string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:69:  const safe = createHash('sha256').update(sessionId).digest('hex').slice(0, 16);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:83:export function loadState(sessionId: string): HookState | null {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:85:    const raw = readFileSync(getStatePath(sessionId), 'utf-8');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:170:export function saveState(sessionId: string, state: HookState): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:171:  const filePath = getStatePath(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:185:export function readCompactPrime(sessionId: string): HookState['pendingCompactPrime'] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:186:  const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:191:export function clearCompactPrime(sessionId: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:192:  const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:202:  if (!saveState(sessionId, nextState)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:203:    hookLog('warn', 'state', `Failed to clear pending compact payload for session ${sessionId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:212:export function readAndClearCompactPrime(sessionId: string): HookState['pendingCompactPrime'] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:213:  const prime = readCompactPrime(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:215:    clearCompactPrime(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:221:export function updateState(sessionId: string, patch: Partial<HookState>): HookState {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:222:  const existing = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:225:    claudeSessionId: sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:237:  if (!saveState(sessionId, state)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:238:    hookLog('warn', 'state', `State update was not persisted for session ${sessionId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:119:      validateToolInputSchema('memory_context', { input: 'resume', mode: 'invalid-mode' }, TOOL_DEFINITIONS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:322:  it('public and runtime schemas accept response profiles for memory_search', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:325:      profile: 'quick',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:338:      input: 'resume auth work',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:351:  it('public and runtime schemas accept response profiles for memory_context', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:353:      input: 'resume auth work',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:354:      profile: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:380:      prompt: 'resume auth work',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:18:    it('T209-2: setAttentionScore accepts (sessionId, memoryId, score) without throwing', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:78:      const strictPattern = /workingMemory\.setAttentionScore\(\s*(?:session_id|sessionId)\s*(as\s+string)?\s*,\s*match\.memoryId\s*,\s*[\d.]+\s*\)/;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:79:      const relaxedPattern = /workingMemory\.setAttentionScore\([^)]*(?:session_id|sessionId)/;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:3:import { applyProfileToEnvelope } from '../lib/response/profile-formatters';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:5:describe('response profile envelope preservation', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:29:  it('preserves non-results metadata fields for quick profile', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:30:    const profiled = JSON.parse(applyProfileToEnvelope('quick', baseEnvelope, true));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:32:    expect(profiled.data.totalCount).toBe(17);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:33:    expect(profiled.data.truncated).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:34:    expect(profiled.data.searchMetadata).toEqual({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:38:    expect(profiled.data.topResult).toMatchObject({ id: 1, title: 'Alpha' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:39:    expect(profiled.data.results).toBeUndefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:40:    expect(profiled.meta.responseProfile).toBe('quick');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:43:  it('preserves metadata fields for research profile', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:44:    const profiled = JSON.parse(applyProfileToEnvelope('research', baseEnvelope, true));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:46:    expect(profiled.data.totalCount).toBe(17);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:47:    expect(profiled.data.truncated).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:48:    expect(profiled.data.searchMetadata).toEqual({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:52:    expect(profiled.data.results).toHaveLength(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:53:    expect(profiled.data.count).toBe(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:10:| `session-prime.ts` | SessionStart | Injects context via stdout based on source (compact/startup/resume/clear) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:21:SessionStart(resume) → load prior session state
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/shared.ts:16:  // SessionStart fields (Gemini has startup/resume/clear; no native compact source)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/shared.ts:17:  source?: 'startup' | 'resume' | 'clear' | string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:312:    const expected = ['auto', 'quick', 'deep', 'focused', 'resume'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:353:  it('resume tokenBudget is 2000', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:355:    expect(memoryContext.CONTEXT_MODES.resume.tokenBudget).toBe(2000);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:62:  dedupStats: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:67:    sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:85:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:124:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:153:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:277:function hasSessionStateRecord(sessionId: string): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:283:    ).get(sessionId) as { 1?: number } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:292:function hasSentMemoryRecord(sessionId: string): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:298:    ).get(sessionId) as { 1?: number } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:307:function isTrackedSession(sessionId: string): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:308:  if (!sessionId || typeof sessionId !== 'string') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:312:  const normalizedSessionId = sessionId.trim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:330:function getSessionIdentityRecord(sessionId: string): {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:344:  `).get(sessionId) as Record<string, unknown> | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:406:      error: `sessionId "${normalizedSessionId}" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:416:      error: `sessionId "${normalizedSessionId}" is not bound to a corroborated server identity. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:426:      error: `sessionId "${normalizedSessionId}" is bound to a different ${mismatch}. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:508:function shouldSendMemory(sessionId: string, memory: MemoryInput | number): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:515:  if (!sessionId || typeof sessionId !== 'string') return true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:526:    const exists = stmt.get(sessionId, hash);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:536:  sessionId: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:542:  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(memories)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:553:    console.warn(`[session-manager] Database not initialized for batch dedup. dbUnavailableMode=${SESSION_CONFIG.dbUnavailableMode}. ${allow ? 'Allowing' : 'Blocking'} batch.`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:573:      const existingRows = existingStmt.all(sessionId) as { memory_hash: string }[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:580:          const insertResult = insertStmt.run(sessionId, hash, memory.id || null, now);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:594:        enforceEntryLimit(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:634:function markMemorySent(sessionId: string, memory: MemoryInput | number): MarkResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:637:  if (!sessionId || typeof sessionId !== 'string') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:638:    return { success: false, error: 'Valid sessionId is required' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:653:      stmt.run(sessionId, hash, memoryId, new Date().toISOString());
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:655:      enforceEntryLimit(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:666:function markMemoriesSentBatch(sessionId: string, memories: MemoryInput[]): MarkBatchResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:669:  if (!sessionId || !Array.isArray(memories) || memories.length === 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:670:    return { success: false, markedCount: 0, error: 'Valid sessionId and memories array required' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:685:        const result = insertStmt.run(sessionId, hash, memory.id || null, now);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:691:      enforceEntryLimit(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:708:function enforceEntryLimit(sessionId: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:709:  if (!db || !sessionId) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:715:    const row = countStmt.get(sessionId) as { count: number } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:730:    deleteStmt.run(sessionId, sessionId, excess);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:761: *   - working_memory: entries with last_focused older than threshold
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:782:  // 1. Clean stale working_memory entries
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:784:    const wmStmt = db.prepare('DELETE FROM working_memory WHERE last_focused < ?');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:791:      errors.push(`working_memory cleanup: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:824:      `[session-manager] Stale session cleanup: removed ${workingMemoryDeleted} working_memory, ` +
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:843:function clearSession(sessionId: string): CleanupResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:844:  if (!db || !sessionId) return { success: false, deletedCount: 0 };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:850:    const result = stmt.run(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:854:      workingMemory.clearSession(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:857:      console.warn(`[session-manager] Working memory cleanup for ${sessionId} failed: ${wmMsg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:868:function getSessionStats(sessionId: string): SessionStats {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:869:  if (!db || !sessionId) return { totalSent: 0, oldestEntry: null, newestEntry: null };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:880:    const row = stmt.get(sessionId) as { total_sent: number; oldest_entry: string | null; newest_entry: string | null } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:898:function filterSearchResults(sessionId: string, results: MemoryInput[]): FilterResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:899:  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(results)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:902:      dedupStats: { enabled: false, filtered: 0, total: results?.length || 0 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:907:  const shouldSendMap = shouldSendMemoriesBatch(sessionId, results, true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:929:    dedupStats: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:938:function markResultsSent(sessionId: string, results: MemoryInput[]): MarkBatchResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:939:  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(results) || results.length === 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:943:  return markMemoriesSentBatch(sessionId, results);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1020:function saveSessionState(sessionId: string, state: SessionStateInput = {}): InitResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1022:  if (!sessionId || typeof sessionId !== 'string') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1023:    return { success: false, error: 'Valid sessionId is required' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1057:      sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1079:function completeSession(sessionId: string): InitResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1080:  if (!db || !sessionId) return { success: false, error: 'Database or sessionId not available' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1088:    stmt.run(new Date().toISOString(), sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1092:      workingMemory.clearSession(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1095:      console.warn(`[session-manager] Working memory cleanup for ${sessionId} failed: ${wmMsg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1126:function recoverState(sessionId: string, scope: SessionIdentityScope = {}): RecoverResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1128:  if (!sessionId || typeof sessionId !== 'string') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1129:    return { success: false, error: 'Valid sessionId is required' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1143:    const row = stmt.get(sessionId) as Record<string, unknown> | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1156:      return { success: false, error: `sessionId "${sessionId}" is bound to a different ${mismatch}` };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1160:      sessionId: row.session_id as string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1182:      updateStmt.run(new Date().toISOString(), sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1219:        sessionId: row.session_id as string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1241:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1260:  const resumeCommand = specFolder
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1261:    ? `/spec_kit:resume ${specFolder}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1262:    : sessionId
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1263:      ? `memory_search({ sessionId: "${sessionId}" })`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1278:| **Session ID** | \`${sessionId || 'N/A'}\` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1304:${resumeCommand}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1324:function writeContinueSessionMd(sessionId: string, specFolderPath: string): CheckpointResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1325:  if (!sessionId || !specFolderPath) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1326:    return { success: false, error: 'sessionId and specFolderPath are required' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1330:    const recoverResult = recoverState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1333:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1355:  sessionId: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1359:  const saveResult = saveSessionState(sessionId, state);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1366:    return writeContinueSessionMd(sessionId, folderPath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:43:  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:75:      sessionId: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:77:        description: 'Session identifier for working memory and session deduplication (REQ-001). When provided with enableDedup=true, prevents duplicate memories from being returned in the same session (~50% token savings on follow-up queries).'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:79:      enableDedup: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:82:        description: 'Enable session deduplication (REQ-001). When true and sessionId provided, filters out already-sent memories.'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:93:      enableSessionBoost: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:95:        description: 'Enable session-based score boost from working_memory attention signals. Defaults to SPECKIT_SESSION_BOOST env flag.'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:111:      profile: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:113:        enum: ['quick', 'research', 'resume', 'debug'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:114:        description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:193:  description: '[L2:Core] Simplified search — query + optional limit + optional spec folder. Delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, limit 10). Use this when you want fast search without configuring 31 parameters.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:220:  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:312:      sessionId: { type: 'string', description: 'Optional session identifier for selection telemetry' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:473:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Path to spec folder (e.g., "specs/003-memory/077-upgrade")' }, taskId: { type: 'string', minLength: 1, description: 'Task identifier (e.g., "T1", "T2", "implementation")' }, knowledgeScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current knowledge level (0-100): How well do you understand the task requirements and codebase context?' }, uncertaintyScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current uncertainty level (0-100): How uncertain are you about the approach or implementation?' }, contextScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current context completeness (0-100): How complete is your understanding of relevant context?' }, knowledgeGaps: { type: 'array', items: { type: 'string' }, description: 'List of identified knowledge gaps (optional)' }, sessionId: { type: 'string', description: 'Optional session identifier' } }, required: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore'] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:479:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Path to spec folder (must match preflight)' }, taskId: { type: 'string', minLength: 1, description: 'Task identifier (must match preflight)' }, knowledgeScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task knowledge level (0-100)' }, uncertaintyScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task uncertainty level (0-100)' }, contextScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task context completeness (0-100)' }, gapsClosed: { type: 'array', items: { type: 'string' }, description: 'List of knowledge gaps closed during task (optional)' }, newGapsDiscovered: { type: 'array', items: { type: 'string' }, description: 'List of new gaps discovered during task (optional)' }, sessionId: { type: 'string', description: 'Optional session identifier. Required when multiple sessions share the same taskId and you need to target a specific learning cycle.' } }, required: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore'] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:570:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Spec folder path to get learning history for (required)' }, sessionId: { type: 'string', description: 'Filter by session ID (optional)' }, limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum records to return (default: 10, max: 100)' }, onlyComplete: { type: 'boolean', default: false, description: 'Only return records with both PREFLIGHT and POSTFLIGHT (complete learning cycles)' }, includeSummary: { type: 'boolean', default: true, description: 'Include summary statistics (averages, trends) in response' } }, required: ['specFolder'] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:691:      profile: { type: 'string', enum: ['quick', 'research', 'debug'], description: 'Output density profile' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:733:  name: 'session_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:738:// Phase 020: Composite session resume tool
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:740:  name: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:746:      specFolder: { type: 'string', description: 'Optional spec folder to scope the resume context' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:755:  name: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:756:  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:761:      specFolder: { type: 'string', description: 'Optional spec folder to scope the resume context' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:768:      resume: { type: 'object', description: 'Merged session_resume payload (spec folder, task status, memory context)' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:769:      health: { type: 'object', description: 'session_health payload (system status, database health, MCP connectivity)' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:772:      nextActions: { type: 'array', items: { type: 'string' }, description: 'Up to 3 recommended next actions derived from resume, health, and structural status' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:774:    required: ['resume', 'health', 'hints', 'nextActions'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:781:  description: '[L9:CoverageGraph] Idempotent upsert for coverage graph nodes and edges. Reducer writes graph deltas after each deep-loop iteration. Rejects self-loops, clamps weights to [0.0, 2.0], and merges metadata updates on repeated IDs. Requires specFolder, loopType, and sessionId for namespace isolation.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:787:      sessionId: { type: 'string', minLength: 1, description: 'Session identifier for namespace isolation (required)' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:796:            contentHash: { type: 'string', description: 'Optional content hash for deduplication' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:821:    required: ['specFolder', 'loopType', 'sessionId'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:835:      sessionId: { type: 'string', description: 'Optional session filter' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:9:/** Token budget for session priming (startup/resume) */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:17:  source?: 'startup' | 'resume' | 'clear' | 'compact';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:93:  const sessionId = input.session_id ?? 'unknown';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:94:  hookLog('info', 'gemini:session-stop', `SessionEnd hook fired for session ${sessionId} (reason: ${input.reason ?? 'unknown'})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:100:      updateState(sessionId, { lastSpecFolder: detectedSpec });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:108:    updateState(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:114:  hookLog('info', 'gemini:session-stop', `Session ${sessionId} stop processing complete`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:143:  it('G1: deduplicates when source_id equals target_id (same numeric value)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:262:  it('deduplicates FTS results using the highest composite score', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:3:description: "Session management for the Spec Kit Memory MCP server. Handles session deduplication, crash recovery and context persistence."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:6:  - "session deduplication"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:12:> Session management for the Spec Kit Memory MCP server. Handles deduplication and crash recovery with context persistence.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:40:| Token Savings | ~50% | On follow-up queries via deduplication |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:63: session-manager.ts  # Session deduplication, crash recovery, state management (~28KB)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:71:| `session-manager.ts` | Core session tracking, deduplication, state persistence, CONTINUE_SESSION.md |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:125:- Quick resume command
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:140:const { filtered, dedupStats } = filterSearchResults(sessionId, results);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:142:console.log(`Filtered ${dedupStats.filtered} duplicates`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:143:console.log(`Token savings: ${dedupStats.tokenSavingsEstimate}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:146:markResultsSent(sessionId, filtered);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:164:  console.log(`Session ${s.sessionId}: ${s.lastAction} in ${s.specFolder}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:174:saveSessionState(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:183:checkpointSession(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:194:| Check if should send | `shouldSendMemory(sessionId, memory)` | Before returning single memory |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:195:| Batch check | `shouldSendMemoriesBatch(sessionId, memories)` | Before returning multiple memories |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:196:| Mark single sent | `markMemorySent(sessionId, memory)` | After returning a memory |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:197:| Mark batch sent | `markMemoriesSentBatch(sessionId, memories)` | After returning multiple memories |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:198:| Clear session | `clearSession(sessionId)` | On explicit session end |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:199:| Get session stats | `getSessionStats(sessionId)` | For debugging/logging |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:200:| Recover state | `recoverState(sessionId)` | On session resume |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:201:| Complete session | `completeSession(sessionId)` | On normal session end |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:223:const stats = getSessionStats(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:227:clearSession(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:247:console.log(`Using session: ${sessionId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:254:| Session dedup disabled | Check `DISABLE_SESSION_DEDUP` env var |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:263:// Check if deduplication enabled
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:268:console.log(getSessionStats(sessionId));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:280:| `DISABLE_SESSION_DEDUP` | false | Set 'true' to disable deduplication |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:125:- startup and resume surfaces report freshness-aware graph status (`fresh`, `stale`, `empty`, `error`)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:137:| Codex | `.codex/config.toml` | Checked-in MCP config. Bootstrap parity via `session_bootstrap` MCP tool, not a native SessionStart hook. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:436:- `session_health` (session readiness check)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:437:- `session_bootstrap` (complete session bootstrap)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:438:- `session_resume` (combined session resume)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:539:- `resume`: Session recovery (loads previous state)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:596:When enabled, this feature adjusts the balance between vector similarity and keyword relevance based on the detected task type. It supports 7 task types: `add_feature`, `fix_bug`, `refactor`, `understand`, `plan`, `debug` and `resume`. For example, `fix_bug` boosts exact-match keyword signals while `understand` emphasizes semantic similarity.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:681:**Behind the scenes:** The AI calls `memory_context()` with `mode: "resume"` and `anchors: ["state", "next-steps"]`, then returns the previous session state.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:688:I need to add a new feature for user profiles
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:692:1. AI calls `memory_context({ input: "add user profiles", mode: "auto" })`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:726:**Behind the scenes:** Intent is classified as `understand`. Adaptive fusion applies a semantic-heavy weight profile, improving recall for conceptual queries over exact keyword matches.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:792:| Startup or resume shows graph `stale` | Freshness-aware startup detected drift before a structural read ran | Run a structural read to allow bounded inline repair, or run `code_graph_scan` for broader stale states |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1065:| v1.x | 2025 | Adaptive fusion, extended telemetry, artifact-class routing, append-only mutation ledger, typed retrieval contracts. Semantic search, trigger matching, intent-aware context, session deduplication. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:60:function runContextAutosave(sessionId: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:61:  const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:78:    observations: [`Auto-saved from Claude Stop hook for session ${sessionId}.`],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:120:  sessionId: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:124:  updateState(sessionId, patch);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:125:  touchedPaths.add(getStatePath(sessionId));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:177:  sessionId: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:181:  const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:184:  updateState(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:240:  const sessionId = input.session_id ?? 'unknown';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:241:  hookLog('info', 'session-stop', `Stop hook fired for session ${sessionId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:244:  const stateBeforeStop = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:257:        storeTokenSnapshot(sessionId, usage, cost);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:261:        recordStateUpdate(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:283:      recordStateUpdate(sessionId, { lastSpecFolder: detectedSpec }, touchedPaths);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:288:      recordStateUpdate(sessionId, { lastSpecFolder: detectedSpec }, touchedPaths);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:302:    recordStateUpdate(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:309:    runContextAutosave(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:312:  hookLog('info', 'session-stop', `Session ${sessionId} stop processing complete`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:3:vi.mock('../handlers/session-resume.js', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:7:      text: JSON.stringify({ status: 'ok', data: { memory: { resumed: true }, hints: ['resume ok'] } }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:30:    sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:35:import { handleSessionResume } from '../handlers/session-resume.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:45:  it('uses the full session_resume payload and records full bootstrap telemetry', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:51:    expect(parsed.data.resume.memory).toEqual({ resumed: true });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:54:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:58:      resume: expect.any(Object),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:63:    expect(parsed.data.hints).toEqual(expect.arrayContaining(['resume ok', 'health ok']));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:66:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:75:      recommendedAction: 'Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:76:      sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:89:    expect(parsed.data.nextActions).toContain('Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:9:  const sessionId = 'test-snapshot-store';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:12:  afterEach(() => { try { rmSync(getStatePath(sessionId)); } catch { /* ok */ } });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:15:    updateState(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:18:    const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:26:    updateState(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:29:    updateState(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:32:    const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:38:    updateState(sessionId, { lastSpecFolder: 'specs/test' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:39:    updateState(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:42:    const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:286:   Tests verify dedup runs regardless of the includeContent flag.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:323:  it('T002-2: non-chunk rows pass through without dedup (no parent_id)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:366:  it('T012-1: duplicate chunk dedup is identical for includeContent=false and includeContent=true', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:378:  const sessionId = input.session_id ?? 'unknown';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:379:  hookLog('info', 'compact-inject', `PreCompact triggered for session ${sessionId} (trigger: ${input.trigger ?? 'unknown'})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:393:    updateState(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:408:    hookLog('info', 'compact-inject', `Cached compact context (${payload.length} chars) for session ${sessionId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:416:  updateState(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:424:  hookLog('info', 'compact-inject', `Cached compact context (${payload.length} chars) for session ${sessionId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:34:  const sessionId = input.session_id ?? 'unknown';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:37:  const pendingCompactPrime = readCompactPrime(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:57:  const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:63:    'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:75:  clearCompactPrime(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:77:  hookLog('info', 'gemini:compact-inject', `Injected ${rawOutput.length} chars for session ${sessionId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:220:      enableDedup: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:221:      enableSessionBoost: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/causal-boost.vitest.ts:85:  it('T040/T044: applies bounded boost and deduplicates existing semantic results', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:80:  getSessionState: (sessionId: string) => MockSessionStateRow | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:144:          if (normalizedSql === 'DELETE FROM working_memory WHERE last_focused < ?') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:155:            for (const [sessionId, row] of sessionState.entries()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:157:                sessionState.delete(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:166:              sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:193:            const existing = sessionState.get(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:195:              session_id: sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:209:            sessionState.set(sessionId, nextRow);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:214:            const [updatedAt, sessionId] = args as [string, string];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:215:            const row = sessionState.get(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:238:            const [updatedAt, sessionId] = args as [string, string];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:239:            const row = sessionState.get(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:257:            const [sessionId] = args as [string];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:258:            return sessionState.has(sessionId) ? { 1: 1 } : undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:266:            const [sessionId] = args as [string];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:267:            return cloneRow(sessionState.get(sessionId));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:271:            const [sessionId] = args as [string];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:272:            const row = sessionState.get(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:335:    getSessionState: (sessionId: string) => cloneRow(sessionState.get(sessionId)),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:472:      expect(result.sessions.map((session) => session.sessionId).sort()).toEqual(['list-a', 'list-b']);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:480:        currentTask: 'resume crash recovery verification',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:504:        sessionId: 'session-123',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:508:        contextSummary: 'Need to resume from the saved recovery packet.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:518:      expect(content).toContain('/spec_kit:resume specs/022-hybrid-rag-fusion');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:523:        sessionId: 'session-with-data',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:705:        sessionId: 'recover-fields',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:788:      expect(result.sessions.map((session) => session.sessionId).sort()).toEqual(['recoverable-a', 'recoverable-b']);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:798:      expect(result.sessions.some((session) => session.sessionId === 'exclude-completed')).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:812:      const session = result.sessions.find((entry) => entry.sessionId === 'field-check');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:815:        sessionId: 'field-check',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:399:    it('T031-LEX-04: combined_lexical_search() deduplicates by ID', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:406:    it('T031-LEX-05: combined_lexical_search() deduplicates canonical IDs', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:600:    it('T031-BASIC-04: hybridSearch() deduplicates canonical IDs across channels', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:825:  it('C138-P0-T5: adaptive graph weight from fusion profile applied', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:15:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:66:const sessionId = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:147:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:224:  //   recovery (0.20)      — A memory_context({ mode: "resume" }) call is the most
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:34:function countSessionEntries(db: Database.Database, sessionId: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:35:  const row = db.prepare('SELECT COUNT(*) as count FROM working_memory WHERE session_id = ?')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:36:    .get(sessionId) as CountRow;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:50:      const sessionId = 'stress-session';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:63:          const ok = workingMemory.setAttentionScore(sessionId, memoryId, score);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:66:          const currentCount = countSessionEntries(db, sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:71:      const finalCount = countSessionEntries(db, sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:93:        INSERT INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:98:        INSERT INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:104:        INSERT INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:113:        FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:138:    // "Entity Extractor" is present but as proper_noun due to dedup
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:145:  it('deduplicates by normalized text', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:150:    // Should be deduplicated to a single entry
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:725:// 9. __testables.deduplicateEntities (internal helper)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:728:describe('__testables.deduplicateEntities', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:735:    const result = __testables.deduplicateEntities(raw);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:744:    const result = __testables.deduplicateEntities([]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:754:    const result = __testables.deduplicateEntities(raw);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:764:    const result = __testables.deduplicateEntities(raw);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:29:      sessionId: 'session-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:46:      sessionId: 'session-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:69:      sessionId: 'session-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:92:      sessionId: 'session-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:114:      sessionId: 'session-123',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:147:      sessionId: 'session-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:156:      sessionId: 'session-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:164:      sessionId: 'session-9',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:185:      sessionId: 'session-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:211:      sessionId: 'session-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:242:      sessionId: 'session-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:249:      sessionId: 'session-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:255:      sessionId: 'session-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:149:    || scope.sessionId
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:161:    const sessionMatches = !scope.sessionId || row.session_id === scope.sessionId;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:202:    enableDedup: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:203:    enableSessionBoost: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:276:  it('T2: deduplication preserves baseline-first ordering', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:376:  it('T6: deduplicates summary candidates by memory id and preserves baseline result', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:72:    sessionId: 'sess-abc123',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:129:      return ['[session] Context quality is CRITICAL. Consider running `memory_context({ mode: "resume" })` or `session_health` to diagnose.'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:132:      return ['[session] Context quality is degraded. Session may benefit from a `session_resume` call.'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:484: * Merge FTS and BM25 search results, deduplicating by ID and preferring FTS scores.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:615:  const deduped = new Map<string, HybridSearchResult>();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:645:      deduped.set(key, mergeRawCandidate(deduped.get(key), candidate));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:650:    Array.from(deduped.values()).sort((a, b) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:958:  const deduped = new Map<string, HybridSearchResult>();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:961:    const existing = deduped.get(canonicalId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:963:      deduped.set(canonicalId, r);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:967:  return Array.from(deduped.values())
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1861: * Normalize result IDs to a canonical key used for deduplication and source tracking.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2078: * Merge two result arrays, deduplicating by id and keeping the higher score.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2107: *   → Merge with Tier 1, dedup by id
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:103:| `sessionId` | `string?` | Optional session identifier |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:160:| `createTrace(query, sessionId?, intent?)` | `RetrievalTrace` | New trace with auto-generated traceId |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:191:Bootstrap and resume remain the authority surfaces for structural context. Packet `006` only adds the shared trust contract beside packet `005`'s certainty contract; it does not create a new graph-only owner surface.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:244:| Start trace | `createTrace(query, sessionId?)` | Beginning of a retrieval call |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:306:- Preserve the three axes distinctly through bootstrap or resume-facing payloads. Do not merge them into a single "graph trust" label during transport.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:311:- Current owner surfaces remain authoritative: shared payload sections, session bootstrap or resume consumers, and bridge-facing graph payloads.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:9:// T001-T008: Core session deduplication functionality
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:175:      const sessionId: string = 'test-session-T003';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:177:      const shouldSend: boolean = sessionManager.shouldSendMemory(sessionId, memory);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:182:      const sessionId: string = 'test-session-T003';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:183:      const shouldSend2: boolean = sessionManager.shouldSendMemory(sessionId, 999);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:195:      const sessionId: string = 'test-session-T004';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:198:      const firstCheck: boolean = sessionManager.shouldSendMemory(sessionId, memory);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:201:      const markResult: MarkResult = sessionManager.markMemorySent(sessionId, memory);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:204:      const secondCheck: boolean = sessionManager.shouldSendMemory(sessionId, memory);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:216:      const sessionId: string = 'test-session-T005';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:224:        const result: MarkResult = sessionManager.markMemorySent(sessionId, memory);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:231:        expect(sessionManager.shouldSendMemory(sessionId, memory)).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:236:      `).get(sessionId) as { count: number };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:280:      const sessionId: string = 'test-session-T007';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:290:      sessionManager.markMemorySent(sessionId, searchResults[1]); // 502
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:291:      sessionManager.markMemorySent(sessionId, searchResults[3]); // 504
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:293:      const { filtered, dedupStats }: FilterResult = sessionManager.filterSearchResults(sessionId, searchResults);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:302:      expect(dedupStats.filtered).toBe(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:303:      expect(dedupStats.total).toBe(5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:304:      expect(dedupStats.enabled).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:308:      const sessionId: string = 'test-session-T007b';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:314:      const { filtered, dedupStats }: FilterResult = sessionManager.filterSearchResults(sessionId, [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:324:      expect(dedupStats.filtered).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:325:      expect(dedupStats.total).toBe(3);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:326:      expect(dedupStats.enabled).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:331:  describe('T008: dedup_savings_tokens calculation accuracy', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:337:      const sessionId: string = 'test-session-T008';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:346:      sessionManager.markMemorySent(sessionId, searchResults[0]); // 601
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:347:      sessionManager.markMemorySent(sessionId, searchResults[1]); // 602
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:348:      sessionManager.markMemorySent(sessionId, searchResults[2]); // 603
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:350:      const { filtered, dedupStats }: FilterResult = sessionManager.filterSearchResults(sessionId, searchResults);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:352:      expect(dedupStats.tokenSavingsEstimate).toBeTruthy();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:355:      expect(dedupStats.tokenSavingsEstimate).toBe('~600 tokens');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:359:      const sessionId: string = 'test-session-T008-zero';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:366:      const { dedupStats: noSavingsStats }: FilterResult = sessionManager.filterSearchResults(sessionId, searchResults);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:421:      // Same content_hash → same dedup hash regardless of path
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:82:      enableDedup: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:83:      enableSessionBoost: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:366:        metadata: { applied: false, enabled: true, sessionId: 'test-001', boostedCount: 0, maxBoostApplied: 0 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:375:    input.config.enableSessionBoost = true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:376:    input.config.sessionId = 'test-001';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:407:    input.config.enableSessionBoost = false;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:408:    input.config.sessionId = 'test-001';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:4:// Verifies that the fast-path dedup check in indexMemoryFile()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:16:import { checkContentHashDedup, checkExistingRow } from '../handlers/save/dedup';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:28: * needed for the content-hash dedup check.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:77:    sessionId?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:107:    scope.sessionId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:143:     Core dedup logic
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:169:        'specs/dedup-test',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:170:        '/specs/dedup-test/memory/original.md',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:176:      const result = checkContentHashDedup(db, buildParsedMemory('specs/dedup-test', content), false, []);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:181:      expect(result!.message).toContain('/specs/dedup-test/memory/original.md');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:184:    it('T054-4: Changing 1 character produces a different hash — dedup does NOT trigger', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:207:    it('T054-5: Pending embeddings are excluded from dedup check', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:236:    it('T054-6aa: Cross-tenant duplicates do not dedup when governance scope differs', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:238:      const folder = 'specs/governed-dedup';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:242:        '/specs/governed-dedup/memory/tenant-a.md',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:261:    it('T054-6ab: Matching governance scope still dedups identical content', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:263:      const folder = 'specs/governed-dedup-match';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:267:        '/specs/governed-dedup-match/memory/tenant-a.md',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:287:    it('T054-6b: Partial parent rows remain dedup-eligible', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:288:      const content = 'Chunked parent content for partial dedup.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:305:    it('T054-6c: Invalid terminal status complete is excluded from dedup', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:306:      const content = 'Legacy complete status should not dedup.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:383:    it('T320-2: Content-hash dedup uses exact scope clauses instead of nullable OR predicates', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:514:    it('T079-1: Force saves skip same-path content-hash dedup rejection', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:541:      const content = 'Legacy rows with null canonical paths must still dedup across paths.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:750:              spec_folder: 'specs/dedup',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:757:              spec_folder: 'specs/dedup',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:773:      spec_folder: 'specs/dedup',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:780:      spec_folder: 'specs/dedup',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:789:describe('T008: includeContent-independent dedup in hybrid search path', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:790:  it('deduplicates canonical IDs when includeContent=false (default production path)', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:795:      'dedup regression query',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:812:  it('deduplicates canonical IDs when includeContent=true', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:817:      'dedup regression query',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:835:  it('returns identical deduped canonical IDs for includeContent=false vs true', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:839:    const defaultPath = await hybridSearch.hybridSearchEnhanced('dedup regression query', embedding, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:845:    const includeContentPath = await hybridSearch.hybridSearchEnhanced('dedup regression query', embedding, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:14:  function setScoreDirectly(sessionId: string, memoryId: number, score: number) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:16:      INSERT OR REPLACE INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:18:    `).run(sessionId, memoryId, score);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:21:  function getScoreDirectly(sessionId: string, memoryId: number): number | null {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:23:      'SELECT attention_score FROM working_memory WHERE session_id = ? AND memory_id = ?'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:24:    ).get(sessionId, memoryId) as { attention_score: number } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:28:  function countEntries(sessionId: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:30:      'SELECT COUNT(*) as count FROM working_memory WHERE session_id = ?'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:31:    ).get(sessionId) as { count: number } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:79:    const sessionId = 'decay-floor-test';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:82:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:88:      setScoreDirectly(sessionId, 1, 0.06);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:89:      wm.batchUpdateScores(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:91:      const scoreAfter1 = getScoreDirectly(sessionId, 1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:100:        wm.batchUpdateScores(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:103:      const scoreAfterMany = getScoreDirectly(sessionId, 1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:109:      const count = countEntries(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:115:    const sessionId = 'delete-threshold-test';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:118:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:122:      setScoreDirectly(sessionId, 2, 0.05);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:123:      wm.batchUpdateScores(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:125:      const scoreAtFloor = getScoreDirectly(sessionId, 2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:130:      setScoreDirectly(sessionId, 3, 0.005);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:131:      wm.batchUpdateScores(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:133:      const scoreClamped = getScoreDirectly(sessionId, 3);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:142:      const deleteSessionId = sessionId + '-delete-test';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:143:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(deleteSessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:147:        DELETE FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:156:    const sessionId = 'floor-stability-test';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:159:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:163:      setScoreDirectly(sessionId, 4, 0.15);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:166:        wm.batchUpdateScores(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:169:      const finalScore = getScoreDirectly(sessionId, 4);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:195:    const sessionId = 'mixed-scores-test';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:198:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:202:      setScoreDirectly(sessionId, 5, 0.8);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:203:      setScoreDirectly(sessionId, 6, 0.05);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:204:      setScoreDirectly(sessionId, 7, 0.005);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:205:      setScoreDirectly(sessionId, 8, 0.03);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:207:      wm.batchUpdateScores(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:209:      const s5 = getScoreDirectly(sessionId, 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:215:      const s6 = getScoreDirectly(sessionId, 6);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:220:      const s7 = getScoreDirectly(sessionId, 7);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:228:      const s8 = getScoreDirectly(sessionId, 8);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:441:    it('MockEmbeddingProvider.getProfile() returns valid profile', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:443:      const profile = mock.getProfile();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:444:      expect(profile.provider).toBe('mock');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:445:      expect(profile.dim).toBe(1024);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:20:        ? 'session_bootstrap'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:21:        : kind === 'resume'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:22:          ? 'session_resume'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:23:          : 'session_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:36:    const resume = makePayload('resume', 'resume summary');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:41:      resumePayload: resume,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:53:    expect(plan.compaction?.hook).toBe('experimental.session.compacting');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:57:    const payload = makePayload('resume', 'resume summary');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:58:    expect(coerceSharedPayloadEnvelope(payload)?.kind).toBe('resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:53:      const sessionId = 'ses/sion/../bad';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:54:      const path = getStatePath(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:57:      expect(path).toContain(createHash('sha256').update(sessionId).digest('hex').slice(0, 16));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:575:        sessionId: normalizedScope.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:53:  it('SS01: running → run (-ing removed + double-consonant dedup)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:86:  it('SS09: RUNNING → run (lowercased + stemmed + double-consonant dedup)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-boost.vitest.ts:9:    CREATE TABLE working_memory (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-boost.vitest.ts:45:  it('T010/T011: getAttentionBoost reads working_memory rows by session and IDs', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-boost.vitest.ts:49:      INSERT INTO working_memory (session_id, memory_id, attention_score)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-boost.vitest.ts:74:      INSERT INTO working_memory (session_id, memory_id, attention_score)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:88:        sessionId: 'sess-123',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:141:        sessionId: 'sess-456',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:155:      expect(sel.context.sessionId).toBe('sess-456');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:431:    it('deduplicates user selections by query_id:memory_id', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:133:    sessionId: undefined,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:134:    enableDedup: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:135:    enableSessionBoost: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/ops/README.md:32:- **File Watcher** monitors spec folders for Markdown file changes and triggers debounced re-indexing with content-hash deduplication.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/ops/README.md:51:- Content-hash deduplication: SHA-256 hash comparison prevents re-indexing unchanged files.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposition.vitest.ts:55:  it('deduplicates overlapping results when merging facet coverage pools', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:50:    tools: ['memory_context', 'session_resume', 'session_bootstrap']
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:68:    tools: ['memory_list', 'memory_stats', 'memory_health', 'session_health']
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/community-search.vitest.ts:120:  it('deduplicates member IDs across communities', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:38:| Quality Gate Layers | 3 | Structural, content quality, semantic dedup |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:50:| **Save Quality Gate** | 3-layer pre-storage validation (structural, content quality scoring, semantic dedup). Behind `SPECKIT_SAVE_QUALITY_GATE` flag |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:60: save-quality-gate.ts # 3-layer pre-storage quality gate (structural, content, semantic dedup)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:69:| `save-quality-gate.ts` | 3-layer pre-storage quality gate: structural validation, content quality scoring (title, triggers, length, anchors, metadata, signal density), and semantic dedup. Behind `SPECKIT_SAVE_QUALITY_GATE` flag with 14-day warn-only graduation period |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:181:| `checkSemanticDedup(params)` | Layer 3: semantic dedup check |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:204:  it('markDirty deduplicates repeated node IDs', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:487:  it('deduplicates repeated technologies', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:199:  it('deduplicates channels across sources and source fields', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:88:  // SUITE: Summary stats respect sessionId filter
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:89:  describe('T503: Summary stats respect sessionId filter', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:90:    it('T503-01: sessionId stats filter — totalTasks=1', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:103:        sessionId: sessA,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:120:        sessionId: sessB,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:130:      // Query with sessionId = sessA
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:133:        sessionId: sessA,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:143:    it('T503-01b: sessionId records filter consistent', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:157:        sessionId: sessA,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:173:        sessionId: sessB,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:185:        sessionId: sessA,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:192:      const allMatch = data.learningHistory.every(row => row.sessionId === sessA);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:197:    it('T503-01c: sessionId filter normalizes whitespace to match stored records', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:200:      const sessionId = uniqueId('sess-trimmed');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:209:        sessionId: `  ${sessionId}  `,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:217:        sessionId: `  ${sessionId}  `,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:222:        sessionId: `  ${sessionId}  `,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:228:      expect(data.learningHistory[0].sessionId).toBe(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:292:  // SUITE: Combined sessionId + onlyComplete filters
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:293:  describe('T503: Combined sessionId + onlyComplete filters', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:306:        sessionId: sessC,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:323:        sessionId: sessC,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:329:        sessionId: sessC,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:353:        sessionId: sessC,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:369:        sessionId: sessC,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:374:        sessionId: sessC,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:10:// - Layer 3: Semantic dedup (cosine similarity against existing)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:53:/** Result from Layer 3: Semantic dedup */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:103:/** Semantic dedup similarity threshold: above this, reject as near-duplicate */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:310: * 0.92 dedup) remain enforced.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:734:    console.warn('[quality-gate] Semantic dedup check failed:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:742:      reason: `Semantic dedup check error: ${message}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:817:  // Layer 3: Semantic dedup (only if embedding and findSimilar are available)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/concept-routing.vitest.ts:47:  it('deduplicates repeated tokens', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/concept-routing.vitest.ts:132:  it('deduplicates concepts (multiple aliases -> same canonical)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposer.vitest.ts:111:  it('deduplicates identical fragments', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposer.vitest.ts:157:  it('deduplicates items appearing in multiple pools', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:23:  sessionId: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:31: * When enabled, session attention scores from working_memory are used
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:36:function isEnabled(_sessionId?: string | null): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:44:function normalizeSessionId(sessionId: string | null | undefined): string | null {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:45:  if (typeof sessionId !== 'string') return null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:46:  const trimmed = sessionId.trim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:81:function getAttentionBoost(sessionId: string | null | undefined, memoryIds: number[]): Map<number, number> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:83:  if (!isEnabled(sessionId) || !db) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:87:  const normalizedSessionId = normalizeSessionId(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:97:      FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:139:  sessionId: string | null | undefined
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:141:  const normalizedSessionId = normalizeSessionId(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:145:    sessionId: normalizedSessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:315:      prompt: 'resume auth work',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:30:      sessionId: 'sess-a',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:38:      sessionId: 'sess-b',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:47:      sessionId: 'sess-b',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:76:  it('T081 requires sessionId when multiple open baselines share a task_id', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:83:      sessionId: 'sess-a',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:91:      sessionId: 'sess-b',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:101:      message: expect.stringContaining('Provide sessionId'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:112:      sessionId: 'repeat-session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:120:      sessionId: 'repeat-session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:129:      sessionId: 'repeat-session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:137:      sessionId: 'repeat-session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:816:  it('S4-INT-23: Quality gate semantic dedup threshold (0.92) > reconsolidation merge threshold (0.88)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:817:    // This is a critical invariant: the quality gate's semantic dedup threshold
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:830:  it('S4-INT-25: Similarity range [0.88, 0.92) is valid for merge-without-dedup-rejection', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:844:  it('S4-INT-26: Similarity >= 0.92 triggers both dedup rejection AND merge', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:151:    expect(brief.startupSurface).toContain('- Memory: startup summary only (resume on demand)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:704:      (a: string) => a.includes('/spec_kit:resume') || a.includes('recovery')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:269:      const dedupModule = await import('../handlers/save/dedup');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:270:      const checkExistingRowSpy = vi.spyOn(dedupModule, 'checkExistingRow').mockReturnValue(null);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:271:      const checkContentHashDedupSpy = vi.spyOn(dedupModule, 'checkContentHashDedup').mockReturnValue(null);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:460:      vi.doMock('../handlers/save/dedup', async (importOriginal) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:461:        const actual = await importOriginal<typeof import('../handlers/save/dedup')>();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:615:        vi.doUnmock('../handlers/save/dedup');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1135:    it('passes same-path exclusion into content-hash dedup after unchanged miss', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1175:    it('passes governance scope into TM-04 semantic dedup candidate lookup', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1241:          sessionId: 'session-a',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1254:          sessionId: 'session-a',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1310:          sessionId: 'session-p',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1327:          sessionId: 'session-p',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:2010:    it('T-dedup-canonical: canonical-equivalent paths treated as same memory', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:77: * Results are deduplicated by normalized text with summed frequencies.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:80: * @returns Array of extracted entities, deduplicated and frequency-counted.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:121:  return deduplicateEntities(raw);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:495:function deduplicateEntities(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:517:  deduplicateEntities,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:39:import { handleSessionResume } from '../handlers/session-resume.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:45:describe('session-resume handler', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:65:    expect(parsed.data.payloadContract.kind).toBe('resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:66:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:108:    expect(parsed.data.hints.some((h: string) => h.includes('Memory resume failed'))).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:121:  it('records bootstrap telemetry for full resume requests', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:4:// Feature catalog: Graph calibration profiles and community thresholds
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:8://   cap enforcement, and calibration profile presets.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:18:// Feature catalog: Graph calibration profiles and community thresholds
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:36:/** Named calibration profile controlling graph and community parameters. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:114:/** Scoring context that a calibration profile can be applied to. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:146:/** Default conservative profile --- all caps at baseline values. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:155:/** Aggressive profile --- tighter caps, stricter Louvain gates. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:318: * Ensures Stage 2 graph bonus never exceeds the profile's graphWeightCap.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:334: * Applies the profile's graphWeightCap and N2a/N2b caps.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:337: * @param profile - Calibration profile to apply (defaults to DEFAULT_PROFILE).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:342:  profile: CalibrationProfile = DEFAULT_PROFILE,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:345:    graphWeightBoost: applyGraphWeightCap(context.graphWeightBoost, profile.graphWeightCap),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:346:    n2aScore: Math.min(Math.max(0, context.n2aScore), profile.n2aCap),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:347:    n2bScore: Math.min(Math.max(0, context.n2bScore), profile.n2bCap),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:357: * Load the active calibration profile from environment or use default.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:371:  const profileName = process.env.SPECKIT_CALIBRATION_PROFILE_NAME?.toLowerCase().trim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:374:  if (profileName === 'aggressive') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:400: * Apply a calibration profile to a scoring context.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:404: * @param profile - Profile to apply (defaults to loaded profile).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:409:  profile?: CalibrationProfile,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:415:  const activeProfile = profile ?? loadCalibrationProfile();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:431: * @param thresholds     - Activation thresholds (defaults from loaded profile).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:473: * Extract Louvain thresholds from the loaded calibration profile.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:476:  const profile = loadCalibrationProfile();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:478:    minDensity: profile.louvainMinDensity,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:479:    minSize: profile.louvainMinSize,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:56:      FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:76:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:81:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:88:    const row = db.prepare('SELECT attention_score FROM working_memory WHERE session_id = ? AND memory_id = ?').get('s2', 3) as {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:100:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:104:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:108:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:117:      FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:135:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:139:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:145:    const deleted = db.prepare('SELECT COUNT(*) AS count FROM working_memory WHERE session_id = ? AND memory_id = ?').get('s3', 5) as {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:150:    const floored = db.prepare('SELECT attention_score FROM working_memory WHERE session_id = ? AND memory_id = ?').get('s3', 6) as {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:161:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:167:    const wrapped = db.prepare('SELECT event_counter, mention_count FROM working_memory WHERE session_id = ? AND memory_id = ?').get('s4', 7) as {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:175:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:181:    const decayed = db.prepare('SELECT attention_score FROM working_memory WHERE session_id = ? AND memory_id = ?').get('s4', 8) as {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:193:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:207:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:214:    const row = db.prepare('SELECT attention_score FROM working_memory WHERE session_id = ? AND memory_id = ?').get('s-disabled', 13) as {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:34:    expect(trace.sessionId).toBeUndefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:38:  it('createTrace includes optional sessionId and intent', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:41:    expect(trace.sessionId).toBe('sess-123');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:236:      sessionId: 'session-id',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:263:    expect(sanitizedRecord.sessionId).toBeUndefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:330:- Purpose: Owns session deduplication, session-state persistence, and crash-recovery support. It is the boundary for request/session continuity rather than retrieval policy itself.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:332:  - `session-manager.ts` — session-state lifecycle, dedup tracking, cleanup, and recovery helpers.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:384:  - `canonical-path.ts` — canonical path keying used for deduplication and identity.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:164:        meta?: { sessionLifecycle?: { effectiveSessionId?: string }; sessionId?: string };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:165:        data?: { sessionId?: string };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:171:      const fromMeta = parsed?.meta?.sessionId;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:175:      const fromData = parsed?.data?.sessionId;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:265:  const sessionId = resolveSessionId(result);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:267:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:278:    console.error(`[extraction-adapter] Inserted working_memory item for memory ${memoryId} (${matched.rule.id})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:105:   2. extractKeywords — stop word filtering and deduplication
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:134:  it('deduplicates identical keywords', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:14:      sessionId: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:43:  it('normalizes sessionId before filtering learning history queries', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:50:      sessionId: 'normalized-session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:58:      sessionId: 'normalized-session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:63:      sessionId: '  normalized-session  ',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:71:      sessionId: 'normalized-session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:108:      enableDedup: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:109:      enableSessionBoost: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:549:  it('T005-01: computePrecision deduplicates repeated relevant IDs', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:555:  it('T005-02: computeF1 matches harmonic mean of deduped precision and recall', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:115:| **Deduplication** | Results deduplicated by normalized text with summed frequencies |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:113: *   2. Lowercase and deduplicate.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:104:| **Recency** | 0.40 | Days since last update (primary for "resume work") |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:2:// 15 tests: weight profiles, sum<=1, deterministic output,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:65:  // ---- T1: Weight profiles per intent ----
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:107:  it('T6: all weight profiles sum to <= 1.0', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:320:    it('C138-T4: all 7 intent types produce valid weight profiles', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:333:  describe('T019: graphWeight and graphCausalBias profiles', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:336:    it('T019-1: all 5 profiles have a numeric graphWeight field', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:338:        const profile = INTENT_WEIGHT_PROFILES[name];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:339:        expect(profile, `Profile "${name}" must exist`).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:340:        expect(typeof profile.graphWeight, `Profile "${name}" graphWeight must be a number`).toBe('number');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:344:    it('T019-2: all 5 profiles have a numeric graphCausalBias field', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:346:        const profile = INTENT_WEIGHT_PROFILES[name];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:347:        expect(profile, `Profile "${name}" must exist`).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:348:        expect(typeof profile.graphCausalBias, `Profile "${name}" graphCausalBias must be a number`).toBe('number');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:354:      for (const [name, profile] of Object.entries(allProfiles)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:355:        const gw = profile.graphWeight!;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:356:        const gcb = profile.graphCausalBias!;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:365:      const profile = INTENT_WEIGHT_PROFILES['find_spec'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:366:      expect(profile.graphWeight, `find_spec.graphWeight (${profile.graphWeight}) must be >= 0.25`).toBeGreaterThanOrEqual(0.25);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:370:    // The debug profile was erroneously included and has been removed from INTENT_WEIGHT_PROFILES.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:68:    vi.doMock('../handlers/session-resume.js', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:212:describe('session_bootstrap authority preservation', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:223:  it('keeps bootstrap and resume authoritative while surfacing the nudge separately', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:224:    vi.doMock('../handlers/session-resume.js', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:231:              memory: { resumed: true },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:232:              hints: ['resume ok'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:234:                kind: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:249:                  producer: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:250:                  sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:281:        sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:291:      preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:296:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:608:  it('reindexes symlinked files via their resolved path and deduplicates unchanged aliases', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:375:  it('R11-TE05: case-insensitive deduplication', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:526:  it('R11-CO06b: applyLearnedTriggers deduplicates repeated terms within one call', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/phase2-integration.vitest.ts:89:  it('T048: Read tool result passes extraction/redaction into working_memory', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/phase2-integration.vitest.ts:96:      FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:199:      'session_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:200:      'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:201:      'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:299:      'session_health', 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:316:    it('T16d: only session_health is excluded from tool-call tracking', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:317:      expect(sourceCode).toMatch(/if \(name !== 'session_health'\) \{/)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:318:      expect(sourceCode).not.toMatch(/name !== 'session_health' && name !== 'session_bootstrap'/)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:724:          sessionId: null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1051:              arguments: { query: 'recent issues', sessionId: 'sess-sticky-1' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1119:    it('T000g: memory_context resume mode invokes TM-05 compaction hook at runtime', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1132:        triggered: [{ memory_id: 11, matched_phrases: ['resume'] }],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1140:          params: { name: 'memory_context', arguments: { input: 'session resume context', mode: 'resume' } },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1146:      expect(autoSurfaceAtCompactionMock).toHaveBeenCalledWith('session resume context')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1153:    it('T000h: memory_context non-resume mode keeps SK-004 memory-aware path', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2204:    it('T64cc: startupScan skips inaccessible roots and deduplicates resolved paths', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-ingest.vitest.ts:150:  it('start deduplicates normalized paths before creating the job', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-ingest.vitest.ts:152:      id: 'job_deduped',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-ingest.vitest.ts:176:    expect(envelope.hints).toContain('Duplicate input paths were deduplicated before queueing');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:80:    const contract = buildStructuralBootstrapContract('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:86:    expect(contract.sourceSurface).toBe('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:103:    const contract = buildStructuralBootstrapContract('session_resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:108:    expect(contract.recommendedAction).toContain('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:109:    expect(contract.sourceSurface).toBe('session_resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:123:    const contract = buildStructuralBootstrapContract('session_health');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:126:    expect(contract.sourceSurface).toBe('session_health');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:140:    const surfaces = ['auto-prime', 'session_bootstrap', 'session_resume', 'session_health'] as const;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:164:    const contract = buildStructuralBootstrapContract('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:8:describe('hook-state session resume', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:9:  const sessionId = 'test-resume-session';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:12:  afterEach(() => { try { rmSync(getStatePath(sessionId)); } catch { /* ok */ } });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:14:  it('recovers session state for resume', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:15:    updateState(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:19:    const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:32:  it('preserves compact prime across resume', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:33:    updateState(sessionId, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:37:    const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:43:    updateState(sessionId, { lastSpecFolder: 'specs/a' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:44:    updateState(sessionId, { lastSpecFolder: 'specs/b' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:45:    const state = loadState(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:46:    expect(state!.claudeSessionId).toBe(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:441:    it('3.5.2 deduplicates across rows', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:116:      CREATE TABLE IF NOT EXISTS working_memory (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:430:          snapshot: ['memory_index', 'working_memory'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:449:          working_memory: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:76:      CREATE TABLE IF NOT EXISTS working_memory (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:120:        INSERT INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:125:        INSERT INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:155:      const wmBefore = expectDefined(testDb.prepare<unknown[], CountRow>('SELECT COUNT(*) as cnt FROM working_memory').get());
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:158:      testDb.prepare('DELETE FROM working_memory').run();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:159:      const wmAfterClear = expectDefined(testDb.prepare<unknown[], CountRow>('SELECT COUNT(*) as cnt FROM working_memory').get());
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:169:      const wmAfterRestore = testDb.prepare<unknown[], WorkingMemoryRow>('SELECT * FROM working_memory ORDER BY id').all();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:174:      const wmAfterRestore = testDb.prepare<unknown[], WorkingMemoryRow>('SELECT * FROM working_memory ORDER BY id').all();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:186:        INSERT OR REPLACE INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:195:        "SELECT * FROM working_memory WHERE session_id = 'session-beta'"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:199:      const wmAfterRestore = expectDefined(testDb.prepare<unknown[], CountRow>('SELECT COUNT(*) as cnt FROM working_memory').get());
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:219:      testDb.prepare('DELETE FROM working_memory').run();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:609: * Phase C: Intent-to-profile auto-routing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:610: * Maps detected intent types to the most appropriate response profile.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:611: * Used when no explicit profile is specified by the caller.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:624: * Get the auto-routed response profile for a detected intent.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:627: * @returns Response profile name or null if no mapping exists
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:20:  profile?: 'quick' | 'research' | 'debug';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:69:  const nodeLimit = args.profile === 'quick' ? 10 : args.profile === 'debug' ? 30 : 20;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mmr-reranker.vitest.ts:3:// Verifies dedup, lambda tuning, N-cap, performance, and limits.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mmr-reranker.vitest.ts:43:  // ---- T1: Identical candidates get deduplicated ----
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:127:    it('migrates legacy working_memory foreign keys to ON DELETE SET NULL', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:140:          CREATE TABLE working_memory (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:156:          PRAGMA foreign_key_list(working_memory)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:159:          PRAGMA table_info(working_memory)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:171:    it('preserves working_memory rows as detached entries when a memory is deleted', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:184:          CREATE TABLE working_memory (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:203:          INSERT INTO working_memory (session_id, memory_id, attention_score)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:212:          FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:386:  function getExtractedRow(database: TestDatabase, sessionId: string, memoryId: number): ExtractedRow | undefined {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:396:      FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:398:    `).get(sessionId, memoryId) as ExtractedRow | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:401:  it('init creates order-aligned working_memory indexes', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:405:      const indexNames = (database.prepare(`PRAGMA index_list(working_memory)`).all() as Array<{ name: string }>)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:422:      const sessionId = 'wm-provenance-session';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:427:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:438:      const row = getExtractedRow(database, sessionId, memoryId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:454:      const sessionId = 'wm-no-count-probe';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:460:        if (sql.includes('SELECT COUNT(*) as cnt FROM working_memory WHERE session_id = ? AND memory_id = ?')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:467:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:476:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:490:        FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:492:      `).get(sessionId, memoryId) as { cnt: number };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:504:      const sessionId = 'wm-provenance-update';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:509:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:520:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:532:        FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:534:      `).get(sessionId, memoryId) as { cnt: number };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:537:      const row = getExtractedRow(database, sessionId, memoryId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:555:      const sessionId = 'wm-provenance-checkpoint';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:560:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:574:      const removed = workingMemory.clearSession(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:581:      const restoredRow = getExtractedRow(database, sessionId, memoryId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:362:        // SessionDeduped removed (Fix #14) — dedup is post-cache in main handler
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:25:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:48:  sessionId?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:163:    sessionId: normalizeId(input.sessionId),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:238:        sessionId: scope.sessionId || null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:251:  if (!scope.sessionId) issues.push('sessionId is required for governed ingest');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:272:      sessionId: scope.sessionId ?? '',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:294:    session_id: decision.normalized.sessionId || null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:305:      sessionId: decision.normalized.sessionId || null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:348:    scope.sessionId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:372:    || scope.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:421:  if (normalized.sessionId) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:423:    params.push(normalized.sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:444:    || normalized.sessionId
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:492:      && matchesExactScope(row.session_id, normalized.sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:609:      sessionId: row.session_id ?? undefined,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:96:    : 'startup summary only (resume on demand)';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:46:    deduplicatedFiles: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:72:/** Extract file paths from a text section for deduplication */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:82:function deduplicateFilePaths(sections: MergedBrief['sections']): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:176:  // File-level deduplication across sections
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:177:  const deduplicatedFiles = deduplicateFilePaths(sections);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:221:      deduplicatedFiles,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:7:// presentation profiles, each optimising for a different consumer:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:13://   resume   — state + nextSteps + blockers
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:20:// Backward compatibility: when flag is OFF (or profile omitted), the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:28:/** Supported response profile names. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:29:export type ResponseProfile = 'quick' | 'research' | 'resume' | 'debug';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:56:/** Input to the profile formatter: the parsed response envelope data. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:62:  /** Extra fields from the envelope (passed through in non-omitting profiles). */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:66:/** Output of the `quick` profile formatter. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:78:/** Output of the `research` profile formatter. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:86:/** Output of the `resume` profile formatter. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:94:/** Output of the `debug` profile formatter — passthrough + tokenStats. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:107:/** Union of all profile outputs. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:109:  | { profile: 'quick'; data: QuickProfile }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:110:  | { profile: 'research'; data: ResearchProfile }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:111:  | { profile: 'resume'; data: ResumeProfile }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:112:  | { profile: 'debug'; data: DebugProfile };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:292: * Format results as the `quick` profile.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:337: * Format results as the `research` profile.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:352: * Format results as the `resume` profile.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:374: * Format results as the `debug` profile.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:396: * Apply a named presentation profile to search results.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:398: * Returns a tagged union with `profile` + `data` fields.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:399: * When the flag is OFF or profile is not recognized, returns `null`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:402: * @param profile       - Profile name ('quick' | 'research' | 'resume' | 'debug')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:405: * @returns FormattedProfile or null if feature is disabled / profile unknown
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:408:  profile: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:418:  switch (profile as ResponseProfile) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:420:      return { profile: 'quick', data: formatQuick(safeInput) };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:422:      return { profile: 'research', data: formatResearch(safeInput) };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:423:    case 'resume':
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:424:      return { profile: 'resume', data: formatResume(safeInput) };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:426:      return { profile: 'debug', data: formatDebug(safeInput) };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:433: * Apply a profile to an MCP response envelope text (JSON string).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:434: * Parses the envelope, applies the profile formatter, and returns
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:435: * a new envelope JSON string with the profiled data.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:442: * @param profile      - Profile name
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:448:  profile: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:482:  const formatted = applyResponseProfile(profile, formatterInput, forceEnabled);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:493:      responseProfile: formatted.profile,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:67:    sessionId: 'sess-A',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:218:      makeEvent({ memoryId: 'mem-A', sessionId: 'sess-1' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:219:      makeEvent({ memoryId: 'mem-A', sessionId: 'sess-2' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:220:      makeEvent({ memoryId: 'mem-B', sessionId: 'sess-3' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:233:      makeEvent({ confidence: 'strong', sessionId: 'sess-1' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:234:      makeEvent({ confidence: 'medium', sessionId: 'sess-2' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:235:      makeEvent({ confidence: 'weak',   sessionId: 'sess-3' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:249:      makeEvent({ confidence: 'strong', sessionId: 'sess-1' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:250:      makeEvent({ confidence: 'strong', sessionId: 'sess-2' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:251:      makeEvent({ confidence: 'medium', sessionId: 'sess-3' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:261:      makeEvent({ confidence: 'strong', sessionId: `sess-${i}`, memoryId: 'mem-X' })
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:271:      makeEvent({ timestamp: 1000, sessionId: 'sess-in' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:272:      makeEvent({ timestamp: 5000, sessionId: 'sess-out' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:278:  it('treats distinct sessionIds as distinct sessions', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:281:      makeEvent({ sessionId: 'sess-1' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:282:      makeEvent({ sessionId: 'sess-1' }), // same session, not counted twice
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:283:      makeEvent({ sessionId: 'sess-2' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:292:      makeEvent({ memoryId: 'mem-low',  confidence: 'weak',   sessionId: 's1' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:293:      makeEvent({ memoryId: 'mem-high', confidence: 'strong', sessionId: 's2' }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:532:      makeEvent({ memoryId: 'mem-1', sessionId: 'sess-A', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:533:      makeEvent({ memoryId: 'mem-1', sessionId: 'sess-B', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:534:      makeEvent({ memoryId: 'mem-1', sessionId: 'sess-C', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:554:      makeEvent({ memoryId: 'mem-weak', sessionId: 'sess-1', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:555:      makeEvent({ memoryId: 'mem-weak', sessionId: 'sess-2', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:574:      makeEvent({ memoryId: 'mem-ok', sessionId: 's1', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:575:      makeEvent({ memoryId: 'mem-ok', sessionId: 's2', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:576:      makeEvent({ memoryId: 'mem-ok', sessionId: 's3', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:578:      makeEvent({ memoryId: 'mem-skip', sessionId: 's4', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:593:      makeEvent({ sessionId: 'sess-1', timestamp: BASE_TS - 10_000 }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:594:      makeEvent({ sessionId: 'sess-2', timestamp: BASE_TS - 10_000 }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:595:      makeEvent({ sessionId: 'sess-3', timestamp: BASE_TS - 10_000 }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:613:      makeEvent({ sessionId: 'sX', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:614:      makeEvent({ sessionId: 'sY', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:615:      makeEvent({ sessionId: 'sZ', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:632:      makeEvent({ sessionId: 's1', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:633:      makeEvent({ sessionId: 's2', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:634:      makeEvent({ sessionId: 's3', timestamp: BASE_TS }),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:294:  it('getAdaptiveWeights returns different profiles per intent', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:300:    // so we compare relative ordering and normalized values, not raw profile values
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:321:  it('all 7 intent profiles include graphWeight and graphCausalBias', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:327:      const profile = INTENT_WEIGHT_PROFILES[intent];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:328:      expect(typeof profile.graphWeight).toBe('number');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:329:      expect(typeof profile.graphCausalBias).toBe('number');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md:34:- Save/index regressions including content-hash dedup, quality-loop behavior, and incremental-index edge cases.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md:68:npx vitest run tests/content-hash-dedup.vitest.ts tests/handler-memory-index-cooldown.vitest.ts tests/memory-save-pipeline-enforcement.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md:83:| Search and ranking | `hybrid-search.vitest.ts`, `bm25-index.vitest.ts`, `query-router.vitest.ts`, `dynamic-token-budget.vitest.ts`, `result-confidence-scoring.vitest.ts` | Retrieval, ranking, and profile/trace behavior |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md:85:| Save/index regressions | `content-hash-dedup.vitest.ts`, `memory-save-dedup-order.vitest.ts`, `handler-memory-index-cooldown.vitest.ts`, `chunking-orchestrator-swap.vitest.ts`, `memory-save-ux-regressions.vitest.ts` | Refinement work covered by this audit family |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md:101:- `content-hash-dedup.vitest.ts` - same-path and cross-path content-hash dedup behavior.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md:108:- `context-server-error-envelope.vitest.ts`, `envelope.vitest.ts`, and `response-profile-formatters.vitest.ts` - serialized response and profile behavior.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md:150:npx vitest run tests/content-hash-dedup.vitest.ts tests/quality-loop.vitest.ts tests/batch-processor.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:275: * @returns Array of 2-5 deduplicated surrogate questions.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:37:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:247:      selectionContext.sessionId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:309:        sessionId: row.session_id ?? undefined,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:75:      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:76:      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1162:  it('EXT-H4b: Health resolves lazy profile before reporting provider dimensions', async (ctx) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1187:  it('EXT-H4c: Health falls back to configured model and dimension when lazy profile stays unavailable', async (ctx) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1230:    // Should include a hint about the profile failure
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1232:      h.includes('Embedding profile unavailable')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1236:  it('EXT-H4e: Health sanitizes absolute profile-error paths that contain spaces', async (ctx) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1258:    const profileHint = parsed?.hints?.find((hint: string) =>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1259:      hint.includes('Embedding profile unavailable')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1262:    expect(profileHint).toContain('[path]');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1263:    expect(profileHint).not.toContain('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:81:    enableDedup: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:82:    enableSessionBoost: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md:3:description: "Envelope helpers, MCP wrappers, and response-profile formatting for memory tool responses."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md:6:  - "response profiles"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md:24:`lib/response/` standardizes how MCP tool handlers build envelopes, wrap them for MCP transport, and optionally compress them into profile-shaped outputs for specific consumers.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md:33:| `profile-formatters.ts` | Profile reducers for `quick`, `research`, `resume`, and `debug` response shapes |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md:41:- `profile-formatters.ts` exports `applyResponseProfile()` and `applyProfileToEnvelope()` plus the public profile types for `quick`, `research`, `resume`, and `debug`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md:42:- Response profiles are gated through `isResponseProfileEnabled()` and preserve backward compatibility by returning `null` when profile formatting is disabled or not requested.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:24:    it('resume', () => { expect(classifyQueryIntent('resume my last session').intent).toBe('hybrid'); });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:43:    it('resume my previous work', () => { expect(classifyQueryIntent('resume my previous work').intent).toBe('hybrid'); });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:47:        producer: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:48:        sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:22:  'tool-schemas.js': 780,           // actual: 755 — Expanded MCP schema set + Sprint 019: Zod schema integration, ingest tools + Phase 024 session_bootstrap
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:198: * appear across the most facets (cross-facet coverage) and deduplicating by ID.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:204: *   3. Return the deduplicated list.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:210: * @returns Merged, deduplicated, coverage-ranked result array.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:467:      'Start a new session with fresh sessionId',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:469:      'Consider using /spec_kit:resume for session recovery'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:478:      'Omit sessionId to disable session deduplication'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:486:      'Start fresh with new sessionId',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:41:    // Flatten all results from all lists, deduplicate by id, return sorted.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:15:      "query": "why was SHA256 dedup introduced for memory indexing",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:20:      "expectedResultDescription": "Decision record or memory explaining T054 / T003 (content hash dedup) rationale. Should reference Wave 1 bug fixes and duplicate prevention.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:30:      "expectedResultDescription": "Should surface memories about adaptive-fusion.ts (7 intent profiles), intent-classifier.ts, and memory_context intent routing. Cross-document because the behavior spans multiple modules.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:101:      "notes": "Graph-relationship query about architectural lineage. Tests find_decision intent routing with high graph weight (0.50 per adaptive-fusion profile)."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:231:      "notes": "From T007b Pattern 2: session resume always uses \"session state\" as the input string."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:240:      "expectedResultDescription": "Topic-scoped resume query. Should surface spec folder 001-sprint-0-measurement-foundation memories with state/next-steps anchors.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:241:      "notes": "From T007b Pattern 2: variant of session resume scoped to a specific sprint/spec folder."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:260:      "expectedResultDescription": "Decision archaeology query. Should surface adaptive-fusion.ts intent profiles and any decision record about mode selection heuristics.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:395:      "query": "add a new intent type to the adaptive fusion scoring profiles",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:400:      "expectedResultDescription": "Should surface adaptive-fusion.ts intent profiles, intent-classifier.ts enum, and eval-metrics.ts intentMultipliers. Cross-document because the change touches 3+ files.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:435:      "query": "refactor session deduplication to use a sliding window instead of session-scoped set",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:440:      "expectedResultDescription": "Should surface session-manager.ts, integration-session-dedup.vitest.ts, and any spec decisions about the deduplication design.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:490:      "expectedResultDescription": "Temporal query about a specific task milestone. Should surface memories created after T054 that reference the content hash dedup feature.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:565:      "query": "memory deduplication content hash",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:570:      "expectedResultDescription": "Should surface memories with trigger phrases matching \"content hash\" or \"deduplication\". Likely surfaces T054-related memories about SHA256 dedup implementation.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:571:      "notes": "Derived from known trigger phrases in the memory system related to content hash dedup."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:760:      "expectedResultDescription": "Should surface content hash dedup implementation in the save pipeline and the UNIQUE constraint in the memory schema.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:761:      "notes": "Manual conversational phrasing of the content dedup behavior."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:840:      "expectedResultDescription": "Should surface the content hash dedup logic in the save pipeline and explain that this is expected behavior when saving identical content.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:274:/** Resolve multiple seeds, deduplicate overlapping refs */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:111:      input: 'resume quickly',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:23:          trackedPayloadKinds: ['resume'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:29:          payloadKind: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:30:          dedupeKey: 'system:resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:31:          content: 'Summary: resume summary',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:36:          payloadKind: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:37:          dedupeKey: 'messages:resume:0',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:41:          hook: 'experimental.session.compacting',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:43:          payloadKind: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:44:          dedupeKey: 'compaction:resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:126:        specKitCompactCodeGraph: 'messages:resume:0',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:145:          tool: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:168:    await hooks['experimental.session.compacting']?.({ sessionID: 's3' }, output);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:169:    await hooks['experimental.session.compacting']?.({ sessionID: 's3' }, output);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:186:    await hooks['experimental.session.compacting']?.({ sessionID: 's3' }, { context: [] });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:203:    expect(status).toContain('resume_mode=minimal');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-dedup-order.vitest.ts:5:describe('Memory-save dedup ordering regressions', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-dedup-order.vitest.ts:6:  it('T080-1 checks content-hash dedup before the chunking branch', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:14:  | 'experimental.session.compacting';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:21:  dedupeKey: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:25:/** Complete transport-only plan derived from shared startup/resume payloads. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:85:  resumePayload?: SharedPayloadEnvelope | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:93:    args.resumePayload?.kind,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:98:  const systemPayload = args.bootstrapPayload ?? args.startupPayload ?? args.resumePayload ?? null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:99:  const messagePayloads = [args.resumePayload, args.healthPayload].filter(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:102:  const compactionPayload = args.compactionPayload ?? args.resumePayload ?? args.bootstrapPayload ?? null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:121:          dedupeKey: `system:${systemPayload.kind}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:134:      dedupeKey: `messages:${payload.kind}:${index}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:143:          hook: 'experimental.session.compacting',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:146:          dedupeKey: `compaction:${compactionPayload.kind}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:4:// Unit tests for graph calibration profiles, ablation harness,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:363:  it('clamps all scoring context values to profile caps', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:449:    const profile = loadCalibrationProfile();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:450:    expect(profile.graphWeightCap).toBe(DEFAULT_PROFILE.graphWeightCap);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:451:    expect(profile.louvainMinDensity).toBe(DEFAULT_PROFILE.louvainMinDensity);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:452:    expect(profile.louvainMinSize).toBe(DEFAULT_PROFILE.louvainMinSize);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:457:    const profile = loadCalibrationProfile();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:458:    expect(profile.graphWeightCap).toBe(AGGRESSIVE_PROFILE.graphWeightCap);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:459:    expect(profile.n2aCap).toBe(AGGRESSIVE_PROFILE.n2aCap);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:460:    expect(profile.louvainMinSize).toBe(AGGRESSIVE_PROFILE.louvainMinSize);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:463:  it('applies individual env overrides on top of base profile', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:466:    const profile = loadCalibrationProfile();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:467:    expect(profile.graphWeightCap).toBe(0.02);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:468:    expect(profile.n2aCap).toBe(0.08);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:470:    expect(profile.n2bCap).toBe(DEFAULT_PROFILE.n2bCap);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:476:    const profile = loadCalibrationProfile();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:477:    expect(profile.graphWeightCap).toBe(DEFAULT_PROFILE.graphWeightCap);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:478:    expect(profile.louvainMinSize).toBe(DEFAULT_PROFILE.louvainMinSize);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:484:    const profile = loadCalibrationProfile();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:485:    expect(profile.graphWeightCap).toBe(AGGRESSIVE_PROFILE.graphWeightCap); // from aggressive base
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:486:    expect(profile.louvainMinDensity).toBe(0.8); // overridden
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:531:  it('accepts explicit profile override', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:636:  it('defaults to loaded profile thresholds when none provided', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:637:    // With default profile: minDensity=0.3, minSize=10
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-calibration.vitest.ts:800:  describe('calibration profile constants', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-limit.vitest.ts:55:      CREATE TABLE IF NOT EXISTS working_memory (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:205:│   ├── session-manager.ts      # Session deduplication (~1050 lines)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:331:| `session/session-manager.ts` | Session deduplication (~1050 lines) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:345:| `utils/canonical-path.ts` | Canonical path normalization for deduplication |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:198:  let toolCalls = 1; // session_bootstrap
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:130:      expect(['startup', 'resume', 'compact', 'clear']).toContain(source);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:151:  it('keeps structural snapshot trust off the errored resume payload while preserving it on structural context', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:152:    vi.doMock('../handlers/session-resume.js', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:154:        throw new Error('synthetic resume failure');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:176:        sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:188:    expect(parsed.data.resume.error).toContain('synthetic resume failure');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:189:    expect(parsed.data.resume).not.toHaveProperty('parserProvenance');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:190:    expect(parsed.data.resume).not.toHaveProperty('evidenceStatus');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:191:    expect(parsed.data.resume).not.toHaveProperty('freshnessAuthority');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:127:      sessionId: 'session-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:128:      enableSessionBoost: true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:160:      sessionId: undefined,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:161:      enableSessionBoost: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:322: * Intent classes aligned with adaptive-fusion.ts weight profiles.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:77:      { path: 'mcp_server/lib/validation/save-quality-gate.ts', description: 'Three-layer quality gate that validates structure, content density, and semantic deduplication before persisting.' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:900:        { path: 'other.ts', description: 'Three-layer quality gate that validates structure, content density, and semantic deduplication.' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1167:  it('semantic dedup handles similarity at exactly 0.92 threshold', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:181:  it('T017-02: Handles minimal session state (only sessionId)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:185:  it('T017-03: Handles undefined sessionId gracefully', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:200:  it('T018-02: Displays sessionId in code format', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:244:describe('T020: Quick resume command (DB-dependent)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:246:  it('T020-01: Generates /spec_kit:resume command when specFolder is provided', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:250:  it('T020-02: Generates memory_search command with sessionId when specFolder is not provided', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:254:  it('T020-03: Generates generic memory_search when neither specFolder nor sessionId is provided', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:262:  it('T020-05: specFolder takes precedence over sessionId for resume command', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:9:  | 'resume'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:157:    | 'session_resume'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:158:    | 'session_health'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:159:    | 'session_bootstrap'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:51:/** Create in-memory DB with working_memory + memory_index schema */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:389:    db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score, last_focused) VALUES ('old-session', 1, 0.5, '${oldTime}')`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:390:    db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score, last_focused) VALUES ('fresh-session', 2, 0.8, '${new Date().toISOString()}')`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:395:    const remaining = db.prepare('SELECT session_id, memory_id FROM working_memory').all() as WorkingMemoryRow[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:418:    db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score) VALUES ('s1', 1, 0.9)`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:437:      db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score) VALUES ('s1', ${i}, ${score})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:457:        INSERT INTO working_memory (session_id, memory_id, attention_score, last_focused)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:464:    const remaining = db.prepare('SELECT memory_id FROM working_memory WHERE session_id = ? ORDER BY memory_id').all('s1') as Array<Pick<WorkingMemoryRow, 'memory_id'>>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:487:      db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score) VALUES ('s1', ${i}, 0.5)`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:489:    db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score) VALUES ('s2', ${maxCap + 1}, 0.5)`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:490:    db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score) VALUES ('s2', ${maxCap + 2}, 0.5)`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:678:**TM-02: Same-Path and Hash Dedup Hardening** (`save/dedup.ts`):
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:679:Same-path `unchanged` only applies to healthy existing rows (`success`, `pending`, `partial`), so unhealthy embedding states still re-enter indexing. Cross-path content-hash dedup accepts chunked parents only when the parent row is in valid `partial` state and ignores invalid parent rows marked `complete`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:12:  provenance: ['session_resume'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:54:        provenance: ['session_resume', 'session_resume'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:60:describe('session_resume certainty contract', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:71:  it('surfaces certainty fields in the shared resume payload', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:118:        sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:123:    const { handleSessionResume } = await import('../handlers/session-resume.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:142:      'memory-resume': 'estimated',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:150:describe('session_bootstrap certainty contract', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:162:    vi.doMock('../handlers/session-resume.js', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:169:              memory: { resumed: true },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:170:              hints: ['resume ok'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:172:                kind: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:187:                  producer: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:188:                  sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:219:        sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:238:    expect(parsed.data.payloadContract.summary).toContain('resume=estimated');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:243:      'resume-surface': 'estimated',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:809:    it('UG6: Gate ON, no embedding skips semantic dedup', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:49:  it('resume session continues event_counter and preserves working memory items', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:52:    expect(workingMemory.setAttentionScore('resume-session', 2, 0.7)).toBe(true); // 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:53:    expect(workingMemory.setAttentionScore('resume-session', 3, 0.6)).toBe(true); // 1
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:55:    expect(workingMemory.sessionExists('resume-session')).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:56:    expect(workingMemory.getSessionEventCounter('resume-session')).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:58:    expect(workingMemory.setAttentionScore('resume-session', 2, 0.9)).toBe(true); // 2
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:59:    expect(workingMemory.getSessionEventCounter('resume-session')).toBeGreaterThanOrEqual(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:61:    const rows = workingMemory.getWorkingMemory('resume-session');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:62:    const resumedRow = rows.find((row) => row.memory_id === 2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:63:    expect(resumedRow?.event_counter).toBe(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:65:    const promptContext = workingMemory.getSessionPromptContext('resume-session', 0.05, 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:52:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:53:  enableSessionBoost: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:135:  sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:136:  enableSessionBoost,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:164:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:165:    enableSessionBoost,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:85:      resumed?: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:87:      resumedContextCount?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:109:function mockTrustedSession(sessionId: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:111:    requestedSessionId: sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:112:    effectiveSessionId: sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:137:    it('T524-1: Auto mode routes "resume" to resume strategy', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:140:          input: 'resume where I left off on the authentication module',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:156:      expect(mode).toBe('resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:181:    it('routes auto mode to resume when a caller session already exists without resume keywords', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:182:      mockTrustedSession('session-auto-resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:188:          sessionId: 'session-auto-resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:191:        'auto-resume-session-context'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:195:      expect(parsed.meta.mode).toBe('resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:249:    it('forwards response profile through routed search strategies', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:254:          profile: 'quick',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:257:        'profile-forward-focused'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:261:        profile: 'quick',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:288:    it('forwards governed scope fields through resume-mode search routing', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:291:          input: 'resume session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:292:          mode: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:299:        'scope-forward-resume'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:319:        resume: 2000,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:515:  describe('Session lifecycle metadata and resume context', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:516:    it('T027k: missing sessionId generates ephemeral UUID scope', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:534:    it('T027ka: rejects caller sessionId when it is not server-managed', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:540:          sessionId: 'session-new',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:557:        'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:561:    it('T027l/T027m: caller session resume reports counter and injects top-5 context', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:576:          input: 'resume previous work on memory quality',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:577:          sessionId: 'session-abc',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:578:          mode: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:581:        'T027l-resume'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:588:      expect(parsed.meta.sessionLifecycle.resumed).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:590:      expect(parsed.meta.sessionLifecycle.resumedContextCount).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:625:          input: 'resume prior work',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:626:          sessionId: 'session-trace',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:627:          mode: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:639:          currentState: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:641:          signalSources: expect.arrayContaining(['session-resume', 'explicit-mode']),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:642:          reason: 'resumed session inferred resume mode',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:647:    it('uses the last inferred mode as previousState when a traced caller session resumes', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:655:          input: 'resume previous work on memory quality',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:656:          sessionId: 'session-known',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:657:          mode: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:667:          currentState: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:668:          signalSources: expect.arrayContaining(['session-resume', 'explicit-mode']),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:673:    it('default-on contract: auto-resume injection runs when SPECKIT_AUTO_RESUME is unset', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:682:          title: 'Auto resume memory',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:683:          filePath: '/tmp/auto-resume.md',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:690:          input: 'resume prior work',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:691:          sessionId: 'session-default-on',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:692:          mode: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:695:        'auto-resume-default-on'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:713:          title: 'Disabled auto-resume memory',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:714:          filePath: '/tmp/disabled-auto-resume.md',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:721:          input: 'resume prior work',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:722:          sessionId: 'session-opt-out',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:723:          mode: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:726:        'auto-resume-opt-out'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:73:    CREATE TABLE IF NOT EXISTS working_memory (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:171:    CREATE TABLE IF NOT EXISTS working_memory (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:269:    INSERT INTO working_memory (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:289:  database.prepare('UPDATE working_memory SET attention_score = ? WHERE memory_id = ?').run(9.0, 1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:290:  database.prepare('UPDATE working_memory SET attention_score = ? WHERE memory_id = ?').run(8.0, 2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:622:        INSERT INTO working_memory (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:644:      database.prepare('DELETE FROM working_memory WHERE memory_id = ?').run(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:646:        INSERT INTO working_memory (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:650:      database.prepare('UPDATE working_memory SET attention_score = ? WHERE memory_id = ?').run(8.0, 2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:671:        database.prepare('SELECT session_id, attention_score FROM working_memory WHERE memory_id = ?').get(1)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:674:        database.prepare('SELECT session_id, attention_score FROM working_memory WHERE memory_id = ?').get(2)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:704:        INSERT INTO working_memory (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:722:      database.prepare('UPDATE working_memory SET attention_score = ? WHERE memory_id = ?').run(9.0, 1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:734:        INSERT INTO working_memory (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:759:        database.prepare('SELECT attention_score FROM working_memory WHERE memory_id = ?').get(1)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:762:        (database.prepare('SELECT COUNT(*) as cnt FROM working_memory WHERE session_id = ?').get('session-extra') as { cnt: number }).cnt
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:851:        database.prepare('SELECT attention_score FROM working_memory WHERE memory_id = ?').get(1)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:854:        database.prepare('SELECT attention_score FROM working_memory WHERE memory_id = ?').get(2)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:882:        database.prepare('SELECT attention_score FROM working_memory WHERE memory_id = ?').get(1)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:885:        database.prepare('SELECT attention_score FROM working_memory WHERE memory_id = ?').get(2)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:923:        database.prepare('SELECT attention_score FROM working_memory WHERE memory_id = ?').get(1)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:926:        database.prepare('SELECT attention_score FROM working_memory WHERE memory_id = ?').get(2)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:104:    expect(modes).toContain('resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:132:  it('T006: resume mode has resume strategy and 2000 token budget', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:133:    const resumeMode: ContextMode = CONTEXT_MODES.resume;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:134:    expect(resumeMode.strategy).toBe('resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:135:    expect(resumeMode.tokenBudget).toBe(2000);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:226:  it('T020: No intent maps to quick or resume by default', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:229:      expect(mode).not.toBe('resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:301:      resumedSession: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:320:  it('prioritizes resumed-session and explicit-mode reasons deterministically', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:321:    const resumed = buildSessionTransitionTrace({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:323:      resumedSession: true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:324:      effectiveMode: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:330:    expect(resumed.signalSources).toEqual([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:331:      'session-resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:335:    expect(resumed.confidence).toBe(0.95);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:336:    expect(resumed.reason).toBe('resumed session inferred resume mode');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:340:      resumedSession: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:372:      resumedSession: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:571:  it('T061: Resume mode strategy is resume', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:572:    expect(CONTEXT_MODES.resume.strategy).toBe('resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:576:    expect(CONTEXT_MODES.resume.name).toBe('Resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:580:    const desc: string = CONTEXT_MODES.resume.description.toLowerCase();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:582:      desc.includes('session') || desc.includes('previous') || desc.includes('resume') || desc.includes('state')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:587:    expect(CONTEXT_MODES.resume.tokenBudget).toBe(2000);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:591:    const resumeBudget: number = CONTEXT_MODES.resume.tokenBudget!;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:593:    expect(resumeBudget).toBeLessThan(deepBudget);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:598:    expect(mappedModes).not.toContain('resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:603:    const resumeCount: number = strategies.filter((s: string) => s === 'resume').length;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:604:    expect(resumeCount).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:608:    const desc: string = CONTEXT_MODES.resume.description.toLowerCase();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:615:    expect(CONTEXT_MODES.resume.description.length).toBeGreaterThan(10);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:619:    const resume: ContextMode = CONTEXT_MODES.resume;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:620:    expect(resume.name).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:621:    expect(resume.description).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:622:    expect(resume.strategy).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:623:    expect(resume.tokenBudget).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:668:    // And via keyword detection, can route to resume
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:728:    const resume: number = CONTEXT_MODES.resume.tokenBudget!;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:732:    expect(quick).toBeLessThan(resume);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:733:    expect(resume).toBeLessThan(focused);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:849:    expect(Object.keys(CONTEXT_MODES).sort()).toEqual(['auto', 'deep', 'focused', 'quick', 'resume']);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:1002:      resume: 2000
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:7:// The working_memory table, NOT memory_index. This is intentionally
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:46:  CREATE TABLE IF NOT EXISTS working_memory (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:66:  CREATE INDEX IF NOT EXISTS idx_wm_session ON working_memory(session_id);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:67:  CREATE INDEX IF NOT EXISTS idx_wm_attention ON working_memory(session_id, attention_score DESC);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:68:  CREATE INDEX IF NOT EXISTS idx_wm_added ON working_memory(added_at);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:69:  CREATE INDEX IF NOT EXISTS idx_wm_session_focus_lru ON working_memory(session_id, last_focused ASC, id ASC);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:70:  CREATE INDEX IF NOT EXISTS idx_wm_session_attention_focus ON working_memory(session_id, attention_score DESC, last_focused DESC);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:92:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:102:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:110:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:144:    const wmColumns = (db.prepare('PRAGMA table_info(working_memory)').all() as Array<{ name: string }>)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:148:      db.exec('ALTER TABLE working_memory ADD COLUMN event_counter INTEGER NOT NULL DEFAULT 0');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:151:      db.exec('ALTER TABLE working_memory ADD COLUMN mention_count INTEGER NOT NULL DEFAULT 0');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:154:      db.exec('ALTER TABLE working_memory ADD COLUMN source_tool TEXT');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:157:      db.exec('ALTER TABLE working_memory ADD COLUMN source_call_id TEXT');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:160:      db.exec('ALTER TABLE working_memory ADD COLUMN extraction_rule_id TEXT');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:163:      db.exec('ALTER TABLE working_memory ADD COLUMN redaction_applied INTEGER NOT NULL DEFAULT 0');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:179:    "SELECT sql FROM sqlite_master WHERE type='table' AND name='working_memory'"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:189:    ALTER TABLE working_memory RENAME TO working_memory_old;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:191:    INSERT INTO working_memory (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:220:    FROM working_memory_old;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:221:    DROP TABLE working_memory_old;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:227:function getOrCreateSession(sessionId: string | null = null): string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:228:  if (sessionId) return sessionId;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:236:function clearSession(sessionId: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:242:      'DELETE FROM working_memory WHERE session_id = ?'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:243:    ) as Database.Statement).run(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:244:    sessionModeRegistry.delete(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:261:      "SELECT DISTINCT session_id FROM working_memory WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:264:      "DELETE FROM working_memory WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:279:function getWorkingMemory(sessionId: string): WorkingMemoryEntry[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:285:      SELECT * FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:289:    `) as Database.Statement).all(sessionId) as WorkingMemoryEntry[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:297:function getSessionMemories(sessionId: string): Array<Record<string, unknown>> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:304:      FROM working_memory wm
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:308:    `) as Database.Statement).all(sessionId) as Array<Record<string, unknown>>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:316:function sessionExists(sessionId: string): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:317:  return getLatestSessionEventCounter(sessionId) !== null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:320:function getSessionEventCounter(sessionId: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:321:  const current = getLatestSessionEventCounter(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:325:function getSessionPromptContext(sessionId: string, floor: number = DECAY_FLOOR, limit: number = 5): SessionPromptContextEntry[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:339:      FROM working_memory wm
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:346:    `) as Database.Statement).all(sessionId, safeFloor, safeLimit) as SessionPromptContextEntry[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:354:function getSessionInferredMode(sessionId: string): string | null {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:355:  const mode = sessionModeRegistry.get(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:359:function setSessionInferredMode(sessionId: string, mode: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:360:  const normalizedSessionId = sessionId.trim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:382:  sessionId: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:392:    const currentEventCounter = nextEventCounter(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:395:      'SELECT id FROM working_memory WHERE session_id = ? AND memory_id = ?'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:396:    ) as Database.Statement).get(sessionId, memoryId) as { id: number } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:400:        UPDATE working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:407:      `) as Database.Statement).run(clampedScore, currentEventCounter, sessionId, memoryId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:410:      enforceMemoryLimit(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:413:        INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:415:      `) as Database.Statement).run(sessionId, memoryId, clampedScore, currentEventCounter);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:431:    sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:440:  if (!sessionId || !sourceTool || !sourceCallId || !extractionRuleId) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:447:    const currentEventCounter = nextEventCounter(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:450:      INSERT INTO working_memory (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:463:          WHEN excluded.attention_score > working_memory.attention_score THEN excluded.attention_score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:464:          ELSE working_memory.attention_score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:467:        focus_count = working_memory.focus_count + 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:468:        mention_count = MIN(working_memory.mention_count + 1, ${MAX_MENTION_COUNT}),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:475:      sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:488:      'SELECT focus_count FROM working_memory WHERE session_id = ? AND memory_id = ?'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:489:    ) as Database.Statement).get(sessionId, memoryId) as { focus_count?: number } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:491:      enforceMemoryLimit(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:502:function nextEventCounter(sessionId: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:505:  const current = getLatestSessionEventCounter(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:519:function enforceMemoryLimit(sessionId: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:524:      'SELECT COUNT(*) as count FROM working_memory WHERE session_id = ? AND memory_id IS NOT NULL'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:525:    ) as Database.Statement).get(sessionId) as { count: number };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:531:      DELETE FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:533:        SELECT id FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:539:    `) as Database.Statement).run(sessionId, excess);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:560:function batchUpdateScores(sessionId: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:564:  if (!isFeatureEnabled('SPECKIT_EVENT_DECAY', sessionId)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:569:    const currentEventCounter = getCurrentEventCounter(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:572:      FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:575:    `) as Database.Statement).all(sessionId) as Array<{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:587:      UPDATE working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:594:      DELETE FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:628:function getCurrentEventCounter(sessionId: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:629:  const current = getLatestSessionEventCounter(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:637:function getLatestSessionEventCounter(sessionId: string): number | null {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:643:      FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:648:    `) as Database.Statement).get(sessionId) as { event_counter?: number | null };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:678:function getSessionStats(sessionId: string): SessionStats | null {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:690:      FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:693:    `) as Database.Statement).get(sessionId) as {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:704:      sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:168: * @returns Array of candidate noun phrase tokens (lowercase, deduplicated).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:452:  // Track seen values per canonical name using Sets for O(1) dedup instead of O(n) .includes()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:80:  it('T035/T038: extraction callback inserts working_memory with provenance', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:89:      FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:104:    // Without a resolvable memory_id the adapter skips the working_memory insert.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:122:      FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:170:  it('T046-05a: deduplicates specs symlink that points to .opencode/specs', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:144:  it('preserves separate trust axes through real session_resume and session_bootstrap outputs', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:151:            data: { resumed: true },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:190:        sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:195:    const { handleSessionResume } = await import('../handlers/session-resume.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:196:    const resumeResult = await handleSessionResume({ specFolder: 'specs/026-root' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:197:    const parsedResume = JSON.parse(resumeResult.content[0].text);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:198:    const resumeStructuralSection = parsedResume.data.payloadContract.sections.find(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:202:    expect(resumeStructuralSection?.structuralTrust).toEqual({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:215:    expect(parsed.data.resume).toMatchObject({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:32:    sessionId?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:69:    params.sessionId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:29:    sessionId?: unknown;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:395:      sessionId: 'session-secret',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:419:    expect(tracePayload.sessionId).toBeUndefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:197:    it('T525-9: Session dedup parameters accepted', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:202:            sessionId: 'sess-123',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:203:            enableDedup: true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:214:        expect(message.includes('sessionId')).not.toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:215:        expect(message.includes('enableDedup')).not.toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:19:      sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:151:    it('T033.1: -ing suffix removal + double-consonant dedup', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:196:    it('namespace matches sessionId format', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:178:      decision_meta: { confidence: 0.95, strategy: 'dedup' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:80:function insertSentRow(sessionId: string, hash: string, memoryId: number | null, sentAt: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:83:  ).run(sessionId, hash, memoryId, sentAt);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:232:    it('returns failure for empty sessionId', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:264:    it('empty sessionId returns zeros', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:334:    it('generates a server session when caller omits sessionId', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:430:    it('rejects empty sessionId', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:449:    it('fails for empty sessionId', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:506:        expect(state.sessionId).toBe('recover-1');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:539:    it('rejects empty sessionId', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:560:        const ids = r.sessions.map((s: InterruptedSession) => s.sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:564:        const s1 = r.sessions.find((s: InterruptedSession) => s.sessionId === 'int-1');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:577:      const ids = r.sessions.map((session: InterruptedSession) => session.sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:598:        sessionId: 'gen-md-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:615:      expect(md).toContain('/spec_kit:resume specs/005');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:619:      // Minimal input (only sessionId required)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:620:      const md = sm.generateContinueSessionMd({ sessionId: 'gen-md-2' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:625:      // Without specFolder, should use sessionId-based resume command
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:815:  describe('17. db unavailable dedup mode', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-flow-tracker.vitest.ts:59:    trackQueryAndDetect(db, 'sess-b', 'memory context resume', 'q1', ['mem-9']);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-flow-tracker.vitest.ts:61:    const detection = trackQueryAndDetect(db, 'sess-b', 'resume memory context', 'q2', ['mem-10']);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:93: * Groups results by channel, deduplicates by memory ID (keeping highest score).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:25:  'working_memory',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:87:    CREATE TABLE IF NOT EXISTS working_memory (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:300:    INSERT INTO working_memory (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:594:const sessionId = getOrCreateSession();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:595:// sessionId = 'wm-lxyz123-abc456'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:598:setAttentionScore(sessionId, memoryId, 1.0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:601:const entries = getWorkingMemory(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:605:const memories = getSessionMemories(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:608:const updated = batchUpdateScores(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:612:const stats = getSessionStats(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:613:// stats = { sessionId, totalEntries, avgAttention, maxAttention, minAttention, totalFocusEvents }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:616:clearSession(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:976:A: **Retrievability** (R) is the FSRS-calculated probability of recall (0.0 to 1.0), based on stability and elapsed time. **Attention score** is the session-specific activation level in `working_memory`, which starts at 1.0 when a memory enters the session and decays at 0.95 per cycle.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:1053:| `SPECKIT_SESSION_BOOST`   | false   | Enable session-based score boost from working_memory attention signals |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:36:    sessionId: 'sess-abc',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:217:      sessionId: 'session-XYZ',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:232:    logFeedbackEvent(db, makeEvent({ sessionId: null }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:327:  it('filters by sessionId', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:329:    logFeedbackEvent(db, makeEvent({ sessionId: 'sess-1' }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:330:    logFeedbackEvent(db, makeEvent({ sessionId: 'sess-2' }));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:332:    const forSess1 = getFeedbackEvents(db, { sessionId: 'sess-1' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:300:  it('T045-17a: mergeResults deduplicates mixed ID types', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:97:  filterSearchResults: vi.fn((_sessionId: string, results: unknown[]) => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:99:    dedupStats: { enabled: false, filtered: 0, total: Array.isArray(results) ? results.length : 0 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:139:      sessionId: 'sess-ux-1',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:190:    const resumed = await handleMemorySearch({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:195:    const resumedEnvelope = parseEnvelope(resumed);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:196:    const resumedData = resumedEnvelope.data as Record<string, unknown>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:198:    expect(resumedEnvelope.summary).toBe('Error: Cursor is invalid, expired, or out of scope');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:199:    expect(resumedData.error).toBe('Cursor is invalid, expired, or out of scope');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:59:      enableDedup: true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:60: * Automatic session resume context injection for memory_context.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:158: * TM-06: Reconsolidation-on-save for memory deduplication.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:449: * REQ-D3-005 / REQ-D3-006: Graph calibration profiles and community thresholds.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:450: * Enables calibration profile enforcement, Louvain activation gates, and
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:501: * Enables cross-turn dedup and goal-aware refinement of search results.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:577: * REQ-D5-003: Mode-aware response profile formatting.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:669: * Phase C: Intent-to-profile auto-routing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:670: * When enabled, classifyIntent() results automatically select a response profile
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:671: * (quick, research, resume, debug) when no explicit profile is specified by the caller.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-metrics.vitest.ts:34:      expect(metrics.sessionId).toMatch(/^sess_/);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:424:Contenu en francais: cafe, resume, naive, cliche.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:442:      workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'memory-parser-dedup-'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:451:    it('T500-16: findMemoryFiles deduplicates symlinked specs roots', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:453:      const memoryDir = path.join(canonicalSpecsRoot, '200-dedup-check', 'memory');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:468:      expect(files[0].endsWith(path.join('200-dedup-check', 'memory', 'entry.md'))).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:23:    it('T531-1: sessionId parameter accepted by search', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:27:            query: 'test dedup query',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:28:            sessionId: 'dedup-session-001',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:35:        expect(getErrorMessage(error)).not.toContain('sessionId');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:39:    it('T531-2: enableDedup=true accepted by search', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:43:            query: 'test dedup query',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:44:            sessionId: 'dedup-session-002',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:45:            enableDedup: true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:52:        expect(getErrorMessage(error)).not.toContain('enableDedup');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:64:            session_id: 'dedup-session-003',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:75:    it('T531-4: Search without sessionId accepted (no dedup)', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:80:            // No sessionId — dedup should not activate
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:94:    it('T531-5: Default dedup behavior with sessionId', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:98:            query: 'test with session no explicit dedup',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:99:            sessionId: 'dedup-session-default',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:106:        expect(getErrorMessage(error)).not.toContain('dedup');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:110:    it('T531-6: enableDedup=false accepted', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:114:            query: 'test dedup disabled',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:115:            sessionId: 'dedup-session-disabled',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:116:            enableDedup: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:123:        expect(getErrorMessage(error)).not.toContain('enableDedup');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:22:  function insertWorkingMemory(sessionId: string, memoryId: number, score: number = 0.8) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:24:      INSERT OR REPLACE INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:26:    `).run(sessionId, memoryId, score);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:29:  function countWorkingMemory(sessionId: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:31:      'SELECT COUNT(*) as count FROM working_memory WHERE session_id = ?'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:32:    ).get(sessionId) as { count: number } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:41:    // Create memory_index table (needed for FK reference in working_memory)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:74:    // Init working memory module first (creates working_memory table)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:105:      const sessionId = 'complete-test-session';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:108:      insertWorkingMemory(sessionId, 1, 0.9);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:109:      insertWorkingMemory(sessionId, 2, 0.7);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:110:      insertWorkingMemory(sessionId, 3, 0.5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:112:      const countBefore = countWorkingMemory(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:116:      sm.saveSessionState(sessionId, { currentTask: 'testing' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:119:      const result = sm.completeSession(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:123:      const countAfter = countWorkingMemory(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:127:      getTestDb().prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:128:      getTestDb().prepare('DELETE FROM session_state WHERE session_id = ?').run(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:134:      const sessionId = 'clear-test-session';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:137:      insertWorkingMemory(sessionId, 4, 0.8);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:138:      insertWorkingMemory(sessionId, 5, 0.6);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:140:      const countBefore = countWorkingMemory(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:147:      `).run(sessionId, 'test-hash-123', 4);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:150:      const result = sm.clearSession(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:154:      const countAfter = countWorkingMemory(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:160:      ).get(sessionId) as { count: number };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:164:      getTestDb().prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:165:      getTestDb().prepare('DELETE FROM session_sent_memories WHERE session_id = ?').run(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:190:    it('adds event_counter and mention_count to legacy working_memory tables', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:203:        CREATE TABLE working_memory (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:215:        INSERT INTO working_memory (session_id, memory_id, attention_score, focus_count)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:221:      const columns = legacyDb.prepare('PRAGMA table_info(working_memory)').all() as Array<{ name: string }>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:228:        FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:7:  'session-resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:26:  resumedSession: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:49:    case 'session-resume':
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:50:      return `resumed session inferred ${effectiveMode} mode`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:71:  if (args.resumedSession) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:72:    activeSignals.push('session-resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:89:    if (!args.resumedSession && !args.pressureOverrideApplied && args.requestedMode === 'auto' && !args.queryHeuristicApplied) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:4:// Validates session state management, cross-turn deduplication,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:12:  deduplicateResults,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:88:    expect(session.sessionId).toBe('sess-1');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:173:  it('deduplicates repeated IDs', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:268:describe('deduplicateResults()', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:285:    const { results: deduped, metadata } = deduplicateResults(results, 'sess-1');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:288:    const result1 = deduped.find(r => r.id === 1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:289:    const result3 = deduped.find(r => r.id === 3);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:294:    expect(metadata.deduplicated).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:300:    const { results: deduped } = deduplicateResults(results, 'sess-1');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:301:    expect(deduped).toHaveLength(3);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:302:    expect(deduped.some(r => r.id === 1)).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:308:    const { results: deduped } = deduplicateResults(results, 'sess-1');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:310:    expect(deduped[deduped.length - 1].id).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:316:    const { results: deduped, metadata } = deduplicateResults(results, 'sess-1');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:318:    expect(metadata.deduplicated).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:320:    expect(deduped[0].score).toBeCloseTo(0.9, 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:326:    const { results: deduped, metadata } = deduplicateResults(results, 'sess-1');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:329:    for (const r of deduped) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:338:    const { results: deduped, metadata } = deduplicateResults(results, 'sess-1');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:339:    expect(metadata.deduplicated).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:340:    expect(deduped[0].score).toBeCloseTo(0.9, 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:344:    const { results: deduped, metadata } = deduplicateResults([], 'sess-1');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:345:    expect(deduped).toEqual([]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:346:    expect(metadata.deduplicated).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:502:    expect(session.sessionId).toBe('singleton-test');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:160:        enableDedup: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:161:        enableSessionBoost: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:83:  it('all intents have both System A and System B weight profiles', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:402:  it('getAdaptiveWeights returns correct profile for each intent', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:488:      const profile = INTENT_WEIGHT_PROFILES[intent];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:489:      const sum = profile!.semanticWeight + profile!.keywordWeight + profile!.recencyWeight;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:492:      expect(profile!.semanticWeight).toBeGreaterThanOrEqual(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:493:      expect(profile!.keywordWeight).toBeGreaterThanOrEqual(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:494:      expect(profile!.recencyWeight).toBeGreaterThanOrEqual(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:254:        sessionId: r.session_id as string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:283:    sessionId: r.session_id as string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:129:    const deduped = new Map<number | string, Record<string, unknown>>();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:131:      const existing = deduped.get(candidate.id as number | string);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:135:        deduped.set(candidate.id as number | string, candidate);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:139:    return Array.from(deduped.values())
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:57:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:72:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:86:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:98:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:265:  if (ns.sessionId) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:267:    params.push(ns.sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:313:    node.id, node.specFolder, node.loopType, node.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:387:    edge.id, edge.specFolder, edge.loopType, edge.sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:462:    snapshot.specFolder, snapshot.loopType, snapshot.sessionId, snapshot.iteration,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:469:export function getLatestSnapshot(specFolder: string, loopType: LoopType, sessionId?: string): CoverageSnapshot | null {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:471:  if (sessionId) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:476:    `).get(specFolder, loopType, sessionId) as Record<string, unknown> | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:488:export function getSnapshots(specFolder: string, loopType: LoopType, sessionId?: string): CoverageSnapshot[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:490:  if (sessionId) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:495:    `).all(specFolder, loopType, sessionId) as Record<string, unknown>[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:605:    sessionId: r.session_id as string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:621:    sessionId: r.session_id as string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:636:    sessionId: r.session_id as string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:194:    keywords: ['memory', 'context', 'session', 'previous session', 'prior work', 'last time', 'continue', 'resume', 'recover', 'continuation'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:216:      expect(modes.resume.tokenBudget).toBe(2000);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:226:    it('T205-D3: Budget ordering is logical (quick < resume < focused < deep)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:231:      const resumeBudget = modes.resume.tokenBudget;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:235:      expect(resumeBudget).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:238:      if (quickBudget === undefined || resumeBudget === undefined || focusedBudget === undefined || deepBudget === undefined) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:241:      expect(quickBudget).toBeLessThan(resumeBudget);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:242:      expect(resumeBudget).toBeLessThan(focusedBudget);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:7:// 1. Cross-turn deduplication — deprioritize already-seen results
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:34:  sessionId: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:51:/** Metadata attached to deduplication results. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:53:  deduplicated: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:80:   * @param sessionId - Unique session identifier.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:83:  getOrCreate(sessionId: string): SessionState {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:86:    const existing = this.sessions.get(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:99:      sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:108:    this.sessions.set(sessionId, session);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:115:   * @param sessionId - Session to update.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:118:  updateGoal(sessionId: string, goal: string | null): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:119:    const session = this.getOrCreate(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:127:   * @param sessionId - Session to update.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:130:  markSeen(sessionId: string, resultIds: Array<number | string>): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:131:    const session = this.getOrCreate(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:141:   * @param sessionId - Session to update.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:144:  addQuestion(sessionId: string, question: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:145:    const session = this.getOrCreate(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:153:   * @param sessionId - Session to update.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:156:  setAnchors(sessionId: string, anchors: string[]): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:157:    const session = this.getOrCreate(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:165:   * @param sessionId - Session to remove.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:167:  clear(sessionId: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:168:    this.sessions.delete(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:237: * @param results - Result set to deduplicate.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:238: * @param sessionId - Session ID for seen-result lookup.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:239: * @returns Modified result set with dedup metadata.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:241:function deduplicateResults(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:243:  sessionId: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:245:  const defaultMeta: DedupMetadata = { deduplicated: false, seenCount: 0, deprioritizedCount: 0 };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:255:  const session = manager.getOrCreate(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:270:        _deduplicated: true,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:276:  // Re-sort by score descending after dedup adjustments
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:286:      deduplicated: deprioritizedCount > 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:328: * @param sessionId - Session ID for goal lookup.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:333:  sessionId: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:345:  const session = manager.getOrCreate(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:411:  // Cross-turn dedup
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:412:  deduplicateResults,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:412:// V11: Error code deduplication and validation improvements
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:13://   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:358: * Duplicates are eliminated via `Set` deduplication before slicing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:616:    // Deep mode: expand query into variants and run hybrid for each, then dedup
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:748:          // Merge variant results, deduplicate by id, preserve first-occurrence order
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:846:            // Merge both result sets, deduplicate by id, baseline-first ordering
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:976:  // P0 fix: sessionId is for dedup/state tracking, NOT a governance boundary.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:978:  // passed an ephemeral sessionId, because memories don't have session-scoped access.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1218:  // + deduplicate by ID.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:119:  // Only deduplicate doubled consonants when a suffix was actually removed.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:124:  // Are identical consonants and deduplicate.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:55:function evictStale(sessionId: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:56:  const entries = sessionQueries.get(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:61:    sessionQueries.delete(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:64:    sessionQueries.set(sessionId, fresh.slice(-MAX_QUERIES_PER_SESSION));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:101:  sessionId: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:105:  const entries = sessionQueries.get(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:151: * @param sessionId - Session identifier (null = skip tracking)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:159:  sessionId: string | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:165:  if (!sessionId) return null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:172:  evictStale(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:175:  const detection = detectFlow(sessionId, tokens, timestamp);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:178:  const entries = sessionQueries.get(sessionId) ?? [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:180:  sessionQueries.set(sessionId, entries.slice(-MAX_QUERIES_PER_SESSION));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:192:        sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:207:  sessionId: string | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:222:      sessionId: sessionId ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:233:  sessionId: string | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:236:  if (!sessionId) return;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:238:  const entries = sessionQueries.get(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:255:      sessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:263:export function clearSession(sessionId: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:264:  sessionQueries.delete(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:270:export function getSessionQueryCount(sessionId: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:271:  return sessionQueries.get(sessionId)?.length ?? 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:148:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:149:  enableDedup: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:150:  enableSessionBoost: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:288: * State filtering, session dedup, constitutional injection, channel attribution.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:236:    enableDedup: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:237:    enableSessionBoost: isSessionBoostEnabled(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:44:  sessionId?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:63:  sessionId?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:191:      event.sessionId ?? null
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:257:    if (opts.sessionId !== undefined) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:259:      params.push(opts.sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts:19: * Canonical identity for path deduplication.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:82: *   logger.warn('Cleanup failed', { sessionId: 'abc', elapsed: 42 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:83: *   // stderr: 'WARN  [session-manager] Cleanup failed {"sessionId":"abc","elapsed":42}'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:9:// 3. MPAB chunk collapse        — dedup chunks, reassemble parents
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:539:  // Merge non-chunks + reassembled parent rows, deduplicate by id (prefer highest score),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:980:  if (isHybrid && config.enableSessionBoost && config.sessionId) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:984:        config.sessionId
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:6:// session-resume.ts, and other consumers.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/README.md:3:description: "Utility functions for output formatting, path security, canonical path deduplication, and structured logging."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/README.md:14:> Utility functions for output formatting, path security, canonical path deduplication, and structured logging.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/README.md:55: canonical-path.ts   # Canonical path identity for deduplication
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/README.md:66:| `canonical-path.ts` | Canonical path identity for symlink-aware deduplication (`getCanonicalPathKey`) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/README.md:86:| `getCanonicalPathKey` | Resolve a file path to its canonical identity (via `realpathSync`), collapsing symlink aliases for deduplication |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:394: * @param queries - Array of query strings to deduplicate.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:34:// NOT in Stage 4: session dedup — that happens after cache in the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:235: * **Session dedup:** Session deduplication is intentionally NOT performed here.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:343:      // Fix #14 — sessionDeduped removed; dedup is post-cache in main handler
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:41:function dedupeRowsById<T extends Record<string, unknown>>(rows: T[]): T[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:70:    'working_memory',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:112:  'working_memory',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:315:  'working_memory', 'session_state', 'session_sent_memories', 'session_learning',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:602:    return dedupeRowsById([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:728:      return dedupeRowsById([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:772:    return dedupeRowsById([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:847:    tableSnapshots.working_memory = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1107:      CREATE TABLE IF NOT EXISTS working_memory (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1126:    const wmColumns = (database.prepare('PRAGMA table_info(working_memory)').all() as Array<{ name: string }>)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1129:      database.exec('ALTER TABLE working_memory ADD COLUMN event_counter INTEGER NOT NULL DEFAULT 0');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1132:      database.exec('ALTER TABLE working_memory ADD COLUMN mention_count INTEGER NOT NULL DEFAULT 0');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1135:      database.exec('ALTER TABLE working_memory ADD COLUMN source_tool TEXT');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1138:      database.exec('ALTER TABLE working_memory ADD COLUMN source_call_id TEXT');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1141:      database.exec('ALTER TABLE working_memory ADD COLUMN extraction_rule_id TEXT');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1144:      database.exec('ALTER TABLE working_memory ADD COLUMN redaction_applied INTEGER NOT NULL DEFAULT 0');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1453:      const workingMemorySnapshot = tables.working_memory?.rows ?? [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1678:    // Merge mode: INSERT OR REPLACE triggers CASCADE DELETE on working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1696:    // Ensure working_memory table schema is ready BEFORE the transaction.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1699:    if (tableSnapshots.working_memory) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1873:          if (tableName === 'working_memory') {

exec
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1640ms:

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
The strict validator is still part of the evidence trail for this iteration, and I’m polling it now while I narrow the Public-side session files down to the exact lifecycle points we need. The broad grep was noisy, so I’m switching to targeted reads around session minting, resume/health, session-state, working-memory, and compaction injection.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '340,470p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   340	  const meta = typeof envelope.meta === 'object' && envelope.meta !== null && !Array.isArray(envelope.meta)
   341	    ? envelope.meta as Record<string, unknown>
   342	    : {};
   343	  meta.structuralRoutingNudge = nudge;
   344	  envelope.meta = meta;
   345	}
   346	
   347	function resolveToolCallId(request: { id?: unknown }): string {
   348	  const requestId = request.id;
   349	  if (typeof requestId === 'string' || typeof requestId === 'number') {
   350	    return String(requestId);
   351	  }
   352	  generatedCallIdCounter += 1;
   353	  return `generated-${generatedCallIdCounter}`;
   354	}
   355	
   356	function resolveSessionTrackingId(
   357	  args: Record<string, unknown>,
   358	  extra: unknown,
   359	): string | undefined {
   360	  const transportSessionId = typeof (extra as { sessionId?: unknown } | null)?.sessionId === 'string'
   361	    ? ((extra as { sessionId?: string }).sessionId ?? null)
   362	    : null;
   363	  const explicitSessionId = typeof args.sessionId === 'string'
   364	    ? args.sessionId
   365	    : typeof args.session_id === 'string'
   366	      ? args.session_id
   367	      : null;
   368	  const codexThreadId = typeof process.env.CODEX_THREAD_ID === 'string'
   369	    && process.env.CODEX_THREAD_ID.trim().length > 0
   370	    ? process.env.CODEX_THREAD_ID.trim()
   371	    : null;
   372	
   373	  return explicitSessionId ?? transportSessionId ?? codexThreadId ?? undefined;
   374	}
   375	
   376	// REQ-014: Sticky session for follow_on_tool_use correlation.
   377	// Stores the last resolved session ID so non-search tools (e.g. memory_stats)
   378	// that lack an explicit sessionId param can still correlate with a prior search.
   379	// Safe for stdio (single client). TTL in query-flow-tracker bounds staleness.
   380	let lastKnownSessionId: string | null = null;
   381	
   382	function runAfterToolCallbacks(tool: string, callId: string, result: unknown): void {
   383	  if (afterToolCallbacks.length === 0) {
   384	    return;
   385	  }
   386	
   387	  queueMicrotask(() => {
   388	    for (const callback of afterToolCallbacks) {
   389	      void callback(tool, callId, result).catch((error: unknown) => {
   390	        const message = error instanceof Error ? error.message : String(error);
   391	        console.error(`[context-server] afterTool callback failed for '${tool}' (${callId}): ${message}`);
   392	      });
   393	    }
   394	  });
   395	}
   396	
   397	function isRecord(value: unknown): value is Record<string, unknown> {
   398	  return typeof value === 'object' && value !== null && !Array.isArray(value);
   399	}
   400	
   401	function looksLikeGraphableFilePath(value: string): boolean {
   402	  const trimmed = value.trim();
   403	  if (!trimmed || trimmed.includes('*') || trimmed.includes('?')) {
   404	    return false;
   405	  }
   406	
   407	  if (
   408	    trimmed.startsWith('http://') ||
   409	    trimmed.startsWith('https://') ||
   410	    trimmed.startsWith('app://') ||
   411	    trimmed.startsWith('plugin://')
   412	  ) {
   413	    return false;
   414	  }
   415	
   416	  return (
   417	    trimmed.startsWith('/') ||
   418	    trimmed.startsWith('./') ||
   419	    trimmed.startsWith('../') ||
   420	    trimmed.includes('/') ||
   421	    trimmed.includes('\\') ||
   422	    path.extname(trimmed).length > 0
   423	  );
   424	}
   425	
   426	function normalizeGraphFilePath(value: string): string | null {
   427	  if (!looksLikeGraphableFilePath(value)) {
   428	    return null;
   429	  }
   430	
   431	  const normalized = path.isAbsolute(value)
   432	    ? path.normalize(value)
   433	    : path.resolve(process.cwd(), value);
   434	  const workspaceRoot = path.resolve(process.cwd());
   435	  const relativeToWorkspace = path.relative(workspaceRoot, normalized);
   436	
   437	  if (
   438	    relativeToWorkspace.startsWith('..') ||
   439	    path.isAbsolute(relativeToWorkspace)
   440	  ) {
   441	    return null;
   442	  }
   443	
   444	  try {
   445	    if (!fs.existsSync(normalized) || !fs.statSync(normalized).isFile()) {
   446	      return null;
   447	    }
   448	  } catch {
   449	    return null;
   450	  }
   451	
   452	  return normalized;
   453	}
   454	
   455	function extractFilePathsFromToolArgs(args: unknown): string[] {
   456	  const results = new Set<string>();
   457	  const visited = new WeakSet<object>();
   458	
   459	  const visit = (value: unknown, keyHint?: string): void => {
   460	    if (typeof value === 'string') {
   461	      const normalized = normalizeGraphFilePath(value);
   462	      const keyLooksPathLike = keyHint
   463	        ? /(^|_)(path|file|target|subject|seed)s?$/i.test(keyHint) || /path|file/i.test(keyHint)
   464	        : false;
   465	      if (normalized && (keyLooksPathLike || looksLikeGraphableFilePath(value))) {
   466	        results.add(normalized);
   467	      }
   468	      return;
   469	    }
   470	

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '740,820p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js | sed -n '296,450p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
I have the first lifecycle contrast now: Mnemosyne doesn’t really have a first-class session object, it has project/global collections plus prompt instructions about how to behave during a session. I’m pulling the Public-side evidence for the opposite model now: server-minted session IDs, working-memory state, resume flows, and session health snapshots.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Session State
     3	// ───────────────────────────────────────────────────────────────
     4	// REQ-D5-006: Retrieval session state for cross-turn context
     5	//
     6	// PURPOSE: Track per-session retrieval state to enable:
     7	// 1. Cross-turn deduplication — deprioritize already-seen results
     8	// 2. Goal-aware refinement — boost results aligned with session goal
     9	// 3. Stateful session tracking — questions, anchors, seen items
    10	//
    11	// FEATURE FLAG: SPECKIT_SESSION_RETRIEVAL_STATE_V1 (default ON, graduated; set false to disable)
    12	//
    13	// STORAGE: In-memory only (ephemeral by design, no SQLite persistence).
    14	// Sessions expire after 30 minutes of inactivity, LRU eviction at 100 capacity.
    15	
    16	// -- Constants --
    17	
    18	/** Session inactivity TTL in milliseconds (30 minutes). */
    19	const SESSION_TTL_MS = 30 * 60 * 1000;
    20	
    21	/** Maximum concurrent sessions before LRU eviction. */
    22	const MAX_SESSIONS = 100;
    23	
    24	/** Score multiplier for seen results (deprioritize, don't remove). */
    25	const SEEN_DEDUP_FACTOR = 0.3;
    26	
    27	/** Maximum goal alignment boost factor. */
    28	const GOAL_BOOST_MAX = 1.2;
    29	
    30	// -- Types --
    31	
    32	/** Session state for a single retrieval session. */
    33	interface SessionState {
    34	  sessionId: string;
    35	  activeGoal: string | null;
    36	  seenResultIds: Set<string>;
    37	  openQuestions: string[];
    38	  preferredAnchors: string[];
    39	  createdAt: number;
    40	  updatedAt: number;
    41	}
    42	
    43	/** Minimal result shape for session operations. */
    44	interface SessionResult {
    45	  id: number | string;
    46	  content?: string;
    47	  score?: number;
    48	  [key: string]: unknown;
    49	}
    50	
    51	/** Metadata attached to deduplication results. */
    52	interface DedupMetadata {
    53	  deduplicated: boolean;
    54	  seenCount: number;
    55	  deprioritizedCount: number;
    56	}
    57	
    58	/** Result of goal-aware refinement. */
    59	interface GoalRefinementMetadata {
    60	  refined: boolean;
    61	  activeGoal: string | null;
    62	  boostedCount: number;
    63	}
    64	
    65	// -- Session State Manager --
    66	
    67	/**
    68	 * In-memory session state manager with TTL-based cleanup and LRU eviction.
    69	 *
    70	 * Sessions are ephemeral — they exist only in process memory and are not
    71	 * persisted to disk or database. This is intentional: session state is
    72	 * transient retrieval context, not durable memory.
    73	 */
    74	class SessionStateManager {
    75	  private sessions: Map<string, SessionState> = new Map();
    76	
    77	  /**
    78	   * Get an existing session or create a new one.
    79	   *
    80	   * @param sessionId - Unique session identifier.
    81	   * @returns The session state (existing or newly created).
    82	   */
    83	  getOrCreate(sessionId: string): SessionState {
    84	    this.evictExpired();
    85	
    86	    const existing = this.sessions.get(sessionId);
    87	    if (existing) {
    88	      existing.updatedAt = Date.now();
    89	      return existing;
    90	    }
    91	
    92	    // LRU eviction if at capacity
    93	    if (this.sessions.size >= MAX_SESSIONS) {
    94	      this.evictLRU();
    95	    }
    96	
    97	    const now = Date.now();
    98	    const session: SessionState = {
    99	      sessionId,
   100	      activeGoal: null,
   101	      seenResultIds: new Set(),
   102	      openQuestions: [],
   103	      preferredAnchors: [],
   104	      createdAt: now,
   105	      updatedAt: now,
   106	    };
   107	
   108	    this.sessions.set(sessionId, session);
   109	    return session;
   110	  }
   111	
   112	  /**
   113	   * Update the active retrieval goal for a session.
   114	   *
   115	   * @param sessionId - Session to update.
   116	   * @param goal - The new active goal (or null to clear).
   117	   */
   118	  updateGoal(sessionId: string, goal: string | null): void {
   119	    const session = this.getOrCreate(sessionId);
   120	    session.activeGoal = goal;
   121	    session.updatedAt = Date.now();
   122	  }
   123	
   124	  /**
   125	   * Mark result IDs as seen in a session (accumulates across calls).
   126	   *
   127	   * @param sessionId - Session to update.
   128	   * @param resultIds - Result IDs to mark as seen.
   129	   */
   130	  markSeen(sessionId: string, resultIds: Array<number | string>): void {
   131	    const session = this.getOrCreate(sessionId);
   132	    for (const id of resultIds) {
   133	      session.seenResultIds.add(String(id));
   134	    }
   135	    session.updatedAt = Date.now();
   136	  }
   137	
   138	  /**
   139	   * Add an unresolved question to the session.
   140	   *
   141	   * @param sessionId - Session to update.
   142	   * @param question - The question to track.
   143	   */
   144	  addQuestion(sessionId: string, question: string): void {
   145	    const session = this.getOrCreate(sessionId);
   146	    session.openQuestions.push(question);
   147	    session.updatedAt = Date.now();
   148	  }
   149	
   150	  /**
   151	   * Set preferred anchors for the session.
   152	   *
   153	   * @param sessionId - Session to update.
   154	   * @param anchors - Array of preferred anchor names.
   155	   */
   156	  setAnchors(sessionId: string, anchors: string[]): void {
   157	    const session = this.getOrCreate(sessionId);
   158	    session.preferredAnchors = [...anchors];
   159	    session.updatedAt = Date.now();
   160	  }
   161	
   162	  /**
   163	   * Remove a session entirely.
   164	   *
   165	   * @param sessionId - Session to remove.
   166	   */
   167	  clear(sessionId: string): void {
   168	    this.sessions.delete(sessionId);
   169	  }
   170	
   171	  /**
   172	   * Get the current number of active sessions.
   173	   * Useful for monitoring and testing.
   174	   */
   175	  get size(): number {
   176	    return this.sessions.size;
   177	  }
   178	
   179	  /**
   180	   * Clear all sessions. Useful for testing.
   181	   */
   182	  clearAll(): void {
   183	    this.sessions.clear();
   184	  }
   185	
   186	  // -- Internal Helpers --
   187	
   188	  /**
   189	   * Evict sessions that have exceeded the inactivity TTL.
   190	   */
   191	  private evictExpired(): void {
   192	    const now = Date.now();
   193	    for (const [id, session] of this.sessions) {
   194	      if (now - session.updatedAt > SESSION_TTL_MS) {
   195	        this.sessions.delete(id);
   196	      }
   197	    }
   198	  }
   199	
   200	  /**
   201	   * Evict the least-recently-updated session (LRU).
   202	   * Called when session count reaches MAX_SESSIONS.
   203	   */
   204	  private evictLRU(): void {
   205	    let oldestId: string | null = null;
   206	    let oldestTime = Infinity;
   207	
   208	    for (const [id, session] of this.sessions) {
   209	      if (session.updatedAt < oldestTime) {
   210	        oldestTime = session.updatedAt;
   211	        oldestId = id;
   212	      }
   213	    }
   214	
   215	    if (oldestId !== null) {
   216	      this.sessions.delete(oldestId);
   217	    }
   218	  }
   219	}
   220	

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts | sed -n '220,430p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   220	
   221	// -- Singleton Manager --
   222	
   223	const manager = new SessionStateManager();
   224	
   225	// -- Feature Flag --
   226	
   227	// Session retrieval state gate — canonical implementation in search-flags.ts.
   228	// Default: TRUE (graduated). Set SPECKIT_SESSION_RETRIEVAL_STATE_V1=false to disable.
   229	import { isSessionRetrievalStateEnabled } from './search-flags.js';
   230	
   231	// -- Cross-Turn Deduplication --
   232	
   233	/**
   234	 * Deprioritize results whose IDs appear in the session's seenResultIds set.
   235	 * Does NOT remove results — just multiplies their score by SEEN_DEDUP_FACTOR (0.3).
   236	 *
   237	 * @param results - Result set to deduplicate.
   238	 * @param sessionId - Session ID for seen-result lookup.
   239	 * @returns Modified result set with dedup metadata.
   240	 */
   241	function deduplicateResults(
   242	  results: SessionResult[],
   243	  sessionId: string,
   244	): { results: SessionResult[]; metadata: DedupMetadata } {
   245	  const defaultMeta: DedupMetadata = { deduplicated: false, seenCount: 0, deprioritizedCount: 0 };
   246	
   247	  if (!Array.isArray(results) || results.length === 0) {
   248	    return { results, metadata: defaultMeta };
   249	  }
   250	
   251	  if (!isSessionRetrievalStateEnabled()) {
   252	    return { results, metadata: defaultMeta };
   253	  }
   254	
   255	  const session = manager.getOrCreate(sessionId);
   256	  if (session.seenResultIds.size === 0) {
   257	    return { results, metadata: { ...defaultMeta, seenCount: 0 } };
   258	  }
   259	
   260	  let deprioritizedCount = 0;
   261	
   262	  const modified = results.map((result) => {
   263	    const resultIdStr = String(result.id);
   264	    if (session.seenResultIds.has(resultIdStr)) {
   265	      deprioritizedCount++;
   266	      const baseScore = typeof result.score === 'number' && Number.isFinite(result.score) ? result.score : 0;
   267	      return {
   268	        ...result,
   269	        score: baseScore * SEEN_DEDUP_FACTOR,
   270	        _deduplicated: true,
   271	      };
   272	    }
   273	    return result;
   274	  });
   275	
   276	  // Re-sort by score descending after dedup adjustments
   277	  modified.sort((a, b) => {
   278	    const scoreA = typeof a.score === 'number' ? a.score : 0;
   279	    const scoreB = typeof b.score === 'number' ? b.score : 0;
   280	    return scoreB - scoreA;
   281	  });
   282	
   283	  return {
   284	    results: modified,
   285	    metadata: {
   286	      deduplicated: deprioritizedCount > 0,
   287	      seenCount: session.seenResultIds.size,
   288	      deprioritizedCount,
   289	    },
   290	  };
   291	}
   292	
   293	// -- Goal-Aware Refinement --
   294	
   295	/**
   296	 * Compute keyword overlap between goal and content.
   297	 * Returns a score between 0 and 1 based on fraction of goal keywords found in content.
   298	 */
   299	function computeGoalAlignment(goal: string, content: string): number {
   300	  if (!goal || !content) return 0;
   301	
   302	  const goalWords = new Set(
   303	    goal
   304	      .toLowerCase()
   305	      .split(/\s+/)
   306	      .filter((w) => w.length > 2), // skip very short words
   307	  );
   308	
   309	  if (goalWords.size === 0) return 0;
   310	
   311	  const contentLower = content.toLowerCase();
   312	  let matchCount = 0;
   313	
   314	  for (const word of goalWords) {
   315	    if (contentLower.includes(word)) {
   316	      matchCount++;
   317	    }
   318	  }
   319	
   320	  return matchCount / goalWords.size;
   321	}
   322	
   323	/**
   324	 * Boost results that align with the session's active goal.
   325	 * Applies a boost factor of up to GOAL_BOOST_MAX (1.2x) based on keyword overlap.
   326	 *
   327	 * @param results - Result set to refine.
   328	 * @param sessionId - Session ID for goal lookup.
   329	 * @returns Modified result set with refinement metadata.
   330	 */
   331	function refineForGoal(
   332	  results: SessionResult[],
   333	  sessionId: string,
   334	): { results: SessionResult[]; metadata: GoalRefinementMetadata } {
   335	  const defaultMeta: GoalRefinementMetadata = { refined: false, activeGoal: null, boostedCount: 0 };
   336	
   337	  if (!Array.isArray(results) || results.length === 0) {
   338	    return { results, metadata: defaultMeta };
   339	  }
   340	
   341	  if (!isSessionRetrievalStateEnabled()) {
   342	    return { results, metadata: defaultMeta };
   343	  }
   344	
   345	  const session = manager.getOrCreate(sessionId);
   346	  if (!session.activeGoal) {
   347	    return { results, metadata: { ...defaultMeta, activeGoal: null } };
   348	  }
   349	
   350	  const goal = session.activeGoal;
   351	  let boostedCount = 0;
   352	
   353	  const modified = results.map((result) => {
   354	    const content = typeof result.content === 'string' ? result.content : '';
   355	    const alignment = computeGoalAlignment(goal, content);
   356	
   357	    if (alignment > 0) {
   358	      boostedCount++;
   359	      const boostFactor = 1 + alignment * (GOAL_BOOST_MAX - 1);
   360	      const baseScore = typeof result.score === 'number' && Number.isFinite(result.score) ? result.score : 0;
   361	      return {
   362	        ...result,
   363	        score: baseScore * boostFactor,
   364	        _goalBoosted: true,
   365	        _goalAlignment: Math.round(alignment * 1000) / 1000,
   366	      };
   367	    }
   368	
   369	    return result;
   370	  });
   371	
   372	  // Re-sort by score descending after goal boost
   373	  modified.sort((a, b) => {
   374	    const scoreA = typeof a.score === 'number' ? a.score : 0;
   375	    const scoreB = typeof b.score === 'number' ? b.score : 0;
   376	    return scoreB - scoreA;
   377	  });
   378	
   379	  return {
   380	    results: modified,
   381	    metadata: {
   382	      refined: boostedCount > 0,
   383	      activeGoal: goal,
   384	      boostedCount,
   385	    },
   386	  };
   387	}
   388	
   389	// -- Exports --
   390	
   391	export {
   392	  // Types
   393	  type SessionState,
   394	  type SessionResult,
   395	  type DedupMetadata,
   396	  type GoalRefinementMetadata,
   397	
   398	  // Constants
   399	  SESSION_TTL_MS,
   400	  MAX_SESSIONS,
   401	  SEEN_DEDUP_FACTOR,
   402	  GOAL_BOOST_MAX,
   403	
   404	  // Feature flag
   405	  isSessionRetrievalStateEnabled,
   406	
   407	  // Session management (via singleton)
   408	  manager,
   409	  SessionStateManager,
   410	
   411	  // Cross-turn dedup
   412	  deduplicateResults,
   413	
   414	  // Goal-aware refinement
   415	  refineForGoal,
   416	  computeGoalAlignment,
   417	};

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Session Resume Handler
     3	// ───────────────────────────────────────────────────────────────
     4	// Phase 020: Composite MCP tool that merges memory resume context,
     5	// code graph status, and CocoIndex availability into a single call.
     6	
     7	import { createHash } from 'node:crypto';
     8	import { statSync } from 'node:fs';
     9	import { isCocoIndexAvailable } from '../lib/utils/cocoindex-path.js';
    10	import { handleMemoryContext } from './memory-context.js';
    11	import * as graphDb from '../lib/code-graph/code-graph-db.js';
    12	import { getGraphFreshness, type GraphFreshness } from '../lib/code-graph/ensure-ready.js';
    13	import { computeQualityScore, recordMetricEvent, recordBootstrapEvent } from '../lib/session/context-metrics.js';
    14	import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
    15	import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
    16	import {
    17	  buildStructuralContextTrust,
    18	  createSharedPayloadEnvelope,
    19	  summarizeUnknown,
    20	  summarizeCertaintyContract,
    21	  trustStateFromStructuralStatus,
    22	  type SharedPayloadCertainty,
    23	  type SharedPayloadEnvelope,
    24	  type SharedPayloadSection,
    25	} from '../lib/context/shared-payload.js';
    26	import {
    27	  buildOpenCodeTransportPlan,
    28	  type OpenCodeTransportPlan,
    29	} from '../lib/context/opencode-transport.js';
    30	import {
    31	  buildCodeGraphOpsContract,
    32	  type CodeGraphOpsContract,
    33	} from '../lib/code-graph/ops-hardening.js';
    34	import { loadMostRecentState, type HookProducerMetadata, type HookState } from '../hooks/claude/hook-state.js';
    35	import type { MCPResponse } from '@spec-kit/shared/types';
    36	
    37	/* ───────────────────────────────────────────────────────────────
    38	   1. TYPES
    39	──────────────────────────────────────────────────────────────── */
    40	
    41	export const CACHED_SESSION_SUMMARY_SCHEMA_VERSION = 1;
    42	export const CACHED_SESSION_SUMMARY_MAX_AGE_MS = 30 * 60 * 1000;
    43	
    44	export interface CachedSessionSummaryCandidate {
    45	  schemaVersion: number;
    46	  lastSpecFolder: string | null;
    47	  summaryText: string | null;
    48	  extractedAt: string | null;
    49	  stateUpdatedAt: string | null;
    50	  producerMetadata: HookProducerMetadata | null;
    51	}
    52	
    53	export interface CachedSessionSummary {
    54	  schemaVersion: number;
    55	  lastSpecFolder: string;
    56	  summaryText: string;
    57	  extractedAt: string;
    58	  lastClaudeTurnAt: string;
    59	  transcriptPath: string;
    60	  transcriptFingerprint: string;
    61	  cacheCreationInputTokens: number;
    62	  cacheReadInputTokens: number;
    63	  continuityText: string;
    64	  startupHint: string;
    65	}
    66	
    67	export interface CachedSessionSummaryDecision {
    68	  status: 'accepted' | 'rejected';
    69	  category: 'accepted' | 'fidelity' | 'freshness';
    70	  reason:
    71	    | 'accepted'
    72	    | 'missing_state'
    73	    | 'schema_version_mismatch'
    74	    | 'missing_summary'
    75	    | 'missing_producer_metadata'
    76	    | 'missing_required_fields'
    77	    | 'transcript_unreadable'
    78	    | 'transcript_identity_mismatch'
    79	    | 'stale_summary'
    80	    | 'summary_precedes_producer_turn'
    81	    | 'scope_mismatch'
    82	    | 'unknown_scope';
    83	  detail: string;
    84	  cachedSummary: CachedSessionSummary | null;
    85	}
    86	
    87	interface SessionResumeArgs {
    88	  specFolder?: string;
    89	  sessionId?: string;
    90	  minimal?: boolean;
    91	}
    92	
    93	interface CodeGraphStatus {
    94	  status: 'fresh' | 'stale' | 'empty' | 'error';
    95	  lastScan: string | null;
    96	  nodeCount: number;
    97	  edgeCount: number;
    98	  fileCount: number;
    99	}
   100	
   101	interface CocoIndexStatus {
   102	  available: boolean;
   103	  binaryPath: string;
   104	}
   105	
   106	interface SessionResumeResult {
   107	  memory: Record<string, unknown>;
   108	  codeGraph: CodeGraphStatus;
   109	  cocoIndex: CocoIndexStatus;
   110	  cachedSummary?: CachedSessionSummaryDecision;
   111	  structuralContext?: StructuralBootstrapContract;
   112	  sessionQuality?: 'healthy' | 'degraded' | 'critical' | 'unknown';
   113	  payloadContract?: SharedPayloadEnvelope;
   114	  opencodeTransport?: OpenCodeTransportPlan;
   115	  graphOps?: CodeGraphOpsContract;
   116	  hints: string[];
   117	}
   118	
   119	/* ───────────────────────────────────────────────────────────────
   120	   2. HELPERS
   121	──────────────────────────────────────────────────────────────── */
   122	
   123	function normalizeSpecFolder(specFolder: string | null | undefined): string | null {
   124	  if (typeof specFolder !== 'string') {
   125	    return null;
   126	  }
   127	
   128	  const trimmed = specFolder.trim();
   129	  if (trimmed.length === 0) {
   130	    return null;
   131	  }
   132	
   133	  return trimmed.replace(/^\.opencode\//, '');
   134	}
   135	
   136	function parseIsoMs(value: string | null | undefined): number | null {
   137	  if (typeof value !== 'string' || value.trim().length === 0) {
   138	    return null;
   139	  }
   140	
   141	  const parsed = Date.parse(value);
   142	  return Number.isNaN(parsed) ? null : parsed;
   143	}
   144	
   145	function isFiniteNonNegativeNumber(value: unknown): value is number {
   146	  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
   147	}
   148	
   149	function buildTranscriptFingerprint(
   150	  transcriptPath: string,
   151	  sizeBytes: number,
   152	  modifiedAtMs: number,
   153	): string {
   154	  return createHash('sha256')
   155	    .update(`${transcriptPath}:${sizeBytes}:${modifiedAtMs}`)
   156	    .digest('hex')
   157	    .slice(0, 16);
   158	}
   159	
   160	function rejectCachedSummary(
   161	  category: 'fidelity' | 'freshness',
   162	  reason: CachedSessionSummaryDecision['reason'],
   163	  detail: string,
   164	): CachedSessionSummaryDecision {
   165	  return {
   166	    status: 'rejected',
   167	    category,
   168	    reason,
   169	    detail,
   170	    cachedSummary: null,
   171	  };
   172	}
   173	
   174	export function buildCachedSessionSummaryCandidate(
   175	  state: HookState | null,
   176	): CachedSessionSummaryCandidate | null {
   177	  if (!state) {
   178	    return null;
   179	  }
   180	
   181	  return {
   182	    schemaVersion: CACHED_SESSION_SUMMARY_SCHEMA_VERSION,
   183	    lastSpecFolder: state.lastSpecFolder,
   184	    summaryText: state.sessionSummary?.text ?? null,
   185	    extractedAt: state.sessionSummary?.extractedAt ?? null,
   186	    stateUpdatedAt: state.updatedAt,
   187	    producerMetadata: state.producerMetadata,
   188	  };
   189	}
   190	
   191	export function evaluateCachedSessionSummaryCandidate(
   192	  candidate: CachedSessionSummaryCandidate | null,
   193	  options: {
   194	    specFolder?: string;
   195	    nowMs?: number;
   196	    maxAgeMs?: number;
   197	  } = {},
   198	): CachedSessionSummaryDecision {
   199	  if (!candidate) {
   200	    return rejectCachedSummary('fidelity', 'missing_state', 'No recent hook state was available for cached continuity reuse.');
   201	  }
   202	
   203	  if (candidate.schemaVersion !== CACHED_SESSION_SUMMARY_SCHEMA_VERSION) {
   204	    return rejectCachedSummary(
   205	      'fidelity',
   206	      'schema_version_mismatch',
   207	      `Expected schema version ${CACHED_SESSION_SUMMARY_SCHEMA_VERSION} but received ${String(candidate.schemaVersion)}.`,
   208	    );
   209	  }
   210	
   211	  const summaryText = candidate.summaryText?.trim() ?? '';
   212	  if (summaryText.length === 0 || parseIsoMs(candidate.extractedAt) === null) {
   213	    return rejectCachedSummary(
   214	      'fidelity',
   215	      'missing_summary',
   216	      'Cached continuity requires a non-empty session summary with a valid extractedAt timestamp.',
   217	    );
   218	  }
   219	
   220	  const producerMetadata = candidate.producerMetadata;
   221	  if (!producerMetadata) {
   222	    return rejectCachedSummary(
   223	      'fidelity',
   224	      'missing_producer_metadata',
   225	      'Producer metadata from packet 002 was missing, so cached continuity cannot be trusted.',
   226	    );
   227	  }
   228	
   229	  const transcript = producerMetadata.transcript;
   230	  const cacheTokens = producerMetadata.cacheTokens;
   231	  const producerTurnMs = parseIsoMs(producerMetadata.lastClaudeTurnAt);
   232	  if (
   233	    producerTurnMs === null
   234	    || !transcript
   235	    || typeof transcript.path !== 'string'
   236	    || transcript.path.trim().length === 0
   237	    || typeof transcript.fingerprint !== 'string'
   238	    || transcript.fingerprint.trim().length === 0
   239	    || !isFiniteNonNegativeNumber(transcript.sizeBytes)
   240	    || parseIsoMs(transcript.modifiedAt) === null
   241	    || !cacheTokens
   242	    || !isFiniteNonNegativeNumber(cacheTokens.cacheCreationInputTokens)
   243	    || !isFiniteNonNegativeNumber(cacheTokens.cacheReadInputTokens)
   244	  ) {
   245	    return rejectCachedSummary(
   246	      'fidelity',
   247	      'missing_required_fields',
   248	      'Producer metadata was missing required transcript identity or cache token fields.',
   249	    );
   250	  }
   251	
   252	  let transcriptStat: ReturnType<typeof statSync>;
   253	  try {
   254	    transcriptStat = statSync(transcript.path);
   255	  } catch (error: unknown) {
   256	    const message = error instanceof Error ? error.message : String(error);
   257	    return rejectCachedSummary(
   258	      'fidelity',
   259	      'transcript_unreadable',
   260	      `Transcript identity could not be confirmed because the transcript was unreadable: ${message}`,

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1290,1375p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '450,560p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
I’ve got the core contrast sharpened: Mnemosyne keeps “session continuity” in prompt instructions and collection naming, while Public keeps it in explicit session state and recovery payloads. I’m reading the cached-summary and working-memory paths next so we can answer the “created, maintained, ended, summarized” part with concrete code instead of just tool descriptions.
exec
/bin/zsh -lc 'rg -n "cachedSummary|continuityText|startupHint|sessionQuality|handleSessionResume|minimal|recordBootstrapEvent|recordMetricEvent" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
13:import { computeQualityScore, recordMetricEvent, recordBootstrapEvent } from '../lib/session/context-metrics.js';
63:  continuityText: string;
64:  startupHint: string;
84:  cachedSummary: CachedSessionSummary | null;
90:  minimal?: boolean;
110:  cachedSummary?: CachedSessionSummaryDecision;
112:  sessionQuality?: 'healthy' | 'degraded' | 'critical' | 'unknown';
170:    cachedSummary: null,
326:  const continuityText = `Last session worked on: ${cachedSpecFolder}\nSummary: ${summaryText}`;
332:    cachedSummary: {
342:      continuityText,
343:      startupHint: continuityText,
372:): T & { cachedSummary?: CachedSessionSummary } {
373:  if (decision.status !== 'accepted' || !decision.cachedSummary) {
379:    cachedSummary: decision.cachedSummary,
401:export async function handleSessionResume(args: SessionResumeArgs): Promise<MCPResponse> {
403:  recordMetricEvent({ kind: 'memory_recovery' });
409:  // ── Sub-call 1: Memory context resume (skip in minimal mode) ──
411:  if (args.minimal) {
412:    memoryResult = { skipped: true, reason: 'minimal mode' };
480:  const cachedSummaryDecision = getCachedSessionSummaryDecision({
484:  if (cachedSummaryDecision.status === 'accepted') {
487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
490:  let sessionQuality: SessionResumeResult['sessionQuality'];
491:  if (args.minimal) {
493:      sessionQuality = computeQualityScore().level;
495:      sessionQuality = 'unknown';
499:  const memoryCertainty: SharedPayloadCertainty = args.minimal
504:  const cachedCertainty: SharedPayloadCertainty = cachedSummaryDecision.status === 'accepted' ? 'estimated' : 'defaulted';
518:  if (cachedSummaryDecision.status === 'accepted' && cachedSummaryDecision.cachedSummary) {
523:        cachedSummaryDecision.cachedSummary.continuityText,
524:        `Cache tokens: create=${cachedSummaryDecision.cachedSummary.cacheCreationInputTokens}; read=${cachedSummaryDecision.cachedSummary.cacheReadInputTokens}`,
525:        `Transcript: ${cachedSummaryDecision.cachedSummary.transcriptFingerprint}`,
564:      ...(cachedSummaryDecision.status === 'accepted' ? [{ label: 'cached', certainty: cachedCertainty }] : []),
587:    cachedSummary: cachedSummaryDecision,
595:    ...(sessionQuality ? { sessionQuality } : {}),
600:  if (!args.minimal) {
601:    recordBootstrapEvent(

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '260,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   260	      `Transcript identity could not be confirmed because the transcript was unreadable: ${message}`,
   261	    );
   262	  }
   263	
   264	  const expectedFingerprint = buildTranscriptFingerprint(
   265	    transcript.path,
   266	    transcriptStat.size,
   267	    transcriptStat.mtimeMs,
   268	  );
   269	  if (
   270	    transcript.sizeBytes !== transcriptStat.size
   271	    || transcript.modifiedAt !== transcriptStat.mtime.toISOString()
   272	    || transcript.fingerprint !== expectedFingerprint
   273	  ) {
   274	    return rejectCachedSummary(
   275	      'fidelity',
   276	      'transcript_identity_mismatch',
   277	      'Transcript path, fingerprint, or file stats no longer match the persisted producer identity.',
   278	    );
   279	  }
   280	
   281	  const extractedAtMs = parseIsoMs(candidate.extractedAt);
   282	  const nowMs = options.nowMs ?? Date.now();
   283	  const maxAgeMs = options.maxAgeMs ?? CACHED_SESSION_SUMMARY_MAX_AGE_MS;
   284	  if (extractedAtMs === null || nowMs - extractedAtMs > maxAgeMs) {
   285	    return rejectCachedSummary(
   286	      'freshness',
   287	      'stale_summary',
   288	      `Cached summary age exceeded the freshness window of ${maxAgeMs}ms.`,
   289	    );
   290	  }
   291	
   292	  if (extractedAtMs < producerTurnMs) {
   293	    return rejectCachedSummary(
   294	      'freshness',
   295	      'summary_precedes_producer_turn',
   296	      'Cached summary predates the latest producer turn metadata and is therefore invalidated.',
   297	    );
   298	  }
   299	
   300	  const expectedSpecFolder = normalizeSpecFolder(options.specFolder);
   301	  const cachedSpecFolder = normalizeSpecFolder(candidate.lastSpecFolder);
   302	  if (expectedSpecFolder) {
   303	    if (!cachedSpecFolder) {
   304	      return rejectCachedSummary(
   305	        'freshness',
   306	        'unknown_scope',
   307	        'A target spec folder was requested, but the cached summary did not carry a scope anchor.',
   308	      );
   309	    }
   310	
   311	    if (cachedSpecFolder !== expectedSpecFolder) {
   312	      return rejectCachedSummary(
   313	        'freshness',
   314	        'scope_mismatch',
   315	        `Cached summary scope ${cachedSpecFolder} did not match requested scope ${expectedSpecFolder}.`,
   316	      );
   317	    }
   318	  } else if (!cachedSpecFolder) {
   319	    return rejectCachedSummary(
   320	      'freshness',
   321	      'unknown_scope',
   322	      'Cached summary scope was unknown, so the consumer failed closed instead of guessing.',
   323	    );
   324	  }
   325	
   326	  const continuityText = `Last session worked on: ${cachedSpecFolder}\nSummary: ${summaryText}`;
   327	  return {
   328	    status: 'accepted',
   329	    category: 'accepted',
   330	    reason: 'accepted',
   331	    detail: 'Cached summary passed fidelity and freshness gates and may be used additively.',
   332	    cachedSummary: {
   333	      schemaVersion: candidate.schemaVersion,
   334	      lastSpecFolder: cachedSpecFolder,
   335	      summaryText,
   336	      extractedAt: candidate.extractedAt!,
   337	      lastClaudeTurnAt: producerMetadata.lastClaudeTurnAt!,
   338	      transcriptPath: transcript.path,
   339	      transcriptFingerprint: transcript.fingerprint,
   340	      cacheCreationInputTokens: cacheTokens.cacheCreationInputTokens,
   341	      cacheReadInputTokens: cacheTokens.cacheReadInputTokens,
   342	      continuityText,
   343	      startupHint: continuityText,
   344	    },
   345	  };
   346	}
   347	
   348	export function getCachedSessionSummaryDecision(
   349	  options: {
   350	    specFolder?: string;
   351	    claudeSessionId?: string;
   352	    nowMs?: number;
   353	    maxAgeMs?: number;
   354	    state?: HookState | null;
   355	  } = {},
   356	): CachedSessionSummaryDecision {
   357	  const candidate = buildCachedSessionSummaryCandidate(
   358	    options.state ?? loadMostRecentState({
   359	      maxAgeMs: options.maxAgeMs,
   360	      scope: {
   361	        specFolder: options.specFolder,
   362	        claudeSessionId: options.claudeSessionId,
   363	      },
   364	    }),
   365	  );
   366	  return evaluateCachedSessionSummaryCandidate(candidate, options);
   367	}
   368	
   369	export function applyCachedSummaryAdditively<T extends Record<string, unknown>>(
   370	  baseline: T,
   371	  decision: CachedSessionSummaryDecision,
   372	): T & { cachedSummary?: CachedSessionSummary } {
   373	  if (decision.status !== 'accepted' || !decision.cachedSummary) {
   374	    return { ...baseline };
   375	  }
   376	
   377	  return {
   378	    ...baseline,
   379	    cachedSummary: decision.cachedSummary,
   380	  };
   381	}
   382	
   383	export function logCachedSummaryDecision(
   384	  surface: string,
   385	  decision: CachedSessionSummaryDecision,
   386	): void {
   387	  if (decision.status === 'accepted' || decision.reason === 'missing_state') {
   388	    return;
   389	  }
   390	
   391	  console.error(
   392	    `[${surface}] Cached summary rejected (${decision.category}): ${decision.reason} — ${decision.detail}`,
   393	  );
   394	}
   395	
   396	/* ───────────────────────────────────────────────────────────────
   397	   3. HANDLER
   398	──────────────────────────────────────────────────────────────── */
   399	
   400	/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
   401	export async function handleSessionResume(args: SessionResumeArgs): Promise<MCPResponse> {
   402	  // F052: Record memory recovery metric for session_resume
   403	  recordMetricEvent({ kind: 'memory_recovery' });
   404	
   405	  // Phase 024: Record bootstrap telemetry
   406	  const startMs = Date.now();
   407	  const hints: string[] = [];
   408	
   409	  // ── Sub-call 1: Memory context resume (skip in minimal mode) ──
   410	  let memoryResult: Record<string, unknown> = {};
   411	  if (args.minimal) {
   412	    memoryResult = { skipped: true, reason: 'minimal mode' };
   413	  } else {
   414	    try {
   415	      const mcpResponse = await handleMemoryContext({
   416	        input: 'resume previous work continue session',
   417	        mode: 'resume',
   418	        profile: 'resume',
   419	        specFolder: args.specFolder,
   420	      });
   421	      // Extract data from MCP envelope
   422	      if (mcpResponse?.content?.[0]?.text) {
   423	        try {
   424	          const parsed = JSON.parse(mcpResponse.content[0].text);
   425	          memoryResult = parsed?.data ?? parsed ?? {};
   426	        } catch {
   427	          memoryResult = { raw: mcpResponse.content[0].text };
   428	        }
   429	      }
   430	    } catch (error: unknown) {
   431	      const message = error instanceof Error ? error.message : String(error);
   432	      memoryResult = { error: message };
   433	      hints.push('Memory resume failed. Try memory_context manually.');
   434	    }
   435	  }
   436	
   437	  // ── Sub-call 2: Code graph status ───────────────────────────
   438	  let codeGraph: CodeGraphStatus = {
   439	    status: 'error',
   440	    lastScan: null,
   441	    nodeCount: 0,
   442	    edgeCount: 0,
   443	    fileCount: 0,
   444	  };
   445	  try {
   446	    const stats = graphDb.getStats();
   447	    const freshness = getGraphFreshness(process.cwd());
   448	    codeGraph = {
   449	      status: freshness,
   450	      lastScan: stats.lastScanTimestamp,
   451	      nodeCount: stats.totalNodes,
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
   491	  if (args.minimal) {
   492	    try {
   493	      sessionQuality = computeQualityScore().level;
   494	    } catch {
   495	      sessionQuality = 'unknown';
   496	    }
   497	  }
   498	
   499	  const memoryCertainty: SharedPayloadCertainty = args.minimal
   500	    ? 'defaulted'
   501	    : memoryResult.error
   502	      ? 'unknown'
   503	      : 'estimated';
   504	  const cachedCertainty: SharedPayloadCertainty = cachedSummaryDecision.status === 'accepted' ? 'estimated' : 'defaulted';
   505	  const codeGraphCertainty: SharedPayloadCertainty = codeGraph.status === 'error' ? 'unknown' : 'exact';
   506	  const cocoIndexCertainty: SharedPayloadCertainty = 'exact';
   507	  const structuralCertainty: SharedPayloadCertainty = 'exact';
   508	
   509	  const payloadSections: SharedPayloadSection[] = [
   510	    {
   511	      key: 'memory-resume',
   512	      title: 'Memory Resume',
   513	      content: summarizeUnknown(memoryResult),
   514	      source: 'memory',
   515	      certainty: memoryCertainty,
   516	    },
   517	  ];
   518	  if (cachedSummaryDecision.status === 'accepted' && cachedSummaryDecision.cachedSummary) {
   519	    payloadSections.push({
   520	      key: 'cached-continuity',

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '200,430p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   200	      details: { parameter: 'prompt' },
   201	      recovery: {
   202	        hint: 'Provide a non-empty string for the prompt parameter'
   203	      }
   204	    });
   205	  }
   206	
   207	  // T73 SECURITY: Validate caller-supplied sessionId through server-side session
   208	  // manager to prevent IDOR. Callers cannot read/write working memory for
   209	  // arbitrary sessions — only server-minted or previously tracked sessions.
   210	  let sessionId: string | undefined = rawSessionId;
   211	  if (rawSessionId) {
   212	    const trustedSession = sessionManager.resolveTrustedSession(rawSessionId, {
   213	      tenantId: args.tenantId,
   214	      userId: args.userId,
   215	      agentId: args.agentId,
   216	    });
   217	    if (trustedSession.error) {
   218	      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
   219	      return createMCPErrorResponse({
   220	        tool: 'memory_match_triggers',
   221	        error: trustedSession.error,
   222	        code: 'E_SESSION_SCOPE',
   223	        details: { requestedSessionId: rawSessionId },
   224	        recovery: {
   225	          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
   226	        },
   227	      });
   228	    }
   229	    sessionId = trustedSession.effectiveSessionId;
   230	  }
   231	
   232	  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
   233	    ? Math.min(Math.floor(rawLimit), 50)
   234	    : 3;
   235	  const turnNumber = (typeof rawTurnNumber === 'number' && Number.isFinite(rawTurnNumber) && rawTurnNumber >= 0)
   236	    ? Math.floor(rawTurnNumber)
   237	    : 1;
   238	
   239	  await checkDatabaseUpdated();
   240	
   241	  const startTime = Date.now();
   242	
   243	  // Eval logger — capture trigger query at entry (fail-safe)
   244	  let _evalQueryId = 0;
   245	  let _evalRunId = 0;
   246	  try {
   247	    const evalEntry = logSearchQuery({
   248	      query: prompt,
   249	      intent: 'trigger_match',
   250	      specFolder: null,
   251	    });
   252	    _evalQueryId = evalEntry.queryId;
   253	    _evalRunId = evalEntry.evalRunId;
   254	  } catch (_error: unknown) { /* eval logging must never break triggers handler */ }
   255	
   256	  const logFinalTriggerEval = (memoryIds: number[], latencyMs: number): void => {
   257	    try {
   258	      if (_evalRunId && _evalQueryId) {
   259	        logFinalResult({
   260	          evalRunId: _evalRunId,
   261	          queryId: _evalQueryId,
   262	          resultMemoryIds: memoryIds,
   263	          scores: memoryIds.map(() => 1.0), // trigger matches are binary
   264	          fusionMethod: 'trigger',
   265	          latencyMs,
   266	        });
   267	      }
   268	    } catch (_error: unknown) {
   269	      /* eval logging must never break triggers handler */
   270	    }
   271	  };
   272	
   273	  const useCognitive = includeCognitive &&
   274	    sessionId &&
   275	    workingMemory.isEnabled() &&
   276	    attentionDecay.getDb();
   277	
   278	  let decayStats: DecayStats | null = null;
   279	  if (useCognitive) {
   280	    try {
   281	      decayStats = { decayedCount: workingMemory.batchUpdateScores(sessionId as string) };
   282	    } catch (err: unknown) {
   283	      const message = toErrorMessage(err);
   284	      console.warn('[memory_match_triggers] Decay failed:', message);
   285	    }
   286	  }
   287	
   288	  const triggerMatchResult = triggerMatcher.matchTriggerPhrasesWithStats(prompt, limit * 2);
   289	  let results: TriggerMatch[] = triggerMatchResult.matches;
   290	
   291	  // C2 FIX: Post-filter by scope to prevent cross-tenant trigger leaks
   292	  const { specFolder, tenantId, userId, agentId, sharedSpaceId } = args;
   293	  if (specFolder || tenantId || userId || agentId || sharedSpaceId) {
   294	    try {
   295	      const database = initialize_db();
   296	      const memoryIds = results.map(r => r.memoryId);
   297	      if (memoryIds.length > 0) {
   298	        const placeholders = memoryIds.map(() => '?').join(',');
   299	        const scopeRows = database.prepare(`
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

exec
/bin/zsh -lc "rg -n \"working_memory|setAttentionScore|getSessionMemories|batchUpdateScores|session summary|sessionSummary|postflight|preflight|clearSession|clear\\(\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:761: *   - working_memory: entries with last_focused older than threshold
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:782:  // 1. Clean stale working_memory entries
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:784:    const wmStmt = db.prepare('DELETE FROM working_memory WHERE last_focused < ?');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:791:      errors.push(`working_memory cleanup: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:824:      `[session-manager] Stale session cleanup: removed ${workingMemoryDeleted} working_memory, ` +
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:843:function clearSession(sessionId: string): CleanupResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:854:      workingMemory.clearSession(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1092:      workingMemory.clearSession(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1410:  clearSession,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:198:| Clear session | `clearSession(sessionId)` | On explicit session end |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:220:import { getSessionStats, clearSession } from './session-manager';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:227:clearSession(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:37:- `session-learning.ts` - Task preflight, postflight, and learning history handlers.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:281:      decayStats = { decayedCount: workingMemory.batchUpdateScores(sessionId as string) };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:370:        workingMemory.setAttentionScore(sessionId as string, match.memoryId, 1.0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:398:    const sessionMemories: WorkingMemoryEntry[] = workingMemory.getSessionMemories(sessionId as string)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:15:// Feature catalog: Post-task learning measurement (task_postflight)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:69:  phase: 'preflight' | 'complete';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:70:  preflight: LearningScoreSnapshot;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:76:  phase: 'preflight';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:81:  postflight: LearningScoreSnapshot;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:112:  phase: 'preflight' | 'complete';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:134:    phase TEXT NOT NULL CHECK(phase IN ('preflight', 'complete')),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:300:/** Handle task_preflight tool - captures baseline knowledge scores before a task begins */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:343:       AND phase = 'preflight'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:370:        tool: 'task_preflight',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:379:            phase: 'preflight',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:388:          note: 'Existing preflight record was updated (not replaced)'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:393:      throw new MemoryError(ErrorCodes.DATABASE_ERROR, `Failed to update preflight record: ${message}`, {});
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:400:    VALUES (?, ?, 'preflight', ?, ?, ?, ?, ?, ?, ?)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:420:      tool: 'task_preflight',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:429:          phase: 'preflight',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:441:          ? `Call task_postflight with taskId: "${taskId}", sessionId: "${normalizedSessionId}" after completing the task`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:442:          : `Call task_postflight with taskId: "${taskId}" after completing the task`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:448:    console.error('[session-learning] Failed to insert preflight record:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:449:    throw new MemoryError(ErrorCodes.DATABASE_ERROR, 'Failed to store preflight record', { originalError: message });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:457:/** Handle task_postflight tool - measures learning by comparing post-task scores to baseline */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:505:    AND phase IN ('preflight', 'complete')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:506:    ORDER BY CASE phase WHEN 'preflight' THEN 0 ELSE 1 END,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:512:  const preflightCandidates = candidates.filter((row) => row.phase === 'preflight');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:515:  if (normalizedSessionId === null && preflightCandidates.length > 1) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:518:      `Multiple open preflight records found for spec_folder="${spec_folder}" and task_id="${taskId}". Provide sessionId to disambiguate postflight.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:523:  if (normalizedSessionId === null && preflightCandidates.length === 0 && completeCandidates.length > 1) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:531:  const preflightRecord = (preflightCandidates[0] ?? completeCandidates[0]) as PreflightRecord | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:533:  if (!preflightRecord) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:537:        ? `No preflight record found for spec_folder="${spec_folder}" and task_id="${taskId}". Call task_preflight first.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:538:        : `No preflight record found for spec_folder="${spec_folder}", task_id="${taskId}", session_id="${normalizedSessionId}". Call task_preflight first.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:543:  const deltaKnowledge = knowledge_score - preflightRecord.pre_knowledge_score;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:544:  const deltaUncertainty = preflightRecord.pre_uncertainty_score - uncertainty_score;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:545:  const deltaContext = context_score - preflightRecord.pre_context_score;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:594:      preflightRecord.id
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:601:      originalGaps = preflightRecord.knowledge_gaps ? JSON.parse(preflightRecord.knowledge_gaps) : [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:607:      tool: 'task_postflight',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:612:          id: preflightRecord.id,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:615:          sessionId: (preflightRecord.session_id as string | null) ?? normalizedSessionId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:617:            knowledge: preflightRecord.pre_knowledge_score,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:618:            uncertainty: preflightRecord.pre_uncertainty_score,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:619:            context: preflightRecord.pre_context_score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:650:    console.error('[session-learning] Failed to update postflight record:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:651:    throw new MemoryError(ErrorCodes.DATABASE_ERROR, 'Failed to store postflight record', { originalError: message });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:720:        phase: row.phase as 'preflight' | 'complete',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:721:        preflight: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:735:          postflight: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:755:        phase: 'preflight',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:832:      : `Learning history: ${learningHistory.length} preflight records`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:836:      hints.push('Call task_postflight to complete learning measurement');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:872:const handle_task_preflight = handleTaskPreflight;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:873:const handle_task_postflight = handleTaskPostflight;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:878:  handle_task_preflight,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:879:  handle_task_postflight,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:298:export const handle_task_preflight = lazyFunction(getSessionLearningModule, 'handle_task_preflight');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:299:export const handle_task_postflight = lazyFunction(getSessionLearningModule, 'handle_task_postflight');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:33:import * as preflight from '../lib/validation/preflight.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:105:// Feature catalog: Dry-run preflight for memory_save
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1187:  // DryRun must remain non-mutating even when preflight is explicitly skipped.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1278:    const preflightResult = preflight.runPreflight(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1284:        find_similar: findSimilarMemories as Parameters<typeof preflight.runPreflight>[0]['find_similar'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1330:      const dryRunSummary = !preflightResult.dry_run_would_pass
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1331:        ? `Pre-flight validation failed: ${preflightResult.errors.length} error(s)`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1349:          would_pass: preflightResult.dry_run_would_pass
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1358:            errors: preflightResult.errors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1359:            warnings: preflightResult.warnings,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1360:            details: preflightResult.details,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1374:        hints: !preflightResult.dry_run_would_pass
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1398:    if (!preflightResult.pass) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1399:      const errorMessages = preflightResult.errors.map((e: string | { message: string }) =>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1405:      const firstError = preflightResult.errors[0];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1408:        : preflight.PreflightErrorCodes.ANCHOR_FORMAT_INVALID;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1409:      throw new preflight.PreflightError(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1413:          errors: preflightResult.errors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1414:          warnings: preflightResult.warnings,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1421:    if (preflightResult.warnings.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1422:      console.warn(`[preflight] ${validatedPath}: ${preflightResult.warnings.length} warning(s)`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1423:      preflightResult.warnings.forEach((w: string | { message: string }) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1425:        console.warn(`[preflight]   - ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1672:      summary: 'Atomic save preflight failed',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:6:  - "preflight"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:36:| Modules | 2 | preflight.ts, save-quality-gate.ts |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:59: preflight.ts         # Pre-flight validation before expensive operations
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:68:| `preflight.ts` | All validation logic: anchors, duplicates, tokens, content size, unified preflight |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:194:import { runPreflight } from './preflight';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:216:import { validateAnchorFormat } from './preflight';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:227:import { checkTokenBudget, estimateTokens } from './preflight';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:184:    summaryText: state.sessionSummary?.text ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:185:    extractedAt: state.sessionSummary?.extractedAt ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:216:      'Cached continuity requires a non-empty session summary with a valid extractedAt timestamp.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:8:// Feature catalog: Dry-run preflight for memory_save
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:29:/** Configuration for preflight checks */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:41:/** Issue (error or warning) reported during preflight */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:116:/** Parameters for the unified preflight check */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:130:/** Options for the unified preflight check */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:141:/** Details within a preflight result */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:149:/** Unified preflight result */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:167:/** Minimal database interface for preflight checks */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:562:      console.warn('[preflight] Exact duplicate check failed:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:601:      console.warn('[preflight] Similar duplicate check failed:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:18:// Feature catalog: Dry-run preflight for memory_save
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:11:// Feature catalog: Dry-run preflight for memory_save
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:159:    if (heading.includes('context summary') || heading.includes('session summary') || heading === 'overview') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:10:// Feature catalog: Dry-run preflight for memory_save
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:278:    console.error(`[extraction-adapter] Inserted working_memory item for memory ${memoryId} (${matched.rule.id})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:187:const toolOutput = { content: 'session summary text', memory_id: undefined };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:67:    accumulators.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:96:    accumulators.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:254:  accumulators.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:278:        accumulators.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:284:      accumulators.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:449:  regexLruCache.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:208:  'session summary': 'episodic',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:70:    'working_memory',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:112:  'working_memory',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:315:  'working_memory', 'session_state', 'session_sent_memories', 'session_learning',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:847:    tableSnapshots.working_memory = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1107:      CREATE TABLE IF NOT EXISTS working_memory (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1126:    const wmColumns = (database.prepare('PRAGMA table_info(working_memory)').all() as Array<{ name: string }>)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1129:      database.exec('ALTER TABLE working_memory ADD COLUMN event_counter INTEGER NOT NULL DEFAULT 0');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1132:      database.exec('ALTER TABLE working_memory ADD COLUMN mention_count INTEGER NOT NULL DEFAULT 0');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1135:      database.exec('ALTER TABLE working_memory ADD COLUMN source_tool TEXT');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1138:      database.exec('ALTER TABLE working_memory ADD COLUMN source_call_id TEXT');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1141:      database.exec('ALTER TABLE working_memory ADD COLUMN extraction_rule_id TEXT');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1144:      database.exec('ALTER TABLE working_memory ADD COLUMN redaction_applied INTEGER NOT NULL DEFAULT 0');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1453:      const workingMemorySnapshot = tables.working_memory?.rows ?? [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1678:    // Merge mode: INSERT OR REPLACE triggers CASCADE DELETE on working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1696:    // Ensure working_memory table schema is ready BEFORE the transaction.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1699:    if (tableSnapshots.working_memory) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1873:          if (tableName === 'working_memory') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:100:      'task_preflight',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:101:      'task_postflight',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:261:│   ├── preflight.ts            # Preflight checks
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:347:| `validation/preflight.ts` | Input validation and security checks |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:680:| Validation errors | Check input against `INPUT_LIMITS` in validation/preflight |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:382:  'session summary',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:46:    cache.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:55:  momentumCache.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:56:  depthCache.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:155:  specFolderCache.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:263:export function clearSession(sessionId: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:398:- Purpose: Owns preflight validation and save-time quality gates that reject malformed, duplicate, or low-signal writes before expensive work happens. It is a defensive boundary ahead of mutation and indexing paths.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:400:  - `preflight.ts` — dry-run and full preflight validation before save/index work.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:189:  if (state.sessionSummary?.text) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:190:    parts.push(`Summary: ${truncateInline(state.sessionSummary.text, SUMMARY_MAX_CHARS)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:106:  clear(): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:107:    this.files.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:108:    this.symbols.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:7:// The working_memory table, NOT memory_index. This is intentionally
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:46:  CREATE TABLE IF NOT EXISTS working_memory (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:66:  CREATE INDEX IF NOT EXISTS idx_wm_session ON working_memory(session_id);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:67:  CREATE INDEX IF NOT EXISTS idx_wm_attention ON working_memory(session_id, attention_score DESC);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:68:  CREATE INDEX IF NOT EXISTS idx_wm_added ON working_memory(added_at);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:69:  CREATE INDEX IF NOT EXISTS idx_wm_session_focus_lru ON working_memory(session_id, last_focused ASC, id ASC);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:70:  CREATE INDEX IF NOT EXISTS idx_wm_session_attention_focus ON working_memory(session_id, attention_score DESC, last_focused DESC);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:144:    const wmColumns = (db.prepare('PRAGMA table_info(working_memory)').all() as Array<{ name: string }>)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:148:      db.exec('ALTER TABLE working_memory ADD COLUMN event_counter INTEGER NOT NULL DEFAULT 0');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:151:      db.exec('ALTER TABLE working_memory ADD COLUMN mention_count INTEGER NOT NULL DEFAULT 0');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:154:      db.exec('ALTER TABLE working_memory ADD COLUMN source_tool TEXT');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:157:      db.exec('ALTER TABLE working_memory ADD COLUMN source_call_id TEXT');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:160:      db.exec('ALTER TABLE working_memory ADD COLUMN extraction_rule_id TEXT');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:163:      db.exec('ALTER TABLE working_memory ADD COLUMN redaction_applied INTEGER NOT NULL DEFAULT 0');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:179:    "SELECT sql FROM sqlite_master WHERE type='table' AND name='working_memory'"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:189:    ALTER TABLE working_memory RENAME TO working_memory_old;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:191:    INSERT INTO working_memory (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:220:    FROM working_memory_old;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:221:    DROP TABLE working_memory_old;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:236:function clearSession(sessionId: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:242:      'DELETE FROM working_memory WHERE session_id = ?'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:248:    console.warn(`[working-memory] clearSession error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:261:      "SELECT DISTINCT session_id FROM working_memory WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:264:      "DELETE FROM working_memory WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:285:      SELECT * FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:297:function getSessionMemories(sessionId: string): Array<Record<string, unknown>> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:304:      FROM working_memory wm
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:311:    console.warn(`[working-memory] getSessionMemories error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:339:      FROM working_memory wm
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:381:function setAttentionScore(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:395:      'SELECT id FROM working_memory WHERE session_id = ? AND memory_id = ?'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:400:        UPDATE working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:413:        INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:421:    console.warn(`[working-memory] setAttentionScore error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:450:      INSERT INTO working_memory (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:463:          WHEN excluded.attention_score > working_memory.attention_score THEN excluded.attention_score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:464:          ELSE working_memory.attention_score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:467:        focus_count = working_memory.focus_count + 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:468:        mention_count = MIN(working_memory.mention_count + 1, ${MAX_MENTION_COUNT}),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:488:      'SELECT focus_count FROM working_memory WHERE session_id = ? AND memory_id = ?'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:524:      'SELECT COUNT(*) as count FROM working_memory WHERE session_id = ? AND memory_id IS NOT NULL'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:531:      DELETE FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:533:        SELECT id FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:560:function batchUpdateScores(sessionId: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:572:      FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:587:      UPDATE working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:594:      DELETE FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:623:    console.warn(`[working-memory] batchUpdateScores error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:643:      FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:690:      FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:731:  clearSession,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:736:  getSessionMemories,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:743:  setAttentionScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:746:  batchUpdateScores,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:480:      "expectedResultDescription": "Should surface redaction-gate.ts, path-security.ts, preflight.ts, and any spec memories about data sanitization or access control in the save flow.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:990:      "expectedResultDescription": "Should surface path-security.ts, canonical-path.ts, preflight.ts validation, and the memory save handler input validation.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1095:      "query": "what is the learning index formula used in task preflight and postflight scoring",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:1100:      "expectedResultDescription": "Should surface the Learning Index formula (LI = KnowledgeDelta×0.4 + UncertaintyReduction×0.35 + ContextImprovement×0.25) from CLAUDE.md or memory_task_preflight tool documentation.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:269:| `working-memory.ts`        | Session memory management | `setAttentionScore`, `getWorkingMemory`, `batchUpdateScores`                |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:580:  setAttentionScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:582:  getSessionMemories,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:583:  batchUpdateScores,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:584:  clearSession,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:598:setAttentionScore(sessionId, memoryId, 1.0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:605:const memories = getSessionMemories(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:608:const updated = batchUpdateScores(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:616:clearSession(sessionId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:848:| **Session Decay** | Turn end → Apply decay               | `applyFsrsDecay`, `batchUpdateScores`        |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:976:A: **Retrievability** (R) is the FSRS-calculated probability of recall (0.0 to 1.0), based on stability and elapsed time. **Attention score** is the session-specific activation level in `working_memory`, which starts at 1.0 when a memory enters the session and decays at 0.95 per cycle.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:1053:| `SPECKIT_SESSION_BOOST`   | false   | Enable session-based score boost from working_memory attention signals |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:31: * When enabled, session attention scores from working_memory are used
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:97:      FROM working_memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:324:function clearSession(): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:354:  clearSession,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:92:    RELATED_CACHE.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:98:  RELATED_CACHE.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:80:    map.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:299:function clear(): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:302:  cache.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:303:  inFlight.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:304:  toolGenerations.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:500:  clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:453:    debounceTimers.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:106:| `clear()` | Clear entire cache |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:167:  clear(sessionId: string): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:183:    this.sessions.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-cache.ts:140:  clear(): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-cache.ts:141:    this.store.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:348:  clear(): void {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:350:    this.documents.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:351:    this.documentFreq.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:425:    this.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:482:  cursorStore.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:692:    constitutional_cache.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:693:    constitutional_cache_loading.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:852:  db_connections.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:141:  clear() {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:142:    this.cache.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:250:    query_cache.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:526:  cache.clear();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:528:  circuitBreakers.clear();

codex
The deeper Public difference is even clearer now: its session model has trust boundaries and lifecycle cleanup, not just recall/store verbs. I’m grabbing the session-manager pieces that mint, validate, persist, and clear sessions so the final comparison can be lifecycle-complete.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Session Manager
     3	// ───────────────────────────────────────────────────────────────
     4	import crypto from 'crypto';
     5	import fs from 'fs';
     6	import path from 'path';
     7	
     8	import type { DatabaseExtended as Database } from '@spec-kit/shared/types';
     9	// Import working-memory for immediate cleanup on session end (GAP 2).
    10	import * as workingMemory from '../cognitive/working-memory.js';
    11	
    12	// Feature catalog: Session-manager transaction gap fixes
    13	
    14	
    15	/* ───────────────────────────────────────────────────────────────
    16	   1. TYPES
    17	──────────────────────────────────────────────────────────────── */
    18	
    19	interface SessionConfig {
    20	  sessionTtlMinutes: number;
    21	  maxEntriesPerSession: number;
    22	  enabled: boolean;
    23	  dbUnavailableMode: 'allow' | 'block';
    24	}
    25	
    26	interface InitResult {
    27	  success: boolean;
    28	  error?: string;
    29	}
    30	
    31	interface MemoryInput {
    32	  id?: number;
    33	  file_path?: string;
    34	  anchorId?: string;
    35	  anchor_id?: string;
    36	  content_hash?: string;
    37	  title?: string;
    38	}
    39	
    40	interface MarkResult {
    41	  success: boolean;
    42	  hash?: string;
    43	  skipped?: boolean;
    44	  error?: string;
    45	}
    46	
    47	interface MarkBatchResult {
    48	  success: boolean;
    49	  markedCount: number;
    50	  skipped?: boolean;
    51	  error?: string;
    52	}
    53	
    54	interface SessionStats {
    55	  totalSent: number;
    56	  oldestEntry: string | null;
    57	  newestEntry: string | null;
    58	}
    59	
    60	interface FilterResult {
    61	  filtered: MemoryInput[];
    62	  dedupStats: {
    63	    enabled: boolean;
    64	    filtered: number;
    65	    total: number;
    66	    tokenSavingsEstimate?: string;
    67	    sessionId?: string;
    68	  };
    69	}
    70	
    71	interface CleanupResult {
    72	  success: boolean;
    73	  deletedCount: number;
    74	}
    75	
    76	interface StaleCleanupResult {
    77	  success: boolean;
    78	  workingMemoryDeleted: number;
    79	  sentMemoriesDeleted: number;
    80	  sessionStateDeleted: number;
    81	  errors: string[];
    82	}
    83	
    84	interface SessionState {
    85	  sessionId: string;
    86	  status: string;
    87	  specFolder: string | null;
    88	  currentTask: string | null;
    89	  lastAction: string | null;
    90	  contextSummary: string | null;
    91	  pendingWork: string | null;
    92	  tenantId: string | null;
    93	  userId: string | null;
    94	  agentId: string | null;
    95	  data: Record<string, unknown> | null;
    96	  createdAt: string;
    97	  updatedAt: string;
    98	  _recovered: boolean;
    99	}
   100	
   101	interface SessionIdentityScope {
   102	  tenantId?: string | null;
   103	  userId?: string | null;
   104	  agentId?: string | null;
   105	}
   106	
   107	interface SessionStateInput extends SessionIdentityScope {
   108	  specFolder?: string | null;
   109	  currentTask?: string | null;
   110	  lastAction?: string | null;
   111	  contextSummary?: string | null;
   112	  pendingWork?: string | null;
   113	  data?: Record<string, unknown> | null;
   114	}
   115	
   116	interface RecoverResult {
   117	  success: boolean;
   118	  state?: SessionState | null;
   119	  _recovered?: boolean;
   120	  error?: string;
   121	}
   122	
   123	interface InterruptedSession {
   124	  sessionId: string;
   125	  specFolder: string | null;
   126	  currentTask: string | null;
   127	  lastAction: string | null;
   128	  contextSummary: string | null;
   129	  pendingWork: string | null;
   130	  updatedAt: string;
   131	}
   132	
   133	interface InterruptedSessionsResult {
   134	  success: boolean;
   135	  sessions: InterruptedSession[];
   136	  error?: string;
   137	}
   138	
   139	interface ResetResult {
   140	  success: boolean;
   141	  interruptedCount: number;
   142	  error?: string;
   143	}
   144	
   145	interface CheckpointResult {
   146	  success: boolean;
   147	  filePath?: string;
   148	  note?: string;
   149	  error?: string;
   150	}
   151	
   152	interface ContinueSessionInput {
   153	  sessionId: string;
   154	  specFolder?: string | null;
   155	  currentTask?: string | null;
   156	  lastAction?: string | null;
   157	  contextSummary?: string | null;
   158	  pendingWork?: string | null;
   159	  tenantId?: string | null;
   160	  userId?: string | null;
   161	  agentId?: string | null;
   162	  data?: Record<string, unknown> | null;
   163	}
   164	
   165	interface TrustedSessionResolution {
   166	  requestedSessionId: string | null;
   167	  effectiveSessionId: string;
   168	  trusted: boolean;
   169	  error?: string;
   170	}
   171	
   172	/* ───────────────────────────────────────────────────────────────
   173	   2. CONFIGURATION
   174	──────────────────────────────────────────────────────────────── */
   175	
   176	/**
   177	 * Session configuration with defaults from spec.md (R7 mitigation)
   178	 * - Session TTL: 30 minutes
   179	 * - Cap at 100 entries per session
   180	 */
   181	const SESSION_CONFIG: SessionConfig = {
   182	  sessionTtlMinutes: parseInt(process.env.SESSION_TTL_MINUTES as string, 10) || 30,
   183	  maxEntriesPerSession: parseInt(process.env.SESSION_MAX_ENTRIES as string, 10) || 100,
   184	  enabled: process.env.DISABLE_SESSION_DEDUP !== 'true',
   185	  dbUnavailableMode: process.env.SESSION_DEDUP_DB_UNAVAILABLE_MODE === 'allow' ? 'allow' : 'block',
   186	};
   187	
   188	/* ───────────────────────────────────────────────────────────────
   189	   3. DATABASE REFERENCE
   190	──────────────────────────────────────────────────────────────── */
   191	
   192	let db: Database | null = null;
   193	// Track periodic cleanup interval for expired sessions
   194	let cleanupInterval: ReturnType<typeof setInterval> | null = null;
   195	const CLEANUP_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes
   196	
   197	// Track stale session cleanup interval (runs hourly)
   198	let staleCleanupInterval: ReturnType<typeof setInterval> | null = null;
   199	const STALE_CLEANUP_INTERVAL_MS = parseInt(process.env.STALE_CLEANUP_INTERVAL_MS as string, 10) || 60 * 60 * 1000; // 1 hour
   200	const STALE_SESSION_THRESHOLD_MS = parseInt(process.env.STALE_SESSION_THRESHOLD_MS as string, 10) || 24 * 60 * 60 * 1000; // 24 hours
   201	
   202	function init(database: Database): InitResult {
   203	  if (!database) {
   204	    console.error('[session-manager] WARNING: init() called with null database');
   205	    return { success: false, error: 'Database reference is required' };
   206	  }
   207	  db = database;
   208	
   209	  const schemaResult = ensureSchema();
   210	  if (!schemaResult.success) {
   211	    return schemaResult;
   212	  }
   213	
   214	  cleanupExpiredSessions();
   215	
   216	  // Set up periodic cleanup instead of only running once at init (P4-18).
   217	  // Clear any existing interval first (in case of reinitializeDatabase).
   218	  if (cleanupInterval) {
   219	    clearInterval(cleanupInterval);
   220	  }
   221	  cleanupInterval = setInterval(() => {
   222	    try {
   223	      cleanupExpiredSessions();
   224	    } catch (err: unknown) {
   225	      const message = err instanceof Error ? err.message : String(err);
   226	      console.warn(`[session-manager] Periodic cleanup failed: ${message}`);
   227	    }
   228	  }, CLEANUP_INTERVAL_MS);
   229	  // Ensure interval doesn't prevent process exit (unref allows GC on idle)
   230	  if (cleanupInterval && typeof cleanupInterval === 'object' && 'unref' in cleanupInterval) {
   231	    cleanupInterval.unref();
   232	  }
   233	
   234	  // Run stale session cleanup on startup and set up hourly interval
   235	  try {
   236	    cleanupStaleSessions();
   237	  } catch (err: unknown) {
   238	    const message = err instanceof Error ? err.message : String(err);
   239	    console.warn(`[session-manager] Initial stale session cleanup failed: ${message}`);
   240	  }

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '240,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   240	  }
   241	
   242	  if (staleCleanupInterval) {
   243	    clearInterval(staleCleanupInterval);
   244	  }
   245	  staleCleanupInterval = setInterval(() => {
   246	    try {
   247	      cleanupStaleSessions();
   248	    } catch (err: unknown) {
   249	      const message = err instanceof Error ? err.message : String(err);
   250	      console.warn(`[session-manager] Periodic stale session cleanup failed: ${message}`);
   251	    }
   252	  }, STALE_CLEANUP_INTERVAL_MS);
   253	  if (staleCleanupInterval && typeof staleCleanupInterval === 'object' && 'unref' in staleCleanupInterval) {
   254	    staleCleanupInterval.unref();
   255	  }
   256	
   257	  return { success: true };
   258	}
   259	
   260	function getDb(): Database | null {
   261	  return db;
   262	}
   263	
   264	function hasTable(tableName: string): boolean {
   265	  if (!db) return false;
   266	
   267	  try {
   268	    const row = db.prepare(
   269	      "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1"
   270	    ).get(tableName) as { 1?: number } | undefined;
   271	    return Boolean(row);
   272	  } catch {
   273	    return false;
   274	  }
   275	}
   276	
   277	function hasSessionStateRecord(sessionId: string): boolean {
   278	  if (!db || !hasTable('session_state')) return false;
   279	
   280	  try {
   281	    const row = db.prepare(
   282	      'SELECT 1 FROM session_state WHERE session_id = ? LIMIT 1'
   283	    ).get(sessionId) as { 1?: number } | undefined;
   284	    return Boolean(row);
   285	  } catch (error: unknown) {
   286	    const message = error instanceof Error ? error.message : String(error);
   287	    console.warn(`[session-manager] hasSessionStateRecord failed: ${message}`);
   288	    return false;
   289	  }
   290	}
   291	
   292	function hasSentMemoryRecord(sessionId: string): boolean {
   293	  if (!db || !hasTable('session_sent_memories')) return false;
   294	
   295	  try {
   296	    const row = db.prepare(
   297	      'SELECT 1 FROM session_sent_memories WHERE session_id = ? LIMIT 1'
   298	    ).get(sessionId) as { 1?: number } | undefined;
   299	    return Boolean(row);
   300	  } catch (error: unknown) {
   301	    const message = error instanceof Error ? error.message : String(error);
   302	    console.warn(`[session-manager] hasSentMemoryRecord failed: ${message}`);
   303	    return false;
   304	  }
   305	}
   306	
   307	function isTrackedSession(sessionId: string): boolean {
   308	  if (!sessionId || typeof sessionId !== 'string') {
   309	    return false;
   310	  }
   311	
   312	  const normalizedSessionId = sessionId.trim();
   313	  if (normalizedSessionId.length === 0) {
   314	    return false;
   315	  }
   316	
   317	  return workingMemory.sessionExists(normalizedSessionId)
   318	    || hasSessionStateRecord(normalizedSessionId)
   319	    || hasSentMemoryRecord(normalizedSessionId);
   320	}
   321	
   322	function normalizeIdentityValue(value: unknown): string | null {
   323	  if (typeof value !== 'string') {
   324	    return null;
   325	  }
   326	  const normalizedValue = value.trim();
   327	  return normalizedValue.length > 0 ? normalizedValue : null;
   328	}
   329	
   330	function getSessionIdentityRecord(sessionId: string): {
   331	  tenantId: string | null;
   332	  userId: string | null;
   333	  agentId: string | null;
   334	} | null {
   335	  if (!db || !hasTable('session_state')) {
   336	    return null;
   337	  }
   338	
   339	  const row = db.prepare(`
   340	    SELECT tenant_id, user_id, agent_id
   341	    FROM session_state
   342	    WHERE session_id = ?
   343	    LIMIT 1
   344	  `).get(sessionId) as Record<string, unknown> | undefined;
   345	
   346	  if (!row) {
   347	    return null;
   348	  }
   349	
   350	  return {
   351	    tenantId: normalizeIdentityValue(row.tenant_id),
   352	    userId: normalizeIdentityValue(row.user_id),
   353	    agentId: normalizeIdentityValue(row.agent_id),
   354	  };
   355	}
   356	
   357	function getIdentityMismatch(
   358	  storedIdentity: { tenantId: string | null; userId: string | null; agentId: string | null },
   359	  scope: SessionIdentityScope = {},
   360	): string | null {
   361	  const requestedTenantId = normalizeIdentityValue(scope.tenantId);
   362	  if (requestedTenantId && storedIdentity.tenantId !== requestedTenantId) {
   363	    return 'tenantId';
   364	  }
   365	
   366	  const requestedUserId = normalizeIdentityValue(scope.userId);
   367	  if (requestedUserId && storedIdentity.userId !== requestedUserId) {
   368	    return 'userId';
   369	  }
   370	
   371	  const requestedAgentId = normalizeIdentityValue(scope.agentId);
   372	  if (requestedAgentId && storedIdentity.agentId !== requestedAgentId) {
   373	    return 'agentId';
   374	  }
   375	
   376	  return null;
   377	}
   378	
   379	function hasCorroboratedIdentity(
   380	  storedIdentity: { tenantId: string | null; userId: string | null; agentId: string | null } | null,
   381	): storedIdentity is { tenantId: string | null; userId: string | null; agentId: string | null } {
   382	  return Boolean(storedIdentity && (storedIdentity.tenantId || storedIdentity.userId || storedIdentity.agentId));
   383	}
   384	
   385	function resolveTrustedSession(
   386	  requestedSessionId: string | null = null,
   387	  scope: SessionIdentityScope = {},
   388	): TrustedSessionResolution {
   389	  const normalizedSessionId = typeof requestedSessionId === 'string' && requestedSessionId.trim().length > 0
   390	    ? requestedSessionId.trim()
   391	    : null;
   392	
   393	  if (!normalizedSessionId) {
   394	    return {
   395	      requestedSessionId: null,
   396	      effectiveSessionId: crypto.randomUUID(),
   397	      trusted: false,
   398	    };
   399	  }
   400	
   401	  if (!isTrackedSession(normalizedSessionId)) {
   402	    return {
   403	      requestedSessionId: normalizedSessionId,
   404	      effectiveSessionId: '',
   405	      trusted: false,
   406	      error: `sessionId "${normalizedSessionId}" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
   407	    };
   408	  }
   409	
   410	  const storedIdentity = getSessionIdentityRecord(normalizedSessionId);
   411	  if (!hasCorroboratedIdentity(storedIdentity)) {
   412	    return {
   413	      requestedSessionId: normalizedSessionId,
   414	      effectiveSessionId: '',
   415	      trusted: false,
   416	      error: `sessionId "${normalizedSessionId}" is not bound to a corroborated server identity. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
   417	    };
   418	  }
   419	
   420	  const mismatch = getIdentityMismatch(storedIdentity, scope);

exec
/bin/zsh -lc "rg -n \"mint|server-generated|effectiveSessionId|resolveTrustedSession|saveSessionState|clearSession\\(|cleanup stale|cleanupStale|session_id\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
167:  effectiveSessionId: string;
236:    cleanupStaleSessions();
247:      cleanupStaleSessions();
282:      'SELECT 1 FROM session_state WHERE session_id = ? LIMIT 1'
297:      'SELECT 1 FROM session_sent_memories WHERE session_id = ? LIMIT 1'
342:    WHERE session_id = ?
385:function resolveTrustedSession(
396:      effectiveSessionId: crypto.randomUUID(),
404:      effectiveSessionId: '',
406:      error: `sessionId "${normalizedSessionId}" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
414:      effectiveSessionId: '',
416:      error: `sessionId "${normalizedSessionId}" is not bound to a corroborated server identity. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
424:      effectiveSessionId: '',
426:      error: `sessionId "${normalizedSessionId}" is bound to a different ${mismatch}. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
432:    effectiveSessionId: normalizedSessionId,
443:    session_id TEXT NOT NULL,
447:    PRIMARY KEY (session_id, memory_hash)
452:  'CREATE INDEX IF NOT EXISTS idx_session_sent_session ON session_sent_memories(session_id);',
523:      WHERE session_id = ? AND memory_hash = ?
565:      SELECT memory_hash FROM session_sent_memories WHERE session_id = ?
568:      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
647:      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
678:      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
713:      SELECT COUNT(*) as count FROM session_sent_memories WHERE session_id = ?
723:      WHERE session_id = ? AND rowid IN (
725:        WHERE session_id = ?
771:function cleanupStaleSessions(thresholdMs: number = STALE_SESSION_THRESHOLD_MS): StaleCleanupResult {
843:function clearSession(sessionId: string): CleanupResult {
848:      DELETE FROM session_sent_memories WHERE session_id = ?
854:      workingMemory.clearSession(sessionId);
878:      WHERE session_id = ?
960:    session_id TEXT PRIMARY KEY,
1020:function saveSessionState(sessionId: string, state: SessionStateInput = {}): InitResult {
1036:        session_id, status, spec_folder, current_task, last_action,
1042:      ON CONFLICT(session_id) DO UPDATE SET
1086:      WHERE session_id = ?
1092:      workingMemory.clearSession(sessionId);
1136:      SELECT session_id, status, spec_folder, current_task, last_action,
1141:      WHERE session_id = ?
1160:      sessionId: row.session_id as string,
1180:        WHERE session_id = ?
1199:      SELECT session_id, spec_folder, current_task, last_action,
1219:        sessionId: row.session_id as string,
1359:  const saveResult = saveSessionState(sessionId, state);
1409:  cleanupStaleSessions,
1413:  resolveTrustedSession,
1421:  saveSessionState,

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '780,900p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   780	  const cutoffIso = new Date(Date.now() - thresholdMs).toISOString();
   781	
   782	  // 1. Clean stale working_memory entries
   783	  try {
   784	    const wmStmt = db.prepare('DELETE FROM working_memory WHERE last_focused < ?');
   785	    const wmResult = wmStmt.run(cutoffIso);
   786	    workingMemoryDeleted = wmResult.changes;
   787	  } catch (err: unknown) {
   788	    const msg = err instanceof Error ? err.message : String(err);
   789	    // Table may not exist if working-memory module was never initialized
   790	    if (!msg.includes('no such table')) {
   791	      errors.push(`working_memory cleanup: ${msg}`);
   792	    }
   793	  }
   794	
   795	  // 2. Clean stale session_sent_memories entries
   796	  try {
   797	    const smStmt = db.prepare('DELETE FROM session_sent_memories WHERE sent_at < ?');
   798	    const smResult = smStmt.run(cutoffIso);
   799	    sentMemoriesDeleted = smResult.changes;
   800	  } catch (err: unknown) {
   801	    const msg = err instanceof Error ? err.message : String(err);
   802	    if (!msg.includes('no such table')) {
   803	      errors.push(`session_sent_memories cleanup: ${msg}`);
   804	    }
   805	  }
   806	
   807	  // 3. Clean completed/interrupted session_state entries (NEVER clean active sessions)
   808	  try {
   809	    const ssStmt = db.prepare(
   810	      `DELETE FROM session_state WHERE status IN ('completed', 'interrupted') AND updated_at < ?`
   811	    );
   812	    const ssResult = ssStmt.run(cutoffIso);
   813	    sessionStateDeleted = ssResult.changes;
   814	  } catch (err: unknown) {
   815	    const msg = err instanceof Error ? err.message : String(err);
   816	    if (!msg.includes('no such table')) {
   817	      errors.push(`session_state cleanup: ${msg}`);
   818	    }
   819	  }
   820	
   821	  const totalDeleted = workingMemoryDeleted + sentMemoriesDeleted + sessionStateDeleted;
   822	  if (totalDeleted > 0) {
   823	    console.error(
   824	      `[session-manager] Stale session cleanup: removed ${workingMemoryDeleted} working_memory, ` +
   825	      `${sentMemoriesDeleted} sent_memories, ${sessionStateDeleted} session_state entries ` +
   826	      `(threshold: ${Math.round(thresholdMs / 3600000)}h)`
   827	    );
   828	  }
   829	
   830	  if (errors.length > 0) {
   831	    console.warn(`[session-manager] Stale cleanup had ${errors.length} error(s): ${errors.join('; ')}`);
   832	  }
   833	
   834	  return {
   835	    success: errors.length === 0,
   836	    workingMemoryDeleted,
   837	    sentMemoriesDeleted,
   838	    sessionStateDeleted,
   839	    errors,
   840	  };
   841	}
   842	
   843	function clearSession(sessionId: string): CleanupResult {
   844	  if (!db || !sessionId) return { success: false, deletedCount: 0 };
   845	
   846	  try {
   847	    const stmt = db.prepare(`
   848	      DELETE FROM session_sent_memories WHERE session_id = ?
   849	    `);
   850	    const result = stmt.run(sessionId);
   851	
   852	    // Immediately clear working memory for cleared session (GAP 2).
   853	    try {
   854	      workingMemory.clearSession(sessionId);
   855	    } catch (wmErr: unknown) {
   856	      const wmMsg = wmErr instanceof Error ? wmErr.message : String(wmErr);
   857	      console.warn(`[session-manager] Working memory cleanup for ${sessionId} failed: ${wmMsg}`);
   858	    }
   859	
   860	    return { success: true, deletedCount: result.changes };
   861	  } catch (error: unknown) {
   862	    const message = error instanceof Error ? error.message : String(error);
   863	    console.error(`[session-manager] clear_session failed: ${message}`);
   864	    return { success: false, deletedCount: 0 };
   865	  }
   866	}
   867	
   868	function getSessionStats(sessionId: string): SessionStats {
   869	  if (!db || !sessionId) return { totalSent: 0, oldestEntry: null, newestEntry: null };
   870	
   871	  try {
   872	    const stmt = db.prepare(`
   873	      SELECT
   874	        COUNT(*) as total_sent,
   875	        MIN(sent_at) as oldest_entry,
   876	        MAX(sent_at) as newest_entry
   877	      FROM session_sent_memories
   878	      WHERE session_id = ?
   879	    `);
   880	    const row = stmt.get(sessionId) as { total_sent: number; oldest_entry: string | null; newest_entry: string | null } | undefined;
   881	
   882	    return {
   883	      totalSent: row?.total_sent || 0,
   884	      oldestEntry: row?.oldest_entry || null,
   885	      newestEntry: row?.newest_entry || null,
   886	    };
   887	  } catch (error: unknown) {
   888	    const message = error instanceof Error ? error.message : String(error);
   889	    console.warn(`[session-manager] get_session_stats failed: ${message}`);
   890	    return { totalSent: 0, oldestEntry: null, newestEntry: null };
   891	  }
   892	}
   893	
   894	/* ───────────────────────────────────────────────────────────────
   895	   8. INTEGRATION HELPERS
   896	──────────────────────────────────────────────────────────────── */
   897	
   898	function filterSearchResults(sessionId: string, results: MemoryInput[]): FilterResult {
   899	  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(results)) {
   900	    return {

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '1050,1125p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1050	        tenant_id = COALESCE(excluded.tenant_id, session_state.tenant_id),
  1051	        user_id = COALESCE(excluded.user_id, session_state.user_id),
  1052	        agent_id = COALESCE(excluded.agent_id, session_state.agent_id),
  1053	        updated_at = excluded.updated_at
  1054	    `);
  1055	
  1056	    stmt.run(
  1057	      sessionId,
  1058	      state.specFolder || null,
  1059	      state.currentTask || null,
  1060	      state.lastAction || null,
  1061	      state.contextSummary || null,
  1062	      state.pendingWork || null,
  1063	      stateData,
  1064	      tenantId,
  1065	      userId,
  1066	      agentId,
  1067	      now,
  1068	      now
  1069	    );
  1070	
  1071	    return { success: true };
  1072	  } catch (error: unknown) {
  1073	    const message = error instanceof Error ? error.message : String(error);
  1074	    console.error(`[session-manager] save_session_state failed: ${message}`);
  1075	    return { success: false, error: message };
  1076	  }
  1077	}
  1078	
  1079	function completeSession(sessionId: string): InitResult {
  1080	  if (!db || !sessionId) return { success: false, error: 'Database or sessionId not available' };
  1081	
  1082	  try {
  1083	    const stmt = db.prepare(`
  1084	      UPDATE session_state
  1085	      SET status = 'completed', updated_at = ?
  1086	      WHERE session_id = ?
  1087	    `);
  1088	    stmt.run(new Date().toISOString(), sessionId);
  1089	
  1090	    // Immediately clear working memory for completed session (GAP 2).
  1091	    try {
  1092	      workingMemory.clearSession(sessionId);
  1093	    } catch (wmErr: unknown) {
  1094	      const wmMsg = wmErr instanceof Error ? wmErr.message : String(wmErr);
  1095	      console.warn(`[session-manager] Working memory cleanup for ${sessionId} failed: ${wmMsg}`);
  1096	    }
  1097	
  1098	    return { success: true };
  1099	  } catch (error: unknown) {
  1100	    const message = error instanceof Error ? error.message : String(error);
  1101	    console.error(`[session-manager] complete_session failed: ${message}`);
  1102	    return { success: false, error: message };
  1103	  }
  1104	}
  1105	
  1106	function resetInterruptedSessions(): ResetResult {
  1107	  if (!db) return { success: false, interruptedCount: 0, error: 'Database not initialized. Server may still be starting up.' };
  1108	
  1109	  try {
  1110	    ensureSessionStateSchema();
  1111	    const stmt = db.prepare(`
  1112	      UPDATE session_state
  1113	      SET status = 'interrupted', updated_at = ?
  1114	      WHERE status = 'active'
  1115	    `);
  1116	    const result = stmt.run(new Date().toISOString());
  1117	
  1118	    return { success: true, interruptedCount: result.changes };
  1119	  } catch (error: unknown) {
  1120	    const message = error instanceof Error ? error.message : String(error);
  1121	    console.error(`[session-manager] reset_interrupted_sessions failed: ${message}`);
  1122	    return { success: false, interruptedCount: 0, error: message };
  1123	  }
  1124	}
  1125	

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '1000,1068p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1000	
  1001	  try {
  1002	    db.exec(SESSION_STATE_SCHEMA_SQL);
  1003	    const existingColumns = getTableColumns('session_state');
  1004	    for (const migration of SESSION_STATE_MIGRATIONS) {
  1005	      if (!existingColumns.has(migration.column)) {
  1006	        db.exec(migration.sql);
  1007	      }
  1008	    }
  1009	    for (const indexSql of SESSION_STATE_INDEX_SQL) {
  1010	      db.exec(indexSql);
  1011	    }
  1012	    return { success: true };
  1013	  } catch (error: unknown) {
  1014	    const message = error instanceof Error ? error.message : String(error);
  1015	    console.error(`[session-manager] Session state schema creation failed: ${message}`);
  1016	    return { success: false, error: message };
  1017	  }
  1018	}
  1019	
  1020	function saveSessionState(sessionId: string, state: SessionStateInput = {}): InitResult {
  1021	  if (!db) return { success: false, error: 'Database not initialized. Server may still be starting up.' };
  1022	  if (!sessionId || typeof sessionId !== 'string') {
  1023	    return { success: false, error: 'Valid sessionId is required' };
  1024	  }
  1025	
  1026	  try {
  1027	    ensureSessionStateSchema();
  1028	    const now = new Date().toISOString();
  1029	    const stateData = state.data ? JSON.stringify(state.data) : null;
  1030	    const tenantId = normalizeIdentityValue(state.tenantId);
  1031	    const userId = normalizeIdentityValue(state.userId);
  1032	    const agentId = normalizeIdentityValue(state.agentId);
  1033	
  1034	    const stmt = db.prepare(`
  1035	      INSERT INTO session_state (
  1036	        session_id, status, spec_folder, current_task, last_action,
  1037	        context_summary, pending_work, state_data,
  1038	        tenant_id, user_id, agent_id,
  1039	        created_at, updated_at
  1040	      )
  1041	      VALUES (?, 'active', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  1042	      ON CONFLICT(session_id) DO UPDATE SET
  1043	        status = 'active',
  1044	        spec_folder = COALESCE(excluded.spec_folder, session_state.spec_folder),
  1045	        current_task = COALESCE(excluded.current_task, session_state.current_task),
  1046	        last_action = COALESCE(excluded.last_action, session_state.last_action),
  1047	        context_summary = COALESCE(excluded.context_summary, session_state.context_summary),
  1048	        pending_work = COALESCE(excluded.pending_work, session_state.pending_work),
  1049	        state_data = COALESCE(excluded.state_data, session_state.state_data),
  1050	        tenant_id = COALESCE(excluded.tenant_id, session_state.tenant_id),
  1051	        user_id = COALESCE(excluded.user_id, session_state.user_id),
  1052	        agent_id = COALESCE(excluded.agent_id, session_state.agent_id),
  1053	        updated_at = excluded.updated_at
  1054	    `);
  1055	
  1056	    stmt.run(
  1057	      sessionId,
  1058	      state.specFolder || null,
  1059	      state.currentTask || null,
  1060	      state.lastAction || null,
  1061	      state.contextSummary || null,
  1062	      state.pendingWork || null,
  1063	      stateData,
  1064	      tenantId,
  1065	      userId,
  1066	      agentId,
  1067	      now,
  1068	      now

exec
/bin/zsh -lc "rg -n \"resolveTrustedSession|effectiveSessionId|requestedSessionId|resumedSession|saveSessionState|sessionTransition|mode: 'resume'|resumeHeuristicApplied\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
90:  sessionTransition?: SessionTransitionTrace;
95:  requestedSessionId: string | null;
96:  effectiveSessionId: string;
144:  requestedSessionId: string | null;
145:  effectiveSessionId: string;
155:  resumeHeuristicApplied: boolean;
186:  sessionTransition: SessionTransitionTrace;
735:    sessionTransition: options.sessionTransition,
766:    sessionTransition: options.sessionTransition,
800:    sessionTransition: options.sessionTransition,
811:    mode: 'resume',
828:  const trustedSession = sessionManager.resolveTrustedSession(args.sessionId ?? null, {
835:      requestedSessionId: trustedSession.requestedSessionId,
836:      effectiveSessionId: '',
844:  const requestedSessionId = trustedSession.requestedSessionId;
845:  const effectiveSessionId = trustedSession.effectiveSessionId;
848:    ? workingMemory.getSessionInferredMode(effectiveSessionId)
851:    ? workingMemory.getSessionEventCounter(effectiveSessionId)
855:    requestedSessionId,
856:    effectiveSessionId,
883:  let resumeHeuristicApplied = false;
910:      resumeHeuristicApplied = true;
942:      resumeHeuristicApplied,
1010:    sessionTransition,
1031:            includeTrace === true ? sessionTransition : undefined,
1222:    requestedSessionId,
1223:    effectiveSessionId,
1224:    resumed: resumedSession,
1234:      details: { requestId, layer: 'L1:Orchestration', requestedSessionId: args.sessionId ?? null },
1236:        hint: 'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.',
1241:    sessionScope: requestedSessionId ? 'caller' : 'ephemeral',
1242:    requestedSessionId,
1243:    effectiveSessionId,
1244:    resumed: resumedSession,
1263:  const pressurePolicyEnabled = isPressurePolicyEnabled(effectiveSessionId);
1264:  const autoResumeEnabled = isAutoResumeEnabled(effectiveSessionId);
1286:    sessionId: effectiveSessionId,
1303:      requestedSessionId,
1304:      effectiveSessionId,
1305:      resumed: resumedSession,
1314:    resumeHeuristicApplied,
1336:  const sessionTransition = buildSessionTransitionTrace({
1338:    resumedSession,
1343:    queryHeuristicApplied: resumeHeuristicApplied,
1345:  options.sessionTransition = options.includeTrace === true ? sessionTransition : undefined;
1352:  const sessionStateResult = sessionManager.saveSessionState(effectiveSessionId, {
1361:      `[memory-context] Failed to persist session identity for ${effectiveSessionId}: ${sessionStateResult.error ?? 'unknown error'}`,
1415:    workingMemory.setSessionInferredMode(effectiveSessionId, effectiveMode);
1430:      sessionTransition,
1434:  if (autoResumeEnabled && effectiveMode === 'resume' && resumedSession) {
1435:    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
1497:        resumeHeuristicApplied,
1502:      sessionTransition,
1530:        session_id: effectiveSessionId,

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '820,920p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1410,1465p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts | sed -n '230,330p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -n \"getSessionPromptContext|setSessionInferredMode|getSessionInferredMode|getSessionEventCounter|clearSession\\(|setAttentionScore\\(|batchUpdateScores\\(|getSessionMemories\\(\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
236:function clearSession(sessionId: string): number {
297:function getSessionMemories(sessionId: string): Array<Record<string, unknown>> {
320:function getSessionEventCounter(sessionId: string): number {
325:function getSessionPromptContext(sessionId: string, floor: number = DECAY_FLOOR, limit: number = 5): SessionPromptContextEntry[] {
349:    console.warn(`[working-memory] getSessionPromptContext error: ${msg}`);
354:function getSessionInferredMode(sessionId: string): string | null {
359:function setSessionInferredMode(sessionId: string, mode: string): void {
381:function setAttentionScore(
560:function batchUpdateScores(sessionId: string): number {
738:  getSessionEventCounter,
739:  getSessionPromptContext,
740:  getSessionInferredMode,
741:  setSessionInferredMode,

 succeeded in 0ms:
   230	  // Generate a new session ID
   231	  const timestamp = Date.now().toString(36);
   232	  const random = Math.random().toString(36).substring(2, 8);
   233	  return `wm-${timestamp}-${random}`;
   234	}
   235	
   236	function clearSession(sessionId: string): number {
   237	  if (!db) return 0;
   238	  ensureSchema();
   239	
   240	  try {
   241	    const result = (db.prepare(
   242	      'DELETE FROM working_memory WHERE session_id = ?'
   243	    ) as Database.Statement).run(sessionId);
   244	    sessionModeRegistry.delete(sessionId);
   245	    return (result as { changes: number }).changes;
   246	  } catch (error: unknown) {
   247	    const msg = error instanceof Error ? error.message : String(error);
   248	    console.warn(`[working-memory] clearSession error: ${msg}`);
   249	    return 0;
   250	  }
   251	}
   252	
   253	function cleanupOldSessions(): number {
   254	  if (!db) return 0;
   255	  ensureSchema();
   256	
   257	  try {
   258	    const timeoutSeconds = Math.floor(WORKING_MEMORY_CONFIG.sessionTimeoutMs / 1000);
   259	    const nowIso = new Date(Date.now()).toISOString();
   260	    const staleSessionIds = (db.prepare(
   261	      "SELECT DISTINCT session_id FROM working_memory WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')"
   262	    ) as Database.Statement).all(nowIso, timeoutSeconds) as Array<{ session_id: string }>;
   263	    const result = (db.prepare(
   264	      "DELETE FROM working_memory WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')"
   265	    ) as Database.Statement).run(nowIso, timeoutSeconds);
   266	    for (const row of staleSessionIds) {
   267	      sessionModeRegistry.delete(row.session_id);
   268	    }
   269	    return (result as { changes: number }).changes;
   270	  } catch (error: unknown) {
   271	    const msg = error instanceof Error ? error.message : String(error);
   272	    console.warn(`[working-memory] cleanupOldSessions error: ${msg}`);
   273	    return 0;
   274	  }
   275	}
   276	
   277	/* --- 7. WORKING MEMORY OPERATIONS --- */
   278	
   279	function getWorkingMemory(sessionId: string): WorkingMemoryEntry[] {
   280	  if (!db) return [];
   281	  ensureSchema();
   282	
   283	  try {
   284	    return (db.prepare(`
   285	      SELECT * FROM working_memory
   286	      WHERE session_id = ?
   287	        AND memory_id IS NOT NULL
   288	      ORDER BY attention_score DESC
   289	    `) as Database.Statement).all(sessionId) as WorkingMemoryEntry[];
   290	  } catch (error: unknown) {
   291	    const msg = error instanceof Error ? error.message : String(error);
   292	    console.warn(`[working-memory] getWorkingMemory error: ${msg}`);
   293	    return [];
   294	  }
   295	}
   296	
   297	function getSessionMemories(sessionId: string): Array<Record<string, unknown>> {
   298	  if (!db) return [];
   299	  ensureSchema();
   300	
   301	  try {
   302	    return (db.prepare(`
   303	      SELECT m.*, wm.attention_score, wm.focus_count, wm.last_focused
   304	      FROM working_memory wm
   305	      JOIN memory_index m ON wm.memory_id = m.id
   306	      WHERE wm.session_id = ?
   307	      ORDER BY wm.attention_score DESC
   308	    `) as Database.Statement).all(sessionId) as Array<Record<string, unknown>>;
   309	  } catch (error: unknown) {
   310	    const msg = error instanceof Error ? error.message : String(error);
   311	    console.warn(`[working-memory] getSessionMemories error: ${msg}`);
   312	    return [];
   313	  }
   314	}
   315	
   316	function sessionExists(sessionId: string): boolean {
   317	  return getLatestSessionEventCounter(sessionId) !== null;
   318	}
   319	
   320	function getSessionEventCounter(sessionId: string): number {
   321	  const current = getLatestSessionEventCounter(sessionId);
   322	  return current === null ? 0 : current;
   323	}
   324	
   325	function getSessionPromptContext(sessionId: string, floor: number = DECAY_FLOOR, limit: number = 5): SessionPromptContextEntry[] {
   326	  if (!db) return [];
   327	  ensureSchema();
   328	
   329	  const safeLimit = Math.max(1, Math.min(20, Math.floor(limit)));
   330	  const safeFloor = Math.max(0, Math.min(1, floor));

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts | sed -n '381,470p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   381	function setAttentionScore(
   382	  sessionId: string,
   383	  memoryId: number,
   384	  score: number
   385	): boolean {
   386	  if (!db) return false;
   387	  ensureSchema();
   388	
   389	  const clampedScore = Math.max(0, Math.min(1, score));
   390	
   391	  try {
   392	    const currentEventCounter = nextEventCounter(sessionId);
   393	
   394	    const existing = (db.prepare(
   395	      'SELECT id FROM working_memory WHERE session_id = ? AND memory_id = ?'
   396	    ) as Database.Statement).get(sessionId, memoryId) as { id: number } | undefined;
   397	
   398	    if (existing) {
   399	      (db.prepare(`
   400	        UPDATE working_memory
   401	        SET attention_score = ?,
   402	            last_focused = CURRENT_TIMESTAMP,
   403	            focus_count = focus_count + 1,
   404	            mention_count = MIN(mention_count + 1, ${MAX_MENTION_COUNT}),
   405	            event_counter = ?
   406	        WHERE session_id = ? AND memory_id = ?
   407	      `) as Database.Statement).run(clampedScore, currentEventCounter, sessionId, memoryId);
   408	    } else {
   409	      // Check capacity
   410	      enforceMemoryLimit(sessionId);
   411	
   412	      (db.prepare(`
   413	        INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count)
   414	        VALUES (?, ?, ?, ?, 0)
   415	      `) as Database.Statement).run(sessionId, memoryId, clampedScore, currentEventCounter);
   416	    }
   417	
   418	    return true;
   419	  } catch (error: unknown) {
   420	    const msg = error instanceof Error ? error.message : String(error);
   421	    console.warn(`[working-memory] setAttentionScore error: ${msg}`);
   422	    return false;
   423	  }
   424	}
   425	
   426	function upsertExtractedEntry(input: ExtractedEntryInput): boolean {
   427	  if (!db) return false;
   428	  ensureSchema();
   429	
   430	  const {
   431	    sessionId,
   432	    memoryId,
   433	    attentionScore,
   434	    sourceTool,
   435	    sourceCallId,
   436	    extractionRuleId,
   437	    redactionApplied,
   438	  } = input;
   439	
   440	  if (!sessionId || !sourceTool || !sourceCallId || !extractionRuleId) {
   441	    return false;
   442	  }
   443	
   444	  const clampedScore = Math.max(0, Math.min(1, attentionScore));
   445	
   446	  try {
   447	    const currentEventCounter = nextEventCounter(sessionId);
   448	
   449	    (db.prepare(`
   450	      INSERT INTO working_memory (
   451	        session_id,
   452	        memory_id,
   453	        attention_score,
   454	        event_counter,
   455	        mention_count,
   456	        source_tool,
   457	        source_call_id,
   458	        extraction_rule_id,
   459	        redaction_applied
   460	      ) VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?)
   461	      ON CONFLICT(session_id, memory_id) DO UPDATE SET
   462	        attention_score = CASE
   463	          WHEN excluded.attention_score > working_memory.attention_score THEN excluded.attention_score
   464	          ELSE working_memory.attention_score
   465	        END,
   466	        last_focused = CURRENT_TIMESTAMP,
   467	        focus_count = working_memory.focus_count + 1,
   468	        mention_count = MIN(working_memory.mention_count + 1, ${MAX_MENTION_COUNT}),
   469	        event_counter = excluded.event_counter,
   470	        source_tool = excluded.source_tool,

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts | sed -n '560,740p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   560	function batchUpdateScores(sessionId: string): number {
   561	  if (!db) return 0;
   562	  ensureSchema();
   563	
   564	  if (!isFeatureEnabled('SPECKIT_EVENT_DECAY', sessionId)) {
   565	    return 0;
   566	  }
   567	
   568	  try {
   569	    const currentEventCounter = getCurrentEventCounter(sessionId);
   570	    const entries = (db.prepare(`
   571	      SELECT id, attention_score, event_counter, mention_count
   572	      FROM working_memory
   573	      WHERE session_id = ?
   574	        AND memory_id IS NOT NULL
   575	    `) as Database.Statement).all(sessionId) as Array<{
   576	      id: number;
   577	      attention_score: number;
   578	      event_counter: number;
   579	      mention_count: number;
   580	    }>;
   581	
   582	    if (entries.length === 0) {
   583	      return 0;
   584	    }
   585	
   586	    const updateStmt = db.prepare(`
   587	      UPDATE working_memory
   588	      SET attention_score = ?,
   589	          event_counter = event_counter + 1
   590	      WHERE id = ?
   591	    `) as Database.Statement;
   592	
   593	    const deleteStmt = db.prepare(`
   594	      DELETE FROM working_memory
   595	      WHERE id = ?
   596	    `) as Database.Statement;
   597	
   598	    let changedRows = 0;
   599	    db.transaction(() => {
   600	      for (const entry of entries) {
   601	        const eventsElapsed = calculateEventDistance(currentEventCounter, entry.event_counter);
   602	        const decayBase = entry.attention_score * Math.pow(EVENT_DECAY_FACTOR, eventsElapsed);
   603	        const mentionBoost = Math.min(entry.mention_count, MAX_MENTION_COUNT) * MENTION_BOOST_FACTOR;
   604	        const rawScore = decayBase + mentionBoost;
   605	
   606	        if (rawScore < DELETE_THRESHOLD) {
   607	          const deleteResult = deleteStmt.run(entry.id) as { changes: number };
   608	          changedRows += deleteResult.changes;
   609	          continue;
   610	        }
   611	
   612	        // Clamp to [DECAY_FLOOR, 1.0].
   613	        // Mention boost can push rawScore above 1.0 which breaks [0,1] score semantics.
   614	        const nextScore = Math.max(DECAY_FLOOR, Math.min(1.0, rawScore));
   615	        const updateResult = updateStmt.run(nextScore, entry.id) as { changes: number };
   616	        changedRows += updateResult.changes;
   617	      }
   618	    })();
   619	
   620	    return changedRows;
   621	  } catch (error: unknown) {
   622	    const msg = error instanceof Error ? error.message : String(error);
   623	    console.warn(`[working-memory] batchUpdateScores error: ${msg}`);
   624	    return 0;
   625	  }
   626	}
   627	
   628	function getCurrentEventCounter(sessionId: string): number {
   629	  const current = getLatestSessionEventCounter(sessionId);
   630	  if (current === null) {
   631	    return 0;
   632	  }
   633	
   634	  return current;
   635	}
   636	
   637	function getLatestSessionEventCounter(sessionId: string): number | null {
   638	  if (!db) return null;
   639	
   640	  try {
   641	    const row = (db.prepare(`
   642	      SELECT event_counter
   643	      FROM working_memory
   644	      WHERE session_id = ?
   645	        AND memory_id IS NOT NULL
   646	      ORDER BY last_focused DESC, id DESC
   647	      LIMIT 1
   648	    `) as Database.Statement).get(sessionId) as { event_counter?: number | null };
   649	
   650	    if (!row || typeof row.event_counter !== 'number' || Number.isNaN(row.event_counter)) {
   651	      return null;
   652	    }
   653	
   654	    return row.event_counter;
   655	  } catch (error: unknown) {
   656	    const msg = error instanceof Error ? error.message : String(error);
   657	    console.warn(`[working-memory] getLatestSessionEventCounter error: ${msg}`);
   658	    return null;
   659	  }
   660	}
   661	
   662	function calculateEventDistance(currentCounter: number, entryCounter: number): number {
   663	  const normalizedCurrent = ((currentCounter % EVENT_COUNTER_MODULUS) + EVENT_COUNTER_MODULUS) % EVENT_COUNTER_MODULUS;
   664	  const normalizedEntry = ((entryCounter % EVENT_COUNTER_MODULUS) + EVENT_COUNTER_MODULUS) % EVENT_COUNTER_MODULUS;
   665	  return (normalizedCurrent - normalizedEntry + EVENT_COUNTER_MODULUS) % EVENT_COUNTER_MODULUS;
   666	}
   667	
   668	/* --- 8. UTILITY FUNCTIONS --- */
   669	
   670	function isEnabled(): boolean {
   671	  return WORKING_MEMORY_CONFIG.enabled;
   672	}
   673	
   674	function getConfig(): WorkingMemoryConfigType {
   675	  return { ...WORKING_MEMORY_CONFIG };
   676	}
   677	
   678	function getSessionStats(sessionId: string): SessionStats | null {
   679	  if (!db) return null;
   680	  ensureSchema();
   681	
   682	  try {
   683	    const stats = (db.prepare(`
   684	      SELECT
   685	        COUNT(*) as totalEntries,
   686	        AVG(attention_score) as avgAttention,
   687	        MAX(attention_score) as maxAttention,
   688	        MIN(attention_score) as minAttention,
   689	        SUM(focus_count) as totalFocusEvents
   690	      FROM working_memory
   691	      WHERE session_id = ?
   692	        AND memory_id IS NOT NULL
   693	    `) as Database.Statement).get(sessionId) as {
   694	      totalEntries: number;
   695	      avgAttention: number;
   696	      maxAttention: number;
   697	      minAttention: number;
   698	      totalFocusEvents: number;
   699	    } | undefined;
   700	
   701	    if (!stats || stats.totalEntries === 0) return null;
   702	
   703	    return {
   704	      sessionId,
   705	      totalEntries: stats.totalEntries,
   706	      avgAttention: Math.round((stats.avgAttention || 0) * 100) / 100,
   707	      maxAttention: stats.maxAttention || 0,
   708	      minAttention: stats.minAttention || 0,
   709	      totalFocusEvents: stats.totalFocusEvents || 0,
   710	    };
   711	  } catch (error: unknown) {
   712	    const msg = error instanceof Error ? error.message : String(error);
   713	    console.warn(`[working-memory] getSessionStats error: ${msg}`);
   714	    return null;
   715	  }
   716	}
   717	
   718	/* --- 9. EXPORTS --- */
   719	
   720	export {
   721	  WORKING_MEMORY_CONFIG,
   722	  SCHEMA_SQL,
   723	  INDEX_SQL,
   724	
   725	  // Initialization
   726	  init,
   727	  ensureSchema,
   728	
   729	  // Session management
   730	  getOrCreateSession,
   731	  clearSession,
   732	  cleanupOldSessions,
   733	
   734	  // Working memory operations
   735	  getWorkingMemory,
   736	  getSessionMemories,
   737	  sessionExists,
   738	  getSessionEventCounter,
   739	  getSessionPromptContext,
   740	  getSessionInferredMode,

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts | sed -n '740,820p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   740	  getSessionInferredMode,
   741	  setSessionInferredMode,
   742	  calculateTier,
   743	  setAttentionScore,
   744	  upsertExtractedEntry,
   745	  enforceMemoryLimit,
   746	  batchUpdateScores,
   747	  DECAY_FLOOR,
   748	  DELETE_THRESHOLD,
   749	  EVENT_DECAY_FACTOR,
   750	  MENTION_BOOST_FACTOR,
   751	  EVENT_COUNTER_MODULUS,
   752	  MAX_MENTION_COUNT,
   753	
   754	  // Utilities
   755	  isEnabled,
   756	  getConfig,
   757	  getSessionStats,
   758	};
   759	
   760	export type {
   761	  WorkingMemoryConfigType,
   762	  WorkingMemoryEntry,
   763	  SessionInfo,
   764	  SessionStats,
   765	  SessionPromptContextEntry,
   766	  ExtractedEntryInput,
   767	};

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts | sed -n '325,370p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   325	function getSessionPromptContext(sessionId: string, floor: number = DECAY_FLOOR, limit: number = 5): SessionPromptContextEntry[] {
   326	  if (!db) return [];
   327	  ensureSchema();
   328	
   329	  const safeLimit = Math.max(1, Math.min(20, Math.floor(limit)));
   330	  const safeFloor = Math.max(0, Math.min(1, floor));
   331	
   332	  try {
   333	    return (db.prepare(`
   334	      SELECT
   335	        wm.memory_id AS memoryId,
   336	        COALESCE(m.title, '') AS title,
   337	        COALESCE(m.file_path, '') AS filePath,
   338	        wm.attention_score AS attentionScore
   339	      FROM working_memory wm
   340	      LEFT JOIN memory_index m ON wm.memory_id = m.id
   341	      WHERE wm.session_id = ?
   342	        AND wm.memory_id IS NOT NULL
   343	        AND wm.attention_score > ?
   344	      ORDER BY wm.attention_score DESC, wm.last_focused DESC
   345	      LIMIT ?
   346	    `) as Database.Statement).all(sessionId, safeFloor, safeLimit) as SessionPromptContextEntry[];
   347	  } catch (error: unknown) {
   348	    const msg = error instanceof Error ? error.message : String(error);
   349	    console.warn(`[working-memory] getSessionPromptContext error: ${msg}`);
   350	    return [];
   351	  }
   352	}
   353	
   354	function getSessionInferredMode(sessionId: string): string | null {
   355	  const mode = sessionModeRegistry.get(sessionId);
   356	  return typeof mode === 'string' && mode.length > 0 ? mode : null;
   357	}
   358	
   359	function setSessionInferredMode(sessionId: string, mode: string): void {
   360	  const normalizedSessionId = sessionId.trim();
   361	  const normalizedMode = mode.trim();
   362	  if (normalizedSessionId.length === 0 || normalizedMode.length === 0) {
   363	    return;
   364	  }
   365	  sessionModeRegistry.set(normalizedSessionId, normalizedMode);
   366	}
   367	
   368	/**
   369	 * Calculate attention tier for an entry.
   370	 */

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1480,1545p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
  1501	      includeTrace: options.includeTrace === true,
  1502	      sessionTransition,
  1503	      structuralRoutingNudge,
  1504	    })
  1505	  });
  1506	
  1507	  // Consumption instrumentation — log context event (fail-safe, never throws)
  1508	  try {
  1509	    const db = vectorIndex.getDb();
  1510	    if (db) {
  1511	      initConsumptionLog(db);
  1512	      let resultIds: number[] = [];
  1513	      let resultCount = 0;
  1514	      try {
  1515	        if (_contextResponse?.content?.[0]?.text) {
  1516	          const innerResults = extractResultRowsFromContextResponse(_contextResponse.content[0].text);
  1517	          resultIds = innerResults.map(r => r.id as number).filter(id => typeof id === 'number');
  1518	          resultCount = innerResults.length;
  1519	        }
  1520	      } catch {
  1521	        // Intentional no-op — error deliberately discarded
  1522	      }
  1523	      logConsumptionEvent(db, {
  1524	        event_type: 'context',
  1525	        query_text: normalizedInput,
  1526	        intent: detectedIntent ?? null,
  1527	        mode: effectiveMode,
  1528	        result_count: resultCount,
  1529	        result_ids: resultIds,
  1530	        session_id: effectiveSessionId,
  1531	        latency_ms: Date.now() - _contextStartTime,
  1532	        spec_folder_filter: spec_folder ?? null,
  1533	      });
  1534	    }
  1535	  } catch {
  1536	    // Intentional no-op — error deliberately discarded
  1537	  }
  1538	
  1539	  // Eval logger — capture final context results at exit (fail-safe)
  1540	  try {
  1541	    if (_evalRunId && _evalQueryId) {
  1542	      let finalMemoryIds: number[] = [];
  1543	      let finalScores: number[] = [];
  1544	      try {
  1545	        if (_contextResponse?.content?.[0]?.text) {

exec
/bin/zsh -lc "rg -n \"effectiveSessionId|requestedSessionId|sessionScope|buildResponseMeta\\(\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
94:  sessionScope: 'caller' | 'ephemeral';
95:  requestedSessionId: string | null;
96:  effectiveSessionId: string;
144:  requestedSessionId: string | null;
145:  effectiveSessionId: string;
835:      requestedSessionId: trustedSession.requestedSessionId,
836:      effectiveSessionId: '',
844:  const requestedSessionId = trustedSession.requestedSessionId;
845:  const effectiveSessionId = trustedSession.effectiveSessionId;
848:    ? workingMemory.getSessionInferredMode(effectiveSessionId)
851:    ? workingMemory.getSessionEventCounter(effectiveSessionId)
855:    requestedSessionId,
856:    effectiveSessionId,
995:function buildResponseMeta(params: BuildResponseMetaParams): Record<string, unknown> {
1222:    requestedSessionId,
1223:    effectiveSessionId,
1227:    error: sessionScopeError,
1229:  if (sessionScopeError) {
1232:      error: sessionScopeError,
1234:      details: { requestId, layer: 'L1:Orchestration', requestedSessionId: args.sessionId ?? null },
1236:        hint: 'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.',
1241:    sessionScope: requestedSessionId ? 'caller' : 'ephemeral',
1242:    requestedSessionId,
1243:    effectiveSessionId,
1263:  const pressurePolicyEnabled = isPressurePolicyEnabled(effectiveSessionId);
1264:  const autoResumeEnabled = isAutoResumeEnabled(effectiveSessionId);
1286:    sessionId: effectiveSessionId,
1303:      requestedSessionId,
1304:      effectiveSessionId,
1352:  const sessionStateResult = sessionManager.saveSessionState(effectiveSessionId, {
1361:      `[memory-context] Failed to persist session identity for ${effectiveSessionId}: ${sessionStateResult.error ?? 'unknown error'}`,
1415:    workingMemory.setSessionInferredMode(effectiveSessionId, effectiveMode);
1435:    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
1483:    extraMeta: buildResponseMeta({
1530:        session_id: effectiveSessionId,

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '995,1065p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1218,1260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc 'rg -n "compaction|systemTransform|messagesTransform|transport plan|Structural Bootstrap|Memory Resume|code graph|tool routing" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:5:// code graph status, and CocoIndex availability into a single call.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:512:      title: 'Memory Resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:5:// contracts to OpenCode-oriented startup, message, and compaction blocks.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:35:  systemTransform?: OpenCodeTransportBlock;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:36:  messagesTransform: OpenCodeTransportBlock[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:37:  compaction?: OpenCodeTransportBlock;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:87:  compactionPayload?: SharedPayloadEnvelope | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:95:    args.compactionPayload?.kind,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:102:  const compactionPayload = args.compactionPayload ?? args.resumePayload ?? args.bootstrapPayload ?? null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:117:        systemTransform: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:130:    messagesTransform: messagePayloads.map((payload, index) => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:140:    ...(compactionPayload
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:142:        compaction: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:145:          payloadKind: compactionPayload.kind,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:146:          dedupeKey: `compaction:${compactionPayload.kind}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:148:            compactionPayload,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:149:            'Inject this as the continuity note across compaction. Keep it separate from current-turn retrieval.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:5:// shared by startup, recovery, and compaction surfaces.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:12:  | 'compaction';

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "sessionSummary|summaryText|extractedAt|lastClaudeTurnAt|producerMetadata" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:189:  if (state.sessionSummary?.text) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:190:    parts.push(`Summary: ${truncateInline(state.sessionSummary.text, SUMMARY_MAX_CHARS)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:17:  lastClaudeTurnAt: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:34:  sessionSummary: { text: string; extractedAt: string } | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:40:  producerMetadata: HookProducerMetadata | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:228:    sessionSummary: null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:230:    producerMetadata: null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:63:  const summary = state?.sessionSummary?.text?.trim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:77:    sessionSummary: summary,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:116:  producerMetadataWritten: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:206:    lastClaudeTurnAt: transcriptStat.mtime.toISOString(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:227:  let producerMetadataWritten = false;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:236:      producerMetadataWritten,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:267:          producerMetadata: buildProducerMetadata(input.transcript_path as string, usage),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:269:        producerMetadataWritten = true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:303:      sessionSummary: { text, extractedAt: new Date().toISOString() },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:317:    producerMetadataWritten,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:109:      sessionSummary: { text, extractedAt: new Date().toISOString() },

 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Hook State Management
     3	// ───────────────────────────────────────────────────────────────
     4	// Per-session state at ${os.tmpdir()}/speckit-claude-hooks/<project-hash>/<session-hash>.json
     5	import { createHash } from 'node:crypto';
     6	import { tmpdir } from 'node:os';
     7	import { join } from 'node:path';
     8	import {
     9	  mkdirSync, readFileSync, writeFileSync, renameSync,
    10	  readdirSync, statSync, unlinkSync,
    11	} from 'node:fs';
    12	import { hookLog } from './shared.js';
    13	import type { SharedPayloadEnvelope } from '../../lib/context/shared-payload.js';
    14	
    15	/** Per-session hook state persisted to temp directory */
    16	export interface HookProducerMetadata {
    17	  lastClaudeTurnAt: string | null;
    18	  transcript: {
    19	    path: string;
    20	    fingerprint: string;
    21	    sizeBytes: number;
    22	    modifiedAt: string;
    23	  } | null;
    24	  cacheTokens: {
    25	    cacheCreationInputTokens: number;
    26	    cacheReadInputTokens: number;
    27	  } | null;
    28	}
    29	
    30	export interface HookState {
    31	  claudeSessionId: string;
    32	  speckitSessionId: string | null;
    33	  lastSpecFolder: string | null;
    34	  sessionSummary: { text: string; extractedAt: string } | null;
    35	  pendingCompactPrime: {
    36	    payload: string;
    37	    cachedAt: string;
    38	    payloadContract?: SharedPayloadEnvelope | null;
    39	  } | null;
    40	  producerMetadata: HookProducerMetadata | null;
    41	  metrics: {
    42	    estimatedPromptTokens: number;
    43	    estimatedCompletionTokens: number;
    44	    lastTranscriptOffset: number;
    45	  };
    46	  createdAt: string;
    47	  updatedAt: string;
    48	}
    49	
    50	const MAX_RECENT_STATE_AGE_MS = 24 * 60 * 60 * 1000;
    51	
    52	export interface HookStateScope {
    53	  specFolder?: string;
    54	  claudeSessionId?: string;
    55	}
    56	
    57	/** SHA-256 hash of cwd, first 12 chars */
    58	export function getProjectHash(): string {
    59	  return createHash('sha256').update(process.cwd()).digest('hex').slice(0, 12);
    60	}
    61	
    62	/** Get the state directory path */
    63	function getStateDir(): string {
    64	  return join(tmpdir(), 'speckit-claude-hooks', getProjectHash());
    65	}
    66	
    67	/** Get the state file path for a session */
    68	export function getStatePath(sessionId: string): string {
    69	  const safe = createHash('sha256').update(sessionId).digest('hex').slice(0, 16);
    70	  return join(getStateDir(), `${safe}.json`);
    71	}
    72	
    73	/** Ensure the state directory exists */
    74	export function ensureStateDir(): void {
    75	  try {
    76	    mkdirSync(getStateDir(), { recursive: true, mode: 0o700 });
    77	  } catch (err: unknown) {
    78	    hookLog('error', 'state', `Failed to create state dir: ${err instanceof Error ? err.message : String(err)}`);
    79	  }
    80	}
    81	
    82	/** Load state for a session. Returns null if not found. */
    83	export function loadState(sessionId: string): HookState | null {
    84	  try {
    85	    const raw = readFileSync(getStatePath(sessionId), 'utf-8');
    86	    return JSON.parse(raw) as HookState;
    87	  } catch {
    88	    return null;
    89	  }
    90	}
    91	
    92	function matchesScope(state: HookState, scope: HookStateScope): boolean {
    93	  if (scope.specFolder && state.lastSpecFolder !== scope.specFolder) {
    94	    return false;
    95	  }
    96	
    97	  if (scope.claudeSessionId && state.claudeSessionId !== scope.claudeSessionId) {
    98	    return false;
    99	  }
   100	
   101	  return true;
   102	}
   103	
   104	/**
   105	 * Load the most recently updated hook state file for this project.
   106	 * Returns null when no matching state exists, when the newest matching state is
   107	 * older than maxAgeMs, or when the caller cannot prove scope.
   108	 */
   109	export function loadMostRecentState(
   110	  options: {
   111	    maxAgeMs?: number;
   112	    scope?: HookStateScope;
   113	  } = {},
   114	): HookState | null {
   115	  const maxAgeMs = options.maxAgeMs ?? MAX_RECENT_STATE_AGE_MS;
   116	  const scope = options.scope;
   117	  const hasScope = Boolean(scope?.specFolder || scope?.claudeSessionId);
   118	
   119	  if (!hasScope) {
   120	    hookLog(
   121	      'warn',
   122	      'state',
   123	      JSON.stringify({
   124	        event: 'load_most_recent_state_rejected',
   125	        reason: 'scope_unknown_fail_closed',
   126	      }),
   127	    );
   128	    return null;
   129	  }
   130	
   131	  try {
   132	    const dir = getStateDir();
   133	    const candidates = readdirSync(dir).filter((file) => file.endsWith('.json'));
   134	    if (candidates.length === 0) {
   135	      return null;
   136	    }
   137	
   138	    let newestState: HookState | null = null;
   139	    let newestMtimeMs = -1;
   140	    for (const file of candidates) {
   141	      const filePath = join(dir, file);
   142	      const mtimeMs = statSync(filePath).mtimeMs;
   143	      if (Date.now() - mtimeMs > maxAgeMs) {
   144	        continue;
   145	      }
   146	
   147	      const raw = readFileSync(filePath, 'utf-8');
   148	      const state = JSON.parse(raw) as HookState;
   149	      if (!matchesScope(state, scope!)) {
   150	        continue;
   151	      }
   152	
   153	      if (mtimeMs > newestMtimeMs) {
   154	        newestMtimeMs = mtimeMs;
   155	        newestState = state;
   156	      }
   157	    }
   158	
   159	    if (!newestState) {
   160	      return null;
   161	    }
   162	
   163	    return newestState;
   164	  } catch {
   165	    return null;
   166	  }
   167	}
   168	
   169	/** Save state atomically (write to .tmp then rename) */
   170	export function saveState(sessionId: string, state: HookState): boolean {
   171	  const filePath = getStatePath(sessionId);
   172	  const tmpPath = filePath + '.tmp';
   173	  try {
   174	    state.updatedAt = new Date().toISOString();
   175	    writeFileSync(tmpPath, JSON.stringify(state, null, 2), { encoding: 'utf-8', mode: 0o600 });
   176	    renameSync(tmpPath, filePath);
   177	    return true;
   178	  } catch (err: unknown) {
   179	    hookLog('error', 'state', `Failed to save state: ${err instanceof Error ? err.message : String(err)}`);
   180	    return false;
   181	  }
   182	}
   183	
   184	/** Read pending compact prime without clearing it from state */
   185	export function readCompactPrime(sessionId: string): HookState['pendingCompactPrime'] {
   186	  const state = loadState(sessionId);
   187	  return state?.pendingCompactPrime ?? null;
   188	}
   189	
   190	/** Clear pending compact prime from state (call after stdout write confirmed) */
   191	export function clearCompactPrime(sessionId: string): void {
   192	  const state = loadState(sessionId);
   193	  if (!state || !state.pendingCompactPrime) {
   194	    return;
   195	  }
   196	
   197	  const nextState: HookState = {
   198	    ...state,
   199	    pendingCompactPrime: null,
   200	  };
   201	
   202	  if (!saveState(sessionId, nextState)) {
   203	    hookLog('warn', 'state', `Failed to clear pending compact payload for session ${sessionId}`);
   204	  }
   205	}
   206	
   207	/**
   208	 * Read pending compact prime, clear it from state, and return the cached value.
   209	 * @deprecated Use readCompactPrime() + clearCompactPrime() to avoid data loss
   210	 * if the process crashes between clear and stdout write.
   211	 */
   212	export function readAndClearCompactPrime(sessionId: string): HookState['pendingCompactPrime'] {
   213	  const prime = readCompactPrime(sessionId);
   214	  if (prime) {
   215	    clearCompactPrime(sessionId);
   216	  }
   217	  return prime;
   218	}
   219	
   220	/** Load, merge patch, save, and return updated state */

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts | sed -n '240,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   240	  const sessionId = input.session_id ?? 'unknown';
   241	  hookLog('info', 'session-stop', `Stop hook fired for session ${sessionId}`);
   242	
   243	  // Parse transcript for token usage
   244	  const stateBeforeStop = loadState(sessionId);
   245	  if (input.transcript_path) {
   246	    const startOffset = stateBeforeStop?.metrics?.lastTranscriptOffset ?? 0;
   247	
   248	    try {
   249	      const { usage, newOffset } = await parseTranscript(
   250	        input.transcript_path as string,
   251	        startOffset,
   252	      );
   253	
   254	      parsedMessageCount = usage.messageCount;
   255	      if (usage.messageCount > 0) {
   256	        const cost = estimateCost(usage);
   257	        storeTokenSnapshot(sessionId, usage, cost);
   258	
   259	        // Update offset for incremental parsing on next stop and carry forward
   260	        // producer metadata needed by later continuity packets.
   261	        recordStateUpdate(sessionId, {
   262	          metrics: {
   263	            estimatedPromptTokens: usage.promptTokens,
   264	            estimatedCompletionTokens: usage.completionTokens,
   265	            lastTranscriptOffset: newOffset,
   266	          },
   267	          producerMetadata: buildProducerMetadata(input.transcript_path as string, usage),
   268	        }, touchedPaths);
   269	        producerMetadataWritten = true;
   270	
   271	        hookLog('info', 'session-stop',
   272	          `Parsed ${usage.messageCount} messages: ${usage.promptTokens} prompt + ${usage.completionTokens} completion = ${usage.totalTokens} total tokens`);
   273	      }
   274	    } catch (err: unknown) {
   275	      hookLog('warn', 'session-stop', `Transcript parsing failed: ${err instanceof Error ? err.message : String(err)}`);
   276	    }
   277	  }
   278	
   279	  // Auto-detect spec folder from transcript paths
   280	  if (input.transcript_path) {
   281	    const detectedSpec = detectSpecFolder(input.transcript_path as string, stateBeforeStop?.lastSpecFolder ?? null);
   282	    if (!stateBeforeStop?.lastSpecFolder && detectedSpec) {
   283	      recordStateUpdate(sessionId, { lastSpecFolder: detectedSpec }, touchedPaths);
   284	      hookLog('info', 'session-stop', `Auto-detected spec folder: ${detectedSpec}`);
   285	    } else if (stateBeforeStop?.lastSpecFolder && detectedSpec === stateBeforeStop.lastSpecFolder) {
   286	      hookLog('info', 'session-stop', `Validated active spec folder from transcript: ${detectedSpec}`);
   287	    } else if (stateBeforeStop?.lastSpecFolder && detectedSpec && detectedSpec !== stateBeforeStop.lastSpecFolder) {
   288	      recordStateUpdate(sessionId, { lastSpecFolder: detectedSpec }, touchedPaths);
   289	      hookLog(
   290	        'info',
   291	        'session-stop',
   292	        `Retargeted autosave spec folder from ${stateBeforeStop.lastSpecFolder} to ${detectedSpec}`,
   293	      );
   294	    } else if (!detectedSpec) {
   295	      hookLog('warn', 'session-stop', 'Spec folder detection was ambiguous; preserving existing autosave target.');
   296	    }
   297	  }
   298	
   299	  // Extract session summary from last assistant message
   300	  if (input.last_assistant_message) {
   301	    const text = extractSessionSummary(input.last_assistant_message);
   302	    recordStateUpdate(sessionId, {
   303	      sessionSummary: { text, extractedAt: new Date().toISOString() },
   304	    }, touchedPaths);
   305	    hookLog('info', 'session-stop', `Session summary extracted (${text.length} chars)`);
   306	  }
   307	
   308	  if (autosaveMode === 'enabled') {
   309	    runContextAutosave(sessionId);
   310	  }
   311	
   312	  hookLog('info', 'session-stop', `Session ${sessionId} stop processing complete`);
   313	  return {
   314	    touchedPaths: [...touchedPaths],
   315	    parsedMessageCount,
   316	    autosaveMode,
   317	    producerMetadataWritten,
   318	  };
   319	}
   320	

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts | sed -n '56,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    56	
    57	  return null;
    58	}
    59	
    60	function runContextAutosave(sessionId: string): void {
    61	  const state = loadState(sessionId);
    62	  const specFolder = state?.lastSpecFolder?.trim();
    63	  const summary = state?.sessionSummary?.text?.trim();
    64	
    65	  if (!specFolder || !summary) {
    66	    return;
    67	  }
    68	
    69	  const scriptPath = resolveGenerateContextScriptPath();
    70	  if (!scriptPath) {
    71	    hookLog('warn', 'session-stop', 'Auto-save skipped: generate-context.js not found');
    72	    return;
    73	  }
    74	
    75	  const payload = {
    76	    specFolder,
    77	    sessionSummary: summary,
    78	    observations: [`Auto-saved from Claude Stop hook for session ${sessionId}.`],
    79	    recent_context: [summary],
    80	    user_prompts: [],
    81	    exchanges: [],
    82	    toolCalls: [],
    83	  };
    84	
    85	  const result = spawnSync(
    86	    process.execPath,
    87	    [scriptPath, '--json', JSON.stringify(payload)],
    88	    {
    89	      cwd: process.cwd(),
    90	      encoding: 'utf-8',
    91	      timeout: AUTOSAVE_TIMEOUT_MS,
    92	      stdio: ['ignore', 'pipe', 'pipe'],
    93	      maxBuffer: 1024 * 1024,
    94	    },
    95	  );
    96	
    97	  if (typeof result.status === 'number' && result.status === 0) {
    98	    hookLog('info', 'session-stop', `Context auto-save completed for ${specFolder}`);
    99	    return;
   100	  }
   101	
   102	  const stderr = (result.stderr ?? '').trim();
   103	  const stdout = (result.stdout ?? '').trim();
   104	  const errorText = stderr || stdout || result.error?.message || `exit=${String(result.status)}`;
   105	  hookLog('warn', 'session-stop', `Context auto-save failed: ${errorText}`);
   106	}
   107	
   108	export interface SessionStopProcessOptions {
   109	  autosaveMode?: 'enabled' | 'disabled';
   110	}
   111	
   112	export interface SessionStopProcessResult {
   113	  touchedPaths: string[];
   114	  parsedMessageCount: number;
   115	  autosaveMode: 'enabled' | 'disabled';
   116	  producerMetadataWritten: boolean;
   117	}
   118	
   119	function recordStateUpdate(
   120	  sessionId: string,

codex
I have enough for the lifecycle half now, and I’m doing one last pass on Public’s retrieval pipeline so the comparison doesn’t lean on comments alone. After that I’ll synthesize the iteration report with clear wrapper-confirmed vs README-documented evidence and a tight “what this changes for us” angle.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | sed -n '600,760p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "hybrid|bm25|fts5|vector|RRF|fusion|enableSessionBoost" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   600	  }
   601	
   602	  // -- Channel: Hybrid (with optional deep-mode query expansion) ---------------
   603	  //
   604	  else if (searchType === 'hybrid') {
   605	    // Resolve the query embedding — either pre-computed in config or generate now
   606	    // Fix #16 — Cache this embedding for reuse in constitutional injection path
   607	    // To avoid a duplicate generateQueryEmbedding() call.
   608	    const effectiveEmbedding: Float32Array | number[] | null =
   609	      queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
   610	    cachedEmbedding = effectiveEmbedding;
   611	
   612	    if (!effectiveEmbedding) {
   613	      throw new Error('[stage1-candidate-gen] Failed to generate embedding for hybrid search query');
   614	    }
   615	
   616	    // Deep mode: expand query into variants and run hybrid for each, then dedup
   617	    if (mode === 'deep' && isMultiQueryEnabled()) {
   618	      // -- D2 REQ-D2-001: Query Decomposition (SPECKIT_QUERY_DECOMPOSITION) ---
   619	      //
   620	      // When enabled and the query is multi-faceted, decompose into up to 3
   621	      // sub-query facets and run hybrid search per facet. Results are merged
   622	      // by facet coverage (items appearing in multiple facets rank higher).
   623	      //
   624	      // This block takes the place of the synonym-expansion path below when
   625	      // decomposition fires. If decomposition is disabled, not applicable, or
   626	      // fails, execution falls through to the existing expansion logic.
   627	
   628	      if (isQueryDecompositionEnabled() && isMultiFacet(query)) {
   629	        try {
   630	          const normalizedQuery = normalizeFacetText(query);
   631	          let facets: string[] = [];
   632	
   633	          try {
   634	            facets = buildQueryDecompositionPool(query, mode)
   635	              .filter((facet) => facet !== normalizedQuery)
   636	              .map(normalizeFacetText)
   637	              .filter((facet) => facet.length > 0);
   638	          } catch (facetErr: unknown) {
   639	            const facetMsg = facetErr instanceof Error ? facetErr.message : String(facetErr);
   640	            console.warn(
   641	              `[stage1-candidate-gen] D2 faceted query decomposition failed, falling back to basic decomposition: ${facetMsg}`
   642	            );
   643	          }
   644	
   645	          if (facets.length === 0) {
   646	            facets = decompose(query)
   647	              .map(normalizeFacetText)
   648	              .filter((facet) => facet.length > 0 && facet !== normalizedQuery);
   649	          }
   650	
   651	          facets = [...new Set(facets)].slice(0, MAX_QUERY_DECOMPOSITION_FACETS);
   652	
   653	          if (facets.length > 0) {
   654	            // Run hybrid for the original query plus each facet, in parallel
   655	            const allQueries = [query, ...facets];
   656	            // FIX #7: Use Promise.allSettled so one failing facet branch
   657	            // does not discard results from all other branches.
   658	            const facetSettledResults = await withTimeout(
   659	              Promise.allSettled(
   660	                allQueries.map(async (q): Promise<PipelineRow[]> => {
   661	                  const facetEmbedding = await embeddings.generateQueryEmbedding(q);
   662	                  if (!facetEmbedding) {
   663	                    console.warn('[stage1-candidate-gen] D2 facet embedding generation returned null');
   664	                    return [];
   665	                  }
   666	                  return hybridSearch.collectRawCandidates(
   667	                    q,
   668	                    facetEmbedding,
   669	                    { limit, specFolder, includeArchived }
   670	                  ) as Promise<PipelineRow[]>;
   671	                })
   672	              ),
   673	              DECOMPOSITION_TIMEOUT_MS,
   674	              'D2 facet decomposition',
   675	            );
   676	            const facetResultSets = facetSettledResults.map((result, idx) => {
   677	              if (result.status === 'fulfilled') return result.value;
   678	              console.warn(`[stage1-candidate-gen] D2 facet branch ${idx} rejected: ${result.reason}`);
   679	              return [] as PipelineRow[];
   680	            });
   681	
   682	            channelCount = allQueries.length;
   683	            const pools = allQueries.map((q, i) => ({
   684	              query: q,
   685	              results: facetResultSets[i] ?? [],
   686	            }));
   687	            candidates = mergeFacetCoveragePools(pools);
   688	
   689	            if (trace) {
   690	              addTraceEntry(trace, 'candidate', channelCount, candidates.length, 0, {
   691	                channel: 'd2-query-decomposition',
   692	                originalQuery: query,
   693	                facets,
   694	                facetCount: facets.length,
   695	              });
   696	            }
   697	
   698	            // Skip the standard deep-mode expansion path below
   699	            // (jump to post-channel processing via the else-if chain)
   700	          }
   701	        } catch (decompErr: unknown) {
   702	          const decompMsg = decompErr instanceof Error ? decompErr.message : String(decompErr);
   703	          console.warn(
   704	            `[stage1-candidate-gen] D2 query decomposition failed, falling through to expansion: ${decompMsg}`
   705	          );
   706	          // Fall through to standard deep expansion path below (candidates is empty)
   707	        }
   708	      }
   709	
   710	      // Only run existing expansion logic when decomposition did not produce results
   711	      if (candidates.length === 0) {
   712	
   713	      const queryVariants = await buildDeepQueryVariants(query);
   714	
   715	      if (queryVariants.length > 1) {
   716	        try {
   717	          // F1: Wrap parallel variant searches with latency budget.
   718	          // If variants exceed DEEP_EXPANSION_TIMEOUT_MS, fall back to base query.
   719	          // FIX #7: Use Promise.allSettled so one failing variant does not
   720	          // discard results from all other variant branches.
   721	          const variantSettledResults = await withTimeout(
   722	            Promise.allSettled(
   723	              queryVariants.map(async (variant): Promise<PipelineRow[]> => {
   724	                const variantEmbedding = await embeddings.generateQueryEmbedding(variant);
   725	                if (!variantEmbedding) {
   726	                  console.warn('[stage1-candidate-gen] Deep variant embedding generation returned null');
   727	                  return [];
   728	                }
   729	                const variantResults = await hybridSearch.collectRawCandidates(
   730	                  variant,
   731	                  variantEmbedding,
   732	                  { limit, specFolder, includeArchived }
   733	                );
   734	                return variantResults as PipelineRow[];
   735	              })
   736	            ),
   737	            DEEP_EXPANSION_TIMEOUT_MS,
   738	            'Deep-mode query expansion',
   739	          );
   740	          const variantResultSets: PipelineRow[][] = variantSettledResults.map((result, idx) => {
   741	            if (result.status === 'fulfilled') return result.value;
   742	            console.warn(`[stage1-candidate-gen] Deep variant branch ${idx} rejected: ${result.reason}`);
   743	            return [] as PipelineRow[];
   744	          });
   745	
   746	          channelCount = queryVariants.length;
   747	
   748	          // Merge variant results, deduplicate by id, preserve first-occurrence order
   749	          candidates = mergeCandidateBatches(
   750	            variantResultSets.map((rows, index) => ({
   751	              label: queryVariants[index] ?? `deep-variant-${index}`,
   752	              rows,
   753	            })),
   754	          );
   755	        } catch (expandErr: unknown) {
   756	          const expandMsg =
   757	            expandErr instanceof Error ? expandErr.message : String(expandErr);
   758	          console.warn(
   759	            `[stage1-candidate-gen] Deep query expansion failed, falling back to single hybrid: ${expandMsg}`
   760	          );

 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:7:// This stage avoids downstream fusion/reranking, but may apply temporal
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:8:// Contiguity to raw vector-channel hits before later pipeline stages.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:13://   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:14://   - hybrid (R12):       Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:16://   - hybrid: collectRawCandidates → falls back to vector on failure
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:17://   - vector: Direct vectorSearch
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:28://     - candidates contains raw channel scores; vector hits may include an
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:29://       optional temporal-contiguity boost applied before downstream fusion
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:34://     - Reads from the vector index and FTS5 / BM25 index (DB reads only)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:38:import * as vectorIndex from '../vector-index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:40:import * as hybridSearch from '../hybrid-search.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:41:import { vectorSearchWithContiguity } from '../../cognitive/temporal-contiguity.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:79:/** Number of constitutional results to fetch when none appear in hybrid/vector results. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:459: * and `config.mode`, then applies vector-channel temporal contiguity when
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:463: * This stage does not apply Stage 2 fusion/reranking signals. Vector-channel
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:508:  // the query for the hybrid search channel, improving recall for alias-rich
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:513:  /** Effective query for hybrid search — may be expanded by concept routing. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:516:  if (isGraphConceptRoutingEnabled() && searchType === 'hybrid') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:594:    candidates = vectorIndex.multiConceptSearch(conceptEmbeddings, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:604:  else if (searchType === 'hybrid') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:613:      throw new Error('[stage1-candidate-gen] Failed to generate embedding for hybrid search query');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:616:    // Deep mode: expand query into variants and run hybrid for each, then dedup
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:621:      // sub-query facets and run hybrid search per facet. Results are merged
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:654:            // Run hybrid for the original query plus each facet, in parallel
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:666:                  return hybridSearch.collectRawCandidates(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:729:                const variantResults = await hybridSearch.collectRawCandidates(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:759:            `[stage1-candidate-gen] Deep query expansion failed, falling back to single hybrid: ${expandMsg}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:761:          // Fall through to single hybrid search below
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:763:          candidates = (await hybridSearch.collectRawCandidates(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:770:        // ExpandQuery returned only the original; treat as standard hybrid
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:772:        candidates = (await hybridSearch.collectRawCandidates(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:811:              hybridSearch.collectRawCandidates(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:828:                  return hybridSearch.collectRawCandidates(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:864:            `[stage1-candidate-gen] R12 embedding expansion failed, using standard hybrid: ${r12Msg}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:869:      // Standard hybrid search — runs when R12 is off, suppressed by R15,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:875:          const hybridResults = (await hybridSearch.collectRawCandidates(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:880:          candidates = hybridResults;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:881:        } catch (hybridErr: unknown) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:882:          const hybridMsg =
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:883:            hybridErr instanceof Error ? hybridErr.message : String(hybridErr);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:885:            `[stage1-candidate-gen] Hybrid search failed, falling back to vector: ${hybridMsg}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:888:          // Fallback: pure vector search
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:890:          let vectorResults = vectorIndex.vectorSearch(effectiveEmbedding, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:899:            vectorResults = (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:900:              vectorSearchWithContiguity(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:901:                vectorResults as Array<PipelineRow & { similarity: number; created_at: string }>,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:904:            ) ?? vectorResults;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:906:          candidates = vectorResults;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:910:              reason: hybridMsg,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:911:              channel: 'vector',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:921:  else if (searchType === 'vector') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:926:      throw new Error('[stage1-candidate-gen] Failed to generate embedding for vector search query');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:930:    let vectorResults = vectorIndex.vectorSearch(effectiveEmbedding, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:939:      vectorResults = (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:940:        vectorSearchWithContiguity(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:941:          vectorResults as Array<PipelineRow & { similarity: number; created_at: string }>,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:944:      ) ?? vectorResults;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:946:    candidates = vectorResults;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:953:      `[stage1-candidate-gen] Unknown searchType: "${searchType}". Expected 'multi-concept', 'hybrid', or 'vector'.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:961:  // Exception: for hybrid search, tier/contextType are applied here because
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:963:  // For vector search, tier/contextType were already passed to vectorSearch,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1011:  // In the current candidate set, fetch them separately via vector search.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1031:        const constitutionalResults = vectorIndex.vectorSearch(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1048:        // via vector search bypass the earlier governance/context gate.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1082:  //   3. Fan-out [original, abstract, ...variants] as additional hybrid search channels.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1088:  if (mode === 'deep' && isLlmReformulationEnabled() && searchType === 'hybrid') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1109:              return hybridSearch.collectRawCandidates(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1169:  //   - Run a vector-only search with the pseudo-document embedding.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1176:  if (mode === 'deep' && isHyDEEnabled() && searchType === 'hybrid') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1335:              // raw row.score. For vector-only rows with only `similarity`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1391:  // P1 fix: activeChannels counts actual retrieval channels (vector, keyword/BM25),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1392:  // while channelCount counts parallel query variants. In hybrid mode both vector
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1394:  const activeChannels = searchType === 'hybrid' ? 2 : 1;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:11://     - Intent weights are NEVER applied to hybrid results (G2 double-weighting guard)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:23:// 1a. Recency fusion          — time-decay bonus for recent memories
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:29:// 4.  Intent weights          — non-hybrid search post-scoring adjustment
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:37:// Internally (RRF / RSF fusion). Post-search intent weighting is
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:38:// Therefore ONLY applied for non-hybrid search types (vector,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:39:// Multi-concept). Applying it to hybrid results would double-count.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:125:/** Recency fusion weight — controls how much recency score contributes to the fused score.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:129:/** Recency fusion cap — maximum bonus a candidate can receive from recency fusion.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:192:        console.warn(`[stage2-fusion] learned stage2 model at ${modelPath} is invalid; shadow scoring will use manual-only fallback`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:206:        console.warn(`[stage2-fusion] learned stage2 model load failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:278:    // must not be overwritten with the fusion/ranking score.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:291:    // must not be overwritten with the fusion/ranking score.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:464:    console.warn(`[stage2-fusion] provenance edge fetch failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:493:    console.warn(`[stage2-fusion] provenance community fetch failed (non-fatal): ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:582:    console.warn(`[stage2-fusion] strengthenOnAccess failed for id ${memoryId}: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:592: * G2 PREVENTION: This function is ONLY called for non-hybrid search types.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:593: * Hybrid search (RRF / RSF) already incorporates intent-weighted signals
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:594: * during fusion. Calling this on hybrid results would double-count intent.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:737:    console.warn(`[stage2-fusion] learned trigger query failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:749:      console.warn(`[stage2-fusion] negative feedback stats failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:835:    console.warn(`[stage2-fusion] usage ranking failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:880:      console.warn(`[stage2-fusion] applyTestingEffect failed for id ${row.id}: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:916:    console.warn('[stage2-fusion] adaptive access signal write failed:', (err as Error)?.message ?? err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:930: *   1.  Session boost      (hybrid only — working memory attention)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:931: *   1a. Recency fusion     (all types — time-decay bonus)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:932: *   2.  Causal boost       (hybrid only — graph-traversal amplification)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:937: *   4.  Intent weights     (non-hybrid only — G2 prevention)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:975:  const isHybrid = config.searchType === 'hybrid';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:978:  // Only for hybrid search type — session attention signals are most meaningful
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:979:  // When the full hybrid result set is available for ordering.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:980:  if (isHybrid && config.enableSessionBoost && config.sessionId) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:993:      console.warn(`[stage2-fusion] session boost failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:998:  // -- 1a. Recency fusion --
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1000:  // Uses computeRecencyScore (already imported but previously unused in hybrid path).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1027:    console.warn(`[stage2-fusion] recency fusion failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1031:  // Only for hybrid search type — causal graph traversal is seeded from the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1049:      console.warn(`[stage2-fusion] causal boost failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1057:  // Appear in the co-activation graph. Matches V1 hybrid-search behavior.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1093:      console.warn(`[stage2-fusion] co-activation spreading failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1113:      console.warn(`[stage2-fusion] community boost failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1169:      console.warn(`[stage2-fusion] graph signals failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1180:      console.warn(`[stage2-fusion] usage ranking skipped (db unavailable): ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1191:    console.warn(`[stage2-fusion] graph evidence provenance failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1205:      console.warn(`[stage2-fusion] testing effect skipped (db unavailable): ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1210:  // G2 PREVENTION: Only apply for non-hybrid search types.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1211:  // Hybrid search (RRF / RSF) incorporates intent weighting during fusion —
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1224:      console.warn(`[stage2-fusion] intent weights failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1237:      console.warn(`[stage2-fusion] artifact routing failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1253:    console.warn(`[stage2-fusion] feedback signals failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1287:            `[stage2-fusion] shadow-learned id=${row.id} manual=${shadow.manualScore.toFixed(4)} learned=${shadow.learnedScore.toFixed(4)} delta=${shadow.delta.toFixed(4)}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1293:      console.warn(`[stage2-fusion] learned stage2 shadow scoring failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1321:    console.warn(`[stage2-fusion] validation signal scoring failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1344:        '[stage2-fusion] Graph channel active (bounded_runtime) but zero contribution — causal_edges table may be sparse or candidates lack graph connectivity'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1353:      'fusion',

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '940,1010p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   940	 *   7.  Artifact limiting  (trim to strategy.maxResults if routing active)
   941	 *   8.  Anchor metadata    (annotation — no score mutation)
   942	 *   9.  Validation metadata (spec quality signals + quality scoring)
   943	 *
   944	 * @param input - Stage 2 input containing candidates and pipeline config
   945	 * @returns Stage 2 output with scored results and per-signal metadata
   946	 */
   947	export async function executeStage2(input: Stage2Input): Promise<Stage2Output> {
   948	  const { candidates, config } = input;
   949	  const start = Date.now();
   950	
   951	  const metadata: Stage2Output['metadata'] & { communityBoostApplied?: boolean; graphSignalsApplied?: boolean } = {
   952	    sessionBoostApplied: 'off',
   953	    causalBoostApplied: 'off',
   954	    intentWeightsApplied: 'off',
   955	    artifactRoutingApplied: 'off',
   956	    feedbackSignalsApplied: 'off',
   957	    graphContribution: {
   958	      killSwitchActive: !isGraphUnifiedEnabled(),
   959	      causalBoosted: 0,
   960	      coActivationBoosted: 0,
   961	      communityInjected: 0,
   962	      graphSignalsBoosted: 0,
   963	      totalGraphInjected: 0,
   964	      rolloutState: resolveGraphWalkRolloutState(),
   965	    },
   966	    qualityFiltered: 0,
   967	    durationMs: 0,
   968	  };
   969	
   970	  // FIX #3: Deep clone candidates so in-place mutations (e.g., syncScoreAliasesInPlace)
   971	  // cannot corrupt the original Stage 1 output. A shallow copy ([...candidates]) shares
   972	  // the same row objects, creating a race condition if the orchestrator's timeout fallback
   973	  // uses the original Stage 1 candidates array.
   974	  let results: PipelineRow[] = candidates.map(row => ({ ...row }));
   975	  const isHybrid = config.searchType === 'hybrid';
   976	
   977	  // -- 1. Session boost --
   978	  // Only for hybrid search type — session attention signals are most meaningful
   979	  // When the full hybrid result set is available for ordering.
   980	  if (isHybrid && config.enableSessionBoost && config.sessionId) {
   981	    try {
   982	      const { results: boosted, metadata: sbMeta } = sessionBoost.applySessionBoost(
   983	        results,
   984	        config.sessionId
   985	      );
   986	      results = boosted as PipelineRow[];
   987	      // FIX #4: Sync aliases immediately after session boost score mutations
   988	      // so rrfScore/intentAdjustedScore are not stale for subsequent steps.
   989	      syncScoreAliasesInPlace(results);
   990	      metadata.sessionBoostApplied = sbMeta.applied ? 'applied' : 'enabled';
   991	    } catch (err: unknown) {
   992	      const message = err instanceof Error ? err.message : String(err);
   993	      console.warn(`[stage2-fusion] session boost failed: ${message}`);
   994	      metadata.sessionBoostApplied = 'failed';
   995	    }
   996	  }
   997	
   998	  // -- 1a. Recency fusion --
   999	  // Applies a time-decay bonus to each candidate based on its created_at timestamp.
  1000	  // Uses computeRecencyScore (already imported but previously unused in hybrid path).
  1001	  // Bonus is capped at RECENCY_FUSION_CAP and clamped to keep score in [0, 1].
  1002	  try {
  1003	    let recencyBoostedCount = 0;
  1004	    results = results.map((row) => {
  1005	      const recencyTimestamp = (row.created_at as string | undefined) ?? '';
  1006	      const importanceTier = (row.importance_tier as string | undefined) ?? 'normal';
  1007	      if (!recencyTimestamp) return row;
  1008	
  1009	      const recencyScore = computeRecencyScore(recencyTimestamp, importanceTier);
  1010	      const bonus = Math.min(RECENCY_FUSION_CAP, recencyScore * RECENCY_FUSION_WEIGHT);

codex
# Iteration 004: SESSION LIFECYCLE

## Focus
SESSION LIFECYCLE: How sessions are created, maintained, ended, summarized. Context survival across sessions.

## Findings
### Finding 1: Mnemosyne does not create a first-class session; it creates a collection context
- **Source**: [index.ts:4](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L4), [index.ts:6](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L6), [index.ts:29](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L29), [index.ts:81](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L81), [session-manager.ts:393](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L393), [session-manager.ts:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L396)
- **Evidence type**: wrapper-confirmed for Mnemosyne, wrapper-confirmed for Public
- **What it does**: Mnemosyne resolves `targetDir`, derives `project` from the directory basename, then idempotently runs `mnemosyne init --name <project>` on plugin load. That is onboarding/setup, not session creation. Public, by contrast, server-mints an `effectiveSessionId` when none is supplied and treats that as the continuity handle.
- **Why it matters for us**: Mnemosyne’s lifecycle starts at “which collection am I in?”, while Public starts at “which trusted session is this?”. That is a materially weaker lifecycle model for resume, dedup, trust, and cleanup.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Mnemosyne session maintenance is agent-discipline, not runtime state
- **Source**: [index.ts:96](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L96), [index.ts:138](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L138), [README.md:69](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L69), [session-state.ts:6](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts#L6), [session-state.ts:83](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts#L83), [memory-context.ts:821](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L821), [memory-context.ts:1434](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1434)
- **Evidence type**: both
- **What it does**: Mnemosyne exposes stateless recall/store/delete tools and recommends that the agent use them at session start and during decision points. Public keeps explicit retrieval session state: seen-result dedup, active goal, preferred anchors, inferred mode, event counters, and auto-resume prompt context injection.
- **Why it matters for us**: Mnemosyne helps an agent behave consistently, but it does not maintain a live session model. Public already has that layer, so replacing it with Mnemosyne’s behavior-only contract would be a regression.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: Mnemosyne has no stop-hook summarization or autosave path
- **Source**: [index.ts:222](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L222), [README.md:75](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L75), [session-stop.ts:60](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts#L60), [session-stop.ts:85](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts#L85), [session-stop.ts:299](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts#L299), [hook-state.ts:34](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts#L34)
- **Evidence type**: both
- **What it does**: Mnemosyne’s “end of session” behavior is only prompt guidance: store relevant memories before you finish. Public has a real stop path: extract a session summary from the last assistant message, persist it in hook state, and optionally call `generate-context.js` for autosave.
- **Why it matters for us**: this is the biggest lifecycle gap. Mnemosyne can persist facts, but it does not natively summarize or checkpoint a session boundary. Public already does.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: Mnemosyne’s compaction hook preserves memory awareness, not continuity state
- **Source**: [index.ts:208](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L208), [index.ts:213](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L213), [spec-kit-compact-code-graph.js:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396), [opencode-transport.ts:102](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L102), [opencode-transport.ts:144](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L144), [opencode-transport.ts:149](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L149)
- **Evidence type**: wrapper-confirmed for Mnemosyne, wrapper-confirmed for Public
- **What it does**: Mnemosyne injects a static checklist of memory verbs into `output.context` during compaction. Public’s compaction transport injects a rendered continuity note from a shared payload envelope and explicitly frames it as compaction continuity, separate from current-turn retrieval.
- **Why it matters for us**: the transferable idea is not “compaction exists”; it is “memory-tool reminders survive compaction in plain prompt text.” Public’s substrate is stronger, but it currently emphasizes continuity payloads more than explicit memory-verb reminders.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Public has a trusted session boundary; Mnemosyne has none
- **Source**: [index.ts:99](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L99), [index.ts:141](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L141), [index.ts:196](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L196), [memory-triggers.ts:207](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L207), [memory-triggers.ts:225](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L225), [session-manager.ts:401](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L401), [session-manager.ts:406](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L406)
- **Evidence type**: wrapper-confirmed for both
- **What it does**: Mnemosyne tools accept only query/content/id arguments; there is no trusted session handoff or identity binding. Public validates caller-supplied `sessionId`, rejects untrusted IDs, and instructs callers to omit it so the server can mint a new trusted session.
- **Why it matters for us**: if we ever front an external memory binary, it must sit behind Public’s session trust layer rather than replacing it. Otherwise we lose the IDOR protection and scoped continuity guarantees already present in Public.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 6: Mnemosyne’s lifecycle hygiene is document deletion, not session closure
- **Source**: [index.ts:193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L193), [README.md:45](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L45), [README.md:72](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L72), [session-manager.ts:782](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L782), [session-manager.ts:807](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L807), [session-manager.ts:843](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L843), [session-manager.ts:1079](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L1079)
- **Evidence type**: both
- **What it does**: Mnemosyne offers `memory_delete(id)` and recommends deleting contradicted memories, but there is no concept of session completion, interruption, or stale session cleanup. Public explicitly cleans stale `working_memory`, `session_sent_memories`, and completed/interrupted `session_state`, and it can mark sessions completed or clear them immediately.
- **Why it matters for us**: Mnemosyne’s mutation model can keep the memory corpus tidy, but it does not manage session residue. Any Public-facing binary facade would need explicit close/cleanup semantics above the backend.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
- [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- [working-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts)
- [hook-state.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts)
- [session-stop.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts)
- [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
- [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)

## Assessment
- New information ratio: 0.81
- Questions addressed: implicit versus explicit session creation, session maintenance state, stop-time summarization, compaction survival, trusted session identity, stale-session cleanup, Public hybrid retrieval overlap
- Questions answered: Mnemosyne has no first-class session object; continuity is mostly prompt discipline plus collection scoping; compaction preserves tool awareness but not live continuity state; Public already has server-minted session IDs, working-memory continuity, cached summary validation, session-stop autosave, and stale cleanup; the exact strict validation command returned `RESULT: PASSED` despite the shell warning `cannot create temp file for here document: Operation not permitted`

## Reflection
- What worked: starting with `external/src/index.ts` made it obvious that the lifecycle logic lives almost entirely in the wrapper boundary and prompt contract; tracing that directly into Public’s `session-manager`, `session-resume`, `memory-context`, and `session-stop` code exposed the real lifecycle delta fast
- What did not work: the brief assumed `external/opencode-mnemosyne-main/...`, but the checkout is actually rooted directly under `external/`; the sandbox is read-only, so I could not update `research/research.md`, `checklist.md`, `implementation-summary.md`, or run `generate-context.js` to save memory for this phase

## Recommended Next Focus
MUTATION + LINEAGE SAFETY: trace how Mnemosyne document IDs move from recall output into delete operations, compare that with Public’s checkpoint, session cleanup, and memory-save/reconsolidation boundaries, and define the minimum safe contract for any future external-binary memory facade: trusted session layer, close/cleanup surface, summary/autosave hook, and contradiction-safe mutation path.
hook: Stop
hook: Stop Completed
tokens used
177,815
# Iteration 004: SESSION LIFECYCLE

## Focus
SESSION LIFECYCLE: How sessions are created, maintained, ended, summarized. Context survival across sessions.

## Findings
### Finding 1: Mnemosyne does not create a first-class session; it creates a collection context
- **Source**: [index.ts:4](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L4), [index.ts:6](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L6), [index.ts:29](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L29), [index.ts:81](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L81), [session-manager.ts:393](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L393), [session-manager.ts:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L396)
- **Evidence type**: wrapper-confirmed for Mnemosyne, wrapper-confirmed for Public
- **What it does**: Mnemosyne resolves `targetDir`, derives `project` from the directory basename, then idempotently runs `mnemosyne init --name <project>` on plugin load. That is onboarding/setup, not session creation. Public, by contrast, server-mints an `effectiveSessionId` when none is supplied and treats that as the continuity handle.
- **Why it matters for us**: Mnemosyne’s lifecycle starts at “which collection am I in?”, while Public starts at “which trusted session is this?”. That is a materially weaker lifecycle model for resume, dedup, trust, and cleanup.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Mnemosyne session maintenance is agent-discipline, not runtime state
- **Source**: [index.ts:96](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L96), [index.ts:138](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L138), [README.md:69](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L69), [session-state.ts:6](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts#L6), [session-state.ts:83](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts#L83), [memory-context.ts:821](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L821), [memory-context.ts:1434](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1434)
- **Evidence type**: both
- **What it does**: Mnemosyne exposes stateless recall/store/delete tools and recommends that the agent use them at session start and during decision points. Public keeps explicit retrieval session state: seen-result dedup, active goal, preferred anchors, inferred mode, event counters, and auto-resume prompt context injection.
- **Why it matters for us**: Mnemosyne helps an agent behave consistently, but it does not maintain a live session model. Public already has that layer, so replacing it with Mnemosyne’s behavior-only contract would be a regression.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: Mnemosyne has no stop-hook summarization or autosave path
- **Source**: [index.ts:222](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L222), [README.md:75](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L75), [session-stop.ts:60](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts#L60), [session-stop.ts:85](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts#L85), [session-stop.ts:299](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts#L299), [hook-state.ts:34](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts#L34)
- **Evidence type**: both
- **What it does**: Mnemosyne’s “end of session” behavior is only prompt guidance: store relevant memories before you finish. Public has a real stop path: extract a session summary from the last assistant message, persist it in hook state, and optionally call `generate-context.js` for autosave.
- **Why it matters for us**: this is the biggest lifecycle gap. Mnemosyne can persist facts, but it does not natively summarize or checkpoint a session boundary. Public already does.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: Mnemosyne’s compaction hook preserves memory awareness, not continuity state
- **Source**: [index.ts:208](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L208), [index.ts:213](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L213), [spec-kit-compact-code-graph.js:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396), [opencode-transport.ts:102](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L102), [opencode-transport.ts:144](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L144), [opencode-transport.ts:149](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L149)
- **Evidence type**: wrapper-confirmed for Mnemosyne, wrapper-confirmed for Public
- **What it does**: Mnemosyne injects a static checklist of memory verbs into `output.context` during compaction. Public’s compaction transport injects a rendered continuity note from a shared payload envelope and explicitly frames it as compaction continuity, separate from current-turn retrieval.
- **Why it matters for us**: the transferable idea is not “compaction exists”; it is “memory-tool reminders survive compaction in plain prompt text.” Public’s substrate is stronger, but it currently emphasizes continuity payloads more than explicit memory-verb reminders.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Public has a trusted session boundary; Mnemosyne has none
- **Source**: [index.ts:99](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L99), [index.ts:141](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L141), [index.ts:196](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L196), [memory-triggers.ts:207](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L207), [memory-triggers.ts:225](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L225), [session-manager.ts:401](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L401), [session-manager.ts:406](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L406)
- **Evidence type**: wrapper-confirmed for both
- **What it does**: Mnemosyne tools accept only query/content/id arguments; there is no trusted session handoff or identity binding. Public validates caller-supplied `sessionId`, rejects untrusted IDs, and instructs callers to omit it so the server can mint a new trusted session.
- **Why it matters for us**: if we ever front an external memory binary, it must sit behind Public’s session trust layer rather than replacing it. Otherwise we lose the IDOR protection and scoped continuity guarantees already present in Public.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 6: Mnemosyne’s lifecycle hygiene is document deletion, not session closure
- **Source**: [index.ts:193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L193), [README.md:45](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L45), [README.md:72](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L72), [session-manager.ts:782](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L782), [session-manager.ts:807](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L807), [session-manager.ts:843](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L843), [session-manager.ts:1079](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L1079)
- **Evidence type**: both
- **What it does**: Mnemosyne offers `memory_delete(id)` and recommends deleting contradicted memories, but there is no concept of session completion, interruption, or stale session cleanup. Public explicitly cleans stale `working_memory`, `session_sent_memories`, and completed/interrupted `session_state`, and it can mark sessions completed or clear them immediately.
- **Why it matters for us**: Mnemosyne’s mutation model can keep the memory corpus tidy, but it does not manage session residue. Any Public-facing binary facade would need explicit close/cleanup semantics above the backend.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
- [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- [working-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts)
- [hook-state.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts)
- [session-stop.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts)
- [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
- [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)

## Assessment
- New information ratio: 0.81
- Questions addressed: implicit versus explicit session creation, session maintenance state, stop-time summarization, compaction survival, trusted session identity, stale-session cleanup, Public hybrid retrieval overlap
- Questions answered: Mnemosyne has no first-class session object; continuity is mostly prompt discipline plus collection scoping; compaction preserves tool awareness but not live continuity state; Public already has server-minted session IDs, working-memory continuity, cached summary validation, session-stop autosave, and stale cleanup; the exact strict validation command returned `RESULT: PASSED` despite the shell warning `cannot create temp file for here document: Operation not permitted`

## Reflection
- What worked: starting with `external/src/index.ts` made it obvious that the lifecycle logic lives almost entirely in the wrapper boundary and prompt contract; tracing that directly into Public’s `session-manager`, `session-resume`, `memory-context`, and `session-stop` code exposed the real lifecycle delta fast
- What did not work: the brief assumed `external/opencode-mnemosyne-main/...`, but the checkout is actually rooted directly under `external/`; the sandbox is read-only, so I could not update `research/research.md`, `checklist.md`, `implementation-summary.md`, or run `generate-context.js` to save memory for this phase

## Recommended Next Focus
MUTATION + LINEAGE SAFETY: trace how Mnemosyne document IDs move from recall output into delete operations, compare that with Public’s checkpoint, session cleanup, and memory-save/reconsolidation boundaries, and define the minimum safe contract for any future external-binary memory facade: trusted session layer, close/cleanup surface, summary/autosave hook, and contradiction-safe mutation path.
