---
title: "Implementation Plan: Pre-Existing Test Failure Remediation"
description: "Apply minimal scoped fixes to 4 vitest assertions and 2 leftover kebab-case literals (incomplete commit 7dfd108 rename); verify each test goes green individually, run full unit + stress suites, and commit one batch to main."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
trigger_phrases:
  - "remediation plan"
  - "test fix sequence"
  - "skill_advisor rename completion"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/047-pre-existing-test-failure-remediation"
    last_updated_at: "2026-05-01T04:14:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Plan drafted with 5-step fix sequence"
    next_safe_action: "Execute fixes per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "047-test-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Pre-Existing Test Failure Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (vitest) + Python 3 |
| **Framework** | Vitest, custom skill_advisor |
| **Storage** | SQLite (skill-graph) + JSONL fixtures |
| **Testing** | vitest (unit + stress) |

### Overview
Five tests reproduce on clean main. Diagnosis: 4 are content-drift (test asserts pre-reduction values; reality was deliberately downsized in packet 040 and the deep-review remediation program); 1 is product code with a 2-line incomplete-rename leftover from commit `7dfd108`. Fix: update the 4 test assertions and 2 product-code literals; clean 3 stale entries in `sk-code/graph-metadata.json` for REQ-005.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All 5 failures reproduced on clean main
- [x] Root cause for each identified with git history evidence
- [x] Fix scope minimized (no refactoring)

### Definition of Done
- [ ] All 5 listed tests pass individually
- [ ] Full unit suite has no NEW failures
- [ ] Stress suite still 56/56 / 159/159
- [ ] `validate.sh --strict` exits 0
- [ ] Single commit pushed to origin main
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical edit — no architecture change. Each failure has a single root cause and a single targeted fix.

### Key Components
- **manual_testing_playbook**: Reduced from 42→4 scenarios in packet 040 (T-051 reclassification)
- **labeled-prompts.jsonl**: Reduced 200→197 in packet 040 (mcp-clickup row removal)
- **plugin_bridges/spec-kit-skill-advisor-bridge.mjs**: Refactored in deep-review program to read from `compat-contract.json`
- **skill_graph_compiler.py + skill_advisor.py**: Hold leftover kebab-case literals from commit `7dfd108`

### Data Flow
Tests → invoke product → assert against expected. Currently expected values are stale; product reality is the source of truth.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Spec folder scaffolded at packet 047
- [x] Per-failure root cause documented
- [x] On `main` branch (no feature branch)

### Phase 2: Core Implementation
- [ ] Fix `manual-testing-playbook.vitest.ts` (42→4, 9→3)
- [ ] Fix `advisor-corpus-parity.vitest.ts` (200→197)
- [ ] Fix `plugin-bridge.vitest.ts` (assert via contract values)
- [ ] Fix `advisor-graph-health.vitest.ts` graph_only expectation
- [ ] Finish snake_case rename in 2 product files
- [ ] Clean 3 stale paths in sk-code graph-metadata

### Phase 3: Verification
- [ ] Each of 5 tests run individually → green
- [ ] Full vitest unit run → no NEW failures
- [ ] `npm run stress` → exit 0, 56/56 / 159/159
- [ ] `validate.sh --strict` on packet 047 → exit 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (per-test) | Each of 5 listed tests | `npx vitest run <file>` |
| Unit (full) | Full vitest suite | `npm run test` |
| Stress | Full stress suite | `npm run stress` |
| Validator | Spec packet | `validate.sh --strict` |
| Health | skill_advisor inventory parity | `python3 skill_advisor.py --health` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Vitest | External | Green | Cannot run tests |
| Python 3 | External | Green | Cannot run advisor |
| sqlite skill-graph | Internal | Green | Inventory parity wrong reading |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Stress suite regression OR new vitest failures introduced by these edits
- **Procedure**: `git revert` the single commit; revert is safe because all changes are isolated to the listed files
<!-- /ANCHOR:rollback -->

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (diagnosis, done) ──► Phase 2 (apply fixes) ──► Phase 3 (verify) ──► commit
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Diagnosis | None | Apply |
| Apply fixes | Diagnosis | Verify |
| Verify | Apply | Commit |
| Commit | Verify | None |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Diagnosis | Med | done |
| Apply fixes | Low | 20-30 min |
| Verify | Low | 5-10 min |
| **Total** | | **~35 min** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Diagnosis evidence captured in spec
- [ ] Targeted test runs green pre-commit
- [ ] No untracked unrelated changes staged

### Rollback Procedure
1. `git revert <commit-sha>` — single-commit revert restores prior failing state
2. `npm run stress` and full unit suite to confirm only the 5 known failures return
3. No data migration; no flag toggles

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
