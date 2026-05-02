---
title: "Spec: Stress-Test Gap Remediation — Close 10 P0 Coverage Gaps"
description: "Write 10 new stress tests to close P0 gaps surfaced by packet 042 audit (1 code_graph + 9 skill_advisor); each new test must pass under npm run stress."
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
trigger_phrases:
  - "043-stress-test-gap-remediation spec"
  - "P0 stress remediation"
  - "close stress gaps"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/043-stress-test-gap-remediation"
    last_updated_at: "2026-04-30T18:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Spec authored from 042 P0 inventory"
    next_safe_action: "Dispatch cli-codex Batch A"
    blockers: []
    key_files:
      - "../042-stress-coverage-audit-and-run/coverage-matrix.csv"
      - ".opencode/skill/system-spec-kit/mcp_server/stress_test/code-graph/"
      - ".opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "043-spec-init"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

# Spec: Stress-Test Gap Remediation — Close 10 P0 Coverage Gaps

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-04-30 |
| **Branch** | `main` (skip-branch) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 042's audit produced a 54-row coverage matrix and classified 10 features as P0 stress gaps — features with concurrency, lease, capacity, or perf-budget surfaces that have no direct stress coverage today. Without remediation, release readiness for `code_graph` and `skill_advisor` cannot proceed past 005-review-remediation. The all-green stress run from 042 (28/28 files, 69/69 tests) reflects coverage absence, not regression-free behavior.

### Purpose
Write exactly 10 new stress tests — one per P0 feature — and confirm all 10 pass under `npm run stress`. After remediation, packet 042's matrix must be updated to reflect the new direct coverage and downgrade gap classification from P0 to none.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (10 new test files)

| feature_id | New file (relative to `mcp_server/stress_test/`) |
|------------|--------------------------------------------------|
| `cg-012` | `code-graph/deep-loop-graph-convergence-stress.vitest.ts` |
| `sa-001` | `skill-advisor/chokidar-narrow-scope-stress.vitest.ts` |
| `sa-002` | `skill-advisor/single-writer-lease-stress.vitest.ts` |
| `sa-003` | `skill-advisor/daemon-lifecycle-stress.vitest.ts` |
| `sa-004` | `skill-advisor/generation-snapshot-stress.vitest.ts` |
| `sa-005` | `skill-advisor/trust-state-stress.vitest.ts` |
| `sa-007` | `skill-advisor/generation-cache-invalidation-stress.vitest.ts` |
| `sa-012` | `skill-advisor/anti-stuffing-cardinality-stress.vitest.ts` |
| `sa-013` | `skill-advisor/df-idf-corpus-stress.vitest.ts` |
| `sa-037` | `skill-advisor/python-bench-runner-stress.vitest.ts` |

### Cross-packet update (042)
- `coverage-matrix.csv` rows for the 10 P0 feature_ids: populate `stress_test_files`; downgrade `gap_classification` from `P0` to `none`
- `coverage-audit.md` §4: append a "Closed by packet 043" subsection

