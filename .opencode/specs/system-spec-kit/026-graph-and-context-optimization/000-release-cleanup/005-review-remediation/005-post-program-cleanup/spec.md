---
title: "Feature Specification: 005 Post-Program Cleanup"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2"
description: "Close post-program status, traceability, and validator hygiene gaps introduced or left open by the 026 deep-review remediation program."
trigger_phrases:
  - "005 post-program cleanup"
  - "026 validator hygiene"
  - "release cleanup status drift"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/005-post-program-cleanup"
    last_updated_at: "2026-04-28T19:26:58Z"
    last_updated_by: "codex"
    recent_action: "Planned post-program cleanup"
    next_safe_action: "Implement validator/status cleanup"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:005-post-program-cleanup-20260428"
      session_id: "005-post-program-cleanup-20260428"
      parent_session_id: "026-post-program-deep-review"
    completion_pct: 40
    open_questions: []
    answered_questions:
      - "Tier C remains deferred and out of scope."
---
# Feature Specification: 005 Post-Program Cleanup

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
| **Created** | 2026-04-28 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 026 deep-review remediation program landed most runtime and documentation fixes, but left post-program status and validator surfaces stale. Completed remediation packets still present as `planned`, parent maps omit the remediation child, and the source packets 005/011 are not strict-validator green.

### Purpose
Make the post-program state auditable, traceable, and validator-clean where the prompt scope allows, while preserving Tier C deferrals and prior closure tallies.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Review report for Tiers A, B, and D.
- L2 spec packet for this cleanup.
- Metadata/status refreshes for completed remediation/source packets.
- Parent phase-map traceability for `005-review-remediation`.
- Strict-validator hygiene attempts for 005 and 011.
- Focused Vitest sweep covering new SSOT helpers and fixtures.

### Out of Scope
- `006/001-clean-room-license-audit` - deferred P0 license audit.
- CHK-T15 on 005 - live MCP rescan operator gate.
- New SSOT helper creation - prompt forbids adding new helpers.
- Prior 56/65 closure tally changes - this packet only cleans post-program state.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `review/005-post-program-cleanup-pt-01/review-report.md` | Create | Phase 1 audit findings and planning packet. |
| `spec.md` | Create/Modify | L2 cleanup specification and continuity. |
| `plan.md` | Create | Implementation plan and quality gates. |
| `tasks.md` | Create/Modify | Atomic task ledger with evidence. |
| `checklist.md` | Create/Modify | Verification checklist. |
| `implementation-summary.md` | Create | Final disposition table and known limitations. |
| `description.json` | Create | Packet metadata for graph/memory discovery. |
| `graph-metadata.json` | Create | Packet graph metadata and derived status. |
| `../../001-memory-indexer-storage-boundary/graph-metadata.json` | Modify | Refresh stale `planned` status. |
| `../../004-tier2-remediation/graph-metadata.json` | Modify | Refresh stale `planned` status. |
| `../../../008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/graph-metadata.json` | Modify | Refresh stale source-packet status. |
| `../../../005-memory-indexer-invariants/implementation-summary.md` | Modify | Refresh continuity freshness without closing CHK-T15. |
| `../../../005-memory-indexer-invariants/graph-metadata.json` | Modify | Refresh metadata save timestamp while preserving CHK-T15 status. |
| `../../../015-mcp-runtime-stress-remediation/*` | Modify | Targeted validator hygiene if bounded. |
| `../../../spec.md` | Modify | Add `005-review-remediation` to `000-release-cleanup` phase map. |
| `../../../spec.md` | Modify | Refresh root phase map traceability for release cleanup. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve Tier C deferrals and CHK-T15 boundaries. | No edits under `006/001`; 005 CHK-T15 remains deferred/special-status unless live rescan evidence exists. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Bring 005 strict validation to green without closing CHK-T15. | `validate.sh .../005-memory-indexer-invariants --strict` exits 0 or a known limitation records the exact residual after two attempts. |
| REQ-003 | Attempt to bring 011 strict validation to green. | `validate.sh .../015-mcp-runtime-stress-remediation --strict` exits 0 or implementation-summary records the exact residual after two attempts. |
| REQ-004 | Refresh stale completion metadata. | 001 and 004 remediation sub-phases and 008/008 source packet carry status matching actual completion evidence. |
| REQ-005 | Keep this cleanup packet validator-clean. | `validate.sh .../005-post-program-cleanup --strict` exits 0. |

### P2 - Advisory

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Restore phase-map traceability. | Parent maps include `005-review-remediation` and current child count. |
| REQ-007 | Document B1/B2 no-op decision. | Implementation summary records why no helper/fixture refactor landed. |
| REQ-008 | Verify B3 and D2. | Combined focused Vitest sweep passes; rubric replay confirms 30 cells and score sum 201. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Review report exists with P0/P1/P2 findings and adversarial self-checks for P1 items.
- **SC-002**: L2 packet docs validate strictly.
- **SC-003**: 005 and 011 validators are green, or residual limitations are documented after two attempts.
- **SC-004**: Completed packets no longer show stale `planned` or `in_progress` status where evidence proves completion.
- **SC-005**: B3 focused Vitest sweep and D2 rubric replay are recorded with evidence.

### Acceptance Scenarios

1. **Given** stale remediation metadata, when the cleanup completes, then completed sub-phases no longer present as `planned`.
2. **Given** the 005 source packet has CHK-T15 deferred, when metadata is refreshed, then the special live-rescan status remains intact.
3. **Given** the 011 source packet has broad validator debt, when two bounded hygiene passes finish, then strict validation either exits 0 or the exact residual is documented.
4. **Given** the B3 fixture sweep runs in one process, when all tests finish, then no inter-test state collision or process leakage is observed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | 011 has broad historical template debt. | Strict green may require many unrelated leaf-packet rewrites. | Make two bounded attempts, then document exact residual. |
| Dependency | Validator behavior. | Recursive validation may surface legacy leaf warnings. | Fix root/post-program causes first; preserve output evidence. |
| Risk | Status overreach. | Marking CHK-T15 complete would violate operator-gate deferral. | Preserve special 005 status. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime code changes unless B3 exposes a real collision.

### Security
- **NFR-S01**: No changes to auth/trusted-caller behavior.
- **NFR-S02**: No edits to license-audit deferred packet.

### Reliability
- **NFR-R01**: Validator and test evidence must be reproducible from local commands.
- **NFR-R02**: Metadata refreshes must preserve existing packet identity fields.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty graph metadata status: preserve existing schema and only update derived status/timestamps.
- Special status values: keep `code_complete_pending_track_a_live_rescan` for 005.

### Error Scenarios
- 011 still fails after two bounded fixes: halt and record known limitations.
- Vitest collision appears: add regression before fixing.

### State Transitions
- Completed remediation with deferred out-of-scope item: status may be `complete` when the deferral is explicitly documented.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Multiple docs and metadata surfaces under one phase parent. |
| Risk | 15/25 | Mostly docs/metadata, but validator gates are strict. |
| Research | 14/20 | Requires cross-checking summaries, rubrics, and test fixtures. |
| **Total** | **47/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Tier C and CHK-T15 are explicitly deferred by the prompt.
<!-- /ANCHOR:questions -->
