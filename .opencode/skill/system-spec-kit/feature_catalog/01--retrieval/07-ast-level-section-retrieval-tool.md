# AST-level section retrieval tool

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)
- [5. IN SIMPLE TERMS](#5--in-simple-terms)

## 1. OVERVIEW

Tracks the deferred AST-based section retrieval tool for precise heading-level document access.

## 2. CURRENT REALITY

**PLANNED (Sprint 019): DEFERRED.** `read_spec_section(filePath, heading)` via Markdown AST parsing (`remark`) is deferred until spec docs routinely exceed ~1000 lines. Existing R7 anchor-aware thinning remains the current approach. Estimated effort: M (5-7 days).

---

## 3. SOURCE FILES

No source files yet. This feature is planned but not yet implemented.

## 4. SOURCE METADATA

- Group: Extra features (Sprint 019)
- Source feature title: AST-level section retrieval tool
- Current reality source: feature_catalog.md

## 5. IN SIMPLE TERMS

This planned feature would let you pull out a single section from a large document by its heading, like opening a book directly to the chapter you need instead of flipping through the whole thing. It is not built yet because current documents are small enough that fetching the whole file works fine.
