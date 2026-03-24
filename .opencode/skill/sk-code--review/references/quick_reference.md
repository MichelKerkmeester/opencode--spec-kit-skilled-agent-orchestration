---
title: Code Review Quick Reference
description: Lightweight index for review core doctrine and single-pass review UX guidance.
---

# Code Review Quick Reference

Lightweight index for the split review references in this skill.

---

## 1. REFERENCE MAP

Load the split references by intent:

- [review_core.md](./review_core.md) for shared doctrine used by both `@review` and `@deep-review`
- [review_ux_single_pass.md](./review_ux_single_pass.md) for interactive, human-facing single-pass review behavior

Use this file as an entry index, not as the primary source of review rules.

---

## 2. SUPPORTING CHECKLISTS

- [security_checklist.md](./security_checklist.md) - Security, reliability, and abuse-prevention checks
- [code_quality_checklist.md](./code_quality_checklist.md) - Non-security correctness, KISS, and DRY checks
- [solid_checklist.md](./solid_checklist.md) - Architecture and SOLID (SRP/OCP/LSP/ISP/DIP) checks
- [removal_plan.md](./removal_plan.md) - Safe-now versus deferred deletion planning
- [test_quality_checklist.md](./test_quality_checklist.md) - Test quality, coverage, and anti-pattern detection

Overlay portability: apply this baseline with `sk-code--opencode`, `sk-code--web`, or `sk-code--full-stack`.
