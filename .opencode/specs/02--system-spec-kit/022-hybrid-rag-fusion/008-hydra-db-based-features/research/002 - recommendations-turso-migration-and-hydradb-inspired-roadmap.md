# HydraDB-Inspired Recommendations for system-spec-kit and the Memory MCP Server

## Executive summary

This roadmap should be Hydra-first, not storage-migration-first. The useful HydraDB patterns to emulate are: versioned memory state, graph-aware retrieval, self-improving ranking loops, strict hierarchical isolation, governed ingestion, and shared multi-agent memory.

HydraDB public materials frame memory as evolving state (https://hydradb.com/manifesto), hybrid retrieval with time-aware graph behavior (https://hydradb.com/blog/why-cortex-outperforms-rag-only-memory-architectures), and production-grade ingestion and governance controls (https://hydradb.com/blog/how-to-design-llm-memory-systems-that-scale). We should adopt those patterns incrementally on top of existing system-spec-kit primitives.

We already have strong foundations: event history, conflict journaling, causal graph tables, weight history, entity catalogs, summaries, hybrid search stages, weighted FTS, working memory, FSRS decay, access tracking, save locks, dedup, chunking, quality loops, and a durable ingest queue. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:54-204] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:248-278] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:582-723] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1238-1263] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1300-1407] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:7-33] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:16-114] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:88-223] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:14-255]

## Assumptions

[Assumes: HydraDB and Cortex references describe the same product branding based on public site content.]

[Assumes: no public HydraDB source repository was available during this research, so recommendations are derived from HydraDB's public website corpus rather than source code.]

[Assumes: HydraDB blog posts reference docs.useHydraDB.ai pages for some features, but those docs URLs were not resolvable in this session, so recommendations are grounded in the publicly reachable hydradb.com corpus and its site search index.]

## Priority matrix (impact vs effort)

| Priority | Theme | Impact | Effort | Why now |
|---|---|---|---|---|
| P0 | Versioned memory state | Very high | Medium | Closes largest correctness gap and enables temporal answers |
| P1 | Unified graph-aware memory | High | Medium | Uses existing causal/entity/summaries tables already in schema |
| P2 | Self-improving retrieval loops | High | Medium | We already collect key behavioral signals; need a learning loop |
| P3 | Hierarchical scopes and isolation | Very high | High | Needed for safe multi-tenant and enterprise adoption |
| P4 | Governed ingestion pipeline | High | Medium-high | Improves trust, provenance, and compliance readiness |
| P5 | Shared memory (Hive-mode) | Medium-high | Medium | Enables coordinated multi-agent execution |
| Cross-cutting | Governance and compliance workflows | Very high | Medium | Required for enterprise operation and auditability |

## P0: Introduce first-class versioned memory state

HydraDB positions versioned state as a core differentiator (https://hydradb.com/manifesto, https://hydradb.com/blog/why-cortex-outperforms-rag-only-memory-architectures). We should implement this directly on top of our current history plus conflict model.

Implementation ideas:

- Add `memory_state_versions` with `lineage_id`, `version_no`, `valid_from`, `valid_to`, `supersedes_version`, `change_reason`, `actor`, `source_event_id`.
- Treat `memory_history` as append-only event facts and map each event into a state-version transition.
- Map `memory_conflicts.action` (`UPDATE`, `SUPERSEDE`, `REINFORCE`) into deterministic version transitions and explicit branch merges.
- Add query APIs: `memory_get_state_at(timestamp)` and `memory_get_lineage(memory_id)`.
- Keep existing save-path lock and dedup behavior, but generate version rows inside the same critical section.

Why this fits current code:

- We already track immutable events by actor and timestamp in `memory_history`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:17-204]
- We already persist conflict decisions and contradiction metadata in `memory_conflicts`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1238-1263]
- We already serialize saves per spec folder and run quality/dedup/chunking before index mutation. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:88-223]

## P1: Unify graph-aware memory across causal, entities, and summaries

HydraDB messaging emphasizes relationship-rich, time-aware memory graphs over flat retrieval (https://hydradb.com/, https://hydradb.com/blog/how-to-design-llm-memory-systems-that-scale). We should formalize one graph-aware retrieval model instead of parallel partial features.

Implementation ideas:

- Build a unified graph layer from `causal_edges`, `weight_history`, `memory_entities`, `entity_catalog`, and `memory_summaries`.
- Create typed edges: `causal`, `entity_cooccurrence`, `summary_reference`, `supersedes`.
- Reuse existing relation multipliers and traversal depth limits to avoid runaway graph noise.
- Add a periodic consolidation job: update edge strengths using retrieval success/failure and recency.
- Expose graph diagnostics (`coverage`, `orphan_rate`, `stale_edges`) for operators.

Why this fits current code:

- The schema already contains all core graph and entity tables. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:248-278] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:582-723]
- Causal traversal with relation-weighted boosts already exists and can be expanded rather than replaced. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:13-218]
- Stage 1 candidate generation already supports multi-path retrieval and dedup behavior for richer fusion inputs. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:217-319]

## P2: Build self-improving retrieval loops

