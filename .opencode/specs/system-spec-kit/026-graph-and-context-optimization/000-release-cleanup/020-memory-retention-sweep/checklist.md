---
title: "Checklist: Memory Retention Sweep"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist | v2.2"
description: "Verification checklist for packet 033 memory retention enforcement."
trigger_phrases:
  - "033 retention checklist"
  - "memory retention verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/020-memory-retention-sweep"
    last_updated_at: "2026-04-29T14:03:15Z"
    last_updated_by: "cli-codex"
    recent_action: "Retention sweep complete"
    next_safe_action: "Orchestrator commit"
    blockers: []
    completion_pct: 100
---
# Verification Checklist: Memory Retention Sweep

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

- [x] CHK-001 [P0] Requirements documented in spec.md. [EVIDENCE: spec.md requirements table]
- [x] CHK-002 [P0] Technical approach defined in plan.md. [EVIDENCE: plan.md phases and architecture]
- [x] CHK-003 [P1] Source research read and cited. [EVIDENCE: 013 P1-2 lines cited]
- [x] CHK-004 [P1] Target files read before editing. [EVIDENCE: source code read with `sed`/`grep`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Expired rows are deleted through existing index cleanup path. [EVIDENCE: `memory-retention-sweep.ts:148-190`; targeted test]
- [x] CHK-011 [P0] Dry-run does not mutate database state. [EVIDENCE: `memory-retention-sweep.vitest.ts:86-100`]
- [x] CHK-012 [P0] Audit rows record `reason="retention_expired"` and original `delete_after`. [EVIDENCE: `memory-retention-sweep.vitest.ts:102-130`]
- [x] CHK-013 [P1] Scheduler is independently configurable and does not alter session cleanup. [EVIDENCE: `session-manager.ts:204-290`]
- [x] CHK-014 [P1] MCP tool is registered and schema-validated. [EVIDENCE: `tool-schemas.ts:328-332`; `tool-input-schemas.ts` registration]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `npx vitest run memory-retention-sweep` passes. [EVIDENCE: 6 tests passed]
- [x] CHK-021 [P0] `npm run build` passes. [EVIDENCE: build exit 0]
- [x] CHK-022 [P0] Strict validator exits 0. [EVIDENCE: final `validate.sh --strict` run]
- [x] CHK-023 [P1] Targeted tests cover empty result and sweep/insert interleaving. [EVIDENCE: `memory-retention-sweep.vitest.ts:159-190`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No destructive repo commands used. [EVIDENCE: no reset/checkout/delete commands used]
- [x] CHK-031 [P1] Retention audit metadata avoids unrelated content disclosure. [EVIDENCE: audit metadata stores ids, path, spec folder, and delete_after only]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] README documents retention behavior, env flags, and manual trigger. [EVIDENCE: `README.md:934-953`]
- [x] CHK-041 [P1] ENV reference documents retention env vars. [EVIDENCE: `ENV_REFERENCE.md:276-277`]
- [x] CHK-042 [P1] Governance comment points from `delete_after` persistence to sweep. [EVIDENCE: `scope-governance.ts:321`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Required seven packet files exist. [EVIDENCE: packet files created]
- [x] CHK-051 [P1] Packet metadata JSON is valid and scoped to 033. [EVIDENCE: `description.json`, `graph-metadata.json` created]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 10 | 10/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-04-29 — retention sweep complete, validator green
<!-- /ANCHOR:summary -->
