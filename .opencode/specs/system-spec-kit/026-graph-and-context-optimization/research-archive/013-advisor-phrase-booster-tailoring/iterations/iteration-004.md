# Iteration 4: Migration Design + Edge Cases

## 1. `code audit` schema-violation resolution

**Decision: Option A - keep `code audit` routed to `sk-code-review`.**

That is the semantically correct target for the bare phrase `code audit` in the advisor corpus:

- `sk-code-review` is the **baseline findings-first review** skill. Its description emphasizes stack-agnostic code review, security/correctness minimums, merge readiness, and findings-first review; its activation triggers explicitly include `audit`, `code review`, `pr review`, `quality gate`, and `merge readiness`. [SOURCE: `.opencode/skill/sk-code-review/SKILL.md:1-39`] [SOURCE: `.opencode/skill/sk-code-review/graph-metadata.json:35-76,137-138`]
- `sk-deep-review` is the **autonomous iterative review loop** skill. Its description emphasizes multi-round review, externalized state, convergence detection, release readiness, spec-folder validation, and iterative/dimension-driven review. It explicitly says **not** to use it for a simple single-pass code review. [SOURCE: `.opencode/skill/sk-deep-review/SKILL.md:1-57`] [SOURCE: `.opencode/skill/sk-deep-review/graph-metadata.json:19-58,133-139`]
- The advisor scores description corpus terms from each loaded skill record via `corpus_terms = _normalize_terms(description)`, so the semantic distinction above is part of the runtime corpus, not just human documentation. [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1150-1190,1713-1723`]

`code audit` also already aligns with the advisor's broader review normalization:

- `INTENT_NORMALIZATION_RULES["review"]` boosts `sk-code-review` on `review`, `audit`, `regression`, `findings`, `readiness`, and `vulnerability`. [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1086-1091`]
- The PHRASE table already routes `"code audit"` to `sk-code-review` with a strong phrase weight. [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:798-814`]
- Deep-review remains the right home for **looped** review phrases such as `deep review`, `review loop`, `iterative review`, `code audit loop`, and `:review:auto`. [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:883-898`]

### Runtime routing change after resolution

There should be **no user-visible routing change** for the literal phrase `code audit`.

Why:

1. `INTENT_BOOSTERS` only receives single tokens extracted by `all_tokens = re.findall(r'\b\w+\b', prompt_lower)`, so a whitespace key like `"code audit"` is unreachable there. [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1634-1666`]
2. `PHRASE_INTENT_BOOSTERS` is the only table that can match the raw multi-word substring via `if phrase in prompt_lower`. [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1674-1680`]
3. The live PHRASE target is already `sk-code-review`, so deleting the dead INTENT entry only removes conflicting source data; it does not remove an active runtime signal. [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:560,807,1634-1680`]

**Concrete Phase 2 resolution:** delete `INTENT_BOOSTERS["code audit"] = ("sk-deep-review", 1.0)` and keep `PHRASE_INTENT_BOOSTERS["code audit"] = [("sk-code-review", 2.2)]` unchanged. [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:557-561,798-814`]

## 2. Weight preservation rules for the 23 non-violation entries

The 23 non-violation entries split cleanly into:

- **6 `migrate-with-same-weight` entries**: delete the dead INTENT key and add a singleton PHRASE list with the same `(skill, weight)`.
- **17 `migrate-with-phrase-weight-kept` entries**: delete the dead INTENT key and leave the existing PHRASE list unchanged.

### 2A. `migrate-with-same-weight`

| Key | Current INTENT entry | Current PHRASE entry | Migration rule |
| --- | --- | --- | --- |
| `proposal only` | `("sk-improve-agent", 1.4)` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:545-546`] | none | `INTENT 1.4 -> PHRASE [("sk-improve-agent", 1.4)]` |
| `5d scoring` | `("sk-improve-agent", 1.8)` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:549-551`] | none | `INTENT 1.8 -> PHRASE [("sk-improve-agent", 1.8)]` |
| `integration scan` | `("sk-improve-agent", 1.6)` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:551-552`] | none | `INTENT 1.6 -> PHRASE [("sk-improve-agent", 1.6)]` |
| `dynamic profile` | `("sk-improve-agent", 1.6)` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:552-553`] | none | `INTENT 1.6 -> PHRASE [("sk-improve-agent", 1.6)]` |
| `vector search` | `("mcp-coco-index", 2.0)` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:738-744`] | none | `INTENT 2.0 -> PHRASE [("mcp-coco-index", 2.0)]` |
| `concept search` | `("mcp-coco-index", 2.0)` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:742-744`] | none | `INTENT 2.0 -> PHRASE [("mcp-coco-index", 2.0)]` |

