# Analysis: HydraDB Site Architecture Patterns for system-spec-kit and Memory MCP

## Executive summary

This document reframes the analysis around HydraDB itself, not around database vendor comparison. The strongest signal from the HydraDB public corpus is that the product is designed as a memory state system rather than a retrieval-only stack. Across hydradb.com home and manifesto pages, and repeatedly across blog material, the core proposition is stable: maintain relationship-aware, time-aware, version-aware state that can be shared, governed, and continuously improved across agents and tenants (https://hydradb.com/, https://hydradb.com/manifesto, https://hydradb.com/blog/how-to-design-llm-memory-systems-that-scale, https://hydradb.com/blog/why-cortex-outperforms-rag-only-memory-architectures).

That framing matters for system-spec-kit. Our current memory MCP server already has several strong primitives that align with Hydra patterns: hybrid retrieval orchestration, weighted lexical retrieval, causal graph traversal, conflict journaling, working memory, long-term recall scheduling, access-based signal capture, and ingest/job lifecycle controls. These are present today in the local codebase and represent a meaningful foundation for a Hydra-style architecture direction. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:7-33] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:217-319] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:16-114] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:248-278] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:13-218] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:17-204] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:25-67] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:7-215]

The main gap is not lack of components. The gap is that these components are not yet unified into a first-class state model with explicit version lineage, temporal truth guarantees, hierarchical multi-tenant policy boundaries, source-aware ingestion provenance, and closed-loop self-improving retrieval. HydraDB repeatedly describes those capabilities as central, including governance and enterprise controls like RBAC, SSO, audit logs, and tenant-aware operations (https://hydradb.com/, https://hydradb.com/blog/how-to-share-llm-memory-across-ai-agents, https://hydradb.com/blog/how-to-refresh-or-update-stored-llm-memory, https://hydradb.com/blog/mem0-vs-cortex-which-scales-better-for-multi-agent-systems).

Bottom line: system-spec-kit can adopt HydraDB patterns by evolving from "search over memory rows" to "versioned memory state with policy and feedback loops." A storage migration can support that path, but Hydra-style value is primarily an architectural and product model decision.

## Scope and assumptions

[Assumes: HydraDB and Cortex references describe the same product branding based on public site content.]

[Assumes: no public HydraDB source repository was available during this research, so architecture is inferred from HydraDB's public website corpus rather than source code.]

[Assumes: HydraDB blog posts reference docs.useHydraDB.ai pages for some features, but those docs URLs were not resolvable in this session, so this analysis is grounded in the publicly reachable hydradb.com corpus and its site search index.]

Scope for this document is Hydra-first architectural analysis using HydraDB public web material plus local system-spec-kit code evidence. This is not a Turso fit report. A brief infrastructure note may appear where relevant, but comparison framing is intentionally minimized.

The HydraDB crawl coverage baseline used here is the publicly surfaced Framer site search index JSON corpus: 32 total pages comprising home, manifesto, blog index, 27 blog posts, and legal/contact pages. Within that corpus, the recurring feature themes were consistent: memory-first state, hybrid retrieval, time/version awareness, graph relationships, self-improving retrieval, personalization, hierarchical multi-tenancy, shared agent memory, governance/audit/security, source-aware ingestion, and enterprise controls.

## HydraDB site coverage and feature taxonomy

### Corpus coverage footprint

HydraDB public content exposes a coherent story across page types, not isolated claims. The homepage emphasizes outcomes and operational envelope: relationship + decision + timeline context, in-memory/RAM processing, latency claims (always under 200 ms), multi-region availability, production tier limits of up to 5 tenants with unlimited users, scale tier with unlimited tenants, self-host/on-prem options, and enterprise controls (RBAC, SSO, audit logs, encryption in transit and at rest), plus shared learning across agents (https://hydradb.com/).

The manifesto provides architectural intent and critique: vector-only retrieval is framed as insufficient, memory and context are treated as one system, stale context should decay, updates should create new versions instead of overwrites, and temporal correctness matters for multi-session reasoning (https://hydradb.com/manifesto).

The blog corpus adds implementation patterns and operational practices. Key pages used in this analysis include:

1. Scaling memory systems: hybrid retrieval as vector + BM25 + metadata-first filtering + weighted reranking; graph and temporal reasoning; automated ingestion; entity extraction; temporal markers; continuous learning from user interactions, retrieval outcomes, and tenant-level patterns; SDK/API usage; audit logging; and a broad retrieval control surface (described as more than 20 retrieval parameters) (https://hydradb.com/blog/how-to-design-llm-memory-systems-that-scale).
2. Cortex vs RAG-only memory: persistent versioned state, time-aware graph, self-improving retrieval, benchmark claims (https://hydradb.com/blog/why-cortex-outperforms-rag-only-memory-architectures).
3. Shared memory across agents: hierarchical propagation, strict boundaries, real-time sync, Hive Mode (https://hydradb.com/blog/how-to-share-llm-memory-across-ai-agents).
4. Governance for enterprise SaaS: policy/process/platform framing, access control, temporal versioning, audit logs and tracing, connectors (Gmail/Slack/Notion/Jira/databases/files), source-aware parsing, context-preserving chunks, entity resolution, temporal markers, strict access control, tenant isolation, and the Workleap audit case context (Hydra governance entry in corpus index context and related public governance article family such as https://hydradb.com/blog/how-to-extend-llm-memory-for-saas-products-2026-guide).
5. Refresh/update memory: temporal git-style relationship graph, append new versions, full auditability, tenant/session propagation (https://hydradb.com/blog/how-to-refresh-or-update-stored-llm-memory).
6. Cortex vs Mem0 and scaling comparisons: event-sourced architecture with three extraction layers for deterministic recall across months of interaction history; fact extraction layer with 60-90% storage savings; append-only ACID conversation audit trail; strict isolation with optional collaboration; GDPR cascade deletion; and one-click deletion across all layers (https://hydradb.com/blog/cortex-vs-mem0-which-is-better-for-production-llm-memory, https://hydradb.com/blog/mem0-vs-cortex-which-scales-better-for-multi-agent-systems).
7. Memory model explainer and forgetting patterns: layered memory stack with working, episodic, semantic/knowledge, and governance/observability memory, plus continuity-oriented architecture guidance (https://hydradb.com/blog/how-memory-works-in-large-language-models, https://hydradb.com/blog/why-is-my-llm-forgetting-past-conversations).

### Feature taxonomy synthesized from corpus

Across those pages, the HydraDB feature taxonomy appears in 11 stable clusters:

1. State model: memory as evolving, persistent state with explicit versioning.
2. Retrieval model: hybrid (vector + lexical + metadata filters + reranking).
3. Temporal model: timeline correctness, stale context decay, time-aware retrieval.
4. Graph model: relationship edges between entities, facts, sessions, and decisions.
5. Multi-agent model: shared memory with boundary-preserving propagation.
6. Multi-tenant model: strict isolation plus controlled collaboration paths.
7. Governance model: policy, process, and platform controls with auditing.
8. Security model: RBAC, SSO, encryption, audit trail, enterprise controls.
9. Ingestion model: connectors and source-aware parsing with provenance.
10. Learning model: retrieval improves from usage and outcome signals.
11. Operational model: low latency, multi-region, hosted plus self-host options.

This consistency across pages suggests intentional product architecture, not marketing-only variance.

## Inferred architecture and logic flows from the site corpus

### 1) Ingestion and normalization flow

HydraDB governance and scaling material points to a source-rich ingestion layer: enterprise connectors (Gmail, Slack, Notion, Jira, databases, files), source-aware parsing, context-preserving chunks, entity resolution, and temporal markers (https://hydradb.com/blog/how-to-extend-llm-memory-for-saas-products-2026-guide, https://hydradb.com/blog/how-to-design-llm-memory-systems-that-scale).

Inferred flow:

1. Connectors pull heterogeneous source events/documents.
2. Parser extracts semantic units while retaining source provenance.
3. Entity resolver links aliases to canonical entities.
4. Temporal annotator stamps event-time and validity windows.
5. Normalizer emits structured memory objects for indexing and graph linkage.

Hydra language indicates ingestion is not a one-time ETL. It is a continuous feed into state maintenance.

### 2) Versioned memory state flow

Manifesto and refresh/update posts repeatedly emphasize "create new version, do not overwrite" and "temporal git-style relationship graph" (https://hydradb.com/manifesto, https://hydradb.com/blog/how-to-refresh-or-update-stored-llm-memory).

Inferred flow:

1. Incoming fact/intention conflicts are detected against existing state.
2. System writes a new version node with lineage metadata.
3. Previous versions remain queryable for audit and temporal reasoning.
4. Contradictions are represented as explicit relations, not silent replacement.
5. Time-aware retrieval resolves "what was true when" by timestamp and validity context.

This suggests append-first state evolution with historical traceability as a default invariant.

### 3) Hybrid retrieval and ranking flow

Hydra scaling and Cortex pages describe a retrieval pipeline with multiple signals: vector similarity, BM25 lexical support, metadata-first filtering, weighted reranking, graph/temporal reasoning, and large parameter surface for tuning retrieval behavior (https://hydradb.com/blog/how-to-design-llm-memory-systems-that-scale, https://hydradb.com/blog/why-cortex-outperforms-rag-only-memory-architectures).

Inferred flow:

1. Apply hard metadata filters first (tenant, user, agent, policy scope, time windows).
2. Run parallel candidate generation channels (vector and lexical).
3. Merge and deduplicate candidates.
4. Apply graph traversal/neighbor expansion for relationship context.
5. Apply temporal correctness scoring and staleness penalties.
6. Weighted rerank with query-intent and policy-aware factors.
7. Return ranked context package with provenance and audit metadata.

Hydra claims that retrieval quality improves over time from interaction and retrieval outcomes, implying online or periodic weight adaptation loops.

### 4) Multi-agent and multi-tenant propagation flow

The shared-memory article describes hierarchical context propagation, strict user/agent boundaries, robust multi-tenant architecture, and Hive Mode for controlled sharing (https://hydradb.com/blog/how-to-share-llm-memory-across-ai-agents). The Mem0 comparison adds strict isolation plus optional collaboration behavior and deletion semantics (https://hydradb.com/blog/mem0-vs-cortex-which-scales-better-for-multi-agent-systems).

Inferred flow:

1. Each event is tagged with tenant, user, agent, and session identity.
2. Policy engine determines visibility and propagation targets.
3. Shared graph edges are published to approved collaboration domains.
4. Local/private memories remain isolated by default.
5. Sync layer updates peers while preserving boundary constraints.

This is effectively a memory control plane, not just a storage namespace.

### 5) Governance and security flow

Hydra enterprise claims include RBAC, SSO, audit logs, encryption, and governance framing that combines policy, process, and platform controls (https://hydradb.com/, https://hydradb.com/blog/how-to-extend-llm-memory-for-saas-products-2026-guide).

Inferred flow:

1. Policy definitions encode data classes, access constraints, retention, and deletion rules.
2. Runtime enforcement checks every read/write/retrieval operation against identity context.
3. Audit/tracing records decision path, source provenance, and retrieval rationale.
4. Compliance operations execute cascade deletion and evidence export.

This governance layer is tightly coupled to retrieval and state mutation, not an afterthought.

## Current system-spec-kit features that already align

system-spec-kit already contains substantial building blocks compatible with Hydra patterns.

### State and schema primitives

The MCP server uses a rich `memory_index` schema with temporal, tiering, quality, and FSRS-related attributes, plus vector metadata and lexical indexing tables. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1300-1407] It is currently SQLite-coupled (`better-sqlite3`, `sqlite-vec`), but functionally it already models many fields needed for richer state behavior. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/package.json:2-43]

### Graph and causal reasoning

Causal edges are first-class with relation types (`caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`) and indexes. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:248-278] Causal boosting already performs bounded graph traversal with relation multipliers and candidate injection logic. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:13-218]

### Audit, conflict, and quality traces

Conflict journaling exists via `memory_conflicts` with action types, similarity, contradiction fields, and timestamps. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1238-1263] PE-gating logs decisions into this conflict channel. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:299-315] This is close to the auditability direction Hydra emphasizes.

### Hybrid retrieval orchestration

Stage 1 candidate generation already orchestrates multiple channels (multi-concept, hybrid deep mode, vector fallback) and supports quality/tier/context filters. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:7-33] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:217-319] Weighted lexical retrieval is explicit through FTS5 BM25 column weights and rank normalization. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:16-114]

### Cognitive layering and temporal signal handling

Working memory has session-scoped attention state and decay logic. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:25-67] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:128-217] Long-term memory decay and review scheduling are implemented with FSRS formulas and interval prediction. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:7-215] Access tracking captures recency and usage signals that can feed retrieval adaptation. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:13-220]

### Lifecycle and ingestion operations

Save pipeline includes per-spec-folder mutexing, validation, quality loop integration, and chunk-aware processing. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:88-223] Spec document discovery and level inference provide document-aware ingestion coverage. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:15-159] Job queue supports stateful async ingestion lifecycle and crash-safe transitions. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:14-255]

