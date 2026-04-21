<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
---
title: "027/002 — Tasks"
description: "Task breakdown for lifecycle + derived metadata."
trigger_phrases:
  - "027/002 tasks"
  - "lifecycle derived metadata tasks"
  - "skill graph daemon advisor unification lifecycle tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/003-lifecycle-and-derived-metadata"
    last_updated_at: "2026-04-20T15:49:40Z"
    last_updated_by: "codex"
    recent_action: "Completed task ladder"
    next_safe_action: "Review local commit and push after orchestrator verification"
    blockers: []
    key_files:
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:97dc99c6d70ab892a42b01f14ad4787e9de5a46d70307ce398157ffb0e0b6e25"
      session_id: "027-002-implementation-r01"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Task ladder completed without push per orchestrator instruction"
---
# 027/002 Tasks

<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:tasks -->
## T001 — Scaffold
- [x] Packet files written

## T002 — Read research + predecessor
- [x] Read research.md §5 + §13.3 + §13.5 Y1/Y3
- [x] Read 027/001 implementation-summary + freshness module
- [x] Read iteration files 009-015, 045-049, 056, 058

## T003 — Schema v2 `derived` block (P0)
- [x] Zod schema under `schemas/skill-derived-v2.ts`
- [x] Validator + migration types
- [x] Documentation block in schema file

## T004 — Extraction pipeline (P0)
- [x] `lib/derived/extract.ts` — deterministic n-gram + pattern extraction from full B1 input set (SKILL.md frontmatter/headings/body/examples + references/** headings + assets/** filenames + intent_signals + source_docs + key_files)
- [x] `lib/derived/provenance.ts` — per-skill fingerprint with named-bucket hash per B1 category
- [x] Unit tests per B1 category

## T004b — Sanitizer at write boundary (P0, A7 compliance)
- [x] `lib/derived/sanitizer.ts` wraps `mcp_server/skill-advisor/lib/render.ts::sanitizeSkillLabel`
- [x] Applied at every write: SQLite insert, graph-metadata.json.derived write, envelope publication, diagnostic emit
- [x] Regression test: instruction-shaped fixture in SKILL.md / references heading / asset filename → sanitizer rejects, no unsafe row written
- [x] `sanitizer_version` field populated in derived block

## T004c — Targeted invalidation (P0)
- [x] Invalidation dependency graph: per-skill fingerprint → which B1 inputs feed it
- [x] Test per input category: SKILL.md body edit → single-row refresh; references/** heading edit → single-row refresh; asset filename rename → single-row refresh; intent_signals edit → single-row refresh
- [x] No corpus-wide reindex triggered by single-skill edit

## T005 — Trust lanes + anti-stuffing (P0)
- [x] `lib/derived/trust-lanes.ts` — explicit_author vs derived_generated
- [x] `lib/derived/anti-stuffing.ts` — caps + demotions + gold-none gate
- [x] Adversarial fixture tests

## T006 — Lifecycle primitives (P0)
- [x] `lib/lifecycle/age-haircut.ts` — advisor-side derived-lane decay
- [x] `lib/lifecycle/supersession.ts` — asymmetric routing
- [x] `lib/lifecycle/archive-handling.ts` — z_archive/z_future exclusion
- [x] `lib/lifecycle/schema-migration.ts` — v1↔v2 additive + rollback

## T007 — Corpus stats (P1)
- [x] `lib/corpus/df-idf.ts` — repo-level DF/IDF baseline
- [x] Startup recompute + debounced update hook

## T008 — Integration with daemon (P0)
- [x] Watcher fires re-index → derived refresh → generation bump
- [x] End-to-end test under 10s

## T009 — Lifecycle fixtures for 027/003 (P1)
- [x] Export `tests/fixtures/lifecycle/` — superseded/archived/rolled-back/mixed-version
- [x] Smoke test that fixtures consume cleanly

## T010 — Verify
- [x] Focused vitest suite green
- [x] TS build clean
- [x] Mark checklist.md [x]
- [x] Update 002 implementation-summary.md

## T011 — Commit + push
- [x] Local commit prepared; push intentionally skipped per orchestrator instruction
<!-- /ANCHOR:tasks -->
