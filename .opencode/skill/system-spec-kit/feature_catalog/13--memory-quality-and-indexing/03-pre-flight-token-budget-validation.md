# Pre-flight token budget validation

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Pre-flight token budget validation.

## 2. CURRENT REALITY

Pre-flight token budget validation is a save-time guard in `preflight.ts`, not a retrieval-time truncation feature. Before embedding generation, the runtime estimates token count from content length using `Math.ceil(text.length / charsPerToken)`, where `charsPerToken` defaults to `4` and can be overridden with `MCP_CHARS_PER_TOKEN`.

`checkTokenBudget()` adds a default 150-token embedding overhead, compares the estimate against `MCP_MAX_MEMORY_TOKENS` (default `8000`), and emits one of two outcomes: `PF020` hard failure when the estimate exceeds the max, or `PF021` warning when usage reaches `MCP_TOKEN_WARNING_THRESHOLD` (default `0.8`). The reduction hint in the error message uses the same `charsPerToken` ratio so the suggested character trim matches runtime math.

This validation runs in `memory_save` pre-flight before any embedding generation or database writes. It protects ingestion cost and save-time limits; it does not control search-result truncation.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/validation/preflight.ts` | Lib | Token estimation, thresholds, and pre-flight pass/warn/fail behavior |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/preflight.vitest.ts` | Token-budget validation and pre-flight error/warning behavior |

## 4. SOURCE METADATA

- Group: Memory quality and indexing
- Source feature title: Pre-flight token budget validation
- Current reality source: feature_catalog.md
