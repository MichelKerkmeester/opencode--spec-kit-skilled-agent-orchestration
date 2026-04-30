---
title: "Implementation Plan: References and READMEs Lean-Trio Sync"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Three-phase rollout: Critical contradictions, Medium clarity gaps, Low minor clarifications. Doc-only; mirror canonical wording from already-updated docs."
trigger_phrases:
  - "phase parent doc sync plan"
  - "references readme sync plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/014-phase-parent-documentation/003-references-and-readme-sync"
    last_updated_at: "2026-04-27T13:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan.md three-phase rollout"
    next_safe_action: "Author tasks.md"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Implementation Plan: References and READMEs Lean-Trio Sync

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (docs only); no code changes |
| **Framework** | system-spec-kit reference and template architecture |
| **Storage** | Filesystem (in-place edits to existing docs) |
| **Testing** | `validate.sh --strict` on the new packet + 026 regression + grep-based stale-phrase checks |

### Overview
Three sequential sub-phases land 13 doc updates in priority order. Sub-phase A handles the five CRITICAL contradictions (where current docs say things that directly conflict with shipped behavior). Sub-phase B handles the five MEDIUM clarity gaps (true but incomplete coverage). Sub-phase C handles the two LOW minor clarifications. Each edit is small (1–10 lines mostly), surgical, and mirrors canonical wording already shipped in CLAUDE.md, AGENTS.md, system-spec-kit `SKILL.md`, `resume.md`, and `skill-advisor-hook.md`. No new templates, no new validators, no code.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Plan source available at `/Users/michelkerkmeester/.claude/plans/do-a-deep-dive-peaceful-pine.md`
- [ ] Phases 001 + 002 + small follow-on validator extension all shipped (verified by 026 regression baseline)
- [ ] Canonical phase-parent wording exists in CLAUDE.md, AGENTS.md, AGENTS_Barter.md, AGENTS_example_fs_enterprises.md, system-spec-kit SKILL.md, resume.md, skill-advisor-hook.md (sources to mirror)

### Definition of Done
- [ ] All P0 acceptance criteria met (REQ-001 through REQ-006)
- [ ] All P1 acceptance criteria met OR user-approved deferral (REQ-007 through REQ-011)
- [ ] No new SPEC_DOC_INTEGRITY error class introduced beyond baseline forward-reference noise
- [ ] No NEW PHASE_PARENT_CONTENT advisory warnings on existing phase parents (the rule scans the lean-parent spec.md only; this packet does not edit lean parents)
- [ ] 026 regression preserved: parent-level error rules remain at current 3 (FRONTMATTER_MEMORY_BLOCK, SPEC_DOC_INTEGRITY, TEMPLATE_SOURCE)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mirror, do not re-coin. Each edit copies wording verbatim or near-verbatim from a canonical source already shipped in 001 / 002. Where the doc audience differs (e.g. README's plain-prose tone vs SKILL.md's reference style), preserve the audience but keep the policy facts identical.

### Canonical Sources To Mirror

- `AGENTS.md` §3 Documentation Levels — Phase Parent row + Phase Parent Mode block (most comprehensive single source)
- `CLAUDE.md` §1 Session Start & Recovery — phase-parent branch in fallback ladder
- `.opencode/skill/system-spec-kit/SKILL.md` Phase Parent Mode paragraph (line ~370)
- `.opencode/skill/system-spec-kit/templates/phase_parent/spec.md` content-discipline comment block (lines 14–23)
- `.opencode/command/spec_kit/resume.md` step 3b (pointer-first redirect logic)
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md` (already updated for phase-parent redirect)
- `.opencode/skill/system-spec-kit/scripts/rules/check-phase-parent-content.sh` (forbidden-token list + code-fence/HTML-comment skip)
- `.opencode/skill/system-spec-kit/scripts/lib/validator-registry.json` (PHASE_PARENT_CONTENT rule entry)

### Edit Scope Per File

```
CRITICAL (5 files)
├── references/structure/phase_definitions.md      → rewrite parent structure block + add lean-trio paragraph
├── references/memory/save_workflow.md             → add Phase Parent Save Routing sub-section + update Output Location
├── references/validation/validation_rules.md      → add PHASE_PARENT_CONTENT rule entry + Phase Parent row in FILE_EXISTS matrix
├── README.md (top-level)                          → 4 surgical edits: level matrix, structure diagram, phase decomp, validation rules
└── templates/README.md                            → 2 STRUCTURE rows + PHASE SYSTEM sentence

