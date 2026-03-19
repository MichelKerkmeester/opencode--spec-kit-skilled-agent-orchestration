---
title: "Quality Extractors"
description: "Shared parsing functions for extracting quality metadata from YAML frontmatter in memory files."
trigger_phrases:
  - "quality extractors"
  - "quality score parsing"
  - "frontmatter quality flags"
---

# Quality Extractors

> Shared parsing functions for extracting quality metadata from YAML frontmatter in memory files.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. RELATED DOCUMENTS](#3--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This module provides the canonical implementation for extracting `quality_score` and `quality_flags` from YAML frontmatter blocks. It replaces duplicate extraction logic that previously existed in `memory-indexer.ts` and `memory-parser.ts`.

**Key behaviors:**

- Parses only content between `---` delimiters (frontmatter). Body text is never treated as metadata (T040 acceptance criteria).
- Clamps `quality_score` to the `[0, 1]` range. Returns `0` for missing, non-numeric or `NaN` values.
- Extracts `quality_flags` as a string array from YAML list syntax, stripping single and double quotes.
- Handles both Unix (`\n`) and Windows (`\r\n`) line endings.

### Exports

| Export | Type | Description |
| ------ | ---- | ----------- |
| `extractQualityScore` | `function` | Parse `quality_score` from frontmatter, return `number` (0-1) |
| `extractQualityFlags` | `function` | Parse `quality_flags` from frontmatter, return `string[]` |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:structure -->
## 2. STRUCTURE

| File | Purpose |
| ---- | ------- |
| `quality-extractors.ts` | Canonical quality metadata extraction from YAML frontmatter |
| `quality-extractors.test.ts` | 13-case test suite covering edge cases (empty input, clamping, CRLF, body-only values) |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:related -->
## 3. RELATED DOCUMENTS

| Document | Purpose |
| -------- | ------- |
| [shared/README.md](../README.md) | Parent shared library documentation |
| [shared/types.ts](../types.ts) | Shared type definitions |
| `memory-indexer.ts` | Consumer -- uses these extractors during indexing |
| `memory-parser.ts` | Consumer -- uses these extractors during memory parsing |

<!-- /ANCHOR:related -->

---
