---
title: "Tasks: Hook Daemon Parity"
description: "Task record for the 009-hook-daemon-parity flattened parent layout."
trigger_phrases:
  - "009-hook-daemon-parity"
  - "skill graph daemon, hook parity, plugin/runtime parity, and parity remediation"
  - "001-skill-advisor-hook-surface"
  - "002-skill-graph-daemon-and-advisor-unification"
  - "003-hook-parity-remediation"
  - "004-copilot-hook-parity-remediation"
  - "005-codex-hook-parity-remediation"
  - "006-claude-hook-findings-remediation"
  - "007-opencode-plugin-loader-remediation"
  - "008-skill-advisor-plugin-hardening"
  - "009-skill-advisor-standards-alignment"
  - "010-copilot-wrapper-schema-fix"
  - "011-copilot-writer-wiring"
importance_tier: "important"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity"
    last_updated_at: "2026-04-23T15:20:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "009 packet truth-sync applied; 010 and 011 marked reverted-needs-reapply"
    next_safe_action: "Use context-index.md for local phase navigation, then reapply 010 and 011"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:d8d5c5dae61c07ff01dba07d20db625b533f1c06f2d2f5e6bd3d80bb099641a2"
      session_id: "026-phase-root-flatten-2026-04-21"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Tasks: Hook Daemon Parity

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

- [x] T001 Read child packet roots for `001-skill-advisor-hook-surface/`, `002-skill-graph-daemon-and-advisor-unification/`, `003-hook-parity-remediation/`, `004-copilot-hook-parity-remediation/`, `005-codex-hook-parity-remediation/`, `006-claude-hook-findings-remediation/`, `007-opencode-plugin-loader-remediation/`, `008-skill-advisor-plugin-hardening/`, `009-skill-advisor-standards-alignment/`, `010-copilot-wrapper-schema-fix/`, and `011-copilot-writer-wiring/`.
- [x] T002 Capture status, summaries, unchecked item counts, and current paths.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Move original phase folders to direct child paths.
- [x] T011 Regenerate `context-index.md` for this theme.
- [x] T012 Refresh parent and child metadata paths.
- [x] T013 Move hook-specific remediation packets from the former deep-review parent to `009-hook-daemon-parity/004-006`.
- [x] T014 Move skill-advisor / plugin-loader infrastructure packets from the former deep-review parent to `009-hook-daemon-parity/007-009`.
- [x] T015 Move Copilot wrapper schema and writer-wiring packets from the former deep-review parent to `009-hook-daemon-parity/010-011`.
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
- [x] Hook remediation packets 004-006 are represented as direct children.
- [x] Skill-advisor / plugin-loader packets 007-009 are represented as direct children.
- [x] Copilot wrapper schema and writer-wiring packets 010-011 are represented as direct children.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Context Index**: See `context-index.md`
<!-- /ANCHOR:cross-refs -->
