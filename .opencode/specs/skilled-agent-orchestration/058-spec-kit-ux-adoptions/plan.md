---
title: "Implementation Plan: spec-kit UX adoptions from SPAR-Kit research"
description: "5-phase Level 2 implementation: gate copy and question budget, phase-boundary headers, four-axis command taxonomy, template inventory and source manifest, persona evaluation fixtures. Plus 3 reject-rationale records (067/068/069)."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2"
trigger_phrases:
  - "058 spec kit ux plan"
  - "spec kit ux adoptions plan"
  - "058 plan"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/058-spec-kit-ux-adoptions"
    last_updated_at: "2026-05-01T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan authored across 5 phases"
    next_safe_action: "Begin Phase 1 question budget copy edits"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: spec-kit UX adoptions from SPAR-Kit research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML/JSON; no runtime code changes |
| **Framework** | None — copy edits, manifest authoring, fixture authoring |
| **Storage** | Filesystem only (`.opencode/command/`, `.opencode/skill/system-spec-kit/`) |
| **Testing** | `validate.sh --strict`; manual visual review; cross-link verification |

### Overview
Land the 5 approved UX adoptions from packet 057's deep-research convergence as 5 sequential phases. Each phase produces concrete artifacts (edited files, new manifests, new fixtures) without touching the validator, skill advisor, memory MCP, or any runtime command behavior. The work is mostly copy editing and inventory authoring; the highest-complexity phase is Phase 4 (template inventory + source manifest), gated on a strict-validation corpus baseline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement and scope documented (`spec.md` §2-3)
- [x] Success criteria measurable (`spec.md` §5)
- [x] Dependencies identified (`spec.md` §6)
- [x] Research foundation complete (`../057-cmd-spec-kit-ux-upgrade/research/research.md`)
- [x] User-approved adoption set finalized (5 adopt + 3 reject-rationale records)

### Definition of Done
- [ ] All 5 phases complete with verification artifacts
- [ ] `validate.sh --strict` on this packet exits 0 or 1
- [ ] No edits to `validate.sh`, `skill-advisor.py`, `mcp_server/`, agent runtime files
- [ ] `implementation-summary.md` authored with per-phase outcomes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation + inventory + fixture pattern. No runtime architecture changes. All edits are additive (new docs/fixtures/manifests) or copy-replace within existing files (Phase 1 prompt copy, Phase 2 README headers).

### Key Components
- **Phase 1 target**: 6 command markdown setup-phase prompts + matching YAML asset comments
- **Phase 2 target**: command READMEs and AGENTS.md command-reference section
- **Phase 3 artifact**: new `command-taxonomy.md` reference doc with 4-axis matrix
- **Phase 4 artifacts**: `INVENTORY.md` (classification) + `source-manifest.yaml` (source-of-truth ownership)
- **Phase 5 artifacts**: 6 persona fixtures + 1 README in a new directory
- **Cross-cutting**: 3 reject-rationale records under `system-spec-kit/references/decisions/`

### Data Flow
None — no runtime data flow changes. Phase 4's `source-manifest.yaml` is read-only inspection metadata; nothing consumes it during command execution.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 — Gate copy + question budget
- [ ] Read packet-057 finding-1 evidence (`research/iterations/iteration-009.md` F-iter009-001)
- [ ] Audit all 6 spec_kit command setup phases for current consolidated-prompt copy
- [ ] Draft new copy template: **Required to proceed** vs **Optional refinements** sections, max 3 + 4 questions respectively
- [ ] Apply to `plan.md`, `implement.md`, `deep-research.md`, `deep-review.md`, `resume.md`, `complete.md`
- [ ] Mirror copy in matching `assets/*.yaml` setup-phase YAML comments
- [ ] Preserve every Gate-3 answer key (A/B/C/D/E) verbatim
- [ ] Verify gate-3 classifier still parses correctly: `node .opencode/skill/system-spec-kit/shared/gate-3-classifier.ts` smoke test

### Phase 2 — Phase boundary copy pass
- [ ] Read packet-057 finding-2 evidence (F-iter009-002)
- [ ] Add four section headers above the command list in `command/spec_kit/README.txt`: Specify / Plan / Act / Retain
- [ ] Map each existing command to its phase (intake → Specify; plan → Plan; implement/complete → Act; resume/deep-research/deep-review → Retain context)
- [ ] Add the same headers to `command/README.md` if it exists
- [ ] Add a brief Specify/Plan/Act/Retain section to AGENTS.md command-reference area without modifying gates or memory rules
- [ ] Verify command list count unchanged

### Phase 3 — Four-axis taxonomy doc
- [ ] Read packet-057 finding-3 evidence (F-iter009-003)
- [ ] Author new file `command/spec_kit/references/command-taxonomy.md`
- [ ] Document each axis: execution mode, feature flag, lifecycle intent, executor/provenance
- [ ] For each axis: definition, examples, where it appears (CLI flag / mode suffix / etc.)
- [ ] Build a compatibility matrix table (commands × axes; mark which apply)
- [ ] Cross-link from command READMEs and from `system-spec-kit/SKILL.md` skill-routing section if appropriate
- [ ] Verify cross-links resolve

