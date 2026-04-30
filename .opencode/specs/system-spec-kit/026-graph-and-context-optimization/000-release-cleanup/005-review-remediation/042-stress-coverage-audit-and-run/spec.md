---
title: "Spec: Stress-Test Coverage Audit and Run for code_graph and skill_advisor"
description: "Audit whether stress_test/ covers every documented feature in the code_graph (17) and skill_advisor (37) feature catalogs, then run npm run stress and report results."
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
trigger_phrases:
  - "042-stress-coverage-audit-and-run spec"
  - "stress test coverage audit"
  - "code_graph stress coverage"
  - "skill_advisor stress coverage"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/042-stress-coverage-audit-and-run"
    last_updated_at: "2026-04-30T18:10:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Spec authored from approved plan"
    next_safe_action: "Dispatch cli-codex high to build coverage matrix and audit"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/feature_catalog.md"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/feature_catalog.md"
      - ".opencode/skill/system-spec-kit/mcp_server/stress_test/"
      - ".opencode/skill/system-spec-kit/mcp_server/package.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "042-spec-init"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

# Spec: Stress-Test Coverage Audit and Run

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
| **Branch** | `main` (skip-branch; per memory rule: stay on main) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `code_graph` and `skill_advisor` subsystems each maintain a feature catalog (17 + 37 = 54 features), but the stress-test directory currently holds only **3 directly-tagged code-graph tests** and **2 directly-tagged skill-advisor tests**. We don't have a written, auditable answer to: which catalog features have stress coverage, which require it, and which have a real gap. Release readiness work cannot proceed past 005-review-remediation without that answer.

### Purpose
Produce a coverage matrix (54 rows × locked column schema), a narrative audit with classified gaps, and a fresh `npm run stress` results report — all under a Level 2 packet that exits validate.sh --strict cleanly.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `coverage-matrix.csv` — 54 rows, locked header with 12 columns
- `coverage-audit.md` — rubrics frozen first, then per-group findings, then gap list, then follow-on recommendation
- `logs/stress-run-<UTC-timestamp>.log` — raw `npm run stress` output (stdout+stderr)
- `stress-run-report.md` — parsed pass/fail/skip counts, durations, exit code, baseline diff
- `implementation-summary.md` — totals, follow-on recommendation
- Lean trio (`spec.md`, `description.json`, `graph-metadata.json`) refresh via `generate-context.js`

