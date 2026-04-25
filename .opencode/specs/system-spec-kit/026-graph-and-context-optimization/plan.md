---
title: "Implementation Plan: Graph and Context Optimization [system-spec-kit/026-graph-and-context-optimization/plan]"
description: "Plan for consolidating the 026 packet from 29 active top-level phase folders to 10 thematic wrappers across two topical passes plus the post-push topology adjustment."
trigger_phrases:
  - "026 graph and context optimization"
  - "026 phase consolidation"
  - "29 to 9 phase map"
  - "merged phase map"
  - "graph context optimization root packet"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization"
    last_updated_at: "2026-04-25T14:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Post-push topology adjustment: 010-hook-parity renamed to 009-hook-parity; 009-memory-causal-graph removed; active surface narrowed to 10 wrappers"
    next_safe_action: "Use merged-phase-map.md and context indexes for navigation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:4444376370874cffcd64400f8f337ddcd48cdd862ce7981137ac69bbf1abbd3c"
      session_id: "026-phase-consolidation-2026-04-21"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: Graph and Context Optimization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON metadata |
| **Framework** | Spec Kit Level 3 parent packet with Level 1 active wrappers |
| **Storage** | Root packet docs plus wrapper direct-child folders history |
| **Testing** | Strict spec validation, JSON parse scan, folder/map consistency checks |

