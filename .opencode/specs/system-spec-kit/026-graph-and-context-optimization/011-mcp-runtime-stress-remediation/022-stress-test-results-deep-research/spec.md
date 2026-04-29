---
title: "Research Charter: Stress Test Results Deep Research (v1.0.3 Post-Wiring)"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "5-iteration deep research charter analyzing v1.0.3 stress test results (post W3-W13 wiring), surfacing gaps revealed by live handler probe failure, harness telemetry limitations, comparison deltas vs v1.0.1/v1.0.2 baselines, and ranked next-step optimizations grounded in real telemetry samples."
trigger_phrases:
  - "022-stress-test-results-deep-research"
  - "stress test v1.0.3 deep research"
  - "stress test results post-G research"
  - "live handler probe gap research"
  - "harness telemetry export research"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/022-stress-test-results-deep-research"
    last_updated_at: "2026-04-29T07:57:15Z"
    last_updated_by: "codex"
    recent_action: "Completed deep research"
    next_safe_action: "Use Planning Packet"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Research Charter: Stress Test Results Deep Research (v1.0.3 Post-Wiring)

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
| **Predecessor cycles** | `001-search-intelligence-stress-test` (v1.0.1), `010-stress-test-rerun-v1-0-2` (v1.0.2), `021-stress-test-v1-0-3-with-w3-w13-wiring` (v1.0.3) |
| **Mode** | Deep research (`/spec_kit:deep-research:auto` pattern) |
| **Iterations** | 5 (max); convergence allowed earlier |
| **Executor** | cli-codex `gpt-5.5` reasoning=`xhigh` service-tier=default (normal) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The v1.0.3 stress test (Phase H, packet `021-stress-test-v1-0-3-with-w3-w13-wiring`) ran the search/query/RAG stack against post-Phase-G wiring (W3 trust tree, W4 default-on conditional rerank, W5 shadow weights, W6 CocoIndex calibration, W7 degraded-readiness, W8 SearchDecisionEnvelope, W9 shadow JSONL sink, W10 degraded integration, W11 CocoIndex runtime consumer, W12 real QueryPlan to Stage 3, W13 decision audit + SLA). It produced 12-row envelope/audit/shadow samples, computed aggregate metrics, and confirmed W4 trigger logic fires real triggers (no `flag_disabled`/`unknown`).

The verdict was **CONDITIONAL** with these qualifications:

1. **Live handler probe blocked.** MCP `memory_search` calls returned `user cancelled MCP tool call`; direct `handleMemorySearch` probe timed out at the embedding readiness gate after 30s. Telemetry samples were composed via packet-local runner instead of full live handler emission.
2. **Harness fixture-only telemetry.** The search-quality harness is fixture-driven and does not naturally emit SearchDecisionEnvelope, audit, or shadow records. It needed a packet-local wrapper.
3. **Aggregate score not directly comparable.** v1.0.2 was a 30-cell CLI-model rubric (83.8%). v1.0.3 is a deterministic harness telemetry rubric. Comparison is directional, not like-for-like.

These qualifications obscure several questions that must be answered to plan Phase K (next stress cycle or Phase L production hardening):

- **Q-A**: What does the v1.0.3 telemetry actually prove about runtime behavior, and what does it leave unproven?
- **Q-B**: Why does the live handler embed-readiness gate block telemetry, and what is the smallest fix that lets a future cycle capture true end-to-end traces?
- **Q-C**: Are there metric improvements (precision +0.139, recall +0.042, citation +0.167, p95 latency −100ms) that are real telemetry wins vs artifacts of the packet-local runner setup?
- **Q-D**: What does the W4 trigger distribution (`complex-query`:6, `high-authority`:5, `weak-evidence`:6, `multi-channel-weak-margin`:4, `disagreement`:1) reveal about query population skew or rerank gating policy that should be tuned?
- **Q-E**: Comparing v1.0.1 baseline (corpus + dispatch matrix) → v1.0.2 rerun (CLI-model rubric, 6/7 PROVEN, 0 REGRESSION) → v1.0.3 wiring run (harness rubric, ALL PROVEN, live-handler caveat), what is the through-line, and what blind spots remain?
- **Q-F**: What expansion candidates does the v1.0.3 telemetry reveal that were not visible to v1.0.1/v1.0.2 (e.g., per-tenant SLA dashboards, shadow-sink replay, calibration histogram alerting, audit-log retention policy)?

### Purpose

