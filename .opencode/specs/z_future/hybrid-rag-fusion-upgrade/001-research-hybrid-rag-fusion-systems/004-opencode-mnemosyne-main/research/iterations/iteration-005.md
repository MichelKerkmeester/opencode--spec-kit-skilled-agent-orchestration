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
# Iteration 005: SEARCH MECHANISMS

## Focus
SEARCH MECHANISMS: FTS, vector, hybrid, ranking algorithms. Query processing, shortcuts, relevance scoring.

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
I’m treating this as a read-only deep-research pass focused on Mnemosyne’s search mechanisms and how they compare with Public’s existing hybrid retrieval stack. I’ll start by loading the relevant memory/context pointers and then read the wrapper source in the order you specified: `src/index.ts`, `package.json`, tool paths, compaction hook, then Public comparison files.
exec
/bin/zsh -lc 'rg -n "mnemosyne|hybrid-rag-fusion|opencode-mnemosyne|search mechanisms|ranking|RRF|BM25|vector" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
369:- when asked to fold the extension into active v2 synthesis "without changing the overall verdict or top-10 ordering," integrate new evidence/counts without re-ranking master recommendations [Task 2]
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1306:- user accepted deterministic ranking/filtering and targeted changelog repairs only where evidence showed omissions [Task 1]
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1580:## Task 1: Governed retrieval/shared-space admin hardening and graph ranking fix
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
1802:- sk-code--opencode, TSDoc, BUG-###/REQ-###/CHK-### references, adaptive-ranking, shared-memory handlers, npx tsc --noEmit
1918:- `memory_health` cleanup runbook: back up DB first, clean temp-path rows/vector orphans transactionally, then re-run integrity checks and report post-clean stats [Task 2]
1926:- symptom: `npm run check:full` fails on unrelated shared RRF test (`C138-CV13`); cause: external dirty-worktree failure; fix: report as pre-existing and rely on targeted suites + `tsc` for in-scope remediation [Task 2]
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
I’ve confirmed the deep-research workflow guidance and found only older packet-level memory references, not a reusable Mnemosyne-specific prior analysis, so I’m going straight to the source code now. Next I’m tracing the external wrapper and Public’s retrieval pipeline side by side so we can separate wrapper-proven behavior from README-only claims.
exec
/bin/zsh -lc 'find .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external -maxdepth 3 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/.github/workflows/npm-publish.yml
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/.gitignore
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/LICENSE
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package-lock.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/tsconfig.json

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
/bin/zsh -lc 'nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1658ms:

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
The wrapper is exactly as thin as the brief suggested: one TypeScript entrypoint, one Bun CLI bridge, and all retrieval/ranking sophistication pushed behind the `mnemosyne` binary. I’m reading the README and Public’s search-pipeline stages next to pin down where Mnemosyne has real search-mechanism novelty versus just better agent ergonomics.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Stage1 Candidate Gen
     3	// ───────────────────────────────────────────────────────────────
     4	// 4-stage retrieval pipeline architecture
     5	//
     6	// Responsibility: Execute search channels and collect raw candidate results.
     7	// This stage avoids downstream fusion/reranking, but may apply temporal
     8	// Contiguity to raw vector-channel hits before later pipeline stages.
     9	// Results are collected from the appropriate search channel based on search type.
    10	//
    11	// Search channels handled:
    12	//   - multi-concept: Generate per-concept embeddings, run multiConceptSearch
    13	//   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
    14	//   - hybrid (R12):       Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION)
    15	// Suppressed when R15 classifies query as "simple" (mutual exclusion)
    16	//   - hybrid: collectRawCandidates → falls back to vector on failure
    17	//   - vector: Direct vectorSearch
    18	//
    19	// Post-channel operations:
    20	//   - Constitutional memory injection (if not already present)
    21	//   - Quality score filtering
    22	//   - Tier and contextType filtering
    23	//
    24	// I/O CONTRACT:
    25	// Input:  Stage1Input { config: PipelineConfig }
    26	// Output: Stage1Output { candidates: PipelineRow[], metadata }
    27	// Key invariants:
    28	//     - candidates contains raw channel scores; vector hits may include an
    29	//       optional temporal-contiguity boost applied before downstream fusion
    30	//     - Constitutional rows are always present when includeConstitutional=true and no tier filter
    31	//     - All rows pass qualityThreshold (if set) and tier/contextType filters
    32	// Side effects:
    33	//     - Generates query embeddings via the embeddings provider (external call)
    34	//     - Reads from the vector index and FTS5 / BM25 index (DB reads only)
    35	//
    36	import type { Stage1Input, Stage1Output, PipelineRow } from './types.js';
    37	import { resolveEffectiveScore } from './types.js';
    38	import * as vectorIndex from '../vector-index.js';
    39	import * as embeddings from '../../providers/embeddings.js';
    40	import * as hybridSearch from '../hybrid-search.js';
    41	import { vectorSearchWithContiguity } from '../../cognitive/temporal-contiguity.js';
    42	import { isMultiQueryEnabled, isEmbeddingExpansionEnabled, isMemorySummariesEnabled, isQueryDecompositionEnabled, isGraphConceptRoutingEnabled, isLlmReformulationEnabled, isHyDEEnabled, isQuerySurrogatesEnabled, isTemporalContiguityEnabled, isQueryConceptExpansionEnabled } from '../search-flags.js';
    43	import { expandQuery } from '../query-expander.js';
    44	import { expandQueryWithEmbeddings, isExpansionActive } from '../embedding-expansion.js';
    45	import { querySummaryEmbeddings, checkScaleGate } from '../memory-summaries.js';
    46	import { addTraceEntry } from '@spec-kit/shared/contracts/retrieval-trace';
    47	import { requireDb } from '../../../utils/db-helpers.js';
    48	import { filterRowsByScope, isScopeEnforcementEnabled } from '../../governance/scope-governance.js';
    49	import { getAllowedSharedSpaceIds } from '../../collab/shared-spaces.js';
    50	import { withTimeout } from '../../errors/core.js';
    51	import { computeBackfillQualityScore } from '../../validation/save-quality-gate.js';
    52	import {
    53	  isMultiFacet,
    54	  decompose,
    55	  mergeByFacetCoverage as mergeFacetCoveragePools,
    56	  MAX_FACETS,
    57	} from '../query-decomposer.js';
    58	import { routeQueryConcepts, nounPhrases, getConceptExpansionTerms } from '../entity-linker.js';
    59	import { cheapSeedRetrieve, llm, fanout } from '../llm-reformulation.js';
    60	import { runHyDE } from '../hyde.js';
    61	import { matchSurrogates } from '../query-surrogates.js';
    62	import { loadSurrogatesBatch } from '../surrogate-storage.js';
    63	
    64	// Feature catalog: 4-stage pipeline architecture
    65	// Feature catalog: Hybrid search pipeline
    66	
    67	
    68	// -- Constants --
    69	
    70	/** Maximum number of deep-mode query variants to generate (original + expanded). */
    71	const MAX_DEEP_QUERY_VARIANTS = 3;
    72	
    73	/** F1: Deep-mode expansion timeout — fall back to base query if variants take too long. */
    74	const DEEP_EXPANSION_TIMEOUT_MS = 5000;
    75	
    76	/** Minimum cosine similarity for multi-concept search. */
    77	const MULTI_CONCEPT_MIN_SIMILARITY = 0.5;
    78	
    79	/** Number of constitutional results to fetch when none appear in hybrid/vector results. */
    80	const CONSTITUTIONAL_INJECT_LIMIT = 5;
    81	
    82	/** Number of similar memories to mine for R12 embedding-based query expansion terms. */
    83	const DEFAULT_EXPANSION_CANDIDATE_LIMIT = 5;
    84	
    85	/** D2: Timeout for facet decomposition parallel searches (ms). */
    86	const DECOMPOSITION_TIMEOUT_MS = 5000;
    87	const MAX_QUERY_DECOMPOSITION_FACETS = MAX_FACETS;
    88	
    89	// -- Helper Functions --
    90	
    91	/**
    92	 * Filter results by a minimum quality score threshold.
    93	 *
    94	 * - If no threshold is provided or it is not a finite number, all results pass.
    95	 * - Threshold is clamped to [0, 1].
    96	 * - Rows with a missing or non-finite `quality_score` are treated as 0.
    97	 *
    98	 * @param results - Candidate rows to filter.
    99	 * @param threshold - Minimum quality score in [0, 1] (inclusive).
   100	 * @returns Filtered array; original array returned unchanged when no threshold applies.
   101	 */
   102	function filterByMinQualityScore(
   103	  results: PipelineRow[],
   104	  threshold?: number
   105	): PipelineRow[] {
   106	  if (typeof threshold !== 'number' || !Number.isFinite(threshold)) {
   107	    return results;
   108	  }
   109	
   110	  const clampedThreshold = Math.max(0, Math.min(1, threshold));
   111	
   112	  return results.filter((row) => {
   113	    const rawScore = row.quality_score as number | undefined;
   114	    const score =
   115	      typeof rawScore === 'number' && Number.isFinite(rawScore) ? rawScore : 0;
   116	    return score >= clampedThreshold;
   117	  });
   118	}
   119	
   120	function backfillMissingQualityScores(results: PipelineRow[]): PipelineRow[] {
   121	  return results.map((row) => {
   122	    if (row.quality_score !== 0 && row.quality_score != null) {
   123	      return row;
   124	    }
   125	
   126	    return {
   127	      ...row,
   128	      quality_score: computeBackfillQualityScore(row),
   129	    };
   130	  });
   131	}
   132	
   133	function applyArchiveFilter(
   134	  results: PipelineRow[],
   135	  includeArchived: boolean
   136	): PipelineRow[] {
   137	  if (includeArchived) return results;
   138	  return results.filter((row) => {
   139	    const archived = row.is_archived ?? row.isArchived;
   140	    if (archived == null) return true;
   141	    if (typeof archived === 'number') return archived === 0;
   142	    if (typeof archived === 'boolean') return archived === false;
   143	    return true;
   144	  });
   145	}
   146	
   147	function applyFolderFilter(
   148	  results: PipelineRow[],
   149	  specFolder?: string
   150	): PipelineRow[] {
   151	  if (!specFolder) return results;
   152	  return results.filter((row) => {
   153	    const rowSpecFolder = row.spec_folder ?? row.specFolder;
   154	    return rowSpecFolder === specFolder;
   155	  });
   156	}
   157	
   158	function applyTierFilter(
   159	  results: PipelineRow[],
   160	  tier?: string
   161	): PipelineRow[] {
   162	  if (!tier) return results;
   163	  return results.filter((row) => row.importance_tier === tier);
   164	}
   165	
   166	/**
   167	 * Resolve the effective context type from a pipeline row.
   168	 *
   169	 * Rows may carry context type under either `contextType` (camelCase) or
   170	 * `context_type` (snake_case). This function normalises the lookup.
   171	 *
   172	 * @param row - The pipeline row to inspect.
   173	 * @returns The context type string, or `undefined` if absent.
   174	 */
   175	function resolveRowContextType(row: PipelineRow): string | undefined {
   176	  if (typeof row.contextType === 'string' && row.contextType.length > 0) {
   177	    return row.contextType;
   178	  }
   179	  if (typeof row.context_type === 'string' && row.context_type.length > 0) {
   180	    return row.context_type;
   181	  }
   182	  return undefined;
   183	}
   184	
   185	function mergeStringLists(...values: unknown[]): string[] {
   186	  const merged = new Set<string>();
   187	  for (const value of values) {
   188	    if (!Array.isArray(value)) {
   189	      continue;
   190	    }
   191	    for (const entry of value) {
   192	      if (typeof entry === 'string' && entry.length > 0) {
   193	        merged.add(entry);
   194	      }
   195	    }
   196	  }
   197	  return Array.from(merged);
   198	}
   199	
   200	function readFiniteScoreMap(value: unknown): Record<string, number> {
   201	  if (!value || typeof value !== 'object' || Array.isArray(value)) {
   202	    return {};
   203	  }
   204	
   205	  const normalized: Record<string, number> = {};
   206	  for (const [key, score] of Object.entries(value as Record<string, unknown>)) {
   207	    if (typeof score === 'number' && Number.isFinite(score)) {
   208	      normalized[key] = score;
   209	    }
   210	  }
   211	  return normalized;
   212	}
   213	
   214	function mergeScoreMaps(...maps: Array<Record<string, number>>): Record<string, number> {
   215	  const merged: Record<string, number> = {};
   216	  for (const map of maps) {
   217	    for (const [key, score] of Object.entries(map)) {
   218	      if (!(key in merged) || score > merged[key]!) {
   219	        merged[key] = score;
   220	      }
   221	    }
   222	  }
   223	  return merged;
   224	}
   225	
   226	function getCandidateSources(row: PipelineRow): string[] {
   227	  const explicitSources = mergeStringLists(row.sources);
   228	  if (explicitSources.length > 0) {
   229	    return explicitSources;
   230	  }
   231	  return typeof row.source === 'string' && row.source.length > 0 ? [row.source] : [];
   232	}
   233	
   234	function getCandidateSourceScores(row: PipelineRow): Record<string, number> {
   235	  const sourceScores = readFiniteScoreMap(row.sourceScores);
   236	  if (Object.keys(sourceScores).length > 0) {
   237	    return sourceScores;
   238	  }
   239	
   240	  const resolvedScore = resolveEffectiveScore(row);
   241	  if (resolvedScore <= 0) {
   242	    return {};
   243	  }
   244	
   245	  const fallbackScores: Record<string, number> = {};
   246	  for (const source of getCandidateSources(row)) {
   247	    fallbackScores[source] = resolvedScore;
   248	  }
   249	  return fallbackScores;
   250	}
   251	
   252	function annotateBranchScore(row: PipelineRow, branchLabel: string): Record<string, number> {
   253	  const existingBranchScores = readFiniteScoreMap(row.stage1BranchScores);
   254	  const effectiveScore = resolveEffectiveScore(row);
   255	  if (branchLabel.length === 0 || !Number.isFinite(effectiveScore)) {
   256	    return existingBranchScores;
   257	  }
   258	  return mergeScoreMaps(existingBranchScores, { [branchLabel]: effectiveScore });
   259	}
   260	

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Stage2 Fusion
     3	// ───────────────────────────────────────────────────────────────
     4	// the rollout (R6): 4-Stage Retrieval Pipeline
     5	//
     6	// I/O CONTRACT:
     7	// Input:  Stage2Input { candidates: PipelineRow[], config, stage1Metadata }
     8	// Output: Stage2Output { scored: PipelineRow[], metadata }
     9	// Key invariants:
    10	//     - Every score modification in the pipeline happens exactly once here
    11	//     - Intent weights are NEVER applied to hybrid results (G2 double-weighting guard)
    12	//     - scored is sorted descending by effective composite score on exit
    13	// Side effects:
    14	//     - FSRS write-back to memory_index (when trackAccess=true) — DB write
    15	//     - Learned trigger and negative-feedback reads from DB
    16	//
    17	// PURPOSE: Single point for ALL scoring signals. Intent weights are
    18	// Applied ONCE here only — this is the architectural guard against
    19	// The G2 double-weighting recurrence bug.
    20	//
    21	// SIGNAL APPLICATION ORDER (must not be reordered — 13 steps):
    22	// 1.  Session boost           — working-memory attention amplification
    23	// 1a. Recency fusion          — time-decay bonus for recent memories
    24	// 2.  Causal boost            — graph-traversal neighbor amplification
    25	// 2a. Co-activation spreading — spreading activation from top-N seeds
    26	// 2b. Community co-retrieval  — N2c inject community co-members
    27	// 2c. Graph signals           — N2a momentum + N2b causal depth
    28	// 3.  Testing effect          — FSRS strengthening write-back (trackAccess)
    29	// 4.  Intent weights          — non-hybrid search post-scoring adjustment
    30	// 5.  Artifact routing        — class-based weight boosts
    31	// 6.  Feedback signals        — learned trigger boosts + negative demotions
    32	// 7.  Artifact limiting       — result count cap from routing strategy
    33	// 8.  Anchor metadata         — extract named ANCHOR sections (annotation)
    34	// 9.  Validation metadata     — spec quality signals enrichment + quality scoring
    35	//
    36	// Hybrid search already applies intent-aware scoring
    37	// Internally (RRF / RSF fusion). Post-search intent weighting is
    38	// Therefore ONLY applied for non-hybrid search types (vector,
    39	// Multi-concept). Applying it to hybrid results would double-count.
    40	//
    41	// SCORE AUDIT CONTRACT: Stage 2 writes the fused `score` field (steps 1-7).
    42	// Stage 3 (rerank) MAY overwrite `score` with the reranked value and MUST
    43	// preserve the original in `stage2Score` for auditability (see F2.02 fix).
    44	// Stage 4 (filter) MUST NOT mutate any score fields — it is read-only.
    45	// The canonical reranker output is `rerankerScore`; `score` is synced to it
    46	// for downstream consumer compatibility.
    47	
    48	import type Database from 'better-sqlite3';
    49	import path from 'path';
    50	import { readFile } from 'fs/promises';
    51	
    52	import { resolveEffectiveScore } from './types.js';
    53	import type { Stage2Input, Stage2Output, PipelineRow, IntentWeightsConfig, ArtifactRoutingConfig } from './types.js';
    54	
    55	import * as sessionBoost from '../session-boost.js';
    56	import * as causalBoost from '../causal-boost.js';
    57	import {
    58	  isEnabled as isCoActivationEnabled,
    59	  spreadActivation,
    60	  getRelatedMemoryCounts,
    61	  resolveCoActivationBoostFactor,
    62	} from '../../cognitive/co-activation.js';
    63	import type { SpreadResult } from '../../cognitive/co-activation.js';
    64	import { ensureAdaptiveTables, getAdaptiveMode } from '../../cognitive/adaptive-ranking.js';
    65	import * as fsrsScheduler from '../../cognitive/fsrs-scheduler.js';
    66	import { queryLearnedTriggers } from '../learned-feedback.js';
    67	import { applyNegativeFeedback, getNegativeFeedbackStats } from '../../scoring/negative-feedback.js';
    68	import {
    69	  isNegativeFeedbackEnabled,
    70	  isCommunityDetectionEnabled,
    71	  isGraphCalibrationProfileEnabled,
    72	  isGraphSignalsEnabled,
    73	  isUsageRankingEnabled,
    74	  resolveGraphWalkRolloutState,
    75	  isLearnedStage2CombinerEnabled,
    76	  isResultProvenanceEnabled,
    77	} from '../search-flags.js';
    78	import { applyCalibrationProfile } from '../graph-calibration.js';
    79	import { shadowScore, extractFeatureVector, loadModel } from '@spec-kit/shared/ranking/learned-combiner';
    80	import type { LearnedModel } from '@spec-kit/shared/ranking/learned-combiner';
    81	import { addTraceEntry } from '@spec-kit/shared/contracts/retrieval-trace';
    82	import { requireDb } from '../../../utils/db-helpers.js';
    83	import { computeRecencyScore } from '../../scoring/folder-scoring.js';
    84	import { enrichResultsWithAnchorMetadata } from '../anchor-metadata.js';
    85	import { enrichResultsWithValidationMetadata } from '../validation-metadata.js';
    86	// B4: Stage 2b enrichment extracted for decomposition clarity
    87	import { executeStage2bEnrichment } from './stage2b-enrichment.js';
    88	import { applyCommunityBoost } from '../../graph/community-detection.js';
    89	import { applyGraphSignals } from '../../graph/graph-signals.js';
    90	import { computeUsageBoost } from '../../graph/usage-ranking-signal.js';
    91	import { ensureUsageColumn } from '../../graph/usage-tracking.js';
    92	import { isGraphUnifiedEnabled } from '../graph-flags.js';
    93	import { sortDeterministicRows } from './ranking-contract.js';
    94	
    95	// Feature catalog: 4-stage pipeline architecture
    96	// Feature catalog: MPAB chunk-to-memory aggregation
    97	
    98	
    99	// -- Internal type aliases --
   100	
   101	/** A row with a resolved numeric base score for internal use. */
   102	interface ScoredRow extends PipelineRow {
   103	  intentAdjustedScore?: number;
   104	}
   105	
   106	/** Result of the strengthenOnAccess FSRS write-back. */
   107	interface StrengthenResult {
   108	  stability: number;
   109	  difficulty: number;
   110	}
   111	
   112	interface ValidationMetadataLike {
   113	  qualityScore?: number;
   114	  specLevel?: number;
   115	  completionStatus?: 'complete' | 'partial' | 'unknown';
   116	  hasChecklist?: boolean;
   117	}
   118	
   119	// -- Constants --
   120	
   121	/** Number of top results used as seeds for co-activation spreading. */
   122	const SPREAD_ACTIVATION_TOP_N = 5;
   123	const DEFAULT_LEARNED_STAGE2_MODEL_RELATIVE_PATH = path.join('models', 'learned-stage2-combiner.json');
   124	
   125	/** Recency fusion weight — controls how much recency score contributes to the fused score.
   126	 *  Env-tunable via SPECKIT_RECENCY_FUSION_WEIGHT (default 0.07). */
   127	const RECENCY_FUSION_WEIGHT = parseFloat(process.env.SPECKIT_RECENCY_FUSION_WEIGHT || '') || 0.07;
   128	
   129	/** Recency fusion cap — maximum bonus a candidate can receive from recency fusion.
   130	 *  Env-tunable via SPECKIT_RECENCY_FUSION_CAP (default 0.10). */
   131	const RECENCY_FUSION_CAP = parseFloat(process.env.SPECKIT_RECENCY_FUSION_CAP || '') || 0.10;
   132	
   133	const MIN_VALIDATION_MULTIPLIER = 0.8;
   134	const MAX_VALIDATION_MULTIPLIER = 1.2;
   135	
   136	type LearnedStage2ModelCacheEntry = {
   137	  path: string;
   138	  model: LearnedModel | null;
   139	};
   140	
   141	let cachedLearnedStage2Model: LearnedStage2ModelCacheEntry | null = null;
   142	let learnedStage2ModelLoadPromise: Promise<LearnedStage2ModelCacheEntry> | null = null;
   143	let learnedStage2ModelLoadPromisePath: string | null = null;
   144	
   145	function clampMultiplier(value: number): number {
   146	  if (!Number.isFinite(value)) return 1;
   147	  if (value < MIN_VALIDATION_MULTIPLIER) return MIN_VALIDATION_MULTIPLIER;
   148	  if (value > MAX_VALIDATION_MULTIPLIER) return MAX_VALIDATION_MULTIPLIER;
   149	  return value;
   150	}
   151	
   152	function isShadowLearningModelLoadEnabled(): boolean {
   153	  return process.env.SPECKIT_SHADOW_LEARNING?.toLowerCase().trim() === 'true';
   154	}
   155	
   156	function resolveLearnedStage2ModelPath(): string {
   157	  const configured = process.env.SPECKIT_LEARNED_STAGE2_MODEL?.trim();
   158	  if (!configured) {
   159	    return path.resolve(process.cwd(), DEFAULT_LEARNED_STAGE2_MODEL_RELATIVE_PATH);
   160	  }
   161	  if (path.isAbsolute(configured)) {
   162	    return configured;
   163	  }
   164	  return path.resolve(process.cwd(), configured);
   165	}
   166	
   167	async function loadPersistedLearnedStage2Model(): Promise<LearnedModel | null> {
   168	  if (!isShadowLearningModelLoadEnabled()) {
   169	    return null;
   170	  }
   171	
   172	  const modelPath = resolveLearnedStage2ModelPath();
   173	  if (cachedLearnedStage2Model?.path === modelPath) {
   174	    return cachedLearnedStage2Model.model;
   175	  }
   176	
   177	  if (learnedStage2ModelLoadPromise && learnedStage2ModelLoadPromisePath === modelPath) {
   178	    return (await learnedStage2ModelLoadPromise).model;
   179	  }
   180	
   181	  if (learnedStage2ModelLoadPromisePath !== modelPath) {
   182	    learnedStage2ModelLoadPromise = null;
   183	    learnedStage2ModelLoadPromisePath = null;
   184	  }
   185	
   186	  learnedStage2ModelLoadPromisePath = modelPath;
   187	  learnedStage2ModelLoadPromise = (async (): Promise<LearnedStage2ModelCacheEntry> => {
   188	    try {
   189	      const json = await readFile(modelPath, 'utf8');
   190	      const model = loadModel(json);
   191	      if (!model) {
   192	        console.warn(`[stage2-fusion] learned stage2 model at ${modelPath} is invalid; shadow scoring will use manual-only fallback`);
   193	      }
   194	      const entry = { path: modelPath, model };
   195	      cachedLearnedStage2Model = entry;
   196	      return entry;
   197	    } catch (err: unknown) {
   198	      const entry = { path: modelPath, model: null };
   199	      cachedLearnedStage2Model = entry;
   200	
   201	      const code = typeof err === 'object' && err !== null && 'code' in err
   202	        ? String((err as { code?: unknown }).code)
   203	        : '';
   204	      if (code !== 'ENOENT') {
   205	        const message = err instanceof Error ? err.message : String(err);
   206	        console.warn(`[stage2-fusion] learned stage2 model load failed: ${message}`);
   207	      }
   208	      return entry;
   209	    } finally {
   210	      learnedStage2ModelLoadPromise = null;
   211	      learnedStage2ModelLoadPromisePath = null;
   212	    }
   213	  })();
   214	
   215	  return (await learnedStage2ModelLoadPromise).model;
   216	}
   217	
   218	/**
   219	 * Apply validation-signal scoring at the Stage 2 single scoring point.
   220	 *
   221	 * Uses quality metadata extracted from spec artifacts to apply a bounded
   222	 * multiplier over the current composite score. This keeps S3 integrated
   223	 * in ranking while preserving score stability.
   224	 */
   225	function applyValidationSignalScoring(results: PipelineRow[]): PipelineRow[] {
   226	  if (!Array.isArray(results) || results.length === 0) return results;
   227	
   228	  const adjusted = results.map((row) => {
   229	    const metadata = row.validationMetadata as ValidationMetadataLike | undefined;
   230	    if (!metadata || typeof metadata !== 'object') return row;
   231	
   232	    const baseScore = resolveBaseScore(row);
   233	    const quality = typeof metadata.qualityScore === 'number' && Number.isFinite(metadata.qualityScore)
   234	      ? Math.max(0, Math.min(1, metadata.qualityScore))
   235	      : 0.5;
   236	
   237	    const qualityFactor = 0.9 + (quality * 0.2); // [0.9, 1.1]
   238	    const specLevelBonus = typeof metadata.specLevel === 'number' && Number.isFinite(metadata.specLevel)
   239	      ? Math.max(0, Math.min(0.06, (metadata.specLevel - 1) * 0.02))
   240	      : 0;
   241	
   242	    const completionBonus = metadata.completionStatus === 'complete'
   243	      ? 0.04
   244	      : metadata.completionStatus === 'partial'
   245	        ? 0.015
   246	        : 0;
   247	
   248	    const checklistBonus = metadata.hasChecklist ? 0.01 : 0;
   249	    const multiplier = clampMultiplier(qualityFactor + specLevelBonus + completionBonus + checklistBonus);
   250	    const scored = Math.min(1, Math.max(0, baseScore * multiplier));
   251	
   252	    if (scored === baseScore) return row;
   253	    return withSyncedScoreAliases(row, scored);
   254	  });
   255	
   256	  return sortDeterministicRows(adjusted as Array<PipelineRow & { id: number }>);
   257	}
   258	
   259	// -- Internal helpers --
   260	

