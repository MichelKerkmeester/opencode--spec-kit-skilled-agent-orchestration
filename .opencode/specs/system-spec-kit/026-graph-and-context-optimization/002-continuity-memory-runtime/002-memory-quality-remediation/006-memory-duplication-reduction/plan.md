---
title: "Implementation Plan: Phase 6 — Memory Duplication Reduction"
description: "Phase 6 executes a five-iteration deep-research wave, then synthesizes and implements the approved duplication-reduction changes across the current recent memory surface."
trigger_phrases:
  - "phase 6 plan"
  - "memory duplication reduction plan"
  - "five iteration deep research"
importance_tier: important
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + phase-child + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/006-memory-duplication-reduction"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["plan.md"]

---
# Implementation Plan: Phase 6 — Memory Duplication Reduction

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + phase-child + level2-verify | v2.2 -->

---

Phase 6 is an evidence-first implementation plan. The current memory-save pipeline is treated as stable after Phases 1-5, so this phase begins with a five-dimension research sweep across recent memory stores before it applies any duplication-reduction edits.

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown memory artifacts plus phase-local documentation |
| **Framework** | Spec Kit phase workflow with deep-research iterations and validator-based closeout |
| **Storage** | Project-local memory folders, global Claude project memory folder, and any additional discovered recent-memory store |
| **Testing** | Corpus inventory checks, before/after sampling, validator runs, and synthesis-to-implementation trace review |

### Overview

The research wave is complete. The implementation plan now has two execution tracks: `PR-12` for the nine live-path code/template/reviewer fixes identified by the synthesis, and optional `PR-13` for the bounded stale-trigger migration/hardening work around `F001.2`. Everything else stays explicitly deferred unless a follow-up packet promotes it into scope.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Phase 5 closeout is complete and the recent memory-save surface is stable.
- [ ] The in-scope memory stores are inventoried before the iteration wave begins.
- [ ] The five research dimensions are fixed and mapped one-to-one to iteration outputs.

### Definition of Done

- [ ] Five iteration outputs exist, one per duplication dimension, and the findings registry covers all five.
- [ ] A canonical synthesis artifact defines the approved `PR-12` / `PR-13` remediation matrix.
- [ ] The approved remediation set is implemented and verified against semantic-loss risks.
- [ ] `validate.sh` exits cleanly for this phase folder.
- [ ] Phase 7 can use the resulting post-dedupe surface as its audit baseline.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Parallel research wave followed by synthesis-driven corpus remediation.

### Key Components

- **Frozen Research Inputs**: five completed iteration outputs plus the repaired `findings-registry.json`.
- **Canonical Synthesis**: `research/research.md` with the unified remediation matrix and post-Phase-6 deferrals.
- **Sub-PR PR-12**: live-path code/template/reviewer fixes for nine HIGH/MEDIUM findings.
- **Sub-PR PR-13**: optional bounded migration/re-sanitization for stale generic unigram survivors.
- **Verification Surface**: replay fixtures, reviewer assertions, validator runs, and Phase 7 handoff notes.

### Data Flow

Freeze the completed iteration evidence -> rebuild the findings registry if needed -> synthesize one remediation matrix -> land `PR-12` live-path fixes -> optionally land `PR-13` bounded migration -> verify preserved meaning and stable downstream surface.

### Research Wave Design

| Iteration | Focus | Output |
|-----------|-------|--------|
| Iteration 1 | Trigger-phrase duplication | `F001.1-F001.3` trigger-noise and near-duplicate map |
| Iteration 2 | Observations and decisions duplication | `F002.1-F002.4` observation/decision duplication map |
| Iteration 3 | `key_topics` and `FILES` duplication | `F003.1-F003.2` carrier-row and topic-normalization findings |
| Iteration 4 | `OVERVIEW` and `SUMMARY` duplication | `F004.1-F004.3` closeout and `Last:` repetition findings |
| Iteration 5 | Structural duplication | `F005.1-F005.4` scaffold and metadata-mirroring findings |
### File:Line Change List

