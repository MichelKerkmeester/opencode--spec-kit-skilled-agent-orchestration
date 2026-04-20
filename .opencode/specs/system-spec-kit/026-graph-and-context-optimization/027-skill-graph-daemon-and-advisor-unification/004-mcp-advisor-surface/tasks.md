---
title: "027/004 — Tasks"
description: "Task breakdown for MCP advisor surface."
importance_tier: "high"
contextType: "implementation"
---
# 027/004 Tasks

## T001 — Scaffold
- [x] Packet files written

## T002 — Read research + predecessor
- [ ] research.md §7 D3/D5/D6
- [ ] 027/003 implementation-summary
- [ ] Existing `mcp_server/tools/` patterns

## T003 — Zod schemas (P0)
- [ ] `schemas/advisor-tool-schemas.ts` — request/response for all 3 tools

## T004 — Handlers (P0)
- [ ] `handlers/advisor-recommend.ts`
- [ ] `handlers/advisor-status.ts`
- [ ] `handlers/advisor-validate.ts`

## T005 — Tool definitions + dispatcher registration (P0)
- [ ] `tools/advisor-recommend.ts`
- [ ] `tools/advisor-status.ts`
- [ ] `tools/advisor-validate.ts`
- [ ] Register in existing system-spec-kit MCP dispatcher

## T006 — Cache integration (P1)
- [ ] Reuse post-025 HMAC prompt cache
- [ ] Source-signature invalidation

## T007 — Privacy integration (P1)
- [ ] No raw prompts in diagnostics / cache keys
- [ ] Preserve post-025 privacy contracts

## T008 — Tests (P0)
- [ ] Handler tests per tool (happy/fail-open/stale/cache-hit/cache-miss)
- [ ] Schema validation tests
- [ ] Tool discovery smoke test

## T009 — Verify
- [ ] Focused suite green
- [ ] TS build clean
- [ ] Tool schemas introspectable via MCP
- [ ] Mark checklist.md [x]

## T010 — Commit + push
