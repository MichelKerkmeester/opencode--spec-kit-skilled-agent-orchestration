---
title: "Matrix Runners"
description: "Per-CLI adapter runners and meta-runner for the F1-F14 x CLI executor matrix."
trigger_phrases:
  - "matrix runners"
  - "F1 F14 matrix"
  - "CLI matrix adapters"
importance_tier: "normal"
---

# Matrix Runners

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

`matrix_runners/` turns the F1-F14 x CLI-executor matrix into executable cells for `cli-codex`, `cli-copilot`, `cli-gemini`, `cli-claude-code`, and `cli-opencode`.

Current state:

- `run-matrix.ts` parses the manifest, filters cells, invokes adapters, and writes results.
- `matrix-manifest.json` is the frozen cell list and expected-signal source.
- Adapters return `PASS`, `FAIL`, `TIMEOUT_CELL`, `NA`, or `BLOCKED`.
- Native and inline cells are covered by focused local runners, not this folder.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                         MATRIX RUNNERS                           │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────────┐      ┌────────────────────┐      ┌────────────────────┐
│ Operator or CI     │ ───▶ │ run-matrix.ts      │ ───▶ │ adapter-base.ts    │
│ selects cells      │      │ filters manifest   │      │ shared spawn logic │
└────────┬───────────┘      └─────────┬──────────┘      └─────────┬──────────┘
         │                            │                           │
         │                            ▼                           ▼
         │                 ┌────────────────────┐       ┌────────────────────┐
         └──────────────▶  │ matrix-manifest    │ ───▶  │ CLI adapters       │
                           │ feature x executor │       │ codex, copilot,    │
                           │ cells              │       │ gemini, claude, oc │
                           └─────────┬──────────┘       └─────────┬──────────┘
                                     │                            │
                                     ▼                            ▼
                           ┌────────────────────┐       ┌────────────────────┐
                           │ templates/         │       │ JSONL and summary  │
                           │ prompt payloads    │       │ TSV output         │
                           └────────────────────┘       └────────────────────┘

Dependency direction: runner ───▶ manifest and templates ───▶ adapters ───▶ CLI process.
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:directory-tree -->
## 3. DIRECTORY TREE

```text
mcp_server/matrix_runners/
├── run-matrix.ts                   # Main runner for filter, spawn, and aggregation
├── matrix-manifest.json            # Frozen F1-F14 x 5 executor cell list
├── adapter-base.ts                 # Shared adapter logic and status mapping
├── codex-adapter.ts                # Codex CLI adapter
├── copilot-adapter.ts              # Copilot CLI adapter
├── gemini-adapter.ts               # Gemini CLI adapter
├── claude-code-adapter.ts          # Claude Code adapter
├── opencode-adapter.ts             # OpenCode adapter
├── templates/                      # Prompt templates per cell
└── README.md
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 4. KEY FILES

| File | Responsibility |
|---|---|
| `run-matrix.ts` | Parses flags, reads the manifest, dispatches cells, and writes output files. |
| `matrix-manifest.json` | Defines feature ID, executor, applicability, prompt template, expected signal, and timeout. |
| `adapter-base.ts` | Holds shared spawn behavior, timeout handling, and status mapping. |
| `*-adapter.ts` | Maps one executor to its CLI argv and stdout matching contract. |
| `templates/` | Stores prompt payloads referenced by manifest cells. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Cell source | Add matrix coverage through `matrix-manifest.json`, not hard-coded runner branches. |
| Adapter scope | Change an adapter only when an executor argv or output contract changes. |
| Applicability | Use `applicable: false` for known `NA` cells before spawning a CLI. |
| Output | Write one JSONL file per cell plus `summary.tsv` in the selected output directory. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ Operator passes output, filter, executor │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ run-matrix.ts loads matrix-manifest.json │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Runner resolves template and adapter     │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Adapter spawns executor or returns NA    │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ Status maps to PASS, FAIL, TIMEOUT, NA   │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ JSONL cell output and summary.tsv        │
╰──────────────────────────────────────────╯
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `run-matrix.ts` | CLI module | Runs selected matrix cells and writes results. |
| `matrix-manifest.json` | Data file | Defines available cells and expected signals. |
| `adapter-base.ts` | Module | Centralizes shared adapter execution behavior. |
| `templates/` | Prompt assets | Provides reusable prompts for manifest cells. |

Example:

```bash
cd .opencode/skill/system-spec-kit
npx tsx mcp_server/matrix_runners/run-matrix.ts \
  --output /tmp/spec-kit-matrix \
  --filter F1,F3 \
  --executors cli-gemini,cli-claude-code
```

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 7. VALIDATION

Run from `.opencode/skill/system-spec-kit/mcp_server` unless noted.

```bash
npx vitest run matrix-adapter
```

Expected result: the smoke suite mocks `spawn` and exits with Vitest success without invoking real CLIs.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 8. RELATED

- [`../stress_test/README.md`](../stress_test/README.md)
- [`../tools/README.md`](../tools/README.md)
- [`../README.md`](../README.md)

<!-- /ANCHOR:related -->
