---
title: "Research: 006 Current-State Analysis -- System-Spec-Kit + MCP Memory Server (Hybrid RAG Fusion)"
description: "Deep current-state analysis and strategic upgrade recommendations focused on power, intelligence, utility, interconnection, automation, and bug resistance for system-spec-kit and the MCP memory server retrieval stack."
trigger_phrases:
  - "research"
  - "006"
  - "hybrid rag fusion"
  - "current state"
  - "mcp memory server"
  - "bug eradication"
importance_tier: "critical"
contextType: "research"
---
# Research: 006 Current-State Analysis -- System-Spec-Kit + MCP Memory Server (Hybrid RAG Fusion)

<!-- SPECKIT_LEVEL: 3+ -->

---

## 1. Metadata

| Field | Value |
|-------|-------|
| Research ID | R-006-HRF-CSA-2026-02-22 |
| Status | COMPLETE |
| Date | 2026-02-22 |
| Scope | Current-state architecture, capability inventory, failure modes, test coverage observations, automation opportunities, and strategic roadmap for hybrid RAG fusion |
| Evidence Grade | A/B mixed (A for code claims, B for runtime/operational inferences) |
| Target Artifact | `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/research.md` |

---

## 2. Investigation Report

### Request Summary

This investigation analyzed current system behavior and upgrade opportunities for system-spec-kit plus MCP memory server hybrid RAG fusion, with explicit continuity from specs 002-005 and focus on higher power, smarter routing, tighter interconnection, more automation, and stronger bug resistance.

### Scope and Continuity Anchors

- `006` scope emphasizes audit-first seam hardening across parse -> index -> fusion -> routing, confidence-policy unification, and prevention controls for recurrence from `003`, `004`, and `005`. [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/spec.md:63-67`]
- `002` established tri-hybrid fusion baseline (vector + lexical + graph) with MMR/TRM and explicitly documented deferred operational risks (latency not fully validated; some modules created but not fully wired at that point). [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/implementation-summary.md:48-49`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/implementation-summary.md:271-281`]
- `003` delivered canonical-path dedup and deterministic tier precedence as invariants. [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/003-index-tier-anomalies/implementation-summary.md:41-44`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/003-index-tier-anomalies/implementation-summary.md:73-75`]
- `004` delivered frontmatter normalization + migration idempotency and successful reindex, while deferring some operational controls. [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-frontmatter-indexing/implementation-summary.md:41-44`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-frontmatter-indexing/implementation-summary.md:65-74`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-frontmatter-indexing/implementation-summary.md:105-106`]
- `005` completed session auto-detection hardening, with residual mtime-bias risk documented. [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-auto-detected-session-bug/implementation-summary.md:37`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-auto-detected-session-bug/implementation-summary.md:95-96`]

### Top Current-State Findings

1. Runtime wiring for graph search is now active and preserved across DB reinit. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:566-576`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:84-92`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:147-151`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/db-state-graph-reinit.vitest.ts:9-41`]
2. There are still high-value correctness seams (graph-result contract shape mismatch, deep-mode expansion propagation gap, source-provenance loss in dedup). [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:66-74`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:41-45`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:276-288`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1249-1252`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:384-387`]
3. Observability primitives are strong (retrieval trace + telemetry), but documentation and schema semantics are drifting from implementation details. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/contracts/retrieval-trace.ts:13-41`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:24-39`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:94-113`]
4. Test surface is broad, but key runtime paths still have deferred/skipped coverage segments. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:10-27`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1119-1124`]

---

## 3. Executive Overview

The platform already has a mature layered architecture (L1-L7), a rich hybrid retrieval pipeline, resilient indexing safeguards, and observability foundations. The highest leverage is no longer adding new retrieval primitives; it is tightening contracts between existing components, eliminating seam-level ambiguity, and automating drift detection between code, tests, and docs.

The current system is powerful but not yet fully self-defending. It needs contract hardening + automated governance loops to become reliably smarter over time.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:38-101`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:775-1032`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:585-657`]

---

## 4. Current Architecture Map

### End-to-End Retrieval Path (Observed Runtime)

```text
Caller
  -> L1 memory_context
      - mode + intent + pressure policy
      - strategy routing (quick/deep/focused/resume)
      -> L2 memory_search
          - query validation, intent detect, cache keying
          - deep mode expansion (mode=deep only)
          - hybrid search with fallback
              - vector + FTS + BM25 + graph (if graph fn wired)
          - post-search pipeline
              - state filter
              - session/causal boosts
              - intent/artifact weighting
              - cross-encoder rerank
              - TRM evidence-gap check
          - formatter + optional content/anchors
          - trace + telemetry metadata
