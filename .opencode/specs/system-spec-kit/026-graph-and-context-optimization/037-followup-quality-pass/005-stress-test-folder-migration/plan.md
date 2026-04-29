---
title: "Implementation Plan: 037/005 Stress Test Folder Migration"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Move confirmed MCP server stress-test suites into mcp_server/stress_test, add opt-in Vitest/package wiring, and refresh direct path references."
trigger_phrases:
  - "037-005-stress-test-folder-migration"
  - "stress test folder"
  - "dedicated stress folder"
  - "mcp_server/stress_test"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/005-stress-test-folder-migration"
    last_updated_at: "2026-04-29T18:09:55+02:00"
    last_updated_by: "cli-codex"
    recent_action: "stress-test folder migration implemented; default npm test blocked by existing suite failures"
    next_safe_action: "Investigate broad npm test failures outside the moved stress suites"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/stress_test/README"
      - ".opencode/skill/system-spec-kit/mcp_server/vitest.config.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/package.json"
      - "migration-plan.md"
    session_dedup:
      fingerprint: "sha256:037005stresstestfoldermigrationplan000000000000000000000"
      session_id: "037-005-stress-test-folder-migration"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 037/005 Stress Test Folder Migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Vitest, Markdown, JSON |
| **Framework** | MCP server package under `system-spec-kit` |
| **Storage** | No production storage changes |
| **Testing** | `npm run build`, `npm test`, `npm run stress`, strict spec validator |

### Overview
The migration creates a sibling `stress_test/` folder next to `tests/`, moves confirmed stress suites, adds opt-in Vitest include wiring through `SPECKIT_RUN_STRESS`, and documents the operational boundary between default verification and explicit stress validation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Packet path selected.
- [x] Existing tests, Vitest config, package scripts, and README files read.
- [x] Candidate stress files discovered and classified.

### Definition of Done
- [x] Dedicated `stress_test/` folder created.
- [x] Confirmed stress suites moved.
- [x] Import/config/package/doc references updated.
- [x] Strict validator passes.
- [x] Build and stress smoke pass.
- [ ] Default `npm test` passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Opt-in stress-suite segregation.

### Key Components
- **Stress folder**: `mcp_server/stress_test/` owns explicit stress and matrix-cell tests.
- **Vitest config**: `SPECKIT_RUN_STRESS=true` includes stress files; default config excludes them.
- **Package scripts**: `npm run stress` is the operator entrypoint for stress validation.
- **Build config**: `tsconfig.json` excludes moved `.vitest.ts` files from production build.
- **Docs**: README files and direct spec-doc path references point at the new folder.

### Data Flow
Candidate discovery -> classification -> file moves -> config update -> doc reference refresh -> validator/build/test verification.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Discovery
- [x] Run stress filename and content searches.
- [x] Read candidate stress files.
- [x] Classify candidates in `migration-plan.md`.

### Phase 2: Migration
- [x] Create `mcp_server/stress_test/`.
- [x] Move confirmed stress suites.
- [x] Add `stress_test/README`.
- [x] Update Vitest, package, and TypeScript config.

### Phase 3: Documentation
- [x] Update MCP server README structure.
- [x] Update tests README boundary language.
- [x] Refresh direct moved-path references in stress-remediation docs.
- [x] Create Level 2 packet docs and metadata.

### Phase 4: Verification
- [x] Run strict packet validator.
- [x] Run `npm run build`.
- [ ] Run `npm test`.
- [x] Run `npm run stress` smoke check.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Packet docs | `validate.sh --strict` |
| Build | MCP server TypeScript package | `npm run build` |
| Default test | Non-stress test suite | `npm test` |
| Stress smoke | Dedicated stress folder | `npm run stress` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 037/001 sk-code-opencode audit | Packet | Available | Follow-up ordering unclear |
| Vitest config | Internal config | Available | Stress include/exclude cannot be controlled |
| Existing stress suites | Test files | Available | No clear migration target |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Build or default tests fail because of the migration.
- **Procedure**: Move stress suites back to `mcp_server/tests/`, remove `SPECKIT_RUN_STRESS` config and `npm run stress`, then rerun build and tests.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Discover candidates -> Move confirmed stress files -> Wire config/scripts -> Refresh docs -> Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Discovery | Existing tests and references | Migration |
| Migration | Candidate classification | Documentation |
| Documentation | New paths | Verification |
| Verification | All edits | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Discovery | Medium | 20 minutes |
| Migration | Low | 15 minutes |
| Documentation | Medium | 30 minutes |
| Verification | Medium | 30 minutes |
| **Total** | | **95 minutes** |
<!-- /ANCHOR:effort -->
