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
--
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
- **What it does**: Public’s FSRS layer already computes optimal intervals and next review dates around a `0.9` desired retention target, and reinforcement updates stability/review count. But that review horizon is not surfaced as a first-class operator control or reporting field in the retrieval UX.
- **Why it matters**: Long-lived memory systems need more than decay math; they need an understandable retention policy. Exposing “why this memory is still hot” or “when this should be revisited” would make the current system much easier to govern.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

## Assessment
- New information ratio: 0.36

## Recommended Next Focus
Verify whether governed `delete_after` sweeps are fully implemented and surfaced in runtime health, then design one bounded follow-on that exposes temporal status as policy, not just math: `no-decay` classes, reversible archive state, explicit expiry state, and optional next-review visibility. That gives Public a coherent long-lived retention model without importing Mnemosyne’s manual-only forgetting pattern.

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
# Iteration 024: COMPACTION & CONTEXT SURVIVAL

## Focus
COMPACTION & CONTEXT SURVIVAL: How does this system handle context window limits, compaction events, and startup context reconstruction? Lessons for our compaction survival.

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
I’m treating this as a read-only research iteration focused on Mnemosyne’s compaction survival and how it compares with our startup, resume, and compaction paths. I’ll do a quick memory pass first, then trace the external wrapper in the required order and compare it against the current Public files.
  → Run a quick memory pass for prior Mnemosyne and compaction-related context
  • Read external Mnemosyne wrapper in required order and extract compaction/startup evidence
  • Read current Public startup, resume, compaction, and memory retrieval surfaces for comparison
  • Synthesize iteration 24 findings with recommendations and next focus
exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/.codex/memories/MEMORY.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
# Task Group: 026 Batch Review Findings Remediation (002/003/008/010/013/014)
scope: remediation pass that closes active P1 findings documented in parent `review/review-report.md` without rerunning deep-review iterations
applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for follow-up “fix findings” runs in 026 when the request is to patch documented review findings and verify closure across targeted packets

## Task 1: Fix all active findings from synthesized 026 review report across six phases with targeted verification, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-09T15-19-09-O7Hp-026_fix_batch_review_findings.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T17-19-09-019d72d3-6266-79c3-a21a-c0016dec6fcf.jsonl, updated_at=2026-04-09T17:16:36+00:00, thread_id=019d72d3-6266-79c3-a21a-c0016dec6fcf, task-local focus=close P1 findings in phases 002/003/008/010/013/014 and rerun strict/typecheck/tests)

### keywords

- fix findings, review/review-report.md, 002-implement-cache-warning-hooks, 003-memory-quality-issues, 008-graph-first-routing-nudge, 010-sqlite-fts-helper, 013-analytics-token-contracts, 005-code-graph-upgrades, lexicalPath unavailable, Structural Routing Hint, validate.sh --strict

## User preferences

- when the user requested “Fix all findings and recommendations documented in … review-report.md from all review iterations,” treat it as a remediation pass over the documented findings only; do not start new review iterations unless explicitly asked [Task 1]

## Reusable knowledge

- packet 002 status/traceability must reflect real downstream readiness; once the 010 validator exists, document 002 as “Implemented — predecessor verified” instead of blocked to avoid traceability P1 findings [Task 1]
- packet 003 review references must point to real local review artifacts (for example `../review/003-memory-quality-issues/review-report.md`) so strict validator integrity checks pass [Task 1]
- packet 008 structural-routing hint scope is bootstrap/request-shaped only; keep startup/resume hook generic and ensure docs + tests assert no “Structural Routing Hint” text is emitted when task-shaped context is absent [Task 1]
- packet 010 degraded lexical lane vocabulary is `lexicalPath: 'unavailable'`; align runtime output, tests, README, and checklist language to this exact label [Task 1]
- packet 013 benchmark evidence should cite `38/40` combined benchmark in checklist/report surfaces; stale `pass 28` wording is a known traceability finding trigger [Task 1]
- packet 014 enrichment claims must stay graph-local; remove wording that implies resume/bootstrap carriage and keep ownership with packet 011 payload validators [Task 1]
- verification pattern that closed the set: `npm run typecheck`, focused Vitest for `graph-first-routing-nudge` + `sqlite-fts` + `handler-memory-search`, then strict validate over phases 002/003/008/010/013/014 [Task 1]

## Failures and how to do differently

- symptom: strict validation fails on packet 003 with missing parent review references; cause: spec/docs pointed to non-existent review paths; fix: use explicit relative links to local review artifacts under `../review/003-memory-quality-issues/` before rerunning strict validation [Task 1]

# Task Group: 026 Batch-Phase Deep Review State Tracking, Continuations, and Iteration Extensions
scope: per-phase deep-review packet execution under `026-graph-and-context-optimization/review/` with strict write-scope boundaries, shared-state synchronization, and continuation/extension handling
applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for 026 batch-review runs in this checkout when asked to run, continue, or extend phase review iterations without touching runtime implementation files

## Task 1: Execute Batch C deep reviews for phases 011-014 with scoped writes and state updates, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-09T14-19-36-FcZf-batch_c_deep_review_026.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T16-19-36-019d729c-df62-7880-ae6e-834e8e625ecd.jsonl, updated_at=2026-04-09T15:02:30+00:00, thread_id=019d729c-df62-7880-ae6e-834e8e625ecd, task-local focus=011-014 packet generation + aggregate state bump to 8/13)

### keywords

- batch-phase-review-state.json, 026-graph-and-context-optimization/review/<phase-slug>, deep-review-config.json, deep-review-state.jsonl, deep-review-findings-registry.json, deep-review-dashboard.md, iteration-NNN.md, review-report.md, phasesCompleted 8/13

## Task 2: Handle continuation command by validating completion state and consolidated report presence, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-09T14-19-36-FcZf-batch_c_deep_review_026.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T16-19-36-019d729c-df62-7880-ae6e-834e8e625ecd.jsonl, updated_at=2026-04-09T15:02:30+00:00, thread_id=019d729c-df62-7880-ae6e-834e8e625ecd, task-local focus=resume check at 13/13 + consolidated report verification)

### keywords

- continue, phasesCompleted == totalPhases, status complete, batch-phase-review-consolidated.md, overall verdict FAIL, aggregate findings 0 P0 7 P1 0 P2

## Task 3: Extend Batch A (002-005) from 5 to 10 iterations and re-sync per-phase + batch artifacts, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-09T14-19-21-dEbR-batch_a_review_extensions_026_graph_context.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T16-19-21-019d729c-a473-7082-989e-7b5a71cf2227.jsonl, updated_at=2026-04-09T15:02:18+00:00, thread_id=019d729c-a473-7082-989e-7b5a71cf2227, task-local focus=iteration-006..010 extension for 002-005 + consolidated totals update)

### keywords

- extra stability passes, iteration-006..010, deep-review-state.jsonl append, deep-review-dashboard.md 10/10, deep-review-strategy.md max-iteration update, batch-phase-review-consolidated.md total iterations 83, no new findings

## Task 4: Extend Batch B (006-010) to 10 iterations and re-sync program totals to 108, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-09T14-19-26-Ga5w-batch_b_review_10_iteration_extension.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T16-19-26-019d729c-b7c1-72c1-90c2-e72c0eb0d52e.jsonl, updated_at=2026-04-09T15:12:27+00:00, thread_id=019d729c-b7c1-72c1-90c2-e72c0eb0d52e, task-local focus=006-010 iteration-006..010 extension + convergence/aggregate sync)

