---
title: "Verification Checklist: 008 W3-W7 Runtime Wiring and Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist | v2.2"
description: "P0/P1/P2 verification gates for Phase G telemetry-first runtime wiring."
trigger_phrases:
  - "008 verification checklist"
  - "w3 w7 runtime wiring checklist"
  - "search decision envelope verification"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/008-w3-w7-runtime-wiring-and-audit"
    last_updated_at: "2026-04-29T05:10:00Z"
    last_updated_by: "codex"
    recent_action: "Completed verification"
    next_safe_action: "Use telemetry outputs"
    blockers: []
    key_files:
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:008-w3-w7-runtime-wiring-and-audit-checklist-20260429-complete"
      session_id: "008-w3-w7-runtime-wiring-and-audit-20260429"
      parent_session_id: "005-review-remediation"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 008 W3-W7 Runtime Wiring and Audit

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] CHK-001 [P0] Requirements documented in `spec.md`. [EVIDENCE: `spec.md:118`]
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. [EVIDENCE: `plan.md:95`]
- [x] CHK-003 [P1] Tasks include file:line targets from Phase F findings. [EVIDENCE: `tasks.md:56`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Telemetry-first behavior preserved; no ranking/refusal/routing/overfetch default change. [EVIDENCE: `search-decision-envelope.ts:4`, `stage3-rerank.ts:349`, `cocoindex-calibration.ts:47`]
- [x] CHK-011 [P0] `SearchDecisionEnvelope` is typed, versioned, and pure-composable. [EVIDENCE: `search-decision-envelope.ts:44`, `search-decision-envelope.ts:78`]
- [x] CHK-012 [P0] W4 Stage 3 uses real QueryPlan instead of hidden unknown empty plan. [EVIDENCE: `stage3-rerank.ts:151`, `stage3-rerank.ts:335`]
- [x] CHK-013 [P1] W9 and W13 sinks are fail-open and rotate bounded JSONL logs. [EVIDENCE: `shadow-sink.ts:39`, `decision-audit.ts:43`]
- [x] CHK-014 [P1] Tenant identity is captured as metadata only. [EVIDENCE: `search-decision-envelope.ts:47`, `cocoindex-calibration.ts:17`, `stage3-rerank.ts:337`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Focused W8/W9/W10/W11/W13 tests exit 0. [EVIDENCE: `npx vitest run stress_test/search-quality/*.vitest.ts tests/query-plan-emission.vitest.ts skill_advisor/tests/shadow-sink.vitest.ts skill_advisor/tests/compat/python-compat.vitest.ts` exit 0]
- [x] CHK-021 [P0] Existing search-quality tests including W3-W7 exit 0. [EVIDENCE: same Vitest command, 17 files and 32 tests passed]
- [x] CHK-022 [P0] `npm run typecheck` exits 0. [EVIDENCE: command exit 0]
- [x] CHK-023 [P0] `npm run build` exits 0. [EVIDENCE: command exit 0]
- [x] CHK-024 [P1] W10 test exercises real degraded code graph state, not static fixture output. [EVIDENCE: `w10-degraded-readiness-integration.vitest.ts:23`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or prompt bodies are unnecessarily persisted in audit logs beyond scoped shadow prompt telemetry requested by W9. [EVIDENCE: `decision-audit.ts:51`, `shadow-sink.ts:49`]
- [x] CHK-031 [P1] Audit/shadow data is bounded and structured JSONL. [EVIDENCE: `decision-audit.ts:49`, `shadow-sink.ts:47`]
- [x] CHK-032 [P1] No writes occur under `006/001` license audit packet. [EVIDENCE: `git status --short` contains no `006/001` paths]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist stay synchronized. [EVIDENCE: strict validator exit 0]
- [x] CHK-041 [P1] `implementation-summary.md` cites file:line closure evidence for F-W3-001 through F-PLAN-001. [EVIDENCE: `implementation-summary.md`]
- [x] CHK-042 [P2] Empty-folder cleanup rationale recorded. [EVIDENCE: `implementation-summary.md`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files remain in test temp dirs or `scratch/` only. [EVIDENCE: W10 and audit tests use `mkdtempSync`]
- [x] CHK-051 [P1] Target empty directories are deleted or documented as intentionally retained. [EVIDENCE: `rmdir` command exit 0; follow-up `find` returned no paths]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 11 | 11/11 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-04-29
<!-- /ANCHOR:summary -->
