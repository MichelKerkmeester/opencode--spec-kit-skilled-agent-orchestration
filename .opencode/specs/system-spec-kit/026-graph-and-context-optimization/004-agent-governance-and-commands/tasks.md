---
title: "Tasks: Agent Governance [system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands/tasks]"
description: "Task record for the 004-agent-governance-and-commands flattened parent layout."
trigger_phrases:
  - "004-agent-governance-and-commands"
  - "agents guardrails, canonical intake, and command cleanup"
  - "001-agent-execution-guardrails"
  - "002-command-graph-consolidation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-agent-governance-and-commands"
    last_updated_at: "2026-04-21T13:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Renumbered nested phases"
    next_safe_action: "Use context-index.md for local phase navigation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:620b42c928994d3d8dbd410b8d2cb050350a23557b2122958093f3704b6abab3"
      session_id: "026-phase-root-flatten-2026-04-21"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
---
# Tasks: Agent Governance And Commands

<!-- SPECKIT_LEVEL: 1 -->
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

**Task Format**: `T### Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read child packet roots for `001-agent-execution-guardrails/`, `002-command-graph-consolidation/`.
- [x] T002 Capture status, summaries, unchecked item counts, and current paths.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Move original phase folders to direct child paths.
- [x] T011 Regenerate `context-index.md` for this theme.
- [x] T012 Refresh parent and child metadata paths.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run strict validation for this parent.
- [x] T021 Confirm JSON metadata parses after flattening.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All child packets are represented in `context-index.md`.
- [x] Original folders are direct children.
- [x] Metadata contains migration aliases for moved packet IDs.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Context Index**: See `context-index.md`
<!-- /ANCHOR:cross-refs -->
