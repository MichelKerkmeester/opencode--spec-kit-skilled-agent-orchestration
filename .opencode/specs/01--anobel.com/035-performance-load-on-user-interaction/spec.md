---
title: "Feature Specification: Performance Loading on User Interaction - anobel.com"
description: "Define a Level 3 implementation-ready plan to defer non-critical script activation by interaction, visibility, and idle gates while preserving UX, Core Web Vitals, and reliability, and extend sk-code--web guidance for this pattern."
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + level3-arch | v2.2"
trigger_phrases:
  - "performance"
  - "interaction gating"
  - "deferred loading"
  - "lighthouse"
  - "pagespeed"
  - "tbt"
  - "inp"
  - "035"
  - "anobel"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Performance Loading on User Interaction - anobel.com

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

anobel.com currently initializes several non-critical experiences eagerly, which increases early main-thread work and hurts responsiveness. The highest-value opportunity is form-related loading, followed by Lenis, Swiper, and selected video/navigation behaviors that can activate only when user intent is explicit.

This specification defines an implementation-ready Level 3 plan across two scopes: (1) website loading strategy using interaction, viewport, and idle gates, and (2) updates to `sk-code--web` so the skill routes and documents this strategy by default.

**Key Decisions**: Adopt an explicit loading taxonomy (eager, interaction, viewport, idle); use a shared bootstrap architecture instead of ad hoc per-page gating; expand `sk-code--web` routing and performance references.

**Critical Dependencies**: Existing Motion/Lenis/Swiper integration behavior, service worker precache alignment, and external skill maintainers accepting routing and reference updates.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft (planning only) |
| **Created** | 2026-03-07 |
| **Branch** | `035-performance-load-on-user-interaction` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The site has working lazy-loading patterns in isolated places, but several integrations still load or initialize eagerly before user intent is clear. This creates avoidable startup cost and can worsen Lighthouse/PageSpeed outcomes, especially TBT/INP sensitivity from main-thread pressure.

In parallel, `sk-code--web` currently routes PERFORMANCE tasks to general implementation docs and under-loads the performance references most relevant to interaction-gated loading, making guidance less direct for this workload.

### Purpose
Define a low-risk, implementation-ready strategy that defers non-critical loading to interaction, viewport, or idle triggers while preserving core UX and correctness, and align the external skill so future work is routed to the right references and patterns.

