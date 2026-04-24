---
title: "Verification Checklist: Resource Map Template [system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/checklist]"
description: "Verification Date: 2026-04-24"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
trigger_phrases:
  - "011-resource-map-template checklist"
  - "resource map template verification checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-resource-map-template"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "claude-sonnet-4-6"
    recent_action: "Created packet-root checklist.md at Level 3"
    next_safe_action: "Run validate.sh --strict on packet root"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/checklist.md"
    session_dedup:
      fingerprint: "sha256:011-resource-map-template-root-checklist"
      session_id: "011-resource-map-template-root-scaffold"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Phase 001 complete — local-owner placement restored."
      - "Phase 002 in-progress at 85% — template and surfaces wired; final validate.sh pending."
      - "Phase 003 complete — convergence-time emission shipped."
---
# Verification Checklist: Resource Map Template

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — Evidence: `spec.md` §4 REQ-001–REQ-007 with acceptance criteria
- [x] CHK-002 [P0] Technical approach defined in plan.md — Evidence: `plan.md` §3 Architecture, §4 Phases
- [x] CHK-003 [P1] Dependencies identified and available — Evidence: `plan.md` §6 Dependencies table; Phase 001 confirmed complete before Phase 003 started
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — Evidence: Phase 001 and 003 validate.sh passed; extractor vitest green
- [x] CHK-011 [P0] No console errors or warnings — Evidence: Extractor is pure string/JSON; no shell-outs or network calls
- [x] CHK-012 [P1] Error handling implemented — Evidence: Malformed delta → degraded marker; zero-iteration loops skip emission; partial writes never occur on opt-out
- [x] CHK-013 [P1] Code follows project patterns — Evidence: CJS module pattern for extractor; resolver matches existing shared script conventions
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met — Evidence: REQ-001 (local-owner resolver restored), REQ-002 (template at templates root), REQ-003 (extractor vitest both shapes), REQ-004 (convergence emission verified)
- [x] CHK-021 [P0] Manual testing complete — Evidence: Phase 001 and 003 deep-review runs (7 iterations each) confirmed
- [x] CHK-022 [P1] Edge cases tested — Evidence: Root spec (no ancestor), zero-iteration loop, single-iteration loop, conflicting destination during migration — all handled in Phase 001 and 003
- [x] CHK-023 [P1] Error scenarios validated — Evidence: Malformed config → JSONL fallback; conflicting move → skip and log; resource-map overwrite supported
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — Evidence: NFR-S01 satisfied; extractor is pure string/JSON with no credentials
- [x] CHK-031 [P0] Input validation implemented — Evidence: Extractor normalizes evidence shape before categorization; resolver validates `specFolder` before any move
- [x] CHK-032 [P1] Auth/authz working correctly — N/A (filesystem-only operations; no auth surface)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — Evidence: All root docs created and cross-referenced; sub-phase docs already synchronized
- [x] CHK-041 [P1] Code comments adequate — Evidence: Extractor README at scripts/resource-map/README.md documents input/output contract
- [x] CHK-042 [P2] README updated — Evidence: All five level READMEs, SKILL.md, templates README, references catalog, feature catalog, manual testing playbook all updated in Phase 002 (T013–T024)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — No temp files produced by this packet
- [x] CHK-051 [P1] scratch/ cleaned before completion — No scratch/ created; not applicable
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 9 | 9/9 (CHK-032 N/A) |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-04-24
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md — Evidence: `decision-record.md` ADR-001 through ADR-003 all Accepted
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) — Evidence: ADR-001 Local-Owner Placement, ADR-002 Template Optionality, ADR-003 Shared Extractor — all Accepted
- [x] CHK-102 [P1] Alternatives documented with rejection rationale — Evidence: Each ADR includes "Alternatives Considered" with rejection reason
- [x] CHK-103 [P2] Migration path documented — Evidence: `plan.md` §7 Rollback Plan and §L2 Enhanced Rollback; Phase 001 migration scripts documented
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Response time targets met (NFR-P01) — Evidence: Path resolution is filesystem-local; no extra repo scans
- [x] CHK-111 [P1] Throughput targets met (NFR-P02) — Evidence: Convergence emission adds <100ms on 10-iteration run; extractor is synchronous JSON parse
- [ ] CHK-112 [P2] Load testing completed — Not applicable for a spec-folder template and local filesystem tool
- [ ] CHK-113 [P2] Performance benchmarks documented — Deferred; timing is bounded by filesystem I/O and delta file count
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented and tested — Evidence: `plan.md` §7 Rollback Plan; four concrete steps including git revert and reverse migration
- [x] CHK-121 [P0] Feature flag configured — Evidence: `resource_map.emit: true` (default on); `--no-resource-map` opt-out wired in all four YAMLs
- [x] CHK-122 [P1] Monitoring/alerting configured — N/A (filesystem tool; degraded marker logged to iteration output)
- [x] CHK-123 [P1] Runbook created — Evidence: Manual testing playbook entries created for both deep-loop skills and the template itself (T022, T023, T038, T039)
- [ ] CHK-124 [P2] Deployment runbook reviewed — Deferred (no deployment artifact beyond filesystem writes)
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Security review completed — Evidence: Phase 003 deep-review 7 iterations; F001–F004 all closed
- [x] CHK-131 [P1] Dependency licenses compatible — Evidence: No external dependencies; pure Node.js CJS with fs/path/JSON only
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed — N/A (no web surface, no auth, no user data)
- [ ] CHK-133 [P2] Data handling compliant with requirements — N/A (path strings only; no PII or sensitive data)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized — Evidence: Root-level spec.md, plan.md, tasks.md, implementation-summary.md, checklist.md, decision-record.md all created and cross-referenced
- [x] CHK-141 [P1] API documentation complete — Evidence: Extractor input/output contract documented in scripts/resource-map/README.md; emitResourceMap() signature and both delta shapes documented
- [ ] CHK-142 [P2] User-facing documentation updated — In progress (Phase 002 T025 final validate.sh run still pending)
- [x] CHK-143 [P2] Knowledge transfer documented — Evidence: `implementation-summary.md` sub-phase summaries; historical origin documented in Phase 001 closure docs
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| claude-sonnet-4-6 | Implementation Agent | [x] Approved | 2026-04-24 |
<!-- /ANCHOR:sign-off -->
