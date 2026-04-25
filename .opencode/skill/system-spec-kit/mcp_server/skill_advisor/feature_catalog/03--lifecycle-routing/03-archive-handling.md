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

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Preserve historical and staged skills for inspection (audits, history, pre-activation preview) without letting them surface in live routing recommendations.

---

## 2. CURRENT REALITY

`lib/lifecycle/archive-handling.ts` classifies skills under `z_archive/` and `z_future/` as indexed-but-not-routed. They appear in inspection surfaces (graph status, catalog, playbook cross-references) but are excluded from:

1. `advisor_recommend` recommendations.
2. DF/IDF corpus statistics (see `lib/corpus/df-idf.ts`).
3. 5-lane fusion scoring inputs.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/lifecycle/archive-handling.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/corpus/df-idf.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` — archived-skill exclusion.
- Playbook scenario [LC-003](../../manual_testing_playbook/07--lifecycle-routing/003-archive-handling.md).

---

## 5. RELATED

- [`02--auto-indexing/06-df-idf-corpus.md`](../02--auto-indexing/06-df-idf-corpus.md).
- [02-supersession.md](./02-supersession.md).
- [04-schema-migration.md](./04-schema-migration.md).
