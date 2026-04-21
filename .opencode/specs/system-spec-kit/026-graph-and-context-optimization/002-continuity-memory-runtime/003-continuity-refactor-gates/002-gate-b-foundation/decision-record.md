---
title: "Gate B — Foundation"
feature: phase-018-gate-b-foundation
level: 3
status: complete
closed_by_commit: TBD
parent: 006-continuity-refactor-gates
gate: B
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/002-gate-b-foundation"
    last_updated_at: "2026-04-11T20:55:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded Gate B archived-tier cleanup follow-through"
    next_safe_action: "Have orchestrator commit the validated Gate B cleanup"
    key_files: [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/002-gate-b-foundation/decision-record.md"]
description: "Architectural decision for how Gate B packages and owns its migration logic."
trigger_phrases: ["gate b adr", "foundation decision", "inline migration", "standalone sql", "phase 018"]
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Gate B — Foundation
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep the canonical Gate B migration inline in `vector-index-schema.ts`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-11 |
| **Deciders** | `[UNCERTAIN: named deciders not captured in the grounding; using Gate B packet ownership as the effective decision source]` |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed to choose where Gate B owns its migration logic. `../resource-map.md` F-1/F-2 and `../scratch/resource-map/01-schema.md` both point to `mcp_server/lib/search/vector-index-schema.ts` as the live schema source of truth, while the prompt allows an optional standalone `.sql` file under `mcp_server/database/migrations/`.

The tradeoff is straightforward. Inline ownership keeps fresh bootstrap DDL and migration behavior in one place, which matters because Gate B is already correcting earlier schema drift around `is_archived`. A standalone `.sql` file is easier for operators to read in isolation, but it risks splitting canonical ownership unless the inline bootstrap chain is updated in lockstep.

### Constraints

- The packet must not create a second source of truth for the same Gate B schema change.
- Fresh database bootstrap behavior must match the migrated state after Gate B lands.
- Operators still need clear, auditable migration steps during rehearsal and production.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: keep the canonical Gate B migration inline in `mcp_server/lib/search/vector-index-schema.ts`.

**How it works**: Gate B records the authoritative DDL and inline migration logic in the schema owner that already defines fresh bootstrap state. If the team wants a standalone operator-facing SQL file for rehearsal convenience, that file is optional supporting material only; it cannot become the canonical source of truth.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Inline in `vector-index-schema.ts`** | Matches the current schema ownership model, keeps bootstrap and migration state aligned, prevents split-brain schema drift | Slightly less convenient for operators reading raw SQL in isolation | 9/10 |
| Standalone `.sql` file under `mcp_server/database/migrations/` | Easy to hand to operators, easy to review as raw SQL, clear for one-off rehearsal steps | Risks divergence from bootstrap DDL, adds another place to update, weakens the corrected-scope guardrails around `is_archived` | 6/10 |

**Why this one**: Gate B is already reconciling early-research schema drift, so this is the wrong moment to split ownership across two canonical-looking surfaces. Keeping the real migration inline reduces ambiguity and keeps fresh bootstraps honest.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Fresh bootstrap behavior and migration behavior stay aligned in one canonical file.
- The packet can cite one schema owner when correcting the `is_archived` misconception and documenting the approved anchor-column delta.

**What it costs**:
- Operators do not get a standalone canonical SQL file by default. Mitigation: provide optional supporting SQL for rehearsal only if it is clearly labeled non-canonical.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An operator mistakes an optional `.sql` helper for the source of truth | Medium | Label helper SQL as supporting material only and keep the packet explicit that `vector-index-schema.ts` is canonical |
| Inline migration logic becomes harder to scan during the maintenance window | Low | Document the exact relevant block and expected assertions in the rehearsal evidence package |
| Future phases try to widen Gate B scope via the same inline file | Medium | Keep the Gate B packet explicit about the approved schema delta and document any broader follow-on separately |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Gate B needs an explicit migration-ownership rule before code work starts. |
| 2 | **Beyond Local Maxima?** | PASS | The packet considered both inline and standalone packaging, not only the current default. |
| 3 | **Sufficient?** | PASS | Inline ownership solves the real problem without adding new coordination overhead. |
| 4 | **Fits Goal?** | PASS | Gate B needs safe, auditable migration execution more than it needs a new packaging convention. |
| 5 | **Open Horizons?** | PASS | Optional supporting SQL remains available later without changing canonical ownership. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `mcp_server/lib/search/vector-index-schema.ts` carries the authoritative Gate B DDL and inline migration logic.
- Optional operator-facing SQL, if created, is supporting material only and must mirror the inline source rather than replace it.

**How to roll back**: Use the hard rollback path proven during rehearsal to restore logical baseline equivalence, then keep any optional helper SQL out of the certification path until the inline source is corrected.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
