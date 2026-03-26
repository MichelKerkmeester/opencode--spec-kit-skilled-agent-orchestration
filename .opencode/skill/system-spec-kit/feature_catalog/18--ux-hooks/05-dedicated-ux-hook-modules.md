---
title: "Dedicated UX hook modules"
description: "Dedicated UX hook modules separate mutation feedback and response hint logic from individual mutation handlers into shared module boundaries."
---

# Dedicated UX hook modules

## 1. OVERVIEW

Dedicated UX hook modules separate mutation feedback and response hint logic from individual mutation handlers into shared module boundaries.

The logic for generating user-facing feedback after a save or change used to be scattered across many files. This feature moved all that feedback logic into its own dedicated modules. It is like a restaurant separating the kitchen from the serving area: the food still reaches your table, but the responsibilities are clearly divided so nothing falls through the cracks.

---

## 2. CURRENT REALITY

Phase 014 introduced dedicated UX hook modules for mutation feedback and response hints. This separated UX hook logic from individual mutation handlers and standardized post-mutation UX behavior through shared module boundaries.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/hooks/index.ts` | Hook | Module barrel export for all UX hook modules |
| `mcp_server/hooks/mutation-feedback.ts` | Hook | Dedicated mutation feedback hook module |
| `mcp_server/hooks/response-hints.ts` | Hook | Dedicated response hint hook module |
| `mcp_server/hooks/memory-surface.ts` | Hook | Dedicated auto-surface UX hook module |
| `mcp_server/handlers/memory-crud-types.ts` | Handler | Shared `MutationHookResult` contract consumed by hook modules |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/hooks-ux-feedback.vitest.ts` | Barrel import verification, mutation feedback and response-hints exports |
| `mcp_server/tests/hooks-mutation-wiring.vitest.ts` | Mutation hook wiring via barrel |
| `mcp_server/tests/dual-scope-hooks.vitest.ts` | Auto-surface hook lifecycle and token budget |

---

## 4. SOURCE METADATA

- Group: UX hooks automation (Phase 014)
- Source feature title: Dedicated UX hook modules
- Current reality source: FEATURE_CATALOG.md
