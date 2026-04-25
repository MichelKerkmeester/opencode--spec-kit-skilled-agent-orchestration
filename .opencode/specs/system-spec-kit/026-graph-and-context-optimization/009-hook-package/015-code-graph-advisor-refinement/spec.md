---
# SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2
title: "Feature Specification: Code Graph and Skill Advisor Refinement Research"
description: "Both the Code Graph and Skill Advisor systems have grown significantly since their initial designs. This research phase exists to surface algorithmic gaps, performance ceilings, UX rough edges, and observability blind spots across both systems before a targeted improvement phase begins."
trigger_phrases:
  - "code graph advisor refinement"
  - "code graph research"
  - "skill advisor research"
  - "026/009/015"
  - "code graph skill advisor refinement"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "scaffold-pass"
    recent_action: "Initialized Level 3 spec folder for deep-research initiative"
    next_safe_action: "Run /spec_kit:deep-research:auto for 20 iterations"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session-015"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Which research questions converge fastest — algorithmic gaps or observability gaps?"
      - "Are there cross-system coupling failures between code-graph freshness and advisor trust state?"
    answered_questions: []
---
# Feature Specification: Code Graph and Skill Advisor Refinement Research

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Both the Code Graph subsystem and the Skill Advisor system have matured independently, but no systematic investigation has been conducted into their combined correctness, performance boundaries, and UX consistency. This research phase uses 20 deep-research iterations to produce actionable, evidence-based recommendations across both systems so that a follow-up implementation phase can make targeted improvements with confidence rather than guesswork.

**Key Decisions**: Use `/spec_kit:deep-research:auto` for all 20 iterations per Gate 4 policy (see ADR-001 in decision-record.md); scope recommendations to the two named systems only.

**Critical Dependencies**: Existing test harness (vitest suites, Python regression suite, bench files) must be readable by the research loop as primary evidence sources.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned — research not yet started |
| **Created** | 2026-04-24 |
| **Branch** | `015-code-graph-advisor-refinement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The Code Graph system (AST-based structural indexer) and the Skill Advisor system (5-lane fusion scorer) each carry known limitations discovered piecemeal across prior packets. No single research effort has surveyed both systems together to determine where algorithmic choices are sub-optimal, where performance targets are at risk, where UX signals are misleading operators, and where observability coverage is insufficient to detect regressions early.

### Purpose

Produce a convergent, evidence-backed set of research findings and recommendations — organized by dimension — that give the next implementation phase precise targets rather than general direction.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Code Graph: AST detection accuracy, edge enrichment strategy, scan trigger correctness, cache invalidation behavior, query surface contract, and failure mode handling
- Code Graph: readiness contract, stale-state messaging, budget allocation, and partial-output signaling
- Skill Advisor: 5-lane fusion algorithm correctness, freshness policy and trust-state machine, hook integration quality, daemon architecture, and thresholding behavior
- Skill Advisor: benchmark coverage, regression detection, promotion gate rigor, and Python/TS parity
- Cross-system: interaction between code-graph freshness state and advisor trust-state; startup brief assembly and consistency across runtimes
- Observability gaps in both systems that would prevent early regression detection

### Out of Scope

- Implementation of any fixes found — that is the next phase
- Changes to the MCP protocol or how tools are registered in the parent server
- Refactoring or rewriting either system from scratch
- Any system outside `mcp_server/code-graph/` and `mcp_server/skill-advisor/`
- Multi-repo graph support (tracked separately, noted as evolution question only)

### Files to Change

This is a research-only phase. No source files will be modified. The deliverable is a research synthesis and a seeded follow-up phase spec.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` (auto-created) | Create | Iteration outputs, findings registry, strategy state — created by deep-research skill |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Research questions framed before loop starts | All 10 questions in §7 Open Questions are legible and testable by the deep-research agent |
| REQ-002 | 20 iterations completed via canonical deep-research skill | `deep-research-state.jsonl` shows 20 entries with `converged` or `max-iterations` terminal state |
| REQ-003 | Findings cover all 5 dimensions | Research synthesis includes at least one concrete finding per dimension in §7 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Follow-up phase spec seeded | At minimum a follow-up spec folder stub created with top-priority recommendations mapped to tasks |
| REQ-005 | Recommendations are actionable | Each recommendation names a specific file, function, or behavior — no vague advice |
| REQ-006 | Phase boundaries respected in research loop | Discovery band (iters 1-6) establishes factual baseline before deep-dive begins |
| REQ-007 | Cross-system coupling investigated | Research explicitly addresses interaction between code-graph freshness and advisor trust state |
| REQ-008 | Static analysis limitation flagged | Any finding that requires runtime observation is explicitly marked "requires runtime observation" in synthesis |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 20 deep-research iterations complete with terminal state logged in `deep-research-state.jsonl`
- **SC-002**: Research synthesis document contains at least one actionable finding per research question (RQ-01 through RQ-10)
- **SC-003**: Each finding cites a specific source file, function, or test case as evidence
- **SC-004**: A follow-up phase spec is seeded with top-priority improvement recommendations mapped to concrete tasks
- **SC-005**: No implementation changes are made during this research phase
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Vitest suites and Python regression suite must be readable | Research loop cannot verify algorithmic claims without test evidence | Read test files directly; do not require running them |
| Dependency | Bench harness files `bench/*.ts` must be accessible | Performance claims need bench code as ground truth | Read bench source to understand gate thresholds |
| Risk | Research questions may be too broad for 20 iterations | Shallow findings across all 10 RQs rather than deep findings on 5 | Phase 2 (iters 7-14) is explicitly a deep-dive to prevent surface-skimming |
| Risk | Cross-system coupling questions may be hard to answer from static analysis | Inconclusive findings on dynamic behavior | Flag as "requires runtime observation" in synthesis; seed a runtime-test task in follow-up phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Research Questions

