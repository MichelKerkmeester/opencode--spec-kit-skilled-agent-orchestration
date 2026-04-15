# Enrichment Proposals for v3.4.0.0 (Barter copy)

## Search and Ranking Upgrades (proposed replacement)

The search setup no longer assumes one fixed backend. The checked-in configs in `.mcp.json`, `.claude/mcp.json`, `.vscode/mcp.json`, `.gemini/settings.json`, and `opencode.json` now share `EMBEDDINGS_PROVIDER=auto`, so the same repo can run with the default cloud path or a local fallback without rewriting config.

Reranking is clearer too. The live cross-encoder path is on Voyage `rerank-2.5`, and `getRerankerStatus()` now reports `hits`, `misses`, `staleHits`, and `evictions`, which makes cache behavior visible when a result moves.

Continuity search now has its own tuned profile instead of reusing the generic weights. Resume-style lookups use `0.52 / 0.18 / 0.07 / 0.23` weights for semantic, keyword, recency, and graph signals, and that profile was checked against a judged 12-query continuity fixture that kept the baseline `K=60` recommendation.

Long but useful docs no longer lose ground just for being long. `applyLengthPenalty` still exists for compatibility, but it now resolves to a neutral `1.0`, so long handover and implementation docs keep their place when they are the best match.

Stage 3 reranking also waits for enough evidence to matter. The cutoff moved from 2 results to 4, and the same boundary now holds for both the cloud reranker and the local reranker path.

Save routing is more accurate on mixed notes. Delivery language now wins when the same chunk also includes sequencing, rollout, or verification detail. Stop-state notes no longer collapse to `drop` just because they mention commands like `git diff`, `list memories`, or `force re-index`.

The optional Tier 3 route is now live behind `SPECKIT_TIER3_ROUTING=true`. It reuses `LLM_REFORMULATION_ENDPOINT`, keeps a shared in-memory cache, and fails open after a `2000ms` timeout or a bad reply, so the save falls back to Tier 2 instead of blocking.

Causal lineage keeps anchor detail now. Schema version `26` added `source_anchor` and `target_anchor` to `causal_edges`, so two links between the same docs can stay separate when they point at different sections.

## Code Graph Upgrades (proposed replacement)

Traversal is tighter and easier to trust in multi-file work. `code_graph_query` now stops blast-radius walks before nodes past `maxDepth` are included, which removes the old out-of-bounds spill instead of hiding it after the fact.

Every node and edge can now carry a real source label instead of a loose parser string. The runtime serializes a dedicated detector-provenance vocabulary, with a compatibility mapper back to the older `ParserProvenance` names so existing surfaces do not break.

Graph-local results also carry better evidence. Shared payloads can now include `edgeEvidenceClass` and `numericConfidence`, which makes it easier to tell whether a relationship came from strong structural evidence or a weaker graph-local guess.

Multi-file union is now a real mode instead of an implied merge. `unionMode: 'multi'` combines several source files without duplicate results, and high-degree files add a `hotFileBreadcrumb` so you can see when one file is dominating the walk.

This stays scoped to graph-owned outputs, not every startup surface. You get richer code-graph answers, but the trust boundaries from the other graph packets still stay in place.

## Auditable Deep-Loop Skills (proposed replacement)

The deep-loop runtime now records stop decisions in a form you can inspect. Every stop carries a named reason from the same small taxonomy - `converged`, `max_iterations`, `blocked`, `user_stop`, or `error` - and the legal-stop gate now checks convergence, coverage, and quality together before a run is allowed to stop.

That audit trail is no longer implied by scattered notes. Blocked and claim-adjudication decisions now persist as explicit events, and the dashboards stay generated markdown backed by the same structured state underneath.

A real coverage graph now sits under convergence. `deep-loop-graph.sqlite` stores nodes, edges, and snapshots, and four graph tools expose gaps, contradictions, provenance chains, hot nodes, and stop blockers directly instead of rolling everything up into one abstract score.

Concurrent runs on the same packet no longer share graph state by accident. The graph store now keys records by `(spec_folder, loop_type, session_id, id)`, so two sessions can write the same local node id without colliding.

