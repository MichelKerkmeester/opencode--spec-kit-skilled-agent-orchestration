---
title: "Lane Contribution Attribution"
description: "Attribution metadata that returns per-lane rawScore, weight, weightedScore, and shadowOnly fields without leaking prompt text."
trigger_phrases:
  - "lane attribution"
  - "includeAttribution"
  - "laneBreakdown"
  - "attribution metadata"
---

# Lane Contribution Attribution

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Make the fusion score auditable by exposing each lane's contribution per recommendation, without leaking prompt text or evidence snippets.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`lib/scorer/attribution.ts` builds the `laneBreakdown` array when `includeAttribution: true` is passed to `advisor_recommend`. Each entry carries exactly `lane`, `rawScore`, `weight`, `weightedScore`, and `shadowOnly`. The semantic lane always reports `shadowOnly: true`. Prompt substrings are never copied into attribution.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/attribution.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts` | Handler | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts` | Schema | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-recommend.vitest.ts` | Automated test | attribution shape |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-privacy.vitest.ts` | Automated test | no prompt leakage |
| `Playbook scenario [SC-004](../../manual_testing_playbook/08--scorer-fusion/004-lane-attribution.md).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Scorer fusion
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--scorer-fusion/04-attribution.md`

Related references:

- [01-five-lane-fusion.md](./01-five-lane-fusion.md).
- [05-ablation.md](./05-ablation.md).
- [`06--mcp-surface/01-advisor-recommend.md`](../06--mcp-surface/01-advisor-recommend.md).
<!-- /ANCHOR:source-metadata -->
