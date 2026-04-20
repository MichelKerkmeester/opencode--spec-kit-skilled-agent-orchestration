---
title: "027/004 — Checklist"
description: "Acceptance verification for MCP advisor surface."
importance_tier: "high"
contextType: "implementation"
---
# 027/004 Checklist

## P0 (HARD BLOCKER)
- [ ] `advisor_recommend` tool exposed with Zod schemas
- [ ] `advisor_status` tool exposed with Zod schemas
- [ ] `advisor_validate` tool exposed with Zod schemas
- [ ] All 3 tools registered in existing system-spec-kit MCP dispatcher (no new MCP server)
- [ ] Handlers live under `mcp_server/skill-advisor/handlers/`
- [ ] Tools live under `mcp_server/skill-advisor/tools/`

## P1 (Required)
- [ ] Cache reuses post-025 HMAC prompt cache with source-signature invalidation
- [ ] Privacy contracts preserved (no raw prompts in diagnostics/keys/envelope)
- [ ] Handler tests per tool (happy/fail-open/stale/cache-hit/cache-miss)
- [ ] Tool schema introspection docs generated

## P2 (Suggestion)
- [ ] `trace: true` parameter for debug attribution
- [ ] `--limit N` for partial corpus validation

## Integration / Regression
- [ ] Tool discovery via MCP smoke test green
- [ ] Full vitest suite green
- [ ] TS build clean
- [ ] No regressions in existing tool suite

## Research conformance
- [ ] D3 three tools with strict schemas + handler tests
- [ ] D5 cache/freshness primitives reused from memory-MCP
- [ ] D6 no new MCP server registration; module inside existing surface
