---
title: "...arch-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion/spec]"
description: 'title: "Fix Handover vs Drop Routing Confusion"'
trigger_phrases:
  - "arch"
  - "routing"
  - "advisor"
  - "001"
  - "search"
  - "spec"
  - "002"
  - "fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
created: 2026-04-12
level: 2
parent: 002-content-routing-accuracy
status: complete
type: implementation
---
# Fix Handover vs Drop Routing Confusion

## Scope

Relax drop-category dominance when strong handover language coexists with tool or command mentions. Keywords like "current state", "next session", "resume", and "blocker" should elevate the handover signal even when drop-associated terms (tool names, CLI commands) are present.

## Key Files

- `mcp_server/lib/routing/content-router.ts` (around line 369)

## Out of Scope

- Reclassifying existing drop prototypes that are correctly categorized.
- Changes to the handover handler logic downstream of routing.
