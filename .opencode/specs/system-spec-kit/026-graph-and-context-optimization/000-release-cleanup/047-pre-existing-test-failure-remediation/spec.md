---
title: "Feature Specification: Pre-Existing Test Failure Remediation"
description: "Five spec-kit MCP server unit tests have been failing since packets 040 and 7dfd108 — the failures are content-drift (playbook downsized, corpus reduced) plus two leftover kebab-case literals from an incomplete snake_case rename. Fix all five so the unit suite is green."
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
trigger_phrases:
  - "test failure remediation"
  - "advisor health degraded"
  - "manual playbook scenarios"
  - "labeled prompts corpus"
  - "skill_advisor kebab snake"
  - "plugin bridge constants"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/047-pre-existing-test-failure-remediation"
    last_updated_at: "2026-05-01T04:14:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Diagnosed all 5 failures — 4 test-out-of-sync, 1 product cleanup (incomplete rename)"
    next_safe_action: "Apply minimal fixes to test files + 2 stale kebab literals, verify green, commit"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/manual-testing-playbook.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-corpus-parity.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-graph-health.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/compat/plugin-bridge.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py"
      - ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py"
      - ".opencode/skill/sk-code/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "047-test-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Pre-Existing Test Failure Remediation

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
| **Branch** | `main` (no branch — `--skip-branch`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Five vitest unit tests in the spec-kit MCP server have been failing since packets 040 (sk-doc conformance sweep) and commit `7dfd108` (skill_id rename). The failures were observed during packet 045 work and confirmed unrelated via `git stash`. Most are test-out-of-sync issues from intentional content reduction; two are caused by an incomplete snake_case rename (commit `7dfd108` updated `graph-metadata.json` but missed two kebab-case literals).

### Purpose
Bring all five tests green via minimal, scoped fixes — update test assertions to match deliberately-reduced reality (4 cases) and finish the snake_case rename in two leftover code sites (1 case).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update `manual-testing-playbook.vitest.ts` to match the live 4-scenario / 3-category playbook (was 42/9)
- Update `advisor-corpus-parity.vitest.ts` to expect 197 corpus rows (was 200; 3 mcp-clickup rows removed in packet 040)
- Update `plugin-bridge.vitest.ts` to assert against `compat-contract.json` defaults instead of inline string literals
- Update `advisor-graph-health.vitest.ts` `graph_only` expectation from `['skill-advisor']` to `['skill_advisor']`
- Finish the `skill-advisor` → `skill_advisor` snake_case rename in two product files (compiler + advisor.py)
- Clean three stale entries in `sk-code/graph-metadata.json` (`changelog/v1.3.0.0.md` → `v3.0.0.0.md`; remove `assets/nextjs` and `assets/go` directories from `key_files` since validator requires files)

### Out of Scope
- New test coverage — this is a remediation packet
- Any product changes beyond completing the documented snake_case rename
- Refactoring — minimal edits only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/skill_advisor/tests/manual-testing-playbook.vitest.ts` | Modify | 42→4 scenarios, 9→3 groups, drop 24-scenario regression assertion |
| `mcp_server/skill_advisor/tests/legacy/advisor-corpus-parity.vitest.ts` | Modify | `toHaveLength(200)` → `toHaveLength(197)` and rename describe |
| `mcp_server/skill_advisor/tests/legacy/advisor-graph-health.vitest.ts` | Modify | `['skill-advisor']` → `['skill_advisor']` |
| `mcp_server/skill_advisor/tests/compat/plugin-bridge.vitest.ts` | Modify | Assert against contract values, not inline string match |
| `mcp_server/skill_advisor/scripts/skill_graph_compiler.py` | Modify (1 line) | Hardcoded `("skill-advisor", ...)` → `("skill_advisor", ...)` |
| `mcp_server/skill_advisor/scripts/skill_advisor.py` | Modify (1 line) | `GRAPH_ONLY_SKILL_IDS = {"skill-advisor"}` → `{"skill_advisor"}` |
| `.opencode/skill/sk-code/graph-metadata.json` | Modify | Update `v1.3.0.0.md` → `v3.0.0.0.md`; remove 2 directory entries from `key_files` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 5 listed tests pass when run individually | Each `npx vitest run <file>` exits 0 with no failures |
| REQ-002 | Full unit suite has no new regressions | `npm run test` shows only pre-existing unrelated failures (if any), documented |
| REQ-003 | Stress suite still 56/56 / 159/159 | `npm run stress` exits 0 with no test count drop |
| REQ-004 | Packet validates strict | `validate.sh --strict` exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | sk-code graph-metadata path errors cleared | `python3 skill_graph_compiler.py --validate-only` reports no `key_files`/`source_docs` errors for sk-code |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 5 test failures listed in packet brief reduced to 0
- **SC-002**: No product behavior change beyond the documented incomplete-rename completion
- **SC-003**: Single commit pushed to `origin main` describing each fix

### Acceptance Scenarios

- **Given** the playbook has 4 scenarios across 3 categories, **When** `npx vitest run manual-testing-playbook.vitest.ts` is executed, **Then** it exits 0 with all assertions passing.
- **Given** the labeled corpus has 197 rows, **When** `npx vitest run advisor-corpus-parity.vitest.ts` is executed, **Then** the parity check completes and exits 0.
- **Given** the bridge reads defaults from `compat-contract.json`, **When** `npx vitest run plugin-bridge.vitest.ts` is executed, **Then** all 5 sub-tests pass including the rendering uncertainty assertion.
- **Given** the snake_case rename is fully completed, **When** `npx vitest run advisor-graph-health.vitest.ts` is executed, **Then** `inventory_parity.in_sync` is `true` and `graph_only` equals `["skill_advisor"]`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Touching `skill_advisor.py` could affect runtime behavior | Med | Single-line set literal change; verify health check returns `ok` post-fix |
| Risk | Stress suite regression from compiler change | Med | Run full stress after change |
| Dependency | Both `compiler.py` and `advisor.py` must be in sync | High | Fix both in same commit |
<!-- /ANCHOR:risks -->

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No measurable runtime impact (changes are literal-string and JSON metadata only)

### Reliability
- **NFR-R01**: Inventory parity must report `in_sync: true` after fix

---

## L2: EDGE CASES

### Data Boundaries
- skill-graph DB may still cache the old `skill-advisor` id — `advisor_rebuild` may be needed; verify health check post-fix
- If `--validate-only` returns non-zero exit due to other unrelated errors (e.g., other skills with stale paths), document as out-of-scope

---

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 7 files, ~10 lines of effective change |
| Risk | 6/25 | One product code path (advisor health check), mitigated by direct test |
| Research | 4/20 | Root causes identified via git history |
| **Total** | **18/70** | **Level 2** |

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

(none — all root causes identified)
<!-- /ANCHOR:questions -->
