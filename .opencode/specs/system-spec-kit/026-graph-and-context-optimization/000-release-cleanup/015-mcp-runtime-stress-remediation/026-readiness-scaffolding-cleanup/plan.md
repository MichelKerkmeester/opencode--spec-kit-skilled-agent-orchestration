---
title: "Implementation Plan: Readiness Scaffolding Cleanup"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Mechanical cleanup plan for removing vestigial embedding-readiness scaffolding after the lazy-loading migration. The work deletes stale readiness state, exports, callers, and tests without introducing replacement behavior."
trigger_phrases:
  - "026-readiness-scaffolding-cleanup"
  - "readiness scaffolding cleanup"
  - "embedding readiness deprecation"
  - "implementation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/026-readiness-scaffolding-cleanup"
    last_updated_at: "2026-04-29T09:45:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Authored Level 1 implementation plan"
    next_safe_action: "Remove readiness scaffolding and verify zero references"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/core/db-state.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
    completion_pct: 15
---
# Implementation Plan: Readiness Scaffolding Cleanup

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript / Node.js ESM |
| **Framework** | Vitest test suite; TypeScript compiler |
| **Storage** | better-sqlite3-backed memory index |
| **Testing** | `npx tsc --noEmit`, `npx tsc`, `npx vitest run` |

### Overview

Remove the vestigial embedding-readiness flag and helper functions that survived the earlier gate removal. Pre-flight grep found additional runtime and test references beyond the original packet list, so the cleanup includes those in scope to satisfy the zero-reference requirement.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`
- [x] Success criteria measurable via zero-reference grep, TypeScript, Vitest, and strict spec validation
- [x] Dependencies identified: packet `010` already removed the active memory-search gate

### Definition of Done
- [ ] Readiness symbols removed from non-dist TypeScript
- [ ] TypeScript checks pass
- [ ] Full Vitest suite passes or unrelated pre-existing failures are documented
- [ ] Packet docs updated with completion evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Mechanical dead-code removal in an existing modular MCP runtime.

### Key Components
- **Core state barrel**: Removes readiness state/functions and re-exports from `core/db-state.ts` and `core/index.ts`.
- **Runtime callers**: Removes startup wait/bootstrap calls from `context-server.ts`, `api/indexing.ts`, `shadow-evaluation-runtime.ts`, and health handling.
- **Handler barrels and tests**: Removes public handler aliases, mocks, export checks, and readiness-specific test cases.

### Data Flow

Embedding generation remains lazy and self-initializing on first use. Health and startup flows no longer consult a separate readiness flag.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Documentation and Discovery
- [x] Read `spec.md` and target runtime files
- [x] Run pre-flight grep
- [x] Add extra grep hits to cleanup scope

### Phase 2: Mechanical Removal
- [ ] Remove test mocks and readiness-specific assertions
- [ ] Remove runtime call sites and constants
- [ ] Remove handler/core exports and db-state definitions

### Phase 3: Verification
- [ ] Confirm zero non-dist TypeScript references
- [ ] Run TypeScript checks and full Vitest suite
- [ ] Run strict packet validator
- [ ] Write implementation summary and update continuity
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static reference check | Readiness symbol removal outside `dist/` | `grep -rn ... | grep -v "/dist/"` |
| Typecheck | MCP server TypeScript | `npx tsc --noEmit` |
| Build | Regenerated TypeScript output | `npx tsc` |
| Regression | Full MCP server test suite | `npx vitest run` |
| Documentation | Packet structure and metadata | `validate.sh <packet> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `010-vestigial-embedding-readiness-gate-removal` | Internal packet | Green | Cleanup assumes the active search gate is already gone |
| T016-T019 lazy-loading migration | Runtime behavior | Green | Embedding model self-initializes on first use |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: TypeScript, Vitest, or zero-reference verification fails in a way that cannot be reconciled mechanically.
- **Procedure**: Revert this packet's edits, restore readiness exports/callers/tests, then re-scope with the failing reference as evidence.
<!-- /ANCHOR:rollback -->
