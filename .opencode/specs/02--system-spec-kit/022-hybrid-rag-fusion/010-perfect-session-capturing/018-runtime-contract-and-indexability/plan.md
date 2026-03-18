---
title: "Implementation Plan: Runtime Contract And Indexability [template:level_1/plan.md]"
description: "Describe the shipped validation-rule metadata and explicit write/index policy without relying on audit prose alone."
trigger_phrases:
  - "implementation"
  - "plan"
  - "phase 018"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Runtime Contract And Indexability

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and Markdown |
| **Framework** | system-spec-kit session-capturing pipeline |
| **Storage** | Markdown docs plus metadata.json indexing status |
| **Testing** | Focused Vitest coverage for workflow/index policy |

### Overview
Phase `018` captures the shipped runtime contract behind validation and indexing. The plan is to document the rule metadata registry, the explicit write/index dispositions, and the fact that V10-only failures stay indexable while some rules intentionally remain write-only.
<!-- /ANCHOR:summary -->

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Runtime behavior already shipped.
- [x] Focused automated verification already exists.

### Definition of Done
- [x] The phase spec names the rule metadata and disposition model.
- [x] The implementation summary records the V10 and V2 policy outcomes.

---

## 3. ARCHITECTURE

### Pattern
Policy-driven validation and indexing contract.

### Key Components
- **Rule metadata registry**: defines write/index semantics per rule
- **Workflow disposition logic**: chooses `abort_write`, `write_skip_index`, or `write_and_index`

### Data Flow
Rendered memory -> validation rule metadata -> write/index disposition -> saved metadata status.

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Contract Capture
- [x] Document the validation rule metadata registry.
- [x] Document the explicit dispositions.

### Phase 2: Verification Capture
- [x] Record V10 write-and-index behavior.
- [x] Record write-only indexing policy for index-blocking rules.

### Phase 3: Documentation Sync
- [x] Link the feature catalog as the authoritative runtime contract surface.

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Rule metadata helpers | Vitest |
| Workflow E2E | Write/index disposition behavior | Vitest |
| Documentation | Runtime-contract wording | Parent/feature-catalog sync |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `validate-memory-quality.ts` metadata registry | Internal | Green | Phase would lose its contract anchor |
| `workflow.ts` disposition logic | Internal | Green | Phase would revert to prose-only documentation |

---

## 7. ROLLBACK PLAN

- **Trigger**: The runtime contract changes and phase `018` no longer matches it.
- **Procedure**: Update phase `018` and the feature catalog together, then rerun validation.
