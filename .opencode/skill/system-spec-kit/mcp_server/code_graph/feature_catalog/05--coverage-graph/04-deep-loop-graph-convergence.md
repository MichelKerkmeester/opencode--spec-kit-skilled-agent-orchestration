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

## 1. OVERVIEW

`deep_loop_graph_convergence` computes typed convergence decisions and signals for deep research/review coverage graphs.

## 2. SURFACE

- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:146-240` validates namespace, handles empty graphs, computes signals, and emits decisions.
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:392-408` calls convergence before the research stop vote.
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:410-425` calls convergence before the review stop vote.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:883-896` defines the public schema.

## 3. TRIGGER / AUTO-FIRE PATH

Command-owned deep-research/deep-review YAML plus direct MCP call.

## 4. CLASS

auto, copied from packet 013's reality map for the deep-loop workflows.

## 5. CAVEATS / FALLBACK

Auto means "inside the command YAML workflow," not globally scheduled. Empty graphs return CONTINUE.

## 6. CROSS-REFS

- [03-deep-loop-graph-upsert.md](./03-deep-loop-graph-upsert.md)
- [../../manual_testing_playbook/05--coverage-graph/009-deep-loop-graph-convergence-yaml-fire.md](../../manual_testing_playbook/05--coverage-graph/009-deep-loop-graph-convergence-yaml-fire.md)


