# Iteration 036 — Track S: S1 — Architectural sketch

## Question
Architectural sketch (R2 — unified data flow diagram-as-text) for the Phase 027 Skill-Graph Daemon + Advisor Unification research.

## Evidence Collected
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/deep-research-strategy.md:58` → Iteration 36 is assigned to "Architectural sketch (R2 — unified data flow diagram-as-text)" as a synthesis intermediate.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/deep-research-strategy.md:123`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/deep-research-strategy.md:124` → Synthesis intermediates should each produce one complete synthesis artifact that final synthesis can concatenate and deduplicate.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/deep-research-config.json:66`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/deep-research-config.json:70` → Config confirms X1-X4 followed by S1 "Architectural sketch."
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/deep-research-state.jsonl:34`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/deep-research-state.jsonl:37` → Cross-track outcomes are X1 coherent, X2 coherent, X3 needs-adjustment, and X4 coherent.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-002.md:43`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-002.md:48` → A2 adopts two-tier daemon scope: watch `graph-metadata.json` now, and use `SKILL.md`, `derived.source_docs`, and `derived.key_files` for targeted derived-metadata invalidation.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-003.md:37`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-003.md:46` → A3 adopts the TypeScript SQLite hash-aware incremental indexer as the daemon default, while reserving full re-index for explicit recovery or schema maintenance.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-004.md:43`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-004.md:55` → A4 makes a single SQLite graph transaction the consistency boundary and publishes freshness/generation/cache invalidation only after successful commit.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-008.md:46`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-008.md:53` → A8 adds WAL, watcher-race, writer-coordination, `SQLITE_BUSY`, stale/unavailable freshness, fail-open, and rebuild-from-source requirements.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-009.md:34`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-009.md:46` → B1 defines the signal source hierarchy: explicit author-maintained metadata is high precision, structured local extraction can feed lower-weight derived candidates, and body text/commit messages are not first-tier triggers.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-011.md:29`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-011.md:41` → B3 adopts a hybrid explicit-plus-derived sync model: keep author signals in `SKILL.md` and explicit metadata, write generated signals to `graph-metadata.json.derived`, and use SQLite as the live advisor index.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-012.md:33`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-012.md:44` → B4 requires explicit and derived evidence separation, lower caps/haircuts for derived evidence, dual-threshold discipline, and corpus-gated precision checks.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-013.md:34`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-013.md:46` → B5 reuses A3's graph/content-hash authority and adds a per-skill derived-provenance fingerprint for B1 inputs inside `graph-metadata.json.derived`.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-017.md:37`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-017.md:49` → C2 maps memory retrieval concepts to an advisor-specific `AdvisorSkillDocument`/`SkillSearchRecord` projection while keeping canonical skills out of `memory_index`.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-018.md:32`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-018.md:44` → C3 adopts causal-style skill traversal over `skill_edges` and rejects direct `memory_causal_link` reuse for skills.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-019.md:45`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-019.md:57` → C4 adopts analytical advisor fusion: centralized score mutation, normalized channels, graph/causal caps, confidence separated from structural trust, and learned fusion as shadow-only.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-021.md:39`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-021.md:51` → C6 keeps deterministic lexical/trigger plus skill-graph SQL work in the hot path and treats embedding/hybrid lookup as prototype/shadow.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-025.md:55`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-025.md:67` → D2 adopts an MCP-native target layout: `lib/skill-graph/` remains the graph plane, `lib/skill-advisor/` gains runtime/scoring/projection modules, and `handlers/skill-advisor/` plus `tools/advisor-tools.ts` expose the advisor plane.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-026.md:44`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-026.md:90` → D3 adopts `advisor_recommend`, `advisor_status`, and `advisor_validate` as a small MCP tool family and defers `advisor_batch`.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-027.md:48`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-027.md:60` → D4 adopts native TypeScript scoring over PyOdide, with the Python subprocess kept only as a staged compatibility bridge until corpus parity.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-028.md:42`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-028.md:54` → D5 shares bounded-cache/source-signature/generation primitives but keeps advisor prompt-result caching domain-specific for privacy and latency.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-030.md:65`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-030.md:72` → D7 keeps `skill_advisor.py` as a backward-compatible shim while native MCP/TypeScript becomes authoritative.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-031.md:32`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-031.md:44` → D8 keeps the OpenCode plugin and bridge as runtime adapters, routing backend behavior to native advisor/`advisor_recommend` after consolidation.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-032.md:34`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-032.md:39` → X1 finds A×B coherent if B reuses A3's graph/SQLite boundary and adds per-skill derived-provenance fingerprints rather than a separate advisor index or broad watcher.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-033.md:34`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-033.md:46` → X2 finds A×C coherent because A's SQLite transaction rebuilds the `skill_edges` C needs and C keeps causal behavior over the committed skill graph.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-034.md:41`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-034.md:50` → X3 needs one adjustment: derived keywords must enter C's scorer as a separate capped/provenance-aware lane, not as direct `(signal)` intent boosts.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-035.md:34`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-035.md:46` → X4 finds C×D coherent: skill topology stays in `lib/skill-graph`, advisor matching lives in `lib/skill-advisor` plus new `advisor_*` handlers/tools, and memory MCP search/fusion remains a pattern rather than the physical module home.

## Analysis
The unified architecture is a two-plane system with one committed graph boundary and one advisor projection/scoring boundary. The daemon watches and refreshes skill metadata in two tiers: `graph-metadata.json` changes drive the immediate skill-graph index path, while `SKILL.md`, `derived.source_docs`, and `derived.key_files` changes mark or regenerate derived metadata through a provenance fingerprint before the refreshed derived block becomes durable graph input. The authoritative mutation is the SQLite transaction over `skill_nodes` and `skill_edges`; freshness, generation, and cache invalidation happen only after commit, and failures degrade to stale/unavailable/fail-open states rather than exposing partial topology.

```text
Skill source files
  - SKILL.md identity / explicit keywords
  - references, assets, key files, source docs
  - graph-metadata.json intent_signals + derived block
        |
        v
