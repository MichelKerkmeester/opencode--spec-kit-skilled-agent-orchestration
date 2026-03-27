# Iteration 048 -- Wave 2 Tooling Governance Flags Remediation Deprecated

**Agent:** GPT-5.4 (Codex main run)
**Dimension:** traceability, maintainability
**Status:** complete
**Timestamp:** 2026-03-27T17:23:00+01:00

## Findings

- `HRF-DR-028 [P2]` Seven live feature entries weaken deterministic traceability with non-concrete evidence paths or duplicate ordinals, weakening feature-to-code verification.

## Evidence
- `16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md:45-59` uses checklist IDs and a descriptive label in the evidence table rather than concrete file paths.
- `16--tooling-and-scripts/30-template-composition-system.md:47-49` uses wildcard globs instead of concrete addendum files.
- `21--implement-and-remove-deprecated-features/01-category-stub.md:49-53` and `21--implement-and-remove-deprecated-features/04-inert-scoring-flags-and-compatibility-shims.md:44-48` use `Deep research remediation 2026-03-26` as a pseudo-path in validation tables.
- `02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md:46-63` points at a stale verification surface instead of the direct regression suite that now exercises the behavior.
- `09--evaluation-and-measurement/15-evaluation-api-surface.md` and `15-memory-roadmap-baseline-snapshot.md` publish duplicate live ordinals inside the same category, weakening deterministic references for review and automation.

## Next Adjustment
- Follow the high-risk lanes and separate real code-unsound features from entries that are merely under-tested or evidence-light.