### 2B. `migrate-with-phrase-weight-kept`

| Key | Current INTENT entry | Existing PHRASE entry kept as-is | Migration rule |
| --- | --- | --- | --- |
| `deep research` | `("sk-deep-research", 1.5)` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:536-541`] | `[("sk-deep-research", 2.5)]` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:823-830`] | delete INTENT; PHRASE unchanged |
| `research loop` | `("sk-deep-research", 1.5)` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:536-541`] | `[("sk-deep-research", 2.5)]` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:823-830`] | delete INTENT; PHRASE unchanged |
| `iterative research` | `("sk-deep-research", 1.2)` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:536-541`] | `[("sk-deep-research", 2.5)]` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:823-830`] | delete INTENT; PHRASE unchanged |
| `autonomous research` | `("sk-deep-research", 1.5)` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:536-541`] | `[("sk-deep-research", 2.5)]` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:823-830`] | delete INTENT; PHRASE unchanged |
| `agent improvement` | `("sk-improve-agent", 1.8)` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:542-556`] | `[("sk-improve-agent", 2.8)]` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:834-861`] | delete INTENT; PHRASE unchanged |
| `recursive agent` | `("sk-improve-agent", 1.8)` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:542-556`] | `[("sk-improve-agent", 2.8)]` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:834-861`] | delete INTENT; PHRASE unchanged |
| `improvement loop` | `("sk-improve-agent", 1.8)` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:542-556`] | `[("sk-improve-agent", 2.8)]` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:834-861`] | delete INTENT; PHRASE unchanged |
| `candidate scoring` | `("sk-improve-agent", 1.6)` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:547-549`] | `[("sk-improve-agent", 2.3)]` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:842-843`] | delete INTENT; PHRASE unchanged |
| `promotion gate` | `("sk-improve-agent", 1.4)` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:548-549`] | `[("sk-improve-agent", 2.0)]` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:842-843`] | delete INTENT; PHRASE unchanged |
| `evaluate agent` | `("sk-improve-agent", 1.6)` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:553-556`] | `[("sk-improve-agent", 2.6)]` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:858-861`] | delete INTENT; PHRASE unchanged |
| `score agent` | `("sk-improve-agent", 1.6)` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:553-556`] | `[("sk-improve-agent", 2.6)]` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:858-861`] | delete INTENT; PHRASE unchanged |
| `agent evaluation` | `("sk-improve-agent", 1.6)` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:553-556`] | `[("sk-improve-agent", 2.6)]` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:858-861`] | delete INTENT; PHRASE unchanged |
| `deep review` | `("sk-deep-review", 1.5)` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:557-561`] | `[("sk-deep-review", 2.5)]` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:883-888`] | delete INTENT; PHRASE unchanged |
| `review mode` | `("sk-deep-review", 1.2)` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:557-561`] | `[("sk-deep-review", 2.0)]` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:887-888`] | delete INTENT; PHRASE unchanged |
| `iterative review` | `("sk-deep-review", 1.2)` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:557-561`] | `[("sk-deep-review", 2.5)]` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:883-888`] | delete INTENT; PHRASE unchanged |
| `review loop` | `("sk-deep-review", 1.2)` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:557-561`] | `[("sk-deep-review", 2.5)]` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:883-888`] | delete INTENT; PHRASE unchanged |
| `similar code` | `("mcp-coco-index", 1.8)` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:742-744`] | `[("mcp-coco-index", 2.0)]` [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:863-870`] | delete INTENT; PHRASE unchanged |

### Non-migrating nearby entries

