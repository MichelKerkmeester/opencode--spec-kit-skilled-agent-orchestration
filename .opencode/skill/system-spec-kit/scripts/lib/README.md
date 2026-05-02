---
title: "Scripts Library"
description: "Shared TypeScript and shell helper libraries used by system-spec-kit scripts."
trigger_phrases:
  - "scripts library"
  - "anchor generator"
  - "shell common"
---

# Scripts Library

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. PACKAGE TOPOLOGY](#3--package-topology)
- [4. KEY FILES](#4--key-files)
- [5. BOUNDARIES AND FLOW](#5--boundaries-and-flow)
- [6. ENTRYPOINTS](#6--entrypoints)
- [7. VALIDATION](#7--validation)
- [8. RELATED](#8--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`scripts/lib/` contains shared helpers for the script package. TypeScript modules compile to `scripts/dist/lib/`, while shell helpers are sourced directly by shell entrypoints.

Current state:

- TypeScript modules cover rendering, semantic extraction, frontmatter, memory quality and activity signals.
- Shell helpers centralize branch detection, template operations and shared validation utilities.
- Runtime JavaScript output is generated from TypeScript sources and should not be edited by hand.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────╮
│                       SCRIPTS LIBRARY                        │
╰──────────────────────────────────────────────────────────────╯

┌────────────────┐      ┌────────────────┐      ┌────────────────┐
│ TS callers     │ ───▶ │ lib/*.ts       │ ───▶ │ dist/lib/*.js  │
│ memory, core   │      │ source modules │      │ build output   │
└────────────────┘      └───────┬────────┘      └────────────────┘
                                │
                                ▼
                         ┌──────────────┐
                         │ shared pkg   │
                         │ imports      │
                         └──────────────┘

┌────────────────┐      ┌────────────────┐      ┌────────────────┐
│ Shell callers  │ ───▶ │ lib/*.sh       │ ───▶ │ spec and rules │
│ spec, rules    │      │ sourced funcs  │      │ workflows      │
└────────────────┘      └────────────────┘      └────────────────┘

Dependency direction: callers ───▶ lib source ───▶ shared package or shell primitives
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:package-topology -->
## 3. PACKAGE TOPOLOGY

```text
scripts/lib/
+-- anchor-generator.ts           # Stable markdown anchor generation
+-- ascii-boxes.ts                # Box drawing helpers for terminal output
+-- cli-capture-shared.ts         # CLI capture payload helpers
+-- content-filter.ts             # Content pre-processing helper
+-- decision-tree-generator.ts    # Decision tree structures
+-- embeddings.ts                 # Shared embedding wrapper
+-- flowchart-generator.ts        # Flowchart output generation
+-- frontmatter-migration.ts      # Frontmatter normalization helpers
+-- memory-frontmatter.ts         # Memory doc frontmatter handling
+-- phase-classifier.ts           # Workflow phase classification
+-- semantic-signal-extractor.ts  # Semantic signal extraction
+-- semantic-summarizer.ts        # Semantic content summarization
+-- session-activity-signal.ts    # Session activity signals
+-- simulation-factory.ts         # Simulation inputs and fixtures
+-- topic-keywords.ts             # Lexical topic extraction
+-- trigger-extractor.ts          # Trigger phrase extraction
+-- validate-memory-quality.ts    # Generated memory quality checks
+-- git-branch.sh                 # Git branch helper
+-- shell-common.sh               # Shared shell utility functions
+-- template-utils.sh             # Template rendering shell helpers
`-- README.md
```

Allowed direction:

- TypeScript callers may import `lib/*.ts` through package-local paths.
- Shell scripts may source `*.sh` helpers from this folder.
- Wrapper modules may delegate to `@spec-kit/shared` when the shared package owns the source behavior.

Disallowed direction:

- Library modules should not call CLI entrypoints.
- Shell helpers should not mutate files without the caller passing an explicit target path.
- Source files should not import generated `dist/` files.

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:key-files -->
## 4. KEY FILES

| File | Role |
|---|---|
| `anchor-generator.ts` | Creates stable anchor IDs for markdown sections. |
| `memory-frontmatter.ts` | Reads and writes memory frontmatter blocks. |
| `semantic-signal-extractor.ts` | Extracts semantic signals for routing and scoring. |
| `trigger-extractor.ts` | Extracts trigger phrases from document text. |
| `validate-memory-quality.ts` | Checks generated memory content before save or index. |
| `shell-common.sh` | Provides common shell functions for spec and rule scripts. |
| `template-utils.sh` | Provides shell helpers for template-based writes. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-and-flow -->
## 5. BOUNDARIES AND FLOW

TypeScript helper flow:

```text
╭──────────────────────────────╮
│ TS script or module          │
╰──────────────────────────────╯
              │
              ▼
┌──────────────────────────────┐
│ Import scripts/lib/*.ts      │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Run pure helper logic        │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Return data to caller        │
└──────────────────────────────┘
```

Shell helper flow:

```text
╭──────────────────────────────╮
│ spec or rules shell script   │
╰──────────────────────────────╯
              │
              ▼
┌──────────────────────────────┐
│ Source scripts/lib/*.sh      │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Call helper with target path │
└──────────────────────────────┘
```

<!-- /ANCHOR:boundaries-and-flow -->

---

<!-- ANCHOR:entrypoints -->
## 6. ENTRYPOINTS

This folder has no standalone CLI entrypoint. Consumers import or source specific helpers.

Example import after build:

```bash
node -e "import('./.opencode/skill/system-spec-kit/scripts/dist/lib/anchor-generator.js').then(m => console.log(typeof m.generateAnchorId))"
```

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 7. VALIDATION

Use repository-root commands:

```bash
npm --prefix .opencode/skill/system-spec-kit/scripts run build
node -e "import('./.opencode/skill/system-spec-kit/scripts/dist/lib/anchor-generator.js').then(m => console.log(typeof m.generateAnchorId))"
```

Shell helper behavior is covered through the spec and rule validation scripts that source it.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 8. RELATED

- [`../README.md`](../README.md)
- [`../spec/README.md`](../spec/README.md)
- [`../rules/README.md`](../rules/README.md)
- [`../../ARCHITECTURE.md`](../../ARCHITECTURE.md)

<!-- /ANCHOR:related -->
