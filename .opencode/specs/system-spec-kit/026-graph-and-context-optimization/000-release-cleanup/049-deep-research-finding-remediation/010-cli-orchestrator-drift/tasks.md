---
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
title: "Tasks: 010 CLI Orchestrator Skill Doc Drift [template:level_2/tasks.md]"
description: "Task list for closing F-007-B2-01..06. Six surgical doc edits + validate + commit + push."
trigger_phrases:
  - "F-007-B2 tasks"
  - "010 cli orchestrator drift tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/010-cli-orchestrator-drift"
    last_updated_at: "2026-05-01T07:38:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Tasks authored; six edits already applied"
    next_safe_action: "validate, commit, push"
    blockers: []
    key_files:
      - ".opencode/skill/cli-opencode/SKILL.md"
      - ".opencode/skill/cli-opencode/references/agent_delegation.md"
      - ".opencode/skill/cli-copilot/SKILL.md"
      - ".opencode/skill/cli-codex/assets/prompt_templates.md"
      - ".opencode/skill/cli-claude-code/assets/prompt_templates.md"
      - ".opencode/skill/cli-gemini/assets/prompt_templates.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-010-cli-drift"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
# Tasks: 010 CLI Orchestrator Skill Doc Drift

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

`T### [P?] Description (file path)` — `[P?]` is the priority tag from packet 046 (P1 or P2). Status uses `[x]` for done, `[ ]` for pending. Each finding ID appears in the description for traceability.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P1] Re-read packet 046 §6 (CLI orchestrator skills) to confirm finding IDs and cited line ranges (`.opencode/specs/.../046-system-deep-research-bugs-and-improvements/research/research.md`)
- [x] T002 [P1] Verify each cited file:line still matches research.md claim before editing (`*` six target files)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P1] Edit cli-opencode/SKILL.md subagent table to clarify single-hop dispatch (F-007-B2-01) (`.opencode/skill/cli-opencode/SKILL.md`)
- [x] T004 [P1] Replace deep-loop direct-dispatch rows with command-only routing (F-007-B2-02) (`.opencode/skill/cli-opencode/references/agent_delegation.md`)
- [x] T005 [P1] Reconcile effort-flag prose with example, document precedence (F-007-B2-03) (`.opencode/skill/cli-copilot/SKILL.md`)
- [x] T006 [P2] Pin model+effort, fix `--full-auto` description, mark service_tier opt-in (F-007-B2-04) (`.opencode/skill/cli-codex/assets/prompt_templates.md`)
- [x] T007 [P2] Add `--model claude-sonnet-4-6` to single-file template (F-007-B2-05) (`.opencode/skill/cli-claude-code/assets/prompt_templates.md`)
- [x] T008 [P2] Split safe vs `--yolo`-approved write templates (F-007-B2-06) (`.opencode/skill/cli-gemini/assets/prompt_templates.md`)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 [P1] Run `validate.sh --strict` on this packet — must exit 0
- [ ] T010 [P1] Confirm git diff shows only the six skill files plus this packet's spec docs
- [ ] T011 [P1] Commit + push to origin main with finding IDs in message body
- [ ] T012 [P2] Wave master runs `npm run stress` after Wave 1 closes — confirms no regression (deferred to wave master)
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- All six findings marked `[x]` in the Findings closed table of `checklist.md` and `implementation-summary.md`
- `validate.sh --strict` exit 0 on this packet
- Commit pushed to origin main with finding IDs in body
- No product code touched; no `mcp_server/**` files modified
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Source of truth: `../046-system-deep-research-bugs-and-improvements/research/research.md` §6
- Parent packet: `../spec.md` (049 phase parent — manifest)
- Worked-pilot pattern: this packet itself; future sub-phases use this Level 2 doc shape
<!-- /ANCHOR:cross-refs -->