### Phase 4 — Template inventory + source-layer manifest
- [ ] Read packet-057 finding-6 evidence (F-iter009-006)
- [ ] **Prerequisite**: Run a strict-validation baseline sample across the corpus (50 random spec folders); record pass/fail per folder; surface drift before manifest authoring
- [ ] List all files under `system-spec-kit/templates/` recursively
- [ ] Classify each into one of 5 roles: source / generated / validation-critical / example / optional
- [ ] Write `system-spec-kit/templates/INVENTORY.md` with the classification table
- [ ] Author `system-spec-kit/templates/source-manifest.yaml` listing only the source-layer files with a brief role and consumer note
- [ ] Cross-check classification against `validate.sh` invocations, `is_phase_parent()` consumers, and `compose.sh`
- [ ] Mark anything ambiguous as `unknown` rather than guessing; surface for follow-up

### Phase 5 — Persona evaluation fixtures
- [ ] Read packet-057 finding-8 evidence (F-iter009-008) and `057/external/Research/Personas/Personas.md`
- [ ] Decide directory: `system-spec-kit/references/personas/` (default) vs alternative
- [ ] Author 6 fixture files: `vera.md`, `pete.md`, `tess.md`, `maya.md`, `max.md`, `cass.md`
- [ ] Each fixture is a doc-review checklist; format: persona summary → primary needs → red flags to look for → 5-10 review questions
- [ ] Author `personas/README.md` explaining the fixture model and the **evaluation-only, never-runtime** boundary
- [ ] Verify every fixture loads as plain markdown without YAML errors

### Reject-rationale records (P1, can land in any phase)
- [ ] Author `system-spec-kit/references/decisions/067-generated-block-budget.md`
- [ ] Author `system-spec-kit/references/decisions/068-runtime-persona-boundary.md`
- [ ] Author `system-spec-kit/references/decisions/069-template-compression-boundary.md`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validator | Spec packet integrity | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh` |
| Manual visual | Command READMEs, fixture readability | Browser / editor preview |
| Smoke | Gate-3 classifier still parses post-Phase 1 | Node script invocation |
| Cross-link | Phase 3 doc references resolve | grep / link checker |
| Sample | Strict-validation baseline (Phase 4 prerequisite) | `validate.sh --strict` over 50 spec folders |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `057-cmd-spec-kit-ux-upgrade/research/research.md` | Internal | Pending synthesis (in flight at packet creation time) | Phase 1-5 evidence cites iteration narratives directly; not blocked |
| `validate.sh --strict` | Internal | Green | Phase 4 prerequisite |
| `gate-3-classifier.ts` | Internal | Green | Phase 1 verification |
| Strict-validation corpus baseline | Internal | Pending Phase 4 first task | Gates Phase 4 manifest authoring |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any phase regresses operator UX or breaks `validate.sh --strict` exit code on the corpus sample
- **Procedure**: `git revert` the offending phase's commit(s); each phase is committed independently
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (gate copy) ────────┐
Phase 2 (phase headers) ────┤
Phase 3 (taxonomy doc) ─────┼──► all phases independent of each other
Phase 4 (template inventory) ─► gated on strict-validation baseline
Phase 5 (persona fixtures) ──┘

Reject-rationale records: independent of all phases; can land any time
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 (gate copy) | None | Nothing |
| 2 (phase headers) | None | Nothing |
| 3 (taxonomy doc) | None | Nothing |
| 4 (template inventory) | Strict-validation baseline | Future template-architecture work |
| 5 (persona fixtures) | Decision on directory | Nothing |
| Reject-rationale (3 docs) | None | Nothing |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (gate copy) | Low | 2-3 hours |
| Phase 2 (phase headers) | Low | 1 hour |
| Phase 3 (taxonomy doc) | Medium | 3-4 hours |
| Phase 4 (template inventory + manifest) | Medium | 4-6 hours (incl. baseline sample) |
| Phase 5 (persona fixtures) | Low | 2-3 hours |
| Reject-rationale (3 docs) | Low | 1-2 hours |
| **Total** | | **13-19 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Each phase committed independently
- [ ] `validate.sh --strict` baseline captured before Phase 4
- [ ] Persona-fixture directory location confirmed before Phase 5

### Rollback Procedure
1. Identify the offending phase (visual review or validator regression)
2. `git revert <phase-commit-hash>`; each phase has its own commit
3. Re-run `validate.sh --strict` to confirm green
4. Update `_memory.continuity.recent_action` to reflect rollback

### Data Reversal
- **Has data migrations?** No — pure documentation and inventory work
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
