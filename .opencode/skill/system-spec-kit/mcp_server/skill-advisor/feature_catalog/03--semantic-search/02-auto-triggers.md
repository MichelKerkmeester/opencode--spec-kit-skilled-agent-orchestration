---
title: "Auto triggers"
description: "Describes the heuristics that automatically activate semantic search for discovery-style prompts."
---

# Auto triggers

## 1. OVERVIEW

Describes the heuristics that automatically activate semantic search for discovery-style prompts.

Semantic search is most useful when the prompt is about finding implementations or understanding behavior by concept. This feature decides when the advisor should make that jump automatically instead of waiting for an explicit flag.

---

## 2. CURRENT REALITY

`should_auto_use_semantic_search()` is the gatekeeper for automatic activation. It immediately refuses empty prompts, exact-match or regex-style requests, and environments where no `ccc` binary can be resolved. For eligible prompts, it checks two trigger families: direct phrase matches such as `find code that`, `how does`, `implementation of`, and `where is the logic`, or a token-intersection rule that requires both a discovery verb (`find`, `how`, `search`, `semantic`, `where`) and a code-intent token such as `auth`, `implementation`, `logic`, `middleware`, or `pattern`.

When this gate returns true, `analyze_request()` gives `mcp-coco-index` an immediate `+1.8` intent boost even before any semantic hits are blended in. The single-prompt and batch entry points also honor the same logic, so auto-triggered semantic search behaves consistently whether the advisor is analyzing one request, a batch file, or stdin.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `skill_advisor.py` | Runtime | Defines exact-match guards, automatic trigger phrases, and token-based semantic activation rules. |
| `skill_advisor.py` | Runtime | Promotes `mcp-coco-index` and triggers built-in semantic search in both single and batch flows. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `skill_advisor_regression.py` | Regression harness | Validates that discovery-style prompts continue to route toward the expected semantic surface. |
| `fixtures/skill_advisor_regression_cases.jsonl` | Regression dataset | Contains semantic-search routing prompts that depend on the auto-trigger rules staying stable. |

---

## 4. SOURCE METADATA

- Group: Semantic search
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `03--semantic-search/02-auto-triggers.md`
