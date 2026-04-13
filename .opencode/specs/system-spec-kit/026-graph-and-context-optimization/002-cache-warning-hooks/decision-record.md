---
title: "Decision Record: Cache-Warning Hook System [template:level_3/decision-record.md]"
description: "Research-aligned packet decision for the rescope of packet 002."
trigger_phrases:
  - "decision"
  - "record"
  - "producer boundary"
  - "packet rescope"
importance_tier: "normal"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-cache-warning-hooks"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["decision-record.md"]

---
# Decision Record: Cache-Warning Hook System

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Re-scope Packet 002 to the Producer-First Continuity Lane

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-08 |
| **Deciders** | Project owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

Packet `002` was authored as a six-phase warning-consumer rollout. The canonical 2026-04-08 synthesis and Claudest continuation changed that order: FTS helper plus forced-degrade tests come first, then a bounded Stop-hook metadata patch, while cached-summary consumers and direct warning UX remain later work. We needed to decide whether to keep the old packet story, abandon the packet, or re-scope it to the actual safe next lane.

### Constraints

- The FTS helper plus forced-degrade matrix is a hard predecessor for this packet [SOURCE: research.md §2].
- `session-stop.ts` and `hook-state.ts` are the bounded producer seam; this packet must not absorb analytics-reader logic [SOURCE: research.md §2].
- `session_bootstrap()` and memory resume remain authoritative; no startup or direct warning consumer belongs here [SOURCE: research.md §4].
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Keep packet `002` active, but narrow it to predecessor confirmation, replay isolation, bounded Stop-hook metadata persistence, and idempotent verification.

**How it works**: The packet now stops at the producer boundary. It records the FTS predecessor honestly, limits active implementation scope to `hook-state.ts`, `session-stop.ts`, and replay or test infrastructure, and defers `.claude/settings.local.json`, `UserPromptSubmit`, and SessionStart cached-summary consumers to later packets.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Re-scope packet `002` in place** | Preserves packet continuity while fixing research drift | Leaves a historical folder name in place | 10/10 |
| Keep the old six-phase warning plan | Avoids rewriting packet docs | Conflicts with current canonical research | 1/10 |
| Abandon packet `002` entirely | Removes naming drift | Loses useful packet continuity and documentation history | 5/10 |

**Why this one**: It fixes the research drift without discarding the packet lineage. It also keeps the next implementation packet aligned to the actual runtime seam instead of repeating the old overreach.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Packet `002` is now honest about the continuity packet train.
- The active code touch set is narrower and easier to verify.
- Later packets inherit a clean producer seam instead of a blended consumer contract.

**What it costs**:
- The folder name now overstates active scope. Mitigation: keep the packet docs explicit about the re-scope and consider a later rename once the lane stabilizes.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future work drifts back to the old warning-consumer plan | H | Keep the predecessor order and producer-only boundary explicit in all packet docs |
| Readers assume cached startup or direct warning work is already approved here | H | Defer those consumers explicitly in the packet docs and checklist |
| The historical packet name causes confusion | M | Keep the re-scope stated clearly and track a later rename if needed |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The canonical research changed the continuity packet order and invalidated the old packet framing |
| 2 | **Beyond Local Maxima?** | PASS | We considered keeping the old plan or abandoning the packet entirely |
| 3 | **Sufficient?** | PASS | Re-scoping in place is the smallest change that restores alignment |
| 4 | **Fits Goal?** | PASS | The goal is packet accuracy and a safe producer-first lane |
| 5 | **Open Horizons?** | PASS | The packet now hands cleanly to later reader and consumer packets |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `research.md` align to the producer-first packet scope.
- The packet now records the predecessor dependency, defers direct consumers, and preserves startup authority boundaries.

**How to roll back**: Restore the previous packet docs if the team intentionally decides to return to the older six-phase warning plan, then rerun strict validation and explicitly record that reversal in a fresh ADR.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
