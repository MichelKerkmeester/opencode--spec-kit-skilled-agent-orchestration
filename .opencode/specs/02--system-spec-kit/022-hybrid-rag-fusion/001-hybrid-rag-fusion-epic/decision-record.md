---
title: "Consolidated decision-record"
---
# Consolidated decision-record
<!-- SPECKIT_TEMPLATE_SOURCE: consolidated-epic-merge | v1 -->

Consolidated from the following source docs:
- sources/000-feature-overview/decision-record.md
- sources/002-hybrid-rag-fusion/decision-record.md
- sources/006-hybrid-rag-fusion-logic-improvements/decision-record.md

<!-- AUDIT-2026-03-08: Historical folder name mapping for consolidated source references below.
  Pre-consolidation name         → Current folder
  002-hybrid-rag-fusion          → 002-indexing-normalization
  003-index-tier-anomalies       → 002-indexing-normalization
  004-frontmatter-indexing       → 002-indexing-normalization
  006-hybrid-rag-fusion-logic-improvements → content merged into this epic (001-hybrid-rag-fusion-epic)
-->

## Source: 000-feature-overview

---
title: "Decision Record: Hybrid RAG Fusion Refinement"
description: "Program-level ADR for how remediation and alignment are executed in the 8-sprint hybrid RAG refinement effort."
# SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2
trigger_phrases:
  - "hybrid rag decision record"
  - "sprint 140 adr"
  - "alignment remediation decision"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Hybrid RAG Fusion Refinement

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Canonical-first, bounded-remediation workflow

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-28 |
| **Deciders** | Spec Kit maintainers |

---

### Context

The program reached late-stage drift where policy language and validator-state differed across global skill docs and sprint-local spec documentation. This created two risks: (1) conflicting interpretation of comment/header and feature-flag lifecycle rules, and (2) completion claims while Level 3+ validator errors were still unresolved.

---

### Decision

We apply remediation in this order:

1. Update canonical guidance with bounded edits only.
2. Propagate only required local sprint-doc clarifications.
3. Close validator error-class debt before claiming folder closure.

This sequence keeps scope tight while preserving traceability and reduces repeated divergence.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Canonical-first bounded remediation (Chosen)** | Minimal churn, clear source-of-truth, reduced rework | Requires disciplined scope lock | 9/10 |
| Local-only sprint-doc fixes first | Fast local progress | High chance of re-divergence from canonical policy | 6/10 |
| Broad rewrite of skill + spec docs | Potential one-pass consistency | High risk, high review burden, scope creep | 4/10 |

---

### Consequences

**Benefits**:

- Reduces policy ambiguity with small, auditable deltas.
- Keeps sprint docs synchronized to one canonical contract.
- Converts validator debt from latent blocker to explicit remediation work.

**Costs**:

- Requires additional metadata normalization work (template-source headers and root-file restoration).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Manual-gate language interpreted as weaker enforcement | Medium | Keep explicit P1 severity language in checklist and skill docs |
| Broad workspace noise obscures scoped improvements | Medium | Use file-scoped verification and targeted review gate |

---

### Five Checks Evaluation

| # | Check | Result |
|---|-------|--------|
| 1 | Necessary now? | PASS |
| 2 | Beyond local maxima? | PASS |
| 3 | Simplest sufficient path? | PASS |
| 4 | On critical path? | PASS |
| 5 | Avoids unnecessary debt? | PASS |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Parallel multi-agent remediation for full codebase review

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-01 |
| **Deciders** | Spec Kit maintainers |

---

### Context

A 25-agent thorough review of the MCP server codebase identified ~65 issues spanning P0 blockers, P1 required fixes, and P2 suggestions. The issues touched ~50 files across handlers, lib modules, search pipeline, cognitive subsystem, eval framework, cache layer, and tests. Sequential remediation would be prohibitively slow given the scope.

---

### Decision

Execute remediation in 5 sequential waves with parallel agents within each wave:

1. **Wave 1 (P0):** 4 parallel agents — each assigned to an independent file with a P0 blocker
2. **Wave 2 (P1 code):** 6 parallel agents — partitioned by subsystem (scoring, flags, mutations, cache, cognitive, eval)
3. **Wave 3 (P1 standards):** 3 parallel agents — bulk header conversion, test cleanup, structural fixes
4. **Wave 4 (P2):** 2 parallel agents — performance and safety/config
5. **Wave 5 (docs):** 1 agent — documentation fixes across sprint folders

