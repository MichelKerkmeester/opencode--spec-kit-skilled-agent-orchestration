---
title: "Tasks: Description Regen Contract"
description: "Task list for shared schema + unified merge helper."
trigger_phrases: ["description regen tasks"]
importance_tier: "critical"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/005-description-regen-contract"
    last_updated_at: "2026-04-18T23:47:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Begin T001"
---
# Tasks: Description Regen Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

## Phase 1: Setup

- [ ] T001 Read research: 019/001/004 research.md §Strategy Comparison + Recommended Strategy (P0)
- [ ] T002 Catalog the 28 rich description.json files for regression (P0)

## Phase 2: Shared schema

- [ ] T003 Create `scripts/lib/description-schema.ts` with 5 field-class definitions (P0)
- [ ] T004 Define Zod schema: `canonical_derived`, `canonical_authored`, `tracking`, `known_authored_optional`, `unknown_passthrough` (P0)
- [ ] T005 Export types consumed by FolderDescription + PerFolderDescription (P0)

## Phase 3: Unified merge helper

- [ ] T006 Create `scripts/lib/description-merge.ts` (P0)
- [ ] T007 Implement field-level merge: canonical regenerate, tracking preserve, authored preserve via allowlist, unknown passthrough (P0)
- [ ] T008 Route `folder-discovery.ts` `getDescriptionWritePayload()` through helper (P0)
- [ ] T009 Route 018 R4 `mergePreserveRepair()` through helper (P0)
- [ ] T010 Unit tests: 5 field classes per lane (P0)

## Phase 4: Regression

- [ ] T011 Run regen on 28 rich description.json files (P0)
- [ ] T012 Verify title, type, trigger_phrases, path preserved on all 28 (P0)
- [ ] T013 Add synthetic unknown-key fixture, verify passthrough (P0)
- [ ] T014 Commit+push mid-point (P1)

## Phase 5: Verification

- [ ] T015 Full test suite green (P0)
- [ ] T016 Update checklist.md (P0)
- [ ] T017 Update implementation-summary.md (P0)

## Cross-References

- Parent: `../spec.md`
- Source: `../001-initial-research/004-description-regen-strategy/research.md`