```

### Runtime Wiring Map

- Startup initializes graph search function, injects into `hybridSearch.init(...)`, and mirrors same wiring into DB-state reinit. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:566-576`]
- Reinit logic rehydrates hybrid search with the same `graphSearchFnRef`, and regression test verifies the contract. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:147-151`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/db-state-graph-reinit.vitest.ts:36-41`]
- L1 orchestration exposes five modes and pressure-policy override behavior. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:202-240`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:447-479`]
- L2 pipeline includes trace stages and telemetry insertion points through candidate/fusion/rerank/final. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1147-1153`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:894-905`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:965-989`]

---

## 5. Capability Inventory (Current State)

| Capability Domain | Current State | Evidence |
|-------------------|---------------|----------|
| Layered MCP architecture | Mature 7-layer model with token budgets and tool-to-layer mapping | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:38-101`] |
| Tooling breadth | 23 tool definitions aggregated across L1-L7 | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:289-320`] |
| Hybrid retrieval | Active vector + FTS + BM25 + graph path with fallback and post-fusion enhancements | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:337-353`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1301-1417`] |
| Deep-mode semantics | Query expansion exists but only runs when `mode === 'deep'` | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1249-1252`] |
| Evidence confidence | TRM evidence-gap signal integrated into output summary and metadata | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:907-925`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:137-169`] |
| Indexing safety | Canonical dedup, incremental categorization, mtime update only after successful indexing | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:492-507`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:585-591`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:649-657`] |
| Parser quality gates | Spec document typing, canonical spec-folder extraction, quality score/flags extraction | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:160-170`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:242-270`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:290-315`] |
| Crash/recovery + audit | Pending-file transaction recovery and append-only mutation ledger triggers | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:13-16`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:155-203`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:76-81`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:191-202`] |
| Observability primitives | Retrieval trace contracts and telemetry model implemented, feature-flagged default-on | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/contracts/retrieval-trace.ts:13-41`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:13-18`] |
| Feature flag behavior | Default-on opt-out pattern (`false` disables) | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/rollout-policy.ts:36-41`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:9-30`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts:9-12`] |

---

## 6. Failure Mode Inventory (High-Value)

| ID | Failure Mode | Impact | Severity | Evidence |
|----|--------------|--------|----------|----------|
| FM-01 | Graph result contract mismatch (`mem:edgeId` and edge-level payload vs formatter expecting memory-row shape) | Retrieval output may be structurally inconsistent; downstream ranking/format assumptions weaken | P0 | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:66-74`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:41-45`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:41-50`] |
| FM-02 | Deep-mode expansion is conditionally implemented but not propagated from `memory_context` deep strategy | Reduced recall and "deep" behavior mismatch for L1 callers | P0 | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:276-288`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1249-1252`] |
| FM-03 | Multi-source provenance dropped during hybrid dedup | Debuggability and explainability degrade; channel attribution unclear | P1 | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:384-387`] |
| FM-04 | File write and DB index are not fully atomic | Partial-success states require manual recovery path (file exists but DB missing) | P1 | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1593-1599`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1630-1636`] |
| FM-05 | Documentation/contract drift across architecture descriptors | Operational misunderstandings and incorrect tuning decisions | P1 | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:63-64`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:340-343`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:44`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:321-322`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:94-113`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:121-134`] |
| FM-06 | Critical runtime paths have deferred/skipped test depth | Regressions can escape despite broad test count | P1 | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:10-27`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1119-1124`] |
| FM-07 | Known operational risks remain from previous specs (latency proof gaps, deferred controls, residual mtime bias risk) | Reliability confidence gap persists under production pressure | P1 | [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/implementation-summary.md:271-281`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-frontmatter-indexing/implementation-summary.md:105-106`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-auto-detected-session-bug/implementation-summary.md:95-96`] |

---

## 7. Test Coverage Observations

### Strengths

