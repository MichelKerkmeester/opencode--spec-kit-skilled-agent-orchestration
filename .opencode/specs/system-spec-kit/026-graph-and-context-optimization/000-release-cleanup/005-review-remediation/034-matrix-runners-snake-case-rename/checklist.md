---
title: "Verification Checklist: 047 matrix_runners Snake Case Rename"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist | v2.2"
description: "Verification checklist for directory rename, reference replacement, build, targeted tests, strict validation, and final grep."
trigger_phrases:
  - "034-matrix-runners-snake-case-rename"
  - "matrix_runners rename"
  - "kebab-to-snake convention"
  - "mcp_server folder convention"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/034-matrix-runners-snake-case-rename"
    last_updated_at: "2026-04-29T22:47:36+02:00"
    last_updated_by: "codex"
    recent_action: "Verified rename"
    next_safe_action: "Run final validation"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/matrix_runners"
      - "rename-log.md"
    session_dedup:
      fingerprint: "sha256:047-matrix-runners-snake-case-rename-checklist"
      session_id: "034-matrix-runners-snake-case-rename"
      parent_session_id: "033-release-readiness-synthesis-and-remediation"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 047 matrix_runners Snake Case Rename

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

- [x] CHK-001 [P0] Requirements documented in spec.md. [EVIDENCE: `spec.md` includes scope, requirements, and success criteria]
- [x] CHK-002 [P0] Technical approach defined in plan.md. [EVIDENCE: `plan.md` phases cover rename, references, docs, and verification]
- [x] CHK-003 [P1] Dependencies identified and available. [EVIDENCE: `graph-metadata.json` lists packets 036 and 046]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes build check. [EVIDENCE: `npm run build` exit 0]
- [x] CHK-011 [P0] Runtime imports resolve after rename. [EVIDENCE: TypeScript build exit 0]
- [x] CHK-012 [P1] No semantic logic changes introduced. [EVIDENCE: changes are directory move plus literal path-reference updates]
- [x] CHK-013 [P1] Code follows project patterns. [EVIDENCE: folder now matches adjacent `skill_advisor`, `code_graph`, and `stress_test` snake_case convention]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met. [EVIDENCE: build, Vitest, strict validator, and grep checks passed]
- [x] CHK-021 [P0] Targeted smoke testing complete. [EVIDENCE: `npx vitest run matrix-adapter` passed 5 files and 10 tests]
- [x] CHK-022 [P1] Edge cases tested. [EVIDENCE: final grep covers `.opencode/`, `specs/`, `AGENTS.md`, `CLAUDE.md`, and `README.md`]
- [x] CHK-023 [P1] Error scenario validated. [EVIDENCE: `git mv` sandbox failure handled by filesystem fallback]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. [EVIDENCE: path-only rename did not add secret-bearing content]
- [x] CHK-031 [P0] No command permission semantics changed. [EVIDENCE: adapter command construction untouched]
- [x] CHK-032 [P1] No auth/authz surfaces touched. [EVIDENCE: scope limited to matrix runner paths and docs]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. [EVIDENCE: all three describe the same rename and verification scope]
- [x] CHK-041 [P1] Runtime docs updated. [EVIDENCE: `mcp_server/matrix_runners/README.md`, MCP README, architecture docs, feature catalog, and manual testing docs use `matrix_runners`]
- [x] CHK-042 [P2] Rename log created. [EVIDENCE: `rename-log.md` lists updated files and 301 replacements]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. [EVIDENCE: no packet temp files created]
- [x] CHK-051 [P1] Runtime folder is snake_case. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/` exists]
- [x] CHK-052 [P1] No old runtime directory remains. [EVIDENCE: max-depth directory check shows only `matrix_runners`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-04-29
<!-- /ANCHOR:summary -->
