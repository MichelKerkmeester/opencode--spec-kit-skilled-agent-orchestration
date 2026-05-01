---
title: "Feature Specification: deferred-followups [template:level_3/spec.md]"
description: "Implements the ten Gate 7 deferred followups from 003-template-greenfield-impl."
trigger_phrases:
  - "deferred followups"
  - "gate 7"
  - "template validation orchestrator"
  - "template manifest versions"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/004-deferred-followups"
    last_updated_at: "2026-05-01T20:32:55Z"
    last_updated_by: "codex"
    recent_action: "Scoped deferred followups"
    next_safe_action: "Implement packet tasks"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-deferred-followups"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: deferred-followups

<!-- SPECKIT_LEVEL: 3 -->

## EXECUTIVE SUMMARY

This packet implements the ten P1/P2 items deferred from 003 Gate 7 because they required policy decisions, broader validation architecture work, or cross-script CLI contract changes. It keeps the 003 template contract intact while delivering performance, manifest, migration, save-lock, and lineage semantics in a sibling packet.

**Key Decisions**: single-process validation orchestrator, lenient session-lineage warnings, explicit exit-code taxonomy, manifest-owned template versions, indefinite legacy marker support

**Critical Dependencies**: manifest-backed Level contract, `validate.sh`, `create.sh`, `generate-context.js`, and the inline renderer

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1/P2 |
| **Status** | In Progress |
| **Created** | 2026-05-01 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 003 implementation packet left ten Gate 7 items deferred after the round-3 sweep. Those items include one P1 validation hot-path performance change and nine P2 followups touching CLI behavior, manifest schema, migration policy, snapshot coverage, save concurrency, and session-lineage semantics.

### Purpose
Deliver all ten deferred items with explicit ADRs for the policy choices and verification that the existing 003 packet, workflow-invariance tests, and fresh scaffolds remain green.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- DEFER-G7-01 through DEFER-G7-10 from `003-template-greenfield-impl/checklist.md`.
- Five ADRs for validation, lineage, exit-code, version, and migration policy.
- Runtime, script, manifest, docs, and test updates needed for those items.

### Out of Scope
- Any item not listed in the ten deferred Gate 7 rows.
- Broad refactors outside the spec-kit template, validation, scaffold, and memory-save surfaces.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/templates/manifest/spec-kit-docs.json` | Modify | Add template versions and per-document section gate profiles |
| `.opencode/skill/system-spec-kit/mcp_server/lib/validation/orchestrator.ts` | Create | Add single-process validation orchestration |
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Modify | Route validation through the orchestrator and apply exit-code taxonomy |
| `.opencode/skill/system-spec-kit/scripts/templates/inline-gate-renderer.ts` | Modify | Add batch `--out-dir` mode |
| `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | Modify | Add canonical save advisory lock |
| `.opencode/skill/system-spec-kit/templates/manifest/EXTENSION_GUIDE.md` | Create | Document new document-type extension workflow |
| `.opencode/skill/system-spec-kit/templates/manifest/MIGRATION.md` | Create | Document legacy marker and broad-doc-list migration policy |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Implement validation hot-path batching with a single Node orchestrator | Fresh Level 3 strict validation completes under 2000ms and passes |
| REQ-002 | Preserve backward compatibility for `parent_session_id` checks | Missing non-null parents emit `SESSION_LINEAGE_BROKEN` as a warning; `null` is skipped |
| REQ-003 | Apply exit-code taxonomy | Bad create flags return 1, validation failures return 2, missing validation folders return 3 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Add batch inline renderer mode | `inline-gate-renderer --level 3 --out-dir DIR file...` renders all outputs |
| REQ-005 | Add canonical save lock | `generate-context.js` guards description and graph metadata writes with stale-lock cleanup |
| REQ-006 | Expand snapshot suite | Rendered output snapshots cover every level and required document |
| REQ-007 | Add manifest-owned template versions | Resolver exposes `templateVersions` and staleness reads the manifest map |
| REQ-008 | Complete per-document section gates | Manifest includes document-specific anchor profiles for active templates |
| REQ-009 | Document extension and migration policy | `EXTENSION_GUIDE.md` and `MIGRATION.md` exist with current policy |
| REQ-010 | Keep 003 and fresh scaffolds validating | Gates A-D pass after implementation |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All ten deferred items are implemented or explicitly marked won't-fix with rationale.
- **SC-002**: 003 packet and 004 packet validate cleanly in strict mode.
- **SC-003**: Workflow-invariance, resolver, renderer, and snapshot tests pass.
- **SC-004**: Fresh Level 1, 2, 3, 3+, and phase-parent scaffolds validate.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Manifest-backed Level contract | Resolver changes can break scaffold and validation | Preserve serialized compatibility and run resolver tests |
| Risk | Warning exit-code changes break callers | Medium | Reserve exit 1 for user errors and document taxonomy |
| Risk | Legacy packets lack parent session metadata | Medium | Warn instead of fail |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Fresh Level 3 strict validation target is under 2000ms after the orchestrator.

### Security
- **NFR-S01**: CLI path inputs remain constrained to existing spec-kit safety checks.

### Reliability
- **NFR-R01**: Validation, scaffold, and save paths fail closed on missing manifests or file-system errors.

---

## 8. EDGE CASES

### Data Boundaries
- `parent_session_id: null`: skipped without warning.
- Missing non-null `parent_session_id`: warning only for backward compatibility.

### Error Scenarios
- Active canonical save lock: save fails unless the lock is stale.
- Stale canonical save lock older than 30 seconds: lock is removed with a warning.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 21/25 | Multiple scripts, TS modules, manifest, docs, and tests |
| Risk | 18/25 | CLI behavior and validation semantics are caller-visible |
| Research | 12/20 | Requires reading 003 deferred list and current contracts |
| Multi-Agent | 0/15 | Single-agent packet |
| Coordination | 8/15 | Parent phase metadata and prior 003 validation must stay aligned |
| **Total** | **59/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Existing callers rely on warning exit 1 | M | M | Document taxonomy and keep validation failures on 2 |
| R-002 | Legacy packets lack parent session metadata | M | H | Warn instead of fail |
| R-003 | Manifest schema expansion breaks old callers | H | M | Preserve flat `sectionGates` serialization and add `sectionGatesByDocument` |

---

## 11. USER STORIES

### US-001: Fast Validation (Priority: P1)

**As a** spec-kit maintainer, **I want** validation to load rule metadata once, **so that** fresh scaffolds validate quickly enough for normal use.

**Acceptance Criteria**:
1. Given a fresh Level 3 scaffold, When strict validation runs, Then it completes under 2000ms and passes.

---

### US-002: Compatible Policy Followups (Priority: P2)

**As a** packet author, **I want** the deferred policy choices documented and enforced, **so that** future template changes have a clear contract.

**Acceptance Criteria**:
1. Given the manifest and docs, When a new document type is added, Then maintainers can follow the extension guide and version workflow.

---

## 12. OPEN QUESTIONS

- None. The user supplied the packet path, scope, and policy decisions.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
