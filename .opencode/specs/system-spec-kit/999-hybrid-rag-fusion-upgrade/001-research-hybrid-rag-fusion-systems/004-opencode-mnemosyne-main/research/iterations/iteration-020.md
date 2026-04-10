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
# Iteration 020: FINAL SYNTHESIS

## Focus
FINAL SYNTHESIS: Classify EVERY finding as adopt-now / prototype-later / new-feature-needed / reject. Executive summary.

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
I’m treating this as a read-only final synthesis pass: first I’m pulling the prior memory context plus the phase artifacts and source files, then I’ll trace the external wrapper against Public’s current memory stack and collapse everything into one classified finding set.
exec
/bin/zsh -lc 'rg -n "mnemosyne|hybrid-rag-fusion|004-opencode-mnemosyne-main|compaction" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc 'rg --files "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main"' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/tsconfig.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package-lock.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/LICENSE
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/phase-research-prompt.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-010.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-004.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-014.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-005.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-015.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-001.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-011.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-006.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-016.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-002.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-012.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-003.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-013.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-007.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-017.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-008.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-018.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-009.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-019.md

exec
/bin/zsh -lc "sed -n '1,260p' '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/research.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
sed: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/research.md: No such file or directory

codex
The phase folder has iteration artifacts but no canonical `research/research.md`, so I’m pulling the latest iteration notes plus the live source files now and treating the code as the source of truth for the final synthesis.
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
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json' | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md' | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-019.md' | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	### Finding 2: Reusing Mnemosyne’s AGENTS/startup discipline verbatim would misfit Public’s governed, file-backed memory model
     2	- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L62), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L738), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L897)
     3	- **Evidence type**: README-documented for Mnemosyne workflow; wrapper-confirmed for Public startup guidance
     4	- **What it does**: Mnemosyne recommends “recall at start, store after decisions, delete contradictions, use global for cross-project prefs.” Public already emits startup instructions, tool-routing hints, session priming, and automatic memory surfacing.
     5	- **Why it matters for us**: The risk is instruction drift. If we copy Mnemosyne’s wording directly, we imply cheap direct mutation semantics that Public does not have: `memory_save` is governed and file-path constrained, and deletion/update flows are more opinionated than a simple binary-backed store.
     6	- **Recommendation**: adopt now
     7	- **Impact**: medium
     8	
     9	### Finding 3: Thin `project` and `global` aliases are useful, but write-side aliases could blur Public’s scope boundaries
    10	- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L27), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L118), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L492), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L812), [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1136)
    11	- **Evidence type**: wrapper-confirmed for Mnemosyne; wrapper-confirmed for Public
    12	- **What it does**: Mnemosyne derives project scope from the current directory basename, special-cases `global`, and exposes separate recall/store tools. Public already supports `retrievalLevel: local|global|auto` plus governed save scope via `tenantId`, `userId`, `agentId`, `sessionId`, and `sharedSpaceId`.
    13	- **Why it matters for us**: Read aliases are low risk, but write aliases are not. A directory-basename mental model is much weaker than Public’s governed scope model and creates real collision/leak risks across similarly named repos, worktrees, or shared-memory spaces.
    14	- **Recommendation**: prototype later
    15	- **Impact**: medium
    16	
    17	### Finding 4: A `core=true` shortcut could erode constitutional-tier discipline if it acts like a simple tag
    18	- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L138), [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L53), [vector-index-store.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts#L609), [memory-crud-update.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts#L67)
    19	- **Evidence type**: both
    20	- **What it does**: Mnemosyne maps `core=true` to a `core` tag and describes it as always available context. Public’s “always surface” path is tied to the constitutional tier, token budgeting, cache keys, mutation hooks, and validated importance-tier updates.
    21	- **Why it matters for us**: The risk is semantic collapse. If `core=true` becomes a casual alias, operators will over-promote memories, inflate the constitutional budget, and create ambiguity between `constitutional`, `critical`, and merely “important” memories.
    22	- **Recommendation**: prototype later
    23	- **Impact**: medium
    24	
    25	### Finding 5: A native OpenCode memory facade is feasible, but a second authority layer would be the biggest adoption hazard
    26	- **Source**: [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L31), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L38), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L168), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L330), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755)
    27	- **Evidence type**: wrapper-confirmed for Mnemosyne wrapper shape; wrapper-confirmed for Public MCP/transport shape
    28	- **What it does**: Mnemosyne is a tiny OpenCode plugin that delegates everything to a local binary via argv-safe `Bun.spawn`. Public already has a richer MCP server plus OpenCode transport payloads for bootstrap/resume/compaction.
    29	- **Why it matters for us**: The biggest risk is split truth. If we add a native plugin that reinterprets save/search/scope logic instead of delegating to MCP, we will create semantic drift, duplicate failure handling, and mismatched recovery behavior. The offline-first dependency model also adds first-run latency and missing-binary failure states that Public’s current MCP surface does not require.
    30	- **Recommendation**: NEW FEATURE
    31	- **Impact**: medium
    32	
    33	## Sources Consulted
    34	- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
    35	- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
    36	- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
    37	- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
    38	- [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts)
    39	- [memory-surface.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts)
    40	- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
    41	- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
    42	- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
    43	- [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
    44	- [memory-crud-update.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts)
    45	- [vector-index-store.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts)
    46	- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)
    47	
    48	## Assessment
    49	- New information ratio: 0.67
    50	- Questions addressed: adoption risk for compaction reminders, startup/AGENTS policy reuse, project/global ergonomic aliases, `core=true` mapping, thin plugin delegation, offline-first failure handling, and separation from CocoIndex/code-graph responsibilities
    51	- Questions answered: the safest near-term adoption is still the compaction reminder pattern, but only as a deduped add-on to existing compaction transport; AGENTS guidance should be rewritten for governed saves instead of copied; project/global and `core=true` need wrapper-only prototypes because Public’s scope and constitutional semantics are stricter than Mnemosyne’s; a native OpenCode facade is viable only if it delegates to MCP and never becomes a second memory authority. Validation command run: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict`, which returned `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, while also emitting `cannot create temp file for here document: Operation not permitted`.
    52	
    53	## Reflection
    54	- What worked: starting from the wrapper source and then tracing Public’s save/search/compaction/governance paths made the real risks obvious; the important differences are not retrieval quality but scope authority, mutation semantics, and compaction duplication.
    55	- What did not work: the external repo still exposes no backend ranking internals beyond the README contract, and the read-only sandbox prevented updating `research/research.md`, `implementation-summary.md`, `checklist.md`, or saving phase memory.
    56	
    57	## Recommended Next Focus
    58	Inspect whether Public’s OpenCode transport builder can host a dedicated memory-tool reminder block with strict dedupe and channel ownership, then separately design a read-only `project/global` alias prototype that maps onto existing `memory_search` scope rules without introducing any new write semantics.
    59	
    60	RESEARCH BRIEF:
    61	# $refine TIDD-EC Prompt: 004-opencode-mnemosyne-main
    62	
    63	## 2. Role
    64	
    65	You are a research specialist in hybrid search architectures (BM25 + vector embeddings), OpenCode plugin design, memory scoping patterns, and session compaction resilience. Work like a systems analyst who can separate TypeScript wrapper behavior from backend README claims, trace plugin lifecycle and hook wiring precisely, and translate OpenCode Mnemosyne's concrete design into practical improvements for `Code_Environment/Public`.
    66	
    67	## 3. Task
    68	
    69	Research OpenCode Mnemosyne's hybrid search architecture, plugin design patterns, and compaction survival strategies to identify practical, evidence-backed improvements for `Code_Environment/Public`, especially around combining text and vector search, OpenCode plugin integration, project-vs-global memory scoping, and preserving memory awareness across context compaction. Focus on what the external repo actually proves in `src/index.ts` and what the README describes about the Mnemosyne backend. Classify each recommendation as `adopt now`, `prototype later`, or `reject`.
    70	
    71	## 4. Context
    72	
    73	### 4.1 System Description
    74	
    75	OpenCode Mnemosyne is an OpenCode plugin that wraps the Go-based Mnemosyne local memory backend. The external repo is intentionally thin: `src/index.ts` contains the plugin entry point, CLI bridge, tool registration, scope initialization, and the `experimental.session.compacting` hook, while `README.md` describes the backend's hybrid retrieval model and intended agent workflow. The documented retrieval stack combines full-text search (SQLite FTS5 with BM25 ranking) and vector search (sqlite-vec cosine similarity using `snowflake-arctic-embed-m-v1.5`), then fuses both with Reciprocal Rank Fusion. All inference is local, the ML model is downloaded on first use (~500 MB), and no cloud APIs are involved.
    76	
    77	The plugin exposes five memory tools: `memory_recall`, `memory_recall_global`, `memory_store`, `memory_store_global`, and `memory_delete`. Project scope is derived from the current directory name and auto-initialized during plugin load; the global collection is initialized lazily on first global write. The wrapper shells out to the `mnemosyne` binary via `Bun.spawn`, quotes search strings to avoid FTS syntax issues, and injects compact memory-usage guidance into the compaction prompt so agents retain memory awareness after context resets.
    78	
    79	### 4.2 Cross-Phase Awareness Table
    80	
    81	| Phase | System | Core Pattern | Overlap Risk | Differentiation |
    82	|-------|--------|-------------|-------------|-----------------|
    83	| 001 | Engram | MCP memory server (Go, SQLite+FTS5) | 004 (FTS5 search) | Focus tool profiles, session lifecycle, topic keys |
    84	| 002 | Mex | Markdown scaffold + drift detection | 004 (memory) | Focus drift detection, scaffold, no-DB approach |
    85	| 003 | Modus Memory | FSRS spaced repetition + BM25 | 004 (BM25 search) | Focus FSRS decay, cross-referencing, query expansion |
    86	| 004 | OpenCode Mnemosyne | Hybrid search (FTS5 + vector) | 001 (FTS5), 003 (BM25) | Focus vector search, plugin architecture, scoping |
    87	
    88	### 4.3 What This Repo Already Has
    89	
    90	`Code_Environment/Public` already has Spec Kit Memory with a hybrid vector/BM25 memory retrieval pipeline in `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, startup and resume flows in `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`, and CocoIndex for semantic code search through `.opencode/skill/mcp-coco-index/README.md`. It also already has a compaction-oriented transport plugin in `.opencode/plugins/spec-kit-compact-code-graph.js` that injects structural context during `experimental.session.compacting`.
    91	
    92	What this repo does **not** currently have is an OpenCode memory plugin that wraps a standalone local binary, a first-class project/global tool pair with Mnemosyne's lightweight ergonomics, or a memory-specific compaction hook that injects tool-usage guidance directly into the compaction prompt. Do not repeat the outdated claim that Public lacks hybrid BM25+vector memory retrieval; compare Mnemosyne against the current code, not stale assumptions.
    93	
    94	## 5. Instructions
    95	
    96	1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main` as the pre-approved phase folder. Skip Gate 3, keep all writes inside this phase folder, and treat everything under `external/` as read-only.
    97	2. Start with the plugin entry point: read `external/opencode-mnemosyne-main/src/index.ts` from top to bottom before the README. Confirm how the OpenCode plugin is declared, how `ctx.directory` / `ctx.worktree` are resolved, how project names are normalized, and where collection initialization happens.
    98	3. Read `external/opencode-mnemosyne-main/package.json` immediately after `src/index.ts` to confirm packaging boundaries, plugin metadata, runtime assumptions, and whether the repo exposes any source beyond the wrapper.
    99	4. Trace the shared `mnemosyne(...args)` bridge in `src/index.ts`: `Bun.spawn`, `cwd` selection, stdout/stderr handling, exit-code failure behavior, missing-binary fallback, and the security implication of passing argv arrays instead of interpolated shell strings.
   100	5. Examine `memory_recall` and `memory_recall_global` in detail. Trace argument schemas, quoted search-string handling, project vs global flags, `--format plain`, and how the wrapper surfaces "No memories found" versus real backend output.
   101	6. Examine `memory_store` and `memory_store_global` in detail. Trace write semantics, lazy creation of the global collection, project collection auto-init, and what these choices imply for memory scoping, onboarding friction, and failure modes.
   102	7. Examine `memory_delete` in detail. Trace how document IDs are expected to flow from recall results into deletion, and what this says about memory lifecycle and hygiene expectations.
   103	8. Examine the `experimental.session.compacting` hook implementation in `src/index.ts` line by line. Treat this as the most novel feature of the phase: capture exactly what guidance is injected, when it runs, and how that compares with Public's structural compaction plugin in `.opencode/plugins/spec-kit-compact-code-graph.js`.
   104	9. Only after the wrapper analysis, read `external/opencode-mnemosyne-main/README.md`. Use it to extract hybrid-search claims, model choice, AGENTS.md guidance, offline-first positioning, and the stated project/global collection model. Distinguish clearly between wrapper-verified behavior and backend claims that are only documented here.
   105	10. Treat the Mnemosyne backend as an interface contract, not an implementation you can prove from this repo. Infer the wrapper-visible backend verbs (`init`, `search`, `add`, `delete`) and the documented hybrid-search behavior, but do not fabricate internal Go ranking logic that is not present in the checked-out plugin repository.
   106	11. Compare Mnemosyne directly against current `Code_Environment/Public` code: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` for existing hybrid retrieval, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` for session bootstrap/resume behavior, `.opencode/plugins/spec-kit-compact-code-graph.js` for compaction injection, and `.opencode/skill/mcp-coco-index/README.md` for semantic code-search positioning.
   107	12. Resolve cross-phase boundaries explicitly. Do not redo phase `001` as generic FTS5 study or phase `003` as generic BM25 study. This phase owns wrapper-to-backend boundaries, vector-search implications, OpenCode plugin ergonomics, project/global scoping, AGENTS guidance, and memory-awareness compaction behavior.
   108	13. Before deep research begins, ensure the phase folder contains the required Spec Kit docs for the chosen level. Validate the phase folder with:
   109	    ```bash
   110	    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict
   111	    ```
   112	14. After validation passes, run deep research using this exact topic:
   113	    ```text
   114	    Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main and identify concrete improvements for Code_Environment/Public, especially around hybrid search (BM25 + vector embeddings), OpenCode plugin architecture, memory scoping (project vs global), session compaction resilience, and offline-first memory design.
   115	    ```
   116	15. Save all outputs inside this phase folder, especially under `research/`. Every meaningful finding must cite exact file paths, say whether the evidence is wrapper-confirmed or README-level, explain why it matters for `Code_Environment/Public`, classify the recommendation as `adopt now`, `prototype later`, or `reject`, and identify the affected subsystem. When research is complete, update `checklist.md`, create `implementation-summary.md`, and save memory with:
   117	    ```bash
   118	    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main"
   119	    ```
   120	
   121	## 6. Research Questions
   122	
   123	1. How is hybrid retrieval presented at the plugin boundary: what does the README claim about BM25, vector similarity, and Reciprocal Rank Fusion, and what parts of that pipeline are actually visible from the wrapper?
   124	2. Why does Mnemosyne use `snowflake-arctic-embed-m-v1.5`, and what should `Code_Environment/Public` learn from that model choice even if Public already has other embedding-backed retrieval systems?
   125	3. How effective is Mnemosyne's project-vs-global scope split, and would a similar ergonomic separation improve Public's memory-save and recall flows without duplicating existing scoped retrieval features?
   126	4. What exactly does the compaction hook preserve, and how does prompt-level tool guidance differ from Public's current structural-context compaction transport?
   127	5. What operational value comes from the plugin auto-initializing the project collection and lazily initializing the global collection, and what failure or ambiguity risks come with deriving the project key from the directory basename?
   128	6. How should the README's AGENTS.md recommendation be interpreted as workflow guidance: is it merely usage advice, or does it reveal a reusable memory-discipline pattern for Public sessions?
   129	7. Compared with CocoIndex's semantic code search, what is unique about Mnemosyne's hybrid memory retrieval story, and where should those systems stay separate rather than merged?
   130	8. Compared with Public's current `memory_search` pipeline, which Mnemosyne ideas are already covered, which are partial overlaps, and which are genuinely new?
   131	9. How does the OpenCode plugin lifecycle shape adoption compared with MCP-server-based memory systems: installation, runtime assumptions, binary dependency management, and tool exposure ergonomics?
   132	10. What are the practical implications of the offline-first design, including local model download cost, first-run latency, privacy benefits, and failure handling when the binary or model is missing?
   133	
   134	## 7. Do's
   135	
   136	- Do trace the full wrapper lifecycle in `src/index.ts`, not just the README summary.
   137	- Do separate wrapper-confirmed behavior from backend claims documented only in `README.md`.
   138	- Do trace the hybrid-search narrative end to end as a contract: query entry, quoted search handoff, backend search call, and fused-ranking claims.
   139	- Do study project and global scoping as product decisions, not just CLI flags.
   140	- Do examine the compaction hook as the phase's highest-priority differentiator for `Code_Environment/Public`.
   141	- Do compare against current Public files so the research reflects today's hybrid retrieval and compaction behavior.
   142	- Do note where the external repo has no extra architecture files or AGENTS file, and treat that absence as evidence about how thin the wrapper really is.
   143	
   144	## 8. Don'ts
   145	
   146	- Do not spend most of the analysis on Mnemosyne's unseen Go internals; they are a dependency, not the plugin repo under study.
   147	- Do not conflate the TypeScript wrapper with the backend search implementation. State clearly when a claim is README-level rather than source-proven.
   148	- Do not ignore the compaction hook; it is the most novel and transferable feature for `Code_Environment/Public`.
   149	- Do not claim Public lacks hybrid BM25+vector memory retrieval when `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` already proves otherwise.
   150	- Do not try to run the system unless the binary and model are already installed; static analysis is sufficient for this phase, and first-run model download is large.
   151	- Do not collapse this phase into generic FTS5 or BM25 discussion already owned by phases `001` and `003`.
   152	- Do not edit anything under `external/` or outside this phase folder.
   153	
   154	## 9. Examples
   155	
   156	### Example A: Hybrid-search contract finding
   157	
   158	```text
   159	**Finding: Hybrid retrieval is a documented backend contract, not a wrapper-owned algorithm**
   160	- Source: external/opencode-mnemosyne-main/README.md; external/opencode-mnemosyne-main/src/index.ts
   161	- What it does: The README states that Mnemosyne combines SQLite FTS5/BM25 and sqlite-vec cosine similarity with Reciprocal Rank Fusion, while the wrapper simply forwards quoted search queries to `mnemosyne search`.
   162	- Why it matters: Public should not copy README marketing language into implementation plans without deciding whether the value lies in ranking math, wrapper ergonomics, or agent-facing tool guidance.
   163	- Recommendation: prototype later
   164	- Affected area: Spec Kit Memory retrieval positioning, future plugin or wrapper design
   165	- Risk/cost: Medium; backend behavior is not directly inspectable from this repo
   166	```
   167	
   168	### Example B: Compaction-resilience finding
   169	
   170	```text
   171	**Finding: Memory-tool awareness survives compaction through prompt injection**
   172	- Source: external/opencode-mnemosyne-main/src/index.ts; .opencode/plugins/spec-kit-compact-code-graph.js
   173	- What it does: Mnemosyne appends a compact memory-usage instruction block during `experimental.session.compacting`, while Public's existing compaction plugin injects structural transport context rather than memory-tool reminders.
   174	- Why it matters: Public may already preserve structural state across compaction, but it does not yet remind the agent of concrete memory tools in the same direct way.
   175	- Recommendation: adopt now or prototype later, depending on desired runtime surface
   176	- Affected area: compaction strategy, startup guidance, memory-tool ergonomics
   177	- Risk/cost: Low to medium; prompt noise and duplicate instruction handling must be designed carefully
   178	```
   179	
   180	## 10. Constraints
   181	
   182	### 10.1 Error handling
   183	
   184	- If a claim is only present in the README and not in `src/index.ts`, label it as documented behavior, not source-confirmed implementation.
   185	- If current `Code_Environment/Public` behavior contradicts the phase brief, correct the comparison to match the code.
   186	- If the external repo structure differs from the assumed paths, preserve the same analytical order and document the actual files used.
   187	- If a recommendation depends on backend internals that are not visible here, mark that gap explicitly instead of guessing.
   188	
   189	### 10.2 Scope
   190	
   191	**IN SCOPE**
   192	
   193	- OpenCode plugin entry point and lifecycle
   194	- CLI bridge design and error handling
   195	- five memory tools and their ergonomics
   196	- project/global scoping model
   197	- documented hybrid search contract
   198	- AGENTS.md integration guidance from the README
   199	- compaction-hook behavior and comparison with Public
   200	- offline-first operational tradeoffs
   201	
   202	**OUT OF SCOPE**
   203	
   204	- reverse-engineering the unseen Mnemosyne Go ranking internals
   205	- generic TypeScript style commentary
   206	- plugin publishing workflow details
   207	- broad FTS5 or BM25 primers already covered by other phases
   208	- speculative replacement of Public's existing retrieval stack without evidence
   209	
   210	### 10.3 Prioritization framework
   211	
   212	Rank findings in this order: compaction-resilience leverage, fit with Public's current hybrid retrieval stack, clarity of wrapper-vs-backend boundary, usefulness of project/global scoping ergonomics, offline-first operational value, implementation cost, and clean differentiation from phases `001` and `003`.
   213	
   214	## 11. Deliverables
   215	
   216	- `phase-research-prompt.md` present and tailored specifically to `004-opencode-mnemosyne-main`
   217	- `research/research.md` as the canonical report with at least 5 evidence-backed findings
   218	- explicit comparison against current Public files for hybrid retrieval, session recovery, compaction injection, and CocoIndex positioning
   219	- each finding labeled `adopt now`, `prototype later`, or `reject`
   220	- each finding states whether evidence is wrapper-confirmed, README-documented, or both
   221	- `implementation-summary.md` created at the end
   222	- memory saved from this phase folder using `generate-context.js`
   223	
   224	Minimum finding schema:
   225	
   226	- finding title
   227	- exact source evidence
   228	- evidence type: wrapper-confirmed / README-documented / both
   229	- what OpenCode Mnemosyne does
   230	- why it matters for `Code_Environment/Public`
   231	- recommendation: `adopt now`, `prototype later`, or `reject`
   232	- affected subsystem
   233	- migration, ambiguity, or validation risk
   234	
   235	## 12. Evaluation Criteria
   236	
   237	- CLEAR target: `>= 40/50`
   238	- RICCE compliance is visible in the prompt:
   239	  - **Role** is specialized in hybrid search, plugin architecture, scoping, and compaction resilience
   240	  - **Instructions** are ordered, concrete, path-specific, and start with the plugin entry point
   241	  - **Context** is domain-specific, cross-phase aware, and corrected to match current Public capabilities
   242	  - **Constraints** clearly separate wrapper evidence from README-level claims
   243	  - **Examples** show strong Mnemosyne-derived findings about hybrid search contracts and compaction hooks
   244	- at least 5 findings are evidence-backed rather than generic
   245	- cross-phase overlap with `001` and `003` is resolved explicitly
   246	- findings compare Mnemosyne with current Public hybrid retrieval and compaction behavior rather than a stale baseline
   247	- project/global scoping, AGENTS guidance, offline-first tradeoffs, and compaction survival are all covered directly
   248	
   249	## 13. Completion Bar
   250	
   251	The phase is only complete when all of the following are true:
   252	
   253	- the reading order started with `src/index.ts`, then `package.json`, then the five tools, then the compaction hook, then `README.md`
   254	- the exact validation command was used for this phase folder
   255	- the exact deep-research topic string appears in the work
   256	- `research/research.md` contains at least 5 evidence-backed findings
   257	- each finding distinguishes wrapper-confirmed behavior from README-documented claims where needed
   258	- `checklist.md` is updated with evidence and completion marks
   259	- `implementation-summary.md` exists
   260	- memory is saved successfully for `004-opencode-mnemosyne-main`

