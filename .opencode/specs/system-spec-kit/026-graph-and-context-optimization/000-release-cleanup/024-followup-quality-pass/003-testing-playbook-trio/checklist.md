---
title: "Checklist: Testing Playbook Trio"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist | v2.2"
description: "Verification checklist for packet 037/003 manual testing playbook updates."
trigger_phrases:
  - "037-003 testing playbook checklist"
  - "manual playbook trio checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/003-testing-playbook-trio"
    last_updated_at: "2026-04-29T15:41:05Z"
    last_updated_by: "cli-codex"
    recent_action: "Checklist created before final validation"
    next_safe_action: "Run validation"
    blockers: []
    completion_pct: 90
---

# Verification Checklist: Testing Playbook Trio

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

- [x] CHK-001 [P0] Requirements documented in spec.md. [EVIDENCE: requirements table]
- [x] CHK-002 [P0] Technical approach defined in plan.md. [EVIDENCE: implementation phases]
- [x] CHK-003 [P1] Discovery commands executed before edits. [EVIDENCE: `discovery-notes.md`]
- [x] CHK-004 [P1] Template and examples read. [EVIDENCE: sk-doc template plus cli-opencode samples]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Runtime code remains untouched. [EVIDENCE: doc-only file set]
- [x] CHK-011 [P0] Entries are additive only. [EVIDENCE: new scenario files and root links]
- [x] CHK-012 [P1] Commands are copy-pasteable or explicitly marked as MCP calls. [EVIDENCE: scenario command sections]
- [x] CHK-013 [P1] Destructive checks use disposable folders. [EVIDENCE: retention/advisor/code_graph entries]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] sk-doc validation passes for new playbook entries.
- [ ] CHK-021 [P0] Strict validator exits 0 for this packet.
- [ ] CHK-022 [P1] Packet 035 F5-F8 evidence paths exist.
- [ ] CHK-023 [P1] Root playbook links point to existing files.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets included. [EVIDENCE: no credential values in docs]
- [x] CHK-031 [P1] Prompt text is not captured into diagnostics in advisor scenarios. [EVIDENCE: expected-output criteria]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] system-spec-kit playbook has packet 033/034/036 entries. [EVIDENCE: IDs 278-280]
- [x] CHK-041 [P1] skill_advisor playbook has NC-006. [EVIDENCE: skill_advisor NC-006 entry]
- [x] CHK-042 [P1] code_graph coverage has packet 032 and 035 entries. [EVIDENCE: IDs 281-282]
- [x] CHK-043 [P1] Discovery notes document standalone code_graph playbook gap. [EVIDENCE: `discovery-notes.md`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Required packet docs exist. [EVIDENCE: spec, plan, tasks, checklist, implementation summary, description, graph metadata]
- [x] CHK-051 [P1] Additional discovery notes exist. [EVIDENCE: `discovery-notes.md`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 5/7 |
| P1 Items | 13 | 11/13 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending final validation.
<!-- /ANCHOR:summary -->
