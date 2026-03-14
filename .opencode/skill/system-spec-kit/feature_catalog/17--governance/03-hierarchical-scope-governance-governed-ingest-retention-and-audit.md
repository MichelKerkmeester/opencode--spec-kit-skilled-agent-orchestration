# Hierarchical scope governance, governed ingest, retention, and audit

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. IN SIMPLE TERMS](#3--in-simple-terms)
- [4. SOURCE FILES](#4--source-files)
- [5. SOURCE METADATA](#5--source-metadata)
- [6. PLAYBOOK COVERAGE](#6--playbook-coverage)

## 1. OVERVIEW
Hierarchical scope governance enforces multi-scope controls across ingest and retrieval with provenance requirements, retention policies and an audit trail.

## 2. CURRENT REALITY
Phase 5 added governed multi-scope controls across ingest and retrieval. Scope is modeled hierarchically (`tenant`, `user` or `agent` and `session`) so reads and writes are evaluated against explicit actor boundaries.

Governed ingest now requires provenance metadata (`provenanceSource`, `provenanceActor`) when scoped identity fields are provided. Ingest attempts that carry scope identifiers without required provenance are rejected instead of being accepted as ambiguous writes.

Retention policy logic is integrated with governance controls, and allow/deny outcomes are recorded for auditability. The governance audit trail captures scope decisions so policy behavior can be reviewed and verified after runtime operations.

## 3. IN SIMPLE TERMS
This feature controls who can save and read memories and keeps a record of every decision it makes. When someone tries to save information, the system checks their identity and requires proof of where the information came from. It is like a secure document room where you must show your badge, sign in and explain what you are filing before you are allowed to add or retrieve anything.
## 4. SOURCE FILES
### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/governance/scope-governance.ts` | Lib | Scope evaluation and allow/deny decisioning |
| `mcp_server/lib/governance/retention.ts` | Lib | Retention policy enforcement aligned with scope governance |
| `mcp_server/lib/search/vector-index-schema.ts` | Lib | Governance and audit schema support |
| `mcp_server/handlers/memory-save.ts` | Handler | Governed ingest validation and provenance enforcement |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/memory-governance.vitest.ts` | Governed ingest requirements, scope isolation and governance audit coverage |

## 5. SOURCE METADATA
- Group: Governance
- Source feature title: Hierarchical scope governance, governed ingest, retention, and audit
- Current reality source: Phase 015 implementation

## 6. PLAYBOOK COVERAGE
- Mapped to manual testing playbook scenario NEW-122

