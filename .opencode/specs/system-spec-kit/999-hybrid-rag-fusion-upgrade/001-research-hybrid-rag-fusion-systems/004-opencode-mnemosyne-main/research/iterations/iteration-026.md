## Recommended Next Focus
Design a bounded follow-on around a dedicated compaction renderer: one small, timeless memory-survival card that says “use memory tools when relevant, then call `session_bootstrap()` for full reconstruction,” with health-gating and no generic section truncation. After that, decide whether startup, bootstrap, and compaction should all share one Public-native memory-discipline helper.
--- Iteration 25 ---
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
# Iteration 026: SEMANTIC VS LEXICAL TRADE-OFFS

## Focus
SEMANTIC VS LEXICAL TRADE-OFFS: Deep analysis of when semantic search beats lexical and vice versa in this system. What hybrid strategies should we adopt?

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
Using `sk-deep-research` for this pass, with a light memory lookup first so the analysis stays aligned with prior iterations and the existing packet boundaries. Then I’m reading the external wrapper and the current Public retrieval surfaces side by side to isolate the semantic-vs-lexical trade-offs instead of repeating earlier hybrid-search findings.
exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc 'rg -n "mnemosyne|hybrid-rag-fusion|semantic|lexical|BM25|vector|cocoindex|memory_search|memory_context|memory_match_triggers" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
13:- fix findings, review/review-report.md, 002-implement-cache-warning-hooks, 003-memory-quality-issues, 008-graph-first-routing-nudge, 010-sqlite-fts-helper, 013-analytics-token-contracts, 005-code-graph-upgrades, lexicalPath unavailable, Structural Routing Hint, validate.sh --strict
24:- packet 010 degraded lexical lane vocabulary is `lexicalPath: 'unavailable'`; align runtime output, tests, README, and checklist language to this exact label [Task 1]
205:- shipped 014 lane includes detector provenance vocabulary carriers, blast-radius traversal with explicit depth cap and union semantics, and low-authority hot-file breadcrumb evidence while preserving packet 011 trust-axis payloads [Task 1]
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
547:- `memory_stats` currently has no `sessionId` input in tool schema, so calling it after `memory_search` cannot claim the same session by default [Task 2]
548:- verification pattern that worked: confirm fresh `context-server.js` processes, run `session_bootstrap`, execute controlled `memory_search` sequence with fixed session id + trace flags, then query `feedback_events` globally and per-session in sqlite [Task 2]
731:- session_bootstrap, memory_context({mode:"resume",profile:"resume"}), mcp_server/hooks/claude, scripts/hooks/claude, workflow-session-id.vitest.ts, code-graph-query-handler.vitest.ts
757:- rollout_summaries/2026-04-02T14-05-56-qyWY-cocoindex_compact_code_graph_readme_section.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T16-05-56-019d4e83-d8f5-7342-833e-98b3e0f731f0.jsonl, updated_at=2026-04-02T14:08:03+00:00, thread_id=019d4e83-d8f5-7342-833e-98b3e0f731f0)
761:- CocoIndex + Compact Code Graph, README.md, 024-compact-code-graph, 006-documentation-alignment, mcp__cocoindex_code__search, code_graph_query, prettier --check
786:- `session_bootstrap()` is the primary recovery call for non-hook flows; docs should mention fallback `memory_context({mode:"resume",profile:"resume"})` only after bootstrap guidance [Task 4]
919:- .vscode/mcp.json, .mcp.json, .claude/mcp.json, inputs + servers, mcpServers, SPECKIT_SESSION_BOOST, SPECKIT_CAUSAL_BOOST, cocoindex_code, jq empty
928:- richer flags/notes and `cocoindex_code` definitions can be sourced from `.mcp.json`/`.claude/mcp.json` and then validated with `jq empty` [Task 1]
1057:- list_mcp_resources, list_mcp_resource_templates, spec_kit_memory, opencode.json, context-server.js, memory_context, memory_search
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1192:scope: `/spec_kit:deep-research --review` execution contract, review-folder semantics, and release-readiness criteria mapping
1274:- Advisor benchmark/regression commands need explicit `--dataset` and semantic-disable env toggle for stable timing [Task 1]
1278:- symptom: benchmark p95 unexpectedly high; cause: builtin semantic latency noise; fix: disable builtin semantic path during benchmark runs [Task 1]
1443:scope: structured JSON save authority, recovery-only fallback semantics, and Phase 016/011 runtime-doc-test parity
1478:- memory_search cursor, progressive-disclosure, requestQuality, SPECKIT_RESULT_CONFIDENCE_V1, memory-search-ux-hooks.vitest.ts
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
1918:- `memory_health` cleanup runbook: back up DB first, clean temp-path rows/vector orphans transactionally, then re-run integrity checks and report post-clean stats [Task 2]
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
The wrapper confirms something useful already: Mnemosyne’s plugin surface is much more opinionated than its backend contract. I’m now tracing our own retrieval stack to map where lexical, semantic, and trigger-based retrieval already diverge, so the recommendation can be about routing strategy instead of “add hybrid search” hand-waving.
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
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '745,800p' /Users/michelkerkmeester/.codex/memories/MEMORY.md && sed -n '780,790p' /Users/michelkerkmeester/.codex/memories/MEMORY.md && sed -n '540,550p' /Users/michelkerkmeester/.codex/memories/MEMORY.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
### rollout_summary_files

- rollout_summaries/2026-04-02T15-03-16-TyzB-changelog_024_compact_code_graph.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T17-03-16-019d4eb8-5687-7820-b943-28f8d97369cf.jsonl, updated_at=2026-04-02T15:17:25+00:00, thread_id=019d4eb8-5687-7820-b943-28f8d97369cf)

### keywords

- scratch/changelog-024-root.md, changelog-024-<phase>.md, use max sub agents, packet-local scratch, implementation-summary, review report

## Task 7: Add dedicated README section for CocoIndex + Compact Code Graph with packet references, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-02T14-05-56-qyWY-cocoindex_compact_code_graph_readme_section.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T16-05-56-019d4e83-d8f5-7342-833e-98b3e0f731f0.jsonl, updated_at=2026-04-02T14:08:03+00:00, thread_id=019d4e83-d8f5-7342-833e-98b3e0f731f0)

### keywords

- CocoIndex + Compact Code Graph, README.md, 024-compact-code-graph, 006-documentation-alignment, mcp__cocoindex_code__search, code_graph_query, prettier --check

## Task 8: Refresh README/changelog language to current code-graph behavior and sync constitutional README file inventory, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-03T11-57-51-M8RC-code_graph_documentation_and_changelog_sync.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T13-57-51-019d5334-f0f1-7730-8c5e-9ab6db1b631c.jsonl, updated_at=2026-04-04T15:43:31+00:00, thread_id=019d5334-f0f1-7730-8c5e-9ab6db1b631c)

### keywords

- current reality, no longer wording removal, bounded selective_reindex, full_scan guidance, v3.3.0.0, gate-tool-routing.md, constitutional/README.md

## User preferences

- when the user said “Re-use /.../024-compact-code-graph/006-documentation-alignment,” continue under the specified existing spec folder instead of opening a new packet [Task 4]
- when the user asked for deep review “make sure everything works as expected ... check the feature catalog and manual testing playbook, and all commands, agents and readmes,” treat it as full-spectrum audit + runtime/doc parity, not a narrow fix pass [Task 1][Task 2]
- when user asked to “use max sub agents” for packet changelog synthesis, parallelize phase evidence gathering but keep output scoped to the requested packet `scratch/` folder [Task 6]
- when user asked for README work, they specified “proper dedicated section ... reference 024-compact-code-graph ... re-use 006-documentation-alignment” -> preserve that wording/terminology and include those exact packet references [Task 7]
- when refining README wording, the user asked for “current reality” language, plain English, and no “no longer” phrasing or internal spec-folder references in runtime-state descriptions [Task 8]
- when updating changelog claims, keep wording pinned to implemented behavior evidence (bounded inline `selective_reindex` vs explicit operator `code_graph_scan`) [Task 8]

## Reusable knowledge

- canonical validation gates for packet readiness here were `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --recursive --strict` plus `TMPDIR=... npm run check:full` and `npm run build` evidence capture [Task 1][Task 2]
- for strict validator compliance, checklist lines need explicit `[EVIDENCE: ...]` and level-template headers/section numbers must remain exact (`## 1. METADATA`, `## 2. PROBLEM & PURPOSE`, etc.) [Task 3]
- `session_bootstrap()` is the primary recovery call for non-hook flows; docs should mention fallback `memory_context({mode:"resume",profile:"resume"})` only after bootstrap guidance [Task 4]
- hook path truth is `mcp_server/hooks/claude/*.ts` and compiled `mcp_server/dist/hooks/claude/*.js`; avoid stale `scripts/hooks/claude/` references [Task 4]
- changelog truth-sync for 023 needed root + per-phase consistency: add missing phase 013 entry and avoid overstating rerun verification for 010/011/012 while strict validation remains green [Task 5]
- for packet changelog generation at this scale, first mirror prior packet changelog structure, then gather evidence from implementation summaries/checklists/review docs before drafting per-phase files [Task 6]
- README formatting in this repo is partially hand-formatted; if `npx prettier --check README.md` fails but `git diff --check` is clean, keep scoped edits and avoid whole-file reflow [Task 7]
- constitutional README parity check should enumerate both `gate-enforcement.md` and `gate-tool-routing.md` as required files so operators see the full always-surfaced ruleset [Task 8]

## Failures and how to do differently

- symptom: tests not found when running Vitest with file filters from repo root; cause: package-scoped configs were bypassed; fix: run from the owning package roots (`scripts`, `mcp_server`) [Task 4]
- symptom: strict validation keeps failing on packet docs despite correct intent; cause: missing acceptance scenarios, protocol sections, or template anchors; fix: align to SPECKIT template headings first, then rerun validator [Task 2][Task 3]
- symptom: bulk patching changelog files accidentally removes or rewrites wrong sections; cause: oversized patch scope; fix: restore from HEAD and apply smaller file-local patches [Task 5]
- symptom: memory save quality gate rejects closeout payload; cause: weak primary evidence + noisy trigger phrases; fix: include explicit files/observations/toolCalls/decisions and clean trigger phrases before rerunning quality validation [Task 1]

# Task Group: Compact Code Graph Session-Start Injection and Codex Priming Diagnostics
- when updating changelog claims, keep wording pinned to implemented behavior evidence (bounded inline `selective_reindex` vs explicit operator `code_graph_scan`) [Task 8]

## Reusable knowledge

- canonical validation gates for packet readiness here were `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --recursive --strict` plus `TMPDIR=... npm run check:full` and `npm run build` evidence capture [Task 1][Task 2]
- for strict validator compliance, checklist lines need explicit `[EVIDENCE: ...]` and level-template headers/section numbers must remain exact (`## 1. METADATA`, `## 2. PROBLEM & PURPOSE`, etc.) [Task 3]
- `session_bootstrap()` is the primary recovery call for non-hook flows; docs should mention fallback `memory_context({mode:"resume",profile:"resume"})` only after bootstrap guidance [Task 4]
- hook path truth is `mcp_server/hooks/claude/*.ts` and compiled `mcp_server/dist/hooks/claude/*.js`; avoid stale `scripts/hooks/claude/` references [Task 4]
- changelog truth-sync for 023 needed root + per-phase consistency: add missing phase 013 entry and avoid overstating rerun verification for 010/011/012 while strict validation remains green [Task 5]
- for packet changelog generation at this scale, first mirror prior packet changelog structure, then gather evidence from implementation summaries/checklists/review docs before drafting per-phase files [Task 6]
- README formatting in this repo is partially hand-formatted; if `npx prettier --check README.md` fails but `git diff --check` is clean, keep scoped edits and avoid whole-file reflow [Task 7]
### keywords

- follow_on_tool_use, resolveSessionTrackingId, logFollowOnToolUse, memory_stats schema, session_bootstrap, feedback_events sqlite3

## Reusable knowledge

- `follow_on_tool_use` depends on a session id that matches the in-memory search session cache; if a non-search tool call lacks/does not inherit that session id, the follow-on event will not emit [Task 2]
- `memory_stats` currently has no `sessionId` input in tool schema, so calling it after `memory_search` cannot claim the same session by default [Task 2]
- verification pattern that worked: confirm fresh `context-server.js` processes, run `session_bootstrap`, execute controlled `memory_search` sequence with fixed session id + trace flags, then query `feedback_events` globally and per-session in sqlite [Task 2]
- build/test/doc passes can still be misleading if live workers are stale; restart/runtime pickup must be treated as a separate verification gate [Task 1]


exec
/bin/zsh -lc 'bash /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1498ms:

───────────────────────────────────────────────────────────────

  Spec Folder Validation v2.0.0
───────────────────────────────────────────────────────────────


  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main
  Level:  1 (inferred)

───────────────────────────────────────────────────────────────


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/spec/validate.sh: line 406: cannot create temp file for here document: Operation not permitted

───────────────────────────────────────────────────────────────


  Summary: Errors: 0  Warnings: 0

  RESULT: PASSED


