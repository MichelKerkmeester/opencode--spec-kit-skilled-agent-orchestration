---
title: "Feature Specification: Foundational Runtime Deep Review"
description: "Deep review of 19 foundational runtime candidates (7 HIGH, 8 MEDIUM, 4 LOW) concentrated in earlier phases (002, 003, 005, 008, 010, 014) that carry high leverage with less scrutiny from the 015 audit."
trigger_phrases:
  - "foundational runtime deep review"
  - "016 deep review"
  - "foundational runtime seams"
  - "026 coverage gap"
  - "contract drift review"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review"
    last_updated_at: "2026-04-16T00:00:00Z"
    last_updated_by: "claude-opus-4.6"
    recent_action: "Deep-dive analysis complete — 5 scratch reports produced by copilot gpt-5.4 (high/medium/low deep-dives, cross-cutting patterns, deep-review prompts)"
    next_safe_action: "Run 50-iteration deep-research on cross-cutting themes, then dispatch deep-review iterations on HIGH targets"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "scratch/high-priority-deep-dive.md"
      - "scratch/cross-cutting-patterns.md"
      - "scratch/deep-review-prompts.md"
    session_dedup:
      fingerprint: "sha256:016-deep-dive-complete-2026-04-16"
      session_id: "016-deep-dive-session"
      parent_session_id: "016-planning-session"
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
# Feature Specification: Foundational Runtime Deep Review

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-16 |
| **Branch** | `main` |
| **Source** | `scratch/026-analysis-output.md` (19 candidates, copilot gpt-5.4 analysis) |
| **Deep-Dive** | `scratch/high-priority-deep-dive.md`, `scratch/medium-priority-deep-dive.md`, `scratch/low-priority-deep-dive.md`, `scratch/cross-cutting-patterns.md`, `scratch/deep-review-prompts.md` (copilot gpt-5.4 deep analysis) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 015 ran 120 deep-review iterations across 920 files but concentrated its deepest audit pressure on packets 009, 010, 012, and 014. Foundational runtime packets from earlier phases -- 002 (cache-warning-hooks), 003 (memory-quality-remediation), 005 (code-graph-upgrades), and 008 (cleanup-and-audit) -- still carry high leverage with comparatively less follow-on scrutiny. A copilot gpt-5.4 analysis identified 19 candidates where residual risk is concentrated in contract drift, hidden semantics, and soft governance rather than obvious broken logic.

### Purpose

Run targeted deep-review iterations on the 19 identified candidates, starting with the 7 HIGH-priority foundational runtime seams, to surface contract drift, hidden-semantic bugs, and governance gaps before more producers and consumers depend on these surfaces.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Deep-review iterations targeting all 19 candidates from the analysis
- Adversarial review of the 7 HIGH-priority files as primary targets
- Follow-up review of the 8 MEDIUM-priority hardening opportunities
- Synthesis of findings and remediation recommendations
- Documentation of contract-drift and hidden-semantic risks

### Out of Scope

- Remediation implementation (separate follow-up packet if needed)
- Re-reviewing files already covered deeply by 015
- New feature development or architectural redesign
- Changes to packets outside the identified candidate set

### Review Candidates by Priority

#### HIGH Priority (7 files) -- Primary Targets

| # | Phase | File | Risk Pattern |
|---|-------|------|-------------|
| H1 | 002 | `mcp_server/hooks/claude/session-stop.ts` | Regex-based spec-folder detection, 4s autosave timeout, transcript fingerprint contract -- producer-side continuity seam |
| H2 | 002 | `mcp_server/hooks/claude/hook-state.ts` | Temp-file authority for startup/recovery, stale-state selection, atomic save semantics under concurrent sessions |
| H3 | 005 | `mcp_server/lib/context/shared-payload.ts` | Trust vocabulary enums now load-bearing, forward-compatibility risk as more producers/consumers depend on it |
| H4 | 008 | `mcp_server/lib/graph/graph-metadata-parser.ts` | Manual-vs-derived merge, legacy normalization, implicit status derivation -- governs metadata integrity across hundreds of packets |
| H5 | 010 | `shared/algorithms/adaptive-fusion.ts` | Hidden internal `continuity` profile, private weighting drift from public search expectations |
| H6 | 014 | `mcp_server/handlers/save/reconsolidation-bridge.ts` | Save-time reconsolidation scope-boundary governance, cross-tenant/user/agent/session combinations |
| H7 | 014 | `mcp_server/handlers/save/post-insert.ts` | Planner-first save mode contract honesty, env-flag combinations producing unintended side effects |

#### MEDIUM Priority (8 files) -- Hardening Opportunities

| # | Phase | File | Risk Pattern |
|---|-------|------|-------------|
| M1 | 003 | `scripts/core/post-save-review.ts` | Heuristic-based lineage/quality feedback, over-linking or under-linking risk |
| M2 | 003 | `scripts/lib/trigger-phrase-sanitizer.ts` | Regex/allowlist defense, unicode/HTML/control-char/prompt-injection fuzzing |
| M3 | 005 | `mcp_server/handlers/code-graph/query.ts` | Behaviorally dense: maxDepth, unionMode, breadcrumbs, graph-edge enrichment interactions |
| M4 | 008 | `scripts/graph/backfill-graph-metadata.ts` | Bulk rollout/repair risk, silently entrenching bad derived metadata |
| M5 | 011 | `skill-advisor/scripts/skill_advisor.py` | Dual graph sources, damped transitive boosts, source divergence risk |
| M6 | 011 | `skill-advisor/scripts/skill_graph_compiler.py` | Advisory-only integrity checks that may need release-gating |
| M7 | 012 | `command/spec_kit/assets/spec_kit_plan_auto.yaml` | Absorbed intake behavior, deferred manual integration tests |
| M8 | 015 | `015-implementation-deep-review/implementation-summary.md` | Best concentration point for known fragility, deserves research pass |

