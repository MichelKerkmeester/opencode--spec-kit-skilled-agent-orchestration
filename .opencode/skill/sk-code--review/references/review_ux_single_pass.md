---
title: Review UX - Single Pass
description: Interactive single-pass review behavior for human-facing review sessions.
---

# Review UX - Single Pass

Interactive behavior for a one-pass review where findings are reported first and the human chooses what happens next.

---

## 1. HUMAN INTERACTION BEHAVIOR

- Review first, implement second.
- After publishing findings, ask the user what to do next before writing code.
- Keep the prompt concrete and mode-aware; do not ask open-ended process questions unless scope is unclear.
- If no blocking findings exist, still offer explicit next-step choices instead of assuming implementation work.

Recommended next-step options:

1. Fix all findings
2. Fix `P0` and `P1` only
3. Fix selected findings
4. No implementation changes

---

## 2. REPORT FLOW

Use this flow for interactive review responses:

1. State what was reviewed and the scope source (`git diff`, staged diff, file list, or commit range).
2. Publish findings ordered by severity.
3. Summarize merge posture or risk level briefly.
4. Ask the user what to do next.

If no diff is present, report:

- What was checked
- That no diff was found
- A concrete follow-up choice: staged changes only, specific commit/range, or selected files

---

## 3. MODE-SPECIFIC PRESENTATION

Choose the lightest presentation that fits the request:

- Findings-only: list the issues with evidence and stop after the next-step prompt.
- Findings + gate recommendation: include `APPROVE`, `REQUEST_CHANGES`, or `COMMENT` after the findings.
- Findings + fix follow-up options: present the review, then offer concrete remediation choices without starting implementation automatically.

Presentation rules:

- Keep findings ahead of summary sections.
- Use plain-language impact statements.
- Distinguish optional advice clearly from required fixes.
- Acknowledge notable strengths briefly after the required findings, not before them.

---

## 4. PR AND PRE-COMMIT GUIDANCE

For PR review:

- Check for scope drift and call out unrelated changes that should be split.
- Assess contract and backward-compatibility risk for externally visible changes.
- Tie the overall recommendation to merge readiness.

For pre-commit or staged review:

- Focus on the staged diff or requested file set.
- Prioritize the fastest blocking feedback first.
- Keep remediation suggestions small and easy to apply before commit.

---

## 5. RELATED RESOURCES

- [review_core.md](./review_core.md) - Shared doctrine used by both interactive and deep review modes.
- [quick_reference.md](./quick_reference.md) - Lightweight index for the review reference set.
- [test_quality_checklist.md](./test_quality_checklist.md) - Test quality and coverage checks for changed tests.
