---
title: Code Review Quick Reference
description: Lightweight index for review core doctrine and single-pass review UX guidance.
---

# Code Review Quick Reference

Lightweight index for the split review references in this skill.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Route review consumers to the correct reference file based on their intent. This file replaces the former monolithic quick reference with a split architecture: shared doctrine in `review_core.md` and interactive UX rules in `review_ux_single_pass.md`.

### Usage

Use this file as an entry index, not as the primary source of review rules. Load the specific reference that matches your mode:
- **Both modes** (single-pass and deep review): Load `review_core.md`
- **Interactive single-pass only**: Also load `review_ux_single_pass.md`
- **Deep review only**: Core doctrine is loaded via the `@deep-review` agent contract

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:reference-map -->
## 2. REFERENCE MAP

| Reference | Scope | Consumers |
|-----------|-------|-----------|
| [review_core.md](./review_core.md) | Shared doctrine: severity, evidence, findings schema, baseline+overlay precedence | `@review`, `@deep-review` |
| [review_ux_single_pass.md](./review_ux_single_pass.md) | Interactive UX: report flow, next-step prompts, PR/pre-commit guidance | `@review` only |

---

<!-- /ANCHOR:reference-map -->
<!-- ANCHOR:supporting-checklists -->
## 3. SUPPORTING CHECKLISTS

| Checklist | Purpose |
|-----------|---------|
| [security_checklist.md](./security_checklist.md) | Security, reliability, and abuse-prevention checks |
| [code_quality_checklist.md](./code_quality_checklist.md) | Non-security correctness, KISS, and DRY checks |
| [solid_checklist.md](./solid_checklist.md) | Architecture and SOLID (SRP/OCP/LSP/ISP/DIP) checks |
| [removal_plan.md](./removal_plan.md) | Safe-now versus deferred deletion planning |
| [test_quality_checklist.md](./test_quality_checklist.md) | Test quality, coverage, and anti-pattern detection |

Overlay portability: apply this baseline with `sk-code--opencode`, `sk-code--web`, or `sk-code--full-stack`.

---

<!-- /ANCHOR:supporting-checklists -->
<!-- ANCHOR:related-resources -->
## 4. RELATED RESOURCES

- [SKILL.md](../SKILL.md) - Parent skill definition with activation triggers and resource loading rules
- [review_mode_contract.yaml](../../sk-deep-research/assets/review_mode_contract.yaml) - Canonical review-mode contract manifest (source of truth for deep review taxonomy)
<!-- /ANCHOR:related-resources -->
