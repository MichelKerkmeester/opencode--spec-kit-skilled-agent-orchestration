---
title: "Spec: 063 — sk-doc Agent Template Alignment"
description: "Two-task cleanup: (a) remove §RELATED RESOURCES from all 10 agents × 4 mirrors = 40 files + renumber SUMMARY, (b) update sk-doc agent template to reflect current production state after 060/061/062 iteration."
trigger_phrases:
  - "063 sk-doc template"
  - "agent template alignment"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/063-sk-doc-agent-template-alignment"
    last_updated_at: "2026-05-03T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Scaffolded 063 packet"
    next_safe_action: "execute_063a_then_063b"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-063-2026-05-03"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Spec: 063 — sk-doc Agent Template Alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-05-03 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem
1. The §RELATED RESOURCES section in every agent .md is dead weight — duplicated in orchestrate.md's agents table, never used as a runtime anchor. 40 files (10 agents × 4 runtimes).
2. The sk-doc agent template at `.opencode/skill/sk-doc/assets/agents/agent_template.md` is ~15-18 months stale relative to current production agents (post-060/061/062 work added §0 HARD BLOCK, BINDING emission, REFUSE wording, mcpServers field, runtime budgets, Unicode SUMMARY box, 600-line cap).

### Purpose
Clean up agent files (063a) AND align the template to current production reality (063b). Sets the stage for 064 (new @create-doc agent built from the updated template).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 40 agent files: drop §RELATED RESOURCES + renumber SUMMARY
- sk-doc agent template: drop stale sections + add current production patterns
- TOML re-validation for .codex mirrors

### Out of Scope
- Other agent body changes (the agent fleet is otherwise stable)
- New agent creation (deferred to 064)
- 062 R3 verification (Category D parallel-track conflict still blocks)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0
| ID | Requirement |
|---|---|
| REQ-001 | All 40 agent files have RELATED RESOURCES removed; SUMMARY renumbered |
| REQ-002 | TOMLs (.codex) parse cleanly post-edit |
| REQ-003 | Per-agent line counts ≤ 600 |
| REQ-004 | sk-doc agent template updated with §0 HARD BLOCK, BINDING, REFUSE, mcpServers, budgets, Unicode SUMMARY |
| REQ-005 | Stale @write reference removed from template |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -rln "## .*RELATED RESOURCES" .opencode/agent .claude/agents .gemini/agents .codex/agents` → 0
- **SC-002**: All 4 .codex .toml files parse via `python3 -c "import toml; toml.load(...)"`
- **SC-003**: All 40 agent files ≤600 lines
- **SC-004**: sk-doc agent template includes new sections (§0 HARD BLOCK, BINDING, REFUSE, mcpServers, etc.)
- **SC-005**: graph-metadata.json: status=complete, pct=100
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Risk | Per-agent regex variance for §RELATED parsing | Mis-edit | Use Python with explicit per-agent section count from audit table |
| Dependency | TOML wrapper on .codex | Re-parse must succeed | Validate after each edit |
| Risk | Renumbering missed text refs | Stale "§13. SUMMARY" mention | Sed fix-ups for in-body cross-references |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Pre-promote backup all 40 to /tmp or skill-isolated `improvement/pre-promote-backup/`? (Going with skill-isolated per 060/004 pattern.)
<!-- /ANCHOR:questions -->
