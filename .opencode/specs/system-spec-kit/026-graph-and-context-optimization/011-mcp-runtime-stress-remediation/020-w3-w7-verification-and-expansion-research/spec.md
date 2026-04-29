---
title: "Research Charter: W3-W7 Verification & Enterprise-Readiness Expansion"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "10-iteration deep research charter: verify W3-W7 wiring, surface adjacent/connecting opportunities, identify expansion candidates for enterprise readiness, and audit system-spec-kit + mcp_server for deletable empty code folders."
trigger_phrases:
  - "020-w3-w7-verification-and-expansion-research"
  - "W3-W7 verification research"
  - "enterprise readiness search RAG"
  - "trust tree rerank shadow weights cocoindex degraded research"
  - "empty folder audit system-spec-kit mcp_server"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/020-w3-w7-verification-and-expansion-research"
    last_updated_at: "2026-04-29T06:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Completed W3-W7 verification + expansion deep research"
    next_safe_action: "Use research/research-report.md Planning Packet to seed Phase G remediation"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Research Charter: W3-W7 Verification & Enterprise-Readiness Expansion

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Parent** | `011-mcp-runtime-stress-remediation` |
| **Predecessor** | `019-search-query-rag-optimization-research` (Phase C, converged) |
| **Implementation reviewed** | `005-review-remediation/{006-search-query-rag-optimization, 007-search-rag-measurement-driven-implementation}` |
| **Mode** | Deep research (`/spec_kit:deep-research:auto` pattern) |
| **Iterations** | 10 (max); convergence allowed earlier |
| **Executor** | cli-codex `gpt-5.5` reasoning=`xhigh` service-tier=default (normal) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phases C–E delivered W3 (composed RAG trust tree), W4 (conditional rerank, now default-on), W5 (advisor shadow learned weights), W6 (CocoIndex adaptive overfetch, opt-in), W7 (degraded-readiness stress cells). The implementations passed measurement gates against synthetic fixtures, but several open questions remain:

1. Are W3-W7 actually **wired into the runtime call paths** that operators will invoke in production? Or are they isolated modules that current callers never reach?
2. What **adjacent or connecting work** is needed for best utilization (e.g., does W3 trust tree feed W4 rerank decisions; does W5 shadow data feed any downstream learner)?
3. What **expansion candidates** would extend the W3-W7 family for **enterprise readiness** — multi-tenancy, SLA enforcement, audit trail, compliance, RBAC, observability dashboards, alerting, capacity planning?
4. Are there **empty / dead code folders** under `.opencode/skill/system-spec-kit/` and `.opencode/skill/system-spec-kit/mcp_server/` that should be deleted?

### Purpose

Run a 10-iteration deep research loop covering these four threads, externalize state per iteration, and synthesize a Planning Packet that downstream remediation phases can act on without re-discovering context.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **W3-W7 wiring audit**: read `lib/rag/trust-tree.ts`, `lib/search/rerank-gate.ts`, `lib/search/pipeline/stage3-rerank.ts`, `skill_advisor/lib/scorer/lane-registry.ts`, `lib/search/cocoindex-calibration.ts`, `mcp_server/stress_test/search-quality/w*.vitest.ts`. Trace upstream callers and downstream consumers. Identify call-path gaps.
- **Adjacent/connecting opportunity surfacing**: cross-feature integration (W3+W4, W5+W4, W6+W7), connection to memory pipeline, advisor pipeline, code-graph pipeline.
- **Expansion candidate brainstorming**: new feature ideas in the W3-W7 family that target enterprise readiness gaps.
- **Empty-folder audit**: scan `.opencode/skill/system-spec-kit/` and `.opencode/skill/system-spec-kit/mcp_server/` recursively; identify directories with no code/docs (excluding canonical empty placeholders like `dist/`, `node_modules/`).
- **Synthesis**: research-report.md with 9-section structure + Planning Packet for any downstream remediation.

### Out of Scope

