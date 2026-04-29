---
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
title: "Feature Specification: MCP Runtime Stress-Test Remediation"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Phase parent for the v1.0.1 MCP-runtime stress-test remediation cycle: rubric-driven sweep, deep research, contract fixes across memory_context / memory_search / code_graph_query / memory_causal_stats, plus a daemon-rebuild protocol that gates them."
trigger_phrases:
  - "011-mcp-runtime-stress-remediation"
  - "v1.0.1 stress test remediation"
  - "mcp runtime stress remediation"
  - "001 search intelligence stress test"
  - "002 mcp runtime improvement research"
  - "003 memory context truncation contract"
  - "004 cocoindex overfetch dedup"
  - "005 code graph fast fail"
  - "006 causal graph window metrics"
  - "007 intent classifier stability"
  - "008 mcp daemon rebuild protocol"
  - "009 memory search response policy"
  - "010 stress test rerun v1.0.2"
  - "011 post stress followup research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation"
    last_updated_at: "2026-04-29T09:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Phase H/I/J/K arc landed: v1.0.3 stress test (021), 5-iter deep research (022), live handler envelope test seam (023), harness telemetry export mode (024). 025 (degradedReadiness wiring) + 026 (readiness scaffolding cleanup) + 027 (memory_context structural channel research) dispatched in parallel via cli-codex."
    next_safe_action: "Verify 025/026/027 background completion at next wakeup; commit + push; v1.0.4 stress cycle is the natural next step after 025+026 land"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase manifest: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: MCP Runtime Stress-Test Remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-27 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `026-graph-and-context-optimization` |
| **Predecessor** | `010-phase-parent-documentation` |
| **Successor** | None (current tail of 026 active surface) |
| **Handoff Criteria** | All 9 phases have a graph-metadata `derived.status` of `complete` (or explicitly deferred per HANDOVER-deferred), and the post-fix sweep re-run from phase 001 has produced a v1.0.2 findings amendment. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The MCP runtime serves four high-traffic surfaces — `memory_context`, `memory_search`, `code_graph_query`, `memory_causal_stats` — that AI assistants depend on for retrieval and grounding. Under realistic CLI load these surfaces had subtle contract gaps: token-budget envelopes that under-reported truncation, code-graph blocked reads with no machine-readable fallback hint, causal-graph relation balance with no per-window cap or skew detection, intent telemetry that could not be aggregated across runtimes, and a `memory_search` weak-quality path that lacked a server-side refusal contract. The combined effect was ungrounded responses, runtime hallucinations, and silent CLI thrashing that the operator could not trace.

### Purpose
Harden the MCP runtime end-to-end against the regressions surfaced by the v1.0.1 stress-test rubric. The 9 phases below sequence as: design + run a rubric-driven sweep → deep-research the diagnoses → ship the contract fixes → gate them behind a canonical daemon-rebuild protocol so the fixes are provably live in production.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Stress-test rubric (v1.0.1) with a 30-cell scenario sweep that grades retrieval quality, latency, and intent stability across CLI executors.
- Deep research that converts the sweep diagnoses into per-surface contract specs (Q1–Q8).
- Server-side contract fixes for the four MCP surfaces plus their cross-cutting telemetry.
- Canonical daemon rebuild + restart + live-probe protocol that prevents the "phantom-fix" failure mode from recurring.
- Per-phase verification rows recording live MCP probe output post-restart.

### Out of Scope
- Client-side rendering layer for low-confidence responses (deferred — see HANDOVER-deferred §2.4).
- Embedding-based v2 of the intent classifier (deferred — see HANDOVER-deferred §2.3).
- Production tuning of the causal-graph window cap (deferred — see HANDOVER-deferred §2.2).
- Modification of any non-MCP runtime surface, build pipeline, or upstream cocoindex maintainer feature.

### Files to Change
[See per-phase scope tables inside each child folder. Parent-level scope is the sub-phase manifest below; per-file detail at this level is covered by the optional resource-map aggregator at this folder root.]
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

This phase-parent section is retrospective. It does not add new requirements; it records that child packet requirements remain the source of truth for the 011 MCP runtime stress-remediation phase parent, and the parent must keep those child links, status rollups, and handoff references discoverable.

- Child packet requirements stay in each child `spec.md`.
- Parent-level validation must resolve the child manifest and sibling phase references.
- Deferred or follow-up work remains in the existing handover and child packet surfaces.
<!-- /ANCHOR:requirements -->


---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children. Status is derived from each child's `graph-metadata.json` `derived.status` — read those for ground truth, not this column.

