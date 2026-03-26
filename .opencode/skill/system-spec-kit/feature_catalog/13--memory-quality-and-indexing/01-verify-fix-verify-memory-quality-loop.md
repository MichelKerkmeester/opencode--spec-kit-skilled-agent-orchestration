---
title: "Verify-fix-verify memory quality loop"
description: "The verify-fix-verify loop evaluates memory quality at save time and auto-retries fixes before accepting or rejecting the save."
---

# Verify-fix-verify memory quality loop

## 1. OVERVIEW

The verify-fix-verify loop evaluates memory quality at save time and auto-retries fixes before accepting or rejecting the save.

Before saving a new memory, the system checks whether it meets quality standards. If it falls short, the system tries to fix the problems automatically and checks again. Think of it like a spell checker that runs before you hit send: it catches obvious issues and corrects them so you do not store sloppy notes that will be hard to find later.

---

## 2. CURRENT REALITY

The quality loop is still the save-time auto-fix stage for recoverable formatting issues, but it is no longer the final semantic authority on whether a memory is good enough to save.

When `SPECKIT_QUALITY_LOOP` is enabled, the runtime still runs an initial quality evaluation and then up to 2 immediate auto-fix retries by default (`maxRetries=2`). Auto-fixes can re-extract trigger phrases from headings/title, normalize unclosed anchors, and trim content to the shared token budget.

What changed is the handoff after the loop:

- if the loop rejects for quality reasons, the save still stops there
- if the loop passes or repairs the structure, the runtime now runs the shared semantic sufficiency gate next
- if sufficiency fails, the save aborts with `INSUFFICIENT_CONTEXT_ABORT`
- if sufficiency passes, the runtime still validates the rendered-memory template contract before storage

That means the quality loop can improve structure, but it cannot invent semantic evidence or bless malformed rendered output. A memory that still lacks a specific title, durable file/tool/decision evidence, enough semantic substance, or the required anchor/frontmatter contract remains rejected even after successful auto-fixes.

`attempts` still reports the actual number of evaluations used, not the configured ceiling. If a retry applies no fixes, the loop breaks early, so a case with `maxRetries=5` can still reject after only 2 total attempts (1 initial evaluation + 1 no-op retry). The rejection reason also reports the actual auto-fix attempt count.

When fixes improve the score past the threshold, the handler returns `fixedContent` and `fixedTriggerPhrases`. Accepted saves persist metadata fixes immediately, while rewritten body content stays in-memory and is written only after later hard-reject gates clear under the per-spec-folder lock. Rejected saves still surface the rewritten in-memory draft for diagnostics, but `indexMemoryFile()` returns `status: 'rejected'` without continuing to storage. `atomicSaveMemory()` treats that rejected status as a non-retry rollback path: it restores the previous file or deletes the newly written file immediately.

The `CHARS_PER_TOKEN` ratio defaults to `4` and is shared with `preflight.ts` through `MCP_CHARS_PER_TOKEN` so both save-time checks use the same token estimate.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/quality-loop.ts` | Handler | Quality scoring, retry loop, auto-fix logic, and actual-attempt reporting |
| `mcp_server/handlers/memory-save.ts` | Handler | Save-path integration, rejected status handling, fixed-content persistence, sufficiency handoff, and template-contract enforcement |
| `mcp_server/handlers/v-rule-bridge.ts` | Handler | Loads compiled V-rule validation and disposition logic consumed by save-time quality enforcement |
| `shared/parsing/memory-sufficiency.ts` | Shared | Shared semantic sufficiency evaluation that runs after quality-loop fixes |
| `shared/parsing/memory-template-contract.ts` | Shared | Rendered-memory structural contract that runs after quality-loop fixes |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/quality-loop.vitest.ts` | Attempt counting, retry behavior, and rejection semantics |
| `mcp_server/tests/handler-memory-save.vitest.ts` | Rejected-save rollback semantics plus post-loop insufficiency hard-block coverage |

---

## 4. SOURCE METADATA

- Group: Memory quality and indexing
- Source feature title: Verify-fix-verify memory quality loop
- Current reality source: FEATURE_CATALOG.md
- Source list updated 2026-03-25 per deep review
