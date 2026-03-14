# Encoding-intent capture at index time

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. IN SIMPLE TERMS](#3--in-simple-terms)
- [4. SOURCE FILES](#4--source-files)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW
Encoding-intent capture classifies content as `document`, `code` or `structured_data` at index time using heuristic scoring.

## 2. CURRENT REALITY
An `encoding_intent` field classifies content type at index time as `document`, `code` or `structured_data` using heuristic scoring. The code path scores fenced code blocks, import/export/function keyword density and programming punctuation density. The structured data path scores YAML frontmatter, pipe tables and key-value patterns. The classification threshold is 0.4. Anything below defaults to `document`.

The classification is stored as read-only metadata on the `encoding_intent` column for both parent records and individual chunks. It has no retrieval-time scoring impact. The intent is to build a labeled dataset that future work can use for type-aware retrieval. Runs behind the `SPECKIT_ENCODING_INTENT` flag (default ON).

## 3. IN SIMPLE TERMS
When a memory is saved, the system labels it as regular text, code or structured data. Right now this label is stored but not used for search ranking. It is groundwork for the future: once the system knows what type of content it is looking at, it can treat a code snippet differently from a meeting note. Think of it as sorting your files into labeled folders before you need to search them.
## 4. SOURCE FILES
### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/encoding-intent.ts` | Lib | Encoding intent classification |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/encoding-intent.vitest.ts` | Encoding intent tests |

## 5. SOURCE METADATA
- Group: Memory quality and indexing
- Source feature title: Encoding-intent capture at index time
- Current reality source: feature_catalog.md