exec
/bin/zsh -lc "rg -n \"bm25|vector|lexical|semantic|hybrid|fusion|fts|rrf|reciprocal|embedding|dual retrieval|lexical capability|keyword\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search -g '"'!**/dist/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:85:} from '../lib/search/sqlite-fts.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:86:import type { LexicalCapabilitySnapshot } from '../lib/search/sqlite-fts.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:100:// Feature catalog: Semantic and lexical search (memory_search)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:362:  if (typeof data.lexicalPath !== 'string' && snapshot) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:363:    data.lexicalPath = snapshot.lexicalPath;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:763:    // Wait for embedding model only on cache miss
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:777:        : 'hybrid',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:905:    const lexicalCapability = getLastLexicalCapabilitySnapshot();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:906:    if (lexicalCapability) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:908:        `[memory-search] Lexical capability path '${lexicalCapability.lexicalPath}' (fallbackState: ${lexicalCapability.fallbackState})`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:919:    if (lexicalCapability) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:920:      extraData.lexicalPath = lexicalCapability.lexicalPath;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:921:      extraData.fallbackState = lexicalCapability.fallbackState;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1234:        fusionMethod: 'rrf',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:4:// Combines vector, FTS, and BM25 search with fallback
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:9:import { getIndex, isBm25Enabled } from './bm25-index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:10:import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:11:import { getAdaptiveWeights, isAdaptiveFusionEnabled } from '@spec-kit/shared/algorithms/adaptive-fusion';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:15:import { fts5Bm25Search } from './sqlite-fts.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:63:import type { FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:71:  embedding: Float32Array | number[],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:91:  /** Classified query intent for adaptive fusion weight selection (e.g. 'understand', 'fix_bug'). */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:102:   * When true, stop after channel collection and return pre-fusion candidates.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:107:   * When true, return immediately after adaptive/RRF fusion so Stage 2/3 can
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:117:   * - `'vector'` — cosine similarity from sqlite-vec (normalized from 0-100 to 0-1)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:118:   * - `'bm25'` — BM25 term-frequency relevance (min-max normalized per source group)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:119:   * - `'fts'` — FTS5 rank score (absolute value, min-max normalized per source group)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:122:   * After hybrid merge, all source scores are min-max normalized to 0-1 within
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:141:  const primarySource = result.sources[0] ?? 'hybrid';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:147:    score: typeof scoreCandidate === 'number' ? scoreCandidate : result.rrfScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:234:/** Primary vector similarity floor for hybrid fallback passes (percentage units). */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:236:/** Secondary vector similarity floor for adaptive retry passes (percentage units). */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:238:/** Tier-2 vector similarity floor for quality-aware fallback (percentage units). */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:260:let vectorSearchFn: VectorSearchFn | null = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:303: * Initialize hybrid search with database, vector search, and optional graph search dependencies.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:305: * @param vectorFn - Optional vector search function for semantic similarity.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:310:  vectorFn: VectorSearchFn | null = null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:314:  vectorSearchFn = vectorFn;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:324: * @returns Array of BM25-scored results tagged with source 'bm25'.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:326:function bm25Search(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:331:    console.warn('[hybrid-search] BM25 not enabled — returning empty bm25Search results');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:394:        source: 'bm25',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:398:    console.warn(`[hybrid-search] BM25 search failed: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:425: * @returns True if the memory_fts table exists in the connected database.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:429:    console.warn('[hybrid-search] db not initialized — isFtsAvailable returning false');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:435:      SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:448: * @returns Array of FTS-scored results tagged with source 'fts'.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:450:function ftsSearch(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:455:    console.warn('[hybrid-search] db not initialized or FTS unavailable — returning empty ftsSearch results');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:462:    // C138-P2: Delegate to weighted BM25 FTS5 search from sqlite-fts.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:463:    // Uses bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) for per-column weighting
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:465:    // Filters: is_archived exclusion and spec_folder matching handled by fts5Bm25Search
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:466:    const bm25Results = fts5Bm25Search(db, query, { limit, specFolder, includeArchived });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:468:    return bm25Results.map(row => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:471:      score: row.fts_score || 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:472:      source: 'fts',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:476:    console.warn(`[hybrid-search] FTS search failed: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:493:  const ftsResults = ftsSearch(query, options);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:494:  const bm25Results = bm25Search(query, options);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:501:  for (const r of ftsResults) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:505:  for (const r of bm25Results) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:600:    source: typeof primary.source === 'string' ? primary.source : (sources[0] ?? 'hybrid'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:682:  const allowed = new Set<ChannelName>(['vector', 'fts', 'graph', 'degree']);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:685:    allowed.add('bm25');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:688:  if (options.useVector === false) allowed.delete('vector');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:689:  if (options.useBm25 === false) allowed.delete('bm25');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:690:  if (options.useFts === false) allowed.delete('fts');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:707:    useVector: allowedChannels.has('vector'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:708:    useBm25: allowedChannels.has('bm25'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:709:    useFts: allowedChannels.has('fts'),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:742:  vectorEmbeddingCache: Map<number, Float32Array>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:772:  embedding: Float32Array | number[] | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:784:  const primaryExecution = await collectAndFuseHybridResults(query, embedding, primaryOptions);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:787:    : await hybridSearch(query, embedding, primaryOptions);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:806:    const retryExecution = await collectAndFuseHybridResults(query, embedding, retryOptions);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:809:      : await hybridSearch(query, embedding, retryOptions);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:826:    const retryExecution = await collectAndFuseHybridResults(query, embedding, retryOptions);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:829:      : await hybridSearch(query, embedding, retryOptions);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:848: * Run multi-channel hybrid search combining vector, FTS, BM25, and graph results with per-source normalization.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:849: * Prefer hybridSearchEnhanced() or searchWithFallback() instead. This function uses naive per-source
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:850: * min-max normalization which produces different orderings than the RRF pipeline in hybridSearchEnhanced().
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:853:async function hybridSearch(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:855:  embedding: Float32Array | number[] | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:872:  if (useVector && embedding && vectorSearchFn) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:874:      const vectorResults = vectorSearchFn(embedding, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:881:      for (const r of vectorResults) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:886:          source: 'vector',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:891:      console.warn(`[hybrid-search] Vector search failed: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:897:    const ftsResults = ftsSearch(query, { limit, specFolder, includeArchived });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:898:    results.push(...ftsResults);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:903:    const bm25Results = bm25Search(query, { limit, specFolder });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:904:    results.push(...bm25Results);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:921:      console.warn(`[hybrid-search] Graph search failed: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:954:  // LIMITATION (P1-1): When a result appears in multiple sources (e.g., vector + fts),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:973: * Enhanced hybrid search with RRF fusion.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:977:async function hybridSearchEnhanced(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:979:  embedding: Float32Array | number[] | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:982:  const execution = await collectAndFuseHybridResults(query, embedding, options);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:991:  return hybridSearch(query, embedding, options);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:996:  embedding: Float32Array | number[] | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1010:    const allPossibleChannels: ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1053:    let semanticResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1054:    let ftsChannelResults: HybridSearchResult[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1055:    let bm25ChannelResults: HybridSearchResult[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1056:    const vectorEmbeddingCache = new Map<number, Float32Array>();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1062:    if (activeChannels.has('vector') && embedding && vectorSearchFn) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1064:        const vectorResults = vectorSearchFn(embedding, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1072:        semanticResults = vectorResults.map((r: Record<string, unknown>): { id: number | string; source: string; [key: string]: unknown } => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1075:          source: 'vector',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1077:        for (const result of semanticResults) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1079:          const embeddingCandidate = toEmbeddingBufferView(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1080:            (result as Record<string, unknown>).embedding
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1081:            ?? (result as Record<string, unknown>).embeddingBuffer
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1083:          if (embeddingCandidate) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1084:            vectorEmbeddingCache.set(result.id, embeddingCandidate);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1087:        lists.push({ source: 'vector', results: semanticResults, weight: 1.0 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1089:        // Non-critical — vector channel failure does not block pipeline
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1090:        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1094:    // FTS channel (internal error handling in ftsSearch) — gated by query-complexity routing
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1095:    if (activeChannels.has('fts')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1096:      ftsChannelResults = ftsSearch(query, options);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1097:      if (ftsChannelResults.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1099:        // flooding top-K with noisy lexical matches despite its exact-match value.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1100:        lists.push({ source: 'fts', results: ftsChannelResults, weight: 0.3 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1104:    // BM25 channel (internal error handling in bm25Search) — gated by query-complexity routing
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1105:    if (activeChannels.has('bm25')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1106:      bm25ChannelResults = bm25Search(query, options);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1107:      if (bm25ChannelResults.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1108:        // BM25 weight 0.6 is lowest lexical channel — in-memory BM25 index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1110:        lists.push({ source: 'bm25', results: bm25ChannelResults, weight: 0.6 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1133:        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1177:        console.warn('[hybrid-search] Channel error:', _err instanceof Error ? _err.message : String(_err));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1181:    // Merge keyword results after all channels complete
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1182:    const keywordResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1183:      ...ftsChannelResults,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1184:      ...bm25ChannelResults,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1195:        vectorEmbeddingCache,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1221:    // C138/T315: Build weighted fusion lists once from lightweight adaptive
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1222:    // weights, avoiding the heavier hybridAdaptiveFuse() standard-first path.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1225:    const fusionWeights = adaptiveEnabled
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1227:      : { semanticWeight: 1.0, keywordWeight: 1.0, recencyWeight: 0 };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1228:    const { semanticWeight, keywordWeight, graphWeight: adaptiveGraphWeight } = fusionWeights;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1229:    const keywordFusionResults = keywordResults.map((result) => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1231:      source: 'keyword',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1233:    const fusionLists = lists
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1234:      .filter((list) => list.source !== 'fts' && list.source !== 'bm25')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1236:        if (list.source === 'vector') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1237:          return { ...list, weight: semanticWeight };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1245:    if (keywordFusionResults.length > 0 && keywordWeight > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1246:      fusionLists.push({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1247:        source: 'keyword',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1248:        results: keywordFusionResults,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1249:        weight: keywordWeight,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1253:    const fused = fuseResultsMulti(fusionLists);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1273:      vectorEmbeddingCache,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1278:    console.warn(`[hybrid-search] Enhanced search failed, falling back: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1296:    vectorEmbeddingCache,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1301:  // -- Aggregation stage: MPAB chunk-to-memory aggregation (after fusion, before state filter) --
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1337:      console.error('[hybrid-search] MPAB error (non-fatal):', msg);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1343:  // In the top-k window. Prevents single-channel dominance in fusion output.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1360:      fusedHybridResults.map(r => ({ ...r, source: r.source || 'hybrid' })),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1375:    console.warn('[hybrid-search] channel enforcement failed:', err instanceof Error ? err.message : String(err));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1384:  // C138/T316: MMR reranking with request-scoped embedding cache.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1385:  // Reuse embeddings already returned by the vector channel when present and
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1390:  // Preserve cross-encoder gate semantics: when SPECKIT_CROSS_ENCODER=false, skip reranking.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1405:        const embeddingMap = new Map<number, Float32Array>(vectorEmbeddingCache);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1406:        const missingIds = numericIds.filter((id) => !embeddingMap.has(id));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1411:            `SELECT rowid, embedding FROM vec_memories WHERE rowid IN (${placeholders})`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1412:          ) as Database.Statement).all(...missingIds) as Array<{ rowid: number; embedding: Buffer }>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1415:            if (Buffer.isBuffer(row.embedding)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1416:              embeddingMap.set(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1418:                new Float32Array(row.embedding.buffer, row.embedding.byteOffset, row.embedding.byteLength / 4)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1426:          const emb = embeddingMap.get(r.id as number);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1431:              embedding: emb,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1441:          // rows that have embeddings. Non-embedded rows (lexical-only hits,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1459:              source: 'vector',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1469:        console.warn(`[hybrid-search] MMR embedding retrieval failed: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1491:            if ('rrfScore' in result) (result as Record<string, unknown>).rrfScore = boostedScore;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1501:      console.warn('[hybrid-search] co-activation enrichment failed:', err instanceof Error ? err.message : String(err));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1555:      console.warn('[hybrid-search] confidence truncation failed:', err instanceof Error ? err.message : String(err));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1623:      queryId: `hybrid-${Date.now()}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1676: * immediately after intra-query fusion and before downstream aggregation,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1680: * @param embedding - Optional embedding vector for semantic search.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1686:  embedding: Float32Array | number[] | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1691:    embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1710:  if (allowedChannels.has('fts')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1711:    const ftsFallback = collectCandidatesFromLists(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1712:      [{ source: 'fts', results: ftsSearch(query, options) }],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1715:    if (ftsFallback.length > 0) return ftsFallback;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1718:  if (allowedChannels.has('bm25')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1719:    const bm25Fallback = collectCandidatesFromLists(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1720:      [{ source: 'bm25', results: bm25Search(query, options) }],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1723:    if (bm25Fallback.length > 0) return bm25Fallback;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1726:  console.warn('[hybrid-search] Raw candidate collection returned empty results');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1737: * @param embedding - Optional embedding vector for semantic search.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1743:  embedding: Float32Array | number[] | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1748:    return searchWithFallbackTiered(query, embedding, options);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1753:  // P3-03 FIX: Use hybridSearchEnhanced (with RRF fusion) instead of
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1754:  // The naive hybridSearch that merges raw scores
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1757:    embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1771:  if (allowedChannels.has('fts')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1772:    const ftsResults = ftsSearch(query, options);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1773:    if (ftsResults.length > 0) return ftsResults;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1777:  if (allowedChannels.has('bm25')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1778:    const bm25Results = bm25Search(query, options);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1779:    if (bm25Results.length > 0) return bm25Results;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1782:  console.warn('[hybrid-search] All search methods returned empty results');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1791: * requiring embeddings or text similarity. Pure SQL fallback.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1800:    console.warn('[hybrid-search] db not initialized — returning empty structuralSearch results');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1855:    console.warn(`[hybrid-search] Structural search failed: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2014: * Prevents structural placeholders from outranking stronger semantic/lexical hits.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2103: * TIER 1: hybridSearchEnhanced at minSimilarity=30
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2106: * TIER 2: hybridSearchEnhanced at minSimilarity=10, all allowed channels forced
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2115: * @param embedding - Optional embedding vector for semantic search.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2121:  embedding: Float32Array | number[] | null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2125:  const { stages } = await executeFallbackPlan(query, embedding, options, 'tiered');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2147:  console.error(`[hybrid-search] Tier 1→2 degradation: ${tier1Trigger.reason} (topScore=${tier1Trigger.topScore.toFixed(3)}, count=${tier1Trigger.resultCount})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2174:  console.error(`[hybrid-search] Tier 2→3 degradation: ${tier2Trigger.reason} (topScore=${tier2Trigger.topScore.toFixed(3)}, count=${tier2Trigger.resultCount})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2282:    'combined_lexical_score',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2390:      `[hybrid-search] Token budget overflow (single-result fallback): ` +
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2427:      `[hybrid-search] Token budget overflow (top-result fallback): ` +
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2444:    `[hybrid-search] Token budget overflow: ${totalTokens} tokens > ${effectiveBudget} budget, ` +
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2467:  bm25Search,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2472:  ftsSearch,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2473:  hybridSearch,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2474:  hybridSearchEnhanced,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:399:    // Do NOT touch memory_fts or any FTS5 table (Safeguard #1).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:9:// query, embeds it, then uses the pseudo-document embedding as an
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:30:import * as embeddings from '../providers/embeddings.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:31:import * as vectorIndex from './vector-index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:57:/** HyDE result including the pseudo-document and its embedding. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:61:  /** Embedding vector of the pseudo-document (Float32Array). */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:62:  embedding: Float32Array;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:69:  rrfScore?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:128: *   intentAdjustedScore (not in BaselineResult) → rrfScore → score → similarity/100
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:156:  if (typeof result.rrfScore === 'number' && Number.isFinite(result.rrfScore))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:157:    return Math.max(0, Math.min(1, result.rrfScore));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:286: *   3. Embed the pseudo-document via the embeddings provider.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:287: *   4. Cache { pseudoDocument, embedding } with 1-hour TTL.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:293: *   - LLM or embedding call fails
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:316:  // Cache hit — return stored pseudo-document + embedding
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:328:    const embeddingRaw = await embeddings.generateQueryEmbedding(pseudoDocument);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:329:    if (!embeddingRaw) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:334:    const embedding = embeddingRaw instanceof Float32Array
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:335:      ? embeddingRaw
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:336:      : Float32Array.from(embeddingRaw as number[]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:338:    const result: HyDEResult = { pseudoDocument, embedding };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:353: * Run a vector-only search using the HyDE pseudo-document embedding.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:361: * @param embedding - The pseudo-document embedding.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:366:export function vectorOnly(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:367:  embedding: Float32Array,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:371:  return vectorIndex.vectorSearch(embedding, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:412:    const candidates = vectorOnly(hydeResult.embedding, limit, specFolder);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:4:// SCHEMA_VERSION is now canonical in vector-index-schema.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:8:/** Supported embedding input shapes for vector search and mutation operations. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:11:/** Stable error codes emitted by vector-index modules. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:23:/** Structured error used by vector-index query, mutation, and store helpers. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:47:  embedding_model?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:48:  embedding_generated_at?: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:49:  embedding_status?: string;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:71:  keywordScore?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:75:/** Represents a vector-search memory row shared by query and store helpers. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:88:  keyword_score?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:107:  embedding: EmbeddingInput;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:123:  embedding?: EmbeddingInput;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:132:/** Controls vector search filtering and ranking behavior. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:168: * Converts an embedding vector into a binary buffer for sqlite-vec storage.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:169: * @param embedding - The embedding values to serialize.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:170: * @returns A binary buffer representing the embedding.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:172:export function to_embedding_buffer(embedding: EmbeddingInput): Buffer {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:173:  if (embedding instanceof Float32Array) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:174:    return Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:176:  return Buffer.from(new Float32Array(embedding).buffer);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:232:// ValidateEmbeddingDimension are exported from vector-index-store.ts (canonical)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts:9:   Common English words that carry no semantic signal.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts:40:   Generic programming keywords that appear in nearly all code.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:16:  rrfScore?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:124:  if (typeof result.rrfScore === 'number' && Number.isFinite(result.rrfScore)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:125:    return result.rrfScore;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:174:          rrfScore: finalScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:102:  // Tokenize the query into lowercase keywords.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:151: * @param rrfScores - Array of Reciprocal Rank Fusion scores (any length).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:154:export function detectEvidenceGap(rrfScores: number[]): TRMResult {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:155:  if (rrfScores.length === 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:159:  const finiteScores = rrfScores.filter((score) => Number.isFinite(score));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:40:  /** N2a cap for RRF fusion overflow prevention. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:42:  /** N2b cap for RRF fusion overflow prevention. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:118:  /** Current N2a fusion score. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:120:  /** Current N2b fusion score. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:5:// Semantic query expansion using embedding similarity.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:11:// Rather than semantic broadening.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:20:import * as vectorIndex from './vector-index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:30: * Result produced by embedding-based query expansion.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:33: * - `expanded`      — Array of semantically related terms extracted from
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:65:/** Number of semantically similar memories to mine for expansion terms. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:74:/** Stop-words that carry no semantic signal for expansion. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:156: * Expand a query using embedding-based similarity to find semantically
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:164: *   3. Embedding vector is invalid (zero-length or non-finite values).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:168: *   a. Run a vector similarity search using the provided embedding.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:174: * @param embedding - Pre-computed query embedding (Float32Array from the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:175: *                    embeddings provider). Must not be empty.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:183:  embedding: Float32Array,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:201:  // -- Guard 3: Valid embedding -----------------------------------------------
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:202:  if (!embedding || embedding.length === 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:203:    console.warn('[embedding-expansion] Received empty embedding — skipping expansion');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:212:    // Use the query embedding to find semantically similar memories.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:215:    const similarMemories = vectorIndex.vectorSearch(embedding, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:267:    // FTS and embedding re-encoding without requiring a separator token.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:277:    console.warn(`[embedding-expansion] Expansion failed, using original query: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:287: * Synchronous predicate that returns true when R12 embedding expansion
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:298: * @returns True when embedding expansion should be applied.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/encoding-intent.ts:9:// Stored in the `encoding_intent` column alongside the embedding
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/encoding-intent.ts:59:  // Import/require/export statements and programming keywords
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:19:  keywords: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:131: * T016: Lightweight deterministic embedding centroid classifier.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:133: * The model uses hashed bag-of-words embeddings so centroids can be built
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:212: * Score a query against an intent's keyword list, returning normalized score and matched keywords.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:216: * @returns Object with normalized score and array of matched keywords
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:220:  const keywords = INTENT_KEYWORDS[intent];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:224:  for (const keyword of keywords) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:225:    if (lower.includes(keyword)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:227:      matches.push(keyword);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:231:  // P3-12: Require at least 2 keyword matches for a meaningful keyword score.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:232:  // A single generic keyword match produces a heavily discounted score.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:237:  // Normalize by keyword count
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:239:    score: keywords.length > 0 ? score / keywords.length : 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:279: * Compute a deterministic normalized embedding for text.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:282: * @returns Normalized Float32Array embedding vector
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:295: * Build one centroid vector per intent from seed phrases and keywords.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:297: * @returns Map of intent types to their centroid embedding vectors
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:332: * L2-normalize a vector in place.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:334: * @param vec - Float32Array vector to normalize
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:335: * @returns The same vector, normalized to unit length
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:351: * Dot product similarity for normalized vectors.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:353: * @param a - First vector
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:354: * @param b - Second vector
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:355: * @returns Dot product (cosine similarity for unit vectors)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:367: * Score query-to-intent using centroid embeddings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:399: * Classify a query string into one of 7 intent types with confidence and keyword evidence.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:402: * @returns Intent result with type, confidence, per-intent scores, and matched keywords
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:410:      keywords: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:428:    const { score: keywordScore, matches } = calculateKeywordScore(query, intent);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:432:    let combined = (centroidScore * 0.5) + (keywordScore * 0.35) + (patternScore * 0.15);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:468:  // This prevents weak single-keyword matches from dominating classification.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:474:      keywords: [...new Set(allKeywords)],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:483:    keywords: [...new Set(allKeywords)],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:492: * @returns Intent result with type, confidence, scores, and keywords
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:26: * Compute cosine similarity between two vectors.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:83: * Generate summary, compute embedding, store in memory_summaries.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:87: * 3. Call embeddingFn(summary) to get embedding
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:89: * 5. Store embedding as Buffer (Float32Array -> Buffer)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:95: * @param embeddingFn - Async function to compute embedding vector
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:102:  embeddingFn: (text: string) => Promise<Float32Array | null>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:115:    const embedding = await embeddingFn(summary);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:116:    const embeddingBlob = embedding ? float32ToBuffer(embedding) : null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:122:        (memory_id, summary_text, summary_embedding, key_sentences, created_at, updated_at)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:130:      embeddingBlob,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:148: * Vector search on summary embeddings — parallel channel for stage1.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:150: * 1. SELECT id, memory_id, summary_embedding FROM memory_summaries
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:151: *    WHERE summary_embedding IS NOT NULL
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:152: * 2. Compute cosine similarity between query embedding and each summary embedding
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:157: * @param queryEmbedding - Query vector to compare against stored summaries
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:171:      SELECT id, memory_id, summary_embedding
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:173:      WHERE summary_embedding IS NOT NULL
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:175:    `).all(fetchCap) as Array<{ id: number; memory_id: number; summary_embedding: Buffer }>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:180:      const storedEmbedding = bufferToFloat32(row.summary_embedding);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:195:      '[memory-summaries] Failed to query summary embeddings:',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:215:      WHERE embedding_status = 'success'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:16:// Fields (score, rrfScore, similarity, intentAdjustedScore). It only
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:62: * double-counting in the fusion pipeline.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:129:  // Partial signal: content mentions validation-related keywords.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:7:import { sanitizeFTS5Query } from './bm25-index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:54:/** Runtime fusion weight for the degree channel. Keep aligned with the boost cap. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:61:let ftsTableAvailabilityPerDb = new WeakMap<Database.Database, boolean>();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:70:  const cached = ftsTableAvailabilityPerDb.get(database);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:77:      `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:80:    ftsTableAvailabilityPerDb.set(database, available);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:83:    ftsTableAvailabilityPerDb.set(database, false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:91: * Uses FTS5 full-text search (memory_fts table) instead of naive LIKE matching.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:150: * FTS5-backed causal edge query. Finds memory IDs via the memory_fts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:165:  // 1) Materialize matched memory rowids once (no OR join against memory_fts)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:167:  // 3) Collapse duplicate edge hits in SQL (MAX fts_score per edge)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:172:        -bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) AS fts_score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:173:      FROM memory_fts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:174:      WHERE memory_fts MATCH ?
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:175:      ORDER BY fts_score DESC
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:179:      SELECT ce.id, ce.source_id, ce.target_id, ce.relation, ce.strength, mm.fts_score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:183:      SELECT ce.id, ce.source_id, ce.target_id, ce.relation, ce.strength, mm.fts_score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:194:        MAX(fts_score) AS fts_score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:198:    SELECT id, source_id, target_id, relation, strength, fts_score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:200:    ORDER BY (strength * fts_score) DESC
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:206:  ) as Array<CausalEdgeRow & { fts_score: number }>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:209:  // Numeric IDs matching memory_index.id (INTEGER column) in the hybrid search
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:216:    const ftsScore = typeof row.fts_score === 'number' && Number.isFinite(row.fts_score)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:217:      ? row.fts_score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:219:    const score = edgeStrength * ftsScore;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:228:        ftsScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:243:        ftsScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:634:  ftsTableAvailabilityPerDb = new WeakMap<Database.Database, boolean>();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:640:  ftsTableAvailabilityPerDb.delete(database);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:15:// Structured IDs follow the pattern: TYPE-keywords-NNN
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:20:// Integration point: called at the end of Stage 2 fusion, after
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:39:   * The semantic type extracted from the anchor ID.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:40:   * For structured IDs (TYPE-keywords-NNN) this is the leading segment in
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:69: * Derive the semantic type from an anchor ID.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:102:  'embedding': 'embedding',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:103:  'embeddings': 'embedding',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:104:  'vector': 'embedding',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:105:  'vectors': 'embedding',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:106:  'representation': 'embedding',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:142:  'semantic': 'search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:143:  'semantics': 'search',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:171: * nounPhrases('How does vector search indexing work?');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:172: * // ['vector', 'search', 'indexing', 'work']
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:5:// Split from vector-index-store.ts — contains ALL mutation functions:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:8:import * as embeddingsProvider from '../providers/embeddings.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:14:import * as bm25Index from './bm25-index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:17:} from './vector-index-aliases.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:20:  to_embedding_buffer,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:23:} from './vector-index-types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:26:  get_embedding_dim,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:31:} from './vector-index-store.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:35:} from './vector-index-types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:128:// contract adopts appendOnly and canonicalFilePath semantics.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:132:type IndexMemoryDeferredParams = Omit<IndexMemoryParams, 'embedding'> & {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:140: * Indexes a memory with an embedding payload.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:143: * @throws {VectorIndexError} When embedding validation fails or the mutation cannot be applied.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:149: *   embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:165:    embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:175:  if (!embedding) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:179:  const expected_dim = get_embedding_dim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:180:  if (embedding.length !== expected_dim) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:181:    console.warn(`[vector-index] Embedding dimension mismatch: expected ${expected_dim}, got ${embedding.length}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:183:      `Embedding must be ${expected_dim} dimensions, got ${embedding.length}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:190:  const embedding_buffer = to_embedding_buffer(embedding);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:204:      embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:218:    const embedding_status = sqlite_vec ? 'success' : 'pending';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:223:        importance_weight, created_at, updated_at, embedding_model,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:224:        embedding_generated_at, embedding_status, encoding_intent, document_type, spec_level,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:229:      importanceWeight, now, now, embeddingsProvider.getModelName(), now, embedding_status,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:242:        INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:243:      `).run(row_id, embedding_buffer);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:258: * Indexes a memory record without storing an embedding yet.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:301:            embedding_status = 'pending',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:322:        importance_weight, created_at, updated_at, embedding_status,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:334:    logger.info(`Deferred indexing: Memory ${Number(row_id)} saved without embedding (BM25/FTS5 searchable)`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:343: * Updates stored memory metadata and embeddings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:346: * @throws {VectorIndexError} When embedding validation fails or the mutation transaction cannot complete.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:349: * const id = update_memory({ id: 42, title: 'Updated title', embedding });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:362:    embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:433:    if (embedding) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:434:      updates.push('embedding_model = ?');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:435:      updates.push('embedding_generated_at = ?');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:436:      // H1 FIX: Set 'pending' until vector write is confirmed
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:437:      updates.push('embedding_status = ?');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:438:      values.push(embeddingsProvider.getModelName(), now, 'pending');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:453:    if (embedding && sqlite_vec) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:454:      const expected_dim = get_embedding_dim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:455:      if (embedding.length !== expected_dim) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:456:        console.warn(`[vector-index] Embedding dimension mismatch in update: expected ${expected_dim}, got ${embedding.length}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:458:          `Embedding must be ${expected_dim} dimensions, got ${embedding.length}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:463:      const embedding_buffer = to_embedding_buffer(embedding);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:466:        INSERT INTO vec_memories (rowid, embedding) VALUES (?, ?)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:467:      `).run(BigInt(id), embedding_buffer);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:468:      // H1 FIX: Mark success only after vector write confirmed
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:469:      database.prepare('UPDATE memory_index SET embedding_status = ? WHERE id = ?').run('success', id);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:551:      if (bm25Index.isBm25Enabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:552:        bm25Index.getIndex().removeDocument(String(id));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:651:            console.warn(`[VectorIndex] Failed to delete vector for memory ${id}: ${get_error_message(vec_error)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:672:        console.warn(`[vector-index] Failed to delete memory ${id}: ${get_error_message(e)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:699:        if (bm25Index.isBm25Enabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:700:          const bm25 = bm25Index.getIndex();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:702:            bm25.removeDocument(String(id));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:710:    console.warn(`[vector-index] delete_memories transaction error: ${get_error_message(e)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:720: * Updates the embedding status for a memory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:722: * @param status - The new embedding status.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:725:export function update_embedding_status(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:732:    console.warn(`[vector-index] Invalid embedding status: ${status}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:739:      SET embedding_status = ?, updated_at = datetime('now')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:745:    console.warn(`[vector-index] Failed to update embedding status for ${id}: ${get_error_message(error)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:762:    console.warn(`[vector-index] Invalid confidence value: ${confidence}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:775:    console.warn(`[vector-index] Failed to update confidence for ${memory_id}: ${get_error_message(error)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:787:export { update_embedding_status as updateEmbeddingStatus };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:6:// TypeScript port of the vector index implementation.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:23:import { getStartupEmbeddingDimension } from '@spec-kit/shared/embeddings/factory';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:26:import { IVectorStore } from '../interfaces/vector-store.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:35:} from './vector-index-types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:39:} from './vector-index-schema.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:46:} from './vector-index-types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:82:/** Loaded search weight configuration for vector-index ranking (lazy-loaded). */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:100:let _cached_queries: Awaited<typeof import('./vector-index-queries.js')> | null = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:101:let _cached_mutations: Awaited<typeof import('./vector-index-mutations.js')> | null = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:102:let _cached_aliases: Awaited<typeof import('./vector-index-aliases.js')> | null = null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:105:  return _cached_queries ??= await import('./vector-index-queries.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:109:  return _cached_mutations ??= await import('./vector-index-mutations.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:113:  return _cached_aliases ??= await import('./vector-index-aliases.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:120:/** Default embedding dimension used by the vector index. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:124: * Gets the active embedding dimension for the current provider.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:125: * @returns The embedding dimension.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:127:export function get_embedding_dim(): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:132: * Waits for the embedding provider to report a stable dimension.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:134: * @returns A promise that resolves to the confirmed embedding dimension.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:136:export async function get_confirmed_embedding_dimension(timeout_ms = 5000): Promise<number> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:139:    const dim = get_embedding_dim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:145:  console.warn('[vector-index] Using default dimension 768 after timeout');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:164:function get_existing_embedding_dimension(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:186:      SELECT value FROM vec_metadata WHERE key = 'embedding_dim'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:222:    reason: 'No stored vector dimension found for existing schema',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:226:function validate_embedding_dimension_for_connection(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:235:    const current_dim = get_embedding_dim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:236:    const existing = get_existing_embedding_dimension(database);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:248:      const warning = `EMBEDDING DIMENSION MISMATCH: Existing database stores ${existing.stored_dim}-dim vectors (${source_label}), ` +
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:249:        `but the active embedding configuration resolves to ${current_dim}. Refusing to bootstrap because vector search would fail. ` +
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:252:      console.error(`[vector-index] WARNING: ${warning}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:258:    console.warn('[vector-index] Dimension validation error:', get_error_message(e));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:259:    return { valid: true, stored: null, current: get_embedding_dim(), reason: get_error_message(e) };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:264: * Validates that stored vector dimensions match the provider.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:267:export function validate_embedding_dimension(): { valid: boolean; stored: number | null; current: number | null; reason?: string; warning?: string } {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:268:  return validate_embedding_dimension_for_connection(db, sqlite_vec_available_flag);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:280:/** Default path for the vector-index database file. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:327:      console.warn(`[vector-index] Could not read file ${valid_path}: ${get_error_message(err)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:360:        console.warn('[vector-index] Blocked potential prototype pollution in JSON');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:367:    console.warn(`[vector-index] JSON parse error: ${get_error_message(err)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:413:        console.warn(`[vector-index] Database connection listener failed: ${get_error_message(error)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:425:    console.warn(`[vector-index] Could not set permissions on ${target_path}: ${get_error_message(err)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:499:    console.warn('[vector-index] Cache validation error:', get_error_message(e));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:564:        SUM(CASE WHEN embedding_status = 'success' THEN 1 ELSE 0 END) as complete,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:565:        SUM(CASE WHEN embedding_status = 'pending' THEN 1 ELSE 0 END) as pending,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:566:        SUM(CASE WHEN embedding_status = 'failed' THEN 1 ELSE 0 END) as failed
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:636:        AND m.embedding_status = 'success'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:728:    console.warn(`[vector-index] interference score refresh failed for '${specFolder}': ${get_error_message(error)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:737: * Initializes the vector-index database connection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:773:      console.error('[vector-index] FATAL: better-sqlite3 native module failed to load');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:774:      console.error(`[vector-index] ${errMsg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:775:      console.error(`[vector-index] Running: Node ${process.version} (MODULE_VERSION ${process.versions.modules})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:780:          console.error(`[vector-index] Marker recorded: Node ${marker.nodeVersion} (MODULE_VERSION ${marker.moduleVersion})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:785:      console.error('[vector-index] This usually means Node.js was updated without rebuilding native modules.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:786:      console.error('[vector-index] Fix: Run \'bash scripts/setup/rebuild-native-modules.sh\' from the spec-kit root');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:787:      console.error('[vector-index] Or manually: npm rebuild better-sqlite3');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:797:    console.warn(`[vector-index] sqlite-vec extension not available: ${get_error_message(vec_error)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:798:    console.warn('[vector-index] Falling back to anchor-only mode (no vector search)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:799:    console.warn('[vector-index] Install sqlite-vec: brew install sqlite-vec (macOS)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:810:  const preBootstrapDimCheck = validate_embedding_dimension_for_connection(new_db, vec_available);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:814:    console.error(`[vector-index] FATAL: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:819:  create_schema(new_db, { sqlite_vec_available: vec_available, get_embedding_dim });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:822:  const dimCheck = validate_embedding_dimension_for_connection(new_db, vec_available);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:825:    console.error(`[vector-index] FATAL: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:843: * Closes the shared vector-index database connection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:860: * Gets the active vector-index database path.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:868: * Gets the shared vector-index database connection.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:875:// Check if vector search is available (sqlite-vec loaded)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:877: * Reports whether sqlite-vec vector search is available.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:878: * @returns True when vector search is available.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:880:export function is_vector_search_available(): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:888:/** Implements the vector-store interface on top of SQLite. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:911:   * Searches indexed memories by embedding similarity.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:912:   * @param embedding - The query embedding to search with.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:916:   * @throws {VectorIndexError} When the embedding dimension is invalid or the store cannot initialize.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:922:  async search(embedding: EmbeddingInput, topK: number, options: VectorSearchOptions = {}): Promise<MemoryRow[]> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:926:    const expected_dim = get_embedding_dim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:927:    if (!embedding || embedding.length !== expected_dim) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:929:        `Invalid embedding dimension: expected ${expected_dim}, got ${embedding?.length}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:945:    const { vector_search } = await getQueriesModule();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:946:    return vector_search(embedding, search_options, database);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:950:   * Inserts or updates a memory row and its embedding metadata.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:952:   * @param embedding - The embedding to persist.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:955:   * @throws {VectorIndexError} When embedding validation fails or required metadata is missing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:958:   * const id = await store.upsert('ignored', embedding, { spec_folder: 'specs/001-demo', file_path: 'spec.md' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:961:  async upsert(_id: string, embedding: EmbeddingInput, metadata: JsonObject): Promise<number> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:965:    const expected_dim = get_embedding_dim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:966:    if (!embedding || embedding.length !== expected_dim) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:968:        `Embedding dimension mismatch: expected ${expected_dim}, got ${embedding?.length}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:994:      embedding: embedding
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1054:    return get_embedding_dim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1079:    embedding: string,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1084:    const { vector_search_enriched } = await getQueriesModule();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1085:    return vector_search_enriched(embedding, undefined, options, database);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1088:  async enhancedSearch(embedding: string, options: EnhancedSearchOptions = {}): Promise<EnrichedSearchResult[]> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1092:    return enhanced_search(embedding, undefined, options, database);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1114:    cleaned?: { vectors: number; chunks: number };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1132:export { get_confirmed_embedding_dimension as getConfirmedEmbeddingDimension };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1133:export { get_embedding_dim as getEmbeddingDim };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1134:export { validate_embedding_dimension as validateEmbeddingDimension };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1137:export { is_vector_search_available as isVectorSearchAvailable };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:5:// Split from vector-index-store.ts — contains LRUCache, query caching,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:13:} from './vector-index-types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:17:} from './vector-index-store.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:19:  vector_search,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:20:  vector_search_enriched,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:23:  generate_query_embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:24:} from './vector-index-queries.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:199:// Cached version of vector_search_enriched with LRU cache
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:219:  const results = await vector_search_enriched(query, limit, options);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:276:    console.warn(`[vector-index] learn_from_selection query error: ${get_error_message(e)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:318:    console.warn(`[vector-index] learn_from_selection update error: ${get_error_message(e)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:340:    const embedding = await generate_query_embedding(content.substring(0, 1000));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:341:    if (!embedding) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:342:      console.warn(`[vector-index] Could not generate embedding for memory ${new_memory_id}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:346:    const similar = vector_search(embedding, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:365:    console.warn(`[vector-index] Failed to link related memories for ${new_memory_id}: ${get_error_message(error)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:389:    console.warn(`[vector-index] Failed to record access for memory ${memory_id}: ${get_error_message(error)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:415:  const results = await vector_search_enriched(query, fetch_limit, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:429:    console.warn(`[vector-index] Enhanced search took ${elapsed}ms (target <600ms)`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:206: * The "score" used for tie-breaking is resolved from `score`, `rrfScore`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:212:export function mergeByFacetCoverage<T extends { id: number; score?: number; rrfScore?: number; similarity?: number }>(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:266:function resolveItemScore(item: { score?: number; rrfScore?: number; similarity?: number }): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:269:  if (typeof item.rrfScore === 'number' && Number.isFinite(item.rrfScore))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:270:    return Math.max(0, Math.min(1, item.rrfScore));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:25:/** Common English stop words for semantic complexity heuristic */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:406: * Compute keyword overlap score between a query and a target string.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:414:function keywordOverlap(queryTokens: string[], target: string): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:435: *   - Question match (best keyword overlap across surrogateQuestions): weight 0.4
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:436: *   - Summary match (keyword overlap): weight 0.2
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:437: *   - Heading match (best keyword overlap across headings): weight 0.1
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:463:    const overlap = keywordOverlap(queryTokens, alias);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:475:    const overlap = keywordOverlap(queryTokens, question);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:490:    summaryScore = keywordOverlap(queryTokens, surrogates.summary);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:499:    const overlap = keywordOverlap(queryTokens, heading);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:537:  keywordOverlap,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:6:// - vector-index-types.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:7:// - vector-index-schema.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:8:// - vector-index-mutations.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:9:// - vector-index-store.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:10:// - vector-index-queries.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:11:// - vector-index-aliases.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:14:export * from './vector-index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:64: * Analyse a post-fusion top-k result set and, when the feature flag is
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:77: * @param topK              - Ordered top-k results from RRF fusion.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:23:/** Channel names matching SOURCE_TYPES in rrf-fusion.ts */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:24:type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'degree';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:41:const ALL_CHANNELS: readonly ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'] as const;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:47:const FALLBACK_CHANNELS: readonly ChannelName[] = ['vector', 'fts'] as const;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:64: * - simple:   2 channels (vector + fts) — fastest path
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:65: * - moderate: 3 channels (vector + fts + bm25) — balanced
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:69:  simple: ['vector', 'fts'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:70:  moderate: ['vector', 'fts', 'bm25'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:71:  complex: ['vector', 'fts', 'bm25', 'graph', 'degree'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:81: * fallback channels (vector, fts) until the minimum is met.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:156:    ? enforceMinimumChannels([...channels, 'bm25'])
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:103:  /** RRF fusion score (0–1). */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:104:  rrfScore?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:7:// Parses folder paths like "system-spec-kit/140-hybrid-rag/006-sprint-5"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts:75: * Parses folder paths like "system-spec-kit/140-hybrid-rag/006-sprint-5"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:296: * Compute keyword overlap between goal and content.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:297: * Returns a score between 0 and 1 based on fraction of goal keywords found in content.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:325: * Applies a boost factor of up to GOAL_BOOST_MAX (1.2x) based on keyword overlap.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts:46:  embedding: ['vector', 'representation'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts:55:  fusion: ['merge', 'combine'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts:7:// searches community summaries by keyword matching and returns
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/community-search.ts:91: * Search community summaries by keyword matching.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-types.ts:5: * Function signature for graph-based lexical search helpers.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:7:// Use inside the hybrid-search pipeline after RRF/RSF fusion.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:80: * @param fusedResults      - Post-fusion results, ordered by score descending.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:16: * and extracted keywords for lightweight matching.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:21:  keywords: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:339: * Extract significant keywords from a description string.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:346: * @param description - A description string to extract keywords from.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:347: * @returns Deduplicated array of significant lowercase keywords.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:358:  const keywords: string[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:366:    keywords.push(cleaned);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:369:  return keywords;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:378: * simple keyword-overlap scoring.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:383: *   in its keywords or description (case-insensitive)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:387: * This is a lightweight pre-filter, NOT a replacement for vector search.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:413:    const keywordSet = new Set(folder.keywords);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:417:      if (keywordSet.has(term)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:484:            keywords: perFolder.keywords,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:520:            keywords: perFolder.keywords,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:593:  const keywords = extractKeywords(description);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:602:    keywords,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:659:  const keywords = extractKeywords(description);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:681:    keywords,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:715:      !Array.isArray(parsed.keywords) ||
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:716:      !parsed.keywords.every((e: unknown) => typeof e === 'string') ||
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:16:   * Higher = better lexical match. Not directly comparable to vector similarity
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:51: * These weights are consumed by the FTS5 path in sqlite-fts.ts,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:55: * trigger_phrases:  5.0 — curated keywords next most important
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:323:    const queryTokens = normalizeLexicalQueryTokens(query).bm25;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:415:      console.warn(`[bm25-index] Failed to sync BM25 rows: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:465:      console.warn(`[bm25-index] Failed to schedule BM25 warmup: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:530: * @returns Sanitized query tokens safe to reuse for lexical search paths.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:533: * sanitizeQueryTokens('title:memory AND vector');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:534: * // ['title', 'memory', 'vector']
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:561:  fts: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:562:  bm25: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:573:    fts: [...sharedTokens, ...phraseToken],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:574:    bm25: sharedTokens
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:4:// Split from vector-index-store.ts — contains ALL schema creation,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:15:import { initEmbeddingCache } from '../cache/embedding-cache.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:18:} from './vector-index-types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:125:    embedding_status,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:172:  const tableSql = getTableSql(database, 'embedding_cache');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:181:  if (!hasTable(database, 'embedding_cache')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:190:  logger.info('Migrating embedding_cache primary key to include dimensions');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:192:    ALTER TABLE embedding_cache RENAME TO embedding_cache_legacy_dimensions;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:196:    INSERT OR REPLACE INTO embedding_cache (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:199:      embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:207:      embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:211:    FROM embedding_cache_legacy_dimensions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:213:  database.exec('DROP TABLE embedding_cache_legacy_dimensions');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:408:// Added 'partial' embedding_status for deferred indexing (REQ-031, T096)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:426:/** Current schema version for vector-index migrations. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:519:              'procedural', 'semantic', 'autobiographical', 'meta-cognitive'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:542:              'frontmatter_explicit', 'importance_tier', 'file_path', 'keywords', 'default', 'manual'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:581:      // V6 -> v7: Add 'partial' embedding_status for deferred indexing (REQ-031, T096)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:584:          CREATE INDEX IF NOT EXISTS idx_embedding_pending
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:585:          ON memory_index(embedding_status)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:586:          WHERE embedding_status IN ('pending', 'partial', 'retry')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:588:        logger.info('Migration v7: Created idx_embedding_pending partial index');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:590:        console.warn('[VectorIndex] Migration v7 warning (idx_embedding_pending):', get_error_message(e));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:595:          CREATE INDEX IF NOT EXISTS idx_fts_fallback
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:596:          ON memory_index(spec_folder, embedding_status, importance_tier)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:597:          WHERE embedding_status IN ('pending', 'partial')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:599:        logger.info('Migration v7: Created idx_fts_fallback index for deferred indexing');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:601:        console.warn('[VectorIndex] Migration v7 warning (idx_fts_fallback):', get_error_message(e));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:747:        database.exec('DROP TRIGGER IF EXISTS memory_fts_insert');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:748:        database.exec('DROP TRIGGER IF EXISTS memory_fts_update');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:749:        database.exec('DROP TRIGGER IF EXISTS memory_fts_delete');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:751:        database.exec('DROP TABLE IF EXISTS memory_fts');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:753:          CREATE VIRTUAL TABLE memory_fts USING fts5(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:760:          CREATE TRIGGER memory_fts_insert AFTER INSERT ON memory_index BEGIN
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:761:            INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:766:          CREATE TRIGGER memory_fts_update AFTER UPDATE ON memory_index BEGIN
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:767:            INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:769:            INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:774:          CREATE TRIGGER memory_fts_delete AFTER DELETE ON memory_index BEGIN
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:775:            INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:823:          database.exec("INSERT INTO memory_fts(memory_fts) VALUES('rebuild')");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1011:            summary_embedding BLOB,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1136:       ON memory_index(embedding_status, id)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1137:       WHERE embedding_status = 'success'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1688:      console.warn('[vector-index] Migration: Added confidence column');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1700:      console.warn('[vector-index] Migration: Added validation_count column');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1712:      console.warn('[vector-index] Migration: Added importance_tier column');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1721:      console.warn('[vector-index] Migration: Created idx_importance_tier index');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1732:      console.warn('[vector-index] Migration: Added context_type column');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1744:      console.warn('[vector-index] Migration: Added content_hash column');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1756:      console.warn('[vector-index] Migration: Added channel column');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1768:      console.warn('[vector-index] Migration: Added session_id column');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1780:      console.warn('[vector-index] Migration: Added base_importance column');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1792:      console.warn('[vector-index] Migration: Added decay_half_life_days column');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1804:      console.warn('[vector-index] Migration: Added is_pinned column');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1816:      console.warn('[vector-index] Migration: Added last_accessed column');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1828:      console.warn('[vector-index] Migration: Added expires_at column');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1840:      console.warn('[vector-index] Migration: Added related_memories column');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1852:      console.warn('[vector-index] Migration: Added stability column (FSRS)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1864:      console.warn('[vector-index] Migration: Added difficulty column (FSRS)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1876:      console.warn('[vector-index] Migration: Added last_review column (FSRS)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1888:      console.warn('[vector-index] Migration: Added review_count column (FSRS)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1910:      console.warn('[vector-index] Migration: Added canonical_file_path column');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1929:    console.warn('[vector-index] Canonical path index warning:', get_error_message(e));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1996: * Creates common indexes used by vector-index queries.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2005:    console.warn('[vector-index] Failed to create index', {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2022:    console.warn('[vector-index] Failed to create canonical path indexes', {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2039:    console.warn('[vector-index] Failed to create index', {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2050:    console.warn('[vector-index] Failed to create index', {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2061:    console.warn('[vector-index] Failed to create index', {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2071:      ON memory_index(embedding_status, id)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2072:      WHERE embedding_status = 'success'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2079:    console.warn('[vector-index] Failed to create idx_trigger_cache_source', {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2090:    console.warn('[vector-index] Failed to create idx_spec_folder_created_at', {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2103:      console.warn('[vector-index] Failed to create idx_history_timestamp:', get_error_message(err));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2259: * Creates or upgrades the vector-index schema.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2266:  options: { sqlite_vec_available: boolean; get_embedding_dim: () => number }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2268:  const { sqlite_vec_available, get_embedding_dim } = options;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2291:    // the rollout (REQ-S2-001) — embedding cache table must exist before any
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2310:      embedding_model TEXT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2311:      embedding_generated_at TEXT,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2312:      embedding_status TEXT DEFAULT 'pending' CHECK(embedding_status IN ('pending', 'success', 'failed', 'retry', 'partial')),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2363:    const embedding_dim = get_embedding_dim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2366:        embedding FLOAT[${embedding_dim}]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2377:      INSERT OR REPLACE INTO vec_metadata (key, value) VALUES ('embedding_dim', ?)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2378:    `).run(String(embedding_dim));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2379:    logger.info(`Created vec_memories table with dimension ${embedding_dim}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2384:    CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2392:    CREATE TRIGGER IF NOT EXISTS memory_fts_insert AFTER INSERT ON memory_index BEGIN
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2393:      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2399:    CREATE TRIGGER IF NOT EXISTS memory_fts_update AFTER UPDATE ON memory_index BEGIN
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2400:      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2402:      INSERT INTO memory_fts(rowid, title, trigger_phrases, file_path, content_text)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2408:    CREATE TRIGGER IF NOT EXISTS memory_fts_delete AFTER DELETE ON memory_index BEGIN
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2409:      INSERT INTO memory_fts(memory_fts, rowid, title, trigger_phrases, file_path, content_text)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2420:  // the rollout (REQ-S2-001) — create embedding_cache table
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2428:    CREATE INDEX idx_embedding_status ON memory_index(embedding_status);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2429:    CREATE INDEX idx_retry_eligible ON memory_index(embedding_status, retry_count, last_retry_at)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2440:      ON memory_index(embedding_status, id)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2441:      WHERE embedding_status = 'success'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2457:      embedding_status,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2479:  console.warn('[vector-index] Schema created successfully');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:113: * or a leading imperative keyword followed by a noun phrase or condition.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:145: *   - the condition clause introduced by a condition keyword (conditionClause)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:155:  // Find the earliest imperative keyword present in this line
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:179:      // Clause starts after the condition keyword
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:198: *    imperative keywords (must, always, never, should, …).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:9:// Seeds are retrieved via a lightweight keyword-only search using
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:10:// BM25/FTS5 (no embedding call) to ground the LLM prompt in real
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:24:import { fts5Bm25Search } from './sqlite-fts.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:91: * Uses FTS5 / BM25 keyword search only — no embedding call — to keep
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:110:    const rawResults = fts5Bm25Search(db, query, { limit });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:8:// Stage 2 fusion. Two tiers:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:17://     "summary": "Ranked first because semantic, reranker, decision-anchor agreed",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:18://     "topSignals": ["semantic_match", "anchor:decisions"],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:19://     "channelContribution": { "vector": 0.44, "fts": 0.12, "graph": 0.06 }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:32:  | 'semantic_match'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:33:  | 'lexical_match'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:45:  vector: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:46:  fts: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:95:    signals.push('semantic_match');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:103:  if (channelAttribution.includes('fts') || channelAttribution.includes('bm25')) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:104:    signals.push('lexical_match');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:173: * Prioritises: semantic/lexical first, then boosts, then meta.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:204:    if (signal === 'semantic_match') return 'semantic similarity';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:205:    if (signal === 'lexical_match') return 'keyword match';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:232: * distribute the effective score across vector, fts, and graph channels.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:240:  const vectorScore = typeof row.vectorScore === 'number' && Number.isFinite(row.vectorScore)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:241:    ? Math.max(0, Math.min(1, row.vectorScore))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:243:  const ftsScore = typeof row.ftsScore === 'number' && Number.isFinite(row.ftsScore)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:244:    ? Math.max(0, Math.min(1, row.ftsScore))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:254:  if (vectorScore !== null && ftsScore !== null) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:258:      vector: Math.round(vectorScore * 100) / 100,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:259:      fts: Math.round(ftsScore * 100) / 100,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:268:  const hasFTS = channelAttribution.includes('fts') || channelAttribution.includes('bm25');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:275:      vector: Math.round(remaining * 0.75 * 100) / 100,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:276:      fts: Math.round(remaining * 0.25 * 100) / 100,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:283:      vector: Math.round(effectiveScore * 0.78 * 100) / 100,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:284:      fts: Math.round(effectiveScore * 0.22 * 100) / 100,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:292:      vector: Math.round((effectiveScore - graphShare) * 100) / 100,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:293:      fts: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:299:  return { vector: Math.round(effectiveScore * 100) / 100, fts: 0, graph: 0 };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:150: * Channel minimum-representation promotion after fusion.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:176: * R12: Query expansion for embedding-based retrieval.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:197: * Records intent metadata (document, code, structured_data) alongside embeddings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:259: * Temporal contiguity boost on raw Stage 1 vector results.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:589: * Phase B T016: Query concept expansion for hybrid search.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:23:/** Per-hop boost cap. 0.05 keeps causal nudge subtle relative to semantic scores (~0.5–1.0). */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:103:  rrfScore?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:232: * Intent priority lists may include upper-case semantic labels (e.g. 'CORRECTION').
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:356: * Resolve the primary numeric score from a result, checking score, rrfScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:361:  if (typeof result.rrfScore === 'number' && Number.isFinite(result.rrfScore)) return result.rrfScore;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:376:    rrfScore: score,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:639:      rrfScore: score,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:728:    // Find seed memory IDs whose titles contain matched concept keywords
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:9:  to_embedding_buffer,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:13:} from './vector-index-types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:20:} from './vector-index-types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:38:} from './vector-index-schema.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:46:  update_embedding_status,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:56:} from './vector-index-mutations.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:63:  vector_search,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:70:  generate_query_embedding,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:71:  keyword_search,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:72:  vector_search_enriched,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:74:  multi_concept_keyword_search,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:88:  vectorSearch,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:96:  keywordSearch,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:97:  vectorSearchEnriched,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:108:} from './vector-index-queries.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:126:} from './vector-index-aliases.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:151:  get_embedding_dim,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:152:  get_confirmed_embedding_dimension,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:153:  validate_embedding_dimension,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:154:  is_vector_search_available,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:161:} from './vector-index-store.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:165:  isVectorSearchAvailable as is_vector_search_available_alias,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:166:} from './vector-index-store.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:3:description: "5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval with Reciprocal Rank Fusion (RRF) and Adaptive Fusion."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:6:  - "hybrid search"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:7:  - "vector search"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:12:> 5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval, fused with Reciprocal Rank Fusion (RRF) and Adaptive Fusion.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:27:- [FTS CAPABILITY CASCADE FLOOR](#fts-capability-cascade-floor)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:39:The search subsystem provides production-grade hybrid search capabilities with multiple retrieval methods fused via RRF scoring. It handles query expansion, intent classification, typo tolerance and optional cross-encoder reranking.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:42:- **5-Channel Hybrid Search**: Vector (semantic) + BM25/FTS5 (lexical) + Graph (relationship-based) + Graph Structure (structural)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:45:- **Query Enhancement**: Fuzzy matching (Levenshtein) + acronym expansions (via hybrid-search.ts inline logic)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:75:`vector-index.ts` is the primary typed export surface for the vector index and re-exports the split schema, query, mutation, store and alias modules. `vector-index-impl.ts` is now a 14-line backward-compatibility shim that simply re-exports `vector-index.ts` for older import paths.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:93:| Vector | `vector-index.ts` | Semantic similarity via sqlite-vec through the split vector-index modules |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:94:| BM25 | `bm25-index.ts` | Pure TypeScript keyword matching |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:95:| FTS5 | `sqlite-fts.ts` | SQLite FTS5 BM25 weighted scoring |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:101:**Stage 2 — Fusion + Signal Integration** (`stage2-fusion.ts`):
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:109:6. Intent weights — non-hybrid only (G2 double-weighting prevention: `isHybrid` boolean guard)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:133:- Parameter-free fusion (no weight tuning required)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:172:<a id="fts-capability-cascade-floor"></a>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:175:Packet `026-graph-and-context-optimization/010-fts-capability-cascade-floor` freezes the lexical capability contract that packet `002-implement-cache-warning-hooks` now consumes. `memory_search` responses expose:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:177:- `lexicalPath`: the lane that actually ran for lexical retrieval. Current packet-owned values are `fts5` and `unavailable`. The wider response schema also allows `like`, but packet `010` does not claim that lane for this runtime seam.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:182:| `fallbackState` | Meaning | `lexicalPath` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:184:| `ok` | FTS5 compile probe passed, `memory_fts` exists, and BM25 ranking executed normally | `fts5` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:185:| `compile_probe_miss` | `PRAGMA compile_options` does not report FTS5 support, so lexical work cannot run for this request | `unavailable` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:186:| `missing_table` | FTS5 support is present, but `memory_fts` is missing at runtime | `unavailable` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:187:| `no_such_module_fts5` | The SQLite engine rejects FTS5 usage with `no such module: fts5` | `unavailable` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:188:| `bm25_runtime_failure` | The FTS5 table exists, but the `bm25(...)` ranking call fails at runtime | `unavailable` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:190:The contract is intentionally narrow: preserve result-shape semantics, surface truthful lane metadata, and let later packets build on that truth instead of inferring capability from empty results or warning logs.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:246:| **TypeScript**       | `hybrid-search.ts`, `cross-encoder.ts`, `intent-classifier.ts`, `bm25-index.ts`             |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:247:| **TypeScript**       | `vector-index.ts` (typed export surface) + `vector-index-impl.ts` (14-line compatibility shim) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:248:| **TypeScript**       | `reranker.ts` (local reranking utility); `rrf-fusion.ts`, `adaptive-fusion.ts`, `mmr-reranker.ts` relocated to `shared/algorithms/` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:253:### Facade Pattern: vector-index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:259:vector-index.ts          (166 LOC)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:262:    - vector-index-types.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:263:    - vector-index-schema.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:264:    - vector-index-mutations.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:265:    - vector-index-queries.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:266:    - vector-index-store.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:267:    - vector-index-aliases.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:270:vector-index-impl.ts     (14 LOC)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:272:  - Re-exports from './vector-index'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:276:**NOTE**: Most vector-index logic now lives in the split `vector-index-*` modules. `vector-index-impl.ts` is only a compatibility adapter, so runtime changes should be made in `vector-index.ts` or the underlying split modules.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:282:| `vector-index.ts`          | 166    | TypeScript | Typed export surface re-exporting the split vector-index modules |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:283:| `vector-index-impl.ts`     | 14     | TypeScript | Backward-compatibility shim that re-exports `vector-index.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:284:| `vector-index-types.ts`    | -      | TypeScript | Shared type definitions for vector index modules    |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:285:| `vector-index-schema.ts`   | -      | TypeScript | Schema creation and migration logic                 |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:286:| `vector-index-mutations.ts`| -      | TypeScript | Insert, update, and delete operations for vector index |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:287:| `vector-index-queries.ts`  | -      | TypeScript | Query builders and search operations for vector index |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:288:| `vector-index-aliases.ts`  | -      | TypeScript | Re-export aliases for backward-compatible imports   |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:289:| `vector-index-store.ts`    | -      | TypeScript | Low-level storage operations and reconsolidation helpers |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:290:| `hybrid-search.ts`         | ~900   | TypeScript | Orchestrates vector/FTS/BM25/graph/degree fusion via adaptive RRF |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:293:| `intent-classifier.ts`     | ~500   | TypeScript | 7 intent types with keyword patterns                |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:294:| `bm25-index.ts`            | ~280   | TypeScript | Pure TypeScript BM25 (REQ-028, v1.2.0)              |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:307:| `folder-discovery.ts`      | -      | TypeScript | Spec folder description discovery: per-folder `description.json` CRUD, centralized cache aggregation, staleness detection, `slugifyFolderName()` helper, keyword-overlap relevance scoring (PI-B3) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:311:| `sqlite-fts.ts`            | -      | TypeScript | SQLite FTS5 BM25 weighted scoring, extracted from hybrid-search for independent use |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:316:| `memory-summaries.ts`      | -      | TypeScript | Summary storage, embedding, and search channel for memory summaries (R8) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:323:| `embedding-expansion.ts`   | -      | TypeScript | Embedding-based query expansion for R12 multi-vector retrieval |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:343:| `community-search.ts`      | -      | TypeScript | Community-level search fallback — keyword-matches community summaries, returns member IDs |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:353:**Relocated to `shared/algorithms/`**: `rrf-fusion.ts`, `adaptive-fusion.ts`, `mmr-reranker.ts` -- these are now imported from `@spec-kit/shared/algorithms/`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:359:   hybrid-search.ts -> Expand acronyms + fix typos (inline)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:366:   vector-index.ts -> Vector search (semantic)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:367:   bm25-index.ts -> BM25 search (keyword)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:375:   rrf-fusion.ts -> RRF with k=40, convergence bonus
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:376:   adaptive-fusion.ts -> Intent-aware weighted fusion
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:377:   hybrid-search.ts -> Orchestrate multi-source fusion
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:413:| `ENABLE_BM25`            | `true`   | Enable BM25 lexical search (legacy compatibility gate) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:418:| `EMBEDDING_DIM`          | `768`    | Fallback embedding dimension        |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:425:| `SPECKIT_EMBEDDING_EXPANSION`| `true` | Enable R12 embedding-based query expansion |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:455:| v7      | `partial` embedding_status + `idx_embedding_pending` + `idx_fts_fallback` (REQ-031, T096) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:476:function toEmbeddingBuffer(embedding) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:477:  return Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:506:// 1. Vector search (semantic similarity)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:507:// 2. BM25/FTS5 search (keyword matching)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:516:hybridSearch("authentication", { specFolder: "specs/<###-spec-name>" })
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:522:- If no graph: Vector + Lexical fusion
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:529:// Primary keywords: 2x weight
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:530:// Secondary keywords: 1x weight
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:597:| **Storage** | Summaries stored with embeddings in SQLite for vector search |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:600:| **Pipeline** | `generateAndStoreSummary()` combines TF-IDF extraction with embedding and persistence |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:607:| `querySummaryEmbeddings` | `(db, queryEmbedding, limit?) => SummarySearchResult[]` | Search summaries by embedding similarity |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:639:Graph-based scoring signals applied during Stage 2 fusion. Gated via `SPECKIT_GRAPH_SIGNALS` (N2a + N2b) and `SPECKIT_COMMUNITY_DETECTION` (N2c).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:655:**A7: Co-Activation Boost** (`../cognitive/co-activation.ts` + Stage 2 fusion):
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:679:Same-path `unchanged` only applies to healthy existing rows (`success`, `pending`, `partial`), so unhealthy embedding states still re-enter indexing. Cross-path content-hash dedup accepts chunked parents only when the parent row is in valid `partial` state and ignores invalid parent rows marked `complete`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:706:**Embedding Cache Consistency** (`save/embedding-pipeline.ts` + chunking path):
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:707:Embedding cache keys now hash normalized content in both the primary and chunked embedding paths, so equivalent normalized content shares cache entries.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:718:**Lexical Normalization + BM25 Document Text** (`bm25-index.ts`):
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:719:`buildBm25DocumentText()` builds the canonical lexical document from title, content, trigger phrases, and folder metadata. `normalizeLexicalQueryTokens()` is shared by BM25 and SQLite FTS flows so lexical matching stays aligned across search channels.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:722:Watcher- and ingest-triggered reindex paths now use the normal synchronous embedding cache-miss flow. Deferred embeddings remain opt-in via `asyncEmbedding` or failure fallback.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:769:import { initializeDb } from './vector-index';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:770:import { init, unifiedSearch } from './hybrid-search';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:771:import { vectorSearch } from './vector-index';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:776:init(db, vectorSearch);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:786:// - rrfScore: Combined score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:787:// - sources: ['vector', 'bm25', 'graph']
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:788:// - vectorRank, bm25Rank, graphRank
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:796:import { unifiedSearch } from './hybrid-search';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:833:import * as bm25Index from './bm25-index';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:836:if (bm25Index.isBm25Enabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:838:  const results = bm25Index.getIndex().search('authentication', {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:850:import { initializeDb, getDb } from './vector-index';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:872:- Guard clauses added for missing data, null embeddings, and edge cases (B4)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:906:| `@spec-kit/shared/embeddings` | Embeddings provider abstraction   |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:908:| Search weights configuration | Loaded via SERVER_DIR in the split vector-index modules (compat imports still route through `vector-index-impl.ts`) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:943:| REQ-011 | RRF fusion enhancement           | hybrid-search.ts                |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:946:| REQ-014 | BM25 hybrid search               | bm25-index.ts, hybrid-search.ts |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:947:| REQ-018 | Query expansion (fuzzy)          | hybrid-search.ts                |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:948:| REQ-027 | Fuzzy acronym matching           | hybrid-search.ts                |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:949:| REQ-028 | Pure TypeScript BM25             | bm25-index.ts                   |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:961:- `vector-index.ts` is the primary typed export surface. `vector-index-impl.ts` is a 14-line compatibility shim, and the core implementation lives in the split vector-index modules for types, schema, mutations, queries, aliases, and store
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:962:- `rrf-fusion.ts`, `adaptive-fusion.ts`, and `mmr-reranker.ts` relocated to `shared/algorithms/`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:200:    // Find memory IDs matching the routed concepts via title keyword search,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:237:    // Step 3: Extract short keyword phrases from neighbor titles
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:4:// Feature catalog: Semantic and lexical search (memory_search)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:6:// Extracted from hybrid-search.ts ftsSearch() for independent
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:9:import { BM25_FTS5_WEIGHTS, normalizeLexicalQueryTokens } from './bm25-index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:18:  fts_score: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:28:type LexicalPath = 'fts5' | 'like' | 'unavailable';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:33:  | 'no_such_module_fts5'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:34:  | 'bm25_runtime_failure';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:37:  lexicalPath: LexicalPath;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:84:  return toErrorMessage(error).toLowerCase().includes('no such module: fts5');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:89:  return message.includes('bm25');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:101:        lexicalPath: 'unavailable',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:107:      lexicalPath: 'unavailable',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:114:      `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:119:        lexicalPath: 'unavailable',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:126:        lexicalPath: 'unavailable',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:127:        fallbackState: 'no_such_module_fts5',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:131:      lexicalPath: 'unavailable',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:137:    lexicalPath: 'fts5',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:147: * Execute a weighted BM25 FTS5 search against memory_fts.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:149: * Uses SQLite FTS5's built-in bm25() ranking function with
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:159: * const rows = fts5Bm25Search(db, 'memory search', { limit: 10 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:162:function fts5Bm25Search(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:170:  const tokens = normalizeLexicalQueryTokens(query).fts;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:197:    SELECT m.*, -bm25(memory_fts, ${w0}, ${w1}, ${w2}, ${w3}) AS fts_score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:198:    FROM memory_fts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:199:    JOIN memory_index m ON m.id = memory_fts.rowid
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:200:    WHERE memory_fts MATCH ?
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:204:    ORDER BY fts_score DESC
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:211:    console.warn(`[sqlite-fts] FTS5 unavailable (${capability.fallbackState}); returning empty lexical lane results`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:223:      fts_score: (row.fts_score as number) || 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:226:      lexicalPath: 'fts5',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:234:          lexicalPath: 'unavailable',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:235:          fallbackState: 'no_such_module_fts5',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:239:            lexicalPath: 'unavailable',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:240:            fallbackState: 'bm25_runtime_failure',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:242:        : msg.toLowerCase().includes('no such table: memory_fts')
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:244:              lexicalPath: 'unavailable',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:248:              lexicalPath: 'unavailable',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:249:              fallbackState: 'bm25_runtime_failure',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:252:    console.warn(`[sqlite-fts] BM25 FTS5 search failed: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:258: * Check if the memory_fts FTS5 virtual table exists in the database.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:260: * Used as a feature-detect before calling fts5Bm25Search, since FTS5
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:264: * @returns true if memory_fts exists and is queryable
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:268: *   fts5Bm25Search(db, 'memory');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:282:  fts5Bm25Search,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:12:// MPAB MUST remain AFTER RRF fusion (Stage 2).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:167:  // Gated behind SPECKIT_MMR feature flag. Retrieves embeddings from
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:169:  // The result set, matching the V1 hybrid-search behavior.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:180:          `SELECT rowid, embedding FROM vec_memories WHERE rowid IN (${placeholders})`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:181:        ) as Database.Statement).all(...numericIds) as Array<{ rowid: number; embedding: Buffer }>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:183:        const embeddingMap = new Map<number, Float32Array>();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:185:          if (Buffer.isBuffer(row.embedding)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:186:            embeddingMap.set(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:188:              new Float32Array(row.embedding.buffer, row.embedding.byteOffset, row.embedding.byteLength / 4)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:195:          const emb = embeddingMap.get(r.id);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:201:              embedding: emb,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:213:          // FIX #5: MMR can only diversify rows that have embeddings. Non-embedded
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:214:          // rows (lexical-only hits, graph injections) must be preserved and merged
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:301: * @param results     - Pipeline rows from Stage 2 fusion.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:357:          rrfScore: rerankScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:421:        rrfScore: rerankScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:473: * RRF fusion (Stage 2). It is intentionally placed in Stage 3.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:577: * and rrfScore before raw score/similarity, matching Stage 2's
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:649:      rrfScore: parentScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:693:    rrfScore: parentScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:42:  rrfScore?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:61: * function uses the correct chain: intentAdjustedScore → rrfScore → score → similarity/100,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:67:  if (typeof row.rrfScore === 'number' && Number.isFinite(row.rrfScore))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:68:    return Math.max(0, Math.min(1, row.rrfScore));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:82:  'similarity' | 'score' | 'importance_weight' | 'rrfScore' | 'intentAdjustedScore' | 'attentionScore'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:122:  searchType: 'hybrid' | 'vector' | 'multi-concept';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:167: * Intent-aware weighting factors applied during fusion.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:191: * Executes search channels (FTS5, semantic, trigger, graph, co-activation)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:206:    /** Actual retrieval channels active (vector=1, hybrid=2). Unlike channelCount which tracks query variants. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:235: * Stage 2 output containing scored rows and fusion metadata.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:348: * Executor signature for Stage 2 fusion and signal integration.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:371:  rrfScore?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:385:    rrfScore: r.rrfScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:419:    if (row.rrfScore !== snap.rrfScore) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:421:        `[Stage4Invariant] Score mutation detected: id=${snap.id} rrfScore changed from ${snap.rrfScore} to ${row.rrfScore}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:23:  /** Weight for semantic (vector) search component, 0-1 */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:24:  semanticWeight: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:25:  /** Weight for keyword (BM25) search component, 0-1 */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:26:  keywordWeight: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:55:    semanticWeight: 0.7,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:56:    keywordWeight: 0.3,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:63:    semanticWeight: 0.6,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:64:    keywordWeight: 0.4,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:71:    semanticWeight: 0.4,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:72:    keywordWeight: 0.6,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:79:    semanticWeight: 0.3,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:80:    keywordWeight: 0.7,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:87:    semanticWeight: 0.6,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:88:    keywordWeight: 0.4,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:95:    semanticWeight: 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:96:    keywordWeight: 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:103:    semanticWeight: 0.8,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:104:    keywordWeight: 0.2,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:111:    semanticWeight: 0.7,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:112:    keywordWeight: 0.3,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:119:    semanticWeight: 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:120:    keywordWeight: 0.5,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:153: * Query keyword/pattern mapping for artifact class detection from
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:156:const QUERY_PATTERNS: Array<{ keywords: string[]; patterns: RegExp[]; artifactClass: ArtifactClass }> = [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:159:    keywords: ['checklist', 'checkbox', 'check list', 'verification', 'p0', 'p1', 'p2', 'blocker'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:164:    keywords: ['tasks', 'task list', 'todo', 'to-do', 'work items', 'backlog'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:169:    keywords: ['decision', 'adr', 'decision-record', 'rationale', 'trade-off', 'tradeoff', 'chose', 'alternative'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:174:    keywords: ['implementation-summary', 'implementation summary', 'summary of changes', 'what was implemented', 'config', 'setup', 'env', 'flag', 'setting'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:179:    keywords: ['plan', 'planning', 'approach', 'strategy', 'phases', 'milestones', 'timeline'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:184:    keywords: ['spec', 'specification', 'requirements', 'scope', 'objective', 'constraints'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:189:    keywords: ['research', 'investigation', 'analysis', 'findings', 'study', 'evaluation', 'search', 'retrieval', 'pipeline', 'indexing', 'embedding', 'vector', 'semantic'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:194:    keywords: ['memory', 'context', 'session', 'previous session', 'prior work', 'last time', 'continue', 'resume', 'recover', 'continuation'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:205: * Used when keyword/pattern scoring yields zero matches but an
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:277:  for (const { keywords, patterns, artifactClass } of QUERY_PATTERNS) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:281:    for (const keyword of keywords) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:282:      if (lower.includes(keyword)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:300:  // Confidence: normalize score. Max realistic score ~6-8 (3 keywords + 2 patterns).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:5:// Split from vector-index-store.ts — contains ALL query/search functions,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:14:import * as embeddingsProvider from '../providers/embeddings.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:18:  to_embedding_buffer,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:21:} from './vector-index-types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:24:  get_embedding_dim,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:32:} from './vector-index-store.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:33:import { delete_memory_from_database } from './vector-index-mutations.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:39:} from './vector-index-types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:60: * @throws {VectorIndexError} Propagates store initialization failures from the vector index.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:113: * Gets memory counts grouped by embedding status.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:114: * @returns The counts for each embedding status.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:120:    SELECT m.embedding_status, COUNT(*) as count
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:123:    GROUP BY m.embedding_status
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:128:  for (const row of rows as Array<{ embedding_status: keyof typeof counts; count: number }>) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:129:    if (row.embedding_status in counts) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:130:      counts[row.embedding_status] = row.count;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:158: * Searches indexed memories by vector similarity.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:159: * @param query_embedding - The query embedding to search with.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:162: * @throws {VectorIndexError} Propagates store initialization failures from the vector index.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:165: * const rows = vector_search(queryEmbedding, { limit: 5, specFolder: 'specs/001-demo' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:168:export function vector_search(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:169:  query_embedding: EmbeddingInput,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:175:    console.warn('[vector-index] Vector search unavailable - sqlite-vec not loaded');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:190:  // M9 FIX: Validate embedding dimension before querying
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:191:  const expected_dim = get_embedding_dim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:192:  if (!query_embedding || query_embedding.length !== expected_dim) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:194:      `Invalid embedding dimension: expected ${expected_dim}, got ${query_embedding?.length}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:199:  const query_buffer = to_embedding_buffer(query_embedding);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:221:  const where_clauses = ['m.embedding_status = \'success\''];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:263:      SELECT m.*, vec_distance_cosine(v.embedding, ?) as distance,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:309: * Searches indexed memories with multiple concept embeddings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:310: * @param concept_embeddings - The concept embeddings to search with.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:313: * @throws {VectorIndexError} When concept count or embedding dimensions are invalid, or when store initialization fails.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:320:  concept_embeddings: EmbeddingInput[],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:325:    console.warn('[vector-index] Multi-concept search unavailable - sqlite-vec not loaded');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:331:  const concepts = concept_embeddings;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:336:  const expected_dim = get_embedding_dim();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:340:        `Invalid embedding dimension: expected ${expected_dim}, got ${emb?.length}`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:348:  const concept_buffers = concepts.map(c => to_embedding_buffer(c));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:352:    `vec_distance_cosine(v.embedding, ?) as dist_${i}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:356:    `vec_distance_cosine(v.embedding, ?) <= ?`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:380:      WHERE m.embedding_status = 'success'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:505:    console.warn('[vector-index] extract_tags: invalid content type, expected string');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:557:        console.warn('[vector-index-queries] Date parsing failed', { error: _e instanceof Error ? _e.message : String(_e) });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:586: * Generates an embedding for a search query.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:588: * @returns A promise that resolves to the embedding, if generated.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:590:export async function generate_query_embedding(query: string): Promise<Float32Array | null> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:592:    console.warn('[vector-index] Empty query provided for embedding');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:597:    const embeddings = embeddingsProvider;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:598:    const embedding = await embeddings.generateQueryEmbedding(query.trim());
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:599:    return embedding;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:601:    console.warn(`[vector-index] Query embedding failed: ${get_error_message(error)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:611: * Searches indexed memories using keyword matching.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:616:export function keyword_search(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:624:    console.warn('[vector-index] keyword_search: invalid query, expected non-empty string');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:630:    console.warn('[vector-index] keyword_search: no valid search terms after tokenization');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:677:    return { ...row, keyword_score: score };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:681:    .filter((row: MemoryRow) => Number(row.keyword_score ?? 0) > 0)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:682:    .sort((a: MemoryRow, b: MemoryRow) => Number(b.keyword_score ?? 0) - Number(a.keyword_score ?? 0))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:697: * Runs enriched vector search for a text query.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:702: * @throws {VectorIndexError} Propagates vector-store initialization failures from the underlying search pipeline.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:705: * const results = await vector_search_enriched('sqlite vec mismatch', 10, { specFolder: 'specs/001-demo' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:708:export async function vector_search_enriched(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:717:  const query_embedding = await generate_query_embedding(query);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:720:  let search_method = 'vector';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:723:  if (query_embedding && sqlite_vec) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:724:    raw_results = vector_search(query_embedding, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:730:    console.warn('[vector-index] Falling back to keyword search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:731:    search_method = 'keyword';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:732:    raw_results = keyword_search(query, { limit, specFolder }, database);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:747:    const similarity = search_method === 'vector'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:749:      : Math.min(100, (row.keyword_score || 0) * 20);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:769:    console.warn(`[vector-index] Enriched search took ${elapsed}ms (target <500ms)`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:781: * @param concepts - The concept queries or embeddings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:785: * @throws {VectorIndexError} When concept validation fails or the vector search pipeline cannot execute.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:788: * const results = await multi_concept_search_enriched(['sqlite', 'vector'], 10, { specFolder: 'specs/001-demo' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:804:  const concept_embeddings: EmbeddingInput[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:807:      const embedding = await generate_query_embedding(concept);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:808:      if (!embedding) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:809:        console.warn(`[vector-index] Failed to embed concept: "${concept}"`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:810:        return await multi_concept_keyword_search(concepts.filter(c => typeof c === 'string'), limit, options);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:812:      concept_embeddings.push(embedding);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:814:      concept_embeddings.push(concept);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:820:    console.warn('[vector-index] Falling back to keyword multi-concept search');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:821:    return await multi_concept_keyword_search(concepts.filter(c => typeof c === 'string'), limit, options);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:824:  const raw_results = multi_concept_search(concept_embeddings, { limit, specFolder, minSimilarity });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:855:    console.warn(`[vector-index] Multi-concept search took ${elapsed}ms (target <500ms)`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:862: * Runs keyword search for multiple concepts.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:868:export async function multi_concept_keyword_search(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:876:    console.warn('[vector-index] multi_concept_keyword_search: empty concepts array');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:881:    keyword_search(concept, { limit: 100, specFolder })
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:920:      avgSimilarity: Math.min(100, (row.keyword_score || 1) * 15),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:921:      conceptSimilarities: concepts.map(() => row.keyword_score || 1),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:930:      searchMethod: 'keyword',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:945:    console.warn('[vector-index] parse_quoted_terms: invalid query, expected non-empty string');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1084:    console.warn(`[vector-index] Failed to get related memories for ${memory_id}: ${get_error_message(error)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1185:    console.warn(`[vector-index] find_cleanup_candidates error: ${get_error_message(e)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1238:    console.warn(`[vector-index] get_memory_preview query error: ${get_error_message(e)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1259:    console.warn('[vector-index] get_memory_preview file read warning', {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1291: * Verifies vector-index consistency and optional cleanup results.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1298:): { totalMemories: number; totalVectors: number; orphanedVectors: number; missingVectors: number; orphanedFiles: Array<{ id: number; file_path: string; reason: string }>; orphanedChunks: number; isConsistent: boolean; cleaned?: { vectors: number; chunks: number } } {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1302:  const find_orphaned_vector_ids = () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1304:      console.warn('[vector-index] find_orphaned_vector_ids: sqlite-vec not available');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1313:      console.warn('[vector-index] Could not query orphaned vectors:', get_error_message(e));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1318:  const orphaned_vector_ids = find_orphaned_vector_ids();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1319:  const orphaned_vectors = orphaned_vector_ids.length;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1321:  let cleaned_vectors = 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1322:  if (autoClean && orphaned_vectors > 0 && sqlite_vec) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1323:    logger.info(`Auto-cleaning ${orphaned_vectors} orphaned vectors...`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1325:    for (const rowid of orphaned_vector_ids) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1328:        cleaned_vectors++;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1330:        console.warn(`[vector-index] Failed to clean orphaned vector ${rowid}: ${get_error_message(e)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1333:    logger.info(`Cleaned ${cleaned_vectors} orphaned vectors`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1338:  const missing_vectors = sqlite_vec
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1341:        WHERE m.embedding_status = 'success'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1347:  const total_vectors = sqlite_vec
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1383:      console.warn('[vector-index] Could not query orphaned chunks:', get_error_message(e));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1409:        console.warn(`[vector-index] Failed to clean orphaned chunk ${chunk.id}: ${get_error_message(e)}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1419:    totalVectors: total_vectors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1420:    orphanedVectors: autoClean ? orphaned_vectors - cleaned_vectors : orphaned_vectors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1421:    missingVectors: missing_vectors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1424:    isConsistent: (orphaned_vectors - cleaned_vectors) === 0 && missing_vectors === 0 && orphaned_files.length === 0 && effective_orphaned_chunks === 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1425:    cleaned: (autoClean && (cleaned_vectors > 0 || cleaned_chunks > 0))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1426:      ? { vectors: cleaned_vectors, chunks: cleaned_chunks }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1437:export { vector_search as vectorSearch };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1444:export { generate_query_embedding as generateQueryEmbedding };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1445:export { keyword_search as keywordSearch };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1446:export { vector_search_enriched as vectorSearchEnriched };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1448:export { multi_concept_keyword_search as multiConceptKeywordSearch };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:16://     - No score field (similarity, score, rrfScore, intentAdjustedScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:207: * A1 FIX: Previously used a different precedence order (rrfScore first) and
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2b-enrichment.ts:4:// B4 DECOMPOSITION: Extracted from stage2-fusion.ts steps 8-9.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:11://     - Intent weights are NEVER applied to hybrid results (G2 double-weighting guard)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:23:// 1a. Recency fusion          — time-decay bonus for recent memories
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:29:// 4.  Intent weights          — non-hybrid search post-scoring adjustment
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:37:// Internally (RRF / RSF fusion). Post-search intent weighting is
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:38:// Therefore ONLY applied for non-hybrid search types (vector,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:39:// Multi-concept). Applying it to hybrid results would double-count.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:125:/** Recency fusion weight — controls how much recency score contributes to the fused score.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:129:/** Recency fusion cap — maximum bonus a candidate can receive from recency fusion.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:192:        console.warn(`[stage2-fusion] learned stage2 model at ${modelPath} is invalid; shadow scoring will use manual-only fallback`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:206:        console.warn(`[stage2-fusion] learned stage2 model load failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:264: * intentAdjustedScore → rrfScore → score → similarity/100, all clamped to [0,1].
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:275:    rrfScore: clamped,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:278:    // must not be overwritten with the fusion/ranking score.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:288:    row.rrfScore = clamped;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:291:    // must not be overwritten with the fusion/ranking score.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:464:    console.warn(`[stage2-fusion] provenance edge fetch failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:493:    console.warn(`[stage2-fusion] provenance community fetch failed (non-fatal): ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:582:    console.warn(`[stage2-fusion] strengthenOnAccess failed for id ${memoryId}: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:592: * G2 PREVENTION: This function is ONLY called for non-hybrid search types.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:594: * during fusion. Calling this on hybrid results would double-count intent.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:654: * current composite score (`score`, then `rrfScore`, then `similarity`).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:737:    console.warn(`[stage2-fusion] learned trigger query failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:749:      console.warn(`[stage2-fusion] negative feedback stats failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:835:    console.warn(`[stage2-fusion] usage ranking failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:880:      console.warn(`[stage2-fusion] applyTestingEffect failed for id ${row.id}: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:916:    console.warn('[stage2-fusion] adaptive access signal write failed:', (err as Error)?.message ?? err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:930: *   1.  Session boost      (hybrid only — working memory attention)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:931: *   1a. Recency fusion     (all types — time-decay bonus)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:932: *   2.  Causal boost       (hybrid only — graph-traversal amplification)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:937: *   4.  Intent weights     (non-hybrid only — G2 prevention)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:975:  const isHybrid = config.searchType === 'hybrid';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:978:  // Only for hybrid search type — session attention signals are most meaningful
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:979:  // When the full hybrid result set is available for ordering.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:988:      // so rrfScore/intentAdjustedScore are not stale for subsequent steps.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:993:      console.warn(`[stage2-fusion] session boost failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:998:  // -- 1a. Recency fusion --
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1000:  // Uses computeRecencyScore (already imported but previously unused in hybrid path).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1027:    console.warn(`[stage2-fusion] recency fusion failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1031:  // Only for hybrid search type — causal graph traversal is seeded from the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1049:      console.warn(`[stage2-fusion] causal boost failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1057:  // Appear in the co-activation graph. Matches V1 hybrid-search behavior.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1093:      console.warn(`[stage2-fusion] co-activation spreading failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1113:      console.warn(`[stage2-fusion] community boost failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1169:      console.warn(`[stage2-fusion] graph signals failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1180:      console.warn(`[stage2-fusion] usage ranking skipped (db unavailable): ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1191:    console.warn(`[stage2-fusion] graph evidence provenance failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1205:      console.warn(`[stage2-fusion] testing effect skipped (db unavailable): ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1210:  // G2 PREVENTION: Only apply for non-hybrid search types.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1211:  // Hybrid search (RRF / RSF) incorporates intent weighting during fusion —
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1224:      console.warn(`[stage2-fusion] intent weights failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1237:      console.warn(`[stage2-fusion] artifact routing failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1253:    console.warn(`[stage2-fusion] feedback signals failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1266:          rrfScore: row.rrfScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1287:            `[stage2-fusion] shadow-learned id=${row.id} manual=${shadow.manualScore.toFixed(4)} learned=${shadow.learnedScore.toFixed(4)} delta=${shadow.delta.toFixed(4)}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1293:      console.warn(`[stage2-fusion] learned stage2 shadow scoring failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1321:    console.warn(`[stage2-fusion] validation signal scoring failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1344:        '[stage2-fusion] Graph channel active (bounded_runtime) but zero contribution — causal_edges table may be sparse or candidates lack graph connectivity'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1353:      'fusion',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:12:// Input:  PipelineConfig (query, embedding, limits, flags, intent, session)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:34:import { executeStage2 } from './stage2-fusion.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:3:description: "Four-stage retrieval pipeline: candidate generation, fusion, reranking and filtering."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:9:  - "fusion scoring"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:18:A four-stage retrieval pipeline that takes a search query through candidate generation, score fusion, reranking and final filtering to produce ranked memory results.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:34:The `pipeline/` directory implements the core retrieval pipeline behind `memory_search`. Each search request flows through four sequential stages, each with a defined I/O contract and clear responsibility boundary. The pipeline supports hybrid, vector and multi-concept search types with optional deep-mode query expansion, cross-encoder reranking, MMR diversity pruning and MPAB chunk-to-parent reassembly.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:46:| `stage1-candidate-gen.ts` | Stage 1: Candidate Generation. Runs search channels (hybrid, vector, multi-concept), applies deep-mode query expansion (R6), embedding-based expansion (R12), summary embeddings (R8), constitutional memory injection, quality threshold filtering and tier/contextType filtering. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:47:| `stage2-fusion.ts` | Stage 2: Fusion + Signal Integration. The single authoritative scoring point. Applies 9 signal steps in fixed order: session boost, causal boost, co-activation spreading, community co-retrieval, graph signals, FSRS testing effect, intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals, artifact limiting, anchor metadata and validation metadata scoring. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:78:- Channels: hybrid (with optional deep-mode expansion), vector, multi-concept.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:79:- Optional R12 embedding expansion and R8 summary embedding channels.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:83:**Stage 2 - Fusion + Signal Integration** (`stage2-fusion.ts`)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:86:- G2 prevention: intent weights are applied only for non-hybrid search types.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:105:1. **Single Scoring Point.** All score modifications happen in Stage 2 (fusion) or Stage 3 (reranking). Stage 4 must not change any score field.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:106:2. **G2 Double-Weighting Guard.** Intent weights are applied only for non-hybrid search types. Hybrid search incorporates intent weighting during RRF/RSF fusion internally.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:108:4. **Score Resolution Consistency.** All stages use the shared `resolveEffectiveScore()` function from `types.ts` with fallback chain: `intentAdjustedScore` > `rrfScore` > `score` > `similarity/100`, clamped to [0, 1].
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:114:- `mcp_server/lib/search/` - Parent search directory containing hybrid search, vector index, cross-encoder and other search modules consumed by the pipeline.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:7:// This stage avoids downstream fusion/reranking, but may apply temporal
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:8:// Contiguity to raw vector-channel hits before later pipeline stages.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:12://   - multi-concept: Generate per-concept embeddings, run multiConceptSearch
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:13://   - hybrid (deep mode): Query expansion + multi-variant hybrid search + dedup
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:14://   - hybrid (R12):       Embedding-based query expansion (SPECKIT_EMBEDDING_EXPANSION)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:16://   - hybrid: collectRawCandidates → falls back to vector on failure
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:17://   - vector: Direct vectorSearch
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:28://     - candidates contains raw channel scores; vector hits may include an
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:29://       optional temporal-contiguity boost applied before downstream fusion
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:33://     - Generates query embeddings via the embeddings provider (external call)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:34://     - Reads from the vector index and FTS5 / BM25 index (DB reads only)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:38:import * as vectorIndex from '../vector-index.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:39:import * as embeddings from '../../providers/embeddings.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:40:import * as hybridSearch from '../hybrid-search.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:41:import { vectorSearchWithContiguity } from '../../cognitive/temporal-contiguity.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:44:import { expandQueryWithEmbeddings, isExpansionActive } from '../embedding-expansion.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:79:/** Number of constitutional results to fetch when none appear in hybrid/vector results. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:82:/** Number of similar memories to mine for R12 embedding-based query expansion terms. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:354: * rule-based expansion is skipped — consistent with the R12 embedding-expansion
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:459: * and `config.mode`, then applies vector-channel temporal contiguity when
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:463: * This stage does not apply Stage 2 fusion/reranking signals. Vector-channel
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:472:  // Fix #16: Cache embedding at function scope for reuse in constitutional injection
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:508:  // the query for the hybrid search channel, improving recall for alias-rich
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:509:  // queries (e.g. "semantic search" → also searches "retrieval", "query", etc.).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:513:  /** Effective query for hybrid search — may be expanded by concept routing. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:516:  if (isGraphConceptRoutingEnabled() && searchType === 'hybrid') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:581:    // Generate one embedding per concept
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:584:      const emb = await embeddings.generateQueryEmbedding(concept);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:587:          `[stage1-candidate-gen] Failed to generate embedding for concept: "${concept}"`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:594:    candidates = vectorIndex.multiConceptSearch(conceptEmbeddings, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:604:  else if (searchType === 'hybrid') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:605:    // Resolve the query embedding — either pre-computed in config or generate now
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:606:    // Fix #16 — Cache this embedding for reuse in constitutional injection path
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:609:      queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:613:      throw new Error('[stage1-candidate-gen] Failed to generate embedding for hybrid search query');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:616:    // Deep mode: expand query into variants and run hybrid for each, then dedup
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:621:      // sub-query facets and run hybrid search per facet. Results are merged
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:654:            // Run hybrid for the original query plus each facet, in parallel
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:661:                  const facetEmbedding = await embeddings.generateQueryEmbedding(q);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:663:                    console.warn('[stage1-candidate-gen] D2 facet embedding generation returned null');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:666:                  return hybridSearch.collectRawCandidates(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:724:                const variantEmbedding = await embeddings.generateQueryEmbedding(variant);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:726:                  console.warn('[stage1-candidate-gen] Deep variant embedding generation returned null');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:729:                const variantResults = await hybridSearch.collectRawCandidates(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:759:            `[stage1-candidate-gen] Deep query expansion failed, falling back to single hybrid: ${expandMsg}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:761:          // Fall through to single hybrid search below
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:763:          candidates = (await hybridSearch.collectRawCandidates(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:770:        // ExpandQuery returned only the original; treat as standard hybrid
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:772:        candidates = (await hybridSearch.collectRawCandidates(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:784:      // We expand the query using embedding similarity to find related terms
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:811:              hybridSearch.collectRawCandidates(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:822:              embeddings.generateQueryEmbedding(expanded.combinedQuery).then(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:825:                    console.warn('[stage1-candidate-gen] Expanded query embedding generation returned null');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:828:                  return hybridSearch.collectRawCandidates(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:855:                channel: 'r12-embedding-expansion',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:864:            `[stage1-candidate-gen] R12 embedding expansion failed, using standard hybrid: ${r12Msg}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:869:      // Standard hybrid search — runs when R12 is off, suppressed by R15,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:875:          const hybridResults = (await hybridSearch.collectRawCandidates(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:880:          candidates = hybridResults;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:881:        } catch (hybridErr: unknown) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:882:          const hybridMsg =
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:883:            hybridErr instanceof Error ? hybridErr.message : String(hybridErr);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:885:            `[stage1-candidate-gen] Hybrid search failed, falling back to vector: ${hybridMsg}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:888:          // Fallback: pure vector search
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:890:          let vectorResults = vectorIndex.vectorSearch(effectiveEmbedding, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:899:            vectorResults = (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:900:              vectorSearchWithContiguity(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:901:                vectorResults as Array<PipelineRow & { similarity: number; created_at: string }>,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:904:            ) ?? vectorResults;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:906:          candidates = vectorResults;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:910:              reason: hybridMsg,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:911:              channel: 'vector',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:921:  else if (searchType === 'vector') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:923:      queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:926:      throw new Error('[stage1-candidate-gen] Failed to generate embedding for vector search query');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:930:    let vectorResults = vectorIndex.vectorSearch(effectiveEmbedding, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:939:      vectorResults = (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:940:        vectorSearchWithContiguity(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:941:          vectorResults as Array<PipelineRow & { similarity: number; created_at: string }>,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:944:      ) ?? vectorResults;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:946:    candidates = vectorResults;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:953:      `[stage1-candidate-gen] Unknown searchType: "${searchType}". Expected 'multi-concept', 'hybrid', or 'vector'.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:961:  // Exception: for hybrid search, tier/contextType are applied here because
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:963:  // For vector search, tier/contextType were already passed to vectorSearch,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1011:  // In the current candidate set, fetch them separately via vector search.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1026:      // Fix #16 — Reuse cached embedding instead of generating a new one
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1028:        cachedEmbedding ?? queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1031:        const constitutionalResults = vectorIndex.vectorSearch(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1048:        // via vector search bypass the earlier governance/context gate.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1080:  //   1. Retrieve top-3 seed results via fast BM25/FTS5 (no embedding call).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1082:  //   3. Fan-out [original, abstract, ...variants] as additional hybrid search channels.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1088:  if (mode === 'deep' && isLlmReformulationEnabled() && searchType === 'hybrid') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1096:          cachedEmbedding ?? queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1103:              // Reuse cached embedding for original query (idx 0); generate fresh for variants
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1104:              const emb = idx === 0 ? reformEmbedding : await embeddings.generateQueryEmbedding(q);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1106:                console.warn('[stage1-candidate-gen] LLM reform embedding generation returned null');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1109:              return hybridSearch.collectRawCandidates(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1169:  //   - Run a vector-only search with the pseudo-document embedding.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1176:  if (mode === 'deep' && isHyDEEnabled() && searchType === 'hybrid') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1216:  // Met (>5000 indexed), run a parallel search on summary embeddings and merge
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1217:  // Results. Pattern follows R12 embedding expansion: run in parallel, merge
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1224:          queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1279:                  channel: 'r8-summary-embeddings',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1335:              // raw row.score. For vector-only rows with only `similarity`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1345:                rrfScore: boostedScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1391:  // P1 fix: activeChannels counts actual retrieval channels (vector, keyword/BM25),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1392:  // while channelCount counts parallel query variants. In hybrid mode both vector
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1393:  // and keyword channels are always active regardless of query variant count.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1394:  const activeChannels = searchType === 'hybrid' ? 2 : 1;

exec
/bin/zsh -lc "rg -n \"memory_context|session_bootstrap|resume|compacting|compact|memory_match_triggers|trigger\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers -g '"'!**/dist/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:125:import { migrateLearnedTriggers, verifyFts5Isolation } from './lib/storage/learned-triggers-schema.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:163:  triggered: unknown[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:823:    const triggerMatcher = await import('./lib/parsing/trigger-matcher.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:824:    if (typeof triggerMatcher.clearCache === 'function') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:825:      triggerMatcher.clearCache();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:829:    console.error(`[context-server] Failed to clear trigger cache after DB reinit: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1622:        console.error(`[context-server] Learned triggers ready (migrated=${migrated}, fts5Isolated=${isolated})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1656:      console.error('[context-server] Auto-backfill triggered: %d rows seeded into active_memory_projection', result.seeded);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:26:  triggerPhrases?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:93:  triggerCacheCleared: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:268:        latencyMs: 0, triggerCacheCleared: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:8:// Feature catalog: BM25 trigger phrase re-index gate
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:24:import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:111:  // C2 FIX: Scope fields to prevent cross-scope trigger leaks
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:158:  memoryInfo: { filePath: string; title: string | null; triggerPhrases: string[] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:171:    console.warn('[memory-triggers] getTieredContent failed', {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:197:      tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:220:        tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:225:          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:243:  // Eval logger — capture trigger query at entry (fail-safe)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:249:      intent: 'trigger_match',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:254:  } catch (_error: unknown) { /* eval logging must never break triggers handler */ }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:263:          scores: memoryIds.map(() => 1.0), // trigger matches are binary
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:264:          fusionMethod: 'trigger',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:269:      /* eval logging must never break triggers handler */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:284:      console.warn('[memory_match_triggers] Decay failed:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:288:  const triggerMatchResult = triggerMatcher.matchTriggerPhrasesWithStats(prompt, limit * 2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:289:  let results: TriggerMatch[] = triggerMatchResult.matches;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:291:  // C2 FIX: Post-filter by scope to prevent cross-tenant trigger leaks
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:329:  const detectedSignals = Array.isArray(triggerMatchResult.stats?.signals)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:330:    ? triggerMatchResult.stats.signals
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:332:  const degradedTriggerMatching = triggerMatchResult.stats?.degraded ?? null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:336:      tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:337:      summary: 'No matching trigger phrases found',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:339:        matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:349:        'Ensure memories have trigger phrases defined',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:351:        ...(degradedTriggerMatching ? ['Trigger matching ran in degraded mode; inspect server logs for skipped trigger sources'] : []),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:374:        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:390:          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:450:        triggerPhrases: r.matchedPhrases
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:491:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:496:    : `Matched ${formattedResults.length} memories via trigger phrases`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:510:  const _triggersResponse = createMCPSuccessResponse({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:511:    tool: 'memory_match_triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:514:      matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:524:      triggerSignals: detectedSignals,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:529:  // Consumption instrumentation — log triggers event (fail-safe, never throws)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:536:        event_type: 'triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:544:  } catch (_error: unknown) { /* instrumentation must never cause triggers handler to fail */ }
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:546:  // Eval logger — capture final trigger results at exit (fail-safe)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:547:  const triggerMemoryIds = formattedResults.map(r => r.memoryId).filter(id => typeof id === 'number');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:548:  logFinalTriggerEval(triggerMemoryIds, latencyMs);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:550:  return _triggersResponse;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:565:  handle_memory_match_triggers,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:185:          triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:200:          triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:271:          trigger_phrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:59:  triggerPhrases?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:4:trigger_phrases:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:46:| `response-builder.ts`       | Final response assembly. `buildIndexResult` constructs the `IndexResult` with PE actions, causal links and warnings. `buildSaveResponse` wraps it in a standard MCP success envelope with hints, triggers post-mutation hooks and runs N3-lite consolidation. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:138:  triggerPhrases: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:147:      trigger_phrases: args.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:195:            triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:248:                  triggerPhrases: memory.triggerPhrases ?? [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:281:                      trigger_phrases: memory.triggerPhrases ?? [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:291:                      triggerPhrases: memory.triggerPhrases ?? [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:170:    triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:40:  trigger_phrases: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:95:    SELECT id, content_hash, embedding_status, trigger_phrases, quality_score, quality_flags
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:139:    trigger_phrases: string | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:145:  const persistedTriggerPhrases = parseJsonStringArray(existing.trigger_phrases);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:146:  if (!areEquivalentStringArrays(persistedTriggerPhrases, parsed.triggerPhrases)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:235:      triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:300:        triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:168:    triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:321:        latencyMs: 0, triggerCacheCleared: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:335:    triggerPhrases: result.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:417:      hints.push('Async embedding mode: immediate background attempt triggered, background retry manager as safety net');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:42:    triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:66:    triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:250:        latencyMs: 0, triggerCacheCleared: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:49:    triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:85:  if (triggerPhrases !== undefined) updateParams.triggerPhrases = triggerPhrases;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:151:      // T2-6 — BM25 index stores title + trigger phrases; must re-index when either changes
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:155:      if ((updateParams.title !== undefined || updateParams.triggerPhrases !== undefined) && bm25Index.isBm25Enabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:159:            'SELECT title, content_text, trigger_phrases, file_path FROM memory_index WHERE id = ?'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:160:          ).get(id) as { title: string | null; content_text: string | null; trigger_phrases: string | null; file_path: string | null } | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:208:          triggerPhrases: updateParams.triggerPhrases ?? null,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:249:      latencyMs: 0, triggerCacheCleared: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:4:// Phase 020: Composite MCP tool that merges memory resume context,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:409:  // ── Sub-call 1: Memory context resume (skip in minimal mode) ──
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:416:        input: 'resume previous work continue session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:417:        mode: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:418:        profile: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:471:  // Phase 027: Structural bootstrap contract for resume surface
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:479:  // Keep live resume authoritative; cached continuity only appends bounded notes when every gate passes.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:485:    hints.push('Cached continuity summary accepted as additive resume context.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:511:      key: 'memory-resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:560:    kind: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:591:      resumePayload: payloadContract,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:66:type MemoryTriggersModule = typeof import('./memory-triggers.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:80:type SessionResumeModule = typeof import('./session-resume.js');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:110:    memoryTriggersModule = loadHandlerModule<MemoryTriggersModule>('memory-triggers');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:208:    sessionResumeModule = loadHandlerModule<SessionResumeModule>('session-resume');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:224:// Memory triggers handlers
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:226:export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:320:export const handle_memory_context = lazyFunction(getMemoryContextModule, 'handle_memory_context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:331:// Session resume handler
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:4:// Phase 024 / Item 7: Composite tool that runs session_resume
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:7:import { handleSessionResume } from './session-resume.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:8:import type { CachedSessionSummaryDecision } from './session-resume.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:46:  resume: Record<string, unknown>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:95:  resumeData: Record<string, unknown>,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:101:  if (resumeData.error) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:102:    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:114:    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:155:    preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163:/** Handle session_bootstrap tool call — one-call session setup */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168:  // Sub-call 1: session_resume with full resume payload
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:169:  let resumeData: Record<string, unknown> = {};
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:171:    const resumeResponse = await handleSessionResume({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:174:    resumeData = extractData(resumeResponse);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:175:    allHints.push(...extractHints(resumeData));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:178:    resumeData = { error: message };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:179:    allHints.push('session_resume failed. Try calling it manually.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:202:  const cachedSummary = extractCachedSummary(resumeData);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:216:  const completeness = resumeData.error || healthData.error ? 'partial' : 'full';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:219:  const resumeCertainty: SharedPayloadCertainty = resumeData.error ? 'unknown' : 'estimated';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:224:  const resumePayload = coerceSharedPayloadEnvelope(resumeData.payloadContract);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:227:  const resumeStructuralTrust = extractStructuralTrustFromPayload(resumePayload);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:228:  if (!resumeData.error && !resumeStructuralTrust) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:236:    { label: 'session_bootstrap structural context payload' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:238:  const resumeWithTrust = resumeData.error
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:239:    ? resumeData
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:241:      resumeData,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:242:      resumeStructuralTrust,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:243:      { label: 'session_bootstrap resume payload' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:248:      key: 'resume-surface',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:250:      content: summarizeUnknown(resumeData),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:252:      certainty: resumeCertainty,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:280:      // which remains valid even when the remote resume surface fails closed.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:289:      content: buildNextActions(resumeData, healthData, structuralContext).join(' | '),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:299:      { label: 'resume', certainty: resumeCertainty },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:311:      sourceRefs: ['session-resume', 'session-health', 'session-snapshot'],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:324:    resume: resumeWithTrust,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:332:      resumePayload,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:338:    // Keep advisory routing guidance out of nextActions so bootstrap and resume
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:339:    // remain the authoritative recovery owners for startup and deep resume flows.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:340:    nextActions: buildNextActions(resumeData, healthData, structuralContext),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:4:import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:27:  let triggerCacheCleared = false;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:29:    triggerMatcher.clearCache();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:30:    triggerCacheCleared = true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:34:      `[mutation-hooks] triggerMatcher.clearCache failed for operation="${operation}":`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:37:    errors.push(`triggerMatcher.clearCache: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:38:    triggerCacheCleared = false;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:99:    triggerCacheCleared,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:120:    hints.push('Session has not been primed yet. Make any tool call to trigger auto-priming.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:128:    hints.push('No tool calls in >60 min. Consider calling `memory_context` to refresh session state.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:99:      error: 'Database not initialized. Run memory_index_scan() to trigger schema creation, or restart the MCP server.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:131:    const sql = `SELECT id, spec_folder, file_path, title, trigger_phrases, importance_weight, created_at, updated_at FROM memory_index ${whereClause} ORDER BY ${sortColumn} DESC LIMIT ? OFFSET ?`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:153:    triggerCount: safeJsonParseTyped<unknown[]>(row.trigger_phrases as string, 'array', []).length,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:16:import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:421:    'trigger_cache_refresh',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:470:            triggerMatcher.refreshTriggerCache();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:471:            repair.actions.push('trigger_cache_refresh');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:477:              hints.push('Auto-repair completed: FTS5 index rebuilt and trigger cache refreshed.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:12:import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:492:      triggerMatcher.refreshTriggerCache();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:12:import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:35:  triggerPhrases: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:52:  triggerPhrases?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:226:        triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:313:            triggerPhrases: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:327:            triggerPhrases: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:365:            trigger_phrases: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:465:    triggerMatcher.clearCache();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:473:      triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:577:      triggerMatcher.clearCache();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:584:        triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:601:        trigger_phrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:632:  // Otherwise stale trigger/tool-cache entries persist until next non-chunked save.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:633:  triggerMatcher.clearCache();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:641:    triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:276:        triggerPhrases: channelFlags.useTrigger ? undefined : [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:21:import { handleMemoryMatchTriggers } from './memory-triggers.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:60:// Feature catalog: Unified context retrieval (memory_context)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:97:  resumed: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:99:  resumedContextCount: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:127:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:146:  resumed: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:155:  resumeHeuristicApplied: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:439:  const compactStructuredResult = (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:593:        const compacted = compactStructuredResult(innerEnvelope, currentResults, contentArr);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:594:        if (compacted) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:596:            result: compacted.result,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:599:              actualTokens: compacted.actualTokens,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:649:  // Quick: Fast trigger-based matching for reactive context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:652:    description: 'Fast trigger matching for real-time context (low latency)',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:653:    strategy: 'triggers',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:674:  resume: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:677:    strategy: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:784:  const resumeAnchors = options.anchors || ['state', 'next-steps', 'summary', 'blockers'];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:787:    query: input || 'resume work continue session',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:798:    anchors: resumeAnchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:810:    strategy: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:811:    mode: 'resume',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:812:    resumeAnchors: resumeAnchors,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:837:      resumed: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:846:  const resumed = trustedSession.trusted;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:847:  const priorMode = resumed
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:850:  const counter = resumed
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:857:    resumed,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:883:  let resumeHeuristicApplied = false;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:898:    const hasResumeKeywords = /\b(resume|continue|pick up|where was i|what(?:'s| is) next)\b/i.test(normalizedInput);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:900:      session.resumed ||
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:901:      session.priorMode === 'resume' ||
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:909:      effectiveMode = 'resume';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:910:      resumeHeuristicApplied = true;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:942:      resumeHeuristicApplied,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:986:    case 'resume':
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1078:/** Handle memory_context tool — L1 orchestration layer that routes to optimal retrieval strategy.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1092:      tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1117:      tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1142:  if (requested_mode !== 'resume') {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1224:    resumed: resumedSession,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1231:      tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1244:    resumed: resumedSession,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1246:    resumedContextCount: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1250:  const layerInfo: LayerInfo | null = layerDefs.getLayerInfo('memory_context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1305:      resumed: resumedSession,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1314:    resumeHeuristicApplied,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1318:  // Phase C: Intent-to-profile auto-routing for memory_context.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1338:    resumedSession,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1343:    queryHeuristicApplied: resumeHeuristicApplied,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1375:      tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1393:      tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1425:  // M1 FIX: Inject auto-resume context BEFORE budget enforcement
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1434:  if (autoResumeEnabled && effectiveMode === 'resume' && resumedSession) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1435:    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1436:    if (resumeContextItems.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1437:      sessionLifecycle.resumedContextCount = resumeContextItems.length;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1438:      (tracedResult0 as Record<string, unknown>).systemPromptContext = resumeContextItems.map((item) => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1471:    tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1478:      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1497:        resumeHeuristicApplied,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1583:      tool: 'memory_context',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1584:      error: 'memory_context failed due to an internal error',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1606:const handle_memory_context = handleMemoryContext;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1609:  handle_memory_context,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:185:    triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:226:      const rejectScore = { total: 0, breakdown: { triggers: 0, anchors: 0, budget: 0, coherence: 0 }, issues: [`V-rule hard block: ${failedRuleIds.join(', ')}`] };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:243:          evidenceCounts: { primary: 0, support: 0, total: 0, semanticChars: 0, uniqueWords: 0, anchors: 0, triggerPhrases: 0 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:267:    parsed.triggerPhrases = qualityLoopResult.fixedTriggerPhrases;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:643:          triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:744:          triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1727:        latencyMs: 0, triggerCacheCleared: false,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:26:  triggerPhrases: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:53:  triggerPhrases?: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:265:      triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:318:    triggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:488:  // This is the ONLY place where scan-triggered mtime updates occur.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:52:      error: 'Database not initialized. Run memory_index_scan() to trigger schema creation, or restart the MCP server.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:129:  let triggerCount = 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:141:    const triggerResult = database.prepare("SELECT SUM(json_array_length(trigger_phrases)) as count FROM memory_index WHERE trigger_phrases IS NOT NULL AND trigger_phrases != '[]'").get() as Record<string, unknown>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:142:    triggerCount = (triggerResult && typeof triggerResult.count === 'number') ? triggerResult.count : 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:312:      totalTriggerPhrases: triggerCount,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:211:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:26:  triggers: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:57:function triggerPhrasesChanged(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:74:  triggers: 0.25,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:87: * Compute trigger phrase quality sub-score.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:89: * Evaluates whether the memory metadata declares enough trigger phrases for
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:90: * reliable retrieval via the `memory_match_triggers` tool. The scoring
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:92: *   - 0 phrases  → score 0.0  (memory will never surface via trigger matching)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:97: *   to contain a `triggerPhrases` key whose value is an array of strings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:103:  const triggers = Array.isArray(metadata.triggerPhrases) ? metadata.triggerPhrases : [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:104:  const count = triggers.length;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:108:    issues.push('No trigger phrases found');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:112:    issues.push(`Only ${count} trigger phrase(s) — 4+ recommended`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:372: *   - triggers  × 0.25
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:381: *   through to `scoreTriggerPhrases`; must contain a `triggerPhrases` key
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:386: *   - `breakdown` — Per-dimension raw sub-scores (`triggers`, `anchors`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:389: *     in order: triggers → anchors → budget → coherence.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:395:  const triggerResult = scoreTriggerPhrases(metadata);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:401:    triggerResult.score * QUALITY_WEIGHTS.triggers +
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:409:      triggers: triggerResult.score,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:415:      ...triggerResult.issues,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:427: * - Re-extract trigger phrases from content headings/title
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:442:  // Fix #1 : Re-extract trigger phrases if missing/insufficient
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:443:  const hasTriggerIssue = issues.some(i => /trigger phrase/i.test(i));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:445:    const existingTriggers = Array.isArray(fixedMetadata.triggerPhrases)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:446:      ? (fixedMetadata.triggerPhrases as string[])
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:451:      fixedMetadata.triggerPhrases = extracted;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:452:      fixed.push(`Re-extracted ${extracted.length} trigger phrases from content`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:482: * Extract trigger phrases from content by scanning headings and the title.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:492:  let triggers: string[] = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:494:  // Add title as a trigger if present
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:496:    triggers.push(title.trim().toLowerCase());
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:499:  // Extract markdown headings as triggers
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:504:    if (heading.length > 3 && heading.length < 80 && !triggers.includes(heading)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:505:      triggers.push(heading);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:510:  triggers = triggers.filter(t =>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:514:  return triggers.slice(0, 8); // Cap at 8 triggers
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:577: * @param metadata - Parsed memory metadata (must include triggerPhrases)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:658:        fixedTriggerPhrases: triggerPhrasesChanged(metadata.triggerPhrases, currentMetadata.triggerPhrases)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:659:          ? currentMetadata.triggerPhrases as string[]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:684:    fixedTriggerPhrases: triggerPhrasesChanged(metadata.triggerPhrases, bestMetadata.triggerPhrases)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:685:      ? bestMetadata.triggerPhrases as string[]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:4:trigger_phrases:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:30:- `memory-triggers.ts` - Trigger phrase matching, tiered content injection, and session-aware matching.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:47:- `code-graph/context.ts` - `code_graph_context`: LLM-oriented compact graph neighborhoods.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:70:- `memory-index.ts` and `mutation-hooks.ts` work together so index, update, and stale-delete flows clear trigger, constitutional, graph, co-activation, and degree caches.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:80:- Post-mutation invalidation clears `clearDegreeCache()` alongside trigger and constitutional caches so graph-derived retrieval signals cannot serve stale data after mutations.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:326:  // Auto-trigger: ensure graph is fresh before querying
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:12:| `context.ts` | `code_graph_context` | LLM-oriented compact graph neighborhoods |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts:4:// MCP tool handler for ccc_reindex — triggers incremental re-indexing.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:97:    // Auto-trigger: ensure graph is fresh before querying

exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
name: mcp-coco-index
description: "Semantic code search via vector embeddings. CocoIndex Code enables natural-language discovery of relevant code, patterns, and implementations. CLI for direct use; MCP exposes a single `search` tool for AI agent integration."
allowed-tools: [Bash, Read, Grep, Glob]
version: 1.0.0
---

<!-- Keywords: cocoindex-code, semantic-search, vector-embeddings, code-search, mcp-server, ccc, codebase-indexing, voyage-code-3, all-MiniLM-L6-v2 -->

# CocoIndex Code - Semantic Code Search via Vector Embeddings

Natural language code search through two complementary approaches: CLI (ccc) for speed and one-off queries, MCP server (1 tool: `search`) for AI agent integration via stdio transport.


<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

**Use when**:
- User asks to "find code that does X" or "search for implementations of Y"
- User needs to discover code by concept or intent rather than exact text
- User wants to find similar code patterns across the codebase
- Grep/Glob exact matching is insufficient and fuzzy or semantic matching is needed
- User mentions "semantic search", "code search", "find similar code"
- User needs to locate logic handling a specific concern (e.g., "where is the retry logic")
- User wants to understand how a concept is implemented across multiple files
- User asks "how is X implemented" or "what handles Y"
- User wants to understand architecture or module relationships
- Starting work on an unfamiliar part of the codebase (onboarding queries)
- @context agent is exploring code structure and needs concept-based discovery
- Any exploration task where the exact function/class name is unknown

**Automatic Triggers**:
- "semantic search", "find code that", "search for implementations"
- "similar code", "code that handles", "where is the logic for"
- "cocoindex", "ccc", "vector search"
- "find similar", "code search", "search codebase"
- "how is", "what handles", "where does", "understand the"
- "explore", "architecture", "module relationships"
- "onboarding", "unfamiliar code", "new to this"

### When NOT to Use

**Do not use for**:
- Exact text or regex search (use Grep instead)
- File name or path search (use Glob instead)
- Reading known files (use Read instead)
- The codebase has not been indexed yet (run `ccc index` first)
- Simple string matching where the exact token is known
- Non-code files (semantic search is optimized for source code)

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Resource Loading Levels

| Level       | When to Load             | Resources                                   |
| ----------- | ------------------------ | ------------------------------------------- |
| ALWAYS      | Every skill invocation   | references/tool_reference.md                |
| CONDITIONAL | If intent signals match  | references/search_patterns.md, references/cross_cli_playbook.md |
| ON_DEMAND   | Only on explicit request | Full troubleshooting and configuration docs |

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/tool_reference.md"

INTENT_SIGNALS = {
    "SEARCH": {"weight": 4, "keywords": ["search", "find", "where", "similar", "semantic", "code that"]},
    "INDEX": {"weight": 4, "keywords": ["index", "reindex", "update index", "build index", "refresh"]},
    "INSTALL": {"weight": 4, "keywords": ["install", "setup", "configure", "ccc not found"]},
    "STATUS": {"weight": 3, "keywords": ["status", "stats", "how many files", "indexed"]},
    "TROUBLESHOOT": {"weight": 3, "keywords": ["error", "failed", "not working", "empty results"]},
    "CROSS_CLI": {"weight": 3, "keywords": ["copilot", "gemini", "claude", "codex", "cross cli", "multi query"]},
    "CONCURRENCY": {"weight": 3, "keywords": ["refresh_index", "concurrency", "concurrent", "follow-up query"]},
}

RESOURCE_MAP = {
    "SEARCH": ["references/search_patterns.md", "references/cross_cli_playbook.md", "references/tool_reference.md"],
    "INDEX": ["references/tool_reference.md"],
    "INSTALL": ["references/tool_reference.md"],
    "STATUS": ["references/tool_reference.md"],
    "TROUBLESHOOT": ["references/tool_reference.md", "references/cross_cli_playbook.md", "references/search_patterns.md"],
    "CROSS_CLI": ["references/cross_cli_playbook.md", "references/tool_reference.md"],
    "CONCURRENCY": ["references/cross_cli_playbook.md", "references/tool_reference.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full troubleshooting", "all commands", "configuration guide", "cross cli playbook"],
    "ON_DEMAND": ["references/tool_reference.md", "references/search_patterns.md", "references/cross_cli_playbook.md"],
}

def _task_text(task) -> str:
    parts = [
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]
    return " ".join(parts).lower()

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def score_intents(task) -> dict[str, float]:
    """Weighted intent scoring from request text and capability signals."""
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    if getattr(task, "has_error", False):
        scores["TROUBLESHOOT"] += 4
    if getattr(task, "index_missing", False):
        scores["INDEX"] += 5
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["SEARCH"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_cocoindex_code_resources(task):
    inventory = discover_markdown_resources()
    intents = select_intents(score_intents(task), ambiguity_delta=1.0)
    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    for relative_path in LOADING_LEVELS["ALWAYS"]:
        load_if_available(relative_path)
    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    text = _task_text(task)
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    return {"intents": intents, "resources": loaded}
```

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Two Approaches

CocoIndex Code provides two access patterns for semantic code search:

1. **CLI (ccc)** - Direct terminal usage, fastest for one-off searches
2. **MCP server** - AI agent integration via `ccc mcp` (stdio mode)

### CLI Approach (Primary) - CocoIndex Code CLI

#### Semantic Search

```bash
# Basic semantic search
ccc search "error handling middleware" --limit 5

# Filter by language
ccc search "database connection" --lang typescript

# Filter by path
ccc search "authentication" --path "src/**"

# Combine filters
ccc search "retry logic" --lang python --path "lib/**" --limit 10
```

#### Index Management

```bash
# Check index status
ccc status

# Build or update the index
ccc index

# Reset project databases (destructive)
ccc reset

mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
codex
I’ve got the first comparison axis now: Mnemosyne uses a very thin semantic wrapper with an aggressively simple lexical fallback story, while Public already has multiple retrieval lanes and routing surfaces. I’m pulling the exact pipeline branches and thresholds next so the final recommendation can say when to prefer `trigger`, `lexical`, `hybrid`, `resume`, or CocoIndex rather than just “use both.”
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '110,220p;320,520p;680,760p;972,1125p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   680	
   681	function getAllowedChannels(options: HybridSearchOptions): Set<ChannelName> {
   682	  const allowed = new Set<ChannelName>(['vector', 'fts', 'graph', 'degree']);
   683	
   684	  if (isBm25Enabled()) {
   685	    allowed.add('bm25');
   686	  }
   687	
   688	  if (options.useVector === false) allowed.delete('vector');
   689	  if (options.useBm25 === false) allowed.delete('bm25');
   690	  if (options.useFts === false) allowed.delete('fts');
   691	  if (options.useGraph === false) {
   692	    allowed.delete('graph');
   693	    allowed.delete('degree');
   694	  }
   695	
   696	  return allowed;
   697	}
   698	
   699	function applyAllowedChannelOverrides(
   700	  options: HybridSearchOptions,
   701	  allowedChannels: Set<ChannelName>,
   702	  overrides: Partial<HybridSearchOptions> = {}
   703	): HybridSearchOptions {
   704	  return {
   705	    ...options,
   706	    ...overrides,
   707	    useVector: allowedChannels.has('vector'),
   708	    useBm25: allowedChannels.has('bm25'),
   709	    useFts: allowedChannels.has('fts'),
   710	    useGraph: allowedChannels.has('graph'),
   711	  };
   712	}
   713	
   714	type FallbackPlanKind = 'adaptive' | 'tiered';
   715	type FallbackStageName = 'primary' | 'retry';
   716	
   717	interface FallbackPlanStage {
   718	  stage: FallbackStageName;
   719	  options: HybridSearchOptions;
   720	  results: HybridSearchResult[];
   721	  execution: HybridFusionExecution | null;
   722	  trigger?: 'empty' | DegradationTrigger;
   723	}
   724	
   725	interface FallbackPlanExecution {
   726	  allowedChannels: Set<ChannelName>;
   727	  stages: FallbackPlanStage[];
   728	}
   729	
   730	interface HybridFusionExecution {
   731	  evaluationMode: boolean;
   732	  intent: string;
   733	  lists: Array<{
   734	    source: string;
   735	    results: Array<{ id: number | string; [key: string]: unknown }>;
   736	    weight?: number;
   737	  }>;
   738	  routeResult: ReturnType<typeof routeQuery>;
   739	  budgetResult: ReturnType<typeof getDynamicTokenBudget>;
   740	  s3meta: Sprint3PipelineMeta;
   741	  fusedResults: HybridSearchResult[];
   742	  vectorEmbeddingCache: Map<number, Float32Array>;
   743	}
   744	
   745	function markFallbackRetry(results: HybridSearchResult[]): HybridSearchResult[] {
   746	  for (const result of results) {
   747	    (result as Record<string, unknown>).fallbackRetry = true;
   748	  }
   749	
   750	  return results;
   751	}
   752	
   753	function toEmbeddingBufferView(value: unknown): Float32Array | null {
   754	  if (value instanceof Float32Array) {
   755	    return value;
   756	  }
   757	
   758	  if (Array.isArray(value)) {
   759	    const asNumbers = value.every((entry) => typeof entry === 'number' && Number.isFinite(entry));
   760	    return asNumbers ? new Float32Array(value) : null;
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | sed -n '500,920p;1076,1115p;1388,1396p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   500	  //
   501	  // When SPECKIT_GRAPH_CONCEPT_ROUTING is enabled, extract noun phrases from
   502	  // the query and match them against the concept alias table. If concepts are
   503	  // matched, log them to the trace for downstream use (graph channel activation
   504	  // is surfaced via trace metadata; actual graph channel is handled in Stage 2).
   505	  //
   506	  // Phase B T016: When SPECKIT_QUERY_CONCEPT_EXPANSION is also enabled,
   507	  // matched concepts are reverse-mapped to their alias terms and appended to
   508	  // the query for the hybrid search channel, improving recall for alias-rich
   509	  // queries (e.g. "semantic search" → also searches "retrieval", "query", etc.).
   510	  //
   511	  // Fail-open: any error leaves candidates unchanged.
   512	
   513	  /** Effective query for hybrid search — may be expanded by concept routing. */
   514	  let effectiveQuery = query;
   515	
   516	  if (isGraphConceptRoutingEnabled() && searchType === 'hybrid') {
   517	    try {
   518	      let routingDb: Parameters<typeof routeQueryConcepts>[1];
   519	      try {
   520	        routingDb = requireDb();
   521	      } catch (_dbErr: unknown) {
   522	        routingDb = undefined;
   523	      }
   524	      const routing = routeQueryConcepts(query, routingDb);
   525	      if (routing.graphActivated && routing.concepts.length > 0) {
   526	        // Phase B T016: Expand query with concept alias terms
   527	        if (isQueryConceptExpansionEnabled()) {
   528	          try {
   529	            const originalTokens = nounPhrases(query);
   530	            const expansionTerms = getConceptExpansionTerms(
   531	              routing.concepts,
   532	              originalTokens,
   533	              5,
   534	            );
   535	            if (expansionTerms.length > 0) {
   536	              effectiveQuery = `${query} ${expansionTerms.join(' ')}`;
   537	              if (trace) {
   538	                addTraceEntry(trace, 'candidate', 0, 0, 0, {
   539	                  channel: 'd2-concept-expansion',
   540	                  originalQuery: query,
   541	                  expandedQuery: effectiveQuery,
   542	                  expansionTerms,
   543	                  matchedConcepts: routing.concepts,
   544	                });
   545	              }
   546	            }
   547	          } catch (expansionErr: unknown) {
   548	            const expansionMsg = expansionErr instanceof Error ? expansionErr.message : String(expansionErr);
   549	            console.warn(`[stage1-candidate-gen] D2 concept expansion failed (fail-open): ${expansionMsg}`);
   550	          }
   551	        }
   552	
   553	        if (trace) {
   554	          addTraceEntry(trace, 'candidate', 0, 0, 0, {
   555	            channel: 'd2-concept-routing',
   556	            matchedConcepts: routing.concepts,
   557	            graphActivated: true,
   558	          });
   559	        }
   560	      }
   561	    } catch (routingErr: unknown) {
   562	      const routingMsg = routingErr instanceof Error ? routingErr.message : String(routingErr);
   563	      console.warn(`[stage1-candidate-gen] D2 concept routing failed: ${routingMsg}`);
   564	    }
   565	  }
   566	
   567	  // -- Channel: Multi-Concept --------------------------------------------------
   568	
   569	  if (searchType === 'multi-concept' && Array.isArray(concepts) && concepts.length >= 2) {
   570	    // Validate concept list: 2-5 non-empty strings
   571	    if (concepts.length > 5) {
   572	      throw new Error('[stage1-candidate-gen] Maximum 5 concepts allowed for multi-concept search');
   573	    }
   574	
   575	    for (const concept of concepts) {
   576	      if (typeof concept !== 'string' || concept.trim().length === 0) {
   577	        throw new Error('[stage1-candidate-gen] Each concept must be a non-empty string');
   578	      }
   579	    }
   580	
   581	    // Generate one embedding per concept
   582	    const conceptEmbeddings: Float32Array[] = [];
   583	    for (const concept of concepts) {
   584	      const emb = await embeddings.generateQueryEmbedding(concept);
   585	      if (!emb) {
   586	        throw new Error(
   587	          `[stage1-candidate-gen] Failed to generate embedding for concept: "${concept}"`
   588	        );
   589	      }
   590	      conceptEmbeddings.push(emb);
   591	    }
   592	
   593	    channelCount = 1;
   594	    candidates = vectorIndex.multiConceptSearch(conceptEmbeddings, {
   595	      minSimilarity: MULTI_CONCEPT_MIN_SIMILARITY,
   596	      limit,
   597	      specFolder,
   598	      includeArchived,
   599	    }) as PipelineRow[];
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
  1076	
  1077	  // -- D2 REQ-D2-003: Corpus-Grounded LLM Reformulation ----------------------
  1078	  //
  1079	  // When SPECKIT_LLM_REFORMULATION is enabled and mode === 'deep':
  1080	  //   1. Retrieve top-3 seed results via fast BM25/FTS5 (no embedding call).
  1081	  //   2. Ask the LLM to produce a step-back abstraction + corpus-grounded variants.
  1082	  //   3. Fan-out [original, abstract, ...variants] as additional hybrid search channels.
  1083	  //   4. Deduplicate and merge into candidates.
  1084	  //
  1085	  // Budget: 1 LLM call per cache miss (0 on cache hit).
  1086	  // Fail-open: any error leaves candidates unchanged.
  1087	
  1088	  if (mode === 'deep' && isLlmReformulationEnabled() && searchType === 'hybrid') {
  1089	    try {
  1090	      const seeds = cheapSeedRetrieve(query, { limit: 3 });
  1091	      const reform = await llm.rewrite({ q: query, seeds, mode: 'step_back+corpus' });
  1092	      const allQueries = fanout([query, reform.abstract, ...reform.variants]);
  1093	
  1094	      if (allQueries.length > 1) {
  1095	        const reformEmbedding: Float32Array | number[] | null =
  1096	          cachedEmbedding ?? queryEmbedding ?? (await embeddings.generateQueryEmbedding(query));
  1097	
  1098	        if (reformEmbedding) {
  1099	          // FIX #7: Use Promise.allSettled so one failing reformulation
  1100	          // branch does not discard results from all other branches.
  1101	          const reformSettledResults = await Promise.allSettled(
  1102	            allQueries.map(async (q, idx): Promise<PipelineRow[]> => {
  1103	              // Reuse cached embedding for original query (idx 0); generate fresh for variants
  1104	              const emb = idx === 0 ? reformEmbedding : await embeddings.generateQueryEmbedding(q);
  1105	              if (!emb) {
  1106	                console.warn('[stage1-candidate-gen] LLM reform embedding generation returned null');
  1107	                return [];
  1108	              }
  1109	              return hybridSearch.collectRawCandidates(
  1110	                q,
  1111	                emb,
  1112	                { limit, specFolder, includeArchived }
  1113	              ) as Promise<PipelineRow[]>;
  1114	            })
  1115	          );
  1388	    );
  1389	  }
  1390	
  1391	  // P1 fix: activeChannels counts actual retrieval channels (vector, keyword/BM25),
  1392	  // while channelCount counts parallel query variants. In hybrid mode both vector
  1393	  // and keyword channels are always active regardless of query variant count.
  1394	  const activeChannels = searchType === 'hybrid' ? 2 : 1;
  1395	
  1396	  return {

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '640,705p;780,820p;898,915p;1425,1479p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '184,360p;496,525p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   521	    startTime: startTime,
   522	    extraMeta: {
   523	      latencyMs: latencyMs,
   524	      triggerSignals: detectedSignals,
   525	      ...(degradedTriggerMatching ? { degradedMatching: degradedTriggerMatching } : {}),

 succeeded in 0ms:
   640	
   641	const CONTEXT_MODES: Record<string, ContextMode> = {
   642	  // Auto-detect: Let the system determine the best approach
   643	  auto: {
   644	    name: 'Auto',
   645	    description: 'Automatically detect intent and route to optimal strategy',
   646	    strategy: 'adaptive'
   647	  },
   648	
   649	  // Quick: Fast trigger-based matching for reactive context
   650	  quick: {
   651	    name: 'Quick',
   652	    description: 'Fast trigger matching for real-time context (low latency)',
   653	    strategy: 'triggers',
   654	    tokenBudget: 800
   655	  },
   656	
   657	  // Deep: Comprehensive semantic search with full context
   658	  deep: {
   659	    name: 'Deep',
   660	    description: 'Semantic search with full context retrieval',
   661	    strategy: 'search',
   662	    tokenBudget: 3500
   663	  },
   664	
   665	  // Focused: Intent-specific search with optimized weights
   666	  focused: {
   667	    name: 'Focused',
   668	    description: 'Intent-aware search with task-specific optimization',
   669	    strategy: 'intent-search',
   670	    tokenBudget: 3000
   671	  },
   672	
   673	  // Resume: Session recovery mode
   674	  resume: {
   675	    name: 'Resume',
   676	    description: 'Resume previous work with state and next-steps anchors',
   677	    strategy: 'resume',
   678	    tokenBudget: 2000
   679	  }
   680	};
   681	
   682	/* ───────────────────────────────────────────────────────────────
   683	   4. INTENT-TO-MODE ROUTING
   684	──────────────────────────────────────────────────────────────── */
   685	
   686	const INTENT_TO_MODE: Record<string, string> = {
   687	  add_feature: 'deep',
   688	  fix_bug: 'focused',
   689	  refactor: 'deep',
   690	  security_audit: 'deep',
   691	  understand: 'focused',
   692	  find_spec: 'deep',
   693	  find_decision: 'focused'
   694	};
   695	
   696	/* ───────────────────────────────────────────────────────────────
   697	   5. CONTEXT STRATEGY EXECUTORS
   698	──────────────────────────────────────────────────────────────── */
   699	
   700	async function executeQuickStrategy(input: string, options: ContextOptions): Promise<ContextResult> {
   701	  const result = await handleMemoryMatchTriggers({
   702	    prompt: input,
   703	    specFolder: options.specFolder,
   704	    tenantId: options.tenantId,
   705	    userId: options.userId,
   780	  };
   781	}
   782	
   783	async function executeResumeStrategy(input: string, intent: string | null, options: ContextOptions): Promise<ContextResult> {
   784	  const resumeAnchors = options.anchors || ['state', 'next-steps', 'summary', 'blockers'];
   785	
   786	  const result = await handleMemorySearch({
   787	    query: input || 'resume work continue session',
   788	    specFolder: options.specFolder,
   789	    folderBoost: options.folderBoost,
   790	    tenantId: options.tenantId,
   791	    userId: options.userId,
   792	    agentId: options.agentId,
   793	    sharedSpaceId: options.sharedSpaceId,
   794	    limit: options.limit || 5,
   795	    includeConstitutional: false,
   796	    includeContent: true,
   797	    includeTrace: options.includeTrace || false, // CHK-040
   798	    anchors: resumeAnchors,
   799	    sessionId: options.sessionId,
   800	    sessionTransition: options.sessionTransition,
   801	    enableDedup: false,
   802	    profile: options.profile,
   803	    intent: intent ?? undefined,
   804	    autoDetectIntent: intent ? false : true,
   805	    useDecay: false,
   806	    // minState omitted — memoryState column not yet in schema
   807	  });
   808	
   809	  return {
   810	    strategy: 'resume',
   811	    mode: 'resume',
   812	    resumeAnchors: resumeAnchors,
   813	    ...result
   814	  };
   815	}
   816	
   817	/* ───────────────────────────────────────────────────────────────
   818	   6. HANDLER HELPERS
   819	──────────────────────────────────────────────────────────────── */
   820	
   898	    const hasResumeKeywords = /\b(resume|continue|pick up|where was i|what(?:'s| is) next)\b/i.test(normalizedInput);
   899	    const hasResumeContext =
   900	      session.resumed ||
   901	      session.priorMode === 'resume' ||
   902	      (
   903	        Boolean(args.specFolder) &&
   904	        normalizedInput.length <= 120 &&
   905	        /\b(next(?:\s+steps?)?|status|state|blockers|where\b|left off|what changed)\b/i.test(normalizedInput)
   906	      );
   907	
   908	    if (hasResumeKeywords || hasResumeContext) {
   909	      effectiveMode = 'resume';
   910	      resumeHeuristicApplied = true;
   911	    }
   912	
   913	    const prePressureMode = effectiveMode;
   914	    if (pressurePolicy.level === 'quick') {
   915	      pressureOverrideTargetMode = 'quick';
  1425	  // M1 FIX: Inject auto-resume context BEFORE budget enforcement
  1426	  // so the final response respects the advertised token budget.
  1427	  const tracedResult0: ContextResult = effectiveMode === 'quick' && options.includeTrace === true
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
  1446	  }
  1447	
  1448	  // T205: Enforce token budget AFTER all context injection
  1449	  const { result: budgetedResult, enforcement } = enforceTokenBudget(tracedResult0, effectiveBudget);
  1450	  const tracedResult = budgetedResult;
  1451	
  1452	  // Phase 020: Attach graph context and query-intent routing metadata
  1453	  const responseData: ContextResult & Record<string, unknown> = { ...tracedResult };
  1454	  if (graphContextResult) {
  1455	    responseData.graphContext = graphContextResult;
  1456	  }
  1457	  if (queryIntentMetadata) {
  1458	    responseData.queryIntentRouting = queryIntentMetadata;
  1459	  }
  1460	  const structuralRoutingNudge = buildStructuralRoutingNudge(
  1461	    normalizedInput,
  1462	    queryIntentMetadata,
  1463	    graphContextResult,
  1464	  );
  1465	  if (structuralRoutingNudge) {
  1466	    responseData.structuralRoutingNudge = structuralRoutingNudge;
  1467	  }
  1468	
  1469	  // Build response with layer metadata
  1470	  const _contextResponse = createMCPResponse({
  1471	    tool: 'memory_context',
  1472	    summary: enforcement.truncated
  1473	      ? `Context retrieved via ${effectiveMode} mode (${tracedResult.strategy} strategy) [truncated${enforcement.originalResultCount !== undefined ? `: ${enforcement.originalResultCount} → ${enforcement.returnedResultCount} results` : ''} to fit ${effectiveBudget} token budget]`
  1474	      : `Context retrieved via ${effectiveMode} mode (${tracedResult.strategy} strategy)`,
  1475	    data: responseData,
  1476	    hints: [
  1477	      `Mode: ${CONTEXT_MODES[effectiveMode].description}`,
  1478	      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
  1479	      `Token budget: ${effectiveBudget} (${effectiveMode} mode)`,

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '759,789p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
The interesting pattern in Public is that lexical isn’t a single thing: there’s trigger matching, weighted FTS, in-memory BM25, cheap seed retrieval, and resume-anchor lookup. That means the best answer here is probably a routing matrix, not a single fused score policy.
exec
/bin/zsh -lc 'nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc 'nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md | sed -n '1,140p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js | sed -n '150,260p;430,560p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc 'rg -n "cheapSeedRetrieve|title 10x|trigger_phrases 5x|No memories found|format plain|core|memory_recall|memory_store|global collection|semantic search|offline|Reciprocal Rank Fusion|snowflake-arctic|memory tools" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:21://   - Quality score filtering
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:28://     - candidates contains raw channel scores; vector hits may include an
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:37:import { resolveEffectiveScore } from './types.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:50:import { withTimeout } from '../../errors/core.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:51:import { computeBackfillQualityScore } from '../../validation/save-quality-gate.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:59:import { cheapSeedRetrieve, llm, fanout } from '../llm-reformulation.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:92: * Filter results by a minimum quality score threshold.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:96: * - Rows with a missing or non-finite `quality_score` are treated as 0.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:99: * @param threshold - Minimum quality score in [0, 1] (inclusive).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:102:function filterByMinQualityScore(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:113:    const rawScore = row.quality_score as number | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:114:    const score =
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:115:      typeof rawScore === 'number' && Number.isFinite(rawScore) ? rawScore : 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:116:    return score >= clampedThreshold;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:120:function backfillMissingQualityScores(results: PipelineRow[]): PipelineRow[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:122:    if (row.quality_score !== 0 && row.quality_score != null) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:128:      quality_score: computeBackfillQualityScore(row),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:200:function readFiniteScoreMap(value: unknown): Record<string, number> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:206:  for (const [key, score] of Object.entries(value as Record<string, unknown>)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:207:    if (typeof score === 'number' && Number.isFinite(score)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:208:      normalized[key] = score;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:214:function mergeScoreMaps(...maps: Array<Record<string, number>>): Record<string, number> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:217:    for (const [key, score] of Object.entries(map)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:218:      if (!(key in merged) || score > merged[key]!) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:219:        merged[key] = score;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:234:function getCandidateSourceScores(row: PipelineRow): Record<string, number> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:235:  const sourceScores = readFiniteScoreMap(row.sourceScores);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:236:  if (Object.keys(sourceScores).length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:237:    return sourceScores;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:240:  const resolvedScore = resolveEffectiveScore(row);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:241:  if (resolvedScore <= 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:245:  const fallbackScores: Record<string, number> = {};
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:247:    fallbackScores[source] = resolvedScore;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:249:  return fallbackScores;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:252:function annotateBranchScore(row: PipelineRow, branchLabel: string): Record<string, number> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:253:  const existingBranchScores = readFiniteScoreMap(row.stage1BranchScores);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:254:  const effectiveScore = resolveEffectiveScore(row);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:255:  if (branchLabel.length === 0 || !Number.isFinite(effectiveScore)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:256:    return existingBranchScores;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:258:  return mergeScoreMaps(existingBranchScores, { [branchLabel]: effectiveScore });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:266:  const incomingBranchScores = annotateBranchScore(incoming, branchLabel);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:274:      sourceScores: Object.keys(getCandidateSourceScores(incoming)).length > 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:275:        ? getCandidateSourceScores(incoming)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:276:        : incoming.sourceScores,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:277:      stage1BranchScores: Object.keys(incomingBranchScores).length > 0 ? incomingBranchScores : undefined,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:278:      stage1BranchCount: Object.keys(incomingBranchScores).length || incoming.stage1BranchCount,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:283:  const existingScore = resolveEffectiveScore(existing);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:284:  const incomingScore = resolveEffectiveScore(incoming);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:285:  const primary = incomingScore > existingScore ? incoming : existing;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:294:  const mergedSourceScores = mergeScoreMaps(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:295:    getCandidateSourceScores(existing),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:296:    getCandidateSourceScores(incoming),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:298:  const mergedBranchScores = mergeScoreMaps(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:299:    readFiniteScoreMap(existing.stage1BranchScores),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:300:    incomingBranchScores,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:313:    sourceScores: Object.keys(mergedSourceScores).length > 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:314:      ? mergedSourceScores
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:315:      : primary.sourceScores,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:316:    stage1BranchScores: Object.keys(mergedBranchScores).length > 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:317:      ? mergedBranchScores
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:318:      : primary.stage1BranchScores,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:319:    stage1BranchCount: Object.keys(mergedBranchScores).length || primary.stage1BranchCount,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:509:  // queries (e.g. "semantic search" → also searches "retrieval", "query", etc.).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:847:            // So baseline scores dominate when the same memory appears in both.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1072:  // -- Quality Score Filtering ------------------------------------------------
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1074:  candidates = backfillMissingQualityScores(candidates);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1075:  candidates = filterByMinQualityScore(candidates, qualityThreshold);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1090:      const seeds = cheapSeedRetrieve(query, { limit: 3 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1133:              rows = backfillMissingQualityScores(rows);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1134:              rows = filterByMinQualityScore(rows, qualityThreshold);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1191:        newHydeCandidates = backfillMissingQualityScores(newHydeCandidates);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1192:        newHydeCandidates = filterByMinQualityScore(newHydeCandidates, qualityThreshold);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1240:                `SELECT id, title, spec_folder, file_path, importance_tier, importance_weight, quality_score, created_at, is_archived, context_type, tenant_id, user_id, agent_id, session_id, shared_space_id FROM memory_index WHERE id IN (${placeholders})`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1251:                      score: sr.similarity,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1270:            const backfilledSummaryHits = backfillMissingQualityScores(scopeFilteredSummaryHits);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1271:            const filteredSummaryHits = filterByMinQualityScore(backfilledSummaryHits, qualityThreshold);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1298:  // a surrogate match above MIN_MATCH_THRESHOLD receive a score boost (additive,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1302:  // only existing ones are re-scored. No LLM calls on this path.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1332:            if (matchResult.score > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1334:              // FIX #2: Use resolveEffectiveScore() as the base instead of
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1335:              // raw row.score. For vector-only rows with only `similarity`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1336:              // row.score may be undefined/0 while similarity is 0.82+.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1339:              const currentScore = resolveEffectiveScore(row);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1340:              const boost = Math.min(matchResult.score * SURROGATE_BOOST_CAP, SURROGATE_BOOST_CAP);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1341:              const boostedScore = Math.min(1, currentScore + boost);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1344:                score: boostedScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1345:                rrfScore: boostedScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1346:                intentAdjustedScore: boostedScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1418:  filterByMinQualityScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:96:      memory_recall: tool({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:114:          return result.trim() || "No memories found.";
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:118:      memory_recall_global: tool({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:138:      memory_store: tool({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:140:          "Store a project memory: a decision, preference, or important context. One concise concept per memory. Set core=true for critical context that should always be available in every session (use sparingly).",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:143:          core: tool.schema.boolean().optional().describe(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:150:          if (args.core) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:151:            cmdArgs.push("--tag", "core");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:160:      memory_store_global: tool({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:162:          "Store a cross-project memory: personal preferences, coding style, tool choices. Set core=true for critical cross-project context that should always be available.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:165:          core: tool.schema.boolean().optional().describe(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:171:          // Ensure the global collection exists.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:179:            await log.info("Ensured global collection exists.");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:182:            await log.warn(`Failed to auto-init global collection: ${e}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:185:          if (args.core) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:186:            cmdArgs.push("--tag", "core");
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:213:You have persistent memory tools: memory_recall, memory_store, memory_delete,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:214:memory_recall_global, memory_store_global.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts:220:- Use **core** for facts that should always be in context (project architecture, key conventions, user preferences).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:22:  isDocscoreAggregationEnabled,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:27:import { computeDegreeScores } from './graph-search-fn.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:52:  computeFolderRelevanceScores,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:53:  enrichResultsWithFolderScores,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:116:   * Normalized relevance score (0-1). Semantics depend on `source`:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:119:   * - `'fts'` — FTS5 rank score (absolute value, min-max normalized per source group)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:122:   * After hybrid merge, all source scores are min-max normalized to 0-1 within
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:125:  score: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:142:  const scoreCandidate = (result as { score?: unknown }).score;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:147:    score: typeof scoreCandidate === 'number' ? scoreCandidate : result.rrfScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:202:  topScore: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:218: * Raw RRF scores are typically small decimals (often <0.05), so a
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:220: * pair it with a relative-gap check to avoid score-scale coupling.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:224:/** Minimum relative separation between top-1 and top-2 scores. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:324: * @returns Array of BM25-scored results tagged with source 'bm25'.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:392:      .map((r: { id: string; score: number }) => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:448: * @returns Array of FTS-scored results tagged with source 'fts'.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:464:    // (title 10x, trigger_phrases 5x, file_path 2x, content 1x)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:471:      score: row.fts_score || 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:484: * Merge FTS and BM25 search results, deduplicating by ID and preferring FTS scores.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:487: * @returns Deduplicated array of merged results sorted by score descending.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:496:  // Merge by canonical ID, prefer FTS scores.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:513:    .sort((a, b) => b.score - a.score)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:522:function resolveRawCandidateScore(result: { score?: unknown; similarity?: unknown }): number {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:523:  if (typeof result.score === 'number' && Number.isFinite(result.score)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:524:    return result.score;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:542:function getCandidateSourceScores(result: HybridSearchResult): Record<string, number> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:543:  const sourceScores = (result as { sourceScores?: unknown }).sourceScores;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:544:  if (sourceScores && typeof sourceScores === 'object' && !Array.isArray(sourceScores)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:545:    const normalizedScores: Record<string, number> = {};
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:546:    for (const [source, score] of Object.entries(sourceScores as Record<string, unknown>)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:547:      if (typeof score === 'number' && Number.isFinite(score)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:548:        normalizedScores[source] = score;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:551:    return normalizedScores;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:554:  const fallbackScores: Record<string, number> = {};
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:555:  const resultScore = typeof result.score === 'number' && Number.isFinite(result.score)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:556:    ? result.score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:559:    fallbackScores[source] = resultScore;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:561:  return fallbackScores;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:575:      sourceScores: getCandidateSourceScores(incoming),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:580:  const existingScore = typeof existing.score === 'number' && Number.isFinite(existing.score)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:581:    ? existing.score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:583:  const incomingScore = typeof incoming.score === 'number' && Number.isFinite(incoming.score)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:584:    ? incoming.score
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:586:  const primary = incomingScore > existingScore ? incoming : existing;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:594:  const mergedScore = Math.max(0, Math.min(1, Math.max(existingScore, incomingScore) + crossChannelBonus));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:599:    score: mergedScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:603:    sourceScores: {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:604:      ...getCandidateSourceScores(existing),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:605:      ...getCandidateSourceScores(incoming),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:620:    const scored = list.results.map((result) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:621:      const rawScore = resolveRawCandidateScore(result as { score?: unknown; similarity?: unknown });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:622:      return { result, rawScore };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:627:    for (const { rawScore } of scored) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:628:      if (rawScore < min) min = rawScore;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:629:      if (rawScore > max) max = rawScore;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:633:    for (const { result, rawScore } of scored) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:634:      const normalizedScore = range > 0 ? (rawScore - min) / range : (rawScore > 0 ? 1.0 : 0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:639:        score: normalizedScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:641:        sourceScores: { [list.source]: normalizedScore },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:651:      const aScore = typeof a.score === 'number' && Number.isFinite(a.score) ? a.score : 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:652:      const bScore = typeof b.score === 'number' && Number.isFinite(b.score) ? b.score : 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:653:      return bScore - aScore;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:673:      const aScore = typeof a.score === 'number' && Number.isFinite(a.score) ? a.score : 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:674:      const bScore = typeof b.score === 'number' && Number.isFinite(b.score) ? b.score : 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:675:      return bScore - aScore;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:885:          score: (r.similarity as number) || 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:915:          score: (r.score as number) || 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:925:  // Normalize scores per source before merging so one method's raw scale
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:937:    const scores = group.map(r => r.score);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:940:    for (const s of scores) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:948:        score: range > 0 ? (r.score - min) / range : (r.score > 0 ? 1.0 : 0),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:953:  // Deduplicate by ID (keep highest normalized score)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:962:    if (!existing || r.score > existing.score) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:968:    .sort((a, b) => b.score - a.score)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1152:          const degreeScores = computeDegreeScores(db, Array.from(allResultIds));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1154:          // Build a ranked list sorted by degree score (highest first)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1155:          const degreeItems: Array<{ id: number; degreeScore: number }> = [];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1156:          for (const [idStr, score] of degreeScores) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1158:            if (score > 0 && !isNaN(numId)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1159:              degreeItems.push({ id: numId, degreeScore: score });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1162:          degreeItems.sort((a, b) => b.degreeScore - a.degreeScore);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1169:                degreeScore: item.degreeScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1305:  // MINOR-1 fix: isMpabEnabled() and isDocscoreAggregationEnabled() check the same env var
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1306:  if (isDocscoreAggregationEnabled()) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1320:            score: r.score,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1327:            score: c.mpabScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1346:    const channelResultSets = new Map<string, Array<{ id: number | string; score: number; [key: string]: unknown }>>();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1351:        score: typeof (r as Record<string, unknown>).score === 'number'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1352:          ? (r as Record<string, unknown>).score as number
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1430:              score: (r.score as number) ?? 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1458:              score: candidate.score,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1482:      // Boost scores of results that appear in co-activation graph
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1484:        const spreadMap = new Map(spreadResults.map(sr => [sr.id, sr.activationScore]));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1488:            // M10 FIX: Update all score aliases so downstream consumers see the boost
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1489:            const boostedScore = ((result.score as number) ?? 0) + boost * CO_ACTIVATION_CONFIG.boostFactor;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1490:            (result as Record<string, unknown>).score = boostedScore;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1491:            if ('rrfScore' in result) (result as Record<string, unknown>).rrfScore = boostedScore;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1492:            if ('intentAdjustedScore' in result) (result as Record<string, unknown>).intentAdjustedScore = boostedScore;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1498:      reranked.sort((a, b) => ((b.score as number) ?? 0) - ((a.score as number) ?? 0));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1500:      // Non-critical enrichment — co-activation failure does not affect core ranking
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1515:          const folderScores = computeFolderRelevanceScores(reranked, folderMap);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1520:          const twoPhaseResults = twoPhaseRetrieval(reranked, folderScores, folderMap, topK);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1522:          reranked = enrichResultsWithFolderScores(postFolderResults, folderScores, folderMap) as HybridSearchResult[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1536:        reranked.map(r => ({ ...r, id: r.id, score: r.score })),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1680: * @param embedding - Optional embedding vector for semantic search.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1737: * @param embedding - Optional embedding vector for semantic search.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1754:  // The naive hybridSearch that merges raw scores
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1846:      score: Math.max(0, 1.0 - index * 0.05),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2007:/** Tier-3 structural results are capped at this fraction of the top existing score. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2009:/** Per-rank score decay for Tier-3 results, as a fraction of the top existing score. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2013: * Keep Tier 3 structural fallback scores below established Tier 1/2 confidence.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2016:function calibrateTier3Scores(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2021:    if (typeof row.score !== 'number' || !Number.isFinite(row.score)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2024:    return Math.max(max, row.score);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2038:      score: Math.min(row.score, calibrated),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2050:  const scores = results
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2051:    .map(r => r.score)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2052:    .filter((score): score is number => typeof score === 'number' && Number.isFinite(score))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2055:  const topScore = scores[0] ?? 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2056:  const secondScore = scores[1] ?? 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2057:  const relativeGap = topScore > 0 ? (topScore - secondScore) / topScore : 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2061:    topScore < DEGRADATION_QUALITY_THRESHOLD
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2071:    topScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2078: * Merge two result arrays, deduplicating by id and keeping the higher score.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2092:    if (!prev || r.score > prev.score) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2097:  return Array.from(byId.values()).sort((a, b) => b.score - a.score);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2111: *   → Merge with Tier 1+2 results after score calibration
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2115: * @param embedding - Optional embedding vector for semantic search.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2147:  console.error(`[hybrid-search] Tier 1→2 degradation: ${tier1Trigger.reason} (topScore=${tier1Trigger.topScore.toFixed(3)}, count=${tier1Trigger.resultCount})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2174:  console.error(`[hybrid-search] Tier 2→3 degradation: ${tier2Trigger.reason} (topScore=${tier2Trigger.topScore.toFixed(3)}, count=${tier2Trigger.resultCount})`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2177:  const calibratedTier3 = calibrateTier3Scores(results, tier3Results);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2271:    'score',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2282:    'combined_lexical_score',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2355:  const sorted = [...results].sort((a, b) => b.score - a.score);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2459:  calibrateTier3Scores,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:3:OpenCode plugin for **local persistent memory** using [Mnemosyne](https://github.com/gandazgul/mnemosyne). Gives your AI coding agent memory that persists across sessions -- entirely offline, no cloud APIs.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:5:This is the local/offline alternative to cloud-based memory plugins like opencode-supermemory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:41:| `memory_recall` | Search project memory for relevant context and past decisions |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:42:| `memory_recall_global` | Search global memory for cross-project preferences |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:43:| `memory_store` | Store a project-scoped memory (optionally as `core`) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:44:| `memory_store_global` | Store a cross-project memory (optionally as `core`) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:57:| Core (project) | `<directory-name>` (tagged `core`) | Sessions + survives compaction |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:58:| Core (global) | `global` (tagged `core`) | All projects + survives compaction |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:60:The project collection is auto-initialized when the plugin loads. The global collection is created on first use of `memory_store_global`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:69:- At the start of a session, use memory_recall and memory_recall_global to search for context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:71:- After significant decisions, use memory_store to save a concise summary.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:73:- Use memory_recall_global / memory_store_global for cross-project preferences.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:74:- Mark critical, always-relevant context as core (core=true) — but use sparingly.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:84:- **Vector search** (sqlite-vec, cosine similarity with snowflake-arctic-embed-m-v1.5)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md:85:- **Reciprocal Rank Fusion** combines both for best results

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts | sed -n '1,220p;300,420p;500,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Sqlite Fts
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Semantic and lexical search (memory_search)
     5	// Weighted BM25 scoring for FTS5 full-text search.
     6	// Extracted from hybrid-search.ts ftsSearch() for independent
     7	// Testing and future delegation.
     8	
     9	import { BM25_FTS5_WEIGHTS, normalizeLexicalQueryTokens } from './bm25-index.js';
    10	import type Database from 'better-sqlite3';
    11	
    12	// ───────────────────────────────────────────────────────────────
    13	// 2. INTERFACES
    14	
    15	// ───────────────────────────────────────────────────────────────
    16	interface FtsBm25Result {
    17	  id: number;
    18	  fts_score: number;
    19	  [key: string]: unknown;
    20	}
    21	
    22	interface FtsBm25Options {
    23	  limit?: number;
    24	  specFolder?: string;
    25	  includeArchived?: boolean;
    26	}
    27	
    28	type LexicalPath = 'fts5' | 'like' | 'unavailable';
    29	type FallbackState =
    30	  | 'ok'
    31	  | 'compile_probe_miss'
    32	  | 'missing_table'
    33	  | 'no_such_module_fts5'
    34	  | 'bm25_runtime_failure';
    35	
    36	interface LexicalCapabilitySnapshot {
    37	  lexicalPath: LexicalPath;
    38	  fallbackState: FallbackState;
    39	}
    40	
    41	let lastLexicalCapabilitySnapshot: LexicalCapabilitySnapshot | null = null;
    42	
    43	function cloneLexicalCapabilitySnapshot(
    44	  snapshot: LexicalCapabilitySnapshot | null
    45	): LexicalCapabilitySnapshot | null {
    46	  return snapshot ? { ...snapshot } : null;
    47	}
    48	
    49	function setLastLexicalCapabilitySnapshot(snapshot: LexicalCapabilitySnapshot): void {
    50	  lastLexicalCapabilitySnapshot = { ...snapshot };
    51	}
    52	
    53	function getLastLexicalCapabilitySnapshot(): LexicalCapabilitySnapshot | null {
    54	  return cloneLexicalCapabilitySnapshot(lastLexicalCapabilitySnapshot);
    55	}
    56	
    57	function resetLastLexicalCapabilitySnapshot(): void {
    58	  lastLexicalCapabilitySnapshot = null;
    59	}
    60	
    61	function toErrorMessage(error: unknown): string {
    62	  return error instanceof Error ? error.message : String(error);
    63	}
    64	
    65	function readCompileOptionValue(row: unknown): string | null {
    66	  if (typeof row === 'string') {
    67	    return row;
    68	  }
    69	  if (!row || typeof row !== 'object') {
    70	    return null;
    71	  }
    72	
    73	  const record = row as Record<string, unknown>;
    74	  const direct = record.compile_options;
    75	  if (typeof direct === 'string') {
    76	    return direct;
    77	  }
    78	
    79	  const firstString = Object.values(record).find((value) => typeof value === 'string');
    80	  return typeof firstString === 'string' ? firstString : null;
    81	}
    82	
    83	function isNoSuchModuleFts5Error(error: unknown): boolean {
    84	  return toErrorMessage(error).toLowerCase().includes('no such module: fts5');
    85	}
    86	
    87	function isBm25RuntimeFailure(error: unknown): boolean {
    88	  const message = toErrorMessage(error).toLowerCase();
    89	  return message.includes('bm25');
    90	}
    91	
    92	function probeFts5Capability(db: Database.Database): LexicalCapabilitySnapshot {
    93	  try {
    94	    const compileRows = (db.prepare('PRAGMA compile_options') as Database.Statement).all() as unknown[];
    95	    const hasFts5CompileFlag = compileRows
    96	      .map(readCompileOptionValue)
    97	      .some((value) => typeof value === 'string' && value.toUpperCase().includes('ENABLE_FTS5'));
    98	
    99	    if (!hasFts5CompileFlag) {
   100	      return {
   101	        lexicalPath: 'unavailable',
   102	        fallbackState: 'compile_probe_miss',
   103	      };
   104	    }
   105	  } catch {
   106	    return {
   107	      lexicalPath: 'unavailable',
   108	      fallbackState: 'compile_probe_miss',
   109	    };
   110	  }
   111	
   112	  try {
   113	    const result = (db.prepare(
   114	      `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'`
   115	    ) as Database.Statement).get() as { name: string } | undefined;
   116	
   117	    if (!result) {
   118	      return {
   119	        lexicalPath: 'unavailable',
   120	        fallbackState: 'missing_table',
   121	      };
   122	    }
   123	  } catch (error: unknown) {
   124	    if (isNoSuchModuleFts5Error(error)) {
   125	      return {
   126	        lexicalPath: 'unavailable',
   127	        fallbackState: 'no_such_module_fts5',
   128	      };
   129	    }
   130	    return {
   131	      lexicalPath: 'unavailable',
   132	      fallbackState: 'missing_table',
   133	    };
   134	  }
   135	
   136	  return {
   137	    lexicalPath: 'fts5',
   138	    fallbackState: 'ok',
   139	  };
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: LLM Reformulation
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: D2 REQ-D2-003 — Corpus-Grounded LLM Reformulation
     5	//
     6	// Gate: SPECKIT_LLM_REFORMULATION — deep-mode only.
     7	//
     8	// Step-back abstraction combined with corpus seed grounding.
     9	// Seeds are retrieved via a lightweight keyword-only search using
    10	// BM25/FTS5 (no embedding call) to ground the LLM prompt in real
    11	// corpus content and prevent hallucination.
    12	//
    13	// Budget: ≤1 LLM call per reformulation (enforced by design).
    14	// Shared LLM result cache (key: normalized query + mode, TTL 1h)
    15	// is imported from llm-cache.ts and also used by hyde.ts.
    16	//
    17	// Feature flag: SPECKIT_LLM_REFORMULATION (default: TRUE, graduated via rollout-policy).
    18	// Set SPECKIT_LLM_REFORMULATION=false to disable. Only fires in deep mode.
    19	
    20	/* ───────────────────────────────────────────────────────────────
    21	   1. IMPORTS
    22	──────────────────────────────────────────────────────────────── */
    23	
    24	import { fts5Bm25Search } from './sqlite-fts.js';
    25	import { requireDb } from '../../utils/db-helpers.js';
    26	import { getLlmCache, type LlmCacheKey } from './llm-cache.js';
    27	
    28	/* ───────────────────────────────────────────────────────────────
    29	   2. TYPES
    30	──────────────────────────────────────────────────────────────── */
    31	
    32	/** A single seed result used to ground the reformulation prompt. */
    33	export interface SeedResult {
    34	  id: number;
    35	  title?: string;
    36	  content?: string;
    37	}
    38	
    39	/** Output of llm.rewrite — step-back abstract + corpus-grounded variants. */
    40	export interface ReformulationResult {
    41	  /** Step-back abstraction of the original query. */
    42	  abstract: string;
    43	  /** Additional corpus-grounded query variants. */
    44	  variants: string[];
    45	}
    46	
    47	/** Options for cheapSeedRetrieve. */
    48	export interface SeedRetrieveOptions {
    49	  /** Number of seed results to retrieve. Default: SEED_LIMIT. */
    50	  limit?: number;
    51	}
    52	
    53	/* ───────────────────────────────────────────────────────────────
    54	   3. CONSTANTS
    55	──────────────────────────────────────────────────────────────── */
    56	
    57	/** Number of seed results to retrieve for grounding. */
    58	const SEED_LIMIT = 3;
    59	
    60	/** Timeout for the reformulation LLM call in milliseconds. */
    61	const REFORMULATION_TIMEOUT_MS = 8000;
    62	
    63	/**
    64	 * Maximum number of variants the LLM may return.
    65	 * Enforced via prompt and validated on the parsed result.
    66	 */
    67	const MAX_VARIANTS = 2;
    68	
    69	/**
    70	 * Minimum length (characters) for an LLM output string to be considered valid.
    71	 * Guards against empty or whitespace-only returns.
    72	 */
    73	const MIN_OUTPUT_LENGTH = 5;
    74	
    75	/* ───────────────────────────────────────────────────────────────
    76	   4. FEATURE FLAG
    77	──────────────────────────────────────────────────────────────── */
    78	
    79	// D2 REQ-D2-003: LLM reformulation gate — canonical implementation in search-flags.ts.
    80	// Default: TRUE (graduated). Set SPECKIT_LLM_REFORMULATION=false to disable.
    81	import { isLlmReformulationEnabled } from './search-flags.js';
    82	export { isLlmReformulationEnabled };
    83	
    84	/* ───────────────────────────────────────────────────────────────
    85	   5. SEED RETRIEVAL
    86	──────────────────────────────────────────────────────────────── */
    87	
    88	/**
    89	 * Fast, low-cost seed retrieval for reformulation grounding.
    90	 *
    91	 * Uses FTS5 / BM25 keyword search only — no embedding call — to keep
    92	 * latency minimal and the ≤2 LLM calls per deep query budget intact.
    93	 * Returns up to `limit` (default 3) results.
    94	 *
    95	 * Fail-open: returns empty array on any error so that the caller can
    96	 * decide whether to proceed with an ungrounded prompt or skip.
    97	 *
    98	 * @param query - The raw search query to ground against.
    99	 * @param options - Optional limit override.
   100	 * @returns Array of seed results (may be empty).
   101	 */
   102	export function cheapSeedRetrieve(
   103	  query: string,
   104	  options?: SeedRetrieveOptions,
   105	): SeedResult[] {
   106	  const limit = options?.limit ?? SEED_LIMIT;
   107	
   108	  try {
   109	    const db = requireDb();
   110	    const rawResults = fts5Bm25Search(db, query, { limit });
   111	
   112	    return rawResults.slice(0, limit).map((row): SeedResult => ({
   113	      id: typeof row.id === 'number' ? row.id : Number(row.id),
   114	      title: typeof row.title === 'string' ? row.title : undefined,
   115	      content: typeof row.content_text === 'string'
   116	        ? row.content_text
   117	        : typeof row.content === 'string'
   118	          ? row.content
   119	          : undefined,
   120	    }));
   121	  } catch (err: unknown) {
   122	    const msg = err instanceof Error ? err.message : String(err);
   123	    console.warn(`[llm-reformulation] cheapSeedRetrieve failed: ${msg}`);
   124	    return [];
   125	  }
   126	}
   127	
   128	/* ───────────────────────────────────────────────────────────────
   129	   6. PROMPT BUILDER
   130	──────────────────────────────────────────────────────────────── */
   131	
   132	/**
   133	 * Build a grounded reformulation prompt.
   134	 *
   135	 * Injects the original query and top-3 seed snippets so the LLM can
   136	 * produce a step-back abstraction and grounded variants without
   137	 * inventing content that does not exist in the corpus.
   138	 *
   139	 * Prompt design principles:
   140	 *   - Explicit "do not hallucinate" instruction
   141	 *   - Seeds bounded to avoid token bloat (first 200 chars each)
   142	 *   - Structured JSON output schema minimises parsing failures
   143	 *
   144	 * @param query - Original user query.
   145	 * @param seeds - Corpus seed results for grounding.
   146	 * @returns Prompt string ready for the LLM chat API.
   147	 */
   148	function buildReformulationPrompt(query: string, seeds: SeedResult[]): string {
   149	  const seedBlock = seeds.length > 0
   150	    ? seeds.map((s, i) => {
   151	        const snippet = (s.content ?? s.title ?? '').slice(0, 200);
   152	        return `Seed ${i + 1}: ${snippet}`;
   153	      }).join('\n')
   154	    : '(no corpus seeds available)';
   155	
   156	  return [
   157	    'You are a search query reformulation assistant.',
   158	    'Your task: given an original query and corpus seed excerpts, produce:',
   159	    '  1. A step-back abstraction (more general form of the query)',
   160	    `  2. Up to ${MAX_VARIANTS} corpus-grounded variant queries`,
   161	    '',
   162	    'RULES:',
   163	    '  - Stay strictly grounded in the provided seed content.',
   164	    '  - Do NOT invent concepts, entities, or facts not present in the seeds.',
   165	    '  - If seeds are unavailable, use only the original query as grounding.',
   166	    '  - Keep each variant under 120 characters.',
   167	    '',
   168	    'Return ONLY valid JSON, no prose:',
   169	    '{"abstract": "<step-back abstraction>", "variants": ["<variant1>", "<variant2>"]}',
   170	    '',
   171	    `Original query: ${query}`,
   172	    '',
   173	    'Corpus seeds:',
   174	    seedBlock,
   175	  ].join('\n');
   176	}
   177	
   178	/* ───────────────────────────────────────────────────────────────
   179	   7. LLM CALL (PROVIDER-AGNOSTIC STUB)
   180	──────────────────────────────────────────────────────────────── */
   181	
   182	/**
   183	 * Provider-agnostic LLM caller.
   184	 *
   185	 * Reads LLM_REFORMULATION_ENDPOINT and LLM_REFORMULATION_API_KEY from env.
   186	 * If neither is set, the function returns null (caller handles graceful fallback).
   187	 *
   188	 * This is an intentionally thin integration layer. The server operator is
   189	 * responsible for pointing these env vars at an OpenAI-compatible endpoint
   190	 * (OpenAI, Ollama, local proxy, etc.).
   191	 *
   192	 * Contract:
   193	 *   - Single system/user turn
   194	 *   - max_tokens capped at 256 (no streaming)
   195	 *   - Response parsed as JSON matching ReformulationResult
   196	 *
   197	 * @param prompt - The assembled reformulation prompt.
   198	 * @returns Parsed result or null on any failure.
   199	 */
   200	async function callLlmForReformulation(
   201	  prompt: string,
   202	): Promise<ReformulationResult | null> {
   203	  const endpoint = process.env.LLM_REFORMULATION_ENDPOINT?.trim();
   204	  if (!endpoint) {
   205	    // No LLM provider configured — caller falls back to non-LLM path.
   206	    return null;
   207	  }
   208	
   209	  const apiKey = process.env.LLM_REFORMULATION_API_KEY?.trim() ?? '';
   210	  const model = process.env.LLM_REFORMULATION_MODEL?.trim() ?? 'gpt-4o-mini';
   211	
   212	  const requestBody = {
   213	    model,
   214	    messages: [{ role: 'user', content: prompt }],
   215	    max_tokens: 256,
   216	    temperature: 0.3,
   217	    response_format: { type: 'json_object' },
   218	  };
   219	
   220	  const controller = new AbortController();

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts | sed -n '87,130p;427,515p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    87	 * Compute trigger phrase quality sub-score.
    88	 *
    89	 * Evaluates whether the memory metadata declares enough trigger phrases for
    90	 * reliable retrieval via the `memory_match_triggers` tool. The scoring
    91	 * thresholds are:
    92	 *   - 0 phrases  → score 0.0  (memory will never surface via trigger matching)
    93	 *   - 1–3 phrases → score 0.5  (below the recommended minimum of four)
    94	 *   - 4+ phrases  → score 1.0  (meets or exceeds the recommended minimum)
    95	 *
    96	 * @param metadata - Raw metadata record extracted from the memory file. Expected
    97	 *   to contain a `triggerPhrases` key whose value is an array of strings.
    98	 * @returns An object with:
    99	 *   - `score`  — Sub-score in the range [0, 1].
   100	 *   - `issues` — Human-readable issue strings when the count is below 4.
   101	 */
   102	function scoreTriggerPhrases(metadata: Record<string, unknown>): { score: number; issues: string[] } {
   103	  const triggers = Array.isArray(metadata.triggerPhrases) ? metadata.triggerPhrases : [];
   104	  const count = triggers.length;
   105	  const issues: string[] = [];
   106	
   107	  if (count === 0) {
   108	    issues.push('No trigger phrases found');
   109	    return { score: 0, issues };
   110	  }
   111	  if (count < 4) {
   112	    issues.push(`Only ${count} trigger phrase(s) — 4+ recommended`);
   113	    return { score: 0.5, issues };
   114	  }
   115	  return { score: 1.0, issues };
   116	}
   117	
   118	/**
   119	 * Compute anchor format quality sub-score.
   120	 *
   121	 * Scans `content` for HTML comment–style ANCHOR tags in the forms
   122	 * `<!-- ANCHOR: name -->` and `<!-- /ANCHOR: name -->`, then verifies that
   123	 * every opening tag has a matching closing tag and vice-versa.
   124	 *
   125	 * Scoring rules:
   126	 *   - No anchors present at all → score 0.5 (neutral; anchors are optional)
   127	 *   - All anchors properly paired  → score 1.0
   128	 *   - Mismatches present → proportional deduction: `1 - brokenCount / totalUniqueNames`
   129	 *     (minimum 0.0)
   130	 *
   427	 * - Re-extract trigger phrases from content headings/title
   428	 * - Close unclosed ANCHOR tags
   429	 * - Trim content to token budget
   430	 *
   431	 * Returns the (possibly modified) content, metadata, and list of applied fixes.
   432	 */
   433	function attemptAutoFix(
   434	  content: string,
   435	  metadata: Record<string, unknown>,
   436	  issues: string[],
   437	): { content: string; metadata: Record<string, unknown>; fixed: string[] } {
   438	  let fixedContent = content;
   439	  const fixedMetadata = { ...metadata };
   440	  const fixed: string[] = [];
   441	
   442	  // Fix #1 : Re-extract trigger phrases if missing/insufficient
   443	  const hasTriggerIssue = issues.some(i => /trigger phrase/i.test(i));
   444	  if (hasTriggerIssue) {
   445	    const existingTriggers = Array.isArray(fixedMetadata.triggerPhrases)
   446	      ? (fixedMetadata.triggerPhrases as string[])
   447	      : [];
   448	
   449	    const extracted = extractTriggersFromContent(fixedContent, fixedMetadata.title as string | undefined);
   450	    if (extracted.length > existingTriggers.length) {
   451	      fixedMetadata.triggerPhrases = extracted;
   452	      fixed.push(`Re-extracted ${extracted.length} trigger phrases from content`);
   453	    }
   454	  }
   455	
   456	  // O2-6: Fix #3 (trim) runs BEFORE Fix #2 (anchors) to prevent trim from
   457	  // removing anchor closing tags that were just appended by Fix #2.
   458	
   459	  // Fix #3 : Trim content to budget
   460	  const hasBudgetIssue = issues.some(i => /token budget/i.test(i));
   461	  if (hasBudgetIssue) {
   462	    if (fixedContent.length > DEFAULT_CHAR_BUDGET) {
   463	      // Trim to budget, preserving the last newline boundary
   464	      const trimmed = fixedContent.substring(0, DEFAULT_CHAR_BUDGET);
   465	      const lastNewline = trimmed.lastIndexOf('\n');
   466	      fixedContent = lastNewline > 0 ? trimmed.substring(0, lastNewline) : trimmed;
   467	      fixed.push(`Trimmed content from ${content.length} to ${fixedContent.length} chars`);
   468	    }
   469	  }
   470	
   471	  // Fix #2 : Close unclosed ANCHOR tags
   472	  const hasAnchorIssue = issues.some(i => /unclosed anchor/i.test(i));
   473	  if (hasAnchorIssue) {
   474	    fixedContent = normalizeAnchors(fixedContent);
   475	    fixed.push('Normalized unclosed ANCHOR tags');
   476	  }
   477	
   478	  return { content: fixedContent, metadata: fixedMetadata, fixed };
   479	}
   480	
   481	/**
   482	 * Extract trigger phrases from content by scanning headings and the title.
   483	 */
   484	// O2-10: Contamination patterns to filter from extracted headings
   485	const CONTAM_HEADING_PATTERNS = [
   486	  /\b(?:step|task|phase)\s+\d+/i,
   487	  /\b(?:I'll|let me|I need to|I will)\b/i,
   488	  /\b(?:as an AI|AI assistant)\b/i,
   489	];
   490	
   491	function extractTriggersFromContent(content: string, title?: string): string[] {
   492	  let triggers: string[] = [];
   493	
   494	  // Add title as a trigger if present
   495	  if (title && title.trim().length > 0) {
   496	    triggers.push(title.trim().toLowerCase());
   497	  }
   498	
   499	  // Extract markdown headings as triggers
   500	  const headingPattern = /^#{1,3}\s+(.+)$/gm;
   501	  let match: RegExpExecArray | null;
   502	  while ((match = headingPattern.exec(content)) !== null) {
   503	    const heading = match[1].trim().toLowerCase();
   504	    if (heading.length > 3 && heading.length < 80 && !triggers.includes(heading)) {
   505	      triggers.push(heading);
   506	    }
   507	  }
   508	
   509	  // O2-10: Filter out headings that match contamination patterns
   510	  triggers = triggers.filter(t =>
   511	    !CONTAM_HEADING_PATTERNS.some(p => p.test(t))
   512	  );
   513	
   514	  return triggers.slice(0, 8); // Cap at 8 triggers
   515	}

exec
/bin/zsh -lc 'rg -n "code_graph_query|structural|CocoIndex|semantic code search|vector embeddings|search by concept" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -n \"generate-context|trigger phrases|quality review|triggerPhrases|sessionSummary|evidence\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory -g '"'!**/node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:3:description: "Semantic code search via vector embeddings. CocoIndex Code enables natural-language discovery of relevant code, patterns, and implementations. CLI for direct use; MCP exposes a single `search` tool for AI agent integration."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:10:# CocoIndex Code - Semantic Code Search via Vector Embeddings
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:187:CocoIndex Code provides two access patterns for semantic code search:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:192:### CLI Approach (Primary) - CocoIndex Code CLI
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:245:CocoIndex Code supports two embedding models, configured via `~/.cocoindex_code/global_settings.yml`:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:258:CocoIndex Code resolves the project root in this order:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:267:The CocoIndex Code daemon manages background indexing and serves search requests:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:455:The CocoIndex MCP server exposes `search` as its primary tool. Additionally, 3 management tools are available via the Spec Kit Memory MCP server's code graph module:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:459:| `search` | CocoIndex | Semantic search across code    | `query` (str), `languages` (list\|null), `paths` (list\|null), `limit` (int, default 5), `offset` (int, default 0), `refresh_index` (bool, default true) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:460:| `ccc_status` | Spec Kit Memory | Check CocoIndex availability and index stats | none |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:466:> **Companion recovery surface**: In the integrated Spec Kit workflow, hookless runtimes should use `session_bootstrap` as the first recovery call, then use `session_resume` when they need the fuller merged recovery payload that includes direct CocoIndex availability fields.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:470:CocoIndex Code supports 28+ languages with language-aware chunk splitting:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:568:- CocoIndex Code handles code search; Code Mode handles external APIs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:582:**CocoIndex Code (ccc)**:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:585:- Purpose: Semantic code search via vector embeddings
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md:598:| **install.sh** | Install CocoIndex  | `bash .opencode/skill/mcp-coco-index/scripts/install.sh`                  |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:213:  'code_graph_query',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:254:  preferredTool: 'code_graph_query';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:320:    preferredTool: 'code_graph_query',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:322:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:343:  meta.structuralRoutingNudge = nudge;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:694:    hints.push(`Code graph: ${pkg.codeGraphStatus}, CocoIndex: ${pkg.cocoIndexAvailable ? 'available' : 'not installed'}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:786:  lines.push('- If structural context shows "ready": code_graph_query is available for structural lookups');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:799:      routingRules.push('Structural queries (callers, imports, deps) → code_graph_query');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:886:      recordMetricEvent({ kind: 'code_graph_query' });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:985:            existingHints.push('Tip: For code search queries, consider using mcp__cocoindex_code__search for semantic code search or code_graph_query for structural lookups.');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1002:            const nudge = meta.structuralRoutingNudge
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1015:          // Response is not JSON envelope — skip structural nudge injection

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
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:85:  triggerPhrases: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:412:  const triggerPhrases = Array.isArray(triggerValue)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:418:    triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:423:function resolveTriggerPhrases(triggerPhrases: string[], title: string): TriggerResolution {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:430:  for (const originalPhrase of triggerPhrases) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:489:function hashTriggerPhrases(triggerPhrases: string[]): string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:490:  return crypto.createHash('sha1').update(JSON.stringify(triggerPhrases)).digest('hex');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:524:      const resolution = resolveTriggerPhrases(parsed.triggerPhrases, parsed.title);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:526:      const changed = rewrittenContent !== null && JSON.stringify(parsed.triggerPhrases) !== JSON.stringify(resolution.kept);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:543:        originalCount: parsed.triggerPhrases.length,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:548:        beforeTriggerPhrases: parsed.triggerPhrases,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/migrate-trigger-phrase-residual.ts:551:          beforeHash: hashTriggerPhrases(parsed.triggerPhrases),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md:38:- `generate-context.ts` - generate memory output from spec folder or JSON input with content-aware candidate selection
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md:59:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md:67:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"sessionSummary":"...","specFolder":"..."}' specs/NNN-name
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md:94:- Uses content-aware candidate selection so task/session evidence beats generic folder fallback when valid.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md:97:- Runs post-render memory quality validation so contaminated headings or fallback-decision leaks are caught after template population. The post-save quality pipeline includes 3-layer gates (structure, semantic sufficiency, duplicate detection), heuristic calibration for scoring thresholds, and trigger sanitization to prevent noisy or over-broad trigger phrases from persisting in the index.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:52:Usage: node generate-context.js [options] <input>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:56:                    - JSON file mode: node generate-context.js data.json [spec-folder]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:65:  node generate-context.js /tmp/context-data.json
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:66:  node generate-context.js /tmp/context-data.json specs/001-feature/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:67:  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:68:  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:69:  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:540:      console.error('[generate-context] Failed to list spec folders:', errMsg);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:543:  console.error('\nUsage: node generate-context.js [--stdin [spec-folder-name] | --json <json> [spec-folder-name] | <data-file> [spec-folder-name]]\n');

web search: 
web search: 
codex
I also checked the phase validator directly. It passed again with `Errors: 0  Warnings: 0`, and the same read-only sandbox temp-file warning showed up, so the phase state is still clean for analysis.
exec
/bin/zsh -lc 'rg -n "compacting|messagesTransform|transportOnly|structural context|session_bootstrap|session_resume|code_graph_query|message" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
30:} from './spec-kit-opencode-message-schema.mjs';
68: *   transportOnly: true,
76: *   messagesTransform: TransportBlock[],
136:    if (plan.transportOnly !== true || !Array.isArray(plan.messagesTransform)) {
150:    return error.message;
256:    && (eventType.startsWith('session.') || eventType.startsWith('message.'));
309:            `messages_transform_enabled=${MESSAGES_TRANSFORM_ENABLED}`,
310:            `messages_transform_mode=${MESSAGES_TRANSFORM_MODE}`,
346:    'experimental.chat.messages.transform': async (_input, output) => {
351:      const anchor = output.messages.at(-1);
369:      if (!plan || plan.messagesTransform.length === 0) {
373:      for (const block of plan.messagesTransform) {
381:          messageID: anchor.info.id,
396:    'experimental.session.compacting': async (input, output) => {

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md | sed -n '1,80p;455,470p;582,590p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '482,520p;760,785p;900,930p;1228,1240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	---
     2	name: mcp-coco-index
     3	description: "Semantic code search via vector embeddings. CocoIndex Code enables natural-language discovery of relevant code, patterns, and implementations. CLI for direct use; MCP exposes a single `search` tool for AI agent integration."
     4	allowed-tools: [Bash, Read, Grep, Glob]
     5	version: 1.0.0
     6	---
     7	
     8	<!-- Keywords: cocoindex-code, semantic-search, vector-embeddings, code-search, mcp-server, ccc, codebase-indexing, voyage-code-3, all-MiniLM-L6-v2 -->
     9	
    10	# CocoIndex Code - Semantic Code Search via Vector Embeddings
    11	
    12	Natural language code search through two complementary approaches: CLI (ccc) for speed and one-off queries, MCP server (1 tool: `search`) for AI agent integration via stdio transport.
    13	
    14	
    15	<!-- ANCHOR:when-to-use -->
    16	## 1. WHEN TO USE
    17	
    18	### Activation Triggers
    19	
    20	**Use when**:
    21	- User asks to "find code that does X" or "search for implementations of Y"
    22	- User needs to discover code by concept or intent rather than exact text
    23	- User wants to find similar code patterns across the codebase
    24	- Grep/Glob exact matching is insufficient and fuzzy or semantic matching is needed
    25	- User mentions "semantic search", "code search", "find similar code"
    26	- User needs to locate logic handling a specific concern (e.g., "where is the retry logic")
    27	- User wants to understand how a concept is implemented across multiple files
    28	- User asks "how is X implemented" or "what handles Y"
    29	- User wants to understand architecture or module relationships
    30	- Starting work on an unfamiliar part of the codebase (onboarding queries)
    31	- @context agent is exploring code structure and needs concept-based discovery
    32	- Any exploration task where the exact function/class name is unknown
    33	
    34	**Automatic Triggers**:
    35	- "semantic search", "find code that", "search for implementations"
    36	- "similar code", "code that handles", "where is the logic for"
    37	- "cocoindex", "ccc", "vector search"
    38	- "find similar", "code search", "search codebase"
    39	- "how is", "what handles", "where does", "understand the"
    40	- "explore", "architecture", "module relationships"
    41	- "onboarding", "unfamiliar code", "new to this"
    42	
    43	### When NOT to Use
    44	
    45	**Do not use for**:
    46	- Exact text or regex search (use Grep instead)
    47	- File name or path search (use Glob instead)
    48	- Reading known files (use Read instead)
    49	- The codebase has not been indexed yet (run `ccc index` first)
    50	- Simple string matching where the exact token is known
    51	- Non-code files (semantic search is optimized for source code)
    52	
    53	---
    54	
    55	<!-- /ANCHOR:when-to-use -->
    56	<!-- ANCHOR:smart-routing -->
    57	## 2. SMART ROUTING
    58	
    59	### Resource Loading Levels
    60	
    61	| Level       | When to Load             | Resources                                   |
    62	| ----------- | ------------------------ | ------------------------------------------- |
    63	| ALWAYS      | Every skill invocation   | references/tool_reference.md                |
    64	| CONDITIONAL | If intent signals match  | references/search_patterns.md, references/cross_cli_playbook.md |
    65	| ON_DEMAND   | Only on explicit request | Full troubleshooting and configuration docs |
    66	
    67	### Smart Router Pseudocode
    68	
    69	The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.
    70	
    71	```python
    72	from pathlib import Path
    73	
    74	SKILL_ROOT = Path(__file__).resolve().parent
    75	RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
    76	DEFAULT_RESOURCE = "references/tool_reference.md"
    77	
    78	INTENT_SIGNALS = {
    79	    "SEARCH": {"weight": 4, "keywords": ["search", "find", "where", "similar", "semantic", "code that"]},
    80	    "INDEX": {"weight": 4, "keywords": ["index", "reindex", "update index", "build index", "refresh"]},
   455	The CocoIndex MCP server exposes `search` as its primary tool. Additionally, 3 management tools are available via the Spec Kit Memory MCP server's code graph module:
   456	
   457	| Tool     | Server | Description                    | Key Parameters                                                                  |
   458	| -------- | ------ | ------------------------------ | ------------------------------------------------------------------------------- |
   459	| `search` | CocoIndex | Semantic search across code    | `query` (str), `languages` (list\|null), `paths` (list\|null), `limit` (int, default 5), `offset` (int, default 0), `refresh_index` (bool, default true) |
   460	| `ccc_status` | Spec Kit Memory | Check CocoIndex availability and index stats | none |
   461	| `ccc_reindex` | Spec Kit Memory | Trigger incremental or full re-indexing | `full` (bool, default false) |
   462	| `ccc_feedback` | Spec Kit Memory | Submit search result quality feedback | `query` (str), `rating` (helpful\|not_helpful\|partial), `comment` (str, optional) |
   463	
   464	> **Note**: `refresh_index` defaults to `true`. Use the default on the first query in a session, then switch follow-up queries to `false` when the codebase has not changed to avoid `ComponentContext` errors.
   465	>
   466	> **Companion recovery surface**: In the integrated Spec Kit workflow, hookless runtimes should use `session_bootstrap` as the first recovery call, then use `session_resume` when they need the fuller merged recovery payload that includes direct CocoIndex availability fields.
   467	
   468	### Supported Languages
   469	
   470	CocoIndex Code supports 28+ languages with language-aware chunk splitting:
   582	**CocoIndex Code (ccc)**:
   583	- Installation: `bash .opencode/skill/mcp-coco-index/scripts/install.sh`
   584	- Update: `bash .opencode/skill/mcp-coco-index/scripts/update.sh`
   585	- Purpose: Semantic code search via vector embeddings
   586	- Requires: Python 3.11+, SQLite with sqlite-vec extension
   587	
   588	---
   589	
   590	<!-- /ANCHOR:integration-points -->

 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md | sed -n '90,100p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    90	- Uses the modular core/extractors/loaders/renderers/lib pipeline.
    91	- Supports subfolder-aware spec path handling through core utilities.
    92	- Produces ANCHOR-structured markdown expected by downstream validation and indexing.
    93	- Enforces the shared rendered-memory contract before successful write/index so malformed anchors, ids, frontmatter, or cleanup artifacts do not persist as active memories.
    94	- Uses content-aware candidate selection so task/session evidence beats generic folder fallback when valid.
    95	- Derives `MEMORY_TITLE` from the content slug via `slugToTitle(contentSlug)` and writes it into the H1 heading. A blank line separates the frontmatter close `---` from the `# H1`.
    96	- Writes `MEMORY_DASHBOARD_TITLE` into context template frontmatter so dashboard titles stay disambiguated.
    97	- Runs post-render memory quality validation so contaminated headings or fallback-decision leaks are caught after template population. The post-save quality pipeline includes 3-layer gates (structure, semantic sufficiency, duplicate detection), heuristic calibration for scoring thresholds, and trigger sanitization to prevent noisy or over-broad trigger phrases from persisting in the index.
    98	- Retroactive title refresh for existing memories: run `memory_index_scan({ force: true })` after parser/template updates.
    99	<!-- /ANCHOR:workflow-alignment -->
   100	

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js | sed -n '340,435p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc 'rg -n "function routeQuery|const QUERY_TIERS|simple queries|channels" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-complexity-router.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 2 in 0ms:
rg: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-complexity-router.ts: No such file or directory (os error 2)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:97:   * enable all retrieval channels for this search call.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:162:    channels: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:974: * All search channels use synchronous better-sqlite3; sequential execution
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1007:    // When enabled, classifies query complexity and restricts channels to a
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1008:    // Subset (e.g., simple queries skip graph+degree). When disabled, all channels run.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1013:      : new Set<ChannelName>(routeResult.channels);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1027:        channels: routeResult.channels,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1058:    // All channels use synchronous better-sqlite3; sequential execution
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1142:        // Collect all numeric IDs from existing channels
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1181:    // Merge keyword results after all channels complete
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2106: * TIER 2: hybridSearchEnhanced at minSimilarity=10, all allowed channels forced
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2144:  // TIER 2: Widen search — lower similarity, force all channels

exec
/bin/zsh -lc "rg -n \"routeQuery\\(|export function routeQuery|classif.*channels|skippedChannels\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search -g '"'!**/dist/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:163:    skippedChannels: string[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1007:    // When enabled, classifies query complexity and restricts channels to a
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1009:    const routeResult = routeQuery(query, options.triggerPhrases);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1022:    const skippedChannels = allPossibleChannels.filter(ch => !activeChannels.has(ch));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1024:    if (skippedChannels.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1028:        skippedChannels,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:138:function routeQuery(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:349:export function routeQueryConcepts(

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Query Classifier
     3	// ───────────────────────────────────────────────────────────────
     4	/* --- 1. TYPES & CONSTANTS --- */
     5	
     6	// Feature catalog: Query complexity router
     7	
     8	type QueryComplexityTier = 'simple' | 'moderate' | 'complex';
     9	
    10	interface ClassificationResult {
    11	  tier: QueryComplexityTier;
    12	  features: {
    13	    termCount: number;
    14	    charCount: number;
    15	    hasTriggerMatch: boolean;
    16	    stopWordRatio: number;
    17	  };
    18	  confidence: 'high' | 'medium' | 'low' | 'fallback';
    19	}
    20	
    21	/** Config-driven thresholds */
    22	const SIMPLE_TERM_THRESHOLD = 3;
    23	const COMPLEX_TERM_THRESHOLD = 8;
    24	
    25	/** Common English stop words for semantic complexity heuristic */
    26	const STOP_WORDS: ReadonlySet<string> = new Set([
    27	  'the', 'a', 'an', 'is', 'are', 'was', 'were',
    28	  'in', 'on', 'at', 'to', 'for', 'of',
    29	  'and', 'or', 'but', 'not',
    30	  'with', 'this', 'that', 'it',
    31	  'from', 'by', 'as', 'be',
    32	  'has', 'had', 'have',
    33	  'do', 'does', 'did',
    34	  'will', 'would', 'can', 'could', 'should', 'may', 'might',
    35	]);
    36	
    37	/* --- 2. FEATURE FLAG --- */
    38	
    39	/**
    40	 * Check if the complexity router feature flag is enabled.
    41	 * Default: TRUE (graduated). Set SPECKIT_COMPLEXITY_ROUTER=false to disable.
    42	 *
    43	 * @returns True when SPECKIT_COMPLEXITY_ROUTER is not explicitly disabled.
    44	 */
    45	function isComplexityRouterEnabled(): boolean {
    46	  const raw = process.env.SPECKIT_COMPLEXITY_ROUTER?.toLowerCase()?.trim();
    47	  return raw !== 'false';
    48	}
    49	
    50	/* --- 3. FEATURE EXTRACTION --- */
    51	
    52	/**
    53	 * Split query into terms by whitespace, filtering empty strings.
    54	 *
    55	 * @param query - Raw query string to tokenize.
    56	 * @returns Array of non-empty whitespace-delimited terms.
    57	 */
    58	function extractTerms(query: string): string[] {
    59	  return query.trim().split(/\s+/).filter(t => t.length > 0);
    60	}
    61	
    62	/**
    63	 * Calculate the ratio of stop words in the query terms.
    64	 * Returns 0 for empty term lists.
    65	 *
    66	 * @param terms - Array of query terms to analyse.
    67	 * @returns Ratio in [0, 1] of stop words to total terms.
    68	 */
    69	function calculateStopWordRatio(terms: string[]): number {
    70	  if (terms.length === 0) return 0;
    71	  const stopCount = terms.filter(t => STOP_WORDS.has(t.toLowerCase())).length;
    72	  return stopCount / terms.length;
    73	}
    74	
    75	/**
    76	 * Check if the query exactly matches any known trigger phrase (case-insensitive).
    77	 *
    78	 * @param query          - Raw query string to test.
    79	 * @param triggerPhrases - Known trigger phrases to match against.
    80	 * @returns True when the query matches a trigger phrase exactly.
    81	 */
    82	function hasTriggerMatch(query: string, triggerPhrases: string[]): boolean {
    83	  if (triggerPhrases.length === 0) return false;
    84	  const normalized = query.trim().toLowerCase();
    85	  return triggerPhrases.some(tp => tp.trim().toLowerCase() === normalized);
    86	}
    87	
    88	/* --- 4. CLASSIFICATION --- */
    89	
    90	/**
    91	 * Determine confidence label based on how clearly the query fits its tier.
    92	 *
    93	 * @param tier          - Classified complexity tier.
    94	 * @param termCount     - Number of query terms.
    95	 * @param hasTrigger    - Whether a trigger phrase matched.
    96	 * @param stopWordRatio - Ratio of stop words in query.
    97	 * @returns Confidence label: 'high', 'medium', or 'low'.
    98	 */
    99	function determineConfidence(
   100	  tier: QueryComplexityTier,
   101	  termCount: number,
   102	  hasTrigger: boolean,
   103	  stopWordRatio: number,
   104	): 'high' | 'medium' | 'low' {
   105	  if (tier === 'simple') {
   106	    // Trigger match is strongest simplicity signal — overrides term count
   107	    if (hasTrigger) return 'high';
   108	    if (termCount <= 2) return 'high';
   109	    return 'medium';
   110	  }
   111	
   112	  if (tier === 'complex') {
   113	    // High confidence: many terms and low stop-word ratio (content-rich)
   114	    if (termCount > 12) return 'high';
   115	    if (stopWordRatio < 0.3) return 'high';
   116	    return 'medium';
   117	  }
   118	
   119	  // Moderate tier: inherently less certain (between boundaries)
   120	  if (termCount === SIMPLE_TERM_THRESHOLD + 1 || termCount === COMPLEX_TERM_THRESHOLD) {
   121	    return 'low'; // Near boundary
   122	  }
   123	  return 'medium';
   124	}
   125	
   126	/**
   127	 * Classify a query's complexity into one of three tiers: simple, moderate, or complex.
   128	 *
   129	 * Classification boundaries:
   130	 * - Simple: ≤3 terms OR trigger phrase match
   131	 * - Complex: >8 terms AND no trigger match
   132	 * - Moderate: everything else (interior)
   133	 *
   134	 * When the SPECKIT_COMPLEXITY_ROUTER feature flag is disabled (enabled by default,
   135	 * graduated), all queries classify as "complex" (safe fallback — full pipeline).
   136	 *
   137	 * On any error, returns "complex" (safe fallback per spec).
   138	 *
   139	 * @param query          - Raw user query string.
   140	 * @param triggerPhrases - Optional array of known trigger phrases.
   141	 * @returns ClassificationResult with tier, features, and confidence.
   142	 */
   143	function classifyQueryComplexity(
   144	  query: string,
   145	  triggerPhrases?: string[],
   146	): ClassificationResult {
   147	  // Safe fallback for any unexpected state
   148	  const FALLBACK: ClassificationResult = {
   149	    tier: 'complex',
   150	    features: { termCount: 0, charCount: 0, hasTriggerMatch: false, stopWordRatio: 0 },
   151	    confidence: 'fallback',
   152	  };
   153	
   154	  try {
   155	    // Feature flag gate: when disabled, always return complex
   156	    if (!isComplexityRouterEnabled()) {
   157	      return FALLBACK;
   158	    }
   159	
   160	    // Edge case: empty or whitespace-only queries → complex fallback
   161	    if (!query || typeof query !== 'string' || query.trim().length === 0) {
   162	      return FALLBACK;
   163	    }
   164	
   165	    const terms = extractTerms(query);
   166	    const termCount = terms.length;
   167	    const charCount = query.length;
   168	    const triggers = triggerPhrases ?? [];
   169	    const triggerMatch = hasTriggerMatch(query, triggers);
   170	    const stopWordRatio = calculateStopWordRatio(terms);
   171	
   172	    // Classification boundaries
   173	    let tier: QueryComplexityTier;
   174	
   175	    // TriggerMatch always forces simple tier regardless of term count
   176	    if (triggerMatch || termCount <= SIMPLE_TERM_THRESHOLD) {
   177	      tier = 'simple';
   178	    } else if (termCount > COMPLEX_TERM_THRESHOLD && !triggerMatch) {
   179	      tier = 'complex';
   180	    } else {
   181	      tier = 'moderate';
   182	    }
   183	
   184	    const confidence = determineConfidence(tier, termCount, triggerMatch, stopWordRatio);
   185	
   186	    return {
   187	      tier,
   188	      features: {
   189	        termCount,
   190	        charCount,
   191	        hasTriggerMatch: triggerMatch,
   192	        // Round to 3 decimals to avoid floating-point noise in debug output
   193	        stopWordRatio: Math.round(stopWordRatio * 1000) / 1000,
   194	      },
   195	      confidence,
   196	    };
   197	  } catch (_err: unknown) {
   198	    // Classification failure — return moderate default
   199	    return FALLBACK;
   200	  }
   201	}
   202	
   203	/* --- 5. EXPORTS --- */
   204	
   205	export {
   206	  // Types
   207	  type QueryComplexityTier,
   208	  type ClassificationResult,
   209	
   210	  // Constants
   211	  SIMPLE_TERM_THRESHOLD,
   212	  COMPLEX_TERM_THRESHOLD,
   213	  STOP_WORDS,
   214	
   215	  // Functions
   216	  classifyQueryComplexity,
   217	  isComplexityRouterEnabled,
   218	
   219	  // Internal helpers (exported for testing)
   220	  extractTerms,
   221	  calculateStopWordRatio,
   222	  hasTriggerMatch,
   223	};

codex
The answer is converging around a practical split: lexical should own exactness, semantic should own abstraction, and the orchestrator should decide which lane to spend budget on. I’m doing one final pass for exact line references so the findings stay auditable and easy to fold back into the research packet later.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '757,761p;786,786p;547,548p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   547	- `memory_stats` currently has no `sessionId` input in tool schema, so calling it after `memory_search` cannot claim the same session by default [Task 2]
   548	- verification pattern that worked: confirm fresh `context-server.js` processes, run `session_bootstrap`, execute controlled `memory_search` sequence with fixed session id + trace flags, then query `feedback_events` globally and per-session in sqlite [Task 2]
   757	- rollout_summaries/2026-04-02T14-05-56-qyWY-cocoindex_compact_code_graph_readme_section.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T16-05-56-019d4e83-d8f5-7342-833e-98b3e0f731f0.jsonl, updated_at=2026-04-02T14:08:03+00:00, thread_id=019d4e83-d8f5-7342-833e-98b3e0f731f0)
   758	
   759	### keywords
   760	
   761	- CocoIndex + Compact Code Graph, README.md, 024-compact-code-graph, 006-documentation-alignment, mcp__cocoindex_code__search, code_graph_query, prettier --check
   786	- `session_bootstrap()` is the primary recovery call for non-hook flows; docs should mention fallback `memory_context({mode:"resume",profile:"resume"})` only after bootstrap guidance [Task 4]

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '1094,1111p;2140,2180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts | sed -n '145,210p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
# Iteration 026: SEMANTIC VS LEXICAL TRADE-OFFS

## Focus
SEMANTIC VS LEXICAL TRADE-OFFS: Deep analysis of when semantic search beats lexical and vice versa in this system. What hybrid strategies should we adopt?

## Findings
### Finding 1: Exact artifact and resume lookups should stay lexical-first, not semantic-first
- **Source**: [query-router.ts:62](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts), [sqlite-fts.ts:147](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts), [memory-context.ts:783](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts); evidence type: wrapper-confirmed
- **What it does**: Public explicitly preserves BM25 for spec-like artifacts and routes `resume` through `memory_search` with anchor filtering. Its FTS lane heavily weights `title`, `trigger_phrases`, and path-like metadata, which is exactly what phase IDs, checklist names, anchor labels, and decision titles depend on.
- **Why it matters**: Semantic similarity is weaker when the user really wants exact identifiers, document classes, phase numbers, or resume anchors. In this system, those are not edge cases; they are a core workflow.
- **Recommendation**: adopt now. Make artifact-oriented queries lexical-first hybrid: run weighted FTS/BM25 as the primary evidence lane, then add semantic only as recall support.
- **Impact**: high

### Finding 2: Semantic search wins on alias-rich, conceptual, and unfamiliar queries, but it should stay a distinct lane
- **Source**: [stage1-candidate-gen.ts:501](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts), [hybrid-search.ts:1061](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts), [mcp-coco-index SKILL.md:20](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md); evidence type: both
- **What it does**: Public already expands concept aliases into the hybrid query, runs a vector channel over embeddings, and keeps CocoIndex as the repo’s dedicated semantic code-search surface for “find code that does X” style exploration.
- **Why it matters**: Semantic search beats lexical when the user does not know the exact token, uses synonyms, or asks in natural-language intent terms. That is especially true for unfamiliar code and fuzzy memory recall.
- **Recommendation**: adopt now. Use semantic/hybrid for conceptual memory queries and CocoIndex for conceptual code queries; do not merge code-semantic and memory-semantic into one tool surface.
- **Impact**: high

### Finding 3: Trigger matching is a separate fast lexical lane, not just a weaker version of hybrid search
- **Source**: [query-classifier.ts:126](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts), [memory-triggers.ts:184](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts), [memory-context.ts:649](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts); evidence type: wrapper-confirmed
- **What it does**: Public classifies exact trigger hits or very short queries as `simple`, exposes a low-latency `quick` mode, and runs `memory_match_triggers` with scope checks and optional cognitive decay instead of forcing every request through embeddings.
- **Why it matters**: For repeated phrasing, known conventions, and short prompts, semantic search mostly adds latency and ambiguity. Trigger phrases are the reliable retrieval primitive here.
- **Recommendation**: adopt now. Route `<=3`-term or repeated workflow prompts to `memory_match_triggers` first, then escalate to hybrid only if the trigger lane is empty or degraded.
- **Impact**: high

### Finding 4: Lexical search should ground semantic reformulation, not compete with it
- **Source**: [llm-reformulation.ts:8](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts), [llm-reformulation.ts:88](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts), [stage1-candidate-gen.ts:1077](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts); evidence type: wrapper-confirmed
- **What it does**: Deep-mode reformulation first pulls cheap FTS/BM25 seeds with no embedding call, then uses those lexical seeds to ground step-back abstractions and semantic variants.
- **Why it matters**: This is the cleanest hybrid pattern in the current system: lexical gives grounded corpus evidence, semantic broadens recall from that evidence. That is better than letting semantic expansion invent the search space alone.
- **Recommendation**: adopt now. Standardize a “lexical seed -> semantic expansion” pattern for deep retrieval, especially when LLM reformulation or multi-query fanout is involved.
- **Impact**: high

### Finding 5: Lexical lanes are useful but noisy, so they should stay asymmetric evidence channels inside fusion
- **Source**: [hybrid-search.ts:1094](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts), [hybrid-search.ts:2144](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts), [memory-search.ts:904](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts); evidence type: wrapper-confirmed
- **What it does**: Public explicitly downweights FTS to `0.3` because heavier lexical weighting flooded top-K with noisy matches, keeps BM25 at `0.6` for breadth, logs lexical capability/fallback state, and only widens search aggressively when degradation triggers.
- **Why it matters**: This is direct evidence that lexical beats semantic on exactness but loses on precision if allowed to dominate fusion. The right hybrid strategy is not “equal channels”; it is asymmetric weighting plus degradation-aware widening.
- **Recommendation**: adopt now. Keep lexical as a supporting evidence lane by default, raise its influence only for artifact-preserving intents or degraded-recall recovery.
- **Impact**: high

### Finding 6: Save-time trigger hygiene is part of the lexical strategy, not just memory quality polish
- **Source**: [quality-loop.ts:87](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts), [quality-loop.ts:427](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts), [scripts/memory/README.md:94](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md); evidence type: wrapper-confirmed
- **What it does**: Public treats missing trigger phrases as a retrieval defect, recommends `4+` triggers, auto-extracts them from titles and headings, and sanitizes noisy triggers during post-save quality review.
- **Why it matters**: Lexical performance in this system is created upstream during memory generation. If trigger metadata is weak, the fast path, the query classifier, and the exact-match lane all degrade together.
- **Recommendation**: adopt now. Treat trigger extraction/sanitization as retrieval infrastructure, not optional documentation hygiene.
- **Impact**: high

## Assessment
- New information ratio: 0.39
- Best hybrid policy for Public is a routing matrix, not one universal fused path:
  - `memory_match_triggers` first for short, repeated, convention-heavy prompts.
  - Lexical-first hybrid for spec/doc/decision/resume queries.
  - Semantic-first hybrid for alias-rich or conceptual memory recall.
  - CocoIndex for conceptual code discovery; code graph for structural questions.
  - Lexical seed retrieval before any deep semantic reformulation.
- Mnemosyne’s useful contribution here is not “hybrid search exists”; Public already has that. The transferable lesson is wrapper ergonomics: make the lane choice obvious to the agent, while keeping fusion asymmetric and evidence-grounded.
- Validation: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict` returned `RESULT: PASSED` with `Errors: 0  Warnings: 0`; the read-only sandbox also emitted `cannot create temp file for here document: Operation not permitted`.

## Recommended Next Focus
Turn this into an operator-facing routing contract for compaction/startup: one compact memory-discipline block that tells the agent when to use `memory_match_triggers`, when to stay lexical-first, when to invoke hybrid semantic search, and when to jump to `session_bootstrap`, CocoIndex, or `code_graph_query` instead of overloading `memory_search`.


hook: Stop
hook: Stop Completed
tokens used
281,732
# Iteration 026: SEMANTIC VS LEXICAL TRADE-OFFS

## Focus
SEMANTIC VS LEXICAL TRADE-OFFS: Deep analysis of when semantic search beats lexical and vice versa in this system. What hybrid strategies should we adopt?

## Findings
### Finding 1: Exact artifact and resume lookups should stay lexical-first, not semantic-first
- **Source**: [query-router.ts:62](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts), [sqlite-fts.ts:147](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts), [memory-context.ts:783](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts); evidence type: wrapper-confirmed
- **What it does**: Public explicitly preserves BM25 for spec-like artifacts and routes `resume` through `memory_search` with anchor filtering. Its FTS lane heavily weights `title`, `trigger_phrases`, and path-like metadata, which is exactly what phase IDs, checklist names, anchor labels, and decision titles depend on.
- **Why it matters**: Semantic similarity is weaker when the user really wants exact identifiers, document classes, phase numbers, or resume anchors. In this system, those are not edge cases; they are a core workflow.
- **Recommendation**: adopt now. Make artifact-oriented queries lexical-first hybrid: run weighted FTS/BM25 as the primary evidence lane, then add semantic only as recall support.
- **Impact**: high

### Finding 2: Semantic search wins on alias-rich, conceptual, and unfamiliar queries, but it should stay a distinct lane
- **Source**: [stage1-candidate-gen.ts:501](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts), [hybrid-search.ts:1061](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts), [mcp-coco-index SKILL.md:20](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/SKILL.md); evidence type: both
- **What it does**: Public already expands concept aliases into the hybrid query, runs a vector channel over embeddings, and keeps CocoIndex as the repo’s dedicated semantic code-search surface for “find code that does X” style exploration.
- **Why it matters**: Semantic search beats lexical when the user does not know the exact token, uses synonyms, or asks in natural-language intent terms. That is especially true for unfamiliar code and fuzzy memory recall.
- **Recommendation**: adopt now. Use semantic/hybrid for conceptual memory queries and CocoIndex for conceptual code queries; do not merge code-semantic and memory-semantic into one tool surface.
- **Impact**: high

### Finding 3: Trigger matching is a separate fast lexical lane, not just a weaker version of hybrid search
- **Source**: [query-classifier.ts:126](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts), [memory-triggers.ts:184](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts), [memory-context.ts:649](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts); evidence type: wrapper-confirmed
- **What it does**: Public classifies exact trigger hits or very short queries as `simple`, exposes a low-latency `quick` mode, and runs `memory_match_triggers` with scope checks and optional cognitive decay instead of forcing every request through embeddings.
- **Why it matters**: For repeated phrasing, known conventions, and short prompts, semantic search mostly adds latency and ambiguity. Trigger phrases are the reliable retrieval primitive here.
- **Recommendation**: adopt now. Route `<=3`-term or repeated workflow prompts to `memory_match_triggers` first, then escalate to hybrid only if the trigger lane is empty or degraded.
- **Impact**: high

### Finding 4: Lexical search should ground semantic reformulation, not compete with it
- **Source**: [llm-reformulation.ts:8](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts), [llm-reformulation.ts:88](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts), [stage1-candidate-gen.ts:1077](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts); evidence type: wrapper-confirmed
- **What it does**: Deep-mode reformulation first pulls cheap FTS/BM25 seeds with no embedding call, then uses those lexical seeds to ground step-back abstractions and semantic variants.
- **Why it matters**: This is the cleanest hybrid pattern in the current system: lexical gives grounded corpus evidence, semantic broadens recall from that evidence. That is better than letting semantic expansion invent the search space alone.
- **Recommendation**: adopt now. Standardize a “lexical seed -> semantic expansion” pattern for deep retrieval, especially when LLM reformulation or multi-query fanout is involved.
- **Impact**: high

### Finding 5: Lexical lanes are useful but noisy, so they should stay asymmetric evidence channels inside fusion
- **Source**: [hybrid-search.ts:1094](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts), [hybrid-search.ts:2144](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts), [memory-search.ts:904](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts); evidence type: wrapper-confirmed
- **What it does**: Public explicitly downweights FTS to `0.3` because heavier lexical weighting flooded top-K with noisy matches, keeps BM25 at `0.6` for breadth, logs lexical capability/fallback state, and only widens search aggressively when degradation triggers.
- **Why it matters**: This is direct evidence that lexical beats semantic on exactness but loses on precision if allowed to dominate fusion. The right hybrid strategy is not “equal channels”; it is asymmetric weighting plus degradation-aware widening.
- **Recommendation**: adopt now. Keep lexical as a supporting evidence lane by default, raise its influence only for artifact-preserving intents or degraded-recall recovery.
- **Impact**: high

### Finding 6: Save-time trigger hygiene is part of the lexical strategy, not just memory quality polish
- **Source**: [quality-loop.ts:87](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts), [quality-loop.ts:427](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts), [scripts/memory/README.md:94](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md); evidence type: wrapper-confirmed
- **What it does**: Public treats missing trigger phrases as a retrieval defect, recommends `4+` triggers, auto-extracts them from titles and headings, and sanitizes noisy triggers during post-save quality review.
- **Why it matters**: Lexical performance in this system is created upstream during memory generation. If trigger metadata is weak, the fast path, the query classifier, and the exact-match lane all degrade together.
- **Recommendation**: adopt now. Treat trigger extraction/sanitization as retrieval infrastructure, not optional documentation hygiene.
- **Impact**: high

## Assessment
- New information ratio: 0.39
- Best hybrid policy for Public is a routing matrix, not one universal fused path:
  - `memory_match_triggers` first for short, repeated, convention-heavy prompts.
  - Lexical-first hybrid for spec/doc/decision/resume queries.
  - Semantic-first hybrid for alias-rich or conceptual memory recall.
  - CocoIndex for conceptual code discovery; code graph for structural questions.
  - Lexical seed retrieval before any deep semantic reformulation.
- Mnemosyne’s useful contribution here is not “hybrid search exists”; Public already has that. The transferable lesson is wrapper ergonomics: make the lane choice obvious to the agent, while keeping fusion asymmetric and evidence-grounded.
- Validation: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict` returned `RESULT: PASSED` with `Errors: 0  Warnings: 0`; the read-only sandbox also emitted `cannot create temp file for here document: Operation not permitted`.

## Recommended Next Focus
Turn this into an operator-facing routing contract for compaction/startup: one compact memory-discipline block that tells the agent when to use `memory_match_triggers`, when to stay lexical-first, when to invoke hybrid semantic search, and when to jump to `session_bootstrap`, CocoIndex, or `code_graph_query` instead of overloading `memory_search`.
