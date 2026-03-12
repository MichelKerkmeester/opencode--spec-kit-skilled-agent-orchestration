# Constitutional memory as expert knowledge injection

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Constitutional memory as expert knowledge injection.

## 2. CURRENT REALITY

Constitutional-tier memories receive a `retrieval_directive` metadata field formatted as explicit instruction prefixes for LLM consumption. Examples: "Always surface when: user asks about memory save rules" or "Prioritize when: debugging search quality."

Rule patterns are extracted from content using a ranked list of imperative verbs (must, always, never, should, require) and condition-introducing words (when, if, for, during). Scanning is capped at 2,000 characters from the start of content, and each directive component is capped at 120 characters. The `enrichWithRetrievalDirectives()` function maps over results without filtering or reordering. The enrichment is wired into `hooks/memory-surface.ts` before returning results.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/retrieval-directives.ts` | Lib | Constitutional retrieval injection |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/retrieval-directives.vitest.ts` | Retrieval directive tests |

## 4. SOURCE METADATA

- Group: Retrieval enhancements
- Source feature title: Constitutional memory as expert knowledge injection
- Current reality source: feature_catalog.md
