---
title: "Plan: P1 + P2 Stress-Test Remediation"
description: "Four cli-codex synthesis batches produce stress tests for 36 P1+P2 features; full npm run stress validates green; 042 matrix is cross-updated."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
trigger_phrases:
  - "044-p1-p2-stress-remediation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/044-p1-p2-stress-remediation"
    last_updated_at: "2026-04-30T19:25:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan authored"
    next_safe_action: "Dispatch cli-codex Batch P1"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "044-plan-init"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---

# Plan: P1 + P2 Stress-Test Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (vitest) |
| **Framework** | Vitest 4.x with `vitest.stress.config.ts` |
| **Storage** | Filesystem (temp dirs) |
| **Testing** | The packet IS testing |

### Overview
Four cli-codex high-reasoning batches produce stress tests for 36 features (6 P1 + 30 P2) across `code_graph` and `skill_advisor`. Consolidation allowed where natural. All new tests must pass under `npm run stress`. After completion, 042's matrix is cross-updated and a comprehensive stress-test synthesis report covers every file under `stress_test/`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Packet 042's matrix has accurate P1/P2 inventory
- [x] Packet 043 closed P0 gaps; pattern proven
- [x] cli-codex verified working

### Definition of Done
- [ ] All P1/P2 rows in 042 matrix closed (gap_classification=none)
- [ ] `npm run stress` exit 0
- [ ] `validate.sh --strict` exit 0 for 044 and 042
- [ ] Stress-test synthesis report produced
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Test packet — synthesis (cli-codex × 4) → run validation → cross-packet update → synthesis report → finalize.

### Key Components
- **Batch P1** (gpt-5.5 high) — 6 P1 tests
- **Batch P2-cg** (gpt-5.5 high) — 10 code_graph P2 tests (consolidate CCC trio + deep-loop trio where natural)
- **Batch P2-sa-A** (gpt-5.5 high) — 9 skill_advisor auto-indexing/lifecycle P2 tests
- **Batch P2-sa-B** (gpt-5.5 high) — 11 skill_advisor MCP/hooks/python P2 tests (consolidate hooks quartet)
- **`npm run stress`** — full suite verification
- **042 cross-update** — Python script on coverage-matrix.csv + edit on coverage-audit.md
- **Synthesis report** — comprehensive coverage summary

### Data Flow
```
P1 + P2 inventory (36 features)
   |
   +-> Batch P1 (high)
   +-> Batch P2-cg (high)
   +-> Batch P2-sa-A (high)
   +-> Batch P2-sa-B (high)
                    |
                    v
       New stress test files (~20-25 with consolidation)
                    |
                    v
             npm run stress -> green
                    |
                    v
       042 matrix + audit cross-update
                    |
                    v
       Synthesis report (every stress_test/ file)
                    |
                    v
       validate.sh --strict + memory:save + commit + push
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold packet 044
- [x] Author spec/plan/tasks/checklist

### Phase 2: Test Generation
- [ ] Dispatch Batch P1 — 6 P1 tests
- [ ] Dispatch Batch P2-cg — 10 cg P2 tests
- [ ] Dispatch Batch P2-sa-A — 9 sa P2 tests
- [ ] Dispatch Batch P2-sa-B — 11 sa P2 tests

### Phase 3: Verification
- [ ] Run `npm run stress`; verify green; capture log
- [ ] Update 042 matrix for all 36 ids (gap_classification=none)
- [ ] Update 042 audit §4.2 "Closed by 044"

### Phase 4: Synthesis Report
- [ ] cli-codex (medium) produces stress-test synthesis report covering every file under `stress_test/` with kind/axis/result

### Phase 5: Finalize
- [ ] Fill 044 implementation-summary.md
- [ ] generate-context.js for 044
- [ ] validate.sh --strict for 044 and 042
- [ ] commit + push
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Outputs | Stress tests | Vitest 4.x |
| Validation | Packet shape | `validate.sh --strict` |
| Synthesis | Report covers every file | Manual review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex (`gpt-5.5`) | External | Green | All batches blocked |
| `mcp_server/code_graph/` and `mcp_server/skill_advisor/` source | Internal | Green | Tests cannot import |
| `ccc` binary | Optional | Conditional | cg-014..016 emit it.skip if absent |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Multiple new tests reveal real product bugs
- **Procedure**: Move failing tests to `quarantine/`; document in summary; do NOT modify product code
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup, done) -> Phase 2 (Generate, 4 batches) -> Phase 3 (Verify) -> Phase 4 (Synthesis) -> Phase 5 (Finalize)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Setup | — | 2 |
| 2 Generate | 1 | 3 |
| 3 Verify | 2 | 4 |
| 4 Synthesis | 3 | 5 |
| 5 Finalize | 4 | — |

Batches in Phase 2 dispatch sequentially.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 1 Setup | Low | 15 min (done) |
| 2 Generate (4 batches) | High | 60-120 min wall-clock |
| 3 Verify | Medium | 10-20 min |
| 4 Synthesis | Medium | 15 min |
| 5 Finalize | Low | 15 min |
| **Total** | | **~115-185 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Test files glob already covers new stress files
- [x] No CI changes
- [x] No backups needed

### Rollback Procedure
1. Move failing test(s) to `quarantine/`
2. Re-run `npm run stress` to confirm green
3. Document quarantine in summary
4. No product-code rollback needed

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
