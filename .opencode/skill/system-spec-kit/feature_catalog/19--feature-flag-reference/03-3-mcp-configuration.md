---
title: "3. MCP Configuration"
description: "This document captures the implemented behavior, source references, and validation scope for 3. MCP Configuration."
---

# 3. MCP Configuration

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for 3. MCP Configuration.

These are guardrail settings for save-time validation. They define size limits, token estimates, duplicate thresholds, and anchor strictness so problematic files can be caught before indexing.

---

## 2. CURRENT REALITY

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `MCP_ANCHOR_STRICT` | `false` | boolean | `lib/validation/preflight.ts` | When `'true'`, enforces strict anchor format validation during pre-flight checks. Invalid anchor IDs cause the save to be rejected. Default is lenient mode which logs warnings but does not block. |
| `MCP_CHARS_PER_TOKEN` | `4` | number | `lib/validation/preflight.ts`, `handlers/quality-loop.ts` | Characters-per-token ratio used for save-time token budget estimation during pre-flight validation. The same ratio is also shared by the quality loop when trimming to its default token budget. |
| `MCP_DUPLICATE_THRESHOLD` | `0.95` | number | `lib/validation/preflight.ts` | Cosine similarity threshold above which a new memory is considered a near-duplicate of an existing one during pre-flight validation. Duplicates above this threshold are rejected by the quality gate Layer 3. |
| `MCP_MAX_CONTENT_LENGTH` | `250000` | number | `lib/validation/preflight.ts`, `lib/parsing/memory-parser.ts` | Maximum allowed content length in characters for a memory file. Files exceeding this limit are rejected at pre-flight validation before any embedding generation or database writes. |
| `MCP_MAX_MEMORY_TOKENS` | `8000` | number | `lib/validation/preflight.ts` | Maximum token budget per memory (estimated via `MCP_CHARS_PER_TOKEN`). Pre-flight hard-fails with PF020 (`TOKEN_BUDGET_EXCEEDED`) when a memory exceeds this limit. |
| `MCP_MIN_CONTENT_LENGTH` | `10` | number | `lib/validation/preflight.ts` | Minimum content length in characters for a valid memory file. Files shorter than this are rejected at pre-flight. The quality gate Layer 1 requires at least 50 characters, so this lower floor catches truly empty files. |
| `MCP_TOKEN_WARNING_THRESHOLD` | `0.8` | number | `lib/validation/preflight.ts` | Fraction of `MCP_MAX_MEMORY_TOKENS` at which a token budget warning is emitted. At 0.8, a warning fires when estimated tokens exceed 80% of the max. |

---

## 3. SOURCE FILES

Source file references are included in the flag table above.

---

## 4. SOURCE METADATA

- Group: Feature Flag Reference
- Source feature title: 3. MCP Configuration
- Current reality source: FEATURE_CATALOG.md
