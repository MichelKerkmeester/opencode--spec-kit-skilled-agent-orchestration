---
title: "Implementation Plan: Smart-Router Resilience Pattern and Repo-Wide Adoption"
description: "Finish the remaining IMPL-012 markdown edits by patching sk-deep-review, adding the eight missing cross-links, and verifying the counts plus workflow-invariance test."
trigger_phrases:
  - "implementation"
  - "smart router"
  - "skill cross-links"
  - "workflow invariance"
importance_tier: "important"
contextType: "general"
level: 2
status: complete
_memory:
  continuity:
    packet_pointer: "026-graph-and-context-optimization/012-sk-doc-smart-router-resilience-template"
    last_updated_at: "2026-05-03T00:58:00+02:00"
    last_updated_by: "codex"
    recent_action: "Finished IMPL-012 mop-up edits and verification."
    next_safe_action: "Review diff or commit manually outside this task."
    blockers: []
    key_files:
      - ".opencode/skill/sk-deep-review/SKILL.md"
      - ".opencode/skill/system-spec-kit/SKILL.md"
    session_dedup:
      fingerprint: "sha256:2222222222222222222222222222222222222222222222222222222222222222"
      session_id: "impl-012-finisher"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Smart-Router Resilience Pattern

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill documentation with Python pseudocode |
| **Framework** | OpenCode skill docs |
| **Storage** | Filesystem only |
| **Testing** | `rg` count checks, vitest workflow-invariance, spec validation |

### Overview

The work is a focused markdown repair: add the canonical asset link to eight skills and patch the final missing `sk-deep-review` smart-router section with runtime discovery, guarded loading, extensible routing, and fallback behavior. The plan optimizes for minimal drift from existing skill intent maps and load levels.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Spec folder supplied by user.
- [x] Canonical asset path identified at `.opencode/skill/sk-doc/assets/skill/skill_smart_router.md`.
- [x] Existing linked format identified from sibling skills.

### Definition of Done

- [x] All requested SKILL.md edits completed.
- [x] Pattern marker count is 19.
- [x] Cross-link count is 19.
- [x] Workflow-invariance test passes.
- [x] Spec docs updated for strict validation.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Markdown documentation update with skill-local router pseudocode.

### Key Components

- **Canonical asset**: `.opencode/skill/sk-doc/assets/skill/skill_smart_router.md` remains the source pattern.
- **Skill smart-router sections**: each skill links back to the canonical asset.
- **`sk-deep-review` router**: keeps review intent scoring and load levels while adopting discovery, load guard, routing key, and fallback mechanics.

### Data Flow

Users read a skill's SMART ROUTING section, follow the cross-link to the canonical asset when they need the full pattern, and use the local pseudocode for skill-specific routing behavior.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skill/sk-deep-review/SKILL.md` | Final skill missing pattern markers | Add resilient router pseudocode and cross-link | Pattern marker count returns 19. |
| Eight listed skill files | Already had markers, missing asset link | Add sibling-path cross-link near SMART ROUTING heading | Cross-link count returns 19. |
| Workflow-invariance test | Guards user-facing wording rules | Run requested vitest command | Test exits 0. |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Inspect Existing Pattern

- [x] Read canonical smart-router asset.
- [x] Find existing cross-link format in already-linked skills.
- [x] Read `sk-deep-review` SMART ROUTING section.

### Phase 2: Apply Skill Edits

- [x] Add `sk-deep-review` cross-link and resilient router pseudocode.
- [x] Add cross-links to `sk-code`, `sk-code-opencode`, `sk-code-review`, `sk-deep-research`, `sk-git`, `sk-improve-agent`, `sk-improve-prompt`, and `system-spec-kit`.

### Phase 3: Verification

- [x] Run pattern marker count.
- [x] Run cross-link count.
- [x] Run workflow-invariance test.
- [x] Run strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Search count | Pattern markers across 19 skills | `rg`, `wc` |
| Search count | Canonical asset cross-links across 19 skills | `rg`, `wc` |
| Regression | Workflow-invariance wording guard | `vitest` |
| Documentation | Established spec folder strict validation | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Canonical smart-router asset | Internal file | Available | Cross-link target must exist. |
| `vitest` under system-spec-kit | Internal test runner | Available | Required workflow-invariance check could not run without it. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Marker count, cross-link count, or workflow-invariance test fails.
- **Procedure**: Reopen the changed SMART ROUTING sections, restore the missing pattern or link, and rerun the same verification commands.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Inspect pattern -> Apply skill edits -> Verify counts and test -> Validate spec docs
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inspect | None | Skill edits |
| Skill edits | Inspect | Verification |
| Verification | Skill edits | Completion |
| Spec validation | Packet docs present | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inspect | Low | 5 minutes |
| Skill edits | Medium | 10 minutes |
| Verification | Low | 5 minutes |
| Spec validation repair | Medium | 15 minutes |
| **Total** | | **35 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] No branch switch.
- [x] No commit.
- [x] Existing unrelated worktree changes preserved.

### Rollback Procedure

1. Revert only the nine target skill doc edits if verification identifies a bad patch.
2. Reapply the cross-link or router section using the canonical asset.
3. Rerun all requested checks.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Git diff review is sufficient because changes are markdown-only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:phase-2-propagation-ladder -->
## Phase 2 Ladder: 12-File Size and Router Alignment

1. Read the canonical smart-router asset once and use it as the structural reference for all edited files.
2. Process the 12 host `SKILL.md` files in four sequential batches of three, longest first.
3. For each file, cut static file inventories, duplicate checklist boilerplate, oversized inline examples, or duplicate load-level prose while preserving skill-specific routing intent.
4. Confirm every smart-router section retains Pattern 1 Runtime Discovery, Pattern 2 Existence-Check Before Load, Pattern 3 Extensible Routing Key, and Pattern 4 Multi-Tier Graceful Fallback.
5. Run V1-V4 after each file: LOC cap/target, canonical marker grep, Pattern 1-4 grep, and file-scoped diff stat.
6. After all 12 files pass, update packet docs once with scope, task, checklist, and result evidence.
7. Run final aggregate verification for the 12 skill files, Stream A disjointness, and packet doc markers.
<!-- /ANCHOR:phase-2-propagation-ladder -->
