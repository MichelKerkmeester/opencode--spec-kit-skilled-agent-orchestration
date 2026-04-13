---
title: "Implementation Plan: Skill Advisor Packaging"
description: "Plan for restoring packet template compliance, aligning the packet with the shipped skill-advisor layout, and clearing the targeted review findings."
trigger_phrases:
  - "003-skill-advisor-packaging"
  - "packaging plan"
  - "packet remediation plan"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/003-skill-advisor-packaging"
    last_updated_at: "2026-04-13T13:52:38Z"
    last_updated_by: "gpt-5.4"
    recent_action: "Remediation planned"
    next_safe_action: "Apply packet edits"
    key_files: ["plan.md", "tasks.md", "checklist.md", "graph-metadata.json"]
---
# Implementation Plan: Skill Advisor Packaging

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown packet docs plus JSON metadata |
| **Framework** | system-spec-kit Level 3 packet validation |
| **Storage** | Packet-local markdown and `graph-metadata.json` |
| **Testing** | Strict packet validation and live file inspection |

### Overview

This remediation pass does not change shipped runtime behavior. It updates the packet so the docs describe the live `skill-advisor` package shape, replaces loose metadata entries with concrete evidence files, adds the missing ADR for the `scripts/` subfolder move, and restores the template headers and anchors required by strict validation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The review findings file has been read.
- [x] The live `../../../../../skill/skill-advisor/` layout has been inspected.
- [x] The Level 3 templates for `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` have been read.

### Definition of Done

- [x] Strict packet validation exits `0` or `1`.
- [x] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` expose the required template headers and anchors.
- [x] `graph-metadata.json` lists concrete evidence files only.
- [x] `decision-record.md` includes ADR-003 for the `scripts/` subfolder reorganization.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Packet-first documentation remediation with evidence-backed metadata normalization.

### Key Components

- **Core packet docs**: `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` carry the template contract.
- **Decision history**: `decision-record.md` records the package-level structural choices.
- **Packet metadata**: `graph-metadata.json` anchors packet retrieval to real packaging evidence.

### Data Flow

Review findings identify the gaps. Live file reads confirm the shipped package layout. The packet docs and metadata are then rewritten to reflect that layout, and strict validation checks the result.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read `review/deep-review-findings.md`.
- [x] Read all existing packet docs plus `graph-metadata.json`.
- [x] Read the Level 3 templates and confirm the live `skill-advisor` file layout.

### Phase 2: Core Implementation

- [x] Rewrite the four core packet docs onto the required template headers and anchor structure.
- [x] Update packet content so it reflects the live `feature_catalog/`, `manual_testing_playbook/`, and `scripts/` layout.
- [x] Replace packet metadata placeholders with concrete evidence files.
- [x] Add ADR-003 to `decision-record.md`.

### Phase 3: Verification

- [x] Re-run strict packet validation.
- [x] Confirm packet markdown references resolve correctly.
- [x] Confirm checklist language distinguishes per-feature snippet rules from the root catalog format.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Template headers, anchors, level consistency, and packet integrity | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/003-skill-advisor-packaging --strict` |
| Evidence | Live package layout and concrete file existence | `view`, packet-local relative paths |
| Metadata | Packet graph metadata key-file accuracy | `view graph-metadata.json` and validator output |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `review/deep-review-findings.md` | Internal packet evidence | Green | The remediation scope becomes ambiguous |
| `../../../../../skill/skill-advisor/feature_catalog/feature_catalog.md` | External evidence file | Green | The packet cannot state the root catalog rule truthfully |
| `../../../../../skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md` | External evidence file | Green | The package-root layout cannot be described completely |
| `../../../../../skill/skill-advisor/scripts/skill_advisor.py` | External evidence file | Green | Task and metadata path references cannot be verified |
| `../../../../../skill/skill-advisor/scripts/skill_graph_compiler.py` | External evidence file | Green | The metadata evidence surface is incomplete |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A packet rewrite introduces new strict-validation failures or incorrect file references.
- **Procedure**: Revert the affected packet docs or metadata entries, restore the last known-good packet state, and rerun strict validation before proceeding.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Read findings/templates ──► Rewrite packet docs ──► Normalize metadata ──► Run strict validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Rewrite, metadata, validation |
| Rewrite | Setup | Metadata, validation |
| Metadata | Rewrite | Validation |
| Validation | Rewrite, Metadata | Completion |
<!-- /ANCHOR:phase-deps -->

---

### AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm edits stay inside this packet's markdown docs and packet JSON.
- Re-read the live `skill-advisor` evidence files before updating any path claim.
- Re-run strict validation after structural changes.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| TASK-SEQ | Read findings and templates before rewriting packet docs | Prevents template drift and stale assumptions |
| TASK-SCOPE | Edit packet docs and packet JSON only | Keeps remediation inside the requested scope |
| TASK-EVIDENCE | Use live on-disk files as the source of truth for layout claims | Keeps packet evidence accurate |
| TASK-VALIDATE | End the workflow with strict validation | The packet is not fixed until the validator agrees |

### Status Reporting Format

- Start state: failing strict validation and stale packet structure.
- Work state: doc rewrite, metadata normalization, and ADR update.
- End state: validator result plus the files changed in this packet.

### Blocked Task Protocol

1. Mark the related work BLOCKED if a path claim cannot be confirmed on disk.
2. Keep the matching task or checklist item open until the evidence exists.
3. Record any unresolved gap in `implementation-summary.md`.
