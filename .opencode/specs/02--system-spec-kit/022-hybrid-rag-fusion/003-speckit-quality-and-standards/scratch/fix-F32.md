# F32 Fix Report

## Completed
- Removed `@ts-nocheck` from the assigned D-F Vitest files in this partition.
- Replaced unsafe `any` usages with concrete test-local types (`DatabaseLike`, `InstanceType<typeof Database>`, typed row shapes, `ScoringInput`, and derived `ReturnType` / `Parameters` aliases).
- Added `catch (err: unknown)` narrowing and explicit `MemoryError` guards where the tests inspect thrown values.
- Added `// @ts-expect-error Testing invalid input shape` only where the test intentionally exercises invalid runtime inputs.
- Corrected test-only type mismatches without changing assertions or behavior (typed IDs, typed nullable DB mocks, proper cache-staleness argument shape, and runtime-safe FSRS module loading in the calibration test).

## Validation
- Targeted TypeScript diagnostics for all assigned files: `TOTAL 0`.
- Targeted Vitest run passed for the touched high-risk files in this partition, including the follow-up rerun of `tests/feature-eval-scoring-calibration.vitest.ts`.
- Alignment verifier passed: `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/mcp_server/tests`.

## Skipped
- None.
