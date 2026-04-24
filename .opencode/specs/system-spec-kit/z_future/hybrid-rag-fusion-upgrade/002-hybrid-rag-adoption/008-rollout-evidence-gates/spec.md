---
title: "008-rollout [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/008-rollout-evidence-gates/spec]"
description: "Turns the research portfolio into measurable thresholds, verification ownership, and release gates before public-surface changes ship."
trigger_phrases:
  - "008"
  - "rollout"
  - "spec"
importance_tier: "important"
contextType: "implementation"
---
# 008-rollout-evidence-gates: Define Measurable Adoption Gates

## 1. Scope
This sub-phase defines measurable gates for the adoption work: latency budgets, token caps, storage ceilings, compaction-survival checks, and named CI ownership. It covers the evidence pack required before public-surface rollout. It does not implement the runtime features themselves.

## 2. Research Sources
- `001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-040.md:32-38`
- `001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-040.md:95-104`
- `001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-040.md:16-21`
- `001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-040.md:187-194`

## 3. Architecture Constraints
Rollout gates measure current authorities; they do not redefine them. Metrics must be attached to `memory_search`, `session_bootstrap`, `generate-context.js`, compaction transport, and any future helper surface, with explicit fail-open and rollback expectations.

## 4. Success Criteria
- The phase names concrete threshold categories for retrieval, bootstrap, save, and compaction survival.
- The phase assigns verification ownership before public-surface rollout.
- The phase keeps prototype candidates out of build-now gates unless explicitly promoted.

## 5. Out of Scope
- Shipping helpers without metrics.
- Treating advisory packet prose as sufficient rollout evidence.
- Expanding CI scope to unrelated memory or code-search work.
