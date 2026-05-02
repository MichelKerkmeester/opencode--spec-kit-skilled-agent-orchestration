---
title: "Parsing"
description: "Shared parsers and health evaluators for memory frontmatter, spec documents and generated continuity evidence."
trigger_phrases:
  - "quality extractors"
  - "quality score parsing"
  - "frontmatter quality flags"
  - "spec doc health"
  - "memory sufficiency"
---

# Parsing

> Shared parsing functions for memory metadata, template contracts and spec document health checks. These utilities keep frontmatter parsing and document quality signals consistent across the memory pipeline.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. STABLE API](#3--stable-api)
- [4. BOUNDARIES](#4--boundaries)
- [5. VALIDATION](#5--validation)
- [6. RELATED DOCUMENTS](#6--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The parsing package centralizes small, deterministic document analyzers used by memory save, indexing and health reporting code. It handles frontmatter extraction, template contract checks, spec document health scoring and memory sufficiency checks.

Use this package when code needs the same parsing result in more than one runtime path. Keep endpoint behavior, file discovery and workflow orchestration outside this folder.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:structure -->
## 2. STRUCTURE

```text
parsing/
├── README.md
├── memory-sufficiency.ts
├── memory-template-contract.ts
├── quality-extractors.ts
├── quality-extractors.test.ts
├── spec-doc-health.ts
└── spec-doc-health.test.ts
```

| File | Purpose |
| ---- | ------- |
| `quality-extractors.ts` | Extracts `quality_score` and `quality_flags` from YAML frontmatter |
| `memory-template-contract.ts` | Validates rendered memory documents for required anchors and template artifacts |
| `memory-sufficiency.ts` | Scores whether memory evidence has enough concrete context to save |
| `spec-doc-health.ts` | Computes lightweight spec folder health metadata for pipeline annotations |
| `*.test.ts` | Edge-case coverage for frontmatter parsing and spec document health rules |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:stable-api -->
## 3. STABLE API

| Export | Source | Purpose |
| ------ | ------ | ------- |
| `extractQualityScore` | `quality-extractors.ts` | Parse `quality_score` as a clamped number from `0` to `1` |
| `extractQualityFlags` | `quality-extractors.ts` | Parse `quality_flags` as a string array |
| `validateMemoryTemplateContract` | `memory-template-contract.ts` | Check rendered memory files for required metadata, sections and anchors |
| `evaluateMemorySufficiency` | `memory-sufficiency.ts` | Reject vague memory evidence before it reaches persistence paths |
| `evaluateSpecDocHealth` | `spec-doc-health.ts` | Produce pass, score and per-file issue metadata for spec folders |

These functions return typed result objects instead of throwing for normal validation failures. Callers should treat thrown errors as infrastructure failures, not document-quality failures.

<!-- /ANCHOR:stable-api -->

---

<!-- ANCHOR:boundaries -->
## 4. BOUNDARIES

Import direction should flow from consumers into `shared/parsing`:

- MCP server workflows, memory save code and indexers may import parsing utilities.
- Parsing utilities may import Node standard modules when direct file inspection is required.
- Parsing utilities should avoid importing MCP endpoint code, database adapters or CLI command handlers.
- Cross-package shared types should come from `../types.ts` when needed.
- Tests should stay beside parser modules when they validate parser-only behavior.

This package owns parser rules. It does not own source-of-truth decisions about which spec folder or memory file should be processed.

<!-- /ANCHOR:boundaries -->

---

<!-- ANCHOR:validation -->
## 5. VALIDATION

Run parser tests and TypeScript checks after behavior changes:

```bash
npm test -- --runInBand parsing
npx tsc --noEmit
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/shared/parsing/README.md
```

For README-only edits, `validate_document.py` is the required file-level check.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 6. RELATED DOCUMENTS

| Document | Purpose |
| -------- | ------- |
| [shared/README.md](../README.md) | Parent shared library overview |
| [shared/types.ts](../types.ts) | Shared types consumed by parser callers |
| [shared/utils/README.md](../utils/README.md) | Utility helpers used by nearby shared packages |

<!-- /ANCHOR:related -->

---
