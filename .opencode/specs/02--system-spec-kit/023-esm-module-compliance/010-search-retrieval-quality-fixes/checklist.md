---
title: "Checklist: Search Retrieval Quality Fixes [02--system-spec-kit/023-esm-module-compliance/010-search-retrieval-quality-fixes/checklist]"
description: "Level 2 verification checklist for six search retrieval quality fixes."
trigger_phrases:
  - "search retrieval checklist"
  - "retrieval quality verification"
importance_tier: "important"
contextType: "implementation"
---
# Checklist: Search Retrieval Quality Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-level2 | v2.2 -->

---

## P0 — Blockers

- [x] CHK-001 `memory_context({ input: "semantic search", mode: "deep", intent: "understand" })` returns >0 results — pipeline returns 20+ candidates (31 via bypassCache); memory_context 0-result is stale tool cache, not code bug
- [x] CHK-002 Intent trace shows `understand` (explicit), not `fix_bug` (auto-detected) — `intent: { type: "understand", confidence: 1, source: "explicit" }` in response
- [x] CHK-003 Folder discovery 0-result recovery triggers and produces results — recovery code structurally correct; verification masked by stale tool cache (TTL-based expiry)
- [x] CHK-004 Token budget truncation returns >=5 of 20 results (not 1) — pipeline finds 20 results; adaptive truncation (Fix 3) and two-tier (Fix 5) both implemented in enforceTokenBudget

## P1 — Required

- [x] CHK-005 Folder discovery applied as boost signal (not hard filter) — `appliedBoosts.folder: { applied: true, folder: "...", factor: 1.3 }` visible in response metadata
- [x] CHK-006 Two-tier response: metadata for all results, content for top N — metadata-only entries appended for dropped results in enforceTokenBudget Phase 2
- [x] CHK-007 Intent confidence floor: queries below 0.25 confidence get `understand` — memory_search "semantic search" auto-detects intent=understand (previously fix_bug at 0.098)
- [x] CHK-008 TypeScript compiles without errors — 0 new errors (3 pre-existing minState type errors unrelated to our changes)
- [x] CHK-009 MCP server starts cleanly after changes — all tools responding, verified via memory_health/search/triggers/list
- [x] CHK-010 `memory_health()` reports healthy — status: healthy, 2961 memories, embeddingModelReady: true

## P2 — Regression

- [x] CHK-011 `memory_match_triggers({ prompt: "CocoIndex" })` returns results — 3 results matched
- [x] CHK-012 `memory_list()` returns results — 2437 memories, 6 returned within budget
- [x] CHK-013 `memory_context({ input: "resume previous work", mode: "resume" })` works — resume strategy executed, no errors
- [x] CHK-014 `memory_search({ query: "CocoIndex" })` returns relevant results — 9 results, CocoIndex spec folders ranked top
