---
title: "Tasks: Hook Parity [system-spec-kit/026-graph-and-context-optimization/009-hook-parity/tasks]"
description: "Task record for the 009-hook-parity flattened parent layout with 8 direct child phase packets."
trigger_phrases:
  - "009-hook-parity"
  - "hook parity"
  - "runtime hook parity"
  - "claude codex copilot opencode hook parity"
  - "001-hook-parity-remediation"
  - "002-copilot-hook-parity-remediation"
  - "003-codex-hook-parity-remediation"
  - "004-claude-hook-findings-remediation"
  - "005-opencode-plugin-loader-remediation"
  - "006-copilot-wrapper-schema-fix"
  - "007-copilot-writer-wiring"
  - "008-docs-impact-remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-parity"
    last_updated_at: "2026-04-25T11:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "2026-04-25 second consolidation: 7 children moved out (5 to 008-skill-advisor, 2 to 007-code-graph); renamed from 009-hook-parity; 8 hook-parity children renumbered 001-008"
    next_safe_action: "Run validate.sh --strict on the packet, then refresh DB via generate-context.js to re-index under the new slug"
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
    migration_aliases:
      - "system-spec-kit/026-graph-and-context-optimization/009-hook-parity"
      - "system-spec-kit/026-graph-and-context-optimization/009-hook-parity"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
---
# Tasks: Hook Parity

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

- [x] T001 Read child packet roots for `001-hook-parity-remediation/`, `002-copilot-hook-parity-remediation/`, `003-codex-hook-parity-remediation/`, `004-claude-hook-findings-remediation/`, `005-opencode-plugin-loader-remediation/`, `006-copilot-wrapper-schema-fix/`, `007-copilot-writer-wiring/`, and `008-docs-impact-remediation/`.
- [x] T002 Capture status, summaries, unchecked item counts, and current paths.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Move hook-parity phase folders to direct child paths 001-008.
- [x] T011 Regenerate `context-index.md` for this theme.
- [x] T012 Refresh parent and child metadata paths.
- [x] T013 Place central + per-runtime hook-parity remediation packets at `009-hook-parity/001-005`.
- [x] T014 Place Copilot wrapper schema and writer-wiring packets at `009-hook-parity/006-007`.
- [x] T015 Place documentation impact remediation packet at `009-hook-parity/008`.
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

- [x] All 8 hook-parity child packets are represented in `context-index.md`.
- [x] Original folders are direct children numbered 001-008.
- [x] Metadata contains migration aliases for prior `009-hook-parity` and `009-hook-parity` slugs.
- [x] Per-runtime hook remediation packets 001-005 are represented as direct children.
- [x] Copilot wrapper schema and writer-wiring packets 006-007 are represented as direct children.
- [x] Documentation impact remediation packet 008 is represented as a direct child.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Context Index**: See `context-index.md`
<!-- /ANCHOR:cross-refs -->
