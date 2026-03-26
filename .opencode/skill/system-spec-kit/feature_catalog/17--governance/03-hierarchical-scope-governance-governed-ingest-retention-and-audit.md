---
title: "Hierarchical scope governance, governed ingest, retention, and audit"
description: "Hierarchical scope governance enforces multi-scope controls across ingest and retrieval with provenance requirements, retention policies and an audit trail."
---

# Hierarchical scope governance, governed ingest, retention, and audit

## 1. OVERVIEW

Hierarchical scope governance enforces multi-scope controls across ingest and retrieval with provenance requirements, retention policies and an audit trail.

This feature controls who can save and read memories and keeps a record of every decision it makes. When someone tries to save information, the system checks their identity and requires proof of where the information came from. It is like a secure document room where you must show your badge, sign in and explain what you are filing before you are allowed to add or retrieve anything.

---

## 2. CURRENT REALITY

Phase 5 added governed multi-scope controls across ingest and retrieval. Scope is modeled hierarchically (`tenant`, `user` or `agent`, `session`, and optional shared space) so reads and writes are evaluated against explicit actor boundaries.

Governed ingest now requires provenance metadata (`provenanceSource`, `provenanceActor`) when scoped identity fields are provided. Ingest attempts that carry scope identifiers without required provenance are rejected instead of being accepted as ambiguous writes.

Retention policy validation is integrated with governance controls, and allow/deny outcomes are recorded for auditability. `validateGovernedIngest()` now requires `deleteAfter` for `retentionPolicy: 'ephemeral'` and normalizes it into persisted governance metadata, so ephemeral rows always carry an explicit expiry timestamp.

The governed save post-step is fail-safe. `memory-save.ts` applies governance metadata and the corresponding allow-audit record inside a database transaction, and if that post-insert step fails it removes the just-created memory via `delete_memory_from_database(...)` instead of leaving behind a partially governed row.

The governance audit trail remains queryable after runtime operations. Audit rows are stored in `governance_audit`, and `reviewGovernanceAudit()` returns filtered rows plus aggregate summaries so allow/deny/delete/conflict behavior can be reviewed without manual database inspection.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/governance/scope-governance.ts` | Lib | Governed-ingest validation, scope filtering, audit writes, and audit review via `reviewGovernanceAudit()` |
| `mcp_server/lib/search/vector-index-schema.ts` | Lib | Defines governance storage, including `governance_audit` and supporting schema/indexes |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Lib | Applies scope filtering and shared-space allowlists during candidate generation |
| `mcp_server/handlers/memory-save.ts` | Handler | Validates governed ingest and transactionally applies governance metadata with fail-safe cleanup on failure |
| `mcp_server/handlers/memory-search.ts` | Handler | Normalizes scoped retrieval context before pipeline execution |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/memory-governance.vitest.ts` | Governed ingest requirements, scope isolation and governance audit coverage |
| `mcp_server/tests/governance-e2e.vitest.ts` | End-to-end scoped retrieval isolation and audit review |

---

## 4. SOURCE METADATA

- Group: Governance
- Source feature title: Hierarchical scope governance, governed ingest, retention, and audit
- Current reality source: Phase 015 implementation

---

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario 122
