---
title: Deep Research Strategy - Mex
description: Reducer-tracked strategy for the 002-mex-main hybrid-rag-fusion research packet.
---

# Deep Research Strategy - Mex

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Track the 40-iteration Mex deep research lineage in reducer-compatible format. Research is complete; this file records the final strategy state.

### Usage

- All 40 iterations completed via cli-codex orchestrator (GPT-5.4 high, fast tier)
- Copilot GPT-5.4 high as fallback after 3 consecutive codex failures
- Iterations stored at research/iterations/iteration-NNN.md
- Canonical synthesis at research/research.md

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Research Mex's markdown scaffold architecture, 8-checker drift detection model, command surface, and no-database design to identify concrete improvements for Spec Kit Memory.

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: How does Mex's markdown scaffold differ from our spec-folder approach?
- [ ] Q2: What does drift detection provide that our validate.sh does not?
- [ ] Q3: How do the 8 checkers compose and what would translate to our system?
- [ ] Q4: How does targeted sync (mex sync) work and is it adoptable?
- [ ] Q5: What does scaffold growth (mex pattern add) look like?
- [ ] Q6: How does the watch mode integrate with agent workflows?
- [ ] Q7: What does AGENTS.md/ROUTER.md/SETUP.md/SYNC.md canonical scaffold teach us?
- [ ] Q8: How does it handle no-DB persistence and what are the trade-offs?
- [ ] Q9: Can we adopt drift detection without replacing our memory system?
- [ ] Q10: Which Mex features work standalone vs require the full scaffold?

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- Reimplementing Mex wholesale in our memory system
- Replacing our existing CocoIndex, code-graph, or Spec Kit Memory stack
- Making architectural changes without explicit adoption decisions

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- 40 iterations completed (reached)
- All 10 key questions answered at least once (reached)
- Definitive final report produced (iteration 40)

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A single end-to-end “doctor works” suite as the main safety signal, because both Mex and Spec Kit already separate lexical correctness, handler contracts, and ranking quality into different testable concerns. -- BLOCKED (iteration 33, 1 attempts)
- What was tried: A single end-to-end “doctor works” suite as the main safety signal, because both Mex and Spec Kit already separate lexical correctness, handler contracts, and ranking quality into different testable concerns.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A single end-to-end “doctor works” suite as the main safety signal, because both Mex and Spec Kit already separate lexical correctness, handler contracts, and ranking quality into different testable concerns.

### Adopting MemPalace's raw-verbatim-everything storage model as the default Public memory substrate -- BLOCKED (iteration 39, 1 attempts)
- What was tried: Adopting MemPalace's raw-verbatim-everything storage model as the default Public memory substrate
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adopting MemPalace's raw-verbatim-everything storage model as the default Public memory substrate

### Adopting Mex's mandatory "create or update patterns after every task" rule as a default Spec Kit closeout requirement -- BLOCKED (iteration 36, 1 attempts)
- What was tried: Adopting Mex's mandatory "create or update patterns after every task" rule as a default Spec Kit closeout requirement
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adopting Mex's mandatory "create or update patterns after every task" rule as a default Spec Kit closeout requirement

### Auto-running integrity checks inside `session_bootstrap`, `memory_context`, `memory_search`, or `generate-context.js` -- BLOCKED (iteration 36, 1 attempts)
- What was tried: Auto-running integrity checks inside `session_bootstrap`, `memory_context`, `memory_search`, or `generate-context.js`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Auto-running integrity checks inside `session_bootstrap`, `memory_context`, `memory_search`, or `generate-context.js`

### Building a second discovery/index subsystem for documentation drift, because the current CocoIndex plus code-graph bridge already covers semantic-plus-structural discovery better than Mex's markdown tooling ever tried to -- BLOCKED (iteration 35, 1 attempts)
- What was tried: Building a second discovery/index subsystem for documentation drift, because the current CocoIndex plus code-graph bridge already covers semantic-plus-structural discovery better than Mex's markdown tooling ever tried to
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building a second discovery/index subsystem for documentation drift, because the current CocoIndex plus code-graph bridge already covers semantic-plus-structural discovery better than Mex's markdown tooling ever tried to

