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

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`deep_loop_graph_upsert` stores coverage graph nodes and edges for deep research/review loops. The command workflows call it only when a reducer exposes graph events.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

### Trigger / Auto-Fire Path

Command-owned deep-research/deep-review YAML, conditional on `graphEvents`; direct MCP call remains available.

### Class

half, copied from the current reality map.

### Caveats / Fallback

No `graphEvents` means no upsert. The workflow skip is intentional and should not be described as a failed write.
<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:65-86` | Handler | validates namespace and rejects empty batches |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:817-836` | Implementation | conditionally calls upsert for research graph events |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:841-863` | Implementation | conditionally calls upsert for review graph events |
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:804-848` | Schema | defines the public schema |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/05--coverage-graph/` | Manual Playbook | Operator-facing manual scenarios for this feature category |

<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Coverage graph
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--coverage-graph/03-deep-loop-graph-upsert.md`

Related references:

- [04-deep-loop-graph-convergence.md](./04-deep-loop-graph-convergence.md)
- [../../manual_testing_playbook/05--coverage-graph/010-deep-loop-graph-upsert-conditional.md](../../manual_testing_playbook/05--coverage-graph/010-deep-loop-graph-upsert-conditional.md)
<!-- /ANCHOR:source-metadata -->
