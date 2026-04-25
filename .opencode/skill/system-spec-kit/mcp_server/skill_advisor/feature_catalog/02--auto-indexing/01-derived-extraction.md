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

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Automatically generate routing-ready derived entries for every skill without hand-written routing metadata. Extraction stays deterministic so identical sources always produce identical derived output.

---

## 2. CURRENT REALITY

`lib/derived/extract.ts` reads frontmatter, SKILL.md body, fenced examples, `references/**`, `assets/**`, `intent_signals`, `source_docs`, and declared `derived.key_files`. It emits n-grams and triggered patterns with stable sort order. `lib/derived/sync.ts` writes the result into `graph-metadata.json.derived` only; SKILL.md is never mutated. The extraction pipeline is the same path consumed by rebuild-from-source (see [`01--daemon-and-freshness/06-rebuild-from-source.md`](../01--daemon-and-freshness/06-rebuild-from-source.md)).

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/derived/extract.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/derived/sync.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/lifecycle-derived-metadata.vitest.ts` — derived-sync correctness.
- Playbook scenario [AI-001](../../manual_testing_playbook/06--auto-indexing/001-derived-extraction.md).

---

## 5. RELATED

- [02-sanitizer.md](./02-sanitizer.md).
- [03-provenance-and-trust-lanes.md](./03-provenance-and-trust-lanes.md).
- [05-anti-stuffing.md](./05-anti-stuffing.md).
