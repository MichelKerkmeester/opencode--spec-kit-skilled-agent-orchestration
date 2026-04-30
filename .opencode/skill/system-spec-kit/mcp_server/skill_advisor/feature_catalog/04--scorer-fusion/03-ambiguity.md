---
title: "Top-2 Ambiguity Window"
description: "Ambiguity detection that returns an ambiguous brief when the top two candidates are within a 0.05 confidence window."
trigger_phrases:
  - "ambiguity window"
  - "top 2 ambiguity"
  - "ambiguous brief"
  - "0.05 confidence window"
---

# Top-2 Ambiguity Window

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Avoid silently picking a single winner when two candidates are tied or near-tied. Expose the ambiguity to callers so routing decisions stay honest under the 5-lane fusion.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`lib/scorer/ambiguity.ts` measures the gap between the top-1 and top-2 aggregate scores. When the delta is <= 0.05, the response carries an ambiguity signal that the render path surfaces as an ambiguous brief. When the delta exceeds the window, top-1 is returned unambiguously.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/ambiguity.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/render.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` | Automated test | ambiguity window behavior |
| `Playbook scenarios [SC-003](../../manual_testing_playbook/08--scorer-fusion/003-ambiguity.md) and [NC-004](../../manual_testing_playbook/01--native-mcp-tools/004-ambiguous-brief-rendering.md).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Scorer fusion
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--scorer-fusion/03-ambiguity.md`

Related references:

- [01-five-lane-fusion.md](./01-five-lane-fusion.md).
- [04-attribution.md](./04-attribution.md).
- [`06--mcp-surface/01-advisor-recommend.md`](../06--mcp-surface/01-advisor-recommend.md).
<!-- /ANCHOR:source-metadata -->
