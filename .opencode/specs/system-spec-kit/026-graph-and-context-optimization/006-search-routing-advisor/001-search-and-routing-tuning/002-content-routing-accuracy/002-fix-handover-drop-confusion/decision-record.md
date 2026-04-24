---
title: "...g-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion/decision-record]"
description: 'title: "Fix Handover vs Drop Routing Confusion - Decision Record"'
trigger_phrases:
  - "advisor"
  - "001"
  - "search"
  - "and"
  - "routing"
  - "decision record"
  - "002"
  - "fix"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["decision-record.md"]
status: planned
---
# Decision Record
## ADR-001: Treat Operational Commands as Soft Signals When Handover State Is Strong
**Context:** `../../../../research/010-search-and-routing-tuning-pt-02/research.md:36-53` shows the live router groups `git diff`, `list memories`, and `force re-index` with true wrapper signals, even though the handover examples often include those commands alongside strong current-state and resume language.
**Decision:** Keep transcript and boilerplate wrappers as hard drops, but demote operational commands to a soft branch that loses when `handover_state` language is clearly stronger.
**Rationale:** The research isolated the refusal bug to cue grouping, not to the existence of command language itself.
**Consequences:** The drop category stays strict for real wrappers, handover notes regain the ability to include operational next steps safely, and the prototype corpus must reinforce the state-first boundary.