### Out of Scope
- Writing new stress tests — deferred to packet `043-stress-test-gap-remediation` only if P0 gaps surface
- Modifying feature catalogs — they are inputs, not outputs
- Modifying product code in `mcp_server/code_graph/` or `mcp_server/skill_advisor/`
- Manual-playbook updates — separate concern

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/.../042-stress-coverage-audit-and-run/spec.md` | Create | This file |
| `.opencode/specs/.../042-stress-coverage-audit-and-run/plan.md` | Create | Execution plan |
| `.opencode/specs/.../042-stress-coverage-audit-and-run/tasks.md` | Create | Task tracker |
| `.opencode/specs/.../042-stress-coverage-audit-and-run/checklist.md` | Create | Verification gates |
| `.opencode/specs/.../042-stress-coverage-audit-and-run/coverage-matrix.csv` | Create | 54-row matrix |
| `.opencode/specs/.../042-stress-coverage-audit-and-run/coverage-audit.md` | Create | Audit narrative |
| `.opencode/specs/.../042-stress-coverage-audit-and-run/stress-run-report.md` | Create | Run results |
| `.opencode/specs/.../042-stress-coverage-audit-and-run/logs/stress-run-*.log` | Create | Raw vitest output |
| `.opencode/specs/.../042-stress-coverage-audit-and-run/implementation-summary.md` | Update | Post-run synthesis |
| `.opencode/specs/.../042-stress-coverage-audit-and-run/description.json` | Generate | via generate-context.js |
| `.opencode/specs/.../042-stress-coverage-audit-and-run/graph-metadata.json` | Generate | via generate-context.js |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `coverage-matrix.csv` has the locked header verbatim and 54 data rows (17 code_graph + 37 skill_advisor) | `head -n1` matches schema; `wc -l` = 55 |
| REQ-002 | Every row populates `stress_coverage_required` ∈ {Y, N, Maybe} and `gap_classification` ∈ {P0, P1, P2, none} | grep for empty fields in those columns returns 0 |
| REQ-003 | `coverage-audit.md` §1 contains both rubrics verbatim BEFORE any matrix discussion | Section ordering inspection |
| REQ-004 | `stress-run-report.md` cites the exact log filename and the run's exit code | grep filename + `Exit code:` line |
| REQ-005 | `bash scripts/spec/validate.sh <packet> --strict` exits 0 | Validator output |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | If any P0 gap is classified, `implementation-summary.md` recommends opening packet `043-stress-test-gap-remediation` (without auto-creating it) | Inspection of summary §Follow-on |
| REQ-007 | `coverage-matrix.csv` has separate columns for `stress_test_files` (direct) and `supplementary_stress_files` (memory/, session/, search-quality/, matrix/) | Header inspection |
| REQ-008 | All 54 features traceable to at least one of: direct stress, supplementary stress, vitest unit, or manual playbook | No row has all four coverage columns empty |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Reviewer can answer "is feature X stress-covered?" in <30s by opening `coverage-matrix.csv` and filtering by `feature_id`
- **SC-002**: Reviewer can answer "should we ship without writing more stress tests?" in <2 min by reading `coverage-audit.md` §3 (gap list) + `stress-run-report.md` (pass rate)
- **SC-003**: Packet validates strict (exit 0) and the lean-trio metadata (`description.json`, `graph-metadata.json`) is fresh
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `npm run stress` runner exists in `mcp_server/package.json` | If broken, no run report | Confirmed present in inventory |
| Risk | Stress run may have pre-existing flakes/skips | False-positive gap calls | `stress-run-report.md` diffs against `stress_test/README.md` baseline if present; otherwise notes "no baseline" |
| Risk | Stress run takes >5 min | Foreground bash timeout | Switch to `run_in_background=true` + Monitor if early progress projects long duration |
| Dependency | cli-codex (`gpt-5.5`) available, normal speed | Synthesis tasks block | Verified `codex --version` returns 0.125.0 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Total packet wall-clock <90 min (synthesis + run + parse + validate)
- **NFR-P02**: Stress run captured to log file even if it exceeds bash timeout (use `tee` + background mode)

### Reliability
- **NFR-R01**: Log file is preserved regardless of exit code; non-zero exit does not block packet completion
- **NFR-R02**: Coverage matrix is reproducible from the same catalogs without rerunning the audit

### Auditability
- **NFR-A01**: Every row in `coverage-matrix.csv` cites the catalog anchor it derives from (`catalog_anchor` column)
- **NFR-A02**: Every checklist `[x]` cites either a CSV row range or a specific file path
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Coverage classification
- Feature has only manual-playbook coverage → `stress_coverage_required=Y, gap_classification=P1` if runtime pressure exists; `Maybe`/`P2` otherwise
- Feature is pure config or static contract → `stress_coverage_required=N, gap_classification=none`
- Feature is covered indirectly by tangential dir but not directly → `gap_classification=P1` (thin), not `P0`

### Stress run
- Exit code non-zero with no test failures (e.g., infrastructure error) → flag in report, do NOT auto-classify any feature as gap
- Test passes but matches a P0 row → still flag the feature as having a thin axis if test is single-axis
- Run hangs / OOMs → kill, capture partial log, report as "incomplete run" and request user re-run

### Validator
- Strict mode flags pre-existing template artifacts → fix in this packet only if introduced by this packet
- `description.json` / `graph-metadata.json` missing after scaffold → run `generate-context.js` before claiming completion
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 6 packet docs + 1 CSV + 1 log file; no product code |
| Risk | 8/25 | No prod-code touch; only documentation + observation |
| Research | 14/20 | 54 features × ~25 test files cross-reference is real synthesis work |
| **Total** | **34/70** | **Level 2 — verification-focused** |
<!-- /ANCHOR:complexity -->

---

## L2: ACCEPTANCE SCENARIOS

### AS-001: Matrix shape

- **Given** the two feature catalogs and the stress_test tree
- **When** cli-codex runs synthesis #1
- **Then** `coverage-matrix.csv` contains the locked header on line 1 and exactly 54 data rows on lines 2-55, with 17 `code_graph` rows and 37 `skill_advisor` rows

### AS-002: No unclassified rows

- **Given** `coverage-matrix.csv`
- **When** a reviewer scans the `stress_coverage_required` and `gap_classification` columns
- **Then** no row is empty and every row uses one of {Y, N, Maybe} and {P0, P1, P2, none}

### AS-003: Run report cites log

- **Given** a fresh `npm run stress` log file under `logs/`
- **When** cli-codex parses it
- **Then** `stress-run-report.md` cites the exact log filename in §1 and captures the actual exit code from the `STRESS_RUN_EXIT_CODE=` trailer

### AS-004: P0 gaps trigger follow-on recommendation

- **Given** any P0 row in the gap inventory
- **When** the packet completes
- **Then** `implementation-summary.md` lists the gap rows by `feature_id` and recommends opening packet `043-stress-test-gap-remediation` without creating it

### AS-005: Strict validator passes

- **Given** the finalized packet folder
- **When** `bash scripts/spec/validate.sh <packet> --strict` runs
- **Then** the validator returns exit 0 with no errors

---

## 10. OPEN QUESTIONS

- None at scaffold time. If P0 gaps surface in the audit, packet 043 scope is the only open question for follow-on work.
<!-- /ANCHOR:questions -->

---
