---
title: "Feature Specification: Contact Form Bot Submission Investigation"
description: "Investigate why bot submissions still reach the /nl/contact inbox despite Botpoison and produce a mitigation plan grounded in verified server-side evidence."
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + level3-arch | v2.2"
trigger_phrases:
  - "contact form"
  - "botpoison"
  - "formspark"
  - "spam"
  - "bot submission"
  - "034"
importance_tier: "critical"
contextType: "decision"
---
# Feature Specification: Contact Form Bot Submission Investigation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The `/nl/contact` page includes Botpoison and enhanced submit interception, yet bot-like submissions still reach the inbox. Verified evidence shows client enhancements can produce `_botpoison` tokens, but the public submit endpoint and public key are exposed in live markup, so bypass risk remains.

The first milestone is to prove or disprove four likely causes with server-side evidence before changing UI flows: direct endpoint abuse, native fallback bypass, stale asset drift, and weak defense-in-depth.

**Key Decisions**: Prioritize server-side verification and observability over speculative front-end tweaks; treat client-side bot signals as advisory until enforced server-side.

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
Produce an evidence-backed investigation and mitigation plan that explains how spam reaches the inbox and defines prioritized, testable remediations with minimal disruption.

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
| RC-D | Defense-in-depth is too weak | High | No visible honeypot/rate-limit/server-side hard gate in current evidence set | Verify absence/presence of server-side anti-abuse controls in provider/backend configuration |
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Investigation planning for contact-form spam path on `/nl/contact`.
- Evidence matrix separating VERIFIED observations from LIKELY hypotheses.
- Server-side verification and observability plan (provider logs, inbox correlation, request fingerprints).
- Mitigation design for endpoint abuse, fallback bypass, and stale asset behavior.
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
| REQ-005 | Establish server-side enforcement requirements | Mitigation plan defines non-optional server checks before inbox delivery |
| REQ-006 | Add minimum observability design | Plan includes required telemetry fields to audit suspicious submissions end to end |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Define layered anti-abuse controls | Plan includes at least one server-side gate plus secondary controls (rate limit and trap signal) |
| REQ-008 | Define cache/version hardening | Plan includes explicit JS version integrity and service-worker invalidation strategy |
| REQ-009 | Define safe validation protocol | Investigation can run without sending real customer submissions |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All four hypotheses (RC-A through RC-D) are marked proven or disproven with cited evidence.
- **SC-002**: A server-side-first mitigation sequence is approved before any speculative UI change work.
- **SC-003**: Observability design can attribute each suspicious submission to a concrete path (enhanced submit, native fallback, or direct endpoint hit).
- **SC-004**: Drift detection strategy can identify mismatched runtime assets within one verification cycle.
<!-- /ANCHOR:success-criteria -->

---

## 5.1 ACCEPTANCE SCENARIOS

- **AS-001** Given endpoint-only traffic samples, when analyzed, then direct-abuse indicators can be classified.
- **AS-002** Given forced network/CORS failure in controlled testing, when fallback path runs, then assurance behavior is observable.
- **AS-003** Given a client with cached assets, when runtime is inspected, then active script versions are attributable.
- **AS-004** Given a submission event, when telemetry is reviewed, then delivery decision has a server-side reason code.
- **AS-005** Given a missing or invalid anti-abuse assurance state, when policy is applied, then submission is blocked or quarantined.
- **AS-006** Given mitigation rollout, when monitoring runs, then spam rate decreases without unacceptable legitimate-drop rate.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Access to provider-side request data | Without logs, RC-A remains unproven | Request temporary operational access or exported evidence set |
| Dependency | Ability to observe live runtime cache state | RC-C could be misclassified | Capture runtime asset URLs, headers, and SW cache metadata on affected sessions |
| Risk | False confidence from client-only tests | Inbox spam persists after partial fixes | Require server evidence gate before marking complete |
| Risk | Over-broad anti-spam controls | Legitimate submissions blocked | Define allowlist and progressive rollout with rollback conditions |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Planned mitigations must not add more than 300 ms median latency to legitimate submission handling.

### Security
- **NFR-S01**: Bot checks that can influence inbox delivery must be verified server-side, not trusted from client payload alone.
- **NFR-S02**: Public endpoint exposure is treated as expected; abuse prevention must assume endpoint discovery by attackers.

### Reliability
- **NFR-R01**: If anti-abuse verification dependency fails, system behavior must be fail-safe and observable.

---

## 8. EDGE CASES

### Data Boundaries
- Missing `_botpoison` token with otherwise valid form body.
- Submission payloads mimicking browser structure but originating outside page runtime.

### Error Scenarios
- CORS or network-style failure triggering native fallback path.
- Service worker serves stale JS despite source updates.
- Event-name drift causes persistence/cleanup side effects not to fire.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Multiple form layers, runtime/version behaviors, provider dependencies |
| Risk | 22/25 | Inbox abuse, trust-boundary confusion, security-impacting behavior |
| Research | 17/20 | Requires cross-correlation of client traces and server/provider evidence |
| Multi-Agent | 5/15 | Single workflow, but cross-team dependency with provider operations |
| Coordination | 13/15 | Needs synchronized evidence from code, live runtime, and inbox/provider logs |
| **Total** | **75/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Direct endpoint abuse remains undetected | High | High | Add server-side verification gate and request fingerprint logging |
| R-002 | Native fallback bypasses token assurance | High | Medium | Reproduce fallback path and enforce server rejection when token assurance missing |
| R-003 | Stale assets keep old behavior in production | Medium | Medium | Add version audit, SW invalidation procedure, and cache-bust checks |
| R-004 | Fixes over-block legitimate users | High | Low | Progressive rollout with explicit rollback thresholds |

---

## 11. USER STORIES

### US-001: Security-First Contact Intake (Priority: P0)

**As a** site owner, **I want** submissions verified through server-side anti-abuse checks, **so that** spam does not reach the contact inbox by bypassing client controls.

**Acceptance Criteria**:
1. **Given** a suspicious submission path, **when** evidence is reviewed, **then** the path is attributable and classified.
2. **Given** missing or invalid anti-abuse assurance, **when** submission is processed, **then** inbox delivery is blocked or quarantined by policy.

---

### US-002: Investigation Confidence (Priority: P0)

**As an** engineer, **I want** hypotheses proven or disproven with hard evidence, **so that** we implement targeted mitigations instead of speculative changes.

**Acceptance Criteria**:
1. **Given** RC-A through RC-D, **when** investigation completes, **then** each has a clear verdict with citations.
2. **Given** provider evidence is unavailable, **when** verdict quality drops below threshold, **then** status is explicitly marked inconclusive and blocked.

---

### US-003: Stable Runtime Behavior (Priority: P1)

**As a** maintainer, **I want** visibility into version drift and stale caches, **so that** production behavior matches intended deployed code.

**Acceptance Criteria**:
1. **Given** a reported anomaly, **when** runtime assets are inspected, **then** active versions and cache source are identifiable.
2. **Given** source and live versions differ, **when** drift is confirmed, **then** mitigation includes explicit cache invalidation and version-governance steps.

---

## 12. OPEN QUESTIONS

- What provider-side evidence is available to prove token verification result per submission?
- Are there existing server-side rules (rate-limits, honeypots, challenge scoring) configured outside this repository?
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
