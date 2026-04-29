---
title: "Feature Specification: 037/005 Stress Test Folder Migration"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Move confirmed MCP server stress-test suites out of mcp_server/tests into dedicated mcp_server/stress_test, add opt-in stress runner config, and update references."
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
      fingerprint: "sha256:037005stresstestfoldermigration0000000000000000000000000"
      session_id: "037-005-stress-test-folder-migration"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Feature Specification: 037/005 Stress Test Folder Migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Blocked on default test suite |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Parent** | `037-followup-quality-pass` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Stress-test coverage for the MCP server lived inside `mcp_server/tests/`, making it harder to distinguish explicit stress, load, and matrix-cell validation from the default unit and integration suite.

### Purpose
Create a dedicated `.opencode/skill/system-spec-kit/mcp_server/stress_test/` folder, move confirmed stress suites there, keep default tests fast and runnable, and provide an explicit `npm run stress` command for operator-run stress validation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Survey `mcp_server/tests/` and classify stress candidates.
- Move confirmed stress suites to `mcp_server/stress_test/`.
- Add `stress_test/README`.
- Update Vitest discovery, TypeScript build exclusions, and package scripts.
- Update direct doc references to moved stress-test paths.
- Create packet docs and `migration-plan.md`.

### Out of Scope
- Creating new stress tests.
- Moving fixture-only search-quality cells that are not true stress harnesses.
- Refactoring unrelated test helpers or production code.
- Updating historical archive prose that does not point to a moved file path.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/` | Create | Dedicated stress-test folder and README |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/*.vitest.ts` | Move | Confirmed stress suites moved from `tests/` |
| `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts` | Modify | Opt-in stress include via `SPECKIT_RUN_STRESS` |
| `.opencode/skill/system-spec-kit/mcp_server/package.json` | Modify | Add `npm run stress` |
| `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json` | Modify | Exclude stress test files from build |
| `.opencode/skill/system-spec-kit/mcp_server/README` | Modify | Document new folder in structure map |
| `.opencode/skill/system-spec-kit/mcp_server/tests/README` | Modify | Clarify default test vs stress-test boundary |
| `specs/.../011-mcp-runtime-stress-remediation/**/*.md` | Modify | Refresh direct path references for moved stress suite |
| `specs/.../005-stress-test-folder-migration/*` | Create | Level 2 packet docs and migration plan |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Dedicated folder exists | `mcp_server/stress_test/` exists with `README.md` |
| REQ-002 | Confirmed stress files moved | `session-manager-stress.vitest.ts` and `code-graph-degraded-sweep.vitest.ts` live under `stress_test/` |
| REQ-003 | Default tests stay runnable | `npm test` runs default `tests/` suite without moved stress files |
| REQ-004 | Stress tests are runnable | `npm run stress` targets `mcp_server/stress_test/` |
| REQ-005 | Build stays green | `npm run build` exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Candidate classification documented | `migration-plan.md` classifies discovered stress candidates |
| REQ-007 | References refreshed | Direct docs pointing to moved stress paths use `mcp_server/stress_test/` |
| REQ-008 | Packet validates | `validate.sh .../005-stress-test-folder-migration --strict` exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Default `npm test` excludes the dedicated stress folder.
- **SC-002**: `npm run stress` discovers and starts the moved stress suites.
- **SC-003**: TypeScript build excludes `.vitest.ts` files in `stress_test/`.
- **SC-004**: Direct documentation references to moved stress suites point at `mcp_server/stress_test/`.

### Acceptance Scenarios

- **SCN-001**: **Given** an operator wants the fast suite, **when** they run `npm test`, **then** Vitest uses `mcp_server/tests/` and does not include `mcp_server/stress_test/`.
- **SCN-002**: **Given** an operator wants stress coverage, **when** they run `npm run stress`, **then** Vitest includes `mcp_server/stress_test/**/*.{vitest,test}.ts`.
- **SCN-003**: **Given** a future stress candidate is fixture-only or ambiguous, **when** it is classified, **then** it remains in `tests/` unless evidence clearly says it belongs in `stress_test/`.
- **SCN-004**: **Given** a moved stress file is referenced from packet docs, **when** an operator follows the path, **then** the reference points to `mcp_server/stress_test/`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packet 037/001 audit | Establishes follow-up ordering | Recorded in `graph-metadata.json` |
| Risk | Build includes moved `.vitest.ts` files | `npm run build` could compile test-only code | Add `stress_test/**/*.vitest.ts` and `stress_test/**/*.test.ts` to `tsconfig.json` excludes |
| Risk | Direct file runs miss Vitest include globs | Stress tests may not be discovered | Gate stress include behind `SPECKIT_RUN_STRESS=true` and use `npm run stress` |
| Risk | Historical docs drift | Old packet docs could point to moved paths | Refresh direct path references in current stress-remediation docs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Default `npm test` must not add explicit stress-test workload.

### Security
- **NFR-S01**: No runtime auth, governance, or index-scope behavior changes.

### Reliability
- **NFR-R01**: Stress tests must isolate temporary DB state and avoid live DB mutation.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Fixture-only W7 degraded-readiness cells mention "stress cell" but only assert static measurement fixtures, so they remain in `tests/search-quality/`.

### Error Scenarios
- If `git mv` cannot write `.git/index.lock` under sandboxing, a filesystem move is acceptable and Git can still detect the rename.

### State Transitions
- Draft to Complete: Allowed after strict validator, build, default tests, and stress smoke check pass.
<!-- /ANCHOR:edge-cases -->