### keywords

- batch-b, 006-010, deep-review-config.json maxIterations 10, deep-review-state.jsonl, iteration-006..010, deep-review-findings-registry.json convergenceScore 1.0, batch-phase-review-state.json, batch-phase-review-consolidated.md, total iterations 108

## User preferences

- when running 026 batch deep review, the user-required scope was explicit: writes limited to `026/review/<phase-slug>/*`, the shared state file, and optionally the consolidated report; keep review targets read-only and do not edit parent/runtime artifacts [Task 1]
- when instructions include “write consolidated report only if all 13 phases are complete,” gate report creation on `phasesCompleted == totalPhases` and otherwise emit only the batch result summary [Task 1]
- when the user replied “continue,” expected behavior was resume-aware verification (re-read state and artifacts) instead of restarting all phase reviews from scratch [Task 2]
- when operator requested “extra stability passes,” extend each targeted phase from 5 to 10 iterations before closure and sync batch-level state/report immediately [Task 3][Task 4]

## Reusable knowledge

- authoritative tracker path is `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/batch-phase-review-state.json`; every phase completion should update `phasesCompleted`, `phasesRemaining`, `phaseResults`, `aggregateFindings`, and `lastUpdated` in one pass [Task 1][Task 3][Task 4]
- required per-phase packet set under `review/<phase-slug>/`: `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-strategy.md`, `deep-review-findings-registry.json`, `deep-review-dashboard.md`, `iterations/iteration-NNN.md`, `review-report.md` [Task 1][Task 3][Task 4]
- continuation stop rule: if state already shows `13/13 complete` and `batch-phase-review-consolidated.md` exists, do not rerun phase loops; verify report/state alignment and close [Task 2]
- extension workflow for confidence runs: add `iteration-006` through `iteration-010`, append JSONL rows, raise dashboard counters/convergence, refresh strategy + review report, then mirror new totals in batch state and consolidated report [Task 3][Task 4]
- if `batch-phase-review-state.json` is missing, initialize the full 13-phase tracker first so later batch extension runs can update `iterationsCompleted` and aggregate counts deterministically [Task 4]
- after extension passes, run a quick Python integrity check to confirm each phase packet has 10 iteration files and `deep-review-findings-registry.json` reports `convergenceScore: 1.0` before finalizing shared-state/consolidated totals [Task 4]

## Failures and how to do differently

- symptom: stale or conflicting batch totals (for example per-phase files at 10 iterations but global files still at 5); cause: extending iterations without re-syncing shared tracker/consolidated report; fix: treat `batch-phase-review-state.json` and `batch-phase-review-consolidated.md` as mandatory final sync targets after every extension pass [Task 3]
- symptom: batch extension cannot be applied cleanly because tracker metadata is absent; cause: missing `batch-phase-review-state.json`; fix: seed the tracker with the canonical 13-phase structure before per-phase review updates [Task 4]

# Task Group: 026 Packet Docs/Memory Alignment Audit and Commit-Split Discipline
scope: strict Level 1-3+ doc and memory alignment under `026-graph-and-context-optimization` with metadata-only memory fixes and packet-group commit splits
applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for 026 audit/alignment runs in this checkout when user asks for strict validation across packet folders without runtime code edits

## Task 1: Align Level-3 parent + research packet docs/memory with strict-clean validation, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-09T11-34-07-I9Mm-026_docs_memory_alignment.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T13-34-07-019d7205-5e9a-70a0-9142-bf14cf99cc2a.jsonl, updated_at=2026-04-09T12:35:34+00:00, thread_id=019d7205-5e9a-70a0-9142-bf14cf99cc2a, task-local focus=research group + 32 memory metadata anchor normalization)

### keywords

- 026-graph-and-context-optimization, validate.sh --strict, metadata anchor closure, canonical-docs postflight evidence blocks, 32 memory files, docs(026-research), minimum edits required

## Task 2: Align `003-memory-quality-issues` docs/memory with standalone packet commit, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-09T11-34-07-I9Mm-026_docs_memory_alignment.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T13-34-07-019d7205-5e9a-70a0-9142-bf14cf99cc2a.jsonl, updated_at=2026-04-09T12:35:34+00:00, thread_id=019d7205-5e9a-70a0-9142-bf14cf99cc2a, task-local focus=docs(026-memory-quality) packet-local summary)

### keywords

- 003-memory-quality-issues, docs(026-memory-quality), packet commit split, validate.sh --strict, 9 phases 0 errors 0 warnings, metadata trailer restoration

## Task 3: Align runtime packet docs/memory (002 and 004-014) while keeping runtime code untouched, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-09T11-34-07-I9Mm-026_docs_memory_alignment.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T13-34-07-019d7205-5e9a-70a0-9142-bf14cf99cc2a.jsonl, updated_at=2026-04-09T12:35:34+00:00, thread_id=019d7205-5e9a-70a0-9142-bf14cf99cc2a, task-local focus=docs(026-runtime) and targeted validation on 002/014)

### keywords

- docs(026-runtime), no runtime code edits, staged runtime packet docs first, validate.sh 002-implement-cache-warning-hooks, validate.sh 005-code-graph-upgrades, description.json memory/metadata.json untouched

## User preferences

- when the user asked to “Audit and align every Level 1-3+ spec document and every memory artifact under ...026...,” they expected strict `validate.sh --strict` runs on each target folder, minimum memory-only edits, and logical split commits without extra routing questions [Task 1][Task 2][Task 3]
- when running runtime packet alignment, the user explicitly constrained scope to docs/memory trees and “NO runtime code edits”; future runs should leave runtime source and JSON ownership files untouched even if nearby files are dirty [Task 3]
- after research-group work, the user expectation was a standalone packet commit per group with explicit before/after validator counts and memory-fix lists instead of bundled mega-commits [Task 1][Task 2][Task 3]

## Reusable knowledge

- high-yield preflight: run a metadata-anchor audioscope/normalization script before manual edits; in this rollout it caught all 32 files missing metadata closure faster than iterative validator reruns [Task 1]
- memory fixes in this workflow stay bounded to frontmatter + metadata anchor/canonical block closure; do not rewrite narrative bodies, ids, or timestamps during audit cleanup [Task 1]
- commit body format that repeatedly worked: folders touched, before/after ERROR+WARNING counts from strict validator runs, and per-memory reason notes for restored anchors/metadata [Task 1][Task 2][Task 3]
- for runtime-group closeout, stage packet docs first, add newly surfaced memory files manually, then run targeted validators (for example 002 + 014) in addition to root validation so evidence is packet-local and auditable [Task 3]

## Failures and how to do differently

- symptom: repeated validator churn while memory files still fail metadata closure; cause: relying on phase-level validator output alone instead of direct anchor sweep; fix: run anchor audit script first, normalize all misses in one pass, then rerun strict validator [Task 1]

# Task Group: 026/003 Packet 009 Post-Save Render Fixes and Wild-Save Review Closure
scope: render-layer memory pipeline fixes in `003-memory-quality-issues/009-post-save-render-fixes` with acceptance anchored to a real 014 wild save and zero post-save-review issues
applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse when patching memory render/reviewer behavior in this checkout and proving fixes through an end-to-end generate-context run

