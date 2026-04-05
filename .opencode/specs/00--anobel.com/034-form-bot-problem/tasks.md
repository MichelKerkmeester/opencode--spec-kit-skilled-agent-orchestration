---
title: "Tasks: Contact Form Bot Submission Investigation [00--anobel.com/034-form-bot-problem/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "contact form"
  - "botpoison"
  - "spam"
  - "investigation"
  - "034"
importance_tier: "important"
contextType: "implementation"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
---
# Tasks: Contact Form Bot Submission Investigation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Baseline Evidence Consolidation

- [x] T001 Capture intended contact script versions from source (`src/0_html/contact.html`)
- [x] T002 Capture live contact script versions from session output artifact
- [x] T003 Record public submit endpoint and Botpoison key exposure evidence
- [x] T004 Confirm enhancement selector scope in `form_submission.js`
- [x] T005 Confirm Botpoison token injection and error path in `form_submission.js`
- [x] T006 Record live safe observation showing `_botpoison` present in JSON payload
- [x] T007 Confirm native fallback path and default-enabled fallback behavior
- [x] T008 Confirm submit interception + custom validation control flow
- [x] T009 Record persistence/submission event-name drift evidence
- [x] T010 Confirm service-worker cache-first JS policy and TTL evidence
- [x] T011 Confirm source-to-minified mapping in manifest
- [x] T012 Confirm absence of form-specific automated tests in `package.json`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Hypothesis Validation (RC-A to RC-D)

- [x] T013 Define evidence schema for verdict-ready analysis (timestamp, request fingerprint, assurance result, delivery decision)
- [B] T014 Confirm provider/inbox evidence access path and export format [BLOCKED: external Formspark/inbox access confirmation still required; repo evidence alone is insufficient]
- [ ] T015 Validate RC-A direct endpoint abuse using provider-side evidence [B:T014]
- [ ] T016 Validate RC-B native fallback behavior under network/CORS failure simulation [B:T014]
- [ ] T017 [P] Validate RC-C runtime drift with version/hash and service-worker cache inspection
- [ ] T018 [P] Validate RC-D control depth (server-side anti-abuse gate audit)
- [ ] T019 Produce per-hypothesis verdict table with confidence level and citations [B:T015] [B:T016] [B:T017] [B:T018]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Mitigation Design and Prioritization

- [ ] T020 Define Formspark-enforced honeypot-first mitigation with a real DOM field that is not CSS-hidden by brittle selectors
- [ ] T021 Select honeypot field naming strategy (prefer custom name; `_honeypot` or `_gotcha` as supported defaults) and document rationale
- [ ] T022 Validate submit-path compatibility: honeypot field survives custom JSON serialization path and native submit fallback
- [ ] T023 Define optional client-side honeypot pre-check as UX convenience only (non-authoritative)
- [ ] T024 Define Botpoison as layered defense with explicit server-verified evidence requirements, not sole trust boundary
- [ ] T025 Define observability for silent-ignore behavior (dropped at gate) and inbox-side spam trend correlation
- [ ] T026 Define service-worker and asset-version governance controls
- [ ] T027 Create mitigation rollout sequence and finalize `webflow-honeypot-guide.md` (field insertion, naming, safe hiding, architecture alignment, Formspark config, publish and verification checklists) ordered by risk reduction and implementation cost

### Concrete Contact Form Integration Tasks

- [ ] T032 Add real honeypot field markup to the `/nl/contact` form with final field name `contact_website_check`, neutral label text, `required` disabled, and field enabled (`src/0_html/contact.html`)
- [ ] T033 Apply stable off-screen wrapper styling for `.hp-field-wrap` and avoid anti-patterns (`display: none`, `visibility: hidden`, `disabled`) so the field remains in form payload (`src/0_html/contact.html` or linked stylesheet)
- [ ] T034 Verify enhanced custom JSON submit path includes `contact_website_check` in serialized payload (inspect `FormData` -> JSON mapping and network request evidence) (`src/2_javascript/form/form_submission.js`)
- [ ] T035 Verify native fallback submit path also includes `contact_website_check` when fallback is forced (network evidence + payload key confirmation) (`src/2_javascript/form/form_submission.js`)
- [ ] T036 [P] Implement optional client-side pre-check for non-empty `contact_website_check` as UX convenience only; keep provider-side honeypot as authoritative gate (`src/2_javascript/form/form_submission.js`)
- [ ] T037 Align Formspark honeypot/custom honeypot setting to `contact_website_check` and keep Botpoison as layered defense (provider dashboard configuration evidence)
- [ ] T038 Execute post-implementation verification matrix for both submit paths: empty honeypot (legit) and filled honeypot (trap), plus regression check for normal contact submissions
- [ ] T039 Update implementation evidence artifacts (`checklist.md`, `implementation-summary.md`) with test results and explicit unresolved-truth wording until RC-A/RC-B are closed
<!-- /ANCHOR:phase-3 -->

---

### Verification and Handoff Readiness

- [ ] T028 Define success metrics (spam reduction, false-positive rate, response latency)
- [ ] T029 Define rollback triggers and emergency fallback policy
- [ ] T030 Update checklist evidence for completed planning gates
- [ ] T031 Produce implementation-ready handoff packet from this spec folder

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements in `spec.md` satisfied with evidence
- [ ] Evidence schema and provider/inbox access prerequisites completed before verdict consolidation
- [ ] RC-A through RC-D each have a clear verdict, or are explicitly marked inconclusive with blockers
- [ ] Formspark honeypot-first mitigation sequence approved with Botpoison layering
- [ ] Checklist P0/P1 items complete or explicitly deferred with approval
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Webflow Guide**: See `webflow-honeypot-guide.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---
