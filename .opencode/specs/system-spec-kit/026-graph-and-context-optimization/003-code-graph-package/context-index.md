---
title: "Context Index: Code Graph Package"
description: "Bridge index for code graph upgrades and self-contained package migration after renumbering original phases inside the phase root."
trigger_phrases:
  - "003-code-graph-package"
  - "code graph upgrades and self-contained package migration"
  - "001-code-graph-upgrades"
  - "002-code-graph-self-contained-package"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-code-graph-package"
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
      fingerprint: "sha256:3d264ac5042d1bb5068616525a88e87bc58a5724676a30fc4feaa8af5f676a7e"
      session_id: "026-phase-root-flatten-2026-04-21"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Context Index: Code Graph Package

<!-- SPECKIT_LEVEL: 1 -->

## Theme

Code graph upgrades and self-contained package migration. The original phase packets are direct child folders of this phase root.

## Child Phase Map

| Child Phase | Old Title | Status Before Consolidation | Current Path |
|-------------|-----------|-----------------------|--------------|
| `001-code-graph-upgrades/` | Feature Specification: Code Graph Upgrades | Complete | `003-code-graph-package/001-code-graph-upgrades/` |
| `002-code-graph-self-contained-package/` | Feature Specification: 028 — Code-Graph Self-Contained Package Migration | In Progress | `003-code-graph-package/002-code-graph-self-contained-package/` |

## Key Implementation Summaries

- **`001-code-graph-upgrades/`**: Packet `014` now ships the adopt-now code-graph runtime lane instead of staying planning-only. The implementation added a dedicated detector provenance vocabulary, fixed blast-radius depth handling at traversal time, exposed explicit multi-file union mode, ...
- **`002-code-graph-self-contained-package/`**: Implementation and verification are complete in the filesystem. Commit/staging is blocked by sandboxed git-index permissions; see `002-code-graph-self-contained-package/blocker.md`.

## Open Or Deferred Items

- **`001-code-graph-upgrades/`**: status before consolidation was Complete; 2 unchecked task/checklist item(s) remain in the child packet docs.
- **`002-code-graph-self-contained-package/`**: status before consolidation was In Progress; 8 unchecked task/checklist item(s) remain in the child packet docs.

## Root Support References

The root `research/`, `review/`, and `scratch/` folders remain at `system-spec-kit/026-graph-and-context-optimization/`. Historical citations inside child packets intentionally remain local evidence unless this wrapper points to an active path.
