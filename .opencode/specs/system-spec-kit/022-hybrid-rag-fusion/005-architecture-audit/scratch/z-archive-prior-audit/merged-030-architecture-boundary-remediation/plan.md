---
title: "...id-rag-fusion/005-architecture-audit/scratch/z-archive-prior-audit/merged-030-architecture-boundary-remediation/plan]"
description: "Migrate unnecessary allowlist exceptions to api/ imports, move DB_UPDATED_FILE to shared/, and add automated enforcement via pre-commit hook or CI."
trigger_phrases:
  - "boundary remediation plan"
  - "api migration plan"
  - "enforcement automation plan"
importance_tier: "normal"
contextType: "implementation"
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
---
# Implementation Plan: Architecture Boundary Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) |
| **Framework** | MCP server, custom build scripts |
| **Storage** | SQLite (no schema changes) |
| **Testing** | Vitest, manual tsc --noEmit |

### Overview

This plan remediates two architecture boundary gaps found by a 5-agent Gemini audit. Phase 1 moves the `DB_UPDATED_FILE` constant to `shared/config` and migrates `memory-indexer.ts` imports to use `api/search`. Phase 2 audits `reindex-embeddings.ts` and expands `api/` if feasible. Phase 3 adds enforcement automation and updates documentation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (`npx tsc --noEmit`, `npm run check`)
- [ ] Docs updated (ARCHITECTURE_BOUNDARIES.md, allowlist)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered architecture with ownership zones (scripts / mcp_server / shared)

### Key Components
- **`shared/config.ts`**: Gains `DB_UPDATED_FILE` constant (currently in `mcp_server/core/config`)
- **`mcp_server/api/search.ts`**: Already exports vectorIndex; may expand with storage exports
- **`scripts/core/memory-indexer.ts`**: Primary migration target (2 forbidden imports)
- **`scripts/memory/reindex-embeddings.ts`**: Secondary audit target (wildcard exception)

### Data Flow
No data flow changes. Import paths change but runtime behavior is identical.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Constant Migration + Memory-Indexer Fix
- [ ] Add `DB_UPDATED_FILE` export to `shared/config.ts`
- [ ] Update `mcp_server/core/config.ts` to re-export from shared (backward compat)
- [ ] Update `scripts/core/memory-indexer.ts` to import vectorIndex from `@spec-kit/mcp-server/api/search`
- [ ] Update `scripts/core/memory-indexer.ts` to import `DB_UPDATED_FILE` from `@spec-kit/shared/config`
- [ ] Remove 2 allowlist entries (memory-indexer vector-index and core/config)
- [ ] Verify: `npx tsc --noEmit` and `npm run check`

### Phase 2: Reindex-Embeddings Audit + API Expansion
- [ ] Read `scripts/memory/reindex-embeddings.ts` and catalog all mcp_server/lib imports
- [ ] For each import, check if `api/` already exposes it
- [ ] Expand `api/` with new exports where feasible (checkpoints, access-tracker)
- [ ] Migrate reindex-embeddings imports to api/ where possible
- [ ] Narrow or retain wildcard allowlist entry based on remaining needs
- [ ] Verify: `npx tsc --noEmit` and `npm run check`

### Phase 3: Enforcement Automation + Documentation
- [ ] Add pre-commit hook or CI config running boundary checks
- [ ] Update `ARCHITECTURE_BOUNDARIES.md` current exceptions table
- [ ] Update allowlist `lastReviewedAt` dates for retained entries
- [ ] Final verification: all enforcement scripts pass
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Compilation | All TypeScript sources | `npx tsc --noEmit` |
| Boundary checks | Import policy compliance | `npm run check` (4 enforcement scripts) |
| Manual | Verify memory-indexer and reindex-embeddings still work | Run scripts directly |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `shared/config.ts` | Internal | Green | Must accept new export |
| `mcp_server/api/search.ts` | Internal | Green | Already exports vectorIndex |
| Existing enforcement scripts | Internal | Green | All 4 verified working |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: TypeScript compilation fails or runtime errors in memory-indexer/reindex scripts
- **Procedure**: `git revert` the commit; restore original import paths and allowlist entries
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Constant + Indexer) ──► Phase 2 (Reindex Audit) ──► Phase 3 (Automation + Docs)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phase 2, Phase 3 |
| Phase 2 | Phase 1 | Phase 3 |
| Phase 3 | Phase 1, Phase 2 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Constant + Indexer | Low | 30-60 min |
| Phase 2: Reindex Audit + API | Med | 1-2 hours |
| Phase 3: Automation + Docs | Low | 30-60 min |
| **Total** | | **2-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All existing tests pass before starting
- [ ] Current allowlist state documented
- [ ] No uncommitted changes in working tree

### Rollback Procedure
1. `git revert HEAD` (single commit per phase)
2. Verify `npx tsc --noEmit` passes
3. Verify `npm run check` passes with original allowlist

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (import path changes only)
<!-- /ANCHOR:enhanced-rollback -->

---
