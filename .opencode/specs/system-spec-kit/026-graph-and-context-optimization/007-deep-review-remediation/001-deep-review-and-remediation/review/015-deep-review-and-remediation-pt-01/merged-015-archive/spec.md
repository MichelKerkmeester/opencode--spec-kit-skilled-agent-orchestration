---
title: "...iew-remediation/001-deep-review-and-remediation/review/015-deep-review-and-remediation-pt-01/merged-015-archive/spec]"
description: "Meta-spec for a 50-iteration combined deep review across four sibling spec folders under 026-graph-and-context-optimization. Review only — no source-code changes."
trigger_phrases:
  - "combined deep review"
  - "review-only spec"
  - "four-specs review"
  - "026 combined review"
  - "deep-review combined"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "015-combined-deep-review-four-specs"
    last_updated_at: "2026-04-15T18:56:00Z"
    last_updated_by: "claude-opus-4.6-1m"
    recent_action: "Initialize review-only spec folder"
    next_safe_action: "Initialize review state files and dispatch iteration 1"
    blockers: []
    key_files:
      - "review/deep-review-config.json"
      - "review/deep-review-state.jsonl"
      - "review/deep-review-strategy.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-04-15T18:56:00Z"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Feature Specification: Combined Deep Review — 009 + 010 + 012 + 014

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 (review-only, no source changes) |
| **Status** | In Progress |
| **Created** | 2026-04-15 |
| **Branch** | `main` |
| **Kind** | review-only (meta-spec for combined audit) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Four sibling packets under `026-graph-and-context-optimization` (009 playbook-and-remediation parent, 010 continuity-research parent, 012 canonical-intake-and-middleware-cleanup, 014 memory-save-planner-first-default) have accumulated release-readiness risk. A combined deep review pass is required to surface P0/P1 correctness, security, traceability, and maintainability findings in one convergent run before any of them is cut for release.

### Purpose
Produce a single `review/review-report.md` that identifies active P0/P1/P2 findings across all four targets, assigns remediation workstreams, and yields a clean Planning Packet ready for `/spec_kit:plan [remediation]` or `/create:changelog` depending on verdict.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Combined review across the four target packets' core spec artifacts (spec/plan/tasks/checklist/implementation-summary/decision-record/handover)
- All four review dimensions: correctness, security, traceability, maintainability
- Core traceability protocols: spec_code, checklist_evidence
- Overlay protocols where applicable: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Up to 50 review iterations via cli-copilot (gpt-5.4, reasoning effort: high), substituting for the native `@deep-review` LEAF agent

### Out of Scope
- Implementation, refactoring, or edits to any reviewed code — review target is READ-ONLY
- Review of sibling packets outside the four explicit targets (e.g., 011, 013, 015 itself)
- Review of archived, future, scratch, prompt, and prior-review artifacts
- Memory-index sweeps or schema changes

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `review/deep-review-config.json` | Create | Session config with review-specific fields |
| `review/deep-review-state.jsonl` | Create + append-only | Session state log |
| `review/deep-review-findings-registry.json` | Create + reducer-owned | Deduplicated findings registry |
| `review/deep-review-strategy.md` | Create + mutable | Persistent brain for the run |
| `review/deep-review-dashboard.md` | Create + auto-generated | Iteration status snapshot |
| `review/iterations/iteration-NNN.md` | Create (per iteration) | Findings + traceability per iteration |
| `review/review-report.md` | Create | Final 9-section synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run up to 50 deep-review iterations over the four target packets | `iteration_count >= 1` and either convergence or `iteration_count == 50` before synthesis |
| REQ-002 | Each iteration dispatched via `copilot -p --model gpt-5.4 --effort high --allow-all-tools` | Every iteration JSONL record carries a dispatch note `"dispatcher":"cli-copilot","model":"gpt-5.4","effort":"high"` |
| REQ-003 | Do not modify any reviewed file across the four targets | Post-run `git diff --stat` shows no edits outside `015-combined-deep-review-four-specs/` |
| REQ-004 | Produce a final `review/review-report.md` with all nine required sections and an embedded Planning Packet | File exists, sections 1-9 present, Planning Packet parseable as JSON |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | All four review dimensions covered at least once | `dimensionCoverage.correctness == true && .security == true && .traceability == true && .maintainability == true` |
| REQ-006 | Every new P0/P1 finding includes a typed claim-adjudication packet | Each has claim/evidenceRefs/counterevidenceSought/alternativeExplanation/finalSeverity/confidence/downgradeTrigger |
| REQ-007 | Continuity update saved into a canonical spec doc | `implementation-summary.md` (or decision-record.md / handover.md) carries the run's `_memory.continuity` refresh |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `review/review-report.md` written with a verdict (PASS | CONDITIONAL | FAIL) and Planning Packet
- **SC-002**: All four target packets referenced by at least one active finding or confirmed-clean dimension note
- **SC-003**: `review/deep-review-state.jsonl` contains a `synthesis_complete` event with `stopReason ∈ {converged, maxIterationsReached, blockedStop, stuckRecovery}`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `copilot` CLI binary + GH auth | Hard-block on unavailable auth | Pre-check `copilot --version`; escalate on auth failure |
| Risk | 50 sequential CLI dispatches exceed session budget | Partial run | State is fully externalized; loop can resume across sessions via `:auto`/`resume` lineage |
| Risk | Graph MCP tools (`deep_loop_graph_convergence`, `deep_loop_graph_upsert`) unavailable to copilot subprocess | Graph signals degrade to inline 3-signal vote | Driver (this assistant) runs reducer locally; graph calls executed from parent session when available |
| Risk | cli-copilot hits concurrency or throttle limits | Iteration stalls | Sequential dispatch (1 at a time); retry once with backoff; on 3+ consecutive failures halt loop and enter synthesis with partial findings |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at init time; loop proceeds autonomously and surfaces blockers via JSONL `blocked_stop` events.
<!-- /ANCHOR:questions -->
