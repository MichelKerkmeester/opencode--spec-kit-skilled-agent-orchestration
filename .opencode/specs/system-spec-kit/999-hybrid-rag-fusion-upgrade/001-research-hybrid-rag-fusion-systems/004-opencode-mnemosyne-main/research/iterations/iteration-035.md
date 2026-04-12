# Iteration 035: COMPATIBILITY ANALYSIS

## Focus
COMPATIBILITY ANALYSIS: How do the adopted patterns interact with our existing CocoIndex, code-graph, and MCP tool stack? Conflict analysis.

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
leanup, by-status embedding counts, trigger totals, tier breakdown, database size, last indexed time, and startup projection health.
--
## Findings
- **Why it matters**: This is the right architecture for long-lived memory. Permanence, recall probability, and current-session salience should stay independent so we do not accidentally make durable rules feel “old” or recent noise feel “important.”
- **Recommendation**: adopt now
### Finding 8: Reject re-platforming Public’s retrieval or mutation core around Mnemosyne
- **Source**: [external/src/index.ts:104-135](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts), [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md), [memory-search.ts:771-809](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts), [hybrid-search.ts:1530-1590](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts), [mcp-coco-index/README.md:85-143](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md), [archival-manager.ts:490-555](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts)
- **Evidence type**: both
- **What it does**: Mnemosyne exposes a thin search/delete/store contract, while Public already has a deeper hybrid pipeline, confidence truncation, derived indexes, soft archival, and a separate semantic-code-search role for CocoIndex.
- **Why it matters**: The transfer value is wrapper ergonomics and compaction behavior, not ranking math, hard-delete semantics, or system fusion.
- **Recommendation**: reject
- **Priority / Effort / Impact score**: `P1` / `0/5` / `5/5`
- **Impact**: high

