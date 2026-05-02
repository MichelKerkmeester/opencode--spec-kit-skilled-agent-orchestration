---
title: "Data Loaders"
description: "Data loader modules that normalize input from JSON files or native CLI capture, then hard-stop when no usable session data exists."
trigger_phrases:
  - "data loaders"
  - "load collected data"
  - "context loading"
---

# Data Loaders

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. SCRIPT IO](#2-script-io)
- [3. ENTRYPOINTS](#3-entrypoints)
- [4. VALIDATION FROM REPO ROOT](#4-validation-from-repo-root)
- [5. KEY FILES](#5-key-files)
- [6. BOUNDARIES](#6-boundaries)
- [7. RELATED](#7-related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

`scripts/loaders/` is the script-side ingestion layer for context generation. It loads explicit JSON input or normalized native capture data, validates that usable session data exists, and returns a consistent object for extractors and renderers.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:script-io -->
## 2. SCRIPT IO

| Source | Input | Output |
| --- | --- | --- |
| Explicit JSON | `dataFile` option | Parsed and normalized session data |
| Preferred capture | `preferredCaptureSource` option or `SYSTEM_SPEC_KIT_CAPTURE_SOURCE` | Normalized native capture data |
| Capture fallback | OpenCode, Claude Code, Codex CLI, Copilot CLI, Gemini CLI | First usable native capture payload |
| No data | Empty or unusable sources | `NO_DATA_AVAILABLE` hard stop |

<!-- /ANCHOR:script-io -->
<!-- ANCHOR:entrypoints -->
## 3. ENTRYPOINTS

- `loadData()` loads explicit or captured data and enforces the no-data hard stop.
- `loadFromJsonFile()` reads and validates explicit JSON data files.
- `loadFromNativeCapture()` loads normalized data from supported CLI capture sources.
- `index.ts` re-exports the public loader API for script consumers.

<!-- /ANCHOR:entrypoints -->
<!-- ANCHOR:validation-from-repo-root -->
## 4. VALIDATION FROM REPO ROOT

Run loader validation from the repository root:

```bash
npm --prefix .opencode/skill/system-spec-kit/scripts run build
node -e "const loaders=require('./.opencode/skill/system-spec-kit/scripts/dist/loaders'); console.log(Object.keys(loaders).sort())"
python3 .opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/scripts/loaders
```

<!-- /ANCHOR:validation-from-repo-root -->
<!-- ANCHOR:key-files -->
## 5. KEY FILES

| File | Purpose |
| --- | --- |
| `data-loader.ts` | Loads explicit data, applies path checks, normalizes capture data, and throws clear no-data errors |
| `index.ts` | Barrel export for the loader API |

<!-- /ANCHOR:key-files -->
<!-- ANCHOR:boundaries -->
## 6. BOUNDARIES

- Loaders do not extract decisions, files, diagrams, or implementation facts.
- Loaders do not render markdown or update spec documents.
- Path checks must stay inside the loader before any explicit file content is trusted.

<!-- /ANCHOR:boundaries -->
<!-- ANCHOR:related -->
## 7. RELATED

- `../extractors/README.md`
- `../renderers/README.md`
- `../utils/README.md`

<!-- /ANCHOR:related -->