codex
I’ve got the external wrapper and the latest phase notes. Next I’m harvesting all prior finding titles and pulling the exact Public code slices they depend on so the final classification is grounded in the current implementation, not just the iteration markdown.
exec
/bin/zsh -lc "nl -ba '.opencode/plugins/spec-kit-compact-code-graph.js' | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts' | sed -n '460,920p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc 'rg -n "''^### Finding" '"'/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-010.md:1:### Finding 3: Mnemosyne survives compaction with reminders; Public resumes with actual session state
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-010.md:8:### Finding 4: Mnemosyne’s end-of-session lifecycle is manual note taking; `generate-context.js` is structured session serialization
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-010.md:15:### Finding 5: Mnemosyne ties memory identity to directory basename, which makes lifecycle continuity fragile across renames and parallel checkouts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-010.md:22:### Finding 6: Public has a continuity middle layer that Mnemosyne lacks entirely
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-010.md:267:### Finding N: [Title]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-010.md:6149:### Finding 1: Mnemosyne’s hygiene contract lives in prose and prompt injection, not enforceable tooling
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-010.md:6156:### Finding 2: Mnemosyne stores opaque memory snippets; Public’s save path scores, dedups, and enriches memory quality
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-010.md:6163:### Finding 3: Mnemosyne has no trigger system, so retrieval hygiene stays agent-driven instead of signal-driven
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-010.md:6170:### Finding 4: Mnemosyne’s mutation hygiene is single-shot delete/manual overwrite; Public mutations are transactional and auditable
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-010.md:6177:### Finding 5: Mnemosyne hides readiness drift behind auto-init; Public makes hygiene failures observable and repairable
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-010.md:6184:### Finding 6: Mnemosyne treats contradiction hygiene as deletion; Public models contradiction and supersession as first-class graph state
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-010.md:6229:### Finding 1: Mnemosyne’s hygiene contract lives in prose and prompt injection, not enforceable tooling
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-010.md:6236:### Finding 2: Mnemosyne stores opaque memory snippets; Public’s save path scores, dedups, and enriches memory quality
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-010.md:6243:### Finding 3: Mnemosyne has no trigger system, so retrieval hygiene stays agent-driven instead of signal-driven
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-010.md:6250:### Finding 4: Mnemosyne’s mutation hygiene is single-shot delete/manual overwrite; Public mutations are transactional and auditable
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-010.md:6257:### Finding 5: Mnemosyne hides readiness drift behind auto-init; Public makes hygiene failures observable and repairable
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-010.md:6264:### Finding 6: Mnemosyne treats contradiction hygiene as deletion; Public models contradiction and supersession as first-class graph state
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-007.md:1:### Finding 4: Mnemosyne’s deletion flow is hard-delete by opaque numeric ID from plain-text recall output
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-007.md:8:### Finding 5: The compaction hook is Mnemosyne’s best hygiene idea, but it is guidance-only
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-007.md:15:### Finding 6: Mnemosyne’s wrapper shows no garbage collection or soft-delete lifecycle, while Public already has both
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-007.md:268:### Finding N: [Title]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-007.md:5051:### Finding 1: Mnemosyne is an intentionally thin, agent-agnostic OpenCode wrapper
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-007.md:5058:### Finding 2: Mnemosyne has no passive capture path; it is manual-store plus reminder-driven behavior
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-007.md:5065:### Finding 3: Multi-agent safety is effectively absent at the plugin boundary
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-007.md:5072:### Finding 4: The project-first / global-lazy split is a useful ergonomic pattern, even though the scope model is too weak
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-007.md:5079:### Finding 5: Mnemosyne’s strongest agent-integration idea is a repeated memory-discipline checklist across AGENTS and compaction
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-007.md:5086:### Finding 6: Mnemosyne’s hybrid search story stays behind the backend contract, so Public should keep memory retrieval and semantic code search separate
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-007.md:5133:### Finding 1: Mnemosyne is an intentionally thin, agent-agnostic OpenCode wrapper
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-007.md:5140:### Finding 2: Mnemosyne has no passive capture path; it is manual-store plus reminder-driven behavior
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-007.md:5147:### Finding 3: Multi-agent safety is effectively absent at the plugin boundary
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-007.md:5154:### Finding 4: The project-first / global-lazy split is a useful ergonomic pattern, even though the scope model is too weak
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-007.md:5161:### Finding 5: Mnemosyne’s strongest agent-integration idea is a repeated memory-discipline checklist across AGENTS and compaction
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-007.md:5168:### Finding 6: Mnemosyne’s hybrid search story stays behind the backend contract, so Public should keep memory retrieval and semantic code search separate
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-014.md:7:### Finding 3: Split memory policy into orthogonal axes instead of overloading tiers
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-014.md:14:### Finding 4: Move from one universal memory surface to runtime-specific facades over a governed core
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-014.md:21:### Finding 5: Treat memory retrieval as one retrieval plane in a federated stack, not the universal semantic engine
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-014.md:28:### Finding 6: Make offline backend readiness a first-class memory concern, not a hidden first-use side effect
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-014.md:276:### Finding N: [Title]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-014.md:4832:### Finding 1: The strongest pattern is compaction-time preservation of memory behavior, not memory content
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-014.md:4840:### Finding 2: Mnemosyne turns memory use into a lifecycle contract by repeating the same policy at startup and compaction
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-014.md:4848:### Finding 3: The hook compresses scope policy into a few agent-facing verbs, which makes it usable under pressure
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-014.md:4856:### Finding 4: Public already preserves continuity across compaction, but its OpenCode surface intentionally avoids owning retrieval policy
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-014.md:4864:### Finding 5: We can borrow the strongest pattern without borrowing Mnemosyne’s backend architecture
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-014.md:4915:### Finding 1: The strongest pattern is compaction-time preservation of memory behavior, not memory content
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-014.md:4923:### Finding 2: Mnemosyne turns memory use into a lifecycle contract by repeating the same policy at startup and compaction
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-014.md:4931:### Finding 3: The hook compresses scope policy into a few agent-facing verbs, which makes it usable under pressure
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-014.md:4939:### Finding 4: Public already preserves continuity across compaction, but its OpenCode surface intentionally avoids owning retrieval policy
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-014.md:4947:### Finding 5: We can borrow the strongest pattern without borrowing Mnemosyne’s backend architecture
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-005.md:1:### Finding 4: Mnemosyne’s compaction hook preserves memory awareness, not continuity state
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-005.md:9:### Finding 5: Public has a trusted session boundary; Mnemosyne has none
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-005.md:17:### Finding 6: Mnemosyne’s lifecycle hygiene is document deletion, not session closure
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-005.md:267:### Finding N: [Title]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-005.md:5504:### Finding 1: Mnemosyne’s wrapper exposes a search contract, not a visible ranking engine
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-005.md:5511:### Finding 2: Mnemosyne’s query processing is intentionally minimal, with whole-query quoting as its main lexical safeguard
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-005.md:5518:### Finding 3: The documented hybrid stack is conventional and useful, but only README-proven in this repo
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-005.md:5525:### Finding 4: Public already exceeds Mnemosyne’s hybrid retrieval depth by routing and fusing more channels before and after retrieval
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-005.md:5532:### Finding 5: Public’s lexical and fallback behavior is materially richer than Mnemosyne’s visible surface
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-005.md:5539:### Finding 6: Mnemosyne’s genuinely new search-facing idea is simpler scoped tool ergonomics, not better ranking
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-005.md:5586:### Finding 1: Mnemosyne’s wrapper exposes a search contract, not a visible ranking engine
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-005.md:5593:### Finding 2: Mnemosyne’s query processing is intentionally minimal, with whole-query quoting as its main lexical safeguard
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-005.md:5600:### Finding 3: The documented hybrid stack is conventional and useful, but only README-proven in this repo
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-005.md:5607:### Finding 4: Public already exceeds Mnemosyne’s hybrid retrieval depth by routing and fusing more channels before and after retrieval
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-005.md:5614:### Finding 5: Public’s lexical and fallback behavior is materially richer than Mnemosyne’s visible surface
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-005.md:5621:### Finding 6: Mnemosyne’s genuinely new search-facing idea is simpler scoped tool ergonomics, not better ranking
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-001.md:212:### Finding N: [Title]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-001.md:5929:### Finding 1: The external repo is a deliberately thin wrapper, not a full memory engine
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-001.md:5937:### Finding 2: Project/global scoping is the main product decision in the wrapper
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-001.md:5945:### Finding 3: The CLI bridge is secure-by-construction, but shifts complexity into binary/runtime operations
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-001.md:5953:### Finding 4: Mnemosyne’s hybrid retrieval story is mostly README contract; Public already implements the deeper live pipeline
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-001.md:5961:### Finding 5: The compaction hook is the strongest transferable idea because it preserves tool awareness, not just context payload
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-001.md:5969:### Finding 6: Mnemosyne’s AGENTS guidance is reusable, but CocoIndex should remain a separate system
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-001.md:6016:### Finding 1: The external repo is a deliberately thin wrapper, not a full memory engine
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-001.md:6024:### Finding 2: Project/global scoping is the main product decision in the wrapper
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-001.md:6032:### Finding 3: The CLI bridge is secure-by-construction, but shifts complexity into binary/runtime operations
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-001.md:6040:### Finding 4: Mnemosyne’s hybrid retrieval story is mostly README contract; Public already implements the deeper live pipeline
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-001.md:6048:### Finding 5: The compaction hook is the strongest transferable idea because it preserves tool awareness, not just context payload
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-001.md:6056:### Finding 6: Mnemosyne’s AGENTS guidance is reusable, but CocoIndex should remain a separate system
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-004.md:12:### Finding 3: Mnemosyne’s project/global split is ergonomic, but the actual scope key is weak
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-004.md:20:### Finding 4: Mnemosyne has no profile separation; Public does
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-004.md:28:### Finding 5: The compaction hook is the most transferable idea, but Public’s implementation substrate is stronger
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-004.md:36:### Finding 6: Mnemosyne’s hybrid retrieval and offline-first story are mostly backend contract, not wrapper logic
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-004.md:281:### Finding N: [Title]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-004.md:8163:### Finding 1: Mnemosyne does not create a first-class session; it creates a collection context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-004.md:8171:### Finding 2: Mnemosyne session maintenance is agent-discipline, not runtime state
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-004.md:8179:### Finding 3: Mnemosyne has no stop-hook summarization or autosave path
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-004.md:8187:### Finding 4: Mnemosyne’s compaction hook preserves memory awareness, not continuity state
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-004.md:8195:### Finding 5: Public has a trusted session boundary; Mnemosyne has none
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-004.md:8203:### Finding 6: Mnemosyne’s lifecycle hygiene is document deletion, not session closure
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-004.md:8250:### Finding 1: Mnemosyne does not create a first-class session; it creates a collection context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-004.md:8258:### Finding 2: Mnemosyne session maintenance is agent-discipline, not runtime state
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-004.md:8266:### Finding 3: Mnemosyne has no stop-hook summarization or autosave path
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-004.md:8274:### Finding 4: Mnemosyne’s compaction hook preserves memory awareness, not continuity state
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-004.md:8282:### Finding 5: Public has a trusted session boundary; Mnemosyne has none
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-004.md:8290:### Finding 6: Mnemosyne’s lifecycle hygiene is document deletion, not session closure
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-008.md:1:### Finding 4: The project-first / global-lazy split is a useful ergonomic pattern, even though the scope model is too weak
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-008.md:8:### Finding 5: Mnemosyne’s strongest agent-integration idea is a repeated memory-discipline checklist across AGENTS and compaction
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-008.md:15:### Finding 6: Mnemosyne’s hybrid search story stays behind the backend contract, so Public should keep memory retrieval and semantic code search separate
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-008.md:263:### Finding N: [Title]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-008.md:4491:### Finding 1: Mnemosyne’s recall surface throws away retrieval structure that Public already uses
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-008.md:4498:### Finding 2: The wrapper intentionally makes hybrid retrieval opaque by collapsing the query into one quoted backend string
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-008.md:4505:### Finding 3: Public’s `retrievalLevel` is a richer retrieval control than Mnemosyne’s separate project/global recall tools
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-008.md:4512:### Finding 4: Mnemosyne persists memories across sessions, but it does not expose session-aware retrieval continuity
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-008.md:4519:### Finding 5: Mnemosyne’s compaction hook preserves memory awareness, but not live retrieval readiness or routing
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-008.md:4526:### Finding 6: The plugin package is too thin to treat Mnemosyne as a ranking reference implementation
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-008.md:4533:### Finding 7: Mnemosyne’s offline bridge lacks an explicit retrieval-readiness contract
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-008.md:4579:### Finding 1: Mnemosyne’s recall surface throws away retrieval structure that Public already uses
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-008.md:4586:### Finding 2: The wrapper intentionally makes hybrid retrieval opaque by collapsing the query into one quoted backend string
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-008.md:4593:### Finding 3: Public’s `retrievalLevel` is a richer retrieval control than Mnemosyne’s separate project/global recall tools
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-008.md:4600:### Finding 4: Mnemosyne persists memories across sessions, but it does not expose session-aware retrieval continuity
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-008.md:4607:### Finding 5: Mnemosyne’s compaction hook preserves memory awareness, but not live retrieval readiness or routing
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-008.md:4614:### Finding 6: The plugin package is too thin to treat Mnemosyne as a ranking reference implementation
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-008.md:4621:### Finding 7: Mnemosyne’s offline bridge lacks an explicit retrieval-readiness contract
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-019.md:1:### Finding 2: Reusing Mnemosyne’s AGENTS/startup discipline verbatim would misfit Public’s governed, file-backed memory model
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-019.md:9:### Finding 3: Thin `project` and `global` aliases are useful, but write-side aliases could blur Public’s scope boundaries
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-019.md:17:### Finding 4: A `core=true` shortcut could erode constitutional-tier discipline if it acts like a simple tag
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-019.md:25:### Finding 5: A native OpenCode memory facade is feasible, but a second authority layer would be the biggest adoption hazard
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-019.md:272:### Finding N: [Title]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-019.md:5513:### Finding 1: Add a transport-owned memory reminder block at compaction time
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-019.md:5520:### Finding 2: Mnemosyne’s direct store/delete loop is incompatible with Public’s governed, file-backed mutation model
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-019.md:5527:### Finding 3: Read-side `project/global` aliases are worth prototyping, but only as thin wrappers over existing retrieval scope
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-019.md:5534:### Finding 4: Mnemosyne’s AGENTS/startup discipline is reusable only after translating it into Public’s recovery authority
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-019.md:5541:### Finding 5: A direct `core=true` shortcut should be rejected on Public’s primary surface
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-019.md:5548:### Finding 6: If we add an OpenCode-native memory facade, it must be delegation-only
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-019.md:5555:### Finding 7: Mnemosyne’s offline-first binary/model stack is useful as an optional pattern, not as Public’s default deployment model
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-019.md:5607:### Finding 1: Add a transport-owned memory reminder block at compaction time
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-019.md:5614:### Finding 2: Mnemosyne’s direct store/delete loop is incompatible with Public’s governed, file-backed mutation model
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-019.md:5621:### Finding 3: Read-side `project/global` aliases are worth prototyping, but only as thin wrappers over existing retrieval scope
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-019.md:5628:### Finding 4: Mnemosyne’s AGENTS/startup discipline is reusable only after translating it into Public’s recovery authority
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-019.md:5635:### Finding 5: A direct `core=true` shortcut should be rejected on Public’s primary surface
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-019.md:5642:### Finding 6: If we add an OpenCode-native memory facade, it must be delegation-only
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-019.md:5649:### Finding 7: Mnemosyne’s offline-first binary/model stack is useful as an optional pattern, not as Public’s default deployment model
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-017.md:8:### Finding 2: The wrapper collapses most failures into raw stderr or one install hint
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-017.md:15:### Finding 3: Basename-derived project keys create rename, collision, and migration risk
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-017.md:22:### Finding 4: Delete hygiene depends on parsing plain-text recall output
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-017.md:29:### Finding 5: The compaction hook can advertise broken memory tools
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-017.md:36:### Finding 6: The wrapper adds per-call process overhead without its own scaling or repair controls
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-017.md:280:### Finding N: [Title]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-017.md:6888:### Finding 1: Health-gated memory compaction guidance is the easiest high-value transfer
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-017.md:6895:### Finding 2: Mnemosyne’s AGENTS/startup memory discipline can be absorbed as prompt policy, not architecture
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-017.md:6902:### Finding 3: First-class `project`/`global` tool aliases would be useful, but only as a thin wrapper over existing scoped retrieval
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-017.md:6909:### Finding 4: `core=true` is only a viable shortcut if it maps cleanly onto Public’s constitutional-tier governance
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-017.md:6916:### Finding 5: A thin OpenCode-native memory plugin for Spec Kit Memory is feasible, but only as a delegation layer
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-017.md:6959:### Finding 1: Health-gated memory compaction guidance is the easiest high-value transfer
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-017.md:6966:### Finding 2: Mnemosyne’s AGENTS/startup memory discipline can be absorbed as prompt policy, not architecture
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-017.md:6973:### Finding 3: First-class `project`/`global` tool aliases would be useful, but only as a thin wrapper over existing scoped retrieval
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-017.md:6980:### Finding 4: `core=true` is only a viable shortcut if it maps cleanly onto Public’s constitutional-tier governance
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-017.md:6987:### Finding 5: A thin OpenCode-native memory plugin for Spec Kit Memory is feasible, but only as a delegation layer
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-013.md:1:### Finding 4: Expose write-time pinning through the current save/update surface instead of overloading tiers or inventing a new “core” path
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-013.md:8:### Finding 5: Do not move toward AGENTS.md-dependent memory discipline; keep memory awareness runtime-owned
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-013.md:15:### Finding 6: Reject any architectural pivot from MCP-first memory to a thin OpenCode binary wrapper; if desired, add a facade on top of the current server
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-013.md:265:### Finding N: [Title]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-013.md:6588:### Finding 1: Shift compaction from passive state carryover to runtime-owned behavioral continuity
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-013.md:6595:### Finding 2: Shift retrieval strategy from hidden internals to explicit agent-callable API surface
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-013.md:6602:### Finding 3: Split memory policy into orthogonal axes instead of overloading tiers
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-013.md:6609:### Finding 4: Move from one universal memory surface to runtime-specific facades over a governed core
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-013.md:6616:### Finding 5: Treat memory retrieval as one retrieval plane in a federated stack, not the universal semantic engine
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-013.md:6623:### Finding 6: Make offline backend readiness a first-class memory concern, not a hidden first-use side effect
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-013.md:6668:### Finding 1: Shift compaction from passive state carryover to runtime-owned behavioral continuity
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-013.md:6675:### Finding 2: Shift retrieval strategy from hidden internals to explicit agent-callable API surface
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-013.md:6682:### Finding 3: Split memory policy into orthogonal axes instead of overloading tiers
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-013.md:6689:### Finding 4: Move from one universal memory surface to runtime-specific facades over a governed core
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-013.md:6696:### Finding 5: Treat memory retrieval as one retrieval plane in a federated stack, not the universal semantic engine
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-013.md:6703:### Finding 6: Make offline backend readiness a first-class memory concern, not a hidden first-use side effect
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-012.md:1:### Finding 3: Add an inline `memory_remember` intake path instead of requiring file-first saves
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-012.md:8:### Finding 4: Add write-time pinning for always-on memories
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-012.md:15:### Finding 5: Build an explicit offline warmup and doctor flow for memory readiness
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-012.md:260:### Finding N: [Title]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-012.md:6706:### Finding 1: Refactor compaction guidance into the existing shared transport pipeline instead of adding a second Mnemosyne-style memory hook
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-012.md:6713:### Finding 2: Reframe “memory warmup/doctor” as a refactor over existing readiness primitives, not a net-new subsystem
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-012.md:6720:### Finding 3: If we add scoped memory ergonomics, implement them as aliases over governed scope metadata, not as separate project/global stores
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-012.md:6727:### Finding 4: Expose write-time pinning through the current save/update surface instead of overloading tiers or inventing a new “core” path
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-012.md:6734:### Finding 5: Do not move toward AGENTS.md-dependent memory discipline; keep memory awareness runtime-owned
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-012.md:6741:### Finding 6: Reject any architectural pivot from MCP-first memory to a thin OpenCode binary wrapper; if desired, add a facade on top of the current server
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-012.md:6790:### Finding 1: Refactor compaction guidance into the existing shared transport pipeline instead of adding a second Mnemosyne-style memory hook
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-012.md:6797:### Finding 2: Reframe “memory warmup/doctor” as a refactor over existing readiness primitives, not a net-new subsystem
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-012.md:6804:### Finding 3: If we add scoped memory ergonomics, implement them as aliases over governed scope metadata, not as separate project/global stores
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-012.md:6811:### Finding 4: Expose write-time pinning through the current save/update surface instead of overloading tiers or inventing a new “core” path
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-012.md:6818:### Finding 5: Do not move toward AGENTS.md-dependent memory discipline; keep memory awareness runtime-owned
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-012.md:6825:### Finding 6: Reject any architectural pivot from MCP-first memory to a thin OpenCode binary wrapper; if desired, add a facade on top of the current server
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-009.md:1:### Finding 4: Mnemosyne persists memories across sessions, but it does not expose session-aware retrieval continuity
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-009.md:8:### Finding 5: Mnemosyne’s compaction hook preserves memory awareness, but not live retrieval readiness or routing
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-009.md:15:### Finding 6: The plugin package is too thin to treat Mnemosyne as a ranking reference implementation
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-009.md:22:### Finding 7: Mnemosyne’s offline bridge lacks an explicit retrieval-readiness contract
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-009.md:269:### Finding N: [Title]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-009.md:4585:### Finding 1: Mnemosyne bootstraps storage, not sessions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-009.md:4592:### Finding 2: Mnemosyne is stateless at the tool boundary; Public mints and defends session identity
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-009.md:4599:### Finding 3: Mnemosyne survives compaction with reminders; Public resumes with actual session state
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-009.md:4606:### Finding 4: Mnemosyne’s end-of-session lifecycle is manual note taking; `generate-context.js` is structured session serialization
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-009.md:4613:### Finding 5: Mnemosyne ties memory identity to directory basename, which makes lifecycle continuity fragile across renames and parallel checkouts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-009.md:4620:### Finding 6: Public has a continuity middle layer that Mnemosyne lacks entirely
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-009.md:4662:### Finding 1: Mnemosyne bootstraps storage, not sessions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-009.md:4669:### Finding 2: Mnemosyne is stateless at the tool boundary; Public mints and defends session identity
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-009.md:4676:### Finding 3: Mnemosyne survives compaction with reminders; Public resumes with actual session state
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-009.md:4683:### Finding 4: Mnemosyne’s end-of-session lifecycle is manual note taking; `generate-context.js` is structured session serialization
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-009.md:4690:### Finding 5: Mnemosyne ties memory identity to directory basename, which makes lifecycle continuity fragile across renames and parallel checkouts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-009.md:4697:### Finding 6: Public has a continuity middle layer that Mnemosyne lacks entirely
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-003.md:1:### Finding 4: Public preserves version history and active snapshots; Mnemosyne exposes only immediate CRUD at the plugin boundary
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-003.md:10:### Finding 5: Public’s database is a full memory substrate, not just a recall index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-003.md:19:### Finding 6: Extension-coupled vector storage raises operability requirements that Mnemosyne’s wrapper does not address
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-003.md:267:### Finding N: [Title]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-003.md:6919:### Finding 1: Mnemosyne exposes a deliberately tiny plugin surface, not a full memory platform API
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-003.md:6927:### Finding 2: The CLI bridge is safely implemented, but operationally under-instrumented
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-003.md:6935:### Finding 3: Mnemosyne’s project/global split is ergonomic, but the actual scope key is weak
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-003.md:6943:### Finding 4: Mnemosyne has no profile separation; Public does
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-003.md:6951:### Finding 5: The compaction hook is the most transferable idea, but Public’s implementation substrate is stronger
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-003.md:6959:### Finding 6: Mnemosyne’s hybrid retrieval and offline-first story are mostly backend contract, not wrapper logic
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-003.md:7003:### Finding 1: Mnemosyne exposes a deliberately tiny plugin surface, not a full memory platform API
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-003.md:7011:### Finding 2: The CLI bridge is safely implemented, but operationally under-instrumented
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-003.md:7019:### Finding 3: Mnemosyne’s project/global split is ergonomic, but the actual scope key is weak
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-003.md:7027:### Finding 4: Mnemosyne has no profile separation; Public does
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-003.md:7035:### Finding 5: The compaction hook is the most transferable idea, but Public’s implementation substrate is stronger
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-003.md:7043:### Finding 6: Mnemosyne’s hybrid retrieval and offline-first story are mostly backend contract, not wrapper logic
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-018.md:1:### Finding 2: Mnemosyne’s AGENTS/startup memory discipline can be absorbed as prompt policy, not architecture
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-018.md:8:### Finding 3: First-class `project`/`global` tool aliases would be useful, but only as a thin wrapper over existing scoped retrieval
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-018.md:15:### Finding 4: `core=true` is only a viable shortcut if it maps cleanly onto Public’s constitutional-tier governance
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-018.md:22:### Finding 5: A thin OpenCode-native memory plugin for Spec Kit Memory is feasible, but only as a delegation layer
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-018.md:266:### Finding N: [Title]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-018.md:3544:### Finding 1: Adopting Mnemosyne-style compaction reminders risks duplicating Public’s existing compaction channels
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-018.md:3552:### Finding 2: Reusing Mnemosyne’s AGENTS/startup discipline verbatim would misfit Public’s governed, file-backed memory model
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-018.md:3560:### Finding 3: Thin `project` and `global` aliases are useful, but write-side aliases could blur Public’s scope boundaries
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-018.md:3568:### Finding 4: A `core=true` shortcut could erode constitutional-tier discipline if it acts like a simple tag
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-018.md:3576:### Finding 5: A native OpenCode memory facade is feasible, but a second authority layer would be the biggest adoption hazard
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-018.md:3622:### Finding 1: Adopting Mnemosyne-style compaction reminders risks duplicating Public’s existing compaction channels
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-018.md:3630:### Finding 2: Reusing Mnemosyne’s AGENTS/startup discipline verbatim would misfit Public’s governed, file-backed memory model
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-018.md:3638:### Finding 3: Thin `project` and `global` aliases are useful, but write-side aliases could blur Public’s scope boundaries
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-018.md:3646:### Finding 4: A `core=true` shortcut could erode constitutional-tier discipline if it acts like a simple tag
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-018.md:3654:### Finding 5: A native OpenCode memory facade is feasible, but a second authority layer would be the biggest adoption hazard
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-015.md:1:### Finding 5: Treat memory retrieval as one retrieval plane in a federated stack, not the universal semantic engine
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-015.md:8:### Finding 6: Make offline backend readiness a first-class memory concern, not a hidden first-use side effect
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-015.md:47:### Finding N: [Title]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-015.md:337:### Finding N: [Title]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-015.md:4392:### Finding 1: Mnemosyne’s hybrid story stays inside one memory plane, while Public already codifies a federated retrieval stack
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-015.md:4399:### Finding 2: Public’s memory plane already goes deeper than Mnemosyne’s project/global split through `retrievalLevel` and community fallback
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-015.md:4406:### Finding 3: Public operationalizes retrieval federation at runtime; Mnemosyne mostly documents it as expected agent behavior
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-015.md:4413:### Finding 4: Mnemosyne’s project/global model is a thin UX alias over collection naming, not a replacement for Public’s governed scope model
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-015.md:4420:### Finding 5: Public has a contract-visibility gap: `retrievalLevel` exists in runtime behavior but not in the shared `memory_search` schema
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-015.md:4466:### Finding 1: Mnemosyne’s hybrid story stays inside one memory plane, while Public already codifies a federated retrieval stack
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-015.md:4473:### Finding 2: Public’s memory plane already goes deeper than Mnemosyne’s project/global split through `retrievalLevel` and community fallback
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-015.md:4480:### Finding 3: Public operationalizes retrieval federation at runtime; Mnemosyne mostly documents it as expected agent behavior
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-015.md:4487:### Finding 4: Mnemosyne’s project/global model is a thin UX alias over collection naming, not a replacement for Public’s governed scope model
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-015.md:4494:### Finding 5: Public has a contract-visibility gap: `retrievalLevel` exists in runtime behavior but not in the shared `memory_search` schema
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-006.md:9:### Finding 3: The documented hybrid stack is conventional and useful, but only README-proven in this repo
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-006.md:16:### Finding 4: Public already exceeds Mnemosyne’s hybrid retrieval depth by routing and fusing more channels before and after retrieval
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-006.md:23:### Finding 5: Public’s lexical and fallback behavior is materially richer than Mnemosyne’s visible surface
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-006.md:30:### Finding 6: Mnemosyne’s genuinely new search-facing idea is simpler scoped tool ergonomics, not better ranking
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-006.md:278:### Finding N: [Title]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-006.md:5714:### Finding 1: Mnemosyne treats contradiction cleanup as agent behavior, not as a first-class revision model
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-006.md:5721:### Finding 2: Mnemosyne has no wrapper-level dedup or upsert path; every store is a blind append
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-006.md:5728:### Finding 3: Mnemosyne’s topic key stability depends on directory basename, which is fragile across renames and sibling worktrees
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-006.md:5735:### Finding 4: Mnemosyne’s deletion flow is hard-delete by opaque numeric ID from plain-text recall output
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-006.md:5742:### Finding 5: The compaction hook is Mnemosyne’s best hygiene idea, but it is guidance-only
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-006.md:5749:### Finding 6: Mnemosyne’s wrapper shows no garbage collection or soft-delete lifecycle, while Public already has both
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-006.md:5801:### Finding 1: Mnemosyne treats contradiction cleanup as agent behavior, not as a first-class revision model
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-006.md:5808:### Finding 2: Mnemosyne has no wrapper-level dedup or upsert path; every store is a blind append
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-006.md:5815:### Finding 3: Mnemosyne’s topic key stability depends on directory basename, which is fragile across renames and sibling worktrees
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-006.md:5822:### Finding 4: Mnemosyne’s deletion flow is hard-delete by opaque numeric ID from plain-text recall output
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-006.md:5829:### Finding 5: The compaction hook is Mnemosyne’s best hygiene idea, but it is guidance-only
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-006.md:5836:### Finding 6: Mnemosyne’s wrapper shows no garbage collection or soft-delete lifecycle, while Public already has both
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-016.md:20:### Finding 2: Public’s memory plane already goes deeper than Mnemosyne’s project/global split through `retrievalLevel` and community fallback
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-016.md:27:### Finding 3: Public operationalizes retrieval federation at runtime; Mnemosyne mostly documents it as expected agent behavior
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-016.md:34:### Finding 4: Mnemosyne’s project/global model is a thin UX alias over collection naming, not a replacement for Public’s governed scope model
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-016.md:41:### Finding 5: Public has a contract-visibility gap: `retrievalLevel` exists in runtime behavior but not in the shared `memory_search` schema
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-016.md:290:### Finding N: [Title]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-016.md:11561:### Finding 1: Init and first-use readiness fail late and ambiguously
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-016.md:11568:### Finding 2: The wrapper collapses most failures into raw stderr or one install hint
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-016.md:11575:### Finding 3: Basename-derived project keys create rename, collision, and migration risk
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-016.md:11582:### Finding 4: Delete hygiene depends on parsing plain-text recall output
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-016.md:11589:### Finding 5: The compaction hook can advertise broken memory tools
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-016.md:11596:### Finding 6: The wrapper adds per-call process overhead without its own scaling or repair controls
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-016.md:11639:### Finding 1: Init and first-use readiness fail late and ambiguously
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-016.md:11646:### Finding 2: The wrapper collapses most failures into raw stderr or one install hint
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-016.md:11653:### Finding 3: Basename-derived project keys create rename, collision, and migration risk
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-016.md:11660:### Finding 4: Delete hygiene depends on parsing plain-text recall output
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-016.md:11667:### Finding 5: The compaction hook can advertise broken memory tools
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-016.md:11674:### Finding 6: The wrapper adds per-call process overhead without its own scaling or repair controls
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-002.md:1:### Finding 3: The CLI bridge is secure-by-construction, but shifts complexity into binary/runtime operations
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-002.md:9:### Finding 4: Mnemosyne’s hybrid retrieval story is mostly README contract; Public already implements the deeper live pipeline
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-002.md:17:### Finding 5: The compaction hook is the strongest transferable idea because it preserves tool awareness, not just context payload
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-002.md:25:### Finding 6: Mnemosyne’s AGENTS guidance is reusable, but CocoIndex should remain a separate system
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-002.md:272:### Finding N: [Title]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-002.md:12815:### Finding 1: Mnemosyne’s storage layer is opaque at this repo boundary
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-002.md:12824:### Finding 2: Mnemosyne’s scope model is collection-name based, while Public’s is row-scoped and path-stable
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-002.md:12833:### Finding 3: Public is built around one canonical row store plus derived search indexes
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-002.md:12842:### Finding 4: Public preserves version history and active snapshots; Mnemosyne exposes only immediate CRUD at the plugin boundary
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-002.md:12851:### Finding 5: Public’s database is a full memory substrate, not just a recall index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-002.md:12860:### Finding 6: Extension-coupled vector storage raises operability requirements that Mnemosyne’s wrapper does not address
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-002.md:12908:### Finding 1: Mnemosyne’s storage layer is opaque at this repo boundary
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-002.md:12917:### Finding 2: Mnemosyne’s scope model is collection-name based, while Public’s is row-scoped and path-stable
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-002.md:12926:### Finding 3: Public is built around one canonical row store plus derived search indexes
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-002.md:12935:### Finding 4: Public preserves version history and active snapshots; Mnemosyne exposes only immediate CRUD at the plugin boundary
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-002.md:12944:### Finding 5: Public’s database is a full memory substrate, not just a recall index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-002.md:12953:### Finding 6: Extension-coupled vector storage raises operability requirements that Mnemosyne’s wrapper does not address
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-011.md:1:### Finding 4: Mnemosyne’s mutation hygiene is single-shot delete/manual overwrite; Public mutations are transactional and auditable
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-011.md:8:### Finding 5: Mnemosyne hides readiness drift behind auto-init; Public makes hygiene failures observable and repairable
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-011.md:15:### Finding 6: Mnemosyne treats contradiction hygiene as deletion; Public models contradiction and supersession as first-class graph state
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-011.md:261:### Finding N: [Title]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-011.md:12928:### Finding 1: Add a compaction-time memory action card, not just a continuity note
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-011.md:12935:### Finding 2: Build first-class project and personal memory lanes on top of governance scopes
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-011.md:12942:### Finding 3: Add an inline `memory_remember` intake path instead of requiring file-first saves
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-011.md:12949:### Finding 4: Add write-time pinning for always-on memories
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-011.md:12956:### Finding 5: Build an explicit offline warmup and doctor flow for memory readiness
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-011.md:12998:### Finding 1: Add a compaction-time memory action card, not just a continuity note
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-011.md:13005:### Finding 2: Build first-class project and personal memory lanes on top of governance scopes
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-011.md:13012:### Finding 3: Add an inline `memory_remember` intake path instead of requiring file-first saves
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-011.md:13019:### Finding 4: Add write-time pinning for always-on memories
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-011.md:13026:### Finding 5: Build an explicit offline warmup and doctor flow for memory readiness

exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/context-server.ts' | sed -n '720,940p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
I’ve confirmed Public already carries structured startup, priming, and retrieval federation. I’m filling in the remaining comparison points now: save/update/delete authority, transport ownership, and the code-search boundary with CocoIndex, then I’ll compress the repeated iteration findings into one final decision matrix.
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts' | sed -n '1120,1320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts' | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts' | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts' | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts' | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts' | sed -n '150,380p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba '.opencode/skill/mcp-coco-index/README.md' | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "cd '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public' && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main' --strict" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1367ms:

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
The validator is still running, so I’m waiting on that result while I finish tightening the classification buckets. The read-only sandbox may still trip the same temp-file warning the earlier iterations saw, so I’m treating the exact output as evidence rather than assuming a clean run.
codex
I’ve got enough source evidence to close this out. I’m doing one last quick pass on the actual memory note I used so the final synthesis can include a clean citation block without smuggling in anything I didn’t verify this turn.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '2004,2024p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  2004	- symptom: commit fails with `.git/index.lock`; cause: stale lock or concurrent git process; fix: confirm no active git process, remove stale lock, then retry commit [Task 4]
  2005	- symptom: docs report stale test/playbook counts after fixes; cause: checklist/plan/summary not updated with latest command outputs; fix: update packet docs and evidence logs in the same pass as code/test changes [Task 2][Task 4]
  2006	
  2007	# Task Group: 023 Hybrid-RAG Refinement Forensic Review
  2008	scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
  2009	applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
  2010	
  2011	## Task 1: Run three-agent ultra-think review for 023 documentation drift and severity-ranked findings
  2012	
  2013	### rollout_summary_files
  2014	
  2015	- rollout_summaries/2026-03-04T10-42-27-LKfV-hybrid_rag_fusion_refinement_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/04/rollout-2026-03-04T11-42-27-019cb871-1f3b-70b3-89f4-407b0a5dcacb.jsonl, updated_at=2026-03-04T10:51:24+00:00, thread_id=019cb871-1f3b-70b3-89f4-407b0a5dcacb)
  2016	
  2017	### keywords
  2018	
  2019	- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
  2020	
  2021	## User preferences
  2022	
  2023	- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]
  2024	

