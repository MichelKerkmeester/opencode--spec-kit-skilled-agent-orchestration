---
title: "Fix Handover vs Drop Routing Confusion - Decision Record"
status: planned
---
# Decision Record
## ADR-001: Treat Operational Commands as Soft Signals When Handover State Is Strong
**Context:** `../research/research.md:36-53` shows the live router groups `git diff`, `list memories`, and `force re-index` with true wrapper signals, even though the handover examples often include those commands alongside strong current-state and resume language.
**Decision:** Keep transcript and boilerplate wrappers as hard drops, but demote operational commands to a soft branch that loses when `handover_state` language is clearly stronger.
**Rationale:** The research isolated the refusal bug to cue grouping, not to the existence of command language itself.
**Consequences:** The drop category stays strict for real wrappers, handover notes regain the ability to include operational next steps safely, and the prototype corpus must reinforce the state-first boundary.
