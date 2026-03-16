---
title: "007 — UX Hooks Automation"
description: "Post-mutation hook automation and structured UX hints for memory handlers."
importance_tier: "normal"
contextType: "implementation"
---

# 007 — UX Hooks Automation

Defines automated post-mutation hook enforcement and structured UX hint output for memory mutation handlers (save, update, delete, bulk-delete, atomic save). Includes checkpoint delete safety via `confirmName`, `memory_health` auto-repair, and context-server hint appending.

## Status

**Implemented** — Build and lint pass; the combined targeted rerun passes (9 files / 525 tests); split playbook verification passes (7 files / 510 tests and 2 files / 15 tests); MCP SDK smoke validation confirms 28 tools listed.

## Scope

- Shared post-mutation hook modules (`mutation-feedback.ts`, `response-hints.ts`)
- `MutationHookResult` extension with latency and cache-clear booleans
- Checkpoint delete safety via `confirmName` parameter
- `memory_health` optional `autoRepair` with structured repair metadata
- Context-server success-path hint appending via `appendAutoSurfaceHints()`
- Manual test playbook scenarios (NEW-103+)

## Key Files

- `spec.md` — Feature specification (Level 2)
- `plan.md` — Implementation plan
- `tasks.md` — Task breakdown
- `checklist.md` — Verification checklist