Large targets can now split into bounded waves, but only when the scale justifies it. Wave mode turns on at `1000+` review files or `50+` research domains, keeps smaller runs on the old single-stream path, and uses deterministic segmentation plus keyed merge so provenance survives the join.

An offline optimizer can now replay real packet-family `040` traces, score candidate configs, and emit advisory patches with a full audit trail. It still refuses production mutation until replay fixtures and behavioral suites exist, so tuning stays reviewable instead of self-applying.

The closeout also made the visible path honest. A focused 10-iteration closing audit fed five remediation lanes, and the post-remediation run finished at `908` passed, `55` skipped, and `0` failed.

## Investigation notes

### Search and Ranking Upgrades

- Auto-configured embeddings and the checked-in five-config cleanup come from `008-cleanup-and-audit/003-mcp-config-and-feature-flag-cleanup/implementation-summary.md:41-53`.
- The live reranker surface, retired length penalty, cache telemetry fields, continuity weights, and 4-candidate rerank gate are summarized in `010-continuity-research/001-search-fusion-tuning/005-doc-surface-alignment/implementation-summary.md:55-75`.
- The neutralized length penalty and compatibility-only `applyLengthPenalty` surface are grounded in `010-continuity-research/001-search-fusion-tuning/001-remove-length-penalty/implementation-summary.md:37-52`.
- The continuity profile weights and judged 12-query validation fixture come from `010-continuity-research/001-search-fusion-tuning/003-continuity-search-profile/implementation-summary.md:37-54` and `010-continuity-research/001-search-fusion-tuning/006-continuity-profile-validation/implementation-summary.md:53-76`.
- Mixed-note save routing, the env-gated Tier 3 classifier, fail-open behavior, and anchor-aware causal links come from `010-continuity-research/002-content-routing-accuracy/001-fix-delivery-progress-confusion/implementation-summary.md:52-68`, `010-continuity-research/002-content-routing-accuracy/002-fix-handover-drop-confusion/implementation-summary.md:52-68`, `010-continuity-research/002-content-routing-accuracy/003-wire-tier3-llm-classifier/implementation-summary.md:53-74`, and `006-continuity-refactor-gates/002-gate-b-foundation/implementation-summary.md:46-65`.

### Code Graph Upgrades

- The main shipped beats for detector provenance, bounded blast radius, union mode, breadcrumbs, and payload enrichment come from `005-code-graph-upgrades/implementation-summary.md:44-62`.
- The trust-boundary framing for additive graph-only enrichment comes from `005-code-graph-upgrades/decision-record.md:43-60`.
- The explicit choice to keep startup and response nudges out of this packet while still allowing graph-local breadcrumbs is in `005-code-graph-upgrades/decision-record.md:140-149`.
- The choice to keep the packet scoped to provenance taxonomy, blast-radius hardening, breadcrumbs, and edge evidence, not larger graph experiments, is in `005-code-graph-upgrades/decision-record.md:182-190`.

### Auditable Deep-Loop Skills

- The named stop taxonomy, legal-stop gate, resume cursor semantics, journals, and typed convergence traces come from `001-runtime-truth-foundation/implementation-summary.md:35-59` and `001-runtime-truth-foundation/decision-record.md:31-64`.
- The coverage graph, `deep-loop-graph.sqlite`, and four graph tools come from `002-semantic-coverage-graph/implementation-summary.md:35-56`.
- The bounded-wave thresholds, deterministic segmentation, and keyed merge details come from `003-wave-executor/implementation-summary.md:35-56`.
- The replay optimizer, `040` trace corpus, advisory-only patch output, and production-mutation refusal come from `004-offline-loop-optimizer/implementation-summary.md:35-60`.
- Session isolation, blocked-stop and claim-adjudication cleanup, the five-lane closing audit remediation, and the final `908 / 55 / 0` test outcome come from `042-sk-deep-research-review-improvement-2/implementation-summary.md:69-77` and `042-sk-deep-research-review-improvement-2/implementation-summary.md:101-117`.
