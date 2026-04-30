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

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Feed the lexical lane with corpus-aware statistics so common tokens are discounted and skill-distinctive tokens dominate scoring. The corpus is restricted to active skills to avoid polluting routing with archived or future content.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`lib/corpus/df-idf.ts` computes DF/IDF over the active corpus only (excluding `z_archive/` and `z_future/`). Recomputation is debounced: multiple reindex events within the debounce window collapse into one recompute. The resulting statistics are consumed by the lexical lane in `lib/scorer/lanes/lexical.ts`.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/corpus/df-idf.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` | Automated test | lexical lane scoring against IDF |
| `Playbook scenario [AI-004](../../manual_testing_playbook/06--auto-indexing/004-corpus-df-idf.md).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Auto indexing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--auto-indexing/06-df-idf-corpus.md`

Related references:

- [`03--lifecycle-routing/03-archive-handling.md`](../03--lifecycle-routing/03-archive-handling.md) — archive exclusion.
- [`04--scorer-fusion/01-five-lane-fusion.md`](../04--scorer-fusion/01-five-lane-fusion.md).
- [01-derived-extraction.md](./01-derived-extraction.md).
<!-- /ANCHOR:source-metadata -->
