---
title: "014-bm25-field-weight-evaluation: Evaluate BM25 Field Weights"
description: "Measures whether Modus-style BM25 field weighting should influence Public's constrained lexical retrieval surfaces."
---

# 014-bm25-field-weight-evaluation: Evaluate BM25 Field Weights

## 1. Scope
This sub-phase investigates whether Modus-style BM25 field weighting is worth exposing or tuning inside Public's constrained lexical retrieval path. It studies field-mapping, benchmark design, and operator visibility while preserving Public's current hybrid architecture. It does not approve BM25 as a replacement for hybrid retrieval.

## 2. Research Sources
- `001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:120-129`
- `001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:527-542`
- `001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-029.md:645-654`
- `001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-040.md:33-41`

## 3. Architecture Constraints
- Public's hybrid retrieval stack remains primary; BM25 weighting is at most a bounded lexical-lane experiment.
- Field weights must stay internal or debug-visible unless benchmarks prove operator-facing controls are worth the complexity.
- Any study must preserve current RRF and reranking ownership.

## 4. Investigation Questions
- Which Public memory fields correspond cleanly to Modus's path, source, subject, title, tags, and body weighting model?
- Do any query classes meaningfully improve when weights change, or is current hybrid retrieval already sufficient?
- Should future tuning be hard-coded, config-gated, eval-only, or operator-exposed?
- What judged relevance, latency, and regression thresholds would justify follow-on implementation work?

## 5. Success Criteria
- The packet defines a field-mapping table between Modus weights and Public lexical inputs.
- The packet defines a benchmark pack for constrained lexical queries and regression checks against current hybrid results.
- The packet ends with a clear exit condition: preserve current weighting, prototype internal tuning, or reject the idea.

## 6. Out of Scope
- Replacing Public hybrid retrieval with BM25.
- Shipping user-facing field-weight controls.
- Expanding lexical fallback beyond bounded evaluation work.
