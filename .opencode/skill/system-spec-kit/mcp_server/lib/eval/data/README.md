---
title: "Eval Data"
description: "Ground-truth and fixture data used by eval and ablation tooling."
trigger_phrases:
  - "eval data"
  - "ground truth"
---

# Eval Data

## 1. OVERVIEW

`lib/eval/data/` stores static data files consumed by evaluation tooling.

- `ground-truth.json` - labeled query/result data used by ablation and reporting flows.

Treat this directory as data, not runtime logic.

## 2. RELATED

- `../README.md`
- `../../../../scripts/evals/README.md`
