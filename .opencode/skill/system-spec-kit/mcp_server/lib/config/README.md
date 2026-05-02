---
title: "Config: Memory and Spec Document Classification"
description: "Configuration modules for memory decay, spec document path detection and rollout flags."
trigger_phrases:
  - "memory types"
  - "half-life configuration"
  - "type inference"
---

# Config: Memory and Spec Document Classification

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

`lib/config/` owns memory type configuration, spec document path detection, document type inference and memory roadmap capability flags. These modules convert file paths, frontmatter, tiers and runtime environment variables into typed configuration values used by indexing and retrieval.

Current state:

- `memory-types.ts` defines memory decay types, spec document configs and document type helpers.
- `type-inference.ts` resolves memory types from content, paths, tiers and keywords.
- `spec-doc-paths.ts` filters canonical spec documents and graph metadata paths.
- `capability-flags.ts` resolves memory roadmap rollout state and parser environment names.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────╮
│ lib/config/                                  │
│ Classification and rollout settings          │
╰──────────────────────────────────────────────╯
                    │
                    ▼
┌──────────────────────────────────────────────┐
│ spec-doc-paths.ts                            │
│ Path normalization and spec document gates   │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│ memory-types.ts                              │
│ Decay config and document type config        │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│ type-inference.ts                            │
│ Frontmatter, tier, path and keyword inference│
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ capability-flags.ts                          │
│ Runtime roadmap and parser flags             │
└──────────────────────────────────────────────┘
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:directory-tree -->
## 3. DIRECTORY TREE

```text
config/
├── capability-flags.ts       # Runtime rollout flags and parser env name
├── memory-types.ts           # Memory decay and spec document config
├── spec-doc-paths.ts         # Spec document path gates and extraction helpers
├── type-inference.ts         # Memory type inference from content and metadata
└── README.md                 # Developer orientation
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 4. KEY FILES

| File | Role |
|---|---|
| `memory-types.ts` | Defines `MemoryTypeName`, half-lives, document types, spec document configs and validation helpers |
| `type-inference.ts` | Applies ordered inference from explicit frontmatter, spec document paths, importance tiers, path patterns and keywords |
| `spec-doc-paths.ts` | Normalizes spec paths, excludes working artifacts and extracts spec folder labels |
| `capability-flags.ts` | Resolves roadmap flags and exports `SPECKIT_PARSER_ENV` |

Imports used by this folder:

| Import | Used By | Purpose |
|---|---|---|
| `./spec-doc-paths.js` | `memory-types.ts`, `type-inference.ts` | Spec document path checks |
| `../utils/index-scope.js` | `spec-doc-paths.ts` | Memory indexing scope gate |
| `../cognitive/rollout-policy.js` | `capability-flags.ts` | Feature flag rollout check |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-and-flow -->
## 5. BOUNDARIES AND FLOW

Allowed imports:

- Config modules may import path gates, index scope checks and rollout policy helpers.
- Indexing, retrieval and scoring callers may import public config helpers directly from the owning file.

Disallowed ownership:

- Config does not read or write memory rows.
- Config does not apply ranking scores. It only returns typed classification data.

Inference flow:

```text
Memory or spec document metadata
          │
          ▼
Normalize path and reject excluded working artifacts
          │
          ▼
Resolve spec document type when path is canonical
          │
          ▼
Apply explicit frontmatter, tier, path or keyword inference
          │
          ▼
Return memory type, document type and confidence
```

<!-- /ANCHOR:boundaries-and-flow -->

---

<!-- ANCHOR:entrypoints -->
## 6. ENTRYPOINTS

Memory type imports:

```typescript
import {
  getDefaultType,
  getHalfLife,
  getHalfLifeForType,
  getSpecDocumentConfig,
  getValidTypes,
  inferDocumentTypeFromPath,
  isDecayEnabled,
  isValidType,
  resolveSpecDocumentType,
  validateHalfLifeConfig,
} from './memory-types.js'

import type {
  DocumentType,
  MemoryTypeConfig,
  MemoryTypeName,
  SpecDocumentConfig,
} from './memory-types.js'
```

Inference and path imports:

```typescript
import {
  extractSpecFolderFromGraphMetadataPath,
  extractSpecFolderFromSpecDocumentPath,
  inferMemoryType,
  inferMemoryTypesBatch,
  matchesSpecDocumentPath,
  normalizeSpecPath,
  validateInferredType,
} from './type-inference.js'
```

Public surfaces:

| File | Export Groups |
|---|---|
| `memory-types.ts` | `MEMORY_TYPES`, `HALF_LIVES_DAYS`, `PATH_TYPE_PATTERNS`, `KEYWORD_TYPE_MAP`, `SPEC_DOCUMENT_CONFIGS`, helper functions and public types |
| `type-inference.ts` | Inference helpers, batch inference, detailed suggestions and validation |
| `spec-doc-paths.ts` | Path normalization, spec document gates, graph metadata gates and spec folder extraction |
| `capability-flags.ts` | Roadmap flag helpers, `CAPABILITY_ENV`, `SPECKIT_PARSER_ENV` and public rollout types |

There is no source `index.ts` in this folder. Import from the file that owns the needed surface.

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 7. VALIDATION

Run from the repository root after editing this README:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/lib/config/README.md
```

Use package TypeScript checks when changing any `.ts` module in this folder.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 8. RELATED

| Resource | Relationship |
|---|---|
| `../README.md` | Parent library map |
| `../cognitive/README.md` | Rollout policy and decay consumers |
| `../scoring/README.md` | Scoring consumers for type and tier data |
| `../../configs/search-weights.json` | Runtime search weight configuration |

<!-- /ANCHOR:related -->