- Dedicated suites validate retrieval telemetry, retrieval trace contracts, graph wiring reinit, and evidence-gap logic. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:37-57`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:27-45`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/db-state-graph-reinit.vitest.ts:9-41`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/evidence-gap-detector.vitest.ts:1-13`]
- Regression tests for canonicalization and index safeguards exist from prior specs and remain relevant to 006 hardening direction. [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/003-index-tier-anomalies/implementation-summary.md:47-49`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-frontmatter-indexing/implementation-summary.md:61-63`]

### Gaps

- `handler-memory-search` suite is explicitly deferred for DB fixtures and mostly checks exports/input validation, leaving core ranking behavior under-tested at handler level. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:10-27`]
- Embedding-provider-dependent vector search tests are skipped, reducing confidence around production-like ranking paths. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1119-1124`]
- Documentation claims around test/file/system shape are internally inconsistent, increasing false confidence risk if read as operational truth. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:93-99`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:234-243`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:289-320`]

---

## 8. Automation Opportunities (High ROI)

1. Contract-sync CI for docs vs code
- Auto-generate tool counts and channel descriptors from `tool-schemas.ts` + retrieval modules into README fragments.
- Fail CI when manual README claims diverge from code-derived metrics.
- Evidence basis: current claim drift in channel/tool/test descriptors. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:63-64`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:340-343`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:289-320`]

2. Retrieval contract tests as release gates
- Add strict schema assertions for graph results entering formatter (`id`, `file_path`, `spec_folder`, `source`, `score`, `provenance`).
- Add explicit deep-mode propagation tests from L1 to L2.
- Evidence basis: FM-01 and FM-02 seams. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:66-74`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:276-288`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1249-1252`]

3. Self-healing index/retrieval health loop
- Schedule `memory_index_scan` + alias conflict check + targeted `memory_health(reportMode='divergent_aliases')` and publish actionable summaries.
- Evidence basis: index scan already reports alias conflicts and causal-chain creation hooks. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:733-748`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:659-721`]

4. Telemetry schema validation pipeline
- Version and validate `_telemetry` envelope against a JSON schema generated from `retrieval-telemetry.ts`.
- Catch naming drift between implementation and docs automatically.
- Evidence basis: README/model mismatch. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:94-113`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:121-134`]

5. Mutation/recovery reliability sweeps
- Scheduled recovery audit on pending files + mutation ledger append-only verification.
- Evidence basis: transaction manager recovery and ledger immutability are already implemented and measurable. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:209-264`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:191-202`]

---

## 9. Implementation Options (At Least 3)

### Estimation Method (for durations, confidence, and KPI framing)

- Duration ranges are planning estimates derived from 006 phase/task decomposition plus analogous effort recorded in 002-005 implementation summaries.
- Confidence labels use evidence density: `High` (multiple A-grade code sources + test coverage), `Medium-High` (A-grade code sources with one or more unresolved runtime assumptions), `Medium` (requires broader refactor assumptions).
- KPI targets are governance targets for 006 release gates, not claims of current measured production values.

Method evidence:
[SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/plan.md:173-180`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/tasks.md:49-127`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/implementation-summary.md`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/003-index-tier-anomalies/implementation-summary.md`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-frontmatter-indexing/implementation-summary.md`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-auto-detected-session-bug/implementation-summary.md`]

### Option A: Contract-Hardening Patchset (Incremental, 2-3 weeks)

Scope:
- Fix FM-01 and FM-02 directly.
- Preserve current architecture; add targeted tests and CI gates.
- Normalize telemetry/readme drift enough for trustworthy operations.

Pros:
- Fastest path to reduce correctness risk.
- Low migration risk and minimal blast radius.
- Aligns with 006 "audit-first hardening" intent.

Cons:
- Keeps structural complexity and some legacy coupling.
- Does not fully solve provenance model limitations.

Confidence: High.

Supporting evidence: [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/spec.md:63-67`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:384-387`]

---

### Option B: Contract-First Retrieval Platform (Moderate refactor, 4-6 weeks)

Scope:
- Introduce canonical typed retrieval contracts (request/response/provenance) and schema validators.
- Unify formatter expectations with all channel outputs.
- Generate operational docs directly from contracts and tool schema.

Pros:
- Strong long-term bug prevention through invariant enforcement.
- Makes observability and debugging materially better.
- Creates durable foundation for future adaptive/autonomous behavior.

Cons:
- Medium complexity and wider change surface.
- Needs careful rollout to avoid temporary friction.

Confidence: Medium-High.

Supporting evidence: [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:41-45`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/contracts/retrieval-trace.ts:60-66`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:289-320`]

