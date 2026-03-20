**Audit Report**

Using a `grep`-equivalent `rg` scan over `/.opencode/skill/system-spec-kit/mcp_server/lib/`, I found **81 unique `SPECKIT_` names** across all files in `lib/` after excluding one malformed docs token `SPECKIT_MEMORY_`. Restricting to TypeScript runtime code only, there are **76 unique flags**.

**Flag Inventory**

| Bucket | Count | Source | Inventory |
|---|---:|---|---|
| Search registry | 25 | [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts#L1) | `SPECKIT_MMR`, `SPECKIT_TRM`, `SPECKIT_MULTI_QUERY`, `SPECKIT_CROSS_ENCODER`, `SPECKIT_SEARCH_FALLBACK`, `SPECKIT_FOLDER_DISCOVERY`, `SPECKIT_DOCSCORE_AGGREGATION`, `SPECKIT_SAVE_QUALITY_GATE`, `SPECKIT_RECONSOLIDATION`, `SPECKIT_NEGATIVE_FEEDBACK`, `SPECKIT_PIPELINE_V2`, `SPECKIT_EMBEDDING_EXPANSION`, `SPECKIT_CONSOLIDATION`, `SPECKIT_ENCODING_INTENT`, `SPECKIT_GRAPH_SIGNALS`, `SPECKIT_GRAPH_WALK_ROLLOUT`, `SPECKIT_COMMUNITY_DETECTION`, `SPECKIT_MEMORY_SUMMARIES`, `SPECKIT_AUTO_ENTITIES`, `SPECKIT_ENTITY_LINKING`, `SPECKIT_DEGREE_BOOST`, `SPECKIT_CONTEXT_HEADERS`, `SPECKIT_FILE_WATCHER`, `SPECKIT_ROLLOUT_PERCENT`, `SPECKIT_QUALITY_LOOP` |
| Graph shim | 1 | [graph-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts#L1) | `SPECKIT_GRAPH_UNIFIED` |
| Capability registry | 14 | [capability-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts#L1) | `SPECKIT_MEMORY_ROADMAP_PHASE`, `SPECKIT_MEMORY_LINEAGE_STATE`, `SPECKIT_MEMORY_GRAPH_UNIFIED`, `SPECKIT_MEMORY_ADAPTIVE_RANKING`, `SPECKIT_MEMORY_SCOPE_ENFORCEMENT`, `SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS`, `SPECKIT_MEMORY_SHARED_MEMORY`, `SPECKIT_HYDRA_PHASE`, `SPECKIT_HYDRA_LINEAGE_STATE`, `SPECKIT_HYDRA_GRAPH_UNIFIED`, `SPECKIT_HYDRA_ADAPTIVE_RANKING`, `SPECKIT_HYDRA_SCOPE_ENFORCEMENT`, `SPECKIT_HYDRA_GOVERNANCE_GUARDRAILS`, `SPECKIT_HYDRA_SHARED_MEMORY` |
| Standalone runtime flags | 36 | spread across `lib/**/*.ts` | `SPECKIT_ABLATION`, `SPECKIT_ARCHIVAL`, `SPECKIT_CAUSAL_BOOST`, `SPECKIT_CHANNEL_MIN_REP`, `SPECKIT_CLASSIFICATION_DECAY`, `SPECKIT_COACTIVATION`, `SPECKIT_COACTIVATION_STRENGTH`, `SPECKIT_COMPLEXITY_ROUTER`, `SPECKIT_CONFIDENCE_TRUNCATION`, `SPECKIT_CONSUMPTION_LOG`, `SPECKIT_DASHBOARD_LIMIT`, `SPECKIT_DB_PATH`, `SPECKIT_DYNAMIC_TOKEN_BUDGET`, `SPECKIT_ENTITY_LINKING_MAX_DENSITY`, `SPECKIT_EVAL_LOGGING`, `SPECKIT_EVENT_DECAY`, `SPECKIT_EXTENDED_TELEMETRY`, `SPECKIT_EXTRACTION`, `SPECKIT_FOLDER_SCORING`, `SPECKIT_FOLDER_TOP_K`, `SPECKIT_INTERFERENCE_SCORE`, `SPECKIT_LEARN_FROM_SELECTION`, `SPECKIT_LEVEL`, `SPECKIT_LEVEL_REGEX`, `SPECKIT_MEMORY_ADAPTIVE_MODE`, `SPECKIT_NOVELTY_BOOST`, `SPECKIT_RECENCY_DECAY_DAYS`, `SPECKIT_RELATIONS`, `SPECKIT_RERANKER_MODEL`, `SPECKIT_RERANKER_TIMEOUT_MS`, `SPECKIT_RSF_FUSION`, `SPECKIT_SCORE_NORMALIZATION`, `SPECKIT_SESSION_BOOST`, `SPECKIT_SIGNAL_VOCAB`, `SPECKIT_TOKEN_BUDGET`, `SPECKIT_WORKING_MEMORY` |
| Docs / fixture only | 5 | README / JSON only | `SPECKIT_ADAPTIVE_FUSION`, `SPECKIT_BM25`, `SPECKIT_PRESSURE_POLICY`, `SPECKIT_REDACTION_GATE`, `SPECKIT_SKIP_API_VALIDATION` |

**Registry Assessment**

| Question | Answer | Evidence |
|---|---|---|
| Is `search-flags.ts` the central registry? | **No. Partial only.** It holds 25 flags, but many search/runtime flags live elsewhere, e.g. `SPECKIT_COMPLEXITY_ROUTER` in [query-classifier.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts#L40), `SPECKIT_CHANNEL_MIN_REP` in [channel-representation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts#L66), `SPECKIT_FOLDER_SCORING` in [folder-relevance.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts#L25), `SPECKIT_SESSION_BOOST` in [session-boost.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts#L28), `SPECKIT_SCORE_NORMALIZATION` in [composite-scoring.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L834). |
| Is `graph-flags.ts` a separate registry? | **Not really.** It is a legacy compatibility shim with one flag and wrappers around `search-flags.ts`. | [graph-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts#L5) |
| Is `capability-flags.ts` another registry? | **Yes, but for roadmap/capability state, not for search flags.** It tracks canonical + legacy HYDRA aliases and a phase enum. | [capability-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts#L32) |

**Dependencies And Cycles**

No direct flag-dependency cycles showed up in code.

Observed one-way dependencies:
- `SPECKIT_GRAPH_WALK_ROLLOUT` falls back to `SPECKIT_GRAPH_SIGNALS` when unset in [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts#L156).
- Graph enrichments also require `SPECKIT_GRAPH_UNIFIED` in [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L601).
- `SPECKIT_ENTITY_LINKING` is documented as requiring `SPECKIT_AUTO_ENTITIES` in [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts#L199), but runtime code only checks `isEntityLinkingEnabled()` plus infrastructure in [entity-linker.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts#L492). That is a doc/code mismatch, not a cycle.
- Many default-on flags are also globally coupled to `SPECKIT_ROLLOUT_PERCENT` through [rollout-policy.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts#L42).

One governance inconsistency stands out:
- `capability-flags.ts` treats `SPECKIT_MEMORY_SHARED_MEMORY` as default-on unless explicitly disabled ([capability-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts#L76)), while `shared-spaces.ts` treats the same capability as default-off unless explicitly enabled or persisted in DB ([shared-spaces.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L175)).

**Sunset / Expiry**

Code-level sunset governance is weak:
- No concrete sunset dates in runtime code.
- No expiry timestamps, TTLs, or hard-deadline enforcement for flags.
- No version gating beyond comments / roadmap phase labels.

Deprecated or inert remnants:
- `SPECKIT_PIPELINE_V2` is accepted but ignored; function always returns `true` in [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts#L107).
- `SPECKIT_CONSUMPTION_LOG` is inert and hardcoded `false` in [consumption-logger.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts#L80).
- `SPECKIT_NOVELTY_BOOST` is inert and always returns `0` in [composite-scoring.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts#L479).

The spec does define governance, but only in docs:
- `6-flag max`, `90-day lifespan`, `monthly sunset audit` in [tasks.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/001-sprint-0-measurement-foundation/tasks.md#L39)
- `target <=6`, `hard ceiling <=8` in [spec.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/spec.md#L478) and [spec.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/spec.md#L762)

**Governance Verdict**

Yes, the codebase’s flag surface **massively exceeds** the spec’s 6-flag limit:
- **81** unique `SPECKIT_` names across `lib/` content
- **76** unique `SPECKIT_` names in runtime TypeScript
- Spec budget is **target <=6 active**, **hard ceiling <=8**

Strictly speaking, the spec talks about **active** flags, and I did not inspect a live process env to compute current runtime values. But the static surface area, default-on behavior, lack of central manifest, and lack of code-enforced sunset/expiry all indicate the governance model is not being enforced in code.

**Bottom line:** there is **no single authoritative registry**, **no code-enforced sunset mechanism**, **no cycle detected**, but there is **heavy flag sprawl**, **legacy alias duplication**, and at least one **semantic inconsistency** (`shared memory`) across registries.
