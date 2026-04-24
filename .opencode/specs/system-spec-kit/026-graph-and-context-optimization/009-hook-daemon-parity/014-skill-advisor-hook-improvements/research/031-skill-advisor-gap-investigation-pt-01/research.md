# Gap Investigation Research — 014

## Summary

This pass found 8 genuinely missed interconnected files outside packet 014's `resource-map.md` and outside the packet's explicit implementation target set as reconstructed from `tasks.md`.

Severity breakdown:
- P1: 6
- P2: 2

Recommendation:
- Update 6 downstream docs/playbooks now.
- Add 1 focused regression to `advisor-recommend.vitest.ts`.
- Clean up 1 medium-confidence setup-guide drift while touching the same doc family.

Method note:
- The packet docs point repeatedly at `applied/T-###.md`, but that directory is absent on disk in this workspace snapshot. To avoid false positives, I treated `resource-map.md` plus packet `tasks.md` target lists as the exclusion proxy.
- CocoIndex was attempted with repo-local root overrides, but the CLI daemon could not start cleanly inside this sandbox. I still recorded the exact attempted queries in the iteration logs and completed the evidence pass with exact grep plus local code-graph SQLite.

## Missed Files Table

| Path | Relevance | Category | Needs Update |
| --- | --- | --- | --- |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/07--hooks-and-plugin/05-opencode-plugin-bridge.md` | Still points to the old plugin bridge path and `0.7` threshold wording, contradicting the live plugin helper path and the landed threshold pair. | docs | Y |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md` | Still tells operators to run the old bridge path with `thresholdConfidence:0.7`. | manual-playbook | Y |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/06--mcp-surface/01-advisor-recommend.md` | Omits the 014 public `workspaceRoot` and `effectiveThresholds` output contract. | docs | Y |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/001-native-recommend-happy-path.md` | Does not validate the new recommend output fields that 014 made public. | manual-playbook | Y |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/06--mcp-surface/03-advisor-validate.md` | Omits `thresholdSemantics`, telemetry diagnostics, and outcome totals from the validate tool description. | docs | Y |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/003-native-validate-slices.md` | Validates only slice presence and baseline percentages, not the new 014 telemetry/threshold semantics contract. | manual-playbook | Y |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts` | The happy-path test does not assert `workspaceRoot` or `effectiveThresholds` even though the handler now always emits them. | tests | Maybe |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/SET-UP_GUIDE.md` | Setup guide still uses a stale shorthand for the OpenCode bridge helper location. | docs | Maybe |

## Why These Were Missed

- Packet 014 updated the narrow code-facing surfaces: runtime code, schemas, the package README, the hook reference, and two focused tests. The adjacent feature-catalog and manual-playbook leaves were outside that tight write set.
- The resource map mirrors what was touched or cited, not what should have been updated. That is useful for audit, but it does not automatically surface downstream operator docs that stayed stale.
- The verification slice favored `advisor_validate` and OpenCode bridge regression coverage. `advisor_recommend` public-output regression coverage never expanded to the new `workspaceRoot`/`effectiveThresholds` fields.
- Bridge relocation created a split-brain doc problem: the code and plugin README already moved to `.opencode/plugin-helpers/`, but several operator-facing docs still speak in the older `.opencode/plugins/` vocabulary.
- The validate contract expanded materially in 014, but only the package README and handler/schema were updated. The catalog/playbook pair still describe the pre-014 shape.

## Recommended Resource Map Updates

Add these paths to packet 014's `resource-map.md` as `Analyzed` plus follow-up notes, because they are directly connected to the landed theme and were part of the gap investigation blast radius:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/07--hooks-and-plugin/05-opencode-plugin-bridge.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/06--mcp-surface/01-advisor-recommend.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/001-native-recommend-happy-path.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/06--mcp-surface/03-advisor-validate.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/003-native-validate-slices.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/SET-UP_GUIDE.md`

## Recommended Implementation Updates

- Update the OpenCode bridge feature catalog and playbook to use the helper path under `.opencode/plugin-helpers/` and the 014 threshold pair reflected by the live helper/test contract.
- Update the `advisor_recommend` feature catalog and manual playbook to mention and validate `workspaceRoot` plus `effectiveThresholds`.
- Update the `advisor_validate` feature catalog and manual playbook to mention and validate `thresholdSemantics`, telemetry diagnostics, and outcome totals.
- Extend `tests/handlers/advisor-recommend.vitest.ts` so the happy-path contract asserts `workspaceRoot` and `effectiveThresholds`.
- Clean up the OpenCode row in `SET-UP_GUIDE.md` so the setup family matches the actual helper layout already documented in `.opencode/plugins/README.md`.

## Evidence Trail

- Packet source of truth:
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/resource-map.md`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/spec.md`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/implementation-summary.md`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/tasks.md`
- Landed code/source-of-truth anchors:
  - `.opencode/plugins/spec-kit-skill-advisor.js:37`
  - `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs:193-205`
  - `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:162-220`
  - `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:351-425`
  - `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md:75-77`
  - `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:46-50`
- Missed downstream surfaces:
  - `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/07--hooks-and-plugin/05-opencode-plugin-bridge.md:31-38`
  - `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md:33-50`
  - `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/06--mcp-surface/01-advisor-recommend.md:29-31`
  - `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/001-native-recommend-happy-path.md:40-47`
  - `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/06--mcp-surface/03-advisor-validate.md:29-42`
  - `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/003-native-validate-slices.md:40-52`
  - `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts:99-118`
  - `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/SET-UP_GUIDE.md:111-117`

## Convergence Report

- Iteration 1 produced 3 new findings around `advisor_recommend` docs/tests and established the first stable gap pattern: downstream public-contract drift.
- Iteration 2 produced 2 new findings around OpenCode bridge relocation/threshold wording and confirmed the strongest concrete doc drift in the packet.
- Iteration 3 produced 2 new findings around `advisor_validate` contract propagation and closed the main feature-catalog/manual-playbook sweep.
- Iteration 4 produced 1 medium-confidence setup-guide follow-up and otherwise returned already-covered or archival surfaces.
- Convergence signal: by Iteration 4 the new-info ratio dropped to 0.12 and additional searches mostly returned files already in the packet resource map, already-correct docs (`.opencode/plugins/README.md`), or archival spec/review references. That is good enough saturation for this focused one-pass investigation.

## References

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/resource-map.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements/research/014-skill-advisor-hook-improvements-pt-02/findings-registry.json`
- `.opencode/plugins/spec-kit-skill-advisor.js`
- `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/06--mcp-surface/01-advisor-recommend.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/06--mcp-surface/03-advisor-validate.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/07--hooks-and-plugin/05-opencode-plugin-bridge.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/001-native-recommend-happy-path.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/003-native-validate-slices.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/SET-UP_GUIDE.md`
