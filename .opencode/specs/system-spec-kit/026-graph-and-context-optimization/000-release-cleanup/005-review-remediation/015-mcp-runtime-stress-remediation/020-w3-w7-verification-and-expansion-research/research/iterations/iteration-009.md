---
iteration: 9
focus: RQ9 - Enterprise-readiness gap analysis
newInfoRatio: 0.22
status: complete
---

# Iteration 009 - Enterprise Readiness

## Focus

Evaluate enterprise-readiness gaps around RBAC, multi-tenant isolation, SLA enforcement, audit trail expansion, observability, alerting, capacity planning, and compliance hooks.

## Evidence Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:120` defines `PipelineConfig`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:129` includes `specFolder`, `tenantId`, `userId`, and `agentId` scope fields.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:921` forwards normalized scope into search.
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:92` stores tenant, user, and agent identities in session state.
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:361` detects tenant identity mismatches.
- `.opencode/skill/system-spec-kit/mcp_server/lib/rag/trust-tree.ts:25` has no tenant/user/agent input fields.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/rerank-gate.ts:15` has no tenant/user/agent input fields.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts:14` has no tenant/user/agent input fields.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:288` warns if mutation ledger append fails.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/metrics.ts:152` stores durable advisor metrics under tmpdir.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/metrics.ts:267` defines alert thresholds for advisor hook metrics.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/metrics.ts:478` defines 17 canonical metrics gated by `SPECKIT_METRICS_ENABLED`.

## Findings

### F-ENT-001 - P2 - Identity scope exists, but W3-W7 decisions are not tenant-aware

The search and session layers carry tenant/user/agent identities, but W3 trust-tree input, W4 gate input, and W6 calibration input do not. That is acceptable for telemetry-only helpers, but it becomes an enterprise gap if decisions affect ranking, refusal, or cost.

### F-ENT-002 - P2 - Observability exists locally, but W3-W7 lack a unified audit trail

Advisor metrics and mutation-ledger warnings exist, but W3-W7 decisions are not durably tied to a traceable request envelope. W5 specifically lacks a shadow sink, and W4 only exposes rerank metadata when rerank applies.

## Enterprise Verdict

Enterprise readiness should not start by changing ranking. It should start by making W3-W7 decision metadata durable, scoped, and observable. After that, enforce tenant-aware limits and SLA thresholds.

## Gap Backlog

- RBAC: no role/policy check around W3-W7 decision controls found in reviewed W modules.
- Multi-tenant isolation: identity scope exists upstream, but W3-W7 helpers do not accept it.
- SLA enforcement: no p95/p99 budget enforcement for rerank/coco calibration decisions found in W modules.
- Audit trail: W5 shadow and W3 trust decisions need durable sinks.
- Observability: metrics exist, but not unified around a search decision envelope.
- Alerting: advisor hook thresholds exist; W3-W7 decision thresholds do not.
- Capacity planning: W6 overfetch multiplier needs budget controls before promotion.
- Compliance hooks: deletion ledger exists elsewhere; decision provenance needs comparable retention.

## Next Focus

Iteration 010 should synthesize expansion candidates and final planning packet.
