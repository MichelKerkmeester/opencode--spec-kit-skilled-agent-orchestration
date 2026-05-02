---
title: "Plan: Stress-Test Gap Remediation"
description: "Three cli-codex synthesis batches produce 10 new stress tests; full npm run stress validates green; packet 042 matrix is cross-updated."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
trigger_phrases:
  - "043-stress-test-gap-remediation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/043-stress-test-gap-remediation"
    last_updated_at: "2026-04-30T18:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan authored"
    next_safe_action: "Dispatch cli-codex Batch A"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "043-plan-init"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---

# Plan: Stress-Test Gap Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (vitest); 1 file is a Python-subprocess wrapper |
| **Framework** | Vitest 4.x with `vitest.stress.config.ts` |
| **Storage** | Filesystem (temp dirs); SQLite for lease/generation state |
| **Testing** | The packet IS testing — outputs are tests |

### Overview
Three cli-codex batches produce 10 new stress tests against `code_graph` and `skill_advisor` source. Tests land under `mcp_server/stress_test/code-graph/` (1) and `mcp_server/stress_test/skill-advisor/` (9). After generation, `npm run stress` shows 38/38 files passing. Packet 042's matrix is cross-updated to mark new direct coverage and downgrade gap classification from P0 to none.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Packet 042's matrix and audit finalized
- [x] Source mapping done by Explore agent
- [x] cli-codex verified working in packet 042

### Definition of Done
- [ ] 10 new `.vitest.ts` files exist
- [ ] `npm run stress` reports `Test Files 38 passed (38)`
- [ ] Each test imports from real product source
- [ ] 042's coverage-matrix.csv updated for all 10 P0 ids
- [ ] 042's coverage-audit.md §4 has "Closed by 043" subsection
- [ ] `validate.sh --strict` exit 0 for packet 043
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Test packet — synthesis (cli-codex) → run validation → cross-packet doc update → finalize.

### Key Components
- **cli-codex Batch A** (gpt-5.5 high) — 6 daemon/freshness tests for skill_advisor (sa-001..sa-005, sa-007)
- **cli-codex Batch B** (gpt-5.5 high) — 3 tests: sa-012 anti-stuffing, sa-013 DF/IDF, cg-012 deep-loop convergence
- **cli-codex Batch C** (gpt-5.5 medium) — sa-037 Python bench wrapper test
- **`npm run stress`** — verifies 10 new files all pass
- **042 cross-update** — Edit/Bash on `coverage-matrix.csv` + `coverage-audit.md`

### Data Flow
```
Packet 042 P0 inventory (10 features)
        |
        +-> cli-codex Batch A (high, 6 tests)
        +-> cli-codex Batch B (high, 3 tests)
        +-> cli-codex Batch C (medium, 1 Python wrapper)
                                          |
                                          v
                       mcp_server/stress_test/{code-graph,skill-advisor}/*.vitest.ts (+10)
                                          |
                                          v
                       npm run stress -> 38/38 passed
                                          |
                                          v
                       042 matrix + audit cross-update
                                          |
                                          v
                       validate.sh --strict + memory:save
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold packet 043 via create.sh
- [x] Remove template README artifact
- [x] Map 10 P0 features to source files (Explore agent)
- [x] Author plan + spec, tasks, checklist

### Phase 2: Test Generation
- [ ] Dispatch cli-codex Batch A (gpt-5.5 high, normal speed) — 6 daemon/freshness tests
- [ ] Dispatch cli-codex Batch B (gpt-5.5 high, normal speed) — 3 tests
- [ ] Dispatch cli-codex Batch C (gpt-5.5 medium, normal speed) — sa-037 Python wrapper

### Phase 3: Verification
- [ ] Confirm 10 new `.vitest.ts` files exist
- [ ] Run `npm run stress 2>&1 | tee logs/stress-run-<utc>.log`
- [ ] Verify 38/38 files pass
- [ ] If any test fails: triage as test-quality (re-dispatch) or product bug (escalate)

### Phase 4: Cross-Packet Update
- [ ] Update 042's coverage-matrix.csv for all 10 P0 ids
- [ ] Update 042's coverage-audit.md §4 with "Closed by 043"
- [ ] Update 042's implementation-summary.md follow-on section

### Phase 5: Finalize
- [ ] Fill 043's implementation-summary.md
- [ ] Run generate-context.js to refresh metadata
- [ ] `validate.sh --strict` for both 042 and 043
- [ ] /memory:save
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Outputs | 10 new vitest stress tests | Vitest 4.x |
| Validation | Packet shape | `validate.sh --strict` |
| Cross-packet check | 042 matrix update | grep / awk |

This packet adds stress tests, not unit tests.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex (`gpt-5.5`, normal speed) | External | Green | Blocks all 3 batches |
| `mcp_server/code_graph/` source | Internal | Green | cg-012 cannot import |
| `mcp_server/skill_advisor/lib/` source | Internal | Green | 9 sa tests cannot import |
| `python3` available | Optional | Conditional | sa-037 emits it.skip |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Multiple new tests reveal real product bugs blocking release
- **Procedure**: Move failing tests to `stress_test/quarantine/` (excluded from glob); document in `implementation-summary.md`; do NOT modify product code; escalate to a product-fix packet
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup, done) -> Phase 2 (Generate) -> Phase 3 (Verify) -> Phase 4 (Cross-update) -> Phase 5 (Finalize)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Setup | — | 2 |
| 2 Generate | 1 | 3 |
| 3 Verify | 2 | 4 |
| 4 Cross-update | 3 (must be green) | 5 |
| 5 Finalize | 4 | — |

Batches A, B, C in Phase 2 dispatch sequentially to avoid workspace-write contention.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 1 Setup | Low | 15 min (done) |
| 2 Generate (3 batches) | High | 30-60 min wall-clock |
| 3 Verify | Medium | 5-10 min |
| 4 Cross-update | Low | 10 min |
| 5 Finalize | Low | 10 min |
| **Total** | | **~70-105 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No backup needed — only new files
- [x] Vitest config glob already covers new files
- [x] No CI changes

### Rollback Procedure
1. Move failing test(s) to `mcp_server/stress_test/quarantine/`
2. Re-run `npm run stress` to confirm green
3. Document quarantine in 043's implementation-summary.md
4. No product-code rollback needed

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
