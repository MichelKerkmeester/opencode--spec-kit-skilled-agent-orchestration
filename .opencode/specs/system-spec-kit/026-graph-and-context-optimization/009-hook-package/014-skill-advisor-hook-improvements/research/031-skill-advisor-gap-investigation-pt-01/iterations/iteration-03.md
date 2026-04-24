# Iteration 03

### Focus

Check whether `advisor_validate`'s new 014 public contract (`workspaceRoot`, `thresholdSemantics`, telemetry diagnostics, and outcome totals) propagated into downstream docs and operator playbooks.

### Search Strategy

- CocoIndex attempt:
  - `HOME=/tmp COCOINDEX_CODE_ROOT_PATH=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public ccc search "advisor validate threshold semantics telemetry outcomes accepted corrected ignored downstream docs" --limit 8 --path '.opencode/**'`
  - Result: no usable semantic output due daemon startup limits in sandbox.
- Grep patterns:
  - `rg -n "thresholdSemantics|telemetry|accepted|corrected|ignored|advisor_validate" .opencode/skill/system-spec-kit/mcp_server/skill-advisor`
  - `rg -n "thresholdSemantics|telemetry|accepted|corrected|ignored" feature_catalog/.../03-advisor-validate.md manual_testing_playbook/.../003-native-validate-slices.md`
- Code-graph traversals:
  - Landed-file-set SQLite outline/edge scans around `handlers/advisor-validate.ts` and related schemas to confirm the new output fields originate in the handler/schema pair.

### Missed Files Found

| Path | Why It's Relevant | Category | Confidence | Why It Was Missed | Needs Update |
| --- | --- | --- | --- | --- | --- |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/06--mcp-surface/03-advisor-validate.md` | The landed handler now emits `workspaceRoot`, `thresholdSemantics`, telemetry diagnostics, and outcome totals at [`handlers/advisor-validate.ts:351-425`], and the package README documents that public shape at [`README.md:76-77`]. This feature page still stops at legacy slice summaries and "ablation slices when requested" [`feature_catalog/.../03-advisor-validate.md:29-42`]. | docs | High | Packet 014 updated the code, schema, README, and one focused test, but not the feature-catalog leaf that operators read for tool shape. | Y |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/01--native-mcp-tools/003-native-validate-slices.md` | The playbook still validates only slice presence and baseline percentages [`manual_testing_playbook/.../003-native-validate-slices.md:40-52`]. It does not check `thresholdSemantics`, telemetry diagnostics, or outcome totals even though 014 made those public and prompt-safe [`handlers/advisor-validate.ts:351-425`]. | manual-playbook | High | The packet verification recorded `advisor-validate.vitest.ts`, but the operator playbook was not brought forward with the new public fields. | Y |

### Already-Covered

- Already in `resource-map.md`: `handlers/advisor-validate.ts`, `schemas/advisor-tool-schemas.ts`, the package README, and `tests/handlers/advisor-validate.vitest.ts`.
- Not flagged: the package README because it already reflects the new validate contract.

### Status

Two more high-confidence misses surfaced, and both are pure downstream doc/playbook lag behind the landed validate contract.
