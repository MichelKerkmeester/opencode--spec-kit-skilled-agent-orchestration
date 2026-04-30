---
title: "Strategy tracking"
description: "Maintains the mutable review brain across fresh-context agent dispatches."
---

# Strategy tracking

## 1. OVERVIEW

Maintains the mutable review brain across fresh-context agent dispatches.

`deep-review-strategy.md` is the review loop's shared working memory. It keeps the loop pointed at uncovered dimensions and unresolved findings while preserving learned context from prior passes.

## 2. CURRENT REALITY

The strategy file carries required sections for remaining dimensions, completed dimensions, running findings, worked and failed approaches, exhausted paths, ruled-out directions, next focus, known context, cross-reference status, files under review, and review boundaries. Initialization seeds the topic, scope, and boundaries, then each iteration moves completed dimensions, updates counts and protocol status, and rewrites the next-focus anchor.

The reducer also depends on machine-owned anchors in this file. Missing anchors are treated as contract failures unless an explicit bootstrap path is used. That makes the strategy file more than a note-taking aid: it is a structured state surface that drives dispatch, blocked-stop overrides, and restart-safe recovery.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `assets/deep_review_strategy.md` | Template | Defines the full strategy scaffold, machine-owned anchors, and section semantics. |
| `references/state_format.md` | Schema | Lists the required sections and update protocol for the strategy file. |
| `references/loop_protocol.md` | Protocol | Requires the strategy file to be read before review and updated after every iteration. |
| `SKILL.md` | Skill contract | Defines one-dimension focus, exhausted-approach discipline, and next-focus updates. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/03--iteration-execution-and-state-discipline/010-strategy-next-focus-and-dimension-rotation.md` | Manual scenario | Verifies next-focus selection and dimension rotation. |
| `manual_testing_playbook/03--iteration-execution-and-state-discipline/009-review-iteration-writes-findings-jsonl-and-strategy-update.md` | Manual scenario | Checks that strategy updates accompany the iteration output. |
| `manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md` | Manual scenario | Verifies blocked-stop state can override next focus in reducer-driven summaries. |

---

## 4. SOURCE METADATA

- Group: State management
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--state-management/02-strategy-tracking.md`
- Primary sources: `assets/deep_review_strategy.md`, `references/state_format.md`, `references/loop_protocol.md`, `SKILL.md`
