---
title: "Feature Specification: 041 resource maps and memory finalization"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2"
description: "Spec-local packet for finalizing resource maps and memory indexing across session-touched folders."
trigger_phrases:
  - "028-resource-maps-and-memory-finalization"
  - "resource maps cycle"
  - "memory finalization"
  - "session packet indexing"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/028-resource-maps-and-memory-finalization"
    last_updated_at: "2026-04-29T20:43:11+02:00"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Resource maps indexed"
    next_safe_action: "Use finalization log downstream"
    blockers: []
    key_files:
      - "finalization-log.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: 041 Resource Maps and Memory Finalization

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Seventeen session-touched spec folders lacked final resource maps and fresh memory indexing. Without a path ledger and canonical save pass, downstream reviewers have to reconstruct touched files from git history and memory search may miss the latest packet state.

### Purpose
Create accurate resource maps for the target packets and run canonical memory indexing so each folder is ready for downstream work.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Generate resource map file for the 17 target packet folders.
- Create the Level 2 finalization packet docs and `finalization-log.md`.
- Run `generate-context.js` for each target packet and strict validation for the targets plus this packet.

### Out of Scope
- Runtime code changes.
- Git commit creation.
- Rewriting target packet narratives beyond canonical metadata refreshes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| target packet resource map files | Create | Resource maps for the target packets. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/028-resource-maps-and-memory-finalization/spec.md` | Create | Finalization packet spec. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/028-resource-maps-and-memory-finalization/plan.md` | Create | Finalization execution plan. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/028-resource-maps-and-memory-finalization/tasks.md` | Create | Finalization task ledger. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/028-resource-maps-and-memory-finalization/checklist.md` | Create | Verification checklist. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/028-resource-maps-and-memory-finalization/implementation-summary.md` | Create | Completion narrative and evidence. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/028-resource-maps-and-memory-finalization/finalization-log.md` | Create | Per-packet finalization evidence. |
| Target packet `description.json` / `graph-metadata.json` | Update | Canonical save metadata refresh. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Author 17 resource maps | Each target packet has a non-empty resource map file. |
| REQ-002 | Run canonical memory indexing | `generate-context.js` exits 0 for all 17 target packets. |
| REQ-003 | Preserve doc-only scope | Only resource maps, finalization docs, and canonical metadata are changed. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Validate packet folders | Strict validator exits 0 for the targets and this packet. |
| REQ-005 | Record evidence | `finalization-log.md` shows map size, index exit code, and validator result. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 17/17 target packets have non-empty resource maps.
- **SC-002**: 17/17 target packets are indexed by `generate-context.js` with exit code 0.
- **SC-003**: Strict validator exits 0 for this packet.

### Acceptance Scenarios

| ID | Scenario | Expected Result |
|----|----------|-----------------|
| AS-001 | **Given** a reviewer opens any target packet | The packet has a non-empty resource map file. |
| AS-002 | **Given** memory search indexes target packet docs | `generate-context.js` exits 0 and refreshes metadata. |
| AS-003 | **Given** strict validation runs on target packets | Each target exits 0 after indexing. |
| AS-004 | **Given** the finalization packet is reviewed | `finalization-log.md` shows 17/17 indexed. |
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Prior target packets | Resource maps depend on git history and existing packet docs. | Derive paths from packet commits and split shared commits by path ownership. |
| Risk | Shared commits | Paths may be over-attributed across packets. | Split by packet folder, commit body, and domain-specific path ownership. |
| Risk | Metadata churn | Canonical save refreshes target metadata. | Treat `description.json` and `graph-metadata.json` updates as allowed indexing side effects. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Generation and indexing complete in one local pass.

### Security
- **NFR-S01**: No secrets or credentials are introduced.

### Reliability
- **NFR-R01**: Final evidence is reproducible from git history and validator output.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Shared Commits
- Shared commits are split by packet folder and domain-specific paths.

### Missing Paths
- Missing paths are marked `MISSING` instead of silently dropped.

### Phase Parent
- The `024-followup-quality-pass` parent map uses parent-aggregate mode while child maps remain per-child as requested.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 17 target folders plus finalization packet docs. |
| Risk | 10/25 | Documentation-only with canonical metadata refresh. |
| Research | 10/20 | Requires git-history path discovery. |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