| Sub-PR | Finding | Target File:Line | Change Intent |
|--------|---------|------------------|---------------|
| PR-12 | F001.1 | `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1248-1253; 1313-1328` | Remove unconditional scaffold-trigger injection and keep only guarded fallback anchors |
| PR-12 | F001.3 | `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:131-167`; `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:83-140`; `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:966-972` | Canonicalize hyphen/space dedupe and drop title/path overlap duplicates |
| PR-12 | F002.1 | `.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:337-364`; `.opencode/skill/system-spec-kit/templates/context_template.md:380-389` | Stop repeated `### OBSERVATION: Observation` output |
| PR-12 | F002.2 | `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:852-857`; `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:214-222; 285-348` | Collapse decision/outcome/rationale proposition restatement |
| PR-12 | F003.1 | `.opencode/skill/system-spec-kit/scripts/core/alignment-validator.ts:151-178` | Remove `Merged from ...` description inflation while keeping carrier rows |
| PR-12 | F004.1 | `.opencode/skill/system-spec-kit/templates/context_template.md:208` | Collapse completed-session closure guidance to one surface |
| PR-12 | F004.2 | `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:619` | Replace clipped `Last:` fragments with boundary-safe behavior |
| PR-12 | F005.1 | `.opencode/skill/system-spec-kit/templates/context_template.md:187-188; 736-737`; `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:274-278`; `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:343-345` | Remove redundant section-identity triplets and align parser/reviewer expectations |
| PR-12 | F005.2 | `.opencode/skill/system-spec-kit/templates/context_template.md:1-6; 755-836`; `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:1027-1087`; `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:666-673` | Establish one SSOT for frontmatter vs `MEMORY METADATA` classification fields |
| PR-13 | F001.2 | `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:46-69`; `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:141-165`; `.opencode/skill/system-spec-kit/scripts/lib/frontmatter-migration.ts:966-972` | Run bounded stale-trigger migration and only harden code if live leakage remains |

Deferred post-Phase-6: `F002.3`, `F002.4`, `F003.2`, `F004.3`, `F005.3`, `F005.4`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Freeze the research baseline

- [ ] Confirm the five iteration outputs and the repaired findings registry are the frozen implementation input.
- [ ] Keep `research/research.md` as the single source of truth for the Phase 6 remediation matrix.
- [ ] Record low-severity post-Phase-6 deferrals before any implementation PR starts.

### Phase 2: Sub-PR `PR-12` live-path fixes

- [ ] Land `F001.1` and `F001.3` trigger cleanup in `workflow.ts` / `trigger-phrase-sanitizer.ts` / `frontmatter-migration.ts`.
- [ ] Land `F002.1` and `F002.2` observation/decision dedupe fixes in the extractor and template path.
- [ ] Land `F003.1`, `F004.1`, and `F004.2` FILES/narrative duplication fixes.
- [ ] Land `F005.1` and `F005.2` structural SSOT and scaffold cleanup across template, reviewer, migration, and metadata parsing surfaces.

### Phase 3: Optional sub-PR `PR-13` migration/hardening

- [ ] Run a bounded stale-trigger migration for `F001.2` only if replay proves the cleanup is still needed after `PR-12`.
- [ ] Keep `PR-13` optional; defer it explicitly if the live-path fixes already eliminate the user-visible issue.

### Phase 4: Verification and handoff

