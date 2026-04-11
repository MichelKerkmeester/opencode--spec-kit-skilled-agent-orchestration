---
title: "Gate B — Foundation"
feature: phase-018-gate-b-foundation
level: 3
status: planned
parent: 018-canonical-continuity-refactor
gate: B
description: "Planned closeout shape for Gate B. Post-implementation facts stay intentionally stubbed until the foundation work actually lands."
trigger_phrases:
  - "gate b implementation summary"
  - "foundation closeout"
  - "archive flip summary"
  - "phase 018"
  - "planned summary"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-gate-b-foundation |
| **Completed** | TBD after Gate B implementation closes |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Gate B is expected to turn phase 018 from research into operational reality. When this gate closes, you should be able to point to one proof package that shows the migration was rehearsed on a copy, rolled back cleanly, rerun without drift, and then applied in production with the 155-row archive flip, the approved `causal_edges` anchor fields, and live archived-result observability.

The finished Gate B story should read like this: the team corrected the earlier `is_archived` add-column misconception, kept migration ownership canonical in `vector-index-schema.ts`, shipped the bounded archive flip, demoted archived rows to `x0.3` in fusion ranking, and exposed `archived_hit_rate` so later permanence decisions can be data-driven. This packet is intentionally pre-populated before implementation, so that narrative is the target outcome rather than a claim that the work already landed.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

TBD after Gate B implementation closes.

Planned delivery story:
- Start with the dual-fork rehearsal from iteration 037 and do not approve the maintenance window until rerun and hard rollback both pass.
- Apply the approved `causal_edges` anchor-column migration and storage threading in production only after the copy proof is complete.
- Run the bounded archive flip, validate the 155-row target, then prove the `x0.3` ranking change and `archived_hit_rate` visibility before handing off to Gate C.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse `memory_index.is_archived` instead of adding it again | `../resource-map.md` F-1 and `../scratch/resource-map/01-schema.md` show the column already exists in the canonical schema and downgrade rebuild path. |
| Keep canonical migration ownership inline in `vector-index-schema.ts` | ADR-001 avoids split-brain schema ownership while keeping fresh bootstrap behavior aligned with migrated behavior. |
| Require hard rollback proof before production cutover | Iteration 037 makes hard rollback, not soft rollback, the certification path for Gate B promotion. |
| Expose `archived_hit_rate` in Gate B itself | Gate B needs to leave behind the observability signal that phase 020 will later use for permanence decisions. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Copy-first migration rehearsal + JSON evidence | TBD after Gate B implementation closes |
| Rerun proves operator-level no-op | TBD after Gate B implementation closes |
| Hard rollback returns logical baseline equivalence | TBD after Gate B implementation closes |
| Production archive flip reaches 155 rows | TBD after Gate B implementation closes |
| Ranking proof for fresh-over-archived ordering | TBD after Gate B implementation closes |
| `archived_hit_rate` visible in stats/dashboard | TBD after Gate B implementation closes |
| Mixed-edge 2-hop causal BFS works | TBD after Gate B implementation closes |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This is a planned closeout shell, not a factual post-implementation record.** Post-implementation facts stay intentionally stubbed until Gate B actually lands.
2. **The Gate B stats hook still needs implementation work.** The target reporting surface is `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts`, but this packet remains a planned closeout shell until the runtime change actually lands.
3. **The broader tuple-column proposal from iteration 035 remains unresolved for this gate.** Gate B is scoped to the prompt's narrower anchor-column plan unless a later decision widens it explicitly.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
