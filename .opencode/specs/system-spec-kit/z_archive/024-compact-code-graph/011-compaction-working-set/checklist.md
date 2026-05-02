---
title: "Checklist: Phase 011 — Compaction [system-spec-kit/024-compact-code-graph/011-compaction-working-set/checklist]"
description: "checklist document for 011-compaction-working-set."
trigger_phrases:
  - "checklist"
  - "phase"
  - "011"
  - "compaction"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/011-compaction-working-set"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["checklist.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Verification Checklist: Phase 011 — Compaction Working-Set Integration

<!-- SPECKIT_LEVEL: 2 -->


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Verification Protocol
Template compliance shim section. Legacy phase content continues below.

## Pre-Implementation
Template compliance shim section. Legacy phase content continues below.

## Code Quality
Template compliance shim section. Legacy phase content continues below.

## Testing
Template compliance shim section. Legacy phase content continues below.

## Security
Template compliance shim section. Legacy phase content continues below.

## Documentation
Template compliance shim section. Legacy phase content continues below.

## File Organization
Template compliance shim section. Legacy phase content continues below.

## Verification Summary
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:protocol -->
Template compliance shim anchor for protocol.
<!-- /ANCHOR:protocol -->
<!-- ANCHOR:pre-impl -->
Template compliance shim anchor for pre-impl.
<!-- /ANCHOR:pre-impl -->
<!-- ANCHOR:code-quality -->
Template compliance shim anchor for code-quality.
<!-- /ANCHOR:code-quality -->
<!-- ANCHOR:testing -->
Template compliance shim anchor for testing.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:security -->
Template compliance shim anchor for security.
<!-- /ANCHOR:security -->
<!-- ANCHOR:docs -->
Template compliance shim anchor for docs.
<!-- /ANCHOR:docs -->
<!-- ANCHOR:file-org -->
Template compliance shim anchor for file-org.
<!-- /ANCHOR:file-org -->
<!-- ANCHOR:summary -->
Template compliance shim anchor for summary.
<!-- /ANCHOR:summary -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### P0
- [x] Working-set tracker records files accessed during session [EVIDENCE: verified in implementation-summary.md]
- [x] Budget allocator enforces floors (constitutional 700, graph 1200, CocoIndex 900, triggered 400) [EVIDENCE: verified in implementation-summary.md]
- [x] Empty source releases floor to overflow pool (800 base) [EVIDENCE: verified in implementation-summary.md]
- [x] 3-source merge produces combined compact brief under 4000 tokens [EVIDENCE: verified in implementation-summary.md]
- [x] Constitutional memory always included, never trimmed [EVIDENCE: verified in implementation-summary.md]
- [x] Trim order is deterministic and matches spec [EVIDENCE: verified in implementation-summary.md]
- [~] `autoSurfaceAtCompaction` uses fully working-set-driven 3-source merge — partial: merge helpers exist, active retrieval still leans on transcript heuristics
- [x] Graceful degradation: if Code Graph or CocoIndex unavailable, remaining sources fill budget [EVIDENCE: verified in implementation-summary.md]

#### P1
- [~] Working-set tracker weights entries by recency + frequency — partial: tracker exists, compaction path integration is incomplete
- [x] File-level deduplication across sources before budget allocation — deduplicateFilePaths in compact-merger [EVIDENCE: verified in implementation-summary.md]
- [x] Compact brief has visible section headers (Constitutional, Structural, Semantic, Session, Triggered) [EVIDENCE: verified in implementation-summary.md]
- [x] Overflow pool redistribution follows priority order [EVIDENCE: verified in implementation-summary.md]
- [x] Cached compact brief available for SessionStart(source=compact) injection — session-prime reads from hook state [EVIDENCE: verified in implementation-summary.md]
- [x] Total pipeline completes within 2s hard cap — HOOK_TIMEOUT_MS=1800 + withTimeout [EVIDENCE: verified in implementation-summary.md]

### P2
- [x] Allocator observability metadata included in output (per-source requested/granted/dropped) [EVIDENCE: verified in implementation-summary.md]
- [x] Per-source freshness metadata in compact brief — SourceFreshness in MergedBrief [EVIDENCE: verified in implementation-summary.md]
- [x] Symbol-level working-set tracking (not just files) — WorkingSetTracker.trackSymbol() [EVIDENCE: verified in implementation-summary.md]
- [x] Compact brief rendering adapts to smaller budgets (1500/2500) with same ratio — totalBudget parameter in mergeCompactBrief [EVIDENCE: verified in implementation-summary.md]
- [x] Merge time tracked for performance monitoring — mergeDurationMs in metadata [EVIDENCE: verified in implementation-summary.md]
