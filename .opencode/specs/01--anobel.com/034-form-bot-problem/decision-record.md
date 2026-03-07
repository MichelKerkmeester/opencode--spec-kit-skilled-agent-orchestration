---
title: "Decision Record: Contact Form Bot Submission Investigation"
description: "Record planning decisions for root-cause validation and mitigation sequencing for /nl/contact bot-spam handling."
SPECKIT_TEMPLATE_SOURCE: "decision-record | v2.2"
trigger_phrases:
  - "decision"
  - "record"
  - "contact form"
  - "botpoison"
  - "spam"
  - "034"
importance_tier: "critical"
contextType: "decision"
---
# Decision Record: Contact Form Bot Submission Investigation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Prioritize Server-Side Verification Before Client/UI Mitigation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed (planning draft; formal approval pending) |
| **Date** | 2026-03-07 |
| **Deciders** | Planning workflow draft (formal approver(s) TBD) |

---

<!-- ANCHOR:adr-001-context -->
### Context

Current evidence confirms the client path can include `_botpoison`, but this alone does not prove that inbox delivery is protected against direct endpoint abuse or fallback bypass. The submit endpoint and Botpoison public key are visible in live markup, and service-worker/version drift risk exists.

Known evidence points:
- Public endpoint and key exposure in live form markup (`...tool_cc772e...:6527`).
- Enhanced path token injection behavior in `form_submission.js` (`src/2_javascript/form/form_submission.js:612`, `src/2_javascript/form/form_submission.js:625`).
- Native fallback path availability (`src/2_javascript/form/form_submission.js:654`, `src/2_javascript/form/form_submission.js:674`).

### Constraints

- Client code is not a trustworthy security boundary.
- Provider-side evidence access may require coordination outside this repository.
- We need high-confidence root-cause attribution before selecting mitigations.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Planning choice**: Investigate and validate server-side evidence paths first, then prioritize mitigations.

**How it works**: The plan gates implementation on proving or disproving RC-A through RC-D, with provider/inbox evidence as the source of truth. UI and client hardening changes remain secondary until trust-boundary gaps are confirmed.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Server-side-first investigation (chosen)** | Highest confidence, avoids placebo fixes | Needs external evidence access | 10/10 |
| Client/UI-first hardening | Fast to implement | High chance of missing actual bypass path | 4/10 |
| Parallel mixed changes without evidence gate | Appears proactive | Hard to attribute impact and increases rollback risk | 3/10 |

**Why this one**: The problem is security-sensitive and can cross trust boundaries. Evidence quality matters more than speed of cosmetic changes.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Root-cause confidence before implementation effort.
- Lower risk of shipping ineffective mitigations.

**What it costs**:
- More coordination time with provider-side evidence owners. Mitigation: define minimum evidence contract early.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Delayed evidence access | High | Time-box requests and keep parallel RC-C/RC-D analysis moving |
| Overfitting to one observed path | Medium | Require verdict table for all four hypotheses |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Security issue with ongoing inbox impact |
| 2 | **Beyond Local Maxima?** | PASS | Compared server-first vs client-first vs mixed |
| 3 | **Sufficient?** | PASS | Minimal strategy that can prove root causes |
| 4 | **Fits Goal?** | PASS | Aligns to spam-prevention and trust-boundary goals |
| 5 | **Open Horizons?** | PASS | Keeps future implementation options open |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Build evidence matrix and verdict table in this spec workflow.
- Define required server-side telemetry fields before implementation tickets.

**How to roll back**: If evidence-first path blocks progress, switch to a time-boxed hybrid plan but keep server-side verification as a non-optional acceptance criterion.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Treat Botpoison Client Token as Advisory Unless Enforced Server-Side

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed (planning draft; formal approval pending) |
| **Date** | 2026-03-07 |
| **Deciders** | Planning workflow draft (formal approver(s) TBD) |

---

<!-- ANCHOR:adr-002-context -->
### Context

The client code can solve Botpoison and inject `_botpoison`, but native fallback and direct endpoint access can still exist in parallel paths. Treating token presence in client payload as equivalent to server verification can produce false security confidence.

### Constraints

- Public keys are intentionally public and cannot be treated as proof of trusted origin.
- Provider processing semantics may not be visible without additional telemetry.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Planning choice**: Require server-side assurance checks to be explicit pass criteria for inbox delivery decisions.

**How it works**: Plan requires evidence that server-side verification results are available and enforced. If assurance is missing or invalid, submission is rejected or quarantined by policy.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Server-enforced assurance (chosen)** | Strongest anti-abuse boundary | Requires implementation coordination | 10/10 |
| Client-token-only acceptance | Fast and simple | Bypass-prone and weak security posture | 2/10 |
| Optional server checks | Lower rollout risk | Inconsistent enforcement allows spam leakage | 5/10 |

**Why this one**: Contact inbox protection needs deterministic enforcement, not best-effort client behavior.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Stronger defense-in-depth and clearer accountability for delivery decisions.
- Better forensic visibility during spam incidents.

**What it costs**:
- More implementation work and stricter policy handling. Mitigation: phase rollout with metrics.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| False positives block legitimate contact requests | High | Roll out in monitor mode first and tune thresholds |
| Missing telemetry fields hinder debugging | Medium | Make telemetry schema a P0 prerequisite |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Current concern is inbox abuse despite client integration |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated optional and client-only alternatives |
| 3 | **Sufficient?** | PASS | Server enforcement directly addresses trust boundary |
| 4 | **Fits Goal?** | PASS | Aligns with mitigation objective and measurable outcomes |
| 5 | **Open Horizons?** | PASS | Supports phased rollout and policy tuning |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Add acceptance criteria requiring server-side verification status in mitigation plan.
- Add telemetry requirements for delivery decision auditing.

**How to roll back**: If enforcement causes excessive false positives, move to monitor-only mode while preserving logging and retuning thresholds.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---