Each wave verified with `tsc --noEmit` + full test suite before proceeding. Test failures from behavioral changes fixed between waves.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Parallel wave execution (Chosen)** | High throughput, wave gates catch regressions, independent file assignments prevent conflicts | Requires careful partitioning to avoid file collisions | 9/10 |
| Sequential single-agent | No collision risk, simple | ~68 fixes would take many hours sequentially | 4/10 |
| All-at-once parallel | Maximum speed | High risk of file conflicts, difficult verification | 3/10 |

---

### Consequences

**Benefits**:

- ~68 fixes completed in 5 waves with up to 16 concurrent agents
- Wave-gated verification caught 7 test failures early (before cascading)
- File-level partitioning eliminated merge conflicts between agents

**Costs**:

- Required careful pre-planning to assign independent files to each agent
- Test fixups between waves added overhead (7 failures across all waves)

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Agent modifying same file as another agent | High — merge conflicts | Strict file-level partitioning in wave assignments |
| Behavioral changes breaking unrelated tests | Medium — test failures | Full test suite run between waves; fix before proceeding |
| Over-scope from P2 suggestions | Low — scope creep | P2 limited to defensive changes (caps, guards, comments) |

---

### Five Checks Evaluation

| # | Check | Result |
|---|-------|--------|
| 1 | Necessary now? | PASS — P0 blockers included race conditions and data corruption risks |
| 2 | Beyond local maxima? | PASS — systematic review vs ad-hoc bug hunting |
| 3 | Simplest sufficient path? | PASS — wave structure is minimal coordination overhead |
| 4 | On critical path? | PASS — P0 blockers affected production reliability |
| 5 | Avoids unnecessary debt? | PASS — P2 items are defensive, not speculative |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002 -->

## Source: 002-hybrid-rag-fusion

---
title: "Decision Record: 138-hybrid-rag-fusion [002-hybrid-rag-fusion/decision-record]"
description: "Context: The RAG pipeline requires Tri-Hybrid execution (Dense, Sparse, Graph), leading to initial assumptions that the system must migrate to Qdrant (vectors), Neo4j (graph), a..."
trigger_phrases:
  - "decision"
  - "record"
  - "138"
  - "hybrid"
  - "rag"
  - "decision record"
  - "002"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Decision Record: 138-hybrid-rag-fusion

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- ANCHOR: decision-architecture-138 -->
## D1: Utilizing Native SQLite over External Databases
**Context:** The RAG pipeline requires Tri-Hybrid execution (Dense, Sparse, Graph), leading to initial assumptions that the system must migrate to Qdrant (vectors), Neo4j (graph), and Elasticsearch (BM25 keyword search) to achieve scale.
**Decision:** Maintain the v15 SQLite database schema exclusively.
**Rationale:** 
1. SQLite `FTS5` provides enterprise-grade, high-performance BM25 sparse retrieval natively. 
2. SQLite `sqlite-vec` extension handles dense embeddings locally with SIMD acceleration. 
3. SQLite `WITH RECURSIVE` CTEs execute incredibly fast 2-hop graph traversals. 
Keeping the stack strictly inside SQLite guarantees zero schema migrations, avoids massive distributed-transaction logic (preventing orphaned records across 3 different database platforms), and keeps the MCP server hyper-portable for offline and edge deployment. The administrative overhead of managing Neo4j for a local memory MCP is unacceptable.
<!-- /ANCHOR: decision-architecture-138 -->

<!-- ANCHOR: decision-fusion-algorithm-138 -->
## D2: Reciprocal Rank Fusion (RRF) over Min-Max Scaling
**Context:** The MCP server must fuse scores from FTS5 (BM25 scores are unbounded [0, ∞)) and Vector search (Cosine embeddings are bounded [-1, 1]). Normalizing these via standard mathematics is virtually impossible due to score compression.
**Decision:** Exclusively use Ordinal Reciprocal Rank Fusion (`Σ 1 / (60 + rank)`).
**Rationale:** Attempting to mathematically normalize highly divergent score distributions (Min-Max scaling) introduces extreme volatility and breaks down entirely when one search method returns anomalous spikes. RRF bypasses the absolute scores entirely, focusing solely on the ordinal rankings. A document that ranks 3rd in Vector and 2nd in FTS5 receives a massive cumulative score. This protects the system from extreme outliers and guarantees highly reliable consensus matching across completely disjointed data structures.
<!-- /ANCHOR: decision-fusion-algorithm-138 -->

