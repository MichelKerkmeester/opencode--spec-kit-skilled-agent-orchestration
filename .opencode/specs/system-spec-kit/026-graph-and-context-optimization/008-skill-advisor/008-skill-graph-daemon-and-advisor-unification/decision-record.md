---
title: "...graph-and-context-optimization/010-hook-parity/002-skill-graph-daemon-and-advisor-unification/decision-record]"
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
    last_updated_at: "2026-04-21T15:42:05Z"
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

Keep advisor ownership inside the system-spec-kit MCP server, with a self-contained `mcp_server/skill-advisor/` package and thin compatibility adapters for legacy Python and plugin callers.

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
