---
title: "MCP Server Data: Runtime Fixtures"
description: "Small data files consumed by MCP server tooling and tests."
trigger_phrases:
  - "mcp server data"
  - "search decisions data"
---

# MCP Server Data: Runtime Fixtures

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. KEY FILES](#2--key-files)
- [3. USAGE NOTES](#3--usage-notes)
- [4. RELATED RESOURCES](#4--related-resources)

## 1. OVERVIEW

`data/` stores small repository-local data files used by MCP server workflows. The folder is not a code module and should stay limited to data that needs to live beside the server package.

Current state:

- Stores search decision records in JSON Lines format.
- Keeps data files separate from handlers, libraries, and test helpers.

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `search-decisions.jsonl` | Append-oriented records for search decision data. |

## 3. USAGE NOTES

- Preserve JSON Lines format: one complete JSON object per line.
- Do not place generated databases, logs, or large artifacts here.
- Prefer a code-owned schema or parser when new data files need runtime validation.

## 4. RELATED RESOURCES

- [`../README.md`](../README.md)
- [`../tools/`](../tools/)
