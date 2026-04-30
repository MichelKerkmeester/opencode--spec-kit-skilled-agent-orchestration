---
title: "Five-dimension rubric"
description: "Scores candidates across structural integrity, rule coherence, integration consistency, output quality, and system fitness."
---

# Five-dimension rubric

## 1. OVERVIEW

Scores candidates across structural integrity, rule coherence, integration consistency, output quality, and system fitness.

This feature is the core grading model for sk-improve-agent. It tells the loop what "better" means before any promotion logic is considered.

---

## 2. CURRENT REALITY

The live weights are `0.20 / 0.25 / 0.25 / 0.15 / 0.15` for structural, rule coherence, integration, output quality, and system fitness. Structural checks are derived from required section presence, rule coherence checks keyword overlap against the agent's own ALWAYS and NEVER rules, integration scoring reuses the scanner with a `60 / 20 / 20` mirror-command-skill split, output quality looks for verification items and placeholder penalties, and system fitness checks permission mismatches, reference validity, and frontmatter completeness.

The dynamic scorer is lenient in one important way: missing derived checks default to full credit for that dimension instead of immediate failure. That keeps arbitrary agents scoreable, but it also means the quality of the derived profile has a direct effect on how informative the rubric becomes for a given target.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/sk-improve-agent/references/evaluator_contract.md` | Contract reference | Documents the five-dimension rubric and the benchmark rubric that sits beside it. |
| `.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs` | Scorer | Implements the five dimension functions, weights, and recommendation threshold. |
| `.opencode/skill/sk-improve-agent/scripts/generate-profile.cjs` | Profile builder | Supplies the derived structural, rule, output, integration, and mismatch checks that the rubric consumes. |
| `.opencode/skill/sk-improve-agent/assets/improvement_config.json` | Runtime config | Stores the default dimension weights and threshold delta. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/sk-improve-agent/references/quick_reference.md` | Operator reference | Restates the shipped dimension weights for the live release. |
| `.opencode/skill/sk-improve-agent/README.md` | Package reference | Mirrors the current recommendation threshold and weighted-score formula for operators. |

---

## 4. SOURCE METADATA

- Group: Scoring system
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--scoring-system/01-five-dimension-rubric.md`
