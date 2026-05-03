---
title: "Spec: 064 — agent-create"
description: "Create new @create agent (4-runtime mirrors) as dedicated executor for /create:* commands. Uses sk-doc skill + templates. Aligned with updated sk-doc agent template from 063b."
trigger_phrases: ["064 create agent", "create agent"]
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/064-agent-create"
    last_updated_at: "2026-05-03T07:40:00Z"
    last_updated_by: "codex"
    recent_action: "Completed @create implementation and command rewiring"
    next_safe_action: "commit_if_requested"
    blockers: []
    key_files:
      - ".opencode/agent/create.md"
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
      - "Existing 064 packet selected via Gate 3"
---

# Spec: 064 — agent-create

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Level | 1 |
| Priority | P1 |
| Status | Complete |
| Created | 2026-05-03 |
| Branch | `main` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 6 `/create:*` commands (agent, sk-skill, feature-catalog, testing-playbook, folder_readme, changelog) need a dedicated executor agent that's tightly coupled to sk-doc templates + standards. Currently they gate on @general (post-062 cleanup) — too broad. Create `@create` agent: LEAF, caller-restricted to /create:* commands, loads sk-doc on every dispatch, produces deterministic output contracts.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New `@create` agent in 4 runtimes (.opencode/.claude/.gemini/.codex)
- Phase 0 gating update in 6 /create:* commands (@general → @create)
- 4 runtime README.txt updates (add @create entry)
- orchestrate.md (4 mirrors) updated to list @create with caller-restriction note
- CLAUDE.md + AGENTS.md add @create entry

### Out of Scope
- New sk-doc skill changes (skill itself already provides what's needed)
- Changes to other agents
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|---|---|
| REQ-001 | @create.md exists in all 4 runtimes (matching frontmatter, body, name) |
| REQ-002 | .codex/agents/create.toml parses cleanly |
| REQ-003 | Agent body conforms to updated sk-doc agent template (063b) |
| REQ-004 | All 6 /create:* commands gate on @create (Phase 0) |
| REQ-005 | Runtime README.txt files include @create entry |
| REQ-006 | orchestrate.md (4 mirrors) lists @create with caller-restriction note |
| REQ-007 | CLAUDE.md + AGENTS.md include @create entry |
| REQ-008 | Agent stays under 600-line cap |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC-001: 4 runtime mirrors aligned (~same line count, identical body modulo frontmatter shape)
- SC-002: TOML parses
- SC-003: Validator pass for 064 packet
- SC-004: Final grep audit shows @create referenced in expected surfaces
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|---|---|---|
| Dependency | sk-doc agent template (063b updated) | Read updated template before authoring |
| Risk | Caller-restriction enforcement | Document as convention in agent body; note that runtime can't enforce |
| Risk | 600-line cap | Aim for ~400-500 lines based on @context reference |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Confirmed name: @create.
<!-- /ANCHOR:questions -->
