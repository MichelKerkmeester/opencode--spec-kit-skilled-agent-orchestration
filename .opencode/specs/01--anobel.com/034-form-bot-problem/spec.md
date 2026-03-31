---
title: "Feature Specification: Contact Form Bot Submission Investigation [01--anobel.com/034-form-bot-problem/spec]"
description: "Investigate unresolved contact-form spam while prioritizing a Formspark-enforced honeypot-first mitigation design grounded in verified evidence."
trigger_phrases:
  - "contact form"
  - "botpoison"
  - "formspark"
  - "spam"
  - "bot submission"
  - "034"
importance_tier: "critical"
contextType: "implementation"
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + level3-arch | v2.2"
---
# Feature Specification: Contact Form Bot Submission Investigation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The `/nl/contact` page includes Botpoison and enhanced submit interception, yet bot-like submissions still reach the inbox. Verified evidence still supports an unresolved spam issue; this spec update does not claim production behavior is fixed.

Research indicates Formspark supports honeypot and custom honeypot fields, plus Botpoison, and that honeypot or spam-verification failures are silently ignored (not saved, not counted, no notification). Given the current custom JSON submit architecture with possible native fallback, the lowest-change mitigation candidate is a Formspark-enforced honeypot implemented as a real DOM field that survives both submit paths.

**Key Decisions**: Prioritize a Formspark-enforced honeypot as first mitigation candidate while keeping RC-A and RC-B unproven until provider-side evidence closes them; keep Botpoison as layered defense, not sole trust boundary.

**Critical Dependencies**: Access to provider-side request logs and inbox-side traceability for suspicious submissions.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft (planning only) |
| **Created** | 2026-03-07 |
| **Branch** | `034-form-bot-problem` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Spam or bot-like submissions are still arriving through the `/nl/contact` flow even though the page integrates Botpoison and custom JS interception. The system currently appears to rely heavily on client behavior and a public endpoint, which creates bypass risk if server-side enforcement and telemetry are insufficient.

### Purpose
Produce an evidence-backed investigation and mitigation plan that explains how spam reaches the inbox, prioritizes a low-change Formspark honeypot-first mitigation path, and keeps unresolved hypotheses explicit until verified.

### VERIFIED Durable Findings (repo-backed)
1. Intended contact page snippet loads `form_validation.min.js?v=1.2.36`, `form_submission.min.js?v=1.2.36`, `form_persistence.min.js?v=1.1.0`, and Botpoison SDK (`src/0_html/contact.html:57`, `src/0_html/contact.html:58`, `src/0_html/contact.html:59`, `src/0_html/contact.html:72`).
2. Form enhancement attaches only to Formspark-pattern forms (`src/2_javascript/form/form_submission.js:13`).
3. Botpoison token flow is attribute-gated; token is injected as `_botpoison`; missing required token raises an error in JS path (`src/2_javascript/form/form_submission.js:32`, `src/2_javascript/form/form_submission.js:612`, `src/2_javascript/form/form_submission.js:625`).
4. Native fallback path can call `this.native_submit.call(this.form)` when fallback is enabled; default config enables fallback (`src/2_javascript/form/form_submission.js:35`, `src/2_javascript/form/form_submission.js:654`, `src/2_javascript/form/form_submission.js:674`).
5. Submit interception prevents default and manually runs custom validation (`src/2_javascript/form/form_submission.js:553`, `src/2_javascript/form/form_submission.js:577`).
6. Persistence listens for `form-submit-success`, while submission emits `formsubmit:success`, indicating event-name drift risk (`src/2_javascript/form/form_persistence.js:549`, `src/2_javascript/form/form_submission.js:806`).
7. Service worker uses cache-first for CDN JS with 7-day TTL, increasing stale-asset risk (`src/2_javascript/global/service_worker.js:21`, `src/2_javascript/global/service_worker.js:215`, `src/2_javascript/global/service_worker.js:230`).
8. Minified manifest maps local sources to minified form stack artifacts (`src/2_javascript/z_minified/manifest.tsv:9`, `src/2_javascript/z_minified/manifest.tsv:11`).
9. Repo scripts do not show form-specific automated tests; current coverage is interactive search oriented (`package.json:7`, `package.json:16`).
10. Formspark official docs support honeypot and custom honeypot fields, and support Botpoison integration (external documentation research, session date 2026-03-07).
11. Formspark official docs state honeypot/spam-verification failures are silently ignored: submissions are not saved and do not trigger notifications or submission counts (external documentation research, session date 2026-03-07).
12. Current custom architecture builds `FormData`, injects `_botpoison`, serializes to JSON, posts to Formspark, and may fall back to native submit; a real DOM honeypot field is expected to survive both paths by design intent (code + runtime architecture evidence).