These are the primary investigation targets for the 20-iteration deep-research loop. Each question is concrete and answerable from source code and test evidence.

**Dimension A — Algorithm and Correctness**

- **RQ-01 AST Edge Detection Gaps**: Which call-edge and import-edge types does the tree-sitter parser miss or misattribute for TypeScript, JavaScript, Python, and Bash? Are there node kinds (decorators, type aliases, dynamic imports) where the regex fallback produces materially different edges than tree-sitter, causing incorrect CALLS chains in `code_graph_query`?
- **RQ-02 Scorer Lane Bias and Confidence Calibration**: Are the 5 fusion lane weights (explicit_author: 0.45, lexical: 0.30, graph_causal: 0.15, derived_generated: 0.10, semantic_shadow: 0.00) producing systematically biased recommendations for lexically sparse but graphically dense skills? Does the current confidence/uncertainty dual threshold (0.8 / 0.35) produce false abstains for prompts a human would route confidently?
- **RQ-03 Freshness Invariant Correctness**: Is the advisor's freshness state machine (`live` / `stale` / `absent` / `unavailable`) correctly maintained under rapid skill-file edits, daemon restarts, and workspace root changes? Are there race conditions between the watcher and the generation counter that could produce a `live` state with a stale projection?
- **RQ-04 Promotion Gate Rigor**: Do the 7 promotion gates actually catch realistic regression scenarios? Does the two-consecutive-shadow-cycle requirement prevent weight oscillation, and is the 0.05 per-lane delta cap tight enough to prevent accuracy degradation between gates?

**Dimension B — Performance**

- **RQ-05 Scan Throughput and Incremental Accuracy**: At the current corpus size (~1,400 files, ~52K nodes, ~30K edges), what fraction of incremental scan time is spent on mtime+hash comparison vs. actual parsing? Are there files repeatedly re-parsed despite not changing, indicating a cache invalidation bug in `structural-indexer.ts`?
- **RQ-06 Query Latency and Cache Hit Ratio**: Is the `advisorPromptCache` achieving expected hit rates (p95 cache-hit <= 50 ms, uncached <= 60 ms) under realistic session patterns? Is there a cache key design issue preventing near-duplicate prompts from hitting the cache?

