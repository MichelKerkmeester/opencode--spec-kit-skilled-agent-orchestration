---
title: "Hooks README and export alignment"
description: "Hooks README and export alignment synchronizes the hooks barrel and README with the implemented UX-hook modules."
---

# Hooks README and export alignment

## 1. OVERVIEW

Hooks README and export alignment synchronizes the hooks barrel and README with the implemented UX-hook modules.

The documentation and the published list of available hook modules had drifted out of sync with the actual code. This fix updated both so they accurately reflect what hooks exist and how to use them. It is like updating a building directory after new offices move in so visitors can actually find what is listed.

---

## 2. CURRENT REALITY

The hooks barrel and hooks README were brought back into sync with the implemented UX-hook modules. `mutation-feedback` and `response-hints` are now both exported and documented as the canonical shared hook surface, removing the rollout-era README/export drift.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/hooks/index.ts` | Hook | Module barrel export |
| `mcp_server/hooks/README.md` | Hook | Hooks module documentation |
| `mcp_server/hooks/mutation-feedback.ts` | Hook | Mutation feedback hook |
| `mcp_server/hooks/response-hints.ts` | Hook | Response hint hook |
| `mcp_server/hooks/memory-surface.ts` | Hook | Auto-surface UX hook |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/hooks-ux-feedback.vitest.ts` | Barrel import verification, mutation feedback and response-hints exports |
| `mcp_server/tests/dual-scope-hooks.vitest.ts` | Auto-surface hook lifecycle and token budget |
| `mcp_server/tests/hooks-mutation-wiring.vitest.ts` | Mutation hook wiring via barrel |

---

## 4. SOURCE METADATA

- Group: UX hooks automation (Phase 014)
- Source feature title: Hooks README and export alignment
- Current reality source: FEATURE_CATALOG.md
