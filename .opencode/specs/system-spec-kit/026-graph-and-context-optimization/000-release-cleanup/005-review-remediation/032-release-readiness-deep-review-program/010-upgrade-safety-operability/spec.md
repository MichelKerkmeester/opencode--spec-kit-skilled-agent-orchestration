<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
---
title: "Feature Specification: Upgrade Safety Operability Deep Review"
description: "Read-only release-readiness audit of install, upgrade, migration, doctor, relocated test, hook-test, environment-default, and backwards-compatibility operability surfaces."
trigger_phrases:
  - "045-010-upgrade-safety-operability"
  - "upgrade safety audit"
  - "operability review"
  - "install guide review"
  - "doctor mcp install review"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/010-upgrade-safety-operability"
    last_updated_at: "2026-04-29T23:15:00+02:00"
    last_updated_by: "codex"
    recent_action: "Initialized upgrade safety and operability deep-review packet"
    next_safe_action: "Use review-report.md findings for remediation planning"
    blockers: []
    key_files:
      - "review-report.md"
      - ".opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md"
      - ".opencode/command/doctor/scripts/mcp-doctor.sh"
      - ".opencode/skill/system-spec-kit/mcp_server/package.json"
    session_dedup:
      fingerprint: "sha256:045010upgradesafetyoperability0000000000000000000000000000"
      session_id: "045-010-upgrade-safety-operability"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "User supplied the exact packet folder and requested a read-only audit."
---
# Feature Specification: Upgrade Safety Operability Deep Review

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
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Recent release-readiness work moved stress tests, added matrix runners, refreshed install docs, and extended database and hook surfaces. The release needs a read-only operability audit to catch install drift, doctor false diagnostics, migration evidence gaps, stale environment defaults, and backwards-compatibility validation regressions.

### Purpose
Produce a severity-classified review report that verifies upgrade safety and operator diagnostics without modifying target runtime, docs, or configuration files.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit MCP server install and upgrade documentation.
- Audit package scripts for `npm test`, `npm run stress`, and `npm run hook-tests`.
- Audit DB schema migration, rollback, and checkpoint evidence.
- Audit doctor MCP install/debug workflows and their diagnostic signals.
- Audit stress-test and matrix-runner relocation references.
- Audit environment variable default-state claims.
- Audit backwards compatibility by validating an existing older spec folder.
- Write only packet-local docs and `review-report.md`.

### Out of Scope
- Runtime code changes.
- Fixing install docs, doctor scripts, environment references, package scripts, or legacy spec folders.
- Committing changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/010-upgrade-safety-operability/spec.md` | Create | Packet specification |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/010-upgrade-safety-operability/plan.md` | Create | Audit plan |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/010-upgrade-safety-operability/tasks.md` | Create | Audit task ledger |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/010-upgrade-safety-operability/checklist.md` | Create | Verification checklist |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/010-upgrade-safety-operability/implementation-summary.md` | Create | Completion summary |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/010-upgrade-safety-operability/description.json` | Create | Search metadata |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/010-upgrade-safety-operability/graph-metadata.json` | Create | Graph metadata |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/010-upgrade-safety-operability/review-report.md` | Create | Severity-classified audit output |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve read-only target scope | Only packet-local docs are written; target surfaces are inspected only |
| REQ-002 | Produce severity-classified findings | `review-report.md` lists P0/P1/P2 findings with file:line evidence |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Verify install and doctor operability | Install, debug, preflight, and verification flows are classified with gaps |
| REQ-004 | Verify migration safety evidence | Fresh schema, old schema, rollback, and checkpoint evidence are summarized |
| REQ-005 | Verify relocated paths | Old stress-test path imports are searched and current stress scripts are cited |
| REQ-006 | Verify hook-test reachability | `npm run hook-tests` script and runner evidence are cited |
| REQ-007 | Verify environment defaults | ENV_REFERENCE defaults are checked against source code and config notes |
| REQ-008 | Verify backwards compatibility | Existing `026/005-memory-indexer-invariants` strict validation result is recorded |

### Acceptance Scenarios

- **Given** the current install docs and package metadata, **when** prerequisites are audited, **then** Node-version drift is classified if docs admit unsupported engines.
- **Given** doctor MCP workflows, **when** diagnostics run, **then** false warnings or missing checks are listed with root-cause file evidence.
- **Given** relocated stress-test folders, **when** old path imports are searched, **then** absence or leftovers are reported.
- **Given** an older spec folder, **when** strict validation runs, **then** any current-validator backwards-compatibility failure is reported.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `review-report.md` uses the 9-section deep-review report structure.
- **SC-002**: Active findings cite file:line evidence or command-derived evidence.
- **SC-003**: Specific user questions are answered in the Traceability Status and Audit Appendix.
- **SC-004**: Strict validator exits 0 for this packet folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing doctor command output | Medium | Record exact pass/warn/fail counts in appendix |
| Dependency | Legacy spec folder validation | Medium | Treat strict-validation failure as release-readiness evidence, not as a target edit |
| Risk | Absence checks can be noisy | Medium | Pair `rg` absence evidence with current script/config citations |
| Risk | Migration safety may be partly evidence-based | Medium | Distinguish proven code paths from missing old-DB upgrade drills |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: Audit install guidance for insecure defaults and secret exposure.
- **NFR-S02**: Do not expose or inspect private credentials.

### Reliability
- **NFR-R01**: Findings must be reproducible with cited files or listed commands.
- **NFR-R02**: The final packet must pass strict validation.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Audit Boundaries
- Command-derived absence findings must list the command surface and cite current replacement paths.
- Sandbox-skipped live hook tests are not treated as a failing `hook-tests` script; they remain an evidence limitation.
- Existing permissive runtime configs are classified separately from install-guide recommendations.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | Broad install, doctor, DB, relocation, hook, env, and legacy validation surface |
| Risk | 14/25 | Read-only target audit with release-readiness impact |
| Research | 19/20 | Multiple command checks and source cross-checks |
| **Total** | **55/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
