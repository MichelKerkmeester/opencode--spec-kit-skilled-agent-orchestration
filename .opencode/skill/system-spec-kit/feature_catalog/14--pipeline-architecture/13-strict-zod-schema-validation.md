---
title: "Strict Zod schema validation"
description: "Strict Zod schema validation adds runtime input validation to all 33 live MCP tool definitions, rejecting hallucinated parameters from calling LLMs."
---

# Strict Zod schema validation

## 1. OVERVIEW

Strict Zod schema validation adds runtime input validation to all 33 live MCP tool definitions, rejecting hallucinated parameters from calling LLMs.

AI assistants sometimes invent parameters that do not exist when calling tools. This feature checks every incoming request against a strict rulebook and rejects anything that does not match. It is like a bouncer who checks your ID against the guest list: if your name is not on the list, you do not get in. This prevents made-up inputs from causing unexpected behavior.

---

## 2. CURRENT REALITY

**IMPLEMENTED (Sprint 019).** All 33 live MCP tool definitions (L1-L7) have Zod runtime schemas defined in `mcp_server/schemas/tool-input-schemas.ts` (re-exported via `tool-schemas.ts`), controlled by `SPECKIT_STRICT_SCHEMAS` (`.strict()` vs `.passthrough()`). Hallucinated parameters from calling LLMs are rejected with clear Zod errors and logged to stderr for audit trail (CHK-029). Adds `zod` dependency.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Zod input schemas |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/tool-input-schema.vitest.ts` | Tool input schema tests |

---

## 4. SOURCE METADATA

- Group: Extra features (Sprint 019)
- Source feature title: Strict Zod schema validation
- Current reality source: FEATURE_CATALOG.md
