# Strict Zod schema validation

## Current Reality

**IMPLEMENTED (Sprint 019).** All 24 MCP tool inputs (L1-L7) move to Zod runtime schemas in `mcp_server/tool-schemas.ts`, controlled by `SPECKIT_STRICT_SCHEMAS` (`.strict()` vs `.passthrough()`). Hallucinated parameters from calling LLMs are rejected with clear Zod errors. Adds `zod` dependency.

## Source Metadata

- Group: Extra features (Sprint 019)
- Source feature title: Strict Zod schema validation
- Summary match found: Yes
- Summary source feature title: Strict Zod schema validation
- Current reality source: feature_catalog.md
