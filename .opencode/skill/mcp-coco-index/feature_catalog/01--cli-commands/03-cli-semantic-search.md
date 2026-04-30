---
title: "03. CLI semantic search"
description: "Searches indexed code with natural language plus optional language, path, limit and offset filters."
---

# 03. CLI semantic search

Searches indexed code with natural language plus optional language, path, limit and offset filters. The CLI search command exposes semantic retrieval from the terminal. It turns positional query tokens into one query string and forwards filters to the daemon-backed query path.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The CLI search command exposes semantic retrieval from the terminal. It turns positional query tokens into one query string and forwards filters to the daemon-backed query path.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`ccc search` can refresh first with `--refresh`, accepts repeatable `--lang`, accepts one path glob through `--path`, supports offset pagination and falls back to a current-directory path filter when invoked below the project root.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/cli.py:350` | CLI | Defines `ccc search` and its parameters. |
| `.opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/cli.py:204` | CLI helper | Runs search while showing a wait spinner during indexing. |
| `.opencode/skill/mcp-coco-index/references/tool_reference.md:31` | Reference | Documents CLI search parameters and examples. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skill/mcp-coco-index/tests/test_e2e.py:167` | End-to-end | Covers basic search returning indexed files. |
| `.opencode/skill/mcp-coco-index/tests/test_e2e.py:397` | End-to-end | Covers subdirectory default path behavior. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: CLI commands
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--cli-commands/03-cli-semantic-search.md`

<!-- /ANCHOR:source-metadata -->
