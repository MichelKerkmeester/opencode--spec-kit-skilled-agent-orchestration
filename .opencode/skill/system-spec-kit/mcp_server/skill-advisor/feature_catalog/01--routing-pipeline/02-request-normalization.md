---
title: "Request normalization"
description: "Describes how the advisor normalizes prompts into tokens, synonyms, and canonical intent signals before scoring."
---

# Request normalization

## 1. OVERVIEW

Describes how the advisor normalizes prompts into tokens, synonyms, and canonical intent signals before scoring.

The advisor does not score raw user text directly. It first reshapes the prompt into a predictable set of lowercase terms and lightweight intent hints so the later scoring passes can compare like with like.

---

## 2. CURRENT REALITY

`analyze_request()` lowercases the prompt, tokenizes it with a regex word split, and keeps the original token list around for intent work that must happen before stop-word filtering. That matters because words such as `how`, `where`, and `review` can be weak corpus terms but strong routing signals. `apply_intent_normalization()` runs first and can inject canonical intent boosts for documentation, memory, review, tooling, and implementation patterns before the lexical scorer starts.

The corpus-facing normalization happens next. `_normalize_terms()` strips short terms and the shared `STOP_WORDS` set, `_build_inline_record()` stores normalized name and description terms on every candidate record, and `expand_query()` widens the surviving prompt tokens through `SYNONYM_MAP`. The result is a search-term set that is broader than the original prompt without losing the direct wording the user actually typed.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `skill_advisor.py` | Runtime | Lowercases and tokenizes prompts, then applies canonical intent normalization before lexical scoring. |
| `skill_advisor.py` | Runtime | Defines stop-word filtering, normalized term extraction, inline record shaping, and synonym expansion. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `skill_advisor_regression.py` | Regression harness | Replays normalized prompt cases through the same `analyze_prompt()` pipeline used in production routing. |
| `fixtures/skill_advisor_regression_cases.jsonl` | Regression dataset | Supplies prompts that depend on stable normalization and canonical intent detection. |

---

## 4. SOURCE METADATA

- Group: Routing pipeline
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `01--routing-pipeline/02-request-normalization.md`
