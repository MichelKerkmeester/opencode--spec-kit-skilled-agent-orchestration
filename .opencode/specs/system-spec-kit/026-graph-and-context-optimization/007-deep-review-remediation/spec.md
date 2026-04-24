---
title: "Feature Specification: Deep [system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/spec]"
description: "Deep review waves and post-review remediation. Consolidated active parent for 5 direct child phase packet(s)."
trigger_phrases:
  - "007-deep-review-remediation"
  - "deep review waves and post-review remediation"
  - "001-deep-review-and-remediation"
  - "002-cli-executor-remediation"
  - "003-deep-review-remediation"
  - "004-r03-post-remediation"
  - "005-006-campaign-findings-remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation"
    last_updated_at: "2026-04-21T13:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Renumbered nested phases"
    next_safe_action: "Use context-index.md for local phase navigation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:3f6e386d4a9c736ee0f6480581ec93366e76eb160274e6ba6f617ad2f3c336af"
      session_id: "026-phase-root-flatten-2026-04-21"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: Deep Review Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-21 |
| **Branch** | `026-graph-and-context-optimization` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../006-search-routing-advisor/spec.md |
| **Successor** | ../008-runtime-executor-hardening/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The first consolidation preserved old packets behind an extra archive layer, which made the active phase surface harder to browse. The remaining remediation backlog also drifted behind the current `009-hook-daemon-parity` truth, so the active `007` packet no longer signposted which parity items were still live versus already closed or reapplied.

### Purpose
Keep this theme as an active parent while making each original phase packet a direct child folder under the phase root and keeping the remediation backlog aligned with the current `009-hook-daemon-parity` state map.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Keep the active thematic parent at `007-deep-review-remediation/`.
- Place old phase packets directly under this root.
- Maintain `context-index.md` as the bridge from old phase identity to current child folder.
- Track the active `009-hook-daemon-parity` parity map in this root so follow-on remediation reflects current packet truth.

### Out of Scope
- Rewriting child-owned requirements or historical implementation narratives.
- Moving root `research/`, `review/`, or `scratch/` support folders.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Refresh the active backlog language so it reflects the current `009-hook-daemon-parity` parity map. |
| `context-index.md` | Modify | Bridge index for the direct child phases in this theme. |
| `007-deep-review-remediation/00N-*/` | Move | Original phase packet roots now live directly under this parent. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Status | Description |
|-------|--------|--------|-------------|
| 1 | `001-deep-review-and-remediation/` | In Progress | Historical remediation ledger. `009/001` still needs status reconciliation, while older `009/003` cleanup items are superseded by later 009 parity work. |
| 2 | `002-cli-executor-remediation/` | Complete | Phase 020 shipped R1-R11 with 116/116 scoped tests green; remaining follow-up is limited to deferred R12/Q4/admin closeout. |
| 3 | `003-deep-review-remediation/` | Implemented | Phase 025 remediations landed; remaining unchecked items are memory-save/commit/admin closeout rather than open scoped findings. |
| 4 | `004-r03-post-remediation/` | Phase-local complete, parent gates pending | Phase 026 closed T01-T12 with evidence; remaining work is verification/admin closeout sync. |
| 5 | `005-006-campaign-findings-remediation/` | Blocked | Feature Specification: 005-006 Campaign Findings Remediation. Historical-source follow-up or ADR deferral required for CF-108 closure. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve original child packet evidence. | Every mapped old phase exists as a direct child folder with root docs and metadata retained. |
| REQ-004 | Route blocked historical-packet fixes to an authorized owner. | The `005-006-campaign-findings-remediation` blocker for CF-108 is tracked as a write-authorized follow-up that can edit the historical source packets, or an ADR records intentional immutability with owner and rationale. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Expose a concise context bridge. | `context-index.md` lists child phase names, statuses, summaries, open/deferred items, and current paths. |
| REQ-003 | Keep root support folders discoverable. | Root `research/`, `review/`, and `scratch/` remain referenced as root-level support surfaces. |
| REQ-005 | Keep the parity backlog aligned to current `009` packet truth. | The active `007` packet points maintainers at the live `009` state map: `009/001` still needs follow-up, `009/003` stays closed, `009/006` remains in progress, and the Copilot wrapper/writer reapply work from `009/010` and `009/011` is no longer tracked as missing. |
<!-- /ANCHOR:requirements -->

---

### Acceptance Scenarios

**Given** this wrapper is opened, **when** a maintainer lists the folder, **then** the original original phases appear as direct child folders.

**Given** a maintainer needs an original phase packet, **when** they open `context-index.md`, **then** they can find the old status, summary, and current child path.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The active parent validates independently.
- **SC-002**: Mapped source packets are direct child folders.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Direct child folders may contain older validation debt | Medium | Validate the active parent separately and preserve child docs unchanged unless requested. |
| Dependency | Root packet phase map | High | Root docs own the active nine-phase map. |
| Dependency | `009-hook-daemon-parity` state map | High | Keep `007` backlog wording synchronized to the active `009` parent so parity cleanup follows current runtime truth instead of historical cleanup assumptions. |
| Dependency | Historical source-packet write authority for CF-108 | High | Route the blocked `005-006` remediation through a write-authorized follow-up, or ADR-defer the blocker if those source packets are intentionally immutable. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- If the historical source packets needed for CF-108 are intentionally immutable, which ADR will record the deferral owner and rationale?
- Should the remaining `009/006-claude-hook-findings-remediation` follow-up stay owned exclusively by the `009` parent, or should `001-deep-review-and-remediation` mirror that in its next backlog refresh?
<!-- /ANCHOR:questions -->