Derived refresh / provenance worker
  - structured extraction from approved sources
  - derived_fingerprint over B1 inputs
  - sanitizer + anti-stuffing + provenance tags
  - writes graph-metadata.json.derived, not SKILL.md
        |
        v
Skill-graph daemon
  - chokidar/debounced events
  - content-hash comparison
  - single SQLite transaction
  - upsert skill_nodes, replace changed skill_edges
  - full rebuild only for recovery/schema maintenance
        |
        v
Post-commit publication
  - advisor generation bump
  - source signature refresh
  - prompt/result cache invalidation
  - status/freshness = live | stale | absent | unavailable
        |
        v
Advisor projection + scoring
  - AdvisorSkillDocument / SkillSearchRecord projection
  - explicit_author lane: name, description, Keywords, intent_signals
  - derived_generated lane: derived.trigger_phrases + provenance
  - lexical/phrase lane: deterministic prompt matching
  - graph/causal lane: bounded skill_edges traversal
  - semantic lane: optional precomputed/shadow semanticHits
  - fusion: analytical, capped, explainable, confidence separate from structure
        |
        v
Runtime surfaces
  - hook path: buildSkillAdvisorBrief() -> native recommendSkills()
  - MCP tools: advisor_recommend, advisor_status, advisor_validate
  - skill graph tools remain skill_graph_scan/query/status/validate
  - compatibility: skill_advisor.py shim and OpenCode plugin bridge
```

The key architectural adjustment from the cross-track pass is the derived-signal lane. A, B, C, and D otherwise align: A gives B and C a committed graph/freshness boundary; B writes generated trigger evidence into the existing metadata/SQLite flow; C consumes skills through an advisor-specific projection rather than memory tables; and D gives that scorer a system-spec-kit MCP home. X3's "needs-adjustment" finding means the scorer must not let `derived.trigger_phrases` masquerade as direct author intent. It needs explicit source lanes, per-lane caps, provenance/freshness fields, and B4/B7 calibration haircuts before default routing confidence can rise.

The module placement should stay deliberately conservative. `lib/skill-graph` owns graph scan, query, status, validation, SQLite schema, and bounded traversal. `lib/skill-advisor` owns `recommendSkills()`, skill-record projection, signal loading, analytical fusion, ambiguity/conflict handling, health, prompt cache, freshness, render/shared-payload integration, and compatibility adapters. `handlers/skill-advisor` and `tools/advisor-tools.ts` expose the advisor plane; existing `skill_graph_*` tools remain the graph plane. Memory MCP search/fusion is an architectural reference and optional shadow/prototype source for semantic or learned channels, not the physical home for skill routing.

This sketch is draft-complete for synthesis because it turns all track verdicts plus the four cross-track checks into one data-flow artifact. The first implementation should still preserve staging: ship the graph daemon, derived provenance, native deterministic scorer, and `advisor_*` tool shell before promoting embedding lookup, learned ranking, broad support-file watching, or plugin/CLI deprecation. Those later channels have explicit prototype, parity, or measurement gates and should not be folded into the first architectural slice.

## Verdict
- **Call:** draft-complete
- **Confidence:** high
- **Rationale:** The architectural sketch is complete enough for final synthesis: it connects A's daemon/transaction model, B's derived-trigger provenance, C's advisor projection/fusion model, and D's MCP-native module/tool layout while preserving the one required X3 adjustment.

## Dependencies
A1, A2, A3, A4, A5, A6, A7, A8, B1, B2, B3, B4, B5, B6, B7, C1, C2, C3, C4, C5, C6, C7, C8, D1, D2, D3, D4, D5, D6, D7, D8, X1, X2, X3, X4

## Open follow-ups
Implementation planning should convert this diagram into ordered sub-packets: daemon/freshness, derived metadata/provenance, native advisor projection/scoring, MCP tool exposure, compatibility migration, and measurement gates. The final synthesis should also decide whether the "semantic lane" remains only `semanticHits` input/shadow mode for Phase 027 or gets a named prototype sub-packet.

## Metrics
- newInfoRatio: 0.38
- dimensions_advanced: [S]