<!-- ANCHOR: decision-diversity-138 -->
## D3: Post-Fusion Maximal Marginal Relevance (MMR)
**Context:** Standard vector search frequently returns 5 near-identical versions of the same file or implementation summary. This wastes the strict 2000-token LLM payload budget of the MCP server, directly contributing to "Lost in the Middle" LLM amnesia.
**Decision:** Introduce true cosine-similarity MMR logic *after* RRF fusion, written in pure TypeScript.
**Rationale:** Sending redundant information severely dilutes the LLM's attention mechanism. MMR mathematically penalizes candidates that are too semantically similar to documents already selected for the final payload. This squeezes maximum informational diversity into the smallest possible token footprint. 

**Rejection of Vector-Level MMR:** We rejected running MMR at the database level because we need to calculate MMR on the *fused* array (which contains FTS5 and Graph results, not just vectors). The O(N²) calculation cost of doing this in TypeScript is completely mitigated because it only runs on the top-20 truncated RRF candidates (N=20). 20² = 400 operations, which executes in <2ms in Node.js, eliminating any risk of blocking the single-threaded event loop.
<!-- /ANCHOR: decision-diversity-138 -->

<!-- ANCHOR: decision-query-expansion-138 -->
## D4: Server-Side Template Expansion over LLM Expansion
**Context:** RAG Fusion (Multi-Query Retrieval) requires generating 3 derivative queries from the user's single prompt to maximize recall and bypass vocabulary mismatch. Typically, this is done by prompting a fast LLM.
**Decision:** Use a rule-based/template-based synonym and decomposition generator on the server side instead of an LLM.
**Rationale:** The **"LLM-in-MCP Paradox"** states that the MCP server is called *by* the LLM. If the MCP server pauses to call an LLM internally to generate query variants, it introduces a circular dependency, and network latency skyrockets into the multi-second range (breaking the 120ms max-latency budget for `mode="auto"`). Template-based regex rules and domain vocabularies add <5ms overhead, keeping the system highly responsive while still achieving the recall benefits of multi-query routing.
<!-- /ANCHOR: decision-query-expansion-138 -->

<!-- ANCHOR: decision-graph-traversal-138 -->
## D5: BFS over DFS for Spreading Activation
**Context:** The `co-activation.ts` module traverses the memory graph to find temporally or contextually related memories.
**Decision:** Exclusively use Breadth-First Search (BFS) bounded by a hard `maxDepth=2` and `maxResults=20`.
**Rationale:** Depth-First Search (DFS) on an unconstrained causal graph risks "topic drift"—navigating so far down a causal chain that the retrieved memory has zero relevance to the user's initial query. BFS ensures that spreading activation stays strictly adjacent to the highly relevant "seed" nodes retrieved by the Tri-Hybrid search, pulling in immediate context rather than tangential history.
<!-- /ANCHOR: decision-graph-traversal-138 -->

## Context

This phase consolidates hybrid-retrieval intelligence features under strict latency and compatibility constraints.

## Consequences

- Positive: improved intent classification precision through centroid scoring.
- Positive: stronger evidence-based closure with explicit test coverage.
- Tradeoff: additional scoring internals increase module complexity slightly.

## D6: Consolidate Child Folders into Canonical 001/002 Layout

**Context:** The parent spec folder carried multiple active child folders and duplicate lifecycle surfaces, which made active-state ownership unclear after skill-graph deprecation.

**Decision:** Keep exactly two active children: the deprecated skill-graph experiment (now `001-hybrid-rag-fusion-epic`) and `002-hybrid-rag-fusion`; record merged non-lifecycle evidence in `002-hybrid-rag-fusion/supplemental/`.

**Rationale:** This removes duplicate active lifecycle surfaces, preserves evidence, and keeps deprecation and RAG tracks clearly separated.

**Consequences:**
- Positive: single canonical active RAG lifecycle set in `002-hybrid-rag-fusion`.
- Positive: deprecated skill-graph track remains isolated (now merged into `001-hybrid-rag-fusion-epic`).
- Tradeoff: historical references in legacy memory artifacts remain descriptive rather than authoritative.

