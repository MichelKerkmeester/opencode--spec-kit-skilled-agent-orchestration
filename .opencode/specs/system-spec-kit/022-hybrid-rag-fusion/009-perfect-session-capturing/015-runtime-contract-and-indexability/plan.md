---
title: "Imp [system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/015-runtime-contract-and-indexability/plan]"
description: "Add explicit rule metadata, write/index dispositions, and focused proof for session-capturing indexability."
trigger_phrases:
  - "phase 015"
  - "runtime contract"
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
| **Language/Stack** | TypeScript, Markdown |
| **Framework** | system-spec-kit session-capturing scripts |
| **Storage** | Memory markdown + metadata.json |
| **Testing** | Vitest, `tsc --build` |

### Overview

Implement explicit validation-rule metadata and one shared disposition contract for session captures. The work should preserve upstream abort gates, let V10-only soft-fails index, and make write-only saves explicit when policy requires them.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Runtime seam identified in `validate-memory-quality.ts` and `workflow.ts`
- [x] Desired write/index contract defined in the parent roadmap

### Definition of Done
- [x] Rule metadata and disposition helpers shipped
- [x] Workflow E2E proves V10 indexing and write-only index policy
- [x] Scripts build passed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Policy metadata plus one workflow disposition decision.

### Key Components
- **Rule metadata registry**: owns severity and write/index behavior.
- **Workflow disposition helper**: decides whether a save aborts, writes without indexing, or writes and indexes.

### Data Flow

Rendered memory -> quality validation -> rule metadata lookup -> disposition -> write/index action -> metadata status persistence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Add rule metadata and helper exports.

### Phase 2: Implementation
- [x] Replace the raw indexing boolean with explicit disposition handling.

### Phase 3: Verification
- [x] Add focused tests and rerun the scripts build.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Rule metadata helpers | Vitest |
| Integration | Workflow write/index behavior | Vitest |
| Build | TypeScript compilation | `npm run build` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing quality validation rules (V1-V11) | Internal | Green | The new disposition layer depends on stable rule IDs. V11 was added post-phase but follows the same metadata contract |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Valid writes start aborting unexpectedly or index metadata becomes misleading.
- **Procedure**: Revert the disposition-layer changes and rerun focused workflow tests.
<!-- /ANCHOR:rollback -->
