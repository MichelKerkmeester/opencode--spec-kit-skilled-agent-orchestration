---
title: "Plan: 064 — agent-create"
description: "cli-codex gpt-5.5 high fast authors agent body + mirror sync + command rewiring."
trigger_phrases: ["064 plan"]
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/064-agent-create"
    last_updated_at: "2026-05-03T00:30:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Plan scaffolded"
    next_safe_action: "dispatch_codex"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-064-2026-05-03"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Plan: 064

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

cli-codex gpt-5.5 high fast authors @create agent body. Mirror to 4 runtimes. Update 6 /create:* commands. Sync READMEs + orchestrate + CLAUDE/AGENTS.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- ≤600 lines
- All 4 mirrors aligned
- TOML parse
- Validator 0 errors
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

LEAF agent with caller-restriction convention. Same architecture as @code (orchestrator-only convention) but for /create:* commands instead.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Steps |
|---|---|
| P1 | cli-codex authors canonical .opencode/agent/create.md |
| P2 | Mirror to 3 other runtimes (Bash) |
| P3 | Update 6 /create:* commands' Phase 0 gating |
| P4 | Sync READMEs + orchestrate + CLAUDE/AGENTS |
| P5 | Validator + grep audit |
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Read-only smoke trace of one /create:* command end-to-end.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 063b updated template (read before authoring)
- sk-doc skill (the agent's primary skill dependency)
- 6 /create:* commands (the agent's caller surface)
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git rm` the 4 runtime files; `git checkout HEAD~1 --` for command + README + orchestrate edits.
<!-- /ANCHOR:rollback -->
