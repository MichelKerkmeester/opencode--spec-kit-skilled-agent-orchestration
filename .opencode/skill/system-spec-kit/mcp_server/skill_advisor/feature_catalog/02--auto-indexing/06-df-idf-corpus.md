---
title: "DF/IDF Corpus Stats (Active-Only)"
description: "Document-frequency and inverse-document-frequency statistics computed only over the active corpus, with debounced recomputation."
trigger_phrases:
  - "df-idf corpus"
  - "active corpus stats"
  - "idf debounced"
  - "lexical idf"
---

# DF/IDF Corpus Stats (Active-Only)

## TABLE OF CONTENTS

- [1. PURPOSE](#1-purpose)
- [2. CURRENT REALITY](#2-current-reality)
- [3. SOURCE FILES](#3-source-files)
- [4. TEST COVERAGE](#4-test-coverage)
- [5. RELATED](#5-related)

---

## 1. PURPOSE

Feed the lexical lane with corpus-aware statistics so common tokens are discounted and skill-distinctive tokens dominate scoring. The corpus is restricted to active skills to avoid polluting routing with archived or future content.

---

## 2. CURRENT REALITY

`lib/corpus/df-idf.ts` computes DF/IDF over the active corpus only (excluding `z_archive/` and `z_future/`). Recomputation is debounced: multiple reindex events within the debounce window collapse into one recompute. The resulting statistics are consumed by the lexical lane in `lib/scorer/lanes/lexical.ts`.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/corpus/df-idf.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` — lexical lane scoring against IDF.
- Playbook scenario [AI-004](../../manual_testing_playbook/06--auto-indexing/004-corpus-df-idf.md).

---

## 5. RELATED

- [`03--lifecycle-routing/03-archive-handling.md`](../03--lifecycle-routing/03-archive-handling.md) — archive exclusion.
- [`04--scorer-fusion/01-five-lane-fusion.md`](../04--scorer-fusion/01-five-lane-fusion.md).
- [01-derived-extraction.md](./01-derived-extraction.md).
