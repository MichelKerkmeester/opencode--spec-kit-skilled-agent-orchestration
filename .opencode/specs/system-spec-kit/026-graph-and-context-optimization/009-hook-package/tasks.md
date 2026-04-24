---
title: "Tasks: Hook Package [system-spec-kit/026-graph-and-context-optimization/009-hook-package/tasks]"
description: "Task record for the 009-hook-package flattened parent layout with 14 direct child phase packets."
trigger_phrases:
  - "009-hook-package"
  - "hook-package"
  - "hook daemon parity"
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
  - "012-docs-impact-remediation"
  - "013-code-graph-hook-improvements"
  - "014-skill-advisor-hook-improvements"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-package"
    last_updated_at: "2026-04-24T17:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Packet renamed to 009-hook-package (prior slug: hook+daemon+parity); 388 path refs + 7 slug/title residues rewritten; frontmatter resynced to 14 direct children"
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
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
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
- [x] T013 Move hook-specific remediation packets from the former deep-review parent to `009-hook-package/004-006`.
- [x] T014 Move skill-advisor / plugin-loader infrastructure packets from the former deep-review parent to `009-hook-package/007-009`.
- [x] T015 Move Copilot wrapper schema and writer-wiring packets from the former deep-review parent to `009-hook-package/010-011`.
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
