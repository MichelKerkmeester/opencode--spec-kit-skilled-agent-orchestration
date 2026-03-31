---
title: "Checklist: Phase 011 — Compaction [02--system-spec-kit/024-compact-code-graph/011-compaction-working-set/checklist]"
description: "checklist document for 011-compaction-working-set."
trigger_phrases:
  - "checklist"
  - "phase"
  - "011"
  - "compaction"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: Phase 011 — Compaction Working-Set Integration

## P0
- [x] Working-set tracker records files accessed during session
- [x] Budget allocator enforces floors (constitutional 700, graph 1200, CocoIndex 900, triggered 400)
- [x] Empty source releases floor to overflow pool (800 base)
- [x] 3-source merge produces combined compact brief under 4000 tokens
- [x] Constitutional memory always included, never trimmed
- [x] Trim order is deterministic and matches spec
- [ ] `autoSurfaceAtCompaction` uses 3-source merge instead of Memory-only
- [x] Graceful degradation: if Code Graph or CocoIndex unavailable, remaining sources fill budget

## P1
- [x] Working-set tracker weights entries by recency + frequency
- [ ] File-level deduplication across sources before budget allocation
- [x] Compact brief has visible section headers (Constitutional, Structural, Semantic, Session, Triggered)
- [x] Overflow pool redistribution follows priority order
- [ ] Cached compact brief available for SessionStart(source=compact) injection
- [ ] Total pipeline completes within 2s hard cap

## P2
- [x] Allocator observability metadata included in output (per-source requested/granted/dropped)
- [ ] Per-source freshness metadata in compact brief
- [ ] Symbol-level working-set tracking (not just files)
- [ ] Compact brief rendering adapts to smaller budgets (1500/2500) with same ratio
- [ ] Merge time tracked for performance monitoring
