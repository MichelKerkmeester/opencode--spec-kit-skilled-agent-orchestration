---
title: Review Core Doctrine
description: Shared findings-first review doctrine for both single-pass and deep-review workflows.
---

# Review Core Doctrine

Shared doctrine consumed by both `@review` and `@deep-review`.

---

## 1. SEVERITY DEFINITIONS

| Level | Meaning | Handling |
| --- | --- | --- |
| P0 | Blocker: exploitable security issue, auth bypass, destructive data loss | Block merge |
| P1 | Required: correctness bug, spec mismatch, must-fix gate issue | Fix before merge |
| P2 | Suggestion: non-blocking improvement, documentation polish, style or maintainability follow-up | Optional or schedule follow-up |

Escalation rule: if confidence is low but impact is high, classify toward the higher severity and state the uncertainty explicitly.

---

## 2. EVIDENCE REQUIREMENTS

- Every `P0` and `P1` finding must include a concrete `file:line` citation.
- Evidence must tie the finding to observed code behavior, not just a general concern.
- `P2` findings should still include specific evidence when available, even if impact is advisory.
- If evidence is incomplete, state the assumption and why the risk still matters.

---

## 3. FINDINGS OUTPUT ORDERING

- Present findings before summary or praise sections.
- Order findings by severity first: `P0`, then `P1`, then `P2`.
- Keep ordering stable within a severity bucket by impact and confidence.
- Separate required fixes from optional suggestions so merge decisions stay clear.

---

## 4. BASELINE + OVERLAY PRECEDENCE

Apply this skill as the baseline first, then pair it with exactly one overlay:

- OpenCode system code -> `sk-code--opencode`
- Frontend/web code -> `sk-code--web`
- Default/other stacks -> `sk-code--full-stack`

Precedence rules:

- Baseline security and correctness minimums are always enforced.
- Overlay style, process, build, and test conventions override generic baseline guidance.
- Unclear conflicts must be escalated rather than guessed.

---

## 5. BASELINE CHECK FAMILIES

Mandatory baseline families:

- Correctness minimums: regression risk, contract safety, spec mismatch, destructive side effects, and boundary handling.
- Security minimums: auth and authorization gaps, injection exposure, unsafe secrets handling, privilege misuse, and reliability risks with security impact.

These minimums cannot be relaxed by an overlay.

---

## 6. FINDING SCHEMA

Each finding should provide:

| Field | Requirement |
| --- | --- |
| `id` | Stable label within the review report, such as `P1-001` |
| `severity` | One of `P0`, `P1`, `P2` |
| `title` | Short, risk-oriented summary |
| `file` | Primary `path:line` location |
| `evidence` | Plain-language explanation tied to observed code |
| `recommendation` | Specific, scope-proportional fix or follow-up |

Suggested shape:

```markdown
### P1-001 [P1] Missing authorization check
- File: path/to/file.ts:42
- Evidence: Request handling reaches the write path before role validation.
- Recommendation: Enforce the existing permission guard before mutation.
```

---

## 7. RELATED RESOURCES

- [review_ux_single_pass.md](./review_ux_single_pass.md) - Interactive single-pass report flow and next-step prompts.
- [quick_reference.md](./quick_reference.md) - Lightweight index across baseline review references.
- [security_checklist.md](./security_checklist.md) - Security and reliability checks.
- [code_quality_checklist.md](./code_quality_checklist.md) - Correctness, KISS, DRY, and maintainability checks.
