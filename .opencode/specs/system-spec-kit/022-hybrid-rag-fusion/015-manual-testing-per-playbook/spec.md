---
title: "Feature Specification: manual-testing-p [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/spec]"
description: "Root wrapper spec for the live manual-testing playbook tree: 290 scenario files across 21 categories, with historical execution evidence and current traceability remediation kept separate."
trigger_phrases:
  - "manual testing"
  - "testing playbook"
  - "phase parent"
  - "umbrella spec"
importance_tier: "important"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
# Feature Specification: manual-testing-per-playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress — wrapper truth-sync active; historical execution evidence preserved; traceability remediation still open |
| **Created** | 2026-03-22 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../014-agents-md-alignment/spec.md |
| **Successor** | ../016-rewrite-memory-mcp-readme/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The live manual-testing tree now contains **290** scenario files across **21** numbered categories, but this wrapper packet still mixes older `231 scenario files / 272 exact IDs / 19 categories` language with current phase folders `021` and `022` plus a retained duplicate `020-feature-flag-reference-audit` wrapper. That makes the root packet materially stale and self-contradictory for release-control use.

### Purpose
Keep the root wrapper honest about the current live playbook tree while preserving the older `272 exact ID` execution wave as historical evidence only. This packet should coordinate the live wrapper state, not imply that the entire current tree has already been re-verified end to end.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root-wrapper truth for the live playbook denominator: `290` scenario files across `21` categories
- The current 22 numbered phase folders in this packet, including the retained duplicate `020-feature-flag-reference-audit`
- Historical execution evidence from the earlier `272 exact ID` wave
- Still-open traceability-remediation status from the 2026-03-26 review

### Out of Scope
- Re-running the full manual execution wave in this wrapper-only pass
- Authoring new playbook scenarios in the source tree
- Feature catalog maintenance outside root-wrapper coordination
- Runtime code changes

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | This file -- requirements and phase map |
| `plan.md` | Modify | Execution plan and phase dependencies |
| `tasks.md` | Modify | Per-phase task tracking |
| `checklist.md` | Modify | Quality gates and verification evidence |
| `implementation-summary.md` | Maintain | Historical execution evidence plus root-wrapper follow-up notes |
| `001-retrieval/` through `022-implement-and-remove-deprecated-features/` | Reference | Child phase folders remain the detailed execution surfaces |
<!-- /ANCHOR:scope -->

---

## PHASE DOCUMENTATION MAP

| Phase | Folder | Category | Scenario Files | Note |
|-------|--------|----------|---------------|------|
| 001 | `001-retrieval/` | Retrieval | 16 | Live category count |
| 002 | `002-mutation/` | Mutation | 11 | Live category count |
| 003 | `003-discovery/` | Discovery | 3 | Live category count |
| 004 | `004-maintenance/` | Maintenance | 2 | Live category count |
| 005 | `005-lifecycle/` | Lifecycle | 10 | Live category count |
| 006 | `006-analysis/` | Analysis | 7 | Live category count |
| 007 | `007-evaluation/` | Evaluation | 2 | Live category count |
| 008 | `008-bug-fixes-and-data-integrity/` | Bug Fixes and Data Integrity | 11 | Live category count |
| 009 | `009-evaluation-and-measurement/` | Evaluation and Measurement | 15 | Live category count |
| 010 | `010-graph-signal-activation/` | Graph Signal Activation | 18 | Live category count |
| 011 | `011-scoring-and-calibration/` | Scoring and Calibration | 24 | Live category count |
| 012 | `012-query-intelligence/` | Query Intelligence | 10 | Live category count |
| 013 | `013-memory-quality-and-indexing/` | Memory Quality and Indexing | 29 | Live category count |
| 014 | `014-pipeline-architecture/` | Pipeline Architecture | 25 | Live category count |
| 015 | `015-retrieval-enhancements/` | Retrieval Enhancements | 11 | Live category count |
| 016 | `016-tooling-and-scripts/` | Tooling and Scripts | 51 | Live category count |
| 017 | `017-governance/` | Governance | 8 | Live category count |
| 018 | `018-ux-hooks/` | UX Hooks | 19 | Live category count |
| 019 | `019-feature-flag-reference/` | Feature Flag Reference | 10 | Live category count |
| 020 | `020-feature-flag-reference-audit/` | Feature Flag Reference (duplicate wrapper) | 0 | Retained phase folder, not a new category denominator |
| 021 | `021-remediation-revalidation/` | Remediation and Revalidation | 3 | Live category count |
| 022 | `022-implement-and-remove-deprecated-features/` | Implement and Remove Deprecated Features | 5 | Live category count |
| **TOTAL** | | **21 live categories across 22 numbered phase folders** | **290** | Root playbook index [manual-testing source of truth](../../../../skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md) excluded |