- Implementing fixes (this is research only; downstream remediation phase will implement).
- Re-running stress tests v1.0.1/v1.0.2.
- Touching `006/001 license audit packet` (P0 deferred to human).
- Touching CHK-T15 live MCP rescan.
- Re-doing Phase C research findings (this extends, doesn't redo).

### Files to Read (representative; iterations may add more)

- `mcp_server/lib/rag/trust-tree.ts`
- `mcp_server/lib/search/rerank-gate.ts`, `mcp_server/lib/search/pipeline/stage3-rerank.ts`, `mcp_server/lib/search/cocoindex-calibration.ts`
- `mcp_server/skill_advisor/lib/scorer/{lane-registry,fusion,weights-config}.ts`
- `mcp_server/lib/query/query-plan.ts`
- `mcp_server/stress_test/search-quality/{harness,corpus,metrics,baseline.vitest}.ts`
- `mcp_server/stress_test/search-quality/w*.vitest.ts`
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/{006-search-query-rag-optimization,007-search-rag-measurement-driven-implementation}/{spec,plan,tasks,checklist,implementation-summary}.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/019-search-query-rag-optimization-research/research/research-report.md`
- Whole `.opencode/skill/system-spec-kit/` tree for empty-folder audit
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (none)

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 10 iterations produce externalized state. | Numbered iteration files under `research/iterations/` and matching JSONL deltas under `research/deltas/` exist for each iter; `research/deep-research-state.jsonl` carries the matching events. |
| REQ-002 | Each iteration has a focused angle (not a re-do of prior iters). | Iter focus map in `research/deep-research-strategy.md`; each iter cites its focus + new findings in the iter file. |
| REQ-003 | Convergence detected honestly; loop stops at convergence or max=10. | Final iter file records stop reason + newInfoRatio sequence. |
| REQ-004 | W3-W7 wiring audit identifies every consumer call site. | Each W has a "consumers" subsection with file:line citations or "no consumers" fact; gaps are flagged P1/P2. |
| REQ-005 | Adjacent/connecting opportunities surfaced per W. | Iter narrative for each W includes a "connecting opportunities" subsection. |
| REQ-006 | Empty-folder audit completed. | Per-folder verdict (delete/keep/investigate) with rationale; minimum 1 cleanup candidate identified or "no deletable folders found" stated explicitly. |
| REQ-007 | Enterprise-readiness expansion candidates documented. | At least 5 expansion candidates with leverage × feasibility rating; top 3 carry Planning Packet entries. |
| REQ-008 | Final research-report.md authored with 9-section structure + Planning Packet. | Report passes review-report skeleton: Executive Summary, RQs Answered, Top Workstreams, Cross-System Insights, Active Findings Registry, Planning Packet, Convergence Audit, Sources, Open Questions. |

### Acceptance Scenarios

1. **Given** the research packet is complete, when a reviewer counts artifacts, then exactly 10 iteration markdown files and 10 delta JSONL files exist.
2. **Given** the W3-W7 runtime audit is complete, when a reviewer opens `research/research-report.md`, then each RQ1-RQ10 has a direct answer and evidence rating.
3. **Given** the empty-folder audit is complete, when a reviewer opens RQ8, then concrete deletion candidates or an explicit no-candidate verdict is present.
4. **Given** Phase G planning is needed, when a reviewer reads the Planning Packet, then it can seed remediation without re-running the Phase F research.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 10 iter files + 10 delta files written.
- **SC-002**: Convergence event recorded with newInfoRatio sequence.
- **SC-003**: Research report enumerates W3-W7 wiring verdicts + adjacent opportunities + expansion candidates + empty-folder audit results.
- **SC-004**: Strict validator exits 0 on this sub-phase.
- **SC-005**: Planning Packet enables a follow-on remediation phase to act without re-investigating sources.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | xhigh reasoning + 10 iters can drift into speculation if grounding is weak | Per-iter file:line citations are MANDATORY; speculation findings get severity≤P2 |
| Risk | Empty-folder audit (RQ8) is mechanical and could be skipped | Force iter-8 to focus on this; produce deletable candidate list |
| Dependency | Phases C/D/E artifacts (006, 007, 019 packets) must remain on disk | All currently committed (commit 74b6ef6b8 on main) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Research execution must not run runtime stress tests or mutate production code paths.
- **NFR-P02**: Empty-folder audit must exclude dependency/build outputs such as `node_modules/` and `dist/`.

### Security
- **NFR-S01**: No secrets, credentials, or external service tokens are required.
- **NFR-S02**: Enterprise-readiness analysis must identify RBAC, tenant isolation, audit, compliance, observability, alerting, and SLA gaps without implementing them.

### Reliability
- **NFR-R01**: Every concrete finding must cite file:line evidence or be labeled as speculation.
- **NFR-R02**: Convergence tracking must record the full newInfoRatio sequence and stop reason.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty code folder scan: if no candidates exist, report explicit "no deletable folders found".
- Missing production consumers: report "zero consumers" only after caller search across `mcp_server/`.
- Static test fixture vs runtime envelope: distinguish harness representation from actual handler coverage.

### Error Scenarios
- Stale predecessor path: resolve to the existing Phase C/D/E packet paths and cite the corrected source.
- Validator failure: repair packet-local docs only; do not modify runtime code or prior packets.
- Search command noise: exclude build/dependency outputs from empty-folder conclusions.

### State Transitions
- Planned to complete: state log gets 10 iteration events plus `synthesis_complete`.
- Research to remediation: final Planning Packet seeds Phase G without applying runtime changes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Research spans W3-W7 modules, tests, adjacent memory/advisor/code-graph paths, and filesystem audit. |
| Risk | 10/25 | Research-only; no runtime code modifications. |
| Research | 18/20 | 10 focused iterations with source citations and synthesis. |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Q1: Where should a future `SearchDecisionEnvelope` contract live?
- Q2: Should W5 shadow persistence use advisor-local storage, governance audit, or JSONL-first learning records?
- Q3: Which runtime boundary should own W6 calibration wiring?
- Q4: Which fixture strategy should Phase G use for real degraded-readiness code graph tests?
<!-- /ANCHOR:questions -->
