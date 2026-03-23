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

Phase 5 added governed multi-scope controls across ingest and retrieval. Scope is modeled hierarchically (`tenant`, `user` or `agent` and `session`) so reads and writes are evaluated against explicit actor boundaries.

Governed ingest now requires provenance metadata (`provenanceSource`, `provenanceActor`) when scoped identity fields are provided. Ingest attempts that carry scope identifiers without required provenance are rejected instead of being accepted as ambiguous writes.

Retention policy logic is integrated with governance controls, and allow/deny outcomes are recorded for auditability. Ephemeral retention is now stricter: `validateGovernedIngest()` rejects `retentionPolicy: 'ephemeral'` when `deleteAfter` is missing, because retention sweeps key off `delete_after` and an unscheduled ephemeral row would never expire.

The governed save post-step is now fail-safe. `memory-save.ts` wraps governance field application and audit logging in a transaction, and if that post-insert step fails it deletes the just-created `memory_index` row instead of leaving behind a persisted record with missing tenant, actor, session, provenance, or retention metadata.

The governance audit trail captures scope decisions so policy behavior can be reviewed and verified after runtime operations.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/governance/scope-governance.ts` | Lib | Scope evaluation and allow/deny decisioning |
| `mcp_server/lib/governance/retention.ts` | Lib | Retention policy enforcement aligned with scope governance |
| `mcp_server/lib/search/vector-index-schema.ts` | Lib | Governance and audit schema support |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Lib | Applies scope filtering and shared-space allowlists to retrieval candidates |
| `mcp_server/handlers/memory-save.ts` | Handler | Governed ingest validation and provenance enforcement |
| `mcp_server/handlers/memory-search.ts` | Handler | Normalizes scoped retrieval context before pipeline execution |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/memory-governance.vitest.ts` | Governed ingest requirements, scope isolation and governance audit coverage |
| `mcp_server/tests/governance-e2e.vitest.ts` | End-to-end scoped retrieval isolation, retention sweeps and audit review |

---

## 4. SOURCE METADATA

- Group: Governance
- Source feature title: Hierarchical scope governance, governed ingest, retention, and audit
- Current reality source: Phase 015 implementation

---

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario 122
