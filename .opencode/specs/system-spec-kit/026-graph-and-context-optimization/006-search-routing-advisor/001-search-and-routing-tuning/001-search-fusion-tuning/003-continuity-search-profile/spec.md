---
title: "Add Continuity Search Intent Profile"
status: complete
level: 2
type: implementation
parent: 001-search-fusion-tuning
created: 2026-04-12
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
