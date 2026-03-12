# Encoding-intent capture at index time

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Encoding-intent capture at index time.

## 2. CURRENT REALITY

An `encoding_intent` field classifies content type at index time as `document`, `code` or `structured_data` using heuristic scoring. The code path scores fenced code blocks, import/export/function keyword density and programming punctuation density. The structured data path scores YAML frontmatter, pipe tables and key-value patterns. The classification threshold is 0.4; anything below defaults to `document`.

The classification is stored as read-only metadata on the `encoding_intent` column for both parent records and individual chunks. It has no retrieval-time scoring impact. The intent is to build a labeled dataset that future work can use for type-aware retrieval. Runs behind the `SPECKIT_ENCODING_INTENT` flag (default ON).

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/encoding-intent.ts` | Lib | Encoding intent classification |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/encoding-intent.vitest.ts` | Encoding intent tests |

## 4. SOURCE METADATA

- Group: Memory quality and indexing
- Source feature title: Encoding-intent capture at index time
- Current reality source: feature_catalog.md
