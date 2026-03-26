---
title: "Encoding-intent capture at index time"
description: "Encoding-intent capture classifies content as `document`, `code` or `structured_data` at index time using heuristic scoring."
---

# Encoding-intent capture at index time

## 1. OVERVIEW

Encoding-intent capture classifies content as `document`, `code` or `structured_data` at index time using heuristic scoring.

When a memory is saved, the system labels it as regular text, code or structured data. Right now this label is stored but not used for search ranking. It is groundwork for the future: once the system knows what type of content it is looking at, it can treat a code snippet differently from a meeting note. Think of it as sorting your files into labeled folders before you need to search them.

---

## 2. CURRENT REALITY

An `encoding_intent` field classifies content type at index time as `document`, `code` or `structured_data` using heuristic scoring. The code path scores fenced code blocks, import/export/function keyword density and programming punctuation density. The structured data path scores YAML frontmatter, pipe tables and key-value patterns. The classification threshold is 0.4. Anything below defaults to `document`.

The classification is stored as read-only metadata on the `encoding_intent` column for both parent records and individual chunks. It has no retrieval-time scoring impact. The intent is to build a labeled dataset that future work can use for type-aware retrieval. Runs behind the `SPECKIT_ENCODING_INTENT` flag (default ON).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/encoding-intent.ts` | Lib | Encoding intent classification |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/encoding-intent.vitest.ts` | Encoding intent tests |

---

## 4. SOURCE METADATA

- Group: Memory quality and indexing
- Source feature title: Encoding-intent capture at index time
- Current reality source: FEATURE_CATALOG.md
