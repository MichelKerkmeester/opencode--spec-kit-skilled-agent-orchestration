<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | level2-verify | compact -->
---
title: "...search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/006-continuity-profile-validation/spec]"
description: 'title: "Validate Continuity Profile Weights"'
trigger_phrases:
  - "search"
  - "routing"
  - "advisor"
  - "001"
  - "spec"
  - "006"
  - "continuity"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/006-continuity-profile-validation"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Closed the continuity prompt and judged fixture validation work"
    next_safe_action: "Resume from implementation-summary.md if follow-on continuity tuning is needed"
created: 2026-04-13
level: 2
parent: 001-search-fusion-tuning
status: completed
type: implementation
---
# Feature Specification: Validate Continuity Profile Weights

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-13 |
| **Branch** | `001-search-fusion-tuning` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Continuity tuning still relied on mixed-intent evidence, and the Tier 3 prompt did not explicitly teach the resume-ladder model that the rest of the packet uses.

### Purpose
Validate continuity behavior with a judged query fixture and align the Tier 3 prompt to that same continuity framing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a user-directed 10-15 query continuity fixture to the existing K-sweep test harness.
- Produce an explicit keep/change recommendation for the continuity K recommendation.
- Add one Tier 3 prompt paragraph covering the resume ladder and continuity routing categories.

### Out of Scope
- Retuning non-continuity intents, because this phase is continuity-only.
- Changing routing taxonomy or merge-mode behavior, because the request only validates the existing contract.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts` | Modify | Add the continuity resume-ladder paragraph to the Tier 3 prompt |
| `.opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts` | Modify | Add the judged continuity fixture and keep-`K=60` assertion |
| `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts` | Modify | Verify the prompt contract includes the new continuity paragraph |
| Packet-local `tasks.md`, `checklist.md`, `implementation-summary.md` | Modify/Create | Record completion and evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add a judged continuity-style query fixture in the requested 10-15 range | The focused K-sweep test includes 12 continuity queries with explicit expected top-ranked artifacts at `K=60` |
| REQ-002 | Run the existing `{10,20,40,60,80,100,120}` sweep against continuity judgments | The continuity fixture reuses `optimizeKValuesByIntent()` and asserts the resulting recommendation |
| REQ-003 | Add one continuity-model paragraph to the Tier 3 prompt | `buildTier3Prompt()` includes the resume ladder, metadata target, and routing-category guidance |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Produce an explicit keep/change recommendation | The continuity test records a keep recommendation for baseline `K=60` |
| REQ-005 | Keep non-continuity intent logic unchanged in this phase | Runtime edits remain limited to the prompt paragraph and continuity-focused tests/docs |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Continuity tuning is justified by judged metrics instead of intuition.
- **SC-002**: The judged continuity fixture produces an explicit keep/change recommendation.
- **SC-003**: The Tier 3 prompt includes the same resume-ladder framing used by the fixture.

### Acceptance Scenarios
- **Given** a resume query about the latest stop-state, **when** the continuity fixture evaluates `K=60`, **then** the handover artifact ranks first for that query.
- **Given** a query about compact continuity metadata, **when** the fixture evaluates `K=60`, **then** `_memory.continuity` ranks first for that query.
- **Given** a query that falls through the resume ladder into canonical docs, **when** the fixture evaluates `K=60`, **then** the relevant canonical spec document ranks first for that query.
- **Given** the Tier 3 system prompt, **when** routing continuity content is reviewed, **then** the prompt explicitly names the 3-level resume ladder and the routing categories.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing `optimizeKValuesByIntent()` harness | Low | Reuse the current helper shape instead of introducing new evaluation infrastructure |
| Risk | Synthetic continuity queries could overfit the recommendation | Medium | Keep the recommendation packet-local and document the limitation in the implementation summary |
| Risk | Prompt wording could drift from the benchmark framing | Medium | Assert the new continuity paragraph in `content-router.vitest.ts` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- No open questions remain for this phase; the user-directed 12-query scope superseded the earlier 20-30 planning target.
<!-- /ANCHOR:questions -->
