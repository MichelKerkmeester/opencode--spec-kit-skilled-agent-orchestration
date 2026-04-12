---
title: "001-architecture-boundary-freeze: Freeze Authority Boundaries"
description: "Locks the adoption boundary so every later phase wraps existing Public authorities instead of replacing them."
---

# 001-architecture-boundary-freeze: Freeze Authority Boundaries

## 1. Scope
This sub-phase defines the immutable architecture rule for the adoption work: new UX may add facades, profiles, wrappers, and guidance, but it may not replace or duplicate Public's existing memory, bootstrap, save, graph, or governance authorities. It does not ship any new operator-facing tool by itself.

## 2. Research Sources
- `001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-039.md:7-18`
- `001-research-hybrid-rag-fusion-systems/002-mex-main/research/iterations/iteration-039.md:7-18`
- `001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-039.md:7-20`
- `001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-040.md:8-20`

## 3. Architecture Constraints
Import patterns, not backends. Preserve `memory_search`, `memory_context`, `memory_match_triggers`, `session_bootstrap`, `generate-context.js`, CocoIndex, code graph, causal links, and health/status tooling as the authorities. No new router, scope owner, storage substrate, or lifecycle authority may be introduced here.

## 4. Success Criteria
- All downstream phase docs reference this boundary explicitly.
- The packet records stable non-goals for raw-default storage, markdown-first authority, basename scope, `core=true`, and competing retrieval surfaces.
- Planned integration files are named against the real Public codebase.

## 5. Out of Scope
- Implementing `memory_review`, save wrappers, compaction preservation, or diagnostics.
- Choosing prototype winners beyond recording the backlog boundary.
