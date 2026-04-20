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
- [ ] `lib/derived/extract.ts` — deterministic n-gram + pattern extraction from full B1 input set (SKILL.md frontmatter/headings/body/examples + references/** headings + assets/** filenames + intent_signals + source_docs + key_files)
- [ ] `lib/derived/provenance.ts` — per-skill fingerprint with named-bucket hash per B1 category
- [ ] Unit tests per B1 category

## T004b — Sanitizer at write boundary (P0, A7 compliance)
- [ ] `lib/derived/sanitizer.ts` wraps `mcp_server/skill-advisor/lib/render.ts::sanitizeSkillLabel`
- [ ] Applied at every write: SQLite insert, graph-metadata.json.derived write, envelope publication, diagnostic emit
- [ ] Regression test: instruction-shaped fixture in SKILL.md / references heading / asset filename → sanitizer rejects, no unsafe row written
- [ ] `sanitizer_version` field populated in derived block

## T004c — Targeted invalidation (P0)
- [ ] Invalidation dependency graph: per-skill fingerprint → which B1 inputs feed it
- [ ] Test per input category: SKILL.md body edit → single-row refresh; references/** heading edit → single-row refresh; asset filename rename → single-row refresh; intent_signals edit → single-row refresh
- [ ] No corpus-wide reindex triggered by single-skill edit

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