## Source: 006-hybrid-rag-fusion-logic-improvements

---
title: "Decision Record: 006-hybrid-rag-fusion-logic-improvements [template:level_3+/decision-record.md]"
description: "Decision records for broad cross-system hardening across ranking, session/state integrity, telemetry governance, and prevention-first operations."
SPECKIT_TEMPLATE_SOURCE: "decision-record | v2.2"
trigger_phrases:
  - "decision"
  - "adr"
  - "hybrid rag fusion"
  - "governance"
  - "prevention"
importance_tier: "critical"
contextType: "decision"
---
# Decision Record: 006-hybrid-rag-fusion-logic-improvements

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Broad Audit-First Hardening Across All Discovered Risk Systems

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-22 |
| **Deciders** | Retrieval Maintainer, Platform Maintainer, QA Lead |

---

<!-- ANCHOR:adr-001-context -->
### Context

The original 006 framing was retrieval/fusion-centric. Research and continuity review showed material risk outside that narrow slice: graph relation contracts, cognitive ranking modifiers, session-learning quality, mutation/re-embedding consistency, parser/index health, storage recovery, telemetry schema drift, deferred test coverage, and operational readiness.

### Constraints

- Preserve existing SQLite-first architecture and avoid schema migration.
- Preserve carry-forward invariants from `002`, `003`, `004`, and `005`.
- Keep release safety based on measurable evidence and deterministic behavior.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: broaden 006 scope to full ten-subsystem hardening with explicit requirement -> phase -> task traceability.

**How it works**: Phase 1 locks baselines across all scoped systems; phases 2-4 implement ranked/channel, state-integrity, and governance/operations controls; phase 5 closes verification and sign-off. No subsystem discovered in research remains implicit or untracked.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Broad cross-system hardening (Chosen)** | Prevents silent failures across dependent systems; strongest continuity | Higher implementation and verification scope | 9/10 |
| Retrieval/fusion-only hardening | Faster initial delivery | Leaves discovered systemic risks unresolved | 4/10 |
| Two-stage plan with future phase for remaining systems | Lower immediate complexity | Defers known high-impact risks without guarantees | 6/10 |

**Why this one**: It is the only option that fully addresses discovered risk surface while preserving architecture continuity.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Risk controls become systemic rather than local to ranking internals.
- Governance and operational readiness become enforceable release criteria.

**What it costs**:
- Increased complexity and broader verification burden.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope expansion slows delivery | M | Enforce phase gates and critical-path discipline |
| Additional controls increase false positives initially | M | Use bounded threshold tuning and holdout fixtures |
| Multi-subsystem coupling complicates triage | H | Require telemetry schema governance and runbook drills |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Research identified critical non-retrieval risks requiring direct controls. |
| 2 | **Beyond Local Maxima?** | PASS | Retrieval-only and staged alternatives were evaluated and rejected. |
| 3 | **Sufficient?** | PASS | Ten-subsystem scope maps all discovered risks to enforceable controls. |
| 4 | **Fits Goal?** | PASS | Aligns with user-requested broadened plan across relevant systems. |
| 5 | **Open Horizons?** | PASS | Preserves architecture while improving operational maturity. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Expanded requirements, phases, tasks, checklist, and baseline implementation summary.
- Added subsystem-specific thresholds and acceptance gates.
- Added sign-off consistency model across docs.

**How to roll back**: keep baseline fixtures, revert phase-specific controls in reverse order, re-run deterministic regression + recovery suites.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Unified Ranking Contract for Fusion, Graph Relations, and Cognitive Modifiers

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-22 |
| **Deciders** | Retrieval Maintainer, Session Maintainer |

### Context

Fusion scores, graph relation scores, and cognitive/FSRS modifiers influence final ranking. Without one bounded contract, ranking can drift and become difficult to explain or verify.

### Decision

Define one ranking contract with explicit contribution bounds, deterministic fallback ordering, and ablation-based quality guardrails. Graph relations and cognitive modifiers are first-class but bounded contributors.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Unified bounded ranking contract (Chosen)** | Consistent behavior, testable guardrails | Requires calibration and additional tests | 8.5/10 |
| Independent scoring subsystems | Faster local evolution | Cross-channel drift and debugging complexity | 5/10 |
| Disable cognitive modifiers | Simpler ranking path | Missed quality gains on long-tail recall | 6/10 |

