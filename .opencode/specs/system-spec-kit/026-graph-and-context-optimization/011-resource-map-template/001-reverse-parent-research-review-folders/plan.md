---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->"
title: "Implementation Plan: Reverse Parent Research/Review Folder Placement"
description: "Restore local-owner deep-loop packet placement, migrate misplaced child packets repo-wide, and rebase dependent packet docs onto the restored path contract."
trigger_phrases:
  - "013/001 rollback plan"
  - "reverse parent folders plan"
importance_tier: "normal"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/001-reverse-parent-research-review-folders"
    last_updated_at: "2026-04-24T14:30:20+02:00"
    last_updated_by: "codex"
    recent_action: "Completed rollback, migration, and closure planning work"
    next_safe_action: "Proceed with phase 002 on the restored contract"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/shared/review-research-paths.cjs"
      - ".opencode/skill/system-spec-kit/scripts/migrate-deep-loop-local-owner.cjs"
    session_dedup:
      fingerprint: "sha256:reverse-parent-research-review-folders-plan"
      session_id: "reverse-parent-research-review-folders-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Reverse Parent Research/Review Folder Placement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS Node + YAML + Markdown + repo filesystem migration |
| **Framework** | system-spec-kit + sk-deep-research + sk-deep-review |
| **Storage** | Filesystem-only packet state under `.opencode/specs/**` |
| **Testing** | Focused resolver/parity assertions, migration scan before/after, strict spec validation |

### Overview

Restore the shared deep-loop path resolver so root specs keep root-local artifact folders and child phases/sub-phases keep local-owner packet folders. Then migrate already-misplaced child packets across the repo, update the live docs/tests/runtime references to the same contract, and rebase phase 002 so later resource-map work emits beside the actual packet artifacts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Historical origin packet and follow-up commits identified
- [x] Shared resolver, reducers, YAML assets, and live doc surfaces located
- [x] Misplaced packet population scanned and quantified

### Definition of Done
- [x] Resolver, reducers, YAMLs, docs, and mirrors all follow the local-owner contract
- [x] Focused verification proves root, child, nested, and rerun cases
- [x] Repo-wide migration leaves no misplaced child packets under ancestor/root packet folders
- [x] Phase 002 packet docs name phase 001 as the prerequisite rollback
- [x] Phase 001 packet docs, rollback ledger, and implementation summary validate cleanly or document residual validation blockers honestly
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Rollback plus migration. One shared resolver defines the packet location contract; everything else writes only to the resolved `{artifact_dir}`. Existing repo artifacts are then moved to match the restored contract.

### Key Components
- **`review-research-paths.cjs`**: single source of truth for root-local vs child-local packet resolution.
- **Deep-loop reducers**: consume only the resolved `{artifact_dir}` and never derive child packet locations from an ancestor/root.
- **Command YAMLs and mirrors**: carry the resolved packet path through prompts, state, deltas, dashboards, and synthesis.
- **Migration pass**: discovers misplaced child packets, derives ownership from stored `specFolder`, moves them to the owning phase folder, and updates live canonical references.
- **Phase 001 docs + rollback ledger**: preserve the why, what changed, and the repo surfaces touched by the rollback.

### Data Flow

```
historical evidence + current resolver/runtime state
                    │
                    ▼
      restore local-owner resolveArtifactRoot() contract
                    │
                    ▼
    update reducers / YAML / docs / tests / dependent packet docs
                    │
                    ▼
 scan misplaced child packets under ancestor/root research|review
                    │
                    ▼
    move to owning local phase folder + rewrite live references
                    │
                    ▼
          verify no misplaced child packets remain
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract Rollback
- [x] Confirm historical origin notes from `006-integrity-parity-closure` and follow-up commits inside packet docs.
- [x] Finish shared resolver rollback and reducer alignment.
- [x] Update command YAMLs, mirrors, skill docs, references, and folder-structure docs to the local-owner contract.
- [x] Add focused path-resolution and contract-parity verification coverage.

### Phase 2: Repo-Wide Migration
- [x] Discover all misplaced child packets under root/ancestor `research/` and `review/` folders.
- [x] Derive each packet's owning spec from stored config/state metadata.
- [x] Move child-owned packets into the owning phase or sub-phase local folder without renaming them.
- [x] Rewrite live canonical references and add relocation notes only where current navigation would otherwise break.

### Phase 3: Packet Closure
- [x] Rebase phase 002 packet docs onto the restored local-owner contract.
- [x] Create phase 001 rollback `resource-map.md`.
- [x] Run focused verification plus post-migration scans.
- [x] Write `implementation-summary.md`, refresh packet metadata, and validate the packet strictly.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Resolver root/child/nested/rerun behavior | Focused Node assertions against `review-research-paths.cjs` |
| Contract | Runtime mirrors, shared assets, parity docs | Focused Node assertions / grep-backed checks |
| Migration | Misplaced-packet discovery before and after moves | Node scan over `.opencode/specs/**` |
| Manual | Spot-check moved packets and phase 002 doc assumptions | Shell inspection + strict packet validation |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `006-integrity-parity-closure` evidence trail | Internal | Green | Historical rollback rationale becomes weaker |
| `resolveArtifactRoot()` call sites | Internal | Green | Needed to keep writes bound to the restored contract |
| Stored `specFolder` metadata in packet config/state | Internal | Green | Required for safe migration ownership decisions |
| Phase 002 packet docs | Internal | Green | Must be rebased before dependent work resumes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Migration detects conflicting destinations, verification shows remaining misplaced child packets, or live docs/tests still encode parent-root placement.
- **Procedure**: Stop the migration pass, preserve moved packet locations as-is until ownership conflicts are resolved, and revert the code/doc contract changes only if the repo cannot be left in a consistent local-owner state.
- **Data safety**: Never overwrite conflicting destination packets. Prefer skip-and-report over destructive rollback.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Rollback Contract) ──► Phase 2 (Migration) ──► Phase 3 (Closure)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Rollback Contract | Historical evidence + current resolver/runtime state | Migration, Closure |
| Migration | Rollback Contract | Closure |
| Closure | Rollback Contract + Migration | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Rollback Contract | Medium | 2-3 hours |
| Migration | High | 2-4 hours |
| Closure | Medium | 1-2 hours |
| **Total** | | **~5-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Misplaced packet inventory captured before moves
- [x] Resolver/runtimes/docs all point to the local-owner contract
- [x] Post-migration scan plan ready before moving packets

### Rollback Procedure
1. Stop further moves when a conflict or ownership ambiguity is found.
2. Preserve both source and destination packets for manual inspection rather than overwriting.
3. Re-run the misplaced-packet scan to measure the partial migration state.
4. If necessary, revert only the code/doc rollback while keeping packet data safe and auditable.

### Data Reversal
- **Has data migrations?** Yes, filesystem packet relocation.
- **Reversal procedure**: Move only the packets handled in this turn back to their prior location if the repo cannot be left in a consistent state; otherwise prefer completing the migration rather than partial reversal.
<!-- /ANCHOR:enhanced-rollback -->
