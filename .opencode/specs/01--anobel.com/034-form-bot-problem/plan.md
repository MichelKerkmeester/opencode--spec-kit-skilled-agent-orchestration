---
title: "Implementation Plan: Contact Form Bot Submission Investigation"
description: "Plan unresolved spam investigation while prioritizing a Formspark-enforced honeypot-first mitigation compatible with custom JSON submit and native fallback."
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
trigger_phrases:
  - "implementation"
  - "plan"
  - "contact form"
  - "botpoison"
  - "spam"
  - "034"
importance_tier: "critical"
contextType: "decision"
---
# Implementation Plan: Contact Form Bot Submission Investigation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (Vanilla), static HTML, service worker |
| **Framework** | Webflow-rendered pages with custom JS enhancements |
| **Submission Backend** | Formspark submit endpoint (`submit-form.com`) |
| **Anti-bot Layer** | Botpoison client SDK + candidate Formspark-enforced honeypot gate |
| **Testing** | Browser-safe live inspection, code inspection, controlled request tracing |

### Overview
This plan keeps the unresolved investigation front and center while refocusing mitigation design toward a low-change, provider-enforced honeypot first. Work still starts with a server-observable evidence baseline and hypothesis validation (RC-A through RC-D), but mitigation design now assumes Formspark honeypot semantics are the fastest hard gate candidate.

Formspark documentation indicates honeypot/custom-honeypot and spam-verification failures are silently ignored (not saved, not counted, no notifications). Botpoison remains complementary and should stay layered, but current provenance does not support making Botpoison-only checks the sole trust boundary.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Planning Ready (current phase)
- [x] Problem statement and boundaries documented in `spec.md`
- [x] Likely causes listed with proof criteria (RC-A through RC-D)
- [x] Provider/inbox evidence requirements documented as explicit dependencies

### Definition of Planning Done (current phase)
- [x] Checklist aligns planning-readiness gates separately from future implementation gates
- [x] RC-A and RC-B dependency prerequisites are explicit in `tasks.md`
- [x] Decision record language remains planning-rationale (no implied formal sign-off)

### Definition of Future Implementation Ready
- [ ] RC-A through RC-D each marked proven or disproven with evidence
- [ ] Mitigation plan approved with Formspark-enforced honeypot as first low-change server-side gate
- [ ] Verification checklist P0/P1 items complete or deferred with explicit approval
<!-- /ANCHOR:quality-gates -->

---

## 2.1 AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm target hypothesis (RC-A, RC-B, RC-C, or RC-D) before running validation.
- Confirm evidence source and expected output format.
- Confirm whether action is observation-only or changes delivery policy.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Scope lock | Only investigate contact spam path and listed hypotheses |
| Evidence first | Do not claim verdict without citation |
| Safety | Prefer monitor-only mode before blocking policy changes |
| Traceability | Record timestamped evidence for every verdict |

### Status Reporting Format
- `STATUS: [phase]`
- `HYPOTHESIS: [RC-X]`
- `EVIDENCE: [source refs]`
- `VERDICT: [proven|disproven|inconclusive]`
- `NEXT: [next action]`

### Blocked Task Protocol
1. Mark task as blocked with explicit dependency.
2. Record required unblocker and owner.
3. Continue parallel tasks that do not weaken evidence quality.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Investigation-first, evidence-driven mitigation planning.

### Key Components
- **Contact page runtime (`contact.html`)**: Script loading and public endpoint exposure baseline.
- **Submission enhancer (`form_submission.js`)**: Interception, validation, Botpoison token injection, JSON payload construction, fallback behavior.
- **Persistence layer (`form_persistence.js`)**: Event-driven cleanup and state retention side effects.
- **Service worker (`service_worker.js`)**: Cache-first strategy affecting JS freshness.
- **Submit provider path (`submit-form.com`)**: Server-side trust boundary, honeypot/Botpoison enforcement behavior, and inbox delivery behavior.

### Data Flow
1. User submits `/nl/contact` form.
2. JS interception path builds `FormData`, injects `_botpoison`, and attempts enhanced JSON submit.
3. Failure conditions may trigger native form fallback.
4. Real DOM honeypot field should remain present for both enhanced JSON and native fallback paths.
5. Provider endpoint processes request; honeypot or spam-verification failures should be silently ignored.
6. Missing or misconfigured server-side enforcement can still allow spam delivery.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Evidence Baseline (priority)
- [ ] Build a single evidence matrix mapping each verified finding to source references.
- [ ] Capture provider/inbox trace fields needed for attribution (timestamp, source, token-verify result, delivery decision).
- [ ] Confirm runtime version state on affected clients (live script versions, active service-worker cache entries).

### Phase 2: Hypothesis Validation
- [ ] **RC-A** Direct endpoint abuse: correlate suspicious submissions with non-browser or missing verification patterns.
- [ ] **RC-B** Native fallback bypass: reproduce fallback and inspect token assurance and server behavior.
- [ ] **RC-C** Asset drift/stale cache: verify whether stale JS materially changes bot defenses.
- [ ] **RC-D** Defense depth: audit for server-side rate-limit/honeypot/challenge gate coverage.

### Phase 3: Mitigation Design
- [ ] Define and implement the real DOM honeypot field as `contact_website_check` for Formspark enforcement.
- [ ] Validate submit-path compatibility: honeypot field survives custom JSON submit and native fallback.
- [ ] Define optional client-side pre-check as UX convenience only (not security boundary).
- [ ] Keep Botpoison as layered defense and define evidence needs for its server-verified role.
- [ ] Define observability for silent-ignore outcomes, plus version governance and service-worker cache invalidation procedure.
- [ ] Produce a practical Webflow Designer implementation guide for the honeypot-first path.
- [ ] Produce implementation-ready tasks for markup insertion, safe wrapper styling, JSON/fallback payload verification, optional client pre-check, Formspark alignment, and post-change verification.

