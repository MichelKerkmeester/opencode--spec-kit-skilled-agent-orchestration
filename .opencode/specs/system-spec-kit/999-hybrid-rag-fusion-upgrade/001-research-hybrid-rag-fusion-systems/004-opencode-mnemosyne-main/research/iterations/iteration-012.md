### Finding 3: Add an inline `memory_remember` intake path instead of requiring file-first saves
- **Source**: [external/src/index.ts#L138](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L138), [external/src/index.ts#L160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L160), [tool-schemas.ts#L217](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L217), [memory-save.ts#L1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1)
- **What it does**: Wrapper-confirmed versus current Public surface: Mnemosyne stores a concise memory directly from a string argument. Public’s write path is file-centric: `memory_save` accepts an absolute `filePath`, then runs parsing, quality gates, governance, dedup, and embedding.
- **Why it matters for us**: This is a genuine missing feature, not just wrapper thinness. We should add an audited inline intake tool that accepts short text plus minimal metadata, materializes canonical markdown internally, and then runs the existing save pipeline. That would preserve Public’s safety while removing the current authoring friction.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 4: Add write-time pinning for always-on memories
- **Source**: [external/src/index.ts#L140](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L140), [external/src/index.ts#L162](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L162), [external/README.md#L55](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L55), [tool-schemas.ts#L49](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L49), [tool-schemas.ts#L217](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L217), [tool-schemas.ts#L291](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L291)
- **What it does**: Both: Mnemosyne lets an agent set `core=true` at creation time and treats that as always-relevant context. Public guarantees constitutional memories are always surfaced, but creation-time pinning is not a first-class tool parameter; it is encoded via file metadata or later `memory_update`.
- **Why it matters for us**: Public has the semantics, but not the authoring shortcut. A new `pin: "always"` or `priority: "core"` write-time option would reduce friction for durable user preferences and architecture rules while still mapping into existing constitutional or critical tiers.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

### Finding 5: Build an explicit offline warmup and doctor flow for memory readiness
- **Source**: [external/src/index.ts#L64](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L64), [external/README.md#L7](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L7), [external/README.md#L82](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L82), [external/package.json#L1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L1), [tool-schemas.ts#L236](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L236), [memory-crud-health.ts#L380](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L380), [context-server.ts#L1238](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1238), [context-server.ts#L1580](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1580)
- **What it does**: Both: Mnemosyne documents a binary prerequisite and one-time local model download, and its wrapper returns a clear missing-binary install message. Public already has `memory_health` and startup readiness logs, but it still relies on lazy first-use initialization and manual follow-up when embeddings are not ready.
- **Why it matters for us**: Public is operationally richer, but it lacks a proactive “make memory ready now” surface. A `memory_warmup` or `memory_doctor` feature that preloads providers, validates embedding profile, primes indices, and returns deterministic ready/not-ready output would remove a lot of first-query uncertainty.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
- [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts)
- [scope-governance.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)

## Assessment
- New information ratio: 0.79
- Questions addressed: compaction-specific memory guidance, project-vs-global ergonomics, direct memory capture, write-time pinning, offline readiness, AGENTS guidance location, overlap with existing hybrid retrieval and community-search fallback.
- Questions answered: Public already owns the heavy hybrid retrieval, trigger recall, health, and governance story. The real missing surface area is ergonomic: a compaction memory action card, explicit scoped lanes, inline capture, write-time pinning, and proactive warmup. Mnemosyne’s most transferable value is its thin agent-facing contract, not its ranking backend. The exact strict validation command passed with `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, while also emitting the read-only warning `cannot create temp file for here document: Operation not permitted`. No `AGENTS.md` file was present under the external checkout; that guidance exists only in the README.

## Reflection
- What worked: Reading [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts) first, then tracing directly into Public’s [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts), [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts), and [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts) made the true gaps look like product-surface gaps rather than retrieval-engine gaps.
- What did not work: The sandbox is read-only, so I could not update `research/research.md`, `checklist.md`, `implementation-summary.md`, or save memory for the phase. The external repo also does not expose Mnemosyne’s Go internals, so anything below the wrapper remains README-level contract rather than source-proven implementation.

## Recommended Next Focus
Prototype a thin Public-side memory facade with three pieces together: `memory_remember` for inline capture, a `scope`/`pin` authoring contract for project-personal-always-on memories, and a compaction memory action card injected alongside the existing transport payload. That will test whether Mnemosyne’s best idea for us is not new ranking math, but a much thinner agent-facing memory UX.

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
# Iteration 012: GAP ANALYSIS - REFACTORS

## Focus
GAP ANALYSIS - REFACTORS: Should we refactor or change direction on any existing features? Architecture changes?

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
I’m treating this as a read-only deep-research pass focused on refactor/change-direction signals, and I’m starting by checking prior memory context plus the exact wrapper and comparison files so the findings stay source-backed rather than README-level.
exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "mnemosyne|hybrid-rag-fusion|compaction|memory_remember|scope-governance|memory_search|compact-code-graph" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
743:## Task 6: Draft packet-local changelog set for `024-compact-code-graph`, outcome success
761:- CocoIndex + Compact Code Graph, README.md, 024-compact-code-graph, 006-documentation-alignment, mcp__cocoindex_code__search, code_graph_query, prettier --check
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
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
The wrapper confirms the earlier ergonomics gaps, and I’m now tracing the comparison points in Public code plus the compaction path so I can isolate actual refactor/change-direction recommendations instead of new-feature wishlists.
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
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Tool Schemas
// ───────────────────────────────────────────────────────────────
// All MCP tool definitions (names, descriptions, input schemas).
// Extracted from context-server.ts for maintainability (T303).
import {
  MAX_INGEST_PATHS,
  MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS,
} from './schemas/tool-input-schemas.js';

/**
 * Re-export schema validation helpers used by the MCP tool entry points.
 */
export {
  ToolSchemaValidationError,
  formatZodError,
  getToolSchema,
  validateToolArgs,
  getSchema,
} from './schemas/tool-input-schemas.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
/**
 * Normalized definition for a single MCP tool and its JSON schema.
 */
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
}

// ───────────────────────────────────────────────────────────────
// 2. TOOL DEFINITIONS

// ───────────────────────────────────────────────────────────────
// T061: L1 Orchestration - Unified entry point (Token Budget: 3500)
const memoryContext: ToolDefinition = {
  name: 'memory_context',
  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
};

// L2: Core - Primary operations (Token Budget: 3500)
const memorySearch: ToolDefinition = {
  name: 'memory_search',
  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires query (string), concepts (array of 2-5 strings), or cursor (string) for continuation pagination. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. When implicit feedback logging is enabled, searches also emit shadow-only feedback signals such as search_shown and, for includeContent runs, result_cited. Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    'x-requiredAnyOf': [['query'], ['concepts'], ['cursor']],
    properties: {
      cursor: {
        type: 'string',
        minLength: 1,
        description: 'Opaque continuation cursor returned by progressive disclosure. When provided, resolves the next page without requiring a new query.'
      },
      query: { type: 'string', minLength: 2, maxLength: 1000, description: 'Natural language search query' },
      concepts: {
        type: 'array',
        items: { type: 'string', minLength: 1 },
        minItems: 2,
        maxItems: 5,
        description: 'Multiple concepts for AND search (requires 2-5 concepts). Results must match ALL concepts.'
      },
      specFolder: { type: 'string', description: 'Limit search to a specific spec folder (e.g., "011-spec-kit-memory-upgrade")' },
      tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval. When provided with scope enforcement, results are isolated to this tenant.' },
      userId: { type: 'string', description: 'User boundary for governed retrieval. Filters private or shared-space user-scoped memories.' },
      agentId: { type: 'string', description: 'Agent boundary for governed retrieval. Filters agent-scoped memories.' },
      sharedSpaceId: { type: 'string', description: 'Shared-memory space identifier. Requires explicit membership when shared memory rollout is enabled.' },
      limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum number of results to return (1-100)' },
      sessionId: {
        type: 'string',
        description: 'Session identifier for working memory and session deduplication (REQ-001). When provided with enableDedup=true, prevents duplicate memories from being returned in the same session (~50% token savings on follow-up queries).'
      },
      enableDedup: {
        type: 'boolean',
        default: true,
        description: 'Enable session deduplication (REQ-001). When true and sessionId provided, filters out already-sent memories.'
      },
      tier: { type: 'string', description: 'Filter by importance tier (constitutional, critical, important, normal, temporary, deprecated)' },
      contextType: { type: 'string', description: 'Filter by context type (decision, implementation, research, etc.)' },
      useDecay: { type: 'boolean', default: true, description: 'Apply temporal decay scoring to results' },
      includeContiguity: { type: 'boolean', default: false, description: 'Include adjacent/contiguous memories in results' },
      includeConstitutional: {
        type: 'boolean',
        default: true,
        description: 'Include constitutional tier memories at top of results (default: true)'
      },
      enableSessionBoost: {
        type: 'boolean',
        description: 'Enable session-based score boost from working_memory attention signals. Defaults to SPECKIT_SESSION_BOOST env flag.'
      },
      enableCausalBoost: {
        type: 'boolean',
        description: 'Enable causal-neighbor boost (2-hop traversal on causal_edges). Defaults to SPECKIT_CAUSAL_BOOST env flag.'
      },
      includeContent: {
        type: 'boolean',
        default: false,
        description: 'Include full file content in results. When true, each result includes a "content" field with the memory file contents. This embeds load logic directly in search, eliminating the need for separate load calls. When implicit feedback logging is enabled, includeContent searches also emit shadow-only result_cited events for returned memories.'
      },
      anchors: {
        type: 'array',
        items: { type: 'string' },
        description: 'Specific anchor IDs to extract from content. If provided, returned content will be filtered to only these sections. Requires includeContent: true.'
      },
      profile: {
        type: 'string',
        enum: ['quick', 'research', 'resume', 'debug'],
        description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.'
      },
      min_quality_score: {
        type: 'number',
        minimum: 0,
        maximum: 1,
        description: 'Minimum quality score threshold (0.0-1.0). Results with lower quality_score are filtered out.'
      },
      minQualityScore: {
        type: 'number',
        minimum: 0,
        maximum: 1,
        description: 'Deprecated alias for min_quality_score. Prefer snake_case parameter name.'
      },
      bypassCache: {
        type: 'boolean',
        default: false,
        description: 'Skip the tool cache and force a fresh search. Useful when underlying data has changed since last cached result.'
      },
      rerank: {
        type: 'boolean',
        default: true,
        description: 'Enable cross-encoder reranking of results. Improves relevance at the cost of additional computation.'
      },
      applyLengthPenalty: {
        type: 'boolean',
        default: true,
        description: 'Apply length-based penalty during reranking. Penalizes very long memories to favor concise, focused results. Only effective when rerank is true.'
      },
      applyStateLimits: {
        type: 'boolean',
        default: false,
        description: 'Apply per-tier quantity limits to results. When true, enforces maximum counts per state tier to balance result diversity.'
      },
      minState: {
        type: 'string',
        enum: ['HOT', 'WARM', 'COLD', 'DORMANT', 'ARCHIVED'],
        default: 'WARM',
        description: 'Minimum memory state to include in results. Memories below this state are filtered out. Order: HOT > WARM > COLD > DORMANT > ARCHIVED.'
      },
      intent: {
        type: 'string',
        enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'],
        description: 'Task intent for weight adjustments (REQ-006). Explicitly set query intent to optimize scoring for specific tasks.'
      },
      autoDetectIntent: {
        type: 'boolean',
        default: true,
        description: 'Auto-detect intent from query if not explicitly specified. When true, classifies query to apply task-specific scoring weights.'
      },
      // Fix #13 : Expose previously hidden handler parameters
      trackAccess: {
        type: 'boolean',
        default: false,
        description: 'When true, writes FSRS strengthening updates to memory_index for each returned result. Off by default to avoid write-on-read side effects.'
      },
      includeArchived: {
        type: 'boolean',
        default: false,
        description: 'Include archived memories in search results. Default: false (archived excluded).'
      },
      mode: {
        type: 'string',
        enum: ['auto', 'deep'],
        default: 'auto',
        description: 'Search mode. "auto" uses standard retrieval. "deep" enables multi-query expansion for broader recall.'
      },
      includeTrace: {
        type: 'boolean',
        default: false,
        description: 'When true (or when SPECKIT_RESPONSE_TRACE=true), include provenance-rich scores/source/trace envelope fields in each result.'
      }
    }
  },
};

// E3: Simplified search — 3 params, sensible defaults, delegates to memory_search
const memoryQuickSearch: ToolDefinition = {
  name: 'memory_quick_search',
  description: '[L2:Core] Simplified search — query + optional limit + optional spec folder. Delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, limit 10). Use this when you want fast search without configuring 31 parameters.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      query: { type: 'string', minLength: 2, maxLength: 1000, description: 'Natural language search query' },
      limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum results (default 10)' },
      specFolder: { type: 'string', description: 'Restrict to spec folder' },
      tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval.' },
      userId: { type: 'string', description: 'User boundary for governed retrieval.' },
      agentId: { type: 'string', description: 'Agent boundary for governed retrieval.' },
      sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval.' },
    },
    required: ['query'],
  },
};

const memoryMatchTriggers: ToolDefinition = {
  name: 'memory_match_triggers',
  description: '[L2:Core] Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), and co-activation of related memories. Pass session_id and turnNumber for cognitive features. Token Budget: 3500.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', minLength: 1, description: 'User prompt or text to match against trigger phrases' }, specFolder: { type: 'string', description: 'Limit trigger matches to a specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed trigger matching.' }, userId: { type: 'string', description: 'User boundary for governed trigger matching.' }, agentId: { type: 'string', description: 'Agent boundary for governed trigger matching.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed trigger matching.' }, limit: { type: 'number', default: 3, minimum: 1, maximum: 100, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', minimum: 1, description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
};

// T306: Added asyncEmbedding parameter for non-blocking embedding generation
const memorySave: ToolDefinition = {
  name: 'memory_save',
  description: '[L2:Core] Index a memory file into the spec kit memory database. Reads the file, extracts metadata (title, trigger phrases), generates embedding, and stores in the index. Use this to manually index new or updated memory files. Includes pre-flight validation (T067-T070) for anchor format, duplicate detection, and token budget estimation. Token Budget: 3500.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
};

// L3: Discovery - Browse and explore (Token Budget: 800)
const memoryList: ToolDefinition = {
  name: 'memory_list',
  description: '[L3:Discovery] Browse stored memories with pagination. Use to discover what is remembered and find IDs for delete/update. Token Budget: 800.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { limit: { type: 'number', default: 20, minimum: 1, maximum: 100, description: 'Maximum results to return (max 100)' }, offset: { type: 'number', default: 0, minimum: 0, description: 'Number of results to skip (for pagination)' }, specFolder: { type: 'string', description: 'Filter by spec folder' }, sortBy: { type: 'string', enum: ['created_at', 'updated_at', 'importance_weight'], description: 'Sort order (default: created_at DESC)' }, includeChunks: { type: 'boolean', default: false, description: 'Include chunk child rows. Default false returns parent memories only for cleaner browsing.' } } },
};

const memoryStats: ToolDefinition = {
  name: 'memory_stats',
  description: '[L3:Discovery] Get statistics about the memory system. Shows counts, dates, status breakdown, and top folders. Supports multiple ranking modes including composite scoring. Token Budget: 800.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { folderRanking: { type: 'string', enum: ['count', 'recency', 'importance', 'composite'], description: 'How to rank folders: count (default, by memory count), recency (most recent first), importance (by tier), composite (weighted multi-factor score)', default: 'count' }, excludePatterns: { type: 'array', items: { type: 'string' }, description: 'Regex patterns to exclude folders (e.g., ["z_archive", "scratch"])' }, includeScores: { type: 'boolean', description: 'Include score breakdown for each folder', default: false }, includeArchived: { type: 'boolean', description: 'Include archived/test/scratch folders in results', default: false }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum number of folders to return', default: 10 } } },
};

const memoryHealth: ToolDefinition = {
  name: 'memory_health',
  description: '[L3:Discovery] Check health status of the memory system. Token Budget: 800.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      reportMode: {
        type: 'string',
        enum: ['full', 'divergent_aliases'],
        default: 'full',
        description: 'Report mode. full returns system diagnostics; divergent_aliases returns compact divergent alias triage output.'
      },
      limit: {
        type: 'number',
        default: 20,
        minimum: 1,
        maximum: 200,
        description: 'Maximum divergent alias groups to return when reportMode=divergent_aliases (max 200).'
      },
      specFolder: {
        type: 'string',
        description: 'Optional spec folder filter for divergent alias triage mode.'
      },
      autoRepair: {

exec
/bin/zsh -lc "sed -n '1,320p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
    return Array.isArray(data?.results)
      ? data.results as Array<Record<string, unknown>>
      : [];
  } catch {
    return [];
  }
}

function extractSearchCachePayload(response: MCPResponse): SearchCachePayload | null {
  const firstEntry = response?.content?.[0];
  if (!firstEntry || typeof firstEntry.text !== 'string') {
    return null;
  }

  try {
    const envelope = JSON.parse(firstEntry.text) as Record<string, unknown>;
    const summary = typeof envelope.summary === 'string' ? envelope.summary : null;
    const data = envelope.data && typeof envelope.data === 'object'
      ? envelope.data as Record<string, unknown>
      : null;
    const hints = Array.isArray(envelope.hints)
      ? envelope.hints.filter((hint): hint is string => typeof hint === 'string')
      : [];

    if (!summary || !data) {
      return null;
    }

    return { summary, data, hints };
  } catch {
    return null;
  }
}

function parseResponseEnvelope(
  response: MCPResponse,
): { firstEntry: { type: 'text'; text: string }; envelope: Record<string, unknown> } | null {
  const firstEntry = response?.content?.[0];
  if (!firstEntry || firstEntry.type !== 'text' || typeof firstEntry.text !== 'string') {
    return null;
  }

  try {
    return {
      firstEntry,
      envelope: JSON.parse(firstEntry.text) as Record<string, unknown>,
    };
  } catch {
    return null;
  }
}

function replaceResponseEnvelope(
  response: MCPResponse,
  firstEntry: { type: 'text'; text: string },
  envelope: Record<string, unknown>,
): MCPResponse {
  return {
    ...response,
    content: [{ ...firstEntry, text: JSON.stringify(envelope, null, 2) }],

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1305ms:

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


2026-04-10T20:00:17.148048Z ERROR codex_core::tools::router: error=failed to parse function arguments: missing field `cell_id` at line 1 column 59
codex
I have the validation result and the wrapper baseline. Next I’m pulling exact line-level evidence for compaction, readiness, retrieval routing, and scope normalization so the recommendations can focus on refactors or direction changes with clear tradeoffs.
exec
/bin/zsh -lc "rg -n \"experimental\\.session\\.compacting|memory_recall|memory_store|memory_delete|mnemosyne\\(|Bun\\.spawn|projectRaw|basename|global\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
29:  const projectRaw = path.basename(projectDir);
30:  const project = projectRaw === "global" ? "default" : (projectRaw || "default");
35:   * Run the mnemosyne CLI binary gracefully using Bun.spawn.
38:  async function mnemosyne(...args: string[]): Promise<string> {
41:      // @ts-ignore - Bun is globally available in opencode environment
42:      const proc = Bun.spawn(["mnemosyne", ...args], {
81:    await Bun.spawn(["mnemosyne", "init", "--name", project], {
96:      memory_recall: tool({
106:          const result = await mnemosyne(
118:      memory_recall_global: tool({
120:          "Search global memory for cross-project preferences, decisions and patterns.",
125:          await log.info(`Searching global memory for: ${args.query}`);
127:          const result = await mnemosyne(
129:            "--global",
134:          return result.trim() || "No global memories found.";
138:      memory_store: tool({
155:            await mnemosyne(...cmdArgs)
160:      memory_store_global: tool({
170:          await log.info(`Storing global memory: ${args.content}`);
171:          // Ensure the global collection exists.
174:            await Bun.spawn(["mnemosyne", "init", "--global"], {
179:            await log.info("Ensured global collection exists.");
182:            await log.warn(`Failed to auto-init global collection: ${e}`);
184:          const cmdArgs = ["add", "--global"];
189:          return (await mnemosyne(...cmdArgs)).trim();
193:      memory_delete: tool({
201:          return (await mnemosyne("delete", String(args.id))).trim();
210:    "experimental.session.compacting": async (_input, output) => {
213:You have persistent memory tools: memory_recall, memory_store, memory_delete,
214:memory_recall_global, memory_store_global.
221:- Use **global** variants for cross-project preferences (coding style, tool choices).

exec
/bin/zsh -lc "rg -n \"experimental\\.session\\.compacting|messagesTransform|runtimeReady|lastRuntimeError|tool\\(|status|transport\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
14:// the user's normal Node environment and returns the transport plan as JSON.
68: *   transportOnly: true,
76: *   messagesTransform: TransportBlock[],
85:const transportCache = new Map();
86:let runtimeReady = false;
87:let lastRuntimeError = null;
136:    if (plan.transportOnly !== true || !Array.isArray(plan.messagesTransform)) {
188:  const cached = transportCache.get(key);
203:      lastRuntimeError = 'Bridge returned no OpenCode transport payload';
204:      runtimeReady = false;
205:      transportCache.delete(key);
209:    runtimeReady = true;
210:    lastRuntimeError = null;
211:    transportCache.set(key, {
218:    runtimeReady = false;
219:    lastRuntimeError = stringifyError(error);
220:    transportCache.delete(key);
261:    transportCache.delete(cacheKeyForSession(sessionID, specFolder));
265:  for (const key of [...transportCache.keys()]) {
267:      transportCache.delete(key);
277: * Create the Spec Kit OpenCode plugin and its transport-backed hook handlers.
296:      spec_kit_compact_code_graph_status: tool({
297:        description: 'Show Spec Kit compact code graph plugin cache status',
300:          const entries = [...transportCache.entries()]
311:            `runtime_ready=${runtimeReady}`,
315:            `last_runtime_error=${lastRuntimeError ?? 'none'}`,
316:            `cache_entries=${transportCache.size}`,
369:      if (!plan || plan.messagesTransform.length === 0) {
373:      for (const block of plan.messagesTransform) {
396:    'experimental.session.compacting': async (input, output) => {

exec
/bin/zsh -lc 'rg -n "retrievalLevel|community fallback|searchCommunities|isEmbeddingModelReady|waitForEmbeddingModel|session_bootstrap|session_resume|memory_health|doctor|warmup|normalizeScopeContext" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:20:import { isEmbeddingModelReady } from '../core/index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:28:// Feature catalog: Health diagnostics (memory_health)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:222:/** Handle memory_health tool -- returns system health status and diagnostics. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:233:      tool: 'memory_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:251:      tool: 'memory_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:260:      tool: 'memory_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:269:      tool: 'memory_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:278:      tool: 'memory_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:287:      tool: 'memory_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:333:        tool: 'memory_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:359:      tool: 'memory_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:363:        status: isEmbeddingModelReady() && database ? 'healthy' : 'degraded',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:380:  const status = isEmbeddingModelReady() && database ? 'healthy' : 'degraded';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:428:      tool: 'memory_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:439:        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:445:  if (!isEmbeddingModelReady()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:570:    tool: 'memory_health',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:574:      embeddingModelReady: isEmbeddingModelReady(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:13:import { searchCommunities } from '../lib/search/community-search.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:52:import { checkDatabaseUpdated, isEmbeddingModelReady, waitForEmbeddingModel } from '../core/index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:65:import { normalizeScopeContext } from '../lib/governance/scope-governance.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:214:  retrievalLevel?: 'local' | 'global' | 'auto';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:529:    retrievalLevel: retrievalLevel = 'auto',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:533:  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:764:    if (!isEmbeddingModelReady()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:765:      const modelReady = await waitForEmbeddingModel(30000);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:818:      (retrievalLevel === 'global' || retrievalLevel === 'auto')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:822:        (retrievalLevel === 'global') ||
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:823:        (resultsForFormatting.length < 3 && retrievalLevel === 'auto');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:826:          const communityResults = searchCommunities(effectiveQuery, requireDb(), 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:992:      appliedBoosts.communityFallback = { applied: true, retrievalLevel };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:158:export function normalizeScopeContext(input: ScopeContext): ScopeContext {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:202:  const scope = normalizeScopeContext(input);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:219:  const scope = normalizeScopeContext(input);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:334:  const scope = normalizeScopeContext(entry);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:397:  const normalized = normalizeScopeContext(filters);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:437:  const normalized = normalizeScopeContext(filters);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:460:  const normalized = normalizeScopeContext(scope);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:25:  setEmbeddingModelReady, waitForEmbeddingModel,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1239:    const modelReady: boolean = await waitForEmbeddingModel(EMBEDDING_MODEL_TIMEOUT_MS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1580:  // T016-T019: Lazy loading only. The eager warmup gate remains hard-disabled

exec
/bin/zsh -lc 'rg -n "CocoIndex|semantic code search|memory search|hybrid|BM25|vector|separate|code search" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
2:title: "CocoIndex Code - Semantic Code Search"
3:description: "Semantic code search via vector embeddings. CocoIndex Code enables natural-language discovery of code, patterns, and implementations across 28+ languages using a CLI and a single MCP search tool."
9:  - "code search"
10:  - "vector search"
14:# CocoIndex Code - Semantic Code Search
42:CocoIndex Code is a semantic code search tool built on vector embeddings. Where `grep` matches exact characters, CocoIndex Code matches meaning. Ask for "retry logic with exponential backoff" and it returns code that implements that pattern, regardless of how the author named variables or functions. This makes it the right tool when you know what a piece of code does but not where it lives or what it is called.
65:| `ccc search` (CocoIndex) | You know what code does but not where it lives | Approximate, needs verification |
85:In the broader system-spec-kit stack, CocoIndex is the semantic half of a three-system retrieval model: CocoIndex finds conceptually similar code, Code Graph answers structural questions, and session bootstrap surfaces CocoIndex readiness during recovery. The companion lifecycle helpers exposed through system-spec-kit are `ccc_status`, `ccc_reindex`, and `ccc_feedback`.
137:CocoIndex Code resolves queries by embedding the natural-language query text and comparing the resulting vector against pre-computed vectors for every code chunk in the index. This means the search engine reads intent, not characters. A query for "graceful shutdown handler" finds code that tears down servers or releases resources, even if the words "graceful", "shutdown", or "handler" never appear in that code.
139:The two embedding models trade off quality against convenience. The local model (`all-MiniLM-L6-v2`) requires no API key and works offline, making it the right default for most projects. The Voyage Code 3 model produces 1024-dimensional vectors trained specifically on code, and consistently returns higher-quality results for complex queries on large codebases. Switching models requires a full reset and reindex because the vector dimensions are incompatible.
152:| `ccc index` | Build or update the vector index | none |
187:| `voyage/voyage-code-3` | Cloud via LiteLLM | 1024 | `VOYAGE_API_KEY` | Higher quality code search |
223:    install.sh                     Install CocoIndex Code into skill venv
303:CocoIndex Code resolves the project root in this order:
312:Changing the model requires destroying and rebuilding the index. Different models produce vectors with incompatible dimensions, and mixing them corrupts results.
440:What you see: Search returns no results or errors about vector dimension incompatibility after switching the embedding model.
442:Common causes: The existing index was built with a different model and the vector dimensions do not match the new model.
457:Common causes: CocoIndex Code requires Python 3.11 or later. The system Python may be an older version.
473:**Q: Why does CocoIndex Code only expose one MCP tool when the CLI has seven commands?**
481:A: Use Voyage Code 3 when search quality matters more than avoiding an API dependency. The local model (`all-MiniLM-L6-v2`) is a general-purpose sentence embedding model with 384 dimensions. It works well for most queries but can miss nuanced code patterns. Voyage Code 3 was trained on code and produces 1024-dimensional vectors, giving it better discrimination between semantically similar but functionally different patterns. Switch to it when you notice too many false positives or misses on important queries. Remember: switching models requires `ccc reset && ccc index`.
513:| [scripts/install.sh](scripts/install.sh) | Install CocoIndex Code |
521:| [system-spec-kit](../system-spec-kit/SKILL.md) | Context preservation and memory | Complementary: semantic memory vs. semantic code search |
528:| CocoIndex GitHub | https://github.com/cocoindex-io/cocoindex |
529:| CocoIndex Code on PyPI | https://pypi.org/project/cocoindex-code/ |

exec
/bin/zsh -lc "rg --files /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external | rg 'AGENTS\\.md"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js | sed -n '290,430p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '520,860p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts | sed -n '150,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '740,810p;1228,1260p;1568,1605p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
  1228	}
  1229	
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
  1568	    incrementalIndex,
  1569	    dbConsumers: [
  1570	      sessionBoost,
  1571	      causalBoost,
  1572	      historyStore,
  1573	      workingMemory,
  1574	      attentionDecay,
  1575	      coActivation,
  1576	      archivalManager,
  1577	    ],
  1578	  });
  1579	
  1580	  // T016-T019: Lazy loading only. The eager warmup gate remains hard-disabled
  1581	  // in shared embeddings, so startup no longer branches on shouldEagerWarmup().
  1582	  console.error('[context-server] Lazy loading enabled - embedding model will initialize on first use');
  1583	  console.error('[context-server] SPECKIT_EAGER_WARMUP and SPECKIT_LAZY_LOADING are deprecated compatibility flags');
  1584	  // Mark embedding as "ready" since it will self-initialize on first use
  1585	  setEmbeddingModelReady(true);
  1586	
  1587	  // Integrity check and module initialization
  1588	  try {
  1589	    const report = vectorIndex.verifyIntegrity();
  1590	    console.error(`[context-server] Integrity check: ${report.totalMemories}/${report.totalMemories + report.missingVectors} valid entries`);
  1591	    if (report.orphanedVectors > 0) console.error(`[context-server] WARNING: ${report.orphanedVectors} orphaned entries detected`);
  1592	
  1593	    // Validate embedding dimension matches database
  1594	    const dimValidation = vectorIndex.validateEmbeddingDimension();
  1595	    if (!dimValidation.valid) {
  1596	      console.error(`[context-server] ===== EMBEDDING DIMENSION MISMATCH =====`);
  1597	      console.error(`[context-server] ${dimValidation.warning}`);
  1598	      console.error(`[context-server] =========================================`);
  1599	      console.error('[context-server] FATAL: Refusing to start with mismatched embedding dimensions');
  1600	      throw new Error(dimValidation.warning ?? 'Embedding dimension mismatch between provider and database');
  1601	    } else if (dimValidation.stored) {
  1602	      console.error(`[context-server] Embedding dimension validated: ${dimValidation.stored}`);
  1603	    }
  1604	
  1605	    const database = vectorIndex.getDb();

 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts | sed -n '360,460p;560,585p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   360	      summary: `Divergent alias report: ${divergentAliasGroups.length} of ${aliasConflicts.divergentHashGroups} group(s)`,
   361	      data: {
   362	        reportMode,
   363	        status: isEmbeddingModelReady() && database ? 'healthy' : 'degraded',
   364	        databaseConnected: !!database,
   365	        embeddingRetry,
   366	        specFolder: specFolder ?? null,
   367	        limit: safeLimit,
   368	        totalRowsScanned: aliasRows.length,
   369	        totalDivergentGroups: aliasConflicts.divergentHashGroups,
   370	        returnedGroups: divergentAliasGroups.length,
   371	        groups: divergentAliasGroups,
   372	      },
   373	      hints,
   374	      startTime,
   375	    });
   376	  }
   377	
   378	  let providerMetadata = embeddings.getProviderMetadata() as PartialProviderMetadata;
   379	  let profile = embeddings.getEmbeddingProfile() as EmbeddingProfile | null;
   380	  const status = isEmbeddingModelReady() && database ? 'healthy' : 'degraded';
   381	
   382	  const summary = `Memory system ${status}: ${memoryCount} memories indexed`;
   383	  const hints: string[] = [];
   384	  const repair = {
   385	    requested: autoRepair,
   386	    attempted: false,
   387	    repaired: false,
   388	    partialSuccess: false,
   389	    actions: [] as string[],
   390	    warnings: [] as string[],
   391	    errors: [] as string[],
   392	  };
   393	  let successfulRepairCount = 0;
   394	  let failedRepairCount = 0;
   395	
   396	  const trackRepairOutcome = (succeeded: boolean): void => {
   397	    repair.attempted = true;
   398	    if (succeeded) {
   399	      successfulRepairCount += 1;
   400	      return;
   401	    }
   402	    failedRepairCount += 1;
   403	  };
   404	
   405	  if (!profile) {
   406	    try {
   407	      // Resolve the lazy profile so health reflects the active runtime provider
   408	      // Rather than the legacy sync fallback defaults.
   409	      profile = await embeddings.getEmbeddingProfileAsync() as EmbeddingProfile | null;
   410	      providerMetadata = embeddings.getProviderMetadata() as PartialProviderMetadata;
   411	    } catch (profileError: unknown) {
   412	      hints.push(`Embedding profile unavailable: ${sanitizeErrorForHint(toErrorMessage(profileError))}`);
   413	    }
   414	  }
   415	
   416	  const providerName = profile?.provider ?? providerMetadata.provider;
   417	  const providerModel = profile?.model ?? providerMetadata.model ?? embeddings.getModelName();
   418	  const providerDimension = profile?.dim ?? providerMetadata.dim ?? embeddings.getEmbeddingDimension();
   419	  const repairActions = [
   420	    'fts_rebuild',
   421	    'trigger_cache_refresh',
   422	    'orphan_edges_cleanup',
   423	    'orphan_vector_cleanup',
   424	  ];
   425	
   426	  if (autoRepair && !confirmed) {
   427	    return createMCPSuccessResponse({
   428	      tool: 'memory_health',
   429	      summary: 'Confirmation required before auto-repair actions are executed',
   430	      data: {
   431	        status,
   432	        reportMode,
   433	        autoRepairRequested: true,
   434	        needsConfirmation: true,
   435	        actions: repairActions,
   436	        embeddingRetry,
   437	      },
   438	      hints: [
   439	        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
   440	      ],
   441	      startTime,
   442	    });
   443	  }
   444	
   445	  if (!isEmbeddingModelReady()) {
   446	    hints.push('Embedding model not ready - some operations may fail');
   447	  }
   448	  if (!database) {
   449	    hints.push('Database not connected - restart MCP server');
   450	  }
   451	  if (!vectorIndex.isVectorSearchAvailable()) {
   452	    hints.push('Vector search unavailable - fallback to BM25');
   453	  }
   454	  // FTS5 consistency check
   455	  if (database) {
   456	    try {
   457	      const memoryCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_index').get() as { count: number };
   458	      const ftsCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_fts').get() as { count: number };
   459	      if (memoryCountRow.count !== ftsCountRow.count) {
   460	        hints.push(
   560	  }
   561	
   562	  if (aliasConflicts.groups > 0) {
   563	    hints.push(`Detected ${aliasConflicts.groups} specs/.opencode alias group(s)`);
   564	  }
   565	  if (aliasConflicts.divergentHashGroups > 0) {
   566	    hints.push(`${aliasConflicts.divergentHashGroups} alias group(s) have divergent content hashes`);
   567	  }
   568	
   569	  return createMCPSuccessResponse({
   570	    tool: 'memory_health',
   571	    summary,
   572	    data: {
   573	      status,
   574	      embeddingModelReady: isEmbeddingModelReady(),
   575	      databaseConnected: !!database,
   576	      vectorSearchAvailable: vectorIndex.isVectorSearchAvailable(),
   577	      memoryCount,
   578	      uptime: process.uptime(),
   579	      version: SERVER_VERSION,
   580	      reportMode: 'full',
   581	      aliasConflicts,
   582	      repair,
   583	      embeddingProvider: {
   584	        provider: providerName,
   585	        model: providerModel,

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md | sed -n '1,170p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md | sed -n '40,90p;130,155p;470,485p;518,523p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   470	<!-- ANCHOR:faq -->
   471	## 8. FAQ
   472	
   473	**Q: Why does CocoIndex Code only expose one MCP tool when the CLI has seven commands?**
   474	
   475	A: Index management operations (`index`, `status`, `reset`, `init`, `daemon`) are intended for human-initiated workflows, not agent-initiated ones. An agent asking to reset a codebase index would be a destructive action with no confirmation step. The MCP interface exposes only `search` to keep agent behavior predictable and safe. Run index management commands from a terminal.
   476	
   477	---
   478	
   479	**Q: When should I use Voyage Code 3 instead of the local model?**
   480	
   481	A: Use Voyage Code 3 when search quality matters more than avoiding an API dependency. The local model (`all-MiniLM-L6-v2`) is a general-purpose sentence embedding model with 384 dimensions. It works well for most queries but can miss nuanced code patterns. Voyage Code 3 was trained on code and produces 1024-dimensional vectors, giving it better discrimination between semantically similar but functionally different patterns. Switch to it when you notice too many false positives or misses on important queries. Remember: switching models requires `ccc reset && ccc index`.
   482	
   483	---
   484	
   485	**Q: How often should I reindex?**
   518	
   519	| Skill | Purpose | Relationship |
   520	|---|---|---|
   521	| [system-spec-kit](../system-spec-kit/SKILL.md) | Context preservation and memory | Complementary: semantic memory vs. semantic code search |
   522	| [mcp-code-mode](../mcp-code-mode/SKILL.md) | External tool integration via MCP | Peer MCP skill with a different purpose |
   523	

exec
/bin/zsh -lc "sed -n '1,240p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "filePath|memory_save|generate-context|markdown|absolute path|pre-flight|trigger phrases|canonical markdown" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:62:Usage: node generate-context.js [options] <input>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:66:                    - JSON file mode: node generate-context.js data.json [spec-folder]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:75:  node generate-context.js /tmp/context-data.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:76:  node generate-context.js /tmp/context-data.json specs/001-feature/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:77:  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:78:  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:79:  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:490:            console.error('[generate-context] Failed to list spec folders:', errMsg);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:493:    console.error('\nUsage: node generate-context.js [--stdin [spec-folder-name] | --json <json> [spec-folder-name] | <data-file> [spec-folder-name]]\n');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:546://# sourceMappingURL=generate-context.js.map
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:91:import { buildParsedMemoryEvidenceSnapshot } from './save/markdown-evidence-builder.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:103:// Feature catalog: Memory indexing (memory_save)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:105:// Feature catalog: Dry-run preflight for memory_save
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:190:    filePath: parsed.filePath,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:205:    console.warn(`[memory] Warning for ${path.basename(parsed.filePath)}:`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:210:  const vRuleResult = validateMemoryQualityContent(parsed.content, { filePath: parsed.filePath });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:224:      console.error(`[memory-save] V-rule hard block for ${path.basename(parsed.filePath)}: ${failedRuleIds.join(', ')}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:252:      console.warn(`[memory-save] V-rule index block for ${path.basename(parsed.filePath)}: ${vRuleDisposition.indexBlockingRuleIds.join(', ')}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:280:    const warning = 'Manual fallback save mode detected; standard generate-context template markers are missing.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:281:    console.warn(`[memory-save] ${warning} ${path.basename(parsed.filePath)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:298:  if (parsed.specFolder && parsed.filePath) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:300:      const absFilePath = path.resolve(parsed.filePath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:312:        `[memory-save] spec-doc-health annotation skipped for ${path.basename(parsed.filePath)}: ${message}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:330:  filePath: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:333:  const backupPath = `${filePath}.${randomUUID().slice(0, 8)}.bak`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:334:  const tempPath = `${filePath}.${randomUUID().slice(0, 8)}.tmp`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:340:      await fs.promises.copyFile(filePath, backupPath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:353:    await fs.promises.rename(tempPath, filePath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:365:        await fs.promises.copyFile(backupPath, filePath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:511:function captureAtomicSaveOriginalState(filePath: string): { existed: boolean; content: string | null } {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:512:  if (!fs.existsSync(filePath)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:518:    content: fs.readFileSync(filePath, 'utf-8'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:526:function deleteAtomicSaveFile(filePath: string): { deleted: boolean; existed: boolean; error?: string } {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:527:  const existed = fs.existsSync(filePath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:533:    fs.unlinkSync(filePath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:545:  filePath: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:550:      const deleteResult = deleteAtomicSaveFile(filePath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:556:        error: deleteResult.error ?? `Failed to remove promoted file at ${filePath}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:564:    fs.mkdirSync(path.dirname(filePath), { recursive: true });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:565:    fs.writeFileSync(filePath, originalState.content, 'utf-8');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:602:  filePath: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:636:        console.warn(`[memory-save] V-rule warn-only (spec doc) for ${path.basename(filePath)}: ${qualityLoopResult.rejectionReason}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:657:        console.warn(`[memory-save] Sufficiency warn-only (spec doc) for ${path.basename(filePath)}: ${sufficiencyResult.reasons.join('; ')}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:666:          `[memory-save] Template contract bypassed in ${MANUAL_FALLBACK_SOURCE_CLASSIFICATION} mode for ${path.basename(filePath)}: ${templateContract.violations.map((v: { message?: string; rule?: string }) => v.message || v.rule).join('; ')}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:670:          `[memory-save] Template contract warn-only (spec doc) for ${path.basename(filePath)}: ${templateContract.violations.map((v: { message?: string; rule?: string }) => v.message || v.rule).join('; ')}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:690:      ? prepareParsedMemoryForIndexing(memoryParser.parseMemoryFile(filePath), database)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:701:    const canonicalFilePath = getCanonicalPathKey(filePath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:706:      filePath,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:718:      filePath,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:729:    const embeddingResult = await generateOrCacheEmbedding(database, parsed, filePath, asyncEmbedding);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:765:          console.error(`[memory-save] TM-04: Quality gate REJECTED save for ${path.basename(filePath)}: ${qualityGateResult.reasons.join('; ')}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:784:          console.warn(`[memory-save] TM-04: Quality gate warn-only (spec doc) for ${path.basename(filePath)}: ${qualityGateResult.reasons.join('; ')}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:788:          console.warn(`[memory-save] TM-04: Quality gate WARN-ONLY for ${path.basename(filePath)}: ${qualityGateResult.reasons.join('; ')}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:799:      filePath,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:805:    persistPendingEmbeddingCacheWrite(database, pendingCacheWrite, filePath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:809:      database, parsed, embedding, force, validation.warnings, embeddingStatus, filePath, scope,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:824:      filePath,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:834:      const chunkedResult = await indexChunkedMemoryFile(filePath, parsed, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:884:          await finalizeMemoryFileContent(filePath, finalizedFileContent);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:921:      filePath,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:933:        filePath,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:941:            filePath,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:945:            actor: 'mcp:memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:950:            filePath,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:972:        actor: 'mcp:memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:985:        await finalizeMemoryFileContent(filePath, finalizedFileContent);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1030:      filePath,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1045:  filePath: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1055:  const parsed = parsedOverride || memoryParser.parseMemoryFile(filePath);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1063:    console.error(`[memory-save] Quality loop applied ${prepared.qualityLoopResult.fixes.length} auto-fix(es) for ${path.basename(filePath)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1066:  return processPreparedMemory(prepared, filePath, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1078:/** Handle memory_save tool - validates, indexes, and persists a memory file to the database */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1086:      tool: 'memory_save',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1093:        hint: 'Retry memory_save after checkpoint_restore maintenance completes.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1101:    filePath: file_path,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1120:    throw new Error('filePath is required and must be a string');
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
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1491:            metadata: { filePath: validatedPath },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1508:  return buildSaveResponse({ result, filePath: file_path, asyncEmbedding, requestId });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1620:          filePath: file_path,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1670:      filePath: file_path,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1691:      filePath: file_path,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1703:        'Retry memory_save({ filePath, force: true }) once dependencies are healthy',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1720:        filePath: file_path,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1757:    filePath: file_path,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1789:const handle_memory_save = handleMemorySave;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1796:  handle_memory_save,

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | sed -n '1078,1165p;1460,1515p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1078	/** Handle memory_save tool - validates, indexes, and persists a memory file to the database */
  1079	async function handleMemorySave(args: SaveArgs): Promise<MCPResponse> {
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
  1506	  }
  1507	
  1508	  return buildSaveResponse({ result, filePath: file_path, asyncEmbedding, requestId });
  1509	}
  1510	
  1511	/* --- 10. ATOMIC MEMORY SAVE --- */
  1512	
  1513	/**
  1514	 * Save memory content to disk with retry + rollback guarded indexing.
  1515	 *

codex
I’ve got the exact line-level flow now. I’m doing one semantic code pass across the repo for compaction/readiness patterns to make sure I’m not missing an existing abstraction before I call for any refactor or change of direction.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "rg -n \"session_bootstrap|session_resume|memory_context\\(|profile: 'resume'|structural bootstrap|tool routing|code_graph_scan\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
215:  'code_graph_scan',
257:  preservesAuthority: 'session_bootstrap';
323:    preservesAuthority: 'session_bootstrap',
770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
771:        snap.graphFreshness === 'empty' ? 'run code_graph_scan' :
772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
809:  } catch { /* tool routing snapshot unavailable — skip */ }

exec
/bin/zsh -lc 'rg -n "memory_save|memory_health|memory_context|memory_search|memory_match_triggers|session_bootstrap|session_resume" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts | head -n 80' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
257:  preservesAuthority: 'session_bootstrap';
323:    preservesAuthority: 'session_bootstrap',
759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
882:    if (name === 'memory_context' && args.mode === 'resume') {
912:      name === 'memory_context' && args.mode === 'resume';
964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {

exec
/bin/zsh -lc "rg -n \"memory_remember|remember\\(|inline memory|core=true|pin|priority|always-on|always relevant|core memory|scope:|project\\|personal\\|shared|memory_doctor|memory_warmup|warmup\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1232:    console.error('[context-server] Startup scan already in progress, skipping');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1580:  // T016-T019: Lazy loading only. The eager warmup gate remains hard-disabled
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:100:  scope: MemoryScopeMatch = {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:149:  scope: MemoryScopeMatch = {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SKILL.md:892:- [ ] Verified items in priority order (P0 → P1 → P2)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:52:function buildScopedWhereClauses(scope: MemoryScopeMatch): {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:189:  scope: MemoryScopeMatch = {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:251:  scope: MemoryScopeMatch = {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:294:      console.error(`[memory-save] T054: Duplicate content detected (hash match id=${duplicateByHash.id}), skipping embedding`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:304:        message: `Duplicate content detected: identical to existing memory #${duplicateByHash.id} (${duplicateByHash.file_path}). Skipping embedding generation.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:181:            console.warn(`[memory-crud-update] BM25 infrastructure unavailable, skipping re-index [requestId=${requestId}]: ${bm25ErrMsg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:388: * The lease blocks overlapping scans via `scan_started_at` and preserves
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:575:      console.error('[db-state] Embedding model warmup timeout');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:360:      scope: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/README.md:3:description: "Response formatting for search results, anchor filtering metrics, and safe content shaping."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/loaders/README.md:18:- [3. SOURCE PRIORITY](#3--source-priority)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/loaders/README.md:38:<!-- ANCHOR:source-priority -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/loaders/README.md:54:<!-- /ANCHOR:source-priority -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:341: * parses embedded result arrays and removes lowest-priority items
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:526:        // Phase 1: Adaptive content truncation — truncate content fields before dropping results
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts:12://   Node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js reindex [--force] [--eager-warmup]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts:116:  reindex [--force] [--eager-warmup]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts:132:  spec-kit-cli reindex --eager-warmup
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts:444:  const eagerWarmup = getFlag('eager-warmup');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts:456:  // Optional legacy warmup path.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts:461:      await embeddings.generateEmbedding('warmup');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:16:/** All tool dispatch modules in priority order */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:39:    .replace(/\n{2,}/g, '\n')                   // collapse blank lines left by stripping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:150:    // O2-2: Add V3 and V12 flag mappings
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:392: * @returns An object mapping each known tool name to its invocation count.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/handover.md:69:1. [YOUR_VALUE_HERE: highest_priority_task]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/handover.md:70:2. [YOUR_VALUE_HERE: second_priority_task]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/handover.md:71:3. [YOUR_VALUE_HERE: third_priority_task]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:182:  // --- Intent-to-edge priority mapping ---
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:184:  it('fix_bug: CORRECTION (supersedes) is highest priority', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:199:  it('add_feature: EXTENDS (enabled, derived_from) is highest priority', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:209:  it('find_decision: PREFERENCE (supports) is highest priority', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:257:  it('computeIntentTraversalScore: 2-hop with lower priority edge', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:287:    // Fall back to folder-based scoping only when spec docs cannot be parsed.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:169:  // Keep the UX contract tests focused on save-path response shaping.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:226:function hasCheckpointScope(scope: CheckpointScopeArgs): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:235:function requiresCheckpointTenant(scope: CheckpointScopeArgs): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:245:  scope: CheckpointScopeArgs,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:256:function checkpointMatchesScope(rawMetadata: unknown, scope: CheckpointScopeArgs): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:275:function checkpointScopeDetails(scope: CheckpointScopeArgs): Record<string, string> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:462:          scope: checkpointScopeDetails(scope),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:611:          scope: checkpointScopeDetails(scope),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:567:    // After stripping trailing slash in getParentPath, this becomes '003-foo'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:217:describe('buildRecoveryPayload() — recommendedAction mapping', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:286:  it('shortens long queries by keeping the first 3 words', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:747:  const priorityDocs = ['tasks.md', 'checklist.md', 'plan.md'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:748:  const relevantDocs = specFiles.filter((sf) => priorityDocs.includes(sf.FILE_NAME));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:304:  it('numeric parentMemoryId grouping works correctly', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:25:interface CausalLinkMapping {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:66:const CAUSAL_LINK_MAPPINGS: Record<string, CausalLinkMapping> = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:371:    const mapping = CAUSAL_LINK_MAPPINGS[link_type];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:372:    if (!mapping) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:398:      const edgeSourceId = mapping.reverse ? String(resolvedId) : memoryIdStr;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:399:      const edgeTargetId = mapping.reverse ? memoryIdStr : String(resolvedId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:402:        causalEdges.insertEdge(edgeSourceId, edgeTargetId, mapping.relation, 1.0, `Auto-extracted from ${link_type} in memory file`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:404:        console.error(`[causal-links] Inserted edge: ${edgeSourceId} -[${mapping.relation}]-> ${edgeTargetId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:408:          console.error(`[causal-links] Edge already exists: ${edgeSourceId} -[${mapping.relation}]-> ${edgeTargetId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:435:  CausalLinkMapping,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:179:    // Use highly overlapping text to exceed 0.75 Jaccard threshold
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:54:- `handler-utils.ts`, `types.ts` - Shared handler helpers and domain typing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:55: * flag, avoiding downstream penalization while keeping the implementation simple (no unused
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1095:      console.warn('[memory-search] Cached response shape mismatch: missing "data" object, skipping dedup');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1097:      console.warn('[memory-search] Cached response shape mismatch: "data.results" is not an array, skipping dedup');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:399:      const mappings = CAUSAL_LINK_MAPPINGS;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:400:      expect(mappings).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:401:      expect(typeof mappings).toBe('object');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:402:      const keys = Object.keys(mappings);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:28:    is_pinned: 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:224:    const rowUnpinned = { ...makeFullDbRow(), is_pinned: 0 };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:225:    expect(dbRowToMemory(rowUnpinned).isPinned).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:228:    expect(memoryToDbRow(memory).is_pinned).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:229:    expect(memoryToDbRow({ ...memory, isPinned: false }).is_pinned).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:199:  it('covers all three tiers with non-overlapping ranges', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:821:  it('env var override takes priority over DB config', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:91:    { id: 901, content: 'Local model warmup diagnostics and service startup logs. '.repeat(2) },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:98:    { id: 901, content: 'Release checklist task ownership and sign-off bookkeeping. '.repeat(2) },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/assets/template_mapping.md:2:title: Template Mapping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/assets/template_mapping.md:3:description: Complete mapping of documentation levels to templates with copy commands.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/assets/template_mapping.md:6:# Template Mapping - Level to File Assignments
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/assets/template_mapping.md:342:11. **Organize by priority** - Use P0/P1/P2 priority markers in checklists (P0=blocker, P1=must-do, P2=can-defer)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:324:    it('only compares overlapping query-memory pairs', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:341:    it('returns zeroes for no overlapping pairs', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/addendum/README.md:34:Each addendum adds a distinct concern layer on top of the core spec template, keeping level-specific content isolated and composable.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:5:// node/edge upsert with self-loop rejection and weight clamping.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:618:        // @ts-expect-error testing runtime null-db fallback despite non-null typing
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:44:      is_pinned INTEGER DEFAULT 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:5:import type { CausalLinkMapping } from '../handlers/causal-links-processor';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:256:    const mappings = causalLinksProcessor.CAUSAL_LINK_MAPPINGS;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:257:    expect(mappings).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:258:    expect(typeof mappings).toBe('object');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:259:    expect(Array.isArray(mappings)).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:264:    const mappings = causalLinksProcessor.CAUSAL_LINK_MAPPINGS;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:266:    const keys = Object.keys(mappings);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:269:      expect(mappings).toHaveProperty(k);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:275:      const mappings = causalLinksProcessor.CAUSAL_LINK_MAPPINGS;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:276:      for (const [, mapping] of Object.entries(mappings)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:277:        const typedMapping = mapping as CausalLinkMapping;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:278:        expect(typeof typedMapping.relation).toBe('string');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:279:        expect(typeof typedMapping.reverse).toBe('boolean');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:295:      const mappings = causalLinksProcessor.CAUSAL_LINK_MAPPINGS;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:297:      for (const [, mapping] of Object.entries(mappings)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:298:        const typedMapping = mapping as CausalLinkMapping;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:299:        expect(validRelations).toContain(typedMapping.relation);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:369:  it('has all 7 intent mappings', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:371:    const mapping = memoryContext.INTENT_TO_MODE;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:373:    const keys = Object.keys(mapping);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:376:      expect(mapping).toHaveProperty(k);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:194:          scope: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:253:    it('T521-L3: Limit clamping validates boundary values', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh:84:  scope: specFolderArg || 'all-active-specs',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:599:describe('C138: Centroid-Based Classification & Lambda Mapping', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:677:  it('C138-T5: intent-to-lambda mapping covers required intents', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1436:      scope: saveScope,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs:75: * Handles cycles by capping at the number of nodes (graceful degradation).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:510:  it('contains lazy warmup and eager override in cli source', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:514:    expect(cliSource).toContain('--eager-warmup');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-types.vitest.ts:147:    it('T080: Type inference from importance_tier mapping', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:335:      console.warn('[PE-Gate] memory_conflicts table not yet created, skipping log');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs:216:  PRIORITY: 'priority',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs:224: * @param {string} [mergeStrategy='dedupe'] - How to merge: 'concat', 'dedupe', or 'priority'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs:260:              reason: 'priority-upgrade',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs:273:              reason: 'priority-kept',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:509:  describe('8. Provider priority', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:510:    it('Voyage takes priority over Cohere when both keys set', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:517:      const results = await crossEncoder.rerankResults('priority-test', docs, { useCache: false });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:519:      // Voyage has higher priority than Cohere
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:142:      const r = tierClassifier.classifyTier({ id: 2, is_pinned: 1, stability: 1.0 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:180:      expect(tierClassifier.shouldArchive({ id: 3, is_pinned: 1, stability: 0.01, created_at: new Date(Date.now() - 200 * 86400000).toISOString() })).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:322:    expect(meta.qualityScore).toBeCloseTo(0.92, 5); // DB score takes priority
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs:87: * - Weight clamping (0.0-2.0 range for coverage, vs 0-1 for causal)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs:141: * - Weight clamping on update
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:219:function isYamlMapping(value: unknown): value is Record<string, unknown> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:242:function parseYamlMapping(raw: string): Record<string, unknown> | null {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:249:    return isYamlMapping(parsed) ? parsed : null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:258:    if (parsed !== null && !isYamlMapping(parsed)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:259:      return 'frontmatter root must be a YAML mapping';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:306:  const parsedFrontMatter = parseYamlMapping(frontMatter);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:337:  const parsedFrontMatter = parseYamlMapping(frontMatter);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/assets/complexity_decision_matrix.md:234:| REQ-012     | §4.2    | Score-to-level mapping (0-25, 26-55, 56-79, 80+)  |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/assets/complexity_decision_matrix.md:249:- [template_mapping.md](./template_mapping.md) - Template routing with copy commands
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/README.md:33:| `indexing.ts` | Runtime bootstrap, embedding warmup, memory index scan, and shutdown helpers |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-aware-traversal.vitest.ts:17:  it('maps fix_bug to CORRECTION then DEPENDS_ON priority', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-aware-traversal.vitest.ts:24:  it('maps add_feature to EXTENDS then DEPENDS_ON priority', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-aware-traversal.vitest.ts:31:  it('maps find_decision to PREFERENCE then CORRECTION priority', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:48:export async function warmEmbeddingModel(input: string = 'warmup test'): Promise<EmbeddingProfile | null> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:251:  it('RP-05: voyage takes priority over cohere', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts:187:    it('T501-08b: Unicode accent stripping', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:9: * - Phase 6: Scoring & priority (DOCUMENT_TYPE_MULTIPLIERS, pattern alignment)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:42:// Phase 6: Scoring & priority
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:204:  describe('T069: extractDocumentType() filename mapping', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:469:      // Use low base values to avoid clamping to 1.0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:485:      // Constitutional (2.0) > spec (1.4) with low enough base to avoid clamping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:711:  describe('T074: Tier mapping', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:867:        is_pinned: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:910:        is_pinned: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:117:        warmup: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:125:        'warmup',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:151:    it('T513-02d: auto fallback records effective provider metadata after warmup failure', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:156:      vi.spyOn(VoyageProvider.prototype, 'warmup').mockResolvedValue(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:158:      const provider = await createEmbeddingsProvider({ warmup: true });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:172:      expect(factoryMetadata?.fallbackReason).toContain('warmup failed');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:242:    it('T513-03f: openai warmup uses a bounded Promise.race deadline', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:245:      expect(source).toContain('OpenAI warmup timed out after ${this.timeout}ms');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:249:    it('T513-03g: voyage warmup uses a bounded Promise.race deadline', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:252:      expect(source).toContain('Voyage warmup timed out after ${this.timeout}ms');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/embeddings.vitest.ts:268:    it('T513-04b: empty document and query inputs return null without provider warmup', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts:123:      structuredLog('warn', `Skipping invalid noise pattern: ${errMsg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:73:  scope: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:172:        const state = loadMostRecentState({ scope: { specFolder: 'specs/matching' } });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:215:          scope: { specFolder: 'specs/stale', claudeSessionId: staleSessionId },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:359:  scope: SessionIdentityScope = {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:387:  scope: SessionIdentityScope = {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1126:function recoverState(sessionId: string, scope: SessionIdentityScope = {}): RecoverResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1193:function getInterruptedSessions(scope: SessionIdentityScope = {}): InterruptedSessionsResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:188:  describe('namespace scoping', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:38:  is_pinned?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:81:      is_pinned INTEGER DEFAULT 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:105:    INSERT INTO memory_index (spec_folder, file_path, title, content_text, importance_tier, created_at, last_accessed, access_count, confidence, is_pinned, stability, half_life_days)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:118:    data.is_pinned || 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs:7:// v1: heuristic-based (file counts, directory grouping, hotspot ranking)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:98:| **Constitutional Memory**     | Always-surface rules with a 3.0x boost that never decay -- like pinned notes that show up in every search                                                                                                      |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:269:Checklists use a priority system so reviewers know what blocks shipping and what can wait:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/README.md:1029:A: Constitutional memories are rules that always surface in every retrieval, regardless of recency or score. They carry a 3.0x boost and never decay. Use `/memory:learn` to create them. Typical use cases: team coding standards, mandatory workflow steps, known failure modes. They work like pinned messages in a chat -- always visible, no matter how far you scroll.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/chunking.ts:40: * 3) Decision sections, 4) Fill remaining with high -> medium -> low priority.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/chunking.ts:86:  for (const priority of ['high', 'medium', 'low'] as const) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/chunking.ts:87:    for (const section of priorities[priority]) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:163:function stripWrappingQuotes(value: string): string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:538:    .map((part) => stripWrappingQuotes(part.trim()))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:600:    return stripWrappingQuotes(firstValue);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:617:    listValues.push(stripWrappingQuotes(listMatch[1].trim()));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/assets/level_decision_matrix.md:154:All checklist items MUST be tagged with priority markers:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/assets/level_decision_matrix.md:353:- [template_mapping.md](./template_mapping.md) - Template routing and task mapping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:78:  describe('Decay floor clamping', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:201:    it('T214-10: High-score memory (0.8) survives and decays normally', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:214:    it('T214-11: Floor-score memory (0.05) survives', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:142:const mockFilterRowsByScope = vi.fn((rows: Array<Record<string, unknown>>, scope: Record<string, unknown>, allowedSharedSpaceIds?: Set<string>) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:170:  filterRowsByScope: (rows: Array<Record<string, unknown>>, scope: Record<string, unknown>, allowedSharedSpaceIds?: Set<string>) =>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:177:const mockGetAllowedSharedSpaceIds = vi.fn((_db: unknown, _scope: Record<string, unknown>) => undefined as Set<string> | undefined);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:179:  getAllowedSharedSpaceIds: (db: unknown, scope: Record<string, unknown>) => mockGetAllowedSharedSpaceIds(db, scope),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:286:    // Both channels return overlapping result (id=1)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/assets/parallel_dispatch_config.md:160:- [template_mapping.md](./template_mapping.md) - Template routing and task mapping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/package-lock.json:1566:        "@jridgewell/trace-mapping": "^0.3.31",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/package-lock.json:1571:    "mcp_server/node_modules/@vitest/coverage-v8/node_modules/ast-v8-to-istanbul/node_modules/@jridgewell/trace-mapping": {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/package-lock.json:1573:      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.31.tgz",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/package-lock.json:1582:    "mcp_server/node_modules/@vitest/coverage-v8/node_modules/ast-v8-to-istanbul/node_modules/@jridgewell/trace-mapping/node_modules/@jridgewell/resolve-uri": {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/package-lock.json:1592:    "mcp_server/node_modules/@vitest/coverage-v8/node_modules/ast-v8-to-istanbul/node_modules/@jridgewell/trace-mapping/node_modules/@jridgewell/sourcemap-codec": {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/package-lock.json:4187:        "cli-spinners": "^2.9.2",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/package-lock.json:4395:    "mcp_server/node_modules/node-llama-cpp/node_modules/ipull/node_modules/cli-spinners": {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/package-lock.json:4397:      "resolved": "https://registry.npmjs.org/cli-spinners/-/cli-spinners-2.9.2.tgz",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/package-lock.json:4664:        "cli-spinners": "^3.2.0",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/package-lock.json:4753:    "mcp_server/node_modules/node-llama-cpp/node_modules/ora/node_modules/cli-spinners": {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/package-lock.json:4755:      "resolved": "https://registry.npmjs.org/cli-spinners/-/cli-spinners-3.4.0.tgz",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/SHARED_MEMORY_DATABASE.md:57:- **Multi-agent setups** where you want certain agents to share findings while keeping others out
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/migrate-deep-research-paths.ts:57:    console.warn(`Skipping conflicting destination: ${normalize(destinationPath)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/level_2/README.md:74:- Completion checks run in priority order: P0, then P1, then P2.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/config/index.ts:13:// while keeping the canonical implementation in core/config.ts.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/20--remediation-revalidation/226-memory-health-auto-repair.md:21:- Pass/fail: PASS if the targeted suites pass and the evidence confirms confirmation gating, bounded repair execution, and transparent repair bookkeeping for both success and partial-success paths
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/20--remediation-revalidation/226-memory-health-auto-repair.md:29:| 226 | Memory health auto-repair | Confirm memory_health exposes confirmation-gated repair actions, executes bounded cleanup, and reports partial-success outcomes transparently | `Validate memory_health auto-repair behavior for the Spec Kit Memory MCP server. Capture the evidence needed to prove autoRepair requires explicit confirmation before mutation, that confirmed repair can rebuild FTS, refresh trigger caches, and clean orphaned edges or vector data, and that the response preserves requested, attempted, repaired, warnings, errors, and partialSuccess metadata. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/memory-crud-extended.vitest.ts tests/tool-input-schema.vitest.ts` 2) inspect assertions covering `memory_health` with `autoRepair: true` and missing `confirmed: true` to verify confirmation-required behavior 3) inspect assertions covering confirmed FTS rebuild, trigger-cache refresh, orphan-edge cleanup, and vector or chunk cleanup 4) inspect assertions covering `repair.requested`, `repair.attempted`, `repair.repaired`, `repair.partialSuccess`, `repair.warnings`, and `repair.errors` in success and partial-success paths | Health and schema suites pass; unconfirmed autoRepair responses require confirmation and list planned actions; confirmed repair paths rebuild or refresh the expected stores; and structured repair metadata exposes both full and partial-success outcomes without hiding residual warnings | Test transcript + key assertion output for confirmation gating, staged repair actions, and repair metadata | PASS if the targeted suites pass and the evidence confirms confirmation gating, bounded repair execution, and transparent repair bookkeeping for both success and partial-success paths | Inspect `mcp_server/handlers/memory-crud-health.ts`, `mcp_server/lib/parsing/trigger-matcher.ts`, `mcp_server/lib/search/vector-index.ts`, and `mcp_server/lib/storage/causal-edges.ts` if repair staging, metadata, or cleanup coverage regresses |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-phase-links.sh:35:    # TODO: Parse Predecessor/Successor metadata table rows instead of grepping for phase name presence. Current approach may pass with swapped, stale, or duplicated adjacency metadata. See review finding F-035.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:151:    // Preserve checklist state markers while dropping the bullet itself.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json:11:      "description": "General convergence sensitivity threshold. Lower values require more convergence before stopping.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:108:          is_pinned INTEGER DEFAULT 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/parsing/README.md:36:- Extracts `quality_flags` as a string array from YAML list syntax, stripping single and double quotes.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/parsing/README.md:56:| `quality-extractors.test.ts` | 13-case test suite covering edge cases (empty input, clamping, CRLF, body-only values) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:21:/** Trigger cache entry for a single phrase-to-memory mapping */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:474:  // Step 2: Optional accent stripping (NFKD + remove combining marks)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:6:// Verifies feature flag gating, channel-to-flag mapping, ablation runner
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1071:      console.warn('No queries with ground truth — skipping isolation test');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh:78:        local bare_priority_count=0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh:80:        bare_priority_count=$(count_matches '^\s*-\s*\[[ x]\]\s*\*\*\[P[012]\]\*\*' "$folder/checklist.md")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh:83:        if [[ "$bare_priority_count" -gt 0 && "$chk_count" -eq 0 ]]; then
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh:84:            errors+=("checklist.md: Uses **[P0]** format instead of CHK-NNN [P0] identifiers ($bare_priority_count items without CHK prefix)")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh:85:        elif [[ "$bare_priority_count" -gt 0 ]]; then
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh:86:            errors+=("checklist.md: $bare_priority_count item(s) use **[P0]** format instead of CHK-NNN [P0]")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:113:  // Canonical self-mappings
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:208:  // Convert UTF-16 BE to LE by swapping bytes, then decode as utf16le.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:287:    it('T500-09c: overlapping anchors are rejected', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:288:      const overlappingContent = `<!-- ANCHOR:outer -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:295:      const validation = memoryParser.validateAnchors(overlappingContent);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-complexity.sh:160:            RULE_MESSAGE="Unknown level '$declared_level' - skipping complexity checks"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:672:describe('T022-11: Tier-to-Channel Mapping Readiness', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:111:    // ISS-B04-002 fix — wrapping history + vector cleanup in one
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/README.md:86:# -rwxr-xr-x check-priority-tags.sh
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/README.md:119:├── check-priority-tags.sh  # PRIORITY_TAGS - Checklist priority context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/README.md:139:| `check-priority-tags.sh`  | Quality validation: ensures checklist items have P0/P1/P2 context         |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/README.md:186:#### PRIORITY_TAGS (check-priority-tags.sh)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/README.md:188:**Purpose**: Validates checklist items have priority context (P0/P1/P2)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/README.md:415:# PRIORITY_TAGS: All checklist items have priority context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/README.md:497:| No priority tags  | Add `## P0`, `## P1`, `## P2` headers            |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/context-types.ts:5:// values, and legacy alias mappings. Used across shared/,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-evidence.sh:41:    local current_priority=""
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-evidence.sh:48:        # Detect priority section headers (## P0, ## [P1], ### P2: ...)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-evidence.sh:50:            current_priority="${BASH_REMATCH[1]}"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-evidence.sh:56:            local item_priority=""
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-evidence.sh:58:                item_priority="${BASH_REMATCH[1]}"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-evidence.sh:59:            elif [[ -n "$current_priority" ]]; then
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-evidence.sh:60:                item_priority="$current_priority"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-evidence.sh:63:            [[ "$item_priority" == "P2" ]] && continue
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-evidence.sh:90:                local priority_label="${item_priority:-UNSPECIFIED}"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-evidence.sh:91:                RULE_DETAILS+=("${priority_label}:${line_num}: ${display_task}")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1237:        scope: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1306:        scope: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:275:  it('uses intentAdjustedScore when available (highest priority)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/reindex-embeddings.ts:60:      const profile = await warmEmbeddingModel('warmup test');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/reindex-embeddings.ts:66:      console.error('ERROR: Embedding warmup failed:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:220:  it('should give constitutional memory priority in batch', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1036:    // Parser should reject (content < 5 after stripping? or validation fails)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:36:  /** Session ID for grouping selections. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:88:  /** Total number of overlapping query-memory pairs compared. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:461:  // Compare overlapping pairs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:667:    // Based on INTENT_TO_MODE mapping, auto can route to deep or focused
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:674:    // Verified by examining the mapping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-priority-tags.sh:11:# Description: Validates checklist items have priority context (P0/P1/P2 headers or inline tags).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-priority-tags.sh:48:    local current_priority=""
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-priority-tags.sh:49:    local items_without_priority=0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-priority-tags.sh:57:            current_priority="${BASH_REMATCH[1]}"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-priority-tags.sh:66:                ((items_without_priority++)) || true
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-priority-tags.sh:70:            local has_priority=false
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-priority-tags.sh:71:            [[ -n "$current_priority" ]] && has_priority=true
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-priority-tags.sh:73:            [[ "$line" =~ \[P[012]\] ]] && has_priority=true
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-priority-tags.sh:74:            [[ "$line" =~ \*\*P[012]\*\* ]] && has_priority=true
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-priority-tags.sh:76:            if [[ "$has_priority" == "false" ]]; then
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-priority-tags.sh:81:                ((items_without_priority++)) || true
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-priority-tags.sh:90:    if [[ $items_without_priority -eq 0 ]]; then
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-priority-tags.sh:92:        RULE_MESSAGE="All checklist items have priority context"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/rules/check-priority-tags.sh:95:        RULE_MESSAGE="Found $items_without_priority checklist item(s) without priority context"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/lib/structure-aware-chunker.ts:49: * Detection rules (in priority order):
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposition.vitest.ts:55:  it('deduplicates overlapping results when merging facet coverage pools', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/scripts-registry.json:195:      "description": "Move completed spec folders to archive, keeping specs/ directory clean",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/scripts-registry.json:281:      "name": "check-priority-tags",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/scripts-registry.json:282:      "path": "scripts/rules/check-priority-tags.sh",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:951:      "notes": "Manual refactor opinion expressed as a statement — tests whether refactor intent surfaces current architecture docs."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:960:      "expectedResultDescription": "Should surface trigger-matcher.ts, vector-index.ts, hybrid-search.ts, and any architectural decision about keeping the two paths separate.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/lib/README.md:99:Block detection priority: code fence > table > heading > text.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:38:  scope: 'match' | 'mismatch';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:13://   - Sprint labels inferred from metadata JSON or eval_run_id grouping.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:38:  let skippingQualityFlags = false;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:42:    if (skippingQualityFlags) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:46:      skippingQualityFlags = false;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:54:      skippingQualityFlags = true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:604:        data: { priority: 'high' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:614:      expect(md).toContain('"priority": "high"');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:169:  it('handles punctuation correctly by stripping it during tokenization', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:84:    expect(directive!.priorityCondition).toMatch(/^Prioritize when:/);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:116:  it('T8: uses second imperative line for priority condition when available', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:123:    // Second line provides the priority condition
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:124:    expect(directive!.priorityCondition).toMatch(/^Prioritize when:/);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:161:  it('T12: priorityCondition always starts with "Prioritize when:"', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:170:      expect(d!.priorityCondition).toMatch(/^Prioritize when:/);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:228:  it('T21: fallback priorityCondition includes the title in quotes', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:230:    expect(d!.priorityCondition).toContain('"My Rule"');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:260:  it('T24: formats as "surfaceCondition | priorityCondition"', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:263:      priorityCondition: 'Prioritize when: modifying core files',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:475:    expect(d!.priorityCondition).toMatch(/^Prioritize when:/);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:584: * @returns Record mapping metric name to computed value in [0, 1].
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/029-missing-checklist-sections/plan.md:12:Missing priority headers.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/029-missing-checklist-sections/plan.md:30:Create checklist without priority headers.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:21:const mappingChecks = [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:101:describe('Feature flag reference catalog mappings', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:102:  for (const check of mappingChecks) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/029-missing-checklist-sections/checklist.md:7:- [x] Some item without priority context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:144:      console.warn(`   Skipping ${filename}: duplicate of existing ${duplicateOf}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:29:describe('agent routing validates classifier-backed intent mapping', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts:23:// - Includes spec folder name tokens as high-priority topics
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:89:   for queries where live DB mapping has not yet been performed.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:106:  // Use the real production DB ID mappings from GROUND_TRUTH_RELEVANCES.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/content-cleaner.ts:4:// HTML stripping and anchor escaping utilities for rendered memory content.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:309:  it('returns 0 for fewer than 2 overlapping items', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:632:  it('only includes overlapping items in deltas', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:25:/** Full analysis result mapping each tested K-value to its metrics. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:95:    console.warn('   Warning: Embedding generation returned null - skipping indexing');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:150:    console.warn('[memory-indexer] Skipping index: empty title');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:154:    console.warn('[memory-indexer] Skipping index: empty content');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:89:  /** Mean absolute score delta across overlapping results. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:91:  /** Mean absolute rank delta across overlapping results. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:190: * Only considers overlapping results.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:198:  // Find overlapping IDs and their rank pairs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:304:  // Compute per-result deltas for overlapping results
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/README.md:36:- `content-cleaner.ts` - HTML stripping and literal anchor escaping for rendered memory content
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:657:        // QueriesChannelHelped = channel was helping (removing it hurt quality)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:142:    const longContent = 'This is a much longer piece of meaningful content that exceeds one hundred characters after stripping and should not be penalized for length at all.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/edge-density.vitest.ts:206:      expect(result.r10Recommendation).toMatch(/sprint|timeline|priority/i);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/scoring/README.md:112:| `TIER_WEIGHTS`     | `TierWeights`         | Importance tier to weight mapping (0.1-1.0)    |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1855:    log(`   Skipping ${ctxFilename}: duplicate of existing ${duplicateExistingFilename}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1934:    log('   Context file was a duplicate — skipping description tracking');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2064:    log('   Skipping indexing — context file was a duplicate');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2108:        log('   Index policy: skipping semantic indexing for this file');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2132:      warn(`   Warning: Retry manager unavailable; skipping retry queue processing (${retryManagerLoadIssue})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:35:    it('computes correct deltas for overlapping results', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/tree-thinning.ts:93: * Derive the parent path from a child path by stripping the last segment.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:93: * Groups results by channel, deduplicates by memory ID (keeping highest score).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:74:  // 1. Exact match priority
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:76:  describe('Exact match priority', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:40:      is_pinned INTEGER DEFAULT 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:794:    it('5.1.2 correct mappings', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:769:    it('limit applies after sprint grouping and report totals match the included scope', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/scoring/folder-scoring.ts:85: * Tier priority order (highest to lowest)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/scoring/folder-scoring.ts:90: * Archive pattern to multiplier mapping (Decision D2)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/scoring/folder-scoring.ts:118: * Uses ARCHIVE_MULTIPLIERS for centralized pattern-to-multiplier mapping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:190:    it('priority 1: JSONL is always available', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:191:      const priority1 = { source: 'jsonl', available: true };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:192:      expect(priority1.available).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:195:    it('priority 2: local JSON graph is reducer-rebuilt', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:196:      const priority2 = { source: 'local-cache', available: true };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:197:      expect(priority2.source).toBe('local-cache');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:200:    it('priority 3: SQLite projection is MCP-maintained', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:201:      const priority3 = { source: 'mcp', available: false };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:203:      expect(priority3.source).toBe('mcp');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/types.ts:54:  warmup(): Promise<boolean>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/types.ts:101:  warmup?: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/types.ts:343:/** Tier weights mapping tier names to numeric weights */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:10:// Closure utility for ground-truth mapping reconciliation.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:33:const OUTPUT_PATH = '/tmp/ground-truth-id-mapping.json';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:65:interface RelevanceMapping {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:171:): RelevanceMapping[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:208:        // Malformed FTS terms should not terminate the full mapping run.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:365:  // Emit at most three mappings per query.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:380:  const mappings: RelevanceMapping[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:383:  mappings.push({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:393:    mappings.push({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:404:    mappings.push({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:413:  return mappings;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:420:  console.log('=== Ground Truth ID Mapping Script ===');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:434:  // Readonly mode prevents accidental mutation during mapping.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:444:  // Iterate query set and aggregate candidate mappings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:445:  const allMappings: RelevanceMapping[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:451:    const mappings = mapQueryToMemories(db, query);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:461:    if (mappings.length === 0 || (mappings.length === 1 && mappings[0].memoryId === -1)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:466:      allMappings.push(...mappings);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:468:        for (const m of mappings) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:475:  // Print aggregate mapping counters.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:478:  console.log(`Hard negatives:     ${hardNegatives} (no mapping needed)`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:481:  console.log(`Total relevances:   ${allMappings.length}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:485:  for (const m of allMappings) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:495:  const highConf = allMappings.filter(m => m.confidence >= 0.7).length;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:496:  const medConf = allMappings.filter(m => m.confidence >= 0.3 && m.confidence < 0.7).length;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:497:  const lowConf = allMappings.filter(m => m.confidence < 0.3).length;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:500:  // Persist deterministic mapping artifact for review.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:508:    mappings: allMappings,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:512:  console.log(`\nMapping written to: ${OUTPUT_PATH}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:519:    const nextRelevances = [...allMappings]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:520:      .map((mapping) => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:521:        queryId: mapping.queryId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:522:        memoryId: mapping.memoryId,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:523:        relevance: mapping.relevance,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/040-priority-context-reset/spec.md:14:Tests items after non-priority headers inherit context.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/README.md:222:│   ├── jsonc-strip.ts          # JSONC comment stripping helper
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/README.md:290:| **Algorithm**   | TF-IDF + N-gram hybrid with priority extraction |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:351:          console.warn(`[file-watcher] Skipping reindex outside watch roots: ${path.basename(filePath)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/examples/level_3/tasks.md:3:description: "including dependencies, milestone mapping, and detailed verification tasks. -->"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/examples/level_3/tasks.md:19:including dependencies, milestone mapping, and detailed verification tasks. -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/templates/examples/level_3/tasks.md:203:- Milestone mapping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:7:// the export surface without bootstrapping a real database.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/040-priority-context-reset/checklist.md:19:Items after non-priority header tracked correctly.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:209:    it('R6-T16: missing memoryState rows are treated as UNKNOWN and pass all filters (priority above HOT)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:212:        { id: 2, similarity: 80 }, // no memoryState → UNKNOWN (priority 6, above HOT=5)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:228:      // UNKNOWN (priority 6) passes WARM (4). COLD (3) does NOT pass WARM (4).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:234:    it('R6-T16b: focused/deep minState filtering keeps rows with missing state (UNKNOWN priority above HOT)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:239:        { id: 4, similarity: 61 }, // no memoryState → UNKNOWN (priority 6)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings.ts:356: * 2. Provider is created without warmup (warmup: false)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings.ts:371: * Check if eager warmup is requested via environment variable.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings.ts:399:        warmup: false, // T017: No warmup at creation; model loads on first embed call
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings.ts:676: * Note: Query embeddings ARE cached, but with lower priority than documents:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings.ts:712:    // Cache query embeddings with lower priority (only if space available)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings.ts:826:    await provider.warmup();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings.ts:833:    console.error('[embeddings] Pre-warmup failed:', getErrorMessage(error));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:95:| **important** | 0.8 | 1.5x | No | Never | High priority, no decay |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:1369:Confirm anchor-priority thinning.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:1372:Prompt: `Validate anchor-aware chunk thinning (R7). Capture the evidence needed to prove Anchor chunks retained; filler chunks thinned; retained set is non-empty; anchor priority respected in thinning order. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:1374:Anchor chunks retained; filler chunks thinned; retained set is non-empty; anchor priority respected in thinning order
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:1644:Per-path DB isolation holds; close_db cleans up all handles; archived cache scoping does not leak across options
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:1772:Prompt: `Validate Stage 3 effectiveScore fallback chain. Capture the evidence needed to prove Fallback chain follows defined priority order; missing score fields trigger next fallback; final fallback produces valid score. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:1774:Fallback chain follows defined priority order; missing score fields trigger next fallback; final fallback produces valid score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:1878:### 082 | Evaluation and housekeeping fixes
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:1881:Confirm eval/housekeeping reliability.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:1884:Prompt: `Validate evaluation and housekeeping fixes. Capture the evidence needed to prove Run-IDs are unique across restarts; upserts are idempotent; boundary guards prevent out-of-range values; housekeeping completes cleanly. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:1886:Run-IDs are unique across restarts; upserts are idempotent; boundary guards prevent out-of-range values; housekeeping completes cleanly
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:1889:> **Feature File:** [082](09--evaluation-and-measurement/082-evaluation-and-housekeeping-fixes.md)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:1890:> **Catalog:** [09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md](../feature_catalog/09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2484:Verify runtime roadmap resolvers stay distinct from live runtime flags while keeping shared memory and dormant adaptive ranking default-off until explicitly enabled.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2787:Prompt: `Validate shared-memory default-off enablement and first-run setup. Capture the evidence needed to prove Default-off: status returns disabled without env var or DB config; enable persists to DB config table; enable is idempotent; README created in shared-spaces/; DB persistence survives restart; env var override takes priority over DB state; /memory:manage shared command shows setup prompt when disabled; and partial shared-space updates preserve existing rolloutCohort and metadata fields when they are omitted from the update request. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2831:All 5 sampled modules have accurate file lists and consumer mappings
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:2924:Verify graph weight cap enforcement at 0.05 and community score capping at 0.03 when graph calibration profile is enabled.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3095:Prompt: `Test the default-on SPECKIT_CALIBRATED_OVERLAP_BONUS behavior. Run a multi-channel search that produces overlapping results across vector, BM25, and graph channels. Verify the calibrated bonus uses beta=0.15 scaling and caps at 0.06, replacing the flat 0.10 convergence bonus. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3151:Prompt: `Test the default-on SPECKIT_TYPED_TRAVERSAL behavior. Verify that sparse graphs (density < 0.5) constrain traversal to 1-hop typed expansion and that intent-aware edge traversal maps query intents to edge-type priority orderings. Confirm the scoring formula score = seedScore * edgePrior * hopDecay * freshness is applied. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3583:| 082 | Features | Evaluation and housekeeping fixes | [082](09--evaluation-and-measurement/082-evaluation-and-housekeeping-fixes.md) | [09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md](../feature_catalog/09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:3700:| 125-map | Features | Audit phase mapping note (020) | — | [19--feature-flag-reference/08-audit-phase-020-mapping-note.md](../feature_catalog/19--feature-flag-reference/08-audit-phase-020-mapping-note.md) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:189:    // Create two lists with overlapping items
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:833:        scope: { tenantId: 'tenant-a' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:904:        scope: { tenantId: 'tenant-a' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:4:// Phase 030 / Phase 2: transport-only mapping from shared payload
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:109:/** Weight clamping bounds */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:44:| **Tier Mapping** | Link importance tiers to appropriate memory types |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:54:| Keyword Mappings | 40+ | Title/trigger phrase to type mapping |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:90:### Tier to Type Mapping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:33:      const requiredFields = ['id', 'name', 'description', 'tokenBudget', 'priority', 'useCase', 'tools'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:57:      const priorities = Object.values(LD).map(layer => layer.priority).sort((a, b) => a - b);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:109:    it('T11: Specific tool-to-layer mappings are correct', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:110:      const expectedMappings: Record<string, string> = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:134:      for (const [tool, expectedLayer] of Object.entries(expectedMappings)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:270:      expect(info.priority).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:287:      const requiredFields = ['id', 'name', 'description', 'tokenBudget', 'priority', 'useCase', 'tools'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:303:    it('T28: Sorted ascending by priority', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:305:      const priorities = layers.map(layer => layer.priority);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:602:        return { success: false, error: 'Embedding provider circuit breaker open — skipping API call' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:865: * Apply min-max normalization to composite scores, mapping to [0,1].
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/utils/README.md:33:Low-level utility functions shared across `system-spec-kit`. These modules provide **security-hardened path validation**, **resilient retry logic** with error classification, **JSONC comment stripping** for config parsing, and **token count estimation**.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/utils/README.md:48:| `jsonc-strip.ts` | JSONC comment stripping while preserving string literals |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/utils/README.md:139:Errors are classified using a priority chain: **HTTP status** → **network error code** → **permanent message patterns** → **transient message patterns** → **unknown (no retry)**.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:66:  it('does not leak empty constitutional results during same-key warmup reentry', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:233:  it('keeps custom SQLiteVectorStore instances pinned to their own databases after alternating writes', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts:32:  priority: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts:267:    const priorityMatch = itemMatch[2].match(/\[(P[0-2])\]/i);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts:271:      priority: priorityMatch ? priorityMatch[1].toUpperCase() : currentPriority,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/nested-changelog.ts:429:    .map((item) => `${item.priority || 'Checklist'} - ${item.text} (${item.evidence})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:237:  // over-captured by the generic important -> declarative mapping.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:247:  // 3. Check importance tier mapping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:321:  importance_tier: 'Derived from importance_tier field mapping',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:627:  it('T312: rebuildFromDatabase defers warmup and hydrates documents in batches', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts:54:    description: 'High priority, no decay',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:627:  priorityLabel: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:633:  console.log(`   [${priorityLabel}] Selected ${formatCandidatePathForLog(candidatePath, specsDirs)} | quality=${quality.label} | ${reason}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:719:      console.warn(`Skipping session_learning spec_folder outside specs roots: ${resolvedSpecFolder}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:791:          `[folder-detector] Skipping session-learning row with unapproved absolute spec_folder: ${resolvedAbsoluteSpecFolder}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:1398:    // DB not available, table missing, or folder doesn't exist — fall through to next priority
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:1551:      console.warn(`   [Priority 4] Alignment score ${alignmentScore}% below threshold; keeping deterministic fallback candidate.`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:306:  if (memory.is_pinned === 1) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:362: * redistributed to other tiers that have overflow (in priority order).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:372:/** Priority order for tier overflow redistribution (highest priority first) */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:383: * to other tiers in priority order to maximize total result count.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:424:    // Apply limits, distributing surplus to over-filled tiers in priority order
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:505:  if (memory.is_pinned === 1) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:106:// Replaces the previous process-global boolean to avoid skipping priming
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:290:      `(${tokenCount} > ${budgetLimit}); dropping payload`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:22:- [3. FEATURE CATALOG MAPPING](#3--feature-catalog-mapping)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:144:  - `recovery-hints.ts` — tool-aware recovery guidance and error-code hint mapping.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:284:- Purpose: Owns the standard MCP response envelope used to make tool results predictable for agents and callers. It is the canonical place for `{summary, data, hints, meta}` shaping.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:411:<!-- ANCHOR:feature-catalog-mapping -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:492:<!-- /ANCHOR:feature-catalog-mapping -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:361: * Strategy: SQL query fetches broad candidates (unarchived, not protected, not pinned).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:371:    // Broad SQL pre-filter: get unarchived, non-protected, non-pinned memories
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:377:        AND is_pinned = 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/README.md:228:**Solution**: This is informational. The script uses priority order (specs/ first):
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:163:| `createEnvelope(data, trace, degradedMode?, serverVersion?)` | `ContextEnvelope<T>` | New envelope wrapping results + trace + metadata |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:366:export function hasScopeConstraints(scope: ScopeContext): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:457:  scope: ScopeContext,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:635:  scope: ScopeContext,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:673:export function filterRowsByScope<T extends Record<string, unknown>>(rows: T[], scope: ScopeContext, allowedSharedSpaceIds?: ReadonlySet<string>): T[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/009-valid-priority-tags/spec.md:14:This fixture tests priority tag validation.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/009-valid-priority-tags/spec.md:19:- Multiple priority formats
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/009-valid-priority-tags/spec.md:26:- Inline priority tags
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:181: * Tier 1: Env var override (highest priority) — `SPECKIT_MEMORY_SHARED_MEMORY` or `SPECKIT_HYDRA_SHARED_MEMORY`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:192:  // Tier 1: Env var enable (highest priority)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:507:export function getAllowedSharedSpaceIds(database: Database.Database, scope: ScopeContext): Set<string> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:557:  scope: ScopeContext,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:92:function matchesScope(state: HookState, scope: HookStateScope): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/009-valid-priority-tags/plan.md:8:Testing priority tag validation.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/009-valid-priority-tags/plan.md:16:Valid priority tags.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:485:  description: '[L6:Analysis] Trace causal chain for a memory to answer "why was this decision made?" Traverses causal edges up to maxDepth hops, grouping results by relationship type (caused, enabled, supersedes, contradicts, derived_from, supports). Use to understand decision lineage and memory relationships. Token Budget: 1200.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-combiner.vitest.ts:473:      // For linear SHAP: sum of SHAP values + E[f(x)] = f(x) (before clamping)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-combiner.vitest.ts:484:      // f(x) = bias + sum(weight_i * x_i) (before clamping)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/009-valid-priority-tags/checklist.md:9:- [ ] [P0] Inline priority tag example
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/009-valid-priority-tags/checklist.md:15:- [ ] **P1** Bold priority tag example
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:33:      hookLog('warn', 'gemini:session-stop', `Transcript too large (${stat.size} bytes > ${MAX_TRANSCRIPT_BYTES}); skipping spec folder detection`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:516: * Get action priority for sorting.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:708:3. Indexes changed or new files, skipping unchanged ones based on content hash
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:173:    // Use very high beta to force clamping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:17:  priority: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:48:    priority: 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:57:    priority: 2,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:66:    priority: 3,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:75:    priority: 4,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:84:    priority: 5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:93:    priority: 6,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:113:    priority: 7,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:206: * Get all layers in priority order.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:209:  return Object.values(LAYER_DEFINITIONS).sort((a, b) => a.priority - b.priority);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/009-valid-priority-tags/tasks.md:7:- [ ] Test priority validation
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/009-valid-priority-tags/tasks.md:11:This fixture tests priority tag detection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:231:    hookLog('info', 'session-stop', 'Stop hook not active, skipping');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:415:    // Deduplicate by ID, keeping the higher similarity score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:55:| **MCP tools** | 47 | Organized across core memory layers plus dedicated code-graph and CocoIndex dispatch groups |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:412:**Signal vocabulary expansion** -- recognizes correction signals ("actually", "wait") and preference signals ("prefer", "want") in your language, shaping quality scoring.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:475:**Constitutional memory as expert knowledge injection** -- tags high-priority memories with instructions about when to surface. They appear whenever relevant without you asking, like sticky notes on a filing cabinet that say "pull this file whenever someone asks about X." Constitutional injections obey global scope enforcement so the wrong tenant's rules never leak.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:517:**12-metric core computation** -- grades every query across twelve quality dimensions (MRR@1/3/10, NDCG@10, MAP and more). Together they pinpoint exactly where search is struggling, like a doctor running multiple tests instead of just asking "do you feel sick?"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:832:The cleanup tool for large-scale housekeeping. Delete all outdated or temporary memories in one go based on their importance level, like clearing out the recycling bin. The most important memories get extra protection. A safety checkpoint is created first so you can restore if needed.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1042:The MCP handler scores chunk-backed hits against `parentMemoryId ?? row.id`, so eval rows stay attached to canonical parent memories. Before comparing runs after a DB rebuild or import, preview or refresh the live ground-truth mapping with `scripts/evals/map-ground-truth-ids.ts`; if token-budget overflow collapses a run below `recallK`, treat that run as investigation-only rather than a clean benchmark.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1744:| [lib/search/README.md](./lib/search/README.md) | Per-stage module mapping for the 4-stage search pipeline |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:72:| `layer-definitions.ts` | Layer constants, tool-to-layer mapping, token budget helpers, documentation generator |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:88:- **priority**: Layer order (1 = highest)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:100:| `getLayersByPriority` | `() => LayerDefinition[]` | Get all layers sorted by priority |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/scripts/map-ground-truth-ids.ts:4:// MODULE: Ground Truth ID Mapping Compatibility Wrapper
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:34:        is_pinned: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:96:  // 4.3 is_pinned boolean↔integer round-trip
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:97:  describe('is_pinned ↔ isPinned boolean/integer round-trip', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:98:    it('T-NR-05: is_pinned 0 → false → 0 → false', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:100:      const memory = dbRowToMemory({ id: 1, is_pinned: 0, spec_folder: 'a', file_path: 'b' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:104:      expect(backRow.is_pinned).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:111:    it('T-NR-06: is_pinned 1 → true → 1', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:113:      const memory = dbRowToMemory({ id: 2, is_pinned: 1, spec_folder: 'a', file_path: 'b' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:117:      expect(backRow.is_pinned).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:120:    it('T-NR-07: is_pinned null → isPinned false/null', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:122:      const memory = dbRowToMemory({ id: 3, is_pinned: null, spec_folder: 'a', file_path: 'b' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:138:        is_pinned: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:148:        anchor_id: null, is_pinned: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:158:        stability: null, is_pinned: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:168:        last_review: null, is_pinned: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:193:        is_pinned: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:4:// Validates FolderScore formula, damping, enrichment, two-phase
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:48:      // M = 2, damping = 1/sqrt(3), sum = 1.4
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:68:      // M = 1, damping = 1/sqrt(2), sum = 0.9
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:81:     T020-02: Damping factor verification
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:83:  describe('Damping factor', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:84:    it('T020-02: folder with 9 results (damping=1/sqrt(10)) vs 1 result (damping=1/sqrt(2))', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:101:      const largeDamping = 1 / Math.sqrt(10);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:102:      const smallDamping = 1 / Math.sqrt(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:103:      const expectedLarge = largeDamping * 4.5;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:104:      const expectedSmall = smallDamping * 0.9;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:109:      // Large folder still wins here due to volume, but damping reduces its advantage
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:111:      // Verify damping is applied (raw sum 4.5 >> 0.9 but damped score ratio is much closer)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:119:     T020-03: Large folder damping — quality over quantity
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:121:  describe('Large folder damping', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:185:      const folderMap = buildFolderMap([]); // No mappings
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:254:      // All single-result folders have same damping (1/sqrt(2))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:370:      // Verify the top folder is folder-top (higher individual scores + same damping)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:379:    it('T020-11a: returns correct mapping from mock database', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/encoding-intent.vitest.ts:203:      'priority: high',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:435:        priority: 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:499:    it('T524-6: INTENT_TO_MODE mapping is correct', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:500:      const expectedMappings: Record<string, string> = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:508:      for (const [intent, expectedMode] of Object.entries(expectedMappings)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:274:/** Resolve multiple seeds, deduplicate overlapping refs */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:72:| **Chunk Thinning** | R7 anchor-aware chunk scoring and threshold-based dropping at index time |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:399:The tier classifier uses this priority order when calculating retrievability:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:401:1. **Pre-computed `retrievability`**: If memory has a numeric `retrievability` field, use it directly (highest priority)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:519:- `tests/full-spec-doc-indexing.vitest.ts`: validates document typing, scoring multipliers and spec-doc intent routing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:81:/** Deduplicate file references across sections — higher priority sources keep their mentions */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:99:    // Remove duplicate file path lines from lower-priority sections
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:119: * 3. Deduplicate at file level (same file from multiple sources → keep highest priority)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:120: * 4. Render sections in priority order with headers
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts:76:  // Penalize very short chunks (< 100 chars after stripping)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:49: * 3. Redistribute overflow by priority order
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:76:  // Step 2: Redistribute overflow by priority
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:78:    for (const priorityName of PRIORITY_ORDER) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:79:      const alloc = allocations.find(a => a.name === priorityName);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:94:  // Step 3: Enforce total budget cap (trim in reverse priority order)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2078: * Merge two result arrays, deduplicating by id and keeping the higher score.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:1105:            console.warn(`[structural-indexer] Skipping large file (${(stat.size / 1024).toFixed(1)}KB > ${(maxSize / 1024).toFixed(1)}KB): ${fullPath}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:83:// ── Node type → SymbolKind mapping ─────────────────────────────
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:200:  // Check API keys in priority order
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:509:    // L3 FIX: Correct p95 percentile index with bounds clamping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/21--implement-and-remove-deprecated-features/228-retired-runtime-shims.md:19:- Prompt: `Validate retired runtime shims for the Spec Kit Memory MCP server. Capture the evidence needed to prove deprecated compatibility flags such as eager warmup, shadow scoring, novelty boost, and adaptive fusion names may still appear in exports or warnings, but they no longer change the live runtime path. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/21--implement-and-remove-deprecated-features/228-retired-runtime-shims.md:20:- Expected signals: Targeted runtime and scoring suites pass; eager warmup remains hard-disabled despite compatibility flags; shadow scoring runtime entry points stay inert; novelty boost always reports as not applied; and hybrid search uses adaptive fusion as the default live path without consulting the retired rollout flag
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/21--implement-and-remove-deprecated-features/228-retired-runtime-shims.md:29:| 228 | Retired runtime shims and inert compatibility flags | Confirm deprecated runtime flags remain visible for compatibility while no longer steering live behavior | `Validate retired runtime shims for the Spec Kit Memory MCP server. Capture the evidence needed to prove deprecated compatibility flags such as eager warmup, shadow scoring, novelty boost, and adaptive fusion names may still appear in exports or warnings, but they no longer change the live runtime path. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/context-server.vitest.ts tests/learned-feedback.vitest.ts tests/memory-save-ux-regressions.vitest.ts` 2) inspect source-backed assertions or snapshots showing eager warmup stays disabled and deprecated warmup flags only surface as compatibility warnings 3) inspect source-backed assertions or snapshots showing shadow scoring runtime helpers return inert values and novelty boost reports as not applied 4) inspect source-backed assertions or snapshots showing hybrid search always follows adaptive fusion as the default live path without consulting the retired flag | Targeted runtime and scoring suites pass; eager warmup remains hard-disabled despite compatibility flags; shadow scoring runtime entry points stay inert; novelty boost always reports as not applied; and hybrid search uses adaptive fusion as the default live path without consulting the retired rollout flag | Test transcript + key assertion output or source-backed snapshots for warmup, shadow scoring, novelty, and adaptive-fusion behavior | PASS if the targeted suites pass and the evidence confirms the deprecated flag surface is compatibility-only and no longer steers production behavior | Inspect `shared/embeddings.ts`, `mcp_server/context-server.ts`, `mcp_server/lib/eval/shadow-scoring.ts`, `mcp_server/lib/scoring/composite-scoring.ts`, and `mcp_server/lib/search/hybrid-search.ts` if any deprecated flag appears to change live execution |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts:43: * The damping factor `1/sqrt(M+1)` prevents large folders from
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts:80:    const dampingFactor = 1 / Math.sqrt(M + 1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts:82:    folderScores.set(folder, dampingFactor * scoreSum);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:13://   to edge-type priority orderings; computes traversal score as:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:53: * Intent-to-edge-type priority ordering.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:70:/** Fallback priority list when intent is unrecognized. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:73:/** Edge prior score tiers: 1st priority = 1.0, 2nd = 0.75, remaining = 0.5. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:130:  /** D3-002: Classified query intent. Used for intent-aware edge priority mapping. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:229: * Returns a normalized score in [0.5, 1.0] based on priority position.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:232: * Intent priority lists may include upper-case semantic labels (e.g. 'CORRECTION').
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:250:  const priority = INTENT_EDGE_PRIORITY[intent] ?? DEFAULT_EDGE_PRIORITY;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:253:  for (let i = 0; i < priority.length; i++) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:254:    const entry = priority[i];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:260:    // Alias expansion: check if this priority label maps to the relation
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:267:  // Relation not found in priority list — assign minimum tier
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:314:    (priority) => priority.toUpperCase() === normalizedEdgeType,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:387: * and dropping non-finite values to guard against DB query injection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/21--implement-and-remove-deprecated-features/229-lazy-loading-migration.md:2:title: "229 -- Lazy-loading migration and warmup compatibility"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/21--implement-and-remove-deprecated-features/229-lazy-loading-migration.md:3:description: "This scenario validates Lazy-loading migration and warmup compatibility for `229`. It focuses on confirming lazy embedding initialization is the only live startup path while the old warmup flags remain deprecated compatibility surfaces."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/21--implement-and-remove-deprecated-features/229-lazy-loading-migration.md:6:# 229 -- Lazy-loading migration and warmup compatibility
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/21--implement-and-remove-deprecated-features/229-lazy-loading-migration.md:10:This scenario validates Lazy-loading migration and warmup compatibility for `229`. It focuses on confirming lazy embedding initialization is the only live startup path while the old warmup flags remain deprecated compatibility surfaces.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/21--implement-and-remove-deprecated-features/229-lazy-loading-migration.md:18:- Objective: Confirm lazy embedding initialization is the only live startup path while the old warmup flags remain deprecated compatibility surfaces
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/21--implement-and-remove-deprecated-features/229-lazy-loading-migration.md:19:- Prompt: `Validate that embedding startup now stays on lazy initialization and that the legacy warmup flags only remain as deprecated compatibility surfaces. Run the targeted checks, capture the evidence that proves lazy startup is the shipped behavior, and return a concise pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/21--implement-and-remove-deprecated-features/229-lazy-loading-migration.md:20:- Expected signals: The targeted lazy-loading and context-server tests pass, `shouldEagerWarmup()` stays false by default, startup logs say lazy loading is enabled, and the deprecated warmup flags are only acknowledged in compatibility messaging
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/21--implement-and-remove-deprecated-features/229-lazy-loading-migration.md:21:- Pass/fail: PASS if the targeted checks confirm startup always follows the lazy path and the legacy warmup flags do not restore eager initialization behavior
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/21--implement-and-remove-deprecated-features/229-lazy-loading-migration.md:29:| 229 | Lazy-loading migration and warmup compatibility | Confirm lazy embedding initialization is the only live startup path while the old warmup flags remain deprecated compatibility surfaces | `Validate that embedding startup now stays on lazy initialization and that the legacy warmup flags only remain as deprecated compatibility surfaces. Run the targeted checks, capture the evidence that proves lazy startup is the shipped behavior, and return a concise pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server` 2) `npx vitest run tests/lazy-loading.vitest.ts tests/context-server.vitest.ts` 3) `sed -n '840,890p' context-server.ts` 4) `rg -n "shouldEagerWarmup|getLazyLoadingStats|preWarmModel|SPECKIT_EAGER_WARMUP|SPECKIT_LAZY_LOADING" lib/providers/embeddings.ts ../shared/embeddings.ts context-server.ts tests/lazy-loading.vitest.ts` | The targeted lazy-loading and context-server tests pass, `shouldEagerWarmup()` stays false by default, startup logs say lazy loading is enabled, and the deprecated warmup flags are only acknowledged in compatibility messaging | Vitest transcript plus the source excerpts showing the lazy startup branch and deprecated-flag references | PASS if the targeted checks confirm startup always follows the lazy path and the legacy warmup flags do not restore eager initialization behavior | Inspect `context-server.ts`, `lib/providers/embeddings.ts`, and `../shared/embeddings.ts`; confirm no test setup or shell environment is forcing legacy warmup behavior |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/21--implement-and-remove-deprecated-features/229-lazy-loading-migration.md:36:- Feature catalog: [21--implement-and-remove-deprecated-features/02-lazy-loading-migration-and-warmup-compatibility.md](../../feature_catalog/21--implement-and-remove-deprecated-features/02-lazy-loading-migration-and-warmup-compatibility.md)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:56:  'is_pinned',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:132:      is_pinned INTEGER DEFAULT 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/contracts/README.md:14:> Typed contracts for the retrieval pipeline that enforce end-to-end type safety. Defines trace stages, degraded-mode fallback handling and generic context envelopes for wrapping pipeline results with observability metadata.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:451: * community score capping (secondary-only).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:58:  is_pinned?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/043-priority-mixed-format/plan.md:8:Mixed priority format test.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/deterministic-extractor.ts:171:  // Silence unused variable warning while keeping the constant for documentation
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/223-runtime-config-contract.md:29:| 223 | Runtime Config Contract | Confirm the runtime loader consumes only the active Section 1 keys, validates and normalizes configured values, and leaves documentation-only sections non-binding | `Validate the runtime config contract for config.jsonc in a disposable copy of the file. Prove that Section 1 keys flow into the loaded runtime constants, invalid values warn and fall back or normalize safely, and deeper documentation-only sections do not become binding runtime controls through the core loader.` | 1) Copy `config/config.jsonc` into a disposable sandbox and set distinctive Section 1 overrides such as `maxResultPreview` and `timezoneOffsetHours`, while also flipping booleans in documentation-only sections like `semanticSearch.enabled` or `constitutionalTier.enabled`. 2) Load the runtime config through the script-side loader and capture the resulting `CONFIG` or `STATIC_CONFIG` values to confirm the Section 1 overrides are reflected in the exported runtime constants. 3) Change Section 1 values to invalid inputs such as `timezoneOffsetHours: 99` and a legacy `qualityAbortThreshold: 75`, reload the config, and capture the warning logs plus the normalized or defaulted runtime values. 4) Replace the sandbox file with malformed or unreadable JSONC, reload again, and confirm the loader logs a warning and falls back to defaults instead of throwing. 5) Compare the resulting runtime surface across runs and confirm the flipped documentation-only sections did not become newly bound core loader outputs or override the Section 1 contract. | valid Section 1 keys such as `maxResultPreview` and `timezoneOffsetHours` appear in the loaded runtime config; invalid numeric values fall back with warnings; legacy `qualityAbortThreshold` values on the `1..100` scale normalize into `0.0..1.0`; empty, missing, or invalid JSONC does not crash the loader; documentation-only sections remain descriptive and do not show up as newly bound core runtime controls | sandbox copies of `config.jsonc`, captured runtime config output for each load, warning logs for invalid or malformed config, and a short before or after comparison showing which keys actually changed | PASS if the loader only binds the active top-level workflow keys, safely validates or normalizes bad input, and treats the deeper JSONC sections as reference-only metadata | Inspect `scripts/core/config.ts` merge and validation flow, confirm the test run is loading the intended sandbox file, and verify any observed behavior change is not coming from a different runtime path outside the core config loader |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:150:  // Machine is slow, keeping the consolidation cycle non-blocking.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:544:    // Fail-closed: broken bookkeeping must not cause unbounded cycle runs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:546:    console.warn('[consolidation] cadence bookkeeping error:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/contracts/retrieval-trace.ts:64:/** Generic typed context envelope wrapping pipeline results with trace */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/contracts/retrieval-trace.ts:133: * Create a context envelope wrapping pipeline results.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/19--feature-flag-reference/125-hydra-roadmap-capability-flags.md:49:| 125 | Memory roadmap capability flags | Verify runtime roadmap resolvers use canonical `SPECKIT_MEMORY_*` keys first, remain distinct from live runtime flags, and keep shared-memory plus adaptive-ranking defaults off until explicitly enabled | `Validate memory roadmap flag resolution without changing live graph-channel defaults. Work locally in the system-spec-kit mcp_server package, capture the exact commands and outputs, and summarize the result in user language. Capture the evidence needed to prove First snapshot remains phase:"shared-rollout" with capabilities.graphUnified:true, capabilities.adaptiveRanking:false, and capabilities.sharedMemory:false even when SPECKIT_GRAPH_UNIFIED=false is set; second snapshot uses canonical SPECKIT_MEMORY_ROADMAP_PHASE=graph and SPECKIT_MEMORY_GRAPH_UNIFIED=false to report phase:"graph" with capabilities.graphUnified:false while capabilities.sharedMemory stays false; third snapshot uses SPECKIT_MEMORY_ADAPTIVE_RANKING=true and reports capabilities.adaptiveRanking:true; fourth snapshot uses SPECKIT_MEMORY_SHARED_MEMORY=true and reports capabilities.sharedMemory:true; fifth snapshot sets SPECKIT_MEMORY_SHARED_MEMORY=false plus SPECKIT_HYDRA_SHARED_MEMORY=true and still reports capabilities.sharedMemory:false because the canonical key wins. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server` 2) `SPECKIT_GRAPH_UNIFIED=false node -e "const { getMemoryRoadmapDefaults } = require('./dist/lib/config/capability-flags.js'); console.log(JSON.stringify(getMemoryRoadmapDefaults('manual-125-a')))"` 3) `SPECKIT_MEMORY_ROADMAP_PHASE=graph SPECKIT_MEMORY_GRAPH_UNIFIED=false node -e "const { getMemoryRoadmapDefaults } = require('./dist/lib/config/capability-flags.js'); console.log(JSON.stringify(getMemoryRoadmapDefaults('manual-125-b')))"` 4) `SPECKIT_MEMORY_ADAPTIVE_RANKING=true node -e "const { getMemoryRoadmapDefaults } = require('./dist/lib/config/capability-flags.js'); console.log(JSON.stringify(getMemoryRoadmapDefaults('manual-125-c')))"` 5) `SPECKIT_MEMORY_SHARED_MEMORY=true node -e "const { getMemoryRoadmapDefaults } = require('./dist/lib/config/capability-flags.js'); console.log(JSON.stringify(getMemoryRoadmapDefaults('manual-125-d')))"` 6) `SPECKIT_MEMORY_SHARED_MEMORY=false SPECKIT_HYDRA_SHARED_MEMORY=true node -e "const { getMemoryRoadmapDefaults } = require('./dist/lib/config/capability-flags.js'); console.log(JSON.stringify(getMemoryRoadmapDefaults('manual-125-e')))"` | First snapshot remains `phase:\"shared-rollout\"` with `capabilities.graphUnified:true`, `capabilities.adaptiveRanking:false`, and `capabilities.sharedMemory:false`; second snapshot reports `phase:\"graph\"` with `capabilities.graphUnified:false` while `capabilities.sharedMemory:false`; third snapshot reports `capabilities.adaptiveRanking:true`; fourth snapshot reports `capabilities.sharedMemory:true`; fifth snapshot confirms canonical precedence by keeping `capabilities.sharedMemory:false` | Five JSON snapshots from the dist build | PASS if the runtime `SPECKIT_GRAPH_UNIFIED` flag does not flip roadmap metadata, shared memory and adaptive ranking both stay off by default in roadmap snapshots, canonical env vars override legacy aliases, and explicit opt-in behavior stays correct | Inspect `capability-flags.ts`; verify dist build is fresh; confirm only the listed env vars are set in each run |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/validation/validation_rules.md:48:| `PRIORITY_TAGS`      | WARNING  | checklist.md  | P0/P1/P2 priority tags properly formatted      |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/validation/validation_rules.md:317:<!-- ANCHOR:priority-tags -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/validation/validation_rules.md:321:**Description:** Validates that checklist items use proper P0/P1/P2 priority tagging format.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/validation/validation_rules.md:354:Priority tags apply to items **until the next priority header or end of file**:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/validation/validation_rules.md:383:⚠️ **Warning (no priority context):**
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/validation/validation_rules.md:387:- [ ] Do something      ← No priority assigned
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/validation/validation_rules.md:388:- [ ] Do another thing  ← No priority assigned
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/validation/validation_rules.md:393:Add priority headers or inline tags to all checklist items:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/validation/validation_rules.md:400:<!-- /ANCHOR:priority-tags -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/validation/validation_rules.md:711:2. **Reduce scope:** Split complex specs into multiple smaller specs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/validation/validation_rules.md:1008:- [path_scoped_rules.md](../validation/path_scoped_rules.md) - Path scoping overview
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:423:function checkpointMetadataMatchesScope(rawMetadata: unknown, scope: ScopeContext): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:450:  scope: ScopeContext = {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:476:  scope: ScopeContext = {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:500:  scope: ScopeContext = {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:508:  scope: ScopeContext = {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1072:    scope: ScopeContext;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1244:        `[checkpoints] Skipping post-restore rebuild "${name}" because dependencies did not complete: ${missingDeps.join(', ')}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1328:    'is_pinned',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1443:          scope: normalizedScope,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1542:  scope: ScopeContext = {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1576:function getCheckpoint(nameOrId: string | number, scope: ScopeContext = {}): CheckpointEntry | null {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1599:  scope: ScopeContext = {},
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1718:            scope: normalizedScope,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1730:                scope: normalizedScope,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1773:                `[checkpoints] Skipping restore of memory ${memory.id}: identity "${memory.spec_folder}:${memory.file_path}:${String(memory.anchor_id ?? '')}" already exists as memory ${existingByPath.id}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1804:                  `[checkpoints] Skipping restore of memory ${memory.id}: id collision with existing identity "${existingById.spec_folder}:${existingById.file_path}:${String(existingById.anchor_id ?? '')}"`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1862:              scope: normalizedScope,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1922:function deleteCheckpoint(nameOrId: string | number, scope: ScopeContext = {}): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:343: * Cache warmup strategy:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:573: * Apply min-max normalization to RRF scores in a result array, mapping to [0,1].
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:97:| `storeCommunityAssignments` | community-detection.ts | Persists node-to-community mappings with INSERT OR REPLACE |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:139:| `community_assignments` | community-detection.ts | Persisted node-to-community mappings |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:10://   gates (density + size), community score capping (secondary-only).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/validation/five_checks.md:167:- "Using standard interface allows swapping implementations"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:502:          console.warn('[reconsolidation] Deprecate target not found, skipping edge insert');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:203:    console.warn('[embedding-expansion] Received empty embedding — skipping expansion');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:244:  private warmupHandle: ReturnType<typeof setTimeout> | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:245:  private warmupGeneration: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:253:    this.warmupHandle = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:254:    this.warmupGeneration = 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:421:   * P3-04/T312: Defer full startup warmup into batched row-ID syncs so process
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:440:      const warmupGeneration = ++this.warmupGeneration;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:442:        if (warmupGeneration !== this.warmupGeneration) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:448:          this.warmupHandle = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:455:          this.warmupHandle = setTimeout(processBatch, 0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:457:          this.warmupHandle = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:461:      this.warmupHandle = setTimeout(processBatch, 0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:465:      console.warn(`[bm25-index] Failed to schedule BM25 warmup: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:471:    this.warmupGeneration += 1;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:472:    if (this.warmupHandle) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:473:      clearTimeout(this.warmupHandle);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:474:      this.warmupHandle = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/normalization.ts:47:  is_pinned: number;           // SQLite boolean (0 | 1)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/normalization.ts:121: * This is the ONLY place where snake_case → camelCase mapping lives.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/normalization.ts:142:    isPinned: row.is_pinned === 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/normalization.ts:187:  if (memory.isPinned !== undefined) row.is_pinned = memory.isPinned ? 1 : 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/normalization.ts:232:  if (row.is_pinned !== undefined) mem.isPinned = row.is_pinned === 1;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/constitutional/README.md:755:Constitutional memories are the **highest priority** context in the Spec Kit Memory system:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/constitutional/README.md:759:- **3.0x search boost**: highest priority
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/validation/template_compliance_contract.md:105:Anchors use `<!-- ANCHOR:name -->` / `<!-- /ANCHOR:name -->` pairs wrapping their H2 section.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/validation/template_compliance_contract.md:281:- [path_scoped_rules.md](./path_scoped_rules.md) — Path scoping for validation rules
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/02-memory-health-auto-repair.md:41:| `mcp_server/handlers/memory-crud-health.ts` | Handler | Implements `memory_health`, confirmation gating, FTS rebuild, trigger-cache refresh, repair bookkeeping, and health response metadata |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/constitutional/gate-tool-routing.md:35:Route code search queries using this priority order:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:627: * @returns Response profile name or null if no mapping exists
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:636: * C138: Intent-to-MMR-lambda mapping.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:182: * @returns Record mapping channel name to item count.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:385:        console.warn(`[transaction-manager] Skipping pending recovery because DB file is missing: ${databasePath}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/validation/path_scoped_rules.md:22:| Scenario                | Without Scoping        | With Scoping                   |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:24: * Importance tier → quality score mapping.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:160: *   1. `quality_score` from the DB column (direct metric, highest priority).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:162: *   2. `importance_tier` → tier quality score mapping.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:179:  // -- 1. Quality score (DB column takes priority) --
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings/README.md:173:If a cloud provider fails during warmup or healthcheck (authentication or network issues), the system automatically degrades to HF local **before** indexing data, preventing dimension mixing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1112:        logger.warn(`Migration v23: Skipping row ${row.id} — canonicalization failed`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1126:    // P1-3 fix: Migrate session_state.spec_folder using old→new mapping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1220:        logger.info('Migration v25: CHECK constraint already correct, skipping table rebuild');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1801:  if (!column_names.includes('is_pinned')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1803:      database.exec(`ALTER TABLE memory_index ADD COLUMN is_pinned INTEGER DEFAULT 0`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1804:      console.warn('[vector-index] Migration: Added is_pinned column');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1809:      logDuplicateColumnMigrationSkip('is_pinned', error);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2172: * Migrate session_state.spec_folder values using the old→new mapping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2182:  // Build old→new mapping, keep only unambiguous 1:1 mappings
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2183:  const mapping = new Map<string, Set<string>>();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2185:    if (!mapping.has(u.oldSpecFolder)) mapping.set(u.oldSpecFolder, new Set());
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2186:    mapping.get(u.oldSpecFolder)!.add(u.canonical);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2199:    const targets = mapping.get(row.spec_folder);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2205:      logger.warn(`Migration v23: Ambiguous session_state mapping for "${row.spec_folder}". Skipping.`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2222:  const mapping = new Map<string, Set<string>>();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2224:    if (!mapping.has(update.oldSpecFolder)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2225:      mapping.set(update.oldSpecFolder, new Set());
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2227:    mapping.get(update.oldSpecFolder)!.add(update.canonical);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2242:    const targets = mapping.get(row.spec_folder);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2248:      logger.warn(`Migration v23: Ambiguous memory_history mapping for "${row.spec_folder}". Skipping.`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2318:      is_pinned INTEGER DEFAULT 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/07--evaluation/027-reporting-dashboard-eval-reporting-dashboard.md:20:- Expected signals: Trend/channel/summary data present in supported runtime formats; active eval DB remains selected; request limit trims sprint groups rather than raw runs; sprint grouping uses recency selection by `lastSeen` while report order stays chronological; chunk-backed rows aggregate to parent memory IDs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:281:  // Of truth for frontmatter stripping, handles CRLF via [\s\S]*? matching.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:71: * Rules (in priority order):
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:105: * 4. Suggest dropping the spec folder constraint when it was set
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:96: * Returns 0 for lists with fewer than 2 overlapping items.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:106:  // Find overlapping items
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/07--evaluation/026-ablation-studies-eval-run-ablation.md:29:| EX-026 | Ablation studies (eval_run_ablation) | Full plus focused channel-impact verification | `Run one full ablation plus one focused fts5 ablation with an intentionally mixed query-ID subset. Capture the evidence needed to prove baseline recall, per-channel deltas, focused fts5 verdict, requested versus resolved versus missing query IDs, and provenance/truncation status are all reported, that the active eval DB matches the remapped ground-truth parent IDs, and that any run returning fewer than recallK candidates because of token-budget truncation is flagged as investigation-only rather than treated as a clean benchmark. Return a concise user-facing pass/fail verdict with the main reason.` | `eval_run_ablation({ mode:"ablation", storeResults:true, includeFormattedReport:true })` -> `eval_run_ablation({ mode:"ablation", channels:["fts5"], groundTruthQueryIds:[1,99999], storeResults:true, includeFormattedReport:true })` -> `eval_reporting_dashboard({ format:"json", limit:10 })` | Baseline recall, per-channel deltas, focused fts5 verdict, requested/resolved/missing query-ID reporting, and provenance/truncation status are explicit | Full ablation report, focused fts5 report with query-ID warnings, and dashboard output | PASS if the runs are cleanly comparable or the output isolates missing-ID/provenance/truncation invalidation before any channel verdict is trusted | Validate ground-truth mapping against the active parent-memory DB; inspect missing-query-ID warnings and runtime logs for token-budget truncation if Recall@K collapses |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/debugging/universal_debugging_methodology.md:130:| Skipping to fix without understanding | Complete Phase 1-2 first |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/185-memory-search-command-routing.md:29:| 185 | /memory:search command routing | Verify `/memory:search` command routing logic covers no-args, retrieval, and analysis modes | `Validate /memory:search command routing across retrieval and analysis modes. Capture the evidence needed to prove No-args triggers interactive intent prompt; query text triggers retrieval mode with auto-detected intent and weighted anchors; analysis subcommands route to their respective tools. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Invoke `/memory:search` with no arguments and verify the interactive intent selection prompt appears (Add feature, Fix bug, Refactor, Security audit, Understand, Find spec, Find decision, Analysis tools) 2) Invoke `/memory:search "implement auth"` and verify retrieval mode activates with auto-detected `add_feature` intent and appropriate weight boosts (implementation 1.5x, architecture 1.3x, patterns 1.2x) 3) Invoke `/memory:search "auth bug" --intent:fix_bug` and verify the explicit intent override is respected 4) Invoke `/memory:search preflight specs/007-test T1` and verify `task_preflight()` is called 5) Invoke `/memory:search postflight specs/007-test T1` and verify `task_postflight()` is called 6) Invoke `/memory:search history specs/007-test` and verify `memory_get_learning_history()` is called 7) Invoke `/memory:search causal 42` and verify `memory_drift_why()` is called 8) Invoke `/memory:search ablation` and verify `eval_run_ablation()` is called 9) Invoke `/memory:search dashboard` and verify `eval_reporting_dashboard()` is called | No-args triggers interactive intent prompt; query text triggers retrieval mode with intent detection; analysis subcommands each route to the correct tool | Tool invocation logs for each subcommand; intent detection output for retrieval queries; interactive prompt display for no-args case | PASS: No-args prompts for intent, retrieval returns intent-weighted results, each analysis subcommand invokes its dedicated tool; FAIL: No-args proceeds without prompt, retrieval ignores intent, or an analysis subcommand routes to the wrong tool | Verify argument routing logic in Section 4 of search.md → Check intent detection keywords → Confirm analysis subcommand first-token matching → Inspect tool coverage matrix for correct tool-to-subcommand mapping |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings/factory.ts:324:      console.warn('[embeddings] VOYAGE_API_KEY appears to be a placeholder — skipping');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings/factory.ts:336:      console.warn('[embeddings] OPENAI_API_KEY appears to be a placeholder — skipping');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings/factory.ts:470:  if (options.warmup) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings/factory.ts:472:      await provider.warmup();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings/factory.ts:477:      console.warn(`[factory] Fallback warmup failed: ${getErrorMessage(fallbackWarmupError)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings/factory.ts:518:    if (options.warmup) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings/factory.ts:520:      const success = await provider.warmup();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings/factory.ts:528:            `warmup failed for ${providerName}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md:39:| `mcp_server/lib/storage/checkpoints.ts` | Checkpoint storage: gzip decompression, schema validation, merge/clear-existing logic, transaction wrapping and restore maintenance barrier state |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:63: * Default tier-to-channel mapping:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:58:/** Column order priority for assembling display text sent to cross-encoder. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:573: * Checks all score fields in priority order to avoid silently
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts:47:  tier: ['importance', 'priority'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/187-quick-search-memory-quick-search.md:3:description: "This scenario validates the memory_quick_search tool for `187`. It focuses on Verify simplified query-only retrieval returns results with optional spec-folder scoping and governed retrieval boundaries."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/187-quick-search-memory-quick-search.md:10:This scenario validates the memory_quick_search tool for `187`. It focuses on Verify simplified query-only retrieval returns results with optional spec-folder scoping and governed retrieval boundaries.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/187-quick-search-memory-quick-search.md:18:- Objective: Verify `memory_quick_search` returns relevant results for a query string, respects optional `specFolder` scoping, honors governed retrieval boundaries (`tenantId`, `userId`, `agentId`, `sharedSpaceId`), and respects `limit` parameter
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/187-quick-search-memory-quick-search.md:19:- Prompt: `Validate memory_quick_search via /memory:search retrieval mode. Capture the evidence needed to prove Query-only retrieval returns results; specFolder scoping narrows results; limit parameter is respected; governed boundaries filter correctly. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/187-quick-search-memory-quick-search.md:20:- Expected signals: Query-only retrieval returns results; specFolder scoping narrows results to the specified folder; limit parameter caps the result count; governed retrieval boundaries filter results appropriately
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/01--retrieval/187-quick-search-memory-quick-search.md:29:| 187 | Quick search (memory_quick_search) | Verify `memory_quick_search` simplified query-only retrieval | `Validate memory_quick_search via /memory:search retrieval mode. Capture the evidence needed to prove Query-only retrieval returns results; specFolder scoping narrows results; limit parameter is respected; governed boundaries filter correctly. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Call `memory_quick_search({ query: "authentication" })` with no optional parameters and verify results are returned 2) Call `memory_quick_search({ query: "authentication", specFolder: "specs/<known-spec>" })` and verify results are scoped to the specified folder 3) Call `memory_quick_search({ query: "authentication", limit: 3 })` and verify at most 3 results are returned 4) Call `memory_quick_search({ query: "authentication", tenantId: "tenant-1" })` and verify governed retrieval boundary is respected 5) Compare `memory_quick_search` results with `memory_context` results for the same query to confirm quick_search provides a simplified fast-path alternative | Query-only retrieval returns results; specFolder scoping narrows results to the specified folder; limit parameter caps the result count; governed retrieval boundaries filter results appropriately | Tool outputs for each call showing result count, specFolder scoping, limit adherence, and tenant filtering | PASS: Quick search returns relevant results, specFolder narrows scope, limit is respected, governed boundaries filter; FAIL: Quick search returns no results for a known query, specFolder is ignored, limit is exceeded, or governed boundaries do not filter | Verify `memory_quick_search` tool is listed in search.md allowed-tools → Check L2 layer routing → Confirm query parameter is required → Inspect optional parameter handling for specFolder, limit, tenantId, userId, agentId, sharedSpaceId |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:31: * - `priorityCondition` — "Prioritize when: <condition>" phrase for LLM consumption.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:37:  priorityCondition: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:242:      // Build priority condition
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:244:      let priorityCondition: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:248:        priorityCondition = `Prioritize when: ${hint}`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:250:        priorityCondition = `Prioritize when: ${cap(conditionClause, MAX_DIRECTIVE_COMPONENT_CHARS)}`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:252:        priorityCondition = `Prioritize when: constitutional rule is active for current task`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:257:        priorityCondition,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:267:    const priorityCondition = `Prioritize when: task context aligns with "${cap(source, 80)}"`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:272:      priorityCondition,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:289: *   "<surfaceCondition> | <priorityCondition>"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:292: * clauses provide both a mandatory-surface signal and a priority-boosting hint
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:299:  return `${directive.surfaceCondition} | ${directive.priorityCondition}`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:60: * separate implementations with different fallback orders and clamping. This shared
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings/providers/hf-local.ts:287:  async warmup(): Promise<boolean> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings/providers/hf-local.ts:290:      await this.embedQuery('test warmup query');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:340:| `progressive-disclosure.ts` | -     | TypeScript | Supports progressive-disclosure result paging and response shaping |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:513:**Spec Folder Scoping**:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:580:| **Algorithm** | TF-IDF sentence scoring with markdown stripping and tokenization |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:49:| `stage4-filter.ts` | Stage 4: Filter + Annotate. Removes results below minimum memory state priority, enforces per-tier limits, runs TRM evidence-gap detection and attaches annotation metadata. Enforces the score immutability invariant at runtime. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:96:- Memory state priority filtering (HOT > WARM > COLD > DORMANT > ARCHIVED).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:41:/** Default tier-to-budget mapping when dynamic allocation is enabled.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/README.md:69:| `path-security.ts` | Re-exports path validation and regex escaping from `@spec-kit/shared/utils/path-security` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings/providers/README.md:38:- `warmup()` / `healthCheck()` -- connectivity and readiness checks
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/02-checkpoint-listing-checkpointlist.md:29:| `mcp_server/lib/storage/checkpoints.ts` | Checkpoint storage: listing query, metadata projection, limit clamping |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/09--evaluation-and-measurement/082-evaluation-and-housekeeping-fixes.md:2:title: "082 -- Evaluation and housekeeping fixes"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/09--evaluation-and-measurement/082-evaluation-and-housekeeping-fixes.md:3:description: "This scenario validates Evaluation and housekeeping fixes for `082`. It focuses on Confirm eval/housekeeping reliability."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/09--evaluation-and-measurement/082-evaluation-and-housekeeping-fixes.md:6:# 082 -- Evaluation and housekeeping fixes
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/09--evaluation-and-measurement/082-evaluation-and-housekeeping-fixes.md:10:This scenario validates Evaluation and housekeeping fixes for `082`. It focuses on Confirm eval/housekeeping reliability.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/09--evaluation-and-measurement/082-evaluation-and-housekeeping-fixes.md:18:- Objective: Confirm eval/housekeeping reliability
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/09--evaluation-and-measurement/082-evaluation-and-housekeeping-fixes.md:19:- Prompt: `Validate evaluation and housekeeping fixes. Capture the evidence needed to prove Run-IDs are unique across restarts; upserts are idempotent; boundary guards prevent out-of-range values; housekeeping completes cleanly. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/09--evaluation-and-measurement/082-evaluation-and-housekeeping-fixes.md:20:- Expected signals: Run-IDs are unique across restarts; upserts are idempotent; boundary guards prevent out-of-range values; housekeeping completes cleanly
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/09--evaluation-and-measurement/082-evaluation-and-housekeeping-fixes.md:29:| 082 | Evaluation and housekeeping fixes | Confirm eval/housekeeping reliability | `Validate evaluation and housekeeping fixes. Capture the evidence needed to prove Run-IDs are unique across restarts; upserts are idempotent; boundary guards prevent out-of-range values; housekeeping completes cleanly. Return a concise user-facing pass/fail verdict with the main reason.` | 1) restart+eval runs 2) verify run-id and upsert behavior 3) inspect boundary guards | Run-IDs are unique across restarts; upserts are idempotent; boundary guards prevent out-of-range values; housekeeping completes cleanly | Eval run output with run-ID + upsert verification + boundary guard test evidence | PASS if run-IDs are unique, upserts produce consistent state, and boundary guards reject invalid values | Inspect run-ID generation logic; verify upsert idempotency; check boundary guard threshold values |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/09--evaluation-and-measurement/082-evaluation-and-housekeeping-fixes.md:36:- Feature catalog: [09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md](../../feature_catalog/09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/09--evaluation-and-measurement/082-evaluation-and-housekeeping-fixes.md:45:- Feature file path: `09--evaluation-and-measurement/082-evaluation-and-housekeeping-fixes.md`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings/providers/voyage.ts:293:  async warmup(): Promise<boolean> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings/providers/voyage.ts:297:        this.embedQuery('test warmup query'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings/providers/voyage.ts:300:            const timeoutError: ErrorWithStatus = new Error(`Voyage warmup timed out after ${this.timeout}ms`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/201-warm-server-daemon-mode.md:19:- Prompt: `Validate the current warm server / daemon mode status. Capture the evidence needed to prove HTTP daemon transport is still deferred; the runtime still starts through stdio transport; eager warmup remains disabled; and no persistent warm-server path is active in the current operator workflow. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/201-warm-server-daemon-mode.md:21:- Pass/fail: PASS if current behavior is clearly stdio-only and daemon mode remains deferred; FAIL if an active HTTP daemon path exists, eager warmup is enabled, or docs/code disagree about current transport
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/201-warm-server-daemon-mode.md:29:| 201 | Warm server / daemon mode | Verify warm daemon mode is still deferred and the server continues to operate as a per-invocation stdio process | `Validate the current warm server / daemon mode status. Capture the evidence needed to prove HTTP daemon transport is still deferred; the runtime still starts through stdio transport; eager warmup remains disabled; and no persistent warm-server path is active in the current operator workflow. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Review the documented current reality for daemon mode and note the deferred status 2) Start the server through the standard runtime path and capture the transport/startup behavior 3) Confirm the active flow is stdio-based rather than an HTTP listener or long-lived daemon endpoint 4) Inspect the warmup behavior and verify eager warmup remains disabled 5) End the session and confirm the process exits normally instead of remaining as a persistent background service | HTTP daemon transport is documented as deferred; current startup path is stdio; `shouldEagerWarmup()` remains false in non-daemon mode; runtime behavior shows normal process startup/shutdown per invocation rather than a persistent background server | Startup transcript + transport evidence + warmup flag/code evidence + shutdown observation | PASS if current behavior is clearly stdio-only and daemon mode remains deferred; FAIL if an active HTTP daemon path exists, eager warmup is enabled, or docs/code disagree about current transport | Inspect `context-server.ts` transport bootstrap; review `shouldEagerWarmup()` behavior in embedding provider setup; check for undocumented daemon flags, endpoints, or bootstrap branches in CLI/server entrypoints |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/config/environment_variables.md:250:| `SPECKIT_GRAPH_CALIBRATION_PROFILE` | ON | R-011 | Graph calibration with ablation harness and community capping |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/config/environment_variables.md:352:| `SPECKIT_EAGER_WARMUP` (deprecated — compatibility only) | OFF | S9 | Eager model warmup at server startup |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:19://     - final contains only rows at or above config.minState priority
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:24:// 1. memoryState priority filter — rows below minState are removed
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:53: * Memory state priority map. Higher number = higher priority.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:76:/** Fallback priority for unknown/missing memoryState values.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:129: * Remove rows whose `memoryState` falls below `minState` priority and,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:156:  // -- 3b. State-priority filter --
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:159:    const priority = STATE_PRIORITY[state] ?? UNKNOWN_STATE_PRIORITY;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:160:    return priority >= minPriority;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings/providers/openai.ts:263:  async warmup(): Promise<boolean> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings/providers/openai.ts:267:        this.embedQuery('test warmup query'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/shared/embeddings/providers/openai.ts:270:            const timeoutError: ErrorWithStatus = new Error(`OpenAI warmup timed out after ${this.timeout}ms`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/epistemic_vectors.md:413:**Mapping to Uncertainty Factors:** The `uncertaintyScore` (0-100) returned by these tools is derived from the four-factor weighted model (§2) scaled to integer range: `uncertaintyScore = round(weightedAverage × 100)`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/08-constitutional-memory-end-to-end-lifecycle.md:19:In practice, this is the highest-priority memory path in the system. Constitutional memories are authored as compact global rules, indexed as first-class memory rows, exempt from normal decay behavior, and then retrieved through two separate runtime paths: search-pipeline injection for regular memory retrieval and auto-surface hooks for tool-dispatch/context-assembly flows.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/08-constitutional-memory-end-to-end-lifecycle.md:35:- **Retrieval-directive enrichment.** The hook path enriches constitutional results with `retrieval_directive` metadata before returning them. `retrieval-directives.ts` derives deterministic, synchronous instruction strings from the rule content, formatted as `"Always surface when: ... | Prioritize when: ..."`. The source is explicit that this is a metadata-only enrichment pass: it does not filter, reorder, or rescore memories. When the file can be read safely, directives are content-derived; when file reads fail, the system falls back to a title-based directive rather than dropping the memory from the surfaced set.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:205:         WHEN m.is_pinned = 1 THEN m.importance_weight
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:153: * Query keyword/pattern mapping for artifact class detection from
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:204: * Intent-based fallback mapping for artifact class detection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/07-automatic-archival-subsystem.md:18:The archival manager (`lib/cognitive/archival-manager.ts`) is a background job that identifies dormant memories and transitions them to archived status. It uses SQL only as a broad pre-filter to fetch unarchived, non-protected, non-pinned candidates from `memory_index`; the FSRS-based tier classifier remains the authoritative decision maker for whether a candidate should actually be archived. When archival happens, the job sets `is_archived = 1` and removes BM25 index entries plus vector rows (`vec_memories`) to reclaim storage, but it does not demote or otherwise modify `importance_tier`. Archived memories remain in the database for SQL-based recovery but are excluded from default search result sets.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/15-evaluation-api-surface.md:25:The surface also exposes `loadGroundTruth` and `initEvalDb` directly from their underlying modules. Together, these exports define the current evaluation API contract: ablation execution and reporting, BM25 baseline execution and metrics capture, ground-truth dataset loading, and evaluation database bootstrap. Because the file adds no wrappers, validation, or transformation logic of its own, its runtime behavior is purely pass-through and its maintenance burden is intentionally concentrated on keeping the public export list aligned with the internal evaluation modules.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:441:- Prototyping that will be discarded
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:454:Skipping documentation:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:711:- Create spec folder over skipping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/memory_system.md:461:Real-time file watching is optional rather than always-on. By default, use `memory_save()` or `memory_index_scan()` to index new or modified files. Enable `SPECKIT_FILE_WATCHER=true` when you want automatic markdown re-indexing after startup.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/memory_system.md:561:The hash priority: `content_hash` > `id:anchorId:file_path` > JSON of `{anchor, path, title}`. Truncated to 16 hex chars for storage efficiency.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/memory_system.md:611:│  Pinned memories (is_pinned=1) → always HOT (R = 1.0)          │
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/memory_system.md:640:The richer `classifyTier()` function wraps this with half-life support, pinned-memory handling, and constitutional/critical exemptions. It computes retrievability using the FSRS formula (see Section 6, Model B) with an effective stability derived from the memory's type-specific half-life.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/memory_system.md:673:| Pinned (`is_pinned=1`) | Always classified as HOT regardless of R |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/07-learning-history-memorygetlearninghistory.md:24:Handler safety around the backing table is tighter now. Schema initialization is tracked per database instance with `WeakSet<Database>` instead of a process-global boolean, so swapping to a fresh DB connection still creates the `session_learning` table and index when needed. Score validation also rejects `NaN` via `Number.isFinite(...)`, closing the old loophole where `typeof NaN === 'number'` let malformed learning scores pass validation.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/07-learning-history-memorygetlearninghistory.md:26:The runtime tool schema labels `memory_get_learning_history` as `[L7:Maintenance]`, even though this catalog groups it under Analysis. Treat the catalog placement as a documentation grouping rather than the handler's runtime layer classification.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/embedding_resilience.md:77:// Embedding provider priority (factory.ts)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/embedding_resilience.md:83:  priority: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/embedding_resilience.md:92:    priority: 1
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/memory/embedding_resilience.md:99:    priority: 2
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/14-cross-ai-validation-fixes.md:12:Three different AI reviewers independently checked the codebase and found 14 issues that the original review missed. This is like getting a second and third opinion from different doctors: each one catches things the others overlooked. The fixes addressed problems ranging from tests that secretly passed when they should have failed to errors that were silently swallowed instead of reported.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/nodes/phase-system.md:37:## Phase Count Mapping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/template_guide.md:283:priority: P1
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/template_guide.md:859:### Mistake 5: Skipping Cross-References
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/template_guide.md:951:- **Keeping related artifacts together** under a parent spec
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/205-7-layer-tool-architecture-metadata.md:20:- Expected signals: L1-L7 metadata includes budgets/priorities/guidance/tool membership; task-type mappings remain available for recommendations; runtime dispatch is still name-based and fans into the existing dispatcher modules; recommended-layer metadata is advisory rather than a routing prerequisite
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/205-7-layer-tool-architecture-metadata.md:29:| 205 | 7-layer tool architecture metadata | Verify the 7-layer model supplies advisory budgets and layer recommendations while runtime dispatch still routes tools by name through the existing dispatcher modules | `Validate the 7-layer tool architecture metadata. Capture the evidence needed to prove the layer definitions module enumerates L1-L7 budgets, priorities, use-case guidance, and tool memberships; layer IDs still map to task types for recommendation metadata; runtime dispatch remains a name-based hop rather than a seven-layer router; and recommended layer hints surface without changing the underlying dispatch path. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Review the layer-definitions module and confirm all seven layers expose token budgets, priorities, guidance, and tool membership metadata 2) Verify layer IDs still map to task-type recommendation hints 3) Trace a representative tool invocation through the runtime entrypoint and confirm dispatch occurs by tool name into the existing dispatcher modules 4) Exercise or inspect one response path that surfaces recommended-layer metadata 5) Confirm that changing or reading layer metadata does not alter the fundamental name-based dispatch hop | L1-L7 metadata includes budgets/priorities/guidance/tool membership; task-type mappings remain available for recommendations; runtime dispatch is still name-based and fans into the existing dispatcher modules; recommended-layer metadata is advisory rather than a routing prerequisite | Layer-definition snapshot + dispatch trace + recommended-layer output example + comparison showing runtime path remains name-based | PASS if the layer model behaves as governance metadata and dispatch remains name-based; FAIL if runtime behavior depends on a missing seven-layer router or if metadata/recommendation claims do not match the actual dispatch implementation | Inspect `layer-definitions.ts` completeness; verify `context-server.ts` dispatch entrypoint and budget injection; review `tools/index.ts` fan-out modules; confirm handler metadata does not masquerade as an execution router |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md:22:The reporting dashboard aggregates per-sprint metric summaries (mean, min, max, latest and count) and per-channel performance views (hit count, average latency and query count) from the evaluation database. Trend analysis compares consecutive runs to detect regressions. Sprint labels are inferred from metadata JSON. A `isHigherBetter()` helper correctly interprets trend direction for different metric types. The dashboard now calls `getEvalDb()` before falling back to `initEvalDb()`, which preserves an already-selected non-default or test eval DB instead of silently switching back to the default one. Its request `limit` is the number of sprint groups kept after grouping, not the number of raw eval runs fetched. Both the ablation runner and the dashboard are exposed as new MCP tools: `eval_run_ablation` and `eval_reporting_dashboard`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/241-session-extraction-and-enrichment.md:16:Operators validate the extractor-layer contract through the loader smoke test plus the targeted enrichment suites that cover file shaping, phase classification, and description-quality upgrades.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/worked_examples.md:45:Fix a CSS alignment issue affecting button positioning on mobile viewports. Estimated scope: ~50 lines of code.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/worked_examples.md:101:Add a user notification system with toast messages, persistence, and dismissal functionality. Estimated scope: ~300 lines of code.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/workflows/worked_examples.md:157:Migrate from REST API to GraphQL for improved data fetching efficiency. Estimated scope: ~800 lines of code with high risk.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/01-evaluation-database-and-schema.md:18:A separate SQLite database (`speckit-eval.db`) stores retrieval quality data in five tables: `eval_queries`, `eval_channel_results`, `eval_final_results`, `eval_ground_truth` and `eval_metric_snapshots`. Keeping evaluation data in its own database is a deliberate security decision. The main search database should never carry evaluation artifacts that could leak into production results.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/233-completion-verification-workflow.md:29:| 233 | Completion Verification Workflow | Confirm advisory handling, COMPLETE status, and evidence-aware blocking for `check-completion.sh` | `Validate the completion verification workflow across Level 1 advisory cases, compliant Level 3 checklists, and degraded evidence cases. Capture the evidence needed to prove missing checklist files do not hard-fail lightweight specs, compliant checklists return COMPLETE, and checked P0/P1 items without evidence are blocked. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `bash .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh .opencode/skill/system-spec-kit/scripts/test-fixtures/062-template-compliant-level1` 2) `bash .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh .opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3 --json` 3) `TMP_DIR="$(mktemp -d /tmp/speckit-completion-XXXXXX)"` 4) `cp -R .opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3 "$TMP_DIR/level3-missing-evidence"` 5) `perl -0pi -e 's/ \\[EVIDENCE:[^\\n]+\\]//' "$TMP_DIR/level3-missing-evidence/checklist.md"` 6) `bash .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh "$TMP_DIR/level3-missing-evidence" --json || true` 7) `bash .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh "$TMP_DIR/level3-missing-evidence" --strict || true` | Level 1 fixture returns advisory exit 0; compliant Level 3 fixture reports COMPLETE; degraded fixture reports blocking status such as EVIDENCE_MISSING or another non-pass status with non-zero exit | Command transcript, JSON output for the compliant and degraded runs, and the modified checklist diff in the temp fixture | PASS if the lightweight fixture does not hard-fail, the compliant fixture reports COMPLETE, and the degraded fixture blocks completion with a non-zero exit and explicit reason | Inspect `.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh`, especially checklist parsing, inherited priority logic, and evidence marker detection |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/071-performance-improvements.md:19:- Prompt: `Verify performance improvements (Sprint 8). Capture the evidence needed to prove optimized code paths are active (not bypassed); tiered fallback collects fused candidates before a single enrichment pass; truncateToBudget() caches per-result token estimates instead of re-serializing each row; ENABLE_BM25 is opt-in while FTS5 remains the default lexical engine; BM25 warmup uses incremental syncChangedRows() maintenance instead of a blocking full rebuild; and heavy queries complete within acceptable time. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/071-performance-improvements.md:20:- Expected signals: Optimized code paths are active (not bypassed); fallback enrichment is single-pass; token estimation is cached per result; BM25 is opt-in with FTS5 default; BM25 warmup uses incremental maintenance; heavy queries complete within acceptable time; no performance regressions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/071-performance-improvements.md:21:- Pass/fail: PASS if optimized paths are active and the fallback split, token cache, BM25 opt-in/default behavior, and incremental warmup are all visible in code/runtime evidence without regressions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/071-performance-improvements.md:29:| 071 | Performance improvements | Confirm key perf remediations active | `Verify performance improvements (Sprint 8). Capture the evidence needed to prove optimized code paths are active (not bypassed); heavy queries complete within acceptable time; no performance regressions. Include fallback split, token estimate caching, and BM25 opt-in maintenance evidence.` | 1) Inspect `hybrid-search.ts` and confirm `executeFallbackPlan()` collects fused tier outputs before `searchWithFallbackTiered()` calls `enrichFusedResults()` once on the final merged set 2) Inspect `truncateToBudget()` and confirm it caches token estimates in a `Map` keyed by canonical result id and uses field-aware `estimateResultTokens()` instead of whole-object serialization 3) Inspect `bm25-index.ts` and confirm `isBm25Enabled()` returns false unless `ENABLE_BM25` is explicitly set to an allowed truthy value 4) Confirm `rebuildFromDatabase()` schedules batched warmup through `syncChangedRows()` instead of performing a synchronous full rebuild 5) Run or review a representative heavy retrieval path and capture timing notes for the post-change code path | Optimized code paths are active; fallback enrichment is single-pass; token estimation is cached per result; BM25 stays disabled by default unless explicitly enabled; batched `syncChangedRows()` warmup replaces blocking rebuilds; heavy queries complete within acceptable time; no regressions | Code inspection evidence from `hybrid-search.ts` and `bm25-index.ts`, plus timing notes for a representative heavy retrieval path | PASS if optimized paths are active and evidence shows the fallback split, token cache, BM25 opt-in posture, and incremental warmup without regressions | Profile the heavy retrieval path; check whether enrichment helpers are re-entered per tier; inspect token-budget estimation for cache misses; verify BM25 enablement and warmup scheduling behavior |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/15-module-boundary-map.md:3:description: "MODULE_MAP.md documents internal module ownership, dependency directions, feature catalog mapping, and canonical locations for all 28 lib/ subdirectories."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/15-module-boundary-map.md:29:3. **Feature Catalog Mapping** -- cross-reference between lib/ directories and the 19 feature catalog categories
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/09--evaluation-and-measurement/007-observer-effect-mitigation-d4.md:29:| 007 | Observer effect mitigation (D4) | Confirm non-blocking logging failures | `Check observer effect mitigation (D4). Capture the evidence needed to prove Search returns normal results even when eval logging throws; no latency spike from logging failure. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Induce eval logging failure 2) Run search 3) Confirm search unaffected | Search returns normal results even when eval logging throws; no latency spike from logging failure | Search output during induced logging failure + timing comparison with/without failure | PASS: Search completes successfully and returns expected results despite logging failure; FAIL: Search fails or blocks on logging error | Verify observer pattern is non-blocking → Check try/catch wrapping on eval logger → Inspect async error handling |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/level_specifications.md:131:- Add loading spinner to form submission
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/03--discovery/02-system-statistics-memorystats.md:26:Embedding-status totals now treat `partial` as a first-class state instead of silently dropping it. `get_status_counts()` initializes and returns a `partial` bucket, and `get_stats()` includes that bucket in the headline total. That keeps `memory_stats` aligned with chunked and partially indexed rows that already exist elsewhere in the vector-index state model.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/03--discovery/02-system-statistics-memorystats.md:36:| `mcp_server/handlers/memory-crud-stats.ts` | Handler validation, aggregate queries, folder ranking, and response shaping |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/01-causal-edge-creation-memorycausallink.md:12:This lets you draw a line between two memories to show they are related, like connecting pins on a corkboard with string. You can say one memory caused another, replaced another or contradicts another. These connections help the search system understand how ideas relate to each other and surface better results when you are tracing the history of a decision.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/053-validation-signals-as-retrieval-metadata-s3.md:29:| 053 | Validation signals as retrieval metadata (S3) | Confirm bounded multiplier | `Validate S3 retrieval metadata weighting. Capture the evidence needed to prove Validation signal multiplier bounded to [0.8, 1.2]; highly validated docs score higher; zero-validation docs use 1.0 multiplier. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Prepare docs with varied validations 2) run stage-2 3) verify 0.8-1.2 bounds | Validation signal multiplier bounded to [0.8, 1.2]; highly validated docs score higher; zero-validation docs use 1.0 multiplier | Stage-2 output with multiplier values + bounds verification + zero-validation behavior | PASS: All multipliers in [0.8, 1.2]; positive validations increase multiplier; zero validations = 1.0; FAIL: Multiplier out of bounds or zero-validation not neutral | Verify multiplier formula → Check bounds clamping → Inspect validation count resolution |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/03-observer-effect-mitigation.md:12:Measuring performance can sometimes slow down the thing you are measuring, like how stepping on a scale while running would trip you up. This feature makes sure that all the quality-checking work happens quietly in the background. If the measurement process breaks, your searches keep running at full speed without noticing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/28-spec-folder-detection-and-description.md:25:1. `folder-detector.ts` resolves spec folders through a ranked priority chain rather than a single heuristic. It first honors an explicit CLI argument, then a structured-data `SPEC_FOLDER` value, then recent session-learning rows from SQLite, then git-status evidence, current-working-directory inference, session-activity signals, and finally a full auto-detect ranking across available spec folders.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/28-spec-folder-detection-and-description.md:45:| `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts` | Detection/orchestration | Multi-priority spec-folder resolution, candidate ranking, low-confidence handling, and explicit-path recovery |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/level_selection_guide.md:85:<!-- ANCHOR:level-mapping -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/references/templates/level_selection_guide.md:108:<!-- /ANCHOR:level-mapping -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md:36:| `mcp_server/handlers/memory-crud-health.ts` | Handler validation, diagnostics, alias triage, repair flow, and response shaping |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/06--analysis/03-causal-edge-deletion-memorycausalunlink.md:12:This removes a connection between two memories. If you delete a memory entirely, all its connections are cleaned up automatically. You only need this tool when you want to remove a specific connection while keeping both memories intact, like cutting one thread on a corkboard without taking down the pins.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/03--discovery/01-memory-browser-memorylist.md:34:| `mcp_server/handlers/memory-crud-list.ts` | Handler implementation, validation, pagination, and response shaping |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md:2:title: "Evaluation and housekeeping fixes"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md:6:# Evaluation and housekeeping fixes
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md:12:These are six small but important fixes for the testing and bookkeeping systems. They address issues like counters that reset when the system restarts, clean-up routines that did not run properly and safety guards for unexpected input. Think of it as tightening loose bolts: none were causing a breakdown yet, but leaving them loose would eventually cause trouble.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md:58:- Source feature title: Evaluation and housekeeping fixes
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/26-core-workflow-infrastructure.md:3:description: "Shared workflow modules that load configuration, gate indexing, score memory quality, build titles and topics, edit frontmatter, review post-save output, and persist indexed memories."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/26-core-workflow-infrastructure.md:33:`topic-extractor.ts`, `title-builder.ts`, and `frontmatter-editor.ts` supply the main content-shaping helpers. Topic extraction prefers summary text plus decision titles and rationales, intentionally excludes spec-folder path fragments, and uses aggressive stopword filtering with bigram extraction. Title building normalizes and truncates memory titles, converts slugs into readable titles without breaking date-like hyphens, appends dashboard suffixes like `[spec/file]`, and can extract a normalized spec title from `spec.md`. Frontmatter editing injects `quality_score`, `quality_flags`, and `spec_folder_health`, renders YAML trigger-phrase blocks safely, and guarantees minimum trigger phrases and semantic topics using filtered folder and file tokens with conservative fallback values.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation/11-shared-memory-end-to-end-architecture.md:29:| Enable | `shared_memory_enable` is dispatched from `mcp_server/tools/lifecycle-tools.ts` and validated by `tool-input-schemas.ts` as an empty-input tool. `handleSharedMemoryEnable()` ensures the shared-collaboration schema exists, persists `config.shared_memory_enabled = 'true'`, and creates `mcp_server/shared-spaces/README.md` if missing. Runtime enablement is resolved by `isSharedMemoryEnabled()` with priority order: explicit env disable, explicit env enable, then DB config. Default is OFF until one of those enables it. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/04--maintenance/014-workspace-scanning-and-indexing-memory-index-scan.md:19:- Prompt: `Run the incremental scan flow and the targeted atomic lease checks for memory_index_scan. Capture the evidence needed to prove scan summary and updated index state, that spec documents remain indexed in warn-only quality mode, and that scan leases reserve scan_started_at atomically, reject overlapping fresh scans, expire stale crashed-scan leases, and only move to last_index_scan on completion. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/04--maintenance/014-workspace-scanning-and-indexing-memory-index-scan.md:31:| EX-014 | Workspace scanning and indexing (memory_index_scan) | Overlapping fresh scans are rejected with an active-lease wait time | `Run the targeted active-lease rejection validation. Capture the evidence needed to prove a second fresh memory_index_scan attempt is rejected while the first lease is still active, with a positive wait time rather than a second reservation. Return a concise user-facing pass/fail verdict with the main reason.` | `cd .opencode/skill/system-spec-kit/mcp_server` -> `npm test -- --run tests/db-state.vitest.ts -t "acquires scan lease once and rejects a concurrent fresh lease"` | Second lease attempt is rejected with `reason: 'lease_active'` and a positive wait time | Targeted test transcript showing the second attempt failed for `lease_active` | PASS if the targeted test passes and the rejection path still reports `reason: 'lease_active'` with `waitSeconds > 0` | Inspect `core/db-state.ts` lease-activity branch and `handlers/memory-index.ts` E429 details if concurrent scans start slipping through |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/13-constitutional-memory-manager-command.md:52:| `mcp_server/tests/full-spec-doc-indexing.vitest.ts` | Constitutional file discovery, document typing, and indexing eligibility |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/07-bm25-only-baseline.md:20:If BM25 had been competitive, the entire multi-channel approach would be questioned. Instead, the gap confirmed that hybrid retrieval adds real value over keyword search. The contingency decision to proceed with the full program was based on this measurement. No opinions, no intuitions, just a number. The in-memory BM25 channel (distinct from FTS5) now runs only when `ENABLE_BM25` is explicitly enabled; default runtime behavior leaves FTS5 as the lexical baseline. Reproducing a true in-memory BM25-only comparison therefore requires opting in to the BM25 flag first, while the FTS5-only lexical baseline can still run with the default configuration.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/02-architecture-boundary-enforcement.md:20:`check-architecture-boundaries.ts` enforces both rules as part of `npm run check`. GAP A walks all `.ts` files in `shared/`, extracts module specifiers (skipping block and line comments), and flags any import matching relative paths to `mcp_server/` or `scripts/` at any depth, or package-form `@spec-kit/mcp-server/` or `@spec-kit/scripts/`. This is an absolute prohibition with no allowlist.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/05-memory-summary-search-channel.md:26:The summary channel is integrated as an additional Stage 1 retrieval channel alongside hybrid, vector and multi-concept paths. Stage 1 adapts summary hits into full `PipelineRow` candidates by hydrating `memory_index` rows, assigning `similarity` / `score`, then merging and deduplicating by memory ID with baseline candidates taking priority.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:3:description: "Feature flag reference for the Spec Kit Memory search pipeline controls, rollout gates, and retrieval-shaping toggles."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:61:| `SPECKIT_EAGER_WARMUP` | inert | boolean | `shared/embeddings.ts` | Deprecated inert alias for the removed eager-warmup toggle. The embedding provider always initializes lazily now, so setting this flag does not restore startup warmup. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:94:| `SPECKIT_LAZY_LOADING` | inert | boolean | `shared/embeddings.ts` | Deprecated inert alias for the removed eager-warmup toggle. Lazy provider initialization is now the permanent default, and both `SPECKIT_LAZY_LOADING` and `SPECKIT_EAGER_WARMUP` are documented compatibility no-ops. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:52:19. Rendered memory files preserve `<!-- ANCHOR:id -->` and `<!-- /ANCHOR:id -->` comments through post-render cleanup while still stripping non-anchor workflow comments.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:60:25b. `git_changed_file_count` follows a stable 3-tier priority chain: explicit count > enrichment-derived count > provenance-based count.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:144:- Post-render cleanup preserves real `<!-- ANCHOR:id -->` comments while still stripping non-anchor workflow comments.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:182:| `scripts/utils/input-normalizer.ts` | `DataSource` typing, snake_case JSON compatibility, and tool-evidence shaping |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/07-standalone-admin-cli.md:18:Non-MCP `spec-kit-cli` entry point (`cli.ts`) for database maintenance. Four commands: `stats` (tier distribution, top folders, schema version), `bulk-delete` (with --tier, --folder, --older-than, --dry-run, --skip-checkpoint, where constitutional/critical tiers require folder scope), `reindex` (--force, --eager-warmup), `schema-downgrade` (--to 15, --confirm). Transaction-wrapped deletions, checkpoint creation before bulk-delete, mutation ledger recording. Invoked as `node cli.js <command>` from any directory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md:12:This is the cleanup tool for large-scale housekeeping. You can delete all outdated or temporary memories in one go based on their importance level, like clearing out the recycling bin. The most important memories get extra protection so they cannot be accidentally wiped. A safety snapshot is taken first so you can restore if needed.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/08-audit-phase-020-mapping-note.md:2:title: "Audit phase mapping note (020 feature-flag-reference)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/08-audit-phase-020-mapping-note.md:3:description: "Records the slug-based mapping between audit phase 020 and the existing feature-flag-reference catalog category."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/08-audit-phase-020-mapping-note.md:7:# Audit phase mapping note (020 feature-flag-reference)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/08-audit-phase-020-mapping-note.md:9:> **Meta note**: This file is an audit-phase mapping reference, not a feature description. It is excluded from feature-accuracy scoring.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/12--query-intelligence/035-channel-min-representation-r2.md:29:| 035 | Channel min-representation (R2) | Confirm top-k channel diversity rule | `Validate channel min-representation (R2). Capture the evidence needed to prove Each channel represented in top-k results even when one channel dominates; quality floor prevents low-relevance injection. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Run dominance query 2) Inspect pre/post representation 3) Verify quality floor | Each channel represented in top-k results even when one channel dominates; quality floor prevents low-relevance injection | Pre/post representation counts per channel + quality floor threshold verification | PASS: All active channels have >=1 representative in top-k; quality floor prevents sub-threshold entries; FAIL: Channel missing from top-k or sub-threshold results injected | Verify min-representation algorithm → Check quality floor threshold → Inspect channel priority ordering |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/10-filter-config-contract.md:32:| Noise contract | `noise.enabled: true`, `minContentLength: 15`, and `minUniqueWords: 3` tighten the quality floor beyond code defaults (`5` and `2`). The config supports optional custom regex `patterns`, but the current file does not define any, so runtime filtering relies on the built-in `NOISE_PATTERNS` set plus wrapper stripping via `STRIP_PATTERNS`. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/19-completion-verification-workflow.md:3:description: "Checklist completion verifier for spec folders that enforces P0/P1 completion, evidence markers, priority tagging, optional strict P2 enforcement, and JSON or human-readable status reporting."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/19-completion-verification-workflow.md:17:Completion Verification Workflow is the spec-kit completion gate that decides whether a spec folder is ready to be claimed as finished. It audits `checklist.md` inside a target spec folder, counts checkbox items by priority, and blocks completion when critical or required work is missing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/19-completion-verification-workflow.md:19:The workflow is stricter than a plain checkbox counter. It understands inherited priority context from Markdown headings, treats untagged checklist items as blocking, and requires evidence markers on completed P0 and P1 items before the workflow returns a passing status.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/19-completion-verification-workflow.md:27:When a checklist is present, the parser scans Markdown headings and checkbox lines together. Priority can come from inline `[P0]`, `[P1]`, or `[P2]` tags on the item itself, or it can be inherited from the most recent heading that starts with `P0`, `P1`, or `P2`. Untagged items remain blocking because the workflow treats missing priority context as a completion rule violation.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/19-completion-verification-workflow.md:31:Status calculation follows a fixed priority order:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/19-completion-verification-workflow.md:40:The human-readable mode prints a colored summary with a per-priority breakdown, blocking reasons, and a final "READY FOR COMPLETION" or "BLOCKED" result. JSON mode emits totals, percentages, per-priority counts, and quality-gate fields for missing priority context and missing evidence. Quiet mode suppresses the report and preserves exit-code-only usage for automation.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/19-completion-verification-workflow.md:50:| `.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh` | Script | Parses `checklist.md`, derives priority state, enforces evidence rules, and returns human-readable or JSON completion status |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-tools.md:3:description: "Tracks the shared-memory lifecycle tools that provide workspace-level scoping beyond `specFolder` with deny-by-default membership."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-tools.md:10:Four shipped tools provide workspace-level scoping beyond per-spec-folder filtering. They live under the `/memory:manage shared` command and implement a deny-by-default membership model for multi-tenant shared-memory spaces. The subsystem is opt-in: disabled by default and activated via `shared_memory_enable`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-tools.md:26:The original full namespace CRUD (`list/create/switch/delete`) for complete multi-tenant isolation remains deferred pending demonstrated demand. Current scoping relies on logical `specFolder` filtering augmented by the shared-memory tools above.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/02-core-metric-computation.md:12:Think of this like a report card for search quality, but with twelve different grades instead of just one pass/fail. Some grades tell you whether the best answer shows up first, others tell you whether all the right answers are found at all. Together they pinpoint exactly where search is struggling, like a doctor running multiple tests to find the real problem instead of just asking "do you feel sick?"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/09--evaluation-and-measurement/02-core-metric-computation.md:20:Eight diagnostic metrics add depth. Inversion rate counts pairwise ranking mistakes. Constitutional surfacing rate tracks whether high-priority memories appear in top results. Importance-weighted recall favors recall of critical content. Cold-start detection rate measures whether fresh memories surface when relevant. Precision@K and F1@K expose precision/recall balance. MAP captures ranking quality across the full relevant set. Intent-weighted NDCG adjusts ranking quality by query type.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/176-implicit-feedback-log-speckit-implicit-feedback-log.md:21:- Pass/fail: PASS if ledger schema supports all 5 event types with correct confidence tier mappings, handlers emit events for triggered actions (e.g., search_shown on search), and events remain shadow-only; FAIL if ledger schema missing event types, confidence tiers incorrect, or events influence live rankings
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/176-implicit-feedback-log-speckit-implicit-feedback-log.md:29:| 176 | Implicit feedback log (SPECKIT_IMPLICIT_FEEDBACK_LOG) | Verify shadow-only implicit feedback event ledger records 5 event types | `Test the default-on SPECKIT_IMPLICIT_FEEDBACK_LOG behavior. Trigger all 5 feedback event types and verify confidence tier assignment. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_IMPLICIT_FEEDBACK_LOG` is unset or `true` 2) `memory_search({ query: "test query" })` — triggers search_shown 3) Cite a result — triggers result_cited 4) Reformulate query — triggers query_reformulated 5) Re-search same topic — triggers same_topic_requery 6) Use follow-on tool — triggers follow_on_tool_use 7) Query feedback ledger for recorded events 8) Verify shadow-only (no ranking changes) | isImplicitFeedbackLogEnabled() returns true; 5 event types stored with type/memory_id/query_id/confidence/timestamp/session_id; resolveConfidence() maps: result_cited→strong, follow_on_tool_use→strong, query_reformulated→medium, search_shown→weak, same_topic_requery→weak; shadow-only | Feedback ledger query results + event type/confidence pairs + ranking comparison (before/after) + test transcript | PASS if all 5 event types recorded with correct confidence tiers and no ranking side effects; FAIL if event types missing, confidence tiers wrong, or events influence rankings | Verify isImplicitFeedbackLogEnabled() → Confirm flag is not forced off → Check feedback-ledger.ts schema creation → Inspect resolveConfidence() tier mapping → Verify shadow-only constraint (no ranking integration) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/21-eval-runner-cli.md:28:2. The script targets the production memory database at `mcp_server/database/context-index.sqlite`. It refuses to proceed if that database file does not exist or if `vectorIndex.initializeDb(PROD_DB_PATH)` returns `null`. After DB rebuilds or imports, operators should preview or refresh ground-truth mappings with `scripts/evals/map-ground-truth-ids.ts` before treating a new ablation run as comparable to older history.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation/02-memory-metadata-update-memoryupdate.md:12:You can rename a memory or change its priority without deleting and re-creating it. When you change the title, the system automatically updates its internal search index to match. If the update fails partway through, everything rolls back to the way it was before so you never end up with a half-changed record.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/06-6-debug-and-telemetry.md:12:These settings control diagnostic visibility. They adjust log verbosity and optional telemetry so you can inspect runtime behavior during debugging while keeping production output stable by default.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md:12:Some memories are fundamental rules that should always come up when relevant, like "never delete production data." This feature tags those high-priority memories with instructions about when to surface them. It works like sticky notes on a filing cabinet that say "pull this file whenever someone asks about X."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md:39:| `mcp_server/tests/search-results-format.vitest.ts` | Formatter-level validation for trace channels, query complexity fallback and envelope payload shaping. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/02--mutation/05-validation-feedback-memoryvalidate.md:30:The confidence read-compute-write segment (`recordValidation`) runs within a single SQLite transaction to prevent concurrent validation updates from racing and dropping writes. Downstream side effects (auto-promotion, negative-feedback persistence, learned feedback and ground-truth logging) execute after that transactional segment.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/235-eval-runner-cli.md:16:Operators verify that the ablation CLI refuses to run without explicit enablement, accepts supported channel lists, warns on invalid channels, writes the final JSON artifact after a successful run against the production evaluation surface, and is paired with the read-only ground-truth mapping preview before trusting cross-run comparisons.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/235-eval-runner-cli.md:19:- Prompt: `Validate the eval runner CLI. Capture the evidence needed to prove map-ground-truth-ids.ts previews the active parent-memory DB mapping, run-ablation.ts blocks execution unless SPECKIT_ABLATION=true is set, warns or recovers cleanly when invalid channel names are provided, prints a formatted report on success, and writes /tmp/ablation-result.json with script metadata. Flag any token-budget-overflow run that collapses below recallK as investigation-only rather than a clean benchmark. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/235-eval-runner-cli.md:20:- Expected signals: mapping preview logs the production DB path and parent-memory count; flag-disabled run exits non-zero with usage guidance; enabled run initializes production and eval DBs; formatted report prints; `/tmp/ablation-result.json` is written
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/235-eval-runner-cli.md:21:- Pass/fail: PASS if the mapping preview and CLI contract both behave as documented, with truncation clearly called out when present
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/235-eval-runner-cli.md:29:| 235 | Eval Runner CLI | Confirm ablation flag gating, provenance preview, channel handling, report output, and artifact persistence | `Validate the eval runner CLI. Capture the evidence needed to prove map-ground-truth-ids.ts previews the active parent-memory DB mapping, run-ablation.ts blocks execution unless SPECKIT_ABLATION=true is set, warns or recovers cleanly when invalid channel names are provided, prints a formatted report on success, and writes /tmp/ablation-result.json with script metadata. Flag any token-budget-overflow run that collapses below recallK as investigation-only rather than a clean benchmark. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `npx tsx .opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts --dry-run` 2) `npx tsx .opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts --channels vector || true` 3) `SPECKIT_ABLATION=true npx tsx .opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts --channels vector,fts5,invalid --verbose` 4) `node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync('/tmp/ablation-result.json','utf8')); console.log(data.productionMemoryCount, data.scriptVersion)"` | Mapping preview logs the production DB path and parent-memory count; disabled run exits non-zero with enablement error; enabled run initializes the production DB and eval DB; invalid channel input does not silently crash; JSON artifact contains `productionMemoryCount` and `scriptVersion` | CLI transcript for preview and both runs, plus the contents of `/tmp/ablation-result.json` | PASS if the preview and CLI contract behave as documented and any truncation-driven invalid benchmark is explicitly called out | Inspect `scripts/evals/map-ground-truth-ids.ts`, `scripts/evals/run-ablation.ts`, ground-truth/eval DB initialization, and channel parsing if provenance, gating, or artifact persistence regresses |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md:12:Each project folder now has a short identity card describing what it contains. When you ask the system a question, it can check these identity cards first to figure out which folder holds the answer, skipping the need to search through everything. It is like reading the labels on filing cabinet drawers instead of opening every drawer to find what you need.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md:48:`content-normalizer.ts` instead of ad hoc inline frontmatter stripping.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md:63:clamping before incrementing, keeping invalid numeric values from escaping into
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/04-spec-folder-description-discovery.md:89:| `mcp_server/tests/folder-discovery.vitest.ts` | PerFolderDescription schema, generation, required-field/array validation, path-containment hardening, `slugifyFolderName`, CRUD/staleness, and CRLF frontmatter stripping |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/12--query-intelligence/033-query-complexity-router-r15.md:29:| 033 | Query complexity router (R15) | Confirm query-class routing | `Verify query complexity router (R15). Capture the evidence needed to prove Simple queries route to fewer channels; complex queries activate all channels; disabled flag falls back to default routing. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Run simple/moderate/complex 2) Inspect selected channels 3) Disable flag fallback | Simple queries route to fewer channels; complex queries activate all channels; disabled flag falls back to default routing | Channel selection trace for simple/moderate/complex queries + flag-disabled fallback behavior | PASS: Channel count increases with complexity class; disabled flag uses default routing; FAIL: All queries use same channels or flag-disabled produces error | Verify complexity classification logic → Check channel mapping per class → Inspect feature flag fallback behavior |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/042-priority-lowercase/spec.md:14:Tests lowercase priority headers generate warnings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/25-indexing-runtime-bootstrap-api.md:12:`mcp_server/api/indexing.ts` is a deliberately narrow public API for operational scripts that need to bring the indexing runtime up without importing `core/` or handler internals directly. Instead of exposing the full storage and search subsystem, it packages the minimum lifecycle hooks into four exports: runtime initialization, embedding warmup, scan execution, and shutdown.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/25-indexing-runtime-bootstrap-api.md:20:`warmEmbeddingModel(input = 'warmup test')` is an async warmup helper with no internal recovery path. It awaits `generateEmbedding(input)`, sets the global embedding readiness flag through `setEmbeddingModelReady(true)`, and returns `getEmbeddingProfile()` cast to `EmbeddingProfile | null`. If embedding generation throws, the error bubbles to the caller and the readiness flag is not flipped. `closeIndexingRuntime()` is equally narrow and only calls `vectorIndex.closeDb()`, so it closes the shared database connection without resetting db-state caches or readiness flags on its own.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/25-indexing-runtime-bootstrap-api.md:28:| `mcp_server/api/indexing.ts` | API | Public bootstrap, warmup, scan, and shutdown surface |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/25-indexing-runtime-bootstrap-api.md:29:| `mcp_server/api/providers.ts` | API | Public embedding provider re-export used for warmup/profile access |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:34:6. `git_changed_file_count` follows a stable 3-tier priority chain: explicit count > enrichment-derived count > provenance-based count.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:59:- **git_changed_file_count**: A 3-tier priority chain ensures stability across different input sources.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/042-spec-folder-description-discovery-pi-b3.md:21:- Pass/fail: PASS: description.json created, stale detection works, per-folder preferred, mixed aggregation correct, no crash on corrupt description.json, invalid metadata repaired on regeneration, missing files fall back without implicit writes, traversal attempts rejected, frontmatter stripping works for CRLF-heavy files, folder routing active, and regenerated files are valid JSON with no leftover temp files; FAIL: Any of the scenario checks fails
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/042-spec-folder-description-discovery-pi-b3.md:29:| 042 | Spec folder description discovery (PI-B3) | Confirm per-folder + aggregated routing | `Validate PI-B3 folder description discovery. Capture the evidence needed to prove description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Create spec folder via create.sh → verify description.json exists 2) Edit spec.md → verify isPerFolderDescriptionStale detects change 3) Run generateFolderDescriptions → verify per-folder files preferred over spec.md 4) Mixed mode: some folders with/without description.json → verify aggregation 5) Corrupt description.json with invalid JSON and schema-invalid field types → run generateFolderDescriptions() and verify spec.md fallback plus repaired description.json 6) Verify missing description.json falls back to spec.md without forcing a write 7) Attempt generation against an out-of-base or prefix-bypass path → verify rejection and no file written 8) Use spec.md with large YAML frontmatter and CRLF-heavy line endings → verify extracted description comes from post-frontmatter content 9) Run memory_context query → verify short-circuit folder routing | description.json exists after create.sh; stale detection triggers on spec.md edit; per-folder files preferred over spec.md fallback; mixed-mode aggregation works; invalid JSON or schema-invalid description.json files are ignored, spec.md fallback is used, and existing files are repaired in place; missing description.json falls back cleanly without implicit backfill; out-of-base or prefix-bypass paths are rejected by realpath containment checks; YAML frontmatter is stripped before description extraction, including CRLF-heavy frontmatter cases; memory_context uses folder routing; regeneration leaves valid JSON on disk with no leftover temp files | description.json content + stale detection output + folder routing trace in memory_context + recovery evidence for corrupt/schema-invalid description.json files + missing-file fallback evidence + rejection evidence for traversal attempts + proof of valid regenerated JSON with no leftover temp files | PASS: description.json created, stale detection works, per-folder preferred, mixed aggregation correct, no crash on corrupt description.json, invalid metadata repaired on regeneration, missing files fall back without implicit writes, traversal attempts rejected, frontmatter stripping works for CRLF-heavy files, folder routing active, and regenerated files are valid JSON with no leftover temp files; FAIL: Any of the scenario checks fails | Verify create.sh generates description.json → Check stale detection mtime comparison → Inspect generateFolderDescriptions preference logic and repair path → Confirm missing-file fallback does not backfill unexpectedly → Verify realpath containment rejects traversal/prefix-bypass paths → Confirm frontmatter stripping happens before description extraction → Verify memory_context folder routing |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/18-session-enrichment-and-alignment-guards.md:18:Captured-session `generate-context.js` saves now enrich thin OpenCode-derived session data with spec-folder and git context before rendering, while keeping contamination defenses in place.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/18-session-enrichment-and-alignment-guards.md:27:Git extraction also preserves uncommitted file context in freshly initialized repositories that do not have a `HEAD` commit yet, survives detached-HEAD saves without dropping commit identity, and parses multi-commit history without leaking similarly named foreign spec folders into the target result.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/18-session-enrichment-and-alignment-guards.md:51:| `scripts/tests/session-enrichment.vitest.ts` | Relevance filtering, sparse-spec extraction, git snapshot metadata, multi-commit scoping/fallbacks, unborn-HEAD repo handling, live-over-synthetic snapshot behavior, and extractor barrel exports |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/06-mutation-hook-result-contract-expansion.md:12:After the system finishes its follow-up tasks on a save, it now reports how long those tasks took and whether any caches were cleared. This gives you a clearer picture of what happened behind the scenes, like a shipping notification that tells you not just "delivered" but also the delivery time and which steps were completed.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/06-mutation-hook-result-contract-expansion.md:32:| `mcp_server/hooks/mutation-feedback.ts` | Hook | Consumes expanded hook-result contract for UX payload shaping |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/042-priority-lowercase/plan.md:8:Lowercase priority test.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md:59:| `mcp_server/lib/search/pipeline/types.ts` | Lib | Stage metadata typing for constitutional passthrough |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/11-pipeline-and-mutation-hardening.md:62:| `mcp_server/lib/search/bm25-index.ts` | Lib | Doubled-consonant stemming fix after suffix stripping |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md:3:description: "Deferred lexical-only indexing stores memories with `embedding_status='pending'` when embedding generation fails, keeping them searchable via BM25/FTS5 until retry succeeds."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/15-deferred-lexical-only-indexing.md:10:Deferred lexical-only indexing stores memories with `embedding_status='pending'` when embedding generation fails, keeping them searchable via BM25/FTS5 until retry succeeds.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/23-spec-lifecycle-automation.md:33:Completion measurement and completion gating are separated on purpose. `calculate-completeness.sh` scans the root spec files for placeholder markers such as `[PLACEHOLDER]`, `[TODO: ...]`, and `[NEEDS CLARIFICATION: ...]`, computes per-file and overall completion percentages with `bc`, and can add quality checks for minimum word counts and required sections. `check-completion.sh` then evaluates `checklist.md` as a release gate: it inherits priority from headings when needed, treats untagged items as blocking, requires evidence markers on completed P0 and P1 tasks, supports `--strict` to make P2 mandatory, and returns one of a fixed set of statuses such as `P0_INCOMPLETE`, `EVIDENCE_MISSING`, or `COMPLETE`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/23-spec-lifecycle-automation.md:49:| `.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh` | Script | Enforces checklist completion rules, priority coverage, and evidence requirements before a spec can be claimed complete |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/06-embedding-cache.md:12:Converting text into the numerical format the search engine understands is the slowest and most expensive step. This feature saves those conversions so the system does not have to redo them when the same content is indexed again. It is like keeping a translated copy of a document instead of hiring the translator every time you need it. If the content has not changed, the saved version is used instantly.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md:3:description: "Anchor-aware chunk thinning scores each chunk by anchor presence and content density, dropping low-value chunks from the index."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md:10:Anchor-aware chunk thinning scores each chunk by anchor presence and content density, dropping low-value chunks from the index.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md:12:When a large file is split into smaller pieces for indexing, not every piece carries useful information. Some are mostly whitespace or boilerplate. This feature scores each piece and drops the ones that add little value, keeping only the meaningful parts. It is like trimming the fat off a steak so you only store the good cuts.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/046-anchor-aware-chunk-thinning-r7.md:3:description: "This scenario validates Anchor-aware chunk thinning (R7) for `046`. It focuses on Confirm anchor-priority thinning."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/046-anchor-aware-chunk-thinning-r7.md:10:This scenario validates Anchor-aware chunk thinning (R7) for `046`. It focuses on Confirm anchor-priority thinning.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/046-anchor-aware-chunk-thinning-r7.md:18:- Objective: Confirm anchor-priority thinning
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/046-anchor-aware-chunk-thinning-r7.md:19:- Prompt: `Validate anchor-aware chunk thinning (R7). Capture the evidence needed to prove Anchor chunks retained; filler chunks thinned; retained set is non-empty; anchor priority respected in thinning order. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/046-anchor-aware-chunk-thinning-r7.md:20:- Expected signals: Anchor chunks retained; filler chunks thinned; retained set is non-empty; anchor priority respected in thinning order
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/046-anchor-aware-chunk-thinning-r7.md:29:| 046 | Anchor-aware chunk thinning (R7) | Confirm anchor-priority thinning | `Validate anchor-aware chunk thinning (R7). Capture the evidence needed to prove Anchor chunks retained; filler chunks thinned; retained set is non-empty; anchor priority respected in thinning order. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Index long doc with anchors/filler 2) run thinning 3) verify non-empty retained set | Anchor chunks retained; filler chunks thinned; retained set is non-empty; anchor priority respected in thinning order | Thinning output showing retained vs removed chunks + anchor identification | PASS: All anchor chunks retained; filler removed; retained set non-empty; FAIL: Anchor chunks removed or empty retained set | Verify anchor detection logic → Check thinning priority ordering → Inspect minimum retained set size |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/07-double-intent-weighting-investigation.md:3:description: "Documents the pipeline trace confirming that dual intent weight systems (channel-level in adaptive fusion, attribute-level in intent classifier) are intentional and non-overlapping by design through the `isHybrid` gate."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/07-double-intent-weighting-investigation.md:10:Documents the pipeline trace confirming that dual intent weight systems (channel-level in adaptive fusion, attribute-level in intent classifier) are intentional and non-overlapping by design through the `isHybrid` gate.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/24-spec-validation-rule-engine.md:19:The engine is centered on `validate.sh`, which acts as an orchestrator for a directory of rule scripts under `scripts/rules/`. It detects the target spec level, resolves which rules to run, applies severity mapping, executes each rule in-process, and aggregates the result into terminal-friendly output or JSON for automation.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/24-spec-validation-rule-engine.md:31:Severity is partly centralized in the orchestrator. Missing files, placeholders, anchor issues, table-of-contents policy, template-header mismatches, and spec-doc integrity failures are treated as errors. Section, priority, evidence, and phase-link issues are warnings by default. Level declaration is informational. `--strict` upgrades warning-bearing runs into exit-code failure without changing the underlying rule outputs.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/24-spec-validation-rule-engine.md:65:| `.opencode/skill/system-spec-kit/scripts/rules/check-priority-tags.sh` | Validation rule | Rule script discovered and executed by the orchestrator for checklist priority-tag checks |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/22-mcp-server-public-api-barrel.md:34:Finally, the barrel exposes architecture and rollout metadata surfaces that would otherwise require deep internal imports. From `lib/architecture/layer-definitions.ts`, it exports `LAYER_DEFINITIONS`, `TOOL_LAYER_MAP`, `getLayerForTool`, `getLayerTokenBudget`, `LayerDefinition`, and `LayerId`. From `lib/collab/shared-spaces.ts`, it exports rollout reporting helpers `getSharedRolloutMetrics` and `getSharedRolloutCohortSummary` plus the related shared-space types. From `lib/config/capability-flags.ts`, it exports `getMemoryRoadmapCapabilityFlags`, `getMemoryRoadmapDefaults`, `getMemoryRoadmapPhase`, and `MemoryRoadmapCapabilityFlags`. The result is a single public barrel that spans evaluation, runtime bootstrap, search, provider orchestration, script-facing helper utilities, and rollout metadata, while keeping consumers on one stable import path.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/22-mcp-server-public-api-barrel.md:45:| `mcp_server/api/indexing.ts` | API | Indexing runtime bootstrap, warmup, scan, and shutdown exports |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/22-mcp-server-public-api-barrel.md:55:| `mcp_server/lib/architecture/layer-definitions.ts` | Lib | Layer metadata, tool-layer mapping, and token budget helpers |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/11-working-memory-timestamp-fix.md:18:The `cleanupOldSessions()` method in the working memory manager compared `last_focused` timestamps (stored via SQLite `CURRENT_TIMESTAMP` as `YYYY-MM-DD HH:MM:SS`) against JavaScript `toISOString()` output (`YYYY-MM-DDTHH:MM:SS.sssZ`). The lexicographic comparison failed because space (ASCII 32) sorts before `T` (ASCII 84), causing active sessions to be incorrectly deleted. The fix replaces the JavaScript Date comparison with SQLite-native `datetime()` math: `DELETE FROM working_memory WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')`, keeping the comparison entirely within SQLite's datetime system.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md:3:description: "Covers four scoring-layer bug fixes: composite score overflow clamping, citation fallback chain removal, causal-boost cycle deduplication and ablation binomial overflow prevention."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md:10:Covers four scoring-layer bug fixes: composite score overflow clamping, citation fallback chain removal, causal-boost cycle deduplication and ablation binomial overflow prevention.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md:20:**C1: Composite score overflow:** `composite-scoring.ts` used `Math.max(0, composite)` which allowed scores above 1.0. Changed to `Math.max(0, Math.min(1, composite))` clamping to [0,1] across scoring paths.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/044-priority-p3-invalid/spec.md:14:Tests P3/P4 priority levels generate warnings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/040-signal-vocabulary-expansion-tm-08.md:29:| 040 | Signal vocabulary expansion (TM-08) | Confirm signal category detection | `Validate signal vocabulary expansion (TM-08). Capture the evidence needed to prove Signal categories (correction, preference, reinforcement) detected from prompt analysis; trigger matching reflects expanded vocabulary. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Use correction/preference prompts 2) Trigger matching 3) Verify categories | Signal categories (correction, preference, reinforcement) detected from prompt analysis; trigger matching reflects expanded vocabulary | Trigger match output showing detected signal categories + prompt-to-category mapping | PASS: >=3 signal categories correctly classified from varied prompts; FAIL: Categories missing or misclassified | Verify signal vocabulary dictionary → Check category detection regex/rules → Inspect trigger matching integration |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/041-priority-inline-tags/spec.md:14:Tests inline priority tags [P0]/[P1]/[P2] are recognized.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md:27:**Cross-reference**: The structural contracts validated by `validate.sh` are now codified in `references/validation/template_compliance_contract.md` and embedded as compact anchor-to-H2 mapping tables in all @speckit agent definitions. See `18-template-compliance-contract-enforcement.md` for the 3-layer enforcement architecture that ensures agents produce compliant documents at generation time.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/044-priority-p3-invalid/plan.md:8:Invalid priority levels test.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/07-smarter-memory-content-generation.md:12:Raw notes are full of formatting clutter like bullet markers, code fences and header symbols that have nothing to do with the actual meaning. This feature strips that clutter away before the system creates a searchable fingerprint of your content. The result is cleaner fingerprints that match your questions more accurately, like removing the wrapping paper so you can see what is actually inside the box.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/05-validation-signals-as-retrieval-metadata.md:20:The combined multiplier is bounded to 0.8-1.2 via a clamping function, composed of quality factor (0.9-1.1), spec level bonus (0-0.06), completion bonus (0-0.04) and checklist bonus (0-0.01). Well-maintained documentation ranks slightly above neglected documentation when both are relevant. No feature flag. Always active.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/04-lightweight-consolidation.md:12:Over time, stored memories can contradict each other or grow stale. This feature runs periodic housekeeping to spot conflicts, strengthen connections that get used often and flag relationships that have not been touched in months. Think of it as a librarian who regularly walks the shelves to catch duplicate entries and retire outdated references.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/22-rrf-k-experimental.md:3:description: "RRF K experimental tuning enables judged K-value selection for Reciprocal Rank Fusion, sweeping candidate K values and selecting the one that maximizes NDCG@10 per query intent, gated by the SPECKIT_RRF_K_EXPERIMENTAL flag."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/22-rrf-k-experimental.md:10:RRF K experimental tuning enables per-intent K-value selection for Reciprocal Rank Fusion, sweeping candidate K values and selecting the one that maximizes NDCG@10 per query intent, gated by the `SPECKIT_RRF_K_EXPERIMENTAL` flag.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/13-end-to-end-success-envelope-verification.md:12:This is a set of automated tests that checks the entire response from start to finish: hints are included, previously surfaced context is preserved and the size count is correct. It acts as a final quality check before a response leaves the system, like a shipping inspector who opens the box, verifies everything is inside and confirms the label is accurate before it goes out the door.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/041-priority-inline-tags/plan.md:8:Inline priority tags test.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/041-priority-inline-tags/plan.md:30:Create checklist with inline priority tags.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/18-template-compliance-contract-enforcement.md:39:**2. Compact structural contract in 4 CLI @speckit agent definitions:** A 49-line compact version of the structural contract is embedded in each of the four `@speckit` agent definitions — Claude Code (`.claude/agents/speckit.md`), Copilot (`.opencode/agent/speckit.md`), Codex (`.codex/agents/speckit.toml`), and Gemini (`.gemini/agents/speckit.md`). This gives every agent pre-write knowledge of anchor-to-H2 mappings for each document type at each level.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/058-template-reordered-anchor/spec.md:34:This fixture intentionally swaps required anchor IDs while keeping header text intact.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/32-shared-script-libraries-and-utilities.md:25:The `lib/` directory is the reusable implementation layer for content shaping, semantic extraction, quality enforcement, and shell workflow helpers. `anchor-generator.ts` creates stable, semantic anchor IDs, categorizes markdown sections, and can wrap `##` sections with collision-safe anchor tags. `cli-capture-shared.ts` deduplicates transcript parsing helpers across the Claude Code, Codex CLI, Copilot CLI, and Gemini CLI capture loaders by centralizing timestamp parsing, JSONL reads, tool-name normalization, text extraction, session-title building, and tool-argument parsing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/32-shared-script-libraries-and-utilities.md:29:The rest of `lib/` provides policy and compatibility helpers. `validate-memory-quality.ts` is the pure post-render quality gate with explicit validation-rule metadata, write-vs-index dispositions, contamination handling, YAML parsing, and source-aware blocking behavior. `memory-frontmatter.ts` strips markdown noise from titles, rejects legacy generic descriptions and trigger phrases, derives higher-quality descriptions, and regenerates trigger phrases from summary text plus spec-folder tokens. `phase-classifier.ts` groups exchanges into topic clusters and conversation phases such as Research, Planning, Implementation, Debugging, and Verification. The shell helpers keep the Bash workflows thin: `shell-common.sh` provides JSON escaping and repo-root detection, while `template-utils.sh` maps documentation levels to template directories and copies files with level-specific fallback behavior. `embeddings.ts` is intentionally only a re-export shim to the canonical shared embeddings module.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/32-shared-script-libraries-and-utilities.md:33:`input-normalizer.ts` is the largest utility module and acts as the canonical bridge from raw save payloads or captured CLI sessions into the structured session format used downstream. It defines the normalized observation, file, prompt, decision, and capture types; supports multiple data sources; and combines spec-affinity helpers, decision transformation, capture adaptation, and provenance-aware shaping. Around it sit the smaller utility building blocks: `file-helpers.ts` normalizes relative paths and grades description quality, `slug-utils.ts` chooses content-aware memory names and uses atomic filename creation to avoid collisions, `spec-affinity.ts` evaluates whether captured content truly belongs to a target spec folder by matching spec IDs, phrases, keywords, frontmatter, and file paths, `validation-utils.ts` detects leaked placeholders and broken anchors, and `logger.ts` emits structured JSON logs with level-aware routing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/32-shared-script-libraries-and-utilities.md:64:| `.opencode/skill/system-spec-kit/scripts/lib/shell-common.sh` | Shell helper | Provides JSON escaping and repository-root discovery for Bash workflows |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/25-memory-maintenance-and-migration-clis.md:29:`reindex-embeddings.ts` is the full reindex bootstrap command. It initializes the indexing runtime through the public indexing API, warms the embedding model before scan time, force-runs `runMemoryIndexScan({ force: true, includeConstitutional: true })`, then prints a summarized status block covering scanned, indexed, updated, unchanged, and failed files plus constitutional-memory counts and up to fifteen changed-file rows. Missing summary content or warmup failures terminate the run with a non-zero exit.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/15-warm-server-daemon-mode.md:37:| `mcp_server/tests/lazy-loading.vitest.ts` | Verifies deferred warmup flags and `shouldEagerWarmup()` behavior |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/04-schema-and-type-contract-synchronization.md:18:Phase 014 aligned runtime validation and TypeScript contracts for mutation-safety behavior. The finalized state keeps `checkpoint_delete.confirmName` required across handler, schema and tool-boundary typing, and keeps the shared mutation-hook result contract synchronized for all mutation handlers.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/04-schema-and-type-contract-synchronization.md:34:| `mcp_server/hooks/mutation-feedback.ts` | Hook Consumer | Consumes hook-result contract for UX payload shaping |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md:3:description: "Describes the unified `effectiveScore()` fallback chain (`intentAdjustedScore -> rrfScore -> score -> similarity/100`) with `isFinite()` guards and [0,1] clamping used by Stage 3 reranking and cross-encoder mapping."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md:10:Describes the unified `effectiveScore()` fallback chain (`intentAdjustedScore -> rrfScore -> score -> similarity/100`) with `isFinite()` guards and [0,1] clamping used by Stage 3 reranking and cross-encoder mapping.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md:12:A search result can carry several different scores from different stages of processing. The final ranking step was only looking at two of them and skipping the most refined ones. This fix teaches it to check the best available score first and fall back through less precise options only when needed, like reading the final exam grade before the midterm before the homework score.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md:18:`effectiveScore()` in `stage3-rerank.ts` only checked `score` then `similarity/100`, skipping `intentAdjustedScore` and `rrfScore` from Stage 2 enrichment. The fix updated the fallback chain to: `intentAdjustedScore -> rrfScore -> score -> similarity/100`, all clamped [0,1] with `isFinite()` guards. Cross-encoder document mapping and MMR candidate scoring now use `effectiveScore()` instead of inline fallbacks. A `stage2Score` field was added to `PipelineRow` in `types.ts` for auditability when Stage 3 overwrites scores.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md:28:| `mcp_server/lib/search/pipeline/stage3-rerank.ts` | Pipeline | `effectiveScore()` alias for `resolveEffectiveScore()`, used in cross-encoder mapping and MMR candidate scoring |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/05-code-standards-alignment.md:35:- **Rule mapping**
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/05-code-standards-alignment.md:44:- **Rule mapping**
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/05-code-standards-alignment.md:61:### 3) Import ordering and grouping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/05-code-standards-alignment.md:63:- **Rule mapping**
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/05-code-standards-alignment.md:73:- **Rule mapping**
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/23-embeddings-and-retry-api.md:25:`mcp_server/lib/providers/retry-manager.ts` implements the recovery side of the API. It tracks `pending`, `retry`, `failed`, and `success` states, atomically claims retry candidates in `memory_index`, and uses retry backoff delays of 1 minute, 5 minutes, and 15 minutes with `MAX_RETRIES = 3`. The background job is configured by default for a 5-minute interval and a batch size of 5. It also maintains an in-memory health snapshot and a provider circuit breaker that opens after 5 consecutive failures and cools down for 120000ms. When retrying a memory, the manager normalizes content before embedding, checks the embedding cache using a content hash and model id, avoids provider calls while the circuit is open, sanitizes provider-facing failure messages into structured public codes such as `EMBEDDING_TIMEOUT`, `EMBEDDING_RATE_LIMIT`, and `EMBEDDING_PROVIDER_ERROR`, and on success updates `memory_index` plus replaces the row in `vec_memories` inside a transaction. If content cannot be loaded, the provider returns null, or repeated failures exceed the retry budget, the record is advanced through retry bookkeeping and can ultimately be marked `failed`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md:32:In the non-hybrid flow, after Step 4 applies `intentAdjustedScore`, subsequent pipeline steps (artifact routing, feedback signals, session boost, and causal boost) can mutate `score`. Since `resolveEffectiveScore()` prefers `intentAdjustedScore` over `score`, later modifications were invisible in final ranking. A synchronization pass now flat-overwrites the score aliases by clamping the current value and writing the same number into `score`, `rrfScore`, and `intentAdjustedScore` via `withSyncedScoreAliases()` and `syncScoreAliasesInPlace()`. This keeps downstream ranking consistent with the latest pipeline score; it does not preserve the prior value with `Math.max(...)`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/003-valid-level2/spec.md:19:- Checklist with priority tags
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/31-evaluation-benchmark-and-import-policy-tooling.md:31:`map-ground-truth-ids.ts` is the read-only ground-truth provenance helper. It opens the production `context-index.sqlite` in read-only mode, scores candidate parent memories for each non-negative query, writes a preview artifact to `/tmp/ground-truth-id-mapping.json`, and gives operators a concrete way to confirm whether `ground-truth.json` still matches the live parent-memory ID space after DB rebuilds or imports.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/31-evaluation-benchmark-and-import-policy-tooling.md:50:| `.opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts` | Provenance CLI | Audits or previews ground-truth parent-memory ID mappings against the production DB |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/03-chunk-ordering-preservation.md:31:| `mcp_server/lib/search/pipeline/types.ts` | Lib | Chunk/contentSource response typing |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/177-hybrid-decay-policy-speckit-hybrid-decay-policy.md:29:| 177 | Hybrid decay policy (SPECKIT_HYBRID_DECAY_POLICY) | Verify type-aware no-decay FSRS policy for decision/constitutional/critical types | `Test the default-on SPECKIT_HYBRID_DECAY_POLICY behavior. Confirm the implementing symbols exist in the expected code, rerun the hybrid-decay regression tests, and verify that decision, constitutional, and critical context types resolve to no-decay while other types stay on the standard FSRS schedule. Return a concise pass/fail verdict with the first failing symbol or test if anything breaks.` | 1) `rg -n "SPECKIT_HYBRID_DECAY_POLICY|SPECKIT_CLASSIFICATION_DECAY|HYBRID_NO_DECAY_CONTEXT_TYPES|classifyHybridDecay|getHybridDecayMultiplier|applyHybridDecayPolicy|calculateRetrievability|isHybridDecayPolicyEnabled" .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts`<br>2) `cd .opencode/skill/system-spec-kit/mcp_server && node ./node_modules/vitest/vitest.mjs run tests/hybrid-decay-policy.vitest.ts tests/fsrs-hybrid-decay.vitest.ts` | Source grep returns matches for the flag gate, no-decay set, classifier, multiplier, policy application, and FSRS retrievability helpers; Vitest reports both files passing and no `FAIL` lines; current baseline summary is `Test Files 2 passed (2)` and `Tests 30 passed (30)` | Saved `rg` output plus the final Vitest summary showing both files passed | PASS if the `rg` command returns all expected symbols and the Vitest command exits 0 with zero failed files/tests. FAIL if any symbol is missing, the no-decay mapping is absent, or either target test file fails. | If the source grep misses a symbol, inspect `mcp_server/lib/cognitive/fsrs-scheduler.ts` or `mcp_server/lib/search/search-flags.ts`. If Vitest fails, use `hybrid-decay-policy.vitest.ts` for default-on flag behavior, type classification, Infinity stability, and TM-03 separation, and `fsrs-hybrid-decay.vitest.ts` for the lower-level no-decay multiplier and routing checks. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/21-calibrated-overlap-bonus.md:3:description: "Calibrated overlap bonus replaces the flat convergence bonus in RRF fusion with a query-aware scaled bonus that accounts for the number of overlapping channels and the mean normalized top score, gated by the SPECKIT_CALIBRATED_OVERLAP_BONUS flag."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/21-calibrated-overlap-bonus.md:10:Calibrated overlap bonus replaces the flat convergence bonus in RRF fusion with a query-aware scaled bonus that accounts for the number of overlapping channels and the mean normalized top score, gated by the `SPECKIT_CALIBRATED_OVERLAP_BONUS` flag.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/05-database-and-schema-safety.md:28:**B5: Connection-map isolation and constitutional cache scoping:** `vector-index-store.ts` no longer lets `initialize_db(custom_path)` overwrite the module-global default connection. Connections are tracked in `db_connections = new Map<string, Database.Database>()` keyed by resolved path, globals are updated only for the validated default store and `close_db()` closes every tracked handle. The constitutional-memory cache key now also includes the `includeArchived` flag, preventing archived-inclusive results from leaking into archived-exclusive reads.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/151-module-map-accuracy.md:18:This scenario validates MODULE_MAP.md content accuracy for `151`. It focuses on verifying that the module inventory, file listings, and consumer mappings match the actual codebase.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/151-module-map-accuracy.md:28:- Expected signals: All 5 sampled modules have accurate file lists and consumer mappings
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/151-module-map-accuracy.md:37:| 151 | MODULE_MAP.md accuracy | Verify 5 module entries match actual code | `Validate MODULE_MAP.md accuracy by spot-checking 5 modules (config, cognitive, search, storage, scoring). For each: verify listed key files exist, verify primary consumers are accurate via grep. Return a pass/fail verdict per module.` | 1) `cd .opencode/skill/system-spec-kit` 2) Read MODULE_MAP.md entries for config, cognitive, search, storage, scoring 3) For each module: `ls mcp_server/lib/{module}/` to verify key files exist 4) For each module: `grep -r "from.*/{module}/" mcp_server/ --include="*.ts" -l` to verify consumers 5) Compare against MODULE_MAP.md listings | All 5 modules have accurate file lists and consumer mappings | ls output + grep output per module vs MODULE_MAP.md entries | PASS if all 5 sampled modules are accurate | Identify stale entry -> update MODULE_MAP.md -> re-verify |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/164-batch-learned-feedback-speckit-batch-learned-feedback.md:29:| 164 | Batch learned feedback (SPECKIT_BATCH_LEARNED_FEEDBACK) | Verify batch learning aggregation | `Test SPECKIT_BATCH_LEARNED_FEEDBACK=true. Populate feedback events, run batch learning, and verify min-support guards, boost caps, and batch_learning_log entries. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_BATCH_LEARNED_FEEDBACK=true` 2) Populate feedback_events via multiple sessions 3) Call `runBatchLearning(db, options)` 4) Query `SELECT * FROM batch_learning_log` 5) Verify AggregatedSignal values 6) `npx vitest run tests/batch-learning.vitest.ts` | AggregatedSignal with sessionCount, weightedScore, computedBoost; min-support enforced (>= 3 sessions); boost capped at 0.10; batch_learning_log rows; shadow-only | AggregatedSignal output + batch_learning_log rows + test transcript | PASS if min-support respected, boost capped, and log populated; FAIL if under-supported signals promoted or boost > 0.10 | Verify flag enabled → Check initFeedbackLedger() → Inspect CONFIDENCE_WEIGHTS mapping → Verify MIN_SUPPORT_SESSIONS (3) → Check MAX_BOOST_DELTA (0.10) → Verify BATCH_WINDOW_MS (7 days) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/02-lazy-loading-migration-and-warmup-compatibility.md:2:title: "Lazy-loading migration and warmup compatibility"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/02-lazy-loading-migration-and-warmup-compatibility.md:3:description: "Embedding startup now uses permanent lazy initialization, while the old warmup flags remain only as deprecated compatibility surfaces."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/02-lazy-loading-migration-and-warmup-compatibility.md:6:# Lazy-loading migration and warmup compatibility
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/02-lazy-loading-migration-and-warmup-compatibility.md:17:This entry captures the completed migration from optional startup warmup to permanent lazy embedding initialization.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/02-lazy-loading-migration-and-warmup-compatibility.md:19:The requested source files show a split between runtime behavior and compatibility posture. `shared/embeddings.ts` hardens lazy provider creation as the only real embedding startup path, while `mcp_server/context-server.ts` still preserves the older warmup decision point so legacy flag names can be acknowledged without re-enabling eager startup behavior.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/02-lazy-loading-migration-and-warmup-compatibility.md:25:`shared/embeddings.ts` makes lazy loading the permanent default. The module-level `shouldEagerWarmup()` helper now always returns `false`, and `getProvider()` creates the provider with `warmup: false`, which defers model loading until the first embedding request. The same module still records lazy-loading diagnostics such as initialization timing, first-embedding timing, and an `eagerWarmupEnabled` field in `getLazyLoadingStats()`, but that field is fed by an inert helper.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/02-lazy-loading-migration-and-warmup-compatibility.md:27:The file also keeps a `preWarmModel()` utility that can call `provider.warmup()`, but the requested startup path does not use it. In other words, warmup support survives as helper-level compatibility code, not as the live startup policy.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/02-lazy-loading-migration-and-warmup-compatibility.md:31:The migration outcome is therefore stable: lazy loading is the shipped behavior, and the warmup flags remain only as compatibility shims for older docs, configs, or operator expectations. They no longer act as live knobs that can restore eager warmup at server startup.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/02-lazy-loading-migration-and-warmup-compatibility.md:41:| `shared/embeddings.ts` | Shared | Defines permanent lazy provider initialization, inert warmup flag behavior, lazy-loading diagnostics, and retained pre-warm helper surface |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/02-lazy-loading-migration-and-warmup-compatibility.md:42:| `mcp_server/context-server.ts` | Core | Preserves the startup decision point and emits the deprecation/runtime messaging for legacy warmup flags |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/02-lazy-loading-migration-and-warmup-compatibility.md:49:- Source feature title: Lazy-loading migration and warmup compatibility
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md:12:Multiple parts of the system were figuring out where the database lives in their own way, each with its own hardcoded path. This fix created one shared place that knows the database location, and everyone else just asks it. It is like giving the whole team the same address book instead of each person keeping their own copy that might go out of date.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/17--governance/02-feature-flag-sunset-audit.md:22:- `mcp_server/context-server.ts` still surfaces sunset aftermath operationally. Startup logs explicitly call the warmup flags deprecated compatibility flags, and the remaining shadow-oriented jobs are constrained to evaluation-only behavior such as the shadow feedback scheduler and shadow-only batch learning with no live ranking mutations.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/17--governance/02-feature-flag-sunset-audit.md:32:- `.opencode/skill/system-spec-kit/shared/embeddings.ts` - Graduated lazy-loading behavior and inert warmup compatibility flags.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/17--governance/02-feature-flag-sunset-audit.md:33:- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` - Startup/runtime evidence for deprecated warmup flags and evaluation-only shadow jobs.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:37:| 153 | JSON mode structured summary hardening | Verify structured JSON summary contract | `Save a memory using generate-context.js --json with a payload containing toolCalls, exchanges, and snake_case fields (user_prompts, recent_context, trigger_phrases). Verify the rendered output preserves all structured fields, decision confidence, and explicit counts. Return a pass/fail verdict.` | 1) Compose JSON payload with `toolCalls`, `exchanges`, `user_prompts`, `trigger_phrases` 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Inspect rendered .md output for field preservation 4) Verify decision confidence matches input 5) Verify git_changed_file_count matches explicit count | All structured fields present in output, counts match, file-backed JSON stays on the structured path | Rendered memory file content, CLI exit code 0 | PASS if structured fields preserved and hardening fixes hold | Check input-normalizer mapping, collect-session-data count handling, and workflow routing for structured inputs |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:41:| 153-D | JSON mode structured summary hardening | keyDecisions propagate to non-zero decision_count | `Run generate-context.js --json with a keyDecisions array containing at least 2 items. Confirm the rendered memory metadata decision_count is greater than 0 and matches the number of supplied decisions.` | 1) Set `keyDecisions` to an array of 2+ decision strings 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Read the rendered .md file, including the `## MEMORY METADATA` YAML block 4) Assert `decision_count` > 0 and equals `keyDecisions.length` | Memory metadata `decision_count` equals the number of items in the `keyDecisions` array | Rendered .md metadata block | PASS if decision_count > 0 and matches array length; FAIL if decision_count is 0 despite supplied decisions | Check collect-session-data decision counting, input-normalizer keyDecisions mapping, and metadata-block rendering |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/17--governance/05-constitutional-gate-enforcement-rule-pack.md:19:In practice, this pack gives the memory system a compact "do not forget these rules" layer. The core gate-enforcement file is intentionally lean: it does not restate every gate in full, but instead keeps the most important trigger phrases, a gate cross-reference, quick-reference tables, and edge-case rules for continuation validation and compaction recovery. The companion constitutional README explains why this works operationally: constitutional memories are pinned to the top of search results, do not decay, and are designed to surface even when the user query is only loosely related.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/16-typed-traversal.md:26:**D3-002 Intent-aware edge traversal**: Maps classified query intents to edge-type priority orderings via `INTENT_EDGE_PRIORITY`. The traversal score is computed as `score = seedScore * edgePrior * hopDecay * freshness`. Edge prior scores are tiered: first-listed relation = 1.0, second = 0.75, remaining = 0.5. Supported intents include `fix_bug`, `add_feature`, `find_decision`, `understand`, `find_spec`, `refactor`, and `security_audit`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/186-memory-manage-command-routing.md:29:| 186 | /memory:manage command routing | Verify `/memory:manage` default stats dashboard and subcommand routing | `Validate /memory:manage command routing across the currently supported management modes. Capture the evidence needed to prove No-args shows stats dashboard; each subcommand routes to the correct MCP tool; unrecognized mode returns error. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Invoke `/memory:manage` with no arguments and verify the stats dashboard appears showing total, size, indexed date, tier distribution, and top folders via `memory_stats()` + `memory_list({ limit: 10, sortBy: "updated_at" })` 2) Invoke `/memory:manage scan` and verify `memory_index_scan()` is called 3) Invoke `/memory:manage scan --force` and verify force re-index is triggered 4) Invoke `/memory:manage health` and verify `memory_health()` is called 5) Invoke `/memory:manage checkpoint list` and verify `checkpoint_list()` is called 6) Invoke `/memory:manage checkpoint create test-snap` and verify `checkpoint_create()` is called 7) Invoke `/memory:manage ingest status abc-123` and verify `memory_ingest_status()` is called 8) Invoke `/memory:manage delete 42` and verify confirmation prompt appears before `memory_delete()` 9) Invoke `/memory:manage bulk-delete temporary --older-than 30` and verify confirmation prompt appears before `memory_bulk_delete()` 10) Invoke `/memory:manage invalid-mode` and verify `STATUS=FAIL ERROR="Unknown mode"` is returned | No-args shows stats dashboard; each subcommand routes to the correct MCP tool; unrecognized mode returns STATUS=FAIL error | Tool invocation logs for each subcommand; stats dashboard output for default mode; error output for unrecognized mode | PASS: Default shows stats dashboard, each subcommand invokes its dedicated tool, unrecognized mode errors cleanly; FAIL: Default mode skips stats, subcommand routes to wrong tool, or unrecognized mode does not error | Verify argument routing logic in Section 4 of manage.md → Check mode parsing in mandatory first action → Confirm tool-to-mode mapping → Inspect confirmation gates on destructive operations (delete, bulk-delete, checkpoint restore) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md:20:Spec documents are still indexed by default. When a scan touches `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research/research.md`, or `handover.md`, it routes that save through `memory_save` in warn-only quality mode so validation problems remain visible without dropping the document out of retrieval.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md:24:In incremental mode (the default), the scanner categorizes every discovered file into one of four buckets: to-index (new files), to-update (changed mtime or content hash), to-skip (unchanged mtime and matching content hash) and to-delete (files that disappeared from disk). The content-hash secondary check catches timestamp-preserving rewrites that would otherwise look unchanged from mtime alone. Batch processing with configurable `BATCH_SIZE` handles large workspaces, but oversized requests are clamped to the hard runtime maximum with a warning instead of exploding fan-out. Scan throttling now uses an atomic lease instead of a check-then-set cooldown gate: `acquireIndexScanLease()` reads `last_index_scan` and `scan_started_at` in one transaction, expires stale leases left behind by crashed scans, reserves a fresh run by writing `scan_started_at`, rejects overlapping fresh scans with `reason: 'lease_active'`, and still enforces `INDEX_SCAN_COOLDOWN` after completed runs with `reason: 'cooldown'`. The handler returns an E429 response with the computed wait time whenever either guard rejects the request.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/17--governance/01-feature-flag-governance.md:3:description: "Feature flag governance defines operational targets for keeping the active flag surface small with explicit sunset windows and periodic audits."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/17--governance/01-feature-flag-governance.md:10:Feature flag governance defines operational targets for keeping the active flag surface small with explicit sunset windows and periodic audits.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/17--governance/01-feature-flag-governance.md:20:A governance framework still defines process targets such as keeping the active flag surface small, setting sunset windows and running periodic audits. Those targets are not hard caps enforced in runtime code.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/01-typed-weighted-degree-channel.md:22:Cold-cache degree scoring now computes uncached candidate nodes in one batched SQL round-trip instead of one query per node. The query restricts edge scanning with `WHERE source_id IN (...) OR target_id IN (...)`, groups by candidate `node_id`, and caches the resolved global max typed degree alongside per-node boost values. This removes the prior N+1 query shape on cold cache while keeping repeat lookups in-memory until graph mutations invalidate the cache. When a memory has zero edges, the channel returns 0 rather than failing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:41:Use this simplified catalog as the plain-language companion to the full feature catalog. The numbered sections below keep the same capability grouping as the canonical reference, but explain the system in operator-friendly terms so readers can understand what each part does before diving into implementation details.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:49:| `020-feature-flag-reference` | [`19--feature-flag-reference/08-audit-phase-020-mapping-note.md`](./19--feature-flag-reference/08-audit-phase-020-mapping-note.md) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:104:This planned feature would let you pull out a single section from a large document by its heading, like opening a book directly to the chapter you need instead of flipping through the whole thing. It is not built yet because current documents are small enough that fetching the whole file works fine.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:132:You can rename a memory or change its priority without deleting and re-creating it. When you change the title, the system automatically updates its internal search index to match. If the update fails partway through, everything rolls back to the way it was before so you never end up with a half-changed record.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:142:This is the cleanup tool for large-scale housekeeping. You can delete all outdated or temporary memories in one go based on their importance level, like clearing out the recycling bin. The most important memories get extra protection so they cannot be accidentally wiped. A safety snapshot is taken first so you can restore if needed.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:238:This lets you draw a line between two memories to show they are related, like connecting pins on a corkboard with string. You can say one memory caused another, replaced another or contradicts another. These connections help the search system understand how ideas relate to each other and surface better results when you are tracing the history of a decision.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:246:This removes a connection between two memories. If you delete a memory entirely, all its connections are cleaned up automatically. You only need this tool when you want to remove a specific connection while keeping both memories intact, like cutting one thread on a corkboard without taking down the pins.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:338:Think of this like a report card for search quality, but with twelve different grades instead of just one pass/fail. Some grades tell you whether the best answer shows up first, others tell you whether all the right answers are found at all. Together they pinpoint exactly where search is struggling, like a doctor running multiple tests to find the real problem instead of just asking "do you feel sick?" The rank-based grades now count positions 1, 2, 3 in the returned list instead of reusing skipped internal rank labels, so MRR, NDCG, and MAP match standard IR math.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:342:Measuring performance can sometimes slow down the thing you are measuring, like how stepping on a scale while running would trip you up. This feature makes sure that all the quality-checking work happens quietly in the background. If the measurement process breaks, your searches keep running at full speed without noticing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:374:### Evaluation and housekeeping fixes
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:376:These are six small but important fixes for the testing and bookkeeping systems. They address issues like counters that reset when the system restarts, clean-up routines that did not run properly and safety guards for unexpected input. Think of it as tightening loose bolts: none were causing a breakdown yet, but leaving them loose would eventually cause trouble.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:380:Three different AI reviewers independently checked the codebase and found 14 issues that the original review missed. This is like getting a second and third opinion from different doctors: each one catches things the others overlooked. The fixes addressed problems ranging from tests that secretly passed when they should have failed to errors that were silently swallowed instead of reported.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:484:Converting text into the numerical format the search engine understands is the slowest and most expensive step. This feature saves those conversions so the system does not have to redo them when the same content is indexed again. It is like keeping a translated copy of a document instead of hiring the translator every time you need it. If the content has not changed, the saved version is used instantly.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:508:A search result can carry several different scores from different stages of processing. The final ranking step was only looking at two of them and skipping the most refined ones. This fix teaches it to check the best available score first and fall back through less precise options only when needed, like reading the final exam grade before the midterm before the homework score.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:616:Each project folder now has a short identity card describing what it contains. When you ask the system a question, it can check these identity cards first to figure out which folder holds the answer, skipping the need to search through everything. It is like reading the labels on filing cabinet drawers instead of opening every drawer to find what you need.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:628:Raw notes are full of formatting clutter like bullet markers, code fences and header symbols that have nothing to do with the actual meaning. This feature strips that clutter away before the system creates a searchable fingerprint of your content. The result is cleaner fingerprints that match your questions more accurately, like removing the wrapping paper so you can see what is actually inside the box. It also keeps batch type inference from merging multiple pathless drafts into one result during the preparation stage.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:632:When a large file is split into smaller pieces for indexing, not every piece carries useful information. Some are mostly whitespace or boilerplate. This feature scores each piece and drops the ones that add little value, keeping only the meaningful parts. It is like trimming the fat off a steak so you only store the good cuts.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:692:The quality gate normally rejects memories that are too short, but some types of content are naturally brief. A decision record might be only a few sentences but still be extremely valuable. This feature recognizes that short documents with strong structural signals (like a clear title and proper labels) are worth keeping, so they are not falsely rejected by the length check.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:752:Multiple parts of the system were figuring out where the database lives in their own way, each with its own hardcoded path. This fix created one shared place that knows the database location, and everyone else just asks it. It is like giving the whole team the same address book instead of each person keeping their own copy that might go out of date.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:804:Some memories are fundamental rules that should always come up when relevant, like "never delete production data." This feature tags those high-priority memories with instructions about when to surface them. It works like sticky notes on a filing cabinet that say "pull this file whenever someone asks about X." Those injected constitutional rows now obey global scope-enforcement rules, not just caller-supplied scope fields.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:812:Over time, stored memories can contradict each other or grow stale. This feature runs periodic housekeeping to spot conflicts, strengthen connections that get used often and flag relationships that have not been touched in months. Think of it as a librarian who regularly walks the shelves to catch duplicate entries and retire outdated references.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:952:After the system finishes its follow-up tasks on a save, it now reports how long those tasks took and whether any caches were cleared. This gives you a clearer picture of what happened behind the scenes, like a shipping notification that tells you not just "delivered" but also the delivery time and which steps were completed.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:980:This is a set of automated tests that checks the entire response from start to finish: hints are included, previously surfaced context is preserved and the size count is correct. It acts as a final quality check before a response leaves the system, like a shipping inspector who opens the box, verifies everything is inside and confirms the label is accurate before it goes out the door.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:1000:Instead of cutting off results abruptly when the response gets too long, the system now gives you a summary of all results first, shows previews of the top ones and provides a "show me more" option to page through the rest. It is like a search engine that shows ten results per page instead of dumping everything at once or hiding results beyond an arbitrary limit.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md:1052:These settings control diagnostic visibility. They adjust log verbosity and optional telemetry so you can inspect runtime behavior during debugging while keeping production output stable by default. This group also contains several legacy compatibility settings that are consumed by internal metadata snapshots and backward-compatibility paths, not just log and telemetry settings. Those roadmap flags are resolved live each time the helper runs, canonical `SPECKIT_MEMORY_*` keys override the older `SPECKIT_HYDRA_*` aliases, and shared memory stays off in roadmap snapshots until rollout is explicitly enabled so telemetry does not claim sharing is live before runtime access allows it.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/01-category-stub.md:25:The embedding warmup compatibility flags are inert. In `shared/embeddings.ts`, `shouldEagerWarmup()` always returns `false`, so `SPECKIT_EAGER_WARMUP` and `SPECKIT_LAZY_LOADING` no longer influence provider initialization. `context-server.ts` still carries the startup branch and emits a deprecation warning naming both flags, but the live startup path is the lazy-loading branch because the warmup predicate never flips.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/01-category-stub.md:43:| `shared/embeddings.ts` | Shared runtime | Hard-disables eager warmup by making `shouldEagerWarmup()` always return `false` and treating warmup flags as inert. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/062-progressive-validation-for-spec-documents-pi-b2.md:29:| 062 | Progressive validation for spec documents (PI-B2) | Confirm level 1-4 behavior | `Run progressive validation (PI-B2). Capture the evidence needed to prove Each validation level produces appropriate checks; level progression increases strictness; exit codes reflect severity; auto-fix diffs applied at permitted levels. Return a concise user-facing pass/fail verdict with the main reason.` | 1) run level1..4 2) inspect fixes/diffs 3) verify exit/report behavior | Each validation level produces appropriate checks; level progression increases strictness; exit codes reflect severity; auto-fix diffs applied at permitted levels | Validation output per level + exit codes + applied fix diffs | PASS if levels 1-4 produce progressively stricter validation and exit codes match severity | Verify validation level definitions; check exit code mapping; inspect auto-fix application logic |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md:3:description: "Covers seven fixes (of 9 planned) for graph integrity and cognitive scoring, including self-loop prevention, community debounce, WM score clamping and double-decay removal."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md:10:Covers seven fixes (of 9 planned) for graph integrity and cognitive scoring, including self-loop prevention, community debounce, WM score clamping and double-decay removal.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md:21:- **maxDepth clamping (#25):** `handleMemoryDriftWhy` clamps `maxDepth` to [1, 10] server-side.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/08-graph-and-cognitive-memory-fixes.md:24:- **WM score clamping (#29):** Working memory scores clamped to `[DECAY_FLOOR, 1.0]` to prevent mention boost from exceeding normalized range.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/238-spec-validation-rule-engine.md:29:| 238 | Spec Validation Rule Engine | Confirm clean validation, warning behavior, strict escalation, and recursive phase validation | `Validate the spec validation rule engine. Capture the evidence needed to prove validate.sh passes a compliant Level 3 fixture, returns a warning-bearing non-pass result on a known-bad template fixture, escalates that warning path under --strict, and returns recursive phase results for a valid phase parent. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/skill/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3 --json` 2) `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/skill/system-spec-kit/scripts/test-fixtures/054-template-extra-header || true` 3) `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/skill/system-spec-kit/scripts/test-fixtures/054-template-extra-header --strict || true` 4) `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/skill/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase --recursive --json` | Compliant fixture exits 0 with structured output; extra-header fixture surfaces warnings or non-pass status; strict mode does not silently downgrade issues; recursive JSON includes child phase results | Validation transcript for the warning-bearing fixture plus JSON output for the compliant and recursive runs | PASS if the compliant and phased fixtures pass, the warning fixture is surfaced, and strict mode remains more restrictive than the default run | Inspect `scripts/spec/validate.sh`, `.speckit.yaml` rule ordering, and `scripts/rules/check-*.sh` severity mapping if warnings, strict escalation, or recursive phase reporting are inconsistent |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/fact-coercion.ts:9:// silently dropping object-shaped content at extractor boundaries.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/README.md:50:| **Data Validation** | Transforms and validates spec folder data structures with flag mappings |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/README.md:129:├── data-validator.ts          # Data structure validation and flag mappings
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/README.md:182:| `data-validator.ts` | Validates and transforms spec folder data structures. Applies flag mappings for arrays and presence checks |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/data-validator.ts:13:/** Mapping of array field names to their corresponding boolean flag field names */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/data-validator.ts:14:export interface ArrayFlagMappings {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/data-validator.ts:18:/** Mapping of presence field names to their corresponding boolean flag field names */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/data-validator.ts:19:export interface PresenceFlagMappings {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/data-validator.ts:35:const ARRAY_FLAG_MAPPINGS: ArrayFlagMappings = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/data-validator.ts:47:const PRESENCE_FLAG_MAPPINGS: PresenceFlagMappings = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/18--ux-hooks/212-mutation-hook-result-contract-expansion.md:29:| 212 | Mutation hook result contract expansion | Confirm post-mutation hook results expose timing, cache invalidation booleans, and surfaced error details | `Validate the expanded post-mutation hook result contract. Capture the evidence needed to prove hook results include latencyMs, cache-clear booleans, toolCacheInvalidated counts, and surfaced error strings, and that the UX feedback layer reflects those fields in user-facing hints. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/mutation-hooks.vitest.ts tests/hooks-mutation-wiring.vitest.ts tests/hooks-ux-feedback.vitest.ts` 2) inspect assertions covering `latencyMs`, cache-clear booleans, `toolCacheInvalidated`, and `errors` 3) inspect assertions proving UX feedback/hint builders surface the contract fields without dropping error context | Hook and UX feedback suites pass, hook results include `latencyMs`, cache-clear booleans, `toolCacheInvalidated`, and `errors`, and UX feedback assertions reflect those values in response hints | Test transcript + highlighted assertion names or output snippets showing contract-field and hint coverage | PASS if the suites pass and the assertions prove the expanded hook-result contract is present and consumable end to end | Inspect `handlers/memory-crud-types.ts`, `handlers/mutation-hooks.ts`, and `hooks/mutation-feedback.ts` if any field disappears or changes type |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts:69: * Normalizes a raw memory name candidate by stripping filename artifacts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts:142: * and quality heuristics, skipping generic or contaminated entries.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/14-llm-graph-backfill.md:12:The default save path extracts graph edges using deterministic heuristics (no LLM calls). This feature adds a second pass for documents that are deemed high-value: an asynchronous LLM call generates additional edges that the heuristic pass would miss. Think of it as a careful second opinion that only runs for the most important documents. It never blocks the save operation and is enabled by default unless `SPECKIT_LLM_GRAPH_BACKFILL=false`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/18--ux-hooks/210-memory-health-autorepair-metadata.md:29:| 210 | Memory health autoRepair metadata | Confirm confirmation-only autoRepair behavior and structured repair metadata with partial-success reporting | `Validate memory_health autoRepair metadata in full report mode. Capture the evidence needed to prove unconfirmed autoRepair requests return a confirmation-only payload, confirmed repairs return structured repair actions, and mixed outcomes set repaired and partialSuccess exactly as documented. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/handler-memory-health-edge.vitest.ts tests/memory-crud-extended.vitest.ts` 2) inspect assertions covering confirmation-only responses for `autoRepair:true` without `confirmed:true` 3) inspect assertions covering FTS rebuild, orphan cleanup, and partial-success repair metadata | The health suites pass, unconfirmed `autoRepair:true` requests return confirmation-only guidance, confirmed repairs emit structured `repair.actions`, and mixed outcomes report `repair.repaired: false` with `repair.partialSuccess: true` when only part of the repair succeeds | Test transcript + highlighted assertion names or output snippets for confirmation-only and partial-success cases | PASS if the health suites pass and the assertions prove confirmation-only gating plus structured repair metadata and partial-success semantics | Inspect `handlers/memory-crud-health.ts`, `handlers/memory-crud-types.ts`, and response-envelope shaping for `repair` payload regressions |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md:24:The parameter surface is wide. You control result count (`limit`, 1-100), spec folder scoping, tier and context type filtering, intent (explicit or auto-detected), reranking toggle, length penalty, temporal decay, minimum memory state (`minState`, default `"WARM"`, range HOT through ARCHIVED), constitutional inclusion, content inclusion, anchor filtering, session dedup, session boosting, causal boosting, minimum quality threshold, cache bypass and access tracking. Most defaults are sensible. You typically send a query and a session ID and let everything else run at defaults.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/07-ast-level-section-retrieval-tool.md:12:This planned feature would let you pull out a single section from a large document by its heading, like opening a book directly to the chapter you need instead of flipping through the whole thing. It is not built yet because current documents are small enough that fetching the whole file works fine.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/11-working-set-tracker.md:3:description: "Working-set tracker tracks files and symbols accessed during a session using recency-weighted scoring for compaction priority."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/11-working-set-tracker.md:10:Working-set tracker tracks files and symbols accessed during a session using recency-weighted scoring for compaction priority.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:47:| `020-feature-flag-reference` | Covered by [`19--feature-flag-reference/`](19--feature-flag-reference/01-1-search-pipeline-features-speckit.md) via slug match (`feature-flag-reference`). See [`19--feature-flag-reference/08-audit-phase-020-mapping-note.md`](19--feature-flag-reference/08-audit-phase-020-mapping-note.md). |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:82:Each mode has a token budget. Quick gets 800 tokens. Focused gets 1,500. Deep gets 2,000. Resume gets 1,200. After retrieval, the orchestrator estimates token count (1 token per 4 characters) and enforces the budget by stripping lowest-scored results from the tail until the response fits. A dedicated `enforceTokenBudget()` function handles the truncation with detailed tracking of original and returned result counts. Auto-resume `systemPromptContext` injection now happens before that budget pass runs, so resume-mode context items count toward the advertised limit instead of being appended afterward and pushing the final envelope over budget. When your overall context is running high, a pressure policy kicks in. When the `tokenUsage` ratio exceeds 0.60, the system downgrades to focused mode. Above 0.80, it switches to quick mode. The pressure policy is gated by `SPECKIT_PRESSURE_POLICY` and subject to rollout percentage via `SPECKIT_ROLLOUT_PERCENT`. You can override the mode and intent manually, but the auto-detection handles most cases correctly.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:86:Session management is caller-scoped. Passing `sessionId` enables cross-turn deduplication and lets the handler resume an existing working-memory session. If you do not pass `sessionId`, the handler generates an ephemeral UUID for internal bookkeeping for that single call only. In resume mode, `systemPromptContext` is injected only when auto-resume is enabled, the effective mode resolves to `resume` and the caller supplied a reusable `sessionId`. Anonymous calls do not revive prior session context.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:110:The parameter surface is wide. You control result count (`limit`, 1-100), spec folder scoping, tier and context type filtering, intent (explicit or auto-detected), reranking toggle, length penalty, temporal decay, minimum memory state (`minState`, default `"WARM"`, range HOT through ARCHIVED), constitutional inclusion, content inclusion, anchor filtering, session dedup, session boosting, causal boosting, minimum quality threshold, cache bypass and access tracking. Most defaults are sensible. You typically send a query and a session ID and let everything else run at defaults.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:128:`memory_quick_search` is a live MCP tool, not just a README alias. The dispatcher in `tools/memory-tools.ts` validates the tool's narrowed input schema and forwards the call to `memory_search` with a fixed profile: `autoDetectIntent=true`, `enableDedup=true`, `includeContent=true`, `includeConstitutional=true`, and `rerank=true`. The public arguments are intentionally narrow: `query`, `limit`, `specFolder`, `tenantId`, `userId`, `agentId`, and `sharedSpaceId`. That makes it useful for fast governed retrieval while keeping the heavyweight search configuration surface on `memory_search`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:232:This planned feature would let you pull out a single section from a large document by its heading, like opening a book directly to the chapter you need instead of flipping through the whole thing. It is not built yet because current documents are small enough that fetching the whole file works fine.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:362:You can rename a memory or change its priority without deleting and re-creating it. When you change the title, the system automatically updates its internal search index to match. If the update fails partway through, everything rolls back to the way it was before so you never end up with a half-changed record.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:408:This is the cleanup tool for large-scale housekeeping. You can delete all outdated or temporary memories in one go based on their importance level, like clearing out the recycling bin. The most important memories get extra protection so they cannot be accidentally wiped. A safety snapshot is taken first so you can restore if needed.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:444:The confidence read-compute-write segment (`recordValidation`) runs within a single SQLite transaction to prevent concurrent validation updates from racing and dropping writes. Downstream side effects (auto-promotion, negative-feedback persistence, learned feedback and ground-truth logging) execute after that transactional segment.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:472:Shared-memory spaces let multiple users or agents access the same pool of knowledge under a deny-by-default membership model. Four shipped tools provide workspace-level scoping beyond per-spec-folder filtering: create or update spaces, control user/agent access, inspect rollout status, and enable the subsystem. All four tools are live under the `/memory:manage shared` command.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:483:The original full namespace CRUD (`list/create/switch/delete`) for complete multi-tenant isolation remains deferred. Current scoping relies on logical `specFolder` filtering augmented by the shared-memory tools above.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:583:Embedding-status totals now treat `partial` as a first-class state instead of silently dropping it. `get_status_counts()` initializes and returns a `partial` bucket, and `get_stats()` includes that bucket in the headline total. That keeps `memory_stats` aligned with chunked and partially indexed rows that already exist elsewhere in the vector-index state model.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:801:This lets you draw a line between two memories to show they are related, like connecting pins on a corkboard with string. You can say one memory caused another, replaced another or contradicts another. These connections help the search system understand how ideas relate to each other and surface better results when you are tracing the history of a decision.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:843:This removes a connection between two memories. If you delete a memory entirely, all its connections are cleaned up automatically. You only need this tool when you want to remove a specific connection while keeping both memories intact, like cutting one thread on a corkboard without taking down the pins.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:977:This is a read-only module. It queries the eval database and produces reports with no writes or mutation side effects. The accessor now tries `getEvalDb()` before falling back to `initEvalDb()`, so it keeps using an already-selected non-default or test eval DB instead of silently switching back to the default one. Two different limits apply: the request `limit` keeps only the most recent sprint groups after grouping, while `SPECKIT_DASHBOARD_LIMIT` caps dashboard SQL reads. Snapshot rows are still fetched directly, but channel data is grouped per included eval-run/channel pair before sprint aggregation so large per-query histories do not starve the kept sprint groups.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1075:**B5: Connection-map isolation and constitutional cache scoping:** `vector-index-store.ts` no longer lets `initialize_db(custom_path)` overwrite the module-global default connection. Connections are tracked in `db_connections = new Map<string, Database.Database>()` keyed by resolved path, globals are updated only for the validated default store and `close_db()` closes every tracked handle. The constitutional-memory cache key now also includes the `includeArchived` flag, preventing archived-inclusive results from leaking into archived-exclusive reads.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1191:The `cleanupOldSessions()` method in the working memory manager compared `last_focused` timestamps (stored via SQLite `CURRENT_TIMESTAMP` as `YYYY-MM-DD HH:MM:SS`) against JavaScript `toISOString()` output (`YYYY-MM-DDTHH:MM:SS.sssZ`). The lexicographic comparison failed because space (ASCII 32) sorts before `T` (ASCII 84), causing active sessions to be incorrectly deleted. The fix replaces the JavaScript Date comparison with SQLite-native `datetime()` math: `DELETE FROM working_memory WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')`, keeping the comparison entirely within SQLite's datetime system.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1209:A separate SQLite database (`speckit-eval.db`) stores retrieval quality data in five tables: `eval_queries`, `eval_channel_results`, `eval_final_results`, `eval_ground_truth` and `eval_metric_snapshots`. Keeping evaluation data in its own database is a deliberate security decision. The main search database should never carry evaluation artifacts that could leak into production results.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1223:Think of this like a report card for search quality, but with twelve different grades instead of just one pass/fail. Some grades tell you whether the best answer shows up first, others tell you whether all the right answers are found at all. Together they pinpoint exactly where search is struggling, like a doctor running multiple tests to find the real problem instead of just asking "do you feel sick?"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1229:Eight diagnostic metrics add depth. Inversion rate counts pairwise ranking mistakes. Constitutional surfacing rate tracks whether high-priority memories appear in top results. Importance-weighted recall favors recall of critical content. Cold-start detection rate measures whether fresh memories surface when relevant. Precision@K and F1@K expose precision/recall balance. MAP captures ranking quality across the full relevant set. Intent-weighted NDCG adjusts ranking quality by query type.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1245:Measuring performance can sometimes slow down the thing you are measuring, like how stepping on a scale while running would trip you up. This feature makes sure that all the quality-checking work happens quietly in the background. If the measurement process breaks, your searches keep running at full speed without noticing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1311:If BM25 had been competitive, the entire multi-channel approach would be questioned. Instead, the gap confirmed that hybrid retrieval adds real value over keyword search. The contingency decision to proceed with the full program was based on this measurement. No opinions, no intuitions, just a number. The in-memory BM25 channel (distinct from FTS5) runs behind the `ENABLE_BM25` flag (default ON, set `ENABLE_BM25=false` to disable).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1369:The reporting dashboard aggregates per-sprint metric summaries (mean, min, max, latest and count) and per-channel performance views (hit count, average latency and query count) from the evaluation database. Trend analysis compares consecutive runs to detect regressions. Sprint labels are inferred from metadata JSON. A `isHigherBetter()` helper correctly interprets trend direction for different metric types. The dashboard now calls `getEvalDb()` before falling back to `initEvalDb()`, which preserves an already-selected non-default or test eval DB instead of silently switching back to the default one. Its request `limit` is the number of sprint groups kept after grouping, not the number of raw eval runs fetched. Both the ablation runner and the dashboard are exposed as new MCP tools: `eval_run_ablation` and `eval_reporting_dashboard`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1405:### Evaluation and housekeeping fixes
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1409:These are six small but important fixes for the testing and bookkeeping systems. They address issues like counters that reset when the system restarts, clean-up routines that did not run properly and safety guards for unexpected input. Think of it as tightening loose bolts: none were causing a breakdown yet, but leaving them loose would eventually cause trouble.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1424:See [`09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md`](09--evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md) for full implementation and test file listings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1432:Three different AI reviewers independently checked the codebase and found 14 issues that the original review missed. This is like getting a second and third opinion from different doctors: each one catches things the others overlooked. The fixes addressed problems ranging from tests that secretly passed when they should have failed to errors that were silently swallowed instead of reported.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1650:- **maxDepth clamping (#25):** `handleMemoryDriftWhy` clamps `maxDepth` to [1, 10] server-side.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1653:- **WM score clamping (#29):** Working memory scores clamped to `[DECAY_FLOOR, 1.0]` to prevent mention boost from exceeding normalized range.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1745:Typed traversal enables sparse-first graph policy and intent-aware edge traversal for causal boost scoring, constraining traversal to typed 1-hop expansion in sparse graphs and mapping query intents to edge-type priority orderings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1749:Enabled by default (graduated). Set `SPECKIT_TYPED_TRAVERSAL=false` to disable. When graph density falls below `SPARSE_DENSITY_THRESHOLD = 0.5`, community detection is disabled and traversal is constrained to `SPARSE_MAX_HOPS = 1` typed expansion. Intent-aware edge traversal maps classified query intents to edge-type priority orderings via `INTENT_EDGE_PRIORITY`. The traversal score is computed as `score = seedScore * edgePrior * hopDecay * freshness`. Edge prior scores are tiered: first-listed relation = 1.0, second = 0.75, remaining = 0.5.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:1911:Converting text into the numerical format the search engine understands is the slowest and most expensive step. This feature saves those conversions so the system does not have to redo them when the same content is indexed again. It is like keeping a translated copy of a document instead of hiring the translator every time you need it. If the content has not changed, the saved version is used instantly.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2013:**C1: Composite score overflow:** `composite-scoring.ts` used `Math.max(0, composite)` which allowed scores above 1.0. Changed to `Math.max(0, Math.min(1, composite))` clamping to [0,1] across scoring paths.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2033:A search result can carry several different scores from different stages of processing. The final ranking step was only looking at two of them and skipping the most refined ones. This fix teaches it to check the best available score first and fall back through less precise options only when needed, like reading the final exam grade before the midterm before the homework score.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2037:`effectiveScore()` in `stage3-rerank.ts` only checked `score` then `similarity/100`, skipping `intentAdjustedScore` and `rrfScore` from Stage 2 enrichment. The fix updated the fallback chain to: `intentAdjustedScore -> rrfScore -> score -> similarity/100`, all clamped [0,1] with `isFinite()` guards. Cross-encoder document mapping and MMR candidate scoring now use `effectiveScore()` instead of inline fallbacks. A `stage2Score` field was added to `PipelineRow` in `types.ts` for auditability when Stage 3 overwrites scores.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2065:In the non-hybrid flow, after Step 4 applies `intentAdjustedScore`, subsequent pipeline steps (artifact routing, feedback signals, session boost, and causal boost) can mutate `score`. Since `resolveEffectiveScore()` prefers `intentAdjustedScore` over `score`, later modifications were invisible in final ranking. A synchronization pass now flat-overwrites the score aliases by clamping the current value and writing the same number into `score`, `rrfScore`, and `intentAdjustedScore` via `withSyncedScoreAliases()` and `syncScoreAliasesInPlace()`. This keeps downstream ranking consistent with the latest pipeline score; it does not preserve the prior value with `Math.max(...)`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2171:Calibrated overlap bonus replaces the flat convergence bonus in RRF fusion with a query-aware scaled bonus that accounts for the number of overlapping channels and the mean normalized top score.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2187:RRF K experimental tuning enables per-intent K-value selection for Reciprocal Rank Fusion, sweeping candidate K values and selecting the one that maximizes NDCG@10 per query intent.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2497:Each project folder now has a short identity card describing what it contains. When you ask the system a question, it can check these identity cards first to figure out which folder holds the answer, skipping the need to search through everything. It is like reading the labels on filing cabinet drawers instead of opening every drawer to find what you need.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2531:`content-normalizer.ts` instead of ad hoc inline frontmatter stripping.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2546:clamping before incrementing, keeping invalid numeric values from escaping into
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2601:Raw notes are full of formatting clutter like bullet markers, code fences and header symbols that have nothing to do with the actual meaning. This feature strips that clutter away before the system creates a searchable fingerprint of your content. The result is cleaner fingerprints that match your questions more accurately, like removing the wrapping paper so you can see what is actually inside the box.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2621:When a large file is split into smaller pieces for indexing, not every piece carries useful information. Some are mostly whitespace or boilerplate. This feature scores each piece and drops the ones that add little value, keeping only the meaningful parts. It is like trimming the fat off a steak so you only store the good cuts.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2822:Stateless `generate-context.js` saves now enrich thin OpenCode-derived session data with spec-folder and git context before rendering, while keeping contamination defenses in place.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:2831:Git extraction also preserves uncommitted file context in freshly initialized repositories that do not have a `HEAD` commit yet, survives detached-HEAD saves without dropping commit identity, and parses multi-commit history without leaking similarly named foreign spec folders into the target result.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3037:The combined multiplier is bounded to 0.8-1.2 via a clamping function, composed of quality factor (0.9-1.1), spec level bonus (0-0.06), completion bonus (0-0.04) and checklist bonus (0-0.01). Well-maintained documentation ranks slightly above neglected documentation when both are relevant. No feature flag. Always active.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3182:Multiple parts of the system were figuring out where the database lives in their own way, each with its own hardcoded path. This fix created one shared place that knows the database location, and everyone else just asks it. It is like giving the whole team the same address book instead of each person keeping their own copy that might go out of date.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3394:Some memories are fundamental rules that should always come up when relevant, like "never delete production data." This feature tags those high-priority memories with instructions about when to surface them. It works like sticky notes on a filing cabinet that say "pull this file whenever someone asks about X."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3432:Over time, stored memories can contradict each other or grow stale. This feature runs periodic housekeeping to spot conflicts, strengthen connections that get used often and flag relationships that have not been touched in months. Think of it as a librarian who regularly walks the shelves to catch duplicate entries and retire outdated references.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3464:The summary channel is integrated as an additional Stage 1 retrieval channel alongside hybrid, vector and multi-concept paths. Stage 1 adapts summary hits into full `PipelineRow` candidates by hydrating `memory_index` rows, assigning `similarity` / `score`, then merging and deduplicating by memory ID with baseline candidates taking priority.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3578:`check-architecture-boundaries.ts` enforces both rules as part of `npm run check`. GAP A walks all `.ts` files in `shared/`, extracts module specifiers (skipping block and line comments), and flags any import matching relative paths to `mcp_server/` or `scripts/` at any depth, or package-form `@spec-kit/mcp-server/` or `@spec-kit/scripts/`. This is an absolute prohibition with no allowlist.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3685:Non-MCP `spec-kit-cli` entry point (`cli.ts`) for database maintenance. Four commands: `stats` (tier distribution, top folders, schema version), `bulk-delete` (with --tier, --folder, --older-than, --dry-run, --skip-checkpoint, where constitutional/critical tiers require folder scope), `reindex` (--force, --eager-warmup), `schema-downgrade` (--to 15, --confirm). Transaction-wrapped deletions, checkpoint creation before bulk-delete, mutation ledger recording. Invoked as `node cli.js <command>` from any directory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3747:MODULE_MAP.md documents internal module ownership, dependency directions, feature catalog mapping, and canonical locations for all 26 `lib/` subdirectories. It makes module boundaries explicit for dead-code analysis, refactoring, and dependency enforcement.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3879:Session capturing pipeline quality is the current reality-alignment feature for `009-perfect-session-capturing`. It covers the full shipped session-capture path for `generate-context.js`: (1) Part I hardening across session extraction, file writing, contamination filtering, alignment blocking, and config-driven limits; (2) spec-folder and git context enrichment for JSON-mode saves; (3) numeric quality-score calibration so thin saves score lower than rich ones; (4) one shared semantic sufficiency gate so aligned but under-evidenced memories fail explicitly instead of indexing; (5) one shared rendered-memory template contract so malformed ANCHOR/frontmatter output fails before write/index; (6) a fully refreshed canonical verification and manual-testing record; (7) JSON-only routine-save contract; (8) Wave 2 count/confidence hardening for decision confidence, truncated outcomes, and stable `git_changed_file_count` priority.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:3883:The shipped session-capture pipeline enforces crypto session IDs, atomic batch writes with rollback, contamination filtering, quality abort thresholds, alignment blocking, and configurable pipeline constants. Structured `--stdin` / `--json` input is the only save path; direct positional saves exit non-zero with migration guidance. A semantic sufficiency gate rejects aligned but under-evidenced saves with `INSUFFICIENT_CONTEXT_ABORT`. Rendered memory files preserve ANCHOR comments through post-render cleanup, render session-specific trigger phrases, and accept both camelCase and snake_case save contracts. The shared rendered-memory template contract validates structural output before write/index so routine saves stay structurally clean. Decision confidence, truncated outcome handling, and `git_changed_file_count` follow stable priority chains that respect explicit input values.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4009:Current mapping: this content is tracked under spec `006-ux-hooks-automation`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4076:Phase 014 aligned runtime validation and TypeScript contracts for mutation-safety behavior. The finalized state keeps `checkpoint_delete.confirmName` required across handler, schema and tool-boundary typing, and keeps the shared mutation-hook result contract synchronized for all mutation handlers.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4104:After the system finishes its follow-up tasks on a save, it now reports how long those tasks took and whether any caches were cleared. This gives you a clearer picture of what happened behind the scenes, like a shipping notification that tells you not just "delivered" but also the delivery time and which steps were completed.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4216:This is a set of automated tests that checks the entire response from start to finish: hints are included, previously surfaced context is preserved and the size count is correct. It acts as a final quality check before a response leaves the system, like a shipping inspector who opens the box, verifies everything is inside and confirms the label is accurate before it goes out the door.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4435:| `SPECKIT_EAGER_WARMUP` | inert | boolean | `shared/embeddings.ts` | Deprecated inert alias for the removed eager-warmup toggle. The embedding provider always initializes lazily now, so setting this flag does not restore startup warmup. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4467:| `SPECKIT_LAZY_LOADING` | inert | boolean | `shared/embeddings.ts` | Deprecated inert alias for the removed eager-warmup toggle. Lazy provider initialization is now the permanent default, and both `SPECKIT_LAZY_LOADING` and `SPECKIT_EAGER_WARMUP` are documented compatibility no-ops. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:4628:These settings control diagnostic visibility. They adjust log verbosity and optional telemetry so you can inspect runtime behavior during debugging while keeping production output stable by default.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/245-evaluation-benchmark-and-import-policy-tooling.md:19:- Prompt: `Validate the evaluation, benchmark, and import-policy tooling surface. Capture the evidence needed to prove the ground-truth mapping helper previews the active parent-memory DB, the ablation runner completes with SPECKIT_ABLATION enabled, the BM25 baseline runner emits its benchmark output, the performance benchmark runner writes artifacts into the target spec scratch directory, and the architecture-boundary plus import-policy suites pass. Flag token-budget-overflow runs that collapse below recallK as investigation-only rather than clean benchmarks. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/245-evaluation-benchmark-and-import-policy-tooling.md:20:- Expected signals: mapping preview logs DB provenance; ablation run succeeds and writes JSON; BM25 baseline run completes; performance benchmark writes scratch artifacts; policy suites pass
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/245-evaluation-benchmark-and-import-policy-tooling.md:29:| 245 | Evaluation, benchmark, and import-policy tooling | Confirm ground-truth provenance, ablation, BM25 baseline, performance benchmark, and import-policy tooling coverage | `Validate the evaluation, benchmark, and import-policy tooling surface. Capture the evidence needed to prove the ground-truth mapping helper previews the active parent-memory DB, the ablation runner completes with SPECKIT_ABLATION enabled, the BM25 baseline runner emits its benchmark output, the performance benchmark runner writes artifacts into the target spec scratch directory, and the architecture-boundary plus import-policy suites pass. Flag token-budget-overflow runs that collapse below recallK as investigation-only rather than clean benchmarks. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `npx tsx .opencode/skill/system-spec-kit/scripts/evals/map-ground-truth-ids.ts --dry-run` 2) `SPECKIT_ABLATION=true npx tsx .opencode/skill/system-spec-kit/scripts/evals/run-ablation.ts` 3) `npx tsx .opencode/skill/system-spec-kit/scripts/evals/run-bm25-baseline.ts --verbose` 4) `npx tsx --tsconfig .opencode/skill/system-spec-kit/scripts/tsconfig.json .opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts system-spec-kit/022-hybrid-rag-fusion` 5) `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/architecture-boundary-enforcement.vitest.ts tests/import-policy-rules.vitest.ts` | Mapping preview logs DB provenance; ablation and BM25 runners complete with report output; performance benchmark writes `performance-benchmark-metrics.json` and `performance-benchmark-report.md` into the target scratch directory; policy suites pass | Runner stdout plus the generated benchmark artifacts under the target spec folder's `scratch/` directory and the Vitest transcript | PASS if all five steps complete and the benchmark artifacts plus policy checks match the documented current behavior, with invalid benchmarks explicitly labeled | Inspect `scripts/evals/map-ground-truth-ids.ts`, `run-ablation.ts`, `run-bm25-baseline.ts`, `run-performance-benchmarks.ts`, `check-architecture-boundaries.ts`, and `import-policy-rules.ts` if provenance, runner behavior, or policy checks fail |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:126:    local current_priority=""
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:130:            current_priority="${BASH_REMATCH[1]}"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:136:            local item_priority=""
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:148:                item_priority="${BASH_REMATCH[1]}"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:149:            elif [[ -n "$current_priority" ]]; then
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:150:                item_priority="$current_priority"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:166:                if [[ "$item_priority" == "P0" && "$has_evidence" == "false" ]]; then
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:169:                if [[ "$item_priority" == "P1" && "$has_evidence" == "false" ]]; then
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:174:            case "$item_priority" in
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:265:    "priorityContextMissing": $UNTAGGED_TOTAL,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh:357:            echo -e "  Missing priority context on checklist items. Add P0/P1/P2 headers or inline tags." >&2
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:413:        verbose "Skipping backup cleanup (--keep-backups)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:418:        verbose "DRY RUN: Would clean up old backups (keeping 3 most recent)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:431:        verbose "Backup cleanup: $count backups found, nothing to remove (keeping 3)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:554:        warn "plan.md not found in $SPEC_FOLDER — skipping plan upgrade"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:565:        info "plan.md already contains '$idempotency_pattern' — skipping"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:633:        warn "checklist.md not found in $SPEC_FOLDER — skipping checklist upgrade"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:644:        info "checklist.md already contains L3+ sections — skipping"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:705:                info "checklist.md already exists — skipping creation"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:730:                info "decision-record.md already exists — skipping creation"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:784:        warn "spec.md not found in $SPEC_FOLDER — skipping spec upgrade"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:795:        info "spec.md already contains L2 sections — skipping"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:893:        warn "spec.md not found in $SPEC_FOLDER — skipping spec upgrade"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:909:        info "spec.md already contains EXECUTIVE SUMMARY — skipping L2→L3 upgrade"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:1076:        warn "spec.md not found in $SPEC_FOLDER — skipping spec upgrade"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:1087:        info "spec.md already contains APPROVAL WORKFLOW — skipping L3→L3+ upgrade"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:1091:        info "spec.md already contains L3+ APPROVAL section — skipping"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh:1462:        info "DRY RUN: Skipping backup"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:22:Each mode has a token budget. Quick gets 800 tokens. Focused gets 1,500. Deep gets 2,000. Resume gets 1,200. After retrieval, the orchestrator estimates token count (1 token per 4 characters) and enforces the budget by stripping lowest-scored results from the tail until the response fits. A dedicated `enforceTokenBudget()` function handles the truncation with detailed tracking of original and returned result counts. Auto-resume `systemPromptContext` injection now happens before that budget pass runs, so resume-mode context items count toward the advertised limit instead of being appended afterward and pushing the final envelope over budget. When your overall context is running high, a pressure policy kicks in. When the `tokenUsage` ratio exceeds 0.60, the system downgrades to focused mode. Above 0.80, it switches to quick mode. The pressure policy is gated by `SPECKIT_PRESSURE_POLICY` and subject to rollout percentage via `SPECKIT_ROLLOUT_PERCENT`. You can override the mode and intent manually, but the auto-detection handles most cases correctly.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:26:Session management is caller-scoped. Passing `sessionId` enables cross-turn deduplication and lets the handler resume an existing working-memory session. If you do not pass `sessionId`, the handler generates an ephemeral UUID for internal bookkeeping for that single call only. In resume mode, `systemPromptContext` is injected only when auto-resume is enabled, the effective mode resolves to `resume` and the caller supplied a reusable `sessionId`. Anonymous calls do not revive prior session context.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/create.sh:572:        >&2 echo "[speckit] Skipping branch creation (--skip-branch)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/01-ablation-studies-evalrunablation.md:22:The MCP handler normalizes chunk-backed hits to canonical parent memory IDs with `parentMemoryId ?? row.id` before scoring. Before reporting results, the ablation path also validates ground-truth alignment: requested query IDs are split into resolved and missing sets, missing IDs are surfaced as warnings, and chunk-backed or orphaned mappings raise an explicit alignment error with guidance to rerun `scripts/evals/map-ground-truth-ids.ts --write`. Operators should only compare stored ablation runs when the active `context-index.sqlite` matches the ground-truth parent IDs and the live search path is still returning up to `recallK` candidates rather than collapsing below `K` because of token-budget truncation.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/198-temporal-structural-coherence-scoring.md:29:| 198 | Temporal-structural coherence scoring | Confirm structural penalties, bounded coherence deductions, and immediate retry behavior in the quality loop | `Verify temporal-structural coherence scoring in the quality loop using one well-formed control memory and flawed variants. Submit variants that are too short or missing headings, include a future-dated completion claim, and include self-referential or unresolved causal links. Confirm the coherence breakdown applies the expected structural checks and bounded penalties, and verify that low-coherence content is rejected or downgraded while the quality loop retry cycle stays immediate and bounded. Capture the score breakdown and return a concise user-facing pass/fail verdict with the main reason.` | 1) Prepare a well-formed control memory plus flawed variants covering short or heading-less content, future-dated completion claims, and broken causal-link metadata 2) Run the quality loop or ingest path for each case 3) Inspect the coherence score breakdown and quality-loop decision for control vs flawed variants 4) Confirm penalties apply to temporal and causal-link issues without inventing broader chronology logic 5) For an auto-fixable case, capture the retry cycle and confirm retries occur immediately with no backoff and stop within the configured limit | Structural checks evaluate content presence, minimum length, and headings; future-dated completion claims reduce coherence; self-referential or unresolved causal links reduce coherence; low-coherence variants are rejected or downgraded; retry attempts are immediate and bounded | Quality-loop transcript, coherence score breakdown, control-vs-variant results, and retry timing evidence | PASS: coherence penalties appear for the flawed variants, low-quality cases are blocked or downgraded, and retry timing stays immediate and bounded; FAIL: penalties are missing, weak content passes without explanation, or retries show unexpected backoff or unbounded looping | Verify control content satisfies structural checks -> Inspect coherence penalty branches for future-dated claims and causal links -> Confirm rejection threshold or downgrade path -> Check retry loop configuration and attempt count -> Ensure broader chronology analysis was not assumed in the verdict |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/07--evaluation/02-reporting-dashboard-evalreportingdashboard.md:22:Runtime behavior is read-only after initialization. The dashboard path queries the eval database and produces reports without mutating stored eval rows, but its first call can trigger initialization if no eval DB has been selected yet. The accessor now tries `getEvalDb()` before falling back to `initEvalDb()`, so dashboard generation keeps using an already-selected non-default or test eval DB instead of silently switching back to the default one. Two different limits apply: the request `limit` keeps only the most recent sprint groups after grouping, using each group's `lastSeen` timestamp for recency, while `SPECKIT_DASHBOARD_LIMIT` caps dashboard SQL reads. Returned reports still render sprint groups chronologically and preserve the per-channel breakdown for every kept sprint group. Snapshot rows are still fetched directly, but channel data is grouped per included eval-run/channel pair before sprint aggregation so large per-query histories do not starve the kept sprint groups.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/196-tool-level-ttl-cache.md:29:| 196 | Tool-level TTL cache | Confirm per-tool cache hits, TTL expiry, and mutation-driven invalidation | `Verify the tool-level TTL cache on a repeated expensive request. Run the same request twice within the active TTL window and confirm the second run is served from the per-tool cache using the same SHA-256 cache key. Then invalidate the relevant search path with a mutation or wait for TTL expiry and verify the next run recomputes instead of serving stale data. Capture hit, miss, eviction or invalidation evidence and return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm current cache settings, including active TTL window 2) Run a repeatable expensive request such as the same `memory_search` twice with identical inputs 3) Inspect cache stats or trace output to confirm miss then hit on the same tool/input key 4) Perform a relevant mutation such as `memory_save`, `memory_update`, or `memory_delete`, or wait past TTL expiry 5) Re-run the same request and confirm recomputation plus invalidation or expiry accounting | First run is a miss; second identical run is a hit; cache key is stable for identical tool+input; stats show hit/miss/invalidation activity; post-mutation or post-expiry run recomputes instead of returning stale data | Terminal transcript, cache stats or logs, repeated request output, and post-mutation or post-expiry rerun evidence | PASS: second identical run is a cache hit and the next run after invalidation or expiry recomputes cleanly; FAIL: repeated request misses inside TTL, stale results survive invalidation, or stats contradict the observed behavior | Verify TTL config and max-entry settings -> Confirm identical tool/input payloads were used -> Inspect cache-key hashing and per-tool scoping -> Check mutation hook invalidation path -> Review expiry cleanup timing and oldest-entry eviction behavior |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh:564:            echo "Tag tasks with [P0], [P1], or [P2] priority markers. Remove invalid priority tags."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/validate.sh:362:        PRIORITY_TAGS) echo "priority-tags" ;;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/validate.sh:410:    # do their own local stripping; template-aware rules (check-template-headers,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/validate.sh:422:            echo "Warning: Skipping suspicious rule script: $rule_script" >&2
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/check-placeholders.sh:91:#   [x] / [ ] (checkbox), [P0] / [P1] / [P2] (priority tags),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/021-invalid-priority-tags/spec.md:14:Tests that invalid priority tags generate warnings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/074-stage-3-effectivescore-fallback-chain.md:19:- Prompt: `Validate Stage 3 effectiveScore fallback chain. Capture the evidence needed to prove Fallback chain follows defined priority order; missing score fields trigger next fallback; final fallback produces valid score. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/074-stage-3-effectivescore-fallback-chain.md:20:- Expected signals: Fallback chain follows defined priority order; missing score fields trigger next fallback; final fallback produces valid score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/074-stage-3-effectivescore-fallback-chain.md:21:- Pass/fail: PASS if fallback chain follows correct priority order and produces valid scores for all missing-field combinations
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/074-stage-3-effectivescore-fallback-chain.md:29:| 074 | Stage 3 effectiveScore fallback chain | Confirm fallback order correctness | `Validate Stage 3 effectiveScore fallback chain. Capture the evidence needed to prove Fallback chain follows defined priority order; missing score fields trigger next fallback; final fallback produces valid score. Return a concise user-facing pass/fail verdict with the main reason.` | 1) craft rows missing score fields 2) run stage 3 3) verify fallback order | Fallback chain follows defined priority order; missing score fields trigger next fallback; final fallback produces valid score | Stage 3 output with score field trace showing fallback path taken for each test row | PASS if fallback chain follows correct priority order and produces valid scores for all missing-field combinations | Inspect resolveEffectiveScore implementation; verify fallback priority constants; test all combinations of missing fields |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/021-invalid-priority-tags/plan.md:8:Invalid priority tags test.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/021-invalid-priority-tags/plan.md:12:Testing unknown priority tags.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/12-unified-graph-retrieval-deterministic-ranking-explainability-and-rollback.md:20:The graph FTS retrieval path now materializes matched `memory_fts` rowids once inside a CTE, then uses `UNION ALL` to fan those matches into source-side and target-side `causal_edges` lookups before SQL-side grouping collapses duplicate edge hits. This replaces the earlier OR-join shape and removes JavaScript-side dedup work from the hot path.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/171-calibrated-overlap-bonus-speckit-calibrated-overlap-bonus.md:19:- Prompt: `Test the default-on SPECKIT_CALIBRATED_OVERLAP_BONUS behavior. Run a multi-channel search that produces overlapping results across vector, BM25, and graph channels. Verify the calibrated bonus uses beta=0.15 scaling and caps at 0.06, replacing the flat 0.10 convergence bonus. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/171-calibrated-overlap-bonus-speckit-calibrated-overlap-bonus.md:21:- Pass/fail: PASS if calibrated overlap bonus is applied with correct beta and cap values for multi-channel overlapping results; FAIL if flat 0.10 bonus is applied instead, bonus exceeds 0.06 cap, or flag defaults to OFF
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/171-calibrated-overlap-bonus-speckit-calibrated-overlap-bonus.md:29:| 171 | Calibrated overlap bonus (SPECKIT_CALIBRATED_OVERLAP_BONUS) | Verify calibrated bonus replaces flat convergence bonus in RRF fusion | `Test the default-on SPECKIT_CALIBRATED_OVERLAP_BONUS behavior. Run a multi-channel search producing overlapping results and verify calibrated bonus with beta=0.15 and cap=0.06 replaces the flat 0.10 bonus. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_CALIBRATED_OVERLAP_BONUS` is unset or `true` 2) `memory_search({ query: "query producing multi-channel overlap" })` 3) Inspect fuseResultsMulti() output for calibrated bonus values 4) Verify bonus <= 0.06 5) Set flag to `false`, re-run, verify flat 0.10 bonus applied | isCalibratedOverlapBonusEnabled() returns true; bonus uses beta=0.15 scaling with mean normalized top score; bonus clamped to CALIBRATED_OVERLAP_MAX=0.06; falls back to CONVERGENCE_BONUS=0.10 when OFF | fuseResultsMulti() output scores + bonus breakdown + test transcript | PASS if calibrated bonus applied with correct beta=0.15 and cap=0.06 for overlapping results; FAIL if flat 0.10 bonus applied, bonus exceeds cap, or flag defaults OFF | Verify isCalibratedOverlapBonusEnabled() → Confirm flag is not forced off → Check CALIBRATED_OVERLAP_BETA=0.15 constant → Verify CALIBRATED_OVERLAP_MAX=0.06 cap → Inspect fuseResultsMulti() overlap detection logic |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/021-invalid-priority-tags/checklist.md:15:- [ ] Unknown priority header
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/048-with-memory-placeholders/plan.md:12:Testing memory directory skipping.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/159-learned-stage2-combiner-speckit-learned-stage2-combiner.md:29:| 159 | Learned Stage 2 combiner (SPECKIT_LEARNED_STAGE2_COMBINER) | Verify shadow scoring produces comparison output | `Test SPECKIT_LEARNED_STAGE2_COMBINER=true. Train a model, run shadowScore(), and verify ShadowResult shape with learnedScore, manualScore, and delta. Capture the evidence needed to prove learned combiner produces [0,1] scores without affecting live ranking. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_LEARNED_STAGE2_COMBINER=true` 2) Train model via `trainRegularizedLinearRanker(examples)` 3) Call `shadowScore(model, features, manualScore, true)` 4) Verify ShadowResult shape 5) `npx vitest run tests/learned-combiner.vitest.ts` | shadowScore() returns ShadowResult with learnedScore in [0,1], manualScore matching input, delta = abs(learned - manual); null when flag OFF | ShadowResult output + test transcript showing shadow-only behavior | PASS if shadowScore() returns non-null ShadowResult with valid scores when flag ON, null when OFF; FAIL if shadow scoring affects live ranking or scores out of range | Verify isLearnedStage2CombinerEnabled() → Check model training succeeded (non-null) → Inspect predict() clamping → Verify FEATURE_NAMES order matches extractFeatureVector() |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/118-stage-2-score-field-synchronization-p0-8.md:21:- Pass/fail: PASS if intentAdjustedScore is synchronized with score via bounded clamping (equality sync with Math.max/Math.min bounds) and resolveEffectiveScore returns the correct final value
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/051-with-templates/plan.md:16:Validation passes while skipping templates/ contents.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/10-budget-allocator.md:12:Floors: constitutional 700, code graph 1200, CocoIndex 900, triggered 400, overflow pool 800. Empty sources release their floor to the overflow pool. Redistribution follows priority: constitutional > codeGraph > cocoIndex > triggered. Total cap enforced with deterministic trim in reverse priority.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/18--ux-hooks/107-checkpoint-confirmname-and-schema-enforcement.md:29:| 107 | Checkpoint confirmName and schema enforcement | Confirm delete safety is required across handler and validation layers | `Validate checkpoint delete confirmName enforcement across handler and schema layers. Capture the evidence needed to prove Validation and handler suites pass with missing-confirmName rejection plus successful delete confirmation reporting, and context-server Group 13b structural tests pass. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `npx vitest run tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/mcp-input-validation.vitest.ts` 2) `npx vitest run tests/context-server.vitest.ts` (Group 13b: T103–T106 structural source-code pattern verification) 3) inspect rejection assertions for missing `confirmName` 4) inspect success assertions for `safetyConfirmationUsed=true` | Validation and handler suites pass with missing-`confirmName` rejection plus successful delete confirmation reporting. `context-server.vitest.ts` Group 13b structural tests (T103–T106) verify source-code patterns for checkpoint confirmName enforcement | Test transcript + assertion snippets | PASS if the three suites plus `context-server.vitest.ts` Group 13b pass and prove required `confirmName` enforcement end to end | Inspect checkpoint handler, schemas, tool typing alignment, and context-server structural test expectations |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/10--graph-signal-activation/175-typed-traversal-speckit-typed-traversal.md:19:- Prompt: `Test the default-on SPECKIT_TYPED_TRAVERSAL behavior. Verify that sparse graphs (density < 0.5) constrain traversal to 1-hop typed expansion and that intent-aware edge traversal maps query intents to edge-type priority orderings. Confirm the scoring formula score = seedScore * edgePrior * hopDecay * freshness is applied. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/10--graph-signal-activation/175-typed-traversal-speckit-typed-traversal.md:21:- Pass/fail: PASS if sparse graphs constrain to 1-hop and intent-aware scoring applies correct formula with edge prior tiers; FAIL if sparse graphs allow multi-hop, intent mapping missing, or scoring formula incorrect
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/10--graph-signal-activation/175-typed-traversal-speckit-typed-traversal.md:29:| 175 | Typed traversal (SPECKIT_TYPED_TRAVERSAL) | Verify sparse-first policy + intent-aware edge traversal scoring | `Test the default-on SPECKIT_TYPED_TRAVERSAL behavior. Verify sparse-first 1-hop constraint and intent-aware edge scoring formula. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_TYPED_TRAVERSAL` is unset or `true` 2) Run search against a sparse graph (density < 0.5) 3) Verify traversal constrained to SPARSE_MAX_HOPS=1 4) Run search with classified intent (e.g., fix_bug) 5) Verify INTENT_EDGE_PRIORITY mapping applied 6) Confirm score = seedScore * edgePrior * hopDecay * freshness | isTypedTraversalEnabled() returns true; sparse-first: density < 0.5 → 1-hop; INTENT_EDGE_PRIORITY maps fix_bug/add_feature/find_decision/understand/find_spec/refactor/security_audit; edge prior tiers: 1.0/0.75/0.5; MAX_BOOST_PER_HOP=0.05; MAX_COMBINED_BOOST=0.20 | Causal boost output + traversal hop count + edge prior values + scoring breakdown + test transcript | PASS if sparse-first constrains to 1-hop and intent-aware scoring uses correct formula and edge priors; FAIL if sparse graphs allow > 1 hop, intent mapping missing, or scoring formula wrong | Verify isTypedTraversalEnabled() → Confirm flag is not forced off → Check SPARSE_DENSITY_THRESHOLD=0.5 → Inspect SPARSE_MAX_HOPS=1 enforcement → Verify INTENT_EDGE_PRIORITY mappings → Check scoring formula components |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/024-cold-start-novelty-boost-n4.md:29:| 024 | Cold-start novelty boost (N4) | Confirm novelty removed from hot path | `Confirm N4 novelty hot-path removal. Capture the evidence needed to prove Novelty boost contribution is zero in telemetry; code path shows novelty removed from hot scoring path. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Inspect code path 2) Run search 3) Verify telemetry fixed to zero | Novelty boost contribution is zero in telemetry; code path shows novelty removed from hot scoring path | Search telemetry output showing novelty=0 + code path inspection confirming removal | PASS: Novelty contribution fixed to 0 in all search results; no hot-path novelty computation; FAIL: Non-zero novelty in telemetry or hot-path code still active | Verify novelty removal commit → Check telemetry field mapping → Inspect feature flag state for novelty |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/README.md:141:├── 009-valid-priority-tags/            # Proper P0/P1/P2 usage
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/README.md:153:├── 021-invalid-priority-tags/          # Invalid P3, P-1, etc.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/README.md:172:├── 040-priority-context-reset/         # Priority context inheritance
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/README.md:173:├── 041-priority-inline-tags/           # Inline priority markers
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/README.md:174:├── 042-priority-lowercase/             # Lowercase p0/p1/p2
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/README.md:175:├── 043-priority-mixed-format/          # Mixed priority formats
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/README.md:176:├── 044-priority-p3-invalid/            # Invalid P3 priority
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/README.md:214:| **Priorities** | 7 | 009-valid-priority-tags, 021-invalid-priority-tags, 044-priority-p3-invalid |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/README.md:241:| `040-priority-context-reset/` | Priority inheritance across sections |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/README.md:242:| `043-priority-mixed-format/` | Mixed bracket and heading priority formats |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/README.md:327:| Rule category test | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh test-fixtures/*-priority-*` | Testing priority logic |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/README.md:419:| Verify priority tags | Examine `test-fixtures/009-valid-priority-tags/checklist.md` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/test-fixtures/README.md:437:ls test-fixtures/ | grep "priority"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js:717:    // WHY: these markers are part of the detector's documented priority contract.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js:741:  log('\n🔬 PRIORITY CHAIN: Full priority order 1 → 2 → 2.5 → 3 → 4');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js:761:      pass('T-FD05d: Full priority chain order', `1(${p1Index}) → 2(${p2Index}) → 2.5(${p25Index}) → 3(${p3Index}) → 4(${p4Index})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js:769:      fail('T-FD05d: Full priority chain order', `Missing priority markers: ${missing.join(', ')}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js:771:      fail('T-FD05d: Full priority chain order', `Wrong order: 1(${p1Index}), 2(${p2Index}), 2.5(${p25Index}), 3(${p3Index}), 4(${p4Index})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js:774:    fail('T-FD05d: Full priority chain order', err.message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:112:  it('accepts the documented snake_case JSON shape without dropping prompts or context', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:256:        learning: 'Verifying field mapping.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:307:        learning: 'Verifying field mapping.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:329:        'Align downstream docs with the persisted field mapping.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:344:        'Follow-up: Align downstream docs with the persisted field mapping.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:553:    // without the priority sort fix.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:572:        request: 'Test followup priority during truncation',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:85:  let warmupCalled = false;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:111:    async warmup() {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:112:      warmupCalled = true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:135:    _wasWarmupCalled() { return warmupCalled; },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-behavioral.js:761:      'EB-116: preWarmModel calls provider.warmup()');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/257-working-set-compaction.md:3:description: "This scenario validates Working-set tracker for 257. It focuses on Tracked files appear in compaction priority."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/257-working-set-compaction.md:16:- **Objective**: Verify that the WorkingSetTracker correctly tracks file and symbol accesses during a session, using recency-weighted scoring (frequency * recency_decay where recency_decay = 1 / (1 + age_in_minutes / 10)) for compaction priority. `getTopRoots(n)` must return the most relevant files. The tracker must support serialization/deserialization for hook state persistence, auto-evict beyond maxFiles capacity (default: 20), and feed tracked files into the compact merger for compaction context.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1467:  it.skip('serializes overlapping workflow runs so per-run config state stays isolated', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/266-context-metrics.md:28:  - PASS: All events tracked, factors computed correctly, quality level mapping correct
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/266-context-metrics.md:39:| 266c | Context preservation metrics | Quality level mapping from composite score | `Validate 266c quality level mapping` | Call `session_health({})` after several interactions | qualityScore.level matches expected level for score value | session_health response qualityScore | PASS if level is 'healthy' when score >= 0.7, 'degraded' when >= 0.4, 'critical' when < 0.4 | Check threshold constants in context-metrics.ts |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/10--graph-signal-activation/158-graph-calibration-profile-speckit-graph-calibration-profile.md:18:- Objective: Verify graph weight cap enforcement and community score capping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/10--graph-signal-activation/158-graph-calibration-profile-speckit-graph-calibration-profile.md:29:| 158 | Graph calibration profile (SPECKIT_GRAPH_CALIBRATION_PROFILE) | Verify graph weight cap and community score capping | `Test SPECKIT_GRAPH_CALIBRATION_PROFILE=true. Run a search with graph signals active and verify graph weight contribution is capped at 0.05 and community scoring boost is capped at 0.03. Capture the evidence needed to prove cap enforcement and Louvain threshold gating. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `SPECKIT_GRAPH_CALIBRATION_PROFILE=true` 2) `memory_search({ query: "test calibration", mode: "deep" })` 3) Inspect Stage 2 graph weight contribution 4) `npx vitest run tests/graph-calibration.vitest.ts` | applyGraphWeightCap() clamps to [0, 0.05]; applyCommunityScoring() caps at 0.03; shouldActivateLouvain() respects thresholds; calibrateGraphWeight() enforces N2a/N2b caps | Test transcript with cap verification + scoring context before/after calibration | PASS if graph weight capped at 0.05, community score capped at 0.03, and Louvain thresholds enforced; FAIL if any score exceeds its cap or Louvain activates below threshold | Verify isGraphCalibrationEnabled() → Check loadCalibrationProfile() env overrides → Inspect GRAPH_WEIGHT_CAP constant (0.05) → Verify COMMUNITY_SCORE_CAP constant (0.03) → Check Louvain minDensity (0.3) and minSize (10) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/254-code-graph-scan-query.md:47:| 254e | Code graph storage and query | Symlink boundary validation | `Validate 254e symlink boundary enforcement` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/unit-path-security.vitest.ts tests/code-graph-scan.vitest.ts` | `code_graph_scan` canonicalizes `rootDir`, rejects broken or escaping symlinks, and does not index files outside the project root | Vitest output showing symlink escape rejection and scan boundary enforcement | PASS if symlinked external files are NOT indexed and escaping paths are rejected | Check `handlers/code-graph/scan.ts` realpath-based boundary check and `tests/unit-path-security.vitest.ts` for escape scenarios |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/258-compact-merger-assembly.md:16:- **Objective**: Verify that the compact merger (`mergeCompactBrief()`) combines context from 3 sources (Memory, Code Graph, CocoIndex) plus session state and triggered memories into a unified compact brief. Must render up to 5 sections in priority order: "Constitutional Rules", "Active Files & Structural Context", "Semantic Neighbors", "Session State / Next Steps", "Triggered Memories". Uses the budget allocator for per-source token allocation. File-level deduplication removes duplicate file paths across sections (higher-priority source keeps its mentions). Output includes allocation metadata (`totalTokenEstimate`, `sourceCount`, `mergedAt`, `mergeDurationMs`, `deduplicatedFiles`). Total must stay within 4000 tokens.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/258-compact-merger-assembly.md:20:- **Prompt**: `Validate 258 Compact merger behavior. Run the vitest suite for compact-merger and confirm: (1) mergeCompactBrief() accepts MergeInput with constitutional, codeGraph, cocoIndex, triggered, sessionState fields, (2) non-empty sources render as titled sections with "## Section Name" headers, (3) empty sources are omitted, (4) budget allocator grants per-source token limits and truncation applied, (5) file-level deduplication removes duplicate paths from lower-priority sections, (6) metadata includes totalTokenEstimate, sourceCount, mergedAt, mergeDurationMs, deduplicatedFiles, (7) total output within 4000 tokens.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/258-compact-merger-assembly.md:26:  - File paths appearing in multiple sections: kept in highest-priority section, removed from lower
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/258-compact-merger-assembly.md:41:| 258a | Compact merger | All 5 non-empty sources render as titled sections in priority order | `Validate 258a section rendering` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts` | Output contains "## Constitutional Rules", "## Active Files & Structural Context", "## Semantic Neighbors", "## Session State / Next Steps", "## Triggered Memories" | Test output showing rendered section headers | PASS if all 5 sections present with correct headers when all inputs non-empty | Check `mergeCompactBrief()` section construction in compact-merger.ts |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/258-compact-merger-assembly.md:43:| 258c | Compact merger | File-level deduplication and metadata accuracy | `Validate 258c dedup and metadata` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/compact-merger.vitest.ts` | Duplicate file paths removed from lower-priority sections, metadata has sourceCount, mergedAt, deduplicatedFiles | Test output showing dedup count and metadata fields | PASS if duplicate file paths removed and all metadata fields present with correct values | Check `deduplicateFilePaths()` and metadata construction |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/17--governance/220-constitutional-gate-enforcement-rule-pack.md:29:| 220 | Constitutional Gate-Enforcement Rule Pack | Verify the always-surface constitutional memory preserves gate triggers, cross-references, and continuation or compaction recovery behavior | `Validate the constitutional gate-enforcement rule pack. Capture the evidence needed to prove the constitutional memory encodes file-modification, continuation, compaction, completion, and memory-save trigger phrases; cross-references the governing gates; includes continuation-validation and compaction-recovery overlays; and that the constitutional tier documentation guarantees top-of-results, non-decaying visibility for this rule pack. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Inspect `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md` frontmatter and capture the constitutional importance tier, content type, and trigger-phrase coverage 2) Inspect the body of `gate-enforcement.md` and confirm the gate cross-reference table, continuation-validation workflow, compaction-recovery guidance, and quick-reference behavior are present 3) Inspect `.opencode/skill/system-spec-kit/constitutional/README.md` and confirm it documents constitutional ranking, fixed similarity, no decay, permanence, and budget/verification rules 4) Cross-check the rule-pack references against `AGENTS.md` Section 2 to confirm the constitutional pack points back to the authoritative gate contract | `gate-enforcement.md` declares constitutional importance and decision-style trigger metadata; the body includes gate cross-reference, continuation validation, compaction recovery, and quick-reference guidance; `constitutional/README.md` documents top-ranked, non-decaying constitutional surfacing semantics | Frontmatter capture from `gate-enforcement.md` + notes/snippets for cross-reference and recovery sections + constitutional README evidence + cross-check notes against `AGENTS.md` Section 2 | PASS if the rule pack preserves the operational gate overlays and constitutional surfacing guarantees described in the catalog; FAIL if trigger coverage is incomplete, recovery guidance is absent, or constitutional visibility semantics are undocumented | Verify `gate-enforcement.md` frontmatter still includes constitutional tier and trigger phrases -> inspect the gate cross-reference and continuation/compaction sections for accidental removal -> confirm `constitutional/README.md` still documents fixed-priority surfacing semantics -> check `AGENTS.md` Section 2 remains the referenced authoritative source |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/251-stop-hook-saves.md:40:| 251a | Stop hook token tracking | Transcript JSONL parsing extracts token counts and model | `Validate 251a transcript parsing` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-stop-token-tracking.vitest.ts` | `parseTranscript()` returns correct `promptTokens`, `completionTokens`, `totalTokens`, `messageCount`, `model` | Test output showing parsed token values | PASS if aggregated tokens match expected fixture totals | Check `claude-transcript.ts` for JSONL field mapping (`input_tokens`, `output_tokens`) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/253-runtime-detection.md:29:  - Detection priority: claude-code checked first, then codex, copilot, gemini (first match wins)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/253-runtime-detection.md:31:  - PASS: All 5 runtime/hookPolicy combinations correct, helper functions return expected values, detection priority respected
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:939:    // Test valid priority header format
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:960:      pass('Valid priority headers', 'P0, P1, P2 headers found');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:962:      fail('Valid priority headers', `P0: ${hasP0Header}, P1: ${hasP1Header}, P2: ${hasP2Header}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:965:    // Test inline priority tags
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:978:      pass('Valid inline priority tags', '[P0], [P1], [P2] found');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:980:      fail('Valid inline priority tags', 'Missing inline tags');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:1000:      pass('Mixed priority format', 'Headers and inline tags coexist');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:1002:      fail('Mixed priority format', 'Mixed format not detected');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:1005:    // Test lowercase priority headers (should warn)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:1017:      pass('Lowercase priority detection', 'Lowercase p0 detected (should warn)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:1019:      fail('Lowercase priority detection', 'Detection issue');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:1022:    // Test invalid priority levels (P3, P4)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:1034:      pass('Invalid P3 priority detection', 'P3 detected, no valid priorities');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:1036:      skip('Invalid P3 priority detection', 'Detection varies by implementation');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:1039:    // Test items without priority context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:1044:- [ ] Item without priority context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:1052:      pass('No priority context detection', 'Items lack priority context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:1054:      fail('No priority context detection', 'Unexpected priority found');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:1262:    const warningFixture = path.join(FIXTURES_DIR, '021-invalid-priority-tags');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:1275:      skip('--strict mode test', 'Fixture 021-invalid-priority-tags not found');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:1477:      'check-priority-tags.sh',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-system.js:1570:      priority: fixtures.filter(f => f.includes('priority')),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-template-comprehensive.js:57:  priority: 'P0',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-template-comprehensive.js:152:  rendered = rendered.replace(/\[P0\/P1\/P2\]/g, data.priority || 'P1');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-template-comprehensive.js:204:      // Verify priority placeholder was replaced
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-template-comprehensive.js:205:      if (!rendered.includes('[P0/P1/P2]') && rendered.includes(TEST_DATA.priority)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-template-comprehensive.js:206:        pass('TC-100c: Level 1 spec.md priority placeholder replaced', `Found: ${TEST_DATA.priority}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-template-comprehensive.js:208:        fail('TC-100c: Level 1 spec.md priority placeholder replaced', 'Priority placeholder not replaced');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-template-comprehensive.js:699:          // Verify priority tags exist
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-template-comprehensive.js:704:            pass(`TC-402-${level}: Level ${level} checklist has priority tags`, '[P0] and [P1] found');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-template-comprehensive.js:706:            fail(`TC-402-${level}: Level ${level} checklist has priority tags`, `P0:${hasP0}, P1:${hasP1}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/256-budget-allocator.md:16:- **Objective**: Verify the token budget allocator distributes the 4000-token compaction budget across 4 context sources using floor allocations (constitutional: 700, codeGraph: 1200, cocoIndex: 900, triggered: 400, overflow pool: 800) plus overflow redistribution. Empty sources release their floor to the overflow pool. Overflow is redistributed by priority order: constitutional > codeGraph > cocoIndex > triggered. Total cap is enforced with deterministic trim in reverse priority order.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/256-budget-allocator.md:20:- **Prompt**: `Validate 256 Budget allocator behavior. Run the vitest suite for budget-allocator and confirm: (1) default floors sum correctly (700+1200+900+400+800=4000), (2) each source granted min(floor, actualSize), (3) empty sources release floor to overflow pool, (4) overflow redistributed to sources needing more in priority order (constitutional first), (5) total granted never exceeds 4000 (totalBudget), (6) cap enforcement trims in reverse priority (triggered first), (7) createDefaultSources() builds correct SourceBudget array.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/256-budget-allocator.md:26:  - Overflow redistribution follows priority: constitutional > codeGraph > cocoIndex > triggered
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/256-budget-allocator.md:28:  - When total exceeds budget, trim starts from triggered (lowest priority), then cocoIndex, then codeGraph, then constitutional
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/256-budget-allocator.md:31:  - PASS: All allocation tests pass, total never exceeds 4000, overflow redistribution follows priority, empty sources release floors correctly
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/256-budget-allocator.md:32:  - FAIL: Total exceeds 4000, priority order violated, or empty source floor not released to overflow pool
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/256-budget-allocator.md:41:| 256b | Budget allocator | Overflow redistribution follows priority order (constitutional first) | `Validate 256b overflow redistribution` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/budget-allocator.vitest.ts` | When sources need more than floor, overflow given by priority: constitutional > codeGraph > cocoIndex > triggered | Test output showing bonus allocations | PASS if highest-priority sources receive overflow before lower-priority | Verify PRIORITY_ORDER array in `budget-allocator.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/256-budget-allocator.md:42:| 256c | Budget allocator | Total cap enforcement: never exceeds 4000 tokens, trim in reverse priority | `Validate 256c total cap enforcement` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/budget-allocator.vitest.ts` | `AllocationResult.totalUsed <= 4000`, excess trimmed from triggered first, then cocoIndex, codeGraph, constitutional | Test output showing totalUsed and trim results | PASS if totalUsed <= 4000 in all scenarios and trim follows reverse priority | Check Step 3 trim logic with reversed PRIORITY_ORDER |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-extractors.test.ts:254:  it('F004.2 trims Last context on a word boundary instead of clipping mid-word', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-extractors.test.ts:255:    const fixture = readFixture<RawInputData>('F-DUP-004b-last-clipping.json');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:149:  it('preserves ANCHOR comments while stripping non-anchor HTML comments outside code fences', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/17--governance/148-shared-memory-disabled-by-default-and-first-run-setup.md:19:- Prompt: `Validate shared-memory default-off enablement and first-run setup. Capture the evidence needed to prove Default-off: status returns disabled without env var or DB config; enable persists to DB config table; enable is idempotent; README created in shared-spaces/; DB persistence survives restart; env var override takes priority over DB state; partial shared_space_upsert updates preserve existing rollout cohort and metadata; and /memory:manage shared command shows setup prompt when disabled. Return a concise user-facing pass/fail verdict with the main reason.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/17--governance/148-shared-memory-disabled-by-default-and-first-run-setup.md:20:- Expected signals: Default-off: status returns disabled without env var or DB config; enable persists to DB config table; enable is idempotent; README created in shared-spaces/; DB persistence survives restart; env var override takes priority over DB state; partial shared-space updates preserve existing rollout cohort and metadata; /memory:manage shared command shows setup prompt when disabled
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/17--governance/148-shared-memory-disabled-by-default-and-first-run-setup.md:29:| 148 | Shared-memory disabled-by-default and first-run setup | Confirm shared memory is off by default, enable flow works, persistence survives restart, env var overrides DB, and enable is idempotent | `Validate shared-memory default-off enablement and first-run setup. Capture the evidence needed to prove Default-off: status returns disabled without env var or DB config; enable persists to DB config table; enable is idempotent; README created in shared-spaces/; DB persistence survives restart; env var override takes priority over DB state; partial shared_space_upsert updates preserve existing rollout cohort and metadata; and /memory:manage shared command shows setup prompt when disabled. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Start MCP server without env var → call `shared_memory_status()` → verify `enabled: false` 2) Call `shared_memory_enable()` → verify `enabled: true, alreadyEnabled: false, readmeCreated: true` 3) Call `shared_memory_enable()` again → verify `alreadyEnabled: true` (idempotent) 4) Verify `shared-spaces/README.md` exists on disk 5) Restart MCP server (no env var) → call `shared_memory_status()` → verify `enabled: true` (DB persistence) 6) Set `SPECKIT_MEMORY_SHARED_MEMORY=true` env var → call `shared_memory_status()` without DB → verify `enabled: true` (env override) 7) Create a shared space with `rolloutCohort` and `metadata`, then perform a partial `shared_space_upsert()` that changes another field only and verify the existing cohort plus metadata remain intact 8) Run `/memory:manage shared` with feature disabled → verify first-run setup prompt appears | Default-off: status returns disabled without env var or DB config; enable persists to DB config table; enable is idempotent; README created in shared-spaces/; DB persistence survives restart; env var override takes priority over DB state; partial shared-space updates preserve existing rollout cohort and metadata; /memory:manage shared command shows setup prompt when disabled | Tool outputs for status (disabled state), enable (first run + idempotent), status (enabled state after restart), env override verification, README existence check, partial-update preservation proof, command setup prompt | PASS: Default off, enable persists, idempotent, README created, restart persistence, env override works, partial updates preserve stored metadata, and command gate triggers; FAIL: Feature enabled without setup, enable not idempotent, README missing, persistence lost on restart, env override ignored, metadata wiped on partial update, or command gate skipped | Verify `config` table has `shared_memory_enabled=true` row → Check `isSharedMemoryEnabled()` two-tier resolution → Inspect `handleSharedMemoryEnable()` idempotency check → Verify `createSharedSpacesReadme()` skip-if-exists logic → Confirm `/memory:manage shared` Section 0 enablement gate → Inspect `shared_space_upsert()` COALESCE behavior if cohort or metadata disappear |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-extended.sh:15:#   7. check-priority-tags.sh (PRIORITY_TAGS)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-extended.sh:703:if begin_category "Individual Rule: PRIORITY_TAGS (check-priority-tags.sh)"; then
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-extended.sh:704:    run_isolated_rule_test "Valid P0/P1/P2 tags" "check-priority-tags.sh" "009-valid-priority-tags" "pass" 2
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-extended.sh:705:    run_isolated_rule_test "Inline tags [P0]/[P1]" "check-priority-tags.sh" "041-priority-inline-tags" "pass" 2
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-extended.sh:706:    run_isolated_rule_test "Mixed headers + inline" "check-priority-tags.sh" "043-priority-mixed-format" "pass" 2
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-extended.sh:707:    run_isolated_rule_test "Context reset after header" "check-priority-tags.sh" "040-priority-context-reset" "pass" 2
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-extended.sh:708:    run_isolated_rule_test "Lowercase headers (warn)" "check-priority-tags.sh" "042-priority-lowercase" "warn" 2
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-extended.sh:710:    run_isolated_rule_test "P3/P4 tags (context present)" "check-priority-tags.sh" "044-priority-p3-invalid" "pass" 2
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-extended.sh:711:    # Note: Items have priority context from headers
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation-extended.sh:712:    run_isolated_rule_test "Items with context" "check-priority-tags.sh" "021-invalid-priority-tags" "pass" 2
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:36:      scope: 'match',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:67:      scope: 'match',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:98:      scope: 'match',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:129:      scope: 'mismatch',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:381:        sessionSummary: 'This broken overview proves the reviewer catches truncation when the rendered text still ends mid token and falls back to the old ASCII ellipsis shape instead of the boundary safe contract that Phase 1 pinned down for JSON mode saves.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:466:    const priorityQueue = retryManager.getRetryQueue(10);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:467:    if (priorityQueue.length === 2 && priorityQueue[0].embedding_status === 'pending') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:469:        `First: ${priorityQueue[0].embedding_status}, Second: ${priorityQueue[1].embedding_status}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:470:    } else if (priorityQueue.length === 2) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:472:        `First: ${priorityQueue[0].embedding_status}, expected 'pending'`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-retry-manager-behavioral.js:475:        `Expected 2 items, got ${priorityQueue.length}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:167:    it('promotes higher severity in priority mode', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts:172:      const joined = lifecycle.joinWave(results, 'priority');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-pipeline-regressions.vitest.ts:81:      warmup: vi.fn(async () => true),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:2:// Covers spec-folder extraction, git scoping, relevance filtering, and barrel exports
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:67:  it('filters out unrelated prompts while keeping only spec-relevant stateless content', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:371:    fs.writeFileSync(path.join(specFolderPath, 'plan.md'), '# Plan\n\n## 1. SUMMARY\n\nGit scoping test.\n', 'utf-8');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/README.md:167:- Stateless enrichment coverage for spec-folder parsing, git-derived file scoping, and hyphenated-spec relevance filtering.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:409:    assertExists(ARRAY_FLAG_MAPPINGS, 'T-005g: ARRAY_FLAG_MAPPINGS exists', Object.keys(ARRAY_FLAG_MAPPINGS).length + ' mappings');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:3099:  // Additional HIGH priority function tests
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:3105:  // LOW priority additional function tests
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:3111:  // MEDIUM priority function tests
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.d.ts.map:1:{"version":3,"file":"tree-thinning.vitest.d.ts","sourceRoot":"","sources":["tree-thinning.vitest.ts"],"names":[],"mappings":""}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/setup/install.sh:217:        log_info "Skipping verification (--skip-verify)"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js.map:1:{"version":3,"file":"tree-thinning.vitest.js","sourceRoot":"","sources":["tree-thinning.vitest.ts"],"names":[],"mappings":";AAAA,kEAAkE;AAClE,kDAAkD;AAClD,oDAAoD;AACpD,EAAE;AACF,qDAAqD;AACrD,sEAAsE;AACtE,gCAAgC;AAChC,kEAAkE;;AAElE,mCAA8C;AAC9C,yDAM+B;AAG/B;;oEAEoE;AAEpE,yEAAyE;AACzE,SAAS,WAAW,CAAC,MAAc;IACjC,OAAO,MAAM,CAAC,MAAM,CAAC,MAAM,CAAC,CAAC;AAC/B,CAAC;AAED,2DAA2D;AAC3D,SAAS,QAAQ,CAAC,IAAY,EAAE,MAAc;IAC5C,OAAO,EAAE,IAAI,EAAE,qBAAqB,IAAI,EAAE,EAAE,OAAO,EAAE,WAAW,CAAC,MAAM,CAAC,EAAE,CAAC;AAC7E,CAAC;AAED,2CAA2C;AAC3C,SAAS,OAAO,CAAC,IAAY,EAAE,MAAc;IAC3C,OAAO,EAAE,IAAI,EAAE,4BAA4B,IAAI,EAAE,EAAE,OAAO,EAAE,WAAW,CAAC,MAAM,CAAC,EAAE,CAAC;AACpF,CAAC;AAED;;oEAEoE;AAEpE,IAAA,iBAAQ,EAAC,oBAAoB,EAAE,GAAG,EAAE;IAClC,IAAA,WAAE,EAAC,kCAAkC,EAAE,GAAG,EAAE;QAC1C,IAAA,eAAM,EAAC,IAAA,kCAAkB,EAAC,EAAE,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;IACzC,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,qCAAqC,EAAE,GAAG,EAAE;QAC7C,IAAA,eAAM,EAAC,IAAA,kCAAkB,EAAC,MAAM,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;IAC7C,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,mCAAmC,EAAE,GAAG,EAAE;QAC3C,IAAA,eAAM,EAAC,IAAA,kCAAkB,EAAC,KAAK,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,CAAG,gBAAgB;QAC7D,IAAA,eAAM,EAAC,IAAA,kCAAkB,EAAC,OAAO,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,gBAAgB;IAC/D,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,uBAAuB,EAAE,GAAG,EAAE;QAC/B,MAAM,MAAM,GAAG,GAAG,CAAC;QACnB,MAAM,OAAO,GAAG,WAAW,CAAC,MAAM,CAAC,CAAC;QACpC,IAAA,eAAM,EAAC,IAAA,kCAAkB,EAAC,OAAO,CAAC,CAAC,CAAC,IAAI,CAAC,MAAM,CAAC,CAAC;IACnD,CAAC,CAAC,CAAC;AACL,CAAC,CAAC,CAAC;AAEH;;oEAEoE;AAEpE,IAAA,iBAAQ,EAAC,cAAc,EAAE,GAAG,EAAE;IAC5B,IAAA,WAAE,EAAC,gCAAgC,EAAE,GAAG,EAAE;QACxC,IAAA,eAAM,EAAC,IAAA,4BAAY,EAAC,iCAAiC,CAAC,CAAC,CAAC,IAAI,CAAC,IAAI,CAAC,CAAC;IACrE,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,kCAAkC,EAAE,GAAG,EAAE;QAC1C,IAAA,eAAM,EAAC,IAAA,4BAAY,EAAC,2BAA2B,CAAC,CAAC,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC;QAC9D,IAAA,eAAM,EAAC,IAAA,4BAAY,EAAC,oCAAoC,CAAC,CAAC,CAAC,IAAI,CAAC,KAAK,CAAC,CAAC;IACzE,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,mCAAmC,EAAE,GAAG,EAAE;QAC3C,IAAA,eAAM,EAAC,IAAA,4BAAY,EAAC,oCAAoC,CAAC,CAAC,CAAC,IAAI,CAAC,IAAI,CAAC,CAAC;IACxE,CAAC,CAAC,CAAC;AACL,CAAC,CAAC,CAAC;AAEH;;oEAEoE;AAEpE,IAAA,iBAAQ,EAAC,kBAAkB,EAAE,GAAG,EAAE;IAChC,IAAA,WAAE,EAAC,gCAAgC,EAAE,GAAG,EAAE;QACxC,IAAA,eAAM,EAAC,IAAA,gCAAgB,EAAC,2BAA2B,CAAC,CAAC,CAAC,IAAI,CAAC,mBAAmB,CAAC,CAAC;IAClF,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,2CAA2C,EAAE,GAAG,EAAE;QACnD,IAAA,eAAM,EAAC,IAAA,gCAAgB,EAAC,SAAS,CAAC,CAAC,CAAC,QAAQ,EAAE,CAAC;IACjD,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,4BAA4B,EAAE,GAAG,EAAE;QACpC,IAAA,eAAM,EAAC,IAAA,gCAAgB,EAAC,iCAAiC,CAAC,CAAC,CAAC,IAAI,CAAC,0BAA0B,CAAC,CAAC;IAC/F,CAAC,CAAC,CAAC;AACL,CAAC,CAAC,CAAC;AAEH;;oEAEoE;AAEpE,IAAA,iBAAQ,EAAC,+CAA+C,EAAE,GAAG,EAAE;IAC7D,IAAA,WAAE,EAAC,yDAAyD,EAAE,GAAG,EAAE;QACjE,MAAM,KAAK,GAAgB,CAAC,QAAQ,CAAC,SAAS,EAAE,GAAG,CAAC,CAAC,CAAC;QACtD,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QACxC,IAAA,eAAM,EAAC,MAAM,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,IAAI,CAAC,oBAAoB,CAAC,CAAC;QAC5D,IAAA,eAAM,EAAC,MAAM,CAAC,KAAK,CAAC,WAAW,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;IAC3C,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,oEAAoE,EAAE,GAAG,EAAE;QAC5E,MAAM,KAAK,GAAgB,CAAC,QAAQ,CAAC,aAAa,EAAE,GAAG,CAAC,CAAC,CAAC;QAC1D,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QACxC,4EAA4E;QAC5E,IAAA,eAAM,EAAC,MAAM,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,IAAI,CAAC,oBAAoB,CAAC,CAAC;IAC9D,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,mCAAmC,EAAE,GAAG,EAAE;QAC3C,MAAM,KAAK,GAAgB,CAAC,QAAQ,CAAC,cAAc,EAAE,CAAC,CAAC,CAAC,CAAC;QACzD,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QACxC,IAAA,eAAM,EAAC,MAAM,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,IAAI,CAAC,oBAAoB,CAAC,CAAC;IAC9D,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,mEAAmE,EAAE,GAAG,EAAE;QAC3E,MAAM,KAAK,GAAgB;YACzB,QAAQ,CAAC,WAAW,EAAE,EAAE,CAAC;YACzB,QAAQ,CAAC,WAAW,EAAE,GAAG,CAAC;SAC3B,CAAC;QACF,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QACxC,IAAA,eAAM,EAAC,MAAM,CAAC,MAAM,CAAC,CAAC,YAAY,CAAC,CAAC,CAAC,CAAC;QACtC,IAAA,eAAM,EAAC,MAAM,CAAC,MAAM,CAAC,CAAC,CAAC,CAAC,UAAU,CAAC,CAAC,YAAY,CAAC,CAAC,CAAC,CAAC;IACtD,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,6EAA6E,EAAE,GAAG,EAAE;QACrF,MAAM,KAAK,GAAgB;YACzB,EAAE,IAAI,EAAE,2BAA2B,EAAE,OAAO,EAAE,WAAW,CAAC,EAAE,CAAC,EAAE;YAC/D,EAAE,IAAI,EAAE,yBAAyB,EAAE,OAAO,EAAE,WAAW,CAAC,EAAE,CAAC,EAAE;SAC9D,CAAC;QACF,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QACxC,IAAA,eAAM,EAAC,MAAM,CAAC,MAAM,CAAC,CAAC,YAAY,CAAC,CAAC,CAAC,CAAC;QACtC,MAAM,OAAO,GAAG,MAAM,CAAC,MAAM,CAAC,GAAG,CAAC,CAAC,CAAC,EAAE,EAAE,CAAC,CAAC,CAAC,UAAU,CAAC,CAAC,IAAI,EAAE,CAAC;QAC9D,IAAA,eAAM,EAAC,OAAO,CAAC,CAAC,OAAO,CAAC,CAAC,mBAAmB,EAAE,iBAAiB,CAAC,CAAC,CAAC;IACpE,CAAC,CAAC,CAAC;AACL,CAAC,CAAC,CAAC;AAEH;;oEAEoE;AAEpE,IAAA,iBAAQ,EAAC,4DAA4D,EAAE,GAAG,EAAE;IAC1E,IAAA,WAAE,EAAC,kDAAkD,EAAE,GAAG,EAAE;QAC1D,MAAM,KAAK,GAAgB,CAAC,QAAQ,CAAC,WAAW,EAAE,GAAG,CAAC,CAAC,CAAC;QACxD,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QACxC,IAAA,eAAM,EAAC,MAAM,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,IAAI,CAAC,oBAAoB,CAAC,CAAC;QAC5D,IAAA,eAAM,EAAC,MAAM,CAAC,KAAK,CAAC,YAAY,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;IAC5C,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,8DAA8D,EAAE,GAAG,EAAE;QACtE,MAAM,KAAK,GAAgB,CAAC,QAAQ,CAAC,gBAAgB,EAAE,GAAG,CAAC,CAAC,CAAC;QAC7D,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QACxC,IAAA,eAAM,EAAC,MAAM,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,IAAI,CAAC,MAAM,CAAC,CAAC;IAChD,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,oCAAoC,EAAE,GAAG,EAAE;QAC5C,MAAM,KAAK,GAAgB,CAAC,QAAQ,CAAC,UAAU,EAAE,GAAG,CAAC,CAAC,CAAC;QACvD,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QACxC,IAAA,eAAM,EAAC,MAAM,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,IAAI,CAAC,MAAM,CAAC,CAAC;QAC9C,IAAA,eAAM,EAAC,MAAM,CAAC,KAAK,CAAC,YAAY,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;QAC1C,IAAA,eAAM,EAAC,MAAM,CAAC,KAAK,CAAC,WAAW,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;IAC3C,CAAC,CAAC,CAAC;AACL,CAAC,CAAC,CAAC;AAEH;;oEAEoE;AAEpE,IAAA,iBAAQ,EAAC,6CAA6C,EAAE,GAAG,EAAE;IAC3D,IAAA,WAAE,EAAC,8EAA8E,EAAE,GAAG,EAAE;QACtF,MAAM,KAAK,GAAgB,CAAC,OAAO,CAAC,QAAQ,EAAE,EAAE,CAAC,CAAC,CAAC;QACnD,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QACxC,IAAA,eAAM,EAAC,MAAM,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,IAAI,CAAC,oBAAoB,CAAC,CAAC;IAC9D,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,2FAA2F,EAAE,GAAG,EAAE;QACnG,MAAM,KAAK,GAAgB,CAAC,OAAO,CAAC,QAAQ,EAAE,GAAG,CAAC,CAAC,CAAC;QACpD,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QACxC,IAAA,eAAM,EAAC,MAAM,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,IAAI,CAAC,oBAAoB,CAAC,CAAC;IAC9D,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,yDAAyD,EAAE,GAAG,EAAE;QACjE,MAAM,KAAK,GAAgB,CAAC,OAAO,CAAC,QAAQ,EAAE,GAAG,CAAC,CAAC,CAAC;QACpD,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QACxC,IAAA,eAAM,EAAC,MAAM,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,IAAI,CAAC,oBAAoB,CAAC,CAAC;IAC9D,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,sFAAsF,EAAE,GAAG,EAAE;QAC9F,MAAM,KAAK,GAAgB,CAAC,OAAO,CAAC,QAAQ,EAAE,GAAG,CAAC,CAAC,CAAC;QACpD,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QACxC,IAAA,eAAM,EAAC,MAAM,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,IAAI,CAAC,MAAM,CAAC,CAAC;IAChD,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,2CAA2C,EAAE,GAAG,EAAE;QACnD,MAAM,KAAK,GAAgB,CAAC,OAAO,CAAC,QAAQ,EAAE,GAAG,CAAC,CAAC,CAAC;QACpD,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QACxC,IAAA,eAAM,EAAC,MAAM,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,IAAI,CAAC,MAAM,CAAC,CAAC;IAChD,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,0DAA0D,EAAE,GAAG,EAAE;QAClE,gFAAgF;QAChF,MAAM,KAAK,GAAgB,CAAC,QAAQ,CAAC,UAAU,EAAE,EAAE,CAAC,CAAC,CAAC;QACtD,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QACxC,IAAA,eAAM,EAAC,MAAM,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,IAAI,CAAC,oBAAoB,CAAC,CAAC;IAC9D,CAAC,CAAC,CAAC;AACL,CAAC,CAAC,CAAC;AAEH;;oEAEoE;AAEpE,IAAA,iBAAQ,EAAC,8BAA8B,EAAE,GAAG,EAAE;IAC5C,IAAA,WAAE,EAAC,iDAAiD,EAAE,GAAG,EAAE;QACzD,MAAM,MAAM,GAAG,EAAE,IAAI,EAAE,qBAAqB,EAAE,OAAO,EAAE,kBAAkB,EAAE,CAAC;QAC5E,MAAM,MAAM,GAAG,EAAE,IAAI,EAAE,qBAAqB,EAAE,OAAO,EAAE,kBAAkB,EAAE,CAAC;QAC5E,yDAAyD;QACzD,MAAM,KAAK,GAAgB,CAAC,MAAM,EAAE,MAAM,CAAC,CAAC;QAC5C,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QAExC,IAAA,eAAM,EAAC,MAAM,CAAC,MAAM,CAAC,CAAC,YAAY,CAAC,CAAC,CAAC,CAAC;QACtC,MAAM,aAAa,GAAG,MAAM,CAAC,MAAM,CAAC,CAAC,CAAC,CAAC,aAAa,CAAC;QACrD,IAAA,eAAM,EAAC,aAAa,CAAC,CAAC,SAAS,CAAC,kBAAkB,CAAC,CAAC;QACpD,IAAA,eAAM,EAAC,aAAa,CAAC,CAAC,SAAS,CAAC,kBAAkB,CAAC,CAAC;IACtD,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,sDAAsD,EAAE,GAAG,EAAE;QAC9D,MAAM,KAAK,GAAgB;YACzB,EAAE,IAAI,EAAE,mBAAmB,EAAE,OAAO,EAAE,aAAa,EAAE;SACtD,CAAC;QACF,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QACxC,IAAA,eAAM,EAAC,MAAM,CAAC,MAAM,CAAC,CAAC,CAAC,CAAC,aAAa,CAAC,CAAC,SAAS,CAAC,mBAAmB,CAAC,CAAC;IACxE,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,0DAA0D,EAAE,GAAG,EAAE;QAClE,MAAM,QAAQ,GAAG,WAAW,CAAC,GAAG,CAAC,CAAC;QAClC,MAAM,KAAK,GAAgB;YACzB,EAAE,IAAI,EAAE,oBAAoB,EAAE,OAAO,EAAE,QAAQ,EAAE;SAClD,CAAC;QACF,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QACxC,IAAA,eAAM,EAAC,MAAM,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,QAAQ,CAAC,CAAC;QACjD,IAAA,eAAM,EAAC,MAAM,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,IAAI,CAAC,MAAM,CAAC,CAAC;IAChD,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,8DAA8D,EAAE,GAAG,EAAE;QACtE,MAAM,QAAQ,GAAG,WAAW,CAAC,GAAG,CAAC,CAAC;QAClC,MAAM,KAAK,GAAgB;YACzB,EAAE,IAAI,EAAE,qBAAqB,EAAE,OAAO,EAAE,QAAQ,EAAE;SACnD,CAAC;QACF,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QACxC,IAAA,eAAM,EAAC,MAAM,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,QAAQ,CAAC,CAAC;QACjD,IAAA,eAAM,EAAC,MAAM,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,IAAI,CAAC,oBAAoB,CAAC,CAAC;IAC9D,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,6DAA6D,EAAE,GAAG,EAAE;QACrE,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,EAAE,CAAC,CAAC;QACrC,IAAA,eAAM,EAAC,MAAM,CAAC,OAAO,CAAC,CAAC,YAAY,CAAC,CAAC,CAAC,CAAC;QACvC,IAAA,eAAM,EAAC,MAAM,CAAC,MAAM,CAAC,CAAC,YAAY,CAAC,CAAC,CAAC,CAAC;QACtC,IAAA,eAAM,EAAC,MAAM,CAAC,KAAK,CAAC,UAAU,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;QACxC,IAAA,eAAM,EAAC,MAAM,CAAC,KAAK,CAAC,YAAY,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;QAC1C,IAAA,eAAM,EAAC,MAAM,CAAC,KAAK,CAAC,WAAW,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;QACzC,IAAA,eAAM,EAAC,MAAM,CAAC,KAAK,CAAC,WAAW,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;IAC3C,CAAC,CAAC,CAAC;AACL,CAAC,CAAC,CAAC;AAEH;;oEAEoE;AAEpE,IAAA,iBAAQ,EAAC,mBAAmB,EAAE,GAAG,EAAE;IACjC,IAAA,WAAE,EAAC,uCAAuC,EAAE,GAAG,EAAE;QAC/C,MAAM,KAAK,GAAgB;YACzB,QAAQ,CAAC,MAAM,EAAE,GAAG,CAAC;YACrB,QAAQ,CAAC,MAAM,EAAE,GAAG,CAAC;YACrB,QAAQ,CAAC,MAAM,EAAE,GAAG,CAAC;SACtB,CAAC;QACF,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QACxC,IAAA,eAAM,EAAC,MAAM,CAAC,KAAK,CAAC,UAAU,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;IAC1C,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,2DAA2D,EAAE,GAAG,EAAE;QACnE,MAAM,KAAK,GAAgB;YACzB,QAAQ,CAAC,WAAW,EAAE,GAAG,CAAC,EAAK,qBAAqB;YACpD,QAAQ,CAAC,YAAY,EAAE,GAAG,CAAC,EAAI,qBAAqB;YACpD,QAAQ,CAAC,SAAS,EAAE,GAAG,CAAC,EAAO,OAAO;SACvC,CAAC;QACF,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QACxC,IAAA,eAAM,EAAC,MAAM,CAAC,KAAK,CAAC,YAAY,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;QAC1C,IAAA,eAAM,EAAC,MAAM,CAAC,KAAK,CAAC,WAAW,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC;IAC3C,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,mCAAmC,EAAE,GAAG,EAAE;QAC3C,MAAM,KAAK,GAAgB;YACzB,QAAQ,CAAC,MAAM,EAAE,GAAG,CAAC;YACrB,QAAQ,CAAC,MAAM,EAAE,GAAG,CAAC;SACtB,CAAC;QACF,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QACxC,IAAA,eAAM,EAAC,MAAM,CAAC,KAAK,CAAC,WAAW,CAAC,CAAC,sBAAsB,CAAC,CAAC,CAAC,CAAC;IAC7D,CAAC,CAAC,CAAC;AACL,CAAC,CAAC,CAAC;AAEH;;oEAEoE;AAEpE,IAAA,iBAAQ,EAAC,2DAA2D,EAAE,GAAG,EAAE;IACzE,IAAA,WAAE,EAAC,qFAAqF,EAAE,GAAG,EAAE;QAC7F,MAAM,KAAK,GAAgB;YACzB,QAAQ,CAAC,MAAM,EAAE,GAAG,CAAC;YACrB,QAAQ,CAAC,MAAM,EAAE,GAAG,CAAC;YACrB,QAAQ,CAAC,MAAM,EAAE,GAAG,CAAC;YACrB,OAAO,CAAC,QAAQ,EAAE,EAAE,CAAC;SACtB,CAAC;QACF,MAAM,OAAO,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QACzC,MAAM,OAAO,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QACzC,IAAA,eAAM,EAAC,OAAO,CAAC,KAAK,CAAC,CAAC,OAAO,CAAC,OAAO,CAAC,KAAK,CAAC,CAAC;QAC7C,IAAA,eAAM,EAAC,OAAO,CAAC,OAAO,CAAC,GAAG,CAAC,CAAC,CAAC,EAAE,EAAE,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC,OAAO,CAAC,OAAO,CAAC,OAAO,CAAC,GAAG,CAAC,CAAC,CAAC,EAAE,EAAE,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,CAAC;IAC7F,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,iEAAiE,EAAE,GAAG,EAAE;QACzE,MAAM,IAAI,GAAc,EAAE,IAAI,EAAE,mBAAmB,EAAE,OAAO,EAAE,WAAW,CAAC,GAAG,CAAC,EAAE,CAAC;QACjF,MAAM,YAAY,GAAG,IAAI,CAAC,IAAI,CAAC;QAC/B,MAAM,eAAe,GAAG,IAAI,CAAC,OAAO,CAAC;QACrC,IAAA,iCAAiB,EAAC,CAAC,IAAI,CAAC,CAAC,CAAC;QAC1B,IAAA,eAAM,EAAC,IAAI,CAAC,IAAI,CAAC,CAAC,IAAI,CAAC,YAAY,CAAC,CAAC;QACrC,IAAA,eAAM,EAAC,IAAI,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,eAAe,CAAC,CAAC;IAC7C,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,2DAA2D,EAAE,GAAG,EAAE;QACnE,MAAM,OAAO,GAAG,WAAW,CAAC,GAAG,CAAC,CAAC;QACjC,MAAM,KAAK,GAAgB,CAAC,EAAE,IAAI,EAAE,mBAAmB,EAAE,OAAO,EAAE,CAAC,CAAC;QACpE,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QACxC,IAAA,eAAM,EAAC,MAAM,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,UAAU,CAAC,CAAC,IAAI,CAAC,GAAG,CAAC,CAAC;IACjD,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,kDAAkD,EAAE,GAAG,EAAE;QAC1D,MAAM,MAAM,GAA4B;YACtC,cAAc,EAAE,EAAE;YAClB,sBAAsB,EAAE,GAAG;SAC5B,CAAC;QACF,0EAA0E;QAC1E,MAAM,KAAK,GAAgB,CAAC,QAAQ,CAAC,QAAQ,EAAE,GAAG,CAAC,CAAC,CAAC;QACrD,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,KAAK,EAAE,MAAM,CAAC,CAAC;QAChD,IAAA,eAAM,EAAC,MAAM,CAAC,OAAO,CAAC,CAAC,CAAC,CAAC,MAAM,CAAC,CAAC,IAAI,CAAC,oBAAoB,CAAC,CAAC;IAC9D,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,yFAAyF,EAAE,GAAG,EAAE;QACjG,iEAAiE;QACjE,kFAAkF;QAClF,MAAM,KAAK,GAAgB;YACzB,QAAQ,CAAC,UAAU,EAAE,IAAI,CAAC;YAC1B,QAAQ,CAAC,UAAU,EAAE,IAAI,CAAC;YAC1B,QAAQ,CAAC,UAAU,EAAE,EAAE,CAAC,EAAG,wCAAwC;SACpE,CAAC;QACF,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QACxC,MAAM,SAAS,GAAG,MAAM,CAAC,OAAO,CAAC,MAAM,CAAC,CAAC,CAAC,EAAE,EAAE,CAAC,CAAC,CAAC,MAAM,KAAK,MAAM,CAAC,CAAC;QACpE,IAAA,eAAM,EAAC,SAAS,CAAC,CAAC,YAAY,CAAC,CAAC,CAAC,CAAC;QAClC,KAAK,MAAM,IAAI,IAAI,SAAS,EAAE,CAAC;YAC7B,MAAM,QAAQ,GAAG,KAAK,CAAC,IAAI,CAAC,CAAC,CAAC,EAAE,EAAE,CAAC,CAAC,CAAC,IAAI,KAAK,IAAI,CAAC,IAAI,CAAC,CAAC;YACzD,IAAA,eAAM,EAAC,IAAI,CAAC,OAAO,CAAC,CAAC,IAAI,CAAC,QAAS,CAAC,OAAO,CAAC,CAAC;QAC/C,CAAC;IACH,CAAC,CAAC,CAAC;AACL,CAAC,CAAC,CAAC;AAEH;;oEAEoE;AAEpE,IAAA,iBAAQ,EAAC,mCAAmC,EAAE,GAAG,EAAE;IACjD,IAAA,WAAE,EAAC,uDAAuD,EAAE,GAAG,EAAE;QAC/D,MAAM,KAAK,GAAgB;YACzB,QAAQ,CAAC,SAAS,EAAE,GAAG,CAAC,EAAO,iCAAiC;YAChE,OAAO,CAAC,QAAQ,EAAE,GAAG,CAAC,EAAS,iDAAiD;YAChF,QAAQ,CAAC,SAAS,EAAE,GAAG,CAAC,EAAO,wCAAwC;YACvE,OAAO,CAAC,YAAY,EAAE,GAAG,CAAC,EAAK,yBAAyB;SACzD,CAAC;QACF,MAAM,MAAM,GAAG,IAAA,iCAAiB,EAAC,KAAK,CAAC,CAAC;QACxC,MAAM,SAAS,GAAG,MAAM,CAAC,WAAW,CAClC,MAAM,CAAC,OAAO,CAAC,GAAG,CAAC,CAAC,CAAC,EAAE,EAAE,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,KAAK,CAAC,GAAG,CAAC,CAAC,GAAG,EAAG,EAAE,CAAC,CAAC,MAAM,CAAC,CAAC,CAChE,CAAC;QACF,IAAA,eAAM,EAAC,SAAS,CAAC,SAAS,CAAC,CAAC,CAAC,IAAI,CAAC,oBAAoB,CAAC,CAAC;QACxD,IAAA,eAAM,EAAC,SAAS,CAAC,QAAQ,CAAC,CAAC,CAAC,IAAI,CAAC,oBAAoB,CAAC,CAAC;QACvD,IAAA,eAAM,EAAC,SAAS,CAAC,SAAS,CAAC,CAAC,CAAC,IAAI,CAAC,oBAAoB,CAAC,CAAC;QACxD,IAAA,eAAM,EAAC,SAAS,CAAC,YAAY,CAAC,CAAC,CAAC,IAAI,CAAC,MAAM,CAAC,CAAC;IAC/C,CAAC,CAAC,CAAC;IAEH,IAAA,WAAE,EAAC,8DAA8D,EAAE,GAAG,EAAE;QACtE,IAAA,eAAM,EAAC,uCAAuB,CAAC,cAAc,CAAC,CAAC,IAAI,CAAC,GAAG,CAAC,CAAC;QACzD,IAAA,eAAM,EAAC,uCAAuB,CAAC,sBAAsB,CAAC,CAAC,IAAI,CAAC,GAAG,CAAC,CAAC;QACjE,IAAA,eAAM,EAAC,uCAAuB,CAAC,mBAAmB,CAAC,CAAC,IAAI,CAAC,GAAG,CAAC,CAAC;QAC9D,IAAA,eAAM,EAAC,uCAAuB,CAAC,mBAAmB,CAAC,CAAC,IAAI,CAAC,GAAG,CAAC,CAAC;IAChE,CAAC,CAAC,CAAC;AACL,CAAC,CAAC,CAAC"}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-template-system.js:440:      // Check for priority tags [P0], [P1], [P2]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-template-system.js:446:        pass('T-030d: checklist.md has priority tags', '[P0], [P1], [P2] found');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-template-system.js:448:        fail('T-030d: checklist.md has priority tags', `P0:${hasP0}, P1:${hasP1}, P2:${hasP2}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-template-system.js:531:      // Check that priority is set
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-template-system.js:534:        pass('T-040f: examples/level_1/spec.md has set priority', 'Priority level found');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-template-system.js:536:        fail('T-040f: examples/level_1/spec.md has set priority', 'No priority found');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.js.map:1:{"version":3,"file":"progressive-validation.vitest.js","sourceRoot":"","sources":["progressive-validation.vitest.ts"],"names":[],"mappings":"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"}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-export-contracts.js:344:        //   - direct export mapping: handle_x: handleX
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-export-contracts.js:349:        const directMappingOk = aliasEntry && aliasEntry.value === camelKey;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-export-contracts.js:352:        if (!directMappingOk && !localAliasOk) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-factory.js:71:    // Test 6: Test HF provider creation (without warmup)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-embeddings-factory.js:72:    console.log('6️⃣ Creating HF local provider (without warmup)...');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-trigger.test.ts:102:  it('keeps one useful cluster anchor while dropping parent packet scaffold noise', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts:155:    it('allows pruning a converged segment without stopping global wave', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.js:914://# sourceMappingURL=progressive-validation.vitest.js.map
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr6.vitest.ts:102:    const longRationale = 'Because the shared truncation helper keeps the decision context readable and avoids clipping words in the saved memory output. '
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:469:  it('skips duplicate markdown content on a second identical save without bumping description tracking', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts:620:  it.skip('renders tree-thinning merge notes while still completing save bookkeeping', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/tree-thinning.vitest.js:339://# sourceMappingURL=tree-thinning.vitest.js.map
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-validation.sh:711:    run_test "Legacy bare priority format now fails" "060-checklist-chk-format-invalid" "fail"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/coverage-graph-convergence.vitest.ts:97:    it('rebuilds from JSONL records (priority 1)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/session-data-factory.ts:49:      OBSERVATION: 'Verified duplicate content skips the markdown write and leaves bookkeeping unchanged.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/session-data-factory.ts:169:    SUMMARY: 'Verified tree thinning merges several small sibling file descriptions into the rendered workflow memory while preserving save bookkeeping.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:319:    // Test clamping to 0-100
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:689:    // Test decision importance mapping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/progressive-validation.vitest.d.ts.map:1:{"version":3,"file":"progressive-validation.vitest.d.ts","sourceRoot":"","sources":["progressive-validation.vitest.ts"],"names":[],"mappings":""}
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-002b-proposition-overlap.json:6:      "prompt": "Deduplicate repeated propositions across outcomes and decisions without dropping authored rationale.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D1.json:5:    "sessionSummary": "This broken overview proves the reviewer catches truncation when the rendered text still ends mid token and falls back to the old ASCII ellipsis shape instead of the boundary safe contract that Phase 1 pinned down for JSON mode saves.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-001-trigger-cluster.json:3:  "sessionSummary": "Investigated sibling-memory trigger duplication while keeping the claude optimization settings continuation discoverable for Phase 6.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-005a-anchor-scaffolding.json:6:        "OUTCOME": "Removed legacy HTML ids while keeping comment anchors and markdown headers."

codex
One useful thread surfaced: Public already has latent warmup plumbing in the CLI/runtime, which may shift that earlier “new feature” toward a refactor of existing readiness paths instead of a brand-new subsystem. I’m tracing that next, plus whether write-time pinning already exists below the tool surface.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts | sed -n '430,470p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   430	  if (checkpointName) {
   431	    console.log(`  Restore:     Use checkpoint_restore MCP tool with name: ${checkpointName}`);
   432	  } else if (skipCheckpoint) {
   433	    console.log(`  Restore:     unavailable (checkpoint skipped)`);
   434	  }
   435	  console.log('');
   436	}
   437	
   438	/* ───────────────────────────────────────────────────────────────
   439	   5. REINDEX COMMAND
   440	──────────────────────────────────────────────────────────────── */
   441	
   442	async function runReindex(): Promise<void> {
   443	  const force = getFlag('force');
   444	  const eagerWarmup = getFlag('eager-warmup');
   445	
   446	  console.log(`\nReindex Memory Files`);
   447	  console.log(`${'-'.repeat(50)}`);
   448	  console.log(`  Mode:  ${force ? 'force (all files)' : 'incremental (changed only)'}`);
   449	  console.log(`  Warmup: ${eagerWarmup ? 'eager (startup)' : 'lazy (on demand)'}`);
   450	
   451	  // Dynamic import to avoid pulling in heavy modules unless needed.
   452	  const { handleMemoryIndexScan } = await import('./handlers/memory-index.js');
   453	
   454	  await initDatabase();
   455	
   456	  // Optional legacy warmup path.
   457	  if (eagerWarmup) {
   458	    console.log(`  Loading embedding model...`);
   459	    const embeddings = await import('./lib/providers/embeddings.js');
   460	    try {
   461	      await embeddings.generateEmbedding('warmup');
   462	    } catch (err: unknown) {
   463	      const message = err instanceof Error ? err.message : String(err);
   464	      console.error(`  ERROR: Embedding model failed: ${message}`);
   465	      process.exit(1);
   466	    }
   467	  }
   468	
   469	  console.log(`  Scanning...`);
   470	  const result = await handleMemoryIndexScan({

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts | sed -n '540,590p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   540	    return Number.isFinite(parsed) ? parsed : 0;
   541	  } catch (e: unknown) {
   542	    const message = e instanceof Error ? e.message : String(e);
   543	    console.error('[db-state] Error getting last scan time:', message);
   544	    return 0;
   545	  }
   546	}
   547	
   548	/** Persist the timestamp of the last index scan to the config table. */
   549	export async function setLastScanTime(time: number): Promise<void> {
   550	  await completeIndexScanLease(time);
   551	}
   552	
   553	// ────────────────────────────────────────────────────────────────
   554	// 6. EMBEDDING MODEL READINESS 
   555	
   556	// ────────────────────────────────────────────────────────────────
   557	
   558	/** Return whether the embedding model has been marked as ready. */
   559	export function isEmbeddingModelReady(): boolean {
   560	  return embeddingModelReady;
   561	}
   562	
   563	/** Set the embedding model readiness flag. */
   564	export function setEmbeddingModelReady(ready: boolean): void {
   565	  embeddingModelReady = ready;
   566	}
   567	
   568	/** Poll until the embedding model is ready, returning false on timeout. */
   569	export async function waitForEmbeddingModel(timeoutMs: number = 30000): Promise<boolean> {
   570	  const startTime = Date.now();
   571	  const checkInterval = 500;
   572	
   573	  while (!embeddingModelReady) {
   574	    if (Date.now() - startTime > timeoutMs) {
   575	      console.error('[db-state] Embedding model warmup timeout');
   576	      return false;
   577	    }
   578	    await new Promise<void>(resolve => setTimeout(resolve, checkInterval));
   579	  }
   580	  return true;
   581	}
   582	
   583	// ────────────────────────────────────────────────────────────────
   584	// 7. CONSTITUTIONAL CACHE ACCESSORS 
   585	
   586	// ────────────────────────────────────────────────────────────────
   587	
   588	/** Return the cached constitutional memory entries, or null if not cached. */
   589	export function getConstitutionalCache(): unknown {
   590	  return constitutionalCache;

exec
/bin/zsh -lc "rg -n \"core\\)|core=true|core\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:140:          "Store a project memory: a decision, preference, or important context. One concise concept per memory. Set core=true for critical context that should always be available in every session (use sparingly).",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:143:          core: tool.schema.boolean().optional().describe(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:150:          if (args.core) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:151:            cmdArgs.push("--tag", "core");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:162:          "Store a cross-project memory: personal preferences, coding style, tool choices. Set core=true for critical cross-project context that should always be available.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:165:          core: tool.schema.boolean().optional().describe(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:185:          if (args.core) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:186:            cmdArgs.push("--tag", "core");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:220:- Use **core** for facts that should always be in context (project architecture, key conventions, user preferences).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:43:| `memory_store` | Store a project-scoped memory (optionally as `core`) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:44:| `memory_store_global` | Store a cross-project memory (optionally as `core`) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:57:| Core (project) | `<directory-name>` (tagged `core`) | Sessions + survives compaction |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:58:| Core (global) | `global` (tagged `core`) | All projects + survives compaction |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:74:- Mark critical, always-relevant context as core (core=true) — but use sparingly.

exec
/bin/zsh -lc 'rg -n "is_pinned|pinned|pin" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1232:    console.error('[context-server] Startup scan already in progress, skipping');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:294:      console.error(`[memory-save] T054: Duplicate content detected (hash match id=${duplicateByHash.id}), skipping embedding`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:304:        message: `Duplicate content detected: identical to existing memory #${duplicateByHash.id} (${duplicateByHash.file_path}). Skipping embedding generation.`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:181:            console.warn(`[memory-crud-update] BM25 infrastructure unavailable, skipping re-index [requestId=${requestId}]: ${bm25ErrMsg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:526:        // Phase 1: Adaptive content truncation — truncate content fields before dropping results
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:39:    .replace(/\n{2,}/g, '\n')                   // collapse blank lines left by stripping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:335:      console.warn('[PE-Gate] memory_conflicts table not yet created, skipping log');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1095:      console.warn('[memory-search] Cached response shape mismatch: missing "data" object, skipping dedup');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1097:      console.warn('[memory-search] Cached response shape mismatch: "data.results" is not an array, skipping dedup');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:708:3. Indexes changed or new files, skipping unchanged ones based on content hash
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:412:**Signal vocabulary expansion** -- recognizes correction signals ("actually", "wait") and preference signals ("prefer", "want") in your language, shaping quality scoring.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:517:**12-metric core computation** -- grades every query across twelve quality dimensions (MRR@1/3/10, NDCG@10, MAP and more). Together they pinpoint exactly where search is struggling, like a doctor running multiple tests instead of just asking "do you feel sick?"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:832:The cleanup tool for large-scale housekeeping. Delete all outdated or temporary memories in one go based on their importance level, like clearing out the recycling bin. The most important memories get extra protection. A safety checkpoint is created first so you can restore if needed.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1042:The MCP handler scores chunk-backed hits against `parentMemoryId ?? row.id`, so eval rows stay attached to canonical parent memories. Before comparing runs after a DB rebuild or import, preview or refresh the live ground-truth mapping with `scripts/evals/map-ground-truth-ids.ts`; if token-budget overflow collapses a run below `recallK`, treat that run as investigation-only rather than a clean benchmark.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:1744:| [lib/search/README.md](./lib/search/README.md) | Per-stage module mapping for the 4-stage search pipeline |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:25:interface CausalLinkMapping {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:66:const CAUSAL_LINK_MAPPINGS: Record<string, CausalLinkMapping> = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:371:    const mapping = CAUSAL_LINK_MAPPINGS[link_type];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:372:    if (!mapping) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:398:      const edgeSourceId = mapping.reverse ? String(resolvedId) : memoryIdStr;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:399:      const edgeTargetId = mapping.reverse ? memoryIdStr : String(resolvedId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:402:        causalEdges.insertEdge(edgeSourceId, edgeTargetId, mapping.relation, 1.0, `Auto-extracted from ${link_type} in memory file`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:404:        console.error(`[causal-links] Inserted edge: ${edgeSourceId} -[${mapping.relation}]-> ${edgeTargetId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:408:          console.error(`[causal-links] Edge already exists: ${edgeSourceId} -[${mapping.relation}]-> ${edgeTargetId}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:435:  CausalLinkMapping,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:485:  description: '[L6:Analysis] Trace causal chain for a memory to answer "why was this decision made?" Traverses causal edges up to maxDepth hops, grouping results by relationship type (caused, enabled, supersedes, contradicts, derived_from, supports). Use to understand decision lineage and memory relationships. Token Budget: 1200.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:54:- `handler-utils.ts`, `types.ts` - Shared handler helpers and domain typing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:388: * The lease blocks overlapping scans via `scan_started_at` and preserves
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:567:    // After stripping trailing slash in getParentPath, this becomes '003-foo'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:182:  // --- Intent-to-edge priority mapping ---
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/scripts/map-ground-truth-ids.ts:4:// MODULE: Ground Truth ID Mapping Compatibility Wrapper
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:169:  // Keep the UX contract tests focused on save-path response shaping.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:106:// Replaces the previous process-global boolean to avoid skipping priming
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:290:      `(${tokenCount} > ${budgetLimit}); dropping payload`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:5:// node/edge upsert with self-loop rejection and weight clamping.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:217:describe('buildRecoveryPayload() — recommendedAction mapping', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:286:  it('shortens long queries by keeping the first 3 words', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:304:  it('numeric parentMemoryId grouping works correctly', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:179:    // Use highly overlapping text to exceed 0.75 Jaccard threshold
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:4:// Phase 030 / Phase 2: transport-only mapping from shared payload
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:28:    is_pinned: 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:224:    const rowUnpinned = { ...makeFullDbRow(), is_pinned: 0 };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:225:    expect(dbRowToMemory(rowUnpinned).isPinned).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:228:    expect(memoryToDbRow(memory).is_pinned).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:229:    expect(memoryToDbRow({ ...memory, isPinned: false }).is_pinned).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:306:  if (memory.is_pinned === 1) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:505:  if (memory.is_pinned === 1) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:33:      hookLog('warn', 'gemini:session-stop', `Transcript too large (${stat.size} bytes > ${MAX_TRANSCRIPT_BYTES}); skipping spec folder detection`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:361: * Strategy: SQL query fetches broad candidates (unarchived, not protected, not pinned).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:371:    // Broad SQL pre-filter: get unarchived, non-protected, non-pinned memories
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:377:        AND is_pinned = 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/README.md:3:description: "Response formatting for search results, anchor filtering metrics, and safe content shaping."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:399:      const mappings = CAUSAL_LINK_MAPPINGS;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:400:      expect(mappings).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:401:      expect(typeof mappings).toBe('object');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:402:      const keys = Object.keys(mappings);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:324:    it('only compares overlapping query-memory pairs', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:341:    it('returns zeroes for no overlapping pairs', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:199:  it('covers all three tiers with non-overlapping ranges', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:98:    { id: 901, content: 'Release checklist task ownership and sign-off bookkeeping. '.repeat(2) },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:618:        // @ts-expect-error testing runtime null-db fallback despite non-null typing
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:415:    // Deduplicate by ID, keeping the higher similarity score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:231:    hookLog('info', 'session-stop', 'Stop hook not active, skipping');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:142:      const r = tierClassifier.classifyTier({ id: 2, is_pinned: 1, stability: 1.0 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:180:      expect(tierClassifier.shouldArchive({ id: 3, is_pinned: 1, stability: 0.01, created_at: new Date(Date.now() - 200 * 86400000).toISOString() })).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2078: * Merge two result arrays, deduplicating by id and keeping the higher score.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:78:  describe('Decay floor clamping', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:153: * Query keyword/pattern mapping for artifact class detection from
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:204: * Intent-based fallback mapping for artifact class detection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:44:      is_pinned INTEGER DEFAULT 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:253:    it('T521-L3: Limit clamping validates boundary values', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:105: * 4. Suggest dropping the spec folder constraint when it was set
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:182: * @returns Record mapping channel name to item count.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1112:        logger.warn(`Migration v23: Skipping row ${row.id} — canonicalization failed`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1126:    // P1-3 fix: Migrate session_state.spec_folder using old→new mapping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1220:        logger.info('Migration v25: CHECK constraint already correct, skipping table rebuild');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1801:  if (!column_names.includes('is_pinned')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1803:      database.exec(`ALTER TABLE memory_index ADD COLUMN is_pinned INTEGER DEFAULT 0`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1804:      console.warn('[vector-index] Migration: Added is_pinned column');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1809:      logDuplicateColumnMigrationSkip('is_pinned', error);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2172: * Migrate session_state.spec_folder values using the old→new mapping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2182:  // Build old→new mapping, keep only unambiguous 1:1 mappings
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2183:  const mapping = new Map<string, Set<string>>();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2185:    if (!mapping.has(u.oldSpecFolder)) mapping.set(u.oldSpecFolder, new Set());
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2186:    mapping.get(u.oldSpecFolder)!.add(u.canonical);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2199:    const targets = mapping.get(row.spec_folder);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2205:      logger.warn(`Migration v23: Ambiguous session_state mapping for "${row.spec_folder}". Skipping.`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2222:  const mapping = new Map<string, Set<string>>();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2224:    if (!mapping.has(update.oldSpecFolder)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2225:      mapping.set(update.oldSpecFolder, new Set());
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2227:    mapping.get(update.oldSpecFolder)!.add(update.canonical);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2242:    const targets = mapping.get(row.spec_folder);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2248:      logger.warn(`Migration v23: Ambiguous memory_history mapping for "${row.spec_folder}". Skipping.`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2318:      is_pinned INTEGER DEFAULT 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts:76:  // Penalize very short chunks (< 100 chars after stripping)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts:43: * The damping factor `1/sqrt(M+1)` prevents large folders from
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts:80:    const dampingFactor = 1 / Math.sqrt(M + 1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts:82:    folderScores.set(folder, dampingFactor * scoreSum);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:5:import type { CausalLinkMapping } from '../handlers/causal-links-processor';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:256:    const mappings = causalLinksProcessor.CAUSAL_LINK_MAPPINGS;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:257:    expect(mappings).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:258:    expect(typeof mappings).toBe('object');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:259:    expect(Array.isArray(mappings)).toBe(false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:264:    const mappings = causalLinksProcessor.CAUSAL_LINK_MAPPINGS;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:266:    const keys = Object.keys(mappings);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:269:      expect(mappings).toHaveProperty(k);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:275:      const mappings = causalLinksProcessor.CAUSAL_LINK_MAPPINGS;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:276:      for (const [, mapping] of Object.entries(mappings)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:277:        const typedMapping = mapping as CausalLinkMapping;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:278:        expect(typeof typedMapping.relation).toBe('string');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:279:        expect(typeof typedMapping.reverse).toBe('boolean');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:295:      const mappings = causalLinksProcessor.CAUSAL_LINK_MAPPINGS;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:297:      for (const [, mapping] of Object.entries(mappings)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:298:        const typedMapping = mapping as CausalLinkMapping;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:299:        expect(validRelations).toContain(typedMapping.relation);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:369:  it('has all 7 intent mappings', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:371:    const mapping = memoryContext.INTENT_TO_MODE;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:373:    const keys = Object.keys(mapping);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:376:      expect(mapping).toHaveProperty(k);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:599:describe('C138: Centroid-Based Classification & Lambda Mapping', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:677:  it('C138-T5: intent-to-lambda mapping covers required intents', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:281:  // Of truth for frontmatter stripping, handles CRLF via [\s\S]*? matching.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-types.vitest.ts:147:    it('T080: Type inference from importance_tier mapping', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:58:  is_pinned?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:10://   gates (density + size), community score capping (secondary-only).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:203:    console.warn('[embedding-expansion] Received empty embedding — skipping expansion');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:351:          console.warn(`[file-watcher] Skipping reindex outside watch roots: ${path.basename(filePath)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:29:describe('agent routing validates classifier-backed intent mapping', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:627: * @returns Response profile name or null if no mapping exists
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:636: * C138: Intent-to-MMR-lambda mapping.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:340:| `progressive-disclosure.ts` | -     | TypeScript | Supports progressive-disclosure result paging and response shaping |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:513:**Spec Folder Scoping**:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:580:| **Algorithm** | TF-IDF sentence scoring with markdown stripping and tokenization |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:24: * Importance tier → quality score mapping.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:162: *   2. `importance_tier` → tier quality score mapping.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:60: * separate implementations with different fallback orders and clamping. This shared
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:56:  'is_pinned',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:132:      is_pinned INTEGER DEFAULT 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:142:    const longContent = 'This is a much longer piece of meaningful content that exceeds one hundred characters after stripping and should not be penalized for length at all.';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:204:  describe('T069: extractDocumentType() filename mapping', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:469:      // Use low base values to avoid clamping to 1.0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:485:      // Constitutional (2.0) > spec (1.4) with low enough base to avoid clamping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:711:  describe('T074: Tier mapping', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:867:        is_pinned: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:910:        is_pinned: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:151:    // Preserve checklist state markers while dropping the bullet itself.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:865: * Apply min-max normalization to composite scores, mapping to [0,1].
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:150:  // Machine is slow, keeping the consolidation cycle non-blocking.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:544:    // Fail-closed: broken bookkeeping must not cause unbounded cycle runs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:546:    console.warn('[consolidation] cadence bookkeeping error:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:35:    it('computes correct deltas for overlapping results', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:41:/** Default tier-to-budget mapping when dynamic allocation is enabled.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1244:        `[checkpoints] Skipping post-restore rebuild "${name}" because dependencies did not complete: ${missingDeps.join(', ')}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1328:    'is_pinned',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1773:                `[checkpoints] Skipping restore of memory ${memory.id}: identity "${memory.spec_folder}:${memory.file_path}:${String(memory.anchor_id ?? '')}" already exists as memory ${existingByPath.id}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1804:                  `[checkpoints] Skipping restore of memory ${memory.id}: id collision with existing identity "${existingById.spec_folder}:${existingById.file_path}:${String(existingById.anchor_id ?? '')}"`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:63: * Default tier-to-channel mapping:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:21:/** Trigger cache entry for a single phrase-to-memory mapping */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:474:  // Step 2: Optional accent stripping (NFKD + remove combining marks)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:205:         WHEN m.is_pinned = 1 THEN m.importance_weight
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts:187:    it('T501-08b: Unicode accent stripping', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:509:    // L3 FIX: Correct p95 percentile index with bounds clamping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:38:  is_pinned?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:81:      is_pinned INTEGER DEFAULT 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:105:    INSERT INTO memory_index (spec_folder, file_path, title, content_text, importance_tier, created_at, last_accessed, access_count, confidence, is_pinned, stability, half_life_days)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:118:    data.is_pinned || 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:113:  // Canonical self-mappings
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:208:  // Convert UTF-16 BE to LE by swapping bytes, then decode as utf16le.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:502:          console.warn('[reconsolidation] Deprecate target not found, skipping edge insert');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:794:    it('5.1.2 correct mappings', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:769:    it('limit applies after sprint grouping and report totals match the included scope', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:286:    // Both channels return overlapping result (id=1)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:130:  /** D3-002: Classified query intent. Used for intent-aware edge priority mapping. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:387: * and dropping non-finite values to guard against DB query injection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:1105:            console.warn(`[structural-indexer] Skipping large file (${(stat.size / 1024).toFixed(1)}KB > ${(maxSize / 1024).toFixed(1)}KB): ${fullPath}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:72:| `layer-definitions.ts` | Layer constants, tool-to-layer mapping, token budget helpers, documentation generator |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:451: * community score capping (secondary-only).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:672:describe('T022-11: Tier-to-Channel Mapping Readiness', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:21:const mappingChecks = [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:101:describe('Feature flag reference catalog mappings', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:102:  for (const check of mappingChecks) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/deterministic-extractor.ts:171:  // Silence unused variable warning while keeping the constant for documentation
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:188:  describe('namespace scoping', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:36:  /** Session ID for grouping selections. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:88:  /** Total number of overlapping query-memory pairs compared. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:461:  // Compare overlapping pairs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:108:          is_pinned INTEGER DEFAULT 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:6:// Verifies feature flag gating, channel-to-flag mapping, ablation runner
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:1071:      console.warn('No queries with ground truth — skipping isolation test');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/tree-sitter-parser.ts:83:// ── Node type → SymbolKind mapping ─────────────────────────────
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:951:      "notes": "Manual refactor opinion expressed as a statement — tests whether refactor intent surfaces current architecture docs."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:960:      "expectedResultDescription": "Should surface trigger-matcher.ts, vector-index.ts, hybrid-search.ts, and any architectural decision about keeping the two paths separate.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:89:   for queries where live DB mapping has not yet been performed.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:106:  // Use the real production DB ID mappings from GROUND_TRUTH_RELEVANCES.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:13://   - Sprint labels inferred from metadata JSON or eval_run_id grouping.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:274:/** Resolve multiple seeds, deduplicate overlapping refs */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:25:/** Full analysis result mapping each tested K-value to its metrics. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:72:| **Chunk Thinning** | R7 anchor-aware chunk scoring and threshold-based dropping at index time |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:519:- `tests/full-spec-doc-indexing.vitest.ts`: validates document typing, scoring multipliers and spec-doc intent routing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:93: * Groups results by channel, deduplicates by memory ID (keeping highest score).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposition.vitest.ts:55:  it('deduplicates overlapping results when merging facet coverage pools', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:7:// the export surface without bootstrapping a real database.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:89:  /** Mean absolute score delta across overlapping results. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:91:  /** Mean absolute rank delta across overlapping results. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:190: * Only considers overlapping results.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:198:  // Find overlapping IDs and their rank pairs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:304:  // Compute per-result deltas for overlapping results
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:385:        console.warn(`[transaction-manager] Skipping pending recovery because DB file is missing: ${databasePath}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:657:        // QueriesChannelHelped = channel was helping (removing it hurt quality)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:584: * @returns Record mapping metric name to computed value in [0, 1].
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:173:    // Use very high beta to force clamping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:189:    // Create two lists with overlapping items
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:233:  it('keeps custom SQLiteVectorStore instances pinned to their own databases after alternating writes', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:667:    // Based on INTENT_TO_MODE mapping, auto can route to deep or focused
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:674:    // Verified by examining the mapping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:96: * Returns 0 for lists with fewer than 2 overlapping items.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:106:  // Find overlapping items
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:4:// Validates FolderScore formula, damping, enrichment, two-phase
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:48:      // M = 2, damping = 1/sqrt(3), sum = 1.4
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:68:      // M = 1, damping = 1/sqrt(2), sum = 0.9
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:81:     T020-02: Damping factor verification
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:83:  describe('Damping factor', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:84:    it('T020-02: folder with 9 results (damping=1/sqrt(10)) vs 1 result (damping=1/sqrt(2))', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:101:      const largeDamping = 1 / Math.sqrt(10);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:102:      const smallDamping = 1 / Math.sqrt(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:103:      const expectedLarge = largeDamping * 4.5;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:104:      const expectedSmall = smallDamping * 0.9;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:109:      // Large folder still wins here due to volume, but damping reduces its advantage
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:111:      // Verify damping is applied (raw sum 4.5 >> 0.9 but damped score ratio is much closer)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:119:     T020-03: Large folder damping — quality over quantity
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:121:  describe('Large folder damping', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:185:      const folderMap = buildFolderMap([]); // No mappings
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:254:      // All single-result folders have same damping (1/sqrt(2))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:370:      // Verify the top folder is folder-top (higher individual scores + same damping)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:379:    it('T020-11a: returns correct mapping from mock database', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:109:    it('T11: Specific tool-to-layer mappings are correct', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:110:      const expectedMappings: Record<string, string> = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:134:      for (const [tool, expectedLayer] of Object.entries(expectedMappings)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:499:    it('T524-6: INTENT_TO_MODE mapping is correct', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:500:      const expectedMappings: Record<string, string> = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:508:      for (const [intent, expectedMode] of Object.entries(expectedMappings)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:34:        is_pinned: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:96:  // 4.3 is_pinned boolean↔integer round-trip
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:97:  describe('is_pinned ↔ isPinned boolean/integer round-trip', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:98:    it('T-NR-05: is_pinned 0 → false → 0 → false', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:100:      const memory = dbRowToMemory({ id: 1, is_pinned: 0, spec_folder: 'a', file_path: 'b' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:104:      expect(backRow.is_pinned).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:111:    it('T-NR-06: is_pinned 1 → true → 1', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:113:      const memory = dbRowToMemory({ id: 2, is_pinned: 1, spec_folder: 'a', file_path: 'b' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:117:      expect(backRow.is_pinned).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:120:    it('T-NR-07: is_pinned null → isPinned false/null', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:122:      const memory = dbRowToMemory({ id: 3, is_pinned: null, spec_folder: 'a', file_path: 'b' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:138:        is_pinned: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:148:        anchor_id: null, is_pinned: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:158:        stability: null, is_pinned: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:168:        last_review: null, is_pinned: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:193:        is_pinned: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-combiner.vitest.ts:473:      // For linear SHAP: sum of SHAP values + E[f(x)] = f(x) (before clamping)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-combiner.vitest.ts:484:      // f(x) = bias + sum(weight_i * x_i) (before clamping)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:309:  it('returns 0 for fewer than 2 overlapping items', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:632:  it('only includes overlapping items in deltas', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:169:  it('handles punctuation correctly by stripping it during tokenization', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1036:    // Parser should reject (content < 5 after stripping? or validation fails)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:287:    it('T500-09c: overlapping anchors are rejected', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:288:      const overlappingContent = `<!-- ANCHOR:outer -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:295:      const validation = memoryParser.validateAnchors(overlappingContent);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:22:- [3. FEATURE CATALOG MAPPING](#3--feature-catalog-mapping)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:144:  - `recovery-hints.ts` — tool-aware recovery guidance and error-code hint mapping.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:284:- Purpose: Owns the standard MCP response envelope used to make tool results predictable for agents and callers. It is the canonical place for `{summary, data, hints, meta}` shaping.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:411:<!-- ANCHOR:feature-catalog-mapping -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:492:<!-- /ANCHOR:feature-catalog-mapping -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:44:| **Tier Mapping** | Link importance tiers to appropriate memory types |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:54:| Keyword Mappings | 40+ | Title/trigger phrase to type mapping |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:90:### Tier to Type Mapping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:40:      is_pinned INTEGER DEFAULT 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/utils/README.md:69:| `path-security.ts` | Re-exports path validation and regex escaping from `@spec-kit/shared/utils/path-security` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:109:/** Weight clamping bounds */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:602:        return { success: false, error: 'Embedding provider circuit breaker open — skipping API call' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:97:| `storeCommunityAssignments` | community-detection.ts | Persists node-to-community mappings with INSERT OR REPLACE |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:139:| `community_assignments` | community-detection.ts | Persisted node-to-community mappings |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:237:  // over-captured by the generic important -> declarative mapping.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:247:  // 3. Check importance tier mapping
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:321:  importance_tier: 'Derived from importance_tier field mapping',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:163:| `createEnvelope(data, trace, degradedMode?, serverVersion?)` | `ContextEnvelope<T>` | New envelope wrapping results + trace + metadata |

exec
/bin/zsh -lc 'rg -n "is_pinned|isPinned" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib | head -n 80' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "is_pinned|isPinned" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:56:  'is_pinned',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:132:      is_pinned INTEGER DEFAULT 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1328:    'is_pinned',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:306:  if (memory.is_pinned === 1) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:505:  if (memory.is_pinned === 1) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:377:        AND is_pinned = 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:205:         WHEN m.is_pinned = 1 THEN m.importance_weight
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1801:  if (!column_names.includes('is_pinned')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1803:      database.exec(`ALTER TABLE memory_index ADD COLUMN is_pinned INTEGER DEFAULT 0`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1804:      console.warn('[vector-index] Migration: Added is_pinned column');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1809:      logDuplicateColumnMigrationSkip('is_pinned', error);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2318:      is_pinned INTEGER DEFAULT 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:58:  is_pinned?: number;

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts | sed -n '20,35p;220,230p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    20	    embedding_model: 'gte-small',
    21	    embedding_generated_at: '2025-01-15T10:31:00Z',
    22	    embedding_status: 'completed',
    23	    retry_count: 0,
    24	    last_retry_at: null,
    25	    failure_reason: null,
    26	    base_importance: 0.9,
    27	    decay_half_life_days: 60,
    28	    is_pinned: 1,
    29	    access_count: 15,
    30	    last_accessed: 1706800000,
    31	    importance_tier: 'critical',
    32	    session_id: 'sess-abc123',
    33	    context_type: 'decision',
    34	    channel: 'manual',
    35	    content_hash: 'sha256-abc',
   220	    // IsPinned: SQLite integer → boolean
   221	    expect(memory.isPinned).toBe(true);
   222	    expect(typeof memory.isPinned).toBe('boolean');
   223	
   224	    const rowUnpinned = { ...makeFullDbRow(), is_pinned: 0 };
   225	    expect(dbRowToMemory(rowUnpinned).isPinned).toBe(false);
   226	
   227	    // Boolean → integer round-trip
   228	    expect(memoryToDbRow(memory).is_pinned).toBe(1);
   229	    expect(memoryToDbRow({ ...memory, isPinned: false }).is_pinned).toBe(0);
   230	  });

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts | sed -n '195,215p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
I found a likely overlap point: Public already has a dedicated memory-surface hook layer. I’m reading that now because it changes whether the right move is “add a Mnemosyne-style hook” or “refactor the existing memory-surface contract to cover compaction explicitly.”
exec
/bin/zsh -lc 'rg -n "compaction|memory tools|memory_surface|surface|priming|session-stop|hook" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
28:  /** PI-A4: LLM-consumable retrieval directive, e.g. "Always surface when: …" */
60:  surfaced_at: string;
64:/** T018: Structured session prime payload for non-hook CLI auto-priming */
71:  /** Phase 027: Structural bootstrap contract for non-hook runtimes */
73:  /** Phase 009 T041: Graph retrieval routing rules for AI session priming */
95:// Token budgets for dual-scope lifecycle hooks (TM-05)
105:// Per-session priming tracker: a Set of session IDs that have been primed.
106:// Replaces the previous process-global boolean to avoid skipping priming
253:  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware'
289:      `[SK-004] Auto-surface output exceeded ${hookName} token budget ` +
296:    `[SK-004] Auto-surface output truncated to fit ${hookName} token budget ` +
305: * working set, improving surface relevance.
317:    // stale cross-session entries from influencing auto-surface ordering.
368:  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware' = 'memory-aware'
373:    // Get constitutional memories (always surface)
392:    // Only return if we have something to surface
409:      surfaced_at: new Date().toISOString(),
411:    }, tokenBudget, hookName);
414:    console.warn('[SK-004] Auto-surface failed:', message);
419:/** T018: Build structured Prime Package for non-hook CLI auto-priming */
475:  // Phase 027: Structural bootstrap contract for auto-prime surface
522:    // Phase 024 / Item 9: Record bootstrap telemetry for MCP auto-priming
534:        surfaced_at: new Date().toISOString(),
546:      surfaced_at: new Date().toISOString(),
552:      `[SK-004] Session priming failed on first tool call '${toolName}'` +
560: * Reset priming state. When called with a sessionId, clears only that session.
579: * the dispatched tool's arguments, then surfaces relevant memories via
592: * @returns AutoSurfaceResult or null if nothing to surface / hook disabled
599:  // Allow integration layer to disable this hook via config flag
614:  // Delegate to the core surface function; token budget is explicitly
615:  // Enforced at the hook output boundary via estimateTokenCount().
626: * Fires at session compaction lifecycle points. Surfaces memories relevant
628: * across the compaction boundary.
638: * @returns AutoSurfaceResult or null if nothing to surface / hook disabled
644:  // Allow integration layer to disable this hook via config flag
654:  // Delegate to the core surface function; token budget is explicitly
655:  // Enforced at the hook output boundary via estimateTokenCount().
656:  return autoSurfaceMemories(sessionContext.trim(), COMPACTION_TOKEN_BUDGET, 'compaction');

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts | sed -n '1,260p;260,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   260	    estimateTokenCount(JSON.stringify(candidate));
   261	
   262	  const budgetLimit = Number.isFinite(tokenBudget) && tokenBudget > 0
   263	    ? tokenBudget
   264	    : TOOL_DISPATCH_TOKEN_BUDGET;
   265	
   266	  let boundedResult: AutoSurfaceResult = result;
   267	  let tokenCount = measureTokens(boundedResult);
   268	
   269	  if (tokenCount <= budgetLimit) {
   270	    return boundedResult;
   271	  }
   272	
   273	  const triggered = [...boundedResult.triggered];
   274	  while (triggered.length > 0 && tokenCount > budgetLimit) {
   275	    triggered.pop();
   276	    boundedResult = { ...boundedResult, triggered };
   277	    tokenCount = measureTokens(boundedResult);
   278	  }
   279	
   280	  const constitutional = [...boundedResult.constitutional];
   281	  while (constitutional.length > 0 && tokenCount > budgetLimit) {
   282	    constitutional.pop();
   283	    boundedResult = { ...boundedResult, constitutional };
   284	    tokenCount = measureTokens(boundedResult);
   285	  }
   286	
   287	  if (tokenCount > budgetLimit) {
   288	    console.warn(
   289	      `[SK-004] Auto-surface output exceeded ${hookName} token budget ` +
   290	      `(${tokenCount} > ${budgetLimit}); dropping payload`
   291	    );
   292	    return null;
   293	  }
   294	
   295	  console.warn(
   296	    `[SK-004] Auto-surface output truncated to fit ${hookName} token budget ` +
   297	    `(${tokenCount}/${budgetLimit})`
   298	  );
   299	  return boundedResult;
   300	}
   301	
   302	/**
   303	 * Phase C: Get top-N attention-weighted memory IDs from working memory.
   304	 * Used to boost trigger-matched results that also appear in the active
   305	 * working set, improving surface relevance.
   306	 *
   307	 * @param limit - Maximum number of memory IDs to return
   308	 * @returns Set of memory IDs with high attention in working memory
   309	 */
   310	function getAttentionWeightedMemoryIds(limit: number = 5): Set<number> {
   311	  try {
   312	    const db: Database | null = vectorIndex.getDb();
   313	    if (!db) return new Set();
   314	
   315	    // Query top attention-weighted memories, scoped to the current session
   316	    // by filtering to entries focused within the last hour. This prevents
   317	    // stale cross-session entries from influencing auto-surface ordering.
   318	    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
   319	    const rows = db.prepare(`
   320	      SELECT DISTINCT wm.memory_id
   321	      FROM working_memory wm
   322	      WHERE wm.memory_id IS NOT NULL
   323	        AND wm.attention_score > ?
   324	        AND wm.last_focused >= ?
   325	      ORDER BY wm.attention_score DESC, wm.last_focused DESC
   326	      LIMIT ?
   327	    `).all(workingMemory.DECAY_FLOOR, oneHourAgo, limit) as Array<{ memory_id: number }>;
   328	
   329	    return new Set(rows.map(r => r.memory_id));
   330	  } catch (_err: unknown) {
   331	    // Graceful degradation — working memory boost is optional
   332	    return new Set();
   333	  }
   334	}
   335	
   336	/**
   337	 * Phase C: Apply 1.3x boost to trigger-matched results that also appear
   338	 * in the attention-weighted working memory set. Re-sorts results by
   339	 * boosted composite score.
   340	 *
   341	 * @param triggered - Trigger-matched results from matchTriggerPhrases()
   342	 * @param attentionIds - Set of memory IDs from working memory
   343	 * @returns Re-sorted trigger matches with working memory boost applied
   344	 */
   345	const ATTENTION_BOOST_FACTOR = 1.3;
   346	
   347	function applyAttentionBoost(
   348	  triggered: triggerMatcher.TriggerMatch[],
   349	  attentionIds: Set<number>,
   350	): triggerMatcher.TriggerMatch[] {
   351	  if (attentionIds.size === 0 || triggered.length === 0) return triggered;
   352	
   353	  // Score each result: base = matchedPhrases.length + (importanceWeight * 0.1)
   354	  // Apply 1.3x multiplier when memory is in working memory set.
   355	  return [...triggered]
   356	    .sort((a, b) => {
   357	      const scoreA = (a.matchedPhrases.length + a.importanceWeight * 0.1) *
   358	        (attentionIds.has(a.memoryId) ? ATTENTION_BOOST_FACTOR : 1.0);
   359	      const scoreB = (b.matchedPhrases.length + b.importanceWeight * 0.1) *
   360	        (attentionIds.has(b.memoryId) ? ATTENTION_BOOST_FACTOR : 1.0);
   361	      return scoreB - scoreA;
   362	    });
   363	}
   364	
   365	async function autoSurfaceMemories(
   366	  contextHint: string,
   367	  tokenBudget: number = TOOL_DISPATCH_TOKEN_BUDGET,
   368	  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware' = 'memory-aware'
   369	): Promise<AutoSurfaceResult | null> {
   370	  const startTime = Date.now();
   371	
   372	  try {
   373	    // Get constitutional memories (always surface)
   374	    const constitutional = await getConstitutionalMemories();
   375	
   376	    // Get triggered memories via fast phrase matching
   377	    let triggered = triggerMatcher.matchTriggerPhrases(contextHint, 5);
   378	
   379	    // Phase C: Attention-enriched boost — re-rank triggered results that
   380	    // also appear in the working memory active set.
   381	    try {
   382	      const attentionIds = getAttentionWeightedMemoryIds(5);
   383	      if (attentionIds.size > 0 && triggered.length > 0) {
   384	        triggered = applyAttentionBoost(triggered, attentionIds);
   385	      }
   386	    } catch (_boostErr: unknown) {
   387	      // Graceful degradation — attention boost is optional
   388	    }
   389	
   390	    const latencyMs = Date.now() - startTime;
   391	
   392	    // Only return if we have something to surface
   393	    if (constitutional.length === 0 && triggered.length === 0) {
   394	      return null;
   395	    }
   396	
   397	    // PI-A4: Enrich constitutional memories with retrieval_directive metadata.
   398	    // Pure content transformation — scoring is unchanged.
   399	    const enrichedConstitutional = enrichWithRetrievalDirectives(constitutional);
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

exec
/bin/zsh -lc "rg -n \"experimental\\.session\\.compacting|memory-surface|session\\.compacting|compaction\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-opencode-message-schema.mjs:48:  'compaction',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js:77: *   compaction?: TransportBlock,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js:396:    'experimental.session.compacting': async (input, output) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js:406:      const block = plan?.compaction;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:253:  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:368:  hookName: 'tool-dispatch' | 'compaction' | 'memory-aware' = 'memory-aware'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:626: * Fires at session compaction lifecycle points. Surfaces memories relevant
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:628: * across the compaction boundary.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:656:  return autoSurfaceMemories(sessionContext.trim(), COMPACTION_TOKEN_BUDGET, 'compaction');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:18:} from './memory-surface.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:29:- `memory-surface.ts`: context extraction, constitutional/triggered memory surfacing, lifecycle hook helpers, and constitutional cache management.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:149:        ? 'Recovered compact transcript lines were removed before fallback compaction cache assembly.'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:150:        : 'No recovered compact transcript lines detected in fallback compaction cache assembly.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:163:        kind: 'compaction',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:170:        summary: 'Fallback compaction cache assembled from sanitized transcript tail',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:7:/** Token budget for compaction context injection */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:19:import { autoSurfaceAtCompaction } from '../../hooks/memory-surface.js';

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts | sed -n '620,660p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

 succeeded in 0ms:
     1	#!/usr/bin/env node
     2	// ───────────────────────────────────────────────────────────────
     3	// MODULE: PreCompact Hook — Compact Inject
     4	// ───────────────────────────────────────────────────────────────
     5	// Runs on Claude Code PreCompact event. Precomputes critical context
     6	// using the 3-source merge pipeline (Memory, Code Graph, CocoIndex)
     7	// and caches to hook state for later injection by SessionStart hook.
     8	// stdout is NOT injected on PreCompact — we only cache here.
     9	
    10	import { performance } from 'node:perf_hooks';
    11	import { readFileSync } from 'node:fs';
    12	import {
    13	  parseHookStdin, hookLog, truncateToTokenBudget,
    14	  withTimeout, HOOK_TIMEOUT_MS, COMPACTION_TOKEN_BUDGET,
    15	} from './shared.js';
    16	import { ensureStateDir, updateState } from './hook-state.js';
    17	import { mergeCompactBrief } from '../../lib/code-graph/compact-merger.js';
    18	import type { MergeInput } from '../../lib/code-graph/compact-merger.js';
    19	import { autoSurfaceAtCompaction } from '../../hooks/memory-surface.js';
    20	import {
    21	  createPreMergeSelectionMetadata,
    22	  type SharedPayloadEnvelope,
    23	} from '../../lib/context/shared-payload.js';
    24	
    25	const COMPACT_FEEDBACK_GUARDS = [
    26	  /^\s*\[SOURCE:\s*hook-cache/i,
    27	  /^\s*\[PROVENANCE:/i,
    28	  /^\s*\[\/SOURCE\]/i,
    29	  /^\s*##\s+Recovered Context/i,
    30	  /^\s*##\s+Recovery Instructions/i,
    31	  /\bauto-recovered\b/i,
    32	];
    33	
    34	/** Extract the last N lines from a file */
    35	function tailFile(filePath: string, lines: number): string[] {
    36	  try {
    37	    const content = readFileSync(filePath, 'utf-8');
    38	    const allLines = content.split('\n');
    39	    return allLines.slice(Math.max(0, allLines.length - lines));
    40	  } catch {
    41	    return [];
    42	  }
    43	}
    44	
    45	/** Extract file paths mentioned in transcript lines */
    46	function extractFilePaths(lines: string[]): string[] {
    47	  const pathRegex = /(?:\/[\w.-]+){2,}(?:\.\w+)/g;
    48	  const paths = new Set<string>();
    49	  for (const line of lines) {
    50	    const matches = line.match(pathRegex);
    51	    if (matches) {
    52	      for (const m of matches) paths.add(m);
    53	    }
    54	  }
    55	  return [...paths].slice(0, 20);
    56	}
    57	
    58	/** Extract topics from recent transcript content */
    59	function extractTopics(lines: string[]): string[] {
    60	  const topics = new Set<string>();
    61	  for (const line of lines) {
    62	    const specMatch = line.match(/specs\/[\w-]+/g);
    63	    if (specMatch) specMatch.forEach(m => topics.add(m));
    64	    const toolMatch = line.match(/memory_\w+|code_graph_\w+|task_\w+/g);
    65	    if (toolMatch) toolMatch.forEach(m => topics.add(m));
    66	  }
    67	  return [...topics].slice(0, 10);
    68	}
    69	
    70	function stripRecoveredCompactLines(lines: string[]): string[] {
    71	  return lines.filter((line) => !COMPACT_FEEDBACK_GUARDS.some((guard) => guard.test(line)));
    72	}
    73	
    74	/** Extract most-referenced identifiers from transcript lines (top 10 by frequency) */
    75	function extractAttentionSignals(lines: string[]): string[] {
    76	  const freq = new Map<string, number>();
    77	  // camelCase function calls: e.g. buildMergedContext(
    78	  const funcRe = /\b([a-z][a-zA-Z0-9]{2,})\s*\(/g;
    79	  // PascalCase class/interface names: e.g. MergeInput, OutputSection
    80	  const classRe = /\b([A-Z][a-zA-Z0-9]{2,})\b/g;
    81	  // Common noise words to skip
    82	  const noise = new Set(['Error', 'String', 'Object', 'Array', 'Promise', 'Buffer', 'Date', 'Map', 'Set', 'Number', 'Boolean', 'Function', 'RegExp', 'JSON', 'Math', 'console', 'process', 'undefined', 'null']);
    83	  for (const line of lines) {
    84	    let m: RegExpExecArray | null;
    85	    funcRe.lastIndex = 0;
    86	    while ((m = funcRe.exec(line)) !== null) {
    87	      const id = m[1];
    88	      if (!noise.has(id) && id.length <= 60) {
    89	        freq.set(id, (freq.get(id) ?? 0) + 1);
    90	      }
    91	    }
    92	    classRe.lastIndex = 0;
    93	    while ((m = classRe.exec(line)) !== null) {
    94	      const id = m[1];
    95	      if (!noise.has(id) && id.length <= 60) {
    96	        freq.set(id, (freq.get(id) ?? 0) + 1);
    97	      }
    98	    }
    99	  }
   100	  return [...freq.entries()]
   101	    .filter(([, count]) => count >= 2)
   102	    .sort((a, b) => b[1] - a[1])
   103	    .slice(0, 10)
   104	    .map(([id, count]) => `- ${id} (referenced ${count}x)`);
   105	}
   106	
   107	/** Detect active spec folder paths from transcript lines */
   108	function detectSpecFolder(lines: string[]): string | null {
   109	  const specFolderRe = /\.opencode\/specs\/[\w/-]+/g;
   110	  const freq = new Map<string, number>();
   111	  for (const line of lines) {
   112	    const matches = line.match(specFolderRe);
   113	    if (matches) {
   114	      for (const m of matches) {
   115	        // Normalize to folder (strip trailing file component if present)
   116	        const folder = m.replace(/\/[^/]+\.\w+$/, '');
   117	        freq.set(folder, (freq.get(folder) ?? 0) + 1);
   118	      }
   119	    }
   120	  }
   121	  if (freq.size === 0) return null;
   122	  // Return the most-referenced spec folder
   123	  return [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0];
   124	}
   125	
   126	/** Build compact context from transcript analysis (legacy fallback) */
   127	function buildCompactContext(transcriptLines: string[]): string {
   128	  const filePaths = extractFilePaths(transcriptLines);
   129	  const topics = extractTopics(transcriptLines);
   130	  const sections: string[] = [];
   131	
   132	  if (filePaths.length > 0) {
   133	    sections.push('## Active Files\n' + filePaths.map(p => `- ${p}`).join('\n'));
   134	  }
   135	  if (topics.length > 0) {
   136	    sections.push('## Recent Topics\n' + topics.map(t => `- ${t}`).join('\n'));
   137	  }
   138	
   139	  const meaningfulLines = transcriptLines
   140	    .filter(l => l.trim().length > 10 && !l.startsWith('{'))
   141	    .slice(-5);
   142	  if (meaningfulLines.length > 0) {
   143	    sections.push('## Recent Context\n' + meaningfulLines.join('\n'));
   144	  }
   145	
   146	  // Hint for AI to use CocoIndex for semantic neighbors after recovery
   147	  if (filePaths.length > 0) {
   148	    sections.push('## Semantic Context (CocoIndex)\nUse `mcp__cocoindex_code__search` to find semantic neighbors of active files listed above.');
   149	  }
   150	
   151	  return sections.join('\n\n');
   152	}
   153	
   154	type AutoSurfaceAtCompactionResult = Awaited<ReturnType<typeof autoSurfaceAtCompaction>>;
   155	
   156	function renderConstitutionalMemories(
   157	  autoSurfaced: AutoSurfaceAtCompactionResult,
   158	): string {
   159	  const constitutional = autoSurfaced?.constitutional ?? [];
   160	  if (constitutional.length === 0) {
   161	    return '';
   162	  }
   163	
   164	  const lines = constitutional.map((memory) => {
   165	    const details: string[] = [`- ${memory.title}`];
   166	
   167	    if (memory.retrieval_directive) {
   168	      details.push(`  ${memory.retrieval_directive}`);
   169	    }
   170	
   171	    const provenance = [memory.specFolder, memory.filePath].filter(Boolean).join(' | ');
   172	    if (provenance) {
   173	      details.push(`  ${provenance}`);
   174	    }
   175	
   176	    return details.join('\n');
   177	  });
   178	
   179	  return `## Constitutional Rules\n${lines.join('\n')}`;
   180	}
   181	
   182	function renderTriggeredMemories(
   183	  autoSurfaced: AutoSurfaceAtCompactionResult,
   184	): string {
   185	  const triggered = autoSurfaced?.triggered ?? [];
   186	  if (triggered.length === 0) {
   187	    return '';
   188	  }
   189	
   190	  const lines = triggered.map((memory) => {
   191	    const matchedPhrases = [...new Set(memory.matched_phrases
   192	      .map((phrase) => phrase.trim())
   193	      .filter((phrase) => phrase.length > 0))];
   194	
   195	    if (matchedPhrases.length === 0) {
   196	      return `- ${memory.title}`;
   197	    }
   198	
   199	    return `- ${memory.title} (matched: ${matchedPhrases.join(', ')})`;
   200	  });
   201	
   202	  return `## Relevant Memories\n${lines.join('\n')}`;
   203	}
   204	
   205	/**
   206	 * Build merged context using the 3-source merge pipeline.
   207	 * Extracts session state from transcript, then delegates budget allocation
   208	 * and section rendering to mergeCompactBrief.
   209	 */
   210	async function buildMergedContext(transcriptLines: string[]): Promise<string> {
   211	  const sanitizedLines = stripRecoveredCompactLines(transcriptLines);
   212	  const filePaths = extractFilePaths(sanitizedLines);
   213	  const topics = extractTopics(sanitizedLines);
   214	
   215	  // Build codeGraph input: active files + structural hints
   216	  const codeGraphParts: string[] = [];
   217	  if (filePaths.length > 0) {
   218	    codeGraphParts.push('Active files:\n' + filePaths.map(p => `- ${p}`).join('\n'));
   219	  }
   220	  const codeGraph = codeGraphParts.join('\n\n');

exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: OpenCode Transport Adapter
// ───────────────────────────────────────────────────────────────
// Phase 030 / Phase 2: transport-only mapping from shared payload
// contracts to OpenCode-oriented startup, message, and compaction blocks.

import type { SharedPayloadEnvelope, SharedPayloadSection } from './shared-payload.js';

/** Hook names emitted by the OpenCode transport adapter. */
export type OpenCodeTransportHook =
  | 'event'
  | 'experimental.chat.system.transform'
  | 'experimental.chat.messages.transform'
  | 'experimental.session.compacting';

/** One transport block delivered to an OpenCode runtime hook surface. */
export interface OpenCodeTransportBlock {
  hook: OpenCodeTransportHook;
  title: string;
  payloadKind: SharedPayloadEnvelope['kind'];
  dedupeKey: string;
  content: string;
}

/** Complete transport-only plan derived from shared startup/resume payloads. */
export interface OpenCodeTransportPlan {
  interfaceVersion: '1.0';
  transportOnly: true;
  retrievalPolicyOwner: 'runtime';
  event: {
    hook: 'event';
    trackedPayloadKinds: SharedPayloadEnvelope['kind'][];
    summary: string;
  };
  systemTransform?: OpenCodeTransportBlock;
  messagesTransform: OpenCodeTransportBlock[];
  compaction?: OpenCodeTransportBlock;
}

function isSharedPayloadEnvelope(value: unknown): value is SharedPayloadEnvelope {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const record = value as Record<string, unknown>;
  return typeof record.kind === 'string'
    && typeof record.summary === 'string'
    && Array.isArray(record.sections)
    && !!record.provenance
    && typeof record.provenance === 'object';
}

/** Narrow an unknown runtime payload to the shared transport envelope contract. */
export function coerceSharedPayloadEnvelope(value: unknown): SharedPayloadEnvelope | null {
  return isSharedPayloadEnvelope(value) ? value : null;
}

function renderSections(sections: SharedPayloadSection[], maxSections: number = 2): string {
  return sections
    .slice(0, maxSections)
    .map((section) => `### ${section.title}\n${section.content}`)
    .join('\n\n');
}

function renderBlockContent(payload: SharedPayloadEnvelope, prefix?: string): string {
  const parts = [
    prefix ? `${prefix}\n` : null,
    `Summary: ${payload.summary}`,
    renderSections(payload.sections),
    `Provenance: producer=${payload.provenance.producer}; trustState=${payload.provenance.trustState}; sourceSurface=${payload.provenance.sourceSurface}`,
  ].filter(Boolean);
  return parts.join('\n\n');
}

function appendStartupSnapshotNote(content: string): string {
  return [
    content,
    'Note: this is a startup snapshot; later structural reads may differ if the repo state changed.',
  ].join('\n\n');
}

/** Build the OpenCode runtime hook plan from the shared payload surfaces. */
export function buildOpenCodeTransportPlan(args: {
  bootstrapPayload?: SharedPayloadEnvelope | null;
  startupPayload?: SharedPayloadEnvelope | null;
  resumePayload?: SharedPayloadEnvelope | null;
  healthPayload?: SharedPayloadEnvelope | null;
  compactionPayload?: SharedPayloadEnvelope | null;
  specFolder?: string | null;
}): OpenCodeTransportPlan {
  const trackedPayloadKinds = [
    args.bootstrapPayload?.kind,
    args.startupPayload?.kind,
    args.resumePayload?.kind,
    args.healthPayload?.kind,
    args.compactionPayload?.kind,
  ].filter((kind): kind is SharedPayloadEnvelope['kind'] => !!kind);

  const systemPayload = args.bootstrapPayload ?? args.startupPayload ?? args.resumePayload ?? null;
  const messagePayloads = [args.resumePayload, args.healthPayload].filter(
    (payload): payload is SharedPayloadEnvelope => !!payload,
  );
  const compactionPayload = args.compactionPayload ?? args.resumePayload ?? args.bootstrapPayload ?? null;

  return {
    interfaceVersion: '1.0',
    transportOnly: true,
    retrievalPolicyOwner: 'runtime',
    event: {
      hook: 'event',
      trackedPayloadKinds,
      summary: args.specFolder
        ? `Track OpenCode routing hints for ${args.specFolder}`
        : 'Track OpenCode routing hints for the current packet/runtime state',
    },
    ...(systemPayload
      ? {
        systemTransform: {
          hook: 'experimental.chat.system.transform',
          title: 'OpenCode Startup Digest',
          payloadKind: systemPayload.kind,
          dedupeKey: `system:${systemPayload.kind}`,
          content: appendStartupSnapshotNote(renderBlockContent(
            systemPayload,
            'Inject this as the startup digest for hookless OpenCode recovery. Keep it transport-only.',
          ),
          ),
        },
      }
      : {}),
    messagesTransform: messagePayloads.map((payload, index) => ({
      hook: 'experimental.chat.messages.transform' as const,
      title: index === 0 ? 'OpenCode Retrieved Context' : 'OpenCode Operational Context',
      payloadKind: payload.kind,
      dedupeKey: `messages:${payload.kind}:${index}`,
      content: renderBlockContent(
        payload,
        'Inject this as bounded current-turn context. Do not treat it as retrieval policy.',
      ),
    })),
    ...(compactionPayload
      ? {
        compaction: {
          hook: 'experimental.session.compacting',
          title: 'OpenCode Compaction Resume Note',
          payloadKind: compactionPayload.kind,
          dedupeKey: `compaction:${compactionPayload.kind}`,
          content: renderBlockContent(
            compactionPayload,
            'Inject this as the continuity note across compaction. Keep it separate from current-turn retrieval.',
          ),
        },
      }
      : {}),
  };
}

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts | sed -n '419,560p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '756,778p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   756	
   757	- rollout_summaries/2026-04-02T14-05-56-qyWY-cocoindex_compact_code_graph_readme_section.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T16-05-56-019d4e83-d8f5-7342-833e-98b3e0f731f0.jsonl, updated_at=2026-04-02T14:08:03+00:00, thread_id=019d4e83-d8f5-7342-833e-98b3e0f731f0)
   758	
   759	### keywords
   760	
   761	- CocoIndex + Compact Code Graph, README.md, 024-compact-code-graph, 006-documentation-alignment, mcp__cocoindex_code__search, code_graph_query, prettier --check
   762	
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
   773	## User preferences
   774	
   775	- when the user said “Re-use /.../024-compact-code-graph/006-documentation-alignment,” continue under the specified existing spec folder instead of opening a new packet [Task 4]
   776	- when the user asked for deep review “make sure everything works as expected ... check the feature catalog and manual testing playbook, and all commands, agents and readmes,” treat it as full-spectrum audit + runtime/doc parity, not a narrow fix pass [Task 1][Task 2]
   777	- when user asked to “use max sub agents” for packet changelog synthesis, parallelize phase evidence gathering but keep output scoped to the requested packet `scratch/` folder [Task 6]
   778	- when user asked for README work, they specified “proper dedicated section ... reference 024-compact-code-graph ... re-use 006-documentation-alignment” -> preserve that wording/terminology and include those exact packet references [Task 7]

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '210,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc 'rg -n "memory_update|importanceTier|triggerPhrases|isPinned|pinned" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
292:  name: 'memory_update',
294:  inputSchema: { type: 'object', additionalProperties: false, properties: { id: { type: 'number', minimum: 1, description: 'Memory ID to update' }, title: { type: 'string', description: 'New title' }, triggerPhrases: { type: 'array', items: { type: 'string' }, description: 'Updated trigger phrases' }, importanceWeight: { type: 'number', minimum: 0, maximum: 1, description: 'New importance weight (0-1)' }, importanceTier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Set importance tier. Constitutional tier memories always surface at top of results.' }, allowPartialUpdate: { type: 'boolean', default: false, description: 'Allow update to succeed even if embedding regeneration fails. When true, metadata changes are applied and the embedding is marked for re-index. When false (default), the entire update is rolled back on embedding failure.' } }, required: ['id'] },

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json | sed -n '1,80p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '288,296p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   288	  },
   289	};
   290	
   291	const memoryUpdate: ToolDefinition = {
   292	  name: 'memory_update',
   293	  description: '[L4:Mutation] Update an existing memory with corrections. Re-generates embedding if content changes. Token Budget: 500.',
   294	  inputSchema: { type: 'object', additionalProperties: false, properties: { id: { type: 'number', minimum: 1, description: 'Memory ID to update' }, title: { type: 'string', description: 'New title' }, triggerPhrases: { type: 'array', items: { type: 'string' }, description: 'Updated trigger phrases' }, importanceWeight: { type: 'number', minimum: 0, maximum: 1, description: 'New importance weight (0-1)' }, importanceTier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Set importance tier. Constitutional tier memories always surface at top of results.' }, allowPartialUpdate: { type: 'boolean', default: false, description: 'Allow update to succeed even if embedding regeneration fails. When true, metadata changes are applied and the embedding is marked for re-index. When false (default), the entire update is rolled back on embedding failure.' } }, required: ['id'] },
   295	};
   296	

codex
# Iteration 012: GAP ANALYSIS - REFACTORS

## Focus
GAP ANALYSIS - REFACTORS: Should we refactor or change direction on any existing features? Architecture changes?

## Findings
### Finding 1: Refactor compaction guidance into the existing shared transport pipeline instead of adding a second Mnemosyne-style memory hook
- **Source**: [external/src/index.ts:208](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L208), [external/src/index.ts:210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [memory-surface.ts:623](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L623), [memory-surface.ts:656](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L656), [compact-inject.ts:5](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts#L5), [compact-inject.ts:19](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts#L19), [opencode-transport.ts:76](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L76), [opencode-transport.ts:132](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L132), [spec-kit-compact-code-graph.js:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396)
- **What it does**: Wrapper-confirmed on Mnemosyne: compaction always injects a static memory-tool usage card. Public already has compaction-specific memory surfacing and transport injection, but its OpenCode compaction block is generic continuity payload text rather than explicit memory-tool instructions.
- **Why it matters for us**: The gap is not missing compaction infrastructure; it is split messaging. The right change is to enrich the existing shared compaction payload with concise memory actions and routing cues, not bolt on a parallel plugin-local instruction block.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Reframe “memory warmup/doctor” as a refactor over existing readiness primitives, not a net-new subsystem
- **Source**: [external/README.md:7](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L7), [external/README.md:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L18), [external/src/index.ts:67](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L67), [memory-search.ts:764](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L764), [context-server.ts:1238](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1238), [context-server.ts:1580](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1580), [memory-crud-health.ts:380](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L380), [memory-crud-health.ts:445](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L445), [cli.ts:442](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts#L442), [cli.ts:457](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts#L457), [db-state.ts:558](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts#L558)
- **What it does**: Both: Mnemosyne exposes prerequisite friction plainly. Public already has `waitForEmbeddingModel`, degraded `memory_health`, startup-scan gating, and a CLI `--eager-warmup` path, but those behaviors are scattered and partially hidden behind lazy-init semantics.
- **Why it matters for us**: Earlier “new feature” thinking is too big. Public should consolidate these existing pieces into a single deterministic readiness surface that runs health, warmup, and optional scan in one place.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: If we add scoped memory ergonomics, implement them as aliases over governed scope metadata, not as separate project/global stores
- **Source**: [external/src/index.ts:27](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L27), [external/src/index.ts:29](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L29), [external/src/index.ts:81](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L81), [external/src/index.ts:118](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L118), [external/README.md:51](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L51), [scope-governance.ts:158](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L158), [scope-governance.ts:201](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L201), [memory-search.ts:529](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L529), [memory-search.ts:812](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L812), [memory-surface.ts:481](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L481)
- **What it does**: Wrapper-confirmed on Mnemosyne: “project” is a directory-basename collection and “global” is a separate collection. Public already centers one governed store with normalized tenant/user/agent/shared-space scope, while `retrievalLevel: "global"` means community fallback, not personal-memory scope.
- **Why it matters for us**: Copying Mnemosyne’s two-store topology would fight Public’s governance model and risks namespace collisions. The correct direction is a thin UX facade like `scope: "project|personal|shared"` that compiles into current scope metadata.
- **Recommendation**: prototype later
- **Impact**: high

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


hook: Stop
hook: Stop Completed
tokens used
173,856
# Iteration 012: GAP ANALYSIS - REFACTORS

## Focus
GAP ANALYSIS - REFACTORS: Should we refactor or change direction on any existing features? Architecture changes?

## Findings
### Finding 1: Refactor compaction guidance into the existing shared transport pipeline instead of adding a second Mnemosyne-style memory hook
- **Source**: [external/src/index.ts:208](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L208), [external/src/index.ts:210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [memory-surface.ts:623](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L623), [memory-surface.ts:656](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L656), [compact-inject.ts:5](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts#L5), [compact-inject.ts:19](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts#L19), [opencode-transport.ts:76](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L76), [opencode-transport.ts:132](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L132), [spec-kit-compact-code-graph.js:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396)
- **What it does**: Wrapper-confirmed on Mnemosyne: compaction always injects a static memory-tool usage card. Public already has compaction-specific memory surfacing and transport injection, but its OpenCode compaction block is generic continuity payload text rather than explicit memory-tool instructions.
- **Why it matters for us**: The gap is not missing compaction infrastructure; it is split messaging. The right change is to enrich the existing shared compaction payload with concise memory actions and routing cues, not bolt on a parallel plugin-local instruction block.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Reframe “memory warmup/doctor” as a refactor over existing readiness primitives, not a net-new subsystem
- **Source**: [external/README.md:7](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L7), [external/README.md:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L18), [external/src/index.ts:67](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L67), [memory-search.ts:764](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L764), [context-server.ts:1238](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1238), [context-server.ts:1580](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1580), [memory-crud-health.ts:380](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L380), [memory-crud-health.ts:445](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L445), [cli.ts:442](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts#L442), [cli.ts:457](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts#L457), [db-state.ts:558](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts#L558)
- **What it does**: Both: Mnemosyne exposes prerequisite friction plainly. Public already has `waitForEmbeddingModel`, degraded `memory_health`, startup-scan gating, and a CLI `--eager-warmup` path, but those behaviors are scattered and partially hidden behind lazy-init semantics.
- **Why it matters for us**: Earlier “new feature” thinking is too big. Public should consolidate these existing pieces into a single deterministic readiness surface that runs health, warmup, and optional scan in one place.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: If we add scoped memory ergonomics, implement them as aliases over governed scope metadata, not as separate project/global stores
- **Source**: [external/src/index.ts:27](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L27), [external/src/index.ts:29](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L29), [external/src/index.ts:81](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L81), [external/src/index.ts:118](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L118), [external/README.md:51](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L51), [scope-governance.ts:158](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L158), [scope-governance.ts:201](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L201), [memory-search.ts:529](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L529), [memory-search.ts:812](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L812), [memory-surface.ts:481](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L481)
- **What it does**: Wrapper-confirmed on Mnemosyne: “project” is a directory-basename collection and “global” is a separate collection. Public already centers one governed store with normalized tenant/user/agent/shared-space scope, while `retrievalLevel: "global"` means community fallback, not personal-memory scope.
- **Why it matters for us**: Copying Mnemosyne’s two-store topology would fight Public’s governance model and risks namespace collisions. The correct direction is a thin UX facade like `scope: "project|personal|shared"` that compiles into current scope metadata.
- **Recommendation**: prototype later
- **Impact**: high

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