**Dimension C — UX and Integration**

- **RQ-07 Stale-State Messaging Consistency**: When either system is in a degraded or stale state, do operators receive actionable, consistent messages? Does `code_graph_context` `status:"blocked"` always include `requiredAction`, and does `advisor_recommend` always emit a meaningful warning when `freshness` is `stale`?
- **RQ-08 Hook Brief Signal-to-Noise**: Does the advisor hook brief — as injected at session startup across all four runtimes (Claude, Copilot, Gemini, Codex) — contain the right amount of context? Are there cases where the brief is noisy (too many recommendations) or thin (high-value recommendations dropped by threshold)?

**Dimension D — Observability**

- **RQ-09 Benchmark Coverage Gaps**: Are the existing bench harnesses (`scorer-bench.ts`, `corpus-bench.ts`, `holdout-bench.ts`, `latency-bench.ts`, `safety-bench.ts`, `watcher-benchmark.ts`) covering the most regression-prone code paths? Is there a benchmark for incremental-scan accuracy, and an end-to-end test for the full code-graph to advisor projection pipeline?

**Dimension E — Evolution**

- **RQ-10 Cross-Runtime Parity and Extension Points**: Do the hook entry points for all four runtimes produce structurally equivalent briefs from the same workspace state, or are there runtime-specific divergences in payload shape, threshold application, or fail-open behavior? What are the concrete extension points if a fifth runtime needed to be added?

### Open Questions

- Which research questions will converge fastest — algorithmic gaps or observability gaps?
- Are there cross-system coupling failures between code-graph freshness and advisor trust state that cannot be detected through static analysis?

---

## 8. EDGE CASES

### Data Boundaries

- Research loop stalls or produces no convergent findings: synthesize manually from iteration files; extend with a follow-up iteration batch
- Benchmark files are moved or renamed: note the absence as an observability finding (RQ-09)

### Error Scenarios

- Deep-research skill fails to launch: verify skill is available via `/spec_kit:deep-research:auto` help
- Iteration state file becomes corrupt: restore from the last clean iteration file and restart from that iteration number

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | Files: ~80 source files surveyed, LOC: ~0 written, Systems: 2 |
| Risk | 10/25 | No auth changes, no API changes, no breaking changes — research only |
| Research | 18/20 | 20-iteration deep-research loop, 10 open questions across 5 dimensions |
| Multi-Agent | 10/15 | Deep-research loop uses skill-owned agent; synthesis by primary agent |
| Coordination | 8/15 | Tight coordination between research findings and follow-up phase spec seeding |
| **Total** | **61/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Research questions too broad for 20 iterations | M | M | Three-phase structure channels iteration focus |
| R-002 | Dynamic behavior cannot be determined from static analysis | M | M | Flag as runtime-observation required; seed runtime-test task |
| R-003 | Convergence detected before iteration 20 | L | M | Remaining budget spent on synthesis quality |

---

## 11. USER STORIES

### US-001: Research Loop Execution (Priority: P0)

**As a** packet owner, **I want** the deep-research loop to run 20 iterations autonomously, **so that** I receive a comprehensive findings synthesis without manual iteration management.

**Acceptance Criteria**:
1. **Given** this spec folder exists, **When** `/spec_kit:deep-research:auto` is invoked, **Then** the loop runs all 20 iterations and produces a terminal state entry in the state file
2. **Given** the research loop is running, **When** iteration 6 completes, **Then** Discovery phase output covers both Code Graph and Skill Advisor architecture baselines

### US-002: Actionable Recommendations (Priority: P0)

**As a** developer implementing improvements, **I want** each research finding to cite a specific file or function, **so that** I can implement fixes without additional discovery work.

**Acceptance Criteria**:
1. **Given** the synthesis document exists, **When** I read a finding on RQ-01 through RQ-10, **Then** I can identify the exact source location (file, function, or test case) to change
2. **Given** a finding is marked "requires runtime observation", **When** I read it, **Then** it includes a concrete suggestion for what to measure at runtime

