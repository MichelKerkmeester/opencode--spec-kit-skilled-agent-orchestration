---
title: "Verification Checklist: sk-code-opencode-merger"
description: "Plan and future implementation verification checklist for the sk-code-opencode merger packet."
trigger_phrases:
  - "sk-code-opencode merger checklist"
  - "single sk-code verification"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/066-sk-code-opencode-merger"
    last_updated_at: "2026-05-03T15:00:00Z"
    last_updated_by: "multi-ai-council"
    recent_action: "Deep-analysis session resolved all open questions"
    next_safe_action: "Run spec validation after docs are populated"
    blockers:
      - "Runtime implementation checks pending approval"
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/resource-map.md"
    session_dedup:
      fingerprint: "sha256:0660660660660660660660660660660660660660660660660660660660660663"
      session_id: "066-sk-code-opencode-merger-plan"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions:
      - "All 4 open questions resolved in deep-analysis session."
      - "Changelogs: DELETE; Telemetry: REGENERATE; Route: opencode/OPENCODE."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: sk-code-opencode-merger

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] CHK-001 [P0] Requirements documented in `spec.md`.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`.
- [x] CHK-003 [P1] Dependencies identified and available.
- [x] CHK-004 [P0] Plan-only scope honored for this turn.
- [x] CHK-005 [P0] Detailed resource map created.
- [x] CHK-006 [P0] User approves implementation before runtime file edits.
- [x] CHK-006a [P0] Deep-analysis session resolved all 4 open questions (2026-05-03).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Future `sk-code` two-axis detection routes Webflow + OpenCode correctly.
- [ ] CHK-010a [P0] CODE SURFACE detection: Webflow markers route to webflow surface; .opencode/ CWD routes to opencode surface.
- [ ] CHK-010b [P0] Language sub-detection within OPENCODE correctly selects JS/TS/Python/Shell/Config from file extensions.
- [ ] CHK-011 [P0] Moved verifier script passes its Python tests.
- [ ] CHK-012 [P1] TypeScript advisor scorer changes pass targeted vitest suites.
- [ ] CHK-013 [P1] Agent and command docs use one synchronized wording model.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Exact live search for `sk-code-opencode` has only historical/archive matches (or none after deletion).
- [ ] CHK-020a [P0] Historical changelogs (13 files) deleted.
- [ ] CHK-020b [P0] Telemetry JSONL regenerated.
- [ ] CHK-021 [P0] Exact live search for `sk-code-*` overlay language has only approved historical matches.
- [ ] CHK-022 [P0] Exact `sk-code` search shows no live `GO` or `NEXTJS` support claims.
- [ ] CHK-023 [P1] Skill advisor hook tests updated from old expected skill label.
- [ ] CHK-024 [P1] Runtime agent parity reviewed across OpenCode, Claude, Codex, and Gemini.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable surface has a class in `resource-map.md`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed for exact `sk-code-opencode` and overlay references.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for agents, commands, skills, advisor code/tests, docs, metadata, and generated artifacts.
- [ ] CHK-FIX-004 [P0] Future implementation proves no live deleted-skill references remain.
- [ ] CHK-FIX-005 [P1] Matrix axes are listed in the implementation summary after implementation.
- [ ] CHK-FIX-006 [P1] Generated artifacts are refreshed or explicitly classified as historical.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to exact command outputs in the final implementation summary.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Prompt-injection advisor fixtures remain covered after skill ID rewrite.
- [ ] CHK-031 [P0] No moved script broadens filesystem behavior.
- [ ] CHK-032 [P1] Hook/advisor tests still sanitize injected skill labels.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized for planning.
- [x] CHK-041 [P1] Resource map documents broad blast radius.
- [ ] CHK-042 [P2] Runtime READMEs updated during future implementation.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Spec files live in the requested folder.
- [x] CHK-051 [P1] No scratch files created outside `scratch/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 10/17 |
| P1 Items | 12 | 6/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-05-03
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decision documented in `decision-record.md`.
- [x] CHK-101 [P1] ADR has status.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale.
- [x] CHK-103 [P2] Migration path documented in `plan.md`.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Future advisor route does not increase routing ambiguity.
- [ ] CHK-111 [P1] Future exact search and tests complete within normal local workflow time.
- [ ] CHK-112 [P2] No load testing required.
- [ ] CHK-113 [P2] No performance benchmark required.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure documented.
- [ ] CHK-121 [P0] Future implementation keeps deletion of `sk-code-opencode` as final step.
- [ ] CHK-122 [P1] Metadata regeneration path selected.
- [ ] CHK-123 [P1] Runbook created in final implementation summary.
- [ ] CHK-124 [P2] Deployment runbook not applicable unless packaged release follows.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Future security review completed for advisor prompt-injection tests.
- [ ] CHK-131 [P1] Dependency licenses unaffected.
- [ ] CHK-132 [P2] OWASP checklist not applicable to docs-only routing unless code changes add input handling.
- [ ] CHK-133 [P2] Data handling unchanged.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] Planning spec documents synchronized.
- [ ] CHK-141 [P1] Future user-facing `sk-code` docs updated.
- [ ] CHK-142 [P2] Install guides updated.
- [x] CHK-143 [P2] Knowledge transfer documented through resource map.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | Scope owner | Pending implementation approval | |
| Codex | Planning author | Planning docs drafted | 2026-05-03 |
<!-- /ANCHOR:sign-off -->
