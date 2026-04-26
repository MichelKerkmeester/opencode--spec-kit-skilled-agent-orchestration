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

## TABLE OF CONTENTS

- [1. PURPOSE](#1-purpose)
- [2. CURRENT REALITY](#2-current-reality)
- [3. SOURCE FILES](#3-source-files)
- [4. TEST COVERAGE](#4-test-coverage)
- [5. RELATED](#5-related)

---

## 1. PURPOSE

Persist derived extraction so the scorer and rebuild-from-source pipeline can both consume it, while keeping the source-of-truth SKILL.md untouched.

---

## 2. CURRENT REALITY

`lib/derived/sync.ts` takes the output of `lib/derived/extract.ts`, routes it through `lib/derived/sanitizer.ts`, and writes only the `derived` block of each skill's `graph-metadata.json`. Non-derived metadata in the same file is preserved byte-for-byte. Partial writes are avoided by writing through a temp file plus atomic rename. SKILL.md is never touched.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/derived/sync.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/derived/sanitizer.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/lifecycle-derived-metadata.vitest.ts` — sync correctness and non-derived preservation.
- Playbook scenario [AI-001](../../manual_testing_playbook/06--auto-indexing/001-derived-extraction.md).

---

## 5. RELATED

- [01-derived-extraction.md](./01-derived-extraction.md).
- [02-sanitizer.md](./02-sanitizer.md).
- [`01--daemon-and-freshness/06-rebuild-from-source.md`](../01--daemon-and-freshness/06-rebuild-from-source.md).
