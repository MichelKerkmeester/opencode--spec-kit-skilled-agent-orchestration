---
title: "Feature Specification: Stress Test Folder Completion"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Complete the MCP server stress-test migration with content-based discovery, subsystem organization, dedicated Vitest stress config, and refreshed path references."
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
    recent_action: "Moved full stress surface."
    next_safe_action: "Run stress verification."
    blockers: []
    key_files:
      - "migration-plan.md"
      - ".opencode/skill/system-spec-kit/mcp_server/vitest.stress.config.ts"
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Use content-based discovery instead of filename-only migration."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: Stress Test Folder Completion

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Depends On** | `system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/005-stress-test-folder-migration` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 037/005 migrated only two filename-matching stress files into the dedicated stress folder. That missed the real stress-test surface, especially the search-quality harness, W-cell matrix cases, memory benchmarks, session benchmarks, skill-advisor concurrency coverage, and code-graph degraded sweeps.

### Purpose
Give MCP memory, skill-advisor, code-graph, session, and matrix stress coverage one opt-in folder and one opt-in Vitest config so maintainers can update slow stress coverage without mixing it into default unit and integration tests.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move the full legacy search-quality harness tree into `mcp_server/stress_test/search-quality/`.
- Move whole-file stress, benchmark, concurrency, degraded-state, and matrix suites into subsystem folders under `mcp_server/stress_test/`.
- Keep mixed unit files in `mcp_server/tests/` when only one assertion is stress-like.
- Add `vitest.stress.config.ts` so `npm run stress` runs the dedicated stress surface.
- Refresh package scripts and direct path references.

### Out of Scope
- Adding new stress cases.
- Extracting single stress-like test cases from otherwise unit-focused files.
- Moving Skill Advisor bench files outside the MCP tests tree.
- Creating a commit.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/` | Move | Full search-quality harness and W3-W13 cells |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/memory/` | Move | Memory search and trigger fast-path benchmark suites |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/` | Move | Skill graph rebuild concurrency stress suite |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/` | Move | Code graph degraded sweep and walker cap suites |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/session/` | Move | Session-manager stress and resume benchmarks |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/matrix/` | Move | Synthetic matrix/routing comparison suite |
| `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts` | Modify | Keep stress folder excluded from default tests |
| `.opencode/skill/system-spec-kit/mcp_server/vitest.stress.config.ts` | Create | Dedicated stress-suite Vitest config |
| `.opencode/skill/system-spec-kit/mcp_server/package.json` | Modify | Route stress scripts through the stress config |
| `migration-plan.md` | Create | Content-based classification ledger |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Discovery uses content and imports, not filenames alone | `migration-plan.md` classifies discovered candidates with rationale |
| REQ-002 | Default tests exclude dedicated stress coverage | `vitest.config.ts` excludes `mcp_server/stress_test/**` |
| REQ-003 | Stress script reaches the dedicated stress folder | `npm run stress` uses `vitest.stress.config.ts` |
| REQ-004 | Moved files import correctly from their new depths | Build and stress suite complete without import errors |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Stress folder is organized by subsystem | Stress tree contains search-quality, memory, skill-advisor, code-graph, session, and matrix folders |
| REQ-006 | Ambiguous mixed suites are documented | `migration-plan.md` lists ambiguous files left in `tests/` |
| REQ-007 | Documentation references no longer point to moved legacy paths | Stale-path grep returns no live references |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The stress folder contains the full moved stress surface, not only filename-matching files.
- **SC-002**: `package.json` exposes `stress`, `stress:harness`, and `stress:matrix`.
- **SC-003**: Strict spec validator exits 0.
- **SC-004**: `npm run build` exits 0.
- **SC-005**: `npm run stress` reaches the full stress surface.

### Acceptance Scenarios

1. **Given** the default Vitest config, **When** `npm test` runs, **Then** files under `mcp_server/stress_test/` are excluded.
2. **Given** the stress Vitest config, **When** `npm run stress` runs, **Then** files under `mcp_server/stress_test/` are discovered.
3. **Given** the moved search-quality harness, **When** harness tests import shared helpers, **Then** relative imports resolve from the new folder.
4. **Given** mixed unit files with isolated stress-like assertions, **When** the migration ledger is reviewed, **Then** those files are documented as ambiguous and left in `tests/`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Mixed unit/stress files moved wholesale | Default suite could lose ordinary unit coverage | Leave mixed files in `tests/` and document them as ambiguous |
| Risk | Imports break after moving files deeper | Build or stress suite fails | Verify with build and stress run |
| Risk | Sandbox blocks index-level rename tracking | `git mv` cannot record renames directly | Document blocker; orchestrator commit can rely on rename detection |
| Dependency | Existing Vitest setup file | Stress config must share setup behavior | Point stress config at existing MCP setup file |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Default `npm test` stays oriented around unit and integration feedback by excluding stress coverage.
- **NFR-P02**: Slow stress coverage remains reachable through explicit stress scripts.

### Security
- **NFR-S01**: No secrets or external credentials are introduced.
- **NFR-S02**: The migration changes test organization and config only; production behavior remains unchanged.

### Reliability
- **NFR-R01**: Stress config runs files serially to reduce cross-suite state interference.
- **NFR-R02**: Moved degraded-state and benchmark files retain their existing assertions.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty search-quality harness import consumer search: document no external consumers were found.
- Mixed unit/stress files: leave in `tests/` to avoid widening behavioral scope.
- Existing stress files already in the stress folder: move into subsystem folders.

### Error Scenarios
- `git mv` blocked by `.git/index.lock`: use filesystem moves and document the blocker.
- Broad default tests hang: document honestly and verify stress reachability separately.
- Stress file import drift: build and stress run expose missing modules.

### State Transitions
- Partial 037/005 state: superseded by packet 038 classification and folder layout.
- Stress script routing: old environment-gated default config is replaced by dedicated config.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | Multiple moves, config edits, and doc reference refresh |
| Risk | 12/25 | Import drift and test routing risk; no production behavior change |
| Research | 14/20 | Content-based discovery and classification required |
| **Total** | **43/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
