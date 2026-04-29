---
title: "Feature Specification: OpenCode Graph Plugin Phased Execution"
description: "Feature Specification: OpenCode Graph Plugin Phased Execution"
trigger_phrases:
  - "opencode graph plugin"
  - "packet 030"
  - "phased execution"
  - "compact code graph"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase manifest: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: OpenCode Graph Plugin Phased Execution

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-27 |
| **Branch** | `main` |
| **Parent Spec** | None |
| **Parent Packet** | `system-spec-kit/024-compact-code-graph` |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Parent spec stays lean, child manifest stays accurate, and strict parent validation introduces no new errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet `030-opencode-graph-plugin` started as research plus a packet scaffold, then converged into six completed runtime phases: shared payload/provenance contracts, OpenCode transport surfacing, graph-operations hardening, cross-runtime startup parity, bounded code-graph auto-reindex parity, and Copilot startup-hook wiring. The remaining packet responsibility is to keep those shipped surfaces documented truthfully without reopening broader memory-durability work.

### Purpose
Keep the completed runtime delivery intact as a clean, truthful Level 3 packet with decision records, verification checklists, and architecture-level recovery context so future sessions can recover the shipped behavior without rereading the research trail.

> **Phase-parent note:** This spec.md is the only required authored parent-level spec surface. Tolerated parent docs may still exist in this folder, but detailed planning, task breakdowns, checklists, decisions, and continuity remain owned by the child phase folders listed below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and problem statement for the parent packet
- The child phase manifest for every direct `NNN-*` folder
- Canonical parent metadata needed for validation and resume flows

### Out of Scope
- Rewriting child-phase implementation details
- Deleting tolerated parent-level heavy docs that may still exist
- Recording migration history inside the parent spec body

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `spec.md` | Modify/Create | parent | Lean phase-parent manifest preserving purpose and phase map |
| `description.json` | Modify | parent | Refresh packet metadata timestamp and memory history |
| `graph-metadata.json` | Modify | parent | Refresh child manifest and last-save metadata while preserving manual links |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This parent packet uses phased decomposition. Each direct child folder is independently resumable and remains the source of truth for detailed execution artifacts.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-shared-payload-provenance-layer/` | Shared Payload and Provenance Layer: Phase 1 turned a research recommendation into runtime code by introducing one shared payload/provenance contract across startup, recovery, and compaction. | complete |
| 2 | `002-opencode-transport-adapter/` | OpenCode Transport Adapter: Phase 2 turned the transport concept into a real shipped OpenCode plugin. | complete |
| 3 | `003-code-graph-operations-hardening/` | Code Graph Operations Hardening: Phase 3 added one reusable graph-operations hardening contract below the transport shell. | complete |
| 4 | `004-cross-runtime-startup-surfacing-parity/` | Cross-Runtime Startup Surfacing Parity: Phase 4 extended the shipped startup experience beyond OpenCode. | complete |
| 5 | `005-code-graph-auto-reindex-parity/` | Code Graph Auto-Reindex Parity: Phase 5 is the bounded follow-on under packet `030-opencode-graph-plugin` that is now implemented. | complete |
| 6 | `031-copilot-startup-hook-wiring/` | Copilot Startup Hook Wiring: Phase 031 is the bounded follow-on under packet `030-opencode-graph-plugin` that closes the last Copilot-specific startup parity gap exposed by live CLI testing. | complete |

### Phase Transition Rules

- Each child phase should validate independently before follow-on child work resumes.
- The parent spec should stay limited to root purpose, manifest, and validation-safe metadata.
- Tolerated heavy docs at the parent stay in place but do not replace the child packets as the detailed source of truth.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-shared-payload-provenance-layer | 002-opencode-transport-adapter | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 002-opencode-transport-adapter | 003-code-graph-operations-hardening | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 003-code-graph-operations-hardening | 004-cross-runtime-startup-surfacing-parity | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 004-cross-runtime-startup-surfacing-parity | 005-code-graph-auto-reindex-parity | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 005-code-graph-auto-reindex-parity | 031-copilot-startup-hook-wiring | Child phase docs remain independently resumable and validator-clean. | `validate.sh --strict --no-recursive` on the child packet |
| 031-copilot-startup-hook-wiring | None | Parent manifest remains current for the completed child set. | `validate.sh --strict --no-recursive` on the child packet |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None documented at the parent-manifest level.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See direct sub-folders matching `[0-9][0-9][0-9]-*/`
- **Graph Metadata**: See `graph-metadata.json` for child pointers and save metadata

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

<!-- TODO: backfill with real content; stub added by Tier 4 alignment -->
<!-- /ANCHOR:success-criteria -->
