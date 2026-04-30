---
title: Security and Reliability Checklist
description: Structured risk checklist for security vulnerabilities, runtime reliability issues, and concurrent-behavior defects.
---

# Security and Reliability Checklist

Structured risk checklist for security vulnerabilities, runtime reliability issues, and concurrent-behavior defects.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Help reviewers prioritize exploitability and business impact, not just code style.

### Core Principle

When impact is unclear, prefer conservative classification and state uncertainty explicitly.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:input-output -->
## 2. INPUT/OUTPUT SAFETY

Check for:
- XSS via unsafe HTML rendering or template interpolation.
- SQL/NoSQL/command injection via string concatenation.
- SSRF through unvalidated user-controlled URLs.
- Path traversal from unchecked path input (`../`).
- Prototype pollution from unsafe object merge operations.

Review prompts:
- "What untrusted input reaches this sink?"
- "Is validation context-aware for this output channel?"
<!-- /ANCHOR:input-output -->

---

<!-- ANCHOR:auth -->
## 3. AUTHENTICATION AND AUTHORIZATION

Check for:
- Missing auth guards on newly added entry points.
- Missing ownership/tenant checks for read/write actions.
- Trust in client-supplied role flags or user IDs.
- IDOR patterns where entity IDs are accepted without authorization.
- Weak token/session validation (`exp`, `iss`, `aud`, algorithm checks).

High-impact rule: any missing authz control on data mutation is at least P1 and often P0.
<!-- /ANCHOR:auth -->

---

<!-- ANCHOR:secrets-privacy -->
## 4. SECRETS AND PRIVACY

Check for:
- Hardcoded credentials, API keys, tokens, private keys.
- Sensitive logs exposing PII or operational secrets.
- Internal stack traces or environment details in user-facing errors.
- Client-side exposure of server-only configuration values.

Quick command ideas:

```bash
rg -n -i "api[_-]?key|secret|token|password|BEGIN .* PRIVATE KEY"
```
<!-- /ANCHOR:secrets-privacy -->

---

<!-- ANCHOR:runtime-reliability -->
## 5. RUNTIME RELIABILITY

Check for:
- Missing timeouts/retries for network dependencies.
- Unbounded loops, recursion, or memory growth.
- Blocking I/O on hot request paths.
- Regex patterns vulnerable to catastrophic backtracking (ReDoS).
- Missing idempotency keys for retry-prone write operations.

Review prompt:
- "What fails under load or partial network failure?"
<!-- /ANCHOR:runtime-reliability -->

---

<!-- ANCHOR:concurrency -->
## 6. CONCURRENCY AND RACE CONDITIONS

Flag patterns:
- Check-then-act without atomicity.
- Read-modify-write on shared state without lock/transaction.
- File/system operations split into non-atomic checks and actions.
- Counter updates without atomic increment semantics.
- Distributed coordination without lock/lease guarantees.

Examples:

```text
if not exists(key):
    create(key)

value = get(key)
value += 1
set(key, value)
```

Reviewer questions:
- "What happens if two requests hit this path at the same time?"
- "Is this update atomic across all failure modes?"
<!-- /ANCHOR:concurrency -->

---

<!-- ANCHOR:rate-limiting -->
## 7. RATE LIMITING AND ABUSE PREVENTION

Check for:
- Missing rate limits on authentication endpoints (login, signup, password reset).
- Unthrottled API endpoints accepting expensive operations.
- Missing abuse vectors: account enumeration, credential stuffing, brute force.
- Lack of per-user or per-IP request budgets on public-facing routes.

Review prompt:
- "What stops an attacker from calling this endpoint 10,000 times per second?"
<!-- /ANCHOR:rate-limiting -->

---

<!-- ANCHOR:csp-headers -->
## 8. CONTENT SECURITY POLICY AND HEADERS

Check for:
- Missing or overly permissive CSP headers (`unsafe-inline`, `unsafe-eval`, wildcard sources).
- Missing security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`.
- CORS misconfiguration: wildcard origins, credentials with broad origins.
- Missing `SameSite` attribute on sensitive cookies.

Review prompt:
- "Could an attacker embed, frame, or inject scripts into this page?"
<!-- /ANCHOR:csp-headers -->

---

<!-- ANCHOR:dependency-supply-chain -->
## 9. DEPENDENCY AND SUPPLY CHAIN SECURITY

Check for:
- Known vulnerabilities in dependencies (`npm audit`, `pip-audit`, `cargo audit`).
- Unpinned or loosely pinned dependency versions (major version ranges).
- Dependencies with no maintainer activity or known compromises.
- Post-install scripts in untrusted packages.
- Lock file integrity (committed and consistent with manifest).

Review prompt:
- "Are all dependencies pinned, audited, and from trusted sources?"
<!-- /ANCHOR:dependency-supply-chain -->

---

<!-- ANCHOR:audit-logging -->
## 10. AUDIT LOGGING AND OBSERVABILITY

Check for:
- Missing audit logs for security-sensitive operations (auth, permission changes, data deletion).
- Insufficient context in logs (who, what, when, from where).
- Logging sensitive data (passwords, tokens, PII) in plain text.
- Missing alerting for anomalous patterns (repeated auth failures, privilege escalation).

Review prompt:
- "If this action were abused, would we know about it from the logs?"
<!-- /ANCHOR:audit-logging -->

---

<!-- ANCHOR:privacy-data-handling -->
## 11. PRIVACY AND DATA HANDLING

Check for:
- PII stored without encryption at rest or purpose limitation.
- Missing data retention policies or deletion mechanisms.
- Cross-border data transfer without adequate safeguards.
- Excessive data collection beyond stated purpose.
- Missing consent mechanisms for user data processing.

Review prompt:
- "Does this code collect, store, or transmit personal data - and is that justified and protected?"
<!-- /ANCHOR:privacy-data-handling -->

---

<!-- ANCHOR:related-resources -->
## 12. RELATED RESOURCES

- [quick_reference.md](./quick_reference.md) - Findings-first review flow, severity model, and output contract.
- [code_quality_checklist.md](./code_quality_checklist.md) - Correctness, scaling, and maintainability checks.
- [solid_checklist.md](./solid_checklist.md) - Architecture cohesion and coupling checks.
- [removal_plan.md](./removal_plan.md) - Safe deletion and deferred removal planning.

Overlay portability: use this baseline with stack-specific controls from `sk-code-opencode` or `sk-code`.
<!-- /ANCHOR:related-resources -->
