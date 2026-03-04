# 3. MCP Configuration

## Current Reality

| Name | Default | Type | Source File | Description |
|---|---|---|---|---|
| `MCP_ANCHOR_STRICT` | `false` | boolean | `lib/validation/preflight.ts` | When `'true'`, enforces strict anchor format validation during pre-flight checks. Invalid anchor IDs cause the save to be rejected. Default is lenient mode which logs warnings but does not block. |
| `MCP_CHARS_PER_TOKEN` | `3.5` | number | `lib/validation/preflight.ts` | Characters-per-token ratio used for token budget estimation during pre-flight validation. Affects whether a memory file is flagged as too large before embedding generation begins. |
| `MCP_DUPLICATE_THRESHOLD` | `0.95` | number | `lib/validation/preflight.ts` | Cosine similarity threshold above which a new memory is considered a near-duplicate of an existing one during pre-flight validation. Duplicates above this threshold are rejected by the quality gate Layer 3. |
| `MCP_MAX_CONTENT_LENGTH` | `250000` | number | `lib/validation/preflight.ts` | Maximum allowed content length in characters for a memory file. Files exceeding this limit are rejected at pre-flight validation before any embedding generation or database writes. |
| `MCP_MAX_MEMORY_TOKENS` | `8000` | number | `lib/validation/preflight.ts` | Maximum token budget per memory (estimated via `MCP_CHARS_PER_TOKEN`). Pre-flight validation warns when a memory exceeds this limit. |
| `MCP_MIN_CONTENT_LENGTH` | `10` | number | `lib/validation/preflight.ts` | Minimum content length in characters for a valid memory file. Files shorter than this are rejected at pre-flight. The quality gate Layer 1 requires at least 50 characters, so this lower floor catches truly empty files. |
| `MCP_TOKEN_WARNING_THRESHOLD` | `0.8` | number | `lib/validation/preflight.ts` | Fraction of `MCP_MAX_MEMORY_TOKENS` at which a token budget warning is emitted. At 0.8, a warning fires when estimated tokens exceed 80% of the max. |

## Source Metadata

- Group: Feature Flag Reference
- Source feature title: 3. MCP Configuration
- Summary match found: No
- Current reality source: feature_catalog.md
