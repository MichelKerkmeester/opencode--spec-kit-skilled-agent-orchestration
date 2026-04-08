---
title: "Research Pointer: Cache-Warning Hook System"
description: "Research-aligned pointer for packet 002 after the 2026-04-08 canonical consolidation refresh."
trigger_phrases:
  - "cache warning research"
  - "claudest continuation"
  - "producer boundary"
importance_tier: "normal"
contextType: "research"
---

# Research Pointer: Cache-Warning Hook System

<!-- SPECKIT_LEVEL: 3 -->

## 1. Authoritative Sources

The current source of truth for this packet is no longer the older phase-001-only hook findings.

- **Canonical synthesis:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/research/research.md`
- **Canonical ranked guidance:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/research/recommendations.md`
- **Continuity-lane closeout:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/research/research.md`

These sources establish the 2026-04-08 packet order and acceptance gates that now govern packet `002` [SOURCE: ../001-research-graph-context-systems/research/research.md:22-36; ../001-research-graph-context-systems/research/recommendations.md:15-33; ../001-research-graph-context-systems/005-claudest/research/research.md:628-670].

## 2. Packet-002 Rescope

Packet `002` is now scoped to the **bounded producer-side prerequisite lane**, not the earlier six-phase warning prototype.

### Adopted now

| Research item | Packet impact |
|---------------|---------------|
| FTS helper + forced-degrade tests land first | Hard predecessor for this packet; packet `002` must not present itself as the first continuity implementation packet [SOURCE: ../001-research-graph-context-systems/005-claudest/research/research.md:628-635]. |
| Bounded Stop-hook metadata patch in `session-stop.ts` + `hook-state.ts` | This is the active implementation lane for packet `002` [SOURCE: ../001-research-graph-context-systems/005-claudest/research/research.md:636-643]. |
| `claudeSessionId` remains the primary key while `speckitSessionId` stays nullable | Required writer-boundary contract [SOURCE: ../001-research-graph-context-systems/005-claudest/research/research.md:636-643]. |
| Replay the same transcript twice and prove stable session totals with no duplicate turn ingestion | Required idempotency gate for this packet's verification plan [SOURCE: ../001-research-graph-context-systems/005-claudest/research/research.md:644-648]. |

### Explicitly deferred

| Research item | Why deferred |
|---------------|--------------|
| SessionStart cached-summary fast path | Research now treats this as packet 4 in the lane, additive only, and gated by fidelity and freshness checks [SOURCE: ../001-research-graph-context-systems/research/recommendations.md:25-33; ../001-research-graph-context-systems/005-claudest/research/research.md:649-652]. |
| `UserPromptSubmit` direct warning or soft-block behavior | The canonical synthesis does not keep this as active early implementation work; it overreaches beyond the validated producer-first lane [SOURCE: ../001-research-graph-context-systems/research/research.md:24-35]. |
| `.claude/settings.local.json` mutation for new warning hooks | Runtime enablement belongs after the producer, reader, and freshness gates are satisfied [SOURCE: ../001-research-graph-context-systems/research/recommendations.md:17-33]. |
| Analytics reader, dashboards, and token-insight contracts | These are later packets in the Claudest continuation order [SOURCE: ../001-research-graph-context-systems/005-claudest/research/research.md:644-668]. |

## 3. Historical Input Retained for Context

The older phase-001 Claude settings research still matters as **upstream context only**, especially for:

- idle-timestamp motivation
- replay isolation concerns
- caution about overstated savings claims

It is no longer sufficient by itself to define packet `002` scope or ordering [SOURCE: ../001-research-graph-context-systems/research/research.md:34-35].

## 4. Guardrails Carried Forward

The canonical research adds four packet-level rules that this folder now follows:

1. `session_bootstrap()` and memory resume remain authoritative; no cached summary may replace them by default [SOURCE: ../001-research-graph-context-systems/research/recommendations.md:17-33].
2. Producer work must stay inside `session-stop.ts` and `hook-state.ts`; this packet does not turn Stop into an analytics reader [SOURCE: ../001-research-graph-context-systems/005-claudest/research/research.md:636-643].
3. Trust, provenance, freshness, and evidence should not be collapsed into a single confidence narrative [SOURCE: ../001-research-graph-context-systems/research/research.md:26-29; ../001-research-graph-context-systems/research/recommendations.md:95-103].
4. Any later cached-startup or warning consumer must prove fidelity and freshness on a frozen corpus before becoming an active packet claim [SOURCE: ../001-research-graph-context-systems/research/recommendations.md:25-33; ../001-research-graph-context-systems/research/recommendations.md:75-83].

## 5. Packet Boundary

This packet keeps the existing folder name for continuity, but its active scope is now:

- replay-safe producer scaffolding
- bounded Stop-hook metadata persistence
- idempotent verification and handoff to later continuity packets

It no longer claims an active six-phase warning-hook rollout.