exec
/bin/zsh -lc "rg -n \"experimental\\.session\\.compacting|compaction|dedupeKey|retrievalPolicyOwner|transportOnly|memory action\" '.opencode/plugins/spec-kit-compact-code-graph.js' '.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts' '.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts' '.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:253:  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware'
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:368:  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware' = 'memory-aware'
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:626: * Fires at session compaction lifecycle points. Surfaces memories relevant
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:628: * across the compaction boundary.
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:656:  return autoSurfaceMemories(sessionContext.trim(), COMPACTION_TOKEN_BUDGET, 'compaction');
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:5:// contracts to OpenCode-oriented startup, message, and compaction blocks.
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:14:  | 'experimental.session.compacting';
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:21:  dedupeKey: string;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:28:  transportOnly: true;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:29:  retrievalPolicyOwner: 'runtime';
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:37:  compaction?: OpenCodeTransportBlock;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:87:  compactionPayload?: SharedPayloadEnvelope | null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:95:    args.compactionPayload?.kind,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:102:  const compactionPayload = args.compactionPayload ?? args.resumePayload ?? args.bootstrapPayload ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:106:    transportOnly: true,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:107:    retrievalPolicyOwner: 'runtime',
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:121:          dedupeKey: `system:${systemPayload.kind}`,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:134:      dedupeKey: `messages:${payload.kind}:${index}`,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:140:    ...(compactionPayload
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:142:        compaction: {
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:143:          hook: 'experimental.session.compacting',
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:145:          payloadKind: compactionPayload.kind,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:146:          dedupeKey: `compaction:${compactionPayload.kind}`,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:148:            compactionPayload,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:149:            'Inject this as the continuity note across compaction. Keep it separate from current-turn retrieval.',
.opencode/plugins/spec-kit-compact-code-graph.js:60: *   dedupeKey: string,
.opencode/plugins/spec-kit-compact-code-graph.js:68: *   transportOnly: true,
.opencode/plugins/spec-kit-compact-code-graph.js:69: *   retrievalPolicyOwner: string,
.opencode/plugins/spec-kit-compact-code-graph.js:77: *   compaction?: TransportBlock,
.opencode/plugins/spec-kit-compact-code-graph.js:136:    if (plan.transportOnly !== true || !Array.isArray(plan.messagesTransform)) {
.opencode/plugins/spec-kit-compact-code-graph.js:374:        if (hasSyntheticTextPartMarker(anchor.parts, SYNTHETIC_METADATA_KEY, block.dedupeKey)) {
.opencode/plugins/spec-kit-compact-code-graph.js:384:            [SYNTHETIC_METADATA_KEY]: block.dedupeKey,
.opencode/plugins/spec-kit-compact-code-graph.js:396:    'experimental.session.compacting': async (input, output) => {
.opencode/plugins/spec-kit-compact-code-graph.js:406:      const block = plan?.compaction;

exec
/bin/zsh -lc "nl -ba '.opencode/plugins/spec-kit-compact-code-graph.js' | sed -n '388,430p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts' | sed -n '620,670p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js' | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts' | sed -n '600,628p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "rg -n \"contradicts|supersedes|causal|memory_causal_link|mutation ledger|checkpoint\" '.opencode/skill/system-spec-kit/mcp_server' | head -n 40" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:77:import * as checkpointsLib from './lib/storage/checkpoints.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:86:import * as causalBoost from './lib/search/causal-boost.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1564:    checkpoints: checkpointsLib,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1571:      causalBoost,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1667:    checkpointsLib.init(database);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1674:    causalBoost.init(database);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1694:    console.error('[context-server] Checkpoints, access tracker, hybrid search, session boost, and causal boost initialized');
.opencode/skill/system-spec-kit/mcp_server/cli.ts:20:type CheckpointsModule = Awaited<typeof import('./lib/storage/checkpoints.js')>;
.opencode/skill/system-spec-kit/mcp_server/cli.ts:26:type CausalEdgesModule = Awaited<typeof import('./lib/storage/causal-edges.js')>;
.opencode/skill/system-spec-kit/mcp_server/cli.ts:31:let _checkpoints: CheckpointsModule | null = null;
.opencode/skill/system-spec-kit/mcp_server/cli.ts:37:let _causal_edges: CausalEdgesModule | null = null;
.opencode/skill/system-spec-kit/mcp_server/cli.ts:46:  return _checkpoints ??= await import('./lib/storage/checkpoints.js');
.opencode/skill/system-spec-kit/mcp_server/cli.ts:70:  return _causal_edges ??= await import('./lib/storage/causal-edges.js');
.opencode/skill/system-spec-kit/mcp_server/cli.ts:115:    [--skip-checkpoint]            Optional: skip pre-delete checkpoint (blocked for constitutional/critical)
.opencode/skill/system-spec-kit/mcp_server/cli.ts:142:  const [vectorIndex, checkpointsLib, accessTracker, coreIndex] = await Promise.all([
.opencode/skill/system-spec-kit/mcp_server/cli.ts:157:  coreIndex.init({ vectorIndex, checkpoints: checkpointsLib, accessTracker });
.opencode/skill/system-spec-kit/mcp_server/cli.ts:158:  checkpointsLib.init(db);
.opencode/skill/system-spec-kit/mcp_server/cli.ts:259:  const skipCheckpoint = getFlag('skip-checkpoint');
.opencode/skill/system-spec-kit/mcp_server/cli.ts:276:    console.error(`ERROR: --skip-checkpoint is not allowed for "${tier}" tier.`);
.opencode/skill/system-spec-kit/mcp_server/cli.ts:281:  const [vectorIndex, checkpointsLib, mutationLedger, triggerMatcher, causalEdges, history] = await Promise.all([
.opencode/skill/system-spec-kit/mcp_server/cli.ts:312:  if (skipCheckpoint) console.log(`  Checkpoint:  skipped (--skip-checkpoint)`);
.opencode/skill/system-spec-kit/mcp_server/cli.ts:343:  let checkpointName: string | null = null;
.opencode/skill/system-spec-kit/mcp_server/cli.ts:346:    checkpointName = `pre-bulk-delete-${tier}-${timestamp}`;
.opencode/skill/system-spec-kit/mcp_server/cli.ts:349:      checkpointsLib.createCheckpoint({
.opencode/skill/system-spec-kit/mcp_server/cli.ts:350:        name: checkpointName,
.opencode/skill/system-spec-kit/mcp_server/cli.ts:359:      console.log(`\n  Checkpoint:  ${checkpointName}`);
.opencode/skill/system-spec-kit/mcp_server/cli.ts:362:      console.error(`  WARNING: Failed to create checkpoint: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/cli.ts:364:      checkpointName = null;
.opencode/skill/system-spec-kit/mcp_server/cli.ts:378:  // Initialize causal edges for cleanup
.opencode/skill/system-spec-kit/mcp_server/cli.ts:379:  causalEdges.init(db);
.opencode/skill/system-spec-kit/mcp_server/cli.ts:396:        try { causalEdges.deleteEdgesForMemory(String(memory.id)); } catch { /* ignore */ }
.opencode/skill/system-spec-kit/mcp_server/cli.ts:403:  // Record in mutation ledger
.opencode/skill/system-spec-kit/mcp_server/cli.ts:417:        checkpoint: checkpointName,
.opencode/skill/system-spec-kit/mcp_server/cli.ts:430:  if (checkpointName) {
.opencode/skill/system-spec-kit/mcp_server/cli.ts:431:    console.log(`  Restore:     Use checkpoint_restore MCP tool with name: ${checkpointName}`);
.opencode/skill/system-spec-kit/mcp_server/cli.ts:433:    console.log(`  Restore:     unavailable (checkpoint skipped)`);
.opencode/skill/system-spec-kit/mcp_server/cli.ts:537:    console.log(`  Scope checkpoint: ${specFolder}`);
.opencode/skill/system-spec-kit/mcp_server/cli.ts:544:  console.log(`  Checkpoint: ${result.checkpointName}`);
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:81:export * as causalBoost from '../lib/search/causal-boost.js';
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:89:  'supersedes',

codex
# Iteration 020: FINAL SYNTHESIS

## Focus
FINAL SYNTHESIS: I consolidated the repeated iteration themes into 10 non-overlapping decisions so every substantive Mnemosyne finding lands in one bucket: `adopt now`, `prototype later`, `NEW FEATURE`, or `reject`.

## Findings
### Finding 1: Mnemosyne is not a retrieval-engine upgrade for Public
- **Source**: [external/src/index.ts:106](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L106), [external/README.md:82](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L82), [memory-search.ts:482](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482), [memory-search.ts:809](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L809); evidence: both
- **What it does**: Mnemosyne’s wrapper forwards search requests to a backend whose BM25/vector/RRF internals are only README-documented, while Public already runs a visible multi-stage hybrid search pipeline.
- **Why it matters for us**: The transferable value is wrapper ergonomics, not ranking replacement, so using Mnemosyne as a reason to re-architect Public retrieval would be a category error.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Compaction-time memory action guidance is the strongest adopt-now idea
- **Source**: [external/src/index.ts:210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [spec-kit-compact-code-graph.js:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396), [opencode-transport.ts:142](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L142), [memory-surface.ts:640](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L640); evidence: both
- **What it does**: Mnemosyne preserves memory behavior across compaction with an explicit action card, while Public currently preserves continuity/state but not equally direct memory-tool verbs on the OpenCode surface.
- **Why it matters for us**: A transport-owned, deduped memory reminder would improve post-compaction behavior without changing retrieval authority.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Mnemosyne’s startup/AGENTS discipline should be reused only after translation into Public terms
- **Source**: [external/README.md:64](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L64), [context-server.ts:755](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755), [session-bootstrap.ts:163](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L163), [memory-save.ts:1136](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1136); evidence: both
- **What it does**: Mnemosyne repeats “recall early, save after decisions, delete contradictions” in AGENTS and compaction, but Public’s save/delete paths are governed and more constrained.
- **Why it matters for us**: The behavioral pattern is good, but the wording must point to `session_bootstrap`, `memory_context`, governed saves, and careful deletions instead of cheap direct CLI mutations.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 4: Read-only `project` / `global` recall aliases are worth prototyping
- **Source**: [external/src/index.ts:118](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L118), [external/src/index.ts:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L160), [memory-search.ts:529](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L529), [memory-search.ts:818](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L818); evidence: wrapper-confirmed
- **What it does**: Mnemosyne gives simple project/global tool pairs; Public already has richer runtime scoping via `retrievalLevel` and broader fallback behavior.
- **Why it matters for us**: Thin read aliases could improve ergonomics, but only if they compile down to existing scope logic and do not invent new authority.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Basename-derived project identity is too weak for Public’s memory authority
- **Source**: [external/src/index.ts:28](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L28), [external/src/index.ts:79](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L79), [external/README.md:55](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L55), [memory-save.ts:1265](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1265); evidence: both
- **What it does**: Mnemosyne normalizes the current directory basename into a collection key and auto-inits that collection on load.
- **Why it matters for us**: That is fragile across renames, sibling worktrees, and same-name repos, and it is materially weaker than Public’s governed scope model.
- **Recommendation**: reject
- **Impact**: high

### Finding 6: An ergonomic inline memory intake is valid only as a governed facade
- **Source**: [external/src/index.ts:138](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L138), [generate-context.js:85](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L85), [memory-save.ts:1128](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1128), [memory-save.ts:1273](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1273); evidence: both
- **What it does**: Mnemosyne lets the agent store concise strings directly, while Public’s durable save path is JSON-primary, file-backed, preflighted, and governed.
- **Why it matters for us**: A `memory_remember`-style helper could be useful, but only if it produces the same governed save artifacts rather than bypassing them.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

### Finding 7: A direct `core=true` shortcut should not be added to Public’s main surface
- **Source**: [external/src/index.ts:140](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L140), [external/README.md:57](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L57), [vector-index-store.ts:609](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts#L609), [memory-crud-update.ts:67](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts#L67); evidence: both
- **What it does**: Mnemosyne collapses “always-on” behavior into a simple `core` tag, while Public reserves that behavior for explicit constitutional-tier handling and budgeted cache/query logic.
- **Why it matters for us**: A shortcut would blur `constitutional`, `critical`, and ordinary memories and encourage over-promotion.
- **Recommendation**: reject
- **Impact**: medium

### Finding 8: Mnemosyne’s blind append and hard-delete lifecycle is the wrong primary mutation model for Public
- **Source**: [external/src/index.ts:147](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L147), [external/src/index.ts:193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L193), [memory-crud-delete.ts:67](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts#L67), [memory-crud-update.ts:138](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts#L138); evidence: both
- **What it does**: Mnemosyne exposes append-plus-delete behavior at the wrapper boundary, while Public wraps updates/deletes in transactions, history, ledgering, checkpointing, and hook invalidation.
- **Why it matters for us**: Public should keep its auditable mutation model and treat contradiction cleanup as structured revision, not as plain-text ID deletion.
- **Recommendation**: reject
- **Impact**: high

### Finding 9: A native OpenCode memory plugin is viable only as a delegation-only facade
- **Source**: [external/package.json:31](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L31), [external/src/index.ts:38](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L38), [session-bootstrap.ts:330](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L330), [opencode-transport.ts:104](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L104); evidence: both
- **What it does**: Mnemosyne shows that a thin OpenCode wrapper can feel good, and Public already emits OpenCode transport plans from MCP-owned state.
- **Why it matters for us**: If we build a native facade, it must delegate to MCP for save/search/recovery and keep CocoIndex/code-graph as separate retrieval planes, or it will become a second authority layer.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

### Finding 10: Optional offline backend readiness is worth prototyping, but Mnemosyne’s runtime stack should not become Public’s default
- **Source**: [external/README.md:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L18), [external/src/index.ts:67](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L67), [context-server.ts:751](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L751), [session-bootstrap.ts:194](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L194); evidence: both
- **What it does**: Mnemosyne assumes a local binary plus a first-run model download and mainly reports failures through stderr or one install hint, while Public already has explicit bootstrap/readiness surfaces.
- **Why it matters for us**: If we ever support optional local memory backends, they need a real warmup/doctor/readiness flow; Public should not switch its primary path to Bun-plus-binary-plus-model-download.
- **Recommendation**: prototype later
- **Impact**: medium

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
- [memory-crud-delete.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts)
- [memory-crud-update.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts)
- [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)

## Assessment
- Executive summary: 10 consolidated decisions. `adopt now`: 2. `prototype later`: 2. `NEW FEATURE`: 2. `reject`: 4. The highest-confidence transfers are compaction-time memory action guidance and rewritten startup policy; the highest-confidence rejections are basename-derived scope, `core=true`, and Mnemosyne-style mutation semantics.
- New information ratio: 0.46
- Questions addressed: hybrid contract vs wrapper proof, compaction resilience, AGENTS/startup reuse, project/global ergonomics, scope identity stability, inline save ergonomics, constitutional pinning semantics, mutation/audit model, OpenCode facade design, federated retrieval separation, offline readiness tradeoffs
- Questions answered: Public should borrow Mnemosyne’s behavioral ergonomics, not its authority model. The safe path is `session_bootstrap`-aligned guidance plus a transport-owned compaction memory card, with any future aliases or facades compiled into existing MCP/governance surfaces.
- Validation: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict` returned `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, plus `cannot create temp file for here document: Operation not permitted` from the read-only sandbox.

## Reflection
- What worked: source-first tracing from [`external/src/index.ts`](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts) into Public’s transport, bootstrap, save, and mutation handlers made the true boundary obvious: Mnemosyne contributes behavior cues and wrapper ergonomics, not a stronger core memory substrate.
- What did not work: the external repo exposes no Go backend internals beyond README claims, the phase folder still lacks a canonical `research/research.md`, and the read-only sandbox prevented updating phase docs or saving phase memory.

## Recommended Next Focus
Design two packet-ready follow-ons before any runtime edits: one for a deduped OpenCode compaction memory action card owned by transport, and one for a governed `memory_remember` / read-only `project|global` facade that delegates entirely to existing MCP scope and save authority.


hook: Stop
hook: Stop Completed
tokens used
90,595
# Iteration 020: FINAL SYNTHESIS

## Focus
FINAL SYNTHESIS: I consolidated the repeated iteration themes into 10 non-overlapping decisions so every substantive Mnemosyne finding lands in one bucket: `adopt now`, `prototype later`, `NEW FEATURE`, or `reject`.

## Findings
### Finding 1: Mnemosyne is not a retrieval-engine upgrade for Public
- **Source**: [external/src/index.ts:106](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L106), [external/README.md:82](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L82), [memory-search.ts:482](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482), [memory-search.ts:809](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L809); evidence: both
- **What it does**: Mnemosyne’s wrapper forwards search requests to a backend whose BM25/vector/RRF internals are only README-documented, while Public already runs a visible multi-stage hybrid search pipeline.
- **Why it matters for us**: The transferable value is wrapper ergonomics, not ranking replacement, so using Mnemosyne as a reason to re-architect Public retrieval would be a category error.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Compaction-time memory action guidance is the strongest adopt-now idea
- **Source**: [external/src/index.ts:210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [spec-kit-compact-code-graph.js:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396), [opencode-transport.ts:142](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L142), [memory-surface.ts:640](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L640); evidence: both
- **What it does**: Mnemosyne preserves memory behavior across compaction with an explicit action card, while Public currently preserves continuity/state but not equally direct memory-tool verbs on the OpenCode surface.
- **Why it matters for us**: A transport-owned, deduped memory reminder would improve post-compaction behavior without changing retrieval authority.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Mnemosyne’s startup/AGENTS discipline should be reused only after translation into Public terms
- **Source**: [external/README.md:64](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L64), [context-server.ts:755](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755), [session-bootstrap.ts:163](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L163), [memory-save.ts:1136](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1136); evidence: both
- **What it does**: Mnemosyne repeats “recall early, save after decisions, delete contradictions” in AGENTS and compaction, but Public’s save/delete paths are governed and more constrained.
- **Why it matters for us**: The behavioral pattern is good, but the wording must point to `session_bootstrap`, `memory_context`, governed saves, and careful deletions instead of cheap direct CLI mutations.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 4: Read-only `project` / `global` recall aliases are worth prototyping
- **Source**: [external/src/index.ts:118](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L118), [external/src/index.ts:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L160), [memory-search.ts:529](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L529), [memory-search.ts:818](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L818); evidence: wrapper-confirmed
- **What it does**: Mnemosyne gives simple project/global tool pairs; Public already has richer runtime scoping via `retrievalLevel` and broader fallback behavior.
- **Why it matters for us**: Thin read aliases could improve ergonomics, but only if they compile down to existing scope logic and do not invent new authority.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Basename-derived project identity is too weak for Public’s memory authority
- **Source**: [external/src/index.ts:28](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L28), [external/src/index.ts:79](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L79), [external/README.md:55](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L55), [memory-save.ts:1265](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1265); evidence: both
- **What it does**: Mnemosyne normalizes the current directory basename into a collection key and auto-inits that collection on load.
- **Why it matters for us**: That is fragile across renames, sibling worktrees, and same-name repos, and it is materially weaker than Public’s governed scope model.
- **Recommendation**: reject
- **Impact**: high

### Finding 6: An ergonomic inline memory intake is valid only as a governed facade
- **Source**: [external/src/index.ts:138](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L138), [generate-context.js:85](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L85), [memory-save.ts:1128](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1128), [memory-save.ts:1273](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1273); evidence: both
- **What it does**: Mnemosyne lets the agent store concise strings directly, while Public’s durable save path is JSON-primary, file-backed, preflighted, and governed.
- **Why it matters for us**: A `memory_remember`-style helper could be useful, but only if it produces the same governed save artifacts rather than bypassing them.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

### Finding 7: A direct `core=true` shortcut should not be added to Public’s main surface
- **Source**: [external/src/index.ts:140](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L140), [external/README.md:57](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L57), [vector-index-store.ts:609](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts#L609), [memory-crud-update.ts:67](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts#L67); evidence: both
- **What it does**: Mnemosyne collapses “always-on” behavior into a simple `core` tag, while Public reserves that behavior for explicit constitutional-tier handling and budgeted cache/query logic.
- **Why it matters for us**: A shortcut would blur `constitutional`, `critical`, and ordinary memories and encourage over-promotion.
- **Recommendation**: reject
- **Impact**: medium

### Finding 8: Mnemosyne’s blind append and hard-delete lifecycle is the wrong primary mutation model for Public
- **Source**: [external/src/index.ts:147](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L147), [external/src/index.ts:193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L193), [memory-crud-delete.ts:67](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts#L67), [memory-crud-update.ts:138](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts#L138); evidence: both
- **What it does**: Mnemosyne exposes append-plus-delete behavior at the wrapper boundary, while Public wraps updates/deletes in transactions, history, ledgering, checkpointing, and hook invalidation.
- **Why it matters for us**: Public should keep its auditable mutation model and treat contradiction cleanup as structured revision, not as plain-text ID deletion.
- **Recommendation**: reject
- **Impact**: high

### Finding 9: A native OpenCode memory plugin is viable only as a delegation-only facade
- **Source**: [external/package.json:31](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L31), [external/src/index.ts:38](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L38), [session-bootstrap.ts:330](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L330), [opencode-transport.ts:104](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L104); evidence: both
- **What it does**: Mnemosyne shows that a thin OpenCode wrapper can feel good, and Public already emits OpenCode transport plans from MCP-owned state.
- **Why it matters for us**: If we build a native facade, it must delegate to MCP for save/search/recovery and keep CocoIndex/code-graph as separate retrieval planes, or it will become a second authority layer.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

### Finding 10: Optional offline backend readiness is worth prototyping, but Mnemosyne’s runtime stack should not become Public’s default
- **Source**: [external/README.md:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L18), [external/src/index.ts:67](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L67), [context-server.ts:751](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L751), [session-bootstrap.ts:194](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L194); evidence: both
- **What it does**: Mnemosyne assumes a local binary plus a first-run model download and mainly reports failures through stderr or one install hint, while Public already has explicit bootstrap/readiness surfaces.
- **Why it matters for us**: If we ever support optional local memory backends, they need a real warmup/doctor/readiness flow; Public should not switch its primary path to Bun-plus-binary-plus-model-download.
- **Recommendation**: prototype later
- **Impact**: medium

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
- [memory-crud-delete.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts)
- [memory-crud-update.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts)
- [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)

## Assessment
- Executive summary: 10 consolidated decisions. `adopt now`: 2. `prototype later`: 2. `NEW FEATURE`: 2. `reject`: 4. The highest-confidence transfers are compaction-time memory action guidance and rewritten startup policy; the highest-confidence rejections are basename-derived scope, `core=true`, and Mnemosyne-style mutation semantics.
- New information ratio: 0.46
- Questions addressed: hybrid contract vs wrapper proof, compaction resilience, AGENTS/startup reuse, project/global ergonomics, scope identity stability, inline save ergonomics, constitutional pinning semantics, mutation/audit model, OpenCode facade design, federated retrieval separation, offline readiness tradeoffs
- Questions answered: Public should borrow Mnemosyne’s behavioral ergonomics, not its authority model. The safe path is `session_bootstrap`-aligned guidance plus a transport-owned compaction memory card, with any future aliases or facades compiled into existing MCP/governance surfaces.
- Validation: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict` returned `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, plus `cannot create temp file for here document: Operation not permitted` from the read-only sandbox.

## Reflection
- What worked: source-first tracing from [`external/src/index.ts`](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts) into Public’s transport, bootstrap, save, and mutation handlers made the true boundary obvious: Mnemosyne contributes behavior cues and wrapper ergonomics, not a stronger core memory substrate.
- What did not work: the external repo exposes no Go backend internals beyond README claims, the phase folder still lacks a canonical `research/research.md`, and the read-only sandbox prevented updating phase docs or saving phase memory.

## Recommended Next Focus
Design two packet-ready follow-ons before any runtime edits: one for a deduped OpenCode compaction memory action card owned by transport, and one for a governed `memory_remember` / read-only `project|global` facade that delegates entirely to existing MCP scope and save authority.