exec
/bin/zsh -lc "nl -ba .opencode/plugins/spec-kit-compact-code-graph.js | sed -n '360,470p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/skill/mcp-coco-index/README.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc 'rg -n "RRF|Reciprocal Rank Fusion|BM25|FTS5|sqlite-vec|cosine|hybrid" .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:777:        : 'hybrid',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:4:// Combines vector, FTS, and BM25 search with fallback
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:107:   * When true, return immediately after adaptive/RRF fusion so Stage 2/3 can
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:117:   * - `'vector'` — cosine similarity from sqlite-vec (normalized from 0-100 to 0-1)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:118:   * - `'bm25'` — BM25 term-frequency relevance (min-max normalized per source group)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:119:   * - `'fts'` — FTS5 rank score (absolute value, min-max normalized per source group)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:122:   * After hybrid merge, all source scores are min-max normalized to 0-1 within
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:138:/** Normalize a fused RRF result to the HybridSearchResult contract. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:141:  const primarySource = result.sources[0] ?? 'hybrid';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:218: * Raw RRF scores are typically small decimals (often <0.05), so a
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:234:/** Primary vector similarity floor for hybrid fallback passes (percentage units). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:303: * Initialize hybrid search with database, vector search, and optional graph search dependencies.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:318:// 8. BM25 SEARCH
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:321: * Search the BM25 index with optional spec folder filtering.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:324: * @returns Array of BM25-scored results tagged with source 'bm25'.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:331:    console.warn('[hybrid-search] BM25 not enabled — returning empty bm25Search results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:341:    // BM25 document IDs are stringified
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:347:    // resolution returns [] rather than leaking unscoped BM25 candidates.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:352:        console.warn('[BM25] Spec-folder scope lookup failed, returning empty scoped results:', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:370:        console.warn('[BM25] Spec-folder scope lookup failed, returning empty scoped results:', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:379:        console.warn('[BM25] Spec-folder scope lookup failed, returning empty scoped results:', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:398:    console.warn(`[hybrid-search] BM25 search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:404: * Check whether the BM25 index is populated and available for search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:405: * @returns True if the BM25 index exists and contains at least one document.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:424: * Check whether the FTS5 full-text search table exists in the database.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:429:    console.warn('[hybrid-search] db not initialized — isFtsAvailable returning false');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:445: * Run FTS5 full-text search with weighted BM25 scoring and optional spec folder filtering.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:455:    console.warn('[hybrid-search] db not initialized or FTS unavailable — returning empty ftsSearch results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:462:    // C138-P2: Delegate to weighted BM25 FTS5 search from sqlite-fts.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:476:    console.warn(`[hybrid-search] FTS search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:484: * Merge FTS and BM25 search results, deduplicating by ID and preferring FTS scores.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:600:    source: typeof primary.source === 'string' ? primary.source : (sources[0] ?? 'hybrid'),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:787:    : await hybridSearch(query, embedding, primaryOptions);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:809:      : await hybridSearch(query, embedding, retryOptions);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:829:      : await hybridSearch(query, embedding, retryOptions);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:848: * Run multi-channel hybrid search combining vector, FTS, BM25, and graph results with per-source normalization.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:849: * Prefer hybridSearchEnhanced() or searchWithFallback() instead. This function uses naive per-source
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:850: * min-max normalization which produces different orderings than the RRF pipeline in hybridSearchEnhanced().
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:853:async function hybridSearch(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:891:      console.warn(`[hybrid-search] Vector search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:901:  // BM25 search
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:921:      console.warn(`[hybrid-search] Graph search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:973: * Enhanced hybrid search with RRF fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:977:async function hybridSearchEnhanced(
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:991:  return hybridSearch(query, embedding, options);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1090:        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1104:    // BM25 channel (internal error handling in bm25Search) — gated by query-complexity routing
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1108:        // BM25 weight 0.6 is lowest lexical channel — in-memory BM25 index
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1109:        // Has less precise scoring than SQLite FTS5 BM25; kept for coverage breadth.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1133:        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1177:        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1222:    // weights, avoiding the heavier hybridAdaptiveFuse() standard-first path.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1278:    console.warn(`[hybrid-search] Enhanced search failed, falling back: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1337:      console.error('[hybrid-search] MPAB error (non-fatal):', msg);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1360:      fusedHybridResults.map(r => ({ ...r, source: r.source || 'hybrid' })),
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1375:    console.warn('[hybrid-search] channel enforcement failed:', err instanceof Error ? err.message : String(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1469:        console.warn(`[hybrid-search] MMR embedding retrieval failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1501:      console.warn('[hybrid-search] co-activation enrichment failed:', err instanceof Error ? err.message : String(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1555:      console.warn('[hybrid-search] confidence truncation failed:', err instanceof Error ? err.message : String(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1623:      queryId: `hybrid-${Date.now()}`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1726:  console.warn('[hybrid-search] Raw candidate collection returned empty results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1753:  // P3-03 FIX: Use hybridSearchEnhanced (with RRF fusion) instead of
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1754:  // The naive hybridSearch that merges raw scores
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1776:  // Fallback to BM25 only
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1782:  console.warn('[hybrid-search] All search methods returned empty results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1800:    console.warn('[hybrid-search] db not initialized — returning empty structuralSearch results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1855:    console.warn(`[hybrid-search] Structural search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2103: * TIER 1: hybridSearchEnhanced at minSimilarity=30
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2106: * TIER 2: hybridSearchEnhanced at minSimilarity=10, all allowed channels forced
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2147:  console.error(`[hybrid-search] Tier 1→2 degradation: ${tier1Trigger.reason} (topScore=${tier1Trigger.topScore.toFixed(3)}, count=${tier1Trigger.resultCount})`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2174:  console.error(`[hybrid-search] Tier 2→3 degradation: ${tier2Trigger.reason} (topScore=${tier2Trigger.topScore.toFixed(3)}, count=${tier2Trigger.resultCount})`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2390:      `[hybrid-search] Token budget overflow (single-result fallback): ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2427:      `[hybrid-search] Token budget overflow (top-result fallback): ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2444:    `[hybrid-search] Token budget overflow: ${totalTokens} tokens > ${effectiveBudget} budget, ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2473:  hybridSearch,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2474:  hybridSearchEnhanced,
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:8:// Writes to a SEPARATE `learned_triggers` column (NOT FTS5 index).
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:11:// 1. Separate column -- `learned_triggers` TEXT column, NOT in FTS5 index
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:329:    // Apply learned triggers (Safeguard #1 -- separate column, NOT FTS5)
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:348: * NEVER to the FTS5 index (Safeguard #1).
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:399:    // Do NOT touch memory_fts or any FTS5 table (Safeguard #1).
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:445: * Searches the learned_triggers column (NOT FTS5) for matches against
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:168: * Converts an embedding vector into a binary buffer for sqlite-vec storage.
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:6:// On RRF scores to detect low-confidence retrieval and inject
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:32: * Summarises Z-score statistics for the RRF score distribution.
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:39:  /** Arithmetic mean of all RRF scores. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:41:  /** Population standard deviation of all RRF scores. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:144: * Detect evidence gaps in an RRF score distribution.
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:151: * @param rrfScores - Array of Reciprocal Rank Fusion scores (any length).
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:40:  /** N2a cap for RRF fusion overflow prevention. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:42:  /** N2b cap for RRF fusion overflow prevention. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:10:// BM25/FTS5 (no embedding call) to ground the LLM prompt in real
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:91: * Uses FTS5 / BM25 keyword search only — no embedding call — to keep
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:355: * @returns Dot product (cosine similarity for unit vectors)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:3:description: "5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval with Reciprocal Rank Fusion (RRF) and Adaptive Fusion."
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:6:  - "hybrid search"
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:12:> 5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval, fused with Reciprocal Rank Fusion (RRF) and Adaptive Fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:39:The search subsystem provides production-grade hybrid search capabilities with multiple retrieval methods fused via RRF scoring. It handles query expansion, intent classification, typo tolerance and optional cross-encoder reranking.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:42:- **5-Channel Hybrid Search**: Vector (semantic) + BM25/FTS5 (lexical) + Graph (relationship-based) + Graph Structure (structural)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:43:- **RRF Score Fusion**: Industry-standard k=40 with convergence bonuses
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:45:- **Query Enhancement**: Fuzzy matching (Levenshtein) + acronym expansions (via hybrid-search.ts inline logic)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:49:- **Schema Management**: sqlite-vec schema v15 (current) with document-type fields, event-based decay and phase-aware columns
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:58:|---> Vector (sqlite-vec)       -> Semantic matches
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:59:|---> BM25 (Pure JS)            -> Keyword matches
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:63:RRF Fusion (k=40) + Adaptive Fusion -> Unified scores
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:93:| Vector | `vector-index.ts` | Semantic similarity via sqlite-vec through the split vector-index modules |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:94:| BM25 | `bm25-index.ts` | Pure TypeScript keyword matching |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:95:| FTS5 | `sqlite-fts.ts` | SQLite FTS5 BM25 weighted scoring |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:109:6. Intent weights — non-hybrid only (G2 double-weighting prevention: `isHybrid` boolean guard)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:128:### Reciprocal Rank Fusion (RRF)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:132:**Why RRF?**
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:135:- Citation: Cormack et al. "RRF outperforms Condorcet" (SIGIR 2009)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:140:- **Adaptive Fusion**: Intent-aware weighted RRF with dark-run mode (feature flag `SPECKIT_ADAPTIVE_FUSION`)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:147:// Vector rank: 2, BM25 rank: 5, Graph rank: 1
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:148:// RRF score = 1/(40+2) + 1/(40+5) + 1.5/(40+1)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:153:### BM25 (Best Matching 25)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:167:**Why BM25?**
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:184:| `ok` | FTS5 compile probe passed, `memory_fts` exists, and BM25 ranking executed normally | `fts5` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:185:| `compile_probe_miss` | `PRAGMA compile_options` does not report FTS5 support, so lexical work cannot run for this request | `unavailable` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:186:| `missing_table` | FTS5 support is present, but `memory_fts` is missing at runtime | `unavailable` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:187:| `no_such_module_fts5` | The SQLite engine rejects FTS5 usage with `no such module: fts5` | `unavailable` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:188:| `bm25_runtime_failure` | The FTS5 table exists, but the `bm25(...)` ranking call fails at runtime | `unavailable` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:246:| **TypeScript**       | `hybrid-search.ts`, `cross-encoder.ts`, `intent-classifier.ts`, `bm25-index.ts`             |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:290:| `hybrid-search.ts`         | ~900   | TypeScript | Orchestrates vector/FTS/BM25/graph/degree fusion via adaptive RRF |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:294:| `bm25-index.ts`            | ~280   | TypeScript | Pure TypeScript BM25 (REQ-028, v1.2.0)              |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:309:| `evidence-gap-detector.ts` | -      | TypeScript | Z-score confidence check on RRF scores to detect low-confidence retrieval |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:311:| `sqlite-fts.ts`            | -      | TypeScript | SQLite FTS5 BM25 weighted scoring, extracted from hybrid-search for independent use |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:359:   hybrid-search.ts -> Expand acronyms + fix typos (inline)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:367:   bm25-index.ts -> BM25 search (keyword)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:375:   rrf-fusion.ts -> RRF with k=40, convergence bonus
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:377:   hybrid-search.ts -> Orchestrate multi-source fusion
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:413:| `ENABLE_BM25`            | `true`   | Enable BM25 lexical search (legacy compatibility gate) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:430:**RRF Parameters** (hardcoded, REQ-011):
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:437:**BM25 Parameters** (hardcoded, tuned):
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:475:// Float32Array -> Buffer conversion for sqlite-vec
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:481:### BM25 Index Features
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:507:// 2. BM25/FTS5 search (keyword matching)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:510:// -> RRF + Adaptive Fusion -> MMR diversity -> Sorted by combined score
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:516:hybridSearch("authentication", { specFolder: "specs/<###-spec-name>" })
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:520:- If BM25 disabled: Vector + FTS5 only
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:521:- If RRF disabled: Vector-only with basic metadata
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:598:| **Search Channel** | `querySummaryEmbeddings()` provides cosine similarity search over stored summaries |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:642:The 5th RRF channel computes degree centrality with per-edge-type weights:
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:718:**Lexical Normalization + BM25 Document Text** (`bm25-index.ts`):
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:719:`buildBm25DocumentText()` builds the canonical lexical document from title, content, trigger phrases, and folder metadata. `normalizeLexicalQueryTokens()` is shared by BM25 and SQLite FTS flows so lexical matching stays aligned across search channels.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:757:Selection tracking writes to a separate `learned_triggers` column (NOT FTS5 index). 10 safeguards: separate column, 30-day TTL, 100+ stop words denylist, rate cap (3 terms/selection, 8 terms/memory), top-3 exclusion, 1-week shadow period, <72h memory exclusion, sprint gate review, rollback mechanism, provenance audit log. Query weight: **0.7x** of organic triggers. Gated via `SPECKIT_LEARN_FROM_SELECTION` (default ON; set to `false` to disable).
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:770:import { init, unifiedSearch } from './hybrid-search';
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:796:import { unifiedSearch } from './hybrid-search';
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:830:### BM25 Direct Access
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:876:- FTS5 double-tokenization fix in learned feedback isolation (D2)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:877:- Quality floor corrected from 0.2 to 0.005 (D3) — aligns with RRF score range
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:915:| `sqlite-vec`     | Vector search extension |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:934:- **RRF**: Cormack et al. "Reciprocal Rank Fusion outperforms Condorcet" (SIGIR 2009)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:935:- **BM25**: Robertson & Walker "Okapi at TREC-3" (1994)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:943:| REQ-011 | RRF fusion enhancement           | hybrid-search.ts                |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:946:| REQ-014 | BM25 hybrid search               | bm25-index.ts, hybrid-search.ts |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:947:| REQ-018 | Query expansion (fuzzy)          | hybrid-search.ts                |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:948:| REQ-027 | Fuzzy acronym matching           | hybrid-search.ts                |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:949:| REQ-028 | Pure TypeScript BM25             | bm25-index.ts                   |
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:4:// Feature catalog: BM25 trigger phrase re-index gate
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:6:import { normalizeContentForBM25 } from '../parsing/content-normalizer.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:12:interface BM25SearchResult {
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:15:   * BM25 term-frequency relevance score (unbounded, typically 0-25+).
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:17:   * scores; use min-max normalization or RRF when combining with other methods.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:22:interface BM25Stats {
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:28:interface BM25DocumentSource {
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:41:const BM25_WARMUP_BATCH_SIZE = 250;
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:42:const BM25_ENABLED_VALUES = new Set(['1', 'true', 'yes', 'on', 'experimental', 'fallback']);
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:43:const BM25_DISABLED_VALUES = new Set(['0', 'false', 'no', 'off']);
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:46: * C138: Field weight multipliers for weighted BM25 scoring.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:51: * These weights are consumed by the FTS5 path in sqlite-fts.ts,
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:52: * not the in-memory BM25 engine in this file. Exported for shared access.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:59:const BM25_FTS5_WEIGHTS = [10.0, 5.0, 2.0, 1.0] as const;
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:61:const BM25_FIELD_WEIGHTS: Record<string, number> = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:62:  title: BM25_FTS5_WEIGHTS[0],
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:63:  trigger_phrases: BM25_FTS5_WEIGHTS[1],
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:64:  content_generic: BM25_FTS5_WEIGHTS[2],
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:65:  body: BM25_FTS5_WEIGHTS[3],
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:69: * Check whether the in-memory BM25 index is enabled.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:71: * @returns `true` when BM25 indexing/search is enabled for the current process.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:80:  const value = process.env.ENABLE_BM25?.trim().toLowerCase();
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:82:  if (BM25_DISABLED_VALUES.has(value)) return false;
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:83:  return BM25_ENABLED_VALUES.has(value);
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:99: * Apply lightweight stemming to a token for BM25 indexing and matching.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:146: * Tokenize raw text into normalized BM25 terms.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:163: * Count token frequency occurrences for BM25 scoring.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:181:function normalizeTriggerPhrasesForBM25(triggerPhrases: string | string[] | null | undefined): string {
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:211:function buildBm25DocumentText(row: BM25DocumentSource): string {
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:219:    textParts.push(normalizeContentForBM25(row.content_text));
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:222:  const triggerPhrases = normalizeTriggerPhrasesForBM25(row.trigger_phrases);
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:235:// 3. BM25 INDEX CLASS
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:238:class BM25Index {
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:322:  search(query: string, limit: number = 10): BM25SearchResult[] {
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:326:    const results: BM25SearchResult[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:340:  getStats(): BM25Stats {
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:415:      console.warn(`[bm25-index] Failed to sync BM25 rows: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:446:        const batchIds = pendingIds.splice(0, BM25_WARMUP_BATCH_SIZE);
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:465:      console.warn(`[bm25-index] Failed to schedule BM25 warmup: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:483:let indexInstance: BM25Index | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:486: * Retrieve the shared in-memory BM25 index singleton.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:488: * @returns The process-wide {@link BM25Index} instance.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:495:function getIndex(): BM25Index {
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:497:    indexInstance = new BM25Index();
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:503: * Reset the shared BM25 index singleton.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:517:// 5. FTS5 QUERY SANITIZATION (P3-06)
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:521: * Sanitize a query string for safe use with SQLite FTS5 and return
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:523: * entry point — both FTS5 query construction and BM25 callers should
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:526: * Removes all FTS5 operators and special characters, then returns
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:542:  // Remove FTS5 boolean/proximity operators (case-insensitive)
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:550:  // Remove FTS5 special characters and column-filter colon.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:581: * Sanitize a query string for safe use with SQLite FTS5.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:583: * each token in quotes for FTS5 safety.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:586: * @returns A quoted FTS5-safe query string.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:589: * sanitizeFTS5Query('memory search');
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:593:function sanitizeFTS5Query(query: string): string {
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:604:  BM25Index,
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:612:  sanitizeFTS5Query,
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:617:  BM25_FTS5_WEIGHTS,
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:618:  BM25_FIELD_WEIGHTS,
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:622:  BM25SearchResult,
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:623:  BM25Stats,
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:624:  BM25DocumentSource,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:256:// Deferred indexing - entry searchable via BM25/FTS5 only
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:334:    logger.info(`Deferred indexing: Memory ${Number(row_id)} saved without embedding (BM25/FTS5 searchable)`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:547:  // BUG-021: Remove the BM25 document only after the source row is deleted.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:555:      // BEST-EFFORT BM25 CLEANUP MUST NOT MASK A SUCCESSFUL PRIMARY DELETE.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:706:        // BM25 cleanup is best-effort for bulk deletes as well.
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:26: * Compute cosine similarity between two vectors.
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:29:function cosineSimilarity(a: Float32Array | number[], b: Float32Array | number[]): number {
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:152: * 2. Compute cosine similarity between query embedding and each summary embedding
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:168:    // Over-fetch by a factor so that after cosine ranking we can still return `limit` results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:181:      const similarity = cosineSimilarity(queryEmbedding, storedEmbedding);
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:239:  cosineSimilarity,
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:7:// Parses folder paths like "system-spec-kit/140-hybrid-rag/006-sprint-5"
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:75: * Parses folder paths like "system-spec-kit/140-hybrid-rag/006-sprint-5"
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:5:// Causal graph search channel — uses FTS5 for node matching
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:7:import { sanitizeFTS5Query } from './bm25-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:35:/** Edge type weights for typed-degree computation (R4 5th RRF channel) */
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:58:// 3. CAUSAL EDGE CHANNEL (FTS5-BACKED)
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:64: * Check whether the FTS5 table exists in the database.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:65: * Used to determine if FTS5 matching is available.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:91: * Uses FTS5 full-text search (memory_fts table) instead of naive LIKE matching.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:92: * Falls back to LIKE only when the FTS5 table is not available.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:103:    // Prefer FTS5 matching for proper full-text search
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:105:      graphResults.push(...queryCausalEdgesFTS5(database, query, limit));
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:107:      // Fallback: LIKE matching when FTS5 table is unavailable
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:150: * FTS5-backed causal edge query. Finds memory IDs via the memory_fts
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:152: * Scores incorporate both edge strength and FTS5 BM25 relevance.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:154:function queryCausalEdgesFTS5(
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:159:  const sanitized = sanitizeFTS5Query(query);
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:163:  // BM25-inspired weights: title(10) highest signal, content(5), triggers(2), folder(1).
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:209:  // Numeric IDs matching memory_index.id (INTEGER column) in the hybrid search
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:256: * Legacy LIKE-based fallback when FTS5 table is unavailable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:691:  // Typed-degree computation (R4 5th RRF channel)
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:48:const BM25_PRESERVING_ARTIFACTS = new Set([
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:120:  return BM25_PRESERVING_ARTIFACTS.has(artifact);
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:90: *   - Parenthetical abbreviations: "Reciprocal Rank Fusion (RRF)" → "RRF"
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:91: *   - Parenthetical definitions: "RRF (Reciprocal Rank Fusion)" → "Reciprocal Rank Fusion"
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:7:// Use inside the hybrid-search pipeline after RRF/RSF fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:13://   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:14://   - hybrid (R12):       Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:16://   - hybrid: collectRawCandidates → falls back to vector on failure
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:34://     - Reads from the vector index and FTS5 / BM25 index (DB reads only)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:40:import * as hybridSearch from '../hybrid-search.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:76:/** Minimum cosine similarity for multi-concept search. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:79:/** Number of constitutional results to fetch when none appear in hybrid/vector results. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:508:  // the query for the hybrid search channel, improving recall for alias-rich
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:513:  /** Effective query for hybrid search — may be expanded by concept routing. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:516:  if (isGraphConceptRoutingEnabled() && searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:604:  else if (searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:613:      throw new Error('[stage1-candidate-gen] Failed to generate embedding for hybrid search query');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:616:    // Deep mode: expand query into variants and run hybrid for each, then dedup
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:621:      // sub-query facets and run hybrid search per facet. Results are merged
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:654:            // Run hybrid for the original query plus each facet, in parallel
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:666:                  return hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:729:                const variantResults = await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:759:            `[stage1-candidate-gen] Deep query expansion failed, falling back to single hybrid: ${expandMsg}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:761:          // Fall through to single hybrid search below
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:763:          candidates = (await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:770:        // ExpandQuery returned only the original; treat as standard hybrid
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:772:        candidates = (await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:811:              hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:828:                  return hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:864:            `[stage1-candidate-gen] R12 embedding expansion failed, using standard hybrid: ${r12Msg}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:869:      // Standard hybrid search — runs when R12 is off, suppressed by R15,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:871:      // Phase B T016: Uses effectiveQuery (concept-expanded) for BM25 recall.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:875:          const hybridResults = (await hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:880:          candidates = hybridResults;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:881:        } catch (hybridErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:882:          const hybridMsg =
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:883:            hybridErr instanceof Error ? hybridErr.message : String(hybridErr);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:885:            `[stage1-candidate-gen] Hybrid search failed, falling back to vector: ${hybridMsg}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:910:              reason: hybridMsg,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:953:      `[stage1-candidate-gen] Unknown searchType: "${searchType}". Expected 'multi-concept', 'hybrid', or 'vector'.`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:961:  // Exception: for hybrid search, tier/contextType are applied here because
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1080:  //   1. Retrieve top-3 seed results via fast BM25/FTS5 (no embedding call).
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1082:  //   3. Fan-out [original, abstract, ...variants] as additional hybrid search channels.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1088:  if (mode === 'deep' && isLlmReformulationEnabled() && searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1109:              return hybridSearch.collectRawCandidates(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1176:  if (mode === 'deep' && isHyDEEnabled() && searchType === 'hybrid') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1391:  // P1 fix: activeChannels counts actual retrieval channels (vector, keyword/BM25),
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1392:  // while channelCount counts parallel query variants. In hybrid mode both vector
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1394:  const activeChannels = searchType === 'hybrid' ? 2 : 1;
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:103:  /** RRF fusion score (0–1). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:107:  /** Raw cosine similarity (0–100 scale from sqlite-vec). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:521: * REQ-D1-003: Experimental per-intent RRF K selection.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:522: * Default: TRUE (graduated). Set SPECKIT_RRF_K_EXPERIMENTAL=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:525:  return isFeatureEnabled('SPECKIT_RRF_K_EXPERIMENTAL');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:589: * Phase B T016: Query concept expansion for hybrid search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:175:    console.warn('[vector-index] Vector search unavailable - sqlite-vec not loaded');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:263:      SELECT m.*, vec_distance_cosine(v.embedding, ?) as distance,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:325:    console.warn('[vector-index] Multi-concept search unavailable - sqlite-vec not loaded');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:352:    `vec_distance_cosine(v.embedding, ?) as dist_${i}`
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:356:    `vec_distance_cosine(v.embedding, ?) <= ?`
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1304:      console.warn('[vector-index] find_orphaned_vector_ids: sqlite-vec not available');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1337:  // When sqlite-vec is not loaded, the vec_memories table does not exist.
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:25:  /** Weight for keyword (BM25) search component, 0-1 */
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:5:// Weighted BM25 scoring for FTS5 full-text search.
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:6:// Extracted from hybrid-search.ts ftsSearch() for independent
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:9:import { BM25_FTS5_WEIGHTS, normalizeLexicalQueryTokens } from './bm25-index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:97:      .some((value) => typeof value === 'string' && value.toUpperCase().includes('ENABLE_FTS5'));
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:147: * Execute a weighted BM25 FTS5 search against memory_fts.
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:149: * Uses SQLite FTS5's built-in bm25() ranking function with
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:156: * @returns Array of results with BM25 scores (higher = better)
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:195:  const [w0, w1, w2, w3] = BM25_FTS5_WEIGHTS;
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:211:    console.warn(`[sqlite-fts] FTS5 unavailable (${capability.fallbackState}); returning empty lexical lane results`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:252:    console.warn(`[sqlite-fts] BM25 FTS5 search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:258: * Check if the memory_fts FTS5 virtual table exists in the database.
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:260: * Used as a feature-detect before calling fts5Bm25Search, since FTS5
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:281:  BM25_FTS5_WEIGHTS as FTS5_BM25_WEIGHTS,
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:291: * BM25 FTS result and option types exposed by the SQLite FTS module.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:8: * assumed normalized [0,1] scores, but raw RRF scores (~0.01-0.03) never exceeded that
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:9: * threshold, causing channel-representation promotion to silently reject ALL RRF results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:11: * compatible with both raw RRF scores and normalized [0,1] scores. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:77: * @param topK              - Ordered top-k results from RRF fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:34:The `pipeline/` directory implements the core retrieval pipeline behind `memory_search`. Each search request flows through four sequential stages, each with a defined I/O contract and clear responsibility boundary. The pipeline supports hybrid, vector and multi-concept search types with optional deep-mode query expansion, cross-encoder reranking, MMR diversity pruning and MPAB chunk-to-parent reassembly.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:46:| `stage1-candidate-gen.ts` | Stage 1: Candidate Generation. Runs search channels (hybrid, vector, multi-concept), applies deep-mode query expansion (R6), embedding-based expansion (R12), summary embeddings (R8), constitutional memory injection, quality threshold filtering and tier/contextType filtering. |
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:47:| `stage2-fusion.ts` | Stage 2: Fusion + Signal Integration. The single authoritative scoring point. Applies 9 signal steps in fixed order: session boost, causal boost, co-activation spreading, community co-retrieval, graph signals, FSRS testing effect, intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals, artifact limiting, anchor metadata and validation metadata scoring. |
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:78:- Channels: hybrid (with optional deep-mode expansion), vector, multi-concept.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:86:- G2 prevention: intent weights are applied only for non-hybrid search types.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:106:2. **G2 Double-Weighting Guard.** Intent weights are applied only for non-hybrid search types. Hybrid search incorporates intent weighting during RRF/RSF fusion internally.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:114:- `mcp_server/lib/search/` - Parent search directory containing hybrid search, vector index, cross-encoder and other search modules consumed by the pipeline.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:11://     - Intent weights are NEVER applied to hybrid results (G2 double-weighting guard)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:29:// 4.  Intent weights          — non-hybrid search post-scoring adjustment
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:37:// Internally (RRF / RSF fusion). Post-search intent weighting is
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:38:// Therefore ONLY applied for non-hybrid search types (vector,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:39:// Multi-concept). Applying it to hybrid results would double-count.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:592: * G2 PREVENTION: This function is ONLY called for non-hybrid search types.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:593: * Hybrid search (RRF / RSF) already incorporates intent-weighted signals
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:594: * during fusion. Calling this on hybrid results would double-count intent.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:930: *   1.  Session boost      (hybrid only — working memory attention)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:932: *   2.  Causal boost       (hybrid only — graph-traversal amplification)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:937: *   4.  Intent weights     (non-hybrid only — G2 prevention)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:975:  const isHybrid = config.searchType === 'hybrid';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:978:  // Only for hybrid search type — session attention signals are most meaningful
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:979:  // When the full hybrid result set is available for ordering.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1000:  // Uses computeRecencyScore (already imported but previously unused in hybrid path).
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1031:  // Only for hybrid search type — causal graph traversal is seeded from the
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1057:  // Appear in the co-activation graph. Matches V1 hybrid-search behavior.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1210:  // G2 PREVENTION: Only apply for non-hybrid search types.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1211:  // Hybrid search (RRF / RSF) incorporates intent weighting during fusion —
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:122:  searchType: 'hybrid' | 'vector' | 'multi-concept';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:191: * Executes search channels (FTS5, semantic, trigger, graph, co-activation)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:206:    /** Actual retrieval channels active (vector=1, hybrid=2). Unlike channelCount which tracks query variants. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:224: * Single point for ALL scoring signals: RRF/RSF, causal boost, co-activation,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:415:// V14: Add content_text column + FTS5 rebuild for BM25 full-text search across restarts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:779:        logger.info('Migration v14: Rebuilt FTS5 table with content_text');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:781:        console.warn('[VectorIndex] Migration v14 warning (FTS5 rebuild):', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2361:  // Create vec_memories virtual table (only if sqlite-vec is available)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2382:  // Create FTS5 virtual table (includes content_text for full-text search)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2390:  // Create FTS5 sync triggers (includes content_text)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:21:import * as sqliteVec from 'sqlite-vec';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:797:    console.warn(`[vector-index] sqlite-vec extension not available: ${get_error_message(vec_error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:799:    console.warn('[vector-index] Install sqlite-vec: brew install sqlite-vec (macOS)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:875:// Check if vector search is available (sqlite-vec loaded)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:877: * Reports whether sqlite-vec vector search is available.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:12:// MPAB MUST remain AFTER RRF fusion (Stage 2).
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:169:  // The result set, matching the V1 hybrid-search behavior.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:248:  // MPAB must remain AFTER RRF (Stage 2 constraint). This step runs
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:473: * RRF fusion (Stage 2). It is intentionally placed in Stage 3.

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Hybrid Search
     3	// ───────────────────────────────────────────────────────────────
     4	// Combines vector, FTS, and BM25 search with fallback
     5	
     6	// 1. IMPORTS
     7	
     8	// Local
     9	import { getIndex, isBm25Enabled } from './bm25-index.js';
    10	import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
    11	import { getAdaptiveWeights, isAdaptiveFusionEnabled } from '@spec-kit/shared/algorithms/adaptive-fusion';
    12	import { CO_ACTIVATION_CONFIG, spreadActivation } from '../cognitive/co-activation.js';
    13	import { applyMMR } from '@spec-kit/shared/algorithms/mmr-reranker';
    14	import { INTENT_LAMBDA_MAP, classifyIntent } from './intent-classifier.js';
    15	import { fts5Bm25Search } from './sqlite-fts.js';
    16	import { DEGREE_CHANNEL_WEIGHT } from './graph-search-fn.js';
    17	import {
    18	  isMMREnabled,
    19	  isCrossEncoderEnabled,
    20	  isLocalRerankerEnabled,
    21	  isSearchFallbackEnabled,
    22	  isDocscoreAggregationEnabled,
    23	  isDegreeBoostEnabled,
    24	  isContextHeadersEnabled,
    25	} from './search-flags.js';
    26	import { rerankLocal } from './local-reranker.js';
    27	import { computeDegreeScores } from './graph-search-fn.js';
    28	import type { GraphSearchFn } from './search-types.js';
    29	
    30	// Feature catalog: Hybrid search pipeline
    31	
    32	export type { GraphSearchFn } from './search-types.js';
    33	
    34	import { routeQuery } from './query-router.js';
    35	import { isComplexityRouterEnabled } from './query-classifier.js';
    36	import { enforceChannelRepresentation } from './channel-enforcement.js';
    37	import {
    38	  truncateByConfidence,
    39	  isConfidenceTruncationEnabled,
    40	  DEFAULT_MIN_RESULTS,
    41	  GAP_THRESHOLD_MULTIPLIER,
    42	} from './confidence-truncation.js';
    43	import {
    44	  getDynamicTokenBudget,
    45	  isDynamicTokenBudgetEnabled,
    46	  DEFAULT_TOKEN_BUDGET_CONFIG,
    47	} from './dynamic-token-budget.js';
    48	import { ensureDescriptionCache, getSpecsBasePaths } from './folder-discovery.js';
    49	import {
    50	  isFolderScoringEnabled,
    51	  lookupFolders,
    52	  computeFolderRelevanceScores,
    53	  enrichResultsWithFolderScores,
    54	  twoPhaseRetrieval,
    55	} from './folder-relevance.js';
    56	
    57	import { collapseAndReassembleChunkResults } from '../scoring/mpab-aggregation.js';
    58	
    59	// Type-only
    60	import type Database from 'better-sqlite3';
    61	import type { SpreadResult } from '../cognitive/co-activation.js';
    62	import type { MMRCandidate } from '@spec-kit/shared/algorithms/mmr-reranker';
    63	import type { FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';
    64	import type { ChannelName } from './query-router.js';
    65	import type { EnforcementResult } from './channel-enforcement.js';
    66	import type { TruncationResult } from './confidence-truncation.js';
    67	
    68	// 2. INTERFACES
    69	
    70	type VectorSearchFn = (
    71	  embedding: Float32Array | number[],
    72	  options: Record<string, unknown>
    73	) => Array<Record<string, unknown>>;
    74	
    75	interface HybridSearchOptions {
    76	  limit?: number;
    77	  specFolder?: string;
    78	  minSimilarity?: number;
    79	  useBm25?: boolean;
    80	  useFts?: boolean;
    81	  useVector?: boolean;
    82	  useGraph?: boolean;
    83	  includeArchived?: boolean;
    84	  includeContent?: boolean;
    85	  /**
    86	   * Evaluation-only mode.
    87	   * When true, preserve the requested top-K window by bypassing confidence
    88	   * truncation and token-budget truncation without changing live defaults.
    89	   */
    90	  evaluationMode?: boolean;
    91	  /** Classified query intent for adaptive fusion weight selection (e.g. 'understand', 'fix_bug'). */
    92	  intent?: string;
    93	  /** Optional trigger phrases for query-classifier trigger-match routing path. */
    94	  triggerPhrases?: string[];
    95	  /**
    96	   * Internal fallback override: when true, bypass complexity routing and
    97	   * enable all retrieval channels for this search call.
    98	   */
    99	  forceAllChannels?: boolean;
   100	  /**
   101	   * Internal raw-candidate mode used by the Stage 1 pipeline.
   102	   * When true, stop after channel collection and return pre-fusion candidates.
   103	   */
   104	  skipFusion?: boolean;
   105	  /**
   106	   * Internal pipeline handoff mode.
   107	   * When true, return immediately after adaptive/RRF fusion so Stage 2/3 can
   108	   * apply the remaining pipeline scoring and aggregation steps.
   109	   */
   110	  stopAfterFusion?: boolean;
   111	}
   112	
   113	interface HybridSearchResult {
   114	  id: number | string;
   115	  /**
   116	   * Normalized relevance score (0-1). Semantics depend on `source`:
   117	   * - `'vector'` — cosine similarity from sqlite-vec (normalized from 0-100 to 0-1)
   118	   * - `'bm25'` — BM25 term-frequency relevance (min-max normalized per source group)
   119	   * - `'fts'` — FTS5 rank score (absolute value, min-max normalized per source group)
   120	   * - `'graph'` — graph traversal relevance
   121	   *
   122	   * After hybrid merge, all source scores are min-max normalized to 0-1 within
   123	   * their source group to ensure fair cross-method comparison (see P3-02 fix).
   124	   */
   125	  score: number;
   126	  source: string;
   127	  title?: string;
   128	  [key: string]: unknown;
   129	}
   130	
   131	/** Non-enumerable shadow metadata attached to result arrays via Object.defineProperty. */
   132	interface ShadowMetaArray {
   133	  _s4shadow?: unknown;
   134	  _s4attribution?: unknown;
   135	  _degradation?: unknown;
   136	}
   137	
   138	/** Normalize a fused RRF result to the HybridSearchResult contract. */
   139	function toHybridResult(result: FusionResult): HybridSearchResult {
   140	  const sourceCandidate = (result as { source?: unknown }).source;
   141	  const primarySource = result.sources[0] ?? 'hybrid';
   142	  const scoreCandidate = (result as { score?: unknown }).score;
   143	
   144	  return {
   145	    ...result,
   146	    id: result.id,
   147	    score: typeof scoreCandidate === 'number' ? scoreCandidate : result.rrfScore,
   148	    source: typeof sourceCandidate === 'string' ? sourceCandidate : primarySource,
   149	  };
   150	}
   151	
   152	// 3. SPRINT 3 PIPELINE METADATA
   153	
   154	/**
   155	 * Optional metadata about pipeline stages attached to enhanced search results.
   156	 * Only populated when the corresponding feature flags are enabled.
   157	 */
   158	interface Sprint3PipelineMeta {
   159	  /** Query complexity routing result (SPECKIT_COMPLEXITY_ROUTER). */
   160	  routing?: {
   161	    tier: string;
   162	    channels: string[];
   163	    skippedChannels: string[];
   164	    featureFlagEnabled: boolean;
   165	    confidence: string;
   166	    features: Record<string, unknown>;
   167	  };
   168	  /** Channel enforcement result (SPECKIT_CHANNEL_MIN_REP). */
   169	  enforcement?: { applied: boolean; promotedCount: number; underRepresentedChannels: string[] };
   170	  /** Confidence truncation result (SPECKIT_CONFIDENCE_TRUNCATION). */
   171	  truncation?: {
   172	    truncated: boolean;
   173	    originalCount: number;
   174	    truncatedCount: number;
   175	    medianGap: number;
   176	    cutoffGap: number;
   177	    cutoffIndex: number;
   178	    thresholdMultiplier: number;
   179	    minResultsGuaranteed: number;
   180	    featureFlagEnabled: boolean;
   181	  };
   182	  /** Dynamic token budget result (SPECKIT_DYNAMIC_TOKEN_BUDGET). */
   183	  tokenBudget?: {
   184	    tier: string;
   185	    budget: number;
   186	    applied: boolean;
   187	    featureFlagEnabled: boolean;
   188	    configValues: Record<string, number>;
   189	    headerOverhead: number;
   190	    adjustedBudget: number;
   191	  };
   192	}
   193	
   194	// 4. PI-A2: DEGRADATION TYPES
   195	
   196	/** Fallback tier in the 3-tier degradation chain. */
   197	type FallbackTier = 1 | 2 | 3;
   198	
   199	/** Why degradation was triggered at a given tier. */
   200	interface DegradationTrigger {
   201	  reason: 'low_quality' | 'insufficient_results' | 'both';
   202	  topScore: number;
   203	  resultCount: number;
   204	  relativeGap?: number;
   205	}
   206	
   207	/** Record of a single degradation event during tiered fallback. */
   208	interface DegradationEvent {
   209	  tier: FallbackTier;
   210	  trigger: DegradationTrigger;
   211	  resultCountBefore: number;
   212	  resultCountAfter: number;
   213	}
   214	
   215	/**
   216	 * Absolute quality floor for degradation checks.
   217	 *
   218	 * Raw RRF scores are typically small decimals (often <0.05), so a
   219	 * high fixed threshold causes false degradations. Use a conservative floor and
   220	 * pair it with a relative-gap check to avoid score-scale coupling.
   221	 */
   222	const DEGRADATION_QUALITY_THRESHOLD = 0.02;
   223	
   224	/** Minimum relative separation between top-1 and top-2 scores. */
   225	const DEGRADATION_MIN_RELATIVE_GAP = 0.2;
   226	
   227	/** Minimum result count: must have >= this many results to stay at current tier. */
   228	const DEGRADATION_MIN_RESULTS = 3;
   229	
   230	// 5. MODULE STATE
   231	
   232	/** Default result limit when none is specified by the caller. */
   233	const DEFAULT_LIMIT = 20;
   234	/** Primary vector similarity floor for hybrid fallback passes (percentage units). */
   235	const PRIMARY_FALLBACK_MIN_SIMILARITY = 30;
   236	/** Secondary vector similarity floor for adaptive retry passes (percentage units). */
   237	const SECONDARY_FALLBACK_MIN_SIMILARITY = 17;
   238	/** Tier-2 vector similarity floor for quality-aware fallback (percentage units). */
   239	const TIERED_FALLBACK_MIN_SIMILARITY = 10;
   240	
   241	/** Minimum MMR candidates required for diversity reranking to be worthwhile. */
   242	const MMR_MIN_CANDIDATES = 2;
   243	
   244	/** Fallback lambda (diversity vs relevance) when intent is not in INTENT_LAMBDA_MAP. */
   245	const MMR_DEFAULT_LAMBDA = 0.7;
   246	
   247	/** Number of top results used as seeds for co-activation spreading. */
   248	const SPREAD_ACTIVATION_TOP_N = 5;
   249	
   250	/** Maximum contextual tree header length prepended to content (including brackets). */
   251	const CONTEXT_HEADER_MAX_CHARS = 100;
   252	/** Header/content separator characters added during contextual tree injection. */
   253	const CONTEXT_HEADER_SEPARATOR_CHARS = 1;
   254	/** Reserved token overhead per contextual header, calibrated to max header length. */
   255	const CONTEXT_HEADER_TOKEN_OVERHEAD = Math.ceil(
   256	  (CONTEXT_HEADER_MAX_CHARS + CONTEXT_HEADER_SEPARATOR_CHARS) / 4
   257	);
   258	
   259	let db: Database.Database | null = null;
   260	let vectorSearchFn: VectorSearchFn | null = null;
   261	let graphSearchFn: GraphSearchFn | null = null;
   262	
   263	// 6. GRAPH CHANNEL METRICS (T008)
   264	
   265	interface GraphChannelMetrics {
   266	  totalQueries: number;
   267	  graphHits: number;
   268	  graphOnlyResults: number;
   269	  multiSourceResults: number;
   270	}
   271	
   272	const graphMetrics: GraphChannelMetrics = {
   273	  totalQueries: 0,
   274	  graphHits: 0,
   275	  graphOnlyResults: 0,
   276	  multiSourceResults: 0,
   277	};
   278	
   279	/**
   280	 * Return current graph channel metrics for health check reporting.
   281	 * graphHitRate is computed as graphHits / totalQueries.
   282	 */
   283	function getGraphMetrics(): GraphChannelMetrics & { graphHitRate: number } {
   284	  return {
   285	    ...graphMetrics,
   286	    graphHitRate: graphMetrics.totalQueries > 0
   287	      ? graphMetrics.graphHits / graphMetrics.totalQueries
   288	      : 0,
   289	  };
   290	}
   291	
   292	/** Reset all graph channel metrics counters to zero. */
   293	function resetGraphMetrics(): void {
   294	  graphMetrics.totalQueries = 0;
   295	  graphMetrics.graphHits = 0;
   296	  graphMetrics.graphOnlyResults = 0;
   297	  graphMetrics.multiSourceResults = 0;
   298	}
   299	
   300	// 7. INITIALIZATION
   301	
   302	/**
   303	 * Initialize hybrid search with database, vector search, and optional graph search dependencies.
   304	 * @param database - The better-sqlite3 database instance for FTS and graph queries.
   305	 * @param vectorFn - Optional vector search function for semantic similarity.
   306	 * @param graphFn - Optional graph search function for causal/structural retrieval.
   307	 */
   308	function init(
   309	  database: Database.Database,
   310	  vectorFn: VectorSearchFn | null = null,
   311	  graphFn: GraphSearchFn | null = null
   312	): void {
   313	  db = database;
   314	  vectorSearchFn = vectorFn;
   315	  graphSearchFn = graphFn;
   316	}
   317	
   318	// 8. BM25 SEARCH
   319	
   320	/**

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Context Server
     3	// ───────────────────────────────────────────────────────────────
     4	// T303: Decomposed — tool schemas in tool-schemas.ts, dispatch
     5	// Logic in tools/*.ts. This file retains server init, startup,
     6	// Shutdown, and main orchestration only.
     7	import fs from 'fs';
     8	import path from 'path';
     9	
    10	/* ───────────────────────────────────────────────────────────────
    11	   1. MODULE IMPORTS
    12	──────────────────────────────────────────────────────────────── */
    13	
    14	// MCP SDK
    15	import { Server } from '@modelcontextprotocol/sdk/server/index.js';
    16	import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
    17	import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
    18	
    19	// Core modules
    20	import {
    21	  DEFAULT_BASE_PATH,
    22	  ALLOWED_BASE_PATHS,
    23	  DATABASE_PATH,
    24	  checkDatabaseUpdated,
    25	  setEmbeddingModelReady, waitForEmbeddingModel,
    26	  init as initDbState
    27	} from './core/index.js';
    28	
    29	// T303: Tool schemas and dispatch
    30	import { TOOL_DEFINITIONS } from './tool-schemas.js';
    31	import { dispatchTool } from './tools/index.js';
    32	
    33	// Handler modules (only indexSingleFile needed directly for startup scan)
    34	import {
    35	  indexSingleFile,
    36	  handleMemoryStats,
    37	} from './handlers/index.js';
    38	import * as memoryIndexDiscovery from './handlers/memory-index-discovery.js';
    39	import { runPostMutationHooks } from './handlers/mutation-hooks.js';
    40	
    41	// Utils
    42	import { validateInputLengths } from './utils/index.js';
    43	
    44	// History (audit trail for file-watcher deletes)
    45	import { recordHistory } from './lib/storage/history.js';
    46	import * as historyStore from './lib/storage/history.js';
    47	
    48	// Hooks
    49	import {
    50	  MEMORY_AWARE_TOOLS,
    51	  extractContextHint,
    52	  autoSurfaceMemories,
    53	  autoSurfaceAtToolDispatch,
    54	  autoSurfaceAtCompaction,
    55	  appendAutoSurfaceHints,
    56	  syncEnvelopeTokenCount,
    57	  serializeEnvelopeWithTokenCount,
    58	  recordToolCall,
    59	} from './hooks/index.js';
    60	import { primeSessionIfNeeded } from './hooks/memory-surface.js';
    61	
    62	// Architecture
    63	import { getTokenBudget } from './lib/architecture/layer-definitions.js';
    64	import { createMCPErrorResponse, wrapForMCP } from './lib/response/envelope.js';
    65	
    66	// T303: Startup checks (extracted from this file)
    67	import { detectNodeVersionMismatch, checkSqliteVersion } from './startup-checks.js';
    68	import {
    69	  getStartupEmbeddingDimension,
    70	  resolveStartupEmbeddingConfig,
    71	  validateConfiguredEmbeddingsProvider,
    72	} from '@spec-kit/shared/embeddings/factory';
    73	
    74	// Lib modules (for initialization only)
    75	import * as vectorIndex from './lib/search/vector-index.js';
    76	import * as _embeddings from './lib/providers/embeddings.js';
    77	import * as checkpointsLib from './lib/storage/checkpoints.js';
    78	import * as accessTracker from './lib/storage/access-tracker.js';
    79	import { runLineageBackfill } from './lib/storage/lineage-state.js';
    80	import * as hybridSearch from './lib/search/hybrid-search.js';
    81	import { createUnifiedGraphSearchFn } from './lib/search/graph-search-fn.js';
    82	import { isGraphUnifiedEnabled } from './lib/search/graph-flags.js';
    83	import * as graphDb from './lib/code-graph/code-graph-db.js';
    84	import { detectRuntime, type RuntimeInfo } from './lib/code-graph/runtime-detection.js';
    85	import * as sessionBoost from './lib/search/session-boost.js';
    86	import * as causalBoost from './lib/search/causal-boost.js';
    87	import * as bm25Index from './lib/search/bm25-index.js';
    88	import * as memoryParser from './lib/parsing/memory-parser.js';
    89	import { getSpecsBasePaths } from './lib/search/folder-discovery.js';
    90	import {
    91	  registerGlobalRefreshFn,
    92	  getDirtyNodes,
    93	  clearDirtyNodes,
    94	  recomputeLocal,
    95	} from './lib/search/graph-lifecycle.js';
    96	import {
    97	  isDegreeBoostEnabled,
    98	  isDynamicInitEnabled,
    99	  isFileWatcherEnabled,
   100	} from './lib/search/search-flags.js';
   101	import { runCleanupStep, runAsyncCleanupStep } from './lib/utils/cleanup-helpers.js';
   102	import { disposeLocalReranker } from './lib/search/local-reranker.js';
   103	import * as workingMemory from './lib/cognitive/working-memory.js';
   104	import * as attentionDecay from './lib/cognitive/attention-decay.js';
   105	import * as coActivation from './lib/cognitive/co-activation.js';
   106	import { initScoringObservability } from './lib/telemetry/scoring-observability.js';
   107	// T059: Archival manager for automatic archival of ARCHIVED state memories
   108	import * as archivalManager from './lib/cognitive/archival-manager.js';
   109	// T099: Retry manager for background embedding retry job (REQ-031, CHK-179)
   110	import * as retryManager from './lib/providers/retry-manager.js';
   111	import { buildErrorResponse, getDefaultErrorCodeForTool, getRecoveryHint } from './lib/errors.js';
   112	// T001-T004: Session deduplication
   113	import * as sessionManager from './lib/session/session-manager.js';
   114	import * as shadowEvaluationRuntime from './lib/feedback/shadow-evaluation-runtime.js';
   115	// Phase 023: Context metrics — lightweight session quality tracking
   116	import { recordMetricEvent } from './lib/session/context-metrics.js';
   117	
   118	// P4-12/P4-19: Incremental index (passed to db-state for stale handle refresh)
   119	import * as incrementalIndex from './lib/storage/incremental-index.js';
   120	// T107: Transaction manager for pending file recovery on startup (REQ-033)
   121	import * as transactionManager from './lib/storage/transaction-manager.js';
   122	// KL-4: Tool cache cleanup on shutdown
   123	import * as toolCache from './lib/cache/tool-cache.js';
   124	import { initExtractionAdapter } from './lib/extraction/extraction-adapter.js';
   125	import { migrateLearnedTriggers, verifyFts5Isolation } from './lib/storage/learned-triggers-schema.js';
   126	import { isLearnedFeedbackEnabled } from './lib/search/learned-feedback.js';
   127	import { initIngestJobQueue } from './lib/ops/job-queue.js';
   128	import { startFileWatcher, type FSWatcher } from './lib/ops/file-watcher.js';
   129	import { getCanonicalPathKey } from './lib/utils/canonical-path.js';
   130	import { runBatchLearning } from './lib/feedback/batch-learning.js';
   131	import { getSessionSnapshot } from './lib/session/session-snapshot.js';
   132	
   133	/* ───────────────────────────────────────────────────────────────
   134	   2. TYPES
   135	──────────────────────────────────────────────────────────────── */
   136	
   137	interface IndexResult {
   138	  status: string;
   139	  error?: string;
   140	  [key: string]: unknown;
   141	}
   142	
   143	interface PendingRecoveryResult {
   144	  found: number;
   145	  processed: number;
   146	  recovered: number;
   147	  failed: number;
   148	  results: unknown[];
   149	}
   150	
   151	interface ApiKeyValidation {
   152	  valid: boolean;
   153	  provider?: string;
   154	  error?: string;
   155	  errorCode?: string;
   156	  warning?: string;
   157	  actions?: string[];
   158	  networkError?: boolean;
   159	}
   160	
   161	interface AutoSurfaceResult {
   162	  constitutional: unknown[];
   163	  triggered: unknown[];
   164	  codeGraphStatus?: {
   165	    status: 'ok' | 'error';
   166	    data?: Record<string, unknown>;
   167	    error?: string;
   168	  };
   169	  sessionPrimed?: boolean;
   170	  primedTool?: string;
   171	  /** T018: Structured Prime Package for non-hook CLI auto-priming */
   172	  primePackage?: {
   173	    specFolder: string | null;
   174	    currentTask: string | null;
   175	    codeGraphStatus: 'fresh' | 'stale' | 'empty';
   176	    cocoIndexAvailable: boolean;
   177	    recommendedCalls: string[];
   178	  };
   179	  surfaced_at?: string;
   180	  latencyMs?: number;
   181	}
   182	
   183	interface ToolCallResponse {
   184	  content: Array<{ type: string; text: string }>;
   185	  isError?: boolean;
   186	  structuredContent?: unknown;
   187	  [key: string]: unknown;
   188	}
   189	
   190	interface DynamicMemoryStats {
   191	  totalMemories: number;
   192	  specFolderCount: number;
   193	  activeCount: number;
   194	  staleCount: number;
   195	}
   196	
   197	type AfterToolCallback = (tool: string, callId: string, result: unknown) => Promise<void>;
   198	
   199	const afterToolCallbacks: Array<AfterToolCallback> = [];
   200	
   201	/** Timeout (ms) for waiting on embedding model readiness during startup scan. */
   202	const EMBEDDING_MODEL_TIMEOUT_MS = 30_000;
   203	
   204	/** Timeout (ms) for API key validation during startup. */
   205	const API_KEY_VALIDATION_TIMEOUT_MS = 5_000;
   206	
   207	const GRAPH_ENRICHMENT_TIMEOUT_MS = 250;
   208	const GRAPH_ENRICHMENT_OUTLINE_LIMIT = 6;
   209	const GRAPH_ENRICHMENT_NEIGHBOR_LIMIT = 6;
   210	const GRAPH_ENRICHMENT_SYMBOL_LIMIT = 4;
   211	const GRAPH_CONTEXT_EXCLUDED_TOOLS = new Set<string>([
   212	  ...MEMORY_AWARE_TOOLS,
   213	  'code_graph_query',
   214	  'code_graph_context',
   215	  'code_graph_scan',
   216	  'code_graph_status',
   217	]);
   218	
   219	interface GraphContextNeighborSummary {
   220	  filePath: string;
   221	  relationTypes: string[];
   222	  symbols: Array<{
   223	    name: string;
   224	    kind: string;
   225	    line: number;
   226	    direction: 'incoming' | 'outgoing';
   227	    relation: string;
   228	  }>;
   229	}
   230	
   231	interface GraphContextFileSummary {
   232	  filePath: string;
   233	  outline: Array<{
   234	    name: string;
   235	    kind: string;
   236	    line: number;
   237	  }>;
   238	  neighbors: GraphContextNeighborSummary[];
   239	}
   240	
   241	interface DispatchGraphContextMeta {
   242	  status: 'ok' | 'timeout' | 'unavailable';
   243	  source: 'tool-dispatch';
   244	  fileCount: number;
   245	  filePaths: string[];
   246	  latencyMs: number;
   247	  files?: GraphContextFileSummary[];
   248	  error?: string;
   249	}
   250	
   251	export interface StructuralRoutingNudge {
   252	  advisory: true;
   253	  readiness: 'ready';
   254	  preferredTool: 'code_graph_query';
   255	  secondaryTool: 'code_graph_context';
   256	  message: string;
   257	  preservesAuthority: 'session_bootstrap';
   258	  surface: 'response-hints' | 'session-bootstrap' | 'memory-context';
   259	}
   260	

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ────────────────────────────────────────────────────────────────
     2	// MODULE: Memory Context
     3	// ────────────────────────────────────────────────────────────────
     4	
     5	import { randomUUID } from 'crypto';
     6	
     7	// Layer definitions
     8	import * as layerDefs from '../lib/architecture/layer-definitions.js';
     9	import { checkDatabaseUpdated } from '../core/index.js';
    10	import { toErrorMessage } from '../utils/index.js';
    11	
    12	// Intent classifier
    13	import * as intentClassifier from '../lib/search/intent-classifier.js';
    14	
    15	// Query-intent routing (Phase 020: structural/semantic/hybrid classification)
    16	import { classifyQueryIntent } from '../lib/code-graph/query-intent-classifier.js';
    17	import { buildContext } from '../lib/code-graph/code-graph-context.js';
    18	
    19	// Core handlers for routing
    20	import { handleMemorySearch } from './memory-search.js';
    21	import { handleMemoryMatchTriggers } from './memory-triggers.js';
    22	
    23	// Response envelope
    24	import { createMCPErrorResponse, createMCPResponse } from '../lib/response/envelope.js';
    25	
    26	// Token estimation
    27	import { estimateTokens } from '../formatters/token-metrics.js';
    28	import {
    29	  getPressureLevel,
    30	  type RuntimeContextStats,
    31	} from '../lib/cognitive/pressure-monitor.js';
    32	import * as workingMemory from '../lib/cognitive/working-memory.js';
    33	import * as sessionManager from '../lib/session/session-manager.js';
    34	
    35	// Telemetry
    36	import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry.js';
    37	import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';
    38	import {
    39	  attachSessionTransitionTrace,
    40	  buildSessionTransitionTrace,
    41	  type SessionTransitionTrace,
    42	} from '../lib/search/session-transition.js';
    43	
    44	// Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
    45	import { logSearchQuery, logChannelResult, logFinalResult } from '../lib/eval/eval-logger.js';
    46	import * as vectorIndex from '../lib/search/vector-index.js';
    47	
    48	// Shared handler types
    49	import type { MCPResponse, IntentClassification } from './types.js';
    50	
    51	// PI-B3: Folder discovery integration
    52	import { discoverSpecFolder, getSpecsBasePaths } from '../lib/search/folder-discovery.js';
    53	import {
    54	  isAutoResumeEnabled,
    55	  isFolderDiscoveryEnabled,
    56	  isPressurePolicyEnabled,
    57	  isIntentAutoProfileEnabled,
    58	} from '../lib/search/search-flags.js';
    59	
    60	// Feature catalog: Unified context retrieval (memory_context)
    61	// Feature catalog: Dual-scope memory auto-surface
    62	// Feature catalog: Provenance-rich response envelopes
    63	
    64	
    65	/* ───────────────────────────────────────────────────────────────
    66	   1. TYPES
    67	──────────────────────────────────────────────────────────────── */
    68	
    69	interface ContextMode {
    70	  readonly name: string;
    71	  readonly description: string;
    72	  readonly strategy: string;
    73	  readonly tokenBudget?: number;
    74	}
    75	
    76	interface ContextOptions {
    77	  specFolder?: string;
    78	  folderBoost?: { folder: string; factor: number };
    79	  tenantId?: string;
    80	  userId?: string;
    81	  agentId?: string;
    82	  sharedSpaceId?: string;
    83	  limit?: number;
    84	  sessionId?: string;
    85	  enableDedup?: boolean;
    86	  includeContent?: boolean;
    87	  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
    88	  anchors?: string[];
    89	  profile?: string;
    90	  sessionTransition?: SessionTransitionTrace;
    91	}
    92	
    93	interface SessionLifecycleMetadata {
    94	  sessionScope: 'caller' | 'ephemeral';
    95	  requestedSessionId: string | null;
    96	  effectiveSessionId: string;
    97	  resumed: boolean;
    98	  eventCounterStart: number;
    99	  resumedContextCount: number;
   100	}
   101	
   102	interface ContextResult extends Record<string, unknown> {
   103	  strategy: string;
   104	  mode: string;
   105	}
   106	
   107	interface LayerInfo {
   108	  tokenBudget?: number;
   109	}
   110	
   111	interface ContextArgs {
   112	  input: string;
   113	  mode?: string;
   114	  intent?: string;
   115	  specFolder?: string;
   116	  tenantId?: string;
   117	  userId?: string;
   118	  agentId?: string;
   119	  sharedSpaceId?: string;
   120	  limit?: number;
   121	  sessionId?: string;
   122	  enableDedup?: boolean;
   123	  includeContent?: boolean;
   124	  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
   125	  tokenUsage?: number;
   126	  anchors?: string[];
   127	  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
   128	  profile?: string;
   129	}
   130	
   131	/** T205: Token budget enforcement metadata */
   132	interface TokenBudgetEnforcement {
   133	  budgetTokens: number;
   134	  actualTokens: number;
   135	  enforced: boolean;
   136	  truncated: boolean;
   137	  originalResultCount?: number;
   138	  returnedResultCount?: number;
   139	}
   140	
   141	type PressureOverrideTargetMode = 'quick' | 'focused' | null;
   142	
   143	interface SessionLifecycleResolution {
   144	  requestedSessionId: string | null;
   145	  effectiveSessionId: string;
   146	  resumed: boolean;
   147	  priorMode: string | null;
   148	  counter: number;
   149	  error?: string;
   150	}
   151	
   152	interface EffectiveModeIntentClassification {
   153	  detectedIntent?: string;
   154	  intentConfidence: number;
   155	  resumeHeuristicApplied: boolean;
   156	  source: 'explicit' | 'auto-detected';
   157	}
   158	
   159	interface EffectiveModeResolution {
   160	  effectiveMode: string;
   161	  pressureOverrideApplied: boolean;
   162	  pressureOverrideTargetMode: PressureOverrideTargetMode;
   163	  pressureWarning: string | null;
   164	  intentClassification: EffectiveModeIntentClassification;
   165	}
   166	
   167	interface BuildResponseMetaParams {
   168	  effectiveMode: string;
   169	  requestedMode: string;
   170	  tracedResult: ContextResult;
   171	  pressurePolicy: {
   172	    level: string;
   173	    ratio: number | null;
   174	    source: string;
   175	    warning: string | null;
   176	  };
   177	  pressureOverrideApplied: boolean;
   178	  pressureOverrideTargetMode: PressureOverrideTargetMode;
   179	  pressureWarning: string | null;
   180	  sessionLifecycle: SessionLifecycleMetadata;
   181	  effectiveBudget: number;
   182	  enforcement: TokenBudgetEnforcement;
   183	  intentClassification: EffectiveModeIntentClassification;
   184	  discoveredFolder?: string;
   185	  includeTrace: boolean;
   186	  sessionTransition: SessionTransitionTrace;
   187	  structuralRoutingNudge: StructuralRoutingNudgeMeta | null;
   188	}
   189	
   190	interface StrategyErrorPayload {
   191	  error: string;
   192	  code: string;
   193	  details: Record<string, unknown>;
   194	  hints: string[];
   195	  severity: string | null;
   196	}
   197	
   198	interface StructuralRoutingNudgeMeta {
   199	  advisory: true;
   200	  readiness: 'ready';
   201	  preferredTool: 'code_graph_query';
   202	  message: string;
   203	  preservesAuthority: 'session_bootstrap';
   204	}
   205	
   206	const STRUCTURAL_ROUTING_PATTERNS = [
   207	  /\b(?:who|what)\s+calls?\b/i,
   208	  /\bcallers?\s+of\b/i,
   209	  /\b(?:who|what)\s+imports?\b/i,
   210	  /\bimports?\s+of\b/i,
   211	  /\b(?:show|list)\s+(?:the\s+)?outline\b/i,
   212	  /\boutline\s+of\b/i,
   213	  /\bdependenc(?:y|ies)\b/i,
   214	  /\bdependents?\b/i,
   215	  /\bwhat\s+extends\b/i,
   216	];
   217	
   218	function extractResultRowsFromContextResponse(responseText: string): Array<Record<string, unknown>> {
   219	  try {
   220	    const parsed = JSON.parse(responseText) as Record<string, unknown>;
   221	    const outerData = parsed?.data as Record<string, unknown> | undefined;
   222	
   223	    const directRows = Array.isArray(outerData?.results)
   224	      ? outerData.results as Array<Record<string, unknown>>
   225	      : null;
   226	    if (directRows) {
   227	      return directRows;
   228	    }
   229	
   230	    const nestedContent = Array.isArray(outerData?.content)
   231	      ? outerData.content as Array<{ type?: string; text?: string }>
   232	      : [];
   233	    const nestedText = nestedContent[0]?.text;
   234	    if (typeof nestedText !== 'string' || nestedText.length === 0) {
   235	      return [];
   236	    }
   237	
   238	    const nestedEnvelope = JSON.parse(nestedText) as Record<string, unknown>;
   239	    const nestedData = nestedEnvelope?.data as Record<string, unknown> | undefined;
   240	    return Array.isArray(nestedData?.results)
   241	      ? nestedData.results as Array<Record<string, unknown>>
   242	      : [];
   243	  } catch {
   244	    return [];
   245	  }
   246	}
   247	
   248	function extractStrategyError(result: ContextResult): StrategyErrorPayload | null {
   249	  if ((result as Record<string, unknown>).isError !== true) {
   250	    return null;
   251	  }
   252	
   253	  const content = Array.isArray((result as Record<string, unknown>).content)
   254	    ? ((result as Record<string, unknown>).content as Array<{ text?: string }>)
   255	    : [];
   256	  const responseText = content[0]?.text;
   257	  if (typeof responseText !== 'string' || responseText.length === 0) {
   258	    return {
   259	      error: 'Context strategy failed',
   260	      code: 'E_STRATEGY',

codex
Public’s search stack is much more advanced than the phase brief implies: it already has explicit vector, BM25, FTS5, graph, adaptive fusion, deep query expansion, and a second-stage ranking layer. I’m drilling into the exact fusion code now so the final findings stay precise about what Mnemosyne contributes versus what Public already surpasses.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '320,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   320	/**
   321	 * Search the BM25 index with optional spec folder filtering.
   322	 * @param query - The search query string.
   323	 * @param options - Optional limit and specFolder filter.
   324	 * @returns Array of BM25-scored results tagged with source 'bm25'.
   325	 */
   326	function bm25Search(
   327	  query: string,
   328	  options: { limit?: number; specFolder?: string } = {}
   329	): HybridSearchResult[] {
   330	  if (!isBm25Enabled()) {
   331	    console.warn('[hybrid-search] BM25 not enabled — returning empty bm25Search results');
   332	    return [];
   333	  }
   334	
   335	  const { limit = DEFAULT_LIMIT, specFolder } = options;
   336	
   337	  try {
   338	    const index = getIndex();
   339	    const results = index.search(query, limit);
   340	
   341	    // BM25 document IDs are stringified
   342	    // Numeric memory IDs (e.g., "42"), not spec folder paths. The old filter compared
   343	    // R.id against specFolder which never matched. Use DB lookup to resolve spec_folder.
   344	
   345	    // B7 FIX: Batch-resolve spec folders for all result IDs (was N+1 individual queries)
   346	    // T72 SECURITY: Spec-folder scope MUST fail closed — any error in scope
   347	    // resolution returns [] rather than leaking unscoped BM25 candidates.
   348	    let specFolderMap: Map<number, string | null> | null = null;
   349	    if (specFolder) {
   350	      if (!db) {
   351	        const error = new Error('Database unavailable for spec-folder scope lookup');
   352	        console.warn('[BM25] Spec-folder scope lookup failed, returning empty scoped results:', error);
   353	        return [];
   354	      }
   355	
   356	      try {
   357	        const ids = results.map((r: { id: string }) => Number(r.id));
   358	        if (ids.length === 0) {
   359	          return [];
   360	        }
   361	        const placeholders = ids.map(() => '?').join(',');
   362	        const rows = db.prepare(
   363	          `SELECT id, spec_folder FROM memory_index WHERE id IN (${placeholders})`
   364	        ).all(...ids) as Array<{ id: number; spec_folder: string | null }>;
   365	        specFolderMap = new Map();
   366	        for (const row of rows) {
   367	          specFolderMap.set(row.id, row.spec_folder);
   368	        }
   369	      } catch (error: unknown) {
   370	        console.warn('[BM25] Spec-folder scope lookup failed, returning empty scoped results:', error);
   371	        return [];
   372	      }
   373	
   374	      // T72 DEFENSE-IN-DEPTH: If specFolder was requested but specFolderMap
   375	      // is still null after the resolution block, something unexpected happened.
   376	      // Fail closed rather than falling through to unscoped results.
   377	      if (!specFolderMap) {
   378	        const error = new Error('specFolderMap unexpectedly null after scope resolution');
   379	        console.warn('[BM25] Spec-folder scope lookup failed, returning empty scoped results:', error);
   380	        return [];
   381	      }
   382	    }
   383	
   384	    return results
   385	      .filter((r: { id: string }) => {
   386	        if (!specFolder) return true;
   387	        if (!specFolderMap) return false;
   388	        const folder = specFolderMap.get(Number(r.id));
   389	        if (!folder) return false;
   390	        return folder === specFolder || folder.startsWith(specFolder + '/');
   391	      })
   392	      .map((r: { id: string; score: number }) => ({
   393	        ...r,
   394	        source: 'bm25',
   395	      }));
   396	  } catch (error: unknown) {
   397	    const msg = error instanceof Error ? error.message : String(error);
   398	    console.warn(`[hybrid-search] BM25 search failed: ${msg}`);
   399	    return [];
   400	  }
   401	}
   402	
   403	/**
   404	 * Check whether the BM25 index is populated and available for search.
   405	 * @returns True if the BM25 index exists and contains at least one document.
   406	 */
   407	function isBm25Available(): boolean {
   408	  if (!isBm25Enabled()) {
   409	    return false;
   410	  }
   411	
   412	  try {
   413	    const index = getIndex();
   414	    return index.getStats().documentCount > 0;
   415	  } catch (_err: unknown) {
   416	    // Swallow index-not-initialized errors; caller treats absence as unavailable
   417	    return false;
   418	  }
   419	}
   420	
   421	// 9. FTS SEARCH
   422	
   423	/**
   424	 * Check whether the FTS5 full-text search table exists in the database.
   425	 * @returns True if the memory_fts table exists in the connected database.
   426	 */
   427	function isFtsAvailable(): boolean {
   428	  if (!db) {
   429	    console.warn('[hybrid-search] db not initialized — isFtsAvailable returning false');
   430	    return false;
   431	  }
   432	
   433	  try {
   434	    const result = (db.prepare(`
   435	      SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'
   436	    `) as Database.Statement).get() as { name: string } | undefined;
   437	    return !!result;
   438	  } catch (_err: unknown) {
   439	    // Swallow DB errors; caller treats absence as unavailable
   440	    return false;
   441	  }
   442	}
   443	
   444	/**
   445	 * Run FTS5 full-text search with weighted BM25 scoring and optional spec folder filtering.
   446	 * @param query - The search query string.
   447	 * @param options - Optional limit, specFolder filter, and includeArchived flag.
   448	 * @returns Array of FTS-scored results tagged with source 'fts'.
   449	 */
   450	function ftsSearch(
   451	  query: string,
   452	  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
   453	): HybridSearchResult[] {
   454	  if (!db || !isFtsAvailable()) {
   455	    console.warn('[hybrid-search] db not initialized or FTS unavailable — returning empty ftsSearch results');
   456	    return [];
   457	  }
   458	
   459	  const { limit = DEFAULT_LIMIT, specFolder, includeArchived = false } = options;
   460	
   461	  try {
   462	    // C138-P2: Delegate to weighted BM25 FTS5 search from sqlite-fts.ts
   463	    // Uses bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) for per-column weighting
   464	    // (title 10x, trigger_phrases 5x, file_path 2x, content 1x)
   465	    // Filters: is_archived exclusion and spec_folder matching handled by fts5Bm25Search
   466	    const bm25Results = fts5Bm25Search(db, query, { limit, specFolder, includeArchived });
   467	
   468	    return bm25Results.map(row => ({
   469	      ...row,
   470	      id: row.id as number,
   471	      score: row.fts_score || 0,
   472	      source: 'fts',
   473	    }));
   474	  } catch (error: unknown) {
   475	    const msg = error instanceof Error ? error.message : String(error);
   476	    console.warn(`[hybrid-search] FTS search failed: ${msg}`);
   477	    return [];
   478	  }
   479	}
   480	
   481	// 10. COMBINED LEXICAL SEARCH
   482	
   483	/**
   484	 * Merge FTS and BM25 search results, deduplicating by ID and preferring FTS scores.
   485	 * @param query - The search query string.
   486	 * @param options - Optional limit, specFolder filter, and includeArchived flag.
   487	 * @returns Deduplicated array of merged results sorted by score descending.
   488	 */
   489	function combinedLexicalSearch(
   490	  query: string,
   491	  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
   492	): HybridSearchResult[] {
   493	  const ftsResults = ftsSearch(query, options);
   494	  const bm25Results = bm25Search(query, options);
   495	
   496	  // Merge by canonical ID, prefer FTS scores.
   497	  // CanonicalResultId() prevents duplicate rows when one channel emits
   498	  // Numeric IDs (42) and another emits string IDs ("42" or "mem:42").
   499	  const merged = new Map<string, HybridSearchResult>();
   500	
   501	  for (const r of ftsResults) {
   502	    merged.set(canonicalResultId(r.id), r);
   503	  }
   504	
   505	  for (const r of bm25Results) {
   506	    const canonicalId = canonicalResultId(r.id);
   507	    if (!merged.has(canonicalId)) {
   508	      merged.set(canonicalId, r);
   509	    }
   510	  }
   511	
   512	  return Array.from(merged.values())
   513	    .sort((a, b) => b.score - a.score)
   514	    .slice(0, options.limit || DEFAULT_LIMIT);
   515	}
   516	
   517	type RawChannelList = {
   518	  source: string;
   519	  results: Array<{ id: number | string; [key: string]: unknown }>;
   520	};
   521	
   522	function resolveRawCandidateScore(result: { score?: unknown; similarity?: unknown }): number {
   523	  if (typeof result.score === 'number' && Number.isFinite(result.score)) {
   524	    return result.score;
   525	  }
   526	  if (typeof result.similarity === 'number' && Number.isFinite(result.similarity)) {
   527	    return result.similarity / 100;
   528	  }
   529	  return 0;
   530	}
   531	
   532	function getCandidateSources(result: HybridSearchResult): string[] {
   533	  const sourceList = (result as { sources?: unknown }).sources;
   534	  if (Array.isArray(sourceList)) {
   535	    return sourceList.filter((value): value is string => typeof value === 'string');
   536	  }
   537	  return typeof result.source === 'string' && result.source.length > 0
   538	    ? [result.source]
   539	    : [];
   540	}
   541	
   542	function getCandidateSourceScores(result: HybridSearchResult): Record<string, number> {
   543	  const sourceScores = (result as { sourceScores?: unknown }).sourceScores;
   544	  if (sourceScores && typeof sourceScores === 'object' && !Array.isArray(sourceScores)) {
   545	    const normalizedScores: Record<string, number> = {};
   546	    for (const [source, score] of Object.entries(sourceScores as Record<string, unknown>)) {
   547	      if (typeof score === 'number' && Number.isFinite(score)) {
   548	        normalizedScores[source] = score;
   549	      }
   550	    }
   551	    return normalizedScores;
   552	  }
   553	
   554	  const fallbackScores: Record<string, number> = {};
   555	  const resultScore = typeof result.score === 'number' && Number.isFinite(result.score)
   556	    ? result.score
   557	    : 0;
   558	  for (const source of getCandidateSources(result)) {
   559	    fallbackScores[source] = resultScore;
   560	  }
   561	  return fallbackScores;
   562	}
   563	
   564	function mergeRawCandidate(
   565	  existing: HybridSearchResult | undefined,
   566	  incoming: HybridSearchResult
   567	): HybridSearchResult {
   568	  if (!existing) {
   569	    const sources = getCandidateSources(incoming);
   570	    const channelCount = sources.length;
   571	    return {
   572	      ...incoming,
   573	      sources,
   574	      channelCount,
   575	      sourceScores: getCandidateSourceScores(incoming),
   576	      channelAttribution: sources,
   577	    };
   578	  }
   579	
   580	  const existingScore = typeof existing.score === 'number' && Number.isFinite(existing.score)
   581	    ? existing.score
   582	    : 0;
   583	  const incomingScore = typeof incoming.score === 'number' && Number.isFinite(incoming.score)
   584	    ? incoming.score
   585	    : 0;
   586	  const primary = incomingScore > existingScore ? incoming : existing;
   587	  const secondary = primary === incoming ? existing : incoming;
   588	  const sources = Array.from(new Set([
   589	    ...getCandidateSources(existing),
   590	    ...getCandidateSources(incoming),
   591	  ]));
   592	  const channelCount = sources.length;
   593	  const crossChannelBonus = Math.min(0.06, 0.02 * Math.max(0, channelCount - 1));
   594	  const mergedScore = Math.max(0, Math.min(1, Math.max(existingScore, incomingScore) + crossChannelBonus));
   595	
   596	  return {
   597	    ...(secondary ?? {}),
   598	    ...primary,
   599	    score: mergedScore,
   600	    source: typeof primary.source === 'string' ? primary.source : (sources[0] ?? 'hybrid'),
   601	    sources,
   602	    channelCount,
   603	    sourceScores: {
   604	      ...getCandidateSourceScores(existing),
   605	      ...getCandidateSourceScores(incoming),
   606	    },
   607	    channelAttribution: sources,
   608	  };
   609	}
   610	
   611	function collectCandidatesFromLists(
   612	  lists: RawChannelList[],
   613	  limit?: number
   614	): HybridSearchResult[] {
   615	  const deduped = new Map<string, HybridSearchResult>();
   616	
   617	  for (const list of lists) {
   618	    if (!Array.isArray(list.results) || list.results.length === 0) continue;
   619	
   620	    const scored = list.results.map((result) => {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts | sed -n '140,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   140	}
   141	
   142	// ───────────────────────────────────────────────────────────────
   143	// 3. CORE FUNCTION
   144	
   145	// ───────────────────────────────────────────────────────────────
   146	/**
   147	 * Execute a weighted BM25 FTS5 search against memory_fts.
   148	 *
   149	 * Uses SQLite FTS5's built-in bm25() ranking function with
   150	 * per-column weights instead of the default `rank` pseudo-column.
   151	 * This gives title matches 10x weight, trigger_phrases 5x, etc.
   152	 *
   153	 * @param db - SQLite database connection
   154	 * @param query - Raw search query (will be sanitized)
   155	 * @param options - Search options (limit, specFolder, includeArchived)
   156	 * @returns Array of results with BM25 scores (higher = better)
   157	 * @example
   158	 * ```ts
   159	 * const rows = fts5Bm25Search(db, 'memory search', { limit: 10 });
   160	 * ```
   161	 */
   162	function fts5Bm25Search(
   163	  db: Database.Database,
   164	  query: string,
   165	  options: FtsBm25Options = {}
   166	): FtsBm25Result[] {
   167	  const { limit = 20, specFolder, includeArchived = false } = options;
   168	
   169	  // Sanitize via shared tokenizer, then wrap each token in quotes and join with OR for recall
   170	  const tokens = normalizeLexicalQueryTokens(query).fts;
   171	  const sanitized = tokens
   172	    .map(t => (t.startsWith('"') && t.endsWith('"')) ? t : `"${t}"`)
   173	    .join(' OR ');
   174	
   175	  if (!sanitized) {
   176	    setLastLexicalCapabilitySnapshot(probeFts5Capability(db));
   177	    return [];
   178	  }
   179	
   180	  const folderFilter = specFolder
   181	    ? 'AND (m.spec_folder = ? OR m.spec_folder LIKE ? || "/%")'
   182	    : '';
   183	  const archivalFilter = !includeArchived
   184	    ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)'
   185	    : '';
   186	  const deprecatedTierFilter =
   187	    "AND (m.importance_tier IS NULL OR m.importance_tier != 'deprecated')";
   188	
   189	  const params: (string | number)[] = specFolder
   190	    ? [sanitized, specFolder, specFolder, limit]
   191	    : [sanitized, limit];
   192	
   193	  // Bm25() returns negative scores (lower = better), so we negate
   194	  // To produce positive scores where higher = better match.
   195	  const [w0, w1, w2, w3] = BM25_FTS5_WEIGHTS;
   196	  const sql = `
   197	    SELECT m.*, -bm25(memory_fts, ${w0}, ${w1}, ${w2}, ${w3}) AS fts_score
   198	    FROM memory_fts
   199	    JOIN memory_index m ON m.id = memory_fts.rowid
   200	    WHERE memory_fts MATCH ?
   201	      ${folderFilter}
   202	      ${archivalFilter}
   203	      ${deprecatedTierFilter}
   204	    ORDER BY fts_score DESC
   205	    LIMIT ?
   206	  `;
   207	
   208	  const capability = probeFts5Capability(db);
   209	  setLastLexicalCapabilitySnapshot(capability);
   210	  if (capability.fallbackState !== 'ok') {
   211	    console.warn(`[sqlite-fts] FTS5 unavailable (${capability.fallbackState}); returning empty lexical lane results`);
   212	    return [];
   213	  }
   214	
   215	  try {
   216	    const rows = (db.prepare(sql) as Database.Statement).all(
   217	      ...params
   218	    ) as Array<Record<string, unknown>>;
   219	
   220	    const normalizedRows = rows.map(row => ({
   221	      ...row,
   222	      id: row.id as number,
   223	      fts_score: (row.fts_score as number) || 0,
   224	    }));
   225	    setLastLexicalCapabilitySnapshot({
   226	      lexicalPath: 'fts5',
   227	      fallbackState: 'ok',
   228	    });
   229	    return normalizedRows;
   230	  } catch (error: unknown) {
   231	    const msg = error instanceof Error ? error.message : String(error);
   232	    const failureSnapshot: LexicalCapabilitySnapshot = isNoSuchModuleFts5Error(error)
   233	      ? {
   234	          lexicalPath: 'unavailable',
   235	          fallbackState: 'no_such_module_fts5',
   236	        }
   237	      : isBm25RuntimeFailure(error)
   238	        ? {
   239	            lexicalPath: 'unavailable',
   240	            fallbackState: 'bm25_runtime_failure',

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '960,1265p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   960	    const canonicalId = canonicalResultId(r.id);
   961	    const existing = deduped.get(canonicalId);
   962	    if (!existing || r.score > existing.score) {
   963	      deduped.set(canonicalId, r);
   964	    }
   965	  }
   966	
   967	  return Array.from(deduped.values())
   968	    .sort((a, b) => b.score - a.score)
   969	    .slice(0, limit);
   970	}
   971	
   972	/**
   973	 * Enhanced hybrid search with RRF fusion.
   974	 * All search channels use synchronous better-sqlite3; sequential execution
   975	 * is correct — Promise.all would add overhead without achieving parallelism.
   976	 */
   977	async function hybridSearchEnhanced(
   978	  query: string,
   979	  embedding: Float32Array | number[] | null,
   980	  options: HybridSearchOptions = {}
   981	): Promise<HybridSearchResult[]> {
   982	  const execution = await collectAndFuseHybridResults(query, embedding, options);
   983	  if (execution) {
   984	    if (options.stopAfterFusion) {
   985	      return applyResultLimit(execution.fusedResults, options.limit);
   986	    }
   987	
   988	    return enrichFusedResults(query, execution, options);
   989	  }
   990	
   991	  return hybridSearch(query, embedding, options);
   992	}
   993	
   994	async function collectAndFuseHybridResults(
   995	  query: string,
   996	  embedding: Float32Array | number[] | null,
   997	  options: HybridSearchOptions = {}
   998	): Promise<HybridFusionExecution | null> {
   999	  try {
  1000	    const evaluationMode = options.evaluationMode === true;
  1001	    const lists: HybridFusionExecution['lists'] = [];
  1002	
  1003	    // Pipeline metadata collector (populated by flag-gated stages)
  1004	    const s3meta: Sprint3PipelineMeta = {};
  1005	
  1006	    // -- Stage A: Query Classification + Routing (SPECKIT_COMPLEXITY_ROUTER) --
  1007	    // When enabled, classifies query complexity and restricts channels to a
  1008	    // Subset (e.g., simple queries skip graph+degree). When disabled, all channels run.
  1009	    const routeResult = routeQuery(query, options.triggerPhrases);
  1010	    const allPossibleChannels: ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'];
  1011	    const activeChannels = options.forceAllChannels
  1012	      ? new Set<ChannelName>(allPossibleChannels)
  1013	      : new Set<ChannelName>(routeResult.channels);
  1014	
  1015	    // Respect explicit caller channel disables across both the primary route and
  1016	    // every fallback tier. useGraph=false also disables the dependent degree lane.
  1017	    const allowedChannels = getAllowedChannels(options);
  1018	    for (const channel of allPossibleChannels) {
  1019	      if (!allowedChannels.has(channel)) activeChannels.delete(channel);
  1020	    }
  1021	
  1022	    const skippedChannels = allPossibleChannels.filter(ch => !activeChannels.has(ch));
  1023	
  1024	    if (skippedChannels.length > 0) {
  1025	      s3meta.routing = {
  1026	        tier: routeResult.tier,
  1027	        channels: routeResult.channels,
  1028	        skippedChannels,
  1029	        featureFlagEnabled: isComplexityRouterEnabled(),
  1030	        confidence: routeResult.classification.confidence,
  1031	        features: routeResult.classification.features as Record<string, unknown>,
  1032	      };
  1033	    }
  1034	
  1035	    // -- Stage E: Dynamic Token Budget (SPECKIT_DYNAMIC_TOKEN_BUDGET) --
  1036	    // Compute tier-aware budget early so it's available for downstream truncation.
  1037	    // When disabled, getDynamicTokenBudget returns the default 4000 budget with applied=false.
  1038	    const budgetResult = getDynamicTokenBudget(routeResult.tier);
  1039	    if (budgetResult.applied && !evaluationMode) {
  1040	      s3meta.tokenBudget = {
  1041	        tier: budgetResult.tier,
  1042	        budget: budgetResult.budget,
  1043	        applied: budgetResult.applied,
  1044	        featureFlagEnabled: isDynamicTokenBudgetEnabled(),
  1045	        configValues: DEFAULT_TOKEN_BUDGET_CONFIG as unknown as Record<string, number>,
  1046	        // headerOverhead and adjustedBudget are patched in below after they are computed
  1047	        headerOverhead: 0,
  1048	        adjustedBudget: budgetResult.budget,
  1049	      };
  1050	    }
  1051	
  1052	    // Channel results collected independently, merged after all complete
  1053	    let semanticResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [];
  1054	    let ftsChannelResults: HybridSearchResult[] = [];
  1055	    let bm25ChannelResults: HybridSearchResult[] = [];
  1056	    const vectorEmbeddingCache = new Map<number, Float32Array>();
  1057	
  1058	    // All channels use synchronous better-sqlite3; sequential execution
  1059	    // Is correct — Promise.all adds overhead without parallelism.
  1060	
  1061	    // Vector channel — gated by query-complexity routing
  1062	    if (activeChannels.has('vector') && embedding && vectorSearchFn) {
  1063	      try {
  1064	        const vectorResults = vectorSearchFn(embedding, {
  1065	          limit: options.limit || DEFAULT_LIMIT,
  1066	          specFolder: options.specFolder,
  1067	          minSimilarity: options.minSimilarity || 0,
  1068	          includeConstitutional: false,
  1069	          includeArchived: options.includeArchived || false,
  1070	          includeEmbeddings: true,
  1071	        });
  1072	        semanticResults = vectorResults.map((r: Record<string, unknown>): { id: number | string; source: string; [key: string]: unknown } => ({
  1073	          ...r,
  1074	          id: r.id as number | string,
  1075	          source: 'vector',
  1076	        }));
  1077	        for (const result of semanticResults) {
  1078	          if (typeof result.id !== 'number') continue;
  1079	          const embeddingCandidate = toEmbeddingBufferView(
  1080	            (result as Record<string, unknown>).embedding
  1081	            ?? (result as Record<string, unknown>).embeddingBuffer
  1082	          );
  1083	          if (embeddingCandidate) {
  1084	            vectorEmbeddingCache.set(result.id, embeddingCandidate);
  1085	          }
  1086	        }
  1087	        lists.push({ source: 'vector', results: semanticResults, weight: 1.0 });
  1088	      } catch (_err: unknown) {
  1089	        // Non-critical — vector channel failure does not block pipeline
  1090	        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
  1091	      }
  1092	    }
  1093	
  1094	    // FTS channel (internal error handling in ftsSearch) — gated by query-complexity routing
  1095	    if (activeChannels.has('fts')) {
  1096	      ftsChannelResults = ftsSearch(query, options);
  1097	      if (ftsChannelResults.length > 0) {
  1098	        // FTS weight reduced to 0.3 after ablation showed 0.8 was harmful,
  1099	        // flooding top-K with noisy lexical matches despite its exact-match value.
  1100	        lists.push({ source: 'fts', results: ftsChannelResults, weight: 0.3 });
  1101	      }
  1102	    }
  1103	
  1104	    // BM25 channel (internal error handling in bm25Search) — gated by query-complexity routing
  1105	    if (activeChannels.has('bm25')) {
  1106	      bm25ChannelResults = bm25Search(query, options);
  1107	      if (bm25ChannelResults.length > 0) {
  1108	        // BM25 weight 0.6 is lowest lexical channel — in-memory BM25 index
  1109	        // Has less precise scoring than SQLite FTS5 BM25; kept for coverage breadth.
  1110	        lists.push({ source: 'bm25', results: bm25ChannelResults, weight: 0.6 });
  1111	      }
  1112	    }
  1113	
  1114	    // Graph channel — gated by query-complexity routing
  1115	    const useGraph = (options.useGraph !== false) && activeChannels.has('graph');
  1116	    if (useGraph && graphSearchFn) {
  1117	      try {
  1118	        graphMetrics.totalQueries++; // counted only if channel executes
  1119	        const graphResults = graphSearchFn(query, {
  1120	          limit: options.limit || DEFAULT_LIMIT,
  1121	          specFolder: options.specFolder,
  1122	          intent: options.intent,
  1123	        });
  1124	        if (graphResults.length > 0) {
  1125	          graphMetrics.graphHits++;
  1126	          lists.push({ source: 'graph', results: graphResults.map((r: Record<string, unknown>) => ({
  1127	            ...r,
  1128	            id: r.id as number | string,
  1129	          })), weight: 0.5 });
  1130	        }
  1131	      } catch (_err: unknown) {
  1132	        // Non-critical — graph channel failure does not block pipeline
  1133	        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
  1134	      }
  1135	    }
  1136	
  1137	    // Degree channel re-ranks based on causal-edge connectivity.
  1138	    // Graduated: default-ON. Set SPECKIT_DEGREE_BOOST=false to disable.
  1139	    // Degree channel — also gated by query-complexity routing
  1140	    if (activeChannels.has('degree') && db && isDegreeBoostEnabled()) {
  1141	      try {
  1142	        // Collect all numeric IDs from existing channels
  1143	        const allResultIds = new Set<number>();
  1144	        for (const list of lists) {
  1145	          for (const r of list.results) {
  1146	            const id = r.id;
  1147	            if (typeof id === 'number') allResultIds.add(id);
  1148	          }
  1149	        }
  1150	
  1151	        if (allResultIds.size > 0) {
  1152	          const degreeScores = computeDegreeScores(db, Array.from(allResultIds));
  1153	
  1154	          // Build a ranked list sorted by degree score (highest first)
  1155	          const degreeItems: Array<{ id: number; degreeScore: number }> = [];
  1156	          for (const [idStr, score] of degreeScores) {
  1157	            const numId = Number(idStr);
  1158	            if (score > 0 && !isNaN(numId)) {
  1159	              degreeItems.push({ id: numId, degreeScore: score });
  1160	            }
  1161	          }
  1162	          degreeItems.sort((a, b) => b.degreeScore - a.degreeScore);
  1163	
  1164	          if (degreeItems.length > 0) {
  1165	            lists.push({
  1166	              source: 'degree',
  1167	              results: degreeItems.map(item => ({
  1168	                id: item.id,
  1169	                degreeScore: item.degreeScore,
  1170	              })),
  1171	              weight: DEGREE_CHANNEL_WEIGHT,
  1172	            });
  1173	          }
  1174	        }
  1175	      } catch (_err: unknown) {
  1176	        // Non-critical — degree channel failure does not block pipeline
  1177	        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
  1178	      }
  1179	    }
  1180	
  1181	    // Merge keyword results after all channels complete
  1182	    const keywordResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [
  1183	      ...ftsChannelResults,
  1184	      ...bm25ChannelResults,
  1185	    ];
  1186	
  1187	    if (options.skipFusion) {
  1188	      return {
  1189	        evaluationMode,
  1190	        intent: options.intent || classifyIntent(query).intent,
  1191	        lists,
  1192	        routeResult,
  1193	        budgetResult,
  1194	        s3meta,
  1195	        vectorEmbeddingCache,
  1196	        fusedResults: collectCandidatesFromLists(
  1197	          lists.filter((list) => list.source !== 'degree'),
  1198	          options.limit ?? DEFAULT_LIMIT
  1199	        ),
  1200	      };
  1201	    }
  1202	
  1203	    if (lists.length === 0) {
  1204	      return null;
  1205	    }
  1206	
  1207	    // Track multi-source and graph-only results
  1208	    const sourceMap = new Map<string, Set<string>>();
  1209	    for (const list of lists) {
  1210	      for (const r of list.results) {
  1211	        const key = canonicalResultId(r.id);
  1212	        if (!sourceMap.has(key)) sourceMap.set(key, new Set());
  1213	        sourceMap.get(key)!.add(list.source); // non-null safe: has() guard above guarantees entry exists
  1214	      }
  1215	    }
  1216	    for (const [, sources] of sourceMap) {
  1217	      if (sources.size > 1) graphMetrics.multiSourceResults++;
  1218	      if (sources.size === 1 && sources.has('graph')) graphMetrics.graphOnlyResults++;
  1219	    }
  1220	
  1221	    // C138/T315: Build weighted fusion lists once from lightweight adaptive
  1222	    // weights, avoiding the heavier hybridAdaptiveFuse() standard-first path.
  1223	    const intent = options.intent || classifyIntent(query).intent;
  1224	    const adaptiveEnabled = isAdaptiveFusionEnabled();
  1225	    const fusionWeights = adaptiveEnabled
  1226	      ? getAdaptiveWeights(intent)
  1227	      : { semanticWeight: 1.0, keywordWeight: 1.0, recencyWeight: 0 };
  1228	    const { semanticWeight, keywordWeight, graphWeight: adaptiveGraphWeight } = fusionWeights;
  1229	    const keywordFusionResults = keywordResults.map((result) => ({
  1230	      ...result,
  1231	      source: 'keyword',
  1232	    }));
  1233	    const fusionLists = lists
  1234	      .filter((list) => list.source !== 'fts' && list.source !== 'bm25')
  1235	      .map((list) => {
  1236	        if (list.source === 'vector') {
  1237	          return { ...list, weight: semanticWeight };
  1238	        }
  1239	        if (list.source === 'graph' && typeof adaptiveGraphWeight === 'number') {
  1240	          return { ...list, weight: adaptiveGraphWeight };
  1241	        }
  1242	        return { ...list };
  1243	      });
  1244	
  1245	    if (keywordFusionResults.length > 0 && keywordWeight > 0) {
  1246	      fusionLists.push({
  1247	        source: 'keyword',
  1248	        results: keywordFusionResults,
  1249	        weight: keywordWeight,
  1250	      });
  1251	    }
  1252	
  1253	    const fused = fuseResultsMulti(fusionLists);
  1254	
  1255	    const fusedResults = fused.map(toHybridResult).map((row) => {
  1256	      const rowRecord = row as Record<string, unknown>;
  1257	      if (rowRecord.parentMemoryId !== undefined) return row;
  1258	      const normalizedParentMemoryId = rowRecord.parent_id ?? rowRecord.parentId;
  1259	      if (normalizedParentMemoryId === undefined) return row;
  1260	      return {
  1261	        ...row,
  1262	        parentMemoryId: normalizedParentMemoryId,
  1263	      };
  1264	    });
  1265	

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Query Router
     3	// ───────────────────────────────────────────────────────────────
     4	// Tier-to-channel-subset routing for query complexity
     5	// Maps classifier tiers to channel subsets for selective pipeline execution.
     6	
     7	import {
     8	  classifyQueryComplexity,
     9	  isComplexityRouterEnabled,
    10	  type QueryComplexityTier,
    11	  type ClassificationResult,
    12	} from './query-classifier.js';
    13	import { getStrategyForQuery } from './artifact-routing.js';
    14	import { classifyIntent } from './intent-classifier.js';
    15	
    16	// Feature catalog: Query complexity router
    17	
    18	
    19	/* ───────────────────────────────────────────────────────────────
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
    81	 * fallback channels (vector, fts) until the minimum is met.
    82	 */
    83	function enforceMinimumChannels(channels: ChannelName[]): ChannelName[] {
    84	  const result = [...new Set(channels)] as ChannelName[];
    85	  if (result.length >= MIN_CHANNELS) return result;
    86	
    87	  for (const fallback of FALLBACK_CHANNELS) {
    88	    if (result.length >= MIN_CHANNELS) break;
    89	    if (!result.includes(fallback)) {
    90	      result.push(fallback);
    91	    }
    92	  }
    93	
    94	  return result;
    95	}
    96	
    97	/**
    98	 * Get the channel subset for a given complexity tier.
    99	 *
   100	 * @param tier - The classified query complexity tier
   101	 * @param config - Optional custom routing config (defaults to DEFAULT_ROUTING_CONFIG)
   102	 * @returns Array of channel names to execute, guaranteed minimum 2 channels
   103	 */
   104	function getChannelSubset(
   105	  tier: QueryComplexityTier,
   106	  config?: ChannelRoutingConfig,
   107	): ChannelName[] {
   108	  const effectiveConfig = config ?? DEFAULT_ROUTING_CONFIG;
   109	  const channels = effectiveConfig[tier] ?? [...ALL_CHANNELS];
   110	  return enforceMinimumChannels([...channels]);
   111	}
   112	
   113	function shouldPreserveBm25(query: string): boolean {
   114	  const intent = classifyIntent(query).intent;
   115	  if (intent === 'find_spec' || intent === 'find_decision') {
   116	    return true;
   117	  }
   118	
   119	  const artifact = getStrategyForQuery(query).detectedClass;
   120	  return BM25_PRESERVING_ARTIFACTS.has(artifact);
   121	}
   122	
   123	/* ───────────────────────────────────────────────────────────────
   124	   4. CONVENIENCE: CLASSIFY + ROUTE
   125	----------------------------------------------------------------*/
   126	
   127	/**
   128	 * Classify a query's complexity and route it to the appropriate channel subset
   129	 * in a single call.
   130	 *
   131	 * When the SPECKIT_COMPLEXITY_ROUTER feature flag is disabled, returns all 5 channels
   132	 * (full pipeline) regardless of classification result.
   133	 *
   134	 * @param query - The search query to classify and route
   135	 * @param triggerPhrases - Optional trigger phrases for simple-tier classification
   136	 * @returns RouteResult with tier, channels, and full classification details
   137	 */
   138	function routeQuery(
   139	  query: string,
   140	  triggerPhrases?: string[],
   141	): RouteResult {
   142	  const classification = classifyQueryComplexity(query, triggerPhrases);
   143	
   144	  // When feature flag is disabled, classifier returns 'complex' with 'fallback' confidence.
   145	  // In that case, always return all channels (full pipeline — safe default).
   146	  if (!isComplexityRouterEnabled()) {
   147	    return {
   148	      tier: classification.tier,
   149	      channels: [...ALL_CHANNELS],
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
   171	  // Types
   172	  type ChannelName,
   173	  type ChannelRoutingConfig,
   174	  type RouteResult,
   175	
   176	  // Constants
   177	  DEFAULT_ROUTING_CONFIG,
   178	  ALL_CHANNELS,
   179	  MIN_CHANNELS,
   180	  FALLBACK_CHANNELS,
   181	
   182	  // Functions
   183	  getChannelSubset,
   184	  routeQuery,
   185	
   186	  // Internal helpers (exported for testing)
   187	  enforceMinimumChannels,
   188	};

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

2026-04-10T19:35:58.542299Z ERROR codex_core::tools::router: error=failed to parse function arguments: missing field `cell_id` at line 1 column 61
codex
I’ve got the core contrast now: Mnemosyne’s wrapper mostly forwards one quoted query into a hidden backend, while Public explicitly exposes and layers multiple retrieval channels plus routing and post-fusion scoring. I’m doing one semantic pass and one targeted read on Public’s retrieval internals to make sure I’m not missing a hidden shortcut or ranking nuance before I synthesize the findings.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | sed -n '600,930p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   761	          // Fall through to single hybrid search below
   762	          channelCount = 1;
   763	          candidates = (await hybridSearch.collectRawCandidates(
   764	            query,
   765	            effectiveEmbedding,
   766	            { limit, specFolder, includeArchived }
   767	          )) as PipelineRow[];
   768	        }
   769	      } else {
   770	        // ExpandQuery returned only the original; treat as standard hybrid
   771	        channelCount = 1;
   772	        candidates = (await hybridSearch.collectRawCandidates(
   773	          query,
   774	          effectiveEmbedding,
   775	          { limit, specFolder, includeArchived }
   776	        )) as PipelineRow[];
   777	      }
   778	
   779	      } // end: if (candidates.length === 0)
   780	    } else {
   781	      // -- R12: Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION) --
   782	      //
   783	      // When R12 is enabled and R15 does not classify the query as "simple",
   784	      // We expand the query using embedding similarity to find related terms
   785	      // From the memory index. The expanded query is used as an additional
   786	      // Hybrid search channel whose results are merged with the baseline.
   787	      //
   788	      // Mutual exclusion: isExpansionActive() returns false when R15 classifies
   789	      // The query as "simple", suppressing expansion with zero added latency.
   790	
   791	      let r12ExpansionApplied = false;
   792	
   793	      if (isEmbeddingExpansionEnabled() && isExpansionActive(query)) {
   794	        try {
   795	          // ExpandQueryWithEmbeddings requires a Float32Array; the effective
   796	          // Embedding may be a number[] when generated by some providers, so
   797	          // Convert if necessary before passing it in.
   798	          const expansionEmbedding: Float32Array =
   799	            effectiveEmbedding instanceof Float32Array
   800	              ? effectiveEmbedding
   801	              : Float32Array.from(effectiveEmbedding as number[]);
   802	
   803	          const expanded = await expandQueryWithEmbeddings(query, expansionEmbedding, {
   804	            limit: DEFAULT_EXPANSION_CANDIDATE_LIMIT,
   805	          });
   806	
   807	          // Only run an extra channel if the expansion actually produced new terms
   808	          if (expanded.expanded.length > 0 && expanded.combinedQuery !== query) {
   809	            // Run the baseline and the expanded query in parallel
   810	            const [baselineResults, expansionResults] = await Promise.all([
   811	              hybridSearch.collectRawCandidates(
   812	                query,
   813	                effectiveEmbedding,
   814	                { limit, specFolder, includeArchived }
   815	              ).catch((err: unknown): PipelineRow[] => {
   816	                console.warn(
   817	                  '[stage1-candidate-gen] Baseline candidate collection failed:',
   818	                  err instanceof Error ? err.message : String(err)
   819	                );
   820	                return [];
   821	              }),
   822	              embeddings.generateQueryEmbedding(expanded.combinedQuery).then(
   823	                async (expandedEmb): Promise<PipelineRow[]> => {
   824	                  if (!expandedEmb) {
   825	                    console.warn('[stage1-candidate-gen] Expanded query embedding generation returned null');
   826	                    return [];
   827	                  }
   828	                  return hybridSearch.collectRawCandidates(
   829	                    expanded.combinedQuery,
   830	                    expandedEmb,
   831	                    { limit, specFolder, includeArchived }
   832	                  ) as Promise<PipelineRow[]>;
   833	                }
   834	              ).catch((err: unknown): PipelineRow[] => {
   835	                console.warn(
   836	                  '[stage1-candidate-gen] Expansion candidate collection failed:',
   837	                  err instanceof Error ? err.message : String(err)
   838	                );
   839	                return [];
   840	              }),
   841	            ]);
   842	
   843	            channelCount = 2;
   844	            r12ExpansionApplied = true;
   845	
   846	            // Merge both result sets, deduplicate by id, baseline-first ordering
   847	            // So baseline scores dominate when the same memory appears in both.
   848	            candidates = mergeCandidateBatches([
   849	              { label: query, rows: baselineResults as PipelineRow[] },
   850	              { label: expanded.combinedQuery, rows: expansionResults as PipelineRow[] },
   851	            ]);
   852	
   853	            if (trace) {
   854	              addTraceEntry(trace, 'candidate', channelCount, candidates.length, 0, {
   855	                channel: 'r12-embedding-expansion',
   856	                expandedTerms: expanded.expanded,
   857	                combinedQuery: expanded.combinedQuery,
   858	              });
   859	            }
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Bm25 Index
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: BM25 trigger phrase re-index gate
     5	import type Database from 'better-sqlite3';
     6	import { normalizeContentForBM25 } from '../parsing/content-normalizer.js';
     7	
     8	// ───────────────────────────────────────────────────────────────
     9	// 1. INTERFACES
    10	
    11	// ───────────────────────────────────────────────────────────────
    12	interface BM25SearchResult {
    13	  id: string;
    14	  /**
    15	   * BM25 term-frequency relevance score (unbounded, typically 0-25+).
    16	   * Higher = better lexical match. Not directly comparable to vector similarity
    17	   * scores; use min-max normalization or RRF when combining with other methods.
    18	   */
    19	  score: number;
    20	}
    21	
    22	interface BM25Stats {
    23	  documentCount: number;
    24	  termCount: number;
    25	  avgDocLength: number;
    26	}
    27	
    28	interface BM25DocumentSource {
    29	  title?: string | null;
    30	  content_text?: string | null;
    31	  trigger_phrases?: string | string[] | null;
    32	  file_path?: string | null;
    33	}
    34	
    35	/* ───────────────────────────────────────────────────────────────
    36	   1B. CONSTANTS & FEATURE FLAG
    37	   ──────────────────────────────────────────────────────────────── */
    38	
    39	const DEFAULT_K1 = 1.2;
    40	const DEFAULT_B = 0.75;
    41	const BM25_WARMUP_BATCH_SIZE = 250;
    42	const BM25_ENABLED_VALUES = new Set(['1', 'true', 'yes', 'on', 'experimental', 'fallback']);
    43	const BM25_DISABLED_VALUES = new Set(['0', 'false', 'no', 'off']);
    44	
    45	/**
    46	 * C138: Field weight multipliers for weighted BM25 scoring.
    47	 * When indexing a document composed of multiple fields, multiply
    48	 * each field's token scores by the appropriate weight before
    49	 * accumulating the total document score.
    50	 *
    51	 * These weights are consumed by the FTS5 path in sqlite-fts.ts,
    52	 * not the in-memory BM25 engine in this file. Exported for shared access.
    53	 *
    54	 * title:           10.0 — exact title matches are the strongest signal
    55	 * trigger_phrases:  5.0 — curated keywords next most important
    56	 * content_generic:  2.0 — generic textual content (file_path, tags, etc.)
    57	 * body:             1.0 — baseline weight for full body / content_text
    58	 */
    59	const BM25_FTS5_WEIGHTS = [10.0, 5.0, 2.0, 1.0] as const;
    60	
    61	const BM25_FIELD_WEIGHTS: Record<string, number> = {
    62	  title: BM25_FTS5_WEIGHTS[0],
    63	  trigger_phrases: BM25_FTS5_WEIGHTS[1],
    64	  content_generic: BM25_FTS5_WEIGHTS[2],
    65	  body: BM25_FTS5_WEIGHTS[3],
    66	};
    67	
    68	/**
    69	 * Check whether the in-memory BM25 index is enabled.
    70	 *
    71	 * @returns `true` when BM25 indexing/search is enabled for the current process.
    72	 * @example
    73	 * ```ts
    74	 * if (isBm25Enabled()) {
    75	 *   getIndex();
    76	 * }
    77	 * ```
    78	 */
    79	function isBm25Enabled(): boolean {
    80	  const value = process.env.ENABLE_BM25?.trim().toLowerCase();
    81	  if (!value) return true; // enabled by default
    82	  if (BM25_DISABLED_VALUES.has(value)) return false;
    83	  return BM25_ENABLED_VALUES.has(value);
    84	}
    85	
    86	// ───────────────────────────────────────────────────────────────
    87	// 2. HELPERS
    88	
    89	// ───────────────────────────────────────────────────────────────
    90	const STOP_WORDS = new Set([
    91	  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    92	  'of', 'with', 'by', 'from', 'is', 'it', 'as', 'was', 'are', 'be',
    93	  'has', 'had', 'have', 'been', 'were', 'will', 'would', 'could', 'should',
    94	  'may', 'might', 'can', 'this', 'that', 'these', 'those', 'not', 'no',
    95	  'do', 'does', 'did', 'so', 'if', 'then', 'than', 'too', 'very',
    96	]);
    97	
    98	/**
    99	 * Apply lightweight stemming to a token for BM25 indexing and matching.
   100	 *
   101	 * @param word - Token to stem.
   102	 * @returns A lowercased token with simple suffix normalization applied.
   103	 * @example
   104	 * ```ts
   105	 * simpleStem('running');
   106	 * // 'run'
   107	 * ```
   108	 */
   109	function simpleStem(word: string): string {
   110	  let stem = word.toLowerCase();
   111	  let suffixRemoved = false;
   112	  // Simple suffix removal
   113	  if (stem.endsWith('ing') && stem.length > 5) { stem = stem.slice(0, -3); suffixRemoved = true; }
   114	  else if (stem.endsWith('tion') && stem.length > 6) { stem = stem.slice(0, -4); suffixRemoved = true; }
   115	  else if (stem.endsWith('ed') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
   116	  else if (stem.endsWith('ly') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
   117	  else if (stem.endsWith('es') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
   118	  else if (stem.endsWith('s') && stem.length > 3) { stem = stem.slice(0, -1); suffixRemoved = true; }
   119	  // Only deduplicate doubled consonants when a suffix was actually removed.
   120	  // Without this guard, original double consonants are incorrectly stripped:
   121	  // "bass" -> "bas", "jazz" -> "jaz", "bill" -> "bil" etc.
   122	  // Handle doubled consonants after suffix
   123	  // Removal. "running"→"runn"→"run", "stopped"→"stopp"→"stop". Check if last two chars
   124	  // Are identical consonants and deduplicate.
   125	  if (suffixRemoved && stem.length >= 3) {
   126	    const last = stem[stem.length - 1];
   127	    if (last === stem[stem.length - 2] && !/[aeiou]/.test(last)) {
   128	      stem = stem.slice(0, -1);
   129	    }
   130	  }
   131	  return stem;
   132	}
   133	
   134	function splitLexicalFragments(text: string): string[] {
   135	  if (!text || typeof text !== 'string') return [];
   136	
   137	  return text
   138	    .toLowerCase()
   139	    .replace(/[^a-z0-9\s-_]/g, ' ')
   140	    .split(/\s+/)
   141	    .map(t => t.trim())
   142	    .filter(Boolean);
   143	}
   144	
   145	/**
   146	 * Tokenize raw text into normalized BM25 terms.
   147	 *
   148	 * @param text - Input text to tokenize.
   149	 * @returns Stemmed, lowercased, stop-word-filtered terms.
   150	 * @example
   151	 * ```ts
   152	 * tokenize('The memory indexing pipeline');
   153	 * // ['memory', 'index', 'pipeline']
   154	 * ```
   155	 */
   156	function tokenize(text: string): string[] {
   157	  return splitLexicalFragments(text)
   158	    .filter(t => t.length >= 2 && !STOP_WORDS.has(t))
   159	    .map(simpleStem);
   160	}
   161	
   162	/**
   163	 * Count token frequency occurrences for BM25 scoring.
   164	 *
   165	 * @param tokens - Normalized tokens produced by {@link tokenize}.
   166	 * @returns A frequency map keyed by token text.
   167	 * @example
   168	 * ```ts
   169	 * getTermFrequencies(['memory', 'memory', 'search']).get('memory');
   170	 * // 2
   171	 * ```
   172	 */
   173	function getTermFrequencies(tokens: string[]): Map<string, number> {
   174	  const freq = new Map<string, number>();
   175	  for (const token of tokens) {
   176	    freq.set(token, (freq.get(token) || 0) + 1);
   177	  }
   178	  return freq;
   179	}
   180	
   181	function normalizeTriggerPhrasesForBM25(triggerPhrases: string | string[] | null | undefined): string {
   182	  if (Array.isArray(triggerPhrases)) {
   183	    return triggerPhrases
   184	      .filter((phrase): phrase is string => typeof phrase === 'string' && phrase.trim().length > 0)
   185	      .join(' ');
   186	  }
   187	
   188	  if (typeof triggerPhrases !== 'string') {
   189	    return '';
   190	  }
   191	
   192	  const trimmed = triggerPhrases.trim();
   193	  if (!trimmed) {
   194	    return '';
   195	  }
   196	
   197	  try {
   198	    const parsed = JSON.parse(trimmed) as unknown;
   199	    if (Array.isArray(parsed)) {
   200	      return parsed
   201	        .filter((phrase): phrase is string => typeof phrase === 'string' && phrase.trim().length > 0)
   202	        .join(' ');
   203	    }
   204	  } catch {
   205	    // Fall back to raw string when the database value is not JSON.
   206	  }
   207	
   208	  return trimmed;
   209	}
   210	
   211	function buildBm25DocumentText(row: BM25DocumentSource): string {
   212	  const textParts: string[] = [];
   213	
   214	  if (typeof row.title === 'string' && row.title.trim()) {
   215	    textParts.push(row.title.trim());
   216	  }
   217	
   218	  if (typeof row.content_text === 'string' && row.content_text.trim()) {
   219	    textParts.push(normalizeContentForBM25(row.content_text));
   220	  }
   221	
   222	  const triggerPhrases = normalizeTriggerPhrasesForBM25(row.trigger_phrases);
   223	  if (triggerPhrases) {
   224	    textParts.push(triggerPhrases);
   225	  }
   226	
   227	  if (typeof row.file_path === 'string' && row.file_path.trim()) {
   228	    textParts.push(row.file_path.trim());
   229	  }
   230	
   231	  return textParts.join(' ').trim();
   232	}
   233	
   234	// ───────────────────────────────────────────────────────────────
   235	// 3. BM25 INDEX CLASS
   236	
   237	// ───────────────────────────────────────────────────────────────
   238	class BM25Index {
   239	  private k1: number;
   240	  private b: number;
   241	  private documents: Map<string, { tokens: string[]; termFreq: Map<string, number> }>;
   242	  private documentFreq: Map<string, number>;
   243	  private totalDocLength: number;
   244	  private warmupHandle: ReturnType<typeof setTimeout> | null;
   245	  private warmupGeneration: number;
   246	
   247	  constructor(k1: number = DEFAULT_K1, b: number = DEFAULT_B) {
   248	    this.k1 = k1;
   249	    this.b = b;
   250	    this.documents = new Map();
   251	    this.documentFreq = new Map();
   252	    this.totalDocLength = 0;
   253	    this.warmupHandle = null;
   254	    this.warmupGeneration = 0;
   255	  }
   256	
   257	  addDocument(id: string, text: string): void {
   258	    const tokens = tokenize(text);
   259	    const termFreq = getTermFrequencies(tokens);
   260	

codex
The remaining gap I’m closing is query preprocessing. Mnemosyne mostly protects SQLite syntax by wrapping the full query in quotes, whereas Public actively tokenizes, sanitizes, expands, routes, and reweights queries before ranking. That difference is shaping the strongest search-mechanism findings so far.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '2090,2195p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts | sed -n '250,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  2090	    const key = canonicalResultId(r.id);
  2091	    const prev = byId.get(key);
  2092	    if (!prev || r.score > prev.score) {
  2093	      byId.set(key, r);
  2094	    }
  2095	  }
  2096	
  2097	  return Array.from(byId.values()).sort((a, b) => b.score - a.score);
  2098	}
  2099	
  2100	/**
  2101	 * PI-A2: Quality-aware 3-tier search fallback chain.
  2102	 *
  2103	 * TIER 1: hybridSearchEnhanced at minSimilarity=30
  2104	 *   → Pass if quality signal is healthy AND count >= 3
  2105	 *
  2106	 * TIER 2: hybridSearchEnhanced at minSimilarity=10, all allowed channels forced
  2107	 *   → Merge with Tier 1, dedup by id
  2108	 *   → Pass if quality signal is healthy AND count >= 3
  2109	 *
  2110	 * TIER 3: structuralSearch (pure SQL last-resort)
  2111	 *   → Merge with Tier 1+2 results after score calibration
  2112	 *   → Return capped set
  2113	 *
  2114	 * @param query - The search query string.
  2115	 * @param embedding - Optional embedding vector for semantic search.
  2116	 * @param options - Hybrid search configuration options.
  2117	 * @returns Results with _degradation metadata attached as non-enumerable property.
  2118	 */
  2119	async function searchWithFallbackTiered(
  2120	  query: string,
  2121	  embedding: Float32Array | number[] | null,
  2122	  options: HybridSearchOptions = {}
  2123	): Promise<HybridSearchResult[]> {
  2124	  const degradationEvents: DegradationEvent[] = [];
  2125	  const { stages } = await executeFallbackPlan(query, embedding, options, 'tiered');
  2126	  const tier1Stage = stages[0];
  2127	  const tier2Stage = stages[1];
  2128	  let results = tier1Stage?.results ?? [];
  2129	
  2130	  const tier1Trigger = checkDegradation(results);
  2131	  if (!tier1Trigger) {
  2132	    const finalTier1 = tier1Stage?.execution
  2133	      ? await enrichFusedResults(query, tier1Stage.execution, tier1Stage.options, results)
  2134	      : applyResultLimit(results, options.limit);
  2135	    // Tier 1 passed quality thresholds — attach empty degradation metadata
  2136	    Object.defineProperty(finalTier1, '_degradation', {
  2137	      value: degradationEvents,
  2138	      enumerable: false,
  2139	      configurable: true,
  2140	    });
  2141	    return finalTier1;
  2142	  }
  2143	
  2144	  // TIER 2: Widen search — lower similarity, force all channels
  2145	  const tier1CountBefore = results.length;
  2146	
  2147	  console.error(`[hybrid-search] Tier 1→2 degradation: ${tier1Trigger.reason} (topScore=${tier1Trigger.topScore.toFixed(3)}, count=${tier1Trigger.resultCount})`);
  2148	
  2149	  const tier2Results = tier2Stage?.results ?? [];
  2150	  results = mergeResults(results, tier2Results);
  2151	  degradationEvents.push({
  2152	    tier: 1,
  2153	    trigger: tier1Trigger,
  2154	    resultCountBefore: tier1CountBefore,
  2155	    resultCountAfter: results.length,
  2156	  });
  2157	
  2158	  const tier2Trigger = checkDegradation(results);
  2159	  if (!tier2Trigger) {
  2160	    const finalTier2 = tier2Stage?.execution
  2161	      ? await enrichFusedResults(query, tier2Stage.execution, tier2Stage.options, results)
  2162	      : applyResultLimit(results, options.limit);
  2163	    Object.defineProperty(finalTier2, '_degradation', {
  2164	      value: degradationEvents,
  2165	      enumerable: false,
  2166	      configurable: true,
  2167	    });
  2168	    return finalTier2;
  2169	  }
  2170	
  2171	  // TIER 3: Structural search (pure SQL last-resort)
  2172	  const tier2CountBefore = results.length;
  2173	
  2174	  console.error(`[hybrid-search] Tier 2→3 degradation: ${tier2Trigger.reason} (topScore=${tier2Trigger.topScore.toFixed(3)}, count=${tier2Trigger.resultCount})`);
  2175	
  2176	  const tier3Results = structuralSearch({ specFolder: options.specFolder, limit: options.limit });
  2177	  const calibratedTier3 = calibrateTier3Scores(results, tier3Results);
  2178	  results = mergeResults(results, calibratedTier3);
  2179	  degradationEvents.push({
  2180	    tier: 2,
  2181	    trigger: tier2Trigger,
  2182	    resultCountBefore: tier2CountBefore,
  2183	    resultCountAfter: results.length,
  2184	  });
  2185	
  2186	  const finalResults = tier2Stage?.execution
  2187	    ? await enrichFusedResults(query, tier2Stage.execution, tier2Stage.options, results)
  2188	    : applyResultLimit(results, options.limit);
  2189	
  2190	  Object.defineProperty(finalResults, '_degradation', {
  2191	    value: degradationEvents,
  2192	    enumerable: false,
  2193	    configurable: true,
  2194	  });
  2195	

 succeeded in 0ms:
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
   261	           ROUND((1 - sub.distance / 2) * 100, 2) as similarity
   262	    FROM (
   263	      SELECT m.*, vec_distance_cosine(v.embedding, ?) as distance,
   264	             ${decay_expr} as effective_importance
   265	      FROM memory_index m
   266	      JOIN active_memory_projection p ON p.active_memory_id = m.id
   267	      JOIN vec_memories v ON m.id = v.rowid
   268	      WHERE ${where_clauses.join(' AND ')}
   269	    ) sub
   270	    WHERE sub.distance <= ?
   271	    ORDER BY (sub.distance - (sub.effective_importance * 0.1)) ASC
   272	    LIMIT ?
   273	  `;
   274	
   275	  const rows = database.prepare(sql).all(...params);
   276	
   277	  const regular_results = (rows as MemoryRow[]).map((row: MemoryRow) => {
   278	    row.trigger_phrases = parse_trigger_phrases(row.trigger_phrases);
   279	    row.isConstitutional = row.importance_tier === 'constitutional';
   280	    return row;
   281	  });
   282	
   283	  return [...constitutional_results, ...regular_results];
   284	}
   285	
   286	/**
   287	 * Gets constitutional memories for prompt assembly.
   288	 * @param options - Retrieval options.
   289	 * @returns The constitutional memory rows.
   290	 */
   291	export function get_constitutional_memories_public(
   292	  options: { specFolder?: string | null; maxTokens?: number; includeArchived?: boolean } = {},
   293	  database: Database.Database = initialize_db(),
   294	): MemoryRow[] {
   295	  const { specFolder = null, maxTokens = 2000, includeArchived = false } = options;
   296	
   297	  let results = get_constitutional_memories(database, specFolder, includeArchived);
   298	
   299	  const TOKENS_PER_MEMORY = 100;
   300	  const max_count = Math.floor(maxTokens / TOKENS_PER_MEMORY);
   301	  if (results.length > max_count) {
   302	    results = results.slice(0, max_count);
   303	  }
   304	
   305	  return results;
   306	}
   307	
   308	/**
   309	 * Searches indexed memories with multiple concept embeddings.
   310	 * @param concept_embeddings - The concept embeddings to search with.
   311	 * @param options - Search options.
   312	 * @returns The matching memory rows.
   313	 * @throws {VectorIndexError} When concept count or embedding dimensions are invalid, or when store initialization fails.
   314	 * @example
   315	 * ```ts
   316	 * const rows = multi_concept_search([embA, embB], { limit: 8, specFolder: 'specs/001-demo' });
   317	 * ```
   318	 */
   319	export function multi_concept_search(
   320	  concept_embeddings: EmbeddingInput[],
   321	  options: { limit?: number; specFolder?: string | null; minSimilarity?: number; includeArchived?: boolean } = {}
   322	): MemoryRow[] {
   323	  const sqlite_vec = get_sqlite_vec_available();
   324	  if (!sqlite_vec) {
   325	    console.warn('[vector-index] Multi-concept search unavailable - sqlite-vec not loaded');
   326	    return [];
   327	  }
   328	
   329	  const database = initialize_db();
   330	
   331	  const concepts = concept_embeddings;
   332	  if (!Array.isArray(concepts) || concepts.length < 2 || concepts.length > 5) {
   333	    throw new VectorIndexError('Multi-concept search requires 2-5 concepts', VectorIndexErrorCode.QUERY_FAILED);
   334	  }
   335	
   336	  const expected_dim = get_embedding_dim();
   337	  for (const emb of concepts) {
   338	    if (!emb || emb.length !== expected_dim) {
   339	      throw new VectorIndexError(
   340	        `Invalid embedding dimension: expected ${expected_dim}, got ${emb?.length}`,

codex
I’ve finished the evidence collection. One last small step: I’m grabbing the exact memory lines I used for context provenance, then I’ll synthesize the iteration output in the exact format you requested, keeping it read-only and grounded in code evidence.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '452,468p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   452	### keywords
   453	
   454	- 041-sk-recursive-agent-loop, packet-rename, descriptions.json, validate.sh --strict, historical research memory rewrite, skip spec folder
   455	
   456	## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
   457	
   458	### rollout_summary_files
   459	
   460	- rollout_summaries/2026-04-03T10-18-09-ppdB-rename_023_hybrid_rag_fusion_refinement.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T12-18-09-019d52d9-a8b9-71c3-949c-f6870aee05a7.jsonl, updated_at=2026-04-03T10:43:47+00:00, thread_id=019d52d9-a8b9-71c3-949c-f6870aee05a7)
   461	
   462	### keywords
   463	
   464	- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
   465	
   466	## Task 3: Refresh references for renamed packet `040-sk-auto-deep-research-review-improvement`, outcome success
   467	
   468	### rollout_summary_files

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '2006,2024p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
# Iteration 005: SEARCH MECHANISMS

## Focus
SEARCH MECHANISMS: FTS, vector, hybrid, ranking algorithms. Query processing, shortcuts, relevance scoring.

## Findings
### Finding 1: Mnemosyne’s wrapper exposes a search contract, not a visible ranking engine
- **Source**: [external/src/index.ts:38](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L38), [external/src/index.ts:54](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L54), [external/src/index.ts:96](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L96), [external/src/index.ts:118](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L118)
- **What it does**: `memory_recall` and `memory_recall_global` just call `mnemosyne search` via `Bun.spawn`, pass argv arrays, force `--format plain`, and return backend text. The wrapper does not expose BM25 weights, vector thresholds, fusion parameters, or reranking logic.
- **Why it matters for us**: this repo is not evidence for Mnemosyne’s internal ranking behavior. It proves a safe CLI bridge and thin tool surface, not a search algorithm Public should copy.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Mnemosyne’s query processing is intentionally minimal, with whole-query quoting as its main lexical safeguard
- **Source**: [external/src/index.ts:104](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L104), [external/src/index.ts:126](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L126), [memory-search.ts:585](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L585), [sqlite-fts.ts:169](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L169), [query-router.ts:62](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts#L62), [stage1-candidate-gen.ts:616](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L616)
- **What it does**: Mnemosyne escapes quotes and wraps the entire query in quotes to avoid SQLite FTS syntax problems. Public validates the query, tokenizes and sanitizes lexical search, preserves BM25 for spec-like artifacts, and can add deep-mode variants, decomposition facets, and embedding-based expansion before retrieval.
- **Why it matters for us**: Mnemosyne’s shortcut is robust and cheap, but it is a much shallower query-processing layer than Public’s current pipeline.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 3: The documented hybrid stack is conventional and useful, but only README-proven in this repo
- **Source**: [external/README.md:80](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L80), [external/README.md:82](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L82), [external/README.md:84](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L84), [external/README.md:85](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L85), [external/README.md:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L18)
- **What it does**: the README claims SQLite FTS5 with BM25, sqlite-vec cosine similarity, `snowflake-arctic-embed-m-v1.5`, and Reciprocal Rank Fusion, all local via ONNX Runtime with a one-time ~500 MB model download.
- **Why it matters for us**: the architecture is sensible and the model choice is notable, but this repo only proves that Public would be integrating against a backend contract, not source-verified ranking internals.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: Public already exceeds Mnemosyne’s hybrid retrieval depth by routing and fusing more channels before and after retrieval
- **Source**: [memory-search.ts:482](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482), [memory-search.ts:771](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L771), [hybrid-search.ts:973](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L973), [hybrid-search.ts:1006](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1006), [hybrid-search.ts:1094](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1094), [hybrid-search.ts:1221](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1221), [stage2-fusion.ts:21](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L21)
- **What it does**: Public routes queries across `vector`, `fts`, `bm25`, `graph`, and `degree` channels, then fuses them with adaptive weights, and then applies Stage 2 signals like session boost, recency, causal boost, co-activation, feedback, artifact routing, and validation scoring.
- **Why it matters for us**: Mnemosyne is not a search-mechanism upgrade over Public. Its value is thin-plugin ergonomics and scoped tool UX, not deeper ranking.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Public’s lexical and fallback behavior is materially richer than Mnemosyne’s visible surface
- **Source**: [bm25-index.ts:45](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts#L45), [sqlite-fts.ts:147](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L147), [hybrid-search.ts:445](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L445), [hybrid-search.ts:2101](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L2101), [vector-index-queries.ts:259](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts#L259)
- **What it does**: Public uses weighted FTS5 BM25 (`title` 10x, `trigger_phrases` 5x, etc.), maintains a separate in-memory BM25 path, computes cosine distance in sqlite-vec, and runs a 3-tier degradation chain from strict hybrid to wider hybrid to structural SQL fallback.
- **Why it matters for us**: for search quality and resilience, Public already implements the shortcuts and fallback behavior Mnemosyne’s wrapper leaves entirely to its opaque backend.
- **Recommendation**: reject
- **Impact**: high

### Finding 6: Mnemosyne’s genuinely new search-facing idea is simpler scoped tool ergonomics, not better ranking
- **Source**: [external/src/index.ts:27](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L27), [external/src/index.ts:78](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L78), [external/src/index.ts:171](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L171), [external/README.md:51](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L51), [external/package.json:4](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L4)
- **What it does**: project scope is derived from the current directory basename, project memory is auto-initialized on plugin load, global memory is lazily initialized on first write, and the tool surface makes project/global recall feel explicit and lightweight.
- **Why it matters for us**: if we borrow anything from Mnemosyne for search UX, it should be the simpler scoped entrypoints or aliases, not the backend search design. The main risk is basename-derived scope ambiguity and first-run model/binary friction.
- **Recommendation**: adopt now
- **Impact**: medium

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
- [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
- [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
- [sqlite-fts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts)
- [bm25-index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts)
- [query-router.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts)
- [vector-index-queries.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)

## Assessment
- New information ratio: 0.84
- Questions addressed: wrapper-visible ranking behavior, query preprocessing, FTS/BM25/vector contract, Public overlap, adaptive fusion depth, scope ergonomics, offline-first cost
- Questions answered: Mnemosyne’s wrapper proves only a thin search bridge; its hybrid ranking claims are README-level; Public already has deeper hybrid retrieval with query routing, lexical weighting, adaptive fusion, and fallback tiers; the most transferable search idea is simpler project/global memory tool ergonomics, not the backend retrieval stack; the exact strict validation command returned `RESULT: PASSED` with the warning `cannot create temp file for here document: Operation not permitted`

## Reflection
- What worked: reading `external/src/index.ts` before the README made it obvious where the real evidence boundary sits, then tracing directly into Public’s `memory_search`, `hybrid-search`, `sqlite-fts`, and pipeline stages exposed the search-depth gap quickly
- What did not work: the requested external path still referenced `external/opencode-mnemosyne-main`, but this checkout is rooted directly under `external/`; the workspace is read-only, so I could not update `research/research.md`, `checklist.md`, `implementation-summary.md`, or save memory for the phase

## Recommended Next Focus
MUTATION + RANKING TRACEABILITY: trace how Mnemosyne’s recall output IDs and plain-text result format would support contradiction-safe deletion, auditability, and score explainability compared with Public’s richer retrieval traces, session-scoped envelopes, and staged ranking metadata. Focus on whether a future external-binary facade needs an adapter layer that preserves Public-style provenance, score components, and safe mutation flows instead of returning opaque backend text.


hook: Stop
hook: Stop Completed
tokens used
147,560
# Iteration 005: SEARCH MECHANISMS

## Focus
SEARCH MECHANISMS: FTS, vector, hybrid, ranking algorithms. Query processing, shortcuts, relevance scoring.

## Findings
### Finding 1: Mnemosyne’s wrapper exposes a search contract, not a visible ranking engine
- **Source**: [external/src/index.ts:38](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L38), [external/src/index.ts:54](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L54), [external/src/index.ts:96](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L96), [external/src/index.ts:118](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L118)
- **What it does**: `memory_recall` and `memory_recall_global` just call `mnemosyne search` via `Bun.spawn`, pass argv arrays, force `--format plain`, and return backend text. The wrapper does not expose BM25 weights, vector thresholds, fusion parameters, or reranking logic.
- **Why it matters for us**: this repo is not evidence for Mnemosyne’s internal ranking behavior. It proves a safe CLI bridge and thin tool surface, not a search algorithm Public should copy.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Mnemosyne’s query processing is intentionally minimal, with whole-query quoting as its main lexical safeguard
- **Source**: [external/src/index.ts:104](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L104), [external/src/index.ts:126](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L126), [memory-search.ts:585](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L585), [sqlite-fts.ts:169](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L169), [query-router.ts:62](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts#L62), [stage1-candidate-gen.ts:616](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L616)
- **What it does**: Mnemosyne escapes quotes and wraps the entire query in quotes to avoid SQLite FTS syntax problems. Public validates the query, tokenizes and sanitizes lexical search, preserves BM25 for spec-like artifacts, and can add deep-mode variants, decomposition facets, and embedding-based expansion before retrieval.
- **Why it matters for us**: Mnemosyne’s shortcut is robust and cheap, but it is a much shallower query-processing layer than Public’s current pipeline.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 3: The documented hybrid stack is conventional and useful, but only README-proven in this repo
- **Source**: [external/README.md:80](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L80), [external/README.md:82](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L82), [external/README.md:84](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L84), [external/README.md:85](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L85), [external/README.md:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L18)
- **What it does**: the README claims SQLite FTS5 with BM25, sqlite-vec cosine similarity, `snowflake-arctic-embed-m-v1.5`, and Reciprocal Rank Fusion, all local via ONNX Runtime with a one-time ~500 MB model download.
- **Why it matters for us**: the architecture is sensible and the model choice is notable, but this repo only proves that Public would be integrating against a backend contract, not source-verified ranking internals.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: Public already exceeds Mnemosyne’s hybrid retrieval depth by routing and fusing more channels before and after retrieval
- **Source**: [memory-search.ts:482](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482), [memory-search.ts:771](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L771), [hybrid-search.ts:973](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L973), [hybrid-search.ts:1006](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1006), [hybrid-search.ts:1094](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1094), [hybrid-search.ts:1221](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1221), [stage2-fusion.ts:21](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L21)
- **What it does**: Public routes queries across `vector`, `fts`, `bm25`, `graph`, and `degree` channels, then fuses them with adaptive weights, and then applies Stage 2 signals like session boost, recency, causal boost, co-activation, feedback, artifact routing, and validation scoring.
- **Why it matters for us**: Mnemosyne is not a search-mechanism upgrade over Public. Its value is thin-plugin ergonomics and scoped tool UX, not deeper ranking.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Public’s lexical and fallback behavior is materially richer than Mnemosyne’s visible surface
- **Source**: [bm25-index.ts:45](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts#L45), [sqlite-fts.ts:147](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L147), [hybrid-search.ts:445](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L445), [hybrid-search.ts:2101](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L2101), [vector-index-queries.ts:259](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts#L259)
- **What it does**: Public uses weighted FTS5 BM25 (`title` 10x, `trigger_phrases` 5x, etc.), maintains a separate in-memory BM25 path, computes cosine distance in sqlite-vec, and runs a 3-tier degradation chain from strict hybrid to wider hybrid to structural SQL fallback.
- **Why it matters for us**: for search quality and resilience, Public already implements the shortcuts and fallback behavior Mnemosyne’s wrapper leaves entirely to its opaque backend.
- **Recommendation**: reject
- **Impact**: high

### Finding 6: Mnemosyne’s genuinely new search-facing idea is simpler scoped tool ergonomics, not better ranking
- **Source**: [external/src/index.ts:27](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L27), [external/src/index.ts:78](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L78), [external/src/index.ts:171](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L171), [external/README.md:51](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L51), [external/package.json:4](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L4)
- **What it does**: project scope is derived from the current directory basename, project memory is auto-initialized on plugin load, global memory is lazily initialized on first write, and the tool surface makes project/global recall feel explicit and lightweight.
- **Why it matters for us**: if we borrow anything from Mnemosyne for search UX, it should be the simpler scoped entrypoints or aliases, not the backend search design. The main risk is basename-derived scope ambiguity and first-run model/binary friction.
- **Recommendation**: adopt now
- **Impact**: medium

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
- [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
- [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
- [sqlite-fts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts)
- [bm25-index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts)
- [query-router.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts)
- [vector-index-queries.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)

## Assessment
- New information ratio: 0.84
- Questions addressed: wrapper-visible ranking behavior, query preprocessing, FTS/BM25/vector contract, Public overlap, adaptive fusion depth, scope ergonomics, offline-first cost
- Questions answered: Mnemosyne’s wrapper proves only a thin search bridge; its hybrid ranking claims are README-level; Public already has deeper hybrid retrieval with query routing, lexical weighting, adaptive fusion, and fallback tiers; the most transferable search idea is simpler project/global memory tool ergonomics, not the backend retrieval stack; the exact strict validation command returned `RESULT: PASSED` with the warning `cannot create temp file for here document: Operation not permitted`

## Reflection
- What worked: reading `external/src/index.ts` before the README made it obvious where the real evidence boundary sits, then tracing directly into Public’s `memory_search`, `hybrid-search`, `sqlite-fts`, and pipeline stages exposed the search-depth gap quickly
- What did not work: the requested external path still referenced `external/opencode-mnemosyne-main`, but this checkout is rooted directly under `external/`; the workspace is read-only, so I could not update `research/research.md`, `checklist.md`, `implementation-summary.md`, or save memory for the phase

## Recommended Next Focus
MUTATION + RANKING TRACEABILITY: trace how Mnemosyne’s recall output IDs and plain-text result format would support contradiction-safe deletion, auditability, and score explainability compared with Public’s richer retrieval traces, session-scoped envelopes, and staged ranking metadata. Focus on whether a future external-binary facade needs an adapter layer that preserves Public-style provenance, score components, and safe mutation flows instead of returning opaque backend text.
