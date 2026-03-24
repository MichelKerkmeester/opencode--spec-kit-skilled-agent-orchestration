---
title: "Implementation Plan: Skill Alignment — system-spec-kit"
description: "Truth-reconciled plan for closing the last system-spec-kit documentation gaps after the current memory command surface and agent/runtime alignment landed."
trigger_phrases: ["implementation", "plan", "skill alignment", "011 alignment"]
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Skill Alignment — system-spec-kit
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation only |
| **Framework** | Spec Kit Level 2 spec-folder workflow |
| **Source of Truth** | `mcp_server/tool-schemas.ts`, `.opencode/command/memory/`, current `system-spec-kit` docs |
| **Verification** | `validate.sh --strict`, targeted `rg`, live count checks |

### Overview

This phase no longer tracks a broad pre-implementation alignment effort. It now serves as the closeout plan for the last `system-spec-kit` documentation work: current memory-surface wording in SKILL.md, save-workflow/shared-memory governance framing, embedding/shared-space governance framing, and campaign/shared-space/cross-phase asset guidance.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Live memory truth confirmed as 33 tools and 6 commands
- [x] Retrieval ownership confirmed in `/memory:analyze`
- [x] Current `system-spec-kit` docs spot-checked to separate landed work from remaining gaps

### Definition of Done
- [x] The 011 pack tells one consistent documentation-only story
- [x] The 011 pack no longer repeats obsolete command-surface counts or the retired standalone retrieval command model
- [x] The last observable `system-spec-kit` documentation drift is isolated and ready for closeout
- [x] Strict Spec Kit validation passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation closeout reconciliation.

### Key Components
- **Spec pack**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`
- **Skill guide target**: SKILL.md wording for the live memory surface plus save-workflow/shared-memory governance framing
- **Reference targets**: memory references for save workflow and embedding governance
- **Asset targets**: campaign/shared-space/cross-phase guidance in the asset docs

### Data Flow
Live repo truth informs the reconciled spec pack. The reconciled pack then acts as the implementation contract for the final `system-spec-kit` documentation updates in scope for phase 011.

### Verification Methodology
- Count live tools from `mcp_server/tool-schemas.ts`
- Count live memory commands from `.opencode/command/memory/*.md`
- Confirm retrieval ownership in `/memory:analyze`
- Remove any backlog item already covered in current `system-spec-kit` docs
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Reconcile the 011 Pack
- [x] Update all five canonical docs to the live 33-tool, 6-command memory story
- [x] Remove stale command-surface count language and retired standalone retrieval-command wording
- [x] Keep the scope explicitly documentation-only

### Phase 2: Skill-Guide Backlog
- [x] Update SKILL.md memory-surface wording to the live 33-tool, 6-command, `/memory:analyze` model
- [x] Add save-workflow/shared-memory governance framing to SKILL.md

### Phase 3: Memory-Reference Backlog
- [x] Add shared-memory governance and save-routing framing to references/memory/save_workflow
- [x] Add shared-space and governance framing to references/memory/embedding_resilience

### Phase 4: Asset Backlog
- [x] Add campaign/shared-space/cross-phase guidance to parallel_dispatch_config
- [x] Add campaign/shared-space/cross-phase guidance to the complexity and level decision assets
- [x] Add campaign/shared-space/cross-phase template-routing guidance to template_mapping

### Phase 5: Verification
- [x] Run strict validation for the reconciled 011 pack
- [x] Re-run stale-string checks for obsolete command-surface language
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Strict spec validation | Entire `011-skill-alignment` folder | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ... --strict` |
| Stale-string audit | Canonical 011 docs only | Run a targeted grep for obsolete command-surface phrases, then manually confirm any hit is historical/negative rather than a current-state claim |
| Live count verification | Memory tool and command surface | `node` against `tool-schemas.ts`, `find .opencode/command/memory -name '*.md'` |
| Ownership verification | Retrieval command home | `rg` or `Read` on `.opencode/command/memory/analyze.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` | Internal | Green | Live tool count could not be verified |
| `.opencode/command/memory/` | Internal | Green | Live command count and ownership could not be verified |
| Current `system-spec-kit` docs | Internal | Green | Remaining backlog could not be narrowed accurately |
| `012-command-alignment` delivered docs | Internal | Green | 011 could drift back to the superseded command model |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The reconciled pack reintroduces obsolete command-surface wording or loses genuine remaining backlog items.
- **Procedure**: Revert only the 011 spec-pack edits, re-check live repo truth, and re-apply the reconciliation with the same strict verification steps.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Pack Reconciliation) ──► Phase 2 (Skill Guide)
                                 ├─► Phase 3 (References)
                                 ├─► Phase 4 (Assets)
                                 └─► Phase 5 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Pack Reconciliation | None | All later work |
| Skill-Guide Closeout | Pack Reconciliation | Final implementation closeout |
| Memory-Reference Closeout | Pack Reconciliation | Final implementation closeout |
| Asset Closeout | Pack Reconciliation | Final implementation closeout |
| Verification | Pack Reconciliation | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Pack Reconciliation | Low | <1 hour |
| Skill-Guide Closeout | Medium | 1-2 hours |
| Memory-Reference Closeout | Medium | 1-2 hours |
| Asset Closeout | Medium | 1-2 hours |
| Verification | Low | <1 hour |
| **Total Closeout Work** | | **3-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-execution Checklist
- [x] Canonical tool-count source verified
- [x] Live memory command count verified
- [x] Current `system-spec-kit` docs spot-checked

### Rollback Procedure
1. Revert the 011 spec-pack docs if the reconciliation introduces incorrect current-state claims.
2. Re-run the live count and ownership checks.
3. Re-apply only the corrections needed to restore current repo truth.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
