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

- [1. OVERVIEW](#1--overview)
- [2. CURRENT INVENTORY](#2--current-inventory)
- [3. SOURCE PRIORITY](#3--source-priority)
- [4. SECURITY AND PATH HANDLING](#4--security-and-path-handling)
- [5. QUICK USAGE](#5--quick-usage)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `loaders/` directory provides the ingestion layer for memory generation.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:current-inventory -->
## 2. CURRENT INVENTORY


- `data-loader.ts` - source loading, path checks, normalization, and explicit no-data failure handling
- `index.ts` - public exports for loader API


<!-- /ANCHOR:current-inventory -->
<!-- ANCHOR:source-priority -->
## 3. SOURCE PRIORITY


`data-loader.ts` loads in this order:
1. Explicit JSON data file when `dataFile` is provided
2. Preferred native capture source when `preferredCaptureSource` or `SYSTEM_SPEC_KIT_CAPTURE_SOURCE` is set
3. Native capture fallback order:
   - OpenCode
   - Claude Code
   - Codex CLI
   - Copilot CLI
   - Gemini CLI
4. Hard-stop with `NO_DATA_AVAILABLE` when neither explicit data nor any native capture source produces usable session data


<!-- /ANCHOR:source-priority -->
<!-- ANCHOR:security-and-path-handling -->
## 4. SECURITY AND PATH HANDLING


- Path checks restrict data file access to expected safe base locations.
- macOS `/tmp` and `/private/tmp` handling is normalized.
- Invalid or unsafe paths fail fast instead of silently falling through.
- Explicit JSON mode surfaces `EXPLICIT_DATA_FILE_LOAD_FAILED: ...` for missing files, invalid JSON, and validation failures.


<!-- /ANCHOR:security-and-path-handling -->
<!-- ANCHOR:quick-usage -->
## 5. QUICK USAGE


```bash
node -e "const l=require('./.opencode/skill/system-spec-kit/scripts/dist/loaders'); console.log(Object.keys(l))"
```
<!-- /ANCHOR:quick-usage -->
