# Iteration 036: USER WORKFLOW IMPACT

## Focus
USER WORKFLOW IMPACT: How will adopted patterns change the agent developer experience? New commands, changed behaviors, migration guides needed.

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
the transport-owned compaction memory action card plus compaction-continuity benchmark, and one `P1/P2` packet for an audited `memory_remember` intake path with an optional scoped `project|global` facade that delegates to existing governed scope and save authority.
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
### Finding N: [Title]
- **Source**: file path(s)
- [memory-crud-stats.ts:126-175](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts#L126)
- Validation: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict` -> `RESULT: PASSED`, `Errors: 0`, `Warnings: 0`, with the known read-only temp warning.

## Assessment
- New information ratio: `0.08`
- Questions addressed: phased sequencing, quarter boundaries, dependency ordering, adoption vs prototype split, and guardrail placement.
- Questions answered: Q1 should deliver compaction guidance plus measurement; Q2 should deliver audited inline ingest; Q2/Q3 should prototype ergonomic scope aliases; Q3 should improve operator readiness only after metrics exist.
- Novelty justification: This pass adds little new source discovery, but it converts the final recommendation set into an execution order that preserves Public’s governance model while maximizing measurable early wins.

## Ruled Out
- Mnemosyne-style basename-derived scope and `core=true` shortcut authority should not land on Public’s primary surface because Public’s save and retrieval paths require governed tenant/actor/session/shared-space enforcement.
- Re-platforming Public’s retrieval or mutation core around Mnemosyne should remain rejected; the transferable value is wrapper ergonomics and compaction behavior, not replacing Public’s hybrid pipeline or CocoIndex separation.

## Reflection
- What worked: using iteration 30 as the synthesis anchor and then re-checking only the source files that define compaction, scope, save authority, and health surfaces made the roadmap tighter and less speculative.
- What did not work: there was no new implementation work to inspect, so most value came from dependency synthesis rather than novel discovery.
- What I would do differently: for iteration 32, I would convert each Q1/Q2/Q3 milestone into packet-ready success criteria and explicit verification gates so the roadmap can be executed without re-arguing sequencing.

## Recommended Next Focus
Translate this roadmap into packet candidates: Q1 packet for compaction action card plus continuity benchmark, Q2 packet for audited `memory_remember`, and Q2/Q3 packet for optional `project|global` facade plus operator warmup/doctor validation plan. This was a read-only synthesis; I did not update the phase files or save memory artifacts in the phase folder.
--- Iteration 32 ---
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
### Finding N: [Title]
- **Source**: file path(s)
--- Iteration 33 ---
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
### Finding N: [Title]
- **Source**: file path(s)
## Assessment
- **New information ratio**: `0.23`
- **Questions addressed**: unit-vs-integration boundaries, memory-quality regression strategy, compaction/bootstrapping verification, scope/offline-failure testing, and how much of Mnemosyne to test directly versus as an adapter contract.
- **Questions answered**: wrapper behavior should be unit-tested with mocks; stateful Public behaviors should use real SQLite fixtures; retrieval quality should be gated by ablation/ground-truth metrics; compaction needs payload snapshots; scope/offline matrices should precede any facade rollout.
- **Novelty justification**: This pass adds a concrete three-lane testing architecture tied to current Public sources instead of only comparing feature patterns at the design level.
- **Validation**: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict` returned `RESULT: PASSED` with `Errors: 0  Warnings: 0`, plus the known read-only warning `cannot create temp file for here document: Operation not permitted`.
- **Execution note**: This was read-only static analysis. I did not update `research/research.md`, `checklist.md`, `implementation-summary.md`, or save memory artifacts in the phase folder.

## Ruled Out
- Testing unseen Mnemosyne backend ranking internals from this repo alone, because the wrapper only proves the CLI contract.
- Relying on source-string assertions as the primary regression defense for stateful retrieval and save behavior.
- Using benchmark-only evaluation without correctness and scope/integrity suites, because quality drift and safety drift can diverge.

## Reflection
- **What worked**: Treating Mnemosyne as a thin adapter and mapping its risks onto Public’s existing eval, archival, reconsolidation, and session-test surfaces produced a practical test plan quickly.
- **What did not work**: The external repo offers no observable backend internals and minimal packaging metadata, so novel insight came from boundary analysis rather than deeper implementation inspection.
- **What I would do differently**: In iteration 34, I would convert this into explicit CI lanes and named fixture packs with pass/fail thresholds per lane.

## Recommended Next Focus
Define the concrete CI split for this test strategy: `contract-fast`, `sqlite-integration`, and `retrieval-regression`, with exact commands, fixture ownership, and release gates for each lane.
--- Iteration 34 ---
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
- **Why it matters**: This is the right architecture for long-lived memory. Permanence, recall probability, and current-session salience should stay independent so we do not accidentally make durable rules feel “old” or recent noise feel “important.”
- **Recommendation**: adopt now
- New information ratio: `0.24`
- Questions addressed: `[search latency trade-offs, storage growth controls, indexing overhead, startup-time impact, compaction overhead, code-search separation]`
- Questions answered: `[Public’s main costs come from ranking depth and startup integrity work; its main savings come from incremental indexing and active-corpus reduction; Mnemosyne’s main advantage is cheap wrapper ergonomics, not lower total runtime cost]`
- Novelty justification: `This pass adds a performance-specific synthesis that separates thin plugin overhead from backend cold-start cost and maps Mnemosyne’s cheap compaction/scoping ergonomics onto Public’s heavier but more resilient retrieval lifecycle.`
- Validation: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict` returned `RESULT: PASSED` with `Errors: 0  Warnings: 0`; it also emitted the known read-only warning `cannot create temp file for here document: Operation not permitted`.

## Ruled Out
- Re-platforming Public’s primary memory backend around Mnemosyne for performance reasons alone, because the cold path just moves into a binary/model dependency while losing Public’s current integrity and indexing controls.
- Merging CocoIndex into the memory path, because code-search indexing cost and refresh behavior are materially different from steady-state memory lookup.
- Immediate vector rebuild during unarchive, because Public’s deferred re-embedding keeps archive/unarchive lightweight and avoids synchronous write amplification.

## Reflection
- What worked: tracing the wrapper first, then mapping each claimed advantage onto Public’s real startup, retrieval, archival, and indexing code made the trade-offs concrete instead of speculative.
- What did not work: CocoIndex semantic search was not usable in this turn, so I relied on targeted source reads and exact-term sweeps for the Public-side evidence.
- What I would do differently: next pass should turn these static findings into explicit p50/p95 measurements for `memory_search`, startup scan, and `memory_index_scan` across small, medium, and large fixture corpora.

## Recommended Next Focus
Benchmark the concrete breakpoints: `memory_search` p50/p95 by query tier, startup boot phases with and without background scan, archive/unarchive corpus shrink effects, and incremental scan savings as memory counts scale.

Read-only note: I did not update [research/research.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/research.md), [checklist.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/checklist.md), [implementation-summary.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/implementation-summary.md), or run `generate-context.js`, because this sandbox is read-only.
--- Iteration 35 ---
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
- **Why it matters**: This is the right architecture for long-lived memory. Permanence, recall probability, and current-session salience should stay independent so we do not accidentally make durable rules feel “old” or recent noise feel “important.”
- **Recommendation**: adopt now
- Validation: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict` returned `RESULT: PASSED` with `Errors: 0  Warnings: 0`, plus the known read-only warning `cannot create temp file for here document: Operation not permitted`.

## Ruled Out
- Re-platforming Public’s primary memory backend or mutation path around Mnemosyne’s CLI wrapper.
- Collapsing memory retrieval, CocoIndex semantic code search, and code-graph structural routing into one unified search surface.
- Importing basename-derived `project/global` scope as the primary authority for Public.
- Mapping Mnemosyne `core=true` directly onto Public’s constitutional/session/causal model.

## Reflection
- What worked: starting with the wrapper source and then comparing only the directly corresponding Public files made the compatibility boundaries crisp instead of speculative.
- What did not work: the external repo proves almost nothing about backend ranking internals, so the highest-confidence findings came from interface and lifecycle analysis, not deeper algorithm inspection.
- What I would do differently: next pass should turn these conclusions into a concrete adapter matrix with three columns: transport-only prompt injection, MCP facade delegation, and explicit non-goals.

## Recommended Next Focus
Define a packet-ready adapter plan with three tracks:
1. transport-owned memory reminder block merged into the existing compaction/recovery path,
2. optional ergonomic facade that delegates to `memory_context` / `memory_match_triggers` / `memory_save` instead of a second storage backend,
3. compatibility tests for scope collisions (`basename` vs governed scope), prompt-duplication control, and code-search routing boundaries.

Read-only note: I did not update [research/research.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/research.md), [checklist.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/checklist.md), [implementation-summary.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/implementation-summary.md), or run `generate-context.js`, because this sandbox is read-only.

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
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
I’m treating this as a read-only deep-research pass for iteration 36, focused on developer workflow impact and migration ergonomics. I’ll first do a light memory/skill/context pass, then inspect the external wrapper and the current Public surfaces side by side so the findings stay evidence-backed and current.
exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc 'rg -n "mnemosyne|hybrid-rag-fusion|compaction|project/global|memory_recall|memory_store" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
I’ve got the relevant research skill/context loaded and a light memory pass confirms this sits in the existing hybrid-rag research family. Next I’m validating the phase folder and then reading the external wrapper in the required order with exact line references so the workflow-impact findings stay tied to source, not assumptions.
exec
/bin/zsh -lc "nl -ba \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main/src/index.ts\" | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
nl: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main/src/index.ts: No such file or directory

exec
/bin/zsh -lc "nl -ba \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main/package.json\" | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
nl: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main/package.json: No such file or directory

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1167ms:

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
The phase validator is still running, and the external repo path in the prompt appears to be slightly off from what’s actually on disk. I’m resolving the real `external/` layout now so the rest of the pass uses exact paths and line numbers.
exec
/bin/zsh -lc "find \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external\" -maxdepth 3 \\( -name 'index.ts' -o -name 'package.json' -o -name 'README.md' \\) | sort" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts

exec
/bin/zsh -lc 'find "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external" -maxdepth 3 -type d | sort' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/.github
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/.github/workflows
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src

codex
I’ve confirmed the repo is even thinner than the prompt suggests: the wrapper lives directly under `external/src/index.ts`, with `package.json` and `README.md` at the external root. I’m reading those now alongside the Public retrieval and compaction surfaces, and I’m also using semantic search once to make sure I’m not missing the current hybrid-memory implementation boundaries.
exec
/bin/zsh -lc "nl -ba \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts\" | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
codex
The wrapper read confirms the big distinction: the novel value is not a richer backend surface, it’s the thin developer-facing ergonomics layer and the compaction-time reminder block. I’m pulling the matching Public retrieval, resume, compaction, and command surfaces now so I can turn that into concrete workflow and migration guidance instead of just API comparison.
exec
/bin/zsh -lc 'rg -n "RRF|BM25|fts|vector|fusion|hybrid|reciprocal|embedding|sqlite-vec" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
85:} from '../lib/search/sqlite-fts.js';
86:import type { LexicalCapabilitySnapshot } from '../lib/search/sqlite-fts.js';
482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
763:    // Wait for embedding model only on cache miss
777:        : 'hybrid',
1234:        fusionMethod: 'rrf',