## Task 1: Ship 009 render-layer fixes (A-I lanes), tests, and final wild save with clean post-save review, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-09T10-35-53-UGDf-009_post_save_render_fixes_memory_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T12-35-53-019d71d0-0ec5-7c80-a08b-6d336ee5c639.jsonl, updated_at=2026-04-09T12:01:25+00:00, thread_id=019d71d0-0ec5-7c80-a08b-6d336ee5c639)

### keywords

- 009-post-save-render-fixes, PSR-2, trigger phrase omission, input-normalizer.ts, collect-session-data.ts, post-save-review.ts extractSection, memory-metadata.ts session_id metadata block, generate-context.js wild save, OVERVIEW 655 chars

## User preferences

- when a medium reviewer note remained, the user asked: “fix the remaining trigger-phrase omission before commit if you want the wild save to finish with a completely clean post-save review” -> do not close this workflow with unresolved `PSR-2` warnings [Task 1]
- for this packet family, user acceptance includes a real post-save round-trip using the target packet context (not only unit tests), and the final report should show zero post-save-review issues [Task 1]

## Reusable knowledge

- keep JSON payload overrides wired through normalizer/collector: `phase`, `status/sessionStatus`, and completion-percent aliases must map to `projectPhase`, `sessionStatus`, and `completionPercent` to prevent stale-default warnings [Task 1]
- preserve authored `SUMMARY` text as full OVERVIEW when length is `<=800` chars via `renderOverviewSummary(..., truncateOnWordBoundary(...))`; only truncate longer payloads [Task 1]
- reviewer OVERVIEW extraction is robust when heading/line-scanned between section boundaries, not regex-sliced; this prevents false D1 truncation flags on valid long summaries [Task 1]
- trigger phrase filtering should block short folder-like numeric shorthands while preserving longer numeric authored phrases like `014 code graph upgrades runtime` [Task 1]
- `memory-metadata.ts` should read `session_id`/`context_type` from both frontmatter and `## MEMORY METADATA` YAML block so derived causal links (`derived_from`, `supersedes`) still populate on older saves [Task 1]
- post-save quality warning language now keys on `input_completeness_score`; keep diagnostics terminology consistent with this field [Task 1]

## Failures and how to do differently

- symptom: D1 false positive for truncated OVERVIEW despite full saved paragraph; cause: regex extraction capped review window; fix: switch reviewer extraction to heading-based line scanning [Task 1]
- symptom: valid manual trigger phrase with numeric prefix disappears and causes `PSR-2`; cause: broad `^\\d{1,3}\\s` rejection rule; fix: apply numeric-prefix rejection only when phrase remains short (`<=3` words) [Task 1]
- symptom: causal auto-link misses prior session; cause: parser read `session_id` from frontmatter only; fix: parse metadata YAML block too [Task 1]

# Task Group: 026/014 Code Graph Upgrades Runtime Closeout and Regression Floor
scope: adopt-now runtime lane + docs closeout for `005-code-graph-upgrades` with detector provenance, blast-radius constraints, and explicit verification gates
applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for follow-on edits to 014 graph/query/session payload logic in this checkout when regression-floor and strict doc validation must stay green

## Task 1: Implement 014 runtime/docs plus missing regression-floor test and strict verification sweep, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-09T07-35-51-j53b-implement_014_code_graph_upgrades.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/09/rollout-2026-04-09T09-35-51-019d712b-3824-7403-9e7e-a2a68ef35e61.jsonl, updated_at=2026-04-09T09:39:44+00:00, thread_id=019d712b-3824-7403-9e7e-a2a68ef35e61)

### keywords

- 005-code-graph-upgrades, shared-payload.ts DetectorProvenance, handlers/code-graph/query.ts unionMode multi maxDepth hotFileBreadcrumb, session_resume session_bootstrap additive edge enrichment, graph-upgrades-regression-floor.vitest.ts.test.ts, validate.sh --strict

## User preferences

- when strict validation failed due to `implementation-summary.md` linking `014/spec.md`, the expectation was to fix path validity first and rerun strict checks; future docs should never reference non-existent relative markdown paths [Task 1]
- when verification listed four scripts tests but only three executed, the expected behavior was to add the missing file and rerun; coverage claims must be backed by actual discovered files (`rg --files tests`) [Task 1]
- packet closeout reporting should enumerate the same gate sequence explicitly (typecheck, server Vitest batch, scripts Vitest batch, strict validator) and keep out-of-scope packets untouched [Task 1]

## Reusable knowledge

- shipped 014 lane includes detector provenance vocabulary carriers, blast-radius traversal with explicit depth cap and union semantics, and low-authority hot-file breadcrumb evidence while preserving packet 011 trust-axis payloads [Task 1]
- regression guard for this lane is the added file `scripts/tests/graph-upgrades-regression-floor.vitest.ts.test.ts`; rerun it whenever detector/query surfaces change [Task 1]
- doc closeout requires synchronized updates across `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` with exact evidence pointers and explicit deferred-lane notes per ADR-003 [Task 1]

## Failures and how to do differently

- symptom: strict validator fails with missing file reference; cause: implementation summary linked `014/spec.md` instead of in-folder `spec.md`; fix: repair link before rerunning validator [Task 1]
- symptom: scripts suite undercounts expected files; cause: missing regression-floor test file; fix: verify listed test files exist first, then rerun suite [Task 1]

# Task Group: sk-code-opencode HEAD~10 TypeScript Scope Verification (Style-Only)
scope: bounded style-verifier sweep over the exact HEAD~10 TypeScript diff under `.opencode/skill/system-spec-kit/` with hard stop on failing required verification gates
applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for user-requested sk-code-opencode conformance sweeps where scope and stop rules are explicitly fixed by git diff output

## Task 1: Verify/fix sk-code-opencode drift on 87 in-scope TS files, outcome partial (halted after required suite failures)

### rollout_summary_files

