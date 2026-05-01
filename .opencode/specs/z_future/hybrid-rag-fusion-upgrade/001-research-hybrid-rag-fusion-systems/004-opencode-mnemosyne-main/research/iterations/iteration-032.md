# Iteration 032: MIGRATION RISK MATRIX

## Focus
MIGRATION RISK MATRIX: For each adopt-now pattern, detail what could break during migration. Include rollback plans and feature flags needed.

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
chival-manager.ts:638](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L638), [reconsolidation-bridge.ts:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L396); evidence type: wrapper-confirmed
- **What it does**: Public archives low-value memories instead of immediately deleting them, removes archived rows from BM25/vector retrieval, and supports unarchive. The save-time reconsolidation path also archives older near-duplicates rather than physically deleting them.
- **Why it matters**: For long-lived systems, “forgetting” should usually mean reversible removal from active retrieval, not destruction. That preserves lineage, auditability, and recovery when the system over-prunes.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: Hard expiry should stay opt-in and explicitly ephemeral
- **Source**: [save/types.ts:139](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts#L139), [scope-governance.ts:207](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L207), [scope-governance.ts:255](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L255), [scope-governance.ts:260](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L260), [README.md:710](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L710), [memory-governance.vitest.ts:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts#L160); evidence type: both
- **What it does**: Public supports explicit `retentionPolicy` and `deleteAfter`, and governed ingest rejects `ephemeral` saves without a future expiry. I found test/audit evidence for a `retention_sweep` action, but I did not locate a concrete runtime sweep implementation in this checkout.
- **Why it matters**: This is the correct shape for hard expiry: explicit, narrow, and policy-driven. The gap is operational visibility, not the policy model itself.
--
## Findings
### Finding N: [Title]
- **Source**: file path(s)
## Findings
- **Why it matters**: This is the right architecture for long-lived memory. Permanence, recall probability, and current-session salience should stay independent so we do not accidentally make durable rules feel “old” or recent noise feel “important.”
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Reversible forgetting is stronger than hard deletion for durable memory
- **Source**: [archival-manager.ts:358](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L358), [archival-manager.ts:388](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L388), [archival-manager.ts:403](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L403), [archival-manager.ts:558](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L558), [archival-manager.ts:638](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L638), [reconsolidation-bridge.ts:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L396); evidence type: wrapper-confirmed
- **What it does**: Public archives low-value memories instead of immediately deleting them, removes archived rows from BM25/vector retrieval, and supports unarchive. The save-time reconsolidation path also archives older near-duplicates rather than physically deleting them.
--- Iteration 28 ---
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
## Findings
### Finding N: [Title]
- **Source**: file path(s)
- **What it does**: technical description
- **Why it matters**: relevance to our system
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low
--- Iteration 27 ---
- **What it does**: `memory_validate` updates `confidence`, `validationCount`, `positiveValidationCount`, promotion eligibility, negative-feedback events, and learned feedback. The index also exposes `access_count`, `last_accessed`, and cleanup candidates driven by low confidence and low use.
- **Why it matters**: Memory quality should be tracked with usefulness confirmations and longitudinal retention behavior, not only retrieval scores.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Public already measures index integrity and storage health
- **Source**: [memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts), [memory-crud-stats.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- **What it does**: Public reports embedding readiness and retry stats, vector availability, FTS5 parity, alias conflicts, orphan-edge cleanup, by-status embedding counts, trigger totals, tier breakdown, database size, last indexed time, and startup projection health.
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
I’m treating this as a read-only research pass focused on iteration 32’s migration risk matrix. I’ll pull the most relevant prior memory context, re-check the external wrapper and our matching Public surfaces, then synthesize the adopt-now patterns into concrete breakage risks, rollback paths, and feature-flag recommendations.
exec
/bin/zsh -lc 'pwd && test -f /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts && echo INDEX_OK || echo INDEX_MISSING' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -n \"mnemosyne|compaction|migration|adopt now|hybrid-rag-fusion|004-opencode-mnemosyne-main|memory_remember|project\\|global|archival|retention\" /Users/michelkerkmeester/.codex/memories/MEMORY.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
INDEX_OK

 succeeded in 0ms:
263:- 006-memory-duplication-reduction, PR-12 wrapper contract, PR-13 optional migration, no new research, collector/workflow/template/reviewer surfaces, Phase 7 parity audits
275:- Task sheet drift note: `003/.../006-memory-duplication-reduction/tasks.md` still reflects the older research wave; treat PR-12 implementation as primary and PR-13 migration as optional only if wrapper rollout is evidence-justified [Task 2]
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
964:scope: command-surface migrations for memory/spec_kit commands, mirror wrappers, and canonical spec packets after UX or naming shifts
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1156:## Task 5: Sync `023-esm-module-compliance` docs to 20-iteration research conclusions while keeping runtime migration pending
1171:- when syncing packet 023, user insisted docs must mirror completed research while “keep runtime migration pending” -> do truth-sync in packet docs without claiming implementation completion [Task 5]
1175:- Slug migration sequence: enumerate old patterns, replace in one sweep, verify via `rg` + `jq empty` on touched JSON [Task 1]
1182:- Keep standards-doc updates deferred until runtime verification passes; strict packet validation can be green while runtime migration remains intentionally pending [Task 5]
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1567:- March 21 command counts are historical snapshots; use fresher command-surface migrations for current truth [Task 3]
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
1784:## Task 3: Refine Phase-015 governance/collaboration boundaries and retention scope
1826:- Governance hardening in this wave centered on guaranteed session/tenant enforcement in `filterRowsByScope`, shared-space authorization, and scoped retention sweep deletions [Task 3]
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

codex
I found only light prior memory on migration wording, not a prior Mnemosyne risk-matrix answer, so I’m going back to source evidence rather than leaning on stale synthesis. Next I’m re-reading the wrapper and Public’s compaction/governance surfaces side by side so the migration risks stay grounded in actual code paths.
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
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "DEEP RESEARCH iteration 32 of 40 final extended run on external memory system; migration risk matrix for adopt-now patterns in Mnemosyne vs Spec Kit Memory" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1753ms:

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


 succeeded in 1804ms:
2026-04-10 23:14:46.875 xcodebuild[40454:38627727]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-04-10 23:14:47.068 xcodebuild[40454:38627721] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-2pkDsQx1' (errno=Operation not permitted)
2026-04-10 23:14:47.524 xcodebuild[40519:38627841]  DVTFilePathFSEvents: Failed to start fs event stream.
2026-04-10 23:14:47.695 xcodebuild[40519:38627829] [MT] DVTDeveloperPaths: Failed to get length of DARWIN_USER_CACHE_DIR from confstr(3), error = Error Domain=NSPOSIXErrorDomain Code=5 "Input/output error". Using NSCachesDirectory instead.
[
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
    "reason": "Matched: !deep research(phrase), context, deep(name), external~, iteration"
  },
  {
    "skill": "mcp-coco-index",
    "kind": "skill",
    "confidence": 0.92,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: embedding~, index(name), patterns, research~, vector"
  },
  {
    "skill": "mcp-code-mode",
    "kind": "skill",
    "confidence": 0.82,
    "uncertainty": 0.2,
    "passes_threshold": true,
    "reason": "Matched: !external, context, external"
  },
  {
    "skill": "sk-deep-review",
    "kind": "skill",
    "confidence": 0.81,
    "uncertainty": 0.35,
    "passes_threshold": true,
    "reason": "Matched: context, deep(name), external~, iteration"
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
The wrapper read is in hand. I’m polling the validator and the advisor command, then I’ll pull the matching Public retrieval, compaction, archival, and governance code that controls real migration blast radius.
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

codex
Skill routing is clear: `system-spec-kit` and `sk-deep-research` both pass strongly, with `mcp-coco-index` also relevant for unfamiliar-code discovery. I’m loading just the minimal skill instructions now, then I’ll finish source collection against Public’s migration-sensitive paths.
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
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
name: system-spec-kit
description: "Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation, and Spec Kit Memory for context preservation. Mandatory for all file modifications."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 3.2.0.0
---

<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, spec-kit-memory, vector-search, hybrid-search, bm25, rrf-fusion, fsrs-decay, constitutional-tier, checkpoint, importance-tiers, cognitive-memory, co-activation, tiered-injection -->

# Spec Kit - Mandatory Conversation Documentation

Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3+), template usage, and context preservation through AGENTS.md-enforced workflows.


<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### What is a Spec Folder?

A **spec folder** is a numbered directory (e.g., `007-auth-feature/`) that contains documentation for a single feature/task or a coordinated packet of related phase work:

Spec folders may also be nested as coordination-root packets with direct-child phase folders (e.g., `specs/02--track/022-feature/011-phase/002-child/`).

- **Purpose**: Track specifications, plans, tasks, and decisions for one unit of work
- **Location**: Under `specs/` using either `###-short-name/` at the root or nested packet paths for phased coordination
- **Contents**: Markdown files (spec.md, plan.md, tasks.md) plus optional memory/ and scratch/ subdirectories

Think of it as a "project folder" for AI-assisted development - it keeps context organized and enables session continuity.

### Activation Triggers

**MANDATORY for ALL file modifications:**
- Code files: JS, TS, Python, CSS, HTML
- Documentation: Markdown, README, guides
- Configuration: JSON, YAML, TOML, env templates
- Templates, knowledge base, build/tooling files

**Request patterns that trigger activation:**
- "Add/implement/create [feature]"
- "Fix/update/refactor [code]"
- "Modify/change [configuration]"
- Any keyword: add, implement, fix, update, create, modify, rename, delete, configure, analyze, phase

**Example triggers:**
- "Add email validation to the signup form" → Level 1-2
- "Refactor the authentication module" → Level 2-3
- "Fix the button alignment bug" → Level 1
- "Implement user dashboard with analytics" → Level 3

### When NOT to Use

- Pure exploration/reading (no file modifications)
- Single typo fixes (<5 characters in one file)
- Whitespace-only changes
- Auto-generated file updates (package-lock.json)
- User explicitly selects Option D (skip documentation)

**Rule of thumb:** If modifying ANY file content → Activate this skill.
Status: ✅ This requirement applies immediately once file edits are requested.

### Agent Exclusivity

**⛔ CRITICAL:** `@speckit` is the ONLY agent permitted to create or substantively write spec folder documentation (*.md files).

- **Requires @speckit:** spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, and any other *.md in spec folders
- **Exceptions:**
  - `memory/` → uses generate-context.js script
  - `scratch/` → temporary workspace, any agent
  - `handover.md` → @handover agent only
  - `research/research.md` → @deep-research agent only
  - `debug-delegation.md` → @debug agent only

Routing to `@general`, `@write`, or other agents for spec documentation is a **hard violation**. See constitutional memory: `speckit-exclusivity.md`

### Utility Template Triggers

| Template              | Trigger Keywords                                                                                                              | Action                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `handover.md`         | "handover", "next session", "continue later", "pass context", "ending session", "save state", "multi-session", "for next AI"  | Suggest creating handover |
| `debug-delegation.md` | "stuck", "can't fix", "tried everything", "same error", "fresh eyes", "hours on this", "still failing", "need help debugging" | Suggest `/spec_kit:debug` |

**Rule:** When detected, proactively suggest the appropriate action.

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/` and then applies intent scoring from `RESOURCE_MAP`. Keep this section domain-focused rather than static file inventories.

- `references/memory/` for context retrieval, save workflows, trigger behavior, and indexing.
- `references/templates/` for level selection, template composition, and structure guides.
- `references/validation/` for checklist policy, verification rules, decision formats, and template compliance contracts.
- `references/structure/` for folder organization and sub-folder versioning.
- `references/workflows/` for command workflows and worked examples.
- `references/debugging/` for troubleshooting and root-cause methodology.
- `references/config/` for runtime environment configuration.

### Template and Script Sources of Truth

- Level definitions and template size guidance: [level_specifications.md](./references/templates/level_specifications.md)
- Template usage and composition rules: [template_guide.md](./references/templates/template_guide.md)
- Use `templates/level_N/` for operational templates; `core/` and `addendum/` remain composition inputs.
- Use `templates/changelog/` for packet-local nested changelog generation at completion time.
- Script architecture, build outputs, and runtime entrypoints: [scripts/README.md](./scripts/README.md)
- Memory save JSON schema and workflow contracts: [save_workflow.md](./references/memory/save_workflow.md)
- Nested packet changelog workflow: [nested_changelog.md](./references/workflows/nested_changelog.md)

Primary operational scripts:
- `spec/validate.sh`
- `spec/create.sh`
- `spec/archive.sh`
- `spec/check-completion.sh`
- `spec/recommend-level.sh`
- `templates/compose.sh`

### Resource Loading Levels

| Level       | When to Load               | Resources                    |
| ----------- | -------------------------- | ---------------------------- |
| ALWAYS      | Every skill invocation     | Shared patterns + SKILL.md   |
| CONDITIONAL | If intent signals match   | Intent-mapped references     |
| ON_DEMAND   | Only on explicit request   | Deep-dive quality standards  |

`references/workflows/quick_reference.md` is the primary first-touch command surface. Keep the compact `spec_kit` and `memory` command map there, and use this file only to point readers to it rather than duplicating the full matrix.

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/workflows/quick_reference.md"

INTENT_SIGNALS = {
    "PLAN": {"weight": 3, "keywords": ["plan", "design", "new spec", "level selection", "option b"]},
    "RESEARCH": {"weight": 3, "keywords": ["investigate", "explore", "analyze", "prior work", "evidence"]},
    "IMPLEMENT": {"weight": 3, "keywords": ["implement", "build", "execute", "workflow"]},
    "DEBUG": {"weight": 4, "keywords": ["stuck", "error", "not working", "failed", "debug"]},
    "COMPLETE": {"weight": 4, "keywords": ["done", "complete", "finish", "verify", "checklist"]},
    "MEMORY": {"weight": 4, "keywords": ["memory", "save context", "resume", "checkpoint", "context"]},
    "HANDOVER": {"weight": 4, "keywords": ["handover", "continue later", "next session", "pause"]},
    "PHASE": {"weight": 4, "keywords": ["phase", "decompose", "split", "workstream", "multi-phase", "phased approach", "phased", "multi-session"]},
    "RETRIEVAL_TUNING": {"weight": 3, "keywords": ["retrieval", "search tuning", "fusion", "scoring", "pipeline"]},
    "EVALUATION": {"weight": 3, "keywords": ["evaluate", "ablation", "benchmark", "baseline", "metrics"]},
    "SCORING_CALIBRATION": {"weight": 3, "keywords": ["calibration", "scoring", "normalization", "decay", "interference"]},
    "ROLLOUT_FLAGS": {"weight": 3, "keywords": ["feature flag", "rollout", "toggle", "enable", "disable"]},
    "GOVERNANCE": {"weight": 3, "keywords": ["governance", "shared memory", "tenant", "retention", "audit"]},
}

RESOURCE_MAP = {
    "PLAN": [
        "references/templates/level_specifications.md",
        "references/templates/template_guide.md",
        "references/validation/template_compliance_contract.md",
    ],
    "RESEARCH": [
        "references/workflows/quick_reference.md",
        "references/workflows/worked_examples.md",
        "references/memory/epistemic_vectors.md",
    ],
    "IMPLEMENT": [
        "references/validation/validation_rules.md",
        "references/validation/template_compliance_contract.md",
        "references/templates/template_guide.md",
    ],
    "DEBUG": [
        "references/debugging/troubleshooting.md",
        "references/workflows/quick_reference.md",
        "manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md",
    ],
    "COMPLETE": [
        "references/validation/validation_rules.md",
        "references/workflows/nested_changelog.md",
    ],
    "MEMORY": [
        "references/memory/memory_system.md",
        "references/memory/save_workflow.md",
        "references/memory/trigger_config.md",
    ],
    "HANDOVER": [
        "references/workflows/quick_reference.md",
    ],
    "PHASE": [
        "references/structure/phase_definitions.md",
        "references/structure/sub_folder_versioning.md",
        "references/validation/phase_checklists.md",
    ],
    "RETRIEVAL_TUNING": [
        "references/memory/embedding_resilience.md",
        "references/memory/trigger_config.md",
    ],
    "EVALUATION": [
        "references/memory/epistemic_vectors.md",
        "references/config/environment_variables.md",
        "manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md",
    ],
    "SCORING_CALIBRATION": [
        "references/config/environment_variables.md",
    ],
    "ROLLOUT_FLAGS": [
        "references/config/environment_variables.md",
        "feature_catalog/19--feature-flag-reference/",
    ],
    "GOVERNANCE": [
        "references/config/environment_variables.md",
    ],
}

COMMAND_BOOSTS = {
    "/spec_kit:plan": "PLAN",
    "/spec_kit:implement": "IMPLEMENT",
    "/spec_kit:debug": "DEBUG",
    "/spec_kit:complete": "COMPLETE",

exec
/bin/zsh -lc "sed -n '1,200p' .opencode/skill/mcp-coco-index/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
I’ve got the wrapper contract and README contract separated now. The remaining work is mapping that onto Public’s actual failure domains: retrieval exclusion rules, archival/expiry behavior, validation signals, and compaction transport, because those are the places migration can quietly break correctness rather than just UX.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "rg -n \"experimental\\.session\\.compacting|memory_validate|access_count|last_accessed|retentionPolicy|deleteAfter|includeArchived|unarchive|archiv|confidence|validationCount|positiveValidationCount|core=true|project\\|global|memory_recall_global|memory_store_global\" .opencode/plugins .opencode/skill/system-spec-kit/mcp_server" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:107:// T059: Archival manager for automatic archival of ARCHIVED state memories
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:108:import * as archivalManager from './lib/cognitive/archival-manager.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:707:      includeArchived: true,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1363:  runCleanupStep('archivalManager', () => archivalManager.cleanup());
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1576:      archivalManager,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1728:    // T059: Archival Manager for automatic archival of ARCHIVED state memories
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1730:      archivalManager.init(database);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1731:      // Start background archival job (scans every hour by default)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1732:      archivalManager.startBackgroundJob();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1733:      if (archivalManager.isBackgroundJobRunning()) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1738:    } catch (archivalErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1739:      const message = archivalErr instanceof Error ? archivalErr.message : String(archivalErr);
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:116:| `SPECKIT_CONFIDENCE_TRUNCATION` | `true` | boolean | Confidence-gap truncation for low-confidence result tails. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:137:| `SPECKIT_NEGATIVE_FEEDBACK` | `true` | boolean | Negative-feedback confidence demotion in ranking (T002b/A4). Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:159:| `SPECKIT_HYDE` | `true` | boolean | Hypothetical Document Embeddings for low-confidence deep queries (REQ-D2-004). Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:162:| `SPECKIT_INTENT_CONFIDENCE_FLOOR` | `0.25` | number | Minimum confidence for auto-detected intent. Below this, overrides to "understand". | `handlers/memory-search.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:223:| `SPECKIT_ARCHIVAL` | `true` | boolean | Archival manager for aging out stale memories (90-day max age). Graduated ON. | `lib/cognitive/archival-manager.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:287:| `SPECKIT_RESULT_CONFIDENCE_V1` | `true` | boolean | Per-result calibrated confidence scoring (REQ-D5-004). Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:46:  includeArchived?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:76:type CrudMutationType = 'create' | 'update' | 'delete' | 'merge' | 'archive' | 'restore' | 'reindex';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:9:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:34:  contradiction?: { detected: boolean; type: string | null; description: string | null; confidence: number } | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:139:  retentionPolicy?: 'keep' | 'ephemeral' | 'shared';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:140:  deleteAfter?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:369:  // shadow-only (auto-merge at >= 0.96 only archives old record).
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:396:          // Auto-merge: archive the older memory record (shadow operation —
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:397:          // we mark is_archived so it is excluded from future search results
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:402:              SET is_archived = 1,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:410:              `[reconsolidation-bridge] assistive auto-merge: archived older=${topId} ` +
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:415:            console.warn(`[reconsolidation-bridge] assistive auto-merge archive failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:20:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:27:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:31:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:292:export const handle_memory_validate = lazyFunction(getCheckpointsModule, 'handle_memory_validate');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:302:    confidence: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:306:  if (!queryIntentMetadata || queryIntentMetadata.queryIntent !== 'structural' || queryIntentMetadata.confidence <= 0.65) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:555:            confidence: r.confidence,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:888:    intentConfidence = classification.confidence;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1061:      confidence: intentConfidence,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1137:    confidence: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1147:        routedBackend: classification.intent === 'structural' && classification.confidence > 0.65
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1152:        confidence: classification.confidence,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1169:      if (classification.intent === 'structural' && classification.confidence > 0.65) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1200:      // 'semantic' or low-confidence: no graph context, fall through
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:535:        const archivePlaceholders = oldChildIds.map(() => '?').join(', ');
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:540:          WHERE id IN (${archivePlaceholders})
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:22:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:159:      includeArchived: false,
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:36:- `checkpoints.ts` - Checkpoint lifecycle plus `memory_validate`.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:451:          confidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:452:          numericConfidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:478:          confidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:479:          numericConfidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:504:          confidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:505:          numericConfidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:530:          confidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:531:          numericConfidence: clampNumericConfidence(entry.edge.metadata?.confidence ?? entry.edge.weight),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1114:    retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1115:    deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1145:    retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1146:    deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1471:        metadata: { filePath: validatedPath, retentionPolicy: governanceDecision.normalized.retentionPolicy },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:29:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:170:      includeArchived: {
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:173:        description: 'Include archived memories in search results. Default: false (archived excluded).'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:220:  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:233:  inputSchema: { type: 'object', additionalProperties: false, properties: { folderRanking: { type: 'string', enum: ['count', 'recency', 'importance', 'composite'], description: 'How to rank folders: count (default, by memory count), recency (most recent first), importance (by tier), composite (weighted multi-factor score)', default: 'count' }, excludePatterns: { type: 'array', items: { type: 'string' }, description: 'Regex patterns to exclude folders (e.g., ["z_archive", "scratch"])' }, includeScores: { type: 'boolean', description: 'Include score breakdown for each folder', default: false }, includeArchived: { type: 'boolean', description: 'Include archived/test/scratch folders in results', default: false }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum number of folders to return', default: 10 } } },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:298:  name: 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:299:  description: '[L4:Mutation] Record validation feedback for a memory. Tracks whether memories are useful, updating confidence scores. Memories with high confidence and validation counts may be promoted to critical tier. Token Budget: 500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:305:      wasUseful: { type: 'boolean', description: 'Whether the memory was useful (true increases confidence, false decreases it)' },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:24:const SPEC_DOC_EXCLUDE_DIRS = new Set(['scratch', 'memory', 'node_modules', 'iterations', 'z_archive']);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:63:    includeArchived = false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:105:  if (includeArchived !== undefined && typeof includeArchived !== 'boolean') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:108:      error: 'includeArchived must be a boolean',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:182:      if (!includeArchived) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:208:          created_at, updated_at, confidence, validation_count, access_count
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:214:        includeArchived,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:240:          .filter(([folder]) => includeArchived || !folderScoring.isArchived(folder))
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:42:} from '../lib/search/confidence-scoring.js';
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
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:184:              confidence: a.confidence,
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:604:When Z-score analysis signals low-confidence retrieval (insufficient signal in the indexed corpus), the server prepends an evidence gap warning to the LLM payload. This tells the AI assistant that results may be incomplete rather than letting it treat sparse results as authoritative.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:614:- `quality`: Result quality score based on embedding confidence and match density
.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts:21:// Feature catalog: Validation feedback (memory_validate)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:127:  last_accessed?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:203:  includeArchived?: boolean; // REQ-206: include archived memories in search (default false)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:520:    includeArchived: includeArchived = false, // REQ-206: exclude archived by default
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:672:    intentConfidence = classification.confidence;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:678:      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (confidence: ${intentConfidence.toFixed(2)})`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:682:  // FIX RC3-B: Intent confidence floor — override low-confidence auto-detections to "understand"
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:685:    console.error(`[memory-search] Intent confidence ${intentConfidence.toFixed(3)} below floor ${INTENT_CONFIDENCE_FLOOR}, overriding '${detectedIntent}' → 'understand'`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:707:  if (detectedIntent && artifactRouting?.detectedClass === 'unknown' && artifactRouting?.confidence === 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:733:    includeArchived,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:787:      includeArchived,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:931:        confidence: intentConfidence,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1006:      normalizedQuery,   // REQ-D5-001/D5-004: pass query for recovery + confidence context
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1273:            confidence: 'weak',
.opencode/skill/system-spec-kit/mcp_server/handlers/types.ts:23:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:13:import * as confidenceTracker from '../lib/scoring/confidence-tracker.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:97:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:98:  validationCount: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:99:  positiveValidationCount: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648:/** Handle memory_validate tool - records user validation feedback to adjust confidence */
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:681:  const result: ValidationResult = confidenceTracker.recordValidation(database, memoryId, wasUseful);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:688:      actor: sessionId ?? 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:721:  // T002b: Negative-feedback confidence signal persistence for runtime scoring.
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:726:  // T002 + T027a: Optional wiring from memory_validate to learned feedback + ground truth.
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:768:    ? `Positive validation recorded (confidence: ${result.confidence.toFixed(2)})`
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:769:    : `Negative validation recorded (confidence: ${result.confidence.toFixed(2)})`;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:775:  if (!wasUseful && result.validationCount > 3) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:780:    tool: 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:785:      confidence: result.confidence,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:786:      validationCount: result.validationCount,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:787:      positiveValidationCount: result.positiveValidationCount,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:815:const handle_memory_validate = handleMemoryValidate;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:822:  handle_memory_validate,
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:65:      if (!metadata || typeof metadata.confidence !== 'number') {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:87:      if (!best || metadata.confidence > best.numericConfidence) {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:90:          numericConfidence: metadata.confidence,
.opencode/skill/system-spec-kit/mcp_server/README.md:249:| Tier 2 | BM25 keyword scoring | FTS5 results below confidence floor |
.opencode/skill/system-spec-kit/mcp_server/README.md:285:**Stage 4 -- Filter and annotate**. Enforces score immutability (no score changes after Stage 2). Applies state filtering by minimum state parameter. Annotates results with confidence labels (high/medium/low) and feature flag states.
.opencode/skill/system-spec-kit/mcp_server/README.md:311:For low-confidence deep searches, the system has two additional fallback strategies:
.opencode/skill/system-spec-kit/mcp_server/README.md:396:| **REINFORCE** | Similar exists, new one adds value | Both kept, old one gets a confidence boost |
.opencode/skill/system-spec-kit/mcp_server/README.md:461:**Result confidence scoring** -- tags each result as high, medium or low confidence using fast heuristics (no LLM needed). Checks: top-K separation, multi-channel agreement, quality score and source document structure.
.opencode/skill/system-spec-kit/mcp_server/README.md:710:| `retentionPolicy` | string | `keep` (default), `ephemeral`, `shared` |
.opencode/skill/system-spec-kit/mcp_server/README.md:711:| `deleteAfter` | string | ISO date for automatic deletion |
.opencode/skill/system-spec-kit/mcp_server/README.md:758:| `includeArchived` | boolean | Include ARCHIVED state memories in counts |
.opencode/skill/system-spec-kit/mcp_server/README.md:816:##### `memory_validate`
.opencode/skill/system-spec-kit/mcp_server/README.md:818:Tell the system whether a search result was helpful. Helpful results get a confidence boost so they show up more often. Unhelpful results get demoted. Over time, the system learns which memories are genuinely useful, like training a recommendation engine with thumbs-up and thumbs-down.
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:71:  'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:106:    case 'memory_validate':       return handleMemoryValidate(parseArgs<MemoryValidateArgs>(validateToolArgs('memory_validate', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:75:  includeArchived?: boolean;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:120:  includeArchived?: boolean;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:164:  retentionPolicy?: 'keep' | 'ephemeral' | 'shared';
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:165:  deleteAfter?: string;
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:149:  includeArchived: z.boolean().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:195:  retentionPolicy: z.enum(['keep', 'ephemeral', 'shared']).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:196:  deleteAfter: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:253:  includeArchived: z.boolean().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:407:  memory_validate: memoryValidateSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:466:  memory_save: ['filePath', 'force', 'dryRun', 'skipPreflight', 'asyncEmbedding', 'tenantId', 'userId', 'agentId', 'sessionId', 'sharedSpaceId', 'provenanceSource', 'provenanceActor', 'governedAt', 'retentionPolicy', 'deleteAfter'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:468:  memory_stats: ['folderRanking', 'excludePatterns', 'includeScores', 'includeArchived', 'limit'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:472:  memory_validate: ['id', 'wasUseful', 'queryId', 'queryTerms', 'resultRank', 'totalResultsShown', 'searchMode', 'intent', 'sessionId', 'notes'],
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:73:    { id: 905, content: 'Memory archival operations and retention policies for old sessions. '.repeat(2) },
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:57:  'access_count',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:58:  'last_accessed',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:65:  'confidence',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:72:  'is_archived',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:133:      access_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:134:      last_accessed INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:141:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:148:      is_archived INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:174:    CREATE INDEX IF NOT EXISTS idx_access_importance ON memory_index(access_count DESC, importance_weight DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:180:    CREATE INDEX IF NOT EXISTS idx_last_accessed ON memory_index(last_accessed DESC);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:855:    const lowRecallVectorSearch = () => [{ id: 1, similarity: 0.01, content: 'vector low confidence' }];
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1281:  it('T024: co-activation promotion happens before confidence truncation drops tail candidates', async () => {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:158:      SET access_count = access_count + 1,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:159:          last_accessed = ?
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:84:      AND (m.is_archived IS NULL OR m.is_archived = 0)
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:123:        is_archived INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:148:        last_accessed TEXT,
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
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:346:        SELECT id, strength, last_accessed, created_by FROM causal_edges
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:347:        WHERE last_accessed IS NOT NULL
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:348:          AND last_accessed > datetime('now', '-7 days')
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:370:        SELECT id, strength, last_accessed, created_by FROM causal_edges
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:371:        WHERE (last_accessed IS NULL AND extracted_at < datetime('now', '-' || ? || ' days'))
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:372:           OR (last_accessed IS NOT NULL AND last_accessed < datetime('now', '-' || ? || ' days'))
.opencode/skill/system-spec-kit/mcp_server/tests/typed-traversal.vitest.ts:27:      last_accessed TEXT
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:54:        confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:38:      is_archived INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:43:      access_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:45:      last_accessed TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:71:    INSERT INTO memory_index (title, trigger_phrases, spec_folder, parent_id, importance_tier, is_archived)
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:238:  it('ignores archived and deprecated siblings that are no longer retrievable', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:246:      title: 'authentication login session token validation handler middleware security user access archived',
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:364:  it('skips archived and deprecated rows during batch scoring', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:377:      title: 'authentication login session token validation handler middleware security user access archived',
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:478:      access_count: 10,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:502:      access_count: 10,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:529:      access_count: 10,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:552:      access_count: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:89:      avgConfidence: undefined, // no confidence data
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:143:  it('emits status "low_confidence" when avgConfidence < threshold', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:148:    expect(payload.status).toBe('low_confidence');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:250:  it('recommends "ask_user" for low_confidence + knowledge_gap', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:257:    expect(payload.status).toBe('low_confidence');
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:324:    const validStatuses = ['no_results', 'low_confidence', 'partial'] as const;
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:95:    const content = 'Must stop if confidence is below 80%.';
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:98:    expect(directive!.surfaceCondition).toContain('confidence is below 80%');
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:19:} from '../lib/search/confidence-truncation';
.opencode/plugins/spec-kit-compact-code-graph.js:396:    'experimental.session.compacting': async (input, output) => {
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:114:  it('returns the merged survivor id instead of the archived predecessor id', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:152:  it('removes archived assistive auto-merge documents from the BM25 singleton', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:153:    const archiveRun = vi.fn();
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:155:      prepare: vi.fn(() => ({ run: archiveRun })),
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:192:    expect(archiveRun).toHaveBeenCalledWith(55);
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:45:      access_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:46:      last_accessed INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:55:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1264:    if (column === 'confidence') return 0.5;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1271:  if (column === 'confidence') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1329:    'access_count',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1330:    'last_accessed',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1337:    'confidence',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1344:    'is_archived',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:124:        last_accessed TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:274:        '/archive/specs/002-feature/memory/implementation-notes.md.bak',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:275:        '/archive/specs/002-feature/memory/implementation-notes.md.bak',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:452:          confidence: 0.85,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:70:        'handle_memory_validate',
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:4:// When wasUseful=false is recorded via memory_validate, reduce the
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:5:// Memory's composite score via a confidence multiplier.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:12:// Feature catalog: Negative feedback confidence signal
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:56: * Compute the confidence multiplier based on negative validation count
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:103: * Apply negative feedback confidence signal to a composite score.
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:160:      last_accessed TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/degree-computation.vitest.ts:37:      last_accessed TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:73:    it('T211: 89 days + low R => NOT archived', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:171:    it('T226: Constitutional => never archive', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:175:    it('T227: Critical => never archive', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:179:    it('T228: Pinned => never archive', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:183:    it('T229: Old low-stability normal => should archive', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:187:    it('T230: Recent high-stability => should NOT archive', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts:152:        { detected: true, type: 'deprecation', description: 'Previous guidance replaced', confidence: 0.75 },
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:19:    access_count: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:37:      access_count: 100,
.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:49:      access_count: 100,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:349:  // D1: All fields are serialized for archival — only `.snapshot` is read back
.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:163:vi.mock('../lib/search/confidence-scoring', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:212:      includeArchived: false,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:61:      last_accessed TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-seed-resolver.vitest.ts:58:    expect(ref.confidence).toBeCloseTo(0.89, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-seed-resolver.vitest.ts:69:    expect(ref.confidence).toBeLessThan(0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:105:    expect(typeof result.confidence).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:114:    expect(result.confidence).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:121:    expect(result.confidence).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:420:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:646:  it('C138-T2: classifyIntent returns confidence between 0 and 1', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:648:    expect(result.confidence).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:649:    expect(result.confidence).toBeLessThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/usage-weighted-ranking.vitest.ts:23:      access_count INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/tests/usage-weighted-ranking.vitest.ts:56:    expect(columns.filter((column) => column.name === 'access_count')).toHaveLength(1);
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:278:    it('Rejects spec.md in /z_archive/ directory', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:279:      expect(isMemoryFile('/p/.opencode/specs/003/100/z_archive/spec.md')).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:427:      access_count: 10,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:473:        access_count: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:497:      access_count: 10,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:776:        access_count: 10,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:868:        access_count: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:869:        last_accessed: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:876:        confidence: 0.8,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:911:        access_count: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:912:        last_accessed: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:919:        confidence: 0.8,
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:8:import * as confidenceTracker from '../lib/scoring/confidence-tracker';
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:23:    confidence = 0.95,
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:24:    validationCount = 0,
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:25:  }: { tier?: string; confidence?: number; validationCount?: number } = {},
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:28:    INSERT INTO memory_index (id, title, confidence, validation_count, importance_tier, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:30:  `).run(id, `memory-${id}`, confidence, validationCount, tier, new Date().toISOString());
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:41:        confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:58:  it('confidence-tracker eligibility subtracts negative validations from threshold counts', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:59:    insertMemory(1, { confidence: 0.95, validationCount: 5, tier: 'normal' });
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:60:    expect(confidenceTracker.checkPromotionEligible(db, 1)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:65:    expect(confidenceTracker.checkPromotionEligible(db, 1)).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:67:    const info = confidenceTracker.getConfidenceInfo(db, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:68:    expect(info.validationCount).toBe(5);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:69:    expect(info.positiveValidationCount).toBe(3);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:73:  it('recordValidation reports positiveValidationCount separately from total validationCount', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:74:    insertMemory(2, { confidence: 0.9, validationCount: 4, tier: 'normal' });
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:76:    const negativeResult = confidenceTracker.recordValidation(db, 2, false);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:77:    expect(negativeResult.validationCount).toBe(5);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:79:    expect(negativeResult.positiveValidationCount).toBe(4);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:85:    const positiveResult = confidenceTracker.recordValidation(db, 2, true);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:86:    expect(positiveResult.validationCount).toBe(6);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:87:    expect(positiveResult.positiveValidationCount).toBe(5);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:92:    insertMemory(3, { tier: 'normal', validationCount: 5 });
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:98:    expect(blocked.validationCount).toBe(3);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:101:    insertMemory(4, { tier: 'normal', validationCount: 7 });
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:107:    expect(eligible.validationCount).toBe(5);
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:118:    insertMemory(10, { tier: 'normal', validationCount: 5 });
.opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts:119:    insertMemory(11, { tier: 'normal', validationCount: 5 });
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:120:    const warning = '> **⚠️ EVIDENCE GAP DETECTED:** Retrieved context has low mathematical confidence. Consider first principles.';
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:126:    const warning = '> **⚠️ EVIDENCE GAP DETECTED:** Retrieved context has low mathematical confidence. Consider first principles.';
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:14:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:15:  validationCount: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:16:  positiveValidationCount: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:22:  confidenceRequired: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:24:  confidenceMet: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:30:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:31:  validationCount: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:32:  positiveValidationCount: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:39:  confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:41:  validationCount?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:68:  confidence: number,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:69:  positiveValidationCount: number
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:75:  return confidence >= PROMOTION_CONFIDENCE_THRESHOLD &&
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:76:    positiveValidationCount >= PROMOTION_VALIDATION_THRESHOLD;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:97: * Record a validation event for a memory and persist confidence counters.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:100: * - This function updates `memory_index.confidence` and `validation_count`,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:114:        SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:121:      const currentConfidence = memory.confidence ?? CONFIDENCE_BASE;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:130:      const currentValidationCount = memory.validationCount ?? memory.validation_count ?? 0;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:135:        SET confidence = ?, validation_count = ?, updated_at = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:143:      const positiveValidationCount = resolvePositiveValidationCount(
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:152:        positiveValidationCount
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:157:        console.warn('[confidence-tracker] negative feedback recorded', {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:166:        confidence: newConfidence,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:167:        validationCount: newValidationCount,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:168:        positiveValidationCount,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:177:    console.error(`[confidence-tracker] recordValidation failed for memory ${memoryId}:`, error);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:183: * Get current confidence score for a memory.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:189:      SELECT confidence FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:190:    `).get(memoryId) as { confidence?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:196:    return memory.confidence ?? CONFIDENCE_BASE;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:198:    console.error(`[confidence-tracker] getConfidenceScore failed for memory ${memoryId}:`, error);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:209:      SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:221:    const confidence = memory.confidence ?? CONFIDENCE_BASE;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:222:    const validationCount = memory.validationCount ?? memory.validation_count ?? 0;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:224:    const positiveValidationCount = resolvePositiveValidationCount(validationCount, negativeValidationCount);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:226:    return isPromotionEligible(memory.importance_tier, confidence, positiveValidationCount);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:228:    console.error(`[confidence-tracker] checkPromotionEligible failed for memory ${memoryId}:`, error);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:240:        SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:251:      const validationCount = memory.validationCount ?? memory.validation_count ?? 0;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:253:      const positiveValidationCount = resolvePositiveValidationCount(validationCount, negativeValidationCount);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:256:        `Requires confidence >= ${PROMOTION_CONFIDENCE_THRESHOLD} (current: ${memory.confidence ?? CONFIDENCE_BASE}) ` +
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:257:        `and positive_validation_count >= ${PROMOTION_VALIDATION_THRESHOLD} (current: ${positiveValidationCount})`
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:268:    console.warn(`[confidence-tracker] Memory ${memoryId} promoted to critical tier`);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:272:    console.error(`[confidence-tracker] promoteToCritical failed for memory ${memoryId}:`, error);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:278: * Get full confidence info for a memory.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:286:      SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:293:    const confidence = memory.confidence ?? CONFIDENCE_BASE;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:294:    const validationCount = memory.validationCount ?? memory.validation_count ?? 0;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:296:    const positiveValidationCount = resolvePositiveValidationCount(validationCount, negativeValidationCount);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:300:      confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:301:      validationCount,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:302:      positiveValidationCount,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:304:      promotionEligible: isPromotionEligible(memory.importance_tier, confidence, positiveValidationCount),
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:306:        confidenceRequired: PROMOTION_CONFIDENCE_THRESHOLD,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:308:        confidenceMet: confidence >= PROMOTION_CONFIDENCE_THRESHOLD,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:309:        validationsMet: positiveValidationCount >= PROMOTION_VALIDATION_THRESHOLD,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:315:    console.error(`[confidence-tracker] getConfidenceInfo failed for memory ${memoryId}:`, error);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:289:      // Mark existing memory as archived (superseded)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:292:        SET is_archived = 1,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:834:  const value = row.is_archived;
.opencode/skill/system-spec-kit/mcp_server/tests/job-queue-state-edge.vitest.ts:130:  it('T005b-Q3d: getIngestForecast returns low-confidence caveat before progress starts', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/job-queue-state-edge.vitest.ts:146:      caveat: 'Forecast is low-confidence until at least one file has been processed.',
.opencode/skill/system-spec-kit/mcp_server/tests/causal-boost.vitest.ts:19:      last_accessed TEXT
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:53:    expect(plan.compaction?.hook).toBe('experimental.session.compacting');
.opencode/skill/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:9:const VALID_RECOVERY_STATUSES = ['no_results', 'low_confidence', 'partial'] as const;
.opencode/skill/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:134:  it('classifies weak result sets as low_confidence', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:163:    expect(envelope.data.recovery?.status).toBe('low_confidence');
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:3:description: "Multi-factor scoring system for memory retrieval with composite weighting, importance tiers, folder ranking and confidence tracking."
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:12:> Multi-factor scoring system for memory retrieval with composite weighting, importance tiers, folder ranking and confidence tracking.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:48:| **HVR Integration** | Human Validation Rate integration for confidence-weighted scoring (Spec 137) |
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:125:HVR integration extends the confidence tracking system by incorporating human validation signals into composite scoring. The HVR score reflects how often users confirm a memory as useful versus not useful, creating a feedback-weighted confidence metric.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:132:- Works alongside the existing promotion pipeline in `confidence-tracker.ts`
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:165: confidence-tracker.ts    # User validation and promotion
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:168: negative-feedback.ts     # Negative validation confidence multiplier with time-based recovery
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:181:| `confidence-tracker.ts` | Feedback loop: validation -> promotion |
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:184:| `negative-feedback.ts` | Negative validation confidence multiplier with 30-day half-life recovery; records negative feedback events and batch-loads stats for scoring pipeline |
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:201:  access_count: 5,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:236:  { spec_folder: 'z_archive/001-old', updated_at: '2024-06-01', importance_tier: 'deprecated' },
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:239:const ranked = computeFolderScores(memories, { includeArchived: false });
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:246:import { recordValidation, getConfidenceInfo } from './confidence-tracker';
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:253:// Returns: { confidence: 0.6, validationCount: 1, promotionEligible: false }
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:255:// After 5+ validations with confidence >= 0.9
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:260:> **Note on `validationCount`:** SQLite returns `validation_count` (snake_case column name).
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:261:> The code type-casts to include both `validationCount` and `validation_count` for safety,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:271:| Archive check | `isArchived('/z_archive/old')` | Deprioritize archived folders |
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:262:        access_count: 1000,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:277:        access_count: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:293:        access_count: 10,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:324:        access_count: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:343:        access_count: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:353:        access_count: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:372:        access_count: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:411:        access_count: 10,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:456:        access_count: null,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:488:        access_count: 1e10,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:532:          access_count: -100,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:539:          access_count: Number.NEGATIVE_INFINITY,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:599:          access_count: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:609:          access_count: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:628:          access_count: 100,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:638:          access_count: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:660:          access_count: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:670:          access_count: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:680:          access_count: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:699:          access_count: 10,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:761:        access_count: 10,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:943:        access_count: 1000,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:965:        access_count: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:983:        access_count: -50,
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:997:        { similarity: 50, access_count: 5 },
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:39:  contradicts:  0.8,  // Dampened — conflicting signals lower confidence
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:75:  last_accessed: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:854:    "UPDATE causal_edges SET last_accessed = datetime('now') WHERE id = ?"
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:863:      WHERE (last_accessed IS NULL AND extracted_at < datetime('now', '-' || ? || ' days'))
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:864:         OR (last_accessed IS NOT NULL AND last_accessed < datetime('now', '-' || ? || ' days'))
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:865:      ORDER BY COALESCE(last_accessed, extracted_at) ASC
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
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:43:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:286:    memoryTypeConfidence: typeInference.confidence,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:29:    access_count: 15,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:30:    last_accessed: 1706800000,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:37:    confidence: 0.95,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:77:    confidence: 0.95,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:78:    validationCount: 3,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:213:    expect(memory.confidence).toBe(0.95);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:214:    expect(memory.validationCount).toBe(3);
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:194:    includeArchived: false,
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:357:          is_archived: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:391:      is_archived: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:428:          is_archived: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:439:          is_archived: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:477:          is_archived: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:491:          is_archived: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:53:    hasArchivedColumn: columnSet.has('is_archived'),
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:62:    predicates.push(`COALESCE(${alias}.is_archived, 0) = 0`);
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:123:    includeArchived: false,
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:164:      is_archived INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:238:      const memory = { importance_tier: 'normal', access_count: 5 };
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:246:      const memory = { importance_tier: 'normal', access_count: 5 };
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:252:      const memory = { importance_tier: 'normal', access_count: 5 };
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:74:      includeArchived: false,
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:198:  it('T033-07: No last_accessed fallback — uncited memory scores 0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:200:    const score = calculateCitationScore({ last_accessed: Date.now() });
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:275:      access_count: 20,
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:294:      calculateFiveFactorScore({ access_count: 10000 }, {}),
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:314:      { id: 1, access_count: 0 },
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:315:      { id: 2, access_count: 10, lastReview: now.toISOString() },
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:322:    const results: BatchScoreInput[] = [{ id: 1, access_count: 5 }];
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:349:    const breakdown = getFiveFactorBreakdown({ access_count: 5 }, {});
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:355:    const breakdown = getFiveFactorBreakdown({ access_count: 5 }, {});
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:393:      access_count: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:414:        access_count: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:473:    const row = { title: 'authentication', similarity: 70, access_count: 5 };
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:482:    const recent = { lastCited: now.toISOString(), access_count: 5 };
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:483:    const old = { lastCited: oldDate.toISOString(), access_count: 5 };
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:494:      access_count: 10,
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:503:      access_count: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:803:  it('EDGE-COMP-02: Row with only access_count', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:804:    const score = calculateFiveFactorScore({ access_count: 10 }, {});
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:810:    const row = { access_count: 10 };
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:823:      access_count: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:838:      access_count: 100,
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:875:      { id: 1, access_count: 5, created_at: now.toISOString() },
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:876:      { id: 2, access_count: 5, created_at: now.toISOString() },
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:887:      results.push({ id: i, access_count: i % 20 });
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:910:    const breakdown = getFiveFactorBreakdown({ access_count: 5 }, {});
.opencode/skill/system-spec-kit/mcp_server/tests/five-factor-scoring.vitest.ts:918:    const breakdown = getFiveFactorBreakdown({ access_count: 5 }, {});
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:20:import * as archivalManager from '../lib/cognitive/archival-manager';
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:35:  last_accessed?: number;
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:36:  access_count?: number;
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:37:  confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:46:  archivalManager.__setEmbeddingsModuleForTests(null);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:76:      last_accessed INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:77:      access_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:78:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:79:      is_archived INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:80:      archived_at TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:105:    INSERT INTO memory_index (spec_folder, file_path, title, content_text, importance_tier, created_at, last_accessed, access_count, confidence, is_pinned, stability, half_life_days)
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:115:    data.last_accessed || 0,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:116:    data.access_count || 0,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:117:    data.confidence || 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:139:      expect(() => archivalManager.init(requireDb())).not.toThrow();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:142:    it('T059-002: is_archived column exists', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:145:      expect(columns.map(column => column.name)).toContain('is_archived');
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:149:      expect(archivalManager.ARCHIVAL_CONFIG).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:150:      expect(typeof archivalManager.ARCHIVAL_CONFIG.scanIntervalMs).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:154:      const config = archivalManager.ARCHIVAL_CONFIG;
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:166:      archivalManager.init(requireDb());
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:177:        access_count: 10,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:178:        confidence: 0.9,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:187:        access_count: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:188:        confidence: 0.2,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:193:      const candidates = archivalManager.getArchivalCandidates(100);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:206:        access_count: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:207:        confidence: 0.2,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:212:      const candidates = archivalManager.getArchivalCandidates(100);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:225:        access_count: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:226:        confidence: 0.1,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:230:      const candidates = archivalManager.getArchivalCandidates(100);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:243:        access_count: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:244:        confidence: 0.1,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:248:      const candidates = archivalManager.getArchivalCandidates(100);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:261:      archivalManager.init(requireDb());
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:268:    it('T059-010: archiveMemory returns true on success', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:279:      const archiveResult = archivalManager.archiveMemory(memory_id);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:280:      expect(archiveResult).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:283:    it('T059-011: is_archived flag set to 1', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:294:      archivalManager.archiveMemory(memory_id);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:295:      const row = requireDb().prepare('SELECT is_archived FROM memory_index WHERE id = ?').get(memory_id) as { is_archived: number };
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:296:      expect(row.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:299:    it('T059-012: unarchiveMemory succeeds', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:310:      archivalManager.archiveMemory(memory_id);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:311:      const unarchiveResult = archivalManager.unarchiveMemory(memory_id);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:312:      expect(unarchiveResult).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:314:      const row = requireDb().prepare('SELECT is_archived FROM memory_index WHERE id = ?').get(memory_id) as { is_archived: number };
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:315:      expect(row.is_archived).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:318:    it('T059-012c: archive and unarchive invalidate graph caches on success', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:329:      expect(archivalManager.archiveMemory(memory_id)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:330:      expect(archivalManager.unarchiveMemory(memory_id)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:336:    it('T059-013: Batch archive succeeds', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:350:      const batchResult = archivalManager.archiveBatch(idsToArchive);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:351:      expect(batchResult.archived).toBe(3);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:355:    it('T059-014: archiveMemory on already-archived returns false', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:366:      archivalManager.archiveMemory(memory_id);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:367:      const alreadyArchived = archivalManager.archiveMemory(memory_id);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:371:    it('T059-011b: archiveMemory removes vec_memories row but preserves memory_index archive state', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:392:      const archiveResult = archivalManager.archiveMemory(memory_id);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:393:      expect(archiveResult).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:395:      const archivedRow = requireDb()
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:396:        .prepare('SELECT is_archived FROM memory_index WHERE id = ?')
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:397:        .get(memory_id) as { is_archived: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:398:      expect(archivedRow).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:399:      expect(archivedRow?.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:407:    it('T059-012b: unarchiveMemory defers vector re-embedding to next index scan', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:413:        content_text: 'Rebuild vector content on unarchive',
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:425:      archivalManager.__setEmbeddingsModuleForTests({
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:432:      expect(archivalManager.archiveMemory(memory_id)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:434:      const archivedVector = requireDb()
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:437:      expect(archivedVector).toBeUndefined();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:439:      // Capture deferred-rebuild log emitted by syncVectorOnUnarchive
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:442:        expect(archivalManager.unarchiveMemory(memory_id)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:445:        const vectorAfterUnarchive = requireDb()
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:448:        expect(vectorAfterUnarchive).toBeUndefined();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:464:    it('T059-011c: archiveMemory suppresses vec_memories no-such-table cleanup errors', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:477:        const archiveResult = archivalManager.archiveMemory(memory_id);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:478:        expect(archiveResult).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:482:          return text.includes('Vector archive sync failed')
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:499:      archivalManager.init(requireDb());
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:500:      archivalManager.resetStats();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:507:    it('T059-015: Archival scan archives candidates', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:514:        access_count: 10,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:515:        confidence: 0.9,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:520:        access_count: 10,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:521:        confidence: 0.9,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:526:        access_count: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:527:        confidence: 0.2,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:534:        access_count: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:535:        confidence: 0.1,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:540:      const scanResult = archivalManager.runArchivalScan();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:541:      expect(scanResult.archived).toBeGreaterThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:551:        access_count: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:552:        confidence: 0.2,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:557:      const scanResult = archivalManager.runArchivalScan();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:568:        access_count: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:569:        confidence: 0.2,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:574:      const scanResult = archivalManager.runArchivalScan();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:575:      const scan2Result = archivalManager.runArchivalScan();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:576:      expect(scan2Result.archived).toBeLessThanOrEqual(scanResult.archived);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:586:      archivalManager.init(requireDb());
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:590:      archivalManager.stopBackgroundJob();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:595:      expect(() => archivalManager.startBackgroundJob(60000)).not.toThrow();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:599:      archivalManager.startBackgroundJob(60000);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:600:      expect(archivalManager.isBackgroundJobRunning()).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:604:      archivalManager.startBackgroundJob(60000);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:605:      expect(() => archivalManager.stopBackgroundJob()).not.toThrow();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:609:      archivalManager.startBackgroundJob(60000);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:610:      archivalManager.stopBackgroundJob();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:611:      expect(archivalManager.isBackgroundJobRunning()).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:621:      archivalManager.init(requireDb());
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:622:      archivalManager.resetStats();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:637:          access_count: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:638:          confidence: 0.1,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:645:      archivalManager.runArchivalScan();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:646:      const stats = archivalManager.getStats();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:658:          access_count: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:659:          confidence: 0.1,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:666:      archivalManager.runArchivalScan();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:667:      const stats = archivalManager.getStats();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:678:        access_count: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:679:        confidence: 0.1,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:684:      archivalManager.runArchivalScan();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:685:      const stats = archivalManager.getStats();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:690:      archivalManager.runArchivalScan();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:691:      const stats = archivalManager.getStats();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:702:      archivalManager.init(requireDb());
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:717:      const recentStatus = archivalManager.checkMemoryArchivalStatus(recentId);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:730:      const recentStatus = archivalManager.checkMemoryArchivalStatus(recentId);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:735:      const missingStatus = archivalManager.checkMemoryArchivalStatus(99999);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:751:      archivalManager.init(requireDb());
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:752:      archivalManager.startBackgroundJob(60000);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:753:      archivalManager.cleanup();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:754:      expect(archivalManager.isBackgroundJobRunning()).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:759:      archivalManager.init(requireDb());
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:760:      archivalManager.resetStats();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:761:      const stats = archivalManager.getStats();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:769:      archivalManager.init(requireDb());
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:770:      archivalManager.cleanup();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:771:      const candidates = archivalManager.getArchivalCandidates();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:776:    it('T059-032: archiveMemory returns false without db', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:778:      archivalManager.init(requireDb());
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:779:      archivalManager.cleanup();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:780:      const result = archivalManager.archiveMemory(1);
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
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:90:      access_count: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:100:      access_count: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:132:      access_count: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:230:        access_count: 20,
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:240:        access_count: 20,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:15:type MutationType = 'create' | 'update' | 'delete' | 'merge' | 'archive' | 'restore' | 'reindex';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:93:    mutation_type TEXT NOT NULL CHECK(mutation_type IN ('create','update','delete','merge','archive','restore','reindex')),
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:62:      last_accessed TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:302:    db.prepare("UPDATE causal_edges SET last_accessed = datetime('now') WHERE id = ?").run(edgeId);
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:318:    db.prepare("UPDATE causal_edges SET last_accessed = datetime('now') WHERE id = ?").run(edgeId);
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:332:    db.prepare("UPDATE causal_edges SET last_accessed = datetime('now') WHERE id = ?").run(edgeId);
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:346:    // Set last_accessed to 31 days ago
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:347:    db.prepare("UPDATE causal_edges SET last_accessed = datetime('now', '-31 days') WHERE id = ?").run(edgeId);
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:362:    db.prepare("UPDATE causal_edges SET last_accessed = datetime('now') WHERE id = ?").run(edgeId);
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:376:      INSERT INTO causal_edges (source_id, target_id, relation, strength, created_by, last_accessed)
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:397:    // Set extracted_at to 91 days ago (no last_accessed)
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:409:    db.prepare("UPDATE causal_edges SET last_accessed = datetime('now') WHERE source_id = '1'").run();
.opencode/skill/system-spec-kit/mcp_server/tests/query-router.vitest.ts:287:    expect(typeof result.classification.confidence).toBe('string');
.opencode/skill/system-spec-kit/mcp_server/tests/query-router.vitest.ts:329:    expect(result.classification.confidence).toBe('fallback');
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:17:// Feature catalog: Negative feedback confidence signal
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:272: * Parse last_accessed value that may be:
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:392:  // Never fall back to last_accessed or updated_at — those conflate
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:614:  const usageScore = calculateUsageScore(row.access_count || 0);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:668:  const popularityScore = calculatePopularityScore(row.access_count || 0, parseLastAccessed(row.last_accessed), row.created_at || null);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:711:      usage: calculateUsageScore(row.access_count || 0),
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:752:        popularity: calculatePopularityScore(row.access_count || 0, parseLastAccessed(row.last_accessed), row.created_at || null),
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:784:  const usage = calculateUsageScore(row.access_count || 0);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:832:  const popularity = calculatePopularityScore(row.access_count || 0, parseLastAccessed(row.last_accessed), row.created_at || null);
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
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:374:            is_archived INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:391:            last_accessed TEXT,
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
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:231:      confidenceImpact: 0.3,
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:239:    expect(contract.confidenceImpact).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:240:    expect(contract.confidenceImpact).toBeLessThanOrEqual(1.0);
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:247:      confidenceImpact: 1.0,
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:251:    expect(totalFailure.confidenceImpact).toBe(1.0);
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
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:71:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:139:    confidence REAL NOT NULL DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:329: * relevance grades (0-3) and confidence (0-1). This provides an
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:356:          confidence: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:375:      const confidenceBase = 0.2 + (overlap * 0.7) + (phraseMatch ? 0.1 : 0);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:376:      const confidence = Math.round(clamp01(confidenceBase) * 1000) / 1000;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:382:        confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:405:        (query_id, memory_id, relevance, confidence, reasoning)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:416:          label.confidence,
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts:170:          confidence: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-indexer.vitest.ts:175:          confidence: 0.8,
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:142:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:148:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:154:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:160:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:166:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:172:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:178:    expect(result.confidence).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts:190:    expect(result.confidence).toBe(0.3); // Low confidence from folder hint
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:3:// Feedback confidence signal (T002b/A4).
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:90:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:97:      is_archived INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:122:  validationCount?: number;
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:123:  confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:130:    validationCount = 0,
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:131:    confidence = 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:135:    INSERT INTO memory_index (id, title, trigger_phrases, created_at, importance_tier, validation_count, confidence)
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:137:  `).run(id, title, JSON.stringify(triggerPhrases), createdAt, tier, validationCount, confidence);
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:727:    insertMemory(testDb, 1, { tier: 'normal', validationCount: 5 });
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:735:    insertMemory(testDb, 1, { tier: 'important', validationCount: 10 });
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:743:    insertMemory(testDb, 1, { tier: 'normal', validationCount: 3 });
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:751:    insertMemory(testDb, 1, { tier: 'important', validationCount: 7 });
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:758:    insertMemory(testDb, 1, { tier: 'critical', validationCount: 20 });
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:765:    insertMemory(testDb, 1, { tier: 'constitutional', validationCount: 100 });
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:772:    insertMemory(testDb, 1, { tier: 'normal', validationCount: 5 });
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:781:    insertMemory(testDb, 1, { tier: 'normal', validationCount: 2 });
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:790:    insertMemory(testDb, 1, { tier: 'critical', validationCount: 0 });
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:799:    insertMemory(testDb, 1, { tier: 'normal', validationCount: 5 });
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:800:    insertMemory(testDb, 2, { tier: 'normal', validationCount: 2 });
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:801:    insertMemory(testDb, 3, { tier: 'important', validationCount: 10 });
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:814:    insertMemory(testDb, 1, { tier: 'normal', validationCount: 5 });
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:815:    insertMemory(testDb, 2, { tier: 'normal', validationCount: 5 });
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:816:    insertMemory(testDb, 3, { tier: 'normal', validationCount: 5 });
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:817:    insertMemory(testDb, 4, { tier: 'normal', validationCount: 5 });
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:855:    insertMemory(testDb, 5, { tier: 'normal', validationCount: 5 });
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:27:        memory_validate: 1000,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:36:  retentionPolicy?: RetentionPolicy;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:37:  deleteAfter?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:53:  retentionPolicy: RetentionPolicy;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:54:  deleteAfter: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:207:    || input.retentionPolicy === 'ephemeral'
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:208:    || input.retentionPolicy === 'shared'
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:209:    || typeof input.deleteAfter === 'string';
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:222:  const deleteAfter = normalizeIsoTimestamp(input.deleteAfter) ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:223:  const retentionPolicy: RetentionPolicy = input.retentionPolicy === 'ephemeral' || input.retentionPolicy === 'shared'
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:224:    ? input.retentionPolicy
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:243:        retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:244:        deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:255:  if (deleteAfter && new Date(deleteAfter).getTime() <= new Date(governedAt).getTime()) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:256:    issues.push('deleteAfter must be later than governedAt');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:258:  // H21 FIX: Require valid future deleteAfter for ephemeral retention policy
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:260:  if (retentionPolicy === 'ephemeral' && !deleteAfter) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:261:    issues.push('deleteAfter is required for ephemeral retention policy');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:277:      retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:278:      deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:299:    retention_policy: decision.normalized.retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:300:    delete_after: decision.normalized.deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:310:      retentionPolicy: decision.normalized.retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:311:      deleteAfter: decision.normalized.deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:167:    expect(contract.confidence_impact).toBe(0.8);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:172:  it('createDegradedContract clamps confidence_impact to [0, 1]', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:174:    expect(overContract.confidence_impact).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:177:    expect(underContract.confidence_impact).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:180:    expect(nanContract.confidence_impact).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:183:    expect(infContract.confidence_impact).toBe(0);
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
.opencode/skill/system-spec-kit/mcp_server/tests/phase2-integration.vitest.ts:41:        last_accessed TEXT
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:170:      'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:295:      'memory_validate', 'memory_save', 'memory_index_scan', 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:404:      '../lib/cognitive/archival-manager',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:707:      vi.doMock('../lib/cognitive/archival-manager', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1963:    // T44: Shutdown stops archival manager
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1964:    it('T44: Shutdown stops archival manager', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1965:      expect(sourceCode).toMatch(/archivalManager\.cleanup\(\)/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2093:      'memory_validate': '[L4:Mutation]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2257:      { module: './lib/cognitive/archival-manager.js', name: 'Archival manager' },
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:70:      last_accessed TEXT
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:80:      "expectedResultDescription": "Should surface memories about SPECKIT_WORKING_MEMORY, SPECKIT_EVENT_DECAY, working-memory.ts, and archival-manager.ts. The relationship is that event decay reduces attention scores over time.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:630:      "expectedResultDescription": "Should surface importance-tiers.ts, tier-classifier.ts, archival-manager.ts, and any spec memories about the 5-tier state machine.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:705:      "query": "I want to understand how the memory system decides when to archive a memory",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:710:      "expectedResultDescription": "Should surface archival-manager.ts, tier-classifier.ts, and any spec about the archival lifecycle conditions.",
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:76:      access_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:77:      last_accessed INTEGER,
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:100:      includeArchived: false,
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:230:      INSERT INTO memory_index (id, stability, difficulty, review_count, access_count, last_review, created_at)
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:260:      INSERT INTO memory_index (id, stability, difficulty, review_count, access_count, last_review, created_at)
.opencode/skill/system-spec-kit/mcp_server/tests/edge-density.vitest.ts:32:      last_accessed TEXT
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:15:  { tool: 'memory_validate', handler: 'handleMemoryValidate', layer: 'L4' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:41:  { camel: 'handleMemoryValidate', snake: 'handle_memory_validate' },
.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts:68:      last_accessed TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:228:    includeArchived: false,
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:38:    // Create causal_edges table matching production schema (+created_by, +last_accessed)
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:51:        last_accessed TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:109:          access_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:110:          last_accessed INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:119:          confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:290:/** Result of bootstrap confidence interval computation. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/bm25-baseline.ts:312: * Compute bootstrap 95% confidence interval for MRR@5.
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:20:  access_count: number;
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:21:  last_accessed: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:40:      access_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:41:      last_accessed TEXT DEFAULT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:84:      const row = requireTestDb().prepare('SELECT access_count, last_accessed FROM memory_index WHERE id = 1').get() as AccessRow;
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:86:      expect(row.access_count).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:87:      expect(row.last_accessed).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:90:    it('flushAccessCounts increments access_count cumulatively', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:97:      const row = requireTestDb().prepare('SELECT access_count FROM memory_index WHERE id = 1').get() as Pick<AccessRow, 'access_count'>;
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:98:      expect(row.access_count).toBe(3);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:240:      const row = requireTestDb().prepare('SELECT access_count FROM memory_index WHERE id = 2').get() as Pick<AccessRow, 'access_count'>;
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:241:      expect(row.access_count).toBeGreaterThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:278:      const firstDbRow = firstDb.prepare('SELECT access_count FROM memory_index WHERE id = 2').get() as Pick<AccessRow, 'access_count'>;
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:279:      const secondDbRow = secondDb.prepare('SELECT access_count FROM memory_index WHERE id = 2').get() as Pick<AccessRow, 'access_count'>;
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:282:      expect(firstDbRow.access_count).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:283:      expect(secondDbRow.access_count).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:324:        'SELECT id, access_count FROM memory_index WHERE id IN (1, 2) ORDER BY id'
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:325:      ).all() as Array<{ id: number; access_count: number }>;
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:331:        { id: 1, access_count: 1 },
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:332:        { id: 2, access_count: 1 },
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:399:  describe('Composite scoring + archival integration', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:446:        { includeArchived: true }
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:457:    it('Archival paths are deprioritized by archive multipliers', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:461:          { id: 201, spec_folder: 'specs/z_archive/legacy', updated_at: nowIso, created_at: nowIso, importance_tier: 'critical' },
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:464:        { includeArchived: true }
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:467:      const archivedFolder = folderScores.find(folder => folder.folder === 'specs/z_archive/legacy');
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:470:      expect(archivedFolder).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:472:      expect(archivedFolder?.score ?? 1).toBeLessThan(activeFolder?.score ?? 0);
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:77:    tools: ['memory_update', 'memory_delete', 'memory_validate', 'memory_bulk_delete']
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:117:      const archiveTests = [
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:118:        { path: 'specs/z_archive/old-project', expected: true },
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:127:      for (const { path: p, expected } of archiveTests) {
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:133:      const archiveMultiplier = mod.getArchiveMultiplier('specs/z_archive/old');
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:136:      expect(archiveMultiplier).toBeLessThan(1.0);
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:142:        createMemory({ specFolder: 'z_archive/old', spec_folder: 'z_archive/old' }),
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:146:      const withArchived = mod.computeFolderScores(memories, { includeArchived: true });
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:58:        confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:7:import * as mod from '../lib/scoring/confidence-tracker';
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:12:} from '../lib/scoring/confidence-tracker';
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:30:    confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:54:    'INSERT INTO memory_index (id, title, confidence, validation_count, importance_tier) VALUES (?, ?, ?, ?, ?)'
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:115:    it('T510-02a: Positive validation increases confidence', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:119:      expect(result.confidence).toBeGreaterThan(before);
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:126:      expect(result.validationCount).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:141:    it('T510-03a: Negative validation decreases confidence', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:145:      expect(result.confidence).toBeLessThan(before);
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:184:      // Memory 5 has confidence=0.88, validation_count=4
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:185:      // Promotion requires confidence >= 0.9 AND validation_count >= 5
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:208:      expect(typeof info.confidence).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:209:      expect(typeof info.validationCount).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:220:// Verifies all 7 DB operations in confidence-tracker survive
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts:239:          confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:225:    // T-TC-15: Constitutional with extra fields still never archives
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:226:    it('T-TC-15: Constitutional never archives (with extras)', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:184:    const confidence = detection.type === 'query_reformulated' ? 'medium' : 'weak';
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:190:        confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:220:      confidence: 'strong',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:253:      confidence: 'strong',
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-config-extended.vitest.ts:65:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-edges.vitest.ts:245:    it('should add access_count column to memory_index', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-edges.vitest.ts:250:      const row = db.prepare(`SELECT access_count FROM memory_index WHERE spec_folder = 'test'`).get() as { access_count: number | null };
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-edges.vitest.ts:251:      expect(row.access_count).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:2:// Converted from: t206-search-archival.test.ts (custom runner)
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:24:describe('T206 - vector_search accepts includeArchived [deferred - DB dependency]', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:29:  it('T206-VS2: vectorSearch accepts includeArchived option', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:30:    expect(VECTOR_INDEX_QUERIES_SOURCE).toMatch(/export function vector_search\([\s\S]*?includeArchived = false/);
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:34:describe('T206 - multi_concept_search accepts includeArchived [deferred - DB dependency]', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:39:  it('T206-MC2: multiConceptSearch accepts includeArchived', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:40:    expect(VECTOR_INDEX_QUERIES_SOURCE).toMatch(/export function multi_concept_search\([\s\S]*?includeArchived = false/);
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:44:describe('T206 - keyword_search accepts includeArchived [deferred - DB dependency]', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:49:  it('T206-KW2: keywordSearch accepts includeArchived', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:50:    expect(VECTOR_INDEX_QUERIES_SOURCE).toMatch(/export function keyword_search\([\s\S]*?includeArchived = false/);
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:54:describe('T206 - getConstitutionalMemories accepts includeArchived [deferred - DB dependency]', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:59:  it('T206-CM2: getConstitutionalMemories accepts includeArchived', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:60:    expect(VECTOR_INDEX_QUERIES_SOURCE).toMatch(/export function get_constitutional_memories_public\([\s\S]*?includeArchived = false/);
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:69:describe('T206 - Source code contains is_archived filter', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:70:  it('T206-SRC1: vector-index-queries.ts has is_archived filters (>= 3)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:71:    const vsFilterCount = (VECTOR_INDEX_QUERIES_SOURCE.match(/is_archived IS NULL OR.*is_archived\s*=\s*0/g) || []).length;
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:75:  it('T206-SRC2: multi_concept_search uses archival_filter', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:76:    expect(VECTOR_INDEX_QUERIES_SOURCE).toContain('archival_filter');
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:77:    expect(VECTOR_INDEX_QUERIES_SOURCE).toContain('${archival_filter}');
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:80:  it('T206-SRC3: hybrid-search has is_archived filter in ftsSearch', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:94:    expect(hsSource).toContain('is_archived');
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:97:  it('T206-SRC4: HybridSearchOptions has includeArchived', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:102:    expect(hsTs).toContain('includeArchived');
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:105:  it('T206-SRC5: memory-search handler references includeArchived', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:110:    expect(handlerSource).toContain('includeArchived');
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:111:    const count = (handlerSource.match(/includeArchived/g) || []).length;
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:116:    expect(VECTOR_INDEX_QUERIES_SOURCE).toContain('is_archived IS NULL OR is_archived = 0');
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:53:      expect(result.confidence).toBe(0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:66:      expect(result.confidence).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:67:      expect(result.confidence).toBeLessThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:73:    it('confidence never exceeds 0.95', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:77:      expect(result.confidence).toBeLessThanOrEqual(0.95);
.opencode/skill/system-spec-kit/mcp_server/tests/query-intent-classifier.vitest.ts:85:      expect(result.confidence).toBe(0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:118:    parts.push(`> **⚠️ EVIDENCE GAP DETECTED:** Low confidence (Z=${trm.zScore.toFixed(2)})\n`);
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:73:    includeArchived: false,
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
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:6:// feedback-ledger.ts), computes confidence-weighted signal scores
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:46:/** Per-confidence-tier weights used in the weighted score formula. */
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:178: * Groups events by memoryId, counts confidence tiers, and computes
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:179: * a confidence-weighted score.  Does NOT apply min-support filtering
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:215:      entry[ev.confidence]++;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:86:  classifyIntent: vi.fn(() => ({ intent: 'understand', confidence: 0.9, fallback: false })),
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:97:        confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1027:          typeof parsed.data?.confidence === 'number' ||
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1049:        expect(typeof parsed.data?.confidence === 'number').toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:83:| Search and ranking | `hybrid-search.vitest.ts`, `bm25-index.vitest.ts`, `query-router.vitest.ts`, `dynamic-token-budget.vitest.ts`, `result-confidence-scoring.vitest.ts` | Retrieval, ranking, and profile/trace behavior |
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:146:Broader confidence runs:
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:30:        is_archived INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:49:      INSERT INTO memory_index (id, title, trigger_phrases, content_text, file_path, spec_folder, is_archived)
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:54:        (4, 'Archived Memory', 'old data', 'This memory is archived', '/specs/old.md', 'old-spec', 1);
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:114:  it('T6: archived memories excluded by default', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:115:    const results = fts5Bm25Search(db, 'archived');
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:120:  it('T6b: archived memories included when requested', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:121:    const results = fts5Bm25Search(db, 'archived', { includeArchived: true });
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:194:        is_archived INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:13:import { computeResultConfidence } from '../lib/search/confidence-scoring.js';
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:78:  it('keeps ranking confidence separate from structural trust axes', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:96:    expect(firstConfidence?.confidence.value).toBeTypeOf('number');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:97:    expect(firstConfidence?.confidence).not.toHaveProperty('structuralTrust');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:98:    expect(firstConfidence?.confidence).not.toHaveProperty('parserProvenance');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:99:    expect(firstConfidence?.confidence).not.toHaveProperty('evidenceStatus');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:100:    expect(firstConfidence?.confidence).not.toHaveProperty('freshnessAuthority');
.opencode/skill/system-spec-kit/mcp_server/tests/causal-fixes.vitest.ts:34:        last_accessed TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-scoring-integration.vitest.ts:188:      access_count: 50,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:626:    it('sets confidence to 0.85', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:651:    it('increments access_count and updates last_accessed', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:653:      const initialCount = before?.access_count || 0;
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:659:      expect(after?.access_count).toBe(initialCount + 1);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:660:      expect(after?.last_accessed).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:721:        { similarity: 80, created_at: oldDate, access_count: 1, specFolder: 'a' },
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:722:        { similarity: 70, created_at: now, access_count: 10, specFolder: 'b' },
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:930:    it('returns entries sorted by access_count', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:931:      const stats = mod.getUsageStats({ sortBy: 'access_count', order: 'DESC', limit: 10 });
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1475:      expect(typeof resolvedPreview.confidence).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:58:      last_accessed TEXT
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/indexer-types.ts:25:  confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:12:  access_count: number;
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:34:        access_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:35:        last_accessed INTEGER DEFAULT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:91:      const row = requireDb().prepare('SELECT access_count FROM memory_index WHERE id = 2').get() as AccessCountRow;
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:92:      expect(row.access_count).toBeGreaterThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:115:            confidence: 0.8,
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:139:      confidence: 0.8,
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:145:    expect(parsed.data).not.toHaveProperty('confidence');
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts:54:  access_count: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts:491:      { ...BASE_ROW, access_count: 100, similarity: 99 },
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
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-stats-edge.vitest.ts:109:  it('T007a-S4: includeArchived=true can surface archived folders in count mode', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-stats-edge.vitest.ts:112:      `specs/z_archive/${runId}-archived`,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-stats-edge.vitest.ts:116:    const result = await handler.handleMemoryStats({ folderRanking: 'count', includeArchived: true, limit: 100 });
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-stats-edge.vitest.ts:118:    expect(parsed.data.topFolders.some((folder: { folder: string }) => folder.folder.includes(`${runId}-archived`))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-folder-scoring-types.vitest.ts:40:    access_count: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-folder-scoring-types.vitest.ts:146:    it('T-FS-11: archive folder scoring works', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/unit-folder-scoring-types.vitest.ts:148:      const score = computeSingleFolderScore('z_archive/old-stuff', memories);
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:178:      decision_meta: { confidence: 0.95, strategy: 'dedup' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:31:        confidence: 0.92,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:43:          { intent: 'find_spec', confidence: 0.92, score: 0.92 },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:44:          { intent: 'find_decision', confidence: 0.44, score: 0.44 },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:45:          { intent: 'understand', confidence: 0.18, score: 0.18 },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:402:            confidence: 0.8, validation_count: 2, access_count: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:415:    vi.mocked(folderScoringSourceMod.isArchived).mockImplementation((folder: string) => folder.includes('z_archive'));
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1088:        { spec_folder: 'specs/z_archive/old', count: 3 },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1091:    const result = await handler.handleMemoryStats({ folderRanking: 'count', includeArchived: false });
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1093:    const hasArchived = parsed?.data?.topFolders?.some((f: any) => (f.folder || '').includes('z_archive'));
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:94:     Returns: { detected: boolean, type: string|null, description: string|null, confidence: number }
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:168:      expect(typeof r.confidence).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:169:      expect(r.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:172:    it('T125: Result has {detected, type, description, confidence}', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:177:      expect(r).toHaveProperty('confidence');
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:356:      const contradiction = { detected: false, type: null, description: null, confidence: 0 };
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:374:      const contradiction = { detected: false, type: null, description: null, confidence: 0 };
.opencode/skill/system-spec-kit/mcp_server/tests/prediction-error-gate.vitest.ts:395:      const contradiction = { detected: false, type: null, description: null, confidence: 0 };
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:66:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:74:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:80:    expect(result.confidence).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:316:    expect(r1.confidence).toBe(r2.confidence);
.opencode/skill/system-spec-kit/mcp_server/tests/evidence-gap-detector.vitest.ts:2:// Transparent Reasoning Module: Z-score confidence check on RRF
.opencode/skill/system-spec-kit/mcp_server/tests/evidence-gap-detector.vitest.ts:3:// Scores to detect low-confidence retrieval and inject warnings.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:71:      confidence: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:88:      confidence: 0.8,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:105:  it('includes deep-mode and archival/quality/state-limit controls in cache args', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:116:      includeArchived: true,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:133:    expect(args.includeArchived).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:149:      includeArchived: false,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:242:| `confidence` | `number` | Clamped transition confidence in the range `[0, 1]` |
.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:74:      last_accessed TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:87:    tool: 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:85:    expect(parsed.data).not.toHaveProperty('confidence');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:15:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:115: * Returns intent + confidence score. Hybrid intent means
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:120:    return { intent: 'hybrid', confidence: 0.5, structuralScore: 0, semanticScore: 0, matchedKeywords: [] };
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:138:    return { intent: 'hybrid', confidence: 0.5, structuralScore: 0, semanticScore: 0, matchedKeywords };
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:154:      confidence: computeConfidence(structuralRatio),
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:165:      confidence: computeConfidence(semanticRatio),
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:172:  // Ambiguous → hybrid with moderate confidence
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:175:    confidence: 0.5 + Math.abs(structuralRatio - semanticRatio) * 0.3,
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:159:      is_archived INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:45:        confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:326:    confidence: Math.max(0, Math.min(1, transition.confidence)),
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:708:      confidence: Math.max(0, Math.min(1, t.transitionDiagnostics.confidence)),
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts:348:        trigger_phrases: JSON.stringify([`background${index + 1} archive${index + 1}`]),
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts:30:} from '../lib/search/confidence-truncation';
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts:97:  it('T001-04: confidence is a valid label (high, medium, low, or fallback)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts:100:    expect(validLabels).toContain(result.confidence);
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts:107:    expect(result.confidence).toBe('fallback');
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-query-intelligence.vitest.ts:113:    expect(result.confidence).toBe('fallback');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:315:      confidence: 0.85,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:338:    expect(resumed.confidence).toBe(0.95);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:354:    expect(explicit.confidence).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:640:          confidence: 1,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:269:        confidence: 0.9,
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:126:        memory_validate: 'L4',
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:93:  it('clears folder-scoped constitutional cache entries for archived and non-archived keys', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:128:      db.prepare('UPDATE memory_index SET is_archived = 1 WHERE id = ?').run(4001);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:57:        confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:269:    it('T643: access_count column exists', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:270:      expect(VECTOR_INDEX_SCHEMA_SOURCE).toContain('access_count INTEGER DEFAULT 0');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:273:    it('T644: last_accessed column exists', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:274:      expect(VECTOR_INDEX_SCHEMA_SOURCE).toContain('last_accessed INTEGER DEFAULT 0');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:298:    it('T650: last_accessed stores epoch timestamp', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:300:      expect(ACCESS_TRACKER_SOURCE).toContain('last_accessed = ?');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:305:    it('updates stability, review_count, access_count, and last_accessed together', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:308:      expect(STAGE2_SOURCE).toContain('access_count = access_count + 1');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:309:      expect(STAGE2_SOURCE).toContain('last_accessed = ?');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:336:      expect(ACCESS_TRACKER_SOURCE).toContain('SET access_count = access_count + 1');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:55:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:89:      last_accessed TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:148:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:440:          embedding_status TEXT DEFAULT 'success', confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-limit.vitest.ts:37:        confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-composite-scoring-types.vitest.ts:103:        { id: 2, importance_tier: 'normal', access_count: 5 },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-composite-scoring-types.vitest.ts:136:          access_count: 10,
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:45:      last_accessed TEXT
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
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:37:      confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:488:      confidence: 0.85,
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:497:      confidence: 0.85,
.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:87:| `usage-tracking.ts` | Adds `access_count` column to `memory_index`, provides `incrementAccessCount()` and `getAccessCount()` | `SPECKIT_USAGE_RANKING` |
.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:114:| `ensureUsageColumn` | usage-tracking.ts | Adds access_count column to memory_index |
.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:142:| `memory_index` | usage-tracking.ts, community-detection.ts | access_count column, stale assignment cleanup |
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:74:} from '../lib/search/confidence-truncation';
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:117:    access_count: 3,
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:169:      expect(intent.confidence).toBeGreaterThanOrEqual(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:405:        access_count: 100,
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:419:        access_count: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:468:      expect(emptyIntent.confidence).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:625:      // Step 7: Truncate by confidence
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
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:307:    INSERT INTO causal_edges (id, source_id, target_id, relation, strength, evidence, created_by, last_accessed)
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:79:        last_accessed TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:900:    it('T001: touchEdgeAccess updates last_accessed timestamp on read', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:903:      // Before read, last_accessed should be null
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:904:      const before = (testDb.prepare('SELECT last_accessed FROM causal_edges WHERE id = ?').get(edgeId) as { last_accessed: string | null });
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:905:      expect(before.last_accessed).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:910:      const after = (testDb.prepare('SELECT last_accessed FROM causal_edges WHERE id = ?').get(edgeId) as { last_accessed: string | null });
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:911:      expect(after.last_accessed).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:950:        if (sql.includes("UPDATE causal_edges SET last_accessed = datetime('now') WHERE id = ?")) {
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:530:    caveat = 'Forecast is low-confidence until at least one file has been processed.';
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:537:        caveat = 'Forecast is low-confidence because queue history is still sparse or noisy.';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:83:  classifyIntent: vi.fn(() => ({ intent: 'understand', confidence: 0.9, fallback: false })),
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:59:      is_archived INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:310:  it('T045-17b: quality degradation uses absolute+relative confidence checks', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/graph/usage-tracking.ts:17: * Add access_count column to memory_index if not present.
.opencode/skill/system-spec-kit/mcp_server/lib/graph/usage-tracking.ts:26:    db.exec(`ALTER TABLE memory_index ADD COLUMN access_count INTEGER DEFAULT 0`);
.opencode/skill/system-spec-kit/mcp_server/lib/graph/usage-tracking.ts:51:      UPDATE memory_index SET access_count = COALESCE(access_count, 0) + 1 WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/graph/usage-tracking.ts:71:      SELECT COALESCE(access_count, 0) AS access_count FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/graph/usage-tracking.ts:72:    `) as Database.Statement).get(memoryId) as { access_count: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/graph/usage-tracking.ts:73:    return row?.access_count ?? 0;
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:90:- Purpose: Owns the memory-science side of the system: decay, retrievability, working memory, co-activation, pressure monitoring, archival movement, and adaptive ranking inputs. It is the main "how memory behaves over time" module family.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:96:  - `archival-manager.ts` — lifecycle transitions between active and archived memory states.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:297:- Purpose: Owns ranking and calibration logic once candidate memories already exist. It combines importance tiers, composite scoring, folder relevance, confidence signals, and negative-feedback effects.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:302:  - `confidence-tracker.ts` — confidence-related normalization helpers.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:303:  - `negative-feedback.ts` — post-feedback confidence penalties.
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:43:| Cognitive Features | 10+ | FSRS scheduler, attention decay, PE gating, working memory, tier classification, co-activation, temporal contiguity, archival manager, causal graph, corrections |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:65:| **Confidence Truncation** | Removes low-confidence tail results using 2x median gap detection |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:155:│   ├── confidence-truncation.ts # Confidence truncation (2x median gap, min 3 results)
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:157:│   ├── evidence-gap-detector.ts # TRM with Z-score confidence
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:168:│   ├── confidence-tracker.ts   # Confidence tracking
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:179:│   ├── archival-manager.ts     # 5-state archival model
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:329:| `cognitive/archival-manager.ts` | 5-state archival model |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:339:| `search/confidence-truncation.ts` | Low-confidence tail removal (2x median gap) |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:394:// ARCHIVED (R < 0.02)  - Effectively forgotten, time-based archival
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:6:import * as archival from '../lib/cognitive/archival-manager';
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:22:/** Create in-memory DB with memory_index schema for archival-manager */
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:35:      last_accessed INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:36:      access_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:37:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:38:      is_archived INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:39:      archived_at TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:278:    archival.init(db);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:279:    archival.ensureArchivedColumn();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:280:    archival.ensureArchivedColumn();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:282:    expect(columns).toContain('is_archived');
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:283:    archival.cleanup();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:287:  it('E-02: adds is_archived column when missing', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:296:    expect(colsBefore).not.toContain('is_archived');
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:298:    archival.init(db);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:300:    expect(colsAfter).toContain('is_archived');
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:301:    archival.cleanup();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:306:    archival.cleanup();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:307:    expect(() => archival.ensureArchivedColumn()).not.toThrow();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:318:    archival.init(db);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:319:    archival.resetStats();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:320:    const errors = archival.getRecentErrors();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:323:    archival.cleanup();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:329:    archival.init(db);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:330:    archival.resetStats();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:331:    const errors = archival.getRecentErrors();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:333:    archival.cleanup();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:339:    archival.init(db);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:340:    archival.resetStats();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:341:    const errors = archival.getRecentErrors();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:343:    archival.cleanup();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:349:    archival.init(db);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:350:    archival.resetStats();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:351:    const errors = archival.getRecentErrors(5);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:353:    archival.cleanup();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:359:    archival.init(db);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:360:    archival.resetStats();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:361:    const errors = archival.getRecentErrors();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:363:    archival.cleanup();
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:674:  it('T312: syncChangedRows removes archived or missing documents incrementally', () => {
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
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:41:          hook: 'experimental.session.compacting',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:168:    await hooks['experimental.session.compacting']?.({ sessionID: 's3' }, output);
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:169:    await hooks['experimental.session.compacting']?.({ sessionID: 's3' }, output);
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:186:    await hooks['experimental.session.compacting']?.({ sessionID: 's3' }, { context: [] });
.opencode/skill/system-spec-kit/mcp_server/lib/graph/usage-ranking-signal.ts:5:// Computes a small log-scale score bonus from access_count so
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:35:        access_count: null,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:36:        last_accessed: null,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:43:        confidence: null,
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-scoring-calibration.vitest.ts:64:    access_count: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:133:          confidence: 0.85,
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:172:      confidence: 0.85,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:42:} from './confidence-truncation.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:66:import type { TruncationResult } from './confidence-truncation.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:83:  includeArchived?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:87:   * When true, preserve the requested top-K window by bypassing confidence
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:165:    confidence: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:447: * @param options - Optional limit, specFolder filter, and includeArchived flag.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:452:  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:459:  const { limit = DEFAULT_LIMIT, specFolder, includeArchived = false } = options;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:465:    // Filters: is_archived exclusion and spec_folder matching handled by fts5Bm25Search
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:466:    const bm25Results = fts5Bm25Search(db, query, { limit, specFolder, includeArchived });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:486: * @param options - Optional limit, specFolder filter, and includeArchived flag.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:491:  options: { limit?: number; specFolder?: string; includeArchived?: boolean } = {}
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:866:    includeArchived = false,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:879:        includeArchived,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:897:    const ftsResults = ftsSearch(query, { limit, specFolder, includeArchived });
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1030:        confidence: routeResult.classification.confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1069:          includeArchived: options.includeArchived || false,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1532:  // candidates before low-confidence tails are trimmed.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1555:      console.warn('[hybrid-search] confidence truncation failed:', err instanceof Error ? err.message : String(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1579:          // Wire confidence truncation metadata into per-result trace (036)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1581:            confidenceTruncation: {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1808:    // H13 FIX: Exclude archived rows unless explicitly requested
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1810:      `(importance_tier IS NULL OR importance_tier NOT IN ('deprecated', 'archived'))`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1811:      `(is_archived IS NULL OR is_archived = 0)`
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2013: * Keep Tier 3 structural fallback scores below established Tier 1/2 confidence.
.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:152:        includeArchived: false,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:31:  validationCount: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:131:      'SELECT importance_tier, validation_count, confidence FROM memory_index WHERE id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:135:      confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:143:        validationCount: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:151:    const validationCount = resolvePositiveValidationCount(totalValidationCount, negativeValidationCount);
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:159:        validationCount,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:171:        validationCount,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:177:    if (validationCount < path.threshold) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:182:        validationCount,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:183:        reason: `below_threshold: positive_validation_count=${validationCount}/${path.threshold}`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:191:      validationCount,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:192:      reason: `threshold_met: positive_validation_count=${validationCount}>=${path.threshold}`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:201:      validationCount: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:240:          validationCount: check.validationCount,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:257:        check.validationCount,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:269:        `(${check.validationCount} validations)`
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:281:      validationCount: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:316:      const positiveValidationCount = resolvePositiveValidationCount(
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:321:      if (positiveValidationCount < path.threshold) continue;
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:327:        validationCount: positiveValidationCount,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:328:        reason: `threshold_met: positive_validation_count=${positiveValidationCount}>=${path.threshold}`,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:14:  | 'experimental.session.compacting';
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:143:          hook: 'experimental.session.compacting',
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:196:  'confidence',
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:197:  'confidenceScore',
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:53:| **DegradedModeContract** | Failure description with confidence impact, retry recommendation, and affected stages |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:131:| `confidence_impact` | `number` | Confidence factor (0 = total loss, 1 = no impact), clamped to [0, 1] |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:162:| `createDegradedContract(failure_mode, fallback_mode, confidence_impact, retry_recommendation, degradedStages)` | `DegradedModeContract` | New degraded-mode record with clamped confidence |
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:185:- Do not replace those axes with a single scalar such as `trust`, `confidence`, `authorityScore`, or `freshnessScore`.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:186:- Ranking confidence from `lib/search/confidence-scoring.ts` is retrieval-ordering metadata only and must not be reused as `StructuralTrust`.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:236:console.log(`Failure: ${degraded.failure_mode}, confidence impact: ${degraded.confidence_impact}`);
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:237:// Failure: timeout, confidence impact: 0.15
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:305:- Fail closed when any axis is missing, malformed, or collapsed into scalar stand-ins such as `trust`, `trustScore`, `confidence`, `confidenceScore`, or `authorityScore`.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:312:- Ranking confidence and other retrieval-ordering metadata stay separate from `StructuralTrust`.
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:49:  confidence?: {
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:259:  const lowConfidence = results.filter(r => r.confidence?.label === 'low');
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:261:    blockers.push(`${lowConfidence.length} result(s) have low confidence scores`);
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:264:  const archivedOrCold = results.filter(
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:267:  if (archivedOrCold.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:268:    blockers.push(`${archivedOrCold.length} result(s) are cold/archived — may be stale`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:6:// Gate: SPECKIT_HYDE — deep + low-confidence queries only.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:84: * Low-confidence threshold: if the top result has an effective score
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:85: * below this value, the baseline is considered low-confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:90: * Minimum number of results needed to assess baseline confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:91: * An empty result set is always considered low-confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:121: * Detect whether a baseline result set has low retrieval confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:123: * A baseline is low-confidence when:
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:131: * @returns True when the baseline is low-confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:380: * for a deep + low-confidence query, log results, and return candidates
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:71:  confidence?: {
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:159: * Classify results by confidence label.
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:160: * Returns counts for high, medium, low (and unknown when no confidence data).
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:162: * @param results - Results to classify by confidence label.
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:163: * @returns Counts for each confidence bucket.
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:175:    const label = result.confidence?.label;
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:196: * Build a human-readable digest string from confidence distribution.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:619:            last_accessed TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:946:        database.exec('ALTER TABLE causal_edges ADD COLUMN last_accessed TEXT');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:947:        logger.info('Migration v18: Added last_accessed column to causal_edges');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:950:          console.warn('[VectorIndex] Migration v18 warning (last_accessed):', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1677: * Adds legacy confidence-related columns when needed.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1681:export function migrate_confidence_columns(database: Database.Database): void {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1685:  if (!column_names.includes('confidence')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1687:      database.exec(`ALTER TABLE memory_index ADD COLUMN confidence REAL DEFAULT 0.5`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1688:      console.warn('[vector-index] Migration: Added confidence column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1693:      logDuplicateColumnMigrationSkip('confidence', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1813:  if (!column_names.includes('last_accessed')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1815:      database.exec(`ALTER TABLE memory_index ADD COLUMN last_accessed INTEGER DEFAULT 0`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1816:      console.warn('[vector-index] Migration: Added last_accessed column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1821:      logDuplicateColumnMigrationSkip('last_accessed', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2047:    database.exec(`CREATE INDEX IF NOT EXISTS idx_last_accessed ON memory_index(last_accessed DESC)`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2048:    logger.info('Created idx_last_accessed index');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2052:      index: 'idx_last_accessed',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2276:    migrate_confidence_columns(database);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2319:      access_count INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2320:      last_accessed INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2337:      confidence REAL DEFAULT 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2345:      is_archived INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2434:    CREATE INDEX IF NOT EXISTS idx_access_importance ON memory_index(access_count DESC, importance_weight DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2466:    CREATE INDEX IF NOT EXISTS idx_last_accessed ON memory_index(last_accessed DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2487:export { migrate_confidence_columns as migrateConfidenceColumns };
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:25:  migrate_confidence_columns,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:47:  update_confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:187:    includeArchived = false
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:218:    constitutional_results = get_constitutional_memories(database, specFolder, includeArchived);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:226:  if (!includeArchived) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:227:    where_clauses.push('(m.is_archived IS NULL OR m.is_archived = 0)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:292:  options: { specFolder?: string | null; maxTokens?: number; includeArchived?: boolean } = {},
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:295:  const { specFolder = null, maxTokens = 2000, includeArchived = false } = options;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:297:  let results = get_constitutional_memories(database, specFolder, includeArchived);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:321:  options: { limit?: number; specFolder?: string | null; minSimilarity?: number; includeArchived?: boolean } = {}
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:346:  const { limit = 10, specFolder = null, minSimilarity = 50, includeArchived = false } = options;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:360:  const archival_filter = !includeArchived ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)' : '';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:383:        ${archival_filter}
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:618:  options: { limit?: number; specFolder?: string | null; includeArchived?: boolean } = {},
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:621:  const { limit = 20, specFolder = null, includeArchived = false } = options;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:642:  if (!includeArchived) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:643:    where_clause += ' AND (is_archived IS NULL OR is_archived = 0)';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:995:    const usage_factor = Math.min(1.0, (r.access_count || 0) / 10);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1094:export function get_usage_stats(options: UsageStatsOptions = {}): Array<{ id: number; title: string | null; spec_folder: string; file_path: string; access_count: number; last_accessed: number | null; confidence: number | null; created_at: string }> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1096:    sortBy = 'access_count',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1101:  const valid_sort_fields = ['access_count', 'last_accessed', 'confidence'];
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1102:  const sort_field = valid_sort_fields.includes(sortBy) ? sortBy : 'access_count';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1108:    SELECT id, title, spec_folder, file_path, access_count,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1109:           last_accessed, confidence, created_at
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1111:    WHERE access_count > 0
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1119:    access_count: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1120:    last_accessed: number | null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1121:    confidence: number | null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1137:export function find_cleanup_candidates(options: CleanupOptions = {}): Array<{ id: number; specFolder: string; filePath: string; title: string; createdAt: string | undefined; lastAccessedAt: number | undefined; accessCount: number; confidence: number; ageString: string; lastAccessString: string; reasons: string[] }> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1158:      last_accessed,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1159:      access_count,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1160:      confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1165:      OR access_count <= ?
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1166:      OR confidence <= ?
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1167:      OR (last_accessed IS NULL AND created_at < ?)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1169:      last_accessed ASC NULLS FIRST,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1170:      access_count ASC,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1171:      confidence ASC
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1192:      typeof row.last_accessed === 'number' ? new Date(row.last_accessed).toISOString() : null
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1199:    if ((row.access_count || 0) <= maxAccessCount) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1200:      const count = row.access_count || 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1203:    if ((row.confidence || 0.5) <= maxConfidence) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1204:      reasons.push(`low importance (${Math.round((row.confidence || 0.5) * 100)}%)`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1213:      lastAccessedAt: row.last_accessed,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1214:      accessCount: row.access_count || 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1215:      confidence: row.confidence || 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1229:export function get_memory_preview(memory_id: number, max_lines = 50): { id: number; specFolder: string; filePath: string; title: string; createdAt: string | undefined; lastAccessedAt: number | undefined; accessCount: number; confidence: number; ageString: string; lastAccessString: string; content: string } | null {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1274:    lastAccessedAt: memory.last_accessed,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1275:    accessCount: memory.access_count || 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1276:    confidence: memory.confidence || 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1279:      typeof memory.last_accessed === 'number' ? new Date(memory.last_accessed).toISOString() : null
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:6:// Index, update, delete, and status/confidence updates.
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
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:133:| `type-inference.ts` | Multi-source inference with confidence scoring |
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:166:// Returns: { type: 'working', source: 'file_path', confidence: 0.8 }
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:172:// Returns: { type: 'semantic', source: 'frontmatter_explicit', confidence: 1.0 }
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:179:// Returns: { type: 'procedural', source: 'keywords', confidence: 0.7 }
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts:83: * Truncate results based on confidence gap analysis.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:51:  archivedDaysThreshold: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:64:  archivedDaysThreshold: parseLimit('ARCHIVED_DAYS_THRESHOLD', ARCHIVED_DAYS_THRESHOLD),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:264:    const timestamp = mem.lastAccess || mem.last_accessed || mem.lastReview || mem.last_review || mem.created_at;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:277:  // (days > 90 AND r < 0.02). Using || here would incorrectly archive
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:279:  if (days > TIER_CONFIG.archivedDaysThreshold && r < STATE_THRESHOLDS.DORMANT) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:494: * Determine if a memory should be archived.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:499:  // Never archive constitutional or critical
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:504:  // Pinned memories are never archived
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
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:19:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:66:  let confidence = 0.55;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:68:    confidence = Math.max(confidence, candidate);
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:99:    confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:113:  const confidence = candidate.confidence;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:120:    || typeof confidence !== 'number'
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:121:    || !Number.isFinite(confidence)
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:132:    confidence: Math.max(0, Math.min(1, confidence)),
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:18:  confidence: 'high' | 'medium' | 'low' | 'fallback';
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:91: * Determine confidence label based on how clearly the query fits its tier.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:113:    // High confidence: many terms and low stop-word ratio (content-rich)
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:141: * @returns ClassificationResult with tier, features, and confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:151:    confidence: 'fallback',
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:184:    const confidence = determineConfidence(tier, termCount, triggerMatch, stopWordRatio);
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:195:      confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:54:  access_count?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:55:  last_accessed?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:56:  confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:85:  access_count?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:86:  last_accessed?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:87:  confidence?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:141:  includeArchived?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:159:  access_count?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:17:// Feature catalog: Negative feedback confidence signal
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:142: * Confidence-gap truncation for low-confidence tails.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:166: * T002b/A4: Negative-feedback confidence demotion in ranking.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:410: * Generates a pseudo-document for low-confidence deep queries.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:545: * REQ-D5-004: Per-result calibrated confidence scoring.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:4:// Feature catalog: Automatic archival subsystem
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:5:// Background archival job for dormant/archived memories
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:32:      console.warn(`[archival-manager] tier-classifier module unavailable: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:91:          `[archival-manager] bm25-index module unavailable. primary="${primaryError}" fallback="${fallbackMessage}"`
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:147:          `[archival-manager] embeddings module unavailable. primary="${primaryError}" fallback="${fallbackMessage}"`
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:214:  access_count: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:215:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:222:  totalUnarchived: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:234:const archivalStats: ArchivalStats = {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:237:  totalUnarchived: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:258:    const hasArchived = columns.some(c => c.name === 'is_archived');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:261:      db.exec('ALTER TABLE memory_index ADD COLUMN is_archived INTEGER DEFAULT 0');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:262:      db.exec('CREATE INDEX IF NOT EXISTS idx_archived ON memory_index(is_archived)');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:263:      console.error('[archival-manager] Added is_archived column');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:268:      console.warn(`[archival-manager] ensureArchivedColumn error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:274: * Ensure the archival_stats metadata table exists for persisting stats across restarts (P5-06).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:281:      CREATE TABLE IF NOT EXISTS archival_stats (
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:289:    console.warn(`[archival-manager] ensureArchivalStatsTable error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:294: * Load archival stats from the database on startup (P5-06).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:301:      'SELECT key, value FROM archival_stats'
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:307:          archivalStats.totalScanned = parseInt(row.value, 10) || 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:310:          archivalStats.totalArchived = parseInt(row.value, 10) || 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:312:        case 'totalUnarchived':
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:313:          archivalStats.totalUnarchived = parseInt(row.value, 10) || 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:316:          archivalStats.lastScanTime = row.value === '' ? null : row.value || null;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:322:    console.warn(`[archival-manager] loadArchivalStats error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:327: * Persist archival stats to the database (P5-06).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:334:      INSERT INTO archival_stats (key, value, updated_at)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:340:      upsert.run('totalScanned', String(archivalStats.totalScanned));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:341:      upsert.run('totalArchived', String(archivalStats.totalArchived));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:342:      upsert.run('totalUnarchived', String(archivalStats.totalUnarchived));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:343:      upsert.run('lastScanTime', archivalStats.lastScanTime ?? '');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:349:    console.warn(`[archival-manager] saveArchivalStats error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:358: * Get archival candidates using SQL as a pre-filter, then FSRS tier classifier
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:361: * Strategy: SQL query fetches broad candidates (unarchived, not protected, not pinned).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:362: * The FSRS-based tier classifier then determines which should actually be archived.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:363: * This unifies the dual archival paths (P5-05) — FSRS is primary, SQL is pre-filter.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:371:    // Broad SQL pre-filter: get unarchived, non-protected, non-pinned memories
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:375:      WHERE (is_archived IS NULL OR is_archived = 0)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:378:      ORDER BY last_accessed ASC NULLS FIRST, access_count ASC
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:385:    // Use FSRS-based tier classifier as authoritative archival decision
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:403:          ((row.access_count as number) || 0) <= ARCHIVAL_CONFIG.maxAccessCount &&
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:404:          ((row.confidence as number) || 0.5) <= ARCHIVAL_CONFIG.maxConfidence
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:416:          access_count: (row.access_count as number) || 0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:417:          confidence: (row.confidence as number) || 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:428:    console.warn(`[archival-manager] getArchivalCandidates error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:438:  if ((row.access_count as number) <= ARCHIVAL_CONFIG.maxAccessCount) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:441:  if ((row.confidence as number) <= ARCHIVAL_CONFIG.maxConfidence) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:442:    reasons.push('low-confidence');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:460:    const isArchived = (memory.is_archived as number) === 1;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:472:    console.warn(`[archival-manager] checkMemoryArchivalStatus error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:485:    console.warn(`[archival-manager] getMemoryIndexColumns failed: ${message}`);
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
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:554:    `[archival-manager] Deferred vector re-embedding for memory ${memoryId} until next index scan`
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:558:function archiveMemory(memoryId: number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:564:      SET is_archived = 1,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:567:        AND (is_archived IS NULL OR is_archived = 0)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:572:      archivalStats.totalArchived++;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:583:    archivalStats.errors.push(msg);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:584:    if (archivalStats.errors.length > MAX_ERROR_LOG) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:585:      archivalStats.errors = archivalStats.errors.slice(-MAX_ERROR_LOG);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:587:    console.warn(`[archival-manager] archiveMemory error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:592:function archiveBatch(memoryIds: number[]): { archived: number; failed: number } {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:593:  if (!db) return { archived: 0, failed: memoryIds.length };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:595:  let archived = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:601:        // Db is guaranteed non-null because archiveBatch returns early when the module database is missing
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:604:          SET is_archived = 1,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:607:            AND (is_archived IS NULL OR is_archived = 0)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:612:          archivalStats.totalArchived++;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:615:          archived++;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:622:        archivalStats.errors.push(msg);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:623:        if (archivalStats.errors.length > MAX_ERROR_LOG) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:624:          archivalStats.errors = archivalStats.errors.slice(-MAX_ERROR_LOG);
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
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:672:  archivalStats.totalScanned += candidates.length;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:673:  archivalStats.lastScanTime = new Date().toISOString();
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:675:  const result = archiveBatch(candidates.map(c => c.id));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:681:    `[archival-manager] Scan complete: ${candidates.length} candidates, ${result.archived} archived`
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:684:  return { scanned: candidates.length, archived: result.archived };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:701:      console.warn(`[archival-manager] Background job error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:709:  console.error(`[archival-manager] Background job started (interval: ${intervalMs / 1000}s)`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:716:    console.error('[archival-manager] Background job stopped');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:729:  return { ...archivalStats };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:733:  return archivalStats.errors.slice(-limit);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:737:  archivalStats.totalScanned = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:738:  archivalStats.totalArchived = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:739:  archivalStats.totalUnarchived = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:740:  archivalStats.lastScanTime = null;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:741:  archivalStats.errors = [];
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:764:  archiveMemory,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:765:  archiveBatch,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:766:  unarchiveMemory,
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:25:  includeArchived?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:155: * @param options - Search options (limit, specFolder, includeArchived)
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:167:  const { limit = 20, specFolder, includeArchived = false } = options;
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:183:  const archivalFilter = !includeArchived
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:184:    ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)'
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:202:      ${archivalFilter}
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:38:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:256: * Returns a RoutingResult with the detected class, strategy, and confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:262:    confidence: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:302:  const confidence = bestScore > 0 ? Math.min(1, bestScore / 6) : 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:310:      confidence: 0.4,
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:321:        confidence: 0.3, // Low confidence from folder hint only
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:329:    confidence,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:146:      SET access_count = access_count + 1,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:147:          last_accessed = ?,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:197:          access_count = access_count + 1,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:198:          last_accessed = ?
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:244:  const usage = calculateUsageScore((memory.access_count as number) || 0) as number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:309:      ORDER BY last_accessed DESC, importance_weight DESC
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:32:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:225:  // 1. Check explicit type in frontmatter (highest confidence)
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:231:      confidence: 1.0,
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:243:      confidence: 0.95,
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:252:      confidence: 0.9,
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:261:      confidence: 0.9,
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:271:      confidence: 0.8,
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:281:      confidence: 0.7,
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:285:  // 6. Default type (lowest confidence)
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:289:    confidence: 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:40:  access_count?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:382:      SET access_count = access_count + 1,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts:383:          last_accessed = ?
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:98:- TRM evidence-gap detection (Z-score confidence check on score distribution).
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:119:**Score immutability invariant**: Stage 4 MUST NOT modify scores. Enforced via compile-time `Stage4ReadonlyRow` readonly fields and runtime `captureScoreSnapshot` / `verifyScoreInvariant` defence-in-depth. Applies memory-state filtering (HOT/WARM/COLD/DORMANT/ARCHIVED with per-tier limits), evidence gap detection (Z-score confidence check), quality floor (`QUALITY_FLOOR=0.005`), and token budget truncation.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:250:| **TypeScript**       | `channel-representation.ts`, `channel-enforcement.ts`, `confidence-truncation.ts` (quality)   |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:305:| `confidence-truncation.ts` | -      | TypeScript | Removes low-confidence tail using 2x median gap heuristic (min 3 results) (Sprint 3) |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:309:| `evidence-gap-detector.ts` | -      | TypeScript | Z-score confidence check on RRF scores to detect low-confidence retrieval |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:333:| `confidence-scoring.ts`    | -      | TypeScript | Computes calibrated confidence scores for retrieval results |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:801:// -> { type: 'add_feature', confidence: 0.85 }
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:963:- Query pipeline additions: query complexity routing, channel representation, confidence truncation, dynamic token budgets, folder discovery
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:383:           AND COALESCE(is_archived, 0) = 0`
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:431:         WHERE COALESCE(is_archived, 0) = 0
.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:28:  '/z_archive/',
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:59:  confidence: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:139:    return { detected: false, type: null, description: null, confidence: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:148:  // Specificity-based confidence per contradiction type:
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:149:  // General/weak signals get lower confidence, explicit/strong signals get higher
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:171:      const confidence = PATTERN_CONFIDENCE[type] ?? 0.5;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:172:      if (confidence > maxConfidence) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:173:        maxConfidence = confidence;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:179:      const confidence = (PATTERN_CONFIDENCE[type] ?? 0.5) * 0.6;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:180:      if (confidence > maxConfidence) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:181:        maxConfidence = confidence;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:193:    confidence: maxConfidence,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:220:        { detected: false, type: null, description: null, confidence: 0 },
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts:243:        { detected: false, type: null, description: null, confidence: 0 },
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
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:135:  includeArchived: boolean
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:137:  if (includeArchived) return results;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:139:    const archived = row.is_archived ?? row.isArchived;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:140:    if (archived == null) return true;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:141:    if (typeof archived === 'number') return archived === 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:142:    if (typeof archived === 'boolean') return archived === false;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:490:    includeArchived,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:598:      includeArchived,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:669:                    { limit, specFolder, includeArchived }
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:732:                  { limit, specFolder, includeArchived }
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:766:            { limit, specFolder, includeArchived }
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:775:          { limit, specFolder, includeArchived }
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:814:                { limit, specFolder, includeArchived }
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:831:                    { limit, specFolder, includeArchived }
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:878:            { limit, specFolder, includeArchived }
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:896:            includeArchived,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:936:      includeArchived,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1112:                { limit, specFolder, includeArchived }
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1167:  //   - Check if the current baseline has low confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1240:                `SELECT id, title, spec_folder, file_path, importance_tier, importance_weight, quality_score, created_at, is_archived, context_type, tenant_id, user_id, agent_id, session_id, shared_space_id FROM memory_index WHERE id IN (${placeholders})`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1259:            const archiveFilteredSummaryHits = applyArchiveFilter(newSummaryHits, includeArchived);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1260:            const folderFilteredSummaryHits = applyFolderFilter(archiveFilteredSummaryHits, specFolder);
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
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:527:    const dateStr = r.created_at as string | undefined || r.last_accessed as string | undefined || r.last_review as string | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:41:  includeArchived: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:124:  includeArchived,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:153:    includeArchived,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:189: * No-op if routing result is absent, unknown, or zero-confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:196:  if (!routingResult || routingResult.detectedClass === 'unknown' || routingResult.confidence <= 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:5:// Transparent Reasoning Module (TRM): Z-score confidence check
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:6:// On RRF scores to detect low-confidence retrieval and inject
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:14:/** Z-score threshold below which retrieval confidence is considered low. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:35:  /** True when retrieval confidence is too low to trust results. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:208:  return `> **[EVIDENCE GAP DETECTED]: Retrieved context has low mathematical confidence (Z=${trm.zScore.toFixed(2)}). Consider first principles.**`;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:39:The cognitive subsystem is the "brain" of the memory system. It determines which memories stay active, which fade, and which get archived. Unlike simple time-based caching, it uses FSRS v4 power-law decay validated on 100M+ real human memory data.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:193:| **Usage**      | 0.15   | Access frequency       | `min(1, access_count / 50)`                   |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:253:├── archival-manager.ts         # 90-day archival lifecycle (395 lines)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:270:| `archival-manager.ts`      | Lifecycle management      | `runArchivalScan`, `archiveMemory`, `startBackgroundJob`                    |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:417://   contradiction: { detected: false, type: null, description: null, confidence: 0 },
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:423:// contradiction = { detected: true, type: 'negation', description: '...', confidence: 0.60 }
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:500:// Activate memory (increment access_count, update last_accessed)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:640:  archiveMemory,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:641:  unarchiveMemory,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:647:} from './archival-manager';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:658:// scanResult = { scanned: 15, archived: 12 }
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:664:// Archive/unarchive
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:665:archiveMemory(memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:666:unarchiveMemory(memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:668:// Get archival candidates
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:670:// candidates = [{ id, title, spec_folder, file_path, created_at, importance_tier, access_count, confidence, reason }]
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:674:// stats = { totalScanned, totalArchived, totalUnarchived, lastScanTime, errors }
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:687:# maxAgeDays: 90                               # Days before eligible for archival
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:689:# maxConfidence: 0.4                           # Low-confidence threshold
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:750:import * as archival from './archival-manager';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:759:archival.init(db);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:763:// Start background archival
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:764:archival.startBackgroundJob();
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:885:**Cause**: Not archiving old memories, or archival job not running
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:889:import * as archival from './archival-manager';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:891:// Check archival stats
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:892:const stats = archival.getStats();
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:893:console.log('Background job:', archival.isBackgroundJobRunning());
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:896:if (!archival.isBackgroundJobRunning()) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:897:  archival.startBackgroundJob();
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:901:const scanResult = archival.runArchivalScan();
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:902:console.log(`Archived ${scanResult.archived} old memories`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:940:// Use activateMemoryWithFsrs (updates stability, last_review, access_count)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:954:| Memory leak          | Enable archival: `archival.startBackgroundJob()`             |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:999:**Q: Can I disable automatic archival?**
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:1003:import * as archival from './archival-manager';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:1004:archival.stopBackgroundJob();
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:1049:| `ARCHIVED_DAYS_THRESHOLD` | 90      | Days inactive before archival           |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:1051:| `SPECKIT_ARCHIVAL`        | true    | Enable background archival job          |
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:144:  // When feature flag is disabled, classifier returns 'complex' with 'fallback' confidence.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:461:  includeArchived: boolean,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:464:  return `${db_scope}::${spec_folder || 'global'}:${includeArchived ? 'arch' : 'noarch'}`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:606: * @param includeArchived - Whether archived memories should be included.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:612:  includeArchived = false
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:614:  // Scope cache entries to the active DB path as well as the archived filter.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:615:  const cache_key = build_constitutional_cache_key(spec_folder, includeArchived);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:637:        ${!includeArchived ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)' : ''}
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:679:    const scoped_suffix_archived = `::${spec_folder}:arch`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:682:      if (key.endsWith(scoped_suffix_archived) || key.endsWith(scoped_suffix_live)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:687:      if (key.endsWith(scoped_suffix_archived) || key.endsWith(scoped_suffix_live)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:715:         AND COALESCE(m.is_archived, 0) = 0
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:942:      includeArchived: options.includeArchived === true
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1096:    options: { specFolder?: string | null; maxTokens?: number; includeArchived?: boolean } = {},
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:30:// 3. Apply evidence gap detection via TRM (Z-score confidence check)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:574:          access_count = access_count + 1,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:575:          last_accessed = ?
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:653: * confidence, the class strategy's `boostFactor` is applied to the
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:666:  if (!routingResult || routingResult.confidence <= 0) return results;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:700: * confidence-multiplier demotion. The multiplier is batch-loaded from the DB
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:763:    // Apply negative feedback demotion (multiplicative confidence multiplier)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:801:      SELECT id, COALESCE(access_count, 0) AS access_count
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:804:    `).all(...resultIds) as Array<{ id: number; access_count: number }>;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:811:      Math.max(currentMax, Number.isFinite(row.access_count) ? row.access_count : 0), 0);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:817:    const usageMap = new Map(usageRows.map((row) => [row.id, row.access_count]));
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:938: *   5.  Artifact routing   (all types, when routing confidence > 0)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1230:  if (config.artifactRouting && config.artifactRouting.confidence > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1304:    config.artifactRouting.confidence > 0 &&
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:26:  last_accessed?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:93:  last_accessed?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:134:  includeArchived: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:180:  confidence: number;

exec
/bin/zsh -lc "nl -ba .opencode/plugins/spec-kit-compact-code-graph.js | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts | sed -n '340,700p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts | sed -n '360,430p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "rg -n \"experimental\\.session\\.compacting|compaction|compact\" .opencode/plugins/spec-kit-compact-code-graph.js" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
36:const PLUGIN_ID = 'spec-kit-compact-code-graph';
44:const BRIDGE_PATH = fileURLToPath(new URL('./spec-kit-compact-code-graph-bridge.mjs', import.meta.url));
77: *   compaction?: TransportBlock,
296:      spec_kit_compact_code_graph_status: tool({
297:        description: 'Show Spec Kit compact code graph plugin cache status',
396:    'experimental.session.compacting': async (input, output) => {
406:      const block = plan?.compaction;

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts | sed -n '180,290p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts | sed -n '130,155p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts | sed -n '648,790p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/plugins/spec-kit-compact-code-graph.js | sed -n '388,430p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '560,840p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   560	    const difficultyBonus = Math.max(0, (0.9 - clampedR) * 0.5);
   561	
   562	    const newStability = fsrsScheduler.updateStability(
   563	      (memory.stability as number) || fsrsScheduler.DEFAULT_INITIAL_STABILITY,
   564	      (memory.difficulty as number) || fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY,
   565	      grade,
   566	      clampedR
   567	    ) * (1 + difficultyBonus);
   568	
   569	    db.prepare(`
   570	      UPDATE memory_index
   571	      SET stability = ?,
   572	          last_review = CURRENT_TIMESTAMP,
   573	          review_count = review_count + 1,
   574	          access_count = access_count + 1,
   575	          last_accessed = ?
   576	      WHERE id = ?
   577	    `).run(newStability, Date.now(), memoryId);
   578	
   579	    return { stability: newStability, difficulty: (memory.difficulty as number) || fsrsScheduler.DEFAULT_INITIAL_DIFFICULTY };
   580	  } catch (err: unknown) {
   581	    const message = err instanceof Error ? err.message : String(err);
   582	    console.warn(`[stage2-fusion] strengthenOnAccess failed for id ${memoryId}: ${message}`);
   583	    return null;
   584	  }
   585	}
   586	
   587	// -- Exported internal functions (also exposed via __testables) --
   588	
   589	/**
   590	 * Apply intent-based weights to search results.
   591	 *
   592	 * G2 PREVENTION: This function is ONLY called for non-hybrid search types.
   593	 * Hybrid search (RRF / RSF) already incorporates intent-weighted signals
   594	 * during fusion. Calling this on hybrid results would double-count intent.
   595	 *
   596	 * Weight combination:
   597	 *   intentScore = similarity * w.similarity + importance * w.importance + recency * w.recency
   598	 *
   599	 * Similarity is normalised from the raw 0–100 scale to 0–1 before the
   600	 * weighted combination so all three dimensions operate on the same scale.
   601	 * Results are sorted descending by intentAdjustedScore.
   602	 *
   603	 * @param results - Pipeline rows to score
   604	 * @param weights - Intent weight configuration {similarity, importance, recency}
   605	 * @returns New array sorted by intentAdjustedScore descending
   606	 */
   607	function applyIntentWeightsToResults(
   608	  results: PipelineRow[],
   609	  weights: IntentWeightsConfig
   610	): PipelineRow[] {
   611	  if (!Array.isArray(results) || results.length === 0) return results;
   612	  if (!weights) return results;
   613	
   614	  const scored: ScoredRow[] = results.map((row) => {
   615	    // Normalise similarity from 0–100 to 0–1 for proper weight combination
   616	    const similarityRaw = typeof row.similarity === 'number' && Number.isFinite(row.similarity)
   617	      ? row.similarity
   618	      : resolveBaseScore(row) * 100; // fall back to base score rescaled
   619	
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
   691	/**
   692	 * Apply feedback signals — learned trigger boosts and negative feedback demotions.
   693	 *
   694	 * Learned triggers: each memory that matches the query's learned terms receives
   695	 * a proportional boost to its score (capped at 1.0). The boost magnitude uses
   696	 * `match.weight` directly because queryLearnedTriggers already applies the
   697	 * configured learned-trigger weighting (0.7x).
   698	 *
   699	 * Negative feedback: memories with wasUseful=false validations receive a
   700	 * confidence-multiplier demotion. The multiplier is batch-loaded from the DB
   701	 * then applied via applyNegativeFeedback. Feature-gated via
   702	 * SPECKIT_NEGATIVE_FEEDBACK env var.
   703	 *
   704	 * @param results - Pipeline rows to adjust
   705	 * @param query   - Original search query (used for learned trigger matching)
   706	 * @returns New array with feedback-adjusted scores
   707	 */
   708	function applyFeedbackSignals(
   709	  results: PipelineRow[],
   710	  query: string
   711	): PipelineRow[] {
   712	  if (!Array.isArray(results) || results.length === 0) return results;
   713	
   714	  let db: Database.Database | null = null;
   715	  try {
   716	    db = requireDb();
   717	  } catch (error: unknown) {
   718	    if (error instanceof Error) {
   719	      // DB not available — skip feedback signals gracefully
   720	      return results;
   721	    }
   722	    // DB not available — skip feedback signals gracefully
   723	    return results;
   724	  }
   725	
   726	  // -- Learned trigger boosts --
   727	  let learnedBoostMap = new Map<number, number>();
   728	  try {
   729	    const learnedMatches = queryLearnedTriggers(query, db as Parameters<typeof queryLearnedTriggers>[1]);
   730	    for (const match of learnedMatches) {
   731	      const boost = match.weight;
   732	      const existing = learnedBoostMap.get(match.memoryId) ?? 0;
   733	      learnedBoostMap.set(match.memoryId, Math.max(existing, boost));
   734	    }
   735	  } catch (err: unknown) {
   736	    const message = err instanceof Error ? err.message : String(err);
   737	    console.warn(`[stage2-fusion] learned trigger query failed: ${message}`);
   738	    learnedBoostMap = new Map();
   739	  }
   740	
   741	  // -- Negative feedback stats (batch load) --
   742	  let negativeFeedbackStats = new Map<number, { negativeCount: number; lastNegativeAt: number | null }>();
   743	  if (isNegativeFeedbackEnabled()) {
   744	    try {
   745	      const memoryIds = results.map((r) => r.id);
   746	      negativeFeedbackStats = getNegativeFeedbackStats(db as Parameters<typeof getNegativeFeedbackStats>[0], memoryIds);
   747	    } catch (err: unknown) {
   748	      const message = err instanceof Error ? err.message : String(err);
   749	      console.warn(`[stage2-fusion] negative feedback stats failed: ${message}`);
   750	    }
   751	  }
   752	
   753	  // -- Apply combined adjustments --
   754	  return results.map((row) => {
   755	    let currentScore = resolveBaseScore(row);
   756	
   757	    // Apply learned trigger boost (additive to base score, capped at 1.0)
   758	    const learnedBoost = learnedBoostMap.get(row.id) ?? 0;
   759	    if (learnedBoost > 0) {
   760	      currentScore = Math.min(1.0, currentScore + learnedBoost);
   761	    }
   762	
   763	    // Apply negative feedback demotion (multiplicative confidence multiplier)
   764	    if (isNegativeFeedbackEnabled()) {
   765	      const negStats = negativeFeedbackStats.get(row.id);
   766	      if (negStats && negStats.negativeCount > 0) {
   767	        currentScore = applyNegativeFeedback(
   768	          currentScore,
   769	          negStats.negativeCount,
   770	          negStats.lastNegativeAt
   771	        );
   772	      }
   773	    }
   774	
   775	    if (currentScore === resolveBaseScore(row)) return row;
   776	
   777	    return withSyncedScoreAliases(row, currentScore);
   778	  });
   779	}
   780	
   781	function applyUsageRankingBoost(
   782	  db: Database.Database,
   783	  results: PipelineRow[],
   784	): PipelineRow[] {
   785	  if (!isUsageRankingEnabled() || !Array.isArray(results) || results.length === 0) {
   786	    return results;
   787	  }
   788	
   789	  try {
   790	    ensureUsageColumn(db);
   791	    const resultIds = results
   792	      .map((row) => row.id)
   793	      .filter((id): id is number => typeof id === 'number' && Number.isFinite(id));
   794	
   795	    if (resultIds.length === 0) {
   796	      return results;
   797	    }
   798	
   799	    const placeholders = resultIds.map(() => '?').join(',');
   800	    const usageRows = db.prepare(`
   801	      SELECT id, COALESCE(access_count, 0) AS access_count
   802	      FROM memory_index
   803	      WHERE id IN (${placeholders})
   804	    `).all(...resultIds) as Array<{ id: number; access_count: number }>;
   805	
   806	    if (usageRows.length === 0) {
   807	      return results;
   808	    }
   809	
   810	    const maxAccess = usageRows.reduce((currentMax, row) =>
   811	      Math.max(currentMax, Number.isFinite(row.access_count) ? row.access_count : 0), 0);
   812	
   813	    if (maxAccess <= 0) {
   814	      return results;
   815	    }
   816	
   817	    const usageMap = new Map(usageRows.map((row) => [row.id, row.access_count]));
   818	    const boosted = results.map((row) => {
   819	      const accessCount = usageMap.get(row.id) ?? 0;
   820	      const usageBoost = computeUsageBoost(accessCount, maxAccess);
   821	
   822	      if (usageBoost <= 0) {
   823	        return row;
   824	      }
   825	
   826	      return {
   827	        ...withSyncedScoreAliases(row, resolveBaseScore(row) + usageBoost),
   828	        usageBoost,
   829	      };
   830	    });
   831	
   832	    return sortDeterministicRows(boosted as Array<PipelineRow & { id: number }>);
   833	  } catch (err: unknown) {
   834	    const message = err instanceof Error ? err.message : String(err);
   835	    console.warn(`[stage2-fusion] usage ranking failed: ${message}`);
   836	    return results;
   837	  }
   838	}
   839	
   840	/**

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts | sed -n '126,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   126	  let total = 0;
   127	  let statusCounts: ReturnType<typeof vectorIndex.getStatusCounts> = { success: 0, pending: 0, failed: 0, retry: 0, partial: 0 };
   128	  let dates: Record<string, unknown> = { oldest: null, newest: null };
   129	  let triggerCount = 0;
   130	  let topFolders: Record<string, unknown>[];
   131	  let totalSpecFolders = 0;
   132	  const tierBreakdown: Record<string, number> = {};
   133	  let lastIndexedAt: string | null = null;
   134	
   135	  try {
   136	    const totalResult = database.prepare('SELECT COUNT(*) as count FROM memory_index').get() as Record<string, unknown>;
   137	    total = (totalResult && typeof totalResult.count === 'number') ? totalResult.count : 0;
   138	    statusCounts = vectorIndex.getStatusCounts();
   139	    dates = (database.prepare('SELECT MIN(created_at) as oldest, MAX(created_at) as newest FROM memory_index').get() || { oldest: null, newest: null }) as Record<string, unknown>;
   140	
   141	    const triggerResult = database.prepare("SELECT SUM(json_array_length(trigger_phrases)) as count FROM memory_index WHERE trigger_phrases IS NOT NULL AND trigger_phrases != '[]'").get() as Record<string, unknown>;
   142	    triggerCount = (triggerResult && typeof triggerResult.count === 'number') ? triggerResult.count : 0;
   143	
   144	    const tierRows = database.prepare(
   145	      'SELECT importance_tier, COUNT(*) as count FROM memory_index GROUP BY importance_tier'
   146	    ).all() as { importance_tier: string; count: number }[];
   147	    for (const row of tierRows) {
   148	      tierBreakdown[row.importance_tier || 'normal'] = row.count;
   149	    }
   150	
   151	    const lastIndexedRow = database.prepare(
   152	      'SELECT MAX(updated_at) as last_indexed FROM memory_index'
   153	    ).get() as { last_indexed: string | null } | undefined;
   154	    lastIndexedAt = lastIndexedRow?.last_indexed || null;
   155	  } catch (dbErr: unknown) {
   156	    const message = toErrorMessage(dbErr);
   157	    console.error(`[memory-stats] Database query failed (aggregate stats): ${message}`);
   158	    return createMCPErrorResponse({
   159	      tool: 'memory_stats',
   160	      error: `Database query failed: ${message}`,
   161	      code: 'E021',
   162	      details: { requestId },
   163	      startTime,
   164	    });
   165	  }
   166	
   167	  let databaseSizeBytes: number | null = null;
   168	  try {
   169	    const dbPath = vectorIndex.getDbPath();
   170	    if (dbPath) {
   171	      databaseSizeBytes = fs.statSync(dbPath).size;
   172	    }
   173	  } catch (_err: unknown) {
   174	    // Non-fatal.
   175	  }
   176	
   177	  try {
   178	    if (folderRanking === 'count') {
   179	      const folderRows = database.prepare('SELECT spec_folder, COUNT(*) as count FROM memory_index GROUP BY spec_folder ORDER BY count DESC').all() as { spec_folder: string; count: number }[];
   180	
   181	      let filteredFolders = folderRows;
   182	      if (!includeArchived) {
   183	        filteredFolders = filteredFolders.filter((folder) => !folderScoring.isArchived(folder.spec_folder));
   184	      }
   185	
   186	      if (excludePatterns.length > 0) {
   187	        const loweredPatterns = excludePatterns
   188	          .filter((pattern: string) => typeof pattern === 'string' && pattern.length > 0)
   189	          .map((pattern: string) => pattern.toLowerCase());
   190	
   191	        if (loweredPatterns.length > 0) {
   192	          filteredFolders = filteredFolders.filter((folder) => {
   193	            const folderName = folder.spec_folder.toLowerCase();
   194	            return !loweredPatterns.some((pattern) => folderName.includes(pattern));
   195	          });
   196	        }
   197	      }
   198	
   199	      totalSpecFolders = filteredFolders.length;
   200	      topFolders = filteredFolders.slice(0, safeLimit).map((folder) => ({
   201	        folder: folder.spec_folder,
   202	        count: folder.count,
   203	      }));
   204	    } else {
   205	      const allMemories: FolderMemoryInput[] = database.prepare(`
   206	        SELECT
   207	          id, spec_folder, file_path, title, importance_weight, importance_tier,
   208	          created_at, updated_at, confidence, validation_count, access_count
   209	        FROM memory_index
   210	        WHERE embedding_status = 'success'
   211	      `).all() as FolderMemoryInput[];
   212	
   213	      const scoringOptions = {
   214	        includeArchived,
   215	        excludePatterns,
   216	      };
   217	
   218	      let scoredFolders: Record<string, unknown>[];
   219	      try {
   220	        scoredFolders = folderScoring.computeFolderScores(allMemories, scoringOptions);

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts | sed -n '130,150p;1236,1264p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
  1236	
  1237	            if (newSummaryIds.length > 0) {
  1238	              const placeholders = newSummaryIds.map(() => '?').join(', ');
  1239	              const memRows = db.prepare(
  1240	                `SELECT id, title, spec_folder, file_path, importance_tier, importance_weight, quality_score, created_at, is_archived, context_type, tenant_id, user_id, agent_id, session_id, shared_space_id FROM memory_index WHERE id IN (${placeholders})`
  1241	              ).all(...newSummaryIds) as PipelineRow[];
  1242	
  1243	              const memRowMap = new Map(memRows.map((r) => [r.id, r]));
  1244	              for (const sr of summaryResults) {
  1245	                if (!existingIds.has(String(sr.memoryId))) {
  1246	                  const memRow = memRowMap.get(sr.memoryId);
  1247	                  if (memRow) {
  1248	                    newSummaryHits.push({
  1249	                      ...memRow,
  1250	                      similarity: sr.similarity * 100,
  1251	                      score: sr.similarity,
  1252	                    });
  1253	                    existingIds.add(String(sr.memoryId));
  1254	                  }
  1255	                }
  1256	              }
  1257	            }
  1258	
  1259	            const archiveFilteredSummaryHits = applyArchiveFilter(newSummaryHits, includeArchived);
  1260	            const folderFilteredSummaryHits = applyFolderFilter(archiveFilteredSummaryHits, specFolder);
  1261	            const tierFilteredSummaryHits = applyTierFilter(folderFilteredSummaryHits, tier);
  1262	            const contextFilteredSummaryHits = contextType
  1263	              ? tierFilteredSummaryHits.filter((r) => resolveRowContextType(r) === contextType)
  1264	              : tierFilteredSummaryHits;

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts | sed -n '372,438p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   372	
   373	    if (normalizedIds.length === 0) {
   374	      return 0;
   375	    }
   376	
   377	    try {
   378	      const placeholders = normalizedIds.map(() => '?').join(', ');
   379	      const rows = (database.prepare(
   380	        `SELECT id, title, content_text, trigger_phrases, file_path
   381	         FROM memory_index
   382	         WHERE id IN (${placeholders})
   383	           AND COALESCE(is_archived, 0) = 0`
   384	      ) as Database.Statement).all(...normalizedIds) as Array<{
   385	        id: number;
   386	        title: string | null;
   387	        content_text: string | null;
   388	        trigger_phrases: string | null;
   389	        file_path: string | null;
   390	      }>;
   391	
   392	      const activeRowMap = new Map<number, typeof rows[number]>();
   393	      for (const row of rows) {
   394	        activeRowMap.set(row.id, row);
   395	      }
   396	
   397	      for (const rowId of normalizedIds) {
   398	        const row = activeRowMap.get(rowId);
   399	        if (!row) {
   400	          this.removeDocument(String(rowId));
   401	          continue;
   402	        }
   403	
   404	        const text = buildBm25DocumentText(row);
   405	        if (text.trim()) {
   406	          this.addDocument(String(row.id), text);
   407	        } else {
   408	          this.removeDocument(String(row.id));
   409	        }
   410	      }
   411	
   412	      return normalizedIds.length;
   413	    } catch (error: unknown) {
   414	      const msg = error instanceof Error ? error.message : String(error);
   415	      console.warn(`[bm25-index] Failed to sync BM25 rows: ${msg}`);
   416	      return 0;
   417	    }
   418	  }
   419	
   420	  /**
   421	   * P3-04/T312: Defer full startup warmup into batched row-ID syncs so process
   422	   * initialization is not blocked by a monolithic in-memory rebuild.
   423	   */
   424	  rebuildFromDatabase(database: Database.Database): number {
   425	    this.clear();
   426	
   427	    try {
   428	      const rows = (database.prepare(
   429	        `SELECT id
   430	         FROM memory_index
   431	         WHERE COALESCE(is_archived, 0) = 0
   432	         ORDER BY id`
   433	      ) as Database.Statement).all() as Array<{ id: number }>;
   434	
   435	      const pendingIds = rows.map((row) => row.id);
   436	      if (pendingIds.length === 0) {
   437	        return 0;
   438	      }

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts | sed -n '628,720p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   628	
   629	  try {
   630	    const constitutional_sql = `
   631	      SELECT m.*, 100.0 as similarity, 1.0 as effective_importance,
   632	             'constitutional' as source_type
   633	      FROM memory_index m
   634	      JOIN active_memory_projection p ON p.active_memory_id = m.id
   635	      WHERE m.importance_tier = 'constitutional'
   636	        AND m.embedding_status = 'success'
   637	        ${!includeArchived ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)' : ''}
   638	        ${spec_folder ? 'AND m.spec_folder = ?' : ''}
   639	      ORDER BY m.importance_weight DESC, m.created_at DESC
   640	    `;
   641	
   642	    const params = spec_folder ? [spec_folder] : [];
   643	    let results = database.prepare(constitutional_sql).all(...params) as MemoryRow[];
   644	
   645	    const MAX_CONSTITUTIONAL_TOKENS = 2000;
   646	    const TOKENS_PER_MEMORY = 100;
   647	    const max_constitutional_count = Math.floor(MAX_CONSTITUTIONAL_TOKENS / TOKENS_PER_MEMORY);
   648	    results = results.slice(0, max_constitutional_count);
   649	
   650	    results = results.map((row: MemoryRow) => {
   651	      row.trigger_phrases = parse_trigger_phrases(row.trigger_phrases);
   652	      row.isConstitutional = true;
   653	      return row;
   654	    });
   655	
   656	    if (constitutional_cache.size >= CONSTITUTIONAL_CACHE_MAX_KEYS) {
   657	      const oldestKey = constitutional_cache.keys().next().value;
   658	      if (oldestKey !== undefined) {
   659	        constitutional_cache.delete(oldestKey);
   660	      }
   661	    }
   662	
   663	    refresh_constitutional_cache_db_state();
   664	    constitutional_cache.set(cache_key, { data: results, timestamp: now });
   665	
   666	    return results;
   667	  } finally {
   668	    constitutional_cache_loading.delete(cache_key);
   669	  }
   670	}
   671	
   672	/**
   673	 * Clears cached constitutional memories.
   674	 * @param spec_folder - The optional spec folder cache key to clear.
   675	 * @returns Nothing.
   676	 */
   677	export function clear_constitutional_cache(spec_folder: string | null = null): void {
   678	  if (spec_folder) {
   679	    const scoped_suffix_archived = `::${spec_folder}:arch`;
   680	    const scoped_suffix_live = `::${spec_folder}:noarch`;
   681	    for (const key of [...constitutional_cache.keys()]) {
   682	      if (key.endsWith(scoped_suffix_archived) || key.endsWith(scoped_suffix_live)) {
   683	        constitutional_cache.delete(key);
   684	      }
   685	    }
   686	    for (const key of [...constitutional_cache_loading.keys()]) {
   687	      if (key.endsWith(scoped_suffix_archived) || key.endsWith(scoped_suffix_live)) {
   688	        constitutional_cache_loading.delete(key);
   689	      }
   690	    }
   691	  } else {
   692	    constitutional_cache.clear();
   693	    constitutional_cache_loading.clear();
   694	    last_db_mod_time = 0;
   695	    last_constitutional_cache_db_path = null;
   696	  }
   697	}
   698	
   699	/**
   700	 * Refreshes interference scores for memories in a folder.
   701	 * @param database - The database connection to update.
   702	 * @param specFolder - The spec folder whose scores should be refreshed.
   703	 * @returns Nothing.
   704	 */
   705	export function refresh_interference_scores_for_folder(database: Database.Database, specFolder: string): void {
   706	  if (!specFolder) return;
   707	
   708	  try {
   709	    const rows = database.prepare(
   710	      `SELECT m.id
   711	       FROM memory_index m
   712	       JOIN active_memory_projection p ON p.active_memory_id = m.id
   713	       WHERE m.spec_folder = ?
   714	         AND m.parent_id IS NULL
   715	         AND COALESCE(m.is_archived, 0) = 0
   716	         AND COALESCE(m.importance_tier, 'normal') != 'deprecated'`
   717	    ).all(specFolder) as Array<{ id: number }>;
   718	
   719	    if (rows.length === 0) return;
   720	

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '1724,1742p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1724	      const message = extractionErr instanceof Error ? extractionErr.message : String(extractionErr);
  1725	      throw new Error(`[context-server] Extraction adapter startup failed: ${message}`);
  1726	    }
  1727	
  1728	    // T059: Archival Manager for automatic archival of ARCHIVED state memories
  1729	    try {
  1730	      archivalManager.init(database);
  1731	      // Start background archival job (scans every hour by default)
  1732	      archivalManager.startBackgroundJob();
  1733	      if (archivalManager.isBackgroundJobRunning()) {
  1734	        console.error(`[context-server] Archival manager initialized (background job started)`);
  1735	      } else {
  1736	        console.error(`[context-server] Archival manager initialized (background job: not started)`);
  1737	      }
  1738	    } catch (archivalErr: unknown) {
  1739	      const message = archivalErr instanceof Error ? archivalErr.message : String(archivalErr);
  1740	      console.warn('[context-server] Archival manager failed:', message);
  1741	    }
  1742	

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '700,716p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   700	  meta.sessionPriming = sessionPrimeContext;
   701	}
   702	
   703	async function getMemoryStats(): Promise<DynamicMemoryStats> {
   704	  try {
   705	    const response = await handleMemoryStats({
   706	      folderRanking: 'count',
   707	      includeArchived: true,
   708	      limit: 100,
   709	    });
   710	    const payload = response?.content?.[0]?.text;
   711	    if (typeof payload !== 'string' || payload.length === 0) {
   712	      return { totalMemories: 0, specFolderCount: 0, activeCount: 0, staleCount: 0 };
   713	    }
   714	
   715	    const parsed = JSON.parse(payload) as Record<string, unknown>;
   716	    const data = (parsed.data ?? {}) as Record<string, unknown>;

exec
/bin/zsh -lc "rg -n \"durability|salience|importance_tier|state =|HOT|WARM|COLD|DORMANT|ARCHIVED|is_pinned|importance_weight\" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/handlers | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:331:  if (job.state === 'complete' || job.state === 'failed' || job.state === 'cancelled') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:340:  const summary = cancelled.state === 'cancelled'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:116:  let countSql = 'SELECT COUNT(*) as count FROM memory_index WHERE importance_tier = ?';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:184:  let selectSql = 'SELECT id, content_hash, file_path, spec_folder FROM memory_index WHERE importance_tier = ?';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:156:/** Get tiered content for a memory based on its tier state (HOT=full, WARM=summary, COLD=excluded) */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:161:  if (tier === 'COLD' || tier === 'DORMANT' || tier === 'ARCHIVED') return '';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:167:    if (tier === 'HOT') return content;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:168:    // WARM tier returns truncated summary
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:502:  const coldCount = cognitiveStats?.tierDistribution?.COLD;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:504:    hints.push(`${coldCount} COLD-tier memories excluded for token efficiency`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:223:                importance_weight: typeof r.importance_weight === 'number'
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:224:                  ? r.importance_weight
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:262:                  importance_tier: parsed.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:141:   5. METRICS SNAPSHOT
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:146:  importance_tier?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:218:      importance_tier: parsed.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:247:        SET importance_tier = 'deprecated',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:187:    "AND (m.importance_tier IS NULL OR m.importance_tier != 'deprecated')";
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:108:  const sortColumn = ['created_at', 'updated_at', 'importance_weight'].includes(sortBy)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:131:    const sql = `SELECT id, spec_folder, file_path, title, trigger_phrases, importance_weight, created_at, updated_at FROM memory_index ${whereClause} ORDER BY ${sortColumn} DESC LIMIT ? OFFSET ?`;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:152:    importanceWeight: row.importance_weight,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:573:  importance_tier?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:586:  if ((row.importance_tier?.trim().toLowerCase() ?? 'normal') !== 'normal') {
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:233:        state = 'queued',
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:305:  if (current.state === nextState) {
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:317:      SET state = ?, updated_at = ?
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:318:      WHERE id = ? AND state = ?
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:472:  if (job.state === 'failed') {
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:482:  if (job.state === 'complete') {
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:492:  if (job.state === 'cancelled') {
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:515:  if (job.state === 'queued') {
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:551:  const stateRisk = job.state === 'indexing' ? 0.15 : (job.state === 'embedding' ? 0.1 : 0.05);
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:608:    if (current.state === 'cancelled') return;
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:638:  if (done.state === 'cancelled') return;
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:177:  SELECT id, spec_folder, file_path, title, trigger_phrases, importance_weight
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:367:      importance_weight: number | null;
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:412:          importanceWeight: row.importance_weight || 0.5,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1810:      `(importance_tier IS NULL OR importance_tier NOT IN ('deprecated', 'archived'))`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1823:      SELECT id, title, file_path, importance_tier, importance_weight, spec_folder
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1827:        CASE importance_tier
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1835:        importance_weight DESC,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1850:      importance_tier: row.importance_tier as string,
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:355:  let state = degreeCachePerDb.get(database);
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:357:    state = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:569:      `SELECT id FROM memory_index WHERE id IN (${placeholders}) AND importance_tier = 'constitutional'`
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:176:          importance_weight = ?,
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:212:      SET importance_tier = 'deprecated',
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:280:      importance_tier: parsed.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:291:      SET importance_tier = 'deprecated',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:145:      'SELECT importance_tier, COUNT(*) as count FROM memory_index GROUP BY importance_tier'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:146:    ).all() as { importance_tier: string; count: number }[];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:148:      tierBreakdown[row.importance_tier || 'normal'] = row.count;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:207:          id, spec_folder, file_path, title, importance_weight, importance_tier,
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:131:      'SELECT importance_tier, validation_count, confidence FROM memory_index WHERE id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:133:      importance_tier?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:148:    const tier = (memory.importance_tier || 'normal').toLowerCase();
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:246:        'UPDATE memory_index SET importance_tier = ?, updated_at = ? WHERE id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:298:      SELECT id, importance_tier, validation_count
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:300:      WHERE importance_tier IN ('normal', 'important')
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:304:      importance_tier: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:311:      const tier = row.importance_tier?.toLowerCase() || 'normal';
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:62:  importance_tier?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:94:  'content_hash', 'context_type', 'importance_tier', 'memory_type',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:243:        importance_tier: parsed.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:344:          importance_tier: parsed.importanceTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:507:            importance_tier = ?,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:508:            importance_weight = ?,
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:85:| 2 | Importance tier | 0.9 | `importance_tier: constitutional` -> meta-cognitive |
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:255:  const importance_tier = extractImportanceTier(content, { documentType });
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:266:    importanceTier: importance_tier,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:278:    importanceTier: importance_tier,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:639:  const yamlMatch = frontmatter?.match(/(?:importance_tier|importanceTier):\s*["']?(\w+)["']?/i);
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:41:const BM25_WARMUP_BATCH_SIZE = 250;
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:446:        const batchIds = pendingIds.splice(0, BM25_WARMUP_BATCH_SIZE);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:119:  importance_tier?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:515:    minState,  // No default — memoryState column not yet in schema; defaulting to 'WARM' filters all rows
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:833:              SELECT id, title, similarity, content, file_path, importance_tier, context_type,
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:31:  source: 'frontmatter_explicit' | 'importance_tier' | 'file_path' | 'keywords' | 'default';
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:52:  importance_tier?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:129:  // Check for importance_tier in frontmatter
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:130:  const tierMatch = content.match(/(?:importance_tier|importanceTier):\s*["']?(\w+)["']?/i);
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:251:      source: 'importance_tier',
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:260:      source: 'importance_tier',
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:304:      importanceTier: memory.importanceTier || memory.importance_tier,
.opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts:321:  importance_tier: 'Derived from importance_tier field mapping',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:430:          SELECT id, title, spec_folder, importance_tier, importance_weight,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:450:              SELECT id, title, spec_folder, importance_tier, created_at
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:42:  importance_tier?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:165:      .map(r => r.importance_tier)
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:248:  const warmResults = results.filter(r => r.memoryState === 'WARM' || r.memoryState === 'HOT');
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:265:    r => r.memoryState === 'COLD' || r.memoryState === 'ARCHIVED'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:249:  const state = detectState(rootDir);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:348:    const state = detectState(rootDir);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:63:│  Tier Classifier ───→ State = HOT (R > 0.80)                     │
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:71:│  Tier Classifier ───→ State = WARM → COLD → DORMANT              │
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:73:│  Archival Manager ──→ After 90 days → ARCHIVED                  │
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:89:| **5-State Model**            | HOT/WARM/COLD/DORMANT/ARCHIVED with thresholds                                        | Progressive memory transitions       |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:147:| **HOT**      | R >= 0.80            | Recently accessed | Full content  | 0-2 days    |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:148:| **WARM**     | R >= 0.25            | Recently relevant | Summary only  | 3-14 days   |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:149:| **COLD**     | R >= 0.05            | Fading            | Metadata only | 15-60 days  |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:150:| **DORMANT**  | R >= 0.02            | Nearly forgotten  | Metadata only | 60-90 days  |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:151:| **ARCHIVED** | R < 0.02 OR 90+ days | Long-term storage | Not loaded    | 90+ days    |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:155:NEW MEMORY → HOT (R = 1.0)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:157:  WARM (R = 0.60)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:159:  COLD (R = 0.15)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:161:  DORMANT (R = 0.03)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:163:  ARCHIVED
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:166:[Any state] → HOT (R = 1.0) + Stability boost
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:351:const state = classifyState(0.65, 5);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:352:// state = 'WARM' (R >= 0.25 but < 0.80)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:360:// classification = { state: 'WARM', retrievability: 0.65, effectiveHalfLife: 60 }
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:363:const hotMemories = getStateContent(allMemories, 'HOT', 5);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:364:// hotMemories = { state: 'HOT', memories: [...], count: N }
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:366:// Filter with tier-specific limits (max 5 HOT + max 10 WARM)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:371:// stats = { HOT: 3, WARM: 8, COLD: 12, DORMANT: 4, ARCHIVED: 20, total: 47 }
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:376:HOT_THRESHOLD=0.80      # Default: 0.80
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:377:WARM_THRESHOLD=0.25     # Default: 0.25
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:378:COLD_THRESHOLD=0.05     # Default: 0.05
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:379:ARCHIVED_DAYS_THRESHOLD=90  # Default: 90 days
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:482:// Uses memory.importance_tier for decay rate
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:670:// candidates = [{ id, title, spec_folder, file_path, created_at, importance_tier, access_count, confidence, reason }]
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:803:    db.prepare('UPDATE memory_index SET importance_tier = ? WHERE id = ?')
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:931:**Symptom**: Memory shows COLD but was recently accessed
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:956:| State always COLD    | Use `activateMemoryWithFsrs()` (updates last_review)         |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:1046:| `HOT_THRESHOLD`           | 0.80    | Retrievability threshold for HOT state  |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:1047:| `WARM_THRESHOLD`          | 0.25    | Retrievability threshold for WARM state |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:1048:| `COLD_THRESHOLD`          | 0.05    | Retrievability threshold for COLD state |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:1049:| `ARCHIVED_DAYS_THRESHOLD` | 90      | Days inactive before archival           |
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:42:  importance_tier?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:105: * - Positive validations can trigger auto-promotion (`importance_tier` changes),
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:114:        SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:150:        memory.importance_tier,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:209:      SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:217:    if (memory.importance_tier === 'critical' || memory.importance_tier === 'constitutional') {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:226:    return isPromotionEligible(memory.importance_tier, confidence, positiveValidationCount);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:240:        SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:247:      if (memory.importance_tier === 'critical' || memory.importance_tier === 'constitutional') {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:264:      SET importance_tier = 'critical', updated_at = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:286:      SELECT confidence, validation_count, importance_tier FROM memory_index WHERE id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:303:      importanceTier: memory.importance_tier || 'normal',
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:304:      promotionEligible: isPromotionEligible(memory.importance_tier, confidence, positiveValidationCount),
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:163:  return results.filter((row) => row.importance_tier === tier);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:967:    candidates = candidates.filter((r) => r.importance_tier === tier);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1022:      (r) => r.importance_tier === 'constitutional'
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1068:      (r) => r.importance_tier !== 'constitutional'
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1240:                `SELECT id, title, spec_folder, file_path, importance_tier, importance_weight, quality_score, created_at, is_archived, context_type, tenant_id, user_id, agent_id, session_id, shared_space_id FROM memory_index WHERE id IN (${placeholders})`
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:44:  importance_weight?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:53:  importance_tier?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:58:  is_pinned?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:82:  importance_tier?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:83:  importance_weight?: number;
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:94:  - `attention-decay.ts` — time/usage decay utilities used to age memory salience.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:246:    String(memory.importance_tier || memory.importanceTier || 'normal'),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:247:    memory.importance_weight as number | undefined
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:308:        AND (importance_tier IS NULL OR importance_tier NOT IN ('deprecated'))
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:309:      ORDER BY last_accessed DESC, importance_weight DESC
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:39:  HOT: 0.80,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:40:  WARM: 0.25,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:41:  COLD: 0.05,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:42:  DORMANT: 0.02,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:45:const ARCHIVED_DAYS_THRESHOLD = 90;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:61:  hotThreshold: parseThreshold('HOT_THRESHOLD', STATE_THRESHOLDS.HOT),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:62:  warmThreshold: parseThreshold('WARM_THRESHOLD', STATE_THRESHOLDS.WARM),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:63:  coldThreshold: parseThreshold('COLD_THRESHOLD', STATE_THRESHOLDS.COLD),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:64:  archivedDaysThreshold: parseLimit('ARCHIVED_DAYS_THRESHOLD', ARCHIVED_DAYS_THRESHOLD),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:65:  maxHotMemories: parseLimit('MAX_HOT_MEMORIES', 5),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:66:  maxWarmMemories: parseLimit('MAX_WARM_MEMORIES', 10),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:67:  maxColdMemories: parseLimit('MAX_COLD_MEMORIES', 3),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:68:  maxDormantMemories: parseLimit('MAX_DORMANT_MEMORIES', 2),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:69:  maxArchivedMemories: parseLimit('MAX_ARCHIVED_MEMORIES', 1),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:73:// Validate threshold ordering (HOT > WARM > COLD)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:75:  console.warn('[tier-classifier] Invalid thresholds: HOT must be > WARM. Using defaults.');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:76:  TIER_CONFIG.hotThreshold = STATE_THRESHOLDS.HOT;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:77:  TIER_CONFIG.warmThreshold = STATE_THRESHOLDS.WARM;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:80:  console.warn('[tier-classifier] Invalid thresholds: WARM must be > COLD. Using defaults.');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:81:  TIER_CONFIG.warmThreshold = STATE_THRESHOLDS.WARM;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:82:  TIER_CONFIG.coldThreshold = STATE_THRESHOLDS.COLD;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:89:type TierState = 'HOT' | 'WARM' | 'COLD' | 'DORMANT' | 'ARCHIVED';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:100:  HOT: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:101:  WARM: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:102:  COLD: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:103:  DORMANT: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:104:  ARCHIVED: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:186:  const tier = memory.importance_tier;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:236: *   - null/undefined: returns 'DORMANT'
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:246:    return 'DORMANT';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:273:    return 'DORMANT';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:276:  // ARCHIVED requires BOTH conditions: old age AND very low retrievability
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:279:  if (days > TIER_CONFIG.archivedDaysThreshold && r < STATE_THRESHOLDS.DORMANT) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:280:    return 'ARCHIVED';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:282:  if (r >= TIER_CONFIG.hotThreshold) return 'HOT';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:283:  if (r >= TIER_CONFIG.warmThreshold) return 'WARM';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:284:  if (r >= TIER_CONFIG.coldThreshold) return 'COLD';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:285:  return 'DORMANT';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:300:  // If no decay (constitutional/critical), always HOT
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:302:    return { state: 'HOT', retrievability: 1.0, effectiveHalfLife: null };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:305:  // Pinned memories are always HOT
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:306:  if (memory.is_pinned === 1) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:307:    return { state: 'HOT', retrievability: 1.0, effectiveHalfLife };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:326:  const state = classifyState(retrievability, elapsedDays);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:348:    .filter(m => m._classification.state === targetState)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:365:  HOT: TIER_CONFIG.maxHotMemories,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:366:  WARM: TIER_CONFIG.maxWarmMemories,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:367:  COLD: TIER_CONFIG.maxColdMemories,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:368:  DORMANT: TIER_CONFIG.maxDormantMemories,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:369:  ARCHIVED: TIER_CONFIG.maxArchivedMemories,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:373:const TIER_PRIORITY: TierState[] = ['HOT', 'WARM', 'COLD', 'DORMANT', 'ARCHIVED'];
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:381: * (HOT: 5, WARM: 10, COLD: 3, DORMANT: 2, ARCHIVED: 1 by default).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:400:    classified = classified.filter((entry) => entry.classification.state === targetState);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:407:      HOT: [], WARM: [], COLD: [], DORMANT: [], ARCHIVED: [],
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:410:      const state = entry.classification.state;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:477:    HOT: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:478:    WARM: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:479:    COLD: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:480:    DORMANT: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:481:    ARCHIVED: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:500:  if (memory.importance_tier === 'constitutional' || memory.importance_tier === 'critical') {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:505:  if (memory.is_pinned === 1) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:509:  return state === 'ARCHIVED' || state === 'DORMANT';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:519:  ARCHIVED_DAYS_THRESHOLD,

exec
/bin/zsh -lc "rg -n \"retention_sweep|delete_after|deleteAfter|retentionPolicy|ephemeral\" .opencode/skill/system-spec-kit/mcp_server | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/README.md:710:| `retentionPolicy` | string | `keep` (default), `ephemeral`, `shared` |
.opencode/skill/system-spec-kit/mcp_server/README.md:711:| `deleteAfter` | string | ISO date for automatic deletion |
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:220:  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:195:  retentionPolicy: z.enum(['keep', 'ephemeral', 'shared']).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:196:  deleteAfter: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:466:  memory_save: ['filePath', 'force', 'dryRun', 'skipPreflight', 'asyncEmbedding', 'tenantId', 'userId', 'agentId', 'sessionId', 'sharedSpaceId', 'provenanceSource', 'provenanceActor', 'governedAt', 'retentionPolicy', 'deleteAfter'],
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:30:      delete_after TEXT
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:139:  retentionPolicy?: 'keep' | 'ephemeral' | 'shared';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:140:  deleteAfter?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:170:  delete_after?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:164:  retentionPolicy?: 'keep' | 'ephemeral' | 'shared';
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:165:  deleteAfter?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:94:  sessionScope: 'caller' | 'ephemeral';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1241:    sessionScope: requestedSessionId ? 'caller' : 'ephemeral',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:160:      action: 'retention_sweep',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:165:      reason: 'delete_after_expired',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1114:    retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1115:    deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1145:    retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1146:    deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1471:        metadata: { filePath: validatedPath, retentionPolicy: governanceDecision.normalized.retentionPolicy },
.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/sample-memories.json:59:      "content": "Tier 1 memories are ephemeral and decay within 24 hours",
.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/similarity-test-cases.json:88:      "a": "Tier 1 ephemeral memories",
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:516:    it('T027k: missing sessionId generates ephemeral UUID scope', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:522:        'T027k-ephemeral'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:526:      expect(parsed.meta.sessionLifecycle.sessionScope).toBe('ephemeral');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:16:export type RetentionPolicy = 'keep' | 'ephemeral' | 'shared';
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:36:  retentionPolicy?: RetentionPolicy;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:37:  deleteAfter?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:53:  retentionPolicy: RetentionPolicy;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:54:  deleteAfter: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:207:    || input.retentionPolicy === 'ephemeral'
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:208:    || input.retentionPolicy === 'shared'
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:209:    || typeof input.deleteAfter === 'string';
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:222:  const deleteAfter = normalizeIsoTimestamp(input.deleteAfter) ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:223:  const retentionPolicy: RetentionPolicy = input.retentionPolicy === 'ephemeral' || input.retentionPolicy === 'shared'
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:224:    ? input.retentionPolicy
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:243:        retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:244:        deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:255:  if (deleteAfter && new Date(deleteAfter).getTime() <= new Date(governedAt).getTime()) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:256:    issues.push('deleteAfter must be later than governedAt');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:258:  // H21 FIX: Require valid future deleteAfter for ephemeral retention policy
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:259:  // Without this, ephemeral rows are never swept since sweeps key off delete_after
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:260:  if (retentionPolicy === 'ephemeral' && !deleteAfter) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:261:    issues.push('deleteAfter is required for ephemeral retention policy');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:277:      retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:278:      deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:299:    retention_policy: decision.normalized.retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:300:    delete_after: decision.normalized.deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:310:      retentionPolicy: decision.normalized.retentionPolicy,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:311:      deleteAfter: decision.normalized.deleteAfter,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:9:// Domain (ephemeral session attention vs persistent memory scoring).
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:459:| Temporary | Yes (fast) | 0.5x | Session-specific, ephemeral |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:240: * constitutional = slowest decay (most persistent), scratch = fastest decay (ephemeral).
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:45:  delete_after?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:62:  'governed_at', 'retention_policy', 'delete_after', 'governance_metadata',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:928:    delete_after: existingRow.delete_after,
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:13:// STORAGE: In-memory only (ephemeral by design, no SQLite persistence).
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:70: * Sessions are ephemeral — they exist only in process memory and are not
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1422:    { name: 'delete_after', sql: 'ALTER TABLE memory_index ADD COLUMN delete_after TEXT' },
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1468:      CREATE INDEX IF NOT EXISTS idx_memory_retention_delete_after
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1469:        ON memory_index(delete_after);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2334:      delete_after TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:978:  // passed an ephemeral sessionId, because memories don't have session-scoped access.

codex
I’ve now got the live retrieval and lifecycle hooks that make migration risky: archived-row filtering, deferred vector rebuilds, governed expiry rules, validation-driven ranking, and Public’s existing compaction transport. I’m doing one last pass on tier-state versus permanence so the risk matrix doesn’t accidentally collapse separate concepts into a single flag.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts | sed -n '276,308p;496,510p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   287	
   288	/**
   289	 * Classify a memory's importance tier based on its properties.
   290	 */
   291	function classifyTier(memory: TierInput): {
   292	  state: TierState;
   293	  retrievability: number;
   294	  effectiveHalfLife: number | null;
   295	} {
   296	  const stability = memory.stability ?? 1.0;
   297	  const lastReview = memory.last_review || memory.created_at;
   298	  const effectiveHalfLife = getEffectiveHalfLife(memory);
   299	
   300	  // If no decay (constitutional/critical), always HOT
   301	  if (effectiveHalfLife === null) {
   302	    return { state: 'HOT', retrievability: 1.0, effectiveHalfLife: null };
   303	  }
   304	
   305	  // Pinned memories are always HOT
   306	  if (memory.is_pinned === 1) {
   307	    return { state: 'HOT', retrievability: 1.0, effectiveHalfLife };
   308	  }
   496	function shouldArchive(memory: TierInput): boolean {
   497	  const { state } = classifyTier(memory);
   498	
   499	  // Never archive constitutional or critical
   500	  if (memory.importance_tier === 'constitutional' || memory.importance_tier === 'critical') {
   501	    return false;
   502	  }
   503	
   504	  // Pinned memories are never archived
   505	  if (memory.is_pinned === 1) {
   506	    return false;
   507	  }
   508	
   509	  return state === 'ARCHIVED' || state === 'DORMANT';
   510	}

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '156,170p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/README.md | sed -n '706,722p;816,830p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   816	##### `memory_validate`
   817	
   818	Tell the system whether a search result was helpful. Helpful results get a confidence boost so they show up more often. Unhelpful results get demoted. Over time, the system learns which memories are genuinely useful, like training a recommendation engine with thumbs-up and thumbs-down.
   819	
   820	| Parameter | Type | Notes |
   821	|-----------|------|-------|
   822	| `id` | number | **Required.** Memory ID to validate |
   823	| `wasUseful` | boolean | **Required.** Was this memory helpful? |
   824	| `queryId` | string | Query that retrieved this memory |
   825	| `resultRank` | number | Position in results where this appeared |
   826	| `notes` | string | Why it was or was not useful |
   827	
   828	---
   829	
   830	##### `memory_bulk_delete`

exec
/bin/zsh -lc "nl -ba .opencode/plugins/spec-kit-compact-code-graph-bridge.mjs | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "compaction|payloadKind|transportOnly|structural|resume" .opencode/plugins/spec-kit-compact-code-graph-bridge.mjs .opencode/plugins/spec-kit-compact-code-graph.js' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	#!/usr/bin/env node
     2	
     3	import { handleSessionResume } from '../skill/system-spec-kit/mcp_server/dist/handlers/session-resume.js';
     4	import * as vectorIndex from '../skill/system-spec-kit/mcp_server/dist/lib/search/vector-index.js';
     5	import * as sessionManager from '../skill/system-spec-kit/mcp_server/dist/lib/session/session-manager.js';
     6	
     7	function parseArgs(argv) {
     8	  const options = {
     9	    minimal: false,
    10	    specFolder: undefined,
    11	  };
    12	
    13	  for (let index = 0; index < argv.length; index += 1) {
    14	    const value = argv[index];
    15	    if (value === '--minimal') {
    16	      options.minimal = true;
    17	      continue;
    18	    }
    19	    if (value === '--spec-folder') {
    20	      const nextValue = argv[index + 1];
    21	      if (typeof nextValue === 'string' && nextValue.trim()) {
    22	        options.specFolder = nextValue.trim();
    23	        index += 1;
    24	      }
    25	    }
    26	  }
    27	
    28	  return options;
    29	}
    30	
    31	function ensureRuntimeReady() {
    32	  vectorIndex.initializeDb();
    33	  const database = vectorIndex.getDb();
    34	  if (!database) {
    35	    throw new Error('Database not initialized after initializeDb()');
    36	  }
    37	
    38	  const sessionInit = sessionManager.init(database);
    39	  if (!sessionInit.success) {
    40	    throw new Error(sessionInit.error || 'Session manager initialization failed');
    41	  }
    42	}
    43	
    44	async function withStdoutSilenced(fn) {
    45	  const forwarded = (method) => (...args) => {
    46	    const rendered = args
    47	      .map((value) => (typeof value === 'string' ? value : JSON.stringify(value)))
    48	      .join(' ');
    49	    process.stderr.write(`${rendered}\n`);
    50	  };
    51	
    52	  const original = {
    53	    log: console.log,
    54	    info: console.info,
    55	    debug: console.debug,
    56	    warn: console.warn,
    57	  };
    58	
    59	  console.log = forwarded('log');
    60	  console.info = forwarded('info');
    61	  console.debug = forwarded('debug');
    62	  console.warn = forwarded('warn');
    63	
    64	  try {
    65	    return await fn();
    66	  } finally {
    67	    console.log = original.log;
    68	    console.info = original.info;
    69	    console.debug = original.debug;
    70	    console.warn = original.warn;
    71	  }
    72	}
    73	
    74	async function main() {
    75	  const args = parseArgs(process.argv.slice(2));
    76	  const response = await withStdoutSilenced(async () => {
    77	    ensureRuntimeReady();
    78	    return await handleSessionResume({
    79	      ...(args.specFolder ? { specFolder: args.specFolder } : {}),
    80	      ...(args.minimal ? { minimal: true } : {}),
    81	    });
    82	  });
    83	
    84	  const text = response?.content?.[0]?.text;
    85	  if (typeof text !== 'string' || !text.trim()) {
    86	    throw new Error('Bridge did not receive a text response from handleSessionResume()');
    87	  }
    88	
    89	  process.stdout.write(text);
    90	}
    91	
    92	main().catch((error) => {
    93	  const message = error instanceof Error ? error.message : String(error);
    94	  process.stderr.write(`[spec-kit-compact-code-graph-bridge] ${message}\n`);
    95	  process.exitCode = 1;
    96	});

 succeeded in 0ms:
.opencode/plugins/spec-kit-compact-code-graph.js:59: *   payloadKind: string,
.opencode/plugins/spec-kit-compact-code-graph.js:68: *   transportOnly: true,
.opencode/plugins/spec-kit-compact-code-graph.js:77: *   compaction?: TransportBlock,
.opencode/plugins/spec-kit-compact-code-graph.js:136:    if (plan.transportOnly !== true || !Array.isArray(plan.messagesTransform)) {
.opencode/plugins/spec-kit-compact-code-graph.js:308:            `resume_mode=${RESUME_MODE}`,
.opencode/plugins/spec-kit-compact-code-graph.js:406:      const block = plan?.compaction;
.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs:3:import { handleSessionResume } from '../skill/system-spec-kit/mcp_server/dist/handlers/session-resume.js';

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

exec
/bin/zsh -lc 'rg -n "opencodeTransport|compaction|transportOnly|messagesTransform|retrievalPolicyOwner" .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts .opencode/skill/system-spec-kit/mcp_server/dist/handlers/session-resume.js' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:114:  opencodeTransport?: OpenCodeTransportPlan;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:590:    opencodeTransport: buildOpenCodeTransportPlan({
.opencode/skill/system-spec-kit/mcp_server/dist/handlers/session-resume.js:370:        opencodeTransport: buildOpenCodeTransportPlan({

 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Session Resume Handler
     3	// ───────────────────────────────────────────────────────────────
     4	// Phase 020: Composite MCP tool that merges memory resume context,
     5	// code graph status, and CocoIndex availability into a single call.
     6	
     7	import { createHash } from 'node:crypto';
     8	import { statSync } from 'node:fs';
     9	import { isCocoIndexAvailable } from '../lib/utils/cocoindex-path.js';
    10	import { handleMemoryContext } from './memory-context.js';
    11	import * as graphDb from '../lib/code-graph/code-graph-db.js';
    12	import { getGraphFreshness, type GraphFreshness } from '../lib/code-graph/ensure-ready.js';
    13	import { computeQualityScore, recordMetricEvent, recordBootstrapEvent } from '../lib/session/context-metrics.js';
    14	import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
    15	import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
    16	import {
    17	  buildStructuralContextTrust,
    18	  createSharedPayloadEnvelope,
    19	  summarizeUnknown,
    20	  summarizeCertaintyContract,
    21	  trustStateFromStructuralStatus,
    22	  type SharedPayloadCertainty,
    23	  type SharedPayloadEnvelope,
    24	  type SharedPayloadSection,
    25	} from '../lib/context/shared-payload.js';
    26	import {
    27	  buildOpenCodeTransportPlan,
    28	  type OpenCodeTransportPlan,
    29	} from '../lib/context/opencode-transport.js';
    30	import {
    31	  buildCodeGraphOpsContract,
    32	  type CodeGraphOpsContract,
    33	} from '../lib/code-graph/ops-hardening.js';
    34	import { loadMostRecentState, type HookProducerMetadata, type HookState } from '../hooks/claude/hook-state.js';
    35	import type { MCPResponse } from '@spec-kit/shared/types';
    36	
    37	/* ───────────────────────────────────────────────────────────────
    38	   1. TYPES
    39	──────────────────────────────────────────────────────────────── */
    40	
    41	export const CACHED_SESSION_SUMMARY_SCHEMA_VERSION = 1;
    42	export const CACHED_SESSION_SUMMARY_MAX_AGE_MS = 30 * 60 * 1000;
    43	
    44	export interface CachedSessionSummaryCandidate {
    45	  schemaVersion: number;
    46	  lastSpecFolder: string | null;
    47	  summaryText: string | null;
    48	  extractedAt: string | null;
    49	  stateUpdatedAt: string | null;
    50	  producerMetadata: HookProducerMetadata | null;
    51	}
    52	
    53	export interface CachedSessionSummary {
    54	  schemaVersion: number;
    55	  lastSpecFolder: string;
    56	  summaryText: string;
    57	  extractedAt: string;
    58	  lastClaudeTurnAt: string;
    59	  transcriptPath: string;
    60	  transcriptFingerprint: string;
    61	  cacheCreationInputTokens: number;
    62	  cacheReadInputTokens: number;
    63	  continuityText: string;
    64	  startupHint: string;
    65	}
    66	
    67	export interface CachedSessionSummaryDecision {
    68	  status: 'accepted' | 'rejected';
    69	  category: 'accepted' | 'fidelity' | 'freshness';
    70	  reason:
    71	    | 'accepted'
    72	    | 'missing_state'
    73	    | 'schema_version_mismatch'
    74	    | 'missing_summary'
    75	    | 'missing_producer_metadata'
    76	    | 'missing_required_fields'
    77	    | 'transcript_unreadable'
    78	    | 'transcript_identity_mismatch'
    79	    | 'stale_summary'
    80	    | 'summary_precedes_producer_turn'
    81	    | 'scope_mismatch'
    82	    | 'unknown_scope';
    83	  detail: string;
    84	  cachedSummary: CachedSessionSummary | null;
    85	}
    86	
    87	interface SessionResumeArgs {
    88	  specFolder?: string;
    89	  sessionId?: string;
    90	  minimal?: boolean;
    91	}
    92	
    93	interface CodeGraphStatus {
    94	  status: 'fresh' | 'stale' | 'empty' | 'error';
    95	  lastScan: string | null;
    96	  nodeCount: number;
    97	  edgeCount: number;
    98	  fileCount: number;
    99	}
   100	
   101	interface CocoIndexStatus {
   102	  available: boolean;
   103	  binaryPath: string;
   104	}
   105	
   106	interface SessionResumeResult {
   107	  memory: Record<string, unknown>;
   108	  codeGraph: CodeGraphStatus;
   109	  cocoIndex: CocoIndexStatus;
   110	  cachedSummary?: CachedSessionSummaryDecision;
   111	  structuralContext?: StructuralBootstrapContract;
   112	  sessionQuality?: 'healthy' | 'degraded' | 'critical' | 'unknown';
   113	  payloadContract?: SharedPayloadEnvelope;
   114	  opencodeTransport?: OpenCodeTransportPlan;
   115	  graphOps?: CodeGraphOpsContract;
   116	  hints: string[];
   117	}
   118	
   119	/* ───────────────────────────────────────────────────────────────
   120	   2. HELPERS
   121	──────────────────────────────────────────────────────────────── */
   122	
   123	function normalizeSpecFolder(specFolder: string | null | undefined): string | null {
   124	  if (typeof specFolder !== 'string') {
   125	    return null;
   126	  }
   127	
   128	  const trimmed = specFolder.trim();
   129	  if (trimmed.length === 0) {
   130	    return null;
   131	  }
   132	
   133	  return trimmed.replace(/^\.opencode\//, '');
   134	}
   135	
   136	function parseIsoMs(value: string | null | undefined): number | null {
   137	  if (typeof value !== 'string' || value.trim().length === 0) {
   138	    return null;
   139	  }
   140	
   141	  const parsed = Date.parse(value);
   142	  return Number.isNaN(parsed) ? null : parsed;
   143	}
   144	
   145	function isFiniteNonNegativeNumber(value: unknown): value is number {
   146	  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
   147	}
   148	
   149	function buildTranscriptFingerprint(
   150	  transcriptPath: string,
   151	  sizeBytes: number,
   152	  modifiedAtMs: number,
   153	): string {
   154	  return createHash('sha256')
   155	    .update(`${transcriptPath}:${sizeBytes}:${modifiedAtMs}`)
   156	    .digest('hex')
   157	    .slice(0, 16);
   158	}
   159	
   160	function rejectCachedSummary(
   161	  category: 'fidelity' | 'freshness',
   162	  reason: CachedSessionSummaryDecision['reason'],
   163	  detail: string,
   164	): CachedSessionSummaryDecision {
   165	  return {
   166	    status: 'rejected',
   167	    category,
   168	    reason,
   169	    detail,
   170	    cachedSummary: null,
   171	  };
   172	}
   173	
   174	export function buildCachedSessionSummaryCandidate(
   175	  state: HookState | null,
   176	): CachedSessionSummaryCandidate | null {
   177	  if (!state) {
   178	    return null;
   179	  }
   180	
   181	  return {
   182	    schemaVersion: CACHED_SESSION_SUMMARY_SCHEMA_VERSION,
   183	    lastSpecFolder: state.lastSpecFolder,
   184	    summaryText: state.sessionSummary?.text ?? null,
   185	    extractedAt: state.sessionSummary?.extractedAt ?? null,
   186	    stateUpdatedAt: state.updatedAt,
   187	    producerMetadata: state.producerMetadata,
   188	  };
   189	}
   190	
   191	export function evaluateCachedSessionSummaryCandidate(
   192	  candidate: CachedSessionSummaryCandidate | null,
   193	  options: {
   194	    specFolder?: string;
   195	    nowMs?: number;
   196	    maxAgeMs?: number;
   197	  } = {},
   198	): CachedSessionSummaryDecision {
   199	  if (!candidate) {
   200	    return rejectCachedSummary('fidelity', 'missing_state', 'No recent hook state was available for cached continuity reuse.');
   201	  }
   202	
   203	  if (candidate.schemaVersion !== CACHED_SESSION_SUMMARY_SCHEMA_VERSION) {
   204	    return rejectCachedSummary(
   205	      'fidelity',
   206	      'schema_version_mismatch',
   207	      `Expected schema version ${CACHED_SESSION_SUMMARY_SCHEMA_VERSION} but received ${String(candidate.schemaVersion)}.`,
   208	    );
   209	  }
   210	
   211	  const summaryText = candidate.summaryText?.trim() ?? '';
   212	  if (summaryText.length === 0 || parseIsoMs(candidate.extractedAt) === null) {
   213	    return rejectCachedSummary(
   214	      'fidelity',
   215	      'missing_summary',
   216	      'Cached continuity requires a non-empty session summary with a valid extractedAt timestamp.',
   217	    );
   218	  }
   219	
   220	  const producerMetadata = candidate.producerMetadata;
   221	  if (!producerMetadata) {
   222	    return rejectCachedSummary(
   223	      'fidelity',
   224	      'missing_producer_metadata',
   225	      'Producer metadata from packet 002 was missing, so cached continuity cannot be trusted.',
   226	    );
   227	  }
   228	
   229	  const transcript = producerMetadata.transcript;
   230	  const cacheTokens = producerMetadata.cacheTokens;
   231	  const producerTurnMs = parseIsoMs(producerMetadata.lastClaudeTurnAt);
   232	  if (
   233	    producerTurnMs === null
   234	    || !transcript
   235	    || typeof transcript.path !== 'string'
   236	    || transcript.path.trim().length === 0
   237	    || typeof transcript.fingerprint !== 'string'
   238	    || transcript.fingerprint.trim().length === 0
   239	    || !isFiniteNonNegativeNumber(transcript.sizeBytes)
   240	    || parseIsoMs(transcript.modifiedAt) === null
   241	    || !cacheTokens
   242	    || !isFiniteNonNegativeNumber(cacheTokens.cacheCreationInputTokens)
   243	    || !isFiniteNonNegativeNumber(cacheTokens.cacheReadInputTokens)
   244	  ) {
   245	    return rejectCachedSummary(
   246	      'fidelity',
   247	      'missing_required_fields',
   248	      'Producer metadata was missing required transcript identity or cache token fields.',
   249	    );
   250	  }
   251	
   252	  let transcriptStat: ReturnType<typeof statSync>;
   253	  try {
   254	    transcriptStat = statSync(transcript.path);
   255	  } catch (error: unknown) {
   256	    const message = error instanceof Error ? error.message : String(error);
   257	    return rejectCachedSummary(
   258	      'fidelity',
   259	      'transcript_unreadable',
   260	      `Transcript identity could not be confirmed because the transcript was unreadable: ${message}`,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '560,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "rg -n \"function buildOpenCodeTransportPlan|compaction|messagesTransform|retrievalPolicyOwner|transportOnly\" .opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
5:// contracts to OpenCode-oriented startup, message, and compaction blocks.
28:  transportOnly: true;
29:  retrievalPolicyOwner: 'runtime';
36:  messagesTransform: OpenCodeTransportBlock[];
37:  compaction?: OpenCodeTransportBlock;
82:export function buildOpenCodeTransportPlan(args: {
87:  compactionPayload?: SharedPayloadEnvelope | null;
95:    args.compactionPayload?.kind,
102:  const compactionPayload = args.compactionPayload ?? args.resumePayload ?? args.bootstrapPayload ?? null;
106:    transportOnly: true,
107:    retrievalPolicyOwner: 'runtime',
130:    messagesTransform: messagePayloads.map((payload, index) => ({
140:    ...(compactionPayload
142:        compaction: {
145:          payloadKind: compactionPayload.kind,
146:          dedupeKey: `compaction:${compactionPayload.kind}`,
148:            compactionPayload,
149:            'Inject this as the continuity note across compaction. Keep it separate from current-turn retrieval.',
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts | sed -n '150,172p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '260,276p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   260	
   261	### keywords
   262	
   263	- 006-memory-duplication-reduction, PR-12 wrapper contract, PR-13 optional migration, no new research, collector/workflow/template/reviewer surfaces, Phase 7 parity audits
   264	
   265	## User preferences
   266	
   267	- when asked “So what is the plan regarding tackling memory redundancy as research in 006,” the user wanted the answer tied directly to the Phase 6 spec plus completed research packet, not a new investigative pass [Task 2]
   268	- the user repeatedly insisted memory artifacts should be “a compact continuity wrapper, not a second narrative,” with long-form meaning kept in `decision-record.md` and `implementation-summary.md` [Task 1]
   269	
   270	## Reusable knowledge
   271	
   272	- redundancy-driven closeout edits were intentionally constrained to `002`/`003` proximity surfaces (`implementation-summary.md` and closeout task line), preserving canonical narrative ownership in decision/summary docs [Task 1]
   273	- validated boundary language now used in closeouts: persisted memory file is the compact wrapper; canonical docs remain long-form owners; keep replay-safe delivery wording in implementation summaries [Task 1]
   274	- Phase 6 is a bounded implementation follow-on to completed `001/.../006-research-memory-redundancy`; execute wrapper/ownership changes on collector/workflow/template/reviewer surfaces and keep Phase 7 for downstream parity audits [Task 2]
   275	- Task sheet drift note: `003/.../006-memory-duplication-reduction/tasks.md` still reflects the older research wave; treat PR-12 implementation as primary and PR-13 migration as optional only if wrapper rollout is evidence-justified [Task 2]
   276	

exec
/bin/zsh -lc "rg -n \"isUsageRankingEnabled|usage ranking|SPECKIT_USAGE|trackAccess|trackAccess\" .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/mcp_server/handlers | sed -n '1,160p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:108:5. Testing effect — FSRS strengthening write-back (opt-in via `trackAccess`)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:202:  trackAccess?: boolean; // opt-in access tracking (default false)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519:    trackAccess: trackAccess = false, // opt-in, off by default
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:801:      trackAccess,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:635: * Default: TRUE (graduated). Set SPECKIT_USAGE_RANKING=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:637:export function isUsageRankingEnabled(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:638:  return isFeatureEnabled('SPECKIT_USAGE_RANKING');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:87:- FSRS testing effect fires only when `trackAccess` is explicitly true.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:152:  trackAccess: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:14://     - FSRS write-back to memory_index (when trackAccess=true) — DB write
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:28:// 3.  Testing effect          — FSRS strengthening write-back (trackAccess)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:73:  isUsageRankingEnabled,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:785:  if (!isUsageRankingEnabled() || !Array.isArray(results) || results.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:835:    console.warn(`[stage2-fusion] usage ranking failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:843: * Called only when `trackAccess` is true (P3-09 FIX: explicit opt-in to avoid
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:936: *   3.  Testing effect     (all types, when trackAccess = true)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1174:  if (isUsageRankingEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1180:      console.warn(`[stage2-fusion] usage ranking skipped (db unavailable): ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1195:  // P3-09 FIX: Only when explicitly opted in via trackAccess.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1198:  if (config.trackAccess) {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts | sed -n '632,642p' && nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '198,205p;515,521p' && nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '843,852p;1190,1202p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   632	
   633	/**
   634	 * Phase D T036: Usage-weighted ranking signal.
   635	 * Default: TRUE (graduated). Set SPECKIT_USAGE_RANKING=false to disable.
   636	 */
   637	export function isUsageRankingEnabled(): boolean {
   638	  return isFeatureEnabled('SPECKIT_USAGE_RANKING');
   639	}
   640	
   641	/**
   642	 * Phase D T036: Ontology-guided extraction validation hooks.
   198	  minState?: string;
   199	  applyStateLimits?: boolean;
   200	  rerank?: boolean;
   201	  applyLengthPenalty?: boolean;
   202	  trackAccess?: boolean; // opt-in access tracking (default false)
   203	  includeArchived?: boolean; // REQ-206: include archived memories in search (default false)
   204	  enableSessionBoost?: boolean;
   205	  enableCausalBoost?: boolean;
   515	    minState,  // No default — memoryState column not yet in schema; defaulting to 'WARM' filters all rows
   516	    applyStateLimits: applyStateLimits = false,
   517	    rerank = true, // Enable reranking by default for better result quality
   518	    applyLengthPenalty: applyLengthPenalty = true,
   519	    trackAccess: trackAccess = false, // opt-in, off by default
   520	    includeArchived: includeArchived = false, // REQ-206: exclude archived by default
   521	    enableSessionBoost: enableSessionBoost = isSessionBoostEnabled(),
   843	 * Called only when `trackAccess` is true (P3-09 FIX: explicit opt-in to avoid
   844	 * unintended write side-effects during read-only searches).
   845	 *
   846	 * For each result, the current retrievability R(t) is computed from the stored
   847	 * stability and last_review fields, then `strengthenOnAccess` fires an FSRS
   848	 * GRADE_GOOD update — increasing stability proportional to how much the memory
   849	 * needed the review.
   850	 *
   851	 * Errors per-row are caught and logged; they do not abort the full set.
   852	 *
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

exec
/bin/zsh -lc "rg -n \"AssistiveReconsolidation|isAssistiveReconsolidationEnabled|ASSISTIVE_REVIEW_THRESHOLD|RECONSOLIDATION\" .opencode/skill/system-spec-kit/mcp_server/handlers/save .opencode/skill/system-spec-kit/mcp_server/lib | sed -n '1,160p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:18:  isAssistiveReconsolidationEnabled as _isAssistiveReconsolidationEnabled,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:40:// ASSISTIVE RECONSOLIDATION CONSTANTS (REQ-D4-005)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:45: * and auto-merged.  Requires SPECKIT_ASSISTIVE_RECONSOLIDATION=true.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:54:export const ASSISTIVE_REVIEW_THRESHOLD = 0.88;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:58: * Default: ON (graduated). Set SPECKIT_ASSISTIVE_RECONSOLIDATION=false to disable.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:60:export function isAssistiveReconsolidationEnabled(): boolean {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:61:  return _isAssistiveReconsolidationEnabled();
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:80:  if (similarity >= ASSISTIVE_REVIEW_THRESHOLD)     return 'review';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:129:  /** Populated when SPECKIT_ASSISTIVE_RECONSOLIDATION is enabled and a
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:366:  // ASSISTIVE RECONSOLIDATION (REQ-D4-005)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:373:  if (!force && isAssistiveReconsolidationEnabled() && embedding) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:380:        minSimilarity: Math.round(ASSISTIVE_REVIEW_THRESHOLD * 100), // convert to 0-100 scale
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:159: * Default: TRUE (graduated). Set SPECKIT_RECONSOLIDATION=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:162:  return isFeatureEnabled('SPECKIT_RECONSOLIDATION');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:562: * Default: TRUE (graduated). Set SPECKIT_ASSISTIVE_RECONSOLIDATION=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:564:export function isAssistiveReconsolidationEnabled(): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:565:  return isFeatureEnabled('SPECKIT_ASSISTIVE_RECONSOLIDATION');
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:422:| `SPECKIT_RECONSOLIDATION` | `false` | Enable similarity-based merge/conflict routing on save (TM-06). Opt in with `SPECKIT_RECONSOLIDATION=true` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:693:Similarity-based merge/conflict/complement routing gated via `SPECKIT_RECONSOLIDATION` (default OFF, opt in with `SPECKIT_RECONSOLIDATION=true`):
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:13:// Behind SPECKIT_RECONSOLIDATION opt-in flag (default OFF)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:143:// Default: ON (graduated). Set SPECKIT_RECONSOLIDATION=false to disable.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:586:// 9. RECONSOLIDATION ORCHESTRATOR

codex
# Iteration 032: MIGRATION RISK MATRIX

## Focus
MIGRATION RISK MATRIX: for each adopt-now pattern, detail what could break during migration, plus rollback plans and feature flags needed.

## Findings
### Finding 1: Compaction memory guidance should layer onto Public’s transport note, not replace it
- **Source**: [external/src/index.ts:210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [opencode-transport.ts:142](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L142), [spec-kit-compact-code-graph.js:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396)
- **What it does**: Mnemosyne injects a direct memory-tool reminder during compaction, while Public already injects a transport-owned resume note derived from `session_resume`.
- **Why it matters**: The transferable value is memory-tool awareness after compaction, not replacing Public’s structural continuity contract.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary
- **Migration risk**: duplicate compaction blocks, contradictory instructions, and token bloat if a Mnemosyne-style note is added without dedupe against the existing transport payload.
- **Rollback plan**: disable the memory-guidance layer and keep the current `OpenCode Compaction Resume Note` only.
- **Feature flag needed**: new `SPECKIT_COMPACTION_MEMORY_GUIDANCE`, default `false`, with per-runtime/plugin override.

### Finding 2: Archive-first forgetting is safe only if retrieval and rebuild paths stay in sync
- **Source**: [external/src/index.ts:193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L193), [archival-manager.ts:558](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L558), [archival-manager.ts:638](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L638), [reconsolidation-bridge.ts:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L396), [stage1-candidate-gen.ts:133](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L133)
- **What it does**: Public archives stale or superseded memories, filters them out of active retrieval, supports unarchive, and defers vector rebuild until the next scan.
- **Why it matters**: This is stronger than Mnemosyne’s direct `delete` surface, but the migration is only safe if every index and cache honors archive state.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary
- **Migration risk**: archived rows can disappear from BM25 immediately but remain missing from vectors after unarchive until `memory_index_scan`; bad archive-on-merge tuning can hide the wrong canonical memory.
- **Rollback plan**: disable assistive auto-archive, unarchive affected rows, then run BM25 sync plus `memory_index_scan` to restore vector presence.
- **Feature flag needed**: keep `SPECKIT_ARCHIVAL` and `SPECKIT_ASSISTIVE_RECONSOLIDATION`; add a narrower `SPECKIT_ARCHIVE_FIRST_DELETE` only if a user-facing delete alias is introduced.

### Finding 3: Hard expiry should not roll out ahead of a verified sweep path
- **Source**: [save/types.ts:139](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts#L139), [scope-governance.ts:201](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L201), [scope-governance.ts:260](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L260), [README.md:710](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L710), [memory-governance.vitest.ts:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts#L160)
- **What it does**: Public models `retentionPolicy` and `deleteAfter`, and governed ingest rejects ephemeral saves without a future expiry.
- **Why it matters**: This is the right contract shape, but migration risk is operational, not schema-level.
- **Recommendation**: adopt now
- **Impact**: medium
- **Source strength**: primary
- **Migration risk**: broadening expiry inputs before a live sweep runner is verified can create either failing saves or “ephemeral” rows that never actually expire; I still only found audit/test evidence for `retention_sweep` in this checkout.
- **Rollback plan**: force all new writes back to `retentionPolicy='keep'`, ignore `deleteAfter`, and treat expiry fields as inert metadata until sweep behavior is proven.
- **Feature flag needed**: gate rollout behind existing `SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS` plus a new `SPECKIT_RETENTION_SWEEP` or equivalent shadow/audit-first toggle.

### Finding 4: Validation and usage signals should stay additive, and write-back must remain opt-in
- **Source**: [checkpoints.ts:648](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts#L648), [checkpoints.ts:721](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts#L721), [search-flags.ts:635](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts#L635), [memory-search.ts:202](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L202), [stage2-fusion.ts:781](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L781), [stage2-fusion.ts:1195](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L1195)
- **What it does**: Public already uses validation feedback, negative-feedback demotion, usage-weighted ranking, and optional access write-back.
- **Why it matters**: This is a strong adopt-now pattern, but it can destabilize ranking if migrated as a primary score rather than a modifier.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary
- **Migration risk**: popularity loops can drown new but correct memories, negative feedback can over-demote valid records, and `trackAccess` can introduce write-on-read side effects if enabled by default.
- **Rollback plan**: turn off usage ranking and negative-feedback modifiers, leave validation/audit data intact, and fall back to baseline hybrid ranking with `trackAccess=false`.
- **Feature flag needed**: keep `SPECKIT_USAGE_RANKING`, `SPECKIT_NEGATIVE_FEEDBACK`, and preserve `trackAccess` as explicit opt-in only.

### Finding 5: Mnemosyne-style `core` must not collapse Public’s separate permanence, state, and session-attention models
- **Source**: [external/src/index.ts:138](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L138), [external/src/index.ts:216](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L216), [working-memory.ts:5](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts#L5), [tier-classifier.ts:300](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts#L300), [tier-classifier.ts:496](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts#L496), [memory-triggers.ts:156](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L156)
- **What it does**: Mnemosyne’s `core=true` is a single cross-cutting concept, while Public separates long-term importance, FSRS state, and ephemeral working-memory attention.
- **Why it matters**: Public’s model is safer for long-lived systems, but a naive compatibility layer could erase that separation.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary
- **Migration risk**: mapping `core` directly to `critical`, `HOT`, or compaction injection can make temporary salience permanent, over-inflate prompts, and prevent normal decay or archival.
- **Rollback plan**: remove the alias, restore original tier/state behavior, and treat any `core` compatibility only as a transport hint until explicit policy mapping is proven.
- **Feature flag needed**: new `SPECKIT_MNEMOSYNE_CORE_ALIAS`, default `false`, with separate toggles for compaction-note behavior versus persistence-tier mapping.

## Sources Consulted
- [external/src/index.ts:38](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L38)
- [external/package.json:1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L1)
- [external/README.md:29](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L29)
- [session-resume.ts:590](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L590)
- [opencode-transport.ts:102](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L102)
- [archival-manager.ts:490](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L490)
- [memory-crud-stats.ts:206](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts#L206)
- [mcp-coco-index/README.md:85](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L85)

## Assessment
- New information ratio: `0.12`
- Questions addressed: compaction layering, archive/delete migration, expiry rollout safety, feedback-signal rollout, and `core` compatibility mapping.
- Questions answered: the riskiest migrations are contract collisions, not algorithm swaps; every adopt-now item needs an explicit kill switch and a no-data-loss rollback.
- Novelty justification: this pass adds little new source discovery, but it turns prior adopt-now recommendations into rollout-safe migration boundaries with concrete failure modes.
- Validation: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict` returned `RESULT: PASSED`, `Errors: 0`, `Warnings: 0`, with the known read-only temp-file warning.

## Ruled Out
- Replacing Public’s existing compaction transport with Mnemosyne’s simpler prompt block.
- Porting Mnemosyne’s hard-delete semantics into primary Public lifecycle flows.
- Shipping `ephemeral` retention as a default-facing surface before sweep execution is verified.
- Mapping Mnemosyne `core` directly onto Public’s importance tier or HOT-state machinery.

## Reflection
- What worked: comparing the external wrapper hook directly against Public’s transport, archival, and scoring code made the migration risks concrete instead of speculative.
- What did not work: I still did not find a concrete runtime retention-sweep executor in this checkout, only schema, docs, and audit/test references.
- What I would do differently: the next pass should turn these flags and rollback steps into packet-ready acceptance tests and operator runbooks.

## Recommended Next Focus
Convert these five findings into packet-level rollout criteria: one packet for compaction-memory guidance, one for archive-first delete semantics, one for guarded expiry plus sweep verification, one for feedback-signal calibration, and one for `core` compatibility mapping.

This was a read-only synthesis. I did not update `research/research.md`, `checklist.md`, `implementation-summary.md`, or save memory artifacts in the phase folder.


hook: Stop
hook: Stop Completed
tokens used
100,638
# Iteration 032: MIGRATION RISK MATRIX

## Focus
MIGRATION RISK MATRIX: for each adopt-now pattern, detail what could break during migration, plus rollback plans and feature flags needed.

## Findings
### Finding 1: Compaction memory guidance should layer onto Public’s transport note, not replace it
- **Source**: [external/src/index.ts:210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L210), [opencode-transport.ts:142](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L142), [spec-kit-compact-code-graph.js:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/spec-kit-compact-code-graph.js#L396)
- **What it does**: Mnemosyne injects a direct memory-tool reminder during compaction, while Public already injects a transport-owned resume note derived from `session_resume`.
- **Why it matters**: The transferable value is memory-tool awareness after compaction, not replacing Public’s structural continuity contract.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary
- **Migration risk**: duplicate compaction blocks, contradictory instructions, and token bloat if a Mnemosyne-style note is added without dedupe against the existing transport payload.
- **Rollback plan**: disable the memory-guidance layer and keep the current `OpenCode Compaction Resume Note` only.
- **Feature flag needed**: new `SPECKIT_COMPACTION_MEMORY_GUIDANCE`, default `false`, with per-runtime/plugin override.

### Finding 2: Archive-first forgetting is safe only if retrieval and rebuild paths stay in sync
- **Source**: [external/src/index.ts:193](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L193), [archival-manager.ts:558](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L558), [archival-manager.ts:638](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L638), [reconsolidation-bridge.ts:396](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L396), [stage1-candidate-gen.ts:133](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L133)
- **What it does**: Public archives stale or superseded memories, filters them out of active retrieval, supports unarchive, and defers vector rebuild until the next scan.
- **Why it matters**: This is stronger than Mnemosyne’s direct `delete` surface, but the migration is only safe if every index and cache honors archive state.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary
- **Migration risk**: archived rows can disappear from BM25 immediately but remain missing from vectors after unarchive until `memory_index_scan`; bad archive-on-merge tuning can hide the wrong canonical memory.
- **Rollback plan**: disable assistive auto-archive, unarchive affected rows, then run BM25 sync plus `memory_index_scan` to restore vector presence.
- **Feature flag needed**: keep `SPECKIT_ARCHIVAL` and `SPECKIT_ASSISTIVE_RECONSOLIDATION`; add a narrower `SPECKIT_ARCHIVE_FIRST_DELETE` only if a user-facing delete alias is introduced.

### Finding 3: Hard expiry should not roll out ahead of a verified sweep path
- **Source**: [save/types.ts:139](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts#L139), [scope-governance.ts:201](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L201), [scope-governance.ts:260](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L260), [README.md:710](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L710), [memory-governance.vitest.ts:160](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts#L160)
- **What it does**: Public models `retentionPolicy` and `deleteAfter`, and governed ingest rejects ephemeral saves without a future expiry.
- **Why it matters**: This is the right contract shape, but migration risk is operational, not schema-level.
- **Recommendation**: adopt now
- **Impact**: medium
- **Source strength**: primary
- **Migration risk**: broadening expiry inputs before a live sweep runner is verified can create either failing saves or “ephemeral” rows that never actually expire; I still only found audit/test evidence for `retention_sweep` in this checkout.
- **Rollback plan**: force all new writes back to `retentionPolicy='keep'`, ignore `deleteAfter`, and treat expiry fields as inert metadata until sweep behavior is proven.
- **Feature flag needed**: gate rollout behind existing `SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS` plus a new `SPECKIT_RETENTION_SWEEP` or equivalent shadow/audit-first toggle.

### Finding 4: Validation and usage signals should stay additive, and write-back must remain opt-in
- **Source**: [checkpoints.ts:648](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts#L648), [checkpoints.ts:721](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts#L721), [search-flags.ts:635](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts#L635), [memory-search.ts:202](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L202), [stage2-fusion.ts:781](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L781), [stage2-fusion.ts:1195](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L1195)
- **What it does**: Public already uses validation feedback, negative-feedback demotion, usage-weighted ranking, and optional access write-back.
- **Why it matters**: This is a strong adopt-now pattern, but it can destabilize ranking if migrated as a primary score rather than a modifier.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary
- **Migration risk**: popularity loops can drown new but correct memories, negative feedback can over-demote valid records, and `trackAccess` can introduce write-on-read side effects if enabled by default.
- **Rollback plan**: turn off usage ranking and negative-feedback modifiers, leave validation/audit data intact, and fall back to baseline hybrid ranking with `trackAccess=false`.
- **Feature flag needed**: keep `SPECKIT_USAGE_RANKING`, `SPECKIT_NEGATIVE_FEEDBACK`, and preserve `trackAccess` as explicit opt-in only.

### Finding 5: Mnemosyne-style `core` must not collapse Public’s separate permanence, state, and session-attention models
- **Source**: [external/src/index.ts:138](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L138), [external/src/index.ts:216](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L216), [working-memory.ts:5](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts#L5), [tier-classifier.ts:300](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts#L300), [tier-classifier.ts:496](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts#L496), [memory-triggers.ts:156](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L156)
- **What it does**: Mnemosyne’s `core=true` is a single cross-cutting concept, while Public separates long-term importance, FSRS state, and ephemeral working-memory attention.
- **Why it matters**: Public’s model is safer for long-lived systems, but a naive compatibility layer could erase that separation.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary
- **Migration risk**: mapping `core` directly to `critical`, `HOT`, or compaction injection can make temporary salience permanent, over-inflate prompts, and prevent normal decay or archival.
- **Rollback plan**: remove the alias, restore original tier/state behavior, and treat any `core` compatibility only as a transport hint until explicit policy mapping is proven.
- **Feature flag needed**: new `SPECKIT_MNEMOSYNE_CORE_ALIAS`, default `false`, with separate toggles for compaction-note behavior versus persistence-tier mapping.

## Sources Consulted
- [external/src/index.ts:38](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/src/index.ts#L38)
- [external/package.json:1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/package.json#L1)
- [external/README.md:29](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/external/README.md#L29)
- [session-resume.ts:590](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L590)
- [opencode-transport.ts:102](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts#L102)
- [archival-manager.ts:490](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L490)
- [memory-crud-stats.ts:206](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts#L206)
- [mcp-coco-index/README.md:85](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/mcp-coco-index/README.md#L85)

## Assessment
- New information ratio: `0.12`
- Questions addressed: compaction layering, archive/delete migration, expiry rollout safety, feedback-signal rollout, and `core` compatibility mapping.
- Questions answered: the riskiest migrations are contract collisions, not algorithm swaps; every adopt-now item needs an explicit kill switch and a no-data-loss rollback.
- Novelty justification: this pass adds little new source discovery, but it turns prior adopt-now recommendations into rollout-safe migration boundaries with concrete failure modes.
- Validation: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main" --strict` returned `RESULT: PASSED`, `Errors: 0`, `Warnings: 0`, with the known read-only temp-file warning.

## Ruled Out
- Replacing Public’s existing compaction transport with Mnemosyne’s simpler prompt block.
- Porting Mnemosyne’s hard-delete semantics into primary Public lifecycle flows.
- Shipping `ephemeral` retention as a default-facing surface before sweep execution is verified.
- Mapping Mnemosyne `core` directly onto Public’s importance tier or HOT-state machinery.

## Reflection
- What worked: comparing the external wrapper hook directly against Public’s transport, archival, and scoring code made the migration risks concrete instead of speculative.
- What did not work: I still did not find a concrete runtime retention-sweep executor in this checkout, only schema, docs, and audit/test references.
- What I would do differently: the next pass should turn these flags and rollback steps into packet-ready acceptance tests and operator runbooks.

## Recommended Next Focus
Convert these five findings into packet-level rollout criteria: one packet for compaction-memory guidance, one for archive-first delete semantics, one for guarded expiry plus sweep verification, one for feedback-signal calibration, and one for `core` compatibility mapping.

This was a read-only synthesis. I did not update `research/research.md`, `checklist.md`, `implementation-summary.md`, or save memory artifacts in the phase folder.
