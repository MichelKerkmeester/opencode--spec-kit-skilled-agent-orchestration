<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
---
title: "Feature Specification: Doc Surface Alignment for Research Content Routing Accuracy"
description: "This phase aligns the doc surfaces that describe canonical save routing to the shipped runtime behavior. The goal is to remove stale statements about category count, Tier 3 availability, delivery versus progress boundaries, handover versus drop handling, routeAs overrides, and packet_kind derivation."
trigger_phrases:
  - "018 phase 004 spec"
  - "doc surface alignment"
  - "research content routing accuracy"
  - "save routing docs"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/004-doc-surface-alignment"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Backfilled Level 2 spec anchors for routing doc parity"
    next_safe_action: "Verify the updated packet docs and close the phase with strict validation evidence"
    blockers: []
    key_files:
      - ".opencode/command/memory/save.md"
      - ".opencode/skill/system-spec-kit/ARCHITECTURE.md"
      - ".opencode/skill/system-spec-kit/SKILL.md"
      - ".opencode/skill/system-spec-kit/references/memory/save_workflow.md"
      - ".opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/202-canonical-continuity-save-substrate.md"
    session_dedup:
      fingerprint: "sha256:018-phase-004-doc-surface-alignment-spec"
      session_id: "018-phase-004-doc-surface-alignment"
      parent_session_id: null
    completion_pct: 65
    open_questions: []
    answered_questions:
      - "Which doc surfaces must be aligned for the 018 routing changes"
      - "Which routing details are now source-of-truth from the shipped save handler"
---
# Feature Specification: Doc Surface Alignment for Research Content Routing Accuracy

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-13 |
| **Branch** | `026-graph-and-context-optimization` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Several user-facing documentation surfaces still describe an older canonical save-routing contract. Before this phase, the docs could misstate the routing category count, present Tier 3 as dormant instead of live behind an env flag, blur delivery cues with narrative progress, blur handover with hard-drop cases, omit `routeAs` override semantics, or describe `packet_kind` too heavily as a path-driven heuristic.

### Purpose
Bring every named routing-aware doc surface into parity with the shipped save handler so operators, agents, and manual testers all read the same routing contract.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Align the named command, architecture, skill, reference, feature-catalog, playbook, and MCP config surfaces to the shipped canonical save-router behavior.
- Document the live 8-category router, always-on Tier 3 path, strengthened delivery cues, hard-drop versus soft-ops split, `routeAs` override behavior, and metadata-first `packet_kind` derivation.
- Create packet-local `tasks.md`, `checklist.md`, and `implementation-summary.md`, plus any required plan/checklist backfill needed for strict validation of this phase folder.

