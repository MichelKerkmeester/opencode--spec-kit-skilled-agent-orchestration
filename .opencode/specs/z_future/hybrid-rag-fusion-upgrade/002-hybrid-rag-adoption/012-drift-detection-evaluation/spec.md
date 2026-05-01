---
title: "012-dri [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/012-drift-detection-evaluation/spec]"
description: "Determines which Mex checker families belong on Public spec and memory surfaces after the adopt-now advisory trio."
trigger_phrases:
  - "012"
  - "dri"
  - "spec"
  - "drift"
importance_tier: "important"
contextType: "implementation"
---
# 012-drift-detection-evaluation: Evaluate Drift Detection

## 1. Scope
This sub-phase investigates which Mex-style drift checker families should eventually apply to Public's spec and memory surfaces beyond the already-selected advisory checker trio. It focuses on checker scope, issue schema, false-positive control, and advisory-versus-blocking promotion rules. It does not ship new checker implementations in this packet.

## 2. Research Sources
- `001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-029.md:30-45`
- `001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-038.md:8-19`
- `001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-040.md:318-351`

## 3. Architecture Constraints
- Drift detection remains a separate advisory integrity lane and never becomes a retrieval ranker.
- Recovery stays on `session_bootstrap` and `/spec_kit:resume`; integrity annotates but does not replace those surfaces.
- Any future doctor surface remains planner-only over existing tools unless a later packet proves otherwise.

## 4. Investigation Questions
- Which checker families actually fit Public's spec and memory artifacts after `path`, `edges`, and `index-sync`: command existence, dependency claims, cross-file contradictions, script coverage, freshness, or none?
- What issue envelope and false-positive rules are needed so checkers stay usable across packet-local specs, memory files, and repo docs?
- Which surfaces should remain strictly advisory forever, and which might earn blocking promotion with fixture-backed evidence?
- How should a future planner or doctor surface consume checker output without creating a second repair authority?

## 5. Success Criteria
- The packet classifies each remaining Mex checker family as likely adopt, prototype, or reject for Public surfaces.
- The packet defines baseline fixtures and false-positive tests required before any checker expands beyond the current trio.
- The packet ends with an exit condition: advance one or more checker families, keep them deferred, or reject them for Public.

## 6. Out of Scope
- Implementing new checker code.
- Adding a blended drift score or mixing integrity into retrieval/ranking.
- Replacing current recovery, save, or repair authorities with a Mex-style scaffold workflow.