### Phase 4: Verification and Implementation Handoff Readiness
- [ ] Define pre/post metrics for spam reduction and false-positive safety.
- [ ] Produce runbook and rollback conditions.
- [ ] Convert plan outcomes into implementation tickets after approval.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:webflow-guide -->
## 4.1 WEBFLOW DESIGNER GUIDE (HONEYPOT-FIRST)

Execution-level Webflow and Formspark instructions are documented in `webflow-honeypot-guide.md`.

### Alignment Requirements
- Keep one real DOM honeypot input inside the same `/nl/contact` form that submits via the current Formspark/custom action architecture.
- Use final honeypot field name `contact_website_check` and keep it exactly aligned with Formspark honeypot configuration.
- Keep the honeypot field non-required, enabled, and submitted in both custom JSON and native fallback paths.
- Native Webflow anti-spam controls remain supplementary only while this form posts to Formspark/custom action.
- Preserve truthful status in all artifacts: issue remains unresolved; no fix claim until RC-A and RC-B are closed with provider evidence.
<!-- /ANCHOR:webflow-guide -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Investigation | Verify each hypothesis against evidence | Browser DevTools, provider dashboards, controlled traces |
| Integration | Validate honeypot enforcement and Botpoison layering behavior | Safe staging/test payload workflow |
| Manual | Confirm runtime version and fallback behavior | Browser + network inspection |

Investigation test protocol avoids real user data and avoids sending unintended production submissions where possible.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Provider-side request evidence access | External | Yellow | RC-A/RC-B cannot be conclusively proven |
| Confirmation of active honeypot field configuration in Formspark | External | Yellow | Honeypot-first mitigation cannot be validated confidently |
| Runtime inspection access on live contact page | Internal | Green | Drift and fallback analysis slows if unavailable |
| Inbox-side traceability fields | External | Yellow | Attribution confidence remains weak |
| Deployment owner for server-side controls | External | Yellow | Mitigation implementation blocked after planning |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Mitigation proposal introduces unacceptable false positives or blocks legitimate contact submissions.
- **Procedure**:
  1. Revert to prior delivery policy while preserving additional observability.
  2. Keep forensic logging active to avoid losing evidence.
  3. Narrow enforcement scope and rerun controlled validation before re-enable.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Baseline) ──► Phase 2 (Validate Causes) ──► Phase 3 (Design) ──► Phase 4 (Ready)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline | None | Validate Causes |
| Validate Causes | Baseline | Design |
| Design | Validate Causes | Ready |
| Ready | Design | Implementation handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline | Medium | 4-6 hours |
| Validate Causes | High | 8-14 hours |
| Design | Medium | 4-8 hours |
| Ready | Medium | 3-5 hours |
| **Total** | | **19-33 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline spam and legitimate submit rates captured
- [ ] Alert and monitoring thresholds defined
- [ ] Owner identified for rapid rollback decision

### Rollback Procedure
1. Switch delivery policy to monitor-only mode.
2. Disable newly added blocking logic while retaining evidence capture.
3. Confirm legitimate submissions recover.
4. Review blocked samples and adjust rules.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable for planning phase
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│  Evidence Baseline   │───►│  Cause Validation    │───►│  Mitigation Design   │
└──────────────────────┘    └──────────────────────┘    └──────────┬───────────┘
                                                                   │
                                                           ┌───────▼────────┐
                                                           │ Rollout Readiness│
                                                           └─────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Evidence matrix | Existing verified findings | Traceable baseline | Cause validation |
| Cause validation | Evidence matrix + provider access | Verdicts for RC-A to RC-D | Mitigation design |
| Mitigation design | Validated verdicts | Approved control strategy | Rollout readiness |
| Rollout readiness | Design + metrics | Implementation handoff | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Obtain provider-side evidence visibility and honeypot configuration confirmation** - Critical
2. **Validate RC-A and RC-B without overstating verdict confidence** - Critical
3. **Finalize Formspark-enforced honeypot-first gate policy with Botpoison layering** - Critical
4. **Approve rollout and rollback criteria with silent-ignore observability** - Critical

**Total Critical Path**: 4 major gates, no safe shortcut

**Parallel Opportunities**:
- RC-C version-drift analysis can run in parallel with RC-D control audit.
- Documentation sync can run in parallel with evidence collection.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline complete | All verified findings mapped with references | Phase 1 complete |
| M2 | Cause verdicts complete | RC-A..RC-D each proven or disproven | Phase 2 complete |
| M3 | Mitigation strategy approved | Server-side-first controls accepted | Phase 3 complete |
| M4 | Rollout-ready handoff | Tasks and checklist ready for implementation | Phase 4 complete |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Formspark-enforced honeypot-first mitigation before UI hardening

**Status**: Proposed (planning rationale; formal approval pending implementation kickoff)

**Context**: Current evidence shows client behavior alone cannot establish trustworthy anti-abuse enforcement; Formspark docs provide a low-change server-side gate candidate through honeypot enforcement semantics.

**Decision**: Prioritize a Formspark-enforced honeypot implemented as a real DOM field as first mitigation candidate, while keeping server-side verification and telemetry verdicts mandatory before claiming resolution.

**Consequences**:
- Positive: Reduces guesswork and prevents ineffective client-only fixes.
- Negative: Depends on external provider visibility and coordination.

**Alternatives Rejected**:
- Botpoison-only answer without honeypot gate: rejected because available provenance does not make it a sufficient standalone investigation answer.

---
