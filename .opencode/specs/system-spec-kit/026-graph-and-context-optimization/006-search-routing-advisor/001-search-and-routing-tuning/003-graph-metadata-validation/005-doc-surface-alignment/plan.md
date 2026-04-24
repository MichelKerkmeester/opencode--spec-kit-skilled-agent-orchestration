---
title: "Implementation Plan: Doc Surface Alignment: Graph Metadata Changes"
description: "The plan is a targeted doc-alignment pass, not a runtime feature build."
trigger_phrases:
  - "doc surface alignment"
  - "graph metadata validation"
  - "doc surface alignment graph metadata changes"
  - "doc surface alignment plan"
  - "system spec kit"
importance_tier: "normal"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled frontmatter (repo-wide gap fill)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
---
title: "...06-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment/plan]"
description: "This plan applies a targeted doc-only sweep across the requested surfaces, then closes the packet with Level 2 execution docs and strict validation."
trigger_phrases:
  - "graph metadata plan"
  - "doc surface alignment"
  - "strict validation"
  - "active-only backfill"
  - "level 2 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/005-doc-surface-alignment"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded the finished implementation plan after the requested surfaces were aligned"
    next_safe_action: "Use this plan as the reference if another doc-surface alignment phase opens"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:019-phase-005-doc-surface-alignment-plan"
      session_id: "019-phase-005-doc-surface-alignment-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "How to validate packet-level compliance after the doc sweep"
status: complete
---
# Implementation Plan: Doc Surface Alignment: Graph Metadata Changes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + TypeScript source comments |
| **Framework** | system-spec-kit doc/template workflow |
| **Storage** | Packet docs plus operator guidance surfaces in the repo |
| **Testing** | `rg` sweeps, `git diff --check`, strict packet validation |

### Overview

The plan is a targeted doc-alignment pass, not a runtime feature build. It reads the packet spec, scans each requested surface, patches only the files that still describe stale graph-metadata behavior, then creates the missing Level 2 packet docs and validates the packet strictly.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done

- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Other

### Key Components

- **Operator guidance surfaces**: command docs, repo instructions, skill docs, templates, feature catalog, and playbook entries.
- **Packet closeout docs**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`.

### Data Flow

The workflow starts from the packet spec, moves through a read-only scan of the listed surfaces, applies surgical patches only where runtime contract drift exists, then runs packet-local verification and strict validation before the packet is marked complete.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read the packet spec first
- [x] Resolve the exact target paths for `.opencode/skill/system-spec-kit/ARCHITECTURE.md` and the graph backfill script
- [x] Inspect current graph-metadata references before editing

### Phase 2: Core Implementation

- [x] Patch operator docs that still described stale graph-metadata behavior
- [x] Patch metadata feature/playbook references and affected templates
- [x] Add packet-local Level 2 closeout docs

### Phase 3: Verification

- [x] Run focused `rg` sweeps across the updated surfaces
- [x] Run `git diff --check`
- [x] Run strict packet validation and repair the packet until it passes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Text verification | Updated doc surfaces | `rg -n -i` |
| Formatting check | Patched files only | `git diff --check` |
| Packet validation | This spec folder | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Active Level 2 templates | Internal | Green | Packet docs fail strict validation if headers/anchors drift |
| Existing graph-metadata parser behavior | Internal | Green | Doc claims would be unverifiable if runtime behavior were still changing |
| Requested surface list from the packet spec | Internal | Green | Scope expands ambiguously without the explicit scan list |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A doc patch misstates runtime behavior or strict validation fails after the packet update.
- **Procedure**: Re-read the parser/runtime source of truth, restore the affected doc section to the previous accurate wording, and re-run the packet validation lane.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Read + Scan) ──► Phase 2 (Patch + Packet Docs) ──► Phase 3 (Verify + Repair)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Read + Scan | None | Patch + Packet Docs |
| Patch + Packet Docs | Read + Scan | Verify + Repair |
| Verify + Repair | Patch + Packet Docs | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Read + Scan | Medium | 30-45 minutes |
| Patch + Packet Docs | Medium | 45-60 minutes |
| Verify + Repair | Medium | 20-30 minutes |
| **Total** | | **95-135 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] No runtime behavior changes are required for this packet
- [x] Scope is limited to requested surfaces plus packet-local docs
- [x] Validation commands are identified before the first patch

### Rollback Procedure

1. Revert the inaccurate doc wording in the affected surface.
2. Re-read the parser/runtime source of truth for the disputed behavior.
3. Re-run focused `rg` sweeps and strict packet validation.
4. Re-check the packet summary docs so they still reflect the shipped edit set.

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
