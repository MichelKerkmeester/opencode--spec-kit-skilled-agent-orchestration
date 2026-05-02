---
title: "Lifecycle Library: Advisor Skill State Transitions"
description: "Age, archive, rollback, migration, status and supersession helpers for skill-advisor lifecycle metadata."
trigger_phrases:
  - "advisor lifecycle"
  - "skill supersession"
  - "advisor rollback"
---

# Lifecycle Library: Advisor Skill State Transitions

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

`lib/lifecycle/` contains helpers for advisor-facing skill lifecycle metadata. It covers age haircuts, archive handling, rollback metadata, schema migration, status values and skill supersession rules.

Current state:

- Applies age and archive rules to skill metadata.
- Supports rollback and schema migration behavior.
- Encodes status values and supersession logic used by advisor routing.

---

## 2. DIRECTORY TREE

```text
lifecycle/
+-- age-haircut.ts        # Age-based ranking adjustment helpers
+-- archive-handling.ts   # Archive state handling
+-- rollback.ts           # Rollback metadata helpers
+-- schema-migration.ts   # Lifecycle schema migration helpers
+-- status-values.ts      # Lifecycle status constants
+-- supersession.ts       # Supersession rules
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `age-haircut.ts` | Applies age-based adjustment to lifecycle-aware ranking. |
| `archive-handling.ts` | Handles archived skill metadata. |
| `rollback.ts` | Tracks rollback metadata and behavior. |
| `schema-migration.ts` | Migrates lifecycle metadata shapes. |
| `status-values.ts` | Defines lifecycle status constants. |
| `supersession.ts` | Encodes supersession relationships between skills. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | May use lifecycle schemas and derived metadata helpers. |
| Exports | Export lifecycle metadata helpers only. |
| Ownership | Put skill lifecycle state here. Put freshness and daemon state in sibling folders. |

Main flow:

```text
skill lifecycle metadata
  -> migration or rollback handling
  -> archive and age adjustment
  -> supersession and status evaluation
  -> advisor ranking or redirect decision
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `status-values.ts` | TypeScript module | Lifecycle status constants. |
| `supersession.ts` | TypeScript module | Supersession evaluation. |
| `schema-migration.ts` | TypeScript module | Metadata migration helper. |
| `rollback.ts` | TypeScript module | Rollback metadata helper. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/lifecycle/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../freshness/README.md`](../freshness/README.md)
- [`../derived/README.md`](../derived/README.md)