---

### Option C: Graph-First Unified Fusion Engine (Large refactor, 8-12 weeks)

Scope:
- Promote graph channel to first-class memory-node retrieval with explicit provenance arrays and edge/memory dual indexing.
- Replace opportunistic dedup with provenance-preserving fusion model.
- Rebalance ranking around graph confidence + retrieval confidence calibration.

Pros:
- Highest ceiling for "smart, interconnected, useful" retrieval.
- Better support for causal reasoning and decision lineage queries.

Cons:
- Highest execution risk and longest stabilization period.
- Requires substantial test fixture redesign and performance tuning.

Confidence: Medium.

Supporting evidence: [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:49-74`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:384-387`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:248-252`]

---

### Option D: Autonomous Quality Loop Overlay (Complementary, 3-4 weeks)

Scope:
- Add daily/CI autonomous checks for invariant drift, telemetry anomalies, and index-health deltas.
- Auto-open actionable defect reports with trace links and failing examples.

Pros:
- Strong automation gain with modest architecture impact.
- Speeds detection and triage cycle.

Cons:
- Can create alert noise without tuned thresholds.
- Depends on telemetry consistency first.

Confidence: Medium-High.

Supporting evidence: [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:965-989`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:733-748`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:209-220`]

---

## 10. Recommended Strategy

Recommended sequence: **A -> B**, with selective elements of D during B.

Rationale:

1. 006 asks for hardening and bug-prevention controls now; Option A directly addresses highest-severity seams quickly.
2. Option B converts those fixes into stable systemic safeguards (contracts, generated docs, schema-checked telemetry).
3. Option D can be layered once telemetry contracts are stabilized to avoid noisy automation loops.

This sequence delivers immediate risk reduction without sacrificing long-term leverage.

[SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/spec.md:99-101`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:13-18`]

---

## 11. Prioritized Roadmap

### P0 (Immediate, Week 1-2)

1. Close FM-01 graph/formatter contract mismatch with explicit schema + compatibility adapter.
2. Pass `mode: 'deep'` through L1 deep strategy and add integration test that confirms expansion path executes.
3. Add release-gate tests for channel-output shape and deep-mode behavior.
4. Add one source-of-truth script to compute README tool/channel counts from code.

Success criteria:
- No failing contract assertions in CI.
- Deep mode from `memory_context` demonstrably triggers query variants.
- README metrics generated and drift-protected.

### P1 (Short term, Week 3-6)

1. Provenance-preserving fusion result model (`sources[]`) replacing single-source overwrite.
2. Telemetry schema versioning and validator in CI.
3. Strengthen handler-level integration tests (DB fixture-backed, not export-only).
4. Turn deferred prior-spec controls into explicit gates (latency measurement, monitoring, runbook checks).

### P2 (Mid term, Week 7-12)

1. Graph-first ranking enhancements and causal confidence model.
2. Autonomous anomaly detection and issue generation from telemetry + index health.
3. Continuous regression corpus from 003/004/005 failure classes and new 006 seam classes.

Roadmap basis:
[SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/tasks.md:51-55`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/tasks.md:91-95`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/tasks.md:111-114`]

---

## 12. Concrete Bug-Eradication Strategy

### Principle

Move from "fix discovered bugs" to "enforce invariant families" at build, test, and runtime boundaries.

### Bug Classes and Countermeasures

1. Contract-shape bugs (payload incompatibility)
- Countermeasure: typed schema validators on every retrieval channel boundary.
- Gate: fail CI on any shape mismatch.

2. Mode propagation bugs (feature exists but not activated end-to-end)
- Countermeasure: end-to-end mode propagation tests (L1 -> L2 -> pipeline stage evidence).
- Gate: trace must show expected stage markers for deep mode variants.

3. Provenance loss bugs (information dropped during dedup/fusion)
- Countermeasure: preserve multi-source attribution arrays and assert non-empty provenance for fused results.
- Gate: dedup stage tests must retain source cardinality.

4. Atomicity/recovery bugs
- Countermeasure: explicit partial-success state handling, pending-file recovery sweep tests, and ledger correlation checks.
- Gate: no orphaned pending files after test suite; recovery metrics stable.

5. Drift bugs (docs/tests/config diverge from runtime reality)
- Countermeasure: generated docs, schema snapshots, and deterministic drift checks in CI.
- Gate: docs must be generated from current code signatures.

Current evidence for these bug classes:
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:66-74`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:276-288`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:384-387`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1593-1599`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:63-64`]

