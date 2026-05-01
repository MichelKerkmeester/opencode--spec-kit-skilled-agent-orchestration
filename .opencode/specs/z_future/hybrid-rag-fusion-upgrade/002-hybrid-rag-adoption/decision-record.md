---
title: "Decision Record [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/decision-record]"
description: "decision record document for 002-hybrid-rag-adoption."
trigger_phrases:
  - "decision"
  - "record"
  - "decision record"
  - "002"
  - "hybrid"
importance_tier: "important"
contextType: "planning"
---
# Decision Record: 002-hybrid-rag-adoption

## DECISION 1: Keep Public's Routed Multi-Lane Architecture
- Context: Cross-phase synthesis repeatedly rejects substrate replacement and reinforces scoped retrieval, bootstrap, maintenance, and graph planes.
- Decision: `memory_search`, `memory_context`, `memory_match_triggers`, `session_bootstrap`, `generate-context.js`, CocoIndex, code graph, causal links, and health/status tooling remain the authorities.
- Evidence: `001-engram-main/research/iterations/iteration-039.md:7-18`, `002-mex-main/research/iterations/iteration-039.md:7-18`, `003-modus-memory-main/research/iterations/iteration-040.md:1-18`, `005-mempalace/research/iterations/iteration-040.md:8-20`.

## DECISION 2: Import Patterns, Not Backends
- Context: Every external system contributed useful behaviors, but none survived as a safe replacement authority.
- Decision: New UX must be implemented as thin facades, wrappers, formatters, or guidance layers over existing Public authorities.
- Evidence: `003-modus-memory-main/research/iterations/iteration-039.md:15-21`, `003-modus-memory-main/research/iterations/iteration-040.md:1-4`, `005-mempalace/research/iterations/iteration-039.md:15-21`.

## DECISION 3: Ship `memory_review` First
- Context: Modus produced the clearest first helper surface by pairing existing FSRS mechanics with explicit graded review instead of silent write-on-read reinforcement.
- Decision: `memory_review` is the first new tool-level adoption target; `memory_due` is deferred until `memory_review` stabilizes.
- Evidence: `003-modus-memory-main/research/iterations/iteration-040.md:10-21`.

## DECISION 4: Compaction Checkpointing Must Reuse `generate-context.js`
- Context: MemPalace and Mnemosyne both validated compaction-time continuity work, but the research rejected new save authorities and blocking hooks.
- Decision: Pre-compaction preservation must be JSON-primary, fail-open, and routed through the existing `generate-context.js` authority and current compaction transport.
- Evidence: `004-opencode-mnemosyne-main/research/iterations/iteration-039.md:224-235`, `005-mempalace/research/iterations/iteration-040.md:16-30`.

## DECISION 5: Require Measurable Rollout Gates Before Public-Surface Changes
- Context: The research converged on adoption scope, but late iterations explicitly called out missing latency, token, storage, and verification thresholds.
- Decision: No public-surface change ships from this adoption track without measurable rollout gates and named CI ownership.
- Evidence: `003-modus-memory-main/research/iterations/iteration-040.md:16-21`, `005-mempalace/research/iterations/iteration-040.md:32-45`, `005-mempalace/research/iterations/iteration-040.md:95-104`.

## DECISION 6: Run The Investigation Track In Parallel, Not Inline With 001-009
- Context: The five research phases converged on a safe adopt-now slice, but they also left explicit prototype-later, measurement, and NEW FEATURE seams around passive capture, tool packaging, drift-checker boundaries, decay defaults, lexical weighting, hybrid regression, connected-doc hints, temporal facts, and wake-up formatting.
- Decision: `010` through `018` run in parallel to the current adoption track after `001-architecture-boundary-freeze`. Their outcomes feed future adopt/prototype/reject decisions and do not block or expand the current `001` through `009` implementation scope.
- Evidence: `001-engram-main/research/iterations/iteration-040.md:311-311`, `002-mex-main/research/iterations/iteration-040.md:318-351`, `003-modus-memory-main/research/iterations/iteration-040.md:32-41`, `004-opencode-mnemosyne-main/research/iterations/iteration-038.md:9218-9261`, `005-mempalace/research/iterations/iteration-040.md:89-103`.