### bundling `spec-kit doctor` into the same release as the first two Q1 slices, because it compounds routing and repair risk before integrity outputs stabilize -- BLOCKED (iteration 31, 1 attempts)
- What was tried: bundling `spec-kit doctor` into the same release as the first two Q1 slices, because it compounds routing and repair risk before integrity outputs stabilize
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: bundling `spec-kit doctor` into the same release as the first two Q1 slices, because it compounds routing and repair risk before integrity outputs stabilize

### bundling `spec-kit doctor` or any execution-owning repair loop into the same release as the Q1 adopt-now slices -- BLOCKED (iteration 32, 1 attempts)
- What was tried: bundling `spec-kit doctor` or any execution-owning repair loop into the same release as the Q1 adopt-now slices
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: bundling `spec-kit doctor` or any execution-owning repair loop into the same release as the Q1 adopt-now slices

### Collapsing causal links, lexical integrity edges, and structural code graph data into one universal graph surface -- BLOCKED (iteration 39, 1 attempts)
- What was tried: Collapsing causal links, lexical integrity edges, and structural code graph data into one universal graph surface
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Collapsing causal links, lexical integrity edges, and structural code graph data into one universal graph surface

### Coupling a future integrity lane to automatic code-graph or CocoIndex rebuilds, because Public already has a better pattern: explicit or incremental index maintenance -- BLOCKED (iteration 34, 1 attempts)
- What was tried: Coupling a future integrity lane to automatic code-graph or CocoIndex rebuilds, because Public already has a better pattern: explicit or incremental index maintenance
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Coupling a future integrity lane to automatic code-graph or CocoIndex rebuilds, because Public already has a better pattern: explicit or incremental index maintenance

### enabling warnings, rescans, or auto-repair by default in the first guided maintenance surface -- BLOCKED (iteration 32, 1 attempts)
- What was tried: enabling warnings, rescans, or auto-repair by default in the first guided maintenance surface
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: enabling warnings, rescans, or auto-repair by default in the first guided maintenance surface

### Flattening native Spec Kit tools and external MCP integrations into one opaque `doctor` command, because that would combine unrelated authority and transport risk into the first release -- BLOCKED (iteration 35, 1 attempts)
- What was tried: Flattening native Spec Kit tools and external MCP integrations into one opaque `doctor` command, because that would combine unrelated authority and transport risk into the first release
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Flattening native Spec Kit tools and external MCP integrations into one opaque `doctor` command, because that would combine unrelated authority and transport risk into the first release

### Folding integrity findings into `memory_context`, `memory_search`, or `code_graph_query` as if they were retrieval relevance signals -- BLOCKED (iteration 37, 1 attempts)
- What was tried: Folding integrity findings into `memory_context`, `memory_search`, or `code_graph_query` as if they were retrieval relevance signals
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Folding integrity findings into `memory_context`, `memory_search`, or `code_graph_query` as if they were retrieval relevance signals

### Folding lexical integrity results into `memory_context`, `memory_search`, or `code_graph_query`, because Public already assigns those tools different responsibilities -- BLOCKED (iteration 35, 1 attempts)
- What was tried: Folding lexical integrity results into `memory_context`, `memory_search`, or `code_graph_query`, because Public already assigns those tools different responsibilities
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Folding lexical integrity results into `memory_context`, `memory_search`, or `code_graph_query`, because Public already assigns those tools different responsibilities

### importing Mex’s `0-100` drift score as a top-level Public health signal, because it would interfere with existing severity-based validation and health surfaces -- BLOCKED (iteration 32, 1 attempts)
- What was tried: importing Mex’s `0-100` drift score as a top-level Public health signal, because it would interfere with existing severity-based validation and health surfaces
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: importing Mex’s `0-100` drift score as a top-level Public health signal, because it would interfere with existing severity-based validation and health surfaces

