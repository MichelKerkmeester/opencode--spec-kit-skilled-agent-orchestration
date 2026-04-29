---
title: "Implementation Plan: Stress Test Folder Completion"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Plan for content-based stress-test discovery, subsystem moves, config updates, docs refresh, and verification."
trigger_phrases:
  - "038-stress-test-folder-completion"
  - "stress test full migration"
  - "search-quality harness move"
  - "content-based stress migration"
  - "stress folder reorganization"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/038-stress-test-folder-completion"
    last_updated_at: "2026-04-29T18:45:00Z"
    last_updated_by: "codex"
    recent_action: "Verified stress suite."
    next_safe_action: "Hand off for commit."
    blockers: []
    key_files:
      - "migration-plan.md"
      - ".opencode/skill/system-spec-kit/mcp_server/vitest.stress.config.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: Stress Test Folder Completion

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript / Node.js |
| **Framework** | Vitest |
| **Storage** | Existing MCP test databases and fixtures |
| **Testing** | `npm run build`, `npm test`, `npm run stress`, strict spec validator |

### Overview
Complete the partial stress-test migration by moving content-confirmed stress coverage into `mcp_server/stress_test/` and splitting it by subsystem. The implementation prefers whole-directory and whole-file moves; mixed suites stay in default tests and are documented as ambiguous.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Prior 037/005 migration plan read.
- [x] Stress README, tests README, Vitest config, and package scripts read.
- [x] Content discovery commands run.

### Definition of Done
- [x] Full search-quality harness moved.
- [x] Whole-file stress suites moved by subsystem.
- [x] Imports updated after deeper moves.
- [x] Default and stress Vitest configs separated.
- [x] Package scripts refreshed.
- [x] Direct docs references refreshed.
- [x] Packet docs authored with migration classifications.
- [x] Strict validator pass recorded.
- [x] Build pass recorded.
- [x] Stress pass recorded.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Dedicated opt-in stress suite with subsystem folders.

### Key Components
- **search-quality**: Harness, corpus, metrics, telemetry, and W3-W13 cells.
- **memory**: Memory search and trigger fast-path benchmarks.
- **skill-advisor**: Skill graph/advisor concurrency coverage.
- **code-graph**: Degraded graph and large-input caps.
- **session**: Session-manager capacity and session-resume benchmarks.
- **matrix**: Synthetic search-routing matrix comparison.
- **Vitest split**: Default config excludes stress; stress config includes only stress.

### Data Flow
Default tests run through `vitest.config.ts` and skip the stress tree. Stress scripts run through `vitest.stress.config.ts`, load the same setup file, and discover only files under `mcp_server/stress_test/`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read prior packet and current test boundary docs.
- [x] Read package scripts and Vitest config.
- [x] Run content-based discovery commands.

### Phase 2: Core Implementation
- [x] Create subsystem folders under `mcp_server/stress_test/`.
- [x] Move search-quality harness and matrix cells.
- [x] Move memory, session, skill-advisor, code-graph, and matrix stress files.
- [x] Update relative imports after moves.
- [x] Add dedicated stress Vitest config and package scripts.
- [x] Refresh direct moved-path references.

### Phase 3: Verification
- [x] Run stale-reference grep.
- [x] Run strict validator.
- [x] Run TypeScript build.
- [x] Run default tests; unrelated failures/hang documented.
- [x] Run stress suite.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static validation | Packet docs and metadata | `validate.sh --strict`: passed |
| Build | TypeScript project references | `npm run build`: passed |
| Default tests | Unit/integration suite excluding stress | `npm test`: unrelated failures, then hang |
| Stress tests | Full dedicated stress folder | `npm run stress`: 25 files, 63 tests passed |
| Reference sweep | Moved legacy path references | `rg` stale-path query |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing Vitest setup file | Internal | Green | Stress tests would miss shared setup behavior |
| Existing stress fixtures | Internal | Green | Harness and benchmark runs would fail |
| Git index write access | Tooling | Yellow | `git mv` cannot be recorded directly in sandbox |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Stress config cannot discover the moved suites or build/test imports fail in a way that cannot be resolved in scope.
- **Procedure**: Move affected files back to their prior test locations, remove `vitest.stress.config.ts`, restore package script routing, and rerun build/default tests.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Discovery) -> Phase 2 (Moves + Config) -> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Discovery | None | Moves + Config |
| Moves + Config | Discovery | Verify |
| Verify | Moves + Config | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Discovery | Medium | 1 hour |
| Core Implementation | Medium | 2-3 hours |
| Verification | Medium | 1-2 hours |
| **Total** | | **4-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Content-based classification captured.
- [x] Moved-file import paths reviewed.
- [x] Final verification commands recorded.

### Rollback Procedure
1. Restore moved files to their prior test tree locations.
2. Remove stress-only Vitest config and stress sub-scripts.
3. Restore default Vitest stress gating if needed.
4. Rerun build and default tests.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
