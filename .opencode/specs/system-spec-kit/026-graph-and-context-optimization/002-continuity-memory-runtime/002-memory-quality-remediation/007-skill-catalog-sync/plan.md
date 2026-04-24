---
title: "...ph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/007-skill-catalog-sync/plan]"
description: "Phase 7 runs ten deep-review iterations in 4/4/2 waves, synthesizes downstream parity drift, and updates only the surfaces that need sync after Phase 1-6."
trigger_phrases:
  - "phase 7 plan"
  - "skill catalog sync plan"
  - "ten review iterations"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/007-skill-catalog-sync"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["plan.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + phase-child + level2-verify | v2.2 -->"
---
# Implementation Plan: Phase 7 — Skill Catalog Sync

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + phase-child + level2-verify | v2.2 -->

---

Phase 7 is a downstream parity plan. It waits for Phase 6 to freeze the final memory state, then audits ten supporting surfaces in controlled review waves before it applies any sync updates.

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs, templates, agent definitions, command docs, and supporting system-spec-kit surfaces |
| **Framework** | Spec Kit phase workflow with deep-review iterations and validator-based closeout |
| **Storage** | Repo-local docs, templates, command files, MCP surfaces, and agent definitions |
| **Testing** | Review-wave outputs, parity synthesis, targeted artifact checks, and `validate.sh` |

### Overview

The plan uses ten review dimensions so downstream parity does not rely on memory or assumptions. The review wave runs in three batches: 4 surfaces, 4 surfaces, and 2 surfaces. After that, one synthesis decides which artifacts actually need updates and which are already current. Only then does implementation begin.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Phase 6 implementation summary exists and defines the final post-dedupe state.
- [ ] The ten approved review dimensions are fixed and mapped one-to-one to iteration outputs.
- [ ] Wave sequencing and synthesis rules are documented before the review work starts.

### Definition of Done

- [ ] Ten review outputs exist across the 4/4/2 wave structure.
- [ ] A parity synthesis records update/no-update status for all ten surfaces.
- [ ] Only synthesis-approved downstream updates are implemented.
- [ ] The phase validator exits cleanly.
- [ ] The final summary leaves a durable downstream parity record.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Three-wave downstream audit followed by synthesis-driven parity updates.

### Key Components

- **Phase 6 baseline**: the frozen post-dedupe memory behavior used as the comparison point.
- **Ten Review Outputs**: one artifact per downstream surface under `research/iterations/`.
- **Parity Synthesis**: update/no-update matrix plus rationale for every dimension.
- **Approved Update Set**: the exact downstream edits allowed after synthesis.
- **Verification Surface**: artifact-level parity checks plus phase validation.

### Data Flow

Confirm Phase 6 baseline -> run Wave 1 reviews -> run Wave 2 reviews -> run Wave 3 reviews -> synthesize drift -> apply approved parity updates -> verify updated and no-change surfaces.

### Review Wave Design

| Wave | Dimensions | Goal |
|------|------------|------|
| Wave 1 | 1-4 | Audit feature catalog, playbook, the `system-spec-kit` skill entrypoint, and references |
| Wave 2 | 5-8 | Audit assets, templates, memory commands, and MCP server |
| Wave 3 | 9-10 | Audit agent definitions plus README/install docs |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup and baseline freeze

- [x] Confirm Phase 6 completion and capture the final post-dedupe behavior summary.
- [x] Publish all ten review outputs and the findings JSONL before downstream edits begin.
- [x] Freeze the approved 13-row update matrix in `research/review-report.md`.

### Phase 2: File:Line Change List (Sub-PR-14 + Sub-PR-15)

| Matrix ID | Severity | Owner File:Line | Planned Change |
|-----------|----------|-----------------|----------------|
| `F004.1` | P0 | `.opencode/skill/system-spec-kit/references/templates/template_guide.md:600-626` | Replace `generate-context.ts` save-rule wording with the canonical runtime `generate-context.js` language. |
| `F007.1` | P0 | `.opencode/command/memory/save.md:303-305` | Replace the incomplete Step 5 command summary with a full JSON-mode runtime command. |
| `F008.1` | P0 | `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:138-169` | Remove `<a id>` scaffolding and rename the overview anchor from `summary` to `overview`. |
| `F008.2` | P0 | `.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:64-95` | Remove `<a id>` scaffolding and rename the overview anchor from `summary` to `overview`. |
| `F003.1` | P1 | `.opencode/skill/system-spec-kit/SKILL.md:964-969` | Update the resource inventory row to name the runtime save entrypoint. |
| `F004.2` | P1 | `.opencode/skill/system-spec-kit/references/templates/level_specifications.md:762-769` | Rename the `memory/` creation method so the table matches the `.js` runtime example. |
| `F004.3` | P1 | `.opencode/skill/system-spec-kit/references/memory/memory_system.md:23-26,687-688` | Update the component table and scripts list to distinguish runtime entrypoint from source file. |
| `F004.4` | P1 | `.opencode/skill/system-spec-kit/references/workflows/execution_methods.md:77-90` | Rename the save-workflow section heading so it matches the `.js` commands underneath. |
| `F007.2` | P1 | `.opencode/command/memory/save.md:279-280` | Update the example tool-call transcript so it no longer calls `.ts` the CLI entry point. |
| `F009.1` | P1 | `.opencode/agent/orchestrate.md:574-577` | Replace the bare script-plus-path handover reminder with a canonical JSON-mode save example. |
| `F009.2` | P1 | `.claude/agents/orchestrate.md:563-566` | Replace the bare script-plus-path handover reminder with a canonical JSON-mode save example. |
| `F010.1` | P1 | `.opencode/skill/system-spec-kit/README.md:548-562` | Rename the memory-scripts table row so the runtime `.js` path is the primary save workflow. |

