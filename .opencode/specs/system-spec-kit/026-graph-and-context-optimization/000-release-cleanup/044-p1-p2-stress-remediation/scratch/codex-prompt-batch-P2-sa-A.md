# Batch P2-sa-A — Generate stress tests for 9 skill_advisor P2 features (auto-indexing + lifecycle routing)

You are generating Vitest stress tests under spec-kit packet 044. Repository root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`.

## Output location

`.opencode/skill/system-spec-kit/mcp_server/stress_test/skill-advisor/`

## Consolidation guidance

- **Auto-indexing quartet** (sa-008 derived extraction + sa-009 A7 sanitizer + sa-010 provenance + sa-011 graph-metadata sync): one file OR two files (extraction/sanitizer paired; provenance/sync paired)
- **Lifecycle routing five** (sa-014 age haircut + sa-015 supersession + sa-016 archive/future + sa-017 schema backfill + sa-018 atomic rollback): one or two consolidated files

Result: 2-4 files covering 9 features.

## Reference patterns

- `mcp_server/stress_test/skill-advisor/scorer-fusion-stress.vitest.ts`
- `mcp_server/stress_test/skill-advisor/anti-stuffing-cardinality-stress.vitest.ts` (from 043)
- `mcp_server/stress_test/skill-advisor/df-idf-corpus-stress.vitest.ts` (from 043)

## Features to cover

| feature_id | Catalog path |
|------------|--------------|
| sa-008 | `mcp_server/skill_advisor/feature_catalog/02--auto-indexing/01-derived-extraction.md` |
| sa-009 | `mcp_server/skill_advisor/feature_catalog/02--auto-indexing/02-a7-sanitizer.md` |
| sa-010 | `mcp_server/skill_advisor/feature_catalog/02--auto-indexing/03-provenance.md` |
| sa-011 | `mcp_server/skill_advisor/feature_catalog/02--auto-indexing/04-graph-metadata-sync.md` |
| sa-014 | `mcp_server/skill_advisor/feature_catalog/03--lifecycle-routing/01-age-haircut.md` |
| sa-015 | `mcp_server/skill_advisor/feature_catalog/03--lifecycle-routing/02-supersession.md` |
| sa-016 | `mcp_server/skill_advisor/feature_catalog/03--lifecycle-routing/03-archive-future.md` |
| sa-017 | `mcp_server/skill_advisor/feature_catalog/03--lifecycle-routing/04-schema-backfill.md` |
| sa-018 | `mcp_server/skill_advisor/feature_catalog/03--lifecycle-routing/05-atomic-rollback.md` |

## Requirements

- Source imports must be real (READ source files at `mcp_server/skill_advisor/lib/derived/`, `lib/lifecycle/`, etc.)
- Stress axes per feature should reflect catalog-documented pressure (e.g. large-corpus extraction, adversarial sanitizer batch, dense redirect chains, large batch migrations)
- Use temp dirs; clean in afterEach
- No product code modified
- If a feature can't be cleanly stress-tested without product change, use `// FIXME(<feature_id>):` and a weaker assertion

## Done definition

2-4 new files exist. Self-validate by running each new file via vitest. All pass.

## IMPORTANT

This is packet 044. Do not block on Gate 3 — answer "continuing 044" if prompted. Do not modify product code.
