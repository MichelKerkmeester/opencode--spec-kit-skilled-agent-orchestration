---
title: "Feature Specification: Implement and Remove Deprecated Features"
description: "Release-control packet for the six deprecated-feature remediation targets identified by the hybrid-RAG audit: three implementation candidates and three retirement candidates."
trigger_phrases:
  - "deprecated feature remediation"
  - "022 implement and remove deprecated features"
  - "graph calibration"
  - "temporal contiguity"
  - "consumption logger"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Implement and Remove Deprecated Features

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

### Executive Summary

This packet preserves the six remediation targets that closed the `007-code-audit-per-feature-catalog` phase chain: three previously deprecated capabilities that needed release-level verification and three obsolete evaluation/shadow artifacts targeted for retirement. During the 2026-03-25 release-alignment pass, the packet was normalized to reflect its actual role as a release-control tracker, while execution status remains coordinated with the parent release packet at `../../001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/spec.md`.

**Outcome**: Packet normalized and cross-linked for release control; underlying runtime/remove work remains partially complete.

**Key Decisions**: Keep this child packet focused on scoped remediation ownership, not fresh implementation work; use the parent `012` packet for end-to-end release verification.

**Critical Dependencies**: `../021-remediation-revalidation/spec.md`, `../../001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/spec.md`, and the current repository state for the six targeted features.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Partially Complete |
| **Created** | 2026-03-23 |
| **Completed** | Release verification pending |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../021-remediation-revalidation/spec.md |
| **Release Packet** | ../../001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The final audit phase identified a small set of deprecated-feature decisions that sat between documentation cleanup and runtime release readiness. Without a packet dedicated to those six targets, the audit chain ended with remediation intent but no validator-compliant record tying the targets to the release packet that now owns final verification.

### Purpose
Track the six deprecated-feature remediation targets, record their release-control ownership, and keep this phase packet truthful and validator-compliant while final execution status is verified elsewhere.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record the three implementation candidates and three retirement candidates that closed the audit chain.
- Cross-link this phase packet to the release-control packet in `012-pre-release-fixes-alignment-preparation`.
- Preserve the intended integration and removal surfaces for later verification.
- Normalize this child packet so it can participate in recursive spec validation.

### Out of Scope
- Claiming new runtime behavior that has not been re-verified in the current release pass.
- Performing broad implementation or removal work from this packet during documentation normalization.
- Rewriting adjacent audit phases outside this packet.

### Files Referenced

| File Path | Role |
|-----------|------|
| `mcp_server/lib/search/graph-calibration.ts` | Graph calibration implementation candidate |
| `mcp_server/lib/cognitive/temporal-contiguity.ts` | Temporal contiguity implementation candidate |
| `mcp_server/lib/telemetry/consumption-logger.ts` | Consumption logging implementation candidate |
| `mcp_server/lib/eval/channel-attribution.ts` | Retirement candidate |
| `mcp_server/lib/eval/eval-ceiling.ts` | Retirement candidate |
| ~~`mcp_server/shared/algorithms/fusion-lab.ts`~~ Deleted | Retirement candidate (historical - fusion-lab.js deleted in commit 56c67030f) |
| `../../001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/spec.md` | Parent release-control packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The packet records all six remediation targets | Three implementation targets and three retirement targets are listed with current intent |
| REQ-002 | Release-control ownership is explicit | The packet links to the parent `012` packet for final verification |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Packet-local markdown references resolve cleanly | Recursive validation does not fail on broken child-packet links |
| REQ-004 | The packet distinguishes documentation normalization from runtime execution | Readers can tell that this pass did not newly claim implementation completion |
| REQ-005 | Implementation-summary coverage exists for this child packet | `implementation-summary.md` records the normalization outcome and remaining dependency on the parent release packet |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All six remediation targets are preserved in a validator-compliant child packet.
- **SC-002**: The packet clearly hands off final ship/no-ship verification to the `012` release packet.
- **SC-003**: Broken packet-local markdown references are eliminated.
- **SC-004**: Recursive validation can evaluate this phase without structural failures.

### Acceptance Scenarios

- **Given** a reviewer opening the last phase of the `007` audit chain, **when** they read this packet, **then** they can see the six targeted remediation items without relying on stale shorthand paths.
- **Given** the release packet in `012`, **when** a maintainer follows the link from this child packet, **then** they arrive at the packet that owns final release verification.
- **Given** a validator run against this phase, **when** anchors and template headers are checked, **then** the packet behaves like a Level 2 packet rather than an ad hoc scratch note.
- **Given** a future implementation pass, **when** engineers reuse this packet, **then** they can separate already-normalized documentation work from still-pending runtime verification.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Parent release packet in `012` | Final execution status may drift if `012` is not kept current | Treat `012` as the authoritative release-control source |
| Risk | Legacy remediation intent predates the current repo state | This child packet could over-claim completion | Keep status as Partially Complete and avoid unsupported runtime claims |
| Risk | Retirement targets may still surface in docs or tests | Release readiness could be overstated | Require follow-up verification in the parent packet before ship |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Packet readers should understand the six-target scope without scanning unrelated audit phases.

### Reliability
- **NFR-R01**: This packet must stay structurally valid under recursive spec validation.

### Maintainability
- **NFR-M01**: Release-control ownership must remain explicit so later sessions do not split truth between `007` and `012`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Historical Drift
- Some targets in this packet were originally framed as fresh implementation/removal work but are now better treated as release-verification targets.

### Mixed Status
- The three implementation candidates and three retirement candidates may not all converge at the same time; this packet keeps them grouped without assuming identical completion states.

### Cross-Packet Ownership
- This packet belongs to the audit chain, while the final decision to ship belongs to the parent release packet.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Six remediation targets plus release-control cross-linking |
| Risk | 11/25 | Misstating runtime/remove status would mislead release decisions |
| Research | 10/20 | Requires reconciling older remediation intent with current packet ownership |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

### Remediation Targets

| Target | Category | Intended Outcome | Current Packet Role |
|--------|----------|------------------|---------------------|
| Graph calibration profiles | Implement | Verify production wiring and flag handling | Tracked for release verification |
| Temporal contiguity layer | Implement | Verify Stage 1 wiring and rollout flag handling | Tracked for release verification |
| Consumption logger | Implement | Verify logging enablement path | Tracked for release verification |
| Channel attribution | Remove | Confirm retirement from code/docs/tests | Tracked for release verification |
| Fusion policy shadow V2 | Remove | Confirm retirement from code/docs/tests | Tracked for release verification |
| Full-context ceiling eval | Remove | Confirm retirement from code/docs/tests | Tracked for release verification |

### Related Documents

- **Parent Audit Phase**: See `../021-remediation-revalidation/spec.md`
- **Release-Control Packet**: See `../../001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/spec.md`
- **Implementation Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Q1 open: Which of the six targets still require code changes, versus documentation-only confirmation, after the latest `012` release-alignment pass?
- Q2 open: Should a future session split implementation candidates from retirement candidates into separate child packets once final verification is complete?
<!-- /ANCHOR:questions -->
