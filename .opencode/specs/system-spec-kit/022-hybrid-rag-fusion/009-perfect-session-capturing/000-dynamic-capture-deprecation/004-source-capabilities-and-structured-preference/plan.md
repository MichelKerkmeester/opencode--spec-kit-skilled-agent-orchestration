---
title: "...009-perfect-session-capturing/000-dynamic-capture-deprecation/004-source-capabilities-and-structured-preference/plan]"
description: "Move source-aware behavior onto a typed capability registry and publish structured input as the preferred contract."
trigger_phrases:
  - "phase 019"
  - "source capabilities"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/004-source-capabilities-and-structured-preference"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: Source Capabilities And Structured Preference

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
| **Storage** | Script helpers plus operator docs |
| **Testing** | Vitest, `tsc --build` |

### Overview

Add a shared source-capability registry, route contamination policy through it, and update the CLI help text plus operator docs so structured input is the preferred session-capturing path whenever the caller already has curated data.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Existing source union identified in `input-normalizer.ts`
- [x] Capability-based behavior scoped narrowly enough to avoid policy creep

### Definition of Done
- [x] Capability registry shipped
- [x] Contamination tests updated
- [x] Feature catalog and playbook updated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Shared runtime capability registry plus docs alignment.

### Key Components
- **Source capability registry**: defines input mode, transcript expectations, and structured-save preference.
- **Contamination filter**: consumes capabilities instead of a source-name special case.
- **Operator docs**: publish one runtime contract across CLI help, the catalog, and M-007.

### Data Flow

Source ID -> capability lookup -> contamination severity policy -> CLI/help/playbook guidance.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Add `scripts/utils/source-capabilities.ts`.

### Phase 2: Implementation
- [x] Update contamination filtering and CLI help text.

### Phase 3: Verification
- [x] Update focused tests and operator docs.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Capability-driven contamination behavior | Vitest |
| Integration | CLI authority parity | Vitest |
| Build | TypeScript compilation | `npm run build` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing CLI input surface | Internal | Green | The docs must match the real CLI behavior |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A capability refactor changes behavior for non-targeted sources or misstates the operator contract.
- **Procedure**: Revert the capability registry and rerun focused contamination and CLI parity tests.
<!-- /ANCHOR:rollback -->