exec
/bin/zsh -lc 'rg -n "session_bootstrap|session_resume|resume|startup|bootstrap|code_graph_scan" .opencode/skill/system-spec-kit/mcp_server/context-server.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '1,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
5:// Logic in tools/*.ts. This file retains server init, startup,
33:// Handler modules (only indexSingleFile needed directly for startup scan)
67:import { detectNodeVersionMismatch, checkSqliteVersion } from './startup-checks.js';
120:// T107: Transaction manager for pending file recovery on startup (REQ-033)
201:/** Timeout (ms) for waiting on embedding model readiness during startup scan. */
204:/** Timeout (ms) for API key validation during startup. */
215:  'code_graph_scan',
257:  preservesAuthority: 'session_bootstrap';
258:  surface: 'response-hints' | 'session-bootstrap' | 'memory-context';
323:    preservesAuthority: 'session_bootstrap',
738:// (CHK-076): Instructions are computed once at startup and NOT refreshed during the session.
770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
771:        snap.graphFreshness === 'empty' ? 'run code_graph_scan' :
772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
782:  // Phase 027: Structural bootstrap guidance for non-hook runtimes
785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
882:    if (name === 'memory_context' && args.mode === 'resume') {
912:      name === 'memory_context' && args.mode === 'resume';
1144:let startupScanInProgress = false;
1177: * T107: Recover pending memory files on MCP startup.
1178: * CHK-188: Pending files processed by recovery job on next startup.
1188:    // P1-002-SCAN: share the same allowed-root expansion that startup indexing uses.
1191:    // P1 FIX: Wire isCommittedInDb callback so stale pending files are detected at startup.
1230:async function startupScan(basePath: string): Promise<void> {
1231:  if (startupScanInProgress) {
1236:  startupScanInProgress = true;
1277:        // Non-fatal: skip inaccessible startup roots.
1315:          operation: 'startup-scan',
1318:        // Non-fatal: startup scan must continue even if invalidation hooks fail.
1331:    startupScanInProgress = false;
1491:  // Validates API key at startup to fail fast with actionable error messages
1493:  let startupEmbeddingConfig: Awaited<ReturnType<typeof resolveStartupEmbeddingConfig>> | null = null;
1497:      startupEmbeddingConfig = await resolveStartupEmbeddingConfig({ timeout: API_KEY_VALIDATION_TIMEOUT_MS });
1498:      const validation: ApiKeyValidation = startupEmbeddingConfig.validation;
1512:          console.warn('[context-server] Continuing startup — validation will occur on first use');
1541:      console.error('[context-server] Continuing startup - validation will occur on first use');
1549:      startupEmbeddingConfig?.dimension ?? getStartupEmbeddingDimension(),
1581:  // in shared embeddings, so startup no longer branches on shouldEagerWarmup().
1671:    // Keep db-state reinitialization wiring aligned with startup search wiring.
1696:    // P3-04: Rebuild BM25 index from database on startup
1725:      throw new Error(`[context-server] Extraction adapter startup failed: ${message}`);
1775:    // REQ-D4-004: Batch feedback learning — runs one cycle at startup (shadow-only, no live ranking mutations).
1864:        console.warn('[context-server] File watcher startup failed:', message);
1890:  // Background startup scan
1891:  setImmediate(() => startupScan(DEFAULT_BASE_PATH));

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
   261	    return Array.isArray(data?.results)
   262	      ? data.results as Array<Record<string, unknown>>
   263	      : [];
   264	  } catch {
   265	    return [];
   266	  }
   267	}
   268	
   269	function extractSearchCachePayload(response: MCPResponse): SearchCachePayload | null {
   270	  const firstEntry = response?.content?.[0];
   271	  if (!firstEntry || typeof firstEntry.text !== 'string') {
   272	    return null;
   273	  }
   274	
   275	  try {
   276	    const envelope = JSON.parse(firstEntry.text) as Record<string, unknown>;
   277	    const summary = typeof envelope.summary === 'string' ? envelope.summary : null;
   278	    const data = envelope.data && typeof envelope.data === 'object'
   279	      ? envelope.data as Record<string, unknown>
   280	      : null;
   281	    const hints = Array.isArray(envelope.hints)
   282	      ? envelope.hints.filter((hint): hint is string => typeof hint === 'string')
   283	      : [];
   284	
   285	    if (!summary || !data) {
   286	      return null;
   287	    }
   288	
   289	    return { summary, data, hints };
   290	  } catch {
   291	    return null;
   292	  }
   293	}
   294	
   295	function parseResponseEnvelope(
   296	  response: MCPResponse,
   297	): { firstEntry: { type: 'text'; text: string }; envelope: Record<string, unknown> } | null {
   298	  const firstEntry = response?.content?.[0];
   299	  if (!firstEntry || firstEntry.type !== 'text' || typeof firstEntry.text !== 'string') {
   300	    return null;
   301	  }
   302	
   303	  try {
   304	    return {
   305	      firstEntry,
   306	      envelope: JSON.parse(firstEntry.text) as Record<string, unknown>,
   307	    };
   308	  } catch {
   309	    return null;
   310	  }
   311	}
   312	
   313	function replaceResponseEnvelope(
   314	  response: MCPResponse,
   315	  firstEntry: { type: 'text'; text: string },
   316	  envelope: Record<string, unknown>,
   317	): MCPResponse {
   318	  return {
   319	    ...response,
   320	    content: [{ ...firstEntry, text: JSON.stringify(envelope, null, 2) }],
   321	  };
   322	}
   323	
   324	function buildSessionStatePayload(sessionId: string): Record<string, unknown> {
   325	  const session = retrievalSessionStateManager.getOrCreate(sessionId);
   326	  return {
   327	    activeGoal: session.activeGoal,
   328	    seenResultIds: Array.from(session.seenResultIds),
   329	    openQuestions: [...session.openQuestions],
   330	    preferredAnchors: [...session.preferredAnchors],
   331	  };
   332	}
   333	
   334	function buildSearchResponseFromPayload(
   335	  payload: SearchCachePayload,
   336	  startTime: number,
   337	  cacheHit: boolean,
   338	): MCPResponse {
   339	  return createMCPSuccessResponse({
   340	    tool: 'memory_search',

exec
/bin/zsh -lc "nl -ba .opencode/plugins/spec-kit-compact-code-graph.js | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/skill/mcp-coco-index/README.md | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   221	    tool_reference.md              Complete CLI and MCP parameter reference
   222	  scripts/
   223	    install.sh                     Install CocoIndex Code into skill venv
   224	    update.sh                      Update to latest version
   225	    doctor.sh                      Read-only health check (supports --json, --strict)
   226	    ensure_ready.sh                Idempotent bootstrap (install + init + index if needed)
   227	  mcp_server/
   228	    .venv/
   229	      bin/
   230	        ccc                        CLI binary (full path for PATH-less invocation)
   231	```
   232	
   233	<!-- /ANCHOR:structure -->
   234	
   235	---
   236	
   237	<!-- ANCHOR:configuration -->
   238	## 5. CONFIGURATION
   239	
   240	**Binary path**

exec
/bin/zsh -lc "rg -n \"experimental\\.session\\.compacting|compaction|messagesTransform|tool:\" .opencode/plugins/spec-kit-compact-code-graph.js" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
76: *   messagesTransform: TransportBlock[],
77: *   compaction?: TransportBlock,
136:    if (plan.transportOnly !== true || !Array.isArray(plan.messagesTransform)) {
295:    tool: {
369:      if (!plan || plan.messagesTransform.length === 0) {
373:      for (const block of plan.messagesTransform) {
396:    'experimental.session.compacting': async (input, output) => {
406:      const block = plan?.compaction;

exec
/bin/zsh -lc "nl -ba .opencode/plugins/spec-kit-compact-code-graph.js | sed -n '260,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/references/workflows/quick_reference.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: Quick Reference
     3	description: Fast lookup for commands, checklists, and troubleshooting using the progressive enhancement model.
     4	---
     5	
     6	# Quick Reference - Commands, Checklists & Troubleshooting
     7	
     8	Fast lookup for spec folder commands, checklists, and troubleshooting.
     9	
    10	---
    11	
    12	<!-- ANCHOR:overview -->
    13	## 1. OVERVIEW
    14	
    15	### Purpose
    16	
    17	Quick reference for spec folder management, commands, and troubleshooting using the progressive enhancement model.
    18	
    19	### Progressive Enhancement Model
    20	
    21	```
    22	Level 1 (Baseline):     spec.md + plan.md + tasks.md + implementation-summary.md
    23	Level 2 (Verification): Level 1 + checklist.md
    24	Level 3 (Full):         Level 2 + decision-record.md + optional research
    25	Level 3+ (Extended):    Level 3 + governance/AI execution content
    26	```
    27	
    28	### Key Points
    29	
    30	- LOC thresholds are **SOFT GUIDANCE** (not enforcement)
    31	- **Enforcement is MANUAL** - verify required templates exist before claiming completion
    32	
    33	---
    34	
    35	<!-- /ANCHOR:overview -->
    36	<!-- ANCHOR:level-decision-shortcuts-progressive-enhancement -->
    37	## 2. LEVEL DECISION SHORTCUTS (Progressive Enhancement)
    38	
    39	| Situation | Level | Required Templates | Optional Templates |
    40	|-----------|-------|-------------------|-------------------|
    41	| Any task (baseline) | 1 | spec.md + plan.md + tasks.md + implementation-summary.md | None |
    42	| Needs QA validation | 2 | L1 + checklist.md | None |
    43	| Complex/architectural | 3 | L2 + decision-record.md | research/research.md |
    44	| Enterprise/governance heavy | 3+ | L3 file set from `templates/level_3+/` | research/research.md |
    45	
    46	**LOC as soft guidance:**
    47	- <100 LOC suggests Level 1
    48	- 100-499 LOC suggests Level 2
    49	- >=500 LOC suggests Level 3
    50	- High complexity/risk and governance needs suggest Level 3+
    51	
    52	---
    53	
    54	<!-- /ANCHOR:level-decision-shortcuts-progressive-enhancement -->
    55	<!-- ANCHOR:template-copy-commands-progressive -->
    56	## 3. TEMPLATE COPY COMMANDS (Progressive)
    57	
    58	### Level 1: Baseline (ALL features start here)
    59	
    60	```bash
    61	cp .opencode/skill/system-spec-kit/templates/level_1/spec.md ###-name/spec.md
    62	cp .opencode/skill/system-spec-kit/templates/level_1/plan.md specs/###-name/plan.md
    63	cp .opencode/skill/system-spec-kit/templates/level_1/tasks.md specs/###-name/tasks.md
    64	cp .opencode/skill/system-spec-kit/templates/level_1/implementation-summary.md specs/###-name/implementation-summary.md
    65	```
    66	
    67	### Level 2: Verification (complete set)
    68	
    69	```bash
    70	cp .opencode/skill/system-spec-kit/templates/level_2/spec.md specs/###-name/spec.md
    71	cp .opencode/skill/system-spec-kit/templates/level_2/plan.md specs/###-name/plan.md
    72	cp .opencode/skill/system-spec-kit/templates/level_2/tasks.md specs/###-name/tasks.md
    73	cp .opencode/skill/system-spec-kit/templates/level_2/implementation-summary.md specs/###-name/implementation-summary.md
    74	cp .opencode/skill/system-spec-kit/templates/level_2/checklist.md specs/###-name/checklist.md
    75	```
    76	
    77	### Level 3: Full Documentation (complete set)
    78	
    79	```bash
    80	cp .opencode/skill/system-spec-kit/templates/level_3/spec.md specs/###-name/spec.md
    81	cp .opencode/skill/system-spec-kit/templates/level_3/plan.md specs/###-name/plan.md
    82	cp .opencode/skill/system-spec-kit/templates/level_3/tasks.md specs/###-name/tasks.md
    83	cp .opencode/skill/system-spec-kit/templates/level_3/implementation-summary.md specs/###-name/implementation-summary.md
    84	cp .opencode/skill/system-spec-kit/templates/level_3/checklist.md specs/###-name/checklist.md
    85	cp .opencode/skill/system-spec-kit/templates/level_3/decision-record.md specs/###-name/decision-record.md
    86	```
    87	
    88	### Level 3+: Extended Documentation (complete set)
    89	
    90	```bash
    91	cp .opencode/skill/system-spec-kit/templates/level_3+/spec.md specs/###-name/spec.md
    92	cp .opencode/skill/system-spec-kit/templates/level_3+/plan.md specs/###-name/plan.md
    93	cp .opencode/skill/system-spec-kit/templates/level_3+/tasks.md specs/###-name/tasks.md
    94	cp .opencode/skill/system-spec-kit/templates/level_3+/implementation-summary.md specs/###-name/implementation-summary.md
    95	cp .opencode/skill/system-spec-kit/templates/level_3+/checklist.md specs/###-name/checklist.md
    96	cp .opencode/skill/system-spec-kit/templates/level_3+/decision-record.md specs/###-name/decision-record.md
    97	```
    98	
    99	### Optional Templates (Level 3 Only)
   100	
   101	```bash
   102	## Comprehensive Research (from root templates folder):
   103	mkdir -p specs/###-name/research && cp .opencode/skill/system-spec-kit/templates/research.md specs/###-name/research/research.md
   104	```
   105	
   106	---
   107	
   108	<!-- /ANCHOR:template-copy-commands-progressive -->
   109	<!-- ANCHOR:essential-commands -->
   110	## 4. ESSENTIAL COMMANDS
   111	
   112	### Start Here: Command Map
   113	
   114	If the runtime does not surface command menus clearly, use this compact command map first.
   115	
   116	**SpecKit workflow commands**
   117	- `/spec_kit:resume` - continue or recover existing spec-folder work
   118	- `/spec_kit:plan` - define or refine a scoped spec and plan
   119	- `/spec_kit:implement` - execute an existing spec and plan packet
   120	- `/spec_kit:complete` - run the full spec-to-implementation lifecycle
   121	- `/spec_kit:debug` - delegate a persistent issue to debug workflow
   122	- `/spec_kit:handover` - write continuation context for the next session
   123	- `/spec_kit:deep-research` - run iterative research before planning
   124	- `/spec_kit:deep-review` - run iterative review and finding synthesis
   125	
   126	**Memory commands**
   127	- `/memory:save` - preserve the current session context into spec memory
   128	- `/memory:search` - retrieve prior context, decisions, and analysis
   129	- `/memory:manage` - run maintenance, checkpoint, cleanup, and shared-memory operations
   130	- `/memory:learn` - create or manage constitutional always-surface rules
   131	
   132	**Nested changelog generator**
   133	- `node .opencode/skill/system-spec-kit/scripts/dist/spec-folder/nested-changelog.js <spec-folder> --write` - publish a packet-local changelog for a root spec or phase child
   134	
   135	### Find Next Spec Number
   136	
   137	```bash
   138	ls -d specs/[0-9]*/ | sed 's/.*\/\([0-9]*\)-.*/\1/' | sort -n | tail -1
   139	```
   140	
   141	Add 1 to the result to get your next number.
   142	
   143	### Create Spec Folder
   144	
   145	```bash
   146	mkdir -p specs/###-short-name/
   147	```
   148	
   149	### Template Composition (Maintainer)
   150	
   151	```bash
   152	# Compose all level templates from core + addendum
   153	./scripts/templates/compose.sh
   154	
   155	# Preview changes without writing
   156	./scripts/templates/compose.sh --dry-run
   157	
   158	# Verify templates are current
   159	./scripts/templates/compose.sh --verify
   160	
   161	# Compose specific levels
   162	./scripts/templates/compose.sh 2 3
   163	```
   164	
   165	**Naming rules:**
   166	- 2-3 words (shorter is better)
   167	- Lowercase
   168	- Hyphen-separated
   169	- Action-noun structure
   170	
   171	**Good examples:** `fix-typo`, `add-auth`, `mcp-code-mode`, `cli-codex`
   172	
   173	### Manual Context Save
   174	
   175	Trigger manual context save:
   176	```
   177	Say: "save context" or "save conversation"
   178	```
   179	
   180	**Required Inputs:** Structured JSON is mandatory for routine saves, and the target spec folder is still required
   181	```
   182	node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/007-feature/
   183	```
   184	
   185	❌ DO NOT use Write/Edit tools to create memory files directly.
   186	
   187	---
   188	
   189	<!-- /ANCHOR:essential-commands -->
   190	<!-- ANCHOR:pre-implementation-checklist-progressive-enhancement -->
   191	## 5. PRE-IMPLEMENTATION CHECKLIST (Progressive Enhancement)
   192	
   193	Before making ANY file changes, verify:
   194	
   195	- [ ] Determined level (1/2/3/3+) or exempt (typo fix)
   196	- [ ] Created `/specs/[###-short-name]/`
   197	- [ ] Copied ALL REQUIRED templates for chosen level:
   198	  - [ ] Level 1: spec.md + plan.md + tasks.md + implementation-summary.md
   199	  - [ ] Level 2: Level 1 + checklist.md
   200	  - [ ] Level 3: Level 2 + decision-record.md
   201	  - [ ] Level 3+: Use full Level 3 file set from `templates/level_3+/`
   202	- [ ] Renamed templates correctly
   203	- [ ] Filled ALL template sections with actual content
   204	- [ ] Removed placeholder text and sample sections
   205	- [ ] Copied optional templates if needed (Level 3 only)
   206	- [ ] Presented approach to user (including templates used)
   207	- [ ] Got explicit approval ("yes"/"go ahead"/"proceed")
   208	
   209	**If ANY unchecked → STOP**
   210	**If required template missing → Cannot claim completion**
   211	
   212	---
   213	
   214	<!-- /ANCHOR:pre-implementation-checklist-progressive-enhancement -->
   215	<!-- ANCHOR:folder-naming-examples -->
   216	## 6. FOLDER NAMING EXAMPLES
   217	
   218	### Good Examples ✅
   219	
   220	- `fix-typo` (concise, clear)
   221	- `add-validation` (action-noun)
   222	- `implement-auth` (descriptive)
   223	- `cdn-migration` (noun-noun acceptable)
   224	- `hero-animation-v2` (version included)
   225	
   226	### Bad Examples ❌
   227	
   228	- `fix-the-typo-in-header-component` (too long - max 4 words)
   229	- `fixTypo` (not kebab-case)
   230	- `fix_typo` (snake_case, should be kebab-case)
   231	- `typo` (too vague, lacks context)
   232	- `PROJ-123-fix` (no ticket numbers)
   233	
   234	---
   235	
   236	<!-- /ANCHOR:folder-naming-examples -->
   237	<!-- ANCHOR:status-field-values -->
   238	## 7. STATUS FIELD VALUES
   239	
   240	| Status | Meaning | Reuse Priority |
   241	|--------|---------|----------------|
   242	| `draft` | Planning phase | 2 (can start) |
   243	| `active` | Work in progress | 1 (highest - continue here) |
   244	| `paused` | Temporarily on hold | 3 (can resume) |
   245	| `complete` | Implementation finished | 4 (avoid reopening) |
   246	| `archived` | Historical record | 5 (do not reuse) |
   247	
   248	---
   249	
   250	<!-- /ANCHOR:status-field-values -->
   251	<!-- ANCHOR:update-vs-create-decision -->
   252	## 8. UPDATE VS CREATE DECISION
   253	
   254	### UPDATE Existing Spec When:
   255	
   256	✅ Iterative development (continuing same feature)
   257	✅ Bug fixes (fixing existing implementation)
   258	✅ Scope escalation (work grew beyond estimate)
   259	✅ Feature enhancement (adding to existing functionality)
   260	✅ Resuming paused work

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/references/memory/save_workflow.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: Memory Save Workflow
     3	description: Complete guide to saving conversation context including execution methods, output format, and retrieval.
     4	---
     5	
     6	# Memory Save Workflow - Context Preservation Methods
     7	
     8	Complete guide to saving conversation context, execution methods, and retrieval.
     9	
    10	---
    11	
    12	<!-- ANCHOR:overview -->
    13	## 1. OVERVIEW
    14	
    15	### Core Principle
    16	
    17	Execute memory operations through whichever method fits your workflow - slash commands for convenience, direct scripts for control. All paths produce identical output with consistent naming for reliable retrieval and index into the same 3-source memory system (schema v23).
    18	
    19	When direct CLI mode includes an explicit spec-folder argument, that target is authoritative. Session-learning matches, JSON `SPEC_FOLDER` fields, and auto-detect may inform diagnostics, but they must not reroute the save to another folder.
    20	
    21	Direct phase-folder targets are supported. If the explicit CLI target resolves to a policy-defined phase folder, `generate-context.js` preserves that target and writes memory files into the selected phase folder's `memory/` directory.
    22	
    23	### Governed Save Boundaries
    24	
    25	The save workflow stays compatible with private, agent-scoped, and shared-memory operation. When the surrounding runtime enables governance, save and follow-up retrieval flows may carry `tenantId`, `userId`, `agentId`, and `sharedSpaceId` so memory capture stays inside the intended boundary.
    26	
    27	Shared-memory saves do not bypass rollout or access checks. Enable the subsystem first and manage deny-by-default memberships through `/memory:manage shared` before relying on shared-space save targets or shared retrieval follow-ups.
    28	
    29	### Execution Paths
    30	
    31	The memory system supports **2 independent execution paths**. Any method can be used standalone.
    32	
    33	### Method Comparison
    34	
    35	| Method            | AI Agent Required | Best For                           | Effort | Token Cost |
    36	| ----------------- | ----------------- | ---------------------------------- | ------ | ---------- |
    37	| **Slash Command** | Yes               | Interactive saves, manual triggers | Low    | ~200       |
    38	| **Direct Script** | No                | Testing, debugging, CI/CD          | Medium | 0          |
    39	
    40	### Execution Flow
    41	
    42	```
    43	┌────────────────────────────────────────────────────────────────┐
    44	│                    MEMORY SAVE PATHWAYS                        │
    45	├────────────────────────────────────────────────────────────────┤
    46	│                                                                │
    47	│   Slash Command                    Direct Script               │
    48	│   ┌──────────┐                    ┌──────────┐                 │
    49	│   │ /memory: │                    │  node    │                 │
    50	│   │  save    │                    │ script.ts│                 │
    51	│   └────┬─────┘                    └────┬─────┘                 │
    52	│        │                               │                       │
    53	│        ▼                               ▼                       │
    54	│   ┌──────────┐                    ┌──────────┐                 │
    55	│   │ AI Agent │                    │   JSON   │                 │
    56	│   │ Analysis │                    │   Input  │                 │
    57	│   └────┬─────┘                    └────┬─────┘                 │
    58	│        │                               │                       │
    59	│        └───────────────────────────────┘                       │
    60	│                              │                                 │
    61	│                              ▼                                 │
    62	│                    ┌─────────────────┐                         │
    63	│                    │ generate-context│                         │
    64	│                    │      .ts        │                         │
    65	│                    └────────┬────────┘                         │
    66	│                             │                                  │
    67	│                             ▼                                  │
    68	│                    ┌─────────────────┐                         │
    69	│                    │ specs/###/      │                         │
    70	│                    │ memory/*.md     │                         │
    71	│                    └─────────────────┘                         │
    72	│                                                                │
    73	└────────────────────────────────────────────────────────────────┘
    74	```
    75	
    76	---
    77	
    78	<!-- /ANCHOR:overview -->
    79	<!-- ANCHOR:method-selection -->
    80	## 2. METHOD SELECTION
    81	
    82	### Decision Tree
    83	
    84	```
    85	┌─────────────────────────────────────────────────────────────────┐
    86	│              WHICH METHOD SHOULD I USE?                         │
    87	└─────────────────────────────────────────────────────────────────┘
    88	                              │
    89	                              ▼
    90	              ┌───────────────────────────────┐
    91	              │ Is an AI agent active in      │
    92	              │ the current conversation?     │
    93	              └───────────────┬───────────────┘
    94	                              │
    95	               ┌──────────────┴──────────────┐
    96	               │                             │
    97	              YES                           NO
    98	               │                             │
    99	               ▼                             ▼
   100	┌─────────────────────────┐   ┌─────────────────────────┐
   101	│ Need automatic          │   │ Prepare JSON, then use  │
   102	│ conversation analysis?  │   │ Direct Script method    │
   103	└────────────┬────────────┘   └─────────────────────────┘
   104	             │
   105	      ┌──────┴──────┐
   106	      │             │
   107	     YES           NO
   108	      │             │
   109	      ▼             ▼
   110	┌───────────┐ ┌───────────┐
   111	│   SLASH   │ │  DIRECT   │
   112	│  COMMAND  │ │  SCRIPT   │
   113	│           │ │ (custom   │
   114	│ /memory:  │ │  JSON)    │
   115	│   save    │ │           │
   116	└───────────┘ └───────────┘
   117	```
   118	
   119	### Quick Selection Guide
   120	
   121	| Scenario                                  | Recommended Method |
   122	| ----------------------------------------- | ------------------ |
   123	| End of work session, want AI to summarize | **Slash Command**  |
   124	| CI/CD pipeline, automated saves           | **Direct Script**  |
   125	| Quick manual save, no AI available        | **Direct Script**  |
   126	| Testing memory system functionality       | **Direct Script**  |
   127	| Batch processing multiple saves           | **Direct Script**  |
   128	| Interactive session with full context     | **Slash Command**  |
   129	
   130	---
   131	
   132	<!-- /ANCHOR:method-selection -->
   133	<!-- ANCHOR:slash-commands -->
   134	## 3. SLASH COMMANDS
   135	
   136	**When to Use:** Manual save with AI-powered conversation analysis
   137	**Requirement:** Slash command files exist in `.opencode/command/memory/`
   138	
   139	### Available Commands
   140	
   141	```
   142	/memory:save       # Save current conversation context
   143	/memory:search  # Unified retrieval + analysis: search, epistemic baselines, causal graph, evaluation
   144	```
   145	
   146	### Execution Flow
   147	
   148	1. Slash command expands to full prompt
   149	2. AI agent analyzes conversation history
   150	3. AI agent creates structured JSON summary (any agent can invoke generate-context.js for memory — this is an exception to the @speckit exclusivity rule)
   151	4. AI agent calls `generate-context.js` with JSON data
   152	5. Context saved to active spec folder's `memory/` directory
   153	
   154	### Validation Checkpoints
   155	
   156	| Checkpoint       | Verification                   | Action on Failure         |
   157	| ---------------- | ------------------------------ | ------------------------- |
   158	| Command exists   | `ls .opencode/command/memory/` | Create command file       |
   159	| AI agent active  | Check response capability      | Use Direct Script instead |
   160	| Spec folder arg  | Passed via CLI argument        | Specify folder manually   |
   161	| Write permission | `test -w specs/###/memory/`    | Check folder permissions  |
   162	
   163	### Example Output
   164	
   165	```
   166	✓ Context analyzed (12 exchanges detected)
   167	✓ Spec folder: 049-anchor-context-retrieval
   168	✓ Memory file: 28_11_25_14-30__context-save.md
   169	✓ 3 anchors generated
   170	✓ Summary: 847 tokens
   171	```
   172	
   173	---
   174	
   175	<!-- /ANCHOR:slash-commands -->
   176	<!-- ANCHOR:direct-script -->
   177	## 4. DIRECT SCRIPT
   178	
   179	**When to Use:** Testing, debugging, custom workflows, CI/CD pipelines
   180	**Requirement:** Node.js installed
   181	
   182	### Usage Pattern
   183	
   184	```bash
   185	# Create minimal JSON data file
   186	cat > /tmp/test-save-context.json << 'EOF'
   187	{
   188	  "SPEC_FOLDER": "049-anchor-context-retrieval",
   189	  "recent_context": [{
   190	    "request": "Test save-context execution",
   191	    "completed": "Verified system works standalone",
   192	    "learning": "Direct script execution requires minimal JSON",
   193	    "duration": "5m",
   194	    "date": "2025-11-28T18:30:00Z"
   195	  }],
   196	  "observations": [{
   197	    "type": "discovery",
   198	    "title": "Standalone execution test",
   199	    "narrative": "Testing direct script invocation",
   200	    "timestamp": "2025-11-28T18:30:00Z",
   201	    "files": [],
   202	    "facts": ["Standalone execution works", "Minimal data sufficient"]
   203	  }],
   204	  "user_prompts": [{
   205	    "prompt": "Test save-context standalone",
   206	    "timestamp": "2025-11-28T18:30:00Z"
   207	  }]
   208	}
   209	EOF
   210	
   211	# Execute script directly
   212	node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
   213	  /tmp/test-save-context.json \
   214	  "049-anchor-context-retrieval"
   215	
   216	# Inline JSON mode (preferred for routine saves)
   217	node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
   218	  --json '{"specFolder":"049-anchor-context-retrieval","sessionSummary":"Implemented anchor retrieval..."}' \
   219	  "049-anchor-context-retrieval"
   220	
   221	# Stdin mode (preferred for routine saves)
   222	echo '{"specFolder":"049-anchor-context-retrieval","sessionSummary":"..."}' | \
   223	  node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin
   224	
   225	```
   226	
   227	### Required JSON Fields
   228	
   229	| Field            | Type   | Required | Description               |
   230	| ---------------- | ------ | -------- | ------------------------- |
   231	| `SPEC_FOLDER`    | string | Yes      | Target spec folder name   |
   232	| `recent_context` | array  | Yes      | Array of context objects  |
   233	| `observations`   | array  | No       | Discoveries and learnings |
   234	| `user_prompts`   | array  | No       | Original user requests    |
   235	
   236	If both the JSON payload and the CLI provide a spec folder, the explicit CLI argument wins.
   237	
   238	If that explicit CLI argument resolves to a phase folder, the command keeps that explicit target and saves into the selected phase folder's own `memory/` directory.
   239	
   240	### Validation Checkpoints
   241	
   242	| Checkpoint         | Verification                                           | Action on Failure        |
   243	| ------------------ | ------------------------------------------------------ | ------------------------ |
   244	| Node.js installed  | `node --version`                                       | Install Node.js          |
   245	| Script exists      | `test -f .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` | Check skill installation |
   246	| JSON valid         | `jq . < input.json`                                    | Fix JSON syntax          |
   247	| Spec folder exists | `test -d specs/###/`                                   | Create spec folder       |
   248	| Target exists under specs roots | Use the exact root-spec or phase-folder path you want to save into | Re-run with an explicit CLI target |
   249	
   250	---
   251	
   252	<!-- /ANCHOR:direct-script -->
   253	<!-- ANCHOR:output-format -->
   254	## 5. OUTPUT FORMAT
   255	
   256	### File Naming
   257	
   258	**Primary Document Format**: `{date}_{time}__{topic}.md`
   259	
   260	| Component | Format | Example |

exec
/bin/zsh -lc 'rg -n "/spec_kit:resume|/memory:save|memory_context|memory_match_triggers|memory_search|generate-context" .opencode/skill/system-spec-kit/references .opencode/skill/system-spec-kit/scripts .opencode/skill/system-spec-kit/feature_catalog' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/references/validation/phase_checklists.md:126:- [ ] Save context if significant progress: `/memory:save` or `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"...","sessionSummary":"..."}' specs/###-folder/`
.opencode/skill/system-spec-kit/references/validation/phase_checklists.md:159:- [ ] Memory context saved: `/memory:save` or `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"...","sessionSummary":"..."}' specs/###-folder/`
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:67:      'write session data to /tmp/save-context-data.json, then run: node generate-context.js /tmp/save-context-data.json [spec-folder]'
.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/08-constitutional-memory-end-to-end-lifecycle.md:25:- **Creation path.** `/memory:learn` is the operator control plane for constitutional memory lifecycle management. Its create flow writes a markdown rule into `.opencode/skill/system-spec-kit/constitutional/`, then immediately calls `memory_save({ filePath, force: true })`, and finally verifies the rule by running `memory_search()` against one of the trigger phrases. The same command family also exposes `list`, `edit`, `remove`, and `budget` actions, and documents the constitutional tier as the always-surface, no-decay, 3.0x-boost tier.
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:98:| 1    | Check CLI argument  | `node .opencode/.../scripts/dist/memory/generate-context.js data.json [spec-folder]` |
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:165:These thresholds are defined in `generate-context.ts`:
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:236:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js data.json "006-opencode/014-stateless-alignment"
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:239:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js data.json "122-skill-standardization/002-api-refactor"
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:244:1. User says "save context" or `/memory:save`
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:248:   node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/context.json "014-stateless-alignment"
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:341:AUTO_SAVE_MODE=true node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js data.json
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:348:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js data.json "122-specific-folder"
.opencode/skill/system-spec-kit/references/structure/folder_routing.md:510:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js data.json "122-feature/003-new-work"
.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:202:<!-- ANCHOR:generate-context-js-integration -->
.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:203:## 9. generate-context.js Integration
.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:205:When using subfolder versioning, the memory save script (`generate-context.js`) fully supports nested paths.
.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md:236:<!-- /ANCHOR:generate-context-js-integration -->
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md:55:| `mcp_server/tool-schemas.ts` | Core | memory_search schema exposes trackAccess/includeArchived/mode |
.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md:82:| `mcp_server/tests/tool-input-schema.vitest.ts` | Public/runtime schema validation for memory_search args |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:55:The memory system exposes **43 tools** overall, while the day-to-day command layer uses **4 main memory slash commands**, the `/memory:manage shared` subcommand area, and `/spec_kit:resume` for session recovery. Think of commands as doors into the system: the full MCP server has more rooms than the command layer exposes directly. Each door only opens access to the tools it needs. The source of truth for primary ownership is the coverage matrix in `.opencode/command/memory/README.txt`, while each command file's `allowed-tools` frontmatter shows the full operational surface. The recovery contract lives in `.opencode/command/spec_kit/resume.md`.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:59:| `/memory:search` | Search, retrieve, and analyze knowledge (13 tools) | `memory_context`, `memory_quick_search`, `memory_search`, `memory_match_triggers`, `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `eval_run_ablation`, `eval_reporting_dashboard`, `memory_get_learning_history` |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:60:| `/memory:learn` | Create and manage always-surface rules (6 tools, borrowed) | `memory_save`, `memory_search`, `memory_stats`, `memory_list`, `memory_delete`, `memory_index_scan` |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:61:| `/memory:manage` | Database maintenance, checkpoints, and bulk ingestion (19 primary tools plus `memory_search` helper access) | Primary home: `memory_stats`, `memory_list`, `memory_index_scan`, `memory_validate`, `memory_update`, `memory_delete`, `memory_bulk_delete`, `memory_health`, `checkpoint_create`, `checkpoint_restore`, `checkpoint_list`, `checkpoint_delete`, `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`; helper access: `memory_search` |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:62:| `/memory:save` | Save conversation context (4 tools, borrowed) | `memory_save`, `memory_index_scan`, `memory_stats`, `memory_update` |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:64:| `/spec_kit:resume` | Continue or recover prior work (primary chain uses 3 shared tools, with extra helpers behind the scenes) | `memory_context`, `memory_search`, `memory_list` plus `memory_stats`, `memory_match_triggers`, `memory_delete`, `memory_update`, and health, indexing, validation, checkpoint, and CocoIndex helpers in the wrapper |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:72:### Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:76:### Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:86:### Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:114:### Session recovery (/spec_kit:resume)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:116:When a session is interrupted by a crash, context compaction, timeout, or an ordinary cross-session handoff, this command figures out where you left off and helps you pick up again. It checks fresh handover state first, then the memory system for your most recent work, looks for crash-recovery breadcrumbs, and presents what it found. Think of it like reopening your laptop after it went to sleep and having your browser restore all the tabs you had open. Its primary recovery chain uses 3 borrowed tools: `memory_context`, `memory_search`, and `memory_list`, while the live wrapper also keeps `memory_stats`, `memory_match_triggers`, `memory_delete`, `memory_update`, and extra health, indexing, checkpoint, validation, and CocoIndex helpers available for resume workflows. Two modes are available: auto (resolves the best candidate with minimal prompting) and confirm (presents alternatives when it is not sure which session you want). After recovery, it keeps you inside the same resume workflow for structured work or points you to broader history when needed.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:972:After the system adds hints and adjusts a response, it recalculates the size count to match what is actually being sent. Without this step, the reported size could be wrong because it was measured before the final changes were made. It is like weighing a package after you have finished packing it, not before you add the last item. The same rule now applies when resume context is attached in `memory_context`: add the extra context first, then enforce the size limit.
.opencode/skill/system-spec-kit/scripts/README.md:50:- `memory/` - 8 TypeScript/JS CLIs (`generate-context.ts`, `rank-memories.ts`, `cleanup-orphaned-vectors.ts`, `validate-memory-quality.ts`, `reindex-embeddings.ts`, `ast-parser.ts`, `backfill-frontmatter.ts`, `rebuild-auto-entities.ts`)
.opencode/skill/system-spec-kit/scripts/README.md:107:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
.opencode/skill/system-spec-kit/scripts/README.md:115:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/10-fast-delegated-search-memory-quick-search.md:3:description: "Simplified search wrapper in the L2 Core layer that accepts query, optional limit, and optional spec folder, then delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, reranking ON, constitutional inclusion ON, limit 10)."
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/10-fast-delegated-search-memory-quick-search.md:10:Simplified search wrapper in the L2 Core layer that accepts query, optional limit, and optional spec folder, then delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, reranking ON, constitutional inclusion ON, limit 10).
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/10-fast-delegated-search-memory-quick-search.md:12:When you want fast search results without configuring the full 31-parameter surface of `memory_search`, use `memory_quick_search` instead. You provide a natural language query and optionally a result limit or spec folder scope. The tool fills in sensible defaults and hands off to the full search pipeline. The results are identical to what `memory_search` would return with those same settings — this is purely a convenience layer, not a separate search path.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/10-fast-delegated-search-memory-quick-search.md:28:The constructed `SearchArgs` are passed directly to `handleMemorySearch()`, the same handler used by `memory_search`. There is no separate search path — `memory_quick_search` is a thin delegation layer only.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/10-fast-delegated-search-memory-quick-search.md:41:| `mcp_server/handlers/memory-search.ts` | Handler | Search handler that executes the full pipeline (shared with `memory_search`) |
.opencode/skill/system-spec-kit/references/templates/template_style_guide.md:63:| `context_template.md` | Mustache syntax (`{{VARIABLE}}`) | Programmatic generation via generate-context.js |
.opencode/skill/system-spec-kit/references/templates/template_guide.md:600:Memory files in the `memory/` folder are NOT created from templates. They are auto-generated by the runtime save script: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`.
.opencode/skill/system-spec-kit/references/templates/template_guide.md:602:**Creation (JSON mode — preferred):** `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"###-name","sessionSummary":"..."}' specs/###-name/`
.opencode/skill/system-spec-kit/references/templates/template_guide.md:610:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/007-feature
.opencode/skill/system-spec-kit/references/templates/template_guide.md:621:- **NEVER create memory files manually** - always use `generate-context.js` via the runtime `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` entrypoint
.opencode/skill/system-spec-kit/references/templates/template_guide.md:626:**Note:** Never manually create memory files using Write/Edit tools. Always use the runtime `generate-context.js` script per AGENTS.md Memory Save Rule.
.opencode/skill/system-spec-kit/references/templates/template_guide.md:1188:- `memory/` - Context preservation folder (files auto-generated via `generate-context.js`)
.opencode/skill/system-spec-kit/references/templates/level_specifications.md:764:| `memory/` | Session context preservation | `generate-context.js` runtime script via `/memory:save` |
.opencode/skill/system-spec-kit/references/templates/level_specifications.md:769:- Use `/memory:save` or `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"...","sessionSummary":"..."}' specs/###-folder/`
.opencode/skill/system-spec-kit/references/templates/level_specifications.md:852:- `memory/` - Context preservation (auto-generated via generate-context.js)
.opencode/skill/system-spec-kit/scripts/utils/validation-utils.ts:80:    console.warn(`[generate-context] Anchor validation warnings in ${filename}:`);
.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:100:| `SPECKIT_MEMORY_ADAPTIVE_MODE` | `shadow` | enum (`shadow`, `promoted`) | `mcp_server/lib/cognitive/adaptive-ranking.ts` | Active only when adaptive ranking is enabled. `shadow` is the default observe-only mode that records signals and persists bounded proposal payloads without changing returned search order. `promoted` marks proposals and persisted runs as `promoted` for evaluation and rollout drills, while the current `memory_search` path still attaches proposal metadata instead of reordering live results. |
.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:105:| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | `handlers/memory-context.ts` | Enables context-pressure-based mode downgrading in `memory_context`. Above 0.60 token usage ratio, switches to focused mode. Above 0.80, switches to quick mode. Also subject to `SPECKIT_ROLLOUT_PERCENT`. |
.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:107:| `SPECKIT_PROGRESSIVE_DISCLOSURE_V1` | `true` | boolean | `lib/search/progressive-disclosure.ts` | **Default ON (graduated).** Progressive disclosure companion payload for search results. Preserves full `data.results` and adds `data.progressiveDisclosure` with summary layer (confidence distribution digest), snippet extraction (100-char previews), and cursor pagination. Continuation pages resolve through `memory_search({ cursor })`. |
.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:114:| `SPECKIT_RESPONSE_TRACE` | `false` | boolean | `handlers/memory-search.ts` | **IMPLEMENTED (Sprint 019).** P0-2: Include provenance data (scores, source, trace) in `memory_search` response envelopes. Opt-in via `includeTrace: true` parameter. The trace surface now also carries `sessionTransition` and bounded graph-walk diagnostics when those signals are active. Also propagates through `memory_context` when `includeTrace` is forwarded to internal search calls (CHK-040). When disabled, response format is unchanged (backward compatible). |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:2:title: "Semantic and lexical search (memory_search)"
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:6:# Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:26:When trace is enabled, result envelopes now expose richer bounded Markovian diagnostics without altering the non-trace contract: `trace.graphContribution` includes `raw`, `normalized`, `appliedBonus`, `capApplied`, and `rolloutState`, and requests forwarded from `memory_context` can also include `trace.sessionTransition`. Extended telemetry summarizes the same behavior through `transitionDiagnostics` and `graphWalkDiagnostics`.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:74:- Source feature title: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md:3:description: "Outsourced agent memory capture keeps external CLI save payloads aligned with the current `generate-context.js` contract. It enforces hard-fail validation for explicit JSON data files, persists `nextSteps` fields into memory observations, and now documents the post-010 save gates that can still reject a valid handback after normalization."
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md:10:Outsourced agent handback keeps external CLI save payloads aligned with the current `generate-context.js` contract. It enforces hard-fail validation for explicit JSON data files, persists `nextSteps` fields into memory observations, and now documents the post-010 save gates that can still reject a valid handback after normalization.
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:52:Usage: node generate-context.js [options] <input>
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:56:                    - JSON file mode: node generate-context.js data.json [spec-folder]
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:65:  node generate-context.js /tmp/context-data.json
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:66:  node generate-context.js /tmp/context-data.json specs/001-feature/
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:67:  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:68:  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:69:  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:540:      console.error('[generate-context] Failed to list spec folders:', errMsg);
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:543:  console.error('\nUsage: node generate-context.js [--stdin [spec-folder-name] | --json <json> [spec-folder-name] | <data-file> [spec-folder-name]]\n');
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:23:  console.error('  node generate-context.js /tmp/save-context-data.json <spec-folder-path>');
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:26:  console.error('  node generate-context.js --json \'{"specFolder":"specs/003-memory-and-spec-kit/054-remaining-bugs-remediation"}\' specs/003-memory-and-spec-kit/054-remaining-bugs-remedation');
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:40:    console.warn('[generate-context] Non-interactive mode: using default value');
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:72:    console.warn(`[generate-context] Non-interactive mode: using default choice 1`);
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md:2:title: "Trigger phrase matching (memory_match_triggers)"
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md:6:# Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md:69:- Source feature title: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:117:- `/spec_kit:resume` - continue or recover existing spec-folder work
.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:127:- `/memory:save` - preserve the current session context into spec memory
.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:182:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/007-feature/
.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:497:- Command: `/memory:save`
.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:502:**MANDATORY:** Use generate-context.js for memory save:
.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:504:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/###-folder/
.opencode/skill/system-spec-kit/references/workflows/execution_methods.md:77:### generate-context.js runtime entrypoint
.opencode/skill/system-spec-kit/references/workflows/execution_methods.md:84:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/context-data.json specs/001-feature/
.opencode/skill/system-spec-kit/references/workflows/execution_methods.md:87:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"001-feature","sessionSummary":"..."}' specs/001-feature/
.opencode/skill/system-spec-kit/references/workflows/execution_methods.md:90:echo '{"specFolder":"001-feature","sessionSummary":"..."}' | node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin
.opencode/skill/system-spec-kit/references/workflows/execution_methods.md:220:The `generate-context.js` script orchestrates a 12-step workflow via `workflow.ts`:
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:2:title: "Session recovery via /spec_kit:resume"
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:6:# Session recovery via /spec_kit:resume
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:10:When a session is interrupted by a crash, context compaction, timeout, or an ordinary handoff between sessions, `/spec_kit:resume` reconstructs the most likely previous state and routes the user to the best next step. Session recovery is no longer a standalone memory command. It now lives under the spec-folder resume workflow, where its primary recovery chain relies on shared memory tools while the wrapper also exposes broader helper access for resume workflows.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:16:**SHIPPED.** `/spec_kit:resume` owns both standard continuation and interrupted-session recovery. Its primary recovery chain uses 3 shared memory tools, while the live wrapper also allows `memory_stats`, `memory_match_triggers`, `memory_delete`, `memory_update`, plus health, indexing, validation, checkpoint, and CocoIndex helpers:
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:18:- **`memory_context`** (from `/memory:search`) -- Called in `resume` mode as the primary interrupted-session recovery path whenever no fresh `handover.md` already provides enough state. In `mcp_server/handlers/memory-context.ts`, resume mode is a dedicated `memory_search`-backed strategy with anchors `["state", "next-steps", "summary", "blockers"]`, default `limit=5`, a 1200-token budget, `minState=WARM`, `includeContent=true`, and both dedup and decay disabled. When auto-resume is enabled and the caller resumes a reusable working-memory session, `systemPromptContext` is injected before token-budget enforcement.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:19:- **`memory_search`** (from `/memory:search`) -- Fallback for thin summaries when `memory_context` resolves the right folder but does not return enough state detail. Uses the same resume anchors.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:22:`memory_stats` remains diagnostic/helper access on the wrapper rather than part of the primary recovery chain. Additional helper access includes `memory_match_triggers()` for early session detection, `memory_delete`, `memory_update`, health, indexing, checkpoint, validation, and CocoIndex support surfaces.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:34:| 2 | `memory_context(mode: "resume")` | Primary interrupted-session recovery path |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:36:| 4 | `memory_search()` with resume anchors | Fallback when the summary is thin |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:43:- Structured spec work: continue directly inside `/spec_kit:resume`
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:54:| `.opencode/command/spec_kit/resume.md` | `/spec_kit:resume` command: standard continuation plus interrupted-session recovery |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-spec-kit-resume.md:81:- Source feature title: Session recovery via /spec_kit:resume
.opencode/skill/system-spec-kit/references/workflows/worked_examples.md:254:User: /spec_kit:resume specs/009-notification-system/
.opencode/skill/system-spec-kit/references/workflows/worked_examples.md:311:| `/spec_kit:resume` | Continue from previous session |
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:2:title: "Unified context retrieval (memory_context)"
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:6:# Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:18:You send a query or prompt. The system figures out what you need. That is the core idea behind `memory_context`: an L1 orchestration layer that auto-detects your task intent and routes to the best retrieval strategy without you having to pick one.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:28:When `includeTrace` is enabled, `memory_context` also computes a trace-only `sessionTransition` payload and forwards it through the internal `memory_search` path. The contract is `trace.sessionTransition = { previousState, currentState, confidence, signalSources, reason? }`. Cold starts use `previousState: null`, the payload is omitted when trace is disabled, and this inference does not change retrieval routing beyond the existing mode-selection path.
.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:76:- Source feature title: Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/scripts/memory/README.md:38:- `generate-context.ts` - generate memory output from spec folder or JSON input with content-aware candidate selection
.opencode/skill/system-spec-kit/scripts/memory/README.md:59:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
.opencode/skill/system-spec-kit/scripts/memory/README.md:67:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"sessionSummary":"...","specFolder":"..."}' specs/NNN-name
.opencode/skill/system-spec-kit/references/workflows/rollback_runbook.md:72:- `memory_search` response metadata shows no applied session/causal boosts
.opencode/skill/system-spec-kit/references/workflows/rollback_runbook.md:73:- `memory_context` response metadata shows no pressure-mode override
.opencode/skill/system-spec-kit/scripts/scripts-registry.json:8:      "name": "generate-context",
.opencode/skill/system-spec-kit/scripts/scripts-registry.json:9:      "path": "scripts/dist/memory/generate-context.js",
.opencode/skill/system-spec-kit/scripts/scripts-registry.json:12:      "trigger": ["save context", "save memory", "/memory:save"],
.opencode/skill/system-spec-kit/scripts/scripts-registry.json:458:      "memory": ["generate-context", "cleanup-orphaned-vectors", "test-embeddings-factory"],
.opencode/skill/system-spec-kit/scripts/types/session-types.ts:177:  // (AI-composed JSON data from generate-context.js input)
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:54:| Vector search empty | No results from `memory_search()` | Run `memory_stats()` to check index health |
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:66:memory_search({ query: "auth", specFolder: "122" })
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:72:memory_search({ query: "auth", specFolder: "122-skill-standardization" })
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:78:call_tool_chain(`spec_kit_memory.memory_search({ query: "test" })`)
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:84:memory_search({ query: "test" })
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:108:| `Invalid tool name` | Wrong call syntax | Use native MCP syntax: `memory_search()`, `memory_list()`, etc. |
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:123:| **Anchor not found** | `Anchor not found: X` | Use `memory_search()` to find available anchors |
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:149:**1. Long-term memory decay (FSRS day-based):** Used by `memory_search()` for ranking stored memories. Uses FSRS v4 spaced-repetition algorithm based on elapsed calendar days since last review.
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:159:**2. Trigger matching decay (turn-based):** Used by `memory_match_triggers()` within a single conversation session. Applies per-turn attention decay so earlier matches lose weight as the conversation progresses.
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:170:**Important:** Long-term decay uses calendar days (FSRS). Trigger matching uses conversation turns. The `useDecay` parameter in `memory_search()` controls the FSRS day-based decay.
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:215:# Use: memory_search({ query: "test", limit: 3 })
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:241:memory_search({ query: "recent work", limit: 5 })
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:260:memory_search({ query: "test" })  // Should return results
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:315:memory_search({ 
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:341:const results = await memory_search({ specFolder: "###-correct-folder", limit: 3 })
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:348:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:411:| **Context Loss** | Agent doesn't remember prior work | Run `/spec_kit:resume [spec-folder]` |
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:413:| **Memory Not Found** | Search returns no results | Check `memory_search({ specFolder: "..." })` |
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:425:// Command: /spec_kit:resume specs/###-feature-name
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:427:memory_search({
.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:471:**Symptom:** `memory_match_triggers()` returns no results even for relevant queries.
.opencode/skill/system-spec-kit/scripts/ops/heal-session-ambiguity.sh:5:#            the memory-save pipeline (generate-context.js).
.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:1249:      console.error('\nUsage: node generate-context.js [spec-folder-name] OR node generate-context.js <data-file> [spec-folder]\n');
.opencode/skill/system-spec-kit/references/config/environment_variables.md:108:| `DEBUG` | `false` | Enable debug logging in generate-context.ts |
.opencode/skill/system-spec-kit/references/config/environment_variables.md:133:node scripts/dist/memory/generate-context.js --json '{"specFolder":"001-feature","sessionSummary":"..."}' specs/001-feature/
.opencode/skill/system-spec-kit/references/config/environment_variables.md:136:DEBUG=1 echo '{"specFolder":"001-feature","sessionSummary":"..."}' | node scripts/dist/memory/generate-context.js --stdin
.opencode/skill/system-spec-kit/references/config/environment_variables.md:276:| `SPECKIT_AUTO_RESUME` | ON | S7 | Auto-resume session detection in `memory_context()` |
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:199:node scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-feature-name>/
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:201:node scripts/dist/memory/generate-context.js /tmp/save-context-data.json .opencode/specs/<###-feature-name>/
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:213:node scripts/dist/memory/generate-context.js /tmp/context.json specs/<###-feature-name>/
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:216:node scripts/dist/memory/generate-context.js 003-parent/001-child
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:219:node scripts/dist/memory/generate-context.js .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-code-audit-per-feature-catalog/021-remediation-revalidation
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:260:# Test with actual generate-context script (which uses these utilities)
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:261:node scripts/dist/memory/generate-context.js --help
.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:276:| [scripts/memory/generate-context.ts](../memory/generate-context.ts)                        | Main memory save script that uses these utilities |
.opencode/skill/system-spec-kit/references/config/hook_system.md:55:1. `memory_match_triggers(prompt)` — Fast turn-start context
.opencode/skill/system-spec-kit/references/config/hook_system.md:56:2. `memory_context({ mode: "resume", profile: "resume" })` — Continuation and compaction recovery core
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/01-evaluation-database-and-schema.md:20:Logging hooks in the search, context and trigger handlers are best-effort and fail-safe: they run only when `SPECKIT_EVAL_LOGGING=true`, and all write paths are wrapped in non-fatal `try/catch` blocks so query responses continue even if eval logging fails. `memory_search` and `memory_context` emit per-channel rows. `memory_match_triggers` emits query/final-result rows.
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/19-post-save-quality-review.md:81:| `scripts/memory/generate-context.ts` | Script | CLI entrypoint; delegates save workflow to `workflow.ts` |
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:18:1. **Command Trigger** - `/memory:save` command for explicit saves
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:29:| `/memory:save` Command | Primary save trigger | Immediate |
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:84:The `memory_match_triggers` MCP tool provides fast trigger phrase matching without requiring embeddings:
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:88:const result = await spec_kit_memory_memory_match_triggers({
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:119:1. AI calls `memory_match_triggers({ prompt: "user message" })`
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:127:const matches = await memory_match_triggers({
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:158:These signals are detected during `memory_match_triggers()` processing and influence save-time arbitration (prediction-error scoring) and correction tracking.
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:174:- `memory_match_triggers()` now applies a relevance threshold before returning matches, reducing noise from weak partial matches
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:187:/memory:save
.opencode/skill/system-spec-kit/references/memory/trigger_config.md:394:- [generate-context.ts](../../scripts/memory/generate-context.ts) - Context generation script
.opencode/skill/system-spec-kit/references/memory/memory_system.md:26:| Scripts | runtime `scripts/dist/memory/generate-context.js` (source: `scripts/memory/generate-context.ts`) | Memory file generation with ANCHOR format |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:48:- **Memory Files** — Session-specific context generated via `generate-context.js`. Subject to temporal decay.
.opencode/skill/system-spec-kit/references/memory/memory_system.md:97:> **Note:** MCP tool names use plain names such as `memory_search`, `memory_save`, and `shared_memory_enable`.
.opencode/skill/system-spec-kit/references/memory/memory_system.md:103:| L1: Orchestration | `memory_context()` | Unified entry point with intent-aware routing (7 intents) | START HERE for most memory operations |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:106:| L2: Core | `memory_search()` | Semantic search with vector similarity | Find prior decisions on auth |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:108:| L2: Core | `memory_match_triggers()` | Fast keyword matching (<50ms) with cognitive features | Gate enforcement |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:109:| L2: Core | `memory_save()` | Index a memory file. Re-generates embedding when **content hash** changes. Title-only changes do not trigger re-embedding. | After generate-context.js |
.opencode/skill/system-spec-kit/references/memory/memory_system.md:165:> **IMPORTANT:** You MUST provide either `query` OR `concepts` parameter. Calling `memory_search({ specFolder: "..." })` without a search parameter will cause an E040 error.
.opencode/skill/system-spec-kit/references/memory/memory_system.md:233:memory_search({ query: "authentication decisions" })
.opencode/skill/system-spec-kit/references/memory/memory_system.md:236:memory_search({
.opencode/skill/system-spec-kit/references/memory/memory_system.md:243:memory_search({
.opencode/skill/system-spec-kit/references/memory/memory_system.md:249:memory_search({
.opencode/skill/system-spec-kit/references/memory/memory_system.md:255:// memory_search({ specFolder: "007-auth" })  // ERROR: E040
.opencode/skill/system-spec-kit/references/memory/memory_system.md:284:memory_search({
.opencode/skill/system-spec-kit/references/memory/memory_system.md:290:memory_search({
.opencode/skill/system-spec-kit/references/memory/memory_system.md:297:memory_search({
.opencode/skill/system-spec-kit/references/memory/memory_system.md:303:memory_search({
.opencode/skill/system-spec-kit/references/memory/memory_system.md:359:- `memory_search`: Exact match (SQL `=` operator)
.opencode/skill/system-spec-kit/references/memory/memory_system.md:426:memory_search({ 
.opencode/skill/system-spec-kit/references/memory/memory_system.md:688:- `scripts/dist/memory/generate-context.js` - Runtime memory-save entrypoint (compiled from `scripts/memory/generate-context.ts`)
.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/08-agent-consumption-instrumentation.md:18:Instrumentation wiring is present in the retrieval handlers (`memory_search`, `memory_context`, `memory_match_triggers`), and the runtime logger is active through `isConsumptionLogEnabled()`, which delegates to `isFeatureEnabled('SPECKIT_CONSUMPTION_LOG')`.
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:21:Direct phase-folder targets are supported. If the explicit CLI target resolves to a policy-defined phase folder, `generate-context.js` preserves that target and writes memory files into the selected phase folder's `memory/` directory.
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:63:│                    │ generate-context│                         │
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:142:/memory:save       # Save current conversation context
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:150:3. AI agent creates structured JSON summary (any agent can invoke generate-context.js for memory — this is an exception to the @speckit exclusivity rule)
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:151:4. AI agent calls `generate-context.js` with JSON data
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:212:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:217:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:223:  node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:245:| Script exists      | `test -f .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` | Check skill installation |
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:367:For retrieval, `memory_context()` routes queries across 7 intents (including `find_spec` and `find_decision`) and applies intent-aware weighting.
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:562:After `generate-context.js` completes, it emits a **POST-SAVE QUALITY REVIEW** block. This review checks the saved memory file for common issues that degrade retrieval quality.
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:628:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --help
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:12:| 1 | Community Summaries | SPECKIT_COMMUNITY_SUMMARIES | community-detection.vitest.ts | memory_search with global mode |
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:16:| 5 | Dual-Level Retrieval | SPECKIT_DUAL_RETRIEVAL | community-search.vitest.ts | memory_search with retrievalLevel: global |
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:29:1. Run `memory_search({ query: 'semantic search', retrievalLevel: 'global' })`
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:37:1. Run `memory_search({ query: 'Semantic Search', includeTrace: true })`
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:58:1. `memory_search({ query: 'search pipeline', retrievalLevel: 'local' })` - entity results only
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:59:2. `memory_search({ query: 'search pipeline', retrievalLevel: 'global' })` - community results
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:60:3. `memory_search({ query: 'search pipeline', retrievalLevel: 'auto' })` - local with fallback
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:71:1. Run `memory_search` with `includeTrace: true`
.opencode/skill/system-spec-kit/feature_catalog/testing-playbook/009-graph-retrieval-improvements.md:105:- `memory_match_triggers()` is unaffected by new code
.opencode/skill/system-spec-kit/scripts/dist/loaders/data-loader.js:29:            'write session data to /tmp/save-context-data.json, then run: node generate-context.js /tmp/save-context-data.json [spec-folder]');
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md:33:The `memory_context` orchestration layer checks descriptions before issuing
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/18-session-enrichment-and-alignment-guards.md:18:Captured-session `generate-context.js` saves now enrich thin OpenCode-derived session data with spec-folder and git context before rendering, while keeping contamination defenses in place.
.opencode/skill/system-spec-kit/scripts/core/README.md:26:The `core/` directory contains orchestration modules used by `dist/memory/generate-context.js`.
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1018:        '  - If using generate-context.js, ensure extractors/collect-session-data.js exports collectSessionData'
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/16-mcp-auto-priming.md:12:The memory-surface hook tracks session priming state. On the first tool call of any session, it assembles a PrimePackage with constitutional memories, code graph status snapshot, and any triggered memories from the current prompt. This package is injected into the MCP response hints, giving the AI runtime immediate context without requiring an explicit memory_context call. Subsequent tool calls skip priming (one-shot behavior). Priming status is exposed via session_health. Priming is now session-scoped via a Set<string> of primed session IDs rather than a process-global boolean, correctly handling multiple concurrent sessions.
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.d.ts:23://# sourceMappingURL=generate-context.d.ts.map
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md:12:The session_resume handler performs three sub-calls: (1) `memory_context` with `mode=resume` and `profile=resume` to recover session state, (2) code graph database query for node/edge/file counts and last scan timestamp, and (3) CocoIndex binary availability check via filesystem probe. It also appends the shared structural ready/stale/missing contract from `session-snapshot.ts`, so callers can tell when a deeper refresh is needed. Results are merged into a `SessionResumeResult` with `memory`, `codeGraph`, `cocoIndex`, optional `structuralContext`, and `hints` fields. Failures in any sub-call are captured as error entries with recovery hints rather than failing the entire call. For the canonical first-call recovery step, use `session_bootstrap`; `session_resume` remains the detailed merged surface.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/20-ops-self-healing-runbooks.md:37:The other two advertised classes are only partially live today. `heal-session-ambiguity.sh` now exits immediately with a deprecation notice saying session ambiguity moved into the memory-save pipeline via `generate-context.js`. Its older deterministic implementation is still retained below the early exit for reference, but it is not reachable in normal execution. `heal-telemetry-drift.sh` still parses options and applies the shared retry contract, but the current main flow exits with an error saying the telemetry drift runner was removed and a supported schema-doc parity workflow must be wired back in before use.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:3:description: "Structured JSON summary support for generate-context.js, including toolCalls/exchanges fields, file-backed JSON authority, and Wave 2 hardening for decision confidence, truncated titles, git_changed_file_count stability, and template count preservation."
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:29:1. `generate-context.js --json '<data>'` and `generate-context.js --stdin` accept structured JSON with fields like `toolCalls`, `exchanges`, `sessionSummary`, and the documented snake_case contract (`user_prompts`, `recent_context`, `trigger_phrases`).
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:148:| `scripts/memory/generate-context.ts` | CLI help text and structured-first save workflow documentation |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:156:| `scripts/tests/generate-context-cli-authority.vitest.ts` | Structured-input precedence for `--stdin` and `--json` |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:174:- `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/generate-context-cli-authority.vitest.ts tests/input-normalizer-unit.vitest.ts tests/post-save-review.vitest.ts tests/project-phase-e2e.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/task-enrichment.vitest.ts tests/template-mustache-sections.vitest.ts tests/trigger-phrase-filter.vitest.ts tests/validation-v13-v14-v12.vitest.ts tests/workflow-e2e.vitest.ts`
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/14-query-intent-classifier.md:12:Keyword-dictionary scoring classifies queries into three intents: structural (symbol/relationship queries routed to code graph), semantic (conceptual/discovery queries routed to CocoIndex), and hybrid (mixed queries that merge results from both). Confidence scores and matched keywords are returned alongside the intent classification. Integrated into memory_context handler for automatic query-intent routing.
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js.map:1:{"version":3,"file":"generate-context.js","sourceRoot":"","sources":["../../memory/generate-context.ts"],"names":[],"mappings":";AAAA,kEAAkE;AAClE,2BAA2B;AAC3B,kEAAkE;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;AAylBhE,oBAAI;AACJ,oCAAY;AACZ,wCAAc;AACd,8CAAiB;AACjB,8CAAiB;AACjB,4DAAwB;AA5lB1B,kEAAkE;AAClE,sBAAsB;AACtB,kEAAkE;AAClE,2FAA2F;AAE3F,cAAc;AACd,2CAA6B;AAC7B,2CAA6B;AAE7B,mBAAmB;AACnB,wEAAwE;AACxE,kCAQiB;AACjB,+CAAsE;AACtE,wCAA+C;AAC/C,6EAAwE;AAqBxE,kEAAkE;AAClE,eAAe;AACf,kEAAkE;AAClE,MAAM,SAAS,GAAG;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;CA0EjB,CAAC;AAEF,IAAI,OAAO,CAAC,IAAI,CAAC,QAAQ,CAAC,QAAQ,CAAC,IAAI,OAAO,CAAC,IAAI,CAAC,QAAQ,CAAC,IAAI,CAAC,EAAE,CAAC;IACnE,OAAO,CAAC,GAAG,CAAC,SAAS,CAAC,CAAC;IACvB,OAAO,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;AAClB,CAAC;AAED,sBAAsB;AACtB,IAAI,uBAAuB,GAAG,KAAK,CAAC;AACpC,IAAI,YAAY,GAAG,KAAK,CAAC;AAEzB,6DAA6D;AAC7D,SAAS,oBAAoB,CAAC,MAAc;IAC1C,IAAI,YAAY;QAAE,OAAO,CAAC,8BAA8B;IACxD,YAAY,GAAG,IAAI,CAAC;IAEpB,IAAI,iBAAiB,GAAG,KAAK,CAAC;IAC9B,IAAI,CAAC;QACH,IAAA,gCAAqB,GAAE,CAAC;IAC1B,CAAC;IAAC,OAAO,IAAa,EAAE,CAAC;QACvB,iBAAiB,GAAG,IAAI,CAAC;IAC3B,CAAC;IAED,OAAO,CAAC,KAAK,CAAC,uBAAuB,MAAM,sCAAsC,CAAC,CAAC;IACnF,OAAO,CAAC,IAAI,CAAC,iBAAiB,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC;AAC1C,CAAC;AAED,SAAS,qBAAqB;IAC5B,IAAI,uBAAuB,EAAE,CAAC;QAC5B,OAAO;IACT,CAAC;IAED,OAAO,CAAC,EAAE,CAAC,SAAS,EAAE,GAAG,EAAE,CAAC,oBAAoB,CAAC,SAAS,CAAC,CAAC,CAAC;IAC7D,OAAO,CAAC,EAAE,CAAC,QAAQ,EAAE,GAAG,EAAE,CAAC,oBAAoB,CAAC,QAAQ,CAAC,CAAC,CAAC;IAE3D,uBAAuB,GAAG,IAAI,CAAC;AACjC,CAAC;AAED,kEAAkE;AAClE,4BAA4B;AAC5B,kEAAkE;AAClE,SAAS,wBAAwB,CAAC,eAAuB;IACvD,OAAO,IAAA,gCAAgB,EAAC,IAAI,CAAC,OAAO,CAAC,aAAM,CAAC,YAAY,EAAE,eAAe,CAAC,EAAE,IAAA,0BAAmB,GAAE,CAAC,KAAK,IAAI,CAAC;AAC9G,CAAC;AAED,SAAS,iBAAiB,CAAC,UAAkB;IAC3C,MAAM,UAAU,GAAG,IAAI,CAAC,QAAQ,CAAC,UAAU,CAAC,CAAC;IAE7C,kHAAkH;IAClH,MAAM,eAAe,GAAG,UAAU,CAAC,OAAO,CAAC,KAAK,EAAE,GAAG,CAAC,CAAC,OAAO,CAAC,MAAM,EAAE,EAAE,CAAC,CAAC;IAC3E,4DAA4D;IAC5D,MAAM,gBAAgB,GAAG,eAAe,CAAC,KAAK,CAAC,GAAG,CAAC,CAAC;IACpD,oEAAoE;IACpE,IAAI,gBAAgB,CAAC,MAAM,IAAI,CAAC,EAAE,CAAC;QACjC,MAAM,OAAO,GAAG,gBAAgB,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC;QAC3C,IAAI,0BAAmB,CAAC,IAAI,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,IAAI,0BAAmB,CAAC,IAAI,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC;YACjF,uEAAuE;YACvE,MAAM,cAAc,GAAG,wBAAwB,CAAC,eAAe,CAAC,CAAC;YAEjE,IAAI,CAAC,cAAc,EAAE,CAAC;gBACpB,qFAAqF;gBACrF,KAAK,MAAM,QAAQ,IAAI,IAAA,0BAAmB,GAAE,EAAE,CAAC;oBAC7C,MAAM,SAAS,GAAG,IAAI,CAAC,IAAI,CAAC,QAAQ,EAAE,eAAe,CAAC,CAAC;oBACvD,IACE,CAAC,IAAI,CAAC,UAAU,CAAC,eAAe,CAAC;wBACjC,MAAM,CAAC,UAAU,CAAC,SAAS,CAAC;wBAC5B,IAAA,gCAAgB,EAAC,SAAS,EAAE,IAAA,0BAAmB,GAAE,CAAC,KAAK,IAAI,EAC3D,CAAC;wBACD,OAAO,EAAE,KAAK,EAAE,IAAI,EAAE,CAAC;oBACzB,CAAC;gBACH,CAAC;gBACD,OAAO;oBACL,KAAK,EAAE,KAAK;oBACZ,MAAM,EAAE,yDAAyD,UAAU,EAAE;iBAC9E,CAAC;YACJ,CAAC;YACD,OAAO,EAAE,KAAK,EAAE,IAAI,EAAE,CAAC;QACzB,CAAC;IACH,CAAC;IAED,IAAI,CAAC,0BAAmB,CAAC,IAAI,CAAC,UAAU,CAAC,EAAE,CAAC;QAC1C,IAAI,SAAS,CAAC,IAAI,CAAC,UAAU,CAAC,EAAE,CAAC;YAC/B,IAAI,OAAO,CAAC,IAAI,CAAC,UAAU,CAAC,EAAE,CAAC;gBAC7B,OAAO,EAAE,KAAK,EAAE,KAAK,EAAE,MAAM,EAAE,sCAAsC,EAAE,CAAC;YAC1E,CAAC;YACD,IAAI,GAAG,CAAC,IAAI,CAAC,UAAU,CAAC,EAAE,CAAC;gBACzB,OAAO,EAAE,KAAK,EAAE,KAAK,EAAE,MAAM,EAAE,sDAAsD,EAAE,CAAC;YAC1F,CAAC;YACD,IAAI,CAAC,QAAQ,CAAC,IAAI,CAAC,UAAU,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,EAAE,CAAC;gBACxC,OAAO,EAAE,KAAK,EAAE,KAAK,EAAE,MAAM,EAAE,mEAAmE,EAAE,CAAC;YACvG,CAAC;QACH,CAAC;QACD,OAAO,EAAE,KAAK,EAAE,KAAK,EAAE,MAAM,EAAE,wDAAwD,EAAE,CAAC;IAC5F,CAAC;IAED,MAAM,cAAc,GAAG,wBAAwB,CAAC,eAAe,CAAC,CAAC;IAEjE,IAAI,CAAC,cAAc,EAAE,CAAC;QACpB,0EAA0E;QAC1E,yFAAyF;QACzF,OAAO;YACL,KAAK,EAAE,KAAK;YACZ,MAAM,EAAE,yDAAyD,UAAU,EAAE;SAC9E,CAAC;IACJ,CAAC;IAED,OAAO,EAAE,KAAK,EAAE,IAAI,EAAE,CAAC;AACzB,CAAC;AAED,SAAS,6BAA6B,CAAC,MAAc;IACnD,MAAM,UAAU,GAAG,IAAI,CAAC,QAAQ,CAAC,MAAM,CAAC,CAAC;IACzC,MAAM,yBAAyB,GAAG,CAAC,MAAM,CAAC,QAAQ,CAAC,OAAO,CAAC,IAAI,CAC7D,MAAM,CAAC,UAAU,CAAC,QAAQ,CAAC;QAC3B,MAAM,CAAC,UAAU,CAAC,kBAAkB,CAAC,CACtC;QACC,CAAC,CAAC,IAAI,CAAC,IAAI,CAAC,aAAM,CAAC,YAAY,EAAE,MAAM,CAAC;QACxC,CAAC,CAAC,IAAI,CAAC;IAET,IAAI,kBAAkB,GAAkB,IAAI,CAAC;IAC7C,IAAI,CAAC,MAAM,CAAC,QAAQ,CAAC,OAAO,CAAC,EAAE,CAAC;QAC9B,IAAI,IAAI,CAAC,UAAU,CAAC,MAAM,CAAC,EAAE,CAAC;YAC5B,MAAM,gBAAgB,GAAG,MAAM,CAAC,OAAO,CAAC,MAAM,EAAE,EAAE,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,CAAC,MAAM,CAAC,OAAO,CAAC,CAAC;YACnF,MAAM,WAAW,GAAG,gBAAgB,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,CAAC;YAC5C,MAAM,aAAa,GAAG,gBAAgB,CAAC,EAAE,CAAC,CAAC,CAAC,CAAC,CAAC;YAE9C,IACE,CAAC,WAAW,IAAI,0BAAmB,CAAC,IAAI,CAAC,WAAW,CAAC,CAAC;gBACtD,CAAC,aAAa,IAAI,WAAW,IAAI,0BAAmB,CAAC,IAAI,CAAC,aAAa,CAAC,IAAI,0BAAmB,CAAC,IAAI,CAAC,WAAW,CAAC,CAAC,EAClH,CAAC;gBACD,kBAAkB,GAAG,MAAM,CAAC;YAC9B,CAAC;QACH,CAAC;QAED,IAAI,OAAO,GAAG,MAAM,CAAC;QACrB,IAAI,OAAO,CAAC,UAAU,CAAC,kBAAkB,CAAC,EAAE,CAAC;YAC3C,OAAO,GAAG,OAAO,CAAC,KAAK,CAAC,kBAAkB,CAAC,MAAM,CAAC,CAAC;QACrD,CAAC;aAAM,IAAI,OAAO,CAAC,UAAU,CAAC,QAAQ,CAAC,EAAE,CAAC;YACxC,OAAO,GAAG,OAAO,CAAC,KAAK,CAAC,QAAQ,CAAC,MAAM,CAAC,CAAC;QAC3C,CAAC;QACD,OAAO,GAAG,OAAO,CAAC,OAAO,CAAC,MAAM,EAAE,EAAE,CAAC,CAAC;QAEtC,IAAI,CAAC,kBAAkB,IAAI,yBAAyB,IAAI,MAAM,CAAC,UAAU,CAAC,yBAAyB,CAAC,EAAE,CAAC;YACrG,kBAAkB,GAAG,yBAAyB,CAAC;QACjD,CAAC;QAED,MAAM,QAAQ,GAAG,OAAO,CAAC,KAAK,CAAC,GAAG,CAAC,CAAC;QACpC,IAAI,CAAC,kBAAkB,IAAI,QAAQ,CAAC,MAAM,IAAI,CAAC,EAAE,CAAC;YAChD,KAAK,MAAM,QAAQ,IAAI,IAAA,0BAAmB,GAAE,EAAE,CAAC;gBAC7C,MAAM,SAAS,GAAG,IAAI,CAAC,IAAI,CAAC,QAAQ,EAAE,GAAG,QAAQ,CAAC,CAAC;gBACnD,IAAI,MAAM,CAAC,UAAU,CAAC,SAAS,CAAC,EAAE,CAAC;oBACjC,kBAAkB,GAAG,SAAS,CAAC;oBAC/B,MAAM;gBACR,CAAC;YACH,CAAC;YACD,IAAI,CAAC,kBAAkB,IAAI,0BAAmB,CAAC,IAAI,CAAC,QAAQ,CAAC,QAAQ,CAAC,MAAM,GAAG,CAAC,CAAC,CAAC,EAAE,CAAC;gBACnF,MAAM,SAAS,GAAG,IAAA,yBAAkB,GAAE,CAAC;gBACvC,IAAI,SAAS,EAAE,CAAC;oBACd,kBAAkB,GAAG,IAAI,CAAC,IAAI,CAAC,SAAS,EAAE,GAAG,QAAQ,CAAC,CAAC;gBACzD,CAAC;YACH,CAAC;QACH,CAAC;IACH,CAAC;IAED,IAAI,kBAAkB,EAAE,CAAC;QACvB,OAAO,kBAAkB,CAAC;IAC5B,CAAC;IAED,MAAM,gBAAgB,GAAG,CACvB,MAAM,CAAC,UAAU,CAAC,QAAQ,CAAC;QAC3B,MAAM,CAAC,UAAU,CAAC,kBAAkB,CAAC;QACrC,gCAAyB,CAAC,IAAI,CAAC,UAAU,CAAC,CAC3C,IAAI,CAAC,MAAM,CAAC,QAAQ,CAAC,OAAO,CAAC,CAAC;IAE/B,OAAO,gBAAgB,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,IAAI,CAAC;AAC1C,CAAC;AAED,SAAS,wBAAwB,CAAC,IAA6B;IAC7D,KAAK,MAAM,GAAG,IAAI,CAAC,YAAY,EAAE,aAAa,EAAE,aAAa,CAAC,EAAE,CAAC;QAC/D,MAAM,KAAK,GAAG,IAAI,CAAC,GAAG,CAAC,CAAC;QACxB,IAAI,OAAO,KAAK,KAAK,QAAQ,IAAI,KAAK,CAAC,IAAI,EAAE,CAAC,MAAM,GAAG,CAAC,EAAE,CAAC;YACzD,OAAO,KAAK,CAAC,IAAI,EAAE,CAAC;QACtB,CAAC;IACH,CAAC;IAED,OAAO,IAAI,CAAC;AACd,CAAC;AAED,KAAK,UAAU,YAAY,CAAC,QAA2B,OAAO,CAAC,KAAK;IAClE,OAAO,MAAM,IAAI,OAAO,CAAS,CAAC,OAAO,EAAE,MAAM,EAAE,EAAE;QACnD,IAAI,MAAM,GAAG,EAAE,CAAC;QAChB,KAAK,CAAC,WAAW,CAAC,MAAM,CAAC,CAAC;QAC1B,KAAK,CAAC,EAAE,CAAC,MAAM,EAAE,CAAC,KAAa,EAAE,EAAE;YACjC,MAAM,IAAI,KAAK,CAAC;QAClB,CAAC,CAAC,CAAC;QACH,KAAK,CAAC,EAAE,CAAC,KAAK,EAAE,GAAG,EAAE,CAAC,OAAO,CAAC,MAAM,CAAC,CAAC,CAAC;QACvC,KAAK,CAAC,EAAE,CAAC,OAAO,EAAE,MAAM,CAAC,CAAC;IAC5B,CAAC,CAAC,CAAC;AACL,CAAC;AAED,SAAS,mBAAmB,CAAC,OAAe,EAAE,WAAiC;IAC7E,IAAI,OAAO,CAAC,IAAI,EAAE,CAAC,MAAM,KAAK,CAAC,EAAE,CAAC;QAChC,MAAM,IAAI,KAAK,CAAC,GAAG,WAAW,mCAAmC,CAAC,CAAC;IACrE,CAAC;IAED,IAAI,MAAe,CAAC;IACpB,IAAI,CAAC;QACH,MAAM,GAAG,IAAI,CAAC,KAAK,CAAC,OAAO,CAAC,CAAC;IAC/B,CAAC;IAAC,OAAO,KAAc,EAAE,CAAC;QACxB,MAAM,MAAM,GAAG,KAAK,YAAY,KAAK,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC;QACtE,MAAM,IAAI,KAAK,CAAC,6BAA6B,WAAW,KAAK,MAAM,EAAE,CAAC,CAAC;IACzE,CAAC;IAED,IAAI,OAAO,MAAM,KAAK,QAAQ,IAAI,MAAM,KAAK,IAAI,IAAI,KAAK,CAAC,OAAO,CAAC,MAAM,CAAC,EAAE,CAAC;QAC3E,MAAM,IAAI,KAAK,CAAC,GAAG,WAAW,iCAAiC,CAAC,CAAC;IACnE,CAAC;IAED,OAAO,MAAiC,CAAC;AAC3C,CAAC;AAED,KAAK,UAAU,4BAA4B,CACzC,IAA0B,EAC1B,IAAc,EACd,WAA2D;IAE3D,IAAI,IAAI,KAAK,SAAS,IAAI,OAAO,CAAC,KAAK,CAAC,KAAK,EAAE,CAAC;QAC9C,OAAO,CAAC,KAAK,CAAC,8BAA8B,CAAC,CAAC;QAC9C,OAAO,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;IAClB,CAAC;IAED,MAAM,OAAO,GAAG,IAAI,KAAK,SAAS;QAChC,CAAC,CAAC,MAAM,WAAW,EAAE;QACrB,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;IAEZ,IAAI,IAAI,KAAK,QAAQ,IAAI,OAAO,KAAK,SAAS,EAAE,CAAC;QAC/C,MAAM,IAAI,KAAK,CAAC,gDAAgD,CAAC,CAAC;IACpE,CAAC;IAED,wDAAwD;IACxD,IAAI,IAAI,KAAK,QAAQ,IAAI,CAAC,OAAO,KAAK,SAAS,IAAI,OAAO,CAAC,IAAI,EAAE,CAAC,MAAM,KAAK,CAAC,CAAC,EAAE,CAAC;QAChF,OAAO,CAAC,GAAG,CAAC,IAAI,CAAC,SAAS,CAAC,EAAE,KAAK,EAAE,kBAAkB,EAAE,OAAO,EAAE,oBAAoB,EAAE,CAAC,CAAC,CAAC;QAC1F,OAAO,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;IAClB,CAAC;IAED,MAAM,OAAO,GAAG,mBAAmB,CAAC,OAAO,IAAI,EAAE,EAAE,IAAI,CAAC,CAAC;IACzD,MAAM,qBAAqB,GAAG,IAAI,CAAC,IAAI,KAAK,SAAS,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC;IAC/D,MAAM,cAAc,GAAG,qBAAqB,CAAC,CAAC,CAAC,6BAA6B,CAAC,qBAAqB,CAAC,IAAI,qBAAqB,CAAC,CAAC,CAAC,IAAI,CAAC;IACpI,MAAM,gBAAgB,GAAG,wBAAwB,CAAC,OAAO,CAAC,CAAC;IAC3D,MAAM,aAAa,GAAG,gBAAgB,CAAC,CAAC,CAAC,CAAC,6BAA6B,CAAC,gBAAgB,CAAC,IAAI,gBAAgB,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC;IACtH,MAAM,aAAa,GAAG,cAAc,IAAI,aAAa,CAAC;IAEtD,IAAI,CAAC,aAAa,EAAE,CAAC;QACnB,MAAM,IAAI,KAAK,CAAC,GAAG,IAAI,mFAAmF,CAAC,CAAC;IAC9G,CAAC;IAED,OAAO;QACL,QAAQ,EAAE,IAAI;QACd,aAAa;QACb,aAAa,EAAE;YACb,GAAG,OAAO;YACV,OAAO,EAAE,MAAM;SAChB;QACD,SAAS,EAAE,IAAI;KAChB,CAAC;AACJ,CAAC;AAED,kEAAkE;AAClE,0BAA0B;AAC1B,kEAAkE;AAClE,KAAK,UAAU,cAAc,CAC3B,OAAiB,OAAO,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC,CAAC,EACtC,cAA8D,YAAY;IAE1E,kEAAkE;IAClE,IAAI,SAAS,GAAkB,IAAI,CAAC;IACpC,MAAM,YAAY,GAAa,EAAE,CAAC;IAClC,KAAK,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,IAAI,CAAC,MAAM,EAAE,CAAC,EAAE,EAAE,CAAC;QACrC,IAAI,IAAI,CAAC,CAAC,CAAC,KAAK,cAAc,EAAE,CAAC;YAC/B,MAAM,SAAS,GAAG,IAAI,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC;YAC9B,IAAI,CAAC,SAAS,IAAI,SAAS,CAAC,UAAU,CAAC,IAAI,CAAC,IAAI,SAAS,CAAC,IAAI,EAAE,CAAC,MAAM,KAAK,CAAC,EAAE,CAAC;gBAC9E,MAAM,IAAI,KAAK,CAAC,yCAAyC,CAAC,CAAC;YAC7D,CAAC;YACD,SAAS,GAAG,SAAS,CAAC,IAAI,EAAE,CAAC;YAC7B,CAAC,EAAE,CAAC,CAAC,iBAAiB;YACtB,SAAS;QACX,CAAC;QACD,YAAY,CAAC,IAAI,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC;IAC7B,CAAC;IAED,MAAM,CAAC,UAAU,EAAE,YAAY,CAAC,GAAG,YAAY,CAAC;IAChD,IAAI,CAAC,UAAU,EAAE,CAAC;QAChB,OAAO,EAAE,QAAQ,EAAE,IAAI,EAAE,aAAa,EAAE,IAAI,EAAE,aAAa,EAAE,IAAI,EAAE,SAAS,EAAE,CAAC;IACjF,CAAC;IAED,IAAI,UAAU,KAAK,SAAS,IAAI,UAAU,KAAK,QAAQ,EAAE,CAAC;QACxD,MAAM,UAAU,GAAG,MAAM,4BAA4B,CAAC,UAAU,EAAE,YAAY,EAAE,WAAW,CAAC,CAAC;QAC7F,OAAO,EAAE,GAAG,UAAU,EAAE,SAAS,EAAE,CAAC;IACtC,CAAC;IAED,MAAM,kBAAkB,GAAG,6BAA6B,CAAC,UAAU,CAAC,CAAC;IACrE,IAAI,kBAAkB,EAAE,CAAC;QACvB,MAAM,IAAI,KAAK,CACb,kDAAkD;YAClD,+DAA+D,CAChE,CAAC;IACJ,CAAC;IAED,OAAO;QACL,QAAQ,EAAE,UAAU;QACpB,aAAa,EAAE,YAAY,IAAI,IAAI;QACnC,aAAa,EAAE,IAAI;QACnB,SAAS;KACV,CAAC;AACJ,CAAC;AAED,SAAS,iBAAiB;IACxB,MAAM,aAAa,GAAG,aAAM,CAAC,eAAe,CAAC;IAC7C,IAAI,CAAC,aAAa;QAAE,OAAO;IAE3B,MAAM,UAAU,GAAG,iBAAiB,CAAC,aAAa,CAAC,CAAC;IAEpD,IAAI,UAAU,CAAC,OAAO,EAAE,CAAC;QACvB,OAAO,CAAC,IAAI,CAAC,eAAe,UAAU,CAAC,OAAO,EAAE,CAAC,CAAC;IACpD,CAAC;IAED,IAAI,UAAU,CAAC,KAAK;QAAE,OAAO;IAE7B,+EAA+E;IAC/E,MAAM,aAAa,GAAG,IAAI,CAAC,QAAQ,CAAC,aAAa,CAAC,CAAC;IACnD,IAAI,0BAAmB,CAAC,IAAI,CAAC,aAAa,CAAC,EAAE,CAAC;QAC5C,2EAA2E;QAC3E,sDAAsD;QACtD,MAAM,QAAQ,GAAG,IAAA,0BAAmB,EAAC,aAAa,CAAC,CAAC;QACpD,IAAI,QAAQ,EAAE,CAAC;YACb,OAAO,CAAC,KAAK,CAAC,6BAA6B,aAAa,OAAO,QAAQ,EAAE,CAAC,CAAC;YAC3E,aAAM,CAAC,eAAe,GAAG,QAAQ,CAAC;YAClC,OAAO;QACT,CAAC;QACD,2DAA2D;IAC7D,CAAC;IAED,OAAO,CAAC,KAAK,CAAC,wCAAwC,aAAa,EAAE,CAAC,CAAC;IACvE,OAAO,CAAC,KAAK,CAAC,cAAc,UAAU,CAAC,MAAM,EAAE,CAAC,CAAC;IACjD,OAAO,CAAC,KAAK,CAAC,yEAAyE,CAAC,CAAC;IAEzF,MAAM,QAAQ,GAAG,IAAA,yBAAkB,GAAE,IAAI,IAAI,CAAC,IAAI,CAAC,aAAM,CAAC,YAAY,EAAE,OAAO,CAAC,CAAC;IACjF,IAAI,MAAM,CAAC,UAAU,CAAC,QAAQ,CAAC,EAAE,CAAC;QAChC,IAAI,CAAC;YACH,MAAM,SAAS,GAAG,MAAM,CAAC,WAAW,CAAC,QAAQ,CAAC,CAAC;YAC/C,MAAM,OAAO,GAAG,SAAS,CAAC,MAAM,CAAC,CAAC,CAAC,EAAE,EAAE,CAAC,CAAC,CAAC,QAAQ,CAAC,IAAI,CAAC,QAAQ,CAAC,aAAa,CAAC,CAAC,IAAI,0BAAmB,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC;YAEjH,IAAI,OAAO,CAAC,MAAM,GAAG,CAAC,EAAE,CAAC;gBACvB,OAAO,CAAC,KAAK,CAAC,eAAe,CAAC,CAAC;gBAC/B,OAAO,CAAC,OAAO,CAAC,CAAC,CAAC,EAAE,EAAE,CAAC,OAAO,CAAC,KAAK,CAAC,OAAO,CAAC,EAAE,CAAC,CAAC,CAAC;YACpD,CAAC;iBAAM,CAAC;gBACN,+DAA+D;gBAC/D,IAAI,WAAW,GAAa,EAAE,CAAC;gBAC/B,MAAM,UAAU,GAAG,IAAI,CAAC,QAAQ,CAAC,aAAa,CAAC,CAAC;gBAEhD,KAAK,MAAM,QAAQ,IAAI,SAAS,EAAE,CAAC;oBACjC,MAAM,MAAM,GAAG,0BAAmB,CAAC,IAAI,CAAC,QAAQ,CAAC,CAAC;oBAClD,MAAM,UAAU,GAAG,8BAAuB,CAAC,IAAI,CAAC,QAAQ,CAAC,CAAC;oBAC1D,IAAI,CAAC,MAAM,IAAI,CAAC,UAAU;wBAAE,SAAS;oBACrC,MAAM,OAAO,GAAG,IAAI,CAAC,IAAI,CAAC,QAAQ,EAAE,QAAQ,CAAC,CAAC;oBAC9C,IAAI,CAAC;wBACH,IAAI,CAAC,MAAM,CAAC,QAAQ,CAAC,OAAO,CAAC,CAAC,WAAW,EAAE;4BAAE,SAAS;wBACtD,MAAM,WAAW,GAAG,MAAM,CAAC,WAAW,CAAC,OAAO,CAAC,CAAC;wBAChD,kDAAkD;wBAClD,MAAM,YAAY,GAAG,WAAW,CAAC,MAAM,CACrC,CAAC,CAAC,EAAE,EAAE,CAAC,CAAC,CAAC,QAAQ,CAAC,UAAU,CAAC,IAAI,0BAAmB,CAAC,IAAI,CAAC,CAAC,CAAC,CAC7D,CAAC;wBACF,KAAK,MAAM,KAAK,IAAI,YAAY,EAAE,CAAC;4BACjC,WAAW,CAAC,IAAI,CAAC,GAAG,QAAQ,IAAI,KAAK,EAAE,CAAC,CAAC;wBAC3C,CAAC;wBACD,0EAA0E;wBAC1E,IAAI,UAAU,EAAE,CAAC;4BACf,KAAK,MAAM,QAAQ,IAAI,WAAW,EAAE,CAAC;gCACnC,IAAI,CAAC,0BAAmB,CAAC,IAAI,CAAC,QAAQ,CAAC;oCAAE,SAAS;gCAClD,MAAM,OAAO,GAAG,IAAI,CAAC,IAAI,CAAC,OAAO,EAAE,QAAQ,CAAC,CAAC;gCAC7C,IAAI,CAAC;oCACH,IAAI,CAAC,MAAM,CAAC,QAAQ,CAAC,OAAO,CAAC,CAAC,WAAW,EAAE;wCAAE,SAAS;oCACtD,MAAM,aAAa,GAAG,MAAM,CAAC,WAAW,CAAC,OAAO,CAAC,CAAC;oCAClD,MAAM,SAAS,GAAG,aAAa,CAAC,MAAM,CACpC,CAAC,CAAC,EAAE,EAAE,CAAC,CAAC,CAAC,QAAQ,CAAC,UAAU,CAAC,IAAI,0BAAmB,CAAC,IAAI,CAAC,CAAC,CAAC,CAC7D,CAAC;oCACF,KAAK,MAAM,EAAE,IAAI,SAAS,EAAE,CAAC;wCAC3B,WAAW,CAAC,IAAI,CAAC,GAAG,QAAQ,IAAI,QAAQ,IAAI,EAAE,EAAE,CAAC,CAAC;oCACpD,CAAC;gCACH,CAAC;gCAAC,OAAO,MAAe,EAAE,CAAC;oCACzB,IAAI,MAAM,YAAY,KAAK,EAAE,CAAC;wCAC5B,0BAA0B;oCAC5B,CAAC;gCACH,CAAC;4BACH,CAAC;wBACH,CAAC;oBACH,CAAC;oBAAC,OAAO,MAAe,EAAE,CAAC;wBACzB,IAAI,MAAM,YAAY,KAAK,EAAE,CAAC;4BAC5B,0BAA0B;wBAC5B,CAAC;oBACH,CAAC;gBACH,CAAC;gBAED,IAAI,WAAW,CAAC,MAAM,GAAG,CAAC,EAAE,CAAC;oBAC3B,OAAO,CAAC,KAAK,CAAC,+BAA+B,CAAC,CAAC;oBAC/C,WAAW,CAAC,OAAO,CAAC,CAAC,CAAC,EAAE,EAAE,CAAC,OAAO,CAAC,KAAK,CAAC,OAAO,CAAC,EAAE,CAAC,CAAC,CAAC;gBACxD,CAAC;qBAAM,CAAC;oBACN,MAAM,QAAQ,GAAG,SAAS,CAAC,MAAM,CAAC,CAAC,CAAC,EAAE,EAAE,CAAC,0BAAmB,CAAC,IAAI,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,KAAK,CAAC,cAAc,CAAC,CAAC;yBACtE,IAAI,EAAE,CAAC,OAAO,EAAE,CAAC,KAAK,CAAC,CAAC,EAAE,CAAC,CAAC,CAAC;oBACxD,IAAI,QAAQ,CAAC,MAAM,EAAE,CAAC;wBACpB,OAAO,CAAC,KAAK,CAAC,yBAAyB,CAAC,CAAC;wBACzC,QAAQ,CAAC,OAAO,CAAC,CAAC,CAAC,EAAE,EAAE,CAAC,OAAO,CAAC,KAAK,CAAC,OAAO,CAAC,EAAE,CAAC,CAAC,CAAC;oBACrD,CAAC;gBACH,CAAC;YACH,CAAC;QACH,CAAC;QAAC,OAAO,KAAc,EAAE,CAAC;YACxB,MAAM,MAAM,GAAG,KAAK,YAAY,KAAK,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC;YACtE,OAAO,CAAC,KAAK,CAAC,iDAAiD,EAAE,MAAM,CAAC,CAAC;QAC3E,CAAC;IACH,CAAC;IACD,OAAO,CAAC,KAAK,CAAC,sIAAsI,CAAC,CAAC;IACtJ,OAAO,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;AAClB,CAAC;AAED,kEAAkE;AAClE,sBAAsB;AACtB,kEAAkE;AAClE,KAAK,UAAU,IAAI,CACjB,OAAiB,OAAO,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC,CAAC,EACtC,cAA8D,YAAY;IAE1E,OAAO,CAAC,KAAK,CAAC,4BAA4B,CAAC,CAAC;IAE5C,IAAI,CAAC;QACH,MAAM,MAAM,GAAG,MAAM,cAAc,CAAC,IAAI,EAAE,WAAW,CAAC,CAAC;QACvD,aAAM,CAAC,SAAS,GAAG,MAAM,CAAC,QAAQ,CAAC;QACnC,aAAM,CAAC,eAAe,GAAG,MAAM,CAAC,aAAa,CAAC;QAC9C,iBAAiB,EAAE,CAAC;QAEpB,MAAM,IAAA,sBAAW,EAAC;YAChB,QAAQ,EAAE,MAAM,CAAC,aAAa,CAAC,CAAC,CAAC,SAAS,CAAC,CAAC,CAAC,aAAM,CAAC,SAAS,IAAI,SAAS;YAC1E,aAAa,EAAE,aAAM,CAAC,eAAe,IAAI,SAAS;YAClD,aAAa,EAAE,MAAM,CAAC,aAAa,IAAI,SAAS;YAChD,UAAU,EAAE,MAAM,CAAC,aAAa;gBAC9B,CAAC,CAAC,SAAS;gBACX,CAAC,CAAC,GAAG,EAAE,CAAC,IAAA,2BAAiB,EAAC,EAAE,CAAC;YAC/B,oBAAoB,EAAE,yCAAkB;YACxC,SAAS,EAAE,MAAM,CAAC,SAAS,IAAI,SAAS;SACzC,CAAC,CAAC;IACL,CAAC;IAAC,OAAO,KAAc,EAAE,CAAC;QACxB,MAAM,MAAM,GAAG,KAAK,YAAY,KAAK,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC;QACtE,MAAM,UAAU,GAAG,iQAAiQ,CAAC,IAAI,CAAC,MAAM,CAAC,CAAC;QAElS,IAAI,UAAU,EAAE,CAAC;YACf,OAAO,CAAC,KAAK,CAAC,YAAY,MAAM,EAAE,CAAC,CAAC;QACtC,CAAC;aAAM,CAAC;YACN,OAAO,CAAC,KAAK,CAAC,mBAAmB,EAAE,MAAM,CAAC,CAAC;YAC3C,IAAI,KAAK,YAAY,KAAK,EAAE,CAAC;gBAC3B,OAAO,CAAC,KAAK,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC;YAC7B,CAAC;QACH,CAAC;QACD,OAAO,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;IAClB,CAAC;AACH,CAAC;AAED,kEAAkE;AAClE,aAAa;AACb,kEAAkE;AAClE,IAAI,OAAO,CAAC,IAAI,KAAK,MAAM,EAAE,CAAC;IAC5B,qBAAqB,EAAE,CAAC;IACxB,IAAI,EAAE,CAAC,KAAK,CAAC,CAAC,KAAc,EAAE,EAAE;QAC9B,MAAM,MAAM,GAAG,KAAK,YAAY,KAAK,CAAC,CAAC,CAAC,KAAK,CAAC,OAAO,CAAC,CAAC,CAAC,MAAM,CAAC,KAAK,CAAC,CAAC;QACtE,OAAO,CAAC,KAAK,CAAC,gBAAgB,MAAM,EAAE,CAAC,CAAC;QACxC,IAAI,KAAK,YAAY,KAAK,EAAE,CAAC;YAC3B,OAAO,CAAC,KAAK,CAAC,KAAK,CAAC,KAAK,CAAC,CAAC;QAC7B,CAAC;QACD,OAAO,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;IAClB,CAAC,CAAC,CAAC;AACL,CAAC"}
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/20-passive-context-enrichment.md:12:The memory-surface and response-hints hooks form a passive enrichment pipeline. On every tool call, constitutional memories and trigger-matched memories are surfaced and appended to the response envelope. Code graph status is included when available. Token estimation prevents oversized payloads. The enrichment is additive (appended to hints) and does not modify the primary tool response. This ensures AI runtimes always have access to critical context even when they do not explicitly call memory_context.
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:62:Usage: node generate-context.js [options] <input>
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:66:                    - JSON file mode: node generate-context.js data.json [spec-folder]
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:75:  node generate-context.js /tmp/context-data.json
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:76:  node generate-context.js /tmp/context-data.json specs/001-feature/
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:77:  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:78:  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:79:  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:490:            console.error('[generate-context] Failed to list spec folders:', errMsg);
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:493:    console.error('\nUsage: node generate-context.js [--stdin [spec-folder-name] | --json <json> [spec-folder-name] | <data-file> [spec-folder-name]]\n');
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:546://# sourceMappingURL=generate-context.js.map
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/19-query-intent-routing.md:3:description: "Automatic backend selection in memory_context that routes queries to code graph, CocoIndex, or both based on the query-intent classifier output."
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/19-query-intent-routing.md:10:Automatic backend selection in memory_context that routes queries to code graph, CocoIndex, or both based on the query-intent classifier output.
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/19-query-intent-routing.md:12:When memory_context receives a query, the query-intent classifier scores it against structural and semantic keyword dictionaries. Structural queries (e.g., "what calls functionX", "show imports") are routed to the code graph for symbol-level results. Semantic queries (e.g., "find examples of error handling") are routed to CocoIndex for vector-similarity results. Hybrid queries trigger both backends and merge the results. The routing is transparent to the caller; memory_context auto-selects the backend without requiring explicit mode parameters.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/13-constitutional-memory-manager-command.md:21:- Default create mode: qualify the proposed rule, structure a constitutional markdown file, check the shared `~2000` token budget, write the file, index it with `memory_save`, and verify retrieval with `memory_search`.
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.d.ts.map:1:{"version":3,"file":"generate-context.d.ts","sourceRoot":"","sources":["../../memory/generate-context.ts"],"names":[],"mappings":"AA4BA,KAAK,uBAAuB,GAAG,MAAM,CAAC,MAAM,EAAE,OAAO,CAAC,GAAG;IAAE,OAAO,EAAE,MAAM,CAAA;CAAE,CAAC;AAE7E,UAAU,kBAAkB;IAC1B,QAAQ,EAAE,MAAM,GAAG,IAAI,CAAC;IACxB,aAAa,EAAE,MAAM,GAAG,IAAI,CAAC;IAC7B,aAAa,EAAE,uBAAuB,GAAG,IAAI,CAAC;IAC9C,SAAS,EAAE,MAAM,GAAG,IAAI,CAAC;CAC1B;AAKD,8DAA8D;AAC9D,MAAM,WAAW,oBAAoB;IACnC,KAAK,EAAE,OAAO,CAAC;IACf,MAAM,CAAC,EAAE,MAAM,CAAC;IAChB,OAAO,CAAC,EAAE,MAAM,CAAC;CAClB;AA4HD,iBAAS,iBAAiB,CAAC,UAAU,EAAE,MAAM,GAAG,oBAAoB,CA8DnE;AAqED,iBAAS,wBAAwB,CAAC,IAAI,EAAE,MAAM,CAAC,MAAM,EAAE,OAAO,CAAC,GAAG,MAAM,GAAG,IAAI,CAS9E;AAED,iBAAe,YAAY,CAAC,KAAK,GAAE,MAAM,CAAC,UAA0B,GAAG,OAAO,CAAC,MAAM,CAAC,CAUrF;AAuED,iBAAe,cAAc,CAC3B,IAAI,GAAE,MAAM,EAA0B,EACtC,WAAW,GAAE,CAAC,KAAK,CAAC,EAAE,MAAM,CAAC,UAAU,KAAK,OAAO,CAAC,MAAM,CAAgB,GACzE,OAAO,CAAC,kBAAkB,CAAC,CAyC7B;AAED,iBAAS,iBAAiB,IAAI,IAAI,CA0GjC;AAKD,iBAAe,IAAI,CACjB,IAAI,GAAE,MAAM,EAA0B,EACtC,WAAW,GAAE,CAAC,KAAK,CAAC,EAAE,MAAM,CAAC,UAAU,KAAK,OAAO,CAAC,MAAM,CAAgB,GACzE,OAAO,CAAC,IAAI,CAAC,CAiCf;AAiBD,OAAO,EACL,IAAI,EACJ,YAAY,EACZ,cAAc,EACd,iBAAiB,EACjB,iBAAiB,EACjB,wBAAwB,GACzB,CAAC"}
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:3:description: "Session capturing pipeline quality is the current reality-alignment feature for `009-perfect-session-capturing`. It covers the shipped JSON-primary save path for `generate-context.js`, continued positional JSON file support on the same structured path, and the associated quality gates, sufficiency enforcement, and template-contract validation."
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:20:Session capturing pipeline quality is the current reality-alignment feature for `009-perfect-session-capturing`. It covers the full shipped session-capture path for `generate-context.js`:
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:51:18. `generate-context.js` diagnostic scores now reflect insufficiency explicitly instead of letting thin memories look healthy.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:55:22. Structured JSON mode accepts both `generate-context.js --stdin` and `generate-context.js --json <string>` as the preferred AI-composed save paths.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:108:- After normalization, `generate-context.js` evaluates one shared semantic sufficiency snapshot before writing or indexing.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:124:- `generate-context.js --stdin` reads structured JSON from stdin and routes it through the same workflow contract as file input.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:125:- `generate-context.js --json <string>` does the same for inline structured JSON payloads.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:176:| `scripts/memory/generate-context.ts` | CLI entrypoint; `--stdin`, `--json`, and positional JSON file input all resolve through the structured-input contract |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:180:| `shared/parsing/memory-sufficiency.ts` | Shared semantic sufficiency evaluator used by `generate-context.js` and `memory_save` |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:213:| `scripts/tests/generate-context-cli-authority.vitest.ts` | Explicit CLI root-spec authority coverage plus `--stdin`, `--json`, and positional JSON file-input structured-path behavior |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:227:- `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/spec-affinity.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/task-enrichment.vitest.ts tests/memory-render-fixture.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/memory-sufficiency.vitest.ts tests/memory-template-contract.vitest.ts`
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:232:- `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/workflow-e2e.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/contamination-filter.vitest.ts tests/quality-scorer-calibration.vitest.ts`
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:263:9. `generate-context.js --stdin` with structured JSON, explicit CLI target precedence, and preserved `toolCalls` / `exchanges`.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:264:10. `generate-context.js --json <string>` with payload-target fallback when no explicit CLI override exists and file-backed JSON authority preserved.
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md:30:| `mcp_server/handlers/memory-context.ts` | Handler | Forwards `includeTrace` through internal `memory_search` calls so context responses can include provenance. |
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md:32:| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Admits `includeTrace` for `memory_search` and `memory_context` input validation. |
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md:47:Successful insertions now clear the search cache immediately instead of waiting for delete-time invalidation or TTL expiry. `index_memory()` calls `clear_search_cache()` after the transactional insert, active-projection update and optional `vec_memories` write succeed, so a brand-new memory becomes visible to repeated `memory_search` calls right away. The fix closes a stale-results gap where the save path could report success while cached searches still replayed a pre-insert snapshot.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md:19:Phase 017 established the JSON-primary deprecation posture for `generate-context.js`. Runtime-derived capture for routine saves proved unreliable: wrong-session selection, contamination, and thin-evidence failures persisted across multiple research and fix rounds. The resolution: AI-composed JSON via `--json` or `--stdin` is the preferred routine-save contract, while positional JSON file input remains functional on the same structured-input path.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md:30:2. `generate-context.js --json '<data>'` and `generate-context.js --stdin` are the documented and preferred routine-save paths for AI-composed structured input.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md:53:- The save command (`/memory:save`) updated to document the JSON-primary posture.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md:69:| `scripts/memory/generate-context.ts` | CLI argument parsing for `--json`, `--stdin`, and positional JSON file input |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md:79:| `scripts/tests/generate-context-cli-authority.vitest.ts` | `--stdin` / `--json` structured-input precedence, explicit CLI target authority, and positional JSON file support |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md:80:| `scripts/tests/generate-context-cli-authority.vitest.ts` | Invalid inline JSON and missing-target failures for structured-input modes |
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/17-json-primary-deprecation-posture.md:87:- `cd .opencode/skill/system-spec-kit/scripts && npm test -- --run tests/generate-context-cli-authority.vitest.ts tests/workflow-e2e.vitest.ts`
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/11-shared-memory-end-to-end-architecture.md:19:Shared memory is a mutation-plus-retrieval feature, not a standalone folder-based subsystem. The live flow starts with lifecycle tools that enable the feature and administer shared spaces, then continues through governed `memory_save` writes and `memory_search` scope filtering.
.opencode/skill/system-spec-kit/feature_catalog/02--mutation/11-shared-memory-end-to-end-architecture.md:33:| Query visibility | Shared search visibility is enforced in the retrieval pipeline, not by a dedicated shared-memory query service. `memory_search` accepts tenant/user/agent/session/shared-space scope values and passes them into pipeline config. Stage 1 candidate generation computes `allowedSharedSpaceIds` with `getAllowedSharedSpaceIds()` and filters every candidate set through `filterRowsByScope()`. For shared rows, visibility depends on tenant match plus membership in an allowed space; exact actor/session match is intentionally not required once the row belongs to an allowed shared space. That is what makes collaborator A's shared rows visible to collaborator B inside the same shared space. |
.opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh:115:            resume_path=$(sed -n 's|^/spec_kit:resume[[:space:]]\+\(.*\)$|\1|p' "$markdown_file" | head -1)
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/15-dual-level-retrieval.md:3:description: "Adds a retrievalLevel parameter (local|global|auto) to memory_search, where auto mode falls back to community search on weak results, enabling both fine-grained and topic-level retrieval in a single query, gated by the SPECKIT_DUAL_RETRIEVAL flag."
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/15-dual-level-retrieval.md:10:Adds a `retrievalLevel` parameter (`local`|`global`|`auto`) to `memory_search`, where auto mode falls back to community search on weak results. This enables callers to explicitly request fine-grained local retrieval, broad community-level global retrieval, or let the system decide based on result quality.
.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/15-dual-level-retrieval.md:18:The `memory_search` handler accepts a `retrievalLevel` parameter with three modes: `local` runs standard retrieval channels only, `global` runs community-level search only, and `auto` (default) runs local retrieval first and falls back to community search when results are weak or empty. The flag and parameter are registered in `search-flags.ts`. Auto mode uses the same confidence thresholds as the empty-result recovery system to determine when fallback is needed.
.opencode/skill/system-spec-kit/scripts/dist/utils/prompt-utils.js:27:    console.error('  node generate-context.js /tmp/save-context-data.json <spec-folder-path>');
.opencode/skill/system-spec-kit/scripts/dist/utils/prompt-utils.js:30:    console.error('  node generate-context.js --json \'{"specFolder":"specs/003-memory-and-spec-kit/054-remaining-bugs-remediation"}\' specs/003-memory-and-spec-kit/054-remaining-bugs-remedation');
.opencode/skill/system-spec-kit/scripts/dist/utils/prompt-utils.js:43:        console.warn('[generate-context] Non-interactive mode: using default value');
.opencode/skill/system-spec-kit/scripts/dist/utils/prompt-utils.js:70:        console.warn(`[generate-context] Non-interactive mode: using default choice 1`);
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/11-final-token-metadata-recomputation.md:18:Phase 014 recomputes final token metadata after `appendAutoSurfaceHints(...)` mutates the envelope and before token-budget enforcement evaluates the payload. The same finalize-then-budget ordering now also applies in `memory_context`: auto-resume `systemPromptContext` items are injected before `enforceTokenBudget()` runs, so both `meta.tokenCount` and the delivered payload stay aligned with the final serialized envelope returned to callers.
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/15-mode-aware-response-profiles.md:3:description: "Mode-aware response profile formatters define four named presentation profiles (quick, research, resume, debug) behind the SPECKIT_RESPONSE_PROFILE_V1 flag. `memory_search` applies them today, while `memory_context` still carries a dead `profile` declaration."
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/15-mode-aware-response-profiles.md:10:Mode-aware response profile formatters define four named presentation profiles (quick, research, resume, debug) behind the `SPECKIT_RESPONSE_PROFILE_V1` flag. Live runtime wiring is still partial: `memory_search` applies them while `memory_context` still carries a dead `profile` declaration.
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/15-mode-aware-response-profiles.md:12:Different situations call for different response shapes. A quick question needs just the top result and a one-line explanation. A research session needs the full list with an evidence digest and follow-up suggestions. Resuming prior work needs state, next steps, and blockers. The formatter layer supports those shapes, but the live integration is incomplete: `memory_search` can apply response profiles, while `memory_context` only declares `profile?: string` and never consumes it. When the flag is off, the original full response is returned unchanged.
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/15-mode-aware-response-profiles.md:26:Runtime wiring is partial: `memory_search` applies the formatter, `memory_context` now accepts the same `profile` parameter at the schema level, but `memory_context` still declares `profile?: string` without using it. In practice, the context-side profile path remains dead code until the handler consumes it.
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/15-mode-aware-response-profiles.md:42:| `mcp_server/tool-schemas.ts` | Schema | Public tool schemas now expose `profile` for `memory_context` and `memory_search` |
.opencode/skill/system-spec-kit/scripts/dist/utils/validation-utils.js:71:        console.warn(`[generate-context] Anchor validation warnings in ${filename}:`);
.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/16-progressive-disclosure.md:12:The live handler preserves full `data.results`, adds `data.progressiveDisclosure`, and serves follow-up pages through `memory_search({ cursor })`. The summary tells you the quality distribution (e.g., "3 strong, 2 moderate, 1 weak") so you can decide whether to dig deeper, while pagination uses opaque cursor tokens with a time-to-live so the system can serve additional pages from a cached result set.
.opencode/skill/system-spec-kit/feature_catalog/17--governance/05-constitutional-gate-enforcement-rule-pack.md:29:`constitutional/README.md` defines the behavior of the constitutional tier itself. It documents that constitutional memories always appear at the top of `memory_search()` results, receive a fixed `similarity: 100`, never decay, remain permanently available, and use fast trigger-phrase matching for proactive surfacing. It also documents the operational envelope around this pack, including the shared constitutional token budget, authoring template, and verification flow after adding or updating a constitutional memory.
.opencode/skill/system-spec-kit/scripts/tests/test-bug-fixes.js:82:      path.join(ROOT, 'scripts', 'dist', 'memory', 'generate-context.js'),
.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:539:      '123-generate-context-subfolder',
.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:929:    const { isValidSpecFolder } = require(path.join(DIST_DIR, 'memory', 'generate-context'));
.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:971:  const outsideRoot = fs.mkdtempSync(path.join(require('os').tmpdir(), 'generate-context-outside-'));
.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:979:    const { isValidSpecFolder } = require(path.join(DIST_DIR, 'memory', 'generate-context'));
.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/15-tool-level-ttl-cache.md:20:Cache statistics (hits, misses, evictions, invalidations, hit rate) are tracked for observability. A periodic cleanup sweep removes expired entries. Tool-specific invalidation allows targeted cache busting after mutations without flushing the entire cache. The cache is wired into multiple handlers including `memory_search`, `memory_save`, `memory_update`, `memory_delete` and `memory_bulk_delete` via the mutation hooks system.
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:76:      liveBaselineResolution: 'memory_context',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:107:      liveBaselineResolution: 'memory_context',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:138:      liveBaselineResolution: 'memory_context_then_grep',
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:53:The Spec Kit Memory MCP server exposes **43 tools** overall across the 7-layer MCP surface. The command layer wraps the memory-focused subset under **4 top-level memory slash commands** plus the `/memory:manage shared` subcommand namespace, with session recovery still owned by `/spec_kit:resume` as a spec-folder workflow using the memory/session recovery stack. Each command declares its allowed tools in frontmatter; tools not listed are inaccessible to that command. The canonical source for primary tool ownership is the coverage matrix in `.opencode/command/memory/README.txt`, while each command file's `allowed-tools` frontmatter shows the full operational surface. Recovery behavior is documented in `.opencode/command/spec_kit/resume.md`.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:57:| `/memory:search` | 13 | owns | `memory_context`, `memory_quick_search`, `memory_search`, `memory_match_triggers`, `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `eval_run_ablation`, `eval_reporting_dashboard`, `memory_get_learning_history` |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:58:| `/memory:learn` | 6 | shared | `memory_save`, `memory_search`, `memory_stats`, `memory_list`, `memory_delete`, `memory_index_scan` |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:59:| `/memory:manage` | 19 primary + 1 helper | owns + borrows | Primary home: `memory_stats`, `memory_list`, `memory_index_scan`, `memory_validate`, `memory_update`, `memory_delete`, `memory_bulk_delete`, `memory_health`, `checkpoint_create`, `checkpoint_restore`, `checkpoint_list`, `checkpoint_delete`, `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`; helper access: `memory_search` |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:60:| `/memory:save` | 4 | shared | `memory_save`, `memory_index_scan`, `memory_stats`, `memory_update` |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:62:| `/spec_kit:resume` | broader helper surface | shared | Primary recovery chain: `memory_context`, `memory_search`, `memory_list`; wrapper also allows `memory_stats`, `memory_match_triggers`, `memory_delete`, `memory_update`, plus health, indexing, validation, checkpoint, and CocoIndex helpers |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:70:### Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:78:You send a query or prompt. The system figures out what you need. That is the core idea behind `memory_context`: an L1 orchestration layer that auto-detects your task intent and routes to the best retrieval strategy without you having to pick one.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:96:### Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:128:`memory_quick_search` is a live MCP tool, not just a README alias. The dispatcher in `tools/memory-tools.ts` validates the tool's narrowed input schema and forwards the call to `memory_search` with a fixed profile: `autoDetectIntent=true`, `enableDedup=true`, `includeContent=true`, `includeConstitutional=true`, and `rerank=true`. The public arguments are intentionally narrow: `query`, `limit`, `specFolder`, `tenantId`, `userId`, `agentId`, and `sharedSpaceId`. That makes it useful for fast governed retrieval while keeping the heavyweight search configuration surface on `memory_search`.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:136:### Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:146:A governed-scope pass now runs immediately after raw trigger matching. `memory_match_triggers` accepts optional `tenantId`, `userId`, `agentId`, and `sharedSpaceId` boundaries, then looks up each match in `memory_index` and drops out-of-scope rows before cognitive enrichment begins. That closes the trigger-phrase leak where another tenant or actor's memory could surface before normal retrieval filtering kicked in.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:284:### Session recovery via /spec_kit:resume
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:288:When a session is interrupted by a crash, context compaction, timeout, or an ordinary cross-session handoff, this command reconstructs the most likely previous session state and routes the user to the best next step. It uses `memory_context` in resume mode as the primary interrupted-session recovery path, with a fallback chain through crash-recovery breadcrumbs, anchored memory search, and recent-candidate discovery.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:292:**SHIPPED.** `/spec_kit:resume` owns session recovery and continuation. Its primary recovery chain relies on 3 shared memory tools: `memory_context`, `memory_search`, and `memory_list`. `memory_stats` remains diagnostic/helper access, and the live wrapper also permits `memory_match_triggers`, `memory_delete`, `memory_update`, health, indexing, validation, checkpoint, and CocoIndex helpers that support the broader recovery workflow.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:294:The primary recovery path calls `memory_context` in `resume` mode with anchors targeting `state`, `next-steps`, `summary`, and `blockers`. Resume mode uses a 1200-token budget with `minState=WARM`, `includeContent=true`, dedup and decay both disabled.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:298:The recovery chain prioritizes: (1) fresh `handover.md` when present, (2) `memory_context` in resume mode, (3) `CONTINUE_SESSION.md` crash breadcrumb, (4) anchored `memory_search` for thin summaries, (5) `memory_list` for recent-candidate discovery, and (6) user confirmation as final fallback.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:300:After recovery, the command continues directly inside `/spec_kit:resume` for structured spec-folder work or routes to `/memory:search history` for broader historical analysis, depending on user intent.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:306:| `.opencode/command/spec_kit/resume.md` | `/spec_kit:resume` command definition with continuation and recovery workflows |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:348:Successful insertions now clear the search cache immediately instead of waiting for delete-time invalidation or TTL expiry. `index_memory()` calls `clear_search_cache()` after the transactional insert, active-projection update and optional `vec_memories` write succeed, so a brand-new memory becomes visible to repeated `memory_search` calls right away. The fix closes a stale-results gap where the save path could report success while cached searches still replayed a pre-insert snapshot.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1211:Logging hooks in the search, context and trigger handlers are best-effort and fail-safe: they run only when `SPECKIT_EVAL_LOGGING=true`, and all write paths are wrapped in non-fatal `try/catch` blocks so query responses continue even if eval logging fails. `memory_search` and `memory_context` emit per-channel rows. `memory_match_triggers` emits query/final-result rows.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1327:Instrumentation wiring remains present in retrieval handlers (`memory_search`, `memory_context`, `memory_match_triggers`), and the runtime logger is active through `isConsumptionLogEnabled()`, which delegates to rollout policy via `isFeatureEnabled('SPECKIT_CONSUMPTION_LOG')`.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2101:Cache statistics (hits, misses, evictions, invalidations, hit rate) are tracked for observability. A periodic cleanup sweep removes expired entries. Tool-specific invalidation allows targeted cache busting after mutations without flushing the entire cache. The cache is wired into multiple handlers including `memory_search`, `memory_save`, `memory_update`, `memory_delete` and `memory_bulk_delete` via the mutation hooks system.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2516:The `memory_context` orchestration layer checks descriptions before issuing
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2822:Stateless `generate-context.js` saves now enrich thin OpenCode-derived session data with spec-folder and git context before rendering, while keeping contamination defenses in place.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3765:Phase 016 added structured JSON summary support to `generate-context.js`, including `toolCalls` and `exchanges` fields, file-backed JSON authority preservation, and Wave 2 hardening for decision confidence, truncated titles, `git_changed_file_count` stability, and template count preservation.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3783:Phase 017 established the JSON-only save contract for `generate-context.js`. Dynamic session capture proved unreliable and has been removed. `--json` and `--stdin` are now the sole save paths.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3879:Session capturing pipeline quality is the current reality-alignment feature for `009-perfect-session-capturing`. It covers the full shipped session-capture path for `generate-context.js`: (1) Part I hardening across session extraction, file writing, contamination filtering, alignment blocking, and config-driven limits; (2) spec-folder and git context enrichment for JSON-mode saves; (3) numeric quality-score calibration so thin saves score lower than rich ones; (4) one shared semantic sufficiency gate so aligned but under-evidenced memories fail explicitly instead of indexing; (5) one shared rendered-memory template contract so malformed ANCHOR/frontmatter output fails before write/index; (6) a fully refreshed canonical verification and manual-testing record; (7) JSON-only routine-save contract; (8) Wave 2 count/confidence hardening for decision confidence, truncated outcomes, and stable `git_changed_file_count` priority.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4188:Phase 014 recomputes final token metadata after `appendAutoSurfaceHints(...)` mutates the envelope and before token-budget enforcement evaluates the payload. The same finalize-then-budget ordering now also applies in `memory_context`, where auto-resume `systemPromptContext` injection happens before `enforceTokenBudget()`. This keeps `meta.tokenCount` and the delivered payload aligned with the exact serialized envelope returned to callers.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4284:Four profiles are implemented: quick (topResult + oneLineWhy + omittedCount + tokenReduction), research (results + evidenceDigest + followUps), resume (state + nextSteps + blockers), and debug (full trace + tokenStats). Backward compatible: when the flag is OFF or profile is omitted, the original response is unchanged. Default ON, set `SPECKIT_RESPONSE_PROFILE_V1=false` to disable. Runtime wiring is active on both `memory_search` and `memory_context`, with explicit profile selection and intent-to-profile auto-routing when a profile is not provided.
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4478:| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | `handlers/memory-context.ts` | Enables context-pressure-based mode downgrading in `memory_context`. Above 0.60 token usage ratio, switches to focused mode. Above 0.80, switches to quick mode. Also subject to `SPECKIT_ROLLOUT_PERCENT`. |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4479:| `SPECKIT_PROGRESSIVE_DISCLOSURE_V1` | `true` | boolean | `lib/search/progressive-disclosure.ts` | **Default ON (graduated).** Progressive disclosure companion payload for search results. Preserves full `data.results` and adds `data.progressiveDisclosure` with summary layer (confidence distribution digest), snippet extraction (100-char previews), and cursor pagination. Continuation pages resolve through `memory_search({ cursor })`. |
.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4486:| `SPECKIT_RESPONSE_TRACE` | `false` | boolean | `handlers/memory-search.ts` | **IMPLEMENTED (Sprint 019).** P0-2: Include provenance data (scores, source, trace) in `memory_search` response envelopes. Opt-in via `includeTrace: true` parameter. Also propagates through `memory_context` when `includeTrace` is forwarded to internal search calls (CHK-040). When disabled, response format is unchanged (backward compatible). |
.opencode/skill/system-spec-kit/scripts/tests/memory-learn-command-docs.vitest.ts:19:    expect(learnDoc).toContain('[s] use /memory:save instead');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:40:describe('generate-context CLI authority', () => {
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:58:    process.argv = ['node', path.join('scripts', 'dist', 'memory', 'generate-context.js'), dataFile, explicitSpecFolder];
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:60:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:82:      path.join('scripts', 'dist', 'memory', 'generate-context.js'),
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:89:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:114:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:140:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:167:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:203:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:219:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:234:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:249:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:264:      await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/setup/install.sh:351:    echo "  3. Use memory_search, memory_save, memory_context tools for context preservation"
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:101:        'Implemented the shared insufficiency gate in both generate-context and memory_save, then wired the rejection payload so dry-run reports reasons and evidence counts before any write occurs.',
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:106:      triggerPhrases: ['memory_save', 'dry run', 'insufficient context', 'generate-context'],
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:67:      const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:115:      const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:169:            command: "node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/specs/00--anobel.com/036-hero-contact-success",
.opencode/skill/system-spec-kit/scripts/tests/README.md:70:  - `generate-context-cli-authority.vitest.ts`
.opencode/skill/system-spec-kit/scripts/tests/README.md:168:- Direct CLI authority coverage for explicit spec-folder saves through the real `generate-context -> runWorkflow` seam.
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2841:  log('\n🔬 MEMORY: generate-context.js');
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2848:    } = require(path.join(SCRIPTS_DIR, 'memory', 'generate-context'));
.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:110:      const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:326:  it('confirms generate-context.js compiled entrypoint exists', () => {
.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:327:    // W1-T3 parity: compiled generate-context must be present for CLI invocation
.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:328:    const generateContextPath = path.join(SCRIPTS_DIR, 'dist', 'memory', 'generate-context.js');
.opencode/skill/system-spec-kit/scripts/dist/core/workflow.js:805:                '  - If using generate-context.js, ensure extractors/collect-session-data.js exports collectSessionData');
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-2phase-default/spec.md:207:- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
.opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-creation/expected-3phase-named/spec.md:256:- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC4-importance-tier.json:24:    "Replay the fixture through generate-context.js and confirm tier parity"
.opencode/skill/system-spec-kit/scripts/dist/spec-folder/folder-detector.js:1012:            console.error('\nUsage: node generate-context.js [spec-folder-name] OR node generate-context.js <data-file> [spec-folder]\n');

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md | sed -n '45,130p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    45	The last three code-audit phases map to existing catalog categories rather than having their own dedicated sections:
    46	
    47	| Audit phase | Where to find it |
    48	|---|---|
    49	| `020-feature-flag-reference` | [`19--feature-flag-reference/08-audit-phase-020-mapping-note.md`](./19--feature-flag-reference/08-audit-phase-020-mapping-note.md) |
    50	| `021-remediation-revalidation` | [`20--remediation-revalidation/01-category-stub.md`](./20--remediation-revalidation/01-category-stub.md) plus the linked bug-fix, pipeline-safety, and code-standards records |
    51	| `022-implement-and-remove-deprecated-features` | [`21--implement-and-remove-deprecated-features/01-category-stub.md`](./21--implement-and-remove-deprecated-features/01-category-stub.md) plus the linked dead-code-removal and feature-flag-sunset records |
    52	
    53	### Command-Surface Contract
    54	
    55	The memory system exposes **43 tools** overall, while the day-to-day command layer uses **4 main memory slash commands**, the `/memory:manage shared` subcommand area, and `/spec_kit:resume` for session recovery. Think of commands as doors into the system: the full MCP server has more rooms than the command layer exposes directly. Each door only opens access to the tools it needs. The source of truth for primary ownership is the coverage matrix in `.opencode/command/memory/README.txt`, while each command file's `allowed-tools` frontmatter shows the full operational surface. The recovery contract lives in `.opencode/command/spec_kit/resume.md`.
    56	
    57	| Command | What It Does | Tools It Can Use |
    58	|---------|-------------|-----------------|
    59	| `/memory:search` | Search, retrieve, and analyze knowledge (13 tools) | `memory_context`, `memory_quick_search`, `memory_search`, `memory_match_triggers`, `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `eval_run_ablation`, `eval_reporting_dashboard`, `memory_get_learning_history` |
    60	| `/memory:learn` | Create and manage always-surface rules (6 tools, borrowed) | `memory_save`, `memory_search`, `memory_stats`, `memory_list`, `memory_delete`, `memory_index_scan` |
    61	| `/memory:manage` | Database maintenance, checkpoints, and bulk ingestion (19 primary tools plus `memory_search` helper access) | Primary home: `memory_stats`, `memory_list`, `memory_index_scan`, `memory_validate`, `memory_update`, `memory_delete`, `memory_bulk_delete`, `memory_health`, `checkpoint_create`, `checkpoint_restore`, `checkpoint_list`, `checkpoint_delete`, `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`; helper access: `memory_search` |
    62	| `/memory:save` | Save conversation context (4 tools, borrowed) | `memory_save`, `memory_index_scan`, `memory_stats`, `memory_update` |
    63	| `/memory:manage shared` | Shared-memory subcommand area under `/memory:manage` (4 tools) | `shared_space_upsert`, `shared_space_membership_set`, `shared_memory_status`, `shared_memory_enable` |
    64	| `/spec_kit:resume` | Continue or recover prior work (primary chain uses 3 shared tools, with extra helpers behind the scenes) | `memory_context`, `memory_search`, `memory_list` plus `memory_stats`, `memory_match_triggers`, `memory_delete`, `memory_update`, and health, indexing, validation, checkpoint, and CocoIndex helpers in the wrapper |
    65	
    66	Some commands own their tools (they are the primary home) while others borrow tools from `/memory:search` or `/memory:manage`. A borrowed tool works the same way; it is just administered somewhere else.
    67	
    68	---
    69	
    70	## 2. RETRIEVAL
    71	
    72	### Unified context retrieval (memory_context)
    73	
    74	When you ask the system a question, it figures out what kind of help you need and automatically picks the best way to find the answer. Think of it like a smart librarian who reads your request, decides whether you need a quick lookup or a deep research session and then fetches the right materials for you. Without this, you would have to manually tell the system how to search every time. Resume notes are now added before the size limit is enforced, so the final reply does not grow past the promised budget after those notes are attached.
    75	
    76	### Semantic and lexical search (memory_search)
    77	
    78	This is the main search tool. You type what you are looking for in plain language and the system searches through all stored knowledge to find the best matches. It understands meaning (not just keywords), so searching for "login problems" can find a document titled "authentication troubleshooting." Without it, you would have no way to find relevant information in the knowledge base.
    79	
    80	Recent hardening closed three confusing edge cases. Expired memories no longer slip into multi-concept searches, malformed embeddings now fail with a clear validation error instead of a low-level sqlite-vec crash, and constitutional memories no longer overflow the requested limit when they already fill the result set.
    81	
    82	### Fast delegated search (memory_quick_search)
    83	
    84	This is the lightweight search entry point for callers that want the main semantic search behavior without having to set a large option surface themselves. It works like a preset: you provide a query and optional governed-scope boundaries, and the server forwards the request to the full search tool using sensible retrieval defaults.
    85	
    86	### Trigger phrase matching (memory_match_triggers)
    87	
    88	This is the speed-first search option. Instead of doing a deep analysis of your question, it matches specific phrases you type against a list of known keywords, like a phone's autocomplete. It returns results almost instantly, which makes it great for quick lookups where you already know roughly what you are looking for. Frequently used memories show up with full details while older ones appear as lightweight pointers. It now also checks tenant, user, agent, and shared-space boundaries after matching so one tenant's trigger phrases do not leak into another tenant's results.
    89	
    90	### Hybrid search pipeline
    91	
    92	When you search for something, the system looks in several places at once, like checking both the index and the shelves in a library. It then combines all the results and ranks them by relevance so the best match shows up first. If the first search comes back empty, the system automatically widens its net and tries again with looser criteria so you almost never get zero results. That widening no longer ignores your explicit routing choices: if you turned graph signals off, the fallback path keeps them off instead of quietly turning them back on. The last-resort SQL fallback also keeps archived memories out unless you explicitly ask for them, and score boosts from co-activation and session memory stay in sync so later ranking code sees the same boosted values.
    93	
    94	### 4-stage pipeline architecture
    95	
    96	Every search goes through four steps, like an assembly line. First, gather candidates. Second, score and rank them. Third, re-check the ranking for accuracy. Fourth, filter out anything that does not belong. Each step has one clear job and is not allowed to change results from earlier steps. This structure keeps searches predictable and prevents bugs from sneaking in between stages. Deep-mode helper branches now go through the same scope, context and quality filters as normal results, constitutional inserts obey global scope rules, and chunk reassembly now understands both `snake_case` and `camelCase` field names.
    97	
    98	### BM25 trigger phrase re-index gate
    99	
   100	When you change the keywords associated with a memory, the search index now updates itself to reflect those changes. Previously it only refreshed when you changed the title, so updated keywords were invisible to searches until a full rebuild. This fix makes sure the system stays in sync with your edits.
   101	
   102	### AST-level section retrieval tool
   103	
   104	This planned feature would let you pull out a single section from a large document by its heading, like opening a book directly to the chapter you need instead of flipping through the whole thing. It is not built yet because current documents are small enough that fetching the whole file works fine.
   105	
   106	### Quality-aware 3-tier search fallback
   107	
   108	If your search does not find good results on the first try, the system automatically tries again with wider criteria instead of giving up. Think of it like asking a store clerk for a specific item. If they cannot find it on the first shelf, they check the back room and then the warehouse. You almost never walk away empty-handed. The important refinement is that the wider search now stays inside the channels you still allowed, so a fallback run does not quietly re-enable graph or degree signals you explicitly turned off.
   109	
   110	### Tool-result extraction to working memory
   111	
   112	When the system finds something useful during a search, it keeps a mental note of it for the rest of your session. That way, if you ask a follow-up question a few turns later, the system still remembers what it found earlier. These notes gradually fade over time so the most recent findings stay prominent while older ones quietly step aside.
   113	
   114	### Session recovery (/spec_kit:resume)
   115	
   116	When a session is interrupted by a crash, context compaction, timeout, or an ordinary cross-session handoff, this command figures out where you left off and helps you pick up again. It checks fresh handover state first, then the memory system for your most recent work, looks for crash-recovery breadcrumbs, and presents what it found. Think of it like reopening your laptop after it went to sleep and having your browser restore all the tabs you had open. Its primary recovery chain uses 3 borrowed tools: `memory_context`, `memory_search`, and `memory_list`, while the live wrapper also keeps `memory_stats`, `memory_match_triggers`, `memory_delete`, `memory_update`, and extra health, indexing, checkpoint, validation, and CocoIndex helpers available for resume workflows. Two modes are available: auto (resolves the best candidate with minimal prompting) and confirm (presents alternatives when it is not sure which session you want). After recovery, it keeps you inside the same resume workflow for structured work or points you to broader history when needed.
   117	
   118	---
   119	
   120	## 3. MUTATION
   121	
   122	### Memory indexing (memory_save)
   123	
   124	This is how you add new knowledge to the system. You point it at a file and it reads, understands and stores the content so it becomes searchable. Before storing, it checks whether the same information already exists and decides whether to add it fresh, update an older version or skip it entirely. Quality checks catch low-value content before it clutters up the knowledge base.
   125	
   126	Today that save path has two extra safety checks before storage. First, memories that are too thin or lack enough supporting context are rejected outright so the system does not fill up with low-value entries. Second, files that are missing required structure (like headings, labels or metadata fields) are caught and rejected before they enter the index. You can also do a practice run to preview these checks without actually saving anything.
   127	
   128	Another fix makes fresh saves show up reliably in repeat searches. After a successful insert, the search cache is cleared right away, so asking the same question again does not replay stale results that were computed before the new memory existed.
   129	
   130	### Memory metadata update (memory_update)

exec
/bin/zsh -lc 'rg -n "session_bootstrap|session_resume|memory_context|memory_match_triggers|memory_save|memory_search" .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts .opencode/skill/system-spec-kit/mcp_server/tools .opencode/skill/system-spec-kit/mcp_server/handlers | head -n 120' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:42:  name: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:49:  name: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:190:// E3: Simplified search — 3 params, sensible defaults, delegates to memory_search
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:193:  description: '[L2:Core] Simplified search — query + optional limit + optional spec folder. Delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, limit 10). Use this when you want fast search without configuring 31 parameters.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:211:  name: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:218:  name: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:740:  name: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:755:  name: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:756:  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:768:      resume: { type: 'object', description: 'Merged session_resume payload (spec folder, task status, memory context)' },
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:4:// Dispatch for L1 Orchestration tool: memory_context (T303).
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:11:export const TOOL_NAMES = new Set(['memory_context']);
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:16:    case 'memory_context': return handleMemoryContext(parseArgs<ContextArgs>(validateToolArgs('memory_context', args)));
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:11:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/tools/README.md:27:- `context-tools.ts` - dispatch for `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/tools/README.md:40:- `memory-tools.ts` implements the `memory_quick_search` delegation path by building a richer `memory_search` request and relabeling the returned envelope metadata back to `memory_quick_search`.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:197:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:220:        tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:225:          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:284:      console.warn('[memory_match_triggers] Decay failed:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:336:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:374:        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:390:          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:491:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:511:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:565:  handle_memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:62:  'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:64:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:65:  'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:78:    case 'memory_search':         return handleMemorySearch(parseArgs<SearchArgs>(validateToolArgs('memory_search', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:80:      // E3: Delegate to memory_search with sensible defaults
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:99:    case 'memory_match_triggers': return handleMemoryMatchTriggers(parseArgs<TriggerArgs>(validateToolArgs('memory_match_triggers', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:100:    case 'memory_save':           return handleMemorySave(parseArgs<SaveArgs>(validateToolArgs('memory_save', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:61:  'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:62:  'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:82:    case 'session_resume':             return handleSessionResume(parseArgs<SessionResumeArgs>(validateToolArgs('session_resume', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:83:    case 'session_bootstrap':          return handleSessionBootstrap(parseArgs<SessionBootstrapArgs>(validateToolArgs('session_bootstrap', args)));
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
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:19:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:36:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:124: * Result payload from reconsolidation pre-checks during memory_save.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:301:                recordHistory(id, 'ADD', null, memory.title ?? memory.filePath ?? null, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:322:            reason: `memory_save: reconsolidation ${reconResult.action}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:329:              tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:335:            actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:10:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:11:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:100:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:340:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:554:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:566:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:594:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:613:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:625:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:751:  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1044:      toolCache.set(cacheKey, cachePayload, { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1374:const handle_memory_search = handleMemorySearch;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1377:  handle_memory_search,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
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
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:24:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts:19:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:222:export const handle_memory_search = lazyFunction(getMemorySearchModule, 'handle_memory_search');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:226:export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:233:export const handle_memory_save = lazyFunction(getMemorySaveModule, 'handle_memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:320:export const handle_memory_context = lazyFunction(getMemoryContextModule, 'handle_memory_context');
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:28:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:613:    reason: `memory_save: chunked indexing (${chunkResult.strategy}, ${chunkResult.chunks.length} chunks)`,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:618:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:628:    actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:90: * reliable retrieval via the `memory_match_triggers` tool. The scoring
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:17:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:297:      actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:303:      recordHistory(nextMemoryId, 'ADD', null, parsed.title ?? parsed.filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:304:      recordHistory(memoryId, 'UPDATE', previous.title, parsed.title ?? parsed.filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:18:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:60:// Feature catalog: Unified context retrieval (memory_context)

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '470,840p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '730,820p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

 succeeded in 0ms:
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

codex
I’ve got enough of the current runtime surfaces to see the key contrast: Public already has the richer retrieval core, while Mnemosyne mostly simplifies the entry experience and makes memory-awareness more explicit during compaction. I’m pulling the remaining resume/bootstrap and fusion metadata points now, then I’ll synthesize the iteration in the exact schema with concrete workflow changes, non-goals, and migration guidance.
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '400,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '35,90p;735,770p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    35	
    36	// ───────────────────────────────────────────────────────────────
    37	// 2. TOOL DEFINITIONS
    38	
    39	// ───────────────────────────────────────────────────────────────
    40	// T061: L1 Orchestration - Unified entry point (Token Budget: 3500)
    41	const memoryContext: ToolDefinition = {
    42	  name: 'memory_context',
    43	  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
    44	  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
    45	};
    46	
    47	// L2: Core - Primary operations (Token Budget: 3500)
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
   735	  inputSchema: { type: 'object', additionalProperties: false, properties: {}, required: [] },
   736	};
   737	
   738	// Phase 020: Composite session resume tool
   739	const sessionResume: ToolDefinition = {
   740	  name: 'session_resume',
   741	  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
   742	  inputSchema: {
   743	    type: 'object',
   744	    additionalProperties: false,
   745	    properties: {
   746	      specFolder: { type: 'string', description: 'Optional spec folder to scope the resume context' },
   747	      minimal: { type: 'boolean', description: 'When true, skip the heavy memory context call and return code-graph, CocoIndex, structural-context, hints, and session-quality fields without the full memory payload' },
   748	    },
   749	    required: [],
   750	  },
   751	};
   752	
   753	// Phase 024 / Item 7: Composite session bootstrap tool
   754	const sessionBootstrap: ToolDefinition = {
   755	  name: 'session_bootstrap',
   756	  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
   757	  inputSchema: {
   758	    type: 'object',
   759	    additionalProperties: false,
   760	    properties: {
   761	      specFolder: { type: 'string', description: 'Optional spec folder to scope the resume context' },
   762	    },
   763	    required: [],
   764	  },
   765	  outputSchema: {
   766	    type: 'object',
   767	    properties: {
   768	      resume: { type: 'object', description: 'Merged session_resume payload (spec folder, task status, memory context)' },
   769	      health: { type: 'object', description: 'session_health payload (system status, database health, MCP connectivity)' },
   770	      structuralContext: { type: 'object', description: 'Structural bootstrap contract (status, summary, recommendedAction); omitted when code graph is unavailable', properties: { status: { type: 'string', enum: ['ready', 'stale', 'missing'] }, summary: { type: 'string' }, recommendedAction: { type: 'string' } } },

exec
/bin/zsh -lc "rg -n \"core=true|core \\(project\\)|always-surface|constitutional|global variants|At the start of a session\" .opencode/skill/system-spec-kit .opencode/command | head -n 120" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/command/create/assets/create_folder_readme_auto.yaml:704:        constitutional: Core project rules (auto-surface always)
.opencode/command/create/assets/create_folder_readme_auto.yaml:1161:        constitutional: Core project rules (auto-surface always)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:162:  constitutional: unknown[];
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:676:  const constitutionalCount = Array.isArray(sessionPrimeContext.constitutional)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:677:    ? sessionPrimeContext.constitutional.length
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:685:    `Session priming: loaded ${constitutionalCount} constitutional memories and ${codeGraphState}`
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1166:        const constDir = path.join(skillDir, entry.name, 'constitutional');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1170:      // Non-fatal: constitutional directory discovery failed
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:224:| `SPECKIT_HYBRID_DECAY_POLICY` | `true` | boolean | Type-aware no-decay for permanent artifacts (decision/constitutional types get Infinity stability). Graduated ON. | `lib/cognitive/fsrs-scheduler.ts` |
.opencode/command/create/assets/create_agent_confirm.yaml:710:        constitutional: Core project rules (auto-surface always)
.opencode/command/create/assets/create_agent_auto.yaml:622:        constitutional: Core project rules (auto-surface always)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:94:  constitutionalCacheCleared: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:71:  const validTiers = ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:80:  // Safety: refuse to bulk-delete constitutional or critical tiers without explicit specFolder scope
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:81:  if ((tier === 'constitutional' || tier === 'critical') && !specFolder) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:85:  if ((tier === 'constitutional' || tier === 'critical') && skipCheckpoint) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:161:        if (tier === 'constitutional' || tier === 'critical') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:173:      if (tier === 'constitutional' || tier === 'critical') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:269:        constitutionalCacheCleared: false, toolCacheInvalidated: 0,
.opencode/command/create/assets/create_folder_readme_confirm.yaml:706:        constitutional: Core project rules (auto-surface always)
.opencode/command/create/assets/create_folder_readme_confirm.yaml:1256:        constitutional: Core project rules (auto-surface always)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:322:        constitutionalCacheCleared: false, toolCacheInvalidated: 0,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:251:        constitutionalCacheCleared: false, toolCacheInvalidated: 0,
.opencode/command/README.txt:153:| Learn | `/memory:learn [rule] \| list \| edit \| remove \| budget` | Create and manage constitutional memories |
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:250:      constitutionalCacheCleared: false, toolCacheInvalidated: 0,
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:277:export const find_constitutional_files = lazyFunction(getMemoryIndexModule, 'find_constitutional_files');
.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml:535:      tier_reference: "constitutional > critical > important > normal > temporary > deprecated"
.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:54:  let constitutionalCacheCleared = false;
.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:57:    constitutionalCacheCleared = true;
.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:65:    constitutionalCacheCleared = false;
.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:100:    constitutionalCacheCleared,
.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1082:      tier_reference: "constitutional > critical > important > normal > temporary > deprecated"
.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml:509:      tier_reference: "constitutional > critical > important > normal > temporary > deprecated"
.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml:1006:      tier_reference: "constitutional > critical > important > normal > temporary > deprecated"
.opencode/command/spec_kit/complete.md:492:| Record constitutional rule | `/memory:learn [rule]` | Save a durable repo-wide rule |
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1129:    throw new Error('File must be a .md or .txt file in: specs/**/memory/, specs/**/ (spec docs), or .opencode/skill/*/constitutional/');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1728:        constitutionalCacheCleared: false, toolCacheInvalidated: 0,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:99:  constitutional: {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:167:    includeConstitutional: include_constitutional = true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:213:  const constitutionalFiles: string[] = include_constitutional ? findConstitutionalFiles(workspacePath) : [];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:228:  const mergedFiles = [...specFiles, ...constitutionalFiles, ...specDocFiles];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:327:        'Constitutional files go in .opencode/skill/*/constitutional/'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:332:  const constitutionalSet = new Set(constitutionalFiles.map((filePath) => getCachedKey(filePath)));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:345:    constitutional: {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:346:      found: constitutionalFiles.length,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:380:      if (constitutionalSet.has(getCachedKey(unchangedPath))) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:381:        results.constitutional.alreadyIndexed++;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:411:      const isConstitutional = constitutionalSet.has(getCachedKey(filePath));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:457:            results.constitutional.indexed++;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:459:            results.constitutional.alreadyIndexed++;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:526:          docType !== 'constitutional'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:641:              constitutionalFiles: constitutionalFiles.length,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:673:const find_constitutional_files = findConstitutionalFiles;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:682:  find_constitutional_files,
.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml:555:      tier_reference: "constitutional > critical > important > normal > temporary > deprecated"
.opencode/command/spec_kit/debug.md:333:| Record lasting debugging rule | `/memory:learn [rule]`                 | Save a constitutional rule from debugging |
.opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml:604:      tier_reference: "constitutional > critical > important > normal > temporary > deprecated"
.opencode/skill/system-spec-kit/SKILL.md:8:<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, spec-kit-memory, vector-search, hybrid-search, bm25, rrf-fusion, fsrs-decay, constitutional-tier, checkpoint, importance-tiers, cognitive-memory, co-activation, tiered-injection -->
.opencode/skill/system-spec-kit/SKILL.md:73:Routing to `@general`, `@write`, or other agents for spec documentation is a **hard violation**. See constitutional memory: `speckit-exclusivity.md`
.opencode/skill/system-spec-kit/SKILL.md:623:- **Document-type scoring** — 10 indexed document types with multipliers: spec (1.4x), plan (1.3x), constitutional (2.0x), decision_record (1.4x), tasks (1.1x), implementation_summary (1.1x), scratch (0.6x), checklist (1.0x), handover (1.0x), memory (1.0x). README files and skill-doc trees (`sk-*`, including `references/` and `assets/`) are excluded from memory indexing.
.opencode/skill/system-spec-kit/SKILL.md:774:**Budget allocator floors:** constitutional 700, codeGraph 1200, cocoIndex 900, triggered 400, overflow pool 800.
.opencode/skill/system-spec-kit/SKILL.md:972:| Constitutional    | `constitutional/`                                                          | Always-surface rules              |
.opencode/skill/system-spec-kit/constitutional/README.md:5:  - "constitutional memory"
.opencode/skill/system-spec-kit/constitutional/README.md:6:  - "always-surface rules"
.opencode/skill/system-spec-kit/constitutional/README.md:7:  - "constitutional tier"
.opencode/skill/system-spec-kit/constitutional/README.md:14:The constitutional tier is the highest importance level in the Spec Kit Memory system. Constitutional memories **always appear at the top of search results**, regardless of query relevance, ensuring critical rules and constraints are never forgotten or bypassed.
.opencode/skill/system-spec-kit/constitutional/README.md:26:- [6. CREATING CONSTITUTIONAL MEMORIES](#6--creating-constitutional-memories)
.opencode/skill/system-spec-kit/constitutional/README.md:40:### What is the constitutional/ Directory?
.opencode/skill/system-spec-kit/constitutional/README.md:42:The `constitutional/` directory contains memory files that are **always surfaced** at the top of every `memory_search()` result. These are operational rules, safety constraints and critical context that AI agents must always have access to, regardless of what they're searching for.
.opencode/skill/system-spec-kit/constitutional/README.md:44:Think of constitutional memories as the "system prompt" for your memory system: rules that apply globally and should never be forgotten.
.opencode/skill/system-spec-kit/constitutional/README.md:50:| Token Budget | ~2000 | Maximum tokens for constitutional memories per search |
.opencode/skill/system-spec-kit/constitutional/README.md:51:| Search Boost | 3.0x | Multiplier applied to constitutional results |
.opencode/skill/system-spec-kit/constitutional/README.md:70:| **constitutional** | 3.0x | No | Never | **Yes** |
.opencode/skill/system-spec-kit/constitutional/README.md:77:**Key Difference**: Only constitutional memories appear in EVERY search result. Other tiers only appear when relevant to the query.
.opencode/skill/system-spec-kit/constitutional/README.md:89:# 1. Navigate to constitutional directory
.opencode/skill/system-spec-kit/constitutional/README.md:90:cd .opencode/skill/system-spec-kit/constitutional/
.opencode/skill/system-spec-kit/constitutional/README.md:92:# 2. Create a new constitutional memory file
.opencode/skill/system-spec-kit/constitutional/README.md:103:importanceTier: constitutional
.opencode/skill/system-spec-kit/constitutional/README.md:118:# Check constitutional files exist
.opencode/skill/system-spec-kit/constitutional/README.md:119:ls .opencode/skill/system-spec-kit/constitutional/
.opencode/skill/system-spec-kit/constitutional/README.md:129:After creating a constitutional memory:
.opencode/skill/system-spec-kit/constitutional/README.md:132:2. **Run any search**: your constitutional memory will appear at the top
.opencode/skill/system-spec-kit/constitutional/README.md:145:constitutional/
.opencode/skill/system-spec-kit/constitutional/README.md:149:└── [your-rules].md        # Custom constitutional memories
.opencode/skill/system-spec-kit/constitutional/README.md:187:// 1. Fetches ALL constitutional memories first
.opencode/skill/system-spec-kit/constitutional/README.md:195:// To disable constitutional surfacing (rare):
.opencode/skill/system-spec-kit/constitutional/README.md:254:1. System calculates token count for each constitutional memory
.opencode/skill/system-spec-kit/constitutional/README.md:258:**Best Practice:** Keep individual constitutional memories concise. Split large rule sets into multiple focused files.
.opencode/skill/system-spec-kit/constitutional/README.md:269:Every constitutional memory file MUST have this frontmatter:
.opencode/skill/system-spec-kit/constitutional/README.md:274:importanceTier: constitutional       # Required: Must be "constitutional"
.opencode/skill/system-spec-kit/constitutional/README.md:287:| `importanceTier` | Yes | string | Must be `constitutional` |
.opencode/skill/system-spec-kit/constitutional/README.md:342:If yes to all, constitutional tier is appropriate.
.opencode/skill/system-spec-kit/constitutional/README.md:347:# Create file in constitutional directory
.opencode/skill/system-spec-kit/constitutional/README.md:348:touch .opencode/skill/system-spec-kit/constitutional/<rule-name>.md
.opencode/skill/system-spec-kit/constitutional/README.md:356:importanceTier: constitutional
.opencode/skill/system-spec-kit/constitutional/README.md:391:memory_save({ filePath: ".opencode/skill/system-spec-kit/constitutional/<rule-name>.md" })
.opencode/skill/system-spec-kit/constitutional/README.md:406:<!-- TEMPLATE: constitutional_memory.md v1.0 -->
.opencode/skill/system-spec-kit/constitutional/README.md:409:importanceTier: constitutional
.opencode/skill/system-spec-kit/constitutional/README.md:473:*Location: .opencode/skill/system-spec-kit/constitutional/*
.opencode/skill/system-spec-kit/constitutional/README.md:502:  filePath: ".opencode/skill/system-spec-kit/constitutional/gate-enforcement.md",
.opencode/skill/system-spec-kit/constitutional/README.md:509:1. **Edit the file** directly in the constitutional directory
.opencode/skill/system-spec-kit/constitutional/README.md:515:vim .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md
.opencode/skill/system-spec-kit/constitutional/README.md:528:importanceTier: constitutional
.opencode/skill/system-spec-kit/constitutional/README.md:556:For specific searches where you don't want constitutional memories:
.opencode/skill/system-spec-kit/constitutional/README.md:597:importanceTier: constitutional
.opencode/skill/system-spec-kit/constitutional/README.md:626:importanceTier: constitutional
.opencode/skill/system-spec-kit/constitutional/README.md:659:**Symptom:** Your constitutional memory doesn't appear in search results
.opencode/skill/system-spec-kit/constitutional/README.md:666:| Wrong `importanceTier` | Verify frontmatter has `importanceTier: constitutional` |
.opencode/skill/system-spec-kit/constitutional/README.md:684:**Symptom:** Some constitutional memories are truncated
.opencode/skill/system-spec-kit/constitutional/README.md:694:# Check constitutional files exist
.opencode/skill/system-spec-kit/constitutional/README.md:695:ls -la .opencode/skill/system-spec-kit/constitutional/
.opencode/skill/system-spec-kit/constitutional/README.md:698:head -20 .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md
.opencode/skill/system-spec-kit/constitutional/README.md:700:# Check database for constitutional memories
.opencode/skill/system-spec-kit/constitutional/README.md:702:  "SELECT id, title, importance_tier FROM memory_index WHERE importance_tier = 'constitutional';"
.opencode/skill/system-spec-kit/constitutional/README.md:737:| Gate Enforcement | `./gate-enforcement.md` | Default constitutional memory |
.opencode/skill/system-spec-kit/constitutional/README.md:763:Use constitutional tier for:
.opencode/skill/system-spec-kit/mcp_server/scripts/README.md:75:- Indexed scope follows current scan behavior, including memory, constitutional and spec-doc discovery defaults.
.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/03-feedback-driven-revalidation.md:29:Positive feedback triggers the auto-promotion path. `executeAutoPromotion()` only promotes upward, never demotes: `normal -> important` at 5 positive validations and `important -> critical` at 10 positive validations. The promotion check subtracts persisted negative-feedback events from total validations before deciding eligibility, excludes non-promotable tiers such as `critical`, `constitutional`, `temporary`, and `deprecated`, and rate-limits successful promotions to 3 within an 8-hour rolling window.
.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:3:importanceTier: constitutional
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:53:- `memory-index-alias.ts`, `memory-index-discovery.ts` - Alias conflict discovery, spec-doc discovery, and constitutional file detection.

codex
I’ve narrowed it down to the workflow surface now: Public already has explicit recovery commands, scoped memory tools, and always-surface constitutional rules, but those capabilities are spread across command families and orchestration layers. I’m checking one last piece of the compact-code-graph transport so I can state precisely whether Public’s compaction path carries memory guidance, structural state, or both.
exec
/bin/zsh -lc "nl -ba .opencode/plugins/spec-kit-compact-code-graph-bridge.mjs | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	#!/usr/bin/env node
     2	
     3	import { handleSessionResume } from '../skill/system-spec-kit/mcp_server/dist/handlers/session-resume.js';
     4	import * as vectorIndex from '../skill/system-spec-kit/mcp_server/dist/lib/search/vector-index.js';
     5	import * as sessionManager from '../skill/system-spec-kit/mcp_server/dist/lib/session/session-manager.js';
     6	
     7	function parseArgs(argv) {
     8	  const options = {
     9	    minimal: false,
    10	    specFolder: undefined,
    11	  };
    12	
    13	  for (let index = 0; index < argv.length; index += 1) {
    14	    const value = argv[index];
    15	    if (value === '--minimal') {
    16	      options.minimal = true;
    17	      continue;
    18	    }
    19	    if (value === '--spec-folder') {
    20	      const nextValue = argv[index + 1];
    21	      if (typeof nextValue === 'string' && nextValue.trim()) {
    22	        options.specFolder = nextValue.trim();
    23	        index += 1;
    24	      }
    25	    }
    26	  }
    27	
    28	  return options;
    29	}
    30	
    31	function ensureRuntimeReady() {
    32	  vectorIndex.initializeDb();
    33	  const database = vectorIndex.getDb();
    34	  if (!database) {
    35	    throw new Error('Database not initialized after initializeDb()');
    36	  }
    37	
    38	  const sessionInit = sessionManager.init(database);
    39	  if (!sessionInit.success) {
    40	    throw new Error(sessionInit.error || 'Session manager initialization failed');
    41	  }
    42	}
    43	
    44	async function withStdoutSilenced(fn) {
    45	  const forwarded = (method) => (...args) => {
    46	    const rendered = args
    47	      .map((value) => (typeof value === 'string' ? value : JSON.stringify(value)))
    48	      .join(' ');
    49	    process.stderr.write(`${rendered}\n`);
    50	  };
    51	
    52	  const original = {
    53	    log: console.log,
    54	    info: console.info,
    55	    debug: console.debug,
    56	    warn: console.warn,
    57	  };
    58	
    59	  console.log = forwarded('log');
    60	  console.info = forwarded('info');
    61	  console.debug = forwarded('debug');
    62	  console.warn = forwarded('warn');
    63	
    64	  try {
    65	    return await fn();
    66	  } finally {
    67	    console.log = original.log;
    68	    console.info = original.info;
    69	    console.debug = original.debug;
    70	    console.warn = original.warn;
    71	  }
    72	}
    73	
    74	async function main() {
    75	  const args = parseArgs(process.argv.slice(2));
    76	  const response = await withStdoutSilenced(async () => {
    77	    ensureRuntimeReady();
    78	    return await handleSessionResume({
    79	      ...(args.specFolder ? { specFolder: args.specFolder } : {}),
    80	      ...(args.minimal ? { minimal: true } : {}),
    81	    });
    82	  });
    83	
    84	  const text = response?.content?.[0]?.text;
    85	  if (typeof text !== 'string' || !text.trim()) {
    86	    throw new Error('Bridge did not receive a text response from handleSessionResume()');
    87	  }
    88	
    89	  process.stdout.write(text);
    90	}
    91	
    92	main().catch((error) => {
    93	  const message = error instanceof Error ? error.message : String(error);
    94	  process.stderr.write(`[spec-kit-compact-code-graph-bridge] ${message}\n`);
    95	  process.exitCode = 1;
    96	});

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/constitutional/README.md | sed -n '40,90p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    40	### What is the constitutional/ Directory?
    41	
    42	The `constitutional/` directory contains memory files that are **always surfaced** at the top of every `memory_search()` result. These are operational rules, safety constraints and critical context that AI agents must always have access to, regardless of what they're searching for.
    43	
    44	Think of constitutional memories as the "system prompt" for your memory system: rules that apply globally and should never be forgotten.
    45	
    46	### Key Statistics
    47	
    48	| Metric | Value | Description |
    49	|--------|-------|-------------|
    50	| Token Budget | ~2000 | Maximum tokens for constitutional memories per search |
    51	| Search Boost | 3.0x | Multiplier applied to constitutional results |
    52	| Decay | Never | Constitutional memories don't decay over time |
    53	| Auto-Expire | Never | Constitutional memories are permanent |
    54	| Trigger Latency | <50ms | Fast phrase matching for proactive surfacing |
    55	
    56	### Key Features
    57	
    58	| Feature | Description |
    59	|---------|-------------|
    60	| **Always Surfaces** | Included at top of every `memory_search` result by default |
    61	| **Fixed Similarity** | Returns `similarity: 100` regardless of query relevance |
    62	| **Response Flag** | `isConstitutional: true` in search results |
    63	| **Trigger Matching** | Fast phrase matching for proactive surfacing |
    64	| **ANCHOR Format** | Section-level retrieval (implemented in v1.7.2) |
    65	
    66	### How Constitutional Differs from Other Tiers
    67	
    68	| Tier | Search Boost | Decay | Auto-Expire | Always Surfaces |
    69	|------|--------------|-------|-------------|-----------------|
    70	| **constitutional** | 3.0x | No | Never | **Yes** |
    71	| critical | 2.0x | No | Never | No |
    72	| important | 1.5x | No | Never | No |
    73	| normal | 1.0x | Yes (90-day) | Never | No |
    74	| temporary | 0.5x | Yes (7-day) | 7 days | No |
    75	| deprecated | 0.0x | N/A | Manual | No |
    76	
    77	**Key Difference**: Only constitutional memories appear in EVERY search result. Other tiers only appear when relevant to the query.
    78	
    79	---
    80	
    81	<!-- /ANCHOR:overview -->
    82	
    83	## 2. QUICK START
    84	<!-- ANCHOR:quick-start -->
    85	
    86	### 30-Second Setup
    87	
    88	```bash
    89	# 1. Navigate to constitutional directory
    90	cd .opencode/skill/system-spec-kit/constitutional/

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '184,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   184	/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
   185	async function handleMemoryMatchTriggers(args: TriggerArgs): Promise<MCPResponse> {
   186	  const {
   187	    prompt,
   188	    limit: rawLimit = 3,
   189	    session_id: rawSessionId,
   190	    turnNumber: rawTurnNumber = 1,
   191	    include_cognitive: includeCognitive = true
   192	  } = args;
   193	
   194	  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
   195	  if (!prompt || typeof prompt !== 'string') {
   196	    return createMCPErrorResponse({
   197	      tool: 'memory_match_triggers',
   198	      error: 'prompt is required and must be a string',
   199	      code: 'E_VALIDATION',
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

exec
/bin/zsh -lc "rg -n \"compaction|Persistent Memory|memory_recall|memory_store|TransportBlock|payloadKind|structural\" .opencode/plugins/spec-kit-compact-code-graph-bridge.mjs .opencode/plugins/spec-kit-compact-code-graph.js .opencode/skill/system-spec-kit/mcp_server -g '"'!**/dist/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/plugins/spec-kit-compact-code-graph.js:59: *   payloadKind: string,
.opencode/plugins/spec-kit-compact-code-graph.js:62: * }} TransportBlock
.opencode/plugins/spec-kit-compact-code-graph.js:75: *   systemTransform?: TransportBlock,
.opencode/plugins/spec-kit-compact-code-graph.js:76: *   messagesTransform: TransportBlock[],
.opencode/plugins/spec-kit-compact-code-graph.js:77: *   compaction?: TransportBlock,
.opencode/plugins/spec-kit-compact-code-graph.js:406:      const block = plan?.compaction;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:322:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:343:  meta.structuralRoutingNudge = nudge;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:786:  lines.push('- If structural context shows "ready": code_graph_query is available for structural lookups');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:985:            existingHints.push('Tip: For code search queries, consider using mcp__cocoindex_code__search for semantic code search or code_graph_query for structural lookups.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1002:            const nudge = meta.structuralRoutingNudge
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1015:          // Response is not JSON envelope — skip structural nudge injection
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:17:**Graph as a first-class feature family.** The `SPECKIT_GRAPH_*` variables form a dedicated feature family (see [Section 6](#6-graph) and [Section 7](#7-graph-calibration)) controlling structural code graph indexing, graph-first routing in the search pipeline, causal graph traversal, and calibration profiles. Since graph-first routing is now the default query dispatch order (Code Graph -> CocoIndex -> Memory), the graph env vars are among the most impactful configuration levers.
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:96:| `SPECKIT_PARSER` | `treesitter` | string | Structural parser backend: `treesitter` (AST-accurate via WASM) or `regex` (lightweight fallback). | `lib/code-graph/structural-indexer.ts` |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:5:Complete installation and configuration guide for the Spec Kit Memory MCP server. This guide enables AI-powered context retrieval and conversation memory across your project. The system indexes markdown documentation from spec folders and constitutional rules to surface relevant information during AI interactions. It provides 43 tools covering semantic search, trigger-based memory surfacing, intent-aware context loading, causal relationship tracking, shared memory spaces, session learning, evaluation, validation, and bounded structural code-graph indexing.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:83:│    mcp_server/database/code-graph.sqlite   (structural graph)   │
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:89:│ Markdown     │ │ Causal Graph     │ │ Code Graph (structural)    │
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:114:| `.opencode/skill/system-spec-kit/mcp_server/database/code-graph.sqlite` | Default repo-local structural code-graph database used by the checked-in configs |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:167:No additional system dependencies are required beyond Node.js and npm. The Code Graph structural indexer uses `web-tree-sitter` (WASM-based tree-sitter) which is bundled as an npm dependency and does not require a native tree-sitter installation.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:432:- `code_graph_scan` (structural code indexing)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:433:- `code_graph_query` (structural relationship queries)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:440:Then verify the structural side too. Ask your AI assistant:
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:448:- the structural query returns a `readiness` block
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:791:| `code_graph_query` reports `full_scan` or `inline full scan skipped for read path` | The graph is empty or too stale for bounded read-path repair | Run `code_graph_scan`, then retry the structural read |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:792:| Startup or resume shows graph `stale` | Freshness-aware startup detected drift before a structural read ran | Run a structural read to allow bounded inline repair, or run `code_graph_scan` for broader stale states |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:153:        // S1: strip structural noise (frontmatter, anchors, HTML comments) before embedding
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:15:// Query-intent routing (Phase 020: structural/semantic/hybrid classification)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:187:  structuralRoutingNudge: StructuralRoutingNudgeMeta | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:306:  if (!queryIntentMetadata || queryIntentMetadata.queryIntent !== 'structural' || queryIntentMetadata.confidence <= 0.65) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:324:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:611:      // JSON parse failed — fall through to structural truncation
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1011:    structuralRoutingNudge,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1069:    structuralRoutingNudge,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1131:  // graph context for structural/hybrid queries. Entire block is
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1147:        routedBackend: classification.intent === 'structural' && classification.confidence > 0.65
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1148:          ? 'structural'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1169:      if (classification.intent === 'structural' && classification.confidence > 0.65) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1460:  const structuralRoutingNudge = buildStructuralRoutingNudge(
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1465:  if (structuralRoutingNudge) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1466:    responseData.structuralRoutingNudge = structuralRoutingNudge;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1480:      ...(structuralRoutingNudge ? [structuralRoutingNudge.message] : []),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1503:      structuralRoutingNudge,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:87:    return 'Dry-run detected structural template-contract violations';
.opencode/skill/system-spec-kit/mcp_server/README.md:70:| **Routing** | No routing | Graph-first structural routing: Code Graph -> CocoIndex -> Memory; 3-tier FTS fallback when graph/semantic miss |
.opencode/skill/system-spec-kit/mcp_server/README.md:238:**Graph-first routing** determines query dispatch order: structural queries route to the Code Graph first, then CocoIndex for semantic code discovery, then the 5-channel memory pipeline. This avoids forcing one search system to handle both structural relationships and semantic similarity.
.opencode/skill/system-spec-kit/mcp_server/README.md:266:**Stage 1 -- Gather candidates** using graph-first routing: structural queries dispatch to Code Graph first, then CocoIndex for semantic code discovery, then the memory pipeline's active channels in parallel. Constitutional-tier memories are always injected regardless of score.
.opencode/skill/system-spec-kit/mcp_server/README.md:404:**Semantic sufficiency gating** -- rejects memories too thin or lacking real evidence. Short documents with strong structural signals (clear title, proper labels) get an exception.
.opencode/skill/system-spec-kit/mcp_server/README.md:533:The code graph system provides structural code analysis via tree-sitter AST parsing and SQLite storage. It maps what connects to what in the codebase: function calls, imports, class hierarchy and containment.
.opencode/skill/system-spec-kit/mcp_server/README.md:535:**Architecture:** CocoIndex (semantic, external MCP) finds code by concept. Code Graph (structural, this server) maps imports, calls and hierarchy. Memory (session, this server) preserves decisions. The compact-merger combines all three under a 4000-token budget for compaction injection.
.opencode/skill/system-spec-kit/mcp_server/README.md:545:**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.
.opencode/skill/system-spec-kit/mcp_server/README.md:606:| `minimal` | boolean | Skip heavy memory context, return code graph, CocoIndex, structural context, hints, and optional session quality without the full memory payload |
.opencode/skill/system-spec-kit/mcp_server/README.md:612:Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.
.opencode/skill/system-spec-kit/mcp_server/README.md:1062:Query structural code relationships: `outline` (file symbols), `calls_from` and `calls_to` (call graph), `imports_from` and `imports_to` (dependency graph). Use this instead of Grep for structural queries. Supports multi-hop BFS traversal. Responses include a `readiness` block, and the handler may perform bounded inline selective reindex before answering when the graph is only lightly stale.
.opencode/skill/system-spec-kit/mcp_server/README.md:1077:Get LLM-oriented compact graph neighborhoods. Accepts CocoIndex search results as seeds for structural expansion. Modes: `neighborhood` (1-hop calls plus imports), `outline` (file symbols), `impact` (reverse callers). Responses include a `readiness` block, and the handler may perform bounded inline selective reindex before answering when the graph is only lightly stale.
.opencode/skill/system-spec-kit/mcp_server/README.md:1154:Scan workspace files and build the structural code graph index (functions, classes, imports, calls). Uses tree-sitter WASM for parsing with regex fallback. Supports incremental re-indexing via content hash. Use this explicitly when the graph is empty, when a read path reports `full_scan`, or when you want to rebuild more than the bounded inline refresh path will repair.
.opencode/skill/system-spec-kit/mcp_server/README.md:1227:├── hooks/                     # Session-start/compaction surfacing, mutation feedback, token-count sync
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:55:3. save-quality-gate -- Evaluate semantic/structural quality before persistence
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:47:  structuralContext?: StructuralBootstrapContract;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:102:  const structuralContext = buildStructuralBootstrapContract('session_health');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:122:  if (structuralContext.status === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:124:  } else if (structuralContext.status === 'missing') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:152:        key: 'structural-context',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:154:        content: structuralContext.summary,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:158:    summary: `Session health is ${status}; graph freshness is ${graphFreshness}; structural status is ${structuralContext.status}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:162:      trustState: trustStateFromStructuralStatus(structuralContext.status),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:164:      lastUpdated: structuralContext.provenance?.lastUpdated ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:183:    structuralContext,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:111:  structuralContext?: StructuralBootstrapContract;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:455:    // Graph status hints deferred to structural contract (Phase 027)
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:456:    // — structural context hints at lines 128-130 provide preferred recovery path
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:473:  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:477:  const structuralTrust = buildStructuralContextTrust(structuralContext);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:507:  const structuralCertainty: SharedPayloadCertainty = 'exact';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:549:      key: 'structural-context',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:551:      content: structuralContext.summary,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:553:      certainty: structuralCertainty,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:554:      structuralTrust,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:567:      { label: 'structural', certainty: structuralCertainty },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:572:      trustState: trustStateFromStructuralStatus(structuralContext.status),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:574:      lastUpdated: structuralContext.provenance?.lastUpdated ?? codeGraph.lastScan,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:588:    structuralContext,
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:251: * Starts with four additive structural checks, each worth 0.25 points, then
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:271: *   - `issues` — One entry per failed structural check.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:4:// MCP tool handler for code_graph_query — queries structural relationships.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:49:  structuralContext?: StructuralBootstrapContract & StructuralTrust;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:50:  structuralRoutingNudge?: {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:97:  structuralContext: StructuralBootstrapContract,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:109:  if (structuralContext.recommendedAction) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:110:    nextActions.add(structuralContext.recommendedAction);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:113:  if (structuralContext.status === 'ready') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:115:  } else if (structuralContext.status === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:136:  const structuralSection = payload.sections.find((section) =>
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:137:    section.key === 'structural-context' && section.structuralTrust,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:140:  return structuralSection?.structuralTrust ?? null;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:144:  structuralContext: StructuralBootstrapContract,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:145:): SessionBootstrapResult['structuralRoutingNudge'] | null {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:146:  if (structuralContext.status !== 'ready') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:196:  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:206:  const structuralRoutingNudge = buildStructuralRoutingNudge(structuralContext);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:207:  if (structuralRoutingNudge) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:208:    allHints.push(structuralRoutingNudge.message);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:222:  const structuralCertainty: SharedPayloadCertainty = 'exact';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:226:  const structuralSnapshotTrust = buildStructuralContextTrust(structuralContext);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:233:  const structuralContextWithTrust = attachStructuralTrustFields(
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:234:    structuralContext,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:235:    structuralSnapshotTrust,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:236:    { label: 'session_bootstrap structural context payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:277:      key: 'structural-context',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:279:      // This section carries trust derived from the local structural snapshot,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:281:      content: structuralContext.summary,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:283:      certainty: structuralCertainty,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:284:      structuralTrust: structuralSnapshotTrust,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:289:      content: buildNextActions(resumeData, healthData, structuralContext).join(' | '),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:302:      { label: 'structural', certainty: structuralCertainty },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:304:    ])}; structuralStatus=${structuralContext.status}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:308:      trustState: trustStateFromStructuralStatus(structuralContext.status),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:310:      lastUpdated: structuralContext.provenance?.lastUpdated ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:315:    graphFreshness: structuralContext.status === 'ready'
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:317:      : structuralContext.status === 'stale'
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:327:    structuralContext: structuralContextWithTrust,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:328:    ...(structuralRoutingNudge ? { structuralRoutingNudge } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:340:    nextActions: buildNextActions(resumeData, healthData, structuralContext),
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:44:- `code-graph/scan.ts` - `code_graph_scan`: index workspace files, build structural graph.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:45:- `code-graph/query.ts` - `code_graph_query`: query structural relationships (outline, calls, imports).
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:10:import { indexFiles } from '../../lib/code-graph/structural-indexer.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:3:MCP tool handlers for the structural code graph system.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:9:| `scan.ts` | `code_graph_scan` | Index workspace files, build structural graph |
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:10:| `query.ts` | `code_graph_query` | Query structural relationships (outline, calls, imports) |
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:43:  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:50:  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires query (string), concepts (array of 2-5 strings), or cursor (string) for continuation pagination. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. When implicit feedback logging is enabled, searches also emit shadow-only feedback signals such as search_shown and, for includeContent runs, result_cited. Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:625:  description: '[L7:Maintenance] Scan workspace files and build structural code graph index (functions, classes, imports, calls). Supports incremental re-indexing via content hash. Token Budget: 1000.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:640:  description: '[L6:Analysis] Query structural relationships: outline (file symbols), calls_from/calls_to (call graph), imports_from/imports_to (dependency graph), and blast_radius (reverse import impact). Use INSTEAD of Grep for structural queries (callers, imports, dependencies). Supports includeTransitive for multi-hop BFS traversal. Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:664:  description: '[L6:Analysis] Get LLM-oriented compact graph neighborhoods. Accepts CocoIndex search results as seeds — use CocoIndex (mcp__cocoindex_code__search) for semantic search first, then pass results here for structural expansion. Supports manual seeds (provider: manual) and graph seeds (provider: graph). Modes: neighborhood (1-hop calls+imports), outline (file symbols), impact (reverse callers). Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:747:      minimal: { type: 'boolean', description: 'When true, skip the heavy memory context call and return code-graph, CocoIndex, structural-context, hints, and session-quality fields without the full memory payload' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:756:  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:770:      structuralContext: { type: 'object', description: 'Structural bootstrap contract (status, summary, recommendedAction); omitted when code graph is unavailable', properties: { status: { type: 'string', enum: ['ready', 'stale', 'missing'] }, summary: { type: 'string' }, recommendedAction: { type: 'string' } } },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:772:      nextActions: { type: 'array', items: { type: 'string' }, description: 'Up to 3 recommended next actions derived from resume, health, and structural status' },
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1269:> **Purpose:** Enable seamless session recovery after context compaction, crashes, or breaks.
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:102:**Purpose**: Zero data loss on MCP server crash or context compaction.
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:72:  structuralContext?: StructuralBootstrapContract;
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:253:  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware'
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:368:  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware' = 'memory-aware'
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:471:    toolRoutingRules.push('structural queries (callers, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:476:  const structuralContext = buildStructuralBootstrapContract('auto-prime');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:480:    structuralContext,
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:626: * Fires at session compaction lifecycle points. Surfaces memories relevant
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:628: * across the compaction boundary.
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:656:  return autoSurfaceMemories(sessionContext.trim(), COMPACTION_TOKEN_BUDGET, 'compaction');
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:155:      content: 'Code graph index is empty. Run `code_graph_scan` to build structural context.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:169:      content: 'Code graph freshness is stale. The first structural read may refresh inline when safe; run `code_graph_scan` for broader stale states.',
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:35: * Single source of truth for structural context in startup/recovery flows.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:188:    routingParts.push('structural queries (callers, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:206: * Phase 027: Build a structural bootstrap contract for a given surface.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:238:      summary = 'Code graph available (structural context ready)';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:243:      summary = `Code graph: ${stats.totalFiles} files, ${stats.totalNodes} nodes (stale — structural reads may refresh inline or recommend code_graph_scan)`;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:245:      summary = 'Code graph data is stale — structural context may be outdated';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:248:    summary = 'No structural context available — code graph is empty or unavailable';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:253:    recommendedAction = 'Structural context available. Use code_graph_query for structural lookups.';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:255:    recommendedAction = 'Use a structural read to trigger bounded inline refresh when safe, or run code_graph_scan for broader stale states.';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:306: * @param graphFn - Optional graph search function for causal/structural retrieval.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1789: * PI-A2: Last-resort structural search against the memory_index table.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1794: * @returns Array of HybridSearchResult with source='structural'.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1796:function structuralSearch(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1800:    console.warn('[hybrid-search] db not initialized — returning empty structuralSearch results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1847:      source: 'structural',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2007:/** Tier-3 structural results are capped at this fraction of the top existing score. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2013: * Keep Tier 3 structural fallback scores below established Tier 1/2 confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2014: * Prevents structural placeholders from outranking stronger semantic/lexical hits.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2110: * TIER 3: structuralSearch (pure SQL last-resort)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2176:  const tier3Results = structuralSearch({ specFolder: options.specFolder, limit: options.limit });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2490:  structuralSearch,
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:228:  //   graphFreshness (0.20) — A stale code graph means structural queries return
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:7:/** Token budget for compaction context injection */
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:215:  // Build codeGraph input: active files + structural hints
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:149:        ? 'Recovered compact transcript lines were removed before fallback compaction cache assembly.'
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:150:        : 'No recovered compact transcript lines detected in fallback compaction cache assembly.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:163:        kind: 'compaction',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:170:        summary: 'Fallback compaction cache assembled from sanitized transcript tail',
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:26: * Compute structural freshness by augmenting an FSRS stability score
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:30: *   structural_freshness = fsrs_stability * graph_centrality_normalized
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:17:                key: 'structural-context',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:19:                content: 'resume structural context',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:22:                structuralTrust: {
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:61:    recommendedAction: 'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:97:      'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:103:  it('adds a structural hint when the bootstrap contract is stale', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:107:      recommendedAction: 'Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:114:    expect(parsed.data.structuralContext.status).toBe('stale');
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:116:      structuralContext: expect.objectContaining({ status: 'stale' }),
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:121:    expect(parsed.data.nextActions).toContain('Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:121:      content: 'Code graph index is empty. Run `code_graph_scan` to build structural context.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:135:      content: 'Code graph freshness is stale. The first structural read may refresh inline when safe; run `code_graph_scan` for broader stale states.',
.opencode/skill/system-spec-kit/mcp_server/database/README.md:3:description: "Runtime SQLite storage for memory, structural code graph, vectors, FTS, and coordination files."
.opencode/skill/system-spec-kit/mcp_server/database/README.md:74:- Empty or broadly stale structural states still require explicit `code_graph_scan` to rebuild the graph database.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:381:    // Cast through unknown: our local RerankDocument is structurally equivalent to
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:50:| **Save Quality Gate** | 3-layer pre-storage validation (structural, content quality scoring, semantic dedup). Behind `SPECKIT_SAVE_QUALITY_GATE` flag |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:60: save-quality-gate.ts # 3-layer pre-storage quality gate (structural, content, semantic dedup)
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:69:| `save-quality-gate.ts` | 3-layer pre-storage quality gate: structural validation, content quality scoring (title, triggers, length, anchors, metadata, signal density), and semantic dedup. Behind `SPECKIT_SAVE_QUALITY_GATE` flag with 14-day warn-only graduation period |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:173:| `validateStructural(params)` | Layer 1: structural validation |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:279:| Structural check | `validateStructural()` | Quick pre-save structural validation |
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:557: * - Depth bonus: normalizedDepth * 0.05 — rewards structurally deep nodes
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:10:// structural headings, extractive summaries, and heuristic questions that
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:147: * Extract markdown headings (## and ###) as structural surrogates.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:70:    structural: StructuralValidationResult;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:106:/** Minimum content length for structural validation */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:116:/** Minimum number of structural signals required for short-critical exception. */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:308: * When enabled, decision documents with sufficient structural signals may bypass
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:319: * REQ-D4-003: Count structural signals present in a document.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:342: *   3. At least SHORT_CRITICAL_MIN_STRUCTURAL_SIGNALS (2) structural signals present
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:383: * Layer 1: Validate structural requirements for a memory.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:392: * context_type documents that have >= 2 structural signals (title + specFolder + anchor).
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:771:        structural: { pass: true, reasons: [] },
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:799:  const structural = validateStructural({
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:806:  allReasons.push(...structural.reasons);
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:831:  const wouldReject = !structural.pass
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:850:      structural,
.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:131:| Depth bonus | `normalizedDepth * 0.05` | 0 to +0.05 | Rewards structurally deep nodes |
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:77:  structuralTrust?: never;
.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:46: * kept intentionally structural (duck-typed) so the retrieval-directives module
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:387: * When enabled: decision context_type documents with >= 2 structural signals
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:101: * the same structural depth for DAG-shaped coverage graphs.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:42:- **5-Channel Hybrid Search**: Vector (semantic) + BM25/FTS5 (lexical) + Graph (relationship-based) + Graph Structure (structural)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:310:| `fsrs.ts`                  | -      | TypeScript | Temporal-structural coherence: FSRS stability augmented with graph centrality |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:509:// 4. Graph-structure search (structural discovery)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:523:- If no structural graph channel: Vector + Lexical + Co-activation (3-channel fallback)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:662:The causal graph is condensed into strongly connected components, then longest-path depth is computed across the resulting DAG. Shortcut edges do not collapse deeper chains; cycle members share one bounded depth layer, and the final depth is normalized by the deepest reachable component chain (`maxDepth`). Score bonus: `normalizedDepth * 0.05` — rewards structurally deep nodes in the causal chain.
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:39: * Controls which parsing backend the structural indexer uses for code-graph
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:47: * Runtime: `lib/code-graph/structural-indexer.ts::getParser()`
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:693: * Returns null if missing, corrupt, or structurally invalid (graceful degradation).
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:79:- Purpose: Owns large-file chunk production and quality-based chunk thinning before indexing. It defines how anchor-tagged and structurally segmented content becomes retrieval-sized units.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:401:  - `save-quality-gate.ts` — multi-layer structural/content/semantic quality gate.
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:52:  // Opening and closing anchor tags — keep nothing (structural only)
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:59: * This catches structural markers not covered by stripAnchors(), e.g.:
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:201: *   2. Strip anchor markers        — structural noise
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:202: *   3. Strip remaining HTML comments — structural noise
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:237: * BM25 benefits from the same structural noise removal as the
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:63:  /** Spec 126: Document structural type (spec, plan, tasks, memory, etc.) */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:290:    // Document structural type.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:252:/** Parse JavaScript/TypeScript source for structural symbols */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:472:/** Parse Python source for structural symbols */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:586:/** Parse Bash source for structural symbols */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:701:      console.warn(`[structural-indexer] Tree-sitter init failed, falling back to regex: ${err instanceof Error ? err.message : String(err)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:996:/** Parse a single file and return structural analysis */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:1105:            console.warn(`[structural-indexer] Skipping large file (${(stat.size / 1024).toFixed(1)}KB > ${(maxSize / 1024).toFixed(1)}KB): ${fullPath}`);
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:32:    lastSpecFolder: 'system-spec-kit/024-compact-code-graph/027-opencode-structural-priming',
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:34:      text: 'Aligned structural bootstrap contract across auto-prime and session_* handlers.',
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:73:    expect(brief.startupSurface).toContain('- Note: this is a startup snapshot; later structural reads may differ if the repo state changed.');
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:109:    expect(brief.startupSurface).toContain('first structural read may refresh inline');
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:22:- [4. STRUCTURAL TRUST CONTRACT (006)](#4--structural-trust-contract-006)
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:170:<!-- ANCHOR:structural-trust-contract -->
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:172:Packet `006-structural-trust-axis-contract` adds a separate structural trust contract for structural payload sections. The contract lives in `lib/context/shared-payload.ts` and must be imported rather than redefined by follow-on packets.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:178:| `parserProvenance` | `ast`, `regex`, `heuristic`, `unknown` | Which parser or extraction family produced the structural signal |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:179:| `evidenceStatus` | `confirmed`, `probable`, `unverified`, `unknown` | How strong the structural evidence is |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:180:| `freshnessAuthority` | `live`, `cached`, `stale`, `unknown` | Whether the structural signal is current and authoritative |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:191:Bootstrap and resume remain the authority surfaces for structural context. Packet `006` only adds the shared trust contract beside packet `005`'s certainty contract; it does not create a new graph-only owner surface.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:193:<!-- /ANCHOR:structural-trust-contract -->
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:279:Packet `007-detector-provenance-and-regression-floor` treats frozen detector fixtures as a regression-integrity floor only. The acceptance criterion from research recommendation R6 is the governing boundary: Public must land frozen detector fixtures that fail on structural regressions, while follow-on task corpora for user-visible structural quality are defined separately.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:283:- Fixture success proves detector integrity for the covered regex or heuristic lanes only; it does not prove user-visible structural quality, routing quality, or graph-context usefulness.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:284:- Successor packets must keep floor tests separate from outcome evaluation. Do not cite detector-floor passes as evidence that broader structural context is now trustworthy.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:300:Packet `011-graph-payload-validator-and-trust-preservation` hardens emission boundaries that surface structural trust. The implementation remains additive to packet `006`: import `ParserProvenance`, `EvidenceStatus`, `FreshnessAuthority`, and the shared validation helpers from `lib/context/shared-payload.ts` instead of defining a graph-local contract.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:12:import { indexFiles } from './structural-indexer.js';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/index.ts:5:export * from './structural-indexer.js';
.opencode/skill/system-spec-kit/mcp_server/tests/short-critical-quality-gate.vitest.ts:165:  // ── Flag ON, contextType=decision, structural signal count ──
.opencode/skill/system-spec-kit/mcp_server/tests/short-critical-quality-gate.vitest.ts:167:  it('returns false when only 1 structural signal (title only)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/short-critical-quality-gate.vitest.ts:176:  it('returns false when only 1 structural signal (specFolder only)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/short-critical-quality-gate.vitest.ts:185:  it('returns false when 0 structural signals', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/short-critical-quality-gate.vitest.ts:223:  it('returns true when all 3 structural signals present', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/short-critical-quality-gate.vitest.ts:264:    // May still fail on other structural reasons but not content length
.opencode/skill/system-spec-kit/mcp_server/tests/short-critical-quality-gate.vitest.ts:284:  it('rejects short content for decision type with only 1 structural signal', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/short-critical-quality-gate.vitest.ts:298:  it('passes short content for decision type with 2 structural signals', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/short-critical-quality-gate.vitest.ts:310:  it('passes short content for decision type with 3 structural signals', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/short-critical-quality-gate.vitest.ts:322:  // ── Other structural checks remain enforced even with exception ──
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:46:  kind: 'structural' | 'implementation' | 'verification';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:111:  structuralNudge: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:116:    structuralNudge: variant === 'R4_only' || variant === 'R2+R3+R4_combined',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:139:  if (scenario.followUp.kind === 'structural') {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:140:    if (caps.structuralNudge && scenario.followUp.graphReady) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:157:  if (scenario.followUp.kind === 'structural') {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:220:  if (scenario.followUp.kind === 'structural') {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:221:    if (caps.structuralNudge && scenario.followUp.graphReady) {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:6:/** Node types extracted by the structural indexer */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:18:/** Honest graph-local detector provenance classes for structural indexing lanes. */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:31:/** Languages supported by the structural indexer */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:34:/** A structural symbol node extracted from source code */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:73:/** Configuration for the structural indexer */
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:988: * Validate lineage chains and active projections for structural drift.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:7:// structural-indexer.ts.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:15:import { detectorProvenanceFromParserBackend } from './structural-indexer.js';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:16:import { extractEdges, capturesToNodes, type RawCapture } from './structural-indexer.js';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:19:// F043: RawCapture is now imported from structural-indexer.ts (single source of truth)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:21:/** ParserAdapter interface — mirrors structural-indexer.ts:16-18 */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:602:// F043: capturesToNodes and RawCapture are now imported from structural-indexer.ts
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:3:Core implementation for the structural code graph system. Provides file parsing, SQLite storage, graph queries, CocoIndex bridge, budget allocation, and compaction merging.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:10:| `structural-indexer.ts` | Regex-based parser for JS/TS/Python/Bash (tree-sitter planned) |
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:16:| `compact-merger.ts` | 3-source merge (Memory + Code Graph + CocoIndex) for compaction |
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:23:- **Code Graph** (structural, this library): maps imports, calls, hierarchy
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:26:The compact-merger combines all three under a 4000-token budget for compaction injection.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:4:// Tracks files and symbols accessed during a session for compaction
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:5:// retrieval backend: structural (code graph) vs semantic
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:9:// routing between structural (code graph) and semantic backends.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:11:export type QueryIntent = 'structural' | 'semantic' | 'hybrid';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:16:  structuralScore: number;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:71:  // F035: Narrowed — require semantic noun after opener to avoid matching structural queries
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:112: * Classify a query's intent for routing between structural
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:120:    return { intent: 'hybrid', confidence: 0.5, structuralScore: 0, semanticScore: 0, matchedKeywords: [] };
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:124:  const structuralHits = countKeywordHits(tokens, STRUCTURAL_KEYWORDS);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:126:  const structuralPatterns = countPatternHits(query, STRUCTURAL_PATTERNS);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:130:  const structuralScore = structuralHits.count + structuralPatterns * 2;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:132:  const total = structuralScore + semanticScore;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:134:  const matchedKeywords = [...structuralHits.matched, ...semanticHits.matched];
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:138:    return { intent: 'hybrid', confidence: 0.5, structuralScore: 0, semanticScore: 0, matchedKeywords };
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:141:  const structuralRatio = structuralScore / total;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:150:  // Clear structural signal (>65% structural)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:151:  if (structuralRatio > 0.65) {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:153:      intent: 'structural',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:154:      confidence: computeConfidence(structuralRatio),
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:155:      structuralScore,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:166:      structuralScore,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:175:    confidence: 0.5 + Math.abs(structuralRatio - semanticRatio) * 0.3,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:176:    structuralScore,
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:51:    expect(plan.systemTransform?.content).toContain('later structural reads may differ if the repo state changed');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:53:    expect(plan.compaction?.hook).toBe('experimental.session.compacting');
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:5:// contracts to OpenCode-oriented startup, message, and compaction blocks.
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:17:export interface OpenCodeTransportBlock {
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:20:  payloadKind: SharedPayloadEnvelope['kind'];
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:35:  systemTransform?: OpenCodeTransportBlock;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:36:  messagesTransform: OpenCodeTransportBlock[];
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:37:  compaction?: OpenCodeTransportBlock;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:77:    'Note: this is a startup snapshot; later structural reads may differ if the repo state changed.',
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:87:  compactionPayload?: SharedPayloadEnvelope | null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:95:    args.compactionPayload?.kind,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:102:  const compactionPayload = args.compactionPayload ?? args.resumePayload ?? args.bootstrapPayload ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:120:          payloadKind: systemPayload.kind,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:133:      payloadKind: payload.kind,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:140:    ...(compactionPayload
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:142:        compaction: {
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:145:          payloadKind: compactionPayload.kind,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:146:          dedupeKey: `compaction:${compactionPayload.kind}`,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:148:            compactionPayload,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:149:            'Inject this as the continuity note across compaction. Keep it separate from current-turn retrieval.',
.opencode/skill/system-spec-kit/mcp_server/tests/copilot-hook-wiring.vitest.ts:32:    expect(output).toContain('Note: this is a startup snapshot; later structural reads may differ if the repo state changed.');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:4:// SQLite storage for structural code graph (nodes + edges).
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:113:      `(${describeLastScan(args.graphSummary.lastScan)}; first structural read may refresh inline)`,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:125:    '- Note: this is a startup snapshot; later structural reads may differ if the repo state changed.',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:157:      lines.push('Freshness: stale — first structural read may trigger bounded inline refresh or recommend code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:160:      lines.push('Orientation: use code graph highlights for structural entry points and call paths; use CocoIndex for semantic discovery when the symbol or file is still unknown.');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:203:      key: 'structural-context',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:230:        ? `Startup brief with ${graph.graphState} structural context and ${sessionContinuity ? 'session continuity' : 'no continuity notes'}`
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:231:        : `Startup brief without structural highlights (${graph.graphState})`,
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:15:// 7. structuralSearch (hybrid fallback Tier 3) respects specFolder
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:41:// Use importOriginal to keep init, structuralSearch, and other real exports.
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:107:import { structuralSearch, init } from '../lib/search/hybrid-search';
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:152:// -- In-memory DB helpers (for structuralSearch tests) ---------
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:488:// 7. structuralSearch (hybrid fallback Tier 3) — real DB tests
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:489:// These tests import the actual `structuralSearch` + `init`
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:493:describe('R9: structuralSearch (fallback Tier 3) respects specFolder', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:511:    const results = structuralSearch({ specFolder: 'specs/001-auth', limit: 10 });
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:518:    const results = structuralSearch({ limit: 10 });
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:527:    const results = structuralSearch({ specFolder: 'specs/999-nonexistent', limit: 10 });
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:534:    const scoped = structuralSearch({ specFolder: 'specs/001-auth', limit: 10 });
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:535:    const unscoped = structuralSearch({ limit: 10 });
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:5:// shared by startup, recovery, and compaction surfaces.
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:12:  | 'compaction';
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:148:  structuralTrust?: StructuralTrust;
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:408:  structuralContext: { status: string },
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:410:  if (structuralContext.status === 'ready') {
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:418:  if (structuralContext.status === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:438:  const structuralTrust = validateStructuralTrustPayload(trustPayload, options);
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:441:    ...structuralTrust,
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:557:      ...(section.structuralTrust
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:559:          structuralTrust: validateStructuralTrustPayload(section.structuralTrust, {
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:560:            label: `Shared payload section "${section.key}" structuralTrust`,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:5:// into a unified compact brief for compaction injection.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:192:      kind: 'compaction',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:208:        sourceSurface: 'compaction',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:68:    ? 'Code graph readiness is unified and structurally usable.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:70:      ? 'Code graph exists but needs refresh before structural trust is high.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:73:    ? 'Use code_graph_query for structural lookups and keep transport shells thin.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:75:      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:76:      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-scan.vitest.ts:30:vi.mock('../lib/code-graph/structural-indexer.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:246:      // Content with no title, no triggers, very short — should fail structural + quality
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:294:      expect(result.layers.structural.pass).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:514:      expect(qgResult.layers.structural.pass).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:106:    expect(contract.summary).toContain('No structural context');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:147:  it('keeps the structural contract within the documented hard ceiling', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:465:      // This is a structural test - the env var is read at module init
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:14:  describe('maps structural queries to structural intent', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:15:    it('what calls', () => { expect(classifyQueryIntent('what calls parseFile').intent).toBe('structural'); });
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:16:    it('what imports', () => { expect(classifyQueryIntent('what imports this module').intent).toBe('structural'); });
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:17:    it('show outline', () => { expect(classifyQueryIntent('show outline of this file').intent).toBe('structural'); });
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:18:    it('file structure', () => { expect(classifyQueryIntent('show structure of this file').intent).toBe('structural'); });
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:19:    it('what extends', () => { expect(classifyQueryIntent('what extends BaseClass').intent).toBe('structural'); });
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:36:  describe('structural queries map to structural intent', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:37:    it('what calls allocateBudget', () => { expect(classifyQueryIntent('what calls allocateBudget').intent).toBe('structural'); });
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:38:    it('show outline of session-prime.ts', () => { expect(classifyQueryIntent('show outline of session-prime.ts').intent).toBe('structural'); });
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:39:    it('what implements the RuntimeInfo interface', () => { expect(classifyQueryIntent('what implements the RuntimeInfo interface').intent).toBe('structural'); });
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:54:    it('WHAT CALLS parseFile → structural', () => { expect(classifyQueryIntent('WHAT CALLS parseFile').intent).toBe('structural'); });
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:15:  it('fires for the frozen structural task slice only when readiness and scaffolding are true', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:44:  it('does not fire for non-structural queries', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:67:  it('keeps startup priming generic instead of emitting a task-shaped structural routing hint', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:100:  it('threads the nudge into metadata for ready structural queries without changing the routed backend', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:149:    expect(parsed.meta.structuralRoutingNudge).toMatchObject({
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:153:    expect(parsed.data.queryIntentRouting.routedBackend).toBe('structural');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:154:    expect(parsed.data.structuralRoutingNudge.message).toContain('Prefer `code_graph_query`');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:155:    expect(parsed.hints).toContain(parsed.data.structuralRoutingNudge.message);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:207:    expect(parsed.meta.structuralRoutingNudge).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:208:    expect(parsed.data.structuralRoutingNudge).toBeUndefined();
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:235:                summary: 'Resume payload: structural=exact',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:237:                  key: 'structural-context',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:242:                  structuralTrust: {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:280:        recommendedAction: 'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:289:    expect(parsed.data.structuralRoutingNudge).toMatchObject({
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:293:    expect(parsed.data.hints).toContain(parsed.data.structuralRoutingNudge.message);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:295:      'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:298:    expect(parsed.data.nextActions).not.toContain(parsed.data.structuralRoutingNudge.message);
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts:15:} from '../lib/code-graph/structural-indexer.js';
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts:80:describe('structural-indexer', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:4:// Tests: Feature flag gating, tier progression, structuralSearch,
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:11:  structuralSearch,
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:142:   3. structuralSearch
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:145:describe('PI-A2: structuralSearch', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:167:    const results = structuralSearch({ limit: 10 });
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:179:    const results = structuralSearch({ specFolder: 'specs/auth', limit: 10 });
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:186:    const results = structuralSearch({ specFolder: 'specs/nonexistent', limit: 10 });
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:191:    const results = structuralSearch({ limit: 5 });
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:200:  it('T045-11: all results have source="structural"', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:201:    const results = structuralSearch({ limit: 10 });
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:202:    expect(results.every(r => r.source === 'structural')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:207:    const results = structuralSearch({ limit: 10 });
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:273:  it('T045-16: structuralSearch results include required HybridSearchResult fields', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:280:    const results = structuralSearch({ limit: 5 });
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:289:    expect(result.source).toBe('structural');
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:328:  it('T045-17c: tier-3 structural scores are calibrated below existing top score', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:330:    const structural = [
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:331:      { id: 100, score: 1.0, source: 'structural' } as HybridSearchResult,
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:332:      { id: 101, score: 0.95, source: 'structural' } as HybridSearchResult,
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:333:      { id: 102, score: 0.90, source: 'structural' } as HybridSearchResult,
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:334:      { id: 103, score: 0.85, source: 'structural' } as HybridSearchResult,
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:335:      { id: 104, score: 0.80, source: 'structural' } as HybridSearchResult,
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:336:      { id: 105, score: 0.75, source: 'structural' } as HybridSearchResult,
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:337:      { id: 106, score: 0.70, source: 'structural' } as HybridSearchResult,
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:338:      { id: 107, score: 0.65, source: 'structural' } as HybridSearchResult,
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:341:    const calibrated = __testables.calibrateTier3Scores(existing, structural);
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:376:  it('T045-17: structuralSearch is exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:377:    expect(typeof structuralSearch).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/tree-sitter-parser.vitest.ts:87:describe('structural-indexer tree-sitter readiness integration', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tree-sitter-parser.vitest.ts:107:    const { getParser } = await import('../lib/code-graph/structural-indexer.js');
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:49:// Mock structural-indexer to avoid real parsing
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:50:vi.mock('../lib/code-graph/structural-indexer.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:15:describe('structural trust axis contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:16:  it('exports the three structural trust axis vocabularies separately', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:30:    const structuralTrust = makeStructuralTrust({
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:40:        key: 'structural-context',
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:44:        structuralTrust,
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:56:    expect(payload.sections[0]?.structuralTrust).toEqual({
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:61:    expect(isStructuralTrustComplete(payload.sections[0]?.structuralTrust)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:62:    expect(Object.keys(payload.sections[0]?.structuralTrust ?? {})).toEqual([
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:78:  it('keeps ranking confidence separate from structural trust axes', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:97:    expect(firstConfidence?.confidence).not.toHaveProperty('structuralTrust');
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-extractor.vitest.ts:20:      a compaction cycle. The compaction cycle moves live objects to reduce
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1123:    it('T000g: memory_context resume mode invokes TM-05 compaction hook at runtime', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:117:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:133:    const structuralSection = parsed.data.payloadContract.sections.find(
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:134:      (section: { key: string }) => section.key === 'structural-context',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:140:    expect(parsed.data.payloadContract.summary).toContain('structural=exact');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:145:      'structural-context': 'exact',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:173:                summary: 'Resume payload: structural=exact',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:175:                  key: 'structural-context',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:180:                  structuralTrust: {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:218:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:234:    const structuralSection = parsed.data.payloadContract.sections.find(
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:235:      (section: { key: string }) => section.key === 'structural-context',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:240:    expect(parsed.data.payloadContract.summary).toContain('structural=exact');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:245:      'structural-context': 'exact',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:248:    expect(structuralSection?.structuralTrust).toEqual({
.opencode/skill/system-spec-kit/mcp_server/tests/quality-gate-exception.vitest.ts:94:  it('rejects non-decision content even when two structural signals are present', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/quality-gate-exception.vitest.ts:115:  it('rejects short decisions with fewer than two structural signals', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/quality-gate-exception.vitest.ts:172:    expect(result.layers.structural.reasons.some((reason) => reason.includes('Content too short'))).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts:10:    codeGraph: 'function parseFile in structural-indexer.ts:150',
.opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts:12:    triggered: 'Trigger: compaction recovery context',
.opencode/skill/system-spec-kit/mcp_server/tests/compact-merger.vitest.ts:45:      expect(result.payloadContract.kind).toBe('compaction');
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:12:  describe('structural queries', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:13:    it('classifies "who calls handleSave" as structural', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:15:      expect(result.intent).toBe('structural');
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:16:      expect(result.structuralScore).toBeGreaterThan(result.semanticScore);
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:20:    it('classifies "show callers of indexFiles" as structural', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:22:      expect(result.intent).toBe('structural');
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:25:    it('classifies "what imports this module" as structural', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:27:      expect(result.intent).toBe('structural');
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:30:    it('classifies "class hierarchy of BaseHandler" as structural', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:32:      expect(result.intent).toBe('structural');
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:40:      expect(result.semanticScore).toBeGreaterThan(result.structuralScore);
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:65:      expect(['structural', 'semantic', 'hybrid']).toContain(result.intent);
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:68:      expect(typeof result.structuralScore).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:88:    it('handles single structural keyword', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:90:      expect(result.intent).toBe('structural');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:151:  it('keeps structural snapshot trust off the errored resume payload while preserving it on structural context', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:175:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:184:    const structuralSection = parsed.data.payloadContract.sections.find(
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:185:      (section: { key: string }) => section.key === 'structural-context',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:192:    expect(parsed.data.structuralContext).toMatchObject({
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:197:    expect(structuralSection?.structuralTrust).toEqual({
.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:198:        title: null, // Will fail structural
.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:269:    it('L1-1: Valid memory passes structural validation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:750:    it('UG3: Gate ON, structural failure rejects', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:762:      expect(result.layers.structural.pass).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:29:          payloadKind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:36:          payloadKind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:40:        compaction: {
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:43:          payloadKind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:44:          dedupeKey: 'compaction:resume',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:45:          content: 'Summary: compaction note',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:164:  it('adds a compaction note and invalidates cache on session events', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:189:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:199:      (section: { key: string }) => section.key === 'structural-context',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:202:    expect(resumeStructuralSection?.structuralTrust).toEqual({
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:211:    const structuralSection = parsed.data.payloadContract.sections.find(
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:212:      (section: { key: string }) => section.key === 'structural-context',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:220:    expect(parsed.data.structuralContext).toMatchObject({
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:225:    expect(structuralSection?.structuralTrust).toEqual({
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:243:      'This entry is long enough to satisfy the structural checks without issue.',
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:4:// - autoSurfaceAtCompaction:   fires at session compaction lifecycle point
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:300:  it('fires matcher once at tool-dispatch and once at compaction lifecycle points', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:305:    await autoSurfaceAtCompaction('compaction lifecycle context');
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:309:    expect(matchSpy).toHaveBeenNthCalledWith(2, 'compaction lifecycle context', 5);
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:569:  it('compaction hook also enforces result limit via matchTriggerPhrases', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:609:  it('compaction output boundary enforces estimated token budget', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:622:    const result = await autoSurfaceAtCompaction('compaction context for budget enforcement');
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:698:    await autoSurfaceAtCompaction('compaction session context');
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:743:describe('compaction pipeline integration', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:86:      'Decided to enforce template contract validation after sufficiency checks so that structurally valid but semantically empty memories are caught early without incurring template validation overhead.',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:857:  it('structural validation fails with empty title', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:868:  it('structural validation fails with invalid spec folder format', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:534:      // Endpoints still receive a smaller walk bonus and preserve ordering by structural depth.

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/README.md | sed -n '228,246p;530,548p;600,616p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts | sed -n '1,90p;150,190p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   228	
   229	| Channel | How It Works | Good For |
   230	|---------|-------------|----------|
   231	| **Vector** | Compares the meaning of your query against stored embeddings | Finding related content even when the words are different |
   232	| **FTS5** | Full-text search on exact words and phrases | Looking up specific terms or error messages |
   233	| **BM25** | Keyword relevance scoring (like a search engine) | Ranking results when you know roughly what you want |
   234	| **Causal Graph** | Follows causal links between memories | "Why did we choose this?" questions |
   235	| **Degree** | Scores memories by graph connectivity, weighted by edge type (`caused`=1.0, `enabled`=0.75, `supports`=0.5) | Finding important hub memories (capped to prevent over-influence) |
   236	| **CocoIndex** *(bridge)* | Semantic code search via vector embeddings across source files | Finding code implementations when memory channels miss; concept-first code discovery |
   237	
   238	**Graph-first routing** determines query dispatch order: structural queries route to the Code Graph first, then CocoIndex for semantic code discovery, then the 5-channel memory pipeline. This avoids forcing one search system to handle both structural relationships and semantic similarity.
   239	
   240	**Reciprocal Rank Fusion (RRF)** combines all channel results using the formula `1/(K + rank)`. The K parameter is tuned per query intent through sensitivity analysis across K values {10, 20, 40, 60, 80, 100, 120}. A memory that scores well in multiple channels rises to the top because RRF gives exponential weight to high-ranking items while still including lower-ranked contributions.
   241	
   242	**Channel min-representation** guarantees every active channel gets at least one result in the final set, preventing a single dominant channel from drowning out useful evidence.
   243	
   244	**Quality-aware 3-tier fallback** activates when graph and semantic channels miss:
   245	
   246	| Fallback Tier | Channel | When It Kicks In |
   530	
   531	#### 3.1.13 CODE GRAPH
   532	
   533	The code graph system provides structural code analysis via tree-sitter AST parsing and SQLite storage. It maps what connects to what in the codebase: function calls, imports, class hierarchy and containment.
   534	
   535	**Architecture:** CocoIndex (semantic, external MCP) finds code by concept. Code Graph (structural, this server) maps imports, calls and hierarchy. Memory (session, this server) preserves decisions. The compact-merger combines all three under a 4000-token budget for compaction injection.
   536	
   537	**Parser:** Tree-sitter WASM is the default parser (JS/TS/Python/Shell). Set `SPECKIT_PARSER=regex` for regex fallback.
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

 succeeded in 0ms:
     1	import { beforeEach, describe, expect, it, vi } from 'vitest';
     2	
     3	const mockedBridge = vi.hoisted(() => ({
     4	  execFile: vi.fn(),
     5	}));
     6	
     7	vi.mock('node:child_process', () => ({
     8	  execFile: mockedBridge.execFile,
     9	}));
    10	
    11	import SpecKitCompactCodeGraphPlugin from '../../../../plugins/spec-kit-compact-code-graph.js';
    12	
    13	function buildBridgeResponse() {
    14	  return JSON.stringify({
    15	    status: 'ok',
    16	    data: {
    17	      opencodeTransport: {
    18	        interfaceVersion: '1.0',
    19	        transportOnly: true,
    20	        retrievalPolicyOwner: 'runtime',
    21	        event: {
    22	          hook: 'event',
    23	          trackedPayloadKinds: ['resume'],
    24	          summary: 'Track OpenCode routing hints',
    25	        },
    26	        systemTransform: {
    27	          hook: 'experimental.chat.system.transform',
    28	          title: 'OpenCode Startup Digest',
    29	          payloadKind: 'resume',
    30	          dedupeKey: 'system:resume',
    31	          content: 'Summary: resume summary',
    32	        },
    33	        messagesTransform: [{
    34	          hook: 'experimental.chat.messages.transform',
    35	          title: 'OpenCode Retrieved Context',
    36	          payloadKind: 'resume',
    37	          dedupeKey: 'messages:resume:0',
    38	          content: 'Summary: retrieved context',
    39	        }],
    40	        compaction: {
    41	          hook: 'experimental.session.compacting',
    42	          title: 'OpenCode Compaction Resume Note',
    43	          payloadKind: 'resume',
    44	          dedupeKey: 'compaction:resume',
    45	          content: 'Summary: compaction note',
    46	        },
    47	      },
    48	    },
    49	  });
    50	}
    51	
    52	function mockBridgeSuccess(stdout = buildBridgeResponse()) {
    53	  mockedBridge.execFile.mockImplementation((_file, _args, _options, callback) => {
    54	    callback(null, stdout, '');
    55	  });
    56	}
    57	
    58	function makeMessage(sessionID: string, messageID: string) {
    59	  return {
    60	    info: {
    61	      id: messageID,
    62	      sessionID,
    63	    },
    64	    parts: [],
    65	  };
    66	}
    67	
    68	describe('Spec Kit compact code graph plugin', () => {
    69	  beforeEach(() => {
    70	    vi.clearAllMocks();
    71	    mockBridgeSuccess();
    72	  });
    73	
    74	  it('injects the startup digest into the system prompt once per cache window', async () => {
    75	    const hooks = await SpecKitCompactCodeGraphPlugin({ directory: process.cwd() }, { cacheTtlMs: 5000 });
    76	    const output = { system: [] as string[] };
    77	
    78	    await hooks['experimental.chat.system.transform']?.(
    79	      { sessionID: 's1', model: { id: 'test-model' } as never },
    80	      output,
    81	    );
    82	    await hooks['experimental.chat.system.transform']?.(
    83	      { sessionID: 's1', model: { id: 'test-model' } as never },
    84	      output,
    85	    );
    86	
    87	    expect(mockedBridge.execFile).toHaveBeenCalledTimes(1);
    88	    expect(mockedBridge.execFile).toHaveBeenCalledWith(
    89	      'node',
    90	      expect.arrayContaining([
   150	            metadata: {},
   151	            time: { start: 1, end: 2 },
   152	          },
   153	        }],
   154	      }],
   155	    };
   156	
   157	    await hooks['experimental.chat.messages.transform']?.({}, output as never);
   158	
   159	    expect(mockedBridge.execFile).not.toHaveBeenCalled();
   160	    expect(output.messages[0].parts).toHaveLength(1);
   161	    expect(output.messages[0].parts[0]).toMatchObject({ type: 'tool' });
   162	  });
   163	
   164	  it('adds a compaction note and invalidates cache on session events', async () => {
   165	    const hooks = await SpecKitCompactCodeGraphPlugin({ directory: process.cwd() }, { cacheTtlMs: 5000 });
   166	    const output = { context: [] as string[] };
   167	
   168	    await hooks['experimental.session.compacting']?.({ sessionID: 's3' }, output);
   169	    await hooks['experimental.session.compacting']?.({ sessionID: 's3' }, output);
   170	
   171	    expect(mockedBridge.execFile).toHaveBeenCalledTimes(1);
   172	    expect(output.context).toHaveLength(1);
   173	    expect(output.context[0]).toContain('OpenCode Compaction Resume Note');
   174	
   175	    await hooks.event?.({
   176	      event: {
   177	        type: 'session.updated',
   178	        properties: {
   179	          info: {
   180	            id: 's3',
   181	          },
   182	        },
   183	      } as never,
   184	    });
   185	
   186	    await hooks['experimental.session.compacting']?.({ sessionID: 's3' }, { context: [] });
   187	    expect(mockedBridge.execFile).toHaveBeenCalledTimes(2);
   188	  });
   189	
   190	  it('exposes a status tool for plugin diagnostics', async () => {

exec
/bin/zsh -lc "nl -ba .opencode/command/memory/README.txt | sed -n '130,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   130	
   131	No `assets/` folder exists for memory commands. Workflows are defined inline within each command file.
   132	
   133	<!-- /ANCHOR:structure -->
   134	
   135	---
   136	
   137	<!-- ANCHOR:usage-examples -->
   138	## 4. USAGE EXAMPLES
   139	
   140	```bash
   141	# Save context to a spec folder
   142	/memory:save specs/007-feature-name
   143	
   144	# Retrieve context with auto-detected intent
   145	/memory:search "how does the auth system work"
   146	
   147	# Retrieve context with explicit intent
   148	/memory:search "auth flow" --intent:fix_bug
   149	
   150	# Recover from a crashed or interrupted session
   151	/spec_kit:resume
   152	
   153	# Auto-recovery mode
   154	/spec_kit:resume :auto
   155	
   156	# Create a constitutional memory (always-surface rule)
   157	/memory:learn "Never commit API keys or secrets to git"
   158	
   159	# List all constitutional memories and budget
   160	/memory:learn list
   161	
   162	# Check token budget status
   163	/memory:learn budget
   164	
   165	# View database stats
   166	/memory:manage stats
   167	
   168	# Scan for new memory files
   169	/memory:manage scan
   170	
   171	# Force re-index all files
   172	/memory:manage scan --force
   173	
   174	# Check system health
   175	/memory:manage health
   176	
   177	# View learning history for a spec folder
   178	/memory:search history specs/007-auth
   179	
   180	# Capture epistemic baseline before a task

exec
/bin/zsh -lc 'rg -n "session_bootstrap|session_resume|memory_context|memory_search|memory_match_triggers|CocoIndex|code_graph" .opencode/command/spec_kit/resume.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
4:allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, memory_context, memory_search, memory_match_triggers, memory_list, memory_stats, memory_delete, memory_update, memory_validate, memory_index_scan, memory_health, checkpoint_create, checkpoint_list, checkpoint_restore, checkpoint_delete, mcp__cocoindex_code__search
252:2. `memory_match_triggers()` — fast phrase matching (<50ms)
253:3. `memory_context()` — L1 unified retrieval (score > 0.6)
259:2. `session_bootstrap()` or `memory_context({ mode: "resume", profile: "resume" })` → primary interrupted-session recovery path
261:4. `memory_search()` with resume anchors → fallback when the summary is thin
276:| Current phase or task | Orient the user immediately | `handover.md`, `tasks.md` | `session_bootstrap()` or `memory_context({ mode: "resume", profile: "resume" })` |
277:| Last confirmed action | Prevent duplicate work | `handover.md`, recent memory | `memory_search()` with `state` anchor |
278:| Next safe action | Make the resume actually useful | `session_bootstrap()` or `memory_context({ mode: "resume", profile: "resume" })` | `memory_search()` with `next-steps` anchor |
279:| Blockers or "none" | Avoid unsafe continuation | `session_bootstrap()` or `memory_context({ mode: "resume", profile: "resume" })` | `memory_search()` with `blockers` or `summary` anchor |
291:2. Missing next safe action: use `session_bootstrap()` or `memory_context({ mode: "resume", profile: "resume" })`, then targeted `memory_search()` on `next-steps` and `state`.
304:Confidence: [high|medium|low] | Source: [handover|memory_context|continue_session|combined]
335:| `memory_search`         | Find/load context (includeContent: true)|
336:| `memory_match_triggers` | Fast trigger phrase matching (<50ms)   |
354:**Note:** No `memory_load` tool. Use `session_bootstrap()` as the canonical first recovery call, or `memory_context({ mode: "resume", profile: "resume" })` when you want the direct resume-retrieval primitive. In the current handler, resume mode is effectively a focused recovery search over the anchors `state`, `next-steps`, `summary`, and `blockers`; use `memory_search` with `includeContent: true` only when one of those essential signals is still missing.
359:- handover.md takes priority; if it is absent or thin, use `session_bootstrap()` or `memory_context({ mode: "resume", profile: "resume" })` before checking `CONTINUE_SESSION.md`

exec
/bin/zsh -lc "nl -ba .opencode/command/spec_kit/resume.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	description: Resume or recover work on an existing spec folder - smart memory recovery, crash breadcrumbs, and one clear next step
     3	argument-hint: "[spec-folder-path] [:auto|:confirm] [--phase-folder=<path>]"
     4	allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, memory_context, memory_search, memory_match_triggers, memory_list, memory_stats, memory_delete, memory_update, memory_validate, memory_index_scan, memory_health, checkpoint_create, checkpoint_list, checkpoint_restore, checkpoint_delete, mcp__cocoindex_code__search
     5	---
     6	
     7	> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
     8	>
     9	> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
    10	>
    11	> **YOUR FIRST ACTION:**
    12	> 1. Determine execution mode from user input (`:auto` or `:confirm`)
    13	> 2. Load the corresponding YAML file from `assets/`:
    14	>    - Auto mode → `spec_kit_resume_auto.yaml`
    15	>    - Confirm mode → `spec_kit_resume_confirm.yaml`
    16	> 3. Execute the YAML workflow step by step
    17	>
    18	> All content below defines workflow context for the YAML runner. Treat it as executable only when running this command workflow; otherwise use it as reference.
    19	
    20	## CONSTRAINTS
    21	
    22	- **DO NOT** dispatch any agent from this document
    23	- **ALL** agent dispatching is handled by the YAML workflow steps — this document is setup + reference only
    24	- **FIRST ACTION** is always: load the YAML file, then execute it step by step
    25	
    26	> **Format:** `/spec_kit:resume [spec-folder-path] [:auto|:confirm]`
    27	> Examples: `/spec_kit:resume specs/007-feature/` | `/spec_kit:resume:auto specs/007-feature/`
    28	
    29	# SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION
    30	
    31	This workflow gathers ALL inputs in ONE prompt. Mode defaults to INTERACTIVE unless :auto suffix used.
    32	
    33	> **Gate 3 Note:** Resume inherently satisfies Gate 3 — it REQUIRES a spec folder (provided or detected).
    34	
    35	---
    36	
    37	## 0. UNIFIED SETUP PHASE
    38	
    39	**FIRST MESSAGE PROTOCOL**: This prompt MUST be your FIRST response. No implementation or file-modifying tool calls before asking. Lightweight read-only discovery is allowed, then ask ALL questions immediately and wait.
    40	
    41	**STATUS: BLOCKED**
    42	
    43	```
    44	EXECUTE THIS SINGLE CONSOLIDATED PROMPT:
    45	
    46	1. CHECK mode suffix:
    47	   ├─ ":auto"    → execution_mode = "AUTONOMOUS"
    48	   ├─ ":confirm" → execution_mode = "INTERACTIVE"
    49	   └─ No suffix  → execution_mode = "INTERACTIVE" (default - safer)
    50	
    51	2. CHECK $ARGUMENTS for spec folder path:
    52	   ├─ Has path → validate path exists
    53	   └─ Empty → auto-detect from deterministic filtered candidates
    54	
    55	3. Auto-detect if needed:
    56	   - Build candidates from session-learning + known spec roots (`specs/`, `.opencode/specs/`)
    57	   - Normalize aliases, filter archive/test/fixture/scratch, then rank deterministically
    58	   - Low confidence: confirm in interactive mode; non-interactive safely falls through
    59	   - Found → spec_path = extracted, detection_method = "ranked"
    60	   - Not found → detection_method = "none" (include Q0)
    61	
    62	3b. CHECK --phase-folder flag OR detect phase parent:
    63	   - IF --phase-folder=<path> provided → auto-resolve spec_path to that child folder
    64	     Set spec_path = <path>, detection_method = "phase-folder"
    65	     Validate path matches pattern: `{specs|.opencode/specs}/[###]-*/[0-9][0-9][0-9]-*/`
    66	   - IF spec_path is a parent phase folder (contains numbered child folders like 001-*, 002-*):
    67	     List child phases with completion status:
    68	       $ ls -d [spec_path]/[0-9][0-9][0-9]-*/ 2>/dev/null
    69	     For each child: check tasks.md completion %, show status (not started / in progress / complete)
    70	     Present phase selection to user so they can choose which phase to resume
    71	   - ELSE → continue normally
    72	
    73	4. Check for "CONTINUATION - Attempt" handoff pattern in recent messages:
    74	   - Detected → continuation_detected = TRUE, parse Last/Next
    75	   - Not detected → continuation_detected = FALSE
    76	
    77	4b. Check for CONTINUE_SESSION.md crash recovery:
    78	    - Exists in spec folder AND modified <24h → crash_recovery_available = TRUE
    79	    - Parse spec folder, Last, Next values (fallback for unexpected termination)
    80	
    81	5. Validate artifacts in spec folder:
    82	   - Check: spec.md, plan.md, tasks.md
    83	   - Store: artifacts_valid = [yes/partial/no]
    84	
    85	6. Check memory files:
    86	   - $ ls [spec_path]/memory/*.{md,txt} 2>/dev/null
    87	   - Store: memory_files_exist = [yes/no], memory_count = [N]
    88	
    89	7. ASK with SINGLE prompt (include only applicable questions):
    90	
    91	   Q0. Spec Folder (if not detected/provided):
    92	     No active session detected. Available spec folders: [list]
    93	     A) List and select  B) Start new with /spec_kit:complete  C) Cancel
    94	     E) Phase folder — resume a specific phase child (e.g., specs/NNN-name/001-phase/)
    95	
    96	   Q1. Confirm Detected Session (if auto-detected):
    97	     Detected: [spec_path] (last activity: [date])
    98	     A) Yes, resume  B) Select different folder  C) Cancel
    99	
   100	   Q2. Continuation Validation (if handoff pattern with mismatch):
   101	     Handoff claims: Last=[X], Next=[Y] | Memory shows: Last=[A], Next=[B]
   102	     A) Use handoff claims  B) Use memory state  C) Investigate first
   103	
   104	   Q3. Missing Artifacts (if artifacts_valid != yes):
   105	     Missing: [list]
   106	     A) Run /spec_kit:plan  B) Select different folder  C) Continue anyway
   107	
   108	   Q4. Smart Memory Preference (if memory files exist):
   109	     Found [N] file(s) in [spec_path]/memory/
   110	     A) Fast resume - just enough context to continue safely
   111	     B) Fill missing next step / blockers
   112	     C) Deep context - load up to 3 recent files
   113	     D) Skip extra memory and use artifacts only
   114	
   115	   Reply format: "A, A" or "A, A, B"
   116	
   117	8. WAIT for user response (DO NOT PROCEED)
   118	
   119	9. Parse response and store ALL results:
   120	   - spec_path = [from Q0/Q1 or auto-detected or $ARGUMENTS]
   121	   - detection_method = [provided/recent]
   122	   - execution_mode = [AUTONOMOUS/INTERACTIVE from suffix]
   123	   - continuation_choice = [from Q2, or N/A]
   124	   - artifacts_valid = [yes/partial/no]
   125	   - memory_choice = [A/B/C from Q4, or N/A]
   126	
   127	10. Execute background operations:
   128	    - IF memory_choice == A: Recover only the default resume packet
   129	    - IF memory_choice == B: Run targeted gap-filling for next step / blockers
   130	    - IF memory_choice == C: Load up to 3 recent memory files
   131	    - IF memory_choice == D: Use artifacts only
   132	    - Calculate progress from tasks.md/checklist.md
   133	
   134	11. SET STATUS: PASSED
   135	
   136	STOP HERE - Wait for user answers before continuing.
   137	
   138	⛔ DO NOT proceed until user explicitly answers
   139	⛔ NEVER assume spec folder without confirmation when path was invalid
   140	⛔ NEVER split questions into multiple prompts
   141	```
   142	
   143	**Phase Output:**
   144	- `spec_path` | `detection_method` | `execution_mode`
   145	- `artifacts_valid` | `memory_loaded`
   146	
   147	---
   148	
   149	## 2. PHASE STATUS VERIFICATION (BLOCKING)
   150	
   151	| FIELD            | REQUIRED      | SOURCE                        |
   152	| ---------------- | ------------- | ----------------------------- |
   153	| spec_path        | Yes           | Q0/Q1 or auto-detect or $ARGS |
   154	| detection_method | Yes           | Auto-determined               |
   155	| execution_mode   | Yes           | Suffix (defaults INTERACTIVE) |
   156	| artifacts_valid  | Yes           | Validation check              |
   157	| memory_loaded    | Conditional   | Q4 (if memory files exist)    |
   158	
   159	ALL required fields set? → Proceed to workflow | Missing? → Re-prompt for missing only
   160	
   161	---
   162	
   163	## 3. VIOLATION SELF-DETECTION (BLOCKING)
   164	
   165	**You are in violation if you:** started workflow before fields set, asked questions in multiple prompts, proceeded without validating artifacts, assumed spec folder without confirmation, didn't display progress, claimed "resumed" without continuation options.
   166	
   167	**Recovery:** STOP → state violation → present consolidated prompt → WAIT → resume after all fields set.
   168	
   169	---
   170	
   171	# WORKFLOW EXECUTION
   172	
   173	Execute steps IN ORDER. Mark each ✅ ONLY after completing ALL activities and verifying outputs.
   174	
   175	---
   176	
   177	## 4. AUTO MODE (4 STEPS)
   178	
   179	| STEP | NAME               | REQUIRED OUTPUT      | VERIFICATION            |
   180	| ---- | ------------------ | -------------------- | ----------------------- |
   181	| 1    | Session Detection  | spec_path confirmed  | Path validated          |
   182	| 2    | Load Memory        | context_loaded       | Recovery packet loaded  |
   183	| 3    | Calculate Progress | progress_percentages | Tasks/checklist counted |
   184	| 4    | Present Resume     | resume_summary       | Summary displayed       |
   185	
   186	---
   187	
   188	## 5. CONFIRM MODE (5 STEPS)
   189	
   190	| STEP | NAME               | REQUIRED OUTPUT      | VERIFICATION            |
   191	| ---- | ------------------ | -------------------- | ----------------------- |
   192	| 1    | Session Detection  | spec_path confirmed  | Path validated          |
   193	| 2    | Memory Selection   | user_choice          | User selected A/B/C/D   |
   194	| 3    | Load Memory        | context_loaded       | Requested gaps loaded   |
   195	| 4    | Calculate Progress | progress_percentages | Tasks/checklist counted |
   196	| 5    | Present Resume     | resume_summary       | Summary displayed       |
   197	
   198	---
   199	
   200	# SpecKit Resume
   201	
   202	Resume work on an existing spec folder by detecting the last active session, loading just enough useful context to continue safely, and presenting progress with clear next steps.
   203	
   204	```yaml
   205	role: Expert Developer using Smart SpecKit for Session Recovery
   206	purpose: Resume interrupted work with full context restoration and progress visibility
   207	action: Run 4-5 step resume workflow from session detection through continuation options
   208	
   209	operating_mode:
   210	  workflow: sequential_4_or_5_step
   211	  workflow_compliance: MANDATORY
   212	  workflow_execution: autonomous_or_interactive
   213	  approvals: memory_selection_in_confirm_mode
   214	  tracking: progress_calculation
   215	  validation: artifact_based
   216	```
   217	
   218	---
   219	
   220	## 6. PURPOSE

codex
I’ve got the command-layer docs too, which makes the migration impact much clearer: Mnemosyne would mainly flatten today’s multi-door workflow, not replace the underlying retrieval system. I’m doing one semantic-search pass now for compliance and to sanity-check that the same retrieval/compaction files I’ve been reading are the ones the repo itself semantically associates with those concepts.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
codex
The semantic MCP search keeps getting canceled in this session, so I’m switching to the repo’s CLI fallback path for one equivalent concept search. That keeps the research grounded in the same tool family without blocking the read-only pass.
exec
/bin/zsh -lc 'if command -v ccc >/dev/null 2>&1; then ccc search "session recovery memory retrieval hybrid fusion compaction resume surfaces in system-spec-kit" --path ".opencode/skill/system-spec-kit/**" --limit 5; else echo "ccc-not-installed"; fi' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
2026-04-10T21:32:21.139376Z ERROR codex_core::tools::router: error=exec_command failed for `/bin/zsh -lc 'if command -v ccc >/dev/null 2>&1; then ccc search "session recovery memory retrieval hybrid fusion compaction resume surfaces in system-spec-kit" --path ".opencode/skill/system-spec-kit/**" --limit 5; else echo "ccc-not-installed"; fi'`: SandboxDenied { message: "Error: Failed to connect to daemon: [Errno 1] Operation not permitted: '/Users/michelkerkmeester/.cocoindex_code/daemon.log'\n", output: ExecToolCallOutput { exit_code: 1, stdout: StreamOutput { text: "", truncated_after_lines: None }, stderr: StreamOutput { text: "Error: Failed to connect to daemon: [Errno 1] Operation not permitted: '/Users/michelkerkmeester/.cocoindex_code/daemon.log'\n", truncated_after_lines: None }, aggregated_output: StreamOutput { text: "Error: Failed to connect to daemon: [Errno 1] Operation not permitted: '/Users/michelkerkmeester/.cocoindex_code/daemon.log'\n", truncated_after_lines: None }, duration: 0ns, timed_out: false } }
 exited 1 in 370ms:
Error: Failed to connect to daemon: [Errno 1] Operation not permitted: '/Users/michelkerkmeester/.cocoindex_code/daemon.log'

codex
I’m on the last gap now: the AGENTS/session-start guidance mapping. I want that source in-hand because it’s the clearest place to say whether a Mnemosyne-style “recall at session start” habit should become a new command, a wrapper hint, or just documentation over the existing `/spec_kit:resume` flow.
exec
/bin/zsh -lc "nl -ba .opencode/command/spec_kit/resume.md | sed -n '248,362p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   248	## 9. SESSION DETECTION FLOW
   249	
   250	**Priority order for finding spec folder:**
   251	1. Validate provided path from $ARGUMENTS
   252	2. `memory_match_triggers()` — fast phrase matching (<50ms)
   253	3. `memory_context()` — L1 unified retrieval (score > 0.6)
   254	4. Deterministic filtered ranking (session-learning + alias-normalized spec roots)
   255	5. No session found → offer: /spec_kit:complete or specify path
   256	
   257	**Context loading priority (after spec_path confirmed):**
   258	1. handover.md (exists & <24h) → use handover context
   259	2. `session_bootstrap()` or `memory_context({ mode: "resume", profile: "resume" })` → primary interrupted-session recovery path
   260	3. `CONTINUE_SESSION.md` → crash breadcrumb when present and recent
   261	4. `memory_search()` with resume anchors → fallback when the summary is thin
   262	5. checklist.md → progress state fallback
   263	
   264	**Stale session (>7 days):** Warn user, offer: A) Resume anyway, B) Fresh start, C) Review changes, D) Cancel
   265	
   266	---
   267	
   268	## 10. SMART MEMORY LOGIC
   269	
   270	**Goal:** recover enough state to take the next safe action, not to replay the whole project history.
   271	
   272	### Resume Essentials
   273	
   274	| Signal | Why it matters | Primary source | Fallback |
   275	| ------ | -------------- | -------------- | -------- |
   276	| Current phase or task | Orient the user immediately | `handover.md`, `tasks.md` | `session_bootstrap()` or `memory_context({ mode: "resume", profile: "resume" })` |
   277	| Last confirmed action | Prevent duplicate work | `handover.md`, recent memory | `memory_search()` with `state` anchor |
   278	| Next safe action | Make the resume actually useful | `session_bootstrap()` or `memory_context({ mode: "resume", profile: "resume" })` | `memory_search()` with `next-steps` anchor |
   279	| Blockers or "none" | Avoid unsafe continuation | `session_bootstrap()` or `memory_context({ mode: "resume", profile: "resume" })` | `memory_search()` with `blockers` or `summary` anchor |
   280	| Relevant artifact or file | Give the user a concrete place to start | `tasks.md`, `implementation-summary.md`, `handover.md` | recent memory content |
   281	
   282	### Sufficiency Rule
   283	
   284	- Stop loading more context once the command can name a **Next Safe Action** plus at least two of: current phase/task, blocker status, last confirmed action, or relevant artifact/file.
   285	- If the next safe action is still ambiguous after the primary recovery chain, run targeted gap-filling instead of broad memory loading.
   286	- If ambiguity remains after targeted recovery, report uncertainty clearly instead of guessing.
   287	
   288	### Gap-Filling Order
   289	
   290	1. Missing current phase/task: check `tasks.md`, `checklist.md`, or `handover.md`.
   291	2. Missing next safe action: use `session_bootstrap()` or `memory_context({ mode: "resume", profile: "resume" })`, then targeted `memory_search()` on `next-steps` and `state`.
   292	3. Missing blockers: target `blockers` and `summary`.
   293	4. Missing concrete starting point: look for the most relevant artifact, file, or unfinished task before loading more memory files.
   294	5. Only use deep memory loading when the focused recovery packet is still insufficient.
   295	
   296	---
   297	
   298	## 11. OUTPUT FORMATS
   299	
   300	**Success:**
   301	```
   302	RESUME BRIEF
   303	Spec: [path]
   304	Confidence: [high|medium|low] | Source: [handover|memory_context|continue_session|combined]
   305	Now: [phase/current task]
   306	Last confirmed: [action]
   307	Next safe action: [action]
   308	Blockers: [none|details]
   309	Progress: [X]% ([done]/[total] tasks)
   310	Why this is next: [short reason based on tasks/checklist/memory]
   311	```
   312	
   313	**No Session:** Offer /spec_kit:complete or specify folder path.
   314	
   315	**Stale Session (>7 days):** Warn context may be outdated, offer Resume/Fresh/Review/Cancel.
   316	
   317	---
   318	
   319	## 12. REFERENCE
   320	
   321	**Full details in YAML prompts:** Workflow steps, progress calculation, memory loading, session detection priority, stale handling, mode behaviors, failure recovery.
   322	
   323	**See also:** AGENTS.md Sections 2-6 for memory loading, confidence framework, and request analysis.
   324	
   325	---
   326	
   327	## 13. MCP TOOL USAGE
   328	
   329	Call MCP tools directly — NEVER through Code Mode.
   330	
   331	### Memory Tools
   332	
   333	| Tool                    | Purpose                                |
   334	| ----------------------- | -------------------------------------- |
   335	| `memory_search`         | Find/load context (includeContent: true)|
   336	| `memory_match_triggers` | Fast trigger phrase matching (<50ms)   |
   337	| `memory_list`           | Browse stored memories with pagination |
   338	| `memory_stats`          | Memory system statistics               |
   339	| `memory_delete`         | Remove memory by ID or spec folder     |
   340	| `memory_update`         | Update metadata (title, triggers, tier)|
   341	| `memory_validate`       | Record validation feedback             |
   342	| `memory_index_scan`     | Bulk index after creating memory files |
   343	| `memory_health`         | Check database/embeddings/index status |
   344	
   345	### Checkpoint Tools
   346	
   347	| Tool                 | Purpose                              |
   348	| -------------------- | ------------------------------------ |
   349	| `checkpoint_create`  | Snapshot state before major work     |
   350	| `checkpoint_list`    | Browse checkpoints with metadata     |
   351	| `checkpoint_restore` | Rollback to previous checkpoint      |
   352	| `checkpoint_delete`  | Clean up old checkpoints             |
   353	
   354	**Note:** No `memory_load` tool. Use `session_bootstrap()` as the canonical first recovery call, or `memory_context({ mode: "resume", profile: "resume" })` when you want the direct resume-retrieval primitive. In the current handler, resume mode is effectively a focused recovery search over the anchors `state`, `next-steps`, `summary`, and `blockers`; use `memory_search` with `includeContent: true` only when one of those essential signals is still missing.
   355	
   356	### Session Deduplication
   357	
   358	- Prefer deterministic ranked active candidates (archive/test/fixture filtered)
   359	- handover.md takes priority; if it is absent or thin, use `session_bootstrap()` or `memory_context({ mode: "resume", profile: "resume" })` before checking `CONTINUE_SESSION.md`
   360	- Treat `CONTINUE_SESSION.md` as a breadcrumb, not the primary source of truth
   361	- Older handovers preserved for audit trail
   362	

codex
# Iteration 036: USER WORKFLOW IMPACT

## Focus
USER WORKFLOW IMPACT: How will adopted patterns change the agent developer experience? New commands, changed behaviors, migration guides needed.

## Findings
### Finding 1: Mnemosyne’s biggest DX gain is a flatter memory surface, not a better retrieval core
- **Source**: [SOURCE: external/src/index.ts:96](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L96), [SOURCE: external/README.md:37](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L37), [SOURCE: feature_catalog_in_simple_terms.md:55](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md#L55), [SOURCE: quick_reference.md:116](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/quick_reference.md#L116)
- **What it does**: Mnemosyne exposes five direct verbs (`memory_recall`, `memory_recall_global`, `memory_store`, `memory_store_global`, `memory_delete`), while Public exposes a much richer but more distributed command/tool stack across `/memory:search`, `/memory:save`, `/memory:manage`, `/memory:learn`, and `/spec_kit:resume`.
- **Why it matters**: Adoption here would mostly change how developers think about memory, from “pick the right command family” to “use a small set of memory verbs.” That is a workflow simplification, not a retrieval-engine replacement.
- **Recommendation**: prototype later
- **Impact**: high
- **Source strength**: primary

### Finding 2: The most transferable behavior change is the compaction-time memory action card
- **Source**: [SOURCE: external/src/index.ts:210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [SOURCE: spec-kit-compact-code-graph.js:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396), [SOURCE: spec-kit-compact-code-graph-bridge.mjs:74](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs#L74), [SOURCE: mcp_server/README.md:535](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L535)
- **What it does**: Mnemosyne injects explicit instructions during `experimental.session.compacting` telling the agent when to recall, store, delete, use `core`, and use global memory. Public’s current plugin injects a transport-owned resume payload from `session_resume`, optimized around structural context and recovery readiness.
- **Why it matters**: After compaction, Mnemosyne preserves memory discipline directly. Public currently preserves context, but not the same concise “what memory actions should I take now?” reminder.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 3: Basename-derived `project/global` scope is ergonomic, but unsafe as Public’s authority model
- **Source**: [SOURCE: external/src/index.ts:27](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L27), [SOURCE: external/src/index.ts:78](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L78), [SOURCE: external/README.md:51](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L51), [SOURCE: tool-schemas.ts:42](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L42), [SOURCE: tool-schemas.ts:49](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L49), [SOURCE: save_workflow.md:19](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/save_workflow.md#L19), [SOURCE: memory-triggers.ts:207](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L207)
- **What it does**: Mnemosyne treats the directory basename as project scope and lazily creates global scope on first write. Public instead routes through explicit `specFolder`, governed actor/scope fields, and trusted server-minted session IDs.
- **Why it matters**: Mnemosyne minimizes onboarding friction, but direct adoption would undercut Public’s tenant/user/agent/shared-space protections and explicit save authority.
- **Recommendation**: prototype later
- **Impact**: high
- **Source strength**: primary

### Finding 4: `core=true` should map to constitutional workflow guidance, not to a new inline save flag
- **Source**: [SOURCE: external/src/index.ts:140](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L140), [SOURCE: external/README.md:57](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L57), [SOURCE: constitutional/README.md:42](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/constitutional/README.md#L42), [SOURCE: constitutional/README.md:60](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/constitutional/README.md#L60), [SOURCE: command/memory/README.txt:156](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/memory/README.txt#L156)
- **What it does**: Mnemosyne lets any store call mark a memory as `core`; Public already separates “always surface” behavior into constitutional memory and `/memory:learn`.
- **Why it matters**: A direct `core=true` port would blur Public’s distinction between routine session capture and durable global rules. The better developer experience is a clear mapping, not a second permanence mechanism.
- **Recommendation**: reject
- **Impact**: medium
- **Source strength**: primary

### Finding 5: Mnemosyne’s AGENTS guidance should become a Public migration guide over existing commands
- **Source**: [SOURCE: external/README.md:62](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L62), [SOURCE: quick_reference.md:116](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/quick_reference.md#L116), [SOURCE: resume.md:252](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/resume.md#L252), [SOURCE: resume.md:354](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/resume.md#L354), [SOURCE: tool-schemas.ts:755](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L755)
- **What it does**: Mnemosyne recommends a simple ritual: recall at session start, store after important decisions, delete contradictions, use global for cross-project preferences. Public already has a stronger recovery contract, but it is expressed as `/spec_kit:resume`, `session_bootstrap()`, `memory_context(resume)`, `/memory:save`, and `/memory:learn`.
- **Why it matters**: The migration win is documentation and prompt guidance, not new backend logic. Developers need a habit map from Mnemosyne verbs to Public’s richer surfaces.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 6: A second offline backend would worsen onboarding unless it is only a facade over current Public storage
- **Source**: [SOURCE: external/package.json:4](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L4), [SOURCE: external/README.md:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L18), [SOURCE: session-resume.ts:462](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L462), [SOURCE: mcp-coco-index/README.md:42](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L42)
- **What it does**: Mnemosyne’s plugin is thin, but it depends on an external binary and a first-run local model download. Public already operates with its own memory server plus separate CocoIndex code-search tooling.
- **Why it matters**: Adding another backend would make the “easy DX” story worse for operators: more installs, more failure states, more mental routing. The only low-friction path is a facade that delegates to current Public authority and storage.
- **Recommendation**: reject
- **Impact**: medium
- **Source strength**: primary

## Sources Consulted
- [external/src/index.ts:4](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L4)
- [external/package.json:2](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L2)
- [external/README.md:33](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L33)
- [memory-search.ts:482](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482)
- [memory-search.ts:1234](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L1234)
- [context-server.ts:738](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L738)
- [session-resume.ts:400](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L400)
- [spec-kit-compact-code-graph.js:323](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L323)
- [quick_reference.md:126](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/quick_reference.md#L126)
- [resume.md:257](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/resume.md#L257)

## Assessment
- New information ratio: `0.19`
- Questions addressed: `[developer command ergonomics, compaction-time behavior changes, scope migration risk, core-vs-constitutional mapping, AGENTS/start-of-session guidance, backend adoption friction]`
- Questions answered: `[the main DX gain is a thin facade, not new retrieval math; the clearest adopt-now item is a compaction memory action card; basename scope should stay rejected as authority; core=true should map to constitutional rules; migration should teach existing resume/save/learn surfaces instead of adding a second backend]`
- Novelty justification: `This pass adds the missing operator-facing layer by turning prior architectural findings into concrete workflow changes, migration mappings, and command-surface recommendations.`
- Validation: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict` returned `RESULT: PASSED` with `Errors: 0  Warnings: 0`, plus the known read-only warning `cannot create temp file for here document: Operation not permitted`.

## Ruled Out
- Replacing Public’s current `/spec_kit:resume` and `session_bootstrap()` recovery contract with direct `memory_recall` semantics.
- Importing basename-derived `project/global` as Public’s primary scope authority.
- Adding a general `core=true` flag to routine Public save flows instead of routing durable rules through constitutional memory.
- Introducing a second local memory backend just to get a simpler tool surface.

## Reflection
- What worked: reading the wrapper first and then matching every ergonomic claim against Public’s command docs, tool schemas, and recovery handlers made the workflow deltas concrete.
- What did not work: CocoIndex semantic search could not be used in this read-only sandbox session; MCP calls were canceled and the CLI fallback hit a daemon permission error, so the pass relied on targeted source reads instead.
- What I would do differently: next time I would convert these findings directly into a one-page migration matrix with “Mnemosyne habit -> Public equivalent -> optional facade candidate -> non-goal.”

## Recommended Next Focus
Translate this into packet-ready operator deliverables:
1. a transport-owned compaction memory action card that complements the existing resume payload,
2. an audited `memory_remember` intake or equivalent thin facade over existing Public save/retrieval authority,
3. a migration guide that maps `memory_recall`, `memory_store`, `memory_delete`, `global`, and `core` onto `/spec_kit:resume`, `session_bootstrap()`, `/memory:save`, `/memory:learn`, and governed retrieval scope.

Read-only note: I did not update the phase folder artifacts or save memory because this sandbox is read-only.


hook: Stop
hook: Stop Completed
tokens used
105,674
# Iteration 036: USER WORKFLOW IMPACT

## Focus
USER WORKFLOW IMPACT: How will adopted patterns change the agent developer experience? New commands, changed behaviors, migration guides needed.

## Findings
### Finding 1: Mnemosyne’s biggest DX gain is a flatter memory surface, not a better retrieval core
- **Source**: [SOURCE: external/src/index.ts:96](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L96), [SOURCE: external/README.md:37](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L37), [SOURCE: feature_catalog_in_simple_terms.md:55](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md#L55), [SOURCE: quick_reference.md:116](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/quick_reference.md#L116)
- **What it does**: Mnemosyne exposes five direct verbs (`memory_recall`, `memory_recall_global`, `memory_store`, `memory_store_global`, `memory_delete`), while Public exposes a much richer but more distributed command/tool stack across `/memory:search`, `/memory:save`, `/memory:manage`, `/memory:learn`, and `/spec_kit:resume`.
- **Why it matters**: Adoption here would mostly change how developers think about memory, from “pick the right command family” to “use a small set of memory verbs.” That is a workflow simplification, not a retrieval-engine replacement.
- **Recommendation**: prototype later
- **Impact**: high
- **Source strength**: primary

### Finding 2: The most transferable behavior change is the compaction-time memory action card
- **Source**: [SOURCE: external/src/index.ts:210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [SOURCE: spec-kit-compact-code-graph.js:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396), [SOURCE: spec-kit-compact-code-graph-bridge.mjs:74](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs#L74), [SOURCE: mcp_server/README.md:535](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L535)
- **What it does**: Mnemosyne injects explicit instructions during `experimental.session.compacting` telling the agent when to recall, store, delete, use `core`, and use global memory. Public’s current plugin injects a transport-owned resume payload from `session_resume`, optimized around structural context and recovery readiness.
- **Why it matters**: After compaction, Mnemosyne preserves memory discipline directly. Public currently preserves context, but not the same concise “what memory actions should I take now?” reminder.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 3: Basename-derived `project/global` scope is ergonomic, but unsafe as Public’s authority model
- **Source**: [SOURCE: external/src/index.ts:27](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L27), [SOURCE: external/src/index.ts:78](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L78), [SOURCE: external/README.md:51](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L51), [SOURCE: tool-schemas.ts:42](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L42), [SOURCE: tool-schemas.ts:49](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L49), [SOURCE: save_workflow.md:19](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/save_workflow.md#L19), [SOURCE: memory-triggers.ts:207](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L207)
- **What it does**: Mnemosyne treats the directory basename as project scope and lazily creates global scope on first write. Public instead routes through explicit `specFolder`, governed actor/scope fields, and trusted server-minted session IDs.
- **Why it matters**: Mnemosyne minimizes onboarding friction, but direct adoption would undercut Public’s tenant/user/agent/shared-space protections and explicit save authority.
- **Recommendation**: prototype later
- **Impact**: high
- **Source strength**: primary

### Finding 4: `core=true` should map to constitutional workflow guidance, not to a new inline save flag
- **Source**: [SOURCE: external/src/index.ts:140](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L140), [SOURCE: external/README.md:57](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L57), [SOURCE: constitutional/README.md:42](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/constitutional/README.md#L42), [SOURCE: constitutional/README.md:60](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/constitutional/README.md#L60), [SOURCE: command/memory/README.txt:156](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/memory/README.txt#L156)
- **What it does**: Mnemosyne lets any store call mark a memory as `core`; Public already separates “always surface” behavior into constitutional memory and `/memory:learn`.
- **Why it matters**: A direct `core=true` port would blur Public’s distinction between routine session capture and durable global rules. The better developer experience is a clear mapping, not a second permanence mechanism.
- **Recommendation**: reject
- **Impact**: medium
- **Source strength**: primary

### Finding 5: Mnemosyne’s AGENTS guidance should become a Public migration guide over existing commands
- **Source**: [SOURCE: external/README.md:62](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L62), [SOURCE: quick_reference.md:116](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/quick_reference.md#L116), [SOURCE: resume.md:252](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/resume.md#L252), [SOURCE: resume.md:354](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/resume.md#L354), [SOURCE: tool-schemas.ts:755](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L755)
- **What it does**: Mnemosyne recommends a simple ritual: recall at session start, store after important decisions, delete contradictions, use global for cross-project preferences. Public already has a stronger recovery contract, but it is expressed as `/spec_kit:resume`, `session_bootstrap()`, `memory_context(resume)`, `/memory:save`, and `/memory:learn`.
- **Why it matters**: The migration win is documentation and prompt guidance, not new backend logic. Developers need a habit map from Mnemosyne verbs to Public’s richer surfaces.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 6: A second offline backend would worsen onboarding unless it is only a facade over current Public storage
- **Source**: [SOURCE: external/package.json:4](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L4), [SOURCE: external/README.md:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L18), [SOURCE: session-resume.ts:462](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L462), [SOURCE: mcp-coco-index/README.md:42](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L42)
- **What it does**: Mnemosyne’s plugin is thin, but it depends on an external binary and a first-run local model download. Public already operates with its own memory server plus separate CocoIndex code-search tooling.
- **Why it matters**: Adding another backend would make the “easy DX” story worse for operators: more installs, more failure states, more mental routing. The only low-friction path is a facade that delegates to current Public authority and storage.
- **Recommendation**: reject
- **Impact**: medium
- **Source strength**: primary

## Sources Consulted
- [external/src/index.ts:4](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L4)
- [external/package.json:2](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L2)
- [external/README.md:33](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L33)
- [memory-search.ts:482](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482)
- [memory-search.ts:1234](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L1234)
- [context-server.ts:738](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L738)
- [session-resume.ts:400](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L400)
- [spec-kit-compact-code-graph.js:323](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L323)
- [quick_reference.md:126](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/quick_reference.md#L126)
- [resume.md:257](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/command/spec_kit/resume.md#L257)

## Assessment
- New information ratio: `0.19`
- Questions addressed: `[developer command ergonomics, compaction-time behavior changes, scope migration risk, core-vs-constitutional mapping, AGENTS/start-of-session guidance, backend adoption friction]`
- Questions answered: `[the main DX gain is a thin facade, not new retrieval math; the clearest adopt-now item is a compaction memory action card; basename scope should stay rejected as authority; core=true should map to constitutional rules; migration should teach existing resume/save/learn surfaces instead of adding a second backend]`
- Novelty justification: `This pass adds the missing operator-facing layer by turning prior architectural findings into concrete workflow changes, migration mappings, and command-surface recommendations.`
- Validation: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict` returned `RESULT: PASSED` with `Errors: 0  Warnings: 0`, plus the known read-only warning `cannot create temp file for here document: Operation not permitted`.

## Ruled Out
- Replacing Public’s current `/spec_kit:resume` and `session_bootstrap()` recovery contract with direct `memory_recall` semantics.
- Importing basename-derived `project/global` as Public’s primary scope authority.
- Adding a general `core=true` flag to routine Public save flows instead of routing durable rules through constitutional memory.
- Introducing a second local memory backend just to get a simpler tool surface.

## Reflection
- What worked: reading the wrapper first and then matching every ergonomic claim against Public’s command docs, tool schemas, and recovery handlers made the workflow deltas concrete.
- What did not work: CocoIndex semantic search could not be used in this read-only sandbox session; MCP calls were canceled and the CLI fallback hit a daemon permission error, so the pass relied on targeted source reads instead.
- What I would do differently: next time I would convert these findings directly into a one-page migration matrix with “Mnemosyne habit -> Public equivalent -> optional facade candidate -> non-goal.”

## Recommended Next Focus
Translate this into packet-ready operator deliverables:
1. a transport-owned compaction memory action card that complements the existing resume payload,
2. an audited `memory_remember` intake or equivalent thin facade over existing Public save/retrieval authority,
3. a migration guide that maps `memory_recall`, `memory_store`, `memory_delete`, `global`, and `core` onto `/spec_kit:resume`, `session_bootstrap()`, `/memory:save`, `/memory:learn`, and governed retrieval scope.

Read-only note: I did not update the phase folder artifacts or save memory because this sandbox is read-only.
