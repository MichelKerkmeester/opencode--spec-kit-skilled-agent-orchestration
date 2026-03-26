---
title: "Health diagnostics (memory_health)"
description: "Covers the health diagnostics tool that reports system readiness, alias conflicts and optional auto-repair actions."
---

# Health diagnostics (memory_health)

## 1. OVERVIEW

Covers the health diagnostics tool that reports system readiness, alias conflicts and optional auto-repair actions.

This is the system's self-check tool. It tells you whether the database is connected, whether the search engine is ready and whether anything looks out of place. If it finds problems, it can suggest or even perform automatic repairs. Think of it like running a diagnostic on your car to see if everything is working properly.

---

## 2. CURRENT REALITY

`memory_health` has two report modes. `full` returns system diagnostics: database connectivity, embedding model readiness, vector-search availability, memory count, uptime, server version, alias-conflict summary, repair metadata, embedding provider details, and an `embeddingRetry` snapshot. `divergent_aliases` returns a compact triage payload that focuses only on alias groups whose `specs/` and `.opencode/specs/` variants have different content hashes, and it also includes the same top-level `embeddingRetry` field.

`embeddingRetry` comes from the retry manager's in-memory health snapshot rather than a database query. It reports retry-queue state and activity for embeddings, including `pending`, `failed`, `retryAttempts`, `circuitBreakerOpen`, `lastRun`, and `queueDepth`. The field is present in both success payload shapes; before any retry activity has happened, it remains in a zero-state with counts at `0` and `lastRun` as `null`.

The top-level status is currently derived from two signals only: embedding model readiness and database connectivity. FTS drift and alias conflicts do not flip the status to `degraded` by themselves. They surface through hints and the repair payload. The embedding provider section exposes a redacted database path, not a raw absolute path.

`autoRepair: true` without `confirmed: true` does not execute repair actions. Instead, the handler returns a confirmation-only success response describing the actions it would take. The public tool schema now accepts `confirmed`, so the documented confirmation flow is reachable through real MCP calls as well as direct handler tests.

All health validation failures return MCP error envelopes with `E_INVALID_INPUT` and `data.details.requestId`. User-facing hints sanitize absolute paths and stack traces before returning error context.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `mcp_server/handlers/memory-crud-health.ts` | Handler validation, diagnostics, alias triage, repair flow, and response shaping |
| `mcp_server/handlers/memory-crud.ts` | Public CRUD exports and snake_case compatibility aliases |
| `mcp_server/handlers/memory-index-alias.ts` | Defines `summarizeAliasConflicts()` (line 153), the alias-conflict summarization logic |
| `mcp_server/handlers/memory-index.ts` | Re-exports `summarizeAliasConflicts` from `memory-index-alias.ts` (line 34) |
| `mcp_server/schemas/tool-input-schemas.ts` | Runtime Zod schema for public `memory_health` arguments, including `confirmed` |
| `mcp_server/tool-schemas.ts` | MCP-visible JSON schema for `memory_health` arguments |
| `mcp_server/lib/response/envelope.ts` | MCP success/error envelope helpers |
| `mcp_server/lib/search/vector-index.ts` | Database access facade used by the handler |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/handler-memory-health-edge.vitest.ts` | Validation envelopes, divergent-alias success payloads, and default full-mode assertions |
| `mcp_server/tests/handler-memory-crud.vitest.ts` | Public export and direct validation coverage |
| `mcp_server/tests/memory-crud-extended.vitest.ts` | Health happy paths, alias diagnostics, auto-repair behavior, and provider metadata handling |
| `mcp_server/tests/tool-input-schema.vitest.ts` | Public schema coverage for the `confirmed` auto-repair confirmation flow |

---

## 4. SOURCE METADATA

- Group: Discovery
- Source feature title: Health diagnostics (memory_health)
- Current reality source: `mcp_server/handlers/memory-crud-health.ts`, public schemas, and discovery test coverage
