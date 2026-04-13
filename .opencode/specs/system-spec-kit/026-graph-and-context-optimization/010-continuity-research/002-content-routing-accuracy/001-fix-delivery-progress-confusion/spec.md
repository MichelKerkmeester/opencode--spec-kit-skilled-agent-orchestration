---
title: "Fix Delivery vs Progress Routing Confusion"
status: planned
level: 2
type: implementation
parent: 002-content-routing-accuracy
created: 2026-04-12
---

# Fix Delivery vs Progress Routing Confusion

## Scope

Strengthen `narrative_delivery` cue definitions with explicit sequencing, gating, and rollout language so that implementation-oriented verbs do not override the delivery classification. Update affected prototypes to reflect the sharper boundary.

## Key Files

- `mcp_server/lib/routing/content-router.ts` (cue definitions around line 340)

## Out of Scope

- Adding new routing categories or changing the tier architecture.
- Modifying progress-tracking cues beyond disambiguation.
