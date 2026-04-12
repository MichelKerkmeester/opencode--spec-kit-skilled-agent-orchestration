### Finding 4: The project-first / global-lazy split is a useful ergonomic pattern, even though the scope model is too weak
- **Source**: [external/src/index.ts:78](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L78), [external/src/index.ts:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L160), [external/README.md:51](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L51), [memory-search.ts:492](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L492), [memory-search.ts:529](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L529), [memory-surface.ts:478](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L478)
- **What it does**: Wrapper-confirmed, the project collection is auto-initialized on plugin load, while the global collection is initialized only on first global write. That asymmetry makes project memory frictionless and global memory explicit. Public already supports broader local/global retrieval semantics through `retrievalLevel: "local" | "global" | "auto"`, but not via a similarly simple project/global tool pair.
- **Why it matters for us**: The useful idea here is not the underlying scope model; it is the product nudge. Mnemosyne subtly teaches the agent “default to project memory, escalate to global only when clearly cross-project.”
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Mnemosyne’s strongest agent-integration idea is a repeated memory-discipline checklist across AGENTS and compaction
- **Source**: [external/src/index.ts:208](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L208), [external/README.md:62](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L62), [context-server.ts:755](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755), [opencode-transport.ts:140](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L140), [spec-kit-compact-code-graph.js:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396)
- **What it does**: Both wrapper-confirmed and README-documented, the same behavioral rules show up twice: search when history matters, store concise decisions, delete contradictions, reserve `core` for always-needed facts, and use global only for cross-project preferences. Public already injects startup and compaction notes, but those notes are more about recovery and structural context than a short memory-discipline checklist.
- **Why it matters for us**: This is more transferable than the backend search claims. It is cheap, runtime-agnostic, and likely to improve agent behavior without changing retrieval or storage internals.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 6: Mnemosyne’s hybrid search story stays behind the backend contract, so Public should keep memory retrieval and semantic code search separate
- **Source**: [external/src/index.ts:96](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L96), [external/README.md:80](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L80), [memory-search.ts:482](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482), [memory-context.ts:1078](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1078), [mcp-coco-index/README.md:42](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L42), [mcp-coco-index/README.md:61](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L61)
- **What it does**: README-documented, Mnemosyne says the backend fuses FTS5/BM25 and vector similarity with RRF, but wrapper-confirmed the plugin surface exposes only a plain query string and plain-text results. Public already has hybrid memory retrieval in `memory_search`, orchestration in `memory_context`, and a distinct semantic code-search surface in CocoIndex.
- **Why it matters for us**: The real import from Mnemosyne is not “add hybrid search” because Public already has that. The lesson is to avoid collapsing memory recall and code search into one tool family just because both use embeddings.
- **Recommendation**: reject
- **Impact**: medium

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [external/tsconfig.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/tsconfig.json)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [memory-surface.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts)
- [scope-governance.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts)
- [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
- [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)

## Assessment
- New information ratio: 0.84
- Questions addressed: agent-agnostic plugin shape, passive capture vs manual capture, multi-agent safety, project/global scoping ergonomics, AGENTS guidance, compaction survival, hybrid-search boundary, CocoIndex separation, offline/local integration assumptions.
- Questions answered: Mnemosyne’s wrapper is intentionally minimal and portable, but it delegates nearly all safe behavior to agent discipline; it has no passive capture or actor-scoped governance, its best transferable idea is the repeated memory-discipline checklist across AGENTS and compaction, and its project-first/global-lazy ergonomics are useful even though the underlying scope model is too weak for Public.
- The exact validation command returned `RESULT: PASSED` with `Summary: Errors: 0  Warnings: 0`, followed by the sandbox warning `cannot create temp file for here document: Operation not permitted`.

## Reflection
- What worked: reading `external/src/index.ts` first made the integration boundary obvious, then comparing it directly to Public’s `memory_context`, `memory_search`, `memory-surface`, and governance code prevented stale-baseline conclusions.
- What did not work: the external repo is so thin that several deeper questions terminate at wrapper absence rather than richer source proof; this sandbox is read-only, so I could not update `research/research.md`, `checklist.md`, `implementation-summary.md`, or run `generate-context.js` to save memory.

## Recommended Next Focus
Trace the adapter contract for an external-binary memory facade that preserves Public-grade multi-agent safety: required structured response envelope, actor/session scope propagation, project-first/global escalation rules, mutation confirmation semantics, and a shared memory-discipline checklist injected at both startup and compaction.

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
# Iteration 008: COMPARISON - RETRIEVAL

## Focus
COMPARISON - RETRIEVAL: Compare search/retrieval against our Spec Kit Memory (memory_search, CocoIndex, code-graph).

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
Using `sk-deep-research` as the closest matching skill, but keeping this pass strictly read-only and focused on retrieval comparison. I’m starting with the exact source-order the brief requires: validate the phase folder, then read `external/src/index.ts`, `package.json`, the tool implementations, the compaction hook, and only then the README before comparing against Public’s retrieval surfaces.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc 'rg -n "mnemosyne|hybrid-rag|compaction|memory_search|CocoIndex|code-graph" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
547:- `memory_stats` currently has no `sessionId` input in tool schema, so calling it after `memory_search` cannot claim the same session by default [Task 2]
548:- verification pattern that worked: confirm fresh `context-server.js` processes, run `session_bootstrap`, execute controlled `memory_search` sequence with fixed session id + trace flags, then query `feedback_events` globally and per-session in sqlite [Task 2]
599:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/02--system-spec-kit/024-compact-code-graph/029-review-remediation; reuse_rule=reuse for this packet-family remediation flow in this checkout, keeping fixes packet-local and revalidated
693:## Task 1: Deep-review packet `024-compact-code-graph` with full parity gates, outcome success
701:- /spec_kit/deep-review, 024-compact-code-graph, validate.sh --recursive, check:full, QUALITY_GATE_PASS, trigger_phrases, review-report PASS
721:- strict-validation, 023/011-indexing-and-adaptive-fusion, 024-compact-code-graph, EVIDENCE:, TEMPLATE_HEADERS, PHASE DOCUMENTATION MAP
731:- session_bootstrap, memory_context({mode:"resume",profile:"resume"}), mcp_server/hooks/claude, scripts/hooks/claude, workflow-session-id.vitest.ts, code-graph-query-handler.vitest.ts
743:## Task 6: Draft packet-local changelog set for `024-compact-code-graph`, outcome success
753:## Task 7: Add dedicated README section for CocoIndex + Compact Code Graph with packet references, outcome success
761:- CocoIndex + Compact Code Graph, README.md, 024-compact-code-graph, 006-documentation-alignment, mcp__cocoindex_code__search, code_graph_query, prettier --check
763:## Task 8: Refresh README/changelog language to current code-graph behavior and sync constitutional README file inventory, outcome success
775:- when the user said “Re-use /.../024-compact-code-graph/006-documentation-alignment,” continue under the specified existing spec folder instead of opening a new packet [Task 4]
778:- when user asked for README work, they specified “proper dedicated section ... reference 024-compact-code-graph ... re-use 006-documentation-alignment” -> preserve that wording/terminology and include those exact packet references [Task 7]
802:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for 024 compact-code-graph runtime/session troubleshooting in this checkout, but keep phase targeting explicit
836:- when the user selected reuse option “C” for `024-compact-code-graph/002-session-start-hook`, continue within that existing spec scope for follow-up fixes [Task 2]
1057:- list_mcp_resources, list_mcp_resource_templates, spec_kit_memory, opencode.json, context-server.js, memory_context, memory_search
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1478:- memory_search cursor, progressive-disclosure, requestQuality, SPECKIT_RESULT_CONFIDENCE_V1, memory-search-ux-hooks.vitest.ts
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1401ms:

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
The wrapper is confirming the thin-plugin story quickly: one TypeScript entrypoint, five tools, one compaction hook, and a Bun-spawned binary bridge. I’m pulling exact comparison points from Public next so the findings stay grounded in current `memory_search`, `memory_context`, CocoIndex, and compaction behavior instead of drifting into README-only claims.
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
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "rg -n \"memory_recall|memory_store|memory_delete|experimental\\.session\\.compacting|FTS5|BM25|RRF|snowflake-arctic|global|project|AGENTS.md\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:28:  let projectDir = targetDir.replace(/(.+?)\/+$/, "$1");
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:29:  const projectRaw = path.basename(projectDir);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:30:  const project = projectRaw === "global" ? "default" : (projectRaw || "default");
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:32:  await log.debug(`Plugin loaded for project: ${project} (dir: ${targetDir})`);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:41:      // @ts-ignore - Bun is globally available in opencode environment
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:78:  // Auto-init the project collection (idempotent).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:81:    await Bun.spawn(["mnemosyne", "init", "--name", project], {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:86:    await log.info(`Ensured collection exists: ${project}`);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:96:      memory_recall: tool({
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:98:          "Search project memory for relevant context, past decisions, and preferences. Use this at the start of conversations and whenever past context would help.",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:103:          await log.info(`Searching project memory for: ${args.query}`);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:109:            project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:118:      memory_recall_global: tool({
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:120:          "Search global memory for cross-project preferences, decisions and patterns.",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:125:          await log.info(`Searching global memory for: ${args.query}`);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:129:            "--global",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:134:          return result.trim() || "No global memories found.";
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:138:      memory_store: tool({
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:140:          "Store a project memory: a decision, preference, or important context. One concise concept per memory. Set core=true for critical context that should always be available in every session (use sparingly).",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:144:            "If true, this memory is always injected into context (like AGENTS.md). Use sparingly."
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:148:          await log.info(`Storing project memory: ${args.content}`);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:149:          const cmdArgs = ["add", "--name", project];
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:160:      memory_store_global: tool({
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:162:          "Store a cross-project memory: personal preferences, coding style, tool choices. Set core=true for critical cross-project context that should always be available.",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:170:          await log.info(`Storing global memory: ${args.content}`);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:171:          // Ensure the global collection exists.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:174:            await Bun.spawn(["mnemosyne", "init", "--global"], {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:179:            await log.info("Ensured global collection exists.");
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:182:            await log.warn(`Failed to auto-init global collection: ${e}`);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:184:          const cmdArgs = ["add", "--global"];
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:193:      memory_delete: tool({
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:210:    "experimental.session.compacting": async (_input, output) => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:213:You have persistent memory tools: memory_recall, memory_store, memory_delete,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:214:memory_recall_global, memory_store_global.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:220:- Use **core** for facts that should always be in context (project architecture, key conventions, user preferences).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:221:- Use **global** variants for cross-project preferences (coding style, tool choices).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:41:| `memory_recall` | Search project memory for relevant context and past decisions |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:42:| `memory_recall_global` | Search global memory for cross-project preferences |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:43:| `memory_store` | Store a project-scoped memory (optionally as `core`) |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:44:| `memory_store_global` | Store a cross-project memory (optionally as `core`) |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:45:| `memory_delete` | Delete an outdated memory by its document ID |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:49:- **`experimental.session.compacting`** -- Injects memory tool instructions into the compaction prompt so the agent retains awareness of its memory capabilities across context window resets.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:55:| Project | `<directory-name>` | Sessions in the same project |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:56:| Global | `global` | All projects |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:57:| Core (project) | `<directory-name>` (tagged `core`) | Sessions + survives compaction |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:58:| Core (global) | `global` (tagged `core`) | All projects + survives compaction |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:60:The project collection is auto-initialized when the plugin loads. The global collection is created on first use of `memory_store_global`.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:62:## AGENTS.md (recommended)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:64:For best results, add this to your project or global `AGENTS.md` so the agent uses memory proactively from the start of each session:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:69:- At the start of a session, use memory_recall and memory_recall_global to search for context
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:71:- After significant decisions, use memory_store to save a concise summary.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:72:- Delete contradicted memories with memory_delete before storing updated ones.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:73:- Use memory_recall_global / memory_store_global for cross-project preferences.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:76:  to the user and the project. This will help you recall important information in
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:83:- **Full-text search** (SQLite FTS5, BM25 ranking)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:84:- **Vector search** (sqlite-vec, cosine similarity with snowflake-arctic-embed-m-v1.5)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:91:This project uses standard Node.js tools: `npm` for package management and `tsc` (TypeScript compiler) for building.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:97:# Build the project

exec
/bin/zsh -lc 'rg -n "retrievalLevel|memory_search|memory_context|memory_match_triggers|enableCausalBoost|RRF|BM25|FTS5|includeConstitutional|cursor|sessionId|global|local|auto|compacting|context.push|CocoIndex|code_graph_query|graph|scope|tenantId|userId|agentId|sharedSpaceId" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/plugins/spec-kit-compact-code-graph.js .opencode/skill/mcp-coco-index/README.md .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:8:// Feature catalog: BM25 trigger phrase re-index gate
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:41:// C2 FIX: Import DB access for scope filtering
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:95:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:111:  // C2 FIX: Scope fields to prevent cross-scope trigger leaks
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
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:4:// Hierarchical scope enforcement, governed ingest validation,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:10:// Feature catalog: Hierarchical scope governance, governed ingest, retention, and audit
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:19: * Request scope used to enforce tenancy, actor, session, and shared-space boundaries.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:22:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:23:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:24:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:25:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:26:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:30: * Governed-ingest fields required to persist scope and retention metadata.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:45:  tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:46:  userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:47:  agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:48:  sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:49:  sharedSpaceId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:83:  allowUnscoped?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:120: * Options used when benchmarking scope-filter behavior.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:128: * Benchmark result for a scope filter predicate.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:153: * Trim and normalize optional scope identifiers before enforcement.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:160:    tenantId: normalizeId(input.tenantId),
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:161:    userId: normalizeId(input.userId),
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:162:    agentId: normalizeId(input.agentId),
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:163:    sessionId: normalizeId(input.sessionId),
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
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:294:    session_id: decision.normalized.sessionId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:295:    shared_space_id: decision.normalized.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:302:      tenantId: decision.normalized.tenantId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:303:      userId: decision.normalized.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:304:      agentId: decision.normalized.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:305:      sessionId: decision.normalized.sessionId || null,
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
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:421:  if (normalized.sessionId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:423:    params.push(normalized.sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:425:  if (normalized.sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:427:    params.push(normalized.sharedSpaceId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:441:    || normalized.tenantId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:442:    || normalized.userId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:443:    || normalized.agentId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:444:    || normalized.sessionId
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
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:492:      && matchesExactScope(row.session_id, normalized.sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:508:  const allowUnscoped = filters.allowUnscoped === true;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:509:  // Security: audit enumeration requires explicit scope filters or admin override
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:510:  if (!allowUnscoped && !hasGovernanceAuditFilters(filters)) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:511:    console.warn('[scope-governance] Unscoped governance audit enumeration blocked; explicit filters or allowUnscoped=true required.');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:606:      tenantId: row.tenant_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:607:      userId: row.user_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:608:      agentId: row.agent_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:609:      sessionId: row.session_id ?? undefined,
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
.opencode/plugins/spec-kit-compact-code-graph.js:36:const PLUGIN_ID = 'spec-kit-compact-code-graph';
.opencode/plugins/spec-kit-compact-code-graph.js:44:const BRIDGE_PATH = fileURLToPath(new URL('./spec-kit-compact-code-graph-bridge.mjs', import.meta.url));
.opencode/plugins/spec-kit-compact-code-graph.js:121:  return `${specFolder ?? '__workspace__'}::${sessionID ?? '__global__'}`;
.opencode/plugins/spec-kit-compact-code-graph.js:296:      spec_kit_compact_code_graph_status: tool({
.opencode/plugins/spec-kit-compact-code-graph.js:297:        description: 'Show Spec Kit compact code graph plugin cache status',
.opencode/plugins/spec-kit-compact-code-graph.js:307:            `spec_folder=${options.specFolder ?? 'auto'}`,
.opencode/plugins/spec-kit-compact-code-graph.js:396:    'experimental.session.compacting': async (input, output) => {
.opencode/plugins/spec-kit-compact-code-graph.js:416:      output.context.push(rendered);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:16:import { classifyQueryIntent } from '../lib/code-graph/query-intent-classifier.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:17:import { buildContext } from '../lib/code-graph/code-graph-context.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:60:// Feature catalog: Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:61:// Feature catalog: Dual-scope memory auto-surface
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:79:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:80:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:81:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:82:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:84:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:87:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:116:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:117:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:118:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:119:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:121:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:124:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:156:  source: 'explicit' | 'auto-detected';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:201:  preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:304:  graphContextResult: Record<string, unknown> | null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:314:  const metadata = graphContextResult?.metadata as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:323:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:324:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:386:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:397:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:643:  auto: {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:704:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:705:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:706:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:707:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:709:    session_id: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:725:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:726:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:727:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:728:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:730:    includeConstitutional: true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:734:    sessionId: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:739:    autoDetectIntent: intent ? false : true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:756:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:757:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:758:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:759:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:761:    includeConstitutional: true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:765:    sessionId: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:770:    autoDetectIntent: intent ? false : true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:790:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:791:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:792:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:793:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:795:    includeConstitutional: false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:799:    sessionId: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:804:    autoDetectIntent: intent ? false : true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:827:  // Security: session scope derived from server context, not caller input
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:828:  const trustedSession = sessionManager.resolveTrustedSession(args.sessionId ?? null, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:829:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:830:    userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:831:    agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:873:  const requestedMode = args.mode ?? 'auto';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:891:  if (requestedMode === 'auto') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:943:      source: explicitIntent ? 'explicit' : 'auto-detected',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1078:/** Handle memory_context tool — L1 orchestration layer that routes to optimal retrieval strategy.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1092:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1104:    mode: requested_mode = 'auto',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1117:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1131:  // graph context for structural/hybrid queries. Entire block is
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1140:  let graphContextResult: Record<string, unknown> | null = null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1161:      // "code-graph-db.ts"). Falls back to first matched keyword, then normalizedInput.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1173:            graphContextResult = {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1174:              graphContext: cgResult.graphContext,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1182:          // Code graph unavailable — fall through to semantic
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1188:            graphContextResult = {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1189:              graphContext: cgResult.graphContext,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1197:          // Code graph unavailable — hybrid degrades to semantic-only
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1200:      // 'semantic' or low-confidence: no graph context, fall through
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1231:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1234:      details: { requestId, layer: 'L1:Orchestration', requestedSessionId: args.sessionId ?? null },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1236:        hint: 'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1250:  const layerInfo: LayerInfo | null = layerDefs.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1264:  const autoResumeEnabled = isAutoResumeEnabled(effectiveSessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1281:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1282:    userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1283:    agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1284:    sharedSpaceId: args.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1286:    sessionId: effectiveSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1318:  // Phase C: Intent-to-profile auto-routing for memory_context.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1319:  // Explicit caller `profile` always takes precedence; auto-detect fills in when absent.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1324:      const autoProfile = intentClassifier.getProfileForIntent(
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1327:      if (autoProfile) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1328:        options.profile = autoProfile;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1329:        console.error(`[memory-context] Intent-to-profile auto-routing: '${detectedIntent}' → profile '${autoProfile}'`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1331:    } catch (_autoProfileErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1354:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1355:    userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1356:    agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1375:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1393:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1425:  // M1 FIX: Inject auto-resume context BEFORE budget enforcement
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1434:  if (autoResumeEnabled && effectiveMode === 'resume' && resumedSession) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1452:  // Phase 020: Attach graph context and query-intent routing metadata
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1454:  if (graphContextResult) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1455:    responseData.graphContext = graphContextResult;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1463:    graphContextResult,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1471:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1478:      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1583:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1584:      error: 'memory_context failed due to an internal error',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1606:const handle_memory_context = handleMemoryContext;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1609:  handle_memory_context,
.opencode/skill/mcp-coco-index/README.md:2:title: "CocoIndex Code - Semantic Code Search"
.opencode/skill/mcp-coco-index/README.md:3:description: "Semantic code search via vector embeddings. CocoIndex Code enables natural-language discovery of code, patterns, and implementations across 28+ languages using a CLI and a single MCP search tool."
.opencode/skill/mcp-coco-index/README.md:14:# CocoIndex Code - Semantic Code Search
.opencode/skill/mcp-coco-index/README.md:42:CocoIndex Code is a semantic code search tool built on vector embeddings. Where `grep` matches exact characters, CocoIndex Code matches meaning. Ask for "retry logic with exponential backoff" and it returns code that implements that pattern, regardless of how the author named variables or functions. This makes it the right tool when you know what a piece of code does but not where it lives or what it is called.
.opencode/skill/mcp-coco-index/README.md:46:Indexing is incremental and daemon-backed. The first run scans and embeds all supported files in the project. Subsequent runs update only changed files. A background daemon starts automatically on the first command, persists across calls, and restarts itself when settings or the binary version change.
.opencode/skill/mcp-coco-index/README.md:55:| Default embedding model | `sentence-transformers/all-MiniLM-L6-v2` (local, no API key) |
.opencode/skill/mcp-coco-index/README.md:65:| `ccc search` (CocoIndex) | You know what code does but not where it lives | Approximate, needs verification |
.opencode/skill/mcp-coco-index/README.md:66:| `code_graph_query` | You need exact callers, imports, or structural dependencies | Requires the structural graph to be indexed first |
.opencode/skill/mcp-coco-index/README.md:78:| Path filters | `--path` (CLI) or `paths` (MCP) scopes results to a directory |
.opencode/skill/mcp-coco-index/README.md:80:| Daemon architecture | Auto-starts, auto-restarts on version or settings change |
.opencode/skill/mcp-coco-index/README.md:81:| Spec Kit integration | Companion lifecycle tools (`ccc_status`, `ccc_reindex`, `ccc_feedback`) and code-graph/session integration are available through system-spec-kit |
.opencode/skill/mcp-coco-index/README.md:85:In the broader system-spec-kit stack, CocoIndex is the semantic half of a three-system retrieval model: CocoIndex finds conceptually similar code, Code Graph answers structural questions, and session bootstrap surfaces CocoIndex readiness during recovery. The companion lifecycle helpers exposed through system-spec-kit are `ccc_status`, `ccc_reindex`, and `ccc_feedback`.
.opencode/skill/mcp-coco-index/README.md:137:CocoIndex Code resolves queries by embedding the natural-language query text and comparing the resulting vector against pre-computed vectors for every code chunk in the index. This means the search engine reads intent, not characters. A query for "graceful shutdown handler" finds code that tears down servers or releases resources, even if the words "graceful", "shutdown", or "handler" never appear in that code.
.opencode/skill/mcp-coco-index/README.md:139:The two embedding models trade off quality against convenience. The local model (`all-MiniLM-L6-v2`) requires no API key and works offline, making it the right default for most projects. The Voyage Code 3 model produces 1024-dimensional vectors trained specifically on code, and consistently returns higher-quality results for complex queries on large codebases. Switching models requires a full reset and reindex because the vector dimensions are incompatible.
.opencode/skill/mcp-coco-index/README.md:223:    install.sh                     Install CocoIndex Code into skill venv
.opencode/skill/mcp-coco-index/README.md:248:**Global settings** (`~/.cocoindex_code/global_settings.yml`)
.opencode/skill/mcp-coco-index/README.md:256:  device: cpu                           # cpu | cuda | mps (auto-detects if omitted)
.opencode/skill/mcp-coco-index/README.md:297:| `COCOINDEX_CODE_ROOT_PATH` | auto-detected | Override project root for indexing |
.opencode/skill/mcp-coco-index/README.md:303:CocoIndex Code resolves the project root in this order:
.opencode/skill/mcp-coco-index/README.md:427:Common causes: The index reflects the previous state of the codebase. Incremental indexing tracks file changes but does not automatically detect branch switches.
.opencode/skill/mcp-coco-index/README.md:438:**Embedding model mismatch after changing `global_settings.yml`**
.opencode/skill/mcp-coco-index/README.md:457:Common causes: CocoIndex Code requires Python 3.11 or later. The system Python may be an older version.
.opencode/skill/mcp-coco-index/README.md:473:**Q: Why does CocoIndex Code only expose one MCP tool when the CLI has seven commands?**
.opencode/skill/mcp-coco-index/README.md:479:**Q: When should I use Voyage Code 3 instead of the local model?**
.opencode/skill/mcp-coco-index/README.md:481:A: Use Voyage Code 3 when search quality matters more than avoiding an API dependency. The local model (`all-MiniLM-L6-v2`) is a general-purpose sentence embedding model with 384 dimensions. It works well for most queries but can miss nuanced code patterns. Voyage Code 3 was trained on code and produces 1024-dimensional vectors, giving it better discrimination between semantically similar but functionally different patterns. Switch to it when you notice too many false positives or misses on important queries. Remember: switching models requires `ccc reset && ccc index`.
.opencode/skill/mcp-coco-index/README.md:487:A: The daemon handles incremental updates automatically. Run `ccc index` manually after major structural changes: branch switches, large merges, or significant refactors. For day-to-day work, the index stays current because changed files are detected on each query when `refresh_index=true` (MCP default) or `--refresh` (CLI flag).
.opencode/skill/mcp-coco-index/README.md:513:| [scripts/install.sh](scripts/install.sh) | Install CocoIndex Code |
.opencode/skill/mcp-coco-index/README.md:528:| CocoIndex GitHub | https://github.com/cocoindex-io/cocoindex |
.opencode/skill/mcp-coco-index/README.md:529:| CocoIndex Code on PyPI | https://pypi.org/project/cocoindex-code/ |
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:65:import { normalizeScopeContext } from '../lib/governance/scope-governance.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:100:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:113: * Self-contained: uses local types instead of the deprecated MemoryRow/MemoryRecord shapes.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:176:  cursor?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:181:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:182:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:183:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:184:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:190:  includeConstitutional?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:194:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:197:  autoDetectIntent?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:205:  enableCausalBoost?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:213:  /** Phase B T019: Dual-level retrieval — 'local' (entity), 'global' (community), 'auto' (local + fallback). */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:214:  retrievalLevel?: 'local' | 'global' | 'auto';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:324:function buildSessionStatePayload(sessionId: string): Record<string, unknown> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:325:  const session = retrievalSessionStateManager.getOrCreate(sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:340:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:450:function applySessionDedup(results: MemorySearchRow[], sessionId: string, enableDedup: boolean): DedupResult {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:451:  if (!enableDedup || !sessionId || !sessionManager.isEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:454:      dedupStats: { enabled: false, sessionId: null }
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:458:  const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, results as Parameters<typeof sessionManager.filterSearchResults>[1]);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:461:    sessionManager.markResultsSent(sessionId, filtered as Parameters<typeof sessionManager.markResultsSent>[1]);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:468:      sessionId
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:493:    cursor,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:498:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:499:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:500:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:501:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:507:    includeConstitutional: includeConstitutional = true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:511:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:514:    autoDetectIntent: autoDetectIntent = true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:522:    enableCausalBoost: enableCausalBoost = isCausalBoostEnabled(),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:529:    retrievalLevel: retrievalLevel = 'auto',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:533:  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:535:    tenantId: normalizedScope.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:536:    userId: normalizedScope.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:537:    agentId: normalizedScope.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:538:    sessionId: normalizedScope.sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:539:    sharedSpaceId: normalizedScope.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:543:  const hasCursor = typeof cursor === 'string' && cursor.trim().length > 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:547:    return { content: [{ type: 'text', text: JSON.stringify({ error: 'Either "query" (string), "concepts" (array with 2-5 items), or "cursor" (string) is required.' }) }] };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:551:    const resolved = resolveCursor(cursor.trim(), undefined, { scopeKey: progressiveScopeKey });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:554:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:555:        error: 'Cursor is invalid, expired, or out of scope',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:557:        details: { parameter: 'cursor' },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:559:          hint: 'Retry the original search to generate a fresh continuation cursor',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:566:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:594:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:613:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:614:      error: 'Either query (string), concepts (array of 2-5 strings), or cursor (string) is required',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:618:        hint: 'Provide a query string, concepts array with 2-5 entries, or a continuation cursor'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:625:      tool: 'memory_search',
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
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:714:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:724:    tenantId: normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:725:    userId: normalizedScope.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:726:    agentId: normalizedScope.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:727:    sharedSpaceId: normalizedScope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:737:    includeConstitutional,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:744:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:746:    enableCausalBoost,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:751:  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:781:      tenantId: normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:782:      userId: normalizedScope.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:783:      agentId: normalizedScope.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:784:      sharedSpaceId: normalizedScope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:788:      includeConstitutional,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:797:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:800:      enableCausalBoost,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:818:      (retrievalLevel === 'global' || retrievalLevel === 'auto')
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:822:        (retrievalLevel === 'global') ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:823:        (resultsForFormatting.length < 3 && retrievalLevel === 'auto');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:886:    if (sessionId && isSessionRetrievalStateEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:889:        retrievalSessionStateManager.updateGoal(sessionId, activeGoal);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:892:        retrievalSessionStateManager.setAnchors(sessionId, anchors);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:895:      const goalRefinement = refineForGoal(resultsForFormatting, sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:947:    if (pipelineResult.metadata.stage2.graphContribution) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:948:      extraData.graphContribution = pipelineResult.metadata.stage2.graphContribution;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:949:      extraData.graph_contribution = pipelineResult.metadata.stage2.graphContribution;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:992:      appliedBoosts.communityFallback = { applied: true, retrievalLevel };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1033:          { scopeKey: progressiveScopeKey },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1044:      toolCache.set(cacheKey, cachePayload, { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1054:  if (sessionId && isSessionRetrievalStateEnabled() && !sessionManager.isEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1062:      const deduped = deduplicateWithSessionState(existingResults, sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1072:  if (sessionId && enableDedup && sessionManager.isEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1103:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1121:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1146:  if (sessionId && isSessionRetrievalStateEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1159:        retrievalSessionStateManager.markSeen(sessionId, returnedIds);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1162:      data.sessionState = buildSessionStatePayload(sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1208:        session_id: sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1275:            sessionId: sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1314:          trackQueryAndDetect(db, sessionId ?? null, normalizedQuery, queryId, shownIds);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1319:          logResultCited(db, sessionId ?? null, queryId, shownIds);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1326:  // Phase C: effectiveProfile includes auto-routed profile from intent detection.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1374:const handle_memory_search = handleMemorySearch;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1377:  handle_memory_search,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:52:  autoSurfaceMemories,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:53:  autoSurfaceAtToolDispatch,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:54:  autoSurfaceAtCompaction,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:81:import { createUnifiedGraphSearchFn } from './lib/search/graph-search-fn.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:82:import { isGraphUnifiedEnabled } from './lib/search/graph-flags.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:83:import * as graphDb from './lib/code-graph/code-graph-db.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:84:import { detectRuntime, type RuntimeInfo } from './lib/code-graph/runtime-detection.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:95:} from './lib/search/graph-lifecycle.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:102:import { disposeLocalReranker } from './lib/search/local-reranker.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:107:// T059: Archival manager for automatic archival of ARCHIVED state memories
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:171:  /** T018: Structured Prime Package for non-hook CLI auto-priming */
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:213:  'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:214:  'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:215:  'code_graph_scan',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:216:  'code_graph_status',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:254:  preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:255:  secondaryTool: 'code_graph_context';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:295:    graphReady: boolean;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:305:  if (!options.graphReady || !options.activationScaffoldReady) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:320:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:321:    secondaryTool: 'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:322:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:360:  const transportSessionId = typeof (extra as { sessionId?: unknown } | null)?.sessionId === 'string'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:361:    ? ((extra as { sessionId?: string }).sessionId ?? null)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:363:  const explicitSessionId = typeof args.sessionId === 'string'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:364:    ? args.sessionId
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:378:// that lack an explicit sessionId param can still correlate with a prior search.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:507:    const outline = graphDb.queryOutline(filePath).slice(0, GRAPH_ENRICHMENT_OUTLINE_LIMIT);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:518:      for (const entry of graphDb.queryEdgesFrom(node.symbolId)) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:546:      for (const entry of graphDb.queryEdgesTo(node.symbolId)) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:659:  const graphContext = await Promise.race([buildPromise, timeoutPromise]);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:663:  return graphContext;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:681:    ? 'loaded code graph status'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:682:    : 'code graph status unavailable';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:694:    hints.push(`Code graph: ${pkg.codeGraphStatus}, CocoIndex: ${pkg.cocoIndexAvailable ? 'available' : 'not installed'}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:749:  if (isGraphUnifiedEnabled()) channels.push('graph');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:768:    const hasData = snap.specFolder || snap.graphFreshness !== 'error' || snap.sessionQuality !== 'unknown';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:771:        snap.graphFreshness === 'empty' ? 'run code_graph_scan' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:776:      lines.push(`- Code graph: ${snap.graphFreshness}`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:786:  lines.push('- If structural context shows "ready": code_graph_query is available for structural lookups');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:798:    if (snap.graphFreshness === 'fresh' || snap.graphFreshness === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:799:      routingRules.push('Structural queries (callers, imports, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:885:    if (name.startsWith('code_graph_')) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:886:      recordMetricEvent({ kind: 'code_graph_query' });
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
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:985:            existingHints.push('Tip: For code search queries, consider using mcp__cocoindex_code__search for semantic code search or code_graph_query for structural lookups.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1005:                graphReady: snapshot.graphFreshness === 'fresh',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1020:    // F057: Passive context enrichment pipeline — adds code graph symbols
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1045:    // SK-004: Inject auto-surface hints before token-budget enforcement so
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1047:    if (autoSurfacedContext && result && !result.isError) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1048:      appendAutoSurfaceHints(result, autoSurfacedContext);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1069:          if (autoSurfacedContext && !result.isError) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1070:            meta.autoSurfacedContext = autoSurfacedContext;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1073:            meta.graphContext = dispatchGraphContext;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1340:// P1-09 FIX: Hoist transport to module scope so shutdown handlers can close it
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1377:    await runAsyncCleanupStep('local-reranker', async () => {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1663:    const graphSearchFn = isGraphUnifiedEnabled()
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1669:    hybridSearch.init(database, vectorIndex.vectorSearch, graphSearchFn);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1672:    initDbState({ graphSearchFn });
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1685:          '[context-server] Scheduled graph refresh applied: dirty_nodes=%d, updated_edges=%d',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1689:      } catch (graphRefreshErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1690:        const message = graphRefreshErr instanceof Error ? graphRefreshErr.message : String(graphRefreshErr);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1691:        console.warn('[context-server] Scheduled graph refresh failed:', message);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1696:    // P3-04: Rebuild BM25 index from database on startup
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1701:        console.error(`[context-server] BM25 index rebuilt from database: ${count} documents`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1704:        console.warn('[context-server] BM25 index rebuild failed:', message);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1728:    // T059: Archival Manager for automatic archival of ARCHIVED state memories
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1803:            console.error('[context-server] Recoverable sessions:', interrupted.sessions.map((s: { sessionId: string }) => s.sessionId).join(', '));
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1829:    // P1-7: Optional real-time markdown watcher for automatic re-indexing.

codex
I have the high-level contrast now, and I’m drilling into the exact retrieval mechanics on our side so the comparison isn’t hand-wavy. Next I’m pulling line-anchored sections for `memory_search`, hybrid-search internals, graph routing, and the compaction transports on both sides.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/plugins/spec-kit-compact-code-graph.js | sed -n '360,460p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/mcp-coco-index/README.md | sed -n '1,140p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc 'rg -n "class HybridSearch|function .*Hybrid|RRF|reciprocal|vectorSearch|bm25|fts5|communityFallback|retrievalLevel|graphEvidence" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:214:  retrievalLevel?: 'local' | 'global' | 'auto';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:529:    retrievalLevel: retrievalLevel = 'auto',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:813:    let communityFallbackApplied = false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:818:      (retrievalLevel === 'global' || retrievalLevel === 'auto')
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:822:        (retrievalLevel === 'global') ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:823:        (resultsForFormatting.length < 3 && retrievalLevel === 'auto');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:845:                _communityFallback: true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:852:                communityFallbackApplied = true;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:991:    if (communityFallbackApplied) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:992:      appliedBoosts.communityFallback = { applied: true, retrievalLevel };
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:18://   - bm25-index.ts     ~line 245  : where `content_text` is used for token building
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:253: *   bm25-index.ts ~line 245 where `content_text` is used for token building.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:156:  - `bm25-baseline.ts` — lexical-only baseline measurement.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:205:    CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:138:| `fusionLatencyMs` | `number` | RRF fusion duration |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:35:      "query": "what decisions led to using RRF instead of a weighted linear combination for search fusion",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:40:      "expectedResultDescription": "Decision records from hybrid-rag-fusion spec (spec 139) about fusion strategy selection. Should surface rationale for RRF over linear weighted sum.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:370:      "expectedResultDescription": "Should surface bm25-index.ts isBm25Enabled() function and any documentation about the BM25 feature flag.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:455:      "query": "how does RRF fusion combine vector and BM25 channel scores",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:605:      "query": "RRF reciprocal rank fusion channel weights",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:611:      "notes": "Derived from \"reciprocal rank fusion\" trigger phrase in the hybrid search documentation."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:660:      "expectedResultDescription": "Should surface bm25-index.ts tokenize() and simpleStem() functions and any spec documentation about the text normalization approach.",
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:271:| `temporal-contiguity.ts`   | Time-based linking        | `vectorSearchWithContiguity`, `getTemporalNeighbors`, `buildTimeline`       |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:550:  vectorSearchFn  // (embedding: Float32Array, options) => Array<{id, similarity}>
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:701:  vectorSearchWithContiguity,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:717:const boosted = vectorSearchWithContiguity(results, DEFAULT_WINDOW);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:6:// Pipeline position: after RRF fusion, before state filtering.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:38:  /** Retrieval score for this chunk (e.g., RRF score, similarity). */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:75:  bm25MRR: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:100:  /** Source channel identifier. Expected: 'bm25' or 'fts'. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:149: * @param bm25MRR - The measured MRR@5 value (must be in [0, 1]).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:152:export function evaluateContingency(bm25MRR: number): ContingencyDecision {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:153:  if (bm25MRR >= 0.80) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:155:      bm25MRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:167:  if (bm25MRR >= 0.50) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:169:      bm25MRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:181:    bm25MRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:202: *   ratio = bm25MRR / hybridMRR
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:213: * @param bm25MRR   - BM25-only MRR@5 (must be in [0, 1]).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:218:  bm25MRR: number,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:221:  if (!Number.isFinite(bm25MRR) || !Number.isFinite(hybridMRR) || hybridMRR <= 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:223:      bm25MRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:235:  const ratio = bm25MRR / hybridMRR;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:239:      bm25MRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:247:        `(${bm25MRR.toFixed(4)} / ${hybridMRR.toFixed(4)}). ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:255:      bm25MRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:263:        `(${bm25MRR.toFixed(4)} / ${hybridMRR.toFixed(4)}). ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:270:    bm25MRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:278:      `(${bm25MRR.toFixed(4)} / ${hybridMRR.toFixed(4)}). ` +
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:419: * Channel is recorded as 'bm25' to distinguish from multi-channel runs.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:438:  const channel = 'bm25';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:453:      'bm25_contingency_decision',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:454:      result.contingencyDecision.bm25MRR,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:478: * deterministic results (see tests/bm25-baseline.vitest.ts).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:529:    // Run BM25-only search (channels: bm25/fts only, no vector/graph/trigger)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:64:let bm25IndexModule: Bm25IndexModule | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:65:let bm25IndexModulePromise: Promise<Bm25IndexModule | null> | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:68:  if (bm25IndexModule !== null) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:69:    return bm25IndexModule;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:71:  if (bm25IndexModulePromise !== null) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:72:    return bm25IndexModulePromise;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:75:  const primaryModulePath = '../search/bm25-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:76:  const fallbackModulePath = '../../search/bm25-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:80:      bm25IndexModule = await import(primaryModulePath) as Bm25IndexModule;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:81:      return bm25IndexModule;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:86:        bm25IndexModule = await import(fallbackModulePath) as Bm25IndexModule;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:87:        return bm25IndexModule;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:91:          `[archival-manager] bm25-index module unavailable. primary="${primaryError}" fallback="${fallbackMessage}"`
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:98:  bm25IndexModulePromise = loadPromise;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:102:    if (bm25IndexModulePromise === loadPromise) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:103:      bm25IndexModulePromise = null;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:109:  if (bm25IndexModule !== null) return bm25IndexModule;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:110:  if (bm25IndexModulePromise === null) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:491:  const bm25 = getBm25Index();
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:492:  if (!db || !bm25 || !bm25.isBm25Enabled()) return;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:495:    bm25.getIndex().removeDocument(String(memoryId));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:520:  const bm25 = getBm25Index();
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:521:  if (!db || !bm25 || !bm25.isBm25Enabled()) return;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:534:    const text = bm25.buildBm25DocumentText(row);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:536:    bm25.getIndex().addDocument(String(memoryId), text);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:183:| `mpab-aggregation.ts` | Multi-Parent Aggregated Bonus (MPAB) for chunk-to-memory score aggregation; computes aggregated scores after RRF fusion, collapses and reassembles chunk results |
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:9:import * as bm25Index from '../search/bm25-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:524:  if (bm25Index.isBm25Enabled()) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:526:      bm25Index.getIndex().addDocument(String(memoryId), bm25Index.buildBm25DocumentText({
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:271:  vectorSearchFn: (embedding: Float32Array, options: Record<string, unknown>) => Array<{ id: number; similarity: number; [key: string]: unknown }>
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:295:    const similar = vectorSearchFn(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:35:  /** Filter to specific channels (e.g. 'vector', 'bm25', 'fts', 'graph', 'trigger'). */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:4:// Feature catalog: RRF K-value sensitivity analysis
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:5:// Measures the impact of different RRF K-values on ranking stability.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:21:  /** Average RRF score across all fused results for this K-value. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:98: * ranking and compute 1/rank. MRR@5 is the mean of those reciprocal ranks.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:141: * 5. Computes average RRF score
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:303:    sensitivityCurve = 'Flat — average RRF score is stable across all tested K values. Ranking is insensitive to K.';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:385:  /** Whether SPECKIT_RRF_K_EXPERIMENTAL was enabled */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:598: * Default: ON (graduated). Set SPECKIT_RRF_K_EXPERIMENTAL=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:610: * @param k - RRF smoothing constant to use for fusion
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:664: * Feature flag: SPECKIT_RRF_K_EXPERIMENTAL (default ON, graduated).
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:151:| `fusion` | RRF score fusion |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:93:  /** Channel name: "vector", "bm25", "graph", or "trigger". */
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts:63:export function vectorSearchWithContiguity(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:12:// - Channel toggle mechanism (vector, bm25, fts5, graph, trigger)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:52:export type AblationChannel = 'vector' | 'bm25' | 'fts5' | 'graph' | 'trigger';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:57:  'bm25',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:58:  'fts5',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:746:    // With production run IDs (same pattern as bm25-baseline.ts).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:1000:export function toHybridSearchFlags(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:1005:    useBm25: !disabledChannels.has('bm25'),
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:1006:    useFts: !disabledChannels.has('fts5'),
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:40:  /** Human-readable name for this shadow algorithm (e.g. "rrf-v2", "weighted-bm25"). */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:65:  -- Final fused results after RRF/fusion
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:19:import * as bm25Index from '../search/bm25-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:220:  let bm25RepairWarning: string | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:252:    let bm25RepairNeeded = false;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:282:      mergedBm25DocumentText = bm25Index.buildBm25DocumentText({
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:314:        bm25_repair_needed: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:358:      if (bm25Index.isBm25Enabled()) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:360:          const bm25 = bm25Index.getIndex();
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:361:          bm25.removeDocument(String(existingMemory.id));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:362:          bm25.addDocument(String(newId), mergedBm25DocumentText);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:363:        } catch (bm25Err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:364:          const message = bm25Err instanceof Error ? bm25Err.message : String(bm25Err);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:366:          bm25RepairNeeded = true;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:392:    if (bm25RepairNeeded) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:400:        bm25RepairWarning =
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:414:      warnings: bm25RepairWarning ? [bm25RepairWarning] : undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:740:  if (!bm25Index.isBm25Enabled()) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:745:    const bm25 = bm25Index.getIndex();
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:747:      bm25.removeDocument(String(args.previousMemoryId));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:749:    bm25.removeDocument(String(args.memoryId));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:750:    bm25.addDocument(String(args.memoryId), args.documentText);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:768:  if (tableColumns.has('bm25_repair_needed')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:773:    db.exec('ALTER TABLE memory_index ADD COLUMN bm25_repair_needed INTEGER DEFAULT 0');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:774:    tableColumns.add('bm25_repair_needed');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:778:      tableColumns.add('bm25_repair_needed');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:781:    console.warn('[reconsolidation] Failed to ensure bm25_repair_needed column:', message);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:791:  if (!tableColumns.has('bm25_repair_needed')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:798:      SET bm25_repair_needed = ?,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:804:    console.warn(`[reconsolidation] Failed to persist bm25_repair_needed=${repairNeeded ? 1 : 0} for memory ${memoryId}: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:42:| `bm25-baseline.ts` | BM25-only baseline measurement and baseline metric persistence |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:51:| `k-value-analysis.ts` | RRF K-value sweep helpers |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:411:function isHybridDecayPolicyEnabled(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:425:function classifyHybridDecay(contextType: string): HybridDecayClass {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:432:function getHybridDecayMultiplier(contextType: string, _importanceTier?: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:451:function applyHybridDecayPolicy(stability: number, contextType: string, importanceTier?: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:140:│   ├── bm25-index.ts           # BM25 lexical indexing
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:238:│   ├── bm25-baseline.ts        # BM25 baseline measurement
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:320:| `search/vector-index.ts` | Core vector similarity search with RRF fusion |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:323:| `search/bm25-index.ts` | BM25 lexical search indexing |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:341:| `search/graph-search-fn.ts` | Typed-weighted degree computation for RRF 5th channel |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:372:| **Fusion** | Uses Reciprocal Rank Fusion (RRF) to merge results |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:535:const results = vectorIndex.vectorSearch(queryEmbedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:7:// Use inside the hybrid-search pipeline after RRF/RSF fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:9:import { BM25_FTS5_WEIGHTS, normalizeLexicalQueryTokens } from './bm25-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:28:type LexicalPath = 'fts5' | 'like' | 'unavailable';
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:33:  | 'no_such_module_fts5'
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:34:  | 'bm25_runtime_failure';
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:84:  return toErrorMessage(error).toLowerCase().includes('no such module: fts5');
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:89:  return message.includes('bm25');
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:127:        fallbackState: 'no_such_module_fts5',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:137:    lexicalPath: 'fts5',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:149: * Uses SQLite FTS5's built-in bm25() ranking function with
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:159: * const rows = fts5Bm25Search(db, 'memory search', { limit: 10 });
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:162:function fts5Bm25Search(
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:197:    SELECT m.*, -bm25(memory_fts, ${w0}, ${w1}, ${w2}, ${w3}) AS fts_score
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:226:      lexicalPath: 'fts5',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:235:          fallbackState: 'no_such_module_fts5',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:240:            fallbackState: 'bm25_runtime_failure',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:249:              fallbackState: 'bm25_runtime_failure',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:260: * Used as a feature-detect before calling fts5Bm25Search, since FTS5
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:268: *   fts5Bm25Search(db, 'memory');
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:282:  fts5Bm25Search,
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:17:   * scores; use min-max normalization or RRF when combining with other methods.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:323:    const queryTokens = normalizeLexicalQueryTokens(query).bm25;
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:415:      console.warn(`[bm25-index] Failed to sync BM25 rows: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:465:      console.warn(`[bm25-index] Failed to schedule BM25 warmup: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:562:  bm25: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:574:    bm25: sharedTokens
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:7:import { sanitizeFTS5Query } from './bm25-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:35:/** Edge type weights for typed-degree computation (R4 5th RRF channel) */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:172:        -bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) AS fts_score
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:691:  // Typed-degree computation (R4 5th RRF channel)
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:8: * assumed normalized [0,1] scores, but raw RRF scores (~0.01-0.03) never exceeded that
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:9: * threshold, causing channel-representation promotion to silently reject ALL RRF results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:11: * compatible with both raw RRF scores and normalized [0,1] scores. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:77: * @param topK              - Ordered top-k results from RRF fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:103:  if (channelAttribution.includes('fts') || channelAttribution.includes('bm25')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:268:  const hasFTS = channelAttribution.includes('fts') || channelAttribution.includes('bm25');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:14:import * as bm25Index from './bm25-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:551:      if (bm25Index.isBm25Enabled()) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:552:        bm25Index.getIndex().removeDocument(String(id));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:699:        if (bm25Index.isBm25Enabled()) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:700:          const bm25 = bm25Index.getIndex();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:702:            bm25.removeDocument(String(id));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:9:import { getIndex, isBm25Enabled } from './bm25-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:15:import { fts5Bm25Search } from './sqlite-fts.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:107:   * When true, return immediately after adaptive/RRF fusion so Stage 2/3 can
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:118:   * - `'bm25'` — BM25 term-frequency relevance (min-max normalized per source group)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:138:/** Normalize a fused RRF result to the HybridSearchResult contract. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:139:function toHybridResult(result: FusionResult): HybridSearchResult {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:218: * Raw RRF scores are typically small decimals (often <0.05), so a
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:260:let vectorSearchFn: VectorSearchFn | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:314:  vectorSearchFn = vectorFn;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:324: * @returns Array of BM25-scored results tagged with source 'bm25'.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:326:function bm25Search(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:331:    console.warn('[hybrid-search] BM25 not enabled — returning empty bm25Search results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:394:        source: 'bm25',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:463:    // Uses bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) for per-column weighting
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:465:    // Filters: is_archived exclusion and spec_folder matching handled by fts5Bm25Search
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:466:    const bm25Results = fts5Bm25Search(db, query, { limit, specFolder, includeArchived });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:468:    return bm25Results.map(row => ({
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:494:  const bm25Results = bm25Search(query, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:505:  for (const r of bm25Results) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:532:function getCandidateSources(result: HybridSearchResult): string[] {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:542:function getCandidateSourceScores(result: HybridSearchResult): Record<string, number> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:681:function getAllowedChannels(options: HybridSearchOptions): Set<ChannelName> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:685:    allowed.add('bm25');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:689:  if (options.useBm25 === false) allowed.delete('bm25');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:708:    useBm25: allowedChannels.has('bm25'),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:745:function markFallbackRetry(results: HybridSearchResult[]): HybridSearchResult[] {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:850: * min-max normalization which produces different orderings than the RRF pipeline in hybridSearchEnhanced().
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:872:  if (useVector && embedding && vectorSearchFn) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:874:      const vectorResults = vectorSearchFn(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:903:    const bm25Results = bm25Search(query, { limit, specFolder });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:904:    results.push(...bm25Results);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:973: * Enhanced hybrid search with RRF fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:994:async function collectAndFuseHybridResults(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1010:    const allPossibleChannels: ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'];
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1055:    let bm25ChannelResults: HybridSearchResult[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1062:    if (activeChannels.has('vector') && embedding && vectorSearchFn) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1064:        const vectorResults = vectorSearchFn(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1104:    // BM25 channel (internal error handling in bm25Search) — gated by query-complexity routing
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1105:    if (activeChannels.has('bm25')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1106:      bm25ChannelResults = bm25Search(query, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1107:      if (bm25ChannelResults.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1110:        lists.push({ source: 'bm25', results: bm25ChannelResults, weight: 0.6 });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1184:      ...bm25ChannelResults,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1234:      .filter((list) => list.source !== 'fts' && list.source !== 'bm25')
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1718:  if (allowedChannels.has('bm25')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1719:    const bm25Fallback = collectCandidatesFromLists(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1720:      [{ source: 'bm25', results: bm25Search(query, options) }],
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1723:    if (bm25Fallback.length > 0) return bm25Fallback;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1753:  // P3-03 FIX: Use hybridSearchEnhanced (with RRF fusion) instead of
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1777:  if (allowedChannels.has('bm25')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1778:    const bm25Results = bm25Search(query, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1779:    if (bm25Results.length > 0) return bm25Results;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1973:function injectContextualTree(row: HybridSearchResult, descCache: Map<string, string>): HybridSearchResult {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2000:function applyResultLimit(results: HybridSearchResult[], limit?: number): HybridSearchResult[] {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2049:function checkDegradation(results: HybridSearchResult[]): DegradationTrigger | null {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2266:function estimateResultTokens(result: HybridSearchResult): number {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2319:function createSummaryFallback(result: HybridSearchResult, budget: number): HybridSearchResult {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2467:  bm25Search,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:753:          CREATE VIRTUAL TABLE memory_fts USING fts5(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2384:    CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:88:  vectorSearch,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:97:  vectorSearchEnriched,
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:24:import { fts5Bm25Search } from './sqlite-fts.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:110:    const rawResults = fts5Bm25Search(db, query, { limit });
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:103:  /** RRF fusion score (0–1). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:17://   - vector: Direct vectorSearch
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:41:import { vectorSearchWithContiguity } from '../../cognitive/temporal-contiguity.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:890:          let vectorResults = vectorIndex.vectorSearch(effectiveEmbedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:900:              vectorSearchWithContiguity(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:930:    let vectorResults = vectorIndex.vectorSearch(effectiveEmbedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:940:        vectorSearchWithContiguity(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:963:  // For vector search, tier/contextType were already passed to vectorSearch,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1031:        const constitutionalResults = vectorIndex.vectorSearch(
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:3:description: "5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval with Reciprocal Rank Fusion (RRF) and Adaptive Fusion."
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:12:> 5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval, fused with Reciprocal Rank Fusion (RRF) and Adaptive Fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:39:The search subsystem provides production-grade hybrid search capabilities with multiple retrieval methods fused via RRF scoring. It handles query expansion, intent classification, typo tolerance and optional cross-encoder reranking.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:43:- **RRF Score Fusion**: Industry-standard k=40 with convergence bonuses
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:63:RRF Fusion (k=40) + Adaptive Fusion -> Unified scores
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:94:| BM25 | `bm25-index.ts` | Pure TypeScript keyword matching |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:128:### Reciprocal Rank Fusion (RRF)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:132:**Why RRF?**
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:135:- Citation: Cormack et al. "RRF outperforms Condorcet" (SIGIR 2009)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:140:- **Adaptive Fusion**: Intent-aware weighted RRF with dark-run mode (feature flag `SPECKIT_ADAPTIVE_FUSION`)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:148:// RRF score = 1/(40+2) + 1/(40+5) + 1.5/(40+1)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:177:- `lexicalPath`: the lane that actually ran for lexical retrieval. Current packet-owned values are `fts5` and `unavailable`. The wider response schema also allows `like`, but packet `010` does not claim that lane for this runtime seam.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:184:| `ok` | FTS5 compile probe passed, `memory_fts` exists, and BM25 ranking executed normally | `fts5` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:187:| `no_such_module_fts5` | The SQLite engine rejects FTS5 usage with `no such module: fts5` | `unavailable` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:188:| `bm25_runtime_failure` | The FTS5 table exists, but the `bm25(...)` ranking call fails at runtime | `unavailable` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:246:| **TypeScript**       | `hybrid-search.ts`, `cross-encoder.ts`, `intent-classifier.ts`, `bm25-index.ts`             |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:290:| `hybrid-search.ts`         | ~900   | TypeScript | Orchestrates vector/FTS/BM25/graph/degree fusion via adaptive RRF |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:294:| `bm25-index.ts`            | ~280   | TypeScript | Pure TypeScript BM25 (REQ-028, v1.2.0)              |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:309:| `evidence-gap-detector.ts` | -      | TypeScript | Z-score confidence check on RRF scores to detect low-confidence retrieval |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:367:   bm25-index.ts -> BM25 search (keyword)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:375:   rrf-fusion.ts -> RRF with k=40, convergence bonus
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:430:**RRF Parameters** (hardcoded, REQ-011):
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:510:// -> RRF + Adaptive Fusion -> MMR diversity -> Sorted by combined score
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:521:- If RRF disabled: Vector-only with basic metadata
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:642:The 5th RRF channel computes degree centrality with per-edge-type weights:
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:718:**Lexical Normalization + BM25 Document Text** (`bm25-index.ts`):
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:771:import { vectorSearch } from './vector-index';
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:776:init(db, vectorSearch);
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:787:// - sources: ['vector', 'bm25', 'graph']
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:788:// - vectorRank, bm25Rank, graphRank
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:833:import * as bm25Index from './bm25-index';
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:836:if (bm25Index.isBm25Enabled()) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:838:  const results = bm25Index.getIndex().search('authentication', {
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:877:- Quality floor corrected from 0.2 to 0.005 (D3) — aligns with RRF score range
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:934:- **RRF**: Cormack et al. "Reciprocal Rank Fusion outperforms Condorcet" (SIGIR 2009)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:943:| REQ-011 | RRF fusion enhancement           | hybrid-search.ts                |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:946:| REQ-014 | BM25 hybrid search               | bm25-index.ts, hybrid-search.ts |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:949:| REQ-028 | Pure TypeScript BM25             | bm25-index.ts                   |
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:380:export function isHybridDecayPolicyEnabled(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:521: * REQ-D1-003: Experimental per-intent RRF K selection.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:522: * Default: TRUE (graduated). Set SPECKIT_RRF_K_EXPERIMENTAL=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:525:  return isFeatureEnabled('SPECKIT_RRF_K_EXPERIMENTAL');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:617: * When enabled, search results include graphEvidence with contributing edges,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:661: * Adds retrievalLevel parameter: 'local' (entity), 'global' (community), 'auto' (local + fallback).
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:24:type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'degree';
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:41:const ALL_CHANNELS: readonly ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'] as const;
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:65: * - moderate: 3 channels (vector + fts + bm25) — balanced
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:70:  moderate: ['vector', 'fts', 'bm25'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:71:  complex: ['vector', 'fts', 'bm25', 'graph', 'degree'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:156:    ? enforceMinimumChannels([...channels, 'bm25'])
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:40:  /** N2a cap for RRF fusion overflow prevention. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:42:  /** N2b cap for RRF fusion overflow prevention. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:371:  return vectorIndex.vectorSearch(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:12:// MPAB MUST remain AFTER RRF fusion (Stage 2).
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:248:  // MPAB must remain AFTER RRF (Stage 2 constraint). This step runs
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:473: * RRF fusion (Stage 2). It is intentionally placed in Stage 3.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:90: *   - Parenthetical abbreviations: "Reciprocal Rank Fusion (RRF)" → "RRF"
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:91: *   - Parenthetical definitions: "RRF (Reciprocal Rank Fusion)" → "Reciprocal Rank Fusion"
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:215:    const similarMemories = vectorIndex.vectorSearch(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:6:// On RRF scores to detect low-confidence retrieval and inject
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:32: * Summarises Z-score statistics for the RRF score distribution.
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:39:  /** Arithmetic mean of all RRF scores. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:41:  /** Population standard deviation of all RRF scores. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:144: * Detect evidence gaps in an RRF score distribution.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:47:  graphEvidence?: {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:224: * Single point for ALL scoring signals: RRF/RSF, causal boost, co-activation,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1437:export { vector_search as vectorSearch };
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1446:export { vector_search_enriched as vectorSearchEnriched };
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:106:2. **G2 Double-Weighting Guard.** Intent weights are applied only for non-hybrid search types. Hybrid search incorporates intent weighting during RRF/RSF fusion internally.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:37:// Internally (RRF / RSF fusion). Post-search intent weighting is
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:397: * Phase C T026: Populate graphEvidence provenance on each result that received
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:496:  // Attach graphEvidence to each boosted result
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:520:      graphEvidence: {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:593: * Hybrid search (RRF / RSF) already incorporates intent-weighted signals
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1185:  // Populate graphEvidence on results that received graph-based boosts.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1211:  // Hybrid search (RRF / RSF) incorporates intent weighting during fusion —

2026-04-10T19:45:01.804675Z ERROR codex_core::tools::router: error=failed to parse function arguments: missing field `cell_id` at line 1 column 58
codex
The validation command is still finishing in the background, so I’m polling that while I tighten the line-level evidence on our side’s fusion and retrieval orchestration. I also have enough now to separate three layers cleanly: Mnemosyne’s wrapper, Mnemosyne’s README-level backend contract, and Public’s actual retrieval implementation.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '2460,2555p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '480,1030p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  2460	  checkDegradation,
  2461	  mergeResults,
  2462	  mergeRawCandidate,
  2463	};
  2464	
  2465	export {
  2466	  init,
  2467	  bm25Search,
  2468	  isBm25Available,
  2469	  combinedLexicalSearch,
  2470	  collectRawCandidates,
  2471	  isFtsAvailable,
  2472	  ftsSearch,
  2473	  hybridSearch,
  2474	  hybridSearchEnhanced,
  2475	  searchWithFallback,
  2476	  getGraphMetrics,
  2477	  resetGraphMetrics,
  2478	  // Token budget validation
  2479	  estimateTokenCount,
  2480	  estimateResultTokens,
  2481	  truncateToBudget,
  2482	  getTokenBudget,
  2483	  DEFAULT_TOKEN_BUDGET,
  2484	  SUMMARY_MAX_CHARS,
  2485	  // Re-exported module functions for caller access
  2486	  routeQuery,
  2487	  getDynamicTokenBudget,
  2488	  isDynamicTokenBudgetEnabled,
  2489	  // PI-A2: Tiered fallback exports
  2490	  structuralSearch,
  2491	  DEGRADATION_QUALITY_THRESHOLD,
  2492	  DEGRADATION_MIN_RESULTS,
  2493	};
  2494	
  2495	export type {
  2496	  HybridSearchOptions,
  2497	  HybridSearchResult,
  2498	  VectorSearchFn,
  2499	  // Token budget types
  2500	  OverflowLogEntry,
  2501	  TruncateToBudgetResult,
  2502	  // Pipeline metadata type
  2503	  Sprint3PipelineMeta,
  2504	  // PI-A2: Degradation types
  2505	  DegradationEvent,
  2506	  FallbackTier,
  2507	};

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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '748,800p;910,990p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   941	
   942	    // Ensure database is initialized (safe no-op if already done)
   943	    // P1-11 FIX: Module-level guard avoids redundant calls on every tool invocation
   944	    if (!dbInitialized) {
   945	      vectorIndex.initializeDb();
   946	      dbInitialized = true;
   947	    }
   948	
   949	    // T303: Dispatch to tool modules
   950	    const result = await dispatchTool(name, args) as ToolCallResponse | null;
   951	    if (!result) {
   952	      throw new Error(`Unknown tool: ${name}`);
   953	    }
   954	
   955	    let dispatchGraphContext: DispatchGraphContextMeta | null = null;
   956	    if (!result.isError) {
   957	      dispatchGraphContext = await resolveDispatchGraphContext(name, args);
   958	    }
   959	
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1060,1115p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1060	      type: detectedIntent,
  1061	      confidence: intentConfidence,
  1062	      source,
  1063	    } : null,
  1064	    folderDiscovery: discoveredFolder ? {
  1065	      discovered: true,
  1066	      specFolder: discoveredFolder,
  1067	      source: 'folder-discovery',
  1068	    } : null,
  1069	    structuralRoutingNudge,
  1070	    ...telemetryMeta,
  1071	  };
  1072	}
  1073	
  1074	/* ───────────────────────────────────────────────────────────────
  1075	   7. MAIN HANDLER
  1076	──────────────────────────────────────────────────────────────── */
  1077	
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '207,335p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/README.md | sed -n '1,80p;128,160p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	title: "Search Subsystem"
     3	description: "5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval with Reciprocal Rank Fusion (RRF) and Adaptive Fusion."
     4	trigger_phrases:
     5	  - "search subsystem"
     6	  - "hybrid search"
     7	  - "vector search"
     8	---
     9	
    10	# Search Subsystem
    11	
    12	> 5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval, fused with Reciprocal Rank Fusion (RRF) and Adaptive Fusion.
    13	
    14	---
    15	
    16	## TABLE OF CONTENTS
    17	<!-- ANCHOR:table-of-contents -->
    18	
    19	- [1. OVERVIEW](#1--overview)
    20	  - [4-STAGE PIPELINE ARCHITECTURE](#4--stage-pipeline-architecture)
    21	- [2. KEY CONCEPTS](#2--key-concepts)
    22	- [3. MODULE STRUCTURE](#3--module-structure)
    23	- [4. FEATURES](#4--features)
    24	  - [GRAPH SIGNAL FEATURES](#graph-signal-features)
    25	  - [SAVE-TIME PROCESSING PIPELINE](#save-time-processing-pipeline)
    26	  - [SCORING ENHANCEMENTS](#scoring-enhancements)
    27	- [FTS CAPABILITY CASCADE FLOOR](#fts-capability-cascade-floor)
    28	- [5. USAGE EXAMPLES](#5--usage-examples)
    29	- [6. RECENT CHANGES (SPRINT 8)](#6--recent-changes-sprint-8)
    30	- [7. RELATED RESOURCES](#7--related-resources)
    31	
    32	<!-- /ANCHOR:table-of-contents -->
    33	
    34	---
    35	
    36	## 1. OVERVIEW
    37	<!-- ANCHOR:overview -->
    38	
    39	The search subsystem provides production-grade hybrid search capabilities with multiple retrieval methods fused via RRF scoring. It handles query expansion, intent classification, typo tolerance and optional cross-encoder reranking.
    40	
    41	**Core Capabilities:**
    42	- **5-Channel Hybrid Search**: Vector (semantic) + BM25/FTS5 (lexical) + Graph (relationship-based) + Graph Structure (structural)
    43	- **RRF Score Fusion**: Industry-standard k=40 with convergence bonuses
    44	- **Intent Classification**: 7 intent types route to task-specific retrieval weights
    45	- **Query Enhancement**: Fuzzy matching (Levenshtein) + acronym expansions (via hybrid-search.ts inline logic)
    46	- **Reranking Pipeline**: Optional cross-encoder with length penalties
    47	- **MMR Diversity Reranking**: Maximal Marginal Relevance to reduce redundancy in result sets
    48	- **Evidence Gap Detection**: Identifies missing context and suggests follow-up queries
    49	- **Schema Management**: sqlite-vec schema v15 (current) with document-type fields, event-based decay and phase-aware columns
    50	
    51	**Architecture Pattern:**
    52	```text
    53	Query Input
    54	    |
    55	Intent Classifier -> Task-specific weights
    56	    |
    57	Parallel Search (5 channels)
    58	|---> Vector (sqlite-vec)       -> Semantic matches
    59	|---> BM25 (Pure JS)            -> Keyword matches
    60	|---> Graph (Co-activation)     -> Relationship matches
    61	|---> Graph Structure           -> Structural matches
    62	    |
    63	RRF Fusion (k=40) + Adaptive Fusion -> Unified scores
    64	    |
    65	MMR Diversity Reranking -> Redundancy reduction
    66	    |
    67	Cross-Encoder Rerank (optional) -> Relevance refinement
    68	    |
    69	Recency Boost + Co-activation -> Final adjustments
    70	    |
    71	Final Results
    72	```
    73	
    74	**Architecture Note:**
    75	`vector-index.ts` is the primary typed export surface for the vector index and re-exports the split schema, query, mutation, store and alias modules. `vector-index-impl.ts` is now a 14-line backward-compatibility shim that simply re-exports `vector-index.ts` for older import paths.
    76	
    77	<a id="4-stage-pipeline-architecture"></a>
    78	### 4-Stage Pipeline Architecture
    79	
    80	The search pipeline (R6) decomposes retrieval into four bounded stages with strict responsibilities. Each stage has clear input/output contracts defined in `pipeline/types.ts`.
   128	### Reciprocal Rank Fusion (RRF)
   129	
   130	**Formula**: `score = Sum 1/(k + rank_i)` where k=40 (tuned for ~1000-memory corpus)
   131	
   132	**Why RRF?**
   133	- Parameter-free fusion (no weight tuning required)
   134	- Resilient to retrieval method failures (graceful degradation)
   135	- Citation: Cormack et al. "RRF outperforms Condorcet" (SIGIR 2009)
   136	
   137	**Enhancements (REQ-011):**
   138	- **10% Convergence Bonus**: Results in multiple sources get +10% score boost
   139	- **1.5x Graph Weight**: Graph-exclusive discoveries weighted higher for novelty
   140	- **Adaptive Fusion**: Intent-aware weighted RRF with dark-run mode (feature flag `SPECKIT_ADAPTIVE_FUSION`)
   141	- **MMR Diversity**: Maximal Marginal Relevance reranking reduces near-duplicate results
   142	- **Recency Boost**: Time-aware score adjustment favoring recently updated memories
   143	- **Co-activation Boost**: Graph-neighbor score propagation via 2-hop causal traversal
   144	
   145	**Example:**
   146	```javascript
   147	// Vector rank: 2, BM25 rank: 5, Graph rank: 1
   148	// RRF score = 1/(40+2) + 1/(40+5) + 1.5/(40+1)
   149	//           = 0.0238 + 0.0222 + 0.0366 = 0.0826
   150	// Convergence bonus: 0.0826 * 1.10 = 0.0909 (final)
   151	```
   152	
   153	### BM25 (Best Matching 25)
   154	
   155	**Formula**:
   156	```text
   157	score(D, Q) = Sum IDF(qi) * (tf(qi,D) * (k1+1)) / (tf(qi,D) + k1 * (1-b + b*|D|/avgdl))
   158	```
   159	
   160	**Parameters:**

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '1080,1235p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1080	              return withGraphContribution(updated, 'coActivationDelta', resolveBaseScore(updated) - baseScore, 'co-activation');
  1081	            }
  1082	            return row;
  1083	          });
  1084	          // Re-sort after co-activation boost to ensure boosted results
  1085	          // Are promoted to their correct position in the ranking
  1086	          results = sortDeterministicRows(results as Array<PipelineRow & { id: number }>);
  1087	          (metadata as Record<string, unknown>).coActivationApplied = true;
  1088	        }
  1089	      }
  1090	    } catch (err: unknown) {
  1091	      // Non-critical enrichment — co-activation failure does not affect core ranking
  1092	      const message = err instanceof Error ? err.message : String(err);
  1093	      console.warn(`[stage2-fusion] co-activation spreading failed: ${message}`);
  1094	    }
  1095	  }
  1096	
  1097	  // -- 2b. Community co-retrieval (N2c) --
  1098	  // Inject community co-members into result set before graph signals
  1099	  // So injected rows also receive momentum/depth adjustments.
  1100	  if (isCommunityDetectionEnabled() && isGraphUnifiedEnabled()) {
  1101	    const beforeCommunityIds = new Set(results.map((row) => row.id));
  1102	    try {
  1103	      const db = requireDb();
  1104	      const boosted = applyCommunityBoost(results, db);
  1105	      if (boosted.length > results.length) {
  1106	        results = (boosted as PipelineRow[]).map((row) => beforeCommunityIds.has(row.id)
  1107	          ? row
  1108	          : withGraphContribution(row, 'communityDelta', 0, 'community', true));
  1109	        (metadata as Record<string, unknown>).communityBoostApplied = true;
  1110	      }
  1111	    } catch (err: unknown) {
  1112	      const message = err instanceof Error ? err.message : String(err);
  1113	      console.warn(`[stage2-fusion] community boost failed: ${message}`);
  1114	    }
  1115	
  1116	    const injectedIds = results
  1117	      .filter((row) => !beforeCommunityIds.has(row.id) && typeof row.id === 'number')
  1118	      .map((row) => row.id);
  1119	    if (injectedIds.length > 0) {
  1120	      try {
  1121	        const db = requireDb();
  1122	        const placeholders = injectedIds.map(() => '?').join(',');
  1123	        const stateRows = db.prepare(
  1124	          `SELECT id, memory_state FROM memory_index WHERE id IN (${placeholders})`
  1125	        ).all(...injectedIds) as Array<{ id: number; memory_state?: string }>;
  1126	        const stateMap = new Map(stateRows.map((row) => [row.id, row.memory_state]));
  1127	        const injectedIdSet = new Set(injectedIds);
  1128	        for (const row of results) {
  1129	          const rowId = typeof row.id === 'number' ? row.id : null;
  1130	          if (rowId === null || !injectedIdSet.has(rowId)) {
  1131	            continue;
  1132	          }
  1133	          const hydratedState = stateMap.get(rowId);
  1134	          if (typeof hydratedState === 'string') {
  1135	            row.memoryState = hydratedState;
  1136	          }
  1137	        }
  1138	      } catch (err: unknown) {
  1139	        console.warn('[stage2] Community state hydration failed:', err instanceof Error ? err.message : err);
  1140	      }
  1141	    }
  1142	  }
  1143	
  1144	  // -- 2c. Graph signals (N2a + N2b) --
  1145	  // Additive score adjustments for graph momentum and causal depth.
  1146	  if (isGraphSignalsEnabled() && isGraphUnifiedEnabled()) {
  1147	    try {
  1148	      const db = requireDb();
  1149	      const beforeScores = new Map(results.map((row) => [row.id, resolveBaseScore(row)]));
  1150	      const signaled = applyGraphSignals(results, db, {
  1151	        rolloutState: resolveGraphWalkRolloutState(),
  1152	      });
  1153	      results = (signaled as PipelineRow[]).map((row) => {
  1154	        const previous = beforeScores.get(row.id) ?? resolveBaseScore(row);
  1155	        const next = resolveBaseScore(row);
  1156	        return next !== previous
  1157	          ? withGraphContribution(row, 'graphSignalDelta', next - previous, 'graph-signals')
  1158	          : row;
  1159	      });
  1160	      // FIX #4: Sync aliases immediately after graph signal score mutations.
  1161	      syncScoreAliasesInPlace(results);
  1162	      if (isGraphCalibrationProfileEnabled()) {
  1163	        results = applyGraphCalibrationProfileToResults(results);
  1164	        syncScoreAliasesInPlace(results);
  1165	      }
  1166	      (metadata as Record<string, unknown>).graphSignalsApplied = true;
  1167	    } catch (err: unknown) {
  1168	      const message = err instanceof Error ? err.message : String(err);
  1169	      console.warn(`[stage2-fusion] graph signals failed: ${message}`);
  1170	    }
  1171	  }
  1172	
  1173	  // -- 2d. Usage-weighted ranking (Phase D T034) --
  1174	  if (isUsageRankingEnabled()) {
  1175	    try {
  1176	      const db = requireDb();
  1177	      results = applyUsageRankingBoost(db, results);
  1178	    } catch (err: unknown) {
  1179	      const message = err instanceof Error ? err.message : String(err);
  1180	      console.warn(`[stage2-fusion] usage ranking skipped (db unavailable): ${message}`);
  1181	    }
  1182	  }
  1183	
  1184	  // -- 2e. Graph evidence provenance (Phase C T026) --
  1185	  // Populate graphEvidence on results that received graph-based boosts.
  1186	  // Gated behind SPECKIT_RESULT_PROVENANCE. Fail-open.
  1187	  try {
  1188	    results = populateGraphEvidence(results);
  1189	  } catch (err: unknown) {
  1190	    const message = err instanceof Error ? err.message : String(err);
  1191	    console.warn(`[stage2-fusion] graph evidence provenance failed: ${message}`);
  1192	  }
  1193	
  1194	  // -- 3. Testing effect (FSRS write-back) --
  1195	  // P3-09 FIX: Only when explicitly opted in via trackAccess.
  1196	  // Write-back is fire-and-forget; errors per-row are swallowed inside
  1197	  // ApplyTestingEffect so they never abort the pipeline.
  1198	  if (config.trackAccess) {
  1199	    try {
  1200	      const db = requireDb();
  1201	      applyTestingEffect(db, results);
  1202	      recordAdaptiveAccessSignals(db, results, config.query);
  1203	    } catch (err: unknown) {
  1204	      const message = err instanceof Error ? err.message : String(err);
  1205	      console.warn(`[stage2-fusion] testing effect skipped (db unavailable): ${message}`);
  1206	    }
  1207	  }
  1208	
  1209	  // -- 4. Intent weights --
  1210	  // G2 PREVENTION: Only apply for non-hybrid search types.
  1211	  // Hybrid search (RRF / RSF) incorporates intent weighting during fusion —
  1212	  // Applying it again here would double-count, causing the G2 bug.
  1213	  if (!isHybrid && config.intentWeights) {
  1214	    try {
  1215	      const weighted = applyIntentWeightsToResults(results, config.intentWeights);
  1216	      results = weighted.map((result) =>
  1217	        typeof result.intentAdjustedScore === 'number'
  1218	          ? withSyncedScoreAliases(result, result.intentAdjustedScore)
  1219	          : result
  1220	      );
  1221	      metadata.intentWeightsApplied = 'applied';
  1222	    } catch (err: unknown) {
  1223	      const message = err instanceof Error ? err.message : String(err);
  1224	      console.warn(`[stage2-fusion] intent weights failed: ${message}`);
  1225	      metadata.intentWeightsApplied = 'failed';
  1226	    }
  1227	  }
  1228	
  1229	  // -- 5. Artifact routing weights --
  1230	  if (config.artifactRouting && config.artifactRouting.confidence > 0) {
  1231	    try {
  1232	      const routed = applyArtifactRouting(results, config.artifactRouting);
  1233	      results = routed;
  1234	      metadata.artifactRoutingApplied = 'applied';
  1235	    } catch (err: unknown) {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts | sed -n '650,675p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   650	 * Phase B T018: Community-level search as fallback channel.
   651	 * When primary search returns weak/no results, searches community summaries
   652	 * and injects matching community members as candidates.
   653	 * Default: TRUE (graduated). Set SPECKIT_COMMUNITY_SEARCH_FALLBACK=false to disable.
   654	 */
   655	export function isCommunitySearchFallbackEnabled(): boolean {
   656	  return isFeatureEnabled('SPECKIT_COMMUNITY_SEARCH_FALLBACK');
   657	}
   658	
   659	/**
   660	 * Phase B T019: Dual-level retrieval mode.
   661	 * Adds retrievalLevel parameter: 'local' (entity), 'global' (community), 'auto' (local + fallback).
   662	 * Default: TRUE (graduated). Set SPECKIT_DUAL_RETRIEVAL=false to disable.
   663	 */
   664	export function isDualRetrievalEnabled(): boolean {
   665	  return isFeatureEnabled('SPECKIT_DUAL_RETRIEVAL');
   666	}
   667	
   668	/**
   669	 * Phase C: Intent-to-profile auto-routing.
   670	 * When enabled, classifyIntent() results automatically select a response profile
   671	 * (quick, research, resume, debug) when no explicit profile is specified by the caller.
   672	 * Default: TRUE (graduated). Set SPECKIT_INTENT_AUTO_PROFILE=false to disable.
   673	 */
   674	export function isIntentAutoProfileEnabled(): boolean {
   675	  return isFeatureEnabled('SPECKIT_INTENT_AUTO_PROFILE');

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts | sed -n '153,177p;216,253p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Session Bootstrap Handler
     3	// ───────────────────────────────────────────────────────────────
     4	// Phase 024 / Item 7: Composite tool that runs session_resume
     5	// + session_health in one call, merging results with hints.
     6	
     7	import { handleSessionResume } from './session-resume.js';
     8	import type { CachedSessionSummaryDecision } from './session-resume.js';
     9	import { handleSessionHealth } from './session-health.js';
    10	import { recordBootstrapEvent } from '../lib/session/context-metrics.js';
    11	import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
    12	import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
    13	import {
    14	  attachStructuralTrustFields,
    15	  buildStructuralContextTrust,
    16	  createSharedPayloadEnvelope,
    17	  summarizeUnknown,
    18	  summarizeCertaintyContract,
    19	  trustStateFromStructuralStatus,
    20	  type SharedPayloadCertainty,
    21	  type SharedPayloadEnvelope,
    22	  type SharedPayloadSection,
    23	  StructuralTrustPayloadError,
    24	  type StructuralTrust,
    25	} from '../lib/context/shared-payload.js';
    26	import {
    27	  buildOpenCodeTransportPlan,
    28	  coerceSharedPayloadEnvelope,
    29	  type OpenCodeTransportPlan,
    30	} from '../lib/context/opencode-transport.js';
    31	import {
    32	  buildCodeGraphOpsContract,
    33	  type CodeGraphOpsContract,
    34	} from '../lib/code-graph/ops-hardening.js';
    35	import type { MCPResponse } from '@spec-kit/shared/types';
    36	
    37	/* ───────────────────────────────────────────────────────────────
    38	   1. TYPES
    39	──────────────────────────────────────────────────────────────── */
    40	
    41	interface SessionBootstrapArgs {
    42	  specFolder?: string;
    43	}
    44	
    45	interface SessionBootstrapResult {
    46	  resume: Record<string, unknown>;
    47	  health: Record<string, unknown>;
    48	  cachedSummary?: CachedSessionSummaryDecision;
    49	  structuralContext?: StructuralBootstrapContract & StructuralTrust;
    50	  structuralRoutingNudge?: {
    51	    advisory: true;
    52	    readiness: 'ready';
    53	    preferredTool: 'code_graph_query';
    54	    message: string;
    55	    preservesAuthority: 'session_bootstrap';
    56	  };
    57	  payloadContract?: SharedPayloadEnvelope;
    58	  opencodeTransport?: OpenCodeTransportPlan;
    59	  graphOps?: CodeGraphOpsContract;
    60	  hints: string[];
    61	  nextActions: string[];
    62	}
    63	
    64	/* ───────────────────────────────────────────────────────────────
    65	   2. HELPERS
    66	──────────────────────────────────────────────────────────────── */
    67	
    68	function extractData(response: MCPResponse): Record<string, unknown> {
    69	  try {
    70	    const text = response?.content?.[0]?.text;
    71	    if (typeof text === 'string') {
    72	      const parsed = JSON.parse(text);
    73	      return parsed?.data ?? parsed ?? {};
    74	    }
    75	  } catch { /* parse failed */ }
    76	  return {};
    77	}
    78	
    79	function extractHints(data: Record<string, unknown>): string[] {
    80	  if (Array.isArray(data.hints)) return data.hints as string[];
    81	  return [];
    82	}
    83	
    84	function extractCachedSummary(
    85	  data: Record<string, unknown>,
    86	): CachedSessionSummaryDecision | null {
    87	  const candidate = data.cachedSummary;
    88	  if (candidate && typeof candidate === 'object') {
    89	    return candidate as CachedSessionSummaryDecision;
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
/bin/zsh -lc "rg -n \"memory_context\\(|memory_search\\(|retrievalLevel|community search|graphEvidence|mcp__cocoindex_code__search|code_graph_query\" .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:53:    preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:153:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:154:    message: 'Advisory only: when the next question is about callers, imports, dependencies, or outline, prefer `code_graph_query` before Grep or Glob.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:213:  'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:254:  preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:320:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:322:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:786:  lines.push('- If structural context shows "ready": code_graph_query is available for structural lookups');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:796:      routingRules.push('Semantic/concept code search → mcp__cocoindex_code__search');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:799:      routingRules.push('Structural queries (callers, imports, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:886:      recordMetricEvent({ kind: 'code_graph_query' });
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:985:            existingHints.push('Tip: For code search queries, consider using mcp__cocoindex_code__search for semantic code search or code_graph_query for structural lookups.');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:201:  preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:323:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:324:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',

exec
/bin/zsh -lc "rg -n \"No memories found|No global memories found|Error: mnemosyne binary not found|--format\\s+plain|replaceAll\\('\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
72:        return "Error: mnemosyne binary not found. Install it: https://github.com/gandazgul/mnemosyne#install";
105:          const safeQuery = `"${args.query.replaceAll('"', '""')}"`;
114:          return result.trim() || "No memories found.";
126:          const safeQuery = `"${args.query.replaceAll('"', '""')}"`;
134:          return result.trim() || "No global memories found.";

codex
The retrieval-specific differences are getting sharper now. The strongest new angle is that Mnemosyne’s search surface is intentionally “string in, plain text out,” while Public’s search layer preserves retrieval structure: scopes, sessions, continuation cursors, graph provenance, routing hints, and code-search separation.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | sed -n '860,975p;1018,1055p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   860	          }
   861	        } catch (r12Err: unknown) {
   862	          const r12Msg = r12Err instanceof Error ? r12Err.message : String(r12Err);
   863	          console.warn(
   864	            `[stage1-candidate-gen] R12 embedding expansion failed, using standard hybrid: ${r12Msg}`
   865	          );
   866	        }
   867	      }
   868	
   869	      // Standard hybrid search — runs when R12 is off, suppressed by R15,
   870	      // Or produced no results (candidates still empty from the try block above).
   871	      // Phase B T016: Uses effectiveQuery (concept-expanded) for BM25 recall.
   872	      if (!r12ExpansionApplied) {
   873	        try {
   874	          channelCount = 1;
   875	          const hybridResults = (await hybridSearch.collectRawCandidates(
   876	            effectiveQuery,
   877	            effectiveEmbedding,
   878	            { limit, specFolder, includeArchived }
   879	          )) as PipelineRow[];
   880	          candidates = hybridResults;
   881	        } catch (hybridErr: unknown) {
   882	          const hybridMsg =
   883	            hybridErr instanceof Error ? hybridErr.message : String(hybridErr);
   884	          console.warn(
   885	            `[stage1-candidate-gen] Hybrid search failed, falling back to vector: ${hybridMsg}`
   886	          );
   887	
   888	          // Fallback: pure vector search
   889	          channelCount = 1;
   890	          let vectorResults = vectorIndex.vectorSearch(effectiveEmbedding, {
   891	            limit,
   892	            specFolder,
   893	            tier,
   894	            contextType,
   895	            includeConstitutional: false, // Constitutional managed separately below
   896	            includeArchived,
   897	          }) as PipelineRow[];
   898	          if (isTemporalContiguityEnabled()) {
   899	            vectorResults = (
   900	              vectorSearchWithContiguity(
   901	                vectorResults as Array<PipelineRow & { similarity: number; created_at: string }>,
   902	                3600,
   903	              ) as PipelineRow[] | null
   904	            ) ?? vectorResults;
   905	          }
   906	          candidates = vectorResults;
   907	
   908	          if (trace) {
   909	            addTraceEntry(trace, 'fallback', 0, candidates.length, 0, {
   910	              reason: hybridMsg,
   911	              channel: 'vector',
   912	            });
   913	          }
   914	        }
   915	      }
   916	    }
   917	  }
   918	
   919	  // -- Channel: Vector ---------------------------------------------------------
   920	
   921	  else if (searchType === 'vector') {
   922	    const effectiveEmbedding: Float32Array | number[] | null =
   923	      queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
   924	
   925	    if (!effectiveEmbedding) {
   926	      throw new Error('[stage1-candidate-gen] Failed to generate embedding for vector search query');
   927	    }
   928	
   929	    channelCount = 1;
   930	    let vectorResults = vectorIndex.vectorSearch(effectiveEmbedding, {
   931	      limit,
   932	      specFolder,
   933	      tier,
   934	      contextType,
   935	      includeConstitutional: false, // Constitutional managed separately below
   936	      includeArchived,
   937	    }) as PipelineRow[];
   938	    if (isTemporalContiguityEnabled()) {
   939	      vectorResults = (
   940	        vectorSearchWithContiguity(
   941	          vectorResults as Array<PipelineRow & { similarity: number; created_at: string }>,
   942	          3600,
   943	        ) as PipelineRow[] | null
   944	      ) ?? vectorResults;
   945	    }
   946	    candidates = vectorResults;
   947	  }
   948	
   949	  // -- Unknown search type -----------------------------------------------------
   950	
   951	  else {
   952	    throw new Error(
   953	      `[stage1-candidate-gen] Unknown searchType: "${searchType}". Expected 'multi-concept', 'hybrid', or 'vector'.`
   954	    );
   955	  }
   956	
   957	  // -- Tier and contextType filtering -----------------------------------------
   958	  //
   959	  // Applied after candidate collection but before constitutional injection so
   960	  // Injected constitutional rows are evaluated by the same filters.
   961	  // Exception: for hybrid search, tier/contextType are applied here because
   962	  // SearchWithFallback does not accept these parameters directly.
   963	  // For vector search, tier/contextType were already passed to vectorSearch,
   964	  // So this is a no-op guard for those fields.
   965	
   966	  if (tier) {
   967	    candidates = candidates.filter((r) => r.importance_tier === tier);
   968	  }
   969	
   970	  if (contextType) {
   971	    candidates = candidates.filter(
   972	      (r) => resolveRowContextType(r) === contextType
   973	    );
   974	  }
   975	
  1018	  //   - Constitutional results already exist in the candidate set
  1019	
  1020	  if (includeConstitutional && !tier) {
  1021	    const existingConstitutional = candidates.filter(
  1022	      (r) => r.importance_tier === 'constitutional'
  1023	    );
  1024	
  1025	    if (existingConstitutional.length === 0) {
  1026	      // Fix #16 — Reuse cached embedding instead of generating a new one
  1027	      const constitutionalEmbedding: Float32Array | number[] | null =
  1028	        cachedEmbedding ?? queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
  1029	
  1030	      if (constitutionalEmbedding) {
  1031	        const constitutionalResults = vectorIndex.vectorSearch(
  1032	          constitutionalEmbedding,
  1033	          {
  1034	            limit: CONSTITUTIONAL_INJECT_LIMIT,
  1035	            specFolder,
  1036	            tier: 'constitutional',
  1037	            useDecay: false,
  1038	          }
  1039	        ) as PipelineRow[];
  1040	
  1041	        // Only inject rows not already present
  1042	        const existingIds = new Set(candidates.map((r) => r.id));
  1043	        const uniqueConstitutional = constitutionalResults.filter(
  1044	          (r) => !existingIds.has(r.id)
  1045	        );
  1046	
  1047	        // Re-apply filters after injection because constitutional rows fetched
  1048	        // via vector search bypass the earlier governance/context gate.
  1049	        const contextFilteredConstitutional = contextType
  1050	          ? uniqueConstitutional.filter((r) => resolveRowContextType(r) === contextType)
  1051	          : uniqueConstitutional;
  1052	        // H12 FIX: Use shouldApplyScopeFiltering (not just hasGovernanceScope)
  1053	        // to ensure constitutional injection respects global scope enforcement
  1054	        const filteredConstitutional = shouldApplyScopeFiltering
  1055	          ? filterRowsByScope(

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts | sed -n '20,80p;150,170p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    20	   1. TYPES & CONSTANTS
    21	----------------------------------------------------------------*/
    22	
    23	/** Channel names matching SOURCE_TYPES in rrf-fusion.ts */
    24	type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'degree';
    25	
    26	/** Maps each complexity tier to the set of channels that should be executed. */
    27	interface ChannelRoutingConfig {
    28	  simple: ChannelName[];
    29	  moderate: ChannelName[];
    30	  complex: ChannelName[];
    31	}
    32	
    33	/** Result of the routeQuery convenience function. */
    34	interface RouteResult {
    35	  tier: QueryComplexityTier;
    36	  channels: ChannelName[];
    37	  classification: ClassificationResult;
    38	}
    39	
    40	/** All available channels in execution order. */
    41	const ALL_CHANNELS: readonly ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'] as const;
    42	
    43	/** Minimum required channels for safe routing. */
    44	const MIN_CHANNELS = 2;
    45	
    46	/** Fallback channels used to pad configs that violate the minimum invariant. */
    47	const FALLBACK_CHANNELS: readonly ChannelName[] = ['vector', 'fts'] as const;
    48	const BM25_PRESERVING_ARTIFACTS = new Set([
    49	  'spec',
    50	  'plan',
    51	  'tasks',
    52	  'checklist',
    53	  'decision-record',
    54	  'implementation-summary',
    55	  'research',
    56	]);
    57	
    58	/* ───────────────────────────────────────────────────────────────
    59	   2. DEFAULT ROUTING CONFIG
    60	----------------------------------------------------------------*/
    61	
    62	/**
    63	 * Default tier-to-channel mapping:
    64	 * - simple:   2 channels (vector + fts) — fastest path
    65	 * - moderate: 3 channels (vector + fts + bm25) — balanced
    66	 * - complex:  5 channels (all) — full pipeline
    67	 */
    68	const DEFAULT_ROUTING_CONFIG: ChannelRoutingConfig = {
    69	  simple: ['vector', 'fts'],
    70	  moderate: ['vector', 'fts', 'bm25'],
    71	  complex: ['vector', 'fts', 'bm25', 'graph', 'degree'],
    72	};
    73	
    74	/* ───────────────────────────────────────────────────────────────
    75	   3. CHANNEL SUBSET RESOLUTION
    76	----------------------------------------------------------------*/
    77	
    78	/**
    79	 * Enforce the minimum 2-distinct-channel invariant on a channel list.
    80	 * If the list has fewer than MIN_CHANNELS entries, pad with
   150	      classification,
   151	    };
   152	  }
   153	
   154	  const channels = getChannelSubset(classification.tier);
   155	  const adjustedChannels = classification.tier === 'simple' && shouldPreserveBm25(query)
   156	    ? enforceMinimumChannels([...channels, 'bm25'])
   157	    : channels;
   158	
   159	  return {
   160	    tier: classification.tier,
   161	    channels: adjustedChannels,
   162	    classification,
   163	  };
   164	}
   165	
   166	/* ───────────────────────────────────────────────────────────────
   167	   5. EXPORTS
   168	----------------------------------------------------------------*/
   169	
   170	export {

exec
/bin/zsh -lc 'rg -n "progressiveDisclosure|continuation|cursor" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
176:  cursor?: string;
493:    cursor,
543:  const hasCursor = typeof cursor === 'string' && cursor.trim().length > 0;
547:    return { content: [{ type: 'text', text: JSON.stringify({ error: 'Either "query" (string), "concepts" (array with 2-5 items), or "cursor" (string) is required.' }) }] };
551:    const resolved = resolveCursor(cursor.trim(), undefined, { scopeKey: progressiveScopeKey });
557:        details: { parameter: 'cursor' },
559:          hint: 'Retry the original search to generate a fresh continuation cursor',
567:      summary: `Returned ${snippetResults.length} continuation results`,
571:        continuation: resolved.continuation,
614:      error: 'Either query (string), concepts (array of 2-5 strings), or cursor (string) is required',
618:        hint: 'Provide a query string, concepts array with 2-5 entries, or a continuation cursor'
1029:        data.progressiveDisclosure = buildProgressiveResponse(

exec
/bin/zsh -lc 'rg -n "effectiveSessionId|server-generated session|sessionId returned by memory_context|session bootstrap|resume previous work" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:416:        input: 'resume previous work continue session',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:96:  effectiveSessionId: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:145:  effectiveSessionId: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:836:      effectiveSessionId: '',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:845:  const effectiveSessionId = trustedSession.effectiveSessionId;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:848:    ? workingMemory.getSessionInferredMode(effectiveSessionId)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:851:    ? workingMemory.getSessionEventCounter(effectiveSessionId)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:856:    effectiveSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1223:    effectiveSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1236:        hint: 'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1243:    effectiveSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1263:  const pressurePolicyEnabled = isPressurePolicyEnabled(effectiveSessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1264:  const autoResumeEnabled = isAutoResumeEnabled(effectiveSessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1286:    sessionId: effectiveSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1304:      effectiveSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1352:  const sessionStateResult = sessionManager.saveSessionState(effectiveSessionId, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1361:      `[memory-context] Failed to persist session identity for ${effectiveSessionId}: ${sessionStateResult.error ?? 'unknown error'}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1415:    workingMemory.setSessionInferredMode(effectiveSessionId, effectiveMode);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1435:    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1530:        session_id: effectiveSessionId,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '820,860p;1220,1245p;1428,1445p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '400,430p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
I’ve got enough line-level evidence for the wrapper and for Public’s pipeline. I’m doing one lightweight CocoIndex pass now to satisfy the “conceptual retrieval” angle from the brief and confirm the repo’s own semantic-vs-structural separation surfaces match the file evidence.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
codex
# Iteration 008: COMPARISON - RETRIEVAL

## Focus
COMPARISON - RETRIEVAL: Compare search/retrieval against our Spec Kit Memory (`memory_search`, CocoIndex, code-graph).

## Findings
### Finding 1: Mnemosyne’s recall surface throws away retrieval structure that Public already uses
- **Source**: [external/src/index.ts:103](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L103), [external/src/index.ts:125](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L125), [memory-search.ts:550](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L550), [memory-search.ts:965](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L965), [memory-search.ts:1023](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L1023)
- **What it does**: Mnemosyne always hands `search` through as `--format plain` and returns trimmed text or a canned “No memories found” string. Public’s `memory_search` resolves scoped cursors, emits structured envelopes, and can attach retrieval trace, applied boosts, and progressive disclosure metadata.
- **Why it matters for us**: This is the biggest retrieval-surface difference. Mnemosyne may have hybrid ranking behind the binary, but the plugin erases machine-readable ranking state at the boundary.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: The wrapper intentionally makes hybrid retrieval opaque by collapsing the query into one quoted backend string
- **Source**: [external/src/index.ts:35](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L35), [external/src/index.ts:104](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L104), [external/README.md:82](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L82), [query-router.ts:23](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts#L23), [query-router.ts:62](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts#L62), [stage1-candidate-gen.ts:869](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L869)
- **What it does**: The plugin only escapes quotes, wraps the full query in double quotes, and shells out. The README claims FTS5, BM25, vector search, and RRF, but none of that is inspectable or steerable from the wrapper. Public, by contrast, routes queries across vector, FTS, BM25, graph, and degree channels based on query complexity.
- **Why it matters for us**: Mnemosyne is useful as a backend contract example, not as a retrieval-control design. Public already exposes more observable and tunable search behavior.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: Public’s `retrievalLevel` is a richer retrieval control than Mnemosyne’s separate project/global recall tools
- **Source**: [external/src/index.ts:96](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L96), [external/src/index.ts:118](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L118), [memory-search.ts:529](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L529), [memory-search.ts:813](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L813), [search-flags.ts:660](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts#L660), [context-server.ts:760](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L760)
- **What it does**: Mnemosyne encodes retrieval scope as two different recall tools: project or global. Public keeps one search tool and lets retrieval move between entity-level and community-level search via `retrievalLevel: "local" | "global" | "auto"`, including weak-result fallback injection.
- **Why it matters for us**: The transferable idea is ergonomic aliasing, not a backend gap. If we ever add a project/global façade, it should sit on top of `memory_search`, not replace it.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: Mnemosyne persists memories across sessions, but it does not expose session-aware retrieval continuity
- **Source**: [external/src/index.ts:96](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L96), [external/src/index.ts:193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L193), [memory-context.ts:821](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L821), [memory-context.ts:1221](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1221), [memory-context.ts:1434](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1434), [session-resume.ts:400](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L400)
- **What it does**: Mnemosyne’s tools accept only query/content/id inputs, so recall is stateless at the tool boundary. Public mints trusted session IDs, rejects untrusted session reuse, resumes with `memory_context`, and can inject prior session prompt context back into the resumed flow.
- **Why it matters for us**: This is a retrieval difference, not just a governance one. Mnemosyne remembers documents; Public remembers retrieval state.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Mnemosyne’s compaction hook preserves memory awareness, but not live retrieval readiness or routing
- **Source**: [external/src/index.ts:208](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L208), [spec-kit-compact-code-graph.js:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396), [context-server.ts:755](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755), [context-server.ts:783](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L783), [context-server.ts:977](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L977), [session-bootstrap.ts:143](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L143)
- **What it does**: Mnemosyne injects a static checklist telling the agent to recall/store/delete memory. Public’s compaction and bootstrap surfaces already inject runtime-specific structural status and route code-search questions toward CocoIndex or `code_graph_query`.
- **Why it matters for us**: If we add a Mnemosyne-style memory reminder, it should be state-aware: when memory is ready, when graph is stale, and when a code question should leave `memory_search` entirely.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 6: The plugin package is too thin to treat Mnemosyne as a ranking reference implementation
- **Source**: [external/package.json:1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L1), [external/package.json:38](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L38), [external/package.json:41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L41), [external/README.md:82](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L82)
- **What it does**: The npm package ships a plugin wrapper around `dist` plus `@opencode-ai/plugin`; the hybrid retrieval internals live in the external binary and are only described in the README.
- **Why it matters for us**: Mnemosyne is evidence for wrapper ergonomics and offline deployment tradeoffs, not for changing Public’s fusion math, reranking, or per-channel strategy.
- **Recommendation**: reject
- **Impact**: medium

### Finding 7: Mnemosyne’s offline bridge lacks an explicit retrieval-readiness contract
- **Source**: [external/src/index.ts:64](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L64), [external/src/index.ts:78](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L78), [external/src/index.ts:171](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L171), [external/README.md:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L18), [session-bootstrap.ts:163](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L163), [context-server.ts:764](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L764), [mcp-coco-index/README.md:44](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L44)
- **What it does**: Missing binary handling returns a plain error string, project init silently swallows failures, and the README documents a first-run model download of about 500 MB. Public exposes explicit bootstrap, health, graph, and code-search readiness surfaces instead of making retrieval availability implicit.
- **Why it matters for us**: Any external-binary memory facade for Public needs a typed readiness handshake, not just “tool returned an error string.”
- **Recommendation**: NEW FEATURE
- **Impact**: medium

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
- [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
- [query-router.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts)
- [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)

## Assessment
- New information ratio: 0.79
- Questions addressed: wrapper-visible hybrid-search contract, query handoff opacity, retrieval scope ergonomics, session-aware continuity, compaction-time retrieval guidance, package/audit boundary, offline readiness and failure handling.
- Questions answered: Mnemosyne is not a retrieval-engine upgrade over Public; it is a thin offline plugin façade whose strongest retrieval lessons are ergonomic and operational. The exact validation command passed with `RESULT: PASSED` and `Summary: Errors: 0  Warnings: 0`, with the expected sandbox warning `cannot create temp file for here document: Operation not permitted`.

## Reflection
- What worked: starting with `external/src/index.ts`, then `package.json`, then the Public retrieval pipeline exposed the real comparison boundary fast: thin string-based wrapper versus structured, session-aware, multi-channel retrieval.
- What did not work: the package is intentionally too thin to prove backend ranking behavior beyond the README contract, and the read-only sandbox prevented updating `research/research.md`, `checklist.md`, `implementation-summary.md`, or saving memory via `generate-context.js`.

## Recommended Next Focus
Define an external-binary adapter contract for Public that preserves structured retrieval envelopes, trusted session propagation, readiness/health signaling, and optional project/global UX aliases without collapsing `memory_search`, CocoIndex, and code-graph into a single opaque recall surface.


hook: Stop
hook: Stop Completed
tokens used
84,134
# Iteration 008: COMPARISON - RETRIEVAL

## Focus
COMPARISON - RETRIEVAL: Compare search/retrieval against our Spec Kit Memory (`memory_search`, CocoIndex, code-graph).

## Findings
### Finding 1: Mnemosyne’s recall surface throws away retrieval structure that Public already uses
- **Source**: [external/src/index.ts:103](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L103), [external/src/index.ts:125](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L125), [memory-search.ts:550](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L550), [memory-search.ts:965](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L965), [memory-search.ts:1023](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L1023)
- **What it does**: Mnemosyne always hands `search` through as `--format plain` and returns trimmed text or a canned “No memories found” string. Public’s `memory_search` resolves scoped cursors, emits structured envelopes, and can attach retrieval trace, applied boosts, and progressive disclosure metadata.
- **Why it matters for us**: This is the biggest retrieval-surface difference. Mnemosyne may have hybrid ranking behind the binary, but the plugin erases machine-readable ranking state at the boundary.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: The wrapper intentionally makes hybrid retrieval opaque by collapsing the query into one quoted backend string
- **Source**: [external/src/index.ts:35](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L35), [external/src/index.ts:104](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L104), [external/README.md:82](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L82), [query-router.ts:23](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts#L23), [query-router.ts:62](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts#L62), [stage1-candidate-gen.ts:869](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L869)
- **What it does**: The plugin only escapes quotes, wraps the full query in double quotes, and shells out. The README claims FTS5, BM25, vector search, and RRF, but none of that is inspectable or steerable from the wrapper. Public, by contrast, routes queries across vector, FTS, BM25, graph, and degree channels based on query complexity.
- **Why it matters for us**: Mnemosyne is useful as a backend contract example, not as a retrieval-control design. Public already exposes more observable and tunable search behavior.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: Public’s `retrievalLevel` is a richer retrieval control than Mnemosyne’s separate project/global recall tools
- **Source**: [external/src/index.ts:96](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L96), [external/src/index.ts:118](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L118), [memory-search.ts:529](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L529), [memory-search.ts:813](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L813), [search-flags.ts:660](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts#L660), [context-server.ts:760](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L760)
- **What it does**: Mnemosyne encodes retrieval scope as two different recall tools: project or global. Public keeps one search tool and lets retrieval move between entity-level and community-level search via `retrievalLevel: "local" | "global" | "auto"`, including weak-result fallback injection.
- **Why it matters for us**: The transferable idea is ergonomic aliasing, not a backend gap. If we ever add a project/global façade, it should sit on top of `memory_search`, not replace it.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: Mnemosyne persists memories across sessions, but it does not expose session-aware retrieval continuity
- **Source**: [external/src/index.ts:96](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L96), [external/src/index.ts:193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L193), [memory-context.ts:821](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L821), [memory-context.ts:1221](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1221), [memory-context.ts:1434](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1434), [session-resume.ts:400](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L400)
- **What it does**: Mnemosyne’s tools accept only query/content/id inputs, so recall is stateless at the tool boundary. Public mints trusted session IDs, rejects untrusted session reuse, resumes with `memory_context`, and can inject prior session prompt context back into the resumed flow.
- **Why it matters for us**: This is a retrieval difference, not just a governance one. Mnemosyne remembers documents; Public remembers retrieval state.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Mnemosyne’s compaction hook preserves memory awareness, but not live retrieval readiness or routing
- **Source**: [external/src/index.ts:208](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L208), [spec-kit-compact-code-graph.js:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396), [context-server.ts:755](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755), [context-server.ts:783](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L783), [context-server.ts:977](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L977), [session-bootstrap.ts:143](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L143)
- **What it does**: Mnemosyne injects a static checklist telling the agent to recall/store/delete memory. Public’s compaction and bootstrap surfaces already inject runtime-specific structural status and route code-search questions toward CocoIndex or `code_graph_query`.
- **Why it matters for us**: If we add a Mnemosyne-style memory reminder, it should be state-aware: when memory is ready, when graph is stale, and when a code question should leave `memory_search` entirely.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 6: The plugin package is too thin to treat Mnemosyne as a ranking reference implementation
- **Source**: [external/package.json:1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L1), [external/package.json:38](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L38), [external/package.json:41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L41), [external/README.md:82](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L82)
- **What it does**: The npm package ships a plugin wrapper around `dist` plus `@opencode-ai/plugin`; the hybrid retrieval internals live in the external binary and are only described in the README.
- **Why it matters for us**: Mnemosyne is evidence for wrapper ergonomics and offline deployment tradeoffs, not for changing Public’s fusion math, reranking, or per-channel strategy.
- **Recommendation**: reject
- **Impact**: medium

### Finding 7: Mnemosyne’s offline bridge lacks an explicit retrieval-readiness contract
- **Source**: [external/src/index.ts:64](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L64), [external/src/index.ts:78](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L78), [external/src/index.ts:171](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L171), [external/README.md:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L18), [session-bootstrap.ts:163](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L163), [context-server.ts:764](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L764), [mcp-coco-index/README.md:44](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L44)
- **What it does**: Missing binary handling returns a plain error string, project init silently swallows failures, and the README documents a first-run model download of about 500 MB. Public exposes explicit bootstrap, health, graph, and code-search readiness surfaces instead of making retrieval availability implicit.
- **Why it matters for us**: Any external-binary memory facade for Public needs a typed readiness handshake, not just “tool returned an error string.”
- **Recommendation**: NEW FEATURE
- **Impact**: medium

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
- [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
- [query-router.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts)
- [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)

## Assessment
- New information ratio: 0.79
- Questions addressed: wrapper-visible hybrid-search contract, query handoff opacity, retrieval scope ergonomics, session-aware continuity, compaction-time retrieval guidance, package/audit boundary, offline readiness and failure handling.
- Questions answered: Mnemosyne is not a retrieval-engine upgrade over Public; it is a thin offline plugin façade whose strongest retrieval lessons are ergonomic and operational. The exact validation command passed with `RESULT: PASSED` and `Summary: Errors: 0  Warnings: 0`, with the expected sandbox warning `cannot create temp file for here document: Operation not permitted`.

## Reflection
- What worked: starting with `external/src/index.ts`, then `package.json`, then the Public retrieval pipeline exposed the real comparison boundary fast: thin string-based wrapper versus structured, session-aware, multi-channel retrieval.
- What did not work: the package is intentionally too thin to prove backend ranking behavior beyond the README contract, and the read-only sandbox prevented updating `research/research.md`, `checklist.md`, `implementation-summary.md`, or saving memory via `generate-context.js`.

## Recommended Next Focus
Define an external-binary adapter contract for Public that preserves structured retrieval envelopes, trusted session propagation, readiness/health signaling, and optional project/global UX aliases without collapsing `memory_search`, CocoIndex, and code-graph into a single opaque recall surface.
