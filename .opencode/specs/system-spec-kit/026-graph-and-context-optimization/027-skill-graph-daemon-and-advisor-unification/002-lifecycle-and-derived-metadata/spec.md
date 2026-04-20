---
title: "Feature Specification: 027/002 — Lifecycle + Derived Metadata"
description: "Derived keyword extraction with trust lanes + provenance fingerprints, schema-v2 `derived` block + v1→v2 additive backfill + rollback, age/status haircuts, asymmetric supersession, z_archive/z_future split, DF/IDF corpus stats, anti-stuffing caps."
trigger_phrases:
  - "027/002"
  - "derived metadata"
  - "lifecycle normalization"
  - "schema v2"
  - "supersession"
  - "anti-stuffing"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/002-lifecycle-and-derived-metadata"
    last_updated_at: "2026-04-20T14:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Scaffolded 027/002 packet"
    next_safe_action: "Land 027/001 then dispatch /spec_kit:implement :auto on 027/002"
    blockers:
      - "027/001 must land first (daemon + freshness + lease are prerequisites)"
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/"
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/lifecycle/"
      - ".opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/corpus/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-002-scaffold-r01"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: 027/002 — Lifecycle + Derived Metadata

<!-- SPECKIT_LEVEL: 2 -->

## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-20 |
| **Parent** | `../` |
| **Predecessor** | `../001-daemon-freshness-foundation/` |
| **Research source** | `research.md` §5 Track B + §13.3 Track F + §13.5 Y1/Y3; iterations 009-015, 045-049, 056, 058 |

## 2. PROBLEM & PURPOSE

### Problem
Trigger phrases + keywords rot as authors edit skills. There's no mechanism to auto-derive keywords from content, no trust-lane separation to keep derived signals from masquerading as author intent, no lifecycle handling for aged / superseded / archived skills, and no schema-migration path for the `derived` block. Without this, the 5-lane scorer in 027/003 has no lifecycle-normalized inputs to fuse (Y3 hard prerequisite).

### Purpose
Produce normalized, provenance-tagged derived metadata + lifecycle-aware skill state so 027/003 can fuse honestly. Establish schema-v2 `derived` block with additive backfill + rollback, age/status haircuts applied ONLY to the derived lane, asymmetric supersession routing, `z_archive`/`z_future` split, DF/IDF corpus stats, anti-stuffing defenses.

## 3. SCOPE

### In Scope
- `lib/derived/extract.ts` — deterministic TS n-gram + pattern extraction from SKILL.md body + headings + `references/**` headings + `graph-metadata.json.intent_signals`. No embeddings in hot path. Commit messages excluded from first slice.
- `lib/derived/provenance.ts` — per-skill fingerprint over B1 inputs; dependency graph so targeted invalidation works.
- `lib/derived/trust-lanes.ts` — `explicit_author` vs `derived_generated` lane separation; caps + haircuts before fusion.
- `lib/derived/anti-stuffing.ts` — cardinality limits + repetition-density + suspicious-pattern demotions + gold-`none` gate.
- `lib/lifecycle/age-haircut.ts` — discrete advisor-side age/status decay on derived lane only.
- `lib/lifecycle/supersession.ts` — asymmetric routing (successor wins implicit; explicit old-name surfaces redirect).
- `lib/lifecycle/archive-handling.ts` — `z_archive/` + `z_future/` indexed but excluded from routing + corpus stats.
- `lib/lifecycle/schema-migration.ts` — v1↔v2 additive backfill + rollback; mixed-version reads during transition.
- `lib/corpus/df-idf.ts` — repo-level DF/IDF baseline, recomputed on startup + debounced graph changes.
- Schema-v2 `derived` block shape defined + documented (fields: `trigger_phrases[]`, `keywords[]`, `provenance_fingerprint`, `generated_at`, `source_docs[]`, `trust_lane: "derived_generated"`).
- Tests under `mcp_server/skill-advisor/tests/derived/`, `tests/lifecycle/`, `tests/corpus/`.

### Out of Scope
- Daemon / freshness primitives (027/001).
- Scoring fusion / parity harness (027/003).
- MCP tool exposure (027/004).
- Embeddings or learned ranking (027/006).

## 4. REQUIREMENTS

### 4.1 P0 (Blocker)
1. Derived extraction pipeline deterministic + regenerable from documented inputs.
2. Trust-lane separation: `explicit_author` vs `derived_generated`. Author intent never decays.
3. Schema-v2 `derived` block spec published + validators implemented; v1→v2 backfill is additive; rollback is additive strip.
4. Mixed-version reads during migration: v1 skills routable while v2 skills gain `derived`.
5. Supersession asymmetry: successor wins implicit routing; explicit old-name surfaces deprecated skill + redirect metadata.
6. `z_archive` + `z_future` excluded from default routing + corpus stats.
7. Anti-stuffing caps enforced before `derived_generated` can contribute to scoring.

### 4.2 P1 (Required)
1. Provenance fingerprint per skill; changes to B1 inputs invalidate derived rows.
2. Age haircut applied to `derived_generated` lane only (advisor-side, not data-side).
3. DF/IDF corpus stats recomputed on startup + debounced graph change.
4. Rollback tooling: strip v2 `derived`, reset `schema_version`, reindex.
5. Lifecycle fixtures for 027/003 parity (superseded / archived / rolled-back / mixed-version) exposed via test fixtures export.

### 4.3 P2 (Suggestion)
1. Commit-message signal (deferred from B1).
2. Adversarial fixture library growth.
3. Debounced DF/IDF warm-cache.

## 5. ACCEPTANCE SCENARIOS

1. **AC-1** Edit a SKILL.md body; daemon (027/001) fires re-index; `derived` block refreshed with new provenance fingerprint.
2. **AC-2** Author-authored `trigger_phrases` frontmatter never overwritten during derived refresh.
3. **AC-3** Stuffed SKILL.md (keyword repetition > threshold) → `derived_generated` lane contribution capped/demoted.
4. **AC-4** v1 skill + v2 skill coexist during migration; both routable; `derived` only consumed for v2.
5. **AC-5** Rollback: v2 → v1 additive strip preserves author-authored fields, removes `derived`.
6. **AC-6** `sk-X-v1` superseded by `sk-X-v2`; default routing picks v2; explicit prompt naming `sk-X-v1` surfaces v1 with redirect note.
7. **AC-7** `z_archive/` and `z_future/` skills: present in `skill_nodes`, excluded from `advisor_recommend` default results, excluded from corpus stats.
8. **AC-8** DF/IDF baseline updates on graph change; cold start re-baseline completes under 5s for current skill set.

## 6. FILES TO CHANGE

### New (under `mcp_server/skill-advisor/`)
- `lib/derived/{extract,provenance,trust-lanes,anti-stuffing}.ts`
- `lib/lifecycle/{age-haircut,supersession,archive-handling,schema-migration}.ts`
- `lib/corpus/df-idf.ts`
- `schemas/skill-derived-v2.ts` — Zod schema for v2 `derived` block
- `tests/derived/{extract,provenance,trust-lanes,anti-stuffing}.vitest.ts`
- `tests/lifecycle/{age-haircut,supersession,archive-handling,schema-migration}.vitest.ts`
- `tests/corpus/df-idf.vitest.ts`
- `tests/fixtures/lifecycle/` — export superseded/archived/mixed-version fixtures for 027/003

### Modified
- `.opencode/skill/**/graph-metadata.json` — schema touched by daemon backfill (no manual edits)