#### LOW Priority (4 files) -- Nice-to-Have

| # | Phase | File | Risk Pattern |
|---|-------|------|-------------|
| L1 | 001 | `research/001-research-graph-context-systems/recommendations.md` | Decision baseline for trust/measurement language |
| L2 | 004 | `AGENTS.md` | Cross-surface drift, periodic parity review |
| L3 | 006 | `006-continuity-refactor-gates/implementation-summary.md` | Documentation hygiene, historical narrative consistency |
| L4 | 009 | `scripts/tests/manual-playbook-runner.ts` | Coverage accounting gap, most scenarios intentionally unautomatable |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Deep-review iterations must cover all 7 HIGH-priority files | Each HIGH file has at least one dedicated review iteration with findings documented |
| REQ-002 | Findings must be classified by severity (P0/P1/P2) with actionable remediation | Each finding includes severity, file location, and concrete fix recommendation |
| REQ-003 | Contract-drift and hidden-semantic risks must be explicitly surfaced | Review strategy specifically targets these risk patterns, not just general code quality |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Deep-review iterations should cover the 8 MEDIUM-priority files | Each MEDIUM file has at least one review iteration |
| REQ-005 | Cross-cutting observations must be synthesized across all findings | A synthesis section links related findings across phases and files |
| REQ-006 | Findings must be traceable to the source analysis candidates | Each finding references its candidate ID (H1-H7, M1-M8) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 7 HIGH-priority files reviewed with adversarial deep-review iterations
- **SC-002**: All 8 MEDIUM-priority files reviewed with hardening-focused iterations
- **SC-003**: Findings synthesized into an actionable remediation backlog with severity classification
- **SC-004**: Coverage gap between 015 and earlier foundational phases is closed
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Analysis output (`scratch/026-analysis-output.md`) must remain accurate | High | Verify candidate files still exist and match described behavior before review |
| Dependency | 015 remediation work may change reviewed files | Medium | Check for 015-driven changes to H6/H7 before reviewing reconsolidation-bridge and post-insert |
| Risk | Deep-review iterations may not converge within budget | Medium | Set convergence threshold at 0.10, cap at 50 iterations per phase |
| Risk | Findings may overlap with 015 remediation workstreams | Low | Cross-reference against 015 findings before declaring new findings |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Deep-review iterations should complete within 50 iterations per phase before convergence

### Security

- **NFR-S01**: Review must specifically stress cross-boundary data-integrity in reconsolidation-bridge and hook-state

### Reliability

- **NFR-R01**: Findings must be reproducible -- each finding must cite file, line range, and evidence
- **NFR-R02**: No false positives from stale file references -- verify all candidates before review
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- Files modified by concurrent 015 remediation work: re-verify file state before review
- Candidates that no longer exist due to refactoring: skip with documented reason

### Error Scenarios

- Deep-review iteration fails to converge: cap at iteration limit and synthesize partial findings
- File has been significantly refactored since analysis: re-assess candidate priority before review

### State Transitions

- HIGH review complete but MEDIUM not started: can still synthesize and publish HIGH findings
- Findings overlap with 015: deduplicate and cross-reference, do not double-count
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 19 candidates across 6 phases, diverse file types |
| Risk | 16/25 | Contract drift and hidden semantics are subtle, adversarial review needed |
| Research | 12/20 | Analysis already done, execution is review iterations |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The candidate set and priorities are established by the analysis output.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

---

<!-- ANCHOR:cross-cutting -->
## CROSS-CUTTING THEMES (from deep-dive analysis)

The copilot deep-dive identified 4 systemic patterns across the 19 candidates:

1. **Silent fail-open / silent degrade**: `session-stop.ts`, `graph-metadata-parser.ts`, `code-graph/query.ts`, `reconsolidation-bridge.ts`, and `post-insert.ts` all choose warnings or silent fallback over explicit surfaced failure. Failures become observationally similar to benign emptiness.

2. **Stringly typed workflow surfaces**: `AGENTS.md`, `spec_kit_plan_auto.yaml`, `skill_advisor.py`, and `manual-playbook-runner.ts` encode operational seams as strings validated socially more than mechanically.

3. **Hidden or misleading state contracts**: `hook-state.ts` has no schema versioning or writer coordination. `post-insert.ts` uses booleans that cannot distinguish success from skip/defer. `shared-payload.ts` collapses `missing` and `empty` graph states into `stale`.

4. **Read-modify-write without coordination**: `hook-state.ts` uses non-atomic RMW. `session-stop.ts` assumes immediate state visibility after write. `reconsolidation-bridge.ts` performs transactional inner writes but its pre-check phase is outside the transaction.

**Highest-value review themes**: Make state truthful (separate success from skipped/deferred), make authority explicit, eliminate shared-temp assumptions, promote adversarial tests.
<!-- /ANCHOR:cross-cutting -->

---

## RELATED DOCUMENTS

- **Analysis Source**: See `scratch/026-analysis-output.md`
- **Deep-Dive Reports**: See `scratch/high-priority-deep-dive.md`, `scratch/cross-cutting-patterns.md`, `scratch/deep-review-prompts.md`
- **Prior Deep Review**: See `015-implementation-deep-review/`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
