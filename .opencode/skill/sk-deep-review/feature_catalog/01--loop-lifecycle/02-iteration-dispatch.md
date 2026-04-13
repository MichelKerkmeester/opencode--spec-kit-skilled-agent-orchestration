---
title: "Iteration dispatch"
description: "Runs one fresh-context review cycle against the current focus dimension and file set."
---

# Iteration dispatch

## 1. OVERVIEW

Runs one fresh-context review cycle against the current focus dimension and file set.

This phase is the steady-state loop body. It reads the packet, summarizes the current state, dispatches the leaf review agent, and requires a new iteration file plus JSONL and strategy updates before the next convergence pass can proceed.

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

---

## 2. CURRENT REALITY

Before each dispatch, the loop reads `deep-review-state.jsonl`, `deep-review-findings-registry.json`, and `deep-review-strategy.md`, then generates a compact state summary with counts, coverage, and next-focus data. The dispatch prompt carries one focus dimension, one focus file set, applicable traceability protocols, and the canonical packet paths.

`@deep-review` stays leaf-only and read-only against the target under review. The agent is expected to perform a bounded review pass, write `review/iterations/iteration-NNN.md`, append the review iteration record to `deep-review-state.jsonl`, update strategy sections, and optionally emit traceability results and graph events. The workflow treats missing iteration output, missing JSONL fields, or missing strategy updates as iteration failures rather than best-effort success.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/loop_protocol.md` | Protocol | Defines the read-state, state-summary, dispatch, cross-reference execution, evaluation, claim-adjudication, dashboard, and loop-decision steps. |
| `references/state_format.md` | Schema | Defines the required JSONL fields, iteration file structure, graph-event payloads, and traceability-check schema. |
| `SKILL.md` | Skill contract | Declares the fresh-context model, leaf-only constraint, iteration rules, and tool-call envelope. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Workflow | Runtime workflow surface for unattended dispatch and evaluation. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Workflow | Runtime workflow surface for checkpointed dispatch with approval gates. |
| `.opencode/agent/deep-review.md` | Agent | Runtime leaf-agent contract for one review cycle. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/03--iteration-execution-and-state-discipline/008-review-iteration-reads-state-before-review.md` | Manual scenario | Verifies that each iteration reads state before auditing. |
| `manual_testing_playbook/03--iteration-execution-and-state-discipline/009-review-iteration-writes-findings-jsonl-and-strategy-update.md` | Manual scenario | Confirms iteration output, JSONL append, and strategy mutation happen together. |
| `manual_testing_playbook/03--iteration-execution-and-state-discipline/011-cross-reference-verification-detects-misalignment.md` | Manual scenario | Exercises the traceability-protocol execution path during review. |
| `manual_testing_playbook/03--iteration-execution-and-state-discipline/015-graph-events-review.md` | Manual scenario | Verifies graph event emission from review iterations. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--loop-lifecycle/02-iteration-dispatch.md`
- Primary sources: `references/loop_protocol.md`, `references/state_format.md`, `SKILL.md`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
