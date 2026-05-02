---
title: "Freshness Library: Advisor Cache And Trust State"
description: "Freshness, cache invalidation, rebuild and trust-state helpers for skill-advisor generated data."
trigger_phrases:
  - "advisor freshness"
  - "trust state"
  - "cache invalidation"
---

# Freshness Library: Advisor Cache And Trust State

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DIRECTORY TREE](#2--directory-tree)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES AND FLOW](#4--boundaries-and-flow)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

---

## 1. OVERVIEW

`lib/freshness/` evaluates whether generated advisor data can be trusted. It manages cache invalidation, generation metadata, rebuild-from-source behavior, SQLite integrity checks and trust-state values.

Current state:

- Encodes trust-state values and helpers.
- Supports rebuild-from-source decisions when generated data is stale.
- Checks cache invalidation and SQLite integrity signals.

---

## 2. DIRECTORY TREE

```text
freshness/
+-- cache-invalidation.ts   # Cache invalidation checks
+-- generation.ts           # Generation freshness metadata
+-- rebuild-from-source.ts  # Rebuild decision helpers
+-- sqlite-integrity.ts     # SQLite integrity checks
+-- trust-state-values.ts   # Trust-state constants
+-- trust-state.ts          # Trust-state evaluation
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `trust-state.ts` | Evaluates current advisor trust state. |
| `trust-state-values.ts` | Defines trust-state constants. |
| `cache-invalidation.ts` | Detects cache invalidation conditions. |
| `generation.ts` | Reads and compares generation metadata. |
| `rebuild-from-source.ts` | Decides whether a source rebuild is needed. |
| `sqlite-integrity.ts` | Checks SQLite data integrity signals. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | May inspect generated metadata, cache state and database integrity helpers. |
| Exports | Export freshness and trust-state helpers only. |
| Ownership | Put advisor generated-data freshness here. Put daemon lifecycle in `../daemon/`. |

Main flow:

```text
generated advisor state
  -> cache, generation and SQLite checks
  -> trust-state evaluation
  -> caller decides live, stale or rebuild behavior
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `trust-state.ts` | TypeScript module | Computes advisor trust state. |
| `rebuild-from-source.ts` | TypeScript module | Rebuild decision helper. |
| `cache-invalidation.ts` | TypeScript module | Cache invalidation helper. |
| `sqlite-integrity.ts` | TypeScript module | Database integrity helper. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../daemon/README.md`](../daemon/README.md)
- [`../../schemas/README.md`](../../schemas/README.md)