MEDIUM (5 files)
├── references/validation/template_compliance_contract.md  → §8 phase-parent exemption clarification
├── references/intake-contract.md                          → §1 phase-parent note + §14 reference row
├── references/workflows/quick_reference.md                → Phase-Parent Resume Ladder block after line 507
├── assets/template_mapping.md                             → Phase Parent block in Required Templates section
└── command/spec_kit/{plan,complete}.md                    → :with-phases lean-parent statement

LOW (2 files)
├── references/structure/folder_routing.md  → explicit-target-priority footnote
└── references/config/hook_system.md        → SessionStart phase-parent redirect mention
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup — Critical Contradictions

> **Sub-phase A.** Five CRITICAL fixes that contradict shipped behavior. Highest user-impact; ship first.

- [ ] T001 Patch `references/structure/phase_definitions.md` parent structure block (lines 86–109): replace with lean trio + add detection-rule paragraph
- [ ] T002 Patch `references/memory/save_workflow.md` Output Format (lines 254–288): add Phase Parent Save Routing sub-section + update Output Location example
- [ ] T003 Patch `references/validation/validation_rules.md`: add PHASE_PARENT_CONTENT rule row + Phase Parent row in FILE_EXISTS matrix + new rule section after FILE_EXISTS
- [ ] T004 Patch top-level `README.md`: level matrix Phase Parent row + Spec Folder Structure note + Phase Decomposition lean-template mention + validation-rules block PHASE_PARENT_CONTENT mention
- [ ] T005 Patch `templates/README.md`: STRUCTURE table phase_parent/ + context-index.md rows + §5 PHASE SYSTEM lean-parent sentence

### Phase 2: Implementation — Medium Clarity Gaps

> **Sub-phase B.** Five MEDIUM clarifications. True-but-incomplete coverage; ship next.

- [ ] T006 [P] Patch `references/validation/template_compliance_contract.md` §8 PHASE FOLDER ADDENDA (lines 233–240): clarify phase-parent exemption from level contracts
- [ ] T007 [P] Patch `references/intake-contract.md` §1 + §14: phase-parent note + REFERENCE table row pointing to `templates/phase_parent/spec.md`
- [ ] T008 [P] Patch `references/workflows/quick_reference.md` after line 507: add Phase-Parent Resume Ladder block with pointer-first behavior
- [ ] T009 [P] Patch `assets/template_mapping.md` Required Templates by Level (around lines 99–104): add Phase Parent block
- [ ] T010 Patch `.opencode/command/spec_kit/plan.md` `:with-phases` workflow: name `templates/phase_parent/spec.md` as the parent template
- [ ] T011 Patch `.opencode/command/spec_kit/complete.md` `:with-phases` workflow: same lean-parent statement

### Phase 3: Verification — Low Clarifications + Final Sweep

> **Sub-phase C.** Two LOW touch-ups + verification.

- [ ] T012 [P] Patch `references/structure/folder_routing.md`: explicit-target-priority footnote
- [ ] T013 [P] Patch `references/config/hook_system.md` SessionStart hook description: add phase-parent redirect mention near line 44
- [ ] T014 Run grep sweeps for stale phrases (SC-001 + SC-002): `grep -nrE "├── plan\.md.*coordination|memory/.*Parent-level context" .opencode/skill/system-spec-kit/references/` should return zero matches
- [ ] T015 Run `validate.sh --strict` against `003-references-and-readme-sync/` — confirm L2 contract passes modulo SPEC_DOC_INTEGRITY forward-reference noise
- [ ] T016 Run `validate.sh --strict` regression on `026-graph-and-context-optimization/` — confirm parent error rules unchanged from current baseline
- [ ] T017 `/memory:save` against this packet — confirm `010/graph-metadata.json` `derived.last_active_child_id` updates to `.../003-references-and-readme-sync` (dogfood the pointer mechanism)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Stale-phrase grep | Specific phrases known to be wrong (e.g. "├── plan.md ... coordination", "memory/ ... Parent-level context") | grep |
| Cross-doc consistency grep | Confirm "Phase Parent Mode" / "lean trio" / "last_active_child_id" / "PHASE_PARENT_CONTENT" all appear in expected files | grep -lE |
| Strict validation on new packet | Verify L2 contract on 003 itself | `validate.sh --strict` |
| Regression on 026 | No new error rules at parent level | `validate.sh --strict --json` + diff |
| Pointer dogfood | Save against 003 → 010 parent's pointer updates | `node generate-context.js + python json check` |

