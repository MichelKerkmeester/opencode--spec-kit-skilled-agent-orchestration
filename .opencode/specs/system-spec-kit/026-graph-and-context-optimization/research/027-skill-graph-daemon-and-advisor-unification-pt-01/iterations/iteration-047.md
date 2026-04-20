# Iteration 047 — Follow-up Track F: F3 — v1 to v2 derived-block migration protocol

## Question
v1 -> v2 `derived` block migration protocol — big-bang vs daemon-backfill vs hybrid.

## Evidence Collected
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/next-research-paths.md:44-51` → The gap is explicitly the v1-to-v2 `derived` block transition: migration strategy, mixed-version handling, and rollback are all currently unscoped.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/next-research-paths.md:113-115` → F3 is specifically scoped as choosing between big-bang, daemon-backfill, and hybrid migration.
- `.opencode/skill/skill-advisor/feature_catalog/02--graph-system/01-graph-metadata-schema.md:18-20` → The live metadata contract already accepts `schema_version` 1 or 2, and only schema version 2 requires the additive `derived` block.
- `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:108-177` → `validate_skill_metadata()` accepts both schema versions, validates normal graph identity and edges for both, and only runs `validate_derived_metadata()` when `schema_version == 2`.
- `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:182-197` → When v2 is used, `derived` becomes a hard requirement with non-empty trigger/key-topic/key-file/entity/source-doc arrays plus timestamps and causal summary, so the target state is stricter than v1.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:180-219` → The source-metadata fallback loader always loads `intent_signals`, then only extends the signal map with `derived.trigger_phrases` when `derived` is a dict; missing `derived` does not fail the load.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:281-337` → The SQLite runtime loader behaves the same way: it always loads `intent_signals`, and only merges `derived.trigger_phrases` when the stored `derived` JSON exists and parses to an object.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:70-84` → r01's adopted architecture already places `graph-metadata.json.derived` writes in a derived-refresh/provenance worker ahead of the daemon/index transaction, rather than in the prompt-time reader.
- `.opencode/skill/skill-advisor/feature_catalog/02--graph-system/10-auto-indexing.md:18-19` → The live daemon path already does startup scan plus Chokidar watch on `graph-metadata.json`, waits for writes to settle, and reindexes only changed files.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:531-547` → The SQLite indexer skips unchanged hashes and upserts changed nodes with `schema_version`, `intentSignals`, and optional `derived` JSON, so mixed-version metadata can coexist during transition.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-011.md:38-41` → r01 already adopted `graph-metadata.json.derived` as the canonical home for generated companions while keeping author-authored signals separate.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-013.md:39-46` → r01 already adopted a per-skill derived-provenance fingerprint and hash-based freshness split, which gives a natural backfill completion marker for v2 migration.

## Analysis
The current runtime already supports mixed-version reads, which makes a hard big-bang migration unnecessary. The compiler accepts both schema versions and only requires `derived` when a file declares v2, while both the source fallback loader and SQLite loader continue to route from `intent_signals` even when `derived` is absent. That means a v1 skill can remain routable during transition, just without the extra derived-generated lane. `.opencode/skill/skill-advisor/feature_catalog/02--graph-system/01-graph-metadata-schema.md:18-20`, `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:108-177`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py:180-219`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py:281-337`

Pure lazy-on-read is the wrong opposite extreme. r01's adopted architecture already puts `graph-metadata.json.derived` generation in a provenance worker before the daemon/index commit, and the live graph system already has the right background mechanics: debounced `graph-metadata.json` watching plus hash-aware upserts into SQLite. Moving migration writes into prompt-time readers would blur the existing consistency boundary, add write side effects to the hot path, and make freshness harder to reason about than the current "write metadata, then hash-scan and index" contract. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:70-84`, `.opencode/skill/skill-advisor/feature_catalog/02--graph-system/10-auto-indexing.md:18-19`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:531-547`

The best fit is therefore a hybrid protocol: mixed-version read compatibility plus daemon-owned backfill. In phase 1, the runtime accepts v1 and v2 side by side; v1 skills contribute only author-authored lanes, while v2 skills add `derived.trigger_phrases` and the rest of the provenance block. In phase 2, a startup scan or debounced daemon job rewrites each eligible v1 file to schema v2 by adding the derived block only, preserving author-authored fields and letting the existing hash/index transaction publish the change. That aligns with r01's adopted storage model (`graph-metadata.json.derived`) and its provenance-fingerprint freshness rules, while also leaving F4 a clean rollback path because authored fields were never overwritten. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-011.md:38-41`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-013.md:39-46`, `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:182-197`

## Verdict
- **Call:** adopt now
- **Confidence:** high
- **Rationale:** Use a hybrid migration now: keep readers compatible with both schema versions, but make the daemon/backfill worker the only writer that upgrades v1 metadata to v2 by adding `derived` additively and then reindexing through the existing hash-aware SQLite path.

## Dependencies
B3, B5, A5, A8, D5, D7, F2, F4, F5

## Open follow-ups
- Define the exact transition status surface for v1 skills during migration (`no-derived`, `stale-derived`, or equivalent) so routing and diagnostics stay explicit.
- Decide whether automatic backfill runs only on startup/full scan or also on incremental touch of a v1 file that still lacks `derived`.
- Specify whether the backfill writer emits an audit artifact or backup marker before the first automatic v1 -> v2 rewrite on shared repos.

## Metrics
- newInfoRatio: 0.55
- dimensions_advanced: [F]
