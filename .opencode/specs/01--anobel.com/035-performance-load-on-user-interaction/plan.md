---
title: "Implementation Plan: Performance Loading on User Interaction - anobel.com"
description: "Phased Level 3 plan to implement interaction/viewport/idle-gated loading across high-impact website modules and update sk-code--web routing and references for repeatable performance work."
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
trigger_phrases:
  - "implementation"
  - "plan"
  - "interaction gating"
  - "deferred loading"
  - "lighthouse"
  - "tbt"
  - "inp"
  - "035"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Performance Loading on User Interaction - anobel.com

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | HTML5, CSS, JavaScript (ES modules) |
| **Framework** | Webflow-hosted pages + custom JS modules |
| **Integrations** | Motion.dev, Lenis, Swiper, HLS/video modules, Botpoison |
| **Caching** | Service worker precache/runtime cache in custom JS |
| **Documentation Target** | External skill `sk-code--web` routing + references |
| **Testing** | Lighthouse, PageSpeed Insights, browser profiling, manual UX regression testing |

### Overview
This plan executes a controlled migration from eager startup toward intent-driven loading using four gate types: eager, interaction, viewport, and idle. The first implementation wave targets forms, Lenis, Swiper, and selected video/navigation paths while preserving explicitly non-deferrable hero/LCP and cookie-consent flows.

The second scope upgrades `sk-code--web` so this strategy becomes easier to discover and apply: improved PERFORMANCE term recognition, expanded resource mapping, and dedicated interaction-gated references/patterns/checklists.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Planning scope documented for website and external skill.
- [x] High-value candidates and non-candidates identified from verified findings.
- [x] Taxonomy and architectural decisions drafted in `decision-record.md`.
- [ ] Baseline Lighthouse/PageSpeed snapshots captured for target pages.
- [ ] Service worker cache behavior baseline captured for deferred candidates.

### Definition of Done
- [ ] All P0 requirements (REQ-001..REQ-007) implemented and verified.
- [ ] All P1 requirements complete or explicitly deferred with approval.
- [ ] Contact/werken_bij/home target journeys pass regression checks with 0 P0 defects.
- [ ] No regressions in hero/LCP critical flow or cookie consent sequence.
- [ ] Lighthouse mobile TBT median improves >= 20% on `home`, `contact`, and `werken_bij`; INP non-regression within 10 ms.
- [ ] External `sk-code--web` updates merged with routing and all first-increment artifacts verified (`interaction_gated_loading`, `interaction_gate_patterns.js`, `performance_loading_checklist`).
<!-- /ANCHOR:quality-gates -->

---

## 2.1 AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm candidate gate class before writing code.
- Confirm exclusion list impact (hero/LCP/cookie consent) before migration.
- Confirm evidence to collect for each completed task.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Scope lock | Only migrate candidates listed in this plan |
| Bootstrap-first | No new module migration before shared gate runtime is available |
| Evidence-first | Do not mark tasks complete without measurement or regression evidence |
| Safe rollout | Prioritize reversible changes and keep fallback behavior |

### Status Reporting Format
- `STATUS: [phase/task]`
- `GATE_CLASS: [eager|interaction|viewport|idle]`
- `EVIDENCE: [metric/test/log reference]`
- `RESULT: [pass|fail|blocked]`
- `NEXT: [next task]`

### Blocked Task Protocol
1. Mark task as blocked with explicit dependency and owner.
2. Record risk and rollback impact.
3. Continue independent parallel tasks that do not violate sequencing.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Centralized gate orchestration with feature-specific adapters.

### Key Components
- **Gate Policy Matrix**: Declares each candidate as `eager`, `interaction`, `viewport`, or `idle` with rationale.
- **Gate Runtime Bootstrap**: Shared utility for trigger registration, idempotent init, and fallback behavior.
- **Feature Adapters**: Module-level integration for forms, Lenis, Swiper, video, and navigation scripts.
- **Exclusion Guard**: Explicit list of flows that remain eager (hero/LCP and cookie consent timing).
- **Service Worker Sync Layer**: Ensures cache keys, precache lists, and runtime caching align with deferred paths.
- **Skill Router Layer**: `sk-code--web` PERFORMANCE intent expansion and doc loading updates.

### Data Flow
1. HTML loads with only truly critical scripts eager.
2. Gate runtime registers triggers at startup (pointer/key/scroll/visibility/idle).
3. Candidate modules initialize when their assigned gate fires.
4. Init completion marks module state to prevent double-init.
5. Service worker/cache logic resolves versioned resources consistently.
6. Skill routing changes load performance docs matched to defer/interaction/Lighthouse/TBT/INP prompts.
<!-- /ANCHOR:architecture -->

---