### Breadth signal

The undocumented feature scan confirms meaningful latent capability depth (55 gaps vs catalog), especially in operations and cognitive/retrieval subsystems, which indicates strong internal substrate for Hydra-style evolution. [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/undocumented-features-scan.md:1-160]

## Missing capabilities and gaps vs Hydra patterns

### Gap 1: first-class versioned state graph

system-spec-kit has history and conflicts, but not a canonical memory-state version graph where every mutation becomes lineage-preserving state with temporal query semantics by default. Hydra corpus strongly emphasizes this as foundational (https://hydradb.com/manifesto, https://hydradb.com/blog/how-to-refresh-or-update-stored-llm-memory).

### Gap 2: temporal correctness as retrieval contract

Current temporal signals exist, but retrieval does not yet enforce explicit "truth at time T" resolution across versions/edges as a primary API contract. Hydra repeatedly treats temporal correctness as core behavior (https://hydradb.com/manifesto, https://hydradb.com/blog/why-cortex-outperforms-rag-only-memory-architectures).

### Gap 3: hierarchical multi-tenant boundary engine

Current code is strongly scoped by spec folder/session context, but not by enterprise-grade tenant-user-agent hierarchy with policy-driven propagation and collaboration modes. Hydra shared-memory pages describe strict boundaries plus controlled sharing as central (https://hydradb.com/blog/how-to-share-llm-memory-across-ai-agents, https://hydradb.com/blog/mem0-vs-cortex-which-scales-better-for-multi-agent-systems).

### Gap 4: source-aware enterprise ingestion connectors

system-spec-kit currently ingests local spec artifacts well, but Hydra governance/scaling material describes broad connector ecosystems with provenance-preserving parsing and entity resolution for SaaS enterprise data surfaces (https://hydradb.com/blog/how-to-extend-llm-memory-for-saas-products-2026-guide, https://hydradb.com/blog/how-to-design-llm-memory-systems-that-scale).

### Gap 5: closed-loop retrieval learning at tenant scale

Access tracking exists, but there is no complete feedback loop that learns from retrieval outcomes, user corrections, and tenant-level patterns to continuously adapt retrieval/reranking policies at runtime. Hydra claims this loop as a differentiator (https://hydradb.com/blog/how-to-design-llm-memory-systems-that-scale, https://hydradb.com/blog/why-cortex-outperforms-rag-only-memory-architectures).

### Gap 6: governance control plane and compliance ergonomics

Audit primitives exist, yet full governance packaging (policy/process/platform coherence, enterprise access workflows, deletion guarantees, traceability UX) is not currently a first-class cross-cutting layer in the MCP server. Hydra pages present governance as product-critical, not optional add-on (https://hydradb.com/, https://hydradb.com/blog/how-to-extend-llm-memory-for-saas-products-2026-guide).

## Key learnings and high-value approaches to adopt

### 1) Reframe memory as state, not rows

Adopt a canonical state object that links memory content, version lineage, source provenance, confidence, temporal validity, and policy envelope. Persist append-only versions on mutation and compute "active view" as a projection. This is the single highest leverage Hydra pattern.

### 2) Make temporal correctness explicit in APIs

Introduce query semantics like `asOf`, `validDuring`, and `preferLatest` with deterministic precedence rules. Pair with staleness decay and contradiction surfacing. This aligns manifesto and refresh patterns with practical retrieval behavior (https://hydradb.com/manifesto, https://hydradb.com/blog/how-to-refresh-or-update-stored-llm-memory).

### 3) Add metadata-first filtering before retrieval scoring

Hydra emphasizes metadata-first filtering before hybrid ranking. system-spec-kit already has context/tier filters in Stage 1; extend this into a strict prefilter gate for tenant/user/agent/policy/time constraints before candidate generation. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:7-33]

### 4) Build a tenant-aware propagation layer

Generalize current session/spec-folder scope into hierarchical identity scopes (`tenantId`, `userId`, `agentId`, `sessionId`) with explicit propagation rules and optional collaboration modes. Hydra multi-agent sharing patterns suggest this is key for production multi-agent memory (https://hydradb.com/blog/how-to-share-llm-memory-across-ai-agents).

### 5) Strengthen provenance and source-aware chunking

For every ingested memory unit, capture source type, source object ID, extraction method, and redaction metadata. Working memory already includes source fields (`source_tool`, `source_call_id`, `extraction_rule_id`, `redaction_applied`), so this can extend from current schema patterns. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:43-60]

### 6) Implement retrieval outcome learning loops

Use access tracker + history + conflict signals as feedback events to update retrieval weights and edge strengths. Existing components make this feasible with incremental work:

1. Access tracker for implicit relevance feedback. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:13-220]
2. History/conflict journals for correction signals. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:17-204] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1238-1263]
3. Weight history table for auditable adaptation over time. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:582-723]

### 7) Elevate governance to platform concern

Hydra material treats governance as equal to retrieval quality. Mirror that by defining:

1. Policy model (who can read/write/share what memory class).
2. Process model (review, escalation, retention, deletion).
3. Platform model (enforcement hooks, audit APIs, trace exports).

This should be embedded in save, search, and share operations, not isolated in reporting tools.

### 8) Use infrastructure migration only as an enabler

A storage backend decision can improve operations, but Hydra-like differentiation comes from state semantics, temporal correctness, policy-aware multi-tenant propagation, and self-improving retrieval. Keep infra as supporting layer, not primary narrative.

## Bottom line

HydraDB public corpus describes a memory system architecture where retrieval is one stage inside a broader state lifecycle: source-aware ingestion, versioned and temporal memory state, graph-structured reasoning, strict tenant/agent boundaries, governance enforcement, and feedback-driven improvement. The important takeaway for system-spec-kit is that we already have many compatible primitives in local code, but they are distributed across subsystems rather than presented as one coherent state architecture. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1300-1407] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:13-218] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:88-223]

The highest-value path is to unify those primitives into a Hydra-like memory state platform: append-first versioning, temporal truth queries, hierarchical boundary propagation, provenance-preserving ingestion, and auditable feedback loops. If we execute that unification, system-spec-kit can move from a strong memory retrieval engine to a full production memory state system for multi-agent workflows.