### Letting a guided surface auto-run `memory_save`, `memory_health` repair, `code_graph_scan`, or `ccc_reindex` as implicit side effects, because that would bypass or blur existing contracts -- BLOCKED (iteration 35, 1 attempts)
- What was tried: Letting a guided surface auto-run `memory_save`, `memory_health` repair, `code_graph_scan`, or `ccc_reindex` as implicit side effects, because that would bypass or blur existing contracts
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Letting a guided surface auto-run `memory_save`, `memory_health` repair, `code_graph_scan`, or `ccc_reindex` as implicit side effects, because that would bypass or blur existing contracts

### Letting a wrapper silently execute repairs, saves, scans, or reindex operations that currently require explicit calls or confirmation -- BLOCKED (iteration 38, 1 attempts)
- What was tried: Letting a wrapper silently execute repairs, saves, scans, or reindex operations that currently require explicit calls or confirmation
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Letting a wrapper silently execute repairs, saves, scans, or reindex operations that currently require explicit calls or confirmation

### Making live-provider or live-embedding behavior part of the default merge-blocking lane, because the existing strongest tests are deterministic fixtures, mocks, and replay-based evaluation. -- BLOCKED (iteration 33, 1 attempts)
- What was tried: Making live-provider or live-embedding behavior part of the default merge-blocking lane, because the existing strongest tests are deterministic fixtures, mocks, and replay-based evaluation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making live-provider or live-embedding behavior part of the default merge-blocking lane, because the existing strongest tests are deterministic fixtures, mocks, and replay-based evaluation.

### making the integrity lane blocking on first release, because false-positive calibration is the main migration risk -- BLOCKED (iteration 32, 1 attempts)
- What was tried: making the integrity lane blocking on first release, because false-positive calibration is the main migration risk
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: making the integrity lane blocking on first release, because false-positive calibration is the main migration risk

### Making the integrity surface a new write authority that bypasses `memory_health` confirmation or `memory_save` dry-run semantics -- BLOCKED (iteration 37, 1 attempts)
- What was tried: Making the integrity surface a new write authority that bypasses `memory_health` confirmation or `memory_save` dry-run semantics
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making the integrity surface a new write authority that bypasses `memory_health` confirmation or `memory_save` dry-run semantics

### markdown-first memory replacement, because prior synthesis concluded it would regress hybrid retrieval, session recovery, causal links, and structural graph tooling -- BLOCKED (iteration 31, 1 attempts)
- What was tried: markdown-first memory replacement, because prior synthesis concluded it would regress hybrid retrieval, session recovery, causal links, and structural graph tooling
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: markdown-first memory replacement, because prior synthesis concluded it would regress hybrid retrieval, session recovery, causal links, and structural graph tooling

### Q1 adoption of command/dependency/script-coverage audits, because iteration 030 already recommended waiting for a provider-neutral inventory model -- BLOCKED (iteration 31, 1 attempts)
- What was tried: Q1 adoption of command/dependency/script-coverage audits, because iteration 030 already recommended waiting for a provider-neutral inventory model
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Q1 adoption of command/dependency/script-coverage audits, because iteration 030 already recommended waiting for a provider-neutral inventory model

### Re-opening the rejected idea of replacing `memory_context`, `memory_search`, CocoIndex, or code graph with a markdown-first scaffold -- BLOCKED (iteration 38, 1 attempts)
- What was tried: Re-opening the rejected idea of replacing `memory_context`, `memory_search`, CocoIndex, or code graph with a markdown-first scaffold
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-opening the rejected idea of replacing `memory_context`, `memory_search`, CocoIndex, or code graph with a markdown-first scaffold

### Replacing `/spec_kit:resume` or `session_bootstrap` with a markdown-router-first cold-start flow -- BLOCKED (iteration 36, 1 attempts)
- What was tried: Replacing `/spec_kit:resume` or `session_bootstrap` with a markdown-router-first cold-start flow
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replacing `/spec_kit:resume` or `session_bootstrap` with a markdown-router-first cold-start flow