HydraDB public content repeatedly claims retrieval improves from interactions, outcomes, and tenant patterns (https://hydradb.com/blog/why-cortex-outperforms-rag-only-memory-architectures, https://hydradb.com/blog/how-to-design-llm-memory-systems-that-scale). We can implement this with our current signals.

Implementation ideas:

- Add `retrieval_outcomes` table capturing query, candidate set, selected result, downstream success, and operator feedback.
- Connect access signals (`access_count`, `last_accessed`) with FSRS retrievability and working-memory attention into an adaptive reranking policy.
- Add explicit feedback APIs for `helpful`, `stale`, `incorrect`, `missing_context` and feed them to edge-weight updates and BM25 weight adaptation.
- Start with bounded policy updates and shadow-mode evaluation before live auto-tuning.

Why this fits current code:

- Access tracking and popularity/usage boost calculations already exist. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:13-220]
- FSRS retrievability and review progression are production logic, not research stubs. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:7-215]
- Session-scoped working memory already stores attention and provenance metadata that can seed online learning. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:25-67] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:128-217]
- Weighted BM25 and multi-stage retrieval are established points for policy adaptation. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:16-114] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:7-33]

## P3: Add hierarchical scopes with strict isolation and optional collaboration

HydraDB enterprise positioning highlights multi-tenant operation, isolation controls, and enterprise governance (https://hydradb.com/, https://hydradb.com/blog/how-to-design-llm-memory-systems-that-scale). We should move from `spec_folder` scoping to explicit hierarchy.

Implementation ideas:

- Add scope columns: `tenant_id`, `sub_tenant_id`, `user_id`, `agent_id`, `session_id`, `collaboration_mode`.
- Enforce scope filters in every read/write path, not only search entry points.
- Add scoped sharing policies: `private`, `team`, `tenant_shared`, `cross_agent_shared`.
- Add policy checks before graph traversal so cross-boundary edges cannot leak context.

Why this fits current code:

- Core memory rows already include `spec_folder`, `session_id`, and `channel`, which can be expanded into full hierarchy. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1300-1349]
- Query paths already pass scoped filters (`specFolder`) through candidate generation and FTS. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:217-319] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:67-98]

## P4: Governed ingestion pipeline with provenance, temporal markers, and lifecycle controls

HydraDB blog guidance describes source-aware parsing, entity extraction, temporal markers, and robust governance as first-class production requirements (https://hydradb.com/blog/how-to-design-llm-memory-systems-that-scale). We should implement this as a formal ingestion contract.

Implementation ideas:

- Add source-type registry and parser contracts (`gmail`, `slack`, `notion`, `jira`, `db`, `file`), each producing normalized extraction envelopes.
- Implement three extraction layers: structural parse, entity/relationship extraction, fact/event consolidation.
- Require source attribution on each extracted fact and keep immutable provenance IDs.
- Add retention and deletion controls with cascade delete plans across raw content, entities, summaries, graph edges, and derived indexes.
- Add temporal markers (`effective_at`, `observed_at`, `expires_at`) at ingest time.

Why this fits current code:

- Save path already includes validation, quality loop, dedup, chunking, and lock discipline. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:88-223]
- A durable ingest queue with explicit state machine already exists for controlled processing. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:14-255]
- Schema already has `expires_at`, quality metadata, and embedding lifecycle fields we can extend. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1300-1349]

## P5: Add shared-memory Hive-mode for multi-agent coordination

HydraDB positioning highlights shared context for coordinated agents (https://hydradb.com/, https://hydradb.com/manifesto). We should support cooperative memory spaces without sacrificing boundaries.

Implementation ideas:

- Add `shared_context_spaces` and membership policies tied to P3 scope hierarchy.
- Implement agent-role annotations on writes and read-intent annotations on retrieval.
- Add conflict-aware merge policies for shared edits (`append`, `supersede`, `vote_required`).
- Add shared-memory replay and timeline views for debugging agent collaboration failures.

Why this fits current code:

- Working memory already supports session scope, provenance metadata, and attention scoring that can be generalized to multi-agent sessions. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:43-60] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:128-217]
- Causal edges and weight history can represent agent-to-agent dependency and reinforcement signals. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:248-278] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:582-594]

## Cross-cutting governance requirements

Treat governance as a platform feature, not a later add-on. HydraDB enterprise messaging references audit logs, RBAC, SSO, encryption, data residency, and on-prem options (https://hydradb.com/). Our implementation should mirror that operating model.

Required controls:

- End-to-end audit trails for state changes, conflicts, retrieval outcomes, and admin actions.
- Policy-driven access controls at tenant, user, agent, and session scope.
- Retention profiles plus verified cascade deletion workflows for compliance use cases, including GDPR-style right-to-delete execution reports.
- Operational observability for queue state, retrieval quality drift, and safety incidents.

Current building blocks already support this direction. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:127-204] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1238-1263] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:63-212] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/undocumented-features-scan.md:76-127]

## Risks and caveats

- Do not overfit to vendor marketing language. Treat all HydraDB benchmark and architecture claims as hypotheses until reproduced in local evaluation.
- Public web copy may mix product branding and aspirational roadmap language; map each claim to testable acceptance criteria.
- Governance scope can explode quickly. Ship minimum viable controls first, then harden.

## Suggested next sequence

1. Build P0 first: versioned state model plus lineage APIs, wired to existing history/conflict save paths.
2. Deliver P1 graph unification with explicit typed edges and graph health metrics.
3. Add P2 feedback loops in shadow mode, then progressive auto-tuning under guardrails.
4. Implement P3 hierarchical isolation gates across all read/write operations.
5. Add P4 governed ingestion contracts and retention/cascade deletion workflows.
6. Launch P5 shared-memory spaces for selected multi-agent flows.
7. Run quarterly governance and retrieval quality reviews with explicit rollback criteria.
