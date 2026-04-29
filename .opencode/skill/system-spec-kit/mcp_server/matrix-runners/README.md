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
- [2. QUICK START](#2--quick-start)
- [3. MANIFEST FORMAT](#3--manifest-format)
- [4. ADDING CELLS](#4--adding-cells)
- [5. ADAPTERS](#5--adapters)
- [6. VERIFICATION](#6--verification)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`matrix-runners/` turns packet 030's F1-F14 x CLI-executor design into executable cells for the five external CLI executors: `cli-codex`, `cli-copilot`, `cli-gemini`, `cli-claude-code`, and `cli-opencode`.

It does not run native or inline cells. Packet 035 already covered those surfaces with focused local runners.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:quick-start -->
## 2. QUICK START

```bash
cd .opencode/skill/system-spec-kit
npx tsx mcp_server/matrix-runners/run-matrix.ts \
  --output /tmp/spec-kit-matrix \
  --filter F1,F3 \
  --executors cli-gemini,cli-claude-code
```

The runner writes one JSONL file per cell plus `summary.tsv`:

```text
/tmp/spec-kit-matrix/
├── F1-cli-gemini.jsonl
├── F1-cli-claude-code.jsonl
└── summary.tsv
```
<!-- /ANCHOR:quick-start -->

<!-- ANCHOR:manifest-format -->
## 3. MANIFEST FORMAT

`matrix-manifest.json` is the frozen cell list. Each cell has:

| Field | Purpose |
|-------|---------|
| `featureId` | `F1` through `F14` |
| `featureName` | Human-readable feature surface |
| `executor` | One of the five CLI executors |
| `applicable` | `false` produces `NA` without invoking a CLI |
| `promptTemplate` | Relative template path under `matrix-runners/` or inline prompt text |
| `expectedSignal` | Substring or JavaScript regex used to mark stdout as `PASS` |
| `timeoutSeconds` | Per-cell timeout, defaulting operationally to 300 seconds |

`executorApplicabilityRules` records first-class exceptions, currently `F11` + `cli-gemini` as `NA`.
<!-- /ANCHOR:manifest-format -->

<!-- ANCHOR:adding-cells -->
## 4. ADDING CELLS

1. Add a manifest row with the feature, executor, applicability, template, expected signal, and timeout.
2. Add or update the referenced template under `templates/`.
3. Keep the expected signal unique enough for stdout matching, for example `MATRIX_CELL_PASS F8`.
4. Add adapter coverage only when the executor argv contract changes.
<!-- /ANCHOR:adding-cells -->

<!-- ANCHOR:adapters -->
## 5. ADAPTERS

Each adapter returns:

```typescript
type AdapterStatus = 'PASS' | 'FAIL' | 'TIMEOUT_CELL' | 'NA' | 'BLOCKED';
```

Spawn errors, including `EAGAIN`, `ENOSPC`, missing binaries, and permission failures, return `BLOCKED`. Timeout returns `TIMEOUT_CELL`. A zero exit without the expected stdout signal returns `FAIL`.
<!-- /ANCHOR:adapters -->

<!-- ANCHOR:verification -->
## 6. VERIFICATION

Use the targeted smoke suite. It mocks `spawn` and never invokes real CLIs:

```bash
cd .opencode/skill/system-spec-kit/mcp_server
npx vitest run matrix-adapter
```
<!-- /ANCHOR:verification -->