### Verified Baseline Inputs
1. Forms are highest-value deferral targets on contact and vacatures pages (`src/0_html/contact.html:57`, `src/0_html/contact.html:58`, `src/0_html/contact.html:59`, `src/0_html/contact.html:72`, `src/0_html/werken_bij.html:54`, `src/0_html/werken_bij.html:58`, `src/0_html/werken_bij.html:84`, `src/0_html/werken_bij.html:85`, `src/0_html/werken_bij.html:86`, `src/0_html/werken_bij.html:93`).
2. Existing form stack already contains lazy elements (Botpoison lazy load and FilePond wait/retry) (`src/2_javascript/form/form_submission.js:128`, `src/2_javascript/form/input_upload.js:825`).
3. Lenis is eagerly loaded globally on desktop and is a first-interaction candidate, with guarded consumers already present (`src/0_html/global.html:181`, `src/2_javascript/form/form_submission.js:224`).
4. Swiper is eagerly loaded on multiple pages and can be gated by visibility/interaction, with off-screen pause logic already in components (`src/0_html/home.html:44`, `src/0_html/contact.html:40`, `src/0_html/werken_bij.html:48`, `src/2_javascript/swiper/marquee_brands.js:90`, `src/2_javascript/swiper/timeline.js:108`).
5. Video flows already have lazy modes that can be extended (`src/0_html/werken_bij.html:51`, `src/0_html/werken_bij.html:68`, `src/2_javascript/video/video_background_hls_hover.js:208`, `src/2_javascript/video/video_background_hls.js:51`).
6. Navigation animation scripts are potentially deferrable but depend on Motion readiness ordering (`src/0_html/global.html:80`, `src/0_html/global.html:81`, `src/0_html/global.html:83`, `src/2_javascript/navigation/nav_mobile_menu.js:852`, `src/2_javascript/navigation/nav_dropdown.js:396`, `src/2_javascript/navigation/nav_language_selector.js:325`).
7. Some scripts must remain eager: hero/LCP-critical flows and cookie consent sequencing (`src/0_html/home.html:54`, `src/0_html/nobel/n3_de_locatie.html:53`, `src/2_javascript/hero/hero_video.js:159`, `src/2_javascript/modal/modal_cookie_consent.js:1228`).
8. Service worker precache behavior must remain consistent with deferred-loading choices (`src/2_javascript/global/service_worker.js:48`, `src/2_javascript/global/service_worker.js:49`, `src/2_javascript/global/service_worker.js:62`, `src/2_javascript/global/service_worker.js:65`, `src/2_javascript/global/service_worker.js:66`, `src/2_javascript/global/service_worker.js:67`, `src/2_javascript/global/service_worker.js:68`, `src/2_javascript/global/service_worker.js:69`).
9. `sk-code--web` PERFORMANCE routing under-loads performance references and misses interaction-gating terminology (`/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-code--web/SKILL.md:147`, `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-code--web/references/performance/resource_loading.md:15`, `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-code--web/references/performance/third_party.md:15`, `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-code--web/references/performance/cwv_remediation.md:251`).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Loading taxonomy and candidate classification for website scripts: eager vs interaction vs viewport vs idle.
- Shared bootstrap architecture to centralize gate triggers and avoid per-page drift.
- Implementation plan for forms, Lenis, Swiper, selected HLS/video, and eligible navigation animation startup.
- Guardrails for explicitly non-deferrable flows (hero/LCP and cookie consent behavior).
- Service worker strategy updates to prevent stale cache or broken prefetch/precache assumptions.
- External `sk-code--web` updates: routing signals, `RESOURCE_MAP["PERFORMANCE"]`, dedicated interaction-gated reference, and a mandatory first-increment pair of assets (`interaction_gate_patterns.js` and `performance_loading_checklist`).

### Out of Scope
- Actual code implementation in website or skill repositories (this spec is planning only).
- Re-architecting Webflow platform-owned script loading.
- Deferring hero/LCP critical scripts or cookie consent startup behind user interaction.
- Level 3+ governance workflow expansion (approvals/sign-off matrix).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `src/0_html/global.html` | Modify | Introduce shared gate bootstrap wiring and remove eager-only assumptions where safe |
| `src/0_html/contact.html` | Modify | Move form-related scripts to interaction/viewport strategy |
| `src/0_html/werken_bij.html` | Modify | Gate form and HLS-related startup paths based on visibility/interaction |
| `src/0_html/home.html` | Modify | Gate eligible Swiper and non-LCP scripts without touching hero-critical flow |
| `src/2_javascript/form/form_submission.js` | Modify | Integrate shared gate API and maintain existing Botpoison behavior |
| `src/2_javascript/form/input_upload.js` | Modify | Replace polling fallback with gate-aware activation where possible |
| `src/2_javascript/swiper/marquee_brands.js` | Modify | Attach init to viewport/interaction triggers |
| `src/2_javascript/swiper/timeline.js` | Modify | Attach init to viewport/interaction triggers |
| `src/2_javascript/video/video_background_hls_hover.js` | Modify | Refine lazy mode entry conditions and fallback behavior |
| `src/2_javascript/video/video_background_hls.js` | Modify | Use gate taxonomy for non-critical startup |
| `src/2_javascript/navigation/nav_mobile_menu.js` | Modify | Defer non-critical listeners until first interaction after Motion-ready guard |
| `src/2_javascript/navigation/nav_dropdown.js` | Modify | Defer non-critical animation setup with readiness guard |
| `src/2_javascript/navigation/nav_language_selector.js` | Modify | Defer enhancement setup while preserving accessibility baseline |
| `src/2_javascript/global/service_worker.js` | Modify | Align precache/runtime cache with deferred resource model |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-code--web/SKILL.md` | Modify | Expand routing signals and PERFORMANCE resource loading |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-code--web/references/performance/interaction_gated_loading` | Create | New markdown guidance for interaction/viewport/idle gating decisions |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-code--web/assets/patterns/interaction_gate_patterns.js` | Create | Reusable snippets for gate bootstrap and safe trigger wiring |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-code--web/assets/checklists/performance_loading_checklist` | Create | New markdown checklist tuned to Lighthouse/TBT/INP goals |
<!-- /ANCHOR:scope -->

