---
title: "Skill Advisor Library: Runtime, Scoring And Metadata Helpers"
description: "TypeScript library modules for skill-advisor routing, scoring, daemon freshness, lifecycle metadata, compatibility and prompt-safe rendering."
trigger_phrases:
  - "skill advisor library"
  - "advisor runtime modules"
  - "skill advisor scoring"
---

# Skill Advisor Library: Runtime, Scoring And Metadata Helpers

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. PACKAGE TOPOLOGY](#3--package-topology)
- [4. DIRECTORY TREE](#4--directory-tree)
- [5. KEY FILES](#5--key-files)
- [6. BOUNDARIES AND FLOW](#6--boundaries-and-flow)
- [7. ENTRYPOINTS](#7--entrypoints)
- [8. VALIDATION](#8--validation)
- [9. RELATED](#9--related)

---

## 1. OVERVIEW

`skill_advisor/lib/` owns the TypeScript helper layer behind advisor recommendation, prompt-safe rendering, daemon freshness checks, lifecycle metadata, compatibility probes and scorer behavior. Handlers and scripts call these modules instead of duplicating advisor logic.

Current state:

- Centralizes prompt policy, normalization, scoring and render helpers.
- Groups compatibility, daemon, derived metadata, freshness, lifecycle, scorer, shadow and utility modules in focused subfolders.
- Keeps subprocess and source-cache behavior close to the advisor runtime path.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                      SKILL ADVISOR LIBRARY                       │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌────────────────┐      ┌──────────────────┐
│ Handlers     │ ───▶ │ Runtime values │ ───▶ │ Scorer / policy  │
│ scripts      │      │ render helpers │      │ normalization    │
└──────┬───────┘      └───────┬────────┘      └────────┬─────────┘
       │                      │                        │
       │                      ▼                        ▼
       │              ┌───────────────┐        ┌────────────────┐
       └───────────▶  │ Freshness     │ ───▶   │ Compatibility  │
                      │ daemon        │        │ lifecycle      │
                      └───────┬───────┘        └────────────────┘
                              │
                              ▼
                      ┌───────────────┐
                      │ Shadow data   │
                      └───────────────┘

Dependency direction: handlers/scripts -> lib -> schemas and shared helpers
```

---

## 3. PACKAGE TOPOLOGY

```text
lib/
+-- auth/                       # Trusted caller checks
+-- compat/                     # Compatibility and daemon probes
+-- corpus/                     # Text scoring helpers
+-- daemon/                     # Advisor daemon helpers
+-- derived/                    # Derived metadata helpers
+-- freshness/                  # Freshness and cache state helpers
+-- lifecycle/                  # Skill lifecycle metadata helpers
+-- scorer/                     # Advisor scorer implementation
+-- shadow/                     # Shadow-mode telemetry helpers
+-- utils/                      # Small utility functions
+-- advisor-runtime-values.ts   # Runtime defaults and constants
+-- prompt-policy.ts            # Prompt handling policy
+-- render.ts                   # Prompt-safe output rendering
+-- subprocess.ts               # Child-process wrapper helpers
`-- README.md
```

Allowed direction:

```text
handlers -> lib modules
scripts -> lib modules
lib modules -> schemas and shared utilities
```

Disallowed direction:

```text
lib modules -> MCP tool registration
lib modules -> test fixtures
subfolders -> handlers for runtime behavior
```

---

## 4. DIRECTORY TREE

```text
lib/
+-- advisor-runtime-values.ts
+-- affordance-normalizer.ts
+-- error-diagnostics.ts
+-- freshness.ts
+-- generation.ts
+-- metrics.ts
+-- normalize-adapter-output.ts
+-- prompt-cache.ts
+-- prompt-policy.ts
+-- render.ts
+-- skill-advisor-brief.ts
+-- source-cache.ts
+-- subprocess.ts
+-- scorer/
`-- README.md
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `advisor-runtime-values.ts` | Runtime constants and defaults used by advisor paths. |
| `affordance-normalizer.ts` | Normalizes prompt affordance signals before scoring. |
| `prompt-policy.ts` | Applies prompt-safe routing and rendering policy. |
| `render.ts` | Renders advisor results into prompt-safe output. |
| `skill-advisor-brief.ts` | Builds concise advisor recommendation briefs. |
| `normalize-adapter-output.ts` | Normalizes adapter result shapes. |
| `subprocess.ts` | Wraps external process execution for advisor scripts or probes. |

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | May import advisor schemas, shared helpers and focused local submodules. |
| Exports | Export reusable advisor runtime helpers, not MCP tool registration. |
| Ownership | Keep advisor computation and metadata helpers here. Put tool handlers in `../handlers/` and CLI wrappers in `../scripts/`. |

Main flow:

```text
prompt or status request
  -> handler or script entrypoint
  -> lib policy, scorer, freshness or compatibility helper
  -> prompt-safe advisor result or diagnostic payload
```

---

## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `render.ts` | Module | Formats advisor output for callers. |
| `prompt-policy.ts` | Module | Applies prompt-safety and routing policy. |
| `scorer/` | Folder | Native scoring implementation. |
| `compat/` | Folder | Compatibility and daemon probe helpers. |
| `freshness/` | Folder | Freshness state helpers. |

---

## 8. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/README.md
```

Expected result: exit code `0`.

---

## 9. RELATED

- [`../README.md`](../README.md)
- [`../handlers/README.md`](../handlers/README.md)
- [`../scripts/README.md`](../scripts/README.md)
