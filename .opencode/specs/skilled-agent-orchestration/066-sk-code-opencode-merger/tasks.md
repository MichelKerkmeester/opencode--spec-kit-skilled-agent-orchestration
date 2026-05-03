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
    last_updated_at: "2026-05-03T11:04:06Z"
    last_updated_by: "codex"
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
    completion_pct: 30
    open_questions: []
    answered_questions:
      - "This task list is future work only."
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

- [ ] T006 Add OpenCode system-code route to `sk-code` (`.opencode/skill/sk-code/SKILL.md`)
- [ ] T007 Move or copy OpenCode references into `sk-code` (`.opencode/skill/sk-code/references/opencode/**`)
- [ ] T008 Move or copy OpenCode checklists into `sk-code` (`.opencode/skill/sk-code/assets/opencode/**`)
- [ ] T009 Move verifier scripts into `sk-code` (`.opencode/skill/sk-code/scripts/verify_alignment_drift.py`)
- [ ] T010 Remove Go branch files (`.opencode/skill/sk-code/references/go/**`, `.opencode/skill/sk-code/assets/go/**`)
- [ ] T011 Remove React/NextJS branch files (`.opencode/skill/sk-code/references/nextjs/**`, `.opencode/skill/sk-code/assets/nextjs/**`)
- [ ] T012 Rewrite `sk-code` router docs (`.opencode/skill/sk-code/references/router/*.md`)
- [ ] T013 Rewrite runtime agent supported-stack and overlay text (`.opencode/agent/**`, `.claude/agents/**`, `.codex/agents/**`, `.gemini/agents/**`)
- [ ] T014 Rewrite `spec_kit` command YAML overlay text (`.opencode/command/spec_kit/assets/*.yaml`)
- [ ] T015 Rewrite `sk-code-review` contract (`.opencode/skill/sk-code-review/**`)
- [ ] T016 Rewrite CLI skill dispatch guidance (`.opencode/skill/cli-*/SKILL.md`)
- [ ] T017 Update skill advisor scorer lanes and fixtures (`.opencode/skill/system-spec-kit/mcp_server/skill_advisor/**`)
- [ ] T018 Update hook/advisor tests (`.opencode/skill/system-spec-kit/mcp_server/tests/**`)
- [ ] T019 Update repository docs and install guides (`README.md`, `AGENTS.md`, `.opencode/install_guides/**`, `.opencode/skill/README.md`)
- [ ] T020 Refresh metadata and generated skill graph (`description.json`, `graph-metadata.json`, `skill-graph.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T021 Run exact live reference search for `sk-code-opencode`
- [ ] T022 Run exact live reference search for `sk-code-*` overlay language
- [ ] T023 Run exact `sk-code` route search for removed `GO` and `NEXTJS` support claims
- [ ] T024 Run moved verifier tests
- [ ] T025 Run targeted skill advisor and hook vitest suites
- [ ] T026 Run spec validation for this packet
- [ ] T027 Document any remaining historical references as intentional
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All implementation tasks marked `[x]` after user approval.
- [ ] No `[B]` blocked tasks remaining.
- [ ] Exact live references to `sk-code-opencode` removed or classified historical.
- [ ] Go and React/NextJS placeholder route references removed from `sk-code`.
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
