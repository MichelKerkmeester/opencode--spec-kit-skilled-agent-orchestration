---
title: ".../009-hook-daemon-parity/001-skill-advisor-hook-surface/003-advisor-freshness-and-source-cache/implementation-summary]"
description: "Implemented getAdvisorFreshness() with per-skill fingerprints, generation-tagged snapshots, 15-minute LRU source cache, JSON fallback stale contract, and corrupt generation recovery."
trigger_phrases:
  - "020 003 summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/003-advisor-freshness-and-source-cache"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Implemented advisor freshness + source cache"
    next_safe_action: "Dispatch 020/004 advisor brief producer + cache policy"
    blockers: []
    key_files: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
---
# Implementation Summary: Advisor Freshness + Source Cache

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-advisor-freshness-and-source-cache |
| **Completed** | 2026-04-19 |
| **Level** | 2 |
| **Parent** | `../spec.md` |
| **Predecessor** | `../002-shared-payload-advisor-contract/` |
| **Position in train** | 2 of 8 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented `getAdvisorFreshness(workspaceRoot)` in a new `mcp_server/lib/skill-advisor/` module. The probe walks the advisor authority list, computes a source signature from path/mtime/size facts, returns per-skill fingerprints keyed by skill slug, projects freshness onto the shared advisor envelope freshness vocabulary, and tags each snapshot with a workspace-scoped generation counter.

The cache layer is a bounded 15-minute LRU with 16-entry capacity. Cache entries are keyed by workspace root, source signature, and generation so skill edits, deleted/renamed skills, graph rebuilds, and JSON fallback changes cannot reuse stale results.

The generation layer persists `.opencode/skill/.advisor-state/generation.json` with temp-file plus rename atomic writes. Malformed counters recover atomically on writable filesystems, degrade the first probe away from `live`, and fail closed to `unavailable` with `GENERATION_COUNTER_CORRUPT` when regeneration cannot complete.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts` | Created | Advisor freshness entry point, authority walk, state mapping, fingerprints, cache/generation wiring |
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/source-cache.ts` | Created | 15-minute TTL LRU cache with 16-entry bound |
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/generation.ts` | Created | Workspace generation counter with atomic write and corrupt-counter recovery |
| `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-freshness.vitest.ts` | Created | AS1-AS10 coverage plus cold/warm benchmark |
| `.gitignore` | Updated | Ignores transient `.opencode/skill/.advisor-state/` |
| `tasks.md` | Updated | Marked implementation and verification tasks with evidence |
| `checklist.md` | Updated | Marked checklist items with verification evidence |
| `implementation-summary.md` | Updated | Recorded delivery details and verification results |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation mirrors the non-mutating `getGraphFreshness()` display-check pattern from `mcp_server/lib/code-graph/ensure-ready.ts`, but uses advisor-specific authorities instead of code-graph tracked files. `AdvisorFreshnessState` is derived from `AdvisorEnvelopeMetadata['freshness']` in `lib/context/shared-payload.ts` so the child 004 producer consumes the predecessor contract directly.

State mapping:
- `live`: SQLite artifact exists and is newer than all advisor sources.
- `stale`: SQLite artifact exists but a source is newer, JSON fallback is the only available artifact, or a corrupt generation counter was recovered.
- `absent`: required advisor sources or the preferred artifact are missing with no fallback.
- `unavailable`: source probing fails or generation counter recovery cannot write a valid counter.

Deleted and renamed skills are naturally suppressed because every probe rebuilds the current skill slug map before cache lookup; cache keys include the current source signature and generation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

Inherits ADR-002 (pattern reuse from code-graph) + ADR-003 (fail-open) from parent `../decision-record.md`.

- Used `AdvisorEnvelopeMetadata['freshness']` from `shared-payload.ts` as the public freshness type instead of redefining the state vocabulary.
- Treated JSON fallback as `state: "stale"` with `fallbackMode: "json"` so degraded exports never appear live.
- Kept corrupt generation recovery out of cache reuse; the first recovered probe is forced non-live with `GENERATION_COUNTER_RECOVERED`.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate | Command | Result |
|------|---------|--------|
| Advisor freshness scenarios | `npx vitest run advisor-freshness --reporter verbose` | PASS — 11 tests |
| Code-graph freshness no regression | `npx vitest run ensure-ready code-graph-siblings-readiness` | PASS — 19 tests |
| TypeScript | `npx tsc --noEmit` | PASS |

Benchmark command: `npx vitest run advisor-freshness --reporter verbose`

| Probe | p50 | p95 | p99 |
|-------|----:|----:|----:|
| Cold | 0.073 ms | 0.082 ms | 0.263 ms |
| Warm | 0.073 ms | 0.090 ms | 0.091 ms |

Acceptance coverage:
- AS1 live state round-trip
- AS2 stale on SKILL.md edit
- AS3 absent on missing SQLite artifact
- AS4 unavailable on probe failure
- AS5 deleted-skill suppression
- AS6 JSON fallback stale
- AS7 generation increment after rebuild signal
- AS8 source cache hit and signature invalidation
- AS9 corrupt generation writable recovery
- AS10 corrupt generation unrecoverable fail-closed
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

No production caller is wired yet; child 004 owns `buildSkillAdvisorBrief()` producer integration and downstream cache policy.
<!-- /ANCHOR:limitations -->