| Phase | Folder | Focus | Status (point-in-time) |
|-------|--------|-------|------------------------|
| 1 | `001-search-intelligence-stress-test/` | v1.0.1 rubric design + 30-cell scenario sweep + per-CLI baseline findings | complete (re-run scheduled per HANDOVER-deferred §2.1) |
| 2 | `002-mcp-runtime-improvement-research/` | 10-iteration deep research producing Q1–Q8 contract diagnoses | complete |
| 3 | `003-memory-context-truncation-contract/` | `preEnforcementTokens` / `returnedTokens` / `droppedAllResultsReason` token-budget contract | complete |
| 4 | `004-cocoindex-overfetch-dedup/` | Cocoindex dedup + path-class reranking shipped via vendored fork `0.2.3+spec-kit-fork.0.2.0` | complete |
| 5 | `005-code-graph-fast-fail/` | `fallbackDecision` routing on blocked code-graph reads | complete |
| 6 | `006-causal-graph-window-metrics/` | `deltaByRelation` / `balanceStatus` / per-relation per-window cap | complete (production cap tuning deferred — HANDOVER-deferred §2.2) |
| 7 | `007-intent-classifier-stability/` | Normalized `IntentTelemetry` + paraphrase corpus | complete (embedding-based v2 deferred — HANDOVER-deferred §2.3) |
| 8 | `008-mcp-daemon-rebuild-protocol/` | Canonical rebuild + restart + live-probe contract that gates the others | complete |
| 9 | `009-memory-search-response-policy/` | `responsePolicy` / `citationPolicy` refusal contract for low-quality searches | complete (client-side guard deferred — HANDOVER-deferred §2.4) |
| 10 | `010-stress-test-rerun-v1-0-2/` | v1.0.2 re-run of the v1.0.1 30-cell stress-test against the post-fix dist; per-cell delta classification + per-packet verdict (closes HANDOVER-deferred §2.1 when findings ship) | complete (sweep complete, findings shipped 2026-04-27, HANDOVER §2.1 CLOSED) |
| 11 | `011-post-stress-followup-research/` | 10-iteration `/spec_kit:deep-research:auto` loop refining v1.0.2 P0/P1/P2 follow-ups + light architectural touch on intelligence-system seams | complete (10/10 iters converged 2026-04-27; research.md synthesized) |
| 12 | `012-copilot-target-authority-helper/` | (P0) Shared `buildCopilotPromptArg` helper in `executor-config.ts` — typed `targetAuthority` token wrapping cli-copilot deep-loop dispatch; closes the I1/cli-copilot Gate 3 bypass | draft (scaffold + agent implementation pending) |
| 13 | `013-graph-degraded-stress-cell/` | (P1) Deterministic isolated-`SPEC_KIT_DB_DIR` integration sweep exercising all 4 `fallbackDecision` matrix branches; closes packet 005 NEUTRAL verdict | draft (scaffold + agent implementation pending) |
| 14 | `014-graph-status-readiness-snapshot/` | (P2) Read-only `getGraphReadinessSnapshot()` helper used by `code_graph_status` to surface action-level readiness; observability for staleness drift | draft (scaffold + agent implementation pending) |
| 15 | `015-cocoindex-seed-telemetry-passthrough/` | (P2) Per-seed telemetry passthrough (`rawScore`, `pathClass`, `rankingSignals`) through `code_graph_context` anchors; preserves CocoIndex fork signals as audit/explanation data | complete (committed `bbf869331`; reviewed; P1/P2 fixes folded back) |
| 16 | `016-degraded-readiness-envelope-parity/` | (P1, required from deep-review CONDITIONAL verdict) Degraded-readiness envelope parity for `code_graph_context` + `code_graph_status` + shared readiness contract. Closes F-001/F-003 + supporting F-002/F-006/F-008/F-009 | draft (scaffold + agent implementation pending) |
| 17 | `017-cli-copilot-dispatch-test-parity/` | (P2 from deep-review) cli-copilot dispatch test parity in `cli-matrix.vitest.ts`. Closes F-004 | draft (scaffold + agent implementation pending) |
| 18 | `018-catalog-playbook-degraded-alignment/` | (P2 from deep-review) Catalog + playbook alignment with shipped degraded envelope + `rankingSignals` array shape. Closes F-005/F-007 + doc parts of F-008 | draft (scaffold + agent implementation pending) |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map plus `graph-metadata.json` derived rollup.
- Use `/spec_kit:resume specs/.../011-mcp-runtime-stress-remediation/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as integrated unit.
- Status column above is informational; the canonical source is each child's `graph-metadata.json` `derived.status`.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-search-intelligence-stress-test` | `002-mcp-runtime-improvement-research` | Rubric v1.0.1 calibrated and 30-cell sweep produces a per-CLI findings table with reproducible per-cell evidence | findings.md v1.0.1 amendment exists |
| `002-mcp-runtime-improvement-research` | `003`–`009` (parallel remediation fan-out) | Q1–Q8 deep-research synthesis converged with per-question contract specs | research/research.md §1–§17 closed |
| `003`–`007` (server-side contract fixes) | `008-mcp-daemon-rebuild-protocol` | All contract fixes have source patches landed and `dist/` rebuilt | `npm run build` exit 0 in each child |
| `008-mcp-daemon-rebuild-protocol` | `009-memory-search-response-policy` | Live-probe template authored and exercised on all five remediation packets | live probe rows recorded verbatim in 003/005/006/007 verification tables |
| `009-memory-search-response-policy` | (post-cycle close-the-loop, tracked in HANDOVER-deferred) | Cite_results probe PASS recorded; weak-quality probe folded into the 001 sweep re-run | HANDOVER-deferred §2.1 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- The four still-open follow-up items (re-run the 001 sweep, tune the 006 production cap, ship the 007 v2 classifier, layer a client-side hallucination guard on top of 009) are tracked in `HANDOVER-deferred.md` rather than here, because they are post-cycle work whose owners and timelines are not yet sequenced into a successor phase.
- Whether to mint a successor phase parent (e.g. a future `012-...`) for the post-cycle work, or fan it out as standalone packets under 026, is deferred until the 001 sweep re-run produces telemetry that informs 006's production cap.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md, implementation-summary.md.
- **Parent Spec**: See `../spec.md` (`026-graph-and-context-optimization`).
- **Continuity**: See `./HANDOVER-deferred.md` for the four still-open follow-ups and the canonical resume target for the cycle.
- **Migration bridge**: See `./context-index.md` for the carve-out + renumber history (this folder was extracted from `003-continuity-memory-runtime/` and renumbered; legacy paths and old → new mappings live there, not here).
- **Resource map**: See `./resource-map.md` for the parent-aggregate file ledger across all 9 phases.
- **Graph metadata**: See `./graph-metadata.json` for `derived.last_active_child_id` pointer and per-phase status rollup.
