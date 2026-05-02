---
title: "Tasks: Non-System Playbook Prompt Modernization"
description: "Task Format: T### P? Description (file path)."
trigger_phrases:
  - "non system playbook prompts"
  - "skilled agent orchestration"
  - "non system playbook prompt modernization"
  - "non system playbook prompts tasks"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/044-non-system-playbook-prompts"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled frontmatter (repo-wide gap fill)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
---
title: "Tasks: Non-System Playbook Prompt Modernization [skilled-agent-orchestration/044-non-system-playbook-prompts/tasks]"
description: "Completed task closeout for the 126-file non-system manual testing playbook prompt modernization rewrite."
trigger_phrases:
  - "playbook prompt modernization tasks"
  - "non-system playbook rewrite tasks"
  - "manual testing playbook rewrite checklist"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/044-non-system-playbook-prompts"
    last_updated_at: "2026-04-12T23:59:00Z"
    last_updated_by: "codex"
    recent_action: "Marked the rewrite and verification tasks complete after implementation closeout"
    next_safe_action: "Archive the packet or use it as the implementation record"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:044-tasks-non-system-playbook-prompts"
      session_id: "044-tasks-non-system-playbook-prompts"
      parent_session_id: "044-non-system-playbook-prompts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Non-System Playbook Prompt Modernization

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Inventory all 126 scoped markdown files and record per-target counts (`.opencode/skill/*/manual_testing_playbook/`, `.opencode/skill/sk-doc/assets/documentation/testing_playbook/`) (`total_markdown_files=126`)
- [x] T002 Extract the shared modernization contract from the current `sk-doc` template assets plus the richer `sk-deep-research` and `sk-deep-review` playbooks (`.opencode/skill/sk-doc/assets/documentation/testing_playbook/`) (`shared rewrite contract applied across all five targets`)
- [x] T003 Define the no-drift guardrails for IDs, filenames, category folders, command sequences, and destructive-scenario warnings (`spec.md`, `plan.md`) (`scoped diff and representative scenario reads stayed inside the documented guardrails`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Update the root template contract in `.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_template.md` (`template rewrite shipped in the scoped 124-file diff`)
- [x] T005 Update the per-scenario template contract in `.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_snippet_template.md` (`snippet template rewrite shipped in the scoped 124-file diff`)
- [x] T006 Rewrite root and scenario prompt wording for `mcp-coco-index` without changing scenario inventory (`.opencode/skill/mcp-coco-index/manual_testing_playbook/`) (`root playbook validated successfully after rewrite`)
- [x] T007 Rewrite root and scenario prompt wording for `sk-improve-agent` without changing scenario inventory (`.opencode/skill/sk-improve-agent/manual_testing_playbook/`) (`root index synchronized to include runtime-truth rows 07-008..07-010; RT-027 rewritten to fresh-session continuation guidance`)
- [x] T008 [P] Harmonize existing rich-style wording for `sk-deep-research` (`.opencode/skill/sk-deep-research/manual_testing_playbook/`) (`root playbook validated successfully after rewrite`)
- [x] T009 [P] Harmonize existing rich-style wording for `sk-deep-review` (`.opencode/skill/sk-deep-review/manual_testing_playbook/`) (`root playbook validated successfully after rewrite`)
- [x] T010 Reconcile target root playbook files with the final template language so package-level guidance and scenario files match (root playbook file in each of the four skill targets) (`validate_document.py` passed for all four rewritten root playbooks)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Recount files and confirm 24 + 32 + 35 + 33 + 2 = 126 after the rewrite (`target inventory sweep`) (`total_markdown_files=126`)
- [x] T012 Run prompt-contract sweeps to confirm realistic request, orchestrator prompt, expected process, expected signals, evidence, and user-facing outcome language are present where intended (`rg` + manual review) (`orchestrator_prompt_label=0`, `deprecated_improve_agent_command=0`, `resume_flag=0`, `resume_mode=0`)
- [x] T013 Spot-check destructive, recovery, and orchestration-heavy scenarios in each target and record findings (`representative scenario files`) (`CCC-005`, `RT-027`, `DR-014`, and `DRV-022` reflect the updated contract without topology drift`)
- [x] T014 Review final diff to confirm no non-spec or out-of-scope documentation surfaces were modified (`git diff --stat`, scoped path review) (`124 files changed, 488 insertions(+), 320 deletions(-)` across the requested targets plus this packet)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] File-count parity, prompt-contract parity, and scoped-diff review all pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---
