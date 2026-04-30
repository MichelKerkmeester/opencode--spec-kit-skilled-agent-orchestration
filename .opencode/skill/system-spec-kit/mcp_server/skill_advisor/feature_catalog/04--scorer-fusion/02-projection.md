---
title: "Skill-Nodes / Skill-Edges Projection"
description: "Projection layer that converts the compiled skill graph into the shape consumed by graph-causal scoring without leaking raw graph text."
trigger_phrases:
  - "scorer projection"
  - "skill_nodes skill_edges"
  - "graph causal projection"
  - "projection layer"
---

# Skill-Nodes / Skill-Edges Projection

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Expose only the graph data the `graph_causal` lane actually needs, in a stable shape that the scorer can consume directly without traversing the whole compiled graph on every call.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`lib/scorer/projection.ts` projects the compiled skill graph into `skill_nodes` and `skill_edges` collections shaped for the graph-causal lane. The projection is side-effect-free and does not carry prompt text or raw graph prose. Bounded node counts keep memory usage stable as the corpus grows.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/projection.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` | Automated test | graph-causal lane behavior |
| `Playbook scenario [SC-002](../../manual_testing_playbook/08--scorer-fusion/002-projection.md).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Scorer fusion
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--scorer-fusion/02-projection.md`

Related references:

- [01-five-lane-fusion.md](./01-five-lane-fusion.md).
- [04-attribution.md](./04-attribution.md).
- [`06--mcp-surface/03-advisor-validate.md`](../06--mcp-surface/03-advisor-validate.md).
<!-- /ANCHOR:source-metadata -->
