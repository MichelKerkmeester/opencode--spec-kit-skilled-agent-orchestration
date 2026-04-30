---
title: "Five-Lane Analytical Fusion"
description: "Analytical fusion of 5 lanes (explicit_author 0.45, lexical 0.30, graph_causal 0.15, derived_generated 0.15, semantic_shadow 0.00) that produces the live routing score."
trigger_phrases:
  - "five lane fusion"
  - "lane weights canonical"
  - "fusion scorer"
  - "advisor analytical fusion"
---

# Five-Lane Analytical Fusion

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Combine evidence from five independent lanes into a single routing score with documented, auditable weights.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`lib/scorer/fusion.ts` fuses five lanes using the canonical weights below. Each lane runs independently and writes `{ lane, rawScore, weight, weightedScore, shadowOnly }` metadata that the attribution path consumes.

| Lane | Weight | Source |
| --- | --- | --- |
| `explicit_author` | 0.45 | Author-declared signals via `intent_signals`, trigger_phrases, and explicit mentions. |
| `lexical` | 0.30 | Token overlap weighted by IDF from the active corpus. |
| `graph_causal` | 0.15 | Graph-edge evidence projected through skill_nodes and skill_edges. |
| `derived_generated` | 0.15 | Auto-extracted derived entries under trust-lane control. |
| `semantic_shadow` | 0.00 | Semantic similarity (shadow-only; live weight is hardcoded at 0). |

Weight configuration is exposed via `advisor_status.laneWeights`.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/weights-config.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/derived.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/semantic-shadow.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` | Automated test | fusion arithmetic and lane weights |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-status.vitest.ts` | Automated test | `laneWeights` exposure |
| `Playbook scenario [SC-001](../../manual_testing_playbook/08--scorer-fusion/001-five-lane-fusion.md).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Scorer fusion
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--scorer-fusion/01-five-lane-fusion.md`

Related references:

- [02-projection.md](./02-projection.md).
- [04-attribution.md](./04-attribution.md).
<!-- /ANCHOR:source-metadata -->
