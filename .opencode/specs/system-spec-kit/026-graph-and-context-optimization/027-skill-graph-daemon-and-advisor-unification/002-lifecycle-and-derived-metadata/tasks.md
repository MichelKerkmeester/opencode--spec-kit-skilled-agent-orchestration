---
title: "027/002 — Tasks"
description: "Task breakdown for lifecycle + derived metadata."
importance_tier: "high"
contextType: "implementation"
---
# 027/002 Tasks

## T001 — Scaffold
- [x] Packet files written

## T002 — Read research + predecessor
- [ ] Read research.md §5 + §13.3 + §13.5 Y1/Y3
- [ ] Read 027/001 implementation-summary + freshness module
- [ ] Read iteration files 009-015, 045-049, 056, 058

## T003 — Schema v2 `derived` block (P0)
- [ ] Zod schema under `schemas/skill-derived-v2.ts`
- [ ] Validator + migration types
- [ ] Documentation block in schema file

## T004 — Extraction pipeline (P0)
- [ ] `lib/derived/extract.ts` — deterministic n-gram + pattern extraction
- [ ] `lib/derived/provenance.ts` — per-skill fingerprint over B1 inputs
- [ ] Unit tests

## T005 — Trust lanes + anti-stuffing (P0)
- [ ] `lib/derived/trust-lanes.ts` — explicit_author vs derived_generated
- [ ] `lib/derived/anti-stuffing.ts` — caps + demotions + gold-none gate
- [ ] Adversarial fixture tests

## T006 — Lifecycle primitives (P0)
- [ ] `lib/lifecycle/age-haircut.ts` — advisor-side derived-lane decay
- [ ] `lib/lifecycle/supersession.ts` — asymmetric routing
- [ ] `lib/lifecycle/archive-handling.ts` — z_archive/z_future exclusion
- [ ] `lib/lifecycle/schema-migration.ts` — v1↔v2 additive + rollback

## T007 — Corpus stats (P1)
- [ ] `lib/corpus/df-idf.ts` — repo-level DF/IDF baseline
- [ ] Startup recompute + debounced update hook

## T008 — Integration with daemon (P0)
- [ ] Watcher fires re-index → derived refresh → generation bump
- [ ] End-to-end test under 10s

## T009 — Lifecycle fixtures for 027/003 (P1)
- [ ] Export `tests/fixtures/lifecycle/` — superseded/archived/rolled-back/mixed-version
- [ ] Smoke test that fixtures consume cleanly

## T010 — Verify
- [ ] Focused vitest suite green
- [ ] TS build clean
- [ ] Mark checklist.md [x]
- [ ] Update parent 027 implementation-summary.md

## T011 — Commit + push