exec
/bin/zsh -lc 'rg -n "mnemosyne|compaction|compact-code-graph|session_bootstrap|session_resume|memory discipline|startup" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
23:- packet 008 structural-routing hint scope is bootstrap/request-shaped only; keep startup/resume hook generic and ensure docs + tests assert no “Structural Routing Hint” text is emitted when task-shaped context is absent [Task 1]
195:- 005-code-graph-upgrades, shared-payload.ts DetectorProvenance, handlers/code-graph/query.ts unionMode multi maxDepth hotFileBreadcrumb, session_resume session_bootstrap additive edge enrichment, graph-upgrades-regression-floor.vitest.ts.test.ts, validate.sh --strict
345:## Task 7: Close `024-compact-code-graph/031-normalized-analytics-reader` with strict completion and memory-index cleanup, outcome success
363:- 026-graph-and-context-optimization, 024-compact-code-graph, 026/005-009, 024/032-034, AI Execution Protocol, SECTION_COUNTS, PHASE_LINKS, SPEC_DOC_INTEGRITY, validate.sh --strict, --no-recursive, implement the plan
542:- follow_on_tool_use, resolveSessionTrackingId, logFollowOnToolUse, memory_stats schema, session_bootstrap, feedback_events sqlite3
548:- verification pattern that worked: confirm fresh `context-server.js` processes, run `session_bootstrap`, execute controlled `memory_search` sequence with fixed session id + trace flags, then query `feedback_events` globally and per-session in sqlite [Task 2]
599:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/02--system-spec-kit/024-compact-code-graph/029-review-remediation; reuse_rule=reuse for this packet-family remediation flow in this checkout, keeping fixes packet-local and revalidated
693:## Task 1: Deep-review packet `024-compact-code-graph` with full parity gates, outcome success
701:- /spec_kit/deep-review, 024-compact-code-graph, validate.sh --recursive, check:full, QUALITY_GATE_PASS, trigger_phrases, review-report PASS
721:- strict-validation, 023/011-indexing-and-adaptive-fusion, 024-compact-code-graph, EVIDENCE:, TEMPLATE_HEADERS, PHASE DOCUMENTATION MAP
731:- session_bootstrap, memory_context({mode:"resume",profile:"resume"}), mcp_server/hooks/claude, scripts/hooks/claude, workflow-session-id.vitest.ts, code-graph-query-handler.vitest.ts
743:## Task 6: Draft packet-local changelog set for `024-compact-code-graph`, outcome success
761:- CocoIndex + Compact Code Graph, README.md, 024-compact-code-graph, 006-documentation-alignment, mcp__cocoindex_code__search, code_graph_query, prettier --check
775:- when the user said “Re-use /.../024-compact-code-graph/006-documentation-alignment,” continue under the specified existing spec folder instead of opening a new packet [Task 4]
778:- when user asked for README work, they specified “proper dedicated section ... reference 024-compact-code-graph ... re-use 006-documentation-alignment” -> preserve that wording/terminology and include those exact packet references [Task 7]
786:- `session_bootstrap()` is the primary recovery call for non-hook flows; docs should mention fallback `memory_context({mode:"resume",profile:"resume"})` only after bootstrap guidance [Task 4]
802:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for 024 compact-code-graph runtime/session troubleshooting in this checkout, but keep phase targeting explicit
824:## Task 3: Verify startup/bootstrap quote surfaces and bounded inline reindex behavior in read-only mode, outcome success
832:- read-only verification, session_bootstrap, session_resume minimal, code_graph_query, startup snapshot note, ensureCodeGraphReady, SELECTIVE_REINDEX_THRESHOLD=50
836:- when the user selected reuse option “C” for `024-compact-code-graph/002-session-start-hook`, continue within that existing spec scope for follow-up fixes [Task 2]
838:- when the user said “Do not make code changes ... Be evidence-based and quote exact startup or bootstrap text and exact readiness output,” keep verification read-only and quote observed startup/readiness payload text verbatim [Task 3]
846:- `session_bootstrap`/`session_resume({ minimal: true })` should still expose freshness-aware graph state and the startup snapshot note; this is a contract-level verification target before deeper debugging [Task 3]
1028:## Task 3: Fix startup DB path/provider drift and auto-repair temp-root cleanup for `spec_kit_memory`
1039:## Task 4: Keep embeddings provider `auto` compatible while fixing startup dimension mismatches
1067:- codex features enable memories, codex features enable code_mode, ~/.codex/config.toml, session_meta.dynamic_tools, mcp_startup, handshake timeout
1098:- Desktop `session_meta.dynamic_tools` plus absence of `mcp_startup` events is a stronger surfacing signal than standalone `node context-server.js` timeout probes [Task 6]
1100:- When startup background scan emits `contamination_audit` JSON on stdout, Codex MCP JSON-RPC can fail to handshake; redirect/silence that stream or delay MCP client init until scan completion [Task 7]
1965:- cancelIngestJob retry, ALLOWED_BASE_PATHS startup recovery, MutationHookResult.errors, hooks-ux-feedback.vitest.ts, verify_alignment_drift.py
1981:- TMPDIR=.tmp/vitest-tmp, EX-035 startup scenario, F18-F21 implicit coverage, 19 pre-existing lint errors, index.lock, commit and push
1996:- lifecycle hardening patterns that held: collision-safe checkpoint restore skips, cancel-ingest retry/terminal handling, startup scan roots from `ALLOWED_BASE_PATHS` + `MEMORY_BASE_PATH`, and explicit `errors: []` in mutation hook payloads [Task 3]

