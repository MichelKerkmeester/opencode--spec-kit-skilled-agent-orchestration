---
title: "...6-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/003-skill-advisor-packaging/spec]"
description: "Repair the packaging packet so it matches the shipped skill-advisor layout, uses concrete evidence paths, and passes strict Level 3 validation."
trigger_phrases:
  - "003-skill-advisor-packaging"
  - "skill advisor packaging"
  - "skill advisor packet repair"
  - "skill-advisor scripts subfolder"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/003-skill-advisor-packaging"
    last_updated_at: "2026-04-21T14:15:00Z"
    last_updated_by: "codex-phase-consolidation"
    recent_action: "Review findings triaged"
    next_safe_action: "Use the validated packaging docs as historical implementation evidence"
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md", "graph-metadata.json"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
---
# Feature Specification: Skill Advisor Packaging

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The shipped `skill-advisor` package now uses a clean root layout with `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/README.md`, the package setup guide, `feature_catalog/`, `manual_testing_playbook/`, `scripts/`, and `graph-metadata.json` under `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/`. This remediation pass updates the packet so it describes that live layout accurately, replaces loose metadata placeholders with concrete file evidence, and restores the Level 3 headers and anchors required by strict validation.

**Key Decisions**: Keep the packet on the Level 3 scaffold, record the `scripts/` subfolder reorganization as a formal ADR, and use concrete file paths instead of directory or glob placeholders.

**Critical Dependencies**: `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/feature_catalog.md`, `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md`, `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`, `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py`

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Review |
| **Created** | 2026-04-13 |
| **Branch** | `026-graph-and-context-optimization` |
| **Parent Spec** | `../spec.md` |
| **Related Packet** | `../002-manual-testing-playbook/spec.md` |
| **Review Source** | `../../../review/011-skill-advisor-graph-pt-04/deep-review-findings.md` (historical pre-remediation snapshot; not the current validation state) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

This packet still described an earlier packaging shape, used invalid packet-relative markdown references, and stored incomplete metadata for downstream tooling. The live package now places runtime scripts in `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/scripts/`, while `feature_catalog/` and `manual_testing_playbook/` live alongside that subfolder at the package root, but the packet did not describe that layout consistently enough for strict validation.

### Purpose