These are **not** part of the migration because they are still valid token keys:

- single-token or hyphenated keys such as `autoresearch`, `proposal-only`, `evaluator-first`, `5-dimension`, `cocoindex`, `semantic`, and `audit` stay where they are. [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:536,545,547,550,738-741,753`] 

## 3. Multi-skill phrase conversion rule

The exact shape rule for Phase 2 is:

1. **INTENT tuple -> PHRASE singleton list**
   - Input shape: `key: ("skill-name", weight)`
   - Output shape: `key: [("skill-name", weight)]`
   - Example: `("mcp-coco-index", 2.0)` becomes `[("mcp-coco-index", 2.0)]`.

2. **Existing PHRASE list stays a list**
   - Do **not** collapse an existing PHRASE list back to a tuple.
   - Do **not** change ordering for multi-target entries such as `"pr review"` or `"merge readiness"`; PHRASE values are always list-of-tuples, even when there is only one target. [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:799,813`]

3. **Migration algorithm**
   - If the phrase does **not** already exist in `PHRASE_INTENT_BOOSTERS`, add `key: [(skill, weight)]`.
   - If the phrase already exists for the **same** skill, delete the INTENT entry and keep the existing PHRASE list unchanged.
   - If the phrase already exists for a **different** skill, treat it as a schema violation and resolve the target first (`code audit` was the only current case). [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:560,807`]

This rule matches the scoring loop exactly: token lookups expect a tuple from `INTENT_BOOSTERS[token]`, while phrase lookups expect an iterable list from `for skill, boost in boosts`. [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1659-1677`]

## 4. Anti-pattern documentation block to add near `PHRASE_INTENT_BOOSTERS`

```python
# NOTE: INTENT_BOOSTERS only matches single tokens extracted from the prompt via
# `all_tokens = re.findall(r'\b\w+\b', prompt_lower)` in analyze_request().
# PHRASE_INTENT_BOOSTERS matches against the raw prompt text via
# `if phrase in prompt_lower`, so it is the correct home for multi-word phrases.
# NEVER add keys containing spaces to INTENT_BOOSTERS: they are dead code and
# will never match at runtime. When in doubt, put any multi-token trigger in
# PHRASE_INTENT_BOOSTERS, even if it only targets one skill.
```

Why this exact wording:

