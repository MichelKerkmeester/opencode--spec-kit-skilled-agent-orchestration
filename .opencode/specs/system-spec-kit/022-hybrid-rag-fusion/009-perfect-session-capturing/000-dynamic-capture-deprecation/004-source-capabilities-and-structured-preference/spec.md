---
title: "...009-perfect-session-capturing/000-dynamic-capture-deprecation/004-source-capabilities-and-structured-preference/spec]"
description: "Replace source-name policy branches with typed source capabilities and prefer structured save paths when curated input exists."
trigger_phrases:
  - "source capabilities"
  - "structured preference"
  - "phase 019"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/004-source-capabilities-and-structured-preference"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
# Feature Specification: Source Capabilities And Structured Preference

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-18 |
| **Branch** | `004-source-capabilities-and-structured-preference` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | [003-multi-cli-parity](../003-multi-cli-parity/spec.md) |
| **Successor** | [005-live-proof-and-parity-hardening](../005-live-proof-and-parity-hardening/spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The session-capturing pipeline still expressed source-aware policy with a raw source-name exception. That made the contamination downgrade brittle and under-documented. At the same time, the CLI surface supported structured `--stdin` / `--json` input but did not describe those structured modes as the preferred save path when curated payloads already existed.

### Purpose

Make source-aware policy capability-driven and make structured input the explicit operator-facing preference over stateless fallback when the caller can provide real structured session data.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a shared source-capability registry.
- Update contamination filtering to use typed capabilities.
- Update CLI help text, the authoritative feature catalog, and the M-007 playbook.

### Out of Scope
- Capturing fresh live artifacts for every CLI and mode.
- Removing direct stateless fallback support.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts` | Create | Canonical source-capability registry |
| `.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts` | Modify | Use capabilities instead of a source-name special case |
| `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | Modify | Make structured modes the preferred documented path |
| `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md` | Modify | Publish the authoritative runtime contract |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` | Modify | Publish the updated M-007 scenario boundary |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Source-aware contamination policy must be capability-driven | The downgrade logic keys off source capabilities, not a raw source-name equality check |
| REQ-002 | Structured input must be the documented preferred path | CLI help text and operator docs prefer `--stdin` / `--json` when structured payloads exist |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Focused tests must cover the new capability behavior | Contamination tests prove downgraded and non-downgraded source behavior |
| REQ-004 | Direct positional fallback must remain supported | Existing direct-mode behavior still works after the capability refactor |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Capability metadata, not a single source string, determines the contamination downgrade.
- **SC-002**: The operator docs describe structured input as the preferred contract and stateless input as the fallback path.
- **SC-003**: Focused regression coverage passes after the refactor.

### Acceptance Scenarios

1. **Given** a source whose capabilities expect tool-title-with-path transcript noise, **when** contamination filtering runs, **then** the severity is downgraded according to the capability policy.
2. **Given** a caller already has curated structured session data, **when** they read the CLI help or operator docs, **then** `--stdin` and `--json` are presented as the preferred save path over stateless fallback.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Stable `DataSource` union | High | Reuse the existing union instead of inventing a parallel taxonomy |
| Risk | Over-generalizing source capabilities too early | Medium | Keep the first capability set small and tied to current runtime behavior |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should more source capabilities become policy inputs beyond `toolTitleWithPathExpected` as live parity evidence expands?
<!-- /ANCHOR:questions -->
