---
title: "deep_loop_graph_convergence"
description: "Coverage-graph convergence tool auto-fired by deep-research and deep-review YAML before inline stop voting."
trigger_phrases:
  - "deep_loop_graph_convergence"
  - "code_graph runtime catalog"
  - "deep_loop_graph_convergence"
importance_tier: "important"
---

# deep_loop_graph_convergence

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`deep_loop_graph_convergence` computes typed convergence decisions and signals for deep research/review coverage graphs.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

### Trigger / Auto-Fire Path

Command-owned deep-research/deep-review YAML plus direct MCP call.

### Class

auto, copied from the current reality map for the deep-loop workflows.

### Caveats / Fallback

Auto means "inside the command YAML workflow," not globally scheduled. Empty graphs return CONTINUE.
<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:146-240` | Handler | validates namespace, handles empty graphs, computes signals, and emits decisions |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:392-408` | Implementation | calls convergence before the research stop vote |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:410-425` | Implementation | calls convergence before the review stop vote |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:883-896` | Schema | defines the public schema |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/05--coverage-graph/` | Manual Playbook | Operator-facing manual scenarios for this feature category |

<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Coverage graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--coverage-graph/04-deep-loop-graph-convergence.md`

Related references:

- [03-deep-loop-graph-upsert.md](./03-deep-loop-graph-upsert.md)
- [../../manual_testing_playbook/05--coverage-graph/009-deep-loop-graph-convergence-yaml-fire.md](../../manual_testing_playbook/05--coverage-graph/009-deep-loop-graph-convergence-yaml-fire.md)
<!-- /ANCHOR:source-metadata -->
