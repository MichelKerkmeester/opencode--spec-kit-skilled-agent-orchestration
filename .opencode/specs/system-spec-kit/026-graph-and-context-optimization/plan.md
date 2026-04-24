---
title: "Implementation Plan: Graph and Context Optimization [system-spec-kit/026-graph-and-context-optimization/plan]"
description: "Plan for consolidating the 026 packet from 29 active top-level phase folders to 9 thematic wrappers."
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
    last_updated_at: "2026-04-21T13:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Renumbered nested phases"
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
This plan consolidates the active 026 phase surface from 29 direct phase folders into nine thematic wrappers. Original packets are moved intact into wrapper direct-child folders; root support folders stay in place; docs and metadata become the bridge from old paths to active homes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Existing direct phase folders `001` through `029` enumerated.
- [x] Root docs read before modification.
- [x] Existing uncommitted changes noted and preserved.

### Definition of Done
- [x] Root direct phase folders reduced to the nine approved wrappers.
- [x] Every old phase appears exactly once in `merged-phase-map.md`.
- [x] Every wrapper has context indexes.
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
Nine active wrapper packets over preserved historical child packets.

### Key Components

- **Root map**: `spec.md` and `merged-phase-map.md`.
- **Wrapper packets**: `001` through `009`, each with Level 1 docs and context indexes.
- **Child phase folders**: original phase roots nested under thematic wrappers.
- **Metadata continuity**: moved JSON files record current paths plus migration aliases.

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
| Map coverage | Old phases `001` through `029` | Node/regex scan over `merged-phase-map.md` |
| Metadata | All moved and active JSON files | Node `JSON.parse` scan |
| Spec validation | Root and nine wrappers | `validate.sh --strict` |
| Trigger continuity | Old phase phrases | `rg` over context indexes and metadata |
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
root nine-phase map
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

**Decision**: Use nine thematic wrappers and preserve chronological folders as child phase folders.

**Consequences**:
- Active navigation becomes smaller and clearer.
- Historical folder names remain available under thematic wrappers.

**Alternatives Rejected**:
- Keep 29 active top-level folders: rejected because it preserves the navigation problem.
