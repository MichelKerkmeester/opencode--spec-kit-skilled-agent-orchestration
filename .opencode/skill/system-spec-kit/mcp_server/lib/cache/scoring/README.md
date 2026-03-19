---
title: "Cache Scoring"
description: "Historical documentation for the cache/scoring namespace. The re-export proxy was removed in Phase 15."
trigger_phrases:
  - "cache scoring"
  - "composite scoring re-export"
---


# Cache Scoring

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. RELATED DOCUMENTS](#2--related-documents)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

`lib/cache/scoring/` previously contained a barrel re-export of composite scoring from `lib/scoring/composite-scoring.ts`. The re-export proxy (`composite-scoring.ts`) was removed in Phase 15 (Internal Module Boundary Remediation) after confirming zero consumers in source code.

All scoring functions, types, constants and weight configurations live in the canonical `lib/scoring/` directory. Import directly from there.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:related-documents -->
## 2. RELATED DOCUMENTS

- `../../scoring/composite-scoring.ts` -- canonical source of all scoring logic
- `../../scoring/folder-scoring.ts` -- recency decay used by composite scoring
- `../../scoring/importance-tiers.ts` -- tier configuration consumed by importance scoring
- `../../scoring/interference-scoring.ts` -- TM-01 interference penalty applied during post-processing

<!-- /ANCHOR:related-documents -->
