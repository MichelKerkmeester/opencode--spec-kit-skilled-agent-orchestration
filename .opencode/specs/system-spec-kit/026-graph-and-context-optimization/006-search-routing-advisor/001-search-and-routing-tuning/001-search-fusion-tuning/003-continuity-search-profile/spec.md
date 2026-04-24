---
title: "...006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile/spec]"
description: 'title: "Add Continuity Search Intent Profile"'
trigger_phrases:
  - "006"
  - "search"
  - "routing"
  - "advisor"
  - "001"
  - "spec"
  - "003"
  - "continuity"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
created: 2026-04-12
level: 2
parent: 001-search-fusion-tuning
status: complete
type: implementation
---
# Add Continuity Search Intent Profile

## Scope

Create a dedicated `continuity` intent profile in the adaptive fusion configuration. Continuity searches prioritize recent spec-doc context and graph relationships over raw keyword matching.

Suggested weights: semantic 0.52, keyword 0.18, recency 0.07, graph 0.23.

## Key Files

- `shared/algorithms/adaptive-fusion.ts`

## Out of Scope

- Modifying existing intent profiles (recall, discovery, navigation).
- Auto-detection of continuity intent; the profile is added but callers wire it separately.
