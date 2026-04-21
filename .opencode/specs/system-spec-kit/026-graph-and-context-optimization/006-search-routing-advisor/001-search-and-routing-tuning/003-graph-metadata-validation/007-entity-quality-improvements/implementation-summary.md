<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
---
title: "Implementation Summary: Improve Graph Metadata Entity Quality"
description: "This phase raised the graph-metadata entity budget to 24, blocked cross-spec canonical-doc leaks, and rejected bare runtime-name noise from the derived entity set."
trigger_phrases:
  - "entity quality summary"
  - "graph metadata entities"
  - "scope leak closure"
importance_tier: "important"
contextType: "verification"
status: complete
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/007-entity-quality-improvements"
    last_updated_at: "2026-04-13T14:24:00Z"
    last_updated_by: "codex"
    recent_action: "Completed entity-quality fixes, focused tests, and repo-wide graph metadata refresh"
    next_safe_action: "Reuse this phase if entity scope leakage or runtime-name noise reappears"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:019-phase-007-entity-quality-improvements"
      session_id: "019-phase-007-entity-quality-improvements"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "How should deriveEntities keep useful local entities while dropping cross-spec canonical-doc leaks and runtime-name noise"
---
# Implementation Summary: Improve Graph Metadata Entity Quality

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-entity-quality-improvements |
| **Completed** | `2026-04-13` |
| **Level** | `2` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase reshaped `deriveEntities()` so the stored entity set is both larger and cleaner. The entity cap rose from `16` to `24`, bare runtime names are now rejected up front, and canonical-doc scope checks only treat paths inside the current spec folder as canonical local docs. External canonical packet docs such as another packet handover or implementation-summary document are now skipped instead of surfacing as cross-spec entity leaks.

### Parser changes

- Raised the derived entity cap from `16` to `24`.
- Replaced the old broad canonical-path preference with a current-spec-folder prefix check.
- Rejected bare runtime names: `python`, `node`, `bash`, `sh`, `npm`, `npx`, `vitest`, `jest`, and `tsc`.
- Added an external-canonical-doc guard so other packets’ canonical docs do not survive as entity rows.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Modified | Raised the cap, tightened canonical scope, rejected runtime-name noise, and skipped external canonical-doc entities |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts` | Modified | Added coverage for the new cap, runtime-name rejection, current-folder scope, and external canonical-doc leak suppression |
| `tasks.md`, `checklist.md` | Modified | Recorded completion state and evidence-backed verification |
| `implementation-summary.md` | Created | Captured the runtime outcome and corpus-level metrics |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation kept the changes inside the existing parser module so entity behavior stayed easy to reason about. First the cap and name filter were added, then the canonical scope logic was tightened so only the current packet’s canonical docs can win canonical preference. Once a last-mile leak check showed that external canonical docs could still surface when no local same-name doc existed, an explicit skip for those external canonical-doc key-file entities was added and verified in focused tests before the repo-wide refresh was rerun.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use the full canonical packet-doc list, not only currently present docs, when checking canonical doc names | A packet without its own handover document still needs to reject another packet’s canonical handover doc as an entity leak |
| Skip out-of-scope canonical packet docs entirely instead of merely deprioritizing them | The phase goal was leak closure, not just better tie-breaking when duplicates happen to exist |
| Keep runtime-name rejection at the entity-name layer | That filters both key-file-seeded names and extracted entity names without widening the surrounding schema |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit` | PASS |
| `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-metadata-integration.vitest.ts tests/graph-metadata-schema.vitest.ts` | PASS (`24` tests) |
| `cd .opencode/skill/system-spec-kit/scripts && npx tsc --noEmit` | PASS |
| `cd .opencode/skill/system-spec-kit/scripts && npm run build` | PASS |
| `node .opencode/skill/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js` | PASS (`550` spec folders refreshed) |
| Final repo refresh via rebuilt `mcp_server` API | PASS (`550` spec folders refreshed against the final parser build) |
| Entity-quality baseline vs final active-corpus scan | PASS: research baseline `9` true scope leaks, average `16.00` entities per active folder, and `1` suspicious runtime name; final active scan `0` scope leaks, average `23.89` entities per active folder, and `0` runtime-name entities |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The entity distribution still clusters hard at the new cap.** The final active scan shows `360 / 374` packets at the `24`-entity ceiling, so prioritization quality is better than before but not yet naturally unconstrained.
2. **The scripts workspace still packages `@spec-kit/mcp-server` as a file dependency copy.** The requested backfill command ran successfully, but a direct refresh pass against the rebuilt `mcp_server/dist` API was also executed so the on-disk graph metadata matched the final parser build in this session.
<!-- /ANCHOR:limitations -->