### Phase 3: Verification and closeout

- [ ] Re-check every changed downstream surface against the final Phase 1-6 behavior.
- [ ] Record the four confirmed-current surfaces as no-change in the final implementation summary.
- [ ] Validate this phase folder with `validate.sh --strict`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Review completeness | Confirm all ten surfaces have iteration outputs | `research/iterations/` contents review |
| Parity synthesis review | Confirm every dimension has update/no-update status | Synthesis matrix inspection |
| Artifact verification | Confirm changed and unchanged surfaces both reflect the final Phase 1-6 state | Targeted file review, `rg`, validator |
| Documentation validation | Confirm phase docs stay synchronized and validator-clean | `validate.sh --strict` |

### Verification Plan

- Confirm all 10 iteration files exist and `research/findings.jsonl` parses cleanly.
- Publish `research/review-report.md` with the 13-row matrix and the four confirmed-current surfaces.
- For every changed surface, capture a short parity note describing the exact drift that required the update.
- For every confirmed-current surface, record the no-change rationale in the review report and implementation summary.
- Re-run targeted checks on changed docs, commands, tests, and agent definitions before closeout.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 6 completion | Internal | Required | Phase 7 cannot audit downstream parity against a moving baseline. |
| Ten dedicated review outputs | Process | Required | The update set cannot be justified without one output per surface. |
| Synthesis matrix | Process | Required | Downstream edits should not begin until required vs no-change surfaces are frozen. |
| Named downstream surfaces | Repo state | Required | The phase must be able to inspect each declared surface directly. |

### Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| A surface is edited even though it was already current | Unneeded churn and review noise | Require synthesis approval before editing |
| A surface is marked current without enough evidence | Drift survives the audit | Record a short no-change rationale for every reviewed surface |
| Multiple surfaces describe the same behavior differently | Updates become inconsistent | Use one parity synthesis as the shared truth source |
| Wave sequencing slips into one large undifferentiated pass | Review quality and traceability drop | Keep the 4/4/2 structure explicit in tasks and verification |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A downstream sync edit is unnecessary, inaccurate, or contradicts the final Phase 1-6 behavior.
- **Procedure**:
  1. Stop further downstream edits.
  2. Revert the affected parity update.
  3. Reclassify that surface in the synthesis matrix if needed.
  4. Re-run targeted parity verification before resuming.

### Rollback Boundaries

- Keep updates grouped by reviewed surface so reversions stay localized.
- Preserve no-change notes even when changed-surface edits are rolled back.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 6 Baseline
      |
      v
Wave 1 Reviews (4)
      |
      v
Wave 2 Reviews (4)
      |
      v
Wave 3 Reviews (2)
      |
      v
Synthesis / Approved Update Set
      |
      v
Implementation / Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup / Baseline | Phase 6 | Review waves |
| Wave 1 | Setup / Baseline | Wave 2 |
| Wave 2 | Wave 1 | Wave 3 |
| Wave 3 | Wave 2 | Synthesis |
| Synthesis / Updates | All review waves | Verification |
| Verification | Updates | Closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup / Baseline | Low | 0.5 day |
| Wave 1 Reviews | Medium | 0.5-1 day |
| Wave 2 Reviews | Medium | 0.5-1 day |
| Wave 3 Reviews | Low | 0.5 day |
| Synthesis / Updates | Medium | 0.5-1 day |
| Verification / Closeout | Low | 0.5 day |
| **Total** | | **3-4 days** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Controls

- [ ] Phase 6 baseline frozen
- [ ] Ten review outputs present
- [ ] Approved update set documented

### Rollback Procedure

1. Revert the affected downstream surface edits.
2. Update the parity synthesis to reflect the corrected status.
3. Re-run targeted parity checks on the reverted surface.
4. Confirm the remaining surfaces still align with the final Phase 1-6 behavior.

### Data Reversal

- **Has downstream artifact rewrites?** Yes
- **Reversal procedure**: Revert by reviewed surface using the approved update set summary.
<!-- /ANCHOR:enhanced-rollback -->
