---
title: "027/004 — Plan"
description: "Phased implementation plan for MCP advisor tool surface."
importance_tier: "high"
contextType: "implementation"
---
# Plan: 027/004

## Phases

1. **Contract** — read research.md §7 D3/D5/D6 + iter 026. Read existing `mcp_server/tools/` patterns + memory MCP tool exposures.
2. **Zod schemas** — `schemas/advisor-tool-schemas.ts` for all 3 tools' request/response.
3. **Handler layer** — `handlers/advisor-{recommend,status,validate}.ts`.
4. **Tool definitions** — `tools/advisor-{recommend,status,validate}.ts` registered with dispatcher.
5. **Cache integration** — reuse post-025 HMAC prompt cache with source-signature invalidation.
6. **Privacy integration** — preserve post-025 contracts (no raw prompts in diagnostics / keys).
7. **Tests** — handler unit tests per tool + schema validation tests.
8. **Verify** — tool discovery test + full vitest suite green.

## Dispatch

Single `/spec_kit:implement :auto` after 027/003 lands + parity green.

## Verification

- 3 new tools discoverable via MCP introspection
- Per-tool happy / fail-open / stale / cache-hit / cache-miss tests
- No raw prompts in any observable surface
- TS build clean
- No regressions in existing tool suite

## Risk mitigations

- **R7** tools live under `mcp_server/skill-advisor/`, not `lib/` + `tools/` scattered
- **R8** privacy contracts preserved from post-025
