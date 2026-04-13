---
title: "Verdicts"
description: "Maps active findings and gate status into FAIL or CONDITIONAL or PASS."
---

# Verdicts

## 1. OVERVIEW

Maps active findings and gate status into FAIL or CONDITIONAL or PASS.

Verdicts are the final decision surface for the review loop. They tell downstream workflows whether the review found release blockers, required fixes, or only advisory items.

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

---

## 2. CURRENT REALITY

The verdict contract is stable across the skill. FAIL applies when active P0 remains or any required gate fails. CONDITIONAL applies when no P0 remains but at least one active P1 is still open. PASS applies only when active P0 and P1 are both zero, with `hasAdvisories=true` when P2 remains.

Verdicts also carry workflow routing. FAIL and CONDITIONAL both point to `/spec_kit:plan`, while PASS points to `/create:changelog`. The same contract appears in the convergence reference, state-format summary, review-mode contract, quick reference, and final report structure.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `SKILL.md` | Skill contract | Summarizes PASS, CONDITIONAL, and FAIL conditions for review mode. |
| `references/convergence.md` | Protocol | Defines verdict determination and post-verdict routing. |
| `references/state_format.md` | Schema | Defines verdict rules in JSONL and review-report semantics. |
| `assets/review_mode_contract.yaml` | Contract | Declares the canonical verdict list, conditions, and next commands. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/06--synthesis-save-and-guardrails/026-review-verdict-determines-post-review-workflow.md` | Manual scenario | Verifies verdict routing after synthesis. |
| `manual_testing_playbook/06--synthesis-save-and-guardrails/025-review-report-synthesis-has-all-9-sections.md` | Manual scenario | Confirms verdict data appears in the report contract. |

---

## 4. SOURCE METADATA

- Group: Severity system
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--severity-system/04-verdicts.md`
- Primary sources: `SKILL.md`, `references/convergence.md`, `references/state_format.md`, `assets/review_mode_contract.yaml`