### Consequences

- Positive: deterministic and explainable ranking behavior.
- Positive: measurable quality tradeoff boundaries via ablation tests.
- Tradeoff: tighter calibration loop and maintenance cost.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Multi-channel scoring is already active and requires contract governance. |
| 2 | **Beyond Local Maxima?** | PASS | Independent and simplified alternatives assessed. |
| 3 | **Sufficient?** | PASS | Bounds + ablation thresholds directly manage drift risk. |
| 4 | **Fits Goal?** | PASS | Supports broadened reliability and explainability objectives. |
| 5 | **Open Horizons?** | PASS | Enables future channels under the same contract model. |

**Checks Summary**: 5/5 PASS

### Implementation

- Add relation-scoring and cognitive-weight bounds.
- Add deterministic fallback sequencing tests.
- Emit debug metadata for score contribution rationale.

---

## ADR-003: State Integrity First for Session Learning, CRUD Re-Embedding, and Storage Recovery

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-22 |
| **Deciders** | Platform Maintainer, Engineering Lead, QA Lead |

### Context

Ranking quality is insufficient if session routing, memory mutation, index consistency, or transaction replay can drift. The highest-impact failures here are often silent and compound over time.

### Decision

Treat session quality, CRUD re-embedding consistency, parser/index invariants, and mutation-ledger recovery parity as one state-integrity domain with release-gated checks.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Unified state-integrity domain (Chosen)** | End-to-end consistency, fewer silent failures | Broader implementation touch points | 9/10 |
| Separate incremental fixes | Smaller local changes | Leaves cross-system drift unresolved | 5.5/10 |
| Manual audits only | Low coding overhead | Low repeatability and weak prevention | 3/10 |

### Consequences

- Positive: session, index, and storage behavior become jointly verifiable.
- Positive: mutation consistency and recovery gain objective pass/fail criteria.
- Tradeoff: expanded CI and recovery simulation runtime.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Existing lineage demonstrates recurring cross-state defect classes. |
| 2 | **Beyond Local Maxima?** | PASS | Local and manual alternatives evaluated and rejected. |
| 3 | **Sufficient?** | PASS | Unified gates directly address end-to-end state integrity risk. |
| 4 | **Fits Goal?** | PASS | Aligns with broadened systemic hardening objective. |
| 5 | **Open Horizons?** | PASS | Establishes reusable pattern for future stateful modules. |

**Checks Summary**: 5/5 PASS

### Implementation

- Add session misroute/latency gates and session-learning freshness checks.
- Add CRUD mutation-to-embedding SLA checks.
- Add parser/index invariant checks and ledger replay verification.

---

## ADR-004: Telemetry Schema Governance with Documentation Drift Gating

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-22 |
| **Deciders** | Operations Lead, QA Lead, Platform Maintainer |

### Context

Diagnostics become unreliable when emitted trace schema and documented fields diverge. This weakens incident triage and creates hidden operational risk.

### Decision

Introduce canonical trace schema validation in CI and enforce documentation drift checks so schema and docs must evolve together.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Schema + docs drift gate (Chosen)** | High diagnostic trust, objective enforcement | Requires schema registry maintenance | 8.5/10 |
| Schema validation without docs gate | Partial protection | Documentation drift still possible | 6/10 |
| Manual doc review only | Low tooling effort | High chance of mismatch and missed updates | 3/10 |

### Consequences

- Positive: operational diagnostics remain dependable.
- Positive: release-time detection of trace/schema mismatch.
- Tradeoff: additional maintenance for schema registry and docs checks.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Diagnostics are a critical dependency for expanded operations scope. |
| 2 | **Beyond Local Maxima?** | PASS | Schema-only and manual-review alternatives considered. |
| 3 | **Sufficient?** | PASS | Combined gate closes both emission and documentation drift. |
| 4 | **Fits Goal?** | PASS | Supports governance and operations reliability goals. |
| 5 | **Open Horizons?** | PASS | Enables consistent onboarding of future telemetry events. |

**Checks Summary**: 5/5 PASS

### Implementation

- Define schema registry and payload validators.
- Add docs drift comparison checks.
- Gate release on schema/docs alignment.