## Assessment
- New information ratio: `0.14`
- Final classification: `adopt now = 2`, `prototype later = 2`, `reject = 2`, `NEW FEATURE = 2`
- Best immediate moves: add the compaction memory action card, and formalize Public’s existing validation/archival/health telemetry as the benchmark baseline.
- Best near-term builds: compaction continuity benchmarking and an audited inline `memory_remember` path.
- Strongest rejections: basename-derived scope, `core=true` as a primary-surface shortcut, and any attempt to replace Public’s retrieval/mutation core with Mnemosyne’s thinner wrapper model.
- Validation: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict` returned `RESULT: PASSED` with `Errors: 0  Warnings: 0`; the same run emitted the known read-only warning `cannot create temp file for here document: Operation not permitted`.
- This was a static-analysis synthesis only. The sandbox is read-only, so I did not update `research/research.md`, `checklist.md`, `implementation-summary.md`, or save memory artifacts in the phase folder.

## Recommended Next Focus
Open two packet-ready follow-ons first: one `P1` packet for the transport-owned compaction memory action card plus compaction-continuity benchmark, and one `P1/P2` packet for an audited `memory_remember` intake path with an optional scoped `project|global` facade that delegates to existing governed scope and save authority.
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
I’m treating this as a read-only research pass for iteration 35, focused on compatibility and conflict analysis between Mnemosyne’s wrapper patterns and Public’s existing memory, CocoIndex, code-graph, and MCP surfaces. I’ll first do a lightweight memory/skill pass, then read the external wrapper and the comparable Public files in the order your brief requires, validate the phase folder, and synthesize the findings in the requested iteration format.
exec
/bin/zsh -lc 'rg -n "mnemosyne|hybrid-rag-fusion|compatibility|cocoindex|code-graph|compaction" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
13:- fix findings, review/review-report.md, 002-implement-cache-warning-hooks, 003-memory-quality-issues, 008-graph-first-routing-nudge, 010-sqlite-fts-helper, 013-analytics-token-contracts, 005-code-graph-upgrades, lexicalPath unavailable, Structural Routing Hint, validate.sh --strict
130:- docs(026-runtime), no runtime code edits, staged runtime packet docs first, validate.sh 002-implement-cache-warning-hooks, validate.sh 005-code-graph-upgrades, description.json memory/metadata.json untouched
184:scope: adopt-now runtime lane + docs closeout for `005-code-graph-upgrades` with detector provenance, blast-radius constraints, and explicit verification gates
195:- 005-code-graph-upgrades, shared-payload.ts DetectorProvenance, handlers/code-graph/query.ts unionMode multi maxDepth hotFileBreadcrumb, session_resume session_bootstrap additive edge enrichment, graph-upgrades-regression-floor.vitest.ts.test.ts, validate.sh --strict
345:## Task 7: Close `024-compact-code-graph/031-normalized-analytics-reader` with strict completion and memory-index cleanup, outcome success
363:- 026-graph-and-context-optimization, 024-compact-code-graph, 026/005-009, 024/032-034, AI Execution Protocol, SECTION_COUNTS, PHASE_LINKS, SPEC_DOC_INTEGRITY, validate.sh --strict, --no-recursive, implement the plan
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
599:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/02--system-spec-kit/024-compact-code-graph/029-review-remediation; reuse_rule=reuse for this packet-family remediation flow in this checkout, keeping fixes packet-local and revalidated
673:- when the user asked for recommendation docs “based on the 90 iterations,” keep documentation in the existing packet `research/` folder with structured sections (exec summary, keep/fix, P0/P1/P2, compatibility, validation/testing, rollout order) [Task 1]
693:## Task 1: Deep-review packet `024-compact-code-graph` with full parity gates, outcome success
701:- /spec_kit/deep-review, 024-compact-code-graph, validate.sh --recursive, check:full, QUALITY_GATE_PASS, trigger_phrases, review-report PASS
721:- strict-validation, 023/011-indexing-and-adaptive-fusion, 024-compact-code-graph, EVIDENCE:, TEMPLATE_HEADERS, PHASE DOCUMENTATION MAP
731:- session_bootstrap, memory_context({mode:"resume",profile:"resume"}), mcp_server/hooks/claude, scripts/hooks/claude, workflow-session-id.vitest.ts, code-graph-query-handler.vitest.ts
743:## Task 6: Draft packet-local changelog set for `024-compact-code-graph`, outcome success
757:- rollout_summaries/2026-04-02T14-05-56-qyWY-cocoindex_compact_code_graph_readme_section.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T16-05-56-019d4e83-d8f5-7342-833e-98b3e0f731f0.jsonl, updated_at=2026-04-02T14:08:03+00:00, thread_id=019d4e83-d8f5-7342-833e-98b3e0f731f0)
761:- CocoIndex + Compact Code Graph, README.md, 024-compact-code-graph, 006-documentation-alignment, mcp__cocoindex_code__search, code_graph_query, prettier --check
763:## Task 8: Refresh README/changelog language to current code-graph behavior and sync constitutional README file inventory, outcome success
775:- when the user said “Re-use /.../024-compact-code-graph/006-documentation-alignment,” continue under the specified existing spec folder instead of opening a new packet [Task 4]
778:- when user asked for README work, they specified “proper dedicated section ... reference 024-compact-code-graph ... re-use 006-documentation-alignment” -> preserve that wording/terminology and include those exact packet references [Task 7]
802:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for 024 compact-code-graph runtime/session troubleshooting in this checkout, but keep phase targeting explicit
836:- when the user selected reuse option “C” for `024-compact-code-graph/002-session-start-hook`, continue within that existing spec scope for follow-up fixes [Task 2]
908:scope: keep `.vscode/mcp.json` aligned with richer `.mcp.json`/`.claude/mcp.json` surfaces without breaking VS Code schema compatibility
919:- .vscode/mcp.json, .mcp.json, .claude/mcp.json, inputs + servers, mcpServers, SPECKIT_SESSION_BOOST, SPECKIT_CAUSAL_BOOST, cocoindex_code, jq empty
928:- richer flags/notes and `cocoindex_code` definitions can be sourced from `.mcp.json`/`.claude/mcp.json` and then validated with `jq empty` [Task 1]
938:## Task 1: Restore `spec_kit` slash-command prompt discovery by fixing `~/.codex/prompts` target and flat compatibility links, outcome success
955:- Some builds/autocomplete paths still expect flat files like `spec_kit-plan.md` and `memory-save.md`; keep compatibility symlinks from `.codex/prompts/<group>-<command>.md` to `.opencode/command/<group>/<command>.md` [Task 1]
956:- If slash commands vanish, verify both `readlink ~/.codex/prompts` and presence of `spec_kit-*.md`/`memory-*.md` compatibility files before restarting Codex [Task 1]
961:- symptom: command autocomplete remains partial after symlink fix; cause: only directory-level links exist and flat `group-command.md` files are missing; fix: recreate flat compatibility symlinks (for example `spec_kit-plan.md`, `memory-save.md`) [Task 1]
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
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "DEEP RESEARCH iteration 35 of 40 on compatibility analysis between Mnemosyne wrapper patterns and our CocoIndex, code-graph, MCP, and Spec Kit Memory stack" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1189ms:
2026-04-10 23:26:38.859 xcodebuild[80097:38709234] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-t6JaMgN3' (errno=Operation not permitted)
2026-04-10 23:26:39.162 xcodebuild[80100:38709252]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-04-10 23:26:39.262 xcodebuild[80100:38709251] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
[
  {
    "skill": "mcp-coco-index",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !cocoindex, cocoindex, code, embedding~, index(name)"
  },
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !intent:memory, !memory, !spec, context, document~"
  },
  {
    "skill": "sk-deep-research",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !deep research(phrase), context, deep(name), iteration, research(name)"
  },
  {
    "skill": "sk-deep-review",
    "kind": "skill",
    "confidence": 0.91,
    "uncertainty": 0.35,
    "passes_threshold": true,
    "reason": "Matched: code, context, deep(name), iteration"
  },
  {
    "skill": "mcp-clickup",
    "kind": "skill",
    "confidence": 0.87,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !intent:tooling, between, code, mcp(name)"
  },
  {
    "skill": "mcp-code-mode",
    "kind": "skill",
    "confidence": 0.85,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !intent:tooling, !mcp(multi), code(name), context, mcp(name)"
  },
  {
    "skill": "mcp-chrome-devtools",
    "kind": "skill",
    "confidence": 0.84,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !intent:tooling, between, code, mcp(name)"
  },
  {
    "skill": "sk-code-opencode",
    "kind": "skill",
    "confidence": 0.81,
    "uncertainty": 0.31,
    "passes_threshold": true,
    "reason": "Matched: !code(multi), !mcp, !mcp(multi), code(name), patterns"
  },
  {
    "skill": "sk-code-review",
    "kind": "skill",
    "confidence": 0.81,
    "uncertainty": 0.35,
    "passes_threshold": true,
    "reason": "Matched: analysis, code(name), compatibility, stack"
  },
  {
    "skill": "command-memory-save",
    "kind": "command",
    "confidence": 0.81,
    "uncertainty": 0.35,
    "passes_threshold": true,
    "reason": "Matched: command_penalty, context, memory(name), save(name)"
  }
]

codex
The quick memory pass surfaced relevant prior context around packet-local research reporting and the current compact-code-graph/CocoIndex wording, so I’m keeping this anchored to the existing `999-hybrid-rag-fusion-upgrade` research train. The skill routing call hit the usual macOS temp-cache warnings, so I’m going to inspect the result directly if it completed and then load only the deep-research skill instructions that matter for a read-only iteration.
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

codex
Skill routing is clear enough: `SKILL ROUTING: User directed -> sk-deep-research`, with `system-spec-kit` and `mcp-coco-index` also strongly matched. I’m following the research workflow but keeping it read-only, and I’m moving into the required source order now: validate the phase, then read `src/index.ts`, `package.json`, and only after that the README plus the comparable Public files.
exec
/bin/zsh -lc 'wc -l .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main/src/index.ts .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main/README.md .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/plugins/spec-kit-compact-code-graph.js .opencode/skill/mcp-coco-index/README.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
wc: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main/src/index.ts: open: No such file or directory
wc: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main/README.md: open: No such file or directory
    1378 .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
    1898 .opencode/skill/system-spec-kit/mcp_server/context-server.ts
     419 .opencode/plugins/spec-kit-compact-code-graph.js
     533 .opencode/skill/mcp-coco-index/README.md
    4228 total

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1157ms:

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
The phase validation is running, and I hit a path mismatch on the external repo layout. I’m checking the actual `external/` structure now so I can keep the reading order intact against the real checkout rather than the assumed nested path.
exec
/bin/zsh -lc "find .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external -maxdepth 3 \\( -name 'index.ts' -o -name 'package.json' -o -name 'README.md' \\) | sort" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts

exec
/bin/zsh -lc 'wc -l .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     225 .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts
      44 .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json
     109 .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md
     378 total

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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
I’ve finished the external wrapper read in the required order and confirmed the repo is intentionally thin: `src/index.ts`, `package.json`, and a README-only backend contract. Next I’m mapping those wrapper patterns onto Public’s real surfaces with a mix of semantic search and exact source reads so the compatibility analysis stays grounded in current code, not stale packet assumptions.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "rg -n \"hybrid|BM25|bm25|vector|rrf|reciprocal|CocoIndex|cocoindex|code graph|code_graph|compact|session.compacting|compacting|memory_context|memory_match_triggers|memory_search|memory_context|session_bootstrap|session_resume|generate-context|causal|archive|archiv|unarchive|global|project|shared space|shared-space\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/plugins/spec-kit-compact-code-graph.js .opencode/skill/mcp-coco-index/README.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/plugins/spec-kit-compact-code-graph.js:36:const PLUGIN_ID = 'spec-kit-compact-code-graph';
.opencode/plugins/spec-kit-compact-code-graph.js:44:const BRIDGE_PATH = fileURLToPath(new URL('./spec-kit-compact-code-graph-bridge.mjs', import.meta.url));
.opencode/plugins/spec-kit-compact-code-graph.js:77: *   compaction?: TransportBlock,
.opencode/plugins/spec-kit-compact-code-graph.js:121:  return `${specFolder ?? '__workspace__'}::${sessionID ?? '__global__'}`;
.opencode/plugins/spec-kit-compact-code-graph.js:170:async function runTransportBridge({ projectDir, specFolder, nodeBinary, bridgeTimeoutMs }) {
.opencode/plugins/spec-kit-compact-code-graph.js:177:    cwd: projectDir,
.opencode/plugins/spec-kit-compact-code-graph.js:185:async function loadTransportPlan({ projectDir, sessionID, specFolder, cacheTtlMs, nodeBinary, bridgeTimeoutMs }) {
.opencode/plugins/spec-kit-compact-code-graph.js:196:      projectDir,
.opencode/plugins/spec-kit-compact-code-graph.js:285:  const projectDir = ctx?.directory || process.cwd();
.opencode/plugins/spec-kit-compact-code-graph.js:296:      spec_kit_compact_code_graph_status: tool({
.opencode/plugins/spec-kit-compact-code-graph.js:297:        description: 'Show Spec Kit compact code graph plugin cache status',
.opencode/plugins/spec-kit-compact-code-graph.js:325:        projectDir,
.opencode/plugins/spec-kit-compact-code-graph.js:361:        projectDir,
.opencode/plugins/spec-kit-compact-code-graph.js:396:    'experimental.session.compacting': async (input, output) => {
.opencode/plugins/spec-kit-compact-code-graph.js:398:        projectDir,
.opencode/plugins/spec-kit-compact-code-graph.js:406:      const block = plan?.compaction;
.opencode/skill/mcp-coco-index/README.md:2:title: "CocoIndex Code - Semantic Code Search"
.opencode/skill/mcp-coco-index/README.md:3:description: "Semantic code search via vector embeddings. CocoIndex Code enables natural-language discovery of code, patterns, and implementations across 28+ languages using a CLI and a single MCP search tool."
.opencode/skill/mcp-coco-index/README.md:6:  - "cocoindex"
.opencode/skill/mcp-coco-index/README.md:10:  - "vector search"
.opencode/skill/mcp-coco-index/README.md:14:# CocoIndex Code - Semantic Code Search
.opencode/skill/mcp-coco-index/README.md:42:CocoIndex Code is a semantic code search tool built on vector embeddings. Where `grep` matches exact characters, CocoIndex Code matches meaning. Ask for "retry logic with exponential backoff" and it returns code that implements that pattern, regardless of how the author named variables or functions. This makes it the right tool when you know what a piece of code does but not where it lives or what it is called.
.opencode/skill/mcp-coco-index/README.md:46:Indexing is incremental and daemon-backed. The first run scans and embeds all supported files in the project. Subsequent runs update only changed files. A background daemon starts automatically on the first command, persists across calls, and restarts itself when settings or the binary version change.
.opencode/skill/mcp-coco-index/README.md:65:| `ccc search` (CocoIndex) | You know what code does but not where it lives | Approximate, needs verification |
.opencode/skill/mcp-coco-index/README.md:66:| `code_graph_query` | You need exact callers, imports, or structural dependencies | Requires the structural graph to be indexed first |
.opencode/skill/mcp-coco-index/README.md:85:In the broader system-spec-kit stack, CocoIndex is the semantic half of a three-system retrieval model: CocoIndex finds conceptually similar code, Code Graph answers structural questions, and session bootstrap surfaces CocoIndex readiness during recovery. The companion lifecycle helpers exposed through system-spec-kit are `ccc_status`, `ccc_reindex`, and `ccc_feedback`.
.opencode/skill/mcp-coco-index/README.md:96:Run the idempotent bootstrap helper. It installs the binary, initializes the project if needed, and reports readiness.
.opencode/skill/mcp-coco-index/README.md:104:Run from the project root. The first run scans all supported files and generates embeddings. It takes 1-5 minutes depending on codebase size.
.opencode/skill/mcp-coco-index/README.md:137:CocoIndex Code resolves queries by embedding the natural-language query text and comparing the resulting vector against pre-computed vectors for every code chunk in the index. This means the search engine reads intent, not characters. A query for "graceful shutdown handler" finds code that tears down servers or releases resources, even if the words "graceful", "shutdown", or "handler" never appear in that code.
.opencode/skill/mcp-coco-index/README.md:139:The two embedding models trade off quality against convenience. The local model (`all-MiniLM-L6-v2`) requires no API key and works offline, making it the right default for most projects. The Voyage Code 3 model produces 1024-dimensional vectors trained specifically on code, and consistently returns higher-quality results for complex queries on large codebases. Switching models requires a full reset and reindex because the vector dimensions are incompatible.
.opencode/skill/mcp-coco-index/README.md:152:| `ccc index` | Build or update the vector index | none |
.opencode/skill/mcp-coco-index/README.md:154:| `ccc init` | Initialize project (`/.cocoindex_code/`) | `-f` / `--force` |
.opencode/skill/mcp-coco-index/README.md:223:    install.sh                     Install CocoIndex Code into skill venv
.opencode/skill/mcp-coco-index/README.md:248:**Global settings** (`~/.cocoindex_code/global_settings.yml`)
.opencode/skill/mcp-coco-index/README.md:250:Controls the embedding model used for all projects on this machine.
.opencode/skill/mcp-coco-index/README.md:261:**Project settings** (`.cocoindex_code/settings.yml`)
.opencode/skill/mcp-coco-index/README.md:263:Created by `ccc init`. Controls which files get indexed in this project.
.opencode/skill/mcp-coco-index/README.md:279:    "cocoindex_code": {
.opencode/skill/mcp-coco-index/README.md:297:| `COCOINDEX_CODE_ROOT_PATH` | auto-detected | Override project root for indexing |
.opencode/skill/mcp-coco-index/README.md:298:| `COCOINDEX_CODE_DIR` | `~/.cocoindex_code` | Override config and data directory |
.opencode/skill/mcp-coco-index/README.md:303:CocoIndex Code resolves the project root in this order:
.opencode/skill/mcp-coco-index/README.md:306:2. Nearest parent with `.cocoindex_code/` directory
.opencode/skill/mcp-coco-index/README.md:307:3. Nearest parent with a project marker (`.git`, `pyproject.toml`, `package.json`, `Cargo.toml`, `go.mod`)
.opencode/skill/mcp-coco-index/README.md:312:Changing the model requires destroying and rebuilding the index. Different models produce vectors with incompatible dimensions, and mixing them corrupts results.
.opencode/skill/mcp-coco-index/README.md:438:**Embedding model mismatch after changing `global_settings.yml`**
.opencode/skill/mcp-coco-index/README.md:440:What you see: Search returns no results or errors about vector dimension incompatibility after switching the embedding model.
.opencode/skill/mcp-coco-index/README.md:442:Common causes: The existing index was built with a different model and the vector dimensions do not match the new model.
.opencode/skill/mcp-coco-index/README.md:457:Common causes: CocoIndex Code requires Python 3.11 or later. The system Python may be an older version.
.opencode/skill/mcp-coco-index/README.md:473:**Q: Why does CocoIndex Code only expose one MCP tool when the CLI has seven commands?**
.opencode/skill/mcp-coco-index/README.md:481:A: Use Voyage Code 3 when search quality matters more than avoiding an API dependency. The local model (`all-MiniLM-L6-v2`) is a general-purpose sentence embedding model with 384 dimensions. It works well for most queries but can miss nuanced code patterns. Voyage Code 3 was trained on code and produces 1024-dimensional vectors, giving it better discrimination between semantically similar but functionally different patterns. Switch to it when you notice too many false positives or misses on important queries. Remember: switching models requires `ccc reset && ccc index`.
.opencode/skill/mcp-coco-index/README.md:493:A: `doctor.sh` is read-only. It inspects the environment, reports what is working and what is not, and exits with a non-zero code if any check fails. It never modifies anything. `ensure_ready.sh` is idempotent and takes action: it installs the binary if missing, initializes the project if not yet initialized, and optionally refreshes the index. Use `doctor.sh` for diagnostics and CI gates. Use `ensure_ready.sh` to bring a machine to a ready state.
.opencode/skill/mcp-coco-index/README.md:513:| [scripts/install.sh](scripts/install.sh) | Install CocoIndex Code |
.opencode/skill/mcp-coco-index/README.md:528:| CocoIndex GitHub | https://github.com/cocoindex-io/cocoindex |
.opencode/skill/mcp-coco-index/README.md:529:| CocoIndex Code on PyPI | https://pypi.org/project/cocoindex-code/ |
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:100:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:203:  includeArchived?: boolean; // REQ-206: include archived memories in search (default false)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:213:  /** Phase B T019: Dual-level retrieval — 'local' (entity), 'global' (community), 'auto' (local + fallback). */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:214:  retrievalLevel?: 'local' | 'global' | 'auto';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:340:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:520:    includeArchived: includeArchived = false, // REQ-206: exclude archived by default
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:554:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:566:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:594:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:613:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:625:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:751:  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:777:        : 'hybrid',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:818:      (retrievalLevel === 'global' || retrievalLevel === 'auto')
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:822:        (retrievalLevel === 'global') ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:986:      causal: { applied: pipelineResult.metadata.stage2.causalBoostApplied },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1044:      toolCache.set(cacheKey, cachePayload, { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1234:        fusionMethod: 'rrf',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1374:const handle_memory_search = handleMemorySearch;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1377:  handle_memory_search,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:75:import * as vectorIndex from './lib/search/vector-index.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:80:import * as hybridSearch from './lib/search/hybrid-search.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:86:import * as causalBoost from './lib/search/causal-boost.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:87:import * as bm25Index from './lib/search/bm25-index.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:107:// T059: Archival manager for automatic archival of ARCHIVED state memories
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:108:import * as archivalManager from './lib/cognitive/archival-manager.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:213:  'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:214:  'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:215:  'code_graph_scan',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:216:  'code_graph_status',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:254:  preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:255:  secondaryTool: 'code_graph_context';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:320:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:321:    secondaryTool: 'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:322:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:681:    ? 'loaded code graph status'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:682:    : 'code graph status unavailable';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:694:    hints.push(`Code graph: ${pkg.codeGraphStatus}, CocoIndex: ${pkg.cocoIndexAvailable ? 'available' : 'not installed'}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:747:  const channels: string[] = ['vector', 'fts5'];
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:748:  if (bm25Index.isBm25Enabled()) channels.push('bm25');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:771:        snap.graphFreshness === 'empty' ? 'run code_graph_scan' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:786:  lines.push('- If structural context shows "ready": code_graph_query is available for structural lookups');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:796:      routingRules.push('Semantic/concept code search → mcp__cocoindex_code__search');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:799:      routingRules.push('Structural queries (callers, imports, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:885:    if (name.startsWith('code_graph_')) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:886:      recordMetricEvent({ kind: 'code_graph_query' });
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:945:      vectorIndex.initializeDb();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:985:            existingHints.push('Tip: For code search queries, consider using mcp__cocoindex_code__search for semantic code search or code_graph_query for structural lookups.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1020:    // F057: Passive context enrichment pipeline — adds code graph symbols
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1193:    const database = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1363:  runCleanupStep('archivalManager', () => archivalManager.cleanup());
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1380:    runCleanupStep('vectorIndex', () => vectorIndex.closeDb());
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1410:  const database = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1437:      if (vectorIndex.deleteMemory(row.id)) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1554:  vectorIndex.initializeDb();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1563:    vectorIndex,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1566:    hybridSearch,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1571:      causalBoost,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1576:      archivalManager,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1589:    const report = vectorIndex.verifyIntegrity();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1594:    const dimValidation = vectorIndex.validateEmbeddingDimension();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1605:    const database = vectorIndex.getDb();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1642:    let projectionCount = 0;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1643:    let projectionTableExists = true;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1646:      const projectionCountRow = database.prepare('SELECT COUNT(*) as cnt FROM active_memory_projection').get() as { cnt?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1647:      projectionCount = Number(projectionCountRow?.cnt ?? 0);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1649:      projectionTableExists = false;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1652:    console.error('[context-server] Startup health: memory_index=%d, active_memory_projection=%d', memoryCount, projectionCount);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1654:    if (memoryCount > 0 && (!projectionTableExists || projectionCount === 0)) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1656:      console.error('[context-server] Auto-backfill triggered: %d rows seeded into active_memory_projection', result.seeded);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1659:    if (memoryCount === 0 && projectionCount === 0) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1669:    hybridSearch.init(database, vectorIndex.vectorSearch, graphSearchFn);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1674:    causalBoost.init(database);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1694:    console.error('[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1696:    // P3-04: Rebuild BM25 index from database on startup
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1697:    if (bm25Index.isBm25Enabled()) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1699:        const bm25 = bm25Index.getIndex();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1700:        const count = bm25.rebuildFromDatabase(database);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1701:        console.error(`[context-server] BM25 index rebuilt from database: ${count} documents`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1702:      } catch (bm25Err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1703:        const message = bm25Err instanceof Error ? bm25Err.message : String(bm25Err);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1704:        console.warn('[context-server] BM25 index rebuild failed:', message);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1728:    // T059: Archival Manager for automatic archival of ARCHIVED state memories
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1730:      archivalManager.init(database);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1731:      // Start background archival job (scans every hour by default)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1732:      archivalManager.startBackgroundJob();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1733:      if (archivalManager.isBackgroundJobRunning()) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1738:    } catch (archivalErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1739:      const message = archivalErr instanceof Error ? archivalErr.message : String(archivalErr);

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '470,860p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '960,1260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
  1036	        formatted = replaceResponseEnvelope(formatted, parsedFormatted.firstEntry, parsedFormatted.envelope);
  1037	      }
  1038	    }
  1039	
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
  1156	        .filter((id): id is string | number => typeof id === 'string' || typeof id === 'number');
  1157	
  1158	      if (returnedIds.length > 0) {
  1159	        retrievalSessionStateManager.markSeen(sessionId, returnedIds);
  1160	      }
  1161	
  1162	      data.sessionState = buildSessionStatePayload(sessionId);
  1163	      if (goalRefinementPayload) {
  1164	        data.goalRefinement = goalRefinementPayload;
  1165	      }
  1166	
  1167	      parsedResponse.envelope.data = data;
  1168	      responseToReturn = replaceResponseEnvelope(responseToReturn, parsedResponse.firstEntry, parsedResponse.envelope);
  1169	    }
  1170	  }
  1171	
  1172	  if (includeTrace && sessionTransition) {
  1173	    responseToReturn = attachSessionTransitionTrace(responseToReturn, sessionTransition);
  1174	  }
  1175	
  1176	  if (retrievalTelemetry.isExtendedTelemetryEnabled()) {
  1177	    const telemetry = retrievalTelemetry.createTelemetry();
  1178	    retrievalTelemetry.recordTransitionDiagnostics(telemetry, sessionTransition);
  1179	    retrievalTelemetry.recordGraphWalkDiagnostics(
  1180	      telemetry,
  1181	      summarizeGraphWalkDiagnostics(extractResponseResults(responseToReturn)),
  1182	    );
  1183	    responseToReturn = attachTelemetryMeta(responseToReturn, retrievalTelemetry.toJSON(telemetry));
  1184	  }
  1185	
  1186	  // Consumption instrumentation — log search event (fail-safe, never throws)
  1187	  try {
  1188	    const db = (() => { try { return requireDb(); } catch (_error: unknown) { return null; } })();
  1189	    if (db) {
  1190	      initConsumptionLog(db);
  1191	      let resultIds: number[] = [];
  1192	      let resultCount = 0;
  1193	      try {
  1194	        if (responseToReturn?.content?.[0]?.text) {
  1195	          const parsed = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
  1196	          const data = parsed?.data as Record<string, unknown> | undefined;
  1197	          const results = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
  1198	          resultIds = results.map(r => r.id as number).filter(id => typeof id === 'number');
  1199	          resultCount = Array.isArray(data?.results) ? (data.results as unknown[]).length : 0;
  1200	        }
  1201	      } catch (_error: unknown) { /* ignore parse errors */ }
  1202	      logConsumptionEvent(db, {
  1203	        event_type: 'search',
  1204	        query_text: effectiveQuery || null,
  1205	        intent: detectedIntent,
  1206	        result_count: resultCount,
  1207	        result_ids: resultIds,
  1208	        session_id: sessionId ?? null,
  1209	        latency_ms: Date.now() - _searchStartTime,
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
/bin/zsh -lc "nl -ba .opencode/plugins/spec-kit-compact-code-graph.js | sed -n '280,419p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '730,810p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '660,705p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '1638,1706p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/mcp-coco-index/README.md | sed -n '80,150p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

 succeeded in 0ms:
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
  1676	      const dirtyNodeIds = Array.from(getDirtyNodes().nodeIds);
  1677	      if (dirtyNodeIds.length === 0) {
  1678	        return;
  1679	      }
  1680	
  1681	      try {
  1682	        const updatedEdges = recomputeLocal(database, dirtyNodeIds);
  1683	        clearDirtyNodes();
  1684	        console.error(
  1685	          '[context-server] Scheduled graph refresh applied: dirty_nodes=%d, updated_edges=%d',
  1686	          dirtyNodeIds.length,
  1687	          updatedEdges,
  1688	        );
  1689	      } catch (graphRefreshErr: unknown) {
  1690	        const message = graphRefreshErr instanceof Error ? graphRefreshErr.message : String(graphRefreshErr);
  1691	        console.warn('[context-server] Scheduled graph refresh failed:', message);
  1692	      }
  1693	    });
  1694	    console.error('[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized');
  1695	
  1696	    // P3-04: Rebuild BM25 index from database on startup
  1697	    if (bm25Index.isBm25Enabled()) {
  1698	      try {
  1699	        const bm25 = bm25Index.getIndex();
  1700	        const count = bm25.rebuildFromDatabase(database);
  1701	        console.error(`[context-server] BM25 index rebuilt from database: ${count} documents`);
  1702	      } catch (bm25Err: unknown) {
  1703	        const message = bm25Err instanceof Error ? bm25Err.message : String(bm25Err);
  1704	        console.warn('[context-server] BM25 index rebuild failed:', message);
  1705	      }
  1706	    }

codex
I’ve got the main compatibility surfaces loaded. One more pass now: I’m pulling the specific Public save/scope/causal entry points so the final findings can say exactly where Mnemosyne’s lightweight wrapper fits cleanly, where it conflicts with governed memory semantics, and which parts are truly additive versus redundant.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	"use strict";
     2	// ---------------------------------------------------------------
     3	// MODULE: Generate Context
     4	// ---------------------------------------------------------------
     5	var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
     6	    if (k2 === undefined) k2 = k;
     7	    var desc = Object.getOwnPropertyDescriptor(m, k);
     8	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
     9	      desc = { enumerable: true, get: function() { return m[k]; } };
    10	    }
    11	    Object.defineProperty(o, k2, desc);
    12	}) : (function(o, m, k, k2) {
    13	    if (k2 === undefined) k2 = k;
    14	    o[k2] = m[k];
    15	}));
    16	var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    17	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    18	}) : function(o, v) {
    19	    o["default"] = v;
    20	});
    21	var __importStar = (this && this.__importStar) || (function () {
    22	    var ownKeys = function(o) {
    23	        ownKeys = Object.getOwnPropertyNames || function (o) {
    24	            var ar = [];
    25	            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
    26	            return ar;
    27	        };
    28	        return ownKeys(o);
    29	    };
    30	    return function (mod) {
    31	        if (mod && mod.__esModule) return mod;
    32	        var result = {};
    33	        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
    34	        __setModuleDefault(result, mod);
    35	        return result;
    36	    };
    37	})();
    38	Object.defineProperty(exports, "__esModule", { value: true });
    39	exports.main = main;
    40	exports.readAllStdin = readAllStdin;
    41	exports.parseArguments = parseArguments;
    42	exports.validateArguments = validateArguments;
    43	exports.isValidSpecFolder = isValidSpecFolder;
    44	exports.extractPayloadSpecFolder = extractPayloadSpecFolder;
    45	// ───────────────────────────────────────────────────────────────
    46	// 1. GENERATE CONTEXT
    47	// ───────────────────────────────────────────────────────────────
    48	// CLI entry point -- parses arguments, validates spec folder, and runs the memory workflow
    49	// Node stdlib
    50	const path = __importStar(require("path"));
    51	const fsSync = __importStar(require("fs"));
    52	// Internal modules
    53	const path_security_1 = require("@spec-kit/shared/utils/path-security");
    54	const core_1 = require("../core");
    55	const workflow_1 = require("../core/workflow");
    56	const loaders_1 = require("../loaders");
    57	const collect_session_data_1 = require("../extractors/collect-session-data");
    58	// ───────────────────────────────────────────────────────────────
    59	// 3. HELP TEXT
    60	// ───────────────────────────────────────────────────────────────
    61	const HELP_TEXT = `
    62	Usage: node generate-context.js [options] <input>
    63	
    64	Arguments:
    65	  <input>           A JSON data file path
    66	                    - JSON file mode: node generate-context.js data.json [spec-folder]
    67	
    68	Options:
    69	  --help, -h        Show this help message
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
   181	        if (core_1.SPEC_FOLDER_PATTERN.test(lastTwo[0]) && core_1.SPEC_FOLDER_PATTERN.test(lastTwo[1])) {
   182	            // Both segments are valid spec folder names — valid nested spec folder
   183	            const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);
   184	            if (!hasSpecsParent) {
   185	                // Fallback: check if the path resolves to an existing directory under any specs root
   186	                for (const specsDir of (0, core_1.getSpecsDirectories)()) {
   187	                    const candidate = path.join(specsDir, normalizedInput);
   188	                    if (!path.isAbsolute(normalizedInput) &&
   189	                        fsSync.existsSync(candidate) &&
   190	                        (0, path_security_1.validateFilePath)(candidate, (0, core_1.getSpecsDirectories)()) !== null) {
   191	                        return { valid: true };
   192	                    }
   193	                }
   194	                return {
   195	                    valid: false,
   196	                    reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
   197	                };
   198	            }
   199	            return { valid: true };
   200	        }
   201	    }
   202	    if (!core_1.SPEC_FOLDER_PATTERN.test(folderName)) {
   203	        if (/^\d{3}-/.test(folderName)) {
   204	            if (/[A-Z]/.test(folderName)) {
   205	                return { valid: false, reason: 'Spec folder name should be lowercase' };
   206	            }
   207	            if (/_/.test(folderName)) {
   208	                return { valid: false, reason: 'Spec folder name should use hyphens, not underscores' };
   209	            }
   210	            if (!/^[a-z]/.test(folderName.slice(4))) {
   211	                return { valid: false, reason: 'Spec folder name must start with a letter after the number prefix' };
   212	            }
   213	        }
   214	        return { valid: false, reason: 'Invalid spec folder format. Expected: NNN-feature-name' };
   215	    }
   216	    const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);
   217	    if (!hasSpecsParent) {
   218	        // Fallback: check if bare name can be resolved via recursive child search
   219	        // (findChildFolderSync in validateArguments handles this, so just report the error here)
   220	        return {

exec
/bin/zsh -lc "rg -n \"memory_causal_link|memory_drift_why|memory_context\\(|handleMemoryContext|memory_match_triggers|handleMemorySave|memory_save\" .opencode/skill/system-spec-kit/mcp_server -g '"'!**/node_modules/**'"' | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:17:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:297:      actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:303:      recordHistory(nextMemoryId, 'ADD', null, parsed.title ?? parsed.filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:304:      recordHistory(memoryId, 'UPDATE', previous.title, parsed.title ?? parsed.filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:211:  name: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:218:  name: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:484:  name: 'memory_drift_why',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:491:  name: 'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:504:  description: '[L6:Analysis] Remove a causal relationship by edge ID. Use memory_drift_why to find edge IDs. Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:428:- `memory_match_triggers` (fast trigger matching)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:429:- `memory_save` (index new memories)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:532:`memory_context()` is the primary entry point for context loading. It detects task intent and routes to the optimal retrieval strategy automatically.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:559:### memory_match_triggers: Fast Keyword Lookup
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:561:`memory_match_triggers()` provides sub-50ms keyword-based matching. Use it for immediate context surfacing at the start of a conversation.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:563:### memory_save: Index a Memory File
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:565:`memory_save()` indexes a single new or updated memory file into the database. For bulk indexing, use `memory_index_scan()` instead.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:629:- `ContextEnvelope`: Wraps all `memory_context()` responses with metadata (mode used, memories returned, intent detected)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:681:**Behind the scenes:** The AI calls `memory_context()` with `mode: "resume"` and `anchors: ["state", "next-steps"]`, then returns the previous session state.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:692:1. AI calls `memory_context({ input: "add user profiles", mode: "auto" })`
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1047:MCP TOOLS: memory_context, memory_search, memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1048:           memory_save, memory_index_scan, memory_stats
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:11:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:17:// Feature catalog: Causal edge creation (memory_causal_link)
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:19:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:5:import { handleMemoryContext } from '../handlers/index.js';
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:16:    case 'memory_context': return handleMemoryContext(parseArgs<ContextArgs>(validateToolArgs('memory_context', args)));
.opencode/skill/system-spec-kit/mcp_server/README.md:189:  "tool": "memory_save",
.opencode/skill/system-spec-kit/mcp_server/README.md:674:##### `memory_match_triggers`
.opencode/skill/system-spec-kit/mcp_server/README.md:688:  "tool": "memory_match_triggers",
.opencode/skill/system-spec-kit/mcp_server/README.md:699:##### `memory_save`
.opencode/skill/system-spec-kit/mcp_server/README.md:723:  "tool": "memory_save",
.opencode/skill/system-spec-kit/mcp_server/README.md:982:##### `memory_drift_why`
.opencode/skill/system-spec-kit/mcp_server/README.md:996:##### `memory_causal_link`
.opencode/skill/system-spec-kit/mcp_server/README.md:1026:| `edgeId` | string | **Required.** Edge ID from `memory_drift_why` results |
.opencode/skill/system-spec-kit/mcp_server/README.md:1354:  "tool": "memory_save",
.opencode/skill/system-spec-kit/mcp_server/README.md:1371:  "tool": "memory_drift_why",
.opencode/skill/system-spec-kit/mcp_server/README.md:1540:| Check triggers on every prompt | `memory_match_triggers` | Pass the user's prompt text |
.opencode/skill/system-spec-kit/mcp_server/README.md:1543:| Test a save without committing | `memory_save` | Set `dryRun: true` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1581:{ "tool": "memory_save", "arguments": { "filePath": "/path/to/file.md", "dryRun": true } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1717:Start with `memory_context` for all retrieval tasks. It handles intent detection and routing automatically. Use `memory_search` when you want explicit control over channels. Use `memory_match_triggers` when processing a raw prompt at the start of each turn. Use L4-L7 tools only for mutation, analysis or maintenance.
.opencode/skill/system-spec-kit/mcp_server/README.md:1721:**Q: What does the dryRun parameter do on memory_save?**
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:197:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:220:        tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:284:      console.warn('[memory_match_triggers] Decay failed:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:336:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:374:        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:390:          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:491:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:511:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:565:  handle_memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:89:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:91:  'memory_save',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:460:    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:463:    recommendedCalls.push('memory_match_triggers({ prompt: "<your task>" })');
.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts:19:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:28:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:613:    reason: `memory_save: chunked indexing (${chunkResult.strategy}, ${chunkResult.chunks.length} chunks)`,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:618:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:628:    actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:25:  'memory_drift_why',
.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:26:  'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:34:    case 'memory_drift_why':     return handleMemoryDriftWhy(parseArgs<DriftWhyArgs>(validateToolArgs('memory_drift_why', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:35:    case 'memory_causal_link':   return handleMemoryCausalLink(parseArgs<CausalLinkArgs>(validateToolArgs('memory_causal_link', args)));
.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts:6:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:224:  //   recovery (0.20)      — A memory_context({ mode: "resume" }) call is the most
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:400:  memory_match_triggers: memoryMatchTriggersSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:401:  memory_save: memorySaveSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:415:  memory_drift_why: memoryDriftWhySchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:416:  memory_causal_link: memoryCausalLinkSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:465:  memory_match_triggers: ['prompt', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'session_id', 'turnNumber', 'include_cognitive'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:466:  memory_save: ['filePath', 'force', 'dryRun', 'skipPreflight', 'asyncEmbedding', 'tenantId', 'userId', 'agentId', 'sessionId', 'sharedSpaceId', 'provenanceSource', 'provenanceActor', 'governedAt', 'retentionPolicy', 'deleteAfter'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:480:  memory_drift_why: ['memoryId', 'maxDepth', 'direction', 'relations', 'includeMemoryDetails'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:481:  memory_causal_link: ['sourceId', 'targetId', 'relation', 'strength', 'evidence'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:103:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:105:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:945:            actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:972:        actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1078:/** Handle memory_save tool - validates, indexes, and persists a memory file to the database */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1079:async function handleMemorySave(args: SaveArgs): Promise<MCPResponse> {
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
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1781:  handleMemorySave,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1789:const handle_memory_save = handleMemorySave;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1796:  handle_memory_save,
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:9:  handleMemorySave,
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:64:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:65:  'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:99:    case 'memory_match_triggers': return handleMemoryMatchTriggers(parseArgs<TriggerArgs>(validateToolArgs('memory_match_triggers', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:100:    case 'memory_save':           return handleMemorySave(parseArgs<SaveArgs>(validateToolArgs('memory_save', args)));
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:70:- `MEMORY_AWARE_TOOLS` currently includes `memory_context`, `memory_search`, `memory_match_triggers`, `memory_list`, `memory_save`, and `memory_index_scan`.
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:26:// Feature catalog: Causal chain tracing (memory_drift_why)
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:103:  tool: 'memory_drift_why' | 'memory_causal_link' | 'memory_causal_stats' | 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:338:/** Handle memory_drift_why tool - traces causal relationships for a given memory */
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:354:      tool: 'memory_drift_why',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:358:      recovery: getRecoveryHint('memory_drift_why', 'E031'),
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:370:        tool: 'memory_drift_why',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:374:        recovery: getRecoveryHint('memory_drift_why', 'E020'),
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:385:          tool: 'memory_drift_why',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:389:          recovery: getRecoveryHint('memory_drift_why', ErrorCodes.CAUSAL_INVALID_RELATION),
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:483:        tool: 'memory_drift_why',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:490:          'Use memory_causal_link to create relationships',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:521:      tool: 'memory_drift_why',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:543:      'memory_drift_why',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:557:/** Handle memory_causal_link tool - creates a causal edge between two memories */
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:576:      tool: 'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:603:        tool: 'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:607:        recovery: getRecoveryHint('memory_causal_link', 'E020'),
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:616:        tool: 'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:620:        recovery: getRecoveryHint('memory_causal_link', ErrorCodes.CAUSAL_INVALID_RELATION),
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:629:        tool: 'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:633:        recovery: getRecoveryHint('memory_causal_link', ErrorCodes.CAUSAL_GRAPH_ERROR),
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:639:      tool: 'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:646:        `Use memory_drift_why({ memoryId: "${targetId}" }) to trace this relationship`,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:653:      'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:731:      hints.push('No causal links exist yet - use memory_causal_link to create relationships');
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:783:          'Use memory_drift_why() to find edge IDs',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:817:      hints.push('Use memory_drift_why() to find valid edge IDs');
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:852:const handle_memory_drift_why = handleMemoryDriftWhy;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:853:const handle_memory_causal_link = handleMemoryCausalLink;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:858:  handle_memory_drift_why,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:859:  handle_memory_causal_link,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:6:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:15:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:7:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:50:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:61:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:77:      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:140:        '- `memory_context({ input, mode })` — unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:141:        '- `memory_match_triggers({ prompt })` — fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:185:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:190:      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:202:      content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:90: * reliable retrieval via the `memory_match_triggers` tool. The scoring
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:26:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:254:      actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:284:      recordHistory(memory_id, 'ADD', null, parsed.title ?? filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:291:          'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:51:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:62:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:73:      content: 'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:106:        '- `memory_context({ input, mode })` - unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:107:        '- `memory_match_triggers({ prompt })` - fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:149:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:155:    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:163:    content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:17:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:274:| Full validation | `runPreflight()` | Before memory_save |
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:10:import { handleMemoryContext } from './memory-context.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:415:      const mcpResponse = await handleMemoryContext({
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:8:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:10:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:31:Hooks are transport reliability, not separate business logic. They call the same retrieval primitives (`memory_match_triggers`, `memory_context`) that other runtimes call explicitly.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:8:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:226:export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:229:export const handleMemorySave = lazyFunction(getMemorySaveModule, 'handleMemorySave');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:233:export const handle_memory_save = lazyFunction(getMemorySaveModule, 'handle_memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:313:export const handle_memory_drift_why = lazyFunction(getCausalGraphModule, 'handle_memory_drift_why');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:314:export const handle_memory_causal_link = lazyFunction(getCausalGraphModule, 'handle_memory_causal_link');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:319:export const handleMemoryContext = lazyFunction(getMemoryContextModule, 'handleMemoryContext');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:3:description: "Decomposed pipeline modules for the memory_save MCP tool handler, covering dedup, embedding, PE gating, record creation, reconsolidation and response assembly."
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:27:`handlers/save/` contains the decomposed pipeline for the `memory_save` MCP tool. Each file owns a single stage of the save flow, from deduplication through embedding generation, save quality gating, prediction-error gating, reconsolidation, record creation, post-insert enrichment, and final response assembly.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:47:description: "Durable regression fixture for memory_save UX contract coverage."
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:68:Continue validating the \`memory_save\` UX contract with a fixture that is rich enough to satisfy the durable-memory gate while still exercising duplicate no-op, deferred embedding, and post-mutation feedback behavior.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:85:| \`mcp_server/handlers/memory-save.ts\` | Coordinates duplicate detection, sufficiency evaluation, template validation, and post-mutation feedback for \`memory_save\`. |
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:235:    const response = await handler.handleMemorySave({
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:248:  it('memory_save success response exposes postMutationHooks contract fields and types', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:252:    const response = await handler.handleMemorySave({
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:63:    'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:538:    recordHistory(memoryId, 'ADD', null, parsed.title ?? filePath, params.actor ?? 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:816:      actor: params.actor ?? 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:36:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:124: * Result payload from reconsolidation pre-checks during memory_save.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:301:                recordHistory(id, 'ADD', null, memory.title ?? memory.filePath ?? null, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:322:            reason: `memory_save: reconsolidation ${reconResult.action}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:329:              tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:335:            actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/integration-error-recovery.vitest.ts:100:      if (saveHandlerModule?.handleMemorySave) {
.opencode/skill/system-spec-kit/mcp_server/tests/integration-error-recovery.vitest.ts:103:          run: () => saveHandlerModule.handleMemorySave({} as Parameters<typeof saveHandlerModule.handleMemorySave>[0]),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:144:      ? 'memory_save: updated indexed memory entry'
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:145:      : 'memory_save: created new indexed memory entry',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:150:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:160:    actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:251:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:269:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:285:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:462:    tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:10:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:11:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:56:    toolPattern: /^(bash|memory_save|memory_update)$/i,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:18:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1082:async function handleMemoryContext(args: ContextArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1478:      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1599:  handleMemoryContext,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1606:const handle_memory_context = handleMemoryContext;
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:378:  it('public and runtime schemas accept governed scope fields for memory_match_triggers', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:389:      validateToolInputSchema('memory_match_triggers', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:391:    expect(validateToolArgs('memory_match_triggers', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:464:    const driftWhy = TOOL_DEFINITIONS.find((entry) => entry.name === 'memory_drift_why');
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:465:    const causalLink = TOOL_DEFINITIONS.find((entry) => entry.name === 'memory_causal_link');

exec
/bin/zsh -lc "rg -n \"generate-context|memory_save|memory_match_triggers|memory_context|causal link|causal_link|memory_causal|sharedSpaceId|normalizeScopeContext|retrievalLevel|governed|tenantId|agentId|userId|sessionId\" .opencode/skill/system-spec-kit -g '"'!**/node_modules/**'"' | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:360:  const transportSessionId = typeof (extra as { sessionId?: unknown } | null)?.sessionId === 'string'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:361:    ? ((extra as { sessionId?: string }).sessionId ?? null)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:363:  const explicitSessionId = typeof args.sessionId === 'string'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:364:    ? args.sessionId
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:378:// that lack an explicit sessionId param can still correlate with a prior search.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1803:            console.error('[context-server] Recoverable sessions:', interrupted.sessions.map((s: { sessionId: string }) => s.sessionId).join(', '));
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:229:| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | Token-pressure policy for memory_context responses. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:230:| `SPECKIT_AUTO_RESUME` | `true` | boolean | Automatic session resume context injection for memory_context. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:147:  const userIdProvided = typeof args.actorUserId === 'string';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:148:  const agentIdProvided = typeof args.actorAgentId === 'string';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:151:  const hasBlankUser = userIdProvided && normalizedUserId.length === 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:152:  const hasBlankAgent = agentIdProvided && normalizedAgentId.length === 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:210:  tenantId?: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:212:  const normalizedTenantId = typeof tenantId === 'string' ? tenantId.trim() : '';
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
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:762:      ? getAllowedSharedSpaceIdsForCaller(db, actor, args.tenantId)
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:772:        tenantId: args.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:773:        userId: actor.subjectType === 'user' ? actor.subjectId : null,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:774:        agentId: actor.subjectType === 'agent' ? actor.subjectId : null,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:911:| \`/memory:manage shared create <spaceId> <tenantId> <name>\` | Create or update a shared space; first creator becomes owner |
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:11:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:87:  sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:95:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:112:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:113:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:114:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:115:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:197:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:207:  // T73 SECURITY: Validate caller-supplied sessionId through server-side session
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:210:  let sessionId: string | undefined = rawSessionId;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:213:      tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:214:      userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:215:      agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:220:        tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:225:          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:229:    sessionId = trustedSession.effectiveSessionId;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:274:    sessionId &&
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:281:      decayStats = { decayedCount: workingMemory.batchUpdateScores(sessionId as string) };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:284:      console.warn('[memory_match_triggers] Decay failed:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:292:  const { specFolder, tenantId, userId, agentId, sharedSpaceId } = args;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:293:  if (specFolder || tenantId || userId || agentId || sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:317:          if (tenantId && row.tenant_id !== tenantId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:318:          if (userId && row.user_id !== userId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:319:          if (agentId && row.agent_id !== agentId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:320:          if (sharedSpaceId && row.shared_space_id !== sharedSpaceId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:336:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:343:          sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:370:        workingMemory.setAttentionScore(sessionId as string, match.memoryId, 1.0);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:374:        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:390:          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:398:    const sessionMemories: WorkingMemoryEntry[] = workingMemory.getSessionMemories(sessionId as string)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:469:      sessionId: sessionId!,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:491:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:499:  if (!useCognitive && sessionId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:511:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:540:        session_id: sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:565:  handle_memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts:6:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:6:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:7:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:26:// Feature catalog: Memory indexing (memory_save)
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
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:131:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:132:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:133:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:134:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:254:      actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:284:      recordHistory(memory_id, 'ADD', null, parsed.title ?? filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:291:          'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:17:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:8:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:10:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:131:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:132:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:133:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:134:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:135:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:138:  governedAt?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:168:  governed_at?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:177:  tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:178:  userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:179:  agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:180:  sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:181:  sharedSpaceId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:3:description: "Decomposed pipeline modules for the memory_save MCP tool handler, covering dedup, embedding, PE gating, record creation, reconsolidation and response assembly."
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:27:`handlers/save/` contains the decomposed pipeline for the `memory_save` MCP tool. Each file owns a single stage of the save flow, from deduplication through embedding generation, save quality gating, prediction-error gating, reconsolidation, record creation, post-insert enrichment, and final response assembly.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:45:| `post-insert.ts`            | Post-insert enrichment pipeline. Runs causal links processing, R10 entity extraction, R8 summary generation and S5 cross-document entity linking. Each step is feature-flag gated and independently error-guarded. |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:46:| `response-builder.ts`       | Final response assembly. `buildIndexResult` constructs the `IndexResult` with PE actions, causal links and warnings. `buildSaveResponse` wraps it in a standard MCP success envelope with hints, triggers post-mutation hooks and runs N3-lite consolidation. |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:60:8. post-insert    -- Enrich with entities, summaries, causal links
.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts:19:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:36:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:124: * Result payload from reconsolidation pre-checks during memory_save.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:171:  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:210:                if (scope?.tenantId && r.tenant_id && r.tenant_id !== scope.tenantId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:211:                if (scope?.userId && r.user_id && r.user_id !== scope.userId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:212:                if (scope?.agentId && r.agent_id && r.agent_id !== scope.agentId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:213:                if (scope?.sharedSpaceId && r.shared_space_id && r.shared_space_id !== scope.sharedSpaceId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:301:                recordHistory(id, 'ADD', null, memory.title ?? memory.filePath ?? null, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:322:            reason: `memory_save: reconsolidation ${reconResult.action}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:329:              tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:335:            actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:60:// Feature catalog: Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:79:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:80:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:81:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:82:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:84:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:116:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:117:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:118:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:119:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:121:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:704:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:705:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:706:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:707:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:709:    session_id: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:725:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:726:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:727:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:728:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:734:    sessionId: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:756:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:757:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:758:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:759:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:765:    sessionId: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:790:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:791:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:792:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:793:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:799:    sessionId: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:828:  const trustedSession = sessionManager.resolveTrustedSession(args.sessionId ?? null, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:829:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:830:    userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:831:    agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1078:/** Handle memory_context tool — L1 orchestration layer that routes to optimal retrieval strategy.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1092:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1117:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1231:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1234:      details: { requestId, layer: 'L1:Orchestration', requestedSessionId: args.sessionId ?? null },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1236:        hint: 'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1250:  const layerInfo: LayerInfo | null = layerDefs.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1281:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1282:    userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1283:    agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1284:    sharedSpaceId: args.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1286:    sessionId: effectiveSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1318:  // Phase C: Intent-to-profile auto-routing for memory_context.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1354:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1355:    userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1356:    agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1375:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1393:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1471:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1478:      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1583:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1584:      error: 'memory_context failed due to an internal error',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1606:const handle_memory_context = handleMemoryContext;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1609:  handle_memory_context,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:18:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:35:  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:45:      tenantId: scope?.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:46:      userId: scope?.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:47:      agentId: scope?.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:48:      sessionId: scope?.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:49:      sharedSpaceId: scope?.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:88:            reason: 'memory_save: reinforced existing memory via prediction-error gate',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:93:              tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:99:            actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:140:          reason: 'memory_save: updated existing memory via prediction-error gate',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:145:            tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:151:          actor: 'mcp:memory_save',
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
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:92:  sessionId?: string;
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
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:228:    scope.tenantId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:229:    || scope.userId !== undefined

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1078,1290p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1078	/** Handle memory_context tool — L1 orchestration layer that routes to optimal retrieval strategy.
  1079	 * @param args - Context retrieval arguments (intent, mode, specFolder, anchors, etc.)
  1080	 * @returns MCP response with context-aware memory results
  1081	 */
  1082	async function handleMemoryContext(args: ContextArgs): Promise<MCPResponse> {
  1083	  const _contextStartTime = Date.now();
  1084	  const requestId = randomUUID();
  1085	
  1086	  try {
  1087	  try {
  1088	    await checkDatabaseUpdated();
  1089	  } catch (error: unknown) {
  1090	    const message = error instanceof Error ? error.message : String(error);
  1091	    return createMCPErrorResponse({
  1092	      tool: 'memory_context',
  1093	      error: `Database state check failed: ${message}`,
  1094	      code: 'E_INTERNAL',
  1095	      details: { requestId, layer: 'L1:Orchestration' },
  1096	      recovery: {
  1097	        hint: 'The memory database may be unavailable. Retry or check database connectivity.',
  1098	      },
  1099	    });
  1100	  }
  1101	
  1102	  const {
  1103	    input,
  1104	    mode: requested_mode = 'auto',
  1105	    intent: explicit_intent,
  1106	    specFolder: spec_folder,
  1107	    limit,
  1108	    enableDedup: enableDedup = true,
  1109	    includeContent: include_content = false,
  1110	    tokenUsage,
  1111	    anchors
  1112	  } = args;
  1113	
  1114	  // Validate input
  1115	  if (!input || typeof input !== 'string' || input.trim().length === 0) {
  1116	    return createMCPErrorResponse({
  1117	      tool: 'memory_context',
  1118	      error: 'Input is required and must be a non-empty string',
  1119	      code: 'E_VALIDATION',
  1120	      details: { requestId, layer: 'L1:Orchestration' },
  1121	      recovery: {
  1122	        hint: 'Provide a query, prompt, or context description'
  1123	      }
  1124	    });
  1125	  }
  1126	
  1127	  const normalizedInput = input.trim();
  1128	
  1129	  // ── Phase 020: Query-Intent Routing ──────────────────────────
  1130	  // Classify query intent and optionally augment response with code
  1131	  // graph context for structural/hybrid queries. Entire block is
  1132	  // wrapped in try/catch — any failure silently falls through to
  1133	  // existing semantic logic.
  1134	  let queryIntentMetadata: {
  1135	    queryIntent: string;
  1136	    routedBackend: string;
  1137	    confidence: number;
  1138	    matchedKeywords?: string[];
  1139	  } | null = null;
  1140	  let graphContextResult: Record<string, unknown> | null = null;
  1141	
  1142	  if (requested_mode !== 'resume') {
  1143	    try {
  1144	      const classification = classifyQueryIntent(normalizedInput);
  1145	      queryIntentMetadata = {
  1146	        queryIntent: classification.intent,
  1147	        routedBackend: classification.intent === 'structural' && classification.confidence > 0.65
  1148	          ? 'structural'
  1149	          : classification.intent === 'hybrid'
  1150	            ? 'hybrid'
  1151	            : 'semantic',
  1152	        confidence: classification.confidence,
  1153	        matchedKeywords: classification.matchedKeywords,
  1154	      };
  1155	
  1156	      // F050: Extract a symbol-like token from the query instead of passing
  1157	      // raw prose to buildContext({ subject }). resolveSubjectToRef() matches
  1158	      // against code_nodes.name / fq_name, so prose never resolves.
  1159	      // Heuristic: pick the first token that looks like a code identifier
  1160	      // (contains uppercase, underscore, or dot — e.g. "buildContext", "fq_name",
  1161	      // "code-graph-db.ts"). Falls back to first matched keyword, then normalizedInput.
  1162	      const codeIdentifierPattern = /[A-Z_.]|^[a-z]+[A-Z]/;
  1163	      const inputTokens = normalizedInput.split(/\s+/).filter(t => t.length >= 2);
  1164	      const extractedSubject =
  1165	        inputTokens.find(t => codeIdentifierPattern.test(t)) ??
  1166	        (classification.matchedKeywords?.[0]) ??
  1167	        normalizedInput;
  1168	
  1169	      if (classification.intent === 'structural' && classification.confidence > 0.65) {
  1170	        try {
  1171	          const cgResult = buildContext({ input: normalizedInput, subject: extractedSubject });
  1172	          if (cgResult.metadata.totalNodes > 0) {
  1173	            graphContextResult = {
  1174	              graphContext: cgResult.graphContext,
  1175	              textBrief: cgResult.textBrief,
  1176	              combinedSummary: cgResult.combinedSummary,
  1177	              nextActions: cgResult.nextActions,
  1178	              metadata: cgResult.metadata,
  1179	            };
  1180	          }
  1181	        } catch {
  1182	          // Code graph unavailable — fall through to semantic
  1183	        }
  1184	      } else if (classification.intent === 'hybrid') {
  1185	        try {
  1186	          const cgResult = buildContext({ input: normalizedInput, subject: extractedSubject });
  1187	          if (cgResult.metadata.totalNodes > 0) {
  1188	            graphContextResult = {
  1189	              graphContext: cgResult.graphContext,
  1190	              textBrief: cgResult.textBrief,
  1191	              combinedSummary: cgResult.combinedSummary,
  1192	              nextActions: cgResult.nextActions,
  1193	              metadata: cgResult.metadata,
  1194	            };
  1195	          }
  1196	        } catch {
  1197	          // Code graph unavailable — hybrid degrades to semantic-only
  1198	        }
  1199	      }
  1200	      // 'semantic' or low-confidence: no graph context, fall through
  1201	    } catch {
  1202	      // Classification failed — fall through to existing logic entirely
  1203	    }
  1204	  }
  1205	
  1206	  // Eval logger — capture context query at entry (fail-safe)
  1207	  let _evalQueryId = 0;
  1208	  let _evalRunId = 0;
  1209	  try {
  1210	    const evalEntry = logSearchQuery({
  1211	      query: normalizedInput,
  1212	      intent: explicit_intent ?? null,
  1213	      specFolder: spec_folder ?? null,
  1214	    });
  1215	    _evalQueryId = evalEntry.queryId;
  1216	    _evalRunId = evalEntry.evalRunId;
  1217	  } catch {
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
  1261	
  1262	  // Resolve token pressure (caller -> estimator -> unavailable)
  1263	  const pressurePolicyEnabled = isPressurePolicyEnabled(effectiveSessionId);
  1264	  const autoResumeEnabled = isAutoResumeEnabled(effectiveSessionId);
  1265	
  1266	  const pressurePolicy = pressurePolicyEnabled
  1267	    ? getPressureLevel(tokenUsage, runtimeContextStats)
  1268	    : {
  1269	        level: 'none' as const,
  1270	        ratio: null,
  1271	        source: 'unavailable' as const,
  1272	        warning: null,
  1273	      };
  1274	  if (pressurePolicy.warning) {
  1275	    console.warn(pressurePolicy.warning);
  1276	  }
  1277	
  1278	  // Build options object for strategy executors
  1279	  const options: ContextOptions = {
  1280	    specFolder: spec_folder,
  1281	    tenantId: args.tenantId,
  1282	    userId: args.userId,
  1283	    agentId: args.agentId,
  1284	    sharedSpaceId: args.sharedSpaceId,
  1285	    limit,
  1286	    sessionId: effectiveSessionId,
  1287	    enableDedup: enableDedup,
  1288	    includeContent: include_content,
  1289	    includeTrace: (args as unknown as Record<string, unknown>).includeTrace === true, // CHK-040
  1290	    anchors,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '184,330p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts | sed -n '96,140p;248,295p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts | sed -n '720,860p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   720	
   721	    const summary = `Causal graph: ${safeTotalEdges} edges, ${coveragePercent}% coverage (${health})`;
   722	
   723	    const hints: string[] = [];
   724	    if (!meetsTarget) {
   725	      hints.push(`Coverage ${coveragePercent}% below 60% target - add more causal links`);
   726	    }
   727	    if (orphanedEdges.length > 0) {
   728	      hints.push(`${orphanedEdges.length} orphaned edges detected - consider cleanup`);
   729	    }
   730	    if (stats.totalEdges === 0) {
   731	      hints.push('No causal links exist yet - use memory_causal_link to create relationships');
   732	    }
   733	
   734	    return createMCPSuccessResponse({
   735	      tool: 'memory_causal_stats',
   736	      summary,
   737	      data: {
   738	        total_edges: safeTotalEdges,
   739	        by_relation: stats.byRelation,
   740	        avg_strength: stats.avgStrength,
   741	        unique_sources: stats.uniqueSources,
   742	        unique_targets: stats.uniqueTargets,
   743	        link_coverage_percent: coveragePercent + '%',
   744	        orphanedEdges: orphanedEdges.length,
   745	        health,
   746	        targetCoverage: '60%',
   747	        currentCoverage: coveragePercent + '%',
   748	        meetsTarget: meetsTarget
   749	      },
   750	      hints,
   751	      startTime: startTime
   752	    });
   753	  } catch (error: unknown) {
   754	    return createSanitizedCausalError(
   755	      'memory_causal_stats',
   756	      error,
   757	      ErrorCodes.CAUSAL_GRAPH_ERROR,
   758	      {},
   759	      startTime,
   760	      'Causal graph statistics failed.',
   761	    );
   762	  }
   763	}
   764	
   765	/* ───────────────────────────────────────────────────────────────
   766	   5. CAUSAL UNLINK HANDLER
   767	──────────────────────────────────────────────────────────────── */
   768	
   769	/** Handle memory_causal_unlink tool - deletes a causal edge by ID */
   770	async function handleMemoryCausalUnlink(args: CausalUnlinkArgs): Promise<MCPResponse> {
   771	  const { edgeId } = args;
   772	  const startTime = Date.now();
   773	
   774	  if (edgeId === undefined || edgeId === null) {
   775	    return createMCPErrorResponse({
   776	      tool: 'memory_causal_unlink',
   777	      error: 'edgeId is required',
   778	      code: 'E031',
   779	      details: { param: 'edgeId' },
   780	      recovery: {
   781	        hint: 'Provide the edge ID to delete',
   782	        actions: [
   783	          'Use memory_drift_why() to find edge IDs',
   784	          'Use memory_causal_stats() to see graph overview'
   785	        ],
   786	        severity: 'error'
   787	      },
   788	      startTime: startTime
   789	    });
   790	  }
   791	
   792	  try {
   793	    await checkDatabaseUpdated();
   794	
   795	    vectorIndex.initializeDb();
   796	    const db = vectorIndex.getDb();
   797	    if (!db) {
   798	      return createMCPErrorResponse({
   799	        tool: 'memory_causal_unlink',
   800	        error: 'Database not initialized. Server may still be starting up.',
   801	        code: 'E020',
   802	        details: {},
   803	        recovery: getRecoveryHint('memory_causal_unlink', 'E020'),
   804	        startTime: startTime
   805	      });
   806	    }
   807	    causalEdges.init(db);
   808	
   809	    const result: { deleted: boolean } = { deleted: causalEdges.deleteEdge(edgeId) };
   810	
   811	    const summary = result.deleted
   812	      ? `Deleted causal edge ${edgeId}`
   813	      : `Edge ${edgeId} not found`;
   814	
   815	    const hints: string[] = [];
   816	    if (!result.deleted) {
   817	      hints.push('Use memory_drift_why() to find valid edge IDs');
   818	    }
   819	
   820	    return createMCPSuccessResponse({
   821	      tool: 'memory_causal_unlink',
   822	      summary,
   823	      data: result,
   824	      hints,
   825	      startTime: startTime
   826	    });
   827	  } catch (error: unknown) {
   828	    return createSanitizedCausalError(
   829	      'memory_causal_unlink',
   830	      error,
   831	      ErrorCodes.CAUSAL_GRAPH_ERROR,
   832	      { edgeId },
   833	      startTime,
   834	      'Causal edge deletion failed.',
   835	    );
   836	  }
   837	}
   838	
   839	/* ───────────────────────────────────────────────────────────────
   840	   6. EXPORTS
   841	──────────────────────────────────────────────────────────────── */
   842	
   843	export {
   844	  handleMemoryDriftWhy,
   845	  handleMemoryCausalLink,
   846	  handleMemoryCausalStats,
   847	  handleMemoryCausalUnlink,
   848	  flattenCausalTree,
   849	};
   850	
   851	// Backward-compatible aliases (snake_case)
   852	const handle_memory_drift_why = handleMemoryDriftWhy;
   853	const handle_memory_causal_link = handleMemoryCausalLink;
   854	const handle_memory_causal_stats = handleMemoryCausalStats;
   855	const handle_memory_causal_unlink = handleMemoryCausalUnlink;
   856	
   857	export {
   858	  handle_memory_drift_why,
   859	  handle_memory_causal_link,
   860	  handle_memory_causal_stats,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts | sed -n '430,560p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -n \"async function handleMemoryCausalLink|async function handleMemoryDriftWhy|memory_causal_link\" .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts | sed -n '1,80p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
103:  tool: 'memory_drift_why' | 'memory_causal_link' | 'memory_causal_stats' | 'memory_causal_unlink',
339:async function handleMemoryDriftWhy(args: DriftWhyArgs): Promise<MCPResponse> {
490:          'Use memory_causal_link to create relationships',
557:/** Handle memory_causal_link tool - creates a causal edge between two memories */
558:async function handleMemoryCausalLink(args: CausalLinkArgs): Promise<MCPResponse> {
576:      tool: 'memory_causal_link',
603:        tool: 'memory_causal_link',
607:        recovery: getRecoveryHint('memory_causal_link', 'E020'),
616:        tool: 'memory_causal_link',
620:        recovery: getRecoveryHint('memory_causal_link', ErrorCodes.CAUSAL_INVALID_RELATION),
629:        tool: 'memory_causal_link',
633:        recovery: getRecoveryHint('memory_causal_link', ErrorCodes.CAUSAL_GRAPH_ERROR),
639:      tool: 'memory_causal_link',
653:      'memory_causal_link',
731:      hints.push('No causal links exist yet - use memory_causal_link to create relationships');
853:const handle_memory_causal_link = handleMemoryCausalLink;
859:  handle_memory_causal_link,

 succeeded in 0ms:
   430	          SELECT id, title, spec_folder, importance_tier, importance_weight,
   431	                 context_type, created_at, updated_at, file_path
   432	          FROM memory_index
   433	          WHERE id = ? OR CAST(id AS TEXT) = ?
   434	        `).get(memoryId, String(memoryId)) as Record<string, unknown> | undefined;
   435	
   436	        if (sourceMemory) {
   437	          memoryDetails = sourceMemory;
   438	        }
   439	
   440	        const memoryIds = new Set<string>();
   441	        for (const edge of combinedChain.all) {
   442	          memoryIds.add(edge.from);
   443	          memoryIds.add(edge.to);
   444	        }
   445	
   446	        if (memoryIds.size > 0) {
   447	          const idsArray = Array.from(memoryIds);
   448	          for (const id of idsArray) {
   449	            const memory = db.prepare(`
   450	              SELECT id, title, spec_folder, importance_tier, created_at
   451	              FROM memory_index
   452	              WHERE id = ? OR CAST(id AS TEXT) = ?
   453	            `).get(id, String(id)) as Record<string, unknown> | undefined;
   454	            if (memory) {
   455	              relatedMemories[id] = memory;
   456	            }
   457	          }
   458	        }
   459	      }
   460	
   461	      return {
   462	        incomingChain,
   463	        outgoingChain,
   464	        combinedChain,
   465	        memoryDetails,
   466	        relatedMemories,
   467	      };
   468	    };
   469	
   470	    const traversalSnapshot = typeof db.transaction === 'function'
   471	      ? db.transaction(readTraversalSnapshot)()
   472	      : readTraversalSnapshot();
   473	    const {
   474	      incomingChain,
   475	      outgoingChain,
   476	      combinedChain,
   477	      memoryDetails,
   478	      relatedMemories,
   479	    } = traversalSnapshot;
   480	
   481	    if (combinedChain.total_edges === 0) {
   482	      return createMCPEmptyResponse({
   483	        tool: 'memory_drift_why',
   484	        summary: `No causal relationships found for memory ${memoryId}`,
   485	        data: {
   486	          memoryId: String(memoryId),
   487	          memory: memoryDetails
   488	        },
   489	        hints: [
   490	          'Use memory_causal_link to create relationships',
   491	          'Consider linking to related decisions or contexts'
   492	        ],
   493	        startTime: startTime
   494	      });
   495	    }
   496	
   497	    const relationSummary: string[] = [];
   498	    const incomingSummary = formatRelationSummary(incomingChain, 'incoming');
   499	    const outgoingSummary = formatRelationSummary(outgoingChain, 'outgoing');
   500	    if (incomingSummary) relationSummary.push(incomingSummary);
   501	    if (outgoingSummary) relationSummary.push(outgoingSummary);
   502	
   503	    const summary = relationSummary.length > 0
   504	      ? `Found ${combinedChain.total_edges} causal relationships (${relationSummary.join('; ')})`
   505	      : `Found ${combinedChain.total_edges} causal relationships`;
   506	
   507	    const hints: string[] = [];
   508	    if (combinedChain.max_depth_reached) {
   509	      hints.push(`Max depth (${maxDepth}) reached - more relationships may exist beyond this depth`);
   510	    }
   511	    if (combinedChain.truncated) {
   512	      hints.push(
   513	        `Traversal truncated after ${combinedChain.truncation_limit ?? causalEdges.MAX_EDGES_LIMIT} edges per node - results may be incomplete`
   514	      );
   515	    }
   516	    if (combinedChain.by_contradicts.length > 0) {
   517	      hints.push('Contradicting relationships detected - review for consistency');
   518	    }
   519	
   520	    return createMCPSuccessResponse({
   521	      tool: 'memory_drift_why',
   522	      summary,
   523	      data: {
   524	        memoryId: String(memoryId),
   525	        memory: memoryDetails,
   526	        incoming: toDirectionalBuckets(incomingChain),
   527	        outgoing: toDirectionalBuckets(outgoingChain),
   528	        allEdges: combinedChain.all,
   529	        totalEdges: combinedChain.total_edges,
   530	        totalIncomingEdges: incomingChain.total_edges,
   531	        totalOutgoingEdges: outgoingChain.total_edges,
   532	        maxDepthReached: combinedChain.max_depth_reached,
   533	        truncated: combinedChain.truncated,
   534	        truncationLimit: combinedChain.truncation_limit,
   535	        relatedMemories: Object.keys(relatedMemories).length > 0 ? relatedMemories : null,
   536	        traversalOptions: { direction: mappedDirection, maxDepth }
   537	      },
   538	      hints,
   539	      startTime: startTime
   540	    });
   541	  } catch (error: unknown) {
   542	    return createSanitizedCausalError(
   543	      'memory_drift_why',
   544	      error,
   545	      ErrorCodes.TRAVERSAL_ERROR,
   546	      { memoryId },
   547	      startTime,
   548	      'Causal traversal failed.',
   549	    );
   550	  }
   551	}
   552	
   553	/* ───────────────────────────────────────────────────────────────
   554	   3. CAUSAL LINK HANDLER
   555	──────────────────────────────────────────────────────────────── */
   556	
   557	/** Handle memory_causal_link tool - creates a causal edge between two memories */
   558	async function handleMemoryCausalLink(args: CausalLinkArgs): Promise<MCPResponse> {
   559	  const {
   560	    sourceId,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts | sed -n '557,660p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   557	/** Handle memory_causal_link tool - creates a causal edge between two memories */
   558	async function handleMemoryCausalLink(args: CausalLinkArgs): Promise<MCPResponse> {
   559	  const {
   560	    sourceId,
   561	    targetId,
   562	    relation,
   563	    strength = 1.0,
   564	    evidence = null
   565	  } = args;
   566	
   567	  const startTime = Date.now();
   568	
   569	  if ((sourceId === undefined || sourceId === null) || (targetId === undefined || targetId === null) || !relation) {
   570	    const missing: string[] = [];
   571	    if (sourceId === undefined || sourceId === null) missing.push('sourceId');
   572	    if (targetId === undefined || targetId === null) missing.push('targetId');
   573	    if (!relation) missing.push('relation');
   574	
   575	    return createMCPErrorResponse({
   576	      tool: 'memory_causal_link',
   577	      error: `Missing required parameters: ${missing.join(', ')}`,
   578	      code: 'E031',
   579	      details: {
   580	        missingParams: missing,
   581	        validRelations: Object.values(causalEdges.RELATION_TYPES) as string[]
   582	      },
   583	      recovery: {
   584	        hint: 'Provide all required parameters to create a causal link',
   585	        actions: [
   586	          'sourceId: Memory ID that is the cause/source',
   587	          'targetId: Memory ID that is the effect/target',
   588	          `relation: One of ${Object.values(causalEdges.RELATION_TYPES).join(', ')}`
   589	        ],
   590	        severity: 'error'
   591	      },
   592	      startTime: startTime
   593	    });
   594	  }
   595	
   596	  try {
   597	    await checkDatabaseUpdated();
   598	
   599	    vectorIndex.initializeDb();
   600	    const db = vectorIndex.getDb();
   601	    if (!db) {
   602	      return createMCPErrorResponse({
   603	        tool: 'memory_causal_link',
   604	        error: 'Database not initialized. Server may still be starting up.',
   605	        code: 'E020',
   606	        details: {},
   607	        recovery: getRecoveryHint('memory_causal_link', 'E020'),
   608	        startTime: startTime
   609	      });
   610	    }
   611	    causalEdges.init(db);
   612	
   613	    const validRelations = Object.values(causalEdges.RELATION_TYPES) as string[];
   614	    if (!validRelations.includes(relation)) {
   615	      return createMCPErrorResponse({
   616	        tool: 'memory_causal_link',
   617	        error: `Invalid relation type: '${relation}'. Must be one of: ${validRelations.join(', ')}`,
   618	        code: ErrorCodes.CAUSAL_INVALID_RELATION,
   619	        details: { relation, validRelations },
   620	        recovery: getRecoveryHint('memory_causal_link', ErrorCodes.CAUSAL_INVALID_RELATION),
   621	        startTime: startTime
   622	      });
   623	    }
   624	    const safeRelation = relation as causalEdges.RelationType;
   625	    const edge = causalEdges.insertEdge(String(sourceId), String(targetId), safeRelation, strength ?? 1.0, evidence ?? null);
   626	
   627	    if (!edge) {
   628	      return createMCPErrorResponse({
   629	        tool: 'memory_causal_link',
   630	        error: 'Causal link creation failed.',
   631	        code: ErrorCodes.CAUSAL_GRAPH_ERROR,
   632	        details: { sourceId, targetId, relation },
   633	        recovery: getRecoveryHint('memory_causal_link', ErrorCodes.CAUSAL_GRAPH_ERROR),
   634	        startTime: startTime
   635	      });
   636	    }
   637	
   638	    return createMCPSuccessResponse({
   639	      tool: 'memory_causal_link',
   640	      summary: `Created causal link: ${sourceId} --[${relation}]--> ${targetId}`,
   641	      data: {
   642	        success: true,
   643	        edge
   644	      },
   645	      hints: [
   646	        `Use memory_drift_why({ memoryId: "${targetId}" }) to trace this relationship`,
   647	        'Use memory_causal_stats() to check overall graph coverage'
   648	      ],
   649	      startTime: startTime
   650	    });
   651	  } catch (error: unknown) {
   652	    return createSanitizedCausalError(
   653	      'memory_causal_link',
   654	      error,
   655	      ErrorCodes.CAUSAL_GRAPH_ERROR,
   656	      { sourceId, targetId, relation },
   657	      startTime,
   658	      'Causal link creation failed.',
   659	    );
   660	  }

codex
One compatibility wrinkle showed up clearly: Public already has compaction/recovery prompts in its runtime hooks, but they’re aimed at `memory_context(resume)` and structural recovery rather than lightweight store/recall/delete reminders. I’m pulling those hook lines now because they’re the key to deciding whether Mnemosyne’s prompt injection is complementary, redundant, or conflicting in our current transport stack.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts | sed -n '45,80p;100,170p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    45	  const state = loadState(sessionId);
    46	  const pendingCompactPrime = readCompactPrime(sessionId);
    47	  if (!pendingCompactPrime) {
    48	    hookLog('warn', 'gemini:session-prime', `No cached compact payload for session ${sessionId}`);
    49	    return [{
    50	      title: 'Context Recovery',
    51	      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
    52	    }];
    53	  }
    54	
    55	  const { payload, cachedAt } = pendingCompactPrime;
    56	  const cachedAtMs = new Date(cachedAt).getTime();
    57	  const cacheAgeMs = Date.now() - cachedAtMs;
    58	  if (Number.isNaN(cachedAtMs) || cacheAgeMs >= CACHE_TTL_MS) {
    59	    hookLog('warn', 'gemini:session-prime', `Rejecting stale compact cache (cached at ${cachedAt})`);
    60	    return [{
    61	      title: 'Context Recovery',
    62	      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
    63	    }];
    64	  }
    65	
    66	  hookLog('info', 'gemini:session-prime', `Injecting cached compact brief (${payload.length} chars, cached at ${cachedAt})`);
    67	
    68	  const wrappedPayload = wrapRecoveredCompactPayload(payload, cachedAt);
    69	  const sections: OutputSection[] = [
    70	    { title: 'Recovered Context (Post-Compression)', content: wrappedPayload },
    71	    {
    72	      title: 'Recovery Instructions',
    73	      content: 'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
    74	    },
    75	  ];
    76	
    77	  if (state?.lastSpecFolder) {
    78	    sections.push({
    79	      title: 'Active Spec Folder',
    80	      content: `Last active: ${state.lastSpecFolder}`,
   100	        'What would you like to work on?',
   101	      ].join('\n'),
   102	    },
   103	    {
   104	      title: 'Recovery Tools',
   105	      content: [
   106	        '- `memory_context({ input, mode })` - unified context retrieval',
   107	        '- `memory_match_triggers({ prompt })` - fast trigger matching',
   108	        '- `memory_search({ query })` - semantic search',
   109	        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
   110	      ].join('\n'),
   111	    },
   112	  ];
   113	  if (startupBrief?.graphOutline) {
   114	    sections.push({
   115	      title: 'Structural Context',
   116	      content: startupBrief.graphOutline,
   117	    });
   118	  } else if (startupBrief?.graphState === 'empty') {
   119	    sections.push({
   120	      title: 'Structural Context',
   121	      content: 'Code graph index is empty. Run `code_graph_scan` to build structural context.',
   122	    });
   123	  }
   124	
   125	  if (startupBrief?.sessionContinuity) {
   126	    sections.push({
   127	      title: 'Session Continuity',
   128	      content: startupBrief.sessionContinuity,
   129	    });
   130	  }
   131	
   132	  if (startupBrief?.graphState === 'stale') {
   133	    sections.push({
   134	      title: 'Stale Code Graph Warning',
   135	      content: 'Code graph freshness is stale. The first structural read may refresh inline when safe; run `code_graph_scan` for broader stale states.',
   136	    });
   137	  }
   138	
   139	  return sections;
   140	}
   141	
   142	/** Handle source=resume: load resume context */
   143	function handleResume(sessionId: string): OutputSection[] {
   144	  const state = loadState(sessionId);
   145	
   146	  if (state?.lastSpecFolder) {
   147	    return [{
   148	      title: 'Session Continuity',
   149	      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
   150	    }];
   151	  }
   152	
   153	  return [{
   154	    title: 'Session Resume',
   155	    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
   156	  }];
   157	}
   158	
   159	/** Handle source=clear: minimal output */
   160	function handleClear(): OutputSection[] {
   161	  return [{
   162	    title: 'Fresh Context',
   163	    content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
   164	  }];
   165	}
   166	
   167	async function main(): Promise<void> {
   168	  ensureStateDir();
   169	
   170	  const input = await withTimeout(parseGeminiStdin(), HOOK_TIMEOUT_MS, null);

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts | sed -n '45,90p;135,205p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   135	      content: startupSurface,
   136	    },
   137	    {
   138	      title: 'Recovery Tools',
   139	      content: [
   140	        '- `memory_context({ input, mode })` — unified context retrieval',
   141	        '- `memory_match_triggers({ prompt })` — fast trigger matching',
   142	        '- `memory_search({ query })` — semantic search',
   143	        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
   144	      ].join('\n'),
   145	    },
   146	  ];
   147	  if (startupBrief?.graphOutline) {
   148	    sections.push({
   149	      title: 'Structural Context',
   150	      content: startupBrief.graphOutline,
   151	    });
   152	  } else if (startupBrief?.graphState === 'empty') {
   153	    sections.push({
   154	      title: 'Structural Context',
   155	      content: 'Code graph index is empty. Run `code_graph_scan` to build structural context.',
   156	    });
   157	  }
   158	
   159	  if (sessionContinuity) {
   160	    sections.push({
   161	      title: 'Session Continuity',
   162	      content: sessionContinuity,
   163	    });
   164	  }
   165	
   166	  if (startupBrief?.graphState === 'stale') {
   167	    sections.push({
   168	      title: 'Stale Code Graph Warning',
   169	      content: 'Code graph freshness is stale. The first structural read may refresh inline when safe; run `code_graph_scan` for broader stale states.',
   170	    });
   171	  }
   172	
   173	  return sections;
   174	}
   175	
   176	/** Handle source=resume: load resume context for continued session */
   177	function handleResume(sessionId: string): OutputSection[] {
   178	  const state = loadState(sessionId);
   179	  const startupBrief = buildStartupBrief ? buildStartupBrief() : null;
   180	  const sections: OutputSection[] = [];
   181	
   182	  if (state?.lastSpecFolder) {
   183	    sections.push({
   184	      title: 'Session Continuity',
   185	      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
   186	    });
   187	  } else {
   188	    sections.push({
   189	      title: 'Session Resume',
   190	      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
   191	    });
   192	  }
   193	
   194	  return sections;
   195	}
   196	
   197	/** Handle source=clear: minimal output after /clear */
   198	function handleClear(): OutputSection[] {
   199	  return [
   200	    {
   201	      title: 'Fresh Context',
   202	      content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
   203	    },
   204	  ];
   205	}

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '110,140p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "find .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external -maxdepth 2 \\( -name 'AGENTS.md' -o -name '*.md' -o -name '*.ts' -o -name '*.json' \\) | sort" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package-lock.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/tsconfig.json

exec
/bin/zsh -lc "rg -n \"core=true|core\\)|core \\(|core\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -n \"Companion lifecycle helpers|Semantic/concept code search|Structural queries|session_bootstrap|code_graph_query|memory_context\\(|memory_match_triggers\\(|memory_search\\(\" .opencode/skill/mcp-coco-index/README.md .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:43:| `memory_store` | Store a project-scoped memory (optionally as `core`) |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:44:| `memory_store_global` | Store a cross-project memory (optionally as `core`) |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:57:| Core (project) | `<directory-name>` (tagged `core`) | Sessions + survives compaction |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:58:| Core (global) | `global` (tagged `core`) | All projects + survives compaction |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:74:- Mark critical, always-relevant context as core (core=true) — but use sparingly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:140:          "Store a project memory: a decision, preference, or important context. One concise concept per memory. Set core=true for critical context that should always be available in every session (use sparingly).",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:143:          core: tool.schema.boolean().optional().describe(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:150:          if (args.core) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:151:            cmdArgs.push("--tag", "core");
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:162:          "Store a cross-project memory: personal preferences, coding style, tool choices. Set core=true for critical cross-project context that should always be available.",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:165:          core: tool.schema.boolean().optional().describe(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:185:          if (args.core) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:186:            cmdArgs.push("--tag", "core");
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:220:- Use **core** for facts that should always be in context (project architecture, key conventions, user preferences).

 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:51:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:62:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:73:      content: 'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:106:        '- `memory_context({ input, mode })` - unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:107:        '- `memory_match_triggers({ prompt })` - fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:108:        '- `memory_search({ query })` - semantic search',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:109:        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:149:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:155:    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:50:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:61:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:77:      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:140:        '- `memory_context({ input, mode })` — unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:141:        '- `memory_match_triggers({ prompt })` — fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:142:        '- `memory_search({ query })` — semantic search',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:143:        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:185:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:190:      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:53:    preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:153:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:154:    message: 'Advisory only: when the next question is about callers, imports, dependencies, or outline, prefer `code_graph_query` before Grep or Glob.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:155:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163:/** Handle session_bootstrap tool call — one-call session setup */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:236:    { label: 'session_bootstrap structural context payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:243:      { label: 'session_bootstrap resume payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:213:  'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:254:  preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:320:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:322:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:786:  lines.push('- If structural context shows "ready": code_graph_query is available for structural lookups');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:796:      routingRules.push('Semantic/concept code search → mcp__cocoindex_code__search');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:799:      routingRules.push('Structural queries (callers, imports, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:886:      recordMetricEvent({ kind: 'code_graph_query' });
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:985:            existingHints.push('Tip: For code search queries, consider using mcp__cocoindex_code__search for semantic code search or code_graph_query for structural lookups.');
.opencode/skill/mcp-coco-index/README.md:66:| `code_graph_query` | You need exact callers, imports, or structural dependencies | Requires the structural graph to be indexed first |

codex
The evidence set is stable now. I’m doing one short cleanup pass for exact citations and then I’ll write the iteration in the requested schema, including the validation note, ruled-out approaches, and the specific compatibility conflicts with scope governance, compaction prompts, and code-search/tool-routing boundaries.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '668,680p;754,764p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '145,160p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

 succeeded in 0ms:
   668	
   669	- deep-review-reducer-schema.vitest.ts, release-blocking, .deep-review-pause, scratch/changelog, create:changelog gated
   670	
   671	## User preferences
   672	
   673	- when the user asked for recommendation docs “based on the 90 iterations,” keep documentation in the existing packet `research/` folder with structured sections (exec summary, keep/fix, P0/P1/P2, compatibility, validation/testing, rollout order) [Task 1]
   674	- when the user asked to “run /create:changelog ... in the phase folder used,” place changelog files under packet-local `scratch/changelog/` and include files-changed scope [Task 2][Task 3]
   675	- when the user added “also include files changed in it,” changelog drafts should list full touched-file scope rather than short samples [Task 2][Task 3]
   676	
   677	## Reusable knowledge
   678	
   679	- wave labeling that proved useful: 061-070 (Auto-Deep-Research-main portability/handoff), 071-080 (AutoAgent-main capability gating/workflow generation), 081-090 (autoresearch-master small mutable surface discipline) [Task 1]
   680	- packet 028 closeout now expects parity across docs/assets/workflows/runtime mirrors/helper scripts/tests, plus strict validation and parser checks before marking tasks complete [Task 2][Task 3]
   754	
   755	### rollout_summary_files
   756	
   757	- rollout_summaries/2026-04-02T14-05-56-qyWY-cocoindex_compact_code_graph_readme_section.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T16-05-56-019d4e83-d8f5-7342-833e-98b3e0f731f0.jsonl, updated_at=2026-04-02T14:08:03+00:00, thread_id=019d4e83-d8f5-7342-833e-98b3e0f731f0)
   758	
   759	### keywords
   760	
   761	- CocoIndex + Compact Code Graph, README.md, 024-compact-code-graph, 006-documentation-alignment, mcp__cocoindex_code__search, code_graph_query, prettier --check
   762	
   763	## Task 8: Refresh README/changelog language to current code-graph behavior and sync constitutional README file inventory, outcome success
   764	

exec
/bin/zsh -lc "nl -ba .opencode/skill/mcp-coco-index/README.md | sed -n '60,90p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md | sed -n '27,47p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    27	`handlers/save/` contains the decomposed pipeline for the `memory_save` MCP tool. Each file owns a single stage of the save flow, from deduplication through embedding generation, save quality gating, prediction-error gating, reconsolidation, record creation, post-insert enrichment, and final response assembly.
    28	
    29	The barrel `index.ts` re-exports every module so consumers can import from `handlers/save` directly.
    30	
    31	<!-- /ANCHOR:overview -->
    32	<!-- ANCHOR:structure -->
    33	## 2. STRUCTURE
    34	
    35	| File                        | Description                                                                                                          |
    36	| --------------------------- | -------------------------------------------------------------------------------------------------------------------- |
    37	| `types.ts`                  | Shared interfaces for the pipeline: `IndexResult`, `PeDecision`, `SimilarMemory`, `SaveArgs`, `PostInsertMetadataFields` and related types. |
    38	| `index.ts`                  | Barrel re-export of all save sub-modules.                                                                            |
    39	| `dedup.ts`                  | Pre-save deduplication. `checkExistingRow` matches by file path but returns `unchanged` only for healthy rows (`success`, `pending`, `partial`); `checkContentHashDedup` matches by content hash and accepts chunked parents only when their status is valid `partial`. |
    40	| `embedding-pipeline.ts`     | Embedding generation with persistent cache. Cache keys hash normalized content, matching the main and chunked embedding paths. Checks the embedding cache first, falls back to the provider, and stores new embeddings for future re-index. Async/deferred mode is opt-in. |
    41	| `pe-orchestration.ts`       | Prediction-error (PE) gate orchestration. Finds similar memories, evaluates via `predictionErrorGate`, and applies REINFORCE, SUPERSEDE, UPDATE or CREATE_LINKED actions with mutation ledger logging. |
    42	| `reconsolidation-bridge.ts` | TM-06 reconsolidation bridge. When enabled and a checkpoint exists, delegates to the reconsolidation engine for merge/conflict resolution before falling through to normal creation. |
    43	| `create-record.ts`          | Core record creation. Inserts into vector index (or deferred index), applies post-insert metadata, links related memories and indexes into BM25 when enabled. |
    44	| `db-helpers.ts`             | Database utility functions: `applyPostInsertMetadata` builds a dynamic UPDATE for metadata columns, `hasReconsolidationCheckpoint` verifies TM-06 safety gate prerequisites. |
    45	| `post-insert.ts`            | Post-insert enrichment pipeline. Runs causal links processing, R10 entity extraction, R8 summary generation and S5 cross-document entity linking. Each step is feature-flag gated and independently error-guarded. |
    46	| `response-builder.ts`       | Final response assembly. `buildIndexResult` constructs the `IndexResult` with PE actions, causal links and warnings. `buildSaveResponse` wraps it in a standard MCP success envelope with hints, triggers post-mutation hooks and runs N3-lite consolidation. |
    47	

codex
# Iteration 035: COMPATIBILITY ANALYSIS

## Focus
COMPATIBILITY ANALYSIS: How do the adopted patterns interact with our existing CocoIndex, code-graph, and MCP tool stack? Conflict analysis.

Topic string used:
`Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main and identify concrete improvements for Code_Environment/Public, especially around hybrid search (BM25 + vector embeddings), OpenCode plugin architecture, memory scoping (project vs global), session compaction resilience, and offline-first memory design.`

## Findings
### Finding 1: Mnemosyne’s compaction reminder is compatible only as a transport-owned add-on to Public’s existing recovery stack
- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396), [hooks/claude/session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts#L50), [hooks/gemini/session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts#L51)
- **What it does**: Mnemosyne injects a short memory-tool usage card during `experimental.session.compacting`, while Public already injects compaction transport context and runtime-specific recovery instructions that point users back to `memory_context`, `memory_match_triggers`, and code-graph tools after compression.
- **Why it matters**: The idea is additive, but a second independent reminder surface would duplicate or compete with Public’s existing post-compaction recovery contract unless it is merged into the same transport/hook path.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 2: Basename-derived project scoping conflicts with Public’s governed scope model
- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L27), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L78), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L529), [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L207), [create-record.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L102)
- **What it does**: Mnemosyne chooses project scope from `path.basename(targetDir)` and offers a simple project/global split. Public retrieval and save paths carry `tenantId`, `userId`, `agentId`, `sessionId`, `sharedSpaceId`, and trusted-session validation, with search-level `retrievalLevel` routing on top.
- **Why it matters**: Directory-basename authority is too weak for worktrees, shared spaces, multi-actor safety, and session-bound retrieval. It would create scope ambiguity exactly where Public currently enforces explicit boundaries.
- **Recommendation**: reject
- **Impact**: high
- **Source strength**: primary

### Finding 3: Mnemosyne should remain memory-only and must not be fused with CocoIndex or code-graph routing
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L82), [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L63), [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L85), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L790), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L150)
- **What it does**: Mnemosyne documents hybrid memory retrieval, but Public already routes semantic code search to CocoIndex and structural dependency questions to `code_graph_query`, with session bootstrap surfacing which tool should answer which class of question.
- **Why it matters**: The stacks are complementary. Mnemosyne-like memory ergonomics can coexist with Public, but search-surface fusion would collapse distinct indexes with different refresh rules, trust models, and failure modes.
- **Recommendation**: reject
- **Impact**: high
- **Source strength**: primary

### Finding 4: The wrapper pattern is compatible only as an ergonomic facade, not as a replacement for Public’s save and retrieval core
- **Source**: [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L4), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L38), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L771), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1652), [handlers/save/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md#L27), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L85)
- **What it does**: Mnemosyne’s plugin is a thin Bun-to-binary bridge with five tools. Public already owns startup health checks, active-memory projection maintenance, hybrid pipeline execution, BM25 rebuild, save gating, reconsolidation, post-insert enrichment, and JSON-primary session capture for durable memory artifacts.
- **Why it matters**: The transferable value is front-door ergonomics, not backend replacement. A direct shell-out save path would bypass Public’s evidence-rich save workflow and create a second mutation authority.
- **Recommendation**: prototype later
- **Impact**: high
- **Source strength**: primary

### Finding 5: The reusable AGENTS pattern is proactive memory discipline, not Mnemosyne’s `core=true` model
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L62), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L140), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755), [hooks/claude/session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts#L138), [causal-graph.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts#L557)
- **What it does**: Mnemosyne’s README recommends start-of-session recall, end-of-session store, contradiction cleanup, and sparse `core=true` tagging. Public already has richer equivalents: boot instructions, `memory_context`, `memory_match_triggers`, causal linking, and tiered search surfaces.
- **Why it matters**: The discipline is worth copying, but the `core` abstraction is too coarse for Public’s constitutional, causal, archival, and session-aware model. The right translation is behavior-level guidance, not tag-level parity.
- **Recommendation**: adopt now
- **Impact**: medium
- **Source strength**: secondary

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L4)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L1)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L33)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1078)
- [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L184)
- [create-record.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L96)
- [handlers/save/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md#L27)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L741)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L61)
- [hooks/claude/session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts#L45)
- [hooks/gemini/session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts#L45)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L113)
- [causal-graph.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts#L557)
- [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L61)

## Assessment
- New information ratio: `0.18`
- Questions addressed: `[compaction-hook compatibility, scope-model conflicts, CocoIndex/code-graph boundary, wrapper-vs-core fit, AGENTS/workflow translation, offline/runtime assumptions]`
- Questions answered: `[Mnemosyne’s best transfer is prompt-level memory discipline and a thin ergonomic facade; its project/global scope model conflicts with governed Public scope; its memory surface should stay separate from CocoIndex and code-graph routing; any adoption should delegate into Public’s existing recovery/save authority rather than create a second backend]`
- Novelty justification: `This pass adds a concrete compatibility map between Mnemosyne’s wrapper-level patterns and Public’s current routing, compaction, scope-governance, and save-authority surfaces rather than only comparing memory features in isolation.`
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


hook: Stop
hook: Stop Completed
tokens used
153,640
# Iteration 035: COMPATIBILITY ANALYSIS

## Focus
COMPATIBILITY ANALYSIS: How do the adopted patterns interact with our existing CocoIndex, code-graph, and MCP tool stack? Conflict analysis.

Topic string used:
`Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main and identify concrete improvements for Code_Environment/Public, especially around hybrid search (BM25 + vector embeddings), OpenCode plugin architecture, memory scoping (project vs global), session compaction resilience, and offline-first memory design.`

## Findings
### Finding 1: Mnemosyne’s compaction reminder is compatible only as a transport-owned add-on to Public’s existing recovery stack
- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396), [hooks/claude/session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts#L50), [hooks/gemini/session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts#L51)
- **What it does**: Mnemosyne injects a short memory-tool usage card during `experimental.session.compacting`, while Public already injects compaction transport context and runtime-specific recovery instructions that point users back to `memory_context`, `memory_match_triggers`, and code-graph tools after compression.
- **Why it matters**: The idea is additive, but a second independent reminder surface would duplicate or compete with Public’s existing post-compaction recovery contract unless it is merged into the same transport/hook path.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 2: Basename-derived project scoping conflicts with Public’s governed scope model
- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L27), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L78), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L529), [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L207), [create-record.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L102)
- **What it does**: Mnemosyne chooses project scope from `path.basename(targetDir)` and offers a simple project/global split. Public retrieval and save paths carry `tenantId`, `userId`, `agentId`, `sessionId`, `sharedSpaceId`, and trusted-session validation, with search-level `retrievalLevel` routing on top.
- **Why it matters**: Directory-basename authority is too weak for worktrees, shared spaces, multi-actor safety, and session-bound retrieval. It would create scope ambiguity exactly where Public currently enforces explicit boundaries.
- **Recommendation**: reject
- **Impact**: high
- **Source strength**: primary

### Finding 3: Mnemosyne should remain memory-only and must not be fused with CocoIndex or code-graph routing
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L82), [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L63), [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L85), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L790), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L150)
- **What it does**: Mnemosyne documents hybrid memory retrieval, but Public already routes semantic code search to CocoIndex and structural dependency questions to `code_graph_query`, with session bootstrap surfacing which tool should answer which class of question.
- **Why it matters**: The stacks are complementary. Mnemosyne-like memory ergonomics can coexist with Public, but search-surface fusion would collapse distinct indexes with different refresh rules, trust models, and failure modes.
- **Recommendation**: reject
- **Impact**: high
- **Source strength**: primary

### Finding 4: The wrapper pattern is compatible only as an ergonomic facade, not as a replacement for Public’s save and retrieval core
- **Source**: [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L4), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L38), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L771), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1652), [handlers/save/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md#L27), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L85)
- **What it does**: Mnemosyne’s plugin is a thin Bun-to-binary bridge with five tools. Public already owns startup health checks, active-memory projection maintenance, hybrid pipeline execution, BM25 rebuild, save gating, reconsolidation, post-insert enrichment, and JSON-primary session capture for durable memory artifacts.
- **Why it matters**: The transferable value is front-door ergonomics, not backend replacement. A direct shell-out save path would bypass Public’s evidence-rich save workflow and create a second mutation authority.
- **Recommendation**: prototype later
- **Impact**: high
- **Source strength**: primary

### Finding 5: The reusable AGENTS pattern is proactive memory discipline, not Mnemosyne’s `core=true` model
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L62), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L140), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755), [hooks/claude/session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts#L138), [causal-graph.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts#L557)
- **What it does**: Mnemosyne’s README recommends start-of-session recall, end-of-session store, contradiction cleanup, and sparse `core=true` tagging. Public already has richer equivalents: boot instructions, `memory_context`, `memory_match_triggers`, causal linking, and tiered search surfaces.
- **Why it matters**: The discipline is worth copying, but the `core` abstraction is too coarse for Public’s constitutional, causal, archival, and session-aware model. The right translation is behavior-level guidance, not tag-level parity.
- **Recommendation**: adopt now
- **Impact**: medium
- **Source strength**: secondary

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L4)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L1)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L33)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1078)
- [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L184)
- [create-record.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L96)
- [handlers/save/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md#L27)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L741)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L61)
- [hooks/claude/session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts#L45)
- [hooks/gemini/session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts#L45)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L113)
- [causal-graph.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts#L557)
- [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L61)

## Assessment
- New information ratio: `0.18`
- Questions addressed: `[compaction-hook compatibility, scope-model conflicts, CocoIndex/code-graph boundary, wrapper-vs-core fit, AGENTS/workflow translation, offline/runtime assumptions]`
- Questions answered: `[Mnemosyne’s best transfer is prompt-level memory discipline and a thin ergonomic facade; its project/global scope model conflicts with governed Public scope; its memory surface should stay separate from CocoIndex and code-graph routing; any adoption should delegate into Public’s existing recovery/save authority rather than create a second backend]`
- Novelty justification: `This pass adds a concrete compatibility map between Mnemosyne’s wrapper-level patterns and Public’s current routing, compaction, scope-governance, and save-authority surfaces rather than only comparing memory features in isolation.`
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