---

## 3.1 CANONICAL CANDIDATE MATRIX

This matrix is the single source of truth for gate classification. `plan.md` and `tasks.md` must reference these IDs directly.

| Matrix ID | Module/Page | Gate Type | Exact Trigger | Fallback | Exclusion Reason | Expected Benefit | Verification Method |
|-----------|-------------|-----------|---------------|----------|------------------|------------------|---------------------|
| CM-001 | Contact form stack (`contact.html`, `form_submission.js`, `input_upload.js`) | interaction | First `focusin` inside form OR first `pointerdown` on form region | Force init on first submit attempt; idle warm-up at 3000 ms if neither event occurs | Not startup-critical, below fold for most sessions | Reduce early script parse/exec on `contact`; target TBT delta >= 80 ms | DevTools trace shows no form module init before trigger; submit + upload smoke pass |
| CM-002 | Vacatures form stack (`werken_bij.html`, form modules) | interaction | First `focusin` on vacatures form OR CTA click that targets form anchor | Same as CM-001 | Not LCP-critical and often not used per session | Reduce initial main-thread pressure on `werken_bij`; target TBT delta >= 80 ms | No-init-before-trigger trace + successful submit/upload regression |
| CM-003 | Lenis desktop (`global.html`) | interaction | First scroll-intent event (`wheel`, `touchmove`, `keydown` in {Space, PageUp, PageDown, Home, End, ArrowUp, ArrowDown}) | `requestIdleCallback` with 2500 ms timeout | Skip init when `prefers-reduced-motion: reduce` is active | Reduce global startup JS execution; target TBT delta >= 40 ms on all three target pages | Instrumentation confirms Lenis instance absent before trigger; scroll UX check |
| CM-004 | Swiper marquee brands (`marquee_brands.js`) | viewport | Section reaches 20% visibility (`IntersectionObserver`, rootMargin `200px 0px`) | If IO unsupported, init on first interaction with section; final fallback at 3500 ms timeout | Non-critical decorative carousel | Lower off-screen startup work; target >= 30 ms long-task reduction | IO simulation + one-time init assertions + visual regression |
| CM-005 | Swiper timeline (`timeline.js`) | viewport | Timeline container reaches 30% visibility OR user clicks timeline controls | If IO unsupported, init on first control interaction | Timeline not required for initial render | Lower initial scripting on timeline pages; target >= 30 ms long-task reduction | Trigger tests for visibility and control interaction; no double-init logs |
| CM-006 | HLS background + hover video (`video_background_hls.js`, `video_background_hls_hover.js`) | viewport+interaction | Step 1: viewport enter at 25% visibility loads metadata; Step 2: pointer/keyboard interaction starts full player | If no IO, metadata loads on first interaction; if no interaction, never escalate to full player | Video effects are enhancement, not primary content | Reduce autoplay-related startup cost while preserving engagement UX | Media event logs verify two-step behavior; keyboard + touch scenarios pass |
| CM-007 | Navigation enhancements (`nav_mobile_menu.js`, `nav_dropdown.js`, `nav_language_selector.js`) | interaction | First nav intent (`menu button click`, `focusin` on nav controls, `Enter`/`Space` on nav toggles) after Motion-ready guard | If Motion-ready delayed > 1500 ms, attach minimal handlers then upgrade when ready | Baseline nav semantics must remain available without enhancements | Reduce upfront nav animation setup work; target >= 20 ms startup reduction | Keyboard-only and touch smoke tests + Motion-ordering trace |
| CM-008 | Home hero video (`home.html`, `hero_video.js`) | eager (excluded) | Immediate on startup | None (must remain eager) | LCP-critical hero behavior | Preserve LCP stability and initial visual completeness | LCP trace parity vs baseline and hero start-order check |
| CM-009 | Nobel location hero (`n3_de_locatie.html`, `hero_video.js`) | eager (excluded) | Immediate on startup | None (must remain eager) | LCP-critical media path | Preserve existing LCP and perceived load behavior | LCP and startup sequence parity checks |
| CM-010 | Cookie consent modal (`modal_cookie_consent.js`) | eager (excluded) | Immediate on startup before optional enhancements | None (must remain eager) | Compliance and consent sequencing cannot be delayed | Maintain legal/compliance behavior and prevent tracking race | Consent smoke tests confirm unchanged order and visibility |
| CM-011 | Service worker deferred-asset policy (`service_worker.js`) | eager (activation policy) | `install`/`activate` events with policy version check | Emergency disable path via `GATE_ROLLOUT_MODE='legacy-eager'` and SW cache cleanup | Must run deterministically to avoid mixed-version behavior | Prevent stale cache serving mixed gate policies across sessions | SW lifecycle test: old/new cache isolation + controlled rollback drill |

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define and adopt a four-tier loading taxonomy | Taxonomy appears exactly as `eager|interaction|viewport|idle` in `spec.md`, `plan.md`, `tasks.md`, and ADRs with zero conflicting labels |
| REQ-002 | Produce candidate classification for all listed high-impact targets | Canonical matrix covers 100% of listed modules/pages (CM-001..CM-011) with gate type, exact trigger, fallback, exclusion reason, expected benefit, and verification method |
| REQ-003 | Preserve eager behavior for explicitly non-deferrable flows | CM-008..CM-010 remain `eager (excluded)` and are validated by startup-order smoke tests with no sequencing regressions |
| REQ-004 | Use shared bootstrap architecture for gate orchestration | Plan defines one central runtime and task set; design review finds 0 new ad hoc per-page gate orchestrators |
| REQ-005 | Define service worker synchronization rules | Rollout section defines canary scope, halt conditions, rollback toggle path, and SW version-transition rules including max one active policy version |
| REQ-006 | Expand `sk-code--web` router for interaction-gated terminology | Router test set demonstrates >= 90% correct PERFORMANCE intent classification across at least 10 prompts containing interaction/defer/Lighthouse/TBT/INP terms |
| REQ-007 | Add dedicated skill references/assets for interaction-gated loading | First increment includes all three: `interaction_gated_loading` reference, `interaction_gate_patterns.js`, and `performance_loading_checklist` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Define measurable performance verification protocol | For `home`, `contact`, `werken_bij`, plan includes before/after measurements and pass thresholds: Lighthouse mobile TBT median improves >= 20% and INP does not regress by more than 10 ms |
| REQ-009 | Define a staged rollout and rollback approach | Rollout defines canary progression (10% -> 50% -> 100%), halt conditions, and rollback SLA <= 30 minutes from halt declaration |
| REQ-010 | Minimize behavior regressions for interaction-dependent UX | First-use gated action latency is <= 200 ms p75 desktop and <= 350 ms p75 mobile for forms/nav/video/swiper triggers, with keyboard and no-IO fallback coverage |
| REQ-011 | Keep docs synchronized across spec artifacts | Cross-doc audit shows no contradictions on matrix IDs, deliverables, or rollout rules; all references point to CM/T/CHK/ADR IDs |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All Level 3 planning docs pass validation and contain zero unresolved placeholder/sample markers.
- **SC-002**: Canonical matrix CM-001..CM-011 is complete and referenced by plan/tasks/checklist without conflicts.
- **SC-003**: Verification protocol defines measurable targets and methods: Lighthouse mobile TBT median >= 20% improvement on target pages, INP non-regression within 10 ms, and first-use trigger latency thresholds from REQ-010.
- **SC-004**: `sk-code--web` first increment is unambiguous and complete: routing signal updates + `interaction_gated_loading` + `interaction_gate_patterns.js` + `performance_loading_checklist`.
- **SC-005**: Rollout policy specifies canary scope, hard halt conditions, rollback toggle path, and service-worker version transition rules with explicit verification steps.
<!-- /ANCHOR:success-criteria -->

