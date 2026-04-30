---
title: Router Reference — Intent Classification
description: Weighted intent scoring (TASK_SIGNALS) and ambiguity handling that selects the top-N intents fired by the smart router after stack detection.
---

# Router Reference — Intent Classification

TASK_SIGNALS scoring, multi-intent selection, and special-case handling that runs AFTER stack detection and BEFORE per-stack resource loading.

---

## 1. OVERVIEW

### Purpose

Documents how the smart router's `score_intents()` and `select_intents()` functions translate raw task text into a ranked list of routable intents (IMPLEMENTATION, DEBUGGING, VERIFICATION, ANIMATION, FORMS, API, DATABASE, DEPLOYMENT, TESTING, PERFORMANCE, VIDEO, CODE_QUALITY). Operators consult this file when an advisor result loaded the wrong intent map and they need to debug why.

### Core Principle

Weighted keyword matching plus an ambiguity-delta lets multi-symptom prompts (for example, "fix Webflow animation flicker" — both DEBUGGING and ANIMATION) fire multiple intents in a single dispatch, while clear single-symptom prompts route to exactly one.

### When to Use

- An advisor result loaded the wrong intent map and you need to debug the scoring.
- A multi-symptom prompt should have fired two intents but only one came through (or vice versa).
- You are tuning `INTENT_SIGNALS` weights and want to see the canonical signal table.
- You are writing a regression test for a new intent category.

### Key Sources

- Authoritative pseudocode: `SKILL.md` §2 SMART ROUTING (`INTENT_SIGNALS`, `score_intents`, `select_intents`).
- Per-stack resource maps: `references/router/resource_loading.md`.

---

## 2. INTENT CATEGORIES

| Category        | Strongest signals                                                                |
| --------------- | -------------------------------------------------------------------------------- |
| VERIFICATION    | `verify`, `done`, `complete`, `works`, `fixed`, `passing`, `type-check`, `build` |
| DEBUGGING       | `error`, `bug`, `fix`, `broken`, `console error`, `hydration`, `stack trace`     |
| CODE_QUALITY    | `lint`, `format`, `quality gate`, `p0`, `p1`, `code style`, `naming`             |
| IMPLEMENTATION  | `implement`, `build`, `create`, `add feature`, `service`, `component`, `handler` |
| ANIMATION       | `animation`, `motion`, `transition`, `scroll-trigger`, `lenis`, `gsap`, `motion v12` |
| FORMS           | `form`, `validation`, `react-hook-form`, `zod`, `go-playground/validator`, `filepond` |
| VIDEO           | `hls`, `video`, `streaming`                                                      |
| DEPLOYMENT      | `deploy`, `vercel`, `railway`, `fly.io`, `docker`, `cdn`, `wrangler`             |
| PERFORMANCE     | `lighthouse`, `lcp`, `tbt`, `inp`, `cls`, `core web vitals`, `pagespeed`, `pprof` |
| TESTING         | `test`, `unit test`, `integration test`, `coverage`, `table test`, `race detector` |
| DATABASE        | `postgres`, `sqlc`, `pgx`, `migration`, `transaction`, `query`                   |
| API             | `api`, `fetch`, `endpoint`, `jwt`, `envelope`, `cors`, `cross-stack pairing`     |

See `SKILL.md` §2 (`INTENT_SIGNALS`) for the full keyword/weight tables.

---

## 3. SCORING ALGORITHM

1. For each intent, sum the weight of every keyword that appears in the task text.
2. Add NOISY_SYNONYMS bonuses (lower-precision matches that count for ranking but are weighted lower than first-class keywords).
3. Apply phase boosts: `verification` +5, `debugging` +5, `testing` +4 (when the task explicitly declares its phase).
4. Rank intents by score.
5. Select top-N intents using `ambiguity_delta` (default 1.0) — multi-symptom prompts can expand to N=3 when 3+ multi-symptom terms hit.

---

## 4. MULTI-INTENT SELECTION

When the second-highest score is within `ambiguity_delta` of the top, multiple intents fire simultaneously. Useful for prompts like "fix Webflow animation flicker" which surfaces both DEBUGGING and ANIMATION.

```python
selected = [ranked[0][0]]                       # top intent always selected
for intent, score in ranked[1:]:
    if (top_score - score) <= ambiguity_delta:
        selected.append(intent)
    if len(selected) >= max_intents:
        break
```

---

## 5. SPECIAL CASES

- **Low-signal task** (sum of all scores < 0.5): returns IMPLEMENTATION + UNKNOWN_FALLBACK_CHECKLIST surface for disambiguation.
- **Multi-symptom term hit ≥ 3** (for example, "janky stutter freeze"): expands `max_intents` from 2 to 3.
- **Explicit phase signal** (`task.phase == "verification"`): adds +5 to that intent before ranking.
- **No intent signals matched at all**: returns IMPLEMENTATION as the safe default rather than empty.

---

## 6. RELATED RESOURCES

- `references/router/stack_detection.md` - what runs before intent classification.
- `references/router/resource_loading.md` - how scored intents drive per-stack resource selection.
- `references/router/phase_lifecycle.md` - how intents map to Phase 0-3 lifecycle.
- `SKILL.md` §2 — full smart-routing pseudocode (`INTENT_SIGNALS`, `score_intents`, `select_intents`).
