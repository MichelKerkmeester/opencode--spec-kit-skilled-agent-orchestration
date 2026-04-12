---
title: "Enrichment"
description: "Passive response enrichment with bounded latency and token budgets."
trigger_phrases:
  - "passive enrichment"
  - "response enrichment"
---

# Enrichment

## 1. OVERVIEW

`lib/enrichment/` currently contains `passive-enrichment.ts`, which adds bounded post-processing hints to responses.

The enrichment path can attach nearby code-graph symbols and degraded-continuity warnings, while staying inside a latency deadline and token budget.

## 2. RELATED

- `../code-graph/README.md`
- `../response/README.md`
