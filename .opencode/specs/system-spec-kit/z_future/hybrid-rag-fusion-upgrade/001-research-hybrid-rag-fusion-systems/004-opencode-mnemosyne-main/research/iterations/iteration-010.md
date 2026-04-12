### Finding 3: Mnemosyne survives compaction with reminders; Public resumes with actual session state
- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts), [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- **What it does**: Mnemosyne’s `experimental.session.compacting` hook at lines 208-223 injects a static checklist telling the agent when to recall, store, delete, or use `core` and `global`. Public’s compaction transport at `spec-kit-compact-code-graph.js` lines 396-416 injects a prebuilt transport block, and `memory_context()` can inject actual prior session prompt context before budget enforcement at lines 1425-1445. `session_bootstrap()` then layers structural hints and routing nudges on top at lines 194-208.
- **Why it matters for us**: Mnemosyne preserves memory awareness; Public can preserve memory state. The transferable idea is not the static checklist itself, but adding Mnemosyne-style memory reminders into our existing state-aware transport plan.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: Mnemosyne’s end-of-session lifecycle is manual note taking; `generate-context.js` is structured session serialization
- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts), [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js)
- **What it does**: Mnemosyne stores one concise string per `memory_store` or `memory_store_global` call at lines 138-189, and the README’s AGENTS block at lines 62-78 tells the agent to remember to save/delete manually. Public’s `generate-context.js` is JSON-primary: it expects `user_prompts`, `observations`, `recent_context`, `toolCalls`, `exchanges`, `preflight`, `postflight`, and optional `--session-id` at lines 62-107, requires an explicit target spec folder at lines 338-340, and passes the structured payload into the save workflow at lines 500-515.
- **Why it matters for us**: Mnemosyne is good for fact snippets, but it has no first-class continuation artifact. Public’s save path captures the session as a reusable evidence package, not just a pile of memory atoms.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Mnemosyne ties memory identity to directory basename, which makes lifecycle continuity fragile across renames and parallel checkouts
- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts), [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- **What it does**: Mnemosyne derives project scope from `path.basename(targetDir)` and rewrites a literal `global` basename to `default` at lines 27-30; the README confirms project memory is keyed to `<directory-name>` and global memory is separate at lines 51-60. Public’s save path instead treats the explicit CLI spec folder as authoritative at `generate-context.js` lines 85-93 and 338-345, while `context-server.ts` lines 764-789 publishes a session recovery digest around spec folder, graph freshness, and recommended next step.
- **Why it matters for us**: Mnemosyne’s ergonomics are nice, but basename keying is a weak lifecycle anchor. Renaming a repo or opening another checkout silently changes the memory namespace. If we ever add project/global aliases, they should sit on top of canonical spec-folder or logical identity keys.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 6: Public has a continuity middle layer that Mnemosyne lacks entirely
- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts), [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md), [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- **What it does**: The checked-out Mnemosyne wrapper exposes tool calls and a static compaction block, but no cached continuity summary, transcript fingerprint, token reuse note, or recovery digest. Public adds accepted cached continuity into `session_resume()` at lines 479-488, carries it through `session_bootstrap()` at lines 202-205 and 255-266, and exposes a session recovery digest with recommended action in `context-server.ts` lines 764-789.
- **Why it matters for us**: This middle layer is the difference between “search memory again” and “resume with bounded continuity context.” Mnemosyne gives durable storage; Public gives resumable workflow state.
- **Recommendation**: NEW FEATURE
- **Impact**: high

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)

## Assessment
- New information ratio: 0.76
- Questions addressed: bootstrap/readiness ownership, trusted session identity, compaction versus actual resume state, structured context save semantics, namespace stability across project lifecycle changes, cached continuity versus raw recall.
- Questions answered: Mnemosyne’s lifecycle is storage-first and instruction-driven; Public’s lifecycle is session-first and contract-driven. The strongest reusable ideas are lightweight project/global ergonomics and optional compaction reminders, but Mnemosyne’s stateless tool boundary, basename-derived identity, and string-only session save model should not replace `memory_context`, `generate-context.js`, or `session_bootstrap`. The exact strict validation command passed with `RESULT: PASSED` and `Summary: Errors: 0  Warnings: 0`, alongside the expected read-only warning `cannot create temp file for here document: Operation not permitted`.

## Reflection
- What worked: starting with the live `external/src/index.ts` and then tracing directly into `session_manager`, `memory_context`, `session_resume`, and `generate-context.js` made the lifecycle boundary very explicit. Checking earlier iteration artifacts kept this pass focused on new state-ownership differences instead of repeating the “thin wrapper” conclusion.
- What did not work: the phase prompt’s nested `external/opencode-mnemosyne-main` path does not match this checkout, so I had to correct to the live `external/src/index.ts` layout. The sandbox is read-only, so I could not update `research/research.md`, `checklist.md`, `implementation-summary.md`, or save phase memory with `generate-context.js`.

## Recommended Next Focus
Define an external-memory adapter contract for Public that preserves server-minted session identity, cached continuity summaries, bootstrap/readiness payloads, and JSON-primary save semantics, while optionally adding Mnemosyne-style project/global aliases and compaction-time memory reminders on top of the existing transport plan.

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
# Iteration 010: COMPARISON - HYGIENE

