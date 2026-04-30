---
title: Interaction-Gated Loading
description: Practical guidance for deferring non-critical script loading to first interaction, viewport entry, or idle time without hurting responsiveness.
---

# Interaction-Gated Loading

Practical guidance for deferring non-critical script loading to first interaction, viewport entry, or idle time without hurting responsiveness.

---

## 1. OVERVIEW

Use interaction-gated loading when startup JavaScript is expensive but the feature is not required for first paint, LCP, or compliance.

### Primary Goals

- Reduce early main-thread work and Lighthouse/PageSpeed TBT.
- Keep first-use latency low enough that INP does not regress.
- Avoid loading feature code in sessions where the feature is never used.

---

## 2. GATE SELECTION

| Gate | Use For | Trigger | Fallback |
|------|---------|---------|----------|
| `interaction` | Forms, nav enhancements, chat, user-driven widgets | First `pointerdown`, `focusin`, or keyboard intent | Idle fallback after 2000-3000ms |
| `viewport` | Sliders, videos, below-fold media, decorative modules | `IntersectionObserver` threshold + root margin | First relevant interaction or timeout |
| `idle` | Warm-up work, analytics, low-priority hydration | `requestIdleCallback` | `setTimeout` fallback |
| `eager` | Hero/LCP-critical UI, consent, blocking state setup | Immediate | None |

**Rule:** Prefer the latest safe trigger. If a feature is only needed after intent is clear, do not initialize it on page load.

---

## 3. NON-DEFERRABLE EXCLUSIONS

Do not gate these behind interaction, viewport, or idle triggers:

- LCP-critical hero media, reveal logic, or page-ready safety paths.
- Cookie consent or compliance sequencing.
- Code required before the user's first possible submit/open action.
- Baseline accessibility behavior that must exist before enhancements load.

If deferral changes whether the page can paint, reveal, submit, or collect consent correctly, keep it eager.

---

## 4. IMPLEMENTATION PATTERN

Use one idempotent init path and let multiple gates point to it.

```javascript
const init_feature_once = with_idempotent_init(async () => {
  await load_script_once('https://cdn.example.com/feature.js');
  return window.Feature.init();
});

create_first_interaction_trigger({ on_trigger: init_feature_once });
schedule_idle_fallback(init_feature_once, { timeout: 2500 });
```

### Practical Rules

- Load the script once, even if multiple gates fire.
- Wrap init in an idempotent guard to prevent double-starts.
- Pair interaction/viewport triggers with an idle fallback when warm-up helps.
- Log trigger source during rollout so traces show why code loaded.

See `../../assets/patterns/interaction_gate_patterns.js` for reusable helpers.

---

## 5. MEASUREMENT

Measure before and after each gating change:

1. Run Lighthouse mobile 3x in Incognito and use the median.
2. Compare TBT and long-task count before first interaction.
3. Check first-use latency for the gated feature.
4. Confirm INP does not regress on the interaction path.

**Good outcome:** lower startup work, unchanged critical-path UX, and no noticeable delay on first use.

---

## 6. ANTI-PATTERNS

- Deferring hero or consent code to chase a better Lighthouse score.
- Using hover-only triggers for features that must also work on touch and keyboard.
- Loading the same script more than once from multiple triggers.
- Adding viewport gating without a fallback for browsers that lack `IntersectionObserver`.
- Claiming a performance win without TBT/INP evidence.

---

## 7. RELATED RESOURCES

- [cwv_remediation.md](./cwv_remediation.md) - Metric-specific fixes for Lighthouse/PageSpeed issues
- [resource_loading.md](./resource_loading.md) - Preconnect, preload, async, and dynamic loading patterns
- [third_party.md](./third_party.md) - Deferral guidance for non-critical external scripts
- [../../assets/checklists/performance_loading_checklist.md](../../assets/checklists/performance_loading_checklist.md) - Verification checklist for gated loading rollouts
