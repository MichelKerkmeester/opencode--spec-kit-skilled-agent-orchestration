# Iteration 004: maintainability - regression coverage and doc ergonomics

## Dispatcher
- Dimension: maintainability
- Focus: regression coverage, contract examples, and safe follow-on change cost
- Scope slice: focused Vitest file, extractor README, review prompt-pack contract

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/resource-map/README.md`
- `.opencode/skill/sk-deep-review/assets/prompt_pack_iteration.md.tmpl`

## Findings - New

### P0 Findings
- None.

### P1 Findings
- None.

### P2 Findings
- **F003**: Focused Vitest coverage never exercises the canonical review `file:line` finding shape — `.opencode/skill/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts:44` — the review-shape fixture only uses path-only `file` values, so the documented prompt-pack example that writes `file":"path:line"` can regress without the extractor test suite noticing.
  - Rationale: the missing test case is what allowed the correctness bug in `F001` to ship with green focused coverage.
  - Evidence:
    - `.opencode/skill/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts:44-55` supplies only path-only `file` fields such as `.opencode/command/spec_kit/deep-review.md`.
    - `.opencode/skill/sk-deep-review/assets/prompt_pack_iteration.md.tmpl:77-82` shows the canonical review delta example with `file":"path:line"`.
  - Recommendation: add at least one review fixture that uses `file:path:line` and one that uses separate `file` + `line` fields so the extractor contract is pinned on real review evidence shapes.

## Findings Closed
- None.

## Traceability Checks
- `feature_catalog_code`: pass - the feature-catalog and playbook entries describe the reducer-owned emission path clearly.
- `playbook_capability`: pass - the playbooks point operators at the reducer and YAML surfaces that actually own emission.

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/scripts/resource-map/README.md` explains degraded-row behavior and deterministic fallbacks clearly enough for a follow-on patch.
- The feature catalog and playbook entries reference the same implementation anchors and opt-out behavior.

## Assessment
- Verdict: PASS with advisories
- Coverage delta: maintainability reviewed across the test surface and the operator-facing contract docs.
- Convergence signal: newFindingsRatio=0.14; only a test-coverage gap remains newly discovered in this pass.
- Dimensions addressed: maintainability

## Next Focus
Traceability follow-up on the command surfaces to confirm nested child-phase artifact paths are documented consistently with `{artifact_dir}`.
