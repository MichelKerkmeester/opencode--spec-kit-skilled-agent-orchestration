---
title: "Lane Weights Configuration"
description: "Centralized weight configuration that exposes canonical lane weights as a single source of truth for fusion."
trigger_phrases:
  - "lane weights config"
  - "weights-config.ts"
  - "canonical weights"
  - "lane weight source of truth"
---

# Lane Weights Configuration

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Keep the canonical lane weights in exactly one place and expose them to callers so routing behavior remains auditable.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`lib/scorer/weights-config.ts` defines the canonical weights from `lib/scorer/lane-registry.ts`: `explicit_author: 0.45`, `lexical: 0.30`, `graph_causal: 0.15`, `derived_generated: 0.15`, `semantic_shadow: 0.00`. These values are surfaced through `advisor_status.laneWeights` and consumed by `lib/scorer/fusion.ts`.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/weights-config.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lane-registry.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts` | Handler | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` | Automated test | weight consumption |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-status.vitest.ts` | Automated test | weight exposure |
| `Playbook scenario [SC-001](../../manual_testing_playbook/08--scorer-fusion/001-five-lane-fusion.md).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Scorer fusion
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--scorer-fusion/06-weights-config.md`

Related references:

- [01-five-lane-fusion.md](./01-five-lane-fusion.md).
<!-- /ANCHOR:source-metadata -->
