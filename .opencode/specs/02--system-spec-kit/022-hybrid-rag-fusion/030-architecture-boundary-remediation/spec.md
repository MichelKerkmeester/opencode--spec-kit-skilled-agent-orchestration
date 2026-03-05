---
title: "Feature Specification: Architecture Boundary Remediation"
description: "The ARCHITECTURE_BOUNDARIES.md doc is accurate but the codebase has two compliance gaps: unnecessary allowlist exceptions bypass api/ for functionality already exposed, and enforcement scripts lack CI/CD automation."
trigger_phrases:
  - "architecture boundary"
  - "api boundary gaps"
  - "enforcement automation"
  - "import policy remediation"
importance_tier: "normal"
contextType: "implementation"
---
# Feature Specification: Architecture Boundary Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-03-04 |
| **Branch** | `main` |
| **Audit Source** | 5 Gemini 3.1 Pro Preview agents (2026-03-04) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A 5-agent architecture audit found the codebase aligned on 3 of 5 boundary areas but flagged two gaps. First, `scripts/` files bypass `mcp_server/api/` for functionality that `api/search.ts` already exports (vectorIndex, hybridSearch), making some allowlist exceptions unnecessary. Second, all 4 enforcement scripts exist and work correctly but run only when a developer manually executes `npm run check` with no CI pipeline or git hooks to enforce boundaries automatically.

### Purpose

Close the API boundary coverage gaps by migrating unnecessary direct imports to `api/`, expand `api/` to cover remaining legitimate needs, and add automated enforcement so boundary violations are caught before merge.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Migrate `scripts/core/memory-indexer.ts` vectorIndex import to use `mcp_server/api/search`
- Audit `scripts/memory/reindex-embeddings.ts` for imports already available via `api/`
- Expand `mcp_server/api/` to expose retry-manager, checkpoints, access-tracker
- Move `DB_UPDATED_FILE` constant from `mcp_server/core/config` to `shared/config`
- Remove or narrow unnecessary allowlist entries in `import-policy-allowlist.json`
- Add pre-commit hook or CI step running `npm run check` from `scripts/`

### Out of Scope

- Migrating benchmark/eval scripts (legitimate deep-access exceptions) - retain wildcard allowlist
- Rewriting `shared/paths.ts` string literal for DB path (not an import violation)
- Adding new enforcement scripts beyond the existing 4

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/core/memory-indexer.ts` | Modify | Replace `@spec-kit/mcp-server/lib/search/vector-index` with `api/search` import |
| `scripts/core/memory-indexer.ts` | Modify | Replace `@spec-kit/mcp-server/core/config` with `shared/config` import |
| `scripts/memory/reindex-embeddings.ts` | Modify | Replace imports already available via `api/` |
| `mcp_server/api/search.ts` | Modify | Expose checkpoints and access-tracker if needed |
| `shared/config.ts` | Modify | Add `DB_UPDATED_FILE` constant |
| `mcp_server/core/config.ts` | Modify | Re-export from `shared/config` for backward compat |
| `scripts/evals/import-policy-allowlist.json` | Modify | Remove resolved exceptions |
| `ARCHITECTURE_BOUNDARIES.md` | Modify | Update current exceptions table |
| `.husky/pre-commit` or CI config | Create | Add enforcement automation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Migrate memory-indexer vectorIndex import to api/ | `check-no-mcp-lib-imports.ts` passes without the allowlist entry |
| REQ-002 | Move DB_UPDATED_FILE to shared/config | memory-indexer imports from shared/, core/config re-exports for compat |
| REQ-003 | Remove resolved allowlist entries | import-policy-allowlist.json has fewer entries, all remaining are justified |
| REQ-004 | TypeScript compilation clean | `npx tsc --noEmit` passes with zero errors |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Audit reindex-embeddings.ts for reducible imports | Document which imports can move to api/ vs which need wildcard |
| REQ-006 | Expand api/ surface for checkpoints/access-tracker | New exports in api/search.ts or api/storage.ts |
| REQ-007 | Add enforcement automation | Pre-commit hook or CI step runs boundary checks |
| REQ-008 | Update ARCHITECTURE_BOUNDARIES.md exceptions table | Table reflects post-remediation state |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Allowlist reduced from 6 entries to 3 or fewer
- **SC-002**: All 4 enforcement scripts pass (`npm run check` exit 0)
- **SC-003**: Enforcement runs automatically on commit or PR
- **SC-004**: Zero new forbidden-direction imports introduced
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Moving constants to shared/ may break script dist builds | Med | Test `scripts/` build after shared/ changes |
| Risk | reindex-embeddings.ts may need deep internals not exposable via api/ | Med | Keep wildcard entry if legitimate |
| Dependency | shared/config.ts must be importable by both consumers | Low | Already proven pattern with existing shared/ modules |
| Risk | Pre-commit hook slows developer workflow | Low | Keep check fast (< 5s) or use CI-only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Enforcement check completes in < 5 seconds
- **NFR-P02**: No runtime performance change (import paths only)

### Security
- **NFR-S01**: No new attack surface (refactoring only)

### Reliability
- **NFR-R01**: All existing tests pass after migration
- **NFR-R02**: Backward compat maintained via re-exports where needed
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty allowlist: enforcement scripts should still pass (no exceptions = compliant)
- Wildcard vs specific-path: wildcard entries cover all lib/* imports for that file

### Error Scenarios
- Missing api/ export: script import fails at compile time (caught by tsc)
- Circular dependency: shared/ importing from mcp_server/ (caught by architecture checker)

### State Transitions
- Partial migration: some allowlist entries removed but new api/ exports not yet created (build fails, blocked)
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | ~8 files, import path changes + 1 constant move + CI config |
| Risk | 8/25 | Low risk refactoring, no behavior changes |
| Research | 5/20 | Audit complete (Gemini agents), remediation plan clear |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should enforcement use a pre-commit hook (husky) or CI-only (GitHub Actions)?
- Should `mcp_server/api/` get a new `storage.ts` module or extend `search.ts`?
- Can `reindex-embeddings.ts` be fully migrated to api/ or does it need the wildcard permanently?
<!-- /ANCHOR:questions -->

---