## 3.1 CANONICAL CANDIDATE MATRIX (AUTHORITATIVE)

This table is authoritative for implementation sequencing and verification. Task IDs reference Matrix IDs directly.

| Matrix ID | Module/Page | Gate Type | Exact Trigger | Fallback | Exclusion Reason | Expected Benefit | Verification Method |
|-----------|-------------|-----------|---------------|----------|------------------|------------------|---------------------|
| CM-001 | Contact form stack (`contact.html`, `form_submission.js`, `input_upload.js`) | interaction | First `focusin` in form OR `pointerdown` on form region | Force init on submit attempt; idle warm-up at 3000 ms | Not startup-critical | TBT delta >= 80 ms on `contact` | Pre-trigger no-init trace + submit/upload regression |
| CM-002 | Vacatures form stack (`werken_bij.html`, form modules) | interaction | First `focusin` OR form CTA click | Same as CM-001 | Not startup-critical | TBT delta >= 80 ms on `werken_bij` | Pre-trigger no-init trace + submit/upload regression |
| CM-003 | Lenis desktop (`global.html`) | interaction | `wheel`, `touchmove`, or scroll-intent `keydown` | Idle fallback at 2500 ms | Skip when reduced-motion preference is active | Startup TBT delta >= 40 ms on target pages | Lenis init instrumentation + scroll UX checks |
| CM-004 | Swiper marquee brands (`marquee_brands.js`) | viewport | 20% visibility with IO rootMargin `200px 0px` | First section interaction; hard timeout at 3500 ms | Non-critical decorative module | Reduce off-screen startup work by >= 30 ms long tasks | IO + interaction trigger tests, one-time init assertion |
| CM-005 | Swiper timeline (`timeline.js`) | viewport | 30% visibility OR timeline-control interaction | Interaction fallback if IO unavailable | Not required for initial render | Reduce initial long-task footprint by >= 30 ms | Visibility + control-trigger tests, no double-init |
| CM-006 | HLS video (`video_background_hls.js`, `video_background_hls_hover.js`) | viewport+interaction | Viewport 25% loads metadata; interaction starts full player | Metadata on interaction when IO unavailable | Enhancement behavior, not core content | Reduce media startup cost without UX loss | Media event logs + keyboard/touch flow tests |
| CM-007 | Navigation enhancements (`nav_mobile_menu.js`, `nav_dropdown.js`, `nav_language_selector.js`) | interaction | First nav intent (`click`, `focusin`, `Enter`, `Space`) after Motion-ready | Minimal handlers at 1500 ms if Motion-ready delayed | Baseline nav must work without enhancements | Startup reduction >= 20 ms and no a11y regressions | Keyboard/touch smoke + Motion-ordering trace |
| CM-008 | Home hero video (`home.html`, `hero_video.js`) | eager (excluded) | Startup | None | LCP-critical | Preserve LCP stability | LCP parity vs baseline |
| CM-009 | Nobel location hero (`n3_de_locatie.html`, `hero_video.js`) | eager (excluded) | Startup | None | LCP-critical | Preserve startup visual sequence | LCP + start-order parity |
| CM-010 | Cookie consent (`modal_cookie_consent.js`) | eager (excluded) | Startup | None | Compliance-critical sequence | Preserve legal/compliance ordering | Consent flow smoke tests |
| CM-011 | Service worker policy (`service_worker.js`) | eager activation policy | `install`/`activate` with policy-version check | Rollback toggle `GATE_ROLLOUT_MODE='legacy-eager'` + cache cleanup | Must remain deterministic | Avoid mixed cache policy behavior | SW lifecycle + rollback drill |

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline and Taxonomy Lock
- [ ] Capture baseline Lighthouse/PageSpeed and browser performance traces for `home`, `contact`, and `werken_bij`.
- [ ] Publish and freeze canonical matrix CM-001..CM-011 (gate type + exact trigger + fallback + verification).
- [ ] Confirm non-deferrable list and hard guard rules.

### Phase 2: Shared Gate Bootstrap
- [ ] Implement shared gate runtime API with interaction, viewport, idle, and fallback handling.
- [ ] Add idempotent initialization wrappers for module adapters.
- [ ] Integrate gate bootstrap into global loading path.

### Phase 3: Website Candidate Migration
- [ ] Migrate CM-001 and CM-002 forms stack activation to interaction gates.
- [ ] Apply CM-003 Lenis interaction policy (no alternative trigger policy in this increment).
- [ ] Apply CM-004 and CM-005 Swiper viewport-first policies with defined fallbacks.
- [ ] Apply CM-006 two-step HLS/video policy.
- [ ] Apply CM-007 navigation interaction policy while preserving Motion-ready ordering.

