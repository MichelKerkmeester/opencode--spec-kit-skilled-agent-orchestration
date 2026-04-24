# Iteration 002: security - reducer and extractor safety review

## Dispatcher
- Dimension: security
- Focus: trust boundaries, path handling, shell/network exposure, and opt-out behavior
- Scope slice: extractor, both reducers, YAML synthesis emission paths

## Files Reviewed
- `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs`
- `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs`
- `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`

## Findings - New

### P0 Findings
- None.

### P1 Findings
- None.

### P2 Findings
- None.

## Findings Closed
- None.

## Traceability Checks
- `spec_code`: pass - reducers only emit through the shared extractor and respect `config.resource_map.emit === false`.
- `checklist_evidence`: pass - no unexpected shell-outs or network calls were introduced in the extractor path itself.

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs` only imports `node:fs` and `node:path`, rejects traversal-style `../` candidates, and ignores URLs.
- `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` and `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` gate emission behind `--emit-resource-map` plus config opt-out rather than always writing.
- The YAML synthesis steps invoke the existing reducer CLI instead of introducing a second shell execution path.

## Assessment
- Verdict: PASS
- Coverage delta: security dimension covered across the shared extractor and both emitters.
- Convergence signal: newFindingsRatio=0.00; no security issues found in the reviewed scope.
- Dimensions addressed: security

## Next Focus
Traceability pass on packet docs and operator-facing surfaces, with emphasis on whether verification and handoff claims match the recorded evidence.
