---
title: Router Reference — Intent Classification
description: TASK_SIGNALS scoring and intent selection logic for the sk-code smart router.
keywords: [routing, intent, classification, task-signals, sk-code]
---

# Router Reference — Intent Classification

Intent classification runs AFTER stack detection. The merged TASK_SIGNALS combines high-resolution web signals with TESTING/DATABASE/API additions.

> Authoritative source: `SKILL.md §2 — SMART ROUTING`. This doc is a deep-reference extract.

---

## Intent Categories (12 total)

| Category | Source | Strongest signals |
|---|---|---|
| VERIFICATION | web | `verify` (2.4), `done` (2.1), `complete` (2.0) |
| DEBUGGING | web | `error` (2.4), `bug` (2.3), `fix` (2.0), `console error` (2.4) |
| CODE_QUALITY | web | `style check` (2.2), `quality check` (2.2) |
| IMPLEMENTATION | web | `implement` (2.0), `build` (1.7), `create` (1.5) |
| ANIMATION | web | `gsap` (2.3), `animation` (2.1), `lenis` (2.1), `swiper` (2.1) |
| FORMS | web | `form` (2.0), `validation` (1.7), `filepond` (2.1) |
| VIDEO | web | `hls` (2.4), `streaming` (2.1), `video` (2.0) |
| DEPLOYMENT | web + full-stack | `deploy` (2.2), `minify` (2.1), `cdn` (2.0), `docker` (1.8), `kubernetes` (1.8) |
| PERFORMANCE | web | `core web vitals` (2.4), `tbt` (2.4), `inp` (2.4), `lighthouse` (2.2) |
| TESTING | full-stack | `test` (2.0), `go test` (2.0), `swift test` (2.0), `xctest` (1.8) |
| DATABASE | full-stack | `database` (2.0), `migration` (1.7), `gorm` (1.6), `prisma` (1.6) |
| API | full-stack | `api` (2.0), `endpoint` (1.7), `express` (1.6), `fiber` (1.6) |

See `SKILL.md §2 — TASK_SIGNALS` for the full keyword/weight tables.

## Scoring Algorithm

1. For each intent, sum weights of every keyword found in the task text
2. Add NOISY_SYNONYMS bonuses (lower-precision matches)
3. Apply phase boosts (verification: +5; debugging: +5; testing: +4)
4. Rank by score
5. Select top-N intents using AMBIGUITY_DELTA (default 0.8) — multi-symptom prompts get N=3, single-symptom N=2

## Multi-Intent Selection

When the second-highest score is within `ambiguity_delta` of the top, multiple intents fire simultaneously. Useful for prompts like "fix Webflow animation flicker" which surfaces both DEBUGGING and ANIMATION.

```python
selected = [ranked[0][0]]  # top intent always selected
for intent, score in ranked[1:]:
    if (top_score - score) <= ambiguity_delta:
        selected.append(intent)
    if len(selected) >= max_intents:
        break
```

## Special Cases

- **Low-signal task** (sum of all scores < 0.5): returns IMPLEMENTATION + UNKNOWN_FALLBACK_CHECKLIST surface for disambiguation
- **Multi-symptom term hit ≥3** (e.g. "janky stutter freeze"): expands max_intents from 2 to 3
- **Explicit phase signal** (task.phase == "verification"): adds +5 to that intent before ranking

## See Also

- `references/router/stack_detection.md` — what runs before intent classification
- `references/router/resource_loading.md` — how intents drive resource selection
- `references/router/phase_lifecycle.md` — how intents map to phases (Implementation / Quality Gate / Debug / Verify)
- `SKILL.md §2` — full routing pseudocode
