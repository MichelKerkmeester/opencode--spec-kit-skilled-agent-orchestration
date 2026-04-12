### Finding 4: Expose write-time pinning through the current save/update surface instead of overloading tiers or inventing a new “core” path
- **Source**: [external/src/index.ts:138](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L138), [external/src/index.ts:150](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L150), [external/README.md:57](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L57), [tool-schemas.ts:217](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L217), [tool-schemas.ts:291](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L291), [unit-normalization.vitest.ts:28](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts#L28), [unit-normalization.vitest.ts:220](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts#L220), [vector-index-queries.ts:203](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts#L203)
- **What it does**: Both: Mnemosyne surfaces `core=true` at write time. Public already has latent pinned-memory semantics in storage and ranking (`is_pinned` bypasses decay), but `memory_save` and `memory_update` do not expose pinning in the tool contract.
- **Why it matters for us**: This is less a new feature than a buried one. Public can keep constitutional as a content-governance tier while exposing `pin` as an operational retrieval flag for always-on memories.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 5: Do not move toward AGENTS.md-dependent memory discipline; keep memory awareness runtime-owned
- **Source**: [external/README.md:62](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L62), [external/README.md:69](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L69), [context-server.ts:755](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755), [context-server.ts:782](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L782), [memory-surface.ts:419](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L419), [memory-surface.ts:489](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L489)
- **What it does**: README-documented on Mnemosyne: proactive memory behavior is recommended via manual `AGENTS.md` instructions. Public already injects tool routing, session recovery, and auto-prime guidance from the runtime itself.
- **Why it matters for us**: Public should not regress toward doc-dependent behavior. If we want Mnemosyne’s proactive recall pattern, the right place is runtime-owned prime/compaction payloads so it works consistently across sessions and runtimes.
- **Recommendation**: reject
- **Impact**: medium

### Finding 6: Reject any architectural pivot from MCP-first memory to a thin OpenCode binary wrapper; if desired, add a facade on top of the current server
- **Source**: [external/package.json:4](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L4), [external/package.json:31](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L31), [external/package.json:41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L41), [external/src/index.ts:35](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L35), [external/src/index.ts:95](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L95), [tool-schemas.ts:37](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L37), [tool-schemas.ts:217](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L217), [tool-schemas.ts:236](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L236), [context-server.ts:759](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L759)
- **What it does**: Wrapper-confirmed on Mnemosyne: the repo is a thin OpenCode plugin around a single binary with five tools. Public is already an MCP memory platform with retrieval, health, bootstrap, governance, and analysis surfaces.
- **Why it matters for us**: Mnemosyne’s transferable value is UX thinness, not backend architecture. Replacing Spec Kit Memory with a binary-wrapper shape would collapse tool richness and governance. A better direction is an optional OpenCode facade that calls the existing MCP server.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
- [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [memory-surface.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts)
- [compact-inject.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts)
- [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts)
- [scope-governance.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [cli.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts)
- [db-state.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts)
- [vector-index-queries.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)

## Assessment
- New information ratio: 0.76
- Questions addressed: compaction-hook ownership, readiness/warmup architecture, scoped-memory ergonomics, latent pinning support, AGENTS guidance role, plugin-vs-MCP architecture, CocoIndex separation.
- Questions answered: The strongest refactor opportunities are all surface-level and integration-level, not ranking-backend replacements. Public already has the core primitives for compaction continuity, readiness checks, scoped governance, and pinning; the missing work is to expose and unify them more cleanly. The exact strict validation command passed with `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, while still emitting `cannot create temp file for here document: Operation not permitted`. No `AGENTS.md` exists under the external checkout.

## Reflection
- What worked: Starting with the wrapper, then tracing Public’s compaction, memory-surface, governance, and readiness paths exposed which gaps are actually latent-feature refactors rather than missing systems.
- What did not work: The environment is read-only, so I could not update `research/research.md`, `checklist.md`, `implementation-summary.md`, or save memory for the phase. The external repo remains wrapper-thin, so backend ranking behavior stays README-documented rather than source-proven.

## Recommended Next Focus
Prototype one narrow refactor slice first: extend the shared compaction payload so OpenCode receives explicit memory-tool continuity guidance from the existing `memory-surface` plus transport pipeline. If that works cleanly, follow with a second slice that exposes `pin` and scoped save aliases on top of the current governed `memory_save` path instead of creating parallel tools or stores.

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
# Iteration 013: GAP ANALYSIS - PARADIGM SHIFTS

## Focus
GAP ANALYSIS - PARADIGM SHIFTS: What paradigm shifts does this system suggest for our memory architecture?

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
I’m treating this as a read-only deep-research pass focused on Mnemosyne’s paradigm-shift implications for Spec Kit Memory. I’ll verify the phase folder state first, then trace the wrapper source in the required order, compare it against the current memory/compaction surfaces, and synthesize only net-new findings beyond the prior set.
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

exec
/bin/zsh -lc 'rg -n "mnemosyne|hybrid-rag|compaction|project/global|pinning|AGENTS" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
430:- when the user asked to “create a similar prompt ... in their root folders | skip spec folder,” place `phase-research-prompt.md` in each phase root and avoid spinning up new spec-folder scaffolding [Task 2]
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
623:- when the user said “fix findings,” they expected direct edits in the existing remediation packet instead of spinning up separate tickets/specs [Task 1][Task 2]
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

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1308ms:

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
I’ve confirmed the deep-research workflow guidance and kicked off the exact strict validator the brief requires. While that finishes, I’m moving into the wrapper trace so the analysis stays anchored in source order instead of drifting into README-level claims.
exec
/bin/zsh -lc 'rg --files "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external"' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts\" | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json\" | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/tsconfig.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package-lock.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/LICENSE

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

codex
The wrapper is as thin as the brief implied: a single TypeScript entrypoint, one plugin manifest, and no backend source beyond the CLI bridge. I’m now cross-walking the exact behaviors that are actually source-proven here, especially compaction injection, scope derivation, lazy global init, and the `core` write path against Public’s current memory surfaces.
exec
/bin/zsh -lc "nl -ba \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md\" | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc 'rg -n "RRF|Reciprocal|BM25|FTS5|sqlite-vec|snowflake|global|project|AGENTS|core|compacting|compaction|offline|model|500 MB|memory_recall|memory_store" "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md"' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
3:OpenCode plugin for **local persistent memory** using [Mnemosyne](https://github.com/gandazgul/mnemosyne). Gives your AI coding agent memory that persists across sessions -- entirely offline, no cloud APIs.
5:This is the local/offline alternative to cloud-based memory plugins like opencode-supermemory.
18:See the [mnemosyne README](https://github.com/gandazgul/mnemosyne#quick-start) for detailed setup instructions. On first use, mnemosyne will automatically download its ML models (~500 MB one-time).
41:| `memory_recall` | Search project memory for relevant context and past decisions |
42:| `memory_recall_global` | Search global memory for cross-project preferences |
43:| `memory_store` | Store a project-scoped memory (optionally as `core`) |
44:| `memory_store_global` | Store a cross-project memory (optionally as `core`) |
49:- **`experimental.session.compacting`** -- Injects memory tool instructions into the compaction prompt so the agent retains awareness of its memory capabilities across context window resets.
55:| Project | `<directory-name>` | Sessions in the same project |
56:| Global | `global` | All projects |
57:| Core (project) | `<directory-name>` (tagged `core`) | Sessions + survives compaction |
58:| Core (global) | `global` (tagged `core`) | All projects + survives compaction |
60:The project collection is auto-initialized when the plugin loads. The global collection is created on first use of `memory_store_global`.
62:## AGENTS.md (recommended)
64:For best results, add this to your project or global `AGENTS.md` so the agent uses memory proactively from the start of each session:
69:- At the start of a session, use memory_recall and memory_recall_global to search for context
71:- After significant decisions, use memory_store to save a concise summary.
73:- Use memory_recall_global / memory_store_global for cross-project preferences.
74:- Mark critical, always-relevant context as core (core=true) — but use sparingly.
76:  to the user and the project. This will help you recall important information in
83:- **Full-text search** (SQLite FTS5, BM25 ranking)
84:- **Vector search** (sqlite-vec, cosine similarity with snowflake-arctic-embed-m-v1.5)
85:- **Reciprocal Rank Fusion** combines both for best results
91:This project uses standard Node.js tools: `npm` for package management and `tsc` (TypeScript compiler) for building.
97:# Build the project

exec
/bin/zsh -lc 'rg -n "is_pinned|pinned|pin|retrievalLevel|global|session.compacting|compacting|memory tools|memory_search|memory_context|memory_match_triggers|CocoIndex|scope|sharedSpace|tenantId|userId|agentId|bootstrap|resume|compact|memory surface|tool routing" .opencode/skill/system-spec-kit/mcp_server .opencode/plugins/spec-kit-compact-code-graph.js .opencode/skill/mcp-coco-index/README.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/plugins/spec-kit-compact-code-graph.js:36:const PLUGIN_ID = 'spec-kit-compact-code-graph';
.opencode/plugins/spec-kit-compact-code-graph.js:44:const BRIDGE_PATH = fileURLToPath(new URL('./spec-kit-compact-code-graph-bridge.mjs', import.meta.url));
.opencode/plugins/spec-kit-compact-code-graph.js:77: *   compaction?: TransportBlock,
.opencode/plugins/spec-kit-compact-code-graph.js:121:  return `${specFolder ?? '__workspace__'}::${sessionID ?? '__global__'}`;
.opencode/plugins/spec-kit-compact-code-graph.js:296:      spec_kit_compact_code_graph_status: tool({
.opencode/plugins/spec-kit-compact-code-graph.js:297:        description: 'Show Spec Kit compact code graph plugin cache status',
.opencode/plugins/spec-kit-compact-code-graph.js:308:            `resume_mode=${RESUME_MODE}`,
.opencode/plugins/spec-kit-compact-code-graph.js:396:    'experimental.session.compacting': async (input, output) => {
.opencode/plugins/spec-kit-compact-code-graph.js:406:      const block = plan?.compaction;
.opencode/skill/mcp-coco-index/README.md:2:title: "CocoIndex Code - Semantic Code Search"
.opencode/skill/mcp-coco-index/README.md:3:description: "Semantic code search via vector embeddings. CocoIndex Code enables natural-language discovery of code, patterns, and implementations across 28+ languages using a CLI and a single MCP search tool."
.opencode/skill/mcp-coco-index/README.md:14:# CocoIndex Code - Semantic Code Search
.opencode/skill/mcp-coco-index/README.md:42:CocoIndex Code is a semantic code search tool built on vector embeddings. Where `grep` matches exact characters, CocoIndex Code matches meaning. Ask for "retry logic with exponential backoff" and it returns code that implements that pattern, regardless of how the author named variables or functions. This makes it the right tool when you know what a piece of code does but not where it lives or what it is called.
.opencode/skill/mcp-coco-index/README.md:65:| `ccc search` (CocoIndex) | You know what code does but not where it lives | Approximate, needs verification |
.opencode/skill/mcp-coco-index/README.md:78:| Path filters | `--path` (CLI) or `paths` (MCP) scopes results to a directory |
.opencode/skill/mcp-coco-index/README.md:85:In the broader system-spec-kit stack, CocoIndex is the semantic half of a three-system retrieval model: CocoIndex finds conceptually similar code, Code Graph answers structural questions, and session bootstrap surfaces CocoIndex readiness during recovery. The companion lifecycle helpers exposed through system-spec-kit are `ccc_status`, `ccc_reindex`, and `ccc_feedback`.
.opencode/skill/mcp-coco-index/README.md:96:Run the idempotent bootstrap helper. It installs the binary, initializes the project if needed, and reports readiness.
.opencode/skill/mcp-coco-index/README.md:137:CocoIndex Code resolves queries by embedding the natural-language query text and comparing the resulting vector against pre-computed vectors for every code chunk in the index. This means the search engine reads intent, not characters. A query for "graceful shutdown handler" finds code that tears down servers or releases resources, even if the words "graceful", "shutdown", or "handler" never appear in that code.
.opencode/skill/mcp-coco-index/README.md:223:    install.sh                     Install CocoIndex Code into skill venv
.opencode/skill/mcp-coco-index/README.md:226:    ensure_ready.sh                Idempotent bootstrap (install + init + index if needed)
.opencode/skill/mcp-coco-index/README.md:248:**Global settings** (`~/.cocoindex_code/global_settings.yml`)
.opencode/skill/mcp-coco-index/README.md:303:CocoIndex Code resolves the project root in this order:
.opencode/skill/mcp-coco-index/README.md:438:**Embedding model mismatch after changing `global_settings.yml`**
.opencode/skill/mcp-coco-index/README.md:457:Common causes: CocoIndex Code requires Python 3.11 or later. The system Python may be an older version.
.opencode/skill/mcp-coco-index/README.md:473:**Q: Why does CocoIndex Code only expose one MCP tool when the CLI has seven commands?**
.opencode/skill/mcp-coco-index/README.md:513:| [scripts/install.sh](scripts/install.sh) | Install CocoIndex Code |
.opencode/skill/mcp-coco-index/README.md:515:| [scripts/ensure_ready.sh](scripts/ensure_ready.sh) | Idempotent bootstrap |
.opencode/skill/mcp-coco-index/README.md:528:| CocoIndex GitHub | https://github.com/cocoindex-io/cocoindex |
.opencode/skill/mcp-coco-index/README.md:529:| CocoIndex Code on PyPI | https://pypi.org/project/cocoindex-code/ |
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:258:  surface: 'response-hints' | 'session-bootstrap' | 'memory-context';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:694:    hints.push(`Code graph: ${pkg.codeGraphStatus}, CocoIndex: ${pkg.cocoIndexAvailable ? 'available' : 'not installed'}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:782:  // Phase 027: Structural bootstrap guidance for non-hook runtimes
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:809:  } catch { /* tool routing snapshot unavailable — skip */ }
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:976:    // Phase 024: Code-search redirect hint for memory tools
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1232:    console.error('[context-server] Startup scan already in progress, skipping');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1340:// P1-09 FIX: Hoist transport to module scope so shutdown handlers can close it
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:17:**Graph as a first-class feature family.** The `SPECKIT_GRAPH_*` variables form a dedicated feature family (see [Section 6](#6-graph) and [Section 7](#7-graph-calibration)) controlling structural code graph indexing, graph-first routing in the search pipeline, causal graph traversal, and calibration profiles. Since graph-first routing is now the default query dispatch order (Code Graph -> CocoIndex -> Memory), the graph env vars are among the most impactful configuration levers.
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:72:10. [Governance and Scope](#10-governance-and-scope)
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:187:| `SPECKIT_DUAL_RETRIEVAL` | `true` | boolean | Dual-level retrieval mode: `local` (entity), `global` (community), `auto` (local + fallback) (Phase B T019). Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:229:| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | Token-pressure policy for memory_context responses. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:230:| `SPECKIT_AUTO_RESUME` | `true` | boolean | Automatic session resume context injection for memory_context. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:260:<!-- ANCHOR:governance-scope -->
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:265:| `SPECKIT_MEMORY_ROADMAP_PHASE` | `shared-rollout` | string | Active memory roadmap phase: `baseline`, `lineage`, `graph`, `adaptive`, `scope-governance`, `shared-rollout`. | `lib/config/capability-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:269:| `SPECKIT_MEMORY_SCOPE_ENFORCEMENT` | `true` | boolean | Scope enforcement for tenant/user/agent isolation. Graduated ON. Legacy: `SPECKIT_HYDRA_SCOPE_ENFORCEMENT`. | `lib/governance/scope-governance.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:270:| `SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS` | `true` | boolean | Governance guardrails for validated operations. Graduated ON. Legacy: `SPECKIT_HYDRA_GOVERNANCE_GUARDRAILS`. | `lib/governance/scope-governance.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:274:<!-- /ANCHOR:governance-scope -->
.opencode/skill/system-spec-kit/mcp_server/eslint.config.mjs:1:import globals from 'globals';
.opencode/skill/system-spec-kit/mcp_server/eslint.config.mjs:12:      globals: {
.opencode/skill/system-spec-kit/mcp_server/eslint.config.mjs:13:        ...globals.node,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:19:import { recordGovernanceAudit } from '../lib/governance/scope-governance.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:147:  const userIdProvided = typeof args.actorUserId === 'string';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:148:  const agentIdProvided = typeof args.actorAgentId === 'string';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:151:  const hasBlankUser = userIdProvided && normalizedUserId.length === 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:152:  const hasBlankAgent = agentIdProvided && normalizedAgentId.length === 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:210:  tenantId?: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:212:  const normalizedTenantId = typeof tenantId === 'string' ? tenantId.trim() : '';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:216:      'Tenant scope is required for shared-memory admin mutations.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:219:        error: 'Tenant scope is required for shared-memory admin mutations.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:222:        hint: 'Provide the tenantId for the target shared-space mutation.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:248:  // Shared-memory tools do not currently receive a server-minted sessionId or
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:262:  tenantId: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:263:  sharedSpaceId?: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:265:  tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:266:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:267:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:268:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:271:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:272:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:273:    userId: actor.subjectType === 'user' ? actor.subjectId : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:274:    agentId: actor.subjectType === 'agent' ? actor.subjectId : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:282:    tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:294:    ...buildActorScope(args.actor, args.tenantId, args.spaceId),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:329:      return 'Tenant scope is required to manage shared spaces.';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:408:  tenantId?: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:415:  const normalizedTenantId = typeof tenantId === 'string' && tenantId.trim().length > 0
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:416:    ? tenantId.trim()
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:464:    }, args.tenantId);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:485:            buildActorScope(actor, args.tenantId, args.spaceId),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:493:              tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:514:          tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:533:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:573:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:606:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:655:    }, args.tenantId);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:660:        buildActorScope(actor, args.tenantId, args.spaceId),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:669:            tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:704:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:724:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:747: * Report rollout status and visible shared spaces for the requested scope.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:749: * @param args - Tenant, user, or agent scope to evaluate.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:762:      ? getAllowedSharedSpaceIdsForCaller(db, actor, args.tenantId)
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:772:        tenantId: args.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:773:        userId: actor.subjectType === 'user' ? actor.subjectId : null,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:774:        agentId: actor.subjectType === 'agent' ? actor.subjectId : null,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:901:- **Spaces** — Named containers for shared memories, scoped to a tenant.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:911:| \`/memory:manage shared create <spaceId> <tenantId> <name>\` | Create or update a shared space; first creator becomes owner |
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:129: * @param args - Ingest arguments (paths, scope, options)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:80:  // Safety: refuse to bulk-delete constitutional or critical tiers without explicit specFolder scope
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:82:    throw new Error(`Bulk delete of "${tier}" tier requires specFolder scope for safety. Use memory_delete for individual deletions.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:41:// C2 FIX: Import DB access for scope filtering
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:111:  // C2 FIX: Scope fields to prevent cross-scope trigger leaks
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:112:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:113:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:114:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:115:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:197:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:213:      tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:214:      userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:215:      agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:220:        tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:225:          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:284:      console.warn('[memory_match_triggers] Decay failed:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:291:  // C2 FIX: Post-filter by scope to prevent cross-tenant trigger leaks
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:292:  const { specFolder, tenantId, userId, agentId, sharedSpaceId } = args;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:293:  if (specFolder || tenantId || userId || agentId || sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:299:        const scopeRows = database.prepare(`
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:310:        const scopeMap = new Map(scopeRows.map(r => [r.id, r]));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:312:          const row = scopeMap.get(match.memoryId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:314:          // H2 FIX: Require exact scope match — rows with NULL scope are excluded
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:315:          // when the caller specifies a scope, not silently passed through.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:317:          if (tenantId && row.tenant_id !== tenantId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:318:          if (userId && row.user_id !== userId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:319:          if (agentId && row.agent_id !== agentId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:320:          if (sharedSpaceId && row.shared_space_id !== sharedSpaceId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:324:    } catch (scopeErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:336:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:374:        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:390:          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:491:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:511:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:565:  handle_memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:13:  const normalizedFolder = specFolder || '__global__';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:100:  scope: MemoryScopeMatch = {},
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:102:  const tenantId = normalizeScopeMatchValue(scope.tenantId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:103:  const userId = normalizeScopeMatchValue(scope.userId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:104:  const agentId = normalizeScopeMatchValue(scope.agentId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:105:  const sessionId = normalizeScopeMatchValue(scope.sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:106:  const sharedSpaceId = normalizeScopeMatchValue(scope.sharedSpaceId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:125:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:126:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:127:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:128:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:129:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:130:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:133:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:134:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:149:  scope: MemoryScopeMatch = {},
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:174:      scope,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:131:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:132:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:133:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:135:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:177:  tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:178:  userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:179:  agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:181:  sharedSpaceId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:171:  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:203:                limit: (opts.limit ?? 3) * 3, // Over-fetch for post-scope-filter
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:208:              // Post-filter by governance scope to prevent cross-tenant reconsolidation
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:209:              const scopeFiltered = results.filter((r: Record<string, unknown>) => {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:210:                if (scope?.tenantId && r.tenant_id && r.tenant_id !== scope.tenantId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:211:                if (scope?.userId && r.user_id && r.user_id !== scope.userId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:212:                if (scope?.agentId && r.agent_id && r.agent_id !== scope.agentId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:213:                if (scope?.sharedSpaceId && r.shared_space_id && r.shared_space_id !== scope.sharedSpaceId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:216:              return scopeFiltered.map((r: Record<string, unknown>) => ({
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:19:  ['tenant_id', 'tenantId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:20:  ['user_id', 'userId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:21:  ['agent_id', 'agentId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:23:  ['shared_space_id', 'sharedSpaceId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:52:function buildScopedWhereClauses(scope: MemoryScopeMatch): {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:57:    tenantId: normalizeScopeMatchValue(scope.tenantId),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:58:    userId: normalizeScopeMatchValue(scope.userId),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:59:    agentId: normalizeScopeMatchValue(scope.agentId),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:60:    sessionId: normalizeScopeMatchValue(scope.sessionId),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:61:    sharedSpaceId: normalizeScopeMatchValue(scope.sharedSpaceId),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:84:  scopeClauses: string[],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:85:  scopeParams: string[],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:91:    ...scopeClauses,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:103:    ...scopeParams,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:189:  scope: MemoryScopeMatch = {},
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:191:  const { clauses: scopeClauses, params: scopeParams } = buildScopedWhereClauses(scope);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:198:      scopeClauses,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:199:      scopeParams,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:210:        scopeClauses,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:211:        scopeParams,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:251:  scope: MemoryScopeMatch = {},
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:254:    const { clauses: scopeClauses, params: scopeParams } = buildScopedWhereClauses(scope);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:260:      ...scopeClauses,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:266:      ...scopeParams,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:294:      console.error(`[memory-save] T054: Duplicate content detected (hash match id=${duplicateByHash.id}), skipping embedding`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:304:        message: `Duplicate content detected: identical to existing memory #${duplicateByHash.id} (${duplicateByHash.file_path}). Skipping embedding generation.`,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:35:  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:45:      tenantId: scope?.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:46:      userId: scope?.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:47:      agentId: scope?.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:48:      sessionId: scope?.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:49:      sharedSpaceId: scope?.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:117:        // H1 FIX: Use db-specific invalidation instead of the no-op global version
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:181:            console.warn(`[memory-crud-update] BM25 infrastructure unavailable, skipping re-index [requestId=${requestId}]: ${bm25ErrMsg}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:4:// Phase 020: Composite MCP tool that merges memory resume context,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:5:// code graph status, and CocoIndex availability into a single call.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:9:import { isCocoIndexAvailable } from '../lib/utils/cocoindex-path.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:81:    | 'scope_mismatch'
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:82:    | 'unknown_scope';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:101:interface CocoIndexStatus {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:109:  cocoIndex: CocoIndexStatus;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:306:        'unknown_scope',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:307:        'A target spec folder was requested, but the cached summary did not carry a scope anchor.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:314:        'scope_mismatch',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:315:        `Cached summary scope ${cachedSpecFolder} did not match requested scope ${expectedSpecFolder}.`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:321:      'unknown_scope',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:322:      'Cached summary scope was unknown, so the consumer failed closed instead of guessing.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:360:      scope: {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:405:  // Phase 024: Record bootstrap telemetry
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:409:  // ── Sub-call 1: Memory context resume (skip in minimal mode) ──
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:416:        input: 'resume previous work continue session',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:417:        mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:418:        profile: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:462:  // ── Sub-call 3: CocoIndex availability (F046/F051: shared helper) ──
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:463:  const cocoIndex: CocoIndexStatus = {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:464:    available: isCocoIndexAvailable(),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:468:    hints.push('CocoIndex not installed. Install: `bash .opencode/skill/mcp-coco-index/scripts/install.sh`');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:471:  // Phase 027: Structural bootstrap contract for resume surface
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:479:  // Keep live resume authoritative; cached continuity only appends bounded notes when every gate passes.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:485:    hints.push('Cached continuity summary accepted as additive resume context.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:511:      key: 'memory-resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:541:      title: 'CocoIndex Status',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:560:    kind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:591:      resumePayload: payloadContract,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:599:  // Phase 024 / Item 9: Record bootstrap telemetry
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:64:function findSimilarMemories(embedding: Float32Array | null, options: { limit?: number; specFolder?: string | null; tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null } = {}): SimilarMemory[] {
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:65:  const { limit = 5, specFolder = null, tenantId = null, userId = null, agentId = null, sessionId = null, sharedSpaceId = null } = options;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:79:    const scopedMatches: SimilarMemory[] = [];
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:84:    while (scopedMatches.length < limit) {
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:98:        if (!matchesScopedValue(tenantId, r.tenant_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:99:        if (!matchesScopedValue(userId, r.user_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:100:        if (!matchesScopedValue(agentId, r.agent_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:103:        if (!matchesScopedValue(sharedSpaceId, r.shared_space_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:107:        scopedMatches.push({
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:120:        if (scopedMatches.length >= limit) {
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:134:    return scopedMatches.slice(0, limit);
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:335:      console.warn('[PE-Gate] memory_conflicts table not yet created, skipping log');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:80:type SessionResumeModule = typeof import('./session-resume.js');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:81:type SessionBootstrapModule = typeof import('./session-bootstrap.js');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:208:    sessionResumeModule = loadHandlerModule<SessionResumeModule>('session-resume');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:215:    sessionBootstrapModule = loadHandlerModule<SessionBootstrapModule>('session-bootstrap');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:222:export const handle_memory_search = lazyFunction(getMemorySearchModule, 'handle_memory_search');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:226:export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:320:export const handle_memory_context = lazyFunction(getMemoryContextModule, 'handle_memory_context');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:331:// Session resume handler
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:334:// Session bootstrap handler
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:194:// M2 FIX: Track schema init per database instance, not as a process-global boolean.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:195:// If the server swaps to a fresh DB connection, the old global would skip init.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:560:    interpretation = 'Knowledge regression detected - may indicate scope expansion or new complexities discovered';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:101:  // Phase 027: Structural bootstrap contract for health surface
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:128:    hints.push('No tool calls in >60 min. Consider calling `memory_context` to refresh session state.');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:39:    .replace(/\n{2,}/g, '\n')                   // collapse blank lines left by stripping
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
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:194:  // Phase 027: Structural bootstrap contract
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:202:  const cachedSummary = extractCachedSummary(resumeData);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:204:    allHints.push('Cached continuity summary accepted as additive bootstrap context.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:214:  // Record bootstrap telemetry once for the composite call.
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
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:280:      // which remains valid even when the remote resume surface fails closed.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:289:      content: buildNextActions(resumeData, healthData, structuralContext).join(' | '),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:296:    kind: 'bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:299:      { label: 'resume', certainty: resumeCertainty },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:311:      sourceRefs: ['session-resume', 'session-health', 'session-snapshot'],
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:324:    resume: resumeWithTrust,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:331:      bootstrapPayload: payloadContract,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:332:      resumePayload,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:338:    // Keep advisory routing guidance out of nextActions so bootstrap and resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:339:    // remain the authoritative recovery owners for startup and deep resume flows.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:340:    nextActions: buildNextActions(resumeData, healthData, structuralContext),
.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts:16:    globals: true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:60:// Feature catalog: Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:61:// Feature catalog: Dual-scope memory auto-surface
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:79:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:80:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:81:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:82:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:87:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:97:  resumed: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:99:  resumedContextCount: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:116:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:117:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:118:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:119:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:124:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:127:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:146:  resumed: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:155:  resumeHeuristicApplied: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:386:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:397:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:439:  const compactStructuredResult = (
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:526:        // Phase 1: Adaptive content truncation — truncate content fields before dropping results
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:593:        const compacted = compactStructuredResult(innerEnvelope, currentResults, contentArr);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:594:        if (compacted) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:596:            result: compacted.result,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:599:              actualTokens: compacted.actualTokens,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:674:  resume: {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:677:    strategy: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:704:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:705:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:706:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:707:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:725:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:726:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:727:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:728:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:756:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:757:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:758:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:759:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:784:  const resumeAnchors = options.anchors || ['state', 'next-steps', 'summary', 'blockers'];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:787:    query: input || 'resume work continue session',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:790:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:791:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:792:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:793:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:798:    anchors: resumeAnchors,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:810:    strategy: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:811:    mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:812:    resumeAnchors: resumeAnchors,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:827:  // Security: session scope derived from server context, not caller input
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:829:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:830:    userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:831:    agentId: args.agentId,
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
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1078:/** Handle memory_context tool — L1 orchestration layer that routes to optimal retrieval strategy.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1092:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1117:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1142:  if (requested_mode !== 'resume') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1224:    resumed: resumedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1231:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1244:    resumed: resumedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1246:    resumedContextCount: 0,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1250:  const layerInfo: LayerInfo | null = layerDefs.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1281:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1282:    userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1283:    agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1284:    sharedSpaceId: args.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1305:      resumed: resumedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1314:    resumeHeuristicApplied,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1318:  // Phase C: Intent-to-profile auto-routing for memory_context.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1338:    resumedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1343:    queryHeuristicApplied: resumeHeuristicApplied,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1354:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1355:    userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1356:    agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1375:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1393:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1425:  // M1 FIX: Inject auto-resume context BEFORE budget enforcement
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1434:  if (autoResumeEnabled && effectiveMode === 'resume' && resumedSession) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1435:    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1436:    if (resumeContextItems.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1437:      sessionLifecycle.resumedContextCount = resumeContextItems.length;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1438:      (tracedResult0 as Record<string, unknown>).systemPromptContext = resumeContextItems.map((item) => ({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1471:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1478:      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1497:        resumeHeuristicApplied,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1583:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1584:      error: 'memory_context failed due to an internal error',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1606:const handle_memory_context = handleMemoryContext;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1609:  handle_memory_context,
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:125:- startup and resume surfaces report freshness-aware graph status (`fresh`, `stale`, `empty`, `error`)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:137:| Codex | `.codex/config.toml` | Checked-in MCP config. Bootstrap parity via `session_bootstrap` MCP tool, not a native SessionStart hook. |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:426:- `memory_context` (unified context retrieval)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:427:- `memory_search` (semantic search)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:428:- `memory_match_triggers` (fast trigger matching)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:437:- `session_bootstrap` (complete session bootstrap)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:438:- `session_resume` (combined session resume)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:443:Run session bootstrap, then query the code graph for symbols in .opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:447:- the startup or bootstrap response reports freshness-aware graph status
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:465:- [ ] `memory_search()` returns results (or empty if no memories are indexed yet)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:530:### memory_context: Unified Context Retrieval
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:532:`memory_context()` is the primary entry point for context loading. It detects task intent and routes to the optimal retrieval strategy automatically.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:539:- `resume`: Session recovery (loads previous state)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:548:### memory_search: Semantic Search
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:550:`memory_search()` runs vector-based similarity search across all indexed memories.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:559:### memory_match_triggers: Fast Keyword Lookup
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:561:`memory_match_triggers()` provides sub-50ms keyword-based matching. Use it for immediate context surfacing at the start of a conversation.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:596:When enabled, this feature adjusts the balance between vector similarity and keyword relevance based on the detected task type. It supports 7 task types: `add_feature`, `fix_bug`, `refactor`, `understand`, `plan`, `debug` and `resume`. For example, `fix_bug` boosts exact-match keyword signals while `understand` emphasizes semantic similarity.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:629:- `ContextEnvelope`: Wraps all `memory_context()` responses with metadata (mode used, memories returned, intent detected)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:681:**Behind the scenes:** The AI calls `memory_context()` with `mode: "resume"` and `anchors: ["state", "next-steps"]`, then returns the previous session state.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:692:1. AI calls `memory_context({ input: "add user profiles", mode: "auto" })`
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:708:3. Indexes changed or new files, skipping unchanged ones based on content hash
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:792:| Startup or resume shows graph `stale` | Freshness-aware startup detected drift before a structural read ran | Run a structural read to allow bounded inline repair, or run `code_graph_scan` for broader stale states |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1047:MCP TOOLS: memory_context, memory_search, memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1064:| v1.7.x | 2026-02-20 | Cross-encoder reranking enabled by default. Co-activation score boost fix. Query expansion on deep mode. Evidence gap warnings. MMR reranking with intent-mapped lambda. Phase system support (recursive validation, phase detection scoring). Feature flag updates. `memory_context` tokenUsage parameter. 28-tool surface area. |
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:12:| `context.ts` | `code_graph_context` | LLM-oriented compact graph neighborhoods |
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:65:import { normalizeScopeContext } from '../lib/governance/scope-governance.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:100:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:181:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:182:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:183:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:184:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:211:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:213:  /** Phase B T019: Dual-level retrieval — 'local' (entity), 'global' (community), 'auto' (local + fallback). */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:214:  retrievalLevel?: 'local' | 'global' | 'auto';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:340:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:498:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:499:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:500:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:501:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:529:    retrievalLevel: retrievalLevel = 'auto',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:533:  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:535:    tenantId: normalizedScope.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:536:    userId: normalizedScope.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:537:    agentId: normalizedScope.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:539:    sharedSpaceId: normalizedScope.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:551:    const resolved = resolveCursor(cursor.trim(), undefined, { scopeKey: progressiveScopeKey });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:554:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:555:        error: 'Cursor is invalid, expired, or out of scope',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:566:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:594:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:613:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:625:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:724:    tenantId: normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:725:    userId: normalizedScope.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:726:    agentId: normalizedScope.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:727:    sharedSpaceId: normalizedScope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:751:  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:781:      tenantId: normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:782:      userId: normalizedScope.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:783:      agentId: normalizedScope.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:784:      sharedSpaceId: normalizedScope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:818:      (retrievalLevel === 'global' || retrievalLevel === 'auto')
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:822:        (retrievalLevel === 'global') ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:823:        (resultsForFormatting.length < 3 && retrievalLevel === 'auto');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:992:      appliedBoosts.communityFallback = { applied: true, retrievalLevel };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1033:          { scopeKey: progressiveScopeKey },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1044:      toolCache.set(cacheKey, cachePayload, { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1095:      console.warn('[memory-search] Cached response shape mismatch: missing "data" object, skipping dedup');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1097:      console.warn('[memory-search] Cached response shape mismatch: "data.results" is not an array, skipping dedup');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1374:const handle_memory_search = handleMemorySearch;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1377:  handle_memory_search,
.opencode/skill/system-spec-kit/mcp_server/scripts/map-ground-truth-ids.ts:4:// MODULE: Ground Truth ID Mapping Compatibility Wrapper
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:30:- Shared spaces are tenant-scoped, deny-by-default collaboration containers.
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:33:- `shared_memory_enable` bootstraps the shared-memory subsystem and generates this README if it is missing.
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:41:| `shared_memory_enable` | First-run bootstrap and idempotent enablement |
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:42:| `shared_memory_status` | Caller-scoped rollout and membership view; requires exactly one actor identity |
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:43:| `shared_space_upsert` | Create or update a shared space; requires caller auth and tenant scope |
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:44:| `shared_space_membership_set` | Set deny-by-default membership for a user or agent; requires caller auth and tenant scope |
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts:2:// MODULE: CocoIndex Re-index Handler
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts:26:            error: 'CocoIndex binary not found. Install: bash .opencode/skill/mcp-coco-index/scripts/install.sh',
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:4:// Dispatch for L1 Orchestration tool: memory_context (T303).
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:11:export const TOOL_NAMES = new Set(['memory_context']);
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:16:    case 'memory_context': return handleMemoryContext(parseArgs<ContextArgs>(validateToolArgs('memory_context', args)));
.opencode/skill/system-spec-kit/mcp_server/api/README.md:33:| `indexing.ts` | Runtime bootstrap, embedding warmup, memory index scan, and shutdown helpers |
.opencode/skill/system-spec-kit/mcp_server/README.md:9:  - "memory_context"
.opencode/skill/system-spec-kit/mcp_server/README.md:10:  - "memory_search"
.opencode/skill/system-spec-kit/mcp_server/README.md:55:| **MCP tools** | 47 | Organized across core memory layers plus dedicated code-graph and CocoIndex dispatch groups |
.opencode/skill/system-spec-kit/mcp_server/README.md:56:| **Search channels** | 5 core + CocoIndex bridge | Vector, FTS5, BM25, Causal Graph, Degree (+ CocoIndex semantic code search as external bridge) |
.opencode/skill/system-spec-kit/mcp_server/README.md:62:| **Retrieval modes** | 5 | auto, quick, deep, focused, resume |
.opencode/skill/system-spec-kit/mcp_server/README.md:69:| **Search** | Vector similarity only | 5 core channels + CocoIndex bridge, fused with Reciprocal Rank Fusion (K tuned per intent) |
.opencode/skill/system-spec-kit/mcp_server/README.md:70:| **Routing** | No routing | Graph-first structural routing: Code Graph -> CocoIndex -> Memory; 3-tier FTS fallback when graph/semantic miss |
.opencode/skill/system-spec-kit/mcp_server/README.md:85:The memory system exposes 47 MCP tools through 4 memory slash commands plus the borrowed recovery workflow in `/spec_kit:resume`. Think of commands as doors into the system. Each door opens access only to the tools it needs.
.opencode/skill/system-spec-kit/mcp_server/README.md:93:| `/spec_kit:resume` | Continue or recover an interrupted spec-folder session through the broader memory/session recovery stack | Broad helper surface; primary chain uses 3 shared memory tools |
.opencode/skill/system-spec-kit/mcp_server/README.md:200:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:227:**Five core search channels** work together, with **CocoIndex** available as an external semantic code search bridge:
.opencode/skill/system-spec-kit/mcp_server/README.md:236:| **CocoIndex** *(bridge)* | Semantic code search via vector embeddings across source files | Finding code implementations when memory channels miss; concept-first code discovery |
.opencode/skill/system-spec-kit/mcp_server/README.md:238:**Graph-first routing** determines query dispatch order: structural queries route to the Code Graph first, then CocoIndex for semantic code discovery, then the 5-channel memory pipeline. This avoids forcing one search system to handle both structural relationships and semantic similarity.
.opencode/skill/system-spec-kit/mcp_server/README.md:266:**Stage 1 -- Gather candidates** using graph-first routing: structural queries dispatch to Code Graph first, then CocoIndex for semantic code discovery, then the memory pipeline's active channels in parallel. Constitutional-tier memories are always injected regardless of score.
.opencode/skill/system-spec-kit/mcp_server/README.md:313:- **LLM query reformulation** -- asks the LLM to rephrase the query more abstractly, grounding in actual knowledge base content. Reformulated hits pass through the same scope, context and quality checks as ordinary results
.opencode/skill/system-spec-kit/mcp_server/README.md:400:This is session-scoped to prevent cross-session interference.
.opencode/skill/system-spec-kit/mcp_server/README.md:412:**Signal vocabulary expansion** -- recognizes correction signals ("actually", "wait") and preference signals ("prefer", "want") in your language, shaping quality scoring.
.opencode/skill/system-spec-kit/mcp_server/README.md:475:**Constitutional memory as expert knowledge injection** -- tags high-priority memories with instructions about when to surface. They appear whenever relevant without you asking, like sticky notes on a filing cabinet that say "pull this file whenever someone asks about X." Constitutional injections obey global scope enforcement so the wrong tenant's rules never leak.
.opencode/skill/system-spec-kit/mcp_server/README.md:479:**Dual-scope memory auto-surface** -- watches for tool use and context compression events and automatically brings up important memories without being asked.
.opencode/skill/system-spec-kit/mcp_server/README.md:517:**12-metric core computation** -- grades every query across twelve quality dimensions (MRR@1/3/10, NDCG@10, MAP and more). Together they pinpoint exactly where search is struggling, like a doctor running multiple tests instead of just asking "do you feel sick?"
.opencode/skill/system-spec-kit/mcp_server/README.md:535:**Architecture:** CocoIndex (semantic, external MCP) finds code by concept. Code Graph (structural, this server) maps imports, calls and hierarchy. Memory (session, this server) preserves decisions. The compact-merger combines all three under a 4000-token budget for compaction injection.
.opencode/skill/system-spec-kit/mcp_server/README.md:545:**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.
.opencode/skill/system-spec-kit/mcp_server/README.md:547:**Query routing:** Structural queries (callers, imports, dependencies) go to `code_graph_query`. Semantic and concept queries go to CocoIndex (`mcp__cocoindex_code__search`). Session and memory queries go to `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/README.md:557:**Start here for most tasks**: `memory_context` (L1) automatically figures out what you need. Use the lower-level tools when you want precise control.
.opencode/skill/system-spec-kit/mcp_server/README.md:563:##### `memory_context`
.opencode/skill/system-spec-kit/mcp_server/README.md:570:| `mode` | string | `auto` (default), `quick`, `deep`, `focused`, `resume` |
.opencode/skill/system-spec-kit/mcp_server/README.md:573:| `tenantId` | string | Tenant boundary for governed retrieval |
.opencode/skill/system-spec-kit/mcp_server/README.md:574:| `userId` | string | User boundary for governed retrieval |
.opencode/skill/system-spec-kit/mcp_server/README.md:575:| `agentId` | string | Agent boundary for governed retrieval |
.opencode/skill/system-spec-kit/mcp_server/README.md:576:| `sharedSpaceId` | string | Shared-space boundary for governed retrieval |
.opencode/skill/system-spec-kit/mcp_server/README.md:587:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:599:##### `session_resume`
.opencode/skill/system-spec-kit/mcp_server/README.md:601:Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.
.opencode/skill/system-spec-kit/mcp_server/README.md:605:| `specFolder` | string | Scope resume to a specific spec folder |
.opencode/skill/system-spec-kit/mcp_server/README.md:606:| `minimal` | boolean | Skip heavy memory context, return code graph, CocoIndex, structural context, hints, and optional session quality without the full memory payload |
.opencode/skill/system-spec-kit/mcp_server/README.md:610:##### `session_bootstrap`
.opencode/skill/system-spec-kit/mcp_server/README.md:612:Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.
.opencode/skill/system-spec-kit/mcp_server/README.md:616:| `specFolder` | string | Scope bootstrap to a specific spec folder |
.opencode/skill/system-spec-kit/mcp_server/README.md:622:##### `memory_search`
.opencode/skill/system-spec-kit/mcp_server/README.md:631:| `tenantId` | string | Tenant boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:632:| `userId` | string | User boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:633:| `agentId` | string | Agent boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:634:| `sharedSpaceId` | string | Shared-memory boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:646:  "tool": "memory_search",
.opencode/skill/system-spec-kit/mcp_server/README.md:660:The lightweight search option. Works like a preset: you provide a query and optional scope boundaries and it forwards to the full search tool with sensible defaults. Use this when you want fast results without setting lots of parameters.
.opencode/skill/system-spec-kit/mcp_server/README.md:666:| `tenantId` | string | Tenant boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:667:| `userId` | string | User boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:668:| `agentId` | string | Agent boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:669:| `sharedSpaceId` | string | Shared-memory boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:674:##### `memory_match_triggers`
.opencode/skill/system-spec-kit/mcp_server/README.md:688:  "tool": "memory_match_triggers",
.opencode/skill/system-spec-kit/mcp_server/README.md:713:| `tenantId` | string | Governance: tenant scope |
.opencode/skill/system-spec-kit/mcp_server/README.md:714:| `userId` | string | Governance: user attribution |
.opencode/skill/system-spec-kit/mcp_server/README.md:715:| `agentId` | string | Governance: agent attribution |
.opencode/skill/system-spec-kit/mcp_server/README.md:716:| `sharedSpaceId` | string | Governance: shared-space target |
.opencode/skill/system-spec-kit/mcp_server/README.md:832:The cleanup tool for large-scale housekeeping. Delete all outdated or temporary memories in one go based on their importance level, like clearing out the recycling bin. The most important memories get extra protection. A safety checkpoint is created first so you can restore if needed.
.opencode/skill/system-spec-kit/mcp_server/README.md:898:| `tenantId` | string | **Required.** Tenant scope |
.opencode/skill/system-spec-kit/mcp_server/README.md:915:| `tenantId` | string | **Required.** Tenant boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:930:| `tenantId` | string | Filter by tenant |
.opencode/skill/system-spec-kit/mcp_server/README.md:931:| `userId` | string | Filter by user |
.opencode/skill/system-spec-kit/mcp_server/README.md:932:| `agentId` | string | Filter by agent |
.opencode/skill/system-spec-kit/mcp_server/README.md:1016:| _(none required)_ | | Returns global stats |
.opencode/skill/system-spec-kit/mcp_server/README.md:1042:The MCP handler scores chunk-backed hits against `parentMemoryId ?? row.id`, so eval rows stay attached to canonical parent memories. Before comparing runs after a DB rebuild or import, preview or refresh the live ground-truth mapping with `scripts/evals/map-ground-truth-ids.ts`; if token-budget overflow collapses a run below `recallK`, treat that run as investigation-only rather than a clean benchmark.
.opencode/skill/system-spec-kit/mcp_server/README.md:1077:Get LLM-oriented compact graph neighborhoods. Accepts CocoIndex search results as seeds for structural expansion. Modes: `neighborhood` (1-hop calls plus imports), `outline` (file symbols), `impact` (reverse callers). Responses include a `readiness` block, and the handler may perform bounded inline selective reindex before answering when the graph is only lightly stale.
.opencode/skill/system-spec-kit/mcp_server/README.md:1084:| `seeds` | array | Seeds from CocoIndex, manual input or graph lookups |
.opencode/skill/system-spec-kit/mcp_server/README.md:1177:Check CocoIndex availability, binary path and index status.
.opencode/skill/system-spec-kit/mcp_server/README.md:1181:| _(none required)_ |  | Returns CocoIndex health |
.opencode/skill/system-spec-kit/mcp_server/README.md:1187:Trigger CocoIndex incremental or full re-indexing of the workspace.
.opencode/skill/system-spec-kit/mcp_server/README.md:1197:Submit quality feedback on CocoIndex search results to improve future searches.
.opencode/skill/system-spec-kit/mcp_server/README.md:1217:├── context-server.ts          # MCP entry point and runtime bootstrap
.opencode/skill/system-spec-kit/mcp_server/README.md:1227:├── hooks/                     # Session-start/compaction surfacing, mutation feedback, token-count sync
.opencode/skill/system-spec-kit/mcp_server/README.md:1230:├── shared-spaces/             # Documentation-only shared-memory surface
.opencode/skill/system-spec-kit/mcp_server/README.md:1244:| `context-server.ts` | Starts the MCP listener, performs runtime bootstrap, and registers all 47 tools. |
.opencode/skill/system-spec-kit/mcp_server/README.md:1326:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:1504:    "tenantId": "acme",
.opencode/skill/system-spec-kit/mcp_server/README.md:1518:    "tenantId": "acme",
.opencode/skill/system-spec-kit/mcp_server/README.md:1535:| Resume a session from scratch | `session_bootstrap` | Use as the first recovery call on session start or after `/clear` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1536:| Inspect the detailed merged resume payload | `session_resume` | Use when you want direct resume details without the full bootstrap wrapper |
.opencode/skill/system-spec-kit/mcp_server/README.md:1538:| Find a past decision | `memory_context` | Set `intent: "find_decision"` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1539:| Search for specific terms | `memory_search` | Use `concepts: ["term1", "term2"]` for AND search |
.opencode/skill/system-spec-kit/mcp_server/README.md:1540:| Check triggers on every prompt | `memory_match_triggers` | Pass the user's prompt text |
.opencode/skill/system-spec-kit/mcp_server/README.md:1556:**What you see**: Irrelevant or low-scoring results from `memory_search` or `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/README.md:1567:{ "tool": "memory_search", "arguments": { "query": "your query", "min_quality_score": 0.5 } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1717:Start with `memory_context` for all retrieval tasks. It handles intent detection and routing automatically. Use `memory_search` when you want explicit control over channels. Use `memory_match_triggers` when processing a raw prompt at the start of each turn. Use L4-L7 tools only for mutation, analysis or maintenance.
.opencode/skill/system-spec-kit/mcp_server/README.md:1744:| [lib/search/README.md](./lib/search/README.md) | Per-stage module mapping for the 4-stage search pipeline |
.opencode/skill/system-spec-kit/mcp_server/scripts/README.md:75:- Indexed scope follows current scan behavior, including memory, constitutional and spec-doc discovery defaults.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:92:  tenantId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:93:  userId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:94:  agentId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:102:  tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:103:  userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:104:  agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:159:  tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:160:  userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:161:  agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:331:  tenantId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:332:  userId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:333:  agentId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:351:    tenantId: normalizeIdentityValue(row.tenant_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:352:    userId: normalizeIdentityValue(row.user_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:353:    agentId: normalizeIdentityValue(row.agent_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:358:  storedIdentity: { tenantId: string | null; userId: string | null; agentId: string | null },
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:359:  scope: SessionIdentityScope = {},
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:361:  const requestedTenantId = normalizeIdentityValue(scope.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:362:  if (requestedTenantId && storedIdentity.tenantId !== requestedTenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:363:    return 'tenantId';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:366:  const requestedUserId = normalizeIdentityValue(scope.userId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:367:  if (requestedUserId && storedIdentity.userId !== requestedUserId) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:368:    return 'userId';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:371:  const requestedAgentId = normalizeIdentityValue(scope.agentId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:372:  if (requestedAgentId && storedIdentity.agentId !== requestedAgentId) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:373:    return 'agentId';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:380:  storedIdentity: { tenantId: string | null; userId: string | null; agentId: string | null } | null,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:381:): storedIdentity is { tenantId: string | null; userId: string | null; agentId: string | null } {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:382:  return Boolean(storedIdentity && (storedIdentity.tenantId || storedIdentity.userId || storedIdentity.agentId));
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:387:  scope: SessionIdentityScope = {},
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:420:  const mismatch = getIdentityMismatch(storedIdentity, scope);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:976:  'CREATE INDEX IF NOT EXISTS idx_session_state_identity_scope ON session_state(tenant_id, user_id, agent_id);',
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1030:    const tenantId = normalizeIdentityValue(state.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1031:    const userId = normalizeIdentityValue(state.userId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1032:    const agentId = normalizeIdentityValue(state.agentId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1064:      tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1065:      userId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1066:      agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1126:function recoverState(sessionId: string, scope: SessionIdentityScope = {}): RecoverResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1150:      tenantId: normalizeIdentityValue(row.tenant_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1151:      userId: normalizeIdentityValue(row.user_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1152:      agentId: normalizeIdentityValue(row.agent_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1154:    const mismatch = getIdentityMismatch(storedIdentity, scope);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1167:      tenantId: storedIdentity.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1168:      userId: storedIdentity.userId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1169:      agentId: storedIdentity.agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1193:function getInterruptedSessions(scope: SessionIdentityScope = {}): InterruptedSessionsResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1209:        tenantId: normalizeIdentityValue(row.tenant_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1210:        userId: normalizeIdentityValue(row.user_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1211:        agentId: normalizeIdentityValue(row.agent_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1213:      return getIdentityMismatch(storedIdentity, scope) === null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1260:  const resumeCommand = specFolder
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1261:    ? `/spec_kit:resume ${specFolder}`
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1263:      ? `memory_search({ sessionId: "${sessionId}" })`
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1264:      : 'memory_search({ query: "last session" })';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1269:> **Purpose:** Enable seamless session recovery after context compaction, crashes, or breaks.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1304:${resumeCommand}
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:4:// Dispatch for L2-L4 memory tools: search, triggers, save,
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:62:  'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:64:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:78:    case 'memory_search':         return handleMemorySearch(parseArgs<SearchArgs>(validateToolArgs('memory_search', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:80:      // E3: Delegate to memory_search with sensible defaults
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:86:        tenantId: validated.tenantId as string | undefined,
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:87:        userId: validated.userId as string | undefined,
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:88:        agentId: validated.agentId as string | undefined,
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:89:        sharedSpaceId: validated.sharedSpaceId as string | undefined,
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:99:    case 'memory_match_triggers': return handleMemoryMatchTriggers(parseArgs<TriggerArgs>(validateToolArgs('memory_match_triggers', args)));
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:5:import { isCocoIndexAvailable } from '../lib/utils/cocoindex-path.js';
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:71:  /** Phase 027: Structural bootstrap contract for non-hook runtimes */
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:86:  'memory_context',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:87:  'memory_search',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:89:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:95:// Token budgets for dual-scope lifecycle hooks (TM-05)
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:106:// Replaces the previous process-global boolean to avoid skipping priming
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:253:  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware'
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:290:      `(${tokenCount} > ${budgetLimit}); dropping payload`
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:315:    // Query top attention-weighted memories, scoped to the current session
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:368:  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware' = 'memory-aware'
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:451:  // F046: CocoIndex availability via shared helper (no process.cwd())
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:452:  const cocoIndexAvailable = isCocoIndexAvailable();
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:460:    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:463:    recommendedCalls.push('memory_match_triggers({ prompt: "<your task>" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:475:  // Phase 027: Structural bootstrap contract for auto-prime surface
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:482:      graphRetrieval: 'For broad topic questions, use memory_search with retrievalLevel: "global" for community-level results. For specific memories, use "local" (default). Use "auto" for automatic fallback.',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:522:    // Phase 024 / Item 9: Record bootstrap telemetry for MCP auto-priming
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:626: * Fires at session compaction lifecycle points. Surfaces memories relevant
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:628: * across the compaction boundary.
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:656:  return autoSurfaceMemories(sessionContext.trim(), COMPACTION_TOKEN_BUDGET, 'compaction');
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:93:1. User queries memory_search
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:102:**Purpose**: Zero data loss on MCP server crash or context compaction.
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:125:- Quick resume command
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:200:| Recover state | `recoverState(sessionId)` | On session resume |
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:101:  mode: z.enum(['auto', 'quick', 'deep', 'focused', 'resume']).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:104:  tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:105:  userId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:106:  agentId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:107:  sharedSpaceId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:112:  includeTrace: z.boolean().optional(), // CHK-040: Forward to internal memory_search
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:115:  profile: z.enum(['quick', 'research', 'resume', 'debug']).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:123:  tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:124:  userId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:125:  agentId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:126:  sharedSpaceId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:152:  profile: z.enum(['quick', 'research', 'resume', 'debug']).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:160:  tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:161:  userId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:162:  agentId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:163:  sharedSpaceId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:169:  tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:170:  userId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:171:  agentId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:172:  sharedSpaceId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:186:  // validated at runtime by scope-governance.ts (F3.04 fix).
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:187:  tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:188:  userId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:189:  agentId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:191:  sharedSpaceId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:205:  specFolder: optionalPathString().describe('Spec folder scope for bulk delete (requires confirm: true)'),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:268:  tenantId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:269:  userId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:270:  agentId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:271:  sharedSpaceId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:277:  tenantId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:278:  userId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:279:  agentId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:280:  sharedSpaceId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:286:  tenantId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:287:  userId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:288:  agentId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:289:  sharedSpaceId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:295:  tenantId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:296:  userId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:297:  agentId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:298:  sharedSpaceId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:397:  memory_context: memoryContextSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:398:  memory_search: memorySearchSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:400:  memory_match_triggers: memoryMatchTriggersSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:428:    tenantId: z.string(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:438:    tenantId: z.string(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:446:    tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:451:  session_bootstrap: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455:  session_resume: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:462:  memory_context: ['input', 'mode', 'intent', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:464:  memory_quick_search: ['query', 'limit', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:465:  memory_match_triggers: ['prompt', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'session_id', 'turnNumber', 'include_cognitive'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:466:  memory_save: ['filePath', 'force', 'dryRun', 'skipPreflight', 'asyncEmbedding', 'tenantId', 'userId', 'agentId', 'sessionId', 'sharedSpaceId', 'provenanceSource', 'provenanceActor', 'governedAt', 'retentionPolicy', 'deleteAfter'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:474:  checkpoint_create: ['name', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'metadata'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:475:  checkpoint_list: ['specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:476:  checkpoint_restore: ['name', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'clearExisting'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:477:  checkpoint_delete: ['name', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'confirmName'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:491:  shared_space_upsert: ['spaceId', 'tenantId', 'name', 'actorUserId', 'actorAgentId', 'rolloutEnabled', 'rolloutCohort', 'killSwitch'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:492:  shared_space_membership_set: ['spaceId', 'tenantId', 'actorUserId', 'actorAgentId', 'subjectType', 'subjectId', 'role'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:493:  shared_memory_status: ['tenantId', 'actorUserId', 'actorAgentId'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:495:  session_bootstrap: ['specFolder'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:497:  session_resume: ['specFolder', 'minimal'],
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:388: * The lease blocks overlapping scans via `scan_started_at` and preserves
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-feedback.ts:2:// MODULE: CocoIndex Feedback Handler
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:29:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:30:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:31:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:32:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:40:  profile?: 'quick' | 'research' | 'resume' | 'debug';
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:49:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:50:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:51:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:52:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:156:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:157:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:158:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:160:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:179:  tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:190:  tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:199:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:204:/** Arguments for session resume requests. */
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:210:/** Arguments for session bootstrap requests. */
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:219:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:220:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:221:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:222:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:229:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:230:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:231:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:232:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:239:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:240:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:241:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:242:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:249:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:250:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:251:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:252:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:61:  'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:62:  'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:82:    case 'session_resume':             return handleSessionResume(parseArgs<SessionResumeArgs>(validateToolArgs('session_resume', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:83:    case 'session_bootstrap':          return handleSessionBootstrap(parseArgs<SessionBootstrapArgs>(validateToolArgs('session_bootstrap', args)));
.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:5:// ARCH-1 exposes only the runtime bootstrap and indexing hooks needed
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:38:- `compact-inject.ts` — PreCompact: precomputes context, caches to temp state
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:70:- `MEMORY_AWARE_TOOLS` currently includes `memory_context`, `memory_search`, `memory_match_triggers`, `memory_list`, `memory_save`, and `memory_index_scan`.
.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts:198:    scopeDimensionsTracked: rollout.scopeDimensionsTracked,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:6:// single object for buildServerInstructions() and agent bootstrap.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:12:import { isCocoIndexAvailable } from '../utils/cocoindex-path.js';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:155:  // CocoIndex availability
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:158:    cocoIndexAvailable = isCocoIndexAvailable();
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:206: * Phase 027: Build a structural bootstrap contract for a given surface.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:208: * Keeps output compact (targets 250-400 tokens, ceiling 500).
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
.opencode/skill/system-spec-kit/mcp_server/tools/README.md:27:- `context-tools.ts` - dispatch for `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/tools/README.md:40:- `memory-tools.ts` implements the `memory_quick_search` delegation path by building a richer `memory_search` request and relabeling the returned envelope metadata back to `memory_quick_search`.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:2:// MODULE: CocoIndex Status Handler
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:4:// MCP tool handler for ccc_status — reports CocoIndex availability and stats.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:36:              ? 'Install CocoIndex: bash .opencode/skill/mcp-coco-index/scripts/install.sh'
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:39:                : 'CocoIndex is ready. Use mcp__cocoindex_code__search for semantic queries.',
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:5:// node/edge upsert with self-loop rejection and weight clamping.
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:44:  | 'bootstrap';
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:76:const bootstrapRecords: BootstrapRecord[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:115:    case 'bootstrap':
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:121:/** Phase 024 / Item 9: Record a bootstrap telemetry event. */
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:127:  bootstrapRecords.push({
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:135:/** Get all bootstrap records for diagnostics. */
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:137:  return bootstrapRecords;
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:224:  //   recovery (0.20)      — A memory_context({ mode: "resume" }) call is the most
.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:35:    '- CocoIndex: unknown',
.opencode/skill/system-spec-kit/mcp_server/formatters/README.md:3:description: "Response formatting for search results, anchor filtering metrics, and safe content shaping."
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:6:// based on the session source (compact, startup, resume, clear).
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:18:import { getCachedSessionSummaryDecision, logCachedSummaryDecision } from '../../handlers/session-resume.js';
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:42:/** Handle source=compact: inject cached PreCompact payload (from 3-source merger) */
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:47:    hookLog('warn', 'session-prime', `No cached compact payload for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:50:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:58:    hookLog('warn', 'session-prime', `Rejecting stale compact cache for session ${sessionId} (cached at ${cachedAt})`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:61:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:71:  hookLog('info', 'session-prime', `Injecting cached compact brief (${sanitizedPayload.length} chars after sanitization, cached at ${cachedAt})`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:77:      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:96:    `- Memory: ${hasCachedContinuity ? 'session continuity available' : 'startup summary only (resume on demand)'}`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:98:    '- CocoIndex: unknown',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:107:    `- Memory: ${hasCachedContinuity ? 'session continuity available' : 'startup summary only (resume on demand)'}`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:140:        '- `memory_context({ input, mode })` — unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:141:        '- `memory_match_triggers({ prompt })` — fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:142:        '- `memory_search({ query })` — semantic search',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:176:/** Handle source=resume: load resume context for continued session */
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:185:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:190:      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:202:      content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:224:    case 'compact':
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:232:    case 'resume':
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:258:  // Clear compact payload only AFTER stdout write succeeds to prevent
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:261:  if (source === 'compact') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:54:} from '../lib/governance/scope-governance.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:609:    scope?: MemoryScopeMatch;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:619:    scope = {},
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:707:      scope,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:721:      scope,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:751:              tenantId: scope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:752:              userId: scope.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:753:              agentId: scope.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:754:              sessionId: scope.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:755:              sharedSpaceId: scope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:800:    }, scope);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:809:      database, parsed, embedding, force, validation.warnings, embeddingStatus, filePath, scope,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:827:      scope,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:922:    }, scope);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:934:        scope,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:954:            scope,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1050:    scope = {} as MemoryScopeMatch,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1071:    scope,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1106:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1107:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1108:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1110:    sharedSpaceId,
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
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1436:      scope: saveScope,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1465:        tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1466:        userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1467:        agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1469:        sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1470:        reason: sharedSpaceId ? 'shared_space_save' : 'governed_ingest',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1474:      if (sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1483:        `).get(sharedSpaceId, validatedPath, result.id) as { id?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1486:            spaceId: sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:42:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:43:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:44:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:45:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:51:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:52:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:53:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:54:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:60:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:61:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:62:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:63:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:69:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:70:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:71:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:72:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:77:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:78:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:79:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:80:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:203:  const tenantId = validateValue(args.tenantId, 'tenantId', { trim: true });
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:204:  const userId = validateValue(args.userId, 'userId');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:205:  const agentId = validateValue(args.agentId, 'agentId');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:206:  const sharedSpaceId = validateValue(args.sharedSpaceId, 'sharedSpaceId');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:208:    userId !== undefined || agentId !== undefined || sharedSpaceId !== undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:212:    && tenantId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:213:    && tenantId.trim().length === 0
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:215:    throw new Error('tenantId must be a non-empty string when userId, agentId, or sharedSpaceId is provided');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:219:    tenantId: tenantId && tenantId.length > 0 ? tenantId : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:220:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:221:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:222:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:226:function hasCheckpointScope(scope: CheckpointScopeArgs): boolean {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:228:    scope.tenantId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:229:    || scope.userId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:230:    || scope.agentId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:231:    || scope.sharedSpaceId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:235:function requiresCheckpointTenant(scope: CheckpointScopeArgs): boolean {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:236:  return scope.tenantId === undefined && (
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:237:    scope.userId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:238:    || scope.agentId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:239:    || scope.sharedSpaceId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:245:  scope: CheckpointScopeArgs,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:249:    ...(scope.tenantId !== undefined ? { tenantId: scope.tenantId } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:250:    ...(scope.userId !== undefined ? { userId: scope.userId } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:251:    ...(scope.agentId !== undefined ? { agentId: scope.agentId } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:252:    ...(scope.sharedSpaceId !== undefined ? { sharedSpaceId: scope.sharedSpaceId } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:256:function checkpointMatchesScope(rawMetadata: unknown, scope: CheckpointScopeArgs): boolean {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:259:    const expected = scope[field];
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:268:    matchesScopeField('tenantId') &&
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:269:    matchesScopeField('userId') &&
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:270:    matchesScopeField('agentId') &&
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:271:    matchesScopeField('sharedSpaceId')
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:275:function checkpointScopeDetails(scope: CheckpointScopeArgs): Record<string, string> {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:277:  if (scope.tenantId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:278:    details.tenantId = scope.tenantId;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:280:  if (scope.userId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:281:    details.userId = scope.userId;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:283:  if (scope.agentId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:284:    details.agentId = scope.agentId;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:286:  if (scope.sharedSpaceId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:287:    details.sharedSpaceId = scope.sharedSpaceId;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:297:    error: 'tenantId is required when userId, agentId, or sharedSpaceId is provided.',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:300:      reason: 'checkpoint_scope_tenant_required',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:303:      hint: 'Retry with tenantId included for governed checkpoint access.',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:320:  const scope = validateCheckpointScope(args);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:321:  if (requiresCheckpointTenant(scope)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:336:    metadata: mergeCheckpointScopeMetadata(metadata, scope),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:337:    scope,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:381:  const scope = validateCheckpointScope(args);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:382:  if (requiresCheckpointTenant(scope)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:394:  const results = checkpoints.listCheckpoints(spec_folder ?? null, limit, scope);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:395:  const filteredResults = hasCheckpointScope(scope)
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:396:    ? results.filter((checkpoint) => checkpointMatchesScope(checkpoint.metadata, scope))
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:444:  const scope = validateCheckpointScope(args);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:445:  if (requiresCheckpointTenant(scope)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:453:  if (hasCheckpointScope(scope)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:454:    const checkpoint = checkpoints.getCheckpoint(name, scope);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:455:    if (checkpoint && !checkpointMatchesScope(checkpoint.metadata, scope)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:458:        error: `Checkpoint "${name}" scope mismatch`,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:462:          scope: checkpointScopeDetails(scope),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:465:          hint: 'Retry with matching scope values or omit optional scope parameters if you intend to access an unscoped checkpoint.',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:466:          actions: ['Use checkpoint_list() with the same scope parameters to discover accessible checkpoints'],
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:473:  const result = checkpoints.restoreCheckpoint(name, clear_existing, scope);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:537:          'Retry with a narrower scope or clearExisting=true if you intend to replace current state',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:587:  const scope = validateCheckpointScope(args);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:588:  if (requiresCheckpointTenant(scope)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:602:  if (hasCheckpointScope(scope)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:603:    const checkpoint = checkpoints.getCheckpoint(name, scope);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:604:    if (checkpoint && !checkpointMatchesScope(checkpoint.metadata, scope)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:607:        error: `Checkpoint "${name}" scope mismatch`,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:611:          scope: checkpointScopeDetails(scope),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:614:          hint: 'Retry with matching scope values or omit optional scope parameters if you intend to access an unscoped checkpoint.',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:615:          actions: ['Use checkpoint_list() with the same scope parameters to discover accessible checkpoints'],
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:622:  const success: boolean = checkpoints.deleteCheckpoint(name, scope);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:346:    // T72 SECURITY: Spec-folder scope MUST fail closed — any error in scope
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:347:    // resolution returns [] rather than leaking unscoped BM25 candidates.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:351:        const error = new Error('Database unavailable for spec-folder scope lookup');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:352:        console.warn('[BM25] Spec-folder scope lookup failed, returning empty scoped results:', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:370:        console.warn('[BM25] Spec-folder scope lookup failed, returning empty scoped results:', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:376:      // Fail closed rather than falling through to unscoped results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:378:        const error = new Error('specFolderMap unexpectedly null after scope resolution');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:379:        console.warn('[BM25] Spec-folder scope lookup failed, returning empty scoped results:', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1384:  // C138/T316: MMR reranking with request-scoped embedding cache.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1902:  const scopeParts = memoryIdx >= 0 ? parts.slice(0, memoryIdx) : parts.slice(0, -1);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1903:  const tailParts = scopeParts.slice(-2);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2078: * Merge two result arrays, deduplicating by id and keeping the higher score.
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:416:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:709:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:90: * reliable retrieval via the `memory_match_triggers` tool. The scoring
.opencode/skill/system-spec-kit/mcp_server/cli.ts:112:    [--folder <spec-folder>]       Optional: scope to a spec folder
.opencode/skill/system-spec-kit/mcp_server/cli.ts:270:  // Safety: refuse constitutional/critical without folder scope
.opencode/skill/system-spec-kit/mcp_server/cli.ts:272:    console.error(`ERROR: Bulk delete of "${tier}" tier requires --folder scope for safety.`);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:7:// BeforeAgent compact-inject hook.
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:90:/** Build compact context from transcript analysis */
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:124:    hookLog('warn', 'gemini:compact-cache', 'No stdin input received');
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:129:  hookLog('info', 'gemini:compact-cache', `PreCompress triggered for session ${sessionId} (trigger: ${input.trigger ?? 'unknown'})`);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:134:    hookLog('info', 'gemini:compact-cache', `Read ${transcriptLines.length} transcript lines`);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:149:        ? 'Recovered compact transcript lines were removed before fallback compaction cache assembly.'
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:150:        : 'No recovered compact transcript lines detected in fallback compaction cache assembly.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:163:        kind: 'compaction',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:165:          key: 'fallback-compact-context',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:170:        summary: 'Fallback compaction cache assembled from sanitized transcript tail',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:173:          sourceSurface: 'gemini-compact-cache',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:177:          sourceRefs: ['gemini-compact-cache', 'hook-state'],
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:184:  hookLog('info', 'gemini:compact-cache', `Cached compact context (${payload.length} chars) for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:189:  hookLog('error', 'gemini:compact-cache', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:92:function matchesScope(state: HookState, scope: HookStateScope): boolean {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:93:  if (scope.specFolder && state.lastSpecFolder !== scope.specFolder) {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:97:  if (scope.claudeSessionId && state.claudeSessionId !== scope.claudeSessionId) {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:107: * older than maxAgeMs, or when the caller cannot prove scope.
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:112:    scope?: HookStateScope;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:116:  const scope = options.scope;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:117:  const hasScope = Boolean(scope?.specFolder || scope?.claudeSessionId);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:125:        reason: 'scope_unknown_fail_closed',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:149:      if (!matchesScope(state, scope!)) {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:184:/** Read pending compact prime without clearing it from state */
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:190:/** Clear pending compact prime from state (call after stdout write confirmed) */
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:203:    hookLog('warn', 'state', `Failed to clear pending compact payload for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:208: * Read pending compact prime, clear it from state, and return the cached value.
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:25:interface CausalLinkMapping {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:66:const CAUSAL_LINK_MAPPINGS: Record<string, CausalLinkMapping> = {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:371:    const mapping = CAUSAL_LINK_MAPPINGS[link_type];
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:372:    if (!mapping) {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:398:      const edgeSourceId = mapping.reverse ? String(resolvedId) : memoryIdStr;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:399:      const edgeTargetId = mapping.reverse ? memoryIdStr : String(resolvedId);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:402:        causalEdges.insertEdge(edgeSourceId, edgeTargetId, mapping.relation, 1.0, `Auto-extracted from ${link_type} in memory file`);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:404:        console.error(`[causal-links] Inserted edge: ${edgeSourceId} -[${mapping.relation}]-> ${edgeTargetId}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:408:          console.error(`[causal-links] Edge already exists: ${edgeSourceId} -[${mapping.relation}]-> ${edgeTargetId}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:435:  CausalLinkMapping,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:33:      hookLog('warn', 'gemini:session-stop', `Transcript too large (${stat.size} bytes > ${MAX_TRANSCRIPT_BYTES}); skipping spec folder detection`);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:10://   source: "startup" | "resume" | "clear"
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:43:/** Handle source=compact (post-compress): inject cached PreCompress payload */
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:48:    hookLog('warn', 'gemini:session-prime', `No cached compact payload for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:51:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:59:    hookLog('warn', 'gemini:session-prime', `Rejecting stale compact cache (cached at ${cachedAt})`);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:62:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:66:  hookLog('info', 'gemini:session-prime', `Injecting cached compact brief (${payload.length} chars, cached at ${cachedAt})`);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:73:      content: 'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:98:        '- CocoIndex: unknown',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:106:        '- `memory_context({ input, mode })` - unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:107:        '- `memory_match_triggers({ prompt })` - fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:108:        '- `memory_search({ query })` - semantic search',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:142:/** Handle source=resume: load resume context */
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:149:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:155:    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:163:    content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:184:    case 'compact':
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:185:      // Gemini doesn't have a native compact source, but we handle it
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:186:      // in case BeforeAgent injects a one-shot compact recovery
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:194:    case 'resume':
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:210:  // Clear compact payload only AFTER stdout write succeeds.
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:213:  if (source === 'compact') {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:9:| `compact-inject.ts` | PreCompact | Precomputes context from transcript, caches to hook state |
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:10:| `session-prime.ts` | SessionStart | Injects context via stdout based on source (compact/startup/resume/clear) |
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:19:PreCompact → cache context → SessionStart(compact) → inject cached context
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:21:SessionStart(resume) → load prior session state
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:31:Hooks are transport reliability, not separate business logic. They call the same retrieval primitives (`memory_match_triggers`, `memory_context`) that other runtimes call explicitly.
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/shared.ts:16:  // SessionStart fields (Gemini has startup/resume/clear; no native compact source)
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/shared.ts:17:  source?: 'startup' | 'resume' | 'clear' | string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:68:          // Enforce optional specFolder scope before including a candidate file.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:47:- `code-graph/context.ts` - `code_graph_context`: LLM-oriented compact graph neighborhoods.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:54:- `handler-utils.ts`, `types.ts` - Shared handler helpers and domain typing.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:67:- `shared-memory.ts` exports `resolveAdminActor()` and `validateCallerAuth()` so shared-space mutations enforce explicit actor identity, tenant scope, and configured admin ownership.
.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:182:  // --- Intent-to-edge priority mapping ---
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts:43: * The damping factor `1/sqrt(M+1)` prevents large folders from
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts:80:    const dampingFactor = 1 / Math.sqrt(M + 1);
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts:82:    folderScores.set(folder, dampingFactor * scoreSum);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:5:// Runs on Gemini CLI BeforeAgent event. Checks for cached compact
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:30:    hookLog('warn', 'gemini:compact-inject', 'No stdin input received');
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:36:  // One-shot: only inject if there's a pending compact payload
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:48:    hookLog('warn', 'gemini:compact-inject', `Rejecting stale compact cache (cached at ${cachedAt})`);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:55:  hookLog('info', 'gemini:compact-inject', `Injecting cached compact brief (${sanitizedPayload.length} chars, cached at ${cachedAt})`);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:63:    'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:74:  // Clear compact payload only AFTER stdout write succeeds
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:77:  hookLog('info', 'gemini:compact-inject', `Injected ${rawOutput.length} chars for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:82:  hookLog('error', 'gemini:compact-inject', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:6:// using the 3-source merge pipeline (Memory, Code Graph, CocoIndex)
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:17:import { mergeCompactBrief } from '../../lib/code-graph/compact-merger.js';
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:18:import type { MergeInput } from '../../lib/code-graph/compact-merger.js';
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:126:/** Build compact context from transcript analysis (legacy fallback) */
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:146:  // Hint for AI to use CocoIndex for semantic neighbors after recovery
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:148:    sections.push('## Semantic Context (CocoIndex)\nUse `mcp__cocoindex_code__search` to find semantic neighbors of active files listed above.');
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:260:        ? 'Recovered compact transcript lines were removed before pre-merge selection.'
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:261:        : 'No recovered compact transcript lines detected in the current tail.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:285:    hookLog('warn', 'compact-inject', `Merge pipeline took ${elapsed.toFixed(0)}ms (budget: ${HOOK_TIMEOUT_MS}ms)`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:287:    hookLog('info', 'compact-inject', `Merge pipeline completed in ${elapsed.toFixed(0)}ms (${merged.metadata.sourceCount} sections, ~${merged.metadata.totalTokenEstimate} tokens)`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:297:    'compact-inject',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:345:        ? 'Recovered compact transcript lines were removed before pre-merge selection.'
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:346:        : 'No recovered compact transcript lines detected in the current tail.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:374:    hookLog('warn', 'compact-inject', 'No stdin input received');
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:379:  hookLog('info', 'compact-inject', `PreCompact triggered for session ${sessionId} (trigger: ${input.trigger ?? 'unknown'})`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:384:    hookLog('info', 'compact-inject', `Read ${transcriptLines.length} transcript lines`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:402:            sourceSurface: 'compact-cache',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:408:    hookLog('info', 'compact-inject', `Cached compact context (${payload.length} chars) for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:411:    hookLog('warn', 'compact-inject', `Merge pipeline failed, falling back to legacy: ${err instanceof Error ? err.message : String(err)}`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:424:  hookLog('info', 'compact-inject', `Cached compact context (${payload.length} chars) for session ${sessionId}`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:429:  hookLog('error', 'compact-inject', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:7:/** Token budget for compaction context injection */
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:9:/** Token budget for session priming (startup/resume) */
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:17:  source?: 'startup' | 'resume' | 'clear' | 'compact';
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:108:/** Add explicit provenance markers around recovered compact context */
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:116:    ? `[PROVENANCE: producer=${metadata.producer ?? 'hook-cache'}; trustState=${metadata.trustState ?? 'cached'}; sourceSurface=${metadata.sourceSurface ?? 'compact'}]`
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:33:describe('PE gating scoped similar-memory search', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:38:  it('expands the vector window until an in-scope match is found', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:58:            content_text: 'in-scope memory',
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:59:            file_path: '/specs/026-memory-database-refinement/in-scope.md',
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:68:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:76:        content: 'in-scope memory',
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:77:        file_path: '/specs/026-memory-database-refinement/in-scope.md',
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:96:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:83:      validateToolInputSchema('memory_context', {}, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:119:      validateToolInputSchema('memory_context', { input: 'resume', mode: 'invalid-mode' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:133:      validateToolArgs('memory_search', { query: 'valid query', unexpected: true } as Record<string, unknown>);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:137:    expect(errorSpy.mock.calls.some((call) => String(call[0]).includes('[schema-validation] memory_search:'))).toBe(true);
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
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:314:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:315:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:316:        agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:317:        sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:322:  it('public and runtime schemas accept response profiles for memory_search', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:329:      validateToolInputSchema('memory_search', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:331:    expect(validateToolArgs('memory_search', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:336:  it('public and runtime schemas accept governed scope fields for memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:338:      input: 'resume auth work',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:339:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:340:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:341:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:342:      sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:346:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:348:    expect(validateToolArgs('memory_context', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:351:  it('public and runtime schemas accept response profiles for memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:353:      input: 'resume auth work',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:354:      profile: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:358:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:360:    expect(validateToolArgs('memory_context', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:363:  it('public and runtime schemas accept governed scope fields for memory_quick_search', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:366:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:367:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:368:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:369:      sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:378:  it('public and runtime schemas accept governed scope fields for memory_match_triggers', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:380:      prompt: 'resume auth work',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:382:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:383:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:384:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:385:      sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:389:      validateToolInputSchema('memory_match_triggers', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:391:    expect(validateToolArgs('memory_match_triggers', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:413:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:444:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:457:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:391: * @param specFolder - Optional spec folder scope.
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:231:    hookLog('info', 'session-stop', 'Stop hook not active, skipping');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:169:  // Keep the UX contract tests focused on save-path response shaping.
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:281:  // Of truth for frontmatter stripping, handles CRLF via [\s\S]*? matching.
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:42:  name: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:43:  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:49:  name: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:50:  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires query (string), concepts (array of 2-5 strings), or cursor (string) for continuation pagination. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. When implicit feedback logging is enabled, searches also emit shadow-only feedback signals such as search_shown and, for includeContent runs, result_cited. Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:70:      tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval. When provided with scope enforcement, results are isolated to this tenant.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:71:      userId: { type: 'string', description: 'User boundary for governed retrieval. Filters private or shared-space user-scoped memories.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:72:      agentId: { type: 'string', description: 'Agent boundary for governed retrieval. Filters agent-scoped memories.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:73:      sharedSpaceId: { type: 'string', description: 'Shared-memory space identifier. Requires explicit membership when shared memory rollout is enabled.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:113:        enum: ['quick', 'research', 'resume', 'debug'],
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:190:// E3: Simplified search — 3 params, sensible defaults, delegates to memory_search
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:193:  description: '[L2:Core] Simplified search — query + optional limit + optional spec folder. Delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, limit 10). Use this when you want fast search without configuring 31 parameters.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:201:      tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:202:      userId: { type: 'string', description: 'User boundary for governed retrieval.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:203:      agentId: { type: 'string', description: 'Agent boundary for governed retrieval.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:204:      sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:211:  name: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:213:  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', minLength: 1, description: 'User prompt or text to match against trigger phrases' }, specFolder: { type: 'string', description: 'Limit trigger matches to a specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed trigger matching.' }, userId: { type: 'string', description: 'User boundary for governed trigger matching.' }, agentId: { type: 'string', description: 'Agent boundary for governed trigger matching.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed trigger matching.' }, limit: { type: 'number', default: 3, minimum: 1, maximum: 100, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', minimum: 1, description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:220:  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:247:        description: 'Report mode. full returns system diagnostics; divergent_aliases returns compact divergent alias triage output.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:321:  description: '[L4:Mutation] Bulk delete memories by importance tier. Use to clean up deprecated or temporary memories at scale. Auto-creates checkpoint before deletion for safety. Refuses unscoped deletion of constitutional/critical tiers. Supports optional checkpoint bypass for lower-risk tiers when speed is prioritized. Token Budget: 500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:322:  inputSchema: { type: 'object', additionalProperties: false, properties: { tier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Importance tier to delete (required)' }, specFolder: { type: 'string', description: 'Optional: scope deletion to a specific spec folder' }, confirm: { type: 'boolean', const: true, description: 'Required safety gate: must be true to proceed' }, olderThanDays: { type: 'number', minimum: MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS, description: 'Optional: only delete memories older than this many days' }, skipCheckpoint: { type: 'boolean', default: false, description: 'Optional speed optimization for non-critical tiers. When true, skips auto-checkpoint creation before delete. Rejected for constitutional/critical tiers.' } }, required: ['tier', 'confirm'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:335:      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:336:      userId: { type: 'string', minLength: 1, description: 'Scope to this user (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:337:      agentId: { type: 'string', minLength: 1, description: 'Scope to this agent (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:338:      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:353:      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:354:      userId: { type: 'string', minLength: 1, description: 'Scope to this user (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:355:      agentId: { type: 'string', minLength: 1, description: 'Scope to this agent (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:356:      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:370:      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:371:      userId: { type: 'string', minLength: 1, description: 'Scope to this user (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:372:      agentId: { type: 'string', minLength: 1, description: 'Scope to this agent (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:373:      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:388:      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:389:      userId: { type: 'string', minLength: 1, description: 'Scope to this user (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:390:      agentId: { type: 'string', minLength: 1, description: 'Scope to this agent (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:391:      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:402:const sharedSpaceUpsert: ToolDefinition = {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:410:      tenantId: { type: 'string', description: 'Owning tenant for the shared space.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:420:    required: ['spaceId', 'tenantId', 'name'],
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:424:const sharedSpaceMembershipSet: ToolDefinition = {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:432:      tenantId: { type: 'string', description: 'Tenant boundary for the membership mutation.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:439:    required: ['spaceId', 'tenantId', 'subjectType', 'subjectId', 'role'],
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:450:      tenantId: { type: 'string', description: 'Optional tenant filter applied to the authenticated caller scope.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:485:  description: '[L6:Analysis] Trace causal chain for a memory to answer "why was this decision made?" Traverses causal edges up to maxDepth hops, grouping results by relationship type (caused, enabled, supersedes, contradicts, derived_from, supports). Use to understand decision lineage and memory relationships. Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:564:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', description: 'Limit scan to specific spec folder (e.g., "005-memory")' }, force: { type: 'boolean', default: false, description: 'Force re-index all files (ignore content hash)' }, includeConstitutional: { type: 'boolean', default: true, description: 'Whether to scan .opencode/skill/*/constitutional/ directories' }, includeSpecDocs: { type: 'boolean', default: true, description: 'Whether to scan .opencode/specs/ directories for spec folder documents (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, research/research.md, handover.md). Iteration artifacts under research/iterations/ and review/iterations/ are excluded from spec-doc indexing. Set SPECKIT_INDEX_SPEC_DOCS=false env var to disable globally.' }, incremental: { type: 'boolean', default: true, description: 'Enable incremental indexing. When true (default), skips files whose mtime and content hash are unchanged since last index. Set to false to re-evaluate all files regardless of change detection.' } }, required: [] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:664:  description: '[L6:Analysis] Get LLM-oriented compact graph neighborhoods. Accepts CocoIndex search results as seeds — use CocoIndex (mcp__cocoindex_code__search) for semantic search first, then pass results here for structural expansion. Supports manual seeds (provider: manual) and graph seeds (provider: graph). Modes: neighborhood (1-hop calls+imports), outline (file symbols), impact (reverse callers). Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:681:            file: { type: 'string', description: 'CocoIndex file path (provider: cocoindex)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:682:            range: { type: 'object', properties: { start: { type: 'number' }, end: { type: 'number' } }, description: 'CocoIndex line range' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:683:            score: { type: 'number', description: 'CocoIndex relevance score' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:688:        description: 'Seeds from CocoIndex, manual input, or graph lookups',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:700:  description: '[L7:Maintenance] Check CocoIndex availability, binary path, and index status.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:706:  description: '[L7:Maintenance] Trigger CocoIndex incremental (or full) re-indexing of the workspace.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:718:  description: '[L7:Maintenance] Submit quality feedback on CocoIndex search results to improve future searches.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:738:// Phase 020: Composite session resume tool
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:740:  name: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:746:      specFolder: { type: 'string', description: 'Optional spec folder to scope the resume context' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:747:      minimal: { type: 'boolean', description: 'When true, skip the heavy memory context call and return code-graph, CocoIndex, structural-context, hints, and session-quality fields without the full memory payload' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:753:// Phase 024 / Item 7: Composite session bootstrap tool
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:755:  name: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:756:  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:761:      specFolder: { type: 'string', description: 'Optional spec folder to scope the resume context' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:768:      resume: { type: 'object', description: 'Merged session_resume payload (spec folder, task status, memory context)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:770:      structuralContext: { type: 'object', description: 'Structural bootstrap contract (status, summary, recommendedAction); omitted when code graph is unavailable', properties: { status: { type: 'string', enum: ['ready', 'stale', 'missing'] }, summary: { type: 'string' }, recommendedAction: { type: 'string' } } },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:772:      nextActions: { type: 'array', items: { type: 'string' }, description: 'Up to 3 recommended next actions derived from resume, health, and structural status' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:774:    required: ['resume', 'health', 'hints', 'nextActions'],
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:903:  sharedSpaceUpsert,
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:904:  sharedSpaceMembershipSet,
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:927:  // L8: CocoIndex
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts:23:        '.opencode/specs/system-spec-kit/024-compact-code-graph/029-review-remediation/tasks.md',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts:24:        '.opencode/specs/system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/spec.md',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts:25:        '.opencode/specs/system-spec-kit/024-compact-code-graph/029-review-remediation/checklist.md',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts:33:        'specs/system-spec-kit/024-compact-code-graph/029-review-remediation',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts:35:    ).toBe('specs/system-spec-kit/024-compact-code-graph/029-review-remediation');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts:44:        '.opencode/specs/system-spec-kit/024-compact-code-graph/029-review-remediation/tasks.md',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts:45:        '.opencode/specs/system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/spec.md',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts:59:        '.opencode/specs/system-spec-kit/024-compact-code-graph/029-review-remediation/tasks.md',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts:60:        '.opencode/specs/system-spec-kit/024-compact-code-graph/029-review-remediation/checklist.md',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts:66:      'specs/system-spec-kit/024-compact-code-graph/029-review-remediation',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts:76:        '.opencode/specs/system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/spec.md',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts:77:        '.opencode/specs/system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/implementation-summary.md',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts:85:        'specs/system-spec-kit/024-compact-code-graph/029-review-remediation',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts:87:    ).toBe('specs/system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity');
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:175:Packet `026-graph-and-context-optimization/010-fts-capability-cascade-floor` freezes the lexical capability contract that packet `002-implement-cache-warning-hooks` now consumes. `memory_search` responses expose:
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:340:| `progressive-disclosure.ts` | -     | TypeScript | Supports progressive-disclosure result paging and response shaping |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:513:**Spec Folder Scoping**:
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:580:| **Algorithm** | TF-IDF sentence scoring with markdown stripping and tokenization |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:781:  specFolder: 'specs/<###-spec-name>',  // Optional: scope to project
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:68:  existing_scope?: {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:69:    tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:70:    userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:71:    agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:72:    sharedSpaceId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:103:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:104:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:105:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:106:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:124:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:125:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:126:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:127:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:200:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:201:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:202:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:203:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:425:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:426:    userId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:427:    agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:428:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:453:    tenantId: normalizeScopeValue(tenantId),
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:454:    userId: normalizeScopeValue(userId),
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:455:    agentId: normalizeScopeValue(agentId),
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:456:    sharedSpaceId: normalizeScopeValue(sharedSpaceId),
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:459:  const scopeFilters = [
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:460:    ['tenant_id', requestedScope.tenantId],
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:461:    ['user_id', requestedScope.userId],
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:462:    ['agent_id', requestedScope.agentId],
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:463:    ['shared_space_id', requestedScope.sharedSpaceId],
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:477:      tenantId: duplicate.tenant_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:478:      userId: duplicate.user_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:479:      agentId: duplicate.agent_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:480:      sharedSpaceId: duplicate.shared_space_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:483:      existingScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:484:      existingScope.userId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:485:      existingScope.agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:486:      existingScope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:488:    const isDifferentScope = scopeFilters.some(([_, value], index) => {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:497:      result.existing_scope = undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:503:    result.existing_scope = existingScope;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:522:      for (const [column, value] of scopeFilters) {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:572:        tenantId: requestedScope.tenantId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:573:        userId: requestedScope.userId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:574:        agentId: requestedScope.agentId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:575:        sharedSpaceId: requestedScope.sharedSpaceId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:759:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:760:    userId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:761:    agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:762:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:853:      { content, spec_folder, database, find_similar, embedding, tenantId, userId, agentId, sharedSpaceId },
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:217:describe('buildRecoveryPayload() — recommendedAction mapping', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:286:  it('shortens long queries by keeping the first 3 words', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:44:      is_pinned INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:58:  is_pinned?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:32:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:33:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:34:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:35:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:115:  tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:116:  userId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:117:  agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:118:  sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:144:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:145:    userId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:146:    agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:147:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:567:    // After stripping trailing slash in getParentPath, this becomes '003-foo'
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:32:// Initialize a test DB at module scope so skipIf conditions can evaluate correctly.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:399:      const mappings = CAUSAL_LINK_MAPPINGS;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:400:      expect(mappings).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:401:      expect(typeof mappings).toBe('object');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:402:      const keys = Object.keys(mappings);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:304:  it('numeric parentMemoryId grouping works correctly', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:44:| **Tier Mapping** | Link importance tiers to appropriate memory types |
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:54:| Keyword Mappings | 40+ | Title/trigger phrase to type mapping |
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:90:### Tier to Type Mapping
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:98:| temporary | working | Session-scoped, fast decay |
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:5:import type { CausalLinkMapping } from '../handlers/causal-links-processor';
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:256:    const mappings = causalLinksProcessor.CAUSAL_LINK_MAPPINGS;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:257:    expect(mappings).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:258:    expect(typeof mappings).toBe('object');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:259:    expect(Array.isArray(mappings)).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:264:    const mappings = causalLinksProcessor.CAUSAL_LINK_MAPPINGS;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:266:    const keys = Object.keys(mappings);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:269:      expect(mappings).toHaveProperty(k);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:275:      const mappings = causalLinksProcessor.CAUSAL_LINK_MAPPINGS;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:276:      for (const [, mapping] of Object.entries(mappings)) {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:277:        const typedMapping = mapping as CausalLinkMapping;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:278:        expect(typeof typedMapping.relation).toBe('string');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:279:        expect(typeof typedMapping.reverse).toBe('boolean');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:295:      const mappings = causalLinksProcessor.CAUSAL_LINK_MAPPINGS;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:297:      for (const [, mapping] of Object.entries(mappings)) {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:298:        const typedMapping = mapping as CausalLinkMapping;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:299:        expect(validRelations).toContain(typedMapping.relation);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:312:    const expected = ['auto', 'quick', 'deep', 'focused', 'resume'];
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:353:  it('resume tokenBudget is 2000', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:355:    expect(memoryContext.CONTEXT_MODES.resume.tokenBudget).toBe(2000);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:369:  it('has all 7 intent mappings', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:371:    const mapping = memoryContext.INTENT_TO_MODE;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:373:    const keys = Object.keys(mapping);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:376:      expect(mapping).toHaveProperty(k);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:439:  it('requires exact scope equality when a governance scope is supplied', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:446:        content_text: 'scoped',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:449:        file_path: 'scoped.md',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:479:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:480:      userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:481:      sharedSpaceId: 'space-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:4:vi.mock('../lib/governance/scope-governance', async (importOriginal) => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:5:  const actual = await importOriginal<typeof import('../lib/governance/scope-governance')>();
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:12:import * as scopeGovernance from '../lib/governance/scope-governance';
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:39:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:45:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:46:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:58:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:59:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:63:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:64:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:74:      tenantId: 'tenant-A',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:85:    expect(getAllowedSharedSpaceIds(db, { userId: 'user-1' })).toEqual(new Set());
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:94:      tenantId: 'tenant-A',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:106:      tenantId: 'tenant-A',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:107:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:117:      tenantId: 'tenant-A',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:129:      tenantId: 'tenant-B',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:130:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:139:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:140:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:164:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:182:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:183:      userId: 'user-editor',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:190:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:191:      userId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:203:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:221:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:222:      userId: 'user-mixed',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:223:      agentId: 'agent-mixed',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:228:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:229:      userId: 'user-mixed',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:230:      agentId: 'agent-mixed',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:240:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:252:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:253:      userId: 'user-viewer',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:260:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:261:      userId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:294:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:301:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:322:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:333:    vi.mocked(scopeGovernance.recordGovernanceAudit)
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:342:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:343:      userId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:349:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:350:      userId: 'user-viewer',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:366:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:378:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:379:      userId: 'user-2',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:385:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:392:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:393:      userId: 'user-2',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:399:    expect(Array.from(getAllowedSharedSpaceIds(db, { userId: 'user-2' }))).toEqual([]);
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:408:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:421:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:422:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:427:    expect(Array.from(getAllowedSharedSpaceIds(db, { agentId: 'agent-1' }))).toEqual([]);
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:435:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:437:    })).toThrow('E_VALIDATION: spaceId and tenantId must be non-empty strings');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:453:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:459:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:477:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:478:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:482:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:483:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:496:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:544:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:644:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:651:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:658:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:665:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:720:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:753:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:159:    it('T521-C7: Explicit scope is merged into checkpoint metadata on create', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:162:        name: 'scoped-checkpoint',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:168:          reason: 'scope-test',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:169:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:170:          agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:171:          sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:176:          name: 'scoped-checkpoint',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:178:          metadata: { reason: 'scope-test' },
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:179:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:180:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:181:          agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:182:          sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:185:          name: 'scoped-checkpoint',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:188:            reason: 'scope-test',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:189:            tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:190:            userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:191:            agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:192:            sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:194:          scope: {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:195:            tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:196:            userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:197:            agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:198:            sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:206:    it('T521-C8: Governed checkpoint create requires tenant scope when actor scope is provided', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:209:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:216:    it('T521-C9: whitespace-only tenantId is rejected when actor scope is provided', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:219:        tenantId: '   ',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:220:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:221:      })).rejects.toThrow(/tenantId must be a non-empty string/i);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:253:    it('T521-L3: Limit clamping validates boundary values', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:268:    it('T521-L4: Optional scope filters checkpoint list results by metadata', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:277:          metadata: { userId: 'user-1', sharedSpaceId: 'space-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:286:          metadata: { userId: 'user-2', sharedSpaceId: 'space-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:291:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:292:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:293:          sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:300:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:301:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:302:          sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:309:    it('T521-L5: Governed checkpoint list requires tenant scope when actor scope is provided', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:310:      const response = await handler.handleCheckpointList({ userId: 'user-1' });
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:405:        name: 'scoped-restore',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:411:        metadata: JSON.stringify({ userId: 'user-2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:416:          name: 'scoped-restore',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:417:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:418:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:430:    it('T521-R7: Governed checkpoint restore requires tenant scope when actor scope is provided', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:433:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:514:        name: 'scoped-delete',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:520:        metadata: JSON.stringify({ sharedSpaceId: 'space-2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:525:          name: 'scoped-delete',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:526:          confirmName: 'scoped-delete',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:527:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:528:          sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:540:    it('T521-DEL8: Governed checkpoint delete requires tenant scope when actor scope is provided', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:544:        sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:199:  it('covers all three tiers with non-overlapping ranges', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:179:    // Use highly overlapping text to exceed 0.75 Jaccard threshold
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:397: * deleting only `created_by='auto'` entries in scope, re-extracting from the
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:768: * Compute global graph density as total_edges / total_memories.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:121:  // Reassemble and globally re-sort by score to preserve strict ordering
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:96: * Returns 0 for lists with fewer than 2 overlapping items.
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:106:  // Find overlapping items
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:11:} from '../lib/governance/scope-governance';
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:52:  it('isolates scoped retrieval to a single tenant and actor', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:75:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:76:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:87:  it('prevents cross-actor leakage when scope enforcement is enabled', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:106:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:107:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:110:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:111:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:64:  temporary: 'working',              // Session-scoped, fast decay
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:237:  // over-captured by the generic important -> declarative mapping.
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:247:  // 3. Check importance tier mapping
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:321:  importance_tier: 'Derived from importance_tier field mapping',
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:384:  it('C13: Response meta.tool is memory_search', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:388:    expect(envelope.meta.tool).toBe('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:482:describe('T059: autoDetectIntent Parameter (memory_search)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:599:describe('C138: Centroid-Based Classification & Lambda Mapping', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:677:  it('C138-T5: intent-to-lambda mapping covers required intents', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:42:    toolPattern: /^(read|memory_context|memory_search|memory_list)$/i,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:49:    toolPattern: /^(grep|memory_search)$/i,
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:98:    { id: 901, content: 'Release checklist task ownership and sign-off bookkeeping. '.repeat(2) },
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:241:const ORIGINAL_FETCH = globalThis.fetch;
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:261:  globalThis.fetch = ORIGINAL_FETCH;
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:300:  globalThis.fetch = fetchMock as typeof fetch;
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:58:const sharedSpacesReadmePath = path.resolve(__dirname, '../../shared-spaces/README.md');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:89:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:96:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:116:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:131:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:143:  it('auto-bootstraps the creator as owner when creating a shared space', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:146:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:167:  it('treats stale create conflicts as updates and bootstraps only one owner', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:170:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:191:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:221:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:229:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:240:  it('rolls back shared-space creation when owner bootstrap fails', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:252:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:271:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:277:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:286:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:299:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:305:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:314:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:336:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:342:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:351:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:366:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:386:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:401:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:415:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:444:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:452:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:471:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:511:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:518:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:537:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:584:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:590:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:599:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:618:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:637:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:647:  it('scopes shared-memory status to the authenticated caller identity', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:650:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:657:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:664:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:672:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:679:    expect(envelope.data.userId).toBe('user-other');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:680:    expect(envelope.data.agentId).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:718:    const readmeExistedBefore = await fsPromises.access(sharedSpacesReadmePath)
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:730:    const readmeExistsAfter = await fsPromises.access(sharedSpacesReadmePath)
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:7:// 1. Summary layer — compact digest of result quality distribution
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:50:  scopeKey?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:81:  scopeKey?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:238: * Produces a compact digest of result quality distribution.
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:334:    scopeKey: typeof options?.scopeKey === 'string' && options.scopeKey.length > 0
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:335:      ? options.scopeKey
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:368:    typeof payload.scopeKey === 'string'
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:369:    && payload.scopeKey.length > 0
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:370:    && payload.scopeKey !== options?.scopeKey
.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:41:/** Default tier-to-budget mapping when dynamic allocation is enabled.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:10://   gates (density + size), community score capping (secondary-only).
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:173:              tenantId,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:174:              userId,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:175:              agentId,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:203:              tenant_id: tenantId ?? existing?.tenant_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:204:              user_id: userId ?? existing?.user_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:205:              agent_id: agentId ?? existing?.agent_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:404:      expect(database.execStatements.some((sql) => sql.includes('idx_session_state_identity_scope'))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:414:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:415:        userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:416:        agentId: 'agent-a',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:480:        currentTask: 'resume crash recovery verification',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:508:        contextSummary: 'Need to resume from the saved recovery packet.',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:518:      expect(content).toContain('/spec_kit:resume specs/022-hybrid-rag-fusion');
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:607:        tenantId: 'tenant-1',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:608:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:609:        agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:694:        tenantId: 'tenant-z',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:695:        userId: 'user-z',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:696:        agentId: 'agent-z',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:712:        tenantId: 'tenant-z',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:713:        userId: 'user-z',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:714:        agentId: 'agent-z',
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:11:const SUPPORTED_PHASES_ARRAY = ['baseline', 'lineage', 'graph', 'adaptive', 'scope-governance', 'shared-rollout'] as const;
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:21:  scopeEnforcement: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:30:  scopeDimensionsTracked: number;
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:59:  scopeEnforcement: 'SPECKIT_MEMORY_SCOPE_ENFORCEMENT',
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:68:  scopeEnforcement: 'SPECKIT_HYDRA_SCOPE_ENFORCEMENT',
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:149:    scopeEnforcement: isMemoryRoadmapCapabilityEnabled(
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:150:      [CAPABILITY_ENV.scopeEnforcement, LEGACY_CAPABILITY_ENV.scopeEnforcement],
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:172:    scopeDimensionsTracked: 5, // tenant/user/agent/session/sharedSpace
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:173:    ).rejects.toThrow(/requires specFolder scope/i);
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:203:    console.warn('[embedding-expansion] Received empty embedding — skipping expansion');
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts:70:    it('treats copilot-cli as disabled_by_scope when no repo hook config exists', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts:79:      expect(result.hookPolicy).toBe('disabled_by_scope');
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts:95:    it('treats null Gemini hooks blocks as disabled_by_scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts:117:      expect(result.hookPolicy).toBe('disabled_by_scope');
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:105: * 4. Suggest dropping the spec folder constraint when it was set
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:59:    it('T516-2: handle_memory_search alias is exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:60:      expect(typeof handler.handle_memory_search).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:142:      const r = tierClassifier.classifyTier({ id: 2, is_pinned: 1, stability: 1.0 });
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:180:      expect(tierClassifier.shouldArchive({ id: 3, is_pinned: 1, stability: 0.01, created_at: new Date(Date.now() - 200 * 86400000).toISOString() })).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:22:- [3. FEATURE CATALOG MAPPING](#3--feature-catalog-mapping)
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:144:  - `recovery-hints.ts` — tool-aware recovery guidance and error-code hint mapping.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:175:  - `README.md` — pipeline overview and extraction scope.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:194:- Purpose: Owns scope enforcement, governed ingest normalization, audit recording, and retention sweeps. This is the boundary for tenant/user/agent/session/shared-space policy decisions.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:196:  - `scope-governance.ts` — scope normalization, policy decisions, filter helpers, and governance audit writes.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:197:  - `retention.ts` — scoped retention sweep logic over expired memories.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:239:  - `README.md` — current management-cycle scope and algorithm notes.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:284:- Purpose: Owns the standard MCP response envelope used to make tool results predictable for agents and callers. It is the canonical place for `{summary, data, hints, meta}` shaping.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:372:  - `README.md` — telemetry scope and flag overview.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:411:<!-- ANCHOR:feature-catalog-mapping -->
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:492:<!-- /ANCHOR:feature-catalog-mapping -->
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:570:- Narrowly scoped infra-to-infra imports are allowed when they reflect clear dependency direction:
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-validation.vitest.ts:170:    'spec.md': `# Test Spec\n\n| **Level** | 1 |\n| **Date** | ${today} |\n\n## Overview\nThis is a test spec.\n\n## Scope\nTest scope.\n\n## Requirements\nTest requirements.\n`,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:151:    // Preserve checklist state markers while dropping the bullet itself.
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:184: * functions to ensure a clean, compact result.
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:509:    // L3 FIX: Correct p95 percentile index with bounds clamping
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:61: *   scheduled    — Schedule a background global refresh for larger components.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:178:/** Clear the dirty-node set (called after a successful global refresh). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:325: * Scheduled global-refresh timer handle.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:334: * Schedule a global graph refresh to run after a debounce delay.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:337: * call triggers execution.  The actual refresh callback (`_globalRefreshFn`)
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:349:      _globalRefreshFn();
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:358: * Cancel any pending scheduled global refresh without executing it.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:373:/** Registered global-refresh callback (default: no-op). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:374:let _globalRefreshFn: () => void = () => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:379: * Register a global-refresh callback.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:380: * Called by the application bootstrap to wire in the actual refresh
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:386:  _globalRefreshFn = fn;
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:604: * Set via `registerLlmBackfillFn()` in application bootstrap.
.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:53:    // Append compact JSON metadata on the same line
.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:64:/** A logger instance scoped to a specific module prefix. */
.opencode/skill/system-spec-kit/mcp_server/lib/utils/logger.ts:73: * Create a logger scoped to a module name.
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:598:  it('rebuilds auto rows in scope and preserves manual rows', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:624:    const scopedRows = db.prepare(`
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:630:    expect(scopedRows.some((row) => row.entity_text === 'Curated Alias' && row.created_by === 'manual')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:631:    expect(scopedRows.some((row) => row.entity_text === 'Node.js. With Next.js Adapter')).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:632:    expect(scopedRows.some((row) => row.entity_text === 'Node.js' && row.created_by === 'auto')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:633:    expect(scopedRows.some((row) => row.entity_text === 'Next.js Adapter' && row.created_by === 'auto')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:3:vi.mock('../handlers/session-resume.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:7:      text: JSON.stringify({ status: 'ok', data: { memory: { resumed: true }, hints: ['resume ok'] } }),
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:30:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:34:import { handleSessionBootstrap } from '../handlers/session-bootstrap.js';
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:35:import { handleSessionResume } from '../handlers/session-resume.js';
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:40:describe('session-bootstrap handler', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:45:  it('uses the full session_resume payload and records full bootstrap telemetry', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:51:    expect(parsed.data.resume.memory).toEqual({ resumed: true });
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:53:    expect(parsed.data.payloadContract.kind).toBe('bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:54:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:58:      resume: expect.any(Object),
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:63:    expect(parsed.data.hints).toEqual(expect.arrayContaining(['resume ok', 'health ok']));
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:66:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:71:  it('adds a structural hint when the bootstrap contract is stale', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:75:      recommendedAction: 'Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:76:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:89:    expect(parsed.data.nextActions).toContain('Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:23:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:4:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:21:/** Trigger cache entry for a single phrase-to-memory mapping */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:474:  // Step 2: Optional accent stripping (NFKD + remove combining marks)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:48:import { filterRowsByScope, isScopeEnforcementEnabled } from '../../governance/scope-governance.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:472:  // Fix #16: Cache embedding at function scope for reuse in constitutional injection
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:484:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:485:    userId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:486:    agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:487:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:977:  // Including it here caused all candidates to be filtered out when memory_context
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:978:  // passed an ephemeral sessionId, because memories don't have session-scoped access.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:980:    tenantId
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:981:    || userId
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:982:    || agentId
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:983:    || sharedSpaceId
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:986:  const scopeFilter = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:987:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:988:    userId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:989:    agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:990:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:997:      allowedSharedSpaceIds = getAllowedSharedSpaceIds(db, scopeFilter);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1000:        scopeFilter,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1004:      candidates = filterRowsByScope(candidates, scopeFilter);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1053:        // to ensure constitutional injection respects global scope enforcement
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1057:            scopeFilter,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1125:                ? filterRowsByScope(resultSet, scopeFilter, allowedSharedSpaceIds)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1180:        ? filterRowsByScope(rawHydeCandidates, scopeFilter, allowedSharedSpaceIds)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1265:            const scopeFilteredSummaryHits = shouldApplyScopeFiltering
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1266:              ? filterRowsByScope(contextFilteredSummaryHits, scopeFilter, allowedSharedSpaceIds)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1270:            const backfilledSummaryHits = backfillMissingQualityScores(scopeFilteredSummaryHits);
.opencode/skill/system-spec-kit/mcp_server/lib/utils/README.md:69:| `path-security.ts` | Re-exports path validation and regex escaping from `@spec-kit/shared/utils/path-security` |
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:443:  it('uses query-scoped feedback signals as relevance labels when available', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:28:    is_pinned: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:224:    const rowUnpinned = { ...makeFullDbRow(), is_pinned: 0 };
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:225:    expect(dbRowToMemory(rowUnpinned).isPinned).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:228:    expect(memoryToDbRow(memory).is_pinned).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:229:    expect(memoryToDbRow({ ...memory, isPinned: false }).is_pinned).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:66:    'spec', 'specification', 'requirements', 'scope', 'feature',
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:117:    /what\s+(?:is|was)\s+the\s+(?:scope|plan)/i,
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:166:    'show specification scope and implementation tasks',
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:272:    /(?:find|show|get)\s+(?:me\s+)?(?:the\s+)?(?:spec|specification|requirements|scope|plan|checklist)/i.test(query) ||
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:274:    /what\s+(?:are|is|was|were)\s+the\s+(?:requirements|scope|plan)/i.test(query)
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:627: * @returns Response profile name or null if no mapping exists
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:636: * C138: Intent-to-MMR-lambda mapping.
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:316:    it('T031-BM25-07: bm25_search() fails closed when scoped lookup throws', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:331:                throw new Error('scope lookup failed');
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:357:        '[BM25] Spec-folder scope lookup failed, returning empty scoped results:',
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1341:    const compact = {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1347:    const budget = hybridSearch.estimateResultTokens(compact) + 5;
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1349:    const truncated = hybridSearch.truncateToBudget([oversized, compact], budget, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:130:  /** D3-002: Classified query intent. Used for intent-aware edge priority mapping. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:387: * and dropping non-finite values to guard against DB query injection.
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:113:  // Canonical self-mappings
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:208:  // Convert UTF-16 BE to LE by swapping bytes, then decode as utf16le.
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:2:// MODULE: CocoIndex Path Helper
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:4:// F046/F051: Shared helper for resolving the CocoIndex binary path.
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:6:// session-resume.ts, and other consumers.
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:12:/** Relative path from project root to the CocoIndex CLI binary. */
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:48: * Get the absolute path to the CocoIndex binary.
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:51:export function getCocoIndexBinaryPath(): string {
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:56: * Check whether the CocoIndex binary exists on disk.
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:58:export function isCocoIndexAvailable(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:59:  return existsSync(getCocoIndexBinaryPath());
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:75:| `scoring/README.md` | Documentation for cache-scoped scoring re-exports |
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:181:const key = generateCacheKey('memory_search', { query: 'test' });
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:184:set(key, searchResults, { toolName: 'memory_search', ttlMs: 30000 });
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:196:  'memory_search',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:210:// Automatically clears memory_search, memory_match_triggers, etc.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:60: * separate implementations with different fallback orders and clamping. This shared
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:128:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:129:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:130:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:131:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:28:const originalFetch = globalThis.fetch;
.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:45:  globalThis.fetch = originalFetch;
.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:49:  globalThis.fetch = vi.fn(async () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:324:    it('only compares overlapping query-memory pairs', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:341:    it('returns zeroes for no overlapping pairs', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:204:  describe('T069: extractDocumentType() filename mapping', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:469:      // Use low base values to avoid clamping to 1.0
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:485:      // Constitutional (2.0) > spec (1.4) with low enough base to avoid clamping
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:590:    it('find_spec keywords include: spec, specification, requirements, scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:595:      expect(keywords).toContain('scope');
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:711:  describe('T074: Tier mapping', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:867:        is_pinned: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:910:        is_pinned: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:24: * Importance tier → quality score mapping.
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:162: *   2. `importance_tier` → tier quality score mapping.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:52: * Token-pressure policy for memory_context.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:60: * Automatic session resume context injection for memory_context.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:303: * Honors SPECKIT_ROLLOUT_PERCENT global rollout policy.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:313: * Honors SPECKIT_ROLLOUT_PERCENT global rollout policy.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:451: * community score capping (secondary-only).
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:661: * Adds retrievalLevel parameter: 'local' (entity), 'global' (community), 'auto' (local + fallback).
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:671: * (quick, research, resume, debug) when no explicit profile is specified by the caller.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:312:    'memory_search',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:313:    'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:314:    'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:427:  it('schedules global refresh in scheduled mode', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:792:  it('registered global refresh fn is called after scheduled delay', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:796:    __testables.registerGlobalRefreshFn(() => { log.push('global-refresh'); });
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:802:    expect(log).toContain('global-refresh');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:34:The `pipeline/` directory implements the core retrieval pipeline behind `memory_search`. Each search request flows through four sequential stages, each with a defined I/O contract and clear responsibility boundary. The pipeline supports hybrid, vector and multi-concept search types with optional deep-mode query expansion, cross-encoder reranking, MMR diversity pruning and MPAB chunk-to-parent reassembly.
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:53:  memory_search: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:55:  memory_context: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:56:  memory_match_triggers: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:13:} from '../lib/governance/scope-governance';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:23:  it('rejects governed ingest when provenance or scope markers are missing', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:28:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:33:    expect(decision.issues).toContain('userId or agentId is required for governed ingest');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:37:  it('filters rows to the requested tenant and actor scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:44:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:45:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:52:  it('denies all rows when enforcement is on and scope is empty', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:64:  it('honors explicit session scope even when global scope enforcement is disabled', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:90:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:91:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:112:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:113:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:145:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:146:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:154:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:155:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:162:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:163:      userId: 'user-9',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:169:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:183:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:184:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:195:  it('blocks unscoped governance audit enumeration unless allowUnscoped=true', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:209:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:210:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:221:      '[scope-governance] Unscoped governance audit enumeration blocked; explicit filters or allowUnscoped=true required.'
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:224:    const allowed = reviewGovernanceAudit(db, { allowUnscoped: true, limit: 10 });
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:229:  it('reuses cached scope predicates and benchmarks scoped filtering', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:240:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:241:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:247:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:248:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:253:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:254:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:618:        // @ts-expect-error testing runtime null-db fallback despite non-null typing
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:136:    it('returns the newest state file that matches the requested scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:172:        const state = loadMostRecentState({ scope: { specFolder: 'specs/matching' } });
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:184:    it('fails closed when the caller cannot prove scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:215:          scope: { specFolder: 'specs/stale', claudeSessionId: staleSessionId },
.opencode/skill/system-spec-kit/mcp_server/lib/search/deterministic-extractor.ts:171:  // Silence unused variable warning while keeping the constant for documentation
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:39:| Tool-Specific Hints | 6 tools | memory_search, checkpoint_restore, memory_save, memory_index_scan, memory_drift_why, memory_causal_link |
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:132:  return buildErrorResponse('memory_search', error, { query });
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:142:const hint = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:13:// 5. Unscoped queries — no folder restriction applied
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:367:// 5. Unscoped queries — no folder restriction applied
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:370:describe('R9: Unscoped queries — cross-folder behaviour', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:531:  it('R9-15b: scoped result set is a strict subset of cross-folder result set', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:533:    // Equivalently: all scoped results must also appear in the unscoped result set.
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:534:    const scoped = structuralSearch({ specFolder: 'specs/001-auth', limit: 10 });
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:535:    const unscoped = structuralSearch({ limit: 10 });
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:537:    const unscopedIds = new Set(unscoped.map((r) => r.id));
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:538:    for (const row of scoped) {
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:539:      expect(unscopedIds.has(row.id)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:542:    // Unscoped contains rows from other folders as well.
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:543:    expect(unscoped.length).toBeGreaterThan(scoped.length);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:78:  describe('Decay floor clamping', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:27: * NOTE: Do NOT use the `g` flag here — global regex with `.test()` is stateful.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:37:/** Create a fresh global regex for split operations. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:49:/** Create a fresh global regex for match operations. */
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:13://   resume   — state + nextSteps + blockers
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:29:export type ResponseProfile = 'quick' | 'research' | 'resume' | 'debug';
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:86:/** Output of the `resume` profile formatter. */
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:111:  | { profile: 'resume'; data: ResumeProfile }
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:223:    followUps.push(`Use memory_context with specFolder "${uniqueFolders[0]}" for full context`);
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:352: * Format results as the `resume` profile.
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:402: * @param profile       - Profile name ('quick' | 'research' | 'resume' | 'debug')
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:423:    case 'resume':
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:424:      return { profile: 'resume', data: formatResume(safeInput) };
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:73:  scope: {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:74:    tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:75:    userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:76:    agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:78:    sharedSpaceId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:104:    scope.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:105:    scope.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:106:    scope.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:107:    scope.sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:108:    scope.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:236:    it('T054-6aa: Cross-tenant duplicates do not dedup when governance scope differs', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:246:        { tenantId: 'tenant-a' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:255:        { tenantId: 'tenant-b' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:261:    it('T054-6ab: Matching governance scope still dedups identical content', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:271:        { tenantId: 'tenant-a', sharedSpaceId: 'shared-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:280:        { tenantId: 'tenant-a', sharedSpaceId: 'shared-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:353:    it('T320-1: Same-path lookup uses two direct probes without nullable OR scope predicates', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:371:        { tenantId: 'tenant-a' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:383:    it('T320-2: Content-hash dedup uses exact scope clauses instead of nullable OR predicates', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:400:        { tenantId: 'tenant-a', sharedSpaceId: 'shared-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:593:    it('T054-6j: Same-path unchanged ignores matching content in another tenant scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:594:      const content = 'Same-path unchanged must remain tenant-scoped.';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:616:        { tenantId: 'tenant-b' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:622:    it('T054-6k: Same-path predecessor lookup stays inside the current governance scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:643:        { tenantId: 'tenant-b' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:650:        { tenantId: 'tenant-a' },
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:19:      producer: kind === 'bootstrap'
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:20:        ? 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:21:        : kind === 'resume'
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:22:          ? 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:35:    const bootstrap = makePayload('bootstrap', 'bootstrap summary');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:36:    const resume = makePayload('resume', 'resume summary');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:40:      bootstrapPayload: bootstrap,
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:41:      resumePayload: resume,
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:53:    expect(plan.compaction?.hook).toBe('experimental.session.compacting');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:57:    const payload = makePayload('resume', 'resume summary');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:58:    expect(coerceSharedPayloadEnvelope(payload)?.kind).toBe('resume');
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:7:  'session-resume',
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:26:  resumedSession: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:49:    case 'session-resume':
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:50:      return `resumed session inferred ${effectiveMode} mode`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:71:  if (args.resumedSession) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:72:    activeSignals.push('session-resume');
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:89:    if (!args.resumedSession && !args.pressureOverrideApplied && args.requestedMode === 'auto' && !args.queryHeuristicApplied) {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:357:      'Use memory_match_triggers() for prompt-based matching instead'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:360:    toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:469:      'Consider using /spec_kit:resume for session recovery'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:539:      'Check memory_search() for existing similar content'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:694:  memory_search: {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:700:        'Try memory_match_triggers() for trigger-based matching'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:703:      toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:47:  it('T007: event_counter increments globally and mention_count increments on re-access', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:249:        `but the active embedding configuration resolves to ${current_dim}. Refusing to bootstrap because vector search would fail. ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:451:function get_constitutional_cache_db_scope(): string {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:463:  const db_scope = get_constitutional_cache_db_scope();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:464:  return `${db_scope}::${spec_folder || 'global'}:${includeArchived ? 'arch' : 'noarch'}`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:468:  const current_db_path = get_constitutional_cache_db_scope();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:483:    const current_db_path = get_constitutional_cache_db_scope();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:519:// The old global singleton would return stale statements from a prior DB connection
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:679:    const scoped_suffix_archived = `::${spec_folder}:arch`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:680:    const scoped_suffix_live = `::${spec_folder}:noarch`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:682:      if (key.endsWith(scoped_suffix_archived) || key.endsWith(scoped_suffix_live)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:687:      if (key.endsWith(scoped_suffix_archived) || key.endsWith(scoped_suffix_live)) {
.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md:33:| `profile-formatters.ts` | Profile reducers for `quick`, `research`, `resume`, and `debug` response shapes |
.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md:41:- `profile-formatters.ts` exports `applyResponseProfile()` and `applyProfileToEnvelope()` plus the public profile types for `quick`, `research`, `resume`, and `debug`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:4:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:76:    it('T517-2: handle_memory_match_triggers alias exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:77:      expect(typeof handler.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:282:  it('filters trigger matches by governed scope fields when provided', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:285:        buildTriggerMatch({ memoryId: 11, filePath: '/tmp/scoped.md' }),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:286:        buildTriggerMatch({ memoryId: 22, filePath: '/tmp/unscoped.md' }),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:315:      prompt: 'resume auth work',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:318:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:319:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:320:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:321:      sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:330:    expect(results[0]?.filePath).toBe('/tmp/scoped.md');
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:141:// Mock governance scope filter
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:142:const mockFilterRowsByScope = vi.fn((rows: Array<Record<string, unknown>>, scope: Record<string, unknown>, allowedSharedSpaceIds?: Set<string>) => {
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:143:  const scopeEnforcementEnabled = process.env.SPECKIT_MEMORY_SCOPE_ENFORCEMENT === 'true'
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:146:    scope.tenantId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:147:    || scope.userId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:148:    || scope.agentId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:149:    || scope.sessionId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:150:    || scope.sharedSpaceId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:153:  if (scopeEnforcementEnabled && !hasGovernanceScope) {
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:158:    const tenantMatches = !scope.tenantId || row.tenant_id === scope.tenantId;
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:159:    const userMatches = !scope.userId || row.user_id === scope.userId;
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:160:    const agentMatches = !scope.agentId || row.agent_id === scope.agentId;
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:161:    const sessionMatches = !scope.sessionId || row.session_id === scope.sessionId;
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:162:    const sharedMatches = !scope.sharedSpaceId || (
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:163:      row.shared_space_id === scope.sharedSpaceId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:169:vi.mock('../lib/governance/scope-governance', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:170:  filterRowsByScope: (rows: Array<Record<string, unknown>>, scope: Record<string, unknown>, allowedSharedSpaceIds?: Set<string>) =>
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:171:    mockFilterRowsByScope(rows, scope, allowedSharedSpaceIds),
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:177:const mockGetAllowedSharedSpaceIds = vi.fn((_db: unknown, _scope: Record<string, unknown>) => undefined as Set<string> | undefined);
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:179:  getAllowedSharedSpaceIds: (db: unknown, scope: Record<string, unknown>) => mockGetAllowedSharedSpaceIds(db, scope),
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:286:    // Both channels return overlapping result (id=1)
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:457:  it('T8: summary-channel hits are filtered by governance scope before merge', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:504:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:505:        sharedSpaceId: 'shared-allowed',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:516:  it('T9: constitutional injection re-applies governance scope after vector fetch', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:550:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:551:        sharedSpaceId: 'allowed-space',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:559:  it('T10: deny-by-default filters empty-scope candidates when enforcement is enabled', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:573:  it('T11: deep-mode LLM reformulation results are scope-filtered before merge', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:597:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:598:        sharedSpaceId: 'shared-allowed',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:612:  it('T12: deep-mode HyDE results are scope-filtered before merge', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:630:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:631:        sharedSpaceId: 'shared-allowed',
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts:64:  'scope_filtered',
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:63: * Default tier-to-channel mapping:
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:36:  /** Session ID for grouping selections. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:88:  /** Total number of overlapping query-memory pairs compared. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:461:  // Compare overlapping pairs
.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposition.vitest.ts:55:  it('deduplicates overlapping results when merging facet coverage pools', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:38:  is_pinned?: number;
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:81:      is_pinned INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:105:    INSERT INTO memory_index (spec_folder, file_path, title, content_text, importance_tier, created_at, last_accessed, access_count, confidence, is_pinned, stability, half_life_days)
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:118:    data.is_pinned || 0,
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:20:/** Maximum number of entries allowed in each session-scoped cache. */
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:23:/** Session-scoped cache for momentum scores (memoryId -> momentum). */
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:26:/** Session-scoped cache for causal depth scores (memoryId -> normalized depth). */
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:51: * Clear both session-scoped caches. Call at session boundaries or when
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:205:         WHEN m.is_pinned = 1 THEN m.importance_weight
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:67: * Cache is scoped per bound DB instance to avoid repeated sqlite_master probes.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:111:    // Hierarchy-aware fallback/augmentation for spec-scoped retrieval.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:331: * In-memory degree cache scoped per bound DB instance.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:332: * Stores both per-node boosted scores and cached global max typed degree.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:418: * Compute the global maximum typed degree across all memories in the database.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:551: * - Computes global max once per batch for normalization
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:586:  // Compute global max once per DB instance (cached)
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:20:    { name: 'handleSessionBootstrap', kind: 'function', filePath: 'mcp_server/handlers/session-bootstrap.ts', callCount: 5 },
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:32:    lastSpecFolder: 'system-spec-kit/024-compact-code-graph/027-opencode-structural-priming',
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:34:      text: 'Aligned structural bootstrap contract across auto-prime and session_* handlers.',
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:45:  isCocoIndexAvailable: vi.fn(() => false),
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:72:    expect(brief.startupSurface).toContain('- CocoIndex: missing');
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:115:    vi.mocked(cocoIndexPath.isCocoIndexAvailable).mockReturnValueOnce(true);
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:118:    expect(brief.startupSurface).toContain('- CocoIndex: available');
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:124:    expect(brief.graphOutline).toContain('CocoIndex');
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:151:    expect(brief.startupSurface).toContain('- Memory: startup summary only (resume on demand)');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:60:  'add dark mode support globally',
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:672:describe('T022-11: Tier-to-Channel Mapping Readiness', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:77:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:89:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:90:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:93:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:94:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:105:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:117:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:118:      userId: 'user-2',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:124:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:125:      userId: 'user-2',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:134:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:151:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:152:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:470:    const content = 'Avoid scope creep when fixing bugs.';
.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:52:| Session-scoped caching | Momentum and depth caches prevent redundant DB queries within a single session. Caches clear at 10,000 entries. |
.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:97:| `storeCommunityAssignments` | community-detection.ts | Persists node-to-community mappings with INSERT OR REPLACE |
.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:139:| `community_assignments` | community-detection.ts | Persisted node-to-community mappings |
.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:291: * This compact format is designed for LLM consumption: the two pipe-separated
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:6:  { tool: 'memory_context', handler: 'handleMemoryContext', layer: 'L1' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:7:  { tool: 'memory_search', handler: 'handleMemorySearch', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:8:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:33:  { camel: 'handleMemorySearch', snake: 'handle_memory_search' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:34:  { camel: 'handleMemoryMatchTriggers', snake: 'handle_memory_match_triggers' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:56:  { camel: 'handleMemoryContext', snake: 'handle_memory_context' },
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:39:import { handleSessionResume } from '../handlers/session-resume.js';
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:45:describe('session-resume handler', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:65:    expect(parsed.data.payloadContract.kind).toBe('resume');
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:66:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:108:    expect(parsed.data.hints.some((h: string) => h.includes('Memory resume failed'))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:121:  it('records bootstrap telemetry for full resume requests', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:126:  it('skips bootstrap telemetry and includes sessionQuality in minimal mode', async () => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:153: * Query keyword/pattern mapping for artifact class detection from
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:184:    keywords: ['spec', 'specification', 'requirements', 'scope', 'objective', 'constraints'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:185:    patterns: [/spec\.md/i, /specification/i, /(?:the|our)\s+(?:spec|requirements|scope)/i],
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:194:    keywords: ['memory', 'context', 'session', 'previous session', 'prior work', 'last time', 'continue', 'resume', 'recover', 'continuation'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:204: * Intent-based fallback mapping for artifact class detection.
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:4:// Phase 030 / Phase 2: transport-only mapping from shared payload
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:5:// contracts to OpenCode-oriented startup, message, and compaction blocks.
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:14:  | 'experimental.session.compacting';
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:25:/** Complete transport-only plan derived from shared startup/resume payloads. */
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:37:  compaction?: OpenCodeTransportBlock;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:83:  bootstrapPayload?: SharedPayloadEnvelope | null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:85:  resumePayload?: SharedPayloadEnvelope | null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:87:  compactionPayload?: SharedPayloadEnvelope | null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:91:    args.bootstrapPayload?.kind,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:93:    args.resumePayload?.kind,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:95:    args.compactionPayload?.kind,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:98:  const systemPayload = args.bootstrapPayload ?? args.startupPayload ?? args.resumePayload ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:99:  const messagePayloads = [args.resumePayload, args.healthPayload].filter(
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:102:  const compactionPayload = args.compactionPayload ?? args.resumePayload ?? args.bootstrapPayload ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:140:    ...(compactionPayload
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:142:        compaction: {
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:143:          hook: 'experimental.session.compacting',
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:145:          payloadKind: compactionPayload.kind,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:146:          dedupeKey: `compaction:${compactionPayload.kind}`,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:148:            compactionPayload,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:149:            'Inject this as the continuity note across compaction. Keep it separate from current-turn retrieval.',
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:431:    ).run(0, 'bootstrap', '[]', Date.now() - 8 * 24 * 60 * 60 * 1000, 'test-setup', 0);
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:479:    // Force shadow mode by replacing the bootstrap entry with a recent timestamp.
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:483:    ).run(0, 'bootstrap', '[]', Date.now() - 1 * 24 * 60 * 60 * 1000, 'test-setup', 0);
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:558:    ).run(0, 'bootstrap', '[]', Date.now() - 1 * 24 * 60 * 60 * 1000, 'test-setup', 0);
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:689:  it('R11-AL03: getAuditLog supports global query (no memoryId)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:690:    recordSelection('q-global-1', 1, ['authentication'], 5, testDb);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:68:    vi.doMock('../handlers/session-resume.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:89:describe('memory_context advisory metadata', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:212:describe('session_bootstrap authority preservation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:223:  it('keeps bootstrap and resume authoritative while surfacing the nudge separately', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:224:    vi.doMock('../handlers/session-resume.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:231:              memory: { resumed: true },
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:232:              hints: ['resume ok'],
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:234:                kind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:249:                  producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:250:                  sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:281:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:285:    const { handleSessionBootstrap } = await import('../handlers/session-bootstrap.js');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:291:      preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:296:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:179:  it('scopes hidden-path checks relative to the watched root', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:182:    const scopedPath = __testables.getWatchScopedPath(filePath, [watchRoot]);
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:184:    expect(scopedPath).toBe('specs/001-test/spec.md');
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:185:    expect(__testables.shouldIgnoreWatchTarget(scopedPath ?? filePath)).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts:25:  | 'scope_filtered';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:30:      "expectedResultDescription": "Should surface memories about adaptive-fusion.ts (7 intent profiles), intent-classifier.ts, and memory_context intent routing. Cross-document because the behavior spans multiple modules.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:85:      "query": "memory_context returns wrong results when token pressure is high",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:121:      "notes": "Find-spec intent with temporal/scope framing. Tests specFolder-aware retrieval."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:231:      "notes": "From T007b Pattern 2: session resume always uses \"session state\" as the input string."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:240:      "expectedResultDescription": "Topic-scoped resume query. Should surface spec folder 001-sprint-0-measurement-foundation memories with state/next-steps anchors.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:241:      "notes": "From T007b Pattern 2: variant of session resume scoped to a specific sprint/spec folder."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:251:      "notes": "From T007b Pattern 3: feature description passed to memory_context before implementation."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:298:      "category": "scope_filtered",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:300:      "expectedResultDescription": "Spec-scoped browse. Should surface memory titles and tiers from spec folder system-spec-kit/022-hybrid-rag-fusion or 140-hybrid-rag-fusion-refinement.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:308:      "category": "scope_filtered",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:338:      "category": "scope_filtered",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:415:      "query": "the memory_search tool returns stale results after index rebuild",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:425:      "query": "what is the difference between memory_context and memory_search for context retrieval",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:430:      "expectedResultDescription": "Should surface both memory_context (L1 unified entry) and memory_search (L2 core) tool schemas and any documentation comparing their use cases.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:435:      "query": "refactor session deduplication to use a sliding window instead of session-scoped set",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:448:      "category": "scope_filtered",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:725:      "query": "when should I use memory_search versus memory_context",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:951:      "notes": "Manual refactor opinion expressed as a statement — tests whether refactor intent surfaces current architecture docs."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:960:      "expectedResultDescription": "Should surface trigger-matcher.ts, vector-index.ts, hybrid-search.ts, and any architectural decision about keeping the two paths separate.",
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:82:      const key1 = generateCacheKey('memory_search', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:83:      const key2 = generateCacheKey('memory_search', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:88:      const key1 = generateCacheKey('memory_search', { query: 'auth' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:89:      const key2 = generateCacheKey('memory_search', { query: 'login' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:95:      const key1 = generateCacheKey('memory_search', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:173:  describe('T012: Session-scoped cache with 60s TTL', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:352:      const key1 = generateCacheKey('memory_search', { query: 'test1' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:353:      const key2 = generateCacheKey('memory_search', { query: 'test2' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:355:      set(key1, 'value1', { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:356:      set(key2, 'value2', { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:358:      const invalidated = invalidateByTool('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:366:      const key1 = generateCacheKey('memory_search', { query: 'test1' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:369:      set(key1, 'value1', { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:380:      const key1 = generateCacheKey('memory_search', { query: 'test1' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:383:      set(key1, 'value1', { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:394:      const searchKey = generateCacheKey('memory_search', { query: 'test' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:395:      const triggerKey = generateCacheKey('memory_match_triggers', { prompt: 'test' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:396:      set(searchKey, 'search_result', { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:397:      set(triggerKey, 'trigger_result', { toolName: 'memory_match_triggers' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:423:      const key = generateCacheKey('memory_search', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:427:        'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:436:      expect(invalidateByTool('memory_search')).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:439:      const second = withCache('memory_search', args, async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:589:      const key = generateCacheKey('memory_search', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:593:        'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:603:      const second = withCache('memory_search', args, async () => 'fresh-after-shutdown');
.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:329:  it('T006-D17: Recent relevant memory surfaced → rate = 1.0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:8:describe('hook-state session resume', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:9:  const sessionId = 'test-resume-session';
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:14:  it('recovers session state for resume', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:16:      lastSpecFolder: 'specs/024-compact-code-graph',
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:21:    expect(state!.lastSpecFolder).toBe('specs/024-compact-code-graph');
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:32:  it('preserves compact prime across resume', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:30:   provides global uniqueness.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:63:      console.warn('[eval-logger] generateEvalRunId bootstrap warning:', msg);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:64:      // Keep _evalRunCounterInitialized=false so next call can retry bootstrap.
.opencode/skill/system-spec-kit/mcp_server/lib/graph/temporal-edges.ts:6:// enabling edge invalidation and temporally-scoped graph queries.
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:493:    it('filters exact duplicates by governed scope when scope values are provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:494:      const testContent = 'Tenant scoped duplicate';
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:504:              file_path: '/specs/test/memory/scoped.md',
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:515:        { content: testContent, database: mockDatabase, tenantId: 'tenant-a', userId: 'user-a' } as unknown as DuplicateParams,
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:520:      expect(result.existing_path).toBe('/specs/test/memory/scoped.md');
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:570:    it('redacts duplicate metadata when similar match belongs to a different scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:573:          content: 'Cross-scope similar memory',
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:575:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:579:              file_path: '/specs/test/memory/other-scope.md',
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:596:      expect(result.existing_scope).toBeUndefined();
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:599:    it('redacts exact-duplicate identifiers when cross-scope match is detected', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:600:      const testContent = 'Cross-scope exact duplicate';
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:623:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:624:          userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:634:      expect(result.existing_scope).toBeUndefined();
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:66:  /** Per-query MRR@5 values for bootstrap CI computation. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:69:  bootstrapCI?: BootstrapCIResult;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:287:   Uses bootstrap resampling to compute 95% CI for MRR@5.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:290:/** Result of bootstrap confidence interval computation. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:300:  /** Number of bootstrap iterations. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:312: * Compute bootstrap 95% confidence interval for MRR@5.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:314: * Uses percentile bootstrap with 10,000 iterations (default).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:319: * @param iterations - Number of bootstrap iterations (default: 10000).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:328:  // Filter out NaN/Infinity values to prevent poisoning bootstrap means
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:361:  const bootstrapMeans: number[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:367:    bootstrapMeans.push(sum / n);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:371:  bootstrapMeans.sort((a, b) => a - b);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:376:  const ciLower = bootstrapMeans[lowerIdx];
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:377:  const ciUpper = bootstrapMeans[upperIdx];
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:525:  // Collect per-query MRR for bootstrap CI (REQ-S0-004)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:566:  // Compute bootstrap 95% CI for statistical significance (REQ-S0-004: p<0.05)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:567:  const bootstrapCI = computeBootstrapCI(perQueryMRR);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:575:    bootstrapCI,
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:5:// shared by startup, recovery, and compaction surfaces.
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:9:  | 'resume'
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:11:  | 'bootstrap'
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:12:  | 'compaction';
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:157:    | 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:159:    | 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:160:    | 'compact_merger'
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts:76:  // Penalize very short chunks (< 100 chars after stripping)
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1175:    it('passes governance scope into TM-04 semantic dedup candidate lookup', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1231:      const filePath = createAtomicSaveTargetPath('quality-gate-scope.md');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1237:        scope: {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1238:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1239:          userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1240:          agentId: 'agent-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1242:          sharedSpaceId: 'shared-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1251:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1252:          userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1253:          agentId: 'agent-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1255:          sharedSpaceId: 'shared-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1260:    it('passes governance scope into PE arbitration', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1300:      const filePath = createAtomicSaveTargetPath('pe-scope.md');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1306:        scope: {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1307:          tenantId: 'tenant-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1308:          userId: 'user-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1309:          agentId: 'agent-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1311:          sharedSpaceId: 'shared-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1324:          tenantId: 'tenant-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1325:          userId: 'user-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1326:          agentId: 'agent-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1328:          sharedSpaceId: 'shared-p',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:227: * Clears cached search results globally or for one spec folder.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-types.vitest.ts:147:    it('T080: Type inference from importance_tier mapping', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:28:    isCocoIndexAvailable: vi.fn(() => false),
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:80:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:86:    expect(contract.sourceSurface).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:103:    const contract = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:108:    expect(contract.recommendedAction).toContain('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:109:    expect(contract.sourceSurface).toBe('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:140:    const surfaces = ['auto-prime', 'session_bootstrap', 'session_resume', 'session_health'] as const;
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:164:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:193:| `scopeDimensionsTracked` | `number` | Number of tracked retrieval scope dimensions in this phase |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:5:// This stays intentionally narrow: it evaluates a frozen corpus of compact
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:38:  scope: 'match' | 'mismatch';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:48:  liveBaselineResolution: 'code_graph_query' | 'memory_context' | 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:130:      && scenario.producerMetadata.scope === 'match',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:143:    return 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:146:  return 'memory_context';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:162:    if (resolution === 'memory_context_then_grep') {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:198:  let toolCalls = 1; // session_bootstrap
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:199:  let steps = 1; // parse compact continuity wrapper
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:182: * @returns Record mapping channel name to item count.
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:35:    it('computes correct deltas for overlapping results', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:6:// Verifies feature flag gating, channel-to-flag mapping, ablation runner
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1071:      console.warn('No queries with ground truth — skipping isolation test');
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:11:const originalFetch = globalThis.fetch;
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:28:  globalThis.fetch = originalFetch;
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:48:  globalThis.fetch = vi.fn(async (..._args: Parameters<typeof fetch>): Promise<Response> => {
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:445:      globalThis.fetch = vi.fn(async (..._args: Parameters<typeof fetch>): Promise<Response> => {
.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:469:      globalThis.fetch = vi.fn(async (..._args: Parameters<typeof fetch>): Promise<Response> => {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:93: * Groups results by channel, deduplicates by memory ID (keeping highest score).
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:181:  it('T022: memory_search has tool-specific hints', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:182:    expect(TOOL_SPECIFIC_HINTS.memory_search).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:183:    expect(typeof TOOL_SPECIFIC_HINTS.memory_search).toBe('object');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:221:  it('T029: memory_search EMBEDDING_FAILED has contextual hint', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:224:      TOOL_SPECIFIC_HINTS.memory_search?.[ERROR_CODES.EMBEDDING_FAILED];
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:244:    const searchHint = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:246:      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED];
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:301:      'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:315:    const hasSearch = hasSpecificHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:356:    const searchHints = getAvailableHints('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:362:    const searchHints = getAvailableHints('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:365:      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED];
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:669:  it('T087: QUERY_TOO_LONG suggests memory_match_triggers()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:672:      a.includes('memory_match_triggers()')
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:704:      (a: string) => a.includes('/spec_kit:resume') || a.includes('recovery')
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:713:    const toolSpecific = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:718:      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED]
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:725:    const allSearchHints = getAvailableHints('memory_search');
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:13://   - Sprint labels inferred from metadata JSON or eval_run_id grouping.
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:108:          is_pinned INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:109:/** Weight clamping bounds */
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:306:  if (memory.is_pinned === 1) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:505:  if (memory.is_pinned === 1) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:56:  'is_pinned',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:132:      is_pinned INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:175:    CREATE INDEX IF NOT EXISTS idx_memories_scope ON memory_index(spec_folder, session_id, context_type);
.opencode/skill/system-spec-kit/mcp_server/tests/hook-precompact.vitest.ts:11:describe('precompact hook', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hook-precompact.vitest.ts:12:  const testSessionId = 'test-precompact';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:60:    'idx_save_parent_content_hash_scope',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:121:  CREATE INDEX IF NOT EXISTS idx_save_parent_content_hash_scope
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1112:        logger.warn(`Migration v23: Skipping row ${row.id} — canonicalization failed`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1126:    // P1-3 fix: Migrate session_state.spec_folder using old→new mapping
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1220:        logger.info('Migration v25: CHECK constraint already correct, skipping table rebuild');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1460:    CREATE INDEX IF NOT EXISTS idx_governance_audit_scope
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1466:      CREATE INDEX IF NOT EXISTS idx_memory_scope_hierarchy
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1801:  if (!column_names.includes('is_pinned')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1803:      database.exec(`ALTER TABLE memory_index ADD COLUMN is_pinned INTEGER DEFAULT 0`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1804:      console.warn('[vector-index] Migration: Added is_pinned column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1809:      logDuplicateColumnMigrationSkip('is_pinned', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2033:      'idx_save_parent_content_hash_scope',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2041:      index: 'idx_content_hash/idx_save_parent_content_hash_scope',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2172: * Migrate session_state.spec_folder values using the old→new mapping
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2182:  // Build old→new mapping, keep only unambiguous 1:1 mappings
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2183:  const mapping = new Map<string, Set<string>>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2185:    if (!mapping.has(u.oldSpecFolder)) mapping.set(u.oldSpecFolder, new Set());
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2186:    mapping.get(u.oldSpecFolder)!.add(u.canonical);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2199:    const targets = mapping.get(row.spec_folder);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2205:      logger.warn(`Migration v23: Ambiguous session_state mapping for "${row.spec_folder}". Skipping.`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2222:  const mapping = new Map<string, Set<string>>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2224:    if (!mapping.has(update.oldSpecFolder)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2225:      mapping.set(update.oldSpecFolder, new Set());
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2227:    mapping.get(update.oldSpecFolder)!.add(update.canonical);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2242:    const targets = mapping.get(row.spec_folder);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2248:      logger.warn(`Migration v23: Ambiguous memory_history mapping for "${row.spec_folder}". Skipping.`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2287:        'Existing schema is not fully backward-compatible after bootstrap',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2318:      is_pinned INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2435:    CREATE INDEX IF NOT EXISTS idx_memories_scope ON memory_index(spec_folder, session_id, context_type);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2436:    CREATE INDEX IF NOT EXISTS idx_memories_governed_scope ON memory_index(tenant_id, user_id, agent_id, session_id, shared_space_id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2454:    CREATE INDEX IF NOT EXISTS idx_save_parent_content_hash_scope ON memory_index(
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:90:  scopeDimensionsTracked: number;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:212:      scopeDimensionsTracked: roadmapDefaults.scopeDimensionsTracked,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:429:    scopeDimensionsTracked?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:445:  if (typeof update.scopeDimensionsTracked === 'number' && Number.isFinite(update.scopeDimensionsTracked)) {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:446:    t.architecture.scopeDimensionsTracked = Math.max(0, Math.floor(update.scopeDimensionsTracked));
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:677:        scopeEnforcement: t.architecture.capabilities.scopeEnforcement,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:681:      scopeDimensionsTracked: t.architecture.scopeDimensionsTracked,
.opencode/skill/system-spec-kit/mcp_server/tests/budget-allocator.vitest.ts:34:      // CocoIndex and triggered are empty, their floors + overflow go to others
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1082:    it('EXT-H13: handleCheckpointList rejects whitespace tenantId when sharedSpaceId is provided', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1084:        tenantId: '   ',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1085:        sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1086:      })).rejects.toThrow(/tenantId must be a non-empty string/i);
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:142:    const longContent = 'This is a much longer piece of meaningful content that exceeds one hundred characters after stripping and should not be penalized for length at all.';
.opencode/skill/system-spec-kit/mcp_server/tests/channel-enforcement.vitest.ts:513:  it('T19: preserves global score order when topK is smaller than result list', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:150:  // Machine is slow, keeping the consolidation cycle non-blocking.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:544:    // Fail-closed: broken bookkeeping must not cause unbounded cycle runs
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:546:    console.warn('[consolidation] cadence bookkeeping error:', message);
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:769:    it('limit applies after sprint grouping and report totals match the included scope', async () => {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:584: * @returns Record mapping metric name to computed value in [0, 1].
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:361: * Strategy: SQL query fetches broad candidates (unarchived, not protected, not pinned).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:371:    // Broad SQL pre-filter: get unarchived, non-protected, non-pinned memories
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:377:        AND is_pinned = 0
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts:50:// 3. DATABASE HANDLE (module-scoped, set via initScoringObservability)
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:458:describe('Eval run counter bootstrap across tables', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:459:  async function bootstrapAndGenerateNextId(
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:465:      `eval-logger-bootstrap-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:516:    const id = await bootstrapAndGenerateNextId(7, 12);
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:521:    const id = await bootstrapAndGenerateNextId(15, 9);
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:526:    const id = await bootstrapAndGenerateNextId(null, null);
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:527:    // Counter bootstraps to 0, then returns incremented first run ID.
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:602:        return { success: false, error: 'Embedding provider circuit breaker open — skipping API call' };
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-extractor.vitest.ts:20:      a compaction cycle. The compaction cycle moves live objects to reduce
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-extractor.vitest.ts:26:      global variables that point to heap-allocated objects.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:1:// TEST: memory_context per-channel eval logging (T056)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:88:describe('T056: memory_context emits per-strategy channel eval rows', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:111:      input: 'resume quickly',
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts:7:/** Read the global rollout percentage from SPECKIT_ROLLOUT_PERCENT (0-100, default 100).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts:31: * @param identity - Unique identity string (e.g., flagName, userId)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:159:      'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:160:      'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:162:      'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:200:      'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:201:      'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:288:      'memory_context', 'memory_search', 'memory_quick_search', 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:299:      'session_health', 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:318:      expect(sourceCode).not.toMatch(/name !== 'session_health' && name !== 'session_bootstrap'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:569:      vi.spyOn(global, 'setImmediate').mockImplementation(() => 0 as unknown as NodeJS.Immediate)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:923:        { id: 'call-1', params: { name: 'memory_search', arguments: {} } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:940:      expect(callArgs[0]).toBe('memory_search')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1050:              name: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1099:        memoryAwareTools: new Set<string>(['memory_search']),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1109:        { id: 'call-5', params: { name: 'memory_search', arguments: { query: 'hook validation' } } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1119:    it('T000g: memory_context resume mode invokes TM-05 compaction hook at runtime', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1127:        memoryAwareTools: new Set<string>(['memory_context']),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1132:        triggered: [{ memory_id: 11, matched_phrases: ['resume'] }],
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1140:          params: { name: 'memory_context', arguments: { input: 'session resume context', mode: 'resume' } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1146:      expect(autoSurfaceAtCompactionMock).toHaveBeenCalledWith('session resume context')
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
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2082:      'memory_match_triggers': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2127:    it('T000e: memory_context supports optional tokenUsage (0.0-1.0)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2128:      expect(toolSchemasCode).toMatch(/name:\s*'memory_context'[\s\S]*?tokenUsage:\s*\{\s*type:\s*'number'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2311:        'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2337:      expect(result).toContain('memory_context')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2338:      expect(result).toContain('memory_search')
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:22:} from '../governance/scope-governance.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:172:  scope?: ScopeContext;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:423:function checkpointMetadataMatchesScope(rawMetadata: unknown, scope: ScopeContext): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:424:  const normalizedScope = normalizeScopeContext(scope);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:431:    (normalizedScope.tenantId === undefined || metadata.tenantId === normalizedScope.tenantId)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:432:    && (normalizedScope.userId === undefined || metadata.userId === normalizedScope.userId)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:433:    && (normalizedScope.agentId === undefined || metadata.agentId === normalizedScope.agentId)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:434:    && (normalizedScope.sharedSpaceId === undefined || metadata.sharedSpaceId === normalizedScope.sharedSpaceId)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:450:  scope: ScopeContext = {},
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:456:  const normalizedScope = normalizeScopeContext(scope);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:476:  scope: ScopeContext = {},
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:483:  const { normalizedScope, allowedSharedSpaceIds, predicate } = getScopeFilterContext(database, scope);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:500:  scope: ScopeContext = {},
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:502:  return getScopedMemories(database, specFolder, scope).memoryIds;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:508:  scope: ScopeContext = {},
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:513:  const normalizedScope = normalizeScopeContext(scope);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:521:  if (normalizedScope.tenantId && columns.has('tenant_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:523:    params.push(normalizedScope.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:525:  if (normalizedScope.userId && columns.has('user_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:527:    params.push(normalizedScope.userId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:529:  if (normalizedScope.agentId && columns.has('agent_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:531:    params.push(normalizedScope.agentId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:533:  if (normalizedScope.sharedSpaceId && columns.has('shared_space_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:535:    params.push(normalizedScope.sharedSpaceId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:648:    sharedSpaceIds: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:649:    scope?: ScopeContext;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:653:  const { specFolder, memoryIds, sharedSpaceIds, scope = {}, allowedSharedSpaceIds } = options;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:654:  const normalizedScope = normalizeScopeContext(scope);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:656:  const scopePredicate = hasScope
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:666:    return scopePredicate ? rows.filter((row) => scopePredicate(row)) : rows;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:700:    if (sharedSpaceIds.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:704:        sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:707:    if (normalizedScope.tenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:710:      ).all(normalizedScope.tenantId) as Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:716:    if (sharedSpaceIds.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:720:        sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:747:    if (sharedSpaceIds.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:751:        sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:793:  if (!scopePredicate) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:798:    return allRows.filter((row) => scopePredicate(row));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:810:    sharedSpaceIds: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:811:    scope?: ScopeContext;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:908:    sharedSpaceIds: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:910:    scope?: ScopeContext;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:917:    sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:919:    scope = {},
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:922:  const normalizedScope = normalizeScopeContext(scope);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:934:  const { clauses: scopedClauses, params: scopedParams } = buildRestoreScopeDeleteWhere(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:941:    if (scopedClauses.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:942:      database.prepare(`DELETE FROM memory_index WHERE ${scopedClauses.join(' AND ')}`).run(...scopedParams);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:958:    deleteRowsByStringIds(database, tableName, 'space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:963:    deleteRowsByStringIds(database, tableName, 'space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:968:    if (sharedSpaceIds.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:969:      deleteRowsByStringIds(database, tableName, 'space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:992:  if (scopedClauses.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:993:    database.prepare(`DELETE FROM ${tableName} WHERE ${scopedClauses.join(' AND ')}`).run(...scopedParams);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:997:  if (sharedSpaceIds.length > 0 && columns.has('shared_space_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:998:    deleteRowsByStringIds(database, tableName, 'shared_space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1012:  if (sharedSpaceIds.length > 0 && columns.has('shared_space_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1013:    deleteRowsByStringIds(database, tableName, 'shared_space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1027:    scope?: ScopeContext;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1030:  const { checkpointSpecFolder, memoryIds, scope = {} } = options;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1031:  const hasScope = hasScopeConstraints(normalizeScopeContext(scope));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1070:    sharedSpaceIds: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1072:    scope: ScopeContext;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1244:        `[checkpoints] Skipping post-restore rebuild "${name}" because dependencies did not complete: ${missingDeps.join(', ')}`,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1328:    'is_pinned',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1416:    scope = {},
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1424:        memoryIds: scopedMemoryIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1427:      } = getScopedMemories(database, specFolder, scope);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1428:      const sharedSpaceIds = Array.from(new Set([
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1441:          memoryIds: scopedMemoryIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1442:          sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1443:          scope: normalizedScope,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1487:          ...(normalizedScope.tenantId ? { tenantId: normalizedScope.tenantId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1488:          ...(normalizedScope.userId ? { userId: normalizedScope.userId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1489:          ...(normalizedScope.agentId ? { agentId: normalizedScope.agentId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1490:          ...(normalizedScope.sharedSpaceId ? { sharedSpaceId: normalizedScope.sharedSpaceId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1520:          ...(normalizedScope.tenantId ? { tenantId: normalizedScope.tenantId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1521:          ...(normalizedScope.userId ? { userId: normalizedScope.userId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1522:          ...(normalizedScope.agentId ? { agentId: normalizedScope.agentId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1523:          ...(normalizedScope.sharedSpaceId ? { sharedSpaceId: normalizedScope.sharedSpaceId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1542:  scope: ScopeContext = {},
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1559:      .filter((row) => checkpointMetadataMatchesScope(row.metadata, scope))
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1576:function getCheckpoint(nameOrId: string | number, scope: ScopeContext = {}): CheckpointEntry | null {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1585:    if (checkpoint && !checkpointMetadataMatchesScope(checkpoint.metadata, scope)) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1599:  scope: ScopeContext = {},
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1614:    const checkpoint = getCheckpoint(nameOrId, scope);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1634:    const { normalizedScope, allowedSharedSpaceIds } = getScopeFilterContext(database, scope);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1638:    const scopedMemoryIdsToReplace = Array.from(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1646:    const sharedSpaceIds = Array.from(new Set([
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1717:            memoryIds: scopedMemoryIdsToReplace,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1718:            scope: normalizedScope,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1727:                memoryIds: scopedMemoryIdsToReplace,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1728:                sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1730:                scope: normalizedScope,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1773:                `[checkpoints] Skipping restore of memory ${memory.id}: identity "${memory.spec_folder}:${memory.file_path}:${String(memory.anchor_id ?? '')}" already exists as memory ${existingByPath.id}`
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1804:                  `[checkpoints] Skipping restore of memory ${memory.id}: id collision with existing identity "${existingById.spec_folder}:${existingById.file_path}:${String(existingById.anchor_id ?? '')}"`
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1855:          // In merge mode, replace only the in-scope rows captured by the checkpoint.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1859:              memoryIds: scopedMemoryIdsToReplace,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1860:              sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1862:              scope: normalizedScope,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1922:function deleteCheckpoint(nameOrId: string | number, scope: ScopeContext = {}): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1926:    const checkpoint = getCheckpoint(nameOrId, scope);
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:70:# Shared-memory surface
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:29:- Eval database bootstrap and logging.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:44:| `eval-db.ts` | Eval database bootstrap and schema management |
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:129:      return ['[session] Context quality is CRITICAL. Consider running `memory_context({ mode: "resume" })` or `session_health` to diagnose.'];
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:132:      return ['[session] Context quality is degraded. Session may benefit from a `session_resume` call.'];
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:794:    it('5.1.2 correct mappings', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:1:// TEST: memory_search per-channel eval logging (T056)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:106:describe('T056: memory_search emits per-channel eval rows', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:97:| **temporary** | 0.3 | 0.5x | Yes | 7 days | Session-scoped, auto-expires |
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:104:| **Recency** | 0.40 | Days since last update (primary for "resume work") |
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:38:- Storage helpers assume document-aware columns such as `document_type`, `spec_level`, governance scope columns, and lineage metadata are available.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1334:  it('EXT-H10: divergent_aliases mode returns compact divergent-only payload', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts:5:import { mergeCompactBrief, type MergeInput } from '../lib/code-graph/compact-merger.js';
.opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts:7:describe('compact merger', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts:12:    triggered: 'Trigger: compaction recovery context',
.opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts:45:      expect(result.payloadContract.kind).toBe('compaction');
.opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts:46:      expect(result.payloadContract.provenance.producer).toBe('compact_merger');
.opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts:91:        notes: ['Recovered compact transcript lines were removed before pre-merge selection.'],
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:163:| `createEnvelope(data, trace, degradedMode?, serverVersion?)` | `ContextEnvelope<T>` | New envelope wrapping results + trace + metadata |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:191:Bootstrap and resume remain the authority surfaces for structural context. Packet `006` only adds the shared trust contract beside packet `005`'s certainty contract; it does not create a new graph-only owner surface.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:306:- Preserve the three axes distinctly through bootstrap or resume-facing payloads. Do not merge them into a single "graph trust" label during transport.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:311:- Current owner surfaces remain authoritative: shared payload sections, session bootstrap or resume consumers, and bridge-facing graph payloads.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:111:    metrics['isolation.unscoped_rows'] = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:112:    metrics['isolation.missing_session_scope_rows'] = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:126:  metrics['isolation.unscoped_rows'] = safeScalarMetric(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:130:  metrics['isolation.missing_session_scope_rows'] = safeScalarMetric(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:203:        scopeDimensionsTracked: defaults.scopeDimensionsTracked,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:58:function buildRetrievableMemoryPredicates(alias: string, scopeInfo: MemoryIndexScopeInfo): string[] {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:61:  if (scopeInfo.hasArchivedColumn) {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:65:  if (scopeInfo.hasImportanceTierColumn) {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:139:  const scopeInfo = getMemoryIndexScopeInfo(database);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:140:  const targetPredicates = buildRetrievableMemoryPredicates('m', scopeInfo);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:141:  const siblingPredicates = buildRetrievableMemoryPredicates('m', scopeInfo);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:147:     ${scopeInfo.hasActiveProjection ? 'JOIN active_memory_projection p ON p.active_memory_id = m.id' : ''}
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:161:     ${scopeInfo.hasActiveProjection ? 'JOIN active_memory_projection p ON p.active_memory_id = m.id' : ''}
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:203:  const scopeInfo = getMemoryIndexScopeInfo(database);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:204:  const rowPredicates = buildRetrievableMemoryPredicates('m', scopeInfo);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:205:  const folderPredicates = buildRetrievableMemoryPredicates('m', scopeInfo);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:212:     ${scopeInfo.hasActiveProjection ? 'JOIN active_memory_projection p ON p.active_memory_id = m.id' : ''}
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:248:       ${scopeInfo.hasActiveProjection ? 'JOIN active_memory_projection p ON p.active_memory_id = m.id' : ''}
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts:97:  it('T007b-H7: divergent_aliases reportMode returns compact success payload', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:288:    it('undo removes legacy-format correction-owned edge via scoped fallback only', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:252:├── working-memory.ts           # Session-scoped activation (410 lines)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:573:**Purpose**: Session-scoped attention tracking with capacity limits
.opencode/skill/system-spec-kit/mcp_server/tests/api-validation.vitest.ts:20:const originalFetch = globalThis.fetch;
.opencode/skill/system-spec-kit/mcp_server/tests/api-validation.vitest.ts:34:  globalThis.fetch = originalFetch;
.opencode/skill/system-spec-kit/mcp_server/tests/api-validation.vitest.ts:38:  globalThis.fetch = (async (_url: RequestInfo | URL, fetchOptions?: RequestInit) => {
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:7:// the export surface without bootstrapping a real database.
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:22:  'tool-schemas.js': 780,           // actual: 755 — Expanded MCP schema set + Sprint 019: Zod schema integration, ingest tools + Phase 024 session_bootstrap
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:26:  'handlers/memory-triggers.js': 470, // actual: 454 — Trigger matching with cognitive features + governance/scope wiring
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:30:  'handlers/checkpoints.js': 620,   // actual: 611 — Checkpoint operations plus scoped metadata guards, restore/delete safety checks, SEC-002 scope enforcement, and T012 follow-up fixes
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:31:  'hooks/memory-surface.js': 520,   // actual: 503 — Memory surface hooks with constitutional cache, auto-surface, attention-enriched hints, priming, session snapshots, and Phase 024 bootstrap telemetry
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:208:  const scopeTuple = [
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:216:  if (scopeTuple.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:220:  const scopeHash = createHash('sha256')
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:221:    .update(JSON.stringify(scopeTuple), 'utf8')
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:225:  return `scope-sha256:${scopeHash}`;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:234:  scopePrefix: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:241:    scopePrefix: parts.scopePrefix,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:258:  const scopePrefix = buildScopePrefix(row);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:266:      scopePrefix,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:272:  if (!scopePrefix) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:275:  return `${row.spec_folder}::${scopePrefix}::${canonicalPath}::${anchorId}`;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:856: * Build a compact operator-facing summary for the lineage behind a memory.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:89:   for queries where live DB mapping has not yet been performed.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:106:  // Use the real production DB ID mappings from GROUND_TRUTH_RELEVANCES.
.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:351:          console.warn(`[file-watcher] Skipping reindex outside watch roots: ${path.basename(filePath)}`);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:769:    it('clearSearchCache clears globally', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:37:      kind: 'bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:47:        producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:48:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:477:      'spec': ['spec', 'specification', 'requirements', 'scope', 'what'],
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:865: * Apply min-max normalization to composite scores, mapping to [0,1].
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts:187:    it('T501-08b: Unicode accent stripping', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:502:          console.warn('[reconsolidation] Deprecate target not found, skipping edge insert');
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:21:const mappingChecks = [
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:101:describe('Feature flag reference catalog mappings', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:102:  for (const check of mappingChecks) {
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:24:    it('resume', () => { expect(classifyQueryIntent('resume my last session').intent).toBe('hybrid'); });
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:29:describe('agent routing validates classifier-backed intent mapping', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:43:    it('resume my previous work', () => { expect(classifyQueryIntent('resume my previous work').intent).toBe('hybrid'); });
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:25:/** Full analysis result mapping each tested K-value to its metrics. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:384:  globalBestK: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:668: * @returns Per-intent best-K selections and global best-K
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:677:      globalBestK: BASELINE_K,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:692:  const globalSumNdcg: Record<number, number> = {};
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:693:  let globalQueryCount = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:700:      globalSumNdcg[k] = (globalSumNdcg[k] ?? 0) + metricsPerK[k].ndcg10 * intentQueries.length;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:702:    globalQueryCount += intentQueries.length;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:714:  let globalBestK = BASELINE_K;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:715:  if (globalQueryCount > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:716:    const globalAvgNdcg: Record<number, number> = {};
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:718:      globalAvgNdcg[k] = (globalSumNdcg[k] ?? 0) / globalQueryCount;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:720:    const globalMetrics: Record<number, JudgedKMetrics> = {};
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:722:      globalMetrics[k] = { ndcg10: globalAvgNdcg[k], mrr5Judged: 0, queryCount: globalQueryCount };
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:724:    globalBestK = argmaxNdcg10(globalMetrics);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:729:    globalBestK,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts:68:    description: 'Session-scoped, auto-expires',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:120:    // H1 FIX: Use db-specific cache invalidation instead of the no-op global version
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:415:    // Deduplicate by ID, keeping the higher similarity score
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:244:describe('T020: Quick resume command (DB-dependent)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:246:  it('T020-01: Generates /spec_kit:resume command when specFolder is provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:250:  it('T020-02: Generates memory_search command with sessionId when specFolder is not provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:254:  it('T020-03: Generates generic memory_search when neither specFolder nor sessionId is provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:262:  it('T020-05: specFolder takes precedence over sessionId for resume command', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:183:      expect(typeof handlerExports.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:41:    const result = validateToolArgs('memory_search', {
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:30:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:37:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:43:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:176:  { tool: 'memory_context', handler: 'handleMemoryContext' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:177:  { tool: 'memory_search', handler: 'handleMemorySearch' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:179:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers' },
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:385:        console.warn(`[transaction-manager] Skipping pending recovery because DB file is missing: ${databasePath}`);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:657:        // QueriesChannelHelped = channel was helping (removing it hurt quality)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:89:  /** Mean absolute score delta across overlapping results. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:91:  /** Mean absolute rank delta across overlapping results. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:190: * Only considers overlapping results.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:198:  // Find overlapping IDs and their rank pairs
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:304:  // Compute per-result deltas for overlapping results
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:16:// Timescale: minutes. Operates on session-scoped attention scores only.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:4:// Hierarchical scope enforcement, governed ingest validation,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:10:// Feature catalog: Hierarchical scope governance, governed ingest, retention, and audit
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:19: * Request scope used to enforce tenancy, actor, session, and shared-space boundaries.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:22:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:23:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:24:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:26:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:30: * Governed-ingest fields required to persist scope and retention metadata.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:45:  tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:46:  userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:47:  agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:49:  sharedSpaceId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:83:  allowUnscoped?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:120: * Options used when benchmarking scope-filter behavior.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:128: * Benchmark result for a scope filter predicate.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:153: * Trim and normalize optional scope identifiers before enforcement.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:160:    tenantId: normalizeId(input.tenantId),
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:161:    userId: normalizeId(input.userId),
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:162:    agentId: normalizeId(input.agentId),
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:164:    sharedSpaceId: normalizeId(input.sharedSpaceId),
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:169: * Resolve whether scope filtering is active for the current process.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:170: * Default: OFF — scope enforcement is opt-in via SPECKIT_MEMORY_SCOPE_ENFORCEMENT=true.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:171: * When enabled without scope constraints in the query, all results are rejected
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:172: * (empty scope + enforcement = no access). Only enable when multi-tenant governance
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:173: * is configured with tenantId/userId/agentId/sharedSpaceId in queries.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:175: * @returns `true` when scope enforcement is enabled.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:199: * @returns `true` when governance or scope metadata requires enforcement.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:202:  const scope = normalizeScopeContext(input);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:203:  return Object.values(scope).some((value) => typeof value === 'string')
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:216: * @returns Validation result with normalized scope, provenance, and retention data.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:219:  const scope = normalizeScopeContext(input);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:230:    // B8: Return null instead of empty string for optional scope fields
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:235:        tenantId: scope.tenantId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:236:        userId: scope.userId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:237:        agentId: scope.agentId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:238:        sessionId: scope.sessionId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:239:        sharedSpaceId: scope.sharedSpaceId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:250:  if (!scope.tenantId) issues.push('tenantId is required for governed ingest');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:251:  if (!scope.sessionId) issues.push('sessionId is required for governed ingest');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:252:  if (!scope.userId && !scope.agentId) issues.push('userId or agentId is required for governed ingest');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:269:      tenantId: scope.tenantId ?? '',
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:270:      userId: scope.userId,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:271:      agentId: scope.agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:272:      sessionId: scope.sessionId ?? '',
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:273:      sharedSpaceId: scope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:291:    tenant_id: decision.normalized.tenantId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:292:    user_id: decision.normalized.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:293:    agent_id: decision.normalized.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:295:    shared_space_id: decision.normalized.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:302:      tenantId: decision.normalized.tenantId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:303:      userId: decision.normalized.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:304:      agentId: decision.normalized.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:306:      sharedSpaceId: decision.normalized.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:334:  const scope = normalizeScopeContext(entry);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:345:    scope.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:346:    scope.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:347:    scope.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:348:    scope.sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:349:    scope.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:361: * Determine whether a scope includes at least one concrete constraint.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:363: * @param scope - Scope to inspect for tenant, actor, session, or shared-space bounds.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:364: * @returns `true` when the scope constrains access to at least one boundary.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:366:export function hasScopeConstraints(scope: ScopeContext): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:368:    scope.sharedSpaceId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:369:    || scope.tenantId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:370:    || scope.userId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:371:    || scope.agentId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:372:    || scope.sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:409:  if (normalized.tenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:411:    params.push(normalized.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:413:  if (normalized.userId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:415:    params.push(normalized.userId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:417:  if (normalized.agentId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:419:    params.push(normalized.agentId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:425:  if (normalized.sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:427:    params.push(normalized.sharedSpaceId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:441:    || normalized.tenantId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:442:    || normalized.userId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:443:    || normalized.agentId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:445:    || normalized.sharedSpaceId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:450: * Build a reusable row predicate for scope filtering without re-normalizing each row scan.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:452: * @param scope - Requested scope used for filtering.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:453: * @param allowedSharedSpaceIds - Optional shared-space allowlist for the scope.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:457:  scope: ScopeContext,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:460:  const normalized = normalizeScopeContext(scope);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:465:    // BUG-001 fix: Empty scope under enforcement means no access, not universal access.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:472:      if (normalized.sharedSpaceId && rowSharedSpaceId !== normalized.sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:478:    } else if (normalized.sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:486:      return matchesExactScope(row.tenant_id, normalized.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:489:    return matchesExactScope(row.tenant_id, normalized.tenantId)
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:490:      && matchesExactScope(row.user_id, normalized.userId)
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:491:      && matchesExactScope(row.agent_id, normalized.agentId)
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:508:  const allowUnscoped = filters.allowUnscoped === true;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:509:  // Security: audit enumeration requires explicit scope filters or admin override
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:510:  if (!allowUnscoped && !hasGovernanceAuditFilters(filters)) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:511:    console.warn('[scope-governance] Unscoped governance audit enumeration blocked; explicit filters or allowUnscoped=true required.');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:606:      tenantId: row.tenant_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:607:      userId: row.user_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:608:      agentId: row.agent_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:610:      sharedSpaceId: row.shared_space_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:626: * Benchmark scope filtering with a reusable predicate for rollout and safety checks.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:628: * @param rows - Candidate rows that include governance scope columns.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:629: * @param scope - Requested scope used for filtering.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:635:  scope: ScopeContext,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:641:  const predicate = createScopeFilterPredicate(scope, options.allowedSharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:666: * Filter result rows to the tenant, actor, session, and shared-space scope in force.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:668: * @param rows - Candidate rows that include governance scope columns.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:669: * @param scope - Requested scope used for filtering.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:670: * @param allowedSharedSpaceIds - Optional shared-space allowlist for the scope.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:673:export function filterRowsByScope<T extends Record<string, unknown>>(rows: T[], scope: ScopeContext, allowedSharedSpaceIds?: ReadonlySet<string>): T[] {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:674:  return rows.filter(createScopeFilterPredicate(scope, allowedSharedSpaceIds));
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:18:        memory_context: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:19:        memory_search: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:21:        memory_match_triggers: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:135:    it('T205-B5: Single structured result is compacted to fit within budget', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:216:      expect(modes.resume.tokenBudget).toBe(2000);
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:226:    it('T205-D3: Budget ordering is logical (quick < resume < focused < deep)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:231:      const resumeBudget = modes.resume.tokenBudget;
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:235:      expect(resumeBudget).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:238:      if (quickBudget === undefined || resumeBudget === undefined || focusedBudget === undefined || deepBudget === undefined) {
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:241:      expect(quickBudget).toBeLessThan(resumeBudget);
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:242:      expect(resumeBudget).toBeLessThan(focusedBudget);
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:133:    expect(matchRule('memory_search', 'spec.md error context')).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:134:    expect(matchRule('memory_context', 'spec.md metadata')).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:129:    expect(t.architecture.scopeDimensionsTracked).toBe(5);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:302:      scopeDimensionsTracked: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:311:    expect((json as { architecture?: { phase?: string; scopeDimensionsTracked?: number; capabilities?: { graphUnified?: boolean } } }).architecture?.phase).toBe('graph');
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:312:    expect((json as { architecture?: { phase?: string; scopeDimensionsTracked?: number; capabilities?: { graphUnified?: boolean } } }).architecture?.capabilities?.graphUnified).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:313:    expect((json as { architecture?: { phase?: string; scopeDimensionsTracked?: number; capabilities?: { graphUnified?: boolean } } }).architecture?.scopeDimensionsTracked).toBe(5);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:380:      scopeDimensionsTracked: 6,
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:386:    expect(t.architecture.scopeDimensionsTracked).toBe(6);
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:261:  it('stores scope metadata in cursor payloads when provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:263:    const cursorInfo = createCursor(results, 5, 'scoped query', { scopeKey: 'tenant:user' });
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:267:    expect(payload?.scopeKey).toBe('tenant:user');
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:373:  it('returns null when cursor scope does not match the resuming caller', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:375:    const cursorInfo = createCursor(results, 5, 'scoped query', { scopeKey: 'tenant-a:user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:378:    const resolved = resolveCursor(cursorInfo!.cursor, 5, { scopeKey: 'tenant-b:user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:504:  it('passes cursor scope metadata through the progressive response builder', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:507:    const response = buildProgressiveResponse(results, 5, 'scoped progressive response', {
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:508:      scopeKey: 'tenant-a:user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:512:    const resolved = resolveCursor(response.continuation!.cursor, 5, { scopeKey: 'tenant-a:user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:513:    const rejected = resolveCursor(response.continuation!.cursor, 5, { scopeKey: 'tenant-b:user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:794:    it('creates links only for the saved memory scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:93:  it('clears folder-scoped constitutional cache entries for archived and non-archived keys', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:100:      const specFolder = 'specs/cache-scope';
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:233:  it('keeps custom SQLiteVectorStore instances pinned to their own databases after alternating writes', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:27:  'mcp_server/lib/governance/scope-governance.ts',
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:38:  'mcp_server/lib/governance/scope-policy.ts',
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:46:  'mcp_server/test/security/scope-isolation.test.ts',
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:52:  path.join(SKILL_ROOT, 'feature_catalog', '17--governance', '03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md'),
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:67:  it('parent spec and plan describe the closure pass with current scope, evidence, and support boundaries', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:83:    expect(planContent).not.toContain('root-only scope was confirmed');
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:123:    expect(playbookContent).toContain('### 122 | Governed ingest and scope isolation (Phase 5)');
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:60:| **Content Parsing** | Memory file parsing, trigger matching (with CORRECTION/PREFERENCE signals) and entity scope detection |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:72:| **Chunk Thinning** | R7 anchor-aware chunk scoring and threshold-based dropping at index time |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:292:│   └── scope-governance.ts     # Hierarchical scope enforcement and governed ingest
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:433:**Working Memory**: Manages session-scoped memory activation
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:519:- `tests/full-spec-doc-indexing.vitest.ts`: validates document typing, scoring multipliers and spec-doc intent routing.
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:109:    it('T11: Specific tool-to-layer mappings are correct', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:110:      const expectedMappings: Record<string, string> = {
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:111:        memory_context: 'L1',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:112:        memory_search: 'L2',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:114:        memory_match_triggers: 'L2',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:134:      for (const [tool, expectedLayer] of Object.entries(expectedMappings)) {
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
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:487:        name: 'scoped-edge-snapshot',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:494:      ).get('scoped-edge-snapshot') as { memory_snapshot: Buffer } | undefined);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:504:      mod.deleteCheckpoint('scoped-edge-snapshot');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:507:    it('T503-12: scoped clearExisting restore preserves other spec data and unrelated edges', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:509:        name: 'scoped-edge-restore',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:524:      const result = mod.restoreCheckpoint('scoped-edge-restore', true);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:546:      mod.deleteCheckpoint('scoped-edge-restore');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:549:    it('T503-13: scoped merge restore replaces stale in-folder edges without touching unrelated ones', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:551:        name: 'scoped-edge-merge-restore',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:562:      const result = mod.restoreCheckpoint('scoped-edge-merge-restore', false);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:578:      mod.deleteCheckpoint('scoped-edge-merge-restore');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:602:    it('T503-14: scoped merge restore only replaces auxiliary rows inside the checkpoint scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:637:        name: 'scoped-aux-merge-restore',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:660:      const result = mod.restoreCheckpoint('scoped-aux-merge-restore', false);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:690:    it('T503-15: unscoped merge restore preserves auxiliary rows outside the checkpoint snapshot', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:718:      const checkpoint = mod.createCheckpoint({ name: 'global-merge-unsupported' });
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:748:      const result = mod.restoreCheckpoint('global-merge-unsupported', false);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:793:        name: 'scoped-rollback-restore',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:799:      updateCheckpointSnapshot(database, 'scoped-rollback-restore', (snapshot) => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:811:      const result = mod.restoreCheckpoint('scoped-rollback-restore', false);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:824:    it('T503-17: scoped clearExisting restore preserves same-folder rows outside the tenant scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:831:        name: 'scoped-tenant-clear-restore',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:833:        scope: { tenantId: 'tenant-a' },
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:839:      const result = mod.restoreCheckpoint('scoped-tenant-clear-restore', true, {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:840:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:858:    it('T503-18: unscoped clearExisting restore still replaces the whole checkpoint folder', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:865:        name: 'unscoped-folder-clear-restore',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:872:      const result = mod.restoreCheckpoint('unscoped-folder-clear-restore', true);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:895:    it('T503-19: scoped merge restore respects tenant scope for memory-linked and direct-scope rows', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:902:        name: 'scoped-tenant-merge-restore',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:904:        scope: { tenantId: 'tenant-a' },
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:910:      const result = mod.restoreCheckpoint('scoped-tenant-merge-restore', false, {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:911:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:31:/** Default floor layout for the 4000-token compact brief budget */
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:12:  provenance: ['session_resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:54:        provenance: ['session_resume', 'session_resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:60:describe('session_resume certainty contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:71:  it('surfaces certainty fields in the shared resume payload', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:100:      isCocoIndexAvailable: vi.fn(() => true),
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:118:        sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:123:    const { handleSessionResume } = await import('../handlers/session-resume.js');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:142:      'memory-resume': 'estimated',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:150:describe('session_bootstrap certainty contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:161:  it('surfaces certainty fields in the shared bootstrap payload', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:162:    vi.doMock('../handlers/session-resume.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:169:              memory: { resumed: true },
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:170:              hints: ['resume ok'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:172:                kind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:187:                  producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:188:                  sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:219:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:224:    const { handleSessionBootstrap } = await import('../handlers/session-bootstrap.js');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:238:    expect(parsed.data.payloadContract.summary).toContain('resume=estimated');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:243:      'resume-surface': 'estimated',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:4:// Tracks files and symbols accessed during a session for compaction
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:18:} from '../governance/scope-governance.js';
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:35:  tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:61:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:235: * @param tenantId - Optional tenant to constrain the summary.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:238:export function getSharedRolloutMetrics(database: Database.Database, tenantId?: string): SharedRolloutMetrics {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:240:  const normalizedTenantId = normalizeScopeContext({ tenantId }).tenantId ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:277:    tenantId: normalizedTenantId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:292: * @param tenantId - Optional tenant to constrain the summary.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:297:  tenantId?: string,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:300:  const normalizedTenantId = normalizeScopeContext({ tenantId }).tenantId ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:397:  if (!definition.spaceId?.trim() || !definition.tenantId?.trim()) {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:398:    throw new Error('E_VALIDATION: spaceId and tenantId must be non-empty strings');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:436:    definition.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:469:    definition.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:501: * Collect the shared spaces visible to the provided user or agent scope.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:504: * @param scope - Scope used to filter memberships and tenant boundaries.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:505: * @returns Shared-space identifiers the scope is allowed to see.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:507:export function getAllowedSharedSpaceIds(database: Database.Database, scope: ScopeContext): Set<string> {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:511:  const normalizedScope = normalizeScopeContext(scope);
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:513:  // P0 fix: require tenant context so null scopes cannot enumerate every tenant.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:514:  if (!normalizedScope.tenantId) return new Set();
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:518:    ['user', normalizedScope.userId],
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:519:    ['agent', normalizedScope.agentId],
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:536:      normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:550: * @param scope - Scope requesting shared-space access.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:557:  scope: ScopeContext,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:561:  const normalizedScope = normalizeScopeContext(scope);
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:572:        tenantId: normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:573:        userId: normalizedScope.userId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:574:        agentId: normalizedScope.agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:576:        sharedSpaceId: spaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:615:  if (normalizedScope.tenantId && space.tenant_id !== normalizedScope.tenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:620:  if (isGovernanceGuardrailsEnabled() && !normalizedScope.tenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:656:  `).get(spaceId, normalizedScope.userId ?? '', normalizedScope.agentId ?? '') as { role?: SharedRole } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:713:      sharedSpaceId: args.spaceId,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:73:    expect(snapshot.metrics['isolation.unscoped_rows']).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:74:    expect(snapshot.metrics['isolation.missing_session_scope_rows']).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:57:  'add dark mode support globally',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/index.ts:11:export * from './compact-merger.js';
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:189:    // Create two lists with overlapping items
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:1105:            console.warn(`[structural-indexer] Skipping large file (${(stat.size / 1024).toFixed(1)}KB > ${(maxSize / 1024).toFixed(1)}KB): ${fullPath}`);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:6:// (CocoIndex) vs hybrid (both).
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:8:// Phase 020: Integrated into memory_context handler for query-intent
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:113: * (code graph) and semantic (CocoIndex) retrieval backends.
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
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:476:    const searchHints = TOOL_SPECIFIC_HINTS['memory_search'];
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:492:  it('L1: Returns tool-specific hint for memory_search + E001', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:493:    const hint = getRecoveryHint('memory_search', 'E001');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:512:    const hint = getRecoveryHint('memory_search', 'E040');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:524:  it('M1: Returns true for known tool+code (memory_search, E001)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:525:    expect(hasSpecificHint('memory_search', 'E001')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:543:    const hints = getAvailableHints('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:550:    const hints = getAvailableHints('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:4:// - autoSurfaceAtCompaction:   fires at session compaction lifecycle point
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:12:import { mergeCompactBrief } from '../lib/code-graph/compact-merger.js';
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:13:import type { MergeInput } from '../lib/code-graph/compact-merger.js';
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:127:  it('returns null for memory_context (prevents recursive surfacing)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:128:    const result = await autoSurfaceAtToolDispatch('memory_context', { input: 'some context' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:132:  it('returns null for memory_search', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:133:    const result = await autoSurfaceAtToolDispatch('memory_search', { query: 'some query' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:137:  it('returns null for memory_match_triggers', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:138:    const result = await autoSurfaceAtToolDispatch('memory_match_triggers', { prompt: 'some prompt' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:300:  it('fires matcher once at tool-dispatch and once at compaction lifecycle points', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:305:    await autoSurfaceAtCompaction('compaction lifecycle context');
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:309:    expect(matchSpy).toHaveBeenNthCalledWith(2, 'compaction lifecycle context', 5);
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:569:  it('compaction hook also enforces result limit via matchTriggerPhrases', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:609:  it('compaction output boundary enforces estimated token budget', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:622:    const result = await autoSurfaceAtCompaction('compaction context for budget enforcement');
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:698:    await autoSurfaceAtCompaction('compaction session context');
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:743:describe('compaction pipeline integration', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:749:      triggered: '## Triggered\nRecent auth memory surfaced.',
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:799:      triggered: repeat('## Triggered\nRecent auth memory surfaced from specs/007.', 100),
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:304:  `).run(1, 'sess-1', 1, 0.9, now, later, 2, 1, 1, 'memory_search', 'call-1', 'rule-1', 0);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:365:  `).run(1, 'scope_check', 'allow', 1, 'specs/022-hybrid-rag-fusion::/tmp/specs/022/alpha.md::_', 'tenant-a', 'user-a', 'agent-a', 'sess-1', 'space-1', 'seed governance', '{"phase":"seed"}', later);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:12:    content: [{ type: 'text', text: JSON.stringify({ data: { results: [], count: 0 }, meta: { tool: 'memory_search' } }) }],
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:41:  it('forwards governed scope fields through memory_quick_search', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:44:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:45:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:46:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:47:      sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:53:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:54:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:55:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:56:      sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:188:  describe('namespace scoping', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:50:    tools: ['memory_context', 'session_resume', 'session_bootstrap']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:59:    tools: ['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:13:export type HookPolicy = 'enabled' | 'disabled_by_scope' | 'unavailable' | 'unknown';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:74:    return 'disabled_by_scope';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:87:    if (!existsSync(hooksDir)) return 'disabled_by_scope';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:90:    if (hookFiles.length === 0) return 'disabled_by_scope';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:105:    return 'disabled_by_scope';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:145:  // CANONICAL SOURCES (new compact format)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:168:  // DISTINGUISHING EVIDENCE (new compact format)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:181:  // DETAILED CHANGES, DECISIONS, CONVERSATION are no longer mandatory in compact format
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:183:  // For testing purposes, we'll omit them to validate the compact contract
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1036:    // Parser should reject (content < 5 after stripping? or validation fails)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:83:// ── Node type → SymbolKind mapping ─────────────────────────────
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:4:// LLM-oriented compact graph neighborhoods with CocoIndex seed support.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:278: * Format sections into compact text brief within token budget.
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:72:| `layer-definitions.ts` | Layer constants, tool-to-layer mapping, token budget helpers, documentation generator |
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:132:const budget = getTokenBudget('memory_search');
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:139:const enhanced = enhanceDescription('memory_search', 'Search memories');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:27:  describe('compact source handling', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:28:    it('reads cached compact payload from hook state', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:46:      // Simulate what session-prime does for compact source
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:78:    it('wraps recovered compact content with provenance markers', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:82:        sourceSurface: 'compact-cache',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:85:      expect(wrapped).toContain('[PROVENANCE: producer=hook_cache; trustState=cached; sourceSurface=compact-cache]');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:120:    it('compact output uses larger budget', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:130:      expect(['startup', 'resume', 'compact', 'clear']).toContain(source);
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:133:    it('routes compact correctly', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:134:      const source = 'compact';
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:135:      expect(source).toBe('compact');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:140:describe('session bootstrap fail-closed trust handling', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:151:  it('keeps structural snapshot trust off the errored resume payload while preserving it on structural context', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:152:    vi.doMock('../handlers/session-resume.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:154:        throw new Error('synthetic resume failure');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:176:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:181:    const { handleSessionBootstrap } = await import('../handlers/session-bootstrap.js');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:188:    expect(parsed.data.resume.error).toContain('synthetic resume failure');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:189:    expect(parsed.data.resume).not.toHaveProperty('parserProvenance');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:190:    expect(parsed.data.resume).not.toHaveProperty('evidenceStatus');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:191:    expect(parsed.data.resume).not.toHaveProperty('freshnessAuthority');
.opencode/skill/system-spec-kit/mcp_server/tests/session-analytics-db.vitest.ts:31:    lastSpecFolder: 'specs/system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader',
.opencode/skill/system-spec-kit/mcp_server/tests/session-analytics-db.vitest.ts:133:      last_spec_folder: 'specs/system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader',
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:4:// Validates FolderScore formula, damping, enrichment, two-phase
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:48:      // M = 2, damping = 1/sqrt(3), sum = 1.4
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:68:      // M = 1, damping = 1/sqrt(2), sum = 0.9
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:81:     T020-02: Damping factor verification
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:83:  describe('Damping factor', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:84:    it('T020-02: folder with 9 results (damping=1/sqrt(10)) vs 1 result (damping=1/sqrt(2))', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:101:      const largeDamping = 1 / Math.sqrt(10);
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:102:      const smallDamping = 1 / Math.sqrt(2);
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:103:      const expectedLarge = largeDamping * 4.5;
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:104:      const expectedSmall = smallDamping * 0.9;
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:109:      // Large folder still wins here due to volume, but damping reduces its advantage
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:111:      // Verify damping is applied (raw sum 4.5 >> 0.9 but damped score ratio is much closer)
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:119:     T020-03: Large folder damping — quality over quantity
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:121:  describe('Large folder damping', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:185:      const folderMap = buildFolderMap([]); // No mappings
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:254:      // All single-result folders have same damping (1/sqrt(2))
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:370:      // Verify the top folder is folder-top (higher individual scores + same damping)
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:379:    it('T020-11a: returns correct mapping from mock database', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:3:Core implementation for the structural code graph system. Provides file parsing, SQLite storage, graph queries, CocoIndex bridge, budget allocation, and compaction merging.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:12:| `seed-resolver.ts` | Resolves CocoIndex file:line results to graph nodes |
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:16:| `compact-merger.ts` | 3-source merge (Memory + Code Graph + CocoIndex) for compaction |
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:22:- **CocoIndex** (semantic, external MCP): finds relevant code by concept
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:26:The compact-merger combines all three under a 4000-token budget for compaction injection.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:75:      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:76:      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:4:// Phase 026: Build a compact startup brief for hook-capable runtimes
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:10:import { isCocoIndexAvailable } from '../utils/cocoindex-path.js';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:47:function compactPath(filePath: string): string {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:57:  return `- ${highlight.name} (${highlight.kind}) - ${compactPath(highlight.filePath)}${callSuffix}`;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:62:    notation: value >= 1000 ? 'compact' : 'standard',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:96:    : 'startup summary only (resume on demand)';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:124:    `- CocoIndex: ${args.cocoIndexAvailable ? 'available' : 'missing'}`,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:160:      lines.push('Orientation: use code graph highlights for structural entry points and call paths; use CocoIndex for semantic discovery when the symbol or file is still unknown.');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:199:  const cocoIndexAvailable = isCocoIndexAvailable();
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:4:// Merges context from multiple sources (Memory, Code Graph, CocoIndex, Session)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:5:// into a unified compact brief for compaction injection.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:18:  cocoIndex: string;         // Semantic neighbors (from CocoIndex)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:30:/** Merged compact brief with metadata */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:114: * Merge context from multiple sources into a compact brief.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:192:      kind: 'compaction',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:207:        producer: 'compact_merger',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:208:        sourceSurface: 'compaction',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:212:        sourceRefs: ['budget-allocator', 'compact-merger'],
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:31:  handle_memory_context,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:104:    expect(modes).toContain('resume');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:132:  it('T006: resume mode has resume strategy and 2000 token budget', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:133:    const resumeMode: ContextMode = CONTEXT_MODES.resume;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:134:    expect(resumeMode.strategy).toBe('resume');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:135:    expect(resumeMode.tokenBudget).toBe(2000);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:226:  it('T020: No intent maps to quick or resume by default', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:229:      expect(mode).not.toBe('resume');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:235:   T021-T030: handle_memory_context MAIN HANDLER TESTS
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:239:  it('T021: handle_memory_context is a function', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:286:  it('T029: handleMemoryContext is alias for handle_memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:287:    expect(handleMemoryContext).toBe(handle_memory_context);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:301:      resumedSession: false,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:320:  it('prioritizes resumed-session and explicit-mode reasons deterministically', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:321:    const resumed = buildSessionTransitionTrace({
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:323:      resumedSession: true,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:324:      effectiveMode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:330:    expect(resumed.signalSources).toEqual([
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:331:      'session-resume',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:335:    expect(resumed.confidence).toBe(0.95);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:336:    expect(resumed.reason).toBe('resumed session inferred resume mode');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:340:      resumedSession: false,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:372:      resumedSession: false,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:571:  it('T061: Resume mode strategy is resume', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:572:    expect(CONTEXT_MODES.resume.strategy).toBe('resume');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:576:    expect(CONTEXT_MODES.resume.name).toBe('Resume');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:580:    const desc: string = CONTEXT_MODES.resume.description.toLowerCase();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:582:      desc.includes('session') || desc.includes('previous') || desc.includes('resume') || desc.includes('state')
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:587:    expect(CONTEXT_MODES.resume.tokenBudget).toBe(2000);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:591:    const resumeBudget: number = CONTEXT_MODES.resume.tokenBudget!;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:593:    expect(resumeBudget).toBeLessThan(deepBudget);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:598:    expect(mappedModes).not.toContain('resume');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:603:    const resumeCount: number = strategies.filter((s: string) => s === 'resume').length;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:604:    expect(resumeCount).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:608:    const desc: string = CONTEXT_MODES.resume.description.toLowerCase();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:615:    expect(CONTEXT_MODES.resume.description.length).toBeGreaterThan(10);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:619:    const resume: ContextMode = CONTEXT_MODES.resume;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:620:    expect(resume.name).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:621:    expect(resume.description).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:622:    expect(resume.strategy).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:623:    expect(resume.tokenBudget).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:667:    // Based on INTENT_TO_MODE mapping, auto can route to deep or focused
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:668:    // And via keyword detection, can route to resume
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:674:    // Verified by examining the mapping
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:728:    const resume: number = CONTEXT_MODES.resume.tokenBudget!;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:732:    expect(quick).toBeLessThan(resume);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:733:    expect(resume).toBeLessThan(focused);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:844:  it('T101: handle_memory_context is exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:849:    expect(Object.keys(CONTEXT_MODES).sort()).toEqual(['auto', 'deep', 'focused', 'quick', 'resume']);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:865:  it('T105: handleMemoryContext is same as handle_memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:866:    expect(handleMemoryContext).toBe(handle_memory_context);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:899:      meta: { tool: 'memory_search' }
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:1002:      resume: 2000
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:4:// Resolves CocoIndex search results (file:line) to code graph nodes.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:10:/** A seed from CocoIndex or other providers */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:18:/** Native CocoIndex search result as a seed */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:19:export interface CocoIndexSeed {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:43:export type AnySeed = CodeGraphSeed | CocoIndexSeed | ManualSeed | GraphSeed;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:66:function isCocoIndexSeed(seed: unknown): seed is CocoIndexSeed {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:86:/** Resolve a CocoIndex seed by converting to CodeGraphSeed and delegating */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:87:export function resolveCocoIndexSeed(seed: CocoIndexSeed): ArtifactRef {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:268:  if (isCocoIndexSeed(seed)) return resolveCocoIndexSeed(seed);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:274:/** Resolve multiple seeds, deduplicate overlapping refs */
.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:318:  it('D3-SWEEP-OFF-1: empty query set returns globalBestK=60 and empty byIntent', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:320:    expect(result.globalBestK).toBe(BASELINE_K);
.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:325:  it('D3-SWEEP-OFF-2: non-empty queries still return globalBestK=60 without running sweep', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:328:    expect(result.globalBestK).toBe(BASELINE_K);
.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:337:    expect(result.globalBestK).toBe(BASELINE_K);
.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:351:  it('D3-SWEEP-ON-1: empty query set returns globalBestK=60', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:353:    expect(result.globalBestK).toBe(BASELINE_K);
.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:384:  it('D3-SWEEP-ON-4: globalBestK is in JUDGED_K_SWEEP_VALUES', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:389:    expect(JUDGED_K_SWEEP_VALUES).toContain(result.globalBestK as typeof JUDGED_K_SWEEP_VALUES[number]);
.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:415:  it('D3-SWEEP-ON-7: all intents combined produce a global bestK', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:423:    expect(result.globalBestK).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:424:    expect(JUDGED_K_SWEEP_VALUES).toContain(result.globalBestK as typeof JUDGED_K_SWEEP_VALUES[number]);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:34:        is_pinned: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:96:  // 4.3 is_pinned boolean↔integer round-trip
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:97:  describe('is_pinned ↔ isPinned boolean/integer round-trip', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:98:    it('T-NR-05: is_pinned 0 → false → 0 → false', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:100:      const memory = dbRowToMemory({ id: 1, is_pinned: 0, spec_folder: 'a', file_path: 'b' });
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:104:      expect(backRow.is_pinned).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:111:    it('T-NR-06: is_pinned 1 → true → 1', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:113:      const memory = dbRowToMemory({ id: 2, is_pinned: 1, spec_folder: 'a', file_path: 'b' });
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:117:      expect(backRow.is_pinned).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:120:    it('T-NR-07: is_pinned null → isPinned false/null', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:122:      const memory = dbRowToMemory({ id: 3, is_pinned: null, spec_folder: 'a', file_path: 'b' });
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:138:        is_pinned: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:148:        anchor_id: null, is_pinned: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:158:        stability: null, is_pinned: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:168:        last_review: null, is_pinned: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:193:        is_pinned: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:58:        CREATE INDEX idx_save_parent_content_hash_scope
.opencode/skill/system-spec-kit/mcp_server/tests/db-dimension-integrity.vitest.ts:161:      expect(() => initializeDb(dbPath)).toThrow(/EMBEDDING DIMENSION MISMATCH|Refusing to bootstrap/i);
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
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:248:  describe('Governed scope forwarding', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:265:    it('forwards governed scope fields through deep-mode search routing', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:270:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:271:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:272:          agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:273:          sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:276:        'scope-forward-deep'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:281:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:282:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:283:        agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:284:        sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:288:    it('forwards governed scope fields through resume-mode search routing', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:291:          input: 'resume session',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:292:          mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:293:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:294:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:295:          agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:296:          sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:299:        'scope-forward-resume'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:303:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:304:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:305:        agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:306:        sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:319:        resume: 2000,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:499:    it('T524-6: INTENT_TO_MODE mapping is correct', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:500:      const expectedMappings: Record<string, string> = {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:508:      for (const [intent, expectedMode] of Object.entries(expectedMappings)) {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:515:  describe('Session lifecycle metadata and resume context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:516:    it('T027k: missing sessionId generates ephemeral UUID scope', async () => {
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
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:11:import SpecKitCompactCodeGraphPlugin from '../../../../plugins/spec-kit-compact-code-graph.js';
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:23:          trackedPayloadKinds: ['resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:29:          payloadKind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:30:          dedupeKey: 'system:resume',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:31:          content: 'Summary: resume summary',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:36:          payloadKind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:37:          dedupeKey: 'messages:resume:0',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:40:        compaction: {
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:41:          hook: 'experimental.session.compacting',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:43:          payloadKind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:44:          dedupeKey: 'compaction:resume',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:45:          content: 'Summary: compaction note',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:68:describe('Spec Kit compact code graph plugin', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:91:        expect.stringContaining('spec-kit-compact-code-graph-bridge.mjs'),
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:102:    const pluginModule = await import('../../../../plugins/spec-kit-compact-code-graph.js');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:126:        specKitCompactCodeGraph: 'messages:resume:0',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:145:          tool: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:164:  it('adds a compaction note and invalidates cache on session events', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:168:    await hooks['experimental.session.compacting']?.({ sessionID: 's3' }, output);
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:169:    await hooks['experimental.session.compacting']?.({ sessionID: 's3' }, output);
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:186:    await hooks['experimental.session.compacting']?.({ sessionID: 's3' }, { context: [] });
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:199:    const status = await hooks.tool?.spec_kit_compact_code_graph_status.execute({});
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:201:    expect(status).toContain('plugin_id=spec-kit-compact-code-graph');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:203:    expect(status).toContain('resume_mode=minimal');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:227:    const status = await hooks.tool?.spec_kit_compact_code_graph_status.execute({});
.opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:13:  it.todo('compact-inject should treat a missing transcript file as an empty tail without throwing');
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:20:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:58:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:97:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:108:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:135:        tool: 'memory_search'
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:143:        tool: 'memory_search'
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:152:        tool: 'memory_search'
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:186:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:206:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:254:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:312:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:352:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:363:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:373:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:384:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:409:        tool: 'memory_search'
.opencode/skill/system-spec-kit/mcp_server/tests/learned-combiner.vitest.ts:473:      // For linear SHAP: sum of SHAP values + E[f(x)] = f(x) (before clamping)
.opencode/skill/system-spec-kit/mcp_server/tests/learned-combiner.vitest.ts:484:      // f(x) = bias + sum(weight_i * x_i) (before clamping)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:29:    tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:30:    userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:31:    agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:33:    sharedSpaceId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:66:    params.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:67:    params.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:68:    params.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:70:    params.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:163:  it('derives distinct logical keys for memories that only differ by tenant scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:164:    const filePath = '/tmp/specs/015-memory-state/memory/scoped-tenant.md';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:171:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:179:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:184:      actor: 'ops:tenant-scope',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:189:      actor: 'ops:tenant-scope',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:194:    expect(tenantA.logicalKey).toContain('scope-sha256:');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:195:    expect(tenantB.logicalKey).toContain('scope-sha256:');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:205:  it('derives distinct logical keys for memories that only differ by user scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:206:    const filePath = '/tmp/specs/015-memory-state/memory/scoped-user.md';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:213:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:214:      userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:222:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:223:      userId: 'user-b',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:228:      actor: 'ops:user-scope',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:233:      actor: 'ops:user-scope',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:242:  it('preserves the legacy logical key format for unscoped memories', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:243:    const filePath = '/tmp/specs/015-memory-state/memory/unscoped.md';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:248:      title: 'Unscoped v1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:254:      actor: 'ops:unscoped-compat',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:258:    expect(recorded.logicalKey).toBe('specs/015-memory-state::/tmp/specs/015-memory-state/memory/unscoped.md::_');
.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:156:    // globalMaxRawScore = 2 * 1/61 (both channels hit item at rank 0)
.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:157:    // But globalMax is computed after accumulation (1/61 + 1/61 = 2/61)
.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:173:    // Use very high beta to force clamping
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:169:  it('handles punctuation correctly by stripping it during tokenization', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts:63:      scopeEnforcement: true,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts:117:  it('tracks all five scope dimensions in roadmap defaults', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts:118:    expect(getMemoryRoadmapDefaults().scopeDimensionsTracked).toBe(5);
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:86:    expect(envelope.meta.tool).toBe('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:131:describe('session bootstrap trust preservation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:144:  it('preserves separate trust axes through real session_resume and session_bootstrap outputs', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:151:            data: { resumed: true },
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:167:      isCocoIndexAvailable: vi.fn(() => true),
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:190:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:195:    const { handleSessionResume } = await import('../handlers/session-resume.js');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:196:    const resumeResult = await handleSessionResume({ specFolder: 'specs/026-root' });
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:197:    const parsedResume = JSON.parse(resumeResult.content[0].text);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:198:    const resumeStructuralSection = parsedResume.data.payloadContract.sections.find(
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:202:    expect(resumeStructuralSection?.structuralTrust).toEqual({
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:208:    const { handleSessionBootstrap } = await import('../handlers/session-bootstrap.js');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:215:    expect(parsed.data.resume).toMatchObject({
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:40:      is_pinned INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:309:  it('returns 0 for fewer than 2 overlapping items', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:632:  it('only includes overlapping items in deltas', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:278:  it('creates save-path optimization indexes for canonical-path and scoped hash lookups', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:286:        AND name IN ('idx_save_parent_content_hash_scope', 'idx_save_parent_canonical_path')
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:297:        name: 'idx_save_parent_content_hash_scope',
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:19:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/query-flow-tracker.vitest.ts:59:    trackQueryAndDetect(db, 'sess-b', 'memory context resume', 'q1', ['mem-9']);
.opencode/skill/system-spec-kit/mcp_server/tests/query-flow-tracker.vitest.ts:61:    const detection = trackQueryAndDetect(db, 'sess-b', 'resume memory context', 'q2', ['mem-10']);
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:50:    const response = buildErrorResponse('memory_search', error);
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:68:    const response = buildErrorResponse('memory_search', error);
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:83:    const response = buildErrorResponse('memory_search', error);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:123:describe('memory_search UX hook integration', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:180:  it('rejects continuation cursors when the resuming scope does not match the original query scope', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:183:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:184:      userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:190:    const resumed = await handleMemorySearch({
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:192:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:193:      userId: 'user-b',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:195:    const resumedEnvelope = parseEnvelope(resumed);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:196:    const resumedData = resumedEnvelope.data as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:198:    expect(resumedEnvelope.summary).toBe('Error: Cursor is invalid, expired, or out of scope');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:199:    expect(resumedData.error).toBe('Cursor is invalid, expired, or out of scope');
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
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:275:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:296:    it('rejects scope mismatches for bound sessions', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:300:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:301:        userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:304:      const result = sm.resolveTrustedSession('bound-session', { tenantId: 'tenant-b', userId: 'user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:307:      expect(result.error).toContain('different tenantId');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:314:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:318:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:319:        userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:323:      expect(result.error).toContain('different userId');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:400:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:401:        userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:402:        agentId: 'agent-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:493:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:509:        expect(state.tenantId).toBe('tenant-a');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:529:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:530:        userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:533:      const r = sm.recoverState('recover-bound', { tenantId: 'tenant-b', userId: 'user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:536:      expect(r.error).toContain('different tenantId');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:551:      sm.saveSessionState('int-1', { specFolder: 'specs/A', currentTask: 'task A', tenantId: 'tenant-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:552:      sm.saveSessionState('int-2', { specFolder: 'specs/B', currentTask: 'task B', tenantId: 'tenant-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:569:    it('filters interrupted sessions by bound identity when caller scope is provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:571:      sm.saveSessionState('int-scope-a', { currentTask: 'task A', tenantId: 'tenant-a', userId: 'user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:572:      sm.saveSessionState('int-scope-b', { currentTask: 'task B', tenantId: 'tenant-b', userId: 'user-b' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:576:      const r = sm.getInterruptedSessions({ tenantId: 'tenant-a', userId: 'user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:579:      expect(ids).toContain('int-scope-a');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:581:      expect(ids).not.toContain('int-scope-b');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:615:      expect(md).toContain('/spec_kit:resume specs/005');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:625:      // Without specFolder, should use sessionId-based resume command
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:626:      expect(md).toContain('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:287:    it('T500-09c: overlapping anchors are rejected', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:288:      const overlappingContent = `<!-- ANCHOR:outer -->
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:295:      const validation = memoryParser.validateAnchors(overlappingContent);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:424:Contenu en francais: cafe, resume, naive, cliche.
.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/contradiction-pairs.json:43:      "category": "scope-conflict"
.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/contradiction-pairs.json:91:      "category": "scope-exception"
.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/contradiction-pairs.json:104:      "scope-conflict": "All vs some/none scope conflicts",
.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/contradiction-pairs.json:110:      "scope-exception": "General rule vs specific exception",
.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/runtime-fixtures.ts:9:  hookPolicy: 'enabled' | 'disabled_by_scope' | 'unavailable';

mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "nl -ba .opencode/plugins/spec-kit-compact-code-graph.js | sed -n '360,460p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '740,810p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '200,330p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   261	        type: 'boolean',
   262	        default: false,
   263	        description: 'When true in full mode, attempts best-effort repair actions for detected health issues (e.g., FTS rebuild).'
   264	      },
   265	      confirmed: {
   266	        type: 'boolean',
   267	        default: false,
   268	        description: 'Required with autoRepair:true to execute repair actions. When false or omitted, memory_health returns a confirmation-only response.'
   269	      }
   270	    },
   271	    required: []
   272	  },
   273	};
   274	
   275	// L4: Mutation - Modify existing memories (Token Budget: 500)
   276	const memoryDelete: ToolDefinition = {
   277	  name: 'memory_delete',
   278	  description: '[L4:Mutation] Delete a memory by ID or all memories in a spec folder. Use to remove incorrect or outdated information. Requires EITHER id (single delete) OR specFolder + confirm:true (bulk delete). Token Budget: 500.',
   279	  inputSchema: {
   280	    type: 'object',
   281	    additionalProperties: false,
   282	    'x-requiredAnyOf': [['id'], ['specFolder', 'confirm']],
   283	    properties: {
   284	      id: { type: 'number', minimum: 1, description: 'Memory ID to delete (single delete mode)' },
   285	      specFolder: { type: 'string', minLength: 1, description: 'Delete all memories in this spec folder (bulk delete mode, requires confirm: true)' },
   286	      confirm: { type: 'boolean', const: true, description: 'Safety gate. When provided, confirm must be true.' }
   287	    }
   288	  },
   289	};
   290	
   291	const memoryUpdate: ToolDefinition = {
   292	  name: 'memory_update',
   293	  description: '[L4:Mutation] Update an existing memory with corrections. Re-generates embedding if content changes. Token Budget: 500.',
   294	  inputSchema: { type: 'object', additionalProperties: false, properties: { id: { type: 'number', minimum: 1, description: 'Memory ID to update' }, title: { type: 'string', description: 'New title' }, triggerPhrases: { type: 'array', items: { type: 'string' }, description: 'Updated trigger phrases' }, importanceWeight: { type: 'number', minimum: 0, maximum: 1, description: 'New importance weight (0-1)' }, importanceTier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Set importance tier. Constitutional tier memories always surface at top of results.' }, allowPartialUpdate: { type: 'boolean', default: false, description: 'Allow update to succeed even if embedding regeneration fails. When true, metadata changes are applied and the embedding is marked for re-index. When false (default), the entire update is rolled back on embedding failure.' } }, required: ['id'] },
   295	};
   296	
   297	const memoryValidate: ToolDefinition = {
   298	  name: 'memory_validate',
   299	  description: '[L4:Mutation] Record validation feedback for a memory. Tracks whether memories are useful, updating confidence scores. Memories with high confidence and validation counts may be promoted to critical tier. Token Budget: 500.',
   300	  inputSchema: {
   301	    type: 'object',
   302	    additionalProperties: false,
   303	    properties: {
   304	      id: { type: 'number', minimum: 1, description: 'Memory ID to validate' },
   305	      wasUseful: { type: 'boolean', description: 'Whether the memory was useful (true increases confidence, false decreases it)' },
   306	      queryId: { type: 'string', description: 'Optional query identifier to attach implicit feedback/ground-truth selection context' },
   307	      queryTerms: { type: 'array', items: { type: 'string' }, description: 'Optional normalized query terms used for learned feedback term extraction' },
   308	      resultRank: { type: 'number', minimum: 1, description: 'Optional rank position (1-based) of the selected memory in search results' },
   309	      totalResultsShown: { type: 'number', minimum: 1, description: 'Optional total number of results shown to the user' },
   310	      searchMode: { type: 'string', description: 'Optional search mode context (search/context/trigger)' },
   311	      intent: { type: 'string', description: 'Optional classified intent associated with the originating query' },
   312	      sessionId: { type: 'string', description: 'Optional session identifier for selection telemetry' },
   313	      notes: { type: 'string', description: 'Optional free-form notes associated with this validation event' },
   314	    },
   315	    required: ['id', 'wasUseful']
   316	  },
   317	};
   318	
   319	const memoryBulkDelete: ToolDefinition = {
   320	  name: 'memory_bulk_delete',
   321	  description: '[L4:Mutation] Bulk delete memories by importance tier. Use to clean up deprecated or temporary memories at scale. Auto-creates checkpoint before deletion for safety. Refuses unscoped deletion of constitutional/critical tiers. Supports optional checkpoint bypass for lower-risk tiers when speed is prioritized. Token Budget: 500.',
   322	  inputSchema: { type: 'object', additionalProperties: false, properties: { tier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Importance tier to delete (required)' }, specFolder: { type: 'string', description: 'Optional: scope deletion to a specific spec folder' }, confirm: { type: 'boolean', const: true, description: 'Required safety gate: must be true to proceed' }, olderThanDays: { type: 'number', minimum: MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS, description: 'Optional: only delete memories older than this many days' }, skipCheckpoint: { type: 'boolean', default: false, description: 'Optional speed optimization for non-critical tiers. When true, skips auto-checkpoint creation before delete. Rejected for constitutional/critical tiers.' } }, required: ['tier', 'confirm'] },
   323	};
   324	
   325	// L5: Lifecycle - Checkpoints and versioning (Token Budget: 600)
   326	const checkpointCreate: ToolDefinition = {
   327	  name: 'checkpoint_create',
   328	  description: '[L5:Lifecycle] Create a named checkpoint of current memory state for later restoration. Token Budget: 600.',
   329	  inputSchema: {
   330	    type: 'object',

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
/bin/zsh -lc 'rg -n "retrievalLevel|graphEvidence|vector|fts5|bm25|hybrid|channel|rrf|fusion|is_pinned|pinned" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts .opencode/skill/system-spec-kit/mcp_server/core/db-state.ts .opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:40:      is_pinned INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:15:/** Minimal vector index interface for database operations */
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:25:  vectorSearch?: VectorSearchFn;
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:44:  init(database: DatabaseLike, vectorSearch: VectorSearchFn | undefined, graphSearch?: GraphSearchFn | null): void;
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:64:  vectorIndex?: VectorIndexLike;
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:67:  hybridSearch?: HybridSearchLike;
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:97:let vectorIndex: VectorIndexLike | null = null;
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:100:let hybridSearch: HybridSearchLike | null = null;
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:105:let vectorIndexListenerCleanup: (() => void) | null = null;
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:133:  if (vectorIndexListenerCleanup) {
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:134:    vectorIndexListenerCleanup();
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:135:    vectorIndexListenerCleanup = null;
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:143:  vectorIndexListenerCleanup = nextVectorIndex.onDatabaseConnectionChange((database: DatabaseLike) => {
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:163:  if (hybridSearch) {
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:165:      console.warn('[db-state] hybridSearch reinit missing graphSearchFn; graph retrieval channel is disabled');
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:167:    hybridSearch.init(database, vectorIndex?.vectorSearch, graphSearchFnRef ?? null);
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:191:  if (deps.vectorIndex) {
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:192:    vectorIndex = deps.vectorIndex;
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:193:    registerVectorIndexListener(deps.vectorIndex);
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:199:  if (deps.hybridSearch) hybridSearch = deps.hybridSearch;
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:247:  if (!vectorIndex) {
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:248:    throw new Error('db-state not initialized: vector_index is null');
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:271:      if (typeof vectorIndex.closeDb === 'function') {
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:272:        vectorIndex.closeDb();
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:274:      vectorIndex.initializeDb();
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:279:    const database = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:396:  if (!vectorIndex) {
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:397:    throw new Error('db-state not initialized: vector_index is null');
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:409:    const db = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:504:  if (!vectorIndex) {
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:505:    throw new Error('db-state not initialized: vector_index is null');
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:509:    const db = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:529:  if (!vectorIndex) {
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:530:    throw new Error('db-state not initialized: vector_index is null');
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:534:    const db = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:5:// Split from vector-index-store.ts — contains ALL query/search functions,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:21:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:32:} from './vector-index-store.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:33:import { delete_memory_from_database } from './vector-index-mutations.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:39:} from './vector-index-types.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:60: * @throws {VectorIndexError} Propagates store initialization failures from the vector index.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:158: * Searches indexed memories by vector similarity.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:162: * @throws {VectorIndexError} Propagates store initialization failures from the vector index.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:165: * const rows = vector_search(queryEmbedding, { limit: 5, specFolder: 'specs/001-demo' });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:168:export function vector_search(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:175:    console.warn('[vector-index] Vector search unavailable - sqlite-vec not loaded');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:205:         WHEN m.is_pinned = 1 THEN m.importance_weight
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:325:    console.warn('[vector-index] Multi-concept search unavailable - sqlite-vec not loaded');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:505:    console.warn('[vector-index] extract_tags: invalid content type, expected string');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:557:        console.warn('[vector-index-queries] Date parsing failed', { error: _e instanceof Error ? _e.message : String(_e) });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:592:    console.warn('[vector-index] Empty query provided for embedding');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:601:    console.warn(`[vector-index] Query embedding failed: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:624:    console.warn('[vector-index] keyword_search: invalid query, expected non-empty string');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:630:    console.warn('[vector-index] keyword_search: no valid search terms after tokenization');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:697: * Runs enriched vector search for a text query.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:702: * @throws {VectorIndexError} Propagates vector-store initialization failures from the underlying search pipeline.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:705: * const results = await vector_search_enriched('sqlite vec mismatch', 10, { specFolder: 'specs/001-demo' });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:708:export async function vector_search_enriched(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:720:  let search_method = 'vector';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:724:    raw_results = vector_search(query_embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:730:    console.warn('[vector-index] Falling back to keyword search');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:747:    const similarity = search_method === 'vector'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:769:    console.warn(`[vector-index] Enriched search took ${elapsed}ms (target <500ms)`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:785: * @throws {VectorIndexError} When concept validation fails or the vector search pipeline cannot execute.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:788: * const results = await multi_concept_search_enriched(['sqlite', 'vector'], 10, { specFolder: 'specs/001-demo' });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:809:        console.warn(`[vector-index] Failed to embed concept: "${concept}"`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:820:    console.warn('[vector-index] Falling back to keyword multi-concept search');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:855:    console.warn(`[vector-index] Multi-concept search took ${elapsed}ms (target <500ms)`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:876:    console.warn('[vector-index] multi_concept_keyword_search: empty concepts array');
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
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1446:export { vector_search_enriched as vectorSearchEnriched };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:34:// Eval channel tracking (extracted from this file)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:39:} from '../lib/telemetry/eval-channel-tracking.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:40:import type { EvalChannelPayload } from '../lib/telemetry/eval-channel-tracking.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:173:// EvalChannelPayload — now imported from lib/telemetry/eval-channel-tracking.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:214:  retrievalLevel?: 'local' | 'global' | 'auto';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:218:// resolveEvalScore, collectEvalChannelsFromRow — now imported from lib/telemetry/eval-channel-tracking.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:429:// summarizeGraphWalkDiagnostics, buildEvalChannelPayloads — now imported from lib/telemetry/eval-channel-tracking.ts
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:529:    retrievalLevel: retrievalLevel = 'auto',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:777:        : 'hybrid',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:818:      (retrievalLevel === 'global' || retrievalLevel === 'auto')
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:822:        (retrievalLevel === 'global') ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:823:        (resultsForFormatting.length < 3 && retrievalLevel === 'auto');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:992:      appliedBoosts.communityFallback = { applied: true, retrievalLevel };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1234:        fusionMethod: 'rrf',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1242:          channel: payload.channel,

exec
/bin/zsh -lc "nl -ba .opencode/skill/mcp-coco-index/README.md | sed -n '80,160p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts | sed -n '180,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

 succeeded in 0ms:
   180	    limit = 10,
   181	    specFolder = null,
   182	    minSimilarity = 0,
   183	    useDecay = true,
   184	    tier = null,
   185	    contextType = null,
   186	    includeConstitutional = true,
   187	    includeArchived = false
   188	  } = options;
   189	
   190	  // M9 FIX: Validate embedding dimension before querying
   191	  const expected_dim = get_embedding_dim();
   192	  if (!query_embedding || query_embedding.length !== expected_dim) {
   193	    throw new VectorIndexError(
   194	      `Invalid embedding dimension: expected ${expected_dim}, got ${query_embedding?.length}`,
   195	      VectorIndexErrorCode.EMBEDDING_VALIDATION,
   196	    );
   197	  }
   198	
   199	  const query_buffer = to_embedding_buffer(query_embedding);
   200	  const max_distance = 2 * (1 - minSimilarity / 100);
   201	
   202	  // ADR-004: FSRS-preferred decay with half-life fallback
   203	  const decay_expr = useDecay
   204	    ? `CASE
   205	         WHEN m.is_pinned = 1 THEN m.importance_weight
   206	         WHEN m.last_review IS NOT NULL AND m.review_count > 0 THEN
   207	           m.importance_weight * POWER(
   208	             1.0 + (19.0/81.0) * (julianday('now') - julianday(m.last_review)) / COALESCE(NULLIF(m.stability, 0), 1.0),
   209	             -0.5
   210	           )
   211	         ELSE m.importance_weight * POWER(0.5, (julianday('now') - julianday(m.updated_at)) / COALESCE(NULLIF(m.decay_half_life_days, 0), 90.0))
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
   246	
   247	  if (contextType) {
   248	    where_clauses.push('m.context_type = ?');
   249	    params.push(contextType);
   250	  }
   251	
   252	  // M8 FIX: If constitutional results already satisfy limit, return them directly
   253	  if (constitutional_results.length >= limit) {
   254	    return constitutional_results.slice(0, limit);
   255	  }
   256	  const adjusted_limit = Math.max(1, limit - constitutional_results.length);
   257	  params.push(max_distance, adjusted_limit);
   258	
   259	  const sql = `
   260	    SELECT sub.*,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '480,560p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '800,850p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '1210,1260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1210	        spec_folder_filter: specFolder ?? null,
  1211	      });
  1212	    }
  1213	  } catch (_error: unknown) { /* instrumentation must never cause search to fail */ }
  1214	
  1215	  // Eval logger — capture final results at pipeline exit (fail-safe)
  1216	  try {
  1217	    if (_evalRunId && _evalQueryId) {
  1218	      let finalMemoryIds: number[] = [];
  1219	      let finalScores: number[] = [];
  1220	      try {
  1221	        if (responseToReturn?.content?.[0]?.text) {
  1222	          const parsed = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
  1223	          const data = parsed?.data as Record<string, unknown> | undefined;
  1224	          const results = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
  1225	          finalMemoryIds = results.map(r => r.id as number).filter(id => typeof id === 'number');
  1226	          finalScores = results.map(r => (r.score ?? r.similarity ?? 0) as number);
  1227	        }
  1228	      } catch (_error: unknown) { /* ignore parse errors */ }
  1229	      logFinalResult({
  1230	        evalRunId: _evalRunId,
  1231	        queryId: _evalQueryId,
  1232	        resultMemoryIds: finalMemoryIds,
  1233	        scores: finalScores,
  1234	        fusionMethod: 'rrf',
  1235	        latencyMs: Date.now() - _searchStartTime,
  1236	      });
  1237	
  1238	      for (const payload of _evalChannelPayloads) {
  1239	        logChannelResult({
  1240	          evalRunId: _evalRunId,
  1241	          queryId: _evalQueryId,
  1242	          channel: payload.channel,
  1243	          resultMemoryIds: payload.resultMemoryIds,
  1244	          scores: payload.scores,
  1245	          hitCount: payload.resultMemoryIds.length,
  1246	        });
  1247	      }
  1248	    }
  1249	  } catch (_error: unknown) { /* eval logging must never break search */ }
  1250	
  1251	  // REQ-D4-001: Implicit feedback — log search_shown events for returned results
  1252	  // Shadow-only: no ranking side effects. Fail-safe, never throws.
  1253	  try {
  1254	    if (isImplicitFeedbackLogEnabled()) {
  1255	      const db = (() => { try { return requireDb(); } catch (_error: unknown) { return null; } })();
  1256	      if (db) {
  1257	        let shownMemoryIds: number[] = [];
  1258	        try {
  1259	          if (responseToReturn?.content?.[0]?.text) {
  1260	            const parsed = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;

exec
/bin/zsh -lc "rg -n \"inputSchema:|name: 'memory_search'|retrievalLevel\" .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
32:  inputSchema: Record<string, unknown>;
44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
49:  name: 'memory_search',
51:  inputSchema: {
194:  inputSchema: {
213:  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', minLength: 1, description: 'User prompt or text to match against trigger phrases' }, specFolder: { type: 'string', description: 'Limit trigger matches to a specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed trigger matching.' }, userId: { type: 'string', description: 'User boundary for governed trigger matching.' }, agentId: { type: 'string', description: 'Agent boundary for governed trigger matching.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed trigger matching.' }, limit: { type: 'number', default: 3, minimum: 1, maximum: 100, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', minimum: 1, description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
220:  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
227:  inputSchema: { type: 'object', additionalProperties: false, properties: { limit: { type: 'number', default: 20, minimum: 1, maximum: 100, description: 'Maximum results to return (max 100)' }, offset: { type: 'number', default: 0, minimum: 0, description: 'Number of results to skip (for pagination)' }, specFolder: { type: 'string', description: 'Filter by spec folder' }, sortBy: { type: 'string', enum: ['created_at', 'updated_at', 'importance_weight'], description: 'Sort order (default: created_at DESC)' }, includeChunks: { type: 'boolean', default: false, description: 'Include chunk child rows. Default false returns parent memories only for cleaner browsing.' } } },
233:  inputSchema: { type: 'object', additionalProperties: false, properties: { folderRanking: { type: 'string', enum: ['count', 'recency', 'importance', 'composite'], description: 'How to rank folders: count (default, by memory count), recency (most recent first), importance (by tier), composite (weighted multi-factor score)', default: 'count' }, excludePatterns: { type: 'array', items: { type: 'string' }, description: 'Regex patterns to exclude folders (e.g., ["z_archive", "scratch"])' }, includeScores: { type: 'boolean', description: 'Include score breakdown for each folder', default: false }, includeArchived: { type: 'boolean', description: 'Include archived/test/scratch folders in results', default: false }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum number of folders to return', default: 10 } } },
239:  inputSchema: {
279:  inputSchema: {
294:  inputSchema: { type: 'object', additionalProperties: false, properties: { id: { type: 'number', minimum: 1, description: 'Memory ID to update' }, title: { type: 'string', description: 'New title' }, triggerPhrases: { type: 'array', items: { type: 'string' }, description: 'Updated trigger phrases' }, importanceWeight: { type: 'number', minimum: 0, maximum: 1, description: 'New importance weight (0-1)' }, importanceTier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Set importance tier. Constitutional tier memories always surface at top of results.' }, allowPartialUpdate: { type: 'boolean', default: false, description: 'Allow update to succeed even if embedding regeneration fails. When true, metadata changes are applied and the embedding is marked for re-index. When false (default), the entire update is rolled back on embedding failure.' } }, required: ['id'] },
300:  inputSchema: {
322:  inputSchema: { type: 'object', additionalProperties: false, properties: { tier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Importance tier to delete (required)' }, specFolder: { type: 'string', description: 'Optional: scope deletion to a specific spec folder' }, confirm: { type: 'boolean', const: true, description: 'Required safety gate: must be true to proceed' }, olderThanDays: { type: 'number', minimum: MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS, description: 'Optional: only delete memories older than this many days' }, skipCheckpoint: { type: 'boolean', default: false, description: 'Optional speed optimization for non-critical tiers. When true, skips auto-checkpoint creation before delete. Rejected for constitutional/critical tiers.' } }, required: ['tier', 'confirm'] },
329:  inputSchema: {
348:  inputSchema: {
365:  inputSchema: {
383:  inputSchema: {
405:  inputSchema: {
427:  inputSchema: {
446:  inputSchema: {
461:  inputSchema: {
473:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Path to spec folder (e.g., "specs/003-memory/077-upgrade")' }, taskId: { type: 'string', minLength: 1, description: 'Task identifier (e.g., "T1", "T2", "implementation")' }, knowledgeScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current knowledge level (0-100): How well do you understand the task requirements and codebase context?' }, uncertaintyScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current uncertainty level (0-100): How uncertain are you about the approach or implementation?' }, contextScore: { type: 'number', minimum: 0, maximum: 100, description: 'Current context completeness (0-100): How complete is your understanding of relevant context?' }, knowledgeGaps: { type: 'array', items: { type: 'string' }, description: 'List of identified knowledge gaps (optional)' }, sessionId: { type: 'string', description: 'Optional session identifier' } }, required: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore'] },
479:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Path to spec folder (must match preflight)' }, taskId: { type: 'string', minLength: 1, description: 'Task identifier (must match preflight)' }, knowledgeScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task knowledge level (0-100)' }, uncertaintyScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task uncertainty level (0-100)' }, contextScore: { type: 'number', minimum: 0, maximum: 100, description: 'Post-task context completeness (0-100)' }, gapsClosed: { type: 'array', items: { type: 'string' }, description: 'List of knowledge gaps closed during task (optional)' }, newGapsDiscovered: { type: 'array', items: { type: 'string' }, description: 'List of new gaps discovered during task (optional)' }, sessionId: { type: 'string', description: 'Optional session identifier. Required when multiple sessions share the same taskId and you need to target a specific learning cycle.' } }, required: ['specFolder', 'taskId', 'knowledgeScore', 'uncertaintyScore', 'contextScore'] },
487:  inputSchema: { type: 'object', additionalProperties: false, properties: { memoryId: { type: 'string', description: 'Memory ID to trace causal lineage for (number or string, required)' }, maxDepth: { type: 'number', default: 3, minimum: 1, maximum: 10, description: 'Maximum traversal depth (default: 3, max: 10)' }, direction: { type: 'string', description: 'Traversal direction: outgoing, incoming, or both (default: both)' }, relations: { type: 'array', items: { type: 'string' }, description: 'Filter to specific relationship types: caused, enabled, supersedes, contradicts, derived_from, supports' }, includeMemoryDetails: { type: 'boolean', default: true, description: 'Include full memory details in results' } }, required: ['memoryId'] },
493:  inputSchema: { type: 'object', additionalProperties: false, properties: { sourceId: { type: 'string', description: 'Source memory ID (the cause/enabler/superseder, number or string)' }, targetId: { type: 'string', description: 'Target memory ID (the effect/superseded, number or string)' }, relation: { type: 'string', description: 'Relationship type: caused, enabled, supersedes, contradicts, derived_from, or supports' }, strength: { type: 'number', default: 1.0, minimum: 0, maximum: 1, description: 'Relationship strength (0.0-1.0)' }, evidence: { type: 'string', description: 'Evidence or reason for this relationship' } }, required: ['sourceId', 'targetId', 'relation'] },
499:  inputSchema: { type: 'object', additionalProperties: false, properties: {}, required: [] },
505:  inputSchema: { type: 'object', additionalProperties: false, properties: { edgeId: { type: 'number', minimum: 1, description: 'Edge ID to delete (required)' } }, required: ['edgeId'] },
511:  inputSchema: {
546:  inputSchema: {
564:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', description: 'Limit scan to specific spec folder (e.g., "005-memory")' }, force: { type: 'boolean', default: false, description: 'Force re-index all files (ignore content hash)' }, includeConstitutional: { type: 'boolean', default: true, description: 'Whether to scan .opencode/skill/*/constitutional/ directories' }, includeSpecDocs: { type: 'boolean', default: true, description: 'Whether to scan .opencode/specs/ directories for spec folder documents (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, research/research.md, handover.md). Iteration artifacts under research/iterations/ and review/iterations/ are excluded from spec-doc indexing. Set SPECKIT_INDEX_SPEC_DOCS=false env var to disable globally.' }, incremental: { type: 'boolean', default: true, description: 'Enable incremental indexing. When true (default), skips files whose mtime and content hash are unchanged since last index. Set to false to re-evaluate all files regardless of change detection.' } }, required: [] },
570:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Spec folder path to get learning history for (required)' }, sessionId: { type: 'string', description: 'Filter by session ID (optional)' }, limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum records to return (default: 10, max: 100)' }, onlyComplete: { type: 'boolean', default: false, description: 'Only return records with both PREFLIGHT and POSTFLIGHT (complete learning cycles)' }, includeSummary: { type: 'boolean', default: true, description: 'Include summary statistics (averages, trends) in response' } }, required: ['specFolder'] },
576:  inputSchema: {
599:  inputSchema: {
612:  inputSchema: {
626:  inputSchema: {
641:  inputSchema: {
659:  inputSchema: { type: 'object', additionalProperties: false, properties: {}, required: [] },
665:  inputSchema: {
701:  inputSchema: { type: 'object', additionalProperties: false, properties: {}, required: [] },
707:  inputSchema: {
719:  inputSchema: {
735:  inputSchema: { type: 'object', additionalProperties: false, properties: {}, required: [] },
742:  inputSchema: {
757:  inputSchema: {
782:  inputSchema: {
828:  inputSchema: {
846:  inputSchema: {
859:  inputSchema: {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '120,200p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '48,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '120,188p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
I’ve now got the critical contrast: Mnemosyne’s compaction hook is a hard-coded instruction block about when to use memory tools, while Public’s compaction transport is payload-driven structural context and dedupe-aware. Next I’m checking whether Public already has a latent path for operational guidance injection, because that determines whether the paradigm shift is “new subsystem” or just “new payload layer.”
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts | sed -n '400,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   400	
   401	    return enforceAutoSurfaceTokenBudget({
   402	      constitutional: enrichedConstitutional,
   403	      triggered: triggered.map((t: triggerMatcher.TriggerMatch) => ({
   404	        memory_id: t.memoryId,
   405	        spec_folder: t.specFolder,
   406	        title: t.title ?? 'Untitled',
   407	        matched_phrases: t.matchedPhrases,
   408	      })),
   409	      surfaced_at: new Date().toISOString(),
   410	      latencyMs: latencyMs,
   411	    }, tokenBudget, hookName);
   412	  } catch (err: unknown) {
   413	    const message = err instanceof Error ? err.message : String(err);
   414	    console.warn('[SK-004] Auto-surface failed:', message);
   415	    return null;
   416	  }
   417	}
   418	
   419	/** T018: Build structured Prime Package for non-hook CLI auto-priming */
   420	function buildPrimePackage(
   421	  toolArgs: Record<string, unknown>,
   422	  graphSnapshot: NonNullable<AutoSurfaceResult['codeGraphStatus']>,
   423	): PrimePackage {
   424	  // Derive specFolder from tool args if provided
   425	  const specFolder = typeof toolArgs.specFolder === 'string' ? toolArgs.specFolder : null;
   426	
   427	  // Derive currentTask from input/query/prompt fields
   428	  const taskFields = ['input', 'query', 'prompt'] as const;
   429	  let currentTask: string | null = null;
   430	  for (const f of taskFields) {
   431	    if (typeof toolArgs[f] === 'string' && (toolArgs[f] as string).length >= 3) {
   432	      currentTask = (toolArgs[f] as string).slice(0, 200);
   433	      break;
   434	    }
   435	  }
   436	
   437	  // Code graph freshness
   438	  let codeGraphStatus: PrimePackage['codeGraphStatus'] = 'empty';
   439	  if (graphSnapshot.status === 'ok' && graphSnapshot.data) {
   440	    const lastScan = graphSnapshot.data.lastScanAt;
   441	    const totalFiles = graphSnapshot.data.totalFiles ?? 0;
   442	    if (totalFiles === 0) {
   443	      codeGraphStatus = 'empty';
   444	    } else if (!lastScan || (Date.now() - new Date(lastScan).getTime() > 24 * 60 * 60 * 1000)) {
   445	      codeGraphStatus = 'stale';
   446	    } else {
   447	      codeGraphStatus = 'fresh';
   448	    }
   449	  }
   450	
   451	  // F046: CocoIndex availability via shared helper (no process.cwd())
   452	  const cocoIndexAvailable = isCocoIndexAvailable();
   453	
   454	  // Build recommended calls based on state
   455	  const recommendedCalls: string[] = [];
   456	  if (codeGraphStatus === 'stale' || codeGraphStatus === 'empty') {
   457	    recommendedCalls.push('code_graph_scan');
   458	  }
   459	  if (!specFolder) {
   460	    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
   461	  }
   462	  if (cocoIndexAvailable && recommendedCalls.length === 0) {
   463	    recommendedCalls.push('memory_match_triggers({ prompt: "<your task>" })');
   464	  }
   465	
   466	  const toolRoutingRules: string[] = [];
   467	  if (cocoIndexAvailable) {
   468	    toolRoutingRules.push('semantic/concept queries → mcp__cocoindex_code__search');
   469	  }
   470	  if (codeGraphStatus !== 'empty') {
   471	    toolRoutingRules.push('structural queries (callers, deps) → code_graph_query');
   472	  }
   473	  toolRoutingRules.push('exact text/regex → Grep');
   474	
   475	  // Phase 027: Structural bootstrap contract for auto-prime surface
   476	  const structuralContext = buildStructuralBootstrapContract('auto-prime');
   477	
   478	  return {
   479	    specFolder, currentTask, codeGraphStatus, cocoIndexAvailable, recommendedCalls,
   480	    structuralContext,
   481	    routingRules: {
   482	      graphRetrieval: 'For broad topic questions, use memory_search with retrievalLevel: "global" for community-level results. For specific memories, use "local" (default). Use "auto" for automatic fallback.',
   483	      communitySearch: 'When primary search returns weak results, community search fallback activates automatically (SPECKIT_COMMUNITY_SEARCH_FALLBACK). Graph provenance is visible in graphEvidence field.',
   484	      toolRouting: `SEARCH ROUTING: ${toolRoutingRules.join(' | ')}`,
   485	    },
   486	  };
   487	}
   488	
   489	async function primeSessionIfNeeded(
   490	  toolName: string,
   491	  toolArgs: Record<string, unknown>,
   492	  sessionId?: string,
   493	): Promise<AutoSurfaceResult | null> {
   494	  // Derive a session key from explicit sessionId or tool args.
   495	  const effectiveSessionId = sessionId
   496	    ?? (typeof toolArgs.sessionId === 'string' ? toolArgs.sessionId : null)
   497	    ?? (typeof toolArgs.session_id === 'string' ? toolArgs.session_id : null);
   498	
   499	  if (!effectiveSessionId || effectiveSessionId.trim().length === 0) {
   500	    return null;
   501	  }
   502	
   503	  if (isSessionPrimed(effectiveSessionId)) {
   504	    return null;
   505	  }
   506	
   507	  const startTime = Date.now();
   508	  const contextHint = extractContextHint(toolArgs);
   509	
   510	  try {
   511	    const constitutional = await getConstitutionalMemories();
   512	    const enrichedConstitutional = enrichWithRetrievalDirectives(constitutional);
   513	    const codeGraphStatus = getCodeGraphStatusSnapshot();
   514	    const latencyMs = Date.now() - startTime;
   515	
   516	    // T018: Build structured Prime Package
   517	    const primePackage = buildPrimePackage(toolArgs, codeGraphStatus);
   518	
   519	    // F045: Mark session as primed AFTER successful execution (not before try)
   520	    markSessionPrimed(effectiveSessionId);

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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Scope Governance
     3	// ───────────────────────────────────────────────────────────────
     4	// Hierarchical scope enforcement, governed ingest validation,
     5	// provenance normalization, and governance audit persistence.
     6	import type Database from 'better-sqlite3';
     7	
     8	import { ensureGovernanceTables, ensureSharedSpaceTables } from '../search/vector-index-schema.js';
     9	
    10	// Feature catalog: Hierarchical scope governance, governed ingest, retention, and audit
    11	
    12	
    13	/**
    14	 * Retention modes applied during governed ingest.
    15	 */
    16	export type RetentionPolicy = 'keep' | 'ephemeral' | 'shared';
    17	
    18	/**
    19	 * Request scope used to enforce tenancy, actor, session, and shared-space boundaries.
    20	 */
    21	export interface ScopeContext {
    22	  tenantId?: string;
    23	  userId?: string;
    24	  agentId?: string;
    25	  sessionId?: string;
    26	  sharedSpaceId?: string;
    27	}
    28	
    29	/**
    30	 * Governed-ingest fields required to persist scope and retention metadata.
    31	 */
    32	export interface GovernedIngestInput extends ScopeContext {
    33	  provenanceSource?: string;
    34	  provenanceActor?: string;
    35	  governedAt?: string;
    36	  retentionPolicy?: RetentionPolicy;
    37	  deleteAfter?: string;
    38	}
    39	
    40	/**
    41	 * Result of governed-ingest validation and field normalization.
    42	 */
    43	// R5: Simplified normalized type — previously a complex intersection.
    44	export interface GovernanceNormalized {
    45	  tenantId?: string | null;
    46	  userId?: string | null;
    47	  agentId?: string | null;
    48	  sessionId?: string | null;
    49	  sharedSpaceId?: string | null;
    50	  provenanceSource: string | null;
    51	  provenanceActor: string | null;
    52	  governedAt: string;
    53	  retentionPolicy: RetentionPolicy;
    54	  deleteAfter: string | null;
    55	}
    56	
    57	export interface GovernanceDecision {
    58	  allowed: boolean;
    59	  normalized: GovernanceNormalized;
    60	  reason?: string;
    61	  issues: string[];
    62	}
    63	
    64	/**
    65	 * Audit payload written for allow, deny, delete, and conflict events.
    66	 */
    67	export interface GovernanceAuditEntry extends ScopeContext {
    68	  action: string;
    69	  decision: 'allow' | 'deny' | 'delete' | 'conflict';
    70	  memoryId?: number | null;
    71	  logicalKey?: string | null;
    72	  reason?: string | null;
    73	  metadata?: Record<string, unknown> | null;
    74	}
    75	
    76	/**
    77	 * Filters used to review governance audit history.
    78	 */
    79	export interface GovernanceAuditReviewFilters extends ScopeContext {
    80	  action?: string;
    81	  decision?: GovernanceAuditEntry['decision'];
    82	  limit?: number;
    83	  allowUnscoped?: boolean;
    84	}
    85	
    86	/**
    87	 * Parsed governance audit row returned for review workflows.
    88	 */
    89	export interface GovernanceAuditReviewRow extends ScopeContext {
    90	  id: number;
    91	  action: string;
    92	  decision: GovernanceAuditEntry['decision'];
    93	  memoryId: number | null;
    94	  logicalKey: string | null;
    95	  reason: string | null;
    96	  metadata: Record<string, unknown> | null;
    97	  createdAt: string;
    98	}
    99	
   100	/**
   101	 * Aggregate view of governance audit activity for a filtered review.
   102	 */
   103	export interface GovernanceAuditReviewSummary {
   104	  totalMatching: number;
   105	  returnedRows: number;
   106	  byAction: Record<string, number>;
   107	  byDecision: Partial<Record<GovernanceAuditEntry['decision'], number>>;
   108	  latestCreatedAt: string | null;
   109	}
   110	
   111	/**
   112	 * Combined governance audit review rows and summary.
   113	 */
   114	export interface GovernanceAuditReviewResult {
   115	  rows: GovernanceAuditReviewRow[];
   116	  summary: GovernanceAuditReviewSummary;
   117	}
   118	
   119	/**
   120	 * Options used when benchmarking scope-filter behavior.
   121	 */
   122	export interface ScopeFilterBenchmarkOptions {
   123	  iterations?: number;
   124	  allowedSharedSpaceIds?: ReadonlySet<string>;
   125	}
   126	
   127	/**
   128	 * Benchmark result for a scope filter predicate.
   129	 */
   130	export interface ScopeFilterBenchmarkResult {
   131	  iterations: number;
   132	  totalRows: number;
   133	  matchedRows: number;
   134	  filteredRows: number;
   135	  elapsedMs: number;
   136	  averageMsPerIteration: number;
   137	}
   138	
   139	function normalizeId(value: unknown): string | undefined {
   140	  if (typeof value !== 'string') return undefined;
   141	  const trimmed = value.trim();
   142	  return trimmed.length > 0 ? trimmed : undefined;
   143	}
   144	
   145	function normalizeIsoTimestamp(value: unknown): string | undefined {
   146	  if (typeof value !== 'string' || value.trim().length === 0) return undefined;
   147	  const date = new Date(value);
   148	  if (Number.isNaN(date.getTime())) return undefined;
   149	  return date.toISOString();
   150	}
   151	
   152	/**
   153	 * Trim and normalize optional scope identifiers before enforcement.
   154	 *
   155	 * @param input - Scope values supplied by the caller.
   156	 * @returns Scope with blank identifiers removed.
   157	 */
   158	export function normalizeScopeContext(input: ScopeContext): ScopeContext {
   159	  return {
   160	    tenantId: normalizeId(input.tenantId),
   161	    userId: normalizeId(input.userId),
   162	    agentId: normalizeId(input.agentId),
   163	    sessionId: normalizeId(input.sessionId),
   164	    sharedSpaceId: normalizeId(input.sharedSpaceId),
   165	  };
   166	}
   167	
   168	/**
   169	 * Resolve whether scope filtering is active for the current process.
   170	 * Default: OFF — scope enforcement is opt-in via SPECKIT_MEMORY_SCOPE_ENFORCEMENT=true.
   171	 * When enabled without scope constraints in the query, all results are rejected
   172	 * (empty scope + enforcement = no access). Only enable when multi-tenant governance
   173	 * is configured with tenantId/userId/agentId/sharedSpaceId in queries.
   174	 *
   175	 * @returns `true` when scope enforcement is enabled.
   176	 */
   177	export function isScopeEnforcementEnabled(): boolean {
   178	  const flagValue = process.env.SPECKIT_MEMORY_SCOPE_ENFORCEMENT?.trim().toLowerCase()
   179	    ?? process.env.SPECKIT_HYDRA_SCOPE_ENFORCEMENT?.trim().toLowerCase();
   180	  return flagValue === 'true' || flagValue === '1';
   181	}
   182	
   183	/**
   184	 * Resolve whether governance guardrails are active for the current process.
   185	 * Default: OFF — governance guardrails are opt-in via SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS=true.
   186	 *
   187	 * @returns `true` when governance guardrails are enabled.
   188	 */
   189	export function isGovernanceGuardrailsEnabled(): boolean {
   190	  const flagValue = process.env.SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS?.trim().toLowerCase()
   191	    ?? process.env.SPECKIT_HYDRA_GOVERNANCE_GUARDRAILS?.trim().toLowerCase();
   192	  return flagValue === 'true' || flagValue === '1';
   193	}
   194	
   195	/**
   196	 * Determine whether an ingest request must pass governed-ingest validation.
   197	 *
   198	 * @param input - Candidate ingest metadata.
   199	 * @returns `true` when governance or scope metadata requires enforcement.
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

exec
/bin/zsh -lc 'rg -n "retrievalLevel|global/auto|community fallback|graphEvidence|tool continuity|compaction|compact|memory guidance|pin|is_pinned" .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts .opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:4:// Phase 030 / Phase 2: transport-only mapping from shared payload
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:5:// contracts to OpenCode-oriented startup, message, and compaction blocks.
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:14:  | 'experimental.session.compacting';
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:37:  compaction?: OpenCodeTransportBlock;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:87:  compactionPayload?: SharedPayloadEnvelope | null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:95:    args.compactionPayload?.kind,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:102:  const compactionPayload = args.compactionPayload ?? args.resumePayload ?? args.bootstrapPayload ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:140:    ...(compactionPayload
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:142:        compaction: {
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:143:          hook: 'experimental.session.compacting',
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:145:          payloadKind: compactionPayload.kind,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:146:          dedupeKey: `compaction:${compactionPayload.kind}`,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:148:            compactionPayload,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:149:            'Inject this as the continuity note across compaction. Keep it separate from current-turn retrieval.',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:106:// Replaces the previous process-global boolean to avoid skipping priming
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:253:  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware'
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:290:      `(${tokenCount} > ${budgetLimit}); dropping payload`
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:368:  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware' = 'memory-aware'
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:482:      graphRetrieval: 'For broad topic questions, use memory_search with retrievalLevel: "global" for community-level results. For specific memories, use "local" (default). Use "auto" for automatic fallback.',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:483:      communitySearch: 'When primary search returns weak results, community search fallback activates automatically (SPECKIT_COMMUNITY_SEARCH_FALLBACK). Graph provenance is visible in graphEvidence field.',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:626: * Fires at session compaction lifecycle points. Surfaces memories relevant
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:628: * across the compaction boundary.
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:656:  return autoSurfaceMemories(sessionContext.trim(), COMPACTION_TOKEN_BUDGET, 'compaction');

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts | sed -n '620,670p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
One seam just surfaced that’s more important than I expected: Public’s handler and auto-prime guidance both talk about `retrievalLevel`, but the published `memory_search` schema doesn’t expose it. That pushes the analysis toward a bigger paradigm-shift theme: strategy controls need to be real API surface, not just internal affordances or instructional prose.
exec
/bin/zsh -lc "rg -n \"--tag\\\", \\\"core\\\"|core=true|memory_store_global|memory_store|memory_recall_global|memory_recall|Bun.spawn|not found|ENOENT|No such file|stdout \\|\\| stderr|path.basename|projectRaw === \\\"global\\\"\" \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 2 in 0ms:
rg: unrecognized flag --tag", "core"|core

exec
/bin/zsh -lc "rg -n \"compactionPayload|OpenCode Compaction Resume Note|retrievalPolicyOwner|memory_context\\(|memory_search\\(|memory_match_triggers\\(|graphRetrieval|communitySearch|routingRules\" .opencode/skill/system-spec-kit/mcp_server -g '"'!**/tests/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:794:    const routingRules: string[] = [];
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:796:      routingRules.push('Semantic/concept code search → mcp__cocoindex_code__search');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:799:      routingRules.push('Structural queries (callers, imports, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:801:    routingRules.push('Exact text/regex matching → Grep tool');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:802:    if (routingRules.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:805:      for (const rule of routingRules) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:465:- [ ] `memory_search()` returns results (or empty if no memories are indexed yet)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:532:`memory_context()` is the primary entry point for context loading. It detects task intent and routes to the optimal retrieval strategy automatically.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:550:`memory_search()` runs vector-based similarity search across all indexed memories.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:561:`memory_match_triggers()` provides sub-50ms keyword-based matching. Use it for immediate context surfacing at the start of a conversation.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:629:- `ContextEnvelope`: Wraps all `memory_context()` responses with metadata (mode used, memories returned, intent detected)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:681:**Behind the scenes:** The AI calls `memory_context()` with `mode: "resume"` and `anchors: ["state", "next-steps"]`, then returns the previous session state.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:692:1. AI calls `memory_context({ input: "add user profiles", mode: "auto" })`
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1263:      ? `memory_search({ sessionId: "${sessionId}" })`
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1264:      : 'memory_search({ query: "last session" })';
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:74:  routingRules?: {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:75:    graphRetrieval: string;
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:76:    communitySearch: string;
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:460:    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:463:    recommendedCalls.push('memory_match_triggers({ prompt: "<your task>" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:481:    routingRules: {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:482:      graphRetrieval: 'For broad topic questions, use memory_search with retrievalLevel: "global" for community-level results. For specific memories, use "local" (default). Use "auto" for automatic fallback.',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:483:      communitySearch: 'When primary search returns weak results, community search fallback activates automatically (SPECKIT_COMMUNITY_SEARCH_FALLBACK). Graph provenance is visible in graphEvidence field.',
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:224:  //   recovery (0.20)      — A memory_context({ mode: "resume" }) call is the most
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:29:  retrievalPolicyOwner: 'runtime';
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:87:  compactionPayload?: SharedPayloadEnvelope | null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:95:    args.compactionPayload?.kind,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:102:  const compactionPayload = args.compactionPayload ?? args.resumePayload ?? args.bootstrapPayload ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:107:    retrievalPolicyOwner: 'runtime',
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:140:    ...(compactionPayload
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:144:          title: 'OpenCode Compaction Resume Note',
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:145:          payloadKind: compactionPayload.kind,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:146:          dedupeKey: `compaction:${compactionPayload.kind}`,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:148:            compactionPayload,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:50:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:61:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:77:      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:140:        '- `memory_context({ input, mode })` — unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:141:        '- `memory_match_triggers({ prompt })` — fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:142:        '- `memory_search({ query })` — semantic search',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:185:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:190:      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:51:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:62:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:73:      content: 'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:106:        '- `memory_context({ input, mode })` - unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:107:        '- `memory_match_triggers({ prompt })` - fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:108:        '- `memory_search({ query })` - semantic search',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:149:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:155:    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:63:    'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:129:      return ['[session] Context quality is CRITICAL. Consider running `memory_context({ mode: "resume" })` or `session_health` to diagnose.'];
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:357:      'Use memory_match_triggers() for prompt-based matching instead'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:360:    toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:539:      'Check memory_search() for existing similar content'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:700:        'Try memory_match_triggers() for trigger-based matching'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:703:      toolTip: 'memory_match_triggers()'

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts | sed -n '520,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   520	    markSessionPrimed(effectiveSessionId);
   521	
   522	    // Phase 024 / Item 9: Record bootstrap telemetry for MCP auto-priming
   523	    recordBootstrapEvent('mcp_auto', Date.now() - startTime, 'full');
   524	
   525	    if (enrichedConstitutional.length === 0 && codeGraphStatus.status !== 'ok') {
   526	      // Still return the prime package even when no constitutional memories
   527	      return enforceAutoSurfaceTokenBudget({
   528	        constitutional: [],
   529	        triggered: [],
   530	        codeGraphStatus,
   531	        sessionPrimed: true,
   532	        primedTool: toolName,
   533	        primePackage,
   534	        surfaced_at: new Date().toISOString(),
   535	        latencyMs,
   536	      }, TOOL_DISPATCH_TOKEN_BUDGET, 'tool-dispatch');
   537	    }
   538	
   539	    return enforceAutoSurfaceTokenBudget({
   540	      constitutional: enrichedConstitutional,
   541	      triggered: [],
   542	      codeGraphStatus,
   543	      sessionPrimed: true,
   544	      primedTool: toolName,
   545	      primePackage,
   546	      surfaced_at: new Date().toISOString(),
   547	      latencyMs,
   548	    }, TOOL_DISPATCH_TOKEN_BUDGET, 'tool-dispatch');
   549	  } catch (err: unknown) {
   550	    const message = err instanceof Error ? err.message : String(err);
   551	    console.warn(
   552	      `[SK-004] Session priming failed on first tool call '${toolName}'` +
   553	      `${contextHint ? ' with extracted context hint' : ''}: ${message}`
   554	    );
   555	    return null;
   556	  }
   557	}
   558	
   559	/**
   560	 * Reset priming state. When called with a sessionId, clears only that session.
   561	 * When called without arguments, clears all sessions (backward-compatible).
   562	 */
   563	function resetSessionPrimed(sessionId?: string): void {
   564	  if (sessionId) {
   565	    primedSessionIds.delete(sessionId);
   566	  } else {
   567	    primedSessionIds.clear();
   568	  }
   569	}
   570	
   571	/* ───────────────────────────────────────────────────────────────
   572	   6. TOOL DISPATCH HOOK (TM-05)
   573	──────────────────────────────────────────────────────────────── */
   574	
   575	/**
   576	 * autoSurfaceAtToolDispatch
   577	 *
   578	 * Fires at tool dispatch lifecycle points. Extracts a context hint from
   579	 * the dispatched tool's arguments, then surfaces relevant memories via
   580	 * the standard autoSurfaceMemories path.
   581	 *
   582	 * Skipped when:
   583	 *   - toolName is in MEMORY_AWARE_TOOLS (prevents recursive surfacing)
   584	 *   - No context hint can be extracted from args
   585	 *   - enableToolDispatchHook is false in the integration config
   586	 *
   587	 * Token budget: TOOL_DISPATCH_TOKEN_BUDGET (4000 max)
   588	 *
   589	 * @param toolName   - Name of the tool being dispatched
   590	 * @param toolArgs   - Arguments passed to the dispatched tool
   591	 * @param options    - Optional integration-layer config flags
   592	 * @returns AutoSurfaceResult or null if nothing to surface / hook disabled
   593	 */
   594	async function autoSurfaceAtToolDispatch(
   595	  toolName: string,
   596	  toolArgs: Record<string, unknown>,
   597	  options?: { enableToolDispatchHook?: boolean }
   598	): Promise<AutoSurfaceResult | null> {
   599	  // Allow integration layer to disable this hook via config flag
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts | sed -n '56,80p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts | sed -n '44,90p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    44	  const state = loadState(sessionId);
    45	  const pendingCompactPrime = readCompactPrime(sessionId);
    46	  if (!pendingCompactPrime) {
    47	    hookLog('warn', 'session-prime', `No cached compact payload for session ${sessionId}`);
    48	    return [{
    49	      title: 'Context Recovery',
    50	      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
    51	    }];
    52	  }
    53	
    54	  const { payload, cachedAt } = pendingCompactPrime;
    55	  const cachedAtMs = new Date(cachedAt).getTime();
    56	  const cacheAgeMs = Date.now() - cachedAtMs;
    57	  if (Number.isNaN(cachedAtMs) || cacheAgeMs >= CACHE_TTL_MS) {
    58	    hookLog('warn', 'session-prime', `Rejecting stale compact cache for session ${sessionId} (cached at ${cachedAt})`);
    59	    return [{
    60	      title: 'Context Recovery',
    61	      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
    62	    }];
    63	  }
    64	
    65	  const sanitizedPayload = sanitizeRecoveredPayload(payload);
    66	  const wrappedPayload = wrapRecoveredCompactPayload(payload, cachedAt, {
    67	    producer: pendingCompactPrime.payloadContract?.provenance.producer,
    68	    trustState: pendingCompactPrime.payloadContract?.provenance.trustState,
    69	    sourceSurface: pendingCompactPrime.payloadContract?.provenance.sourceSurface,
    70	  });
    71	  hookLog('info', 'session-prime', `Injecting cached compact brief (${sanitizedPayload.length} chars after sanitization, cached at ${cachedAt})`);
    72	
    73	  const sections: OutputSection[] = [
    74	    { title: 'Recovered Context (Post-Compaction)', content: wrappedPayload },
    75	    {
    76	      title: 'Recovery Instructions',
    77	      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
    78	    },
    79	  ];
    80	
    81	  // Add last spec folder if known
    82	  if (state?.lastSpecFolder) {
    83	    sections.push({
    84	      title: 'Active Spec Folder',
    85	      content: `Last active: ${state.lastSpecFolder}`,
    86	    });
    87	  }
    88	
    89	  return sections;
    90	}

 succeeded in 0ms:
    56	
    57	  const state = loadState(sessionId);
    58	  const sections: string[] = [
    59	    '## Recovered Context (Post-Compression)',
    60	    wrappedPayload,
    61	    '',
    62	    '## Recovery Instructions',
    63	    'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
    64	  ];
    65	
    66	  if (state?.lastSpecFolder) {
    67	    sections.push('', `## Active Spec Folder`, `Last active: ${state.lastSpecFolder}`);
    68	  }
    69	
    70	  const rawOutput = truncateToTokenBudget(sections.join('\n'), COMPACTION_TOKEN_BUDGET);
    71	  const output = formatGeminiOutput(rawOutput);
    72	  process.stdout.write(output);
    73	
    74	  // Clear compact payload only AFTER stdout write succeeds
    75	  clearCompactPrime(sessionId);
    76	
    77	  hookLog('info', 'gemini:compact-inject', `Injected ${rawOutput.length} chars for session ${sessionId}`);
    78	}
    79	
    80	// Run — exit cleanly even on error

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '100,140p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
# Iteration 013: GAP ANALYSIS - PARADIGM SHIFTS

## Focus
GAP ANALYSIS - PARADIGM SHIFTS: What paradigm shifts does this system suggest for our memory architecture?

## Findings
### Finding 1: Shift compaction from passive state carryover to runtime-owned behavioral continuity
- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L102), [memory-surface.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L419), [claude/session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts#L49)
- **What it does**: Mnemosyne hard-codes a memory-usage instruction block into `experimental.session.compacting`, telling the agent when to recall, store, delete, use `core`, and use global memory. Public already has transport-level compaction notes and prime packages, and Claude/Gemini already inject explicit recovery instructions, but OpenCode transport is still marked `retrievalPolicyOwner: 'runtime'` and only ships continuity payloads, not explicit memory-action guidance.
- **Why it matters for us**: The paradigm shift is that compaction should preserve not just facts, but the agent’s operating model for memory. Public already has the infrastructure; the gap is OpenCode-specific behavioral guidance, not a missing compaction system.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Shift retrieval strategy from hidden internals to explicit agent-callable API surface
- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L95), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L529), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L1234), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L48), [memory-surface.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L482)
- **What it does**: Mnemosyne exposes strategy through tool names: project recall vs global recall. Public’s handler already supports `retrievalLevel: 'local' | 'global' | 'auto'`, community fallback, and logs `fusionMethod: 'rrf'`, while the auto-prime guidance tells agents to use `retrievalLevel`. But the published `memory_search` schema still describes vector search and does not expose `retrievalLevel`.
- **Why it matters for us**: This suggests a paradigm shift from “smart backend, thin docs” to “strategy is part of the public contract.” If the runtime tells agents to use a retrieval posture, that posture needs to exist in the surfaced tool contract.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Split memory policy into orthogonal axes instead of overloading tiers
- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L138), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L160), [vector-index-queries.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts#L203), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L217), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L291)
- **What it does**: Mnemosyne’s `core` is a write-time operational flag. Public already has a separate operational dimension in ranking: `is_pinned = 1` bypasses decay and preserves raw importance weight. But Public’s save/update contracts expose tier and weight, not pinning.
- **Why it matters for us**: The architecture should separate three concerns: governance/content tier (`constitutional`, `critical`), operational continuity (`pin`), and scope/visibility (`tenant`, `shared`, project alias). Mnemosyne’s simpler model makes that separation easier to see.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: Move from one universal memory surface to runtime-specific facades over a governed core
- **Source**: [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L2), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L4), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L92), [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L25), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755)
- **What it does**: Mnemosyne is a wrapper-thin OpenCode plugin around one binary and five tools. Public is already a memory platform with retrieval, governance, health, bootstrap, and routing. The OpenCode transport layer already implies a separation between core payload production and runtime-specific delivery.
- **Why it matters for us**: The paradigm shift is not “replace MCP with a thin wrapper,” but “treat runtime UX as a facade layer.” Public can keep the rich governed core and add a smaller OpenCode-optimized surface where that ergonomics matters.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 5: Treat memory retrieval as one retrieval plane in a federated stack, not the universal semantic engine
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L82), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L794), [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L85), [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L137)
- **What it does**: Mnemosyne’s hybrid BM25+vector story is still a memory-store story. Public already has a federated model: `memory_search` for memories, CocoIndex for semantic code intent, and code graph for structural questions.
- **Why it matters for us**: The architecture signal here is to keep planes distinct and route by task intent, not merge every embedding-backed system into one “hybrid retrieval” feature. Mnemosyne reinforces the value of a clear memory plane, but Public’s broader federation is the stronger design.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 6: Make offline backend readiness a first-class memory concern, not a hidden first-use side effect
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L18), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L64), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L78), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L113), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L782)
- **What it does**: Mnemosyne’s README documents a one-time model download of about 500 MB, and the wrapper handles missing binaries with a string fallback. Its project auto-init is best-effort and does not inspect the `init` exit status before logging success. Public, by contrast, already models readiness and recovery through `session_bootstrap`, structural status, and explicit next actions.
- **Why it matters for us**: The paradigm shift is to treat offline model/backend warmup as architecture, not ops trivia. If Public ever adds heavier local inference backends, readiness, degraded mode, and repair guidance should stay first-class surfaces.
- **Recommendation**: prototype later
- **Impact**: medium

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [memory-surface.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts)
- [claude/session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts)
- [gemini/compact-inject.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts)
- [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts)
- [scope-governance.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [vector-index-queries.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)

## Assessment
- New information ratio: 0.81
- Questions addressed: compaction-hook leverage, API-surface vs handler reality, operational `core` vs pinning semantics, runtime facade layering, memory-vs-code retrieval boundaries, offline-first readiness tradeoffs
- Questions answered: The strongest paradigm shifts are not new ranking algorithms. They are API and runtime shifts: compaction should preserve memory behavior, retrieval posture must be explicit in the tool contract, pinning should be separated from governance tiers, OpenCode should get a curated facade over the governed MCP core, and memory retrieval should remain one plane in a federated routing stack. The exact validation command passed with `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, while still emitting `cannot create temp file for here document: Operation not permitted`.

## Reflection
- What worked: Reading the wrapper first, then tracing Public’s transport, prime, search, and routing surfaces made the real deltas obvious. The highest-value gaps are cross-layer seams where Public already has the primitive but does not surface it consistently.
- What did not work: The sandbox is read-only, so I could not update `research/research.md`, `checklist.md`, `implementation-summary.md`, or run `generate-context.js` to save memory. The external checkout is also wrapper-thin, so backend ranking specifics remain README-documented rather than source-proven.

## Recommended Next Focus
Prototype one API-surface alignment slice instead of a backend rewrite: add an explicit OpenCode-facing retrieval facade that exposes `retrievalLevel` and `pin`, then extend the OpenCode compaction payload with bounded memory-behavior guidance so OpenCode reaches parity with the existing Claude/Gemini recovery pattern.
hook: Stop
hook: Stop Completed
tokens used
140,302
# Iteration 013: GAP ANALYSIS - PARADIGM SHIFTS

## Focus
GAP ANALYSIS - PARADIGM SHIFTS: What paradigm shifts does this system suggest for our memory architecture?

## Findings
### Finding 1: Shift compaction from passive state carryover to runtime-owned behavioral continuity
- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L102), [memory-surface.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L419), [claude/session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts#L49)
- **What it does**: Mnemosyne hard-codes a memory-usage instruction block into `experimental.session.compacting`, telling the agent when to recall, store, delete, use `core`, and use global memory. Public already has transport-level compaction notes and prime packages, and Claude/Gemini already inject explicit recovery instructions, but OpenCode transport is still marked `retrievalPolicyOwner: 'runtime'` and only ships continuity payloads, not explicit memory-action guidance.
- **Why it matters for us**: The paradigm shift is that compaction should preserve not just facts, but the agent’s operating model for memory. Public already has the infrastructure; the gap is OpenCode-specific behavioral guidance, not a missing compaction system.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Shift retrieval strategy from hidden internals to explicit agent-callable API surface
- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L95), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L529), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L1234), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L48), [memory-surface.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L482)
- **What it does**: Mnemosyne exposes strategy through tool names: project recall vs global recall. Public’s handler already supports `retrievalLevel: 'local' | 'global' | 'auto'`, community fallback, and logs `fusionMethod: 'rrf'`, while the auto-prime guidance tells agents to use `retrievalLevel`. But the published `memory_search` schema still describes vector search and does not expose `retrievalLevel`.
- **Why it matters for us**: This suggests a paradigm shift from “smart backend, thin docs” to “strategy is part of the public contract.” If the runtime tells agents to use a retrieval posture, that posture needs to exist in the surfaced tool contract.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Split memory policy into orthogonal axes instead of overloading tiers
- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L138), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L160), [vector-index-queries.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts#L203), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L217), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L291)
- **What it does**: Mnemosyne’s `core` is a write-time operational flag. Public already has a separate operational dimension in ranking: `is_pinned = 1` bypasses decay and preserves raw importance weight. But Public’s save/update contracts expose tier and weight, not pinning.
- **Why it matters for us**: The architecture should separate three concerns: governance/content tier (`constitutional`, `critical`), operational continuity (`pin`), and scope/visibility (`tenant`, `shared`, project alias). Mnemosyne’s simpler model makes that separation easier to see.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: Move from one universal memory surface to runtime-specific facades over a governed core
- **Source**: [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L2), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L4), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L92), [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L25), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755)
- **What it does**: Mnemosyne is a wrapper-thin OpenCode plugin around one binary and five tools. Public is already a memory platform with retrieval, governance, health, bootstrap, and routing. The OpenCode transport layer already implies a separation between core payload production and runtime-specific delivery.
- **Why it matters for us**: The paradigm shift is not “replace MCP with a thin wrapper,” but “treat runtime UX as a facade layer.” Public can keep the rich governed core and add a smaller OpenCode-optimized surface where that ergonomics matters.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 5: Treat memory retrieval as one retrieval plane in a federated stack, not the universal semantic engine
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L82), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L794), [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L85), [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L137)
- **What it does**: Mnemosyne’s hybrid BM25+vector story is still a memory-store story. Public already has a federated model: `memory_search` for memories, CocoIndex for semantic code intent, and code graph for structural questions.
- **Why it matters for us**: The architecture signal here is to keep planes distinct and route by task intent, not merge every embedding-backed system into one “hybrid retrieval” feature. Mnemosyne reinforces the value of a clear memory plane, but Public’s broader federation is the stronger design.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 6: Make offline backend readiness a first-class memory concern, not a hidden first-use side effect
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L18), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L64), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L78), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L113), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L782)
- **What it does**: Mnemosyne’s README documents a one-time model download of about 500 MB, and the wrapper handles missing binaries with a string fallback. Its project auto-init is best-effort and does not inspect the `init` exit status before logging success. Public, by contrast, already models readiness and recovery through `session_bootstrap`, structural status, and explicit next actions.
- **Why it matters for us**: The paradigm shift is to treat offline model/backend warmup as architecture, not ops trivia. If Public ever adds heavier local inference backends, readiness, degraded mode, and repair guidance should stay first-class surfaces.
- **Recommendation**: prototype later
- **Impact**: medium

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [memory-surface.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts)
- [claude/session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts)
- [gemini/compact-inject.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts)
- [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts)
- [scope-governance.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [vector-index-queries.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)

## Assessment
- New information ratio: 0.81
- Questions addressed: compaction-hook leverage, API-surface vs handler reality, operational `core` vs pinning semantics, runtime facade layering, memory-vs-code retrieval boundaries, offline-first readiness tradeoffs
- Questions answered: The strongest paradigm shifts are not new ranking algorithms. They are API and runtime shifts: compaction should preserve memory behavior, retrieval posture must be explicit in the tool contract, pinning should be separated from governance tiers, OpenCode should get a curated facade over the governed MCP core, and memory retrieval should remain one plane in a federated routing stack. The exact validation command passed with `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, while still emitting `cannot create temp file for here document: Operation not permitted`.

## Reflection
- What worked: Reading the wrapper first, then tracing Public’s transport, prime, search, and routing surfaces made the real deltas obvious. The highest-value gaps are cross-layer seams where Public already has the primitive but does not surface it consistently.
- What did not work: The sandbox is read-only, so I could not update `research/research.md`, `checklist.md`, `implementation-summary.md`, or run `generate-context.js` to save memory. The external checkout is also wrapper-thin, so backend ranking specifics remain README-documented rather than source-proven.

## Recommended Next Focus
Prototype one API-surface alignment slice instead of a backend rewrite: add an explicit OpenCode-facing retrieval facade that exposes `retrievalLevel` and `pin`, then extend the OpenCode compaction payload with bounded memory-behavior guidance so OpenCode reaches parity with the existing Claude/Gemini recovery pattern.
