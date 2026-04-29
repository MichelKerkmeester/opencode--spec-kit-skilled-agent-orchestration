---
title: "deep_loop_graph_upsert"
description: "Coverage-graph write tool called conditionally by deep-research and deep-review YAML when latest iteration graphEvents are present."
trigger_phrases:
  - "deep_loop_graph_upsert"
  - "code_graph runtime catalog"
  - "deep_loop_graph_upsert"
importance_tier: "important"
---
# deep_loop_graph_upsert

## 1. OVERVIEW

`deep_loop_graph_upsert` stores coverage graph nodes and edges for deep research/review loops. The command workflows call it only when a reducer exposes graph events.

## 2. SURFACE

- `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:65-86` validates namespace and rejects empty batches.
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:817-836` conditionally calls upsert for research graph events.
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:841-863` conditionally calls upsert for review graph events.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:804-848` defines the public schema.

## 3. TRIGGER / AUTO-FIRE PATH

Command-owned deep-research/deep-review YAML, conditional on `graphEvents`; direct MCP call remains available.

## 4. CLASS

half, copied from the current reality map.

## 5. CAVEATS / FALLBACK

No `graphEvents` means no upsert. The workflow skip is intentional and should not be described as a failed write.

## 6. CROSS-REFS

- [04-deep-loop-graph-convergence.md](./04-deep-loop-graph-convergence.md)
- [../../manual_testing_playbook/05--coverage-graph/010-deep-loop-graph-upsert-conditional.md](../../manual_testing_playbook/05--coverage-graph/010-deep-loop-graph-upsert-conditional.md)

