# Iteration 011 — Track B: B3 — Sync model

## Question
On re-index, replace frontmatter `trigger_phrases` in-place? Keep a separate derived index (doesn't touch SKILL.md)? Hybrid (author-authored triggers + auto-derived companions)?

## Evidence Collected
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/spec.md:98`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/spec.md:109` -> Track B's stated goal is keeping `trigger_phrases` and keyword scoring tables fresh, and B3 asks whether re-index should mutate frontmatter, keep a separate derived index, or use a hybrid model.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/research/deep-research-strategy.md:87`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/research/deep-research-strategy.md:94` -> The evidence map scopes B3 to current `trigger_phrases` write locations, the proposed `advisor-index.json` sidecar, and a hybrid explicit-plus-derived option.
- `.opencode/skill/sk-doc/SKILL.md:1`-`.opencode/skill/sk-doc/SKILL.md:8` -> A representative top-level skill frontmatter carries `name`, `description`, `allowed-tools`, and `version`, while routing keywords live in the post-frontmatter HTML `Keywords` comment.
- `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:53`-`.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:105` -> The fast parser reads the frontmatter block and then merges a `<!-- Keywords: ... -->` comment into the in-memory `keywords` field before returning metadata.
- `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:171`-`.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:204` -> Runtime skill records are built from frontmatter name, description, keyword variants, name terms, and description-derived corpus terms, not by rewriting `SKILL.md`.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2434`-`.opencode/skill/skill-advisor/scripts/skill_advisor.py:2449` -> Author-maintained keyword variants get phrase-boundary matching and a 1.0+ direct boost, giving explicit signals a distinct scoring lane.
- `.opencode/skill/sk-doc/graph-metadata.json:27`-`.opencode/skill/sk-doc/graph-metadata.json:47` -> A current skill metadata file separates `intent_signals` from schema-v2 `derived.trigger_phrases`, which already models explicit plus derived routing companions.
- `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:176`-`.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:193` -> The compiler validates schema-v2 `derived` metadata and requires `derived.trigger_phrases`, so derived triggers already have a schema-governed sidecar home.
- `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:211`-`.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:231` -> Derived trigger strings are validated as non-empty strings, and `derived.source_docs` must be skill-relative existing files, supporting provenance-aware derived metadata.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:118`-`.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:129` -> The live SQLite schema stores `intent_signals`, `derived`, `source_path`, `content_hash`, and `indexed_at` per skill node.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:520`-`.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:550` -> Re-indexing skips unchanged content hashes and upserts changed nodes with JSON-encoded `intentSignals` and `derived` inside the graph index transaction.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:180`-`.opencode/skill/skill-advisor/scripts/skill_advisor.py:219` -> The advisor fallback path loads `intent_signals` and `derived.trigger_phrases` from per-skill `graph-metadata.json`.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:281`-`.opencode/skill/skill-advisor/scripts/skill_advisor.py:337` -> The primary SQLite path selects `intent_signals` and `derived` from `skill_nodes` and merges `derived.trigger_phrases` into the routing signal map.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:623`-`.opencode/skill/skill-advisor/scripts/skill_advisor.py:663` -> Graph signal matches are phrase-boundary matched, weighted by phrase specificity, capped at 3.0, and recorded as `(signal)` reasons.
- `.opencode/skill/skill-advisor/tests/test_skill_advisor.py:358`-`.opencode/skill/skill-advisor/tests/test_skill_advisor.py:476` -> Regression coverage builds a temporary SQLite graph with `intent_signals` and `derived.trigger_phrases`, then verifies those graph signals can boost routing above threshold.
- `.opencode/skill/skill-advisor/README.md:43`-`.opencode/skill/skill-advisor/README.md:49` -> The package documents SQLite as the live runtime store, JSON as fallback/export, and the MCP tools as the shared graph access surface.
- `.opencode/skill/skill-advisor/README.md:186`-`.opencode/skill/skill-advisor/README.md:200` -> The documented runtime keeps SKILL.md discovery cached, uses graph-derived boosts from SQLite/JSON, preserves evidence separation, and auto-indexes `.opencode/skill/*/graph-metadata.json`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:136`-`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:160` -> Advisor freshness fingerprints both `SKILL.md` and `graph-metadata.json` for each skill, so stale source-vs-index state can be detected without mutating skill frontmatter.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:253`-`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:263` -> Freshness becomes `stale` when any source mtime is newer than the SQLite artifact and `live` only when SQLite is at least as fresh as the sources.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-009.md:41`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-009.md:52` -> B1 already corrected the premise: current SKILL.md files do not appear to use `trigger_phrases:` YAML; B3 should decide between graph metadata and a separate advisor index.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-010.md:49`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-010.md:60` -> B2 adopted explicit signals first, deterministic derived extraction second, corpus statistics third, and left B3 to settle the storage model.

## Analysis
The safest sync model is hybrid, but not by rewriting `SKILL.md` frontmatter. The current top-level skill surface already treats author-authored signals as separate from generated companions: `SKILL.md` frontmatter supplies identity fields, the HTML `Keywords` comment supplies explicit routing language, and `graph-metadata.json` carries `intent_signals` plus `derived.trigger_phrases`. Replacing author-authored metadata in-place on every re-index would blur that separation, create noisy diffs in human-maintained skill files, and make it harder to tell whether a route came from author intent or extraction.

The repo already has the sidecar shape that B3 needs. Per-skill `graph-metadata.json` is a schema-governed source file, while `skill-graph.sqlite` is the live runtime index with content hashes, derived JSON, and incremental upserts. The advisor already reads `derived.trigger_phrases` from SQLite first and graph metadata fallback second, and tests prove these derived signals affect routing. Adding a separate `advisor-index.json` now would duplicate the same concept without evidence that the current graph metadata plus SQLite boundary is insufficient.

The implementation implication is a two-lane sync contract. Author-authored signals remain in `SKILL.md` and explicit metadata surfaces; generated signals are written to `graph-metadata.json.derived` with provenance fields, then indexed into SQLite after validation. Runtime scoring should keep these lanes distinguishable: explicit keywords and names stay high precision, derived triggers are lower-weight/capped signals, and later B4/B7 safeguards decide how much derived evidence may raise confidence.

This also fits the Track A update model. A source change can mark the advisor stale because freshness fingerprints both `SKILL.md` and `graph-metadata.json`, while the successful derived-metadata refresh and SQLite re-index can restore the live state. That gives Phase 027 a clear consistency boundary without introducing a second sidecar artifact or editing human-owned skill docs during daemon refreshes.

## Verdict
- **Call:** adopt now
- **Confidence:** high
- **Rationale:** Adopt a hybrid explicit-plus-derived model now: preserve author-authored SKILL.md/frontmatter/Keywords signals, write auto-derived companions into schema-v2 `graph-metadata.json.derived`, and let SQLite remain the live advisor index. Reject a new `advisor-index.json` for the first slice because it would duplicate existing graph metadata and SQLite storage.

## Dependencies
B1, B2, B4, B5, B6, B7, A2, A3, A4, C4, C6

## Open follow-ups
B4 must define the exact confidence caps and evidence separation rules for derived signals. B5 must specify whether source changes regenerate `graph-metadata.json.derived` directly or mark it stale for a daemon worker. B6 must decide where corpus DF/IDF statistics live if they should be shared across all skills rather than embedded per skill. C4/C6 should verify whether derived trigger lanes feed the future fusion scorer without adding hook-time latency.

## Metrics
- newInfoRatio: 0.84
- dimensions_advanced: [B]