codex
I found two useful prior notes: one about `session_bootstrap()` being the primary non-hook recovery surface, and another about a read-only verification pass that quoted exact startup and readiness text. I’m pulling those specific entries now so I can stay consistent while I trace the Mnemosyne compaction flow.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '780,850p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   780	- when updating changelog claims, keep wording pinned to implemented behavior evidence (bounded inline `selective_reindex` vs explicit operator `code_graph_scan`) [Task 8]
   781	
   782	## Reusable knowledge
   783	
   784	- canonical validation gates for packet readiness here were `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --recursive --strict` plus `TMPDIR=... npm run check:full` and `npm run build` evidence capture [Task 1][Task 2]
   785	- for strict validator compliance, checklist lines need explicit `[EVIDENCE: ...]` and level-template headers/section numbers must remain exact (`## 1. METADATA`, `## 2. PROBLEM & PURPOSE`, etc.) [Task 3]
   786	- `session_bootstrap()` is the primary recovery call for non-hook flows; docs should mention fallback `memory_context({mode:"resume",profile:"resume"})` only after bootstrap guidance [Task 4]
   787	- hook path truth is `mcp_server/hooks/claude/*.ts` and compiled `mcp_server/dist/hooks/claude/*.js`; avoid stale `scripts/hooks/claude/` references [Task 4]
   788	- changelog truth-sync for 023 needed root + per-phase consistency: add missing phase 013 entry and avoid overstating rerun verification for 010/011/012 while strict validation remains green [Task 5]
   789	- for packet changelog generation at this scale, first mirror prior packet changelog structure, then gather evidence from implementation summaries/checklists/review docs before drafting per-phase files [Task 6]
   790	- README formatting in this repo is partially hand-formatted; if `npx prettier --check README.md` fails but `git diff --check` is clean, keep scoped edits and avoid whole-file reflow [Task 7]
   791	- constitutional README parity check should enumerate both `gate-enforcement.md` and `gate-tool-routing.md` as required files so operators see the full always-surfaced ruleset [Task 8]
   792	
   793	## Failures and how to do differently
   794	
   795	- symptom: tests not found when running Vitest with file filters from repo root; cause: package-scoped configs were bypassed; fix: run from the owning package roots (`scripts`, `mcp_server`) [Task 4]
   796	- symptom: strict validation keeps failing on packet docs despite correct intent; cause: missing acceptance scenarios, protocol sections, or template anchors; fix: align to SPECKIT template headings first, then rerun validator [Task 2][Task 3]
   797	- symptom: bulk patching changelog files accidentally removes or rewrites wrong sections; cause: oversized patch scope; fix: restore from HEAD and apply smaller file-local patches [Task 5]
   798	- symptom: memory save quality gate rejects closeout payload; cause: weak primary evidence + noisy trigger phrases; fix: include explicit files/observations/toolCalls/decisions and clean trigger phrases before rerunning quality validation [Task 1]
   799	
   800	# Task Group: Compact Code Graph Session-Start Injection and Codex Priming Diagnostics
   801	scope: session-start injection debugging, codex runtime session-id fallback, and test-environment fixes for git-context-sensitive suites
   802	applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse for 024 compact-code-graph runtime/session troubleshooting in this checkout, but keep phase targeting explicit
   803	
   804	## Task 1: Debug session-start injection, create phase 026, and stabilize test environment, outcome success
   805	
   806	### rollout_summary_files
   807	
   808	- rollout_summaries/2026-04-02T09-20-39-30Ww-compact_code_graph_session_start_injection_debug.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T11-20-39-019d4d7e-a9d9-7081-bf44-8615f401e064.jsonl, updated_at=2026-04-02T10:59:48+00:00, thread_id=019d4d7e-a9d9-7081-bf44-8615f401e064)
   809	
   810	### keywords
   811	
   812	- code_graph_scan, 026-session-start-injection-debug, create.sh --phase, TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp, session-enrichment.vitest.ts, spec-affinity.vitest.ts
   813	
   814	## Task 2: Fix Codex session priming fallback so non-hook sessions prime from `CODEX_THREAD_ID`, outcome success
   815	
   816	### rollout_summary_files
   817	
   818	- rollout_summaries/2026-04-02T13-39-48-Ptmg-codex_session_priming_fix.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T15-39-48-019d4e6b-ec64-7e32-b2a6-39f0f4b21990.jsonl, updated_at=2026-04-02T14:10:48+00:00, thread_id=019d4e6b-ec64-7e32-b2a6-39f0f4b21990)
   819	
   820	### keywords
   821	
   822	- primeSessionIfNeeded, resolveSessionTrackingId, CODEX_THREAD_ID, runtime-detection.ts, CODEX_TUI_RECORD_SESSION, context-server.vitest.ts
   823	
   824	## Task 3: Verify startup/bootstrap quote surfaces and bounded inline reindex behavior in read-only mode, outcome success
   825	
   826	### rollout_summary_files
   827	
   828	- rollout_summaries/2026-04-04T11-42-27-WVjh-codex_graph_readiness_verification.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/04/rollout-2026-04-04T13-42-27-019d584d-3145-70e0-8b9b-13740fcf41cf.jsonl, updated_at=2026-04-04T11:45:20+00:00, thread_id=019d584d-3145-70e0-8b9b-13740fcf41cf)
   829	
   830	### keywords
   831	
   832	- read-only verification, session_bootstrap, session_resume minimal, code_graph_query, startup snapshot note, ensureCodeGraphReady, SELECTIVE_REINDEX_THRESHOLD=50
   833	
   834	## User preferences
   835	
   836	- when the user selected reuse option “C” for `024-compact-code-graph/002-session-start-hook`, continue within that existing spec scope for follow-up fixes [Task 2]
   837	- when git-context-sensitive tests fail, the proven steering pattern is environmental first (set `TMPDIR` outside repo) before touching runtime logic [Task 1]
   838	- when the user said “Do not make code changes ... Be evidence-based and quote exact startup or bootstrap text and exact readiness output,” keep verification read-only and quote observed startup/readiness payload text verbatim [Task 3]
   839	
   840	## Reusable knowledge
   841	
   842	- `primeSessionIfNeeded()` needs a session identifier; in Codex runtime the reliable fallback is `CODEX_THREAD_ID` when explicit `sessionId`/`session_id` are absent [Task 2]
   843	- runtime detection for Codex should recognize env markers beyond CODEX_CLI (`CODEX_THREAD_ID`, `CODEX_TUI_RECORD_SESSION`, `CODEX_TUI_SESSION_LOG_PATH`) so non-hook behavior is consistent [Task 2]
   844	- graph scan can complete with per-file UNIQUE constraint noise; use final scan stats (`totalNodes`, `totalEdges`, `lastScanAt`) plus `errors[]` triage instead of treating it as hard failure [Task 1]
   845	- tests `session-enrichment` and `spec-affinity` require temp directories outside repo to avoid accidental git parent discovery [Task 1]
   846	- `session_bootstrap`/`session_resume({ minimal: true })` should still expose freshness-aware graph state and the startup snapshot note; this is a contract-level verification target before deeper debugging [Task 3]
   847	- `code_graph_query` read paths call readiness checks with `allowInlineFullScan: false`; small stale deltas trigger bounded inline `selective_reindex`, while broader stale/empty conditions should route to explicit `code_graph_scan` [Task 3]
   848	
   849	## Failures and how to do differently
   850	

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
I’ve got the prior compaction/startup notes I need. Next I’m following the requested order exactly: external `src/index.ts`, then `package.json`, then the compaction hook and README, before I compare that evidence to our current startup, resume, and transport surfaces.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main/src/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
sed: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/opencode-mnemosyne-main/src/index.ts: No such file or directory

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 2573ms:

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
The external path differs slightly from the brief, so I’m checking the actual folder layout before I continue. I’ve also started the strict validator in parallel so we can anchor the iteration to the real phase state instead of assumptions.
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
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-023.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/research.md

codex
The validator is running as a live shell session rather than a one-shot command, so I’m polling that session directly. The external repo layout is clear now: the files are under `external/src/index.ts` and `external/package.json`, which matches the actual checkout even though the brief used a nested path.
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

codex
The wrapper confirms what I expected: the compaction hook is very small and very explicit, while the memory tooling itself is just a Bun-spawned CLI bridge with auto-init and a project/global split. I’m reading the README now alongside the latest phase artifacts so I can separate genuinely new compaction/startup lessons from earlier iterations.
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
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-023.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'tail -n 220 .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/research.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

 succeeded in 0ms:
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

---