### Out of Scope
- P1 / P2 gap remediation (deferred — not blocking release)
- Modifying product code in `code_graph/` or `skill_advisor/` (tests must pass against current implementation)
- New manual playbook scenarios
- Vitest config changes (`vitest.stress.config.ts` already covers the new files via glob)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 10 new test files exist under documented paths | `ls` shows 10 new `.vitest.ts` files |
| REQ-002 | All 10 new tests pass under `npm run stress` | Total stress files goes from 28 to 38; exit code 0 |
| REQ-003 | Each test file targets the correct feature surface | Each test imports from or asserts behavior of the catalog-cited public API |
| REQ-004 | Each test exercises at least one stress axis | Code review confirms a real pressure axis, not a happy-path smoke test |
| REQ-005 | Packet 042's `coverage-matrix.csv` is updated for all 10 P0 feature_ids | All 10 rows have non-empty `stress_test_files` and `gap_classification=none` |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Each new test runs in <10s on the project's reference machine | Vitest per-file duration line stays under 10000ms |
| REQ-007 | sa-037 Python wrapper handles missing Python interpreter gracefully | If `python3` is unavailable, test is `it.skip` with reason logged |
| REQ-008 | New tests do not introduce flaky behavior | Single clean run sufficient for this packet; flake-soak deferred to follow-on |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After this packet, all 10 P0 feature_ids in 042's matrix show `gap_classification=none`
- **SC-002**: `npm run stress` exit 0 with 38+ test files (was 28)
- **SC-003**: Each new test is self-contained — temp dirs or in-memory fixtures, no external services beyond optional `python3` for sa-037
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Stress test surfaces a real product bug under load | New test fails | Document the failure as a finding; do NOT modify product code in this packet — escalate to a product-fix packet |
| Risk | Python interpreter unavailable on test machine | sa-037 fails | REQ-007 mandates graceful skip |
| Risk | Multiprocess tests (sa-002 lease) flaky on slow CI | Test passes locally, fails CI | Vi.retry() with bounded retries acceptable |
| Dependency | cli-codex (`gpt-5.5`) | Test generation blocked | Verified working in packet 042 |
| Dependency | Existing source files under `mcp_server/skill_advisor/lib/` and `mcp_server/code_graph/` | Tests target real surfaces | Confirmed by Explore agent |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Total `npm run stress` duration grows by no more than 60s after adding 10 tests (baseline 26s; cap 90s)
- **NFR-P02**: Each new test cleans up temp directories via `afterEach`

### Reliability
- **NFR-R01**: Tests deterministic — no time-of-day, no network, no shared mutable state
- **NFR-R02**: Failures produce actionable error messages (file path, expected vs. actual, stress axis violated)

### Maintainability
- **NFR-M01**: Each test follows sibling pattern (`describe('feature_id - feature name')` + per-axis `it(...)` blocks)
- **NFR-M02**: Imports use the same path style as existing stress tests
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Test environment
- Python interpreter missing → sa-037 emits `it.skip` with reason
- Filesystem temp dir creation fails → test fails fast with clear error

### Subsystem state
- Skill-advisor daemon already running on the dev machine → tests use isolated SQLite paths
- Code-graph DB locked → cg-012 uses temp DB

### Cross-packet effects
- Updating 042's matrix while 042 is "complete" — intentional and noted in 042's audit §4 closure subsection
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 10 new test files (~50-150 LOC each) + 1 cross-packet matrix update |
| Risk | 14/25 | Stress tests can surface real bugs; multiprocess tests flake-prone |
| Research | 12/20 | Source mapping done in 042 + Explore agent for this packet |
| **Total** | **42/70** | **Level 2 — verification-focused** |
<!-- /ANCHOR:complexity -->

---

## L2: ACCEPTANCE SCENARIOS

### AS-001: Test count grows by exactly 10

- **Given** the current stress suite has 28 test files
- **When** packet 043 completes
- **Then** the suite has 38 test files and `npm run stress` reports `Test Files 38 passed (38)`

### AS-002: Each P0 row in 042 closes

- **Given** the 10 P0 feature_ids from 042's coverage matrix
- **When** I grep the updated matrix CSV for each id
- **Then** every row has a non-empty `stress_test_files` cell and `gap_classification=none`

### AS-003: New tests target real surfaces

- **Given** a new stress file in 043
- **When** I read its imports and assertions
- **Then** it imports from `mcp_server/code_graph/` or `mcp_server/skill_advisor/lib/`

### AS-004: Stress run exit 0

- **Given** the 10 new test files are written
- **When** `npm run stress` runs
- **Then** exit code is 0 and no FAIL lines appear in the log

### AS-005: Strict validator passes

- **Given** the finalized packet 043 folder
- **When** `bash scripts/spec/validate.sh <packet> --strict` runs
- **Then** the validator returns exit 0 with no errors

---

## 10. OPEN QUESTIONS

- None at scaffold time. P1/P2 follow-on work tracked under release-readiness backlog.
<!-- /ANCHOR:questions -->

---
