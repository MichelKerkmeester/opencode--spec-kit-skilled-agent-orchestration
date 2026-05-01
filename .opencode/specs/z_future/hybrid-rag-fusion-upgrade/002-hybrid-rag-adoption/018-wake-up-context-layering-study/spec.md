---
title: "018 [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/018-wake-up-context-layering-study/spec]"
description: "Evaluates whether a bounded wake-up formatter on top of session_bootstrap improves recovery without creating a second bootstrap authority."
trigger_phrases:
  - "018"
  - "spec"
  - "wake"
importance_tier: "important"
contextType: "implementation"
---
# 018-wake-up-context-layering-study: Study Wake-Up Context Layering

## 1. Scope
This sub-phase investigates whether MemPalace-style wake-up layering is worth prototyping only as a bounded read model or formatter on top of `session_bootstrap` and related recovery surfaces. It studies token budgets, recovery quality, and duplication risk. It does not approve a new wake-up command or storage model.

## 2. Research Sources
- `001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-022.md:12-16`
- `001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-038.md:39-43`
- `001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-040.md:56-60`

## 3. Architecture Constraints
- `session_bootstrap` remains the recovery authority.
- Any wake-up view must be formatter-level only and must not become a second bootstrap entrypoint.
- Token caps, retrieval caps, and provenance labeling must be explicit before any prototype advances.

## 4. Investigation Questions
- What should a wake-up profile contain: compact hierarchy, quote-carrying evidence snippets, or both?
- Which existing surfaces should host it: `session_bootstrap`, `memory_context({ mode: "resume" })`, startup hints, or none?
- What token and retrieval budgets keep the view additive instead of bloated or redundant?
- Does the view measurably improve recovery success after compaction or resume compared with current bootstrap output?

## 5. Success Criteria
- The packet defines at least one wake-up formatter candidate and a baseline comparison against current bootstrap behavior.
- The packet defines token, retrieval, and duplication budgets for any future prototype.
- The packet ends with a clear exit condition: prototype a bounded formatter, defer the idea, or reject it.

## 6. Out of Scope
- Adding a separate wake-up command.
- Importing L0-L3 storage semantics or AAAK-first startup.
- Replacing current bootstrap or save authority.
