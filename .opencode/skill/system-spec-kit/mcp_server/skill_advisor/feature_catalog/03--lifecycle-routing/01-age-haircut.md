---
title: "Derived-Lane-Only Age Haircut"
description: "Age-based decay applied strictly to the derived lane so aging evidence does not dominate fresh explicit or lexical signals."
trigger_phrases:
  - "age haircut"
  - "derived age decay"
  - "age weighted derived"
  - "lifecycle age"
---

# Derived-Lane-Only Age Haircut

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Keep routing sensitive to currency without discounting author-declared signals. Older skills should see their auto-generated (derived) evidence softened, but their explicit declarations (`intent_signals`, trigger phrases) remain authoritative.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`lib/lifecycle/age-haircut.ts` reads each skill's source modification time and applies a documented decay curve to the derived lane only. The `explicit_author`, `lexical`, `graph_causal`, and `semantic_shadow` lanes are untouched. The haircut shows up as a gap between `rawScore` and `weightedScore` in lane attribution for the derived lane.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/lifecycle/age-haircut.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/derived.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` | Automated test | derived-lane decay application |
| `Playbook scenario [LC-001](../../manual_testing_playbook/07--lifecycle-routing/001-age-haircut.md).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Lifecycle routing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--lifecycle-routing/01-age-haircut.md`

Related references:

- [`04--scorer-fusion/01-five-lane-fusion.md`](../04--scorer-fusion/01-five-lane-fusion.md).
- [`04--scorer-fusion/04-attribution.md`](../04--scorer-fusion/04-attribution.md).
- [02-supersession.md](./02-supersession.md).
<!-- /ANCHOR:source-metadata -->