### Out of Scope
- Changing the runtime routing logic itself. That shipped in earlier phases and is only read as source-of-truth here.
- Updating unrelated documentation that does not describe save-routing behavior.
- Running git commit, git push, or publish flows.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/ARCHITECTURE.md` | Modify | Align architecture narrative to the shipped canonical save router |
| `.opencode/command/memory/save.md` | Modify | Update the primary save command docs for all routing changes |
| `.opencode/command/memory/manage.md` | Modify | Keep save-backed behavior wording aligned with the always-on Tier 3 contract |
| `.opencode/skill/system-spec-kit/SKILL.md` | Modify | Keep the spec-kit skill routing guidance current |
| `.opencode/skill/system-spec-kit/references/memory/save_workflow.md` | Modify | Refresh the canonical save workflow reference |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/02--mutation/006-memory-indexing-memory-save.md` | Modify | Update the mutation/save test scenario |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/202-canonical-continuity-save-substrate.md` | Modify | Update canonical save substrate scenarios |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modify | Keep the root playbook index wording aligned |
| `.opencode/skill/system-spec-kit/feature_catalog/02--mutation/01-memory-indexing-memorysave.md` | Modify | Refresh routing-aware feature copy |
| `.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md` | Modify | Document that the Tier 3 routing flag is removed |
| `.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md` | Modify | Keep the aggregated feature catalog in sync |
| `.mcp.json`, `.claude/mcp.json`, `.vscode/mcp.json`, `.gemini/settings.json`, `opencode.json` | Verify | Keep config mirrors free of stale `SPECKIT_TIER3_ROUTING` operator notes |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Modify/Create | Record and validate this phase locally |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Routing-aware docs must describe the canonical router as 8 categories, not 7 | The primary command/architecture/skill/reference docs enumerate or describe the 8-category router |
| REQ-002 | Tier 3 must be described as live in the save handler with no `SPECKIT_TIER3_ROUTING` opt-in gate | The aligned docs present Tier 3 as always active by default and describe endpoint failure as a Tier 2 fallback, not a feature flag |
| REQ-003 | The updated docs must describe the corrected routing boundaries and overrides | Delivery cues, handover versus drop, `routeAs`, and metadata-first `packet_kind` are all documented on the affected surfaces |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Packet-local execution docs must exist for this phase | `tasks.md`, `checklist.md`, `implementation-summary.md`, and `plan.md` exist and reflect the work performed |
| REQ-005 | Strict phase-folder validation must pass after packet-doc backfill | `validate.sh --strict` exits successfully for this phase folder |
| REQ-006 | Only surfaces that actually reference changed routing behavior should be edited | Scanned-but-unchanged surfaces are left alone and called out in the summary when they do not describe the changed router contract |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every edited routing-aware doc surface now reflects the shipped 8-category canonical save router and the always-on Tier 3 path.
- **SC-002**: The phase folder contains complete Level 2 execution docs and passes strict validation.
- **SC-003**: No unrelated documentation churn is introduced outside the named routing-aware surfaces.

### Acceptance Scenarios

- **Given** an operator reads the updated save-path docs, **when** they look for the router vocabulary, **then** they find all 8 routing categories instead of the older 7-category wording.
- **Given** an operator checks the Tier 3 routing guidance, **when** they inspect the updated command, skill, and config surfaces, **then** they see that Tier 3 participates by default and only falls back when the endpoint is unavailable or unusable.
- **Given** a maintainer wants to understand ambiguous chunk handling, **when** they read the updated routing guidance, **then** they see the strengthened delivery cues, the hard-drop versus soft-ops split, and the `routeAs` audit contract.
- **Given** a future packet author wants to understand routing context, **when** they read the updated docs, **then** they see that `packet_kind` is derived from spec metadata first with fallback only when metadata is silent.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Shipped runtime code in `content-router.ts` and `memory-save.ts` | If the code is misunderstood, docs could drift again | Read the runtime first and treat it as the only routing source-of-truth |
| Risk | Overstating `packet_kind` derivation as path-free when fallback logic still exists | Could mislead operators and future maintainers | Document metadata-first behavior with parent-phase fallback wording when metadata is silent |
| Risk | Editing guidance surfaces that do not actually describe routing semantics | Creates unnecessary churn and broader review load | Scan named surfaces first and leave non-routing files unchanged |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: This phase remains documentation-only and does not add runtime overhead.
- **NFR-P02**: Verification should stay fast enough for normal doc-maintenance loops by using targeted `jq`, `rg`, and strict packet validation.

### Security
- **NFR-S01**: No secrets or endpoint defaults may be changed while removing stale `SPECKIT_TIER3_ROUTING` wording.
- **NFR-S02**: Docs must describe the always-on Tier 3 contract without implying an operator-controlled flag.

### Reliability
- **NFR-R01**: The packet-local docs must be strict-validator compliant so this phase can resume cleanly later.
- **NFR-R02**: Documentation claims must stay evidence-backed and match the actual shipped save-handler behavior.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty or metadata-only save content should still be described as routing into `metadata_only` or safe refusal, not forced into narrative categories.
- Explicit handover wrappers should remain documented as hard-drop candidates, even when the payload contains operational wording.
- `routeAs` overrides must remain documented as explicit operator hints that do not erase the natural classification for audit.

### Error Scenarios
- Docs must not reintroduce `SPECKIT_TIER3_ROUTING` as a live flag or imply that Tier 3 is opt-in.
- If a surface no longer describes routing semantics after the scan, it should remain unchanged rather than receive speculative wording.

### State Transitions
- Packet-local docs can start as in-progress during editing, but must be updated to complete once verification passes.
- Strict validation backfill may require adding `plan.md` and anchor-complete docs even for a compact doc-only phase.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Multi-surface doc pass across commands, skill docs, configs, catalog, playbook, and packet docs |
| Risk | 11/25 | Runtime untouched, but doc drift risk is real and can mislead operators |
| Research | 11/20 | Required reading of runtime router/save-handler code and validator expectations |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None at closeout. The required scope and routing deltas are explicit in the parent phase instructions and runtime code.
<!-- /ANCHOR:questions -->
