---
title: "Tasks: CLI Testing Playbooks"
description: "Task list for spec 048: scaffold spec docs, dispatch /create:testing-playbook in two waves, validate, close out."
trigger_phrases:
  - "048 tasks"
  - "cli playbook tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/048-cli-testing-playbooks"
    last_updated_at: "2026-04-26T00:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Drafted task list for two-wave delivery"
    next_safe_action: "Mark T001-T006 done, begin T007"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000048"
      session_id: "048-tasks-init"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---

# Tasks: CLI Testing Playbooks

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

---

## Phase 1: Setup

- [x] T001 Create `spec.md` (`048-cli-testing-playbooks/spec.md`)
- [x] T002 Create `plan.md` (`048-cli-testing-playbooks/plan.md`)
- [x] T003 Create `tasks.md` (this file)
- [x] T004 Create `checklist.md` (`048-cli-testing-playbooks/checklist.md`)
- [x] T005 Create `decision-record.md` (`048-cli-testing-playbooks/decision-record.md`)
- [x] T006 Create `implementation-summary.md` placeholder (`048-cli-testing-playbooks/implementation-summary.md`)
- [ ] T007 Run `generate-context.js` to create `description.json` + `graph-metadata.json` for the spec folder

---

## Phase 2: Wave 1 (parallel @write dispatch × 3)

- [ ] T010 [P] Dispatch `/create:testing-playbook cli-gemini create :auto` via @write (output: `.opencode/skill/cli-gemini/manual_testing_playbook/`)
- [ ] T011 [P] Dispatch `/create:testing-playbook cli-claude-code create :auto` via @write (output: `.opencode/skill/cli-claude-code/manual_testing_playbook/`)
- [ ] T012 [P] Dispatch `/create:testing-playbook cli-codex create :auto` via @write (output: `.opencode/skill/cli-codex/manual_testing_playbook/`)

### Wave 1 Validation

- [ ] T015 Run `validate_document.py` on cli-gemini, cli-claude-code, cli-codex root playbooks
- [ ] T016 Link integrity check on Wave 1 playbooks (every per-feature link resolves)
- [ ] T017 Feature-ID count check on Wave 1 playbooks (root index count == per-feature file count)
- [ ] T018 Forbidden sidecar scan on Wave 1 playbooks (no `review_protocol.md`, `subagent_utilization_ledger.md`, `snippets/`)
- [ ] T019 Cross-CLI invariant manual review for Wave 1 (categories 01/06/07 numbered identically)
- [ ] T020 Spot-check 2 per-feature files per Wave 1 CLI (6 reads)

---

## Phase 2: Wave 2 (parallel @write dispatch × 2)

- [ ] T030 [P] Dispatch `/create:testing-playbook cli-copilot create :auto` via @write (output: `.opencode/skill/cli-copilot/manual_testing_playbook/`)
- [ ] T031 [P] Dispatch `/create:testing-playbook cli-opencode create :auto` via @write (output: `.opencode/skill/cli-opencode/manual_testing_playbook/`)

### Wave 2 Validation

- [ ] T035 Run `validate_document.py` on cli-copilot, cli-opencode root playbooks
- [ ] T036 Link integrity check on Wave 2 playbooks
- [ ] T037 Feature-ID count check on Wave 2 playbooks
- [ ] T038 Forbidden sidecar scan on Wave 2 playbooks
- [ ] T039 Cross-CLI invariant manual review for Wave 2 (categories 01/06/07 vs Wave 1 baselines)
- [ ] T040 Spot-check 2 per-feature files per Wave 2 CLI (4 reads)

---

## Phase 3: Verification & Close-out

- [ ] T050 Cross-playbook taxonomy diff: confirm categories 01/06/07 align across all 5 playbooks
- [ ] T051 Run spec-folder validation `--strict`
- [ ] T052 Fill `implementation-summary.md` with per-CLI counts, validator exit codes, and links to all 5 playbook roots
- [ ] T053 Run `generate-context.js` (full save) to refresh `description.json` + `graph-metadata.json` and index the spec
- [ ] T054 Mark all P0 + P1 checklist items in `checklist.md`
- [ ] T055 Final review of `implementation-summary.md` post-save quality output

---

## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All P0 checklist items complete with evidence
- [ ] `implementation-summary.md` non-placeholder
- [ ] `description.json` + `graph-metadata.json` current

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
