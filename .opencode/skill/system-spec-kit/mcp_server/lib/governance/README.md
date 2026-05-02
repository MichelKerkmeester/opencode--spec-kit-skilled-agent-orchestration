---
title: "Governance: Scope, Audit, and Retention"
description: "Scope enforcement, governed-ingest validation, audit logging, and memory retention sweeping."
trigger_phrases:
  - "scope governance"
  - "governed ingest"
---

# Governance: Scope, Audit, and Retention

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. DIRECTORY TREE](#3--directory-tree)
- [4. KEY FILES](#4--key-files)
- [5. BOUNDARIES AND FLOW](#5--boundaries-and-flow)
- [6. ENTRYPOINTS](#6--entrypoints)
- [7. VALIDATION](#7--validation)
- [8. RELATED](#8--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`lib/governance/` owns MCP server governance helpers. It normalizes request scope, validates governed-ingest metadata, records audit entries, and deletes expired governed memory rows.

Current responsibilities:

- Enforce tenant, user, agent, and session boundaries for governed reads and writes.
- Normalize provenance and retention fields before memory rows are persisted.
- Persist governance audit records for allow, deny, delete, and conflict decisions.
- Sweep `memory_index.delete_after` rows when governed retention expires.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                    LIB GOVERNANCE                                │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────┐      ┌────────────────────┐      ┌────────────────────┐
│ Handler input  │ ───▶ │ scope-governance   │ ───▶ │ memory_index rows  │
└────────────────┘      └─────────┬──────────┘      └────────────────────┘
                                  │
                                  ▼
                         ┌────────────────────┐
                         │ governance audit   │
                         └─────────┬──────────┘
                                   │
                                   ▼
                         ┌────────────────────┐
                         │ retention sweep    │
                         └────────────────────┘

Dependency direction: handlers ───▶ governance ───▶ search/storage tables
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:directory-tree -->
## 3. DIRECTORY TREE

```text
lib/governance/
+-- scope-governance.ts       # Scope normalization, ingest validation, filters, and audit helpers
+-- memory-retention-sweep.ts # Expired governed-row sweep and deletion ledger integration
`-- README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 4. KEY FILES

| File | Responsibility |
|---|---|
| `scope-governance.ts` | Defines scope types, validates governed ingest, applies query filters, and records governance audit entries. |
| `memory-retention-sweep.ts` | Selects expired `memory_index` rows, supports dry runs, deletes expired rows, and records retention metadata. |
| `README.md` | Describes governance ownership and safe edit boundaries. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Scope | Tenant, user, agent, and session scope must be normalized before governed operations use it. |
| Provenance | Governed ingest requires explicit source and actor metadata when scoped ingest validation applies. |
| Retention | `delete_after` controls lifecycle deletion for governed memory rows. |
| Audit | Governance decisions write audit entries through the governance table helpers. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ MCP handler or lifecycle sweep           │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Normalize scope and governed metadata    │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Apply filters or validate ingest fields  │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Persist audit or retention ledger data   │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ Scoped result or retention sweep result  │
╰──────────────────────────────────────────╯
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `validateGovernedIngest()` | Function | Normalizes and validates governed-ingest fields before persistence. |
| `recordGovernanceAudit()` | Function | Persists governance audit rows. |
| `runMemoryRetentionSweep()` | Function | Runs dry-run or destructive expiration sweeps over `memory_index`. |
| `MemoryRetentionSweepResult` | Type | Returned sweep summary, candidates, deleted IDs, and ledger state. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 7. VALIDATION

Run from `.opencode/skill/system-spec-kit/mcp_server`.

```bash
npx vitest run tests/governance-e2e.vitest.ts tests/memory-governance.vitest.ts tests/scope-governance-normalizer-parity.vitest.ts
```

Expected result: governed scope, ingest, audit, and retention behavior pass.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 8. RELATED

- [`../storage/README.md`](../storage/README.md)
- [`../../handlers/README.md`](../../handlers/README.md)
- [`../../tests/README.md`](../../tests/README.md)

<!-- /ANCHOR:related -->