### Acceptance Scenarios

**Given** I open `references/structure/phase_definitions.md` after the edit, **when** I scroll to the Parent Folder Structure block, **then** I see only `spec.md`, `description.json`, `graph-metadata.json` at parent level — no `plan.md`, `tasks.md`, `decision-record.md`, or `memory/`.

**Given** I open `references/memory/save_workflow.md` after the edit, **when** I read the Output Format section, **then** I find a "Phase Parent Save Routing" sub-section explaining the pointer-write behavior at parent and bubble-up at child.

**Given** I open `references/validation/validation_rules.md` after the edit, **when** I search for PHASE_PARENT_CONTENT, **then** the rule has a row in the summary table AND a dedicated section describing detection, forbidden tokens, code-fence/HTML-comment awareness, and remediation.

**Given** I open `templates/README.md` after the edit, **when** I read the §2 STRUCTURE table, **then** I see `phase_parent/` and `context-index.md` rows alongside `level_1/` ... `level_3+/`.

**Given** I run `grep -lE "Phase Parent Mode|lean trio|last_active_child_id|PHASE_PARENT_CONTENT"` against the 10 P0+P1 target files, **then** all 10 files are in the result.

**Given** I run `/memory:save` against `003-references-and-readme-sync`, **when** I read `010/graph-metadata.json` afterwards, **then** `derived.last_active_child_id` is `system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/014-phase-parent-documentation/003-references-and-readme-sync` and `derived.last_active_at` is fresh.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 + 002 + validator follow-on shipped | Internal | Green | All shipped in 010's predecessors |
| Canonical wording in CLAUDE.md / AGENTS.md / SKILL.md / resume.md / skill-advisor-hook.md | Internal | Green | Stable; mirror don't re-coin |
| `validator-registry.json` PHASE_PARENT_CONTENT entry | Internal | Green | Already shipped |
| `is_phase_parent` / `isPhaseParent` detection | Internal | Green | Already shipped |
| `validate.sh --strict` runtime | Internal | Green | Already operational; phase-parent branches in 5 rules |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A doc edit accidentally introduces a contradiction with a different doc, OR the strict validation regresses on 026.
- **Procedure**: Each edit is independent and idempotent. Revert any single offending edit via `git checkout -- <file>` without disturbing the others. The doc-only nature of this packet means partial completion still leaves docs in a not-worse state than current.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Critical) ──► Phase 2 (Medium) ──► Phase 3 (Low + Verify)
                                            ▲
                       (parallelizable [P]) ┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None (canonical sources already shipped) | Phase 2 (mediums often cite new content from Phase 1 fixes) |
| Phase 2 | Phase 1 (so cross-references are accurate) | Phase 3 |
| Phase 3 | Phase 2 (verification needs everything else done) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 — Critical (5 files) | Low–Medium | 1–2 hours (top-level README is the largest) |
| Phase 2 — Medium (5 files) | Low | 1 hour |
| Phase 3 — Low + Verify (4 tasks) | Low | 30–60 min |
| **Total** | | **2.5–4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Capture current 026 regression baseline (parent-level error rules) before any edits
- [ ] Confirm canonical sources (CLAUDE.md, AGENTS.md, SKILL.md, etc.) are in their post-002 shipped state

### Rollback Procedure
1. Identify the offending file(s) via `validate.sh --strict --json` diff or grep contradiction.
2. `git checkout -- <file>` to revert that specific file.
3. Re-run validation to confirm regression cleared.
4. Re-author the patch with corrected wording.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A (doc edits are pure text).
<!-- /ANCHOR:enhanced-rollback -->
