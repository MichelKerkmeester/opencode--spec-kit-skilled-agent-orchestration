# Iteration 015: Validator Compliance

## Findings

1. **The requested `dist/validation/validate.sh` entrypoint is not present in this checkout**
   - Requested path: `.opencode/skill/system-spec-kit/scripts/dist/validation/validate.sh`
   - Live validator found and used instead: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
   - This fallback was necessary to execute the compliance pass at all.

2. **`012-pre-release-fixes-alignment-preparation` passes validation with warnings, not errors**
   - Command run: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation`
   - Result: `PASSED WITH WARNINGS` (`errors=0`, `warnings=2`)
   - Warning details:
     - `SECTION_COUNTS`: found `0` acceptance scenarios; validator expected at least `4` for Level 2
     - `SECTIONS_PRESENT`: `plan.md` is missing the recommended `Technical Context` section
   - All other checked areas passed, including anchors, level declaration/match, template headers/source, placeholders, checklist evidence, and TOC policy.

3. **Recursive validation of the broader `022-hybrid-rag-fusion` tree is possible, but it is not clean**
   - Command run: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --recursive --quiet .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion`
   - Result: `RESULT: PASSED_WITH_WARNINGS (errors=0 warnings=44)`
   - Interpretation: the broader tree is validator-clean at error level, but warning debt remains significant across the recursive scope.

4. **Six sampled child spec folders under `007-code-audit-per-feature-catalog` are structurally compliant at the document level**
   - Sample set:
     - `001-retrieval`
     - `003-discovery`
     - `005-lifecycle`
     - `010-graph-signal-activation`
     - `016-tooling-and-scripts`
     - `021-remediation-revalidation`
   - Per-folder validator command shape: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --quiet <folder>`
   - Each sampled folder returned `RESULT: PASSED (errors=0 warnings=0)`
   - Manual checks across the sample set found:
     - **Level compliance**: actual content is consistently Level 2 (`<!-- SPECKIT_LEVEL: 2 -->` in `spec.md`), with all Level-2 required files present
     - **Required anchors present**: anchor-bearing files were present in `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`, with no broken open/close anchor pairs detected
     - **Template compliance**: template source markers are present, no placeholder markers were detected, and validator/template checks passed

5. **The dominant compliance gap in the sampled `007` child folders is stale or incomplete metadata, not template drift**
   - In all six sampled folders, `description.json` uses the older metadata shape and omits both `level` and `status`, even though the corresponding `spec.md` files declare Level 2 and carry explicit status rows.
   - `description.json:lastUpdated` also lags behind live markdown mtimes in every sampled folder:
     - `001-retrieval`: stale by about `2h 35m`
     - `003-discovery`: stale by about `24h 42m`
     - `005-lifecycle`: stale by about `24h 42m`
     - `010-graph-signal-activation`: stale by about `24h 42m`
     - `016-tooling-and-scripts`: stale by about `2h 34m`
     - `021-remediation-revalidation`: stale by about `2h 35m`
   - Status drift examples:
     - `001-retrieval` spec status is `Partial`, but `description.json` has no `status`
     - `003-discovery`, `005-lifecycle`, `010-graph-signal-activation`, and `016-tooling-and-scripts` spec status is `Complete`, but `description.json` has no `status`
     - `021-remediation-revalidation` spec status is `Partially Complete`, but `description.json` has no `status`
   - Conclusion: for this sample, metadata freshness is the main manual-review issue; level/anchors/templates are otherwise in good shape.

## Summary

- The requested `dist` validator path does not exist here; the working validator is `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`.
- The target `012` spec is **not failing validation**; it has two documentation-quality warnings only:
  - missing Level-2 acceptance scenarios
  - missing `Technical Context` in `plan.md`
- The recursive `022` root pass is also **warning-only**, but with non-trivial warning volume (`44`).
- The six sampled child folders under `007-code-audit-per-feature-catalog` all passed validator checks individually and were manually confirmed to be Level-2/template/anchor compliant.
- The main issue in those sampled child folders is **stale/incomplete `description.json` metadata** rather than broken document structure.

## JSONL (type:iteration, run:15, dimensions:[traceability])

{"type":"iteration","run":15,"dimensions":["traceability"],"result":"warning_debt_and_metadata_drift","validator":{"requested_path":".opencode/skill/system-spec-kit/scripts/dist/validation/validate.sh","used_path":".opencode/skill/system-spec-kit/scripts/spec/validate.sh","target":{"folder":"012-pre-release-fixes-alignment-preparation","status":"PASSED_WITH_WARNINGS","errors":0,"warnings":2,"warning_details":["SECTION_COUNTS: 0 acceptance scenarios found; expected at least 4 for Level 2","SECTIONS_PRESENT: plan.md missing recommended Technical Context section"]},"recursive_root":{"folder":"022-hybrid-rag-fusion","status":"PASSED_WITH_WARNINGS","errors":0,"warnings":44}},"sample_audit":{"parent":"007-code-audit-per-feature-catalog","sample_size":6,"folders":["001-retrieval","003-discovery","005-lifecycle","010-graph-signal-activation","016-tooling-and-scripts","021-remediation-revalidation"],"level_compliance":"pass","anchors":"pass","template_compliance":"pass","stale_metadata":{"folders_with_missing_level":6,"folders_with_missing_status":6,"folders_with_stale_lastUpdated":6}}}
