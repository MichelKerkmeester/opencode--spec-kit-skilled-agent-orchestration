---
title: "Fix Handover vs Drop Routing Confusion"
status: planned
level: 2
type: implementation
parent: 018-research-content-routing-accuracy
created: 2026-04-12
---

# Fix Handover vs Drop Routing Confusion

## Scope

Relax drop-category dominance when strong handover language coexists with tool or command mentions. Keywords like "current state", "next session", "resume", and "blocker" should elevate the handover signal even when drop-associated terms (tool names, CLI commands) are present.

## Key Files

- `mcp_server/lib/routing/content-router.ts` (around line 369)

## Out of Scope

- Reclassifying existing drop prototypes that are correctly categorized.
- Changes to the handover handler logic downstream of routing.
