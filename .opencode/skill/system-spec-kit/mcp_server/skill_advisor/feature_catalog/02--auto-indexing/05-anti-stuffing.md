---
title: "Anti-Stuffing and Cardinality Caps"
description: "Cardinality caps, repetition-density demotions, and adversarial-fixture rejection that prevent routing abuse through derived-lane stuffing."
trigger_phrases:
  - "anti-stuffing"
  - "cardinality cap derived"
  - "repetition density demote"
  - "adversarial rejection"
---

# Anti-Stuffing and Cardinality Caps

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Stop a skill from gaming routing by spamming trigger phrases or crafting adversarial content designed to dominate the derived lane. Caps and density checks keep derived evidence honest.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`lib/derived/anti-stuffing.ts` enforces:

1. A hard cap on the number of derived entries per skill.
2. Repetition-density demotion when the same token appears with abnormally high frequency.
3. Adversarial-fixture rejection using the fixture allowlist bundled in `scripts/fixtures/`.

Demoted or rejected entries never reach the scorer, so stuffed fixtures cannot outrank honest candidates.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/derived/anti-stuffing.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` | Automated test | derived-lane boundary behavior |
| `Playbook scenario [AI-005](../../manual_testing_playbook/06--auto-indexing/005-anti-stuffing.md).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Auto indexing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--auto-indexing/05-anti-stuffing.md`

Related references:

- [01-derived-extraction.md](./01-derived-extraction.md).
- [02-sanitizer.md](./02-sanitizer.md).
<!-- /ANCHOR:source-metadata -->
