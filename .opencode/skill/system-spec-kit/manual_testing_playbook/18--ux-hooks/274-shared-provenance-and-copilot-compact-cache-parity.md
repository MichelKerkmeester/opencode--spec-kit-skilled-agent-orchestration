---
title: "274 -- Shared provenance and Copilot compact-cache parity"
description: "This scenario validates the Phase 017 cross-runtime hook parity work for `274`. It focuses on the shared provenance wrapper and Copilot compact-cache behavior."
---

# 274 -- Shared provenance and Copilot compact-cache parity

## 1. OVERVIEW

This scenario validates the Phase 017 cross-runtime hook parity work for `274`. It focuses on the shared provenance wrapper and Copilot compact-cache behavior.

---

## 2. CURRENT REALITY

- Objective: Verify the shared provenance wrapper is the live helper surface and Copilot now matches Claude and Gemini on compact-cache behavior
- Prompt: `As a UX-hook validation operator, validate Shared provenance and Copilot compact-cache parity against hooks/shared-provenance.ts and hooks/copilot/compact-cache.ts. Verify Claude and Gemini re-export the shared provenance helpers, Copilot writes a cached provenance-wrapped payload, session-prime consumes the cached trustState, and the cached output matches the documented provenance format. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: shared helper imports visible; Copilot compact-cache emits cached provenance-wrapped output; session-prime consumes the cached trustState
- Pass/fail: PASS if Copilot now follows the same provenance-wrapped compact-cache contract as Claude and Gemini

---

## 3. TEST EXECUTION

### Prompt

```
As a UX-hook validation operator, validate shared provenance and Copilot compact-cache parity. Verify Claude and Gemini re-export the shared provenance helpers, Copilot writes a cached provenance-wrapped payload, session-prime consumes the cached trustState, and the cached output matches the documented provenance format. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Inspect the Claude and Gemini shared modules and confirm they re-export from `hooks/shared-provenance.ts`
2. Run the shared-provenance helper suite
3. Run the Copilot compact-cycle suite or reproduce a compact-cache write/read cycle
4. Confirm the Copilot cached payload carries the expected provenance line and cached trust-state behavior

### Expected

Shared helper imports visible; Copilot compact-cache emits cached provenance-wrapped output; session-prime consumes the cached trustState

### Evidence

Shared-provenance import evidence, helper-suite output, and Copilot compact-cycle output

### Pass / Fail

- **Pass**: Copilot now follows the same provenance-wrapped compact-cache contract as Claude and Gemini
- **Fail**: Copilot still lacks cached provenance wrapping or does not consume the shared helper surface

### Failure Triage

Inspect `mcp_server/hooks/shared-provenance.ts`, `mcp_server/hooks/claude/shared.ts`, `mcp_server/hooks/gemini/shared.ts`, `mcp_server/hooks/copilot/compact-cache.ts`, and `mcp_server/hooks/copilot/session-prime.ts`

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [18--ux-hooks/21-shared-provenance-and-copilot-compact-cache-parity.md](../../feature_catalog/18--ux-hooks/21-shared-provenance-and-copilot-compact-cache-parity.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 274
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `18--ux-hooks/274-shared-provenance-and-copilot-compact-cache-parity.md`