Update the packet so it matches the shipped `skill-advisor` package, resolves the six requested review findings, and becomes machine-valid again.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` onto the active Level 3 scaffold.
- Record the live package layout where `feature_catalog/`, `manual_testing_playbook/`, and `scripts/` sit under `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/`.
- Replace packet `graph-metadata.json` key-file placeholders with concrete evidence files.
- Add ADR-003 for the `scripts/` subfolder reorganization.
- Repair packet-local markdown references so strict integrity checks resolve cleanly.

### Out of Scope

- Editing runtime Python code or changing shipped skill-advisor behavior.
- Renaming the shipped root catalog file or manual playbook file.
- Rewriting the deep-review findings document itself.
- Touching sibling packet content outside references already required by this packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Restore template headers and describe the live package layout |
| `plan.md` | Modify | Document the remediation phases and validation gate |
| `tasks.md` | Modify | Replace stale task text with the actual remediation work and current paths |
| `checklist.md` | Modify | Convert custom checks to template sections and correct the root-catalog rule |
| `decision-record.md` | Modify | Add anchors and ADR-003 for the `scripts/` subfolder reorganization |
| `graph-metadata.json` | Modify | Replace placeholder key files with concrete evidence paths |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Strict packet validation must stop failing | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/003-skill-advisor-packaging --strict` exits `0` or `1`, never `2` |
| REQ-002 | The four core packet docs must expose the required Level 3 template headers and anchors | `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` contain the validator-required section headers and ANCHOR pairs |
| REQ-003 | The packet must describe the shipped package layout accurately | The packet states that runtime scripts live in `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/scripts/` and that `feature_catalog/` plus `manual_testing_playbook/` live alongside it in `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/` |
| REQ-004 | Packet graph metadata must use concrete file evidence | `graph-metadata.json` lists real files such as `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/feature_catalog.md`, `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md`, `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`, and `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py` |
| REQ-005 | The scripts-subfolder reorganization must be captured as a formal decision | `decision-record.md` includes ADR-003 with context, rationale, alternatives, consequences, and implementation notes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Packet task descriptions must use the live `skill-advisor/scripts/` paths where runtime files are referenced | `tasks.md` references `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/scripts/...` for runtime script evidence |
| REQ-007 | The checklist must distinguish per-feature snippet rules from the root catalog format | `checklist.md` states that the 18 per-feature catalog files follow the 4-section snippet template, while the root feature catalog uses its own multi-section format |
| REQ-008 | Packet markdown references must resolve to real files | Any `.md` file reference in packet docs points to a valid local or relative repo path |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC-001: Strict validation for this packet exits with warnings at worst.
- SC-002: The packet records the live layout accurately: `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/` contains `feature_catalog/`, `manual_testing_playbook/`, `scripts/`, `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/README.md`, the package setup guide, and `graph-metadata.json`.
- SC-003: `graph-metadata.json` lists concrete packaging evidence files instead of directory or glob placeholders.
- SC-004: `tasks.md`, `checklist.md`, and `decision-record.md` reflect the `scripts/` subfolder reorganization and the root-catalog exception correctly.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/feature_catalog.md` must remain the shipped root catalog path | If the live file name changes again, packet metadata and checklist evidence drift immediately | Read the live folder before editing the packet and record the concrete file that exists now |
| Dependency | `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md` and runtime scripts must remain present | Missing evidence files would make the packet description inaccurate | Use only concrete files confirmed on disk |
| Risk | Restoring template headers could remove packet intent if the rewrite is too generic | The packet would validate but stop being useful | Keep the packaging-specific details inside the template sections |
| Risk | A packet-relative markdown path could still be invalid | Validation would continue to fail under `SPEC_DOC_INTEGRITY` | Use local packet files or repository-relative paths only |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability

- NFR-M01: The packet must follow the active Level 3 scaffold so future review passes can target stable anchors.
- NFR-M02: File evidence must use concrete paths that remain readable in plain text and machine tooling.

### Reliability

- NFR-R01: Completion claims in this packet must be reproducible through live file reads plus strict validation.

### Traceability

- NFR-T01: The packet metadata must point at the packaging surfaces that were actually reviewed.

---

## 8. EDGE CASES

- If the root feature catalog keeps a different file name than the template convention, the packet must still reference the file that exists on disk.
- If `scripts/` contains more runtime helpers later, the packet should still point at the primary evidence files instead of falling back to directory placeholders.
- If future packet edits mention external markdown files, they must use valid relative paths from this packet folder.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Six packet artifacts and one metadata file |
| Risk | 18/25 | Validation, metadata, and path accuracy all gate completion |
| Research | 8/20 | Current package layout must be verified before doc changes |
| Multi-Agent | 4/15 | Single-writer packet remediation |
| Coordination | 10/15 | Packet docs must align with shipped skill-advisor assets |
| **Total** | **54/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A stale markdown reference remains in packet docs | High | Medium | Replace all `.md` references with valid relative paths or local packet files |
| R-002 | Packet metadata points at directories instead of real files | High | Medium | Enumerate concrete evidence files from the shipped `skill-advisor` package |
| R-003 | Decision history omits the `scripts/` subfolder move | Medium | Medium | Add ADR-003 with explicit rationale and consequences |

---

## 11. USER STORIES

### US-001: Reviewer Gets a Valid Packet

As a packet reviewer, I want the packet to pass strict validation, so I can trust it as a current source of truth.

### US-002: Maintainer Sees the Real Package Layout

As a maintainer, I want the packet to describe the live `skill-advisor` root and `scripts/` subfolder correctly, so I do not follow stale paths.

### US-003: Retrieval Tool Gets Concrete Evidence Files

As a downstream retrieval tool, I want packet metadata to point at real files, so indexing and resume flows can surface the right evidence.

### Acceptance Scenarios

1. **Given** the packet previously failed strict validation, **when** the Level 3 headers and anchors are restored, **then** the validator stops returning exit code `2`.
2. **Given** the package root contains `feature_catalog/`, `manual_testing_playbook/`, and `scripts/`, **when** the packet is read, **then** it describes that live layout directly.
3. **Given** `graph-metadata.json` previously used placeholder entries, **when** metadata is rewritten, **then** it points at concrete packaging evidence files.
4. **Given** the `scripts/` subfolder move was not yet documented as an ADR, **when** `decision-record.md` is read, **then** ADR-003 explains that reorganization and its rationale.
5. **Given** runtime evidence appears in packet tasks, **when** `tasks.md` is read, **then** those references point at `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/scripts/...` instead of stale package-root paths.
6. **Given** the root catalog does not follow the snippet section count, **when** `checklist.md` is read, **then** it treats only the 18 per-feature files as 4-section snippets and treats the root catalog as a multi-section exception.

### AI Execution Protocol

### Pre-Task Checklist

- Confirm edits stay inside this packet's markdown docs and packet JSON.
- Treat `../../../../../../skill/system-spec-kit/mcp_server/skill-advisor/` files as evidence sources, not edit targets.
- Re-run strict validation after any structural rewrite.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-SCOPE-003 | Edit only packet markdown or packet JSON under `003-skill-advisor-packaging/` | Prevents unrelated repo churn |
| AI-VALIDATE-003 | Validate after each major packet rewrite | Keeps template drift from stacking up |
| AI-EVIDENCE-003 | Record layout and metadata claims from current on-disk files only | Prevents stale or invented packet evidence |
| AI-ADR-003 | Keep the `scripts/` subfolder decision explicit in the packet | Prevents the reorganization from becoming undocumented state |

### Status Reporting Format

- Start state: validator failures and review findings.
- Work state: packet doc rewrite, metadata normalization, and ADR update.
- End state: strict validation result and the changed packet files.

### Blocked Task Protocol

1. Stop if a packet claim depends on a file that was not re-read.
2. Leave the related task or checklist item open until that evidence is confirmed.
3. Record any unresolved gap in `implementation-summary.md` instead of guessing.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None at this time. The live package layout and the required packet fixes are known.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Review Findings**: `../../../review/011-skill-advisor-graph-pt-04/deep-review-findings.md`
