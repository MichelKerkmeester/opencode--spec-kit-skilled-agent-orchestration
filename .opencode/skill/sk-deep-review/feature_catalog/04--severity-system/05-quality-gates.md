---
title: "Quality gates"
description: "Prevents the review loop from stopping or passing on weak evidence, missing coverage, or unresolved blockers."
---

# Quality gates

## 1. OVERVIEW

Prevents the review loop from stopping or passing on weak evidence, missing coverage, or unresolved blockers.

The quality-gate system turns convergence from a simple score threshold into a legal-stop decision. It checks whether the review has enough evidence, enough scope coverage, and enough blocker resolution to justify a stop or a clean verdict.

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

---

## 2. CURRENT REALITY

The gate model is split across two layers. The contract-level binary gates are Evidence, Scope, and Coverage. The review-specific legal-stop bundle expands that into concrete stop checks such as dimension coverage, P0 resolution, evidence density, hotspot saturation, and claim adjudication. If any required gate fails, STOP is vetoed and the loop appends a `blocked_stop` event with the failing gates and a recovery hint.

Gate failures also affect verdicts. A quality-gate failure yields FAIL regardless of raw finding counts, and unresolved blockers or missing evidence keep the review in a non-terminal state until a later iteration repairs the packet or closes the gap.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `SKILL.md` | Skill contract | Lists the required quality guards and marks them blocking before convergence. |
| `references/convergence.md` | Protocol | Defines the legal-stop bundle, blocked-stop persistence, recovery strategies, and verdict impact. |
| `references/loop_protocol.md` | Protocol | Applies gate evaluation during the loop and before synthesis. |
| `references/state_format.md` | Schema | Defines blocked-stop records, traceability checks, and gate-sensitive registry/report fields. |
| `assets/review_mode_contract.yaml` | Contract | Declares binary quality gates, verdict conditions, and stop thresholds. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md` | Manual scenario | Verifies that failed gates block early stop. |
| `manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md` | Manual scenario | Confirms gate failures persist as blocked-stop reducer state. |
| `manual_testing_playbook/06--synthesis-save-and-guardrails/026-review-verdict-determines-post-review-workflow.md` | Manual scenario | Verifies gate outcomes shape the final verdict path. |

---

## 4. SOURCE METADATA

- Group: Severity system
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--severity-system/05-quality-gates.md`
- Primary sources: `SKILL.md`, `references/convergence.md`, `references/loop_protocol.md`, `references/state_format.md`, `assets/review_mode_contract.yaml`
