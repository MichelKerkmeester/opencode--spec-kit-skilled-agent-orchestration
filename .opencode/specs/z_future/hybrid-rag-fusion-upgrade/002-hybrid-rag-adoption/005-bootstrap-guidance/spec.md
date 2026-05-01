---
title: "005-bootstrap-g [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/005-bootstrap-guidance/spec]"
description: "Improves startup and resume guidance by extending current bootstrap and startup hints rather than adding a new wake-up authority."
trigger_phrases:
  - "005"
  - "bootstrap"
  - "spec"
importance_tier: "important"
contextType: "implementation"
---
# 005-bootstrap-guidance: Teach At Existing Bootstrap Surfaces

## 1. Scope
This sub-phase scopes richer startup and resume guidance at current bootstrap surfaces. It covers bounded hint blocks, recovery nudges, and profile formatting opportunities. It does not introduce a new wake-up tool or replace `session_bootstrap`.

## 2. Research Sources
- `001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-039.md:15-21`
- `001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-039.md:15-21`
- `001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-040.md:24-30`
- `001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-039.md:224-235`

## 3. Architecture Constraints
Bootstrap guidance must extend `session_bootstrap`, `memory_context`, and startup instructions from `context-server.ts`. Any wake-up or formatter idea stays additive and bounded; it cannot become a second recovery authority or replace structural bootstrap routing.

## 4. Success Criteria
- The phase names existing bootstrap and startup files as the only delivery surfaces.
- The phase records what guidance is additive versus authoritative.
- The phase keeps continuity hints separate from save, retrieval, and code-search ownership.

## 5. Out of Scope
- A new `wake_up` or `memory_recall` primary surface.
- Replacing `session_resume` or `session_bootstrap`.
- Routing code search through memory bootstrap guidance.
