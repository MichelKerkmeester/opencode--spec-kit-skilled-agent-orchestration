# Deep Review Strategy — Packet 011 Pass 2 (Wave-1 Remediation Verification)

## Review Target
Wave-1 remediation patches that landed after pass-1 verdict FAIL.

## Pass 1 Context
- Verdict: FAIL — 2 P0s blocked release
- 42 findings total (2 P0, 18 P1, 22 P2)
- Pass 1 artifacts: `../review/` (iterations 001-007, findings registry, review-report.md)

## Wave-1 Patches Under Review
1. **P0-001 fix**: `lib/search/vector-index-mutations.ts` + `post-insert-metadata.ts` — constitutional-path guard hoisted to SQL write layer
2. **P0-002 fix**: `lib/storage/checkpoints.ts` — `validateMemoryRow` extended; runs inside barrier-held transaction
3. **Audit gap (P1-008 + P1-016)**: `memory-save.ts` + `memory-crud-update.ts` — `governance_audit` rows emitted on tier transitions
4. **P1-018**: `post-insert-metadata.ts` — `importance_tier` removed from ALLOWED_POST_INSERT_COLUMNS allowlist

## New governance_audit actions
- `tier_downgrade_non_constitutional_path` (decision='conflict')
- `checkpoint_restore_excluded_path_rejected` (decision='deny')

## New tests added by Wave-1
- `tests/memory-crud-update-constitutional-guard.vitest.ts`
- `tests/checkpoint-restore-invariant-enforcement.vitest.ts`
- `tests/memory-save-index-scope.vitest.ts` (extended)

## Pass 2 Dimension Queue
1. correctness — confirm P0-001 + P0-002 ACTUALLY closed in the patched code
2. security — attempt the exploit chain against the patched runtime (conceptual; runtime verification via tests)
3. traceability — do packet docs + review-report remediation-plan map to actual patches?
4. maintainability — do the patches introduce new debt (duplication, missing docs)?
5. regression pass — any pre-existing P1 that was adjacent to Wave-1 patches now broken?
6. exploit-chain validation — walk the end-to-end chain with the patched code; confirm every step now fails
7. synthesis — pass-2 review-report with verdict

## Stopping Criteria
- 7 iterations max (user-specified)
- Verdict = PASS / CONDITIONAL / FAIL
- If pass-2 finds any NEW P0, immediate FAIL

## Scope Files (SAME as pass 1, plus new test files)
See deep-review-config.json reviewScopeFiles — inherit from pass 1.
