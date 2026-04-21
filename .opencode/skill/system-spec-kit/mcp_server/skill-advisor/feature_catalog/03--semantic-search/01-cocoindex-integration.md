---
title: "CocoIndex integration"
description: "Describes how built-in CocoIndex search results are converted into advisor score boosts."
---

# CocoIndex integration

## 1. OVERVIEW

Describes how built-in CocoIndex search results are converted into advisor score boosts.

The advisor can supplement lexical matching with semantic discovery. Instead of only counting prompt words against skill descriptions, it can ask CocoIndex for relevant code or documentation hits and fold that evidence back into routing.

---

## 2. CURRENT REALITY

Built-in semantic search starts with `_cocoindex_search_builtin()`. The advisor resolves a local `ccc` binary if one exists, falls back to `PATH` lookup, sets `COCOINDEX_CODE_ROOT_PATH`, and runs `ccc search` with a five-second timeout and a doubled result limit to leave room for parsing and deduplication. `_parse_ccc_output()` then scans both `File:` lines and content lines for `.opencode/skill/<name>/` references and converts them into normalized skill hits with capped scores.

Those hits become routing evidence through `_apply_semantic_boosts()`. The runtime maps each result path back to a known skill, multiplies the CocoIndex relevance score by `SEMANTIC_BOOST_MULTIPLIER = 3.0`, applies rank decay through `SEMANTIC_RANK_DECAY = 0.15`, and records a `!semantic(...)` reason on the candidate. The CLI also exposes `--semantic` and `--cocoindex` as equivalent force-enable flags, plus `--semantic-hits` and `--cocoindex-hits` for pre-computed JSON hits.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `skill_advisor.py` | Runtime | Resolves the CocoIndex binary, runs built-in search, parses result text, and maps paths back to skills. |
| `skill_advisor.py` | Runtime | Applies semantic boosts with score scaling, rank decay, and CLI flag support. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `skill_advisor.py` | Diagnostic CLI | Exposes `--semantic`, `--cocoindex`, and pre-computed hit flags for semantic routing checks. |
| `skill_advisor_regression.py` | Regression harness | Reuses the same `analyze_prompt()` entry point that semantic hits eventually flow through. |

---

## 4. SOURCE METADATA

- Group: Semantic search
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `03--semantic-search/01-cocoindex-integration.md`