### US-003: Follow-Up Phase Seeding (Priority: P1)

**As a** packet owner, **I want** a follow-up phase spec to be seeded at the end of synthesis, **so that** the research findings translate directly into an implementation roadmap.

**Acceptance Criteria**:
1. **Given** iteration 20 completes, **When** synthesis is finalized, **Then** a follow-up spec folder exists with top recommendations mapped to tasks
2. **Given** the follow-up spec exists, **When** I read its tasks, **Then** each task traces back to a specific finding in the synthesis document

---

## 12. OPEN QUESTIONS

- Which of the 10 research questions will produce the most actionable findings within the 20-iteration budget?
- Are there cross-system coupling failures between code-graph freshness state and advisor trust state that static analysis cannot detect?
<!-- /ANCHOR:questions -->


---

## 13. RESEARCH FINDINGS SUMMARY

<!-- BEGIN GENERATED: deep-research/spec-findings -->
<!-- generator: spec_kit_deep_research session=dr-20260424T195254Z-72a5b0eb iterations=20 -->

**Convergence:** SHIP_READY_CONFIRMED. 20/20 iterations complete. 10/10 research questions resolved at depth. 88 active findings (6 retracted/corrected). Zero deferred research items.

**Top 5 highest-leverage findings:**

1. **Promotion subsystem is dead code (F52, F60, F70):** 6 modules + 14 unit tests in `lib/promotion/` have ZERO production callers. Iter-13 decision memo recommends Option A: DELETE. ~1133 LOC removal, ~12 doc files scrub. Cross-packet preflight passed.
2. **CALLS edge is regex-only (F2, F3, F12):** Among 10 declared edge types, CALLS is the sole regex-heuristic emitter; the other 9 use AST extraction. Tree-sitter has no `call_expression` capture wired (iter 2). Evidence-summary flattens 10 types to 5 classes, explaining the misleading "direct_call (1.00 coverage)" startup brief.
3. **Settings.json wiring bug (F23.1, F51):** `.claude/settings.local.json` wires the wrong adapter at the top-level `bash:` key (points at copilot adapter while nesting Claude inside `hooks[0].command`). Causes Claude sessions to invoke Copilot adapter as a side effect, biasing telemetry. Fix: -31 LOC net deletion.
4. **Promotion gate bundle is toothless (F15, iter-12 matrix):** All 12 gates are independent inside `gate-bundle.ts`; the two-cycle rule lives in a separate module not referenced. Bundle is bypassable via single-shot promotion. 13 concrete gate enhancements documented (only relevant if promotion subsystem is KEPT, contradicting F70 delete recommendation).
5. **No P50/P95/P99 query latency telemetry, no query-result cache (F28):** `code_graph_query` has zero percentile instrumentation and no cache. Cache-hit ratio cannot be computed at the query surface. F43 metric namespace (16 metrics, ~150 LOC, extend `lib/metrics.ts`) closes this.

**Remediation roadmap:** 10 PRs sequenced into 3 parallel batches (A: P0 quick wins; B: scaffolds; C: bench fan-out). Critical path ~22 hours with parallelism, ~30 hours sequential. Net LOC delta ~-744 (deletion-heavy).

**Canonical synthesis:** See `research/015-code-graph-advisor-refinement-pt-01/research.md` for the full 17-section synthesis (~7,000 words) including per-RQ findings, retractions, defects catalog, master roadmap, rollback plans, instrumentation namespace, and vocabulary unification mapping.

<!-- END GENERATED: deep-research/spec-findings -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research Synthesis**: See `research/015-code-graph-advisor-refinement-pt-01/research.md`
- **Resource Map**: See `research/015-code-graph-advisor-refinement-pt-01/resource-map.md`
- **Thematic Sibling**: See `014-skill-advisor-hook-improvements/` spec folder (009-hook-package peer)
- **Code Graph Source**: See `.opencode/skill/system-spec-kit/mcp_server/code-graph/README.md`
- **Skill Advisor Source**: See `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md`
