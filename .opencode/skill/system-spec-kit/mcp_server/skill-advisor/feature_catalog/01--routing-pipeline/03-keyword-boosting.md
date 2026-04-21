---
title: "Keyword boosting"
description: "Describes the token-level score boosts that connect direct prompt evidence to candidate skills."
---

# Keyword boosting

## 1. OVERVIEW

Describes the token-level score boosts that connect direct prompt evidence to candidate skills.

The advisor's baseline scorer is evidence-driven. Instead of treating every token equally, it gives stronger weight to terms that are known to be high-signal for a specific skill or small family of skills.

---

## 2. CURRENT REALITY

The main keyword boost pass lives inside `analyze_request()`. `INTENT_BOOSTERS` applies direct single-skill boosts for high-signal terms such as `worktree`, `checkpoint`, or `figma`, while `MULTI_SKILL_BOOSTERS` spreads smaller boosts across ambiguous terms such as `audit`, `api`, or `delegate`. These token-level boosts happen before the corpus comparison loop, so direct intent evidence can lift a candidate even when the rest of the prompt is sparse.

After the explicit booster tables run, the advisor still scores the expanded search terms against each candidate's normalized metadata. Name-term matches add `1.5`, description-term matches add `1.0`, and substring overlap on longer words adds `0.5`. Direct skill mentions then get a separate explicit-match bump through `_build_variants()`, which helps named skills survive mixed prompts that also contain broad terms like `opencode` or `review`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `skill_advisor.py` | Runtime | Defines `INTENT_BOOSTERS` and `MULTI_SKILL_BOOSTERS` for token-level routing evidence. |
| `skill_advisor.py` | Runtime | Applies name, corpus, substring, and explicit-variant scoring inside `analyze_request()`. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `skill_advisor_regression.py` | Regression harness | Checks that the highest-ranked recommendation still reflects the expected boosted skill. |
| `fixtures/skill_advisor_regression_cases.jsonl` | Regression dataset | Includes keyword-heavy prompts that would regress immediately if the boost tables drifted. |

---

## 4. SOURCE METADATA

- Group: Routing pipeline
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `01--routing-pipeline/03-keyword-boosting.md`
