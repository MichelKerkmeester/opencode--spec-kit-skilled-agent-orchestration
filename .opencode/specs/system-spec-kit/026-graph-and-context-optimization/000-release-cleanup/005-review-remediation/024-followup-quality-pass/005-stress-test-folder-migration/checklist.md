---
title: "Verification Checklist: 037/005 Stress Test Folder Migration"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist | v2.2"
description: "Verification Date: 2026-04-29"
trigger_phrases:
  - "037-005-stress-test-folder-migration"
  - "stress test folder"
  - "dedicated stress folder"
  - "mcp_server/stress_test"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/005-stress-test-folder-migration"
    last_updated_at: "2026-04-29T18:09:55+02:00"
    last_updated_by: "cli-codex"
    recent_action: "stress-test folder migration implemented; default npm test blocked by existing suite failures"
    next_safe_action: "Investigate broad npm test failures outside the moved stress suites"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/stress_test/README"
      - ".opencode/skill/system-spec-kit/mcp_server/vitest.config.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/package.json"
      - "migration-plan.md"
    session_dedup:
      fingerprint: "sha256:037005stresstestfoldermigrationchecklist0000000000000000"
      session_id: "037-005-stress-test-folder-migration"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 037/005 Stress Test Folder Migration

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

- [x] CHK-001 [P0] Requirements documented in spec.md. [EVIDENCE: `spec.md` sections 2 through 5.]
- [x] CHK-002 [P0] Technical approach defined in plan.md. [EVIDENCE: `plan.md` sections 3 through 5.]
- [x] CHK-003 [P1] Dependencies identified and available. [EVIDENCE: `plan.md` section 6.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Confirmed stress suites live in `mcp_server/stress_test/`. [EVIDENCE: `session-manager-stress.vitest.ts` and `code-graph-degraded-sweep.vitest.ts` moved.]
- [x] CHK-011 [P0] Default suite excludes stress tests. [EVIDENCE: `vitest.config.ts` excludes `mcp_server/stress_test/**`; stress runs through `vitest.stress.config.ts`.]
- [x] CHK-012 [P0] TypeScript build excludes stress `.vitest.ts` files. [EVIDENCE: `tsconfig.json` excludes `stress_test/**/*.vitest.ts` and `stress_test/**/*.test.ts`.]
- [x] CHK-013 [P1] Stress runner script present. [EVIDENCE: `package.json` has `stress` script.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Strict packet validator passes. [EVIDENCE: `validate.sh specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/005-stress-test-folder-migration --strict` exited 0 with 0 errors and 0 warnings.]
- [x] CHK-021 [P0] Build passes. [EVIDENCE: `npm run build` exited 0; `tsc --build` passed.]
- [ ] CHK-022 [P0] Default test suite passes. [EVIDENCE: `npm test` reported failures in existing suites including `copilot-hook-wiring`, `plugin-bridge`, `handler-memory-save`, `modularization`, `checkpoints-extended`, `context-server`, code-graph, and docs parity suites, then stopped producing output.]
- [x] CHK-023 [P0] Stress smoke starts moved suite. [EVIDENCE: `npm run stress` exited 0; 2 files and 7 tests passed.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets added. [EVIDENCE: Config/docs/test-only changes contain no credentials.]
- [x] CHK-031 [P0] No auth or governance behavior changed. [EVIDENCE: No production handler, schema, or storage code changed.]
- [x] CHK-032 [P1] Live DB mutation protections preserved. [EVIDENCE: `code-graph-degraded-sweep.vitest.ts` remains isolated and hashes live DB before/after.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Stress folder README documents purpose and run commands. [EVIDENCE: `mcp_server/stress_test/README`.]
- [x] CHK-041 [P1] Candidate classification recorded. [EVIDENCE: `migration-plan.md`.]
- [x] CHK-042 [P1] Direct moved-path references refreshed. [EVIDENCE: moved-path refs in scoped stress-remediation docs now use `mcp_server/stress_test/`; old paths remain only in `migration-plan.md` classification rows.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Packet docs are under the requested 037/005 folder. [EVIDENCE: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, and `graph-metadata.json`.]
- [x] CHK-051 [P1] Existing research prompt/log artifacts preserved. [EVIDENCE: `research/prompts/iteration-001.md` and `logs/iter-001.log` left in place.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 10/11 |
| P1 Items | 9 | 9/9 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-04-29
<!-- /ANCHOR:summary -->