Historical execution note:
- The older `272 exact ID` execution wave remains valid as historical evidence.
- It is no longer the current live wrapper denominator.

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Root docs use the live playbook denominator truthfully | The wrapper packet uses `290` scenario files across `21` categories as the live denominator |
| REQ-002 | Root docs describe the full live phase tree | The phase map includes the `021` and `022` folders and explains the retained duplicate `020` folder |
| REQ-003 | Historical execution evidence is clearly bounded | The older `272 exact ID` wave is labeled as historical evidence, not current live coverage |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Traceability remediation remains visible | The packet continues to show the still-open catalog/playbook alignment backlog |
| REQ-005 | Root wrapper docs do not invent closure | The packet avoids claiming the current 290-file tree is fully re-verified |
| REQ-006 | Root wrapper docs stay aligned internally | `spec.md`, `plan.md`, and `checklist.md` use the same live counts and status boundary |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The wrapper packet reports the live `290`-file, `21`-category denominator honestly.
- **SC-002**: The wrapper packet includes all 22 numbered phase folders.
- **SC-003**: Historical execution evidence is preserved without being overstated as current live coverage.
### Acceptance Scenarios

**Given** the umbrella playbook packet, **when** a reviewer opens the phase map, **then** all numbered child folders from `001` through `022` appear in the documented execution sequence.

**Given** the umbrella packet, **when** a reviewer checks coverage expectations, **then** the packet distinguishes the historical `272 exact ID` execution evidence from the current live `290`-file denominator.

**Given** a reviewer checks the execution controls, **when** they read the packet and checklist, **then** evidence, bug tracking, and playbook-error tracking expectations are explicit.

**Given** recursive validation runs on the umbrella packet, **when** the packet is audited structurally, **then** the parent spec remains template-compatible and points readers to the child execution packets.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Manual testing playbook (290 scenario files across 21 categories) | Source of live wrapper truth | Treat the playbook as read-only source of truth |
| Dependency | Feature catalog (255 entries across 21 categories) | Traceability target for the wrapper packet | Treat the catalog as read-only reference truth |
| Risk | Historical execution evidence may be mistaken for current live coverage | High | Keep the historical boundary explicit in every root wrapper file |
| Risk | Duplicate phase `020` can be mistaken for a new category | Medium | Explain that `020-feature-flag-reference-audit` is retained as a duplicate wrapper, not a new denominator bucket |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
<!-- ANCHOR:requirements -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Root wrapper counts must be reproducible from the live filesystem.
- **NFR-R02**: Historical execution evidence must remain distinguishable from current wrapper truth.

### Traceability
- **NFR-T01**: Root wrapper docs must stay aligned to the live `255 / 21 / 290 / 21` catalog and playbook denominators.
- **NFR-T02**: The packet must keep the still-open traceability remediation visible until separately verified.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
<!-- /ANCHOR:requirements -->
## L2: EDGE CASES

### Data Boundaries
- The live wrapper denominator excludes the root playbook index [manual-testing source of truth](../../../../skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md).
- The duplicate `020-feature-flag-reference-audit` phase folder remains in the packet even though it does not add a new live category.

### Error Scenarios
- If a live recount changes, the wrapper packet must update before any release summary cites it.
- If traceability remediation closes or expands, the wrapper packet must describe that explicitly instead of relying on historical PASS totals.

### State Transitions
- Historical execution evidence can remain complete while the current wrapper status stays in progress.
- Root wrapper truth-sync can complete without re-running every child-phase scenario.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | 22 numbered phase folders, 290 live scenario files, historical execution evidence, and open traceability remediation |
| Risk | 12/25 | Root wrapper drift can misstate release-control truth |
| Research | 6/20 | Requires live recount and historical-boundary preservation |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- When the traceability backlog lands, should this wrapper preserve the duplicate `020-feature-flag-reference-audit` folder or collapse it?
<!-- /ANCHOR:questions -->

