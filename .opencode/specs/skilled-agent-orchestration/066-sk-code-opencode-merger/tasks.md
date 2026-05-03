---
title: "Tasks: sk-code-opencode-merger"
description: "Future implementation task list for the plan-only sk-code-opencode merger packet."
trigger_phrases:
  - "sk-code-opencode merger tasks"
  - "single sk-code tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/066-sk-code-opencode-merger"
    last_updated_at: "2026-05-03T15:00:00Z"
    last_updated_by: "multi-ai-council"
    recent_action: "Created future implementation tasks without executing them"
    next_safe_action: "Wait for user approval before Phase 1 implementation"
    blockers:
      - "DO NOT IMPLEMENT"
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/resource-map.md"
    session_dedup:
      fingerprint: "sha256:0660660660660660660660660660660660660660660660660660660660660662"
      session_id: "066-sk-code-opencode-merger-plan"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions:
      - "This task list is future work only."
      - "All 4 open questions resolved in deep-analysis session."
      - "26 implementation tasks defined (T006-T026), 8 verification tasks (T027-T034)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-code-opencode-merger

<!-- SPECKIT_LEVEL: 3 -->

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create Level 3 spec folder (`.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger`)
- [x] T002 Analyze `sk-code` and `sk-code-opencode` file trees (`.opencode/skill/sk-code`, `.opencode/skill/sk-code-opencode`)
- [x] T003 [P] Run exact reference searches for `sk-code-opencode`, `sk-code-*`, `GO`, and `NEXTJS` references
- [x] T004 [P] Create detailed resource map (`resource-map.md`)
- [ ] T005 [B] Get user approval before implementation
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Rewrite `sk-code/SKILL.md` with two-axis detection (Code Surface → Intent Classification) (`.opencode/skill/sk-code/SKILL.md`)
- [ ] T007 Rename `stack_detection.md` → `code_surface_detection.md`, add OPENCODE detection + language sub-detection (`.opencode/skill/sk-code/references/router/code_surface_detection.md`)
- [ ] T008 Move OpenCode references into `sk-code/references/opencode/` (`.opencode/skill/sk-code/references/opencode/{shared,javascript,typescript,python,shell,config}/**`)
- [ ] T009 Move OpenCode checklists into `sk-code/assets/opencode/checklists/` (`.opencode/skill/sk-code/assets/opencode/checklists/**`)
- [ ] T010 Move verifier scripts into `sk-code/scripts/` (`.opencode/skill/sk-code/scripts/verify_alignment_drift.py`, `test_verify_alignment_drift.py`)
- [ ] T011 Add OPENCODE entries to RESOURCE_MAPS and SURFACE_VERIFICATION_COMMANDS in SKILL.md
- [ ] T012 Delete historical changelogs (`.opencode/skill/sk-code-opencode/changelog/v1.*.md`, 13 files)
- [ ] T013 Delete Go branch files (`.opencode/skill/sk-code/references/go/**`, `.opencode/skill/sk-code/assets/go/**`, ~16 files)
- [ ] T014 Delete React/NextJS branch files (`.opencode/skill/sk-code/references/nextjs/**`, `.opencode/skill/sk-code/assets/nextjs/**`, ~21 files)
- [ ] T015 Delete `cross_stack_pairing.md` (`.opencode/skill/sk-code/references/router/cross_stack_pairing.md`)
- [ ] T016 Rewrite router docs for two-axis model (`.opencode/skill/sk-code/references/router/{resource_loading,intent_classification,phase_lifecycle}.md`)
- [ ] T017 Rewrite runtime agent supported-stack and overlay text (`.opencode/agent/**`, `.claude/agents/**`, `.codex/agents/**`, `.gemini/agents/**`)
- [ ] T018 Rewrite `spec_kit` command YAML overlay text (`.opencode/command/spec_kit/assets/*.yaml`)
- [ ] T019 Rewrite `sk-code-review` contract to single-skill model (`.opencode/skill/sk-code-review/**`)
- [ ] T020 Rewrite CLI skill dispatch guidance (`.opencode/skill/cli-*/SKILL.md`)
- [ ] T021 Update skill advisor scorer lanes and fixtures (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/**`)
- [ ] T022 Update hook/advisor tests (`.opencode/skill/system-spec-kit/mcp_server/tests/**`, 28 files)
- [ ] T023 Update repository docs and install guides (`README.md`, `AGENTS.md`, `.opencode/install_guides/**`, `.opencode/skill/README.md`)
- [ ] T024 Regenerate telemetry JSONL (`.opencode/skill/.smart-router-telemetry/compliance.jsonl`, `smart-router-measurement-results.jsonl`)
- [ ] T025 Refresh metadata and generated skill graph (`description.json`, `graph-metadata.json`, `skill-graph.json`)
- [ ] T026 Delete `sk-code-opencode/` directory (final step, after all references verified clean)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T027 Run exact live reference search for `sk-code-opencode` (should be clean or only historical matches)
- [ ] T028 Run exact live reference search for `sk-code-*` overlay language
- [ ] T029 Run exact `sk-code` route search for removed `GO` and `NEXTJS` support claims
- [ ] T030 Run moved verifier tests (`test_verify_alignment_drift.py`)
- [ ] T031 Run targeted skill advisor and hook vitest suites
- [ ] T032 Run spec validation for this packet
- [ ] T033 Document any remaining historical references as intentional
- [ ] T034 Verify two-axis detection: Webflow code routes to webflow surface, .opencode/ code routes to opencode surface
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All implementation tasks marked `[x]` after user approval.
- [ ] No `[B]` blocked tasks remaining.
- [ ] Exact live references to `sk-code-opencode` removed or classified historical.
- [ ] Go and React/NextJS placeholder route references removed from `sk-code`.
- [ ] Two-axis detection operational: Webflow frontend routes to webflow surface, .opencode/ code routes to opencode surface.
- [ ] Language sub-detection within OPENCODE correctly selects JS/TS/Python/Shell/Config standards.
- [ ] Historical changelogs deleted (13 files).
- [ ] Telemetry JSONL regenerated.
- [ ] Advisor and runtime agent tests pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Resource Map**: See `resource-map.md`
- **Decision Record**: See `decision-record.md`
- **Verification Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
