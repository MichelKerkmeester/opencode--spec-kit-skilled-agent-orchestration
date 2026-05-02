---
title: "Derived Library: Skill Metadata Extraction"
description: "Extraction, provenance, sanitization and trust-lane helpers for derived skill-advisor metadata."
trigger_phrases:
  - "derived skill metadata"
  - "advisor metadata extraction"
  - "trust lanes"
---

# Derived Library: Skill Metadata Extraction

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

`lib/derived/` builds and cleans derived metadata used by skill-advisor recommendations. It extracts source fields, removes unsafe or low-quality content, records provenance and assigns trust lanes for downstream routing.

Current state:

- Extracts derived metadata from skill sources.
- Applies anti-stuffing and sanitization rules.
- Tracks provenance and trust-lane classification for advisor use.

---

## 2. DIRECTORY TREE

```text
derived/
+-- anti-stuffing.ts   # Content stuffing checks
+-- extract.ts         # Derived metadata extraction
+-- provenance.ts      # Provenance helpers
+-- sanitizer.ts       # Prompt-safe metadata sanitization
+-- sync.ts            # Derived metadata sync helpers
+-- trust-lanes.ts     # Trust-lane classification
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `extract.ts` | Extracts derived skill metadata from source records. |
| `sanitizer.ts` | Sanitizes derived text before advisor use. |
| `anti-stuffing.ts` | Detects content stuffing patterns. |
| `provenance.ts` | Preserves metadata provenance details. |
| `trust-lanes.ts` | Classifies metadata into advisor trust lanes. |
| `sync.ts` | Synchronizes derived metadata state. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | May import schema types and local metadata helpers. |
| Exports | Export derived metadata helpers, not scorer ranking decisions. |
| Ownership | Put metadata extraction and sanitization here. Put final scoring in `../scorer/`. |

Main flow:

```text
skill source metadata
  -> extract derived fields
  -> sanitize and check stuffing
  -> attach provenance and trust lane
  -> scorer consumes safe metadata
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `extract.ts` | TypeScript module | Derived metadata extraction. |
| `sanitizer.ts` | TypeScript module | Prompt-safe metadata cleanup. |
| `trust-lanes.ts` | TypeScript module | Trust-lane classification. |
| `sync.ts` | TypeScript module | Derived metadata sync. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/derived/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../../schemas/README.md`](../../schemas/README.md)
- [`../scorer/README.md`](../scorer/README.md)