## Focus
COMPARISON - HYGIENE: Compare memory quality/hygiene against our causal links, health tooling, trigger system.

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
I’m treating this as a read-only deep-research pass over the external Mnemosyne wrapper and our current memory internals, with the goal of surfacing new hygiene comparisons instead of repeating prior lifecycle findings. I’ll start by pulling the most relevant prior memory context, then read the external source in the order you specified and trace the comparable Public handlers side by side.
mcp: spec_kit_memory/memory_match_triggers started
mcp: spec_kit_memory/memory_match_triggers (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'rg -n "mnemosyne|hybrid-rag-fusion|causal|health tooling|trigger system" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
174:- `memory-metadata.ts` should read `session_id`/`context_type` from both frontmatter and `## MEMORY METADATA` YAML block so derived causal links (`derived_from`, `supersedes`) still populate on older saves [Task 1]
181:- symptom: causal auto-link misses prior session; cause: parser read `session_id` from frontmatter only; fix: parse metadata YAML block too [Task 1]
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1638:- clampStrength, isFiniteNumber, NaN/infinite rejection, memory_causal_link, causal edges
1653:- Use shared `clampStrength` + finite-number checks for causal-edge strength writes instead of ad-hoc `Math.max/Math.min` clamps [Task 6]
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
1859:- requireDbOrThrow, learning-stats-filters.vitest.ts, integration-causal-graph, memory_health autoRepair, verifyIntegrity autoClean, tmp orphan cleanup
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

codex
I found prior memory hits around hybrid-rag-fusion and causal/health areas, but not a direct Mnemosyne summary in the registry output. Next I’m reading the exact external wrapper files in the requested order and pulling the Public-side comparison points for hygiene, triggers, causal edges, and health instrumentation.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
I’ve finished the external wrapper pass and the shape is clear: the plugin is very thin, with hygiene mostly delegated to agent behavior and backend verbs. I’m now tracing our concrete comparison points for trigger recall, causal maintenance, validation/health, and deletion/update flows so the findings stay grounded in actual Public code instead of README-level contrast.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'rg -n "memory_match_triggers|memory_health|memory_causal_link|memory_causal_unlink|memory_validate|memory_delete|memory_update|trigger phrases|importanceTier|confidence|quality_score|contradict" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:116:| `SPECKIT_CONFIDENCE_TRUNCATION` | `true` | boolean | Confidence-gap truncation for low-confidence result tails. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:137:| `SPECKIT_NEGATIVE_FEEDBACK` | `true` | boolean | Negative-feedback confidence demotion in ranking (T002b/A4). Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:159:| `SPECKIT_HYDE` | `true` | boolean | Hypothetical Document Embeddings for low-confidence deep queries (REQ-D2-004). Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:162:| `SPECKIT_INTENT_CONFIDENCE_FLOOR` | `0.25` | number | Minimum confidence for auto-detected intent. Below this, overrides to "understand". | `handlers/memory-search.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:227:| `SPECKIT_CONSOLIDATION` | `true` | boolean | Consolidation engine: contradiction scan, Hebbian strengthening, staleness detection (N3-lite). Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:287:| `SPECKIT_RESULT_CONFIDENCE_V1` | `true` | boolean | Per-result calibrated confidence scoring (REQ-D5-004). Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:9:/** Arguments for the memory_delete handler. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:12:// Feature catalog: Memory metadata update (memory_update)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:13:// Feature catalog: Single and folder delete (memory_delete)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:22:/** Arguments for the memory_update handler. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:28:  importanceTier?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:50:/** Arguments for the memory_health handler. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:82:    throw new Error(`Bulk delete of "${tier}" tier requires specFolder scope for safety. Use memory_delete for individual deletions.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:197:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:220:        tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:284:      console.warn('[memory_match_triggers] Decay failed:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:336:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:337:      summary: 'No matching trigger phrases found',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:349:        'Ensure memories have trigger phrases defined',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:374:        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:390:          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:491:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:496:    : `Matched ${formattedResults.length} memories via trigger phrases`;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:511:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:565:  handle_memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:14:// Feature catalog: Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:32:const handle_memory_delete = handleMemoryDelete;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:33:const handle_memory_update = handleMemoryUpdate;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:36:const handle_memory_health = handleMemoryHealth;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:41:  handle_memory_delete,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:42:  handle_memory_update,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:45:  handle_memory_health,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:83:    : 'Prediction-error contradiction across different file paths';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:218:      importance_tier: parsed.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:227:      quality_score: parsed.qualityScore ?? 0,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:9:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:34:  contradiction?: { detected: boolean; type: string | null; description: string | null; confidence: number } | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:61:  importanceTier?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:157:  quality_score?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:196:            importanceTier: parsed.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:262:                  importance_tier: parsed.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:271:                  quality_score: parsed.qualityScore ?? 0,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:41:  quality_score: number | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:95:    SELECT id, content_hash, embedding_status, trigger_phrases, quality_score, quality_flags
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:140:    quality_score: number | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:155:  const persistedQualityScore = existing.quality_score ?? 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:237:      importanceTier: parsed.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:302:        importanceTier: parsed.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:170:    importanceTier: parsed.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:337:    importanceTier: result.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:20:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:44:    importanceTier: parsed.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:68:    importanceTier: parsed.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:26:// Feature catalog: Single and folder delete (memory_delete)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:27:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:55:    tool: 'memory_delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:67:/** Handle memory_delete tool -- deletes a single memory by ID or bulk-deletes by spec folder. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:108:            'mcp:memory_delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:122:          reason: 'memory_delete: single memory delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:127:            tool: 'memory_delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:133:          actor: 'mcp:memory_delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:203:              'mcp:memory_delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:220:          reason: 'memory_delete: bulk delete by spec folder',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:225:            tool: 'memory_delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:232:          actor: 'mcp:memory_delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:290:    tool: 'memory_delete',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:30:// Feature catalog: Memory metadata update (memory_update)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:31:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:40:/** Handle memory_update tool -- updates metadata fields and optionally regenerates embeddings. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:51:    importanceTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:67:  if (importanceTier !== undefined && !isValidTier(importanceTier)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:70:      `Invalid importance tier: ${importanceTier}. Valid tiers: ${VALID_TIERS.join(', ')}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:71:      { param: 'importanceTier', value: importanceTier }
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:87:  if (importanceTier !== undefined) updateParams.importanceTier = importanceTier;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:151:      // T2-6 — BM25 index stores title + trigger phrases; must re-index when either changes
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:195:          'mcp:memory_update'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:203:        reason: 'memory_update: metadata update',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:210:          importanceTier: updateParams.importanceTier ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:214:          tool: 'memory_update',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:220:        actor: 'mcp:memory_update',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:231:      tool: 'memory_update',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:289:    tool: 'memory_update',
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:226:export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:263:export const handle_memory_delete = lazyFunction(getMemoryCrudModule, 'handle_memory_delete');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:264:export const handle_memory_update = lazyFunction(getMemoryCrudModule, 'handle_memory_update');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:267:export const handle_memory_health = lazyFunction(getMemoryCrudModule, 'handle_memory_health');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:292:export const handle_memory_validate = lazyFunction(getCheckpointsModule, 'handle_memory_validate');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:314:export const handle_memory_causal_link = lazyFunction(getCausalGraphModule, 'handle_memory_causal_link');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:316:export const handle_memory_causal_unlink = lazyFunction(getCausalGraphModule, 'handle_memory_causal_unlink');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:302:    confidence: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:306:  if (!queryIntentMetadata || queryIntentMetadata.queryIntent !== 'structural' || queryIntentMetadata.confidence <= 0.65) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:555:            confidence: r.confidence,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:556:            importanceTier: r.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:888:    intentConfidence = classification.confidence;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1061:      confidence: intentConfidence,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1137:    confidence: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1147:        routedBackend: classification.intent === 'structural' && classification.confidence > 0.65
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1152:        confidence: classification.confidence,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1169:      if (classification.intent === 'structural' && classification.confidence > 0.65) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1200:      // 'semantic' or low-confidence: no graph context, fall through
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1478:      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:22:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:28:// Feature catalog: Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:29:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:222:/** Handle memory_health tool -- returns system health status and diagnostics. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:233:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:251:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:260:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:269:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:278:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:287:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:333:        tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:359:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:428:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:439:        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:570:    tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/types.ts:23:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:188:    importanceTier: parsed.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:420:    : 'Prediction-error contradiction across different file paths';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:645:          importanceTier: parsed.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:36:- `checkpoints.ts` - Checkpoint lifecycle plus `memory_validate`.
.opencode/skill/system-spec-kit/mcp_server/README.md:61:| **Causal relations** | 6 | caused, enabled, supersedes, contradicts, derived_from, supports |
.opencode/skill/system-spec-kit/mcp_server/README.md:178:  "tool": "memory_health",
.opencode/skill/system-spec-kit/mcp_server/README.md:249:| Tier 2 | BM25 keyword scoring | FTS5 results below confidence floor |
.opencode/skill/system-spec-kit/mcp_server/README.md:285:**Stage 4 -- Filter and annotate**. Enforces score immutability (no score changes after Stage 2). Applies state filtering by minimum state parameter. Annotates results with confidence labels (high/medium/low) and feature flag states.
.opencode/skill/system-spec-kit/mcp_server/README.md:311:For low-confidence deep searches, the system has two additional fallback strategies:
.opencode/skill/system-spec-kit/mcp_server/README.md:361:| **contradicts** | -- | A and B conflict |
.opencode/skill/system-spec-kit/mcp_server/README.md:396:| **REINFORCE** | Similar exists, new one adds value | Both kept, old one gets a confidence boost |
.opencode/skill/system-spec-kit/mcp_server/README.md:398:| **SUPERSEDE** | New knowledge contradicts the old | New version active, old one demoted to deprecated |
.opencode/skill/system-spec-kit/mcp_server/README.md:461:**Result confidence scoring** -- tags each result as high, medium or low confidence using fast heuristics (no LLM needed). Checks: top-K separation, multi-channel agreement, quality score and source document structure.
.opencode/skill/system-spec-kit/mcp_server/README.md:642:| `min_quality_score` | number | Filter out low-quality results |
.opencode/skill/system-spec-kit/mcp_server/README.md:674:##### `memory_match_triggers`
.opencode/skill/system-spec-kit/mcp_server/README.md:688:  "tool": "memory_match_triggers",
.opencode/skill/system-spec-kit/mcp_server/README.md:763:##### `memory_health`
.opencode/skill/system-spec-kit/mcp_server/README.md:789:##### `memory_delete`
.opencode/skill/system-spec-kit/mcp_server/README.md:801:##### `memory_update`
.opencode/skill/system-spec-kit/mcp_server/README.md:809:| `triggerPhrases` | string[] | Updated trigger phrases |
.opencode/skill/system-spec-kit/mcp_server/README.md:811:| `importanceTier` | string | `constitutional`, `critical`, `important`, `normal`, `temporary`, `deprecated` |
.opencode/skill/system-spec-kit/mcp_server/README.md:816:##### `memory_validate`
.opencode/skill/system-spec-kit/mcp_server/README.md:818:Tell the system whether a search result was helpful. Helpful results get a confidence boost so they show up more often. Unhelpful results get demoted. Over time, the system learns which memories are genuinely useful, like training a recommendation engine with thumbs-up and thumbs-down.
.opencode/skill/system-spec-kit/mcp_server/README.md:996:##### `memory_causal_link`
.opencode/skill/system-spec-kit/mcp_server/README.md:1004:| `relation` | string | **Required.** `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from` or `supports` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1020:##### `memory_causal_unlink`
.opencode/skill/system-spec-kit/mcp_server/README.md:1540:| Check triggers on every prompt | `memory_match_triggers` | Pass the user's prompt text |
.opencode/skill/system-spec-kit/mcp_server/README.md:1542:| Diagnose search problems | `memory_health` | Set `reportMode: "full"` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1563:{ "tool": "memory_health", "arguments": { "reportMode": "full", "autoRepair": true } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1567:{ "tool": "memory_search", "arguments": { "query": "your query", "min_quality_score": 0.5 } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1663:{ "tool": "memory_health", "arguments": { "reportMode": "divergent_aliases", "limit": 20 } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1717:Start with `memory_context` for all retrieval tasks. It handles intent detection and routing automatically. Use `memory_search` when you want explicit control over channels. Use `memory_match_triggers` when processing a raw prompt at the start of each turn. Use L4-L7 tools only for mutation, analysis or maintenance.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:16:// Feature catalog: Memory metadata update (memory_update)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:17:// Feature catalog: Single and folder delete (memory_delete)
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:451:          confidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:452:          numericConfidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:478:          confidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:479:          numericConfidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:504:          confidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:505:          numericConfidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:530:          confidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:531:          numericConfidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:17:// Feature catalog: Causal edge creation (memory_causal_link)
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:18:// Feature catalog: Causal edge deletion (memory_causal_unlink)
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:27:  importanceTier: string;
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:89:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:198:      importanceTier: r.importance_tier as string
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:463:    recommendedCalls.push('memory_match_triggers({ prompt: "<your task>" })');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:13:import * as confidenceTracker from '../lib/scoring/confidence-tracker.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:97:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648:/** Handle memory_validate tool - records user validation feedback to adjust confidence */
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:681:  const result: ValidationResult = confidenceTracker.recordValidation(database, memoryId, wasUseful);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:688:      actor: sessionId ?? 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:721:  // T002b: Negative-feedback confidence signal persistence for runtime scoring.
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:726:  // T002 + T027a: Optional wiring from memory_validate to learned feedback + ground truth.
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:768:    ? `Positive validation recorded (confidence: ${result.confidence.toFixed(2)})`
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:769:    : `Negative validation recorded (confidence: ${result.confidence.toFixed(2)})`;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:780:    tool: 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:785:      confidence: result.confidence,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:815:const handle_memory_validate = handleMemoryValidate;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:822:  handle_memory_validate,
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:30:  importanceTier: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:55:  importanceTier?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:205:/** Mark a memory as superseded (deprecated) when a newer contradicting version is saved */
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:280:      importance_tier: parsed.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:285:      quality_score: parsed.qualityScore ?? 0,
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:320:    importanceTier: parsed.importanceTier
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:345:        contradiction_detected,
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:354:      decision.contradiction?.detected ? 1 : 0,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:77:const importanceTierEnum = z.enum([
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:90:  'contradicts',
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:130:  tier: importanceTierEnum.optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:139:  min_quality_score: boundedNumber(0, 1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:214:  importanceTier: importanceTierEnum.optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:232:  tier: importanceTierEnum,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:400:  memory_match_triggers: memoryMatchTriggersSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:404:  memory_health: memoryHealthSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:405:  memory_delete: memoryDeleteSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:406:  memory_update: memoryUpdateSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:407:  memory_validate: memoryValidateSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:416:  memory_causal_link: memoryCausalLinkSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:418:  memory_causal_unlink: memoryCausalUnlinkSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:465:  memory_match_triggers: ['prompt', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'session_id', 'turnNumber', 'include_cognitive'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:469:  memory_health: ['reportMode', 'limit', 'specFolder', 'autoRepair', 'confirmed'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:470:  memory_delete: ['id', 'specFolder', 'confirm'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:471:  memory_update: ['id', 'title', 'triggerPhrases', 'importanceWeight', 'importanceTier', 'allowPartialUpdate'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:472:  memory_validate: ['id', 'wasUseful', 'queryId', 'queryTerms', 'resultRank', 'totalResultsShown', 'searchMode', 'intent', 'sessionId', 'notes'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:481:  memory_causal_link: ['sourceId', 'targetId', 'relation', 'strength', 'evidence'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:483:  memory_causal_unlink: ['edgeId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:207:  min_quality_score?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:524:    min_quality_score,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:578:  const qualityThreshold = resolveQualityThreshold(minQualityScore, min_quality_score);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:672:    intentConfidence = classification.confidence;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:678:      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (confidence: ${intentConfidence.toFixed(2)})`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:682:  // FIX RC3-B: Intent confidence floor — override low-confidence auto-detections to "understand"
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:685:    console.error(`[memory-search] Intent confidence ${intentConfidence.toFixed(3)} below floor ${INTENT_CONFIDENCE_FLOOR}, overriding '${detectedIntent}' → 'understand'`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:707:  if (detectedIntent && artifactRouting?.detectedClass === 'unknown' && artifactRouting?.confidence === 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:834:                     quality_score, created_at
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:931:        confidence: intentConfidence,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1006:      normalizedQuery,   // REQ-D5-001/D5-004: pass query for recovery + confidence context
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1273:            confidence: 'weak',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:65:      if (!metadata || typeof metadata.confidence !== 'number') {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:87:      if (!best || metadata.confidence > best.numericConfidence) {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:90:          numericConfidence: metadata.confidence,
.opencode/skill/system-spec-kit/mcp_server/schemas/README.md:53:**Shared validators** -- Reusable building blocks (`positiveInt`, `positiveIntMax`, `boundedNumber`, `intentEnum`, `importanceTierEnum`, `relationEnum`) keep per-tool schema definitions concise.
.opencode/skill/system-spec-kit/mcp_server/schemas/README.md:55:**Discriminated delete** -- `memory_delete` uses a `z.union` of two branches: single-record delete (requires `id`) and bulk folder delete (requires `specFolder` + `confirm: true`).
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:70:- `MEMORY_AWARE_TOOLS` currently includes `memory_context`, `memory_search`, `memory_match_triggers`, `memory_list`, `memory_save`, and `memory_index_scan`.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:184:              confidence: a.confidence,
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:62:  contradictionDensity: 0.15, // max allowed
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:201:    signal: 'contradictionDensity',
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:202:    value: signals.contradictionDensity,
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:203:    threshold: t.contradictionDensity,
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:204:    passed: signals.contradictionDensity <= t.contradictionDensity,
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:255:  // Check for active contradictions
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:256:  const contradictions = findContradictions(ns);
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:257:  if (contradictions.length > 0 && signals.contradictionDensity > t.contradictionDensity) {
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:259:      type: 'high_contradiction_density',
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:260:      description: `${contradictions.length} contradiction(s) detected with density above threshold`,
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:261:      count: contradictions.length,
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:351:  // Check contradictions
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:352:  const contradictions = findContradictions(ns);
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:353:  if (contradictions.length > 0 && signals.findingStability < t.findingStability) {
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:356:      description: `${contradictions.length} contradiction(s) are lowering finding stability below threshold`,
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:357:      count: contradictions.length,
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:42:} from '../lib/search/confidence-scoring.js';
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:96:  importanceTier?: string;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:447:      importanceTier: rawResult.importance_tier,
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:616:  // REQ-D5-004: Compute per-result confidence when flag is enabled (additive, no side-effects)
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:617:  const confidenceEnabled = isResultConfidenceEnabled();
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:618:  let confidenceData: ReturnType<typeof computeResultConfidence> | null = null;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:620:  if (confidenceEnabled) {
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:623:    confidenceData = computeResultConfidence(scoredResults);
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:624:    requestQualityData = assessRequestQuality(scoredResults, confidenceData);
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:630:    // Compute average confidence for recovery decision
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:632:    if (confidenceData && confidenceData.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:633:      const sum = confidenceData.reduce((acc, c) => acc + c.confidence.value, 0);
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:634:      avgConfidence = sum / confidenceData.length;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:667:  // Merge per-result confidence into the formatted result array (additive)
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:670:      if (!confidenceData) return r as unknown as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:671:      const conf = confidenceData[i];
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:89: * Evaluates whether the memory metadata declares enough trigger phrases for
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:90: * reliable retrieval via the `memory_match_triggers` tool. The scoring
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:108:    issues.push('No trigger phrases found');
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:427: * - Re-extract trigger phrases from content headings/title
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:442:  // Fix #1 : Re-extract trigger phrases if missing/insufficient
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:452:      fixed.push(`Re-extracted ${extracted.length} trigger phrases from content`);
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:482: * Extract trigger phrases from content by scanning headings and the title.
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:722:      'memory_quality_score',
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:23:  | 'contradictions'
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:91:      case 'contradictions': {
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:92:        const contradictions = findContradictions(ns);
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:94:          queryType: 'contradictions',
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:96:          contradictions: contradictions.slice(0, limit),
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:97:          totalContradictions: contradictions.length,
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:129:          `Unknown queryType: "${args.queryType}". Valid types: uncovered_questions, unverified_claims, contradictions, provenance_chain, coverage_gaps, hot_nodes`,
.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts:20:// Feature catalog: Single and folder delete (memory_delete)
.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts:21:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:107:        '- `memory_match_triggers({ prompt })` - fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:163:    content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:50:  by_contradicts: FlatEdge[];
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:63:  contradicts: FlatEdge[];
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:103:  tool: 'memory_drift_why' | 'memory_causal_link' | 'memory_causal_stats' | 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:142:    by_contradicts: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:187:      case 'contradicts': return result.by_contradicts;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:210:    by_contradicts: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:229:      case 'contradicts': merged.by_contradicts.push(edge); break;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:276:    by_contradicts: allowed.has('contradicts') ? chain.by_contradicts : [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:294:    by_contradicts: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:309:    contradicts: chain.by_contradicts,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:326:  if (chain.by_contradicts.length > 0) parts.push(`${chain.by_contradicts.length} contradicts`);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:490:          'Use memory_causal_link to create relationships',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:516:    if (combinedChain.by_contradicts.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:557:/** Handle memory_causal_link tool - creates a causal edge between two memories */
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:576:      tool: 'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:603:        tool: 'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:607:        recovery: getRecoveryHint('memory_causal_link', 'E020'),
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:616:        tool: 'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:620:        recovery: getRecoveryHint('memory_causal_link', ErrorCodes.CAUSAL_INVALID_RELATION),
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:629:        tool: 'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:633:        recovery: getRecoveryHint('memory_causal_link', ErrorCodes.CAUSAL_GRAPH_ERROR),
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:639:      tool: 'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:653:      'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:731:      hints.push('No causal links exist yet - use memory_causal_link to create relationships');
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:769:/** Handle memory_causal_unlink tool - deletes a causal edge by ID */
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:776:      tool: 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:799:        tool: 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:803:        recovery: getRecoveryHint('memory_causal_unlink', 'E020'),
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:821:      tool: 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:829:      'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:853:const handle_memory_causal_link = handleMemoryCausalLink;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:855:const handle_memory_causal_unlink = handleMemoryCausalUnlink;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:859:  handle_memory_causal_link,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:861:  handle_memory_causal_unlink,
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:53:| **DegradedModeContract** | Failure description with confidence impact, retry recommendation, and affected stages |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:131:| `confidence_impact` | `number` | Confidence factor (0 = total loss, 1 = no impact), clamped to [0, 1] |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:162:| `createDegradedContract(failure_mode, fallback_mode, confidence_impact, retry_recommendation, degradedStages)` | `DegradedModeContract` | New degraded-mode record with clamped confidence |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:185:- Do not replace those axes with a single scalar such as `trust`, `confidence`, `authorityScore`, or `freshnessScore`.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:186:- Ranking confidence from `lib/search/confidence-scoring.ts` is retrieval-ordering metadata only and must not be reused as `StructuralTrust`.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:236:console.log(`Failure: ${degraded.failure_mode}, confidence impact: ${degraded.confidence_impact}`);
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:237:// Failure: timeout, confidence impact: 0.15
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:305:- Fail closed when any axis is missing, malformed, or collapsed into scalar stand-ins such as `trust`, `trustScore`, `confidence`, `confidenceScore`, or `authorityScore`.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:312:- Ranking confidence and other retrieval-ordering metadata stay separate from `StructuralTrust`.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:208:          created_at, updated_at, confidence, validation_count, access_count
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:39:  importanceTier: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:54:  importanceTier?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:73:  quality_score?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:97:  'spec_level', 'quality_score', 'quality_flags', 'parent_id',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:243:        importance_tier: parsed.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:250:        quality_score: parsed.qualityScore ?? 0,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:344:          importance_tier: parsed.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:475:      importanceTier: parsed.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:516:            quality_score = ?,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:522:        parsed.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:586:        importanceTier: parsed.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:643:    importanceTier: parsed.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:42:} from './confidence-truncation.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:66:import type { TruncationResult } from './confidence-truncation.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:87:   * When true, preserve the requested top-K window by bypassing confidence
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:93:  /** Optional trigger phrases for query-classifier trigger-match routing path. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:165:    confidence: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1030:        confidence: routeResult.classification.confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1532:  // candidates before low-confidence tails are trimmed.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1555:      console.warn('[hybrid-search] confidence truncation failed:', err instanceof Error ? err.message : String(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1579:          // Wire confidence truncation metadata into per-result trace (036)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1581:            confidenceTruncation: {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2013: * Keep Tier 3 structural fallback scores below established Tier 1/2 confidence.
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:116:      min_quality_score: {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:120:        description: 'Minimum quality score threshold (0.0-1.0). Results with lower quality_score are filtered out.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:126:        description: 'Deprecated alias for min_quality_score. Prefer snake_case parameter name.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:211:  name: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:213:  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', minLength: 1, description: 'User prompt or text to match against trigger phrases' }, specFolder: { type: 'string', description: 'Limit trigger matches to a specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed trigger matching.' }, userId: { type: 'string', description: 'User boundary for governed trigger matching.' }, agentId: { type: 'string', description: 'Agent boundary for governed trigger matching.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed trigger matching.' }, limit: { type: 'number', default: 3, minimum: 1, maximum: 100, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', minimum: 1, description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:219:  description: '[L2:Core] Index a memory file into the spec kit memory database. Reads the file, extracts metadata (title, trigger phrases), generates embedding, and stores in the index. Use this to manually index new or updated memory files. Includes pre-flight validation (T067-T070) for anchor format, duplicate detection, and token budget estimation. Token Budget: 3500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:237:  name: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:268:        description: 'Required with autoRepair:true to execute repair actions. When false or omitted, memory_health returns a confirmation-only response.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:277:  name: 'memory_delete',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:292:  name: 'memory_update',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:294:  inputSchema: { type: 'object', additionalProperties: false, properties: { id: { type: 'number', minimum: 1, description: 'Memory ID to update' }, title: { type: 'string', description: 'New title' }, triggerPhrases: { type: 'array', items: { type: 'string' }, description: 'Updated trigger phrases' }, importanceWeight: { type: 'number', minimum: 0, maximum: 1, description: 'New importance weight (0-1)' }, importanceTier: { type: 'string', enum: ['constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated'], description: 'Set importance tier. Constitutional tier memories always surface at top of results.' }, allowPartialUpdate: { type: 'boolean', default: false, description: 'Allow update to succeed even if embedding regeneration fails. When true, metadata changes are applied and the embedding is marked for re-index. When false (default), the entire update is rolled back on embedding failure.' } }, required: ['id'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:298:  name: 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:299:  description: '[L4:Mutation] Record validation feedback for a memory. Tracks whether memories are useful, updating confidence scores. Memories with high confidence and validation counts may be promoted to critical tier. Token Budget: 500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:305:      wasUseful: { type: 'boolean', description: 'Whether the memory was useful (true increases confidence, false decreases it)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:485:  description: '[L6:Analysis] Trace causal chain for a memory to answer "why was this decision made?" Traverses causal edges up to maxDepth hops, grouping results by relationship type (caused, enabled, supersedes, contradicts, derived_from, supports). Use to understand decision lineage and memory relationships. Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:487:  inputSchema: { type: 'object', additionalProperties: false, properties: { memoryId: { type: 'string', description: 'Memory ID to trace causal lineage for (number or string, required)' }, maxDepth: { type: 'number', default: 3, minimum: 1, maximum: 10, description: 'Maximum traversal depth (default: 3, max: 10)' }, direction: { type: 'string', description: 'Traversal direction: outgoing, incoming, or both (default: both)' }, relations: { type: 'array', items: { type: 'string' }, description: 'Filter to specific relationship types: caused, enabled, supersedes, contradicts, derived_from, supports' }, includeMemoryDetails: { type: 'boolean', default: true, description: 'Include full memory details in results' } }, required: ['memoryId'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:491:  name: 'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:492:  description: '[L6:Analysis] Create a causal relationship between two memories. Links represent decision lineage (caused, enabled), versioning (supersedes), contradictions, derivation, or support. Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:493:  inputSchema: { type: 'object', additionalProperties: false, properties: { sourceId: { type: 'string', description: 'Source memory ID (the cause/enabler/superseder, number or string)' }, targetId: { type: 'string', description: 'Target memory ID (the effect/superseded, number or string)' }, relation: { type: 'string', description: 'Relationship type: caused, enabled, supersedes, contradicts, derived_from, or supports' }, strength: { type: 'number', default: 1.0, minimum: 0, maximum: 1, description: 'Relationship strength (0.0-1.0)' }, evidence: { type: 'string', description: 'Evidence or reason for this relationship' } }, required: ['sourceId', 'targetId', 'relation'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:503:  name: 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:827:  description: '[L9:CoverageGraph] Structured analysis of deep-loop coverage graph state. Supports query types: uncovered_questions (questions with no coverage), unverified_claims (claims without verification), contradictions (CONTRADICTS edge pairs), provenance_chain (BFS from a node following citation/evidence edges), coverage_gaps (nodes missing incoming coverage edges), and hot_nodes (most connected nodes by edge count + weight).',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:833:      queryType: { type: 'string', enum: ['uncovered_questions', 'unverified_claims', 'contradictions', 'provenance_chain', 'coverage_gaps', 'hot_nodes'], description: 'Type of query to execute (required)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:858:  description: '[L9:CoverageGraph] Composite convergence assessment for deep-loop coverage graph. Returns a typed decision (CONTINUE, STOP_ALLOWED, STOP_BLOCKED), signal values, blockers with severity levels, and a typed trace explaining each signal threshold evaluation. For research: evaluates questionCoverage, claimVerificationRate, contradictionDensity, plus blocking guards sourceDiversity and evidenceDepth. For review: evaluates dimensionCoverage, findingStability, p0ResolutionRate, evidenceDensity, hotspotSaturation. Extends Phase 001 stop logic without replacing newInfoRatio.',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:210:// Automatically clears memory_search, memory_match_triggers, etc.
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:131:      'SELECT importance_tier, validation_count, confidence FROM memory_index WHERE id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:135:      confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:313:    'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:428:- `memory_match_triggers` (fast trigger matching)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:559:### memory_match_triggers: Fast Keyword Lookup
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:561:`memory_match_triggers()` provides sub-50ms keyword-based matching. Use it for immediate context surfacing at the start of a conversation.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:604:When Z-score analysis signals low-confidence retrieval (insufficient signal in the indexed corpus), the server prepends an evidence gap warning to the LLM payload. This tells the AI assistant that results may be incomplete rather than letting it treat sparse results as authoritative.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:614:- `quality`: Result quality score based on embedding confidence and match density
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1047:MCP TOOLS: memory_context, memory_search, memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:196: * - Terms must NOT already exist as organic trigger phrases
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:201: * @param existingTriggers - Current trigger phrases already on the memory
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:133:| `type-inference.ts` | Multi-source inference with confidence scoring |
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:166:// Returns: { type: 'working', source: 'file_path', confidence: 0.8 }
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:172:// Returns: { type: 'semantic', source: 'frontmatter_explicit', confidence: 1.0 }
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:179:// Returns: { type: 'procedural', source: 'keywords', confidence: 0.7 }
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:297:- Purpose: Owns ranking and calibration logic once candidate memories already exist. It combines importance tiers, composite scoring, folder relevance, confidence signals, and negative-feedback effects.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:302:  - `confidence-tracker.ts` — confidence-related normalization helpers.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:303:  - `negative-feedback.ts` — post-feedback confidence penalties.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:215:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:404:          ((row.confidence as number) || 0.5) <= ARCHIVAL_CONFIG.maxConfidence
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:417:          confidence: (row.confidence as number) || 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:441:  if ((row.confidence as number) <= ARCHIVAL_CONFIG.maxConfidence) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:442:    reasons.push('low-confidence');
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:530:    caveat = 'Forecast is low-confidence until at least one file has been processed.';
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:537:        caveat = 'Forecast is low-confidence because queue history is still sparse or noisy.';
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:40:  contradicts: 0.7,
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:440:                WHEN 'contradicts' THEN 0.7
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:528:          WHEN 'contradicts' THEN 0.7
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:141:        '- `memory_match_triggers({ prompt })` — fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:202:      content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:18:  confidence: 'high' | 'medium' | 'low' | 'fallback';
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:79: * @param triggerPhrases - Known trigger phrases to match against.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:91: * Determine confidence label based on how clearly the query fits its tier.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:113:    // High confidence: many terms and low stop-word ratio (content-rich)
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:140: * @param triggerPhrases - Optional array of known trigger phrases.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:141: * @returns ClassificationResult with tier, features, and confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:151:    confidence: 'fallback',
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:184:    const confidence = determineConfidence(tier, termCount, triggerMatch, stopWordRatio);
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:195:      confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:71:  confidence?: {
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:159: * Classify results by confidence label.
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:160: * Returns counts for high, medium, low (and unknown when no confidence data).
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:162: * @param results - Results to classify by confidence label.
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:163: * @returns Counts for each confidence bucket.
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:175:    const label = result.confidence?.label;
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:196: * Build a human-readable digest string from confidence distribution.
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:131:        importanceTier: 'normal',
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:176:        importanceTier: 'normal',
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:233:        importanceTier: 'normal',
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:176:| >= 0.85 (85%) | **UPDATE** or **SUPERSEDE** | High match, check contradiction  |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:183:- Triggers: SUPERSEDE action to replace contradictory memory
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:417://   contradiction: { detected: false, type: null, description: null, confidence: 0 },
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:421:// Detect contradiction between two texts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:422:const contradiction = detectContradiction(newContent, existingContent);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:423:// contradiction = { detected: true, type: 'negation', description: '...', confidence: 0.60 }
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:432:  contradiction,      // ContradictionResult
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:441:// stats = { total, byAction: {...}, contradictions, averageSimilarity }
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:449:similarity >= 0.85 → UPDATE or SUPERSEDE (if contradiction detected)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:670:// candidates = [{ id, title, spec_folder, file_path, created_at, importance_tier, access_count, confidence, reason }]
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:689:# maxConfidence: 0.4                           # Low-confidence threshold
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:809:    // High similarity but no contradiction, update existing
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:31:Hooks are transport reliability, not separate business logic. They call the same retrieval primitives (`memory_match_triggers`, `memory_context`) that other runtimes call explicitly.
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:49:  confidence?: {
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:259:  const lowConfidence = results.filter(r => r.confidence?.label === 'low');
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:261:    blockers.push(`${lowConfidence.length} result(s) have low confidence scores`);
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:26:  importanceTier?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:32:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:51:  importanceTier?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:130:  const tierMatch = content.match(/(?:importance_tier|importanceTier):\s*["']?(\w+)["']?/i);
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:159:  // Normalize trigger phrases to array
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:222:    importanceTier = null,
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:225:  // 1. Check explicit type in frontmatter (highest confidence)
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:231:      confidence: 1.0,
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:243:      confidence: 0.95,
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:248:  if (importanceTier && TIER_TO_TYPE_MAP[importanceTier]) {
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:250:      type: TIER_TO_TYPE_MAP[importanceTier],
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:252:      confidence: 0.9,
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:261:      confidence: 0.9,
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:271:      confidence: 0.8,
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:281:      confidence: 0.7,
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:285:  // 6. Default type (lowest confidence)
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:289:    confidence: 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:304:      importanceTier: memory.importanceTier || memory.importance_tier,
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:323:  keywords: 'Matched keywords in title or trigger phrases',
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:489: * @param triggerPhrases - Array of trigger phrases
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:638:      reasons.push('No trigger phrases: add at least 1-2 trigger phrases');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:6:// Gate: SPECKIT_HYDE — deep + low-confidence queries only.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:84: * Low-confidence threshold: if the top result has an effective score
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:85: * below this value, the baseline is considered low-confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:90: * Minimum number of results needed to assess baseline confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:91: * An empty result set is always considered low-confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:121: * Detect whether a baseline result set has low retrieval confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:123: * A baseline is low-confidence when:
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:131: * @returns True when the baseline is low-confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:380: * for a deep + low-confidence query, log results, and return candidates
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:87:function getDecayRate(importanceTier: string | null | undefined): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:88:  if (!importanceTier || typeof importanceTier !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:92:  const rate = DECAY_CONFIG.decayRateByTier[importanceTier];
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:246:    String(memory.importance_tier || memory.importanceTier || 'normal'),
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:260: * Learns new trigger phrases from a selected result.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:263: * @returns True when trigger phrases were updated.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:40:  { pattern: /\bcontradicts?\b/i, type: 'explicit', description: 'Explicit contradiction statement' },
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:51:  contradiction: ContradictionResult | null;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:59:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:68:  contradiction_detected: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:69:  contradiction_type: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:78:  contradictions: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:90:    contradictions: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:122: * Detect contradictions between new and existing content.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:128: * Strategy: contradiction signals in the NEW content (e.g., "actually",
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:130: * existing knowledge. We only flag a contradiction when the new content
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:139:    return { detected: false, type: null, description: null, confidence: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:148:  // Specificity-based confidence per contradiction type:
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:149:  // General/weak signals get lower confidence, explicit/strong signals get higher
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:158:    explicit: 0.85,        // "contradicts" — strongest signal
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:165:    // A contradiction is signaled when:
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:166:    // 1. The NEW content contains the contradiction marker (primary signal), OR
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:170:      // New content introduces a contradiction/correction signal not present in old
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:171:      const confidence = PATTERN_CONFIDENCE[type] ?? 0.5;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:172:      if (confidence > maxConfidence) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:173:        maxConfidence = confidence;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:179:      const confidence = (PATTERN_CONFIDENCE[type] ?? 0.5) * 0.6;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:180:      if (confidence > maxConfidence) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:181:        maxConfidence = confidence;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:186:    // If both match the same pattern, it's likely inherited phrasing, not a contradiction
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:193:    confidence: maxConfidence,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:220:        { detected: false, type: null, description: null, confidence: 0 },
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:230:      contradiction: null,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:243:        { detected: false, type: null, description: null, confidence: 0 },
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:253:      contradiction: null,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:262:  // Check for contradiction
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:264:  const contradiction = detectContradiction(newContent, existingContent);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:274:    if (contradiction.detected) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:276:      reason = `High match with contradiction: ${contradiction.description}`;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:298:      contradiction,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:310:    contradiction,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:335:  contradiction: ContradictionResult,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:346:    contradiction_detected: contradiction.detected ? 1 : 0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:347:    contradiction_type: contradiction.type,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:364:        reason, contradiction_detected, contradiction_type,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:373:      record.contradiction_detected,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:374:      record.contradiction_type,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:390:    return { total: 0, byAction: {}, contradictions: 0, averageSimilarity: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:405:    const contradictions = (db.prepare(
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:406:      `SELECT COUNT(*) as count FROM memory_conflicts WHERE contradiction_detected = 1 ${specFolder ? 'AND spec_folder = ?' : ''}`
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:421:      contradictions: contradictions.count,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:427:    return { total: 0, byAction: {}, contradictions: 0, averageSimilarity: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:462:  const stats = { total: 0, creates: 0, updates: 0, supersedes: 0, reinforces: 0, contradictions: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:485:    if (result.contradiction?.detected) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:486:      stats.contradictions++;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:69:  min_quality_score?: number;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:102:  importanceTier?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:6:// Index, update, delete, and status/confidence updates.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:225:        content_text, quality_score, quality_flags, parent_id
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:308:            quality_score = ?,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:324:        content_text, quality_score, quality_flags, parent_id
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:361:    importanceTier,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:400:    if (importanceTier !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:402:      values.push(importanceTier);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:426:      updates.push('quality_score = ?');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:751: * Updates the confidence value for a memory.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:753: * @param confidence - The confidence value to store.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:754: * @returns True when the confidence was updated.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:756:export function update_confidence(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:758:  confidence: number,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:761:  if (typeof confidence !== 'number' || confidence < 0 || confidence > 1) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:762:    console.warn(`[vector-index] Invalid confidence value: ${confidence}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:769:      SET confidence = ?
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:771:    `).run(confidence, memory_id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:775:    console.warn(`[vector-index] Failed to update confidence for ${memory_id}: ${get_error_message(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:788:export { update_confidence as updateConfidence };
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:4:// When wasUseful=false is recorded via memory_validate, reduce the
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:5:// Memory's composite score via a confidence multiplier.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:12:// Feature catalog: Negative feedback confidence signal
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:56: * Compute the confidence multiplier based on negative validation count
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:103: * Apply negative feedback confidence signal to a composite score.
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts:83: * Truncate results based on confidence gap analysis.
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:7:// no results, very low-confidence results, or only partial matches.
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:14://   "status": "no_results" | "low_confidence" | "partial",
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:23:export type RecoveryStatus = 'no_results' | 'low_confidence' | 'partial';
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:47:  /** How many results were returned (0 = no_results, 1–N = partial/low_confidence). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:49:  /** Average confidence value across returned results (0–1). Only meaningful when resultCount > 0. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:51:  /** Low-confidence threshold — results below this trigger recovery. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:65: * Classify retrieval status based on result count and confidence signals.
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:76:  ) return 'low_confidence';
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:78:  return 'low_confidence'; // fallback — should only be called when recovery is warranted
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:158:  if (status === 'low_confidence') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:175: * When the search produces no results or low-confidence results, this function
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:194:  if (status !== 'no_results' && status !== 'low_confidence') return [];
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:291: *  - Average confidence below threshold, OR
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:319: * @param importanceTier Memory importance_tier field (e.g. "constitutional", "normal")
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:322:function getClassificationDecayMultiplier(contextType: string, importanceTier: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:324:  const tierMult = IMPORTANCE_TIER_STABILITY_MULTIPLIER[importanceTier] ?? 1.0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:343: * @param importanceTier Memory importance_tier field
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:349:  importanceTier: string
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:361:  const multiplier = getClassificationDecayMultiplier(contextType, importanceTier);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:432:function getHybridDecayMultiplier(contextType: string, _importanceTier?: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:451:function applyHybridDecayPolicy(stability: number, contextType: string, importanceTier?: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:452:  const multiplier = getHybridDecayMultiplier(contextType, importanceTier);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:9:// Signal confidence tiers:
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:42:  confidence: FeedbackConfidence;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:53:  confidence: FeedbackConfidence;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:62:  confidence?: FeedbackConfidence;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:75: * Infer confidence tier from event type.
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:76: * Callers may override by providing explicit confidence in the event.
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:87: * Resolve confidence for a feedback event.
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:124:    confidence TEXT NOT NULL CHECK(confidence IN ('strong','medium','weak')),
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:134:  CREATE INDEX IF NOT EXISTS idx_feedback_confidence ON feedback_events(confidence);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:180:    const confidence = resolveConfidence(event.type, event.confidence);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:183:      INSERT INTO feedback_events (type, memory_id, query_id, confidence, timestamp, session_id)
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:189:      confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:253:    if (opts.confidence) {
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:254:      conditions.push('confidence = ?');
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:255:      params.push(opts.confidence);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:307: * Returns counts broken down by confidence tier.
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:324:      SELECT confidence, COUNT(*) as cnt
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:327:      GROUP BY confidence
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:328:    `).all(memoryId) as Array<{ confidence: FeedbackConfidence; cnt: number }>;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:332:      summary[row.confidence] = row.cnt;
.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:4:// Feature catalog: Causal edge contradiction detection
.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:5:// Detects when a new edge contradicts an existing one and
.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:39:  ['supports', 'contradicts'],
.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:40:  ['caused', 'contradicts'],
.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:41:  ['enabled', 'contradicts'],
.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:63: * Check if a new edge contradicts existing edges.
.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:66: * 2. Same source+target with conflicting relations (e.g., 'supports' vs 'contradicts')
.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:67: * Returns array of contradictions found and invalidated.
.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:126:    console.warn(`[contradiction-detection] detectContradictions failed (fail-open): ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:196:  'confidence',
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:197:  'confidenceScore',
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:14:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:22:  confidenceRequired: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:24:  confidenceMet: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:30:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:33:  importanceTier: string;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:39:  confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:67:  importanceTier: string | undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:68:  confidence: number,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:71:  if (importanceTier === 'critical' || importanceTier === 'constitutional') {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:75:  return confidence >= PROMOTION_CONFIDENCE_THRESHOLD &&
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:97: * Record a validation event for a memory and persist confidence counters.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:100: * - This function updates `memory_index.confidence` and `validation_count`,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:114:        SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:121:      const currentConfidence = memory.confidence ?? CONFIDENCE_BASE;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:135:        SET confidence = ?, validation_count = ?, updated_at = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:157:        console.warn('[confidence-tracker] negative feedback recorded', {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:166:        confidence: newConfidence,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:177:    console.error(`[confidence-tracker] recordValidation failed for memory ${memoryId}:`, error);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:183: * Get current confidence score for a memory.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:189:      SELECT confidence FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:190:    `).get(memoryId) as { confidence?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:196:    return memory.confidence ?? CONFIDENCE_BASE;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:198:    console.error(`[confidence-tracker] getConfidenceScore failed for memory ${memoryId}:`, error);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:209:      SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:221:    const confidence = memory.confidence ?? CONFIDENCE_BASE;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:226:    return isPromotionEligible(memory.importance_tier, confidence, positiveValidationCount);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:228:    console.error(`[confidence-tracker] checkPromotionEligible failed for memory ${memoryId}:`, error);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:240:        SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:256:        `Requires confidence >= ${PROMOTION_CONFIDENCE_THRESHOLD} (current: ${memory.confidence ?? CONFIDENCE_BASE}) ` +
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:268:    console.warn(`[confidence-tracker] Memory ${memoryId} promoted to critical tier`);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:272:    console.error(`[confidence-tracker] promoteToCritical failed for memory ${memoryId}:`, error);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:278: * Get full confidence info for a memory.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:286:      SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:293:    const confidence = memory.confidence ?? CONFIDENCE_BASE;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:300:      confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:303:      importanceTier: memory.importance_tier || 'normal',
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:304:      promotionEligible: isPromotionEligible(memory.importance_tier, confidence, positiveValidationCount),
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:306:        confidenceRequired: PROMOTION_CONFIDENCE_THRESHOLD,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:308:        confidenceMet: confidence >= PROMOTION_CONFIDENCE_THRESHOLD,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:315:    console.error(`[confidence-tracker] getConfidenceInfo failed for memory ${memoryId}:`, error);
.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:26:  'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:28:  'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:35:    case 'memory_causal_link':   return handleMemoryCausalLink(parseArgs<CausalLinkArgs>(validateToolArgs('memory_causal_link', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:37:    case 'memory_causal_unlink': return handleMemoryCausalUnlink(parseArgs<CausalUnlinkArgs>(validateToolArgs('memory_causal_unlink', args)));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:59:    'idx_quality_score',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:89:  'contradiction_detected',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:90:  'contradiction_type',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:258:      contradiction_detected INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:259:      contradiction_type TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:333:      contradiction_detected,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:334:      contradiction_type,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:349:      ${getFirstAvailableColumnExpression(legacyColumns, ['contradiction_detected'], '0')},
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:350:      ${getFirstAvailableColumnExpression(legacyColumns, ['contradiction_type'], 'NULL')},
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:416:// V15: Add quality_score and quality_flags columns for memory quality gates
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:613:              'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:834:        database.exec('ALTER TABLE memory_index ADD COLUMN quality_score REAL DEFAULT 0');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:835:        logger.info('Migration v15: Added quality_score column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:838:          console.warn('[VectorIndex] Migration v15 warning (quality_score):', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:853:        'idx_quality_score',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:854:        'CREATE INDEX IF NOT EXISTS idx_quality_score ON memory_index(quality_score)',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1677: * Adds legacy confidence-related columns when needed.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1681:export function migrate_confidence_columns(database: Database.Database): void {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1685:  if (!column_names.includes('confidence')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1687:      database.exec(`ALTER TABLE memory_index ADD COLUMN confidence REAL DEFAULT 0.5`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1688:      console.warn('[vector-index] Migration: Added confidence column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1693:      logDuplicateColumnMigrationSkip('confidence', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2276:    migrate_confidence_columns(database);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2337:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2349:      quality_score REAL DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2470:    CREATE INDEX IF NOT EXISTS idx_quality_score ON memory_index(quality_score);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2487:export { migrate_confidence_columns as migrateConfidenceColumns };
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:96: * - Rows with a missing or non-finite `quality_score` are treated as 0.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:113:    const rawScore = row.quality_score as number | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:122:    if (row.quality_score !== 0 && row.quality_score != null) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:128:      quality_score: computeBackfillQualityScore(row),
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1167:  //   - Check if the current baseline has low confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1240:                `SELECT id, title, spec_folder, file_path, importance_tier, importance_weight, quality_score, created_at, is_archived, context_type, tenant_id, user_id, agent_id, session_id, shared_space_id FROM memory_index WHERE id IN (${placeholders})`
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:56:    toolPattern: /^(bash|memory_save|memory_update)$/i,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:3:description: "Multi-factor scoring system for memory retrieval with composite weighting, importance tiers, folder ranking and confidence tracking."
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:12:> Multi-factor scoring system for memory retrieval with composite weighting, importance tiers, folder ranking and confidence tracking.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:48:| **HVR Integration** | Human Validation Rate integration for confidence-weighted scoring (Spec 137) |
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:125:HVR integration extends the confidence tracking system by incorporating human validation signals into composite scoring. The HVR score reflects how often users confirm a memory as useful versus not useful, creating a feedback-weighted confidence metric.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:132:- Works alongside the existing promotion pipeline in `confidence-tracker.ts`
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:165: confidence-tracker.ts    # User validation and promotion
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:168: negative-feedback.ts     # Negative validation confidence multiplier with time-based recovery
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:181:| `confidence-tracker.ts` | Feedback loop: validation -> promotion |
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:184:| `negative-feedback.ts` | Negative validation confidence multiplier with 30-day half-life recovery; records negative feedback events and batch-loads stats for scoring pipeline |
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:246:import { recordValidation, getConfidenceInfo } from './confidence-tracker';
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:253:// Returns: { confidence: 0.6, validationCount: 1, promotionEligible: false }
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:255:// After 5+ validations with confidence >= 0.9
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:257:// Returns: { promotionEligible: true, wasPromoted: true, importanceTier: 'critical' }
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:64:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:68:  'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:69:  'memory_delete',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:70:  'memory_update',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:71:  'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:99:    case 'memory_match_triggers': return handleMemoryMatchTriggers(parseArgs<TriggerArgs>(validateToolArgs('memory_match_triggers', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:103:    case 'memory_health':         return handleMemoryHealth(parseArgs<HealthArgs>(validateToolArgs('memory_health', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:104:    case 'memory_delete':         return handleMemoryDelete(parseArgs<DeleteArgs>(validateToolArgs('memory_delete', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:105:    case 'memory_update':         return handleMemoryUpdate(parseArgs<UpdateArgs>(validateToolArgs('memory_update', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:106:    case 'memory_validate':       return handleMemoryValidate(parseArgs<MemoryValidateArgs>(validateToolArgs('memory_validate', args)));
.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:3:description: "Community detection, graph signal scoring, temporal edges, contradiction detection, usage tracking, and community summaries for causal memory networks."
.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:33:The graph module operates on the `causal_edges` and `memory_index` tables to detect communities, compute scoring signals, manage temporal edge validity, detect contradictions, track usage, and generate community summaries. All features are independently gated behind `SPECKIT_*` feature flags.
.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:68:  contradiction-detection.ts  # Superseding/conflicting edge detection + auto-invalidation
.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:83:| `contradiction-detection.ts` | Detects superseding and conflicting edge relations, auto-invalidates old edges via `temporal-edges.ts` | `SPECKIT_TEMPORAL_EDGES` |
.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:113:| `detectContradictions` | contradiction-detection.ts | Checks if new edge contradicts existing edges, auto-invalidates |
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:615:                quality_score, created_at, context_type
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:639:      quality_score: (parentRow.quality_score as number | undefined) ?? bestChunk.quality_score,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:184:    const confidence = detection.type === 'query_reformulated' ? 'medium' : 'weak';
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:190:        confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:220:      confidence: 'strong',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:253:      confidence: 'strong',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:55:        'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:135: * @param triggerPhrases - Optional trigger phrases for simple-tier classification
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:144:  // When feature flag is disabled, classifier returns 'complex' with 'fallback' confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/ontology-hooks.ts:44:    'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:120:    const warning = '> **⚠️ EVIDENCE GAP DETECTED:** Retrieved context has low mathematical confidence. Consider first principles.';
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:126:    const warning = '> **⚠️ EVIDENCE GAP DETECTED:** Retrieved context has low mathematical confidence. Consider first principles.';
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:4:// Structured query helpers for coverage gap detection, contradiction
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:5:/** Maximum trigger phrases stored for each memory. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:56:  confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:67:  quality_score?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:87:  confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:122:  importanceTier?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:182: * @returns Parsed trigger phrases, or an empty array on invalid input.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:627:    const importanceTier = (row.importance_tier as string | undefined) ?? 'normal';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:628:    const recency = computeRecencyScore(recencyTimestamp, importanceTier);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:653: * confidence, the class strategy's `boostFactor` is applied to the
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:666:  if (!routingResult || routingResult.confidence <= 0) return results;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:700: * confidence-multiplier demotion. The multiplier is batch-loaded from the DB
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:763:    // Apply negative feedback demotion (multiplicative confidence multiplier)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:938: *   5.  Artifact routing   (all types, when routing confidence > 0)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1006:      const importanceTier = (row.importance_tier as string | undefined) ?? 'normal';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1009:      const recencyScore = computeRecencyScore(recencyTimestamp, importanceTier);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1230:  if (config.artifactRouting && config.artifactRouting.confidence > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1304:    config.artifactRouting.confidence > 0 &&
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:40:  quality_score?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:107:  quality_score?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:180:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:6:// feedback-ledger.ts), computes confidence-weighted signal scores
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:46:/** Per-confidence-tier weights used in the weighted score formula. */
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:178: * Groups events by memoryId, counts confidence tiers, and computes
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:179: * a confidence-weighted score.  Does NOT apply min-support filtering
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:215:      entry[ev.confidence]++;
.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:54:  importanceTier: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:11:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:17:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:193:/** P3-12: Minimum confidence threshold below which "general" style fallback is used */
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:383:      confidence: Math.min(1, score),
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:399: * Classify a query string into one of 7 intent types with confidence and keyword evidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:402: * @returns Intent result with type, confidence, per-intent scores, and matched keywords
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:408:      confidence: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:467:  // P3-12: If top score is below minimum confidence, return "understand" with low confidence
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:472:      confidence: topScore,
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:481:    confidence: Math.min(1, topScore),
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:492: * @returns Intent result with type, confidence, scores, and keywords
.opencode/skill/system-spec-kit/mcp_server/tests/job-queue-state-edge.vitest.ts:130:  it('T005b-Q3d: getIngestForecast returns low-confidence caveat before progress starts', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/job-queue-state-edge.vitest.ts:146:      caveat: 'Forecast is low-confidence until at least one file has been processed.',
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:17:// Feature catalog: Negative feedback confidence signal
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:31:  applyClassificationDecay?: (stability: number, contextType: string, importanceTier: string) => number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:214:function applyClassificationDecayFallback(stability: number, contextType: string, importanceTier: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:216:  const tierMult = CLASSIFICATION_TIER_STABILITY_MULTIPLIER[importanceTier] ?? 1.0;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:38:  contradictionDensity: number;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:194:  // contradictionDensity: CONTRADICTS edges / all edges
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:199:  const contradictEdgeCount = (d.prepare(
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:203:  const contradictionDensity = allEdgeCount > 0
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:204:    ? contradictEdgeCount / allEdgeCount
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:216:    contradictionDensity,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:30:// 3. Apply evidence gap detection via TRM (Z-score confidence check)
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:38:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:256: * Returns a RoutingResult with the detected class, strategy, and confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:262:    confidence: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:302:  const confidence = bestScore > 0 ? Math.min(1, bestScore / 6) : 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:310:      confidence: 0.4,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:321:        confidence: 0.3, // Low confidence from folder hint only
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:329:    confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:4:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:157:// In-memory cache of trigger phrases for fast matching
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:208:  // word breaks. For pure CJK trigger phrases, prefer substring matching so valid
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:337:/** Load all trigger phrases from the index into memory */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:380:        console.warn(`[trigger-matcher] Failed to parse trigger phrases for memory ${row.id}: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:621:/** Match user prompt against trigger phrases using exact string matching */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:694:/** Match trigger phrases with additional stats */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:725:/** Get all unique trigger phrases in the cache */
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:119:**Score immutability invariant**: Stage 4 MUST NOT modify scores. Enforced via compile-time `Stage4ReadonlyRow` readonly fields and runtime `captureScoreSnapshot` / `verifyScoreInvariant` defence-in-depth. Applies memory-state filtering (HOT/WARM/COLD/DORMANT/ARCHIVED with per-tier limits), evidence gap detection (Z-score confidence check), quality floor (`QUALITY_FLOOR=0.005`), and token budget truncation.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:250:| **TypeScript**       | `channel-representation.ts`, `channel-enforcement.ts`, `confidence-truncation.ts` (quality)   |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:305:| `confidence-truncation.ts` | -      | TypeScript | Removes low-confidence tail using 2x median gap heuristic (min 3 results) (Sprint 3) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:309:| `evidence-gap-detector.ts` | -      | TypeScript | Z-score confidence check on RRF scores to detect low-confidence retrieval |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:333:| `confidence-scoring.ts`    | -      | TypeScript | Computes calibrated confidence scores for retrieval results |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:649:| `contradicts` | 0.7 | Contradiction signal |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:719:`buildBm25DocumentText()` builds the canonical lexical document from title, content, trigger phrases, and folder metadata. `normalizeLexicalQueryTokens()` is shared by BM25 and SQLite FTS flows so lexical matching stays aligned across search channels.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:801:// -> { type: 'add_feature', confidence: 0.85 }
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:963:- Query pipeline additions: query complexity routing, channel representation, confidence truncation, dynamic token budgets, folder discovery
.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts:5:// 100+ stop words that should never be learned as trigger phrases.
.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts:57:   to serve as meaningful trigger phrases.
.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts:76: * as trigger phrases. All terms stored in lowercase for case-insensitive matching.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:98:- TRM evidence-gap detection (Z-score confidence check on score distribution).
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:37:    confidence: 0.95,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:71:    importanceTier: 'critical',
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:77:    confidence: 0.95,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:103:    expect(memory.importanceTier).toBe('critical');
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:213:    expect(memory.confidence).toBe(0.95);
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:11:// 2. quality_score    → direct numeric quality metric from DB column
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:26: * Used when quality_score is absent or zero.
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:71:  /** Normalised quality score in [0, 1] derived from quality_score or importance_tier. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:160: *   1. `quality_score` from the DB column (direct metric, highest priority).
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:168: * (no tier, no quality_score, no content with markers).
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:180:  // A positive, finite quality_score from the DB is the authoritative signal.
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:183:  const dbQualityScore = typeof row.quality_score === 'number' && Number.isFinite(row.quality_score) && row.quality_score > 0
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:184:    ? row.quality_score
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:191:    // Fall back to tier-derived score when no DB quality_score is available.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1094:export function get_usage_stats(options: UsageStatsOptions = {}): Array<{ id: number; title: string | null; spec_folder: string; file_path: string; access_count: number; last_accessed: number | null; confidence: number | null; created_at: string }> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1101:  const valid_sort_fields = ['access_count', 'last_accessed', 'confidence'];
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1109:           last_accessed, confidence, created_at
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1121:    confidence: number | null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1137:export function find_cleanup_candidates(options: CleanupOptions = {}): Array<{ id: number; specFolder: string; filePath: string; title: string; createdAt: string | undefined; lastAccessedAt: number | undefined; accessCount: number; confidence: number; ageString: string; lastAccessString: string; reasons: string[] }> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1160:      confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1166:      OR confidence <= ?
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1171:      confidence ASC
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1203:    if ((row.confidence || 0.5) <= maxConfidence) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1204:      reasons.push(`low importance (${Math.round((row.confidence || 0.5) * 100)}%)`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1215:      confidence: row.confidence || 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1229:export function get_memory_preview(memory_id: number, max_lines = 50): { id: number; specFolder: string; filePath: string; title: string; createdAt: string | undefined; lastAccessedAt: number | undefined; accessCount: number; confidence: number; ageString: string; lastAccessString: string; content: string } | null {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1276:    confidence: memory.confidence || 0.5,
.opencode/skill/system-spec-kit/mcp_server/database/README.md:72:- Use MCP tools (`memory_stats`, `memory_health`, `memory_index_scan`) for normal operations.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:24:  quality_score?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:86:    const rawScore = result.quality_score as number | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:189: * No-op if routing result is absent, unknown, or zero-confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:196:  if (!routingResult || routingResult.detectedClass === 'unknown' || routingResult.confidence <= 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:37:| `memory-parser.ts` | Parses titles, trigger phrases, tiers, document type, causal links, anchors, and content hashes from markdown files |
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:5:// Transparent Reasoning Module (TRM): Z-score confidence check
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:6:// On RRF scores to detect low-confidence retrieval and inject
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:14:/** Z-score threshold below which retrieval confidence is considered low. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:35:  /** True when retrieval confidence is too low to trust results. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:208:  return `> **[EVIDENCE GAP DETECTED]: Retrieved context has low mathematical confidence (Z=${trm.zScore.toFixed(2)}). Consider first principles.**`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2b-enrichment.ts:39:  // Extract spec quality signals (SPECKIT_LEVEL, quality_score,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:25:  migrate_confidence_columns,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:47:  update_confidence,
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:168:    it('returns operational labels with bounded relevance and confidence', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:181:      expect(labels[0].confidence).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:182:      expect(labels[0].confidence).toBeLessThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:195:        { queryId: 'q1', memoryId: 42, relevance: 3, confidence: 0.95, reasoning: 'Highly relevant' },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:196:        { queryId: 'q2', memoryId: 43, relevance: 1, confidence: 0.6 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:205:        { queryId: 'q1', memoryId: 42, relevance: 1, confidence: 0.5 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:208:        { queryId: 'q1', memoryId: 42, relevance: 3, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:222:        { queryId: 'q1', memoryId: 42, relevance: 3, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:223:        { queryId: 'q2', memoryId: 43, relevance: 2, confidence: 0.85 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:224:        { queryId: 'q3', memoryId: 44, relevance: 1, confidence: 0.7 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:243:        { queryId: 'q1', memoryId: 42, relevance: 0, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:244:        { queryId: 'q2', memoryId: 43, relevance: 0, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:262:        { queryId: 'q1', memoryId: 1, relevance: 3, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:263:        { queryId: 'q2', memoryId: 2, relevance: 2, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:264:        { queryId: 'q3', memoryId: 3, relevance: 1, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:265:        { queryId: 'q4', memoryId: 4, relevance: 0, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:266:        { queryId: 'q5', memoryId: 5, relevance: 2, confidence: 0.9 }, // disagrees
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:285:        { queryId: 'q1', memoryId: 1, relevance: 3, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:286:        { queryId: 'q2', memoryId: 2, relevance: 2, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:287:        { queryId: 'q3', memoryId: 3, relevance: 1, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:288:        { queryId: 'q4', memoryId: 4, relevance: 3, confidence: 0.9 }, // disagrees
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:289:        { queryId: 'q5', memoryId: 5, relevance: 3, confidence: 0.9 }, // disagrees
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:307:        { queryId: 'q1', memoryId: 1, relevance: 3, confidence: 0.9 }, // exact match
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:308:        { queryId: 'q2', memoryId: 2, relevance: 2, confidence: 0.9 }, // +1 from manual
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:309:        { queryId: 'q3', memoryId: 3, relevance: 0, confidence: 0.9 }, // -2 from manual
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:326:        { queryId: 'q1', memoryId: 1, relevance: 3, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:327:        { queryId: 'q99', memoryId: 99, relevance: 0, confidence: 0.9 }, // no manual match
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:343:        { queryId: 'q1', memoryId: 1, relevance: 3, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:358:        { queryId: 'q1', memoryId: 1, relevance: 3, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:359:        { queryId: 'q2', memoryId: 2, relevance: 0, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:401:        { queryId: 'q1', memoryId: 42, relevance: 3, confidence: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:402:        { queryId: 'q2', memoryId: 43, relevance: 2, confidence: 0.8 },
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:418:        { queryId: 'q3', memoryId: 44, relevance: 2, confidence: 0.8 },
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:43:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:53:  importanceTier: string;
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:266:    importanceTier: importance_tier,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:278:    importanceTier: importance_tier,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:286:    memoryTypeConfidence: typeInference.confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:541:/** Extract trigger phrases from ## Trigger Phrases section OR YAML frontmatter */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:634:  // (e.g., template comments containing "importanceTier: 'constitutional'" as documentation)
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:639:  const yamlMatch = frontmatter?.match(/(?:importance_tier|importanceTier):\s*["']?(\w+)["']?/i);
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:62:  find_decision:  ['PREFERENCE', 'CORRECTION', 'supersedes', 'contradicts'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:64:  understand:     ['caused', 'enabled', 'derived_from', 'supports', 'supersedes', 'contradicts'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:65:  find_spec:      ['caused', 'enabled', 'derived_from', 'supports', 'supersedes', 'contradicts'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:66:  refactor:       ['caused', 'derived_from', 'enabled', 'supports', 'supersedes', 'contradicts'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:67:  security_audit: ['caused', 'contradicts', 'supersedes', 'enabled', 'supports', 'derived_from'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:71:const DEFAULT_EDGE_PRIORITY = ['caused', 'enabled', 'derived_from', 'supports', 'supersedes', 'contradicts'];
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:81: * amplify the boost while weaker ones (contradicts) attenuate it.
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:93:  contradicts: 0.8,
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:235: * Alias map: CORRECTION → supersedes | contradicts
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:241:  CORRECTION:  ['supersedes', 'contradicts'],
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:429:  // 'supersedes' edges get 1.5x, 'contradicts' 0.8x, others 1.0x.
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:434:                   WHEN ce.relation = 'contradicts' THEN 0.8
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:443:                   WHEN ce.relation = 'contradicts' THEN 0.8
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:457:                                   WHEN ce.relation = 'contradicts' THEN 0.8
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:59:    tools: ['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:68:    tools: ['memory_list', 'memory_stats', 'memory_health', 'session_health']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:77:    tools: ['memory_update', 'memory_delete', 'memory_validate', 'memory_bulk_delete']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:97:      'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:99:      'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:4:// REQ-D5-004: Per-result calibrated confidence scoring
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:7:// and anchor density into a single calibrated confidence score per
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:14://   "confidence": {
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:24:// IMPORTANT: This module only models ranking confidence for retrieval ordering.
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:35:// Weights for each confidence factor (must sum to 1.0)
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:65:/** Which factors drove the confidence score upward. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:72:/** Per-result confidence payload. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:84:  confidence: RankingConfidenceContract;
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:95: * Minimal result shape needed for confidence computation.
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:196: * Map raw confidence value to a coarse label.
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:212: * Compute per-result confidence for a ranked list of results.
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:214: * Each result receives a confidence object derived from:
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:261:    // Base score is a strong prior: if the score itself is very high, confidence
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:274:        confidence: {
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:286: * - "good":  most results have high/medium confidence and a healthy top score
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:288: * - "gap":   no results, or all results have low confidence
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:291: * @param confidences - Parallel confidence array from `computeResultConfidence`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:295:  confidences: ResultConfidence[],
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:301:  const highOrMediumCount = confidences.filter(
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:302:    (c) => c.confidence.label === 'high' || c.confidence.label === 'medium',
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:319: * Check whether the per-result confidence feature flag is enabled.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:17:// Feature catalog: Negative feedback confidence signal
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:142: * Confidence-gap truncation for low-confidence tails.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:166: * T002b/A4: Negative-feedback confidence demotion in ranking.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:187: * N3-lite: Consolidation engine — contradiction scan, Hebbian strengthening,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:410: * Generates a pseudo-document for low-confidence deep queries.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:545: * REQ-D5-004: Per-result calibrated confidence scoring.
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:19:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:66:  let confidence = 0.55;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:68:    confidence = Math.max(confidence, candidate);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:99:    confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:113:  const confidence = candidate.confidence;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:120:    || typeof confidence !== 'number'
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:121:    || !Number.isFinite(confidence)
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:132:    confidence: Math.max(0, Math.min(1, confidence)),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:65:  'confidence',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:80:  'quality_score',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:141:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:158:      quality_score REAL DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:184:    CREATE INDEX IF NOT EXISTS idx_quality_score ON memory_index(quality_score);
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:65:| **Confidence Truncation** | Removes low-confidence tail results using 2x median gap detection |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:155:│   ├── confidence-truncation.ts # Confidence truncation (2x median gap, min 3 results)
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:157:│   ├── evidence-gap-detector.ts # TRM with Z-score confidence
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:168:│   ├── confidence-tracker.ts   # Confidence tracking
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:339:| `search/confidence-truncation.ts` | Low-confidence tail removal (2x median gap) |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:470:  importanceTier: 'critical',
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:505:**Trigger Matcher**: Matches user prompts to memory trigger phrases
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:508:// Find memories with matching trigger phrases
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:39:| Tool-Specific Hints | 6 tools | memory_search, checkpoint_restore, memory_save, memory_index_scan, memory_drift_why, memory_causal_link |
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:138:// Default hint is "Run memory_health() for diagnostics".
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:149:      'Run memory_health() to check embedding system status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:152:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:179:      'Run memory_health() to see current provider status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:182:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:242:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:247:      'Run memory_health() to check database integrity',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:252:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:268:      'Contact support with schema version info from memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:271:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:276:      'Run memory_health() to assess damage',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:286:      'Run memory_health() to check database status',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:291:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:316:      'Use memory_health() to see current system limits'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:336:      'Check memory_health() for system status',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:340:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:345:      'Check embedding provider status with memory_health()',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:350:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:357:      'Use memory_match_triggers() for prompt-based matching instead'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:360:    toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:447:      'Run memory_health() to check system status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:450:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:487:      'Check memory_health() for recovery options'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:490:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:529:      'Run memory_health() to check database status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:532:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:538:      'Or use memory_update() to modify existing entry',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:608:      'Valid relations: caused, enabled, supersedes, contradicts, derived_from, supports',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:610:      'See memory_causal_link() documentation for relation semantics'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:659:      'Check memory_health() for system status',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:663:    toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:677:    'Run memory_health() for diagnostics',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:682:  toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:699:        'Check embedding provider status: memory_health()',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:700:        'Try memory_match_triggers() for trigger-based matching'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:703:      toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:734:        'Run memory_health() to verify database integrity'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:737:      toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:757:        'Check memory_health() for embedding provider status'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:760:      toolTip: 'memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:802:  memory_causal_link: {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:56:  memory_match_triggers: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:58:  memory_delete: ERROR_CODES.MEMORY_DELETE_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:59:  memory_update: ERROR_CODES.MEMORY_UPDATE_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:63:  memory_causal_link: ERROR_CODES.CAUSAL_GRAPH_ERROR,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:65:  memory_causal_unlink: ERROR_CODES.CAUSAL_GRAPH_ERROR,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:4:// Feature catalog: Causal edge creation (memory_causal_link)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:9:import { detectContradictions } from '../graph/contradiction-detection.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:22:  CONTRADICTS: 'contradicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:39:  contradicts:  0.8,  // Dampened — conflicting signals lower confidence
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:29:  confidence: number,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:34:    confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:817:  // CONTAINS: class -> method (confidence 1.0)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:831:  // IMPORTS (confidence 1.0)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:844:  // EXPORTS (confidence 1.0)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:857:  // EXTENDS: class -> parent class (confidence 0.95)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:872:  // IMPLEMENTS: class -> interface (confidence 0.95)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:889:  // CALLS: function/method -> called function (confidence 0.8)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:922:  // DECORATES: decorator symbol -> decorated class/function/method (confidence 0.9)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:944:  // OVERRIDES: method -> parent class method (confidence 0.9)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:970:  // TYPE_OF: symbol -> referenced type symbol (confidence 0.85)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:1142:  // Cross-file TESTED_BY edges (heuristic, confidence 0.6)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:15:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:115: * Returns intent + confidence score. Hybrid intent means
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:120:    return { intent: 'hybrid', confidence: 0.5, structuralScore: 0, semanticScore: 0, matchedKeywords: [] };
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:138:    return { intent: 'hybrid', confidence: 0.5, structuralScore: 0, semanticScore: 0, matchedKeywords };
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:154:      confidence: computeConfidence(structuralRatio),
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:165:      confidence: computeConfidence(semanticRatio),
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:172:  // Ambiguous → hybrid with moderate confidence
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:175:    confidence: 0.5 + Math.abs(structuralRatio - semanticRatio) * 0.3,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:71:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:139:    confidence REAL NOT NULL DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:329: * relevance grades (0-3) and confidence (0-1). This provides an
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:356:          confidence: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:375:      const confidenceBase = 0.2 + (overlap * 0.7) + (phraseMatch ? 0.1 : 0);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:376:      const confidence = Math.round(clamp01(confidenceBase) * 1000) / 1000;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:382:        confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:405:        (query_id, memory_id, relevance, confidence, reasoning)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:416:          label.confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:4:// Lightweight graph maintenance: contradiction scan, Hebbian
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:53:  contradictions: ContradictionCluster[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:63:/** Cosine similarity threshold for contradiction candidates */
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:69:/** Negation keywords for lightweight contradiction heuristic */
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:81: * Find potential contradictions by:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:123: * Vector-based contradiction scan using sqlite-vec cosine similarity.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:185: * Heuristic-only contradiction scan when vector similarity is unavailable.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:238: * Check if two texts contain negation patterns suggesting contradiction.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:248:    // One has negation, the other doesn't → potential contradiction
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:284: * Surface all members of a contradiction cluster.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:285: * When a contradiction pair is detected, find ALL related memories
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:440:  const contradictionPairs = scanContradictions(database);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:441:  const contradictions = buildContradictionClusters(database, contradictionPairs);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:469:    contradictions,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:76:    it('T517-2: handle_memory_match_triggers alias exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:77:      expect(typeof handler.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:141:      contradiction_detected INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:154:        'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:772:        contradiction_detected INTEGER,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:828:      importanceTier: 'normal',
.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:193:  it('fix_bug: CORRECTION covers contradicts as well', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:194:    const contradicts = causalBoost.resolveEdgePrior('contradicts', 'fix_bug');
.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:195:    // CORRECTION alias covers both supersedes and contradicts at tier 0
.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:196:    expect(contradicts).toBe(1.0);
.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:214:    expect(supersedes).toBe(0.75); // CORRECTION → supersedes/contradicts → tier 1
.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:221:    // DEFAULT: ['caused', 'enabled', 'derived_from', 'supports', 'supersedes', 'contradicts']
.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:381:    expect(causalBoost.RELATION_WEIGHT_MULTIPLIERS['contradicts']).toBe(0.8);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:269:        confidence: 0.9,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:31:  quality_score?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:58:  'spec_level', 'quality_score', 'quality_flags', 'parent_id',
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:231:        'mcp:memory_delete',
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:354:      'mcp:memory_update',
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:355:      'mcp:memory_delete',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:474:      quality_score,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:502:    importance_tier: parsed.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:508:    quality_score: parsed.qualityScore ?? 0,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:49:| `consolidation.ts` | N3-lite contradiction, Hebbian, and stale-edge maintenance |
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:8:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:12:  { tool: 'memory_health', handler: 'handleMemoryHealth', layer: 'L3' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:13:  { tool: 'memory_delete', handler: 'handleMemoryDelete', layer: 'L4' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:14:  { tool: 'memory_update', handler: 'handleMemoryUpdate', layer: 'L4' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:15:  { tool: 'memory_validate', handler: 'handleMemoryValidate', layer: 'L4' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:23:  { tool: 'memory_causal_link', handler: 'handleMemoryCausalLink', layer: 'L6' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:25:  { tool: 'memory_causal_unlink', handler: 'handleMemoryCausalUnlink', layer: 'L6' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:34:  { camel: 'handleMemoryMatchTriggers', snake: 'handle_memory_match_triggers' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:38:  { camel: 'handleMemoryHealth', snake: 'handle_memory_health' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:39:  { camel: 'handleMemoryDelete', snake: 'handle_memory_delete' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:40:  { camel: 'handleMemoryUpdate', snake: 'handle_memory_update' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:41:  { camel: 'handleMemoryValidate', snake: 'handle_memory_validate' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:50:  { camel: 'handleMemoryCausalLink', snake: 'handle_memory_causal_link' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:52:  { camel: 'handleMemoryCausalUnlink', snake: 'handle_memory_causal_unlink' },
.opencode/skill/system-spec-kit/mcp_server/tests/contradiction-detection.vitest.ts:15:import type { ContradictionResult } from '../lib/graph/contradiction-detection.js';
.opencode/skill/system-spec-kit/mcp_server/tests/contradiction-detection.vitest.ts:16:import { detectContradictions } from '../lib/graph/contradiction-detection.js';
.opencode/skill/system-spec-kit/mcp_server/tests/contradiction-detection.vitest.ts:67:    const result = detectContradictions(db, 1, 2, 'contradicts');
.opencode/skill/system-spec-kit/mcp_server/tests/contradiction-detection.vitest.ts:80:  it('detects supersedes contradiction', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/contradiction-detection.vitest.ts:108:  it('detects conflicting relation pairs (supports vs contradicts)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/contradiction-detection.vitest.ts:111:    const result = detectContradictions(db, 7, 8, 'contradicts');
.opencode/skill/system-spec-kit/mcp_server/tests/contradiction-detection.vitest.ts:123:        reason: "Conflicting relations: existing 'supports' vs new 'contradicts'",
.opencode/skill/system-spec-kit/mcp_server/tests/contradiction-detection.vitest.ts:130:      "Conflicting relations: existing 'supports' vs new 'contradicts'",
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:378:        qualityFlags: ['No trigger phrases found'],
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:264:    detail: 'Queries must be NOT derived from trigger phrases',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:25:  confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:330:      "expectedResultDescription": "AND-search style query. Should surface causal-edges.ts, memory_causal_link tool schema, and any memories about the causal graph design.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:570:      "expectedResultDescription": "Should surface memories with trigger phrases matching \"content hash\" or \"deduplication\". Likely surfaces T054-related memories about SHA256 dedup implementation.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:571:      "notes": "Derived from known trigger phrases in the memory system related to content hash dedup."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:590:      "expectedResultDescription": "Should surface session-boost.ts, working-memory.ts, and memories with trigger phrases about session boost or attention scoring.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:661:      "notes": "Derived from \"BM25\" and \"stemming\" trigger phrases in the BM25 index module."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:671:      "notes": "Derived from \"causal edge\" and \"graph traversal\" trigger phrases."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:681:      "notes": "Derived from \"decision record\" and \"level 3\" trigger phrases in spec kit documentation."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:691:      "notes": "Derived from \"maximal marginal relevance\" or \"MMR\" trigger phrases."
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1264:    if (column === 'confidence') return 0.5;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1271:  if (column === 'confidence') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1337:    'confidence',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1348:    'quality_score',
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:105:    expect(typeof result.confidence).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:114:    expect(result.confidence).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:121:    expect(result.confidence).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:420:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:646:  it('C138-T2: classifyIntent returns confidence between 0 and 1', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:648:    expect(result.confidence).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:649:    expect(result.confidence).toBeLessThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:61:  importanceTier?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:280:      const mergedImportanceTier = newMemory.importanceTier ?? getOptionalString(currentRow, 'importance_tier');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:914:    quality_score: existingRow.quality_score,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:31:    surface: 'memory_health';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:88:      surface: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:100:      recommendedAction: 'Use memory_health({ autoRepair: true, confirmed: true }) for bounded repair workflows and transparent partial-success reporting.',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:53:  confidence: number; // 0.0 - 1.0
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:123:        confidence: 0.9,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:138:    confidence: 0.1,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:160:        confidence: 1.0,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:175:    confidence: 0.1,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:202:          confidence: 1.0,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:223:          confidence: Math.max(0, 0.95 - (distance * 0.02)),
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:244:          confidence: 0.7,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:258:      confidence: 0.3,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:288:  // Sort by confidence descending
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:289:  refs.sort((a, b) => b.confidence - a.confidence);
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:65:    importanceTier?: string;
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:79:    opts.importanceTier ?? 'normal',
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:256:      importanceTier: 'deprecated',
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:387:      importanceTier: 'deprecated',
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:89:      avgConfidence: undefined, // no confidence data
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:143:  it('emits status "low_confidence" when avgConfidence < threshold', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:148:    expect(payload.status).toBe('low_confidence');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:250:  it('recommends "ask_user" for low_confidence + knowledge_gap', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:257:    expect(payload.status).toBe('low_confidence');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:324:    const validStatuses = ['no_results', 'low_confidence', 'partial'] as const;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:290:/** Result of bootstrap confidence interval computation. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:312: * Compute bootstrap 95% confidence interval for MRR@5.
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:876:        confidence: 0.8,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:919:        confidence: 0.8,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-types.vitest.ts:150:        { content: '---\nimportanceTier: critical\n---', expected: 'semantic' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-types.vitest.ts:204:        importanceTier: 'important',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-types.vitest.ts:209:        importanceTier: 'important',
.opencode/skill/system-spec-kit/mcp_server/tests/causal-boost.vitest.ts:122:    const expectedRelations = ['supersedes', 'contradicts', 'caused', 'enabled', 'derived_from', 'supports'];
.opencode/skill/system-spec-kit/mcp_server/tests/causal-boost.vitest.ts:177:      VALUES ('1', '2', 'supersedes', 1.0), ('1', '3', 'contradicts', 1.0)
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:242:| `confidence` | `number` | Clamped transition confidence in the range `[0, 1]` |
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:54:      quality_score REAL DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:121:    importanceTier: 'normal',
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:452:    it('T054-6f: Same-path unchanged does not short-circuit when trigger phrases changed', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:453:      const content = 'Existing same-path row with stale trigger phrases.';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:457:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, trigger_phrases, quality_score, quality_flags, parent_id
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:483:      const content = 'Existing same-path row with stale trigger phrases.';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:487:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, trigger_phrases, quality_score, quality_flags, parent_id
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:57:    importanceTier: 'normal',
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:142:          'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:23:  importanceTier: string;
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:158:    importanceTier: 'normal',
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:19:} from '../lib/search/confidence-truncation';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:104:        contradiction_detected INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:118:          'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:442:    it.skipIf(!canRun || !hasModuleDb)('logs contradiction decision', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:448:        contradiction: {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:452:          confidence: 0.85,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:455:      expect(() => logPeFn!(decision, 'test-hash-002', 'specs/contradiction-folder')).not.toThrow();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:508:        importanceTier: 'normal',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:531:        importanceTier: 'normal',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:561:        importanceTier: 'normal',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:591:        importanceTier: 'normal',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:614:        importanceTier: 'normal',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:749:        importanceTier: 'important',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:776:        importanceTier: 'critical',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:783:      expect(result.importanceTier).toBe('critical');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:898:        importanceTier: 'normal',
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:326:    confidence: Math.max(0, Math.min(1, transition.confidence)),
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:708:      confidence: Math.max(0, Math.min(1, t.transitionDiagnostics.confidence)),
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:89:      validateToolInputSchema('memory_delete', { id: '42' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:160:   3. memory_delete SCHEMA (oneOf REMOVED — HANDLER-VALIDATED)
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:163:describe('memory_delete schema (oneOf removed, handler-validated)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:166:      validateToolInputSchema('memory_delete', { id: 42 }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:172:      validateToolInputSchema('memory_delete', { id: '42' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:178:      validateToolInputSchema('memory_delete', { specFolder: 'specs/001-test', confirm: true }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:184:      validateToolInputSchema('memory_delete', { id: 1, specFolder: 'specs/001-test' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:190:      validateToolInputSchema('memory_delete', {}, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:196:      validateToolInputSchema('memory_delete', { specFolder: 'specs/001', confirm: false }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:202:      validateToolInputSchema('memory_delete', { specFolder: 'specs/001', confirm: 'yes' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:208:      validateToolInputSchema('memory_delete', { id: true }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:378:  it('public and runtime schemas accept governed scope fields for memory_match_triggers', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:389:      validateToolInputSchema('memory_match_triggers', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:391:    expect(validateToolArgs('memory_match_triggers', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:465:    const causalLink = TOOL_DEFINITIONS.find((entry) => entry.name === 'memory_causal_link');
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:479:describe('memory_health schema', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:482:      validateToolInputSchema('memory_health', { reportMode: 'divergent_aliases', limit: 201 }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:488:      validateToolInputSchema('memory_health', { autoRepair: true, confirmed: true }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:493:    const parsed = validateToolArgs('memory_health', { autoRepair: true, confirmed: true });
.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:163:vi.mock('../lib/search/confidence-scoring', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:9:const VALID_RECOVERY_STATUSES = ['no_results', 'low_confidence', 'partial'] as const;
.opencode/skill/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:134:  it('classifies weak result sets as low_confidence', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:163:    expect(envelope.data.recovery?.status).toBe('low_confidence');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:31:  quality_score: number;
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:97:        confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:537:        'ALTER TABLE memory_index ADD COLUMN quality_score REAL DEFAULT 0',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:556:            quality_score = ?,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:581:            quality_score = 0,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:593:        SELECT canonical_file_path, content_hash, content_text, quality_score, quality_flags, chunk_index, chunk_label
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:603:      expect(restored.quality_score).toBe(0.91);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1027:          typeof parsed.data?.confidence === 'number' ||
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1049:        expect(typeof parsed.data?.confidence === 'number').toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:855:    const lowRecallVectorSearch = () => [{ id: 1, similarity: 0.01, content: 'vector low confidence' }];
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1274:  it('T024: co-activation promotion happens before confidence truncation drops tail candidates', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:70:        'handle_memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tests/causal-fixes.vitest.ts:28:          'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
.opencode/skill/system-spec-kit/mcp_server/tests/causal-fixes.vitest.ts:144:      causalEdges.insertEdge('1', '5', 'contradicts', 0.5, null);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-fixes.vitest.ts:158:      expect(relations).toContain('contradicts');
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:37:  confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:78:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:105:    INSERT INTO memory_index (spec_folder, file_path, title, content_text, importance_tier, created_at, last_accessed, access_count, confidence, is_pinned, stability, half_life_days)
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:117:    data.confidence || 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:178:        confidence: 0.9,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:188:        confidence: 0.2,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:207:        confidence: 0.2,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:226:        confidence: 0.1,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:244:        confidence: 0.1,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:515:        confidence: 0.9,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:521:        confidence: 0.9,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:527:        confidence: 0.2,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:535:        confidence: 0.1,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:552:        confidence: 0.2,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:569:        confidence: 0.2,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:638:          confidence: 0.1,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:659:          confidence: 0.1,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:679:        confidence: 0.1,
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:40:  it('T1: extracts qualityScore from db quality_score when present and positive', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:41:    const row = makeRow({ quality_score: 0.85 });
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:50:    const rowHigh = makeRow({ quality_score: 1.5 });
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:53:    // Negative quality_score is treated as absent. Without a tier, returns null.
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:54:    const rowLow = makeRow({ quality_score: -0.3 });
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:57:    // Negative quality_score with a tier falls back to tier score.
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:58:    const rowLowWithTier = makeRow({ quality_score: -0.3, importance_tier: 'normal' });
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:62:  it('T3: falls back to tier score when quality_score is zero', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:63:    const row = makeRow({ quality_score: 0, importance_tier: 'critical' });
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:70:  it('T4: falls back to tier score when quality_score is absent', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:233:  it('T15: returns null when row has no signals (no tier, no quality_score, no content)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:278:      makeRow({ id: 1, importance_tier: 'critical', quality_score: 0.9 }),
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:313:        quality_score: 0.92,
.opencode/skill/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:343:        quality_score: 0.8,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:69:      expect(result.contradiction?.detected ?? false).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:72:    it('T504: contradiction markers in new content route to SUPERSEDE', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:82:      expect(result.contradiction?.detected).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:83:      expect(result.contradiction?.type).toBe('deprecation');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:152:        { detected: true, type: 'deprecation', description: 'Previous guidance replaced', confidence: 0.75 },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:160:      expect(record.contradiction_detected).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:161:      expect(record.contradiction_type).toBe('deprecation');
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:55:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:54:        confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:8:import * as confidenceTracker from '../lib/scoring/confidence-tracker';
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:23:    confidence = 0.95,
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:25:  }: { tier?: string; confidence?: number; validationCount?: number } = {},
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:28:    INSERT INTO memory_index (id, title, confidence, validation_count, importance_tier, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:30:  `).run(id, `memory-${id}`, confidence, validationCount, tier, new Date().toISOString());
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:41:        confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:58:  it('confidence-tracker eligibility subtracts negative validations from threshold counts', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:59:    insertMemory(1, { confidence: 0.95, validationCount: 5, tier: 'normal' });
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:60:    expect(confidenceTracker.checkPromotionEligible(db, 1)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:65:    expect(confidenceTracker.checkPromotionEligible(db, 1)).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:67:    const info = confidenceTracker.getConfidenceInfo(db, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:74:    insertMemory(2, { confidence: 0.9, validationCount: 4, tier: 'normal' });
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:76:    const negativeResult = confidenceTracker.recordValidation(db, 2, false);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:85:    const positiveResult = confidenceTracker.recordValidation(db, 2, true);
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:71:     Production: getDecayRate(importanceTier: string | null | undefined): number
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:4:import * as confMod from '../lib/scoring/confidence-tracker';
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:18:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:29:  confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:35:    'INSERT INTO memory_index (id, title, confidence, validation_count, importance_tier) VALUES (?, ?, ?, ?, ?)'
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:39:    opts.confidence ?? 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:87:      insertMemory(db, 1, { confidence: 0.95, validation_count: 6, importance_tier: 'normal' });
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:99:      insertMemory(db, 1, { confidence: 0.95, validation_count: 7, importance_tier: 'important' });
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:110:        'INSERT INTO memory_index (id, title, confidence, validation_count, importance_tier, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:121:      insertMemory(db, 1, { confidence: 0.99, validation_count: 10, importance_tier: 'critical' });
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:130:      insertMemory(db, 1, { confidence: 0.99, validation_count: 10, importance_tier: 'constitutional' });
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:139:      insertMemory(db, 1, { confidence: 0.3, validation_count: 1, importance_tier: 'normal' });
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:155:      insertMemory(db, 1, { confidence: 0.4, validation_count: 2, importance_tier: 'normal' });
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:167:      insertMemory(db, 1, { confidence: ct, validation_count: vt, importance_tier: 'normal' });
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:174:    it('T-CT16 fails just below confidence threshold', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:178:      insertMemory(db, 1, { confidence: ct - 0.01, validation_count: vt, importance_tier: 'normal' });
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:189:      insertMemory(db, 1, { confidence: ct, validation_count: vt - 1, importance_tier: 'normal' });
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:355:          quality_score: 0.91,
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:363:    mockSearch.mockResolvedValue([{ id: 1, score: 0.93, title: 'baseline-hit', quality_score: 0.93 }]);
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:389:      quality_score: 0.99,
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:398:    mockSearch.mockResolvedValue([{ id: 1, score: 0.95, title: 'baseline-version', quality_score: 0.95 }]);
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:426:          quality_score: 0.95,
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:437:          quality_score: 0.3,
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:475:          quality_score: 0.92,
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:489:          quality_score: 0.9,
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:65:    confidence: 'strong',
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:230:  it('counts confidence tiers separately', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:233:      makeEvent({ confidence: 'strong', sessionId: 'sess-1' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:234:      makeEvent({ confidence: 'medium', sessionId: 'sess-2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:235:      makeEvent({ confidence: 'weak',   sessionId: 'sess-3' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:249:      makeEvent({ confidence: 'strong', sessionId: 'sess-1' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:250:      makeEvent({ confidence: 'strong', sessionId: 'sess-2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:251:      makeEvent({ confidence: 'medium', sessionId: 'sess-3' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:261:      makeEvent({ confidence: 'strong', sessionId: `sess-${i}`, memoryId: 'mem-X' })
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:292:      makeEvent({ memoryId: 'mem-low',  confidence: 'weak',   sessionId: 's1' }),
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:293:      makeEvent({ memoryId: 'mem-high', confidence: 'strong', sessionId: 's2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-seed-resolver.vitest.ts:58:    expect(ref.confidence).toBeCloseTo(0.89, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-seed-resolver.vitest.ts:69:    expect(ref.confidence).toBeLessThan(0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:142:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:148:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:154:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:160:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:166:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:172:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:178:    expect(result.confidence).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:190:    expect(result.confidence).toBe(0.3); // Low confidence from folder hint
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:395:      const triggerKey = generateCacheKey('memory_match_triggers', { prompt: 'test' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:397:      set(triggerKey, 'trigger_result', { toolName: 'memory_match_triggers' });
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:112:    importanceTier: 'normal',
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:2:// Covers: contradiction scan, Hebbian strengthening, staleness
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:56:        'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:485:    expect(result).toHaveProperty('contradictions');
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:496:    expect(result.contradictions).toHaveLength(0);
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:162:      'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:166:      'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:167:      'memory_delete',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:168:      'memory_update',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:170:      'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:182:      'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:184:      'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:288:      'memory_context', 'memory_search', 'memory_quick_search', 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:289:      'memory_delete', 'memory_update', 'memory_bulk_delete', 'memory_list', 'memory_stats',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:291:      'memory_validate', 'memory_save', 'memory_index_scan', 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:294:      'memory_drift_why', 'memory_causal_link', 'memory_causal_stats', 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1642:    it('T28e: L4 budget = 1000 (memory_delete)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1647:      expect(layerDefs!.getTokenBudget!('memory_delete')).toBe(1000)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1699:    const expectedAwareTools = ['memory_context', 'memory_search', 'memory_match_triggers', 'memory_list', 'memory_save', 'memory_index_scan']
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1712:    const nonAwareTools = ['memory_delete', 'checkpoint_create', 'task_preflight']
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2082:      'memory_match_triggers': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2086:      'memory_health': '[L3:Discovery]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2087:      'memory_delete': '[L4:Mutation]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2088:      'memory_update': '[L4:Mutation]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2089:      'memory_validate': '[L4:Mutation]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2097:      'memory_causal_link': '[L6:Analysis]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2099:      'memory_causal_unlink': '[L6:Analysis]',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:402:            confidence: 0.8, validation_count: 2, access_count: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:746:      importanceTier: 'critical',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:753:    expect(fields).toContain('importanceTier');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:183:        importanceTier: 'normal',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1116:        fixes: ['Re-extracted 4 trigger phrases from content'],
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1355:        fixes: ['Re-extracted 4 trigger phrases from content'],
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1403:        fixes: ['Re-extracted 4 trigger phrases from content'],
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1962:            decision: { action: 'CREATE', similarity: 0.98, reason: 'contradiction across file paths' },
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring-overflow.vitest.ts:14:    importanceTier: 'normal',
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring-overflow.vitest.ts:21:    importanceTier: 'critical',
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring-overflow.vitest.ts:35:      const score = computeRecencyScore(memory.updatedAt as string, memory.importanceTier as string);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:4:// Validates confidence computation, label thresholds, driver list
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:13:} from '../lib/search/confidence-scoring';
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:74:    const confidences = computeResultConfidence(results);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:75:    expect(confidences).toHaveLength(3);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:80:    const confidences = computeResultConfidence(results);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:81:    expect(confidences).toHaveLength(1);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:84:  it('confidence value is in [0, 1] range for all results', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:86:    const confidences = computeResultConfidence(results);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:87:    for (const c of confidences) {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:88:      expect(c.confidence.value).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:89:      expect(c.confidence.value).toBeLessThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:107:    expect(conf.confidence.label).toBe('high');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:108:    expect(conf.confidence.value).toBeGreaterThanOrEqual(0.7);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:112:    // Zero score, single channel, no reranker, no anchors → very low confidence
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:115:    expect(conf.confidence.label).toBe('low');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:116:    expect(conf.confidence.value).toBeLessThan(0.4);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:123:    expect(['medium', 'high']).toContain(conf.confidence.label);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:130:  it('large margin (>= 0.15) boosts confidence', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:133:    expect(topConf.confidence.drivers).toContain('large_margin');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:139:    expect(topConf.confidence.drivers).not.toContain('large_margin');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:144:    const confidences = computeResultConfidence(results);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:145:    const lastConf = confidences[confidences.length - 1];
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:146:    expect(lastConf.confidence.drivers).not.toContain('large_margin');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:160:    expect(conf.confidence.drivers).toContain('multi_channel_agreement');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:170:    expect(conf.confidence.drivers).not.toContain('multi_channel_agreement');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:181:    expect(conf.confidence.drivers).toContain('multi_channel_agreement');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:196:    expect(conf.confidence.drivers).toContain('multi_channel_agreement');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:207:    expect(conf.confidence.drivers).not.toContain('multi_channel_agreement');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:217:    expect(conf.confidence.drivers).toContain('reranker_boost');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:223:    expect(conf.confidence.drivers).not.toContain('reranker_boost');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:229:    expect(conf.confidence.drivers).not.toContain('reranker_boost');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:235:    expect(conf.confidence.drivers).not.toContain('reranker_boost');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:252:    expect(conf.confidence.drivers).toContain('anchor_density');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:262:    expect(conf.confidence.drivers).not.toContain('anchor_density');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:268:    expect(conf.confidence.drivers).not.toContain('anchor_density');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:279:    expect(highConf.confidence.value).toBeGreaterThan(lowConf.confidence.value);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:286:    expect(conf.confidence.value).toBeGreaterThan(0.2);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:292:    expect(conf.confidence.value).toBeGreaterThan(0.2);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:299:    expect(conf.confidence.value).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:300:    expect(conf.confidence.value).toBeLessThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:311:    expect(Array.isArray(conf.confidence.drivers)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:326:    expect(conf.confidence.drivers.length).toBeGreaterThan(1);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:327:    expect(conf.confidence.drivers).toContain('large_margin');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:328:    expect(conf.confidence.drivers).toContain('multi_channel_agreement');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:329:    expect(conf.confidence.drivers).toContain('reranker_boost');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:330:    expect(conf.confidence.drivers).toContain('anchor_density');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:342:  it('returns "good" when most results are high/medium confidence and top score is high', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:348:    const confidences = computeResultConfidence(results);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:349:    const { requestQuality } = assessRequestQuality(results, confidences);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:353:  it('returns "gap" when all results have low confidence', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:355:    const confidences = computeResultConfidence(results);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:356:    const { requestQuality } = assessRequestQuality(results, confidences);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:360:  it('returns "weak" for results with mediocre scores and mixed confidence', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:362:    const confidences = computeResultConfidence(results);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:363:    const { requestQuality } = assessRequestQuality(results, confidences);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:371:    const confidences = computeResultConfidence(results);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:372:    const { requestQuality } = assessRequestQuality(results, confidences);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:378:    const confidences = computeResultConfidence(results);
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:379:    const assessment = assessRequestQuality(results, confidences);
.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts:62:        'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts:152:        'contradicts',
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:163:    expect(shortQuery.confidence).toBe('fallback');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:167:    expect(longQuery.confidence).toBe('fallback');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:174:    expect(result.confidence).toBe('fallback');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:228:  it('reports high confidence for trigger matches', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:231:      expect(result.confidence).toBe('high');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:235:  it('reports high confidence for very short queries', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:238:      expect(result.confidence).toBe('high');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:276:  it('reports appropriate confidence for moderate tier', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:279:      expect(['low', 'medium']).toContain(result.confidence);
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:283:  it('reports low confidence near simple boundary (4 terms)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:287:      expect(result.confidence).toBe('low');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:291:  it('reports low confidence near complex boundary (8 terms)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:295:      expect(result.confidence).toBe('low');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:335:  it('reports high confidence for very long queries (>12 terms)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:341:      expect(result.confidence).toBe('high');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:345:  it('reports high confidence for content-rich queries (low stop-word ratio)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:352:      expect(result.confidence).toBe('high');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:525:      expect(result.confidence).toBe('fallback');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:533:      expect(result.confidence).toBe('fallback');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:542:      expect(result.confidence).toBe('fallback');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:551:      expect(result.confidence).toBe('fallback');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:560:      expect(result.confidence).toBe('fallback');
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:600:      expect(typeof result.confidence).toBe('string');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:51:      quality_score REAL DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:73:        'handle_memory_delete',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:74:        'handle_memory_update',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:77:        'handle_memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:160:    it('T519-U4: Invalid importanceTier throws', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-crud.vitest.ts:164:          importanceTier: 'invalid_tier' as unknown as Parameters<typeof handler.handleMemoryUpdate>[0]['importanceTier'],
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:167:    expect(contract.confidence_impact).toBe(0.8);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:172:  it('createDegradedContract clamps confidence_impact to [0, 1]', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:174:    expect(overContract.confidence_impact).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:177:    expect(underContract.confidence_impact).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:180:    expect(nanContract.confidence_impact).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:183:    expect(infContract.confidence_impact).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:52:      quality_score REAL DEFAULT 0.8,
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:65:        'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:119:          confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:118:    parts.push(`> **⚠️ EVIDENCE GAP DETECTED:** Low confidence (Z=${trm.zScore.toFixed(2)})\n`);
.opencode/skill/system-spec-kit/mcp_server/tests/degree-computation.vitest.ts:31:        'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
.opencode/skill/system-spec-kit/mcp_server/tests/degree-computation.vitest.ts:364:      expect(EDGE_TYPE_WEIGHTS['contradicts']).toBe(0.7);
.opencode/skill/system-spec-kit/mcp_server/tests/query-router.vitest.ts:287:    expect(typeof result.classification.confidence).toBe('string');
.opencode/skill/system-spec-kit/mcp_server/tests/query-router.vitest.ts:329:    expect(result.classification.confidence).toBe('fallback');
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:231:      confidenceImpact: 0.3,
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:239:    expect(contract.confidenceImpact).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:240:    expect(contract.confidenceImpact).toBeLessThanOrEqual(1.0);
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:247:      confidenceImpact: 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:251:    expect(totalFailure.confidenceImpact).toBe(1.0);
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts:265:    it('T501-13a: Unicode-aware boundaries match Cyrillic and CJK trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:16:      importanceTier: 'normal',
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:34:        createMemory({ updatedAt: now.toISOString(), importanceTier: 'important' }),
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:35:        createMemory({ updatedAt: now.toISOString(), importanceTier: 'normal' }),
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:48:        createMemory({ updatedAt: now.toISOString(), importanceTier: 'important' }),
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:49:        createMemory({ updatedAt: now.toISOString(), importanceTier: 'normal' }),
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:68:        createMemory({ specFolder: 'active-project', spec_folder: 'active-project', updatedAt: now.toISOString(), updated_at: now.toISOString(), importanceTier: 'critical', importance_tier: 'critical' }),
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:69:        createMemory({ specFolder: 'active-project', spec_folder: 'active-project', updatedAt: now.toISOString(), updated_at: now.toISOString(), importanceTier: 'important', importance_tier: 'important' }),
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:70:        createMemory({ specFolder: 'active-project', spec_folder: 'active-project', updatedAt: now.toISOString(), updated_at: now.toISOString(), importanceTier: 'normal', importance_tier: 'normal' }),
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:71:        createMemory({ specFolder: 'old-project', spec_folder: 'old-project', updatedAt: weekAgo.toISOString(), updated_at: weekAgo.toISOString(), importanceTier: 'normal', importance_tier: 'normal' }),
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:85:        createMemory({ specFolder: 'active-project', spec_folder: 'active-project', updatedAt: now.toISOString(), updated_at: now.toISOString(), importanceTier: 'critical', importance_tier: 'critical' }),
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:86:        createMemory({ specFolder: 'old-project', spec_folder: 'old-project', updatedAt: weekAgo.toISOString(), updated_at: weekAgo.toISOString(), importanceTier: 'normal', importance_tier: 'normal' }),
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:156:        createMemory({ specFolder: 'folder-a', spec_folder: 'folder-a', updatedAt: now.toISOString(), updated_at: now.toISOString(), importanceTier: 'important', importance_tier: 'important' }),
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:157:        createMemory({ specFolder: 'folder-b', spec_folder: 'folder-b', updatedAt: now.toISOString(), updated_at: now.toISOString(), importanceTier: 'normal', importance_tier: 'normal' }),
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:158:        createMemory({ specFolder: 'folder-c', spec_folder: 'folder-c', updatedAt: now.toISOString(), updated_at: now.toISOString(), importanceTier: 'critical', importance_tier: 'critical' }),
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:176:        createMemory({ specFolder: 'folder-a', spec_folder: 'folder-a', updatedAt: now.toISOString(), updated_at: now.toISOString(), importanceTier: 'important', importance_tier: 'important' }),
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:177:        createMemory({ specFolder: 'folder-b', spec_folder: 'folder-b', updatedAt: now.toISOString(), updated_at: now.toISOString(), importanceTier: 'normal', importance_tier: 'normal' }),
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:68:    expect(parsed.data.graphOps.doctor.surface).toBe('memory_health');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:206:  it('T027: memory_causal_link has tool-specific hints', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:207:    expect(TOOL_SPECIFIC_HINTS.memory_causal_link).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:208:    expect(typeof TOOL_SPECIFIC_HINTS.memory_causal_link).toBe('object');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:434:  it('T058: DEFAULT_HINT actions include memory_health() reference (REQ-009)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:437:      a.includes('memory_health()')
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:446:  it('T060: DEFAULT_HINT has toolTip for memory_health()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:447:    expect(DEFAULT_HINT.toolTip).toBe('memory_health()');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:669:  it('T087: QUERY_TOO_LONG suggests memory_match_triggers()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:672:      a.includes('memory_match_triggers()')
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:7:import * as mod from '../lib/scoring/confidence-tracker';
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:12:} from '../lib/scoring/confidence-tracker';
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:30:    confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:54:    'INSERT INTO memory_index (id, title, confidence, validation_count, importance_tier) VALUES (?, ?, ?, ?, ?)'
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:115:    it('T510-02a: Positive validation increases confidence', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:119:      expect(result.confidence).toBeGreaterThan(before);
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:141:    it('T510-03a: Negative validation decreases confidence', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:145:      expect(result.confidence).toBeLessThan(before);
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:184:      // Memory 5 has confidence=0.88, validation_count=4
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:185:      // Promotion requires confidence >= 0.9 AND validation_count >= 5
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:202:      expect(info.importanceTier).toBe('critical');
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:208:      expect(typeof info.confidence).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:220:// Verifies all 7 DB operations in confidence-tracker survive
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:239:          confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:40:    importanceTier: 'constitutional',
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:95:    const content = 'Must stop if confidence is below 80%.';
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:98:    expect(directive!.surfaceCondition).toContain('confidence is below 80%');
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:328:    const original = makeResult({ id: 42, specFolder: 'specs/core', importanceTier: 'constitutional' });
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:332:    expect(enriched[0].importanceTier).toBe('constitutional');
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:386:  it('T38: enrichment preserves importanceTier field unchanged', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:387:    const results = [makeResult({ importanceTier: 'constitutional' })];
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:389:    expect(enriched[0].importanceTier).toBe('constitutional');
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:398:      importanceTier: 'constitutional',
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:406:    expect(result.importanceTier).toBe(base.importanceTier);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:520:      importanceTier: 'constitutional',
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:554:    expect(result!.constitutional[0].importanceTier).toBe('constitutional');
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-extractor.vitest.ts:100:    it('T515-03: no duplicate trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts:170:          confidence: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts:175:          confidence: 0.8,
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:45:          'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:124:      const expectedValues = ['caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'];
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:184:      causalEdges.insertEdge('7', '8', 'contradicts', -0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:634:      causalEdges.insertEdge('5', '6', 'contradicts', 0.5); // unrelated
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:645:      causalEdges.insertEdge('5', '6', 'contradicts', 0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:710:      causalEdges.insertEdge('5', '4', 'contradicts', 0.4);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:721:      causalEdges.insertEdge('5', '4', 'contradicts', 0.4);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:728:      expect(br.contradicts).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:736:      causalEdges.insertEdge('5', '4', 'contradicts', 0.4);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:748:      causalEdges.insertEdge('5', '4', 'contradicts', 0.4);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:760:      causalEdges.insertEdge('5', '4', 'contradicts', 0.4);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:772:      causalEdges.insertEdge('5', '4', 'contradicts', 0.4);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:807:      causalEdges.insertEdge('1', '888', 'contradicts', 0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/community-detection.vitest.ts:41:  importanceTier = 'normal',
.opencode/skill/system-spec-kit/mcp_server/tests/community-detection.vitest.ts:46:  `).run(id, title, specFolder, importanceTier);
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:389:      importanceTier: 'normal',
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-edges.vitest.ts:9:import { detectContradictions } from '../lib/graph/contradiction-detection.js';
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-edges.vitest.ts:34:          'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-edges.vitest.ts:189:    it('should detect supersedes contradiction and invalidate old edge', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-edges.vitest.ts:195:      const contradictions = detectContradictions(db, 50, 60, 'supersedes');
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-edges.vitest.ts:196:      expect(contradictions).toHaveLength(1);
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-edges.vitest.ts:197:      expect(contradictions[0]!.oldEdge.relation).toBe('caused');
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-edges.vitest.ts:198:      expect(contradictions[0]!.oldRelation).toBe('caused');
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-edges.vitest.ts:199:      expect(contradictions[0]!.reason).toContain('Superseded');
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-edges.vitest.ts:208:    it('should detect conflicting relation pairs (supports vs contradicts)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-edges.vitest.ts:214:      const contradictions = detectContradictions(db, 70, 80, 'contradicts');
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-edges.vitest.ts:215:      expect(contradictions).toHaveLength(1);
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-edges.vitest.ts:216:      expect(contradictions[0]!.reason).toContain('Conflicting relations');
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-edges.vitest.ts:219:    it('should return empty array when no contradictions exist', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-edges.vitest.ts:225:      const contradictions = detectContradictions(db, 90, 100, 'enabled');
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-edges.vitest.ts:226:      expect(contradictions).toEqual([]);
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-edges.vitest.ts:235:      const contradictions = detectContradictions(db, 110, 120, 'contradicts');
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-edges.vitest.ts:236:      expect(contradictions).toEqual([]);
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:183:      expect(typeof handlerExports.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:52:        'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:65:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:84:  importanceTier?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:327:    it('3.3.4b filters single-word stopword trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:13:import { computeResultConfidence } from '../lib/search/confidence-scoring.js';
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:78:  it('keeps ranking confidence separate from structural trust axes', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:96:    expect(firstConfidence?.confidence.value).toBeTypeOf('number');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:97:    expect(firstConfidence?.confidence).not.toHaveProperty('structuralTrust');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:98:    expect(firstConfidence?.confidence).not.toHaveProperty('parserProvenance');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:99:    expect(firstConfidence?.confidence).not.toHaveProperty('evidenceStatus');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:100:    expect(firstConfidence?.confidence).not.toHaveProperty('freshnessAuthority');
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:3:// Feedback confidence signal (T002b/A4).
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:90:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:123:  confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:131:    confidence = 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:135:    INSERT INTO memory_index (id, title, trigger_phrases, created_at, importance_tier, validation_count, confidence)
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:137:  `).run(id, title, JSON.stringify(triggerPhrases), createdAt, tier, validationCount, confidence);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:86:  classifyIntent: vi.fn(() => ({ intent: 'understand', confidence: 0.9, fallback: false })),
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:28:  confidence?: ConfidencePayload;
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:52:    file_path: `/tmp/confidence-${id}.md`,
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:56:    triggerPhrases: ['retrieval', 'confidence'],
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:83:  if (!result?.confidence) {
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:84:    throw new Error(`Expected confidence payload for result ${resultId}`);
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:87:  return result.confidence;
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:90:describe('D5 Phase A: result confidence scoring', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:106:  it('assigns high confidence to a result with a large score margin', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:143:    const confidence = getResultConfidence(envelope, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:144:    expect(confidence.label).toBe('high');
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:145:    expect(confidence.value).toBeGreaterThan(0.7);
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:146:    expect(confidence.drivers).toContain('large_margin');
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:149:  it('boosts confidence when multiple channels agree on the top result', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:217:  it('assigns low confidence when the top result barely beats the runner-up', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:239:    const confidence = getResultConfidence(envelope, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:240:    expect(confidence.label).toBe('low');
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:241:    expect(confidence.value).toBeLessThan(0.4);
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:244:  it('keeps label thresholds aligned with the numeric confidence value', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:311:  it('populates confidence drivers with contributing factors', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:346:    const confidence = getResultConfidence(envelope, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:347:    expect(confidence.drivers.length).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:348:    expect(new Set(confidence.drivers).size).toBe(confidence.drivers.length);
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:349:    expect(confidence.drivers.every((driver) => DRIVER_NAMES.includes(driver as (typeof DRIVER_NAMES)[number]))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:405:  it('omits confidence when SPECKIT_RESULT_CONFIDENCE_V1 is false', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:425:    expect(envelope.data.results.every((result) => result.confidence === undefined)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:626:    it('sets confidence to 0.85', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1416:    it('does not re-add existing trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1475:      expect(typeof resolvedPreview.confidence).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:53:      expect(result.confidence).toBe(0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:66:      expect(result.confidence).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:67:      expect(result.confidence).toBeLessThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:73:    it('confidence never exceeds 0.95', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:77:      expect(result.confidence).toBeLessThanOrEqual(0.95);
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:85:      expect(result.confidence).toBe(0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:58:        confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:83:| Search and ranking | `hybrid-search.vitest.ts`, `bm25-index.vitest.ts`, `query-router.vitest.ts`, `dynamic-token-budget.vitest.ts`, `result-confidence-scoring.vitest.ts` | Retrieval, ranking, and profile/trace behavior |
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:146:Broader confidence runs:
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:137:  it('returns null for memory_match_triggers', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:138:    const result = await autoSurfaceAtToolDispatch('memory_match_triggers', { prompt: 'some prompt' });
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-health-edge.vitest.ts:130:        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:45:    confidence: {
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:103:  it('produces correct digest with confidence classification', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:105:      makeResult({ id: 1, confidence: { label: 'high', value: 0.9 } }),
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:106:      makeResult({ id: 2, confidence: { label: 'high', value: 0.8 } }),
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:107:      makeResult({ id: 3, confidence: { label: 'medium', value: 0.5 } }),
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:108:      makeResult({ id: 4, confidence: { label: 'low', value: 0.2 } }),
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:114:  it('classifies results without confidence data as "weak"', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:116:    // No confidence property → defaults to low/weak
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:123:      makeResult({ id: 1, confidence: { label: 'high', value: 0.95 } }),
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:124:      makeResult({ id: 2, confidence: { label: 'high', value: 0.85 } }),
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:137:      makeResult({ id: 1, confidence: { label: 'high', value: 0.9 } }),
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:138:      makeResult({ id: 2, confidence: { label: 'medium', value: 0.5 } }),
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:139:      makeResult({ id: 3, confidence: { label: 'low', value: 0.2 } }),
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:140:      makeResult({ id: 4, confidence: { label: 'low', value: 0.1 } }),
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:146:  it('treats missing confidence as low', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:94:     Returns: { detected: boolean, type: string|null, description: string|null, confidence: number }
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:141:    it('T120: "contradicts" detected as explicit', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:142:      const r = peGate.detectContradiction('This contradicts the previous', 'Previous');
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:147:    it('T121: Non-contradictory content NOT flagged', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:168:      expect(typeof r.confidence).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:169:      expect(r.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:172:    it('T125: Result has {detected, type, description, confidence}', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:177:      expect(r).toHaveProperty('confidence');
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:196:    it('T128: SUPERSEDE for contradictions in high match range', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:200:      expect(r.contradiction).toBeTruthy();
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:201:      expect(r.contradiction!.detected).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:356:      const contradiction = { detected: false, type: null, description: null, confidence: 0 };
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:363:        contradiction,                // contradiction
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:374:      const contradiction = { detected: false, type: null, description: null, confidence: 0 };
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:381:        contradiction,
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:387:        'reason', 'contradiction_detected', 'contradiction_type', 'new_content_preview',
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:395:      const contradiction = { detected: false, type: null, description: null, confidence: 0 };
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:402:        contradiction,
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:508:      const statFields = ['total', 'creates', 'updates', 'supersedes', 'reinforces', 'contradictions'];
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:542:    it('C138-T2: contradicting content triggers detection', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:552:    it('C138-T3: THRESHOLD constants are valid for contradiction detection', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:557:    it('C138-T4: ACTION types include contradiction-related actions', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:804:  it('memory_update wraps the update path in runInTransaction', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:5:type Row = { id: string | number; quality_score?: number };
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:16:describe('C136: minQualityScore and min_quality_score behavior', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:32:      { id: 'a', quality_score: 0.2 },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:33:      { id: 'b', quality_score: 0.5 },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:34:      { id: 'c', quality_score: 0.9 },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:43:      { id: 'a', quality_score: 0.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:44:      { id: 'b', quality_score: 0.6 },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:45:      { id: 'c', quality_score: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:71:      confidence: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:88:      confidence: 0.8,
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:66:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:74:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:80:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:316:    expect(r1.confidence).toBe(r2.confidence);
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-architecture-remediation.vitest.ts:42:      quality_score: 0.98,
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-architecture-remediation.vitest.ts:50:      quality_score: 0.1,
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:310:  it('T045-17b: quality degradation uses absolute+relative confidence checks', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:45:        confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-limit.vitest.ts:37:        confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:37:      confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:488:      confidence: 0.85,
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:497:      confidence: 0.85,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:21:        memory_match_triggers: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:24:        memory_health: 1000,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:25:        memory_update: 1000,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:26:        memory_delete: 1000,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:27:        memory_validate: 1000,
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:43:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:68:    tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:75:    tool: 'memory_delete',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:81:    tool: 'memory_update',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:87:    tool: 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:143:    tool: 'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:155:    tool: 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:179:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:180:  { tool: 'memory_delete', handler: 'handleMemoryDelete' },
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:34:    confidence: 'weak',
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:88:    expect(names).toContain('confidence');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:101:    expect(names).toContain('idx_feedback_confidence');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:176:    const id = logFeedbackEvent(db, makeEvent({ type: 'result_cited', confidence: 'strong' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:196:  it('stores all 3 confidence tiers', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:198:    logFeedbackEvent(db, makeEvent({ confidence: 'strong' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:199:    logFeedbackEvent(db, makeEvent({ confidence: 'medium' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:200:    logFeedbackEvent(db, makeEvent({ confidence: 'weak' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:202:    const tiers = events.map(e => e.confidence);
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:215:      confidence: 'strong',
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:225:    expect(row.confidence).toBe('strong');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:237:  it('auto-infers confidence from type when not overridden', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:239:    // Pass the event type's own inferred confidence to match resolveConfidence
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:244:      confidence: resolveConfidence('query_reformulated'),
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:248:    expect(events[0].confidence).toBe('medium');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:299:    logFeedbackEvent(db, makeEvent({ type: 'result_cited', confidence: 'strong' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:316:  it('filters by confidence tier', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:318:    logFeedbackEvent(db, makeEvent({ confidence: 'strong' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:319:    logFeedbackEvent(db, makeEvent({ confidence: 'medium' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:320:    logFeedbackEvent(db, makeEvent({ confidence: 'weak' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:322:    const strong = getFeedbackEvents(db, { confidence: 'strong' });
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:324:    expect(strong[0].confidence).toBe('strong');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:394:  it('aggregates correctly across confidence tiers', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:396:    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-1', confidence: 'strong' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:397:    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-1', confidence: 'strong' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:398:    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-1', confidence: 'medium' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:399:    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-1', confidence: 'weak' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:411:    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-A', confidence: 'strong' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:412:    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-B', confidence: 'weak' }));
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:448:    logFeedbackEvent(db, makeEvent({ type: 'result_cited', confidence: 'strong' }));
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:45:  importanceTier?: string;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:66:    importanceTier = 'normal',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:109:      parts.push(`importance_tier: "${importanceTier}"`);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:428:  it('auto-fix rescues missing trigger phrases from headings', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:430:    // Content with headings (for trigger extraction) but NO trigger phrases and NO anchors.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1066:  it('rejects emoji-only trigger phrases as non-semantic', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1141:  it('quality loop handles exactly 3 trigger phrases at boundary', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:39:    importanceTier: 'normal',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:95:importanceTier: important
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:125:importanceTier: [bogus
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:133:importanceTier: normal
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:526:      expect(result.importanceTier).toBe('important');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:543:      expect(result.importanceTier).toBe('normal');
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-retry-stats.vitest.ts:3:// Phase 004 CHK-023 (memory_health embeddingRetry), CHK-024 (retry manager edge cases)
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:114:        memory_match_triggers: 'L2',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:117:        memory_health: 'L3',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:118:        memory_update: 'L4',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:119:        memory_delete: 'L4',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:120:        memory_validate: 'L4',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:126:        memory_causal_link: 'L6',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:128:        memory_causal_unlink: 'L6',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:182:        { tool: 'memory_update', expected: '[L4:Mutation]' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:213:        { tool: 'memory_delete', desc: 'Delete a memory', prefix: '[L4:Mutation]' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:240:        { tool: 'memory_update', expected: 1000 },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:416:                           'memory_update', 'checkpoint_create', 'memory_drift_why',
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:116:        { id: 2, importanceTier: 'critical', stability: 1.0, specFolder: 'specs/002' },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:183:        { id: 2, title: 'Test Two', specFolder: 'specs/002', filePath: '/b.md', importanceTier: 'normal', stability: 100, created_at: new Date().toISOString() },
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts:30:} from '../lib/search/confidence-truncation';
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts:97:  it('T001-04: confidence is a valid label (high, medium, low, or fallback)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts:100:    expect(validLabels).toContain(result.confidence);
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts:107:    expect(result.confidence).toBe('fallback');
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts:113:    expect(result.confidence).toBe('fallback');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:55:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:148:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:440:          embedding_status TEXT DEFAULT 'success', confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:118:  importanceTier: string;
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:154:      quality_score REAL DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:174:    importanceTier: 'normal',
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-denylist.vitest.ts:3:// Into learned relevance feedback trigger phrases.
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:73:          'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:134:      const expected = ['caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'];
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:425:        contradicts: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:562:    it('T133: contradicts relation insertable and retrievable', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:834:    it('C138-T2: contradicts relation type exists', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:835:      expect(Object.values(causalEdges.RELATION_TYPES)).toContain('contradicts');
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:843:      expect(defaultWeight).toBeGreaterThan(weights.contradicts);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:312:      confidence: 0.85,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:335:    expect(resumed.confidence).toBe(0.95);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:351:    expect(explicit.confidence).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:43:        confidence: null,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:92:      expect(memory.importanceTier === 'normal' || memory.importanceTier === undefined).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:448:  it('J2: DEFAULT_HINT actions reference memory_health()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:450:    expect(actionsStr).toContain('memory_health');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:640:          confidence: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:50:          quality_score REAL
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:57:        CREATE INDEX idx_quality_score ON memory_index(quality_score);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:98:          contradiction_detected INTEGER,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:99:          contradiction_type TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-folder-scoring-types.vitest.ts:22:    importanceTier: 'important',
.opencode/skill/system-spec-kit/mcp_server/tests/unit-folder-scoring-types.vitest.ts:55:        makeCamelCaseMemory({ id: 2, importanceTier: 'critical' }),
.opencode/skill/system-spec-kit/mcp_server/tests/unit-folder-scoring-types.vitest.ts:83:        importanceTier: 'normal',
.opencode/skill/system-spec-kit/mcp_server/tests/unit-folder-scoring-types.vitest.ts:100:        makeCamelCaseMemory({ id: 3, specFolder: 'specs/002', importanceTier: 'critical' }),
.opencode/skill/system-spec-kit/mcp_server/tests/unit-folder-scoring-types.vitest.ts:129:        { id: 1, specFolder: 'specs/010', importanceTier: 'normal', updatedAt: new Date().toISOString() },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-folder-scoring-types.vitest.ts:130:        { id: 2, specFolder: 'specs/010', importanceTier: 'critical', updatedAt: new Date().toISOString() },
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:85:    expect(parsed.data).not.toHaveProperty('confidence');
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:74:} from '../lib/search/confidence-truncation';
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:169:      expect(intent.confidence).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:468:      expect(emptyIntent.confidence).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:625:      // Step 7: Truncate by confidence
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:133:          confidence: 0.85,
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:172:      confidence: 0.85,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-causal-graph.vitest.ts:50:        'handle_memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-causal-graph.vitest.ts:52:        'handle_memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:37:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:36:    database.exec('DROP INDEX IF EXISTS idx_quality_score');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:41:      if (sql.includes('CREATE INDEX IF NOT EXISTS idx_quality_score')) {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:42:        throw new Error('simulated idx_quality_score failure');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:47:    expect(() => ensureSchemaVersion(database)).toThrow(/simulated idx_quality_score failure/);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:54:    expect(compatibility.missingIndexes).toContain('idx_quality_score');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:175:        contradiction_detected INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:185:        similarity_score, action, contradiction_detected, notes
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:208:      SELECT id, timestamp, new_memory_hash, existing_memory_id, similarity, reason, contradiction_detected
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:218:      contradiction_detected: number;
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:228:      contradiction_detected: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:115:            confidence: 0.8,
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:139:      confidence: 0.8,
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:145:    expect(parsed.data).not.toHaveProperty('confidence');
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:23:    expect(contract.doctor.surface).toBe('memory_health');
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:178:      decision_meta: { confidence: 0.95, strategy: 'dedup' },
.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/contradiction-pairs.json:95:    "description": "Test cases for contradiction detection between memory statements",
.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/contradiction-pairs.json:99:      "always-never": "Direct always/never contradictions",
.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/contradiction-pairs.json:111:      "semantic-similarity": "Similar meaning, not contradictory",
.opencode/skill/system-spec-kit/mcp_server/tests/unit-composite-scoring-types.vitest.ts:87:        importanceTier: 'important',
.opencode/skill/system-spec-kit/mcp_server/tests/unit-composite-scoring-types.vitest.ts:152:          importanceTier: 'important',
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-pipeline-weighting.vitest.ts:41:    importanceTier: 'important',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:31:        confidence: 0.92,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:43:          { intent: 'find_spec', confidence: 0.92, score: 0.92 },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:44:          { intent: 'find_decision', confidence: 0.44, score: 0.44 },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:45:          { intent: 'understand', confidence: 0.18, score: 0.18 },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:23:importanceTier: critical
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:122:importanceTier: important
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:139:importanceTier: critical
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:153:importanceTier: invalid_tier
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:177:    it('T500-06a: Inline YAML trigger phrases extracted', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:193:    it('T500-06b: Multi-line YAML trigger phrases extracted', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:213:importanceTier: critical
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:219:importanceTier: normal
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:362:importanceTier: [invalid
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:386:importanceTier: important
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:83:  classifyIntent: vi.fn(() => ({ intent: 'understand', confidence: 0.9, fallback: false })),
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:57:        confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:7:// - Quality score computation (trigger phrases, anchors, budget, coherence)
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:105:  it('returns 0 when no trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:109:    expect(result.issues[0]).toMatch(/no trigger phrases/i);
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:112:  it('returns 0.5 for 1-3 trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:119:  it('returns 1.0 for 4+ trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:396:  it('re-extracts trigger phrases when missing', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:399:    const result = attemptAutoFix(content, metadata, ['No trigger phrases found']);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:330:      new_content_preview, existing_content_preview, contradiction_detected, contradiction_type, spec_folder, created_at
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-cleanup-ordering.vitest.ts:52:        importanceTier: 'normal',
.opencode/skill/system-spec-kit/mcp_server/tests/evidence-gap-detector.vitest.ts:2:// Transparent Reasoning Module: Z-score confidence check on RRF
.opencode/skill/system-spec-kit/mcp_server/tests/evidence-gap-detector.vitest.ts:3:// Scores to detect low-confidence retrieval and inject warnings.
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:166:  it('T001.1 — edge type weights are proportional: caused > derived_from > enabled > contradicts > supersedes > supports', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:170:    expect(EDGE_TYPE_WEIGHTS['enabled']).toBeGreaterThan(EDGE_TYPE_WEIGHTS['contradicts']!);
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:171:    expect(EDGE_TYPE_WEIGHTS['contradicts']).toBeGreaterThan(EDGE_TYPE_WEIGHTS['supersedes']!);

exec
/bin/zsh -lc 'rg -n "experimental.session.compacting|context.push|memory" .opencode/plugins/spec-kit-compact-code-graph.js' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
396:    'experimental.session.compacting': async (input, output) => {
416:      output.context.push(rendered);

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '184,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   431	
   432	      // Clamp to [0,1] — retrievability * decay or wmEntry scores
   433	      // Can drift outside the valid range due to floating-point arithmetic.
   434	      attentionScore = Math.max(0, Math.min(1, attentionScore));
   435	
   436	      return {
   437	        ...match,
   438	        attentionScore: attentionScore,
   439	        tier,
   440	        coActivated: coActivatedMemories.some(ca => ca.memoryId === match.memoryId)
   441	      };
   442	    });
   443	
   444	    const tieredResults = tierClassifier.filterAndLimitByState(enrichedResults, null, limit);
   445	
   446	    formattedResults = await Promise.all(tieredResults.map(async (r: EnrichedTriggerMatch) => {
   447	      const content: string = await getTieredContent({
   448	        filePath: r.filePath,
   449	        title: r.title,
   450	        triggerPhrases: r.matchedPhrases
   451	      }, r.tier);
   452	
   453	      return {
   454	        memoryId: r.memoryId,
   455	        specFolder: r.specFolder,
   456	        filePath: r.filePath,
   457	        title: r.title,
   458	        matchedPhrases: r.matchedPhrases,
   459	        importanceWeight: r.importanceWeight,
   460	        tier: r.tier,
   461	        attentionScore: r.attentionScore,
   462	        content: content,
   463	        coActivated: r.coActivated || false
   464	      };
   465	    }));
   466	
   467	    cognitiveStats = {
   468	      enabled: true,
   469	      sessionId: sessionId!,
   470	      turnNumber: turnNumber,
   471	      decayApplied: decayStats ? decayStats.decayedCount : 0,
   472	      memoriesActivated: activatedMemories.length,
   473	      coActivations: coActivatedMemories.length,
   474	      tierDistribution: tierClassifier.getStateStats(enrichedResults),
   475	      tokenMetrics: calculateTokenMetrics(results, formattedResults)
   476	    };
   477	
   478	  } else {
   479	    formattedResults = results.slice(0, limit).map((r: TriggerMatch) => ({
   480	      memoryId: r.memoryId,
   481	      specFolder: r.specFolder,
   482	      filePath: r.filePath,
   483	      title: r.title,
   484	      matchedPhrases: r.matchedPhrases,
   485	      importanceWeight: r.importanceWeight
   486	    }));
   487	  }
   488	
   489	  const latencyMs = Date.now() - startTime;
   490	  if (latencyMs > 100) {
   491	    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
   492	  }
   493	
   494	  const summary = useCognitive
   495	    ? `Matched ${formattedResults.length} memories with cognitive features`
   496	    : `Matched ${formattedResults.length} memories via trigger phrases`;
   497	
   498	  const hints: string[] = [];
   499	  if (!useCognitive && sessionId) {
   500	    hints.push('Enable cognitive features with include_cognitive: true');
   501	  }
   502	  const coldCount = cognitiveStats?.tierDistribution?.COLD;
   503	  if (coldCount !== undefined && coldCount > 0) {
   504	    hints.push(`${coldCount} COLD-tier memories excluded for token efficiency`);
   505	  }
   506	  if (detectedSignals.length > 0) {
   507	    hints.push(`Signal vocabulary applied (${detectedSignals.length} category matches)`);
   508	  }
   509	
   510	  const _triggersResponse = createMCPSuccessResponse({
   511	    tool: 'memory_match_triggers',
   512	    summary,
   513	    data: {
   514	      matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
   515	      count: formattedResults.length,
   516	      results: formattedResults,
   517	      degradedMatching: degradedTriggerMatching,
   518	      cognitive: cognitiveStats
   519	    },
   520	    hints,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts | sed -n '222,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   222	/** Handle memory_health tool -- returns system health status and diagnostics. */
   223	async function handleMemoryHealth(args: HealthArgs): Promise<MCPResponse> {
   224	  const startTime = Date.now();
   225	  // A7-P2-1: Generate requestId for incident correlation in error responses
   226	  const requestId = randomUUID();
   227	  try {
   228	    await checkDatabaseUpdated();
   229	  } catch (dbStateErr: unknown) {
   230	    const message = toErrorMessage(dbStateErr);
   231	    console.error(`[memory-health] Database refresh failed [requestId=${requestId}]: ${message}`);
   232	    return createMCPErrorResponse({
   233	      tool: 'memory_health',
   234	      error: 'Database refresh failed before diagnostics completed. Retry the request or restart the MCP server.',
   235	      code: 'E021',
   236	      details: { requestId },
   237	      startTime,
   238	    });
   239	  }
   240	
   241	  const {
   242	    reportMode = 'full',
   243	    limit: rawLimit = DEFAULT_DIVERGENT_ALIAS_LIMIT,
   244	    specFolder,
   245	    autoRepair = false,
   246	    confirmed = false,
   247	  } = args ?? {};
   248	
   249	  if (reportMode !== 'full' && reportMode !== DIVERGENT_ALIAS_REPORT_MODE) {
   250	    return createMCPErrorResponse({
   251	      tool: 'memory_health',
   252	      error: `Invalid reportMode: ${String(reportMode)}. Expected "full" or "${DIVERGENT_ALIAS_REPORT_MODE}"`,
   253	      code: 'E_INVALID_INPUT',
   254	      details: { requestId },
   255	      startTime,
   256	    });
   257	  }
   258	  if (specFolder !== undefined && typeof specFolder !== 'string') {
   259	    return createMCPErrorResponse({
   260	      tool: 'memory_health',
   261	      error: 'specFolder must be a string',
   262	      code: 'E_INVALID_INPUT',
   263	      details: { requestId },
   264	      startTime,
   265	    });
   266	  }
   267	  if (typeof autoRepair !== 'boolean') {
   268	    return createMCPErrorResponse({
   269	      tool: 'memory_health',
   270	      error: 'autoRepair must be a boolean',
   271	      code: 'E_INVALID_INPUT',
   272	      details: { requestId },
   273	      startTime,
   274	    });
   275	  }
   276	  if (typeof confirmed !== 'boolean') {
   277	    return createMCPErrorResponse({
   278	      tool: 'memory_health',
   279	      error: 'confirmed must be a boolean',
   280	      code: 'E_INVALID_INPUT',
   281	      details: { requestId },
   282	      startTime,
   283	    });
   284	  }
   285	  if (rawLimit !== undefined && (!Number.isFinite(rawLimit) || rawLimit <= 0)) {
   286	    return createMCPErrorResponse({
   287	      tool: 'memory_health',
   288	      error: 'limit must be a positive number',
   289	      code: 'E_INVALID_INPUT',
   290	      details: { requestId },
   291	      startTime,
   292	    });
   293	  }
   294	  const safeLimit = Math.max(1, Math.min(Math.floor(rawLimit || DEFAULT_DIVERGENT_ALIAS_LIMIT), MAX_DIVERGENT_ALIAS_LIMIT));
   295	
   296	  const database = vectorIndex.getDb();
   297	  let memoryCount = 0;
   298	  let aliasConflicts: ReturnType<typeof summarizeAliasConflicts> = summarizeAliasConflicts([]);
   299	  let aliasRows: AliasConflictDbRow[] = [];
   300	  let divergentAliasGroups: DivergentAliasGroup[] = [];
   301	  const embeddingRetry = getEmbeddingRetryStats();
   302	  try {
   303	    if (database) {
   304	      const countResult = database.prepare('SELECT COUNT(*) as count FROM memory_index')
   305	        .get() as Record<string, number> | undefined;
   306	      memoryCount = countResult?.count ?? 0;
   307	
   308	      const whereParts: string[] = [
   309	        'parent_id IS NULL',
   310	      ];
   311	      const params: unknown[] = [];
   312	      if (specFolder) {
   313	        whereParts.push('spec_folder = ?');
   314	        params.push(specFolder);
   315	      }
   316	
   317	      const aliasSql = `
   318	        SELECT file_path, content_hash, spec_folder
   319	        FROM memory_index
   320	        WHERE ${whereParts.join(' AND ')}
   321	      `;
   322	
   323	      aliasRows = (database.prepare(aliasSql).all(...params) as AliasConflictDbRow[])
   324	        .filter((row) => typeof row?.file_path === 'string' && isSpecsAliasPath(row.file_path));
   325	      aliasConflicts = summarizeAliasConflicts(aliasRows);
   326	      divergentAliasGroups = getDivergentAliasGroups(aliasRows, safeLimit);
   327	    }
   328	  } catch (err: unknown) {
   329	    const message = toErrorMessage(err);
   330	    if (message.includes('no such table')) {
   331	      console.error(`[memory-health] Schema missing [requestId=${requestId}]:`, message);
   332	      return createMCPErrorResponse({
   333	        tool: 'memory_health',
   334	        error: `Schema missing: ${sanitizeErrorForHint(message)}. Run memory_index_scan() to create the database schema, or restart the MCP server.`,
   335	        code: 'E_SCHEMA_MISSING',
   336	        details: { requestId },
   337	        startTime,
   338	      });
   339	    }
   340	    console.warn(`[memory-health] Failed to get memory count [requestId=${requestId}]:`, message);
   341	  }
   342	
   343	  if (reportMode === DIVERGENT_ALIAS_REPORT_MODE) {
   344	    const hints: string[] = [];
   345	    if (!database) {
   346	      hints.push('Database not connected - restart MCP server');
   347	    }
   348	    if (autoRepair) {
   349	      hints.push('autoRepair is only applied in reportMode="full"');
   350	    }
   351	    if (aliasConflicts.divergentHashGroups === 0) {
   352	      hints.push('No divergent alias groups detected');
   353	    }
   354	    if (aliasConflicts.divergentHashGroups > divergentAliasGroups.length) {
   355	      hints.push(`More divergent alias groups available: increase limit above ${safeLimit}`);
   356	    }
   357	
   358	    return createMCPSuccessResponse({
   359	      tool: 'memory_health',
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
   461	          `FTS5 index out of sync: memory_index has ${memoryCountRow.count} rows, memory_fts has ${ftsCountRow.count} rows. ` +
   462	          `Run memory_index_scan with force:true to rebuild FTS5 index.`
   463	        );
   464	
   465	        if (autoRepair) {
   466	          try {
   467	            database.exec("INSERT INTO memory_fts(memory_fts) VALUES('rebuild')");
   468	            repair.actions.push('fts_rebuild');
   469	
   470	            triggerMatcher.refreshTriggerCache();
   471	            repair.actions.push('trigger_cache_refresh');
   472	
   473	            const repairedFtsCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_fts').get() as { count: number };
   474	            if (memoryCountRow.count === repairedFtsCountRow.count) {
   475	              trackRepairOutcome(true);
   476	              repair.actions.push('fts_consistency_verified');
   477	              hints.push('Auto-repair completed: FTS5 index rebuilt and trigger cache refreshed.');
   478	            } else {
   479	              trackRepairOutcome(false);
   480	              const warning = `Post-repair mismatch persists: memory_index=${memoryCountRow.count}, memory_fts=${repairedFtsCountRow.count}`;
   481	              repair.warnings.push(warning);
   482	              hints.push(`Auto-repair attempted, but mismatch remains (${warning}).`);
   483	            }
   484	          } catch (repairError: unknown) {
   485	            const message = toErrorMessage(repairError);
   486	            trackRepairOutcome(false);
   487	            repair.errors.push(sanitizeErrorForHint(message));
   488	            hints.push(`Auto-repair failed: ${sanitizeErrorForHint(message)}`);
   489	          }
   490	        }
   491	      }
   492	    } catch (e: unknown) {
   493	      const message = toErrorMessage(e);
   494	      hints.push(`FTS5 consistency check failed: ${sanitizeErrorForHint(message)}`);
   495	      if (autoRepair) {
   496	        trackRepairOutcome(false);
   497	        repair.errors.push(`Consistency check failed before repair: ${sanitizeErrorForHint(message)}`);
   498	      }
   499	    }
   500	  }
   501	  // cleanupOrphanedEdges was exported but
   502	  // Never invoked at runtime. Wire it into autoRepair so orphaned causal edges
   503	  // (referencing deleted memories) are cleaned up during health checks.
   504	  if (autoRepair && database) {
   505	    try {
   506	      // Fix F8 — ensure causal-edges DB init before orphan cleanup.
   507	      causalEdges.init(database);
   508	      const orphanResult = causalEdges.cleanupOrphanedEdges();
   509	      if (orphanResult.deleted > 0) {
   510	        trackRepairOutcome(true);
   511	        repair.actions.push(`orphan_edges_cleaned:${orphanResult.deleted}`);
   512	        hints.push(`Auto-repair: removed ${orphanResult.deleted} orphaned causal edge(s)`);
   513	      }
   514	    } catch (orphanError: unknown) {
   515	      trackRepairOutcome(false);
   516	      repair.errors.push(`Orphan edge cleanup failed: ${sanitizeErrorForHint(toErrorMessage(orphanError))}`);
   517	    }
   518	  }
   519	
   520	  if (autoRepair && database) {
   521	    try {
   522	      const integrityReport = vectorIndex.verifyIntegrity({ autoClean: true });
   523	      const cleanedVectors = integrityReport.cleaned?.vectors ?? 0;
   524	      const cleanedChunks = integrityReport.cleaned?.chunks ?? 0;
   525	
   526	      if (cleanedVectors > 0) {
   527	        trackRepairOutcome(true);
   528	        repair.actions.push(`orphan_vectors_cleaned:${cleanedVectors}`);
   529	        hints.push(`Auto-repair: removed ${cleanedVectors} orphaned vector(s)`);
   530	      }
   531	
   532	      if (cleanedChunks > 0) {
   533	        trackRepairOutcome(true);
   534	        repair.actions.push(`orphan_chunks_cleaned:${cleanedChunks}`);
   535	        hints.push(`Auto-repair: removed ${cleanedChunks} orphaned chunk(s)`);
   536	      }
   537	
   538	      const postRepairReport = vectorIndex.verifyIntegrity({ autoClean: false });
   539	      if (
   540	        postRepairReport.orphanedVectors > 0 ||
   541	        postRepairReport.missingVectors > 0 ||
   542	        postRepairReport.orphanedFiles.length > 0 ||
   543	        postRepairReport.orphanedChunks > 0
   544	      ) {
   545	        repair.warnings.push(
   546	          `Post-repair integrity still degraded: orphanedVectors=${postRepairReport.orphanedVectors}, ` +
   547	          `missingVectors=${postRepairReport.missingVectors}, orphanedFiles=${postRepairReport.orphanedFiles.length}, ` +
   548	          `orphanedChunks=${postRepairReport.orphanedChunks}`
   549	        );
   550	      }
   551	    } catch (integrityError: unknown) {
   552	      trackRepairOutcome(false);
   553	      repair.errors.push(`Integrity cleanup failed: ${sanitizeErrorForHint(toErrorMessage(integrityError))}`);
   554	    }
   555	  }
   556	
   557	  if (repair.attempted) {
   558	    repair.repaired = failedRepairCount === 0 && successfulRepairCount > 0;
   559	    repair.partialSuccess = failedRepairCount > 0 && successfulRepairCount > 0;
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
   586	        dimension: providerDimension,
   587	        healthy: providerMetadata.healthy !== false,
   588	        databasePath: redactPath(vectorIndex.getDbPath() ?? ''),
   589	      },
   590	      embeddingRetry,
   591	    },
   592	    hints,
   593	    startTime,
   594	  });
   595	}
   596	
   597	/* ───────────────────────────────────────────────────────────────
   598	   EXPORTS
   599	──────────────────────────────────────────────────────────────── */
   600	
   601	export { handleMemoryHealth };

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts | sed -n '67,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   261	    : 'No memories found to delete';
   262	
   263	  const hints: string[] = [];
   264	  if (checkpointName) {
   265	    hints.push(`Restore with: checkpoint_restore({ name: "${checkpointName}" })`);
   266	  }
   267	  if (deletedCount === 0) {
   268	    hints.push('Use memory_list() to find existing memories');
   269	  }
   270	  if (postMutationFeedback) {
   271	    hints.push(...postMutationFeedback.hints);
   272	  }
   273	  if (mutationLedgerWarning) {
   274	    hints.push(mutationLedgerWarning);
   275	  }
   276	
   277	  const data: Record<string, unknown> = { deleted: deletedCount };
   278	  if (checkpointName) {
   279	    data.checkpoint = checkpointName;
   280	    data.restoreCommand = `checkpoint_restore({ name: "${checkpointName}" })`;
   281	  }
   282	  if (postMutationFeedback) {
   283	    data.postMutationHooks = postMutationFeedback.data;
   284	  }
   285	  if (mutationLedgerWarning) {
   286	    data.warning = mutationLedgerWarning;
   287	  }
   288	
   289	  return createMCPSuccessResponse({
   290	    tool: 'memory_delete',
   291	    summary,
   292	    data,
   293	    hints,
   294	  });
   295	}
   296	
   297	/* ───────────────────────────────────────────────────────────────
   298	   EXPORTS
   299	──────────────────────────────────────────────────────────────── */
   300	
   301	export { handleMemoryDelete };

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts | sed -n '40,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   291	    data,
   292	    hints,
   293	  });
   294	}
   295	
   296	/* ───────────────────────────────────────────────────────────────
   297	   EXPORTS
   298	──────────────────────────────────────────────────────────────── */
   299	
   300	export { handleMemoryUpdate };

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts | sed -n '930,1080p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ────────────────────────────────────────────────────────────────
     2	// MODULE: Causal Graph
     3	// ────────────────────────────────────────────────────────────────
     4	
     5	/* ───────────────────────────────────────────────────────────────
     6	   0. DEPENDENCIES
     7	──────────────────────────────────────────────────────────────── */
     8	
     9	// Lib modules
    10	import * as vectorIndex from '../lib/search/vector-index.js';
    11	import * as causalEdges from '../lib/storage/causal-edges.js';
    12	import type { CausalChainNode, CausalEdge } from '../lib/storage/causal-edges.js';
    13	
    14	// Core utilities
    15	import { checkDatabaseUpdated } from '../core/index.js';
    16	import { toErrorMessage } from '../utils/index.js';
    17	import { ErrorCodes, getRecoveryHint } from '../lib/errors.js';
    18	
    19	// REQ-019: Standardized Response Structure
    20	import { createMCPSuccessResponse, createMCPErrorResponse, createMCPEmptyResponse } from '../lib/response/envelope.js';
    21	
    22	// Shared handler types
    23	import type { MCPResponse } from './types.js';
    24	
    25	// Feature catalog: Causal graph statistics (memory_causal_stats)
    26	// Feature catalog: Causal chain tracing (memory_drift_why)
    27	
    28	
    29	/* ───────────────────────────────────────────────────────────────
    30	   1. TYPES
    31	──────────────────────────────────────────────────────────────── */
    32	
    33	/** Flat edge representation for API responses */
    34	export interface FlatEdge {
    35	  id: number;               // T202: causal_edges.id for unlink workflow
    36	  from: string;
    37	  to: string;
    38	  relation: string;
    39	  strength: number;
    40	  depth: number;
    41	  direction: 'incoming' | 'outgoing';
    42	}
    43	
    44	/** Flattened chain produced from CausalChainNode tree */
    45	export interface FlattenedChain {
    46	  all: FlatEdge[];
    47	  by_cause: FlatEdge[];
    48	  by_enabled: FlatEdge[];
    49	  by_supersedes: FlatEdge[];
    50	  by_contradicts: FlatEdge[];
    51	  by_derived_from: FlatEdge[];
    52	  by_supports: FlatEdge[];
    53	  total_edges: number;
    54	  max_depth_reached: boolean;
    55	  truncated: boolean;
    56	  truncation_limit: number | null;
    57	}
    58	
    59	interface DirectionalBuckets {
    60	  caused: FlatEdge[];
    61	  enabled: FlatEdge[];
    62	  supersedes: FlatEdge[];
    63	  contradicts: FlatEdge[];
    64	  derivedFrom: FlatEdge[];
    65	  supports: FlatEdge[];
    66	  allEdges: FlatEdge[];
    67	  totalEdges: number;
    68	  maxDepthReached: boolean;
    69	  truncated: boolean;
    70	  truncationLimit: number | null;
    71	}
    72	
    73	interface DriftWhyArgs {
    74	  memoryId: string | number;
    75	  maxDepth?: number;
    76	  direction?: string;
    77	  relations?: string[] | null;
    78	  includeMemoryDetails?: boolean;
    79	}
    80	
    81	interface CausalLinkArgs {
    82	  sourceId: string | number;
    83	  targetId: string | number;
    84	  relation: string;
    85	  strength?: number;
    86	  evidence?: string | null;
    87	}
    88	
    89	interface CausalStatsArgs {
    90	  _?: never;
    91	}
    92	
    93	interface CausalUnlinkArgs {
    94	  edgeId: number;
    95	}
    96	
    97	function logCausalHandlerError(tool: string, error: unknown): void {
    98	  const message = error instanceof Error ? error.message : String(error);
    99	  console.error(`[${tool}] ${message}`);
   100	}
   101	
   102	function createSanitizedCausalError(
   103	  tool: 'memory_drift_why' | 'memory_causal_link' | 'memory_causal_stats' | 'memory_causal_unlink',
   104	  error: unknown,
   105	  code: string,
   106	  details: Record<string, unknown>,
   107	  startTime: number,
   108	  publicMessage: string,
   109	): MCPResponse {
   110	  logCausalHandlerError(tool, error);
   111	  return createMCPErrorResponse({
   112	    tool,
   113	    error: publicMessage,
   114	    code,
   115	    details,
   116	    recovery: getRecoveryHint(tool, code),
   117	    startTime,
   118	  });
   119	}
   120	
   121	/* ───────────────────────────────────────────────────────────────
   122	   2. TREE-TO-FLAT CONVERTER
   123	──────────────────────────────────────────────────────────────── */
   124	
   125	/**
   126	 * Flatten a CausalChainNode tree into flat edge lists grouped by relation.
   127	 * The tree from getCausalChain() encodes parent→child relationships;
   128	 * for 'forward' direction: parent=source, child=target.
   129	 * For 'backward' direction: parent=target, child=source.
   130	 */
   131	function flattenCausalTree(
   132	  root: CausalChainNode,
   133	  maxDepth: number,
   134	  direction: 'forward' | 'backward'
   135	): FlattenedChain {
   136	  const edgeDirection = direction === 'forward' ? 'outgoing' : 'incoming';
   137	  const result: FlattenedChain = {
   138	    all: [],
   139	    by_cause: [],
   140	    by_enabled: [],
   141	    by_supersedes: [],
   142	    by_contradicts: [],
   143	    by_derived_from: [],
   144	    by_supports: [],
   145	    total_edges: 0,
   146	    max_depth_reached: false,
   147	    truncated: Boolean(root.truncated),
   148	    truncation_limit: root.truncationLimit ?? null,
   149	  };
   150	
   151	  function traverse(node: CausalChainNode): void {
   152	    for (const child of node.children) {
   153	      const edge: FlatEdge = {
   154	        id: child.edgeId ?? 0,          // T202: edge ID from storage layer
   155	        from: direction === 'forward' ? node.id : child.id,
   156	        to: direction === 'forward' ? child.id : node.id,
   157	        relation: child.relation,
   158	        strength: child.strength,
   159	        depth: child.depth,
   160	        direction: edgeDirection,
   161	      };
   162	
   163	      result.all.push(edge);
   164	
   165	      // Group by relation type
   166	      const bucket = relationBucket(child.relation);
   167	      if (bucket) {
   168	        bucket.push(edge);
   169	      }
   170	
   171	      // T006 — Only flag max_depth_reached when a node exists at the depth limit.
   172	      // Nodes at maxDepth-1 with no children are natural leaves (edges were queried).
   173	      // Nodes at maxDepth were added but never explored (traverse returned early).
   174	      if (child.depth >= maxDepth) {
   175	        result.max_depth_reached = true;
   176	      }
   177	
   178	      traverse(child);
   179	    }
   180	  }
   181	
   182	  function relationBucket(relation: string): FlatEdge[] | null {
   183	    switch (relation) {
   184	      case 'caused': return result.by_cause;
   185	      case 'enabled': return result.by_enabled;
   186	      case 'supersedes': return result.by_supersedes;
   187	      case 'contradicts': return result.by_contradicts;
   188	      case 'derived_from': return result.by_derived_from;
   189	      case 'supports': return result.by_supports;
   190	      default: return null;
   191	    }
   192	  }
   193	
   194	  traverse(root);
   195	  result.total_edges = result.all.length;
   196	  return result;
   197	}
   198	
   199	/**
   200	 * Merge two flattened chains (used for 'both' direction).
   201	 * Deduplicates edges by direction+from+to+relation key.
   202	 */
   203	function mergeFlattenedChains(a: FlattenedChain, b: FlattenedChain): FlattenedChain {
   204	  const seen = new Set<string>();
   205	  const merged: FlattenedChain = {
   206	    all: [],
   207	    by_cause: [],
   208	    by_enabled: [],
   209	    by_supersedes: [],
   210	    by_contradicts: [],
   211	    by_derived_from: [],
   212	    by_supports: [],
   213	    total_edges: 0,
   214	    max_depth_reached: a.max_depth_reached || b.max_depth_reached,
   215	    truncated: a.truncated || b.truncated,
   216	    truncation_limit: a.truncation_limit ?? b.truncation_limit ?? null,
   217	  };
   218	
   219	  function addEdge(edge: FlatEdge): void {
   220	    const key = `${edge.direction}:${edge.from}:${edge.to}:${edge.relation}`;
   221	    if (seen.has(key)) return;
   222	    seen.add(key);
   223	
   224	    merged.all.push(edge);
   225	    switch (edge.relation) {
   226	      case 'caused': merged.by_cause.push(edge); break;
   227	      case 'enabled': merged.by_enabled.push(edge); break;
   228	      case 'supersedes': merged.by_supersedes.push(edge); break;
   229	      case 'contradicts': merged.by_contradicts.push(edge); break;
   230	      case 'derived_from': merged.by_derived_from.push(edge); break;
   231	      case 'supports': merged.by_supports.push(edge); break;
   232	    }
   233	  }
   234	
   235	  for (const edge of a.all) addEdge(edge);
   236	  for (const edge of b.all) addEdge(edge);
   237	
   238	  merged.total_edges = merged.all.length;
   239	  return merged;
   240	}
   241	
   242	/**
   243	 * Map tool schema direction values to getCausalChain direction values.
   244	 * Tool schema: 'outgoing' | 'incoming' | 'both'
   245	 * getCausalChain: 'forward' | 'backward'
   246	 */
   247	function mapDirection(direction: string): 'forward' | 'backward' | 'both' {
   248	  switch (direction) {
   249	    case 'outgoing': return 'forward';
   250	    case 'forward': return 'forward';   // backward compat
   251	    case 'incoming': return 'backward';
   252	    case 'backward': return 'backward'; // backward compat
   253	    case 'both': return 'both';
   254	    default: return 'forward';
   255	  }
   256	}
   257	
   258	/**
   259	 * T203: Filter a FlattenedChain to only include edges whose relation
   260	 * is in the provided set. When relations is null/empty, returns the
   261	 * chain unchanged.
   262	 */
   263	function filterChainByRelations(
   264	  chain: FlattenedChain,
   265	  relations: string[] | null | undefined
   266	): FlattenedChain {
   267	  if (!relations || relations.length === 0) return chain;
   268	
   269	  const allowed = new Set(relations);
   270	
   271	  const filtered: FlattenedChain = {
   272	    all: chain.all.filter(e => allowed.has(e.relation)),
   273	    by_cause: allowed.has('caused') ? chain.by_cause : [],
   274	    by_enabled: allowed.has('enabled') ? chain.by_enabled : [],
   275	    by_supersedes: allowed.has('supersedes') ? chain.by_supersedes : [],
   276	    by_contradicts: allowed.has('contradicts') ? chain.by_contradicts : [],
   277	    by_derived_from: allowed.has('derived_from') ? chain.by_derived_from : [],
   278	    by_supports: allowed.has('supports') ? chain.by_supports : [],
   279	    total_edges: 0,
   280	    max_depth_reached: chain.max_depth_reached,
   281	    truncated: chain.truncated,
   282	    truncation_limit: chain.truncation_limit,
   283	  };
   284	  filtered.total_edges = filtered.all.length;
   285	  return filtered;
   286	}
   287	
   288	function createEmptyChain(): FlattenedChain {
   289	  return {
   290	    all: [],
   291	    by_cause: [],
   292	    by_enabled: [],
   293	    by_supersedes: [],
   294	    by_contradicts: [],
   295	    by_derived_from: [],
   296	    by_supports: [],
   297	    total_edges: 0,
   298	    max_depth_reached: false,
   299	    truncated: false,
   300	    truncation_limit: null,
   301	  };
   302	}
   303	
   304	function toDirectionalBuckets(chain: FlattenedChain): DirectionalBuckets {
   305	  return {
   306	    caused: chain.by_cause,
   307	    enabled: chain.by_enabled,
   308	    supersedes: chain.by_supersedes,
   309	    contradicts: chain.by_contradicts,
   310	    derivedFrom: chain.by_derived_from,
   311	    supports: chain.by_supports,
   312	    allEdges: chain.all,
   313	    totalEdges: chain.total_edges,
   314	    maxDepthReached: chain.max_depth_reached,
   315	    truncated: chain.truncated,
   316	    truncationLimit: chain.truncation_limit,
   317	  };
   318	}
   319	
   320	function formatRelationSummary(chain: FlattenedChain, label: 'incoming' | 'outgoing'): string | null {

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
/bin/zsh -lc "nl -ba .opencode/plugins/spec-kit-compact-code-graph.js | sed -n '396,430p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
I’ve got the key Public hygiene handlers open now. The gap pattern is strengthening: Mnemosyne gives agents a manual hygiene discipline, while Public encodes hygiene into mutation transactions, scope checks, repair flows, and trigger/session controls.
exec
/bin/zsh -lc "rg -n \"handleMemoryValidate|memory_validate|wasUseful|confidence boost|thumbs-up|thumbs-down|resultRank\" .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts .opencode/skill/system-spec-kit/mcp_server/handlers -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:85:  wasUseful: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:88:  resultRank?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648:/** Handle memory_validate tool - records user validation feedback to adjust confidence */
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:649:async function handleMemoryValidate(args: MemoryValidateArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:654:    wasUseful,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:657:    resultRank,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:669:  if (typeof wasUseful !== 'boolean') {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:670:    throw new Error('wasUseful is required and must be a boolean');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:681:  const result: ValidationResult = confidenceTracker.recordValidation(database, memoryId, wasUseful);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:685:      signalType: wasUseful ? 'outcome' : 'correction',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:688:      actor: sessionId ?? 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:692:        resultRank: typeof resultRank === 'number' ? resultRank : null,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:710:  if (wasUseful) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:722:  if (!wasUseful) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:726:  // T002 + T027a: Optional wiring from memory_validate to learned feedback + ground truth.
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:735:  if (wasUseful && typeof queryId === 'string' && queryId.trim().length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:739:      selectedRank: resultRank,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:749:    if (typeof resultRank === 'number' && Number.isFinite(resultRank) && resultRank > 0 && normalizedTerms.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:750:      const learnResult = recordSelection(queryId, memoryId, normalizedTerms, Math.floor(resultRank), database);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:767:  const summary = wasUseful
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:775:  if (!wasUseful && result.validationCount > 3) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:780:    tool: 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:784:      wasUseful: wasUseful,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:807:  handleMemoryValidate,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:815:const handle_memory_validate = handleMemoryValidate;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:822:  handle_memory_validate,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:9:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:20:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:27:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:31:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:287:export const handleMemoryValidate = lazyFunction(getCheckpointsModule, 'handleMemoryValidate');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:292:export const handle_memory_validate = lazyFunction(getCheckpointsModule, 'handle_memory_validate');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:22:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:29:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:85:  wasUseful: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:88:  resultRank?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648:/** Handle memory_validate tool - records user validation feedback to adjust confidence */
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:649:async function handleMemoryValidate(args: MemoryValidateArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:654:    wasUseful,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:657:    resultRank,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:669:  if (typeof wasUseful !== 'boolean') {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:670:    throw new Error('wasUseful is required and must be a boolean');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:681:  const result: ValidationResult = confidenceTracker.recordValidation(database, memoryId, wasUseful);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:685:      signalType: wasUseful ? 'outcome' : 'correction',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:688:      actor: sessionId ?? 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:692:        resultRank: typeof resultRank === 'number' ? resultRank : null,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:710:  if (wasUseful) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:722:  if (!wasUseful) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:726:  // T002 + T027a: Optional wiring from memory_validate to learned feedback + ground truth.
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:735:  if (wasUseful && typeof queryId === 'string' && queryId.trim().length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:739:      selectedRank: resultRank,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:749:    if (typeof resultRank === 'number' && Number.isFinite(resultRank) && resultRank > 0 && normalizedTerms.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:750:      const learnResult = recordSelection(queryId, memoryId, normalizedTerms, Math.floor(resultRank), database);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:767:  const summary = wasUseful
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:775:  if (!wasUseful && result.validationCount > 3) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:780:    tool: 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:784:      wasUseful: wasUseful,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:807:  handleMemoryValidate,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:815:const handle_memory_validate = handleMemoryValidate;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:822:  handle_memory_validate,
.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts:21:// Feature catalog: Validation feedback (memory_validate)

exec
/bin/zsh -lc 'rg --files .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "trigger phrases|quality_score|contradiction|importance_tier|auto-fix|pre-flight|duplicate" .opencode/skill/system-spec-kit/mcp_server/handlers/save .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/tsconfig.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package-lock.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/LICENSE

 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:420:    : 'Prediction-error contradiction across different file paths';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:797:    const duplicatePrecheck = checkContentHashDedup(database, parsed, force, validation.warnings, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:801:    if (duplicatePrecheck) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:802:      return duplicatePrecheck;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1063:    console.error(`[memory-save] Quality loop applied ${prepared.qualityLoopResult.fixes.length} auto-fix(es) for ${path.basename(filePath)}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1293:        check_duplicates: !force,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1455:  if (typeof result.id === 'number' && result.id > 0 && result.status !== 'unchanged' && result.status !== 'duplicate') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1562:        console.error(`[memory-save] Quality loop applied ${prepared.qualityLoopResult.fixes.length} auto-fix(es) for ${path.basename(file_path)} before pending-file promotion`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1710:  if (indexResult.status !== 'unchanged' && indexResult.status !== 'duplicate' && indexResult.id > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1714:  const shouldEmitPostMutationFeedback = indexResult.status !== 'duplicate' && indexResult.status !== 'unchanged';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1737:    indexResult.status === 'duplicate'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1738:      ? 'Memory skipped (duplicate content)'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1751:  } else if (indexResult.status === 'duplicate') {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:83:    : 'Prediction-error contradiction across different file paths';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:218:      importance_tier: parsed.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:227:      quality_score: parsed.qualityScore ?? 0,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:247:        SET importance_tier = 'deprecated',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:34:  contradiction?: { detected: boolean; type: string | null; description: string | null; confidence: number } | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:146:  importance_tier?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:157:  quality_score?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:53:1. dedup          -- Skip if unchanged or duplicate content hash
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:44: * Similarity threshold above which two memories are considered near-duplicates
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:69: *   similarity >= 0.96  → auto-merge (near-duplicate)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:262:                  importance_tier: parsed.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:271:                  quality_score: parsed.qualityScore ?? 0,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:12:// Feature catalog: Generation-time duplicate and empty content prevention
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:41:  quality_score: number | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:95:    SELECT id, content_hash, embedding_status, trigger_phrases, quality_score, quality_flags
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:140:    quality_score: number | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:155:  const persistedQualityScore = existing.quality_score ?? 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:226:  // P1-4 FIX: Check content hash even during force reindex to prevent duplicate
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:228:  // not change either, so re-indexing provides no value and creates duplicates.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:262:    const duplicateParams: Array<string> = [
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:271:      duplicateParams.push(samePathExclusion.filePath);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:273:      duplicateParams.push(samePathExclusion.canonicalFilePath);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:276:    const duplicateByHash = database.prepare(`
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:282:    `).get(...duplicateParams) as DuplicateLookupRow | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:284:    if (duplicateByHash) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:286:        duplicateByHash.content_text,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:287:        duplicateByHash.file_path,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:291:        console.warn(`[memory-save] Hash match for memory #${duplicateByHash.id} failed secondary content verification; continuing save`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:294:      console.error(`[memory-save] T054: Duplicate content detected (hash match id=${duplicateByHash.id}), skipping embedding`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:296:        status: 'duplicate',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:297:        id: duplicateByHash.id,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:299:        title: parsed.title ?? duplicateByHash.title ?? '',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:304:        message: `Duplicate content detected: identical to existing memory #${duplicateByHash.id} (${duplicateByHash.file_path}). Skipping embedding generation.`,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:312:  const shouldEmitPostMutationFeedback = result.status !== 'duplicate' && result.status !== 'unchanged';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:340:    message: result.message ?? (result.status === 'duplicate' ? 'Memory skipped (duplicate content)' : `Memory ${result.status} successfully`),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:406:    hints.push('Existing memory was reinforced instead of creating duplicate');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:435:  } else if (result.status === 'duplicate') {

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1312ms:

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
I also kicked off the strict phase validation command exactly as requested so I can report the real outcome rather than infer it. While that runs, I’m drilling one level deeper into the save/validation path because that’s where our memory hygiene differs most sharply from Mnemosyne’s manual “remember to clean up” model.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts | sed -n '648,804p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   648	/** Handle memory_validate tool - records user validation feedback to adjust confidence */
   649	async function handleMemoryValidate(args: MemoryValidateArgs): Promise<MCPResponse> {
   650	  const startTime = Date.now();
   651	  await checkDatabaseUpdated();
   652	  const {
   653	    id,
   654	    wasUseful,
   655	    queryId,
   656	    queryTerms,
   657	    resultRank,
   658	    totalResultsShown,
   659	    searchMode,
   660	    intent,
   661	    sessionId,
   662	    notes,
   663	  } = args;
   664	
   665	  if (id === undefined || id === null) {
   666	    throw new Error('id is required');
   667	  }
   668	
   669	  if (typeof wasUseful !== 'boolean') {
   670	    throw new Error('wasUseful is required and must be a boolean');
   671	  }
   672	
   673	  const memoryId = parseMemoryId(id);
   674	
   675	  vectorIndex.initializeDb();
   676	  const database = requireDb();
   677	  const normalizedQueryId = typeof queryId === 'string' && queryId.trim().length > 0
   678	    ? queryId.trim()
   679	    : null;
   680	  const queryText = resolveValidationQueryText(database, normalizedQueryId ?? undefined);
   681	  const result: ValidationResult = confidenceTracker.recordValidation(database, memoryId, wasUseful);
   682	  try {
   683	    recordAdaptiveSignal(database, {
   684	      memoryId,
   685	      signalType: wasUseful ? 'outcome' : 'correction',
   686	      signalValue: 1,
   687	      query: queryText,
   688	      actor: sessionId ?? 'memory_validate',
   689	      metadata: {
   690	        queryId: normalizedQueryId,
   691	        queryText,
   692	        resultRank: typeof resultRank === 'number' ? resultRank : null,
   693	        totalResultsShown: typeof totalResultsShown === 'number' ? totalResultsShown : null,
   694	        intent: intent ?? null,
   695	      },
   696	    });
   697	  } catch (_error: unknown) {
   698	    // Adaptive signals are best-effort only
   699	  }
   700	
   701	  // T002a: Auto-promotion wiring on positive feedback.
   702	  let autoPromotion: {
   703	    attempted: boolean;
   704	    promoted: boolean;
   705	    previousTier?: string;
   706	    newTier?: string;
   707	    reason?: string;
   708	  } | null = null;
   709	
   710	  if (wasUseful) {
   711	    const promotionResult = executeAutoPromotion(database, memoryId);
   712	    autoPromotion = {
   713	      attempted: true,
   714	      promoted: promotionResult.promoted,
   715	      previousTier: promotionResult.previousTier,
   716	      newTier: promotionResult.newTier,
   717	      reason: promotionResult.reason,
   718	    };
   719	  }
   720	
   721	  // T002b: Negative-feedback confidence signal persistence for runtime scoring.
   722	  if (!wasUseful) {
   723	    recordNegativeFeedbackEvent(database, memoryId);
   724	  }
   725	
   726	  // T002 + T027a: Optional wiring from memory_validate to learned feedback + ground truth.
   727	  let learnedFeedback: {
   728	    attempted: boolean;
   729	    applied: boolean;
   730	    termsLearned: string[];
   731	    reason?: string;
   732	  } | null = null;
   733	  let groundTruthSelectionId: number | null = null;
   734	
   735	  if (wasUseful && typeof queryId === 'string' && queryId.trim().length > 0) {
   736	    groundTruthSelectionId = recordUserSelection(queryId, memoryId, {
   737	      searchMode,
   738	      intent,
   739	      selectedRank: resultRank,
   740	      totalResultsShown,
   741	      sessionId,
   742	      notes,
   743	    });
   744	
   745	    const normalizedTerms = Array.isArray(queryTerms)
   746	      ? queryTerms.filter((term) => typeof term === 'string' && term.trim().length > 0).map((term) => term.trim())
   747	      : [];
   748	
   749	    if (typeof resultRank === 'number' && Number.isFinite(resultRank) && resultRank > 0 && normalizedTerms.length > 0) {
   750	      const learnResult = recordSelection(queryId, memoryId, normalizedTerms, Math.floor(resultRank), database);
   751	      learnedFeedback = {
   752	        attempted: true,
   753	        applied: learnResult.applied,
   754	        termsLearned: learnResult.terms,
   755	        reason: learnResult.reason,
   756	      };
   757	    } else {
   758	      learnedFeedback = {
   759	        attempted: false,
   760	        applied: false,
   761	        termsLearned: [],
   762	        reason: 'missing_query_terms_or_rank',
   763	      };
   764	    }
   765	  }
   766	
   767	  const summary = wasUseful
   768	    ? `Positive validation recorded (confidence: ${result.confidence.toFixed(2)})`
   769	    : `Negative validation recorded (confidence: ${result.confidence.toFixed(2)})`;
   770	
   771	  const hints: string[] = [];
   772	  if (result.promotionEligible) {
   773	    hints.push('Memory eligible for promotion to critical tier');
   774	  }
   775	  if (!wasUseful && result.validationCount > 3) {
   776	    hints.push('Consider updating or deleting this memory if consistently unhelpful');
   777	  }
   778	
   779	  return createMCPSuccessResponse({
   780	    tool: 'memory_validate',
   781	    summary,
   782	    data: {
   783	      memoryId,
   784	      wasUseful: wasUseful,
   785	      confidence: result.confidence,
   786	      validationCount: result.validationCount,
   787	      positiveValidationCount: result.positiveValidationCount,
   788	      promotionEligible: result.promotionEligible,
   789	      autoPromotion,
   790	      learnedFeedback,
   791	      groundTruthSelectionId,
   792	    },
   793	    hints,
   794	    startTime: startTime
   795	  });
   796	}
   797	
   798	/* ───────────────────────────────────────────────────────────────
   799	   8. EXPORTS
   800	──────────────────────────────────────────────────────────────── */
   801	
   802	export {
   803	  handleCheckpointCreate,
   804	  handleCheckpointList,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | sed -n '760,1085p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   760	            }));
   761	          } : null,
   762	        });
   763	
   764	        if (!qualityGateResult.pass && !qualityGateResult.warnOnly && qualityGateMode !== 'warn-only') {
   765	          console.error(`[memory-save] TM-04: Quality gate REJECTED save for ${path.basename(filePath)}: ${qualityGateResult.reasons.join('; ')}`);
   766	          return {
   767	            status: 'rejected',
   768	            id: 0,
   769	            specFolder: parsed.specFolder,
   770	            title: parsed.title ?? '',
   771	            qualityScore: parsed.qualityScore,
   772	            qualityFlags: parsed.qualityFlags,
   773	            rejectionReason: `Quality gate rejected: ${qualityGateResult.reasons.join('; ')}`,
   774	            message: `Quality gate rejected: ${qualityGateResult.reasons.join('; ')}`,
   775	            qualityGate: {
   776	              pass: false,
   777	              reasons: qualityGateResult.reasons,
   778	              layers: qualityGateResult.layers,
   779	            },
   780	          };
   781	        }
   782	
   783	        if (!qualityGateResult.pass && qualityGateMode === 'warn-only') {
   784	          console.warn(`[memory-save] TM-04: Quality gate warn-only (spec doc) for ${path.basename(filePath)}: ${qualityGateResult.reasons.join('; ')}`);
   785	        }
   786	
   787	        if (qualityGateResult.wouldReject) {
   788	          console.warn(`[memory-save] TM-04: Quality gate WARN-ONLY for ${path.basename(filePath)}: ${qualityGateResult.reasons.join('; ')}`);
   789	        }
   790	      } catch (qgErr: unknown) {
   791	        const message = qgErr instanceof Error ? qgErr.message : String(qgErr);
   792	        console.warn(`[memory-save] TM-04: Quality gate error (proceeding with save): ${message}`);
   793	        // Quality gate errors must not block saves
   794	      }
   795	    }
   796	
   797	    const duplicatePrecheck = checkContentHashDedup(database, parsed, force, validation.warnings, {
   798	      canonicalFilePath,
   799	      filePath,
   800	    }, scope);
   801	    if (duplicatePrecheck) {
   802	      return duplicatePrecheck;
   803	    }
   804	
   805	    persistPendingEmbeddingCacheWrite(database, pendingCacheWrite, filePath);
   806	
   807	    // PE GATING
   808	    const peResult = evaluateAndApplyPeDecision(
   809	      database, parsed, embedding, force, validation.warnings, embeddingStatus, filePath, scope,
   810	    );
   811	    if (peResult.earlyReturn) return peResult.earlyReturn;
   812	
   813	    let reconResult: Awaited<ReturnType<typeof runReconsolidationIfEnabled>> = {
   814	      earlyReturn: null,
   815	      warnings: [],
   816	    };
   817	
   818	    // T028/T029: complete async reconsolidation planning before chunking or
   819	    // taking the SQLite writer lock, so chunked saves do not bypass the gate
   820	    // and BEGIN IMMEDIATE only covers synchronous DB mutation work.
   821	    reconResult = await runReconsolidationIfEnabled(
   822	      database,
   823	      parsed,
   824	      filePath,
   825	      force,
   826	      embedding,
   827	      scope,
   828	    );
   829	    if (reconResult.earlyReturn) return reconResult.earlyReturn;
   830	
   831	    if (shouldChunkContent) {
   832	      console.error(`[memory-save] File exceeds chunking threshold (${parsed.content.length} chars), using chunked indexing`);
   833	      const chunkedInsertTracker = createChunkedInsertTracker();
   834	      const chunkedResult = await indexChunkedMemoryFile(filePath, parsed, {
   835	        force,
   836	        applyPostInsertMetadata: (db, memoryId, fields) => {
   837	          applyPostInsertMetadata(db, memoryId, fields);
   838	          trackChunkedInsert(chunkedInsertTracker, memoryId, fields as Record<string, unknown>);
   839	        },
   840	      });
   841	
   842	      if (
   843	        peResult.supersededId != null
   844	        && (chunkedResult.status === 'indexed' || chunkedResult.status === 'updated')
   845	      ) {
   846	        try {
   847	          const finalizeChunkedPeTx = database.transaction(() => {
   848	            if (chunkedResult.id > 0) {
   849	              recordCrossPathPeSupersedes(
   850	                database,
   851	                chunkedResult.id,
   852	                peResult.supersededId,
   853	                samePathExisting?.id ?? null,
   854	                peResult.decision.reason,
   855	              );
   856	            }
   857	            if (peResult.supersededId != null && !markMemorySuperseded(peResult.supersededId)) {
   858	              throw new Error(`Failed to mark predecessor ${peResult.supersededId} as superseded`);
   859	            }
   860	          });
   861	          finalizeChunkedPeTx.immediate();
   862	        } catch (supersedeErr: unknown) {
   863	          const cleanup = rollbackCreatedChunkTree(database, chunkedInsertTracker);
   864	          const cleanupSuffix = cleanup.cleaned
   865	            ? ' Rolled back the newly created chunk tree.'
   866	            : cleanup.attempted && cleanup.error
   867	              ? ` Cleanup failed: ${cleanup.error}`
   868	              : '';
   869	          return {
   870	            ...chunkedResult,
   871	            status: 'error',
   872	            error: `Failed to mark predecessor ${peResult.supersededId} as superseded after chunked indexing: ${getAtomicSaveErrorMessage(supersedeErr)}`,
   873	            message: `Chunked indexing succeeded, but predecessor ${peResult.supersededId} could not be superseded.${cleanupSuffix}`,
   874	          };
   875	        }
   876	      }
   877	
   878	      if (
   879	        shouldPersistFinalizedFile
   880	        && finalizedFileContent
   881	        && (chunkedResult.status === 'indexed' || chunkedResult.status === 'updated')
   882	      ) {
   883	        try {
   884	          await finalizeMemoryFileContent(filePath, finalizedFileContent);
   885	        } catch (finalizeErr: unknown) {
   886	          finalizeWarning = `Quality-loop file persistence failed after chunked indexing: ${finalizeErr instanceof Error ? finalizeErr.message : String(finalizeErr)}`;
   887	          console.warn(`[memory-save] ${finalizeWarning}`);
   888	        }
   889	      }
   890	
   891	      if (peResult.decision.action !== 'CREATE') {
   892	        chunkedResult.pe_action = peResult.decision.action;
   893	        chunkedResult.pe_reason = peResult.decision.reason;
   894	      }
   895	      if (peResult.supersededId != null) {
   896	        chunkedResult.superseded_id = peResult.supersededId;
   897	      }
   898	      if (Array.isArray(reconResult.warnings) && reconResult.warnings.length > 0) {
   899	        const existingWarnings = Array.isArray(chunkedResult.warnings)
   900	          ? [...(chunkedResult.warnings as string[])]
   901	          : [];
   902	        chunkedResult.warnings = [...existingWarnings, ...reconResult.warnings];
   903	      }
   904	
   905	      return appendResultWarning(chunkedResult, finalizeWarning);
   906	    }
   907	
   908	    // A4 FIX: Wrap dedup-check + insert in a single transaction for DB-level
   909	    // atomicity. Uses database.transaction() so inner transaction() calls in
   910	    // createMemoryRecord / index_memory correctly nest via SAVEPOINTs instead
   911	    // of failing with "cannot start a transaction within a transaction".
   912	    // withSpecFolderLock handles in-process serialization; this transaction
   913	    // provides defense-in-depth against multi-process races.
   914	    let existing: { id: number; content_hash: string } | undefined;
   915	
   916	    // C5-1: Content-hash dedup check BEFORE the write transaction — reads are
   917	    // safe outside the transaction and this avoids an early-return inside the
   918	    // transaction callback (which would COMMIT an empty tx unnecessarily).
   919	    const dupResult = checkContentHashDedup(database, parsed, force, validation.warnings, {
   920	      canonicalFilePath,
   921	      filePath,
   922	    }, scope);
   923	    if (dupResult) {
   924	      return dupResult;
   925	    }
   926	
   927	    const writeTransaction = database.transaction((): number => {
   928	      // CREATE NEW MEMORY
   929	      existing = findSamePathExistingMemory(
   930	        database,
   931	        parsed.specFolder,
   932	        canonicalFilePath,
   933	        filePath,
   934	        scope,
   935	      ) as { id: number; content_hash: string } | undefined;
   936	
   937	      const memoryId = existing && existing.content_hash !== parsed.contentHash
   938	        ? createAppendOnlyMemoryRecord({
   939	            database,
   940	            parsed,
   941	            filePath,
   942	            embedding,
   943	            embeddingFailureReason,
   944	            predecessorMemoryId: existing.id,
   945	            actor: 'mcp:memory_save',
   946	          })
   947	        : createMemoryRecord(
   948	            database,
   949	            parsed,
   950	            filePath,
   951	            embedding,
   952	            embeddingFailureReason,
   953	            peResult.decision,
   954	            scope,
   955	          );
   956	
   957	      // F1.01 fix: Mark superseded memory AFTER new record creation, inside
   958	      // the same transaction, so a creation failure rolls back both operations.
   959	      if (peResult.supersededId != null) {
   960	        const supersededOk = markMemorySuperseded(peResult.supersededId);
   961	        // C5-3: Supersede failure should abort the transaction
   962	        if (!supersededOk) {
   963	          throw new Error(`Failed to mark predecessor ${peResult.supersededId} as superseded`);
   964	        }
   965	      }
   966	
   967	      recordLineageVersion(database, {
   968	        memoryId,
   969	        predecessorMemoryId: existing && existing.content_hash !== parsed.contentHash
   970	          ? existing.id
   971	          : null,
   972	        actor: 'mcp:memory_save',
   973	        transitionEvent: existing && existing.content_hash !== parsed.contentHash
   974	          ? 'SUPERSEDE'
   975	          : 'CREATE',
   976	      });
   977	
   978	      return memoryId;
   979	    });
   980	
   981	    const id: number = writeTransaction.immediate();
   982	
   983	    if (shouldPersistFinalizedFile && finalizedFileContent) {
   984	      try {
   985	        await finalizeMemoryFileContent(filePath, finalizedFileContent);
   986	      } catch (finalizeErr: unknown) {
   987	        finalizeWarning = `[file-persistence-failed] Quality-loop file persistence failed after DB commit: ${finalizeErr instanceof Error ? finalizeErr.message : String(finalizeErr)}. DB row committed — manual file recovery may be needed.`;
   988	        console.warn(`[memory-save] ${finalizeWarning}`);
   989	      }
   990	    }
   991	
   992	    // Data integrity: clean stale auto-entities before re-extraction on update
   993	    // When a memory is superseded or replaced in-place, purge the predecessor's
   994	    // auto-entity rows so the entity catalog reflects only active content.
   995	    if (existing && existing.id !== id) {
   996	      try {
   997	        refreshAutoEntitiesForMemory(database, existing.id, []);
   998	        console.error(`[memory-save] Cleaned stale auto-entities for superseded memory #${existing.id}`);
   999	      } catch (entityCleanupErr: unknown) {
  1000	        // Entity cleanup failure must not block save — log and continue
  1001	        console.warn(`[memory-save] Auto-entity cleanup for #${existing.id} failed:`, entityCleanupErr instanceof Error ? entityCleanupErr.message : String(entityCleanupErr));
  1002	      }
  1003	    }
  1004	    if (peResult.supersededId != null && peResult.supersededId !== existing?.id) {
  1005	      try {
  1006	        refreshAutoEntitiesForMemory(database, peResult.supersededId, []);
  1007	        console.error(`[memory-save] Cleaned stale auto-entities for PE-superseded memory #${peResult.supersededId}`);
  1008	      } catch (entityCleanupErr: unknown) {
  1009	        console.warn(`[memory-save] Auto-entity cleanup for PE #${peResult.supersededId} failed:`, entityCleanupErr instanceof Error ? entityCleanupErr.message : String(entityCleanupErr));
  1010	      }
  1011	    }
  1012	
  1013	    // POST-INSERT ENRICHMENT: causal links, entities, summaries, entity linking
  1014	    const { causalLinksResult, enrichmentStatus } = await runPostInsertEnrichment(database, id, parsed);
  1015	
  1016	    // BUILD RESULT
  1017	    return appendResultWarning(buildIndexResult({
  1018	      database,
  1019	      existing,
  1020	      embeddingStatus,
  1021	      id,
  1022	      parsed,
  1023	      validation,
  1024	      reconWarnings: reconResult.warnings,
  1025	      peDecision: peResult.decision,
  1026	      embeddingFailureReason,
  1027	      asyncEmbedding,
  1028	      causalLinksResult,
  1029	      enrichmentStatus,
  1030	      filePath,
  1031	    }), finalizeWarning);
  1032	  };
  1033	
  1034	  if (specFolderLockAlreadyHeld) {
  1035	    return runWithinSpecFolderLock();
  1036	  }
  1037	
  1038	  return withSpecFolderLock(prepared.parsed.specFolder, runWithinSpecFolderLock);
  1039	}
  1040	
  1041	/* --- 8. INDEX MEMORY FILE --- */
  1042	
  1043	/** Parse, validate, and index a memory file with PE gating, FSRS scheduling, and causal links */
  1044	async function indexMemoryFile(
  1045	  filePath: string,
  1046	  {
  1047	    force = false,
  1048	    parsedOverride = null as ReturnType<typeof memoryParser.parseMemoryFile> | null,
  1049	    asyncEmbedding = false,
  1050	    scope = {} as MemoryScopeMatch,
  1051	    qualityGateMode = 'enforce' as 'enforce' | 'warn-only',
  1052	  } = {},
  1053	): Promise<IndexResult> {
  1054	  // Reuse parsed content when provided by caller to avoid a second parse.
  1055	  const parsed = parsedOverride || memoryParser.parseMemoryFile(filePath);
  1056	  const database = requireDb();
  1057	  const prepared = prepareParsedMemoryForIndexing(parsed, database);
  1058	  const validation = prepared.validation;
  1059	  if (!validation.valid) {
  1060	    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  1061	  }
  1062	  if (prepared.qualityLoopResult.fixes.length > 0 && prepared.qualityLoopResult.passed && prepared.qualityLoopResult.fixedContent) {
  1063	    console.error(`[memory-save] Quality loop applied ${prepared.qualityLoopResult.fixes.length} auto-fix(es) for ${path.basename(filePath)}`);
  1064	  }
  1065	
  1066	  return processPreparedMemory(prepared, filePath, {
  1067	    force,
  1068	    asyncEmbedding,
  1069	    persistQualityLoopContent: true,
  1070	    refreshFromDiskAfterLock: parsedOverride !== null,
  1071	    scope,
  1072	    qualityGateMode,
  1073	  });
  1074	}
  1075	
  1076	/* --- 9. MEMORY SAVE HANDLER --- */
  1077	
  1078	/** Handle memory_save tool - validates, indexes, and persists a memory file to the database */
  1079	async function handleMemorySave(args: SaveArgs): Promise<MCPResponse> {
  1080	  // A7-P2-1: Generate requestId for incident correlation in error responses
  1081	  const requestId = randomUUID();
  1082	  const restoreBarrier = checkpoints.getRestoreBarrierStatus();
  1083	
  1084	  if (restoreBarrier) {
  1085	    return createMCPErrorResponse({

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts | sed -n '200,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   200	          triggerPhrases: parsed.triggerPhrases,
   201	          importanceWeight,
   202	          failureReason: persistedEmbeddingFailureReason,
   203	          encodingIntent,
   204	          documentType: parsed.documentType || 'memory',
   205	          specLevel,
   206	          contentText: parsed.content,
   207	          qualityScore: parsed.qualityScore,
   208	          qualityFlags: parsed.qualityFlags,
   209	          appendOnly: predecessorMemoryId != null,
   210	        });
   211	
   212	    const fileMetadata = incrementalIndex.getFileMetadata(filePath);
   213	    const fileMtimeMs = fileMetadata ? fileMetadata.mtime : null;
   214	
   215	    applyPostInsertMetadata(database, memory_id, {
   216	      content_hash: parsed.contentHash,
   217	      context_type: parsed.contextType,
   218	      importance_tier: parsed.importanceTier,
   219	      memory_type: parsed.memoryType,
   220	      type_inference_source: parsed.memoryTypeSource,
   221	      stability: fsrsScheduler.DEFAULT_INITIAL_STABILITY,
   222	      difficulty: fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
   223	      file_mtime_ms: fileMtimeMs,
   224	      encoding_intent: encodingIntent,
   225	      document_type: parsed.documentType || 'memory',
   226	      spec_level: specLevel,
   227	      quality_score: parsed.qualityScore ?? 0,
   228	      quality_flags: JSON.stringify(parsed.qualityFlags ?? []),
   229	    });
   230	
   231	    if (embedding && peDecision.action === predictionErrorGate.ACTION.CREATE_LINKED && peDecision.existingMemoryId != null) {
   232	      try {
   233	        database.prepare(`
   234	          UPDATE memory_index
   235	          SET related_memories = ?
   236	          WHERE id = ?
   237	        `).run(JSON.stringify([peDecision.existingMemoryId]), memory_id);
   238	      } catch (err: unknown) {
   239	        const message = toErrorMessage(err);
   240	        console.error('[PE-Gate] Could not store related memories:', message);
   241	      }
   242	    }
   243	
   244	    if (predecessorMemoryId != null) {
   245	      database.prepare(`
   246	        UPDATE memory_index
   247	        SET importance_tier = 'deprecated',
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts | sed -n '480,760p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "handleMemoryCausalLink|handleMemoryCausalUnlink|handleMemoryCausalStats|handleMemoryDriftWhy|cleanupOrphanedEdges|coverage percentage|contradicts" .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.js' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 2 in 0ms:
rg: .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.js: No such file or directory (os error 2)
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:50:  by_contradicts: FlatEdge[];
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:63:  contradicts: FlatEdge[];
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:142:    by_contradicts: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:187:      case 'contradicts': return result.by_contradicts;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:210:    by_contradicts: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:229:      case 'contradicts': merged.by_contradicts.push(edge); break;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:276:    by_contradicts: allowed.has('contradicts') ? chain.by_contradicts : [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:294:    by_contradicts: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:309:    contradicts: chain.by_contradicts,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:326:  if (chain.by_contradicts.length > 0) parts.push(`${chain.by_contradicts.length} contradicts`);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:339:async function handleMemoryDriftWhy(args: DriftWhyArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:516:    if (combinedChain.by_contradicts.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:558:async function handleMemoryCausalLink(args: CausalLinkArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:668:async function handleMemoryCausalStats(_args: CausalStatsArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:770:async function handleMemoryCausalUnlink(args: CausalUnlinkArgs): Promise<MCPResponse> {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:844:  handleMemoryDriftWhy,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:845:  handleMemoryCausalLink,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:846:  handleMemoryCausalStats,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:847:  handleMemoryCausalUnlink,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:852:const handle_memory_drift_why = handleMemoryDriftWhy;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:853:const handle_memory_causal_link = handleMemoryCausalLink;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:854:const handle_memory_causal_stats = handleMemoryCausalStats;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:855:const handle_memory_causal_unlink = handleMemoryCausalUnlink;

 succeeded in 0ms:
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
   661	}
   662	
   663	/* ───────────────────────────────────────────────────────────────
   664	   4. CAUSAL GRAPH STATS HANDLER
   665	──────────────────────────────────────────────────────────────── */
   666	
   667	/** Handle memory_causal_stats tool - returns graph coverage and health metrics */
   668	async function handleMemoryCausalStats(_args: CausalStatsArgs): Promise<MCPResponse> {
   669	  const startTime = Date.now();
   670	
   671	  try {
   672	    await checkDatabaseUpdated();
   673	
   674	    vectorIndex.initializeDb();
   675	    const db = vectorIndex.getDb();
   676	    if (!db) {
   677	      return createMCPErrorResponse({
   678	        tool: 'memory_causal_stats',
   679	        error: 'Database not initialized. Server may still be starting up.',
   680	        code: 'E020',
   681	        details: {},
   682	        recovery: getRecoveryHint('memory_causal_stats', 'E020'),
   683	        startTime: startTime
   684	      });
   685	    }
   686	    causalEdges.init(db);
   687	
   688	    const stats = causalEdges.getGraphStats();
   689	    const orphanedEdges: CausalEdge[] = causalEdges.findOrphanedEdges();
   690	
   691	    // Compute link coverage: unique memories linked / total memories
   692	    const totalMemories = (db.prepare('SELECT COUNT(*) as count FROM memory_index') as import('better-sqlite3').Statement).get() as { count: number };
   693	    const uniqueLinked = new Set<string>();
   694	
   695	    // Count unique memory IDs that appear as source or target
   696	    try {
   697	      const linkedRows = (db.prepare(
   698	        'SELECT DISTINCT source_id FROM causal_edges WHERE EXISTS (SELECT 1 FROM memory_index WHERE CAST(id AS TEXT) = source_id) UNION SELECT DISTINCT target_id FROM causal_edges WHERE EXISTS (SELECT 1 FROM memory_index WHERE CAST(id AS TEXT) = target_id)'
   699	      ) as import('better-sqlite3').Statement).all() as Array<{ source_id: string }>;
   700	      for (const row of linkedRows) {
   701	        uniqueLinked.add(row.source_id);
   702	      }
   703	    } catch (error: unknown) {
   704	      const message = toErrorMessage(error).toLowerCase();
   705	      if (message.includes('no such table') && message.includes('causal_edges')) {
   706	        // New/partially initialized DB where causal edges table is absent.
   707	        // Coverage remains 0 in this case.
   708	      } else {
   709	        throw error;
   710	      }
   711	    }
   712	
   713	    const safeTotalEdges = stats.totalEdges ?? 0;
   714	    const coveragePercent = totalMemories.count > 0
   715	      ? Math.round((uniqueLinked.size / totalMemories.count) * 10000) / 100
   716	      : 0;
   717	
   718	    const meetsTarget = coveragePercent >= 60;
   719	    const health = orphanedEdges.length === 0 ? 'healthy' : 'has_orphans';
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/mcp-coco-index/README.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
The strict validator didn’t return inline, so I’m polling that shell session directly. I also confirmed the external checkout is as thin as it looked: `src/index.ts`, `README.md`, packaging files, and no separate AGENTS file or deeper backend implementation in this repo.
exec
/bin/zsh -lc "find .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external -name 'AGENTS.md' -o -name 'agents.md'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
I have enough evidence for the core comparison set now. I’m doing one final tightening pass for exact line-backed claims around packaging boundaries and the absence of backend-side hygiene surfaces in the external repo, then I’ll synthesize the iteration report in the format you requested.
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
/bin/zsh -lc 'rg -n "files":|"main":|"opencode":|@opencode-ai/plugin|description|version" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
zsh:1: unmatched "

exec
/bin/zsh -lc 'rg -n "memory_match_triggers|memory_health|memory_validate|memory_causal_stats|memory_causal_link|memory_delete|memory_update" .opencode/skill/system-spec-kit/mcp_server/README.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
178:  "tool": "memory_health",
674:##### `memory_match_triggers`
688:  "tool": "memory_match_triggers",
763:##### `memory_health`
789:##### `memory_delete`
801:##### `memory_update`
816:##### `memory_validate`
996:##### `memory_causal_link`
1010:##### `memory_causal_stats`
1540:| Check triggers on every prompt | `memory_match_triggers` | Pass the user's prompt text |
1542:| Diagnose search problems | `memory_health` | Set `reportMode: "full"` |
1563:{ "tool": "memory_health", "arguments": { "reportMode": "full", "autoRepair": true } }
1663:{ "tool": "memory_health", "arguments": { "reportMode": "divergent_aliases", "limit": 20 } }
1717:Start with `memory_context` for all retrieval tasks. It handles intent detection and routing automatically. Use `memory_search` when you want explicit control over channels. Use `memory_match_triggers` when processing a raw prompt at the start of each turn. Use L4-L7 tools only for mutation, analysis or maintenance.

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '1859,1863p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1859	- requireDbOrThrow, learning-stats-filters.vitest.ts, integration-causal-graph, memory_health autoRepair, verifyIntegrity autoClean, tmp orphan cleanup
  1860	
  1861	## Task 3: Review/fix 007+009+010+011+014 packets and linked runtime/docs contracts
  1862	
  1863	### rollout_summary_files

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '174,181p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   174	- `memory-metadata.ts` should read `session_id`/`context_type` from both frontmatter and `## MEMORY METADATA` YAML block so derived causal links (`derived_from`, `supersedes`) still populate on older saves [Task 1]
   175	- post-save quality warning language now keys on `input_completeness_score`; keep diagnostics terminology consistent with this field [Task 1]
   176	
   177	## Failures and how to do differently
   178	
   179	- symptom: D1 false positive for truncated OVERVIEW despite full saved paragraph; cause: regex extraction capped review window; fix: switch reviewer extraction to heading-based line scanning [Task 1]
   180	- symptom: valid manual trigger phrase with numeric prefix disappears and causes `PSR-2`; cause: broad `^\\d{1,3}\\s` rejection rule; fix: apply numeric-prefix rejection only when phrase remains short (`<=3` words) [Task 1]
   181	- symptom: causal auto-link misses prior session; cause: parser read `session_id` from frontmatter only; fix: parse metadata YAML block too [Task 1]

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '456,464p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   456	## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
   457	
   458	### rollout_summary_files
   459	
   460	- rollout_summaries/2026-04-03T10-18-09-ppdB-rename_023_hybrid_rag_fusion_refinement.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T12-18-09-019d52d9-a8b9-71c3-949c-f6870aee05a7.jsonl, updated_at=2026-04-03T10:43:47+00:00, thread_id=019d52d9-a8b9-71c3-949c-f6870aee05a7)
   461	
   462	### keywords
   463	
   464	- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog

codex
# Iteration 010: COMPARISON - HYGIENE

## Focus
COMPARISON - HYGIENE: Compare memory quality/hygiene against our causal links, health tooling, trigger system.

## Findings
### Finding 1: Mnemosyne’s hygiene contract lives in prose and prompt injection, not enforceable tooling
- **Source**: [external/src/index.ts#L210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [external/README.md#L62](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L62), [external/package.json#L41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L41)
- **What it does**: Wrapper-confirmed, plus README-documented: the wrapper injects a short “search/store/delete/core/global” checklist during compaction, and the README recommends pasting a matching AGENTS block into projects. The published package exposes only the plugin wrapper surface, not separate validation, repair, or hygiene modules.
- **Why it matters for us**: Public already enforces hygiene in runtime tools; Mnemosyne mainly reminds the agent to behave well. The reusable part is the lightweight hygiene reminder, not the instruction-only governance model. Affected subsystem: compaction/startup guidance.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 2: Mnemosyne stores opaque memory snippets; Public’s save path scores, dedups, and enriches memory quality
- **Source**: [external/src/index.ts#L138](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L138), [external/src/index.ts#L160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L160), [memory-save.ts#L764](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L764), [memory-save.ts#L797](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L797), [memory-save.ts#L1013](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1013), [save/create-record.ts#L215](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L215), [checkpoints.ts#L681](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts#L681)
- **What it does**: Wrapper-confirmed: Mnemosyne `memory_store` and `memory_store_global` accept only `content` plus optional `core`. Public’s save path rejects low-quality saves, dedups by content hash, runs reconsolidation/post-insert enrichment, persists `importance_tier` and `quality_score`, and later learns from `memory_validate`.
- **Why it matters for us**: Mnemosyne has persistence hygiene by convention; Public has persistence hygiene by pipeline. Replacing our structured save/quality loop with Mnemosyne’s minimal atom-store model would be a regression. Affected subsystem: save pipeline, quality loop, adaptive feedback.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: Mnemosyne has no trigger system, so retrieval hygiene stays agent-driven instead of signal-driven
- **Source**: [external/src/index.ts#L96](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L96), [external/src/index.ts#L118](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L118), [memory-triggers.ts#L184](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L184), [memory-triggers.ts#L212](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L212), [memory-triggers.ts#L288](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L288), [memory-triggers.ts#L363](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L363), [memory-triggers.ts#L444](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L444)
- **What it does**: Wrapper-confirmed: Mnemosyne exposes semantic recall for project/global stores, but nothing like trigger phrases, prompt-start matching, session-scoped activation, co-activation, or tiered content trimming. Public’s `memory_match_triggers` validates trusted session IDs, filters by scope, runs attention decay/co-activation, and limits by cognitive state.
- **Why it matters for us**: This is the biggest hygiene difference in retrieval. Mnemosyne tells the agent “remember to search”; Public can proactively surface the right memory when the prompt itself matches stored triggers. Affected subsystem: prompt-start recall, token discipline, session memory activation.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: Mnemosyne’s mutation hygiene is single-shot delete/manual overwrite; Public mutations are transactional and auditable
- **Source**: [external/src/index.ts#L193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L193), [external/README.md#L72](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L72), [memory-crud-delete.ts#L94](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts#L94), [memory-crud-delete.ts#L115](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts#L115), [memory-crud-delete.ts#L163](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts#L163), [memory-crud-delete.ts#L215](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts#L215), [memory-crud-update.ts#L138](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts#L138), [memory-crud-update.ts#L201](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts#L201)
- **What it does**: Wrapper-confirmed plus README-documented: Mnemosyne expects the agent to delete outdated memories by document ID and then store the new fact. Public wraps delete/update in transactions, records history, appends a mutation ledger, checkpoints bulk deletes, clears causal edges, and runs post-mutation hooks.
- **Why it matters for us**: Mnemosyne’s hygiene assumes the agent gets lifecycle discipline right every time. Public keeps an audit trail even when the agent is imperfect, which is much safer for a long-lived memory store. Affected subsystem: mutation safety, rollback, auditability, graph consistency.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Mnemosyne hides readiness drift behind auto-init; Public makes hygiene failures observable and repairable
- **Source**: [external/src/index.ts#L78](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L78), [external/src/index.ts#L171](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L171), [external/README.md#L18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L18), [memory-crud-health.ts#L222](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L222), [memory-crud-health.ts#L426](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L426), [memory-crud-health.ts#L454](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L454), [memory-crud-health.ts#L501](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L501), [memory-crud-health.ts#L520](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L520)
- **What it does**: Wrapper-confirmed: the plugin silently auto-initializes project/global collections and returns a friendly install string when the binary is missing. README-documented: first use downloads a large local model. Public’s `memory_health` explicitly reports DB/model/vector/FTS/alias/orphan status and gates repair behind `confirmed:true`.
- **Why it matters for us**: Mnemosyne optimizes onboarding friction, but it gives almost no in-band health vocabulary for drift, corruption, alias divergence, or orphan cleanup. Public’s hygiene story is operational, not just ergonomic. Affected subsystem: diagnostics, repair, incident response.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 6: Mnemosyne treats contradiction hygiene as deletion; Public models contradiction and supersession as first-class graph state
- **Source**: [external/README.md#L72](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L72), [external/src/index.ts#L193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L193), [causal-graph.ts#L557](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts#L557), [causal-graph.ts#L667](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts#L667), [causal-graph.ts#L721](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts#L721), [memory-save.ts#L957](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L957), [save/create-record.ts#L244](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L244), [save/create-record.ts#L258](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L258)
- **What it does**: README-documented plus wrapper-confirmed: Mnemosyne’s contradiction guidance is “delete contradicted memories.” Public can instead create `supersedes`/`contradicts` relationships, mark predecessors deprecated, trace lineage with `memory_drift_why`, and measure graph coverage/orphans with `memory_causal_stats`.
- **Why it matters for us**: This is the cleanest hygiene win on our side. Delete-only hygiene removes evidence; graph-native hygiene preserves why knowledge changed, which is better for audits and future retrieval ranking. Affected subsystem: causal lineage, contradiction management, historical continuity.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
- [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts)
- [memory-crud-delete.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts)
- [memory-crud-update.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts)
- [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
- [save/create-record.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts)
- [checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts)
- [causal-graph.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)

## Assessment
- New information ratio: 0.81
- Questions addressed: hygiene enforcement versus guidance, trigger-based recall, mutation safety, contradiction handling, operational health/repair, packaging boundary and external repo thinness, AGENTS guidance location, offline-first readiness cost.
- Questions answered: Mnemosyne’s memory hygiene is wrapper-thin and agent-disciplined; Public’s hygiene is system-disciplined through save quality gates, trigger recall, causal lineage, mutation ledgers, and repair tooling. The best transferable idea is a short Mnemosyne-style hygiene reminder layered onto our existing compaction/startup surfaces, not any simplification of our save/delete/health/trigger contracts. The exact strict validation command passed with `RESULT: PASSED` and `Summary: Errors: 0  Warnings: 0`, while also emitting the expected read-only warning `cannot create temp file for here document: Operation not permitted`.

## Reflection
- What worked: reading `external/src/index.ts` first, then tracing directly into `memory-triggers`, `memory-save`, `memory-crud-*`, `checkpoints`, and `causal-graph` made the hygiene contrast much sharper than comparing README claims alone. Running the strict validator gave a concrete phase-status data point instead of an assumption.
- What did not work: the MCP memory/CocoIndex helper calls were not usable in this pass, so I fell back to direct file tracing with `rg` and `sed`. The sandbox is read-only, so I could not update `research/research.md`, `checklist.md`, `implementation-summary.md`, or run `generate-context.js` to save phase memory.

## Recommended Next Focus
Design a Public-side “memory hygiene reminder” layer that borrows Mnemosyne’s concise behavioral checklist, but maps it to Public-native tools: `memory_match_triggers` at turn start, `memory_validate` after useful/unhelpful retrievals, `memory_update` or `memory_delete` for corrections, `memory_causal_link` for supersedes/contradicts lineage, and `memory_health` when retrieval quality looks degraded.


hook: Stop
hook: Stop Completed
tokens used
142,834
# Iteration 010: COMPARISON - HYGIENE

## Focus
COMPARISON - HYGIENE: Compare memory quality/hygiene against our causal links, health tooling, trigger system.

## Findings
### Finding 1: Mnemosyne’s hygiene contract lives in prose and prompt injection, not enforceable tooling
- **Source**: [external/src/index.ts#L210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [external/README.md#L62](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L62), [external/package.json#L41](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L41)
- **What it does**: Wrapper-confirmed, plus README-documented: the wrapper injects a short “search/store/delete/core/global” checklist during compaction, and the README recommends pasting a matching AGENTS block into projects. The published package exposes only the plugin wrapper surface, not separate validation, repair, or hygiene modules.
- **Why it matters for us**: Public already enforces hygiene in runtime tools; Mnemosyne mainly reminds the agent to behave well. The reusable part is the lightweight hygiene reminder, not the instruction-only governance model. Affected subsystem: compaction/startup guidance.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 2: Mnemosyne stores opaque memory snippets; Public’s save path scores, dedups, and enriches memory quality
- **Source**: [external/src/index.ts#L138](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L138), [external/src/index.ts#L160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L160), [memory-save.ts#L764](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L764), [memory-save.ts#L797](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L797), [memory-save.ts#L1013](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1013), [save/create-record.ts#L215](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L215), [checkpoints.ts#L681](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts#L681)
- **What it does**: Wrapper-confirmed: Mnemosyne `memory_store` and `memory_store_global` accept only `content` plus optional `core`. Public’s save path rejects low-quality saves, dedups by content hash, runs reconsolidation/post-insert enrichment, persists `importance_tier` and `quality_score`, and later learns from `memory_validate`.
- **Why it matters for us**: Mnemosyne has persistence hygiene by convention; Public has persistence hygiene by pipeline. Replacing our structured save/quality loop with Mnemosyne’s minimal atom-store model would be a regression. Affected subsystem: save pipeline, quality loop, adaptive feedback.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: Mnemosyne has no trigger system, so retrieval hygiene stays agent-driven instead of signal-driven
- **Source**: [external/src/index.ts#L96](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L96), [external/src/index.ts#L118](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L118), [memory-triggers.ts#L184](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L184), [memory-triggers.ts#L212](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L212), [memory-triggers.ts#L288](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L288), [memory-triggers.ts#L363](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L363), [memory-triggers.ts#L444](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L444)
- **What it does**: Wrapper-confirmed: Mnemosyne exposes semantic recall for project/global stores, but nothing like trigger phrases, prompt-start matching, session-scoped activation, co-activation, or tiered content trimming. Public’s `memory_match_triggers` validates trusted session IDs, filters by scope, runs attention decay/co-activation, and limits by cognitive state.
- **Why it matters for us**: This is the biggest hygiene difference in retrieval. Mnemosyne tells the agent “remember to search”; Public can proactively surface the right memory when the prompt itself matches stored triggers. Affected subsystem: prompt-start recall, token discipline, session memory activation.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: Mnemosyne’s mutation hygiene is single-shot delete/manual overwrite; Public mutations are transactional and auditable
- **Source**: [external/src/index.ts#L193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L193), [external/README.md#L72](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L72), [memory-crud-delete.ts#L94](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts#L94), [memory-crud-delete.ts#L115](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts#L115), [memory-crud-delete.ts#L163](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts#L163), [memory-crud-delete.ts#L215](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts#L215), [memory-crud-update.ts#L138](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts#L138), [memory-crud-update.ts#L201](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts#L201)
- **What it does**: Wrapper-confirmed plus README-documented: Mnemosyne expects the agent to delete outdated memories by document ID and then store the new fact. Public wraps delete/update in transactions, records history, appends a mutation ledger, checkpoints bulk deletes, clears causal edges, and runs post-mutation hooks.
- **Why it matters for us**: Mnemosyne’s hygiene assumes the agent gets lifecycle discipline right every time. Public keeps an audit trail even when the agent is imperfect, which is much safer for a long-lived memory store. Affected subsystem: mutation safety, rollback, auditability, graph consistency.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Mnemosyne hides readiness drift behind auto-init; Public makes hygiene failures observable and repairable
- **Source**: [external/src/index.ts#L78](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L78), [external/src/index.ts#L171](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L171), [external/README.md#L18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L18), [memory-crud-health.ts#L222](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L222), [memory-crud-health.ts#L426](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L426), [memory-crud-health.ts#L454](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L454), [memory-crud-health.ts#L501](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L501), [memory-crud-health.ts#L520](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L520)
- **What it does**: Wrapper-confirmed: the plugin silently auto-initializes project/global collections and returns a friendly install string when the binary is missing. README-documented: first use downloads a large local model. Public’s `memory_health` explicitly reports DB/model/vector/FTS/alias/orphan status and gates repair behind `confirmed:true`.
- **Why it matters for us**: Mnemosyne optimizes onboarding friction, but it gives almost no in-band health vocabulary for drift, corruption, alias divergence, or orphan cleanup. Public’s hygiene story is operational, not just ergonomic. Affected subsystem: diagnostics, repair, incident response.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 6: Mnemosyne treats contradiction hygiene as deletion; Public models contradiction and supersession as first-class graph state
- **Source**: [external/README.md#L72](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L72), [external/src/index.ts#L193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L193), [causal-graph.ts#L557](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts#L557), [causal-graph.ts#L667](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts#L667), [causal-graph.ts#L721](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts#L721), [memory-save.ts#L957](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L957), [save/create-record.ts#L244](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L244), [save/create-record.ts#L258](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L258)
- **What it does**: README-documented plus wrapper-confirmed: Mnemosyne’s contradiction guidance is “delete contradicted memories.” Public can instead create `supersedes`/`contradicts` relationships, mark predecessors deprecated, trace lineage with `memory_drift_why`, and measure graph coverage/orphans with `memory_causal_stats`.
- **Why it matters for us**: This is the cleanest hygiene win on our side. Delete-only hygiene removes evidence; graph-native hygiene preserves why knowledge changed, which is better for audits and future retrieval ranking. Affected subsystem: causal lineage, contradiction management, historical continuity.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts)
- [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md)
- [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
- [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts)
- [memory-crud-delete.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts)
- [memory-crud-update.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts)
- [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
- [save/create-record.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts)
- [checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts)
- [causal-graph.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts)
- [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js)
- [mcp-coco-index/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md)

## Assessment
- New information ratio: 0.81
- Questions addressed: hygiene enforcement versus guidance, trigger-based recall, mutation safety, contradiction handling, operational health/repair, packaging boundary and external repo thinness, AGENTS guidance location, offline-first readiness cost.
- Questions answered: Mnemosyne’s memory hygiene is wrapper-thin and agent-disciplined; Public’s hygiene is system-disciplined through save quality gates, trigger recall, causal lineage, mutation ledgers, and repair tooling. The best transferable idea is a short Mnemosyne-style hygiene reminder layered onto our existing compaction/startup surfaces, not any simplification of our save/delete/health/trigger contracts. The exact strict validation command passed with `RESULT: PASSED` and `Summary: Errors: 0  Warnings: 0`, while also emitting the expected read-only warning `cannot create temp file for here document: Operation not permitted`.

## Reflection
- What worked: reading `external/src/index.ts` first, then tracing directly into `memory-triggers`, `memory-save`, `memory-crud-*`, `checkpoints`, and `causal-graph` made the hygiene contrast much sharper than comparing README claims alone. Running the strict validator gave a concrete phase-status data point instead of an assumption.
- What did not work: the MCP memory/CocoIndex helper calls were not usable in this pass, so I fell back to direct file tracing with `rg` and `sed`. The sandbox is read-only, so I could not update `research/research.md`, `checklist.md`, `implementation-summary.md`, or run `generate-context.js` to save phase memory.

## Recommended Next Focus
Design a Public-side “memory hygiene reminder” layer that borrows Mnemosyne’s concise behavioral checklist, but maps it to Public-native tools: `memory_match_triggers` at turn start, `memory_validate` after useful/unhelpful retrievals, `memory_update` or `memory_delete` for corrections, `memory_causal_link` for supersedes/contradicts lineage, and `memory_health` when retrieval quality looks degraded.
