---
title: "Tasks: Skill and Command README Rewrite [skilled-agent-orchestration/033-skill-command-readme-rewrite/tasks]"
description: "Task ledger for the batch README rewrite packet."
trigger_phrases:
  - "tasks"
  - "readme"
  - "033"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/033-skill-command-readme-rewrite"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: Skill and Command README Rewrite

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

- [x] T001 Lock the standards baseline from `.opencode/skill/sk-doc/references/specific/readme_creation.md`, `.opencode/skill/sk-doc/assets/documentation/readme_template.md`, and `.opencode/skill/sk-doc/references/global/hvr_rules.md`
- [x] T002 Group the skill README rewrite into five delivery batches
- [x] T003 Identify the command README surfaces under `.opencode/command/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Skill README Batches
- [x] T004 Rewrite the CLI skill READMEs under `.opencode/skill/cli-*/README.md`
- [x] T005 Rewrite the MCP skill READMEs under `.opencode/skill/mcp-*/README.md`
- [x] T006 Rewrite the sk-code and sk-doc READMEs under `.opencode/skill/sk-*/README.md`
- [x] T007 Rewrite the remaining skill READMEs under `.opencode/skill/README.md`, `.opencode/skill/skill-advisor/README.md`, and related skill folders

### Command and Follow-Up Work
- [x] T008 Update the command README surfaces under `.opencode/command/README.txt`, `.opencode/command/create/README.txt`, `.opencode/command/memory/README.txt`, and `.opencode/command/spec_kit/README.txt`
- [x] T009 Apply batch review fixes for links, TOC formatting, HVR wording, and anchor or divider cleanup
- [x] T010 Record the root README follow-up additions from `.opencode/skill/system-spec-kit/mcp_server/README.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Re-run the verbose spec validator on this packet
- [ ] T012 Confirm the packet references current skill and command repo paths
- [ ] T013 Record remaining non-blocking warnings without reopening the rewrite scope
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Packet docs are template-safe and anchor-complete
- [ ] No hard validation errors remain for this folder
- [ ] Rewrite history is preserved without stale markdown references
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---