---

### DEEP REVIEW FINDINGS (2026-03-26)

A 6-iteration deep review (12 GPT-5.4 agents via codex exec) audited feature catalog ↔ playbook ↔ spec phase traceability. **Verdict: CONDITIONAL.**

Full report: [`review-report.md`](review-report.md)

### Finding Summary

| ID | Severity | Title | Count | Remediation |
|----|----------|-------|-------|-------------|
| P0-001 | Critical | Features with NO playbook scenario (true gaps) | Historical review baseline against the older 222-entry catalog | Reconcile against the live 255-entry catalog and current playbook tree |
| P1-001 | Major | Features missing from Section 12 cross-reference | 4 entries | Add 4 rows to Section 12 |
| P1-002 | Major | Playbook scenarios lacking FC back-reference | 40 scenarios | Add `Feature catalog:` to 40 files |
| P1-003 | Major | Spec phases lacking Scenario Registry table | 17/22 phases | Add registry table to 17 spec.md |
| P1-004 | Major | Inconsistent FC ref patterns in spec phases | 6 phases | Standardize to registry tables |
| P1-005 | Major | Features covered but unlinked (missing back-ref) | 25 scenarios | Add `Feature catalog:` to 25 files |
| P2-001 | Advisory | Section 12 links all valid | 0 broken | No action |
| P2-002 | Advisory | Spec phase 020 duplicates 019 name | 1 | No action (intentional) |
| P2-003 | Advisory | Category count mismatches | Expected | No action (sub-scenario expansion) |

### Remediation Workstreams

| WS | Priority | Scope | Depends On |
|----|----------|-------|------------|
| WS-1 | P0 | Create 29 missing playbook scenario files | None |
| WS-2 | P1 | Add FC back-references to 65 playbook scenarios (25+40) | WS-1 |
| WS-3 | P1 | Add 33 rows to Section 12 index (4 existing + 29 new) | WS-1 |
| WS-4 | P1 | Add Scenario Registry tables to 17 spec phase spec.md files | WS-1, WS-2, WS-3 |

### True-Gap Features (P0-001) — 29 features needing new playbook scenarios

| # | Category | Feature |
|---|----------|---------|
| 1 | 01-Retrieval | AST-level section retrieval tool |
| 2 | 01-Retrieval | Tool-result extraction to working memory |
| 3 | 01-Retrieval | Session recovery via /memory:continue |
| 4 | 02-Mutation | Namespace management CRUD tools |
| 5 | 02-Mutation | Correction tracking with undo |
| 6 | 10-Graph Signal | ANCHOR tags as graph nodes |
| 7 | 10-Graph Signal | Causal neighbor boost and injection |
| 8 | 10-Graph Signal | Temporal contiguity layer |
| 9 | 11-Scoring | Tool-level TTL cache |
| 10 | 11-Scoring | Access-driven popularity scoring |
| 11 | 11-Scoring | Temporal-structural coherence scoring |
| 12 | 13-Memory Quality | Content-aware memory filename generation |
| 13 | 13-Memory Quality | Generation-time duplicate and empty content prevention |
| 14 | 14-Pipeline | Warm server / daemon mode |
| 15 | 14-Pipeline | Backend storage adapter abstraction |
| 16 | 14-Pipeline | Atomic write-then-index API |
| 17 | 14-Pipeline | Embedding retry orchestrator |
| 18 | 14-Pipeline | 7-layer tool architecture metadata |
| 19 | 16-Tooling | Architecture boundary enforcement |
| 20 | 16-Tooling | Watcher delete/rename cleanup |
| 21 | 16-Tooling | Template Compliance Contract Enforcement |
| 22 | 18-UX Hooks | Shared post-mutation hook wiring |
| 23 | 18-UX Hooks | Memory health autoRepair metadata |
| 24 | 18-UX Hooks | Schema and type contract synchronization |
| 25 | 18-UX Hooks | Mutation hook result contract expansion |
| 26 | 18-UX Hooks | Mutation response UX payload exposure |
| 27 | 18-UX Hooks | Atomic-save parity and partial-indexing hints |
| 28 | 18-UX Hooks | Final token metadata recomputation |
| 29 | 18-UX Hooks | End-to-end success-envelope verification |

---
<!-- /ANCHOR:questions -->