---

## ADR-005: Prevention-First Closure for Deferred Tests and Operational Self-Healing

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-22 |
| **Deciders** | QA Lead, Operations Lead, Product Owner |

### Context

Deferred/skipped tests and unpracticed runbooks create latent release risk. Prior specs resolved urgent defects but left some paths weakly covered.

### Decision

Treat deferred/skipped-path closure and self-healing runbook drills as release-gated outcomes, not optional follow-ups.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Release-gated closure + drills (Chosen)** | Strong recurrence prevention and operational readiness | More verification workload | 9/10 |
| Best-effort closure post-release | Faster release cadence | High recurrence risk | 4/10 |
| Manual checklist only | Simpler process | Weak evidence and enforceability | 3.5/10 |

### Consequences

- Positive: known weak paths are either tested or explicitly approved with ownership.
- Positive: operators have validated runbooks before release.
- Tradeoff: additional CI/runtime overhead and planning effort.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Prior lineage shows deferred paths can reintroduce failures. |
| 2 | **Beyond Local Maxima?** | PASS | Best-effort and manual alternatives evaluated. |
| 3 | **Sufficient?** | PASS | Explicit gates and drills directly reduce recurrence and MTTR risk. |
| 4 | **Fits Goal?** | PASS | Aligns with broadened prevention and operational resilience goals. |
| 5 | **Open Horizons?** | PASS | Establishes reusable verification discipline for future specs. |

**Checks Summary**: 5/5 PASS

### Implementation

- Build deferred/skipped-path inventory and closure tracker.
- Run operational drills for four failure classes.
- Record evidence and sign-off in checklist and implementation summary.

---

## Continuity Notes

- ADR-001 expands 006 scope while preserving architecture decisions from `002`.
- ADR-003 operationalizes defect-prevention lineage from `003` and `004` into state-integrity gates.
- ADR-002 and ADR-003 extend confidence behaviors from `005` across ranking and session-learning paths.
- ADR-004 and ADR-005 add governance and operations controls required for sustained reliability after implementation.

---

<!--
DECISION RECORD
Level 3+ ADR set aligned to broadened cross-system hardening scope and continuity requirements.
-->

---

## Source: 005-core-rag-sprints-0-to-9 (Sprint 9 / Productization Decisions)

<!-- AUDIT-2026-03-16: ADRs from 005-core-rag-sprints-0-to-9 appended here during folder merge.
  Original ADR IDs in source were ADR-001 through ADR-005; renumbered ADR-006 through ADR-010 to avoid conflicts. -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Use Zod for MCP Schema Validation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-03 |
| **Deciders** | User + 6 research agents (5/6 consensus) |

---

### Context

LLM agents calling MCP tools sometimes hallucinate parameters that don't exist. The current tool surface (~20 tools) has no strict input validation. Invalid parameters are silently ignored, leading to unpredictable behavior and wasted tool-call rounds.

### Constraints

- Must not reject currently-valid parameter combinations (backward compatibility)
- Validation overhead must be <5ms per call
- Error messages must be actionable (LLMs need to self-correct)

### Decision

**We chose**: Zod schemas with `.strict()` enforcement, gated behind `SPECKIT_STRICT_SCHEMAS` feature flag.

**How it works**: Each tool gets a Zod schema matching its current valid parameters. In strict mode, unexpected keys are rejected with a clear error. In passthrough mode (transition period), unexpected keys are accepted but logged.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Zod `.strict()`** | Type-safe, composable, great error messages, widely adopted | Additional dependency | 9/10 |
| Manual validation | No dependency | Verbose, error-prone, poor messages | 4/10 |
| JSON Schema (ajv) | Standard format | Heavier, worse TypeScript integration | 6/10 |
| io-ts | FP-style, composable | Steeper learning curve, smaller community | 5/10 |

**Why this one**: Zod is the TypeScript ecosystem standard for runtime validation. It produces human-readable error messages that LLMs can parse and self-correct from. The `.strict()` mode is exactly what we need.

### Consequences

**What improves**:
- LLM tool-call success rate increases (clear errors enable self-correction)
- Parameter documentation becomes code (schemas are the source of truth)
- Future schema changes are explicit and type-checked

