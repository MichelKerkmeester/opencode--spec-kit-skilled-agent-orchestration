---
title: "Fix Delivery vs Progress Routing Confusion - Decision Record"
status: planned
---
# Decision Record
## ADR-001: Fix Cue Asymmetry Instead of Retuning Thresholds
**Context:** `../research/research.md:18-34` shows `narrative_progress` has broader implementation verbs and stronger floors than `narrative_delivery`, while the delivery prototypes rely on sequencing and verification-order language the router does not currently score well.
**Decision:** Strengthen the delivery cues and add a `strongDeliveryMechanics` guard around the progress floor in `mcp_server/lib/routing/content-router.ts:345-352,853-860` rather than changing Tier1 or Tier2 thresholds.
**Rationale:** The confusion comes from uneven cue strength, so threshold-only tuning would hide the overlap instead of correcting it.
**Consequences:** The router architecture stays unchanged, prototype and regression updates become part of the same phase, and later threshold tuning can happen only after the cue fix is measured on its own.