### Replacing `memory_context`, `memory_search`, CocoIndex, or code graph with a markdown-first scaffold -- BLOCKED (iteration 37, 1 attempts)
- What was tried: Replacing `memory_context`, `memory_search`, CocoIndex, or code graph with a markdown-first scaffold
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replacing `memory_context`, `memory_search`, CocoIndex, or code graph with a markdown-first scaffold

### Replacing `session_bootstrap` / `memory_context` with a markdown-router-first startup path -- BLOCKED (iteration 39, 1 attempts)
- What was tried: Replacing `session_bootstrap` / `memory_context` with a markdown-router-first startup path
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replacing `session_bootstrap` / `memory_context` with a markdown-router-first startup path

### Replacing `session_bootstrap` or `/spec_kit:resume` with a markdown-router-first startup path -- BLOCKED (iteration 37, 1 attempts)
- What was tried: Replacing `session_bootstrap` or `/spec_kit:resume` with a markdown-router-first startup path
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replacing `session_bootstrap` or `/spec_kit:resume` with a markdown-router-first startup path

### Replacing Spec Kit hybrid retrieval with Mex-style markdown rescans, because the cold-start savings would come at too high a relevance and repeat-query latency cost -- BLOCKED (iteration 34, 1 attempts)
- What was tried: Replacing Spec Kit hybrid retrieval with Mex-style markdown rescans, because the cold-start savings would come at too high a relevance and repeat-query latency cost
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replacing Spec Kit hybrid retrieval with Mex-style markdown rescans, because the cold-start savings would come at too high a relevance and repeat-query latency cost

### Replacing Spec Kit Memory with any single external architecture -- BLOCKED (iteration 39, 1 attempts)
- What was tried: Replacing Spec Kit Memory with any single external architecture
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replacing Spec Kit Memory with any single external architecture

### Reusing the existing `/doctor:*` namespace for spec-memory integrity -- BLOCKED (iteration 36, 1 attempts)
- What was tried: Reusing the existing `/doctor:*` namespace for spec-memory integrity
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reusing the existing `/doctor:*` namespace for spec-memory integrity

### Running code-graph or CocoIndex maintenance automatically from a post-commit drift hook, because those operations are explicit, potentially expensive maintenance steps in Public rather than cheap lexical checks -- BLOCKED (iteration 35, 1 attempts)
- What was tried: Running code-graph or CocoIndex maintenance automatically from a post-commit drift hook, because those operations are explicit, potentially expensive maintenance steps in Public rather than cheap lexical checks
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Running code-graph or CocoIndex maintenance automatically from a post-commit drift hook, because those operations are explicit, potentially expensive maintenance steps in Public rather than cheap lexical checks

### Running git-based staleness checks inside every startup/context path, because Mex's own implementation scales that work per scaffold file -- BLOCKED (iteration 34, 1 attempts)
- What was tried: Running git-based staleness checks inside every startup/context path, because Mex's own implementation scales that work per scaffold file
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Running git-based staleness checks inside every startup/context path, because Mex's own implementation scales that work per scaffold file

### Shipping mandatory Mex-style post-task pattern growth as a default closeout rule -- BLOCKED (iteration 38, 1 attempts)
- What was tried: Shipping mandatory Mex-style post-task pattern growth as a default closeout rule
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Shipping mandatory Mex-style post-task pattern growth as a default closeout rule

### single blended drift score as the main health surface, because subsystem evidence matters more than one aggregate number -- BLOCKED (iteration 31, 1 attempts)
- What was tried: single blended drift score as the main health surface, because subsystem evidence matters more than one aggregate number
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: single blended drift score as the main health surface, because subsystem evidence matters more than one aggregate number

### Treating integrity findings as retrieval relevance signals inside `memory_context`, `memory_search`, or `code_graph_query` -- BLOCKED (iteration 38, 1 attempts)
- What was tried: Treating integrity findings as retrieval relevance signals inside `memory_context`, `memory_search`, or `code_graph_query`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating integrity findings as retrieval relevance signals inside `memory_context`, `memory_search`, or `code_graph_query`