### Phase 4: Cache and Reliability Hardening
- [ ] Update service worker precache/runtime policy for deferred assets.
- [ ] Add cache invalidation/version verification checks.
- [ ] Run failure-path tests (no interaction, no intersection, no idle callback).

### Phase 5: External Skill Enhancements (`sk-code--web`)
- [ ] Extend routing keywords and performance intent signals for interaction-gated terminology.
- [ ] Expand `RESOURCE_MAP["PERFORMANCE"]` to include relevant performance references.
- [ ] Add `interaction_gated_loading` reference document in `references/performance`.
- [ ] Add supporting `interaction_gate_patterns.js` and `performance_loading_checklist` assets (both required in first increment).

### Phase 6: Verification, Rollout, and Documentation Sync
- [ ] Re-run Lighthouse/PageSpeed and compare against baseline.
- [ ] Validate UX integrity for target flows across device classes.
- [ ] Update spec artifacts, checklist evidence, and rollout notes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Baseline Metrics | Current startup and interaction performance | Lighthouse CLI, PageSpeed Insights |
| Gate Behavior | Trigger correctness and idempotent init | DevTools, manual event simulation |
| Regression | Forms, uploads, Swiper, nav interactions, video behavior | Manual scenario tests on desktop/mobile |
| Caching | Service worker cache freshness and version transitions | DevTools Application tab, forced update flows |
| Skill Routing | Prompt-intent mapping and resource load correctness | Skill routing dry-run/examples |

### Verification Focus
- Use before/after metrics per target page and annotate each migration with expected impact and measured delta.
- Enforce thresholds: Lighthouse mobile TBT median >= 20% improvement, INP non-regression within 10 ms.
- Enforce first-use latency thresholds: <= 200 ms p75 desktop, <= 350 ms p75 mobile.
- Verify non-deferrable flows (CM-008..CM-010) are unchanged.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Access to target page templates/scripts | Internal | Green | Candidate migration blocked |
| Motion/Lenis/Swiper integration stability | Internal | Yellow | Deferred startup could regress interactions |
| Service worker ownership and deployment path | Internal | Yellow | Cache consistency fixes delayed |
| External skill repository write access | External | Yellow | Skill updates cannot ship with website strategy |
| Lighthouse/PageSpeed measurement environment | External | Green | Quantitative validation delayed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLOUT, HALT, AND ROLLBACK STRATEGY

### Canary Scope
- **Canary C1 (10%)**: `contact` and `werken_bij` only, CM-001/CM-002/CM-003 enabled.
- **Canary C2 (50%)**: Add `home` CM-004/CM-007 after C1 passes for 24 hours.
- **General Availability (100%)**: Enable CM-004..CM-007 globally after C2 passes for 24 hours and SW checks pass.

### Halt Conditions (Immediate Freeze)
- Any P0 functional regression in forms, navigation baseline, consent flow, or hero/LCP sequencing.
- Lighthouse mobile TBT regression > 5% on any target page versus baseline for two consecutive runs.
- INP regression > 20 ms median on any target page for two consecutive runs.
- Service worker mixed-policy detection (old and new policy-version caches active in same session).

### Rollback Toggle Path
1. Set `GATE_ROLLOUT_MODE='legacy-eager'` in bootstrap config in `src/0_html/global.html`.
2. Rebuild/redeploy static assets.
3. Force service-worker transition by bumping policy-version constant in `src/2_javascript/global/service_worker.js` and running activation cleanup.
4. Re-run smoke tests on `home`, `contact`, and `werken_bij`.
5. Confirm rollback completion within 30 minutes from halt declaration.

### Service-Worker Version Transition Rules
- Maintain exactly one active deferred-policy cache namespace per policy version.
- During `activate`, remove all cache namespaces not matching current policy version.
- Never serve mixed old/new policy manifests in one session.
- Require one successful SW lifecycle test before canary promotion (C1 -> C2 and C2 -> GA).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Baseline/Taxonomy) -> Phase 2 (Shared Bootstrap) -> Phase 3 (Candidate Migration)
                                        |                                  |
                                        +-----------> Phase 5 (Skill) ----+
                                                       |
Phase 4 (Cache/Reliability) <--------------------------+
                    |
                    v
            Phase 6 (Verify/Rollout)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Baseline/Taxonomy | None | 2, 3, 4, 6 |
