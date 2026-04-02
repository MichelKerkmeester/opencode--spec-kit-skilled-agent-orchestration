# Iteration 024
## Scope
- Reviewed `007-hybrid-search-null-db-fix`, `008-spec-memory-compliance-audit`, `009-reindex-validator-false-positives`, and `010-search-retrieval-quality-fixes`.
- Focused on evidence-citation integrity and gating consistency.

## Verdict
findings

## Findings
### P0
None.

### P1
1. Phase 009 checklist still marks many items complete without in-item evidence tags, and validator flags this as citation debt.
Evidence: `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/009-reindex-validator-false-positives/checklist.md:33`, `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/009-reindex-validator-false-positives/checklist.md:34`, `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/009-reindex-validator-false-positives/checklist.md:44`, `/tmp/validate_023_latest.log:236`.

2. Phase 010 has the same pattern: completed checks are present, but validator still reports missing evidence on completed items.
Evidence: `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/010-search-retrieval-quality-fixes/checklist.md:32`, `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/010-search-retrieval-quality-fixes/checklist.md:33`, `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/010-search-retrieval-quality-fixes/checklist.md:42`, `/tmp/validate_023_latest.log:272`.

### P2
1. Non-template anchor `critical-files` persists in Phase 010 plan and keeps producing warning noise.
Evidence: `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/010-search-retrieval-quality-fixes/plan.md:27`, `/tmp/validate_023_latest.log:270`.

## Passing checks observed
- Parent/predecessor/successor metadata is present in phases 008 and 010.
Evidence: `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/008-spec-memory-compliance-audit/spec.md:24`, `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/008-spec-memory-compliance-audit/spec.md:27`, `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/010-search-retrieval-quality-fixes/spec.md:26`, `.opencode/specs/02--system-spec-kit/023-esm-module-compliance/010-search-retrieval-quality-fixes/spec.md:29`.
- Placeholder enforcement passes in this scope.
Evidence: `/tmp/validate_023_latest.log:222`, `/tmp/validate_023_latest.log:257`, `/tmp/validate_023_latest.log:292`.

## Recommendations
1. Add explicit `[Evidence: ...]` tags for each completed CHK item flagged in phases 009 and 010.
2. Replace or remove `critical-files` anchor so the plan is template-clean.
