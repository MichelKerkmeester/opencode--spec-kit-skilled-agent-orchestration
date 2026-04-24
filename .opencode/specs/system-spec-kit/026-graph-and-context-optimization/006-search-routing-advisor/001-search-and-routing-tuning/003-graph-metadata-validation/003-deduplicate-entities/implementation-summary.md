<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
---
title: "...-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/003-deduplicate-entities/implementation-summary]"
description: "This phase stopped graph metadata from wasting entity slots on basename duplicates by giving both entity write paths a shared collision policy."
trigger_phrases:
  - "phase 003 implementation summary"
  - "deduplicate entities summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/003-deduplicate-entities"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Added shared entity upsert logic, canonical collision preference, and trigger phrase cap enforcement"
    next_safe_action: "Run repo-wide backfill and confirm duplicate entity slots shrink while the entity cap stays stable"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:019-phase-003-deduplicate-entities"
      session_id: "019-phase-003-deduplicate-entities"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Should the parser own the trigger_phrases cap while the metadata schema remains permissive"
status: complete
---
# Implementation Summary: Deduplicate Graph Metadata Entities

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-deduplicate-entities |
| **Completed** | `2026-04-13` |
| **Level** | `2` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase taught `deriveEntities()` to treat entity names as the dedupe key instead of blindly reserving one slot per `key_files` entry. When the parser now sees both a basename and a path-like canonical reference for the same document, it keeps the path-like canonical version and drops the duplicate slot, which leaves more room for genuinely distinct entities in the 16-entry budget.

### Shared collision policy

You now get the same collision behavior from both entity write sites: the key-file seeding loop and the extracted-entity loop both flow through the same helper, so canonical packet-doc paths beat basename-only duplicates and later writes do not quietly reintroduce the same name under a different key.

### Adjacent parser cleanup

This phase also added the missing `trigger_phrases.slice(0, 12)` cap in the parser, which the research identified as a low-risk adjacent cleanup owned by the same module. That keeps regenerated graph metadata within the intended phrase budget without widening the schema contract in the same patch.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Modified | Added shared entity upsert logic, canonical collision preference, and the trigger-phrase cap |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts` | Modified | Added canonical-path collision coverage and trigger-cap coverage |
| `tasks.md` | Modified | Recorded the completed phase work and verification |
| `implementation-summary.md` | Created | Published the phase outcome and verification evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fix started by moving both entity write paths behind a single helper so the duplicate policy could live in one place. Once the helper preferred canonical path-like references over plain basenames, focused tests were added for `spec.md` and `plan.md` collisions and the parser-level trigger cap, which made it safe to take the same logic into the broader backfill step.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Dedupe entities by normalized name instead of raw path | The duplicate waste came from storing the same document name more than once under different path shapes |
| Prefer canonical path-like references over basenames | The graph gets more useful evidence from the path that preserves packet context |
| Apply the missing trigger cap in the parser instead of the schema | The research showed the parser owns the generation path today, so this was the smallest safe place to enforce the limit |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit` | PASS |
| `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-metadata-integration.vitest.ts tests/graph-metadata-schema.vitest.ts` | PASS |
| Entity collision and trigger-cap coverage | PASS: canonical `spec.md` and `plan.md` collisions dedupe correctly, and derived trigger phrases cap at 12 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Duplicate-slot reduction is confirmed in the shared backfill verification.** This phase summary captures the parser and regression-test evidence, while the corpus-wide before-and-after shape is recorded after regeneration.
<!-- /ANCHOR:limitations -->
