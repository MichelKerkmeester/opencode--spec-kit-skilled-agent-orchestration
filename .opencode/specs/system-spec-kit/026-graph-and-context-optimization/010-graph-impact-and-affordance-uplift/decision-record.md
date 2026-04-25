---
speckit_template_source: "SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2"
title: "Decision Record: Graph Impact and Affordance Uplift (012)"
description: "ADRs governing the External Project pattern adoption phase: license posture, sub-phase decomposition, deferred Packet 5."
importance_tier: "important"
contextType: "implementation"
---
# Decision Record: Graph Impact and Affordance Uplift (012)

<!-- SPECKIT_LEVEL: 3 -->

---

## ADR-012-001 — Clean-room adaptation only

**Status:** Accepted (2026-04-25)
**Context:** pt-02 §12 raises license contamination as P0 risk. No formal license audit of `external/` has been performed.
**Decision:** All code work in 012 follows clean-room adaptation: read External Project as architectural evidence, reimplement Public-side from scratch. No source/schema-text/implementation-logic copy.
**Consequences:** Sub-phase 001 owns the license audit and publishes the explicit allow-list. Any deviation requires sub-phase 001 to be reopened with legal review. Pattern-only citations (with `[SOURCE: external/...]` references in commit messages and docs) are explicitly allowed.
**Alternatives rejected:**
- Direct source reuse: blocked until license audit approves stronger reuse path.
- "Inspired by" without attribution: rejected — pattern citations must be auditable.

---

## ADR-012-002 — Six sub-phases (not pt-02's five packets)

**Status:** Accepted (2026-04-25)
**Context:** pt-02 §11 proposes 5 packets. User requested doc rollup, and the P0 license posture warrants its own gate.
**Decision:** Split into 6 sub-phases:
- 001 license audit (P0 gate, new, not in pt-02)
- 002 = pt-02 Packet 1 (Code Graph foundation)
- 003 = pt-02 Packet 2 (edge explanation + blast_radius uplift)
- 004 = pt-02 Packet 3 (Skill Advisor affordance evidence)
- 005 = pt-02 Packet 4 (Memory trust display)
- 006 docs rollup (new, per user request)
**Consequences:** pt-02 Packet 5 (route/tool/shape) is excluded — see ADR-012-003. Total scope expands by 2 sub-phases vs pt-02's 4-packet near-term plan, but each new addition is small (license audit S; docs rollup M).
**Alternatives rejected:**
- 4 sub-phases (pt-02 verbatim): drops governance + docs surfaces the user explicitly wants.
- 5 sub-phases (combine docs into trailing rollup of 005): deemed less auditable.

---

## ADR-012-003 — Defer route/tool/shape contract safety (pt-02 Packet 5)

**Status:** Accepted (2026-04-25)
**Context:** pt-01 proposed route/tool/shape adaptation. pt-02 cross-check narrowed this to "deferred — Public lacks route/tool/consumer extraction substrate; building the surface first would imply unsupported precision."
**Decision:** pt-02 Packet 5 is explicitly out of scope for 012. Route/tool/shape work tracked as a future Code Graph design packet.
**Consequences:** No `route_map`, `tool_map`, `shape_check`, or `api_impact` handlers in 012. Sub-phase 003 enriches existing `blast_radius` only — no new route/tool nodes.
**Reopen criterion:** After Public adds route/tool/consumer extraction (a separate Code Graph design packet, not part of 012).

---

## ADR-012-004 — Reject mutating rename

**Status:** Accepted (2026-04-25)
**Context:** External Project's `rename` tool has preview/apply semantic divergence (apply does whole-file word-boundary replacement). pt-02 §4 (Code Graph table, Rename split row) confirms this finding.
**Decision:** No mutating rename in 012. Sub-phase 003 may adopt read-only advisory rename preview only — separating graph hits from text hits, never executing edits.
**Consequences:** Public users can preview rename impact but apply via existing IDE/editor tooling. Aligns with pt-02 risk RISK-10.
**Reopen criterion:** Exact preview ranges + apply equivalence + post-change validation proven identical (none of which 012 will produce).

---

## ADR-012-005 — Memory trust display only; no causal vocabulary changes

**Status:** Accepted (2026-04-25)
**Context:** pt-02 §5 (Memory findings) and ADR-aligned guidance: Memory must not become a duplicate code index.
**Decision:** Sub-phase 005 ships display-only trust badges reading existing causal-edge columns. No schema change. No new relation types. No storage of code/process/tool facts.
**Consequences:** pt-01's proposed Memory↔CodeGraph evidence bridge stays deferred (pt-02 §15 disagreement row). Any bridge requires its own owner-boundary design — not 012.
**Alternatives rejected:**
- Add Code Graph evidence as causal edges: collapses owner boundaries (pt-02 P0 risk).
- Add new relation types: conflicts with bounded six-relation vocabulary.

---

## ADR-012-006 — Affordance evidence routes through existing scoring lanes

**Status:** Accepted (2026-04-25)
**Context:** pt-02 §6 (Skill Advisor findings) confirms tool/resource affordances should feed existing `derived` + `graph-causal` lanes, NOT a new lane.
**Decision:** Sub-phase 004 implements an affordance-normalizer that converts tool/resource descriptions into derived triggers / graph-causal edge weights using the existing relation set (`depends_on`, `enhances`, `siblings`, `prerequisite_for`, `conflicts_with`).
**Consequences:** No new compiler entity_kinds. No new scoring lane. Privacy preservation in recommendation payloads remains unchanged.
**Reopen criterion:** Demonstrated benchmark improvement requiring richer evidence types — not in scope for 012.

---

## ADR-012-007 — Per-packet doc entries inline + trailing umbrella rollup

**Status:** Accepted (2026-04-25)
**Context:** User selected "Both — per-packet entries + trailing global rollup" for doc sequencing.
**Decision:** Code sub-phases 002-005 each write their own entries in `feature_catalog/{NN--category}/` and `manual_testing_playbook/{NN--category}/` inline as part of their own work. Sub-phase 006 then rolls up umbrella docs (root README, skill SKILL.md/README, mcp_server README/INSTALL_GUIDE).
**Consequences:** Per-packet entries land with the code (tighter coupling). Umbrella rollup runs last so docs reflect actual shipped state. Generated via `/create:feature-catalog` and `/create:testing-playbook` commands.
**Alternatives rejected:**
- Single trailing doc sub-phase: weaker per-feature traceability.
- Inline per-packet only: leaves umbrella docs inconsistent until manual cleanup.

---

## References

- spec.md (this folder)
- plan.md (this folder)
- pt-01 synthesis: `.../001-research-and-baseline/007-external-project/research/007-external-project-pt-01/research.md`
- pt-02 synthesis: `.../001-research-and-baseline/007-external-project/research/007-external-project-pt-02/research.md`
- pt-02 §12 (risks), §13 (ownership), §15 (cross-check)
- Plan source: `/Users/michelkerkmeester/.claude/plans/create-new-phase-with-zazzy-lighthouse.md`
