---
title: "Session-resume caller binding and Unicode sanitization"
description: "Phase 017 bound session_resume authorization to transport caller identity and added NFKC plus zero-width sanitization to Gate 3 and recovered-payload processing."
---

# Session-resume caller binding and Unicode sanitization

## 1. OVERVIEW

Phase 017 bound `session_resume` authorization to transport caller identity and added NFKC plus zero-width sanitization to Gate 3 and recovered-payload processing.

This is governance because it tightens who is allowed to resume a session and how prompt or recovered-payload text is normalized before the guardrails make decisions. The two changes shipped together as policy hardening for cross-session leakage and Unicode-based bypass attempts.

---

## 2. CURRENT REALITY

Two Phase 017 hardening passes define the current behavior.

Commit `debb5d7a8` introduced `mcp_server/lib/context/caller-context.ts` and wrapped MCP dispatch in `context-server.ts` with `runWithCallerContext()`. Commit `87636d923` then used `getCallerContext()` inside `handlers/session-resume.ts` so `args.sessionId` must match the transport caller context by default. `MCP_SESSION_RESUME_AUTH_MODE=permissive` is the canary override that logs the mismatch and continues instead of rejecting it.

Commit `1bd7856a9` added NFKC normalization plus zero-width and soft-hyphen stripping to both `shared/gate-3-classifier.ts:normalizePrompt()` and `hooks/shared-provenance.ts:sanitizeRecoveredPayload()`. Gate classification now normalizes Unicode confusables before file-write detection, and recovered compact payloads are sanitized before provenance wrapping or downstream system-role checks run.

The net governance effect is twofold: the resume surface now trusts transport-bound caller identity instead of raw tool arguments alone, and the prompt/payload sanitizers now close the Unicode-obfuscation gap that previously let visually similar or zero-width text slip past the guardrails.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/context/caller-context.ts` | Lib | AsyncLocalStorage-backed caller identity store |
| `mcp_server/context-server.ts` | Transport | Binds MCP tool dispatch to the caller-context envelope |
| `mcp_server/handlers/session-resume.ts` | Handler | Enforces strict default session-resume caller binding with permissive canary mode |
| `shared/gate-3-classifier.ts` | Shared | NFKC and zero-width sanitization before Gate 3 classification |
| `mcp_server/hooks/shared-provenance.ts` | Hook shared | NFKC and zero-width sanitization for recovered payloads before provenance wrapping |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/caller-context.vitest.ts` | AsyncLocalStorage propagation and caller-context semantics |
| `mcp_server/tests/session-resume-auth.vitest.ts` | Strict-vs-permissive resume auth binding |
| `scripts/tests/gate-3-classifier.vitest.ts` | Unicode confusable and zero-width prompt normalization cases |
| `mcp_server/tests/hooks-shared-provenance.vitest.ts` | Recovered-payload sanitization and provenance wrapping |

---

## 4. SOURCE METADATA

- Group: Governance
- Source feature title: Session-resume caller binding and Unicode sanitization
- Phase 017 commits: `debb5d7a8`, `87636d923`, `1bd7856a9`
- Current reality source: `026-graph-and-context-optimization/016-foundational-runtime/002-infrastructure-primitives/implementation-summary.md` and `002-cluster-consumers/implementation-summary.md`
