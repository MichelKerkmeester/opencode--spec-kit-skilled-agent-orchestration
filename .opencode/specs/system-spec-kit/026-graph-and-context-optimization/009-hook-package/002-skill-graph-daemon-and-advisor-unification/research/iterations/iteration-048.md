# Iteration 048 — Follow-up Track F: F4 — v2 to v1 rollback path

## Question
Rollback path — demote v2 to v1 without losing author-authored fields.

## Evidence Collected
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/next-research-paths.md:44-51` → The schema-migration gap explicitly includes rollback: if the v2 `derived` block breaks something, the project needs a way to demote back to v1 without losing author-authored fields.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/next-research-paths.md:113-115` → F4 is specifically scoped as the rollback-path decision for v2 to v1.
- `.opencode/skill/skill-advisor/feature_catalog/02--graph-system/01-graph-metadata-schema.md:16-20` → The current skill-metadata contract accepts `schema_version` 1 or 2, and only schema version 2 adds the `derived` metadata block on top of the baseline skill identity and edges contract.
- `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:108-177` → `validate_skill_metadata()` accepts both schema versions, validates `domains` and `intent_signals` for all skills, and only invokes `validate_derived_metadata()` when `schema_version == 2`.
- `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:182-201` → For v2, `derived` is mandatory and must include non-empty generated fields plus timestamps, confirming that the stricter part of the schema is isolated inside the additive `derived` block.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:180-219` → The source-metadata fallback loader always loads `intent_signals` first and only merges `derived.trigger_phrases` when `derived` is a dict; missing `derived` does not break routing from authored signals.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:281-337` → The SQLite runtime path mirrors that behavior: it always loads `intent_signals` and only extends the signal map from `derived.trigger_phrases` when stored `derived` JSON exists and parses cleanly.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:278-287` → The TypeScript indexer treats schema v1 as `derived`-optional (`return isRecord(value) ? value : null`) and only throws for missing `derived` when `schemaVersion !== 1`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:360-380` → Parsed skill metadata persists `schemaVersion`, `domains`, `intentSignals`, and `derived` as separate fields, so authored fields are not structurally coupled to the generated block.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:540-551` → SQLite upserts write `schema_version`, `intent_signals`, and `derived` into separate columns, which means a rollback can remove or null `derived` while keeping the authored lane intact.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-011.md:29-41` → r01 already adopted the hybrid model: author-authored signals stay separate, and generated companions belong in `graph-metadata.json.derived` rather than replacing human-owned metadata.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-013.md:35-47` → r01 also adopted a provenance/freshness model where derived-trigger freshness is tracked separately from the durable authored graph row, which provides a natural rollback boundary.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:123-126,138-140,155` → The implementation roadmap and risk register already preserve compatibility shims and parity harnesses during migration, so rollback should favor a reversible metadata demotion rather than a destructive rewrite of legacy surfaces.

## Analysis
The repo already has the crucial property that makes rollback tractable: authored routing data and generated routing data are stored separately. The metadata schema accepts both v1 and v2, the validator only requires `derived` for v2, and both the Python source-loader and SQLite runtime loader continue to route from authored `intent_signals` even when `derived` is absent. That means a rollback does not need to reconstruct lost author intent from generated data; it can simply stop exposing the derived-generated lane while preserving the original authored lane exactly as-is. `.opencode/skill/skill-advisor/feature_catalog/02--graph-system/01-graph-metadata-schema.md:16-20`, `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:108-177`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py:180-219`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py:281-337`

The storage layer reinforces that separation. The TypeScript indexer parses and stores `schemaVersion`, `intentSignals`, and `derived` independently, and its v1 path already tolerates null or missing `derived`. SQLite upserts also write `intent_signals` and `derived` into separate columns. So the clean rollback contract is not "rewrite the skill back to some old combined form"; it is "preserve authored metadata verbatim, demote the schema marker to v1, and drop or ignore the derived block before reindexing." In practice, that means the only capability lost during rollback is the derived-generated routing lane and its provenance metadata, not the authored routing surface or the graph identity/edge model. `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:278-287`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:360-380`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:540-551`

That recommendation also aligns with the packet's earlier adopted design. r01 already chose the hybrid explicit-plus-derived model and made provenance/freshness a separate concern for the derived lane. So rollback should follow the same asymmetry in reverse: treat v2 as an additive enhancement that can be safely peeled away, not as a new canonical source of truth. The adopt-now path is therefore a daemon-owned, reversible demotion: snapshot the current v2 file content for auditability, rewrite only the schema marker and `derived` block, reindex through the existing hash-aware pipeline, and keep compatibility surfaces alive while parity and migration risks are evaluated. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-011.md:29-41`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-013.md:35-47`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:123-126,138-140,155`

## Verdict
- **Call:** adopt now
- **Confidence:** high
- **Rationale:** Define rollback now as an additive demotion: preserve authored metadata unchanged, remove or ignore the `derived` block, set `schema_version` back to 1, and reindex through the existing pipeline. That cleanly disables the generated lane without losing author-authored routing data.

## Dependencies
B3, B5, D7, F2, F3

## Open follow-ups
- Specify whether the rollback writer keeps the old `derived` payload only in an audit backup/log or also in a non-routable on-disk tombstone for operator recovery.
- Define the exact operator-facing status surface after rollback (`rolled_back`, `derived-disabled`, or equivalent) so freshness/status tools do not present a downgraded skill as ordinary v1.
- Align F5 archive handling and F2 supersession handling so rollback does not get conflated with deprecation or archival lifecycle states.

## Metrics
- newInfoRatio: 0.49
- dimensions_advanced: [F]
