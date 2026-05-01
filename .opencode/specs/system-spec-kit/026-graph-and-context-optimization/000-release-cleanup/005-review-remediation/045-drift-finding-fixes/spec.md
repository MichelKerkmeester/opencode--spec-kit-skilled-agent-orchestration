---
title: "Spec: Drift Finding Fixes (4 catalog/code divergences)"
description: "Fix 4 drift findings surfaced by packets 042-044: sa-011 non-idempotent derived sync (real bug), sa-004 corruption recovery (test correction), sa-036 catalog count drift, sa-037 bench wording."
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
trigger_phrases:
  - "045-drift-finding-fixes spec"
  - "drift finding remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/045-drift-finding-fixes"
    last_updated_at: "2026-05-01T05:40:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Spec authored"
    next_safe_action: "Validate strict and commit"
    blockers: []
    key_files:
      - "../../../../../skill/system-spec-kit/mcp_server/skill_advisor/lib/derived/extract.ts"
      - "../../../../../skill/system-spec-kit/mcp_server/skill_advisor/lib/derived/sync.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "045-spec-init"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---

# Spec: Drift Finding Fixes

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
| **Created** | 2026-05-01 |
| **Branch** | `main` (skip-branch) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packets 042-044 surfaced 4 drift findings between the feature catalogs and product code, all flagged with `FIXME(<feature_id>)` markers in stress tests. One was a real bug (sa-011 non-idempotent derived sync), one a misread (sa-004 — catalog accommodates current behavior), one catalog drift (sa-036 — catalog says 52, fixture has 51), and one wording ambiguity (sa-037 — design ceiling vs measurement claimed as enforceable).

### Purpose
Fix the real bug (sa-011), update the catalog text to match reality (sa-036, sa-037), and tighten the FIXME-tagged tests to assert correct behavior without weakening assertions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (4 fixes)

| Finding | Type | Files modified |
|---------|------|----------------|
| sa-011 | **Real bug** | `mcp_server/skill_advisor/lib/derived/extract.ts`, `mcp_server/skill_advisor/lib/derived/sync.ts`, test in `tests/lifecycle-derived-metadata.vitest.ts` |
| sa-004 | Test correction (no bug) | `mcp_server/stress_test/skill-advisor/generation-snapshot-stress.vitest.ts` |
| sa-036 | Catalog drift | `mcp_server/skill_advisor/feature_catalog/08--python-compat/02-regression-suite.md` |
| sa-037 | Catalog wording | `mcp_server/skill_advisor/feature_catalog/08--python-compat/03-bench-runner.md`, test in `mcp_server/stress_test/skill-advisor/python-bench-runner-stress.vitest.ts` |

### Out of Scope
- Other product code changes
- Other catalog edits
- Adding new tests
- Refactoring around the drift findings
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | sa-011: `syncDerivedMetadata` is idempotent — second call on unchanged SKILL.md returns `changed=false` | Stress test `auto-indexing-derived-sync-stress.vitest.ts` passes its updated assertion `expect(secondPass.every(r => r.changed === false)).toBe(true)` |
| REQ-002 | sa-004: stress test no longer carries a FIXME and asserts the catalog-documented behavior | grep FIXME in `generation-snapshot-stress.vitest.ts` returns 0 |
| REQ-003 | sa-036: catalog count matches fixture line count | `wc -l` of `skill_advisor_regression_cases.jsonl` == count claimed in catalog |
| REQ-004 | sa-037: catalog clarifies 50/60ms are design ceilings; test no longer carries FIXME | grep FIXME in `python-bench-runner-stress.vitest.ts` returns 0; catalog mentions "design envelope" |
| REQ-005 | All existing tests still pass; 56-file 159-test stress suite stays green | `npm run stress` exit 0; pre-existing unit test failures unrelated |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The unit test `lifecycle-derived-metadata.vitest.ts` passes after extract.ts changes | 16/16 pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero `FIXME(sa-*)` markers in stress test files after this packet
- **SC-002**: `npm run stress` exit 0; 56 files, 159 tests still passing
- **SC-003**: Catalog wording matches reality for sa-036 and sa-037
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | sa-011 fix changes derived metadata extraction → breaks downstream consumers | Unit/stress regressions | Verified: lifecycle-derived 16/16 pass; full stress 56/56 pass; pre-existing failures unrelated |
| Risk | Pre-existing unit test failures get attributed to this packet | Confusion in PR review | Documented in §7; reproduced on `git stash` of these changes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: sa-011 fix preserves on-disk byte stability across syncs (no rewrite when content unchanged)

### Maintainability
- **NFR-M01**: Inline comments at the fix sites explain WHY the change is necessary and what regression it prevents
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### sa-011 idempotence
- First sync writes derived block (changed=true)
- Second sync with same SKILL.md reports changed=false (no rewrite)
- Sync after SKILL.md content change reports changed=true again
- prior derived's source_docs/key_files preserved in output (sticky), not in trigger/keyword buckets
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 4 small surgical fixes, 2 product code + 2 docs |
| Risk | 12/25 | Product code change in extract.ts touches central derived metadata pipeline |
| Research | 10/20 | Explore agent mapped surfaces; targeted vitest debug confirmed root cause |
| **Total** | **30/70** | **Level 2 — verification-focused** |
<!-- /ANCHOR:complexity -->

---

## L2: ACCEPTANCE SCENARIOS

### AS-001: sa-011 second-call idempotence

- **Given** a sync of an unchanged SKILL.md
- **When** `syncDerivedMetadata` is called twice with the same `now`
- **Then** the first call reports `changed=true` and the second reports `changed=false`

### AS-002: sa-011 stable on-disk state

- **Given** repeated syncs of the same SKILL.md
- **When** I read `graph-metadata.json` after each call
- **Then** the file contents are byte-stable (no churn from derived block rewriting)

### AS-003: sa-004 catalog conformance

- **Given** a corrupted generation counter and a writable filesystem
- **When** `readAdvisorGeneration` runs
- **Then** the result has `status='recovered'`, `recoveryPath='regenerate'`, `reason='GENERATION_COUNTER_RECOVERED'` (per catalog 04-generation.md §2)

### AS-004: sa-036 count match

- **Given** the regression suite catalog and the fixture JSONL
- **When** I count fixture lines and read the catalog claim
- **Then** they match (51 == 51)

### AS-005: sa-037 catalog wording

- **Given** the bench runner catalog
- **When** I grep for "design envelope" / "design ceilings"
- **Then** the catalog explicitly distinguishes design goals from measurement-as-CI-gate

---

## 7. PRE-EXISTING UNIT TEST FAILURES (NOT INTRODUCED)

The following 5 tests fail on clean main BEFORE this packet's changes. Reproduced via `git stash` of the fixes; same failures observed. They are unrelated to drift findings:
- `mcp_server/skill_advisor/tests/manual-testing-playbook.vitest.ts` — content drift assertion ("42 deterministic manual scenarios")
- `mcp_server/skill_advisor/tests/legacy/advisor-corpus-parity.vitest.ts` — file-content drift
- `mcp_server/skill_advisor/tests/legacy/advisor-graph-health.vitest.ts` (2 failures) — workspace state-dependent counts
- `mcp_server/skill_advisor/tests/compat/plugin-bridge.vitest.ts` — health degraded vs ok

These are tracked separately and do not block this packet's release.

---

## 10. OPEN QUESTIONS

- None at scaffold time.
<!-- /ANCHOR:questions -->

---
