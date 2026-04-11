---
title: "002-memory-review-tool: Ship Memory Review First"
description: "Defines the first new helper surface as a graded memory review tool built on existing FSRS and validation primitives."
---

# 002-memory-review-tool: Ship Memory Review First

## 1. Scope
This sub-phase designs and scopes `memory_review` as the first new helper tool in the adoption track. It covers graded review semantics, integration with the existing FSRS scheduler, and its relationship to current validation and confidence flows. It does not ship `memory_due` or default write-on-read reinforcement.

## 2. Research Sources
- `001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-040.md:10-21`
- `001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-039.md:23-29`
- `001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-039.md:39-45`

## 3. Architecture Constraints
`memory_review` must wrap the existing FSRS and mutation stack rather than replace `memory_validate`, `trackAccess`, or the search pipeline. It cannot become a second retrieval authority, silent ranking override, or review-on-read side effect.

## 4. Success Criteria
- The phase identifies a helper contract for graded review that uses existing FSRS primitives.
- The phase makes `memory_review` the first approved new tool and defers `memory_due`.
- The phase names integration points in `tool-schemas.ts`, FSRS logic, and current memory mutation handlers.

## 5. Out of Scope
- Shipping `memory_due`.
- Auto-review on search or trigger recall.
- Replacing `memory_validate` telemetry or confidence semantics.