### Overview
This plan documents the active 026 phase surface produced by two topical consolidation passes plus a post-push topology adjustment. The first pass (2026-04-21) collapsed 29 chronological phase folders into nine thematic wrappers; the second pass (2026-04-25 12:10) merged `006-search-routing-advisor/` into `008-skill-advisor/`, redistributed children of the former `009-hook-package/` across `007-code-graph/`, `008-skill-advisor/`, and the renamed `010-hook-parity/`. A subsequent post-push adjustment (2026-04-25 14:45) renamed `010-hook-parity/` to `009-hook-parity/` and removed the post-hoc `009-memory-causal-graph/` documentation packet (the causal-graph infrastructure remains in production code; its documentation is owned by `012-graph-impact-and-affordance-uplift/005-memory-causal-trust-display/` from a display-layer perspective). The current active surface is 10 thematic wrappers with intentional gaps at `006`, `010`, and `011`. Original packets remain intact under their thematic wrapper; root support folders stay in place; docs and metadata bridge old paths to active homes through `merged-phase-map.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Existing direct phase folders `001` through `029` enumerated.
- [x] Root docs read before modification.
- [x] Existing uncommitted changes noted and preserved.

### Definition of Done
- [x] Root direct phase folders are the 10 approved wrappers (intentional gaps at `006`, `010`, and `011`).
- [x] Every old phase appears exactly once in the first-pass section of `merged-phase-map.md`.
- [x] Every second-pass move/rename appears exactly once in the appended second-pass section of `merged-phase-map.md`.
- [x] Post-push topology adjustment (rename + removal) is appended as its own sub-section of `merged-phase-map.md`.
- [x] Every wrapper has context indexes (or root-only docs where the wrapper merged its children into the root).
- [x] JSON metadata parse checks pass.
- [x] Strict validation has been run on root and wrappers.
<!-- /ANCHOR:quality-gates -->

---

### AI Execution Protocol

### Pre-Task Checklist

- Re-read root docs and enumerate phase folders before moving anything.
- Move child packets intact before generating wrappers.
- Keep root `research/`, `review/`, and `scratch/` where they are.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-SCOPE-001 | Do not change runtime code | This is a documentation and metadata consolidation. |
| AI-PRESERVE-001 | Keep child packet narratives intact | Historical context should remain auditable. |
| AI-METADATA-001 | Preserve old packet IDs as aliases or migration sources | Memory and graph lookup need continuity. |
| AI-VERIFY-001 | Validate root and active wrappers after the move | The active surface must be structurally usable. |

### Status Reporting Format

- Start state: direct phase count and dirty worktree notes.
- Work state: wrappers generated and metadata migrated.
- End state: validation and map coverage results.

### Blocked Task Protocol

1. Stop if an expected old phase folder is missing.
2. Stop if a target active wrapper already exists before migration.
3. Report any validation failure with the exact rule and file.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Ten active thematic wrapper packets (with intentional gaps at `006`, `010`, and `011`) over preserved historical child packets, produced by two topical consolidation passes plus the post-push topology adjustment.

### Key Components

- **Root map**: `spec.md` and `merged-phase-map.md` (first-pass + second-pass tables plus the post-push adjustment sub-section).
- **Wrapper packets**: 10 wrappers (`000`, `001`, `002`, `003`, `004`, `005`, `007`, `008`, `009-hook-parity`, `012`), each with Level 1 docs and context indexes (or root-only docs where children are merged).
- **Child phase folders**: original phase roots nested under thematic wrappers.
- **Metadata continuity**: moved JSON files record current paths plus migration aliases (`008-skill-advisor/`, `009-hook-parity/`, and earlier first-pass aliases including the rename chain `009-hook-package` → `010-hook-parity` → `009-hook-parity`).

### Data Flow
Root phase map points to wrapper docs. Wrapper context indexes point to preserved original phase folders. Metadata aliases preserve old packet IDs for memory and graph traversal.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Enumerate current direct phase folders.
- [x] Read root docs and representative metadata.
- [x] Capture old phase status and titles.

### Phase 2: Core Implementation
- [x] Move all old phase packets into wrapper direct-child folders.
- [x] Generate active wrapper docs and context indexes.
- [x] Rewrite root docs and metadata for the nine-phase map.

### Phase 3: Verification
- [x] Check old phase map coverage.
- [x] Parse all `description.json` and `graph-metadata.json` files.
- [x] Run strict validation on root and wrappers.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Folder shape | Root direct phase folders | `find` |
| Map coverage | Old phases `001` through `029` (first pass), second-pass moves, and post-push adjustment | Node/regex scan over `merged-phase-map.md` |
| Metadata | All moved and active JSON files | Node `JSON.parse` scan |
| Spec validation | Root and 10 wrappers | `validate.sh --strict` |
| Trigger continuity | Old phase phrases plus `006-search-routing-advisor`, `009-hook-package`, and `010-hook-parity` aliases | `rg` over context indexes and metadata |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing old phase folders `001`-`029` | Internal | Green | Cannot prove preservation if any are missing |
| Spec validator | Internal | Green | Cannot claim structural completion without it |
| JSON metadata files | Internal | Green | Memory/search continuity depends on valid metadata |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The migration leaves old phases unmapped, metadata unparsable, or active wrapper validation unrecoverable.
- **Procedure**: Move folders from wrapper direct-child folders back to their old root paths and restore root docs/metadata from version control.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Enumerate old phases
        |
        v
Move child packets into wrappers
        |
        v
Generate bridge docs and metadata
        |
        v
Validate root and wrappers
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Migration |
| Migration | Setup | Verification |
| Verification | Migration | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 0.25 day |
| Migration | High | 0.5 day |
| Verification | Medium | 0.25 day |
| **Total** |  | **1 day** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Original folder map captured.
- [x] Existing dirty worktree noted.
- [x] Migration script checks all expected old folders before moving.

### Rollback Procedure
1. Restore root docs and metadata from version control.
2. Move each child folder from `00N-*/OLD` back to `OLD`.
3. Remove generated wrapper folders.
4. Re-run folder coverage and JSON parse checks.

### Data Reversal
- **Has data migrations?** Yes, metadata path fields are rewritten.
- **Reversal procedure**: Restore metadata from version control or reverse the migration fields using `migration.source_spec_folder`.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
old child packets
       |
       v
direct child folders
       |
       v
context-index bridge docs
       |
       v
root 10-wrapper map
       |
       v
validation and continuity checks
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| `merged-phase-map.md` | Old-to-new map | Root bridge table | Completion claim |
| Wrapper docs | Original phase move | Active validation surface | Root validation |
| Metadata rewrite | Original phase move | Resolvable packet IDs | Memory/search continuity |
| Root docs | Wrapper docs | Active phase map | Final verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Move child packets intact** - medium - CRITICAL
2. **Generate wrapper docs and context indexes** - medium - CRITICAL
3. **Refresh metadata aliases and paths** - high - CRITICAL
4. **Run validation checks** - medium - CRITICAL

**Total Critical Path**: 1 day

**Parallel Opportunities**:
- JSON parse and trigger continuity checks can run independently after migration.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Original folders moved | Old phases nested under wrappers | Same session |
| M2 | Bridge docs generated | Root and wrapper docs expose old-to-new paths | Same session |
| M3 | Validation complete | Root and wrappers pass strict validation or failures are documented | Same session |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Consolidate by theme, not chronology

**Status**: Accepted

**Context**: Follow-up phases were added chronologically even when they continued older themes.

**Decision**: Use thematic wrappers (originally nine, expanded to 11 after a second topical pass, then narrowed to 10 after the post-push topology adjustment) and preserve chronological folders as child phase folders.

**Consequences**:
- Active navigation becomes smaller and clearer.
- Historical folder names remain available under thematic wrappers.
- Second-pass refinements (advisor unification, code-graph hook expansion, hook-parity narrowing) and the post-push adjustment (hook-parity rename to `009/`, removal of the post-hoc memory-causal-graph documentation packet) are recorded in `merged-phase-map.md`.

**Alternatives Rejected**:
- Keep 29 active top-level folders: rejected because it preserves the navigation problem.
- Keep nine wrappers with advisor work split across `006-search-routing-advisor/` and `009-hook-package/`: rejected because it forced cross-wrapper navigation when reasoning about the advisor system.

> Detailed second-pass ADRs (008-skill-advisor merge, 010 rename to hook-parity) and the post-push adjustment ADR (rename to `009-hook-parity` plus removal of `009-memory-causal-graph`) live in `decision-record.md`.