### Treating Mex's integrity checks as retrieval-ranking signals instead of maintenance signals -- BLOCKED (iteration 39, 1 attempts)
- What was tried: Treating Mex's integrity checks as retrieval-ranking signals instead of maintenance signals
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Mex's integrity checks as retrieval-ranking signals instead of maintenance signals

### Using Mex's single drift score as the primary operator metric for Public's mixed retrieval stack, because it would hide which cost center failed: lexical integrity, semantic retrieval, or index freshness -- BLOCKED (iteration 34, 1 attempts)
- What was tried: Using Mex's single drift score as the primary operator metric for Public's mixed retrieval stack, because it would hide which cost center failed: lexical integrity, semantic retrieval, or index freshness
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using Mex's single drift score as the primary operator metric for Public's mixed retrieval stack, because it would hide which cost center failed: lexical integrity, semantic retrieval, or index freshness

### Using one blended drift/health score as the main regression gate, because it hides whether the failure came from integrity parsing, wrapper behavior, or retrieval ranking. -- BLOCKED (iteration 33, 1 attempts)
- What was tried: Using one blended drift/health score as the main regression gate, because it hides whether the failure came from integrity parsing, wrapper behavior, or retrieval ranking.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using one blended drift/health score as the main regression gate, because it hides whether the failure came from integrity parsing, wrapper behavior, or retrieval ranking.

### Using one Mex-style drift score as the main health contract for Public -- BLOCKED (iteration 37, 1 attempts)
- What was tried: Using one Mex-style drift score as the main health contract for Public
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using one Mex-style drift score as the main health contract for Public

