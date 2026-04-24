# Deep Review Report

## 1. Summary

- **Verdict:** CONDITIONAL
- **Iterations:** 7
- **Stop reason:** maxIterationsReached
- **Active findings:** P0=0, P1=2, P2=2
- **hasAdvisories:** true
- **Release-readiness state:** in-progress

The run covered all four requested dimensions and exercised the new resource-map emitter through the shipped review reducer. No security blockers or P0 defects surfaced, but two P1 issues remain: one correctness break in the shared extractor's review evidence normalization, and one packet-traceability gap in the packet's own completion claims.

## 2. Scope

Reviewed target: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration`

Scope included:

| Surface | Files |
|---|---:|
| Shared extractor + README + focused Vitest | 3 |
| Deep-review / deep-research reducers | 2 |
| Deep-review / deep-research YAML workflows | 4 |
| Skill, command, and convergence docs | 6 |
| Feature catalog + manual testing playbooks | 4 |
| Packet docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`) | 5 |
| **Total reviewed surfaces** | **24** |

Non-goals: no code changes, no commits, no memory-save pass, and no fixes outside the review artifact packet.

## 3. Methodology

1. Initialized the canonical child-packet review root at `review/003-resource-map-deep-loop-integration-pt-01/`.
2. Ran seven review iterations with fresh state loaded from packet artifacts on each pass.
3. Rotated through correctness, security, traceability, and maintainability, then used two stabilization passes to avoid duplicate findings.
4. Wrote every iteration narrative plus a structured JSONL delta file, then refreshed the packet through the shipped `sk-deep-review` reducer.
5. Emitted `resource-map.md` through the reducer's `--emit-resource-map` synthesis path to dogfood the new extractor in a real review packet.

## 4. Findings

### P1

#### F001 — correctness
- **File:** `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs:397`
- **Title:** Review extractor does not normalize canonical `file:line` evidence before classification and status checks
- **Rationale:** the review prompt-pack contract documents per-finding delta records as `file:"path:line"`, but the shared extractor preserves the line suffix and then feeds the full string into `determineStatus()`.
- **Evidence:** `normalizePathCandidate()` returns the path with `:line` intact at `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs:397-418`, while `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs:456-460` checks filesystem existence on that unchanged string. The documented review delta example remains `{"type":"finding",...,"file":"path:line",...}` at `.opencode/skill/sk-deep-review/assets/prompt_pack_iteration.md.tmpl:77-82`.
- **Recommendation:** normalize review evidence to strip `:line`/`:line-range` suffixes before classification and status checks, and add a regression test that uses the documented review delta shape.

