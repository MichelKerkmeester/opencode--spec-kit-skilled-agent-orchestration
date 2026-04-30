---
title: "Shared provenance and Copilot compact-cache parity"
description: "the implementation extracted the shared provenance wrapper and added a Copilot compact-cache producer so Copilot matches Claude and Gemini on cached recovered-payload behavior."
---

# Shared provenance and Copilot compact-cache parity

## 1. OVERVIEW

The implementation extracted the shared provenance wrapper and added a Copilot compact-cache producer so Copilot matches Claude and Gemini on cached recovered-payload behavior.

This is a UX-hook feature because it governs how recovered context is wrapped, sanitized, labeled, and replayed back into the runtime. The implementation change closed the last runtime-specific parity gap in the compact-cache path.

---

## 2. CURRENT REALITY

Commit `77da3013a` extracted the shared recovered-payload helpers into `mcp_server/hooks/shared-provenance.ts`. Claude and Gemini now re-export from that shared module instead of carrying or depending on runtime-local copies.

Commit `5923737c7` added `mcp_server/hooks/copilot/compact-cache.ts` and extended `mcp_server/hooks/copilot/session-prime.ts` so Copilot reads and writes provenance-wrapped cached payloads with `trustState: 'cached'`, matching the Claude and Gemini compact-cache flows.

The shared module now owns the provenance escaping, recovered-payload sanitization, and `wrapRecoveredCompactPayload()` logic for all three runtimes. Copilot therefore no longer lacks a compact-cache producer or a shared provenance wrapper, which was the last remaining observability gap called out in the implementation Cluster E.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/hooks/shared-provenance.ts` | Hook shared | Shared recovered-payload sanitization and provenance wrapping |
| `mcp_server/hooks/claude/shared.ts` | Hook shared | Claude re-exports wired to the shared provenance module |
| `mcp_server/hooks/gemini/shared.ts` | Hook shared | Gemini re-exports wired to the shared provenance module |
| `mcp_server/hooks/copilot/compact-cache.ts` | Hook | Copilot compact-cache producer |
| `mcp_server/hooks/copilot/session-prime.ts` | Hook | Copilot session-prime consumer of cached provenance-wrapped payloads |

### Validation And Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/hooks-shared-provenance.vitest.ts` | Shared provenance helper behavior and runtime re-export parity |
| `mcp_server/tests/copilot-compact-cycle.vitest.ts` | Copilot compact-cache producer and cached trust-state behavior |
| `mcp_server/tests/hook-session-start.vitest.ts` | Cached payload provenance formatting across hook consumers |

---

## 4. SOURCE METADATA
- Group: Ux Hooks
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `18--ux-hooks/21-shared-provenance-and-copilot-compact-cache-parity.md`
