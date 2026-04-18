---
title: "Tasks: Template/Validator Contract Alignment"
description: "Task list for 5 ranked proposals."
trigger_phrases: ["validator alignment tasks"]
importance_tier: "critical"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/007-template-validator-contract-alignment"
    last_updated_at: "2026-04-18T23:52:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Begin T001"
---
# Tasks: Template/Validator Contract Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

## Phase 1: Setup

- [ ] T001 Read audit: ../001-initial-research/006-template-validator-audit/review-report.md (P0)

## Phase 2: Rank 1 — Rule registry

- [ ] T002 Create `scripts/lib/validator-registry.{ts,json}` with all rule metadata (id, script_path, severity, description) (P0)
- [ ] T003 Refactor `validate.sh` dispatch loop to read registry (P0)
- [ ] T004 Generate `show_help()` output from registry (P0)
- [ ] T005 Verify same rule set dispatched as before — evidence (P0)
- [ ] T006 Commit+push (P0)

## Phase 3: Rank 2 — Semantic frontmatter

- [ ] T007 Update `check-frontmatter.sh` to reject empty `title`/`description`/`trigger_phrases`/`importance_tier`/`contextType` (P0)
- [ ] T008 Update `spec-doc-structure.ts:518-567` `requiredPairs` to treat empty-string as missing (P0)
- [ ] T009 Add grandfathering allowlist with cutoff timestamp (P1)
- [ ] T010 Synthetic fixture tests (P0)
- [ ] T011 Commit+push (P0)

## Phase 4: Rank 3 — Anchor parity

- [ ] T012 Update `check-anchors.sh:117-143` to reject duplicate IDs (P0)
- [ ] T013 Pre-scan active packets for latent duplicates (P0)
- [ ] T014 Synthetic fixture tests (P0)
- [ ] T015 Commit+push (P0)

## Phase 5: Rank 5 — decision-record placeholder

- [ ] T016 Fix `templates/level_3/decision-record.md:2-4` frontmatter description (P0)
- [ ] T017 Verify template validates (P0)

## Phase 6: Rank 4 (deferrable) — Reporting split

- [ ] T018 Categorize rules in registry: authored-template vs operational (P2)
- [ ] T019 Update coverage-matrix output format (P2)

## Phase 7: Verification

- [ ] T020 Full validator regression green (P0)
- [ ] T021 Full mcp_server test suite green (P0)
- [ ] T022 Update checklist.md (P0)
- [ ] T023 Update implementation-summary.md (P0)

## Cross-References

- Parent: `../spec.md`
- Source: `../001-initial-research/006-template-validator-audit/review-report.md`