codex
I’ve reached the comparison phase, so I’m using semantic code search to map the current Public surfaces before I zoom into the exact line ranges. After that I’ll pull the concrete startup, resume, transport, and health code that controls compaction survival today.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
codex
The semantic search call didn’t complete in this runtime, so I’m falling back to direct source reads and exact grep for the comparison step. I still have enough local evidence to keep the analysis grounded because the relevant surfaces are already known.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '720,840p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts | sed -n '90,230p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc 'rg -n "buildServerInstructions|startup snapshot|session_bootstrap|memory_health|compaction|transport|memory discipline|ready|degraded|blocked|resume" .opencode/skill/system-spec-kit/mcp_server/context-server.ts .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts .opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts .opencode/plugins/spec-kit-compact-code-graph.js .opencode/skill/mcp-coco-index/README.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/plugins/spec-kit-compact-code-graph.js:14:// the user's normal Node environment and returns the transport plan as JSON.
.opencode/plugins/spec-kit-compact-code-graph.js:68: *   transportOnly: true,
.opencode/plugins/spec-kit-compact-code-graph.js:77: *   compaction?: TransportBlock,
.opencode/plugins/spec-kit-compact-code-graph.js:85:const transportCache = new Map();
.opencode/plugins/spec-kit-compact-code-graph.js:136:    if (plan.transportOnly !== true || !Array.isArray(plan.messagesTransform)) {
.opencode/plugins/spec-kit-compact-code-graph.js:188:  const cached = transportCache.get(key);
.opencode/plugins/spec-kit-compact-code-graph.js:203:      lastRuntimeError = 'Bridge returned no OpenCode transport payload';
.opencode/plugins/spec-kit-compact-code-graph.js:205:      transportCache.delete(key);
.opencode/plugins/spec-kit-compact-code-graph.js:211:    transportCache.set(key, {
.opencode/plugins/spec-kit-compact-code-graph.js:220:    transportCache.delete(key);
.opencode/plugins/spec-kit-compact-code-graph.js:261:    transportCache.delete(cacheKeyForSession(sessionID, specFolder));
.opencode/plugins/spec-kit-compact-code-graph.js:265:  for (const key of [...transportCache.keys()]) {
.opencode/plugins/spec-kit-compact-code-graph.js:267:      transportCache.delete(key);
.opencode/plugins/spec-kit-compact-code-graph.js:277: * Create the Spec Kit OpenCode plugin and its transport-backed hook handlers.
.opencode/plugins/spec-kit-compact-code-graph.js:300:          const entries = [...transportCache.entries()]
.opencode/plugins/spec-kit-compact-code-graph.js:308:            `resume_mode=${RESUME_MODE}`,
.opencode/plugins/spec-kit-compact-code-graph.js:311:            `runtime_ready=${runtimeReady}`,
.opencode/plugins/spec-kit-compact-code-graph.js:316:            `cache_entries=${transportCache.size}`,
.opencode/plugins/spec-kit-compact-code-graph.js:406:      const block = plan?.compaction;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:50:/** Arguments for the memory_health handler. */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:4:// Phase 020: Composite MCP tool that merges memory resume context,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:12:import { getGraphFreshness, type GraphFreshness } from '../lib/code-graph/ensure-ready.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:29:} from '../lib/context/opencode-transport.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:112:  sessionQuality?: 'healthy' | 'degraded' | 'critical' | 'unknown';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:409:  // ── Sub-call 1: Memory context resume (skip in minimal mode) ──
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:416:        input: 'resume previous work continue session',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:417:        mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:418:        profile: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:471:  // Phase 027: Structural bootstrap contract for resume surface
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:479:  // Keep live resume authoritative; cached continuity only appends bounded notes when every gate passes.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:485:    hints.push('Cached continuity summary accepted as additive resume context.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:511:      key: 'memory-resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:560:    kind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:591:      resumePayload: payloadContract,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:4:// Phase 030 / Phase 2: transport-only mapping from shared payload
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:5:// contracts to OpenCode-oriented startup, message, and compaction blocks.
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:9:/** Hook names emitted by the OpenCode transport adapter. */
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:16:/** One transport block delivered to an OpenCode runtime hook surface. */
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:25:/** Complete transport-only plan derived from shared startup/resume payloads. */
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:28:  transportOnly: true;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:37:  compaction?: OpenCodeTransportBlock;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:52:/** Narrow an unknown runtime payload to the shared transport envelope contract. */
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:77:    'Note: this is a startup snapshot; later structural reads may differ if the repo state changed.',
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:85:  resumePayload?: SharedPayloadEnvelope | null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:87:  compactionPayload?: SharedPayloadEnvelope | null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:93:    args.resumePayload?.kind,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:95:    args.compactionPayload?.kind,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:98:  const systemPayload = args.bootstrapPayload ?? args.startupPayload ?? args.resumePayload ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:99:  const messagePayloads = [args.resumePayload, args.healthPayload].filter(
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:102:  const compactionPayload = args.compactionPayload ?? args.resumePayload ?? args.bootstrapPayload ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:106:    transportOnly: true,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:124:            'Inject this as the startup digest for hookless OpenCode recovery. Keep it transport-only.',
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:140:    ...(compactionPayload
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:142:        compaction: {
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:145:          payloadKind: compactionPayload.kind,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:146:          dedupeKey: `compaction:${compactionPayload.kind}`,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:148:            compactionPayload,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:149:            'Inject this as the continuity note across compaction. Keep it separate from current-turn retrieval.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:4:// Phase 024 / Item 7: Composite tool that runs session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:7:import { handleSessionResume } from './session-resume.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:8:import type { CachedSessionSummaryDecision } from './session-resume.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:30:} from '../lib/context/opencode-transport.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:46:  resume: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:52:    readiness: 'ready';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:95:  resumeData: Record<string, unknown>,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:101:  if (resumeData.error) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:102:    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:113:  if (structuralContext.status === 'ready') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:114:    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:146:  if (structuralContext.status !== 'ready') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:152:    readiness: 'ready',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:155:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163:/** Handle session_bootstrap tool call — one-call session setup */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168:  // Sub-call 1: session_resume with full resume payload
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:169:  let resumeData: Record<string, unknown> = {};
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:171:    const resumeResponse = await handleSessionResume({
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:174:    resumeData = extractData(resumeResponse);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:175:    allHints.push(...extractHints(resumeData));
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:178:    resumeData = { error: message };
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:179:    allHints.push('session_resume failed. Try calling it manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:202:  const cachedSummary = extractCachedSummary(resumeData);
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
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:299:      { label: 'resume', certainty: resumeCertainty },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:311:      sourceRefs: ['session-resume', 'session-health', 'session-snapshot'],
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:315:    graphFreshness: structuralContext.status === 'ready'
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:324:    resume: resumeWithTrust,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:332:      resumePayload,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:338:    // Keep advisory routing guidance out of nextActions so bootstrap and resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:339:    // remain the authoritative recovery owners for startup and deep resume flows.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:340:    nextActions: buildNextActions(resumeData, healthData, structuralContext),
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:253:  readiness: 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:319:    readiness: 'ready',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:360:  const transportSessionId = typeof (extra as { sessionId?: unknown } | null)?.sessionId === 'string'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:373:  return explicitSessionId ?? transportSessionId ?? codexThreadId ?? undefined;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:741:async function buildServerInstructions(): Promise<string> {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:786:  lines.push('- If structural context shows "ready": code_graph_query is available for structural lookups');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:942:    // Ensure database is initialized (safe no-op if already done)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1232:    console.error('[context-server] Startup scan already in progress, skipping');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1238:    console.error('[context-server] Waiting for embedding model to be ready...');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1242:      console.error('[context-server] Startup scan skipped: embedding model not ready');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1340:// P1-09 FIX: Hoist transport to module scope so shutdown handlers can close it
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1341:let transport: StdioServerTransport | null = null;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1381:    // P1-09 FIX: Close MCP transport on shutdown
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1382:    runCleanupStep('transport', () => {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1383:      if (transport) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1384:        transport.close();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1385:        transport = null;
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1584:  // Mark embedding as "ready" since it will self-initialize on first use
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1622:        console.error(`[context-server] Learned triggers ready (migrated=${migrated}, fts5Isolated=${isolated})`);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1753:        console.error('[context-server] Background retry job already running or disabled');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1768:        console.error('[context-server] Shadow feedback evaluation scheduler not started (already running or disabled)');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1873:  // P1-09: Assign to module-level transport (not const) so shutdown handlers can close it
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1876:      const dynamicInstructions = await buildServerInstructions();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1886:  transport = new StdioServerTransport();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1887:  await server.connect(transport);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:28:// Feature catalog: Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:222:/** Handle memory_health tool -- returns system health status and diagnostics. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:233:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:251:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:260:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:269:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:278:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:287:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:333:        tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:359:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:363:        status: isEmbeddingModelReady() && database ? 'healthy' : 'degraded',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:380:  const status = isEmbeddingModelReady() && database ? 'healthy' : 'degraded';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:428:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:439:        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:446:    hints.push('Embedding model not ready - some operations may fail');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:546:          `Post-repair integrity still degraded: orphanedVectors=${postRepairReport.orphanedVectors}, ` +
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:570:    tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:43:  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:82:        description: 'Enable session deduplication (REQ-001). When true and sessionId provided, filters out already-sent memories.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:113:        enum: ['quick', 'research', 'resume', 'debug'],
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:237:  name: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:268:        description: 'Required with autoRepair:true to execute repair actions. When false or omitted, memory_health returns a confirmation-only response.'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:460:  description: '[L5:Lifecycle] Enable the shared-memory subsystem. First-run setup: persists enablement, creates infrastructure tables, and generates a README. Idempotent — subsequent calls return alreadyEnabled: true.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:738:// Phase 020: Composite session resume tool
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:740:  name: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:746:      specFolder: { type: 'string', description: 'Optional spec folder to scope the resume context' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:755:  name: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:756:  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:761:      specFolder: { type: 'string', description: 'Optional spec folder to scope the resume context' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:768:      resume: { type: 'object', description: 'Merged session_resume payload (spec folder, task status, memory context)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:770:      structuralContext: { type: 'object', description: 'Structural bootstrap contract (status, summary, recommendedAction); omitted when code graph is unavailable', properties: { status: { type: 'string', enum: ['ready', 'stale', 'missing'] }, summary: { type: 'string' }, recommendedAction: { type: 'string' } } },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:772:      nextActions: { type: 'array', items: { type: 'string' }, description: 'Up to 3 recommended next actions derived from resume, health, and structural status' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:774:    required: ['resume', 'health', 'hints', 'nextActions'],
.opencode/skill/mcp-coco-index/README.md:44:The skill ships with two access modes. The CLI (`ccc`) is fastest for one-off queries and all index management operations. The MCP server (`ccc mcp`) exposes a single `search` tool that AI agents call directly via stdio transport, integrating semantic search into any tool-calling workflow without leaving the conversation.
.opencode/skill/mcp-coco-index/README.md:99:bash .opencode/skill/mcp-coco-index/scripts/ensure_ready.sh --strict --require-config
.opencode/skill/mcp-coco-index/README.md:141:Language and path filters apply after ranking, which means they narrow an already semantically ranked result set rather than replacing semantic ranking with keyword matching. This design keeps the filters fast and the results meaningful. For multi-query agent sessions, set `refresh_index=false` on follow-up calls after the first query has already triggered a refresh. The daemon has a known concurrency issue where simultaneous `refresh_index=true` requests can cause `ComponentContext` errors.
.opencode/skill/mcp-coco-index/README.md:226:    ensure_ready.sh                Idempotent bootstrap (install + init + index if needed)
.opencode/skill/mcp-coco-index/README.md:491:**Q: What is the difference between `doctor.sh` and `ensure_ready.sh`?**
.opencode/skill/mcp-coco-index/README.md:493:A: `doctor.sh` is read-only. It inspects the environment, reports what is working and what is not, and exits with a non-zero code if any check fails. It never modifies anything. `ensure_ready.sh` is idempotent and takes action: it installs the binary if missing, initializes the project if not yet initialized, and optionally refreshes the index. Use `doctor.sh` for diagnostics and CI gates. Use `ensure_ready.sh` to bring a machine to a ready state.
.opencode/skill/mcp-coco-index/README.md:515:| [scripts/ensure_ready.sh](scripts/ensure_ready.sh) | Idempotent bootstrap |

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '95,360p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '400,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   521	      title: 'Cached Continuity',
   522	      content: [
   523	        cachedSummaryDecision.cachedSummary.continuityText,
   524	        `Cache tokens: create=${cachedSummaryDecision.cachedSummary.cacheCreationInputTokens}; read=${cachedSummaryDecision.cachedSummary.cacheReadInputTokens}`,
   525	        `Transcript: ${cachedSummaryDecision.cachedSummary.transcriptFingerprint}`,
   526	      ].join('\n'),
   527	      source: 'session',
   528	      certainty: cachedCertainty,
   529	    });
   530	  }
   531	  payloadSections.push(
   532	    {
   533	      key: 'code-graph-status',
   534	      title: 'Code Graph Status',
   535	      content: `status=${codeGraph.status}; files=${codeGraph.fileCount}; nodes=${codeGraph.nodeCount}; edges=${codeGraph.edgeCount}; lastScan=${codeGraph.lastScan ?? 'unknown'}`,
   536	      source: 'code-graph',
   537	      certainty: codeGraphCertainty,
   538	    },
   539	    {
   540	      key: 'cocoindex-status',
   541	      title: 'CocoIndex Status',
   542	      content: cocoIndex.available
   543	        ? `available at ${cocoIndex.binaryPath}`
   544	        : `unavailable; expected at ${cocoIndex.binaryPath}`,
   545	      source: 'semantic',
   546	      certainty: cocoIndexCertainty,
   547	    },
   548	    {
   549	      key: 'structural-context',
   550	      title: 'Structural Context',
   551	      content: structuralContext.summary,
   552	      source: 'code-graph',
   553	      certainty: structuralCertainty,
   554	      structuralTrust,
   555	    },
   556	  );
   557	
   558	  // ── Build composite result ──────────────────────────────────
   559	  const payloadContract = createSharedPayloadEnvelope({
   560	    kind: 'resume',
   561	    sections: payloadSections,
   562	    summary: `Resume payload: ${summarizeCertaintyContract([
   563	      { label: 'memory', certainty: memoryCertainty },
   564	      ...(cachedSummaryDecision.status === 'accepted' ? [{ label: 'cached', certainty: cachedCertainty }] : []),
   565	      { label: 'graph', certainty: codeGraphCertainty },
   566	      { label: 'cocoindex', certainty: cocoIndexCertainty },
   567	      { label: 'structural', certainty: structuralCertainty },
   568	    ])}; graph=${codeGraph.status}; graphStatus=${codeGraph.status}`,
   569	    provenance: {
   570	      producer: 'session_resume',
   571	      sourceSurface: 'session_resume',
   572	      trustState: trustStateFromStructuralStatus(structuralContext.status),
   573	      generatedAt: new Date().toISOString(),
   574	      lastUpdated: structuralContext.provenance?.lastUpdated ?? codeGraph.lastScan,
   575	      sourceRefs: ['memory-context', 'code-graph-db', 'cocoindex-path', 'session-snapshot'],
   576	    },
   577	  });
   578	  const graphOps = buildCodeGraphOpsContract({
   579	    graphFreshness: codeGraph.status as GraphFreshness,
   580	    sourceSurface: 'session_resume',
   581	  });
   582	
   583	  const result: SessionResumeResult = {
   584	    memory: memoryResult,
   585	    codeGraph,
   586	    cocoIndex,
   587	    cachedSummary: cachedSummaryDecision,
   588	    structuralContext,
   589	    payloadContract,
   590	    opencodeTransport: buildOpenCodeTransportPlan({
   591	      resumePayload: payloadContract,
   592	      specFolder: args.specFolder ?? null,
   593	    }),
   594	    graphOps,
   595	    ...(sessionQuality ? { sessionQuality } : {}),
   596	    hints,
   597	  };
   598	
   599	  // Phase 024 / Item 9: Record bootstrap telemetry
   600	  if (!args.minimal) {
   601	    recordBootstrapEvent(
   602	      'tool',
   603	      Date.now() - startMs,
   604	      'full',
   605	    );
   606	  }
   607	
   608	  return {
   609	    content: [{
   610	      type: 'text',
   611	      text: JSON.stringify({ status: 'ok', data: result }, null, 2),
   612	    }],
   613	  };
   614	}

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts | sed -n '350,470p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/plugins/spec-kit-compact-code-graph.js | sed -n '380,450p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts | sed -n '1,110p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/mcp-coco-index/README.md | sed -n '36,150p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
I’ve got the current Public transport and recovery paths in view now. One thing is already standing out: Public has stronger recovery surfaces than Mnemosyne, but its compaction payload still carries summary blocks instead of a purpose-built “after compaction, do this” operating card.
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ────────────────────────────────────────────────────────────────
     2	// MODULE: Memory Crud Types
     3	// ────────────────────────────────────────────────────────────────
     4	
     5	/* ───────────────────────────────────────────────────────────────
     6	   TYPES
     7	──────────────────────────────────────────────────────────────── */
     8	
     9	/** Arguments for the memory_delete handler. */
    10	
    11	// Feature catalog: Memory indexing (memory_save)
    12	// Feature catalog: Memory metadata update (memory_update)
    13	// Feature catalog: Single and folder delete (memory_delete)
    14	// Feature catalog: Tier-based bulk deletion (memory_bulk_delete)
    15	
    16	interface DeleteArgs {
    17	  id?: number | string;
    18	  specFolder?: string;
    19	  confirm?: boolean;
    20	}
    21	
    22	/** Arguments for the memory_update handler. */
    23	interface UpdateArgs {
    24	  id: number;
    25	  title?: string;
    26	  triggerPhrases?: string[];
    27	  importanceWeight?: number;
    28	  importanceTier?: string;
    29	  allowPartialUpdate?: boolean;
    30	}
    31	
    32	/** Arguments for the memory_list handler. */
    33	interface ListArgs {
    34	  limit?: number;
    35	  offset?: number;
    36	  specFolder?: string;
    37	  sortBy?: string;
    38	  includeChunks?: boolean;
    39	}
    40	
    41	/** Arguments for the memory_stats handler. */
    42	interface StatsArgs {
    43	  folderRanking?: string;
    44	  excludePatterns?: string[];
    45	  includeScores?: boolean;
    46	  includeArchived?: boolean;
    47	  limit?: number;
    48	}
    49	
    50	/** Arguments for the memory_health handler. */
    51	interface HealthArgs {
    52	  reportMode?: 'full' | 'divergent_aliases';
    53	  limit?: number;
    54	  specFolder?: string;
    55	  autoRepair?: boolean;
    56	  confirmed?: boolean;
    57	}
    58	
    59	/** Partial embedding provider metadata — see shared/types.ts ProviderMetadata for the full shape. */
    60	interface PartialProviderMetadata {
    61	  provider: string;
    62	  model?: string;
    63	  dim?: number;
    64	  healthy?: boolean;
    65	}
    66	
    67	/** Snapshot of a memory's hash state for mutation tracking. */
    68	interface MemoryHashSnapshot {
    69	  id: number;
    70	  content_hash: string | null;
    71	  spec_folder?: string | null;
    72	  file_path?: string | null;
    73	}
    74	
    75	/** Valid mutation types for the CRUD ledger. */
    76	type CrudMutationType = 'create' | 'update' | 'delete' | 'merge' | 'archive' | 'restore' | 'reindex';
    77	
    78	/** Input parameters for recording a mutation in the ledger. */
    79	interface MutationLedgerInput {
    80	  mutationType: CrudMutationType;
    81	  reason: string;
    82	  priorHash: string | null;
    83	  newHash: string;
    84	  linkedMemoryIds: number[];
    85	  decisionMeta: Record<string, unknown>;
    86	  actor: string;
    87	  sessionId?: string | null;
    88	}
    89	
    90	/** Result returned by post-mutation hooks (cache invalidation, etc.). */
    91	interface MutationHookResult {
    92	  latencyMs: number;
    93	  triggerCacheCleared: boolean;
    94	  constitutionalCacheCleared: boolean;
    95	  toolCacheInvalidated: number;
    96	  graphSignalsCacheCleared: boolean;
    97	  coactivationCacheCleared: boolean;
    98	  errors: string[];
    99	}
   100	
   101	/* ───────────────────────────────────────────────────────────────
   102	   EXPORTS
   103	──────────────────────────────────────────────────────────────── */
   104	
   105	export type {
   106	  DeleteArgs,
   107	  UpdateArgs,
   108	  ListArgs,
   109	  StatsArgs,
   110	  HealthArgs,
   111	  PartialProviderMetadata,
   112	  MemoryHashSnapshot,
   113	  CrudMutationType,
   114	  MutationLedgerInput,
   115	  MutationHookResult,
   116	};

Completed the memory pass, validated the phase folder, traced the external wrapper in the required order, and compared it to Public’s current startup, resume, compaction, and readiness surfaces. I’m synthesizing the iteration 24 findings now.
  ✓ Run a quick memory pass for prior Mnemosyne and compaction-related context
  ✓ Read external Mnemosyne wrapper in required order and extract compaction/startup evidence
  ✓ Read current Public startup, resume, compaction, and memory retrieval surfaces for comparison
  → Synthesize iteration 24 findings with recommendations and next focus
codex
# Iteration 024: COMPACTION & CONTEXT SURVIVAL

## Focus
COMPACTION & CONTEXT SURVIVAL: How does this system handle context window limits, compaction events, and startup context reconstruction? Lessons for our compaction survival.

## Findings
### Finding 1: Public’s compaction note is currently a generic truncated payload, not a compaction-specific survival card
- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L222), [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L57), [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L102), [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L142), [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L509), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L246)
- **What it does**: Mnemosyne writes a hand-authored compaction block with only survival instructions. Public reuses `renderBlockContent()` for compaction, and that renderer only keeps the first two payload sections.
- **Why it matters**: On Public, compaction can easily drop the most recovery-critical sections like structural context or next actions, especially when cached continuity occupies one of the first slots. Mnemosyne avoids that by making compaction a dedicated, purpose-built message.
- **Recommendation**: adopt now
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


hook: Stop
hook: Stop Completed
tokens used
139,342
# Iteration 024: COMPACTION & CONTEXT SURVIVAL

## Focus
COMPACTION & CONTEXT SURVIVAL: How does this system handle context window limits, compaction events, and startup context reconstruction? Lessons for our compaction survival.

## Findings
### Finding 1: Public’s compaction note is currently a generic truncated payload, not a compaction-specific survival card
- **Source**: [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [external/src/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L222), [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L57), [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L102), [opencode-transport.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L142), [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L509), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L246)
- **What it does**: Mnemosyne writes a hand-authored compaction block with only survival instructions. Public reuses `renderBlockContent()` for compaction, and that renderer only keeps the first two payload sections.
- **Why it matters**: On Public, compaction can easily drop the most recovery-critical sections like structural context or next actions, especially when cached continuity occupies one of the first slots. Mnemosyne avoids that by making compaction a dedicated, purpose-built message.
- **Recommendation**: adopt now
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
