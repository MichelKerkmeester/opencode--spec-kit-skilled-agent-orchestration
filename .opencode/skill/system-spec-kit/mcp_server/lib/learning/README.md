---
title: "Learning: Correction Tracking"
description: "Correction tracking for memory stability updates and relation-aware cache invalidation."
trigger_phrases:
  - "learning corrections"
  - "memory stability"
  - "correction tracking"
---

# Learning: Correction Tracking

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

`lib/learning/` records corrections between memory rows and updates stability scores. It owns the `memory_corrections` table, relation enablement checks and graph cache invalidation after correction edge changes.

Current state:

- `corrections.ts` owns schema setup, correction writes, undo, chain traversal and stats.
- `index.ts` is the public barrel for snake_case and camelCase exports.
- The module imports graph cache clearers so relation updates do not leave stale graph signals.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────╮
│ lib/learning/                                │
│ Correction tracking boundary                 │
╰──────────────────────────────────────────────╯
                    │
                    ▼
┌──────────────────────────────────────────────┐
│ index.ts                                     │
│ Public barrel exports                        │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ corrections.ts                               │
│ Schema, writes, undo, queries and stats      │
└───────────┬──────────────────────┬───────────┘
            │                      │
            ▼                      ▼
┌──────────────────────┐  ┌────────────────────┐
│ better-sqlite3 DB    │  │ graph caches       │
│ memory_corrections   │  │ degree and signals │
└──────────────────────┘  └────────────────────┘
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:directory-tree -->
## 3. DIRECTORY TREE

```text
learning/
├── corrections.ts          # Correction schema, writes, undo, chains and stats
├── index.ts                # Public barrel exports
└── README.md               # Developer orientation
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 4. KEY FILES

| File | Role |
|---|---|
| `corrections.ts` | Owns correction types, constants, database state, schema setup and public operations |
| `index.ts` | Re-exports the audited public surface from `corrections.ts` |

Imports used by this folder:

| Import | Used By | Purpose |
|---|---|---|
| `better-sqlite3` | `corrections.ts` | Database handle and prepared statements |
| `../graph/graph-signals.js` | `corrections.ts` | Clears graph signal cache after relation changes |
| `../search/graph-search-fn.js` | `corrections.ts` | Clears graph degree cache after relation changes |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-and-flow -->
## 5. BOUNDARIES AND FLOW

Allowed imports:

- Learning may import database types and graph cache invalidation helpers.
- Callers should import from `lib/learning/index.js` rather than reaching into private state.

Disallowed ownership:

- Learning does not own retrieval ranking, memory parsing or graph search.
- Learning does not create memory rows. It records relations between existing rows.

Correction flow:

```text
Caller records correction
          │
          ▼
Validate relation flag and database handle
          │
          ▼
Ensure memory_corrections schema
          │
          ▼
Write correction and stability changes
          │
          ▼
Clear graph degree and signal caches
          │
          ▼
Return correction result
```

<!-- /ANCHOR:boundaries-and-flow -->

---

<!-- ANCHOR:entrypoints -->
## 6. ENTRYPOINTS

Public import path:

```typescript
import {
  deprecate_memory,
  ensure_schema,
  get_correction_chain,
  get_corrections_for_memory,
  get_corrections_stats,
  init,
  record_correction,
  undo_correction,
} from './index.js'

import type {
  CorrectionRecord,
  CorrectionResult,
  CorrectionStats,
  RecordCorrectionParams,
  UndoResult,
} from './index.js'
```

Public functions:

| Export | Purpose |
|---|---|
| `init`, `get_db`, `is_enabled`, `ensure_schema` | Module lifecycle and schema readiness |
| `record_correction`, `undo_correction` | Correction mutation APIs |
| `get_corrections_for_memory`, `get_correction_chain`, `get_corrections_stats` | Query APIs |
| `deprecate_memory`, `supersede_memory`, `refine_memory`, `merge_memories` | Convenience mutation APIs |
| CamelCase aliases | JavaScript-friendly names for the same public functions |

Public constants and types:

| Export | Purpose |
|---|---|
| `CORRECTION_TYPES` | Allowed correction labels |
| `CORRECTION_STABILITY_PENALTY` | Stability multiplier for corrected source rows |
| `REPLACEMENT_STABILITY_BOOST` | Stability multiplier for replacement rows |
| `CorrectionTypes`, `CorrectionRecord`, `CorrectionResult`, `CorrectionChain`, `CorrectionStats` | Public result and record shapes |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 7. VALIDATION

Run from the repository root after editing this README:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/lib/learning/README.md
```

Use the package TypeScript checks for runtime changes in `corrections.ts` or `index.ts`.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 8. RELATED

| Resource | Relationship |
|---|---|
| `../README.md` | Parent library map |
| `../graph/README.md` | Graph signal cache consumer |
| `../search/README.md` | Graph degree cache consumer |
| `../storage/README.md` | Memory row persistence context |

<!-- /ANCHOR:related -->
