---
title: "...graph-and-context-optimization/009-hook-parity/002-skill-graph-daemon-and-advisor-unification/decision-record]"
description: "Architectural decisions for the shipped Phase 027 skill-advisor unification work."
trigger_phrases:
  - "027 decisions"
  - "advisor daemon adr"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: adr | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification"
    last_updated_at: "2026-04-28T15:30:03Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Shipped implementation preserved; strict validation follow-up still pending"
    next_safe_action: "Keep validation green"
    completion_pct: 95
---
<!-- SPECKIT_TEMPLATE_SOURCE: adr | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Decision Record: 027 - Skill Graph Daemon and Advisor Unification

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Unified Advisor Architecture

### Status

Accepted.

### Context

The advisor needed automatic graph freshness, derived metadata, native scoring, MCP tools, compatibility shims, and promotion gates without splitting ownership across unrelated packages.

### Decision

Keep advisor ownership inside the system-spec-kit MCP server, with a self-contained `mcp_server/skill_advisor/` package and thin compatibility adapters for legacy Python and plugin callers.

### Consequences

- Advisor internals share one package boundary.
- Legacy callers remain supported through shims.
- Future routing improvements can be promoted through MCP tools without changing runtime hook contracts.

### Alternatives Considered

| Alternative | Rejected Because |
|-------------|------------------|
| Keep Python as primary advisor | Leaves graph freshness and MCP status split from the runtime owner. |
| Create a new standalone MCP server | Adds install and registration complexity without a clear benefit. |
| Enable semantic live scoring immediately | Latency and regression safety were not proven. |

### Implementation Notes

- Chokidar plus hash-aware SQLite indexer was selected for the daemon substrate.
- Workspace-scoped single-writer lease protects graph writes.
- Five-lane fusion starts with semantic shadow at 0.00 live weight.
- Schema migration is additive and rollback-safe.
- Python parity means regression protection, not byte-for-byte freeze.
<!-- /ANCHOR:adr-001 -->

<!-- ANCHOR:adr-002 -->
### ADR-002: Freshness and Recovery Boundary

### Status

Accepted.

### Decision

Generation metadata remains the freshness source of truth, while `initDb()` performs a live SQLite `quick_check` and rebuild recovery is serialized per database path.

### Consequences

- Corrupt SQLite files fail open to unavailable/rebuild behavior instead of producing authoritative recommendations.
- Concurrent rebuild attempts collapse to one writer; later callers observe the rebuilt graph.
<!-- /ANCHOR:adr-002 -->

<!-- ANCHOR:adr-003 -->
### ADR-003: Skill-Graph Response Envelope

### Status

Accepted.

### Decision

Skill-graph handlers share one response-envelope helper for `status`, `data`, `error`, optional `code`, and path redaction.

### Consequences

- Diagnostic redaction is centralized.
- Query/status/scan envelopes stay compatible while avoiding absolute filesystem leaks.
<!-- /ANCHOR:adr-003 -->

<!-- ANCHOR:adr-004 -->
### ADR-004: Scorer Lane Registry

### Status

Accepted.

### Decision

Lane ids, live/shadow status, and default weights are derived from `lane-registry.ts`; runtime weight for `derived_generated` is 0.15.

### Consequences

- Adding a lane starts in one registry.
- Documentation and runtime now agree on the 0.15 generated-lane weight.
<!-- /ANCHOR:adr-004 -->

<!-- ANCHOR:adr-005 -->
### ADR-005: MCP Caller Authority

### Status

Accepted.

### Decision

Mutable maintenance tools such as `skill_graph_scan` require transport-supplied trusted caller context. Tool arguments cannot self-assert trust.

### Consequences

- Untrusted public MCP callers receive `UNTRUSTED_CALLER` before mutation.
- Operator scan paths remain available to trusted local/daemon contexts.
<!-- /ANCHOR:adr-005 -->

<!-- ANCHOR:adr-006 -->
### ADR-006: Compat Contract Single Source

### Status

Accepted.

### Decision

Python and plugin bridge compatibility shims read shared status/default/env contracts from `compat-contract.json`, mirrored by `lib/compat/contract.ts`.

### Consequences

- Env names, default thresholds, and bridge status values no longer drift silently.
- TS consumers have a typed contract while non-TS shims consume JSON.
<!-- /ANCHOR:adr-006 -->

<!-- ANCHOR:adr-007 -->
### ADR-007: Promotion Gates

### Status

Accepted.

### Decision

Promotion evidence is represented by measured `advisor_validate` slices rather than a separate `gate-bundle.ts` artifact.

### Consequences

- Promotion-gate references resolve to shipped runtime surfaces.
- Semantic live influence remains locked until measured slices pass.
<!-- /ANCHOR:adr-007 -->