Run 5 focused deep-research iterations on the v1.0.3 stress test results, externalize state per iteration, and synthesize a Planning Packet that downstream phases (Phase K stress cycle v1.0.4 OR Phase L production hardening) can act on without re-investigating sources.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Re-read v1.0.3 evidence**: `../021-stress-test-v1-0-3-with-w3-w13-wiring/findings-v1-0-3.md`, `../021-stress-test-v1-0-3-with-w3-w13-wiring/findings-rubric-v1-0-3.json`, `../021-stress-test-v1-0-3-with-w3-w13-wiring/measurements/v1-0-3-summary.json`, and the v1.0.3 JSONL samples (021 packet).
- **Compare to v1.0.2 evidence**: `../010-stress-test-rerun-v1-0-2/findings.md`, `../010-stress-test-rerun-v1-0-2/findings-rubric.json` (010 packet).
- **Compare to v1.0.1 evidence**: corpus + dispatch matrix + scenario execution (001 packet).
- **Compare to Phase E baselines**: `005-review-remediation/007-search-rag-measurement-driven-implementation/measurements/baseline-*.json` and W3-W7 baseline/variant pairs.
- **Trace live handler embed-readiness gate**: `mcp_server/handlers/memory-search.ts` startup contract; identify where `Embedding model not ready after 30s timeout` originates and which seam unblocks deterministic test capture.
- **Surface fixture-vs-handler envelope parity gap**: identify smallest change to harness so it natively emits SearchDecisionEnvelope/audit/shadow samples (without packet-local wrapper).
- **Analyze W4 trigger distribution**: per-trigger rates, query-population skew, rerank gating policy validity.
- **Analyze SLA panel**: rerank trigger rate (100%), refusal rate (8.3%), decision distribution (degraded:5, trusted:7), latency percentiles (avg 58.5ms, p95 97ms, stage avg breakdown).
- **Analyze metric deltas** vs Phase E baseline (precision/recall/citation/latency) — distinguish real wins from packet-local runner artifacts.
- **Through-line analysis**: v1.0.1 → v1.0.2 → v1.0.3, what each cycle proved/disproved/left open.
- **Expansion candidate ranking**: enterprise-readiness candidates revealed by v1.0.3 telemetry shape.
- **Synthesis**: research-report.md with 9-section structure + Planning Packet ready to seed Phase K or Phase L.

### Out of Scope

- Implementing fixes (this is research-only; downstream phase will implement).
- Re-running the harness or stress matrix (use v1.0.3 artifacts as evidence).
- Modifying runtime code, harness, or any prior packet content.
- Touching `006/001 license audit packet`.

### Files to Read (representative; iterations may add more)

