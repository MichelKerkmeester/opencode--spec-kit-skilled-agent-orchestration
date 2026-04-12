---
title: "Verification Checklist: 018 / 011 — graph-metadata.json rollout"
description: "Verification Date: 2026-04-12"
trigger_phrases:
  - "018 011 checklist"
  - "graph metadata checklist"
  - "graph metadata rollout verification"
  - "canonical continuity graph checklist"
importance_tier: "important"
contextType: "planning"
status: "planned"
_memory:
  continuity:
    packet_pointer: "018/011-spec-folder-graph-metadata"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Rebuilt the checklist as a future implementation verification contract"
    next_safe_action: "Use checklist items as exit gates during implementation"
    key_files: ["checklist.md", "tasks.md", "spec.md"]
---
# Verification Checklist: 018 / 011 — graph-metadata.json rollout

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

- [ ] CHK-001 [P0] `spec.md` formalizes the Iteration 4 schema and the dedicated `graph-metadata.json` contract. [REQ: REQ-001, REQ-002]
- [ ] CHK-002 [P0] `plan.md` captures all five rollout phases with verified runtime surfaces. [REQ: REQ-003, REQ-005, REQ-010]
- [ ] CHK-003 [P1] Dependencies and command surfaces are verified against live repo paths before implementation begins. [REQ: REQ-005, REQ-007, REQ-010]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Schema and parser tests reject malformed `graph-metadata.json` files and schema drift. [REQ: REQ-002]
- [ ] CHK-011 [P0] Save refresh preserves `manual.*` and fully regenerates `derived.*` without stale carry-over. [REQ: REQ-003, REQ-004, REQ-012]
- [ ] CHK-012 [P1] Discovery, indexing, and edge projection reuse existing storage contracts instead of creating a new graph table. [REQ: REQ-005, REQ-006]
- [ ] CHK-013 [P1] Ranking changes stay packet-oriented and do not regress canonical spec-doc retrieval. [REQ: REQ-007, REQ-011]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Unit tests cover the schema, parser, and merge semantics for v1 graph metadata. [REQ: REQ-002, REQ-004]
- [ ] CHK-021 [P0] Integration tests cover canonical save refresh, packet row indexing, and packet-aware retrieval. [REQ: REQ-003, REQ-005, REQ-007]
- [ ] CHK-022 [P1] Backfill dry-run and review-flag scenarios are tested on real packet subsets before broad rollout. [REQ: REQ-008]
- [ ] CHK-023 [P1] Validation tests prove warning-first presence rollout and hard-fail schema enforcement. [REQ: REQ-009]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Cross-packet relationships resolve only through validated packet references before edge insertion. [REQ: REQ-006]
- [ ] CHK-031 [P0] Atomic writes prevent partial graph metadata files and manual-relationship loss during save refresh. [REQ: REQ-004, REQ-012]
- [ ] CHK-032 [P1] `description.json` and `_memory.continuity` retain their current roles and do not absorb graph state. [REQ: REQ-001, REQ-011]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `decision-record.md` stay aligned on the same packet contract and rollout boundaries. [REQ: REQ-001, REQ-010]
- [ ] CHK-041 [P1] Command surfaces for plan, complete, resume, and memory search document or implement graph metadata consistently. [REQ: REQ-007, REQ-010]
- [ ] CHK-042 [P2] `implementation-summary.md` records rollout evidence, command strings, and any approved deferrals once the code lands. [REQ: REQ-009, REQ-010]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] The rollout adds only the bounded new root file `graph-metadata.json`, not a new packet document family. [REQ: REQ-001]
- [ ] CHK-051 [P1] Backfill, dry-run, and report artifacts stay in the appropriate scripts or scratch locations and do not pollute packet roots. [REQ: REQ-008, REQ-009]
- [ ] CHK-052 [P2] Legacy `memory/` packet sprawl is not reintroduced as a graph workaround. [REQ: REQ-011]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 9 | 0/9 |
| P2 Items | 3 | 0/3 |

**Verification Date**: 2026-04-12
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] ADR-001, ADR-002, and ADR-003 remain accepted and reflected in implementation surfaces. [REQ: REQ-001, REQ-004, REQ-011]
- [ ] CHK-101 [P1] All ADRs cite the supporting research iterations and the alternatives that were rejected. [REQ: REQ-001, REQ-011]
- [ ] CHK-102 [P1] Migration path, backfill strategy, and rollout boundaries are preserved in implementation docs. [REQ: REQ-008, REQ-009, REQ-010]
- [ ] CHK-103 [P2] Any future schema extensions are documented as additive follow-ons, not silent v1 drift. [REQ: REQ-002, REQ-012]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Packet-oriented boosts remain bounded so ordinary retrieval does not regress. [REQ: REQ-007, REQ-011]
- [ ] CHK-111 [P1] Save-path refresh overhead is measured or judged acceptable for canonical save flows. [REQ: REQ-003]
- [ ] CHK-112 [P2] Backfill execution on a representative packet subset completes without unacceptable runtime or memory pressure. [REQ: REQ-008]
- [ ] CHK-113 [P2] Any performance trade-offs are documented in `implementation-summary.md`. [REQ: REQ-007]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback steps are documented and tested for save-path, discovery, and ranking changes. [REQ: REQ-003, REQ-005, REQ-007]
- [ ] CHK-121 [P0] Validation rollout keeps presence checks in warning mode until backfill coverage is proven. [REQ: REQ-009]
- [ ] CHK-122 [P1] Coverage reporting exists before presence enforcement is promoted to error. [REQ: REQ-008, REQ-009]
- [ ] CHK-123 [P1] A runbook exists for bounded backfill, dry-run review, and post-backfill validation. [REQ: REQ-008, REQ-009, REQ-010]
- [ ] CHK-124 [P2] Completion workflows confirm final packet status and `last_save_at` updates through command surfaces. [REQ: REQ-010]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security review confirms packet references and JSON parsing do not create new unsafe input paths. [REQ: REQ-006, REQ-012]
- [ ] CHK-131 [P1] Dependency use stays within the existing TypeScript, Vitest, and shell toolchain. [REQ: REQ-002]
- [ ] CHK-132 [P2] Optional entity extraction and access timestamps remain additive and documented if enabled. [REQ: REQ-012]
- [ ] CHK-133 [P2] Backfill reports do not expose sensitive or session-only data in packet metadata. [REQ: REQ-008, REQ-012]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] Requirement, task, and checklist traceability remains accurate after implementation. [REQ: REQ-001 through REQ-012]
- [ ] CHK-141 [P1] Packet docs point to the corrected `.opencode/skill/system-spec-kit/...` runtime paths, not shortened placeholders. [REQ: REQ-005, REQ-010]
- [ ] CHK-142 [P2] Operator-facing command docs explain the new lifecycle behavior where needed. [REQ: REQ-010]
- [ ] CHK-143 [P2] Knowledge transfer notes explain how graph metadata complements, rather than replaces, canonical spec docs. [REQ: REQ-011]
<!-- /ANCHOR:docs-verify -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
