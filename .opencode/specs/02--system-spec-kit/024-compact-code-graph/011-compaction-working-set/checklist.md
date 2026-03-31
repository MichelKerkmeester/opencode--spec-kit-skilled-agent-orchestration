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
- [x] `autoSurfaceAtCompaction` uses 3-source merge instead of Memory-only — compact-inject uses mergeCompactBrief
- [x] Graceful degradation: if Code Graph or CocoIndex unavailable, remaining sources fill budget

## P1
- [x] Working-set tracker weights entries by recency + frequency
- [x] File-level deduplication across sources before budget allocation — deduplicateFilePaths in compact-merger
- [x] Compact brief has visible section headers (Constitutional, Structural, Semantic, Session, Triggered)
- [x] Overflow pool redistribution follows priority order
- [x] Cached compact brief available for SessionStart(source=compact) injection — session-prime reads from hook state
- [x] Total pipeline completes within 2s hard cap — HOOK_TIMEOUT_MS=1800 + withTimeout

## P2
- [x] Allocator observability metadata included in output (per-source requested/granted/dropped)
- [x] Per-source freshness metadata in compact brief — SourceFreshness in MergedBrief
- [x] Symbol-level working-set tracking (not just files) — WorkingSetTracker.trackSymbol()
- [x] Compact brief rendering adapts to smaller budgets (1500/2500) with same ratio — totalBudget parameter in mergeCompactBrief
- [x] Merge time tracked for performance monitoring — mergeDurationMs in metadata