### Current-session/live observations (re-verify during implementation)
1. Live fetched page loaded `form_submission.min.js?v=1.2.35` while intended source references `v=1.2.36`, indicating potential version drift in this session (`/Users/michelkerkmeester/.local/share/opencode/tool-output/tool_cc772e515001eclbD35NY1uUny:7279`).
2. Live form markup exposed direct submit endpoint and Botpoison public key (`action="https://submit-form.com/PbxxhNQQW"`, `data-formspark-url`, `data-botpoison-public-key`) in this capture (`/Users/michelkerkmeester/.local/share/opencode/tool-output/tool_cc772e515001eclbD35NY1uUny:6527`).
3. Browser-safe session observation captured enhanced flow preparing JSON `POST` to submit endpoint with `_botpoison` in payload (session evidence; needs fresh capture during implementation).

### LIKELY Root Causes (to prove or disprove)
| ID | Hypothesis | Confidence | Why plausible | Required proof |
|----|------------|------------|---------------|----------------|
| RC-A | Direct endpoint abuse bypasses client Botpoison | High | Submit endpoint is public in markup | Correlate inbox spam entries with provider logs missing valid Botpoison verification evidence |
| RC-B | Native fallback path bypasses `_botpoison` | Medium | Fallback can force native submit when network/CORS style failures occur | Reproduce fallback path and inspect whether `_botpoison` is absent or unverified server-side |
| RC-C | Version drift or stale SW cache preserves old behavior | Medium | Source/live version mismatch plus cache-first JS TTL | Confirm active runtime script hashes/versions on affected clients and SW cache state |
| RC-D | Defense-in-depth is too weak | High | No repo-verified Formspark-enforced honeypot/rate-limit hard gate in current evidence set | Verify active provider-side anti-abuse controls and their enforcement outcomes |
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Investigation planning for contact-form spam path on `/nl/contact`.
- Evidence matrix separating VERIFIED observations from LIKELY hypotheses.
- Server-side verification and observability plan (provider logs, inbox correlation, request fingerprints).
- Mitigation design with a Formspark honeypot-first candidate that remains compatible with endpoint abuse, fallback bypass, and stale asset concerns.
- Documentation updates in this spec folder only for planning.

