## Findings
- **Why it matters**: This is the right architecture for long-lived memory. Permanence, recall probability, and current-session salience should stay independent so we do not accidentally make durable rules feel “old” or recent noise feel “important.”
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Reversible forgetting is stronger than hard deletion for durable memory
- **Source**: [archival-manager.ts:358](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L358), [archival-manager.ts:388](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L388), [archival-manager.ts:403](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L403), [archival-manager.ts:558](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L558), [archival-manager.ts:638](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L638), [reconsolidation-bridge.ts:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L396); evidence type: wrapper-confirmed
- **What it does**: Public archives low-value memories instead of immediately deleting them, removes archived rows from BM25/vector retrieval, and supports unarchive. The save-time reconsolidation path also archives older near-duplicates rather than physically deleting them.
- **Why it matters**: For long-lived systems, “forgetting” should usually mean reversible removal from active retrieval, not destruction. That preserves lineage, auditability, and recovery when the system over-prunes.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: Hard expiry should stay opt-in and explicitly ephemeral
- **Source**: [save/types.ts:139](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts#L139), [scope-governance.ts:207](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L207), [scope-governance.ts:255](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L255), [scope-governance.ts:260](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L260), [README.md:710](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L710), [memory-governance.vitest.ts:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts#L160); evidence type: both
- **What it does**: Public supports explicit `retentionPolicy` and `deleteAfter`, and governed ingest rejects `ephemeral` saves without a future expiry. I found test/audit evidence for a `retention_sweep` action, but I did not locate a concrete runtime sweep implementation in this checkout.
- **Why it matters**: This is the correct shape for hard expiry: explicit, narrow, and policy-driven. The gap is operational visibility, not the policy model itself.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Desired-retention scheduling exists internally, but it is not yet an operator-facing memory policy
- **Source**: [fsrs-scheduler.ts:123](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L123), [fsrs-scheduler.ts:177](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L177), [fsrs-scheduler.ts:200](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L200), [pe-gating.ts:142](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts#L142), [tool-schemas.ts:86](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L86), [tool-schemas.ts:165](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L165); evidence type: wrapper-confirmed
--
## Findings
### Finding N: [Title]
- **Source**: file path(s)
- **What it does**: technical description
- **Why it matters**: relevance to our system
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low

- **Impact**: high

### Finding 2: Timeless behavior survives compaction better than startup-time telemetry
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L64), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L216), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L738), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755), [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L74)
- **What it does**: Mnemosyne repeats a timeless operating loop: recall early, save decisions, delete contradictions. Public’s startup instructions are computed once at server startup and include counts, channels, and stale-memory telemetry.
- **Why it matters**: Startup snapshots go stale. Compaction-survival text should carry durable verbs, not volatile inventory. The external design is weak on reconstruction, but strong on preserving an evergreen operating protocol through resets.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Compaction should restore memory awareness, then route reconstruction back to `session_bootstrap()`
- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L409), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L168), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L194), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L330)
- **What it does**: Mnemosyne’s compaction hook only preserves tool awareness; it does not reconstruct session state. Public already has a much stronger replayable recovery path: `session_bootstrap()` calls `session_resume()`, which in turn calls `memory_context(... resume ...)`, then packages health and structural context.
- **Why it matters**: The safe design is not “make compaction carry everything.” It is “make compaction remind the agent what to do next, then rehydrate through the canonical recovery surface.” That keeps compaction lean and keeps authority with bootstrap/resume.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: Mnemosyne’s strongest startup lesson is symmetry: the same memory discipline appears in AGENTS and compaction
- **Source**: [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L62), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L782), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L121), [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L433)
- **What it does**: The external repo repeats one memory-discipline story at session start and at compaction time. Public currently spreads related guidance across startup instructions, bootstrap next actions, and resume hints, but not from one shared memory-discipline helper.
- **Why it matters**: If startup and compaction are supposed to survive different kinds of context loss, they should tell the same story in different lengths. Otherwise drift is inevitable and compaction starts teaching a different recovery model than bootstrap.
- **Recommendation**: prototype later
- **Impact**: medium

## Assessment
- New information ratio: 0.31
- Validation: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict` returned `RESULT: PASSED` with `Errors: 0  Warnings: 0`; the read-only sandbox also emitted `cannot create temp file for here document: Operation not permitted`.
- Path note: the checked-out external repo lives at [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts) and [external/package.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json), not the nested `external/opencode-mnemosyne-main/...` path from the brief.

## Recommended Next Focus
Design a bounded follow-on around a dedicated compaction renderer: one small, timeless memory-survival card that says “use memory tools when relevant, then call `session_bootstrap()` for full reconstruction,” with health-gating and no generic section truncation. After that, decide whether startup, bootstrap, and compaction should all share one Public-native memory-discipline helper.

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

OUTPUT FORMAT:
# Iteration 025: MULTI-AGENT MEMORY SAFETY

## Focus
MULTI-AGENT MEMORY SAFETY: How does this system handle concurrent agent access, merge conflicts, project isolation, and shared vs private memory scoping?

## Findings
### Finding N: [Title]
- **Source**: file path(s)
- **What it does**: technical description
- **Why it matters**: relevance to our system
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low

## Assessment
- New information ratio: [0.0-1.0]

## Recommended Next Focus
[next direction]
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
I’m treating this as a read-only research iteration against the pre-approved phase folder. First I’m doing a quick memory pass for prior shared-memory/governance context, then I’ll trace the external wrapper and compare it to Spec Kit Memory’s scoping and concurrency surfaces.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc 'rg -n "shared memory|shared-space|shared_space|governed retrieval|scope-governance|concurrent|merge conflict|private memory|project/global|global collection|Mnemosyne|multi-agent" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
1109:- symptom: commit fails with `.git/index.lock`; cause: stale lock or concurrent git process; fix: confirm no active git process, remove stale lock, then retry commit [Task 7]
1223:- release-ready checklist, shared_space_upsert, SPECKIT_SHARED_MEMORY_ADMIN_USER_ID, CHECKPOINT_SCOPE_UNSUPPORTED
1496:- when user requested deep sequential review with multi-agent delegation and default-on confirmation, include default-flag/docs/playbook verification in done criteria [Task 2][Task 3]
1577:scope: governed retrieval scope propagation, shared-space authorization contracts, memory health auto-repair safety, hybrid runtime audits, and handler-level envelope/graph-signal guards
1580:## Task 1: Governed retrieval/shared-space admin hardening and graph ranking fix
1826:- Governance hardening in this wave centered on guaranteed session/tenant enforcement in `filterRowsByScope`, shared-space authorization, and scoped retention sweep deletions [Task 3]
2004:- symptom: commit fails with `.git/index.lock`; cause: stale lock or concurrent git process; fix: confirm no active git process, remove stale lock, then retry commit [Task 4]
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

codex
I’ve confirmed the external wrapper is very thin: it auto-inits a project collection from the current directory basename, exposes a separate global write/read path, and has no built-in conflict or merge layer. I’m now tracing our own governance and storage code to pin down what we actually do for shared/private scoping and whether concurrency protection is explicit or mostly delegated to SQLite/tool-level boundaries.
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

mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1524ms:

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
The external package confirms there is no hidden architecture here beyond a single TypeScript wrapper over the `mnemosyne` binary. I also kicked off the exact phase validation command so I can keep the iteration evidence aligned with the packet requirements while I dig into our concurrency and scoping code.
2026-04-10T20:49:40.036266Z ERROR codex_core::tools::router: error=failed to parse function arguments: missing field `cell_id` at line 1 column 66
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'rg -n "filterRowsByScope|sharedSpaceId|shared_space|shared memory|tenantId|actorUserId|actorAgentId|scope-governance|retention sweep|deleteAfter|governed" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:265:| `SPECKIT_MEMORY_ROADMAP_PHASE` | `shared-rollout` | string | Active memory roadmap phase: `baseline`, `lineage`, `graph`, `adaptive`, `scope-governance`, `shared-rollout`. | `lib/config/capability-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:269:| `SPECKIT_MEMORY_SCOPE_ENFORCEMENT` | `true` | boolean | Scope enforcement for tenant/user/agent isolation. Graduated ON. Legacy: `SPECKIT_HYDRA_SCOPE_ENFORCEMENT`. | `lib/governance/scope-governance.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:270:| `SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS` | `true` | boolean | Governance guardrails for validated operations. Graduated ON. Legacy: `SPECKIT_HYDRA_GOVERNANCE_GUARDRAILS`. | `lib/governance/scope-governance.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:272:| `SPECKIT_SHARED_MEMORY_ADMIN_USER_ID` | (none) | string | Admin user ID override for shared memory operations. | `handlers/shared-memory.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:273:| `SPECKIT_SHARED_MEMORY_ADMIN_AGENT_ID` | (none) | string | Admin agent ID override for shared memory operations. | `handlers/shared-memory.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:418:# Enable shared memory spaces
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:19:import { recordGovernanceAudit } from '../lib/governance/scope-governance.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:31:type SharedSpaceAdminTool = 'shared_space_upsert' | 'shared_space_membership_set';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:37:  actorUserId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:38:  actorAgentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:147:  const userIdProvided = typeof args.actorUserId === 'string';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:148:  const agentIdProvided = typeof args.actorAgentId === 'string';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:149:  const normalizedUserId = typeof args.actorUserId === 'string' ? args.actorUserId.trim() : '';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:150:  const normalizedAgentId = typeof args.actorAgentId === 'string' ? args.actorAgentId.trim() : '';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:164:        hint: 'Provide exactly one non-empty actorUserId or actorAgentId value.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:177:        hint: 'Send only actorUserId or actorAgentId, not both.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:190:        hint: 'Provide exactly one caller identity via actorUserId or actorAgentId.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:210:  tenantId?: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:212:  const normalizedTenantId = typeof tenantId === 'string' ? tenantId.trim() : '';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:221:        reason: 'shared_space_tenant_required',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:222:        hint: 'Provide the tenantId for the target shared-space mutation.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:262:  tenantId: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:263:  sharedSpaceId?: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:265:  tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:266:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:271:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:272:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:282:    tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:291:    action: 'shared_space_admin',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:294:    ...buildActorScope(args.actor, args.tenantId, args.spaceId),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:310:    case 'shared_space_not_found':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:312:    case 'shared_space_create_admin_required':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:314:    case 'shared_space_tenant_mismatch':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:316:    case 'shared_space_owner_required':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:317:      return tool === 'shared_space_membership_set'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:320:    case 'shared_space_editor_required':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:322:    case 'shared_space_membership_required':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:324:    case 'shared_space_kill_switch':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:326:    case 'shared_space_rollout_disabled':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:328:    case 'shared_space_tenant_required':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:336:  return reason === 'shared_space_membership_required'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:337:    ? 'shared_space_owner_required'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:349:    code: reason === 'shared_space_not_found' ? 'E_NOT_FOUND' : 'E_AUTHORIZATION',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:352:      hint: reason === 'shared_space_not_found'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:353:        ? 'Create the space first with shared_space_upsert.'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:354:        : reason === 'shared_space_create_admin_required'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:368:      hint: 'Authenticate as the configured shared-memory admin before enabling shared memory.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:374:  tool: 'shared_space_upsert' | 'shared_space_membership_set' | 'shared_memory_status' | 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:408:  tenantId?: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:415:  const normalizedTenantId = typeof tenantId === 'string' && tenantId.trim().length > 0
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:416:    ? tenantId.trim()
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:421:    FROM shared_space_members m
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:422:    JOIN shared_spaces s ON s.space_id = m.space_id
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:454:        tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:461:      tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:462:      actorUserId: args.actorUserId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:463:      actorAgentId: args.actorAgentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:464:    }, args.tenantId);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:472:        FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:485:            buildActorScope(actor, args.tenantId, args.spaceId),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:490:            const reason = normalizeOwnerAdminDenyReason(access.reason ?? 'shared_space_owner_required');
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:493:              tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:505:              msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:511:        const reason = 'shared_space_create_admin_required';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:514:          tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:526:          msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:533:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:566:        FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:573:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:598:      return createSharedSpaceAuthError('shared_space_upsert', result.error, result.msg);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:602:      tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:606:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:621:      'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:645:        tool: 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:652:      tool: 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:653:      actorUserId: args.actorUserId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:654:      actorAgentId: args.actorAgentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:655:    }, args.tenantId);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:660:        buildActorScope(actor, args.tenantId, args.spaceId),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:665:        const reason = normalizeOwnerAdminDenyReason(access.reason ?? 'shared_space_owner_required');
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:669:            tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:684:          console.error(`[shared-memory] Failed to record shared_space_admin audit: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:687:          'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:689:          getSharedSpaceAccessErrorMessage('shared_space_membership_set', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:704:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:720:      tool: 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:724:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:738:      'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:757:      actorUserId: args.actorUserId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:758:      actorAgentId: args.actorAgentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:762:      ? getAllowedSharedSpaceIdsForCaller(db, actor, args.tenantId)
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:772:        tenantId: args.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:806:      actorUserId: typeof args.actorUserId === 'string' ? args.actorUserId : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:807:      actorAgentId: typeof args.actorAgentId === 'string' ? args.actorAgentId : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:812:        'Only the configured shared-memory admin can enable shared memory.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:911:| \`/memory:manage shared create <spaceId> <tenantId> <name>\` | Create or update a shared space; first creator becomes owner |
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:917:Set \`SPECKIT_MEMORY_SHARED_MEMORY=true\` to force-enable shared memory regardless of database state.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:112:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:115:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:213:      tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:292:  const { specFolder, tenantId, userId, agentId, sharedSpaceId } = args;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:293:  if (specFolder || tenantId || userId || agentId || sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:300:          SELECT id, spec_folder, tenant_id, user_id, agent_id, shared_space_id
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:308:          shared_space_id?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:317:          if (tenantId && row.tenant_id !== tenantId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:320:          if (sharedSpaceId && row.shared_space_id !== sharedSpaceId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:54:} from '../lib/governance/scope-governance.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:751:              tenantId: scope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:755:              sharedSpaceId: scope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1106:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1110:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1113:    governedAt,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1115:    deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1137:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1141:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1144:    governedAt,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1146:    deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1153:      tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1157:      sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1164:  if (sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1166:      tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1170:      sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1171:    }, sharedSpaceId, 'editor');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1174:        action: 'memory_save_shared_space',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1176:        tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1180:        sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1181:        reason: access.reason ?? 'shared_space_denied',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1183:      throw new Error(`Shared-memory save denied: ${access.reason ?? 'shared_space_denied'}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1266:    tenantId: governanceDecision.normalized.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1270:    sharedSpaceId: governanceDecision.normalized.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1285:        tenantId: saveScope.tenantId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1288:        sharedSpaceId: saveScope.sharedSpaceId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1465:        tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1469:        sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1470:        reason: sharedSpaceId ? 'shared_space_save' : 'governed_ingest',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1474:      if (sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1478:          WHERE shared_space_id = ?
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1483:        `).get(sharedSpaceId, validatedPath, result.id) as { id?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1486:            spaceId: sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:64:function findSimilarMemories(embedding: Float32Array | null, options: { limit?: number; specFolder?: string | null; tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null } = {}): SimilarMemory[] {
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:65:  const { limit = 5, specFolder = null, tenantId = null, userId = null, agentId = null, sessionId = null, sharedSpaceId = null } = options;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:98:        if (!matchesScopedValue(tenantId, r.tenant_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:103:        if (!matchesScopedValue(sharedSpaceId, r.shared_space_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:102:  const tenantId = normalizeScopeMatchValue(scope.tenantId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:106:  const sharedSpaceId = normalizeScopeMatchValue(scope.sharedSpaceId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:118:      AND ((? IS NULL AND shared_space_id IS NULL) OR shared_space_id = ?)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:125:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:126:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:133:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:134:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:131:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:135:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:138:  governedAt?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:140:  deleteAfter?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:165:  shared_space_id?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:168:  governed_at?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:177:  tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:181:  sharedSpaceId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:70:      tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval. When provided with scope enforcement, results are isolated to this tenant.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:71:      userId: { type: 'string', description: 'User boundary for governed retrieval. Filters private or shared-space user-scoped memories.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:72:      agentId: { type: 'string', description: 'Agent boundary for governed retrieval. Filters agent-scoped memories.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:73:      sharedSpaceId: { type: 'string', description: 'Shared-memory space identifier. Requires explicit membership when shared memory rollout is enabled.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:201:      tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:202:      userId: { type: 'string', description: 'User boundary for governed retrieval.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:203:      agentId: { type: 'string', description: 'Agent boundary for governed retrieval.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:204:      sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:213:  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', minLength: 1, description: 'User prompt or text to match against trigger phrases' }, specFolder: { type: 'string', description: 'Limit trigger matches to a specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed trigger matching.' }, userId: { type: 'string', description: 'User boundary for governed trigger matching.' }, agentId: { type: 'string', description: 'Agent boundary for governed trigger matching.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed trigger matching.' }, limit: { type: 'number', default: 3, minimum: 1, maximum: 100, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', minimum: 1, description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:220:  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:335:      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:338:      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:353:      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:356:      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:370:      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:373:      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:388:      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:391:      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:403:  name: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:410:      tenantId: { type: 'string', description: 'Owning tenant for the shared space.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:412:      actorUserId: { type: 'string', description: 'Authenticated caller user ID. Provide exactly one of actorUserId or actorAgentId.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:413:      actorAgentId: { type: 'string', description: 'Authenticated caller agent ID. Provide exactly one of actorUserId or actorAgentId.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:419:    // Runtime handler validates exactly-one-of actorUserId/actorAgentId
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:420:    required: ['spaceId', 'tenantId', 'name'],
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:425:  name: 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:432:      tenantId: { type: 'string', description: 'Tenant boundary for the membership mutation.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:433:      actorUserId: { type: 'string', description: 'Authenticated caller user ID. Provide exactly one of actorUserId or actorAgentId.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:434:      actorAgentId: { type: 'string', description: 'Authenticated caller agent ID. Provide exactly one of actorUserId or actorAgentId.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:439:    required: ['spaceId', 'tenantId', 'subjectType', 'subjectId', 'role'],
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:450:      tenantId: { type: 'string', description: 'Optional tenant filter applied to the authenticated caller scope.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:451:      actorUserId: { type: 'string', description: 'Authenticated caller user ID. Provide exactly one of actorUserId or actorAgentId.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:452:      actorAgentId: { type: 'string', description: 'Authenticated caller agent ID. Provide exactly one of actorUserId or actorAgentId.' },
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:5:Complete installation and configuration guide for the Spec Kit Memory MCP server. This guide enables AI-powered context retrieval and conversation memory across your project. The system indexes markdown documentation from spec folders and constitutional rules to surface relevant information during AI interactions. It provides 43 tools covering semantic search, trigger-based memory surfacing, intent-aware context loading, causal relationship tracking, shared memory spaces, session learning, evaluation, validation, and bounded structural code-graph indexing.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:171:  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:210:                if (scope?.tenantId && r.tenant_id && r.tenant_id !== scope.tenantId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:213:                if (scope?.sharedSpaceId && r.shared_space_id && r.shared_space_id !== scope.sharedSpaceId) return false;
.opencode/skill/system-spec-kit/mcp_server/README.md:93:| `/spec_kit:resume` | Continue or recover an interrupted spec-folder session through the broader memory/session recovery stack | Broad helper surface; primary chain uses 3 shared memory tools |
.opencode/skill/system-spec-kit/mcp_server/README.md:443:For the full shared memory guide, see [SHARED_MEMORY_DATABASE.md](../SHARED_MEMORY_DATABASE.md).
.opencode/skill/system-spec-kit/mcp_server/README.md:573:| `tenantId` | string | Tenant boundary for governed retrieval |
.opencode/skill/system-spec-kit/mcp_server/README.md:574:| `userId` | string | User boundary for governed retrieval |
.opencode/skill/system-spec-kit/mcp_server/README.md:575:| `agentId` | string | Agent boundary for governed retrieval |
.opencode/skill/system-spec-kit/mcp_server/README.md:576:| `sharedSpaceId` | string | Shared-space boundary for governed retrieval |
.opencode/skill/system-spec-kit/mcp_server/README.md:631:| `tenantId` | string | Tenant boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:634:| `sharedSpaceId` | string | Shared-memory boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:666:| `tenantId` | string | Tenant boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:669:| `sharedSpaceId` | string | Shared-memory boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:711:| `deleteAfter` | string | ISO date for automatic deletion |
.opencode/skill/system-spec-kit/mcp_server/README.md:713:| `tenantId` | string | Governance: tenant scope |
.opencode/skill/system-spec-kit/mcp_server/README.md:716:| `sharedSpaceId` | string | Governance: shared-space target |
.opencode/skill/system-spec-kit/mcp_server/README.md:719:| `governedAt` | string | ISO timestamp for governed ingest audit |
.opencode/skill/system-spec-kit/mcp_server/README.md:891:##### `shared_space_upsert`
.opencode/skill/system-spec-kit/mcp_server/README.md:893:Create or update a shared-memory space. Shared spaces start locked: nobody can read or write until you add members with `shared_space_membership_set`. The person or agent who creates the space automatically becomes its owner.
.opencode/skill/system-spec-kit/mcp_server/README.md:898:| `tenantId` | string | **Required.** Tenant scope |
.opencode/skill/system-spec-kit/mcp_server/README.md:900:| `actorUserId` | string | Caller identity (user). Provide exactly one actor |
.opencode/skill/system-spec-kit/mcp_server/README.md:901:| `actorAgentId` | string | Caller identity (agent). Provide exactly one actor |
.opencode/skill/system-spec-kit/mcp_server/README.md:908:##### `shared_space_membership_set`
.opencode/skill/system-spec-kit/mcp_server/README.md:915:| `tenantId` | string | **Required.** Tenant boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:916:| `actorUserId` | string | Caller identity (user). Provide exactly one actor |
.opencode/skill/system-spec-kit/mcp_server/README.md:917:| `actorAgentId` | string | Caller identity (agent). Provide exactly one actor |
.opencode/skill/system-spec-kit/mcp_server/README.md:926:Check the state of shared memory. See which spaces exist, who has access and whether the kill switch is active. Use this to verify your setup after making changes.
.opencode/skill/system-spec-kit/mcp_server/README.md:930:| `tenantId` | string | Filter by tenant |
.opencode/skill/system-spec-kit/mcp_server/README.md:1501:  "tool": "shared_space_upsert",
.opencode/skill/system-spec-kit/mcp_server/README.md:1504:    "tenantId": "acme",
.opencode/skill/system-spec-kit/mcp_server/README.md:1506:    "actorAgentId": "spec-kit"
.opencode/skill/system-spec-kit/mcp_server/README.md:1515:  "tool": "shared_space_membership_set",
.opencode/skill/system-spec-kit/mcp_server/README.md:1518:    "tenantId": "acme",
.opencode/skill/system-spec-kit/mcp_server/README.md:1519:    "actorAgentId": "spec-kit",
.opencode/skill/system-spec-kit/mcp_server/README.md:1527:For the full shared memory guide, see [SHARED_MEMORY_DATABASE.md](../SHARED_MEMORY_DATABASE.md).
.opencode/skill/system-spec-kit/mcp_server/README.md:1705:Yes, through shared memory. Call `shared_memory_enable`, create a space with `shared_space_upsert` and grant access with `shared_space_membership_set`. Spaces are deny-by-default and the first creator becomes owner. See [SHARED_MEMORY_DATABASE.md](../SHARED_MEMORY_DATABASE.md) for the full guide.
.opencode/skill/system-spec-kit/mcp_server/README.md:1743:| [SHARED_MEMORY_DATABASE.md](../SHARED_MEMORY_DATABASE.md) | Complete shared memory guide: setup, use cases, roles, kill switch, troubleshooting |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:35:  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:45:      tenantId: scope?.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:49:      sharedSpaceId: scope?.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:92:  tenantId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:102:  tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:159:  tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:331:  tenantId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:351:    tenantId: normalizeIdentityValue(row.tenant_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:358:  storedIdentity: { tenantId: string | null; userId: string | null; agentId: string | null },
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:361:  const requestedTenantId = normalizeIdentityValue(scope.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:362:  if (requestedTenantId && storedIdentity.tenantId !== requestedTenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:363:    return 'tenantId';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:380:  storedIdentity: { tenantId: string | null; userId: string | null; agentId: string | null } | null,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:381:): storedIdentity is { tenantId: string | null; userId: string | null; agentId: string | null } {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:382:  return Boolean(storedIdentity && (storedIdentity.tenantId || storedIdentity.userId || storedIdentity.agentId));
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1030:    const tenantId = normalizeIdentityValue(state.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1064:      tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1150:      tenantId: normalizeIdentityValue(row.tenant_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1167:      tenantId: storedIdentity.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1209:        tenantId: normalizeIdentityValue(row.tenant_id),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:19:  ['tenant_id', 'tenantId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:23:  ['shared_space_id', 'sharedSpaceId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:57:    tenantId: normalizeScopeMatchValue(scope.tenantId),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:61:    sharedSpaceId: normalizeScopeMatchValue(scope.sharedSpaceId),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:104:  tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:107:  sharedSpaceId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:123:  tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:126:  sharedSpaceId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:160:  tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:163:  sharedSpaceId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:169:  tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:172:  sharedSpaceId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:186:  // validated at runtime by scope-governance.ts (F3.04 fix).
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:187:  tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:191:  sharedSpaceId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:194:  governedAt: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:196:  deleteAfter: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:268:  tenantId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:271:  sharedSpaceId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:277:  tenantId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:280:  sharedSpaceId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:286:  tenantId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:289:  sharedSpaceId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:295:  tenantId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:298:  sharedSpaceId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:426:  shared_space_upsert: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:428:    tenantId: z.string(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:430:    actorUserId: z.string().optional().describe('Actor identity (provide actorUserId OR actorAgentId, not both)'),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:431:    actorAgentId: z.string().optional().describe('Actor identity (provide actorUserId OR actorAgentId, not both)'),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:436:  shared_space_membership_set: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:438:    tenantId: z.string(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:439:    actorUserId: z.string().optional().describe('Actor identity (provide actorUserId OR actorAgentId, not both)'),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:440:    actorAgentId: z.string().optional().describe('Actor identity (provide actorUserId OR actorAgentId, not both)'),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:446:    tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:447:    actorUserId: z.string().optional().describe('Actor identity (provide actorUserId OR actorAgentId, not both)'),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:448:    actorAgentId: z.string().optional().describe('Actor identity (provide actorUserId OR actorAgentId, not both)'),
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
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:65:import { normalizeScopeContext } from '../lib/governance/scope-governance.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:181:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:184:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:498:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:501:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:533:  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:535:    tenantId: normalizedScope.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:539:    sharedSpaceId: normalizedScope.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:724:    tenantId: normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:727:    sharedSpaceId: normalizedScope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:781:      tenantId: normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:784:      sharedSpaceId: normalizedScope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:5:  - "shared memory spaces"
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:7:  - "shared memory enable"
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:43:| `shared_space_upsert` | Create or update a shared space; requires caller auth and tenant scope |
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:44:| `shared_space_membership_set` | Set deny-by-default membership for a user or agent; requires caller auth and tenant scope |
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:50:`shared_memory_status`, `shared_space_upsert`, and `shared_space_membership_set` rely on actor identity validation in `handlers/shared-memory.ts`. Admin mutations compare the caller against the configured shared-memory admin identity before allowing ownership-sensitive changes.
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:42:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:45:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:51:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:54:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:60:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:63:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:69:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:72:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:77:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:80:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:203:  const tenantId = validateValue(args.tenantId, 'tenantId', { trim: true });
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:206:  const sharedSpaceId = validateValue(args.sharedSpaceId, 'sharedSpaceId');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:208:    userId !== undefined || agentId !== undefined || sharedSpaceId !== undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:212:    && tenantId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:213:    && tenantId.trim().length === 0
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:215:    throw new Error('tenantId must be a non-empty string when userId, agentId, or sharedSpaceId is provided');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:219:    tenantId: tenantId && tenantId.length > 0 ? tenantId : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:222:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:228:    scope.tenantId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:231:    || scope.sharedSpaceId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:236:  return scope.tenantId === undefined && (
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:239:    || scope.sharedSpaceId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:249:    ...(scope.tenantId !== undefined ? { tenantId: scope.tenantId } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:252:    ...(scope.sharedSpaceId !== undefined ? { sharedSpaceId: scope.sharedSpaceId } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:268:    matchesScopeField('tenantId') &&
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:271:    matchesScopeField('sharedSpaceId')
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:277:  if (scope.tenantId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:278:    details.tenantId = scope.tenantId;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:286:  if (scope.sharedSpaceId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:287:    details.sharedSpaceId = scope.sharedSpaceId;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:297:    error: 'tenantId is required when userId, agentId, or sharedSpaceId is provided.',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:303:      hint: 'Retry with tenantId included for governed checkpoint access.',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:86:        tenantId: validated.tenantId as string | undefined,
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:89:        sharedSpaceId: validated.sharedSpaceId as string | undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:79:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:82:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:116:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:119:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:704:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:707:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:725:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:728:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:756:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:759:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:790:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:793:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:829:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1281:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1284:    sharedSpaceId: args.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1354:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:29:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:32:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:49:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:52:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:156:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:160:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:163:  governedAt?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:165:  deleteAfter?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:179:  tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:181:  actorUserId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:182:  actorAgentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:190:  tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:191:  actorUserId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:192:  actorAgentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:199:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:200:  actorUserId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:201:  actorAgentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:219:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:222:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:229:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:232:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:239:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:242:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:249:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:252:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:56:  'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:57:  'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:77:    case 'shared_space_upsert':        return handleSharedSpaceUpsert(parseArgs<SharedSpaceUpsertArgs>(validateToolArgs('shared_space_upsert', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:78:    case 'shared_space_membership_set': return handleSharedSpaceMembershipSet(parseArgs<SharedSpaceMembershipArgs>(validateToolArgs('shared_space_membership_set', args)));
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:4:vi.mock('../lib/governance/scope-governance', async (importOriginal) => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:5:  const actual = await importOriginal<typeof import('../lib/governance/scope-governance')>();
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:12:import * as scopeGovernance from '../lib/governance/scope-governance';
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:39:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:45:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:58:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:63:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:74:      tenantId: 'tenant-A',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:94:      tenantId: 'tenant-A',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:106:      tenantId: 'tenant-A',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:117:      tenantId: 'tenant-A',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:129:      tenantId: 'tenant-B',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:139:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:143:      reason: 'shared_space_id_required',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:152:      action: 'shared_space_access',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:154:      reason: 'shared_space_id_required',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:164:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:182:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:186:      reason: 'shared_space_owner_required',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:190:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:203:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:221:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:228:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:240:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:252:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:256:      reason: 'shared_space_membership_required',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:260:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:267:      SELECT decision, reason, tenant_id, user_id, shared_space_id
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:269:      WHERE action = 'shared_space_access'
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:274:        reason: 'shared_space_membership_required',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:277:        shared_space_id: 'space-audit',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:284:        shared_space_id: 'space-audit',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:294:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:301:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:307:      FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:322:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:342:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:349:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:353:      reason: 'shared_space_membership_required',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:357:    expect(consoleErrorSpy.mock.calls[0]?.[0]).toContain('Failed to record shared_space_access audit');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:366:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:378:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:385:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:392:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:397:      reason: 'shared_space_kill_switch',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:408:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:421:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:425:      reason: 'shared_space_rollout_disabled',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:435:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:437:    })).toThrow('E_VALIDATION: spaceId and tenantId must be non-empty strings');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:453:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:459:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:477:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:482:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:486:      reason: 'shared_space_tenant_mismatch',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:496:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:512:      FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:524:      SELECT action, decision, memory_id, logical_key, shared_space_id, reason
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:533:      shared_space_id: 'space-4',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:544:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:574:      FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:608:      WHERE shared_space_id = ?
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:644:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:651:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:658:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:665:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:720:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:753:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:766:      INSERT INTO shared_space_conflicts (
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:779:      INSERT INTO shared_space_conflicts (
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:10:  filterRowsByScope,
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:11:} from '../lib/governance/scope-governance';
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:29:      shared_space_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:74:    const filtered = filterRowsByScope(rows, {
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:75:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:105:    expect(filterRowsByScope(rows, {
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:106:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:109:    expect(filterRowsByScope(rows, {
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:110:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:69:    tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:72:    sharedSpaceId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:103:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:106:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:124:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:127:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:200:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:203:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:211:  shared_space_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:425:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:428:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:453:    tenantId: normalizeScopeValue(tenantId),
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:456:    sharedSpaceId: normalizeScopeValue(sharedSpaceId),
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:460:    ['tenant_id', requestedScope.tenantId],
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:463:    ['shared_space_id', requestedScope.sharedSpaceId],
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:471:      shared_space_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:477:      tenantId: duplicate.tenant_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:480:      sharedSpaceId: duplicate.shared_space_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:483:      existingScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:486:      existingScope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:529:        SELECT id, file_path, content_text, tenant_id, user_id, agent_id, shared_space_id
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:541:        shared_space_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:572:        tenantId: requestedScope.tenantId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:575:        sharedSpaceId: requestedScope.sharedSpaceId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:586:          shared_space_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:759:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:762:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:853:      { content, spec_folder, database, find_similar, embedding, tenantId, userId, agentId, sharedSpaceId },
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:310:  it('runtime accepts governed scope fields for memory_search', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:314:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:317:        sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:335:describe('governed retrieval schema propagation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:336:  it('public and runtime schemas accept governed scope fields for memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:339:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:342:      sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:363:  it('public and runtime schemas accept governed scope fields for memory_quick_search', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:366:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:369:      sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:378:  it('public and runtime schemas accept governed scope fields for memory_match_triggers', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:382:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:385:      sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:397:    for (const toolName of ['shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status']) {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:401:        actorUserId: { type: 'string' },
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:402:        actorAgentId: { type: 'string' },
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:409:  it('runtime accepts exactly one actor identity for shared_space_upsert', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:411:      validateToolArgs('shared_space_upsert', {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:413:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:415:        actorUserId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:420:  it('handler auth rejects shared_space_upsert when actor identity is omitted', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:425:        tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:430:  it('handler auth rejects shared_space_membership_set when both actor identities are provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:435:        tool: 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:436:        actorUserId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:437:        actorAgentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:444:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:457:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:458:        actorAgentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:46:describe('shared memory E2E', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:77:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:89:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:93:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:105:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:117:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:121:      reason: 'shared_space_membership_required',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:124:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:134:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:151:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:4:// Hierarchical scope enforcement, governed ingest validation,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:10:// Feature catalog: Hierarchical scope governance, governed ingest, retention, and audit
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:14: * Retention modes applied during governed ingest.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:22:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:26:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:35:  governedAt?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:37:  deleteAfter?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:41: * Result of governed-ingest validation and field normalization.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:45:  tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:49:  sharedSpaceId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:52:  governedAt: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:54:  deleteAfter: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:160:    tenantId: normalizeId(input.tenantId),
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:164:    sharedSpaceId: normalizeId(input.sharedSpaceId),
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:173: * is configured with tenantId/userId/agentId/sharedSpaceId in queries.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:196: * Determine whether an ingest request must pass governed-ingest validation.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:206:    || typeof input.governedAt === 'string'
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:209:    || typeof input.deleteAfter === 'string';
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:213: * Validate governed-ingest metadata and return normalized persistence fields.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:221:  const governedAt = normalizeIsoTimestamp(input.governedAt) ?? new Date().toISOString();
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:222:  const deleteAfter = normalizeIsoTimestamp(input.deleteAfter) ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:235:        tenantId: scope.tenantId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:239:        sharedSpaceId: scope.sharedSpaceId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:242:        governedAt,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:244:        deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:250:  if (!scope.tenantId) issues.push('tenantId is required for governed ingest');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:251:  if (!scope.sessionId) issues.push('sessionId is required for governed ingest');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:252:  if (!scope.userId && !scope.agentId) issues.push('userId or agentId is required for governed ingest');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:253:  if (!provenanceSource) issues.push('provenanceSource is required for governed ingest');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:254:  if (!provenanceActor) issues.push('provenanceActor is required for governed ingest');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:255:  if (deleteAfter && new Date(deleteAfter).getTime() <= new Date(governedAt).getTime()) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:256:    issues.push('deleteAfter must be later than governedAt');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:258:  // H21 FIX: Require valid future deleteAfter for ephemeral retention policy
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:260:  if (retentionPolicy === 'ephemeral' && !deleteAfter) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:261:    issues.push('deleteAfter is required for ephemeral retention policy');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:269:      tenantId: scope.tenantId ?? '',
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:273:      sharedSpaceId: scope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:276:      governedAt,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:278:      deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:291:    tenant_id: decision.normalized.tenantId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:295:    shared_space_id: decision.normalized.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:298:    governed_at: decision.normalized.governedAt,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:300:    delete_after: decision.normalized.deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:302:      tenantId: decision.normalized.tenantId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:306:      sharedSpaceId: decision.normalized.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:309:      governedAt: decision.normalized.governedAt,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:311:      deleteAfter: decision.normalized.deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:338:      shared_space_id, reason, metadata
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:345:    scope.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:349:    scope.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:368:    scope.sharedSpaceId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:369:    || scope.tenantId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:409:  if (normalized.tenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:411:    params.push(normalized.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:425:  if (normalized.sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:426:    clauses.push('shared_space_id = ?');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:427:    params.push(normalized.sharedSpaceId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:441:    || normalized.tenantId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:445:    || normalized.sharedSpaceId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:470:    const rowSharedSpaceId = normalizeId(row.shared_space_id);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:472:      if (normalized.sharedSpaceId && rowSharedSpaceId !== normalized.sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:478:    } else if (normalized.sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:486:      return matchesExactScope(row.tenant_id, normalized.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:489:    return matchesExactScope(row.tenant_id, normalized.tenantId)
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:511:    console.warn('[scope-governance] Unscoped governance audit enumeration blocked; explicit filters or allowUnscoped=true required.');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:539:      shared_space_id,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:557:    shared_space_id: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:606:      tenantId: row.tenant_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:610:      sharedSpaceId: row.shared_space_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:673:export function filterRowsByScope<T extends Record<string, unknown>>(rows: T[], scope: ScopeContext, allowedSharedSpaceIds?: ReadonlySet<string>): T[] {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:452:        shared_space_id: 'space-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:463:        shared_space_id: 'space-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:474:        shared_space_id: null,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:479:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:481:      sharedSpaceId: 'space-a',
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:18:} from '../governance/scope-governance.js';
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:35:  tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:61:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:147:    FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:235: * @param tenantId - Optional tenant to constrain the summary.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:238:export function getSharedRolloutMetrics(database: Database.Database, tenantId?: string): SharedRolloutMetrics {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:240:  const normalizedTenantId = normalizeScopeContext({ tenantId }).tenantId ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:252:    FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:264:    FROM shared_space_members m
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:265:    JOIN shared_spaces s ON s.space_id = m.space_id
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:271:    FROM shared_space_conflicts c
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:272:    JOIN shared_spaces s ON s.space_id = c.space_id
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:277:    tenantId: normalizedTenantId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:292: * @param tenantId - Optional tenant to constrain the summary.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:297:  tenantId?: string,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:300:  const normalizedTenantId = normalizeScopeContext({ tenantId }).tenantId ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:303:    FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:315:    FROM shared_spaces s
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:316:    LEFT JOIN shared_space_members m ON m.space_id = s.space_id
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:378:    FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:397:  if (!definition.spaceId?.trim() || !definition.tenantId?.trim()) {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:398:    throw new Error('E_VALIDATION: spaceId and tenantId must be non-empty strings');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:430:    INSERT INTO shared_spaces (space_id, tenant_id, name, rollout_enabled, rollout_cohort, kill_switch, metadata, updated_at)
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:436:    definition.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:457:    INSERT INTO shared_spaces (space_id, tenant_id, name, rollout_enabled, rollout_cohort, kill_switch, metadata, updated_at)
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:469:    definition.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:492:    INSERT INTO shared_space_members (space_id, subject_type, subject_id, role, updated_at)
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:514:  if (!normalizedScope.tenantId) return new Set();
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:526:      FROM shared_space_members m
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:527:      JOIN shared_spaces s ON s.space_id = m.space_id
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:536:      normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:569:        action: 'shared_space_access',
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:572:        tenantId: normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:576:        sharedSpaceId: spaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:584:      console.error(`[shared-spaces] Failed to record shared_space_access audit: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:597:    return deny('shared_space_id_required');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:608:    FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:613:    return deny('shared_space_not_found');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:615:  if (normalizedScope.tenantId && space.tenant_id !== normalizedScope.tenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:616:    return deny('shared_space_tenant_mismatch', {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:620:  if (isGovernanceGuardrailsEnabled() && !normalizedScope.tenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:621:    return deny('shared_space_tenant_required');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:626:    return deny('shared_space_kill_switch');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:629:    return deny('shared_space_rollout_disabled');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:634:    return deny('shared_space_membership_required');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:643:    FROM shared_space_members
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:660:    return deny('shared_space_membership_required');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:663:    return deny('shared_space_owner_required', { resolvedRole: role });
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:666:    return deny('shared_space_editor_required', { resolvedRole: role });
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:695:      INSERT INTO shared_space_conflicts (
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:713:      sharedSpaceId: args.spaceId,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:171:          sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:179:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:182:          sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:189:            tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:192:            sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:195:            tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:198:            sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:216:    it('T521-C9: whitespace-only tenantId is rejected when actor scope is provided', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:219:        tenantId: '   ',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:221:      })).rejects.toThrow(/tenantId must be a non-empty string/i);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:277:          metadata: { userId: 'user-1', sharedSpaceId: 'space-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:286:          metadata: { userId: 'user-2', sharedSpaceId: 'space-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:291:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:293:          sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:300:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:302:          sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:417:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:520:        metadata: JSON.stringify({ sharedSpaceId: 'space-2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:527:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:528:          sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:544:        sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:89:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:91:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:96:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:97:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:103:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:116:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:118:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:131:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:133:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:146:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:148:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:158:      FROM shared_space_members
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:170:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:172:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:180:        && sql.includes('FROM shared_spaces')
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:191:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:193:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:203:      FROM shared_space_members
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:209:      FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:221:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:223:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:229:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:231:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:244:      if (sql.includes('INSERT INTO shared_space_members')) {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:252:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:254:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:263:      FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:271:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:273:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:277:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:278:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:286:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:288:      actorUserId: 'user-editor',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:293:    expect(envelope.data.details?.reason).toBe('shared_space_owner_required');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:299:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:301:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:305:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:306:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:314:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:315:      actorUserId: 'user-space-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:326:      FROM shared_space_members
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:336:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:338:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:342:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:343:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:351:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:352:      actorUserId: 'user-editor',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:360:    expect(envelope.data.details?.reason).toBe('shared_space_owner_required');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:366:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:378:      { actorUserId: '   ' },
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:379:      { actorAgentId: '\t' },
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:380:      { actorUserId: ' ', actorAgentId: 'agent-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:386:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:401:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:403:      actorUserId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:404:      actorAgentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:415:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:417:      actorUserId: 'user-non-admin',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:423:    expect(envelope.data.details?.reason).toBe('shared_space_create_admin_required');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:430:    const actor = resolveAdminActor('shared_space_upsert');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:444:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:446:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:452:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:454:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:461:      FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:471:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:473:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:478:      SELECT action, decision, reason, tenant_id, user_id, shared_space_id, metadata
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:480:      WHERE action = 'shared_space_admin'
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:489:      shared_space_id: string;
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:493:    expect(auditRow.action).toBe('shared_space_admin');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:498:    expect(auditRow.shared_space_id).toBe('space-audit-success');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:511:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:513:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:518:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:519:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:526:      UPDATE shared_space_members
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:531:      INSERT INTO shared_space_members (space_id, subject_type, subject_id, role)
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:537:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:538:      actorUserId: 'user-editor',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:546:    expect(envelope.data.details?.reason).toBe('shared_space_owner_required');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:549:      SELECT action, decision, reason, tenant_id, user_id, shared_space_id, metadata
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:551:      WHERE action = 'shared_space_admin'
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:560:      shared_space_id: string;
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:564:    expect(auditRow.action).toBe('shared_space_admin');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:566:    expect(auditRow.reason).toBe('shared_space_owner_required');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:569:    expect(auditRow.shared_space_id).toBe('space-owner-only');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:584:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:586:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:590:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:591:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:599:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:600:      actorUserId: 'user-space-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:608:    expect(envelope.data.details?.reason).toBe('shared_space_tenant_mismatch');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:618:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:619:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:637:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:638:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:650:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:652:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:657:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:659:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:664:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:665:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:672:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:673:      actorUserId: 'user-other',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:705:      actorUserId: 'user-other',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:723:      actorUserId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:16:    shared_space_id: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:28:    shared_space_id: null,
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:68:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:96:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:9:  filterRowsByScope,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:13:} from '../lib/governance/scope-governance';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:23:  it('rejects governed ingest when provenance or scope markers are missing', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:28:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:33:    expect(decision.issues).toContain('userId or agentId is required for governed ingest');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:34:    expect(decision.issues).toContain('provenanceSource is required for governed ingest');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:39:    const filtered = filterRowsByScope([
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:44:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:55:      { tenant_id: 'a', user_id: 'u1', agent_id: null, session_id: null, shared_space_id: null },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:56:      { tenant_id: 'b', user_id: 'u2', agent_id: null, session_id: null, shared_space_id: null },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:59:    const filtered = filterRowsByScope(rows, {});
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:65:    const filtered = filterRowsByScope([
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:90:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:93:      reason: 'governed_ingest',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:112:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:145:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:148:      reason: 'governed_ingest',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:154:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:162:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:169:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:183:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:209:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:212:      reason: 'governed_ingest',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:221:      '[scope-governance] Unscoped governance audit enumeration blocked; explicit filters or allowUnscoped=true required.'
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:232:      { id: 1, tenant_id: 'tenant-a', user_id: 'user-1', session_id: 'session-1', shared_space_id: 'space-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:233:      { id: 2, tenant_id: 'tenant-a', user_id: 'user-1', session_id: 'session-1', shared_space_id: 'space-2' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:234:      { id: 3, tenant_id: 'tenant-a', user_id: 'user-2', session_id: 'session-1', shared_space_id: 'space-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:235:      { id: 4, tenant_id: 'tenant-b', user_id: 'user-1', session_id: 'session-1', shared_space_id: 'space-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:240:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:246:    expect(filterRowsByScope(rows, {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:247:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:253:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:86:    tools: ['checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete', 'shared_memory_enable', 'shared_memory_status', 'shared_space_upsert', 'shared_space_membership_set']
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:173:              tenantId,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:203:              tenant_id: tenantId ?? existing?.tenant_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:414:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:607:        tenantId: 'tenant-1',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:694:        tenantId: 'tenant-z',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:712:        tenantId: 'tenant-z',
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:51:      shared_space_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:74:    tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:78:    sharedSpaceId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:94:      shared_space_id
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:104:    scope.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:108:    scope.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:238:      const folder = 'specs/governed-dedup';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:242:        '/specs/governed-dedup/memory/tenant-a.md',
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:246:        { tenantId: 'tenant-a' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:255:        { tenantId: 'tenant-b' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:263:      const folder = 'specs/governed-dedup-match';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:267:        '/specs/governed-dedup-match/memory/tenant-a.md',
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:271:        { tenantId: 'tenant-a', sharedSpaceId: 'shared-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:280:        { tenantId: 'tenant-a', sharedSpaceId: 'shared-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:371:        { tenantId: 'tenant-a' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:400:        { tenantId: 'tenant-a', sharedSpaceId: 'shared-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:404:      expect(capturedSql).toContain('shared_space_id = ?');
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:595:      const filePath = '/specs/governed-same-path/memory/doc.md';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:601:        'specs/governed-same-path',
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:611:        buildParsedMemory('specs/governed-same-path', content, 'Tenant Scoped'),
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:616:        { tenantId: 'tenant-b' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:624:      const filePath = '/specs/governed-predecessor/memory/doc.md';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:630:        'specs/governed-predecessor',
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:640:        'specs/governed-predecessor',
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:643:        { tenantId: 'tenant-b' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:647:        'specs/governed-predecessor',
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:650:        { tenantId: 'tenant-a' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:146:    scope.tenantId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:150:    || scope.sharedSpaceId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:158:    const tenantMatches = !scope.tenantId || row.tenant_id === scope.tenantId;
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:162:    const sharedMatches = !scope.sharedSpaceId || (
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:163:      row.shared_space_id === scope.sharedSpaceId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:164:      && (!allowedSharedSpaceIds || allowedSharedSpaceIds.has(String(row.shared_space_id)))
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:169:vi.mock('../lib/governance/scope-governance', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:170:  filterRowsByScope: (rows: Array<Record<string, unknown>>, scope: Record<string, unknown>, allowedSharedSpaceIds?: Set<string>) =>
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:471:          spec_folder: 'specs/governed',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:472:          file_path: 'specs/governed/memory/allowed.md',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:480:          shared_space_id: 'shared-allowed',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:485:          spec_folder: 'specs/governed',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:486:          file_path: 'specs/governed/memory/blocked.md',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:494:          shared_space_id: 'shared-blocked',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:504:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:505:        sharedSpaceId: 'shared-allowed',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:526:        shared_space_id: 'allowed-space',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:535:        shared_space_id: 'allowed-space',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:542:        shared_space_id: 'blocked-space',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:550:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:551:        sharedSpaceId: 'allowed-space',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:581:        { id: 1, title: 'baseline allowed', tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:584:        { id: 1, title: 'baseline duplicate', tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:587:        { id: 2, title: 'reform blocked', tenant_id: 'tenant-b', shared_space_id: 'shared-blocked' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:590:        { id: 1, title: 'reform duplicate', score: 0.77, tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:591:        { id: 3, title: 'reform allowed', tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:597:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:598:        sharedSpaceId: 'shared-allowed',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:619:      { id: 1, title: 'baseline allowed', tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:622:      { id: 1, title: 'hyde duplicate', score: 0.94, tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:623:      { id: 2, title: 'hyde allowed', tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:624:      { id: 3, title: 'hyde blocked', tenant_id: 'tenant-b', shared_space_id: 'shared-blocked' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:630:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:631:        sharedSpaceId: 'shared-allowed',
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:493:    it('filters exact duplicates by governed scope when scope values are provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:508:              shared_space_id: null,
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:515:        { content: testContent, database: mockDatabase, tenantId: 'tenant-a', userId: 'user-a' } as unknown as DuplicateParams,
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:575:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:584:              shared_space_id: null,
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:612:              shared_space_id: null,
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:623:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:282:  it('filters trigger matches by governed scope fields when provided', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:300:            shared_space_id: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:308:            shared_space_id: 'shared-2',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:318:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:321:      sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:11:const SUPPORTED_PHASES_ARRAY = ['baseline', 'lineage', 'graph', 'adaptive', 'scope-governance', 'shared-rollout'] as const;
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:158:    // The runtime in shared-spaces.ts keeps shared memory opt-in until env/config enablement.
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1245:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1249:          sharedSpaceId: 'shared-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1258:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1262:          sharedSpaceId: 'shared-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1314:          tenantId: 'tenant-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1318:          sharedSpaceId: 'shared-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1331:          tenantId: 'tenant-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1335:          sharedSpaceId: 'shared-p',
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:194:- Purpose: Owns scope enforcement, governed ingest normalization, audit recording, and retention sweeps. This is the boundary for tenant/user/agent/session/shared-space policy decisions.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:196:  - `scope-governance.ts` — scope normalization, policy decisions, filter helpers, and governance audit writes.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:197:  - `retention.ts` — scoped retention sweep logic over expired memories.
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1082:    it('EXT-H13: handleCheckpointList rejects whitespace tenantId when sharedSpaceId is provided', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1084:        tenantId: '   ',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1085:        sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1086:      })).rejects.toThrow(/tenantId must be a non-empty string/i);
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:292:│   └── scope-governance.ts     # Hierarchical scope enforcement and governed ingest
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:40:  shared_space_id?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:43:  governed_at?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:61:  'shared_space_id', 'provenance_source', 'provenance_actor',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:62:  'governed_at', 'retention_policy', 'delete_after', 'governance_metadata',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:175:      'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:176:      'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:300:      'shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status', 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:22:} from '../governance/scope-governance.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:82:    'shared_spaces',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:83:    'shared_space_members',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:84:    'shared_space_conflicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:124:  'shared_spaces',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:125:  'shared_space_members',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:126:  'shared_space_conflicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:322:  'governance_audit', 'shared_spaces', 'shared_space_members', 'shared_space_conflicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:396:    const rawId = memory?.shared_space_id;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:431:    (normalizedScope.tenantId === undefined || metadata.tenantId === normalizedScope.tenantId)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:434:    && (normalizedScope.sharedSpaceId === undefined || metadata.sharedSpaceId === normalizedScope.sharedSpaceId)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:444:    || columns.has('shared_space_id')
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:521:  if (normalizedScope.tenantId && columns.has('tenant_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:523:    params.push(normalizedScope.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:533:  if (normalizedScope.sharedSpaceId && columns.has('shared_space_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:534:    clauses.push('shared_space_id = ?');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:535:    params.push(normalizedScope.sharedSpaceId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:648:    sharedSpaceIds: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:653:  const { specFolder, memoryIds, sharedSpaceIds, scope = {}, allowedSharedSpaceIds } = options;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:699:  if (tableName === 'shared_spaces') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:700:    if (sharedSpaceIds.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:703:        'SELECT * FROM shared_spaces WHERE space_id IN (__PLACEHOLDERS__)',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:704:        sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:707:    if (normalizedScope.tenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:709:        'SELECT * FROM shared_spaces WHERE tenant_id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:710:      ).all(normalizedScope.tenantId) as Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:712:    return hasScope ? [] : database.prepare('SELECT * FROM shared_spaces').all() as Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:715:  if (tableName === 'shared_space_members') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:716:    if (sharedSpaceIds.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:719:        'SELECT * FROM shared_space_members WHERE space_id IN (__PLACEHOLDERS__)',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:720:        sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:723:    return hasScope ? [] : database.prepare('SELECT * FROM shared_space_members').all() as Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:726:  if (tableName === 'shared_space_conflicts') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:732:            SELECT * FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:740:            SELECT * FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:747:    if (sharedSpaceIds.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:750:        'SELECT * FROM shared_space_conflicts WHERE space_id IN (__PLACEHOLDERS__)',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:751:        sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:754:    return hasScope ? [] : database.prepare('SELECT * FROM shared_space_conflicts').all() as Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:810:    sharedSpaceIds: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:908:    sharedSpaceIds: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:917:    sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:957:  if (tableName === 'shared_spaces') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:958:    deleteRowsByStringIds(database, tableName, 'space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:962:  if (tableName === 'shared_space_members') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:963:    deleteRowsByStringIds(database, tableName, 'space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:967:  if (tableName === 'shared_space_conflicts') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:968:    if (sharedSpaceIds.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:969:      deleteRowsByStringIds(database, tableName, 'space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:997:  if (sharedSpaceIds.length > 0 && columns.has('shared_space_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:998:    deleteRowsByStringIds(database, tableName, 'shared_space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1012:  if (sharedSpaceIds.length > 0 && columns.has('shared_space_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1013:    deleteRowsByStringIds(database, tableName, 'shared_space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1070:    sharedSpaceIds: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1428:      const sharedSpaceIds = Array.from(new Set([
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1442:          sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1487:          ...(normalizedScope.tenantId ? { tenantId: normalizedScope.tenantId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1490:          ...(normalizedScope.sharedSpaceId ? { sharedSpaceId: normalizedScope.sharedSpaceId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1520:          ...(normalizedScope.tenantId ? { tenantId: normalizedScope.tenantId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1523:          ...(normalizedScope.sharedSpaceId ? { sharedSpaceId: normalizedScope.sharedSpaceId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1646:    const sharedSpaceIds = Array.from(new Set([
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1728:                sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1860:              sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:27:  'mcp_server/lib/governance/scope-governance.ts',
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:52:  path.join(SKILL_ROOT, 'feature_catalog', '17--governance', '03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md'),
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:73:    expect(specContent).toContain('describe shared memory as opt-in live access rather than universally enabled rollout');
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:107:    expect(tasksContent).toContain('Fix retention sweeps so deletion uses the passed database handle');
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:109:    expect(checklistContent).toContain('Hydra follow-up verification passed across targeted governed-retrieval, shared-space admin, graph-ranking, and retention regressions');
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:138:    expect(summaryContent).toContain('The earlier retention sweep database-handle fix remains in place, so retention sweeps now delete through the passed database handle');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:38:  shared_space_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:213:    ['shared_space', normalizeScopeValue(row.shared_space_id)],
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:923:    shared_space_id: existingRow.shared_space_id,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:926:    governed_at: existingRow.governed_at,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:157:      shared_space_id TEXT
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:188:    CREATE TABLE IF NOT EXISTS shared_spaces (
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:608:          id, spec_folder, file_path, title, created_at, updated_at, importance_tier, shared_space_id
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:613:          id, spec_folder, file_path, title, created_at, updated_at, importance_tier, shared_space_id
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:618:        INSERT INTO shared_spaces (space_id, tenant_id, name, created_at, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:642:      database.prepare('UPDATE shared_spaces SET name = ? WHERE space_id = ?').run('Space A Live', 'space-a');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:643:      database.prepare('UPDATE shared_spaces SET name = ? WHERE space_id = ?').run('Space B Live', 'space-b');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:665:        database.prepare('SELECT name FROM shared_spaces WHERE space_id = ?').get('space-a')
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:668:        database.prepare('SELECT name FROM shared_spaces WHERE space_id = ?').get('space-b')
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:696:          id, spec_folder, file_path, title, created_at, updated_at, importance_tier, shared_space_id
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:700:        INSERT INTO shared_spaces (space_id, tenant_id, name, created_at, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:721:      database.prepare('UPDATE shared_spaces SET name = ? WHERE space_id = ?').run('Space A Live', 'space-a');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:730:        INSERT INTO shared_spaces (space_id, tenant_id, name, created_at, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:753:        database.prepare('SELECT name FROM shared_spaces WHERE space_id = ?').get('space-a')
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:756:        database.prepare('SELECT name FROM shared_spaces WHERE space_id = ?').get('space-extra')
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:784:          id, spec_folder, file_path, title, created_at, updated_at, importance_tier, shared_space_id
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:788:        INSERT INTO shared_spaces (space_id, tenant_id, name, created_at, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:798:      database.prepare('UPDATE shared_spaces SET name = ? WHERE space_id = ?').run('Space A Live', 'space-a');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:800:        const table = snapshot.tables?.shared_spaces;
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:814:      expect(result.rolledBackTables).toContain('shared_spaces');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:815:      expect(result.errors.some((error) => error.includes('shared_spaces: merge restore rolled back'))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:817:        database.prepare('SELECT name FROM shared_spaces WHERE space_id = ?').get('space-a')
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:820:        (database.prepare('SELECT COUNT(*) as cnt FROM shared_spaces WHERE space_id = ?').get('space-a') as { cnt: number }).cnt
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:833:        scope: { tenantId: 'tenant-a' },
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:840:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:904:        scope: { tenantId: 'tenant-a' },
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:911:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:265:    it('forwards governed scope fields through deep-mode search routing', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:270:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:273:          sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:281:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:284:        sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:288:    it('forwards governed scope fields through resume-mode search routing', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:293:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:296:          sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:303:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:306:        sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:41:          shared_space_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:67:            shared_space_id,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:130:    shared_space_id,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1417:    { name: 'shared_space_id', sql: 'ALTER TABLE memory_index ADD COLUMN shared_space_id TEXT' },
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1420:    { name: 'governed_at', sql: 'ALTER TABLE memory_index ADD COLUMN governed_at TEXT' },
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1450:      shared_space_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1461:      ON governance_audit(tenant_id, user_id, agent_id, session_id, shared_space_id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1467:        ON memory_index(tenant_id, user_id, agent_id, session_id, shared_space_id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1478:    CREATE TABLE IF NOT EXISTS shared_spaces (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1492:    CREATE TABLE IF NOT EXISTS shared_space_members (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1504:    CREATE TABLE IF NOT EXISTS shared_space_conflicts (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1518:    CREATE INDEX IF NOT EXISTS idx_shared_spaces_tenant
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1519:      ON shared_spaces(tenant_id, rollout_enabled, kill_switch);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1520:    CREATE INDEX IF NOT EXISTS idx_shared_space_members_subject
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1521:      ON shared_space_members(subject_type, subject_id, role);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1522:    CREATE INDEX IF NOT EXISTS idx_shared_space_conflicts_space
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1523:      ON shared_space_conflicts(space_id, created_at DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2326:      shared_space_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2332:      governed_at TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2436:    CREATE INDEX IF NOT EXISTS idx_memories_governed_scope ON memory_index(tenant_id, user_id, agent_id, session_id, shared_space_id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2462:      shared_space_id,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:29:    tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:33:    sharedSpaceId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:55:      shared_space_id
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:66:    params.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:70:    params.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:171:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:179:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:213:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:222:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:183:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:192:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:305:    expect(indexes[1]?.sql).toContain('shared_space_id');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:275:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:300:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:304:      const result = sm.resolveTrustedSession('bound-session', { tenantId: 'tenant-b', userId: 'user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:307:      expect(result.error).toContain('different tenantId');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:314:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:318:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:400:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:493:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:509:        expect(state.tenantId).toBe('tenant-a');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:529:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:533:      const r = sm.recoverState('recover-bound', { tenantId: 'tenant-b', userId: 'user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:536:      expect(r.error).toContain('different tenantId');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:551:      sm.saveSessionState('int-1', { specFolder: 'specs/A', currentTask: 'task A', tenantId: 'tenant-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:552:      sm.saveSessionState('int-2', { specFolder: 'specs/B', currentTask: 'task B', tenantId: 'tenant-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:571:      sm.saveSessionState('int-scope-a', { currentTask: 'task A', tenantId: 'tenant-a', userId: 'user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:572:      sm.saveSessionState('int-scope-b', { currentTask: 'task B', tenantId: 'tenant-b', userId: 'user-b' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:576:      const r = sm.getInterruptedSessions({ tenantId: 'tenant-a', userId: 'user-a' });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:66:    'DELETE FROM shared_space_conflicts WHERE existing_memory_id = ? OR incoming_memory_id = ?',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:41:  it('forwards governed scope fields through memory_quick_search', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:44:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:47:      sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:53:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:56:      sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:37:  'shared_spaces',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:38:  'shared_space_members',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:39:  'shared_space_conflicts',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:216:      shared_space_id,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:264:      shared_space_id,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:363:      id, action, decision, memory_id, logical_key, tenant_id, user_id, agent_id, session_id, shared_space_id, reason, metadata, created_at
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:368:    INSERT INTO shared_spaces (space_id, tenant_id, name, rollout_enabled, rollout_cohort, kill_switch, metadata, created_at, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:373:    INSERT INTO shared_space_members (space_id, subject_type, subject_id, role, created_at, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:378:    INSERT INTO shared_space_conflicts (
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:48:import { filterRowsByScope, isScopeEnforcementEnabled } from '../../governance/scope-governance.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:484:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:487:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:980:    tenantId
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:983:    || sharedSpaceId
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:987:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:990:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:998:      candidates = filterRowsByScope(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1004:      candidates = filterRowsByScope(candidates, scopeFilter);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1055:          ? filterRowsByScope(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1125:                ? filterRowsByScope(resultSet, scopeFilter, allowedSharedSpaceIds)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1180:        ? filterRowsByScope(rawHydeCandidates, scopeFilter, allowedSharedSpaceIds)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1240:                `SELECT id, title, spec_folder, file_path, importance_tier, importance_weight, quality_score, created_at, is_archived, context_type, tenant_id, user_id, agent_id, session_id, shared_space_id FROM memory_index WHERE id IN (${placeholders})`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1266:              ? filterRowsByScope(contextFilteredSummaryHits, scopeFilter, allowedSharedSpaceIds)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:128:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:131:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:32:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:35:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:115:  tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:118:  sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:144:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:147:    sharedSpaceId,

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/plugins/spec-kit-compact-code-graph.js" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "rg -n \"BEGIN IMMEDIATE|BEGIN TRANSACTION|transaction\\(|better-sqlite3|sqlite|WAL|journal_mode|busy_timeout|upsert|duplicate|reconsolidation|archive older near-duplicates|content_hash|hash\" .opencode/skill/system-spec-kit/mcp_server" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1195:      const row = (database.prepare('SELECT 1 FROM memory_index WHERE file_path = ?') as import('better-sqlite3').Statement).get(originalPath);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1632:    // T076: Verify WAL mode is active for operational concurrency guarantees.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1633:    const walRow = database.prepare('PRAGMA journal_mode').get() as { journal_mode?: string } | undefined;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1634:    const journalMode = String(walRow?.journal_mode ?? '').toLowerCase();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1636:      database.pragma('journal_mode = WAL');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1637:      console.warn('[context-server] journal_mode was not WAL; forcing WAL mode');
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:175:| `SPECKIT_GRAPH_WALK_ROLLOUT` | (derived) | string | Graph walk rollout state: `off`, `trace_only`, or `bounded_runtime`. Defaults to `bounded_runtime` when GRAPH_SIGNALS is ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:226:| `SPECKIT_ASSISTIVE_RECONSOLIDATION` | `true` | boolean | Assistive reconsolidation for near-duplicate detection (REQ-D4-005). Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:16:  upsertSharedMembership,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:17:  upsertSharedSpace,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:31:type SharedSpaceAdminTool = 'shared_space_upsert' | 'shared_space_membership_set';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:285:    operation: 'space_upsert' | 'membership_set';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:353:        ? 'Create the space first with shared_space_upsert.'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:374:  tool: 'shared_space_upsert' | 'shared_space_membership_set' | 'shared_memory_status' | 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:454:        tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:461:      tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:466:    const result = db.transaction((): (
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:496:              operation: 'space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:505:              msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:517:          operation: 'space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:526:          msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:544:        upsertSharedSpace(db, definition);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:551:          upsertSharedSpace(db, definition);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:556:        upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:576:        operation: 'space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:598:      return createSharedSpaceAuthError('shared_space_upsert', result.error, result.msg);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:602:      tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:621:      'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:622:      'Shared space upsert failed',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:694:    db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:695:      upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:67:/** Snapshot of a memory's hash state for mutation tracking. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:70:  content_hash: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:230:  const deduplicatedPaths: string[] = [];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:232:  let duplicatePathCount = 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:236:      duplicatePathCount++;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:241:    deduplicatedPaths.push(normalizedPath);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:244:  paths = deduplicatedPaths;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:264:      ...(duplicatePathCount > 0 ? { duplicatePathCount } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:270:      ...(duplicatePathCount > 0
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:271:        ? ['Duplicate input paths were deduplicated before queueing']
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:184:  let selectSql = 'SELECT id, content_hash, file_path, spec_folder FROM memory_index WHERE importance_tier = ?';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:199:    content_hash: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:210:  const bulkDeleteTx = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:24:/** Retrieve a memory's hash snapshot from the database. Returns null if unavailable. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:32:      SELECT id, content_hash, spec_folder, file_path
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:57:      prior_hash: input.priorHash,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:58:      new_hash: input.newHash,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts:4:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts:15: * TM-06 safety gate: verify a pre-reconsolidation checkpoint exists.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts:16: * Accepts either exact name `pre-reconsolidation` or prefixed variants.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts:21:      "SELECT name FROM sqlite_master WHERE type='table' AND name='checkpoints'"
.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts:31:      WHERE (name = 'pre-reconsolidation' OR name LIKE 'pre-reconsolidation-%')
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:22:  content_hash: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:27:  hashState: 'identical' | 'divergent' | 'unknown';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:44:  hashes: Set<string>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:133:        hashes: new Set<string>(),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:146:    if (typeof row.content_hash === 'string' && row.content_hash.trim().length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:147:      bucket.hashes.add(row.content_hash.trim());
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:175:    let hashState: AliasConflictSample['hashState'];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:176:    if (bucket.hashes.size === 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:178:      hashState = 'unknown';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:179:    } else if (bucket.hashes.size === 1) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:181:      hashState = 'identical';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:184:      hashState = 'divergent';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:190:        hashState,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:203:      SELECT file_path, content_hash
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:228:    SELECT file_path, content_hash
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:250:    if (bucket.hashes.size <= 1) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:271:    .filter(sample => sample.hashState === 'divergent')
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:41:export type { ReconsolidationBridgeResult } from './reconsolidation-bridge.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:42:export { runReconsolidationIfEnabled } from './reconsolidation-bridge.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:101:        // H9 FIX: Filter by sessionId to prevent false duplicate/supersede decisions across sessions
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:142:/** Reinforce an existing memory's stability via FSRS scheduling instead of creating a duplicate */
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:178:          content_hash = CASE WHEN content_text IS NULL THEN ? ELSE content_hash END,
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:260:  const appendVersion = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:278:      content_hash: parsed.contentHash,
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:330:      SELECT name FROM sqlite_master
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:341:        new_memory_hash,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:5:import type BetterSqlite3 from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:101:): { id: number; title: string | null; content_hash?: string | null } | undefined {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:109:    SELECT id, title, content_hash
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:135:  ) as { id: number; title: string | null; content_hash?: string | null } | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:166:  const indexWithMetadata = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:216:      content_hash: parsed.contentHash,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:5:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:144:  content_hash?: string;
.opencode/skill/system-spec-kit/mcp_server/api/search.ts:18:} from '../lib/search/sqlite-fts.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:4:import type BetterSqlite3 from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:47:  existing: { id: number; content_hash: string } | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:146:    priorHash: existing?.content_hash ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:312:  const shouldEmitPostMutationFeedback = result.status !== 'duplicate' && result.status !== 'unchanged';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:340:    message: result.message ?? (result.status === 'duplicate' ? 'Memory skipped (duplicate content)' : `Memory ${result.status} successfully`),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:406:    hints.push('Existing memory was reinforced instead of creating duplicate');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:435:  } else if (result.status === 'duplicate') {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:5:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:10:// Feature catalog: SHA-256 content-hash deduplication
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:12:// Feature catalog: Generation-time duplicate and empty content prevention
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:38:  content_hash: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:95:    SELECT id, content_hash, embedding_status, trigger_phrases, quality_score, quality_flags
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:226:  // P1-4 FIX: Check content hash even during force reindex to prevent duplicate
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:228:  // not change either, so re-indexing provides no value and creates duplicates.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:229:  if (existing && existing.content_hash === parsed.contentHash && isUnchangedEligible && isMetadataEquivalent) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:257:      'content_hash = ?',
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
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:5:import type BetterSqlite3 from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:12:import { reconsolidate } from '../../lib/storage/reconsolidation.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:13:import type { ReconsolidationResult } from '../../lib/storage/reconsolidation.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:37:// Feature catalog: Assistive reconsolidation (REQ-D4-005)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:44: * Similarity threshold above which two memories are considered near-duplicates
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:57: * Check whether the assistive reconsolidation feature is enabled.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:65: * Determine the assistive reconsolidation classification for a pair of memories
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:69: *   similarity >= 0.96  → auto-merge (near-duplicate)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:116:    `[reconsolidation-bridge] assistive recommendation: ` +
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:124: * Result payload from reconsolidation pre-checks during memory_save.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:162: * Runs reconsolidation when enabled and returns either an early tool response
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:173:  // BUG-2 fix: Track reconsolidation warnings for structured MCP response (not just console.warn)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:183:        const reconMsg = 'TM-06: reconsolidation skipped — create checkpoint "pre-reconsolidation" first';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:186:        // Continue normal create path without reconsolidation.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:208:              // Post-filter by governance scope to prevent cross-tenant reconsolidation
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:238:              // Single transaction for atomicity. better-sqlite3 supports nested transactions
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:243:              const memoryId = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:260:                  content_hash: parsed.contentHash,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:322:            reason: `memory_save: reconsolidation ${reconResult.action}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:330:              action: `reconsolidation_${reconResult.action}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:349:              reconsolidation: reconResult,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:410:              `[reconsolidation-bridge] assistive auto-merge: archived older=${topId} ` +
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:415:            console.warn(`[reconsolidation-bridge] assistive auto-merge archive failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:442:        `[reconsolidation-bridge] assistive reconsolidation error (proceeding with normal save): ${message}`
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:4:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:89:            priorHash: priorSnapshot?.content_hash ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:141:          priorHash: priorSnapshot?.content_hash ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:4:import type BetterSqlite3 from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:76:  /** Raw vector cosine similarity (0-100 scale from sqlite-vec). */
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:93:  /** Raw vector cosine similarity (0-100 scale from sqlite-vec), or averageSimilarity for multi-concept. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:96:    database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:123:          priorHash: singleSnapshot?.content_hash ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:143:    const hashById = new Map<number, MemoryHashSnapshot>();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:148:          SELECT id, content_hash, spec_folder, file_path
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:154:          hashById.set(row.id, row);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:157:        // Non-fatal — bulk delete proceeds without per-memory hash snapshots; ledger entries will lack prior hashes.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:190:    // Snapshot-then-delete is safe under single-process better-sqlite3; re-evaluate if multi-process support is added
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:192:    const bulkDeleteTx = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:197:            const snapshot = hashById.get(memory.id);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:217:        const snapshot = hashById.get(deletedId) ?? null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:221:          priorHash: snapshot?.content_hash ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:36:  content_hash?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:42:  hash?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:269:      "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1"
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:444:    memory_hash TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:447:    PRIMARY KEY (session_id, memory_hash)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:480:    throw new Error('Memory object is required for hash generation');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:483:  let hashInput: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:485:  if (memory.content_hash) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:486:    hashInput = memory.content_hash;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:489:    hashInput = `${memory.id}:${memory.anchor_id || memory.anchorId || ''}:${memory.file_path || ''}`;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:491:    hashInput = JSON.stringify({
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:501:  return crypto.createHash('sha256').update(hashInput).digest('hex').slice(0, 32);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:519:    const hash = generateMemoryHash(memoryObj);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:523:      WHERE session_id = ? AND memory_hash = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:526:    const exists = stmt.get(sessionId, hash);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:565:      SELECT memory_hash FROM session_sent_memories WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:568:      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:573:      const existingRows = existingStmt.all(sessionId) as { memory_hash: string }[];
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:574:      const existingHashes = new Set(existingRows.map((r) => r.memory_hash));
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:577:        const hash = generateMemoryHash(memory);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:578:        let shouldSend = !existingHashes.has(hash);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:580:          const insertResult = insertStmt.run(sessionId, hash, memory.id || null, now);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:584:          existingHashes.add(hash);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:593:        // Check + mark + cap enforcement stay in one transaction to avoid duplicate injection races.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:603:        db.exec('BEGIN IMMEDIATE');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:643:    const hash = generateMemoryHash(memoryObj);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:647:      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:652:    db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:653:      stmt.run(sessionId, hash, memoryId, new Date().toISOString());
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:658:    return { success: true, hash };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:678:      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:682:    const runBatch = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:684:        const hash = generateMemoryHash(memory);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:685:        const result = insertStmt.run(sessionId, hash, memory.id || null, now);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:906:  // Reserve unsent hashes while filtering so concurrent searches cannot both inject.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:914:      const hash = generateMemoryHash(r);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:915:      if (seenBatchHashes.has(hash)) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:918:      seenBatchHashes.add(hash);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:920:      // If hash generation fails unexpectedly, preserve existing behavior.
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:77:        description: 'Session identifier for working memory and session deduplication (REQ-001). When provided with enableDedup=true, prevents duplicate memories from being returned in the same session (~50% token savings on follow-up queries).'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:219:  description: '[L2:Core] Index a memory file into the spec kit memory database. Reads the file, extracts metadata (title, trigger phrases), generates embedding, and stores in the index. Use this to manually index new or updated memory files. Includes pre-flight validation (T067-T070) for anchor format, duplicate detection, and token budget estimation. Token Budget: 3500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:220:  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:403:  name: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:564:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', description: 'Limit scan to specific spec folder (e.g., "005-memory")' }, force: { type: 'boolean', default: false, description: 'Force re-index all files (ignore content hash)' }, includeConstitutional: { type: 'boolean', default: true, description: 'Whether to scan .opencode/skill/*/constitutional/ directories' }, includeSpecDocs: { type: 'boolean', default: true, description: 'Whether to scan .opencode/specs/ directories for spec folder documents (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, research/research.md, handover.md). Iteration artifacts under research/iterations/ and review/iterations/ are excluded from spec-doc indexing. Set SPECKIT_INDEX_SPEC_DOCS=false env var to disable globally.' }, incremental: { type: 'boolean', default: true, description: 'Enable incremental indexing. When true (default), skips files whose mtime and content hash are unchanged since last index. Set to false to re-evaluate all files regardless of change detection.' } }, required: [] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:625:  description: '[L7:Maintenance] Scan workspace files and build structural code graph index (functions, classes, imports, calls). Supports incremental re-indexing via content hash. Token Budget: 1000.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:780:  name: 'deep_loop_graph_upsert',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:781:  description: '[L9:CoverageGraph] Idempotent upsert for coverage graph nodes and edges. Reducer writes graph deltas after each deep-loop iteration. Rejects self-loops, clamps weights to [0.0, 2.0], and merges metadata updates on repeated IDs. Requires specFolder, loopType, and sessionId for namespace isolation.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:796:            contentHash: { type: 'string', description: 'Optional content hash for deduplication' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:802:        description: 'Nodes to upsert',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:818:        description: 'Edges to upsert (self-loops are rejected)',
.opencode/skill/system-spec-kit/mcp_server/cli.ts:7:// Better-sqlite3 and sqlite-vec load correctly regardless of cwd.
.opencode/skill/system-spec-kit/mcp_server/cli.ts:385:  const bulkDeleteTx = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/cli.ts:409:      prior_hash: null,
.opencode/skill/system-spec-kit/mcp_server/cli.ts:410:      new_hash: mutationLedger.computeHash(`cli-bulk-delete-tier:${tier}:${deletedCount}:${Date.now()}`),
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:33:The session layer provides all session-related operations for the Spec Kit Memory MCP server. It prevents duplicate context injection (saving ~50% tokens on follow-up queries) and enables crash recovery with immediate SQLite persistence.
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:48:| **Session Deduplication** | Tracks sent memories to prevent duplicate context injection |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:86:| **Hash-based** | SHA-256 hash of memory content (truncated to 16 chars) |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:89:| **Token Savings** | ~200 tokens per duplicate avoided |
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:142:console.log(`Filtered ${dedupStats.filtered} duplicates`);
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:424:    const reserveLeaseTx = db.transaction((): IndexScanLeaseResult => {
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:513:    const completeLeaseTx = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/database/README.md:6:  - "sqlite"
.opencode/skill/system-spec-kit/mcp_server/database/README.md:33:- Runtime-generated (canonical): `database/context-index.sqlite`, `database/code-graph.sqlite`, and their WAL sidecars (`-wal`, `-shm`).
.opencode/skill/system-spec-kit/mcp_server/database/README.md:34:- Embedding-profile database: `context-index__voyage__voyage-4__1024.sqlite` (and `-wal`, `-shm` sidecars) — profile-specific vector store.
.opencode/skill/system-spec-kit/mcp_server/database/README.md:43:- Structural code-graph persistence lives in the separate `code-graph.sqlite` database with `code_files`, `code_nodes`, `code_edges`, and `code_graph_metadata`.
.opencode/skill/system-spec-kit/mcp_server/database/README.md:68:- Primary memory index: `database/context-index.sqlite`.
.opencode/skill/system-spec-kit/mcp_server/database/README.md:69:- Structural code-graph index: `database/code-graph.sqlite`.
.opencode/skill/system-spec-kit/mcp_server/database/README.md:70:- Embedding-profile database: `context-index__voyage__voyage-4__1024.sqlite` stores profile-specific vectors (naming convention: `context-index__<provider>__<model>__<dims>.sqlite`).
.opencode/skill/system-spec-kit/mcp_server/database/README.md:73:- Structural reads (`code_graph_query`, `code_graph_context`) can perform bounded inline selective refresh against `code-graph.sqlite` when the stale set is small enough.
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:75:    databasePath: path.join(resolved, 'context-index.sqlite'),
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:4:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:214:  it('does not duplicate nodes or children', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:225:    // Root should have exactly one child, not duplicated
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:80:│  SQLite + sqlite-vec for vector storage                         │
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:82:│    mcp_server/database/context-index.sqlite (memory)            │
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:83:│    mcp_server/database/code-graph.sqlite   (structural graph)   │
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:90:│ Docs         │ │ (memory lineage) │ │ code-graph.sqlite          │
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:105:- sqlite extension load issues (`sqlite-vec unavailable`)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:113:| `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite` | Default repo-local memory database used by the checked-in configs |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:114:| `.opencode/skill/system-spec-kit/mcp_server/database/code-graph.sqlite` | Default repo-local structural code-graph database used by the checked-in configs |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:120:- `code-graph.sqlite` (auto-created on first `code_graph_scan`, stored alongside `context-index.sqlite`)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:201:- `better-sqlite3` (SQLite with native bindings)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:202:- `sqlite-vec` (vector extension for semantic search)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:212:- `sqlite-vec-darwin-arm64` (Apple Silicon vector extension, optional)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:232:ls mcp_server/node_modules/better-sqlite3
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:238:- [ ] `mcp_server/node_modules/better-sqlite3` exists
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:298:        "MEMORY_DB_PATH": ".opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite"
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:309:> **Codex CLI users**: If running in a read-only workspace, override `MEMORY_DB_PATH` with a writable path outside the repo (e.g., `~/.speckit/database/context-index.sqlite`). See `.codex/config.toml` for the default configuration.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:370:        "MEMORY_DB_PATH": ".opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite",
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:572:- `force`: Re-index all files, ignoring content hash
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:708:3. Indexes changed or new files, skipping unchanged ones based on content hash
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:734:sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite \
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:759:#   MEMORY_DB_PATH = "/Users/YOUR_USERNAME/.speckit/database/context-index.sqlite"
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:789:| `sqlite-vec unavailable` | Platform-specific native package failed to load | Run `npm install && npm rebuild` in both `mcp_server/` and `scripts/` |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:834:**`sqlite-vec unavailable`**
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:845:ls mcp_server/node_modules/sqlite-vec-darwin-arm64/vec0.dylib
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:846:ls scripts/node_modules/sqlite-vec-darwin-arm64/vec0.dylib
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:849:`sqlite-vec-darwin-arm64` is an optional dependency installed automatically on Apple Silicon. On other platforms, the equivalent platform package is resolved by npm. The server degrades to non-vector behavior when sqlite-vec is unavailable. Semantic similarity quality drops until you fix the extension.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:856:sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite \
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:859:sqlite3 .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite \
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:906:2. **Native module ABI mismatch after a Node.js update.** `better-sqlite3` and `sqlite-vec` were compiled for an older `MODULE_VERSION`.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:919:cp .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite \
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:920:   .opencode/skill/system-spec-kit/mcp_server/database/rollback-$(date +%Y%m%d-%H%M%S).sqlite
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:958:cp .opencode/skill/system-spec-kit/mcp_server/database/rollback-YYYYMMDD-HHMMSS.sqlite \
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:959:   .opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:981:| `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite` | Canonical database (runtime) |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:982:| `.opencode/skill/system-spec-kit/mcp_server/database/code-graph.sqlite` | Structural code-graph database |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1013:sqlite3 mcp_server/database/context-index.sqlite \
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1016:sqlite3 mcp_server/database/context-index.sqlite \
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1020:cp mcp_server/database/context-index.sqlite \
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1021:  mcp_server/database/backup-$(date +%Y%m%d-%H%M%S).sqlite
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1038:DB PATH:      mcp_server/database/context-index.sqlite
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1063:| v1.7.2 | 2026-03-15 | Dependency audit: `sqlite-vec-darwin-arm64` moved to `optionalDependencies`. Added `@huggingface/transformers`, `chokidar`, `onnxruntime-common`, `zod`. `node-llama-cpp` added as optional. Rollback procedure added. Prerequisites script (`check-prerequisites.sh`) documented. |
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:204:        priorHash: priorSnapshot?.content_hash ?? (existing.content_hash as string | null) ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:42:vi.mock('../lib/storage/reconsolidation', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:83:import { runReconsolidationIfEnabled } from '../handlers/save/reconsolidation-bridge';
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:132:        contentHash: 'hash-123',
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:177:        contentHash: 'hash-456',
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:234:        contentHash: 'hash-789',
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:43:| `shared_space_upsert` | Create or update a shared space; requires caller auth and tenant scope |
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:50:`shared_memory_status`, `shared_space_upsert`, and `shared_space_membership_set` rely on actor identity validation in `handlers/shared-memory.ts`. Admin mutations compare the caller against the configured shared-memory admin identity before allowing ownership-sensitive changes.
.opencode/skill/system-spec-kit/mcp_server/README.md:78:| **Save quality** | Accept everything | 3-layer gate (structure, semantic sufficiency, duplicate) with dry-run preview |
.opencode/skill/system-spec-kit/mcp_server/README.md:100:| SQLite | Bundled | Bundled (better-sqlite3) |
.opencode/skill/system-spec-kit/mcp_server/README.md:149:        "MEMORY_DB_PATH": ".opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite"
.opencode/skill/system-spec-kit/mcp_server/README.md:402:**Reconsolidation-on-save** -- handles near-duplicates intelligently. Nearly identical content gets merged. Contradictions retire the old version. Different content keeps both. Like a filing clerk who reads the new document, checks the cabinet and makes an informed decision instead of just stuffing it in.
.opencode/skill/system-spec-kit/mcp_server/README.md:416:**SHA-256 content-hash deduplication** -- recognizes unchanged files instantly and skips expensive reprocessing.
.opencode/skill/system-spec-kit/mcp_server/README.md:499:**Incremental indexing with content hashing** -- tracks SHA-256 hashes of every indexed file. Unchanged files get skipped instantly during scans.
.opencode/skill/system-spec-kit/mcp_server/README.md:519:**Synthetic ground truth corpus** -- 110 test questions with known correct answers in everyday language plus trick questions. Makes it possible to measure objectively whether changes improve or hurt quality. The corpus is keyed to live parent-memory IDs, so after DB rebuilds or imports you should rerun `scripts/evals/map-ground-truth-ids.ts` against the active `context-index.sqlite` before trusting ablation or reporting deltas.
.opencode/skill/system-spec-kit/mcp_server/README.md:539:**Storage:** `database/code-graph.sqlite` (separate from `database/context-index.sqlite`), with tables: `code_files`, `code_nodes`, `code_edges`, and `code_graph_metadata`.
.opencode/skill/system-spec-kit/mcp_server/README.md:891:##### `shared_space_upsert`
.opencode/skill/system-spec-kit/mcp_server/README.md:1100:| `force` | boolean | Re-index even if file hash unchanged |
.opencode/skill/system-spec-kit/mcp_server/README.md:1154:Scan workspace files and build the structural code graph index (functions, classes, imports, calls). Uses tree-sitter WASM for parsing with regex fallback. Supports incremental re-indexing via content hash. Use this explicitly when the graph is empty, when a read path reports `full_scan`, or when you want to rebuild more than the bounded inline refresh path will repair.
.opencode/skill/system-spec-kit/mcp_server/README.md:1296:| `MEMORY_DB_PATH` | `mcp_server/database/context-index.sqlite` | Override the active memory database location |
.opencode/skill/system-spec-kit/mcp_server/README.md:1361:**What happens**: File is validated, embedded and indexed. Returns memory ID, quality score and duplicate check results.
.opencode/skill/system-spec-kit/mcp_server/README.md:1501:  "tool": "shared_space_upsert",
.opencode/skill/system-spec-kit/mcp_server/README.md:1576:**Common causes**: Too little real content, missing required structure (headings, metadata) or semantic duplicate.
.opencode/skill/system-spec-kit/mcp_server/README.md:1656:sqlite3 database/context-index.sqlite ".tables"
.opencode/skill/system-spec-kit/mcp_server/README.md:1659:sqlite3 database/context-index.sqlite "SELECT COUNT(*) FROM memory_index;"
.opencode/skill/system-spec-kit/mcp_server/README.md:1705:Yes, through shared memory. Call `shared_memory_enable`, create a space with `shared_space_upsert` and grant access with `shared_space_membership_set`. Spaces are deny-by-default and the first creator becomes owner. See [SHARED_MEMORY_DATABASE.md](../SHARED_MEMORY_DATABASE.md) for the full guide.
.opencode/skill/system-spec-kit/mcp_server/README.md:1723:A dry run validates the file against the quality gate, estimates the token budget, checks for duplicates and returns a report, all without writing anything to the database. Use it to verify a file will pass before committing.
.opencode/skill/system-spec-kit/mcp_server/README.md:1758:| [sqlite-vec](https://github.com/asg017/sqlite-vec) | Vector similarity extension for embedding storage |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:3:description: "Decomposed pipeline modules for the memory_save MCP tool handler, covering dedup, embedding, PE gating, record creation, reconsolidation and response assembly."
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:27:`handlers/save/` contains the decomposed pipeline for the `memory_save` MCP tool. Each file owns a single stage of the save flow, from deduplication through embedding generation, save quality gating, prediction-error gating, reconsolidation, record creation, post-insert enrichment, and final response assembly.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:39:| `dedup.ts`                  | Pre-save deduplication. `checkExistingRow` matches by file path but returns `unchanged` only for healthy rows (`success`, `pending`, `partial`); `checkContentHashDedup` matches by content hash and accepts chunked parents only when their status is valid `partial`. |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:40:| `embedding-pipeline.ts`     | Embedding generation with persistent cache. Cache keys hash normalized content, matching the main and chunked embedding paths. Checks the embedding cache first, falls back to the provider, and stores new embeddings for future re-index. Async/deferred mode is opt-in. |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:42:| `reconsolidation-bridge.ts` | TM-06 reconsolidation bridge. When enabled and a checkpoint exists, delegates to the reconsolidation engine for merge/conflict resolution before falling through to normal creation. |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:53:1. dedup          -- Skip if unchanged or duplicate content hash
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:57:5. reconsolidation -- Merge/conflict handling (TM-06, flag-gated)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:70:- **Reconsolidation** -- Optional merge/conflict resolution pass that requires a pre-reconsolidation checkpoint (TM-06 safety gate).
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:77:- `../memory-crud-utils.ts` -- mutation ledger helpers used by PE orchestration and reconsolidation
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:82:- `../../lib/storage/reconsolidation.ts` -- reconsolidation engine
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:56:  'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:77:    case 'shared_space_upsert':        return handleSharedSpaceUpsert(parseArgs<SharedSpaceUpsertArgs>(validateToolArgs('shared_space_upsert', args)));
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:426:  shared_space_upsert: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:491:  shared_space_upsert: ['spaceId', 'tenantId', 'name', 'actorUserId', 'actorAgentId', 'rolloutEnabled', 'rolloutCohort', 'killSwitch'],
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:3:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:14:} as unknown as import('better-sqlite3').Database;
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:143:  it('G1: deduplicates when source_id equals target_id (same numeric value)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:154:    expect(uniqueIds.size).toBe(ids.length); // no duplicate entries
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:262:  it('deduplicates FTS results using the highest composite score', () => {
.opencode/skill/system-spec-kit/mcp_server/schemas/README.md:31:Compatibility and aliased tools may reuse the same validator path instead of getting a duplicated schema entry, so this README uses `29+` rather than treating the file as a fixed one-schema-per-runtime-name list.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:211:  // Deduplicate hints
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:200: * session-health.ts should use this instead of the memory-surface duplicate.
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:10:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:330:  it('T002-3: duplicate sibling chunks (same parent_id) are collapsed to one row', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:366:  it('T012-1: duplicate chunk dedup is identical for includeContent=false and includeContent=true', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-surrogates.vitest.ts:9:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/query-surrogates.vitest.ts:155:  it('deduplicates aliases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-surrogates.vitest.ts:374:  it('deduplicates questions', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:104:    it('T520-9b: deduplicates symlinked specs roots', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:160:    it('T520-9d: detects identical-hash alias groups', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:164:          content_hash: 'hash-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:168:          content_hash: 'hash-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:177:      expect(summary.samples[0].hashState).toBe('identical');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:180:    it('T520-9e: detects divergent-hash alias groups', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:184:          content_hash: 'hash-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:188:          content_hash: 'hash-2',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:195:      expect(summary.samples[0].hashState).toBe('divergent');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:202:          content_hash: 'hash-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:206:          content_hash: 'hash-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:277:            hashState: 'divergent' as const,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:320:              hashState: 'identical',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:346:        { file_path: '/workspace/specs/system-spec-kit/801-a/memory/x.md', content_hash: 'hash-a' },
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:347:        { file_path: '/workspace/.opencode/specs/system-spec-kit/801-a/memory/x.md', content_hash: 'hash-b' },
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:348:        { file_path: '/workspace/specs/system-spec-kit/802-b/memory/y.md', content_hash: 'hash-c' },
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:349:        { file_path: '/workspace/.opencode/specs/system-spec-kit/802-b/memory/y.md', content_hash: 'hash-d' },
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:350:        { file_path: '/workspace/specs/system-spec-kit/803-c/memory/z.md', content_hash: 'hash-e' },
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:351:        { file_path: '/workspace/.opencode/specs/system-spec-kit/803-c/memory/z.md', content_hash: 'hash-f' },
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:370:              hashState: 'divergent',
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:166:  it('T006b: canonical ID matching deduplicates numeric/string/mem-prefixed IDs', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/job-queue-state-edge.vitest.ts:7:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/job-queue-state-edge.vitest.ts:230:  it('T005b-Q9: enqueueIngestJob ignores duplicate enqueues for the same job ID', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/job-queue-state-edge.vitest.ts:237:    const filePath = createTempFile('duplicate-enqueue');
.opencode/skill/system-spec-kit/mcp_server/tests/job-queue-state-edge.vitest.ts:239:      id: 'job_duplicate_enqueue',
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:80:| `IVectorStore` | `vector-store.ts` | Abstract base class for JS runtime consumers; subclasses must implement search/upsert/delete/get/stats/availability/dimension/close |
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md:104:  async upsert(id, embedding, metadata) { return 1; }
.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:7:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:1:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:22:  upsertSharedMembership,
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:23:  upsertSharedSpace,
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:37:    upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:50:    upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:72:    upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:78:    upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:92:    upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:98:    upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:115:    upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:121:    upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:162:    upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:168:    upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:174:    upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:201:    upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:207:    upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:213:    upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:238:    upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:244:    upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:292:    upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:299:    upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:320:    upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:326:    upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:364:    upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:370:    upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:383:    upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:406:    upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:413:    upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:433:    expect(() => upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:439:    expect(() => upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:451:    upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:457:    upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:463:    upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:469:    upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:494:    upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:542:    upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:642:    upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:649:    upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:656:    upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:663:    upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:671:    upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:677:    upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:683:    upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:689:    upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:751:    upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:6:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:145:  it('deduplicates by normalized text', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:150:    // Should be deduplicated to a single entry
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:155:  it('sums frequencies for duplicate entities', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:444:    expect(result.upserted).toBe(2);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:507:  it('returns upserted count matching entity count', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:514:    expect(result.upserted).toBe(3);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:725:// 9. __testables.deduplicateEntities (internal helper)
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:728:describe('__testables.deduplicateEntities', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:735:    const result = __testables.deduplicateEntities(raw);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:744:    const result = __testables.deduplicateEntities([]);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:754:    const result = __testables.deduplicateEntities(raw);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:759:  it('treats differently-cased text as duplicates via normalization', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:764:    const result = __testables.deduplicateEntities(raw);
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/vector-store.ts:18:  async upsert(_id: string, _embedding: unknown, _metadata: Record<string, unknown>): Promise<number> {
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/vector-store.ts:19:    throw new Error('Method upsert() must be implemented by subclass');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:10:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:63:  'content_hash',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:139:      content_hash TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:179:    CREATE INDEX IF NOT EXISTS idx_content_hash ON memory_index(content_hash);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:270:    const run = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:3:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:19:} from '../lib/storage/reconsolidation';
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:26:} from '../lib/storage/reconsolidation';
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:115:        content_hash TEXT DEFAULT '',
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:645:        `BM25 repair failed after reconsolidation merge for memory ${result.newMemoryId}: repair merge BM25 failure`,
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:659:          id, spec_folder, file_path, title, content_text, content_hash, importance_weight, created_at, updated_at
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:662:          105, 'test-spec', '/test/105.md', 'Race Existing', 'Original race content', 'hash-before', 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:682:              content_hash = 'hash-after',
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:713:          id, spec_folder, file_path, title, content_text, content_hash, importance_weight, created_at, updated_at
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:716:          106, 'test-spec', '/test/106.md', 'Stable Existing', 'Stable base content', 'stable-hash', 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:815:      expect(edges[0]!.evidence).toContain('reconsolidation');
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:1072:    it('CHK2: Documentation note — checkpoint MUST be created before reconsolidation runs', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:1074:      // Is handled by the caller before allowing reconsolidation to proceed.
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:1079:      // 2. Bridge guard checks for checkpoint before running reconsolidation
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:94:  content_hash: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:114:  hashes: Set<string>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:170:        hashes: new Set<string>(),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:183:    bucket.variants.set(normalizedPath, row.content_hash ?? null);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:184:    if (typeof row.content_hash === 'string' && row.content_hash.trim().length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:185:      bucket.hashes.add(row.content_hash.trim());
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:197:    if (bucket.variants.size < 2 || bucket.hashes.size < 2) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:209:      distinctHashCount: bucket.hashes.size,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:318:        SELECT file_path, content_hash, spec_folder
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:566:    hints.push(`${aliasConflicts.divergentHashGroups} alias group(s) have divergent content hashes`);
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:5:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:35:    content_hash: 'sha256-abc',
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:123:    expect(row.content_hash).toBe('sha256-abc');
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:163:    row.content_hash = null;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:68:Continue validating the \`memory_save\` UX contract with a fixture that is rich enough to satisfy the durable-memory gate while still exercising duplicate no-op, deferred embedding, and post-mutation feedback behavior.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:76:- \`decision-record.md\` — UX contract and duplicate detection strategy
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:85:| \`mcp_server/handlers/memory-save.ts\` | Coordinates duplicate detection, sufficiency evaluation, template validation, and post-mutation feedback for \`memory_save\`. |
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:86:| \`mcp_server/handlers/save/response-builder.ts\` | Shapes successful save payloads, duplicate no-op hints, and deferred embedding response details. |
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:94:This regression fixture exists to prove that successful saves and duplicate no-op saves still report the correct UX payloads after the shared insufficiency gate and rendered-memory template contract were added to the save pipeline.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:102:- Validated duplicate no-op response shape
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:110:- Decided to keep duplicate no-op saves visible in the UX contract so callers can distinguish unchanged content from validation failures.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:116:- Verified duplicate no-op saves omit post-mutation hooks and leave caches unchanged.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:222:  it('does not emit postMutationHooks for duplicate-content no-op saves', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:224:    const duplicatePath = path.join(FIXTURE_ROOT, 'memory', 'duplicate.md');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:225:    const sharedContent = buildMemoryContent('Duplicate Seed', 'Shared duplicate body for regression coverage.');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:228:    fs.writeFileSync(duplicatePath, sharedContent, 'utf8');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:236:      filePath: duplicatePath,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:242:    expect(parsed.data.status).toBe('duplicate');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:305:  it('atomicSaveMemory duplicate no-op omits postMutationHooks and reports no-op status', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:306:    const indexedPath = path.join(FIXTURE_ROOT, 'memory', 'atomic-duplicate-seed.md');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:307:    const duplicatePath = path.join(FIXTURE_ROOT, 'memory', 'atomic-duplicate-copy.md');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:308:    const sharedContent = buildMemoryContent('Atomic Duplicate Seed', 'Atomic duplicate behavior regression fixture.');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:318:        file_path: duplicatePath,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:325:    expect(['duplicate', 'unchanged', 'no_change']).toContain(result.status);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:6:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:6:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:28:    DatabaseImpl = require('better-sqlite3') as DatabaseConstructor;
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:30:    dbPath = path.join(os.tmpdir(), `history-test-${Date.now()}.sqlite`);
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:300:        "SELECT sql FROM sqlite_master WHERE type='table' AND name='memory_history'"
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:307:      const id = mod.recordHistory(1, 'ADD', null, 'reconsolidation test', 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:364:      'mcp:reconsolidation_cleanup',
.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:140:    const result = db.prepare('SELECT sqlite_version() as version').get() as { version: string };
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:10:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:282:  const tx = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:355:  db.pragma('journal_mode = WAL');
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:356:  db.pragma('busy_timeout = 5000');
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:397:    throw new Error(`[session-analytics-db] Session row missing after upsert for ${claudeSessionId}`);
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:472:function upsertSessionRow(
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:554:  const tx = db.transaction((rows: TranscriptTurn[]) => {
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:595:  upsertSessionRow(db, state);
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:157:    process.env.SPECKIT_GRAPH_WALK_ROLLOUT = 'off';
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:176:    process.env.SPECKIT_GRAPH_WALK_ROLLOUT = 'trace_only';
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:209:    process.env.SPECKIT_GRAPH_WALK_ROLLOUT = 'bounded_runtime';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:7:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:94:    // Query high-similarity pairs from vec_memories using sqlite-vec
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:114:      "SELECT name FROM sqlite_master WHERE type='table' AND name='vec_memories'"
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:123: * Vector-based contradiction scan using sqlite-vec cosine similarity.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:343:    database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:488:      database.exec('BEGIN IMMEDIATE');
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:7:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:5:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:77:        content_hash TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:100:        new_memory_hash TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:146:      INSERT INTO memory_index (id, spec_folder, file_path, title, content, content_hash, stability, difficulty)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:149:    stmt.run(1, 'specs/001-test', '/specs/001-test/memory/session-2025-01-15.md', 'Session Context Jan 15', 'Test memory content 1', 'hash1', 1.0, 5.0);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:150:    stmt.run(2, 'specs/001-test', '/specs/001-test/memory/decision-auth.md', 'Auth Decision Record', 'Test memory content 2', 'hash2', 2.0, 4.0);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:151:    stmt.run(3, 'specs/002-feature', '/specs/002-feature/memory/implementation-notes.md', 'Implementation Notes', 'Test memory content 3', 'hash3', 1.5, 5.0);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:152:    stmt.run(4, 'specs/002-feature', '/specs/002-feature/memory/debug-log.md', 'Debug Log', 'Test memory content 4', 'hash4', 0.8, 6.0);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:153:    stmt.run(5, 'specs/003-refactor', '/specs/003-refactor/memory/2024-12-01-session.md', 'Refactor Plan', 'Test memory content 5', 'hash5', 1.2, 5.0);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:269:          id, spec_folder, file_path, canonical_file_path, title, content, content_hash, stability, difficulty
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:278:        'hash-shadow',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:437:        reason: 'High similarity duplicate detected',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:439:      expect(() => logPeFn!(decision, 'test-hash-001', 'specs/test-folder')).not.toThrow();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:455:      expect(() => logPeFn!(decision, 'test-hash-002', 'specs/contradiction-folder')).not.toThrow();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:465:      expect(() => logPeFn!(decision, 'test-hash-003', 'specs/create-folder')).not.toThrow();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:473:      expect(() => logPeFn!(decision, 'test-hash-004', 'specs/minimal')).not.toThrow();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:506:        contentHash: 'hash',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:529:        contentHash: 'hash',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:559:        contentHash: 'hash',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:603:    it('backfills content_hash when reinforcement populates missing content_text', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:607:        specFolder: 'specs/hash-refresh',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:608:        filePath: '/specs/hash-refresh/memory/doc.md',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:612:        contentHash: 'fresh-reinforcement-hash',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:621:            id, spec_folder, file_path, title, content_text, content_hash, stability, difficulty, review_count
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:628:          'stale-hash',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:638:          SELECT content_text, content_hash
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:641:        `).get(55) as { content_text: string | null; content_hash: string | null };
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:644:        expect(updated.content_hash).toBe(parsed.contentHash);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:747:        contentHash: 'updated-hash',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:774:        contentHash: 'meta-hash',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:896:        contentHash: 'fakehash',
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:3:description: "Pre-flight quality gates for memory operations: anchor validation, duplicate detection and token budget verification."
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:12:> Pre-flight quality gates for memory operations: anchor validation, duplicate detection, token budget verification and content size checks.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:37:| Pre-flight Checks | 4 | Anchors, duplicates, tokens, content size |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:47:| **Duplicate Detection** | Exact (SHA-256 hash) and similar (vector similarity) duplicate finding |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:68:| `preflight.ts` | All validation logic: anchors, duplicates, tokens, content size, unified preflight |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:85:| Uniqueness | No duplicate anchor IDs in same file |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:89:Two-tier duplicate detection:
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:93:| Exact | SHA-256 content hash | Fast (database lookup) |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:125:| PF010 | DUPLICATE_DETECTED | Generic duplicate found |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:126:| PF011 | DUPLICATE_EXACT | Exact hash match |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:140:| `computeContentHash` | `(content: string) => string` | SHA-256 content hash |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:141:| `checkDuplicate` | `(params: DuplicateCheckParams, options?) => DuplicateCheckResult` | Detect duplicates |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:203:  check_duplicates: true,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:258:  triggerPhrases: ['architecture', 'sqlite'],
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:5:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:58:        content_hash TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:64:        PRIMARY KEY (content_hash, model_id)
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:70:  computeContentHash: vi.fn((content: string) => `hash-${content.length}`),
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:156:    contentHash: 'content-hash-123',
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:174:  testDb = initializeDb(path.join(tempDir, 'context-index.sqlite'));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:7:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:18:  content_hash?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:55:  'content_hash', 'context_type', 'importance_tier', 'memory_type',
.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:10:} from '../handlers/save/reconsolidation-bridge';
.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:11:import type { AssistiveRecommendation } from '../handlers/save/reconsolidation-bridge';
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:86:    { id: 302, content: 'Watcher refresh logic avoids duplicate work when rapid file updates arrive together. '.repeat(2) },
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:397:    for (const toolName of ['shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status']) {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:409:  it('runtime accepts exactly one actor identity for shared_space_upsert', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:411:      validateToolArgs('shared_space_upsert', {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:420:  it('handler auth rejects shared_space_upsert when actor identity is omitted', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:425:        tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:103:/** Semantic dedup similarity threshold: above this, reject as near-duplicate */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:686: * Layer 3: Check for semantic near-duplicates using vector similarity.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:690: * memory, the new memory is rejected as a near-duplicate.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:729:        ? `Near-duplicate detected: memory #${bestMatch.id} (similarity: ${(bestMatch.similarity * 100).toFixed(1)}% >= ${SEMANTIC_DEDUP_THRESHOLD * 100}%)`
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:11:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:300:      "SELECT name FROM sqlite_master WHERE type IN ('table','view') AND name = ?"
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1335:    'content_hash',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1421:    const checkpointInfo = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1711:    const restoreTx = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1749:          // P4-11 FIX: When clearExisting=false, check for duplicate logical key
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:366:        errors: ['Memory 10: duplicate key'],
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:3:description: "Persistence helpers for checkpoints, lineage, reconsolidation, audit history, and post-insert metadata."
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:52:| `incremental-index.ts` | Stored metadata lookup, content-hash-aware reindex decisions, and stale path discovery |
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:55:| `mutation-ledger.ts` | SQLite-backed mutation audit ledger with hash-chain support |
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:57:| `reconsolidation.ts` | Similarity-based merge, conflict, or complement routing after saves |
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:65:- `incremental-index.ts` uses `file_mtime_ms`, `content_hash`, and `embedding_status` together, so unchanged-path fast paths still requeue rows whose embeddings are unhealthy.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:70:- `reconsolidation.ts` and `consolidation.ts` remain feature-gated maintenance systems, but both are wired against the current lineage and interference-refresh behavior.
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-storage.ts:5:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-storage.ts:17:    FROM sqlite_master
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-storage.ts:54:    const replaceAll = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:150:  const dummyHash = 'test-hash-001';
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:205:    const resultAt = predictionErrorGate.evaluateMemory('test-hash-boundary', 'Test content', [
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:217:    const resultBelow = predictionErrorGate.evaluateMemory('test-hash-boundary', 'Test content', [
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:4:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:259:    expect(envelope.data.error).toBe('Shared space upsert failed');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:430:    const actor = resolveAdminActor('shared_space_upsert');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:468:  it('records a shared-space admin audit entry after a successful upsert', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:500:      operation: 'space_upsert',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:28:    DATABASE_PATH:            path.join(dbDir, 'context-index.sqlite'),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:46:type BetterSqlite3Constructor = typeof import('better-sqlite3');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:47:type BetterSqlite3Database = import('better-sqlite3').Database;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:90:    const bs3 = await import('better-sqlite3');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:103:    throw new Error('better-sqlite3 unavailable for handler-helpers tests');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:115:      content_hash TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:137:      new_memory_hash TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:182:    INSERT INTO memory_index (id, spec_folder, file_path, title, content, content_hash, stability, difficulty)
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:185:  stmt.run(1, 'specs/001-test', '/specs/001-test/memory/session-2025-01-15.md', 'Session Context Jan 15', 'Test memory content 1', 'hash1', 1.0, 5.0);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:186:  stmt.run(2, 'specs/001-test', '/specs/001-test/memory/decision-auth.md', 'Auth Decision Record', 'Test memory content 2', 'hash2', 2.0, 4.0);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:187:  stmt.run(3, 'specs/002-feature', '/specs/002-feature/memory/implementation-notes.md', 'Implementation Notes', 'Test memory content 3', 'hash3', 1.5, 5.0);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:188:  stmt.run(4, 'specs/002-feature', '/specs/002-feature/memory/debug-log.md', 'Debug Log', 'Test memory content 4', 'hash4', 0.8, 6.0);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:189:  stmt.run(5, 'specs/003-refactor', '/specs/003-refactor/memory/2024-12-01-session.md', 'Refactor Plan', 'Test memory content 5', 'hash5', 1.2, 5.0);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:617:      INSERT INTO memory_index (id, spec_folder, file_path, title, content, content_hash, stability, difficulty)
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:625:      'hash-control',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:768:        new_memory_hash TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:800:    expect(() => peGating!.logPeDecision(decision, 'test-hash', 'specs/test')).not.toThrow();
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:826:      contentHash: 'hash',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:34:        'hash-create',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:46:    it('T502: near-duplicate candidates route to REINFORCE', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:48:        'hash-reinforce',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:61:        'hash-update',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:74:        'hash-supersede',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:88:        'hash-linked',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:101:        'hash-filtered',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:114:        'hash-best-match',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:148:        'hash-record',
.opencode/skill/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts:8:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:36:  exact_duplicate_enabled: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:37:  similar_duplicate_threshold: number;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:60:/** Result of duplicate detection */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:63:  duplicate_type: 'exact' | 'similar' | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:67:  content_hash: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:95:/** Parameters for duplicate checking */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:98:  content_hash?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:109:/** Options for duplicate checking */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:134:  check_duplicates?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:248:  exact_duplicate_enabled: true,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:249:  similar_duplicate_threshold: parseFloat(process.env.MCP_DUPLICATE_THRESHOLD || '0.95'),
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:327:  // Track seen anchor IDs for duplicate detection
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:333:    // Check for duplicate anchor IDs
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:340:        suggestion: `Rename one of the duplicate anchors to a unique ID`,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:420:    content_hash: provided_hash,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:432:    check_exact = PREFLIGHT_CONFIG.exact_duplicate_enabled,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:434:    similarity_threshold = PREFLIGHT_CONFIG.similar_duplicate_threshold,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:439:    duplicate_type: null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:443:    content_hash: null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:467:    duplicate: {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:477:      tenantId: duplicate.tenant_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:478:      userId: duplicate.user_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:479:      agentId: duplicate.agent_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:480:      sharedSpaceId: duplicate.shared_space_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:504:    if (typeof duplicate.file_path === 'string') {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:505:      result.existing_path = duplicate.file_path;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:509:  // Compute content hash if not provided
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:510:  const content_hash = provided_hash || computeContentHash(content);
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:511:  result.content_hash = content_hash;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:513:  // Check 1: Exact duplicate via content hash (fast)
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:516:      const whereClauses = ['content_hash = ?'];
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:517:      const paramsArray: unknown[] = [content_hash];
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:554:        result.duplicate_type = 'exact';
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:562:      console.warn('[preflight] Exact duplicate check failed:', message);
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:566:  // Check 2: Similar duplicate via vector similarity (requires embedding)
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:592:          result.duplicate_type = 'similar';
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:601:      console.warn('[preflight] Similar duplicate check failed:', message);
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:768:    check_duplicates = true,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:851:  if (check_duplicates && content) {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:856:    addCheck('duplicate_check', dupResult);
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:859:      // Exact duplicates block save
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:860:      if (dupResult.duplicate_type === 'exact') {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:864:          message: `Exact duplicate found: memory #${dupResult.existingId}`,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:870:      // Similar duplicates are warnings (PE-gating handles them)
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:871:      else if (dupResult.duplicate_type === 'similar') {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:3:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:399:    it('T031-LEX-04: combined_lexical_search() deduplicates by ID', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:406:    it('T031-LEX-05: combined_lexical_search() deduplicates canonical IDs', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:600:    it('T031-BASIC-04: hybridSearch() deduplicates canonical IDs across channels', async () => {
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:5:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:38:    FROM sqlite_master
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:594:    const persist = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:36:    'consolidate duplicate helper functions',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:4:// Per-session state at ${os.tmpdir()}/speckit-claude-hooks/<project-hash>/<session-hash>.json
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:57:/** SHA-256 hash of cwd, first 12 chars */
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:139:    const dbPath = path.join(tempDir, 'context-index.sqlite');
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:209:      (spec_folder, file_path, title, content_hash, importance_tier, created_at, updated_at, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:215:      'deprecated-hash',
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:285:      (spec_folder, file_path, title, content_hash, importance_tier, created_at, updated_at, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:291:      'temp-hash',
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:328:      (spec_folder, file_path, title, content_hash, importance_tier, created_at, updated_at, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:334:      'deprecated-null-checkpoint-hash',
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:376:      (spec_folder, file_path, title, content_hash, importance_tier, created_at, updated_at, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:382:      'critical-null-checkpoint-hash',
.opencode/skill/system-spec-kit/mcp_server/tests/usage-weighted-ranking.vitest.ts:4:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts:8:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts:17: * in better-sqlite3 (which requires native binaries at test time).
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:10:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:29:const GRAPH_WALK_SECOND_HOP_WEIGHT = 0.5;
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:92:    const insertMany = db.transaction((entries: Array<{ node_id: string; degree_count: number }>) => {
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:305:    const weightedReach = directHits + (secondHopHits.size * GRAPH_WALK_SECOND_HOP_WEIGHT);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:42:  upsertFile,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:251:          if (normalizedSql === "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1") {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:308:          if (normalizedSql === "SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='session_state'") {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:317:          if (normalizedSql === "SELECT name FROM sqlite_master WHERE type='table' AND name='session_state'") {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:345:function createRecoveryDb(rootDir: string, fileName: string = 'context-index.sqlite'): string {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:885:  it('initDb creates WAL mode database', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:911:    upsertFile(
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:914:      'hash-abc',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:956:    const dbPath = path.join(tempDir, 'code-graph.sqlite');
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:982:    const fileId = upsertFile(
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:985:      'hash-abc',
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:10:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:77: * Results are deduplicated by normalized text with summed frequencies.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:80: * @returns Array of extracted entities, deduplicated and frequency-counted.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:120:  // Deduplicate by normalized text (lowercase, trimmed), summing frequencies
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:121:  return deduplicateEntities(raw);
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:164: * @param db - An initialized better-sqlite3 Database instance.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:182:    const runInTransaction = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:217:    const runInTransaction = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:256: * @param db - An initialized better-sqlite3 Database instance.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:258: * @returns Count of entities upserted.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:263:): { upserted: number } {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:265:    let upserted = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:280:    const runInTransaction = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:310:        upserted++;
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:315:    return { upserted };
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:319:    return { upserted: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:366:    const runInTransaction = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:462:  const runInTransaction = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:491: * Deduplicate raw extraction results by normalized text.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:495:function deduplicateEntities(
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:517:  deduplicateEntities,
.opencode/skill/system-spec-kit/mcp_server/utils/db-helpers.ts:9:// To eliminate duplicate getDb()+null-check and instanceof Error
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:3:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:106:      `).run('sqlite-format-session', 3, 0.9);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:120:      expect(remainingSessionIds).toContain('sqlite-format-session');
.opencode/skill/system-spec-kit/mcp_server/lib/graph/usage-tracking.ts:8:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/graph/usage-tracking.ts:29:    if (!/duplicate column name/i.test(message)) {
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:431:    it('deduplicates user selections by query_id:memory_id', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:7:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:13:import { get_embedding_dim, refresh_interference_scores_for_folder, sqlite_vec_available } from '../search/vector-index-store.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:40:  content_hash?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:138:  duplicateActiveLogicalKeys: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:262:      `[lineage-state] Logical key component contains '::'; using hashed structured key for spec_folder=${row.spec_folder}, path=${canonicalPath}, anchor=${anchorId}`,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:353:    contentHash: typeof row.content_hash === 'string' ? row.content_hash : null,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:400:function upsertActiveProjection(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:453:    ? (sqlite_vec_available() ? 'success' : 'pending')
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:500:    content_hash: parsed.contentHash,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:512:  if (embedding && sqlite_vec_available()) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:618:  const seedTx = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:643:    upsertActiveProjection(database, logicalKey, memoryId, memoryId, normalizeTimestamp(row.updated_at ?? validFrom));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:679:    const recordTransitionTx = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:775:      upsertActiveProjection(database, logicalKey, rootMemoryId, memoryId, validFrom);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:813:  const appendTx = params.database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:997:  const duplicateActiveLogicalKeys: string[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1014:  const duplicateActive = database.prepare(`
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1022:  for (const issue of duplicateActive) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1023:    duplicateActiveLogicalKeys.push(issue.logical_key);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1054:    duplicateActiveLogicalKeys,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1138:  const execute = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1195:      upsertActiveProjection(
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:6:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:264:        testDbPath = path.join(os.tmpdir(), `retry-mgr-test-${Date.now()}.sqlite`);
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:527:            content_hash TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:533:            PRIMARY KEY (content_hash, model_id)
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-summaries.ts:5:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-summaries.ts:124:    const replaceAll = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:6:import BetterSqlite3 from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:35:    dbPath = path.join(os.tmpdir(), `promotion-positive-semantics-${Date.now()}-${Math.random()}.sqlite`);
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:67:  - `embedding-cache.ts` — persistent embedding cache used to avoid duplicate embedding generation.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:349:- Purpose: Owns persistence behavior outside the search algorithm itself: checkpoints, history, access tracking, lineage state, transactions, consolidation, reconsolidation, and index refresh flows. This is the long-lived state management layer for the memory system.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:355:  - `reconsolidation.ts` — post-save similarity merge/complement/conflict handling.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:398:- Purpose: Owns preflight validation and save-time quality gates that reject malformed, duplicate, or low-signal writes before expensive work happens. It is a defensive boundary ahead of mutation and indexing paths.
.opencode/skill/system-spec-kit/mcp_server/tests/causal-boost.vitest.ts:3:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/causal-boost.vitest.ts:85:  it('T040/T044: applies bounded boost and deduplicates existing semantic results', () => {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:211:      const fileId = graphDb.upsertFile(
.opencode/skill/system-spec-kit/mcp_server/tests/session-boost.vitest.ts:3:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:5:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:266:  const inserted = workingMemory.upsertExtractedEntry({
.opencode/skill/system-spec-kit/mcp_server/lib/graph/temporal-edges.ts:8:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/graph/temporal-edges.ts:44:    if (!/duplicate column name/i.test(message)) {
.opencode/skill/system-spec-kit/mcp_server/lib/graph/temporal-edges.ts:53:    if (!/duplicate column name/i.test(message)) {
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop-replay.vitest.ts:42:  it('replaying the same transcript twice keeps totals stable and avoids duplicate producer markers', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/create-record-lineage-regressions.vitest.ts:1:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/create-record-lineage-regressions.vitest.ts:52:      sqlite_vec_available: false,
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-seed-resolver.vitest.ts:10:  upsertFile,
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-seed-resolver.vitest.ts:47:      contentHash: 'hash-1',
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-seed-resolver.vitest.ts:50:    const fileId = upsertFile(filePath, 'typescript', 'hash-1', 1, 0, 'clean', 5);
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:93:| **Memory ID Resolution** | Resolves a stable `memory_id` from tool output; falls back to deterministic hash if none provided |
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:115:| **Deduplication** | Results deduplicated by normalized text with summed frequencies |
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:190:// Falls back to deterministic hash of content if memory_id is absent
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:79:  describe('T013: Cache key generation from tool name + args hash', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:3:import type BetterSqlite3 from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:84:      const result = sanitizeFTS5Query("1 UNION SELECT * FROM sqlite_master");
.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:549:  it('T005-01: computePrecision deduplicates repeated relevant IDs', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/learning/README.md:158:  'Consolidated duplicate context entries'
.opencode/skill/system-spec-kit/mcp_server/tests/contradiction-detection.vitest.ts:4:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:257:        contentHash: r.content_hash as string | undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:286:    contentHash: r.content_hash as string | undefined,
.opencode/skill/system-spec-kit/mcp_server/tests/community-search.vitest.ts:3:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/community-search.vitest.ts:120:  it('deduplicates member IDs across communities', () => {
.opencode/skill/system-spec-kit/mcp_server/handlers/types.ts:5:// Previously declared duplicates locally — now imports from the
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:5:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:43: * @param db - better-sqlite3 database instance
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:48:      content_hash TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:54:      PRIMARY KEY (content_hash, model_id, dimensions)
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:62: * Look up a cached embedding by content hash, model ID, and embedding dimension.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:66: * @param db - better-sqlite3 database instance
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:79:    'SELECT embedding FROM embedding_cache WHERE content_hash = ? AND model_id = ? AND dimensions = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:93:    "UPDATE embedding_cache SET last_used_at = datetime('now') WHERE content_hash = ? AND model_id = ? AND dimensions = ?",
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:108: * Uses INSERT OR REPLACE so duplicate (content_hash, model_id, dimensions)
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:117: * @param db - better-sqlite3 database instance
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:146:       (content_hash, model_id, embedding, dimensions, last_used_at)
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:156: * @param db - better-sqlite3 database instance
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:181: * @param db - better-sqlite3 database instance
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:223: * @param db - better-sqlite3 database instance
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:236: * @param content - Raw content string to hash
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:5:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:258:      expect(result.upserted).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:5:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:448:  const run_correction = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:493:        SELECT name FROM sqlite_master
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:586:  const run_undo = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:6:import BetterSqlite3 from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:188:        contentHash: 'fi-hash',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:208:      existingSamePathMemory?: { id: number; content_hash: string };
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:217:        contentHash: options.parsedContentHash ?? 'fi-hash',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:305:      const reconsolidationModule = await import('../handlers/save/reconsolidation-bridge');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:306:      const runReconsolidationIfEnabledSpy = vi.spyOn(reconsolidationModule, 'runReconsolidationIfEnabled').mockResolvedValue({
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:309:      } as Awaited<ReturnType<typeof reconsolidationModule.runReconsolidationIfEnabled>>);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:378:      reconsolidationModuleFactory?: () => unknown | Promise<unknown>;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:488:      if (options.reconsolidationModuleFactory) {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:489:        vi.doMock('../handlers/save/reconsolidation-bridge', options.reconsolidationModuleFactory as any);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:626:      vi.doUnmock('../handlers/save/reconsolidation-bridge');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:664:      const existingSamePathMemory = { id: 42, content_hash: 'older-hash' };
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:667:        parsedContentHash: 'newer-hash',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:693:    it('starts BEGIN IMMEDIATE only after reconsolidation planning resolves', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:710:          callOrder.push('BEGIN IMMEDIATE');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:730:      expect(callOrder).toContain('BEGIN IMMEDIATE');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:731:      expect(callOrder.indexOf('recon:end')).toBeLessThan(callOrder.indexOf('BEGIN IMMEDIATE'));
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1044:    it('skips chunked indexing when reconsolidation resolves the save first', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1142:    it('passes same-path exclusion into content-hash dedup after unchanged miss', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1145:      const checkContentHashDedupMock = vi.fn(() => buildIndexResult({ status: 'duplicate', id: 779 }));
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1220:        reconsolidationModuleFactory: () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1289:        reconsolidationModuleFactory: () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1796:        contentHash: 'stale-hash',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1802:        contentHash: 'fresh-hash',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1927:          content_hash: 'fi-hash',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1935:          content_hash: 'fi-hash',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1943:          content_hash: 'fi-hash',
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts:6:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:8:// - similarity in [0.88, 1.0]: MERGE (duplicate — merge content, boost importance_weight)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:16:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:110:/** Combined reconsolidation result */
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:129:/** Threshold above which memories are merged (near-duplicates) */
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:170:    console.warn('[reconsolidation] findSimilarMemories error:', message);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:180: * Determine the reconsolidation action based on similarity score.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:240:    // Better-sqlite3's synchronous transaction callback).
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:247:        console.warn('[reconsolidation] Failed to regenerate embedding for merge:', msg);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:256:    const txResult = db.transaction((): { status: 'merged' } | { status: MergeAbortStatus } => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:307:        content_hash: mergedHash,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:335:        content_hash: mergedHash,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:353:        actor: 'mcp:reconsolidation',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:365:          console.warn('[reconsolidation] Failed to update BM25 index for merge:', message);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:374:        recordHistory(newId, 'ADD', null, mergedTitle || existingMemory.file_path, 'mcp:reconsolidation');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:380:          'mcp:reconsolidation',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:383:        // Best-effort history tracking during reconsolidation merge
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:401:          `BM25 repair failed after reconsolidation merge for memory ${newId}: ${repairResult.error}`;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:493:      db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:502:          console.warn('[reconsolidation] Deprecate target not found, skipping edge insert');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:513:          `TM-06 reconsolidation conflict: similarity ${(existingMemory.similarity * 100).toFixed(1)}%`
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:517:            `Failed to insert supersedes edge (${sourceId} -> ${targetId}) — aborting reconsolidation`
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:522:      // Atomic transaction: content + embedding + hash update together.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:524:      db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:529:              content_hash = ?,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:589:/** Options for the reconsolidation orchestrator */
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:597: * Orchestrate the full reconsolidation flow for a new memory.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:632:    // Caller owns canonical create flow (prevents duplicate writes).
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:656:          const conflictTx = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:686:                    'mcp:reconsolidation_cleanup',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:694:            console.warn('[reconsolidation] cleaned up orphan memory', conflictMemory.id, 'after executeConflict failure');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:754:    console.warn('[reconsolidation] Immediate BM25 repair failed:', message);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:777:    if (message.toLowerCase().includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:781:    console.warn('[reconsolidation] Failed to ensure bm25_repair_needed column:', message);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:804:    console.warn(`[reconsolidation] Failed to persist bm25_repair_needed=${repairNeeded ? 1 : 0} for memory ${memoryId}: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:820:    contentHash: getOptionalString(row, 'content_hash') ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:829:  return snapshot.contentHash !== (getOptionalString(currentRow, 'content_hash') ?? null)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:901:    content_hash: existingRow.content_hash,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:8:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:32:The cache module provides in-memory caching for MCP tool outputs to reduce redundant operations and improve response times. It uses SHA-256 hashed keys for deterministic cache lookups and supports automatic TTL-based expiration. Cache invalidation is especially important for spec document indexing and document-aware retrieval flows.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:42:| **Key Generation** | SHA-256 hash of tool + canonicalized args |
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:74:| `embedding-cache.ts` | Persistent SQLite embedding cache: avoids re-computing embeddings for identical content. Uses content-hash + model-ID keys with LRU eviction (Sprint 3) |
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:97:| `generateCacheKey(toolName, args)` | SHA-256 hash from tool name + canonicalized args |
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:150:| **Key Strategy** | SHA-256 content hash + model ID |
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:242:| `embedding-cache.ts` | Persistent embedding cache keyed by content hash + model |
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:127:    FROM sqlite_master
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:573:      : ['Restore merged with existing data - duplicates may exist', 'Search indexes rebuilt'],
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:160: * Convert markdown headings to plain section labels without hash marks.
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:206: *   7. Normalize headings          — drop `##` hash marks
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:874:        content_hash: 'abc123',
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:917:        content_hash: 'abc123',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-roadmap-finalization.vitest.ts:205:    } as unknown as import('better-sqlite3').Database;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:6:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:203:    const rowId = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:215:      // To write a weight_history row after the upsert. The subsequent INSERT
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:216:      // Uses last_insert_rowid() to avoid a second post-upsert SELECT.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:237:        logWeightChange(rowId, existing.strength, clampedStrength, createdBy, 'insert-upsert');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:273:  const insertTx = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:323:    const insertTx = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:538:    const changed = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:773:    const changed = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:5:// Uses dedicated deep-loop-graph.sqlite alongside the memory index DB.
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:8:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:107:const DB_FILENAME = 'deep-loop-graph.sqlite';
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:160:    content_hash TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:224:    db.pragma('journal_mode = WAL');
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:287:export function upsertNode(node: CoverageNode): string {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:296:        kind = ?, name = ?, content_hash = ?, iteration = ?,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:309:      content_hash, iteration, metadata, created_at, updated_at
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:346:  const tx = d.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:359:export function upsertEdge(edge: CoverageEdge): string | null {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:567:/** Batch upsert nodes and edges in a single transaction */
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:577:  const tx = d.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:579:      upsertNode(node);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:583:      const result = upsertEdge(edge);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:608:    contentHash: r.content_hash as string | undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:9:import type BetterSqlite3 from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:1:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:5:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:5:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:317:    const databasePath = join(tempDir, 'adaptive-thresholds.sqlite');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:6:// ClearExisting=true, duplicate file_path skip, edge cases.
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:11:import BetterSqlite3 from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:29:  content_hash: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:292:  // 4.4 restoreCheckpoint duplicate file_path skip
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:320:    it('EXT-S9: duplicate checkpoint name handled', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:535:        'ALTER TABLE memory_index ADD COLUMN content_hash TEXT',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:554:            content_hash = ?,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:564:        'abc123hash',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:579:            content_hash = NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:593:        SELECT canonical_file_path, content_hash, content_text, quality_score, quality_flags, chunk_index, chunk_label
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:601:      expect(restored.content_hash).toBe('abc123hash');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:626:      checkpointStorage.createCheckpoint({ name: 'anchor-aware-duplicate-test' });
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:631:      const result = checkpointStorage.restoreCheckpoint('anchor-aware-duplicate-test', false);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:647:      checkpointStorage.deleteCheckpoint('anchor-aware-duplicate-test');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:11:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:37:  content_hash: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:119:          SELECT file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:126:          SELECT file_path, file_mtime_ms, content_hash, embedding_status
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:179:    if (stored.content_hash) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:181:      if (currentContentHash && currentContentHash !== stored.content_hash) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:394:  const updateTx = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:5:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:204:  it('markDirty deduplicates repeated node IDs', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:487:  it('deduplicates repeated technologies', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:613:  it('is idempotent — INSERT OR IGNORE prevents duplicates', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-lifecycle.vitest.ts:854:  it('onIndex is idempotent — re-indexing same content does not duplicate edges', () => {
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:69:- `pe-gating.ts` now leans on `lib/storage/document-helpers.ts` for document-aware weights and keeps content-hash-aware update paths aligned with lineage and incremental-index state.
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:36:      const hash = getProjectHash();
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:37:      expect(hash).toMatch(/^[a-f0-9]{12}$/);
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:52:    it('hashes session ids into fixed-length filenames', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:37:| `memory-parser.ts` | Parses titles, trigger phrases, tiers, document type, causal links, anchors, and content hashes from markdown files |
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:5:// Returns 'duplicate' for identical content (same spec_folder,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:6:// Same content_hash) and proceeds to embed for changed content.
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:9:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:28: * needed for the content-hash dedup check.
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:52:      content_hash TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:58:    CREATE INDEX IF NOT EXISTS idx_content_hash ON memory_index(content_hash);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:81:  const hash = sha256(content);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:88:      content_hash,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:102:    hash,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:148:      const hash = sha256('some content');
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:155:      const hash = sha256(content);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:162:    it('T054-3: Detects duplicate when same content saved under different file path', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:163:      const content = 'This is duplicate content saved under two different paths.';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:164:      const hash = sha256(content);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:180:      expect(result!.status).toBe('duplicate');
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:184:    it('T054-4: Changing 1 character produces a different hash — dedup does NOT trigger', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:191:      // Sanity check: hashes differ
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:202:      // Query with modified hash — should NOT find a duplicate
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:209:      const hash = sha256(content);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:213:        INSERT INTO memory_index (spec_folder, file_path, content_hash, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:215:      `).run('specs/pending-test', '/specs/pending-test/memory/pending.md', hash);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:223:      const hash = sha256(content);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:236:    it('T054-6aa: Cross-tenant duplicates do not dedup when governance scope differs', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:262:      const content = 'Same-tenant duplicates should still be caught.';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:276:        buildParsedMemory(folder, content, 'Tenant A duplicate'),
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:283:      expect(result?.status).toBe('duplicate');
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:324:      const folder = 'specs/hash-verification';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:325:      const existingPath = path.join(os.tmpdir(), `hash-verification-${Date.now()}.md`);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:330:          spec_folder, file_path, canonical_file_path, title, content_hash, content_text, embedding_status, parent_id
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:383:    it('T320-2: Content-hash dedup uses exact scope clauses instead of nullable OR predicates', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:414:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, parent_id
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:435:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, parent_id
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:457:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, trigger_phrases, quality_score, quality_flags, parent_id
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:482:    it('T054-6g: Same-path metadata drift is not reclassified as folder duplicate', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:487:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, trigger_phrases, quality_score, quality_flags, parent_id
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:514:    it('T079-1: Force saves skip same-path content-hash dedup rejection', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:515:      const content = 'Intentional same-path force save should not be rejected as duplicate.';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:519:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, parent_id
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:540:    it('T054-6h: Cross-path duplicates remain detectable when legacy rows have NULL canonical_file_path', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:546:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, parent_id
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:563:      expect(result?.status).toBe('duplicate');
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:573:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, parent_id
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:598:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, tenant_id, parent_id
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:627:          spec_folder, file_path, canonical_file_path, title, content_hash, embedding_status, tenant_id, parent_id
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:659:     SHA256 hash computation
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:663:    it('T054-7: SHA256 of identical strings always produces the same hash', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:664:      const content = 'Deterministic content for hash test.';
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:671:      const hash = sha256('any content');
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:672:      expect(hash).toHaveLength(64);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:673:      expect(hash).toMatch(/^[a-f0-9]{64}$/);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:676:    it('T054-9: Whitespace-only change produces a different hash', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:682:    it('T054-10: Empty string has a known SHA256 hash', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:683:      const hash = sha256('');
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:685:      expect(hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:696:      const hash = sha256(content);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:710:      expect(result).toHaveProperty('status', 'duplicate');
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:717:      const hash = sha256(content);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:722:        INSERT INTO memory_index (spec_folder, file_path, content_hash, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:724:      `).run(folder, '/specs/null-title-test/memory/notitle.md', hash);
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:747:              title: 'Canonical duplicate from FTS',
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:748:              content: 'fts duplicate entry',
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:770:      title: 'Canonical duplicate from vector',
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:771:      content: 'vector duplicate entry',
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:790:  it('deduplicates canonical IDs when includeContent=false (default production path)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:810:  it('deduplicates canonical IDs when includeContent=true', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:13:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:233:      closedDbPath = path.join(os.tmpdir(), `conf-tracker-closed-${Date.now()}.sqlite`);
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:473:  // Note: better-sqlite3 returns snake_case column names from SELECT *
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:638:    const updateTx = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:80:    // SQLite may report "duplicate column name" if run concurrently
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:81:    if (msg.includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:112:      `SELECT sql FROM sqlite_master WHERE type='table' AND name='memory_fts'`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:209:    FROM sqlite_master
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:220:    database.exec('BEGIN IMMEDIATE');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:272: * Extracted from duplicate blocks in handleTaskPreflight and handleTaskPostflight.
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:18:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:71:vi.mock('../lib/search/sqlite-fts', () => ({
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:256:  const content_hash = computeContentHash(content);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:279:    contentHash: content_hash,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:669:/** Compute SHA-256 hash of content for change detection */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:965:      // BUG-027 FIX: Skip symbolic links to prevent loops and duplicate scanning
.opencode/skill/system-spec-kit/mcp_server/tests/causal-fixes.vitest.ts:5:import BetterSqlite3 from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/phase2-integration.vitest.ts:3:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts:11:// T007.6  — No duplicate query strings
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts:20:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts:104:  testDb.pragma('journal_mode = WAL');
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts:288:   T007.6: No duplicate query strings
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts:462:  it('T007.8.10: uniqueness gate passes (no duplicate strings)', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:6:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:99:    "SELECT sql FROM sqlite_master WHERE type='table' AND name='memory_history'"
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:176:    "SELECT 1 as present FROM sqlite_master WHERE type='table' AND name = ? LIMIT 1"
.opencode/skill/system-spec-kit/mcp_server/tests/search-flags.vitest.ts:37:  'SPECKIT_GRAPH_WALK_ROLLOUT',
.opencode/skill/system-spec-kit/mcp_server/tests/search-flags.vitest.ts:71:  it('defaults all graduated gates on including reconsolidation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-flags.vitest.ts:112:  it('reconsolidation defaults on and disables only for explicit false/0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-flags.vitest.ts:176:    process.env.SPECKIT_GRAPH_WALK_ROLLOUT = 'trace_only';
.opencode/skill/system-spec-kit/mcp_server/tests/search-flags.vitest.ts:185:    process.env.SPECKIT_GRAPH_WALK_ROLLOUT = 'off';
.opencode/skill/system-spec-kit/mcp_server/tests/search-flags.vitest.ts:211:    process.env.SPECKIT_GRAPH_WALK_ROLLOUT = 'bounded_runtime';
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:34:  async upsert(id: string, embedding: Float32Array, metadata: Record<string, unknown>): Promise<number> {
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:119: * Produces deterministic hash-based embeddings.
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:134:    return this._hashEmbed(text);
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:140:      results.push(this._hashEmbed(t));
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:195:  /** Deterministic hash-based embedding for reproducibility. */
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:196:  private _hashEmbed(text: string): Float32Array {
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:198:    let hash = 0;
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:200:      hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:203:      embedding[i] = Math.sin(hash + i * 0.1) / 2;
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:253:      expect(typeof mock.upsert).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:262:    it('MockVectorStore.upsert() returns numeric ID', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:265:      const id1 = await mock.upsert('test-id-1', embedding1, {
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:277:      await mock.upsert('test-id-1', embedding1, {
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:292:      const id1 = await mock.upsert('test-id-1', embedding1, {
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:306:      const id1 = await mock.upsert('test-id-1', embedding1, {
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:322:      await mock.upsert('test-2', createTestEmbedding(1024, 2), {
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:351:        await mock.upsert('bad', createTestEmbedding(768), { spec_folder: 'test', file_path: 'bad.md' });
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:475:  // Deferred to Phase 2 — requires DB dependencies (better-sqlite3,
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:496:    // Note: Full integration tests would require sqlite-vec to be available
.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts:2:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:21:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:91:    it('duplicate anchor ID detected', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:109:    it('duplicate check without database', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:115:      expect(result.content_hash).toBeTruthy();
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:116:      expect(result.content_hash).toHaveLength(64);
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:119:    it('content hash computation correct', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:120:      const hash1 = preflight.computeContentHash(TEST_CONTENT_VALID);
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:121:      const hash2 = preflight.computeContentHash(TEST_CONTENT_VALID);
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:122:      const hash3 = preflight.computeContentHash(TEST_CONTENT_VALID + ' ');
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:123:      expect(hash1).toBe(hash2);
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:124:      expect(hash1).not.toBe(hash3);
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:127:    it('ignores exact duplicate hits when stored content verification fails', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:142:          content_hash: contentHash,
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:149:      expect(result.duplicate_type).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:329:    it('duplicate-related codes (PF010-PF012)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:384:      const duplicateContent = `
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:389:      const result = preflight.validateAnchorFormat(duplicateContent);
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:446:    it('T163: exact duplicate match via content hash', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:467:      expect(result.duplicate_type).toBe('exact');
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:471:      expect(result.content_hash).toBe(contentHash);
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:474:    it('no exact duplicate match', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:475:      const testContent = 'Unique content that has no duplicate';
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:489:      expect(result.duplicate_type).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:490:      expect(result.content_hash).toBeTruthy();
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:493:    it('filters exact duplicates by governed scope when scope values are provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:494:      const testContent = 'Tenant scoped duplicate';
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:524:    it('T164: similar duplicate match via vector', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:548:      expect(result.duplicate_type).toBe('similar');
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:567:      expect(result.duplicate_type).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:570:    it('redacts duplicate metadata when similar match belongs to a different scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:592:      expect(result.duplicate_type).toBe('similar');
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:599:    it('redacts exact-duplicate identifiers when cross-scope match is detected', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:600:      const testContent = 'Cross-scope exact duplicate';
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:630:      expect(result.duplicate_type).toBe('exact');
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:726:          check_duplicates: true
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:733:      expect(result.details.checks_run).toContain('duplicate_check');
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:738:      expect(result.details.duplicate_check).toBeTruthy();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:85:} from '../lib/search/sqlite-fts.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:86:import type { LexicalCapabilitySnapshot } from '../lib/search/sqlite-fts.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:89:  deduplicateResults as deduplicateWithSessionState,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1062:      const deduped = deduplicateWithSessionState(existingResults, sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1136:        resultsData.summary += ` (${filteredCount} duplicates filtered, ~${tokensSaved} tokens saved)`;
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:3:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:169:      "SELECT name FROM sqlite_master WHERE type='table' AND name='batch_learning_log'"
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:177:      "SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='batch_learning_log'"
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:194:      "SELECT name FROM sqlite_master WHERE type='table' AND name='feedback_events'"
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:8:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:22:  prior_hash: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:23:  new_hash: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:33:  prior_hash: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:34:  new_hash: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:95:    prior_hash TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:96:    new_hash TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:150:    INSERT INTO mutation_ledger (mutation_type, reason, prior_hash, new_hash, linked_memory_ids, decision_meta, actor, session_id)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:157:    entry.prior_hash,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:158:    entry.new_hash,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:246:    "SELECT name FROM sqlite_master WHERE type = 'trigger' AND tbl_name = 'mutation_ledger'"
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:383:        prior_hash: null,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:384:        new_hash: computeHash(`${normalizedPath}|attempt:${policy.nextAttempt}|max:${policy.maxRetries}`),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:419:      prior_hash: null,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:420:      new_hash: computeHash(`${normalizedPath}|escalated|attempts:${policy.attemptsSoFar}|max:${policy.maxRetries}`),
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:8:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:117:          content_hash TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:91:  } as unknown as import('better-sqlite3').Database;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:13:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:40:  /** Opaque query identifier (e.g. eval query ID or hash of query text). */
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:376:  it('T6: deduplicates summary candidates by memory id and preserves baseline result', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:584:        { id: 1, title: 'baseline duplicate', tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:590:        { id: 1, title: 'reform duplicate', score: 0.77, tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:622:      { id: 1, title: 'hyde duplicate', score: 0.94, tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:645:  it('T13: deep-mode multi-query merges duplicate ids and keeps later branch evidence', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:656:        { id: 1, score: 0.87, title: 'better duplicate' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:666:    expect(merged?.title).toBe('better duplicate');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:4:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:10:// REQ-001: Session Deduplication - Hash-based duplicate prevention
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:20:  hash?: string;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:37:  content_hash?: string;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:122:    it('T002: Hash generated with content_hash', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:123:      const memory1: MemoryObject = createMemory({ content_hash: 'abc123def456' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:124:      const hash1: string = sessionManager.generateMemoryHash(memory1);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:125:      expect(typeof hash1).toBe('string');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:126:      // Fix #37 — hash now 128-bit (32 hex chars) instead of 64-bit (16)
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:127:      expect(hash1).toHaveLength(32);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:136:      const hash2: string = sessionManager.generateMemoryHash(memory2);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:137:      expect(typeof hash2).toBe('string');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:138:      expect(hash2).toHaveLength(32);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:142:      const memory: MemoryObject = createMemory({ content_hash: 'abc123def456' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:143:      const hash1: string = sessionManager.generateMemoryHash(memory);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:144:      const hash1b: string = sessionManager.generateMemoryHash(memory);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:145:      expect(hash1).toBe(hash1b);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:148:    it('T002: Different inputs produce different hashes', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:149:      const memory1: MemoryObject = createMemory({ content_hash: 'abc123def456' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:155:      const hash1: string = sessionManager.generateMemoryHash(memory1);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:156:      const hash2: string = sessionManager.generateMemoryHash(memory2);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:157:      expect(hash1).not.toBe(hash2);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:226:        expect(typeof result.hash).toBe('string');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:227:        expect(result.hash).toHaveLength(32);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:274:  describe('T007: Memory filtering removes duplicates from search results', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:279:    it('T007: Filters duplicate memories from search results', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:307:    it('T007b: Removes duplicates within the same result batch', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:310:      const duplicateResultA: MemoryObject = createMemory({ id: 701, anchorId: 'dup-result' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:311:      const duplicateResultB: MemoryObject = createMemory({ id: 701, anchorId: 'dup-result' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:315:        duplicateResultA,
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:316:        duplicateResultB,
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:336:    it('T008: Token savings calculated correctly for filtered duplicates', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:358:    it('T008: Zero savings when no duplicates', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:412:        content_hash: 'cross-path-hash-123',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:418:        content_hash: 'cross-path-hash-123',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:421:      // Same content_hash → same dedup hash regardless of path
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:422:      const hash1 = sessionManager.generateMemoryHash(memory1);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:423:      const hash2 = sessionManager.generateMemoryHash(memory2);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:424:      expect(hash1).toBe(hash2);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:12:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:179:    "SELECT sql FROM sqlite_master WHERE type='table' AND name='working_memory'"
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:426:function upsertExtractedEntry(input: ExtractedEntryInput): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:485:    // If focus_count is still 1 after the upsert, this row was newly inserted.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:497:    console.warn(`[working-memory] upsertExtractedEntry error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:599:    db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:744:  upsertExtractedEntry,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:201: * Deduplicates edges by direction+from+to+relation key.
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:471:      ? db.transaction(readTraversalSnapshot)()
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:692:    const totalMemories = (db.prepare('SELECT COUNT(*) as count FROM memory_index') as import('better-sqlite3').Statement).get() as { count: number };
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:699:      ) as import('better-sqlite3').Statement).all() as Array<{ source_id: string }>;
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:17:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:255:      alignmentDbPath = path.join(os.tmpdir(), `ablation-alignment-${Date.now()}-${Math.random()}.sqlite`);
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:302:        dbPath: '/tmp/test-context-index.sqlite',
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:440:        alignmentDbPath: '/tmp/test-context-index.sqlite',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:6:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:166:  return database.transaction(() => runCallback())();
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:238: * dbOperation() must wrap it in their own db.transaction() call. The rename step
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:258:    // The dbOperation callback runs synchronously (better-sqlite3 transaction). If it
.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:261:    // Can report which step failed. No SAVEPOINT is used — better-sqlite3 transactions
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:333:    const sqliteBusyError = Object.assign(new Error('busy'), { code: 'SQLITE_BUSY' });
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:339:        throw sqliteBusyError;
.opencode/skill/system-spec-kit/mcp_server/tests/file-watcher.vitest.ts:608:  it('reindexes symlinked files via their resolved path and deduplicates unchanged aliases', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:8:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:34:} from '../lib/storage/reconsolidation';
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:39:} from '../lib/storage/reconsolidation';
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:340:  it('S4-INT-09: Reconsolidation merges duplicates (similarity >= 0.88)', withEnvVars(
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:366:            content_hash TEXT DEFAULT '',
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:484:  it('S4-INT-11: Save with similarity in [0.88, 0.92] passes quality gate then triggers reconsolidation merge', withEnvVars(
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:490:trigger_phrases: [implementation, quality gate, reconsolidation]
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:497:and reconsolidation features. It contains detailed technical notes.
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:501:The quality gate runs BEFORE reconsolidation in the save pipeline.
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:510:        triggerPhrases: ['implementation', 'quality gate', 'reconsolidation'],
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:527:  it('S4-INT-12: Both quality gate and reconsolidation disabled means no Sprint 4 save behavior', withEnvVars(
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:693:    // Enable only reconsolidation — explicitly disable others
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:816:  it('S4-INT-23: Quality gate semantic dedup threshold (0.92) > reconsolidation merge threshold (0.88)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:818:    // Must be higher than reconsolidation's merge threshold.
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:819:    // Otherwise, quality gate would reject saves that reconsolidation could merge.
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:831:    // In this range, reconsolidation merges but quality gate does NOT reject as duplicate
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:845:    // At this similarity, quality gate WOULD reject as near-duplicate
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:846:    // AND reconsolidation would merge. The pipeline order matters:
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:847:    // Quality gate runs first, so it catches this before reconsolidation
.opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:295:  it('S1-H-01: strips h2 hashes and numeric section prefix', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:299:  it('S1-H-02: strips h1 hash', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:303:  it('S1-H-03: strips h3 hashes', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:307:  it('S1-H-04: strips h6 hashes', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:396:  it('S1-E-09: strips heading hashes and numeric prefixes', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cli.vitest.ts:7:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/cli.vitest.ts:62:      (spec_folder, file_path, title, content_hash, importance_tier, created_at, updated_at, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/cli.vitest.ts:69:    'old-a-hash',
.opencode/skill/system-spec-kit/mcp_server/tests/cli.vitest.ts:78:    'old-b-hash',
.opencode/skill/system-spec-kit/mcp_server/tests/cli.vitest.ts:87:    'keep-hash',
.opencode/skill/system-spec-kit/mcp_server/tests/cli.vitest.ts:120:    const dbPath = join(sandbox.dbDir, 'context-index.sqlite');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:6:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:267:    if (!msg.includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:333:    const upsert = db.prepare(`
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:339:    const saveAll = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:340:      upsert.run('totalScanned', String(archivalStats.totalScanned));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:341:      upsert.run('totalArchived', String(archivalStats.totalArchived));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:342:      upsert.run('totalUnarchived', String(archivalStats.totalUnarchived));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:343:      upsert.run('lastScanTime', archivalStats.lastScanTime ?? '');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:511:    // Expected to fail when sqlite-vec is not loaded or vec_memories doesn't exist
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:598:  const batchTransaction = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:91:    computeHash: vi.fn((input: string) => `mock-hash-${String(input).length}`),
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:303:        content_hash: existingMemory?.content_hash ?? 'old-hash',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:455:        if (sql.includes('file_path, content_hash')) return aliasRows;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:507:    return `mock-hash-${calls.computeHash.length}`;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1307:        { file_path: '/workspace/specs/system-spec-kit/001-test/memory/a.md', content_hash: 'hash-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1308:        { file_path: '/workspace/.opencode/specs/system-spec-kit/001-test/memory/a.md', content_hash: 'hash-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1324:        { file_path: '/workspace/specs/system-spec-kit/002-test/memory/b.md', content_hash: 'hash-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1325:        { file_path: '/workspace/.opencode/specs/system-spec-kit/002-test/memory/b.md', content_hash: 'hash-2' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1331:    expect(hints.some((hint: string) => hint.includes('divergent content hashes'))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1340:        { file_path: '/workspace/specs/system-spec-kit/010-test/memory/a.md', content_hash: 'hash-1', spec_folder: 'system-spec-kit/010-test' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1341:        { file_path: '/workspace/.opencode/specs/system-spec-kit/010-test/memory/a.md', content_hash: 'hash-2', spec_folder: 'system-spec-kit/010-test' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1363:        { file_path: 'C:\\workspace\\specs\\system-spec-kit\\011-test\\memory\\b.md', content_hash: 'hash-1', spec_folder: 'system-spec-kit/011-test' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1364:        { file_path: 'C:\\workspace\\.opencode\\specs\\system-spec-kit\\011-test\\memory\\b.md', content_hash: 'hash-2', spec_folder: 'system-spec-kit/011-test' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1384:        { file_path: 'specs/system-spec-kit/012-test/memory/c.md', content_hash: 'hash-1', spec_folder: 'system-spec-kit/012-test' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1385:        { file_path: '.opencode/specs/system-spec-kit/012-test/memory/c.md', content_hash: 'hash-2', spec_folder: 'system-spec-kit/012-test' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1405:        { file_path: '/workspace/specs/system-spec-kit/020-test/memory/a.md', content_hash: 'hash-1', spec_folder: 'system-spec-kit/020-test' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1406:        { file_path: '/workspace/.opencode/specs/system-spec-kit/020-test/memory/a.md', content_hash: 'hash-2', spec_folder: 'system-spec-kit/020-test' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1407:        { file_path: '/workspace/specs/system-spec-kit/021-test/memory/b.md', content_hash: 'hash-3', spec_folder: 'system-spec-kit/021-test' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1408:        { file_path: '/workspace/.opencode/specs/system-spec-kit/021-test/memory/b.md', content_hash: 'hash-4', spec_folder: 'system-spec-kit/021-test' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1806:    installUpdateMocks({ existingMemory: { id: 7, title: 'Old title', content_hash: 'old-hash' } });
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1809:        get: (_id: number) => ({ id: 7, content_hash: 'old-hash', spec_folder: 'specs/test', file_path: '/tmp/memory.md' }),
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:76:  'investigate why the search results are returning duplicate entries when using the advanced filter with pagination',
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:694:    const duplicateHint = RECOVERY_HINTS[ERROR_CODES.MEMORY_DUPLICATE];
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:695:    const hasForce = duplicateHint.actions.some((a: string) =>
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:2:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:8:import BetterSqlite3 from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts:35:  let hash = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts:37:    hash = (hash * 31 + identity.charCodeAt(i)) >>> 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts:39:  return hash % 100;
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:134:  it('deduplicates identical keywords', () => {
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/index.ts:4:export { handleCoverageGraphUpsert } from './upsert.js';
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-scan.vitest.ts:14:  upsertFileMock: vi.fn(),
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-scan.vitest.ts:41:  upsertFile: mocks.upsertFileMock,
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-scan.vitest.ts:59:    mocks.upsertFileMock.mockReturnValue(1);
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-scan.vitest.ts:64:      contentHash: 'hash-1',
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-scan.vitest.ts:109:    expect(mocks.upsertFileMock).toHaveBeenCalledTimes(1);
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-scan.vitest.ts:151:    expect(mocks.upsertFileMock).not.toHaveBeenCalled();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-backfill.vitest.ts:4:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-backfill.vitest.ts:56:    dbPath = path.join(tempDir, 'context-index.sqlite');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-backfill.vitest.ts:59:      sqlite_vec_available: false,
.opencode/skill/system-spec-kit/mcp_server/tests/degree-computation.vitest.ts:7:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:7:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:53:      content_hash TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:73:  content_hash?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:78:    INSERT INTO memory_index (spec_folder, file_path, file_mtime_ms, content_hash, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:85:    opts.content_hash ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:205:  it('returns correct row shape {file_path, file_mtime_ms, content_hash, embedding_status}', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:211:      content_hash: 'abc123',
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:221:    expect(row.content_hash).toBe('abc123');
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:232:      content_hash: null,
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:241:    expect(row.content_hash).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:267:      INSERT INTO memory_index (spec_folder, file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:269:    `).run('specs/test', canonicalFile, canonicalKey, 1700000000000, 'alias-hash', 'success');
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:277:    expect(row.content_hash).toBe('alias-hash');
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:338:  it('returns "modified" when content hash changes but mtime stays within the fast-path window', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:347:      content_hash: sha256('original content'),
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:443:      INSERT INTO memory_index (spec_folder, file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:445:    `).run('specs/test', canonicalFile, canonicalKey, 1000, 'mtime-hash', 'success');
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:572:      INSERT INTO memory_index (spec_folder, file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:574:    `).run('specs/test', aliasFile, canonicalKey, 1700000000000, 'alias-hash', 'success');
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:620:      INSERT INTO memory_index (spec_folder, file_path, canonical_file_path, file_mtime_ms, content_hash, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:688:    insertRow(db, { file_path: successFile, file_mtime_ms: successMeta.mtime, content_hash: 'hash-ok', embedding_status: 'success' });
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:705:    insertRow(db, { file_path: failedFile, file_mtime_ms: failedMeta.mtime, content_hash: 'hash-fail', embedding_status: 'failed' });
.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposition.vitest.ts:55:  it('deduplicates overlapping results when merging facet coverage pools', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposition.vitest.ts:62:        { id: 2, title: 'shared-duplicate', score: 0.7 },
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:5:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:120:    FROM sqlite_master
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:7:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:430:  const resetTx = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:798:  const persistProposalTx = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:5:// Eliminates duplicated process.cwd() calls in memory-surface.ts,
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:4:// MCP tool handler for deep_loop_graph_upsert — idempotent
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:5:// node/edge upsert with self-loop rejection and weight clamping.
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:8:  upsertNode,
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:9:  upsertEdge,
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:67:/** Handle deep_loop_graph_upsert tool call */
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:155:    // Execute batch upsert
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-dedup-order.vitest.ts:6:  it('T080-1 checks content-hash dedup before the chunking branch', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-dedup-order.vitest.ts:10:    const duplicatePrecheckIndex = source.indexOf('const duplicatePrecheck = checkContentHashDedup');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-dedup-order.vitest.ts:14:    expect(duplicatePrecheckIndex).toBeGreaterThan(-1);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-dedup-order.vitest.ts:17:    expect(duplicatePrecheckIndex).toBeLessThan(chunkBranchIndex);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-dedup-order.vitest.ts:18:    expect(duplicatePrecheckIndex).toBeLessThan(chunkedIndexerIndex);
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:2:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/edge-density.vitest.ts:14:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:135:    const richContent = '## Architecture Decisions\n\n- Use SQLite for local storage\n- Implement vector search with cosine similarity\n- Cache embeddings with content hash keys\n\n```typescript\nconst db = new Database("speckit.db");\ndb.exec("CREATE TABLE memories (id INTEGER PRIMARY KEY)");\n```\n\nThis design balances performance with simplicity.';
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:348:    const dbPath = path.join(tempDir, 'context-index.sqlite');
.opencode/skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts:387:      contentHash: 'r7-thinning-wiring-hash',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:46:  /** The query ID (from eval_queries) or a generated query hash. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:221: * @param queryId - Identifier for the query (can be eval_queries.id or a hash).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:410:    const insertAll = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:5:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:276:  it('T-WH-05: insertEdge upsert logs weight change', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:46:| Classification | 2       | ~960  | 5-state memory model + duplicate detection   |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:105:| better-sqlite3 | 8.0+    | Latest      |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:171:Prevents duplicate memories using similarity thresholds:
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:175:| >= 0.95 (95%) | **REINFORCE**               | Exact duplicate, boost existing  |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:384:**Purpose**: Prevent duplicate memories with conflict detection
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:404:  'abc123hash',                    // newContentHash
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:428:  'abc123hash',       // newMemoryHash
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:747:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:787:// Before saving new memory, check for duplicates
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:846:| **Memory Save**   | New memory → Check duplicates → Save | `evaluateMemory`, `activateMemoryWithFsrs`   |
.opencode/skill/system-spec-kit/mcp_server/tests/memory-delete-cascade.vitest.ts:13:  const tmpDbPath = path.join(tmpDir, 'context-index.sqlite');
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:9:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:6:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/job-queue.vitest.ts:7:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/mmr-reranker.vitest.ts:43:  // ---- T1: Identical candidates get deduplicated ----
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:6:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts:19:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts:68: * @param database - An initialized better-sqlite3 Database instance.
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:656:        // Return mutated content so caller can persist it and recompute content_hash
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts:32:// without better-sqlite3 or vector-index wiring.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:18:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:5:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:41:      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='embedding_cache'")
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:51:      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='embedding_cache'")
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:58:    const hash = computeContentHash('hello world');
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:63:    storeEmbedding(db, hash, model, embedding, dims);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:64:    const result = lookupEmbedding(db, hash, model, dims);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:73:  // T015-03: Cache miss returns null for unknown hash
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:75:    const result = lookupEmbedding(db, 'nonexistent_hash', 'any-model', 384);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:81:    const hash = computeContentHash('same content');
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:85:    storeEmbedding(db, hash, 'model-A', embedding, dims);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:87:    // Same hash, different model — should miss
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:88:    const result = lookupEmbedding(db, hash, 'model-B', dims);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:92:    const hit = lookupEmbedding(db, hash, 'model-A', dims);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:96:  it('T015-04b: different dimensions trigger cache miss for same hash and model', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:97:    const hash = computeContentHash('same content');
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:102:    storeEmbedding(db, hash, model, makeEmbeddingBuffer(originalDims), originalDims);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:104:    expect(lookupEmbedding(db, hash, model, replacementDims)).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:105:    expect(lookupEmbedding(db, hash, model, originalDims)).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:108:  it('T015-04c: same hash and model can store multiple dimension variants', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:109:    const hash = computeContentHash('same content different dims');
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:116:    storeEmbedding(db, hash, model, embA, dimsA);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:117:    storeEmbedding(db, hash, model, embB, dimsB);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:120:    expect(Buffer.compare(lookupEmbedding(db, hash, model, dimsA)!, embA)).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:121:    expect(Buffer.compare(lookupEmbedding(db, hash, model, dimsB)!, embB)).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:126:    const hash = computeContentHash('track usage');
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:131:    storeEmbedding(db, hash, model, embedding, dims);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:135:      .prepare('SELECT last_used_at FROM embedding_cache WHERE content_hash = ? AND model_id = ? AND dimensions = ?')
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:136:      .get(hash, model, dims) as { last_used_at: string };
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:140:      "UPDATE embedding_cache SET last_used_at = datetime('now', '-1 day') WHERE content_hash = ? AND model_id = ? AND dimensions = ?",
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:141:    ).run(hash, model, dims);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:144:      .prepare('SELECT last_used_at FROM embedding_cache WHERE content_hash = ? AND model_id = ? AND dimensions = ?')
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:145:      .get(hash, model, dims) as { last_used_at: string };
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:148:    lookupEmbedding(db, hash, model, dims);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:151:      .prepare('SELECT last_used_at FROM embedding_cache WHERE content_hash = ? AND model_id = ? AND dimensions = ?')
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:152:      .get(hash, model, dims) as { last_used_at: string };
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:160:    const hash = computeContentHash('evict me');
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:165:    storeEmbedding(db, hash, model, embedding, dims);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:169:      "UPDATE embedding_cache SET last_used_at = datetime('now', '-10 days') WHERE content_hash = ? AND model_id = ? AND dimensions = ?",
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:170:    ).run(hash, model, dims);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:181:    expect(lookupEmbedding(db, hash, model, dims)).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:223:  // T015-09: Duplicate store (same hash+model) replaces existing
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:224:  it('T015-09: duplicate store replaces existing entry', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:225:    const hash = computeContentHash('replace test');
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:230:    storeEmbedding(db, hash, model, emb1, dims);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:233:    storeEmbedding(db, hash, model, emb2, dims);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:239:    const result = lookupEmbedding(db, hash, model, dims);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:246:    const content = 'deterministic hashing test';
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:248:    const hash1 = computeContentHash(content);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:249:    const hash2 = computeContentHash(content);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:252:    expect(hash1).toBe(hash2);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:255:    expect(hash1).toMatch(/^[0-9a-f]{64}$/);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:257:    // Different content produces different hash
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:258:    const hash3 = computeContentHash('different content');
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:259:    expect(hash3).not.toBe(hash1);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:264:    const hash = computeContentHash('perf test');
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:269:    storeEmbedding(db, hash, model, emb, dims);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:272:    lookupEmbedding(db, hash, model, dims);
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:278:      lookupEmbedding(db, hash, model, dims);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:16:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:3:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:909:      const result = testDb.transaction(() => causalEdges.cleanupOrphanedEdges())();
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:6:import BetterSqlite3 from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:417:  it('upsertExtractedEntry stores provenance fields', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:426:      const ok = workingMemory.upsertExtractedEntry({
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:449:  it('upsertExtractedEntry avoids legacy COUNT existence probes and relies on conflict handling', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:466:      const first = workingMemory.upsertExtractedEntry({
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:475:      const second = workingMemory.upsertExtractedEntry({
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:499:  it('upsertExtractedEntry conflict-update overwrites on same key', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:508:      const first = workingMemory.upsertExtractedEntry({
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:519:      const second = workingMemory.upsertExtractedEntry({
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:559:      const inserted = workingMemory.upsertExtractedEntry({
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:199:  it('deduplicates channels across sources and source fields', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:204:      sources: ['semantic'], // same channel duplicated — should still count as 1
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:7:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:447:export function upsertSharedSpace(database: Database.Database, definition: SharedSpaceDefinition): void {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:486:export function upsertSharedMembership(database: Database.Database, membership: SharedMembership): void {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:692:  const recordConflictTx = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:22:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:173:// Imports Database type and working-memory module which trigger better-sqlite3
.opencode/skill/system-spec-kit/mcp_server/tests/concept-routing.vitest.ts:47:  it('deduplicates repeated tokens', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/concept-routing.vitest.ts:132:  it('deduplicates concepts (multiple aliases -> same canonical)', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:5:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:64:  new_memory_hash: string;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:342:    new_memory_hash: newMemoryHash,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:363:        action, new_memory_hash, existing_memory_id, similarity,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:369:      record.new_memory_hash,
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:64:| **Interference Scoring** | TM-01 penalizes high-similarity near-duplicates in result sets |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:80:| better-sqlite3 | 9+ | Latest |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:99:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:100:const db = new Database('context-index.sqlite');
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:122:console.log(getCanonicalPathKey('context-index.sqlite'));
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:141:│   ├── sqlite-fts.ts           # SQLite FTS5 full-text search
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:174:│   ├── prediction-error-gate.ts # PE gating for duplicates
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:328:| `cognitive/prediction-error-gate.ts` | Four-tier similarity gating to prevent duplicates |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:337:| `scoring/interference-scoring.ts` | TM-01 interference penalty for near-duplicates |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:407:**Prediction Error Gating**: Prevents duplicate memories using three-tier similarity thresholds
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:411:const isDuplicate = await cognitive.predictionErrorGate.is_duplicate(
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:650:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:651:const db = new Database('context-index.sqlite');
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:691:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:692:const db = new Database('context-index.sqlite');
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:693:console.log('Tables:', db.prepare('SELECT name FROM sqlite_master WHERE type="table"').all());
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:732:| [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) | SQLite Node.js library |
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:5:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:14:  upsertSharedMembership,
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:15:  upsertSharedSpace,
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:75:    upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:81:    upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:103:    upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:109:    upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:132:    upsertSharedSpace(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:138:    upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposer.vitest.ts:111:  it('deduplicates identical fragments', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposer.vitest.ts:157:  it('deduplicates items appearing in multiple pools', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-decomposer.vitest.ts:170:    // No duplicates
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:112:    duplicatesSkipped: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:358:      duplicatesSkipped: dedupDuplicatesSkipped,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:429:          result.status === 'duplicate' ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:447:        } else if (result.status === 'duplicate') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:603:  if (results.dedup.duplicatesSkipped > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:604:    hints.push(`Canonical dedup skipped ${results.dedup.duplicatesSkipped} alias path(s)`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:610:    hints.push(`${results.aliasConflicts.divergentHashGroups} alias group(s) have divergent content hashes`);
.opencode/skill/system-spec-kit/mcp_server/tests/query-router.vitest.ts:222:  it('T17: enforceMinimumChannels does not duplicate channels already present', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-router.vitest.ts:232:  it('T17b: duplicate channels are collapsed before minimum enforcement', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-router.vitest.ts:238:  it('T17c: custom configs with duplicates still resolve to distinct channels', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:6:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:283:    ) as import('better-sqlite3').Statement).get(memoryId) as { embedding: Buffer } | undefined : undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:415:    // Deduplicate by ID, keeping the higher similarity score
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:49:    it('v21 migration handles duplicate column gracefully', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:60:      // Migration must check for 'duplicate column' or 'already exists'
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:61:      expect(source).toMatch(/duplicate column|already exists/);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-ingest.vitest.ts:150:  it('start deduplicates normalized paths before creating the job', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-ingest.vitest.ts:175:    expect(data.duplicatePathCount).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-ingest.vitest.ts:176:    expect(envelope.hints).toContain('Duplicate input paths were deduplicated before queueing');
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:3:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:86:    tools: ['checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete', 'shared_memory_enable', 'shared_memory_status', 'shared_space_upsert', 'shared_space_membership_set']
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:3:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts:7:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:20:type DatabaseModule = typeof import('better-sqlite3');
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:21:type DatabaseInstance = import('better-sqlite3').Database;
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:109:const Database = require('better-sqlite3') as DatabaseModule;
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:441:    it('3.5.2 deduplicates across rows', () => {
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:5:import type BetterSqlite3 from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:60:  content_hash?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:94:  'content_hash', 'context_type', 'importance_tier', 'memory_type',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:175:  const setupParent = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:241:        content_hash: parsed.contentHash,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:280:      // Provider on re-index — content-hash keyed so unchanged chunks skip API entirely.
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:305:      const insertChunkTx = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:342:          content_hash: parsed.contentHash,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:402:      const rollbackTx = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:487:    const finalizeSwapTx = database.transaction((newChildIds: number[]) => {
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:505:        SET content_hash = ?,
.opencode/skill/system-spec-kit/mcp_server/tests/query-expander.vitest.ts:64:  // ---- T8: No duplicates ----
.opencode/skill/system-spec-kit/mcp_server/tests/query-expander.vitest.ts:65:  it('T8: variants are unique (no duplicates)', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:15:import { fts5Bm25Search } from './sqlite-fts.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:60:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:117:   * - `'vector'` — cosine similarity from sqlite-vec (normalized from 0-100 to 0-1)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:304: * @param database - The better-sqlite3 database instance for FTS and graph queries.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:435:      SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:462:    // C138-P2: Delegate to weighted BM25 FTS5 search from sqlite-fts.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:487: * @returns Deduplicated array of merged results sorted by score descending.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:497:  // CanonicalResultId() prevents duplicate rows when one channel emits
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:953:  // Deduplicate by ID (keep highest normalized score)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:974: * All search channels use synchronous better-sqlite3; sequential execution
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1058:    // All channels use synchronous better-sqlite3; sequential execution
.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:3:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:904:        // Skip self-references, keywords, and duplicates
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:8:import BetterSqlite3 from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:5:// Validates upsert, query, replay, and latency expectations
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:41:  describe('upsert payload shape', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:42:    it('validates a well-formed upsert payload', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:86:  describe('upsert response shape', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-db.vitest.ts:124:    it('defines 500ms budget for upsert batches', () => {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:84:import { runReconsolidationIfEnabled } from './save/reconsolidation-bridge.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:725:    // NOTE: Content-hash dedup (C5-1) moved inside BEGIN IMMEDIATE transaction
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:797:    const duplicatePrecheck = checkContentHashDedup(database, parsed, force, validation.warnings, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:801:    if (duplicatePrecheck) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:802:      return duplicatePrecheck;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:818:    // T028/T029: complete async reconsolidation planning before chunking or
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:820:    // and BEGIN IMMEDIATE only covers synchronous DB mutation work.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:847:          const finalizeChunkedPeTx = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:909:    // atomicity. Uses database.transaction() so inner transaction() calls in
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:914:    let existing: { id: number; content_hash: string } | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:916:    // C5-1: Content-hash dedup check BEFORE the write transaction — reads are
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:927:    const writeTransaction = database.transaction((): number => {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:935:      ) as { id: number; content_hash: string } | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:937:      const memoryId = existing && existing.content_hash !== parsed.contentHash
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:969:        predecessorMemoryId: existing && existing.content_hash !== parsed.contentHash
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:973:        transitionEvent: existing && existing.content_hash !== parsed.contentHash
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1293:        check_duplicates: !force,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1455:  if (typeof result.id === 'number' && result.id > 0 && result.status !== 'unchanged' && result.status !== 'duplicate') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1459:    const applyGovernanceTx = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1710:  if (indexResult.status !== 'unchanged' && indexResult.status !== 'duplicate' && indexResult.id > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1714:  const shouldEmitPostMutationFeedback = indexResult.status !== 'duplicate' && indexResult.status !== 'unchanged';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1737:    indexResult.status === 'duplicate'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1738:      ? 'Memory skipped (duplicate content)'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1751:  } else if (indexResult.status === 'duplicate') {
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts:39:      const hash = generateContentHash('some content');
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts:40:      expect(hash).toMatch(/^[a-f0-9]{12}$/);
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-edges.vitest.ts:3:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/community-detection.vitest.ts:3:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:229:    // BEGIN IMMEDIATE transaction so concurrent calls cannot exceed the rate limit.
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:232:    const executePromotion = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-extractor.vitest.ts:100:    it('T515-03: no duplicate trigger phrases', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:21:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:300:  it('T045-17a: mergeResults deduplicates mixed ID types', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:20:      "expectedResultDescription": "Decision record or memory explaining T054 / T003 (content hash dedup) rationale. Should reference Wave 1 bug fixes and duplicate prevention.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:21:      "notes": "Tests causal-edge graph retrieval — the decision to add SHA256 should be linked to prior duplicates observed."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:485:      "query": "what changed in the memory indexing pipeline after the T054 content hash fix",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:490:      "expectedResultDescription": "Temporal query about a specific task milestone. Should surface memories created after T054 that reference the content hash dedup feature.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:565:      "query": "memory deduplication content hash",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:570:      "expectedResultDescription": "Should surface memories with trigger phrases matching \"content hash\" or \"deduplication\". Likely surfaces T054-related memories about SHA256 dedup implementation.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:571:      "notes": "Derived from known trigger phrases in the memory system related to content hash dedup."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:760:      "expectedResultDescription": "Should surface content hash dedup implementation in the save pipeline and the UNIQUE constraint in the memory schema.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:835:      "query": "memory_save keeps failing with duplicate content hash error",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:840:      "expectedResultDescription": "Should surface the content hash dedup logic in the save pipeline and explain that this is expected behavior when saving identical content.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:965:      "query": "the scoring module has duplicated weight normalization logic across several files",
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:201:        const fileId = graphDb.upsertFile(
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:46:  describe('graph_upsert tool schema', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:47:    it('accepts valid upsert input', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:14:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/reporting-dashboard.vitest.ts:133:  testDb.pragma('journal_mode = WAL');
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:226:  // Deduplicate
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:389:      // Prevent duplicate insertions from repeated terms in a single call.
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:5:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:22:    dbPath: path.join(dir, `${label}.sqlite`),
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:244:      await storeA.upsert('ignored', embedding, {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:249:      await storeB.upsert('ignored', embedding, {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:254:      await storeA.upsert('ignored', embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:20:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:421: * @param evalDb - An initialized better-sqlite3 Database instance.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:442:  const writeAll = evalDb.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index.vitest.ts:4:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index.vitest.ts:18:      content_hash TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index.vitest.ts:81:      INSERT INTO memory_index (spec_folder, file_path, file_mtime_ms, content_hash, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index.vitest.ts:94:      INSERT INTO memory_index (spec_folder, file_path, file_mtime_ms, content_hash, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index.vitest.ts:96:    `).run('specs/test', filePath, mtime, 'hash-pending', 'pending');
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index.vitest.ts:109:      INSERT INTO memory_index (spec_folder, file_path, file_mtime_ms, content_hash, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index.vitest.ts:115:      INSERT INTO memory_index (spec_folder, file_path, file_mtime_ms, content_hash, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index.vitest.ts:117:    `).run('specs/test', deletedPath, Date.now(), 'hash-deleted', 'success');
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index.vitest.ts:131:      INSERT INTO memory_index (spec_folder, file_path, file_mtime_ms, content_hash, embedding_status)
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index.vitest.ts:133:    `).run('specs/test', filePath, 0, 'hash-batch', 'success');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:90:/** Generate a content hash for change detection */
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts:15:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts:97: * @param database - better-sqlite3 Database instance
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:7:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:27:    dbPath = path.join(os.tmpdir(), `access-tracker-test-${Date.now()}.sqlite`);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:160:    mocks.mockGetDbPath.mockReturnValue('/tmp/test-context-index.sqlite');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:324:          dbPath: '/tmp/test-context-index.sqlite',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:358:      const originalMemoryDbPath = '/tmp/original-context-index.sqlite';
.opencode/skill/system-spec-kit/mcp_server/tests/handler-eval-reporting.vitest.ts:359:      const overrideDbPath = '/tmp/eval-context-index.sqlite';
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts:170:  it('T046-05a: deduplicates specs symlink that points to .opencode/specs', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:175:      'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:202:      'deep_loop_graph_upsert',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:300:      'shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status', 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:559:          get: vi.fn(() => ({ journal_mode: 'wal' })),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:606:        DATABASE_PATH: '/tmp/context-index.sqlite',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2208:    it('T64cc: startupScan skips inaccessible roots and deduplicates resolved paths', () => {
.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts:10:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts:36:    path.resolve(process.cwd(), '.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite'),
.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts:37:    path.resolve(process.cwd(), 'mcp_server/database/context-index.sqlite'),
.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts:38:    path.resolve(process.cwd(), 'database/context-index.sqlite'),
.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts:47:  return path.resolve(candidates[0] ?? path.resolve(process.cwd(), 'database/context-index.sqlite'));
.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts:140:    db.prepare('SELECT COUNT(*) AS total FROM sqlite_master').get();
.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts:168:    `${toTimestampId(now)}__pre-restore-context-index.sqlite`,
.opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:6:// Separate file from the main context-index.sqlite.
.opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:65:    it('T004-3: Eval DB is a separate file from main context-index.sqlite', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:68:      expect(path.basename(evalPath!)).not.toBe('context-index.sqlite');
.opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:118:        `SELECT name FROM sqlite_master WHERE type='table' AND name=?`
.opencode/skill/system-spec-kit/mcp_server/lib/eval/reporting-dashboard.ts:16:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:13:  upsertFileMock: vi.fn(),
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:32:  upsertFile: mocks.upsertFileMock,
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:75:    mocks.upsertFileMock.mockReturnValue(1);
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:85:      contentHash: 'hash-1',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md:30:`code-graph.sqlite` stored alongside the memory index DB. Schema: `code_files`, `code_nodes` (indexes on symbol_id, kind, name), `code_edges` (directional indexes on source_id, target_id).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:37:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:762:    const writeAll = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:3:import type BetterSqlite3 from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:720:        content_hash: 'previous-hash',
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:744:      computeHash: vi.fn(() => 'new-hash'),
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:757:      getMemoryHashSnapshot: vi.fn(() => ({ content_hash: 'previous-hash' })),
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:63:  content_hash?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:168: * Converts an embedding vector into a binary buffer for sqlite-vec storage.
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:33: * intentional and should be excluded from the "no duplicates" check.
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:238:  // 4. No duplicate static anchor IDs
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:240:  describe('No duplicate anchor IDs', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:249:      const duplicates: string[] = [];
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:253:          duplicates.push(anchor);
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:259:        duplicates,
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-id-simplification.vitest.ts:260:        `Duplicate static anchor IDs found: ${duplicates.join(', ')}`
.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts:10:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts:37:    path.resolve(process.cwd(), '.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite'),
.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts:38:    path.resolve(process.cwd(), 'mcp_server/database/context-index.sqlite'),
.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts:39:    path.resolve(process.cwd(), 'database/context-index.sqlite'),
.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts:48:  return path.resolve(candidates[0] ?? path.resolve(process.cwd(), 'database/context-index.sqlite'));
.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts:182:  const checkpointPath = path.join(args.outputDir, `${fileStem}.sqlite`);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:12:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:146:  // Enable WAL mode for better concurrent read performance
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:147:  db.pragma('journal_mode = WAL');
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:148:  db.pragma('busy_timeout = 5000');
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:16:  hashQuery,
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:338:  it('returns null when cursor query hash not found in store', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:339:    // Manually create a cursor with a hash that has no stored data
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:404:// -- hashQuery --
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:406:describe('hashQuery()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:407:  it('produces a deterministic hash', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:408:    expect(hashQuery('test query')).toBe(hashQuery('test query'));
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:411:  it('produces different hashes for different queries', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:412:    expect(hashQuery('query A')).not.toBe(hashQuery('query B'));
.opencode/skill/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts:416:    const result = hashQuery('');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:7:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:218:      memory_hash TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:221:      PRIMARY KEY (session_id, memory_hash)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:632:        INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:634:      `).run('session-test', 'hash-test-snapshot', 1, now, 'session-other', 'hash-other-snapshot', 2, now);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:655:        INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:657:      `).run('session-test', 'hash-test-live', 1, now);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:683:        database.prepare('SELECT memory_hash FROM session_sent_memories WHERE memory_id = ?').get(1)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:684:      ).toEqual({ memory_hash: 'hash-test-snapshot' });
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:686:        database.prepare('SELECT memory_hash, sent_at FROM session_sent_memories WHERE memory_id = ?').get(2)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:687:      ).toEqual({ memory_hash: 'hash-other-snapshot', sent_at: 'other-live-sent' });
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:714:        INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:716:      `).run('session-test', 'hash-test-snapshot', 1, now);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:726:        INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:728:      `).run('session-test', 'hash-test-live', 1, now);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:744:        INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:746:      `).run('session-extra', 'hash-extra-live', null, now);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:771:        database.prepare('SELECT memory_hash FROM session_sent_memories WHERE memory_id = ?').get(1)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:772:      ).toEqual({ memory_hash: 'hash-test-snapshot' });
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-architecture-remediation.vitest.ts:83:      'upsert',
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:3:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:130:    it('initExitHandlers is idempotent (no duplicate listeners)', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:160:  sqlite_vec_available,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:201:  // F-28 — Deduplicate hits by memoryId to prevent Recall > 1.0
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:283:  // F-29 — Deduplicate relevant IDs in MAP calculation to prevent
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-metrics.ts:284:  // MAP > 1.0 when duplicate memoryIds appear in results.
.opencode/skill/system-spec-kit/mcp_server/tests/session-analytics-db.vitest.ts:141:      FROM sqlite_master
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:5:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:18:    'deep_loop_graph_upsert',
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:51:      const r = peGate.evaluateMemory('hash1', 'New content', [{ id: 1, similarity: 0.96, content: 'Test' }]);
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:56:      const r = peGate.evaluateMemory('hash2', 'Use feature X with improvements', [{ id: 1, similarity: 0.92, content: 'Use feature X' }]);
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:61:      const r = peGate.evaluateMemory('hash3', 'New related', [{ id: 1, similarity: 0.80, content: 'Test' }]);
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:66:      const r = peGate.evaluateMemory('hash4', 'Brand new', [{ id: 1, similarity: 0.30, content: 'Test' }]);
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:71:      const r = peGate.evaluateMemory('hash5', 'Test', [{ id: 1, similarity: 0.95, content: 'Test' }]);
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:76:      const r = peGate.evaluateMemory('hash6', 'Test', [{ id: 1, similarity: 0.85, content: 'Test' }]);
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:81:      const r = peGate.evaluateMemory('hash7', 'Test', [{ id: 1, similarity: 0.70, content: 'Test' }]);
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:86:      const r = peGate.evaluateMemory('hash8', 'New', []);
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:186:    it('T126: REINFORCE for near-duplicates', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:187:      const r = peGate.evaluateMemory('hash', 'Same content', [{ id: 1, similarity: 0.97, content: 'Same content' }]);
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:192:      const r = peGate.evaluateMemory('hash', 'Use async/await with error handling', [{ id: 1, similarity: 0.93, content: 'Use async/await' }]);
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:198:      const r = peGate.evaluateMemory('hash', 'Not use var but use let', [{ id: 1, similarity: 0.92, content: 'Always use var' }]);
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:205:      const r = peGate.evaluateMemory('hash', 'Brand new', []);
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:211:      const r = peGate.evaluateMemory('hash', 'Related', [{ id: 42, similarity: 0.85, content: 'Test' }]);
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:216:      const r = peGate.evaluateMemory('hash', 'New', [
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:238:      const r = peGate.evaluateMemory('hash', 'New', null as unknown as CandidateInput);
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:243:      const r = peGate.evaluateMemory('hash', 'New', undefined as unknown as CandidateInput);
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:248:      const r = peGate.evaluateMemory('hash', 'Test', [{ id: 1, similarity: 1.0, content: 'Test' }]);
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:253:      const r = peGate.evaluateMemory('hash', '', [{ id: 1, similarity: 0.80, content: '' }]);
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:258:      const r = peGate.evaluateMemory('hash', 'New', []);
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:359:        'hash123',                    // newMemoryHash
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:377:        'hash123',
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:386:      const expectedFields = ['action', 'new_memory_hash', 'existing_memory_id', 'similarity',
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:398:        'hash123',
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:438:      const result = peGate.evaluateMemory('mut05-hash-1', 'Brand new memory', []);
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:460:        'mut05-hash-2',
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:19:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:386: * Deduplicate and validate a list of numeric IDs, truncating to integers
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-scoring-calibration.vitest.ts:10:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-scoring-calibration.vitest.ts:88:    const hash = computeContentHash('sprint 2 feature eval');
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-scoring-calibration.vitest.ts:93:    storeEmbedding(db, hash, model, embedding, dims);
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-scoring-calibration.vitest.ts:94:    const result = lookupEmbedding(db, hash, model, dims);
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-scoring-calibration.vitest.ts:103:  it('T041-02: cache miss returns null for unknown hash', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-scoring-calibration.vitest.ts:120:      "UPDATE embedding_cache SET last_used_at = datetime('now', '-15 days') WHERE content_hash = ?",
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-scoring-calibration.vitest.ts:134:    const content = 'reproducible hash test';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:46:    deduplicatedFiles: number;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:81:/** Deduplicate file references across sections — higher priority sources keep their mentions */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:82:function deduplicateFilePaths(sections: MergedBrief['sections']): number {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:88:    const duplicates: string[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:92:        duplicates.push(fp);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:99:    // Remove duplicate file path lines from lower-priority sections
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:100:    if (duplicates.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:102:      for (const dup of duplicates) {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:119: * 3. Deduplicate at file level (same file from multiple sources → keep highest priority)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:177:  const deduplicatedFiles = deduplicateFilePaths(sections);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:221:      deduplicatedFiles,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:93: * Groups results by channel, deduplicates by memory ID (keeping highest score).
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:3:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:96:      "SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='feedback_events'"
.opencode/skill/system-spec-kit/mcp_server/lib/search/surrogate-storage.ts:13:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/search/surrogate-storage.ts:136:      `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_surrogates'`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/surrogate-storage.ts:192:      `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_surrogates'`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:212:// Supported SPECKIT_GRAPH_WALK_ROLLOUT states: off, trace_only, bounded_runtime.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:216:  const rollout = process.env.SPECKIT_GRAPH_WALK_ROLLOUT?.trim().toLowerCase();
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:561: * REQ-D4-005: Assistive reconsolidation for near-duplicate detection.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:9:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:13:const CONTEXT_DB_FILENAME = 'context-index.sqlite';
.opencode/skill/system-spec-kit/mcp_server/tests/signal-vocab.vitest.ts:7:// Without better-sqlite3 or vector-index wiring.
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:2:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:36:          content_hash TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:58:        CREATE INDEX idx_save_parent_content_hash_scope
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:61:            content_hash,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:91:          new_memory_hash TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/encoding-intent.vitest.ts:316:      'import { Database } from "better-sqlite3";',
.opencode/skill/system-spec-kit/mcp_server/tests/encoding-intent.vitest.ts:323:      '    this.db.pragma("journal_mode = WAL");',
.opencode/skill/system-spec-kit/mcp_server/tests/encoding-intent.vitest.ts:403:    const dbPath = path.join(tempDir, 'context-index.sqlite');
.opencode/skill/system-spec-kit/mcp_server/tests/encoding-intent.vitest.ts:434:    const dbPath = path.join(tempDir, 'context-index.sqlite');
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:3:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:525:      const uniqueIndex = indexes.find((index) => index.name.startsWith('sqlite_autoindex_causal_edges'));
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:1001:    it('T002: insertEdge upsert rolls back when weight_history insert fails', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:5:// Uses separate code-graph.sqlite alongside the memory index DB.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:7:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:59:    content_hash TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:83:    content_hash TEXT NOT NULL
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:114:  CREATE INDEX IF NOT EXISTS idx_files_hash ON code_files(content_hash);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:150:    dbPath = join(dbDir, 'code-graph.sqlite');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:152:    db.pragma('journal_mode = WAL'); // WAL enables concurrent readers without locks
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:262:export function upsertFile(
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:278:      UPDATE code_files SET language = ?, content_hash = ?, node_count = ?, edge_count = ?,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:287:      file_path, language, content_hash, file_mtime_ms, node_count, edge_count, parse_health, indexed_at, parse_duration_ms
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:299:      start_line, end_line, start_column, end_column, language, signature, docstring, content_hash)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:303:  const tx = d.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:337:  const tx = d.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:692:    contentHash: r.content_hash as string,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:11:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/search/deterministic-extractor.ts:9:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/search/deterministic-extractor.ts:209:    const runTransaction = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:4:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:399:    it('skips duplicate edges via INSERT OR IGNORE', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:404:        canonicalName: 'duplicate test',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:12:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:55:  /** If true, DELETE existing rows before inserting. Default: false (skip duplicates). */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:100: * IDs were mapped from the production context-index.sqlite DB via
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:130: * IGNORE to skip duplicates (based on UNIQUE(query_id, memory_id)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:133: * @param evalDb - An initialized better-sqlite3 Database instance.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:160:  const loadAll = evalDb.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:205: *   7. No duplicate query strings
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:276:  // Gate 7: Uniqueness — no duplicate query strings
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:279:  const duplicateCount = queries.length - uniqueCount;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:281:    dimension: 'Unique query strings (no duplicates)',
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:284:    passed: duplicateCount === 0,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:285:    detail: duplicateCount > 0 ? `${duplicateCount} duplicate(s) detected` : 'All unique',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-limit.vitest.ts:3:import type BetterSqlite3Module from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-limit.vitest.ts:17:    BetterSqlite3 = require('better-sqlite3') as typeof BetterSqlite3Module;
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:113: *   2. Lowercase and deduplicate.
.opencode/skill/system-spec-kit/mcp_server/tests/db-dimension-integrity.vitest.ts:13:    dbPath: path.join(dir, `${label}.sqlite`),
.opencode/skill/system-spec-kit/mcp_server/tests/db-state.vitest.ts:1:import BetterSqlite3 from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:4:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:12:} from '../lib/search/sqlite-fts';
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:220:        if (sql.includes("sqlite_master")) {
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:252:        if (sql.includes("sqlite_master")) {
.opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts:8:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:274:/** Resolve multiple seeds, deduplicate overlapping refs */
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:3:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:43:  computeContentHash: vi.fn((content: string) => `hash-${content.length}`),
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:142:      content_hash TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:172:    contentHash: 'new-content-hash',
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:263:      content_hash,
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:278:    'old-content-hash',
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:384:      SELECT content_hash, content_text
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:387:    `).get(parentId) as { content_hash: string; content_text: string };
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:388:    expect(parentRow.content_hash).toBe(parsed.contentHash);
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:586:  it('uses normalized content hash for chunk embedding cache keys', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-flags.vitest.ts:6:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search-flags.vitest.ts:32:        if (sql.includes('sqlite_master') && sql.includes('memory_fts')) {
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:3:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:27:  test_db_path = path.join(os.tmpdir(), `corrections-test-${Date.now()}.sqlite`);
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:120:        SELECT name FROM sqlite_master
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:129:        SELECT name FROM sqlite_master
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:10:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:114:      `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'`
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:211:    console.warn(`[sqlite-fts] FTS5 unavailable (${capability.fallbackState}); returning empty lexical lane results`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:252:    console.warn(`[sqlite-fts] BM25 FTS5 search failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts:10:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:19:// TODO: Extract quality gate, reconsolidation, chunked-indexing from memory-save (2,553 LOC source).
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:28:  'handlers/memory-save.js': 2200,  // actual: 1210 — Save logic with parsing, validation, indexing + quality gate + reconsolidation
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:15://   - TypeScript strict mode; zero external runtime deps beyond better-sqlite3
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:17:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:300:    const runTransaction = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:41:        content_hash: null,
.opencode/skill/system-spec-kit/mcp_server/tests/save-quality-gate.vitest.ts:781:    it('UG5: Gate ON, semantic duplicate rejects', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:11:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:67: * Cache is scoped per bound DB instance to avoid repeated sqlite_master probes.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:77:      `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'`
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:128:    // Deduplicate by memory id while preserving the highest score.
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:167:  // 3) Collapse duplicate edge hits in SQL (MAX fts_score per edge)
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:553: * @param database  - An open better-sqlite3 Database instance
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:657: * @param database  - An open better-sqlite3 Database instance
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:11:// DB-dependent (uses better-sqlite3 + sqlite-vec).
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:26:  let sqliteVecAvailable = false;
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:30:  const TMP_DB_PATH = path.join(TMP_DIR, 'test-context-index.sqlite');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:254:    it('parses hashtag-style tags from content', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:260:    it('ignores pure numeric hashtags', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:393:        "SELECT name FROM sqlite_master WHERE type='table' AND name='memory_index'"
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:406:      sqliteVecAvailable = mod.isVectorSearchAvailable();
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:407:      expect(typeof sqliteVecAvailable).toBe('boolean');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:474:    it('upserts existing memory (same folder+path)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:487:    it('upserts existing memory across symlink alias paths', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:861:          sqlite_vec_available: () => true,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1064:  describe('Vector Search (sqlite-vec dependent)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1128:      if (sqliteVecAvailable) {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1134:      const vectorDbPath = path.join(vectorTmpDir, 'test-context-index.sqlite');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1146:          sqlite_vec_available: () => true,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1173:      if (!sqliteVecAvailable) {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:5:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:59:    const contextDbPath = path.join(tempDir, 'nested', 'context-index.sqlite');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:97:      contextDbPath: path.join(tempDir, 'missing.sqlite'),
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:4:// DB-dependent imports (commented out - requires better-sqlite3 / dist modules)
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:5:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:108:    it('T724: Table has new_memory_hash column', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:150:    it('T734: Columns are not duplicated', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/migration-checkpoint-scripts.vitest.ts:5:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/migration-checkpoint-scripts.vitest.ts:37:    dbPath = path.join(tempDir, 'context-index.sqlite');
.opencode/skill/system-spec-kit/mcp_server/tests/db-state-graph-reinit.vitest.ts:16:        return { all: vi.fn(() => [{ name: 'main', file: '/tmp/context-index.sqlite' }]) };
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:108:  it('adds schema-aligned synthetic text parts and avoids duplicates', async () => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:133: * The model uses hashed bag-of-words embeddings so centroids can be built
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:288:    const idx = hashToken(token) % CENTROID_EMBED_DIM;
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:317: * // FNV-1a hash chosen for speed and low collision rate on short strings
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:319: * @param token - Single lowercase token to hash
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:320: * @returns Non-negative 32-bit integer hash
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:322:function hashToken(token: string): number {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:1:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:80:      sqlite_vec_available: false,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:480:    expect(report.duplicateActiveLogicalKeys).toContain('specs/015-memory-state::/tmp/a.md');
.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:12:  deduplicateResults,
.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:173:  it('deduplicates repeated IDs', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:268:describe('deduplicateResults()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:285:    const { results: deduped, metadata } = deduplicateResults(results, 'sess-1');
.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:294:    expect(metadata.deduplicated).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:300:    const { results: deduped } = deduplicateResults(results, 'sess-1');
.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:308:    const { results: deduped } = deduplicateResults(results, 'sess-1');
.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:316:    const { results: deduped, metadata } = deduplicateResults(results, 'sess-1');
.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:318:    expect(metadata.deduplicated).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:326:    const { results: deduped, metadata } = deduplicateResults(results, 'sess-1');
.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:338:    const { results: deduped, metadata } = deduplicateResults(results, 'sess-1');
.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:339:    expect(metadata.deduplicated).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:344:    const { results: deduped, metadata } = deduplicateResults([], 'sess-1');
.opencode/skill/system-spec-kit/mcp_server/tests/session-state.vitest.ts:346:    expect(metadata.deduplicated).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:4:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:35:    prior_hash: null,
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:36:    new_hash: computeHash('test-content'),
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:65:    expect(names).toContain('prior_hash');
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:66:    expect(names).toContain('new_hash');
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:86:  it('produces deterministic SHA-256 hashes', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:87:    const hash1 = computeHash('hello world');
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:88:    const hash2 = computeHash('hello world');
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:89:    const hash3 = computeHash('different content');
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:91:    expect(hash1).toBe(hash2);
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:92:    expect(hash1).not.toBe(hash3);
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:93:    expect(hash1).toHaveLength(64); // SHA-256 hex = 64 chars
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:174:      reason: 'merging duplicates',
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:175:      prior_hash: computeHash('old-state'),
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:176:      new_hash: computeHash('new-state'),
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:186:    expect(entry.reason).toBe('merging duplicates');
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:187:    expect(entry.prior_hash).toBe(computeHash('old-state'));
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:188:    expect(entry.new_hash).toBe(computeHash('new-state'));
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:228:  // 14. prior_hash null for creates
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:229:  it('allows null prior_hash for create mutations', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:232:      prior_hash: null,
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:234:    expect(entry.prior_hash).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:241:        INSERT INTO mutation_ledger (mutation_type, reason, new_hash, actor)
.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:3:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:111:    return db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:7:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:1:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:15:    sqlite_vec_available: false,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:171:        new_memory_hash TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:184:        id, timestamp, new_memory_hash, existing_memory_id,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:190:      'hash-1',
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:208:      SELECT id, timestamp, new_memory_hash, existing_memory_id, similarity, reason, contradiction_detected
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:214:      new_memory_hash: string;
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:224:      new_memory_hash: 'hash-1',
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:239:        content_hash TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:245:        PRIMARY KEY (content_hash, model_id)
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:250:      INSERT INTO embedding_cache (content_hash, model_id, embedding, dimensions, created_at, last_used_at)
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:252:    `).run('hash-1', 'model-A', Buffer.from([1, 2, 3]), 768, '2026-03-28T12:00:00.000Z', '2026-03-28T12:00:00.000Z');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:255:      sqlite_vec_available: false,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:260:      SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'embedding_cache'
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:262:    expect(tableSql.sql).toMatch(/PRIMARY KEY \(content_hash, model_id, dimensions\)/);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:265:      INSERT INTO embedding_cache (content_hash, model_id, embedding, dimensions, created_at, last_used_at)
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:267:    `).run('hash-1', 'model-A', Buffer.from([4, 5, 6]), 1024, '2026-03-28T12:01:00.000Z', '2026-03-28T12:01:00.000Z');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:272:      WHERE content_hash = ? AND model_id = ?
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:274:    `).all('hash-1', 'model-A') as Array<{ dimensions: number }>;
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:278:  it('creates save-path optimization indexes for canonical-path and scoped hash lookups', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:284:      FROM sqlite_master
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:286:        AND name IN ('idx_save_parent_content_hash_scope', 'idx_save_parent_canonical_path')
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:297:        name: 'idx_save_parent_content_hash_scope',
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:303:    expect(indexes[1]?.sql).toContain('content_hash');
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:53:  deduplicated: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:237: * @param results - Result set to deduplicate.
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:241:function deduplicateResults(
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:245:  const defaultMeta: DedupMetadata = { deduplicated: false, seenCount: 0, deprioritizedCount: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:270:        _deduplicated: true,
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:286:      deduplicated: deprioritizedCount > 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:412:  deduplicateResults,
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:682:  // Prevent duplicate enqueue of the same job.
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:8:import BetterSqlite3 from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:145:        INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:147:      `).run(sessionId, 'test-hash-123', 4);
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:99:      new Error('SQLITE_ERROR: no such table at /tmp/private/context-index.sqlite'),
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:105:    expect(JSON.stringify(response)).not.toContain('/tmp/private/context-index.sqlite');
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:247:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:249:const db = new Database('context-index.sqlite');
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:5:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:51: * These weights are consumed by the FTS5 path in sqlite-fts.ts,
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:119:  // Only deduplicate doubled consonants when a suffix was actually removed.
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:124:  // Are identical consonants and deduplicate.
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:6:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:17:  content_hash?: string;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:41:  memory_hash: string;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:80:function insertSentRow(sessionId: string, hash: string, memoryId: number | null, sentAt: string): void {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:82:    `INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at) VALUES (?, ?, ?, ?)`
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:83:  ).run(sessionId, hash, memoryId, sentAt);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:161:    it('skips duplicates, counts only new', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:169:      // MarkedCount should be 1 (duplicate ignored via INSERT OR IGNORE)
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:190:      insertSentRow(sid, 'hash_old_1', 1, oldTime);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:191:      insertSentRow(sid, 'hash_old_2', 2, oldTime);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:193:      insertSentRow(sid, 'hash_new_1', 3, new Date().toISOString());
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:206:      insertSentRow('cleanup-2', 'hash_fresh', 10, new Date().toISOString());
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:376:          "SELECT name FROM sqlite_master WHERE type='table' AND name='session_state'"
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:419:    it('upsert preserves existing fields via COALESCE', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:788:        insertSentRow(sid, 'oldest_hash', 3001, t1);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:789:        insertSentRow(sid, 'middle_hash', 3002, t2);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:790:        insertSentRow(sid, 'newest_hash', 3003, t3);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:797:          'SELECT memory_hash FROM session_sent_memories WHERE session_id = ? ORDER BY sent_at ASC'
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:801:        // The newest hash should survive
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:802:        const hashes = rows.map((r: HashRow) => r.memory_hash);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:804:          hashes.includes('newest_hash') || hashes.some((h: string) => h !== 'oldest_hash')
.opencode/skill/system-spec-kit/mcp_server/lib/ops/README.md:32:- **File Watcher** monitors spec folders for Markdown file changes and triggers debounced re-indexing with content-hash deduplication.
.opencode/skill/system-spec-kit/mcp_server/lib/ops/README.md:43:| `file-watcher.ts` | Chokidar-based file watcher that detects add/change/unlink events on Markdown files, debounces them, compares content hashes to skip no-op writes and triggers re-indexing with bounded concurrency (max 2 parallel). Includes dotfile filtering, symlink-escape prevention and per-file AbortController cancellation. |
.opencode/skill/system-spec-kit/mcp_server/lib/ops/README.md:51:- Content-hash deduplication: SHA-256 hash comparison prevents re-indexing unchanged files.
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-cleanup-ordering.vitest.ts:14:import { reconsolidate } from '../lib/storage/reconsolidation';
.opencode/skill/system-spec-kit/mcp_server/tests/handler-causal-graph.vitest.ts:217:        throw new Error('SQLITE_ERROR: failed to open /private/tmp/secret.sqlite');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-causal-graph.vitest.ts:228:      expect(JSON.stringify(parsed)).not.toContain('/private/tmp/secret.sqlite');
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:5:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:41:    // Flatten all results from all lists, deduplicate by id, return sorted.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:9:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:50:        "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'active_memory_projection'"
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:4:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:268:      'Fourth sentence about cryptographic hash functions.',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:551:    const insertMany = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:566:    const insertMany = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:182:async function hashFileContent(filePath: string): Promise<string> {
.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:359:          nextHash = await hashFileContent(resolvedPath);
.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:360:        } catch (hashErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:361:          const code = hashErr instanceof Error && 'code' in hashErr && typeof hashErr.code === 'string'
.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:362:            ? hashErr.code
.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:365:          throw hashErr;
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:9:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:62:    `shadow-scoring-test-${Date.now()}-${Math.random().toString(36).slice(2)}.sqlite`
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:674:        "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('shadow_scoring_log', 'shadow_cycle_results') ORDER BY name"
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1321:      "SELECT name FROM sqlite_master WHERE type='table'"
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:3:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:24:import { fts5Bm25Search } from './sqlite-fts.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:389: * Deduplicated fanout: combines the original query with the LLM-produced
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:394: * @param queries - Array of query strings to deduplicate.
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:395: * @returns Deduplicated array, original first.
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager-recovery.vitest.ts:20:  const dbPath = path.join(dbDir, 'context-index.sqlite');
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager-recovery.vitest.ts:147:    const dbPath = path.join(dir, 'db', 'context-index.sqlite');
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager-recovery.vitest.ts:167:    const dbPath = path.join(dir, 'db', 'context-index.sqlite');
.opencode/skill/system-spec-kit/mcp_server/tests/transaction-manager-recovery.vitest.ts:285:    const missingDbPath = path.join(dir, 'missing-db', 'context-index.sqlite');
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:23:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:95: * @returns Deduplicated array of extracted aliases.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:275: * @returns Array of 2-5 deduplicated surrogate questions.
.opencode/skill/system-spec-kit/mcp_server/tests/query-flow-tracker.vitest.ts:2:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/query-flow-tracker.vitest.ts:67:  it('skips short queries and rapid duplicates', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-flow-tracker.vitest.ts:74:    const duplicate = trackQueryAndDetect(db, 'sess-c', 'follow on analysis', 'q2', ['mem-3']);
.opencode/skill/system-spec-kit/mcp_server/tests/query-flow-tracker.vitest.ts:76:    expect(duplicate?.type).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:8:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:80:  const tmpPath = path.join(os.tmpdir(), `learned-feedback-test-${Date.now()}-${Math.random().toString(36).slice(2)}.sqlite`);
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:361:      ['authentication', 'authorization', 'encryption', 'decryption', 'hashing'],
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:526:  it('R11-CO06b: applyLearnedTriggers deduplicates repeated terms within one call', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:9:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:194:  const hash = crypto.createHash('sha256');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:195:  hash.update(JSON.stringify({ query, limit, options }));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:196:  return hash.digest('hex').substring(0, 16);
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:34:- Save/index regressions including content-hash dedup, quality-loop behavior, and incremental-index edge cases.
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:68:npx vitest run tests/content-hash-dedup.vitest.ts tests/handler-memory-index-cooldown.vitest.ts tests/memory-save-pipeline-enforcement.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:85:| Save/index regressions | `content-hash-dedup.vitest.ts`, `memory-save-dedup-order.vitest.ts`, `handler-memory-index-cooldown.vitest.ts`, `chunking-orchestrator-swap.vitest.ts`, `memory-save-ux-regressions.vitest.ts` | Refinement work covered by this audit family |
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:101:- `content-hash-dedup.vitest.ts` - same-path and cross-path content-hash dedup behavior.
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:150:npx vitest run tests/content-hash-dedup.vitest.ts tests/quality-loop.vitest.ts tests/batch-processor.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-baseline.vitest.ts:33:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:13:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:85:      `SELECT name FROM sqlite_master WHERE type='table' AND name='consumption_log'`
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:125:      `SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='consumption_log'`
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:204: *   3. Return the deduplicated list.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:210: * @returns Merged, deduplicated, coverage-ranked result array.
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store.vitest.ts:18:    dbPath: path.join(dir, `${label}.sqlite`),
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts:15:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts:77:      "SELECT name FROM sqlite_master WHERE type='table' AND name='scoring_observations'"
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:76:      { path: 'mcp_server/handlers/memory-save.ts', description: 'Coordinates atomic save, sufficiency enforcement, duplicate detection, and post-mutation feedback for the memory save path.' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:343:    expect(['indexed', 'created', 'updated', 'duplicate', 'deferred', 'unchanged']).toContain(result.status);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:797:  it('detects near-duplicate via semantic similarity >= 0.92', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:924:        { path: 'file.ts', description: 'Coordinates atomic save, sufficiency enforcement, and duplicate detection for the memory save path.' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:1206:    // Exactly 0.92 should be flagged as duplicate (>= threshold)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:7:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:60:    'idx_save_parent_content_hash_scope',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:82:  'new_memory_hash',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:121:  CREATE INDEX IF NOT EXISTS idx_save_parent_content_hash_scope
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:124:    content_hash,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:143:    "SELECT 1 AS present FROM sqlite_master WHERE type='table' AND name = ?"
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:151:    "SELECT 1 AS present FROM sqlite_master WHERE type='index' AND name = ?"
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:165:    "SELECT sql FROM sqlite_master WHERE type='table' AND name = ?"
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:177:  return /PRIMARY\s+KEY\s*\(\s*content_hash\s*,\s*model_id\s*,\s*dimensions\s*\)/i.test(tableSql);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:197:      content_hash,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:205:      content_hash,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:251:      new_memory_hash TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:326:      new_memory_hash,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:342:      ${getFirstAvailableColumnExpression(legacyColumns, ['new_memory_hash'], 'NULL')},
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:461:        if (!get_error_message(e).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:481:          if (!get_error_message(e).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:524:        if (!get_error_message(e).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:533:        if (!get_error_message(e).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:547:        if (!get_error_message(e).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:568:        if (!get_error_message(e).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:696:        if (!get_error_message(e).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:705:        if (!get_error_message(e).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:741:        if (!get_error_message(e).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:837:        if (!get_error_message(e).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:846:        if (!get_error_message(e).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:865:        if (!get_error_message(e).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:874:        if (!get_error_message(e).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:883:        if (!get_error_message(e).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:902:        if (!get_error_message(e).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:941:        if (!get_error_message(e).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:949:        if (!get_error_message(e).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:959:        if (!get_error_message(e).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1074:      if (!get_error_message(e).includes('duplicate column') && !get_error_message(e).includes('already exists')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1172:        `SELECT sql FROM sqlite_master WHERE type='table' AND name='memory_index'`
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1183:          `SELECT sql FROM sqlite_master WHERE type='index' AND tbl_name='memory_index' AND sql IS NOT NULL`
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1226:  const run_all_migrations = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1311:    "SELECT sql FROM sqlite_master WHERE type='table' AND name='memory_lineage'"
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1366:    "SELECT sql FROM sqlite_master WHERE type='table' AND name='active_memory_projection'"
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1690:      if (!get_error_message(error).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1702:      if (!get_error_message(error).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1714:      if (!get_error_message(error).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1734:      if (!get_error_message(error).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1741:  if (!column_names.includes('content_hash')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1743:      database.exec(`ALTER TABLE memory_index ADD COLUMN content_hash TEXT`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1744:      console.warn('[vector-index] Migration: Added content_hash column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1746:      if (!get_error_message(error).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1749:      logDuplicateColumnMigrationSkip('content_hash', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1758:      if (!get_error_message(error).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1770:      if (!get_error_message(error).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1782:      if (!get_error_message(error).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1794:      if (!get_error_message(error).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1806:      if (!get_error_message(error).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1818:      if (!get_error_message(error).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1830:      if (!get_error_message(error).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1842:      if (!get_error_message(error).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1854:      if (!get_error_message(error).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1866:      if (!get_error_message(error).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1878:      if (!get_error_message(error).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1890:      if (!get_error_message(error).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1912:      if (!get_error_message(error).includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1949:  const backfillTx = database.transaction((rows: Array<{ id: number; file_path: string | null }>) => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2030:    database.exec(`CREATE INDEX IF NOT EXISTS idx_content_hash ON memory_index(content_hash)`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2033:      'idx_save_parent_content_hash_scope',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2037:    logger.info('Created idx_content_hash index');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2041:      index: 'idx_content_hash/idx_save_parent_content_hash_scope',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2127:    "SELECT sql FROM sqlite_master WHERE type='table' AND name='memory_history'"
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2266:  options: { sqlite_vec_available: boolean; get_embedding_dim: () => number }
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2268:  const { sqlite_vec_available, get_embedding_dim } = options;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2271:    SELECT name FROM sqlite_master
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2329:      content_hash TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2361:  // Create vec_memories virtual table (only if sqlite-vec is available)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2362:  if (sqlite_vec_available) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2453:    CREATE INDEX IF NOT EXISTS idx_content_hash ON memory_index(content_hash);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2454:    CREATE INDEX IF NOT EXISTS idx_save_parent_content_hash_scope ON memory_index(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2456:      content_hash,
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:80:  'investigate why the search results are returning duplicate entries when using the advanced filter with pagination',
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:151:/** Simple hash for a query string → deterministic integer. */
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:283:      const hash = queryHash(q);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:284:      const routedIds = simulateResultIds(complexChannels, hash);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:285:      const fullIds = simulateResultIds(fullChannels, hash);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:301:      const hash = queryHash(q);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:302:      const routedIds = simulateResultIds(simpleChannels, hash);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-comparison.vitest.ts:303:      const fullIds = simulateResultIds(fullChannels, hash);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:5:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:191:      // Verify no duplicate rows — only one row per (memory_id, snapshot_date)
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:846:              if (sql.includes('sqlite_master') && sql.includes("name='memory_fts'")) {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:932:      const insertAll = db.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:11:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:57: * Create a mock better-sqlite3 Database that handles the SQL patterns
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:126:  } as unknown as import('better-sqlite3').Database;
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:155:  } as unknown as import('better-sqlite3').Database;
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:392:    delete process.env.SPECKIT_GRAPH_WALK_ROLLOUT;
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:399:    process.env.SPECKIT_GRAPH_WALK_ROLLOUT = 'trace_only';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:234:    it('T500-07: Content hash computation is consistent', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:235:      const content = 'Some test content for hashing.';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:236:      const hash1 = memoryParser.computeContentHash(content);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:237:      const hash2 = memoryParser.computeContentHash(content);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:239:      expect(hash1).toBe(hash2);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:240:      expect(typeof hash1).toBe('string');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:241:      expect(hash1.length).toBe(64);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:244:    it('T500-08: Content hash changes when content changes', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:245:      const hash1 = memoryParser.computeContentHash('Content version 1');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:246:      const hash2 = memoryParser.computeContentHash('Content version 2');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:248:      expect(hash1).not.toBe(hash2);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:261:Decision 2: Use SHA-256 for hashing.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:335:      const hash = memoryParser.computeContentHash(largeContent);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:338:      expect(typeof hash).toBe('string');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:339:      expect(hash.length).toBe(64);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:430:      const hash = memoryParser.computeContentHash(content);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:433:      expect(typeof hash).toBe('string');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:434:      expect(hash.length).toBe(64);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:451:    it('T500-16: findMemoryFiles deduplicates symlinked specs roots', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/embedding-pipeline-weighting.vitest.ts:42:    contentHash: 'hash',
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:8:import BetterSqlite3 from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:144:  // Deduplicate, remove empties, cap at 3
.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:168:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:14:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:168: * @returns Array of candidate noun phrase tokens (lowercase, deduplicated).
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:756: * @param db - An initialized better-sqlite3 Database instance.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:10:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:31:  sqlite_vec_available as get_sqlite_vec_available,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:173:  const sqlite_vec = get_sqlite_vec_available();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:174:  if (!sqlite_vec) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:175:    console.warn('[vector-index] Vector search unavailable - sqlite-vec not loaded');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:323:  const sqlite_vec = get_sqlite_vec_available();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:324:  if (!sqlite_vec) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:325:    console.warn('[vector-index] Multi-concept search unavailable - sqlite-vec not loaded');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:527:  const hashtag_matches = content.match(/(?:^|\s)#([a-zA-Z][a-zA-Z0-9_-]*)/g);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:528:  if (hashtag_matches) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:529:    hashtag_matches.forEach(match => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:705: * const results = await vector_search_enriched('sqlite vec mismatch', 10, { specFolder: 'specs/001-demo' });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:722:  const sqlite_vec = get_sqlite_vec_available();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:723:  if (query_embedding && sqlite_vec) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:788: * const results = await multi_concept_search_enriched(['sqlite', 'vector'], 10, { specFolder: 'specs/001-demo' });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:818:  const sqlite_vec = get_sqlite_vec_available();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:819:  if (!sqlite_vec) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1300:  const sqlite_vec = get_sqlite_vec_available();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1303:    if (!sqlite_vec) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1304:      console.warn('[vector-index] find_orphaned_vector_ids: sqlite-vec not available');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1322:  if (autoClean && orphaned_vectors > 0 && sqlite_vec) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1336:  // F-08 — Guard vec_memories queries with sqlite_vec availability check.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1337:  // When sqlite-vec is not loaded, the vec_memories table does not exist.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1338:  const missing_vectors = sqlite_vec
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1347:  const total_vectors = sqlite_vec
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:344: * - Deduplicates
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:347: * @returns Deduplicated array of significant lowercase keywords.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:20:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:21:import * as sqliteVec from 'sqlite-vec';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:168:    SELECT name FROM sqlite_master WHERE type='table' AND name='memory_index'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:181:    SELECT name FROM sqlite_master WHERE type='table' AND name='vec_metadata'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:202:    SELECT sql FROM sqlite_master WHERE name='vec_memories'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:228:  _sqlite_vec_available: boolean,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:268:  return validate_embedding_dimension_for_connection(db, sqlite_vec_available_flag);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:378:let sqlite_vec_available_flag = true;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:400:  sqlite_vec_available_flag = vec_available;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:429:/** Accessor for sqlite_vec_available (used by other modules) */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:430:export function sqlite_vec_available(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:431:  return sqlite_vec_available_flag;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:757:    set_active_database_connection(cached_conn, target_path, sqlite_vec_available_flag);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:773:      console.error('[vector-index] FATAL: better-sqlite3 native module failed to load');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:787:      console.error('[vector-index] Or manually: npm rebuild better-sqlite3');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:794:    sqliteVec.load(new_db);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:797:    console.warn(`[vector-index] sqlite-vec extension not available: ${get_error_message(vec_error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:799:    console.warn('[vector-index] Install sqlite-vec: brew install sqlite-vec (macOS)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:802:  new_db.pragma('journal_mode = WAL');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:803:  new_db.pragma('busy_timeout = 10000');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:819:  create_schema(new_db, { sqlite_vec_available: vec_available, get_embedding_dim });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:875:// Check if vector search is available (sqlite-vec loaded)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:877: * Reports whether sqlite-vec vector search is available.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:881:  return sqlite_vec_available_flag;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:958:   * const id = await store.upsert('ignored', embedding, { spec_folder: 'specs/001-demo', file_path: 'spec.md' });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:961:  async upsert(_id: string, embedding: EmbeddingInput, metadata: JsonObject): Promise<number> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1050:    return sqlite_vec_available_flag;
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:5:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:68:    sqlite_vec_available: false,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:109:      prior_hash TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:110:      new_hash TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:167:      memory_hash TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:170:      PRIMARY KEY (session_id, memory_hash)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:174:      content_hash TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:180:      PRIMARY KEY (content_hash, model_id)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:219:      content_hash,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:229:    '["alpha","sqlite"]',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:242:    'hash-alpha',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:267:      content_hash,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:290:    'hash-beta',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:323:      id, timestamp, mutation_type, reason, prior_hash, new_hash, linked_memory_ids, decision_meta, actor, session_id
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:325:  `).run(1, later, 'update', 'seed restore', 'hash-alpha-prev', 'hash-alpha', '[1]', '{"source":"test"}', 'tester', 'sess-1');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:329:      id, timestamp, action, new_memory_hash, new_memory_id, existing_memory_id, similarity, reason,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:332:  `).run(1, later, 'UPDATE', 'hash-beta', 2, 1, 0.82, 'seed conflict', 'beta preview', 'alpha preview', 0, null, 'specs/022-hybrid-rag-fusion', later);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:354:  `).run(1, 1, 'downrank', '["sqlite"]', 'tester', 1710929200, 0);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:390:    INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:392:  `).run('sess-1', 'hash-alpha', 1, later);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:401:    INSERT INTO embedding_cache (content_hash, model_id, embedding, dimensions, created_at, last_used_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:403:  `).run('hash-alpha', 'test-model', Buffer.from([4, 4, 4]), 3, now, later);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:459:    dbPath = path.join(tempDir, 'checkpoint-completeness.sqlite');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:487:    const restoreDbPath = path.join(tempDir, 'checkpoint-restore.sqlite');
.opencode/skill/system-spec-kit/mcp_server/lib/search/chunk-reassembly.ts:79: * 1. Deduplicates by parent_id (keeps only the first/best-scoring chunk per parent)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:30:  sqlite_vec_available as get_sqlite_vec_available,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:36:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:102:function upsert_active_projection(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:215:  const sqlite_vec = get_sqlite_vec_available();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:217:  const index_memory_tx = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:218:    const embedding_status = sqlite_vec ? 'success' : 'pending';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:236:    upsert_active_projection(database, specFolder, canonicalFilePath, anchorId, metadata_id, now);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:238:    if (sqlite_vec) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:293:  const index_memory_deferred_tx = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:314:      upsert_active_projection(database, specFolder, canonicalFilePath, anchorId, existing.id, now);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:332:    upsert_active_projection(database, specFolder, canonicalFilePath, anchorId, Number(row_id), now);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:374:  const update_memory_tx = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:452:    const sqlite_vec = get_sqlite_vec_available();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:453:    if (embedding && sqlite_vec) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:476:      upsert_active_projection(database, existingRow.spec_folder, projectionPath, existingRow.anchor_id ?? null, id, now);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:517:  const sqlite_vec = get_sqlite_vec_available();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:519:  const delete_memory_tx = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:523:    if (sqlite_vec) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:622:  const sqlite_vec = get_sqlite_vec_available();
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:640:  const delete_transaction = database.transaction(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:647:        if (sqlite_vec) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:692:    const outcome = delete_transaction();
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:251:  // Simple hash
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:252:  let hash = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:255:    hash = ((hash << 5) - hash) + char;
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:256:    hash |= 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:258:  return `rerank-${Math.abs(hash).toString(36)}`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:49:- **Schema Management**: sqlite-vec schema v15 (current) with document-type fields, event-based decay and phase-aware columns
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:58:|---> Vector (sqlite-vec)       -> Semantic matches
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:93:| Vector | `vector-index.ts` | Semantic similarity via sqlite-vec through the split vector-index modules |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:95:| FTS5 | `sqlite-fts.ts` | SQLite FTS5 BM25 weighted scoring |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:141:- **MMR Diversity**: Maximal Marginal Relevance reranking reduces near-duplicate results
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:289:| `vector-index-store.ts`    | -      | TypeScript | Low-level storage operations and reconsolidation helpers |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:311:| `sqlite-fts.ts`            | -      | TypeScript | SQLite FTS5 BM25 weighted scoring, extracted from hybrid-search for independent use |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:383:   MMR diversity reranking -> Reduce near-duplicate results
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:475:// Float32Array -> Buffer conversion for sqlite-vec
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:679:Same-path `unchanged` only applies to healthy existing rows (`success`, `pending`, `partial`), so unhealthy embedding states still re-enter indexing. Cross-path content-hash dedup accepts chunked parents only when the parent row is in valid `partial` state and ignores invalid parent rows marked `complete`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:688:| 3. Semantic Dedup | Cosine similarity against existing memories | Threshold: 0.92 rejects near-duplicates |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:692:**TM-06: Reconsolidation** (`reconsolidation.ts`):
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:707:Embedding cache keys now hash normalized content in both the primary and chunked embedding paths, so equivalent normalized content shares cache entries.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:772:import Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:871:- SQL operator precedence fixes in scoring and reconsolidation queries (B3)
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:914:| `better-sqlite3` | SQLite database driver  |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:915:| `sqlite-vec`     | Vector search extension |
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:107:  /** Raw cosine similarity (0–100 scale from sqlite-vec). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts:12:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts:36:    SELECT name FROM sqlite_master
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:40:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:539:  // Merge non-chunks + reassembled parent rows, deduplicate by id (prefer highest score),
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:48:import type Database from 'better-sqlite3';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:899:  const writeAdaptiveSignals = db.transaction((accessedResults: PipelineRow[]) => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:607:    // To avoid a duplicate generateQueryEmbedding() call.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:748:          // Merge variant results, deduplicate by id, preserve first-occurrence order
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:846:            // Merge both result sets, deduplicate by id, baseline-first ordering
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1083:  //   4. Deduplicate and merge into candidates.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1218:  // + deduplicate by ID.
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:95: * Produce a simple hash string from a query for cursor identification.
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:96: * Uses a djb2-style hash for speed and determinism.
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:98: * @param query - Query text to hash.
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:99: * @returns Deterministic base-36 hash string for the query.
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:102: * const queryHash = hashQuery('memory search');
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:105:function hashQuery(query: string): string {
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:106:  let hash = 5381;
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:108:    hash = ((hash << 5) + hash + query.charCodeAt(i)) >>> 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:110:  return hash.toString(36);
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:293: * @param query - Original query string for hash-based identification.
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:311:  const queryHash = hashQuery(query);
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:516:  hashQuery,

codex
I’ve got the main shape now: Mnemosyne gives you two buckets with no conflict-management layer, while Spec Kit Memory already has explicit governed scope fields, shared-space membership controls, and database-level transactional boundaries. I’m narrowing to the few code paths that answer the real question directly: scope enforcement, shared-space mutations, dedup/reconsolidation, and storage concurrency.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   261	    issues.push('deleteAfter is required for ephemeral retention policy');
   262	  }
   263	
   264	  return {
   265	    allowed: issues.length === 0,
   266	    reason: issues[0],
   267	    issues,
   268	    normalized: {
   269	      tenantId: scope.tenantId ?? '',
   270	      userId: scope.userId,
   271	      agentId: scope.agentId,
   272	      sessionId: scope.sessionId ?? '',
   273	      sharedSpaceId: scope.sharedSpaceId,
   274	      provenanceSource,
   275	      provenanceActor,
   276	      governedAt,
   277	      retentionPolicy,
   278	      deleteAfter,
   279	    },
   280	  };

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts | sed -n '140,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   140	    actor: { subjectType: 'agent', subjectId: configuredAgentId },
   141	  };
   142	}
   143	
   144	function validateSharedCallerIdentity(
   145	  args: SharedCallerAuthArgs,
   146	): SharedAdminActor {
   147	  const userIdProvided = typeof args.actorUserId === 'string';
   148	  const agentIdProvided = typeof args.actorAgentId === 'string';
   149	  const normalizedUserId = typeof args.actorUserId === 'string' ? args.actorUserId.trim() : '';
   150	  const normalizedAgentId = typeof args.actorAgentId === 'string' ? args.actorAgentId.trim() : '';
   151	  const hasBlankUser = userIdProvided && normalizedUserId.length === 0;
   152	  const hasBlankAgent = agentIdProvided && normalizedAgentId.length === 0;
   153	  const hasUser = normalizedUserId.length > 0;
   154	  const hasAgent = normalizedAgentId.length > 0;
   155	
   156	  if (hasBlankUser || hasBlankAgent) {
   157	    throwSharedMemoryAuthError(
   158	      'Actor identities must be non-empty, non-whitespace strings.',
   159	      createCallerAuthErrorResponse({
   160	        tool: args.tool,
   161	        error: 'Actor identities must be non-empty, non-whitespace strings.',
   162	        code: 'E_VALIDATION',
   163	        reason: 'actor_identity_blank',
   164	        hint: 'Provide exactly one non-empty actorUserId or actorAgentId value.',
   165	      }),
   166	    );
   167	  }
   168	
   169	  if (hasUser && hasAgent) {
   170	    throwSharedMemoryAuthError(
   171	      'Provide only one actor identity.',
   172	      createCallerAuthErrorResponse({
   173	        tool: args.tool,
   174	        error: 'Provide only one actor identity.',
   175	        code: 'E_VALIDATION',
   176	        reason: 'actor_identity_ambiguous',
   177	        hint: 'Send only actorUserId or actorAgentId, not both.',
   178	      }),
   179	    );
   180	  }
   181	
   182	  if (!hasUser && !hasAgent) {
   183	    throwSharedMemoryAuthError(
   184	      'Caller authentication is required for shared-memory operations.',
   185	      createCallerAuthErrorResponse({
   186	        tool: args.tool,
   187	        error: 'Caller authentication is required for shared-memory operations.',
   188	        code: 'E_AUTHENTICATION',
   189	        reason: 'actor_identity_required',
   190	        hint: 'Provide exactly one caller identity via actorUserId or actorAgentId.',
   191	      }),
   192	    );
   193	  }
   194	
   195	  return hasUser
   196	    ? { subjectType: 'user', subjectId: normalizedUserId }
   197	    : { subjectType: 'agent', subjectId: normalizedAgentId };
   198	}
   199	
   200	function isTrustedCallerIdentityBindingEnabled(): boolean {
   201	  const value = process.env.SPECKIT_SHARED_MEMORY_TRUST_CALLER_IDENTITY;
   202	  if (typeof value !== 'string') {
   203	    return false;
   204	  }
   205	  return value.trim().toLowerCase() === 'true';
   206	}
   207	
   208	export function validateCallerAuth(
   209	  args: SharedAdminCallerAuthArgs,
   210	  tenantId?: string,
   211	): ValidatedCallerAuth {
   212	  const normalizedTenantId = typeof tenantId === 'string' ? tenantId.trim() : '';
   213	
   214	  if (args.tool !== 'shared_memory_enable' && normalizedTenantId.length === 0) {
   215	    throwSharedMemoryAuthError(
   216	      'Tenant scope is required for shared-memory admin mutations.',
   217	      createCallerAuthErrorResponse({
   218	        tool: args.tool,
   219	        error: 'Tenant scope is required for shared-memory admin mutations.',
   220	        code: 'E_AUTHORIZATION',
   221	        reason: 'shared_space_tenant_required',
   222	        hint: 'Provide the tenantId for the target shared-space mutation.',
   223	      }),
   224	    );
   225	  }
   226	
   227	  const adminResult = resolveAdminActor(args.tool);
   228	  if (!adminResult.ok) {
   229	    throwSharedMemoryAuthError('Shared-memory admin validation failed.', adminResult.response);
   230	  }
   231	
   232	  if (!isTrustedCallerIdentityBindingEnabled()) {
   233	    throwSharedMemoryAuthError(
   234	      'Shared-memory admin mutations require trusted identity binding.',
   235	      createCallerAuthErrorResponse({
   236	        tool: args.tool,
   237	        error: 'Shared-memory admin mutations require trusted identity binding.',
   238	        code: 'E_AUTHORIZATION',
   239	        reason: 'shared_memory_trusted_binding_required',
   240	        hint: 'Set SPECKIT_SHARED_MEMORY_TRUST_CALLER_IDENTITY=true only for trusted local transports.',
   241	      }),
   242	    );
   243	  }
   244	
   245	  // SECURITY: Actor IDs are caller-supplied and not cryptographically bound to
   246	  // an authenticated session. In untrusted environments, wrap this handler
   247	  // behind authenticated transport middleware.
   248	  // Shared-memory tools do not currently receive a server-minted sessionId or
   249	  // transport principal, so the trusted-session validation used by
   250	  // memory_context/memory_match_triggers cannot be wired here yet.
   251	  const actor = validateSharedCallerIdentity(args);
   252	
   253	  return {
   254	    actor,
   255	    isAdmin: actor.subjectType === adminResult.actor.subjectType
   256	      && actor.subjectId === adminResult.actor.subjectId,
   257	  };
   258	}
   259	
   260	function buildActorScope(

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts | sed -n '460,730p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   460	    const { actor, isAdmin } = validateCallerAuth({
   461	      tool: 'shared_space_upsert',
   462	      actorUserId: args.actorUserId,
   463	      actorAgentId: args.actorAgentId,
   464	    }, args.tenantId);
   465	
   466	    const result = db.transaction((): (
   467	      | { success: true; created: boolean; ownerBootstrap: boolean; rolloutEnabled: boolean; killSwitch: boolean }
   468	      | { error: string; msg: string; operationType: 'create' | 'update' }
   469	    ) => {
   470	      const existingSpace = db.prepare(`
   471	        SELECT tenant_id, rollout_enabled, kill_switch
   472	        FROM shared_spaces
   473	        WHERE space_id = ?
   474	        LIMIT 1
   475	      `).get(args.spaceId) as {
   476	        tenant_id?: string;
   477	        rollout_enabled?: number;
   478	        kill_switch?: number;
   479	      } | undefined;
   480	
   481	      if (existingSpace) {
   482	        if (!isAdmin) {
   483	          const access = assertSharedSpaceAccess(
   484	            db,
   485	            buildActorScope(actor, args.tenantId, args.spaceId),
   486	            args.spaceId,
   487	            'owner',
   488	          );
   489	          if (!access.allowed) {
   490	            const reason = normalizeOwnerAdminDenyReason(access.reason ?? 'shared_space_owner_required');
   491	            recordSharedSpaceAdminAudit(db, {
   492	              actor,
   493	              tenantId: args.tenantId,
   494	              spaceId: args.spaceId,
   495	              decision: 'deny',
   496	              operation: 'space_upsert',
   497	              reason,
   498	              metadata: {
   499	                operationType: 'update',
   500	                actorAuthRole: 'owner',
   501	              },
   502	            });
   503	            return {
   504	              error: reason,
   505	              msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
   506	              operationType: 'update',
   507	            };
   508	          }
   509	        }
   510	      } else if (!isAdmin) {
   511	        const reason = 'shared_space_create_admin_required';
   512	        recordSharedSpaceAdminAudit(db, {
   513	          actor,
   514	          tenantId: args.tenantId,
   515	          spaceId: args.spaceId,
   516	          decision: 'deny',
   517	          operation: 'space_upsert',
   518	          reason,
   519	          metadata: {
   520	            operationType: 'create',
   521	            actorAuthRole: 'non_admin',
   522	          },
   523	        });
   524	        return {
   525	          error: reason,
   526	          msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
   527	          operationType: 'create',
   528	        };
   529	      }
   530	
   531	      const definition = {
   532	        spaceId: args.spaceId,
   533	        tenantId: args.tenantId,
   534	        name: args.name,
   535	        rolloutEnabled: args.rolloutEnabled,
   536	        rolloutCohort: args.rolloutCohort,
   537	        killSwitch: args.killSwitch,
   538	      };
   539	
   540	      let created = false;
   541	      let ownerBootstrap = false;
   542	
   543	      if (existingSpace) {
   544	        upsertSharedSpace(db, definition);
   545	      } else {
   546	        const createResult = createSharedSpaceIfAbsent(db, definition);
   547	        created = createResult.created;
   548	        ownerBootstrap = createResult.created;
   549	
   550	        if (!createResult.created) {
   551	          upsertSharedSpace(db, definition);
   552	        }
   553	      }
   554	
   555	      if (ownerBootstrap) {
   556	        upsertSharedMembership(db, {
   557	          spaceId: args.spaceId,
   558	          subjectType: actor.subjectType,
   559	          subjectId: actor.subjectId,
   560	          role: 'owner',
   561	        });
   562	      }
   563	
   564	      const savedSpace = db.prepare(`
   565	        SELECT rollout_enabled, kill_switch
   566	        FROM shared_spaces
   567	        WHERE space_id = ?
   568	        LIMIT 1
   569	      `).get(args.spaceId) as { rollout_enabled?: number; kill_switch?: number } | undefined;
   570	
   571	      recordSharedSpaceAdminAudit(db, {
   572	        actor,
   573	        tenantId: args.tenantId,
   574	        spaceId: args.spaceId,
   575	        decision: 'allow',
   576	        operation: 'space_upsert',
   577	        reason: created ? 'space_created' : 'space_updated',
   578	        metadata: {
   579	          operationType: created ? 'create' : 'update',
   580	          actorAuthRole: isAdmin ? 'admin' : 'owner',
   581	          created,
   582	          ownerBootstrap,
   583	          rolloutEnabled: savedSpace?.rollout_enabled === 1,
   584	          killSwitch: savedSpace?.kill_switch === 1,
   585	        },
   586	      });
   587	
   588	      return {
   589	        success: true,
   590	        created,
   591	        ownerBootstrap,
   592	        rolloutEnabled: savedSpace?.rollout_enabled === 1,
   593	        killSwitch: savedSpace?.kill_switch === 1,
   594	      };
   595	    })();
   596	
   597	    if ('error' in result) {
   598	      return createSharedSpaceAuthError('shared_space_upsert', result.error, result.msg);
   599	    }
   600	
   601	    return createMCPSuccessResponse({
   602	      tool: 'shared_space_upsert',
   603	      summary: `Shared space "${args.spaceId}" saved`,
   604	      data: {
   605	        spaceId: args.spaceId,
   606	        tenantId: args.tenantId,
   607	        actorSubjectType: actor.subjectType,
   608	        actorSubjectId: actor.subjectId,
   609	        created: result.created,
   610	        ownerBootstrap: result.ownerBootstrap,
   611	        rolloutEnabled: result.rolloutEnabled,
   612	        killSwitch: result.killSwitch,
   613	      },
   614	    });
   615	  } catch (error: unknown) {
   616	    if (error instanceof SharedMemoryAuthError) {
   617	      return error.response;
   618	    }
   619	
   620	    return createSharedMemoryInternalError(
   621	      'shared_space_upsert',
   622	      'Shared space upsert failed',
   623	      error,
   624	      'Retry the operation. If the error persists, check database connectivity.',
   625	    );
   626	  }
   627	}
   628	
   629	/**
   630	 * Persist membership for a user or agent within a shared space.
   631	 *
   632	 * @param args - Membership assignment to write.
   633	 * @returns MCP success response describing the updated membership.
   634	 */
   635	export async function handleSharedSpaceMembershipSet(args: SharedSpaceMembershipArgs): Promise<MCPResponse> {
   636	  try {
   637	    // WARNING: Admin mutations trust caller-supplied actor identity until transport-auth binding is added.
   638	    warnTrustedAdminIdentityAssumption();
   639	    const db = requireDb();
   640	    ensureSharedCollabRuntime(db);
   641	
   642	    const enabled = isSharedMemoryEnabled(db);
   643	    if (!enabled) {
   644	      return createMCPErrorResponse({
   645	        tool: 'shared_space_membership_set',
   646	        error: 'Shared memory is not enabled. Run /memory:manage shared enable first.',
   647	        code: 'SHARED_MEMORY_DISABLED',
   648	      });
   649	    }
   650	
   651	    const { actor, isAdmin } = validateCallerAuth({
   652	      tool: 'shared_space_membership_set',
   653	      actorUserId: args.actorUserId,
   654	      actorAgentId: args.actorAgentId,
   655	    }, args.tenantId);
   656	
   657	    if (!isAdmin) {
   658	      const access = assertSharedSpaceAccess(
   659	        db,
   660	        buildActorScope(actor, args.tenantId, args.spaceId),
   661	        args.spaceId,
   662	        'owner',
   663	      );
   664	      if (!access.allowed) {
   665	        const reason = normalizeOwnerAdminDenyReason(access.reason ?? 'shared_space_owner_required');
   666	        try {
   667	          recordSharedSpaceAdminAudit(db, {
   668	            actor,
   669	            tenantId: args.tenantId,
   670	            spaceId: args.spaceId,
   671	            decision: 'deny',
   672	            operation: 'membership_set',
   673	            reason,
   674	            metadata: {
   675	              operationType: 'membership_update',
   676	              actorAuthRole: 'owner',
   677	              subjectType: args.subjectType,
   678	              subjectId: args.subjectId,
   679	              role: args.role,
   680	            },
   681	          });
   682	        } catch (error: unknown) {
   683	          const message = error instanceof Error ? error.message : String(error);
   684	          console.error(`[shared-memory] Failed to record shared_space_admin audit: ${message}`);
   685	        }
   686	        return createSharedSpaceAuthError(
   687	          'shared_space_membership_set',
   688	          reason,
   689	          getSharedSpaceAccessErrorMessage('shared_space_membership_set', args.spaceId, reason),
   690	        );
   691	      }
   692	    }
   693	
   694	    db.transaction(() => {
   695	      upsertSharedMembership(db, {
   696	        spaceId: args.spaceId,
   697	        subjectType: args.subjectType,
   698	        subjectId: args.subjectId,
   699	        role: args.role,
   700	      });
   701	
   702	      recordSharedSpaceAdminAudit(db, {
   703	        actor,
   704	        tenantId: args.tenantId,
   705	        spaceId: args.spaceId,
   706	        decision: 'allow',
   707	        operation: 'membership_set',
   708	        reason: 'membership_updated',
   709	        metadata: {
   710	          operationType: 'membership_update',
   711	          actorAuthRole: isAdmin ? 'admin' : 'owner',
   712	          subjectType: args.subjectType,
   713	          subjectId: args.subjectId,
   714	          role: args.role,
   715	        },
   716	      });
   717	    })();
   718	
   719	    return createMCPSuccessResponse({
   720	      tool: 'shared_space_membership_set',
   721	      summary: `Membership updated for ${args.subjectType} "${args.subjectId}"`,
   722	      data: {
   723	        spaceId: args.spaceId,
   724	        tenantId: args.tenantId,
   725	        actorSubjectType: actor.subjectType,
   726	        actorSubjectId: actor.subjectId,
   727	        subjectType: args.subjectType,
   728	        subjectId: args.subjectId,
   729	        role: args.role,
   730	      },

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts | sed -n '780,840p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   780	          console.error(`[vector-index] Marker recorded: Node ${marker.nodeVersion} (MODULE_VERSION ${marker.moduleVersion})`);
   781	        }
   782	      } catch (_: unknown) {
   783	        // IGNORE MARKER READ ERRORS BECAUSE THE DIAGNOSTIC FILE IS OPTIONAL.
   784	      }
   785	      console.error('[vector-index] This usually means Node.js was updated without rebuilding native modules.');
   786	      console.error('[vector-index] Fix: Run \'bash scripts/setup/rebuild-native-modules.sh\' from the spec-kit root');
   787	      console.error('[vector-index] Or manually: npm rebuild better-sqlite3');
   788	    }
   789	    throw db_error;
   790	  }
   791	
   792	  let vec_available = true;
   793	  try {
   794	    sqliteVec.load(new_db);
   795	  } catch (vec_error: unknown) {
   796	    vec_available = false;
   797	    console.warn(`[vector-index] sqlite-vec extension not available: ${get_error_message(vec_error)}`);
   798	    console.warn('[vector-index] Falling back to anchor-only mode (no vector search)');
   799	    console.warn('[vector-index] Install sqlite-vec: brew install sqlite-vec (macOS)');
   800	  }
   801	
   802	  new_db.pragma('journal_mode = WAL');
   803	  new_db.pragma('busy_timeout = 10000');
   804	  new_db.pragma('foreign_keys = ON');
   805	  new_db.pragma('cache_size = -64000');
   806	  new_db.pragma('mmap_size = 268435456');
   807	  new_db.pragma('synchronous = NORMAL');
   808	  new_db.pragma('temp_store = MEMORY');
   809	
   810	  const preBootstrapDimCheck = validate_embedding_dimension_for_connection(new_db, vec_available);
   811	  if (!preBootstrapDimCheck.valid && preBootstrapDimCheck.stored != null) {
   812	    const msg = preBootstrapDimCheck.warning ||
   813	      `Embedding dimension mismatch: DB=${preBootstrapDimCheck.stored}, provider=${preBootstrapDimCheck.current}`;
   814	    console.error(`[vector-index] FATAL: ${msg}`);
   815	    try { new_db.close(); } catch (_: unknown) { /* best-effort */ }
   816	    throw new VectorIndexError(msg, VectorIndexErrorCode.INTEGRITY_ERROR);
   817	  }
   818	
   819	  create_schema(new_db, { sqlite_vec_available: vec_available, get_embedding_dim });
   820	  ensure_schema_version(new_db);
   821	
   822	  const dimCheck = validate_embedding_dimension_for_connection(new_db, vec_available);
   823	  if (!dimCheck.valid && dimCheck.stored != null) {
   824	    const msg = dimCheck.warning || `Dimension mismatch: DB=${dimCheck.stored}, provider=${dimCheck.current}`;
   825	    console.error(`[vector-index] FATAL: ${msg}`);
   826	    try { new_db.close(); } catch (_: unknown) { /* best-effort */ }
   827	    throw new VectorIndexError(msg, VectorIndexErrorCode.INTEGRITY_ERROR);
   828	  }
   829	
   830	  set_active_database_connection(new_db, target_path, vec_available);
   831	
   832	  // C1 FIX: Only cache in connection map after all validation passes
   833	  db_connections.set(resolved_target, new_db);
   834	
   835	  return new_db;
   836	}
   837	
   838	/* ───────────────────────────────────────────────────────────────
   839	   7. DATABASE UTILITIES
   840	----------------------------------------------------------------*/

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts | sed -n '200,430p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   200	            findSimilar: (emb, opts) => {
   201	              const searchEmb = emb instanceof Float32Array ? emb : new Float32Array(emb as number[]);
   202	              const results = vectorIndex.vectorSearch(searchEmb, {
   203	                limit: (opts.limit ?? 3) * 3, // Over-fetch for post-scope-filter
   204	                specFolder: opts.specFolder,
   205	                minSimilarity: 50,
   206	                includeConstitutional: false,
   207	              });
   208	              // Post-filter by governance scope to prevent cross-tenant reconsolidation
   209	              const scopeFiltered = results.filter((r: Record<string, unknown>) => {
   210	                if (scope?.tenantId && r.tenant_id && r.tenant_id !== scope.tenantId) return false;
   211	                if (scope?.userId && r.user_id && r.user_id !== scope.userId) return false;
   212	                if (scope?.agentId && r.agent_id && r.agent_id !== scope.agentId) return false;
   213	                if (scope?.sharedSpaceId && r.shared_space_id && r.shared_space_id !== scope.sharedSpaceId) return false;
   214	                return true;
   215	              }).slice(0, opts.limit ?? 3);
   216	              return scopeFiltered.map((r: Record<string, unknown>) => ({
   217	                id: typeof r.id === 'number' ? r.id : 0,
   218	                file_path: typeof r.file_path === 'string' ? r.file_path : '',
   219	                title: typeof r.title === 'string' ? r.title : null,
   220	                content_text: typeof r.content_text === 'string' ? r.content_text : (typeof r.content === 'string' ? r.content : null),
   221	                similarity: (typeof r.similarity === 'number' ? r.similarity : 0) / 100,
   222	                spec_folder: parsed.specFolder,
   223	                importance_weight: typeof r.importance_weight === 'number'
   224	                  ? r.importance_weight
   225	                  : 0.5,
   226	              }));
   227	            },
   228	            storeMemory: (memory) => {
   229	              const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);
   230	              const callbackSpecLevel = isSpecDocumentType(parsed.documentType)
   231	                ? detectSpecLevelFromParsed(memory.filePath)
   232	                : null;
   233	              const memoryEncodingIntent = isEncodingIntentEnabled()
   234	                ? classifyEncodingIntent(memory.content)
   235	                : undefined;
   236	
   237	              // P1-01 fix — wrap all DB writes (index, metadata, BM25, history) in a
   238	              // Single transaction for atomicity. better-sqlite3 supports nested transactions
   239	              // Via savepoints, so this is safe even if indexMemory uses its own transaction.
   240	              const fileMetadata = incrementalIndex.getFileMetadata(memory.filePath);
   241	              const fileMtimeMs = fileMetadata ? fileMetadata.mtime : null;
   242	
   243	              const memoryId = database.transaction(() => {
   244	                const id = vectorIndex.indexMemory({
   245	                  specFolder: memory.specFolder,
   246	                  filePath: memory.filePath,
   247	                  title: memory.title,
   248	                  triggerPhrases: memory.triggerPhrases ?? [],
   249	                  importanceWeight,
   250	                  embedding: memory.embedding as Float32Array,
   251	                  encodingIntent: memoryEncodingIntent,
   252	                  documentType: parsed.documentType || 'memory',
   253	                  specLevel: callbackSpecLevel,
   254	                  contentText: memory.content,
   255	                  qualityScore: parsed.qualityScore,
   256	                  qualityFlags: parsed.qualityFlags,
   257	                });
   258	
   259	                applyPostInsertMetadata(database, id, {
   260	                  content_hash: parsed.contentHash,
   261	                  context_type: parsed.contextType,
   262	                  importance_tier: parsed.importanceTier,
   263	                  memory_type: parsed.memoryType,
   264	                  type_inference_source: parsed.memoryTypeSource,
   265	                  stability: fsrsScheduler.DEFAULT_INITIAL_STABILITY,
   266	                  difficulty: fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
   267	                  file_mtime_ms: fileMtimeMs,
   268	                  encoding_intent: memoryEncodingIntent,
   269	                  document_type: parsed.documentType || 'memory',
   270	                  spec_level: callbackSpecLevel,
   271	                  quality_score: parsed.qualityScore ?? 0,
   272	                  quality_flags: JSON.stringify(parsed.qualityFlags ?? []),
   273	                });
   274	
   275	                if (bm25Index.isBm25Enabled()) {
   276	                  try {
   277	                    const bm25 = bm25Index.getIndex();
   278	                    bm25.addDocument(String(id), bm25Index.buildBm25DocumentText({
   279	                      title: memory.title,
   280	                      content_text: memory.content,
   281	                      trigger_phrases: memory.triggerPhrases ?? [],
   282	                      file_path: memory.filePath,
   283	                    }));
   284	                  } catch (bm25Err: unknown) {
   285	                    const message = toErrorMessage(bm25Err);
   286	                    console.warn(`[memory-save] BM25 indexing failed (recon conflict store): ${message}`);
   287	                    const bm25Warning = repairBm25Document({
   288	                      memoryId: id,
   289	                      title: memory.title,
   290	                      contentText: memory.content,
   291	                      triggerPhrases: memory.triggerPhrases ?? [],
   292	                      filePath: memory.filePath,
   293	                      contextLabel: 'recon conflict store',
   294	                    });
   295	                    if (bm25Warning) {
   296	                      reconWarnings.push(bm25Warning);
   297	                    }
   298	                  }
   299	                }
   300	
   301	                recordHistory(id, 'ADD', null, memory.title ?? memory.filePath ?? null, 'mcp:memory_save');
   302	
   303	                return id;
   304	              })();
   305	
   306	              return memoryId;
   307	            },
   308	            generateEmbedding: async (content: string) => {
   309	              return embeddings.generateDocumentEmbedding(content);
   310	            },
   311	          }
   312	        );
   313	
   314	        if (reconResult && reconResult.action !== 'complement') {
   315	          // Reconsolidation handled the memory (merge or conflict) — skip normal CREATE path
   316	          console.error(`[memory-save] TM-06: Reconsolidation ${reconResult.action} for ${path.basename(filePath)}`);
   317	
   318	          const reconId = reconResult.newMemoryId;
   319	
   320	          const ledgerRecorded = appendMutationLedgerSafe(database, {
   321	            mutationType: 'update',
   322	            reason: `memory_save: reconsolidation ${reconResult.action}`,
   323	            priorHash: null,
   324	            newHash: parsed.contentHash,
   325	            linkedMemoryIds: reconResult.action === 'conflict'
   326	              ? [reconResult.newMemoryId, reconResult.existingMemoryId]
   327	              : [reconId],
   328	            decisionMeta: {
   329	              tool: 'memory_save',
   330	              action: `reconsolidation_${reconResult.action}`,
   331	              similarity: reconResult.similarity,
   332	              specFolder: parsed.specFolder,
   333	              filePath,
   334	            },
   335	            actor: 'mcp:memory_save',
   336	          });
   337	          const earlyReturnWarnings = [
   338	            ...reconWarnings,
   339	            ...(reconResult.warnings ?? []),
   340	            ...(!ledgerRecorded ? ['Mutation ledger append failed; audit trail may be incomplete.'] : []),
   341	          ];
   342	
   343	          return {
   344	            earlyReturn: {
   345	              status: reconResult.action === 'merge' ? 'merged' : 'superseded',
   346	              id: reconId,
   347	              specFolder: parsed.specFolder,
   348	              title: parsed.title ?? '',
   349	              reconsolidation: reconResult,
   350	              message: `Reconsolidation: ${reconResult.action} (similarity: ${reconResult.similarity?.toFixed(3) ?? 'N/A'})`,
   351	              warnings: earlyReturnWarnings.length > 0 ? earlyReturnWarnings : undefined,
   352	            },
   353	            warnings: reconWarnings,
   354	          };
   355	        }
   356	        // ReconResult is null or complement — fall through to normal CREATE path
   357	      }
   358	    } catch (reconErr: unknown) {
   359	      const message = toErrorMessage(reconErr);
   360	      console.warn(`[memory-save] TM-06: Reconsolidation error (proceeding with normal save): ${message}`);
   361	      // Reconsolidation errors must not block saves
   362	    }
   363	  }
   364	
   365	  // ─────────────────────────────────────────────────────────────
   366	  // ASSISTIVE RECONSOLIDATION (REQ-D4-005)
   367	  // Runs independently of the TM-06 flag.  Requires embedding.
   368	  // Does NOT block normal save — all actions are advisory or
   369	  // shadow-only (auto-merge at >= 0.96 only archives old record).
   370	  // ─────────────────────────────────────────────────────────────
   371	  let assistiveRecommendation: AssistiveRecommendation | null = null;
   372	
   373	  if (!force && isAssistiveReconsolidationEnabled() && embedding) {
   374	    try {
   375	      // Find the top similar memory using the existing vector search
   376	      const searchEmb = embedding instanceof Float32Array ? embedding : new Float32Array(embedding as number[]);
   377	      const candidateResults = vectorIndex.vectorSearch(searchEmb, {
   378	        limit: 3,
   379	        specFolder: parsed.specFolder,
   380	        minSimilarity: Math.round(ASSISTIVE_REVIEW_THRESHOLD * 100), // convert to 0-100 scale
   381	        includeConstitutional: false,
   382	      });
   383	
   384	      if (candidateResults.length > 0) {
   385	        const top = candidateResults[0] as Record<string, unknown>;
   386	        // vectorSearch returns similarity in [0, 100], normalise to [0, 1]
   387	        const rawSimilarity = typeof top.similarity === 'number' ? top.similarity : 0;
   388	        const similarity = rawSimilarity > 1 ? rawSimilarity / 100 : rawSimilarity;
   389	        const topId = typeof top.id === 'number' ? top.id : 0;
   390	        const topContent = typeof top.content_text === 'string' ? top.content_text :
   391	                          (typeof top.content === 'string' ? top.content : '');
   392	
   393	        const tier = classifyAssistiveSimilarity(similarity);
   394	
   395	        if (tier === 'auto_merge') {
   396	          // Auto-merge: archive the older memory record (shadow operation —
   397	          // we mark is_archived so it is excluded from future search results
   398	          // but NOT physically deleted).
   399	          try {
   400	            database.prepare(`
   401	              UPDATE memory_index
   402	              SET is_archived = 1,
   403	                  updated_at = datetime('now')
   404	              WHERE id = ?
   405	            `).run(topId);
   406	            if (bm25Index.isBm25Enabled()) {
   407	              bm25Index.getIndex().removeDocument(String(topId));
   408	            }
   409	            console.warn(
   410	              `[reconsolidation-bridge] assistive auto-merge: archived older=${topId} ` +
   411	              `(similarity=${similarity.toFixed(3)}) — newer memory continues normal save`
   412	            );
   413	          } catch (mergeErr: unknown) {
   414	            const msg = mergeErr instanceof Error ? mergeErr.message : String(mergeErr);
   415	            console.warn(`[reconsolidation-bridge] assistive auto-merge archive failed: ${msg}`);
   416	          }
   417	        } else if (tier === 'review') {
   418	          // Review tier: classify and surface as recommendation (no mutations)
   419	          const classification = classifySupersededOrComplement(topContent, parsed.content);
   420	          assistiveRecommendation = {
   421	            action: 'review',
   422	            candidateMemoryIds: [topId],
   423	            description:
   424	              `Review borderline similarity ${similarity.toFixed(3)} between the pending save ` +
   425	              `and existing memory #${topId}; heuristic suggests ${classification}.`,
   426	            olderMemoryId: topId,
   427	            newerMemoryId: null,
   428	            similarity,
   429	            classification,
   430	            recommendedAt: Date.now(),

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts | sed -n '90,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    90	    true,
    91	    'auto',
    92	  );
    93	}
    94	
    95	export function findSamePathExistingMemory(
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
   141	 */
   142	export function createMemoryRecord(
   143	  database: BetterSqlite3.Database,
   144	  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
   145	  filePath: string,
   146	  embedding: Float32Array | null,
   147	  embeddingFailureReason: string | null,
   148	  peDecision: PeDecision,
   149	  scope: MemoryScopeMatch = {},
   150	): number {
   151	  if (!embedding) {
   152	    console.error(`[memory-save] Using deferred indexing for ${path.basename(filePath)}`);
   153	  }
   154	
   155	  // Detect spec level for spec documents.
   156	  const specLevel = isSpecDocumentType(parsed.documentType)
   157	    ? detectSpecLevelFromParsed(filePath)
   158	    : null;
   159	  const encodingIntent = isEncodingIntentEnabled()
   160	    ? classifyEncodingIntent(parsed.content)
   161	    : undefined;
   162	  const canonicalFilePath = getCanonicalPathKey(filePath);
   163	  // Security: raw provider errors sanitized before persistence/response
   164	  const persistedEmbeddingFailureReason = sanitizeEmbeddingFailureMessage(embeddingFailureReason);
   165	
   166	  const indexWithMetadata = database.transaction(() => {
   167	    // Determine importance weight based on document type.
   168	    const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);
   169	    const samePathExisting = findSamePathExistingMemory(
   170	      database,
   171	      parsed.specFolder,
   172	      canonicalFilePath,
   173	      filePath,
   174	      scope,
   175	    );
   176	    const lineageRouting = resolveCreateRecordLineage(peDecision, samePathExisting?.id ?? null);
   177	    const predecessorMemoryId = lineageRouting.predecessorMemoryId;
   178	    const transitionEvent = lineageRouting.transitionEvent;
   179	
   180	    const memory_id: number = embedding
   181	      ? vectorIndex.indexMemory({
   182	          specFolder: parsed.specFolder,
   183	          filePath,
   184	          title: parsed.title,
   185	          triggerPhrases: parsed.triggerPhrases,
   186	          importanceWeight,
   187	          embedding,
   188	          encodingIntent,
   189	          documentType: parsed.documentType || 'memory',
   190	          specLevel,
   191	          contentText: parsed.content,
   192	          qualityScore: parsed.qualityScore,
   193	          qualityFlags: parsed.qualityFlags,
   194	          appendOnly: predecessorMemoryId != null,
   195	        })
   196	      : vectorIndex.indexMemoryDeferred({
   197	          specFolder: parsed.specFolder,
   198	          filePath,
   199	          title: parsed.title,
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts | sed -n '280,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "export function filterRowsByScope|assertSharedSpaceAccess|getAllowedSharedSpaceIdsForCaller|recordGovernanceAudit|shared_space_conflicts|conflict" .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   280	  };
   281	}
   282	
   283	/**
   284	 * Map a governance decision into memory-index column values.
   285	 *
   286	 * @param decision - Normalized governance decision from ingest validation.
   287	 * @returns Column/value pairs used after memory insertion.
   288	 */
   289	export function buildGovernancePostInsertFields(decision: GovernanceDecision): Record<string, unknown> {
   290	  return {
   291	    tenant_id: decision.normalized.tenantId || null,
   292	    user_id: decision.normalized.userId ?? null,
   293	    agent_id: decision.normalized.agentId ?? null,
   294	    session_id: decision.normalized.sessionId || null,
   295	    shared_space_id: decision.normalized.sharedSpaceId ?? null,
   296	    provenance_source: decision.normalized.provenanceSource || null,
   297	    provenance_actor: decision.normalized.provenanceActor || null,
   298	    governed_at: decision.normalized.governedAt,
   299	    retention_policy: decision.normalized.retentionPolicy,
   300	    delete_after: decision.normalized.deleteAfter,
   301	    governance_metadata: JSON.stringify({
   302	      tenantId: decision.normalized.tenantId || null,
   303	      userId: decision.normalized.userId ?? null,
   304	      agentId: decision.normalized.agentId ?? null,
   305	      sessionId: decision.normalized.sessionId || null,
   306	      sharedSpaceId: decision.normalized.sharedSpaceId ?? null,
   307	      provenanceSource: decision.normalized.provenanceSource || null,
   308	      provenanceActor: decision.normalized.provenanceActor || null,
   309	      governedAt: decision.normalized.governedAt,
   310	      retentionPolicy: decision.normalized.retentionPolicy,
   311	      deleteAfter: decision.normalized.deleteAfter,
   312	    }),
   313	  };
   314	}
   315	
   316	/**
   317	 * Ensure governance and shared-space audit tables exist before writes.
   318	 *
   319	 * @param database - Database connection that stores governance state.
   320	 */
   321	export function ensureGovernanceRuntime(database: Database.Database): void {
   322	  ensureGovernanceTables(database);
   323	  ensureSharedSpaceTables(database);
   324	}
   325	
   326	/**
   327	 * Persist a governance audit entry for enforcement decisions and lifecycle events.
   328	 *
   329	 * @param database - Database connection that stores governance state.
   330	 * @param entry - Audit payload to persist.
   331	 */
   332	export function recordGovernanceAudit(database: Database.Database, entry: GovernanceAuditEntry): void {
   333	  ensureGovernanceRuntime(database);
   334	  const scope = normalizeScopeContext(entry);
   335	  database.prepare(`
   336	    INSERT INTO governance_audit (
   337	      action, decision, memory_id, logical_key, tenant_id, user_id, agent_id, session_id,
   338	      shared_space_id, reason, metadata
   339	    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
   340	  `).run(
   341	    entry.action,
   342	    entry.decision,
   343	    entry.memoryId ?? null,
   344	    entry.logicalKey ?? null,
   345	    scope.tenantId ?? null,
   346	    scope.userId ?? null,
   347	    scope.agentId ?? null,
   348	    scope.sessionId ?? null,
   349	    scope.sharedSpaceId ?? null,
   350	    entry.reason ?? null,
   351	    entry.metadata ? JSON.stringify(entry.metadata) : null,
   352	  );
   353	}
   354	
   355	function matchesExactScope(rowValue: unknown, requestedValue?: string): boolean {
   356	  if (!requestedValue) return true;
   357	  return typeof rowValue === 'string' && rowValue === requestedValue;
   358	}
   359	
   360	/**
   361	 * Determine whether a scope includes at least one concrete constraint.
   362	 *
   363	 * @param scope - Scope to inspect for tenant, actor, session, or shared-space bounds.
   364	 * @returns `true` when the scope constrains access to at least one boundary.
   365	 */
   366	export function hasScopeConstraints(scope: ScopeContext): boolean {
   367	  return Boolean(
   368	    scope.sharedSpaceId
   369	    || scope.tenantId
   370	    || scope.userId
   371	    || scope.agentId
   372	    || scope.sessionId,
   373	  );
   374	}
   375	
   376	function parseAuditMetadata(value: unknown): Record<string, unknown> | null {
   377	  if (typeof value !== 'string' || value.trim().length === 0) {
   378	    return null;
   379	  }
   380	
   381	  try {
   382	    const parsed = JSON.parse(value) as unknown;
   383	    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
   384	      return parsed as Record<string, unknown>;
   385	    }
   386	  } catch (error: unknown) {
   387	    if (error instanceof Error) {
   388	      return null;
   389	    }
   390	    return null;
   391	  }
   392	
   393	  return null;
   394	}
   395	
   396	function buildGovernanceAuditWhereClause(filters: GovernanceAuditReviewFilters): { whereSql: string; params: unknown[] } {
   397	  const normalized = normalizeScopeContext(filters);
   398	  const clauses: string[] = [];
   399	  const params: unknown[] = [];
   400	
   401	  if (filters.action) {
   402	    clauses.push('action = ?');
   403	    params.push(filters.action);
   404	  }
   405	  if (filters.decision) {
   406	    clauses.push('decision = ?');
   407	    params.push(filters.decision);
   408	  }
   409	  if (normalized.tenantId) {
   410	    clauses.push('tenant_id = ?');
   411	    params.push(normalized.tenantId);
   412	  }
   413	  if (normalized.userId) {
   414	    clauses.push('user_id = ?');
   415	    params.push(normalized.userId);
   416	  }
   417	  if (normalized.agentId) {
   418	    clauses.push('agent_id = ?');
   419	    params.push(normalized.agentId);
   420	  }
   421	  if (normalized.sessionId) {
   422	    clauses.push('session_id = ?');
   423	    params.push(normalized.sessionId);
   424	  }
   425	  if (normalized.sharedSpaceId) {
   426	    clauses.push('shared_space_id = ?');
   427	    params.push(normalized.sharedSpaceId);
   428	  }
   429	
   430	  return {
   431	    whereSql: clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '',
   432	    params,
   433	  };
   434	}
   435	
   436	function hasGovernanceAuditFilters(filters: GovernanceAuditReviewFilters): boolean {
   437	  const normalized = normalizeScopeContext(filters);
   438	  return Boolean(
   439	    filters.action
   440	    || filters.decision
   441	    || normalized.tenantId
   442	    || normalized.userId
   443	    || normalized.agentId
   444	    || normalized.sessionId
   445	    || normalized.sharedSpaceId
   446	  );
   447	}
   448	
   449	/**
   450	 * Build a reusable row predicate for scope filtering without re-normalizing each row scan.
   451	 *
   452	 * @param scope - Requested scope used for filtering.
   453	 * @param allowedSharedSpaceIds - Optional shared-space allowlist for the scope.
   454	 * @returns Predicate that returns `true` when a row remains visible.
   455	 */
   456	export function createScopeFilterPredicate<T extends Record<string, unknown>>(
   457	  scope: ScopeContext,
   458	  allowedSharedSpaceIds?: ReadonlySet<string>,
   459	): (row: T) => boolean {
   460	  const normalized = normalizeScopeContext(scope);
   461	  if (!isScopeEnforcementEnabled() && !hasScopeConstraints(normalized)) {
   462	    return () => true;
   463	  }
   464	  if (isScopeEnforcementEnabled() && !hasScopeConstraints(normalized)) {
   465	    // BUG-001 fix: Empty scope under enforcement means no access, not universal access.
   466	    return () => false;
   467	  }
   468	
   469	  return (row: T) => {
   470	    const rowSharedSpaceId = normalizeId(row.shared_space_id);
   471	    if (rowSharedSpaceId) {
   472	      if (normalized.sharedSpaceId && rowSharedSpaceId !== normalized.sharedSpaceId) {
   473	        return false;
   474	      }
   475	      if (allowedSharedSpaceIds && !allowedSharedSpaceIds.has(rowSharedSpaceId)) {
   476	        return false;
   477	      }
   478	    } else if (normalized.sharedSpaceId) {
   479	      return false;
   480	    }
   481	
   482	    // H8 FIX: When a row belongs to an allowed shared space, use membership as
   483	    // the access boundary — don't require exact actor/session match, which would
   484	    // block collaborator B from seeing collaborator A's shared memories.
   485	    if (rowSharedSpaceId && allowedSharedSpaceIds?.has(rowSharedSpaceId)) {
   486	      return matchesExactScope(row.tenant_id, normalized.tenantId);
   487	    }
   488	
   489	    return matchesExactScope(row.tenant_id, normalized.tenantId)
   490	      && matchesExactScope(row.user_id, normalized.userId)
   491	      && matchesExactScope(row.agent_id, normalized.agentId)
   492	      && matchesExactScope(row.session_id, normalized.sessionId);
   493	  };
   494	}
   495	
   496	/**
   497	 * Review governance audit rows and aggregate counts for a filtered governance window.
   498	 *
   499	 * @param database - Database connection that stores governance state.
   500	 * @param filters - Optional audit filters and row limit.
   501	 * @returns Review rows plus aggregate counts for the matching audit window.
   502	 */
   503	export function reviewGovernanceAudit(
   504	  database: Database.Database,
   505	  filters: GovernanceAuditReviewFilters = {},
   506	): GovernanceAuditReviewResult {
   507	  ensureGovernanceRuntime(database);
   508	  const allowUnscoped = filters.allowUnscoped === true;
   509	  // Security: audit enumeration requires explicit scope filters or admin override
   510	  if (!allowUnscoped && !hasGovernanceAuditFilters(filters)) {
   511	    console.warn('[scope-governance] Unscoped governance audit enumeration blocked; explicit filters or allowUnscoped=true required.');
   512	    return {
   513	      rows: [],
   514	      summary: {
   515	        totalMatching: 0,
   516	        returnedRows: 0,
   517	        byAction: {},
   518	        byDecision: {},
   519	        latestCreatedAt: null,
   520	      },

 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:66:    'DELETE FROM shared_space_conflicts WHERE existing_memory_id = ? OR incoming_memory_id = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:75:    'memory_conflicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:84:    'shared_space_conflicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:117:  'memory_conflicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:126:  'shared_space_conflicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:312:  'memory_conflicts', 'memory_corrections', 'memory_lineage', 'memory_history',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:322:  'governance_audit', 'shared_spaces', 'shared_space_members', 'shared_space_conflicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:726:  if (tableName === 'shared_space_conflicts') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:732:            SELECT * FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:740:            SELECT * FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:750:        'SELECT * FROM shared_space_conflicts WHERE space_id IN (__PLACEHOLDERS__)',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:754:    return hasScope ? [] : database.prepare('SELECT * FROM shared_space_conflicts').all() as Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:967:  if (tableName === 'shared_space_conflicts') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:63:  memory_conflicts: [
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:64:    'idx_conflicts_memory',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:65:    'idx_conflicts_timestamp',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:247:    CREATE TABLE IF NOT EXISTS memory_conflicts (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:273:    'idx_conflicts_memory',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:274:    'CREATE INDEX IF NOT EXISTS idx_conflicts_memory ON memory_conflicts(existing_memory_id)',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:279:    'idx_conflicts_timestamp',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:280:    'CREATE INDEX IF NOT EXISTS idx_conflicts_timestamp ON memory_conflicts(timestamp DESC)',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:299:  if (!hasTable(database, 'memory_conflicts')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:303:  const columns = new Set(getTableColumns(database, 'memory_conflicts'));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:308:  if (!hasTable(database, 'memory_conflicts')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:317:  database.exec('ALTER TABLE memory_conflicts RENAME TO memory_conflicts_legacy');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:320:  const legacyColumns = new Set(getTableColumns(database, 'memory_conflicts_legacy'));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:322:    INSERT INTO memory_conflicts (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:353:    FROM memory_conflicts_legacy
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:355:  database.exec('DROP TABLE memory_conflicts_legacy');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:358:    throw new Error('Migration v12: memory_conflicts table is still missing unified columns after rebuild');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:413:// V12: Unified memory_conflicts DDL (KL-1 Schema Unification)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:489:      logger.info('Migration v4: Ensured memory_conflicts table');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:683:      // V11 -> v12: Unify memory_conflicts DDL (KL-1 Schema Unification)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:685:      logger.info('Migration v12: Unified memory_conflicts table (KL-1)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:688:      logger.info('Migration v12: Created memory_conflicts indexes');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1504:    CREATE TABLE IF NOT EXISTS shared_space_conflicts (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1522:    CREATE INDEX IF NOT EXISTS idx_shared_space_conflicts_space
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1523:      ON shared_space_conflicts(space_id, created_at DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1552:    if (hasTable(database, 'memory_conflicts')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1553:      const existingColumns = new Set(getTableColumns(database, 'memory_conflicts'));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1556:        missingColumns.memory_conflicts = absentColumns;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1577:    if (!hasTable(database, 'memory_conflicts')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1578:      warnings.push('memory_conflicts table missing; conflict audit trail may be incomplete.');
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:11:  assertSharedSpaceAccess,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:19:import { recordGovernanceAudit } from '../lib/governance/scope-governance.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:290:  recordGovernanceAudit(database, {
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:405:function getAllowedSharedSpaceIdsForCaller(
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:483:          const access = assertSharedSpaceAccess(
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:658:      const access = assertSharedSpaceAccess(
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:762:      ? getAllowedSharedSpaceIdsForCaller(db, actor, args.tenantId)
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:904:- **Conflicts** — Concurrent edits produce append-version conflicts with automatic escalation to manual merge for repeat or high-risk cases.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:65: * Audit payload written for allow, deny, delete, and conflict events.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:69:  decision: 'allow' | 'deny' | 'delete' | 'conflict';
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:332:export function recordGovernanceAudit(database: Database.Database, entry: GovernanceAuditEntry): void {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:673:export function filterRowsByScope<T extends Record<string, unknown>>(rows: T[], scope: ScopeContext, allowedSharedSpaceIds?: ReadonlySet<string>): T[] {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '520,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   520	
   521	    const stmt = db.prepare(`
   522	      SELECT 1 FROM session_sent_memories
   523	      WHERE session_id = ? AND memory_hash = ?
   524	      LIMIT 1
   525	    `);
   526	    const exists = stmt.get(sessionId, hash);
   527	    return !exists;
   528	  } catch (error: unknown) {
   529	    const message = error instanceof Error ? error.message : String(error);
   530	    console.warn(`[session-manager] shouldSendMemory check failed: ${message}`);
   531	    return SESSION_CONFIG.dbUnavailableMode === 'allow';
   532	  }
   533	}
   534	
   535	function shouldSendMemoriesBatch(
   536	  sessionId: string,
   537	  memories: MemoryInput[],
   538	  markAsSent: boolean = false
   539	): Map<number, boolean> {
   540	  const result = new Map<number, boolean>();
   541	
   542	  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(memories)) {
   543	    memories.forEach((m) => {
   544	      if (m.id != null) {
   545	        result.set(m.id, true);
   546	      }
   547	    });
   548	    return result;
   549	  }
   550	
   551	  if (!db) {
   552	    const allow = SESSION_CONFIG.dbUnavailableMode === 'allow';
   553	    console.warn(`[session-manager] Database not initialized for batch dedup. dbUnavailableMode=${SESSION_CONFIG.dbUnavailableMode}. ${allow ? 'Allowing' : 'Blocking'} batch.`);
   554	    memories.forEach((m) => {
   555	      if (m.id != null) {
   556	        result.set(m.id, allow);
   557	      }
   558	    });
   559	    return result;
   560	  }
   561	
   562	  try {
   563	    const now = new Date().toISOString();
   564	    const existingStmt = db.prepare(`
   565	      SELECT memory_hash FROM session_sent_memories WHERE session_id = ?
   566	    `);
   567	    const insertStmt = db.prepare(`
   568	      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
   569	      VALUES (?, ?, ?, ?)
   570	    `);
   571	
   572	    const evaluateBatch = () => {
   573	      const existingRows = existingStmt.all(sessionId) as { memory_hash: string }[];
   574	      const existingHashes = new Set(existingRows.map((r) => r.memory_hash));
   575	
   576	      for (const memory of memories) {
   577	        const hash = generateMemoryHash(memory);
   578	        let shouldSend = !existingHashes.has(hash);
   579	        if (shouldSend && markAsSent) {
   580	          const insertResult = insertStmt.run(sessionId, hash, memory.id || null, now);
   581	          shouldSend = insertResult.changes > 0;
   582	        }
   583	        if (shouldSend) {
   584	          existingHashes.add(hash);
   585	        }
   586	        // Preserve first-occurrence decision for the same memory ID — prevents double-counting.
   587	        if (memory.id != null && !result.has(memory.id)) {
   588	          result.set(memory.id, shouldSend);
   589	        }
   590	      }
   591	
   592	      if (markAsSent) {
   593	        // Check + mark + cap enforcement stay in one transaction to avoid duplicate injection races.
   594	        enforceEntryLimit(sessionId);
   595	      }
   596	    };
   597	
   598	    if (markAsSent) {
   599	      const inTransaction = (db as unknown as { inTransaction?: boolean }).inTransaction === true;
   600	      if (inTransaction) {
   601	        evaluateBatch();
   602	      } else {
   603	        db.exec('BEGIN IMMEDIATE');
   604	        try {
   605	          evaluateBatch();
   606	          db.exec('COMMIT');
   607	        } catch (transactionError: unknown) {
   608	          try {
   609	            db.exec('ROLLBACK');
   610	          } catch {
   611	            // Ignore rollback errors after failed transaction.
   612	          }
   613	          throw transactionError;
   614	        }
   615	      }
   616	    } else {
   617	      evaluateBatch();
   618	    }
   619	
   620	    return result;

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '1628,1640p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1628	
  1629	    // Check SQLite version meets minimum requirement (3.35.0+)
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts | sed -n '1460,1515p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1460	    CREATE INDEX IF NOT EXISTS idx_governance_audit_scope
  1461	      ON governance_audit(tenant_id, user_id, agent_id, session_id, shared_space_id);
  1462	  `);
  1463	
  1464	  if (hasTable(database, 'memory_index')) {
  1465	    database.exec(`
  1466	      CREATE INDEX IF NOT EXISTS idx_memory_scope_hierarchy
  1467	        ON memory_index(tenant_id, user_id, agent_id, session_id, shared_space_id);
  1468	      CREATE INDEX IF NOT EXISTS idx_memory_retention_delete_after
  1469	        ON memory_index(delete_after);
  1470	    `);
  1471	  }
  1472	}
  1473	
  1474	export function ensureSharedSpaceTables(database: Database.Database): void {
  1475	  ensureGovernanceTables(database);
  1476	
  1477	  database.exec(`
  1478	    CREATE TABLE IF NOT EXISTS shared_spaces (
  1479	      space_id TEXT PRIMARY KEY,
  1480	      tenant_id TEXT NOT NULL,
  1481	      name TEXT NOT NULL,
  1482	      rollout_enabled INTEGER DEFAULT 0,
  1483	      rollout_cohort TEXT,
  1484	      kill_switch INTEGER DEFAULT 0,
  1485	      metadata TEXT,
  1486	      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  1487	      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  1488	    )
  1489	  `);
  1490	
  1491	  database.exec(`
  1492	    CREATE TABLE IF NOT EXISTS shared_space_members (
  1493	      space_id TEXT NOT NULL,
  1494	      subject_type TEXT NOT NULL CHECK(subject_type IN ('user', 'agent')),
  1495	      subject_id TEXT NOT NULL,
  1496	      role TEXT NOT NULL CHECK(role IN ('owner', 'editor', 'viewer')),
  1497	      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  1498	      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  1499	      PRIMARY KEY (space_id, subject_type, subject_id)
  1500	    )
  1501	  `);
  1502	
  1503	  database.exec(`
  1504	    CREATE TABLE IF NOT EXISTS shared_space_conflicts (
  1505	      id INTEGER PRIMARY KEY AUTOINCREMENT,
  1506	      space_id TEXT NOT NULL,
  1507	      logical_key TEXT NOT NULL,
  1508	      existing_memory_id INTEGER,
  1509	      incoming_memory_id INTEGER,
  1510	      strategy TEXT NOT NULL,
  1511	      actor TEXT NOT NULL,
  1512	      metadata TEXT,
  1513	      created_at TEXT DEFAULT CURRENT_TIMESTAMP
  1514	    )
  1515	  `);

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts | sed -n '640,760p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   640	    : 1;
   641	  const predicate = createScopeFilterPredicate(scope, options.allowedSharedSpaceIds);
   642	  let matchedRows = 0;
   643	  const startedAt = process.hrtime.bigint();
   644	
   645	  for (let iteration = 0; iteration < iterations; iteration += 1) {
   646	    matchedRows = 0;
   647	    for (const row of rows) {
   648	      if (predicate(row)) {
   649	        matchedRows += 1;
   650	      }
   651	    }
   652	  }
   653	
   654	  const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
   655	  return {
   656	    iterations,
   657	    totalRows: rows.length,
   658	    matchedRows,
   659	    filteredRows: rows.length - matchedRows,
   660	    elapsedMs,
   661	    averageMsPerIteration: elapsedMs / iterations,
   662	  };
   663	}
   664	
   665	/**
   666	 * Filter result rows to the tenant, actor, session, and shared-space scope in force.
   667	 *
   668	 * @param rows - Candidate rows that include governance scope columns.
   669	 * @param scope - Requested scope used for filtering.
   670	 * @param allowedSharedSpaceIds - Optional shared-space allowlist for the scope.
   671	 * @returns Rows that remain visible after governance filtering.
   672	 */
   673	export function filterRowsByScope<T extends Record<string, unknown>>(rows: T[], scope: ScopeContext, allowedSharedSpaceIds?: ReadonlySet<string>): T[] {
   674	  return rows.filter(createScopeFilterPredicate(scope, allowedSharedSpaceIds));
   675	}

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts | sed -n '400,430p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   400	  }
   401	  hasWarnedTrustedAdminIdentity = true;
   402	  console.warn('[shared-memory] Admin operation using caller-supplied identity — assumes trusted transport');
   403	}
   404	
   405	function getAllowedSharedSpaceIdsForCaller(
   406	  database: ReturnType<typeof requireDb>,
   407	  actor: SharedAdminActor,
   408	  tenantId?: string,
   409	): string[] {
   410	  if (!isSharedMemoryEnabled(database)) {
   411	    return [];
   412	  }
   413	
   414	  ensureSharedCollabRuntime(database);
   415	  const normalizedTenantId = typeof tenantId === 'string' && tenantId.trim().length > 0
   416	    ? tenantId.trim()
   417	    : null;
   418	
   419	  const rows = database.prepare(`
   420	    SELECT DISTINCT m.space_id
   421	    FROM shared_space_members m
   422	    JOIN shared_spaces s ON s.space_id = m.space_id
   423	    WHERE m.subject_type = ?
   424	      AND m.subject_id = ?
   425	      AND (? IS NULL OR s.tenant_id = ?)
   426	      AND s.kill_switch = 0
   427	      AND s.rollout_enabled = 1
   428	  `).all(
   429	    actor.subjectType,
   430	    actor.subjectId,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts | sed -n '220,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   220	  const existingStatus = existing?.embedding_status ?? null;
   221	  const isUnchangedEligible = existingStatus !== null && UNCHANGED_EMBEDDING_STATUSES.has(existingStatus);
   222	  const isMetadataEquivalent = existing
   223	    ? isSamePathMetadataEquivalent(existing, parsed)
   224	    : false;
   225	
   226	  // P1-4 FIX: Check content hash even during force reindex to prevent duplicate
   227	  // row accumulation. If content AND metadata are identical, the embedding would
   228	  // not change either, so re-indexing provides no value and creates duplicates.
   229	  if (existing && existing.content_hash === parsed.contentHash && isUnchangedEligible && isMetadataEquivalent) {
   230	    return {
   231	      status: 'unchanged',
   232	      id: existing.id,
   233	      specFolder: parsed.specFolder,
   234	      title: parsed.title ?? '',
   235	      triggerPhrases: parsed.triggerPhrases,
   236	      contextType: parsed.contextType,
   237	      importanceTier: parsed.importanceTier,
   238	      warnings,
   239	    };
   240	  }
   241	
   242	  return null;
   243	}
   244	
   245	export function checkContentHashDedup(
   246	  database: Database.Database,
   247	  parsed: ParsedMemory,
   248	  force: boolean,
   249	  warnings: string[] | undefined,
   250	  samePathExclusion?: SamePathDedupExclusion,
   251	  scope: MemoryScopeMatch = {},
   252	): IndexResult | null {
   253	  if (!force) {
   254	    const { clauses: scopeClauses, params: scopeParams } = buildScopedWhereClauses(scope);
   255	    const whereClauses = [
   256	      'spec_folder = ?',
   257	      'content_hash = ?',
   258	      'parent_id IS NULL',
   259	      'embedding_status IN (?, ?)',
   260	      ...scopeClauses,
   261	    ];
   262	    const duplicateParams: Array<string> = [
   263	      parsed.specFolder,
   264	      parsed.contentHash,
   265	      ...DEDUP_ELIGIBLE_EMBEDDING_STATUSES,
   266	      ...scopeParams,
   267	    ];
   268	
   269	    if (samePathExclusion) {
   270	      whereClauses.push('file_path != ?');
   271	      duplicateParams.push(samePathExclusion.filePath);
   272	      whereClauses.push('(canonical_file_path IS NULL OR canonical_file_path != ?)');
   273	      duplicateParams.push(samePathExclusion.canonicalFilePath);
   274	    }
   275	
   276	    const duplicateByHash = database.prepare(`
   277	      SELECT id, file_path, title, content_text
   278	      FROM memory_index
   279	      WHERE ${whereClauses.join('\n        AND ')}
   280	      ORDER BY id DESC
   281	      LIMIT 1
   282	    `).get(...duplicateParams) as DuplicateLookupRow | undefined;
   283	
   284	    if (duplicateByHash) {
   285	      const verifiedMatch = verifyStoredContentMatch(
   286	        duplicateByHash.content_text,
   287	        duplicateByHash.file_path,
   288	        parsed.content,
   289	      );
   290	      if (verifiedMatch === false) {
   291	        console.warn(`[memory-save] Hash match for memory #${duplicateByHash.id} failed secondary content verification; continuing save`);
   292	        return null;
   293	      }
   294	      console.error(`[memory-save] T054: Duplicate content detected (hash match id=${duplicateByHash.id}), skipping embedding`);
   295	      return {
   296	        status: 'duplicate',
   297	        id: duplicateByHash.id,
   298	        specFolder: parsed.specFolder,
   299	        title: parsed.title ?? duplicateByHash.title ?? '',
   300	        triggerPhrases: parsed.triggerPhrases,
   301	        contextType: parsed.contextType,
   302	        importanceTier: parsed.importanceTier,
   303	        warnings,
   304	        message: `Duplicate content detected: identical to existing memory #${duplicateByHash.id} (${duplicateByHash.file_path}). Skipping embedding generation.`,
   305	      };
   306	    }
   307	  }
   308	
   309	  return null;
   310	}

exec
/bin/zsh -lc 'rg -n "shared_space_conflicts|logical_key|append-version|manual merge|strategy TEXT NOT NULL|INSERT INTO shared_space_conflicts|DELETE FROM shared_space_conflicts" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:904:- **Conflicts** — Concurrent edits produce append-version conflicts with automatic escalation to manual merge for repeat or high-risk cases.
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:32:- Conflict handling defaults to append-version behavior, with escalation to manual merge for repeat or high-risk conflicts.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:101:    'logical_key',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:114:    'logical_key',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1295:      logical_key TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1306:      UNIQUE(logical_key, version_number)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1318:        logical_key TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1329:        UNIQUE(logical_key, version_number)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1332:        memory_id, logical_key, version_number, root_memory_id, predecessor_memory_id,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1336:        memory_id, logical_key, version_number, root_memory_id, predecessor_memory_id,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1346:        memory_id, logical_key, version_number, root_memory_id, predecessor_memory_id,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1350:        memory_id, logical_key, version_number, root_memory_id, predecessor_memory_id,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1358:      logical_key TEXT PRIMARY KEY,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1372:        logical_key TEXT PRIMARY KEY,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1377:      INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1378:      SELECT logical_key, root_memory_id, active_memory_id, updated_at
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1386:      INSERT OR IGNORE INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1387:      SELECT logical_key, root_memory_id, active_memory_id, updated_at
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1393:    CREATE INDEX IF NOT EXISTS idx_memory_lineage_logical_key
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1394:      ON memory_lineage(logical_key, version_number DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1400:      ON memory_lineage(logical_key, valid_from DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1445:      logical_key TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1504:    CREATE TABLE IF NOT EXISTS shared_space_conflicts (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1507:      logical_key TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1510:      strategy TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1522:    CREATE INDEX IF NOT EXISTS idx_shared_space_conflicts_space
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1523:      ON shared_space_conflicts(space_id, created_at DESC);
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:168:        logical_key TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:184:        logical_key TEXT PRIMARY KEY,
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:559:        WHERE logical_key = ?
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:66:    'DELETE FROM shared_space_conflicts WHERE existing_memory_id = ? OR incoming_memory_id = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:111:  // Evict any stale projection row that maps a *different* logical_key to the
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:113:  // when the logical_key changes (e.g. anchor or path normalization drift).
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:115:    'DELETE FROM active_memory_projection WHERE active_memory_id = ? AND logical_key != ?',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:118:    INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:120:    ON CONFLICT(logical_key) DO UPDATE SET
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:490:  it('records append-version conflicts in shared conflict and governance audit tables', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:511:      SELECT space_id, logical_key, existing_memory_id, incoming_memory_id, strategy, actor
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:512:      FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:516:      logical_key: 'roadmap:milestone',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:524:      SELECT action, decision, memory_id, logical_key, shared_space_id, reason
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:532:      logical_key: 'roadmap:milestone',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:538:  it('escalates repeat or high-risk conflicts to a manual merge strategy', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:574:      FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:766:      INSERT INTO shared_space_conflicts (
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:767:        space_id, logical_key, existing_memory_id, incoming_memory_id, strategy, actor, metadata
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:779:      INSERT INTO shared_space_conflicts (
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:780:        space_id, logical_key, existing_memory_id, incoming_memory_id, strategy, actor, metadata
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:49:      logical_key TEXT PRIMARY KEY,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:86:      INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:254:      SELECT logical_key, active_memory_id
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:257:      ORDER BY logical_key ASC
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:259:      logical_key: string;
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:267:    expect(projectionRows.map((row) => row.logical_key)).toEqual([
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:407:            logical_key TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:421:            logical_key TEXT PRIMARY KEY,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:84:    'shared_space_conflicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:126:  'shared_space_conflicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:322:  'governance_audit', 'shared_spaces', 'shared_space_members', 'shared_space_conflicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:726:  if (tableName === 'shared_space_conflicts') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:732:            SELECT * FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:740:            SELECT * FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:750:        'SELECT * FROM shared_space_conflicts WHERE space_id IN (__PLACEHOLDERS__)',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:754:    return hasScope ? [] : database.prepare('SELECT * FROM shared_space_conflicts').all() as Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:967:  if (tableName === 'shared_space_conflicts') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:49:  logical_key: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:63:  logical_key: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:291:    WHERE logical_key = ?
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:300:    WHERE logical_key = ?
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:320:    WHERE logical_key = ?
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:339:    && message.includes('memory_lineage.logical_key')
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:389:    logicalKey: row.logical_key,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:407:  // Evict any stale projection row that maps a *different* logical_key to the
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:409:  // when the logical_key changes (e.g. anchor or path normalization drift).
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:411:    'DELETE FROM active_memory_projection WHERE active_memory_id = ? AND logical_key != ?',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:414:    INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:416:    ON CONFLICT(logical_key) DO UPDATE SET
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:555:      logicalKey: existing.logical_key,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:622:        logical_key,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:696:          if (predecessor.logical_key !== rowLogicalKey) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:698:              `E_LINEAGE: predecessor ${predecessorMemoryId} logical identity ${predecessor.logical_key} ` +
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:702:          logicalKey = predecessor.logical_key;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:752:          logical_key,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:796:        `Retrying lineage insert for memory ${memoryId} after logical_key/version_number conflict ` +
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:829:    return row.logical_key;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:834:  return projection?.logical_key ?? buildLogicalKey(memoryRow);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1001:    SELECT logical_key, memory_id, predecessor_memory_id
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1005:  `).all() as Array<{ logical_key: string; memory_id: number; predecessor_memory_id: number }>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1010:      `Lineage ${issue.logical_key} version ${issue.memory_id} references missing predecessor ${issue.predecessor_memory_id}`,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1015:    SELECT logical_key, COUNT(*) AS total
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1018:    GROUP BY logical_key
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1020:  `).all() as Array<{ logical_key: string; total: number }>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1023:    duplicateActiveLogicalKeys.push(issue.logical_key);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1024:    issues.push(`Lineage ${issue.logical_key} has ${issue.total} active versions`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1028:    SELECT p.logical_key, p.active_memory_id
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1031:      ON l.logical_key = p.logical_key
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1034:  `).all() as Array<{ logical_key: string; active_memory_id: number }>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1037:    projectionMismatches.push(issue.logical_key);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1038:    issues.push(`Active projection ${issue.logical_key} points to non-active memory ${issue.active_memory_id}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1154:            logical_key,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1166:            logical_key = excluded.logical_key,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:121:        INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:337:      action, decision, memory_id, logical_key, tenant_id, user_id, agent_id, session_id,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:534:      logical_key,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:552:    logical_key: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:605:      logicalKey: row.logical_key,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:147:    FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:149:      AND logical_key = ?
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:271:    FROM shared_space_conflicts c
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:376:      COUNT(DISTINCT logical_key) AS distinct_logical_keys,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:378:    FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:385:    distinctLogicalKeys: (row as { distinct_logical_keys: number }).distinct_logical_keys,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:673: * Record an append-version conflict for shared-memory writes and audit it.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:695:      INSERT INTO shared_space_conflicts (
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:696:        space_id, logical_key, existing_memory_id, incoming_memory_id, strategy, actor, metadata
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:39:  'shared_space_conflicts',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:363:      id, action, decision, memory_id, logical_key, tenant_id, user_id, agent_id, session_id, shared_space_id, reason, metadata, created_at
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:378:    INSERT INTO shared_space_conflicts (
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:379:      id, space_id, logical_key, existing_memory_id, incoming_memory_id, strategy, actor, metadata, created_at
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store.vitest.ts:54:    INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:200:      WHERE logical_key IN (?, ?)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:457:        logical_key,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:472:      INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:673:      WHERE logical_key = ?

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts | sed -n '650,760p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   650	    ORDER BY CASE role
   651	      WHEN 'owner' THEN 1
   652	      WHEN 'editor' THEN 2
   653	      ELSE 3
   654	    END ASC
   655	    LIMIT 1
   656	  `).get(spaceId, normalizedScope.userId ?? '', normalizedScope.agentId ?? '') as { role?: SharedRole } | undefined;
   657	
   658	  const role = membership?.role;
   659	  if (!role) {
   660	    return deny('shared_space_membership_required');
   661	  }
   662	  if (requiredRole === 'owner' && role !== 'owner') {
   663	    return deny('shared_space_owner_required', { resolvedRole: role });
   664	  }
   665	  if (requiredRole === 'editor' && role === 'viewer') {
   666	    return deny('shared_space_editor_required', { resolvedRole: role });
   667	  }
   668	
   669	  return allow({ resolvedRole: role });
   670	}
   671	
   672	/**
   673	 * Record an append-version conflict for shared-memory writes and audit it.
   674	 *
   675	 * @param database - Database connection that stores shared-space state.
   676	 * @param args - Conflict details used for shared and governance audits.
   677	 */
   678	export function recordSharedConflict(
   679	  database: Database.Database,
   680	  args: {
   681	    spaceId: string;
   682	    logicalKey: string;
   683	    existingMemoryId: number | null;
   684	    incomingMemoryId: number;
   685	    actor: string;
   686	    metadata?: Record<string, unknown>;
   687	  }
   688	): void {
   689	  ensureSharedCollabRuntime(database);
   690	  // Use an IMMEDIATE transaction so concurrent writers cannot observe the same
   691	  // prior conflict count between strategy resolution and the insert/audit write.
   692	  const recordConflictTx = database.transaction(() => {
   693	    const resolved = resolveSharedConflictStrategy(database, args);
   694	    database.prepare(`
   695	      INSERT INTO shared_space_conflicts (
   696	        space_id, logical_key, existing_memory_id, incoming_memory_id, strategy, actor, metadata
   697	      ) VALUES (?, ?, ?, ?, ?, ?, ?)
   698	    `).run(
   699	      args.spaceId,
   700	      args.logicalKey,
   701	      args.existingMemoryId,
   702	      args.incomingMemoryId,
   703	      resolved.strategy,
   704	      args.actor,
   705	      resolved.metadata ? JSON.stringify(resolved.metadata) : null,
   706	    );
   707	
   708	    recordGovernanceAudit(database, {
   709	      action: 'shared_conflict',
   710	      decision: 'conflict',
   711	      memoryId: args.incomingMemoryId,
   712	      logicalKey: args.logicalKey,
   713	      sharedSpaceId: args.spaceId,
   714	      reason: resolved.strategy,
   715	      metadata: resolved.metadata,
   716	    });
   717	  });
   718	  recordConflictTx.immediate();
   719	}

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts | sed -n '490,590p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts | sed -n '680,820p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   490	  it('records append-version conflicts in shared conflict and governance audit tables', () => {
   491	    process.env.SPECKIT_MEMORY_SHARED_MEMORY = 'true';
   492	    const db = new Database(':memory:');
   493	
   494	    upsertSharedSpace(db, {
   495	      spaceId: 'space-4',
   496	      tenantId: 'tenant-a',
   497	      name: 'Delta',
   498	      rolloutEnabled: true,
   499	    });
   500	
   501	    recordSharedConflict(db, {
   502	      spaceId: 'space-4',
   503	      logicalKey: 'roadmap:milestone',
   504	      existingMemoryId: 10,
   505	      incomingMemoryId: 11,
   506	      actor: 'user-4',
   507	      metadata: { strategy: 'append_version', conflictKind: 'concurrent_edit' },
   508	    });
   509	
   510	    expect(db.prepare(`
   511	      SELECT space_id, logical_key, existing_memory_id, incoming_memory_id, strategy, actor
   512	      FROM shared_space_conflicts
   513	      LIMIT 1
   514	    `).get()).toEqual({
   515	      space_id: 'space-4',
   516	      logical_key: 'roadmap:milestone',
   517	      existing_memory_id: 10,
   518	      incoming_memory_id: 11,
   519	      strategy: 'append_version',
   520	      actor: 'user-4',
   521	    });
   522	
   523	    expect(db.prepare(`
   524	      SELECT action, decision, memory_id, logical_key, shared_space_id, reason
   525	      FROM governance_audit
   526	      ORDER BY id DESC
   527	      LIMIT 1
   528	    `).get()).toEqual({
   529	      action: 'shared_conflict',
   530	      decision: 'conflict',
   531	      memory_id: 11,
   532	      logical_key: 'roadmap:milestone',
   533	      shared_space_id: 'space-4',
   534	      reason: 'append_version',
   535	    });
   536	  });
   537	
   538	  it('escalates repeat or high-risk conflicts to a manual merge strategy', () => {
   539	    process.env.SPECKIT_MEMORY_SHARED_MEMORY = 'true';
   540	    const db = new Database(':memory:');
   541	
   542	    upsertSharedSpace(db, {
   543	      spaceId: 'space-4b',
   544	      tenantId: 'tenant-a',
   545	      name: 'Delta Escalation',
   546	      rolloutEnabled: true,
   547	    });
   548	
   549	    recordSharedConflict(db, {
   550	      spaceId: 'space-4b',
   551	      logicalKey: 'roadmap:shared-doc',
   552	      existingMemoryId: 40,
   553	      incomingMemoryId: 41,
   554	      actor: 'user-4b',
   555	    });
   556	    recordSharedConflict(db, {
   557	      spaceId: 'space-4b',
   558	      logicalKey: 'roadmap:shared-doc',
   559	      existingMemoryId: 41,
   560	      incomingMemoryId: 42,
   561	      actor: 'user-4b',
   562	    });
   563	    recordSharedConflict(db, {
   564	      spaceId: 'space-4b',
   565	      logicalKey: 'roadmap:critical-doc',
   566	      existingMemoryId: 42,
   567	      incomingMemoryId: 43,
   568	      actor: 'user-4b',
   569	      metadata: { conflictKind: 'schema_mismatch' },
   570	    });
   571	
   572	    expect(db.prepare(`
   573	      SELECT strategy, metadata
   574	      FROM shared_space_conflicts
   575	      WHERE space_id = ?
   576	      ORDER BY id ASC
   577	    `).all('space-4b')).toEqual([
   578	      {
   579	        strategy: 'append_version',
   580	        metadata: JSON.stringify({
   581	          strategy: 'append_version',
   582	          strategyReason: 'default_append_only',
   583	          priorConflictCount: 0,
   584	        }),
   585	      },
   586	      {
   587	        strategy: 'manual_merge',
   588	        metadata: JSON.stringify({
   589	          strategy: 'manual_merge',
   590	          strategyReason: 'repeat_conflict',

 succeeded in 0ms:
   680	      const row = getMemoryRow(database, memoryId);
   681	      const rowLogicalKey = buildLogicalKey(row);
   682	      const actor = options.actor ?? 'system';
   683	      const transitionEvent = options.transitionEvent ?? 'CREATE';
   684	      const historyEvents = options.historyEvents ?? getSafeHistoryEvents(database, memoryId);
   685	      const predecessorMemoryId = options.predecessorMemoryId ?? null;
   686	      const validFrom = options.validFrom ?? normalizeTimestamp(row.updated_at ?? row.created_at);
   687	
   688	      let logicalKey = rowLogicalKey;
   689	      let rootMemoryId = memoryId;
   690	      let versionNumber = 1;
   691	      let predecessor: LineageRow | null = null;
   692	
   693	      if (predecessorMemoryId != null) {
   694	        predecessor = getLineageRow(database, predecessorMemoryId);
   695	        if (predecessor) {
   696	          if (predecessor.logical_key !== rowLogicalKey) {
   697	            throw new Error(
   698	              `E_LINEAGE: predecessor ${predecessorMemoryId} logical identity ${predecessor.logical_key} ` +
   699	              `does not match memory ${memoryId} logical identity ${rowLogicalKey}`,
   700	            );
   701	          }
   702	          logicalKey = predecessor.logical_key;
   703	          rootMemoryId = predecessor.root_memory_id;
   704	          versionNumber = predecessor.version_number + 1;
   705	        } else {
   706	          const seeded = seedLineageFromCurrentState(database, predecessorMemoryId, {
   707	            actor,
   708	            transitionEvent: 'BACKFILL',
   709	          });
   710	          if (seeded.logicalKey !== rowLogicalKey) {
   711	            throw new Error(
   712	              `E_LINEAGE: predecessor ${predecessorMemoryId} logical identity ${seeded.logicalKey} ` +
   713	              `does not match memory ${memoryId} logical identity ${rowLogicalKey}`,
   714	            );
   715	          }
   716	          logicalKey = seeded.logicalKey;
   717	          rootMemoryId = seeded.rootMemoryId;
   718	          versionNumber = seeded.versionNumber + 1;
   719	          predecessor = getLineageRow(database, predecessorMemoryId);
   720	        }
   721	      }
   722	
   723	      if (attempt > 0) {
   724	        const latest = getLatestLineageRowForLogicalKey(database, logicalKey);
   725	        if (latest) {
   726	          rootMemoryId = latest.root_memory_id;
   727	          versionNumber = latest.version_number + 1;
   728	        }
   729	      }
   730	
   731	      validateTransitionInput(transitionEvent, predecessorMemoryId, validFrom, predecessor);
   732	
   733	      if (predecessorMemoryId != null) {
   734	        if (predecessor && predecessor.valid_to) {
   735	          logger.warn(
   736	            `Predecessor ${predecessorMemoryId} already superseded (valid_to: ${predecessor.valid_to}). ` +
   737	            'COALESCE will preserve the existing valid_to.',
   738	          );
   739	        }
   740	        database.prepare(`
   741	          UPDATE memory_lineage
   742	          SET valid_to = COALESCE(valid_to, ?),
   743	              superseded_by_memory_id = COALESCE(superseded_by_memory_id, ?)
   744	          WHERE memory_id = ?
   745	        `).run(validFrom, memoryId, predecessorMemoryId);
   746	        markHistoricalPredecessor(database, predecessorMemoryId, validFrom);
   747	      }
   748	
   749	      database.prepare(`
   750	        INSERT INTO memory_lineage (
   751	          memory_id,
   752	          logical_key,
   753	          version_number,
   754	          root_memory_id,
   755	          predecessor_memory_id,
   756	          superseded_by_memory_id,
   757	          valid_from,
   758	          valid_to,
   759	          transition_event,
   760	          actor,
   761	          metadata
   762	        ) VALUES (?, ?, ?, ?, ?, NULL, ?, NULL, ?, ?, ?)
   763	      `).run(
   764	        memoryId,
   765	        logicalKey,
   766	        versionNumber,
   767	        rootMemoryId,
   768	        predecessorMemoryId,
   769	        validFrom,
   770	        transitionEvent,
   771	        actor,
   772	        buildMetadata(row, actor, historyEvents),
   773	      );
   774	
   775	      upsertActiveProjection(database, logicalKey, rootMemoryId, memoryId, validFrom);
   776	
   777	      return {
   778	        logicalKey,
   779	        versionNumber,
   780	        rootMemoryId,
   781	        activeMemoryId: memoryId,
   782	        predecessorMemoryId,
   783	        transitionEvent,
   784	      } as RecordedLineageTransition;
   785	    });
   786	
   787	    try {
   788	      return recordTransitionTx();
   789	    } catch (error: unknown) {
   790	      const shouldRetry = isLogicalVersionConflict(error) && attempt < MAX_LINEAGE_VERSION_RETRIES;
   791	      if (!shouldRetry) {
   792	        throw error;
   793	      }
   794	
   795	      logger.warn(
   796	        `Retrying lineage insert for memory ${memoryId} after logical_key/version_number conflict ` +
   797	        `(attempt ${attempt + 1}/${MAX_LINEAGE_VERSION_RETRIES})`,
   798	      );
   799	    }
   800	  }
   801	
   802	  throw new Error(`E_LINEAGE: exhausted retries while recording lineage for memory ${memoryId}`);
   803	}
   804	
   805	/**
   806	 * Create a new append-only memory row and wire it into lineage state.
   807	 *
   808	 * @param params - Parsed memory payload and append-only lineage metadata.
   809	 * @returns Identifier of the newly inserted memory row.
   810	 */
   811	export function createAppendOnlyMemoryRecord(params: CreateAppendOnlyMemoryRecordParams): number {
   812	  bindHistory(params.database);
   813	  const appendTx = params.database.transaction(() => {
   814	    const memoryId = insertAppendOnlyMemoryIndexRow(params);
   815	    recordLineageTransition(params.database, memoryId, {
   816	      actor: params.actor ?? 'mcp:memory_save',
   817	      predecessorMemoryId: params.predecessorMemoryId,
   818	      transitionEvent: 'SUPERSEDE',
   819	    });
   820	    return memoryId;

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts | sed -n '56,80p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    56	  }
    57	}
    58	
    59	function deleteAncillaryMemoryRows(database: Database.Database, id: number): void {
    60	  const ancillaryTables = [
    61	    'DELETE FROM degree_snapshots WHERE memory_id = ?',
    62	    'DELETE FROM community_assignments WHERE memory_id = ?',
    63	    'DELETE FROM memory_summaries WHERE memory_id = ?',
    64	    'DELETE FROM memory_entities WHERE memory_id = ?',
    65	    'DELETE FROM memory_lineage WHERE memory_id = ?',
    66	    'DELETE FROM shared_space_conflicts WHERE existing_memory_id = ? OR incoming_memory_id = ?',
    67	  ];
    68	
    69	  for (const sql of ancillaryTables) {
    70	    try {
    71	      const paramCount = (sql.match(/\?/g) || []).length;
    72	      if (paramCount === 2) {
    73	        database.prepare(sql).run(id, id);
    74	      } else {
    75	        database.prepare(sql).run(id);
    76	      }
    77	    } catch (_error: unknown) {
    78	      // Best-effort for legacy databases that may not have these tables yet.
    79	    }
    80	  }

exec
/bin/zsh -lc 'rg -n "resolveSharedConflictStrategy|function assertSharedSpaceAccess|export function assertSharedSpaceAccess|shared_space_membership_required|manual_merge|append_version|high_risk" .opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
100:  'append_version',
101:  'manual_merge',
135:function resolveSharedConflictStrategy(
155:      ? 'manual_merge'
157:        ? 'manual_merge'
158:        : 'append_version');
162:      ? `high_risk:${conflictKind}`
555:export function assertSharedSpaceAccess(
634:    return deny('shared_space_membership_required');
660:    return deny('shared_space_membership_required');
693:    const resolved = resolveSharedConflictStrategy(database, args);

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts | sed -n '540,700p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   540	    }
   541	  }
   542	
   543	  return ids;
   544	}
   545	
   546	/**
   547	 * Enforce rollout, tenancy, and membership rules for shared-space access.
   548	 *
   549	 * @param database - Database connection that stores shared-space state.
   550	 * @param scope - Scope requesting shared-space access.
   551	 * @param spaceId - Shared-space identifier to validate.
   552	 * @param requiredRole - Minimum role required for the attempted action.
   553	 * @returns Allow or deny decision with a failure reason when blocked.
   554	 */
   555	export function assertSharedSpaceAccess(
   556	  database: Database.Database,
   557	  scope: ScopeContext,
   558	  spaceId: string,
   559	  requiredRole: SharedRole = 'viewer',
   560	): { allowed: boolean; reason?: string } {
   561	  const normalizedScope = normalizeScopeContext(scope);
   562	  const auditAccessDecision = (
   563	    decision: 'allow' | 'deny',
   564	    reason: string,
   565	    metadata?: Record<string, unknown>,
   566	  ): void => {
   567	    try {
   568	      recordGovernanceAudit(database, {
   569	        action: 'shared_space_access',
   570	        decision,
   571	        reason,
   572	        tenantId: normalizedScope.tenantId,
   573	        userId: normalizedScope.userId,
   574	        agentId: normalizedScope.agentId,
   575	        sessionId: normalizedScope.sessionId,
   576	        sharedSpaceId: spaceId,
   577	        metadata: {
   578	          requiredRole,
   579	          ...(metadata ?? {}),
   580	        },
   581	      });
   582	    } catch (error: unknown) {
   583	      const message = error instanceof Error ? error.message : String(error);
   584	      console.error(`[shared-spaces] Failed to record shared_space_access audit: ${message}`);
   585	    }
   586	  };
   587	  const deny = (reason: string, metadata?: Record<string, unknown>): { allowed: false; reason: string } => {
   588	    auditAccessDecision('deny', reason, metadata);
   589	    return { allowed: false, reason };
   590	  };
   591	  const allow = (metadata?: Record<string, unknown>): { allowed: true } => {
   592	    auditAccessDecision('allow', 'membership_verified', metadata);
   593	    return { allowed: true };
   594	  };
   595	
   596	  if (!spaceId?.trim()) {
   597	    return deny('shared_space_id_required');
   598	  }
   599	
   600	  ensureSharedCollabRuntime(database);
   601	
   602	  if (!isSharedMemoryEnabled(database)) {
   603	    return deny('shared_memory_disabled');
   604	  }
   605	
   606	  const space = database.prepare(`
   607	    SELECT tenant_id, rollout_enabled, kill_switch
   608	    FROM shared_spaces
   609	    WHERE space_id = ?
   610	  `).get(spaceId) as { tenant_id?: string; rollout_enabled?: number; kill_switch?: number } | undefined;
   611	
   612	  if (!space) {
   613	    return deny('shared_space_not_found');
   614	  }
   615	  if (normalizedScope.tenantId && space.tenant_id !== normalizedScope.tenantId) {
   616	    return deny('shared_space_tenant_mismatch', {
   617	      spaceTenantId: space.tenant_id ?? null,
   618	    });
   619	  }
   620	  if (isGovernanceGuardrailsEnabled() && !normalizedScope.tenantId) {
   621	    return deny('shared_space_tenant_required');
   622	  }
   623	
   624	  const bypassAvailabilityChecks = requiredRole === 'owner';
   625	  if (!bypassAvailabilityChecks && space.kill_switch === 1) {
   626	    return deny('shared_space_kill_switch');
   627	  }
   628	  if (!bypassAvailabilityChecks && space.rollout_enabled !== 1) {
   629	    return deny('shared_space_rollout_disabled');
   630	  }
   631	
   632	  const allowed = getAllowedSharedSpaceIds(database, normalizedScope);
   633	  if (!allowed.has(spaceId) && !bypassAvailabilityChecks) {
   634	    return deny('shared_space_membership_required');
   635	  }
   636	
   637	  if (requiredRole === 'viewer') {
   638	    return allow();
   639	  }
   640	
   641	  const membership = database.prepare(`
   642	    SELECT role
   643	    FROM shared_space_members
   644	    WHERE space_id = ?
   645	      AND (
   646	        (subject_type = 'user' AND subject_id = ?)
   647	        OR
   648	        (subject_type = 'agent' AND subject_id = ?)
   649	      )
   650	    ORDER BY CASE role
   651	      WHEN 'owner' THEN 1
   652	      WHEN 'editor' THEN 2
   653	      ELSE 3
   654	    END ASC
   655	    LIMIT 1
   656	  `).get(spaceId, normalizedScope.userId ?? '', normalizedScope.agentId ?? '') as { role?: SharedRole } | undefined;
   657	
   658	  const role = membership?.role;
   659	  if (!role) {
   660	    return deny('shared_space_membership_required');
   661	  }
   662	  if (requiredRole === 'owner' && role !== 'owner') {
   663	    return deny('shared_space_owner_required', { resolvedRole: role });
   664	  }
   665	  if (requiredRole === 'editor' && role === 'viewer') {
   666	    return deny('shared_space_editor_required', { resolvedRole: role });
   667	  }
   668	
   669	  return allow({ resolvedRole: role });
   670	}
   671	
   672	/**
   673	 * Record an append-version conflict for shared-memory writes and audit it.
   674	 *
   675	 * @param database - Database connection that stores shared-space state.
   676	 * @param args - Conflict details used for shared and governance audits.
   677	 */
   678	export function recordSharedConflict(
   679	  database: Database.Database,
   680	  args: {
   681	    spaceId: string;
   682	    logicalKey: string;
   683	    existingMemoryId: number | null;
   684	    incomingMemoryId: number;
   685	    actor: string;
   686	    metadata?: Record<string, unknown>;
   687	  }
   688	): void {
   689	  ensureSharedCollabRuntime(database);
   690	  // Use an IMMEDIATE transaction so concurrent writers cannot observe the same
   691	  // prior conflict count between strategy resolution and the insert/audit write.
   692	  const recordConflictTx = database.transaction(() => {
   693	    const resolved = resolveSharedConflictStrategy(database, args);
   694	    database.prepare(`
   695	      INSERT INTO shared_space_conflicts (
   696	        space_id, logical_key, existing_memory_id, incoming_memory_id, strategy, actor, metadata
   697	      ) VALUES (?, ?, ?, ?, ?, ?, ?)
   698	    `).run(
   699	      args.spaceId,
   700	      args.logicalKey,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts | sed -n '120,190p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   120	}
   121	
   122	function normalizeExplicitStrategy(metadata: Record<string, unknown> | undefined): string | null {
   123	  const value = metadata?.strategy;
   124	  if (typeof value !== 'string') return null;
   125	  const normalized = value.trim().toLowerCase();
   126	  if (normalized.length === 0) return null;
   127	  // R8: Validate strategy against known union type.
   128	  if (!VALID_CONFLICT_STRATEGIES.has(normalized)) {
   129	    console.warn(`[shared-spaces] Unknown conflict strategy "${normalized}", ignoring explicit override`);
   130	    return null;
   131	  }
   132	  return normalized;
   133	}
   134	
   135	function resolveSharedConflictStrategy(
   136	  database: Database.Database,
   137	  args: {
   138	    spaceId: string;
   139	    logicalKey: string;
   140	    metadata?: Record<string, unknown>;
   141	  },
   142	): { strategy: string; metadata: Record<string, unknown> | null } {
   143	  const explicitStrategy = normalizeExplicitStrategy(args.metadata);
   144	  const conflictKind = normalizeConflictKind(args.metadata);
   145	  const priorConflictsRow = database.prepare(`
   146	    SELECT COUNT(*) AS count
   147	    FROM shared_space_conflicts
   148	    WHERE space_id = ?
   149	      AND logical_key = ?
   150	  `).get(args.spaceId, args.logicalKey) as { count?: number } | undefined;
   151	  const priorConflicts = typeof priorConflictsRow?.count === 'number' ? priorConflictsRow.count : 0;
   152	
   153	  const strategy = explicitStrategy
   154	    ?? (HIGH_RISK_CONFLICT_KINDS.has(conflictKind ?? '')
   155	      ? 'manual_merge'
   156	      : priorConflicts > 0
   157	        ? 'manual_merge'
   158	        : 'append_version');
   159	  const strategyReason = explicitStrategy
   160	    ? 'explicit_metadata'
   161	    : HIGH_RISK_CONFLICT_KINDS.has(conflictKind ?? '')
   162	      ? `high_risk:${conflictKind}`
   163	      : priorConflicts > 0
   164	        ? 'repeat_conflict'
   165	        : 'default_append_only';
   166	
   167	  return {
   168	    strategy,
   169	    metadata: {
   170	      ...(args.metadata ?? {}),
   171	      strategy,
   172	      strategyReason,
   173	      priorConflictCount: priorConflicts,
   174	    },
   175	  };
   176	}
   177	
   178	/**
   179	 * Resolve whether shared-memory rollout is enabled for the process.
   180	 *
   181	 * Tier 1: Env var override (highest priority) — `SPECKIT_MEMORY_SHARED_MEMORY` or `SPECKIT_HYDRA_SHARED_MEMORY`.
   182	 * Tier 2: Database config persistence — `shared_memory_enabled` key in `config` table.
   183	 * Default: OFF (requires explicit enablement via env var or first-run setup).
   184	 *
   185	 * @param database - Optional database to check for persisted enablement state.
   186	 * @returns `true` when shared-memory access is allowed at runtime.
   187	 */
   188	export function isSharedMemoryEnabled(database?: Database.Database): boolean {
   189	  // B1: Tier 1 env var override — honor explicit 'false' to disable.
   190	  const envRaw = (process.env['SPECKIT_MEMORY_SHARED_MEMORY'] ?? process.env['SPECKIT_HYDRA_SHARED_MEMORY'])?.trim().toLowerCase();

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | sed -n '1148,1188p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
I’ve found the clearest safety contrast. Mnemosyne’s isolation model is just “project basename vs global,” while Spec Kit Memory treats scope as first-class metadata and enforces tenant, actor, session, and shared-space boundaries at both save-time and retrieval-time. I’m pulling the final line references from the external wrapper now so the findings stay tightly evidenced instead of generic.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md | sed -n '1,140p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/plugins/spec-kit-compact-code-graph.js | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc 'rg -n "compacting|session_resume|session_bootstrap|resume-mode|minimal" .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:90:  minimal?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:409:  // ── Sub-call 1: Memory context resume (skip in minimal mode) ──
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:411:  if (args.minimal) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:412:    memoryResult = { skipped: true, reason: 'minimal mode' };
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:491:  if (args.minimal) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:499:  const memoryCertainty: SharedPayloadCertainty = args.minimal
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:600:  if (!args.minimal) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:4:// Phase 024 / Item 7: Composite tool that runs session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:102:    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:114:    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:155:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163:/** Handle session_bootstrap tool call — one-call session setup */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168:  // Sub-call 1: session_resume with full resume payload
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:179:    allHints.push('session_resume failed. Try calling it manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:236:    { label: 'session_bootstrap structural context payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:243:      { label: 'session_bootstrap resume payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '1572,1584p;1822,1828p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1572	- symptom: stale references remain after script pass; cause: sibling docs/playbooks not covered; fix: run broader `rg` sweep and patch stragglers [Task 2]
  1573	- symptom: validator reports template debt after renumber; cause: pre-existing template issues; fix: track separately from rename regression [Task 1][Task 3]
  1574	- symptom: strict validate fails on SPEC_DOC_INTEGRITY despite accurate prose; cause: referenced files are missing/unresolvable from packet scope; fix: either provide in-scope files or relink to resolvable artifacts [Task 4]
  1575	
  1576	# Task Group: Governed Retrieval, Memory Health Safety, and Hybrid Runtime Audit
  1577	scope: governed retrieval scope propagation, shared-space authorization contracts, memory health auto-repair safety, hybrid runtime audits, and handler-level envelope/graph-signal guards
  1578	applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit; reuse_rule=reuse for MCP/runtime governance fixes in this repo, but rerun targeted tests because handler behavior is time-sensitive
  1579	
  1580	## Task 1: Governed retrieval/shared-space admin hardening and graph ranking fix
  1581	
  1582	### rollout_summary_files
  1583	
  1584	- rollout_summaries/2026-03-20T15-43-19-Q1K1-hydra_governed_retrieval_specs.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/20/rollout-2026-03-20T16-43-19-019d0bea-55b4-7ec0-a57a-2a3c9f459fc9.jsonl, updated_at=2026-03-20T17:13:21+00:00, thread_id=019d0bea-55b4-7ec0-a57a-2a3c9f459fc9)
  1822	
  1823	- Level-3 Hydra packets need AI protocol sections, anchors, `SPECKIT_TEMPLATE_SOURCE`, and `[EVIDENCE: ...]` tags on completed P0/P1 checklist rows for clean recursive validation [Task 1][Task 5]
  1824	- For phase-sliced completion, convert future-phase rows into explicit deferrals (`[deferred: Phase N follow-up]`) so Phase-1 can close without pretending later phases shipped [Task 2]
  1825	- `generate-context.js` succeeds in manual/headless runs when passed JSON-mode session data (`SPEC_FOLDER`, `recent_context`, `observations`, `user_prompts`) plus absolute spec path [Task 2]
  1826	- Governance hardening in this wave centered on guaranteed session/tenant enforcement in `filterRowsByScope`, shared-space authorization, and scoped retention sweep deletions [Task 3]
  1827	- Hydra comment quality standard: exported interfaces/functions must carry purposeful TSDoc plus traceable reference tags (`T###`, `REQ-###`, `BUG-###`, `CHK-###`) [Task 4]
  1828	

codex
# Iteration 025: MULTI-AGENT MEMORY SAFETY

## Focus
MULTI-AGENT MEMORY SAFETY: How does this system handle concurrent agent access, merge conflicts, project isolation, and shared vs private memory scoping?

## Findings
### Finding 1: Mnemosyne’s project/global split is ergonomic, but it is not a safe isolation model
- **Source**: [external/src/index.ts:28](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L28), [external/src/index.ts:30](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L30), [external/src/index.ts:81](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L81), [external/README.md:51](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L51)
- **Evidence type**: both
- **What it does**: the wrapper derives the project collection from the current directory basename, auto-inits that collection on load, and exposes a separate `--global` collection. There is no wrapper-visible tenant, user, agent, session, or membership boundary.
- **Why it matters**: this is fine for solo convenience, but unsafe as a concurrency boundary. Two unrelated worktrees with the same basename collide, and multiple agents in one repo implicitly share the same project bucket.
- **Recommendation**: reject
- **Affected subsystem**: future plugin-facing scope model
- **Impact**: high

### Finding 2: Mnemosyne exposes no plugin-level merge or conflict protocol; contradiction handling is left to the agent
- **Source**: [external/src/index.ts:147](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L147), [external/src/index.ts:193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L193), [external/src/index.ts:210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [external/README.md:69](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L69)
- **Evidence type**: both
- **What it does**: the wrapper offers `add`, `search`, and `delete` surfaces, and the compaction hook reminds the agent to delete contradicted memories. I found no wrapper-visible append-version, merge queue, conflict audit, or collaborator-aware resolution path.
- **Why it matters**: for concurrent agents, “delete the old one and write the new one” is not a safety model. It loses lineage and turns race conditions into silent last-writer-wins behavior unless the unseen backend adds protections the plugin repo does not prove.
- **Recommendation**: prototype later
- **Affected subsystem**: any future OpenCode memory wrapper for shared/collaborative writes
- **Impact**: high

### Finding 3: Spec Kit Memory already has a real shared-conflict model with escalation, auditability, and append-only fallback
- **Source**: [shared-spaces.ts:135](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L135), [shared-spaces.ts:153](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L153), [shared-spaces.ts:678](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L678), [shared-spaces.ts:718](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L718), [shared-spaces.vitest.ts:490](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts#L490), [shared-spaces.vitest.ts:538](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts#L538)
- **Evidence type**: both
- **What it does**: Public records shared-memory conflicts in `shared_space_conflicts`, defaults first conflicts to `append_version`, escalates repeat or high-risk conflicts to `manual_merge`, and mirrors the event into governance audit. The conflict write runs as an `immediate()` transaction specifically to prevent concurrent writers from seeing the same prior conflict count.
- **Why it matters**: this is the concrete multi-agent safety mechanism Mnemosyne’s wrapper lacks. Public preserves history instead of forcing overwrite/delete decisions during contention.
- **Recommendation**: adopt now
- **Affected subsystem**: shared-memory collaboration and conflict hygiene
- **Impact**: high

### Finding 4: Public’s private vs shared scoping is first-class and enforced at both save-time and retrieval-time
- **Source**: [scope-governance.ts:456](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L456), [scope-governance.ts:482](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L482), [memory-save.ts:1164](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1164), [shared-spaces.ts:555](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L555), [create-record.ts:108](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L108)
- **Evidence type**: wrapper-confirmed
- **What it does**: saves and reads carry `tenantId`, `userId`, `agentId`, `sessionId`, and `sharedSpaceId`; shared rows use membership as the visibility boundary; shared saves require editor access; same-path dedup and existing-row lookup are scope-aware instead of repo-wide.
- **Why it matters**: this is the right answer to “shared vs private” memory. Public does not just have a global bucket; it has explicit private scope, collaborator scope, and scoped dedup so one actor’s memory does not accidentally collapse another actor’s record.
- **Recommendation**: adopt now
- **Affected subsystem**: governed retrieval, shared-memory writes, duplicate suppression
- **Impact**: high

### Finding 5: Public has explicit DB-level concurrency controls, but shared-memory admin auth still trusts transport-supplied identity
- **Source**: [vector-index-store.ts:802](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts#L802), [vector-index-store.ts:803](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts#L803), [context-server.ts:1632](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1632), [session-manager.ts:603](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L603), [reconsolidation-bridge.ts:237](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L237), [shared-memory.ts:232](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts#L232), [shared-memory.ts:245](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts#L245)
- **Evidence type**: wrapper-confirmed
- **What it does**: Public forces WAL, sets `busy_timeout`, uses `BEGIN IMMEDIATE` for session dedup races, and wraps reconsolidation/save paths in transactions. But shared-memory admin mutations still warn that actor IDs are caller-supplied and not yet cryptographically bound to an authenticated transport principal.
- **Why it matters**: concurrency at the SQLite layer is meaningfully stronger in Public than anything the Mnemosyne plugin proves. The remaining gap is not write atomicity; it is identity trust for collaborative admin operations.
- **Recommendation**: NEW FEATURE
- **Affected subsystem**: shared-memory administration and transport auth binding
- **Impact**: high

## Assessment
- New information ratio: 0.44
- The external repo does not prove multi-agent safety beyond CLI invocation hygiene and simple project/global scoping. The stronger answer is that Spec Kit Memory already contains most of the needed safety model: explicit scope metadata, membership-gated shared spaces, append-version conflict recording, manual-merge escalation, lineage-preserving writes, and transactional protections.
- Validation: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict` returned `RESULT: PASSED` with `Errors: 0  Warnings: 0`; the read-only sandbox also emitted `cannot create temp file for here document: Operation not permitted`.

## Recommended Next Focus
Trace where shared-space conflict recording is invoked from real shared-memory write/update flows, then decide whether Public needs a thin OpenCode-facing wrapper that exposes explicit `private` vs `shared-space` memory tools on top of existing governed scope and conflict machinery rather than copying Mnemosyne’s basename/global model.


hook: Stop
hook: Stop Completed
tokens used
100,083
# Iteration 025: MULTI-AGENT MEMORY SAFETY

## Focus
MULTI-AGENT MEMORY SAFETY: How does this system handle concurrent agent access, merge conflicts, project isolation, and shared vs private memory scoping?

## Findings
### Finding 1: Mnemosyne’s project/global split is ergonomic, but it is not a safe isolation model
- **Source**: [external/src/index.ts:28](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L28), [external/src/index.ts:30](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L30), [external/src/index.ts:81](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L81), [external/README.md:51](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L51)
- **Evidence type**: both
- **What it does**: the wrapper derives the project collection from the current directory basename, auto-inits that collection on load, and exposes a separate `--global` collection. There is no wrapper-visible tenant, user, agent, session, or membership boundary.
- **Why it matters**: this is fine for solo convenience, but unsafe as a concurrency boundary. Two unrelated worktrees with the same basename collide, and multiple agents in one repo implicitly share the same project bucket.
- **Recommendation**: reject
- **Affected subsystem**: future plugin-facing scope model
- **Impact**: high

### Finding 2: Mnemosyne exposes no plugin-level merge or conflict protocol; contradiction handling is left to the agent
- **Source**: [external/src/index.ts:147](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L147), [external/src/index.ts:193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L193), [external/src/index.ts:210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [external/README.md:69](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L69)
- **Evidence type**: both
- **What it does**: the wrapper offers `add`, `search`, and `delete` surfaces, and the compaction hook reminds the agent to delete contradicted memories. I found no wrapper-visible append-version, merge queue, conflict audit, or collaborator-aware resolution path.
- **Why it matters**: for concurrent agents, “delete the old one and write the new one” is not a safety model. It loses lineage and turns race conditions into silent last-writer-wins behavior unless the unseen backend adds protections the plugin repo does not prove.
- **Recommendation**: prototype later
- **Affected subsystem**: any future OpenCode memory wrapper for shared/collaborative writes
- **Impact**: high

### Finding 3: Spec Kit Memory already has a real shared-conflict model with escalation, auditability, and append-only fallback
- **Source**: [shared-spaces.ts:135](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L135), [shared-spaces.ts:153](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L153), [shared-spaces.ts:678](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L678), [shared-spaces.ts:718](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L718), [shared-spaces.vitest.ts:490](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts#L490), [shared-spaces.vitest.ts:538](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts#L538)
- **Evidence type**: both
- **What it does**: Public records shared-memory conflicts in `shared_space_conflicts`, defaults first conflicts to `append_version`, escalates repeat or high-risk conflicts to `manual_merge`, and mirrors the event into governance audit. The conflict write runs as an `immediate()` transaction specifically to prevent concurrent writers from seeing the same prior conflict count.
- **Why it matters**: this is the concrete multi-agent safety mechanism Mnemosyne’s wrapper lacks. Public preserves history instead of forcing overwrite/delete decisions during contention.
- **Recommendation**: adopt now
- **Affected subsystem**: shared-memory collaboration and conflict hygiene
- **Impact**: high

### Finding 4: Public’s private vs shared scoping is first-class and enforced at both save-time and retrieval-time
- **Source**: [scope-governance.ts:456](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L456), [scope-governance.ts:482](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L482), [memory-save.ts:1164](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1164), [shared-spaces.ts:555](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L555), [create-record.ts:108](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L108)
- **Evidence type**: wrapper-confirmed
- **What it does**: saves and reads carry `tenantId`, `userId`, `agentId`, `sessionId`, and `sharedSpaceId`; shared rows use membership as the visibility boundary; shared saves require editor access; same-path dedup and existing-row lookup are scope-aware instead of repo-wide.
- **Why it matters**: this is the right answer to “shared vs private” memory. Public does not just have a global bucket; it has explicit private scope, collaborator scope, and scoped dedup so one actor’s memory does not accidentally collapse another actor’s record.
- **Recommendation**: adopt now
- **Affected subsystem**: governed retrieval, shared-memory writes, duplicate suppression
- **Impact**: high

### Finding 5: Public has explicit DB-level concurrency controls, but shared-memory admin auth still trusts transport-supplied identity
- **Source**: [vector-index-store.ts:802](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts#L802), [vector-index-store.ts:803](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts#L803), [context-server.ts:1632](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1632), [session-manager.ts:603](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L603), [reconsolidation-bridge.ts:237](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L237), [shared-memory.ts:232](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts#L232), [shared-memory.ts:245](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts#L245)
- **Evidence type**: wrapper-confirmed
- **What it does**: Public forces WAL, sets `busy_timeout`, uses `BEGIN IMMEDIATE` for session dedup races, and wraps reconsolidation/save paths in transactions. But shared-memory admin mutations still warn that actor IDs are caller-supplied and not yet cryptographically bound to an authenticated transport principal.
- **Why it matters**: concurrency at the SQLite layer is meaningfully stronger in Public than anything the Mnemosyne plugin proves. The remaining gap is not write atomicity; it is identity trust for collaborative admin operations.
- **Recommendation**: NEW FEATURE
- **Affected subsystem**: shared-memory administration and transport auth binding
- **Impact**: high

## Assessment
- New information ratio: 0.44
- The external repo does not prove multi-agent safety beyond CLI invocation hygiene and simple project/global scoping. The stronger answer is that Spec Kit Memory already contains most of the needed safety model: explicit scope metadata, membership-gated shared spaces, append-version conflict recording, manual-merge escalation, lineage-preserving writes, and transactional protections.
- Validation: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict` returned `RESULT: PASSED` with `Errors: 0  Warnings: 0`; the read-only sandbox also emitted `cannot create temp file for here document: Operation not permitted`.

## Recommended Next Focus
Trace where shared-space conflict recording is invoked from real shared-memory write/update flows, then decide whether Public needs a thin OpenCode-facing wrapper that exposes explicit `private` vs `shared-space` memory tools on top of existing governed scope and conflict machinery rather than copying Mnemosyne’s basename/global model.