---

## 5.1 ACCEPTANCE SCENARIOS

- **AS-001** **Given** a no-interaction session on `contact`/`werken_bij`, **when** session ends, **then** CM-001/CM-002 modules remain uninitialized in >= 95% of sampled sessions.
- **AS-002** **Given** first pointer or keyboard trigger, **when** a gated feature is needed, **then** initialization completes within REQ-010 latency thresholds and with 0 blocking errors.
- **AS-003** **Given** viewport entry for CM-004/CM-005/CM-006, **when** visibility threshold is crossed, **then** init runs exactly once per module instance.
- **AS-004** **Given** idle-gated fallback paths, **when** idle callback is unavailable, **then** timeout fallback executes and does not add startup long tasks > 50 ms before first interaction.
- **AS-005** **Given** CM-008..CM-010 critical flows, **when** page loads, **then** startup sequencing remains unchanged versus baseline traces.
- **AS-006** **Given** an existing service-worker cache, **when** new gate policy deploys, **then** old and new cache namespaces do not mix and rollback can restore legacy policy in <= 30 minutes.
- **AS-007** **Given** 10 mixed PERFORMANCE prompts containing interaction/defer/TBT/INP terms, **when** skill routing runs, **then** correct intent/resource loading occurs in >= 9/10 cases.

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Motion readiness order in global bootstrap | Deferred nav/animation may fail to initialize if ordering is wrong | Keep Motion-ready guards and phased rollout with instrumentation |
| Dependency | Service worker cache strategy | Stale assets can invalidate gating assumptions | Versioned assets + cache invalidation checklist + runtime verification |
| Dependency | External skill maintainership | Skill updates may lag website implementation needs | Isolate minimal required routing/doc changes and submit as discrete workstream |
| Risk | Over-deferral harms first-use UX | Interaction-gated features may feel delayed | Gate by intent and add warm-up on viewport/idle where beneficial |
| Risk | Under-deferral gives little performance gain | Metrics may not improve enough | Prioritize high-cost targets first (forms, Lenis, Swiper) and re-measure |
| Risk | Accessibility regressions | Keyboard-only or reduced-motion users may miss enhancements | Accessibility-first fallback path and keyboard-trigger coverage |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Above-the-fold/LCP-critical behavior remains unchanged by deferred strategy (no LCP regression > 100 ms median on target pages).
- **NFR-P02**: Deferred candidates reduce startup main-thread pressure with Lighthouse mobile TBT median improvement >= 20% for `home`, `contact`, and `werken_bij`.
- **NFR-P03**: Interaction-gated first-use latency remains <= 200 ms p75 desktop and <= 350 ms p75 mobile.