### Out of Scope
- Unrelated site cleanup, refactors, or UX redesign outside contact spam mitigation.
- Broad form-system rewrite or migration away from current provider stack.
- Marketing or content changes unrelated to abuse prevention.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/01--anobel.com/034-form-bot-problem/spec.md` | Create | Investigation requirements, evidence baseline, hypotheses |
| `specs/01--anobel.com/034-form-bot-problem/plan.md` | Create | Investigation-first technical plan and phases |
| `specs/01--anobel.com/034-form-bot-problem/tasks.md` | Create | Executable task breakdown to prove/disprove root causes |
| `specs/01--anobel.com/034-form-bot-problem/checklist.md` | Create | Verification gates for planning, investigation, mitigation readiness |
| `specs/01--anobel.com/034-form-bot-problem/decision-record.md` | Create | ADRs for investigative strategy and security posture |
| `specs/01--anobel.com/034-form-bot-problem/implementation-summary.md` | Create | Planning-status implementation summary for truthful handoff |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Maintain a strict VERIFIED vs LIKELY evidence split | Spec artifacts explicitly separate observed facts and hypotheses with citations |
| REQ-002 | Prove/disprove RC-A endpoint abuse | Decision-ready conclusion based on provider-side request evidence and inbox correlation |
| REQ-003 | Prove/disprove RC-B fallback bypass | Controlled reproduction demonstrates whether fallback path can bypass Botpoison assurance |
| REQ-004 | Prove/disprove RC-C asset drift | Runtime version/caching analysis confirms or rejects stale-asset impact |
| REQ-005 | Define Formspark-enforced honeypot-first mitigation design | Plan defines a real DOM honeypot field enforced by provider behavior before inbox delivery |
| REQ-006 | Preserve unresolved investigation truth in all artifacts | Docs explicitly state RC-A/RC-B are not yet proven/disproven and issue is not marked fixed |
| REQ-007 | Add minimum observability design | Plan includes required telemetry fields to audit suspicious submissions end to end |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Define honeypot naming strategy compatible with Formspark | Plan prefers custom honeypot name, with `_honeypot` or `_gotcha` as supported defaults |
| REQ-009 | Keep optional client-side honeypot pre-check non-authoritative | Any client pre-check is convenience only; provider-side enforcement remains security boundary |
| REQ-010 | Keep Botpoison as layered defense | Plan retains Botpoison for defense-in-depth but does not treat it as sole investigation answer |
| REQ-011 | Define cache/version hardening | Plan includes explicit JS version integrity and service-worker invalidation strategy |
| REQ-012 | Define safe validation protocol | Investigation can run without sending real customer submissions |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A Formspark-enforced honeypot-first mitigation design is documented with concrete field strategy and submit-path compatibility.
- **SC-002**: Artifacts explicitly state the spam issue is unresolved and RC-A/RC-B remain unproven until provider-side evidence is collected.
- **SC-003**: Observability design can attribute suspicious submissions to enhanced submit, native fallback, or direct endpoint-hit patterns.
- **SC-004**: Botpoison is documented as layered defense, while provider-side honeypot enforcement is documented as primary low-change gate.
- **SC-005**: Drift detection strategy can identify mismatched runtime assets within one verification cycle.
<!-- /ANCHOR:success-criteria -->

---

### Acceptance Scenarios

- **AS-001** Given endpoint-only traffic samples, when analyzed, then direct-abuse indicators can be classified.
- **AS-002** Given forced network/CORS failure in controlled testing, when fallback path runs, then assurance behavior is observable.
- **AS-003** Given a client with cached assets, when runtime is inspected, then active script versions are attributable.
- **AS-004** Given a submission event, when telemetry is reviewed, then delivery decision has a server-side reason code.
- **AS-005** Given a honeypot field is populated, when Formspark policy evaluates submission, then submission is silently ignored and does not reach inbox records.
- **AS-006** Given honeypot client pre-check is enabled, when triggered, then UX can short-circuit without redefining server trust boundaries.
- **AS-007** Given mitigation rollout, when monitoring runs, then spam rate decreases without unacceptable legitimate-drop rate.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Access to provider-side request data | Without logs, RC-A remains unproven | Request temporary operational access or exported evidence set |
| Dependency | Confirmation of active Formspark honeypot configuration | Without config confirmation, mitigation impact cannot be attributed | Capture configuration evidence and controlled submission outcomes |
| Dependency | Ability to observe live runtime cache state | RC-C could be misclassified | Capture runtime asset URLs, headers, and SW cache metadata on affected sessions |
| Risk | False confidence from client-only tests | Inbox spam persists after partial fixes | Require server evidence gate before marking complete |
| Risk | Silent-ignore behavior masks rejected spam visibility | Team misreads lower submission counts as total threat reduction | Track dropped-at-gate indicators separately from inbox volume |
| Risk | Over-broad anti-spam controls | Legitimate submissions blocked | Define allowlist and progressive rollout with rollback conditions |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
<!-- ANCHOR:requirements -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Planned mitigations must not add more than 300 ms median latency to legitimate submission handling.

### Security
- **NFR-S01**: Bot checks that can influence inbox delivery must be verified server-side, not trusted from client payload alone.
- **NFR-S02**: Public endpoint exposure is treated as expected; abuse prevention must assume endpoint discovery by attackers.

### Reliability
- **NFR-R01**: If anti-abuse verification dependency fails, system behavior must be fail-safe and observable.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:edge-cases -->
<!-- /ANCHOR:requirements -->
## 8. EDGE CASES

### Data Boundaries
- Missing or malformed honeypot field in JSON payload while DOM field exists.
- Missing `_botpoison` token with otherwise valid form body.
- Submission payloads mimicking browser structure but originating outside page runtime.

### Error Scenarios
- CORS or network-style failure triggering native fallback path.
- Honeypot field exists in DOM but is omitted from serialized payload in custom submit path.
- Service worker serves stale JS despite source updates.
- Event-name drift causes persistence/cleanup side effects not to fire.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Multiple form layers, runtime/version behaviors, provider dependencies |
| Risk | 22/25 | Inbox abuse, trust-boundary confusion, security-impacting behavior |
| Research | 17/20 | Requires cross-correlation of client traces and server/provider evidence |
| Multi-Agent | 5/15 | Single workflow, but cross-team dependency with provider operations |
| Coordination | 13/15 | Needs synchronized evidence from code, live runtime, and inbox/provider logs |
| **Total** | **75/100** | **Level 3** |

<!-- /ANCHOR:complexity -->
---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Direct endpoint abuse remains undetected | High | High | Add provider-enforced honeypot gate plus request fingerprint logging |
| R-002 | Native fallback bypasses token assurance | High | Medium | Ensure real DOM honeypot survives fallback and enforce provider-side spam gates |
| R-003 | Stale assets keep old behavior in production | Medium | Medium | Add version audit, SW invalidation procedure, and cache-bust checks |
| R-004 | Silent ignore semantics reduce visibility of blocked attempts | Medium | Medium | Add observability notes for ignored submissions and compare with inbox trends |
| R-005 | Fixes over-block legitimate users | High | Low | Progressive rollout with explicit rollback thresholds |

---

## 11. USER STORIES

### US-001: Security-First Contact Intake (Priority: P0)

**As a** site owner, **I want** a provider-enforced honeypot gate backed by layered anti-abuse checks, **so that** low-effort bot submissions are filtered before inbox delivery even if client paths are bypassed.

**Acceptance Criteria**:
1. **Given** a suspicious submission path, **when** evidence is reviewed, **then** the path is attributable and classified.
2. **Given** a populated honeypot field or failed spam verification, **when** submission is processed by provider policy, **then** it is ignored before inbox delivery.

---

### US-002: Investigation Confidence (Priority: P0)

**As an** engineer, **I want** hypotheses and mitigation assumptions validated with hard evidence, **so that** honeypot-first mitigation is effective without overstating what is proven.

**Acceptance Criteria**:
1. **Given** RC-A through RC-D, **when** investigation completes, **then** each has a clear verdict with citations.
2. **Given** provider evidence is unavailable, **when** verdict quality drops below threshold, **then** status remains explicitly inconclusive and blocked.

---

### US-003: Stable Runtime Behavior (Priority: P1)

**As a** maintainer, **I want** visibility into version drift and stale caches, **so that** production behavior matches intended deployed code.

**Acceptance Criteria**:
1. **Given** a reported anomaly, **when** runtime assets are inspected, **then** active versions and cache source are identifiable.
2. **Given** source and live versions differ, **when** drift is confirmed, **then** mitigation includes explicit cache invalidation and version-governance steps.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- What provider-side evidence is available to prove honeypot and Botpoison verification outcomes per submission?
- Is a Formspark honeypot already configured in production, and if so, what field name is active?
- Are there existing server-side rules (rate-limits, additional challenge scoring) configured outside this repository?
- What is the acceptable false-positive rate for anti-spam controls on legitimate contact requests?

<!-- /ANCHOR:questions -->
---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`

---
