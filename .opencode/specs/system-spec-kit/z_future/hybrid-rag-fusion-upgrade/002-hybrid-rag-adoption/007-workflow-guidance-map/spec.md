---
title: "007-workflow [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/007-workflow-guidance-map/spec]"
description: "Maps operator tasks to existing Public tools and approved thin facades so guidance improves before deeper runtime changes ship."
trigger_phrases:
  - "007"
  - "workflow"
  - "spec"
importance_tier: "important"
contextType: "implementation"
---
# 007-workflow-guidance-map: Publish Task-To-Tool Routing

## 1. Scope
This sub-phase defines a task-to-tool routing map for the adoption packet. It explains which existing Public surfaces solve which operator problems and where thin facades fit. It does not create new runtime authority or rewrite the search and bootstrap engines.

## 2. Research Sources
- `001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-040.md:12-20`
- `001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-039.md:117-122`
- `001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-039.md:229-235`

## 3. Architecture Constraints
The map must teach existing routed lanes first: `memory_context`, `memory_search`, `memory_match_triggers`, `session_bootstrap`, `memory_health`, `memory_save`, CocoIndex, and code graph. Any new helper named here must clearly delegate into those authorities.

## 4. Success Criteria
- The phase documents clear task-to-tool routing without inventing backend changes.
- The phase names exact workflow/doc surfaces where the map should live.
- The phase reduces ambiguity about when to use saved-memory tools versus code-intelligence tools.

## 5. Out of Scope
- Replacing current startup instructions with a new router.
- Combining memory retrieval, CocoIndex, and code graph into one undifferentiated search lane.
- Shipping prototype-only helpers as production defaults.
