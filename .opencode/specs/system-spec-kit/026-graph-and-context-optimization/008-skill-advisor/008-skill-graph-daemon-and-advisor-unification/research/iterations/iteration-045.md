# Iteration 045 — Follow-up Track F: F1 — Skill-aged signal decay model

## Question
Skill-aged signal decay model — exponential vs step function vs commit-graph-based.

## Evidence Collected
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/next-research-paths.md:36-42` → Track F exists because old skills can pollute derived-trigger corpus stats unless lifecycle rules explicitly handle aged, superseded, and archived skills.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/next-research-paths.md:108-117` → F1 is specifically framed as choosing between exponential, step-function, and commit-graph-based decay for skill-aged signals.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:47-48` → r01 already decided that memory lifecycle/governance/decay fields should stay out of canonical skill records, so any age model must be an advisor-side projection rather than a memory-style mutation of core skill identity.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-017.md:38-44` → C2’s analysis maps memory-style retrieval concepts onto skills but explicitly says governance/session/retention/FSRS fields should not map onto static skills; it recommends a separate projection layer for scoring.
- `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:182-206` → Schema-v2 derived skill metadata currently requires `created_at` and `last_updated_at`, but no access history, review history, or commit-lineage fields.
- `.opencode/skill/skill-advisor/graph-metadata.json:38-71` → A live skill’s derived block contains trigger phrases, key topics/files/entities, source docs, and timestamps only; there is no built-in notion of usage count, archival state, or Git-history-derived authority.
- `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:159-168` → The runtime’s cache invalidation model is filesystem-based (`mtime` and size), showing that today’s hot path is anchored on local file freshness rather than Git commit graph traversal.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:623-663` → Current routing boosts are deterministic phrase matches over graph intent signals and derived trigger phrases.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2459-2525` → Final ranking blends boosts, explicit-name matches, keyword variants, and corpus/name terms, then calibrates confidence; there is no age/decay lane in the live scorer.
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:4-15` → The memory system’s canonical precedent explicitly removed legacy exponential decay from the runtime API and standardized on FSRS/classification-based approaches instead.
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:54-65` → Even in the memory system, decay is tier-sensitive: constitutional/critical/important do not decay, while only normal/temporary memories do.
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:153-191` → Effective half-life selection is discrete and policy-based: explicit overrides first, then type-based rules, then no-decay for constitutional/critical tiers.
- `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:34-35,93-100,117-123` → The mature scoring subsystem combines importance tiers with event-based decay, and explicitly treats `deprecated` items as hidden rather than merely smoothly down-weighted.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:27-38,118-159` → The skill graph database stores identity, intent signals, derived metadata, content hash, and indexed time, but no access-count or review-history columns that would support FSRS- or commit-history-style decay directly.

## Analysis
The repo evidence points away from both extremes in the F1 option set. A commit-graph-based model is not supported by the current skill schema or runtime: skill metadata exposes only coarse derived timestamps, the runtime invalidates on filesystem `mtime`/size, and the scorer has no existing Git-history lane to reuse. Adding commit-graph scoring would therefore mean introducing new Git-history collection, caching, and failure-mode handling into a prompt-path system that is currently designed around cheap deterministic signals. `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:182-206`, `.opencode/skill/skill-advisor/graph-metadata.json:38-71`, `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:159-168`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2459-2525`

Pure exponential age decay is also a poor fit for this codebase’s lifecycle philosophy. The strongest internal precedent is the memory system, which explicitly retired legacy exponential decay and replaced it with tier-aware FSRS/classification behavior; it also preserves non-decaying classes for high-value knowledge and treats deprecated content as a discrete hidden state. That matters here because many skills are evergreen capabilities: a stable, correct skill should not steadily lose routing value just because it has not changed recently. The actual problem statement is “old derived-trigger corpus pollution,” not “all old skills become less true over time.” `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:4-15,54-65`, `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:153-191`, `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:93-100,117-123`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/next-research-paths.md:36-42`

That leaves the step-function family as the best adopt-now answer: keep canonical skill identity and explicit author-declared intent non-decaying, but apply discrete advisor-side haircuts to the **derived-generated** lane based on age/status bands. In practice that means using `derived.last_updated_at` as the minimum viable freshness signal, with no or minimal penalty while a skill is active, a moderate haircut once it crosses a staleness threshold, and hard demotion/exclusion once F2/F5 add superseded/archive states. This matches r01’s C2 rule to keep lifecycle/decay out of canonical skills while still protecting B6-style corpus statistics from stale generated phrases. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/research.md:47-48`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/research/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-017.md:38-44`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py:623-663,2459-2525`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:27-38,118-159`

## Verdict
- **Call:** adopt now
- **Confidence:** high
- **Rationale:** Use a discrete, advisor-side age/status decay model for generated routing signals; it matches the repo’s classification-first lifecycle patterns and avoids inventing a Git-history hot path that the current schema and runtime do not support.

## Dependencies
B4, B6, C2, C4, F2, F5

## Open follow-ups
- Define the actual age bands and haircuts for `derived_generated` (for example fresh / aging / stale) in a way that preserves explicit-author signals as non-decaying.
- Decide in F2/F5 whether `superseded` and `archived` become hard routing exclusions or simply near-zero routing weights.
- Decide whether later advisor telemetry can supply a lightweight event signal for decay tuning without importing full memory-governance/FSRS fields into canonical skill records.

## Metrics
- newInfoRatio: 0.62
- dimensions_advanced: [F]
