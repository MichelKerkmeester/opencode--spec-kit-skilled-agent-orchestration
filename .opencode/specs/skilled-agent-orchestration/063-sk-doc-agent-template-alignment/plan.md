---
title: "Plan: 063 — sk-doc Agent Template Alignment"
description: "Two task groups: 063a removes §RELATED RESOURCES from 40 files; 063b updates sk-doc agent template."
trigger_phrases:
  - "063 plan"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/063-sk-doc-agent-template-alignment"
    last_updated_at: "2026-05-03T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Plan scaffolded"
    next_safe_action: "execute_063a"
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

# Plan: 063

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

063a: 40-file mechanical cleanup (Python). 063b: sk-doc template update (Edit tool + section additions). Single commit per task group.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- TOML re-parse after .codex edits
- Per-agent line count ≤600
- Validator pass for sk-doc template
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Standard 4-runtime mirror discipline. Skill-isolated pre-promote backup at improvement/pre-promote-backup/.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Steps | Output |
|---|---|---|
| 063a | Backup → Python edit 40 files → TOML re-parse | 40 cleaned files |
| 063b | Read template → Apply section edits → Validator pass | Updated template |
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Grep audit + Python toml.load + validator script.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Production reference agents: @context, @deep-review, @multi-ai-council
- sk-deep-review SKILL.md ALWAYS rules 13+14 (BINDING+REFUSE source)
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`cp improvement/pre-promote-backup/<file> <original-path>` for any 40-file mistake. Template revert: `git checkout HEAD~1 -- <template-path>`.
<!-- /ANCHOR:rollback -->