---

## 13. Concrete Observability Strategy

### Goal

Provide query-level explainability and system-level reliability signals that are machine-checkable and actionable.

### Observability Model

1. Trace-first instrumentation
- Make retrieval trace mandatory for all non-trivial retrieval runs.
- Include stage durations and input/output cardinality across candidate/filter/fusion/rerank/fallback/final-rank.
- Existing base: trace contracts and trace insertion points already in place.
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/contracts/retrieval-trace.ts:13-41`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:894-905`]

2. Telemetry schema governance
- Version `_telemetry` payload and validate serialized structure.
- Align README and runtime fields through generated docs.
- Existing base: telemetry create/record/toJSON pipeline.
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:74-103`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:209-220`]

3. Golden metrics (SLO-oriented)
- `fallback_rate` (target: low and stable)
- `evidence_gap_rate` (track confidence quality)
- `deep_mode_variant_activation_rate` (should be near 100% for deep queries)
- `index_alias_conflict_groups` (should trend to zero)
- `partial_save_rate` (memory_save partial-success state)

4. Alerts and triage
- Alert on sudden jumps in fallback/evidence-gap/partial-save rates.
- Auto-attach latest traces and index scan alias conflict details for triage.

5. Operational dashboards
- Dashboard panes by stage latency and quality-proxy distribution.
- Split by mode (`auto`, `deep`, `focused`, `resume`) and intent class.

---

## 14. Governance and Release-Gate Strategy

### Required Release Gates

1. Contract gate
- Graph, hybrid, and formatter payload schema compatibility must pass.

2. Regression gate
- Include explicit scenarios for alias path duplication, tier precedence drift, and wrong-folder selection.

3. Performance gate
- Empirical latency checks for `mode="auto"` and `mode="deep"` under representative DB load.

4. Documentation gate
- Regenerated architecture/tool/telemetry docs must match code snapshots.

5. Observability gate
- Trace and telemetry payloads must be present and schema-valid for required retrieval classes.

Alignment basis:
[SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/spec.md:113-117`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/spec.md:123-126`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/checklist.md:124-149`]

---

## 15. KPI Targets for 006 Upgrade Program

| KPI | Baseline Observation | Target |
|-----|----------------------|--------|
| Contract violation count in retrieval path | Non-zero risk (FM-01/FM-02 known) | 0 P0 contract violations |
| Deep mode activation fidelity | Potentially degraded through L1 path | 100% deep path activation from L1 deep requests |
| Provenance retention in fused results | Known limitation in dedup | `sources[]` retained for all fused items |
| Partial save incidence | Supported partial-success path exists | measurable, alertable, and downward trend |
| Drift incidents (docs vs runtime) | Multiple drifts observed | 0 unmanaged drift incidents (CI enforced) |

Evidence basis:
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:384-387`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:276-288`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1249-1252`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1630-1636`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:63-64`]

---

## 16. Open Questions and Unknowns

1. Should graph channel results represent edges, memory nodes, or dual objects with explicit translation layer before formatter?
2. Should deep-mode query expansion be user-visible in telemetry/debug payload by default?
3. How frequently should the benchmark corpus be refreshed while preserving comparability against the release-gate targets (`auto <= 120ms`, `deep <= 180ms`, overhead `<= 12%`)?
4. Should evidence-gap detector integrate `predictGraphCoverage()` as an early-stage gate in runtime, or remain test-only utility for now?

Related evidence:
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:49-74`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:81-124`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:24-27`]

---

## 17. Source Index

### 006 Program Documents

- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/spec.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/plan.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/tasks.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/checklist.md`

### Prior Specs (Continuity)

- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/implementation-summary.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/003-index-tier-anomalies/implementation-summary.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-frontmatter-indexing/implementation-summary.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-auto-detected-session-bug/implementation-summary.md`

### MCP Runtime and Libraries

- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/rollout-policy.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/contracts/retrieval-trace.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts`
- `.opencode/skill/system-spec-kit/mcp_server/README.md`

### Test Evidence

- `.opencode/skill/system-spec-kit/mcp_server/tests/db-state-graph-reinit.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts`
