---
title: "Tasks: Skill Advisor [system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/tasks]"
description: "Task record for the 008-skill-advisor flattened parent layout covering the skill advisor system."
trigger_phrases:
  - "008-skill-advisor"
  - "skill advisor"
  - "skill advisor system"
  - "skill advisor hook"
  - "search/routing tuning, skill graph and advisor unification, advisor docs and standards, smart-router, hook surface, plugin hardening, and hook improvements"
  - "001-search-and-routing-tuning"
  - "002-skill-advisor-graph"
  - "003-advisor-phrase-booster-tailoring"
  - "004-skill-advisor-docs-and-code-alignment"
  - "005-smart-router-remediation-and-opencode-plugin"
  - "006-deferred-remediation-and-telemetry-run"
  - "007-skill-advisor-hook-surface"
  - "008-skill-graph-daemon-and-advisor-unification"
  - "009-skill-advisor-plugin-hardening"
  - "010-skill-advisor-standards-alignment"
  - "011-skill-advisor-hook-improvements"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor"
    migration_aliases:
      - "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor"
    last_updated_at: "2026-04-25T11:50:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "2026-04-25 second consolidation: merged 008-skill-advisor root + 5 advisor children from 009-hook-parity into 008-skill-advisor"
    next_safe_action: "Use context-index.md for local phase navigation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:32257fddb8d398ec370e8d198804367f687297a3ab640ff3d805601e2f29f02b"
      session_id: "026-phase-root-flatten-2026-04-21"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
---
# Tasks: Skill Advisor

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

- [x] T001 Read child packet roots for `001-search-and-routing-tuning/`, `002-skill-advisor-graph/`, `003-advisor-phrase-booster-tailoring/`, `004-skill-advisor-docs-and-code-alignment/`, `005-smart-router-remediation-and-opencode-plugin/`, `006-deferred-remediation-and-telemetry-run/`, `007-skill-advisor-hook-surface/`, `008-skill-graph-daemon-and-advisor-unification/`, `009-skill-advisor-plugin-hardening/`, `010-skill-advisor-standards-alignment/`, and `011-skill-advisor-hook-improvements/`.
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
