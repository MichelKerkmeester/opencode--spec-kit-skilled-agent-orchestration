---
title: "Feature flag governance"
description: "Feature flag governance defines operational targets for keeping the active flag surface small with explicit sunset windows and periodic audits."
---

# Feature flag governance

## 1. OVERVIEW

Feature flag governance defines operational targets for keeping the active flag surface small with explicit sunset windows and periodic audits.

Feature flags let you turn new features on or off without changing the code itself, like light switches for functionality. This governance process tracks which switches exist, who controls them and when old ones should be retired so the collection does not grow out of control.

---

## 2. CURRENT REALITY

The program introduces many new scoring signals and pipeline stages. Without governance, flags accumulate until nobody knows what is enabled.

A governance framework defines operational targets (small active flag surface, explicit sunset windows and periodic audits). These are process controls, not hard runtime-enforced caps in code.

The B8 signal ceiling ("12 active scoring signals") is a governance target, not a runtime-enforced guardrail.

**Cross-reference**: `.speckit-enforce.yaml` introduces a non-feature-flag governance control (enforcement mode: warn/block/strict) that governs spec document structural quality at commit time. See `16--tooling-and-scripts/19-pre-commit-spec-validation-gate.md` for the pre-commit hook enforcement and `18-template-compliance-contract-enforcement.md` for the full 3-layer compliance architecture.

---

## 3. SOURCE FILES

No dedicated source files. This describes governance process controls.

---

## 4. SOURCE METADATA

- Group: Governance
- Source feature title: Feature flag governance
- Current reality source: feature_catalog.md
