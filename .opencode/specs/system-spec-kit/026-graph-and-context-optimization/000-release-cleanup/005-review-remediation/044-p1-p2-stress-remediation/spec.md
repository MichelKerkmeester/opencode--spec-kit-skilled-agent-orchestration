---
title: "Spec: P1 + P2 Stress-Test Remediation — Close 36 Remaining Coverage Gaps"
description: "Close 6 P1 + 30 P2 stress coverage gaps surfaced by 042 audit; tests must pass under npm run stress; consolidation allowed where natural."
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
trigger_phrases:
  - "044-p1-p2-stress-remediation spec"
  - "P1 P2 stress remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/044-p1-p2-stress-remediation"
    last_updated_at: "2026-04-30T19:25:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Spec authored from 042 P1+P2 inventory"
    next_safe_action: "Dispatch cli-codex Batch P1"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "044-spec-init"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

# Spec: P1 + P2 Stress-Test Remediation — Close 36 Remaining Coverage Gaps

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-30 |
| **Branch** | `main` (skip-branch) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 042 surfaced 36 features with thin or absent stress coverage that were not blocking but represent ongoing release-readiness debt: 6 P1 (thin direct stress) and 30 P2 (`Maybe`-required, uncovered). After 043 closed all 10 P0 gaps, these 36 features remain. Closing them removes the entire stress-coverage backlog for `code_graph` and `skill_advisor`.

### Purpose
Add stress coverage for the remaining 36 features. Consolidation is allowed where features share a natural test surface (e.g. cg-014/015/016 CCC trio in one file; sa-030/031/032/033 hooks quartet in one file). Each feature_id must end up with at least one direct stress file path in 042's matrix.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add stress tests for all 6 P1 features and all 30 P2 features
- Consolidation where natural — output count may be lower than 36 files
- Cross-update 042 matrix: every P1/P2 row gets `gap_classification=none` and a populated `stress_test_files`

### Feature inventory

**P1 (6):**

| feature_id | Subsystem | Feature |
|------------|-----------|---------|
| cg-003 | code_graph | code_graph_scan |
| cg-007 | code_graph | code_graph_context |
| cg-008 | code_graph | Context handler |
| sa-019 | skill_advisor | Five-lane analytical fusion |
| sa-020 | skill_advisor | Skill-nodes / skill-edges projection |
| sa-025 | skill_advisor | advisor_recommend MCP tool |

**P2 (30):**

- code_graph (10): cg-004, cg-005, cg-006, cg-009, cg-010, cg-011, cg-014, cg-015, cg-016, cg-017
- skill_advisor (20): sa-008, sa-009, sa-010, sa-011, sa-014, sa-015, sa-016, sa-017, sa-018, sa-022, sa-023, sa-027, sa-028, sa-030, sa-031, sa-032, sa-033, sa-034, sa-035, sa-036

### Out of Scope
- Modifying product code
- Re-running 042 audit
- Adding manual playbook scenarios
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 36 features have at least one direct stress test file path in 042's matrix | grep matrix CSV — 0 rows in {P1,P2} remaining |
| REQ-002 | All new tests pass under `npm run stress` | exit 0; no FAIL lines |
| REQ-003 | Each new test exercises a real stress axis | Code review per file confirms pressure dimension |
| REQ-004 | Packet 042 matrix updated for all 36 P1+P2 ids; gap_classification=none | grep matrix |
| REQ-005 | `validate.sh --strict` exits 0 for both 044 and 042 | Validator output |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Per-test duration <10s | Vitest reporter |
| REQ-007 | Tests are self-contained (tmp dirs, no network) | Code review |
| REQ-008 | Hooks-quartet (sa-030..033) consolidated into one file is acceptable | Documented in `evidence` column |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After 044, 042's matrix has 0 rows in P1 or P2 — every gap_classification is `none` (or P0 closed by 043)
- **SC-002**: `npm run stress` exit 0 with file count up by at least 15 (some consolidation expected)
- **SC-003**: Stress-test result synthesis report produced documenting every file in stress_test/
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Some P2 features may lack a clean test surface | Test becomes contrived | Allow `it.skip` with documented reason + FIXME tag |
| Risk | Hooks/CLI features (sa-030..034) require simulated runtimes | Test brittleness | Mock at the parity-test boundary, not full runtime |
| Risk | 36 tests increases stress run duration | Slow CI | NFR cap; if exceeded, parallelize via vitest pool |
| Dependency | cli-codex (`gpt-5.5`) | All batches blocked | Verified |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `npm run stress` total duration ≤ 120s (was 29s; allow up to ~90s additional)
- **NFR-P02**: Each new test file's setup/teardown cleans temp resources

### Reliability
- **NFR-R01**: Tests deterministic — no time-of-day, no network
- **NFR-R02**: FIXME-tagged loose assertions are acceptable when tighter assertions would require product changes

### Maintainability
- **NFR-M01**: New files follow sibling pattern from packets 042 and 043
- **NFR-M02**: Consolidated files clearly name each covered feature_id in describe block (e.g. `'sa-030..033 — user-prompt-submit hooks across runtimes'`)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Test coverage
- Hooks features (sa-030..034) require runtime stubs — use parity-test fixtures, not full runtime spawn
- CCC features (cg-014..016) require external `ccc` binary — gracefully skip when binary missing
- Doctor apply mode (cg-017) has filesystem mutation — must use temp dir

### Subsystem state
- All tests must work with isolated temp paths so they can run alongside live daemon
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | 36 features → up to 25 files; substantial volume |
| Risk | 14/25 | Many features have brittle test surfaces |
| Research | 14/20 | Source mapping reuses 042 + 043 work |
| **Total** | **50/70** | **Level 2 — verification-focused** |
<!-- /ANCHOR:complexity -->

---

## L2: ACCEPTANCE SCENARIOS

### AS-001: Every P1/P2 row closed

- **Given** 042's coverage-matrix.csv after this packet completes
- **When** I grep for `gap_classification` ∈ {P1, P2}
- **Then** zero rows match (all 36 are now `none`)

### AS-002: Stress run green

- **Given** the new stress files exist
- **When** `npm run stress` runs
- **Then** exit code 0 and no FAIL lines

### AS-003: Consolidated files name covered ids

- **Given** a consolidated test file (e.g. CCC trio in one file)
- **When** I read its describe block
- **Then** all covered feature_ids are named (e.g. `'cg-014..016 — CCC integration'`)

### AS-004: Synthesis report covers all files

- **Given** the post-completion synthesis report
- **When** I read it
- **Then** every file in `mcp_server/stress_test/**/*.vitest.ts` is mentioned with results

### AS-005: Strict validator passes

- **Given** the finalized packet folder
- **When** `validate.sh --strict` runs
- **Then** exit 0

---

## 10. OPEN QUESTIONS

- None at scaffold time.
<!-- /ANCHOR:questions -->

---
