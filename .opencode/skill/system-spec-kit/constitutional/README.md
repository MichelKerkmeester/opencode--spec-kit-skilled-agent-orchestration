---
title: "Constitutional Rules: Always-Surface Memory Files"
description: "Markdown rule files that define always-surfaced Spec Kit Memory constraints."
trigger_phrases:
  - "constitutional memory"
  - "always-surface rules"
  - "constitutional tier"
---

# Constitutional Rules: Always-Surface Memory Files

> Markdown rule files for global Spec Kit Memory constraints that must surface ahead of ordinary search results.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. PACKAGE TOPOLOGY](#2--package-topology)
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

`constitutional/` contains Markdown rule files indexed as the constitutional tier in Spec Kit Memory. Constitutional records are intended for global rules that must surface before ordinary search results, such as gate enforcement and search-tool routing.

Current state:

- The folder contains two active rule files: `gate-enforcement.md` and `gate-tool-routing.md`.
- Rule files use frontmatter with `importanceTier: constitutional` and trigger phrases.
- Constitutional rules support agent safety and retrieval routing. They do not replace packet recovery from `handover.md`, `_memory.continuity` and canonical spec docs.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:package-topology -->
## 2. PACKAGE TOPOLOGY

```text
constitutional/
+-- gate-enforcement.md     # Gate edge cases and cross-reference rules
+-- gate-tool-routing.md    # Search and retrieval routing rules
`-- README.md               # Folder topology and editing guidance
```

Rule-file shape:

```markdown
---
title: "RULE TITLE"
importanceTier: constitutional
contextType: decision
triggerPhrases:
  - relevant phrase
---

# Rule Title

<!-- ANCHOR:rule-section -->
## RULE SECTION

Rule content.

<!-- /ANCHOR:rule-section -->
```

Allowed dependency direction:

```text
constitutional/*.md -> memory indexing metadata
memory_search() -> constitutional records first, then query results
memory_match_triggers() -> trigger phrase matches
```

Disallowed dependency direction:

```text
constitutional rules -> packet-specific status or mutable packet history
constitutional rules -> runtime code behavior not enforced elsewhere
README.md -> replacement for the rule files themselves
```

<!-- /ANCHOR:package-topology -->

---

<!-- ANCHOR:directory-tree -->
## 3. DIRECTORY TREE

```text
constitutional/
+-- gate-enforcement.md     # Gate enforcement edge cases and cross-reference guidance
+-- gate-tool-routing.md    # Search, retrieval, graph and CocoIndex routing rules
`-- README.md               # This folder guide
```

Do not document `.DS_Store` or other local machine artifacts as part of the package.

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 4. KEY FILES

| File | Responsibility |
|---|---|
| `gate-enforcement.md` | Defines hard and soft gate behavior for edge cases, continuation and tool-use ordering. |
| `gate-tool-routing.md` | Defines search and retrieval routing rules across memory, code graph and CocoIndex. |
| `README.md` | Explains folder ownership, file topology and validation steps. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-flow -->
## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Rule files are Markdown inputs for memory indexing. They do not import code. |
| Exports | Indexed records surface through memory search and trigger matching. |
| Ownership | This folder owns global always-surface rules only. Packet-specific decisions stay in spec folders. |
| Rule language | Use direct MUST, STOP and REQUIRED language only when the rule is an actual hard constraint. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ constitutional/*.md                      │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ frontmatter and ANCHOR sections          │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ memory_save or memory_index_scan         │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ constitutional-tier memory records       │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ surfaced in search and trigger results   │
╰──────────────────────────────────────────╯
```

<!-- /ANCHOR:boundaries-flow -->

---

<!-- ANCHOR:entrypoints -->
## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `gate-enforcement.md` | Rule document | Always-surfaced gate enforcement guidance. |
| `gate-tool-routing.md` | Rule document | Always-surfaced tool-routing guidance. |
| `memory_search({ includeConstitutional: true })` | MCP tool behavior | Returns constitutional records before query-relevant records by default. |
| `memory_match_triggers({ prompt })` | MCP tool behavior | Surfaces matching rules from trigger phrases. |
| `memory_save({ filePath })` | MCP tool behavior | Indexes a single constitutional rule file. |
| `memory_index_scan({ includeConstitutional: true })` | MCP tool behavior | Scans constitutional rule files with other indexed docs. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 7. VALIDATION

Run from the repository root unless noted.

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/constitutional/README.md
```

Expected result: the README passes document validation.

```bash
python3 .opencode/skill/sk-doc/scripts/extract_structure.py .opencode/skill/system-spec-kit/constitutional/README.md
```

Expected result: structure extraction reports no critical README issues.

When a rule file changes, index it after validation:

```typescript
memory_save({ filePath: ".opencode/skill/system-spec-kit/constitutional/gate-enforcement.md", force: true })
```

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 8. RELATED

- [`../README.md`](../README.md)
- [`../SKILL.md`](../SKILL.md)
- [`./gate-enforcement.md`](./gate-enforcement.md)
- [`./gate-tool-routing.md`](./gate-tool-routing.md)
- [`../mcp_server/lib/scoring/importance-tiers.ts`](../mcp_server/lib/scoring/importance-tiers.ts)

<!-- /ANCHOR:related -->
