---
title: "Tasks: spec-kit UX adoptions from SPAR-Kit research"
description: "Task list for the 5-phase Level 2 implementation packet 058-spec-kit-ux-adoptions plus the 3 reject-rationale records."
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
trigger_phrases:
  - "058 spec kit ux tasks"
  - "spec kit ux adoptions tasks"
  - "058 tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/058-spec-kit-ux-adoptions"
    last_updated_at: "2026-05-01T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Tasks authored across 5 sub-phases"
    next_safe_action: "Begin T001 audit current consolidated prompts"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: spec-kit UX adoptions from SPAR-Kit research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

**Sub-phase grouping**: Each line tag (`[SP1]` through `[SP6]`) maps to one approved adoption. The three top-level Setup / Implementation / Verification phases are the canonical Level 2 grouping; sub-phases are the work-unit decomposition.

| Sub-phase | Adoption | Source finding |
|-----------|----------|----------------|
| SP1 | Gate copy + question budget | F-iter009-001 |
| SP2 | Phase boundary copy pass | F-iter009-002 |
| SP3 | Four-axis command taxonomy doc | F-iter009-003 |
| SP4 | Template inventory + source-layer manifest | F-iter009-006 |
| SP5 | Persona evaluation fixtures | F-iter009-008 |
| SP6 | Reject-rationale records (067, 068, 069) | F-iter009-010, F-iter009-011, F-iter009-012 |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [SP1] Audit current consolidated-prompt copy across 6 spec_kit commands
- [ ] T002 [SP1] Draft Required-vs-Optional split copy template (max 3 required + 4 optional)
- [ ] T003 [SP2] Map each existing spec_kit command to one of Specify / Plan / Act / Retain
- [ ] T004 [SP4] Run strict-validation baseline sample on 50 random spec folders, record pass / fail
- [ ] T005 [SP4] [B-on-T004] Surface drift findings before manifest authoring
- [ ] T006 [SP4] List all files under `system-spec-kit/templates/` recursively (expect ~99)
- [ ] T007 [SP5] Confirm directory location: `system-spec-kit/references/personas/` or alternative
- [ ] T008 [SP5] Read `057-cmd-spec-kit-ux-upgrade/external/Research/Personas/Personas.md` for source persona definitions
- [ ] T009 [P] [SP1] Decide whether YAML asset comments need a wholesale copy refresh or single-block edit
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### SP1 — Gate copy + question budget

- [ ] T010 [SP1] Apply Required-vs-Optional split to `command/spec_kit/plan.md`
- [ ] T011 [P] [SP1] Apply split to `command/spec_kit/implement.md`
- [ ] T012 [P] [SP1] Apply split to `command/spec_kit/deep-research.md`
- [ ] T013 [P] [SP1] Apply split to `command/spec_kit/deep-review.md`
- [ ] T014 [P] [SP1] Apply split to `command/spec_kit/resume.md`
- [ ] T015 [P] [SP1] Apply split to `command/spec_kit/complete.md`
- [ ] T016 [SP1] Mirror split copy in matching `command/spec_kit/assets/*.yaml`

### SP2 — Phase boundary copy pass

- [ ] T017 [SP2] Add Specify / Plan / Act / Retain headers in `command/spec_kit/README.txt` above command list
- [ ] T018 [P] [SP2] Add same headers to `command/README.md` if file exists
- [ ] T019 [P] [SP2] Add Specify / Plan / Act / Retain command-reference subsection to `AGENTS.md`

### SP3 — Four-axis command taxonomy doc

- [ ] T020 [SP3] Create new file `command/spec_kit/references/command-taxonomy.md` with frontmatter
- [ ] T021 [SP3] Document execution mode axis (`:auto`, `:confirm`, doctor `:apply` variants)
- [ ] T022 [SP3] Document feature flag axis (`:with-phases`, `:with-research`, `--intake-only`, `--scope`, `--dry-run`)
- [ ] T023 [SP3] Document lifecycle intent axis (plan, implement, complete, resume, deep-research, deep-review, create, doctor, improve, memory)
- [ ] T024 [SP3] Document executor / provenance axis (native, cli-codex, cli-copilot, cli-gemini, cli-claude-code; reasoning effort, service tier, timeout)
- [ ] T025 [SP3] Build a commands-by-axes compatibility matrix table
- [ ] T026 [P] [SP3] Cross-link from `command/spec_kit/README.txt` and `system-spec-kit/SKILL.md`

### SP4 — Template inventory + source-layer manifest

- [ ] T027 [SP4] Classify each template file into source / generated / validation-critical / example / optional
- [ ] T028 [SP4] Write `system-spec-kit/templates/INVENTORY.md` with classification table
- [ ] T029 [SP4] Author `system-spec-kit/templates/source-manifest.yaml` listing only source-layer files
- [ ] T030 [SP4] Cross-check classifications against `validate.sh` consumers and `is_phase_parent()` callers
- [ ] T031 [SP4] Cross-check classifications against `compose.sh` outputs
- [ ] T032 [SP4] Mark ambiguous files as `unknown` and surface for follow-up

### SP5 — Persona evaluation fixtures

- [ ] T033 [SP5] Author `personas/README.md` with fixture model and evaluation-only boundary
- [ ] T034 [P] [SP5] Author `personas/vera.md` (Vibe Vera)
- [ ] T035 [P] [SP5] Author `personas/pete.md` (Promptwright Pete)
- [ ] T036 [P] [SP5] Author `personas/tess.md` (Terminal Tess)
- [ ] T037 [P] [SP5] Author `personas/maya.md` (Manager Maya)
- [ ] T038 [P] [SP5] Author `personas/max.md` (Maintainer Max)
- [ ] T039 [P] [SP5] Author `personas/cass.md` (Consultant Cass)

### SP6 — Reject-rationale records (P1)

- [ ] T040 [P] [SP6] Author `system-spec-kit/references/decisions/067-generated-block-budget.md`
- [ ] T041 [P] [SP6] Author `system-spec-kit/references/decisions/068-runtime-persona-boundary.md`
- [ ] T042 [P] [SP6] Author `system-spec-kit/references/decisions/069-template-compression-boundary.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T043 Verify Gate-3 answer keys (A/B/C/D/E) preserved verbatim across all 6 commands
- [ ] T044 Smoke test gate-3 classifier still parses sample answers correctly
- [ ] T045 Verify command list count unchanged after SP2 header additions
- [ ] T046 Verify all SP3 cross-links resolve
- [ ] T047 Verify INVENTORY.md and source-manifest.yaml parse cleanly
- [ ] T048 Verify all 7 persona fixture files load as plain markdown without YAML errors
- [ ] T049 Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/058-spec-kit-ux-adoptions --strict`
- [ ] T050 Confirm exit code 0 or 1 (warnings ok)
- [ ] T051 Author `implementation-summary.md` with per-phase outcomes and link to research source
- [ ] T052 Run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` to refresh continuity
- [ ] T053 Verify checklist.md items marked with evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` or `[B]` with documented reason
- [ ] No `[B]` blocked tasks remaining at completion
- [ ] `validate.sh --strict` exits 0 or 1
- [ ] `implementation-summary.md` authored
- [ ] Continuity refreshed via `generate-context.js`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research source**: `../057-cmd-spec-kit-ux-upgrade/research/research.md`
- **Iteration evidence**: `../057-cmd-spec-kit-ux-upgrade/research/iterations/iteration-009.md` and `iteration-010.md`
<!-- /ANCHOR:cross-refs -->
