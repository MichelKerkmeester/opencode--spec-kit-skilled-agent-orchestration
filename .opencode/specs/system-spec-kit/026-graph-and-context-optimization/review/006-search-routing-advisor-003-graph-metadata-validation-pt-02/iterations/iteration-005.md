# Iteration 005 - Correctness

## Scope

Second correctness pass over status derivation, key-file resolution, entity derivation, schema validation, and merge behavior.

## Verification

- Vitest: PASS, 2 files and 25 tests.
- Git log checked for scoped parser and schema test files.
- Read checks covered `deriveKeyFiles`, `deriveStatus`, `deriveGraphMetadata`, and schema parsing paths.

## Findings

No new correctness findings.

The pass re-checked the main derivation flow and did not find another issue with enough production-code evidence to add to the registry. IMPL-P1-001 remains valid because the corpus-level backfill loop still has no per-folder recovery boundary around invalid existing metadata.

## Carried Findings

- IMPL-P1-001 remains open.
- IMPL-P2-002 remains open.
- IMPL-P2-003 remains open.
- IMPL-P2-004 remains open.

## Delta

- New findings: 0
- Carried findings: 4
- Severity-weighted new findings ratio: 0.00
- Churn: 0.00