- [ ] Run replay/fixture checks for every `PR-12` matrix row and the bounded `PR-13` sample if used.
- [ ] Confirm new reviewer assertions complement existing `CHECK-D1..D8` coverage.
- [ ] Validate this phase folder with `validate.sh --strict`.
- [ ] Update the phase checklist and implementation summary with the final dedupe state and explicit post-Phase-6 deferrals.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Research freeze verification | Confirm all five iteration outputs and the repaired findings registry are present before implementation starts | `research/iterations/` review, `jq`, packet doc review |
| Replay fixtures | Confirm each matrix row removes duplication without deleting unique meaning | Vitest or packet-local replay harness |
| Reviewer assertions | Confirm Phase 6 adds residual-duplication checks beyond existing `CHECK-D3` / `CHECK-D6` | `post-save-review.ts`, packet-local assertion plan |
| Documentation and phase validation | Confirm phase docs remain synchronized and validator-clean | `validate.sh --strict` |

### Verification Plan

- Replay at least one fixture family per matrix row, not just one corpus sample per store.
- For narrative and decision fixes, compare propositions and authored rationale rather than line counts alone.
- For structural fixes, verify parser/reviewer/indexer behavior as well as rendered markdown output.
- Reconfirm that deferred duplication classes are documented, not silently ignored.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 5 closeout | Internal | Required | Without a stable baseline, Phase 6 would measure transient defects instead of residual duplication. |
| Access to project-local and global recent-memory stores | Data | Required | The research wave cannot define duplication accurately if part of the corpus is missing. |
| Five dedicated iteration outputs plus repaired findings registry | Process | Required | Implementation scope stays undefined without the per-dimension evidence and canonical severity map. |
| Phase 7 downstream audit | Successor | Planned | Phase 6 must leave a stable post-dedupe surface for the audit work. |

### Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Duplicate-looking text is actually distinct context | Wrong edits could reduce retrieval quality | Require synthesis review and keep high-risk classes deferred |
| Optional migration is not actually needed after PR-12 | Extra work adds churn without user value | Make `PR-13` bounded and skippable based on replay evidence |
| Structural dedupe breaks parser/reviewer expectations | Search, indexing, or anchors could regress | Tie structural changes to parser/reviewer verification, not markdown snapshots alone |
| The remediation set grows into broad editorial cleanup | Scope balloons and slows handoff | Keep Phase 6 capped at `PR-12` plus optional `PR-13` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Dedupe edits collapse distinct meaning, erase required structure, break parser/reviewer expectations, or make the downstream audit surface less stable.
- **Procedure**:
  1. Stop further corpus edits.
  2. Revert the affected duplication-reduction changes.
  3. Reclassify the duplicate class as deferred if it cannot be reduced safely.
  4. Re-run sample verification and the phase validator before resuming.

### Rollback Boundaries

- Changes should stay grouped by remediation row or sub-PR so they can be reverted cleanly.
- Deferred duplication classes should remain documented even if implemented edits are rolled back.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Setup / Inventory
        |
        v
Five Parallel Research Iterations
        |
        v
Synthesis / Approved Remediation Set
        |
        v
Implementation
        |
        v
Verification / Phase 7 Handoff
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup / Inventory | Phase 5 closeout | Research wave |
| Research wave | Setup / Inventory | Synthesis |
| Synthesis | Research wave | Implementation |
| Implementation | Synthesis | Verification |
| Verification | Implementation | Phase 7 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup / Inventory | Medium | 0.5-1 day |
| Five Iterations | High | 1-2 days |
| Synthesis / Remediation Design | Medium | 0.5-1 day |
| Implementation | Medium | 0.5-1 day |
| Verification / Handoff | Low | 0.5 day |
| **Total** | | **3-5 days** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Controls

- [ ] Corpus inventory frozen
- [ ] Five iteration outputs present
- [ ] Approved remediation set documented

### Rollback Procedure

1. Revert the affected duplication-reduction slice.
2. Mark the duplicate class as deferred if semantic loss caused the rollback.
3. Re-run before/after sampling on the reverted slice.
4. Update the phase summary so Phase 7 inherits the correct stable state.

### Data Reversal

- **Has corpus rewrites?** Yes
- **Reversal procedure**: Revert by duplication class or store slice using the recorded remediation summary.
<!-- /ANCHOR:enhanced-rollback -->