- It names the tokenizer contract directly (`re.findall(...)`). [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1634-1635`]
- It names the phrase matcher directly (`if phrase in prompt_lower`). [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1674-1677`]
- It explains the failure mode that created the 24-key dead-code inventory from Iteration 1. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-advisor-phrase-booster-tailoring/research/iterations/iteration-001.md:13-18,54-70`]

## 5. Ordered migration script for Phase 2

### 1. Add the anti-pattern guard comment above `PHRASE_INTENT_BOOSTERS`

- **Action:** `modify-PHRASE`
- **Target location:** `skill_advisor.py`, around `788-789`
- **Old content:**

```python
PHRASE_INTENT_BOOSTERS = {
```

- **New content:**

```python
# NOTE: INTENT_BOOSTERS only matches single tokens extracted from the prompt via
# `all_tokens = re.findall(r'\b\w+\b', prompt_lower)` in analyze_request().
# PHRASE_INTENT_BOOSTERS matches against the raw prompt text via
# `if phrase in prompt_lower`, so it is the correct home for multi-word phrases.
# NEVER add keys containing spaces to INTENT_BOOSTERS: they are dead code and
# will never match at runtime. When in doubt, put any multi-token trigger in
# PHRASE_INTENT_BOOSTERS, even if it only targets one skill.
PHRASE_INTENT_BOOSTERS = {
```

- **Verification:** `rg -n 'NEVER add keys containing spaces to INTENT_BOOSTERS|PHRASE_INTENT_BOOSTERS = \{' .opencode/skill/skill-advisor/scripts/skill_advisor.py`

### 2. Delete the dead deep-research multi-word INTENT keys

- **Action:** `delete-from-INTENT`
- **Target location:** `skill_advisor.py`, around `536-541`
- **Old content:**

```python
"deep research": ("sk-deep-research", 1.5),
"research loop": ("sk-deep-research", 1.5),
"iterative research": ("sk-deep-research", 1.2),
"autonomous research": ("sk-deep-research", 1.5),
```

- **New content:**

```python
"autoresearch": ("sk-deep-research", 2.0),
"convergence": ("sk-deep-research", 0.8),
```

- **Verification:** `rg -n '"deep research"|"research loop"|"iterative research"|"autonomous research"' .opencode/skill/skill-advisor/scripts/skill_advisor.py` *(after patch, hits should remain only in the PHRASE section around `824-830`)*.

### 3. Delete the dead improve-agent multi-word INTENT keys

- **Action:** `delete-from-INTENT`
- **Target location:** `skill_advisor.py`, around `542-556`
- **Old content:**

```python
"agent improvement": ("sk-improve-agent", 1.8),
"recursive agent": ("sk-improve-agent", 1.8),
"improvement loop": ("sk-improve-agent", 1.8),
"proposal only": ("sk-improve-agent", 1.4),
"candidate scoring": ("sk-improve-agent", 1.6),
"promotion gate": ("sk-improve-agent", 1.4),
"5d scoring": ("sk-improve-agent", 1.8),
"integration scan": ("sk-improve-agent", 1.6),
"dynamic profile": ("sk-improve-agent", 1.6),
"evaluate agent": ("sk-improve-agent", 1.6),
"score agent": ("sk-improve-agent", 1.6),
"agent evaluation": ("sk-improve-agent", 1.6),
```

- **New content:**

```python
"proposal-only": ("sk-improve-agent", 1.4),
"evaluator-first": ("sk-improve-agent", 1.5),
"5-dimension": ("sk-improve-agent", 1.8),
```

- **Verification:** `rg -n '"agent improvement"|"recursive agent"|"improvement loop"|"proposal only"|"candidate scoring"|"promotion gate"|"5d scoring"|"integration scan"|"dynamic profile"|"evaluate agent"|"score agent"|"agent evaluation"' .opencode/skill/skill-advisor/scripts/skill_advisor.py` *(after patch, hits should be PHRASE-only for the migrated keys, plus the untouched hyphenated token keys `proposal-only` and `5-dimension` in INTENT)*.

### 4. Add the four same-weight improve-agent PHRASE entries

- **Action:** `add-to-PHRASE`
- **Target location:** `skill_advisor.py`, improve-agent PHRASE cluster around `838-853`
- **Old content:**

```python
"proposal-only improvement": [("sk-improve-agent", 2.6)],
"proposal only improvement": [("sk-improve-agent", 2.6)],
"evaluator-first": [("sk-improve-agent", 2.4)],
"bounded mutator": [("sk-improve-agent", 2.2)],
"candidate scoring": [("sk-improve-agent", 2.3)],
"promotion gate": [("sk-improve-agent", 2.0)],
"handover target": [("sk-improve-agent", 2.0)],
"5-dimension evaluation": [("sk-improve-agent", 2.8)],
"5d agent scoring": [("sk-improve-agent", 2.8)],
"integration scanning": [("sk-improve-agent", 2.6)],
"dynamic profiling": [("sk-improve-agent", 2.6)],
```

- **New content:**

```python
"proposal-only improvement": [("sk-improve-agent", 2.6)],
"proposal only improvement": [("sk-improve-agent", 2.6)],
"proposal only": [("sk-improve-agent", 1.4)],
"evaluator-first": [("sk-improve-agent", 2.4)],
"bounded mutator": [("sk-improve-agent", 2.2)],
"candidate scoring": [("sk-improve-agent", 2.3)],
"promotion gate": [("sk-improve-agent", 2.0)],
"handover target": [("sk-improve-agent", 2.0)],
"5-dimension evaluation": [("sk-improve-agent", 2.8)],
"5d agent scoring": [("sk-improve-agent", 2.8)],
"5d scoring": [("sk-improve-agent", 1.8)],
"integration scanning": [("sk-improve-agent", 2.6)],
"integration scan": [("sk-improve-agent", 1.6)],
"dynamic profiling": [("sk-improve-agent", 2.6)],
"dynamic profile": [("sk-improve-agent", 1.6)],
```

- **Verification:** `rg -n '"proposal only"|"5d scoring"|"integration scan"|"dynamic profile"' .opencode/skill/skill-advisor/scripts/skill_advisor.py`

### 5. Delete the dead deep-review INTENT keys and resolve the `code audit` conflict

- **Action:** `delete-from-INTENT`
- **Target location:** `skill_advisor.py`, around `557-561`
- **Old content:**

```python
"deep review": ("sk-deep-review", 1.5),
"review mode": ("sk-deep-review", 1.2),
"iterative review": ("sk-deep-review", 1.2),
"code audit": ("sk-deep-review", 1.0),
"review loop": ("sk-deep-review", 1.2),
```

- **New content:**

```python
# all five multi-word entries removed; PHRASE table remains the single source of truth
# for deep-review loop phrases and for `code audit -> sk-code-review`
```

- **Verification:** `rg -n '"deep review"|"review mode"|"iterative review"|"code audit"|"review loop"' .opencode/skill/skill-advisor/scripts/skill_advisor.py` *(after patch, `code audit` should only appear in the review PHRASE cluster, and the loop phrases should only appear in the deep-review PHRASE cluster)*.

### 6. Delete the dead CocoIndex multi-word INTENT keys

- **Action:** `delete-from-INTENT`
- **Target location:** `skill_advisor.py`, around `742-744`
- **Old content:**

```python
"vector search": ("mcp-coco-index", 2.0),
"similar code": ("mcp-coco-index", 1.8),
"concept search": ("mcp-coco-index", 2.0),
```

- **New content:**

```python
"semantic": ("mcp-coco-index", 1.5),
"discover": ("mcp-coco-index", 0.6),
"implementation": ("mcp-coco-index", 0.5),
```

- **Verification:** `rg -n '"vector search"|"similar code"|"concept search"' .opencode/skill/skill-advisor/scripts/skill_advisor.py` *(after patch, `similar code` should remain in PHRASE, and `vector search` / `concept search` should move there)*.

### 7. Add the two same-weight CocoIndex PHRASE entries

- **Action:** `add-to-PHRASE`
- **Target location:** `skill_advisor.py`, CocoIndex PHRASE cluster around `863-872`
- **Old content:**

```python
"semantic search": [("mcp-coco-index", 2.5)],
"code search": [("mcp-coco-index", 2.0)],
"cocoindex search": [("mcp-coco-index", 2.8)],
"coco index": [("mcp-coco-index", 2.5)],
"find implementation": [("mcp-coco-index", 1.5)],
"find usage": [("mcp-coco-index", 1.2)],
"find code that": [("mcp-coco-index", 1.8)],
"similar code": [("mcp-coco-index", 2.0)],
```

- **New content:**

```python
"semantic search": [("mcp-coco-index", 2.5)],
"code search": [("mcp-coco-index", 2.0)],
"vector search": [("mcp-coco-index", 2.0)],
"concept search": [("mcp-coco-index", 2.0)],
"cocoindex search": [("mcp-coco-index", 2.8)],
"coco index": [("mcp-coco-index", 2.5)],
"find implementation": [("mcp-coco-index", 1.5)],
"find usage": [("mcp-coco-index", 1.2)],
"find code that": [("mcp-coco-index", 1.8)],
"similar code": [("mcp-coco-index", 2.0)],
```

- **Verification:** `rg -n '"vector search"|"concept search"|"similar code"' .opencode/skill/skill-advisor/scripts/skill_advisor.py`

### 8. Add the new system-spec-kit PHRASE entries

- **Action:** `add-to-PHRASE`
- **Target location:** `skill_advisor.py`, system-spec-kit/save cluster around `793-822`
- **Old content:**

```python
"save context": [("system-spec-kit", 1.0)],
"save memory": [("system-spec-kit", 1.0)],
"save this context": [("system-spec-kit", 1.0)],
"save conversation": [("system-spec-kit", 1.0)],
"save this conversation context": [("system-spec-kit", 1.0)],
...
"template level validation": [("system-spec-kit", 0.8)],
```

- **New content:**

```python
"save context": [("system-spec-kit", 1.0)],
"save memory": [("system-spec-kit", 1.0)],
"save this context": [("system-spec-kit", 1.0)],
"save conversation": [("system-spec-kit", 1.0)],
"save conversation context": [("system-spec-kit", 1.0)],
"save this conversation context": [("system-spec-kit", 1.0)],
...
"template level validation": [("system-spec-kit", 0.8)],
"spec folder workflow": [("system-spec-kit", 1.8)],
"resume prior session context": [("system-spec-kit", 1.8)],
"validate spec packet": [("system-spec-kit", 1.6)],
"constitutional memory": [("system-spec-kit", 1.7)],
```

- **Verification:** `rg -n '"save conversation context"|"spec folder workflow"|"resume prior session context"|"validate spec packet"|"constitutional memory"' .opencode/skill/skill-advisor/scripts/skill_advisor.py`

### 9. Add the new review PHRASE entry

- **Action:** `add-to-PHRASE`
- **Target location:** `skill_advisor.py`, review PHRASE cluster around `803-804`
- **Old content:**

```python
"quality gate": [("sk-code-review", 2.0)],
"request changes": [("sk-code-review", 2.0)],
```

- **New content:**

```python
"quality gate": [("sk-code-review", 2.0)],
"quality gate validation": [("sk-code-review", 1.8)],
"request changes": [("sk-code-review", 2.0)],
```

- **Verification:** `rg -n '"quality gate"|"quality gate validation"' .opencode/skill/skill-advisor/scripts/skill_advisor.py`

### 10. Add the new web and code-mode PHRASE entries

- **Action:** `add-to-PHRASE`
- **Target location:** `skill_advisor.py`, web/tooling PHRASE cluster around `815-822`
- **Old content:**

```python
"implement feature": [("sk-code-web", 0.9)],
"responsive css": [("sk-code-web", 1.2)],
"responsive css layout": [("sk-code-web", 1.4)],
"responsive css layout fix": [("sk-code-web", 2.2)],
"layout fix": [("sk-code-web", 1.0)],
"css animation": [("sk-code-web", 0.8)],
"api network": [("sk-code-web", 0.7), ("mcp-chrome-devtools", 0.4)],
"template level validation": [("system-spec-kit", 0.8)],
```

- **New content:**

```python
"implement feature": [("sk-code-web", 0.9)],
"responsive css": [("sk-code-web", 1.2)],
"responsive css layout": [("sk-code-web", 1.4)],
"responsive css layout fix": [("sk-code-web", 2.2)],
"layout fix": [("sk-code-web", 1.0)],
"browser verification checklist": [("sk-code-web", 1.6)],
"css animation": [("sk-code-web", 0.8)],
"api network": [("sk-code-web", 0.7), ("mcp-chrome-devtools", 0.4)],
"webflow deployment guidance": [("sk-code-web", 1.8)],
"external tool integration via code mode": [("mcp-code-mode", 2.0)],
"template level validation": [("system-spec-kit", 0.8)],
```

- **Verification:** `rg -n '"browser verification checklist"|"webflow deployment guidance"|"external tool integration via code mode"' .opencode/skill/skill-advisor/scripts/skill_advisor.py`

### 11. Add the new sk-code-opencode and sk-code-full-stack PHRASE entries

- **Action:** `add-to-PHRASE`
- **Target location:** `skill_advisor.py`, overlay PHRASE cluster around `899-900`
- **Old content:**

```python
"figma css": [("mcp-figma", 0.8), ("sk-code-web", 0.4)],
"full stack typescript": [("sk-code-opencode", 0.8)],
"sk-code-review": [("sk-code-review", 2.8)],
```

- **New content:**

```python
"figma css": [("mcp-figma", 0.8), ("sk-code-web", 0.4)],
"mcp server code": [("sk-code-opencode", 1.8)],
"system code style guidance": [("sk-code-opencode", 1.7)],
"python shell json standards": [("sk-code-opencode", 1.9)],
"full stack development workflow": [("sk-code-full-stack", 2.1)],
"implementation testing verification flow": [("sk-code-full-stack", 1.8)],
"detect project stack automatically": [("sk-code-full-stack", 1.6)],
"full stack typescript": [("sk-code-opencode", 0.8)],
"sk-code-review": [("sk-code-review", 2.8)],
```

- **Verification:** `rg -n '"mcp server code"|"system code style guidance"|"python shell json standards"|"full stack development workflow"|"implementation testing verification flow"|"detect project stack automatically"|"full stack typescript"' .opencode/skill/skill-advisor/scripts/skill_advisor.py`

## 6. Hidden callsite check

I checked the entire advisor codebase for direct `INTENT_BOOSTERS[...]` lookups and any iteration over the dict:

```bash
rg -n 'INTENT_BOOSTERS\[|for\s+\w+\s+in\s+INTENT_BOOSTERS|INTENT_BOOSTERS\.items|PHRASE_INTENT_BOOSTERS\[|for\s+phrase,\s+boosts\s+in\s+PHRASE_INTENT_BOOSTERS' .opencode/skill/skill-advisor
```

Observed result:

- `INTENT_BOOSTERS` is only consumed in `analyze_request()` at `skill_advisor.py:1660-1666`.
- `PHRASE_INTENT_BOOSTERS` is only iterated in `analyze_request()` at `skill_advisor.py:1674-1680`.
- No other files in `.opencode/skill/skill-advisor` directly index or iterate these dicts.

That means deleting the 24 multi-word INTENT keys does **not** break any hidden callsite contract; it only changes the data available to the single analyzer loop, and for whitespace keys those entries are already unreachable there. [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1634-1680`] [SOURCE: `rg 'INTENT_BOOSTERS\\[|...|for\\s+phrase,\\s+boosts\\s+in\\s+PHRASE_INTENT_BOOSTERS' .opencode/skill/skill-advisor` run on 2026-04-15 in repo root; only hits were `skill_advisor.py:1660` and `skill_advisor.py:1674`]

## Strategy Updates

### New Findings to Propagate

- The `code audit` schema violation is fully resolved: **keep `sk-code-review`** as the target and delete the dead INTENT declaration. The current PHRASE route is already the semantically correct runtime source of truth. [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:560,807,1634-1680`]
- Phase 2 can be implemented as a **data-only migration** in `skill_advisor.py`: one guard comment, four INTENT deletion clusters, and seven PHRASE insertion clusters. No caller code changes are required. [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1634-1680`] [SOURCE: `rg 'INTENT_BOOSTERS\\[|...|PHRASE_INTENT_BOOSTERS' .opencode/skill/skill-advisor` run on 2026-04-15]
- The tuple-to-list conversion rule is exact and simple: any migrated single-target INTENT entry becomes a singleton PHRASE list `[(skill, weight)]`; existing PHRASE lists are preserved unchanged. [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:1659-1677`]
- All 15 Iteration 3 candidate additions fit cleanly into existing PHRASE clusters without requiring score-formula or tokenizer changes. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-advisor-phrase-booster-tailoring/research/iterations/iteration-003.md:45-95`] [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:798-900`]

### Updated Next Focus

Iteration 5: regression coverage + risk analysis + new fixture cases.

Recommended concrete scope:

1. Add literal regression fixtures for `code audit`, `proposal only`, `5d scoring`, `integration scan`, `dynamic profile`, `vector search`, and `concept search`.
2. Add regression fixtures for the 15 new PHRASE candidates, prioritizing `system-spec-kit`, `sk-code-opencode`, `sk-code-full-stack`, `sk-code-web`, and `mcp-code-mode`.
3. Re-run the 44-case baseline plus the new phrase fixtures and report top-1 accuracy / confidence deltas.
4. Call out any phrase-overlap risk cases explicitly, but keep the Phase 2 migration itself weight-stable unless a new fixture proves a regression.

## Convergence Signal

- **newInfoRatio:** `0.24`
- **stuckIndicator:** `no` - this pass resolved the only schema violation, specified all 23 migration rules, defined the tuple-to-list conversion contract, and produced an ordered implementation script.
- **migrationFullySpecified:** `yes`
