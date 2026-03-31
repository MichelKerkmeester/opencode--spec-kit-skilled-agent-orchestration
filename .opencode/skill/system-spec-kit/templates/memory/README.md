---
title: "Memory [template:memory/README.md]"
description: "Memory workflow rules for generated context files in spec folders."
trigger_phrases:
  - "memory"
  - "save context"
  - "generate-context"
importance_tier: "normal"
contextType: "general"
---
# Memory

Memory context files are generated, not hand-written.

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. HARD RULE](#2--hard-rule)
- [3. CREATION MODES](#3--creation-modes)
- [4. FOLDER INTENT](#4--folder-intent)
- [5. RELATED](#5--related)

<!-- /ANCHOR:table-of-contents -->

## 1. OVERVIEW
<!-- ANCHOR:overview -->

Use memory files to preserve project state, decisions, blockers, and next steps across sessions.

<!-- /ANCHOR:overview -->

## 2. HARD RULE
<!-- ANCHOR:warning -->

Never create memory files manually.
Always use:

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js <spec-folder-or-json-input>
```

<!-- /ANCHOR:warning -->

## 3. CREATION MODES
<!-- ANCHOR:creation -->

```bash
# Routine JSON mode
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/02--system-spec-kit

# Recovery subfolder / phase mode (parent/child)
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --recovery 003-parent/001-child

# Recovery bare child (auto-searches all parents for unique match)
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --recovery 001-child-name

# JSON payload mode
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json
```

Optional immediate index sync:
- run MCP `memory_save()` or `memory_index_scan()` after generation.

<!-- /ANCHOR:creation -->

## 4. FOLDER INTENT
<!-- ANCHOR:contents -->

`templates/memory/` is intentionally empty.
Actual memory files are written inside active spec folders at `specs/.../memory/`.

<!-- /ANCHOR:contents -->

## 5. RELATED
<!-- ANCHOR:related -->

- `../../references/memory/memory_system.md`
- `../../references/memory/save_workflow.md`
- `../../scripts/dist/memory/generate-context.js`

<!-- /ANCHOR:related -->
