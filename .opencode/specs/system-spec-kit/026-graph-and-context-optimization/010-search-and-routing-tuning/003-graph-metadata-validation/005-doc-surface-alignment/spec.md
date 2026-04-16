<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
---
title: "Feature Specification: Doc Surface Alignment: Graph Metadata Changes"
description: "Several operator-facing docs still described pre-019 graph-metadata behavior. This phase aligns the requested surfaces with the shipped parser contract so operators see the same status, key-file, entity, trigger, and backfill rules that runtime now enforces."
trigger_phrases:
  - "graph metadata spec"
  - "doc surface alignment"
  - "checklist aware status"
  - "active-only backfill"
  - "canonical continuity docs"
importance_tier: "important"
contextType: "implementation"
status: complete
level: 2
type: implementation
parent: 003-graph-metadata-validation
created: 2026-04-13
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Reshaped the packet spec to the active Level 2 template after the doc-alignment pass landed"
    next_safe_action: "Reuse this packet if another operator-facing graph-metadata surface drifts from runtime behavior"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:019-phase-005-doc-surface-alignment-spec"
      session_id: "019-phase-005-doc-surface-alignment-spec"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which requested surfaces still described pre-019 graph metadata behavior"
---
# Feature Specification: Doc Surface Alignment: Graph Metadata Changes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | complete |
| **Created** | 2026-04-13 |
| **Branch** | `005-doc-surface-alignment` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 019 graph-metadata parser shipped behavior changes that operator-facing docs did not describe yet. That left command docs, guidance docs, templates, and metadata validation references out of sync on checklist-aware status fallback, lowercased status values, key-file sanitization, entity deduplication, trigger caps, and the new `--active-only` backfill flag.

### Purpose

Make every requested surface describe the shipped graph-metadata contract so operator guidance matches runtime reality.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Scan every user-listed surface that references graph metadata or its operator workflow.
- Update only the files that still describe stale behavior.
- Create packet-local execution docs after the alignment work is complete.

### Out of Scope

- Runtime parser changes - already shipped in 019 and not part of this packet.
- Unlisted operator surfaces - they can be handled in follow-on work if drift is found later.
- Commit or push workflow - explicitly excluded by the user.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/memory/save.md` | Modify | Document refreshed graph-metadata save behavior |
| `.opencode/command/memory/manage.md` | Modify | Document inclusive backfill default and `--active-only` |
| `AGENTS.md`, `CLAUDE.md`, `.opencode/skill/system-spec-kit/SKILL.md` | Modify | Sync operator guidance with the new metadata contract |
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md` | Modify | Summarize parser derivation rules in one runtime reference |
| `.opencode/skill/system-spec-kit/templates/handover.md`, `.opencode/skill/system-spec-kit/templates/debug-delegation.md` | Modify | Normalize status examples to lowercase values |
| `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/27-canonical-continuity-save-substrate.md` | Modify | Add graph-metadata refresh behavior to the metadata feature |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/202-canonical-continuity-save-substrate.md` | Modify | Extend validation expectations to refreshed graph metadata |
| `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` | Modify | Add inline usage guidance for inclusive vs `--active-only` backfill |
| `.opencode/specs/.../005-doc-surface-alignment/*.md` | Create/Modify | Close the packet with Level 2 execution docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Status guidance must state that graph metadata falls back to `implementation-summary.md` presence plus checklist completion when explicit status is absent. | Updated operator docs explicitly describe checklist-aware fallback behavior. |
| REQ-002 | Status guidance must state that stored graph-metadata status values are lowercase. | Updated docs and templates use lowercase status examples. |
| REQ-003 | Save/backfill guidance must describe sanitized `key_files`, deduplicated `entities`, and the 12-item `trigger_phrases` cap. | The requested command, skill, feature, playbook, and runtime-reference docs mention those parser rules. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Backfill guidance must describe the inclusive default and the opt-in `--active-only` behavior. | Operators can find the flag semantics from command docs and the script surface. |
| REQ-005 | Packet-local `tasks.md`, `checklist.md`, and `implementation-summary.md` must exist after the edit pass. | The packet contains the requested closeout docs and they reflect the completed work. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every requested stale surface now describes the shipped graph-metadata parser contract.
- **SC-002**: Templates that expose status examples now use lowercase values.
- **SC-003**: Backfill guidance is clear about the inclusive default and `--active-only` opt-in.
- **SC-004**: The packet validates as a Level 2 spec folder after the doc pass and packet closeout docs are created.

### Acceptance Scenarios

- **Given** a packet with no explicit frontmatter status, **when** operators read the updated save/manage/skill guidance, **then** they are told that graph metadata falls back to `implementation-summary.md` presence plus checklist completion.
- **Given** an operator inspects a refreshed `graph-metadata.json` entry, **when** they cross-check the updated docs, **then** they see that stored status values are normalized to lowercase.
- **Given** a packet contains noisy command strings or title-shaped references, **when** operators read the updated parser/runtime guidance, **then** they see that `key_files` are sanitized and `entities` are deduplicated with canonical-path preference.
- **Given** an operator needs a corpus-wide graph-metadata refresh, **when** they read the updated backfill guidance, **then** they see the inclusive default and the opt-in `--active-only` behavior clearly documented.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Active Level 2 template contract | The packet fails strict validation if anchors, headers, or `_memory` blocks drift from the enforced template | Build the packet docs directly against the current Level 2 templates |
| Risk | Over-editing unrelated docs | Unnecessary churn makes the packet harder to review and breaks the requested tight scope | Scan every listed surface, but patch only files that actually describe changed behavior |
| Risk | Ambiguous architecture/config references | Updating docs that never described stale graph-metadata behavior creates noise instead of alignment | Read those surfaces, then leave them unchanged if they contain no stale contract text |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The doc-alignment pass should stay surgical and avoid unnecessary churn outside the requested surfaces.
- **NFR-P02**: Verification should use lightweight text scans and packet validation rather than broad repo-wide workflows.

### Security

- **NFR-S01**: Backfill guidance must not imply archived folders are skipped by default when runtime remains inclusive.
- **NFR-S02**: Operator docs must not weaken existing archive or scope expectations while describing the new metadata rules.

### Reliability

- **NFR-R01**: Packet docs must satisfy the active Level 2 template contract so strict validation passes.
- **NFR-R02**: The implementation summary must record which scanned surfaces were intentionally left unchanged.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- Empty trigger lists: docs should explain the cap and sanitization rules without inventing new defaults.
- Missing explicit status: guidance must reflect the fallback to implementation-summary presence and checklist completion.
- Archived packet trees: backfill docs must clearly distinguish inclusive default from opt-in active-only behavior.

### Error Scenarios

- Missing packet docs: the packet validator will fail if required Level 2 files are absent.
- Wrong template headers: strict validation will flag missing anchors or template-source markers immediately.
- Stale operator guidance: docs can drift even when runtime is correct, so the scan must cover all listed surfaces before patching.

### State Transitions

- Pre-implementation packet state: spec can start with only `spec.md`, but Level 2 closeout requires the remaining canonical docs.
- Post-alignment closeout: packet-local docs must be written after the edit set stabilizes so they reflect the actual shipped surfaces.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Multiple operator-facing surfaces across commands, skill docs, templates, and metadata docs |
| Risk | 12/25 | Runtime behavior is already shipped, but operator drift can mislead future packet work |
| Research | 10/20 | Required a targeted scan of each listed surface plus validator-driven packet repair |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The scope and the six required behavior updates were explicit in the request.
<!-- /ANCHOR:questions -->
