---
title: "...ptimization/002-continuity-memory-runtime/003-continuity-refactor-gates/005-gate-e-runtime-migration/decision-record]"
description: "Cutover ADRs."
trigger_phrases:
  - "gate e"
  - "decision record"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/005-gate-e-runtime-migration"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded three ADRs for canonical cutover, spec-first continuity, and evidence-backed closeout"
    next_safe_action: "Keep as historical record; no further edits expected"
    key_files: ["decision-record.md", "spec.md"]
closed_by_commit: TBD
status: complete
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->
# Decision Record: Gate E — Runtime Migration

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Gate E Uses a Single Canonical Cutover

### Metadata

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-04-12 |
| Deciders | Packet implementer |

### Context

The earlier Gate E docs assumed a staged migration through shadow and dual-write states with hold windows and observation gates. The operator direction for this packet replaces that model completely: canonical continuity should become the only active path immediately, without a multi-state rollout ladder.

### Decision

We chose to document Gate E as an immediate canonical cutover. Any remaining rollout control-plane logic is either forced directly to canonical or removed from the active path. There is no packet-level shadow, dual-write, or observation-window framework.

### Consequences

What improves:
- The packet now matches the requested runtime model directly.
- Operators no longer need to interpret legacy rollout terminology.

What it costs:
- There is no gradual packet-level promotion story to lean on.
- Verification must rely on direct runtime checks and sample-save proof instead of staged holds.
<!-- /ANCHOR:adr-001 -->

### ADR-002: Canonical Continuity Sources Are Spec-First

### Metadata

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-04-12 |
| Deciders | Packet implementer |

### Context

Rollout-era continuity guidance often treated memory files as the primary recovery surface. The new continuity model treats canonical packet artifacts as the source of truth and uses `/spec_kit:resume` as the operator-facing recovery entrypoint.

### Decision

We chose the following recovery order for active guidance:

1. `/spec_kit:resume` is the recovery surface.
2. Continuity resolves from `../handover.md`.
3. Then `_memory.continuity`.
4. Then canonical spec docs.
5. Legacy memory files remain supporting artifacts only.

### Consequences

What improves:
- Recovery guidance is stable and anchored in packet-owned artifacts.
- Agent, command, and skill docs can point to one continuity contract.

What it costs:
- Older memory-first wording must be removed broadly to avoid drift.
### ADR-003: Packet Closeout Stays Evidence-Backed

### Metadata

| Field | Value |
|-------|-------|
| Status | Accepted |
| Date | 2026-04-12 |
| Deciders | Packet implementer |

### Context

Gate E closeout spans runtime edits, broad doc parity, and CLI contract alignment. Some slices already have direct evidence; others still need final validator runs or runtime verification. The packet should not claim repo-wide completion before those proofs exist.

### Decision

We chose to mark only evidence-backed items complete inside this packet and leave the remaining exit-gate checks open until runtime verification and validator output are attached.

### Consequences

What improves:
- The packet stays honest about current progress.
- `implementation-summary.md` becomes the place where final validation and metric evidence lands.

What it costs:
- The packet remains in progress until the orchestrator finishes the remaining proof steps.
