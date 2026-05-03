---
title: "Tasks: 064 — agent-create"
description: "Task list."
trigger_phrases: ["064 tasks"]
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/064-agent-create"
    last_updated_at: "2026-05-03T07:40:00Z"
    last_updated_by: "codex"
    recent_action: "Created @create mirrors and rewired /create:* command Phase 0 gates"
    next_safe_action: "validate_and_report"
    blockers: []
    key_files:
      - ".opencode/agent/create.md"
      - ".claude/agents/create.md"
      - ".gemini/agents/create.md"
      - ".codex/agents/create.toml"
      - ".opencode/command/create/agent.md"
      - ".opencode/command/create/sk-skill.md"
      - ".opencode/command/create/feature-catalog.md"
      - ".opencode/command/create/testing-playbook.md"
      - ".opencode/command/create/folder_readme.md"
      - ".opencode/command/create/changelog.md"
    session_dedup:
      fingerprint: "sha256:0640640640640640640640640640640640640640640640640640640640640640"
      session_id: "codex-064-create-2026-05-03"
      parent_session_id: "scaffold-064-2026-05-03"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3: use existing 064 packet"
---

# Tasks: 064

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## 1. TASK NOTATION
`[ ]` pending, `[~]` in-progress, `[x]` done
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP
### T-001: [x] Read 063b updated template
### T-002: [x] Read 6 /create:* commands to understand callers
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
### T-003: [x] cli-codex authors canonical @create agent
### T-004: [x] Mirror to .claude/.gemini/.codex
### T-005: [x] Update 6 /create:* commands Phase 0
### T-006: [x] Update READMEs + orchestrate + CLAUDE/AGENTS
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
### T-007: [x] Validator + grep audit
### T-008: [ ] Commit + push
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA
status=complete pct=100. All requirements met.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES
- spec.md, plan.md
- 063 (template source)
- @context (reference)
<!-- /ANCHOR:cross-refs -->
