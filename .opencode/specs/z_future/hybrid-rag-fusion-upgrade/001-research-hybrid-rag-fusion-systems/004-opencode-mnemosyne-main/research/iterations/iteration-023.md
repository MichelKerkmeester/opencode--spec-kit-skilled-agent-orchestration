## Sources Consulted
- [file paths examined]

## Assessment
- New information ratio: [0.0-1.0]
- Questions addressed: [list]
- Questions answered: [list]

## Reflection
- What worked: [approach that yielded results]
- What did not work: [approach that failed]

--
## Findings
### Finding 1: Add a transport-owned memory reminder block at compaction time
- **Source**: [external/src/index.ts:210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [opencode-transport.ts:102](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L102), [memory-surface.ts:640](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L640); evidence type: both
- **What it does**: Mnemosyne injects an explicit “use memory tools” reminder into `experimental.session.compacting`, while Public’s compaction path currently carries continuity payloads and surfaced memories, not a direct tool-usage reminder.
- **Why it matters for us**: This is the clearest gap with the best fit: it improves post-compaction memory awareness without changing retrieval math or governance. Affected subsystem: OpenCode compaction transport.
- **Recommendation**: adopt now
- **Impact**: high
## Findings
- **Impact**: high
- **Target files**: [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts), [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js), [opencode-transport.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts)
- **Proposed signatures**: `function buildCompactionMemoryActionCard(args: { healthPayload?: SharedPayloadEnvelope | null; specFolder?: string | null }): string | null`; `function buildOpenCodeTransportPlan(args: { bootstrapPayload?: SharedPayloadEnvelope | null; startupPayload?: SharedPayloadEnvelope | null; resumePayload?: SharedPayloadEnvelope | null; healthPayload?: SharedPayloadEnvelope | null; compactionPayload?: SharedPayloadEnvelope | null; specFolder?: string | null }): OpenCodeTransportPlan`
- **Migration steps**: 1. Add `buildCompactionMemoryActionCard()` in [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts) and append its output into the existing `compaction.content`, not a second compaction block. 2. Gate the card so it renders only when health is ready or at least not blocked; if degraded, emit one short fallback like “run `memory_health()` / `session_bootstrap()` first.” 3. Keep [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js) structurally unchanged except for consuming the longer single block. 4. Add tests proving one compaction block, stable dedupe, and no duplicated reminder when auto-surfaced memory content is also present.

### Finding 2: Translate Mnemosyne’s AGENTS/startup discipline into Public-native startup and bootstrap wording
- **Source**: [external/README.md#L62](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L62), [context-server.ts#L741](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L741), [session-bootstrap.ts#L163](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L163), [session-resume.ts#L583](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L583)
- **What it does**: Mnemosyne repeats a simple behavior loop: recall early, save after decisions, delete contradictions. Public already has stronger governed surfaces, but the startup wording still emphasizes tool inventory more than memory operating protocol.
- **Why it matters**: This is worth adopting only as wording and workflow discipline. The message should point to `session_bootstrap`, `memory_context`, governed saves, and cautious mutation, not to cheap direct recall/store/delete semantics.
- **Recommendation**: adopt now
- **Impact**: medium
- **Target files**: [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts), [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts), [context-server.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts)
- **Proposed signatures**: `function buildMemoryDisciplineLines(args: { staleCount: number; healthStatus: 'ready' | 'degraded' | 'blocked' }): string[]`; `function buildBootstrapMemoryHints(args: { structuralStatus: 'ready' | 'stale' | 'missing'; healthStatus: 'ready' | 'degraded' | 'blocked' }): string[]`
- **Migration steps**: 1. In [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts), factor startup wording out of `buildServerInstructions()` into a helper that adds a short “memory discipline” section: start with `session_bootstrap()`, use `memory_context()` for grounded recall, save through governed paths, mutate only when contradictions are verified. 2. In [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts), add one or two memory lifecycle hints alongside structural hints so the behavior survives non-hook runtimes. 3. Mirror the same phrasing in the `session_resume` result path only when resume is the active recovery owner. 4. Update tests to assert the new wording is Public-native and does not mention Mnemosyne-only concepts like `core=true` or direct global/project CLI pairs.

### Finding 3: Promote readiness into a first-class contract that gates startup and compaction advice
- **Source**: [external/src/index.ts#L64](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L64), [external/README.md#L7](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L7), [memory-crud-health.ts#L222](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts#L222), [memory-crud-types.ts#L50](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts#L50), [tool-schemas.ts#L237](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L237), [context-server.ts#L1230](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1230), [context-server.ts#L1580](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1580)
- **What it does**: Mnemosyne’s README and wrapper assume prerequisites and first-use model download, but the user only learns readiness problems late. Public already has `memory_health`, startup logs, and integrity checks, yet its readiness signal is not a small reusable contract consumed by startup instructions and compaction transport.
- **Why it matters**: This is the missing guardrail that makes Findings 1 and 2 safe. Without it, we risk adding more advice in precisely the moments when memory is degraded or unavailable.
- **Recommendation**: adopt now
- **Impact**: high
- **Target files**: [memory-crud-types.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts), [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts), [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts)
- **Proposed signatures**: `interface MemoryReadyContract { status: 'ready' | 'degraded' | 'blocked'; reasons: string[]; recommendedAction: string; }`; `function buildMemoryReadyContract(args: { databaseConnected: boolean; embeddingReady: boolean; vectorAvailable: boolean; staleCount: number; }): MemoryReadyContract`; `async function handleMemoryHealth(args: HealthArgs): Promise<MCPResponse>`
- **Migration steps**: 1. Add `MemoryReadyContract` to [memory-crud-types.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts) and return it from [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts) on every full health response. 2. Extend [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts) only if needed for an explicit `includeReadyContract` flag; otherwise keep the surface stable and always include the field in `full` mode. 3. Consume the ready contract in [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts) when generating startup instructions so degraded memory surfaces call for `memory_health()` or `session_bootstrap()` instead of encouraging memory operations. 4. Feed the same contract into [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts) so the compaction card from Finding 1 is suppressed or shortened when memory is blocked.

## Assessment
- New information ratio: 0.28

## Recommended Next Focus
Validate whether these three blueprints should land as one bounded packet or as two phases: `transport+startup wording` first, then `readiness contract` second. Keep `project/global` aliases and inline `memory_remember` out of the adopt-now lane until this health-gated operating protocol is in place.

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
# Iteration 023: MEMORY DECAY & RETENTION

## Focus
MEMORY DECAY & RETENTION: How does this system handle memory aging, relevance decay, forgetting? What temporal strategies should we adopt for long-lived memory systems?

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
I’m treating this as a read-only research iteration focused on memory decay and retention. I’ll pull the most relevant prior memory notes, then inspect the external Mnemosyne wrapper and the current Spec Kit Memory temporal logic so we can isolate what’s actually new for this iteration.
exec
/bin/zsh -lc 'rg -n "mnemosyne|decay|retention|forget|FSRS|memory_search|memory_context|memory_match_triggers" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main/src/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
547:- `memory_stats` currently has no `sessionId` input in tool schema, so calling it after `memory_search` cannot claim the same session by default [Task 2]
548:- verification pattern that worked: confirm fresh `context-server.js` processes, run `session_bootstrap`, execute controlled `memory_search` sequence with fixed session id + trace flags, then query `feedback_events` globally and per-session in sqlite [Task 2]
731:- session_bootstrap, memory_context({mode:"resume",profile:"resume"}), mcp_server/hooks/claude, scripts/hooks/claude, workflow-session-id.vitest.ts, code-graph-query-handler.vitest.ts
786:- `session_bootstrap()` is the primary recovery call for non-hook flows; docs should mention fallback `memory_context({mode:"resume",profile:"resume"})` only after bootstrap guidance [Task 4]
1057:- list_mcp_resources, list_mcp_resource_templates, spec_kit_memory, opencode.json, context-server.js, memory_context, memory_search
1478:- memory_search cursor, progressive-disclosure, requestQuality, SPECKIT_RESULT_CONFIDENCE_V1, memory-search-ux-hooks.vitest.ts
1784:## Task 3: Refine Phase-015 governance/collaboration boundaries and retention scope
1826:- Governance hardening in this wave centered on guaranteed session/tenant enforcement in `filterRowsByScope`, shared-space authorization, and scoped retention sweep deletions [Task 3]

 exited 1 in 0ms:
sed: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main/src/index.ts: No such file or directory

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main/package.json" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
sed: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main/package.json: No such file or directory

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/research.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: "Deep Research Report: 004-opencode-mnemosyne-main"
description: "20-iteration deep research synthesis"
---

# Deep Research Report: 004-opencode-mnemosyne-main

Generated: 2026-04-10 22:31
Iterations: 20
Engine: Codex GPT-5.4 High (fast mode)

---

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
# Iteration 001: ARCHITECTURE OVERVIEW

## Focus
ARCHITECTURE OVERVIEW: Scan repository structure, key directories, main entry points, README, and architecture docs. Map high-level components and data flow.

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
I’m treating this as a read-only deep-research pass on the pre-approved phase folder. I’ll verify the phase docs, read the external wrapper in the required order, then compare it against the current Public memory and compaction code before I synthesize Iteration 001.
exec
/bin/zsh -lc "sed -n '1,260p' \"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main/src/index.ts\"" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
sed: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main/src/index.ts: No such file or directory

exec
/bin/zsh -lc 'rg -n "mnemosyne|compact-code-graph|memory_search|memory_context|memory_match_triggers|CocoIndex" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
345:## Task 7: Close `024-compact-code-graph/031-normalized-analytics-reader` with strict completion and memory-index cleanup, outcome success

codex
The first pass surfaced a path mismatch: the phase folder exists, but the external checkout is not at the nested `external/opencode-mnemosyne-main/...` path from the brief. I’m locating the real external layout now, then I’ll trace the temporal and decay logic from the actual files instead of the assumed path.
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
/bin/zsh -lc 'find .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main -maxdepth 3 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/.gitignore
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/LICENSE
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package-lock.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/tsconfig.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/memory/.gitkeep
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/phase-research-prompt.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/.gitkeep
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-001.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-002.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-003.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-004.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-005.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-006.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-007.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-008.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-009.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-010.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-011.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-012.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-013.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-014.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-015.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-016.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-017.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-018.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-019.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-020.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-021.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-022.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/research.md

exec
/bin/zsh -lc "find .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external -maxdepth 4 -type f | sort | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/.github/workflows/npm-publish.yml
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/.gitignore
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/LICENSE
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package-lock.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/tsconfig.json

codex
I’ve confirmed the external repo is a very thin wrapper at `external/src/index.ts` plus `README.md`; there isn’t a deeper nested checkout. The next step is mapping where time actually matters on both sides: Mnemosyne’s apparent lack of aging controls versus Spec Kit Memory’s real decay, retention, and access-strengthening paths.
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
/bin/zsh -lc "rg -n \"decay|retention|deleteAfter|retentionPolicy|useDecay|trackAccess|FSRS|state: 'HOT'|state: 'WARM'|strength|half-life|attention|stale|archived|DORMANT|ARCHIVED|forget|recency|last_accessed|next_review|review\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/scripts/dist/memory | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:104:import * as attentionDecay from './lib/cognitive/attention-decay.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:107:// T059: Archival manager for automatic archival of ARCHIVED state memories
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:118:// P4-12/P4-19: Incremental index (passed to db-state for stale handle refresh)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:175:    codeGraphStatus: 'fresh' | 'stale' | 'empty';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:194:  staleCount: number;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:379:// Safe for stdio (single client). TTL in query-flow-tracker bounds staleness.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:712:      return { totalMemories: 0, specFolderCount: 0, activeCount: 0, staleCount: 0 };
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:731:      staleCount: pending + failed + retry,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:734:    return { totalMemories: 0, specFolderCount: 0, activeCount: 0, staleCount: 0 };
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:751:  const staleWarning = stats.staleCount > 10
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:752:    ? ` Warning: ${stats.staleCount} stale memories detected. Consider running memory_index_scan.`
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:757:    `Active memories: ${stats.activeCount}. Stale memories: ${stats.staleCount}.`,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:761:    staleWarning.trim(),
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:798:    if (snap.graphFreshness === 'fresh' || snap.graphFreshness === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1191:    // P1 FIX: Wire isCommittedInDb callback so stale pending files are detected at startup.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1313:          staleDeleted: 0,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1314:          staleDeleteFailed: 0,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1561:  // Refresh their DB handles during reinitializeDatabase(), preventing stale refs.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1574:      attentionDecay,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1711:      attentionDecay.init(database);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1728:    // T059: Archival Manager for automatic archival of ARCHIVED state memories
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1843:                    staleDeleted: 0,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1844:                    staleDeleteFailed: 0,
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:46:| `SPECKIT_EVAL_LOGGING` | Persists evaluation events for later review, but does not authorize publication-grade multiplier claims. |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:133:| `SPECKIT_CLASSIFICATION_DECAY` | `true` | boolean | Classification-aware decay in FSRS scheduling and composite scoring. Graduated ON. | `lib/cognitive/fsrs-scheduler.ts`, `lib/scoring/composite-scoring.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:134:| `SPECKIT_SESSION_BOOST` | `true` | boolean | Session attention boost for search result re-ranking. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:139:| `SPECKIT_RECENCY_FUSION_WEIGHT` | `0.07` | number | Weight of recency signal in Stage 2 fusion scoring. | `lib/search/pipeline/stage2-fusion.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:140:| `SPECKIT_RECENCY_FUSION_CAP` | `0.10` | number | Maximum recency contribution cap in Stage 2 fusion. | `lib/search/pipeline/stage2-fusion.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:223:| `SPECKIT_ARCHIVAL` | `true` | boolean | Archival manager for aging out stale memories (90-day max age). Graduated ON. | `lib/cognitive/archival-manager.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:224:| `SPECKIT_HYBRID_DECAY_POLICY` | `true` | boolean | Type-aware no-decay for permanent artifacts (decision/constitutional types get Infinity stability). Graduated ON. | `lib/cognitive/fsrs-scheduler.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:227:| `SPECKIT_CONSOLIDATION` | `true` | boolean | Consolidation engine: contradiction scan, Hebbian strengthening, staleness detection (N3-lite). Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:232:| `SPECKIT_RECENCY_DECAY_DAYS` | (internal) | number | Number of days for recency decay calculation in access tracking. | `lib/storage/access-tracker.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:233:| `SPECKIT_EVENT_DECAY` | `true` | boolean | Event decay processing in working memory. Graduated ON. | `lib/cognitive/working-memory.ts` (via tests) |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:434:# Lower recency fusion impact
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:26:import * as attentionDecay from '../lib/cognitive/attention-decay.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:61:  attentionScore: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:74:  attentionScore?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:81:  decayedCount: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:90:  attentionScore: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:97:  decayApplied: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:122:/** Per-turn decay rate for attention scoring. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:130:/** Fetch full memory records required for FSRS tier classification. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:135:  const db = attentionDecay.getDb();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:161:  if (tier === 'COLD' || tier === 'DORMANT' || tier === 'ARCHIVED') return '';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:276:    attentionDecay.getDb();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:278:  let decayStats: DecayStats | null = null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:281:      decayStats = { decayedCount: workingMemory.batchUpdateScores(sessionId as string) };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:345:          decayApplied: decayStats ? decayStats.decayedCount : 0
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:368:        attentionDecay.activateMemory(match.memoryId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:369:        // T209: Persist max attention boost for matched memories.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:399:      .map(wm => ({ memoryId: (wm.id as number) || 0, attentionScore: (wm.attention_score as number) || 1.0 }));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:409:      let attentionScore: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:417:          // WM already applies its own decay — skip turnDecayFactor to avoid double-decay.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:418:          effectiveRetrievability = Math.min(effectiveRetrievability, wmEntry.attentionScore);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:423:        attentionScore = effectiveRetrievability;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:426:        // When no FSRS record, use WM score directly (already session-decayed) or apply turn decay
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:427:        const baseScore = wmEntry ? wmEntry.attentionScore : 1.0;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:428:        attentionScore = wmEntry ? baseScore : baseScore * turnDecayFactor;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:429:        tier = tierClassifier.classifyState(attentionScore);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:432:      // Clamp to [0,1] — retrievability * decay or wmEntry scores
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:434:      attentionScore = Math.max(0, Math.min(1, attentionScore));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:438:        attentionScore: attentionScore,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:461:        attentionScore: r.attentionScore,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:471:      decayApplied: decayStats ? decayStats.decayedCount : 0,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:531:    const db = attentionDecay.getDb();
.opencode/skill/system-spec-kit/scripts/dist/memory/cleanup-orphaned-vectors.js:32:  --dry-run           Preview what would be deleted without making changes
.opencode/skill/system-spec-kit/scripts/dist/memory/cleanup-orphaned-vectors.js:37:  node cleanup-orphaned-vectors.js --dry-run      # Preview only
.opencode/skill/system-spec-kit/scripts/dist/memory/cleanup-orphaned-vectors.js:153:        console.log(`\nCleanup ${dryRun ? 'preview' : 'completed'} successfully`);
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-historical-json-mode-memories.js:53:  --dry-run            Preview only (default and only supported mode)
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:142:/** Reinforce an existing memory's stability via FSRS scheduling instead of creating a duplicate */
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:148:      SELECT id, stability, difficulty, last_review, review_count, title
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:157:    const elapsedDays = fsrsScheduler.calculateElapsedDays(memory.last_review as string | null);
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:179:          last_review = datetime('now'),
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:180:          review_count = COALESCE(review_count, 0) + 1,
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:70:- `memory-index.ts` and `mutation-hooks.ts` work together so index, update, and stale-delete flows clear trigger, constitutional, graph, co-activation, and degree caches.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:80:- Post-mutation invalidation clears `clearDegreeCache()` alongside trigger and constitutional caches so graph-derived retrieval signals cannot serve stale data after mutations.
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:9:// Computes composite ranking scores for memories and folders with recency decay
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:181:    const archivedCount = allFolders.filter((f) => f.isArchived).length;
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:190:            activeFolders: folderMap.size - archivedCount,
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:191:            archivedFolders: archivedCount,
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:227:        if (arg === '--show-archived') {
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js:257:  --show-archived     Include archived folders in output
.opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js:80:  --dry-run            Preview changes (default if --apply is omitted)
.opencode/skill/system-spec-kit/mcp_server/api/index.ts:9:// auditing all consumers first (see review/review-report.md P2-MNT-02).
.opencode/skill/system-spec-kit/mcp_server/cli.ts:114:    [--dry-run]                    Preview without deleting
.opencode/skill/system-spec-kit/mcp_server/cli.ts:307:  console.log(`\nBulk Delete Preview`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:40:  action: 'review';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:139:  retentionPolicy?: 'keep' | 'ephemeral' | 'shared';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:140:  deleteAfter?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:151:  review_count?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:169:  retention_policy?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:56:  useDecay?: boolean;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:73:  minState?: 'HOT' | 'WARM' | 'COLD' | 'DORMANT' | 'ARCHIVED';
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:74:  trackAccess?: boolean;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:164:  retentionPolicy?: 'keep' | 'ephemeral' | 'shared';
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:165:  deleteAfter?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:302:  strength?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:122:  attentionScore?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:125:  last_review?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:127:  last_accessed?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:169:    recency: weights.recency,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:188:  useDecay?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:202:  trackAccess?: boolean; // opt-in access tracking (default false)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:203:  includeArchived?: boolean; // REQ-206: include archived memories in search (default false)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:505:    useDecay: useDecay = true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519:    trackAccess: trackAccess = false, // opt-in, off by default
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:520:    includeArchived: includeArchived = false, // REQ-206: exclude archived by default
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:732:    useDecay,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:794:      useDecay,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:801:      trackAccess,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:81:- `../../lib/cognitive/fsrs-scheduler.ts` -- FSRS stability/difficulty defaults
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:8:// canonicalization rules for stale residual cleanup.
.opencode/skill/system-spec-kit/scripts/dist/memory/migrate-trigger-phrase-residual.js:58:  --dry-run            Preview changes only (default)
.opencode/skill/system-spec-kit/scripts/dist/memory/rebuild-auto-entities.js:19:  --dry-run                 Preview the rebuild without changing the database
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:70: *   0.88 <= sim < 0.96  → review (supersede or complement recommendation)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:78:): 'auto_merge' | 'review' | 'keep_separate' {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:80:  if (similarity >= ASSISTIVE_REVIEW_THRESHOLD)     return 'review';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:85: * Classify whether a borderline (review-tier) memory pair should be
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:130:   *  borderline pair is detected (review tier). */
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:397:          // we mark is_archived so it is excluded from future search results
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:402:              SET is_archived = 1,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:410:              `[reconsolidation-bridge] assistive auto-merge: archived older=${topId} ` +
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:417:        } else if (tier === 'review') {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:421:            action: 'review',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:39:  strength: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:85:  strength?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:158:        strength: child.strength,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:517:      hints.push('Contradicting relationships detected - review for consistency');
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:563:    strength = 1.0,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:625:    const edge = causalEdges.insertEdge(String(sourceId), String(targetId), safeRelation, strength ?? 1.0, evidence ?? null);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:740:        avg_strength: stats.avgStrength,
.opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.d.ts:67:        archivedFolders: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:88:    if (args.loopType !== 'research' && args.loopType !== 'review') {
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:89:      return errorResponse('loopType must be "research" or "review"');
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:340:  // Check dimension coverage — blocking gate for review mode.
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:341:  // Incomplete dimension coverage means the review is not yet comprehensive
.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:23:      strength REAL DEFAULT 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:27:      last_accessed TEXT
.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:76:      INSERT INTO causal_edges (source_id, target_id, relation, strength)
.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:234:  // --- Hop decay ---
.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:251:    // fix_bug, supersedes (CORRECTION tier 0 → edgePrior=1.0), 1-hop (decay=1.0), freshness=0.8
.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:259:    // add_feature, supports (tier 2 → edgePrior=0.5), 2-hop (decay=0.5), freshness=1.0
.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:284:      INSERT INTO causal_edges (source_id, target_id, relation, strength)
.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:303:      INSERT INTO causal_edges (source_id, target_id, relation, strength)
.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:335:      INSERT INTO causal_edges (source_id, target_id, relation, strength)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:103:      // Data integrity: clean stale auto-entities before re-extraction on update
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:58:        actor TEXT DEFAULT 'system' CHECK(actor IN ('user', 'system', 'hook', 'decay')),
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:297:      // The beforeAll created the table with CHECK(actor IN ('user','system','hook','decay'))
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:51:    if (args.loopType !== 'research' && args.loopType !== 'review') {
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:52:      return errorResponse('loopType must be "research" or "review"');
.opencode/skill/system-spec-kit/mcp_server/database/README.md:73:- Structural reads (`code_graph_query`, `code_graph_context`) can perform bounded inline selective refresh against `code-graph.sqlite` when the stale set is small enough.
.opencode/skill/system-spec-kit/mcp_server/database/README.md:74:- Empty or broadly stale structural states still require explicit `code_graph_scan` to rebuild the graph database.
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:505:// 9. Cache behavior (invalidations + TTL stale detection)
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:536:  it('detects stale cache after TTL expiry and rebuilds hierarchy', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:551:    const staleRefreshedTree = buildHierarchyTree(db);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:552:    expect(staleRefreshedTree).not.toBe(initialTree);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:553:    expect(staleRefreshedTree.nodeMap.has('003-foo/140-after-ttl')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:452:        `N3-lite consolidation: +${consolidation.hebbian.strengthened} strengthened, ` +
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:453:        `-${consolidation.hebbian.decayed} decayed, ${consolidation.stale.flagged} stale flagged`
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:117:  attention: number | null;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:156:    edges: Array<{ sourceId: number; targetId: number; relation: string; strength: number }>;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:472:        attention: toNullableNumber(rawResult.attentionScore),
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:496:              strength: typeof e.strength === 'number' ? e.strength : 1.0,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:197:// Track stale session cleanup interval (runs hourly)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:198:let staleCleanupInterval: ReturnType<typeof setInterval> | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:234:  // Run stale session cleanup on startup and set up hourly interval
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:239:    console.warn(`[session-manager] Initial stale session cleanup failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:242:  if (staleCleanupInterval) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:243:    clearInterval(staleCleanupInterval);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:245:  staleCleanupInterval = setInterval(() => {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:250:      console.warn(`[session-manager] Periodic stale session cleanup failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:253:  if (staleCleanupInterval && typeof staleCleanupInterval === 'object' && 'unref' in staleCleanupInterval) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:254:    staleCleanupInterval.unref();
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:758: * T302: Clean up stale sessions across all session-related tables.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:782:  // 1. Clean stale working_memory entries
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:795:  // 2. Clean stale session_sent_memories entries
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1382:  if (staleCleanupInterval) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1383:    clearInterval(staleCleanupInterval);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1384:    staleCleanupInterval = null;
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:52:  return loopType === 'research' || loopType === 'review';
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:77:      return errorResponse('loopType must be "research" or "review"');
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:114:  it('returns the merged survivor id instead of the archived predecessor id', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:152:  it('removes archived assistive auto-merge documents from the BM25 singleton', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:38:      is_archived INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:45:      last_accessed TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:71:    INSERT INTO memory_index (title, trigger_phrases, spec_folder, parent_id, importance_tier, is_archived)
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:238:  it('ignores archived and deprecated siblings that are no longer retrievable', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:246:      title: 'authentication login session token validation handler middleware security user access archived',
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:364:  it('skips archived and deprecated rows during batch scoring', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:377:      title: 'authentication login session token validation handler middleware security user access archived',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:776:      JSON.stringify({ note: 'resolved by reviewer' }),
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:84:      AND (m.is_archived IS NULL OR m.is_archived = 0)
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:120:        last_review TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:123:        is_archived INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:144:        strength REAL DEFAULT 1.0 CHECK(strength >= 0.0 AND strength <= 1.0),
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:148:        last_accessed TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:157:        old_strength REAL NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:158:        new_strength REAL NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:421:      // F04-001: Append-only merge — old row (id=100) is archived, new row holds merged content.
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:422:      const oldRow = testDb.prepare('SELECT is_archived FROM memory_index WHERE id = 100').get() as {
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:423:        is_archived: number;
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:425:      expect(oldRow.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:460:      const oldRow = testDb.prepare('SELECT is_archived FROM memory_index WHERE id = 101').get() as {
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:461:        is_archived: number;
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:463:      expect(oldRow.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:496:      const archivedRow = testDb.prepare(
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:497:        'SELECT is_archived FROM memory_index WHERE id = 102'
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:498:      ).get() as { is_archived: number };
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:499:      expect(archivedRow.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:514:    it('MP4: Keeps merged survivor reachable through active projection and hides archived predecessor', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:571:      const archivedRow = testDb.prepare(`
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:572:        SELECT is_archived
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:575:      `).get() as { is_archived: number };
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:576:      expect(archivedRow.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:691:        makeNewMemory({ content: 'Incoming content that should not be stale-merged' }),
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:701:        SELECT id, is_archived, content_text
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:704:      `).all() as Array<{ id: number; is_archived: number; content_text: string | null }>;
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:706:        { id: 105, is_archived: 0, content_text: 'Concurrent writer content' },
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:744:      const archivedRow = testDb.prepare(`
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:745:        SELECT is_archived
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:748:      `).get() as { is_archived: number };
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:749:      expect(archivedRow.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:929:      const archivedRow = testDb.prepare(
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:930:        'SELECT is_archived FROM memory_index WHERE id = 400'
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:931:      ).get() as { is_archived: number };
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:932:      expect(archivedRow.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:1049:      const archivedRow = testDb.prepare(
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:1050:        'SELECT is_archived FROM memory_index WHERE id = 450'
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:1051:      ).get() as { is_archived: number };
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:1052:      expect(archivedRow.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:35:    if (args.loopType !== 'research' && args.loopType !== 'review') {
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:36:      return errorResponse('loopType must be "research" or "review"');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:85:        last_review TEXT DEFAULT (datetime('now')),
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:86:        review_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:120:        strength REAL DEFAULT 1.0 CHECK(strength >= 0.0 AND strength <= 1.0),
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:124:        last_accessed TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:133:        old_strength REAL NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:134:        new_strength REAL NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:535:        // May fail due to missing FSRS columns - acceptable
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:621:            id, spec_folder, file_path, title, content_text, content_hash, stability, difficulty, review_count
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:628:          'stale-hash',
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:4:// Scoped governance isolation, retention behavior, and audit review.
.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:61:  it('auto-merge threshold is above review threshold', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:77:  it('returns "review" for similarity in [0.88, 0.96)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:78:    expect(classifyAssistiveSimilarity(0.88)).toBe('review');
.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:79:    expect(classifyAssistiveSimilarity(0.90)).toBe('review');
.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:80:    expect(classifyAssistiveSimilarity(0.9599)).toBe('review');
.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:93:  it('exact boundary 0.88 is review', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:94:    expect(classifyAssistiveSimilarity(0.88)).toBe('review');
.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:204:    // review
.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:205:    expect(classifyAssistiveSimilarity(0.959)).toBe('review');
.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:206:    expect(classifyAssistiveSimilarity(0.88)).toBe('review');
.opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts:223:    expect(tier).toBe('review');
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:596:      expect(meta).not.toHaveProperty('strength');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:25:  graphFreshness: 'fresh' | 'stale' | 'empty' | 'error';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:39:  status: 'ready' | 'stale' | 'missing';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:218:  } else if (graphFreshness === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:219:    status = 'stale';

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '100,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '480,860p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '120,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   120	──────────────────────────────────────────────────────────────── */
   121	
   122	/** Per-turn decay rate for attention scoring. */
   123	const TURN_DECAY_RATE = 0.98;
   124	const validateTieredFilePath = createFilePathValidator(ALLOWED_BASE_PATHS, validateFilePath);
   125	
   126	/* ───────────────────────────────────────────────────────────────
   127	   2c. HELPER FUNCTIONS
   128	──────────────────────────────────────────────────────────────── */
   129	
   130	/** Fetch full memory records required for FSRS tier classification. */
   131	function fetchMemoryRecords(memoryIds: number[]): Map<number, TierInput> {
   132	  const records = new Map<number, TierInput>();
   133	  if (memoryIds.length === 0) return records;
   134	
   135	  const db = attentionDecay.getDb();
   136	  if (!db) return records;
   137	
   138	  try {
   139	    const stmt = db.prepare(
   140	      'SELECT * FROM memory_index WHERE id = ?'
   141	    );
   142	    for (const id of memoryIds) {
   143	      const row = stmt.get(id) as TierInput | undefined;
   144	      if (row) {
   145	        records.set(row.id as number, row);
   146	      }
   147	    }
   148	  } catch (err: unknown) {
   149	    const message = toErrorMessage(err);
   150	    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
   151	  }
   152	
   153	  return records;
   154	}
   155	
   156	/** Get tiered content for a memory based on its tier state (HOT=full, WARM=summary, COLD=excluded) */
   157	async function getTieredContent(
   158	  memoryInfo: { filePath: string; title: string | null; triggerPhrases: string[] },
   159	  tier: string
   160	): Promise<string> {
   161	  if (tier === 'COLD' || tier === 'DORMANT' || tier === 'ARCHIVED') return '';
   162	  try {
   163	    const fs = await import('fs');
   164	    const validatedPath = validateTieredFilePath(memoryInfo.filePath);
   165	    const canonicalPath = validateTieredFilePath(fs.realpathSync(validatedPath));
   166	    const content = fs.readFileSync(canonicalPath, 'utf-8');
   167	    if (tier === 'HOT') return content;
   168	    // WARM tier returns truncated summary
   169	    return content.substring(0, 150) + (content.length > 150 ? '...' : '');
   170	  } catch (_error: unknown) {
   171	    console.warn('[memory-triggers] getTieredContent failed', {
   172	      filePath: memoryInfo.filePath, // server-side only; safe to log
   173	      tier,
   174	      error: _error instanceof Error ? _error.message : String(_error),
   175	    });
   176	    return '';
   177	  }
   178	}
   179	
   180	/* ───────────────────────────────────────────────────────────────
   181	   3. MATCH TRIGGERS HANDLER
   182	──────────────────────────────────────────────────────────────── */
   183	
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

 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Fsrs Scheduler
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Classification-based decay
     5	// CANONICAL FSRS CONSTANTS & ALGORITHM
     6	// Free Spaced Repetition Scheduler v4 algorithm implementation
     7	//
     8	// TWO-DOMAIN DECAY MODEL (Single Source of Truth)
     9	// Long-term memory (this file):
    10	// FSRS v4 power-law: R(t) = (1 + FSRS_FACTOR * t/S)^FSRS_DECAY
    11	// Timescale: days/weeks. Constants: FSRS_FACTOR=19/81, FSRS_DECAY=-0.5
    12	// All long-term decay consumers MUST import constants from this file.
    13	//
    14	// Working memory (working-memory.ts — separate system, intentionally decoupled):
    15	// Linear multiplicative: score * 0.95 per tick
    16	// Timescale: minutes. Operates on session-scoped attention scores only.
    17	//
    18	// DECAY STRATEGY (ADR-004): This is the CANONICAL long-term decay
    19	// Algorithm. All temporal decay for persistent memories should route
    20	// Through calculateRetrievability(). Formula: R(t) = (1 + 19/81 * t/S)^(-0.5)
    21	// Where t = elapsed days, S = stability (grows with successful reviews).
    22	//
    23	// Consumers: attention-decay.ts (facade), composite-scoring.ts (temporal
    24	// Factor), tier-classifier.ts (state classification),
    25	// Vector-index-impl.js (SQL search ranking).
    26	
    27	import { LEGACY_CONTEXT_TYPE_ALIASES } from '@spec-kit/shared/context-types';
    28	
    29	/* --- 1. CONSTANTS --- */
    30	
    31	/** FSRS v4 algorithm constants */
    32	const FSRS_FACTOR = 19 / 81;
    33	const FSRS_DECAY = -0.5;
    34	
    35	// Derived constant for half-life ↔ stability conversion.
    36	// From R(h) = 0.5: S = (FSRS_FACTOR / 3) * h = (19/243) * h
    37	const FSRS_HALF_LIFE_FACTOR = FSRS_FACTOR / 3; // 19/243 ≈ 0.07819
    38	
    39	/** Grade constants for review scoring */
    40	const GRADE_AGAIN = 1;
    41	const GRADE_HARD = 2;
    42	const GRADE_GOOD = 3;
    43	const GRADE_EASY = 4;
    44	
    45	/** Default initial parameters */
    46	const DEFAULT_INITIAL_STABILITY = 1.0;
    47	const DEFAULT_INITIAL_DIFFICULTY = 5.0;
    48	
    49	/** Difficulty bounds */
    50	const MIN_DIFFICULTY = 1.0;
    51	const MAX_DIFFICULTY = 10.0;
    52	
    53	/** Stability bounds */
    54	const MIN_STABILITY = 0.1;
    55	
    56	/* --- 2. INTERFACES --- */
    57	
    58	interface FsrsParams {
    59	  stability: number;
    60	  difficulty: number;
    61	  lastReview: string | null;
    62	  reviewCount: number;
    63	}
    64	
    65	interface ReviewResult {
    66	  stability: number;
    67	  difficulty: number;
    68	  lastReview: string;
    69	  reviewCount: number;
    70	  nextReviewDate: string;
    71	  retrievability: number;
    72	}
    73	
    74	/* --- 3. CORE FUNCTIONS --- */
    75	
    76	/**
    77	 * Calculate retrievability (probability of recall) using FSRS v4 formula.
    78	 * R(t) = (1 + FACTOR * t / S)^DECAY
    79	 */
    80	function calculateRetrievability(stability: number, elapsedDays: number): number {
    81	  if (stability <= 0 || elapsedDays < 0) {
    82	    return 0;
    83	  }
    84	
    85	  const retrievability = Math.pow(
    86	    1 + FSRS_FACTOR * (elapsedDays / stability),
    87	    FSRS_DECAY
    88	  );
    89	
    90	  return Math.max(0, Math.min(1, retrievability));
    91	}
    92	
    93	/**
    94	 * Update stability based on review grade.
    95	 * Uses simplified FSRS v4 update rules.
    96	 */
    97	function updateStability(
    98	  currentStability: number,
    99	  difficulty: number,
   100	  grade: number,
   101	  retrievability: number
   102	): number {
   103	  const safeStability = Math.max(0, currentStability);
   104	  const safeDifficulty = Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, difficulty));
   105	
   106	  if (grade === GRADE_AGAIN) {
   107	    // Lapse: stability decreases significantly
   108	    return Math.max(MIN_STABILITY, safeStability * 0.2);
   109	  }
   110	
   111	  // Success: stability increases based on grade and difficulty
   112	  const difficultyFactor = 1 + (11 - safeDifficulty) * 0.1;
   113	  const gradeFactor = grade === GRADE_EASY ? 1.3 : grade === GRADE_GOOD ? 1.0 : 0.8;
   114	  const retrievabilityBonus = 1 + (1 - retrievability) * 0.5;
   115	
   116	  const newStability = safeStability * difficultyFactor * gradeFactor * retrievabilityBonus;
   117	
   118	  return Math.max(MIN_STABILITY, newStability);
   119	}
   120	
   121	/**
   122	 * Calculate optimal review interval from stability.
   123	 * The interval where retrievability = 0.9 (desired retention).
   124	 */
   125	function calculateOptimalInterval(stability: number, desiredRetention: number = 0.9): number {
   126	  const safeStability = Math.max(0, stability);
   127	
   128	  if (safeStability <= 0 || desiredRetention <= 0 || desiredRetention >= 1) {
   129	    return 0;
   130	  }
   131	
   132	  const interval = (safeStability / FSRS_FACTOR) * (Math.pow(desiredRetention, 1 / FSRS_DECAY) - 1);
   133	
   134	  return Math.max(0, Math.round(Math.max(0, interval)));
   135	}
   136	
   137	/**
   138	 * Update difficulty based on review grade.
   139	 */
   140	function updateDifficulty(currentDifficulty: number, grade: number): number {
   141	  const safeDifficulty = Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, currentDifficulty));
   142	  let newDifficulty: number;
   143	
   144	  if (grade === GRADE_AGAIN) {
   145	    newDifficulty = safeDifficulty + 1.0;
   146	  } else if (grade === GRADE_HARD) {
   147	    newDifficulty = safeDifficulty + 0.5;
   148	  } else if (grade === GRADE_GOOD) {
   149	    newDifficulty = safeDifficulty;
   150	  } else {
   151	    // EASY
   152	    newDifficulty = safeDifficulty - 0.5;
   153	  }
   154	
   155	  return Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, newDifficulty));
   156	}
   157	
   158	/**
   159	 * Calculate elapsed days since last review.
   160	 */
   161	function calculateElapsedDays(lastReview: string | null): number {
   162	  if (!lastReview) {
   163	    return 0;
   164	  }
   165	
   166	  const lastDate = new Date(lastReview);
   167	  if (isNaN(lastDate.getTime())) return 0;
   168	  const now = new Date();
   169	  const diffMs = now.getTime() - lastDate.getTime();
   170	
   171	  return Math.max(0, diffMs / (1000 * 60 * 60 * 24));
   172	}
   173	
   174	/**
   175	 * Get next review date based on stability and desired retention.
   176	 */
   177	function getNextReviewDate(stability: number, desiredRetention: number = 0.9): string {
   178	  const intervalDays = calculateOptimalInterval(stability, desiredRetention);
   179	  const nextDate = new Date();
   180	  nextDate.setDate(nextDate.getDate() + intervalDays);
   181	
   182	  return nextDate.toISOString();
   183	}
   184	
   185	/**
   186	 * Create initial FSRS parameters for a new memory.
   187	 */
   188	function createInitialParams(): FsrsParams {
   189	  return {
   190	    stability: DEFAULT_INITIAL_STABILITY,
   191	    difficulty: DEFAULT_INITIAL_DIFFICULTY,
   192	    lastReview: null,
   193	    reviewCount: 0,
   194	  };
   195	}
   196	
   197	/**
   198	 * Process a review and return updated parameters.
   199	 */
   200	function processReview(params: FsrsParams, grade: number): ReviewResult {
   201	  const elapsedDays = calculateElapsedDays(params.lastReview);
   202	  const retrievability = calculateRetrievability(params.stability, elapsedDays);
   203	
   204	  const newStability = updateStability(params.stability, params.difficulty, grade, retrievability);
   205	  const newDifficulty = updateDifficulty(params.difficulty, grade);
   206	  const now = new Date().toISOString();
   207	  const nextReviewDate = getNextReviewDate(newStability);
   208	
   209	  return {
   210	    stability: newStability,
   211	    difficulty: newDifficulty,
   212	    lastReview: now,
   213	    reviewCount: params.reviewCount + 1,
   214	    nextReviewDate,
   215	    retrievability,
   216	  };
   217	}
   218	
   219	/* --- 4. EXPORTS --- */
   220	
   221	/** Bundled constants object for test/external consumption */
   222	const FSRS_CONSTANTS = {
   223	  FSRS_FACTOR,
   224	  FSRS_DECAY,
   225	  FSRS_HALF_LIFE_FACTOR, // T301: derived constant (19/243)
   226	  GRADE_AGAIN,
   227	  GRADE_HARD,
   228	  GRADE_GOOD,
   229	  GRADE_EASY,
   230	  DEFAULT_STABILITY: DEFAULT_INITIAL_STABILITY,
   231	  DEFAULT_DIFFICULTY: DEFAULT_INITIAL_DIFFICULTY,
   232	  MIN_DIFFICULTY,
   233	  MAX_DIFFICULTY,
   234	  MIN_STABILITY,
   235	} as const;
   236	
   237	/**
   238	 * C138: Tier-based decay multipliers for long-term memory stability.
   239	 * Each tier modifies how quickly memories decay relative to the base FSRS schedule.
   240	 * constitutional = slowest decay (most persistent), scratch = fastest decay (ephemeral).
   241	 *
   242	 * NOTE (TM-03): This multiplier operates on elapsed-time in composite-scoring.ts
   243	 * (lower value = slower perceived time = slower decay). It is a SEPARATE system from
   244	 * IMPORTANCE_TIER_STABILITY_MULTIPLIER below, which operates on the FSRS stability
   245	 * parameter directly. Do NOT apply both to the same memory — use one or the other:
   246	 *   - TIER_MULTIPLIER → used by composite-scoring.ts (elapsed-time adjustment)
   247	 *   - IMPORTANCE_TIER_STABILITY_MULTIPLIER → used by getClassificationDecayMultiplier()
   248	 *     (stability adjustment, activated via SPECKIT_CLASSIFICATION_DECAY env var)
   249	 */
   250	const TIER_MULTIPLIER: Readonly<Record<string, number>> = {
   251	  constitutional: 0.1,
   252	  critical: 0.3,
   253	  important: 0.5,
   254	  normal: 1.0,
   255	  temporary: 2.0,
   256	  scratch: 3.0,
   257	} as const;
   258	
   259	/* --- 4a. CLASSIFICATION-BASED DECAY (TM-03) ---
   260	   Gated by SPECKIT_CLASSIFICATION_DECAY env var.
   261	   Multiplies FSRS stability so that:
   262	     - Infinity stability → R(t) = 1.0 always (no decay)
   263	     - >1.0 stability multiplier → slower decay
   264	     - <1.0 stability multiplier → faster decay */
   265	
   266	/**
   267	 * TM-03: Context-type stability multipliers.
   268	 * Applied to the FSRS stability parameter before computing retrievability.
   269	 * Infinity = no decay (retrievability always 1.0).
   270	 * 2.0 = stability doubled → slower decay.
   271	 * 1.0 = standard FSRS schedule.
   272	 */
   273	const CONTEXT_TYPE_STABILITY_MULTIPLIER: Record<string, number> = {
   274	  planning: Infinity,    // no decay — planning/decisions are permanent
   275	  research: 2.0,         // 2x stability — research context decays slower
   276	  implementation: 1.0,   // standard decay
   277	  general: 1.0,          // standard decay
   278	  // P1-3: Legacy aliases inherit their canonical type's multiplier
   279	  ...Object.fromEntries(
   280	    Object.entries(LEGACY_CONTEXT_TYPE_ALIASES).map(
   281	      ([legacy, canonical]) => [legacy, canonical === 'planning' ? Infinity : canonical === 'research' ? 2.0 : 1.0]
   282	    )
   283	  ),
   284	};
   285	
   286	/**
   287	 * TM-03: Importance-tier stability multipliers.
   288	 * Parallel to TIER_MULTIPLIER but operates on stability (not elapsed time).
   289	 * Used exclusively by getClassificationDecayMultiplier() when
   290	 * SPECKIT_CLASSIFICATION_DECAY is enabled. Do NOT combine with TIER_MULTIPLIER.
   291	 * constitutional/critical: Infinity = never decays.
   292	 * important: 1.5x stability → slower decay.
   293	 * normal: 1.0 → standard.
   294	 * temporary: 0.5x → faster decay (2x relative speed).
   295	 * deprecated: 0.25x → fastest decay (4x relative speed).
   296	 */
   297	const IMPORTANCE_TIER_STABILITY_MULTIPLIER: Record<string, number> = {
   298	  constitutional: Infinity, // never decays
   299	  critical: Infinity,       // never decays
   300	  important: 1.5,           // slower decay
   301	  normal: 1.0,              // standard
   302	  temporary: 0.5,           // faster decay
   303	  deprecated: 0.25,         // fastest decay
   304	};
   305	
   306	/**
   307	 * TM-03: Compute combined stability multiplier from context_type and importance_tier.
   308	 *
   309	 * Logic:
   310	 *   - If either dimension resolves to Infinity, the combined result is Infinity
   311	 *     (no-decay wins unconditionally).
   312	 *   - Unknown context_type or importance_tier values default to 1.0 (standard).
   313	 *   - Combined multiplier = contextMult * tierMult.
   314	 *
   315	 * When the result is Infinity, callers should treat stability as Infinity,
   316	 * which makes R(t) = (1 + factor * t / Infinity)^decay = 1.0 for all t.
   317	 *
   318	 * @param contextType    Memory context_type field (e.g. "decision", "research")
   319	 * @param importanceTier Memory importance_tier field (e.g. "constitutional", "normal")
   320	 * @returns Combined stability multiplier (may be Infinity)

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts | sed -n '320,460p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   320	 * @returns Combined stability multiplier (may be Infinity)
   321	 */
   322	function getClassificationDecayMultiplier(contextType: string, importanceTier: string): number {
   323	  const contextMult = CONTEXT_TYPE_STABILITY_MULTIPLIER[contextType] ?? 1.0;
   324	  const tierMult = IMPORTANCE_TIER_STABILITY_MULTIPLIER[importanceTier] ?? 1.0;
   325	
   326	  // Infinity * anything = Infinity (no-decay wins)
   327	  if (!isFinite(contextMult) || !isFinite(tierMult)) {
   328	    return Infinity;
   329	  }
   330	
   331	  return contextMult * tierMult;
   332	}
   333	
   334	/**
   335	 * TM-03: Apply classification-based decay to a stability value.
   336	 * Gated by SPECKIT_CLASSIFICATION_DECAY env var (must be "true" or "1").
   337	 *
   338	 * Returns stability unchanged when the feature flag is disabled.
   339	 * Returns Infinity when the combined multiplier is Infinity (no-decay).
   340	 *
   341	 * @param stability      Base FSRS stability value
   342	 * @param contextType    Memory context_type field
   343	 * @param importanceTier Memory importance_tier field
   344	 * @returns Adjusted stability value
   345	 */
   346	function applyClassificationDecay(
   347	  stability: number,
   348	  contextType: string,
   349	  importanceTier: string
   350	): number {
   351	  if (isHybridDecayPolicyEnabled() && HYBRID_NO_DECAY_CONTEXT_TYPES.has(contextType)) {
   352	    return Infinity;
   353	  }
   354	
   355	  // Graduated: default-ON. Set SPECKIT_CLASSIFICATION_DECAY=false to disable.
   356	  const flag = process.env.SPECKIT_CLASSIFICATION_DECAY?.toLowerCase();
   357	  if (flag === 'false' || flag === '0') {
   358	    return stability;
   359	  }
   360	
   361	  const multiplier = getClassificationDecayMultiplier(contextType, importanceTier);
   362	  if (!isFinite(multiplier)) {
   363	    return Infinity;
   364	  }
   365	
   366	  return stability * multiplier;
   367	}
   368	
   369	/* --- 4b. HYBRID DECAY POLICY (REQ-D4-002) ---
   370	   Gated by SPECKIT_HYBRID_DECAY_POLICY env var (default OFF).
   371	   Distinguishes two classes of memory:
   372	
   373	   1. NO-DECAY documents — context_type in {decision, constitutional, critical}
   374	      These represent permanent knowledge artifacts. Their stability is treated as
   375	      Infinity so R(t) = 1.0 at all times.
   376	
   377	   2. ENGAGEMENT-SENSITIVE documents — all other context_types (session, scratch,
   378	      transient, implementation, discovery, research, general)
   379	      Normal FSRS schedule applies without modification.
   380	
   381	   This is intentionally SEPARATE from TM-03 (applyClassificationDecay) which
   382	   uses a combined context_type × importance_tier multiplier and is default-ON.
   383	   SPECKIT_HYBRID_DECAY_POLICY is default-OFF and must be opted into explicitly.
   384	   DO NOT combine both policies on the same memory. */
   385	
   386	/**
   387	 * Context types that should never decay under the hybrid decay policy.
   388	 * Classified as permanent knowledge artifacts.
   389	 */
   390	const HYBRID_NO_DECAY_CONTEXT_TYPES: ReadonlySet<string> = new Set([
   391	  'planning',
   392	  ...Object.keys(LEGACY_CONTEXT_TYPE_ALIASES).filter(k => LEGACY_CONTEXT_TYPE_ALIASES[k] === 'planning'),
   393	  'constitutional',
   394	  'critical',
   395	]);
   396	const HYBRID_FSRS_CONTEXT_TYPES: ReadonlySet<string> = new Set([
   397	  'session',
   398	  'scratch',
   399	  'transient',
   400	  'implementation',
   401	  'discovery',
   402	  'research',
   403	  'general',
   404	]);
   405	const NO_DECAY = Infinity;
   406	
   407	/**
   408	 * REQ-D4-002: Check whether the hybrid decay policy feature flag is enabled.
   409	 * Default: TRUE (graduated). Set SPECKIT_HYBRID_DECAY_POLICY=false to disable.
   410	 */
   411	function isHybridDecayPolicyEnabled(): boolean {
   412	  const val = process.env.SPECKIT_HYBRID_DECAY_POLICY?.toLowerCase().trim();
   413	  return val !== 'false' && val !== '0';
   414	}
   415	
   416	/**
   417	 * REQ-D4-002: Classify a memory's decay behaviour under the hybrid policy.
   418	 *
   419	 * Returns:
   420	 *   - 'no_decay'       for decision / constitutional / critical context types
   421	 *   - 'fsrs_schedule'  for all engagement-sensitive types (session, scratch, etc.)
   422	 */
   423	type HybridDecayClass = 'no_decay' | 'fsrs_schedule';
   424	
   425	function classifyHybridDecay(contextType: string): HybridDecayClass {
   426	  if (HYBRID_NO_DECAY_CONTEXT_TYPES.has(contextType)) {
   427	    return 'no_decay';
   428	  }
   429	  return 'fsrs_schedule';
   430	}
   431	
   432	function getHybridDecayMultiplier(contextType: string, _importanceTier?: string): number {
   433	  if (!isHybridDecayPolicyEnabled()) {
   434	    return 1;
   435	  }
   436	  return HYBRID_NO_DECAY_CONTEXT_TYPES.has(contextType) ? NO_DECAY : 1;
   437	}
   438	
   439	/**
   440	 * REQ-D4-002: Apply the hybrid decay policy to a stability value.
   441	 *
   442	 * When SPECKIT_HYBRID_DECAY_POLICY is OFF (default), returns stability unchanged.
   443	 * When ON:
   444	 *   - decision / constitutional / critical → returns Infinity (no decay)
   445	 *   - all others → returns stability unchanged (normal FSRS schedule)
   446	 *
   447	 * @param stability    Base FSRS stability value
   448	 * @param contextType  Memory context_type field (classified at save time)
   449	 * @returns Adjusted stability: Infinity for no-decay types, original otherwise
   450	 */
   451	function applyHybridDecayPolicy(stability: number, contextType: string, importanceTier?: string): number {
   452	  const multiplier = getHybridDecayMultiplier(contextType, importanceTier);
   453	  return Number.isFinite(multiplier) ? stability * multiplier : NO_DECAY;
   454	}
   455	
   456	export {
   457	  // Constants
   458	  FSRS_FACTOR,
   459	  FSRS_DECAY,
   460	  FSRS_HALF_LIFE_FACTOR, // T301: derived constant for half-life ↔ stability

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Archival Manager
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Automatic archival subsystem
     5	// Background archival job for dormant/archived memories
     6	import type Database from 'better-sqlite3';
     7	import { clearDegreeCache } from '../search/graph-search-fn.js';
     8	import { clearGraphSignalsCache } from '../graph/graph-signals.js';
     9	
    10	/* ───────────────────────────────────────────────────────────────
    11	   1. DEPENDENCIES (lazy-loaded)
    12	----------------------------------------------------------------*/
    13	
    14	// Lazy-load tier-classifier to avoid circular dependencies
    15	let tierClassifierModule: Record<string, unknown> | null = null;
    16	let tierClassifierModulePromise: Promise<Record<string, unknown> | null> | null = null;
    17	
    18	async function loadTierClassifierModule(): Promise<Record<string, unknown> | null> {
    19	  if (tierClassifierModule !== null) {
    20	    return tierClassifierModule;
    21	  }
    22	  if (tierClassifierModulePromise !== null) {
    23	    return tierClassifierModulePromise;
    24	  }
    25	
    26	  const loadPromise = (async (): Promise<Record<string, unknown> | null> => {
    27	    try {
    28	      tierClassifierModule = await import('./tier-classifier.js');
    29	      return tierClassifierModule;
    30	    } catch (error: unknown) {
    31	      const message = error instanceof Error ? error.message : String(error);
    32	      console.warn(`[archival-manager] tier-classifier module unavailable: ${message}`);
    33	      return null;
    34	    }
    35	  })();
    36	
    37	  tierClassifierModulePromise = loadPromise;
    38	  try {
    39	    return await loadPromise;
    40	  } finally {
    41	    if (tierClassifierModulePromise === loadPromise) {
    42	      tierClassifierModulePromise = null;
    43	    }
    44	  }
    45	}
    46	
    47	function getTierClassifier(): Record<string, unknown> | null {
    48	  if (tierClassifierModule !== null) return tierClassifierModule;
    49	  if (tierClassifierModulePromise === null) {
    50	    void loadTierClassifierModule();
    51	  }
    52	  return null;
    53	}
    54	
    55	interface Bm25IndexModule {
    56	  isBm25Enabled: () => boolean;
    57	  buildBm25DocumentText: (row: Record<string, unknown>) => string;
    58	  getIndex: () => {
    59	    removeDocument: (id: string) => boolean;
    60	    addDocument: (id: string, text: string) => void;
    61	  };
    62	}
    63	
    64	let bm25IndexModule: Bm25IndexModule | null = null;
    65	let bm25IndexModulePromise: Promise<Bm25IndexModule | null> | null = null;
    66	
    67	async function loadBm25IndexModule(): Promise<Bm25IndexModule | null> {
    68	  if (bm25IndexModule !== null) {
    69	    return bm25IndexModule;
    70	  }
    71	  if (bm25IndexModulePromise !== null) {
    72	    return bm25IndexModulePromise;
    73	  }
    74	
    75	  const primaryModulePath = '../search/bm25-index.js';
    76	  const fallbackModulePath = '../../search/bm25-index.js';
    77	
    78	  const loadPromise = (async (): Promise<Bm25IndexModule | null> => {
    79	    try {
    80	      bm25IndexModule = await import(primaryModulePath) as Bm25IndexModule;
    81	      return bm25IndexModule;
    82	    } catch (error: unknown) {
    83	      const primaryError = error instanceof Error ? error.message : String(error);
    84	      try {
    85	        // Support cognitive symlink import path in some runtime setups.
    86	        bm25IndexModule = await import(fallbackModulePath) as Bm25IndexModule;
    87	        return bm25IndexModule;
    88	      } catch (fallbackError: unknown) {
    89	        const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
    90	        console.warn(
    91	          `[archival-manager] bm25-index module unavailable. primary="${primaryError}" fallback="${fallbackMessage}"`
    92	        );
    93	        return null;
    94	      }
    95	    }
    96	  })();
    97	
    98	  bm25IndexModulePromise = loadPromise;
    99	  try {
   100	    return await loadPromise;
   101	  } finally {
   102	    if (bm25IndexModulePromise === loadPromise) {
   103	      bm25IndexModulePromise = null;
   104	    }
   105	  }
   106	}
   107	
   108	function getBm25Index(): Bm25IndexModule | null {
   109	  if (bm25IndexModule !== null) return bm25IndexModule;
   110	  if (bm25IndexModulePromise === null) {
   111	    void loadBm25IndexModule();
   112	  }
   113	  return null;
   114	}
   115	
   116	interface EmbeddingModule {
   117	  generateDocumentEmbedding: (content: string) => Promise<Float32Array | null>;
   118	}
   119	
   120	let embeddingsModule: EmbeddingModule | null = null;
   121	let embeddingsModulePromise: Promise<EmbeddingModule | null> | null = null;
   122	
   123	async function loadEmbeddingsModule(): Promise<EmbeddingModule | null> {
   124	  if (embeddingsModule !== null) {
   125	    return embeddingsModule;
   126	  }
   127	  if (embeddingsModulePromise !== null) {
   128	    return embeddingsModulePromise;
   129	  }
   130	
   131	  const primaryModulePath = '../providers/embeddings.js';
   132	  const fallbackModulePath = '../../providers/embeddings.js';
   133	
   134	  const loadPromise = (async (): Promise<EmbeddingModule | null> => {
   135	    try {
   136	      embeddingsModule = await import(primaryModulePath) as EmbeddingModule;
   137	      return embeddingsModule;
   138	    } catch (error: unknown) {
   139	      const primaryError = error instanceof Error ? error.message : String(error);
   140	      try {
   141	        // Support cognitive symlink import path in some runtime setups.
   142	        embeddingsModule = await import(fallbackModulePath) as EmbeddingModule;
   143	        return embeddingsModule;
   144	      } catch (fallbackError: unknown) {
   145	        const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
   146	        console.warn(
   147	          `[archival-manager] embeddings module unavailable. primary="${primaryError}" fallback="${fallbackMessage}"`
   148	        );
   149	        return null;
   150	      }
   151	    }
   152	  })();
   153	
   154	  embeddingsModulePromise = loadPromise;
   155	  try {
   156	    return await loadPromise;
   157	  } finally {
   158	    if (embeddingsModulePromise === loadPromise) {
   159	      embeddingsModulePromise = null;
   160	    }
   161	  }
   162	}
   163	
   164	function _getEmbeddings(): EmbeddingModule | null {
   165	  if (embeddingsModule !== null) return embeddingsModule;
   166	  if (embeddingsModulePromise === null) {
   167	    void loadEmbeddingsModule();
   168	  }
   169	  return null;
   170	}
   171	
   172	function __setEmbeddingsModuleForTests(module: EmbeddingModule | null): void {
   173	  embeddingsModule = module;
   174	  embeddingsModulePromise = null;
   175	}
   176	
   177	/* ───────────────────────────────────────────────────────────────
   178	   2. CONFIGURATION
   179	----------------------------------------------------------------*/
   180	
   181	interface ArchivalConfigType {
   182	  enabled: boolean;
   183	  scanIntervalMs: number;
   184	  batchSize: number;
   185	  maxAgeDays: number;
   186	  maxAccessCount: number;
   187	  maxConfidence: number;
   188	  protectedTiers: string[];
   189	  backgroundJobIntervalMs: number;
   190	}
   191	
   192	const ARCHIVAL_CONFIG: ArchivalConfigType = {
   193	  enabled: process.env.SPECKIT_ARCHIVAL !== 'false',
   194	  scanIntervalMs: 3600000, // 1 hour
   195	  batchSize: 50,
   196	  maxAgeDays: 90,
   197	  maxAccessCount: 2,
   198	  maxConfidence: 0.4,
   199	  protectedTiers: ['constitutional', 'critical'],
   200	  backgroundJobIntervalMs: 7200000, // 2 hours
   201	};
   202	
   203	/* ───────────────────────────────────────────────────────────────
   204	   3. INTERFACES
   205	----------------------------------------------------------------*/
   206	
   207	interface ArchivalCandidate {
   208	  id: number;
   209	  title: string | null;
   210	  spec_folder: string;
   211	  file_path: string;
   212	  created_at: string;
   213	  importance_tier: string;
   214	  access_count: number;
   215	  confidence: number;
   216	  reason: string;
   217	}
   218	
   219	interface ArchivalStats {
   220	  totalScanned: number;
   221	  totalArchived: number;
   222	  totalUnarchived: number;
   223	  lastScanTime: string | null;
   224	  errors: string[];
   225	}
   226	
   227	/* ───────────────────────────────────────────────────────────────
   228	   4. MODULE STATE
   229	----------------------------------------------------------------*/
   230	
   231	let db: Database.Database | null = null;
   232	let backgroundJob: ReturnType<typeof setInterval> | null = null;
   233	
   234	const archivalStats: ArchivalStats = {
   235	  totalScanned: 0,
   236	  totalArchived: 0,
   237	  totalUnarchived: 0,
   238	  lastScanTime: null,
   239	  errors: [],
   240	};
   241	
   242	/* ───────────────────────────────────────────────────────────────
   243	   5. INITIALIZATION
   244	----------------------------------------------------------------*/
   245	
   246	function init(database: Database.Database): void {
   247	  db = database;
   248	  ensureArchivedColumn();
   249	  ensureArchivalStatsTable();
   250	  loadArchivalStats();
   251	}
   252	
   253	function ensureArchivedColumn(): void {
   254	  if (!db) return;
   255	
   256	  try {
   257	    const columns = (db.prepare('PRAGMA table_info(memory_index)') as Database.Statement).all() as Array<{ name: string }>;
   258	    const hasArchived = columns.some(c => c.name === 'is_archived');
   259	
   260	    if (!hasArchived) {
   261	      db.exec('ALTER TABLE memory_index ADD COLUMN is_archived INTEGER DEFAULT 0');
   262	      db.exec('CREATE INDEX IF NOT EXISTS idx_archived ON memory_index(is_archived)');
   263	      console.error('[archival-manager] Added is_archived column');
   264	    }
   265	  } catch (error: unknown) {
   266	    const msg = error instanceof Error ? error.message : String(error);
   267	    if (!msg.includes('duplicate column')) {
   268	      console.warn(`[archival-manager] ensureArchivedColumn error: ${msg}`);
   269	    }
   270	  }
   271	}
   272	
   273	/**
   274	 * Ensure the archival_stats metadata table exists for persisting stats across restarts (P5-06).
   275	 */
   276	function ensureArchivalStatsTable(): void {
   277	  if (!db) return;
   278	
   279	  try {
   280	    db.exec(`

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Access Tracker
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Access-driven popularity scoring
     5	// Batched access tracking with accumulator
     6	import type Database from 'better-sqlite3';
     7	import { recordAdaptiveSignal } from '../cognitive/adaptive-ranking.js';
     8	
     9	/* ───────────────────────────────────────────────────────────────
    10	   1. CONSTANTS
    11	----------------------------------------------------------------*/
    12	
    13	const ACCUMULATOR_THRESHOLD = 0.5;
    14	const INCREMENT_VALUE = 0.1;
    15	const FLUSH_INTERVAL_MS = 30_000;
    16	const DEFAULT_RECENCY_DECAY_DAYS = 90;
    17	const MAX_USAGE_BOOST = 3.0;
    18	// P4-14 FIX: Cap accumulator Map size to prevent unbounded memory growth
    19	const MAX_ACCUMULATOR_SIZE = 10000;
    20	
    21	function getRecencyDecayDays(): number {
    22	  const configuredDays = process.env.SPECKIT_RECENCY_DECAY_DAYS;
    23	  if (!configuredDays) {
    24	    return DEFAULT_RECENCY_DECAY_DAYS;
    25	  }
    26	
    27	  const parsedDays = Number.parseFloat(configuredDays);
    28	  return Number.isFinite(parsedDays) && parsedDays > 0
    29	    ? parsedDays
    30	    : DEFAULT_RECENCY_DECAY_DAYS;
    31	}
    32	
    33	function clampUsageBoost(boost: number): number {
    34	  return Math.min(boost, MAX_USAGE_BOOST);
    35	}
    36	
    37	function normalizeAccessCount(accessCount: number): number {
    38	  return Number.isFinite(accessCount) && accessCount > 0 ? accessCount : 0;
    39	}
    40	
    41	/* ───────────────────────────────────────────────────────────────
    42	   2. INTERFACES
    43	----------------------------------------------------------------*/
    44	
    45	interface AccumulatorState {
    46	  memoryId: number;
    47	  accumulated: number;
    48	}
    49	
    50	/* ───────────────────────────────────────────────────────────────
    51	   3. MODULE STATE
    52	----------------------------------------------------------------*/
    53	
    54	let db: Database.Database | null = null;
    55	const accumulators = new Map<number, number>();
    56	let exitHandlersInstalled = false;
    57	let flushInterval: ReturnType<typeof setInterval> | null = null;
    58	
    59	/* ───────────────────────────────────────────────────────────────
    60	   4. INITIALIZATION
    61	----------------------------------------------------------------*/
    62	
    63	function init(database: Database.Database): void {
    64	  if (db && db !== database) {
    65	    // A DB swap starts a new accounting context. Pending accumulator state
    66	    // must not bleed into the newly active database.
    67	    accumulators.clear();
    68	  }
    69	  db = database;
    70	  initExitHandlers();
    71	  if (!flushInterval) {
    72	    flushInterval = setInterval(() => {
    73	      reset();
    74	    }, FLUSH_INTERVAL_MS);
    75	    flushInterval.unref?.();
    76	  }
    77	}
    78	
    79	/* ───────────────────────────────────────────────────────────────
    80	   5. CORE FUNCTIONS
    81	----------------------------------------------------------------*/
    82	
    83	/**
    84	 * Track a memory access, accumulating until threshold is reached.
    85	 */
    86	function trackAccess(memoryId: number): boolean {
    87	  // P4-14 FIX: If accumulator map exceeds max size, flush all and clear
    88	  // To prevent unbounded memory growth.
    89	  if (accumulators.size > MAX_ACCUMULATOR_SIZE) {
    90	    console.warn(`[access-tracker] Accumulator map exceeded ${MAX_ACCUMULATOR_SIZE} entries, flushing all`);
    91	    if (db) {
    92	      for (const [id] of accumulators) {
    93	        flushAccessCounts(id);
    94	      }
    95	    }
    96	    accumulators.clear();
    97	  }
    98	
    99	  const current = accumulators.get(memoryId) || 0;
   100	  const newValue = current + INCREMENT_VALUE;
   101	
   102	  if (newValue >= ACCUMULATOR_THRESHOLD) {
   103	    // Flush to database
   104	    const success = flushAccessCounts(memoryId);
   105	    if (success) {
   106	      accumulators.delete(memoryId);
   107	    } else {
   108	      accumulators.set(memoryId, newValue);
   109	    }
   110	    return success;
   111	  }
   112	
   113	  accumulators.set(memoryId, newValue);
   114	  return true;
   115	}
   116	
   117	/**
   118	 * Track multiple accesses at once.
   119	 */
   120	function trackMultipleAccesses(memoryIds: number[]): { tracked: number; flushed: number } {
   121	  let tracked = 0;
   122	  let flushed = 0;
   123	
   124	  for (const id of memoryIds) {
   125	    const current = accumulators.get(id) || 0;
   126	    const newValue = current + INCREMENT_VALUE;
   127	
   128	    if (newValue >= ACCUMULATOR_THRESHOLD) {
   129	      const success = flushAccessCounts(id);
   130	      if (success) {
   131	        flushed++;
   132	        accumulators.delete(id);
   133	      } else {
   134	        accumulators.set(id, newValue);
   135	      }
   136	    } else {
   137	      accumulators.set(id, newValue);
   138	    }
   139	    tracked++;
   140	  }
   141	
   142	  return { tracked, flushed };
   143	}
   144	
   145	/**
   146	 * Flush accumulated access count to database.
   147	 */
   148	function flushAccessCounts(memoryId: number): boolean {
   149	  if (!db) {
   150	    console.warn('[access-tracker] Database not initialized. Server may still be starting up.');
   151	    return false;
   152	  }
   153	
   154	  try {
   155	    const now = Date.now();
   156	    const result = (db.prepare(`
   157	      UPDATE memory_index
   158	      SET access_count = access_count + 1,
   159	          last_accessed = ?
   160	      WHERE id = ?
   161	    `) as Database.Statement).run(now, memoryId);
   162	
   163	    if ((result as { changes: number }).changes > 0) {
   164	      try {
   165	        recordAdaptiveSignal(db, {
   166	          memoryId,
   167	          signalType: 'access',
   168	          signalValue: 1,
   169	          actor: 'access-tracker',
   170	        });
   171	      } catch (_error: unknown) {
   172	        // Adaptive signal capture must never block core access tracking
   173	      }
   174	    }
   175	
   176	    return (result as { changes: number }).changes > 0;
   177	  } catch (error: unknown) {
   178	    const msg = error instanceof Error ? error.message : String(error);
   179	    console.warn(`[access-tracker] flushAccessCounts error: ${msg}`);
   180	    return false;
   181	  }
   182	}
   183	
   184	/**
   185	 * Get accumulator state for a memory.
   186	 */
   187	function getAccumulatorState(memoryId: number): AccumulatorState {
   188	  return {
   189	    memoryId,
   190	    accumulated: accumulators.get(memoryId) || 0,
   191	  };
   192	}
   193	
   194	/**
   195	 * Calculate popularity score based on access patterns.
   196	 *
   197	 * @returns Popularity score in the range [0, 1].
   198	 */
   199	function calculatePopularityScore(
   200	  accessCount: number,
   201	  lastAccessed: number | null,
   202	  _createdAt: string | null
   203	): number {
   204	  const safeAccessCount = normalizeAccessCount(accessCount);
   205	  if (safeAccessCount === 0) return 0;
   206	
   207	  // Access frequency component
   208	  const freqScore = Math.min(1.0, Math.log2(safeAccessCount + 1) / 5);
   209	
   210	  // Recency component
   211	  let recencyScore = 0;
   212	  if (lastAccessed) {
   213	    const ageMs = Date.now() - lastAccessed;
   214	    const ageDays = ageMs / (1000 * 60 * 60 * 24);
   215	    const decayDays = getRecencyDecayDays();
   216	    recencyScore = Math.max(0, Math.min(1, 1 - (ageDays / decayDays)));
   217	  }
   218	
   219	  return (freqScore * 0.6) + (recencyScore * 0.4);
   220	}
   221	
   222	/**
   223	 * Calculate usage boost for search ranking.
   224	 *
   225	 * @returns Usage boost in the range [0, 3.0].
   226	 */
   227	function calculateUsageBoost(accessCount: number, lastAccessed: number | null): number {
   228	  const safeAccessCount = normalizeAccessCount(accessCount);
   229	  if (safeAccessCount === 0) return 0;
   230	
   231	  const boost = Math.min(0.2, safeAccessCount * 0.02);
   232	
   233	  // Extra boost for recently accessed
   234	  if (lastAccessed) {
   235	    const ageMs = Date.now() - lastAccessed;
   236	    const ageHours = ageMs / (1000 * 60 * 60);
   237	    if (ageHours < 1) return clampUsageBoost(boost * 2);
   238	    if (ageHours < 24) return clampUsageBoost(boost * 1.5);
   239	  }
   240	
   241	  return clampUsageBoost(boost);
   242	}
   243	
   244	/**
   245	 * Reset all accumulators.
   246	 */
   247	function reset(): void {
   248	  // Flush remaining accumulators before reset
   249	  if (db) {
   250	    for (const [id] of accumulators) {
   251	      flushAccessCounts(id);
   252	    }
   253	  }
   254	  accumulators.clear();
   255	}
   256	
   257	/* ───────────────────────────────────────────────────────────────
   258	   6. EXIT HANDLERS
   259	----------------------------------------------------------------*/
   260	

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Working Memory
     3	// ───────────────────────────────────────────────────────────────
     4	// Session-based attention management
     5	// DECAY STRATEGY (ADR-004): This module handles SESSION-SCOPED decay
     6	// Only (event-distance based: score * pow(0.85, eventsElapsed)). It operates on
     7	// The working_memory table, NOT memory_index. This is intentionally
     8	// Independent of FSRS long-term decay — different time scale, different
     9	// Domain (ephemeral session attention vs persistent memory scoring).
    10	// The T214/T008 decay/delete separation (floor=0.05, deleteThreshold=0.01)
    11	// Ensures stable resting state and explicit low-score eviction.
    12	import type Database from 'better-sqlite3';
    13	import { isFeatureEnabled } from './rollout-policy.js';
    14	
    15	// Feature catalog: Tool-result extraction to working memory
    16	// Feature catalog: Working Memory Session Cleanup Timestamp Fix
    17	
    18	
    19	/* --- 1. CONFIGURATION --- */
    20	
    21	interface WorkingMemoryConfigType {
    22	  enabled: boolean;
    23	  maxCapacity: number;
    24	  sessionTimeoutMs: number;
    25	}
    26	
    27	const WORKING_MEMORY_CONFIG: WorkingMemoryConfigType = {
    28	  enabled: process.env.SPECKIT_WORKING_MEMORY !== 'false',
    29	  maxCapacity: 7, // Miller's Law: 7 +/- 2
    30	  sessionTimeoutMs: 1800000, // 30 minutes
    31	};
    32	
    33	const EVENT_DECAY_FACTOR = 0.85;
    34	const MENTION_BOOST_FACTOR = 0.05;
    35	const DECAY_FLOOR = 0.05;
    36	const DELETE_THRESHOLD = 0.01;
    37	const EVENT_COUNTER_MODULUS = 2 ** 31;
    38	// Cap mention_count to prevent unbounded integer growth in long-lived
    39	// Sessions. The mention boost formula (mention_count * MENTION_BOOST_FACTOR)
    40	// Would produce unreasonably large scores without a ceiling.
    41	const MAX_MENTION_COUNT = 100;
    42	
    43	/* --- 2. SCHEMA SQL --- */
    44	
    45	const SCHEMA_SQL = `
    46	  CREATE TABLE IF NOT EXISTS working_memory (
    47	    id INTEGER PRIMARY KEY AUTOINCREMENT,
    48	    session_id TEXT NOT NULL,
    49	    memory_id INTEGER,
    50	    attention_score REAL DEFAULT 1.0,
    51	    added_at TEXT DEFAULT CURRENT_TIMESTAMP,
    52	    last_focused TEXT DEFAULT CURRENT_TIMESTAMP,
    53	    focus_count INTEGER DEFAULT 1,
    54	    event_counter INTEGER NOT NULL DEFAULT 0,
    55	    mention_count INTEGER NOT NULL DEFAULT 0,
    56	    source_tool TEXT,
    57	    source_call_id TEXT,
    58	    extraction_rule_id TEXT,
    59	    redaction_applied INTEGER NOT NULL DEFAULT 0,
    60	    UNIQUE(session_id, memory_id),
    61	    FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE SET NULL
    62	  )
    63	`;
    64	
    65	const INDEX_SQL = `
    66	  CREATE INDEX IF NOT EXISTS idx_wm_session ON working_memory(session_id);
    67	  CREATE INDEX IF NOT EXISTS idx_wm_attention ON working_memory(session_id, attention_score DESC);
    68	  CREATE INDEX IF NOT EXISTS idx_wm_added ON working_memory(added_at);
    69	  CREATE INDEX IF NOT EXISTS idx_wm_session_focus_lru ON working_memory(session_id, last_focused ASC, id ASC);
    70	  CREATE INDEX IF NOT EXISTS idx_wm_session_attention_focus ON working_memory(session_id, attention_score DESC, last_focused DESC);
    71	`;
    72	
    73	/* --- 3. INTERFACES --- */
    74	
    75	interface WorkingMemoryEntry {
    76	  id: number;
    77	  session_id: string;
    78	  memory_id: number;
    79	  attention_score: number;
    80	  added_at: string;
    81	  last_focused: string;
    82	  focus_count: number;
    83	  event_counter: number;
    84	  mention_count: number;
    85	  source_tool?: string | null;
    86	  source_call_id?: string | null;
    87	  extraction_rule_id?: string | null;
    88	  redaction_applied?: number;
    89	}
    90	
    91	interface ExtractedEntryInput {
    92	  sessionId: string;
    93	  memoryId: number;
    94	  attentionScore: number;
    95	  sourceTool: string;
    96	  sourceCallId: string;
    97	  extractionRuleId: string;
    98	  redactionApplied: boolean;
    99	}
   100	
   101	interface SessionInfo {
   102	  sessionId: string;
   103	  memoryCount: number;
   104	  avgAttention: number;
   105	  createdAt: string;
   106	  lastActivity: string;
   107	}
   108	
   109	interface SessionStats {
   110	  sessionId: string;
   111	  totalEntries: number;
   112	  avgAttention: number;
   113	  maxAttention: number;
   114	  minAttention: number;
   115	  totalFocusEvents: number;
   116	}
   117	
   118	interface SessionPromptContextEntry {
   119	  memoryId: number;
   120	  title: string;
   121	  filePath: string;
   122	  attentionScore: number;
   123	}
   124	
   125	/* --- 4. MODULE STATE --- */
   126	
   127	let db: Database.Database | null = null;
   128	let schemaEnsured = false;
   129	const sessionModeRegistry = new Map<string, string>();
   130	
   131	/* --- 5. INITIALIZATION --- */
   132	
   133	function init(database: Database.Database): void {
   134	  db = database;
   135	  schemaEnsured = false;
   136	  ensureSchema();
   137	}
   138	
   139	function ensureSchema(): void {
   140	  if (!db || schemaEnsured) return;
   141	
   142	  try {
   143	    db.exec(SCHEMA_SQL);
   144	    const wmColumns = (db.prepare('PRAGMA table_info(working_memory)').all() as Array<{ name: string }>)
   145	      .map(column => column.name);
   146	
   147	    if (!wmColumns.includes('event_counter')) {
   148	      db.exec('ALTER TABLE working_memory ADD COLUMN event_counter INTEGER NOT NULL DEFAULT 0');
   149	    }
   150	    if (!wmColumns.includes('mention_count')) {
   151	      db.exec('ALTER TABLE working_memory ADD COLUMN mention_count INTEGER NOT NULL DEFAULT 0');
   152	    }
   153	    if (!wmColumns.includes('source_tool')) {
   154	      db.exec('ALTER TABLE working_memory ADD COLUMN source_tool TEXT');
   155	    }
   156	    if (!wmColumns.includes('source_call_id')) {
   157	      db.exec('ALTER TABLE working_memory ADD COLUMN source_call_id TEXT');
   158	    }
   159	    if (!wmColumns.includes('extraction_rule_id')) {
   160	      db.exec('ALTER TABLE working_memory ADD COLUMN extraction_rule_id TEXT');
   161	    }
   162	    if (!wmColumns.includes('redaction_applied')) {
   163	      db.exec('ALTER TABLE working_memory ADD COLUMN redaction_applied INTEGER NOT NULL DEFAULT 0');
   164	    }
   165	
   166	    migrateLegacyWorkingMemorySchema();
   167	    db.exec(INDEX_SQL);
   168	    schemaEnsured = true;
   169	  } catch (error: unknown) {
   170	    const msg = error instanceof Error ? error.message : String(error);
   171	    console.warn(`[working-memory] Schema creation failed: ${msg}`);
   172	  }
   173	}
   174	
   175	function migrateLegacyWorkingMemorySchema(): void {
   176	  if (!db) return;
   177	
   178	  const tableInfo = db.prepare(
   179	    "SELECT sql FROM sqlite_master WHERE type='table' AND name='working_memory'"
   180	  ).get() as { sql?: string | null } | undefined;
   181	  const tableSql = tableInfo?.sql ?? '';
   182	  const needsMigration = tableSql.includes('ON DELETE CASCADE') || tableSql.includes('memory_id INTEGER NOT NULL');
   183	
   184	  if (!needsMigration) {
   185	    return;
   186	  }
   187	
   188	  db.exec(`
   189	    ALTER TABLE working_memory RENAME TO working_memory_old;
   190	    ${SCHEMA_SQL};
   191	    INSERT INTO working_memory (
   192	      id,
   193	      session_id,
   194	      memory_id,
   195	      attention_score,
   196	      added_at,
   197	      last_focused,
   198	      focus_count,
   199	      event_counter,
   200	      mention_count,
   201	      source_tool,
   202	      source_call_id,
   203	      extraction_rule_id,
   204	      redaction_applied
   205	    )
   206	    SELECT
   207	      id,
   208	      session_id,
   209	      memory_id,
   210	      attention_score,
   211	      added_at,
   212	      last_focused,
   213	      focus_count,
   214	      COALESCE(event_counter, 0),
   215	      COALESCE(mention_count, 0),
   216	      source_tool,
   217	      source_call_id,
   218	      extraction_rule_id,
   219	      COALESCE(redaction_applied, 0)
   220	    FROM working_memory_old;
   221	    DROP TABLE working_memory_old;
   222	  `);
   223	}
   224	
   225	/* --- 6. SESSION MANAGEMENT --- */
   226	
   227	function getOrCreateSession(sessionId: string | null = null): string {
   228	  if (sessionId) return sessionId;
   229	
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts | sed -n '300,460p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   371	function calculateTier(attentionScore: number): string {
   372	  if (attentionScore >= 0.8) return 'focused';
   373	  if (attentionScore >= 0.5) return 'active';
   374	  if (attentionScore >= 0.2) return 'peripheral';
   375	  return 'fading';
   376	}
   377	
   378	/**
   379	 * Set or update the attention score for a memory in working memory.
   380	 */
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts | sed -n '120,190p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   120	  embeddingStatus?: string;
   121	  postMutationHooks?: ReturnType<typeof buildMutationHookFeedback>['data'];
   122	  hints?: string[];
   123	}
   124	
   125	export interface SaveArgs {
   126	  filePath: string;
   127	  force?: boolean;
   128	  dryRun?: boolean;
   129	  skipPreflight?: boolean;
   130	  asyncEmbedding?: boolean; // When true, embedding generation is deferred (non-blocking)
   131	  tenantId?: string;
   132	  userId?: string;
   133	  agentId?: string;
   134	  sessionId?: string;
   135	  sharedSpaceId?: string;
   136	  provenanceSource?: string;
   137	  provenanceActor?: string;
   138	  governedAt?: string;
   139	  retentionPolicy?: 'keep' | 'ephemeral' | 'shared';
   140	  deleteAfter?: string;
   141	}
   142	
   143	export interface PostInsertMetadataFields {
   144	  content_hash?: string;
   145	  context_type?: string;
   146	  importance_tier?: string;
   147	  memory_type?: string;
   148	  type_inference_source?: string;
   149	  stability?: number;
   150	  difficulty?: number;
   151	  review_count?: number;
   152	  file_mtime_ms?: number | null;
   153	  embedding_status?: string;
   154	  encoding_intent?: string | null;
   155	  document_type?: string;
   156	  spec_level?: number | null;
   157	  quality_score?: number;
   158	  quality_flags?: string; // pre-stringified JSON
   159	  parent_id?: number;
   160	  chunk_index?: number;
   161	  chunk_label?: string;
   162	  tenant_id?: string;
   163	  user_id?: string;
   164	  agent_id?: string;
   165	  shared_space_id?: string;
   166	  provenance_source?: string;
   167	  provenance_actor?: string;
   168	  governed_at?: string;
   169	  retention_policy?: string;
   170	  delete_after?: string | null;
   171	  governance_metadata?: string;
   172	}
   173	
   174	export type { ParsedMemory };
   175	
   176	export interface MemoryScopeMatch {
   177	  tenantId?: string | null;
   178	  userId?: string | null;
   179	  agentId?: string | null;
   180	  sessionId?: string | null;
   181	  sharedSpaceId?: string | null;
   182	}
   183	
   184	export function normalizeScopeMatchValue(value?: string | null): string | null {
   185	  if (typeof value !== 'string') return null;
   186	  const normalized = value.trim();
   187	  return normalized.length > 0 ? normalized : null;
   188	}

exec
/bin/zsh -lc 'rg -n "batchUpdateScores|EVENT_DECAY_FACTOR|DELETE_THRESHOLD|DECAY_FLOOR|decay" .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
5:// DECAY STRATEGY (ADR-004): This module handles SESSION-SCOPED decay
8:// Independent of FSRS long-term decay — different time scale, different
10:// The T214/T008 decay/delete separation (floor=0.05, deleteThreshold=0.01)
33:const EVENT_DECAY_FACTOR = 0.85;
35:const DECAY_FLOOR = 0.05;
36:const DELETE_THRESHOLD = 0.01;
325:function getSessionPromptContext(sessionId: string, floor: number = DECAY_FLOOR, limit: number = 5): SessionPromptContextEntry[] {
550: * Batch update attention scores with decay.
552: * Separates the decay floor from the delete threshold to prevent the
553: * decay/delete race condition:
554: *   - decayFloor (0.05): scores are clamped here, never decay below this
560:function batchUpdateScores(sessionId: string): number {
602:        const decayBase = entry.attention_score * Math.pow(EVENT_DECAY_FACTOR, eventsElapsed);
604:        const rawScore = decayBase + mentionBoost;
606:        if (rawScore < DELETE_THRESHOLD) {
612:        // Clamp to [DECAY_FLOOR, 1.0].
614:        const nextScore = Math.max(DECAY_FLOOR, Math.min(1.0, rawScore));
623:    console.warn(`[working-memory] batchUpdateScores error: ${msg}`);
746:  batchUpdateScores,
747:  DECAY_FLOOR,
748:  DELETE_THRESHOLD,
749:  EVENT_DECAY_FACTOR,

exec
/bin/zsh -lc "rg -n \"retention_policy|delete_after|deleteAfter|retentionPolicy|ephemeral|shared|keep\" .opencode/skill/system-spec-kit/mcp_server/handlers/save .opencode/skill/system-spec-kit/mcp_server | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:72:} from '@spec-kit/shared/embeddings/factory';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1581:  // in shared embeddings, so startup no longer branches on shouldEagerWarmup().
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:32:Publication-facing metric rows now use the shared measurement contract from `lib/context/shared-payload.ts`.
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:56:- The current dashboard reader remains aggregate-only. Future export or publication surfaces should import the shared gate helper instead of re-encoding eligibility logic in handler-local code.
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:90:| `SPECKIT_DB_DIR` | (auto-detected) | string | Override database directory path. Also accepts `SPEC_KIT_DB_DIR`. | `core/config.ts`, `shared/config.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:107:| `SPECKIT_RRF` | `true` | boolean | Master switch for Reciprocal Rank Fusion. Graduated ON. | `shared/algorithms/rrf-fusion.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:108:| `SPECKIT_RRF_K` | `40` | number | RRF smoothing constant `k`. Lower = more top-heavy ranking, higher = flatter. Must be > 0. | `shared/algorithms/rrf-fusion.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:120:| `SPECKIT_ADAPTIVE_FUSION` | `true` | boolean | Intent-aware adaptive fusion with document-type weight shifting. Graduated ON. | `shared/algorithms/adaptive-fusion.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:141:| `SPECKIT_DOC_TYPE_WEIGHT_FACTOR` | `1.2` | number | Proportional weight shift factor per document type in adaptive fusion (20% shift at 1.2). | `shared/algorithms/adaptive-fusion.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:265:| `SPECKIT_MEMORY_ROADMAP_PHASE` | `shared-rollout` | string | Active memory roadmap phase: `baseline`, `lineage`, `graph`, `adaptive`, `scope-governance`, `shared-rollout`. | `lib/config/capability-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:272:| `SPECKIT_SHARED_MEMORY_ADMIN_USER_ID` | (none) | string | Admin user ID override for shared memory operations. | `handlers/shared-memory.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:273:| `SPECKIT_SHARED_MEMORY_ADMIN_AGENT_ID` | (none) | string | Admin agent ID override for shared memory operations. | `handlers/shared-memory.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:349:| `SPECKIT_EMBEDDING_CIRCUIT_BREAKER` | `true` | boolean | Circuit breaker for embedding model failures. Graduated ON. | `shared/embeddings.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:350:| `SPECKIT_EMBEDDING_CB_THRESHOLD` | `3` | number | Consecutive failure count before circuit breaker opens. | `shared/embeddings.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:351:| `SPECKIT_EMBEDDING_CB_COOLDOWN_MS` | `60000` | number | Cooldown period in ms before circuit breaker resets (min 1000). | `shared/embeddings.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:363:| `SPECKIT_MEMORY_ROADMAP_PHASE` | `SPECKIT_HYDRA_PHASE` | `shared-rollout` | string | Active roadmap phase. |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:418:# Enable shared memory spaces
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:106:  const sharedSpaceId = normalizeScopeMatchValue(scope.sharedSpaceId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:118:      AND ((? IS NULL AND shared_space_id IS NULL) OR shared_space_id = ?)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:133:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:134:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:15:import type { WeightedDocumentSections } from '@spec-kit/shared/index';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:4:// MCP handler layer for shared-space CRUD, membership assignment,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:18:} from '../lib/collab/shared-spaces.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:31:type SharedSpaceAdminTool = 'shared_space_upsert' | 'shared_space_membership_set';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:32:type SharedAdminTool = SharedSpaceAdminTool | 'shared_memory_enable';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:33:type SharedIdentityTool = SharedAdminTool | 'shared_memory_status';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:87: * Resolve the shared-memory admin identity from server-owned configuration.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:108:        details: { reason: 'shared_memory_admin_unconfigured' },
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:123:        details: { reason: 'shared_memory_admin_ambiguous' },
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:184:      'Caller authentication is required for shared-memory operations.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:187:        error: 'Caller authentication is required for shared-memory operations.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:214:  if (args.tool !== 'shared_memory_enable' && normalizedTenantId.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:216:      'Tenant scope is required for shared-memory admin mutations.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:219:        error: 'Tenant scope is required for shared-memory admin mutations.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:221:        reason: 'shared_space_tenant_required',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:222:        hint: 'Provide the tenantId for the target shared-space mutation.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:239:        reason: 'shared_memory_trusted_binding_required',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:263:  sharedSpaceId?: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:266:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:272:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:291:    action: 'shared_space_admin',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:310:    case 'shared_space_not_found':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:312:    case 'shared_space_create_admin_required':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:313:      return `Only the configured shared-memory admin can create shared space "${spaceId}".`;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:314:    case 'shared_space_tenant_mismatch':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:316:    case 'shared_space_owner_required':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:317:      return tool === 'shared_space_membership_set'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:318:        ? `Only a shared-space owner can update membership for "${spaceId}".`
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:319:        : `Only a shared-space owner can update "${spaceId}".`;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:320:    case 'shared_space_editor_required':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:322:    case 'shared_space_membership_required':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:323:      return `Membership is required to manage shared space "${spaceId}".`;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:324:    case 'shared_space_kill_switch':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:326:    case 'shared_space_rollout_disabled':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:328:    case 'shared_space_tenant_required':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:329:      return 'Tenant scope is required to manage shared spaces.';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:336:  return reason === 'shared_space_membership_required'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:337:    ? 'shared_space_owner_required'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:349:    code: reason === 'shared_space_not_found' ? 'E_NOT_FOUND' : 'E_AUTHORIZATION',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:352:      hint: reason === 'shared_space_not_found'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:353:        ? 'Create the space first with shared_space_upsert.'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:354:        : reason === 'shared_space_create_admin_required'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:355:          ? 'Authenticate as the configured shared-memory admin before creating a new shared space.'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:356:        : 'Use the tenant owner identity for this shared space.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:363:    tool: 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:368:      hint: 'Authenticate as the configured shared-memory admin before enabling shared memory.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:374:  tool: 'shared_space_upsert' | 'shared_space_membership_set' | 'shared_memory_status' | 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:380:  console.error(`[shared-memory] ${tool} failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:385:    details: { reason: 'shared_memory_internal_error' },
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:402:  console.warn('[shared-memory] Admin operation using caller-supplied identity — assumes trusted transport');
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:421:    FROM shared_space_members m
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:422:    JOIN shared_spaces s ON s.space_id = m.space_id
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:439: * Persist a shared-space definition for rollout and membership checks.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:442: * @returns MCP success response describing the saved shared space.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:454:        tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:455:        error: 'Shared memory is not enabled. Run /memory:manage shared enable first.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:461:      tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:472:        FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:490:            const reason = normalizeOwnerAdminDenyReason(access.reason ?? 'shared_space_owner_required');
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:505:              msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:511:        const reason = 'shared_space_create_admin_required';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:526:          msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:566:        FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:598:      return createSharedSpaceAuthError('shared_space_upsert', result.error, result.msg);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:602:      tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:621:      'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:630: * Persist membership for a user or agent within a shared space.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:645:        tool: 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:646:        error: 'Shared memory is not enabled. Run /memory:manage shared enable first.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:652:      tool: 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:665:        const reason = normalizeOwnerAdminDenyReason(access.reason ?? 'shared_space_owner_required');
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:684:          console.error(`[shared-memory] Failed to record shared_space_admin audit: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:687:          'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:689:          getSharedSpaceAccessErrorMessage('shared_space_membership_set', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:720:      tool: 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:738:      'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:747: * Report rollout status and visible shared spaces for the requested scope.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:756:      tool: 'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:765:      tool: 'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:768:        : 'Shared memory disabled — run /memory:manage shared enable to set up',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:785:      'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:794: * Enable the shared-memory subsystem via first-run setup.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:805:      tool: 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:811:        'shared_memory_enable_admin_required',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:812:        'Only the configured shared-memory admin can enable shared memory.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:823:        .get('shared_memory_enabled') as { value: string } | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:834:        tool: 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:850:      tool: 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:866:      'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:875: * Write a README into the shared-spaces directory (skip if already exists).
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:880:  const dir = path.resolve(import.meta.dirname, '../../shared-spaces');
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:901:- **Spaces** — Named containers for shared memories, scoped to a tenant.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:910:| \`/memory:manage shared status\` | View rollout state and accessible spaces |
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:911:| \`/memory:manage shared create <spaceId> <tenantId> <name>\` | Create or update a shared space; first creator becomes owner |
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:912:| \`/memory:manage shared member <spaceId> <type> <id> <role>\` | Set membership; caller must already own the space |
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:913:| \`/memory:manage shared enable\` | Re-run first-time setup (idempotent) |
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:917:Set \`SPECKIT_MEMORY_SHARED_MEMORY=true\` to force-enable shared memory regardless of database state.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:6:import type { MemorySufficiencyResult } from '@spec-kit/shared/parsing/memory-sufficiency';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:37:export type AssistiveClassification = 'supersede' | 'complement' | 'keep_separate';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:135:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:139:  retentionPolicy?: 'keep' | 'ephemeral' | 'shared';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:140:  deleteAfter?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:165:  shared_space_id?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:169:  retention_policy?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:170:  delete_after?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:181:  sharedSpaceId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:59:/** Partial embedding provider metadata — see shared/types.ts ProviderMetadata for the full shape. */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:25:} from '../lib/context/shared-payload.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:35:import type { MCPResponse } from '@spec-kit/shared/types';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:25:} from '../lib/context/shared-payload.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:35:import type { MCPResponse } from '@spec-kit/shared/types';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:462:  // ── Sub-call 3: CocoIndex availability (F046/F051: shared helper) ──
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:189:      // Safe-swap mode for re-chunking: keep existing children intact until
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:380:      // callers and older implementations that might bypass the shared transaction.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:82:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:94:  sessionScope: 'caller' | 'ephemeral';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:119:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:707:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:728:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:759:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:793:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1241:    sessionScope: requestedSessionId ? 'caller' : 'ephemeral',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1284:    sharedSpaceId: args.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:71: *   sim < 0.88          → keep separate (complement)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:78:): 'auto_merge' | 'review' | 'keep_separate' {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:81:  return 'keep_separate';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:171:  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:177:  // Reconsolidation.ts keeps an internal guard as a defensive fallback for
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:213:                if (scope?.sharedSpaceId && r.shared_space_id && r.shared_space_id !== scope.sharedSpaceId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:437:        // 'keep_separate' → no action, fall through to normal save
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:24:import { MEMORY_SUFFICIENCY_REJECTION_CODE } from '@spec-kit/shared/parsing/memory-sufficiency';
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:78:type SharedMemoryModule = typeof import('./shared-memory.js');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:96:let sharedMemoryModule: Promise<SharedMemoryModule> | null = null;
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:193:  if (!sharedMemoryModule) {
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:194:    sharedMemoryModule = loadHandlerModule<SharedMemoryModule>('shared-memory');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:196:  return sharedMemoryModule;
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:13:} from '../../lib/context/shared-payload.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:35:  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:49:      sharedSpaceId: scope?.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:9:} from '@spec-kit/shared/parsing/memory-sufficiency';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:10:import { MEMORY_SUFFICIENCY_REJECTION_CODE } from '@spec-kit/shared/parsing/memory-sufficiency';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:13:} from '@spec-kit/shared/parsing/memory-template-contract';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:24:import { MEMORY_SUFFICIENCY_REJECTION_CODE } from '@spec-kit/shared/parsing/memory-sufficiency';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:106:  const sharedSpaceId = normalizeScopeMatchValue(scope.sharedSpaceId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:118:      AND ((? IS NULL AND shared_space_id IS NULL) OR shared_space_id = ?)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:133:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:134:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:5:import { validateFilePath } from '@spec-kit/shared/utils/path-security';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:115:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:292:  const { specFolder, tenantId, userId, agentId, sharedSpaceId } = args;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:293:  if (specFolder || tenantId || userId || agentId || sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:300:          SELECT id, spec_folder, tenant_id, user_id, agent_id, shared_space_id
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:308:          shared_space_id?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:320:          if (sharedSpaceId && row.shared_space_id !== sharedSpaceId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:7:import type { MemoryEvidenceSnapshot } from '@spec-kit/shared/parsing/memory-sufficiency';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:7:import type { MemoryEvidenceSnapshot } from '@spec-kit/shared/parsing/memory-sufficiency';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:23:  ['shared_space_id', 'sharedSpaceId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:61:    sharedSpaceId: normalizeScopeMatchValue(scope.sharedSpaceId),
.opencode/skill/system-spec-kit/mcp_server/README.md:47:Spec Kit Memory is a Model Context Protocol (MCP) server that gives AI assistants persistent memory. It stores decisions, code context and project history in a local SQLite database, then finds exactly what is relevant when you need it. Think of it like a personal librarian that keeps notes on every conversation, files them by topic and hands you the right ones when you start a new task.
.opencode/skill/system-spec-kit/mcp_server/README.md:91:| `/memory:manage` | Database maintenance, checkpoints, bulk ingestion, shared-memory spaces and memberships | 19 primary tools + 1 helper |
.opencode/skill/system-spec-kit/mcp_server/README.md:93:| `/spec_kit:resume` | Continue or recover an interrupted spec-folder session through the broader memory/session recovery stack | Broad helper surface; primary chain uses 3 shared memory tools |
.opencode/skill/system-spec-kit/mcp_server/README.md:402:**Reconsolidation-on-save** -- handles near-duplicates intelligently. Nearly identical content gets merged. Contradictions retire the old version. Different content keeps both. Like a filing clerk who reads the new document, checks the cabinet and makes an informed decision instead of just stuffing it in.
.opencode/skill/system-spec-kit/mcp_server/README.md:410:**Auto-entity extraction** -- spots tool names, project names and concept names when you save and adds them to a shared catalog. Connects memories mentioning the same things even when surrounding text differs completely.
.opencode/skill/system-spec-kit/mcp_server/README.md:422:The system keeps track of what happened during your current conversation so it does not repeat itself or lose context mid-session.
.opencode/skill/system-spec-kit/mcp_server/README.md:436:Think of it like a shared office with a keycard lock. The office stays locked until an admin activates it. Only people on the access list can enter. Management can lock it down instantly if something goes wrong.
.opencode/skill/system-spec-kit/mcp_server/README.md:438:- **Spaces** -- named containers for shared knowledge (like rooms in the office)
.opencode/skill/system-spec-kit/mcp_server/README.md:443:For the full shared memory guide, see [SHARED_MEMORY_DATABASE.md](../SHARED_MEMORY_DATABASE.md).
.opencode/skill/system-spec-kit/mcp_server/README.md:495:The system keeps the index accurate and performant as your project evolves.
.opencode/skill/system-spec-kit/mcp_server/README.md:576:| `sharedSpaceId` | string | Shared-space boundary for governed retrieval |
.opencode/skill/system-spec-kit/mcp_server/README.md:634:| `sharedSpaceId` | string | Shared-memory boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:669:| `sharedSpaceId` | string | Shared-memory boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:710:| `retentionPolicy` | string | `keep` (default), `ephemeral`, `shared` |
.opencode/skill/system-spec-kit/mcp_server/README.md:711:| `deleteAfter` | string | ISO date for automatic deletion |
.opencode/skill/system-spec-kit/mcp_server/README.md:716:| `sharedSpaceId` | string | Governance: shared-space target |
.opencode/skill/system-spec-kit/mcp_server/README.md:832:The cleanup tool for large-scale housekeeping. Delete all outdated or temporary memories in one go based on their importance level, like clearing out the recycling bin. The most important memories get extra protection. A safety checkpoint is created first so you can restore if needed.
.opencode/skill/system-spec-kit/mcp_server/README.md:891:##### `shared_space_upsert`
.opencode/skill/system-spec-kit/mcp_server/README.md:893:Create or update a shared-memory space. Shared spaces start locked: nobody can read or write until you add members with `shared_space_membership_set`. The person or agent who creates the space automatically becomes its owner.
.opencode/skill/system-spec-kit/mcp_server/README.md:908:##### `shared_space_membership_set`
.opencode/skill/system-spec-kit/mcp_server/README.md:910:Control who can access a shared space. Assign owner, editor or viewer roles. Only existing owners can change membership.
.opencode/skill/system-spec-kit/mcp_server/README.md:924:##### `shared_memory_status`
.opencode/skill/system-spec-kit/mcp_server/README.md:926:Check the state of shared memory. See which spaces exist, who has access and whether the kill switch is active. Use this to verify your setup after making changes.
.opencode/skill/system-spec-kit/mcp_server/README.md:936:##### `shared_memory_enable`
.opencode/skill/system-spec-kit/mcp_server/README.md:938:Turn on the shared-memory subsystem. First-time setup creates the database tables. Safe to call multiple times.
.opencode/skill/system-spec-kit/mcp_server/README.md:1230:├── shared-spaces/             # Documentation-only shared-memory surface
.opencode/skill/system-spec-kit/mcp_server/README.md:1262:| L5 | Lifecycle | 8 | 600 | Checkpoints, shared spaces and enable/status/shared-space lifecycle |
.opencode/skill/system-spec-kit/mcp_server/README.md:1493:Enable the subsystem and create a shared space for your team:
.opencode/skill/system-spec-kit/mcp_server/README.md:1496:{ "tool": "shared_memory_enable", "arguments": {} }
.opencode/skill/system-spec-kit/mcp_server/README.md:1501:  "tool": "shared_space_upsert",
.opencode/skill/system-spec-kit/mcp_server/README.md:1515:  "tool": "shared_space_membership_set",
.opencode/skill/system-spec-kit/mcp_server/README.md:1527:For the full shared memory guide, see [SHARED_MEMORY_DATABASE.md](../SHARED_MEMORY_DATABASE.md).
.opencode/skill/system-spec-kit/mcp_server/README.md:1646:| Shared memory not working | Call `shared_memory_enable` first, then create a space with an actor identity |
.opencode/skill/system-spec-kit/mcp_server/README.md:1705:Yes, through shared memory. Call `shared_memory_enable`, create a space with `shared_space_upsert` and grant access with `shared_space_membership_set`. Spaces are deny-by-default and the first creator becomes owner. See [SHARED_MEMORY_DATABASE.md](../SHARED_MEMORY_DATABASE.md) for the full guide.
.opencode/skill/system-spec-kit/mcp_server/README.md:1743:| [SHARED_MEMORY_DATABASE.md](../SHARED_MEMORY_DATABASE.md) | Complete shared memory guide: setup, use cases, roles, kill switch, troubleshooting |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:9:} from '@spec-kit/shared/parsing/memory-sufficiency';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:10:import { MEMORY_SUFFICIENCY_REJECTION_CODE } from '@spec-kit/shared/parsing/memory-sufficiency';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:13:} from '@spec-kit/shared/parsing/memory-template-contract';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:22:} from '../lib/context/shared-payload.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:27:import type { MCPResponse } from '@spec-kit/shared/types';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:23:  ['shared_space_id', 'sharedSpaceId'],

codex
The code split is becoming clear: Mnemosyne’s wrapper has no visible age model at all, while Spec Kit Memory has three different time axes already in play: long-term FSRS decay, session attention decay, and archival/retention cleanup. I’m pulling the exact archival and retention code paths next so the recommendations stay concrete rather than generic.
exec
/bin/zsh -lc "rg -n \"candidate|archive|unarchive|maxAgeDays|maxAccessCount|maxConfidence|is_archived|delete_after|retention_policy|bulk delete|retention sweep|deleteAfter\" .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:5:// Background archival job for dormant/archived memories
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:185:  maxAgeDays: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:186:  maxAccessCount: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:187:  maxConfidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:196:  maxAgeDays: 90,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:197:  maxAccessCount: 2,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:198:  maxConfidence: 0.4,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:222:  totalUnarchived: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:237:  totalUnarchived: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:258:    const hasArchived = columns.some(c => c.name === 'is_archived');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:261:      db.exec('ALTER TABLE memory_index ADD COLUMN is_archived INTEGER DEFAULT 0');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:262:      db.exec('CREATE INDEX IF NOT EXISTS idx_archived ON memory_index(is_archived)');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:263:      console.error('[archival-manager] Added is_archived column');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:312:        case 'totalUnarchived':
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:313:          archivalStats.totalUnarchived = parseInt(row.value, 10) || 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:342:      upsert.run('totalUnarchived', String(archivalStats.totalUnarchived));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:358: * Get archival candidates using SQL as a pre-filter, then FSRS tier classifier
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:361: * Strategy: SQL query fetches broad candidates (unarchived, not protected, not pinned).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:362: * The FSRS-based tier classifier then determines which should actually be archived.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:371:    // Broad SQL pre-filter: get unarchived, non-protected, non-pinned memories
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:375:      WHERE (is_archived IS NULL OR is_archived = 0)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:388:    cutoffDate.setDate(cutoffDate.getDate() - ARCHIVAL_CONFIG.maxAgeDays);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:390:    const candidates: ArchivalCandidate[] = [];
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:403:          ((row.access_count as number) || 0) <= ARCHIVAL_CONFIG.maxAccessCount &&
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:404:          ((row.confidence as number) || 0.5) <= ARCHIVAL_CONFIG.maxConfidence
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:409:        candidates.push({
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:421:        if (candidates.length >= limit) break;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:425:    return candidates;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:438:  if ((row.access_count as number) <= ARCHIVAL_CONFIG.maxAccessCount) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:441:  if ((row.confidence as number) <= ARCHIVAL_CONFIG.maxConfidence) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:444:  return reasons.join(', ') || 'candidate';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:460:    const isArchived = (memory.is_archived as number) === 1;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:498:    console.warn(`[archival-manager] BM25 archive sync failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:503:// Touching memory_index or ancillary tables. This preserves the archived row
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:504:// (is_archived=1) so unarchive can still find and restore it.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:514:      console.warn(`[archival-manager] Vector archive sync failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:519:function syncBm25OnUnarchive(memoryId: number): void {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:530:    const query = `SELECT ${availableColumns.join(', ')} FROM memory_index WHERE id = ? AND is_archived = 0`;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:539:    console.warn(`[archival-manager] BM25 unarchive sync failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:546: * The playbook contract (scenario 124) requires that unarchive does NOT recreate the
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:549: * the unarchive call on an async embedding generation round-trip and keeps the
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:550: * archive/unarchive path lightweight.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:552:function syncVectorOnUnarchive(memoryId: number): void {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:558:function archiveMemory(memoryId: number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:564:      SET is_archived = 1,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:567:        AND (is_archived IS NULL OR is_archived = 0)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:587:    console.warn(`[archival-manager] archiveMemory error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:592:function archiveBatch(memoryIds: number[]): { archived: number; failed: number } {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:593:  if (!db) return { archived: 0, failed: memoryIds.length };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:595:  let archived = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:601:        // Db is guaranteed non-null because archiveBatch returns early when the module database is missing
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:604:          SET is_archived = 1,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:607:            AND (is_archived IS NULL OR is_archived = 0)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:615:          archived++;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:626:        console.warn(`[archival-manager] archiveMemory error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:635:  return { archived, failed };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:638:function unarchiveMemory(memoryId: number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:644:      SET is_archived = 0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:646:      WHERE id = ? AND is_archived = 1
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:651:      archivalStats.totalUnarchived++;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:652:      syncBm25OnUnarchive(memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:653:      syncVectorOnUnarchive(memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:661:    console.warn(`[archival-manager] unarchiveMemory error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:670:function runArchivalScan(): { scanned: number; archived: number } {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:671:  const candidates = getArchivalCandidates();
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:672:  archivalStats.totalScanned += candidates.length;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:675:  const result = archiveBatch(candidates.map(c => c.id));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:681:    `[archival-manager] Scan complete: ${candidates.length} candidates, ${result.archived} archived`
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:684:  return { scanned: candidates.length, archived: result.archived };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:739:  archivalStats.totalUnarchived = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:764:  archiveMemory,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:765:  archiveBatch,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:766:  unarchiveMemory,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:76:type CrudMutationType = 'create' | 'update' | 'delete' | 'merge' | 'archive' | 'restore' | 'reindex';
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:43:| Retrieval Stages | 6 | candidate, filter, fusion, rerank, fallback, final-rank |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:52:| **TraceEntry** | Per-stage metrics (stage name, timestamp, duration, candidate counts) |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:149:| `candidate` | Initial candidate generation |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:50:| **LatencyMetrics** | Stage-by-stage timing: candidate, fusion, rerank, boost, and total |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:137:| `candidateLatencyMs` | `number` | Candidate retrieval stage duration |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:312:| `RETRIEVAL_TRACE_STAGES` | Allowed stage names: `candidate`, `filter`, `fusion`, `rerank`, `fallback`, `final-rank` |
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:348:  candidateLatencyMs: 18,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:56:        actions: ['Wait for the restore to finish', 'Retry the bulk delete request'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:100:      error: 'Memory bulk delete aborted: database unavailable',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:152:          reason: `auto-checkpoint before bulk delete of ${affectedCount} "${tier}" memories`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:162:          throw new Error(`${checkpointError}. Aborting high-safety bulk delete.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:224:          // History recording is best-effort inside bulk delete
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:55:  candidateLatencyMs: number;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:187:      candidateLatencyMs: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:242:    t.latency.candidateLatencyMs +
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:384:  const candidate = forecast && typeof forecast === 'object'
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:387:  const riskSignals = Array.isArray(candidate.riskSignals)
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:388:    ? candidate.riskSignals.filter((signal): signal is string => typeof signal === 'string')
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:406:      typeof candidate.etaSeconds === 'number' && Number.isFinite(candidate.etaSeconds)
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:407:        ? Math.max(0, candidate.etaSeconds)
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:410:      typeof candidate.etaConfidence === 'number' && Number.isFinite(candidate.etaConfidence)
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:411:        ? Math.max(0, Math.min(1, candidate.etaConfidence))
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:414:      typeof candidate.failureRisk === 'number' && Number.isFinite(candidate.failureRisk)
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:415:        ? Math.max(0, Math.min(1, candidate.failureRisk))
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:418:    ...(typeof candidate.caveat === 'string' && candidate.caveat.length > 0
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:419:      ? { caveat: candidate.caveat }
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:656:      candidateLatencyMs: t.latency.candidateLatencyMs,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:54:  candidates: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:84:    candidates: 0,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:242:  const candidates: DivergenceReconcileCandidate[] = [];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:254:    candidates.push({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:260:  return candidates.sort((a, b) => a.normalizedPath.localeCompare(b.normalizedPath));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:279:  // Expand to the full candidate set from the index table.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:289:      summary.errors.push(`candidate-expansion: ${toErrorMessage(err)}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:293:  summary.candidates = reconcileCandidates.length;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:24:const SPEC_DOC_EXCLUDE_DIRS = new Set(['scratch', 'memory', 'node_modules', 'iterations', 'z_archive']);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:68:          // Enforce optional specFolder scope before including a candidate file.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:101:   * Internal raw-candidate mode used by the Stage 1 pipeline.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:102:   * When true, stop after channel collection and return pre-fusion candidates.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:241:/** Minimum MMR candidates required for diversity reranking to be worthwhile. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:347:    // resolution returns [] rather than leaking unscoped BM25 candidates.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:465:    // Filters: is_archived exclusion and spec_folder matching handled by fts5Bm25Search
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:635:      const candidate: HybridSearchResult = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:644:      const key = canonicalResultId(candidate.id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:645:      deduped.set(key, mergeRawCandidate(deduped.get(key), candidate));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1450:          const diversifiedRows = diversified.map((candidate): HybridSearchResult => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1451:            const existing = rerankedById.get(canonicalResultId(candidate.id));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1457:              id: candidate.id,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1458:              score: candidate.score,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1532:  // candidates before low-confidence tails are trimmed.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1675: * Collect pipeline candidates through the adaptive fallback chain, returning
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1682: * @returns Unfused candidate results from the first non-empty collection stage.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1726:  console.warn('[hybrid-search] Raw candidate collection returned empty results');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1808:    // H13 FIX: Exclude archived rows unless explicitly requested
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1810:      `(importance_tier IS NULL OR importance_tier NOT IN ('deprecated', 'archived'))`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1811:      `(is_archived IS NULL OR is_archived = 0)`
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2210:  candidateCount: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2383:      candidateCount: 1,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2419:      candidateCount: results.length,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2436:    candidateCount: results.length,
.opencode/skill/system-spec-kit/mcp_server/handlers/v-rule-bridge.ts:60:    const candidatePaths = [
.opencode/skill/system-spec-kit/mcp_server/handlers/v-rule-bridge.ts:66:    for (const distPath of candidatePaths) {
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:125:      const candidatesExhausted = results.length < fetchLimit;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:127:      if (candidatesExhausted || !sawNewCandidates) {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts:11:  'candidate',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:511:  const candidates = database.prepare(query).all(...params) as PreflightRecord[];
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:512:  const preflightCandidates = candidates.filter((row) => row.phase === 'preflight');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:513:  const completeCandidates = candidates.filter((row) => row.phase === 'complete');
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:535:        const archivePlaceholders = oldChildIds.map(() => '?').join(', ');
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:540:          WHERE id IN (${archivePlaceholders})
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:703:    const candidates = findSimilar(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:708:    if (!candidates || candidates.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:719:    const bestMatch = candidates[0];
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:212:  const candidates = queryTerms
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:227:  const unique = [...new Set(candidates)];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1115:    deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1146:    deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:203:  includeArchived?: boolean; // REQ-206: include archived memories in search (default false)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:520:    includeArchived: includeArchived = false, // REQ-206: exclude archived by default
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1297:              const candidate = result.id;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1298:              if (typeof candidate !== 'number' && typeof candidate !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1301:              const normalizedId = String(candidate).trim();
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:131:- Low-HVR memories are candidates for demotion or deprecation
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:236:  { spec_folder: 'z_archive/001-old', updated_at: '2024-06-01', importance_tier: 'deprecated' },
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:271:| Archive check | `isArchived('/z_archive/old')` | Deprioritize archived folders |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:569:      const candidates = find_similar(embedding, {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:578:      if (candidates && candidates.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:579:        const bestMatch = candidates[0] as {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:192:  const candidates = [
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:204:    candidates.push(
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:216:  const existing = candidates
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:217:    .filter((candidate): candidate is LatestMemoryLookupRow => candidate !== undefined)
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:53:    hasArchivedColumn: columnSet.has('is_archived'),
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:62:    predicates.push(`COALESCE(${alias}.is_archived, 0) = 0`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:13:// Active mode (graduated): HyDE results are merged into the candidate
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:24://   SPECKIT_HYDE_ACTIVE — merge HyDE results into candidates (default: TRUE, graduated)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:359: * merging into the candidate pool.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:364: * @returns Array of PipelineRow candidates (empty in shadow mode).
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:380: * for a deep + low-confidence query, log results, and return candidates
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:386: *   - Active mode: results returned for merging in stage1-candidate-gen.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:389: * @param baseline - Current stage-1 candidate set (before HyDE).
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:412:    const candidates = vectorOnly(hydeResult.embedding, limit, specFolder);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:418:        `[hyde] shadow results: ${candidates.length} candidates for query "${query}" ` +
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:424:      // Shadow mode — log only, do not contribute to candidate set
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:428:    return candidates;
.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:28:  '/z_archive/',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:192:  candidate: CachedSessionSummaryCandidate | null,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:199:  if (!candidate) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:203:  if (candidate.schemaVersion !== CACHED_SESSION_SUMMARY_SCHEMA_VERSION) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:207:      `Expected schema version ${CACHED_SESSION_SUMMARY_SCHEMA_VERSION} but received ${String(candidate.schemaVersion)}.`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:211:  const summaryText = candidate.summaryText?.trim() ?? '';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:212:  if (summaryText.length === 0 || parseIsoMs(candidate.extractedAt) === null) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:220:  const producerMetadata = candidate.producerMetadata;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:281:  const extractedAtMs = parseIsoMs(candidate.extractedAt);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:301:  const cachedSpecFolder = normalizeSpecFolder(candidate.lastSpecFolder);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:333:      schemaVersion: candidate.schemaVersion,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:336:      extractedAt: candidate.extractedAt!,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:357:  const candidate = buildCachedSessionSummaryCandidate(
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:366:  return evaluateCachedSessionSummaryCandidate(candidate, options);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:114:  const candidates = new Set<string>();
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:119:  candidates.add(normalizedReference);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:120:  candidates.add(canonical);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:121:  candidates.add(trimmedLeadingSlash);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:123:    candidates.add(`/${normalizedReference}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:126:    candidates.add(`/${canonical}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:129:  return Array.from(candidates).filter((candidate) => candidate.length > 0);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:204:    for (const candidate of buildPathExactCandidates(ref.normalizedReference)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:205:      pathCandidates.add(candidate);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:206:      const current = pathCandidateRefs.get(candidate) ?? [];
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:208:      pathCandidateRefs.set(candidate, current);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:240:    for (const [candidate, refs] of pathCandidateRefs.entries()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:241:      const id = idByCandidate.get(candidate);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:382:        const candidate = resolvedReferenceMap.get(reference);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:383:        resolvedId = typeof candidate === 'number' ? candidate : null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:378:    const candidateInnerStates: Array<Record<string, unknown>> = [
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:410:      const meta = candidateInnerStates[0].meta as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:414:    for (const innerEnvelope of candidateInnerStates) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:469:        const candidateResults = [...currentResults];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:470:        candidateResults[lastIndex] = {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:477:          results: candidateResults,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:478:          count: candidateResults.length,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:481:        const candidateContent = contentEntries.map((entry, index) => (
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:484:        const candidateResult = {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:486:          content: candidateContent,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:488:        const candidateTokens = estimateTokens(JSON.stringify(candidateResult));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:490:        if (candidateTokens <= budgetTokens) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:491:          bestResult = candidateResult;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:492:          bestTokens = candidateTokens;
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:76:  const candidates = Array.isArray(flagNames) ? flagNames : [flagNames];
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:77:  for (const flagName of candidates) {
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:99:  const candidates = Array.isArray(flagNames) ? flagNames : [flagNames];
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:104:  for (const flagName of candidates) {
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:115:  const canonicalFlag = candidates[0];
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:42:  candidateMemoryIds: number[];
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:140:  deleteAfter?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:169:  retention_policy?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:170:  delete_after?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:71:    for (const candidate of packageCandidates) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:72:      if (!existsSync(candidate)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:75:      const pkg = JSON.parse(readFileSync(candidate, 'utf-8'));
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:644:  const candidateEntries = getTriggerCandidates(promptNormalized, cache);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:649:  for (const entry of candidateEntries) {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:686:    candidateCount: candidateEntries.length,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:741:  const candidateIds = new Set<number>();
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:749:      candidateIds.add(triggerId);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:753:  if (candidateIds.size === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:757:  return [...candidateIds]
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:91:  const candidateMemoryIds = Array.from(
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:93:      ...rawRecommendation.candidateMemoryIds,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:103:    candidateMemoryIds,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:38:  let candidates: SimilarMemory[] = [];
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:42:    candidates = findSimilarMemories(embedding, {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:53:  if (!force && candidates.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:57:      candidates,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:87:  const candidate = data.cachedSummary;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:88:  if (candidate && typeof candidate === 'object') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:89:    return candidate as CachedSessionSummaryDecision;
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:96:  - `archival-manager.ts` — lifecycle transitions between active and archived memory states.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:169:- Purpose: Owns post-tool extraction and save-time entity/secret handling. It turns tool outputs into candidate memory payloads while gating PII/secrets and extracting reusable entities.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:174:  - `entity-denylist.ts` — denylist filtering for noisy or generic entity candidates.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:194:- Purpose: Owns scope enforcement, governed ingest normalization, audit recording, and retention sweeps. This is the boundary for tenant/user/agent/session/shared-space policy decisions.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:197:  - `retention.ts` — scoped retention sweep logic over expired memories.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:297:- Purpose: Owns ranking and calibration logic once candidate memories already exist. It combines importance tiers, composite scoring, folder relevance, confidence signals, and negative-feedback effects.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:313:- Purpose: Owns the retrieval engine: candidate generation, vector/lexical channels, fusion, reranking, query intelligence, graph-aware retrieval, and schema/index helpers needed by the search path. This is the highest-churn and broadest domain module in `lib/`.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:372:      .map((candidate) => graphDb.resolveSubjectFilePath(candidate) ?? candidate)
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:373:      .filter((candidate): candidate is string => typeof candidate === 'string' && candidate.length > 0);

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts | sed -n '280,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts | sed -n '520,760p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   520	  const bm25 = getBm25Index();
   521	  if (!db || !bm25 || !bm25.isBm25Enabled()) return;
   522	
   523	  try {
   524	    const columns = getMemoryIndexColumns();
   525	    const availableColumns = ['title', 'content_text', 'trigger_phrases', 'file_path']
   526	      .filter(column => columns.has(column));
   527	
   528	    if (availableColumns.length === 0) return;
   529	
   530	    const query = `SELECT ${availableColumns.join(', ')} FROM memory_index WHERE id = ? AND is_archived = 0`;
   531	    const row = (db.prepare(query) as Database.Statement).get(memoryId) as Record<string, unknown> | undefined;
   532	    if (!row) return;
   533	
   534	    const text = bm25.buildBm25DocumentText(row);
   535	    if (!text) return;
   536	    bm25.getIndex().addDocument(String(memoryId), text);
   537	  } catch (error: unknown) {
   538	    const msg = error instanceof Error ? error.message : String(error);
   539	    console.warn(`[archival-manager] BM25 unarchive sync failed: ${msg}`);
   540	  }
   541	}
   542	
   543	/**
   544	 * Defer vector re-embedding to the next index scan rather than rebuilding immediately.
   545	 *
   546	 * The playbook contract (scenario 124) requires that unarchive does NOT recreate the
   547	 * vec_memories row inline — instead it logs a deferred-rebuild notice so the next
   548	 * `memory_index_scan` picks up the gap and re-embeds the memory. This avoids blocking
   549	 * the unarchive call on an async embedding generation round-trip and keeps the
   550	 * archive/unarchive path lightweight.
   551	 */
   552	function syncVectorOnUnarchive(memoryId: number): void {
   553	  console.error(
   554	    `[archival-manager] Deferred vector re-embedding for memory ${memoryId} until next index scan`
   555	  );
   556	}
   557	
   558	function archiveMemory(memoryId: number): boolean {
   559	  if (!db) return false;
   560	
   561	  try {
   562	    const result = (db.prepare(`
   563	      UPDATE memory_index
   564	      SET is_archived = 1,
   565	          updated_at = datetime('now')
   566	      WHERE id = ?
   567	        AND (is_archived IS NULL OR is_archived = 0)
   568	    `) as Database.Statement).run(memoryId);
   569	
   570	    const success = (result as { changes: number }).changes > 0;
   571	    if (success) {
   572	      archivalStats.totalArchived++;
   573	      syncBm25OnArchive(memoryId);
   574	      syncVectorOnArchive(memoryId);
   575	      clearDegreeCache();
   576	      clearGraphSignalsCache();
   577	      saveArchivalStats();
   578	    }
   579	    return success;
   580	  } catch (error: unknown) {
   581	    const msg = error instanceof Error ? error.message : String(error);
   582	    const MAX_ERROR_LOG = 100;
   583	    archivalStats.errors.push(msg);
   584	    if (archivalStats.errors.length > MAX_ERROR_LOG) {
   585	      archivalStats.errors = archivalStats.errors.slice(-MAX_ERROR_LOG);
   586	    }
   587	    console.warn(`[archival-manager] archiveMemory error: ${msg}`);
   588	    return false;
   589	  }
   590	}
   591	
   592	function archiveBatch(memoryIds: number[]): { archived: number; failed: number } {
   593	  if (!db) return { archived: 0, failed: memoryIds.length };
   594	
   595	  let archived = 0;
   596	  let failed = 0;
   597	
   598	  const batchTransaction = db.transaction(() => {
   599	    for (const id of memoryIds) {
   600	      try {
   601	        // Db is guaranteed non-null because archiveBatch returns early when the module database is missing
   602	        const result = (db!.prepare(`
   603	          UPDATE memory_index
   604	          SET is_archived = 1,
   605	              updated_at = datetime('now')
   606	          WHERE id = ?
   607	            AND (is_archived IS NULL OR is_archived = 0)
   608	        `) as Database.Statement).run(id);
   609	
   610	        const success = (result as { changes: number }).changes > 0;
   611	        if (success) {
   612	          archivalStats.totalArchived++;
   613	          syncBm25OnArchive(id);
   614	          syncVectorOnArchive(id);
   615	          archived++;
   616	        } else {
   617	          failed++;
   618	        }
   619	      } catch (error: unknown) {
   620	        const msg = error instanceof Error ? error.message : String(error);
   621	        const MAX_ERROR_LOG = 100;
   622	        archivalStats.errors.push(msg);
   623	        if (archivalStats.errors.length > MAX_ERROR_LOG) {
   624	          archivalStats.errors = archivalStats.errors.slice(-MAX_ERROR_LOG);
   625	        }
   626	        console.warn(`[archival-manager] archiveMemory error: ${msg}`);
   627	        failed++;
   628	      }
   629	    }
   630	  });
   631	
   632	  batchTransaction();
   633	  saveArchivalStats();
   634	
   635	  return { archived, failed };
   636	}
   637	
   638	function unarchiveMemory(memoryId: number): boolean {
   639	  if (!db) return false;
   640	
   641	  try {
   642	    const result = (db.prepare(`
   643	      UPDATE memory_index
   644	      SET is_archived = 0,
   645	          updated_at = datetime('now')
   646	      WHERE id = ? AND is_archived = 1
   647	    `) as Database.Statement).run(memoryId);
   648	
   649	    const success = (result as { changes: number }).changes > 0;
   650	    if (success) {
   651	      archivalStats.totalUnarchived++;
   652	      syncBm25OnUnarchive(memoryId);
   653	      syncVectorOnUnarchive(memoryId);
   654	      clearDegreeCache();
   655	      clearGraphSignalsCache();
   656	      saveArchivalStats();
   657	    }
   658	    return success;
   659	  } catch (error: unknown) {
   660	    const msg = error instanceof Error ? error.message : String(error);
   661	    console.warn(`[archival-manager] unarchiveMemory error: ${msg}`);
   662	    return false;
   663	  }
   664	}
   665	
   666	/* ───────────────────────────────────────────────────────────────
   667	   7. SCANNING & BACKGROUND JOBS
   668	----------------------------------------------------------------*/
   669	
   670	function runArchivalScan(): { scanned: number; archived: number } {
   671	  const candidates = getArchivalCandidates();
   672	  archivalStats.totalScanned += candidates.length;
   673	  archivalStats.lastScanTime = new Date().toISOString();
   674	
   675	  const result = archiveBatch(candidates.map(c => c.id));
   676	
   677	  // Persist updated stats (P5-06)
   678	  saveArchivalStats();
   679	
   680	  console.error(
   681	    `[archival-manager] Scan complete: ${candidates.length} candidates, ${result.archived} archived`
   682	  );
   683	
   684	  return { scanned: candidates.length, archived: result.archived };
   685	}
   686	
   687	function startBackgroundJob(intervalMs: number = ARCHIVAL_CONFIG.backgroundJobIntervalMs): void {
   688	  if (!ARCHIVAL_CONFIG.enabled) {
   689	    return;
   690	  }
   691	
   692	  if (backgroundJob) {
   693	    clearInterval(backgroundJob);
   694	  }
   695	
   696	  backgroundJob = setInterval(() => {
   697	    try {
   698	      runArchivalScan();
   699	    } catch (error: unknown) {
   700	      const msg = error instanceof Error ? error.message : String(error);
   701	      console.warn(`[archival-manager] Background job error: ${msg}`);
   702	    }
   703	  }, intervalMs);
   704	
   705	  if (backgroundJob.unref) {
   706	    backgroundJob.unref();
   707	  }
   708	
   709	  console.error(`[archival-manager] Background job started (interval: ${intervalMs / 1000}s)`);
   710	}
   711	
   712	function stopBackgroundJob(): void {
   713	  if (backgroundJob) {
   714	    clearInterval(backgroundJob);
   715	    backgroundJob = null;
   716	    console.error('[archival-manager] Background job stopped');
   717	  }
   718	}
   719	
   720	function isBackgroundJobRunning(): boolean {
   721	  return backgroundJob !== null;
   722	}
   723	
   724	/* ───────────────────────────────────────────────────────────────
   725	   8. STATS & CLEANUP
   726	----------------------------------------------------------------*/
   727	
   728	function getStats(): ArchivalStats {
   729	  return { ...archivalStats };
   730	}
   731	
   732	function getRecentErrors(limit: number = 10): string[] {
   733	  return archivalStats.errors.slice(-limit);
   734	}
   735	
   736	function resetStats(): void {
   737	  archivalStats.totalScanned = 0;
   738	  archivalStats.totalArchived = 0;
   739	  archivalStats.totalUnarchived = 0;
   740	  archivalStats.lastScanTime = null;
   741	  archivalStats.errors = [];
   742	  saveArchivalStats();
   743	}
   744	
   745	function cleanup(): void {
   746	  stopBackgroundJob();
   747	  db = null;
   748	}
   749	
   750	/* ───────────────────────────────────────────────────────────────
   751	   9. EXPORTS
   752	----------------------------------------------------------------*/
   753	
   754	export {
   755	  ARCHIVAL_CONFIG,
   756	
   757	  // Initialization
   758	  init,
   759	  ensureArchivedColumn,
   760	

 succeeded in 0ms:
   280	    db.exec(`
   281	      CREATE TABLE IF NOT EXISTS archival_stats (
   282	        key TEXT PRIMARY KEY,
   283	        value TEXT NOT NULL,
   284	        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
   285	      )
   286	    `);
   287	  } catch (error: unknown) {
   288	    const msg = error instanceof Error ? error.message : String(error);
   289	    console.warn(`[archival-manager] ensureArchivalStatsTable error: ${msg}`);
   290	  }
   291	}
   292	
   293	/**
   294	 * Load archival stats from the database on startup (P5-06).
   295	 */
   296	function loadArchivalStats(): void {
   297	  if (!db) return;
   298	
   299	  try {
   300	    const rows = (db.prepare(
   301	      'SELECT key, value FROM archival_stats'
   302	    ) as Database.Statement).all() as Array<{ key: string; value: string }>;
   303	
   304	    for (const row of rows) {
   305	      switch (row.key) {
   306	        case 'totalScanned':
   307	          archivalStats.totalScanned = parseInt(row.value, 10) || 0;
   308	          break;
   309	        case 'totalArchived':
   310	          archivalStats.totalArchived = parseInt(row.value, 10) || 0;
   311	          break;
   312	        case 'totalUnarchived':
   313	          archivalStats.totalUnarchived = parseInt(row.value, 10) || 0;
   314	          break;
   315	        case 'lastScanTime':
   316	          archivalStats.lastScanTime = row.value === '' ? null : row.value || null;
   317	          break;
   318	      }
   319	    }
   320	  } catch (error: unknown) {
   321	    const msg = error instanceof Error ? error.message : String(error);
   322	    console.warn(`[archival-manager] loadArchivalStats error: ${msg}`);
   323	  }
   324	}
   325	
   326	/**
   327	 * Persist archival stats to the database (P5-06).
   328	 */
   329	function saveArchivalStats(): void {
   330	  if (!db) return;
   331	
   332	  try {
   333	    const upsert = db.prepare(`
   334	      INSERT INTO archival_stats (key, value, updated_at)
   335	      VALUES (?, ?, datetime('now'))
   336	      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
   337	    `) as Database.Statement;
   338	
   339	    const saveAll = db.transaction(() => {
   340	      upsert.run('totalScanned', String(archivalStats.totalScanned));
   341	      upsert.run('totalArchived', String(archivalStats.totalArchived));
   342	      upsert.run('totalUnarchived', String(archivalStats.totalUnarchived));
   343	      upsert.run('lastScanTime', archivalStats.lastScanTime ?? '');
   344	    });
   345	
   346	    saveAll();
   347	  } catch (error: unknown) {
   348	    const msg = error instanceof Error ? error.message : String(error);
   349	    console.warn(`[archival-manager] saveArchivalStats error: ${msg}`);
   350	  }
   351	}
   352	
   353	/* ───────────────────────────────────────────────────────────────
   354	   6. ARCHIVAL FUNCTIONS
   355	----------------------------------------------------------------*/
   356	
   357	/**
   358	 * Get archival candidates using SQL as a pre-filter, then FSRS tier classifier
   359	 * as the authoritative decision.
   360	 *
   361	 * Strategy: SQL query fetches broad candidates (unarchived, not protected, not pinned).
   362	 * The FSRS-based tier classifier then determines which should actually be archived.
   363	 * This unifies the dual archival paths (P5-05) — FSRS is primary, SQL is pre-filter.
   364	 */
   365	function getArchivalCandidates(limit: number = ARCHIVAL_CONFIG.batchSize): ArchivalCandidate[] {
   366	  if (!db) return [];
   367	
   368	  try {
   369	    const protectedList = ARCHIVAL_CONFIG.protectedTiers.map(() => '?').join(',');
   370	
   371	    // Broad SQL pre-filter: get unarchived, non-protected, non-pinned memories
   372	    const rows = (db.prepare(`
   373	      SELECT *
   374	      FROM memory_index
   375	      WHERE (is_archived IS NULL OR is_archived = 0)
   376	        AND importance_tier NOT IN (${protectedList})
   377	        AND is_pinned = 0
   378	      ORDER BY last_accessed ASC NULLS FIRST, access_count ASC
   379	      LIMIT ?
   380	    `) as Database.Statement).all(
   381	      ...ARCHIVAL_CONFIG.protectedTiers,
   382	      limit * 3  // Fetch extra since FSRS will filter further
   383	    ) as Array<Record<string, unknown>>;
   384	
   385	    // Use FSRS-based tier classifier as authoritative archival decision
   386	    const classifier = getTierClassifier();
   387	    const cutoffDate = new Date();
   388	    cutoffDate.setDate(cutoffDate.getDate() - ARCHIVAL_CONFIG.maxAgeDays);
   389	
   390	    const candidates: ArchivalCandidate[] = [];
   391	
   392	    for (const row of rows) {
   393	      let shouldArchiveRow = false;
   394	
   395	      if (classifier && typeof classifier.shouldArchive === 'function') {
   396	        // Primary: FSRS-based decision
   397	        shouldArchiveRow = classifier.shouldArchive(row) as boolean;
   398	      } else {
   399	        // Fallback: SQL-based criteria only when FSRS is unavailable
   400	        shouldArchiveRow = (
   401	          row.created_at != null &&
   402	          new Date(row.created_at as string) < cutoffDate &&
   403	          ((row.access_count as number) || 0) <= ARCHIVAL_CONFIG.maxAccessCount &&
   404	          ((row.confidence as number) || 0.5) <= ARCHIVAL_CONFIG.maxConfidence
   405	        );
   406	      }
   407	
   408	      if (shouldArchiveRow) {
   409	        candidates.push({
   410	          id: row.id as number,
   411	          title: row.title as string | null,
   412	          spec_folder: row.spec_folder as string,
   413	          file_path: row.file_path as string,
   414	          created_at: row.created_at as string,
   415	          importance_tier: row.importance_tier as string,
   416	          access_count: (row.access_count as number) || 0,
   417	          confidence: (row.confidence as number) || 0.5,
   418	          reason: determineArchivalReason(row, cutoffDate),
   419	        });
   420	
   421	        if (candidates.length >= limit) break;
   422	      }
   423	    }
   424	
   425	    return candidates;
   426	  } catch (error: unknown) {
   427	    const msg = error instanceof Error ? error.message : String(error);
   428	    console.warn(`[archival-manager] getArchivalCandidates error: ${msg}`);
   429	    return [];
   430	  }
   431	}
   432	
   433	function determineArchivalReason(row: Record<string, unknown>, cutoffDate: Date): string {
   434	  const reasons: string[] = [];
   435	  if (row.created_at && new Date(row.created_at as string) < cutoffDate) {
   436	    reasons.push('aged');
   437	  }
   438	  if ((row.access_count as number) <= ARCHIVAL_CONFIG.maxAccessCount) {
   439	    reasons.push('low-access');
   440	  }
   441	  if ((row.confidence as number) <= ARCHIVAL_CONFIG.maxConfidence) {
   442	    reasons.push('low-confidence');
   443	  }
   444	  return reasons.join(', ') || 'candidate';
   445	}
   446	
   447	function checkMemoryArchivalStatus(memoryId: number): {
   448	  isArchived: boolean;
   449	  shouldArchive: boolean;
   450	} {
   451	  if (!db) return { isArchived: false, shouldArchive: false };
   452	
   453	  try {
   454	    const memory = (db.prepare(
   455	      'SELECT * FROM memory_index WHERE id = ?'
   456	    ) as Database.Statement).get(memoryId) as Record<string, unknown> | undefined;
   457	
   458	    if (!memory) return { isArchived: false, shouldArchive: false };
   459	
   460	    const isArchived = (memory.is_archived as number) === 1;
   461	
   462	    // Check with tier classifier if available
   463	    const classifier = getTierClassifier();
   464	    let shouldArchive = false;
   465	    if (classifier && typeof classifier.shouldArchive === 'function') {
   466	      shouldArchive = classifier.shouldArchive(memory) as boolean;
   467	    }
   468	
   469	    return { isArchived, shouldArchive };
   470	  } catch (error: unknown) {
   471	    const msg = error instanceof Error ? error.message : String(error);
   472	    console.warn(`[archival-manager] checkMemoryArchivalStatus error: ${msg}`);
   473	    return { isArchived: false, shouldArchive: false };
   474	  }
   475	}
   476	
   477	function getMemoryIndexColumns(): Set<string> {
   478	  if (!db) return new Set();
   479	
   480	  try {
   481	    const columns = (db.prepare('PRAGMA table_info(memory_index)') as Database.Statement).all() as Array<{ name: string }>;
   482	    return new Set(columns.map(column => column.name));
   483	  } catch (error: unknown) {
   484	    const message = error instanceof Error ? error.message : String(error);
   485	    console.warn(`[archival-manager] getMemoryIndexColumns failed: ${message}`);
   486	    return new Set();
   487	  }
   488	}
   489	
   490	function syncBm25OnArchive(memoryId: number): void {
   491	  const bm25 = getBm25Index();
   492	  if (!db || !bm25 || !bm25.isBm25Enabled()) return;
   493	
   494	  try {
   495	    bm25.getIndex().removeDocument(String(memoryId));
   496	  } catch (error: unknown) {
   497	    const msg = error instanceof Error ? error.message : String(error);
   498	    console.warn(`[archival-manager] BM25 archive sync failed: ${msg}`);
   499	  }
   500	}
   501	
   502	// Vector-only deletion — removes the vec_memories embedding row without
   503	// Touching memory_index or ancillary tables. This preserves the archived row
   504	// (is_archived=1) so unarchive can still find and restore it.
   505	function syncVectorOnArchive(memoryId: number): void {
   506	  if (!db) return;
   507	
   508	  try {
   509	    db.prepare('DELETE FROM vec_memories WHERE rowid = ?').run(BigInt(memoryId));
   510	  } catch (error: unknown) {
   511	    // Expected to fail when sqlite-vec is not loaded or vec_memories doesn't exist
   512	    const msg = error instanceof Error ? error.message : String(error);
   513	    if (!msg.includes('no such table')) {
   514	      console.warn(`[archival-manager] Vector archive sync failed: ${msg}`);
   515	    }
   516	  }
   517	}
   518	
   519	function syncBm25OnUnarchive(memoryId: number): void {
   520	  const bm25 = getBm25Index();

exec
/bin/zsh -lc "rg -n \"retention_policy|delete_after|deleteAfter|retention sweep|delete after|ephemeral\" .opencode/skill/system-spec-kit/mcp_server | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:195:  retentionPolicy: z.enum(['keep', 'ephemeral', 'shared']).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:196:  deleteAfter: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:466:  memory_save: ['filePath', 'force', 'dryRun', 'skipPreflight', 'asyncEmbedding', 'tenantId', 'userId', 'agentId', 'sessionId', 'sharedSpaceId', 'provenanceSource', 'provenanceActor', 'governedAt', 'retentionPolicy', 'deleteAfter'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:55:        hint: 'Retry memory_bulk_delete after checkpoint_restore maintenance completes.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:220:  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
.opencode/skill/system-spec-kit/mcp_server/README.md:710:| `retentionPolicy` | string | `keep` (default), `ephemeral`, `shared` |
.opencode/skill/system-spec-kit/mcp_server/README.md:711:| `deleteAfter` | string | ISO date for automatic deletion |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:139:  retentionPolicy?: 'keep' | 'ephemeral' | 'shared';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:140:  deleteAfter?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:169:  retention_policy?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:170:  delete_after?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:94:  sessionScope: 'caller' | 'ephemeral';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1241:    sessionScope: requestedSessionId ? 'caller' : 'ephemeral',
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:164:  retentionPolicy?: 'keep' | 'ephemeral' | 'shared';
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:165:  deleteAfter?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1115:    deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1146:    deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:16:export type RetentionPolicy = 'keep' | 'ephemeral' | 'shared';
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:37:  deleteAfter?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:54:  deleteAfter: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:207:    || input.retentionPolicy === 'ephemeral'
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:209:    || typeof input.deleteAfter === 'string';
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:222:  const deleteAfter = normalizeIsoTimestamp(input.deleteAfter) ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:223:  const retentionPolicy: RetentionPolicy = input.retentionPolicy === 'ephemeral' || input.retentionPolicy === 'shared'
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:244:        deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:255:  if (deleteAfter && new Date(deleteAfter).getTime() <= new Date(governedAt).getTime()) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:256:    issues.push('deleteAfter must be later than governedAt');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:258:  // H21 FIX: Require valid future deleteAfter for ephemeral retention policy
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:259:  // Without this, ephemeral rows are never swept since sweeps key off delete_after
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:260:  if (retentionPolicy === 'ephemeral' && !deleteAfter) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:261:    issues.push('deleteAfter is required for ephemeral retention policy');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:278:      deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:299:    retention_policy: decision.normalized.retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:300:    delete_after: decision.normalized.deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:311:      deleteAfter: decision.normalized.deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:194:- Purpose: Owns scope enforcement, governed ingest normalization, audit recording, and retention sweeps. This is the boundary for tenant/user/agent/session/shared-space policy decisions.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:197:  - `retention.ts` — scoped retention sweep logic over expired memories.
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:459:| Temporary | Yes (fast) | 0.5x | Session-specific, ephemeral |
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:30:      delete_after TEXT
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:9:// Domain (ephemeral session attention vs persistent memory scoring).
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:13:// STORAGE: In-memory only (ephemeral by design, no SQLite persistence).
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:70: * Sessions are ephemeral — they exist only in process memory and are not
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:165:      reason: 'delete_after_expired',
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:240: * constitutional = slowest decay (most persistent), scratch = fastest decay (ephemeral).
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1421:    { name: 'retention_policy', sql: "ALTER TABLE memory_index ADD COLUMN retention_policy TEXT DEFAULT 'keep'" },
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1422:    { name: 'delete_after', sql: 'ALTER TABLE memory_index ADD COLUMN delete_after TEXT' },
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1468:      CREATE INDEX IF NOT EXISTS idx_memory_retention_delete_after
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1469:        ON memory_index(delete_after);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2333:      retention_policy TEXT DEFAULT 'keep',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2334:      delete_after TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:978:  // passed an ephemeral sessionId, because memories don't have session-scoped access.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:44:  retention_policy?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:45:  delete_after?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:62:  'governed_at', 'retention_policy', 'delete_after', 'governance_metadata',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:927:    retention_policy: existingRow.retention_policy,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:928:    delete_after: existingRow.delete_after,
.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/sample-memories.json:59:      "content": "Tier 1 memories are ephemeral and decay within 24 hours",
.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/similarity-test-cases.json:88:      "a": "Tier 1 ephemeral memories",
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:516:    it('T027k: missing sessionId generates ephemeral UUID scope', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:522:        'T027k-ephemeral'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:526:      expect(parsed.meta.sessionLifecycle.sessionScope).toBe('ephemeral');
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:107:    expect(tasksContent).toContain('Fix retention sweeps so deletion uses the passed database handle');
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:138:    expect(summaryContent).toContain('The earlier retention sweep database-handle fix remains in place, so retention sweeps now delete through the passed database handle');

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts | sed -n '200,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/governance/retention.ts | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
nl: .opencode/skill/system-spec-kit/mcp_server/lib/governance/retention.ts: No such file or directory

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | sed -n '1080,1165p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "rg -n \"trackAccess\\(|calculateUsageBoost\\(|calculatePopularityScore\\(|applyClassificationDecay\\(|calculateRetrievability\\(|recency\" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:169:    recency: weights.recency,
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:57:| **Folder Ranking** | Composite scoring for spec folders based on recency, relevance and importance |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:465:// Combines recency, relevance, importance and access patterns
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:32:    recency: number;        // 1.0 if recent tool call, decays over time
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:163:/** Compute recency factor: 1.0 if <5 min, linear decay to 0.0 at 60 min. */
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:209:    recency: computeRecency(),
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:217:  //   recency (0.35)       — Highest weight because stale sessions are the primary
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:234:    factors.recency * 0.35 +
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1227:      : { semanticWeight: 1.0, keywordWeight: 1.0, recencyWeight: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:172:  recency: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:44:| **Folder Scoring** | Rank spec folders by recency, activity and importance |
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:115:The scoring module supports an event-based decay model that replaces pure time-based decay with event-driven signals. Instead of decaying scores solely based on elapsed time, the model tracks meaningful events (access, citation, validation) and adjusts decay rates based on event frequency and recency. This provides more accurate relevance scoring for memories that are actively referenced versus those that are merely recent.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:240:// Returns: [{ folder: '012-auth', score: 0.85, recencyScore: 0.95, ... }]
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:125:/** Recency fusion weight — controls how much recency score contributes to the fused score.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:129:/** Recency fusion cap — maximum bonus a candidate can receive from recency fusion.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:597: *   intentScore = similarity * w.similarity + importance * w.importance + recency * w.recency
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:604: * @param weights - Intent weight configuration {similarity, importance, recency}
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:626:    const recencyTimestamp = (row.created_at as string | undefined) ?? '';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:628:    const recency = computeRecencyScore(recencyTimestamp, importanceTier);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:633:      recency * weights.recency;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:872:      const currentR = fsrsScheduler.calculateRetrievability(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1003:    let recencyBoostedCount = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1005:      const recencyTimestamp = (row.created_at as string | undefined) ?? '';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1007:      if (!recencyTimestamp) return row;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1009:      const recencyScore = computeRecencyScore(recencyTimestamp, importanceTier);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1010:      const bonus = Math.min(RECENCY_FUSION_CAP, recencyScore * RECENCY_FUSION_WEIGHT);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1017:      recencyBoostedCount++;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1020:    if (recencyBoostedCount > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1022:      (metadata as Record<string, unknown>).recencyFusionApplied = true;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1023:      (metadata as Record<string, unknown>).recencyFusionBoosted = recencyBoostedCount;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1027:    console.warn(`[stage2-fusion] recency fusion failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:24:  recency: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:198:  add_feature: { recency: 0.3, importance: 0.4, similarity: 0.3, contextType: 'implementation' },
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:199:  fix_bug: { recency: 0.5, importance: 0.2, similarity: 0.3, contextType: 'implementation' },
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:200:  refactor: { recency: 0.2, importance: 0.3, similarity: 0.5, contextType: 'implementation' },
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:201:  security_audit: { recency: 0.1, importance: 0.5, similarity: 0.4, contextType: 'research' },
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:202:  understand: { recency: 0.2, importance: 0.3, similarity: 0.5, contextType: null },
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:203:  find_spec: { recency: 0.1, importance: 0.5, similarity: 0.4, contextType: 'planning' },
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:204:  find_decision: { recency: 0.1, importance: 0.5, similarity: 0.4, contextType: 'planning' },
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:502: * @returns Weight adjustments for recency, importance, similarity, and context type
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:521:  // recency was previously ignored.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:522:  // Parse timestamps, min/max normalize to [0,1], apply weights.recency.
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:542:    const recencyRaw = timestamps[i] > 0 && tsRange > 0
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:550:        recencyRaw * weights.recency,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:975:  const recency_weight = search_weights.smartRanking?.recencyWeight || 0.3;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:986:    let recency_factor;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:988:      recency_factor = 1.0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:990:      recency_factor = 0.8;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:992:      recency_factor = 0.5;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:998:    r.smartScore = (similarity_factor * relevance_weight) + (recency_factor * recency_weight) + (usage_factor * access_weight);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:6:// HIGH-003 FIX: Import unified recency scoring from folder-scoring
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:101:  recency: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:139:    recency: FactorDetail;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:173:  recency: 0.10,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:235:// Citation recency decay constants
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:332:      adjustedStability = scheduler.applyClassificationDecay(stability, contextType, tier);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:352:    const score = scheduler.calculateRetrievability(adjustedStability, adjustedElapsedDays);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:388: * T033: Calculate citation recency score (REQ-017 Factor 5)
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:393:  // General recency with citation recency. Uncited memories score 0.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:498: * HIGH-003 FIX: Wrapper around unified compute_recency_score from folder-scoring.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:591: * importance (tier-based), pattern (query alignment), and citation (recency).
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:634: * similarity, importance, recency, popularity, tierBoost, and retrievability.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:649:  const wSum = rawWeights.similarity + rawWeights.importance + rawWeights.recency
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:655:        recency: rawWeights.recency / wSum,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:667:  const recencyScore = calculateRecencyScore(timestamp, tier);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:668:  const popularityScore = calculatePopularityScore(row.access_count || 0, parseLastAccessed(row.last_accessed), row.created_at || null);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:675:    recencyScore * weights.recency +
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:693: *   usage, importance, pattern alignment, and citation recency scores.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:726: *   importance, recency, popularity, tierBoost, and retrievability scores.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:751:        recency: calculateRecencyScore(row.updated_at || row.created_at, tier),
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:752:        popularity: calculatePopularityScore(row.access_count || 0, parseLastAccessed(row.last_accessed), row.created_at || null),
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:795:      citation: { value: citation, weight: weights.citation, contribution: citation * weights.citation, description: 'Citation recency' },
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:815:  const wSum = rawWeights.similarity + rawWeights.importance + rawWeights.recency
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:821:        recency: rawWeights.recency / wSum,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:831:  const recency = calculateRecencyScore(row.updated_at || row.created_at, tier);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:832:  const popularity = calculatePopularityScore(row.access_count || 0, parseLastAccessed(row.last_accessed), row.created_at || null);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:840:      recency: { value: recency, weight: weights.recency, contribution: recency * weights.recency },
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:51:    recencyWeight?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:28:  recencyBias: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:57:    recencyBias: 0.2,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:65:    recencyBias: 0.3,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:73:    recencyBias: 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:81:    recencyBias: 0.4,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:89:    recencyBias: 0.2,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:97:    recencyBias: 0.3,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:105:    recencyBias: 0.6,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:113:    recencyBias: 0.2,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:121:    recencyBias: 0.3,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:61:      "notes": "Temporal query — 'recently discussed' should surface content from the last 7 days of memory creation. Tests recency boost in fix_bug / understand intent modes."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:421:      "notes": "Bug-intent with temporal aspect (\"after index rebuild\") — tests recency boosting for fix_bug intent."
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:50:  /** Get top N files by recency-weighted score */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:55:    // Score: frequency * recency_decay
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:56:    // recency_decay = 1 / (1 + age_in_minutes / 10)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:135:  /** Get top N symbols by recency-weighted score */
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:103:    return fsrsScheduler.calculateRetrievability(stability, elapsedDays);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:224:function calculateRetrievability(stability: number, elapsedDays: number): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:325:  const retrievability = calculateRetrievability(finalStability, elapsedDays);
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:301:  - `folder-scoring.ts` — folder-level relevance and recency weighting.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:20:// Through calculateRetrievability(). Formula: R(t) = (1 + 19/81 * t/S)^(-0.5)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:80:function calculateRetrievability(stability: number, elapsedDays: number): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:202:  const retrievability = calculateRetrievability(params.stability, elapsedDays);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:346:function applyClassificationDecay(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:86:function trackAccess(memoryId: number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:199:function calculatePopularityScore(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:211:  let recencyScore = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:216:    recencyScore = Math.max(0, Math.min(1, 1 - (ageDays / decayDays)));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:219:  return (freqScore * 0.6) + (recencyScore * 0.4);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:227:function calculateUsageBoost(accessCount: number, lastAccessed: number | null): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:300:const R = calculateRetrievability(stability, elapsed);
.opencode/skill/system-spec-kit/mcp_server/lib/cache/scoring/README.md:29:- `../../scoring/folder-scoring.ts` -- recency decay used by composite scoring

web search: 
web search: 
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '620,690p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   620	    const similarity = Math.max(0, Math.min(1, similarityRaw / 100));
   621	    const importance = typeof row.importance_weight === 'number' && Number.isFinite(row.importance_weight)
   622	      ? row.importance_weight
   623	      : 0.5;
   624	
   625	    // Recency: use created_at as the timestamp (ISO string stored in DB)
   626	    const recencyTimestamp = (row.created_at as string | undefined) ?? '';
   627	    const importanceTier = (row.importance_tier as string | undefined) ?? 'normal';
   628	    const recency = computeRecencyScore(recencyTimestamp, importanceTier);
   629	
   630	    const intentScore =
   631	      similarity * weights.similarity +
   632	      importance * weights.importance +
   633	      recency * weights.recency;
   634	
   635	    return {
   636	      ...row,
   637	      intentAdjustedScore: intentScore,
   638	    };
   639	  });
   640	
   641	  return scored.sort((a, b) => {
   642	    const aScore = typeof a.intentAdjustedScore === 'number' ? a.intentAdjustedScore : 0;
   643	    const bScore = typeof b.intentAdjustedScore === 'number' ? b.intentAdjustedScore : 0;
   644	    if (bScore === aScore) return (a.id ?? 0) - (b.id ?? 0);
   645	    return bScore - aScore;
   646	  });
   647	}
   648	
   649	/**
   650	 * Apply artifact routing weight boosts to results.
   651	 *
   652	 * When the routing system detected a known artifact class with non-zero
   653	 * confidence, the class strategy's `boostFactor` is applied to the
   654	 * current composite score (`score`, then `rrfScore`, then `similarity`).
   655	 * Results are re-sorted by score descending after boosting.
   656	 *
   657	 * @param results       - Pipeline rows to boost
   658	 * @param routingResult - Artifact routing configuration from Stage 1
   659	 * @returns New array with updated scores, sorted descending
   660	 */
   661	function applyArtifactRouting(
   662	  results: PipelineRow[],
   663	  routingResult: ArtifactRoutingConfig
   664	): PipelineRow[] {
   665	  if (!Array.isArray(results) || results.length === 0) return results;
   666	  if (!routingResult || routingResult.confidence <= 0) return results;
   667	
   668	  // Obtain boostFactor from the strategy object (passed through config)
   669	  const strategy = routingResult.strategy as { boostFactor?: number; maxResults?: number };
   670	  const boostFactor = typeof strategy?.boostFactor === 'number'
   671	    ? Math.max(0, Math.min(2, strategy.boostFactor))
   672	    : 1.0;
   673	
   674	  if (boostFactor === 1.0) {
   675	    // No boost; still re-sort for consistency
   676	    return sortDeterministicRows(results as Array<PipelineRow & { id: number }>);
   677	  }
   678	
   679	  const boosted = results.map((row) => {
   680	    const baseScore = resolveBaseScore(row);
   681	    const boostedScore = baseScore * boostFactor;
   682	    return {
   683	      ...withSyncedScoreAliases(row, boostedScore),
   684	      artifactBoostApplied: boostFactor,
   685	    };
   686	  });
   687	
   688	  return sortDeterministicRows(boosted as Array<PipelineRow & { id: number }>);
   689	}
   690	

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '995,1035p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts | sed -n '320,380p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
  1011	      if (bonus <= 0) return row;
  1012	
  1013	      const baseScore = resolveBaseScore(row);
  1014	      const boostedScore = Math.min(1.0, baseScore + bonus);
  1015	      if (boostedScore === baseScore) return row;
  1016	
  1017	      recencyBoostedCount++;
  1018	      return withSyncedScoreAliases(row, boostedScore);
  1019	    });
  1020	    if (recencyBoostedCount > 0) {
  1021	      syncScoreAliasesInPlace(results);
  1022	      (metadata as Record<string, unknown>).recencyFusionApplied = true;
  1023	      (metadata as Record<string, unknown>).recencyFusionBoosted = recencyBoostedCount;
  1024	    }
  1025	  } catch (err: unknown) {
  1026	    const message = err instanceof Error ? err.message : String(err);
  1027	    console.warn(`[stage2-fusion] recency fusion failed: ${message}`);
  1028	  }
  1029	
  1030	  // -- 2. Causal boost --
  1031	  // Only for hybrid search type — causal graph traversal is seeded from the
  1032	  // Top results after session boost has re-ordered them.
  1033	  if (isHybrid && config.enableCausalBoost && isGraphUnifiedEnabled()) {
  1034	    try {
  1035	      const beforeScores = new Map(results.map((row) => [row.id, resolveBaseScore(row)]));

 succeeded in 0ms:
   320	
   321	  const timestamp = new Date(lastReview).getTime();
   322	  if (isNaN(timestamp)) return 0.5; // Neutral score for invalid dates
   323	
   324	  const elapsedMs = Date.now() - timestamp;
   325	  const elapsedDays = Math.max(0, elapsedMs / (1000 * 60 * 60 * 24));
   326	
   327	  // TM-03: Classification decay applies at stability-level; when enabled do not
   328	  // Additionally apply elapsed-time tier multipliers to avoid double decay.
   329	  let adjustedStability = stability;
   330	  if (classificationDecayEnabled) {
   331	    if (scheduler?.applyClassificationDecay) {
   332	      adjustedStability = scheduler.applyClassificationDecay(stability, contextType, tier);
   333	    } else {
   334	      adjustedStability = applyClassificationDecayFallback(stability, contextType, tier);
   335	    }
   336	    if (!isFinite(adjustedStability)) {
   337	      return 1;
   338	    }
   339	  }
   340	
   341	  let adjustedElapsedDays = elapsedDays;
   342	  if (!classificationDecayEnabled) {
   343	    const tierMultiplier = scheduler?.TIER_MULTIPLIER?.[tier]
   344	      ?? RETRIEVABILITY_TIER_MULTIPLIER[tier]
   345	      ?? RETRIEVABILITY_TIER_MULTIPLIER.normal;
   346	    adjustedElapsedDays = elapsedDays * tierMultiplier;
   347	  }
   348	
   349	  adjustedStability = Math.max(0.001, adjustedStability);
   350	
   351	  if (scheduler && typeof scheduler.calculateRetrievability === 'function') {
   352	    const score = scheduler.calculateRetrievability(adjustedStability, adjustedElapsedDays);
   353	    return Number.isFinite(score) ? score : 0;
   354	  }
   355	
   356	  // Inline FSRS power-law formula used when fsrs-scheduler module unavailable
   357	  const retrievability = Math.pow(1 + FSRS_FACTOR * (adjustedElapsedDays / adjustedStability), FSRS_DECAY);
   358	  const score = Math.max(0, Math.min(1, retrievability));
   359	  return Number.isFinite(score) ? score : 0;
   360	}
   361	
   362	export const calculateTemporalScore = calculateRetrievabilityScore;
   363	
   364	/**
   365	 * T032: Calculate usage score (REQ-017 Factor 2)
   366	 * Formula: min(1.5, 1.0 + accessCount * 0.05)
   367	 * Normalized to 0-1 range for composite scoring
   368	 */
   369	export function calculateUsageScore(accessCount: number): number {
   370	  accessCount = Math.max(0, accessCount);
   371	  const count = accessCount || 0;
   372	  const usageBoost = Math.min(1.5, 1.0 + count * 0.05);
   373	  return (usageBoost - 1.0) / 0.5;
   374	}
   375	
   376	/**
   377	 * T032: Calculate importance score with multiplier (REQ-017 Factor 3)
   378	 */
   379	export function calculateImportanceScore(tier: string, baseWeight: number | undefined): number {
   380	  const tierLower = (tier || 'normal').toLowerCase();

exec
/bin/zsh -lc "find .opencode/skill/system-spec-kit/mcp_server -path '*retention*.ts' -o -path '*retention*.js' | sort" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 510ms:
exec
/bin/zsh -lc 'rg -n "shouldArchive|classifyState|HOT|WARM|COLD|DORMANT|ARCHIVED" .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
39:  HOT: 0.80,
40:  WARM: 0.25,
41:  COLD: 0.05,
42:  DORMANT: 0.02,
45:const ARCHIVED_DAYS_THRESHOLD = 90;
61:  hotThreshold: parseThreshold('HOT_THRESHOLD', STATE_THRESHOLDS.HOT),
62:  warmThreshold: parseThreshold('WARM_THRESHOLD', STATE_THRESHOLDS.WARM),
63:  coldThreshold: parseThreshold('COLD_THRESHOLD', STATE_THRESHOLDS.COLD),
64:  archivedDaysThreshold: parseLimit('ARCHIVED_DAYS_THRESHOLD', ARCHIVED_DAYS_THRESHOLD),
65:  maxHotMemories: parseLimit('MAX_HOT_MEMORIES', 5),
66:  maxWarmMemories: parseLimit('MAX_WARM_MEMORIES', 10),
67:  maxColdMemories: parseLimit('MAX_COLD_MEMORIES', 3),
68:  maxDormantMemories: parseLimit('MAX_DORMANT_MEMORIES', 2),
69:  maxArchivedMemories: parseLimit('MAX_ARCHIVED_MEMORIES', 1),
73:// Validate threshold ordering (HOT > WARM > COLD)
75:  console.warn('[tier-classifier] Invalid thresholds: HOT must be > WARM. Using defaults.');
76:  TIER_CONFIG.hotThreshold = STATE_THRESHOLDS.HOT;
77:  TIER_CONFIG.warmThreshold = STATE_THRESHOLDS.WARM;
80:  console.warn('[tier-classifier] Invalid thresholds: WARM must be > COLD. Using defaults.');
81:  TIER_CONFIG.warmThreshold = STATE_THRESHOLDS.WARM;
82:  TIER_CONFIG.coldThreshold = STATE_THRESHOLDS.COLD;
89:type TierState = 'HOT' | 'WARM' | 'COLD' | 'DORMANT' | 'ARCHIVED';
100:  HOT: number;
101:  WARM: number;
102:  COLD: number;
103:  DORMANT: number;
104:  ARCHIVED: number;
233: *   - Two numbers: classifyState(retrievability, elapsedDays)
234: *   - A memory object: classifyState(memoryOrObj) where R is extracted from
236: *   - null/undefined: returns 'DORMANT'
238:function classifyState(
246:    return 'DORMANT';
250:    // Direct numeric call: classifyState(0.95, 5)
254:    // Memory object call: classifyState(memoryObj)
273:    return 'DORMANT';
276:  // ARCHIVED requires BOTH conditions: old age AND very low retrievability
279:  if (days > TIER_CONFIG.archivedDaysThreshold && r < STATE_THRESHOLDS.DORMANT) {
280:    return 'ARCHIVED';
282:  if (r >= TIER_CONFIG.hotThreshold) return 'HOT';
283:  if (r >= TIER_CONFIG.warmThreshold) return 'WARM';
284:  if (r >= TIER_CONFIG.coldThreshold) return 'COLD';
285:  return 'DORMANT';
300:  // If no decay (constitutional/critical), always HOT
302:    return { state: 'HOT', retrievability: 1.0, effectiveHalfLife: null };
305:  // Pinned memories are always HOT
307:    return { state: 'HOT', retrievability: 1.0, effectiveHalfLife };
326:  const state = classifyState(retrievability, elapsedDays);
365:  HOT: TIER_CONFIG.maxHotMemories,
366:  WARM: TIER_CONFIG.maxWarmMemories,
367:  COLD: TIER_CONFIG.maxColdMemories,
368:  DORMANT: TIER_CONFIG.maxDormantMemories,
369:  ARCHIVED: TIER_CONFIG.maxArchivedMemories,
373:const TIER_PRIORITY: TierState[] = ['HOT', 'WARM', 'COLD', 'DORMANT', 'ARCHIVED'];
381: * (HOT: 5, WARM: 10, COLD: 3, DORMANT: 2, ARCHIVED: 1 by default).
407:      HOT: [], WARM: [], COLD: [], DORMANT: [], ARCHIVED: [],
477:    HOT: 0,
478:    WARM: 0,
479:    COLD: 0,
480:    DORMANT: 0,
481:    ARCHIVED: 0,
496:function shouldArchive(memory: TierInput): boolean {
509:  return state === 'ARCHIVED' || state === 'DORMANT';
519:  ARCHIVED_DAYS_THRESHOLD,
525:  classifyState,
536:  shouldArchive,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts | sed -n '300,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   300	  // If no decay (constitutional/critical), always HOT
   301	  if (effectiveHalfLife === null) {
   302	    return { state: 'HOT', retrievability: 1.0, effectiveHalfLife: null };
   303	  }
   304	
   305	  // Pinned memories are always HOT
   306	  if (memory.is_pinned === 1) {
   307	    return { state: 'HOT', retrievability: 1.0, effectiveHalfLife };
   308	  }
   309	
   310	  // Calculate elapsed days
   311	  let elapsedDays = 0;
   312	  if (lastReview) {
   313	    const lastDate = new Date(lastReview);
   314	    const now = new Date();
   315	    elapsedDays = Math.max(0, (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
   316	  }
   317	
   318	  // Use effective stability from half-life.
   319	  // Math.max ensures new memories (default stability=1.0) benefit from their
   320	  // Type's configured half-life, while well-reviewed memories keep their
   321	  // Earned FSRS stability if it exceeds the type baseline.
   322	  const effectiveStability = halfLifeToStability(effectiveHalfLife);
   323	  const finalStability = Math.max(stability, effectiveStability);
   324	
   325	  const retrievability = calculateRetrievability(finalStability, elapsedDays);
   326	  const state = classifyState(retrievability, elapsedDays);
   327	
   328	  return { state, retrievability, effectiveHalfLife };
   329	}
   330	
   331	/* ───────────────────────────────────────────────────────────────
   332	   3. QUERY FUNCTIONS
   333	----------------------------------------------------------------*/
   334	
   335	/**
   336	 * Get memories filtered and classified by state.
   337	 */
   338	function getStateContent(
   339	  memories: TierInput[],
   340	  targetState: TierState,
   341	  limit: number = 20
   342	): StateContent {
   343	  const filtered = memories
   344	    .map(m => ({
   345	      ...m,
   346	      _classification: classifyTier(m),
   347	    }))
   348	    .filter(m => m._classification.state === targetState)
   349	    .slice(0, limit);
   350	
   351	  return {
   352	    state: targetState,
   353	    memories: filtered,
   354	    count: filtered.length,
   355	  };
   356	}
   357	
   358	/**
   359	 * T210: Per-tier limit map used by filterAndLimitByState.
   360	 * When applyStateLimits is true, each tier is capped to its max count.
   361	 * If a tier has fewer results than its limit, the surplus slots are
   362	 * redistributed to other tiers that have overflow (in priority order).
   363	 */
   364	const PER_TIER_LIMITS: Record<TierState, number> = {
   365	  HOT: TIER_CONFIG.maxHotMemories,
   366	  WARM: TIER_CONFIG.maxWarmMemories,
   367	  COLD: TIER_CONFIG.maxColdMemories,
   368	  DORMANT: TIER_CONFIG.maxDormantMemories,
   369	  ARCHIVED: TIER_CONFIG.maxArchivedMemories,
   370	};
   371	
   372	/** Priority order for tier overflow redistribution (highest priority first) */
   373	const TIER_PRIORITY: TierState[] = ['HOT', 'WARM', 'COLD', 'DORMANT', 'ARCHIVED'];
   374	
   375	/**
   376	 * Filter memories by state and apply limits.
   377	 * Generic over any type assignable to TierInput so callers preserve their
   378	 * concrete element type without double-casting.
   379	 *
   380	 * T210: When no targetState is specified, enforces per-tier quantity limits
   381	 * (HOT: 5, WARM: 10, COLD: 3, DORMANT: 2, ARCHIVED: 1 by default).
   382	 * If a tier has fewer results than its limit, surplus slots are redistributed
   383	 * to other tiers in priority order to maximize total result count.
   384	 */
   385	function filterAndLimitByState<T extends TierInput>(
   386	  memories: T[],
   387	  targetState: TierState | null = null,
   388	  limit: number = 20
   389	): T[] {
   390	  type ClassifiedEntry = {
   391	    memory: T;
   392	    classification: ReturnType<typeof classifyTier>;
   393	  };
   394	  let classified: ClassifiedEntry[] = memories.map((memory) => ({
   395	    memory,
   396	    classification: classifyTier(memory),
   397	  }));
   398	
   399	  if (targetState) {
   400	    classified = classified.filter((entry) => entry.classification.state === targetState);
   401	  }
   402	
   403	  // Apply per-tier limits with overflow redistribution
   404	  if (!targetState) {
   405	    // Group by tier
   406	    const byTier: Record<TierState, typeof classified> = {
   407	      HOT: [], WARM: [], COLD: [], DORMANT: [], ARCHIVED: [],
   408	    };
   409	    for (const entry of classified) {
   410	      const state = entry.classification.state;
   411	      byTier[state].push(entry);
   412	    }
   413	
   414	    // Calculate surplus slots from under-filled tiers
   415	    let surplusSlots = 0;
   416	    for (const tier of TIER_PRIORITY) {
   417	      const tierLimit = PER_TIER_LIMITS[tier];
   418	      const available = byTier[tier].length;
   419	      if (available < tierLimit) {
   420	        surplusSlots += tierLimit - available;

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Attention Decay
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Classification-based decay
     5	// DECAY STRATEGY (ADR-004): This module is the FACADE for all long-term
     6	// Memory decay. It exposes FSRS-based decay as the canonical path
     7	// (via composite-scoring.ts and fsrs-scheduler.ts).
     8	// Legacy exponential functions (calculateDecayedScore, applyDecay) were
     9	// Removed from the runtime API after callers migrated to applyFsrsDecay.
    10	// Or calculateCompositeAttention.
    11	//
    12	// Decay ownership map:
    13	// Long-term memory scoring → FSRS v4 (fsrs-scheduler.ts)
    14	// Composite attention      → 5-factor model (composite-scoring.ts) using FSRS temporal
    15	// Session/working memory   → Linear decay (working-memory.ts) — separate domain
    16	// Search-time ranking      → FSRS-preferred SQL (vector-index-impl.js)
    17	// External packages
    18	import type Database from 'better-sqlite3';
    19	
    20	/* --- 1. DEPENDENCIES --- */
    21	
    22	// Internal modules
    23	import * as fsrsScheduler from './fsrs-scheduler.js';
    24	import type { ReviewResult } from './fsrs-scheduler.js';
    25	import {
    26	  calculateFiveFactorScore,
    27	  calculateTemporalScore,
    28	  calculateUsageScore,
    29	  calculateImportanceScore,
    30	  calculatePatternScore,
    31	  calculateCitationScore,
    32	  FIVE_FACTOR_WEIGHTS,
    33	} from '../scoring/composite-scoring.js';
    34	import type { FiveFactorWeights } from '../scoring/composite-scoring.js';
    35	
    36	/* --- 2. CONFIGURATION --- */
    37	
    38	interface DecayRateByTier {
    39	  constitutional: number;
    40	  critical: number;
    41	  important: number;
    42	  normal: number;
    43	  temporary: number;
    44	  deprecated: number;
    45	  [key: string]: number;
    46	}
    47	
    48	interface DecayConfigType {
    49	  defaultDecayRate: number;
    50	  decayRateByTier: DecayRateByTier;
    51	  minScoreThreshold: number;
    52	}
    53	
    54	// ADR-061: Decay rates aligned with importance-tiers.js (1.0 = no decay)
    55	const DECAY_CONFIG: DecayConfigType = {
    56	  defaultDecayRate: 0.80,
    57	  decayRateByTier: {
    58	    constitutional: 1.0,
    59	    critical: 1.0,
    60	    important: 1.0,
    61	    normal: 0.80,
    62	    temporary: 0.60,
    63	    deprecated: 1.0,
    64	  },
    65	  minScoreThreshold: 0.001,
    66	};
    67	
    68	/* --- 3. STATE --- */
    69	
    70	let db: Database.Database | null = null;
    71	
    72	/* --- 4. INITIALIZATION --- */
    73	
    74	function init(database: Database.Database): void {
    75	  if (!database) {
    76	    throw new Error('[attention-decay] Database reference is required');
    77	  }
    78	  db = database;
    79	}
    80	
    81	function getDb(): Database.Database | null {
    82	  return db;
    83	}
    84	
    85	/* --- 5. DECAY RATE FUNCTIONS --- */
    86	
    87	function getDecayRate(importanceTier: string | null | undefined): number {
    88	  if (!importanceTier || typeof importanceTier !== 'string') {
    89	    return DECAY_CONFIG.defaultDecayRate;
    90	  }
    91	
    92	  const rate = DECAY_CONFIG.decayRateByTier[importanceTier];
    93	  return rate !== undefined ? rate : DECAY_CONFIG.defaultDecayRate;
    94	}
    95	
    96	// calculateDecayedScore was removed; use calculateRetrievabilityDecay or applyFsrsDecay.
    97	
    98	/**
    99	 * Calculate retrievability-based decay using FSRS formula.
   100	 */
   101	function calculateRetrievabilityDecay(stability: number, elapsedDays: number): number {
   102	  if (typeof fsrsScheduler.calculateRetrievability === 'function') {
   103	    return fsrsScheduler.calculateRetrievability(stability, elapsedDays);
   104	  }
   105	  // Inline fallback uses canonical constants from fsrs-scheduler.ts
   106	  if (stability <= 0 || elapsedDays < 0) return 0;
   107	  return Math.pow(1 + fsrsScheduler.FSRS_FACTOR * (elapsedDays / stability), fsrsScheduler.FSRS_DECAY);
   108	}
   109	
   110	// applyDecay was removed; use applyFsrsDecay.
   111	
   112	/**
   113	 * Apply FSRS-based decay to a memory.
   114	 */
   115	function applyFsrsDecay(
   116	  memory: Record<string, unknown>,
   117	  baseScore: number = 1.0
   118	): number {
   119	  const stability = (memory.stability as number) || 1.0;
   120	  const lastReview = (memory.last_review || memory.created_at) as string | undefined;
   121	
   122	  if (!lastReview) return baseScore;
   123	
   124	  const parsedTime = new Date(lastReview).getTime();
   125	  if (!Number.isFinite(parsedTime)) return baseScore;
   126	
   127	  const elapsedMs = Date.now() - parsedTime;
   128	  const elapsedDays = Math.max(0, elapsedMs / (1000 * 60 * 60 * 24));
   129	
   130	  const retrievability = calculateRetrievabilityDecay(stability, elapsedDays);
   131	  return baseScore * retrievability;
   132	}
   133	
   134	/**
   135	 * Activate a memory (boost its decay score via access recording).
   136	 */
   137	function activateMemory(memoryId: number): boolean {
   138	  if (!db) {
   139	    console.warn('[attention-decay] Database not initialized. Server may still be starting up.');
   140	    return false;
   141	  }
   142	
   143	  try {
   144	    const result = (db.prepare(`
   145	      UPDATE memory_index
   146	      SET access_count = access_count + 1,
   147	          last_accessed = ?,
   148	          updated_at = datetime('now')
   149	      WHERE id = ?
   150	    `) as Database.Statement).run(Date.now(), memoryId);
   151	    return (result as { changes: number }).changes > 0;
   152	  } catch (error: unknown) {
   153	    const msg = error instanceof Error ? error.message : String(error);
   154	    console.warn(`[attention-decay] activateMemory error: ${msg}`);
   155	    return false;
   156	  }
   157	}
   158	
   159	/**
   160	 * Activate memory with FSRS review update.
   161	 */
   162	function activateMemoryWithFsrs(memoryId: number, grade: number = 3): boolean {
   163	  if (!db) return false;
   164	
   165	  try {
   166	    const memory = (db.prepare('SELECT stability, difficulty, last_review, review_count FROM memory_index WHERE id = ?') as Database.Statement).get(memoryId) as Record<string, unknown> | undefined;
   167	    if (!memory) return false;
   168	
   169	    const params = {
   170	      stability: (memory.stability as number) || 1.0,
   171	      difficulty: (memory.difficulty as number) || 5.0,
   172	      lastReview: (memory.last_review as string) || null,
   173	      reviewCount: (memory.review_count as number) || 0,
   174	    };
   175	
   176	    let result: ReviewResult;
   177	    if (typeof fsrsScheduler.processReview === 'function') {
   178	      result = fsrsScheduler.processReview(params, grade);
   179	    } else {
   180	      // Basic update if FSRS not available

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1220,1265p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts | sed -n '140,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   140	    ensureGovernanceRuntime(db);
   141	
   142	    recordGovernanceAudit(db, {
   143	      action: 'memory_save',
   144	      decision: 'allow',
   145	      tenantId: 'tenant-a',
   146	      userId: 'user-1',
   147	      sessionId: 'session-1',
   148	      reason: 'governed_ingest',
   149	      metadata: { stage: 'pilot' },
   150	    });
   151	    recordGovernanceAudit(db, {
   152	      action: 'memory_save',
   153	      decision: 'deny',
   154	      tenantId: 'tenant-a',
   155	      userId: 'user-1',
   156	      sessionId: 'session-1',
   157	      reason: 'missing_provenance',
   158	    });
   159	    recordGovernanceAudit(db, {
   160	      action: 'retention_sweep',
   161	      decision: 'delete',
   162	      tenantId: 'tenant-b',
   163	      userId: 'user-9',
   164	      sessionId: 'session-9',
   165	      reason: 'delete_after_expired',
   166	    });
   167	
   168	    const review = reviewGovernanceAudit(db, {
   169	      tenantId: 'tenant-a',
   170	      action: 'memory_save',
   171	      limit: 10,
   172	    });
   173	
   174	    expect(review.summary.totalMatching).toBe(2);
   175	    expect(review.summary.returnedRows).toBe(2);
   176	    expect(review.summary.byAction).toEqual({ memory_save: 2 });
   177	    expect(review.summary.byDecision).toEqual({ allow: 1, deny: 1 });
   178	    expect(review.summary.latestCreatedAt).toEqual(expect.any(String));
   179	    expect(review.rows).toHaveLength(2);
   180	    expect(review.rows[0]).toMatchObject({
   181	      action: 'memory_save',
   182	      decision: 'deny',
   183	      tenantId: 'tenant-a',
   184	      userId: 'user-1',
   185	      sessionId: 'session-1',
   186	      reason: 'missing_provenance',
   187	    });
   188	    expect(review.rows[1]).toMatchObject({
   189	      action: 'memory_save',
   190	      decision: 'allow',
   191	      metadata: { stage: 'pilot' },
   192	    });
   193	  });
   194	
   195	  it('blocks unscoped governance audit enumeration unless allowUnscoped=true', () => {
   196	    const db = new Database(':memory:');
   197	    db.exec(`
   198	      CREATE TABLE memory_index (
   199	        id INTEGER PRIMARY KEY,
   200	        spec_folder TEXT,
   201	        file_path TEXT,
   202	        session_id TEXT
   203	      )
   204	    `);
   205	    ensureGovernanceRuntime(db);
   206	    recordGovernanceAudit(db, {
   207	      action: 'memory_save',
   208	      decision: 'allow',
   209	      tenantId: 'tenant-a',
   210	      userId: 'user-1',
   211	      sessionId: 'session-1',
   212	      reason: 'governed_ingest',
   213	    });
   214	
   215	    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
   216	    const blocked = reviewGovernanceAudit(db, {});
   217	
   218	    expect(blocked.rows).toEqual([]);
   219	    expect(blocked.summary.totalMatching).toBe(0);
   220	    expect(warnSpy).toHaveBeenCalledWith(

exec
/bin/zsh -lc "rg -n \"delete_after_expired|delete_after|retention sweep|sweepExpired|expired memories|retention\" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/handlers | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:139:  retentionPolicy?: 'keep' | 'ephemeral' | 'shared';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:169:  retention_policy?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:170:  delete_after?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:10:// Feature catalog: Hierarchical scope governance, governed ingest, retention, and audit
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:30: * Governed-ingest fields required to persist scope and retention metadata.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:36:  retentionPolicy?: RetentionPolicy;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:53:  retentionPolicy: RetentionPolicy;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:207:    || input.retentionPolicy === 'ephemeral'
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:208:    || input.retentionPolicy === 'shared'
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:216: * @returns Validation result with normalized scope, provenance, and retention data.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:223:  const retentionPolicy: RetentionPolicy = input.retentionPolicy === 'ephemeral' || input.retentionPolicy === 'shared'
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:224:    ? input.retentionPolicy
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:243:        retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:258:  // H21 FIX: Require valid future deleteAfter for ephemeral retention policy
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:259:  // Without this, ephemeral rows are never swept since sweeps key off delete_after
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:260:  if (retentionPolicy === 'ephemeral' && !deleteAfter) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:261:    issues.push('deleteAfter is required for ephemeral retention policy');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:277:      retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:299:    retention_policy: decision.normalized.retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:300:    delete_after: decision.normalized.deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:310:      retentionPolicy: decision.normalized.retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1114:    retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1145:    retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1458:    // persisted rows without tenant/shared-space/retention metadata.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1471:        metadata: { filePath: validatedPath, retentionPolicy: governanceDecision.normalized.retentionPolicy },
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:194:- Purpose: Owns scope enforcement, governed ingest normalization, audit recording, and retention sweeps. This is the boundary for tenant/user/agent/session/shared-space policy decisions.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:197:  - `retention.ts` — scoped retention sweep logic over expired memories.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:123: * The interval where retrievability = 0.9 (desired retention).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:175: * Get next review date based on stability and desired retention.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:44:  retention_policy?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:45:  delete_after?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:62:  'governed_at', 'retention_policy', 'delete_after', 'governance_metadata',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:927:    retention_policy: existingRow.retention_policy,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:928:    delete_after: existingRow.delete_after,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:92:| **Type-Specific Decay**      | Constitutional (none), Critical (none), Normal (0.80/turn)                            | Memory importance = retention time   |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:625:attentionDecayRate: 0.95      // 95% retention per decay cycle
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:878:// normal: 0.80 = 80% retention per turn
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:982:A: Constitutional memories are permanent rules and principles (like coding standards and architectural decisions). They should ALWAYS be available, so `decay_rate = 1.0` (100% retention = no decay). This applies to both `constitutional` and `critical` tiers.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1421:    { name: 'retention_policy', sql: "ALTER TABLE memory_index ADD COLUMN retention_policy TEXT DEFAULT 'keep'" },
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1422:    { name: 'delete_after', sql: 'ALTER TABLE memory_index ADD COLUMN delete_after TEXT' },
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1468:      CREATE INDEX IF NOT EXISTS idx_memory_retention_delete_after
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1469:        ON memory_index(delete_after);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2333:      retention_policy TEXT DEFAULT 'keep',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2334:      delete_after TEXT,

exec
/bin/zsh -lc "rg -n \"retentionPolicy|deleteAfter|retention\" .opencode/skill/system-spec-kit/mcp_server/README.md | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
710:| `retentionPolicy` | string | `keep` (default), `ephemeral`, `shared` |
711:| `deleteAfter` | string | ISO date for automatic deletion |

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/README.md | sed -n '700,725p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   700	
   701	This is how you add new knowledge to the system. Point it at a markdown file and it reads, validates, embeds and stores the content so it becomes searchable. Before storing, it checks whether the information already exists and decides whether to add it fresh, update an older version or skip it. Quality gates catch low-value content before it clutters the knowledge base.
   702	
   703	| Parameter | Type | Notes |
   704	|-----------|------|-------|
   705	| `filePath` | string | **Required.** Absolute path to the `.md` file to index |
   706	| `force` | boolean | Overwrite if already indexed |
   707	| `dryRun` | boolean | Preview validation without saving |
   708	| `skipPreflight` | boolean | Bypass quality gate (not recommended) |
   709	| `asyncEmbedding` | boolean | Return immediately, generate embedding in background |
   710	| `retentionPolicy` | string | `keep` (default), `ephemeral`, `shared` |
   711	| `deleteAfter` | string | ISO date for automatic deletion |
   712	| `sessionId` | string | Session attribution |
   713	| `tenantId` | string | Governance: tenant scope |
   714	| `userId` | string | Governance: user attribution |
   715	| `agentId` | string | Governance: agent attribution |
   716	| `sharedSpaceId` | string | Governance: shared-space target |
   717	| `provenanceSource` | string | Audit source label |
   718	| `provenanceActor` | string | Audit actor label |
   719	| `governedAt` | string | ISO timestamp for governed ingest audit |
   720	
   721	```json
   722	{
   723	  "tool": "memory_save",
   724	  "arguments": {
   725	    "filePath": "/absolute/path/to/memory-file.md",

exec
/bin/zsh -lc 'rg -n "decay|retention|forget|stale|aged|archive|archiv|review|last_accessed|access_count|delete_after|retention_policy|time|temporal|half-life|FSRS|recency|old|outdated" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:18:See the [mnemosyne README](https://github.com/gandazgul/mnemosyne#quick-start) for detailed setup instructions. On first use, mnemosyne will automatically download its ML models (~500 MB one-time).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:45:| `memory_delete` | Delete an outdated memory by its document ID |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:87:All ML inference runs locally via ONNX Runtime. Your memories never leave your machine.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:59:      // mnemosyne may write output to stderr (older versions), use whichever has content
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:195:          "Delete an outdated or incorrect memory by its document ID (shown in [brackets] in recall/list results).",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:219:- Delete outdated memories when new decisions contradict them.

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-022.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	## Findings
     2	For EACH finding:
     3	### Finding N: [Title]
     4	- **Source**: exact file path(s)
     5	- **What it does**: technical description with code evidence
     6	- **Why it matters for us**: concrete relevance
     7	- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
     8	- **Impact**: high / medium / low
     9	
    10	## Sources Consulted
    11	- [file paths examined]
    12	
    13	## Assessment
    14	- New information ratio: [0.0-1.0]
    15	- Questions addressed: [list]
    16	- Questions answered: [list]
    17	
    18	## Reflection
    19	- What worked: [approach that yielded results]
    20	- What did not work: [approach that failed]
    21	
    22	--
    23	## Findings
    24	### Finding 1: Add a transport-owned memory reminder block at compaction time
    25	- **Source**: [external/src/index.ts:210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [opencode-transport.ts:102](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L102), [memory-surface.ts:640](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L640); evidence type: both
    26	- **What it does**: Mnemosyne injects an explicit “use memory tools” reminder into `experimental.session.compacting`, while Public’s compaction path currently carries continuity payloads and surfaced memories, not a direct tool-usage reminder.
    27	- **Why it matters for us**: This is the clearest gap with the best fit: it improves post-compaction memory awareness without changing retrieval math or governance. Affected subsystem: OpenCode compaction transport.
    28	- **Recommendation**: adopt now
    29	- **Impact**: high
    30	## Findings
    31	For EACH finding:
    32	### Finding N: [Title]
    33	- **Source**: exact file path(s)
    34	- **What it does**: technical description with code evidence
    35	- **Why it matters for us**: concrete relevance
    36	- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
    37	- **Impact**: high / medium / low
    38	
    39	## Sources Consulted
    40	- [file paths examined]
    41	
    42	## Assessment
    43	- New information ratio: [0.0-1.0]
    44	- Questions addressed: [list]
    45	- Questions answered: [list]
    46	
    47	## Reflection
    48	- What worked: [approach that yielded results]
    49	- What did not work: [approach that failed]
    50	
    51	--
    52	## Findings
    53	### Finding 1: Mnemosyne is not a retrieval-engine upgrade for Public
    54	- **Source**: [external/src/index.ts:106](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L106), [external/README.md:82](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L82), [memory-search.ts:482](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482), [memory-search.ts:809](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L809); evidence: both
    55	- **What it does**: Mnemosyne’s wrapper forwards search requests to a backend whose BM25/vector/RRF internals are only README-documented, while Public already runs a visible multi-stage hybrid search pipeline.
    56	- **Why it matters for us**: The transferable value is wrapper ergonomics, not ranking replacement, so using Mnemosyne as a reason to re-architect Public retrieval would be a category error.
    57	- **Recommendation**: reject
    58	- **Impact**: high
    59	--- Iteration 21 ---
    60	## Findings
    61	For EACH finding:
    62	### Finding N: [Title]
    63	- **Source**: exact file path(s)
    64	- **What it does**: technical description with code evidence
    65	- **Why it matters for us**: concrete relevance
    66	- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
    67	- **Impact**: high / medium / low
    68	
    69	## Sources Consulted
    70	- [file paths examined]
    71	
    72	## Assessment
    73	- New information ratio: [0.0-1.0]
    74	- Questions addressed: [list]
    75	- Questions answered: [list]
    76	
    77	## Reflection
    78	- What worked: [approach that yielded results]
    79	- What did not work: [approach that failed]
    80	
    81	--
    82	## Findings
    83	For EACH finding:
    84	### Finding N: [Title]
    85	- **Source**: exact file path(s)
    86	- **What it does**: technical description with code evidence
    87	- **Why it matters for us**: concrete relevance
    88	- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
    89	- **Impact**: high / medium / low
    90	- **Why it matters**: This makes Mnemosyne useful as a minimum viable behavioral layer, but not as the architectural ceiling. Public’s gap is broader: it still lacks a dedicated stale-truth/remediation plane more than it lacks retrieval features.
    91	- **Recommendation**: NEW FEATURE
    92	- **Impact**: high
    93	
    94	### Finding 3: Scope separation converges, but Mnemosyne’s project/global split is uniquely simple and uniquely weak
    95	- **Source**: [Mnemosyne index.ts]( /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L27), [Mnemosyne README]( /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L51), [Modus iteration]( /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-013.md#L8), [MemPalace iteration]( /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-017.md#L5439), [Public memory search]( /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L14)
    96	- **What it does**: All systems partition memory somehow: Engram by agent/admin and sessions, Mex by scaffold vs repair plane, Modus by separate planes, MemPalace by layers and fact plane. Mnemosyne is the simplest: basename-derived project collection, a single global collection, plus `core` tagging.
    97	- **Why it matters**: The ergonomic lesson is real, but the identity model is brittle. Mnemosyne’s split is useful as a UX alias, not as a storage/governance model for Public.
    98	- **Recommendation**: prototype later
    99	- **Impact**: medium
   100	
   101	### Finding 4: Mnemosyne is uniquely valuable as a thin OpenCode-native facade over a local backend, not as a retrieval-engine replacement
   102	- **Source**: [Mnemosyne package]( /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L1), [Mnemosyne README]( /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L80), [Public startup]( /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1495), [Public compaction plugin]( /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L296), [CocoIndex README]( /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L42)
   103	- **What it does**: The checked-out Mnemosyne repo is mostly a Bun/OpenCode wrapper plus README contract. Its BM25/vector/RRF story is documented, but the wrapper itself mainly contributes CLI bridging, tool exposure, and compaction guidance. Public already has visible hybrid search and separate semantic code search.
   104	- **Why it matters**: Cross-system, the unique contribution here is facade ergonomics: an easy local memory plugin with a tight OpenCode surface. It is not evidence for reworking Public’s retrieval core.
   105	- **Recommendation**: reject
   106	- **Impact**: high
   107	
   108	### Finding 5: Readiness and trust boundaries are a hidden convergence theme, and Mnemosyne is uniquely brittle there
   109	- **Source**: [Mnemosyne index.ts]( /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L78), [Mnemosyne README]( /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L18), [Public startup]( /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1589), [Mex iteration]( /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-014.md#L9310), [Modus iteration]( /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-013.md#L15)
   110	- **What it does**: The other systems all expose some visible posture around truth, trust, freshness, or readiness. Mnemosyne auto-inits collections and depends on a first-use model download, but the wrapper does not fail closed on init readiness and can still advertise memory usage at compaction even if the backend is broken.
   111	- **Why it matters**: This is the biggest unique warning from this system. If we borrow its ergonomics, we should also invert its failure posture and keep readiness explicit and health-gated.
   112	- **Recommendation**: adopt now
   113	- **Impact**: high
   114	
   115	## Assessment
   116	- New information ratio: 0.33
   117	
   118	## Recommended Next Focus
   119	Design one Public-native packet around a unified memory operating protocol: transport-owned compaction guidance plus health-gated readiness and a bounded stale-truth repair loop. Keep retrieval math explicitly out of scope for that next pass.
   120	
   121	RESEARCH BRIEF:
   122	# $refine TIDD-EC Prompt: 004-opencode-mnemosyne-main
   123	
   124	## 2. Role
   125	
   126	You are a research specialist in hybrid search architectures (BM25 + vector embeddings), OpenCode plugin design, memory scoping patterns, and session compaction resilience. Work like a systems analyst who can separate TypeScript wrapper behavior from backend README claims, trace plugin lifecycle and hook wiring precisely, and translate OpenCode Mnemosyne's concrete design into practical improvements for `Code_Environment/Public`.
   127	
   128	## 3. Task
   129	
   130	Research OpenCode Mnemosyne's hybrid search architecture, plugin design patterns, and compaction survival strategies to identify practical, evidence-backed improvements for `Code_Environment/Public`, especially around combining text and vector search, OpenCode plugin integration, project-vs-global memory scoping, and preserving memory awareness across context compaction. Focus on what the external repo actually proves in `src/index.ts` and what the README describes about the Mnemosyne backend. Classify each recommendation as `adopt now`, `prototype later`, or `reject`.
   131	
   132	## 4. Context
   133	
   134	### 4.1 System Description
   135	
   136	OpenCode Mnemosyne is an OpenCode plugin that wraps the Go-based Mnemosyne local memory backend. The external repo is intentionally thin: `src/index.ts` contains the plugin entry point, CLI bridge, tool registration, scope initialization, and the `experimental.session.compacting` hook, while `README.md` describes the backend's hybrid retrieval model and intended agent workflow. The documented retrieval stack combines full-text search (SQLite FTS5 with BM25 ranking) and vector search (sqlite-vec cosine similarity using `snowflake-arctic-embed-m-v1.5`), then fuses both with Reciprocal Rank Fusion. All inference is local, the ML model is downloaded on first use (~500 MB), and no cloud APIs are involved.
   137	
   138	The plugin exposes five memory tools: `memory_recall`, `memory_recall_global`, `memory_store`, `memory_store_global`, and `memory_delete`. Project scope is derived from the current directory name and auto-initialized during plugin load; the global collection is initialized lazily on first global write. The wrapper shells out to the `mnemosyne` binary via `Bun.spawn`, quotes search strings to avoid FTS syntax issues, and injects compact memory-usage guidance into the compaction prompt so agents retain memory awareness after context resets.
   139	
   140	### 4.2 Cross-Phase Awareness Table
   141	
   142	| Phase | System | Core Pattern | Overlap Risk | Differentiation |
   143	|-------|--------|-------------|-------------|-----------------|
   144	| 001 | Engram | MCP memory server (Go, SQLite+FTS5) | 004 (FTS5 search) | Focus tool profiles, session lifecycle, topic keys |
   145	| 002 | Mex | Markdown scaffold + drift detection | 004 (memory) | Focus drift detection, scaffold, no-DB approach |
   146	| 003 | Modus Memory | FSRS spaced repetition + BM25 | 004 (BM25 search) | Focus FSRS decay, cross-referencing, query expansion |
   147	| 004 | OpenCode Mnemosyne | Hybrid search (FTS5 + vector) | 001 (FTS5), 003 (BM25) | Focus vector search, plugin architecture, scoping |
   148	
   149	### 4.3 What This Repo Already Has
   150	
   151	`Code_Environment/Public` already has Spec Kit Memory with a hybrid vector/BM25 memory retrieval pipeline in `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, startup and resume flows in `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`, and CocoIndex for semantic code search through `.opencode/skill/mcp-coco-index/README.md`. It also already has a compaction-oriented transport plugin in `.opencode/plugins/spec-kit-compact-code-graph.js` that injects structural context during `experimental.session.compacting`.
   152	
   153	What this repo does **not** currently have is an OpenCode memory plugin that wraps a standalone local binary, a first-class project/global tool pair with Mnemosyne's lightweight ergonomics, or a memory-specific compaction hook that injects tool-usage guidance directly into the compaction prompt. Do not repeat the outdated claim that Public lacks hybrid BM25+vector memory retrieval; compare Mnemosyne against the current code, not stale assumptions.
   154	
   155	## 5. Instructions
   156	
   157	1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main` as the pre-approved phase folder. Skip Gate 3, keep all writes inside this phase folder, and treat everything under `external/` as read-only.
   158	2. Start with the plugin entry point: read `external/opencode-mnemosyne-main/src/index.ts` from top to bottom before the README. Confirm how the OpenCode plugin is declared, how `ctx.directory` / `ctx.worktree` are resolved, how project names are normalized, and where collection initialization happens.
   159	3. Read `external/opencode-mnemosyne-main/package.json` immediately after `src/index.ts` to confirm packaging boundaries, plugin metadata, runtime assumptions, and whether the repo exposes any source beyond the wrapper.
   160	4. Trace the shared `mnemosyne(...args)` bridge in `src/index.ts`: `Bun.spawn`, `cwd` selection, stdout/stderr handling, exit-code failure behavior, missing-binary fallback, and the security implication of passing argv arrays instead of interpolated shell strings.
   161	5. Examine `memory_recall` and `memory_recall_global` in detail. Trace argument schemas, quoted search-string handling, project vs global flags, `--format plain`, and how the wrapper surfaces "No memories found" versus real backend output.
   162	6. Examine `memory_store` and `memory_store_global` in detail. Trace write semantics, lazy creation of the global collection, project collection auto-init, and what these choices imply for memory scoping, onboarding friction, and failure modes.
   163	7. Examine `memory_delete` in detail. Trace how document IDs are expected to flow from recall results into deletion, and what this says about memory lifecycle and hygiene expectations.
   164	8. Examine the `experimental.session.compacting` hook implementation in `src/index.ts` line by line. Treat this as the most novel feature of the phase: capture exactly what guidance is injected, when it runs, and how that compares with Public's structural compaction plugin in `.opencode/plugins/spec-kit-compact-code-graph.js`.
   165	9. Only after the wrapper analysis, read `external/opencode-mnemosyne-main/README.md`. Use it to extract hybrid-search claims, model choice, AGENTS.md guidance, offline-first positioning, and the stated project/global collection model. Distinguish clearly between wrapper-verified behavior and backend claims that are only documented here.
   166	10. Treat the Mnemosyne backend as an interface contract, not an implementation you can prove from this repo. Infer the wrapper-visible backend verbs (`init`, `search`, `add`, `delete`) and the documented hybrid-search behavior, but do not fabricate internal Go ranking logic that is not present in the checked-out plugin repository.
   167	11. Compare Mnemosyne directly against current `Code_Environment/Public` code: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` for existing hybrid retrieval, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` for session bootstrap/resume behavior, `.opencode/plugins/spec-kit-compact-code-graph.js` for compaction injection, and `.opencode/skill/mcp-coco-index/README.md` for semantic code-search positioning.
   168	12. Resolve cross-phase boundaries explicitly. Do not redo phase `001` as generic FTS5 study or phase `003` as generic BM25 study. This phase owns wrapper-to-backend boundaries, vector-search implications, OpenCode plugin ergonomics, project/global scoping, AGENTS guidance, and memory-awareness compaction behavior.
   169	13. Before deep research begins, ensure the phase folder contains the required Spec Kit docs for the chosen level. Validate the phase folder with:
   170	    ```bash
   171	    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict
   172	    ```
   173	14. After validation passes, run deep research using this exact topic:
   174	    ```text
   175	    Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main and identify concrete improvements for Code_Environment/Public, especially around hybrid search (BM25 + vector embeddings), OpenCode plugin architecture, memory scoping (project vs global), session compaction resilience, and offline-first memory design.
   176	    ```
   177	15. Save all outputs inside this phase folder, especially under `research/`. Every meaningful finding must cite exact file paths, say whether the evidence is wrapper-confirmed or README-level, explain why it matters for `Code_Environment/Public`, classify the recommendation as `adopt now`, `prototype later`, or `reject`, and identify the affected subsystem. When research is complete, update `checklist.md`, create `implementation-summary.md`, and save memory with:
   178	    ```bash
   179	    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main"
   180	    ```
   181	
   182	## 6. Research Questions
   183	
   184	1. How is hybrid retrieval presented at the plugin boundary: what does the README claim about BM25, vector similarity, and Reciprocal Rank Fusion, and what parts of that pipeline are actually visible from the wrapper?
   185	2. Why does Mnemosyne use `snowflake-arctic-embed-m-v1.5`, and what should `Code_Environment/Public` learn from that model choice even if Public already has other embedding-backed retrieval systems?
   186	3. How effective is Mnemosyne's project-vs-global scope split, and would a similar ergonomic separation improve Public's memory-save and recall flows without duplicating existing scoped retrieval features?
   187	4. What exactly does the compaction hook preserve, and how does prompt-level tool guidance differ from Public's current structural-context compaction transport?
   188	5. What operational value comes from the plugin auto-initializing the project collection and lazily initializing the global collection, and what failure or ambiguity risks come with deriving the project key from the directory basename?
   189	6. How should the README's AGENTS.md recommendation be interpreted as workflow guidance: is it merely usage advice, or does it reveal a reusable memory-discipline pattern for Public sessions?
   190	7. Compared with CocoIndex's semantic code search, what is unique about Mnemosyne's hybrid memory retrieval story, and where should those systems stay separate rather than merged?
   191	8. Compared with Public's current `memory_search` pipeline, which Mnemosyne ideas are already covered, which are partial overlaps, and which are genuinely new?
   192	9. How does the OpenCode plugin lifecycle shape adoption compared with MCP-server-based memory systems: installation, runtime assumptions, binary dependency management, and tool exposure ergonomics?
   193	10. What are the practical implications of the offline-first design, including local model download cost, first-run latency, privacy benefits, and failure handling when the binary or model is missing?
   194	
   195	## 7. Do's
   196	
   197	- Do trace the full wrapper lifecycle in `src/index.ts`, not just the README summary.
   198	- Do separate wrapper-confirmed behavior from backend claims documented only in `README.md`.
   199	- Do trace the hybrid-search narrative end to end as a contract: query entry, quoted search handoff, backend search call, and fused-ranking claims.
   200	- Do study project and global scoping as product decisions, not just CLI flags.
   201	- Do examine the compaction hook as the phase's highest-priority differentiator for `Code_Environment/Public`.
   202	- Do compare against current Public files so the research reflects today's hybrid retrieval and compaction behavior.
   203	- Do note where the external repo has no extra architecture files or AGENTS file, and treat that absence as evidence about how thin the wrapper really is.
   204	
   205	## 8. Don'ts
   206	
   207	- Do not spend most of the analysis on Mnemosyne's unseen Go internals; they are a dependency, not the plugin repo under study.
   208	- Do not conflate the TypeScript wrapper with the backend search implementation. State clearly when a claim is README-level rather than source-proven.
   209	- Do not ignore the compaction hook; it is the most novel and transferable feature for `Code_Environment/Public`.
   210	- Do not claim Public lacks hybrid BM25+vector memory retrieval when `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` already proves otherwise.
   211	- Do not try to run the system unless the binary and model are already installed; static analysis is sufficient for this phase, and first-run model download is large.
   212	- Do not collapse this phase into generic FTS5 or BM25 discussion already owned by phases `001` and `003`.
   213	- Do not edit anything under `external/` or outside this phase folder.
   214	
   215	## 9. Examples
   216	
   217	### Example A: Hybrid-search contract finding
   218	
   219	```text
   220	**Finding: Hybrid retrieval is a documented backend contract, not a wrapper-owned algorithm**

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-021.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	## Findings
     2	For EACH finding:
     3	### Finding N: [Title]
     4	- **Source**: exact file path(s)
     5	- **What it does**: technical description with code evidence
     6	- **Why it matters for us**: concrete relevance
     7	- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
     8	- **Impact**: high / medium / low
     9	
    10	## Sources Consulted
    11	- [file paths examined]
    12	
    13	## Assessment
    14	- New information ratio: [0.0-1.0]
    15	- Questions addressed: [list]
    16	- Questions answered: [list]
    17	
    18	## Reflection
    19	- What worked: [approach that yielded results]
    20	- What did not work: [approach that failed]
    21	
    22	--
    23	## Findings
    24	For EACH finding:
    25	### Finding N: [Title]
    26	- **Source**: exact file path(s)
    27	- **What it does**: technical description with code evidence
    28	- **Why it matters for us**: concrete relevance
    29	- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
    30	- **Impact**: high / medium / low
    31	## Findings
    32	For EACH finding:
    33	### Finding N: [Title]
    34	- **Source**: exact file path(s)
    35	- **What it does**: technical description with code evidence
    36	- **Why it matters for us**: concrete relevance
    37	- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
    38	- **Impact**: high / medium / low
    39	
    40	## Sources Consulted
    41	- [file paths examined]
    42	
    43	## Assessment
    44	- New information ratio: [0.0-1.0]
    45	- Questions addressed: [list]
    46	- Questions answered: [list]
    47	
    48	## Reflection
    49	- What worked: [approach that yielded results]
    50	- What did not work: [approach that failed]
    51	
    52	--
    53	## Findings
    54	### Finding 1: Init and first-use readiness fail late and ambiguously
    55	- **Source**: [external/src/index.ts#L78](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L78), [external/src/index.ts#L171](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L171), [external/README.md#L18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L18), [context-server.ts#L1495](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1495), [context-server.ts#L1589](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1589)
    56	- **What it does**: Mnemosyne auto-runs `mnemosyne init` for project/global collections but never checks the subprocess exit code in those init paths; the README also says first use downloads about 500 MB of models. If init or model download fails, the wrapper does not surface a readiness state up front. Public instead validates provider config, runs integrity checks, refuses embedding-dimension mismatches, and emits explicit degraded or fatal startup guidance.
    57	- **Why it matters for us**: This is the biggest operational gap. Missing model, permissions failure, corrupt collection, and init failure can all look like “tool broke later,” not “system is not ready.”
    58	- **Recommendation**: adopt now
    59	- **Impact**: high
    60	## Findings
    61	For EACH finding:
    62	### Finding N: [Title]
    63	- **Source**: exact file path(s)
    64	- **What it does**: technical description with code evidence
    65	- **Why it matters for us**: concrete relevance
    66	- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
    67	- **Impact**: high / medium / low
    68	
    69	## Sources Consulted
    70	- [file paths examined]
    71	
    72	## Assessment
    73	- New information ratio: [0.0-1.0]
    74	- Questions addressed: [list]
    75	- Questions answered: [list]
    76	
    77	## Reflection
    78	- What worked: [approach that yielded results]
    79	- What did not work: [approach that failed]
    80	
    81	--
    82	## Findings
    83	### Finding 1: Health-gated memory compaction guidance is the easiest high-value transfer
    84	- **Source**: [external/src/index.ts#L208](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L208), [spec-kit-compact-code-graph.js#L185](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L185), [spec-kit-compact-code-graph.js#L296](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L296), [spec-kit-compact-code-graph.js#L396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396)
    85	- **What it does**: Mnemosyne appends a fixed memory-usage block during `experimental.session.compacting`; Public already has a transport-gated compaction pipeline with cache, `runtimeReady`, `lastRuntimeError`, and a status tool.
    86	- **Why it matters for us**: Integration effort is low because the hook plumbing already exists in Public. The work is mostly adding a memory-oriented compaction block to the transport plan, not changing retrieval internals.
    87	- **Recommendation**: adopt now
    88	- **Impact**: high
    89	## Findings
    90	For EACH finding:
    91	### Finding N: [Title]
    92	- **Source**: exact file path(s)
    93	- **What it does**: technical description with code evidence
    94	- **Why it matters for us**: concrete relevance
    95	- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
    96	- **Impact**: high / medium / low
    97	
    98	## Sources Consulted
    99	- [file paths examined]
   100	
   101	## Assessment
   102	- New information ratio: [0.0-1.0]
   103	- Questions addressed: [list]
   104	- Questions answered: [list]
   105	
   106	## Reflection
   107	- What worked: [approach that yielded results]
   108	- What did not work: [approach that failed]
   109	
   110	--
   111	## Findings
   112	### Finding 1: Adopting Mnemosyne-style compaction reminders risks duplicating Public’s existing compaction channels
   113	- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L208), [spec-kit-compact-code-graph.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396), [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L102), [memory-surface.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L623)
   114	- **Evidence type**: wrapper-confirmed for Mnemosyne; wrapper-confirmed for Public
   115	- **What it does**: Mnemosyne appends a fixed memory-usage instruction block during `experimental.session.compacting`, while Public already has a transport-backed compaction note plus a separate `autoSurfaceAtCompaction()` path that injects retrieved memory/context.
   116	- **Why it matters for us**: The transfer is still attractive, but the main risk is prompt collision: we could end up with three compaction surfaces saying similar things in different voices, which weakens retrieval-policy clarity and increases prompt noise.
   117	- **Recommendation**: adopt now
   118	- **Impact**: high
   119	## Findings
   120	For EACH finding:
   121	### Finding N: [Title]
   122	- **Source**: exact file path(s)
   123	- **What it does**: technical description with code evidence
   124	- **Why it matters for us**: concrete relevance
   125	- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
   126	- **Impact**: high / medium / low
   127	
   128	## Sources Consulted
   129	- [file paths examined]
   130	
   131	## Assessment
   132	- New information ratio: [0.0-1.0]
   133	- Questions addressed: [list]
   134	- Questions answered: [list]
   135	
   136	## Reflection
   137	- What worked: [approach that yielded results]
   138	- What did not work: [approach that failed]
   139	
   140	--
   141	## Findings
   142	### Finding 1: Add a transport-owned memory reminder block at compaction time
   143	- **Source**: [external/src/index.ts:210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [opencode-transport.ts:102](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L102), [memory-surface.ts:640](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts#L640); evidence type: both
   144	- **What it does**: Mnemosyne injects an explicit “use memory tools” reminder into `experimental.session.compacting`, while Public’s compaction path currently carries continuity payloads and surfaced memories, not a direct tool-usage reminder.
   145	- **Why it matters for us**: This is the clearest gap with the best fit: it improves post-compaction memory awareness without changing retrieval math or governance. Affected subsystem: OpenCode compaction transport.
   146	- **Recommendation**: adopt now
   147	- **Impact**: high
   148	## Findings
   149	For EACH finding:
   150	### Finding N: [Title]
   151	- **Source**: exact file path(s)
   152	- **What it does**: technical description with code evidence
   153	- **Why it matters for us**: concrete relevance
   154	- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
   155	- **Impact**: high / medium / low
   156	
   157	## Sources Consulted
   158	- [file paths examined]
   159	
   160	## Assessment
   161	- New information ratio: [0.0-1.0]
   162	- Questions addressed: [list]
   163	- Questions answered: [list]
   164	
   165	## Reflection
   166	- What worked: [approach that yielded results]
   167	- What did not work: [approach that failed]
   168	
   169	--
   170	## Findings
   171	### Finding 1: Mnemosyne is not a retrieval-engine upgrade for Public
   172	- **Source**: [external/src/index.ts:106](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L106), [external/README.md:82](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L82), [memory-search.ts:482](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482), [memory-search.ts:809](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L809); evidence: both
   173	- **What it does**: Mnemosyne’s wrapper forwards search requests to a backend whose BM25/vector/RRF internals are only README-documented, while Public already runs a visible multi-stage hybrid search pipeline.
   174	- **Why it matters for us**: The transferable value is wrapper ergonomics, not ranking replacement, so using Mnemosyne as a reason to re-architect Public retrieval would be a category error.
   175	- **Recommendation**: reject
   176	- **Impact**: high
   177	
   178	RESEARCH BRIEF:
   179	# $refine TIDD-EC Prompt: 004-opencode-mnemosyne-main
   180	
   181	## 2. Role
   182	
   183	You are a research specialist in hybrid search architectures (BM25 + vector embeddings), OpenCode plugin design, memory scoping patterns, and session compaction resilience. Work like a systems analyst who can separate TypeScript wrapper behavior from backend README claims, trace plugin lifecycle and hook wiring precisely, and translate OpenCode Mnemosyne's concrete design into practical improvements for `Code_Environment/Public`.
   184	
   185	## 3. Task
   186	
   187	Research OpenCode Mnemosyne's hybrid search architecture, plugin design patterns, and compaction survival strategies to identify practical, evidence-backed improvements for `Code_Environment/Public`, especially around combining text and vector search, OpenCode plugin integration, project-vs-global memory scoping, and preserving memory awareness across context compaction. Focus on what the external repo actually proves in `src/index.ts` and what the README describes about the Mnemosyne backend. Classify each recommendation as `adopt now`, `prototype later`, or `reject`.
   188	
   189	## 4. Context
   190	
   191	### 4.1 System Description
   192	
   193	OpenCode Mnemosyne is an OpenCode plugin that wraps the Go-based Mnemosyne local memory backend. The external repo is intentionally thin: `src/index.ts` contains the plugin entry point, CLI bridge, tool registration, scope initialization, and the `experimental.session.compacting` hook, while `README.md` describes the backend's hybrid retrieval model and intended agent workflow. The documented retrieval stack combines full-text search (SQLite FTS5 with BM25 ranking) and vector search (sqlite-vec cosine similarity using `snowflake-arctic-embed-m-v1.5`), then fuses both with Reciprocal Rank Fusion. All inference is local, the ML model is downloaded on first use (~500 MB), and no cloud APIs are involved.
   194	
   195	The plugin exposes five memory tools: `memory_recall`, `memory_recall_global`, `memory_store`, `memory_store_global`, and `memory_delete`. Project scope is derived from the current directory name and auto-initialized during plugin load; the global collection is initialized lazily on first global write. The wrapper shells out to the `mnemosyne` binary via `Bun.spawn`, quotes search strings to avoid FTS syntax issues, and injects compact memory-usage guidance into the compaction prompt so agents retain memory awareness after context resets.
   196	
   197	### 4.2 Cross-Phase Awareness Table
   198	
   199	| Phase | System | Core Pattern | Overlap Risk | Differentiation |
   200	|-------|--------|-------------|-------------|-----------------|
   201	| 001 | Engram | MCP memory server (Go, SQLite+FTS5) | 004 (FTS5 search) | Focus tool profiles, session lifecycle, topic keys |
   202	| 002 | Mex | Markdown scaffold + drift detection | 004 (memory) | Focus drift detection, scaffold, no-DB approach |
   203	| 003 | Modus Memory | FSRS spaced repetition + BM25 | 004 (BM25 search) | Focus FSRS decay, cross-referencing, query expansion |
   204	| 004 | OpenCode Mnemosyne | Hybrid search (FTS5 + vector) | 001 (FTS5), 003 (BM25) | Focus vector search, plugin architecture, scoping |
   205	
   206	### 4.3 What This Repo Already Has
   207	
   208	`Code_Environment/Public` already has Spec Kit Memory with a hybrid vector/BM25 memory retrieval pipeline in `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, startup and resume flows in `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`, and CocoIndex for semantic code search through `.opencode/skill/mcp-coco-index/README.md`. It also already has a compaction-oriented transport plugin in `.opencode/plugins/spec-kit-compact-code-graph.js` that injects structural context during `experimental.session.compacting`.
   209	
   210	What this repo does **not** currently have is an OpenCode memory plugin that wraps a standalone local binary, a first-class project/global tool pair with Mnemosyne's lightweight ergonomics, or a memory-specific compaction hook that injects tool-usage guidance directly into the compaction prompt. Do not repeat the outdated claim that Public lacks hybrid BM25+vector memory retrieval; compare Mnemosyne against the current code, not stale assumptions.
   211	
   212	## 5. Instructions
   213	
   214	1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main` as the pre-approved phase folder. Skip Gate 3, keep all writes inside this phase folder, and treat everything under `external/` as read-only.
   215	2. Start with the plugin entry point: read `external/opencode-mnemosyne-main/src/index.ts` from top to bottom before the README. Confirm how the OpenCode plugin is declared, how `ctx.directory` / `ctx.worktree` are resolved, how project names are normalized, and where collection initialization happens.
   216	3. Read `external/opencode-mnemosyne-main/package.json` immediately after `src/index.ts` to confirm packaging boundaries, plugin metadata, runtime assumptions, and whether the repo exposes any source beyond the wrapper.
   217	4. Trace the shared `mnemosyne(...args)` bridge in `src/index.ts`: `Bun.spawn`, `cwd` selection, stdout/stderr handling, exit-code failure behavior, missing-binary fallback, and the security implication of passing argv arrays instead of interpolated shell strings.
   218	5. Examine `memory_recall` and `memory_recall_global` in detail. Trace argument schemas, quoted search-string handling, project vs global flags, `--format plain`, and how the wrapper surfaces "No memories found" versus real backend output.
   219	6. Examine `memory_store` and `memory_store_global` in detail. Trace write semantics, lazy creation of the global collection, project collection auto-init, and what these choices imply for memory scoping, onboarding friction, and failure modes.
   220	7. Examine `memory_delete` in detail. Trace how document IDs are expected to flow from recall results into deletion, and what this says about memory lifecycle and hygiene expectations.

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 2719ms:

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
I’ve got enough evidence to frame the temporal delta now: Mnemosyne relies on manual hygiene plus `core` pinning, whereas Spec Kit Memory already mixes decay, archival, and governed expiry. I’m waiting on the strict phase validation result, then I’ll turn this into a bounded set of decay-and-retention findings with exact recommendations.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts | sed -n '388,430p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "rg -n \"contradict|archive older|supersede|auto-merge|is_archived = 1|delete outdated|outdated\" .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:45: * and auto-merged.  Requires SPECKIT_ASSISTIVE_RECONSOLIDATION=true.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:51: * (possible supersede/complement).  A recommendation is logged but no
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:69: *   similarity >= 0.96  → auto-merge (near-duplicate)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:70: *   0.88 <= sim < 0.96  → review (supersede or complement recommendation)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:86: * superseded or complemented.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:90: * (supersede).  Callers may override with domain-specific logic.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:94: * @returns 'supersede' or 'complement'
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:99:): 'supersede' | 'complement' {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:103:  return newerLen > olderLen * 1.2 ? 'complement' : 'supersede';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:345:              status: reconResult.action === 'merge' ? 'merged' : 'superseded',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:369:  // shadow-only (auto-merge at >= 0.96 only archives old record).
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:402:              SET is_archived = 1,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:410:              `[reconsolidation-bridge] assistive auto-merge: archived older=${topId} ` +
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:415:            console.warn(`[reconsolidation-bridge] assistive auto-merge archive failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:49:  by_supersedes: FlatEdge[];
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:50:  by_contradicts: FlatEdge[];
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:62:  supersedes: FlatEdge[];
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:63:  contradicts: FlatEdge[];
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:141:    by_supersedes: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:142:    by_contradicts: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:186:      case 'supersedes': return result.by_supersedes;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:187:      case 'contradicts': return result.by_contradicts;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:209:    by_supersedes: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:210:    by_contradicts: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:228:      case 'supersedes': merged.by_supersedes.push(edge); break;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:229:      case 'contradicts': merged.by_contradicts.push(edge); break;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:275:    by_supersedes: allowed.has('supersedes') ? chain.by_supersedes : [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:276:    by_contradicts: allowed.has('contradicts') ? chain.by_contradicts : [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:293:    by_supersedes: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:294:    by_contradicts: [],
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:308:    supersedes: chain.by_supersedes,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:309:    contradicts: chain.by_contradicts,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:325:  if (chain.by_supersedes.length > 0) parts.push(`${chain.by_supersedes.length} supersedes`);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:326:  if (chain.by_contradicts.length > 0) parts.push(`${chain.by_contradicts.length} contradicts`);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:516:    if (combinedChain.by_contradicts.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:9:// - similarity in [0.75, 0.88): CONFLICT (supersede prior memory via causal 'supersedes' edge)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:88:/** Result of a conflict (supersede) operation */
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:132:/** Threshold above which memories are in conflict (supersede) */
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:255:    // F04-001: Append-only merge — mark old as superseded, create new record
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:289:      // Mark existing memory as archived (superseded)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:292:        SET is_archived = 1,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:346:      // Create supersedes causal edge
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:349:        VALUES (?, ?, 'supersedes', 1.0, datetime('now'))
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:464: * - Mark existing memory as deprecated (superseded)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:465: * - Create a 'supersedes' causal edge from new -> existing
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:471: * @param existingMemory - The existing memory being superseded
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:474: * @returns ConflictResult with supersede details
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:482:    // Add causal 'supersedes' edge only when caller provides a distinct new ID.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:483:    // Prevent self-referential supersedes edges (source == target).
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:511:          'supersedes',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:517:            `Failed to insert supersedes edge (${sourceId} -> ${targetId}) — aborting reconsolidation`
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:654:        // TM-06 live-save path: materialize memory + supersede edge together
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:673:          // Memory so we don't leave dangling rows with no supersedes edge.

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts | sed -n '140,190p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   140	}
   141	
   142	/** Reinforce an existing memory's stability via FSRS scheduling instead of creating a duplicate */
   143	function reinforceExistingMemory(memoryId: number, parsed: ParsedMemory): IndexResult {
   144	  const database = requireDb();
   145	
   146	  try {
   147	    const memory = database.prepare(`
   148	      SELECT id, stability, difficulty, last_review, review_count, title
   149	      FROM memory_index
   150	      WHERE id = ?
   151	    `).get(memoryId) as Record<string, unknown> | undefined;
   152	
   153	    if (!memory) {
   154	      throw new Error(`Memory ${memoryId} not found for reinforcement`);
   155	    }
   156	
   157	    const elapsedDays = fsrsScheduler.calculateElapsedDays(memory.last_review as string | null);
   158	    const currentStability = (memory.stability as number) || fsrsScheduler.DEFAULT_INITIAL_STABILITY;
   159	    const currentDifficulty = (memory.difficulty as number) || fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY;
   160	    const retrievability = fsrsScheduler.calculateRetrievability(currentStability, elapsedDays);
   161	
   162	    const newStability = fsrsScheduler.updateStability(
   163	      currentStability,
   164	      currentDifficulty,
   165	      fsrsScheduler.GRADE_GOOD,
   166	      retrievability
   167	    );
   168	
   169	    // Keep document-type-aware weighting on reinforcement.
   170	    const importanceWeight = calculateDocumentWeight(parsed.filePath, parsed.documentType);
   171	
   172	    // P4-05 FIX: Check result.changes to detect no-op updates (e.g., deleted memory)
   173	    const updateResult = database.prepare(`
   174	      UPDATE memory_index
   175	      SET stability = ?,
   176	          importance_weight = ?,
   177	          content_text = COALESCE(content_text, ?),
   178	          content_hash = CASE WHEN content_text IS NULL THEN ? ELSE content_hash END,
   179	          last_review = datetime('now'),
   180	          review_count = COALESCE(review_count, 0) + 1,
   181	          updated_at = datetime('now')
   182	      WHERE id = ?
   183	    `).run(newStability, importanceWeight, parsed.content, parsed.contentHash, memoryId);
   184	
   185	    if ((updateResult as { changes: number }).changes === 0) {
   186	      throw new Error(`PE reinforcement UPDATE matched 0 rows for memory ${memoryId}`);
   187	    }
   188	
   189	    return {
   190	      status: 'reinforced',

exec
/bin/zsh -lc "rg -n \"desiredRetention|0.9|nextReviewDate|processReview\" .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:15:// Linear multiplicative: score * 0.95 per tick
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:70:  nextReviewDate: string;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:123: * The interval where retrievability = 0.9 (desired retention).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:125:function calculateOptimalInterval(stability: number, desiredRetention: number = 0.9): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:128:  if (safeStability <= 0 || desiredRetention <= 0 || desiredRetention >= 1) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:132:  const interval = (safeStability / FSRS_FACTOR) * (Math.pow(desiredRetention, 1 / FSRS_DECAY) - 1);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:177:function getNextReviewDate(stability: number, desiredRetention: number = 0.9): string {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:178:  const intervalDays = calculateOptimalInterval(stability, desiredRetention);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:200:function processReview(params: FsrsParams, grade: number): ReviewResult {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:207:  const nextReviewDate = getNextReviewDate(newStability);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:214:    nextReviewDate,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:496:  processReview,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '110,170p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "rg -n \"function computeRecencyScore|computeRecencyScore\\(\" .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts .opencode/skill/system-spec-kit/mcp_server/lib/scoring/folder-scoring.ts .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:628:    const recency = computeRecencyScore(recencyTimestamp, importanceTier);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1009:      const recencyScore = computeRecencyScore(recencyTimestamp, importanceTier);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:505:  return computeRecencyScore(timestamp || '', tier, DECAY_RATE);

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/scoring/folder-scoring.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Folder Scoring
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Folder-level relevance scoring
     5	// SCORING: FOLDER SCORING BARREL
     6	export {
     7	  type FolderMemoryInput,
     8	  ARCHIVE_PATTERNS,
     9	  TIER_WEIGHTS,
    10	  SCORE_WEIGHTS,
    11	  DECAY_RATE,
    12	  TIER_ORDER,
    13	  isArchived,
    14	  getArchiveMultiplier,
    15	  computeRecencyScore,
    16	  simplifyFolderPath,
    17	  computeSingleFolderScore,
    18	  findTopTier,
    19	  findLastActivity,
    20	  computeFolderScores,
    21	} from '@spec-kit/shared/scoring/folder-scoring';

exec
/bin/zsh -lc "rg -n \"useDecay|trackAccess\" .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts .opencode/skill/system-spec-kit/mcp_server/tools/types.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:56:  useDecay?: boolean;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:74:  trackAccess?: boolean;
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:86:      useDecay: { type: 'boolean', default: true, description: 'Apply temporal decay scoring to results' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:165:      trackAccess: {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '78,172p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/README.md | sed -n '450,470p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   450	
   451	**Importance Tiers**: Six-level classification system
   452	
   453	| Tier | Decay | Boost | Description |
   454	|------|-------|-------|-------------|
   455	| Constitutional | No | 3.0x | Permanent rules and core principles |
   456	| Critical | No | 2.0x | Essential information, breaking changes |
   457	| Important | No | 1.5x | Significant context, architectural decisions |
   458	| Normal | Yes | 1.0x | Standard information |
   459	| Temporary | Yes (fast) | 0.5x | Session-specific, ephemeral |
   460	| Deprecated | No | 0.0x | Obsolete but preserved |
   461	
   462	**Composite Scoring**: Multi-factor ranking for spec folders
   463	
   464	```typescript
   465	// Combines recency, relevance, importance and access patterns
   466	const score = scoring.folderScoring.calculate_folder_score({
   467	  specFolder: 'specs/<###-spec-name>',
   468	  queryRelevance: 0.85,
   469	  lastAccessed: new Date('2025-01-20'),
   470	  importanceTier: 'critical',

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md | sed -n '88,110p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    88	| **Power-Law Decay**          | FSRS v4 formula validated on 100M+ users                                              | More accurate than exponential decay |
    89	| **5-State Model**            | HOT/WARM/COLD/DORMANT/ARCHIVED with thresholds                                        | Progressive memory transitions       |
    90	| **Duplicate Prevention**     | 4-tier similarity detection (95/85/70/50%)                                            | Prevents redundant context           |
    91	| **Spreading Activation**     | Boost related memories (+0.15 on access)                                              | Maintains semantic coherence         |
    92	| **Type-Specific Decay**      | Constitutional (none), Critical (none), Normal (0.80/turn)                            | Memory importance = retention time   |
    93	| **Testing Effect**           | Low retrievability = greater boost on success                                         | Harder recalls strengthen more       |
    94	| **Automatic Archival**       | 90-day threshold with background job (2hr interval)                                   | Lifecycle management                 |
    95	| **Document-Aware Retrieval** | Uses indexed doc metadata (`spec`, `plan`, `decision_record`, etc.) in ranking inputs | Better relevance for spec workflows  |
    96	| **Event-Based Decay**        | Event-driven decay model (spec 136) replaces fixed per-turn decay with event triggers | Context-sensitive memory management  |
    97	| **Session-Attention Boost**  | `SPECKIT_SESSION_BOOST` boosts scores for memories active in the current session       | Recency-aware retrieval              |
    98	| **Pressure-Aware Mode**      | `SPECKIT_PRESSURE_POLICY` enables token pressure monitoring for context window management | Prevents context overflow          |
    99	
   100	### Requirements
   101	
   102	| Requirement    | Minimum | Recommended |
   103	| -------------- | ------- | ----------- |
   104	| Node.js        | 16+     | 20+         |
   105	| better-sqlite3 | 8.0+    | Latest      |
   106	| Memory (RAM)   | 256MB   | 1GB+        |
   107	
   108	<!-- /ANCHOR:overview -->
   109	
   110	---

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md | sed -n '972,988p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   972	---
   973	
   974	**Q: What's the difference between attention score and retrievability?**
   975	
   976	A: **Retrievability** (R) is the FSRS-calculated probability of recall (0.0 to 1.0), based on stability and elapsed time. **Attention score** is the session-specific activation level in `working_memory`, which starts at 1.0 when a memory enters the session and decays at 0.95 per cycle.
   977	
   978	---
   979	
   980	**Q: Why do constitutional memories never decay?**
   981	
   982	A: Constitutional memories are permanent rules and principles (like coding standards and architectural decisions). They should ALWAYS be available, so `decay_rate = 1.0` (100% retention = no decay). This applies to both `constitutional` and `critical` tiers.
   983	
   984	---
   985	
   986	### Technical Questions
   987	
   988	**Q: How does spreading activation work?**

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts | sed -n '548,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   548	
   549	/**
   550	 * Batch update attention scores with decay.
   551	 *
   552	 * Separates the decay floor from the delete threshold to prevent the
   553	 * decay/delete race condition:
   554	 *   - decayFloor (0.05): scores are clamped here, never decay below this
   555	 *   - deleteThreshold (0.01): only entries below this are pruned
   556	 * This gives floored memories a stable resting state instead of immediate
   557	 * deletion. Entries can only reach below deleteThreshold through explicit
   558	 * score-setting or extended inactivity cleanup.
   559	 */
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts | sed -n '238,286p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   238	function classifyState(
   239	  retrievabilityOrMemory: number | TierInput | null | undefined,
   240	  elapsedDays?: number,
   241	): TierState {
   242	  let r: number;
   243	  let days: number;
   244	
   245	  if (retrievabilityOrMemory === null || retrievabilityOrMemory === undefined) {
   246	    return 'DORMANT';
   247	  }
   248	
   249	  if (typeof retrievabilityOrMemory === 'number') {
   250	    // Direct numeric call: classifyState(0.95, 5)
   251	    r = retrievabilityOrMemory;
   252	    days = typeof elapsedDays === 'number' ? elapsedDays : 0;
   253	  } else if (typeof retrievabilityOrMemory === 'object') {
   254	    // Memory object call: classifyState(memoryObj)
   255	    const mem = retrievabilityOrMemory as Record<string, unknown>;
   256	    if (typeof mem.retrievability === 'number') {
   257	      r = mem.retrievability;
   258	    } else if (typeof mem.attentionScore === 'number') {
   259	      r = mem.attentionScore;
   260	    } else {
   261	      r = 0;
   262	    }
   263	    // Extract elapsed days from lastAccess or created_at
   264	    const timestamp = mem.lastAccess || mem.last_accessed || mem.lastReview || mem.last_review || mem.created_at;
   265	    if (typeof timestamp === 'string' || typeof timestamp === 'number') {
   266	      const lastDate = new Date(timestamp as string | number);
   267	      const now = new Date();
   268	      days = Math.max(0, (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
   269	    } else {
   270	      days = 0;
   271	    }
   272	  } else {
   273	    return 'DORMANT';
   274	  }
   275	
   276	  // ARCHIVED requires BOTH conditions: old age AND very low retrievability
   277	  // (days > 90 AND r < 0.02). Using || here would incorrectly archive
   278	  // Recent memories with low R, or old memories with high R.
   279	  if (days > TIER_CONFIG.archivedDaysThreshold && r < STATE_THRESHOLDS.DORMANT) {
   280	    return 'ARCHIVED';
   281	  }
   282	  if (r >= TIER_CONFIG.hotThreshold) return 'HOT';
   283	  if (r >= TIER_CONFIG.warmThreshold) return 'WARM';
   284	  if (r >= TIER_CONFIG.coldThreshold) return 'COLD';
   285	  return 'DORMANT';
   286	}

exec
/bin/zsh -lc "rg -n \"retention_sweep\" .opencode/skill/system-spec-kit/mcp_server | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:160:      action: 'retention_sweep',

exec
/bin/zsh -lc "rg -n \"nextReviewDate|next_review_date|getNextReviewDate|calculateOptimalInterval\" .opencode/skill/system-spec-kit/mcp_server | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:498:    if (!fsrsScheduler?.calculateOptimalInterval) return;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:499:    const interval = fsrsScheduler.calculateOptimalInterval(1.0, 0.9);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:504:    if (!fsrsScheduler?.calculateOptimalInterval) return;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:505:    const calcInterval = fsrsScheduler.calculateOptimalInterval;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:517:    if (!fsrsScheduler?.calculateOptimalInterval) return;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:518:    const calcInterval = fsrsScheduler.calculateOptimalInterval;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:535:    if (!fsrsScheduler?.calculateOptimalInterval) return;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:536:    const calcInterval = fsrsScheduler.calculateOptimalInterval;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:557:    'calculateOptimalInterval',
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:186:        nextReviewDate: new Date().toISOString(),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:70:  nextReviewDate: string;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:125:function calculateOptimalInterval(stability: number, desiredRetention: number = 0.9): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:177:function getNextReviewDate(stability: number, desiredRetention: number = 0.9): string {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:178:  const intervalDays = calculateOptimalInterval(stability, desiredRetention);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:207:  const nextReviewDate = getNextReviewDate(newStability);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:214:    nextReviewDate,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:491:  calculateOptimalInterval,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:494:  getNextReviewDate,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:291:  calculateOptimalInterval,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:316:// result = { stability, difficulty, lastReview, reviewCount, nextReviewDate, retrievability }
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:319:const interval = calculateOptimalInterval(newStability, 0.9);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:89:      expect(fsrsScheduler.calculateOptimalInterval(0, 0.9)).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:294:      const nextReviewDate = fsrsScheduler.getNextReviewDate(5);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:295:      expect(Number.isNaN(new Date(nextReviewDate).getTime())).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:111:   B. FSRS SCHEDULER — getNextReviewDate
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:114:describe('B. getNextReviewDate', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:116:    const result = fsrs.getNextReviewDate(1.0);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:122:    const result = fsrs.getNextReviewDate(1.0);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:128:    const lowStab = new Date(fsrs.getNextReviewDate(1.0)).getTime();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:129:    const highStab = new Date(fsrs.getNextReviewDate(50.0)).getTime();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:134:    const r90 = new Date(fsrs.getNextReviewDate(10.0, 0.9)).getTime();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:135:    const r50 = new Date(fsrs.getNextReviewDate(10.0, 0.5)).getTime();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:140:    const result = fsrs.getNextReviewDate(0.1);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:207:    expect(result).toHaveProperty('nextReviewDate');
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:249:  it('D-08: nextReviewDate is valid future date', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:251:    const nextDate = new Date(result.nextReviewDate);

codex
I’m on the synthesis step now. One useful nuance surfaced: this iteration’s strongest recommendation is not “add more decay,” it’s “separate permanence, reversible forgetting, and hard expiry into distinct lanes,” because that is exactly where Mnemosyne is simplest and where Public is already strongest.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '540,550p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   540	### keywords
   541	
   542	- follow_on_tool_use, resolveSessionTrackingId, logFollowOnToolUse, memory_stats schema, session_bootstrap, feedback_events sqlite3
   543	
   544	## Reusable knowledge
   545	
   546	- `follow_on_tool_use` depends on a session id that matches the in-memory search session cache; if a non-search tool call lacks/does not inherit that session id, the follow-on event will not emit [Task 2]
   547	- `memory_stats` currently has no `sessionId` input in tool schema, so calling it after `memory_search` cannot claim the same session by default [Task 2]
   548	- verification pattern that worked: confirm fresh `context-server.js` processes, run `session_bootstrap`, execute controlled `memory_search` sequence with fixed session id + trace flags, then query `feedback_events` globally and per-session in sqlite [Task 2]
   549	- build/test/doc passes can still be misleading if live workers are stale; restart/runtime pickup must be treated as a separate verification gate [Task 1]
   550	

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '782,788p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   782	## Reusable knowledge
   783	
   784	- canonical validation gates for packet readiness here were `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --recursive --strict` plus `TMPDIR=... npm run check:full` and `npm run build` evidence capture [Task 1][Task 2]
   785	- for strict validator compliance, checklist lines need explicit `[EVIDENCE: ...]` and level-template headers/section numbers must remain exact (`## 1. METADATA`, `## 2. PROBLEM & PURPOSE`, etc.) [Task 3]
   786	- `session_bootstrap()` is the primary recovery call for non-hook flows; docs should mention fallback `memory_context({mode:"resume",profile:"resume"})` only after bootstrap guidance [Task 4]
   787	- hook path truth is `mcp_server/hooks/claude/*.ts` and compiled `mcp_server/dist/hooks/claude/*.js`; avoid stale `scripts/hooks/claude/` references [Task 4]
   788	- changelog truth-sync for 023 needed root + per-phase consistency: add missing phase 013 entry and avoid overstating rerun verification for 010/011/012 while strict validation remains green [Task 5]

codex
# Iteration 023: MEMORY DECAY & RETENTION

## Focus
MEMORY DECAY & RETENTION: How does this system handle memory aging, relevance decay, forgetting? What temporal strategies should we adopt for long-lived memory systems?

## Findings
### Finding 1: Mnemosyne has no visible aging model; it relies on manual hygiene and `core` pinning
- **Source**: [external/src/index.ts:140](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L140), [external/src/index.ts:195](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L195), [external/src/index.ts:216](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L216), [external/README.md:57](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L57), [external/README.md:82](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L82); evidence type: both
- **What it does**: In the checked-out plugin, temporal handling is limited to manual `memory_delete`, manual use of `core=true`, and compaction-time reminders to clean up contradicted memories. I found no wrapper-visible timestamps, access counters, review schedule, archive state, or retention metadata.
- **Why it matters**: Mnemosyne’s temporal policy is intentionally lightweight, but for a long-lived memory system that means freshness is mostly a human discipline problem. We should not treat that simplicity as a complete retention strategy.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Public already has three separate time axes; we should keep that separation explicit
- **Source**: [attention-decay.ts:5](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts#L5), [fsrs-scheduler.ts:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L18), [working-memory.ts:5](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts#L5), [stage2-fusion.ts:998](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L998)
- **What it does**: Spec Kit Memory already separates long-term FSRS retrievability, session-scoped attention decay, and search-time recency fusion. Those are distinct clocks with distinct purposes, not one blended “memory age” number.
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
- **What it does**: Public’s FSRS layer already computes optimal intervals and next review dates around a `0.9` desired retention target, and reinforcement updates stability/review count. But that review horizon is not surfaced as a first-class operator control or reporting field in the retrieval UX.
- **Why it matters**: Long-lived memory systems need more than decay math; they need an understandable retention policy. Exposing “why this memory is still hot” or “when this should be revisited” would make the current system much easier to govern.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

## Assessment
- New information ratio: 0.36

## Recommended Next Focus
Verify whether governed `delete_after` sweeps are fully implemented and surfaced in runtime health, then design one bounded follow-on that exposes temporal status as policy, not just math: `no-decay` classes, reversible archive state, explicit expiry state, and optional next-review visibility. That gives Public a coherent long-lived retention model without importing Mnemosyne’s manual-only forgetting pattern.


hook: Stop
hook: Stop Completed
tokens used
203,663
# Iteration 023: MEMORY DECAY & RETENTION

## Focus
MEMORY DECAY & RETENTION: How does this system handle memory aging, relevance decay, forgetting? What temporal strategies should we adopt for long-lived memory systems?

## Findings
### Finding 1: Mnemosyne has no visible aging model; it relies on manual hygiene and `core` pinning
- **Source**: [external/src/index.ts:140](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L140), [external/src/index.ts:195](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L195), [external/src/index.ts:216](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L216), [external/README.md:57](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L57), [external/README.md:82](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L82); evidence type: both
- **What it does**: In the checked-out plugin, temporal handling is limited to manual `memory_delete`, manual use of `core=true`, and compaction-time reminders to clean up contradicted memories. I found no wrapper-visible timestamps, access counters, review schedule, archive state, or retention metadata.
- **Why it matters**: Mnemosyne’s temporal policy is intentionally lightweight, but for a long-lived memory system that means freshness is mostly a human discipline problem. We should not treat that simplicity as a complete retention strategy.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Public already has three separate time axes; we should keep that separation explicit
- **Source**: [attention-decay.ts:5](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts#L5), [fsrs-scheduler.ts:18](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L18), [working-memory.ts:5](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts#L5), [stage2-fusion.ts:998](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L998)
- **What it does**: Spec Kit Memory already separates long-term FSRS retrievability, session-scoped attention decay, and search-time recency fusion. Those are distinct clocks with distinct purposes, not one blended “memory age” number.
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
- **What it does**: Public’s FSRS layer already computes optimal intervals and next review dates around a `0.9` desired retention target, and reinforcement updates stability/review count. But that review horizon is not surfaced as a first-class operator control or reporting field in the retrieval UX.
- **Why it matters**: Long-lived memory systems need more than decay math; they need an understandable retention policy. Exposing “why this memory is still hot” or “when this should be revisited” would make the current system much easier to govern.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

## Assessment
- New information ratio: 0.36

## Recommended Next Focus
Verify whether governed `delete_after` sweeps are fully implemented and surfaced in runtime health, then design one bounded follow-on that exposes temporal status as policy, not just math: `no-decay` classes, reversible archive state, explicit expiry state, and optional next-review visibility. That gives Public a coherent long-lived retention model without importing Mnemosyne’s manual-only forgetting pattern.
