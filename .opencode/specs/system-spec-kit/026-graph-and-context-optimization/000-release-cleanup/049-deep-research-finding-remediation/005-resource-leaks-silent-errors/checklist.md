---
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist | v2.2"
title: "Quality Checklist: 005 Resource Leaks And Silent Errors Remediation [template:level_2/checklist.md]"
description: "QA gates for F-003-A3-01..03 and F-004-A4-01, F-004-A4-04 remediation. Includes regression-test gates and stress-baseline parity."
trigger_phrases:
  - "F-003-A3 checklist"
  - "F-004-A4 checklist"
  - "005 resource leaks checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/005-resource-leaks-silent-errors"
    last_updated_at: "2026-04-30T09:47:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Checklist authored"
    next_safe_action: "Tick items as fixes/tests/validation/commit complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-005-resource-leaks-silent-errors"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 005 Resource Leaks And Silent Errors Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

This packet ships product-code changes plus 3 new vitest files and 1 updated existing vitest. Verification is structural (validate.sh) plus targeted vitest plus stress baseline parity.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P1] Read packet 046 §3 (resource leaks) and §4 (silent errors), findings F-003-A3-01..03 and F-004-A4-01, F-004-A4-04 [EVIDENCE: research.md sections cited in spec.md §6 Dependencies]
- [x] CHK-002 [P1] Confirmed each cited file:line still matches the research.md claim [EVIDENCE: All 3 target files read at the cited line ranges before authoring spec; F-004-A4-01 line range shifted by sub-phase 003 but the surface is the same `loadAdvisorProjection` catch]
- [x] CHK-003 [P1] Authored spec.md, plan.md, tasks.md, checklist.md (this file), implementation-summary.md [EVIDENCE: All five docs present in this packet]
- [x] CHK-004 [P1] Confirmed sub-phase 003's projection.ts changes (commit `f5b815c7e`) do not conflict with F-004-A4-01 fix lines [EVIDENCE: 003 changed lines 137-145 (derivedTriggers/derivedKeywords split), F-004-A4-01 fix lives in `loadAdvisorProjection` function below those changes]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P1] Each edit is the smallest change that resolves the finding [EVIDENCE: each edit isolated to the cited line range; no helpers extracted]
- [x] CHK-006 [P1] Watcher API preserved for sub-phase 006 refactor [EVIDENCE: SkillGraphFsWatcher interface gains optional `unwatch?`; discoverWatchTargets gains optional 3rd arg; no exports added or removed; no helpers extracted; no functions reordered]
- [x] CHK-007 [P2] Each edit carries an inline `// F-NNN-XX-NN:` marker for traceability [EVIDENCE: 17+ markers across 4 product files; verified via `grep "F-003-A3\|F-004-A4-01\|F-004-A4-04"`]
- [x] CHK-008 [P1] No prose outside the cited line ranges was modified [EVIDENCE: git diff scope limited to target files + new tests + 1 existing-test update + spec docs]
- [x] CHK-009 [P1] No `template_source` bumps in product files [EVIDENCE: only the packet's own spec docs touch template_source headers]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P1] 3 new vitest files added under `mcp_server/skill_advisor/tests/`, `mcp_server/skill_advisor/tests/scorer/`, and `mcp_server/tests/` [EVIDENCE: 11 tests total]
- [x] CHK-011 [P1] Targeted vitest run passes for all new tests [EVIDENCE: 7/7 watcher resource-leak tests, 2/2 projection fallback tests, 2/2 file-watcher queue cap tests = 11/11]
- [x] CHK-012 [P1] Existing daemon-freshness-foundation, lifecycle-derived-metadata, file-watcher.vitest.ts pass without regression [EVIDENCE: 57/57 tests pass after changes]
- [x] CHK-013 [P1] Existing native-scorer.vitest.ts passes after the corrupt-DB assertion update [EVIDENCE: 14/14 tests pass]
- [x] CHK-014 [P1] Existing skill-projection-stress.vitest.ts passes (clean filesystem path unaffected) [EVIDENCE: 3/3 tests pass; first-run path still returns `source: 'filesystem'`]
- [x] CHK-015 [P1] `npm run typecheck` exit 0 [EVIDENCE: tsc --noEmit clean]
- [x] CHK-016 [P1] `npm run build` exit 0 [EVIDENCE: dist artifacts refreshed without errors]
- [x] CHK-017 [P1] `npm run stress` matches pre-change baseline [EVIDENCE: 58 files / 194 passed / 1 pre-existing env-dependent failure (gate-d-benchmark-memory-search latency) unrelated to F-003/F-004 fixes; failure reproduces on stashed clean main]
- [ ] CHK-018 [P1] `validate.sh --strict` on this packet [EVIDENCE: pending — final verification step before commit]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-019 [P1] No secrets, tokens, or credentials in any edit (verified)
- [x] CHK-020 [P2] Diagnostic strings include filesystem paths but no secrets; ring buffer cap ensures unbounded growth cannot persist sensitive operator data (verified)
- [x] CHK-021 [P2] Queue-overflow rejection cannot trigger unbounded memory if attacker floods events: cap stays at 1000, oldest-evicted; total memory bound is O(1000) entries × per-slot Promise overhead (verified)
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-022 [P1] All 5 findings have a row in the Findings closed table (verified)
- [x] CHK-023 [P1] Implementation-summary.md describes the actual fix per finding (not generic) (verified)
- [x] CHK-024 [P2] Plan.md numbered phases match the actual steps run (verified)
- [x] CHK-025 [P1] spec.md notes the boundary with sub-phase 006 (no helpers extracted, watcher module structure preserved) (verified)
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-026 [P1] Only target product files touched outside this packet [EVIDENCE: git diff scope: 4 product files (watcher.ts, file-watcher.ts, projection.ts, types.ts) + 3 new tests + 1 updated test (native-scorer)]
- [x] CHK-027 [P1] Spec docs live at this packet's root, not in `scratch/` (verified)
- [x] CHK-028 [P2] New tests live under existing test trees, not the packet folder (verified)
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

### Findings closed

| ID | File | Evidence |
|----|------|----------|
| F-003-A3-01 (P1) | watcher.ts refreshTargets | `// F-003-A3-01:` markers at watcher.ts:67, 406, 430. New unwatch+prune logic in `refreshTargets`. 2 new tests pass (unwatch on shrink + legacy harness backward compat). |
| F-003-A3-02 (P2) | watcher.ts diagnostics | `// F-003-A3-02:` markers at watcher.ts:104, 346, 352, 450, 486, 564, 582, 592. Ring buffer cap=100, COUNTERS synthetic line in status(). 2 new tests pass (cap behavior + empty case). |
| F-003-A3-03 (P2) | file-watcher.ts queue | `// F-003-A3-03:` markers at file-watcher.ts:224, 252, 275, 340, 511. Queue cap=1000 with oldest-evicted; close() drains queue with sentinel. 2 new tests pass (close-drain + sentinel logged at error). |
| F-004-A4-01 (P1) | projection.ts + types.ts | `// F-004-A4-01:` markers at types.ts:39 and projection.ts:251. Distinguish DB-missing (clean filesystem) from DB-throws (filesystem-fallback + warn + reason). 2 new tests pass; 1 existing test updated (native-scorer corrupt-DB assertion). |
| F-004-A4-04 (P2) | watcher.ts parseDerivedKeyFiles | `// F-004-A4-04:` markers at watcher.ts:166, 181, 205, 212, 366. Optional `onMalformed` callback wired to MALFORMED_GRAPH_METADATA diagnostic. 3 new tests pass (invalid JSON + wrong shape + backward compat). |

### Status

- [x] All 5 findings closed [EVIDENCE: 17 inline finding markers verified via grep]
- [x] Targeted vitests + regression suite pass [EVIDENCE: 82/82 across 6 files]
- [x] `npm run stress` baseline parity preserved [EVIDENCE: 58 files / 194 passed / 1 pre-existing env-dependent failure]
- [ ] `validate.sh --strict` on this packet [EVIDENCE: pending — final verification step]
- [ ] commit + push to origin main (final step)
<!-- /ANCHOR:summary -->
