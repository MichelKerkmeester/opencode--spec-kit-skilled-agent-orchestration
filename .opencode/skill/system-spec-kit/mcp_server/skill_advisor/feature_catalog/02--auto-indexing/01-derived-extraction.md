---
title: "Deterministic Derived Extraction"
description: "Deterministic n-gram and pattern extraction pipeline that generates graph-metadata.json.derived entries from SKILL.md sources."
trigger_phrases:
  - "derived extraction"
  - "n-gram extraction"
  - "graph-metadata derived"
  - "deterministic extraction"
---

# Deterministic Derived Extraction

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Automatically generate routing-ready derived entries for every skill without hand-written routing metadata. Extraction stays deterministic so identical sources always produce identical derived output.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`lib/derived/extract.ts` reads frontmatter, SKILL.md body, fenced examples, `references/**`, `assets/**`, `intent_signals`, `source_docs`, and declared `derived.key_files`. It emits n-grams and triggered patterns with stable sort order. `lib/derived/sync.ts` writes the result into `graph-metadata.json.derived` only; SKILL.md is never mutated. The extraction pipeline is the same path consumed by rebuild-from-source (see [`01--daemon-and-freshness/06-rebuild-from-source.md`](../01--daemon-and-freshness/06-rebuild-from-source.md)).

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/derived/extract.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/derived/sync.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/lifecycle-derived-metadata.vitest.ts` | Automated test | derived-sync correctness |
| `Playbook scenario [AI-001](../../manual_testing_playbook/06--auto-indexing/001-derived-extraction.md).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Auto indexing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--auto-indexing/01-derived-extraction.md`

Related references:

- [02-sanitizer.md](./02-sanitizer.md).
- [03-provenance-and-trust-lanes.md](./03-provenance-and-trust-lanes.md).
- [05-anti-stuffing.md](./05-anti-stuffing.md).
<!-- /ANCHOR:source-metadata -->
