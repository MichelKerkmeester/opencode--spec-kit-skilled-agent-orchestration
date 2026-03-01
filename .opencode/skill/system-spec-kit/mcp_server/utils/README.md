---
title: "MCP Server Utilities"
description: "Shared validators, JSON helpers, batch processing helpers, and DB utility functions."
trigger_phrases:
  - "MCP utilities"
  - "input validation"
  - "batch processing"
---


# MCP Server Utilities

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. IMPLEMENTED STATE](#2--implemented-state)
- [3. HARDENING NOTES](#3--hardening-notes)
- [4. RELATED](#4--related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

This section provides an overview of the MCP Server Utilities directory.

`utils/` provides reusable helpers used by handlers and core modules.

- `validators.ts`: query and input-length validation, file-path validator factory.
- `json-helpers.ts`: safe parse/stringify helpers.
- `batch-processor.ts`: retry-aware batch and sequential processors.
- `db-helpers.ts`: DB guard and error-message helpers.
- `index.ts`: barrel exports.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:implemented-state -->
## 2. IMPLEMENTED STATE


Primary exports are camelCase (with TypeScript-first signatures):
- `validateQuery`, `validateInputLengths`, `createFilePathValidator`, `getDefaultAllowedPaths`
- `safeJsonParse`, `safeJsonStringify`, `safeJsonParseTyped`
- `processWithRetry`, `processBatches`, `processSequentially`
- `requireDb`, `toErrorMessage`

Security and reliability behavior:
- Input limits align with core constants (`MAX_QUERY_LENGTH`, `INPUT_LIMITS`).
- Path validation aligns with centralized allowed-path policy.
- Batch processing includes bounded retry behavior for transient failures.


<!-- /ANCHOR:implemented-state -->
<!-- ANCHOR:hardening-notes -->
## 3. HARDENING NOTES


- Utility APIs are now aligned with current camelCase usage across handlers.
- Shared DB error conversion reduces inconsistent thrown-error formatting.
- Validation helpers are part of query/input hardening used after Spec 125/126 stabilization.


<!-- /ANCHOR:hardening-notes -->
<!-- ANCHOR:related -->
## 4. RELATED


- `../core/README.md`
- `../handlers/README.md`
- `../formatters/README.md`
<!-- /ANCHOR:related -->
