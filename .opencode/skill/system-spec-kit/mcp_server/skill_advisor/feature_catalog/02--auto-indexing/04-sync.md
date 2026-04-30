---
title: "Graph-Metadata Derived Sync"
description: "Write pipeline that persists derived extraction into graph-metadata.json.derived without ever mutating SKILL.md."
trigger_phrases:
  - "derived sync"
  - "graph-metadata write"
  - "derived.json write"
  - "sync derived block"
---

# Graph-Metadata Derived Sync

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Persist derived extraction so the scorer and rebuild-from-source pipeline can both consume it, while keeping the source-of-truth SKILL.md untouched.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`lib/derived/sync.ts` takes the output of `lib/derived/extract.ts`, routes it through `lib/derived/sanitizer.ts`, and writes only the `derived` block of each skill's `graph-metadata.json`. Non-derived metadata in the same file is preserved byte-for-byte. Partial writes are avoided by writing through a temp file plus atomic rename. SKILL.md is never touched.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/derived/sync.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/derived/sanitizer.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/lifecycle-derived-metadata.vitest.ts` | Automated test | sync correctness and non-derived preservation |
| `Playbook scenario [AI-001](../../manual_testing_playbook/06--auto-indexing/001-derived-extraction.md).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Auto indexing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--auto-indexing/04-sync.md`

Related references:

- [01-derived-extraction.md](./01-derived-extraction.md).
- [02-sanitizer.md](./02-sanitizer.md).
- [`01--daemon-and-freshness/06-rebuild-from-source.md`](../01--daemon-and-freshness/06-rebuild-from-source.md).
<!-- /ANCHOR:source-metadata -->