| 2 Shared Bootstrap | 1 | 3, 4 |
| 3 Candidate Migration | 2 | 6 |
| 4 Cache/Reliability | 2 and partial 3 | 6 |
| 5 Skill Enhancements | 1 (concept lock) | 6 documentation completeness |
| 6 Verify/Rollout | 3, 4, 5 | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 1 Baseline/Taxonomy | Medium | 3-5 hours |
| 2 Shared Bootstrap | High | 6-10 hours |
| 3 Candidate Migration | High | 8-14 hours |
| 4 Cache/Reliability | Medium | 4-8 hours |
| 5 Skill Enhancements | Medium | 4-7 hours |
| 6 Verify/Rollout | Medium | 4-6 hours |
| **Total** | | **29-50 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Capture current production script map and cache keys.
- [ ] Snapshot baseline Lighthouse/PageSpeed values.
- [ ] Confirm module-level rollback toggles/revert paths.

### Rollback Procedure
1. Revert gate policy for failing module class to eager mode.
2. Revert affected module adapter changes.
3. Invalidate service worker caches and reload known-good bundle versions.
4. Re-run smoke tests for forms/nav/video/slider behavior.
5. Document incident and rule adjustment before reattempt.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Not applicable for static assets and runtime behavior changes.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────────────┐
│ P1 Baseline + Taxonomy  │
└────────────┬────────────┘
             │
      ┌──────▼──────┐
      │ P2 Bootstrap │
      └───┬──────┬───┘
          │      │
┌─────────▼───┐  │   ┌──────────────────────┐
│ P3 Website  │  │   │ P5 External Skill    │
│ Migration   │  │   │ Routing + References │
└──────┬──────┘  │   └──────────┬───────────┘
       │         │              │
       └────┬────┘      ┌───────▼────────┐
            ▼           │ P4 Cache/Rel   │
      ┌──────────────┐  └───────┬────────┘
      │ P6 Verify +  │<---------┘
      │ Rollout      │
      └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Taxonomy lock | Verified findings | Canonical gate policy | Bootstrap, skill updates |
| Bootstrap runtime | Taxonomy lock | Shared gate API | Candidate migrations |
| Website migrations | Bootstrap runtime | Deferred module activation | Final verification |
| Cache hardening | Bootstrap + migration deltas | Stable deferred cache behavior | Final verification |
| Skill updates | Taxonomy lock | Better router/doc support | Documentation completion |
| Final verification | Migrations + cache + skill updates | Completion evidence | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Taxonomy lock and exclusion policy** - Critical.
2. **Shared bootstrap implementation** - Critical.
3. **Forms + Lenis migration (highest impact)** - Critical.
4. **Service worker alignment and stale-cache verification** - Critical.
5. **Lighthouse/PageSpeed validation and regression pass** - Critical.

**Total Critical Path**: 5 major gates, estimated 20-34 hours.

**Parallel Opportunities**:
- Swiper and selected navigation migrations can run in parallel after bootstrap readiness.
- External skill updates can run in parallel with website migration after taxonomy lock.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Taxonomy finalized | Candidate matrix approved, exclusions explicit | End Phase 1 |
| M2 | Shared bootstrap ready | Central gate API integrated in global startup | End Phase 2 |
| M3 | High-impact migrations complete | Forms + Lenis + key Swiper paths gated safely | Mid Phase 3 |
| M4 | Cache model hardened | Service worker consistency checks pass | End Phase 4 |
| M5 | Skill updated | PERFORMANCE routing/docs include interaction-gated strategy | End Phase 5 |
| M6 | Verification complete | Metrics/regression evidence supports rollout decision | End Phase 6 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Loading Strategy Taxonomy

**Status**: Accepted (planning baseline)

**Context**: Without a shared taxonomy, deferral choices become inconsistent and fragile.

**Decision**: Standardize on four gate classes: eager, interaction, viewport, idle.

**Consequences**:
- Positive: Consistent classification and safer reviews.
- Negative: Upfront categorization effort before implementation.

**Alternatives Rejected**:
- Binary eager/deferred model: rejected as too coarse for nuanced UX/performance trade-offs.

### ADR-002: Shared Bootstrap over Per-Page Logic

**Status**: Accepted (planning baseline)

**Context**: Existing lazy logic exists but is fragmented, increasing drift risk.

**Decision**: Use one shared gate runtime with module adapters and idempotent initialization.

**Consequences**:
- Positive: Better maintainability and lower race-condition risk.
- Negative: Requires initial refactor before broad candidate migration.

### ADR-003: Expand `sk-code--web` PERFORMANCE Routing

**Status**: Accepted (planning baseline)

**Context**: Current router under-loads the most relevant performance docs for interaction-gated loading tasks.

**Decision**: Expand intent signals, PERFORMANCE resource map, and add dedicated interaction-gated reference plus both first-increment assets (`interaction_gate_patterns.js` and `performance_loading_checklist`).

**Consequences**:
- Positive: Better guidance quality and repeatability for future work.
- Negative: Requires synchronized skill maintenance outside site code.

---
