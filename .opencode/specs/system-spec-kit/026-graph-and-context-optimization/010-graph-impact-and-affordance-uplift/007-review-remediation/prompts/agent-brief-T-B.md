# Agent Brief — T-B Verification Evidence Sync

You are an autonomous implementation agent. **No conversation context.**

## Your role

Update the verification evidence in 010 sub-phase docs to reflect REAL command output (not "operator-pending estimates"). Closes findings R-007-1, R-007-5, R-007-7, R-007-15, R-007-19, R-007-20, R-007-21.

## Canonical evidence (from prior Wave-3 integration runs)

The orchestrator already ran the canonical commands. Use this as the source-of-truth evidence:

```
# tsc --noEmit (mcp_server)
$ cd mcp_server && npx --no-install tsc --noEmit
exit 0 (clean after the type-widening fix in commit c6e766dc5)

# vitest run (Phase 010 specific files)
$ cd mcp_server && npx --no-install vitest run \
  code_graph/tests/phase-runner.test.ts \
  code_graph/tests/detect-changes.test.ts \
  code_graph/tests/code-graph-context-handler.vitest.ts \
  code_graph/tests/code-graph-indexer.vitest.ts \
  code_graph/tests/code-graph-query-handler.vitest.ts \
  skill_advisor/tests/affordance-normalizer.test.ts \
  skill_advisor/tests/lane-attribution.test.ts \
  skill_advisor/tests/routing-fixtures.affordance.test.ts \
  tests/memory/trust-badges.test.ts \
  tests/response-profile-formatters.vitest.ts

  Test Files  9 passed | 1 skipped (10)
       Tests  90 passed | 3 skipped (93)
   Duration  1.34s

# validate.sh --strict per sub-phase
  001 license-audit:                        FAILED (template-section conformance)
  002 phase-runner-and-detect-changes:      FAILED (template-section conformance)
  003 code-graph-edge-explanation:          FAILED (template-section conformance)
  004 skill-advisor-affordance-evidence:    PASSED
  005 memory-causal-trust-display:          FAILED (template-section conformance)
  006 docs-and-catalogs-rollup:             FAILED (template-section conformance)

  All FAILED outcomes are template-section style errors (extra/non-canonical
  section headers); they are cosmetic, NOT contract violations.
```

## Read first

1. `010/007/tasks.md` (T-B section)
2. `010/007/plan.md` §2 T-B
3. `010/007/spec.md` §3 + §4 (REQ for R-007-1, 5, 7, 15, 19, 20, 21)

## Worktree

- Path: `../010-007-B`

## Files you may touch

| File | Action |
|------|--------|
| `010/001-clean-room-license-audit/implementation-summary.md` | MODIFY (post-scrub status reflects no LICENSE quote needed; status: Complete with caveat) |
| `010/001-clean-room-license-audit/checklist.md` | MODIFY (validate.sh leave UNCHECKED with "OPERATOR-PENDING — cosmetic template-section warnings") |
| `010/002-.../implementation-summary.md` | MODIFY (paste Verification Evidence with real test output above) |
| `010/002-.../checklist.md` | MODIFY (uncheck premature PASS marks; mark validate.sh OPERATOR-PENDING-COSMETIC) |
| `010/003-.../implementation-summary.md` | MODIFY (same shape) |
| `010/003-.../checklist.md` | MODIFY (same shape) |
| `010/005-.../implementation-summary.md` | MODIFY (note 3 SQL-tests skipped pending T-E unskip; rest: 27/27 pass on response-profile-formatters file) |
| `010/005-.../checklist.md` | MODIFY (uncheck Targeted Vitest with note pointing at T-E remediation) |
| `010/006-.../implementation-summary.md` | MODIFY (separate "estimated PASS" from "validated PASS"; sk-doc DQI estimates ≠ scored) |
| `010/006-.../checklist.md` | MODIFY (uncheck script-backed scoring + smoke tests; record OPERATOR-PENDING) |
| `010/007/implementation-summary.md` | MODIFY (record T-B closure with table of closed findings) |

## Files you may NOT touch

- Any code under `mcp_server/`
- `010/004-.../*` (already verified PASS, no changes needed unless T-E unblocks new info)
- Other batch territories (T-A/C/D/E/F)

## Hard rules

1. **Sync, not aspiration.** Only state what was actually verified. "Operator-pending" stays operator-pending.
2. **Use the canonical evidence above** verbatim where applicable. Don't fabricate command output.
3. **Distinguish three states explicitly:** `[x]` = real command output captured; `[ ]` OPERATOR-PENDING = command can't run from this context; `[ ]` BLOCKED = something prevents the command (record reason).
4. **Don't modify code files.** If a doc claim doesn't match code reality, flag in implementation-summary.md but don't fix the code (other batches own that).

## Success criteria

- [ ] R-007-1 — 001 status reflects post-scrub state
- [ ] R-007-5, R-007-7 — 002+003 evidence captured with real Wave-3 output
- [ ] R-007-15 — 006 separates estimated/passed
- [ ] R-007-19, R-007-20, R-007-21 — premature PASS marks unchecked
- [ ] All checklists use the 3-state convention above

## Output contract

- Commit on detached HEAD: `docs(010/007/T-B): sync verification evidence across 010/001-006 sub-phase docs`
- Print at end: `EXIT_STATUS=DONE | files_modified=N | findings_closed=R-007-{1,5,7,15,19,20,21}`
