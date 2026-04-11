---
title: "Gate A — Pre-work"
feature: phase-018-gate-a-prework
level: 2
status: planned
parent: 018-canonical-continuity-refactor
gate: A
description: "Planned closeout shape for Gate A. Post-implementation facts stay intentionally stubbed until the work is actually complete."
trigger_phrases:
  - "gate a implementation summary"
  - "pre-work closeout"
  - "canonical continuity"
  - "phase 018"
  - "planned summary"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->
# Implementation Summary

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-gate-a-prework |
| **Completed** | TBD after Gate A implementation closes |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Gate A is expected to remove the blockers that would otherwise make phase 018 unsafe to start. The planned deliverable is a clean launch surface: repaired template anchors, legal special-template merge targets, canonical root-packet summaries in place before any archive flip, and a proven backup/restore/rollback path for the SQLite store. That shape comes directly from `../implementation-design.md` "Migration Strategy (M4)", `../resource-map.md` §4 Gate A, and iteration 020 "Phase 018.0 — Pre-work".

### Planned Gate A deliverables

When Gate A closes, you should be able to point to a short list of tangible outcomes instead of research intent:

1. Level 3 and Level 3+ spec templates no longer fail on orphan `metadata` anchors.
2. `.opencode/skill/system-spec-kit/templates/handover.md`, `.opencode/skill/system-spec-kit/templates/research.md`, and `.opencode/skill/system-spec-kit/templates/debug-delegation.md` expose explicit anchors before save-path routing begins.
3. Root packets that still depended on memory files now have canonical `implementation-summary.md`.
4. A named SQLite backup exists, restore-on-copy passes, rollback-on-copy passes, and resume warmup is under five seconds.

This packet is intentionally pre-populated before implementation, so the narrative above is the target outcome rather than a claim that the work has already landed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/templates/level_3/spec.md` | Planned modify | Remove the orphan `metadata` anchor blocker from the Level 3 spec contract. |
| `.opencode/skill/system-spec-kit/templates/level_3+/spec.md` | Planned modify | Remove the orphan `metadata` anchor blocker and add governance anchors. |
| `.opencode/skill/system-spec-kit/templates/{handover.md,research.md,debug-delegation.md}` | Planned modify | Give special templates legal merge targets before phase 018 write routing. |
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Planned modify | Encode or document the default exemption for anchorless changelog/sharded templates. |
| `[UNCERTAIN: exact root packet paths found by audit]` | Planned modify | Backfill canonical `implementation-summary.md` where M4 would otherwise archive the only narrative. |
| `.opencode/skill/system-spec-kit/mcp_server/database/memory.db` | Planned operational backup | Produce the Gate A snapshot and recovery proof needed before Gate B. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

TBD after Gate A implementation closes.

Planned delivery story:
- Start with the audit and boundary freeze from iteration 028 so later work stays inside the Gate A blocker set.
- Implement the template and validator-scope fixes first, because iteration 022 makes `ANCHORS_VALID` and `MERGE_LEGALITY` the structural prerequisite for safe writes.
- Close the root-packet backfill prerequisite from iteration 016 before any archive-state change is allowed.
- Finish with backup, restore, rollback, and warmup proof from iteration 020, the master plan, iteration 028, and `../implementation-design.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix template anchor debt before any phase 018 writer work | `../resource-map.md` F-3 and iteration 022 both treat orphan or missing anchors as fail-closed blockers for merge legality. |
| Exempt `changelog/*` and `sharded/*` from merge-target validation by default | The current templates are intentionally anchorless, and Gate A needs a narrow blocker-removal decision instead of a surprise expansion into new merge contracts. |
| Backfill missing root-packet summaries before archive migration | Iteration 016 makes that the sole prerequisite for M4 so phase 018 does not archive the only durable packet narrative. |
| Prove backup and rollback on a copy before any schema change | The master plan plus iteration 028 treat rollback proof as part of Gate A close, not a later convenience task. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Strict template validation on repaired examples | TBD after Gate A implementation closes |
| Root packet backfill audit + committed summaries | TBD after Gate A implementation closes |
| SQLite backup exists | TBD after Gate A implementation closes |
| Restore-on-copy rehearsal | TBD after Gate A implementation closes |
| Rollback-on-copy rehearsal | TBD after Gate A implementation closes |
| Resume warmup under 5 seconds | TBD after Gate A implementation closes |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This is a planned closeout shell, not a factual post-implementation record.** Post-implementation facts stay intentionally stubbed until Gate A actually lands.
2. **The exact root-packet backfill list is still unresolved.** Iteration 016 defines the prerequisite, but the current research packet does not enumerate the packet paths.
3. **Migration-file ownership is not yet locked.** `../resource-map.md` §8.6 presents `mcp_server/database/migrations/` as an optional convention, so Gate A still needs to settle whether that directory is created or inline migration ownership is documented instead.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
