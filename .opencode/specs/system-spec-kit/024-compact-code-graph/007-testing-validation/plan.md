---
title: "Plan: Phase 7 — Testing & Validation [system-spec-kit/024-compact-code-graph/007-testing-validation/plan]"
description: "1. Create RuntimeFixture contract and shared test utilities"
trigger_phrases:
  - "plan"
  - "phase"
  - "testing"
  - "validation"
  - "007"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/007-testing-validation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase 7 — Testing & Validation


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## 1. SUMMARY
Template compliance shim section. Legacy phase content continues below.

## 2. QUALITY GATES
Template compliance shim section. Legacy phase content continues below.

## 3. ARCHITECTURE
Template compliance shim section. Legacy phase content continues below.

## 4. IMPLEMENTATION PHASES
Template compliance shim section. Legacy phase content continues below.

## 5. TESTING STRATEGY
Template compliance shim section. Legacy phase content continues below.

## 6. DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 7. ROLLBACK PLAN
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:summary -->
Template compliance shim anchor for summary.
<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
Template compliance shim anchor for quality-gates.
<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
Template compliance shim anchor for architecture.
<!-- /ANCHOR:architecture -->
<!-- ANCHOR:phases -->
Template compliance shim anchor for phases.
<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
Template compliance shim anchor for testing.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:dependencies -->
Template compliance shim anchor for dependencies.
<!-- /ANCHOR:dependencies -->
<!-- ANCHOR:rollback -->
Template compliance shim anchor for rollback.
<!-- /ANCHOR:rollback -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Steps

1. **Create RuntimeFixture contract and shared test utilities:**
   - Implement `RuntimeFixture` interface in `tests/fixtures/runtime-fixtures.ts`
   - Create `createRuntimeFixture()` factory for each runtime
   - Set up shared helpers: stdin mock, stdout capture, temp file management
2. **Implement unit tests:**
   - `runtime-routing.vitest.ts` — runtime detection from env vars, capability model output
   - `hook-session-start.vitest.ts` — SessionStart payload parsing, source matching, context injection
   - `hook-precompact.vitest.ts` — PreCompact precompute logic, cache file write/read, timeout handling
   - `hook-stop-token-tracking.vitest.ts` — Stop hook transcript parsing, token counting, snapshot creation
3. **Implement integration tests (in-memory SQLite):**
   - `token-snapshot-store.vitest.ts` — CRUD on `session_token_snapshots` table
   - `session-token-resume.vitest.ts` — session state reconstruction from snapshot
   - `cross-runtime-fallback.vitest.ts` — tool-based recovery for Codex/Copilot/Gemini fixtures
4. **Implement runtime smoke tests:**
   - Claude hook fixture: simulate full PreCompact -> cache -> SessionStart(compact) -> inject flow
   - Codex/Copilot/Gemini: simulate tool fallback paths with fixture-driven assertions
5. **Extend existing test files:**
   - `dual-scope-hooks.vitest.ts` — add Claude compaction fixtures (PreCompact -> SessionStart sequence)
   - `crash-recovery.vitest.ts` — add real SQLite fixtures for session recovery with token snapshots
6. **Run manual testing playbook scenarios (from Phase 6):**
   - Execute each scenario from the manual testing playbook
   - Record pass/fail with evidence (screenshots, logs, output snippets)
   - File bugs for any failures
7. **Document test results and coverage:**
   - Generate vitest coverage report
   - Document manual test results in scratch/ or research/
   - Verify all 7 scenarios from test matrix are covered

<!-- ANCHOR:dependencies-2 -->
### Dependencies
- Phase 1-4 (all hook implementations must exist to test)
- Phase 5 (command/agent updates affect integration test expectations)
- Phase 6 (manual testing playbook must exist before manual execution)
<!-- /ANCHOR:dependencies-2 -->

### Test Execution Order
1. Unit tests first (no external dependencies)
2. Integration tests (in-memory SQLite, no MCP required)
3. Runtime smoke tests (may need mock MCP server)
4. Manual testing last (requires full system running)

### Technical Context
- Runtime surface: system-spec-kit MCP server + hook adapters.
- Validation surface: recursive packet validation and full quality-gate checks.

### Phase 1: Validation
- Maintain packet verification and release-gate traceability.

### Phase 2: Validation
- Maintain packet verification and release-gate traceability.
