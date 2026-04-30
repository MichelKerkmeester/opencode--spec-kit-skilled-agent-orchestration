---
title: Performance Loading Checklist - Deferred Loading Verification
description: Measurable checks for interaction-gated and deferred loading changes.
---

# Performance Loading Checklist - Deferred Loading Verification

Use this checklist when deferring non-critical scripts behind interaction, viewport, or idle triggers. It is the release gate for proving startup wins without creating a worse first-use experience.

---

## 1. OVERVIEW

### Purpose

Provide a measurable verification pass for deferred-loading work so Lighthouse, PageSpeed, TBT, INP, and first-use latency stay aligned.

### Usage

- Use this after choosing a gate strategy but before claiming the change is safe.
- Capture baseline and after evidence for every affected page, not just one representative page.
- Stop the rollout if any non-deferrable path, accessibility baseline, or first-use latency check fails.

---

## 2. MEASUREMENT TARGETS

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Lighthouse mobile | Run 3x in Incognito, use median | Lighthouse or PageSpeed |
| TBT | Improve by >= 20% on affected pages, or stay <= 200ms | Lighthouse |
| INP | Do not regress by > 10ms on gated journeys | PageSpeed or interaction trace |
| Long tasks | No new pre-interaction long task > 50ms | DevTools Performance |
| First-use latency | <= 200ms desktop p75, <= 350ms mobile p75 | Instrumented interaction timing |

---

## 3. BASELINE AND AFTER DATA

- [ ] Capture before/after Lighthouse mobile runs for each affected page.
- [ ] Record median TBT for both states.
- [ ] Record INP or equivalent interaction timing for the gated feature path.
- [ ] Save one DevTools trace that shows startup work before first interaction.

---

## 4. GATING RULES

- [ ] Deferred code is non-critical to first paint, first submit, or compliance.
- [ ] Initialization is idempotent and cannot double-run.
- [ ] Script loading is one-time only, even if multiple triggers fire.
- [ ] Interaction and viewport gates have a fallback path (`idle`, timeout, or immediate safe init).
- [ ] Touch, keyboard, and pointer intent are all covered where relevant.

---

## 5. NON-DEFERRABLE EXCLUSIONS

- [ ] Hero/LCP-critical media or reveal logic remains eager.
- [ ] Cookie consent or compliance sequencing remains eager.
- [ ] Accessibility baseline works before enhancement scripts load.
- [ ] Code required for the first possible user action is not gated too late.

If any box cannot be checked, stop and remove the deferral.

---

## 6. VERIFICATION

- [ ] Lighthouse/PageSpeed shows the expected startup improvement.
- [ ] TBT improves without shifting cost into a worse first interaction.
- [ ] INP is flat or better on the triggered journey.
- [ ] No new console or network errors appear when the gate fires.
- [ ] A no-interaction session does not initialize unused modules.
- [ ] First-use interaction still feels immediate on desktop and mobile.

---

## 7. RED FLAGS

- [ ] Not chasing a Lighthouse win by delaying critical UX.
- [ ] Not using hover-only triggers for touch-first features.
- [ ] Not replacing measurement with assumptions.
- [ ] Not adding idle fallback to code that must be available sooner.

---

## 8. RELATED RESOURCES

- [interaction_gated_loading.md](../../references/performance/interaction_gated_loading.md) - Gate selection and exclusions
- [cwv_remediation.md](../../references/performance/cwv_remediation.md) - TBT and Lighthouse remediation patterns
- [interaction_gate_patterns.js](../patterns/interaction_gate_patterns.js) - Reusable trigger helpers
