Read-only audit completed. I found no DELETE candidates. Impact is mostly stale composer/template-path docs plus banned-vocabulary leaks in AI-readable catalog/playbook surfaces; `mcp_server/stress_test` code fixtures are internal test data and should stay untouched.

**1. Feature Catalog Audit**

Per-subdir overview: impacted subdirs are `01`, `02`, `05`, `09`, `11`, `14`, `16`, `17`, `18`, `19`, `21`, `22`, plus root `feature_catalog.md`. Other feature-catalog subdirs were untouched.

| Path | Action | Reason | Replacement guidance |
|---|---:|---|---|
| `feature_catalog/feature_catalog.md` | MODIFY | Lines 42, 141, 255, 1469, 1873, 2995, 3298, 3899, 4160, 4446-4449 leak banned terms in AI-readable master index. | Use `feature area`, `retrieval defaults`, `planned feature`, `roadmap flags`, `type`, `Level` wording. Avoid public “manifest-driven” phrase unless renamed to Level definition/source map vocabulary. |
| `feature_catalog/16--tooling-and-scripts/30-template-composition-system.md` | MODIFY | Lines 19, 25, 29-31, 41 describe obsolete composer/build-time composition, `core/`, `addendum/`, `compose.sh`. | Rewrite around C+F greenfield Level 1/2/3/3+ generation from the new internal definition source; remove composer CLI and fragment-output narrative. |
| `feature_catalog/22--context-preservation-and-code-graph/25-resource-map-template.md` | MODIFY | Lines 10, 18, 28 reference root `templates/resource-map.md` and `templates/level_*`. | Point to generated Level packet output and current spec-doc classifier surfaces; remove level-folder/root-template path list. |
| `feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md` | MODIFY | Lines 80-83, 137 expose `capability-flags.ts`/capability wording. | Rename prose to roadmap flag/default resolvers; if source path remains, it needs an implementation rename or CI exemption. |
| `feature_catalog/19--feature-flag-reference/11-memory-roadmap-capability-flags.md` | MODIFY | Lines 2, 3, 6, 8, 14, 24-29, 42 leak capability vocabulary. | Retitle to “Memory roadmap flags”; describe live roadmap metadata/default resolvers. |
| `feature_catalog/14--pipeline-architecture/22-mcp-server-public-api-barrel.md` | MODIFY | Lines 20, 34, 56, 63-64 leak capability wording. | Use roadmap flag helpers/default helpers. |
| `feature_catalog/16--tooling-and-scripts/37-cli-matrix-adapter-runners.md` | MODIFY | Lines 3, 32, 45, 47 leak manifest vocabulary in operational docs. | Use “matrix definition file” / “runner definition”. |
| `feature_catalog/16--tooling-and-scripts/36-copilot-target-authority-helper.md` | MODIFY | Lines 18-19, 23-25, 27, 29, 33 expose `kind` contract. | Rename public prose to “state/status”; code contract may need parallel rename. |
| `feature_catalog/05--lifecycle/01-checkpoint-creation-checkpointcreate.md` | MODIFY | Line 18 exposes manifest wording. | Use checkpoint table list / rebuild table list. |
| `feature_catalog/01--retrieval/07-ast-level-section-retrieval-tool.md`; `01--retrieval/12-search-api-surface.md`; `02--mutation/09-correction-tracking-with-undo.md`; `09--evaluation-and-measurement/17-memory-roadmap-baseline-snapshot.md`; `11--scoring-and-calibration/04-classification-based-decay.md`; `11--scoring-and-calibration/24-skill-advisor-affordance-evidence.md`; `14--pipeline-architecture/04-template-anchor-optimization.md`; `14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md`; `16--tooling-and-scripts/09-migration-checkpoint-scripts.md`; `16--tooling-and-scripts/12-session-capturing-pipeline-quality.md`; `16--tooling-and-scripts/25-memory-maintenance-and-migration-clis.md`; `17--governance/01-feature-flag-governance.md`; `18--ux-hooks/10-atomic-save-parity-and-partial-indexing-hints.md`; `21--implement-and-remove-deprecated-features/01-category-stub.md`; `22--context-preservation-and-code-graph/06-runtime-detection.md` | MODIFY | Banned-word only hits from `rg`: capability/kind/manifest/preset in AI-readable operational catalog prose. | Mechanical wording cleanup: `feature`, `type`, `mode`, `profile`, `table list`, `runtime signal`, or renamed source identifiers where needed. |

**2. Manual Testing Playbook Audit**

Per-subdir overview: impacted subdirs are `02`, `14--stress-testing`, `16`, `19`, `22`, plus root `manual_testing_playbook.md`. Other playbook subdirs were untouched.

| Path | Action | Reason | Replacement guidance |
|---|---:|---|---|
| `manual_testing_playbook/manual_testing_playbook.md` | MODIFY | Lines 2458, 2471, 3727 leak capability wording and one stale `125-hydra...` path. | Rename scenario to roadmap flags and fix linked file path. |
| `manual_testing_playbook/16--tooling-and-scripts/244-template-composition-system.md` | MODIFY | Lines 18-19, 23, 32, 37-40, 48, 52, 57 validate `compose.sh`, composer drift, generated `templates/level_*`. | Replace with Level 1/2/3/3+ generation/invariance checks against the new greenfield template flow. |
| `manual_testing_playbook/22--context-preservation-and-code-graph/270-resource-map-template.md` | MODIFY | Lines 18-20, 22, 38 reference root `templates/resource-map.md`. | Validate current Level packet resource-map output/discovery, not the deleted root template. |
| `manual_testing_playbook/19--feature-flag-reference/125-memory-roadmap-capability-flags.md` | MODIFY | Lines 2-5, 8, 10, 16, 56-59, 76, 80, 87, 93, 103 leak capability wording/path. | Retitle to roadmap flags; update commands once source path is renamed or exempted. |
| `manual_testing_playbook/14--stress-testing/01-run-stress-cycle.md` | MODIFY | Line 129 says “phase manifest”. | Use “phase map” only. |
| `manual_testing_playbook/16--tooling-and-scripts/280-cli-matrix-adapter-runner-smoke.md` | MODIFY | Lines 96, 105 leak manifest wording. | Use “matrix definition applicability rule/file”. |
| `manual_testing_playbook/22--context-preservation-and-code-graph/250-session-start-startup.md` | MODIFY | Lines 20, 23, 63, 72 expose `kind=startup`. | Use “startup payload type/status” unless the transport field is renamed. |
| `manual_testing_playbook/02--mutation/192-correction-tracking-with-undo.md` | MODIFY | Line 44 says library capability. | Use “direct library behavior/API”. |

**3. Stress Test Audit**

| Path | Action | Reason | Replacement guidance |
|---|---:|---|---|
| `templates/stress_test/README.md` | UNTOUCHED | No deleted Level template paths or banned C+F vocabulary. | None. |
| `templates/stress_test/findings.template.md` | UNTOUCHED | No impact. | None. |
| `templates/stress_test/findings-rubric.schema.md` | UNTOUCHED | No `level_N` output references found. | None. |
| `templates/stress_test/findings-rubric.template.json` | UNTOUCHED | No impact. | None. |
| `mcp_server/stress_test/README.md` | UNTOUCHED | Public README is clean. | None. |
| `mcp_server/stress_test/{code-graph,matrix,memory,search-quality,session,skill-advisor}/` | UNTOUCHED | `kind` hits are internal TS fixture/object fields, not user/AI-facing docs. | None. |

**4. Summary Count**

MODIFY: 33  
DELETE: 0  
UNTOUCHED: 659
