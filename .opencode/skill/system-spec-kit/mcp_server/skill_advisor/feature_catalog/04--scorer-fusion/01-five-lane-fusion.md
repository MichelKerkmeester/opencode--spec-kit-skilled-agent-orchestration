---
title: "Five-Lane Analytical Fusion"
description: "Analytical fusion of 5 lanes (explicit_author 0.45, lexical 0.30, graph_causal 0.15, derived_generated 0.10, semantic_shadow 0.00) that produces the live routing score."
trigger_phrases:
  - "five lane fusion"
  - "lane weights canonical"
  - "fusion scorer"
  - "advisor analytical fusion"
---

# Five-Lane Analytical Fusion

## TABLE OF CONTENTS

- [1. PURPOSE](#1-purpose)
- [2. CURRENT REALITY](#2-current-reality)
- [3. SOURCE FILES](#3-source-files)
- [4. TEST COVERAGE](#4-test-coverage)
- [5. RELATED](#5-related)

---

## 1. PURPOSE

Combine evidence from five independent lanes into a single routing score with documented, auditable weights.

---

## 2. CURRENT REALITY

`lib/scorer/fusion.ts` fuses five lanes using the canonical weights below. Each lane runs independently and writes `{ lane, rawScore, weight, weightedScore, shadowOnly }` metadata that the attribution path consumes.

| Lane | Weight | Source |
| --- | --- | --- |
| `explicit_author` | 0.45 | Author-declared signals via `intent_signals`, trigger_phrases, and explicit mentions. |
| `lexical` | 0.30 | Token overlap weighted by IDF from the active corpus. |
| `graph_causal` | 0.15 | Graph-edge evidence projected through skill_nodes and skill_edges. |
| `derived_generated` | 0.10 | Auto-extracted derived entries under trust-lane control. |
| `semantic_shadow` | 0.00 | Semantic similarity (shadow-only; live weight is hardcoded at 0). |

Weight configuration is exposed via `advisor_status.laneWeights`.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/weights-config.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/derived.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/semantic-shadow.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` — fusion arithmetic and lane weights.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-status.vitest.ts` — `laneWeights` exposure.
- Playbook scenario [SC-001](../../manual_testing_playbook/08--scorer-fusion/001-five-lane-fusion.md).

---

## 5. RELATED

- [02-projection.md](./02-projection.md).
- [04-attribution.md](./04-attribution.md).
