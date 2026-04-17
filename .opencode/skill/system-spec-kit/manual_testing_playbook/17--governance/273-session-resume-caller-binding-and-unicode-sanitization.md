---
title: "273 -- Session-resume caller binding and Unicode sanitization"
description: "This scenario validates the Phase 017 governance hardening for `273`. It focuses on strict session-resume caller binding and the NFKC plus zero-width sanitization guardrails."
---

# 273 -- Session-resume caller binding and Unicode sanitization

## 1. OVERVIEW

This scenario validates the Phase 017 governance hardening for `273`. It focuses on strict session-resume caller binding and the NFKC plus zero-width sanitization guardrails.

---

## 2. CURRENT REALITY

- Objective: Verify `session_resume` rejects mismatched caller/session IDs by default, permissive mode logs and continues, and the Unicode sanitizers normalize the documented confusable inputs
- Prompt: `As a governance validation operator, validate Session-resume caller binding and Unicode sanitization against caller-context plus the shared sanitizers. Verify session_resume rejects mismatched args.sessionId values in strict mode, permissive mode logs and continues for canary rollout, gate-3 normalizePrompt() applies NFKC plus zero-width stripping, and sanitizeRecoveredPayload() applies the same normalization to recovered payloads. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: strict mismatch rejected; permissive mismatch allowed with warning; Gate 3 and recovered payload sanitizers normalize the documented confusable inputs
- Pass/fail: PASS if both the auth-binding and Unicode-hardening behaviors match the documented Phase 017 contract

---

## 3. TEST EXECUTION

### Prompt

```
As a governance validation operator, validate strict session-resume caller binding and Unicode sanitization. Verify session_resume rejects mismatched args.sessionId values in strict mode, permissive mode logs and continues for canary rollout, gate-3 normalizePrompt() applies NFKC plus zero-width stripping, and sanitizeRecoveredPayload() applies the same normalization to recovered payloads. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Run the strict-mode session-resume auth case with mismatched caller/session IDs
2. Re-run with `MCP_SESSION_RESUME_AUTH_MODE=permissive`
3. Run the Gate 3 Unicode test cases or the dedicated classifier suite
4. Run the shared-provenance sanitization suite or inspect sanitized recovered payload output

### Expected

Strict mismatch rejected; permissive mismatch allowed with warning; Unicode confusables normalized in both sanitizers

### Evidence

Strict/permissive auth output plus Unicode normalization test output

### Pass / Fail

- **Pass**: both the auth-binding and Unicode-hardening behaviors match the documented Phase 017 contract
- **Fail**: session-resume auth does not bind to caller context or the Unicode sanitizers miss the documented confusable cases

### Failure Triage

Inspect `mcp_server/lib/context/caller-context.ts`, `mcp_server/context-server.ts`, `mcp_server/handlers/session-resume.ts`, `shared/gate-3-classifier.ts`, and `mcp_server/hooks/shared-provenance.ts`

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [17--governance/06-session-resume-caller-binding-and-unicode-sanitization.md](../../feature_catalog/17--governance/06-session-resume-caller-binding-and-unicode-sanitization.md)

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 273
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `17--governance/273-session-resume-caller-binding-and-unicode-sanitization.md`
