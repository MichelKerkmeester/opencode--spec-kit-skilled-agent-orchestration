---
title: "Feature Specification: Fix Delivery vs Progress Routing Confusion"
description: "Level 2 remediation packet for delivery/progress routing evidence and replayability."
trigger_phrases:
  - "delivery progress routing"
  - "narrative delivery"
  - "content router cue asymmetry"
importance_tier: "important"
contextType: "spec"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion"
    last_updated_at: "2026-04-21T13:00:00Z"
    last_updated_by: "codex"
    recent_action: "Refreshed packet template and evidence anchors"
    next_safe_action: "No further phase-local work required"
    completion_pct: 100
---
# Feature Specification: Fix Delivery vs Progress Routing Confusion

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-12 |
| **Branch** | orchestrator-managed |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Delivery-oriented status text was too easy to classify as `narrative_progress` when it also used implementation verbs. The router needed stronger delivery mechanics signals without changing category count or tier architecture.

### Purpose
Success means delivery sequencing, gating, rollout, and verification-order text reliably routes to `narrative_delivery` with replayable evidence anchors.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Strengthen delivery cue evidence in `content-router.ts`.
- Keep the routing category set and tier architecture unchanged.
- Prove mixed delivery/progress text in `content-router.vitest.ts`.

### Out of Scope
- Adding new routing categories.
- Retuning thresholds outside the delivery/progress boundary.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts` | Modify | Delivery cue bundle and progress-floor guard |
| `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts` | Modify | Mixed delivery/progress regression coverage |
| `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json` | Modify | Prototype examples for delivery/progress boundary |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Delivery mechanics must outrank generic implementation progress verbs. | `content-router.ts:404-423` and `content-router.ts:965-993` show the delivery cues and guard. |
| REQ-002 | Existing routing categories must remain stable. | Router tests still assert the eight-category library. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Regression coverage must include mixed delivery/progress text. | `content-router.vitest.ts` targeted suite passes. |
| REQ-004 | Evidence anchors must land on current code. | Packet docs cite `content-router.ts:404-423` and `content-router.ts:965-993`. |
| REQ-005 | Packet documentation must remain replayable under strict validation. | `validate.sh --strict --no-recursive` exits `0` for this packet. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Delivery text containing implementation verbs routes to `narrative_delivery`.
- **SC-002**: Strict packet validation has replayable anchors and structured evidence.

### Acceptance Scenarios
1. **Given** delivery text includes rollout sequencing, **When** the router scores it, **Then** `narrative_delivery` wins.
2. **Given** delivery text also contains implementation verbs, **When** `strongDeliveryMechanics` matches, **Then** the progress floor is suppressed.
3. **Given** a reviewer opens packet evidence, **When** they inspect the cited router lines, **Then** the anchors land on current code.
4. **Given** strict validation runs, **When** packet docs are checked, **Then** anchors, frontmatter, and evidence markers pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Delivery cues become too broad | Could misclassify task updates | Keep cues limited to sequencing, gating, rollout, and verification order |
| Dependency | `content-router.vitest.ts` | Needed to prove behavior | Keep targeted router suite as verification surface |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should future telemetry move the delivery threshold after cue-level evidence is stable?
<!-- /ANCHOR:questions -->