- v1.0.3 evidence: `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-stress-test-v1-0-3-with-w3-w13-wiring/{findings-v1-0-3.md, findings-rubric-v1-0-3.json, implementation-summary.md, measurements/*}`
- v1.0.2 evidence: `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/{findings.md, findings-rubric.json}`
- v1.0.1 evidence: `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/`
- Phase E measurement baselines: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/007-search-rag-measurement-driven-implementation/measurements/`
- Phase F research output: `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/020-w3-w7-verification-and-expansion-research/research/research-report.md`
- Runtime code (READ ONLY): `mcp_server/handlers/memory-search.ts`, `mcp_server/lib/search/{search-decision-envelope.ts, decision-audit.ts, rerank-gate.ts}`, `mcp_server/lib/rag/trust-tree.ts`, `mcp_server/lib/query/query-plan.ts`, `mcp_server/skill_advisor/lib/shadow/shadow-sink.ts`
- Harness: `mcp_server/stress_test/search-quality/{harness,corpus,metrics,baseline.vitest}.ts`, `mcp_server/stress_test/search-quality/w*.vitest.ts`
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (none)

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 5 iterations produce externalized state. | Numbered iteration files under `research/iterations/` and matching JSONL deltas under `research/deltas/` exist for each iter; `research/deep-research-state.jsonl` carries the matching events. |
| REQ-002 | Each iteration has a focused angle (not a re-do of prior iters). | Iter focus map in `research/deep-research-strategy.md`; each iter cites its focus + new findings in the iter file. |
| REQ-003 | Convergence detected honestly; loop stops at convergence or max=5. | Final iter file records stop reason + newInfoRatio sequence. |
| REQ-004 | Live-handler gap analysis completed. | RQ2 (live handler embed-readiness gate) answered with file:line evidence + minimum-viable test seam recommendation. |
| REQ-005 | Harness-vs-handler envelope parity gap surfaced. | RQ3 answered: smallest change to harness so it natively emits envelope/audit/shadow without packet-local wrapper. |
| REQ-006 | W4 trigger distribution analyzed. | RQ4 answered: query-population skew, gating policy observations, tuning candidates. |
| REQ-007 | Through-line v1.0.1 → v1.0.2 → v1.0.3 mapped. | RQ5 answered: per-cycle prove/disprove/leaves-open table. |
| REQ-008 | Expansion candidates ranked. | RQ6 answered: at least 5 candidates with leverage × feasibility rating; top 3 carry Planning Packet entries. |
| REQ-009 | Final research-report.md authored with 9-section structure + Planning Packet. | Report passes review-report skeleton: Executive Summary, RQs Answered, Top Workstreams, Cross-System Insights, Active Findings Registry, Planning Packet, Convergence Audit, Sources, Open Questions. |

### Acceptance Scenarios

1. **Given** the research packet is complete, when a reviewer counts artifacts, then exactly 5 iteration markdown files and 5 delta JSONL files exist.
2. **Given** the live-handler gap is analyzed, when a reviewer opens RQ2, then the embed-readiness gate origin and minimum-viable test seam are documented with file:line.
3. **Given** the through-line is mapped, when a reviewer opens RQ5, then v1.0.1, v1.0.2, and v1.0.3 each have a per-cycle prove/disprove/leaves-open row.
4. **Given** Phase K or L planning is needed, when a reviewer reads the Planning Packet, then it can seed remediation without re-running this research.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 5 iter files + 5 delta files written.
- **SC-002**: Convergence event recorded with newInfoRatio sequence.
- **SC-003**: Research report enumerates RQ1–RQ6 answers with file:line citations.
- **SC-004**: Strict validator exits 0 on this sub-phase.
- **SC-005**: Planning Packet enables a follow-on phase to act without re-investigating sources.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | xhigh reasoning + 5 iters can drift into speculation if grounding is weak | Per-iter file:line citations are MANDATORY; speculation findings get severity≤P2 |
| Risk | Telemetry JSONL samples are 12 rows — small sample size for statistical claims | Treat metric deltas as directional, not statistical; require corroborating runtime trace evidence for any "real win" claim |
| Dependency | v1.0.1, v1.0.2, v1.0.3 packet artifacts must remain on disk | All currently committed on main |
| Dependency | Phase F expansion ranking must remain on disk | `../020-w3-w7-verification-and-expansion-research/research/research-report.md` currently committed on main |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Research execution must not run runtime stress tests, the harness, or mutate any production code path.
- **NFR-P02**: Iteration outputs must remain under reasonable disk size (typical iteration < 50KB).

### Security
- **NFR-S01**: No secrets, credentials, or external service tokens are required.
- **NFR-S02**: Live-handler gap analysis must NOT include any production credentials, embedding API keys, or tenant identifiers — only seam recommendations.

### Reliability
- **NFR-R01**: Every concrete finding must cite file:line evidence or be labeled as speculation.
- **NFR-R02**: Convergence tracking must record the full newInfoRatio sequence and stop reason.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- 12-row JSONL samples are small — flag any percentile or rate claim that depends on > 10× sample size.
- Aggregate harness percent vs CLI-model rubric percent — never compare directly; only directional.
- Speculative finding vs confirmed runtime trace — speculative findings must carry P2 severity.

### Error Scenarios
- v1.0.3 missing artifact: fall back to summary.json; report which artifact was missing.
- Validator failure: repair packet-local docs only; do not modify runtime code or prior packets.

### State Transitions
- Planned to complete: state log gets 5 iteration events plus `synthesis_complete`.
- Research to remediation: final Planning Packet seeds Phase K or L without applying runtime changes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Research bounded to v1.0.3 + comparison cycles + adjacent runtime modules. |
| Risk | 8/25 | Research-only; no runtime/harness modifications. |
| Research | 18/20 | 5 focused iterations with source citations and synthesis. |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Q1: Should the live-handler embed-readiness gate be replaced by a deterministic seam (test-only) or by a real probe-warmup?
- Q2: Should the harness emit envelope/audit/shadow as first-class outputs (telemetry export mode), or is the packet-local runner pattern acceptable as the canonical stress-cycle pattern?
- Q3: Does the W4 trigger distribution suggest the rerank gating thresholds are too permissive (100% trigger rate)?
- Q4: Should v1.0.4 prefer corpus expansion (more cells) or live-handler coverage (real runtime trace) as its primary delta over v1.0.3?
- Q5: Is per-tenant SLA dashboarding the highest-leverage Phase L candidate, or does shadow-sink replay rank higher?
<!-- /ANCHOR:questions -->
