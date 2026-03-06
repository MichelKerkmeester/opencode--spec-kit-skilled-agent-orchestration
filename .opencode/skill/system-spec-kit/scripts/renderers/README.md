---
title: "Template Renderers"
description: "Renderer modules for Mustache-like template population and output cleanup."
trigger_phrases:
  - "template renderer"
  - "populate template"
  - "spec template rendering"
---


# Template Renderers

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT INVENTORY](#2--current-inventory)
- [3. BEHAVIOR](#3--behavior)
- [4. RUNTIME](#4--runtime)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `renderers/` directory turns extracted session data into markdown output for memory and spec-context documents.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:current-inventory -->
## 2. CURRENT INVENTORY


- `template-renderer.ts` - variable substitution, sections, loops, and cleanup
- `index.ts` - public export surface for renderer functions


<!-- /ANCHOR:current-inventory -->
<!-- ANCHOR:behavior -->
## 3. BEHAVIOR


- Supports Mustache-like placeholders and section blocks.
- Handles conditional and inverted blocks.
- Cleans leaked template and instructional blocks before final write.
- Works with extractor output and core write/index steps.


<!-- /ANCHOR:behavior -->
<!-- ANCHOR:runtime -->
## 4. RUNTIME


Compile TypeScript and use runtime output from `dist/renderers/`.

```bash
cd .opencode/skill/system-spec-kit/scripts && npm run build
node -e "const r=require('./.opencode/skill/system-spec-kit/scripts/dist/renderers'); console.log(Object.keys(r))"
```
<!-- /ANCHOR:runtime -->