### Using one Mex-style drift score as the primary health contract for Public -- BLOCKED (iteration 38, 1 attempts)
- What was tried: Using one Mex-style drift score as the primary health contract for Public
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using one Mex-style drift score as the primary health contract for Public

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- bundling `spec-kit doctor` into the same release as the first two Q1 slices, because it compounds routing and repair risk before integrity outputs stabilize (iteration 31)
- markdown-first memory replacement, because prior synthesis concluded it would regress hybrid retrieval, session recovery, causal links, and structural graph tooling (iteration 31)
- Q1 adoption of command/dependency/script-coverage audits, because iteration 030 already recommended waiting for a provider-neutral inventory model (iteration 31)
- single blended drift score as the main health surface, because subsystem evidence matters more than one aggregate number (iteration 31)
- bundling `spec-kit doctor` or any execution-owning repair loop into the same release as the Q1 adopt-now slices (iteration 32)
- enabling warnings, rescans, or auto-repair by default in the first guided maintenance surface (iteration 32)
- importing Mex’s `0-100` drift score as a top-level Public health signal, because it would interfere with existing severity-based validation and health surfaces (iteration 32)
- making the integrity lane blocking on first release, because false-positive calibration is the main migration risk (iteration 32)
- A single end-to-end “doctor works” suite as the main safety signal, because both Mex and Spec Kit already separate lexical correctness, handler contracts, and ranking quality into different testable concerns. (iteration 33)
- Making live-provider or live-embedding behavior part of the default merge-blocking lane, because the existing strongest tests are deterministic fixtures, mocks, and replay-based evaluation. (iteration 33)
- Using one blended drift/health score as the main regression gate, because it hides whether the failure came from integrity parsing, wrapper behavior, or retrieval ranking. (iteration 33)
- Coupling a future integrity lane to automatic code-graph or CocoIndex rebuilds, because Public already has a better pattern: explicit or incremental index maintenance (iteration 34)
- Replacing Spec Kit hybrid retrieval with Mex-style markdown rescans, because the cold-start savings would come at too high a relevance and repeat-query latency cost (iteration 34)
- Running git-based staleness checks inside every startup/context path, because Mex's own implementation scales that work per scaffold file (iteration 34)
- Using Mex's single drift score as the primary operator metric for Public's mixed retrieval stack, because it would hide which cost center failed: lexical integrity, semantic retrieval, or index freshness (iteration 34)
- Building a second discovery/index subsystem for documentation drift, because the current CocoIndex plus code-graph bridge already covers semantic-plus-structural discovery better than Mex's markdown tooling ever tried to (iteration 35)
- Flattening native Spec Kit tools and external MCP integrations into one opaque `doctor` command, because that would combine unrelated authority and transport risk into the first release (iteration 35)
- Folding lexical integrity results into `memory_context`, `memory_search`, or `code_graph_query`, because Public already assigns those tools different responsibilities (iteration 35)
- Letting a guided surface auto-run `memory_save`, `memory_health` repair, `code_graph_scan`, or `ccc_reindex` as implicit side effects, because that would bypass or blur existing contracts (iteration 35)
- Running code-graph or CocoIndex maintenance automatically from a post-commit drift hook, because those operations are explicit, potentially expensive maintenance steps in Public rather than cheap lexical checks (iteration 35)
- Adopting Mex's mandatory "create or update patterns after every task" rule as a default Spec Kit closeout requirement (iteration 36)
- Auto-running integrity checks inside `session_bootstrap`, `memory_context`, `memory_search`, or `generate-context.js` (iteration 36)
- Replacing `/spec_kit:resume` or `session_bootstrap` with a markdown-router-first cold-start flow (iteration 36)
- Reusing the existing `/doctor:*` namespace for spec-memory integrity (iteration 36)
- Folding integrity findings into `memory_context`, `memory_search`, or `code_graph_query` as if they were retrieval relevance signals (iteration 37)
- Making the integrity surface a new write authority that bypasses `memory_health` confirmation or `memory_save` dry-run semantics (iteration 37)
- Replacing `memory_context`, `memory_search`, CocoIndex, or code graph with a markdown-first scaffold (iteration 37)
- Replacing `session_bootstrap` or `/spec_kit:resume` with a markdown-router-first startup path (iteration 37)
- Using one Mex-style drift score as the main health contract for Public (iteration 37)
- Letting a wrapper silently execute repairs, saves, scans, or reindex operations that currently require explicit calls or confirmation (iteration 38)
- Re-opening the rejected idea of replacing `memory_context`, `memory_search`, CocoIndex, or code graph with a markdown-first scaffold (iteration 38)
- Shipping mandatory Mex-style post-task pattern growth as a default closeout rule (iteration 38)
- Treating integrity findings as retrieval relevance signals inside `memory_context`, `memory_search`, or `code_graph_query` (iteration 38)
- Using one Mex-style drift score as the primary health contract for Public (iteration 38)
- Adopting MemPalace's raw-verbatim-everything storage model as the default Public memory substrate (iteration 39)
- Collapsing causal links, lexical integrity edges, and structural code graph data into one universal graph surface (iteration 39)
- Replacing `session_bootstrap` / `memory_context` with a markdown-router-first startup path (iteration 39)
- Replacing Spec Kit Memory with any single external architecture (iteration 39)
- Treating Mex's integrity checks as retrieval-ranking signals instead of maintenance signals (iteration 39)

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Iteration 040 should lock the final adoption matrix: 1. freeze the cross-system `adopt now / prototype later / reject` table 2. convert the consensus findings into a Q1/Q2 implementation order for Public 3. define the exact boundaries for the integrity lane, doctor/planner surface, and relation-plane annotations 4. write the final rationale for every non-adoption so future work does not reopen rejected architecture swaps ``` Total usage est: 1 Premium request API time spent: 9m 32s Total session time: 9m 56s Total code changes: +0 -0 Breakdown by AI model: gpt-5.4 2.2m in, 36.2k out, 1.8m cached, 16.3k reasoning (Est. 1 Premium request)

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT
Spec Kit Memory stack: memory_search, memory_context, memory_match_triggers, causal links, generate-context.js, CocoIndex semantic search, code-graph structural queries.

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES
- Max iterations: 40 (reached)
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: resume, restart, fork, completed-continue
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: research/.deep-research-pause
- Current generation: 1
- Started: 2026-04-10T19:19:00Z
- Completed: 2026-04-11T02:20:00Z
<!-- /ANCHOR:research-boundaries -->
