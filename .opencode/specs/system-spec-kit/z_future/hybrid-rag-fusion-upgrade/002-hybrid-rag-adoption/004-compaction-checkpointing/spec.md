---
title: "004-compaction-checkpointing: Preserve Context Before Compaction"
description: "Adds a fail-open, JSON-primary pre-compaction preservation contract over the existing transport hook and save authority."
---

# 004-compaction-checkpointing: Preserve Context Before Compaction

## 1. Scope
This sub-phase scopes pre-compaction preservation so the most fragile continuity moment uses existing transport and JSON-primary save authority. It covers compaction action-card placement, dedupe behavior, and fail-open posture. It does not introduce a blocking hook or a second preservation store.

## 2. Research Sources
- `001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-040.md:16-23`
- `001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-039.md:224-235`
- `001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-039.md:15-21`

## 3. Architecture Constraints
Compaction preservation must route through `experimental.session.compacting` and `generate-context.js`; it cannot become a blocking lifecycle authority, hidden side store, or duplicate bootstrap path. Captured context remains advisory and fail-open.

## 4. Success Criteria
- The phase names the existing compaction hook and save authority as the only implementation surfaces.
- The phase records dedupe and advisory behavior so compaction context is not injected repeatedly.
- The phase rejects periodic blocking hooks and shadow preservation flows.

## 5. Out of Scope
- A new compaction backend.
- Mandatory or blocking preservation hooks.
- A replacement for `session_bootstrap` or resume flows.