### Security
- **NFR-S01**: Deferral changes must not weaken existing form bot protections or validation ordering.
- **NFR-S02**: Service worker updates must avoid cache poisoning from stale path assumptions through strict versioning and cache key discipline.

### Reliability
- **NFR-R01**: If a gate trigger never fires (no interaction/visibility), baseline page functionality still works.
- **NFR-R02**: Gate orchestration must fail open for non-critical enhancements and fail safe for critical flows.

### Maintainability
- **NFR-M01**: Gate policy must be centralized and documented to prevent per-page divergence.
- **NFR-M02**: External skill updates must provide reusable patterns and checklist guidance for repeatability.

---

## 8. EDGE CASES

### Data Boundaries
- User never interacts with target modules on a session: scripts should not initialize unnecessarily.
- User interacts immediately during page parse: gate must avoid double-init/race conditions.

### Error Scenarios
- `requestIdleCallback` unavailable: timeout fallback must preserve behavior.
- IntersectionObserver unavailable or blocked: fallback to interaction or immediate non-critical init as configured.
- Motion not ready when nav scripts activate: guard and retry without infinite loops.
- Service worker serves outdated bundle map: version guard and explicit invalidation path.

### UX/Accessibility Scenarios
- Keyboard-first user opens menu without pointer events.
- Reduced-motion users bypass animation-heavy paths.
- Touch-only device triggers first interaction earlier than hover-based assumptions.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 21/25 | Cross-page HTML + multiple JS modules + external skill updates |
| Risk | 18/25 | Performance, UX regression, cache correctness, integration order |
| Research | 15/20 | Existing findings available, but requires taxonomy and architecture formalization |
| Multi-Agent | 4/15 | Single planning stream; no nested agent dispatch |
| Coordination | 14/15 | Two repositories/scopes plus phased rollout dependencies |
| **Total** | **72/100** | **Level 3 Confirmed** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Gate misclassification defers critical code | High | Medium | ADR taxonomy + mandatory exclusion list + review checklist |
| R-002 | Shared bootstrap introduces initialization races | High | Medium | Idempotent init guards + event ordering tests |
| R-003 | Service worker stale cache causes mixed behavior | High | Medium | Versioned cache keys + activation-time cleanup + smoke checks |
| R-004 | Interaction gating worsens UX for instant-use components | Medium | Medium | Hybrid strategy: viewport prewarm + interaction finalization |
| R-005 | Skill routing changes still miss performance intent | Medium | Medium | Add new keywords + tests/examples in docs |
| R-006 | Deferred script ordering breaks forms | High | Low | Keep current lazy Botpoison flow and add regression tests |
| R-007 | Lighthouse improvements not realized | Medium | Medium | Baseline/after measurements and reprioritize targets by impact |

