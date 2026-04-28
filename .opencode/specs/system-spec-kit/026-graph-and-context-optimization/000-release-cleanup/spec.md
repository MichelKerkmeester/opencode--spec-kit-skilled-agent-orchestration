---
title: "Feature Specification: 000 Release Cleanup"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Keep this phase-parent packet validator-compliant as a lean manifest that preserves the original purpose, lists the child phases, and leaves detailed planning, execution, and ve..."
trigger_phrases:
  - "000-release-cleanup"
  - "000 release cleanup"
  - "001-memory-terminology"
  - "002-sk-code-opencode-alignment"
  - "003-dead-code-audit"
  - "004-dead-code-pruning"
importance_tier: "important"
contextType: "implementation"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
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

# Feature Specification: 000 Release Cleanup

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-04-27 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `026-graph-and-context-optimization` |
| **Predecessor** | `See child ordering above` |
| **Successor** | None |
| **Handoff Criteria** | Parent manifest, `description.json`, and `graph-metadata.json` stay aligned with the current child phase folders and pass tolerant phase-parent validation. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This parent packet coordinates the phased work under `000 Release Cleanup` so the child packets stay discoverable and the root purpose remains clear while implementation details live below the parent level. The current child surface includes 001-memory-terminology, 002-sk-code-opencode-alignment, 003-dead-code-audit, 004-dead-code-pruning.

### Purpose
Keep this phase-parent packet validator-compliant as a lean manifest that preserves the original purpose, lists the child phases, and leaves detailed planning, execution, and verification in the child folders.

> **Phase-parent note:** This `spec.md` is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, decisions, and implementation summaries live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Preserve the root purpose for `000-release-cleanup` without rewriting child-phase intent.
- Keep the parent packet discoverable as a lean manifest over the current child phase folders.
- Refresh parent discovery metadata and graph rollup so resume and validation surfaces point at the correct child packets.

### Out of Scope
- Editing any child packet content under `000-release-cleanup/[0-9][0-9][0-9]-*/`.
- Deleting or archiving legacy heavy parent docs that already exist beside the lean trio.
- Reconstructing missing historical detail beyond what is needed for the parent manifest.

### Files to Change
[Parent-level scope is limited to `spec.md`, `description.json`, and `graph-metadata.json`. Detailed execution, planning, and verification remain inside the child phase folders.]
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children. Status is derived from each child `graph-metadata.json` `derived.status` when present.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-memory-terminology/` | Memory→Behavioral Phrasing Audit | planned |
| 2 | `002-sk-code-opencode-alignment/` | Align `sk-code-opencode` standards, checklists, verifier guidance, and metadata with current system-spec-kit runtime behavior. | draft |
| 3 | `003-dead-code-audit/` | Dead-code & disconnected-code audit across `system-spec-kit` + `mcp_server/`. Inventory findings; deletions deferred to a downstream remediation packet. | complete |
| 4 | `004-dead-code-pruning/` | Apply 13 high-confidence dead-code deletes from 003-audit; cascade-orphan cleanup; verify by tsc + vitest. | complete |
| 5 | `005-review-remediation/` | Coordinated remediation for 026 release-readiness deep-review findings, including post-program cleanup. | in_progress |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map plus `graph-metadata.json` child rollup.
- Use `/spec_kit:resume system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/[NNN-phase]/` to resume a specific child phase.
- Run `validate.sh --recursive` on the parent when validating the integrated phase train.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-memory-terminology` | `002-sk-code-opencode-alignment` | `001-memory-terminology` remains discoverable and the standards-alignment successor is explicit in the parent manifest | Parent phase map and graph metadata child list both include `002-sk-code-opencode-alignment` |
| `002-sk-code-opencode-alignment` | `003-dead-code-audit` | `sk-code-opencode` standards alignment is planned before later cleanup packets rely on those standards | Parent phase map and graph metadata child list both include `003-dead-code-audit` |
| `003-dead-code-audit` | `004-dead-code-pruning` | `003-dead-code-audit` ships the audit report with 13 high-confidence deletes; pruning packet applies them | Parent phase map and graph metadata child list both include `004-dead-code-pruning` |
| `004-dead-code-pruning` | `005-review-remediation` | Release-readiness review remediation follows cleanup/pruning so source-packet findings can be closed against current topology | Parent phase map and graph metadata child list both include `005-review-remediation` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- No additional parent-level open questions are required here. Phase-specific unknowns live in the child folders.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec, plan, task, and verification docs.
- **Graph metadata**: See `graph-metadata.json` for the current child rollup and derived status.
