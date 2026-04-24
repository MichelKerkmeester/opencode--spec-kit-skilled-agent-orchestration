---
title: "Checklist [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/002-memory-review-tool/checklist]"
description: "checklist document for 002-memory-review-tool."
trigger_phrases:
  - "checklist"
  - "002"
  - "memory"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: 002-memory-review-tool

## P0
- [ ] `memory_review` is explicitly the first new helper surface.
- [ ] FSRS integration points are named.
- [ ] `memory_due` is deferred until after `memory_review` stabilizes.

## P1
- [ ] The phase explains how `memory_review` differs from `memory_validate`.
- [ ] The phase keeps review separate from search-time mutation.