**What it costs**:
- ~50KB dependency addition. Mitigation: Zod is already standard in the TypeScript ecosystem.
- Potential breakage for callers using undocumented parameters. Mitigation: `.passthrough()` transition period.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | LLM hallucination of parameters is a real, observed problem |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives evaluated; Zod wins on TypeScript integration |
| 3 | **Sufficient?** | PASS | Zod covers validation, typing, and error generation in one tool |
| 4 | **Fits Goal?** | PASS | Direct path to API hardening without refactoring internals |
| 5 | **Open Horizons?** | PASS | Schemas enable future OpenAPI generation and contract testing |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: In-Process Job Queue (Not Redis/External)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-03 |
| **Deciders** | User + 016 synthesis |

---

### Context

Bulk indexing of 100+ spec files can exceed MCP timeout limits. We need asynchronous job processing with state tracking. The question is where to run the queue.

### Constraints

- Memory MCP runs as a local single-user process
- No external infrastructure dependencies (local-first)
- Must survive server restarts (crash recovery)

### Decision

**We chose**: In-process job queue with SQLite persistence for state, no external queue system.

**How it works**: Jobs are managed in-memory with state transitions persisted to a `jobs` table in the existing SQLite database. On restart, incomplete jobs are detected and can be retried.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **In-process + SQLite** | Zero deps, local-first, crash recovery | Single-process concurrency limits | 9/10 |
| Redis queue (BullMQ) | Battle-tested, scalable | External dependency, overkill for single-user | 4/10 |
| File-based queue | Simple | No atomic state transitions, race conditions | 3/10 |

**Why this one**: The Memory MCP is a local-first, single-user system. Adding Redis for a job queue would violate the zero-dependency operational story. SQLite persistence provides crash recovery without external infrastructure.

### Consequences

**What improves**:
- Bulk indexing works reliably within MCP timeout constraints
- Job progress is queryable via standard MCP tool calls
- Zero operational overhead (no Redis to manage)

**What it costs**:
- Limited to single-process throughput. Mitigation: adequate for single-user; if multi-user needed, P2-8 daemon mode would address this.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | MCP timeouts on bulk operations are a real blocker |
| 2 | **Beyond Local Maxima?** | PASS | Redis considered and rejected for complexity reasons |
| 3 | **Sufficient?** | PASS | SQLite persistence handles crash recovery |
| 4 | **Fits Goal?** | PASS | Directly solves bulk indexing timeout problem |
| 5 | **Open Horizons?** | PASS | Queue pattern can scale to daemon mode later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: Feature Flags Over Breaking Changes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-03 |
| **Deciders** | User |

---

### Context

This sprint adds new behavior (strict validation, response envelopes, file watching) that could break existing consumers. We need a deployment strategy.

### Constraints

- Existing workflows must not break
- New features should be testable independently
- Rollback must be instantaneous (no code revert)

### Decision

**We chose**: Every new behavior behind a feature flag with conservative defaults. Risky features (file watcher, local reranker) default to OFF. Safe features (dynamic init, context headers) default to ON.

**How it works**: Environment variables following the existing `SPECKIT_` naming convention. Each feature can be toggled independently without code changes.

### Feature Flag Summary

| Flag | Default | Rationale |
|------|---------|-----------|
| `SPECKIT_STRICT_SCHEMAS` | `true` | High confidence from audit; `.passthrough()` available as escape hatch |
| `SPECKIT_RESPONSE_TRACE` | `false` | Opt-in to avoid token inflation |
| `SPECKIT_CONTEXT_HEADERS` | `true` | Low risk, high value, capped at 100 chars |
| `SPECKIT_FILE_WATCHER` | `false` | Risk of SQLITE_BUSY; opt-in until proven stable |
| `SPECKIT_DYNAMIC_INIT` | `true` | Zero risk, immediate value |
| `RERANKER_LOCAL` | `false` | Existing flag; hardware-dependent |

### Consequences

**What improves**:
- Zero-downtime deployment and rollback
- Individual feature testing and gradual rollout
- Existing workflows guaranteed unchanged

**What it costs**:
- Code complexity from flag checks. Mitigation: follow existing patterns (SPECKIT_ flags are already pervasive in the codebase).

### includeTrace Gating Behavior

The `includeTrace` parameter (default: `false`) controls whether provenance-rich trace data is included in search responses. When `includeTrace: true`:

- **Per-result envelope**: Each result includes `scores` (7 fields: semantic, lexical, fusion, intentAdjusted, composite, rerank, attention), `source` (file path, anchors, lastModified, memoryState), and `trace` (channelsUsed, pipelineStages, fallbackTier, queryComplexity, expansionTerms, budgetTruncated, scoreResolution).
- **Response-level extraData**: Pipeline-level metadata (retrieval trace, timing, query expansion) is spread into the response envelope only when `includeTrace` is enabled. When disabled, extraData is omitted to prevent unintended data exposure.
- **Environment override**: Setting `SPECKIT_RESPONSE_TRACE=true` enables trace data globally without requiring per-call `includeTrace: true`.

This gating ensures backward compatibility (no additional fields by default) and prevents token inflation in production use.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Breaking existing workflows is unacceptable |
| 2 | **Beyond Local Maxima?** | PASS | Alternative (versioned tools) is heavier and premature |
| 3 | **Sufficient?** | PASS | Covers all new features with independent toggles |
| 4 | **Fits Goal?** | PASS | Enables safe productization |
| 5 | **Open Horizons?** | PASS | Flags can be promoted to permanent once stable |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-008 -->

---

<!-- ANCHOR:adr-009 -->
## ADR-009: Defer P2 Items Until Demand-Driven Triggers

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-03 |
| **Deciders** | User + 016 synthesis |

---

### Context

5 of the 16 original recommendations are genuinely new but low-priority. Building them now risks premature abstraction and wasted effort.

### Constraints

- Engineering time is finite
- P0/P1 items deliver higher ROI
- P2 items have clear trigger conditions

### Decision

**We chose**: Explicitly defer all P2 items with documented trigger conditions. Do not build until the trigger fires.

| P2 Item | Trigger to Build |
|---------|-----------------|
| Daemon mode | MCP SDK standardizes HTTP transport |
| Storage adapters | Corpus exceeds 100K memories |
| Namespaces | Multi-tenant deployment demand |
| ANCHOR graph nodes | 2-day spike shows clear value |
| AST sections | Spec docs regularly exceed 1000 lines |

### Consequences

**What improves**:
- Focus on highest-ROI work
- No premature abstractions (storage adapters, namespaces)
- Each P2 item has a clear, measurable trigger

**What it costs**:
- Potential delay if a trigger fires unexpectedly. Mitigation: P2 items are well-documented in spec.md with implementation sketches ready to go.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Prevents wasted engineering effort |
| 2 | **Beyond Local Maxima?** | PASS | Each item evaluated individually |
| 3 | **Sufficient?** | PASS | Trigger conditions are specific and measurable |
| 4 | **Fits Goal?** | PASS | Aligns with "productization, not architecture" thesis |
| 5 | **Open Horizons?** | PASS | Items preserved with full implementation sketches |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-009 -->

---

<!-- ANCHOR:adr-010 -->
## ADR-010: No QMD Integration

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-03 |
| **Deciders** | User + comparative analysis |

---

### Context

QMD (by Tobias Lutke) was one of the 3 external systems analyzed by the research agents. It provides BM25, semantic, and hybrid search for Obsidian vaults. The question was whether to integrate it as an additional search backend.

### Decision

**We chose**: No integration. The Memory MCP already surpasses QMD's search capabilities (5-channel pipeline vs 3-mode search, causal graph, attention decay, evaluation framework). Integrating QMD would add a redundant search layer.

**What we learned from QMD**: The best patterns were already adopted as architectural inspiration for P0-1 (Zod schemas from QMD's strict tool contracts), P1-5 (local reranking from QMD's node-native approach), and P1-7 (file watching from QMD's auto-indexing).

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | FAIL | Existing search is stronger; integration adds no unique capability |
| 2 | **Beyond Local Maxima?** | PASS | Thoroughly analyzed (12 research docs, comparative matrix) |
| 3 | **Sufficient?** | N/A | Decision is to NOT integrate |
| 4 | **Fits Goal?** | PASS | Avoids unnecessary dependency |
| 5 | **Open Horizons?** | PASS | Can revisit if QMD adds unique capabilities later |

**Checks Summary**: Decision correctly deferred — QMD's value was in architectural inspiration, not direct integration.
<!-- /ANCHOR:adr-010 -->
