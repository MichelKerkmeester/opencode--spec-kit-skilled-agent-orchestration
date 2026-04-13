---
title: "Phrase intent boosting"
description: "Describes the multi-token phrase boosts that sharpen routing for high-signal requests."
---

# Phrase intent boosting

## 1. OVERVIEW

Describes the multi-token phrase boosts that sharpen routing for high-signal requests.

Single words are not always specific enough. The advisor keeps a second layer of phrase-aware intent logic so requests such as `review this pr` or `responsive css layout fix` land on the right skill without needing a perfect bag-of-words match.

---

## 2. CURRENT REALITY

`PHRASE_INTENT_BOOSTERS` maps exact lowercase substrings to one or more skill boosts. The table contains highly targeted patterns across review, deep research, prompt improvement, semantic search, CLI delegation, and web implementation. During `analyze_request()`, each matching phrase appends a `!{phrase}(phrase)` reason and adds its configured weight directly into `skill_boosts`, which means phrase evidence stacks with token boosters, semantic hits, and graph overlays.

The advisor also has an earlier phrase-aware layer in `INTENT_NORMALIZATION_RULES`. That pass groups families of phrases such as `create documentation`, `save context`, `quality gate`, and `code mode` under lightweight canonical intents before the larger phrase table runs. Together these two stages give the router both broad intent normalization and high-precision phrase routing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `skill_advisor.py` | Runtime | Defines `PHRASE_INTENT_BOOSTERS` for exact multi-token routing boosts. |
| `skill_advisor.py` | Runtime | Defines `INTENT_NORMALIZATION_RULES` and applies both phrase-aware passes before final ranking. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `skill_advisor_regression.py` | Regression harness | Exercises phrase-driven prompts and checks that the top result remains the intended skill. |
| `fixtures/skill_advisor_regression_cases.jsonl` | Regression dataset | Stores multi-token routing prompts such as git, review, spec, and semantic-search cases. |

---

## 4. SOURCE METADATA

- Group: Routing pipeline
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `01--routing-pipeline/04-phrase-intent-boosting.md`