---

## 11. USER STORIES

### US-001: Faster Initial Responsiveness (Priority: P0)

**As a** site visitor, **I want** non-critical scripts to wait until needed, **so that** pages become interactive sooner.

**Acceptance Criteria**:
1. Given a first visit on contact/werken_bij/home, when page loads, then non-critical integrations do not initialize eagerly.
2. Given user intent (interaction/visibility), when feature is needed, then initialization occurs without broken behavior.

---

### US-002: Safe Deferred Forms Experience (Priority: P0)

**As a** user submitting a form, **I want** bot protection and upload features to initialize when relevant, **so that** security and reliability remain intact while reducing startup cost.

**Acceptance Criteria**:
1. Given user focuses or interacts with form region, when scripts load, then submission and upload flows work as before.
2. Given no form interaction, when page session ends, then form-heavy scripts were not unnecessarily initialized.

---

### US-003: Maintainable Loading Architecture (Priority: P1)

**As a** developer, **I want** a shared gate bootstrap, **so that** I can avoid scattered page-specific loading hacks.

**Acceptance Criteria**:
1. Given a new candidate script, when integrating, then it uses centralized gate policies.
2. Given maintenance work, when reviewing startup paths, then gate reasons are discoverable in one place.

---

### US-004: Better Skill Guidance for Performance Work (Priority: P1)

**As a** maintainer using `sk-code--web`, **I want** PERFORMANCE routing to include interaction-gated loading docs, **so that** recommendations match real optimization tasks.

**Acceptance Criteria**:
1. Given prompts containing defer/interaction/Lighthouse/TBT/INP terms, when routing runs, then PERFORMANCE intent is correctly prioritized.
2. Given performance work, when resources load, then interaction-gated reference material is included.

---

## 12. RESOLVED EXECUTION DECISIONS

- **D-001 (Lenis trigger policy)**: Lenis uses CM-003 interaction trigger set (`wheel`, `touchmove`, scroll-intent `keydown`) with idle fallback at 2500 ms.
- **D-002 (Swiper trigger policy)**: Marquee and timeline use CM-004/CM-005 viewport-first triggers with explicit interaction fallbacks; no eager init for these modules.
- **D-003 (Video policy)**: HLS background/hover follows two-step CM-006 policy (metadata on viewport, full player on interaction).
- **D-004 (Skill deliverables contract)**: First increment must ship both `interaction_gate_patterns.js` and `performance_loading_checklist`, plus `interaction_gated_loading` reference.
- **D-005 (Rollout + cache policy)**: Use defined canary progression and rollback path from `plan.md` section 7, including service-worker policy-version transitions.

## 13. CONCRETE BLOCKERS

| Blocker ID | Description | Owner | Impact |
|------------|-------------|-------|--------|
| BLK-001 | External merge approval for `sk-code--web` router/docs/assets | `sk-code--web` maintainers | Website implementation can proceed, but REQ-006/REQ-007 closure and checklist CHK-040..CHK-043 remain blocked until merge approval |
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---