#### F002 — traceability
- **File:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/tasks.md:89`
- **Title:** Packet closure artifacts overstate strict-validation completion despite recorded failure
- **Rationale:** the packet's own verification surfaces disagree about whether `validate.sh --strict` succeeded, so the packet cannot be treated as cleanly closed.
- **Evidence:** `tasks.md` marks `[x] T035` at `:89` while the same file still leaves ``validate.sh --strict`` unchecked in completion criteria at `:103`. `implementation-summary.md:123-135` records `T035` as `FAIL (exit 2)`, and `spec.md:54` plus `:173` still describe strict validation exit 0 as required handoff/success criteria.
- **Recommendation:** either fix the packet-doc drift and rerun strict validation, or update `tasks.md`, `spec.md`, and checklist/handoff wording so they stop claiming a clean strict-validation close.

### P2

#### F003 — maintainability
- **File:** `.opencode/skill/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts:44`
- **Title:** Focused Vitest coverage never exercises the canonical review `file:line` finding shape
- **Rationale:** the review-shape fixture only uses bare file paths, so the extractor regression in F001 can ship without a red test.
- **Evidence:** the review fixture records only path-only `file` values at `.opencode/skill/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts:44-55`, while the prompt-pack contract still shows `file:"path:line"` at `.opencode/skill/sk-deep-review/assets/prompt_pack_iteration.md.tmpl:77-82`.
- **Recommendation:** add a review fixture that uses `file:path:line` and one that uses split `file` + `line` fields.

#### F004 — traceability
- **File:** `.opencode/command/spec_kit/deep-review.md:188`
- **Title:** Command docs still describe root-level `review/` and `research/` outputs instead of the resolved `{artifact_dir}` packet path for nested specs
- **Rationale:** child-phase packets emit review artifacts under `review/{packet}/`, but the top-level command docs still promise root-level locations.
- **Evidence:** `.opencode/command/spec_kit/deep-review.md:188-195` advertises `{spec_folder}/review/resource-map.md`, and `.opencode/command/spec_kit/deep-research.md:177-184` does the same for `research/resource-map.md`. The workflow contract uses `{artifact_dir}/resource-map.md` at `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:92-107`.
- **Recommendation:** update both command docs to describe root-spec and nested-packet output locations in terms of `{artifact_dir}` / resolved packet ownership.

## 5. Recommendations

### Workstream A — fix the shipped extractor contract
1. Normalize review delta file anchors before classification/status checks.
2. Add focused test coverage for `file:path:line` and `file + line` review evidence.

### Workstream B — repair packet closure fidelity
1. Reconcile `tasks.md`, `spec.md`, and any checklist/handoff wording with the recorded `T035` result.
2. Decide whether the packet should remain open until strict validation genuinely passes.

### Workstream C — tighten operator path guidance
1. Rewrite `deep-review.md` and `deep-research.md` so nested child-phase packets point to `{artifact_dir}`.
2. Keep command docs aligned with the feature catalog/playbook wording that already uses the resolved packet model.

### `/spec_kit:plan` seed
- **Workstream 1:** extractor normalization + review evidence test coverage
- **Workstream 2:** packet-doc verification reconciliation
- **Workstream 3:** command-doc packet-path correction

## 6. Coverage

| Dimension | Result | Notes |
|---|---|---|
| correctness | covered | 1 P1 (`F001`) |
| security | covered | no findings |
| traceability | covered | 1 P1 (`F002`), 1 P2 (`F004`) |
| maintainability | covered | 1 P2 (`F003`) |

Traceability protocol status:

| Protocol | Final status | Notes |
|---|---|---|
| `spec_code` | partial | Blocked by `F001` and `F002` |
| `checklist_evidence` | partial | Blocked by `F002` |
| `feature_catalog_code` | pass | Catalog entries match the shipped reducer/YAML behavior |
| `playbook_capability` | pass | Playbooks match the actual reducer-owned emission path |

`resource-map.md` was **absent at packet init**, so the Resource Map Coverage Gate was intentionally skipped rather than treated as a failure.

## 7. Convergence Report

- **Stop reason:** maxIterationsReached
- **Rolling ratios (last 3):** 0.10 -> 0.06 -> 0.00
- **Final newFindingsRatio:** 0.00
- **MAD noise floor:** pass
- **Evidence gate:** pass
- **Scope gate:** pass
- **Coverage gate:** pass
- **Blocked-stop events:** none recorded

The loop used the full seven-iteration budget to finish a final advisory sweep after the core findings had stabilized.

## 8. Next Steps

1. Run `/spec_kit:plan` against this packet and seed the remediation with the three workstreams above.
2. Treat the packet as **not ready for PASS** until `F001` and `F002` are resolved.
3. Keep `F003` and `F004` in the same remediation packet unless they are intentionally deferred as advisories.

## 9. Artifacts Index

- `review/003-resource-map-deep-loop-integration-pt-01/deep-review-config.json`
- `review/003-resource-map-deep-loop-integration-pt-01/deep-review-state.jsonl`
- `review/003-resource-map-deep-loop-integration-pt-01/deep-review-findings-registry.json`
- `review/003-resource-map-deep-loop-integration-pt-01/deep-review-strategy.md`
- `review/003-resource-map-deep-loop-integration-pt-01/deep-review-dashboard.md`
- `review/003-resource-map-deep-loop-integration-pt-01/resource-map.md`
- `review/003-resource-map-deep-loop-integration-pt-01/review-report.md`
- `review/003-resource-map-deep-loop-integration-pt-01/iterations/iteration-001.md` through `iteration-007.md`
- `review/003-resource-map-deep-loop-integration-pt-01/deltas/iter-001.jsonl` through `iter-007.jsonl`
