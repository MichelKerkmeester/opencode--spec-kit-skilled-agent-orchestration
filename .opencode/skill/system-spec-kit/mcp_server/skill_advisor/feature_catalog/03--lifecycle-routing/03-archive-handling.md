---
title: "Archive and Future Skills Indexed But Not Routed"
description: "z_archive/ and z_future/ skills are visible to inspection tools but excluded from live routing and active-corpus statistics."
trigger_phrases:
  - "archive handling"
  - "z_archive skills"
  - "z_future skills"
  - "indexed but not routed"
---

# Archive and Future Skills Indexed But Not Routed

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Preserve historical and staged skills for inspection (audits, history, pre-activation preview) without letting them surface in live routing recommendations.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`lib/lifecycle/archive-handling.ts` classifies skills under `z_archive/` and `z_future/` as indexed-but-not-routed. They appear in inspection surfaces (graph status, catalog, playbook cross-references) but are excluded from:

1. `advisor_recommend` recommendations.
2. DF/IDF corpus statistics (see `lib/corpus/df-idf.ts`).
3. 5-lane fusion scoring inputs.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/lifecycle/archive-handling.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/corpus/df-idf.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` | Automated test | archived-skill exclusion |
| `Playbook scenario [LC-003](../../manual_testing_playbook/07--lifecycle-routing/003-archive-handling.md).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Lifecycle routing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--lifecycle-routing/03-archive-handling.md`

Related references:

- [`02--auto-indexing/06-df-idf-corpus.md`](../02--auto-indexing/06-df-idf-corpus.md).
- [02-supersession.md](./02-supersession.md).
- [04-schema-migration.md](./04-schema-migration.md).
<!-- /ANCHOR:source-metadata -->
