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

Use generated continuity artifacts to preserve project state, decisions, blockers, and next steps across sessions. In Gate E, packet recovery is canonicalized around `handover.md`, then `_memory.continuity`, then the packet's spec docs.

<!-- /ANCHOR:overview -->

## 2. HARD RULE
<!-- ANCHOR:warning -->

Never create continuity artifacts manually.
Always use:

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' specs/<###-spec-name>
```

<!-- /ANCHOR:warning -->

## 3. CREATION MODES
<!-- ANCHOR:creation -->

```bash
# Routine JSON mode
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
  --json '{"specFolder":"system-spec-kit","user_prompts":["Summarize the session"],"observations":["Capture the key outcome"],"recent_context":["List touched docs and validation"]}' \
  specs/system-spec-kit

# Recovery subfolder / phase mode (parent/child)
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --recovery 003-parent/001-child

# Recovery bare child (auto-searches all parents for unique match)
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --recovery 001-child-name

# Temp-file JSON payload mode
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/system-spec-kit
```

Optional immediate index sync:
- run MCP `memory_save()` or `memory_index_scan()` after generation.
- when both the payload and the CLI specify a spec folder, the explicit CLI target wins.

<!-- /ANCHOR:creation -->

## 4. FOLDER INTENT
<!-- ANCHOR:contents -->

`templates/memory/` is intentionally empty.
Canonical continuity now lives in packet-local sources: `handover.md`, `_memory.continuity`, and the packet's spec docs. This template exists to document the rule, not to encourage hand-authored `memory/` files.

<!-- /ANCHOR:contents -->

## 5. RELATED
<!-- ANCHOR:related -->

- `../../references/memory/memory_system.md`
- `../../references/memory/save_workflow.md`
- `../../scripts/dist/memory/generate-context.js`

<!-- /ANCHOR:related -->
