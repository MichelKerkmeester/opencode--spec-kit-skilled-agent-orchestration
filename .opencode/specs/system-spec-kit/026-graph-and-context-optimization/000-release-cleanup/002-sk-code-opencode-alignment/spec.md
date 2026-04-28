---
title: "Feature Specification: sk-code-opencode Alignment"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Plan a focused alignment pass for sk-code-opencode so its standards, verifier contract, and resource guidance match the current system-spec-kit runtime and release-cleanup state."
trigger_phrases:
  - "002-sk-code-opencode-alignment"
  - "sk-code-opencode alignment"
  - "opencode standards cleanup"
  - "verify alignment drift docs"
  - "nodenext opencode standards"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/002-sk-code-opencode-alignment"
    last_updated_at: "2026-04-28T11:20:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented alignment updates"
    next_safe_action: "Review final diff or commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "resource-map.md"
    session_dedup:
      fingerprint: "sha256:sk-code-opencode-alignment-plan-2026-04-28"
      session_id: "002-sk-code-opencode-alignment-plan-2026-04-28"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use system-spec-kit for packet workflow and sk-code-opencode for OpenCode standards evidence."
      - "Verifier behavior was not expanded; docs and checklists were narrowed to current marker-level automatic checks plus manual checklist gates."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-code-opencode Alignment

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-04-28 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `000-release-cleanup` |
| **Predecessor** | `../001-memory-terminology/` |
| **Successor** | `../003-dead-code-audit/` |
| **Handoff Criteria** | `sk-code-opencode` standards docs, checklists, verifier guidance, and metadata are internally aligned with current OpenCode system-code behavior and validation commands. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-code-opencode` is the standards overlay used when editing OpenCode system code, but parts of its guidance now lag the current system-spec-kit runtime. The current MCP server is a NodeNext ESM TypeScript package, while parts of the skill still frame CommonJS as the TypeScript baseline. The skill also presents several P0 gates more broadly than the current alignment verifier actually enforces.

### Purpose

Plan a focused release-cleanup pass that aligns `sk-code-opencode` guidance, checklists, verifier documentation, and metadata with the real system-spec-kit codebase before later cleanup packets rely on those standards.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Audit and align `sk-code-opencode` standards documentation across the primary skill instructions, README, shared references, language references, and checklists.
- Reconcile TypeScript module guidance with current NodeNext ESM package behavior while preserving legacy CommonJS guidance where it still applies.
- Reconcile JavaScript/plugin guidance so OpenCode plugin ESM and CommonJS utility surfaces are path-aware rather than contradictory.
- Clarify the alignment verifier contract: what the script enforces automatically, what remains a manual checklist gate, and when strict mode is required.
- Refresh stale evidence citations and metadata for the skill after edits.
- Keep `/spec_kit:plan` ownership with `system-spec-kit`; this packet may cite command-plan drift only where it affects standards alignment.

### Out of Scope

- Rewriting the full skill routing system into executable code.
- Changing behavior in `system-spec-kit` runtime code unless a verifier-doc mismatch cannot be fixed honestly without a narrow script/test update.
- Changing deep-research or deep-review command ownership.
- Broad refactors across sibling skills such as `sk-code-web`, `sk-code-full-stack`, or `sk-code-review`.
- Completing dead-code pruning or feature-catalog work; those are separate sibling phases.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-code-opencode` primary instructions | Modify | Align routing, quality gates, verifier claims, and related-resource guidance. |
| `.opencode/skill/sk-code-opencode/README.md` | Modify | Sync user-facing overview, quick start, and troubleshooting with the aligned standards. |
| `.opencode/skill/sk-code-opencode/references/shared/*.md` | Modify | Refresh universal/code-organization/hooks/alignment verifier references where stale or contradictory. |
| `.opencode/skill/sk-code-opencode/references/{javascript,typescript,python,shell,config}/*.md` | Modify | Targeted updates where evidence or standards drift is found. |
| `.opencode/skill/sk-code-opencode/assets/checklists/*.md` | Modify | Match checklist gates to current verifier behavior and language-specific standards. |
| `.opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py` | Optional Modify | Only if the chosen fix expands verifier behavior instead of narrowing documentation claims. |
| `.opencode/skill/sk-code-opencode/scripts/test_verify_alignment_drift.py` | Optional Modify | Required only if verifier behavior changes. |
| `.opencode/skill/sk-code-opencode/graph-metadata.json` | Refresh | Update derived metadata after standards changes. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/002-sk-code-opencode-alignment/*` | Create/Modify | Packet docs and resource map. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/spec.md` | Modify | Parent phase map should name this child accurately. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/resource-map.md` | Modify | Parent aggregate map should include this child. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/graph-metadata.json` | Modify | Parent child IDs and trigger phrases should name this child. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | TypeScript module guidance MUST distinguish current NodeNext ESM packages from legacy CommonJS surfaces. | References no longer present CommonJS as the universal TypeScript baseline; current MCP package settings are cited or summarized correctly. |
| REQ-002 | Alignment verifier claims MUST match actual script behavior. | Docs clearly separate automatic verifier checks from manual checklist gates, or the verifier/tests are updated to enforce the claimed gates. |
| REQ-003 | Header standards MUST be internally consistent per language. | Primary skill instructions, language style guides, quick references, and checklists agree on accepted header shapes. |
| REQ-004 | OpenCode plugin ESM exemptions MUST be preserved. | JavaScript guidance and checklist language do not require `module.exports` for plugin ESM/plugin-helper surfaces. |
| REQ-005 | Parent release-cleanup metadata MUST point at `002-sk-code-opencode-alignment`, not `002-feature-catalog`. | Parent `spec.md`, `resource-map.md`, and `graph-metadata.json` list the actual child folder. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Stale evidence citations SHOULD be refreshed or downgraded. | Missing or wrong-path evidence examples are corrected, replaced, or labeled as historical. |
| REQ-007 | Checklists SHOULD match standards references. | Checklist P0/P1 items no longer contradict language references or verifier behavior. |
| REQ-008 | Skill metadata SHOULD be regenerated after updates. | `graph-metadata.json` and discovery metadata reflect the aligned skill surface and current key files. |
| REQ-009 | Verification commands SHOULD be scoped and reproducible. | Plan and checklist name the exact verifier and test commands expected before completion. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A contributor can read `sk-code-opencode` and correctly choose between NodeNext ESM TypeScript, legacy CommonJS JavaScript, and OpenCode plugin ESM guidance.
- **SC-002**: The alignment verifier documentation accurately states which findings are automatic `ERROR`, automatic `WARN`, and manual review gates.
- **SC-003**: JavaScript, TypeScript, Python, shell, and config checklists agree with their reference docs.
- **SC-004**: `verify_alignment_drift.py --root <changed-scope-root>` runs cleanly for the changed skill scope, with script tests passing if verifier code changes.
- **SC-005**: The `000-release-cleanup` parent can resume into this child without stale `002-feature-catalog` references.
<!-- /ANCHOR:success-criteria -->

---

### Acceptance Scenarios

**Given** a contributor is editing current system-spec-kit TypeScript, **when** they read the aligned standards, **then** they can identify NodeNext ESM as the current MCP server package pattern.

**Given** a contributor is editing legacy CommonJS JavaScript, **when** they read the aligned standards, **then** they can still find the CommonJS rules without applying them to plugin ESM files.

**Given** a contributor runs the alignment verifier, **when** they compare output to the docs, **then** automatic errors, warnings, and manual gates are described accurately.

**Given** the release-cleanup parent is resumed, **when** the phase map is inspected, **then** phase 2 points at `002-sk-code-opencode-alignment`.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Expanding verifier behavior could create broad style churn. | Medium | Prefer narrowing docs unless a missing automatic check is small, deterministic, and covered by tests. |
| Risk | CommonJS guidance may still be valid for some OpenCode utilities. | Medium | Model module rules by path/package boundary, not a single global rule. |
| Risk | Header examples use multiple visual styles today. | Medium | Pick the smallest accepted set and make docs/checklists/verifier language consistent. |
| Risk | Parent metadata edits can disturb sibling phase history. | Low | Only replace stale `002-feature-catalog` pointers and append this child to the aggregate map. |
| Dependency | `verify_alignment_drift.py` and its tests. | Medium | Use current script behavior as evidence before changing claims. |
| Dependency | Current system-spec-kit MCP server package config. | Medium | Read package and tsconfig values before changing TypeScript standards. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability

- **NFR-M01**: Standards should be path-aware where module systems differ.
- **NFR-M02**: Verifier docs should state limits plainly so future agents do not assume broader automation than exists.

### Reliability

- **NFR-R01**: Verification commands must be idempotent on the aligned skill scope.
- **NFR-R02**: Metadata refreshes must preserve parent-child packet identity.

### Scope Control

- **NFR-S01**: No sibling skill edits unless a direct contradiction must be fixed for this packet's acceptance.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Module Boundaries

- NodeNext ESM TypeScript package: document as current MCP server pattern.
- Legacy CommonJS JavaScript utility: keep CommonJS guidance where the package/file actually uses it.
- OpenCode plugin/helper ESM: preserve default-export/plugin API exemptions.

### Verifier Boundaries

- Script checks code/config extensions only; docs must not imply markdown checklists are automatically scanned unless the script is expanded.
- WARN findings are advisory by default; strict mode makes them blocking only when explicitly requested.

### Metadata Boundaries

- Parent phase maps should use the actual folder slug on disk.
- Resource maps should list paths and actions only, leaving decisions and evidence to plan/checklist/summary docs.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | One skill plus parent packet metadata. |
| Risk | 10/25 | Standards drift can mislead future edits; runtime behavior changes are optional and discouraged. |
| Research | 12/20 | Requires comparing docs, checklists, verifier script, tests, and current MCP package config. |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Verifier scope decision: docs and checklists were narrowed to current verifier behavior instead of expanding the script.
- Plugin ESM guidance decision: kept in JavaScript references/checklist and summarized in the primary skill/README.
<!-- /ANCHOR:questions -->
