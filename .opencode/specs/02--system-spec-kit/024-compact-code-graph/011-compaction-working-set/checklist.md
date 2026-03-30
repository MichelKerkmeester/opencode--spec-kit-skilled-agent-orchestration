# Checklist: Phase 011 — Compaction Working-Set Integration

## P0
- [ ] Working-set tracker records files accessed during session
- [ ] Budget allocator enforces floors (constitutional 700, graph 1200, CocoIndex 900, triggered 400)
- [ ] Empty source releases floor to overflow pool (800 base)
- [ ] 3-source merge produces combined compact brief under 4000 tokens
- [ ] Constitutional memory always included, never trimmed
- [ ] Trim order is deterministic and matches spec
- [ ] `autoSurfaceAtCompaction` uses 3-source merge instead of Memory-only
- [ ] Graceful degradation: if Code Graph or CocoIndex unavailable, remaining sources fill budget

## P1
- [ ] Working-set tracker weights entries by recency + frequency
- [ ] File-level deduplication across sources before budget allocation
- [ ] Compact brief has visible section headers (Constitutional, Structural, Semantic, Session, Triggered)
- [ ] Overflow pool redistribution follows priority order
- [ ] Cached compact brief available for SessionStart(source=compact) injection
- [ ] Total pipeline completes within 2s hard cap

## P2
- [ ] Allocator observability metadata included in output (per-source requested/granted/dropped)
- [ ] Per-source freshness metadata in compact brief
- [ ] Symbol-level working-set tracking (not just files)
- [ ] Compact brief rendering adapts to smaller budgets (1500/2500) with same ratio
- [ ] Merge time tracked for performance monitoring
