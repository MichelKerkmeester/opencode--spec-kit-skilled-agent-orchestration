# Iteration 005: traceability - command path contract follow-up

## Dispatcher
- Dimension: traceability
- Focus: command entrypoint wording versus the workflow's resolved artifact directory contract
- Scope slice: review command doc, research command doc, review workflow state paths

## Files Reviewed
- `.opencode/command/spec_kit/deep-review.md`
- `.opencode/command/spec_kit/deep-research.md`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`

## Findings - New

### P0 Findings
- None.

### P1 Findings
- None.

### P2 Findings
- **F004**: Command docs still describe root-level `review/` and `research/` outputs instead of the resolved `{artifact_dir}` packet path for nested specs — `.opencode/command/spec_kit/deep-review.md:188` — child-phase packets emit `resource-map.md` and `review-report.md` under `review/{packet}/`, but the command docs still promise root-level locations that only hold for root specs.
  - Rationale: operators following the command docs on nested packets will look in the wrong directory for the emitted artifact.
  - Evidence:
    - `.opencode/command/spec_kit/deep-review.md:188-195` says the command emits `{spec_folder}/review/resource-map.md` and `{spec_folder}/review/` packet outputs.
    - `.opencode/command/spec_kit/deep-research.md:177-184` likewise advertises root-level `research/resource-map.md`.
    - `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:92-107` defines the canonical output paths as `{artifact_dir}/review-report.md` and `{artifact_dir}/resource-map.md`.
  - Recommendation: update both command docs to describe root-spec and nested-packet behavior in terms of `{artifact_dir}` / resolved packet ownership.

## Findings Closed
- None.

## Traceability Checks
- `feature_catalog_code`: pass - feature catalog entries use `{artifact_dir}` correctly.
- `playbook_capability`: partial - the playbooks are correct, but the top-level command docs still point operators at root-level locations.

## Confirmed-Clean Surfaces
- The workflow assets themselves consistently use `{artifact_dir}` for the emitted resource map path.

## Assessment
- Verdict: PASS with advisories
- Coverage delta: command-level traceability and operator output-path guidance checked.
- Convergence signal: newFindingsRatio=0.10; only low-severity doc path drift remains.
- Dimensions addressed: traceability

## Next Focus
Correctness stabilization pass across the reducers and YAML emit branches to confirm no additional code-path issues remain after the schema bug already identified.
